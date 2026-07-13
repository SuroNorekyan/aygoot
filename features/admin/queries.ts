import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function getAdminDashboardData() {
  const [houseCount, featuredCount, pendingBookings, recentBookings] = await Promise.all([
    prisma.house.count(),
    prisma.house.count({ where: { featured: true } }),
    prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        house: {
          include: {
            translations: {
              where: { locale: "en" },
              take: 1,
            },
          },
        },
      },
    }),
  ]);

  return {
    houseCount,
    featuredCount,
    pendingBookings,
    recentBookings,
  };
}

const adminBookingsPageSize = 12;

export async function getAdminBookings({
  page = 1,
  query = "",
  status,
}: {
  page?: number;
  query?: string;
  status?: BookingStatus | "ALL";
} = {}) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const trimmedQuery = query.trim();
  const where: Prisma.BookingWhereInput = {
    ...(status && status !== "ALL" ? { status } : {}),
    ...(trimmedQuery
      ? {
          OR: [
            { orderId: { contains: trimmedQuery, mode: "insensitive" } },
            { id: { contains: trimmedQuery, mode: "insensitive" } },
            { guestName: { contains: trimmedQuery, mode: "insensitive" } },
            { guestEmail: { contains: trimmedQuery, mode: "insensitive" } },
            { guestPhone: { contains: trimmedQuery, mode: "insensitive" } },
            {
              house: {
                OR: [
                  { slug: { contains: trimmedQuery, mode: "insensitive" } },
                  {
                    translations: {
                      some: {
                        name: { contains: trimmedQuery, mode: "insensitive" },
                      },
                    },
                  },
                ],
              },
            },
          ],
        }
      : {}),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        house: {
          include: {
            translations: {
              where: { locale: "en" },
              take: 1,
            },
          },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * adminBookingsPageSize,
      take: adminBookingsPageSize,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    bookings,
    total,
    page: safePage,
    pageSize: adminBookingsPageSize,
    totalPages: Math.max(1, Math.ceil(total / adminBookingsPageSize)),
  };
}
