import { auth } from "@/auth";
import { publicNavigation } from "@/config/navigation";
import type { Locale } from "@/config/site";
import { Link } from "@/lib/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const session = await auth();
  const items = publicNavigation.map((item) => ({
    href: `/${locale}${item.href === "/" ? "" : item.href}`,
    label: t(item.key),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(var(--border),0.35)] bg-[rgba(250,247,238,0.78)] backdrop-blur-xl">
      <div className="container-shell flex items-center gap-4 py-4">
        <MobileNav items={items} accountHref={`/${locale}/account`} />
        <Link href="/" locale={locale} className="shrink-0">
          <Logo />
        </Link>
        <nav className="ml-10 hidden items-center gap-7 lg:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              locale={locale}
              className="text-sm font-semibold text-[rgb(var(--muted-foreground))] transition hover:text-[rgb(var(--foreground))]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden lg:block">
          <LocaleSwitcher />
        </div>
        <div className="ml-auto flex items-center gap-3 lg:ml-4">
          {session?.user?.role === "ADMIN" ? (
            <Button asChild variant="light" className="hidden sm:inline-flex">
              <a href="/admin">{t("navigation.admin")}</a>
            </Button>
          ) : (
            <Button asChild variant="light" className="hidden sm:inline-flex">
              <Link href="/account" locale={locale}>
                {t("navigation.account")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
