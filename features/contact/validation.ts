import { z } from "zod";
import { locales } from "@/config/site";

export const contactInquirySchema = z.object({
  locale: z.enum(locales),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(10).max(1500),
});
