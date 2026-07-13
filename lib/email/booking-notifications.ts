import type { Locale } from "@/config/site";
import { formatCurrencyAmd, formatDateRange } from "@/lib/utils/format";
import { safeSendEmail, toEmailHtml } from "./mailer";

type BookingEmailBase = {
  bookingId: string;
  locale: Locale;
  houseName: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  totalPriceAmd: number;
};

const adminEmail = process.env.ADMIN_EMAIL ?? "aygoodriverlake@gmail.com";

export async function sendBookingRequestEmails(options: BookingEmailBase) {
  const subject = `Aygoot booking request for ${options.houseName}`;
  const range = formatDateRange(options.locale, options.checkIn, options.checkOut);
  const price = formatCurrencyAmd(options.locale, options.totalPriceAmd);
  const lines = [
    `Hello ${options.guestName},`,
    `We received your booking request for ${options.houseName}.`,
    "",
    `Dates: ${range}`,
    `Guests: ${options.guestCount}`,
    `Estimated total: ${price}`,
    "",
    "Our team will review the request shortly and confirm availability by email.",
  ];

  await Promise.all([
    safeSendEmail({
      to: options.guestEmail,
      subject,
      text: lines.join("\n"),
      html: toEmailHtml(lines),
    }),
    safeSendEmail({
      to: adminEmail,
      subject: `New Aygoot request: ${options.houseName}`,
      text: [
        `Booking ID: ${options.bookingId}`,
        `Guest: ${options.guestName}`,
        `Email: ${options.guestEmail}`,
        `Phone: ${options.guestPhone ?? "—"}`,
        `Dates: ${range}`,
      ].join("\n"),
    }),
  ]);
}

export async function sendBookingConfirmationEmail(options: BookingEmailBase) {
  const range = formatDateRange(options.locale, options.checkIn, options.checkOut);
  const price = formatCurrencyAmd(options.locale, options.totalPriceAmd);
  const lines = [
    `Hello ${options.guestName},`,
    `Your stay at ${options.houseName} has been confirmed.`,
    "",
    `Dates: ${range}`,
    `Guests: ${options.guestCount}`,
    `Total: ${price}`,
    "",
    "We’ll follow up with practical arrival details shortly.",
  ];

  await safeSendEmail({
    to: options.guestEmail,
    subject: `Aygoot confirmed your stay at ${options.houseName}`,
    text: lines.join("\n"),
    html: toEmailHtml(lines),
  });
}

export async function sendBookingRejectedEmail(options: BookingEmailBase) {
  const lines = [
    `Hello ${options.guestName},`,
    `We’re sorry, but your request for ${options.houseName} could not be confirmed.`,
    "",
    "You can reply to this email if you’d like alternative dates or another house recommendation.",
  ];

  await safeSendEmail({
    to: options.guestEmail,
    subject: `Aygoot update for ${options.houseName}`,
    text: lines.join("\n"),
    html: toEmailHtml(lines),
  });
}
