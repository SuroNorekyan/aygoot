"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSignOutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
        await signOut({ callbackUrl: "/en/account" });
      }}
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}
