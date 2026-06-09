import { sendEmail } from "@/lib/email/resend";
import { deliveryMethodLabels, formatMoney, paymentStatusLabels, paymentTypeLabels } from "@/lib/booking-labels";
import { generateQrDataUrl, toAbsoluteCheckinUrl } from "@/lib/qr";
import { generateVoucherCode } from "@/lib/public-codes";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/admin-auth";
import { getBookingNoteValue } from "@/lib/supabase/queries/bookings";
import type { BookingDeliveryMethod, BookingPaymentStatus, BookingPaymentType, Locale } from "@/lib/types";

const voucherFromEmail = "IschiaMotion <booking@mail.ischiamotion.com>";
const voucherReplyTo = "info@ischiamotion.com";
const voucherSelect = "id, booking_id, voucher_code, qr_payload, qr_image_url, issued_at, sent_at, created_at";

type Voucher = {
  id: string;
  booking_id: string;
  voucher_code: string;
  qr_payload: string | null;
  qr_image_url: string | null;
  issued_at: string | null;
  sent_at: string | null;
  created_at: string;
};

type VoucherBooking = {
  id: string;
  booking_code: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_language: Locale;
  start_date: string;
  end_date: string;
  pickup_time: string | null;
  status: string;
  delivery_method: BookingDeliveryMethod;
  delivery_location: string | null;
  payment_type: BookingPaymentType;
  payment_status: BookingPaymentStatus;
  total_amount: number | null;
  deposit_amount: number | null;
  balance_due: number | null;
  notes: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function qrBase64(dataUrl: string) {
  const match = dataUrl.match(/^data:image\/png;base64,(.+)$/);
  return match?.[1] || null;
}

async function getOrCreateVoucher(bookingId: string) {
  const supabase = createSupabaseServiceRoleClient();
  const existing = await supabase.from("booking_vouchers").select(voucherSelect).eq("booking_id", bookingId).maybeSingle<Voucher>();
  if (existing.error) return { voucher: null, error: existing.error.message };
  if (existing.data) return { voucher: existing.data, error: null };

  const voucherCode = generateVoucherCode();
  const created = await supabase
    .from("booking_vouchers")
    .insert({
      booking_id: bookingId,
      voucher_code: voucherCode,
      qr_payload: `/checkin/${encodeURIComponent(voucherCode)}`,
      issued_at: new Date().toISOString()
    })
    .select(voucherSelect)
    .single<Voucher>();

  if (!created.error) return { voucher: created.data, error: null };

  // A concurrent confirmation may have created the unique booking voucher first.
  const retry = await supabase.from("booking_vouchers").select(voucherSelect).eq("booking_id", bookingId).maybeSingle<Voucher>();
  return retry.data
    ? { voucher: retry.data, error: null }
    : { voucher: null, error: created.error.message };
}

async function getOrCreateQr(voucher: Voucher) {
  if (voucher.qr_image_url) return { qrDataUrl: voucher.qr_image_url, error: null };

  const qrDataUrl = await generateQrDataUrl(voucher.qr_payload || `/checkin/${encodeURIComponent(voucher.voucher_code)}`);
  if (!qrDataUrl) return { qrDataUrl: null, error: "Unable to generate voucher QR code." };

  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("booking_vouchers").update({ qr_image_url: qrDataUrl }).eq("id", voucher.id);
  return error ? { qrDataUrl: null, error: error.message } : { qrDataUrl, error: null };
}

function buildEmail(booking: VoucherBooking, voucher: Voucher, voucherUrl: string, qrImageSource: string) {
  const locale = booking.customer_language === "en" ? "en" : "it";
  const name = `${booking.customer_first_name} ${booking.customer_last_name}`.trim();
  const vehicle = getBookingNoteValue(booking.notes, "Vehicle") || "-";
  const pickupPoint = booking.delivery_location || getBookingNoteValue(booking.notes, "Pickup point") || "-";
  const dates = `${formatDate(booking.start_date, locale)} - ${formatDate(booking.end_date, locale)}${booking.pickup_time ? `, ${booking.pickup_time}` : ""}`;
  const amounts = [
    booking.total_amount !== null ? `${locale === "en" ? "Total" : "Totale"} ${formatMoney(booking.total_amount)}` : "",
    booking.deposit_amount !== null ? `${locale === "en" ? "Deposit" : "Acconto"} ${formatMoney(booking.deposit_amount)}` : "",
    booking.balance_due !== null ? `${locale === "en" ? "Balance" : "Saldo"} ${formatMoney(booking.balance_due)}` : ""
  ].filter(Boolean).join(" · ") || "-";

  const labels = locale === "en"
    ? {
      subject: `Booking confirmed ${booking.booking_code} - IschiaMotion voucher`,
      greeting: `Hi ${name},`,
      intro: "your booking is confirmed. Show this QR voucher at pickup or delivery.",
      booking: "Booking code",
      voucher: "Voucher code",
      vehicle: "Vehicle",
      dates: "Dates",
      delivery: "Pickup / delivery",
      payment: "Payment",
      amounts: "Amounts",
      link: "Open voucher / check-in page",
      fallback: "If the QR code is not visible, use this link:"
    }
    : {
      subject: `Prenotazione confermata ${booking.booking_code} - voucher IschiaMotion`,
      greeting: `Ciao ${name},`,
      intro: "la tua prenotazione è confermata. Mostra questo voucher QR al ritiro o alla consegna.",
      booking: "Codice prenotazione",
      voucher: "Codice voucher",
      vehicle: "Veicolo",
      dates: "Date",
      delivery: "Ritiro / consegna",
      payment: "Pagamento",
      amounts: "Importi",
      link: "Apri pagina voucher / check-in",
      fallback: "Se il QR Code non è visibile, usa questo link:"
    };

  const details = [
    [labels.booking, booking.booking_code],
    [labels.voucher, voucher.voucher_code],
    [labels.vehicle, vehicle],
    [labels.dates, dates],
    [labels.delivery, `${deliveryMethodLabels[locale][booking.delivery_method]}: ${pickupPoint}`],
    [labels.payment, `${paymentTypeLabels[locale][booking.payment_type]} · ${paymentStatusLabels[locale][booking.payment_status]}`],
    [labels.amounts, amounts]
  ];
  const text = [
    labels.greeting, "", labels.intro, "",
    ...details.map(([label, value]) => `${label}: ${value}`),
    "", `${labels.fallback} ${voucherUrl}`
  ].join("\n");
  const rows = details.map(([label, value]) => `
    <tr><td style="padding:8px 12px;color:#557065;font-weight:bold">${escapeHtml(label)}</td><td style="padding:8px 12px">${escapeHtml(value)}</td></tr>`).join("");
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#151512;max-width:640px;margin:auto">
      <h1 style="color:#174b3b">IschiaMotion</h1>
      <p>${escapeHtml(labels.greeting)}</p><p>${escapeHtml(labels.intro)}</p>
      <div style="text-align:center;margin:28px 0"><img src="${escapeHtml(qrImageSource)}" width="260" height="260" alt="QR voucher ${escapeHtml(voucher.voucher_code)}" style="display:inline-block;max-width:100%;height:auto"></div>
      <table style="width:100%;border-collapse:collapse;background:#f7f3e8">${rows}</table>
      <p style="margin-top:24px"><a href="${escapeHtml(voucherUrl)}" style="display:inline-block;background:#174b3b;color:#fff;padding:12px 18px;border-radius:24px;text-decoration:none;font-weight:bold">${escapeHtml(labels.link)}</a></p>
      <p style="font-size:13px;color:#557065">${escapeHtml(labels.fallback)}<br><a href="${escapeHtml(voucherUrl)}">${escapeHtml(voucherUrl)}</a></p>
    </div>`;

  return { subject: labels.subject, text, html };
}

export async function sendBookingVoucherEmail(bookingId: string): Promise<{ ok: boolean; error: string | null; voucherCode?: string }> {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const bookingResult = await supabase
      .from("bookings")
      .select("id, booking_code, customer_first_name, customer_last_name, customer_email, customer_language, start_date, end_date, pickup_time, status, delivery_method, delivery_location, payment_type, payment_status, total_amount, deposit_amount, balance_due, notes")
      .eq("id", bookingId)
      .maybeSingle<VoucherBooking>();

    if (bookingResult.error || !bookingResult.data) {
      return { ok: false, error: bookingResult.error?.message || "Booking not found." };
    }
    if (!["confirmed", "voucher_sent"].includes(bookingResult.data.status)) {
      return { ok: false, error: "Booking must be confirmed before sending its voucher." };
    }

    const voucherResult = await getOrCreateVoucher(bookingId);
    if (!voucherResult.voucher) return { ok: false, error: voucherResult.error || "Unable to create voucher." };

    const qrResult = await getOrCreateQr(voucherResult.voucher);
    if (!qrResult.qrDataUrl) return { ok: false, error: qrResult.error || "Unable to create voucher QR code." };
    const content = qrBase64(qrResult.qrDataUrl);
    const qrImageSource = content ? "cid:voucher-qr" : /^https?:\/\//i.test(qrResult.qrDataUrl) ? qrResult.qrDataUrl : null;
    if (!qrImageSource) return { ok: false, error: "Invalid voucher QR code." };

    const voucherUrl = toAbsoluteCheckinUrl(`/checkin/${encodeURIComponent(voucherResult.voucher.voucher_code)}`);
    const email = buildEmail(bookingResult.data, voucherResult.voucher, voucherUrl, qrImageSource);
    const sent = await sendEmail({
      to: bookingResult.data.customer_email,
      from: voucherFromEmail,
      replyTo: voucherReplyTo,
      ...email,
      attachments: content
        ? [{ content, filename: `voucher-${voucherResult.voucher.voucher_code}.png`, contentType: "image/png", contentId: "voucher-qr" }]
        : undefined
    });
    if (!sent.ok) return { ok: false, error: sent.error || "Unable to send voucher email.", voucherCode: voucherResult.voucher.voucher_code };

    const sentAt = new Date().toISOString();
    const voucherUpdate = await supabase.from("booking_vouchers").update({ sent_at: sentAt }).eq("id", voucherResult.voucher.id);
    if (voucherUpdate.error) return { ok: false, error: voucherUpdate.error.message, voucherCode: voucherResult.voucher.voucher_code };

    const bookingUpdate = await supabase.from("bookings").update({ status: "voucher_sent", updated_at: sentAt }).eq("id", bookingId);
    if (bookingUpdate.error) return { ok: false, error: bookingUpdate.error.message, voucherCode: voucherResult.voucher.voucher_code };

    return { ok: true, error: null, voucherCode: voucherResult.voucher.voucher_code };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unable to send voucher email." };
  }
}
