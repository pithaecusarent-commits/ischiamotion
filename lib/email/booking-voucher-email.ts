import { bookingDeliveryLocation, bookingVehicle, formatAdminDate } from "@/app/admin/bookings/booking-ui";
import { generateQrDataUrl } from "@/lib/qr";
import { sendEmail } from "@/lib/email/resend";
import { logAdminAuditEvent } from "@/lib/supabase/queries/admin-audit-log";
import { getAdminBookingById } from "@/lib/supabase/queries/admin-bookings";
import {
  createAdminVoucher,
  getAdminVoucherByBookingId,
  markAdminVoucherSent
} from "@/lib/supabase/queries/vouchers";

type VoucherEmailContext = {
  accessToken: string;
  actorProfileId: string;
  actorEmail?: string | null;
};

export type VoucherEmailFailure =
  | "booking_not_found"
  | "missing_customer_email"
  | "provider_not_configured"
  | "invalid_site_url"
  | "voucher_failed"
  | "qr_failed"
  | "email_failed";

export type VoucherEmailResult =
  | { ok: true; voucherId: string; voucherCode: string; voucherUrl: string; providerId?: string }
  | { ok: false; reason: VoucherEmailFailure; error: string };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getVoucherSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || "https://ischiamotion.com";

  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" || !["ischiamotion.com", "www.ischiamotion.com"].includes(url.hostname)) {
      return null;
    }
    return "https://ischiamotion.com";
  } catch {
    return null;
  }
}

function formatMoney(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value);
}

function renderEmail(input: {
  customerName: string;
  bookingCode: string;
  serviceName: string;
  bookingDate: string;
  pickupPoint: string;
  totalPrice: string;
  voucherUrl: string;
}) {
  const text = [
    `Ciao ${input.customerName},`,
    "",
    "la tua prenotazione IschiaMotion è stata confermata.",
    "",
    `Codice prenotazione: ${input.bookingCode}`,
    `Servizio: ${input.serviceName}`,
    `Data: ${input.bookingDate}`,
    `Luogo di ritiro: ${input.pickupPoint}`,
    `Totale: ${input.totalPrice}`,
    "",
    "Di seguito trovi il tuo voucher con QR Code.",
    "Mostra il QR Code al momento del ritiro.",
    "",
    "Se non riesci a visualizzare il QR Code, apri il voucher da questo link:",
    input.voucherUrl,
    "",
    "Grazie,",
    "IschiaMotion"
  ].join("\n");

  const rows = [
    ["Codice prenotazione", input.bookingCode],
    ["Servizio", input.serviceName],
    ["Data", input.bookingDate],
    ["Luogo di ritiro", input.pickupPoint],
    ["Totale", input.totalPrice]
  ].map(([label, value]) => `
    <tr>
      <td style="padding:8px 12px;color:#5d625d;font-size:14px">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;color:#151512;font-size:14px;font-weight:700">${escapeHtml(value)}</td>
    </tr>`).join("");

  const html = `<!doctype html>
<html lang="it">
  <body style="margin:0;background:#f5f0e6;color:#151512;font-family:Arial,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden">Prenotazione confermata e voucher QR IschiaMotion.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f0e6;padding:24px 12px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e4e0d8;border-radius:18px;overflow:hidden">
          <tr><td style="padding:22px 28px;background:#073b4c;color:#ffffff;font-size:20px;font-weight:700">IschiaMotion</td></tr>
          <tr><td style="padding:28px">
            <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:#073b4c">La tua prenotazione è confermata</h1>
            <p style="margin:0 0 20px;line-height:1.6">Ciao ${escapeHtml(input.customerName)}, la tua prenotazione IschiaMotion è stata confermata.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#faf8f2;border-radius:12px">${rows}</table>
            <p style="margin:0 0 12px;line-height:1.6;text-align:center">Mostra questo QR Code al momento del ritiro:</p>
            <p style="margin:0 0 22px;text-align:center"><img src="cid:ischiamotion-voucher-qr" alt="QR Code voucher IschiaMotion" width="220" height="220" style="display:inline-block;width:220px;height:220px;border:0" /></p>
            <p style="margin:0 0 16px;line-height:1.6;text-align:center">Se il QR Code non è visibile, usa il link alternativo.</p>
            <p style="margin:0;text-align:center"><a href="${escapeHtml(input.voucherUrl)}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#0097ab;color:#ffffff;text-decoration:none;font-weight:700">Apri il voucher</a></p>
          </td></tr>
          <tr><td style="padding:20px 28px;background:#faf8f2;color:#5d625d;font-size:13px;line-height:1.5">Per assistenza rispondi a questa email.<br />IschiaMotion</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { text, html };
}

async function logVoucherEvent(
  context: VoucherEmailContext,
  bookingId: string,
  action: string,
  metadata: Record<string, unknown>
) {
  await logAdminAuditEvent({
    accessToken: context.accessToken,
    actorProfileId: context.actorProfileId,
    actorEmail: context.actorEmail,
    action,
    targetTable: "bookings",
    targetId: bookingId,
    metadata
  });
}

async function fail(
  context: VoucherEmailContext,
  bookingId: string,
  reason: VoucherEmailFailure,
  error: string
): Promise<VoucherEmailResult> {
  console.error("[voucher-email] email failed", { bookingId, reason, error });
  await logVoucherEvent(context, bookingId, "voucher_email_failed", { reason, error });
  return { ok: false, reason, error };
}

export async function sendBookingVoucherEmail(
  bookingId: string,
  context: VoucherEmailContext
): Promise<VoucherEmailResult> {
  console.info("[voucher-email] preparing email", { bookingId });

  const { booking, error: bookingError } = await getAdminBookingById(context.accessToken, bookingId);
  if (bookingError || !booking) {
    return fail(context, bookingId, "booking_not_found", bookingError || "Booking not found.");
  }

  if (!booking.customer_email?.trim()) {
    console.error("[voucher-email] missing customer email", { bookingId });
    return fail(context, bookingId, "missing_customer_email", "Missing customer email.");
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[voucher-email] missing email provider api key", { bookingId });
    return fail(context, bookingId, "provider_not_configured", "RESEND_API_KEY missing.");
  }

  const siteUrl = getVoucherSiteUrl();
  if (!siteUrl) {
    console.error("[voucher-email] invalid NEXT_PUBLIC_SITE_URL", { bookingId });
    return fail(context, bookingId, "invalid_site_url", "NEXT_PUBLIC_SITE_URL must use https://ischiamotion.com.");
  }

  console.info("[voucher-email] booking code found/generated", { bookingId, bookingCode: booking.booking_code });
  const existing = await getAdminVoucherByBookingId(context.accessToken, bookingId);
  const voucherResult = existing.voucher
    ? existing
    : await createAdminVoucher(context.accessToken, booking);

  if (voucherResult.error || !voucherResult.voucher) {
    return fail(context, bookingId, "voucher_failed", voucherResult.error || "Unable to create voucher.");
  }

  const voucher = voucherResult.voucher;
  console.info("[voucher-email] qr code found/generated", { bookingId, voucherId: voucher.id });

  const voucherUrl = `${siteUrl}/checkin/${encodeURIComponent(voucher.voucher_code)}`;
  console.info("[voucher-email] voucher url created", { bookingId, voucherUrl });
  const qrDataUrl = await generateQrDataUrl(voucherUrl);
  const qrBase64 = qrDataUrl?.split(",", 2)[1];

  if (!qrBase64) {
    return fail(context, bookingId, "qr_failed", "Unable to generate voucher QR Code.");
  }

  if (!existing.voucher) {
    await logVoucherEvent(context, bookingId, "voucher_qr_generated", { voucherId: voucher.id });
  }

  console.info("[voucher-email] recipient found", { bookingId });
  const customerName = booking.customer_first_name.trim() || "cliente";
  const content = renderEmail({
    customerName,
    bookingCode: booking.booking_code,
    serviceName: bookingVehicle(booking),
    bookingDate: `${formatAdminDate(booking.start_date)} - ${formatAdminDate(booking.end_date)}`,
    pickupPoint: bookingDeliveryLocation(booking),
    totalPrice: formatMoney(booking.total_amount),
    voucherUrl
  });
  const emailResult = await sendEmail({
    to: booking.customer_email.trim(),
    subject: "La tua prenotazione IschiaMotion è confermata",
    text: content.text,
    html: content.html,
    attachments: [{
      content: qrBase64,
      filename: `voucher-${booking.booking_code}.png`,
      contentId: "ischiamotion-voucher-qr",
      contentType: "image/png"
    }]
  });

  if (!emailResult.ok) {
    console.error("[voucher-email] provider rejected email", { bookingId, error: emailResult.error });
    return fail(context, bookingId, "email_failed", emailResult.error || "Email provider rejected email.");
  }

  const sentUpdate = await markAdminVoucherSent(context.accessToken, voucher.id);
  if (sentUpdate.error) {
    console.error("[voucher-email] unable to update voucher sent_at", { bookingId, error: sentUpdate.error });
  }

  await logVoucherEvent(context, bookingId, "voucher_email_sent", {
    voucherId: voucher.id,
    provider: "resend",
    providerId: emailResult.id || null
  });
  console.info("[voucher-email] email sent successfully", { bookingId, providerId: emailResult.id || null });

  return {
    ok: true,
    voucherId: voucher.id,
    voucherCode: voucher.voucher_code,
    voucherUrl,
    providerId: emailResult.id
  };
}
