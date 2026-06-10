import type { AdminBookingItem } from "@/lib/supabase/queries/admin-bookings";
import { deliveryMethodLabels, formatMoney, municipalityLabels, paymentMethodLabels, paymentStatusLabels, paymentTypeLabels } from "@/lib/booking-labels";
import { isValidHotelMunicipality } from "@/lib/delivery-zones";
import { getBookingNoteValue } from "@/lib/supabase/queries/bookings";

export const statusStyles: Record<string, { label: string; className: string }> = {
  pending: {
    label: "In attesa",
    className: "border-amber-200 bg-amber-50 text-amber-800"
  },
  confirmed: {
    label: "Confermata",
    className: "border-sea/20 bg-sea/10 text-green-deep"
  },
  voucher_sent: {
    label: "Voucher inviato",
    className: "border-blue-200 bg-blue-50 text-blue-800"
  },
  checked_in: {
    label: "Check-in fatto",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800"
  },
  completed: {
    label: "Completata",
    className: "border-green-200 bg-green-50 text-green-800"
  },
  cancelled: {
    label: "Annullata",
    className: "border-rose-200 bg-rose-50 text-rose-800"
  },
  no_show: {
    label: "No-show",
    className: "border-stone-200 bg-stone-100 text-stone-700"
  }
};

export const statusOptions = [
  { value: "pending", label: "In attesa" },
  { value: "confirmed", label: "Confermata" },
  { value: "voucher_sent", label: "Voucher inviato" },
  { value: "checked_in", label: "Check-in fatto" },
  { value: "completed", label: "Completata" },
  { value: "cancelled", label: "Annullata" },
  { value: "no_show", label: "No-show" }
] as const;

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

export function formatAdminDateTime(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || {
    label: status,
    className: "border-ink/10 bg-white/70 text-ink/70"
  };

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${style.className}`}>
      {style.label}
    </span>
  );
}

export function bookingVehicle(booking: AdminBookingItem) {
  return getBookingNoteValue(booking.notes, "Vehicle") || "-";
}

export function bookingPickupPoint(booking: AdminBookingItem) {
  return getBookingNoteValue(booking.notes, "Pickup point") || "-";
}

export function bookingDeliveryMethod(booking: AdminBookingItem) {
  return deliveryMethodLabels.it[booking.delivery_method] || booking.delivery_method;
}

export function bookingDeliveryLocation(booking: AdminBookingItem) {
  return booking.delivery_location || bookingPickupPoint(booking);
}

export function bookingHotelMunicipality(booking: AdminBookingItem) {
  const m = booking.hotel_municipality;
  if (!m) return null;
  if (isValidHotelMunicipality(m)) return municipalityLabels.it[m];
  return m;
}

export function bookingPaymentType(booking: AdminBookingItem) {
  return paymentTypeLabels.it[booking.payment_type] || booking.payment_type;
}

export function bookingPaymentMethod(booking: AdminBookingItem) {
  return paymentMethodLabels.it[booking.payment_method] || booking.payment_method;
}

export function bookingPaymentStatus(booking: AdminBookingItem) {
  return paymentStatusLabels.it[booking.payment_status] || booking.payment_status;
}

export function bookingAmountSummary(booking: AdminBookingItem) {
  return [
    booking.total_amount !== null ? `Totale ${formatMoney(booking.total_amount)}` : "",
    booking.deposit_amount !== null ? `Acconto ${formatMoney(booking.deposit_amount)}` : "",
    booking.balance_due !== null ? `Saldo ${formatMoney(booking.balance_due)}` : ""
  ].filter(Boolean).join(" · ") || "-";
}

export function bookingCustomerNotes(booking: AdminBookingItem) {
  if (!booking.notes) return "";
  const line = booking.notes.split("\n").find((item) => item.startsWith("Customer notes: "));
  return line?.replace("Customer notes: ", "") || "";
}
