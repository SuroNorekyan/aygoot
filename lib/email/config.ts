import { siteConfig } from "@/config/site";

export class MailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MailConfigurationError";
  }
}

const read = (name: string) => process.env[name]?.trim();

export function getMailConfig() {
  const host = read("SMTP_HOST");
  const rawPort = read("SMTP_PORT");
  const user = read("SMTP_USER");
  const pass = read("SMTP_PASS");
  const from = read("EMAIL_FROM");
  const replyTo = read("EMAIL_REPLY_TO") ?? user;

  if (!host) throw new MailConfigurationError("SMTP_HOST is required.");
  if (!rawPort) throw new MailConfigurationError("SMTP_PORT is required.");
  if (!user) throw new MailConfigurationError("SMTP_USER is required.");
  if (!pass) throw new MailConfigurationError("SMTP_PASS is required.");
  if (!from) throw new MailConfigurationError("EMAIL_FROM is required.");

  const port = Number.parseInt(rawPort, 10);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new MailConfigurationError("SMTP_PORT must be a valid TCP port.");
  }

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from,
    replyTo,
  };
}

export function getAdminNotificationEmail() {
  return (
    read("ADMIN_NOTIFICATION_EMAIL") ??
    read("SMTP_USER") ??
    siteConfig.contact.email
  );
}

export function getAppUrl() {
  const value = read("APP_URL") ?? read("NEXTAUTH_URL");
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}
