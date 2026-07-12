import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/site";
import { createMetadata } from "@/lib/utils/metadata";
import { getPublishedHouses } from "@/features/houses/queries";
import { HouseCard } from "@/components/marketing/house-card";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "houses" });
  return createMetadata(t("listing.title"), t("listing.subtitle"));
}

export default async function HousesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const copy = await getTranslations({ locale, namespace: "houses" });
  const common = await getTranslations({ locale, namespace: "common" });
  const houses = await getPublishedHouses(locale);

  return (
    <div className="space-y-12 pb-12">
      <Reveal className="relative overflow-hidden rounded-[38px] border border-[rgba(var(--border-soft),0.16)] shadow-[0_26px_78px_rgba(37,28,21,0.14)]">
        <Image
          src={houses[0]?.image ?? "/images/houses/1.webp"}
          alt={houses[0]?.imageAlt ?? "Aygoot houses"}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,14,14,0.2),rgba(17,14,14,0.76)),linear-gradient(90deg,rgba(17,14,14,0.66),rgba(17,14,14,0.18))]" />
        <div className="relative grid min-h-[340px] items-end gap-6 p-7 text-white sm:min-h-[380px] sm:p-9 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="section-kicker !text-white/58">{copy("listing.eyebrow")}</p>
            <h1 className="section-title mt-4 text-5xl text-white sm:text-[4.2rem]">
              {copy("listing.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">
              {copy("listing.subtitle")}
            </p>
          </div>
          <div className="surface-panel rounded-[28px] bg-white/12 p-5 text-white backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/56">{copy("listing.collectionLabel")}</p>
            <p className="display-font mt-2 text-5xl font-medium">{houses.length}</p>
            <p className="mt-2 text-sm text-white/68">{copy("listing.countLabel")}</p>
          </div>
        </div>
      </Reveal>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-8 text-[rgb(var(--muted-foreground))]">
          {copy("listing.supporting")}
        </p>
        <Button asChild variant="outline">
          <Link href="/contact" locale={locale}>
            {common("actions.learnMore")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {houses.map((house, index) => (
          <Reveal key={house.id} delay={0.04 * index}>
            <HouseCard
              locale={locale}
              house={house}
              labels={{
                from: copy("card.from"),
                perNight: copy("card.perNight"),
                guests: copy("card.guests"),
                bedrooms: copy("card.bedrooms"),
                bathrooms: copy("card.bathrooms"),
                featured: copy("card.featured"),
                viewHouse: common("actions.viewHouse"),
              }}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
