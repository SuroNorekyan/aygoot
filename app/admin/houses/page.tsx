import { prisma } from "@/lib/db/prisma";
import { getHouseOptions } from "@/features/houses/queries";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrencyAmd, formatDateTime } from "@/lib/utils/format";
import { HouseStatusActionButton } from "@/components/admin/house-status-action-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export const dynamic = "force-dynamic";

export default async function AdminHousesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; type?: string }>;
}) {
  const filters = await searchParams;
  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(filters.status ?? "")
    ? (filters.status as "DRAFT" | "PUBLISHED" | "ARCHIVED")
    : "all";
  const type = ["BIG", "SMALL", "STANDARD"].includes(filters.type ?? "")
    ? (filters.type as "BIG" | "SMALL" | "STANDARD")
    : "all";
  const houses = await getHouseOptions({ search: filters.q, status, type });
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
        <Button asChild>
          <a href="/admin/houses/new">New house</a>
        </Button>
      </div>
      <form className="surface-card grid gap-4 rounded-[28px] p-5 md:grid-cols-[1fr_180px_180px_auto]">
        <Input
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Search name or slug"
        />
        <Select
          name="status"
          defaultValue={status}
        >
          <option value="all">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
        <Select
          name="type"
          defaultValue={type}
        >
          <option value="all">All types</option>
          <option value="BIG">Big</option>
          <option value="SMALL">Small</option>
          <option value="STANDARD">Standard</option>
        </Select>
        <Button type="submit">Filter</Button>
      </form>
      <div className="grid gap-4">
        {houses.map((house) => (
          <div key={house.id} className="surface-card rounded-[28px] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                {house.images[0]?.url ? (
                  <img
                    src={house.images[0].url}
                    alt={house.translations[0]?.name ?? house.slug}
                    className="h-20 w-24 rounded-[18px] object-cover"
                  />
                ) : (
                  <div className="h-20 w-24 rounded-[18px] bg-[rgba(var(--forest),0.12)]" />
                )}
                <div>
                  <p className="display-font text-3xl font-medium">{house.translations[0]?.name ?? house.slug}</p>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">/{house.slug}</p>
                  <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
                    {house.type} • {house.guestCapacity} guests • {formatCurrencyAmd("en", house.priceWorkdaysAmd)} workdays / {formatCurrencyAmd("en", house.priceWeekdaysAmd)} weekends
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={house.status} />
                {house.featured ? <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">Featured</span> : null}
                <span className="text-sm text-[rgb(var(--muted-foreground))]">
                  Updated {formatDateTime("en", house.updatedAt)}
                </span>
                <Button asChild variant="outline" size="sm">
                  <a href={`/admin/houses/${house.id}`}>Edit</a>
                </Button>
                {house.status === "ARCHIVED" ? (
                  <HouseStatusActionButton houseId={house.id} action="restore" />
                ) : (
                  <HouseStatusActionButton houseId={house.id} action="archive" />
                )}
              </div>
            </div>
          </div>
        ))}
        {!houses.length ? (
          <div className="surface-card rounded-[28px] p-6 text-sm text-[rgb(var(--muted-foreground))]">
            No houses match the current filters.
          </div>
        ) : null}
      </div>
    </div>
  );
}
