import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { adminTwoFactorCookie } from "@/lib/security/admin-2fa";
import { decryptSecret, generateRecoveryCodes, verifyTotpToken } from "@/lib/security/totp";

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    const body = (await request.json().catch(() => null)) as { token?: string } | null;

    if (!body?.token) {
      return NextResponse.json({ error: "Token is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFASecret: true },
    });

    if (!user?.twoFASecret) {
      return NextResponse.json({ error: "2FA setup was not initialized." }, { status: 400 });
    }

    const secret = decryptSecret(user.twoFASecret);
    const valid = verifyTotpToken(body.token, secret);

    if (!valid) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    const { codes, hashes } = await generateRecoveryCodes();
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFAEnabled: true,
        recoveryCodes: hashes,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set(await adminTwoFactorCookie(session.user.id));

    return NextResponse.json({ success: true, recoveryCodes: codes });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to verify 2FA." }, { status: 500 });
  }
}
