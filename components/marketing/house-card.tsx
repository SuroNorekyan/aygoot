import { BedDouble, Bath, Users, Sparkles } from "lucide-react";
import type { Locale } from "@/config/site";
import { Link } from "@/lib/i18n/navigation";
import { formatCurrencyAmd } from "@/lib/utils/format";
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
  return (
    <article className="surface-card group overflow-hidden rounded-[30px]">
      <div className="relative aspect-[1.18] overflow-hidden">
        <img
          src={house.image}
          alt={house.imageAlt}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,14,14,0.42)] via-transparent to-transparent" />
        {house.featured ? (
          <div className="absolute left-4 top-4">
            <Badge variant="accent">{labels.featured}</Badge>
          </div>
        ) : null}
      </div>
      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--muted-foreground))]">
            {house.locationLabel}
          </p>
          <h3 className="display-font text-3xl font-medium">{house.name}</h3>
          <p className="text-sm leading-7 text-[rgb(var(--muted-foreground))]">{house.shortDescription}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold text-[rgb(var(--muted-foreground))]">
          <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> {house.guestCapacity} {labels.guests}</span>
          <span className="inline-flex items-center gap-1"><BedDouble className="h-4 w-4" /> {house.bedrooms} {labels.bedrooms}</span>
          <span className="inline-flex items-center gap-1"><Bath className="h-4 w-4" /> {house.bathrooms} {labels.bathrooms}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted-foreground))]">{labels.from}</p>
            <p className="text-xl font-bold text-[rgb(var(--foreground))]">
              {formatCurrencyAmd(locale, house.pricePerNightAmd)}
              <span className="ml-1 text-sm font-medium text-[rgb(var(--muted-foreground))]">{labels.perNight}</span>
            </p>
          </div>
          <Link
            href={`/houses/${house.slug}`}
            locale={locale}
            className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--primary))] px-4 py-2.5 text-sm font-semibold text-[rgb(var(--primary-foreground))]"
          >
            <Sparkles className="h-4 w-4" />
            {labels.viewHouse}
          </Link>
        </div>
      </div>
    </article>
  );
}
