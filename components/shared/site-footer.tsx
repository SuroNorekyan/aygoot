import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Logo } from "./logo";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <footer className="mt-24 border-t border-[rgba(var(--border-soft),0.16)] bg-[linear-gradient(180deg,rgba(34,30,28,0.98),rgba(24,22,21,1))] text-[rgb(var(--primary-foreground))]">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr_0.9fr] md:py-16">
        <div className="space-y-5">
          <Logo inverted />
          <p className="max-w-md text-sm leading-8 text-white/68">
            {t("footer.description")}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-sm font-semibold text-white/82 transition hover:bg-white/10 hover:text-white"
            >
              <Instagram className="h-4 w-4" />
              {t("footer.instagram")}
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/44">
            {t("footer.exploreTitle")}
          </p>
          <div className="flex flex-col gap-3 text-sm text-white/78">
            <Link href="/" locale={locale} className="transition hover:text-white">{t("navigation.home")}</Link>
            <Link href="/houses" locale={locale} className="transition hover:text-white">{t("navigation.houses")}</Link>
            <Link href="/about" locale={locale} className="transition hover:text-white">{t("navigation.about")}</Link>
            <Link href="/contact" locale={locale} className="transition hover:text-white">{t("navigation.contact")}</Link>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/44">
            {t("footer.contactTitle")}
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.contact.address)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 text-white/76 transition hover:text-white"
          >
            <MapPin className="mt-0.5 h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{siteConfig.contact.address}</span>
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 text-white/76 transition hover:text-white">
            <Mail className="h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{siteConfig.contact.email}</span>
          </a>
          <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-3 text-white/76 transition hover:text-white">
            <Phone className="h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{siteConfig.contact.phone}</span>
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/46">
        {new Date().getFullYear()} • {t("footer.rights")}
      </div>
    </footer>
  );
}
