"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import type { Locale } from "@/config/site";
import { localeLabels, locales } from "@/config/site";
import { formatCurrencyAmd, formatDateRange, formatDateTime } from "@/lib/utils/format";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/status-badge";
import { LogoutButton } from "@/components/shared/logout-button";
import { useToast } from "@/components/ui/use-toast";

type BookingSummary = {
  id: string;
  status: string;
  checkIn: Date;
  checkOut: Date;
  totalPriceAmd: number;
  guestCount: number;
  createdAt: Date;
  house: {
    slug: string;
    name: string;
    image: string | null;
  };
};

type AccountDashboardProps = {
  locale: Locale;
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
    preferredLocale: string | null;
    image: string | null;
    createdAt: Date;
    hasPassword: boolean;
  };
  bookings: BookingSummary[];
  copy: {
    eyebrow: string;
    title: string;
    description: string;
    history: string;
    empty: string;
    signOut: string;
  };
};

export function AccountDashboard({ locale, user, bookings, copy }: AccountDashboardProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    preferredLocale: (user.preferredLocale as Locale | null) ?? locale,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailForm, setEmailForm] = useState({
    email: user.email ?? "",
    currentPassword: "",
  });
  const nextBooking = bookings.find((booking) => new Date(booking.checkOut) >= new Date()) ?? bookings[0];

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        toast({ title: body?.error ?? "Unable to update profile.", variant: "destructive" });
        return;
      }

      toast({ title: "Profile updated.", variant: "success" });
    });
  };

  const changePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        toast({ title: body?.error ?? "Unable to change password.", variant: "destructive" });
        return;
      }

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({ title: "Password changed.", variant: "success" });
    });
  };

  const changeEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch("/api/account/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailForm),
      });
      const body = (await response.json().catch(() => null)) as { error?: string; signInRequired?: boolean } | null;

      if (!response.ok) {
        toast({ title: body?.error ?? "Unable to change email.", variant: "destructive" });
        return;
      }

      toast({ title: "Email changed. Please sign in again.", variant: "success" });
      await signOut({ callbackUrl: `/${locale}/account` });
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <section className="surface-card rounded-[34px] p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgb(var(--muted-foreground))]">
              {copy.eyebrow}
            </p>
            <h1 className="display-font mt-3 text-5xl font-medium">{copy.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[rgb(var(--muted-foreground))]">
              {copy.description}
            </p>
          </div>
          <LogoutButton callbackUrl={`/${locale}`}>{copy.signOut}</LogoutButton>
        </div>
      </section>

      <nav className="flex flex-wrap gap-2">
        {["overview", "profile", "bookings", "security"].map((item) => (
          <a key={item} href={`#${item}`} className="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold capitalize">
            {item === "bookings" ? copy.history : item}
          </a>
        ))}
      </nav>

      <section id="overview" className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="surface-card rounded-[28px] p-6">
          <h2 className="display-font text-3xl font-medium">Overview</h2>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-[22px] bg-white/70 p-4">
              <dt className="font-semibold">Name</dt>
              <dd className="mt-1 text-[rgb(var(--muted-foreground))]">{user.name ?? "Not set"}</dd>
            </div>
            <div className="rounded-[22px] bg-white/70 p-4">
              <dt className="font-semibold">Email</dt>
              <dd className="mt-1 text-[rgb(var(--muted-foreground))]">{user.email}</dd>
            </div>
            <div className="rounded-[22px] bg-white/70 p-4">
              <dt className="font-semibold">Phone</dt>
              <dd className="mt-1 text-[rgb(var(--muted-foreground))]">{user.phone ?? "Not set"}</dd>
            </div>
            <div className="rounded-[22px] bg-white/70 p-4">
              <dt className="font-semibold">Preferred language</dt>
              <dd className="mt-1 text-[rgb(var(--muted-foreground))]">
                {localeLabels[(user.preferredLocale as Locale | null) ?? locale]}
              </dd>
            </div>
            <div className="rounded-[22px] bg-white/70 p-4 sm:col-span-2">
              <dt className="font-semibold">Account created</dt>
              <dd className="mt-1 text-[rgb(var(--muted-foreground))]">{formatDateTime(locale, user.createdAt)}</dd>
            </div>
          </dl>
        </div>
        <div className="surface-card rounded-[28px] p-6">
          <h2 className="display-font text-3xl font-medium">Stay summary</h2>
          {nextBooking ? (
            <div className="mt-5 space-y-3 rounded-[22px] bg-white/70 p-4">
              <p className="font-semibold">{nextBooking.house.name}</p>
              <p className="text-sm text-[rgb(var(--muted-foreground))]">
                {formatDateRange(locale, nextBooking.checkIn, nextBooking.checkOut)}
              </p>
              <StatusBadge status={nextBooking.status} />
            </div>
          ) : (
            <p className="mt-5 rounded-[22px] bg-white/70 p-4 text-sm text-[rgb(var(--muted-foreground))]">
              {copy.empty}
            </p>
          )}
        </div>
      </section>

      <section id="profile" className="surface-card rounded-[28px] p-6">
        <h2 className="display-font text-3xl font-medium">My profile</h2>
        <form onSubmit={saveProfile} className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="profile-name" requiredIndicator>Name</Label>
            <Input id="profile-name" value={profile.name} onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="profile-phone">Phone</Label>
            <Input id="profile-phone" value={profile.phone} onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="profile-locale">Preferred language</Label>
            <select
              id="profile-locale"
              value={profile.preferredLocale}
              onChange={(event) => setProfile((prev) => ({ ...prev, preferredLocale: event.target.value as Locale }))}
              className="h-12 w-full rounded-2xl border border-[rgba(var(--border),0.9)] bg-white/80 px-4 text-sm"
            >
              {locales.map((item) => (
                <option key={item} value={item}>
                  {localeLabels[item]}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Button disabled={isPending}>Save profile</Button>
          </div>
        </form>
      </section>

      <section id="bookings" className="space-y-4">
        <h2 className="display-font text-3xl font-medium">{copy.history}</h2>
        {bookings.length ? (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="surface-card rounded-[28px] p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    {booking.house.image ? (
                      <div className="relative h-20 w-24 overflow-hidden rounded-[18px]">
                        <Image src={booking.house.image} alt={booking.house.name} fill sizes="96px" className="object-cover" />
                      </div>
                    ) : null}
                    <div>
                      <Link href={`/houses/${booking.house.slug}`} locale={locale} className="display-font text-2xl font-medium">
                        {booking.house.name}
                      </Link>
                      <p className="text-sm text-[rgb(var(--muted-foreground))]">
                        {formatDateRange(locale, booking.checkIn, booking.checkOut)}
                      </p>
                      <p className="text-xs text-[rgb(var(--muted-foreground))]">
                        Requested {formatDateTime(locale, booking.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrencyAmd(locale, booking.totalPriceAmd)}</p>
                      <p className="text-xs text-[rgb(var(--muted-foreground))]">{booking.guestCount} guests</p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-card rounded-[28px] p-6 text-sm text-[rgb(var(--muted-foreground))]">{copy.empty}</div>
        )}
      </section>

      <section id="security" className="grid gap-5 lg:grid-cols-2">
        <div className="surface-card rounded-[28px] p-6">
          <h2 className="display-font text-3xl font-medium">Change password</h2>
          {user.hasPassword ? (
            <form onSubmit={changePassword} className="mt-5 space-y-4">
              <div>
                <Label htmlFor="current-password" requiredIndicator>Current password</Label>
                <Input id="current-password" type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="new-password" requiredIndicator>New password</Label>
                <Input id="new-password" type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))} required />
                <p className="mt-2 text-xs text-[rgb(var(--muted-foreground))]">
                  Use uppercase, lowercase, number, and symbol characters.
                </p>
              </div>
              <div>
                <Label htmlFor="confirm-new-password" requiredIndicator>Confirm new password</Label>
                <Input id="confirm-new-password" type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))} required />
              </div>
              <Button disabled={isPending}>Change password</Button>
            </form>
          ) : (
            <p className="mt-5 rounded-[22px] bg-white/70 p-4 text-sm text-[rgb(var(--muted-foreground))]">
              This account signs in with an external provider, so password changes are not available here.
            </p>
          )}
        </div>

        <div className="surface-card rounded-[28px] p-6">
          <h2 className="display-font text-3xl font-medium">Change email</h2>
          {user.hasPassword ? (
            <form onSubmit={changeEmail} className="mt-5 space-y-4">
              <div>
                <Label htmlFor="email-change" requiredIndicator>New email</Label>
                <Input id="email-change" type="email" value={emailForm.email} onChange={(event) => setEmailForm((prev) => ({ ...prev, email: event.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="email-password" requiredIndicator>Current password</Label>
                <Input id="email-password" type="password" value={emailForm.currentPassword} onChange={(event) => setEmailForm((prev) => ({ ...prev, currentPassword: event.target.value }))} required />
              </div>
              <Button disabled={isPending}>Change email</Button>
            </form>
          ) : (
            <p className="mt-5 rounded-[22px] bg-white/70 p-4 text-sm text-[rgb(var(--muted-foreground))]">
              Provider-managed email changes are not currently supported.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
