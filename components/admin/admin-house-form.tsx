"use client";

import { useState, useTransition } from "react";
import { put } from "@vercel/blob/client";
import { ArrowDown, ArrowUp, ImagePlus, Star, Trash2 } from "lucide-react";
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

type HouseImageRow = {
  url: string;
  alt: string;
  isCover: boolean;
};

type AdminHouseFormProps = {
  mode: "create" | "edit";
  house?: {
    id: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    type: "BIG" | "SMALL" | "STANDARD";
    featured: boolean;
    pricePerNightAmd: number;
    priceWorkdaysAmd: number;
    priceWeekdaysAmd: number;
    guestCapacity: number;
    bedrooms: number | null;
    bathrooms: number | null;
    latitude: number | null;
    longitude: number | null;
    sortOrder: number;
    amenities: string[];
    images: HouseImageRow[];
    translations: Translation[];
  } | null;
  amenityOptions: Array<{ id: string; label: string }>;
};

const localeOrder: Translation["locale"][] = ["en", "hy", "ru"];

export function AdminHouseForm({ mode, house, amenityOptions }: AdminHouseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    slug: house?.slug ?? "",
    status: house?.status ?? "DRAFT",
    type: house?.type ?? "STANDARD",
    featured: house?.featured ?? false,
    pricePerNightAmd: String(house?.pricePerNightAmd ?? 85000),
    priceWorkdaysAmd: String(house?.priceWorkdaysAmd ?? house?.pricePerNightAmd ?? 85000),
    priceWeekdaysAmd: String(house?.priceWeekdaysAmd ?? house?.pricePerNightAmd ?? 85000),
    guestCapacity: String(house?.guestCapacity ?? 4),
    bedrooms: house?.bedrooms?.toString() ?? "",
    bathrooms: house?.bathrooms?.toString() ?? "",
    latitude: house?.latitude?.toString() ?? "",
    longitude: house?.longitude?.toString() ?? "",
    sortOrder: house?.sortOrder?.toString() ?? "0",
    amenityIds: house?.amenities ?? [],
    images: house?.images?.length
      ? house.images.map((image, index) => ({ ...image, isCover: image.isCover || index === 0 }))
      : [],
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

  const sanitizeFileName = (name: string) => {
    const extension = name.includes(".") ? `.${name.split(".").pop()}` : "";
    const stem = name.slice(0, extension ? -extension.length : undefined);
    const safeStem =
      stem
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "image";
    const safeExtension = extension.toLowerCase().replace(/[^a-z0-9.]/g, "");
    return `${safeStem}${safeExtension}`;
  };

  const setCoverImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((image, imageIndex) => ({
        ...image,
        isCover: imageIndex === index,
      })),
    }));
  };

  const updateImage = (index: number, alt: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, alt } : image,
      ),
    }));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.images.length) return prev;
      const images = [...prev.images];
      const [item] = images.splice(index, 1);
      images.splice(nextIndex, 0, item);
      return { ...prev, images };
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => {
      const images = prev.images.filter((_, imageIndex) => imageIndex !== index);
      const coverIndex = Math.max(0, images.findIndex((image) => image.isCover));
      return {
        ...prev,
        images: images.map((image, imageIndex) => ({
          ...image,
          isCover: imageIndex === coverIndex,
        })),
      };
    });
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploading(true);
    try {
      const uploaded: HouseImageRow[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          throw new Error("Only image files can be uploaded.");
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} is larger than 10 MB.`);
        }

        const pathname = `houses/admin-uploads/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
        const prepare = await fetch("/api/uploads/client", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathname }),
        });
        const prepared = (await prepare.json().catch(() => null)) as {
          clientToken?: string;
          error?: string;
        } | null;

        if (!prepare.ok || !prepared?.clientToken) {
          throw new Error(prepared?.error ?? "Unable to create upload token.");
        }

        const result = await put(pathname, file, {
          access: "public",
          token: prepared.clientToken,
        });

        uploaded.push({
          url: result.url,
          alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          isCover: false,
        });
      }

      setForm((prev) => {
        const images = [...prev.images, ...uploaded];
        return {
          ...prev,
          images: images.map((image, index) => ({
            ...image,
            isCover: images.some((item) => item.isCover) ? image.isCover : index === 0,
          })),
        };
      });
      toast({ title: "Images uploaded.", variant: "success" });
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Image upload failed.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const payload = {
        slug: form.slug,
        status: form.status,
        type: form.type,
        featured: form.featured,
        pricePerNightAmd: Number(form.pricePerNightAmd),
        priceWorkdaysAmd: Number(form.priceWorkdaysAmd),
        priceWeekdaysAmd: Number(form.priceWeekdaysAmd),
        guestCapacity: Number(form.guestCapacity),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : 0,
        amenityIds: form.amenityIds,
        translations: form.translations,
        images: form.images.map((image, index) => ({
          ...image,
          isCover: image.isCover || (!form.images.some((item) => item.isCover) && index === 0),
        })),
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
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED" }))}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <Label htmlFor="type" requiredIndicator>Cottage type</Label>
            <select
              id="type"
              className="h-12 w-full rounded-2xl border border-[rgba(var(--border),0.9)] bg-white/80 px-4 text-sm"
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as "BIG" | "SMALL" | "STANDARD" }))}
            >
              <option value="BIG">Big</option>
              <option value="SMALL">Small</option>
              <option value="STANDARD">Standard</option>
            </select>
          </div>
          <div>
            <Label htmlFor="price" requiredIndicator>Price per night (AMD)</Label>
            <Input id="price" type="number" value={form.pricePerNightAmd} onChange={(event) => setForm((prev) => ({ ...prev, pricePerNightAmd: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="priceWorkdays" requiredIndicator>Price Workdays (AMD)</Label>
            <Input id="priceWorkdays" type="number" value={form.priceWorkdaysAmd} onChange={(event) => setForm((prev) => ({ ...prev, priceWorkdaysAmd: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="priceWeekdays" requiredIndicator>Price Weekdays (AMD)</Label>
            <Input id="priceWeekdays" type="number" value={form.priceWeekdaysAmd} onChange={(event) => setForm((prev) => ({ ...prev, priceWeekdaysAmd: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="capacity" requiredIndicator>Guest capacity</Label>
            <Input id="capacity" type="number" value={form.guestCapacity} onChange={(event) => setForm((prev) => ({ ...prev, guestCapacity: event.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input id="bedrooms" type="number" value={form.bedrooms} onChange={(event) => setForm((prev) => ({ ...prev, bedrooms: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input id="bathrooms" type="number" value={form.bathrooms} onChange={(event) => setForm((prev) => ({ ...prev, bathrooms: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" value={form.latitude} onChange={(event) => setForm((prev) => ({ ...prev, latitude: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" value={form.longitude} onChange={(event) => setForm((prev) => ({ ...prev, longitude: event.target.value }))} />
          </div>
          <div>
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input id="sortOrder" type="number" value={form.sortOrder} onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))} />
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
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="display-font text-2xl font-medium">Images</h2>
            <p className="text-sm text-[rgb(var(--muted-foreground))]">
              Upload images, choose one cover, and order the gallery.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-3">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void uploadImages(event.target.files);
                event.currentTarget.value = "";
              }}
            />
            <Button asChild disabled={uploading || isPending}>
              <span>
                <ImagePlus className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload images"}
              </span>
            </Button>
          </label>
        </div>
        {form.images.length ? (
          <div className="grid gap-4">
            {form.images.map((image, index) => (
              <div key={`${image.url}-${index}`} className="grid gap-4 rounded-[24px] bg-white/70 p-4 md:grid-cols-[140px_1fr_auto] md:items-center">
                <img src={image.url} alt={image.alt} className="h-28 w-full rounded-[18px] object-cover md:w-[140px]" />
                <div>
                  <Label htmlFor={`image-alt-${index}`}>Alt text</Label>
                  <Input
                    id={`image-alt-${index}`}
                    value={image.alt}
                    onChange={(event) => updateImage(index, event.target.value)}
                    required
                  />
                  {image.isCover ? (
                    <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--secondary))]">
                      <Star className="h-3.5 w-3.5" />
                      Cover image
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Button type="button" variant="outline" size="icon" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Move up</span>
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => moveImage(index, 1)} disabled={index === form.images.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                    <span className="sr-only">Move down</span>
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setCoverImage(index)} disabled={image.isCover}>
                    <Star className="h-4 w-4" />
                    Cover
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => removeImage(index)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] bg-white/70 p-5 text-sm text-[rgb(var(--muted-foreground))]">
            Upload at least one house image before saving.
          </div>
        )}
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
              <Label htmlFor={`${translation.locale}-location`}>Location label</Label>
              <Input
                id={`${translation.locale}-location`}
                value={translation.locationLabel}
                onChange={updateTranslation(translation.locale, "locationLabel")}
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
