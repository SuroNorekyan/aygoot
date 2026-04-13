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
        "min-h-[120px] w-full rounded-2xl border border-[rgba(var(--border),0.9)] bg-white/80 px-4 py-3 text-sm text-[rgb(var(--foreground))] outline-none transition placeholder:text-[rgba(var(--muted-foreground),0.9)] focus:border-[rgba(var(--accent),0.9)] focus:shadow-[0_0_0_4px_rgba(210,168,118,0.18)]",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
