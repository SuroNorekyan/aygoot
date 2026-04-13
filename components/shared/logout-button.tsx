"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton({ callbackUrl, children }: { callbackUrl: string; children: React.ReactNode }) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        void signOut({ callbackUrl });
      }}
    >
      {children}
    </Button>
  );
}
