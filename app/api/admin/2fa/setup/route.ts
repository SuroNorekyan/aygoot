import { NextResponse } from "next/server";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { generateQRCodeDataUrl, generateTwoFactorSecret, encryptSecret } from "@/lib/security/totp";

export async function POST() {
  try {
    const session = await requireAdminSession();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    if (!user?.email) {
      return NextResponse.json({ error: "Admin email is missing." }, { status: 400 });
    }

    const { secret, otpauth } = generateTwoFactorSecret(user.email);
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFAEnabled: false,
        twoFASecret: encryptSecret(secret),
        recoveryCodes: [],
      },
    });

    return NextResponse.json({
      qrCode: await generateQRCodeDataUrl(otpauth),
      manualEntry: secret.replace(/(.{4})/g, "$1 ").trim(),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to prepare 2FA." }, { status: 500 });
  }
}
