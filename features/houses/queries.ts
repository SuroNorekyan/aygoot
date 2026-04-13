import { HouseStatus, Prisma } from "@prisma/client";
import type { Locale } from "@/config/site";
import { prisma } from "@/lib/db/prisma";

const houseInclude = {
  translations: true,
  images: {
    orderBy: { position: "asc" as const },
  },
  houseAmenities: {
    include: {
      amenity: true,
    },
  },
} satisfies Prisma.HouseInclude;

const pickTranslation = <
  T extends {
    locale: string;
  },
>(
  translations: T[],
  locale: Locale,
) =>
  translations.find((translation) => translation.locale === locale) ??
  translations.find((translation) => translation.locale === "en") ??
  translations[0];

export async function getFeaturedHouses(locale: Locale) {
  const houses = await prisma.house.findMany({
    where: {
      status: HouseStatus.PUBLISHED,
      featured: true,
    },
    include: houseInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return houses.map((house) => {
    const translation = pickTranslation(house.translations, locale);
    const coverImage = house.images.find((image) => image.isCover) ?? house.images[0];

    return {
      id: house.id,
      slug: house.slug,
      featured: house.featured,
      name: translation?.name ?? house.slug,
      shortDescription: translation?.shortDescription ?? "",
      locationLabel: translation?.locationLabel ?? "",
      pricePerNightAmd: house.pricePerNightAmd,
      guestCapacity: house.guestCapacity,
      bedrooms: house.bedrooms,
      bathrooms: house.bathrooms,
      image: coverImage?.url ?? "/images/placeholder-house.svg",
      imageAlt: coverImage?.alt ?? translation?.name ?? house.slug,
      amenities: house.houseAmenities.map((item) => ({
        slug: item.amenity.slug,
        label: item.amenity.label,
      })),
    };
  });
}

export async function getPublishedHouses(locale: Locale) {
  const houses = await prisma.house.findMany({
    where: { status: HouseStatus.PUBLISHED },
    include: houseInclude,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return houses.map((house) => {
    const translation = pickTranslation(house.translations, locale);
    const coverImage = house.images.find((image) => image.isCover) ?? house.images[0];

    return {
      id: house.id,
      slug: house.slug,
      featured: house.featured,
      name: translation?.name ?? house.slug,
      shortDescription: translation?.shortDescription ?? "",
      locationLabel: translation?.locationLabel ?? "",
      nearbyLabel: translation?.nearbyLabel ?? "",
      description: translation?.description ?? "",
      pricePerNightAmd: house.pricePerNightAmd,
      guestCapacity: house.guestCapacity,
      bedrooms: house.bedrooms,
      bathrooms: house.bathrooms,
      image: coverImage?.url ?? "/images/placeholder-house.svg",
      imageAlt: coverImage?.alt ?? translation?.name ?? house.slug,
      amenities: house.houseAmenities.map((item) => ({
        slug: item.amenity.slug,
        label: item.amenity.label,
      })),
    };
  });
}

export async function getHouseBySlug(slug: string, locale: Locale) {
  const house = await prisma.house.findUnique({
    where: { slug },
    include: houseInclude,
  });

  if (!house || house.status !== HouseStatus.PUBLISHED) {
    return null;
  }

  const translation = pickTranslation(house.translations, locale);

  return {
    id: house.id,
    slug: house.slug,
    featured: house.featured,
    name: translation?.name ?? house.slug,
    shortDescription: translation?.shortDescription ?? "",
    description: translation?.description ?? "",
    locationLabel: translation?.locationLabel ?? "",
    nearbyLabel: translation?.nearbyLabel ?? "",
    pricePerNightAmd: house.pricePerNightAmd,
    guestCapacity: house.guestCapacity,
    bedrooms: house.bedrooms,
    bathrooms: house.bathrooms,
    latitude: house.latitude,
    longitude: house.longitude,
    images: house.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      isCover: image.isCover,
    })),
    amenities: house.houseAmenities.map((item) => ({
      slug: item.amenity.slug,
      label: item.amenity.label,
      icon: item.amenity.icon,
    })),
  };
}

export async function getHouseOptions() {
  return prisma.house.findMany({
    select: {
      id: true,
      slug: true,
      status: true,
      featured: true,
      pricePerNightAmd: true,
      guestCapacity: true,
      bedrooms: true,
      bathrooms: true,
      publishedAt: true,
      translations: {
        where: { locale: "en" },
        take: 1,
      },
      images: {
        take: 1,
        where: { isCover: true },
      },
    },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
}
