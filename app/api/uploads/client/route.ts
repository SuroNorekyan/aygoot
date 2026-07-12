import { NextResponse } from "next/server";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";

const validUploadPathname = /^houses\/admin-uploads\/[a-f0-9-]+-[a-z0-9][a-z0-9.-]*$/;

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = (await request.json().catch(() => null)) as {
      pathname?: string;
    } | null;

    if (!body?.pathname) {
      return NextResponse.json({ error: "Pathname is required." }, { status: 400 });
    }

    if (!validUploadPathname.test(body.pathname)) {
      return NextResponse.json({ error: "Invalid upload pathname." }, { status: 400 });
    }

    const callbackUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/api/uploads/complete`;
    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname: body.pathname,
      allowedContentTypes: ["image/*"],
      maximumSizeInBytes: 10 * 1024 * 1024,
      onUploadCompleted: {
        callbackUrl,
        tokenPayload: JSON.stringify({ category: "house-gallery" }),
      },
    });

    return NextResponse.json({ clientToken });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    console.error(error);
    return NextResponse.json({ error: "Unable to prepare upload." }, { status: 500 });
  }
}
