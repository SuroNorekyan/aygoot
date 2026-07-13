import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { AdminBookingStatusForm } from "@/components/admin/admin-booking-status-form";
import { formatCurrencyAmd, formatDateRange } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      house: {
        include: {
          translations: {
            where: { locale: "en" },
            take: 1,
          },
        },
      },
      user: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <div className="surface-card rounded-[28px] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[rgb(var(--muted-foreground))]">
          Booking request
        </p>
        <h2 className="display-font mt-3 text-4xl font-medium">
          {booking.house.translations[0]?.name ?? booking.house.slug}
        </h2>
        <p className="mt-3 inline-flex rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-[rgb(var(--muted-foreground))]">
          Reference {booking.orderId}
        </p>
        <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
          <div className="rounded-[22px] bg-white/70 p-4">
            <p className="font-semibold">Guest</p>
            <p>{booking.guestName}</p>
            <p>{booking.guestEmail}</p>
            <p>{booking.guestPhone}</p>
          </div>
          <div className="rounded-[22px] bg-white/70 p-4">
            <p className="font-semibold">Stay</p>
            <p>{formatDateRange("en", booking.checkIn, booking.checkOut)}</p>
            <p>{booking.guestCount} guests</p>
            <p>{formatCurrencyAmd("en", booking.totalPriceAmd)}</p>
          </div>
        </div>
        {booking.guestNotes ? (
          <div className="mt-5 rounded-[22px] bg-white/70 p-4 text-sm">
            <p className="font-semibold">Guest notes</p>
            <p className="mt-2 leading-7 text-[rgb(var(--muted-foreground))]">{booking.guestNotes}</p>
          </div>
        ) : null}
      </div>
      <div className="surface-card rounded-[28px] p-6">
        <h3 className="display-font text-3xl font-medium">Update status</h3>
        <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
          Confirm, reject, or cancel this request. Email updates are sent automatically.
        </p>
        <div className="mt-5">
          <AdminBookingStatusForm
            bookingId={booking.id}
            currentStatus={booking.status}
            adminNotes={booking.adminNotes}
          />
        </div>
      </div>
    </div>
  );
}
