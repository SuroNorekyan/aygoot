import { NextResponse } from "next/server";
import { HouseStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdminSession, UnauthorizedError } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

const statusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = statusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid house status payload.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const status = parsed.data.status as HouseStatus;
    const house = await prisma.house.update({
      where: { id },
      data: {
        status,
        publishedAt: status === HouseStatus.PUBLISHED ? new Date() : null,
      },
      select: { id: true, status: true },
    });

    return NextResponse.json({ house });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    console.error(error);
    return NextResponse.json({ error: "Unable to update house status." }, { status: 500 });
  }
}
