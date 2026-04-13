"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LocaleSwitcher } from "./locale-switcher";

type NavItem = {
  href: string;
  label: string;
};

export function MobileNav({
  items,
  accountHref,
}: {
  items: NavItem[];
  accountHref: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="lg:hidden">
        <SheetHeader>
          <SheetTitle>Aygoot</SheetTitle>
        </SheetHeader>
        <LocaleSwitcher />
        <nav className="mt-3 flex flex-col gap-4">
          {items.map((item) => (
            <SheetClose asChild key={item.href}>
              <a href={item.href} className="text-lg font-semibold text-[rgb(var(--foreground))]">
                {item.label}
              </a>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <a href={accountHref} className="pt-3 text-sm font-semibold text-[rgb(var(--muted-foreground))]">
              Account
            </a>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
