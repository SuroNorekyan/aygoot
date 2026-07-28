import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  sendBookingCancelledEmail,
  sendBookingConfirmationEmail,
  sendBookingRejectedEmail,
} from "@/lib/email/booking-notifications";
import type { Locale } from "@/config/site";

export class BookingAvailabilityConflictError extends Error {
  constructor(
    message = "These dates are already occupied by another confirmed booking or availability block.",
  ) {
    super(message);
    this.name = "BookingAvailabilityConflictError";
  }
}

export async function getUserBookings(userId: string, locale: Locale) {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      house: {
        include: {
          translations: true,
          images: {
            take: 1,
            where: { isCover: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings.map((booking) => {
    const translation =
      booking.house.translations.find((item) => item.locale === locale) ??
      booking.house.translations.find((item) => item.locale === "en") ??
      booking.house.translations[0];

    return {
      id: booking.id,
      orderId: booking.orderId,
      status: booking.status,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalPriceAmd: booking.totalPriceAmd,
      guestCount: booking.guestCount,
      createdAt: booking.createdAt,
      house: {
        slug: booking.house.slug,
        name: translation?.name ?? booking.house.slug,
        image: booking.house.images[0]?.url ?? null,
      },
    };
  });
}

function toBookingEmailData({
  booking,
  locale,
  houseName,
}: {
  booking: {
    id: string;
    orderId: string;
    userId: string | null;
    guestName: string;
    guestEmail: string;
    guestPhone: string | null;
    guestNotes: string | null;
    checkIn: Date;
    checkOut: Date;
    guestCount: number;
    totalPriceAmd: number;
    status: BookingStatus;
    createdAt: Date;
  };
  locale: Locale;
  houseName: string;
}) {
  return {
    bookingId: booking.id,
    orderId: booking.orderId,
    locale,
    houseName,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    guestNotes: booking.guestNotes,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guestCount: booking.guestCount,
    totalPriceAmd: booking.totalPriceAmd,
    status: booking.status,
    userId: booking.userId,
    createdAt: booking.createdAt,
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  adminNotes?: string | null,
) {
  const maxAttempts = 3;
  let previousStatus: BookingStatus | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const booking = await prisma.$transaction(
        async (tx) => {
          const existing = await tx.booking.findUnique({
            where: { id: bookingId },
            select: {
              id: true,
              houseId: true,
              checkIn: true,
              checkOut: true,
              status: true,
            },
          });

          if (!existing) {
            throw new Error("Booking not found.");
          }

          previousStatus = existing.status;

          if (status === BookingStatus.CONFIRMED && existing.status !== status) {
            const [bookingConflict, blockConflict] = await Promise.all([
              tx.booking.findFirst({
                where: {
                  houseId: existing.houseId,
                  id: { not: existing.id },
                  status: BookingStatus.CONFIRMED,
                  checkIn: { lt: existing.checkOut },
                  checkOut: { gt: existing.checkIn },
                },
                select: { id: true },
              }),
              tx.availabilityBlock.findFirst({
                where: {
                  houseId: existing.houseId,
                  startDate: { lt: existing.checkOut },
                  endDate: { gt: existing.checkIn },
                },
                select: { id: true },
              }),
            ]);

            if (bookingConflict || blockConflict) {
              throw new BookingAvailabilityConflictError();
            }
          }

          return tx.booking.update({
            where: { id: bookingId },
            data: {
              status,
              adminNotes: adminNotes || null,
            },
            include: {
              house: {
                include: {
                  translations: true,
                },
              },
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );

      const locale = (booking.locale || "en") as Locale;
      const translation =
        booking.house.translations.find((item) => item.locale === locale) ??
        booking.house.translations.find((item) => item.locale === "en") ??
        booking.house.translations[0];

      if (previousStatus === status) {
        return booking;
      }

      const data = {
        ...toBookingEmailData({
          booking,
          locale,
          houseName: translation?.name ?? booking.house.slug,
        }),
        houseSlug: booking.house.slug,
      };

      if (status === BookingStatus.CONFIRMED) {
        await sendBookingConfirmationEmail(data);
      }

      if (status === BookingStatus.REJECTED) {
        await sendBookingRejectedEmail(data);
      }

      if (status === BookingStatus.CANCELLED) {
        await sendBookingCancelledEmail(data);
      }

      return booking;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034" &&
        attempt < maxAttempts
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Unable to update booking after retrying serialization conflicts.");
}
