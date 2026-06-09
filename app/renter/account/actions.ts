"use server";

import { redirect } from "next/navigation";
import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";
import { requireRenter } from "@/lib/supabase/renter-auth";

export async function updateRenterPassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");
  const session = await requireRenter("/renter/account");

  if (session.denied) {
    redirect("/renter/account?error=Accesso%20richiesto");
  }

  if (password.length < 8) {
    redirect(`/renter/account?error=${encodeURIComponent("La password deve avere almeno 8 caratteri.")}`);
  }

  if (password !== confirmPassword) {
    redirect(`/renter/account?error=${encodeURIComponent("Le password non coincidono.")}`);
  }

  const supabase = createSupabaseUserClient(session.accessToken);
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/renter/account?error=${encodeURIComponent("Impossibile aggiornare la password.")}`);
  }

  redirect("/renter/account?updated=1");
}
