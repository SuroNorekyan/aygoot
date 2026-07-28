import { exelyContainers } from "@/config/exely";
import type { Locale } from "@/config/site";
import { ExelyFallback } from "./exely-fallback";
import { ExelyInitializer } from "./exely-initializer";

export function ExelySearchForm({
  locale,
  fallbackMessage,
  contactLabel,
  regionLabel,
}: {
  locale: Locale;
  fallbackMessage: string;
  contactLabel: string;
  regionLabel: string;
}) {
  return (
    <section className="exely-search-shell" aria-label={regionLabel}>
      <ExelyInitializer locale={locale} searchForm />
      <div id="block-search">
        <div id={exelyContainers.searchForm} className="be-container">
          <a href="https://exely.com/" rel="nofollow" target="_blank">
            Hotel management software
          </a>
        </div>
      </div>
      <noscript>
        <div className="exely-noscript">{fallbackMessage}</div>
      </noscript>
      <ExelyFallback
        containerId={exelyContainers.searchForm}
        message={fallbackMessage}
        contactLabel={contactLabel}
      />
    </section>
  );
}
