"use server";

import { redirect } from "next/navigation";
import { requireAdmin, createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export async function updateAdminPassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");
  const { accessToken } = await requireAdmin("/admin/account");

  if (password.length < 8) {
    redirect(`/admin/account?error=${encodeURIComponent("La password deve avere almeno 8 caratteri.")}`);
  }

  if (password !== confirmPassword) {
    redirect(`/admin/account?error=${encodeURIComponent("Le password non coincidono.")}`);
  }

  const supabase = createSupabaseUserClient(accessToken);
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/admin/account?error=${encodeURIComponent("Impossibile aggiornare la password.")}`);
  }

  redirect("/admin/account?updated=1");
}
