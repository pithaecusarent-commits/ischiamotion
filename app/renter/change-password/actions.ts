"use server";

import { redirect } from "next/navigation";
import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";
import { requireRenter } from "@/lib/supabase/renter-auth";

function isStrongEnough(password: string) {
  return password.length >= 10 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export async function completeFirstRenterPasswordChange(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");
  const nextPath = String(formData.get("next") || "/renter");
  const session = await requireRenter("/renter/change-password");

  if (session.denied) {
    redirect(`/renter/login?error=${encodeURIComponent("Accesso temporaneo scaduto o non autorizzato.")}`);
  }

  if (!isStrongEnough(password)) {
    redirect(`/renter/change-password?error=${encodeURIComponent("Usa almeno 10 caratteri con lettere e numeri.")}`);
  }

  if (password !== confirmPassword) {
    redirect(`/renter/change-password?error=${encodeURIComponent("Le password non coincidono.")}`);
  }

  const supabase = createSupabaseUserClient(session.accessToken);
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/renter/change-password?error=${encodeURIComponent("Impossibile aggiornare la password.")}`);
  }

  await supabase.rpc("complete_renter_first_password_change");

  redirect(nextPath.startsWith("/renter") && nextPath !== "/renter/change-password" ? nextPath : "/renter");
}
