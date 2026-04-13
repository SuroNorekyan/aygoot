"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type HouseGalleryProps = {
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
};

export function HouseGallery({ images }: HouseGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[32px]" ref={emblaRef}>
        <div className="flex">
          {images.map((image) => (
            <div key={image.id} className="min-w-0 flex-[0_0_100%]">
              <div className="aspect-[1.28] overflow-hidden">
                <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="light" size="icon" onClick={() => emblaApi?.scrollPrev()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="light" size="icon" onClick={() => emblaApi?.scrollNext()}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
