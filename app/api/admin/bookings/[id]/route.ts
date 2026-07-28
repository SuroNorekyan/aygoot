import { NextResponse } from "next/server";
import { BookingStatus } from "@prisma/client";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";
import {
  BookingAvailabilityConflictError,
  updateBookingStatus,
} from "@/features/bookings/service";
import { bookingStatusSchema } from "@/features/bookings/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = bookingStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const booking = await updateBookingStatus(
      id,
      parsed.data.status as BookingStatus,
      parsed.data.adminNotes,
    );

    return NextResponse.json({ booking });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    if (error instanceof BookingAvailabilityConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to update booking." }, { status: 500 });
  }
}
