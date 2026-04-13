import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <footer className="mt-24 border-t border-[rgba(var(--border),0.4)] bg-[rgba(255,250,242,0.65)]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="display-font text-3xl font-medium">Aygoot</p>
          <p className="max-w-md text-sm leading-7 text-[rgb(var(--muted-foreground))]">
            {t("footer.description")}
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[rgb(var(--muted-foreground))]">
            Explore
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/" locale={locale}>Home</Link>
            <Link href="/houses" locale={locale}>Houses</Link>
            <Link href="/about" locale={locale}>About</Link>
            <Link href="/contact" locale={locale}>Contact</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[rgb(var(--muted-foreground))]">
            {t("footer.contactTitle")}
          </p>
          <p>{siteConfig.contact.address}</p>
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">
            {t("footer.instagram")}
          </a>
        </div>
      </div>
      <div className="border-t border-[rgba(var(--border),0.32)] py-4 text-center text-xs text-[rgb(var(--muted-foreground))]">
        {t("footer.rights")}
      </div>
    </footer>
  );
}
