import { createClient } from "@supabase/supabase-js";
import { createSupabaseUserClient } from "@/lib/supabase/admin-auth";
import type { AdminBookingItem } from "@/lib/supabase/queries/admin-bookings";
import type { BookingDeliveryMethod, BookingPaymentStatus, BookingPaymentType } from "@/lib/types";

export type AdminVoucher = {
  id: string;
  booking_id: string;
  voucher_code: string;
  qr_payload: string | null;
  qr_image_url: string | null;
  issued_at: string | null;
  sent_at: string | null;
  created_at: string;
};

export type PublicCheckinVoucher = {
  voucher_code: string;
  customer_language: "it" | "en";
  booking_status: string;
  customer_display_name: string | null;
  vehicle_label: string | null;
  pickup_point_label: string | null;
  start_date: string;
  end_date: string;
  pickup_time: string | null;
  delivery_method: BookingDeliveryMethod;
  delivery_location: string | null;
  delivery_notes: string | null;
  payment_type: BookingPaymentType;
  payment_status: BookingPaymentStatus;
  deposit_amount: number | null;
  balance_due: number | null;
};

function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase public environment variables.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function buildVoucherCode() {
  return `IM-${new Date().getFullYear()}-${Date.now()}`;
}

export function buildVoucherPayload(voucherCode: string) {
  return `/checkin/${encodeURIComponent(voucherCode)}`;
}

export async function getAdminVoucherByBookingId(accessToken: string, bookingId: string): Promise<{ voucher: AdminVoucher | null; error: string | null }> {
  try {
    const supabase = createSupabaseUserClient(accessToken);
    const { data, error } = await supabase
      .from("booking_vouchers")
      .select("id, booking_id, voucher_code, qr_payload, qr_image_url, issued_at, sent_at, created_at")
      .eq("booking_id", bookingId)
      .maybeSingle();

    if (error) {
      return { voucher: null, error: error.message };
    }

    return { voucher: (data || null) as AdminVoucher | null, error: null };
  } catch (error) {
    return { voucher: null, error: error instanceof Error ? error.message : "Unable to load voucher." };
  }
}

export async function createAdminVoucher(
  accessToken: string,
  booking: AdminBookingItem
): Promise<{ voucher: AdminVoucher | null; error: string | null }> {
  const existing = await getAdminVoucherByBookingId(accessToken, booking.id);

  if (existing.error || existing.voucher) {
    return existing;
  }

  try {
    const supabase = createSupabaseUserClient(accessToken);
    const voucherCode = buildVoucherCode();
    const qrPayload = buildVoucherPayload(voucherCode);
    const { data, error } = await supabase
      .from("booking_vouchers")
      .insert({
        booking_id: booking.id,
        voucher_code: voucherCode,
        qr_payload: qrPayload,
        issued_at: new Date().toISOString()
      })
      .select("id, booking_id, voucher_code, qr_payload, qr_image_url, issued_at, sent_at, created_at")
      .single();

    if (error) {
      return { voucher: null, error: error.message };
    }

    return { voucher: data as AdminVoucher, error: null };
  } catch (error) {
    return { voucher: null, error: error instanceof Error ? error.message : "Unable to create voucher." };
  }
}

export async function getPublicCheckinVoucher(code: string): Promise<{ voucher: PublicCheckinVoucher | null; error: string | null }> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .rpc("get_public_voucher_checkin", { lookup_voucher_code: code })
      .maybeSingle();

    if (error) {
      return { voucher: null, error: error.message };
    }

    return { voucher: (data || null) as PublicCheckinVoucher | null, error: null };
  } catch (error) {
    return { voucher: null, error: error instanceof Error ? error.message : "Unable to load voucher." };
  }
}
