"use client";

import { usePathname } from "next/navigation";
import { adminNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-6 border-b border-[rgba(var(--border),0.4)] pb-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[rgb(var(--muted-foreground))]">
          Aygoot admin
        </p>
        <h1 className="display-font text-4xl font-medium">Operations console</h1>
        <p className="max-w-2xl text-sm leading-7 text-[rgb(var(--muted-foreground))]">
          Manage houses, review booking requests, and keep the guest experience polished.
        </p>
      </div>
      <nav className="flex flex-wrap gap-2">
        {adminNavigation.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                active
                  ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                  : "bg-white/70 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]",
              )}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
