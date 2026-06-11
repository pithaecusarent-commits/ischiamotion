"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  clearRenterSessionCookies,
  setRenterSessionCookies,
  signInRenterWithPassword
} from "@/lib/supabase/renter-auth";
import { createSupabaseAnonClient, createSupabaseServiceRoleClient } from "@/lib/supabase/admin-auth";
import { isRenterPortalEnabled, renterPortalDisabledMessage, renterRegistrationDisabledMessage } from "@/lib/renter-portal";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendNewRenterRequestEmail } from "@/lib/email/renter-emails";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ischiamotion.com";

function loginRedirect(error: string): never {
  redirect(`/renter/login?error=${encodeURIComponent(error)}`);
}

async function syncRenterProfileAfterSignup(input: {
  userId: string | null | undefined;
  email: string;
  businessName: string;
  contactName: string;
  phone: string;
  vatNumber: string;
  fiscalCode: string;
  businessAddress: string;
  businessCity: string;
  serviceCategories: string[];
  operatingZones: string[];
  seasonalityNotes: string;
  adminNotes: string;
  acceptedAt: string;
}) {
  if (!input.userId) {
    return { error: "Utente Auth non creato." };
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from("profiles").upsert({
      id: input.userId,
      email: input.email,
      role: "renter",
      account_status: "pending",
      business_name: input.businessName,
      contact_name: input.contactName,
      phone: input.phone || null,
      privacy_accepted_at: input.acceptedAt,
      terms_accepted_at: input.acceptedAt,
      force_password_change: false,
      created_by_admin: false,
      vat_number: input.vatNumber || null,
      fiscal_code: input.fiscalCode || null,
      business_address: input.businessAddress || null,
      business_city: input.businessCity || null,
      operating_zones: input.operatingZones,
      service_categories: input.serviceCategories,
      seasonality_notes: input.seasonalityNotes || null,
      seasonality_periods: [],
      admin_notes: input.adminNotes || null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "id"
    });

    return { error: error?.message || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Impossibile sincronizzare il profilo renter."
    };
  }
}

export async function signInRenter(formData: FormData) {
  if (!isRenterPortalEnabled()) {
    loginRedirect(renterPortalDisabledMessage);
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/renter");

  if (!email || !password) {
    loginRedirect("Inserisci email e password.");
  }

  const result = await signInRenterWithPassword({ email, password });

  if (result.error || !result.session) {
    const message = result.error?.toLowerCase().includes("invalid login credentials")
      ? "Credenziali non valide."
      : result.error || "Credenziali non valide.";
    loginRedirect(message);
  }

  setRenterSessionCookies(result.session.access_token, result.session.refresh_token);
  redirect(nextPath.startsWith("/renter") ? nextPath : "/renter");
}

export async function signOutRenter() {
  clearRenterSessionCookies();
  redirect("/renter/login");
}

export async function registerRenter(formData: FormData) {
  if (!isRenterPortalEnabled()) {
    redirect(`/renter/register?error=${encodeURIComponent(renterRegistrationDisabledMessage)}`);
  }

  const requestHeaders = headers();
  const clientIp = getClientIp(requestHeaders);
  const ipLimit = checkRateLimit({
    key: `renter-register:ip:${clientIp}`,
    limit: 5,
    windowMs: 60 * 60 * 1000
  });

  if (!ipLimit.allowed) {
    redirect(`/renter/register?error=${encodeURIComponent("Troppe richieste. Riprova più tardi.")}`);
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");
  const businessName = String(formData.get("business_name") || "").trim();
  const contactName = String(formData.get("contact_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const vatNumber = String(formData.get("vat_number") || "").trim();
  const fiscalCode = String(formData.get("fiscal_code") || "").trim();
  const businessAddress = String(formData.get("business_address") || "").trim();
  const businessCity = String(formData.get("business_city") || "").trim();
  const serviceCategories = formData.getAll("service_categories").map((value) => String(value).trim()).filter(Boolean);
  const operatingZones = String(formData.get("operating_zones") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const seasonalityNotes = String(formData.get("seasonality_notes") || "").trim();
  const adminNotes = String(formData.get("admin_notes") || "").trim();
  const privacyAccepted = String(formData.get("privacy_accepted") || "") === "1";

  if (!email || !password || !businessName || !contactName) {
    redirect(`/renter/register?error=${encodeURIComponent("Compila i campi obbligatori.")}`);
  }

  if (!privacyAccepted) {
    redirect(`/renter/register?error=${encodeURIComponent("Accetta l'informativa privacy per inviare la richiesta.")}`);
  }

  if (password.length < 8) {
    redirect(`/renter/register?error=${encodeURIComponent("La password deve avere almeno 8 caratteri.")}`);
  }

  if (password !== confirmPassword) {
    redirect(`/renter/register?error=${encodeURIComponent("Le password non coincidono.")}`);
  }

  const emailLimit = checkRateLimit({
    key: `renter-register:email:${email}`,
    limit: 3,
    windowMs: 24 * 60 * 60 * 1000
  });

  if (!emailLimit.allowed) {
    redirect(`/renter/register?error=${encodeURIComponent("Troppe richieste per questa email. Riprova più tardi.")}`);
  }

  const supabase = createSupabaseAnonClient();
  const acceptedAt = new Date().toISOString();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/renter/login?confirmed=1`,
      data: {
        business_name: businessName,
        contact_name: contactName,
        phone,
        vat_number: vatNumber,
        fiscal_code: fiscalCode,
        business_address: businessAddress,
        business_city: businessCity,
        service_categories: serviceCategories,
        operating_zones: operatingZones,
        seasonality_notes: seasonalityNotes,
        seasonality_periods: [],
        admin_notes: adminNotes,
        privacy_accepted_at: acceptedAt,
        terms_accepted_at: acceptedAt
      }
    }
  });

  if (error) {
    redirect(`/renter/register?error=${encodeURIComponent(`Errore registrazione: ${error.message}`)}`);
  }

  const profileSync = await syncRenterProfileAfterSignup({
    userId: data.user?.id,
    email,
    businessName,
    contactName,
    phone,
    vatNumber,
    fiscalCode,
    businessAddress,
    businessCity,
    serviceCategories,
    operatingZones,
    seasonalityNotes,
    adminNotes,
    acceptedAt
  });

  if (profileSync.error) {
    redirect(`/renter/register?error=${encodeURIComponent(`Registrazione creata, ma profilo partner non sincronizzato: ${profileSync.error}`)}`);
  }

  await sendNewRenterRequestEmail({
    profileId: data.user?.id || null,
    businessName,
    contactName,
    email,
    phone,
    businessCity,
    serviceCategories,
    operatingZones,
    seasonalityNotes
  }).catch(() => null);

  redirect(`/renter/login?registered=${encodeURIComponent("1")}`);
}
