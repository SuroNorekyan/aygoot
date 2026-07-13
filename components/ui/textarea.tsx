"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-[20px] border border-[rgba(var(--border-soft),0.22)] bg-[rgba(255,251,245,0.9)] px-4 py-3 text-sm font-medium leading-6 text-[rgb(var(--foreground))] shadow-[0_12px_24px_rgba(37,28,21,0.05),inset_0_1px_0_rgba(255,255,255,0.68)] outline-none transition placeholder:font-normal placeholder:text-[rgba(var(--muted-foreground),0.76)] hover:border-[rgba(var(--border-soft),0.36)] hover:bg-white focus:border-[rgba(var(--forest),0.42)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(116,143,111,0.13),0_12px_24px_rgba(37,28,21,0.05)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
