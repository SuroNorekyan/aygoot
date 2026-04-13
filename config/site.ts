export const locales = ["en", "hy", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const siteConfig = {
  name: "Aygoot",
  shortName: "Aygoot",
  domain: "aygoot.am",
  description:
    "Premium private house rentals in Dilijan, Armenia. Curated cabins, forest retreats, and elegant stays designed for calm, comfort, and trust.",
  defaultLocale,
  locales,
  contact: {
    email: "hello@aygoot.am",
    phone: "+374 00 000000",
    address: "Dilijan, Tavush Province, Armenia",
  },
  social: {
    instagram: "https://instagram.com/aygoot",
  },
  company: {
    legalName: "Aygoot LLC",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hy: "Հայերեն",
  ru: "Русский",
};

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const resolveLocale = (value?: string | null): Locale => {
  if (!value) return defaultLocale;
  return isLocale(value) ? value : defaultLocale;
};
