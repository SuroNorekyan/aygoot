import { randomBytes } from "crypto";
import { BookingStatus, HouseStatus, Prisma } from "@prisma/client";
import type { Session } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { parseDateOnly, rangesOverlap } from "@/lib/utils/dates";
import { calculateStayTotalAmd } from "@/lib/utils/pricing";
import {
  sendBookingCancelledEmail,
  sendBookingConfirmationEmail,
  sendBookingRejectedEmail,
  sendBookingRequestEmails,
} from "@/lib/email/booking-notifications";
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

function generateBookingOrderId() {
  return `AYG-${randomBytes(4).toString("hex").toUpperCase()}`;
}

async function createBookingWithOrderId(data: Omit<Prisma.BookingUncheckedCreateInput, "orderId">) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.booking.create({
        data: {
          ...data,
          orderId: generateBookingOrderId(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes("orderId")
      ) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Unable to generate a unique booking reference.");
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
  const booking = await createBookingWithOrderId({
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
  });

  const translation =
    house.translations.find((item) => item.locale === payload.locale) ??
    house.translations.find((item) => item.locale === "en") ??
    house.translations[0];

  const mail = await sendBookingRequestEmails({
    ...toBookingEmailData({
      booking,
      locale: payload.locale,
      houseName: translation?.name ?? house.slug,
    }),
    houseSlug: house.slug,
  });

  return {
    success: true as const,
    status: 201,
    body: {
      booking: {
        id: booking.id,
        orderId: booking.orderId,
        status: booking.status,
        totalPriceAmd,
      },
      mail,
    },
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  adminNotes?: string | null,
) {
  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true },
  });

  if (!existing) {
    throw new Error("Booking not found.");
  }

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

  if (existing.status === status) {
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
}
