"use client";

import { useState, useTransition } from "react";
import { CalendarRange, MailCheck, Sparkles, Users } from "lucide-react";
import type { Session } from "next-auth";
import type { Locale } from "@/config/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrencyAmd } from "@/lib/utils/format";
import { calculateStayTotalAmd } from "@/lib/utils/pricing";

type BookingRequestFormProps = {
  locale: Locale;
  house: {
    id: string;
    pricePerNightAmd: number;
    priceWorkdaysAmd: number;
    priceWeekdaysAmd: number;
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
    estimateLabel?: string;
    responseTime?: string;
    guestFlex?: string;
    privacy?: string;
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

    return formatCurrencyAmd(
      locale,
      calculateStayTotalAmd(
        new Date(`${form.checkIn}T00:00:00Z`),
        new Date(`${form.checkOut}T00:00:00Z`),
        house,
      ),
    );
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

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; mail?: { customerSent?: boolean } }
        | null;

      if (!response.ok) {
        toast({
          title: payload?.error ?? "Booking request failed.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: copy.successTitle,
        description:
          payload?.mail?.customerSent === false
            ? "Your booking request was received. Our team will contact you shortly."
            : copy.successDescription,
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
    <form onSubmit={onSubmit} className="surface-card rounded-[32px] p-5 sm:p-6">
      <div className="surface-dark overflow-hidden rounded-[26px] p-5 text-white shadow-[0_24px_54px_rgba(17,14,14,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">
              {copy.estimateLabel ?? "Estimated stay"}
            </p>
            <p
              className="display-font mt-2 text-[2.35rem] font-medium leading-none"
              suppressHydrationWarning
            >
              {estimate}
            </p>
          </div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white/88">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-5 grid gap-2.5">
          <div className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/8 px-4 py-3 text-sm text-white/76">
            <CalendarRange className="h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{copy.responseTime ?? "Availability reviewed by the Aygoot team within a day."}</span>
          </div>
          <div className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/8 px-4 py-3 text-sm text-white/76">
            <Users className="h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{copy.guestFlex ?? "Book as a guest or with your Aygoot account."}</span>
          </div>
          <div className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/8 px-4 py-3 text-sm text-white/76">
            <MailCheck className="h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{copy.privacy ?? "Confirmation and follow-up arrive clearly by email."}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
