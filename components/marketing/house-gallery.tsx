"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type HouseGalleryProps = {
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
};

export function HouseGallery({ images }: HouseGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[34px] border border-[rgba(var(--border-soft),0.16)] shadow-[0_28px_74px_rgba(37,28,21,0.14)]" ref={emblaRef}>
        <div className="flex">
          {images.map((image) => (
            <div key={image.id} className="min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[1.22] overflow-hidden bg-[rgba(var(--primary),0.08)]">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1280px) 100vw, 66vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,15,14,0.58)] via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-[rgba(15,14,14,0.38)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/78 backdrop-blur">
            <ImageIcon className="h-4 w-4" />
            {images.length}
          </div>
          <div className="pointer-events-auto flex gap-2">
            <Button variant="light" size="icon" onClick={() => emblaApi?.scrollPrev()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="light" size="icon" onClick={() => emblaApi?.scrollNext()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
