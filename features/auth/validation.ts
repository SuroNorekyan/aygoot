import { z } from "zod";
import { passwordSchema } from "@/lib/security/password";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: passwordSchema,
});

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
