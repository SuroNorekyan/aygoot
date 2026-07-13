"use client";

import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { adminNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { AdminSignOutButton } from "./admin-sign-out-button";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-6 border-b border-[rgba(var(--border),0.4)] pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[rgb(var(--muted-foreground))]">
            Aygoot admin
          </p>
          <h1 className="display-font text-4xl font-medium">Operations console</h1>
          <p className="max-w-2xl text-sm leading-7 text-[rgb(var(--muted-foreground))]">
            Manage houses, review booking requests, and keep the guest experience polished.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href="/">
              <Home className="h-4 w-4" />
              View site
            </a>
          </Button>
          <AdminSignOutButton />
        </div>
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
                  ? "border border-[rgba(173,128,84,0.28)] bg-[rgba(173,128,84,0.16)] text-[rgb(var(--secondary))] shadow-[0_8px_18px_rgba(131,94,62,0.08)]"
                  : "bg-white/70 text-[rgb(var(--muted-foreground))] hover:bg-white hover:text-[rgb(var(--foreground))]",
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
