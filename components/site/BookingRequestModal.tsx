"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deliveryMethodLabels } from "@/lib/booking-labels";
import { DELIVERY_PORTS, HOTEL_MUNICIPALITIES, isValidDeliveryPort, municipalityLabels, portLabels } from "@/lib/delivery-zones";
import { getSearchMode, searchModeSummaryLabel } from "@/lib/vehicle-categories";
import { getWhatsAppUrl, resolveWhatsAppType } from "@/lib/whatsapp";
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
    title: "Ricevi disponibilità e prezzo in pochi minuti",
    subtitle: "Compila pochi dettagli sul tuo soggiorno: controlliamo subito le soluzioni disponibili con partner locali selezionati.",
    firstName: "Nome",
    lastName: "Cognome",
    email: "Email",
    phone: "Numero WhatsApp",
    startDate: "Data inizio",
    endDate: "Data fine",
    pickupTime: "Orario ritiro preferito",
    deliveryTitle: "Modalità di ritiro o consegna",
    port: "Porto",
    hotelMunicipality: "Comune",
    hotelName: "Nome hotel / struttura",
    hotelNamePlaceholder: "Es. Hotel a Forio, zona porto, Sant'Angelo…",
    deliveryNotes: "Note consegna opzionali",
    deliveryNotesPlaceholder: "Es. preferisco ritiro vicino hotel",
    paymentNotice: "Eventuali acconti, saldi o pagamenti anticipati ti vengono comunicati insieme alla proposta, dopo la verifica rapida con il partner locale.",
    afterSubmit: "Verifichiamo subito disponibilità, prezzo e condizioni con i partner locali: ricevi la proposta in pochi minuti negli orari operativi.",
    privacyPrefix: "Inviando la richiesta dichiari di aver letto la",
    notes: "Hai esigenze particolari?",
    notesPlaceholder: "Es. siamo 2 adulti e 1 bambino, arrivo al porto con 2 valigie…",
    language: "Lingua di contatto",
    vehicle: "Opzione selezionata",
    pickupPoint: "Pickup point richiesto",
    autoAssignedPoint: "Partner/punto operativo assegnato automaticamente",
    autoAssignedPointHelp: "Per la consegna in hotel selezioniamo automaticamente il partner compatibile migliore per date e zona.",
    submit: "Ricevi la tua proposta",
    sending: "Verifica in corso...",
    close: "Chiudi",
    unavailable: "Per queste date e zona serve un'altra soluzione: verifichiamo subito le opzioni disponibili o scrivici su WhatsApp.",
    rateLimited: "Abbiamo ricevuto troppe richieste in poco tempo. Riprova tra poco oppure scrivici su WhatsApp per una risposta rapida.",
    pastDates: "Le date selezionate non sono più disponibili. Scegli una data da oggi in poi.",
    error: "Errore temporaneo: la richiesta non è partita. Riprova tra poco oppure scrivici su WhatsApp per una risposta rapida.",
    mockBlocked: "Questa opzione dimostrativa non può essere richiesta. Prova a cambiare ricerca o scrivici su WhatsApp.",
    noPickupPoints: "Stiamo verificando i punti di ritiro disponibili: scrivici su WhatsApp per una risposta rapida.",
    whatsappFallback: "Chiedi un consiglio su WhatsApp",
    firstNameError: "Inserisci il tuo nome.",
    lastNameError: "Inserisci il tuo cognome.",
    emailError: "Inserisci un'email valida.",
    phoneError: "Inserisci un numero WhatsApp valido.",
    dateError: "Seleziona una data valida."
  },
  en: {
    title: "Get availability and price in minutes",
    subtitle: "Fill in a few details about your stay: we instantly check the available options with selected local partners.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "WhatsApp number",
    startDate: "Start date",
    endDate: "End date",
    pickupTime: "Preferred pickup time",
    deliveryTitle: "Pickup or delivery option",
    port: "Port",
    hotelMunicipality: "Municipality",
    hotelName: "Hotel / property name",
    hotelNamePlaceholder: "E.g. hotel in Forio, port area, Sant'Angelo…",
    deliveryNotes: "Optional delivery notes",
    deliveryNotesPlaceholder: "E.g. I prefer pickup near the hotel",
    paymentNotice: "Any deposit, balance or prepayment is shared with your proposal, after a quick review with the local partner.",
    afterSubmit: "We instantly check availability, price and conditions with local partners: you get the proposal within minutes during operating hours.",
    privacyPrefix: "By submitting the request, you confirm that you have read the",
    notes: "Any special needs?",
    notesPlaceholder: "E.g. 2 adults and 1 child, arriving at the port with 2 suitcases…",
    language: "Contact language",
    vehicle: "Selected option",
    pickupPoint: "Requested pickup point",
    autoAssignedPoint: "Partner / operating point assigned automatically",
    autoAssignedPointHelp: "For hotel delivery we automatically select the best compatible partner for your dates and area.",
    submit: "Get your proposal",
    sending: "Checking...",
    close: "Close",
    unavailable: "These dates and area need another option: we're checking availability right away, or message us on WhatsApp.",
    rateLimited: "We received too many requests in a short time. Please try again shortly or message us on WhatsApp for a fast reply.",
    pastDates: "The selected dates are no longer available. Choose a date from today onwards.",
    error: "Temporary error: your request didn't go through. Please try again shortly or message us on WhatsApp for a fast reply.",
    mockBlocked: "This demo option cannot be requested. Try changing your search or message us on WhatsApp.",
    noPickupPoints: "We're checking available pickup points: message us on WhatsApp for a fast reply.",
    whatsappFallback: "Ask for advice on WhatsApp",
    firstNameError: "Please enter your name.",
    lastNameError: "Please enter your last name.",
    emailError: "Please enter a valid email.",
    phoneError: "Please enter a valid WhatsApp number.",
    dateError: "Please select a valid date."
  }
} satisfies Record<Locale, Record<string, string>>;

const standardDeliveryOptions: BookingDeliveryMethod[] = ["pickup_point", "hotel_delivery"];
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

function withCustomValidity(message: string) {
  return {
    onInvalid: (event: FormEvent<HTMLInputElement>) => event.currentTarget.setCustomValidity(message),
    onChange: (event: FormEvent<HTMLInputElement>) => event.currentTarget.setCustomValidity("")
  };
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

    // Boats/dinghies and Beach / Pool Club always submit delivery_method = "pickup_point"
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

  const whatsappHref = getWhatsAppUrl(locale, resolveWhatsAppType(vehicle.category), {
    startDate,
    endDate,
    areaOrHotel: initialHotelMunicipality || initialPickupMunicipality || initialPortSlug,
    arrivalPoint: initialPortSlug || initialHotelMunicipality || initialPickupMunicipality,
    departureArea: initialPortSlug || initialPickupMunicipality,
    preferredArea: initialHotelMunicipality || initialPickupMunicipality
  });
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
                    <input name="deliveryLocation" placeholder={text.hotelNamePlaceholder} required />
                  </label>
                </div>
                <label>
                  <span>{text.deliveryNotes}</span>
                  <input name="deliveryNotes" placeholder={text.deliveryNotesPlaceholder} />
                </label>
              </>
            ) : null}
            <div className="booking-row">
              <label>
                <span>{text.firstName}</span>
                <input name="firstName" autoComplete="given-name" required {...withCustomValidity(text.firstNameError)} />
              </label>
              <label>
                <span>{text.lastName}</span>
                <input name="lastName" autoComplete="family-name" required {...withCustomValidity(text.lastNameError)} />
              </label>
            </div>
            <div className="booking-row">
              <label>
                <span>{text.email}</span>
                <input name="email" type="email" autoComplete="email" required {...withCustomValidity(text.emailError)} />
              </label>
              <label>
                <span>{text.phone}</span>
                <input name="phone" type="tel" autoComplete="tel" required {...withCustomValidity(text.phoneError)} />
              </label>
            </div>
            <div className="booking-row">
              <label>
                <span>{text.startDate}</span>
                <input name="startDate" type="date" defaultValue={startDate} required {...withCustomValidity(text.dateError)} />
              </label>
              <label>
                <span>{text.endDate}</span>
                <input name="endDate" type="date" defaultValue={endDate} required {...withCustomValidity(text.dateError)} />
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
              <textarea name="notes" rows={4} placeholder={text.notesPlaceholder} />
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
