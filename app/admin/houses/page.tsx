import { prisma } from "@/lib/db/prisma";
import { getHouseOptions } from "@/features/houses/queries";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminHousesPage() {
  const houses = await getHouseOptions();
  const amenityCount = await prisma.amenity.count();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="display-font text-4xl font-medium">Houses</h2>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            {amenityCount} amenities available across the catalogue.
          </p>
        </div>
        <a
          href="/admin/houses/new"
          className="inline-flex items-center rounded-full bg-[rgb(var(--primary))] px-5 py-3 text-sm font-semibold text-[rgb(var(--primary-foreground))]"
        >
          New house
        </a>
      </div>
      <div className="grid gap-4">
        {houses.map((house) => (
          <div key={house.id} className="surface-card rounded-[28px] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={house.images[0]?.url ?? "/images/placeholder-house.svg"}
                  alt={house.translations[0]?.name ?? house.slug}
                  className="h-20 w-24 rounded-[18px] object-cover"
                />
                <div>
                  <p className="display-font text-3xl font-medium">{house.translations[0]?.name ?? house.slug}</p>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">/{house.slug}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={house.status} />
                {house.featured ? <StatusBadge status="PUBLISHED" /> : null}
                <span className="text-sm text-[rgb(var(--muted-foreground))]">
                  Updated {formatDateTime("en", house.publishedAt ?? new Date())}
                </span>
                <a
                  href={`/admin/houses/${house.id}`}
                  className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold"
                >
                  Edit
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
