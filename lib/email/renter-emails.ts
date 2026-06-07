import { sendEmail } from "@/lib/email/resend";

const defaultAdminEmail = "info@ischiamotion.com";
const defaultSiteUrl = "https://www.ischiamotion.com";

type RenterEmailInput = {
  profileId?: string | null;
  businessName: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  businessCity?: string | null;
  serviceCategories?: string[];
  operatingZones?: string[];
  seasonalityNotes?: string | null;
  reason?: string | null;
  setupUrl?: string | null;
};

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/$/, "");
}

function line(label: string, value: string | null | undefined) {
  return `${label}: ${value?.trim() || "-"}`;
}

function adminRenterUrl(profileId?: string | null) {
  return profileId ? `${siteUrl()}/admin/renters/${encodeURIComponent(profileId)}` : `${siteUrl()}/admin/renters`;
}

export async function sendNewRenterRequestEmail(input: RenterEmailInput) {
  const adminEmail = process.env.RENTER_ADMIN_EMAIL || process.env.BOOKING_ADMIN_EMAIL || defaultAdminEmail;

  return sendEmail({
    to: adminEmail,
    subject: "Nuova richiesta partner su IschiaMotion",
    text: [
      "Nuova richiesta partner IschiaMotion",
      "",
      line("Attivita", input.businessName),
      line("Referente", input.contactName),
      line("Email", input.email),
      line("Telefono", input.phone),
      line("Comune/zona", input.businessCity),
      line("Categorie offerte", input.serviceCategories?.join(", ")),
      line("Zone operative", input.operatingZones?.join(", ")),
      line("Stagionalità", input.seasonalityNotes),
      line("Link admin", adminRenterUrl(input.profileId))
    ].join("\n")
  });
}

export async function sendRenterApprovedEmail(input: RenterEmailInput) {
  if (!input.email) return { ok: false, error: "Renter email missing." };

  return sendEmail({
    to: input.email,
    subject: "La tua area partner IschiaMotion è stata attivata",
    text: [
      `Ciao ${input.contactName || input.businessName},`,
      "",
      "la tua area partner IschiaMotion è stata attivata.",
      "Puoi accedere dalla pagina login partner e gestire prenotazioni, disponibilità e check-in.",
      "",
      `${siteUrl()}/renter/login`,
      "",
      "A presto,",
      "IschiaMotion"
    ].join("\n")
  });
}

export async function sendRenterRejectedEmail(input: RenterEmailInput) {
  if (!input.email) return { ok: false, error: "Renter email missing." };

  return sendEmail({
    to: input.email,
    subject: "Aggiornamento sulla tua richiesta partner IschiaMotion",
    text: [
      `Ciao ${input.contactName || input.businessName},`,
      "",
      "abbiamo esaminato la tua richiesta partner per IschiaMotion.",
      "In questa fase non possiamo attivare l'accesso alla mini-area partner.",
      input.reason ? `\nMotivo: ${input.reason}` : "",
      "",
      "Per chiarimenti puoi rispondere a questa email.",
      "",
      "IschiaMotion"
    ].filter(Boolean).join("\n")
  });
}

export async function sendAdminManagedRenterCreatedEmail(input: RenterEmailInput) {
  if (!input.email) return { ok: false, error: "Renter email missing." };

  return sendEmail({
    to: input.email,
    subject: "Conferma anagrafica partner IschiaMotion",
    text: [
      `Ciao ${input.contactName || input.businessName},`,
      "",
      "IschiaMotion ha registrato la tua anagrafica partner.",
      "Le disponibilità, i listini e le prenotazioni saranno gestiti direttamente dallo staff IschiaMotion.",
      "Non devi creare una password o accedere alla mini-area partner.",
      "",
      "Per modifiche o aggiornamenti puoi rispondere a questa email.",
      "",
      "IschiaMotion"
    ].join("\n")
  });
}

export async function sendRenterSetupEmail(input: RenterEmailInput) {
  if (!input.email) return { ok: false, error: "Renter email missing." };

  return sendEmail({
    to: input.email,
    subject: "Accesso temporaneo alla tua area partner IschiaMotion",
    text: [
      `Ciao ${input.contactName || input.businessName},`,
      "",
      "IschiaMotion ha creato il tuo accesso partner.",
      "Apri il link qui sotto e imposta la tua password prima di entrare nella dashboard.",
      "",
      input.setupUrl || `${siteUrl()}/auth/forgot-password`,
      "",
      "Se il link scade, contatta IschiaMotion per riceverne uno nuovo.",
      "",
      "IschiaMotion"
    ].join("\n")
  });
}
