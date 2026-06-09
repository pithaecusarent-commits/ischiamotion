import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";

export type AdminCheckin = {
  id: string;
  booking_id: string | null;
  voucher_code: string | null;
  checked_in_at: string | null;
  checked_in_by: string | null;
  method: string | null;
  notes: string | null;
  created_at: string;
};

const checkinSelect = "id, booking_id, voucher_code, checked_in_at, checked_in_by, method, notes, created_at";

export async function getAdminCheckinByBookingId(accessToken: string, bookingId: string): Promise<{ checkin: AdminCheckin | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("checkins")
      .select(checkinSelect)
      .eq("booking_id", bookingId)
      .maybeSingle();

    if (error) {
      return { checkin: null, error: error.message };
    }

    return { checkin: (data || null) as AdminCheckin | null, error: null };
  } catch (error) {
    return { checkin: null, error: error instanceof Error ? error.message : "Unable to load check-in." };
  }
}

export async function createAdminCheckin(input: {
  accessToken: string;
  bookingId: string;
  voucherCode: string;
  adminUserId: string;
}): Promise<{ checkin: AdminCheckin | null; error: string | null }> {
  const existing = await getAdminCheckinByBookingId(input.accessToken, input.bookingId);

  if (existing.error || existing.checkin) {
    return existing;
  }

  try {
    const supabase = createSupabaseUserClient(input.accessToken);
    const { data, error } = await supabase
      .from("checkins")
      .insert({
        booking_id: input.bookingId,
        voucher_code: input.voucherCode,
        checked_in_at: new Date().toISOString(),
        checked_in_by: input.adminUserId,
        method: "admin",
        notes: "Check-in registrato da area admin."
      })
      .select(checkinSelect)
      .single();

    if (error) {
      const retry = await getAdminCheckinByBookingId(input.accessToken, input.bookingId);
      if (retry.checkin) return retry;
      return { checkin: null, error: error.message };
    }

    return { checkin: data as AdminCheckin, error: null };
  } catch (error) {
    return { checkin: null, error: error instanceof Error ? error.message : "Unable to create check-in." };
  }
}
