import nodemailer from "nodemailer";
import type { EmailType } from "@prisma/client";
import { EmailDeliveryStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getMailConfig } from "./config";

type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  bookingId?: string | null;
  type?: EmailType;
};

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return "invalid-email";
  return `${local.slice(0, 2)}***@${domain}`;
}

function safeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message.slice(0, 500);
  return String(error).slice(0, 500);
}

function getTransporter() {
  if (transporterPromise) {
    return transporterPromise;
  }

  transporterPromise = (async () => {
    const config = getMailConfig();

    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      connectionTimeout: 15_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  })();

  return transporterPromise;
}

export async function sendEmail(options: MailOptions) {
  const config = getMailConfig();
  const transporter = await getTransporter();

  await transporter.sendMail({
    from: config.from,
    replyTo: options.replyTo ?? config.replyTo,
    ...options,
  });
}

export async function verifyMailTransport() {
  const transporter = await getTransporter();
  await transporter.verify();
}

async function createDelivery(options: MailOptions) {
  if (!options.type) return null;

  return prisma.emailDelivery.create({
    data: {
      bookingId: options.bookingId ?? null,
      type: options.type,
      recipient: options.to,
      subject: options.subject,
    },
  });
}

export async function safeSendEmail(options: MailOptions) {
  const delivery = await createDelivery(options).catch((error) => {
    console.warn("[email] delivery record creation failed", {
      event: "email_delivery_record_failed",
      bookingId: options.bookingId ?? null,
      type: options.type ?? "UNTRACKED",
      recipient: maskEmail(options.to),
      error: safeErrorMessage(error),
    });
    return null;
  });

  try {
    await sendEmail(options);
    if (delivery) {
      await prisma.emailDelivery.update({
        where: { id: delivery.id },
        data: {
          status: EmailDeliveryStatus.SENT,
          attemptCount: { increment: 1 },
          sentAt: new Date(),
          lastError: null,
        },
      });
    }
    return { success: true as const };
  } catch (error) {
    const message = safeErrorMessage(error);
    if (delivery) {
      await prisma.emailDelivery.update({
        where: { id: delivery.id },
        data: {
          status: EmailDeliveryStatus.FAILED,
          attemptCount: { increment: 1 },
          lastError: message,
        },
      });
    }
    console.warn("[email] send failed", {
      event: `${options.type ?? "email"}_failed`,
      bookingId: options.bookingId ?? null,
      recipient: maskEmail(options.to),
      error: message,
    });
    return { success: false as const, error: message };
  }
}
