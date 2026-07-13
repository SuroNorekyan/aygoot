import { z } from "zod";
import { passwordSchema } from "@/lib/security/password";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: passwordSchema,
  confirmPassword: z.string().optional(),
}).superRefine((value, ctx) => {
  if (value.confirmPassword !== undefined && value.password !== value.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    });
  }
});

export const credentialsSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
});
