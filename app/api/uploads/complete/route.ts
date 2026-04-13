import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  console.log("[blob-upload-complete]", body);
  return NextResponse.json({ success: true });
}
