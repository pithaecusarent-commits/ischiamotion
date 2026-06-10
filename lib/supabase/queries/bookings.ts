import { createClient } from "@supabase/supabase-js";
import { initialPaymentStatus } from "@/lib/booking-labels";
import { generateBookingCode } from "@/lib/public-codes";
import type { BookingDeliveryMethod, BookingPaymentMethod, BookingPaymentType } from "@/lib/types";

export type BookingRequestInput = {
  bookingCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: "it" | "en";
  startDate: string;
  endDate: string;
  pickupTime: string;
  deliveryMethod: BookingDeliveryMethod;
  deliveryLocation: string;
  pickupMunicipality: string;
  portSlug: string;
  hotelMunicipality: string;
  deliveryNotes: string;
  paymentType: BookingPaymentType;
  paymentMethod: BookingPaymentMethod;
  paymentNotes: string;
  notes: string;
  vehicleId: string | null;
  pickupPointId: string | null;
  vehicleLabel: string;
  pickupPointLabel: string;
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

export { generateBookingCode };

export function buildBookingNotes(input: Pick<BookingRequestInput, "notes" | "vehicleLabel" | "pickupPointLabel">) {
  const parts = [
    `Vehicle: ${input.vehicleLabel}`,
    `Pickup point: ${input.pickupPointLabel}`
  ];

  if (input.notes.trim()) {
    parts.push(`Customer notes: ${input.notes.trim()}`);
  }

  return parts.join("\n");
}

export async function createBookingRequest(input: BookingRequestInput) {
  const supabase = createPublicSupabaseClient();

  const { error } = await supabase.rpc("create_public_booking_request", {
    p_booking_code: input.bookingCode,
    p_customer_first_name: input.firstName,
    p_customer_last_name: input.lastName,
    p_customer_email: input.email,
    p_customer_phone: input.phone || null,
    p_customer_language: input.language,
    p_vehicle_id: input.vehicleId,
    p_pickup_point_id: input.pickupPointId,
    p_start_date: input.startDate,
    p_end_date: input.endDate,
    p_pickup_time: input.pickupTime || null,
    p_delivery_method: input.deliveryMethod,
    p_delivery_location: input.deliveryLocation || null,
    p_hotel_municipality: input.hotelMunicipality || null,
    p_pickup_municipality: input.pickupMunicipality || null,
    p_port_slug: input.portSlug || null,
    p_delivery_notes: input.deliveryNotes || null,
    p_payment_type: input.paymentType,
    p_payment_method: input.paymentMethod,
    p_payment_status: initialPaymentStatus(input.paymentType),
    p_payment_notes: input.paymentNotes || null,
    p_notes: buildBookingNotes(input)
  });

  if (error) {
    throw error;
  }
}

export function getBookingNoteValue(notes: string | null, label: "Vehicle" | "Pickup point") {
  if (!notes) return "";
  const line = notes.split("\n").find((item) => item.startsWith(`${label}: `));
  return line?.replace(`${label}: `, "") || "";
}
