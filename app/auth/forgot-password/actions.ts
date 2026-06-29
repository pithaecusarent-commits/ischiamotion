"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseAnonClient } from "@/lib/supabase/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ischiamotion.com";
const resetSentPath = "/auth/forgot-password?sent=1";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const clientIp = getClientIp(headers());

  const ipLimit = checkRateLimit({
    key: `forgot-password:ip:${clientIp}`,
    limit: 10,
    windowMs: 10 * 60 * 1000
  });

  if (!ipLimit.allowed) {
    redirect(resetSentPath);
  }

  if (email) {
    const emailLimit = checkRateLimit({
      key: `forgot-password:email:${email}`,
      limit: 3,
      windowMs: 60 * 60 * 1000
    });

    if (!emailLimit.allowed) {
      redirect(resetSentPath);
    }

    const supabase = createSupabaseAnonClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/update-password`
    });

    if (error) {
      console.warn("[forgot-password] reset request failed", { email, error: error.message });
    }
  }

  redirect(resetSentPath);
}
