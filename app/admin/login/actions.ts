"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSessionCookies,
  createSupabaseAnonClient,
  createSupabaseUserClient,
  setAdminSessionCookies
} from "@/lib/supabase/admin-auth";

function loginRedirect(error: string): never {
  redirect(`/admin/login?error=${encodeURIComponent(error)}`);
}

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/admin");

  if (!email || !password) {
    loginRedirect("Inserisci email e password.");
  }

  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message = error.message.toLowerCase().includes("invalid login credentials")
      ? "Credenziali non valide."
      : `Errore Supabase Auth: ${error.message}`;
    loginRedirect(message);
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
    .maybeSingle<{ role: "admin" | "renter"; account_status: "pending" | "approved" | "rejected" }>();

  if (profileError || profile?.role !== "admin" || profile.account_status !== "approved") {
    loginRedirect("Accesso admin non autorizzato.");
  }

  setAdminSessionCookies(session.access_token, session.refresh_token);
  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

export async function signOutAdmin() {
  clearAdminSessionCookies();
  redirect("/admin/login");
}
