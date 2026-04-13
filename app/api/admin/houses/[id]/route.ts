import { NextResponse } from "next/server";
import { HouseStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";
import { adminHouseSchema } from "@/features/admin/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = adminHouseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid house payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const updated = await prisma.house.update({
      where: { id },
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
          deleteMany: {},
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
          deleteMany: {},
          create: payload.images.map((image, index) => ({
            url: image.url,
            alt: image.alt,
            position: index,
            isCover: image.isCover || index === 0,
          })),
        },
        houseAmenities: {
          deleteMany: {},
          create: payload.amenityIds.map((amenityId) => ({ amenityId })),
        },
      },
    });

    return NextResponse.json({ house: updated });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to update house." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    await prisma.house.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to delete house." }, { status: 500 });
  }
}
