import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config/site";
import { createMetadata } from "@/lib/utils/metadata";
import { getPublishedHouses } from "@/features/houses/queries";
import { HouseCard } from "@/components/marketing/house-card";
import { Reveal } from "@/components/shared/reveal";

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
    <div className="space-y-10 pb-10">
      <Reveal className="surface-card rounded-[34px] p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[rgb(var(--muted-foreground))]">
          {copy("listing.eyebrow")}
        </p>
        <h1 className="display-font mt-3 text-5xl font-medium">{copy("listing.title")}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[rgb(var(--muted-foreground))]">
          {copy("listing.subtitle")}
        </p>
      </Reveal>
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
