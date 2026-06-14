"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { deliveryMethodLabels } from "@/lib/booking-labels";
import { TrustpilotReviewBox } from "@/components/site/TrustpilotReviewBox";
import { DELIVERY_PORTS, HOTEL_MUNICIPALITIES, isValidDeliveryPort, municipalityLabels, portLabels } from "@/lib/delivery-zones";
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
  initialPickupMunicipality?: string;
  initialPortSlug?: string;
  initialHotelMunicipality?: string;
  onClose: () => void;
};

const copy = {
  it: {
    title: "Richiesta disponibilità",
    subtitle: "Lascia i dettagli essenziali: IschiaMotion controlla l’opzione richiesta e ti ricontatta con disponibilità e prossimi passaggi.",
    firstName: "Nome",
    lastName: "Cognome",
    email: "Email",
    phone: "Telefono",
    startDate: "Data inizio",
    endDate: "Data fine",
    pickupTime: "Orario ritiro preferito",
    deliveryTitle: "Modalità di ritiro o consegna",
    port: "Porto",
    hotelMunicipality: "Comune",
    hotelName: "Nome hotel / struttura",
    deliveryNotes: "Note consegna opzionali",
    paymentNotice: "Eventuali acconti, saldi o pagamenti anticipati vengono definiti solo dopo la verifica della disponibilità con il partner locale.",
    notes: "Note",
    language: "Lingua di contatto",
    vehicle: "Opzione selezionata",
    pickupPoint: "Pickup point richiesto",
    submit: "Richiedi disponibilità",
    sending: "Invio in corso...",
    close: "Chiudi",
    success: "La tua richiesta è stata ricevuta. Ti ricontatteremo dopo la verifica della disponibilità con i partner locali.",
    error: "Non siamo riusciti a inviare la richiesta. Riprova tra poco.",
    mockBlocked: "Questa opzione dimostrativa non può essere richiesta. Prova a cambiare ricerca o contattaci su WhatsApp.",
    noPickupPoints: "Al momento i punti di ritiro non sono disponibili. Contattaci su WhatsApp per assistenza."
  },
  en: {
    title: "Availability request",
    subtitle: "Share the key details: IschiaMotion reviews the requested option and contacts you with availability and next steps.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    startDate: "Start date",
    endDate: "End date",
    pickupTime: "Preferred pickup time",
    deliveryTitle: "Pickup or delivery option",
    port: "Port",
    hotelMunicipality: "Municipality",
    hotelName: "Hotel / property name",
    deliveryNotes: "Optional delivery notes",
    paymentNotice: "Deposits, balances or prepayments are defined only after availability is reviewed with the local partner.",
    notes: "Notes",
    language: "Contact language",
    vehicle: "Selected option",
    pickupPoint: "Requested pickup point",
    submit: "Check availability",
    sending: "Sending...",
    close: "Close",
    success: "Your request has been received. We will contact you after availability has been reviewed with local partners.",
    error: "We could not send your request. Please try again shortly.",
    mockBlocked: "This demo option cannot be requested. Try changing your search or contact us on WhatsApp.",
    noPickupPoints: "Pickup points are currently unavailable. Contact us on WhatsApp for assistance."
  }
} satisfies Record<Locale, Record<string, string>>;

const deliveryOptions: BookingDeliveryMethod[] = ["pickup_point", "port_delivery", "hotel_delivery"];
function formatPickupLabel(point: PublicPickupPoint, locale: Locale) {
  const label = locale === "it" ? point.public_label_it : point.public_label_en;
  return label.replace(" - ", " — ");
}

export function BookingRequestModal({
  locale,
  vehicle,
  pickupPoints,
  startDate,
  endDate,
  initialDeliveryMethod,
  initialPickupMunicipality = "",
  initialPortSlug = "",
  initialHotelMunicipality = "",
  onClose
}: Props) {
  const text = copy[locale];
  const isNautical = isNauticalCategory(vehicle?.category);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [selectedPickupPointId, setSelectedPickupPointId] = useState(vehicle?.pickup_point_id || pickupPoints[0]?.id || "");
  const [deliveryMethod, setDeliveryMethod] = useState<BookingDeliveryMethod>(
    isNautical ? "pickup_point" : (initialDeliveryMethod || "pickup_point")
  );
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

    if (process.env.NODE_ENV === "production" && currentVehicle.source === "mock") {
      setStatus("error");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const pickupPoint = pickupPoints.find((point) => point.id === selectedPickupPointId) || pickupPoints[0];

    if (!pickupPoint) {
      setStatus("error");
      return;
    }

    const selectedDeliveryMethod: BookingDeliveryMethod = isNautical
      ? "pickup_point"
      : (String(formData.get("deliveryMethod") || "pickup_point") as BookingDeliveryMethod);
    const selectedPortSlug = selectedDeliveryMethod === "port_delivery"
      ? String(formData.get("portSlug") || initialPortSlug || DELIVERY_PORTS[0])
      : "";
    const selectedHotelMunicipality = selectedDeliveryMethod === "hotel_delivery"
      ? String(formData.get("hotelMunicipality") || initialHotelMunicipality || "")
      : "";
    const deliveryLocation = selectedDeliveryMethod === "pickup_point"
      ? formatPickupLabel(pickupPoint, locale)
      : selectedDeliveryMethod === "port_delivery"
        ? (isValidDeliveryPort(selectedPortSlug) ? portLabels[locale][selectedPortSlug] : "")
      : String(formData.get("deliveryLocation") || "");

    setStatus("submitting");

    try {
      const priceNote = currentVehicle.price_from > 0
        ? `Prezzo visto in ricerca: €${currentVehicle.price_from}/giorno`
        : "";
      const paymentNotes = priceNote;

      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
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
          pickupMunicipality: selectedDeliveryMethod === "pickup_point" ? initialPickupMunicipality : "",
          portSlug: selectedPortSlug,
          hotelMunicipality: selectedHotelMunicipality,
          deliveryNotes: String(formData.get("deliveryNotes") || ""),
          paymentType: "pay_on_pickup" as BookingPaymentType,
          paymentMethod: "unknown" as BookingPaymentMethod,
          paymentNotes,
          notes: String(formData.get("notes") || ""),
          vehicleId: currentVehicle.source === "supabase" ? currentVehicle.id : null,
          pickupPointId: currentVehicle.source === "supabase" ? currentVehicle.pickup_point_id || pickupPoint.id : null,
          vehicleLabel,
          pickupPointLabel: formatPickupLabel(pickupPoint, locale)
        })
      });

      if (!response.ok) {
        throw new Error("Booking request failed.");
      }

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
          <>
            <div className="booking-message success">{text.success}</div>
            <TrustpilotReviewBox locale={locale} compact />
          </>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit} data-ga-submit="submit_booking_request">
            {pickupPoints.length === 0 ? (
              <>
                <label>
                  <span>{text.vehicle}</span>
                  <input value={vehicleLabel} readOnly />
                </label>
                <div className="booking-message error">{text.noPickupPoints}</div>
              </>
            ) : (
              <div className="booking-row">
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
              </div>
            )}
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
                <select name="portSlug" defaultValue={initialPortSlug || DELIVERY_PORTS[0]} required>
                  {DELIVERY_PORTS.map((port) => (
                    <option key={port} value={port}>{portLabels[locale][port]}</option>
                  ))}
                </select>
              </label>
            ) : null}
            {deliveryMethod === "hotel_delivery" ? (
              <>
                <div className="booking-row">
                  <label>
                    <span>{text.hotelMunicipality}</span>
                    <select name="hotelMunicipality" defaultValue={initialHotelMunicipality || HOTEL_MUNICIPALITIES[0]} required>
                      {HOTEL_MUNICIPALITIES.map((m) => (
                        <option key={m} value={m}>{municipalityLabels[locale][m]}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>{text.hotelName}</span>
                    <input name="deliveryLocation" required />
                  </label>
                </div>
                <label>
                  <span>{text.deliveryNotes}</span>
                  <input name="deliveryNotes" />
                </label>
              </>
            ) : null}
            <div className="booking-row">
              <label>
                <span>{text.firstName}</span>
                <input name="firstName" autoComplete="given-name" required />
              </label>
              <label>
                <span>{text.lastName}</span>
                <input name="lastName" autoComplete="family-name" required />
              </label>
            </div>
            <div className="booking-row">
              <label>
                <span>{text.email}</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                <span>{text.phone}</span>
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
            </div>
            <div className="booking-row">
              <label>
                <span>{text.startDate}</span>
                <input name="startDate" type="date" defaultValue={startDate} required />
              </label>
              <label>
                <span>{text.endDate}</span>
                <input name="endDate" type="date" defaultValue={endDate} required />
              </label>
            </div>
            <div className="booking-row">
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
            </div>
            <div className="booking-message">{text.paymentNotice}</div>
            <label className="booking-notes">
              <span>{text.notes}</span>
              <textarea name="notes" rows={4} />
            </label>

            {status === "error" ? (
              <div className="booking-message error">
                {process.env.NODE_ENV === "production" && currentVehicle.source === "mock" ? text.mockBlocked : text.error}
              </div>
            ) : null}

            <button className="booking-submit" type="submit" disabled={status === "submitting" || pickupPoints.length === 0}>
              {status === "submitting" ? text.sending : text.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
