import Image from "next/image";
import {
  ArrowRight,
  CircleUserRound,
  Clock3,
  Languages,
  MailCheck,
  ShieldCheck,
  Sparkles,
  TreePine,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/site";
import { createMetadata } from "@/lib/utils/metadata";
import { Link } from "@/lib/i18n/navigation";
import {
  getFeaturedHouses,
  getPublishedHouses,
} from "@/features/houses/queries";
import { HouseCard } from "@/components/marketing/house-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const allHouses = await getPublishedHouses(locale);
  const experienceHouse = allHouses[3] ?? allHouses[0];
  const ctaHouse = allHouses[4] ?? allHouses[allHouses.length - 1];
  const trustItems = home.raw("trust.items") as Array<{
    title: string;
    description: string;
  }>;
  const experienceItems = home.raw("experience.items") as string[];

  const trustIcons = [ShieldCheck, CircleUserRound, MailCheck];
  const featureIcons = [Clock3, Sparkles, TreePine];

  return (
    <div className="space-y-24 pb-12 sm:space-y-28 sm:pb-16">
      <section className="hero-shine relative overflow-hidden rounded-[38px] border border-white/10 shadow-[0_32px_90px_rgba(17,14,14,0.18)]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="/videos/Cozy_Forest_Cottage_Video_Generation.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-veil absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(143,176,138,0.22),transparent_22%),radial-gradient(circle_at_15%_20%,rgba(255,247,236,0.12),transparent_18%)]" />

        <div className="relative grid min-h-[78svh] gap-8 p-6 sm:p-8 lg:min-h-[720px] lg:grid-cols-[1.02fr_0.98fr] lg:p-12 xl:p-14">
          <Reveal className="flex min-h-[520px] flex-col justify-end">
            <div className="max-w-3xl space-y-6 sm:space-y-7">
              <Badge
                className="bg-white/10 text-white backdrop-blur"
                variant="neutral"
              >
                {home("hero.eyebrow")}
              </Badge>
              <div className="space-y-4">
                <h1 className="section-title max-w-4xl text-[3.4rem] leading-[0.92] text-white sm:text-[4.4rem] lg:text-[5.6rem]">
                  {home("hero.title")}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
                  {home("hero.subtitle")}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/houses" locale={locale}>
                    {home("hero.primary")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="primary" size="lg">
                  <Link href="/about" locale={locale}>
                    {home("hero.secondary")}
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/74 backdrop-blur">
                  {home("hero.pillOne")}
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/74 backdrop-blur">
                  {home("hero.pillTwo")}
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/74 backdrop-blur">
                  {home("hero.pillThree")}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="hidden items-end justify-end lg:flex">
            <div className="w-full max-w-md space-y-4">
              <div className="surface-panel rounded-[30px] bg-white/12 p-6 text-white shadow-[0_18px_50px_rgba(17,14,14,0.18)] backdrop-blur-2xl">
                <p className="section-kicker !text-white/56">
                  {home("story.eyebrow")}
                </p>
                <h2 className="display-font mt-4 text-[2.1rem] font-medium leading-[1.02] text-white">
                  {home("story.title")}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  {home("story.body")}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="surface-panel rounded-[26px] bg-white/10 p-5 text-white backdrop-blur-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/54">
                    {home("hero.metricHouses")}
                  </p>
                  <p className="display-font mt-2 text-4xl font-medium">
                    {allHouses.length}
                  </p>
                </div>
                <div className="surface-panel rounded-[26px] bg-white/10 p-5 text-white backdrop-blur-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/54">
                    {home("hero.metricReview")}
                  </p>
                  <p className="display-font mt-2 text-4xl font-medium">24h</p>
                </div>
                <div className="surface-panel rounded-[26px] bg-white/10 p-5 text-white backdrop-blur-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/54">
                    {home("hero.metricLocales")}
                  </p>
                  <p className="display-font mt-2 text-4xl font-medium">3</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {experienceHouse?.image ? (
      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Reveal className="relative overflow-hidden rounded-[38px] border border-[rgba(var(--border-soft),0.14)] shadow-[0_26px_72px_rgba(37,28,21,0.16)]">
          <Image
            src={experienceHouse.image}
            alt={experienceHouse.imageAlt}
            fill
            sizes="(max-width: 1280px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,15,14,0.16),rgba(16,15,14,0.76)),linear-gradient(90deg,rgba(16,15,14,0.72),rgba(16,15,14,0.22))]" />
          <div className="relative flex h-full min-h-[540px] flex-col justify-end p-7 text-white sm:p-10">
            <p className="section-kicker !text-white/54">
              {home("experience.eyebrow")}
            </p>
            <h2 className="section-title mt-4 max-w-2xl text-5xl text-white sm:text-[3.8rem]">
              {home("experience.title")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/72">
              {home("experience.subtitle")}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {experienceItems.map((item, index) => {
                const Icon = featureIcons[index] ?? Sparkles;
                return (
                  <div
                    key={item}
                    className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
                  >
                    <Icon className="h-5 w-5 text-[rgb(var(--accent))]" />
                    <p className="mt-4 text-sm leading-7 text-white/82">
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* <div className="grid gap-4">
          {trustItems.map((item, index) => {
            const Icon = trustIcons[index] ?? Sparkles;
            const tone =
              index === 0
                ? "surface-dark text-white"
                : index === 1
                  ? "surface-card"
                  : "surface-panel bg-[rgba(var(--forest),0.08)]";

            return (
              <Reveal
                key={item.title}
                delay={0.06 * index}
                className={`rounded-[32px] p-7 sm:p-8 ${tone} ${index === 1 ? "xl:translate-x-5" : ""}`}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[rgb(var(--accent))] shadow-[0_12px_28px_rgba(17,14,14,0.08)] backdrop-blur">
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className={`display-font mt-6 text-[2rem] font-medium leading-[1.04] ${index === 0 ? "text-white" : "text-[rgb(var(--foreground))]"}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`mt-4 text-sm leading-8 ${index === 0 ? "text-white/72" : "text-[rgb(var(--muted-foreground))]"}`}
                >
                  {item.description}
                </p>
              </Reveal>
            );
          })}
        </div> */}
      </section>
      ) : null}

      <Reveal className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="section-kicker">{home("featured.eyebrow")}</p>
            <h2 className="section-title text-4xl sm:text-5xl">
              {home("featured.title")}
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-[rgb(var(--muted-foreground))]">
              {home("featured.subtitle")}
            </p>
          </div>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/houses" locale={locale}>
              {common("actions.viewAll")}
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredHouses.map((house, index) => (
            <Reveal key={house.id} delay={0.05 * index}>
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

      <Reveal className="overflow-hidden rounded-[38px] border border-[rgba(var(--border-soft),0.18)] bg-[rgba(255,251,245,0.62)] shadow-[0_28px_70px_rgba(37,28,21,0.1)]">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.92fr_1.08fr] lg:p-7">
          <div className="flex flex-col justify-between rounded-[30px] bg-[linear-gradient(180deg,rgba(255,251,245,0.72),rgba(245,238,228,0.9))] p-7 sm:p-8">
            <div>
              <p className="section-kicker">{home("cta.eyebrow")}</p>
              <h2 className="section-title mt-4 text-4xl sm:text-5xl">
                {home("cta.title")}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[rgb(var(--muted-foreground))]">
                {home("cta.description")}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/houses" locale={locale}>
                  {home("cta.button")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact" locale={locale}>
                  {common("actions.learnMore")}
                </Link>
              </Button>
            </div>
          </div>

          {ctaHouse?.image ? (
          <div className="relative min-h-[320px] overflow-hidden rounded-[32px]">
            <Image
              src={ctaHouse.image}
              alt={ctaHouse.imageAlt}
              fill
              sizes="(max-width: 1280px) 100vw, 52vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,14,14,0.1),rgba(17,14,14,0.76))]" />
            <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">
                {home("cta.cardEyebrow")}
              </p>
              <p className="display-font mt-3 text-[2rem] font-medium leading-[1.02]">
                {ctaHouse.name}
              </p>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/74">
                {home("cta.cardBody")}
              </p>
            </div>
          </div>
          ) : null}
        </div>
      </Reveal>
    </div>
  );
}
