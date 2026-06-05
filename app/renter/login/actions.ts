"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  clearRenterSessionCookies,
  setRenterSessionCookies,
  signInRenterWithPassword
} from "@/lib/supabase/renter-auth";
import { createSupabaseAnonClient } from "@/lib/supabase/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ischiamotion.com";

function loginRedirect(error: string): never {
  redirect(`/renter/login?error=${encodeURIComponent(error)}`);
}

export async function signInRenter(formData: FormData) {
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

  if (!email || !password || !businessName || !contactName) {
    redirect(`/renter/register?error=${encodeURIComponent("Compila i campi obbligatori.")}`);
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
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/renter/login`,
      data: {
        business_name: businessName,
        contact_name: contactName,
        phone
      }
    }
  });

  if (error) {
    redirect(`/renter/register?error=${encodeURIComponent(`Errore registrazione: ${error.message}`)}`);
  }

  redirect(`/renter/login?registered=${encodeURIComponent("1")}`);
}
