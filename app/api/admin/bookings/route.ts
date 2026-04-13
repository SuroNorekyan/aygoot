import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";

export async function GET() {
  try {
    await requireAdminSession();
    const bookings = await prisma.booking.findMany({
      include: {
        house: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    return NextResponse.json({ error: "Unable to load bookings." }, { status: 500 });
  }
}
