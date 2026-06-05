import { NextResponse } from "next/server";
import {
  getAdminBookingRequests,
  type AdminBookingFilters
} from "@/lib/supabase/queries/admin-bookings";
import { getAdminSession } from "@/lib/supabase/admin-auth";
import {
  bookingAmountSummary,
  bookingDeliveryLocation,
  bookingDeliveryMethod,
  bookingPaymentStatus,
  bookingPaymentType,
  bookingPickupPoint,
  bookingVehicle
} from "@/app/admin/bookings/booking-ui";

function clean(value: string | null) {
  return String(value || "").trim();
}

function csvCell(value: string | number | null | undefined) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const session = await getAdminSession();

  if (!session.accessToken || session.profile?.role !== "admin" || session.profile.account_status !== "approved") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const filters: AdminBookingFilters = {
    status: clean(params.get("status")),
    renterId: clean(params.get("renter")),
    category: clean(params.get("category")),
    dateFrom: clean(params.get("from")),
    dateTo: clean(params.get("to")),
    q: clean(params.get("q"))
  };
  const { bookings, error } = await getAdminBookingRequests(session.accessToken, filters);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const header = [
    "Codice",
    "Creato",
    "Cliente",
    "Email",
    "Telefono",
    "Lingua",
    "Veicolo",
    "Categoria",
    "Renter",
    "Data inizio",
    "Data fine",
    "Orario",
    "Servizio",
    "Luogo",
    "Stato",
    "Pagamento",
    "Stato pagamento",
    "Importi"
  ];
  const rows = bookings.map((booking) => [
    booking.booking_code,
    booking.created_at,
    `${booking.customer_first_name} ${booking.customer_last_name}`.trim(),
    booking.customer_email,
    booking.customer_phone || "",
    booking.customer_language,
    bookingVehicle(booking),
    booking.vehicles?.vehicle_categories?.name_it || "",
    booking.renters?.business_name_internal || "",
    booking.start_date,
    booking.end_date,
    booking.pickup_time || "",
    bookingDeliveryMethod(booking),
    bookingDeliveryLocation(booking) || bookingPickupPoint(booking),
    booking.status,
    bookingPaymentType(booking),
    bookingPaymentStatus(booking),
    bookingAmountSummary(booking)
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ischiamotion-bookings-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
