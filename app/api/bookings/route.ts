import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Public booking requests are now handled by Exely." },
    { status: 410 },
  );
}
