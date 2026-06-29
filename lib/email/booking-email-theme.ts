import type { Locale } from "@/lib/types";

const defaultSiteUrl = "https://www.ischiamotion.com";

export function bookingEmailSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/$/, "");
}

export function bookingEmailLogoUrl() {
  return `${bookingEmailSiteUrl()}/images/ischiamotion-logo.png`;
}

export function escapeEmailHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatBookingEmailDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

export function renderEmailParagraphs(lines: string[]) {
  return lines.map((line) => `<p style="margin:0 0 14px;color:#334155;font-size:16px;line-height:1.6">${escapeEmailHtml(line)}</p>`).join("");
}

export function renderEmailDetailRows(details: Array<[string, string]>) {
  return details.map(([label, value]) => `
    <tr>
      <td style="padding:0 0 12px">
        <div style="color:#0d2b4e;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin:0 0 2px">${escapeEmailHtml(label)}</div>
        <div style="color:#334155;font-size:16px;line-height:1.4">${escapeEmailHtml(value)}</div>
      </td>
    </tr>
  `).join("");
}

export function renderIschiaMotionEmail(input: {
  eyebrow?: string;
  title: string;
  greeting?: string;
  intro?: string[];
  detailsTitle?: string;
  details?: Array<[string, string]>;
  bannerHtml?: string;
  calloutHtml?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footer?: string[];
}) {
  const introHtml = input.intro?.length ? renderEmailParagraphs(input.intro) : "";
  const detailsHtml = input.details?.length
    ? `
      <div style="margin-top:20px;border:1px solid #dbe7ef;border-radius:12px;background:#f8fbfc;padding:16px 16px 4px">
        ${input.detailsTitle ? `<div style="margin:0 0 12px;color:#0d2b4e;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">${escapeEmailHtml(input.detailsTitle)}</div>` : ""}
        <table style="width:100%;border-collapse:collapse">${renderEmailDetailRows(input.details)}</table>
      </div>
    `
    : "";
  const footerHtml = input.footer?.length
    ? `<div style="margin-top:24px;border-top:1px solid #dbe7ef;padding-top:16px">${renderEmailParagraphs(input.footer)}</div>`
    : "";

  return `
    <div style="margin:0;background:#f4efe4;padding:16px 0;font-family:Arial,sans-serif">
      <div style="max-width:560px;margin:0 auto;border-radius:16px;overflow:hidden;background:#fffdf7;border:1px solid #e8dcc5">
        <div style="padding:20px 20px 16px;background:linear-gradient(180deg,#f7fbfc 0%,#fffdf7 100%)">
          <img src="${escapeEmailHtml(bookingEmailLogoUrl())}" alt="IschiaMotion" width="140" style="display:block;max-width:140px;height:auto" />
          ${input.eyebrow ? `<div style="margin-top:14px;color:#0097ab;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">${escapeEmailHtml(input.eyebrow)}</div>` : ""}
          <h1 style="margin:6px 0 0;color:#0d2b4e;font-size:22px;line-height:1.3;font-weight:700">${escapeEmailHtml(input.title)}</h1>
        </div>
        <div style="padding:16px 20px 20px">
          ${input.greeting ? `<p style="margin:0 0 14px;color:#0f172a;font-size:16px;line-height:1.6">${escapeEmailHtml(input.greeting)}</p>` : ""}
          ${introHtml}
          ${input.bannerHtml || ""}
          ${detailsHtml}
          ${input.calloutHtml || ""}
          ${input.ctaLabel && input.ctaUrl ? `
            <div style="margin-top:24px;text-align:center">
              <a href="${escapeEmailHtml(input.ctaUrl)}" style="display:inline-block;border-radius:999px;background:#0d2b4e;padding:16px 32px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;min-height:44px;line-height:1.2">
                ${escapeEmailHtml(input.ctaLabel)}
              </a>
            </div>
          ` : ""}
          ${footerHtml}
        </div>
      </div>
    </div>
  `;
}
