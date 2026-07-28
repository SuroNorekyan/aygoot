import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/config/site";
import { isLocale } from "@/config/site";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { ExelyScript } from "@/components/exely/exely-script";
import { LocalizedPublicShell } from "@/components/exely/localized-public-shell";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "hy" }, { locale: "ru" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const messages = await getMessages();
  const bookingMessages = messages.booking as {
    exely?: {
      unavailable?: string;
      contactAction?: string;
      searchRegion?: string;
    };
  };
  const unavailable =
    bookingMessages.exely?.unavailable ??
    "Online booking is temporarily unavailable. Please contact AyGood directly.";
  const contactAction = bookingMessages.exely?.contactAction ?? "Email AyGood";
  const searchRegion = bookingMessages.exely?.searchRegion ?? "Online booking search";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ExelyScript locale={locale} />
      <SiteHeader locale={locale} />
      <LocalizedPublicShell
        locale={locale}
        footer={<SiteFooter locale={locale} />}
        searchFallbackMessage={unavailable}
        contactLabel={contactAction}
        searchRegionLabel={searchRegion}
      >
        {children}
      </LocalizedPublicShell>
    </NextIntlClientProvider>
  );
}
