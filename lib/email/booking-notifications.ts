import { EmailType } from "@prisma/client";
import { getAdminNotificationEmail } from "./config";
import { safeSendEmail } from "./mailer";
import type { BookingEmailData } from "./types";
import {
  adminBookingRequestTemplate,
  bookingCancelledTemplate,
  bookingConfirmedTemplate,
  bookingRejectedTemplate,
  bookingRequestCustomerTemplate,
} from "./templates/booking";

export async function sendBookingRequestEmails(data: BookingEmailData) {
  const customer = bookingRequestCustomerTemplate(data);
  const admin = adminBookingRequestTemplate(data);

  const [customerResult, adminResult] = await Promise.all([
    safeSendEmail({
      to: data.guestEmail,
      subject: customer.subject,
      text: customer.text,
      html: customer.html,
      bookingId: data.bookingId,
      type: EmailType.BOOKING_REQUEST_CUSTOMER,
    }),
    safeSendEmail({
      to: getAdminNotificationEmail(),
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      replyTo: data.guestEmail,
      bookingId: data.bookingId,
      type: EmailType.BOOKING_REQUEST_ADMIN,
    }),
  ]);

  return {
    customerSent: customerResult.success,
    adminSent: adminResult.success,
  };
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const content = bookingConfirmedTemplate(data);

  return safeSendEmail({
    to: data.guestEmail,
    subject: content.subject,
    text: content.text,
    html: content.html,
    bookingId: data.bookingId,
    type: EmailType.BOOKING_CONFIRMED,
  });
}

export async function sendBookingRejectedEmail(data: BookingEmailData) {
  const content = bookingRejectedTemplate(data);

  return safeSendEmail({
    to: data.guestEmail,
    subject: content.subject,
    text: content.text,
    html: content.html,
    bookingId: data.bookingId,
    type: EmailType.BOOKING_REJECTED,
  });
}

export async function sendBookingCancelledEmail(data: BookingEmailData) {
  const content = bookingCancelledTemplate(data);

  return safeSendEmail({
    to: data.guestEmail,
    subject: content.subject,
    text: content.text,
    html: content.html,
    bookingId: data.bookingId,
    type: EmailType.BOOKING_CANCELLED,
  });
}
