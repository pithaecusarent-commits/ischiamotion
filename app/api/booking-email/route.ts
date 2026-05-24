import { NextResponse } from "next/server";
import { deliveryMethodLabels, paymentMethodLabels, paymentTypeLabels } from "@/lib/booking-labels";
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
const defaultFromEmail = "IschiaMotion <info@ischiamotion.com>";
const defaultSiteUrl = "https://ischiamotion.com";

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
    textLine("Lingua cliente", payload.language),
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
      "abbiamo ricevuto la tua richiesta per un noleggio a Ischia.",
      "Verificheremo la disponibilità tramite i nostri partner locali selezionati e ti contatteremo per la conferma.",
      "",
      "Dettagli richiesta:",
      `- Codice richiesta: ${payload.bookingCode}`,
      `- Mezzo: ${payload.vehicleLabel}`,
      `- Date: ${payload.startDate} → ${payload.endDate}`,
      `- Ritiro/consegna: ${summary}`,
      "",
      "Importante:",
      "La disponibilità non è ancora confermata. Riceverai un aggiornamento appena completata la verifica.",
      "",
      "IschiaMotion"
    ].join("\n");
  }

  return [
    `Hello ${name},`,
    "",
    "we have received your rental request in Ischia.",
    "We will check availability through selected local rental partners and contact you with confirmation.",
    "",
    "Request details:",
    `- Request code: ${payload.bookingCode}`,
    `- Vehicle: ${payload.vehicleLabel}`,
    `- Dates: ${payload.startDate} → ${payload.endDate}`,
    `- Pickup/delivery: ${summary}`,
    "",
    "Important:",
    "Availability is not confirmed yet. You will receive an update after verification.",
    "",
    "IschiaMotion"
  ].join("\n");
}

async function sendResendEmail(input: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}) {
  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: toHtml(input.text)
    })
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend error ${response.status}: ${body}`);
  }
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
  const payload = await request.json().catch(() => null) as Partial<BookingEmailPayload> | null;

  if (!payload || !isValidPayload(payload)) {
    return NextResponse.json({ ok: false, error: "Invalid booking email payload." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL || defaultAdminEmail;
  const fromEmail = process.env.BOOKING_FROM_EMAIL || defaultFromEmail;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/$/, "");
  const adminUrl = payload.bookingId ? `${siteUrl}/admin/bookings/${encodeURIComponent(payload.bookingId)}` : `${siteUrl}/admin/bookings`;

  if (!apiKey) {
    console.warn(`[booking-email] RESEND_API_KEY missing. Skipping email for ${payload.bookingCode}.`);
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await Promise.all([
      sendResendEmail({
        apiKey,
        from: fromEmail,
        to: adminEmail,
        subject: `Nuova richiesta IschiaMotion — ${payload.bookingCode}`,
        text: adminEmailText(payload, adminUrl)
      }),
      sendResendEmail({
        apiKey,
        from: fromEmail,
        to: payload.email,
        subject: payload.language === "it" ? "Richiesta ricevuta — IschiaMotion" : "Request received — IschiaMotion",
        text: customerEmailText(payload)
      })
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`[booking-email] Unable to send email for ${payload.bookingCode}.`, error);
    return NextResponse.json({ ok: true, emailError: true });
  }
}
