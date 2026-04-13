import { getAdminBookings } from "@/features/admin/queries";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrencyAmd, formatDateRange, formatDateTime } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="display-font text-4xl font-medium">Bookings</h2>
        <p className="text-sm text-[rgb(var(--muted-foreground))]">
          Review requests, check guest details, and approve or reject availability.
        </p>
      </div>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <a key={booking.id} href={`/admin/bookings/${booking.id}`} className="surface-card rounded-[28px] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="display-font text-3xl font-medium">
                  {booking.house.translations[0]?.name ?? booking.house.slug}
                </p>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">
                  {booking.guestName} • {booking.guestEmail} • {booking.guestPhone}
                </p>
                <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
                  {formatDateRange("en", booking.checkIn, booking.checkOut)} • {booking.guestCount} guests
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">{formatCurrencyAmd("en", booking.totalPriceAmd)}</p>
                  <p className="text-xs text-[rgb(var(--muted-foreground))]">{formatDateTime("en", booking.createdAt)}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
