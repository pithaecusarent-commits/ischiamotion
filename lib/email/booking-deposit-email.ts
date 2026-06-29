import { deliveryMethodLabels, formatMoney, paymentMethodLabels } from "@/lib/booking-labels";
import { escapeEmailHtml, renderIschiaMotionEmail, formatBookingEmailDate } from "@/lib/email/booking-email-theme";
import { sendEmail } from "@/lib/email/resend";
import { getActivePaymentSettingsForEmail } from "@/lib/supabase/queries/admin-payment-settings";
import { getBookingNoteValue } from "@/lib/supabase/queries/bookings";
import type { BookingDeliveryMethod, BookingPaymentMethod, Locale } from "@/lib/types";

const depositFromEmail = "IschiaMotion <booking@mail.ischiamotion.com>";
const depositReplyTo = "info@ischiamotion.com";

type DepositEmailInput = {
  bookingCode: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerLanguage: Locale;
  startDate: string;
  endDate: string;
  pickupTime: string | null;
  deliveryMethod: BookingDeliveryMethod;
  deliveryLocation: string | null;
  paymentMethod: BookingPaymentMethod;
  paymentNotes: string | null;
  totalAmount: number | null;
  depositAmount: number | null;
  balanceDue: number | null;
  notes: string | null;
};

function replaceReasonTemplate(template: string | null | undefined, bookingCode: string) {
  return (template || "Acconto richiesta {bookingCode} - IschiaMotion").replaceAll("{bookingCode}", bookingCode);
}

function buildSettingsInstructionBlock(input: DepositEmailInput, locale: Locale, settings: Awaited<ReturnType<typeof getActivePaymentSettingsForEmail>>["settings"]) {
  if (!settings) return null;

  const hasBankTransfer = settings.bank_transfer_enabled ?? true;
  const hasFutureMethods = Boolean(settings.stripe_enabled || settings.paypal_enabled);
  const futureMethodsMessage = hasFutureMethods
    ? locale === "en"
      ? "Additional payment methods will be available after confirmation from the IschiaMotion staff."
      : "Ulteriori metodi di pagamento saranno disponibili su conferma dello staff IschiaMotion."
    : "";

  if (!hasBankTransfer) {
    const lines = [futureMethodsMessage].filter(Boolean);
    return lines.length > 0 ? lines.join("\n") : null;
  }

  const baseInstructions = locale === "en"
    ? settings.deposit_instructions_en?.trim() || settings.deposit_instructions_it?.trim() || ""
    : settings.deposit_instructions_it?.trim() || settings.deposit_instructions_en?.trim() || "";
  const lines = [
    baseInstructions,
    settings.bank_account_holder ? `${locale === "en" ? "Account holder" : "Intestatario"}: ${settings.bank_account_holder}` : "",
    settings.iban ? `IBAN: ${settings.iban}` : "",
    settings.bank_name ? `${locale === "en" ? "Bank" : "Banca"}: ${settings.bank_name}` : "",
    settings.bic_swift ? `BIC/SWIFT: ${settings.bic_swift}` : "",
    `${locale === "en" ? "Reason" : "Causale"}: ${replaceReasonTemplate(settings.payment_reason_template, input.bookingCode)}`,
    settings.receipt_email ? `${locale === "en" ? "Receipt email" : "Email ricevuta"}: ${settings.receipt_email}` : "",
    settings.receipt_whatsapp ? `${locale === "en" ? "Receipt WhatsApp" : "WhatsApp ricevuta"}: ${settings.receipt_whatsapp}` : "",
    futureMethodsMessage
  ].filter(Boolean);

  return lines.join("\n");
}

function buildSpecificBookingNote(input: DepositEmailInput, locale: Locale) {
  if (!input.paymentNotes?.trim()) return null;
  return locale === "en"
    ? `Booking-specific note: ${input.paymentNotes.trim()}`
    : `Nota specifica prenotazione: ${input.paymentNotes.trim()}`;
}

function buildDepositEmail(
  input: DepositEmailInput,
  paymentInstructions: string,
  bookingSpecificNote: string | null
) {
  const locale = input.customerLanguage === "en" ? "en" : "it";
  const customerName = `${input.customerFirstName} ${input.customerLastName}`.trim();
  const firstName = input.customerFirstName.trim() || customerName;
  const vehicleTitle = getBookingNoteValue(input.notes, "Vehicle") || "-";
  const deliverySummary = `${deliveryMethodLabels[locale][input.deliveryMethod]}: ${input.deliveryLocation || getBookingNoteValue(input.notes, "Pickup point") || "-"}`;
  const dates = `${formatBookingEmailDate(input.startDate, locale)} -> ${formatBookingEmailDate(input.endDate, locale)}${input.pickupTime ? `, ${input.pickupTime}` : ""}`;
  const amounts = [
    input.totalAmount !== null ? `${locale === "en" ? "Total" : "Totale"} ${formatMoney(input.totalAmount)}` : "",
    input.depositAmount !== null ? `${locale === "en" ? "Deposit" : "Acconto"} ${formatMoney(input.depositAmount)}` : "",
    input.balanceDue !== null ? `${locale === "en" ? "Balance" : "Saldo"} ${formatMoney(input.balanceDue)}` : ""
  ].filter(Boolean).join(" · ") || "-";

  if (locale === "en") {
    const subject = `Availability confirmed and deposit instructions IschiaMotion - ${input.bookingCode}`;
    const text = [
      `Hi ${firstName},`,
      "",
      "availability for your IschiaMotion request has been confirmed.",
      "To secure the booking, a deposit payment is required.",
      "",
      "Request details:",
      `- Code: ${input.bookingCode}`,
      `- Vehicle/service: ${vehicleTitle}`,
      `- Dates: ${dates}`,
      `- Pickup/delivery: ${deliverySummary}`,
      `- Payment setup: ${paymentMethodLabels.en[input.paymentMethod]}`,
      `- Amounts: ${amounts}`,
      "",
      "Payment instructions:",
      paymentInstructions,
      bookingSpecificNote || "",
      "",
      "Once the deposit has been received, we will send you the voucher with the QR code to show at pickup/delivery.",
      "",
      "Best regards,",
      "IschiaMotion"
    ].join("\n");
    const html = renderIschiaMotionEmail({
      eyebrow: "Deposit required",
      title: "Availability confirmed",
      greeting: `Hi ${firstName},`,
      intro: [
        "Availability for your IschiaMotion request has been confirmed.",
        "To secure the booking, a deposit payment is required."
      ],
      detailsTitle: "Request details",
      details: [
        ["Code", input.bookingCode],
        ["Vehicle/service", vehicleTitle],
        ["Dates", dates],
        ["Pickup/delivery", deliverySummary],
        ["Payment setup", paymentMethodLabels.en[input.paymentMethod]],
        ["Amounts", amounts]
      ],
      calloutHtml: `
        <div style="margin-top:20px;border-radius:16px;background:#eef9fb;padding:16px">
          <div style="margin:0 0 10px;color:#0097ab;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">Payment instructions</div>
          <div style="color:#334155;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeEmailHtml(paymentInstructions)}</div>
        </div>
        ${bookingSpecificNote ? `<div style="margin-top:14px;color:#334155;font-size:15px;line-height:1.6">${escapeEmailHtml(bookingSpecificNote)}</div>` : ""}
        <div style="margin-top:16px;color:#334155;font-size:15px;line-height:1.6">
          Once the deposit has been received, we will send you the voucher with the QR code to show at pickup/delivery.
        </div>
      `,
      footer: [
        "Best regards,",
        "IschiaMotion",
        "info@ischiamotion.com"
      ]
    });
    return { subject, text, html };
  }

  const subject = `Conferma disponibilita e istruzioni acconto IschiaMotion - ${input.bookingCode}`;
  const text = [
    `Ciao ${firstName},`,
    "",
    "la disponibilita per la tua richiesta IschiaMotion e stata confermata.",
    "Per bloccare definitivamente la prenotazione e richiesto il pagamento di un acconto.",
    "",
    "Dettagli richiesta:",
    `- Codice: ${input.bookingCode}`,
    `- Mezzo/servizio: ${vehicleTitle}`,
    `- Date: ${dates}`,
    `- Ritiro/consegna: ${deliverySummary}`,
    `- Metodo pagamento: ${paymentMethodLabels.it[input.paymentMethod]}`,
    `- Importi: ${amounts}`,
    "",
    "Istruzioni pagamento:",
    paymentInstructions,
    bookingSpecificNote || "",
    "",
    "Una volta ricevuto l'acconto, ti invieremo il voucher con QR code da presentare al momento del ritiro/consegna.",
    "",
    "A presto,",
    "IschiaMotion"
  ].join("\n");
  const html = renderIschiaMotionEmail({
    eyebrow: "Acconto richiesto",
    title: "Disponibilita confermata",
    greeting: `Ciao ${firstName},`,
    intro: [
      "La disponibilita per la tua richiesta IschiaMotion e stata confermata.",
      "Per bloccare definitivamente la prenotazione e richiesto il pagamento di un acconto."
    ],
    detailsTitle: "Dettagli richiesta",
    details: [
      ["Codice", input.bookingCode],
      ["Mezzo/servizio", vehicleTitle],
      ["Date", dates],
      ["Ritiro/consegna", deliverySummary],
      ["Metodo pagamento", paymentMethodLabels.it[input.paymentMethod]],
      ["Importi", amounts]
    ],
    calloutHtml: `
      <div style="margin-top:24px;border-radius:20px;background:#eef9fb;padding:22px">
        <div style="margin:0 0 10px;color:#0097ab;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">Istruzioni pagamento</div>
        <div style="color:#334155;font-size:14px;line-height:1.75;white-space:pre-wrap">${escapeEmailHtml(paymentInstructions)}</div>
      </div>
      ${bookingSpecificNote ? `<div style="margin-top:16px;color:#334155;font-size:14px;line-height:1.75">${escapeEmailHtml(bookingSpecificNote)}</div>` : ""}
      <div style="margin-top:20px;color:#334155;font-size:14px;line-height:1.75">
        Una volta ricevuto l'acconto, ti invieremo il voucher con QR code da presentare al momento del ritiro/consegna.
      </div>
    `,
    footer: [
      "A presto,",
      "IschiaMotion",
      "info@ischiamotion.com"
    ]
  });
  return { subject, text, html };
}

export async function sendBookingDepositInstructionsEmail(input: DepositEmailInput) {
  const locale = input.customerLanguage === "en" ? "en" : "it";
  const { settings, error } = await getActivePaymentSettingsForEmail();
  if (error) {
    console.warn("[booking-deposit-email] unable to load payment settings", { bookingCode: input.bookingCode, error });
  }

  const settingsInstructions = buildSettingsInstructionBlock(input, locale, settings);
  const bookingSpecificNote = settingsInstructions ? buildSpecificBookingNote(input, locale) : null;
  const paymentInstructions = settingsInstructions || input.paymentNotes?.trim() || (
    locale === "en"
      ? "We will contact you shortly with the payment details needed to secure the booking."
      : "Ti contatteremo a breve con le coordinate di pagamento necessarie per bloccare la prenotazione."
  );

  if (!settingsInstructions) {
    console.warn("[booking-deposit-email] active payment settings missing, falling back to booking payment notes", {
      bookingCode: input.bookingCode
    });
  }

  const email = buildDepositEmail(input, paymentInstructions, bookingSpecificNote);
  return sendEmail({
    to: input.customerEmail,
    from: depositFromEmail,
    replyTo: depositReplyTo,
    ...email
  });
}
