"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { upsertAdminPaymentSettings } from "@/lib/supabase/queries/admin-payment-settings";

function clean(value: FormDataEntryValue | null) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

export async function savePaymentSettingsAction(formData: FormData) {
  const { accessToken } = await requireAdmin("/admin/settings/payments");

  const bankAccountHolder = clean(formData.get("bank_account_holder"));
  const iban = clean(formData.get("iban"));
  const bankName = clean(formData.get("bank_name"));
  const depositInstructionsIt = clean(formData.get("deposit_instructions_it"));

  if (!bankAccountHolder || !iban || !depositInstructionsIt) {
    redirect("/admin/settings/payments?error=Compila%20intestatario%2C%20IBAN%20e%20istruzioni%20acconto%20IT.");
  }

  const { error } = await upsertAdminPaymentSettings(accessToken, {
    bank_account_holder: bankAccountHolder,
    iban,
    bank_name: bankName || "",
    bic_swift: clean(formData.get("bic_swift")),
    payment_reason_template: clean(formData.get("payment_reason_template")),
    deposit_instructions_it: depositInstructionsIt,
    deposit_instructions_en: clean(formData.get("deposit_instructions_en")),
    receipt_email: clean(formData.get("receipt_email")),
    receipt_whatsapp: clean(formData.get("receipt_whatsapp")),
    bank_transfer_enabled: formData.get("bank_transfer_enabled") === "on",
    stripe_enabled: formData.get("stripe_enabled") === "on",
    paypal_enabled: formData.get("paypal_enabled") === "on",
    is_active: formData.get("is_active") === "on"
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/settings/payments");

  if (error) {
    redirect(`/admin/settings/payments?error=${encodeURIComponent(error)}`);
  }

  redirect("/admin/settings/payments?saved=1");
}
