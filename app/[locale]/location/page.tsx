import { ExternalLink, Instagram, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteConfig, type Locale } from "@/config/site";
import { createMetadata } from "@/lib/utils/metadata";
import { Link } from "@/lib/i18n/navigation";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "location" });
  return createMetadata(t("hero.title"), t("hero.description"));
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "location" });

  return (
    <div data-testid="location-page" className="space-y-8 pb-10">
      <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="surface-dark rounded-[34px] p-8 text-white sm:p-10">
          <p className="section-kicker !text-white/54">{t("hero.eyebrow")}</p>
          <h1 className="section-title mt-4 text-5xl text-white sm:text-[4rem]">
            {t("hero.title")}
          </h1>
          <p className="mt-5 text-base leading-8 text-white/72">
            {t("hero.description")}
          </p>
          <div className="mt-8 space-y-3">
            <a
              href={siteConfig.location.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 rounded-[24px] border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/76 transition hover:bg-white/12 hover:text-white"
            >
              <MapPin className="mt-0.5 h-4 w-4 text-[rgb(var(--accent))]" />
              <span>
                {siteConfig.location.label}
                <br />
                <span className="text-white/54">
                  {siteConfig.location.coordinatesLabel}
                </span>
              </span>
            </a>
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="flex items-center gap-3 rounded-[24px] border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/76 transition hover:bg-white/12 hover:text-white"
            >
              <Phone className="h-4 w-4 text-[rgb(var(--accent))]" />
              <span>{siteConfig.contact.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-3 rounded-[24px] border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/76 transition hover:bg-white/12 hover:text-white"
            >
              <Mail className="h-4 w-4 text-[rgb(var(--accent))]" />
              <span>{siteConfig.contact.email}</span>
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-[24px] border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/76 transition hover:bg-white/12 hover:text-white"
            >
              <Instagram className="h-4 w-4 text-[rgb(var(--accent))]" />
              <span>{siteConfig.social.instagramHandle}</span>
            </a>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="!bg-white !text-[rgb(var(--foreground))] hover:!bg-white/90"
            >
              <a href={siteConfig.location.mapUrl} target="_blank" rel="noreferrer">
                <Navigation className="h-4 w-4" />
                {t("actions.openMap")}
              </a>
            </Button>
            <Button
              asChild
              variant="primary"
              size="lg"
              className="!bg-white !text-[rgb(var(--foreground))] hover:!bg-white/90"
            >
              <Link href="/contact" locale={locale}>
                {t("actions.contact")}
              </Link>
            </Button>
          </div>
        </section>

        <section className="surface-card overflow-hidden rounded-[34px] p-4 sm:p-5">
          <div className="overflow-hidden rounded-[28px] border border-[rgba(var(--border-soft),0.14)] bg-white">
            <iframe
              src={siteConfig.location.embedUrl}
              title={t("map.title")}
              data-testid="location-map"
              className="h-[520px] w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="flex flex-col gap-3 px-2 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--foreground))]">
                {t("map.captionTitle")}
              </p>
              <p className="mt-1 text-sm leading-7 text-[rgb(var(--muted-foreground))]">
                {t("map.captionBody")}
              </p>
            </div>
            <a
              href={siteConfig.location.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--forest))] transition hover:text-[rgb(var(--foreground))]"
            >
              {t("actions.openInGoogle")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
