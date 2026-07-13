import bcrypt from "bcryptjs";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a symbol.");

const cost = Number.parseInt(process.env.BCRYPT_COST ?? "12", 10);

export const hashPassword = async (password: string) => bcrypt.hash(password, cost);

export const verifyPassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);
