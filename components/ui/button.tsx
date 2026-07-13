"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

type Variant =
  | "primary"
  | "primarySoft"
  | "secondary"
  | "ghost"
  | "outline"
  | "light";
type Size = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<Variant, string> = {
  primary:
    "border border-white/70 bg-[rgba(255,251,245,0.94)] text-[rgb(var(--foreground))] shadow-[0_14px_34px_rgba(37,28,21,0.14),inset_0_1px_0_rgba(255,255,255,0.7)] \
   hover:bg-white hover:text-[rgb(var(--foreground))] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(37,28,21,0.16),inset_0_1px_0_rgba(255,255,255,0.82)] \
   active:translate-y-0 transition-all",
  primarySoft:
    "border border-[rgba(var(--border-soft),0.22)] bg-[rgba(255,251,245,0.76)] text-[rgb(var(--foreground))] \
   shadow-[0_10px_26px_rgba(37,28,21,0.08),inset_0_1px_0_rgba(255,255,255,0.66)] \
   hover:bg-white hover:text-[rgb(var(--foreground))] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(37,28,21,0.12)] \
   active:translate-y-0 transition-all",
  secondary:
    "border border-[rgba(173,128,84,0.26)] bg-[rgba(173,128,84,0.15)] text-[rgb(var(--secondary))] shadow-[0_12px_26px_rgba(131,94,62,0.10)] hover:-translate-y-0.5 hover:bg-[rgba(173,128,84,0.22)] hover:text-[rgb(var(--foreground))]",
  ghost:
    "bg-transparent text-[rgb(var(--foreground))] hover:bg-white/55 hover:text-[rgb(var(--foreground))]",
  outline:
    "border border-[rgba(var(--border-soft),0.28)] bg-[rgba(255,251,245,0.64)] text-[rgb(var(--foreground))] shadow-[0_10px_24px_rgba(37,28,21,0.06),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur hover:-translate-y-0.5 hover:border-[rgba(var(--border-soft),0.38)] hover:bg-white hover:text-[rgb(var(--foreground))]",
  light:
    "border border-white/60 bg-white/85 text-[rgb(var(--foreground))] shadow-[0_12px_28px_rgba(17,14,14,0.08)] hover:bg-white hover:text-[rgb(var(--foreground))]",
};

const sizeClasses: Record<Size, string> = {
  default: "h-11 px-5 text-sm",
  sm: "h-9 rounded-full px-4 text-xs",
  lg: "h-12 px-8 text-[15.5px]",
  icon: "h-11 w-11",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      className,
      variant = "primary",
      size = "default",
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref as never}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[0.01em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--ring),0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
