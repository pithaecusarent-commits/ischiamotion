"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deliveryMethodLabels } from "@/lib/booking-labels";
import { DELIVERY_PORTS, HOTEL_MUNICIPALITIES, isValidDeliveryPort, municipalityLabels, portLabels } from "@/lib/delivery-zones";
import { getSearchMode, searchModeSummaryLabel } from "@/lib/vehicle-categories";
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
    subtitle: "Lascia i dettagli essenziali: IschiaMotion verifica disponibilità, prezzo e condizioni con i partner locali prima di ricontattarti.",
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
    afterSubmit: "Ti ricontattiamo dopo aver verificato disponibilità, prezzo e condizioni.",
    privacyPrefix: "Inviando la richiesta dichiari di aver letto la",
    notes: "Note",
    language: "Lingua di contatto",
    vehicle: "Opzione selezionata",
    pickupPoint: "Pickup point richiesto",
    autoAssignedPoint: "Partner/punto operativo assegnato automaticamente",
    autoAssignedPointHelp: "Per la consegna in hotel selezioniamo automaticamente il partner compatibile migliore per date e zona.",
    submit: "Invia richiesta",
    sending: "Invio in corso...",
    close: "Chiudi",
    unavailable: "Questa offerta non è più disponibile per date e zona selezionate. Cambia ricerca oppure scrivici su WhatsApp.",
    rateLimited: "Abbiamo ricevuto troppe richieste in poco tempo. Riprova più tardi oppure scrivici su WhatsApp.",
    pastDates: "Le date selezionate non sono più disponibili. Scegli una data da oggi in poi.",
    error: "Errore temporaneo: non siamo riusciti a inviare la richiesta. Riprova tra poco oppure scrivici su WhatsApp.",
    mockBlocked: "Questa opzione dimostrativa non può essere richiesta. Prova a cambiare ricerca o contattaci su WhatsApp.",
    noPickupPoints: "Al momento i punti di ritiro non sono disponibili. Chiedi supporto su WhatsApp per assistenza.",
    whatsappFallback: "Chiedi supporto su WhatsApp"
  },
  en: {
    title: "Availability request",
    subtitle: "Share the key details: IschiaMotion checks availability, price and conditions with local partners before contacting you.",
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
    afterSubmit: "We’ll contact you after checking availability, price and conditions.",
    privacyPrefix: "By submitting the request, you confirm that you have read the",
    notes: "Notes",
    language: "Contact language",
    vehicle: "Selected option",
    pickupPoint: "Requested pickup point",
    autoAssignedPoint: "Partner / operating point assigned automatically",
    autoAssignedPointHelp: "For hotel delivery we automatically select the best compatible partner for your dates and area.",
    submit: "Send request",
    sending: "Sending...",
    close: "Close",
    unavailable: "This offer is no longer available for the selected dates and area. Change your search or message us on WhatsApp.",
    rateLimited: "We received too many requests in a short time. Please try again later or message us on WhatsApp.",
    pastDates: "The selected dates are no longer available. Choose a date from today onwards.",
    error: "Temporary error: we could not send your request. Please try again shortly or message us on WhatsApp.",
    mockBlocked: "This demo option cannot be requested. Try changing your search or contact us on WhatsApp.",
    noPickupPoints: "Pickup points are currently unavailable. Ask for help on WhatsApp.",
    whatsappFallback: "Ask for help on WhatsApp"
  }
} satisfies Record<Locale, Record<string, string>>;

const standardDeliveryOptions: BookingDeliveryMethod[] = ["pickup_point", "hotel_delivery"];
const whatsappMessages: Record<Locale, string> = {
  it: "Ciao IschiaMotion, ho avuto un problema durante la richiesta online e vorrei supporto per scegliere la soluzione giusta.",
  en: "Hello IschiaMotion, I had an issue with the online request and would like help choosing the right option."
};

function formatPickupLabel(point: PublicPickupPoint, locale: Locale) {
  const label = locale === "it" ? point.public_label_it : point.public_label_en;
  return label.replace(" - ", " — ");
}

function errorMessageFor(code: string | undefined, text: Record<string, string>) {
  if (code === "OFFER_UNAVAILABLE") return text.unavailable;
  if (code === "RATE_LIMITED") return text.rateLimited;
  if (code === "PAST_DATES" || code === "INVALID_DATES") return text.pastDates;
  return text.error;
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
  const router = useRouter();
  const searchMode = getSearchMode(vehicle?.category);
  const isNautical = searchMode === "nautical";
  const isBeachClub = searchMode === "beach_club";
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPickupPointId, setSelectedPickupPointId] = useState(vehicle?.pickup_point_id || pickupPoints[0]?.id || "");
  const [deliveryMethod, setDeliveryMethod] = useState<BookingDeliveryMethod>(
    isNautical || isBeachClub ? "pickup_point" : (initialDeliveryMethod || "pickup_point")
  );
  const [selectedPortSlug, setSelectedPortSlug] = useState(initialPortSlug || DELIVERY_PORTS[0]);
  const vehicleLabel = useMemo(() => {
    if (!vehicle) return "";
    return locale === "it" ? vehicle.title_it : vehicle.title_en;
  }, [locale, vehicle]);

  useEffect(() => {
    setSelectedPickupPointId(vehicle?.pickup_point_id || pickupPoints[0]?.id || "");
    setDeliveryMethod(isNautical || isBeachClub ? "pickup_point" : (initialDeliveryMethod || "pickup_point"));
    setSelectedPortSlug(initialPortSlug || DELIVERY_PORTS[0]);
    setStatus("idle");
    setErrorMessage("");
  }, [initialDeliveryMethod, initialPortSlug, isNautical, isBeachClub, pickupPoints, vehicle]);

  if (!vehicle) return null;
  const currentVehicle = vehicle;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (process.env.NODE_ENV === "production" && currentVehicle.source === "mock") {
      setStatus("error");
      setErrorMessage(text.mockBlocked);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const pickupPoint = pickupPoints.find((point) => point.id === selectedPickupPointId) || pickupPoints[0];

    if (!pickupPoint) {
      setStatus("error");
      setErrorMessage(text.noPickupPoints);
      return;
    }

    // Boats/dinghies and Beach Club always submit delivery_method = "pickup_point"
    // (the only method the backend currently allows for those categories). The
    // chosen port / fixed location is still recorded as readable text below.
    const selectedDeliveryMethod: BookingDeliveryMethod = isNautical || isBeachClub
      ? "pickup_point"
      : (String(formData.get("deliveryMethod") || "pickup_point") as BookingDeliveryMethod);
    const portSlugForRequest = isNautical
      ? String(formData.get("portSlug") || selectedPortSlug || DELIVERY_PORTS[0])
      : "";
    const selectedHotelMunicipality = selectedDeliveryMethod === "hotel_delivery"
      ? String(formData.get("hotelMunicipality") || initialHotelMunicipality || "")
      : "";
    const deliveryLocation = isNautical
      ? (isValidDeliveryPort(portSlugForRequest) ? portLabels[locale][portSlugForRequest] : "")
      : isBeachClub
        ? municipalityLabels[locale].forio
        : selectedDeliveryMethod === "pickup_point"
          ? formatPickupLabel(pickupPoint, locale)
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
          pickupMunicipality: isBeachClub
            ? "forio"
            : (selectedDeliveryMethod === "pickup_point" ? initialPickupMunicipality : ""),
          portSlug: portSlugForRequest,
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
        const errorPayload = await response.json().catch(() => null) as { code?: string } | null;
        setErrorMessage(errorMessageFor(errorPayload?.code, text));
        setStatus("error");
        return;
      }

      const result = await response.json().catch(() => null) as { bookingCode?: string } | null;
      const confirmationParams = new URLSearchParams({
        code: result?.bookingCode || "",
        vehicle: vehicleLabel,
        start: String(formData.get("startDate") || ""),
        end: String(formData.get("endDate") || ""),
        delivery_method: selectedDeliveryMethod,
        delivery_location: deliveryLocation
      });
      router.push(`${locale === "it" ? "/it/richiesta-ricevuta" : "/en/request-received"}?${confirmationParams.toString()}`);
    } catch {
      setErrorMessage(text.error);
      setStatus("error");
    }
  }

  const whatsappHref = `https://wa.me/393296856370?text=${encodeURIComponent(whatsappMessages[locale])}`;
  const shouldShowOperationalPoint = deliveryMethod === "hotel_delivery";

  return (
    <div className="booking-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <div className="booking-modal">
        <button className="booking-close" type="button" onClick={onClose} aria-label={text.close}>×</button>
        <div className="section-eyebrow">{locale === "it" ? "Richiesta" : "Request"}</div>
        <h2 id="booking-modal-title">{text.title}</h2>
        <p className="booking-intro">{text.subtitle}</p>

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
                {shouldShowOperationalPoint ? (
                  <label>
                    <span>{text.autoAssignedPoint}</span>
                    <input value={text.autoAssignedPointHelp} readOnly />
                  </label>
                ) : (
                  <label>
                    <span>{text.pickupPoint}</span>
                    <select value={selectedPickupPointId} onChange={(event) => setSelectedPickupPointId(event.target.value)} required>
                      {pickupPoints.map((point) => (
                        <option key={point.id} value={point.id}>{formatPickupLabel(point, locale)}</option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            )}
            {isNautical ? (
              <label>
                <span>{searchModeSummaryLabel(searchMode, locale)}</span>
                <select
                  name="portSlug"
                  value={selectedPortSlug}
                  onChange={(event) => setSelectedPortSlug(event.target.value)}
                  required
                >
                  {DELIVERY_PORTS.map((port) => (
                    <option key={port} value={port}>{portLabels[locale][port]}</option>
                  ))}
                </select>
                <input type="hidden" name="deliveryMethod" value="pickup_point" />
              </label>
            ) : isBeachClub ? (
              <label>
                <span>{searchModeSummaryLabel(searchMode, locale)}</span>
                <input value={municipalityLabels[locale].forio} readOnly />
                <input type="hidden" name="deliveryMethod" value="pickup_point" />
              </label>
            ) : initialDeliveryMethod ? (
              <label>
                <span>{searchModeSummaryLabel(searchMode, locale)}</span>
                <input value={deliveryMethodLabels[locale][initialDeliveryMethod]} readOnly />
                <input type="hidden" name="deliveryMethod" value={initialDeliveryMethod} />
              </label>
            ) : (
              <div className="booking-notes">
                <span>{searchModeSummaryLabel(searchMode, locale)}</span>
                <div className="booking-option-grid">
                  {standardDeliveryOptions.map((option) => (
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
                {errorMessage || text.error}{" "}
                <a className="font-bold underline" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  {text.whatsappFallback}
                </a>
              </div>
            ) : null}

            <p className="booking-notes text-sm leading-6 text-ink/60">
              {text.afterSubmit}{" "}
              {text.privacyPrefix}{" "}
              <a className="font-bold text-green-deep hover:text-ink" href={locale === "it" ? "/it/privacy" : "/en/privacy"} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>.
            </p>
            <button className="booking-submit" type="submit" disabled={status === "submitting" || pickupPoints.length === 0}>
              {status === "submitting" ? text.sending : text.submit}
            </button>
          </form>
      </div>
    </div>
  );
}
