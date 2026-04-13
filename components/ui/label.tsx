"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  requiredIndicator?: boolean;
};

export function Label({ className, requiredIndicator = false, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn("mb-2 inline-flex text-sm font-medium text-[rgb(var(--foreground))]", className)}
      {...props}
    >
      <span>{children}</span>
      {requiredIndicator ? <span className="ml-1 text-[rgb(var(--accent))]">*</span> : null}
    </LabelPrimitive.Root>
  );
}
