"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Locale, PublicPickupPoint, PublicVehicle } from "@/lib/types";
import { createBookingRequest, generateBookingCode } from "@/lib/supabase/queries/bookings";

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

function formatPickupLabel(point: PublicPickupPoint, locale: Locale) {
  const label = locale === "it" ? point.public_label_it : point.public_label_en;
  return label.replace(" - ", " — ");
}

export function BookingRequestModal({ locale, vehicle, pickupPoints, startDate, endDate, onClose }: Props) {
  const text = copy[locale];
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [selectedPickupPointId, setSelectedPickupPointId] = useState(pickupPoints[0]?.id || "");
  const vehicleLabel = useMemo(() => {
    if (!vehicle) return "";
    return locale === "it" ? vehicle.title_it : vehicle.title_en;
  }, [locale, vehicle]);

  if (!vehicle) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const pickupPoint = pickupPoints.find((point) => point.id === selectedPickupPointId) || pickupPoints[0];

    if (!pickupPoint) {
      setStatus("error");
      return;
    }

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
        notes: String(formData.get("notes") || ""),
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
        <div className="section-eyebrow">{locale === "it" ? "Prenotazione" : "Booking"}</div>
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
