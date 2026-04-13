import { cookies } from "next/headers";
import { ADMIN_2FA_COOKIE } from "@/lib/security/admin-2fa";

export async function readAdminTwoFactorCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_2FA_COOKIE)?.value ?? null;
}
