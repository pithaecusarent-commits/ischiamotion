"use server";

import { redirect } from "next/navigation";
import {
  clearRenterSessionCookies,
  setRenterSessionCookies,
  signInRenterWithPassword
} from "@/lib/supabase/renter-auth";
import { createSupabaseAnonClient } from "@/lib/supabase/admin-auth";

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

  const supabase = createSupabaseAnonClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
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
