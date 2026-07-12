import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  MapPin,
  ShieldCheck,
  Sparkles,
  TreePine,
  Users,
} from "lucide-react";
import { auth } from "@/auth";
import type { Locale } from "@/config/site";
import { getHouseBySlug } from "@/features/houses/queries";
import { createMetadata } from "@/lib/utils/metadata";
import { formatCurrencyAmd } from "@/lib/utils/format";
import { getAmenityIcon } from "@/lib/utils/amenity-icons";
import { HouseGallery } from "@/components/marketing/house-gallery";
import { BookingRequestForm } from "@/components/marketing/booking-request-form";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const house = await getHouseBySlug(slug, locale);
  if (!house) return createMetadata("House not found");
  return createMetadata(house.name, house.shortDescription);
}

export default async function HouseDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const copy = await getTranslations({ locale, namespace: "houses" });
  const bookingCopy = await getTranslations({ locale, namespace: "booking" });
  const house = await getHouseBySlug(slug, locale);
  const session = await auth();

  if (!house) {
    notFound();
  }

  const facts = [
    {
      key: "guests",
      label: copy("card.guests"),
      value: house.guestCapacity,
      Icon: Users,
    },
    house.bedrooms
      ? {
          key: "bedrooms",
          label: copy("card.bedrooms"),
          value: house.bedrooms,
          Icon: BedDouble,
        }
      : null,
    house.bathrooms
      ? {
          key: "bathrooms",
          label: copy("card.bathrooms"),
          value: house.bathrooms,
          Icon: Bath,
        }
      : null,
  ].filter((fact): fact is NonNullable<typeof fact> => Boolean(fact));

  return (
    <div className="space-y-10 pb-12 sm:space-y-12">
      <section className="grid gap-7 xl:grid-cols-[1.08fr_0.92fr]">
        <Reveal className="space-y-6">
          <div className="surface-card rounded-[34px] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {house.featured ? <Badge variant="accent">{copy("card.featured")}</Badge> : null}
              {house.locationLabel ? (
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted-foreground))]">
                  <MapPin className="h-4 w-4 text-[rgb(var(--forest))]" />
                  {house.locationLabel}
                </span>
              ) : null}
            </div>
            <h1 className="section-title mt-5 text-5xl sm:text-[4.4rem]">{house.name}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[rgb(var(--muted-foreground))]">
              {house.shortDescription}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map(({ key, label, value, Icon }) => (
                <div key={key} className="surface-panel rounded-[24px] px-4 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[rgb(var(--muted-foreground))]">
                    {label}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-2 text-base font-semibold">
                    <Icon className="h-4 w-4 text-[rgb(var(--forest))]" />
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <HouseGallery images={house.images} />
        </Reveal>

        <Reveal delay={0.08} className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <div className="surface-dark rounded-[32px] p-6 text-white sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/56">
              {copy("detail.perNight")}
            </p>
            <p className="display-font mt-3 text-[3.5rem] font-medium leading-none">
              {formatCurrencyAmd(locale, house.pricePerNightAmd)}
            </p>
            <div className="mt-5 grid gap-2 text-sm text-white/74 sm:grid-cols-2">
              <div className="rounded-[18px] border border-white/8 bg-white/8 px-4 py-3">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/52">
                  {copy("detail.workdays")}
                </span>
                <span className="mt-1 block font-semibold text-white">
                  {formatCurrencyAmd(locale, house.priceWorkdaysAmd)}
                </span>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-white/8 px-4 py-3">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/52">
                  {copy("detail.weekdays")}
                </span>
                <span className="mt-1 block font-semibold text-white">
                  {formatCurrencyAmd(locale, house.priceWeekdaysAmd)}
                </span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-[22px] border border-white/8 bg-white/8 px-4 py-3 text-sm text-white/74">
                <ShieldCheck className="h-4 w-4 text-[rgb(var(--accent))]" />
                <span>{copy("detail.availabilityHint")}</span>
              </div>
              <div className="flex items-center gap-3 rounded-[22px] border border-white/8 bg-white/8 px-4 py-3 text-sm text-white/74">
                <Sparkles className="h-4 w-4 text-[rgb(var(--accent))]" />
                <span>{copy("detail.hostResponse")}</span>
              </div>
            </div>
          </div>

          <BookingRequestForm
            locale={locale}
            house={house}
            session={session}
            copy={{
              checkIn: bookingCopy("form.checkIn"),
              checkOut: bookingCopy("form.checkOut"),
              guests: bookingCopy("form.guests"),
              name: bookingCopy("form.name"),
              email: bookingCopy("form.email"),
              phone: bookingCopy("form.phone"),
              notes: bookingCopy("form.notes"),
              submit: bookingCopy("form.submit"),
              successTitle: bookingCopy("success.title"),
              successDescription: bookingCopy("success.description"),
              estimateLabel: bookingCopy("form.estimate"),
              responseTime: bookingCopy("form.responseTime"),
              guestFlex: bookingCopy("form.guestFlex"),
              privacy: bookingCopy("form.privacy"),
            }}
          />
        </Reveal>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <Reveal className="surface-card rounded-[32px] p-6 sm:p-8">
          <p className="section-kicker">{copy("detail.aboutHouse")}</p>
          <p className="mt-5 text-base leading-8 text-[rgb(var(--muted-foreground))]">
            {house.description}
          </p>
        </Reveal>
        {house.nearbyLabel || (house.latitude && house.longitude) ? (
          <Reveal delay={0.08} className="surface-card rounded-[32px] p-6 sm:p-8">
            <p className="section-kicker">{copy("detail.nearby")}</p>
            {house.nearbyLabel ? (
              <p className="mt-5 text-base leading-8 text-[rgb(var(--muted-foreground))]">
                {house.nearbyLabel}
              </p>
            ) : null}
            {house.latitude && house.longitude ? (
              <div className="mt-6 rounded-[24px] bg-[rgba(var(--forest),0.08)] px-5 py-4 text-sm text-[rgb(var(--muted-foreground))]">
                {copy("detail.location")}: {house.latitude.toFixed(4)}, {house.longitude.toFixed(4)}
              </div>
            ) : null}
          </Reveal>
        ) : null}
      </section>

      {house.amenities.length ? (
        <Reveal className="surface-card rounded-[32px] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(var(--forest),0.1)] text-[rgb(var(--forest))]">
              <TreePine className="h-5 w-5" />
            </div>
            <div>
              <p className="section-kicker">{copy("detail.amenities")}</p>
              <h2 className="display-font mt-2 text-3xl font-medium">{copy("detail.amenitiesTitle")}</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {house.amenities.map((amenity) => {
              const Icon = getAmenityIcon(amenity.icon);
              return (
                <div
                  key={amenity.slug}
                  className="surface-panel rounded-[24px] px-4 py-4"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(var(--accent),0.14)] text-[rgb(var(--secondary))]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[rgb(var(--foreground))]">
                    {amenity.label}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
