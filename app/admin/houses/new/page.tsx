import { prisma } from "@/lib/db/prisma";
import { AdminHouseForm } from "@/components/admin/admin-house-form";

export const dynamic = "force-dynamic";

export default async function AdminNewHousePage() {
  const amenities = await prisma.amenity.findMany({
    orderBy: { label: "asc" },
    select: { id: true, label: true },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="display-font text-4xl font-medium">Create house</h2>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">
          Add a new Aygoot property with multilingual copy and gallery images.
        </p>
      </div>
      <AdminHouseForm mode="create" amenityOptions={amenities} />
    </div>
  );
}
