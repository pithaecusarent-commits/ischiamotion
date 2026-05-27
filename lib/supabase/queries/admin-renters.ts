import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export type AdminRenterApplication = {
  id: string;
  email: string | null;
  account_status: "pending" | "approved" | "rejected";
  business_name: string | null;
  contact_name: string | null;
  phone: string | null;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
};

export async function getAdminRenterApplications(
  accessToken: string
): Promise<{ applications: AdminRenterApplication[]; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, account_status, business_name, contact_name, phone, created_at, approved_at, rejected_at, rejection_reason")
      .eq("role", "renter")
      .order("created_at", { ascending: false });

    if (error) {
      return { applications: [], error: error.message };
    }

    return {
      applications: (data || []) as AdminRenterApplication[],
      error: null
    };
  } catch (error) {
    return {
      applications: [],
      error: error instanceof Error ? error.message : "Unable to load renter applications."
    };
  }
}

export async function approveRenterApplication(
  accessToken: string,
  profileId: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase.rpc("approve_renter_profile", {
      target_profile_id: profileId
    });

    return { error: error?.message || null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to approve renter." };
  }
}

export async function rejectRenterApplication(
  accessToken: string,
  profileId: string,
  reason: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { error } = await supabase.rpc("reject_renter_profile", {
      target_profile_id: profileId,
      reason
    });

    return { error: error?.message || null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to reject renter." };
  }
}
