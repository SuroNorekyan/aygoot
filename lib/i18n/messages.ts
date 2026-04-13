import type { Locale } from "@/config/site";

const loaders = {
  en: {
    common: () => import("@/messages/en/common.json"),
    home: () => import("@/messages/en/home.json"),
    houses: () => import("@/messages/en/houses.json"),
    about: () => import("@/messages/en/about.json"),
    contact: () => import("@/messages/en/contact.json"),
    account: () => import("@/messages/en/account.json"),
    booking: () => import("@/messages/en/booking.json"),
  },
  hy: {
    common: () => import("@/messages/hy/common.json"),
    home: () => import("@/messages/hy/home.json"),
    houses: () => import("@/messages/hy/houses.json"),
    about: () => import("@/messages/hy/about.json"),
    contact: () => import("@/messages/hy/contact.json"),
    account: () => import("@/messages/hy/account.json"),
    booking: () => import("@/messages/hy/booking.json"),
  },
  ru: {
    common: () => import("@/messages/ru/common.json"),
    home: () => import("@/messages/ru/home.json"),
    houses: () => import("@/messages/ru/houses.json"),
    about: () => import("@/messages/ru/about.json"),
    contact: () => import("@/messages/ru/contact.json"),
    account: () => import("@/messages/ru/account.json"),
    booking: () => import("@/messages/ru/booking.json"),
  },
} as const;

export async function getLocaleMessages(locale: Locale) {
  const current = loaders[locale];
  const [common, home, houses, about, contact, account, booking] = await Promise.all([
    current.common(),
    current.home(),
    current.houses(),
    current.about(),
    current.contact(),
    current.account(),
    current.booking(),
  ]);

  return {
    common: common.default,
    home: home.default,
    houses: houses.default,
    about: about.default,
    contact: contact.default,
    account: account.default,
    booking: booking.default,
  };
}
