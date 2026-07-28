import { exelyContainers } from "@/config/exely";
import type { Locale } from "@/config/site";
import { ExelyFallback } from "./exely-fallback";
import { ExelyInitializer } from "./exely-initializer";

export function ExelyBookingForm({
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
    <section className="exely-booking-shell" aria-label={regionLabel}>
      <ExelyInitializer locale={locale} bookingForm />
      <div id={exelyContainers.bookingForm}></div>
      <noscript>
        <div className="exely-noscript">{fallbackMessage}</div>
      </noscript>
      <ExelyFallback
        containerId={exelyContainers.bookingForm}
        message={fallbackMessage}
        contactLabel={contactLabel}
      />
    </section>
  );
}
