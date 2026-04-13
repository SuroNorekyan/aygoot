import { z } from "zod";
import { parseDateOnly } from "@/lib/utils/dates";
import { locales } from "@/config/site";

export const bookingSchema = z
  .object({
    houseId: z.string().min(1),
    checkIn: z.string().min(1),
    checkOut: z.string().min(1),
    guestCount: z.coerce.number().int().min(1).max(12),
    guestName: z.string().min(2).max(120),
    guestEmail: z.string().email(),
    guestPhone: z.string().min(5).max(40),
    guestNotes: z.string().max(1200).optional().or(z.literal("")),
    locale: z.enum(locales),
  })
  .superRefine((value, ctx) => {
    const checkIn = parseDateOnly(value.checkIn);
    const checkOut = parseDateOnly(value.checkOut);

    if (!checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkIn"],
        message: "Invalid check-in date.",
      });
      return;
    }

    if (!checkOut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Invalid check-out date.",
      });
      return;
    }

    if (checkOut <= checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out must be after check-in.",
      });
    }
  });

export const bookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "REJECTED", "CANCELLED"]),
  adminNotes: z.string().max(1200).optional().or(z.literal("")),
});
