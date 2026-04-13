import { notFound } from "next/navigation";
import { auth } from "@/auth";
import type { Locale } from "@/config/site";
import { getHouseBySlug } from "@/features/houses/queries";
import { createMetadata } from "@/lib/utils/metadata";
import { formatCurrencyAmd } from "@/lib/utils/format";
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

  return (
    <div className="space-y-10 pb-12">
      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Reveal className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {house.featured ? <Badge variant="accent">Featured</Badge> : null}
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted-foreground))]">
                {house.locationLabel}
              </span>
            </div>
            <h1 className="display-font text-5xl font-medium sm:text-6xl">{house.name}</h1>
            <p className="max-w-3xl text-lg leading-8 text-[rgb(var(--muted-foreground))]">
              {house.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {house.amenities.map((amenity) => (
                <Badge key={amenity.slug} variant="neutral">{amenity.label}</Badge>
              ))}
            </div>
          </div>
          <HouseGallery images={house.images} />
        </Reveal>
        <Reveal delay={0.08} className="space-y-6">
          <div className="surface-card rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[rgb(var(--muted-foreground))]">
              {copy("detail.perNight")}
            </p>
            <p className="display-font mt-2 text-5xl font-medium">
              {formatCurrencyAmd(locale, house.pricePerNightAmd)}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-[22px] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted-foreground))]">Guests</p>
                <p className="mt-2 text-xl font-bold">{house.guestCapacity}</p>
              </div>
              <div className="rounded-[22px] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted-foreground))]">Bedrooms</p>
                <p className="mt-2 text-xl font-bold">{house.bedrooms}</p>
              </div>
              <div className="rounded-[22px] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted-foreground))]">Bathrooms</p>
                <p className="mt-2 text-xl font-bold">{house.bathrooms}</p>
              </div>
            </div>
          </div>
          <div className="xl:sticky xl:top-28">
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
              }}
            />
          </div>
        </Reveal>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Reveal className="surface-card rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[rgb(var(--muted-foreground))]">
            {copy("detail.aboutHouse")}
          </p>
          <p className="mt-4 text-base leading-8 text-[rgb(var(--muted-foreground))]">
            {house.description}
          </p>
        </Reveal>
        <Reveal delay={0.08} className="surface-card rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[rgb(var(--muted-foreground))]">
            {copy("detail.nearby")}
          </p>
          <p className="mt-4 text-base leading-8 text-[rgb(var(--muted-foreground))]">
            {house.nearbyLabel}
          </p>
          {house.latitude && house.longitude ? (
            <div className="mt-5 rounded-[24px] bg-white/70 p-5 text-sm text-[rgb(var(--muted-foreground))]">
              {copy("detail.location")}: {house.latitude.toFixed(4)}, {house.longitude.toFixed(4)}
            </div>
          ) : null}
        </Reveal>
      </section>
    </div>
  );
}
