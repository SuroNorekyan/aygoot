import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
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
    </div>
  );
}
