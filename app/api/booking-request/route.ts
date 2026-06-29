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

function createServiceRoleSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server environment variables.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function clean(value: unknown) {
  return String(value || "").trim();
}

function todayDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

type PublicVehicleOfferRow = {
  id: string;
  pickup_point_id: string;
  price_from: number | null;
};

type VehicleOfferIdentity = {
  id: string;
  vehicle_model_id: string | null;
  vehicle_categories: { slug: string } | { slug: string }[] | null;
};

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

function relationValue<T>(value: T | T[] | null) {
  return Array.isArray(value) ? value[0] || null : value;
}

async function resolveBestVehicleOffer(
  input: BookingRequestInput,
  publicSupabase: ReturnType<typeof createPublicSupabaseClient>
) {
  if (!input.vehicleId) return null;

  const serviceSupabase = createServiceRoleSupabaseClient();
  const { data: originalOffer, error: originalOfferError } = await serviceSupabase
    .from("vehicles")
    .select("id, vehicle_model_id, vehicle_categories(slug)")
    .eq("id", input.vehicleId)
    .maybeSingle();

  if (originalOfferError || !originalOffer) return null;

  const identity = originalOffer as unknown as VehicleOfferIdentity;
  const category = relationValue(identity.vehicle_categories);
  if (!category?.slug) return null;

  const { data: matchingOffers, error: searchError } = await publicSupabase.rpc(
    "search_public_vehicles",
    {
      p_category_slug: category.slug,
      p_start_date: input.startDate,
      p_end_date: input.endDate,
      p_delivery_method: input.deliveryMethod,
      p_pickup_municipality: input.pickupMunicipality || null,
      p_port_slug: input.portSlug || null,
      p_hotel_municipality: input.hotelMunicipality || null
    }
  );

  if (searchError) return null;

  const publicOffers = (matchingOffers || []) as PublicVehicleOfferRow[];
  if (identity.vehicle_model_id === null) {
    return publicOffers.find((offer) => offer.id === identity.id) || null;
  }

  const offerIds = publicOffers.map((offer) => offer.id);
  if (offerIds.length === 0) return null;

  const { data: offerIdentities, error: offerIdentitiesError } = await serviceSupabase
    .from("vehicles")
    .select("id, vehicle_model_id")
    .in("id", offerIds);

  if (offerIdentitiesError) return null;

  const matchingIdentity = (offerIdentities || []).find(
    (offer) => offer.vehicle_model_id === identity.vehicle_model_id
  );

  return matchingIdentity
    ? publicOffers.find((offer) => offer.id === matchingIdentity.id) || null
    : null;
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
    return NextResponse.json({ ok: false, code: "RATE_LIMITED", error: "Too many requests." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null) as Partial<BookingRequestInput> | null;

  if (!payload) {
    return NextResponse.json({ ok: false, code: "INVALID_PAYLOAD", error: "Invalid JSON." }, { status: 400 });
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
    pickupMunicipality: clean(payload.pickupMunicipality),
    portSlug: clean(payload.portSlug),
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
    return NextResponse.json({ ok: false, code: "INVALID_PAYLOAD", error: "Invalid booking request payload." }, { status: 400 });
  }

  if (!isIsoDate(input.startDate) || !isIsoDate(input.endDate) || input.endDate < input.startDate) {
    return NextResponse.json({ ok: false, code: "INVALID_DATES", error: "Invalid booking dates." }, { status: 400 });
  }

  const today = todayDateString();
  if (input.startDate < today || input.endDate < today) {
    return NextResponse.json(
      { ok: false, code: "PAST_DATES", error: "Booking dates cannot be in the past." },
      { status: 400 }
    );
  }

  const emailLimit = checkRateLimit({
    key: `booking-request:email:${input.email}`,
    limit: 3,
    windowMs: 60 * 60 * 1000
  });

  if (!emailLimit.allowed) {
    return NextResponse.json({ ok: false, code: "RATE_LIMITED", error: "Too many requests." }, { status: 429 });
  }

  const supabase = createPublicSupabaseClient();

  if (input.vehicleId) {
    const resolvedOffer = await resolveBestVehicleOffer(input, supabase);
    if (!resolvedOffer) {
      return NextResponse.json(
        { ok: false, code: "OFFER_UNAVAILABLE", error: "No compatible vehicle offer is currently available." },
        { status: 400 }
      );
    }

    input.vehicleId = resolvedOffer.id;
    input.pickupPointId = resolvedOffer.pickup_point_id;
    if (resolvedOffer.price_from !== null) {
      input.paymentNotes = `Prezzo verificato per l'offerta selezionata: €${Number(resolvedOffer.price_from)}/giorno`;
    }
  }

  const { data, error } = await supabase.rpc("create_public_booking_request", {
    p_booking_code: input.bookingCode,
    p_customer_first_name: input.firstName,
    p_customer_last_name: input.lastName,
    p_customer_email: input.email,
    p_customer_phone: input.phone || null,
    p_customer_language: input.language,
    // renter_id is derived by the RPC from vehicle.renter_id — it is the suggested/pre-selected
    // partner, not a final assignment. Admin can reassign the booking to a different renter.
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
    return NextResponse.json({ ok: false, code: "TEMPORARY_ERROR", error: "Unable to create booking request." }, { status: 400 });
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
