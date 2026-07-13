import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

export function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative h-12 w-12 shrink-0 overflow-hidden rounded-full border shadow-[0_14px_30px_rgba(17,14,14,0.16)] sm:h-[3.25rem] sm:w-[3.25rem]",
          inverted
            ? "border-white/18 bg-white/8"
            : "border-black/[0.04] bg-[rgb(var(--forest))]",
        )}
      >
        <Image
          src={siteConfig.logo.src}
          alt={siteConfig.logo.alt}
          fill
          priority
          sizes="52px"
          className="object-cover object-center"
        />
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "display-font text-[1.55rem] font-medium leading-none",
            inverted ? "text-white" : "text-[rgb(var(--foreground))]",
          )}
        >
          AyGood
        </p>
        <p
          className={cn(
            "mt-1 text-[10px] font-semibold uppercase tracking-[0.24em]",
            inverted ? "text-white/58" : "text-[rgb(var(--muted-foreground))]",
          )}
        >
          River Lake
        </p>
      </div>
    </div>
  );
}
