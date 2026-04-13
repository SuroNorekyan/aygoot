import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createBookingRequest } from "@/features/bookings/service";

export async function POST(request: Request) {
  const session = await auth();
  const body = await request.json().catch(() => null);
  const result = await createBookingRequest(body, session);

  return NextResponse.json(result.body, { status: result.status });
}
