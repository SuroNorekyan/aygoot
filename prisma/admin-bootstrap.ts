import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../lib/security/password";

const requiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required for administrator bootstrap.`);
  }

  return value;
};

export async function bootstrapAdmin(prisma: PrismaClient) {
  const name = requiredEnv("ADMIN_SEED_NAME");
  const email = requiredEnv("ADMIN_SEED_EMAIL").toLowerCase();
  const password = requiredEnv("ADMIN_SEED_PASSWORD");
  const forcePasswordReset = process.env.ADMIN_SEED_FORCE_PASSWORD_RESET === "true";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const passwordHash = await hashPassword(password);
    return prisma.user.create({
      data: {
        email,
        name,
        role: Role.ADMIN,
        passwordHash,
      },
    });
  }

  return prisma.user.update({
    where: { id: existing.id },
    data: {
      name,
      role: Role.ADMIN,
      ...(forcePasswordReset ? { passwordHash: await hashPassword(password) } : {}),
    },
  });
}
