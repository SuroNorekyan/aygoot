import { NextResponse } from "next/server";
import { HouseStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";
import { adminHouseSchema } from "@/features/admin/validation";

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
    const created = await prisma.house.create({
      data: {
        slug: payload.slug,
        status: payload.status === "PUBLISHED" ? HouseStatus.PUBLISHED : HouseStatus.DRAFT,
        featured: Boolean(payload.featured),
        pricePerNightAmd: payload.pricePerNightAmd,
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
            locationLabel: translation.locationLabel,
            nearbyLabel: translation.nearbyLabel || null,
          })),
        },
        images: {
          create: payload.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            position: index,
            isCover: image.isCover || index === 0,
          })),
        },
        houseAmenities: {
          create: payload.amenityIds.map((amenityId) => ({ amenityId })),
        },
      },
    });

    return NextResponse.json({ house: created }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to create house." }, { status: 500 });
  }
}
