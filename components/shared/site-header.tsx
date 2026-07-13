import { publicNavigation } from "@/config/navigation";
import type { Locale } from "@/config/site";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const items = publicNavigation.map((item) => ({
    href: `/${locale}${item.href === "/" ? "" : item.href}`,
    label: t(item.key),
  }));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.04] bg-white/70 shadow-[0_8px_26px_rgba(0,0,0,0.05)] backdrop-blur-xl">
      <div className="container-shell flex items-center gap-4 py-3.5">
        <MobileNav
          items={items}
          accountHref={`/${locale}/account`}
          accountLabel={t("navigation.account")}
          description={t("brand.tagline")}
        />
        <Link href="/" locale={locale} className="shrink-0">
          <Logo />
        </Link>
        <nav className="ml-10 hidden items-center gap-2 rounded-full border border-black/[0.04] bg-[rgba(255,251,245,0.52)] px-3 py-2 shadow-[0_10px_30px_rgba(37,28,21,0.05)] lg:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              locale={locale}
              className="rounded-full px-3 py-2 text-sm font-semibold text-[rgb(var(--muted-foreground))] transition hover:bg-white/80 hover:text-[rgb(var(--foreground))]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden lg:block">
          <LocaleSwitcher />
        </div>
        <div className="ml-auto flex items-center gap-3 lg:ml-4">
          <Button asChild variant="light" className="hidden sm:inline-flex">
            <Link href="/account" locale={locale}>
              <CircleUserRound className="h-4 w-4" />
              {t("navigation.account")}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
