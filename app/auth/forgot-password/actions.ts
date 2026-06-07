"use server";

import { redirect } from "next/navigation";
import { createSupabaseAnonClient } from "@/lib/supabase/admin-auth";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ischiamotion.com";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (email) {
    const supabase = createSupabaseAnonClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/update-password`
    });
  }

  redirect("/auth/forgot-password?sent=1");
}
