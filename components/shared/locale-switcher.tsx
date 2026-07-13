"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { localeMeta, locales } from "@/config/site";
import { cn } from "@/lib/utils/cn";

function LocaleSwitcherInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parts = pathname.split("/").filter(Boolean);
  const currentLocale = locales.includes(parts[0] as (typeof locales)[number])
    ? (parts[0] as (typeof locales)[number])
    : "en";

  const rest = locales.includes(parts[0] as (typeof locales)[number])
    ? parts.slice(1)
    : parts;

  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white/70 p-1 shadow-sm backdrop-blur-md">
      {locales.map((locale) => {
        const href =
          `/${locale}/${rest.join("/")}`.replace(/\/+$/, "") || `/${locale}`;
        const qs = searchParams.toString();
        const meta = localeMeta[locale];

        return (
          <a
            key={locale}
            href={qs ? `${href}?${qs}` : href}
            aria-label={meta.label}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
              locale === currentLocale
                ? "bg-slate-100 text-white shadow-sm"
                : "text-slate-500 hover:bg-white/60 hover:text-slate-400",
            )}
          >
            <span className="text-sm leading-none">{meta.flag}</span>
            <span className="hidden sm:inline">{meta.shortLabel}</span>
          </a>
        );
      })}
    </div>
  );
}

export function LocaleSwitcher() {
  return (
    <Suspense fallback={null}>
      <LocaleSwitcherInner />
    </Suspense>
  );
}
