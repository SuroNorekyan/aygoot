import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends UnauthorizedError {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireUserSession() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  return session;
}

export async function requireCurrentUser() {
  const session = await requireUserSession();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      preferredLocale: true,
      role: true,
      passwordHash: true,
      twoFAEnabled: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError();
  }

  return { session, user };
}

export async function requireAdminSession() {
  const { session, user } = await requireCurrentUser();

  if (user.role !== "ADMIN") {
    throw new ForbiddenError();
  }

  return session;
}

export async function requireAdminUser() {
  const { user } = await requireCurrentUser();

  if (user.role !== "ADMIN") {
    throw new ForbiddenError();
  }

  return user;
}
