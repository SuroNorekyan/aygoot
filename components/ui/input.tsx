"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-[rgba(var(--border),0.9)] bg-white/80 px-4 text-sm text-[rgb(var(--foreground))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] outline-none transition placeholder:text-[rgba(var(--muted-foreground),0.9)] focus:border-[rgba(var(--accent),0.9)] focus:shadow-[0_0_0_4px_rgba(210,168,118,0.18)]",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
