"use client";

import { useState, useTransition } from "react";
import type { Session } from "next-auth";
import type { Locale } from "@/config/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrencyAmd } from "@/lib/utils/format";

type BookingRequestFormProps = {
  locale: Locale;
  house: {
    id: string;
    pricePerNightAmd: number;
  };
  session: Session | null;
  copy: {
    checkIn: string;
    checkOut: string;
    guests: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
    submit: string;
    successTitle: string;
    successDescription: string;
  };
};

export function BookingRequestForm({
  locale,
  house,
  session,
  copy,
}: BookingRequestFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    guestCount: "2",
    guestName: session?.user?.name ?? "",
    guestEmail: session?.user?.email ?? "",
    guestPhone: "",
    guestNotes: "",
  });

  const updateField =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const estimate = (() => {
    if (!form.checkIn || !form.checkOut) return formatCurrencyAmd(locale, house.pricePerNightAmd);
    const nights =
      Math.max(
        1,
        Math.round(
          (new Date(`${form.checkOut}T00:00:00Z`).getTime() -
            new Date(`${form.checkIn}T00:00:00Z`).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      ) || 1;

    return formatCurrencyAmd(locale, nights * house.pricePerNightAmd);
  })();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          guestCount: Number(form.guestCount),
          houseId: house.id,
          locale,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        toast({
          title: payload?.error ?? "Booking request failed.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: copy.successTitle,
        description: copy.successDescription,
        variant: "success",
      });
      setForm((prev) => ({
        ...prev,
        checkIn: "",
        checkOut: "",
        guestCount: "2",
        guestPhone: "",
        guestNotes: "",
      }));
    });
  };

  return (
    <form onSubmit={onSubmit} className="surface-card rounded-[28px] p-5 sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted-foreground))]">
            Estimated from
          </p>
          <p className="display-font text-3xl font-medium">{estimate}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="checkIn" requiredIndicator>{copy.checkIn}</Label>
          <Input id="checkIn" type="date" value={form.checkIn} onChange={updateField("checkIn")} required />
        </div>
        <div>
          <Label htmlFor="checkOut" requiredIndicator>{copy.checkOut}</Label>
          <Input id="checkOut" type="date" value={form.checkOut} onChange={updateField("checkOut")} required />
        </div>
        <div>
          <Label htmlFor="guestCount" requiredIndicator>{copy.guests}</Label>
          <Input id="guestCount" type="number" min={1} max={12} value={form.guestCount} onChange={updateField("guestCount")} required />
        </div>
        <div>
          <Label htmlFor="guestPhone" requiredIndicator>{copy.phone}</Label>
          <Input id="guestPhone" value={form.guestPhone} onChange={updateField("guestPhone")} required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="guestName" requiredIndicator>{copy.name}</Label>
          <Input id="guestName" value={form.guestName} onChange={updateField("guestName")} required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="guestEmail" requiredIndicator>{copy.email}</Label>
          <Input id="guestEmail" type="email" value={form.guestEmail} onChange={updateField("guestEmail")} required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="guestNotes">{copy.notes}</Label>
          <Textarea id="guestNotes" rows={4} value={form.guestNotes} onChange={updateField("guestNotes")} />
        </div>
      </div>
      <Button className="mt-5 w-full" size="lg" disabled={isPending}>
        {copy.submit}
      </Button>
    </form>
  );
}
