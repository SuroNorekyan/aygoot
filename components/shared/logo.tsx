import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] shadow-[0_10px_24px_rgba(17,14,14,0.18)]">
        <span className="display-font text-xl font-semibold">A</span>
      </div>
      <div className="min-w-0">
        <p className="display-font text-2xl font-medium leading-none tracking-tight">Aygoot</p>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--muted-foreground))]">
          Dilijan private houses
        </p>
      </div>
    </div>
  );
}
