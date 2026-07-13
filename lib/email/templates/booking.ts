import { BookingStatus } from "@prisma/client";
import { siteConfig, type Locale, resolveLocale } from "@/config/site";
import { formatCurrencyAmd, formatDateRange, formatDateTime } from "@/lib/utils/format";
import type { BookingEmailData, MailContent } from "../types";
import { getAppUrl } from "../config";
import { brandedEmailLayout, escapeHtml, paragraph, summaryTable } from "./layout";

const localeMap: Record<Locale, string> = {
  en: "en-US",
  hy: "hy-AM",
  ru: "ru-RU",
};

const dateOnly = (locale: Locale, value: Date) =>
  new Intl.DateTimeFormat(localeMap[locale], {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);

const nightCount = (checkIn: Date, checkOut: Date) =>
  Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000));

const labels = {
  en: {
    reference: "Booking reference",
    cottage: "Cottage",
    checkIn: "Check-in",
    checkOut: "Check-out",
    stay: "Stay",
    nights: (n: number) => `${n} night${n === 1 ? "" : "s"}`,
    guests: "Guests",
    total: "Estimated total",
    status: "Status",
    pending: "Awaiting confirmation",
    confirmed: "Confirmed",
    rejected: "Could not be confirmed",
    cancelled: "Cancelled",
    contactIntro: "If you have any questions, you can:",
    call: `Call us at ${siteConfig.contact.phoneDisplay}`,
    reply: "Reply directly to this email",
    instagram: `Message us on Instagram: ${siteConfig.social.instagramHandle}`,
    thanks: "Warm regards,\nAyGood River Lake",
  },
  hy: {
    reference: "Ամրագրման համարը",
    cottage: "Քոթեջ",
    checkIn: "Մուտք",
    checkOut: "Ելք",
    stay: "Մնալու տևողություն",
    nights: (n: number) => `${n} գիշեր`,
    guests: "Հյուրեր",
    total: "Նախնական ընդհանուր արժեք",
    status: "Կարգավիճակ",
    pending: "Սպասում է հաստատման",
    confirmed: "Հաստատված է",
    rejected: "Հնարավոր չէ հաստատել",
    cancelled: "Չեղարկված է",
    contactIntro: "Հարցերի դեպքում կարող եք՝",
    call: `Զանգահարել ${siteConfig.contact.phoneDisplay}`,
    reply: "Պատասխանել այս նամակին",
    instagram: `Գրել Instagram-ում՝ ${siteConfig.social.instagramHandle}`,
    thanks: "Հարգանքով՝\nAyGood River Lake",
  },
  ru: {
    reference: "Номер бронирования",
    cottage: "Коттедж",
    checkIn: "Заезд",
    checkOut: "Выезд",
    stay: "Проживание",
    nights: (n: number) => `${n} ноч${n === 1 ? "ь" : "и"}`,
    guests: "Гости",
    total: "Предварительная сумма",
    status: "Статус",
    pending: "Ожидает подтверждения",
    confirmed: "Подтверждено",
    rejected: "Не удалось подтвердить",
    cancelled: "Отменено",
    contactIntro: "Если у вас есть вопросы, вы можете:",
    call: `Позвонить нам: ${siteConfig.contact.phoneDisplay}`,
    reply: "Ответить на это письмо",
    instagram: `Написать в Instagram: ${siteConfig.social.instagramHandle}`,
    thanks: "С уважением,\nAyGood River Lake",
  },
} as const;

function rows(data: BookingEmailData, locale: Locale, statusLabel: string) {
  const t = labels[locale];
  const nights = nightCount(data.checkIn, data.checkOut);

  return [
    [t.reference, data.orderId],
    [t.cottage, data.houseName],
    [t.checkIn, dateOnly(locale, data.checkIn)],
    [t.checkOut, dateOnly(locale, data.checkOut)],
    [t.stay, t.nights(nights)],
    [t.guests, String(data.guestCount)],
    [t.total, formatCurrencyAmd(locale, data.totalPriceAmd)],
    [t.status, statusLabel],
  ] satisfies Array<[string, string]>;
}

function contactBlock(locale: Locale) {
  const t = labels[locale];

  return `${paragraph(t.contactIntro)}
  <ul style="margin:0 0 18px 20px;padding:0;color:#2b241e;font-size:15px;line-height:1.8;">
    <li><a href="tel:${escapeHtml(siteConfig.contact.phoneHref)}" style="color:#6f4d2f;">${escapeHtml(t.call)}</a></li>
    <li>${escapeHtml(t.reply)}</li>
    <li><a href="${escapeHtml(siteConfig.social.instagram)}" style="color:#6f4d2f;">${escapeHtml(t.instagram)}</a></li>
  </ul>`;
}

function textSummary(data: BookingEmailData, locale: Locale, statusLabel: string) {
  return rows(data, locale, statusLabel)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function customerContent({
  data,
  title,
  preheader,
  badge,
  intro,
  note,
  statusLabel,
}: {
  data: BookingEmailData;
  title: string;
  preheader: string;
  badge: { label: string; tone: "pending" | "success" | "danger" | "neutral" };
  intro: string[];
  note: string;
  statusLabel: string;
}): MailContent {
  const locale = resolveLocale(data.locale);
  const t = labels[locale];
  const appUrl = getAppUrl();
  const body = [
    ...intro.map(paragraph),
    summaryTable(rows(data, locale, statusLabel)),
    paragraph(note),
    contactBlock(locale),
    appUrl
      ? `<p style="margin:0 0 18px;"><a href="${escapeHtml(appUrl)}" style="display:inline-block;border-radius:999px;background:#f1ddc7;color:#4b3322;padding:12px 18px;text-decoration:none;font-weight:700;">${escapeHtml(siteConfig.name)}</a></p>`
      : "",
    paragraph(t.thanks),
  ].join("");

  const text = [
    title,
    "",
    ...intro,
    "",
    textSummary(data, locale, statusLabel),
    "",
    note,
    "",
    t.contactIntro,
    `- ${t.call}`,
    `- ${t.reply}`,
    `- ${t.instagram}`,
    "",
    t.thanks,
  ].join("\n");

  return {
    subject: title,
    text,
    html: brandedEmailLayout({
      title,
      preheader,
      badge,
      body,
    }),
  };
}

export function bookingRequestCustomerTemplate(data: BookingEmailData): MailContent {
  const locale = resolveLocale(data.locale);
  const t = labels[locale];
  const copy = {
    en: {
      title: `We received your AyGood booking request — ${data.houseName}`,
      preheader: `Your request ${data.orderId} has been received and is awaiting review.`,
      intro: [
        `Hi, ${data.guestName}.`,
        `We’ve received your booking request for ${data.houseName}.`,
        "Your request has been saved successfully, and our team will review the selected dates and contact you soon.",
      ],
      note: "Please note that your booking is not fully confirmed until our team checks availability and sends you a confirmation email.",
    },
    hy: {
      title: `Ստացել ենք ձեր AyGood ամրագրման հարցումը — ${data.houseName}`,
      preheader: `Ձեր ${data.orderId} հարցումը ստացվել է և սպասում է վերանայման։`,
      intro: [
        `Բարև, ${data.guestName}։`,
        `Մենք ստացել ենք ձեր ամրագրման հարցումը՝ ${data.houseName}։`,
        "Ձեր հարցումը պահպանվել է, և մեր թիմը կստուգի ընտրված օրերը ու շուտով կկապվի ձեզ հետ։",
      ],
      note: "Խնդրում ենք նկատի ունենալ, որ ամրագրումը վերջնական հաստատված չէ, մինչև մեր թիմը չստուգի հասանելիությունը և չուղարկի հաստատման նամակ։",
    },
    ru: {
      title: `Мы получили ваш запрос на бронирование AyGood — ${data.houseName}`,
      preheader: `Ваш запрос ${data.orderId} получен и ожидает проверки.`,
      intro: [
        `Здравствуйте, ${data.guestName}.`,
        `Мы получили ваш запрос на бронирование ${data.houseName}.`,
        "Ваш запрос успешно сохранен. Наша команда проверит выбранные даты и скоро свяжется с вами.",
      ],
      note: "Обратите внимание: бронирование не считается окончательно подтвержденным, пока наша команда не проверит доступность и не отправит письмо с подтверждением.",
    },
  }[locale];

  return customerContent({
    data,
    title: copy.title,
    preheader: copy.preheader,
    badge: { label: t.pending, tone: "pending" },
    intro: copy.intro,
    note: copy.note,
    statusLabel: t.pending,
  });
}

export function bookingConfirmedTemplate(data: BookingEmailData): MailContent {
  const locale = resolveLocale(data.locale);
  const t = labels[locale];
  const copy = {
    en: {
      title: `Your AyGood stay is confirmed — ${data.houseName}`,
      preheader: `Booking ${data.orderId} is confirmed.`,
      intro: [
        `Hi, ${data.guestName}.`,
        `Great news — your stay at ${data.houseName} has been confirmed.`,
        "Your booking details are listed below. Our team may contact you with arrival instructions or any final practical information.",
      ],
      note: "If you have questions before your stay, call us, reply to this email, or message us on Instagram.",
    },
    hy: {
      title: `Ձեր AyGood մնալը հաստատված է — ${data.houseName}`,
      preheader: `${data.orderId} ամրագրումը հաստատված է։`,
      intro: [
        `Բարև, ${data.guestName}։`,
        `Լավ նորություն՝ ձեր մնալը ${data.houseName}-ում հաստատված է։`,
        "Ձեր ամրագրման տվյալները ներկայացված են ստորև։ Մեր թիմը կարող է կապվել ձեզ հետ ժամանման մանրամասների համար։",
      ],
      note: "Եթե հարցեր ունեք մինչև ժամանումը, զանգահարեք մեզ, պատասխանեք այս նամակին կամ գրեք Instagram-ում։",
    },
    ru: {
      title: `Ваше проживание в AyGood подтверждено — ${data.houseName}`,
      preheader: `Бронирование ${data.orderId} подтверждено.`,
      intro: [
        `Здравствуйте, ${data.guestName}.`,
        `Хорошая новость — ваше проживание в ${data.houseName} подтверждено.`,
        "Детали бронирования указаны ниже. Наша команда может связаться с вами по поводу заезда или практической информации.",
      ],
      note: "Если у вас есть вопросы до приезда, позвоните нам, ответьте на это письмо или напишите в Instagram.",
    },
  }[locale];

  return customerContent({
    data,
    title: copy.title,
    preheader: copy.preheader,
    badge: { label: t.confirmed, tone: "success" },
    intro: copy.intro,
    note: copy.note,
    statusLabel: t.confirmed,
  });
}

export function bookingRejectedTemplate(data: BookingEmailData): MailContent {
  const locale = resolveLocale(data.locale);
  const t = labels[locale];
  const copy = {
    en: {
      title: `Update on your AyGood booking request — ${data.houseName}`,
      preheader: `Booking request ${data.orderId} could not be confirmed.`,
      intro: [
        `Hi, ${data.guestName}.`,
        `We’re sorry, but your request for ${data.houseName} could not be confirmed.`,
      ],
      note: "You can reply to this email if you’d like alternative dates or another cottage recommendation.",
    },
    hy: {
      title: `Թարմացում ձեր AyGood ամրագրման հարցման մասին — ${data.houseName}`,
      preheader: `${data.orderId} ամրագրման հարցումը հնարավոր չէ հաստատել։`,
      intro: [
        `Բարև, ${data.guestName}։`,
        `Ցավում ենք, բայց ${data.houseName}-ի ձեր հարցումը հնարավոր չէ հաստատել։`,
      ],
      note: "Կարող եք պատասխանել այս նամակին՝ այլ օրեր կամ այլ քոթեջ քննարկելու համար։",
    },
    ru: {
      title: `Обновление по вашему запросу AyGood — ${data.houseName}`,
      preheader: `Запрос ${data.orderId} не удалось подтвердить.`,
      intro: [
        `Здравствуйте, ${data.guestName}.`,
        `К сожалению, ваш запрос на ${data.houseName} не удалось подтвердить.`,
      ],
      note: "Вы можете ответить на это письмо, если хотите обсудить другие даты или другой коттедж.",
    },
  }[locale];

  return customerContent({
    data,
    title: copy.title,
    preheader: copy.preheader,
    badge: { label: t.rejected, tone: "danger" },
    intro: copy.intro,
    note: copy.note,
    statusLabel: t.rejected,
  });
}

export function bookingCancelledTemplate(data: BookingEmailData): MailContent {
  const locale = resolveLocale(data.locale);
  const t = labels[locale];
  const copy = {
    en: {
      title: `Your AyGood booking has been cancelled — ${data.houseName}`,
      preheader: `Booking ${data.orderId} has been cancelled.`,
      intro: [
        `Hi, ${data.guestName}.`,
        `Your booking for ${data.houseName} has been cancelled.`,
      ],
      note: "If this was unexpected, please reply to this email or contact AyGood River Lake.",
    },
    hy: {
      title: `Ձեր AyGood ամրագրումը չեղարկվել է — ${data.houseName}`,
      preheader: `${data.orderId} ամրագրումը չեղարկվել է։`,
      intro: [
        `Բարև, ${data.guestName}։`,
        `${data.houseName}-ի ձեր ամրագրումը չեղարկվել է։`,
      ],
      note: "Եթե սա սպասված չէր, խնդրում ենք պատասխանել այս նամակին կամ կապվել AyGood River Lake-ի հետ։",
    },
    ru: {
      title: `Ваше бронирование AyGood отменено — ${data.houseName}`,
      preheader: `Бронирование ${data.orderId} отменено.`,
      intro: [
        `Здравствуйте, ${data.guestName}.`,
        `Ваше бронирование ${data.houseName} отменено.`,
      ],
      note: "Если это неожиданно, ответьте на это письмо или свяжитесь с AyGood River Lake.",
    },
  }[locale];

  return customerContent({
    data,
    title: copy.title,
    preheader: copy.preheader,
    badge: { label: t.cancelled, tone: "neutral" },
    intro: copy.intro,
    note: copy.note,
    statusLabel: t.cancelled,
  });
}

export function adminBookingRequestTemplate(data: BookingEmailData): MailContent {
  const range = formatDateRange("en", data.checkIn, data.checkOut);
  const appUrl = getAppUrl();
  const adminUrl = appUrl ? `${appUrl}/admin/bookings/${data.bookingId}` : null;
  const title = `New booking request — ${data.houseName} — ${range}`;
  const rowsData = [
    ["Booking reference", data.orderId],
    ["Timestamp", data.createdAt ? formatDateTime("en", data.createdAt) : formatDateTime("en", new Date())],
    ["Status", BookingStatus.PENDING],
    ["Cottage", data.houseName],
    ["Guest", data.guestName],
    ["Guest email", data.guestEmail],
    ["Guest phone", data.guestPhone ?? "—"],
    ["Check-in", dateOnly("en", data.checkIn)],
    ["Check-out", dateOnly("en", data.checkOut)],
    ["Stay", `${nightCount(data.checkIn, data.checkOut)} night(s)`],
    ["Guests", String(data.guestCount)],
    ["Total", formatCurrencyAmd("en", data.totalPriceAmd)],
    ["Registered account", data.userId ? "Yes" : "No"],
  ] satisfies Array<[string, string]>;
  const body = [
    paragraph("A new booking request was submitted and saved in PostgreSQL."),
    summaryTable(rowsData),
    data.guestNotes ? paragraph(`Guest notes:\n${data.guestNotes}`) : "",
    adminUrl
      ? `<p style="margin:0 0 18px;"><a href="${escapeHtml(adminUrl)}" style="display:inline-block;border-radius:999px;background:#f1ddc7;color:#4b3322;padding:12px 18px;text-decoration:none;font-weight:700;">Open booking in admin</a></p>`
      : "",
  ].join("");

  return {
    subject: title,
    text: [
      title,
      "",
      textSummary(data, "en", BookingStatus.PENDING),
      `Timestamp: ${data.createdAt ? formatDateTime("en", data.createdAt) : formatDateTime("en", new Date())}`,
      `Guest email: ${data.guestEmail}`,
      `Guest phone: ${data.guestPhone ?? "—"}`,
      `Registered account: ${data.userId ? "Yes" : "No"}`,
      data.guestNotes ? `Guest notes: ${data.guestNotes}` : "",
      adminUrl ? `Admin link: ${adminUrl}` : "",
    ].filter(Boolean).join("\n"),
    html: brandedEmailLayout({
      title,
      preheader: `New request ${data.orderId} from ${data.guestName}.`,
      badge: { label: "New request", tone: "pending" },
      body,
    }),
  };
}
