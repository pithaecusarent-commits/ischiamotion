import type {
  BookingDeliveryMethod,
  BookingPaymentMethod,
  BookingPaymentStatus,
  BookingPaymentType,
  Locale
} from "@/lib/types";
import { municipalityLabels, portLabels } from "@/lib/delivery-zones";

export { portLabels, municipalityLabels };

export const deliveryMethodLabels: Record<Locale, Record<BookingDeliveryMethod, string>> = {
  it: {
    pickup_point: "Ritiro presso IschiaMotion Point",
    port_delivery: "Consegna al porto",
    hotel_delivery: "Consegna in hotel"
  },
  en: {
    pickup_point: "Pickup at IschiaMotion Point",
    port_delivery: "Port delivery",
    hotel_delivery: "Hotel delivery"
  }
};

export const paymentTypeLabels: Record<Locale, Record<BookingPaymentType, string>> = {
  it: {
    pay_on_pickup: "Pagamento al ritiro",
    deposit_required: "Acconto / caparra",
    prepaid_full: "Pagamento anticipato"
  },
  en: {
    pay_on_pickup: "Pay on pickup",
    deposit_required: "Deposit",
    prepaid_full: "Full prepayment"
  }
};

export const paymentMethodLabels: Record<Locale, Record<BookingPaymentMethod, string>> = {
  it: {
    unknown: "Da definire",
    cash: "Contanti",
    card: "Carta al ritiro",
    bank_transfer: "Bonifico",
    future_online_card: "Carta online futura"
  },
  en: {
    unknown: "To be confirmed",
    cash: "Cash",
    card: "Card on pickup",
    bank_transfer: "Bank transfer",
    future_online_card: "Future online card"
  }
};

export const paymentStatusLabels: Record<Locale, Record<BookingPaymentStatus, string>> = {
  it: {
    unpaid: "Da pagare",
    deposit_pending: "Acconto da ricevere",
    deposit_paid: "Acconto ricevuto",
    paid: "Pagato",
    refunded: "Rimborsato",
    cancelled: "Annullato"
  },
  en: {
    unpaid: "Unpaid",
    deposit_pending: "Deposit pending",
    deposit_paid: "Deposit paid",
    paid: "Paid",
    refunded: "Refunded",
    cancelled: "Cancelled"
  }
};

export function initialPaymentStatus(paymentType: BookingPaymentType): BookingPaymentStatus {
  if (paymentType === "deposit_required") return "deposit_pending";
  return "unpaid";
}

export function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}
