import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/config/site";
import { getLocaleMessages } from "./messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const localeCandidate = await requestLocale;
  const locale: Locale = isLocale(localeCandidate ?? "")
    ? (localeCandidate as Locale)
    : defaultLocale;

  return {
    locale,
    messages: await getLocaleMessages(locale),
  };
});
