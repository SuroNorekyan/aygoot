"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/config/site";
import { ExelySearchForm } from "./exely-search-form";

export function LocalizedPublicShell({
  locale,
  children,
  footer,
  searchFallbackMessage,
  contactLabel,
  searchRegionLabel,
}: {
  locale: Locale;
  children: ReactNode;
  footer: ReactNode;
  searchFallbackMessage: string;
  contactLabel: string;
  searchRegionLabel: string;
}) {
  const pathname = usePathname();
  const rest = pathname
    .split("/")
    .filter(Boolean)
    .slice(1)
    .join("/");
  const isBookingRoute = rest === "booking";
  const isAccountRoute = rest === "account" || rest.startsWith("account/");
  const showSearch = !isBookingRoute && !isAccountRoute;

  return (
    <div className="min-h-screen">
      {showSearch ? (
        <div className="container-shell pt-24 sm:pt-28">
          <ExelySearchForm
            locale={locale}
            fallbackMessage={searchFallbackMessage}
            contactLabel={contactLabel}
            regionLabel={searchRegionLabel}
          />
        </div>
      ) : null}
      <main
        className={
          isBookingRoute
            ? "container-shell pt-24 pb-10 sm:pt-28 sm:pb-12"
            : showSearch
              ? "container-shell pt-7 pb-6 sm:pt-8 sm:pb-8"
              : "container-shell pt-24 pb-6 sm:pt-28 sm:pb-8"
        }
      >
        {children}
      </main>
      {isBookingRoute ? null : footer}
    </div>
  );
}
