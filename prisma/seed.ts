import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HouseStatus, HouseType, PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../lib/security/password";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const useLocalCottageMedia = process.env.USE_LOCAL_COTTAGE_MEDIA === "true";

type CottageImageManifest = Record<string, string>;

const loadCottageImageManifest = () => {
  if (useLocalCottageMedia) return {};

  const manifestPath = path.join(__dirname, "cottage-image-manifest.json");
  try {
    const parsed = JSON.parse(
      readFileSync(manifestPath, "utf8"),
    ) as CottageImageManifest;
    return parsed;
  } catch (error) {
    throw new Error(
      `Unable to load ${manifestPath}. Run pnpm blob:upload-cottages before seeding, or set USE_LOCAL_COTTAGE_MEDIA=true for explicit local development mode.`,
      { cause: error },
    );
  }
};

const cottageImageManifest = loadCottageImageManifest();

const amenities = [
  { slug: "mini-golf", label: "Mini Golf", icon: "flag" },
  { slug: "kid-zone", label: "Kid Zone", icon: "sparkles" },
  { slug: "bonfire-arena", label: "Bonfire Arena", icon: "flame" },
  { slug: "open-air-cinema", label: "Open-air cinema", icon: "film" },
  { slug: "fishing-access", label: "Fishing access", icon: "waves" },
  { slug: "jacuzzi", label: "Jacuzzi", icon: "waves" },
];

const mediaUrl = (directory: string, fileName: string) =>
  encodeURI(`/mediaNew/cottages-basic-info/${directory}/${fileName}`);

const resolveCottageImageUrl = (directory: string, fileName: string) => {
  const localUrl = mediaUrl(directory, fileName);
  if (useLocalCottageMedia) return localUrl;

  const blobUrl = cottageImageManifest[localUrl];
  if (!blobUrl) {
    throw new Error(
      `Missing Blob URL for required cottage image "${localUrl}" in prisma/cottage-image-manifest.json.`,
    );
  }

  return blobUrl;
};

const imageUrls = (directory: string, fileNames: string[]) =>
  fileNames.map((fileName) => resolveCottageImageUrl(directory, fileName));

const text = {
  en: {
    bigRiverShort:
      "A big cottage for up to 10 guests, presented with the client-provided river-view name.",
    bigRiverDescription:
      "Big cottage with a view to the river is a private Aygoot cottage in Dilijan for groups of up to 10 guests. The catalogue information provides separate Workdays and Weekdays prices; bedroom count, bathroom count, and exact location are not specified in the source.",
    bigShort:
      "A big cottage for up to 10 guests with activity features listed by the client.",
    bigDescription:
      "Big cottage is a private Aygoot cottage in Dilijan for groups of up to 10 guests. The source specifically lists Mini Golf, Kid Zone, Bonfire Arena, and Open-air cinema, with separate Workdays and Weekdays prices.",
    smallRiverShort:
      "A small cottage for 4 guests, presented with the client-provided river-view name.",
    smallRiverDescription:
      "Small cottage with a view to the river. is a private Aygoot cottage in Dilijan for up to 4 guests. The catalogue information provides separate Workdays and Weekdays prices; bedroom count, bathroom count, and exact location are not specified in the source.",
    smallFishingShort:
      "A small cottage for 4 guests with the client-provided fishing-access name.",
    smallFishingDescription:
      "Small cottage with a view to the river with fishing access is a private Aygoot cottage in Dilijan for up to 4 guests. The source provides separate Workdays and Weekdays prices and explicitly identifies fishing access in the cottage name.",
    standardJacuzziShort:
      "A standard cottage for up to 4 guests with a jacuzzi named in the source.",
    standardJacuzziDescription:
      "Standard cottage with a jacuzzi is a private Aygoot cottage in Dilijan for up to 4 guests. The catalogue information provides separate Workdays and Weekdays prices; bedroom count, bathroom count, and exact location are not specified in the source.",
  },
  hy: {
    bigRiverShort:
      "Մեծ քոթեջ մինչև 10 հյուրի համար՝ հաճախորդի տրամադրած գետատես անունով։",
    bigRiverDescription:
      "Big cottage with a view to the river-ը Aygoot-ի մասնավոր քոթեջ է Դիլիջանում՝ մինչև 10 հյուրի համար։ Տրամադրված տվյալներում նշված են Workdays և Weekdays առանձին գները, իսկ ննջասենյակների քանակը, լոգասենյակների քանակը և ճշգրիտ տեղադրությունը նշված չեն։",
    bigShort:
      "Մեծ քոթեջ մինչև 10 հյուրի համար՝ հաճախորդի նշած ակտիվության հնարավորություններով։",
    bigDescription:
      "Big cottage-ը Aygoot-ի մասնավոր քոթեջ է Դիլիջանում՝ մինչև 10 հյուրի համար։ Աղբյուրը հատուկ նշում է Mini Golf, Kid Zone, Bonfire Arena և Open-air cinema հնարավորությունները, ինչպես նաև Workdays և Weekdays առանձին գները։",
    smallRiverShort:
      "Փոքր քոթեջ 4 հյուրի համար՝ հաճախորդի տրամադրած գետատես անունով։",
    smallRiverDescription:
      "Small cottage with a view to the river.-ը Aygoot-ի մասնավոր քոթեջ է Դիլիջանում՝ մինչև 4 հյուրի համար։ Տրամադրված տվյալներում նշված են Workdays և Weekdays առանձին գները, իսկ ննջասենյակների քանակը, լոգասենյակների քանակը և ճշգրիտ տեղադրությունը նշված չեն։",
    smallFishingShort:
      "Փոքր քոթեջ 4 հյուրի համար՝ հաճախորդի տրամադրած ձկնորսության հասանելիության նշումով։",
    smallFishingDescription:
      "Small cottage with a view to the river with fishing access-ը Aygoot-ի մասնավոր քոթեջ է Դիլիջանում՝ մինչև 4 հյուրի համար։ Աղբյուրը տրամադրում է Workdays և Weekdays առանձին գները և քոթեջի անվան մեջ հստակ նշում է fishing access-ը։",
    standardJacuzziShort:
      "Ստանդարտ քոթեջ մինչև 4 հյուրի համար՝ աղբյուրում նշված ջակուզիով։",
    standardJacuzziDescription:
      "Standard cottage with a jacuzzi-ն Aygoot-ի մասնավոր քոթեջ է Դիլիջանում՝ մինչև 4 հյուրի համար։ Տրամադրված տվյալներում նշված են Workdays և Weekdays առանձին գները, իսկ ննջասենյակների քանակը, լոգասենյակների քանակը և ճշգրիտ տեղադրությունը նշված չեն։",
  },
  ru: {
    bigRiverShort:
      "Большой коттедж до 10 гостей с названием о виде на реку из клиентских данных.",
    bigRiverDescription:
      "Big cottage with a view to the river - частный коттедж Aygoot в Дилижане для компании до 10 гостей. В исходных данных указаны отдельные цены Workdays и Weekdays; количество спален, количество ванных и точная локация не указаны.",
    bigShort:
      "Большой коттедж до 10 гостей с активностями, указанными клиентом.",
    bigDescription:
      "Big cottage - частный коттедж Aygoot в Дилижане для компании до 10 гостей. Источник отдельно перечисляет Mini Golf, Kid Zone, Bonfire Arena и Open-air cinema, а также отдельные цены Workdays и Weekdays.",
    smallRiverShort:
      "Небольшой коттедж для 4 гостей с названием о виде на реку из клиентских данных.",
    smallRiverDescription:
      "Small cottage with a view to the river. - частный коттедж Aygoot в Дилижане для 4 гостей. В исходных данных указаны отдельные цены Workdays и Weekdays; количество спален, количество ванных и точная локация не указаны.",
    smallFishingShort:
      "Небольшой коттедж для 4 гостей с указанным в названии доступом к рыбалке.",
    smallFishingDescription:
      "Small cottage with a view to the river with fishing access - частный коттедж Aygoot в Дилижане для 4 гостей. Источник дает отдельные цены Workdays и Weekdays и явно указывает fishing access в названии коттеджа.",
    standardJacuzziShort:
      "Стандартный коттедж до 4 гостей с джакузи, указанным в источнике.",
    standardJacuzziDescription:
      "Standard cottage with a jacuzzi - частный коттедж Aygoot в Дилижане для компании до 4 гостей. В исходных данных указаны отдельные цены Workdays и Weekdays; количество спален, количество ванных и точная локация не указаны.",
  },
};

const houseSeeds = [
  {
    sourceDirectory: "Big cottage",
    slug: "big-cottage-with-a-view-to-the-river",
    type: HouseType.BIG,
    featured: true,
    priceWorkdaysAmd: 69000,
    priceWeekdaysAmd: 79000,
    guestCapacity: 10,
    amenities: [],
    images: imageUrls("Big cottage", [
      "MainPic.JPG",
      "IMG_5558.JPG",
      "IMG_5559.JPG",
      "IMG_5560.JPG",
      "IMG_5563.JPG",
      "IMG_5564.JPG",
      "IMG_5565.JPG",
      "IMG_5568 (2).JPG",
      "IMG_5571 (2).JPG",
      "IMG_5572 (2).JPG",
      "IMG_5573 (2).JPG",
      "IMG_5581.JPG",
      "IMG_5708.JPG",
      "IMG_5709.JPG",
      "IMG_5714.JPG",
    ]),
    translations: {
      en: {
        name: "Big cottage with a view to the river",
        shortDescription: text.en.bigRiverShort,
        description: text.en.bigRiverDescription,
      },
      hy: {
        name: "Big cottage with a view to the river",
        shortDescription: text.hy.bigRiverShort,
        description: text.hy.bigRiverDescription,
      },
      ru: {
        name: "Big cottage with a view to the river",
        shortDescription: text.ru.bigRiverShort,
        description: text.ru.bigRiverDescription,
      },
    },
  },
  {
    sourceDirectory: "Big cottage 2",
    slug: "big-cottage",
    type: HouseType.BIG,
    featured: true,
    priceWorkdaysAmd: 59000,
    priceWeekdaysAmd: 69000,
    guestCapacity: 10,
    amenities: ["mini-golf", "kid-zone", "bonfire-arena", "open-air-cinema"],
    images: imageUrls("Big cottage 2", [
      "MainPic.JPG",
      "IMG_5568 (3).JPG",
      "IMG_5571 (3).JPG",
      "IMG_5572 (3).JPG",
      "IMG_5708 (1).JPG",
      "IMG_5709 (1).JPG",
      "IMG_5714 (1).JPG",
      "IMG_5715.JPG",
      "IMG_5765 (1).webp",
      "IMG_5765.webp",
      "IMG_5948.PNG",
      "IMG_5949.PNG",
      "IMG_5950.jpeg",
      "IMG_5951.webp",
      "IMG_5952.webp",
      "IMG_5953.webp",
      "IMG_5954.webp",
      "IMG_5955.webp",
      "IMG_5956.webp",
      "IMG_5957.webp",
    ]),
    translations: {
      en: {
        name: "Big cottage",
        shortDescription: text.en.bigShort,
        description: text.en.bigDescription,
      },
      hy: {
        name: "Big cottage",
        shortDescription: text.hy.bigShort,
        description: text.hy.bigDescription,
      },
      ru: {
        name: "Big cottage",
        shortDescription: text.ru.bigShort,
        description: text.ru.bigDescription,
      },
    },
  },
  {
    sourceDirectory: "Small cottage",
    slug: "small-cottage-with-a-view-to-the-river",
    type: HouseType.SMALL,
    featured: true,
    priceWorkdaysAmd: 29000,
    priceWeekdaysAmd: 39000,
    guestCapacity: 4,
    amenities: [],
    images: imageUrls("Small cottage", [
      "MainPic.JPG",
      "IMG_5552.JPG",
      "IMG_5555.JPG",
      "IMG_5556.JPG",
      "IMG_5567.JPG",
      "IMG_5568.JPG",
      "IMG_5569.JPG",
      "IMG_5571.JPG",
      "IMG_5572.JPG",
      "IMG_5573.JPG",
    ]),
    translations: {
      en: {
        name: "Small cottage with a view to the river.",
        shortDescription: text.en.smallRiverShort,
        description: text.en.smallRiverDescription,
      },
      hy: {
        name: "Small cottage with a view to the river.",
        shortDescription: text.hy.smallRiverShort,
        description: text.hy.smallRiverDescription,
      },
      ru: {
        name: "Small cottage with a view to the river.",
        shortDescription: text.ru.smallRiverShort,
        description: text.ru.smallRiverDescription,
      },
    },
  },
  {
    sourceDirectory: "Small cottage fishing",
    slug: "small-cottage-with-a-view-to-the-river-with-fishing-access",
    type: HouseType.SMALL,
    featured: false,
    priceWorkdaysAmd: 29000,
    priceWeekdaysAmd: 39000,
    guestCapacity: 4,
    amenities: ["fishing-access"],
    images: imageUrls("Small cottage fishing", [
      "MainPic.JPG",
      "IMG_5568 (1).JPG",
      "IMG_5569 (1).JPG",
      "IMG_5571 (1).JPG",
      "IMG_5572 (1).JPG",
      "IMG_5573 (1).JPG",
      "IMG_5700.JPG",
      "IMG_5701.JPG",
      "IMG_5702.JPG",
      "IMG_5703.JPG",
      "IMG_5705.JPG",
      "IMG_5706.JPG",
    ]),
    translations: {
      en: {
        name: "Small cottage with a view to the river with fishing access",
        shortDescription: text.en.smallFishingShort,
        description: text.en.smallFishingDescription,
      },
      hy: {
        name: "Small cottage with a view to the river with fishing access",
        shortDescription: text.hy.smallFishingShort,
        description: text.hy.smallFishingDescription,
      },
      ru: {
        name: "Small cottage with a view to the river with fishing access",
        shortDescription: text.ru.smallFishingShort,
        description: text.ru.smallFishingDescription,
      },
    },
  },
  {
    sourceDirectory: "Standard cottage jacuzzi",
    slug: "standard-cottage-with-a-jacuzzi",
    type: HouseType.STANDARD,
    featured: false,
    priceWorkdaysAmd: 39000,
    priceWeekdaysAmd: 49000,
    guestCapacity: 4,
    amenities: ["jacuzzi"],
    images: imageUrls("Standard cottage jacuzzi", [
      "MainPic.JPG",
      "IMG_5556.JPG",
      "IMG_5558.JPG",
      "IMG_5567.JPG",
      "IMG_5571.JPG",
      "IMG_5572.JPG",
    ]),
    translations: {
      en: {
        name: "Standard cottage with a jacuzzi",
        shortDescription: text.en.standardJacuzziShort,
        description: text.en.standardJacuzziDescription,
      },
      hy: {
        name: "Standard cottage with a jacuzzi",
        shortDescription: text.hy.standardJacuzziShort,
        description: text.hy.standardJacuzziDescription,
      },
      ru: {
        name: "Standard cottage with a jacuzzi",
        shortDescription: text.ru.standardJacuzziShort,
        description: text.ru.standardJacuzziDescription,
      },
    },
  },
];

async function seedAmenities() {
  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { slug: amenity.slug },
      update: amenity,
      create: amenity,
    });
  }
}

async function seedHouses() {
  await prisma.house.deleteMany({
    where: {
      slug: {
        notIn: houseSeeds.map((house) => house.slug),
      },
    },
  });

  const amenityMap = new Map(
    (await prisma.amenity.findMany()).map((amenity) => [
      amenity.slug,
      amenity.id,
    ]),
  );

  for (const [index, house] of houseSeeds.entries()) {
    const translations = Object.entries(house.translations).map(
      ([locale, value]) => ({
        locale,
        name: value.name,
        shortDescription: value.shortDescription,
        description: value.description,
        locationLabel: null,
        nearbyLabel: null,
      }),
    );

    const images = house.images.map((url, position) => ({
      url,
      alt: `${house.translations.en.name} image ${position + 1}`,
      position: position + 1,
      isCover: position === 0,
    }));

    await prisma.house.upsert({
      where: { slug: house.slug },
      update: {
        status: HouseStatus.PUBLISHED,
        type: house.type,
        featured: house.featured,
        pricePerNightAmd: Math.min(
          house.priceWorkdaysAmd,
          house.priceWeekdaysAmd,
        ),
        priceWorkdaysAmd: house.priceWorkdaysAmd,
        priceWeekdaysAmd: house.priceWeekdaysAmd,
        guestCapacity: house.guestCapacity,
        bedrooms: null,
        bathrooms: null,
        latitude: null,
        longitude: null,
        sortOrder: index,
        publishedAt: new Date(),
        translations: {
          deleteMany: {},
          create: translations,
        },
        images: {
          deleteMany: {},
          create: images,
        },
        houseAmenities: {
          deleteMany: {},
          create: house.amenities.map((slug) => ({
            amenityId: amenityMap.get(slug)!,
          })),
        },
      },
      create: {
        slug: house.slug,
        status: HouseStatus.PUBLISHED,
        type: house.type,
        featured: house.featured,
        pricePerNightAmd: Math.min(
          house.priceWorkdaysAmd,
          house.priceWeekdaysAmd,
        ),
        priceWorkdaysAmd: house.priceWorkdaysAmd,
        priceWeekdaysAmd: house.priceWeekdaysAmd,
        guestCapacity: house.guestCapacity,
        bedrooms: null,
        bathrooms: null,
        latitude: null,
        longitude: null,
        sortOrder: index,
        publishedAt: new Date(),
        translations: {
          create: translations,
        },
        images: {
          create: images,
        },
        houseAmenities: {
          create: house.amenities.map((slug) => ({
            amenityId: amenityMap.get(slug)!,
          })),
        },
      },
    });
  }
}

async function seedAdmin() {
  const password = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123";
  const email = process.env.ADMIN_EMAIL ?? "aygoodriverlake@gmail.com";
  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Aygoot Admin",
      role: Role.ADMIN,
      passwordHash,
    },
    create: {
      email,
      name: "Aygoot Admin",
      role: Role.ADMIN,
      passwordHash,
    },
  });
}

async function main() {
  await seedAmenities();
  await seedHouses();
  await seedAdmin();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
