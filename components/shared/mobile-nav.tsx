"use client";

import { CircleUserRound, Menu, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LocaleSwitcher } from "./locale-switcher";

type NavItem = {
  href: string;
  label: string;
};

export function MobileNav({
  items,
  accountHref,
  accountLabel,
  description,
}: {
  items: NavItem[];
  accountHref: string;
  accountLabel: string;
  description: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="light" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,251,245,0.96),rgba(244,237,226,0.94))] lg:hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(108,136,102,0.2),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(172,128,84,0.18),transparent_32%)]" />
        <SheetHeader className="relative">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[linear-gradient(135deg,rgba(74,95,72,1),rgba(47,35,30,1))] text-white shadow-[0_16px_30px_rgba(37,28,21,0.2)]">
            <Mountain className="h-5 w-5" />
          </div>
          <SheetTitle className="pt-3">Aygoot</SheetTitle>
          <p className="max-w-[18rem] text-sm leading-7 text-[rgb(var(--muted-foreground))]">
            {description}
          </p>
        </SheetHeader>
        <div className="relative">
          <LocaleSwitcher />
        </div>
        <nav className="relative mt-2 flex flex-col gap-2">
          {items.map((item) => (
            <SheetClose asChild key={item.href}>
              <a
                href={item.href}
                className="rounded-[22px] border border-black/[0.04] bg-white/55 px-4 py-3 text-lg font-semibold text-[rgb(var(--foreground))] shadow-[0_10px_20px_rgba(37,28,21,0.05)] transition hover:bg-white"
              >
                {item.label}
              </a>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <a
              href={accountHref}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-black/[0.04] bg-[rgba(255,251,245,0.72)] px-4 py-4 text-sm font-semibold text-[rgb(var(--foreground))] shadow-[0_10px_20px_rgba(37,28,21,0.05)]"
            >
              <CircleUserRound className="h-4 w-4 text-[rgb(var(--forest))]" />
              {accountLabel}
            </a>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
