"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
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
      <Select
        name="status"
        defaultValue={currentStatus}
      >
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="REJECTED">Rejected</option>
        <option value="CANCELLED">Cancelled</option>
      </Select>
      <Textarea name="adminNotes" defaultValue={adminNotes ?? ""} rows={5} />
      <Button disabled={isPending}>Update booking</Button>
    </form>
  );
}
