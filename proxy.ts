import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { ADMIN_2FA_COOKIE, verifyAdminTwoFactorToken } from "@/lib/security/admin-2fa";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default auth(async (request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!request.auth?.user) {
      const url = new URL("/en/account", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (request.auth.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/en", request.url));
    }

    if (
      request.auth.user.twoFAEnabled &&
      !pathname.startsWith("/admin/2fa")
    ) {
      const token = request.cookies.get(ADMIN_2FA_COOKIE)?.value;
      if (!token) {
        return NextResponse.redirect(new URL("/admin/2fa/challenge", request.url));
      }

      try {
        const userId = await verifyAdminTwoFactorToken(token);
        if (userId !== request.auth.user.id) {
          return NextResponse.redirect(new URL("/admin/2fa/challenge", request.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/admin/2fa/challenge", request.url));
      }
    }

    return NextResponse.next();
  }

  return intlMiddleware(request as NextRequest);
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
