import type { Locale } from "@/config/site";

const intlLocaleMap: Record<Locale, string> = {
  en: "en-US",
  hy: "hy-AM",
  ru: "ru-RU",
};

export const formatCurrencyAmd = (locale: Locale, amount: number) =>
  new Intl.NumberFormat(intlLocaleMap[locale], {
    style: "currency",
    currency: "AMD",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDateRange = (
  locale: Locale,
  start: Date | string,
  end: Date | string,
) => {
  const formatter = new Intl.DateTimeFormat(intlLocaleMap[locale], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
};

export const formatNumber = (locale: Locale, value: number) =>
  new Intl.NumberFormat(intlLocaleMap[locale]).format(value);

export const formatDateTime = (locale: Locale, value: Date | string) =>
  new Intl.DateTimeFormat(intlLocaleMap[locale], {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
