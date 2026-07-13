import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { verifyPassword } from "@/lib/security/password";
import { requireCurrentUser, UnauthorizedError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { emailChangeSchema } from "@/features/account/validation";

export async function PATCH(request: Request) {
  try {
    const { user } = await requireCurrentUser();
    const rate = consumeRateLimit(`account:email:${user.id}`, 5, 60_000);

    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many email-change attempts. Please try again later." },
        { status: 429 },
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Provider-managed email changes are not currently supported." },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = emailChangeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (!parsed.data.currentPassword) {
      return NextResponse.json({ error: "Current password is required." }, { status: 400 });
    }

    const currentEmail = user.email?.toLowerCase();
    if (currentEmail === parsed.data.email) {
      return NextResponse.json({ error: "Choose a different email address." }, { status: 400 });
    }

    const currentValid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!currentValid) {
      return NextResponse.json({ error: "Unable to change email." }, { status: 400 });
    }

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: parsed.data.email,
          emailVerified: null,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 },
        );
      }

      throw error;
    }

    return NextResponse.json({ success: true, signInRequired: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ error: "Unable to change email." }, { status: 500 });
  }
}
