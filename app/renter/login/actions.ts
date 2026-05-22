"use server";

import { redirect } from "next/navigation";
import {
  clearRenterSessionCookies,
  setRenterSessionCookies,
  signInRenterWithPassword
} from "@/lib/supabase/renter-auth";

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
