import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig, type Locale } from "@/config/site";
import { createMetadata } from "@/lib/utils/metadata";
import { ExelyBookingForm } from "@/components/exely/exely-booking-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return createMetadata(t("page.title"), t("page.description"));
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "booking" });

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5 pb-6">
      <header className="max-w-3xl">
        <p className="section-kicker">{t("page.eyebrow")}</p>
        <h1 className="section-title mt-3 text-4xl sm:text-5xl">
          {t("page.heading")}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted-foreground))] sm:text-base sm:leading-8">
          {t("page.description")}
        </p>
      </header>
      <ExelyBookingForm
        locale={locale}
        fallbackMessage={t("exely.unavailable")}
        contactLabel={t("exely.contactAction")}
        regionLabel={t("exely.bookingRegion")}
      />
      <aside className="surface-card grid gap-5 rounded-[28px] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div>
          <p className="section-kicker">{t("support.eyebrow")}</p>
          <h2 className="display-font mt-3 text-2xl font-medium">
            {t("support.title")}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgb(var(--muted-foreground))]">
            {t("support.description")}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:min-w-[220px]">
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(var(--forest))] px-4 py-3 text-sm font-semibold text-[rgb(var(--forest-foreground))] transition hover:bg-[rgba(var(--forest),0.92)]"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.contact.phoneDisplay}
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(var(--border-soft),0.36)] bg-white/60 px-4 py-3 text-sm font-semibold text-[rgb(var(--foreground))] transition hover:bg-white"
          >
            <Mail className="h-4 w-4 text-[rgb(var(--forest))]" />
            {t("support.emailAction")}
          </a>
        </div>
      </aside>
    </div>
  );
}
