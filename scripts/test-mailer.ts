import { config } from "dotenv";
import { getMailConfig } from "@/lib/email/config";
import { maskEmail, sendEmail, verifyMailTransport } from "@/lib/email/mailer";
import { brandedEmailLayout, paragraph } from "@/lib/email/templates/layout";

config({ path: ".env", override: false });
config({ path: ".env.local", override: true });

const configValues = getMailConfig();
const recipient = process.env.MAIL_TEST_TO?.trim() || configValues.user;
const timestamp = new Date().toISOString();

console.log("[mail:test] verifying SMTP transport", {
  host: configValues.host,
  port: configValues.port,
  secure: configValues.secure,
  user: maskEmail(configValues.user),
  recipient: maskEmail(recipient),
});

await verifyMailTransport();

await sendEmail({
  to: recipient,
  subject: `AyGood mail system test - ${timestamp}`,
  text: [
    "This is a test email from the AyGood booking mail system.",
    `Timestamp: ${timestamp}`,
    "",
    "If you received this message, SMTP verification and sending are working.",
  ].join("\n"),
  html: brandedEmailLayout({
    title: "AyGood mail system test",
    preheader: "SMTP verification and sending are working.",
    badge: { label: "Test email", tone: "success" },
    body: [
      paragraph("This is a test email from the AyGood booking mail system."),
      paragraph(`Timestamp: ${timestamp}`),
      paragraph("If you received this message, SMTP verification and sending are working."),
    ].join(""),
  }),
});

console.log("[mail:test] sent test email", {
  recipient: maskEmail(recipient),
});
