import "dotenv/config";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

type Manifest = Record<string, string>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(
  projectRoot,
  "public",
  "mediaNew",
  "cottages-basic-info",
);
const manifestPath = path.join(projectRoot, "prisma", "cottage-image-manifest.json");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const blobHostSuffix = ".public.blob.vercel-storage.com";

const cottageSlugsByDirectory: Record<string, string> = {
  "Big cottage": "big-cottage-with-a-view-to-the-river",
  "Big cottage 2": "big-cottage",
  "Small cottage": "small-cottage-with-a-view-to-the-river",
  "Small cottage fishing":
    "small-cottage-with-a-view-to-the-river-with-fishing-access",
  "Standard cottage jacuzzi": "standard-cottage-with-a-jacuzzi",
};

const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

const naturalCompare = (a: string, b: string) => collator.compare(a, b);

const isHiddenPath = (relativePath: string) =>
  relativePath.split(path.sep).some((segment) => segment.startsWith("."));

const normalizeLocalMediaUrl = (directory: string, fileName: string) =>
  encodeURI(`/mediaNew/cottages-basic-info/${directory}/${fileName}`);

const sanitizeFileStem = (fileName: string) => {
  const parsed = path.parse(fileName);
  const stem = parsed.name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return stem || "image";
};

const buildBlobPathname = (houseSlug: string, fileName: string, bytes: Buffer) => {
  const extension = path.extname(fileName).toLowerCase();
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  return `houses/${houseSlug}/${hash}-${sanitizeFileStem(fileName)}${extension}`;
};

const isBlobUrl = (value: string) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(blobHostSuffix) &&
      url.pathname.startsWith("/houses/")
    );
  } catch {
    return false;
  }
};

const loadManifest = async (): Promise<Manifest> => {
  try {
    const parsed = JSON.parse(await fs.readFile(manifestPath, "utf8")) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Manifest must be an object.");
    }

    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw error;
  }
};

const writeManifest = async (manifest: Manifest) => {
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => naturalCompare(a, b)),
  );
  await fs.writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);
};

type SourceImage = {
  directory: string;
  fileName: string;
  absolutePath: string;
  localUrl: string;
  houseSlug: string;
  isMainPic: boolean;
};

const scanSourceImages = async () => {
  const directoryEntries = await fs.readdir(sourceRoot, { withFileTypes: true });
  const directories = directoryEntries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort(naturalCompare);

  const images: SourceImage[] = [];

  for (const directory of directories) {
    const houseSlug = cottageSlugsByDirectory[directory];
    if (!houseSlug) {
      throw new Error(
        `No house slug mapping exists for source cottage directory "${directory}".`,
      );
    }

    const files = (await fs.readdir(path.join(sourceRoot, directory), {
      withFileTypes: true,
    }))
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => {
        const relativePath = path.join(directory, fileName);
        if (isHiddenPath(relativePath)) return false;
        return supportedExtensions.has(path.extname(fileName).toLowerCase());
      })
      .sort((a, b) => {
        const aMain = path.parse(a).name.toLowerCase() === "mainpic";
        const bMain = path.parse(b).name.toLowerCase() === "mainpic";
        if (aMain !== bMain) return aMain ? -1 : 1;
        return naturalCompare(a, b);
      });

    for (const fileName of files) {
      images.push({
        directory,
        fileName,
        absolutePath: path.join(sourceRoot, directory, fileName),
        localUrl: normalizeLocalMediaUrl(directory, fileName),
        houseSlug,
        isMainPic: path.parse(fileName).name.toLowerCase() === "mainpic",
      });
    }
  }

  return images;
};

const updateDatabaseImageUrls = async (manifest: Manifest) => {
  if (!process.env.DATABASE_URL) {
    return { skipped: true, updated: 0 };
  }

  const prisma = new PrismaClient();
  try {
    const localImages = await prisma.houseImage.findMany({
      where: {
        url: {
          startsWith: "/mediaNew/cottages-basic-info/",
        },
      },
      select: { id: true, url: true },
    });

    const updates = localImages
      .map((image) => ({ id: image.id, blobUrl: manifest[image.url] }))
      .filter((image): image is { id: string; blobUrl: string } =>
        Boolean(image.blobUrl),
      );

    await prisma.$transaction(
      updates.map((image) =>
        prisma.houseImage.update({
          where: { id: image.id },
          data: { url: image.blobUrl },
        }),
      ),
    );

    return { skipped: false, updated: updates.length };
  } finally {
    await prisma.$disconnect();
  }
};

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for cottage image upload.");
  }

  const sourceImages = await scanSourceImages();
  const manifest = await loadManifest();
  let uploaded = 0;
  let skipped = 0;
  let blobHostname: string | null = null;

  for (const image of sourceImages) {
    const existingUrl = manifest[image.localUrl];
    if (existingUrl && isBlobUrl(existingUrl)) {
      skipped += 1;
      blobHostname = blobHostname ?? new URL(existingUrl).hostname;
      continue;
    }

    const bytes = await fs.readFile(image.absolutePath);
    const pathname = buildBlobPathname(image.houseSlug, image.fileName, bytes);
    const result = await put(pathname, bytes, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    });

    manifest[image.localUrl] = result.url;
    blobHostname = blobHostname ?? new URL(result.url).hostname;
    uploaded += 1;
  }

  await writeManifest(manifest);
  const database = await updateDatabaseImageUrls(manifest);

  const missingManifestEntries = sourceImages.filter(
    (image) => !isBlobUrl(manifest[image.localUrl] ?? ""),
  );
  if (missingManifestEntries.length) {
    throw new Error(
      `Upload finished with ${missingManifestEntries.length} missing manifest entries.`,
    );
  }

  console.log(
    JSON.stringify(
      {
        localImagesFound: sourceImages.length,
        uploaded,
        skippedAlreadyMigrated: skipped,
        manifestEntries: Object.keys(manifest).length,
        blobHostname,
        databaseUpdated: database.updated,
        databaseUpdateSkipped: database.skipped,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
