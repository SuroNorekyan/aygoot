import Image from "next/image";
import { ArrowUpRight, Bath, BedDouble, MapPin, Users } from "lucide-react";
import type { Locale } from "@/config/site";
import { Link } from "@/lib/i18n/navigation";
import { formatCurrencyAmd } from "@/lib/utils/format";
import { getAmenityIcon } from "@/lib/utils/amenity-icons";
import { Badge } from "@/components/ui/badge";

type HouseCardProps = {
  locale: Locale;
  house: {
    slug: string;
    name: string;
    shortDescription: string;
    locationLabel: string;
    pricePerNightAmd: number;
    guestCapacity: number;
    bedrooms: number;
    bathrooms: number;
    image: string;
    imageAlt: string;
    featured?: boolean;
    amenities?: Array<{
      slug: string;
      label: string;
      icon?: string | null;
    }>;
  };
  labels: {
    from: string;
    perNight: string;
    guests: string;
    bedrooms: string;
    bathrooms: string;
    featured: string;
    viewHouse: string;
  };
};

export function HouseCard({ locale, house, labels }: HouseCardProps) {
  const amenityHighlights = house.amenities?.slice(0, 2) ?? [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-[rgba(var(--border-soft),0.18)] bg-[rgba(255,251,245,0.7)] shadow-[0_24px_64px_rgba(37,28,21,0.08)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:shadow-[0_34px_82px_rgba(37,28,21,0.14)]">
      <Link
        href={`/houses/${house.slug}`}
        locale={locale}
        className="relative block h-[220px] sm:h-[260px] lg:h-auto lg:aspect-[1.05] overflow-hidden"
      >
        <Image
          src={house.image}
          alt={house.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,16,15,0.84)] via-[rgba(18,16,15,0.12)] to-[rgba(18,16,15,0.06)]" />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
          <div className="rounded-full border border-white/12 bg-[rgba(15,14,14,0.36)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/82 backdrop-blur">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {house.locationLabel}
            </span>
          </div>
          {house.featured ? (
            <Badge variant="accent">{labels.featured}</Badge>
          ) : null}
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/62">
              {labels.from}
            </p>
            <p className="display-font text-[2rem] font-medium leading-none text-white">
              {formatCurrencyAmd(locale, house.pricePerNightAmd)}
            </p>
            <p className="mt-1 text-xs font-medium text-white/66">
              {labels.perNight}
            </p>
          </div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/10 text-white shadow-[0_12px_28px_rgba(15,14,14,0.28)] backdrop-blur transition group-hover:bg-white/16">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-6 p-6 sm:p-7">
        <div className="space-y-3">
          <h3 className="display-font text-[2rem] font-medium leading-[1.02]">
            {house.name}
          </h3>
          <p className="text-sm leading-7 text-[rgb(var(--muted-foreground))]">
            {house.shortDescription}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="surface-panel rounded-[22px] px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[rgb(var(--muted-foreground))]">
              {labels.guests}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--foreground))]">
              <Users className="h-4 w-4 text-[rgb(var(--forest))]" />
              {house.guestCapacity}
            </p>
          </div>
          <div className="surface-panel rounded-[22px] px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[rgb(var(--muted-foreground))]">
              {labels.bedrooms}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--foreground))]">
              <BedDouble className="h-4 w-4 text-[rgb(var(--forest))]" />
              {house.bedrooms}
            </p>
          </div>
          <div className="surface-panel rounded-[22px] px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[rgb(var(--muted-foreground))]">
              {labels.bathrooms}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--foreground))]">
              <Bath className="h-4 w-4 text-[rgb(var(--forest))]" />
              {house.bathrooms}
            </p>
          </div>
        </div>

        {amenityHighlights.length ? (
          <div className="flex flex-wrap gap-2">
            {amenityHighlights.map((amenity) => {
              const Icon = getAmenityIcon(amenity.icon);
              return (
                <span
                  key={amenity.slug}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--border-soft),0.18)] bg-[rgba(255,251,245,0.84)] px-3 py-2 text-xs font-semibold text-[rgb(var(--muted-foreground))]"
                >
                  <Icon className="h-3.5 w-3.5 text-[rgb(var(--accent))]" />
                  {amenity.label}
                </span>
              );
            })}
          </div>
        ) : null}

        <Link
          href={`/houses/${house.slug}`}
          locale={locale}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--foreground))] transition hover:text-[rgb(var(--forest))]"
        >
          {labels.viewHouse}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
