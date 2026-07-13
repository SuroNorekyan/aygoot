import { NextResponse } from "next/server";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { hashPassword, verifyPassword } from "@/lib/security/password";
import { requireCurrentUser, UnauthorizedError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { passwordChangeSchema } from "@/features/account/validation";

export async function PATCH(request: Request) {
  try {
    const { user } = await requireCurrentUser();
    const rate = consumeRateLimit(`account:password:${user.id}`, 5, 60_000);

    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many password attempts. Please try again later." },
        { status: 429 },
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "This account uses an external sign-in provider. Password changes are not available here." },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = passwordChangeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid password payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const currentValid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!currentValid) {
      return NextResponse.json({ error: "Unable to change password." }, { status: 400 });
    }

    const samePassword = await verifyPassword(parsed.data.newPassword, user.passwordHash);
    if (samePassword) {
      return NextResponse.json(
        { error: "Choose a new password that is different from the current password." },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(parsed.data.newPassword),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ error: "Unable to change password." }, { status: 500 });
  }
}
