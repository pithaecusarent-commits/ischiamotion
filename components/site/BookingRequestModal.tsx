"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { deliveryMethodLabels, paymentMethodLabels, paymentTypeLabels } from "@/lib/booking-labels";
import { createBookingRequest, generateBookingCode } from "@/lib/supabase/queries/bookings";
import { isNauticalCategory } from "@/lib/vehicle-categories";
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
  initialDeliveryMethod?: BookingDeliveryMethod | null;
  onClose: () => void;
};

const copy = {
  it: {
    title: "Richiesta disponibilità",
    subtitle: "Compila i dati: IschiaMotion verifica l’opzione con il partner locale selezionato e ti ricontatta.",
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
    paymentNotice: "Eventuali acconti, saldi o pagamenti anticipati vengono definiti solo dopo la verifica della disponibilità con il partner locale.",
    notes: "Note",
    language: "Lingua cliente",
    vehicle: "Opzione selezionata",
    pickupPoint: "Pickup point richiesto",
    submit: "Invia richiesta",
    sending: "Invio in corso...",
    close: "Chiudi",
    success: "Richiesta ricevuta. Verifichiamo disponibilità e dettagli con il partner locale, poi ti ricontattiamo.",
    error: "Non siamo riusciti a inviare la richiesta. Riprova tra poco."
  },
  en: {
    title: "Availability request",
    subtitle: "Fill in your details: IschiaMotion checks the option with the selected local partner and contacts you.",
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
    paymentNotice: "Deposits, balances or prepayments are defined only after availability is reviewed with the local partner.",
    notes: "Notes",
    language: "Customer language",
    vehicle: "Selected option",
    pickupPoint: "Requested pickup point",
    submit: "Send request",
    sending: "Sending...",
    close: "Close",
    success: "Request received. We check availability and details with the local partner, then contact you.",
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

export function BookingRequestModal({ locale, vehicle, pickupPoints, startDate, endDate, initialDeliveryMethod, onClose }: Props) {
  const text = copy[locale];
  const isNautical = isNauticalCategory(vehicle?.category);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [selectedPickupPointId, setSelectedPickupPointId] = useState(vehicle?.pickup_point_id || pickupPoints[0]?.id || "");
  const [deliveryMethod, setDeliveryMethod] = useState<BookingDeliveryMethod>(
    isNautical ? "pickup_point" : (initialDeliveryMethod || "pickup_point")
  );
  const [paymentType, setPaymentType] = useState<BookingPaymentType>("pay_on_pickup");
  const vehicleLabel = useMemo(() => {
    if (!vehicle) return "";
    return locale === "it" ? vehicle.title_it : vehicle.title_en;
  }, [locale, vehicle]);

  useEffect(() => {
    setSelectedPickupPointId(vehicle?.pickup_point_id || pickupPoints[0]?.id || "");
    setDeliveryMethod(isNautical ? "pickup_point" : (initialDeliveryMethod || "pickup_point"));
    setStatus("idle");
  }, [initialDeliveryMethod, isNautical, pickupPoints, vehicle]);

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

    const selectedDeliveryMethod: BookingDeliveryMethod = isNautical
      ? "pickup_point"
      : (String(formData.get("deliveryMethod") || "pickup_point") as BookingDeliveryMethod);
    const deliveryLocation = selectedDeliveryMethod === "pickup_point"
      ? formatPickupLabel(pickupPoint, locale)
      : String(formData.get("deliveryLocation") || "");

    setStatus("submitting");

    try {
      const userPaymentNotes = String(formData.get("paymentNotes") || "");
      const priceNote = currentVehicle.price_from > 0
        ? `Prezzo visto in ricerca: €${currentVehicle.price_from}/giorno`
        : "";
      const paymentNotes = [priceNote, userPaymentNotes].filter(Boolean).join("\n");

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
        paymentNotes,
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
            {isNautical ? (
              <label>
                <span>{text.deliveryTitle}</span>
                <input value={deliveryMethodLabels[locale].pickup_point} readOnly />
                <input type="hidden" name="deliveryMethod" value="pickup_point" />
              </label>
            ) : initialDeliveryMethod ? (
              <label>
                <span>{text.deliveryTitle}</span>
                <input value={deliveryMethodLabels[locale][initialDeliveryMethod]} readOnly />
                <input type="hidden" name="deliveryMethod" value={initialDeliveryMethod} />
              </label>
            ) : (
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
            )}
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
