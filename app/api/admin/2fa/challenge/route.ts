import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { adminTwoFactorCookie } from "@/lib/security/admin-2fa";
import { decryptSecret, matchRecoveryCodeIndex, verifyTotpToken } from "@/lib/security/totp";

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    const body = (await request.json().catch(() => null)) as {
      token?: string;
      recoveryCode?: string;
    } | null;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFASecret: true,
        recoveryCodes: true,
      },
    });

    if (!user?.twoFASecret || !user.recoveryCodes) {
      return NextResponse.json({ error: "2FA is not configured." }, { status: 400 });
    }

    let verified = false;
    let nextRecoveryCodes = user.recoveryCodes;

    if (body?.token) {
      verified = verifyTotpToken(body.token, decryptSecret(user.twoFASecret));
    } else if (body?.recoveryCode) {
      const index = await matchRecoveryCodeIndex(body.recoveryCode, user.recoveryCodes);
      verified = index >= 0;
      if (index >= 0) {
        nextRecoveryCodes = user.recoveryCodes.filter((_, itemIndex) => itemIndex !== index);
      }
    }

    if (!verified) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    if (nextRecoveryCodes !== user.recoveryCodes) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { recoveryCodes: nextRecoveryCodes },
      });
    }

    const cookieStore = await cookies();
    cookieStore.set(await adminTwoFactorCookie(session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to verify challenge." }, { status: 500 });
  }
}
