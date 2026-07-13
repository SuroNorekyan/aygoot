import Image from "next/image";
import {
  ArrowRight,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { serviceDefinitions } from "@/config/services";
import { siteConfig, type Locale } from "@/config/site";
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
  const servicesHouse = allHouses.find((house) => house.image);
  const ctaHouse = allHouses[4] ?? allHouses[allHouses.length - 1];
  const services = serviceDefinitions.map((service) => ({
    ...service,
    title: home(`services.items.${service.id}.title`),
    description: home(`services.items.${service.id}.description`),
  }));
  const heroTitleClass =
    locale === "hy"
      ? "text-[2.55rem] sm:text-[3.3rem] lg:text-[4.2rem] xl:text-[4.65rem]"
      : "text-[3.05rem] sm:text-[4.1rem] lg:text-[5.1rem] xl:text-[5.6rem]";

  return (
    <div className="space-y-24 pb-12 sm:space-y-28 sm:pb-16">
      <section
        data-testid="home-hero"
        className="hero-shine relative overflow-hidden rounded-[38px] border border-white/10 shadow-[0_32px_90px_rgba(17,14,14,0.18)]"
      >
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

        <div className="relative grid min-h-[78svh] gap-8 p-5 sm:p-8 lg:min-h-[720px] lg:grid-cols-[1.02fr_0.98fr] lg:p-12 xl:p-14">
          <Reveal className="flex min-w-0 flex-col justify-end lg:min-h-[620px]">
            <div className="max-w-3xl space-y-5 sm:space-y-6">
              <Badge
                className="bg-white/10 text-white backdrop-blur"
                variant="neutral"
              >
                {home("hero.eyebrow")}
              </Badge>
              <div className="space-y-4">
                <h1 className={`section-title max-w-4xl leading-[0.94] text-white ${heroTitleClass}`}>
                  {home("hero.title")}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
                  {home("hero.subtitle")}
                </p>
              </div>
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="w-full max-w-full px-5 sm:w-auto sm:px-8">
                  <Link href="/houses" locale={locale}>
                    {home("hero.primary")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="primary" size="lg" className="w-full max-w-full px-5 sm:w-auto sm:px-8">
                  <Link href="/location" locale={locale}>
                    {home("hero.secondary")}
                  </Link>
                </Button>
              </div>
              <div data-testid="home-hero-pills" className="hidden flex-wrap gap-3 pt-2 sm:flex">
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
                  {home("heroCard.eyebrow")}
                </p>
                <h2 className="display-font mt-4 text-[2.1rem] font-medium leading-[1.02] text-white">
                  {home("heroCard.title")}
                </h2>
                <div className="mt-5 space-y-3 text-sm text-white/76">
                  <a
                    href={siteConfig.location.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 transition hover:text-white"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 text-[rgb(var(--accent))]" />
                    <span>{siteConfig.location.label}</span>
                  </a>
                  <a
                    href={`tel:${siteConfig.contact.phoneHref}`}
                    className="flex items-center gap-3 transition hover:text-white"
                  >
                    <Phone className="h-4 w-4 text-[rgb(var(--accent))]" />
                    <span>{siteConfig.contact.phoneDisplay}</span>
                  </a>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="flex items-center gap-3 transition hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-[rgb(var(--accent))]" />
                    <span>{siteConfig.contact.email}</span>
                  </a>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="surface-panel rounded-[26px] bg-white/10 p-5 text-white backdrop-blur-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/54">
                    {home("hero.metricServices")}
                  </p>
                  <p className="display-font mt-2 text-4xl font-medium">
                    {services.length}
                  </p>
                </div>
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
                    {home("hero.metricContact")}
                  </p>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-white transition hover:text-[rgb(var(--accent))]"
                    aria-label={siteConfig.social.instagramHandle}
                  >
                    <Instagram className="h-8 w-8" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal
        data-testid="home-location-spotlight"
        className="relative overflow-hidden rounded-[38px] border border-[rgba(var(--border-soft),0.14)] shadow-[0_26px_72px_rgba(37,28,21,0.16)]"
      >
        {servicesHouse?.image ? (
          <>
            <Image
              src={servicesHouse.image}
              alt={servicesHouse.imageAlt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,15,14,0.08),rgba(16,15,14,0.74))]" />
          </>
        ) : null}
        <div className="relative flex min-h-[440px] items-end p-5 sm:min-h-[500px] sm:p-7 lg:min-h-[540px]">
          <div className="max-w-3xl rounded-[28px] border border-white/12 bg-[rgba(22,20,18,0.52)] p-5 text-white shadow-[0_22px_54px_rgba(17,14,14,0.22)] backdrop-blur-xl sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/62">
              {home("services.cardEyebrow")}
            </p>
            <p className="display-font mt-3 text-[2rem] font-medium leading-[1.02] sm:text-[2.55rem]">
              {home("services.cardTitle")}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="sm"
                className="!bg-white !text-[rgb(var(--foreground))] hover:!bg-white/90"
              >
                <Link href="/location" locale={locale}>
                  {home("services.locationButton")}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/12 text-white hover:bg-white/18 hover:text-white"
              >
                <a href={siteConfig.location.mapUrl} target="_blank" rel="noreferrer">
                  {home("services.mapButton")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal data-testid="home-featured" className="space-y-8">
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

      <Reveal
        data-testid="home-services"
        className="surface-card rounded-[38px] p-7 sm:p-9"
      >
        <p className="section-kicker">{home("services.eyebrow")}</p>
        <h2 className="section-title mt-4 text-4xl sm:text-5xl">
          {home("services.title")}
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-8 text-[rgb(var(--muted-foreground))]">
          {home("services.subtitle")}
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon ?? Sparkles;
            return (
              <article
                key={service.id}
                data-testid={`home-service-card-${service.id}`}
                className="flex min-h-[7.75rem] items-start gap-4 rounded-[24px] border border-[rgba(var(--border-soft),0.14)] bg-white/58 p-4 shadow-[0_12px_26px_rgba(37,28,21,0.05)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--forest),0.1)] text-[rgb(var(--forest))]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted-foreground))]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-base font-semibold leading-6 text-[rgb(var(--foreground))]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted-foreground))]">
                    {service.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Reveal>

      <Reveal
        data-testid="home-cta"
        className="overflow-hidden rounded-[38px] border border-[rgba(var(--border-soft),0.18)] bg-[rgba(255,251,245,0.62)] shadow-[0_28px_70px_rgba(37,28,21,0.1)]"
      >
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
