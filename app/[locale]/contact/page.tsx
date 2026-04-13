import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/utils/metadata";
import { ContactForm } from "@/components/marketing/contact-form";
import { Reveal } from "@/components/shared/reveal";

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
      <Reveal className="surface-card rounded-[34px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgb(var(--muted-foreground))]">
          {t("hero.eyebrow")}
        </p>
        <h1 className="display-font mt-3 text-5xl font-medium">{t("hero.title")}</h1>
        <p className="mt-4 text-base leading-8 text-[rgb(var(--muted-foreground))]">
          {t("hero.description")}
        </p>
        <div className="mt-8 space-y-4 rounded-[28px] bg-white/70 p-5 text-sm">
          <p>{siteConfig.contact.address}</p>
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          <a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a>
        </div>
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
