import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import type { Locale } from "@/config/site";
import { getUserBookings } from "@/features/bookings/service";
import { createMetadata } from "@/lib/utils/metadata";
import { prisma } from "@/lib/db/prisma";
import { AccountAuthPanel } from "@/components/marketing/account-auth-panel";
import { AccountDashboard } from "@/components/marketing/account-dashboard";

export const dynamic = "force-dynamic";

const googleAuthConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) &&
  !process.env.AUTH_GOOGLE_ID?.startsWith("TODO_") &&
  !process.env.AUTH_GOOGLE_SECRET?.startsWith("TODO_");

function safeCallbackUrl(callbackUrl: string | undefined, locale: Locale) {
  if (!callbackUrl) return `/${locale}/account`;
  if (!callbackUrl.startsWith("/")) return `/${locale}/account`;
  if (callbackUrl.startsWith("//")) return `/${locale}/account`;
  return callbackUrl;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return createMetadata(t("auth.title"), t("auth.subtitle"));
}

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const sanitizedCallbackUrl = safeCallbackUrl(callbackUrl, locale);

  if (!session?.user) {
    return (
      <div className="pb-12 pt-6">
        <AccountAuthPanel
          locale={locale}
          callbackUrl={sanitizedCallbackUrl}
          googleAuthConfigured={googleAuthConfigured}
          copy={{
            title: t("auth.title"),
            subtitle: t("auth.subtitle"),
            name: t("auth.name"),
            email: t("auth.email"),
            password: t("auth.password"),
            confirmPassword: t("auth.confirmPassword"),
            passwordHint: t("auth.passwordHint"),
            login: t("auth.login"),
            register: t("auth.register"),
            switchToRegister: t("auth.switchToRegister"),
            switchToLogin: t("auth.switchToLogin"),
          }}
        />
      </div>
    );
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const [bookings, user] = await Promise.all([
    getUserBookings(session.user.id, locale),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        preferredLocale: true,
        image: true,
        passwordHash: true,
        createdAt: true,
      },
    }),
  ]);

  if (!user) {
    redirect(`/${locale}/account`);
  }

  return (
    <AccountDashboard
      locale={locale}
      user={{
        name: user.name,
        email: user.email,
        phone: user.phone,
        preferredLocale: user.preferredLocale,
        image: user.image,
        createdAt: user.createdAt,
        hasPassword: Boolean(user.passwordHash),
      }}
      bookings={bookings}
      copy={{
        eyebrow: t("dashboard.eyebrow"),
        title: t("dashboard.title"),
        description: t("dashboard.description"),
        history: t("dashboard.history"),
        empty: t("dashboard.empty"),
        signOut: t("dashboard.signOut"),
      }}
    />
  );
}
