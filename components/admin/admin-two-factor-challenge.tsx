"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function AdminTwoFactorChallenge() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [token, setToken] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch("/api/admin/2fa/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token || undefined,
          recoveryCode: recoveryCode || undefined,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        toast({ title: payload?.error ?? "Unable to verify code.", variant: "destructive" });
        return;
      }

      toast({ title: "2FA challenge passed.", variant: "success" });
      router.push("/admin");
      router.refresh();
    });
  };

  return (
    <div className="surface-card mx-auto max-w-lg rounded-[28px] p-6">
      <div className="mb-6 space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[rgb(var(--muted-foreground))]">
          Admin access
        </p>
        <h1 className="display-font text-4xl font-medium">Enter your verification code</h1>
        <p className="text-sm leading-7 text-[rgb(var(--muted-foreground))]">
          Use your authenticator app code or one recovery code to continue.
        </p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="token">TOTP code</Label>
          <Input id="token" value={token} onChange={(event) => setToken(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="recoveryCode">Recovery code</Label>
          <Input id="recoveryCode" value={recoveryCode} onChange={(event) => setRecoveryCode(event.target.value)} />
        </div>
        <Button className="w-full" disabled={isPending}>
          Verify
        </Button>
      </form>
    </div>
  );
}
