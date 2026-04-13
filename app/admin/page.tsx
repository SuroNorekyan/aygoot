import { getAdminDashboardData } from "@/features/admin/queries";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/format";
import type { Locale } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getAdminDashboardData();
  const locale: Locale = "en";

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted-foreground))]">Houses</p>
          <p className="display-font mt-3 text-5xl font-medium">{data.houseCount}</p>
        </Card>
        <Card className="rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted-foreground))]">Featured</p>
          <p className="display-font mt-3 text-5xl font-medium">{data.featuredCount}</p>
        </Card>
        <Card className="rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted-foreground))]">Pending bookings</p>
          <p className="display-font mt-3 text-5xl font-medium">{data.pendingBookings}</p>
        </Card>
      </section>
      <section className="surface-card rounded-[32px] p-6">
        <h2 className="display-font text-3xl font-medium">Recent booking requests</h2>
        <div className="mt-5 space-y-3">
          {data.recentBookings.map((booking) => (
            <a
              key={booking.id}
              href={`/admin/bookings/${booking.id}`}
              className="flex flex-col gap-2 rounded-[24px] bg-white/70 p-4 transition hover:bg-white"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{booking.house.translations[0]?.name ?? booking.house.slug}</p>
                <span className="text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted-foreground))]">
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-[rgb(var(--muted-foreground))]">
                {booking.guestName} • {formatDateTime(locale, booking.createdAt)}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
