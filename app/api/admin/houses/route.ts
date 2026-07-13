import { NextResponse } from "next/server";
import { HouseStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";
import { adminHouseSchema, normalizeHouseImages } from "@/features/admin/validation";

export async function GET() {
  try {
    await requireAdminSession();
    const houses = await prisma.house.findMany({
      include: {
        translations: true,
        images: true,
        houseAmenities: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ houses });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    return NextResponse.json({ error: "Unable to load houses." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = await request.json().catch(() => null);
    const parsed = adminHouseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid house payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const created = await prisma.$transaction((tx) =>
      tx.house.create({
        data: {
          slug: payload.slug,
          status: payload.status as HouseStatus,
          type: payload.type,
          featured: Boolean(payload.featured),
          pricePerNightAmd: payload.pricePerNightAmd,
          priceWorkdaysAmd: payload.priceWorkdaysAmd,
          priceWeekdaysAmd: payload.priceWeekdaysAmd,
          guestCapacity: payload.guestCapacity,
          bedrooms: payload.bedrooms,
          bathrooms: payload.bathrooms,
          latitude: payload.latitude ?? null,
          longitude: payload.longitude ?? null,
          sortOrder: payload.sortOrder ?? 0,
          publishedAt: payload.status === "PUBLISHED" ? new Date() : null,
          translations: {
            create: payload.translations.map((translation) => ({
              locale: translation.locale,
              name: translation.name,
              shortDescription: translation.shortDescription,
              description: translation.description,
              locationLabel: translation.locationLabel || null,
              nearbyLabel: translation.nearbyLabel || null,
            })),
          },
          images: {
            create: normalizeHouseImages(payload.images),
          },
          houseAmenities: {
            create: payload.amenityIds.map((amenityId) => ({ amenityId })),
          },
        },
      }),
    );

    return NextResponse.json({ house: created }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "A house with this slug already exists." }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to create house." }, { status: 500 });
  }
}
