import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminHouseForm } from "@/components/admin/admin-house-form";
import { DeleteHouseButton } from "@/components/admin/delete-house-button";

export const dynamic = "force-dynamic";

export default async function AdminHouseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [house, amenities] = await Promise.all([
    prisma.house.findUnique({
      where: { id },
      include: {
        translations: true,
        images: {
          orderBy: { position: "asc" },
        },
        houseAmenities: true,
      },
    }),
    prisma.amenity.findMany({
      orderBy: { label: "asc" },
      select: { id: true, label: true },
    }),
  ]);

  if (!house) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="display-font text-4xl font-medium">Edit house</h2>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            Update property details, translations, and gallery assets.
          </p>
        </div>
        <DeleteHouseButton
          houseId={house.id}
          houseName={house.translations.find((item) => item.locale === "en")?.name ?? house.slug}
        />
      </div>
      <AdminHouseForm
        mode="edit"
        amenityOptions={amenities}
        house={{
          id: house.id,
          slug: house.slug,
          status: house.status,
          type: house.type,
          featured: house.featured,
          pricePerNightAmd: house.pricePerNightAmd,
          priceWorkdaysAmd: house.priceWorkdaysAmd,
          priceWeekdaysAmd: house.priceWeekdaysAmd,
          guestCapacity: house.guestCapacity,
          bedrooms: house.bedrooms,
          bathrooms: house.bathrooms,
          latitude: house.latitude,
          longitude: house.longitude,
          amenities: house.houseAmenities.map((item) => item.amenityId),
          images: house.images.map((image) => ({
            url: image.url,
            alt: image.alt,
            isCover: image.isCover,
          })),
          translations: house.translations.map((translation) => ({
            locale: translation.locale as "en" | "hy" | "ru",
            name: translation.name,
            shortDescription: translation.shortDescription,
            description: translation.description,
            locationLabel: translation.locationLabel ?? "",
            nearbyLabel: translation.nearbyLabel ?? "",
          })),
        }}
      />
    </div>
  );
}
