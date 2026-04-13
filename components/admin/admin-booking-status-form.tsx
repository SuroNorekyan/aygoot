"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function AdminBookingStatusForm({
  bookingId,
  currentStatus,
  adminNotes,
}: {
  bookingId: string;
  currentStatus: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  adminNotes?: string | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const response = await fetch(`/api/admin/bookings/${bookingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: formData.get("status"),
              adminNotes: formData.get("adminNotes"),
            }),
          });

          if (!response.ok) {
            toast({ title: "Unable to update booking.", variant: "destructive" });
            return;
          }

          toast({ title: "Booking updated.", variant: "success" });
          router.refresh();
        });
      }}
    >
      <select
        name="status"
        defaultValue={currentStatus}
        className="h-12 w-full rounded-2xl border border-[rgba(var(--border),0.9)] bg-white/80 px-4 text-sm"
      >
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="REJECTED">Rejected</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <Textarea name="adminNotes" defaultValue={adminNotes ?? ""} rows={5} />
      <Button disabled={isPending}>Update booking</Button>
    </form>
  );
}
