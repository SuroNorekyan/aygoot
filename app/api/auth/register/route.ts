import { NextResponse } from "next/server";
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
  const normalizedEmail = email.toLowerCase();
  const rate = consumeRateLimit(`register:${normalizedEmail}`, 5, 60_000);

  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
