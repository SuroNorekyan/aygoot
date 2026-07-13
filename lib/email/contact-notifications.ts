import { safeSendEmail, toEmailHtml } from "./mailer";

export async function sendContactInquiryNotification(options: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "aygoodriverlake@gmail.com";
  const lines = [
    `New contact inquiry from ${options.name}`,
    "",
    `Email: ${options.email}`,
    `Phone: ${options.phone || "—"}`,
    "",
    options.message,
  ];

  await safeSendEmail({
    to: adminEmail,
    subject: `Aygoot contact inquiry from ${options.name}`,
    text: lines.join("\n"),
    html: toEmailHtml(lines),
  });
}
