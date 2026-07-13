import { NextResponse } from "next/server";
import { requireCurrentUser, UnauthorizedError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { profileUpdateSchema } from "@/features/account/validation";

export async function PATCH(request: Request) {
  try {
    const { user } = await requireCurrentUser();
    const body = await request.json().catch(() => null);
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid profile payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: payload.name,
        phone: payload.phone || null,
        preferredLocale: payload.preferredLocale,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        preferredLocale: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
  }
}
