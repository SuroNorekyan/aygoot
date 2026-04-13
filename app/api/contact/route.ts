import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { sendContactInquiryNotification } from "@/lib/email/contact-notifications";
import { contactInquirySchema } from "@/features/contact/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactInquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid inquiry payload.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const inquiry = await prisma.contactInquiry.create({
    data: {
      locale: parsed.data.locale,
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    },
  });

  await sendContactInquiryNotification(inquiry);

  return NextResponse.json({ success: true }, { status: 201 });
}
