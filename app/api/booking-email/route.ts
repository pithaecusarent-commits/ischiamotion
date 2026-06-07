import { NextResponse } from "next/server";
import { deliveryMethodLabels, paymentMethodLabels, paymentTypeLabels } from "@/lib/booking-labels";
import { verifyInternalSignature } from "@/lib/internal-signature";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { BookingDeliveryMethod, BookingPaymentMethod, BookingPaymentType, Locale } from "@/lib/types";

type BookingEmailPayload = {
  bookingId?: string | null;
  bookingCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  language: Locale;
  startDate: string;
  endDate: string;
  pickupTime?: string | null;
  deliveryMethod: BookingDeliveryMethod;
  deliveryLocation?: string | null;
  deliveryNotes?: string | null;
  paymentType: BookingPaymentType;
  paymentMethod: BookingPaymentMethod;
  paymentNotes?: string | null;
  notes?: string | null;
  vehicleLabel: string;
  pickupPointLabel: string;
};

const resendEndpoint = "https://api.resend.com/emails";
const defaultAdminEmail = "info@ischiamotion.com";
const defaultFromEmail = "IschiaMotion <noreply@mail.ischiamotion.com>";
const defaultSiteUrl = "https://www.ischiamotion.com";

class Resend {
  constructor(private readonly apiKey: string) {}

  emails = {
    send: async (input: { from: string; to: string; subject: string; html: string; text?: string }) => {
      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const body = await response.json().catch(async () => {
        const text = await response.text().catch(() => "");
        return text ? { message: text } : null;
      });

      if (!response.ok) {
        const message = typeof body === "object" && body && "message" in body
          ? String(body.message)
          : `Resend error ${response.status}`;
        return { data: null, error: { message } };
      }

      return { data: body as { id?: string } | null, error: null };
    }
  };
}

function textLine(label: string, value: string | null | undefined) {
  return `${label}: ${value?.trim() || "-"}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toHtml(text: string) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#151512;white-space:pre-wrap">${escapeHtml(text)}</div>`;
}

function deliverySummary(payload: BookingEmailPayload, locale: Locale) {
  const method = deliveryMethodLabels[locale][payload.deliveryMethod];
  const place = payload.deliveryLocation || payload.pickupPointLabel;
  return [method, place].filter(Boolean).join(" - ");
}

function adminEmailText(payload: BookingEmailPayload, adminUrl: string) {
  const name = `${payload.firstName} ${payload.lastName}`.trim();

  return [
    "Nuova richiesta IschiaMotion",
    "",
    "Richiesta ricevuta dal sito. La disponibilità deve essere verificata tramite partner locali selezionati prima di confermare al cliente.",
    "",
    textLine("Codice booking", payload.bookingCode),
    textLine("Cliente", name),
    textLine("Email cliente", payload.email),
    textLine("Telefono cliente", payload.phone),
    textLine("Lingua di contatto", payload.language),
    textLine("Veicolo/tipologia pubblica", payload.vehicleLabel),
    textLine("Date", `${payload.startDate} -> ${payload.endDate}`),
    textLine("Orario", payload.pickupTime),
    textLine("Modalità ritiro/consegna", deliveryMethodLabels.it[payload.deliveryMethod]),
    textLine("Luogo consegna/ritiro", payload.deliveryLocation || payload.pickupPointLabel),
    textLine("Note consegna", payload.deliveryNotes),
    textLine("Pagamento preferito", `${paymentTypeLabels.it[payload.paymentType]} - ${paymentMethodLabels.it[payload.paymentMethod]}`),
    textLine("Prezzo visto / note pagamento", payload.paymentNotes),
    textLine("Note cliente", payload.notes),
    textLine("Link admin booking", adminUrl)
  ].join("\n");
}

function customerEmailText(payload: BookingEmailPayload) {
  const isIt = payload.language === "it";
  const name = payload.firstName.trim() || (isIt ? "ciao" : "there");
  const summary = deliverySummary(payload, payload.language);

  if (isIt) {
    return [
      `Ciao ${name},`,
      "",
      "grazie per aver scelto IschiaMotion.",
      "Abbiamo ricevuto la tua richiesta per un noleggio a Ischia e la stiamo verificando con operatori locali selezionati.",
      "",
      "Dettagli richiesta:",
      `- Codice richiesta: ${payload.bookingCode}`,
      `- Mezzo: ${payload.vehicleLabel}`,
      `- Date: ${payload.startDate} → ${payload.endDate}`,
      `- Ritiro/consegna: ${summary}`,
      "",
      "Importante:",
      "La disponibilità non è ancora confermata. Ti ricontatteremo appena avremo verificato opzioni, condizioni e punto di ritiro.",
      "",
      "A presto,",
      "IschiaMotion"
    ].join("\n");
  }

  return [
    `Hello ${name},`,
    "",
    "thank you for choosing IschiaMotion.",
    "We have received your rental request in Ischia and are reviewing it with selected local operators.",
    "",
    "Request details:",
    `- Request code: ${payload.bookingCode}`,
    `- Vehicle: ${payload.vehicleLabel}`,
    `- Dates: ${payload.startDate} → ${payload.endDate}`,
    `- Pickup/delivery: ${summary}`,
    "",
    "Important:",
    "Availability is not confirmed yet. We will contact you once options, conditions and pickup details have been reviewed.",
    "",
    "See you soon,",
    "IschiaMotion"
  ].join("\n");
}

async function sendResendEmail(input: {
  resend: Resend;
  from: string;
  to: string;
  subject: string;
  text: string;
}) {
  return input.resend.emails.send({
    from: input.from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: toHtml(input.text)
  });
}

function isValidPayload(payload: Partial<BookingEmailPayload>): payload is BookingEmailPayload {
  return Boolean(
    payload.bookingCode &&
    payload.firstName &&
    payload.lastName &&
    payload.email &&
    payload.language &&
    payload.startDate &&
    payload.endDate &&
    payload.deliveryMethod &&
    payload.paymentType &&
    payload.paymentMethod &&
    payload.vehicleLabel &&
    payload.pickupPointLabel
  );
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyInternalSignature(request.headers, rawBody)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const rateLimit = checkRateLimit({
    key: `booking-email:${getClientIp(request.headers)}`,
    limit: 20,
    windowMs: 60 * 1000
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  let payload: Partial<BookingEmailPayload> | null = null;

  try {
    payload = JSON.parse(rawBody || "null") as Partial<BookingEmailPayload> | null;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (!payload || !isValidPayload(payload)) {
    return NextResponse.json({ ok: false, error: "Invalid booking email payload." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL || defaultAdminEmail;
  const fromEmail = process.env.BOOKING_FROM_EMAIL || defaultFromEmail;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/$/, "");
  const adminUrl = payload.bookingId ? `${siteUrl}/admin/bookings/${encodeURIComponent(payload.bookingId)}` : `${siteUrl}/admin/bookings`;

  console.info("[booking-email] route called", {
    bookingCode: payload.bookingCode,
    resendApiKeyPresent: Boolean(apiKey),
    fromEmail,
    adminEmail,
    customerEmailPresent: Boolean(payload.email)
  });

  if (!apiKey) {
    console.warn(`[booking-email] RESEND_API_KEY missing. Skipping email for ${payload.bookingCode}.`);
    return NextResponse.json({
      ok: false,
      adminEmailSent: false,
      customerEmailSent: false,
      error: "RESEND_API_KEY missing."
    });
  }

  const resend = new Resend(apiKey);
  const adminResult = await sendResendEmail({
    resend,
    from: fromEmail,
    to: adminEmail,
    subject: `Nuova richiesta IschiaMotion — ${payload.bookingCode}`,
    text: adminEmailText(payload, adminUrl)
  }).catch((error) => ({ data: null, error: { message: error instanceof Error ? error.message : "Admin email failed." } }));
  const adminEmailSent = !adminResult.error;

  if (adminEmailSent) {
    console.info("[booking-email] admin email sent", { bookingCode: payload.bookingCode, id: adminResult.data?.id || null });
  } else {
    console.error("[booking-email] admin email error", { bookingCode: payload.bookingCode, error: adminResult.error.message });
  }

  const customerResult = await sendResendEmail({
    resend,
    from: fromEmail,
    to: payload.email,
    subject: payload.language === "it" ? "Richiesta ricevuta — IschiaMotion" : "Request received — IschiaMotion",
    text: customerEmailText(payload)
  }).catch((error) => ({ data: null, error: { message: error instanceof Error ? error.message : "Customer email failed." } }));
  const customerEmailSent = !customerResult.error;

  if (customerEmailSent) {
    console.info("[booking-email] customer email sent", { bookingCode: payload.bookingCode, id: customerResult.data?.id || null });
  } else {
    console.error("[booking-email] customer email error", { bookingCode: payload.bookingCode, error: customerResult.error.message });
  }

  const ok = adminEmailSent && customerEmailSent;

  return NextResponse.json({
    ok,
    adminEmailSent,
    customerEmailSent,
    error: ok
      ? undefined
      : [adminResult.error?.message, customerResult.error?.message].filter(Boolean).join(" | ")
  });
}
