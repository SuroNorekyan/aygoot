"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "light";
type Size = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:bg-[rgb(var(--secondary))]",
  secondary:
    "bg-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))] hover:brightness-105",
  ghost: "bg-transparent text-[rgb(var(--foreground))] hover:bg-[rgba(var(--primary),0.08)]",
  outline:
    "border border-[rgba(var(--border),0.8)] bg-transparent text-[rgb(var(--foreground))] hover:bg-[rgba(var(--accent),0.08)]",
  light:
    "bg-white/85 text-[rgb(var(--foreground))] shadow-[0_12px_28px_rgba(17,14,14,0.08)] hover:bg-white",
};

const sizeClasses: Record<Size, string> = {
  default: "h-11 px-5 text-sm",
  sm: "h-9 rounded-full px-4 text-xs",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, variant = "primary", size = "default", ...props }, ref) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref as never}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--ring),0.9)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
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
