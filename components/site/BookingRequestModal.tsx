"use client";

import { FormEvent, useMemo, useState } from "react";
import { deliveryMethodLabels, paymentMethodLabels, paymentTypeLabels } from "@/lib/booking-labels";
import { createBookingRequest, generateBookingCode } from "@/lib/supabase/queries/bookings";
import type {
  BookingDeliveryMethod,
  BookingPaymentMethod,
  BookingPaymentType,
  Locale,
  PublicPickupPoint,
  PublicVehicle
} from "@/lib/types";

type Props = {
  locale: Locale;
  vehicle: PublicVehicle | null;
  pickupPoints: PublicPickupPoint[];
  startDate: string;
  endDate: string;
  onClose: () => void;
};

const copy = {
  it: {
    title: "Richiesta prenotazione",
    subtitle: "Compila i dati e ti contatteremo per confermare la disponibilità.",
    firstName: "Nome",
    lastName: "Cognome",
    email: "Email",
    phone: "Telefono",
    startDate: "Data inizio",
    endDate: "Data fine",
    pickupTime: "Orario ritiro preferito",
    deliveryTitle: "Modalità di ritiro o consegna",
    port: "Porto",
    hotelName: "Nome hotel / struttura",
    deliveryNotes: "Note consegna opzionali",
    paymentTitle: "Condizioni di pagamento",
    paymentMethod: "Metodo preferito",
    paymentNotes: "Note pagamento opzionali",
    paymentNotice: "Il pagamento online automatico non è incluso in questa versione. Eventuali acconti, saldi o pagamenti anticipati saranno confermati dopo la verifica della disponibilità.",
    notes: "Note",
    language: "Lingua cliente",
    vehicle: "Veicolo selezionato",
    pickupPoint: "Pickup point selezionato",
    submit: "Invia richiesta",
    sending: "Invio in corso...",
    close: "Chiudi",
    success: "Richiesta ricevuta. Ti contatteremo per confermare la disponibilità.",
    error: "Non siamo riusciti a inviare la richiesta. Riprova tra poco."
  },
  en: {
    title: "Booking request",
    subtitle: "Fill in your details and we will contact you to confirm availability.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    startDate: "Start date",
    endDate: "End date",
    pickupTime: "Preferred pickup time",
    deliveryTitle: "Pickup or delivery option",
    port: "Port",
    hotelName: "Hotel / property name",
    deliveryNotes: "Optional delivery notes",
    paymentTitle: "Payment conditions",
    paymentMethod: "Preferred method",
    paymentNotes: "Optional payment notes",
    paymentNotice: "Automatic online payment is not included in this version. Deposits, balances or prepayments will be confirmed after availability check.",
    notes: "Notes",
    language: "Customer language",
    vehicle: "Selected vehicle",
    pickupPoint: "Selected pickup point",
    submit: "Send request",
    sending: "Sending...",
    close: "Close",
    success: "Request received. We will contact you to confirm availability.",
    error: "We could not send your request. Please try again shortly."
  }
} satisfies Record<Locale, Record<string, string>>;

const portOptions = ["Porto d'Ischia", "Casamicciola", "Forio"];
const deliveryOptions: BookingDeliveryMethod[] = ["pickup_point", "port_delivery", "hotel_delivery"];
const paymentTypeOptions: BookingPaymentType[] = ["pay_on_pickup", "deposit_required", "prepaid_full"];
const paymentMethodOptions: BookingPaymentMethod[] = ["unknown", "cash", "card", "bank_transfer", "future_online_card"];

function formatPickupLabel(point: PublicPickupPoint, locale: Locale) {
  const label = locale === "it" ? point.public_label_it : point.public_label_en;
  return label.replace(" - ", " — ");
}

export function BookingRequestModal({ locale, vehicle, pickupPoints, startDate, endDate, onClose }: Props) {
  const text = copy[locale];
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [selectedPickupPointId, setSelectedPickupPointId] = useState(pickupPoints[0]?.id || "");
  const [deliveryMethod, setDeliveryMethod] = useState<BookingDeliveryMethod>("pickup_point");
  const [paymentType, setPaymentType] = useState<BookingPaymentType>("pay_on_pickup");
  const vehicleLabel = useMemo(() => {
    if (!vehicle) return "";
    return locale === "it" ? vehicle.title_it : vehicle.title_en;
  }, [locale, vehicle]);

  if (!vehicle) return null;
  const currentVehicle = vehicle;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const pickupPoint = pickupPoints.find((point) => point.id === selectedPickupPointId) || pickupPoints[0];

    if (!pickupPoint) {
      setStatus("error");
      return;
    }

    const selectedDeliveryMethod = String(formData.get("deliveryMethod") || "pickup_point") as BookingDeliveryMethod;
    const deliveryLocation = selectedDeliveryMethod === "pickup_point"
      ? formatPickupLabel(pickupPoint, locale)
      : String(formData.get("deliveryLocation") || "");

    setStatus("submitting");

    try {
      await createBookingRequest({
        bookingCode: generateBookingCode(),
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        language: String(formData.get("language") || locale) as Locale,
        startDate: String(formData.get("startDate") || ""),
        endDate: String(formData.get("endDate") || ""),
        pickupTime: String(formData.get("pickupTime") || ""),
        deliveryMethod: selectedDeliveryMethod,
        deliveryLocation,
        deliveryNotes: String(formData.get("deliveryNotes") || ""),
        paymentType: String(formData.get("paymentType") || "pay_on_pickup") as BookingPaymentType,
        paymentMethod: String(formData.get("paymentMethod") || "unknown") as BookingPaymentMethod,
        paymentNotes: String(formData.get("paymentNotes") || ""),
        notes: String(formData.get("notes") || ""),
        vehicleId: currentVehicle.source === "supabase" ? currentVehicle.id : null,
        pickupPointId: currentVehicle.source === "supabase" ? currentVehicle.pickup_point_id || pickupPoint.id : null,
        vehicleLabel,
        pickupPointLabel: formatPickupLabel(pickupPoint, locale)
      });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="booking-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <div className="booking-modal">
        <button className="booking-close" type="button" onClick={onClose} aria-label={text.close}>×</button>
        <div className="section-eyebrow">{locale === "it" ? "Richiesta" : "Request"}</div>
        <h2 id="booking-modal-title">{text.title}</h2>
        <p className="booking-intro">{text.subtitle}</p>

        {status === "success" ? (
          <div className="booking-message success">{text.success}</div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <label>
              <span>{text.vehicle}</span>
              <input value={vehicleLabel} readOnly />
            </label>
            <label>
              <span>{text.pickupPoint}</span>
              <select value={selectedPickupPointId} onChange={(event) => setSelectedPickupPointId(event.target.value)} required>
                {pickupPoints.map((point) => (
                  <option key={point.id} value={point.id}>{formatPickupLabel(point, locale)}</option>
                ))}
              </select>
            </label>
            <div className="booking-notes">
              <span>{text.deliveryTitle}</span>
              <div className="booking-option-grid">
                {deliveryOptions.map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={option}
                      checked={deliveryMethod === option}
                      onChange={() => setDeliveryMethod(option)}
                    />
                    <span>{deliveryMethodLabels[locale][option]}</span>
                  </label>
                ))}
              </div>
            </div>
            {deliveryMethod === "port_delivery" ? (
              <label>
                <span>{text.port}</span>
                <select name="deliveryLocation" required>
                  {portOptions.map((port) => (
                    <option key={port} value={port}>{port}</option>
                  ))}
                </select>
              </label>
            ) : null}
            {deliveryMethod === "hotel_delivery" ? (
              <>
                <label>
                  <span>{text.hotelName}</span>
                  <input name="deliveryLocation" required />
                </label>
                <label>
                  <span>{text.deliveryNotes}</span>
                  <input name="deliveryNotes" />
                </label>
              </>
            ) : null}
            <label>
              <span>{text.firstName}</span>
              <input name="firstName" autoComplete="given-name" required />
            </label>
            <label>
              <span>{text.lastName}</span>
              <input name="lastName" autoComplete="family-name" required />
            </label>
            <label>
              <span>{text.email}</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              <span>{text.phone}</span>
              <input name="phone" type="tel" autoComplete="tel" required />
            </label>
            <label>
              <span>{text.startDate}</span>
              <input name="startDate" type="date" defaultValue={startDate} required />
            </label>
            <label>
              <span>{text.endDate}</span>
              <input name="endDate" type="date" defaultValue={endDate} required />
            </label>
            <label>
              <span>{text.pickupTime}</span>
              <input name="pickupTime" type="time" />
            </label>
            <label>
              <span>{text.language}</span>
              <select name="language" defaultValue={locale}>
                <option value="it">Italiano</option>
                <option value="en">English</option>
              </select>
            </label>
            <div className="booking-notes">
              <span>{text.paymentTitle}</span>
              <div className="booking-option-grid">
                {paymentTypeOptions.map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name="paymentType"
                      value={option}
                      checked={paymentType === option}
                      onChange={() => setPaymentType(option)}
                    />
                    <span>{paymentTypeLabels[locale][option]}</span>
                  </label>
                ))}
              </div>
            </div>
            <label>
              <span>{text.paymentMethod}</span>
              <select name="paymentMethod" defaultValue="unknown">
                {paymentMethodOptions.map((option) => (
                  <option key={option} value={option}>{paymentMethodLabels[locale][option]}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{text.paymentNotes}</span>
              <input name="paymentNotes" />
            </label>
            <div className="booking-message">{text.paymentNotice}</div>
            <label className="booking-notes">
              <span>{text.notes}</span>
              <textarea name="notes" rows={4} />
            </label>

            {status === "error" ? <div className="booking-message error">{text.error}</div> : null}

            <button className="booking-submit" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? text.sending : text.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
