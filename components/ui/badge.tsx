import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "neutral" | "accent" | "success" | "danger";

const classes: Record<BadgeVariant, string> = {
  neutral:
    "border border-[rgba(var(--border-soft),0.24)] bg-[rgba(255,251,245,0.75)] text-[rgb(var(--foreground))] shadow-[0_8px_18px_rgba(37,28,21,0.05)]",
  accent:
    "border border-[rgba(166,135,99,0.18)] bg-[rgba(166,135,99,0.14)] text-[rgb(var(--secondary))]",
  success:
    "border border-emerald-200/70 bg-emerald-50/90 text-emerald-800",
  danger:
    "border border-red-200/70 bg-red-50/90 text-red-700",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
        classes[variant],
        className,
      )}
      {...props}
    />
  );
}
