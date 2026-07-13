import { z } from "zod";
import { locales } from "@/config/site";
import { passwordSchema } from "@/lib/security/password";

const phoneSchema = z
  .string()
  .trim()
  .max(40)
  .regex(/^[0-9+() .-]*$/, "Phone may contain digits, spaces, plus signs, parentheses, periods, and dashes.")
  .optional()
  .or(z.literal(""));

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  preferredLocale: z.enum(locales),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm the new password."),
  })
  .superRefine((value, ctx) => {
    if (value.newPassword !== value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    if (value.currentPassword === value.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "Choose a new password that is different from the current password.",
      });
    }
  });

export const emailChangeSchema = z.object({
  currentPassword: z.string().optional(),
  email: z.string().email().transform((value) => value.toLowerCase()),
});
