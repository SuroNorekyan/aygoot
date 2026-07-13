import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { publicNavigation } from "@/config/navigation";
import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Logo } from "./logo";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <footer
      data-testid="site-footer"
      className="mt-24 overflow-hidden border-t border-[rgba(var(--border-soft),0.16)] bg-[linear-gradient(180deg,rgba(36,31,28,0.98),rgba(21,19,18,1))] text-[rgb(var(--primary-foreground))]"
    >
      <div className="container-shell py-10 md:py-12">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.18)] backdrop-blur sm:p-5">
          <div className="grid gap-3 lg:grid-cols-3">
            <Link
              href="/location"
              locale={locale}
              className="flex min-h-16 items-center gap-3 rounded-[24px] bg-white/[0.055] px-4 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-[rgb(var(--accent))]">
                <MapPin className="h-4 w-4" />
              </span>
              <span>{siteConfig.location.label}</span>
            </Link>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex min-h-16 items-center gap-3 rounded-[24px] bg-white/[0.055] px-4 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-[rgb(var(--accent))]">
                <Mail className="h-4 w-4" />
              </span>
              <span className="break-all">{siteConfig.contact.email}</span>
            </a>
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="flex min-h-16 items-center gap-3 rounded-[24px] bg-white/[0.055] px-4 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-[rgb(var(--accent))]">
                <Phone className="h-4 w-4" />
              </span>
              <span>{siteConfig.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_0.9fr] md:py-14">
          <div className="space-y-5">
            <Logo inverted />
            <p className="max-w-md text-sm leading-8 text-white/66">
              {t("footer.description")}
            </p>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-sm font-semibold text-white/82 transition hover:bg-white/10 hover:text-white"
            >
              <Instagram className="h-4 w-4" />
              {siteConfig.social.instagramHandle}
            </a>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/44">
              {t("footer.exploreTitle")}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/78 sm:flex sm:flex-col sm:gap-3">
              {publicNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  className="rounded-full px-0 py-1 transition hover:text-white sm:py-0"
                >
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/44">
              {t("footer.contactTitle")}
            </p>
            <div className="space-y-3">
              <Link
                href="/location"
                locale={locale}
                className="flex items-start gap-3 text-white/76 transition hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 text-[rgb(var(--accent))]" />
                <span>{siteConfig.location.label}</span>
              </Link>
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 text-white/76 transition hover:text-white">
                <Mail className="h-4 w-4 text-[rgb(var(--accent))]" />
                <span className="break-all">{siteConfig.contact.email}</span>
              </a>
              <a href={`tel:${siteConfig.contact.phoneHref}`} className="flex items-center gap-3 text-white/76 transition hover:text-white">
                <Phone className="h-4 w-4 text-[rgb(var(--accent))]" />
                <span>{siteConfig.contact.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/46">
        {new Date().getFullYear()} • {t("footer.rights")}
      </div>
    </footer>
  );
}
