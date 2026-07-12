import Image from "next/image";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/site";
import { getUserBookings } from "@/features/bookings/service";
import { createMetadata } from "@/lib/utils/metadata";
import { AccountAuthPanel } from "@/components/marketing/account-auth-panel";
import { LogoutButton } from "@/components/shared/logout-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrencyAmd, formatDateRange } from "@/lib/utils/format";
import { Link } from "@/lib/i18n/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return createMetadata(t("auth.title"), t("auth.subtitle"));
}

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  const common = await getTranslations({ locale, namespace: "common" });
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (!session?.user) {
    return (
      <div className="pb-12 pt-6">
        <AccountAuthPanel
          locale={locale}
          callbackUrl={callbackUrl ?? `/${locale}/account`}
          copy={{
            title: t("auth.title"),
            subtitle: t("auth.subtitle"),
            name: t("auth.name"),
            email: t("auth.email"),
            password: t("auth.password"),
            confirmPassword: t("auth.confirmPassword"),
            passwordHint: t("auth.passwordHint"),
            login: t("auth.login"),
            register: t("auth.register"),
            switchToRegister: t("auth.switchToRegister"),
            switchToLogin: t("auth.switchToLogin"),
          }}
        />
      </div>
    );
  }

  const bookings = await getUserBookings(session.user.id, locale);

  return (
    <div className="space-y-8 pb-10">
      <section className="surface-card rounded-[34px] p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgb(var(--muted-foreground))]">
              {t("dashboard.eyebrow")}
            </p>
            <h1 className="display-font mt-3 text-5xl font-medium">{t("dashboard.title")}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[rgb(var(--muted-foreground))]">
              {t("dashboard.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {session.user.role === "ADMIN" ? (
              <a
                href="/admin"
                className="inline-flex items-center rounded-full bg-[rgb(var(--primary))] px-5 py-3 text-sm font-semibold text-[rgb(var(--primary-foreground))]"
              >
                {common("navigation.admin")}
              </a>
            ) : null}
            <LogoutButton callbackUrl={`/${locale}`}>{t("dashboard.signOut")}</LogoutButton>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="display-font text-3xl font-medium">{t("dashboard.history")}</h2>
        {bookings.length ? (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="surface-card rounded-[28px] p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    {booking.house.image ? (
                      <div className="relative h-20 w-24 overflow-hidden rounded-[18px]">
                        <Image
                          src={booking.house.image}
                          alt={booking.house.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div>
                      <Link href={`/houses/${booking.house.slug}`} locale={locale} className="display-font text-2xl font-medium">
                        {booking.house.name}
                      </Link>
                      <p className="text-sm text-[rgb(var(--muted-foreground))]">
                        {formatDateRange(locale, booking.checkIn, booking.checkOut)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrencyAmd(locale, booking.totalPriceAmd)}</p>
                      <p className="text-xs text-[rgb(var(--muted-foreground))]">
                        {booking.guestCount} guests
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-card rounded-[28px] p-6 text-sm text-[rgb(var(--muted-foreground))]">
            {t("dashboard.empty")}
          </div>
        )}
      </section>
    </div>
  );
}
