import Link from "next/link";
import { BookingStatus } from "@prisma/client";
import { getAdminBookings } from "@/features/admin/queries";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrencyAmd, formatDateRange, formatDateTime } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

const bookingStatuses = ["ALL", ...Object.values(BookingStatus)] as const;

function getSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(page: number, query: string, status: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status !== "ALL") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return `/admin/bookings${search ? `?${search}` : ""}`;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const query = getSearchValue(params.q)?.trim() ?? "";
  const rawStatus = getSearchValue(params.status) ?? "ALL";
  const status = bookingStatuses.includes(rawStatus as (typeof bookingStatuses)[number])
    ? (rawStatus as BookingStatus | "ALL")
    : "ALL";
  const page = Number.parseInt(getSearchValue(params.page) ?? "1", 10);
  const result = await getAdminBookings({ page, query, status });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="display-font text-4xl font-medium">Bookings</h2>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            Search by booking reference, guest, email, phone, cottage, or slug.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/bookings">Clear filters</Link>
        </Button>
      </div>

      <form className="surface-card grid gap-3 rounded-[28px] p-4 md:grid-cols-[1fr_210px_auto]" action="/admin/bookings">
        <Input
          name="q"
          defaultValue={query}
          placeholder="Search booking reference, guest, email, phone, or cottage"
          aria-label="Search bookings"
        />
        <Select name="status" defaultValue={status} aria-label="Filter booking status">
          {bookingStatuses.map((item) => (
            <option key={item} value={item}>
              {item === "ALL" ? "All statuses" : item.charAt(0) + item.slice(1).toLowerCase()}
            </option>
          ))}
        </Select>
        <Button>Search</Button>
      </form>

      <div className="flex flex-col gap-2 text-sm text-[rgb(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
        <p>
          {result.total} booking{result.total === 1 ? "" : "s"} found
        </p>
        <p>
          Page {result.page} of {result.totalPages}
        </p>
      </div>

      {result.bookings.length ? (
        <div className="grid gap-4">
          {result.bookings.map((booking) => (
            <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="surface-card rounded-[28px] p-5 transition hover:-translate-y-0.5 hover:bg-white/76 hover:shadow-[0_20px_42px_rgba(37,28,21,0.10)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="display-font text-3xl font-medium">
                      {booking.house.translations[0]?.name ?? booking.house.slug}
                    </p>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[rgb(var(--muted-foreground))]">
                      {booking.orderId}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
                    {booking.guestName} · {booking.guestEmail} · {booking.guestPhone}
                  </p>
                  <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
                    {formatDateRange("en", booking.checkIn, booking.checkOut)} · {booking.guestCount} guests
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 lg:justify-end">
                  <div className="text-left lg:text-right">
                    <p className="font-semibold">{formatCurrencyAmd("en", booking.totalPriceAmd)}</p>
                    <p className="text-xs text-[rgb(var(--muted-foreground))]">{formatDateTime("en", booking.createdAt)}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="surface-card rounded-[28px] p-6 text-sm text-[rgb(var(--muted-foreground))]">
          No bookings match the current search.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button asChild variant="outline" className={result.page <= 1 ? "pointer-events-none opacity-50" : ""}>
          <Link href={pageHref(Math.max(1, result.page - 1), query, status)}>Previous</Link>
        </Button>
        <Button asChild variant="outline" className={result.page >= result.totalPages ? "pointer-events-none opacity-50" : ""}>
          <Link href={pageHref(Math.min(result.totalPages, result.page + 1), query, status)}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
