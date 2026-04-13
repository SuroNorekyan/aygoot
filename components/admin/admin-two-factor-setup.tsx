"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function AdminTwoFactorSetup({ enabled }: { enabled: boolean }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const prepare = () => {
    startTransition(async () => {
      const response = await fetch("/api/admin/2fa/setup", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as {
        qrCode?: string;
        manualEntry?: string;
        error?: string;
      } | null;

      if (!response.ok || !payload?.qrCode) {
        toast({ title: payload?.error ?? "Unable to prepare 2FA.", variant: "destructive" });
        return;
      }

      setQrCode(payload.qrCode);
      setManualEntry(payload.manualEntry ?? null);
      setRecoveryCodes([]);
    });
  };

  const verify = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/admin/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const payload = (await response.json().catch(() => null)) as {
        recoveryCodes?: string[];
        error?: string;
      } | null;

      if (!response.ok) {
        toast({ title: payload?.error ?? "Unable to verify code.", variant: "destructive" });
        return;
      }

      setRecoveryCodes(payload?.recoveryCodes ?? []);
      toast({ title: "Two-factor authentication enabled.", variant: "success" });
    });
  };

  return (
    <div className="surface-card rounded-[28px] p-6">
      <div className="mb-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[rgb(var(--muted-foreground))]">
          Admin security
        </p>
        <h2 className="display-font text-3xl font-medium">Two-factor authentication</h2>
        <p className="text-sm leading-7 text-[rgb(var(--muted-foreground))]">
          Protect the admin console with TOTP codes and recovery codes.
        </p>
        {enabled ? <p className="text-sm font-semibold text-emerald-700">2FA is currently enabled.</p> : null}
      </div>
      <Button onClick={prepare} disabled={isPending}>
        Generate new setup
      </Button>
      {qrCode ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          <div className="rounded-[24px] bg-white p-4">
            <Image src={qrCode} alt="2FA QR code" width={220} height={220} unoptimized />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Manual code</p>
              <p className="mt-2 rounded-2xl bg-white/80 px-4 py-3 font-mono text-sm">{manualEntry}</p>
            </div>
            <form onSubmit={verify} className="space-y-3">
              <div>
                <Label htmlFor="totp">Verification code</Label>
                <Input id="totp" value={token} onChange={(event) => setToken(event.target.value)} />
              </div>
              <Button disabled={isPending}>Verify and enable</Button>
            </form>
          </div>
        </div>
      ) : null}
      {recoveryCodes.length ? (
        <div className="mt-6 space-y-3">
          <p className="font-semibold">Recovery codes</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {recoveryCodes.map((code) => (
              <div key={code} className="rounded-2xl bg-white/80 px-4 py-3 font-mono text-sm">
                {code}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
