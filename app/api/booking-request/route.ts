import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { initialPaymentStatus } from "@/lib/booking-labels";
import { createInternalSignature } from "@/lib/internal-signature";
import { generateBookingCode } from "@/lib/public-codes";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { buildBookingNotes, type BookingRequestInput } from "@/lib/supabase/queries/bookings";

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

function clean(value: unknown) {
  return String(value || "").trim();
}

function isValidRequest(input: Partial<BookingRequestInput>) {
  return Boolean(
    input.firstName &&
    input.lastName &&
    input.email &&
    input.language &&
    input.startDate &&
    input.endDate &&
    input.deliveryMethod &&
    input.paymentType &&
    input.paymentMethod &&
    input.vehicleLabel &&
    input.pickupPointLabel
  );
}

async function sendBookingEmails(request: Request, bookingId: string | null, input: BookingRequestInput) {
  const body = JSON.stringify({
    bookingId,
    bookingCode: input.bookingCode,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    language: input.language,
    startDate: input.startDate,
    endDate: input.endDate,
    pickupTime: input.pickupTime,
    deliveryMethod: input.deliveryMethod,
    deliveryLocation: input.deliveryLocation,
    deliveryNotes: input.deliveryNotes,
    paymentType: input.paymentType,
    paymentMethod: input.paymentMethod,
    paymentNotes: input.paymentNotes,
    notes: input.notes,
    vehicleLabel: input.vehicleLabel,
    pickupPointLabel: input.pickupPointLabel
  });
  const { timestamp, signature } = createInternalSignature(body);

  return fetch(new URL("/api/booking-email", request.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-im-timestamp": timestamp,
      "x-im-signature": signature
    },
    body
  });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request.headers);
  const ipLimit = checkRateLimit({
    key: `booking-request:ip:${clientIp}`,
    limit: 8,
    windowMs: 10 * 60 * 1000
  });

  if (!ipLimit.allowed) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null) as Partial<BookingRequestInput> | null;

  if (!payload) {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const input: BookingRequestInput = {
    bookingCode: generateBookingCode(),
    firstName: clean(payload.firstName),
    lastName: clean(payload.lastName),
    email: clean(payload.email).toLowerCase(),
    phone: clean(payload.phone),
    language: payload.language === "en" ? "en" : "it",
    startDate: clean(payload.startDate),
    endDate: clean(payload.endDate),
    pickupTime: clean(payload.pickupTime),
    deliveryMethod: payload.deliveryMethod || "pickup_point",
    deliveryLocation: clean(payload.deliveryLocation),
    hotelMunicipality: clean(payload.hotelMunicipality),
    deliveryNotes: clean(payload.deliveryNotes),
    paymentType: payload.paymentType || "pay_on_pickup",
    paymentMethod: payload.paymentMethod || "unknown",
    paymentNotes: clean(payload.paymentNotes),
    notes: clean(payload.notes),
    vehicleId: payload.vehicleId || null,
    pickupPointId: payload.pickupPointId || null,
    vehicleLabel: clean(payload.vehicleLabel),
    pickupPointLabel: clean(payload.pickupPointLabel)
  };

  if (!isValidRequest(input)) {
    return NextResponse.json({ ok: false, error: "Invalid booking request payload." }, { status: 400 });
  }

  if (input.endDate < input.startDate) {
    return NextResponse.json({ ok: false, error: "Invalid booking dates." }, { status: 400 });
  }

  const emailLimit = checkRateLimit({
    key: `booking-request:email:${input.email}`,
    limit: 3,
    windowMs: 60 * 60 * 1000
  });

  if (!emailLimit.allowed) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase.rpc("create_public_booking_request", {
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
    p_delivery_notes: input.deliveryNotes || null,
    p_payment_type: input.paymentType,
    p_payment_method: input.paymentMethod,
    p_payment_status: initialPaymentStatus(input.paymentType),
    p_payment_notes: input.paymentNotes || null,
    p_notes: buildBookingNotes(input)
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "Unable to create booking request." }, { status: 400 });
  }

  let emailSent = false;
  try {
    const emailResponse = await sendBookingEmails(request, typeof data === "string" ? data : null, input);
    emailSent = emailResponse.ok;
  } catch {
    emailSent = false;
  }

  return NextResponse.json({
    ok: true,
    bookingCode: input.bookingCode,
    emailSent
  });
}
