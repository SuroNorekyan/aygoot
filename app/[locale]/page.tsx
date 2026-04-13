import { ArrowRight, ShieldCheck, TreePine, Waves } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/site";
import { createMetadata } from "@/lib/utils/metadata";
import { Link } from "@/lib/i18n/navigation";
import { getFeaturedHouses } from "@/features/houses/queries";
import { HouseCard } from "@/components/marketing/house-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/shared/reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return createMetadata(t("hero.title"), t("hero.subtitle"));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const home = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });
  const housesCopy = await getTranslations({ locale, namespace: "houses" });
  const featuredHouses = await getFeaturedHouses(locale);
  const trustItems = home.raw("trust.items") as Array<{ title: string; description: string }>;
  const experienceItems = home.raw("experience.items") as string[];

  return (
    <div className="space-y-20 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="surface-card overflow-hidden rounded-[36px] p-7 sm:p-9">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgb(var(--muted-foreground))]">
              {home("hero.eyebrow")}
            </p>
            <h1 className="display-font max-w-3xl text-5xl font-medium leading-[1.02] sm:text-6xl lg:text-7xl">
              {home("hero.title")}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[rgb(var(--muted-foreground))] sm:text-lg">
              {home("hero.subtitle")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/houses" locale={locale}>{home("hero.primary")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about" locale={locale}>{home("hero.secondary")}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="relative overflow-hidden rounded-[36px] bg-[rgb(var(--primary))] p-6 text-[rgb(var(--primary-foreground))]">
          <img
            src="/images/moss-1.svg"
            alt="Aygoot hero"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,14,14,0.75)] to-[rgba(17,14,14,0.12)]" />
          <div className="relative flex h-full min-h-[420px] flex-col justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              <TreePine className="h-4 w-4" />
              Dilijan mountain rhythm
            </div>
            <div className="space-y-4">
              <p className="max-w-sm text-sm leading-7 text-white/82">
                {home("story.body")}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="border-white/10 bg-white/10 p-4 text-white">
                  <p className="display-font text-3xl font-medium">3</p>
                  <p className="text-sm text-white/72">Curated houses live in the first seed collection</p>
                </Card>
                <Card className="border-white/10 bg-white/10 p-4 text-white">
                  <p className="display-font text-3xl font-medium">24h</p>
                  <p className="text-sm text-white/72">Designed for fast, human-reviewed booking responses</p>
                </Card>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgb(var(--muted-foreground))]">
              {home("featured.eyebrow")}
            </p>
            <h2 className="display-font text-4xl font-medium sm:text-5xl">
              {home("featured.title")}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[rgb(var(--muted-foreground))]">
              {home("featured.subtitle")}
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/houses" locale={locale}>{common("actions.viewAll")}</Link>
          </Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredHouses.map((house, index) => (
            <Reveal key={house.id} delay={0.04 * index}>
              <HouseCard
                locale={locale}
                house={house}
                labels={{
                  from: housesCopy("card.from"),
                  perNight: housesCopy("card.perNight"),
                  guests: housesCopy("card.guests"),
                  bedrooms: housesCopy("card.bedrooms"),
                  bathrooms: housesCopy("card.bathrooms"),
                  featured: housesCopy("card.featured"),
                  viewHouse: common("actions.viewHouse"),
                }}
              />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal className="surface-card rounded-[34px] p-7 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgb(var(--muted-foreground))]">
            {home("experience.eyebrow")}
          </p>
          <h2 className="display-font mt-3 text-4xl font-medium">{home("experience.title")}</h2>
          <div className="mt-8 space-y-4">
            {experienceItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-[24px] bg-white/70 p-4">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[rgb(var(--accent))]" />
                <p className="text-sm leading-7 text-[rgb(var(--muted-foreground))]">{item}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-[30px] bg-[rgb(var(--primary))] p-6 text-white">
            <ShieldCheck className="mb-4 h-6 w-6 text-[rgb(var(--ring))]" />
            <h3 className="display-font text-2xl font-medium">{trustItems[0]?.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/78">{trustItems[0]?.description}</p>
          </Card>
          <Card className="rounded-[30px] p-6">
            <Waves className="mb-4 h-6 w-6 text-[rgb(var(--accent))]" />
            <h3 className="display-font text-2xl font-medium">{trustItems[1]?.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted-foreground))]">{trustItems[1]?.description}</p>
          </Card>
          <Card className="rounded-[30px] p-6">
            <TreePine className="mb-4 h-6 w-6 text-[rgb(var(--accent))]" />
            <h3 className="display-font text-2xl font-medium">{trustItems[2]?.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[rgb(var(--muted-foreground))]">{trustItems[2]?.description}</p>
          </Card>
        </Reveal>
      </section>

      <Reveal className="overflow-hidden rounded-[38px] bg-[rgb(var(--primary))] px-7 py-10 text-[rgb(var(--primary-foreground))] sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
              {home("cta.title")}
            </p>
            <h2 className="display-font text-4xl font-medium sm:text-5xl">
              {home("story.title")}
            </h2>
            <p className="max-w-xl text-base leading-8 text-white/78">
              {home("cta.description")}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-[28px] border border-white/10 bg-white/10 p-6">
            <p className="text-sm leading-7 text-white/75">
              Aygoot starts with a focused product: premium houses, multilingual presentation, a guest-friendly request flow, and an admin console built for real hospitality operations.
            </p>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/houses" locale={locale}>{home("cta.button")}</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
