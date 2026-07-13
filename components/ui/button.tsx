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
    "bg-white text-slate-900 shadow-[0_14px_36px_rgba(0,0,0,0.18)] \
   hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(0,0,0,0.24)] \
   active:translate-y-0 transition-all",
  primarySoft:
    "bg-white/80 text-slate-900 border border-white/30 \
   shadow-[0_10px_26px_rgba(0,0,0,0.12)] \
   hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,0,0,0.18)] \
   active:translate-y-0 transition-all",
  secondary:
    "bg-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))] shadow-[0_16px_28px_rgba(131,94,62,0.18)] hover:-translate-y-0.5 hover:brightness-[1.04]",
  ghost:
    "bg-transparent text-[rgb(var(--foreground))] hover:bg-[rgba(var(--primary),0.06)]",
  outline:
    "border border-[rgba(var(--border-soft),0.42)] bg-white/58 text-[rgb(var(--foreground))] shadow-[0_10px_24px_rgba(37,28,21,0.08)] backdrop-blur hover:-translate-y-0.5 hover:bg-white hover:text-[rgb(var(--foreground))]",
  light:
    "bg-white/85 text-[rgb(var(--foreground))] shadow-[0_12px_28px_rgba(17,14,14,0.08)] hover:bg-white",
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
          "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[0.02em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--ring),0.9)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60",
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
