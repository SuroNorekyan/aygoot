"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function HouseStatusActionButton({
  houseId,
  action,
}: {
  houseId: string;
  action: "archive" | "restore";
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const nextStatus = action === "archive" ? "ARCHIVED" : "DRAFT";

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={() => {
        const confirmed =
          action === "archive"
            ? window.confirm("Archive this house? Existing bookings and history will be preserved.")
            : true;

        if (!confirmed) return;

        startTransition(async () => {
          const response = await fetch(`/api/admin/houses/${houseId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: nextStatus }),
          });
          const body = (await response.json().catch(() => null)) as { error?: string } | null;

          if (!response.ok) {
            toast({ title: body?.error ?? "Unable to update house.", variant: "destructive" });
            return;
          }

          toast({
            title: action === "archive" ? "House archived." : "House restored to draft.",
            variant: "success",
          });
          router.refresh();
        });
      }}
    >
      {action === "archive" ? <Archive className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
      {action === "archive" ? "Archive" : "Restore"}
    </Button>
  );
}
