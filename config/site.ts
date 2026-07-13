export const locales = ["en", "hy", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const siteConfig = {
  name: "Aygoot",
  shortName: "AyGood",
  domain: "aygoot.am",
  description:
    "AyGood River Lake Eco Resort in Dilijan, Armenia with private cottages, lakeside activities, and nature-focused services.",
  defaultLocale,
  locales,
  logo: {
    src: "/mediaNew/logos/logo-1.JPG",
    alt: "AyGood River Lake Eco Resort",
  },
  contact: {
    email: "aygoodriverlake@gmail.com",
    phoneDisplay: "093 717 110",
    phoneHref: "+37493717110",
  },
  social: {
    instagram: "https://www.instagram.com/aygood.riverlake",
    instagramHandle: "@aygood.riverlake",
  },
  location: {
    label: "Dilijan, Tavush Province, Armenia",
    coordinatesLabel: "40°40'35.0\"N 45°11'57.5\"E",
    latitude: 40.676378,
    longitude: 45.199315,
    mapUrl:
      "https://www.google.com/maps/place/40%C2%B040'35.0%22N+45%C2%B011'57.5%22E/@40.676378,45.199315,17z/data=!3m1!4b1!4m4!3m3!8m2!3d40.676378!4d45.199315?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3025.8901675805505!2d45.199305599999995!3d40.6763889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDDCsDQwJzM1LjAiTiA0NcKwMTEnNTcuNSJF!5e0!3m2!1sen!2sam!4v1783898573447!5m2!1sen!2sam",
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

export const localeMeta: Record<
  Locale,
  {
    label: string;
    shortLabel: string;
    flag: string;
  }
> = {
  en: {
    label: "English",
    shortLabel: "EN",
    flag: "🇺🇸",
  },
  hy: {
    label: "Հայերեն",
    shortLabel: "HY",
    flag: "🇦🇲",
  },
  ru: {
    label: "Русский",
    shortLabel: "RU",
    flag: "🇷🇺",
  },
};

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const resolveLocale = (value?: string | null): Locale => {
  if (!value) return defaultLocale;
  return isLocale(value) ? value : defaultLocale;
};
