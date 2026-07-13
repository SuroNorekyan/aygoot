import { siteConfig } from "@/config/site";
import { getAppUrl } from "../config";

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function nl2br(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

export function brandedEmailLayout({
  title,
  preheader,
  badge,
  body,
}: {
  title: string;
  preheader: string;
  badge?: { label: string; tone: "pending" | "success" | "danger" | "neutral" };
  body: string;
}) {
  const appUrl = getAppUrl();
  const badgeColors = {
    pending: { background: "#F7E8D4", color: "#6B4A25" },
    success: { background: "#E5F3E8", color: "#23613A" },
    danger: { background: "#FBE2DE", color: "#8A2F23" },
    neutral: { background: "#EFE8DE", color: "#51483F" },
  } as const;
  const badgeStyle = badge ? badgeColors[badge.tone] : null;

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#ebe4d8;color:#17130f;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ebe4d8;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fffaf3;border:1px solid #ded0bd;border-radius:24px;overflow:hidden;box-shadow:0 18px 48px rgba(37,28,21,0.10);">
            <tr>
              <td style="padding:28px 28px 18px;background:#f8efe4;border-bottom:1px solid #e5d7c5;">
                <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#766657;font-weight:700;">AyGood River Lake</div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.18;color:#17130f;font-weight:600;">${escapeHtml(title)}</h1>
                ${badge && badgeStyle ? `<div style="display:inline-block;margin-top:16px;padding:8px 12px;border-radius:999px;background:${badgeStyle.background};color:${badgeStyle.color};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(badge.label)}</div>` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px;background:#f8efe4;border-top:1px solid #e5d7c5;color:#6b5d50;font-size:13px;line-height:1.6;">
                <div style="font-weight:700;color:#17130f;">AyGood River Lake</div>
                <div>${escapeHtml(siteConfig.location.label)}</div>
                ${appUrl ? `<div><a href="${escapeHtml(appUrl)}" style="color:#6f4d2f;text-decoration:underline;">${escapeHtml(appUrl)}</a></div>` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function summaryTable(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0;border:1px solid #eadccb;border-radius:18px;overflow:hidden;background:#fffdf8;">
    ${rows
      .map(
        ([label, value]) => `<tr>
          <td style="padding:12px 14px;border-bottom:1px solid #efe5d8;color:#6b5d50;font-size:13px;width:42%;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #efe5d8;color:#17130f;font-size:14px;font-weight:700;">${escapeHtml(value)}</td>
        </tr>`,
      )
      .join("")}
  </table>`;
}

export function paragraph(value: string) {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#2b241e;">${nl2br(value)}</p>`;
}
