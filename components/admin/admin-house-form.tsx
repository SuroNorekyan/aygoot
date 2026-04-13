"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type Translation = {
  locale: "en" | "hy" | "ru";
  name: string;
  shortDescription: string;
  description: string;
  locationLabel: string;
  nearbyLabel: string;
};

type AdminHouseFormProps = {
  mode: "create" | "edit";
  house?: {
    id: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED";
    featured: boolean;
    pricePerNightAmd: number;
    guestCapacity: number;
    bedrooms: number;
    bathrooms: number;
    latitude: number | null;
    longitude: number | null;
    amenities: string[];
    images: Array<{ url: string; alt: string; isCover: boolean }>;
    translations: Translation[];
  } | null;
  amenityOptions: Array<{ id: string; label: string }>;
};

const localeOrder: Translation["locale"][] = ["en", "hy", "ru"];

export function AdminHouseForm({ mode, house, amenityOptions }: AdminHouseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    slug: house?.slug ?? "",
    status: house?.status ?? "DRAFT",
    featured: house?.featured ?? false,
    pricePerNightAmd: String(house?.pricePerNightAmd ?? 85000),
    guestCapacity: String(house?.guestCapacity ?? 4),
    bedrooms: String(house?.bedrooms ?? 2),
    bathrooms: String(house?.bathrooms ?? 1),
    latitude: house?.latitude?.toString() ?? "",
    longitude: house?.longitude?.toString() ?? "",
    amenityIds: house?.amenities ?? [],
    imageRows:
      house?.images
        ?.map((image) => `${image.url}|${image.alt}|${image.isCover ? "cover" : ""}`)
        .join("\n") ?? "",
    translations: localeOrder.map((locale) => {
      const existing = house?.translations.find((item) => item.locale === locale);
      return (
        existing ?? {
          locale,
          name: "",
          shortDescription: "",
          description: "",
          locationLabel: "",
          nearbyLabel: "",
        }
      );
    }),
  });

  const updateTranslation =
    (locale: Translation["locale"], field: keyof Omit<Translation, "locale">) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        translations: prev.translations.map((translation) =>
          translation.locale === locale
            ? { ...translation, [field]: event.target.value }
            : translation,
        ),
      }));
    };

  const toggleAmenity = (amenityId: string) => {
    setForm((prev) => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(amenityId)
        ? prev.amenityIds.filter((id) => id !== amenityId)
        : [...prev.amenityIds, amenityId],
    }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const payload = {
        slug: form.slug,
        status: form.status,
        featured: form.featured,
        pricePerNightAmd: Number(form.pricePerNightAmd),
        guestCapacity: Number(form.guestCapacity),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        amenityIds: form.amenityIds,
        translations: form.translations,
        images: form.imageRows
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, index) => {
            const [url, alt, coverFlag] = line.split("|");
            return {
              url: url?.trim() ?? "",
              alt: alt?.trim() ?? `House image ${index + 1}`,
              isCover: coverFlag?.trim() === "cover" || index === 0,
            };
          }),
      };

      const endpoint = mode === "create" ? "/api/admin/houses" : `/api/admin/houses/${house?.id}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        toast({
          title: body?.error ?? "Unable to save house.",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "House saved.", variant: "success" });
      router.push("/admin/houses");
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="surface-card rounded-[28px] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="slug" requiredIndicator>Slug</Label>
            <Input id="slug" value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="status" requiredIndicator>Status</Label>
            <select
              id="status"
              className="h-12 w-full rounded-2xl border border-[rgba(var(--border),0.9)] bg-white/80 px-4 text-sm"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as "DRAFT" | "PUBLISHED" }))}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <div>
            <Label htmlFor="price" requiredIndicator>Price per night (AMD)</Label>
            <Input id="price" type="number" value={form.pricePerNightAmd} onChange={(event) => setForm((prev) => ({ ...prev, pricePerNightAmd: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="capacity" requiredIndicator>Guest capacity</Label>
            <Input id="capacity" type="number" value={form.guestCapacity} onChange={(event) => setForm((prev) => ({ ...prev, guestCapacity: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="bedrooms" requiredIndicator>Bedrooms</Label>
            <Input id="bedrooms" type="number" value={form.bedrooms} onChange={(event) => setForm((prev) => ({ ...prev, bedrooms: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="bathrooms" requiredIndicator>Bathrooms</Label>
            <Input id="bathrooms" type="number" value={form.bathrooms} onChange={(event) => setForm((prev) => ({ ...prev, bathrooms: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" value={form.latitude} onChange={(event) => setForm((prev) => ({ ...prev, latitude: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" value={form.longitude} onChange={(event) => setForm((prev) => ({ ...prev, longitude: event.target.value }))} />
          </div>
        </div>
        <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
          />
          Featured house
        </label>
      </section>

      <section className="surface-card rounded-[28px] p-6">
        <h2 className="mb-4 display-font text-2xl font-medium">Amenities</h2>
        <div className="flex flex-wrap gap-3">
          {amenityOptions.map((amenity) => (
            <label
              key={amenity.id}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${form.amenityIds.includes(amenity.id) ? "border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.12)]" : "border-[rgba(var(--border),0.6)] bg-white/70"}`}
            >
              <input
                type="checkbox"
                checked={form.amenityIds.includes(amenity.id)}
                onChange={() => toggleAmenity(amenity.id)}
              />
              {amenity.label}
            </label>
          ))}
        </div>
      </section>

      <section className="surface-card rounded-[28px] p-6">
        <h2 className="mb-4 display-font text-2xl font-medium">Images</h2>
        <p className="mb-3 text-sm text-[rgb(var(--muted-foreground))]">
          One image per line in the format: <code>url|alt text|cover</code>
        </p>
        <Textarea value={form.imageRows} onChange={(event) => setForm((prev) => ({ ...prev, imageRows: event.target.value }))} rows={6} />
      </section>

      {form.translations.map((translation) => (
        <section key={translation.locale} className="surface-card rounded-[28px] p-6">
          <h2 className="mb-5 display-font text-2xl font-medium uppercase">{translation.locale}</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor={`${translation.locale}-name`} requiredIndicator>Name</Label>
              <Input
                id={`${translation.locale}-name`}
                value={translation.name}
                onChange={updateTranslation(translation.locale, "name")}
                required
              />
            </div>
            <div>
              <Label htmlFor={`${translation.locale}-short`} requiredIndicator>Short description</Label>
              <Textarea
                id={`${translation.locale}-short`}
                rows={3}
                value={translation.shortDescription}
                onChange={updateTranslation(translation.locale, "shortDescription")}
                required
              />
            </div>
            <div>
              <Label htmlFor={`${translation.locale}-description`} requiredIndicator>Description</Label>
              <Textarea
                id={`${translation.locale}-description`}
                rows={6}
                value={translation.description}
                onChange={updateTranslation(translation.locale, "description")}
                required
              />
            </div>
            <div>
              <Label htmlFor={`${translation.locale}-location`} requiredIndicator>Location label</Label>
              <Input
                id={`${translation.locale}-location`}
                value={translation.locationLabel}
                onChange={updateTranslation(translation.locale, "locationLabel")}
                required
              />
            </div>
            <div>
              <Label htmlFor={`${translation.locale}-nearby`}>Nearby/context note</Label>
              <Textarea
                id={`${translation.locale}-nearby`}
                rows={3}
                value={translation.nearbyLabel}
                onChange={updateTranslation(translation.locale, "nearbyLabel")}
              />
            </div>
          </div>
        </section>
      ))}

      <div className="flex justify-end">
        <Button size="lg" disabled={isPending}>
          {mode === "create" ? "Create house" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
