import type { BookingStatus, EmailType } from "@prisma/client";
import type { Locale } from "@/config/site";

export type MailContent = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export type BookingEmailData = {
  bookingId: string;
  orderId: string;
  locale: Locale;
  houseName: string;
  houseSlug?: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string | null;
  guestNotes?: string | null;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  totalPriceAmd: number;
  status: BookingStatus;
  userId?: string | null;
  createdAt?: Date;
};

export type BookingEmailType = Extract<
  EmailType,
  | "BOOKING_REQUEST_CUSTOMER"
  | "BOOKING_REQUEST_ADMIN"
  | "BOOKING_CONFIRMED"
  | "BOOKING_REJECTED"
  | "BOOKING_CANCELLED"
>;
