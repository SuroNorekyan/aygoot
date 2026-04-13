import { auth } from "@/auth";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function requireUserSession() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireUserSession();

  if (session.user.role !== "ADMIN") {
    throw new UnauthorizedError();
  }

  return session;
}
