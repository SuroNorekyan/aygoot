"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function DeleteHouseButton({ houseId, houseName }: { houseId: string; houseName: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          `Permanently delete ${houseName}? Use archive unless this house has no bookings or history.`,
        );
        if (!confirmed) return;

        startTransition(async () => {
          const response = await fetch(`/api/admin/houses/${houseId}`, {
            method: "DELETE",
          });

          const body = (await response.json().catch(() => null)) as { error?: string } | null;

          if (!response.ok) {
            toast({ title: body?.error ?? "Unable to delete house.", variant: "destructive" });
            return;
          }

          toast({ title: "House deleted.", variant: "success" });
          router.push("/admin/houses");
          router.refresh();
        });
      }}
    >
      Hard delete
    </Button>
  );
}
