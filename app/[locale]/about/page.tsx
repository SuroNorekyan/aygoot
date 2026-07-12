import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/site";
import { createMetadata } from "@/lib/utils/metadata";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/shared/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return createMetadata(t("hero.title"), t("hero.description"));
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const pillars = t.raw("pillars") as Array<{ title: string; description: string }>;

  return (
    <div className="space-y-10 pb-10">
      <Reveal className="surface-card rounded-[34px] p-8">
        <p className="section-kicker">{t("hero.eyebrow")}</p>
        <h1 className="section-title mt-4 text-5xl sm:text-[4.2rem]">{t("hero.title")}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[rgb(var(--muted-foreground))]">
          {t("hero.description")}
        </p>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.title} delay={0.05 * index}>
            <Card className="h-full rounded-[30px] p-6">
              <h2 className="display-font text-3xl font-medium">{pillar.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted-foreground))]">{pillar.description}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
