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
        "min-h-[120px] w-full rounded-[22px] border border-[rgba(var(--border-soft),0.28)] bg-[rgba(255,251,245,0.82)] px-4 py-3 text-sm text-[rgb(var(--foreground))] shadow-[0_12px_22px_rgba(37,28,21,0.04),inset_0_1px_0_rgba(255,255,255,0.45)] outline-none transition placeholder:text-[rgba(var(--muted-foreground),0.9)] focus:border-[rgba(var(--forest),0.5)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(116,143,111,0.14)]",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
