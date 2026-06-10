import { createSupabaseServiceRoleClient, createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export type AdminPaymentSettings = {
  id: string;
  bank_account_holder: string | null;
  iban: string | null;
  bank_name: string | null;
  bic_swift: string | null;
  payment_reason_template: string | null;
  deposit_instructions_it: string | null;
  deposit_instructions_en: string | null;
  receipt_email: string | null;
  receipt_whatsapp: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminPaymentSettingsInput = {
  bank_account_holder: string;
  iban: string;
  bank_name: string;
  bic_swift: string | null;
  payment_reason_template: string | null;
  deposit_instructions_it: string;
  deposit_instructions_en: string | null;
  receipt_email: string | null;
  receipt_whatsapp: string | null;
  is_active: boolean;
};

async function getLatestPaymentSettingsRow(
  supabase: ReturnType<typeof createSupabaseUserClient> | ReturnType<typeof createSupabaseServiceRoleClient>
) {
  const activeResult = await supabase
    .from("payment_settings")
    .select("*")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (activeResult.error) {
    return { data: null, error: activeResult.error.message };
  }

  if ((activeResult.data || []).length > 0) {
    return { data: activeResult.data?.[0] as AdminPaymentSettings, error: null };
  }

  const latestResult = await supabase
    .from("payment_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (latestResult.error) {
    return { data: null, error: latestResult.error.message };
  }

  return { data: (latestResult.data?.[0] as AdminPaymentSettings | undefined) || null, error: null };
}

export async function getAdminPaymentSettings(accessToken: string): Promise<{ settings: AdminPaymentSettings | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const result = await getLatestPaymentSettingsRow(supabase);
    return { settings: result.data, error: result.error };
  } catch (error) {
    return { settings: null, error: error instanceof Error ? error.message : "Unable to load payment settings." };
  }
}

export async function getActivePaymentSettingsForEmail(): Promise<{ settings: AdminPaymentSettings | null; error: string | null }> {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      return { settings: null, error: error.message };
    }

    return { settings: (data?.[0] as AdminPaymentSettings | undefined) || null, error: null };
  } catch (error) {
    return { settings: null, error: error instanceof Error ? error.message : "Unable to load active payment settings." };
  }
}

export async function upsertAdminPaymentSettings(
  accessToken: string,
  input: AdminPaymentSettingsInput
): Promise<{ settings: AdminPaymentSettings | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const latest = await getLatestPaymentSettingsRow(supabase);

    if (latest.error) {
      return { settings: null, error: latest.error };
    }

    if (input.is_active) {
      const deactivateQuery = latest.data
        ? supabase.from("payment_settings").update({ is_active: false }).eq("is_active", true).neq("id", latest.data.id)
        : supabase.from("payment_settings").update({ is_active: false }).eq("is_active", true);
      const { error: deactivateError } = await deactivateQuery;
      if (deactivateError) {
        return { settings: null, error: deactivateError.message };
      }
    }

    if (latest.data) {
      const { data, error } = await supabase
        .from("payment_settings")
        .update({
          ...input,
          updated_at: new Date().toISOString()
        })
        .eq("id", latest.data.id)
        .select("*")
        .single();

      if (error) {
        return { settings: null, error: error.message };
      }

      return { settings: data as AdminPaymentSettings, error: null };
    }

    const { data, error } = await supabase
      .from("payment_settings")
      .insert(input)
      .select("*")
      .single();

    if (error) {
      return { settings: null, error: error.message };
    }

    return { settings: data as AdminPaymentSettings, error: null };
  } catch (error) {
    return { settings: null, error: error instanceof Error ? error.message : "Unable to save payment settings." };
  }
}
