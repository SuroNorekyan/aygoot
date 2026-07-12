import { z } from "zod";
import { locales } from "@/config/site";

const translationSchema = z.object({
  locale: z.enum(locales),
  name: z.string().min(2),
  shortDescription: z.string().min(10).max(220),
  description: z.string().min(20).max(3000),
  locationLabel: z.string().max(120).optional().or(z.literal("")),
  nearbyLabel: z.string().max(240).optional().or(z.literal("")),
});

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(2).max(160),
  isCover: z.boolean().optional(),
});

export const adminHouseSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers and dashes."),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  type: z.enum(["BIG", "SMALL", "STANDARD"]),
  featured: z.boolean().optional(),
  pricePerNightAmd: z.coerce.number().int().min(1000),
  priceWorkdaysAmd: z.coerce.number().int().min(1000),
  priceWeekdaysAmd: z.coerce.number().int().min(1000),
  guestCapacity: z.coerce.number().int().min(1).max(20),
  bedrooms: z.coerce.number().int().min(1).max(20).optional().nullable(),
  bathrooms: z.coerce.number().int().min(1).max(20).optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  amenityIds: z.array(z.string()).default([]),
  translations: z.array(translationSchema).min(1),
  images: z.array(imageSchema).min(1),
});
