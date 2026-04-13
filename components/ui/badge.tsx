import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "neutral" | "accent" | "success" | "danger";

const classes: Record<BadgeVariant, string> = {
  neutral: "bg-[rgba(70,39,25,0.08)] text-[rgb(var(--foreground))]",
  accent: "bg-[rgba(164,118,76,0.15)] text-[rgb(var(--primary))]",
  success: "bg-emerald-100 text-emerald-800",
  danger: "bg-red-100 text-red-700",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        classes[variant],
        className,
      )}
      {...props}
    />
  );
}
