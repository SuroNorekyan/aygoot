"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { localeLabels, locales } from "@/config/site";
import { cn } from "@/lib/utils/cn";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parts = pathname.split("/").filter(Boolean);
  const currentLocale = locales.includes(parts[0] as (typeof locales)[number])
    ? (parts[0] as (typeof locales)[number])
    : "en";

  const rest = locales.includes(parts[0] as (typeof locales)[number]) ? parts.slice(1) : parts;

  return (
    <div className="inline-flex rounded-full border border-[rgba(var(--border),0.75)] bg-white/80 p-1 backdrop-blur">
      {locales.map((locale) => {
        const href = `/${locale}/${rest.join("/")}`.replace(/\/+$/, "") || `/${locale}`;
        const qs = searchParams.toString();

        return (
          <a
            key={locale}
            href={qs ? `${href}?${qs}` : href}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition",
              locale === currentLocale
                ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                : "text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]",
            )}
          >
            {localeLabels[locale]}
          </a>
        );
      })}
    </div>
  );
}
