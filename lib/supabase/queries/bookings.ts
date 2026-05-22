import { createClient } from "@supabase/supabase-js";

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
  notes: string;
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

export function generateBookingCode() {
  return `IM-${Date.now()}`;
}

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

  const { error } = await supabase.from("bookings").insert({
    booking_code: input.bookingCode,
    customer_first_name: input.firstName,
    customer_last_name: input.lastName,
    customer_email: input.email,
    customer_phone: input.phone || null,
    customer_language: input.language,
    start_date: input.startDate,
    end_date: input.endDate,
    pickup_time: input.pickupTime || null,
    status: "pending",
    notes: buildBookingNotes(input)
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
