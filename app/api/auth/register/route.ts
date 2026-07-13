import { NextResponse } from "next/server";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/security/password";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { registerSchema } from "@/features/auth/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid registration payload.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email;
  const rate = consumeRateLimit(`register:${normalizedEmail}`, 5, 60_000);

  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 },
    );
  }

  const passwordHash = await hashPassword(password);
  try {
    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: Role.USER,
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

  return NextResponse.json({ success: true }, { status: 201 });
}
