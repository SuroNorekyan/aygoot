import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/utils/metadata";
import { Link } from "@/lib/i18n/navigation";
import { ContactForm } from "@/components/marketing/contact-form";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return createMetadata(t("hero.title"), t("hero.description"));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="grid gap-6 pb-10 lg:grid-cols-[0.92fr_1.08fr]">
      <Reveal className="surface-dark overflow-hidden rounded-[34px] p-8 text-white">
        <p className="section-kicker !text-white/54">{t("hero.eyebrow")}</p>
        <h1 className="section-title mt-4 text-5xl text-white sm:text-[4rem]">{t("hero.title")}</h1>
        <p className="mt-5 text-base leading-8 text-white/72">{t("hero.description")}</p>
        <div className="mt-8 space-y-3">
          <a
            href={siteConfig.location.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 rounded-[24px] border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/74"
          >
            <MapPin className="mt-0.5 h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{siteConfig.location.label}</span>
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex items-center gap-3 rounded-[24px] border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/74"
          >
            <Mail className="h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{siteConfig.contact.email}</span>
          </a>
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className="flex items-center gap-3 rounded-[24px] border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/74"
          >
            <Phone className="h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{siteConfig.contact.phoneDisplay}</span>
          </a>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-[24px] border border-white/8 bg-white/8 px-5 py-4 text-sm text-white/74"
          >
            <Instagram className="h-4 w-4 text-[rgb(var(--accent))]" />
            <span>{siteConfig.social.instagramHandle}</span>
          </a>
        </div>
        <div className="mt-6 overflow-hidden rounded-[26px] border border-white/10 bg-white/8">
          <iframe
            src={siteConfig.location.embedUrl}
            title={t("map.title")}
            data-testid="contact-map"
            className="h-[260px] w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <Button asChild variant="primary" className="mt-5 w-full sm:w-auto">
          <Link href="/location" locale={locale}>
            {t("map.button")}
          </Link>
        </Button>
      </Reveal>
      <Reveal delay={0.08} className="surface-card rounded-[34px] p-8">
        <ContactForm
          locale={locale}
          copy={{
            name: t("form.name"),
            email: t("form.email"),
            phone: t("form.phone"),
            message: t("form.message"),
            submit: t("form.submit"),
            success: t("form.success"),
          }}
        />
      </Reveal>
    </div>
  );
}
