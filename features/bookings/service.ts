import { BookingStatus, HouseStatus } from "@prisma/client";
import type { Session } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { parseDateOnly, rangesOverlap } from "@/lib/utils/dates";
import { calculateStayTotalAmd } from "@/lib/utils/pricing";
import { sendBookingConfirmationEmail, sendBookingRejectedEmail, sendBookingRequestEmails } from "@/lib/email/booking-notifications";
import type { Locale } from "@/config/site";
import { bookingSchema } from "./validation";

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

export async function getBlockedRanges(houseId: string) {
  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        houseId,
        status: BookingStatus.CONFIRMED,
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
    }),
    prisma.availabilityBlock.findMany({
      where: { houseId },
      select: {
        startDate: true,
        endDate: true,
      },
    }),
  ]);

  return {
    bookings,
    blocks,
  };
}

export async function ensureAvailability(houseId: string, checkIn: Date, checkOut: Date) {
  const { bookings, blocks } = await getBlockedRanges(houseId);

  for (const booking of bookings) {
    if (rangesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)) {
      return false;
    }
  }

  for (const block of blocks) {
    if (rangesOverlap(checkIn, checkOut, block.startDate, block.endDate)) {
      return false;
    }
  }

  return true;
}

export async function createBookingRequest(input: unknown, session: Session | null) {
  const parsed = bookingSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      status: 400,
      body: { error: "Invalid booking payload.", issues: parsed.error.flatten() },
    };
  }

  const payload = parsed.data;
  const house = await prisma.house.findUnique({
    where: { id: payload.houseId },
    include: {
      translations: true,
    },
  });

  if (!house) {
    return {
      success: false as const,
      status: 404,
      body: { error: "House not found." },
    };
  }

  if (house.status !== HouseStatus.PUBLISHED) {
    return {
      success: false as const,
      status: 404,
      body: { error: "House not found." },
    };
  }

  if (payload.guestCount > house.guestCapacity) {
    return {
      success: false as const,
      status: 400,
      body: { error: "Guest count exceeds the house capacity." },
    };
  }

  const checkIn = parseDateOnly(payload.checkIn);
  const checkOut = parseDateOnly(payload.checkOut);

  if (!checkIn || !checkOut) {
    return {
      success: false as const,
      status: 400,
      body: { error: "Invalid booking dates." },
    };
  }

  const available = await ensureAvailability(house.id, checkIn, checkOut);

  if (!available) {
    return {
      success: false as const,
      status: 409,
      body: { error: "These dates are no longer available." },
    };
  }

  const totalPriceAmd = calculateStayTotalAmd(checkIn, checkOut, house);
  const booking = await prisma.booking.create({
    data: {
      houseId: house.id,
      userId: session?.user?.id ?? null,
      guestName: payload.guestName,
      guestEmail: payload.guestEmail.toLowerCase(),
      guestPhone: payload.guestPhone,
      guestCount: payload.guestCount,
      checkIn,
      checkOut,
      locale: payload.locale,
      totalPriceAmd,
      guestNotes: payload.guestNotes || null,
    },
  });

  const translation =
    house.translations.find((item) => item.locale === payload.locale) ??
    house.translations.find((item) => item.locale === "en") ??
    house.translations[0];

  await sendBookingRequestEmails({
    bookingId: booking.id,
    locale: payload.locale,
    houseName: translation?.name ?? house.slug,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    checkIn,
    checkOut,
    guestCount: booking.guestCount,
    totalPriceAmd,
  });

  return {
    success: true as const,
    status: 201,
    body: {
      booking: {
        id: booking.id,
        status: booking.status,
        totalPriceAmd,
      },
    },
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  adminNotes?: string | null,
) {
  const booking = await prisma.booking.update({
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

  const locale = (booking.locale || "en") as Locale;
  const translation =
    booking.house.translations.find((item) => item.locale === locale) ??
    booking.house.translations.find((item) => item.locale === "en") ??
    booking.house.translations[0];

  if (status === BookingStatus.CONFIRMED) {
    await sendBookingConfirmationEmail({
      bookingId: booking.id,
      locale,
      houseName: translation?.name ?? booking.house.slug,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guestCount: booking.guestCount,
      totalPriceAmd: booking.totalPriceAmd,
    });
  }

  if (status === BookingStatus.REJECTED || status === BookingStatus.CANCELLED) {
    await sendBookingRejectedEmail({
      bookingId: booking.id,
      locale,
      houseName: translation?.name ?? booking.house.slug,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guestCount: booking.guestCount,
      totalPriceAmd: booking.totalPriceAmd,
    });
  }

  return booking;
}
