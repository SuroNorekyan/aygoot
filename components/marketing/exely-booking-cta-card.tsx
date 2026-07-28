import { ArrowUpRight, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";
import type { Locale } from "@/config/site";
import { buildExelyBookingHref } from "@/config/exely";
import { Button } from "@/components/ui/button";

export function ExelyBookingCtaCard({
  locale,
  exelyRoomTypeId,
  labels,
}: {
  locale: Locale;
  exelyRoomTypeId: string | null;
  labels: {
    title: string;
    description: string;
    unmappedDescription: string;
    directMapped: string;
    genericFallback: string;
    bookNow: string;
    checkLiveAvailability: string;
  };
}) {
  const href = buildExelyBookingHref(locale, {
    roomType: exelyRoomTypeId,
  });

  return (
    <aside className="surface-card rounded-[32px] p-6 sm:p-7">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(var(--forest),0.1)] text-[rgb(var(--forest))]">
        <CalendarCheck className="h-5 w-5" />
      </div>
      <p className="section-kicker mt-5">{labels.checkLiveAvailability}</p>
      <h2 className="display-font mt-3 text-3xl font-medium leading-tight">
        {labels.title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[rgb(var(--muted-foreground))]">
        {exelyRoomTypeId ? labels.description : labels.unmappedDescription}
      </p>
      <div className="mt-5 space-y-3">
        <div className="flex items-start gap-3 rounded-[22px] border border-[rgba(var(--border-soft),0.18)] bg-white/50 px-4 py-3 text-sm text-[rgb(var(--muted-foreground))]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--forest))]" />
          <span>{exelyRoomTypeId ? labels.directMapped : labels.genericFallback}</span>
        </div>
        <div className="flex items-start gap-3 rounded-[22px] border border-[rgba(var(--border-soft),0.18)] bg-white/50 px-4 py-3 text-sm text-[rgb(var(--muted-foreground))]">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--accent))]" />
          <span>{labels.description}</span>
        </div>
      </div>
      <Button asChild size="lg" className="mt-6 w-full">
        <a href={href}>
          {labels.bookNow}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </Button>
    </aside>
  );
}
