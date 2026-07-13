import { EmailType } from "@prisma/client";
import { getAdminNotificationEmail } from "./config";
import { safeSendEmail } from "./mailer";
import { brandedEmailLayout, paragraph, summaryTable } from "./templates/layout";

export async function sendContactInquiryNotification(options: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}) {
  const subject = `AyGood contact inquiry from ${options.name}`;
  const text = [
    `New contact inquiry from ${options.name}`,
    "",
    `Email: ${options.email}`,
    `Phone: ${options.phone || "—"}`,
    "",
    options.message,
  ].join("\n");

  await safeSendEmail({
    to: getAdminNotificationEmail(),
    replyTo: options.email,
    subject,
    text,
    html: brandedEmailLayout({
      title: subject,
      preheader: `New inquiry from ${options.name}.`,
      badge: { label: "Contact inquiry", tone: "pending" },
      body: [
        paragraph("A new contact inquiry was submitted from the AyGood website."),
        summaryTable([
          ["Name", options.name],
          ["Email", options.email],
          ["Phone", options.phone || "—"],
        ]),
        paragraph(options.message),
      ].join(""),
    }),
    type: EmailType.CONTACT_INQUIRY_ADMIN,
  });
}
