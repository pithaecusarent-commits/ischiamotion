"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  clearAdminSessionCookies,
  createSupabaseAnonClient,
  createSupabaseUserClient,
  setAdminSessionCookies
} from "@/lib/supabase/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const tooManyAttemptsMessage = "Troppi tentativi. Riprova tra qualche minuto.";

function loginRedirect(error: string): never {
  redirect(`/admin/login?error=${encodeURIComponent(error)}`);
}

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/admin");
  const clientIp = getClientIp(headers());

  const ipLimit = checkRateLimit({
    key: `admin-login:ip:${clientIp}`,
    limit: 5,
    windowMs: 10 * 60 * 1000
  });

  if (!ipLimit.allowed) {
    loginRedirect(tooManyAttemptsMessage);
  }

  if (email) {
    const emailLimit = checkRateLimit({
      key: `admin-login:email:${email}`,
      limit: 5,
      windowMs: 10 * 60 * 1000
    });

    if (!emailLimit.allowed) {
      loginRedirect(tooManyAttemptsMessage);
    }
  }

  if (!email || !password) {
    loginRedirect("Inserisci email e password.");
  }

  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.warn("[admin-login] sign-in failed", { email, error: error.message });
    loginRedirect("Credenziali non valide.");
  }

  if (!data.session || !data.user) {
    loginRedirect("Credenziali non valide.");
  }

  const session = data.session;
  const user = data.user;
  const userClient = createSupabaseUserClient(session.access_token);
  const { data: profile, error: profileError } = await userClient
    .from("profiles")
    .select("role, account_status")
    .eq("id", user.id)
    .maybeSingle<{ role: "admin" | "renter"; account_status: "pending" | "approved" | "rejected" | "disabled" }>();

  if (profileError || profile?.role !== "admin" || profile.account_status !== "approved") {
    if (profileError) {
      console.warn("[admin-login] profile lookup failed", { email, error: profileError.message });
    }
    loginRedirect("Accesso admin non autorizzato.");
  }

  setAdminSessionCookies(session.access_token, session.refresh_token);
  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

export async function signOutAdmin() {
  clearAdminSessionCookies();
  redirect("/admin/login");
}
