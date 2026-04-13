import { BookingStatus } from "@prisma/client";
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

export async function getAdminBookings() {
  return prisma.booking.findMany({
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
  });
}
