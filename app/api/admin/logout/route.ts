import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearedAdminTwoFactorCookie } from "@/lib/security/admin-2fa";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(clearedAdminTwoFactorCookie);

  return NextResponse.json({ success: true });
}
