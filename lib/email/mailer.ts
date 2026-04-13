import nodemailer from "nodemailer";

type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

function getTransporter() {
  if (transporterPromise) {
    return transporterPromise;
  }

  transporterPromise = (async () => {
    const host = process.env.SMTP_HOST?.trim();
    const port = Number.parseInt(process.env.SMTP_PORT ?? "", 10);
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();

    if (!host || !port || !user || !pass) {
      throw new Error("SMTP is not fully configured.");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.verify();
    return transporter;
  })();

  return transporterPromise;
}

export async function sendEmail(options: MailOptions) {
  const from = process.env.EMAIL_FROM?.trim() ?? "Aygoot <no-reply@aygoot.am>";
  const transporter = await getTransporter();

  await transporter.sendMail({
    from,
    ...options,
  });
}

export async function safeSendEmail(options: MailOptions) {
  try {
    await sendEmail(options);
  } catch (error) {
    console.warn("[email] send skipped or failed", error);
  }
}

export function toEmailHtml(lines: string[]) {
  return lines
    .map((line) =>
      line
        ? `<p style="margin:0 0 12px;font-size:14px;line-height:1.65;">${line}</p>`
        : `<div style="height:8px"></div>`,
    )
    .join("");
}
