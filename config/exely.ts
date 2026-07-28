import { defaultLocale, type Locale } from "@/config/site";

export const exelyContextId = "BE-INT-aygoodriverlake_2026-07-22";

export const exelyGoogleVerificationToken =
  "3gTyKFiP8IZTaEaJgvuXRa_bSDMbdrmIyW-u49HHzBU";

export const exelyLoaderHosts = [
  "am-ibe.hopenapi.com",
  "ibe.hopenapi.com",
  "ibe.behopenapi.com",
] as const;

export const exelyContainers = {
  searchForm: "be-search-form",
  bookingForm: "be-booking-form",
} as const;

export const siteLocaleToExelyLocale = {
  en: "en",
  hy: "am",
  ru: "ru",
} as const satisfies Record<Locale, "en" | "am" | "ru">;

export type ExelyLocale = (typeof siteLocaleToExelyLocale)[Locale];

export const exelyRoomTypes = [
  {
    id: "5077490",
    label: "Коттедж с тремя спальнями",
    englishLabel: "Three-bedroom cottage",
  },
  {
    id: "5077491",
    label: "Коттедж с одной спальней и с фурако",
    englishLabel: "One-bedroom cottage with furako",
  },
  {
    id: "5077492",
    label: "Коттедж с одной спальней и с видом на речку",
    englishLabel: "One-bedroom cottage with river view",
  },
  {
    id: "5077493",
    label: "Коттедж с одной спальней и с видом на озеро",
    englishLabel: "One-bedroom cottage with lake view",
  },
  {
    id: "5077538",
    label: "Коттедж с тремя спальнями и чаном",
    englishLabel: "Three-bedroom cottage with hot tub/chan",
  },
] as const;

export const exelySpecialOffers = [
  {
    id: "10166034",
    label: "Лучшая цена дня",
    englishLabel: "Best price of the day",
  },
  {
    id: "10166187",
    label: "Стандартный тариф с завтраком",
    englishLabel: "Standard rate with breakfast",
  },
  {
    id: "10166624",
    label: "Стандартный тариф",
    englishLabel: "Standard rate",
  },
] as const;

export type ExelyRoomTypeId = (typeof exelyRoomTypes)[number]["id"];
export type ExelySpecialOfferId = (typeof exelySpecialOffers)[number]["id"];

const exelyRoomTypeIds = new Set<string>(exelyRoomTypes.map((room) => room.id));
const exelyOfferIds = new Set<string>(exelySpecialOffers.map((offer) => offer.id));

export function getExelyLocale(locale: Locale): ExelyLocale {
  return siteLocaleToExelyLocale[locale];
}

export function isSupportedExelyRoomTypeId(
  value: unknown,
): value is ExelyRoomTypeId {
  return typeof value === "string" && exelyRoomTypeIds.has(value);
}

export function isSupportedExelyOfferId(
  value: unknown,
): value is ExelySpecialOfferId {
  return typeof value === "string" && exelyOfferIds.has(value);
}

const normalizeIds = (value?: string | string[] | null) => {
  if (!value) return undefined;
  const ids = Array.isArray(value) ? value : value.split(",");
  const cleaned = ids.map((id) => id.trim()).filter(Boolean);
  return cleaned.length ? cleaned.join(",") : undefined;
};

export function buildExelyBookingHref(
  locale: Locale = defaultLocale,
  options: {
    roomType?: string | string[] | null;
    specialOffer?: string | string[] | null;
  } = {},
) {
  const params = new URLSearchParams();
  const roomType = normalizeIds(options.roomType);
  const specialOffer = normalizeIds(options.specialOffer);

  if (roomType) params.set("room-type", roomType);
  if (specialOffer) params.set("special-offer", specialOffer);

  const query = params.toString();
  return `/${locale}/booking${query ? `?${query}` : ""}`;
}
