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
  return lines.map((line) => `<p style="margin:0 0 14px;color:#334155;font-size:15px;line-height:1.7">${escapeEmailHtml(line)}</p>`).join("");
}

export function renderEmailDetailRows(details: Array<[string, string]>) {
  return details.map(([label, value]) => `
    <tr>
      <td style="padding:10px 0;color:#0d2b4e;font-size:13px;font-weight:700;vertical-align:top">${escapeEmailHtml(label)}</td>
      <td style="padding:10px 0 10px 18px;color:#334155;font-size:14px;vertical-align:top">${escapeEmailHtml(value)}</td>
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
      <div style="margin-top:24px;border:1px solid #dbe7ef;border-radius:20px;background:#f8fbfc;padding:22px">
        ${input.detailsTitle ? `<div style="margin:0 0 14px;color:#0d2b4e;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">${escapeEmailHtml(input.detailsTitle)}</div>` : ""}
        <table style="width:100%;border-collapse:collapse">${renderEmailDetailRows(input.details)}</table>
      </div>
    `
    : "";
  const footerHtml = input.footer?.length
    ? `<div style="margin-top:28px;border-top:1px solid #dbe7ef;padding-top:18px">${renderEmailParagraphs(input.footer)}</div>`
    : "";

  return `
    <div style="margin:0;background:#f4efe4;padding:28px 16px;font-family:Arial,sans-serif">
      <div style="max-width:680px;margin:0 auto;border-radius:28px;overflow:hidden;background:#fffdf7;border:1px solid #e8dcc5;box-shadow:0 18px 48px rgba(13,43,78,.12)">
        <div style="padding:28px 30px;background:linear-gradient(180deg,#f7fbfc 0%,#fffdf7 100%)">
          <img src="${escapeEmailHtml(bookingEmailLogoUrl())}" alt="IschiaMotion" width="188" style="display:block;max-width:188px;height:auto" />
          ${input.eyebrow ? `<div style="margin-top:22px;color:#0097ab;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase">${escapeEmailHtml(input.eyebrow)}</div>` : ""}
          <h1 style="margin:10px 0 0;color:#0d2b4e;font-size:30px;line-height:1.15;font-weight:700">${escapeEmailHtml(input.title)}</h1>
        </div>
        <div style="padding:30px">
          ${input.greeting ? `<p style="margin:0 0 14px;color:#0f172a;font-size:15px;line-height:1.7">${escapeEmailHtml(input.greeting)}</p>` : ""}
          ${introHtml}
          ${input.bannerHtml || ""}
          ${detailsHtml}
          ${input.calloutHtml || ""}
          ${input.ctaLabel && input.ctaUrl ? `
            <div style="margin-top:26px">
              <a href="${escapeEmailHtml(input.ctaUrl)}" style="display:inline-block;border-radius:999px;background:#0d2b4e;padding:14px 22px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">
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
