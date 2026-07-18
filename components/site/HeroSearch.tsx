"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingDeliveryMethod, Locale, VehicleFilter } from "@/lib/types";
import { DELIVERY_PORTS, HOTEL_MUNICIPALITIES, municipalityLabels, portLabels } from "@/lib/delivery-zones";
import { getSearchMode } from "@/lib/vehicle-categories";

const deliveryLabels: Record<Locale, Record<BookingDeliveryMethod, string>> = {
  it: {
    pickup_point: "Ritiro presso IschiaMotion Point partner",
    port_delivery: "Consegna al porto",
    hotel_delivery: "Consegna in hotel"
  },
  en: {
    pickup_point: "Pickup at an IschiaMotion partner point",
    port_delivery: "Port delivery",
    hotel_delivery: "Hotel delivery"
  }
};

const zoneLabels: Record<Locale, { pickup: string; hotel: string; placeholder: string }> = {
  it: { pickup: "Zona dell'IschiaMotion Point", hotel: "Comune hotel", placeholder: "-- Seleziona zona --" },
  en: { pickup: "IschiaMotion partner point area", hotel: "Hotel municipality", placeholder: "-- Select zone --" }
};

const secondFieldLabels: Record<Locale, { standard: string; nautical: string; beach_club: string }> = {
  it: { standard: "Modalità ritiro / consegna", nautical: "Porto di partenza", beach_club: "Località" },
  en: { standard: "Pickup / delivery", nautical: "Departure port", beach_club: "Location" }
};

const standardDeliveryOptions: BookingDeliveryMethod[] = ["pickup_point", "hotel_delivery"];

export function HeroSearch({
  locale,
  category,
  startDate,
  endDate,
  deliveryMethod,
  onCategoryChange,
  onStartDateChange,
  onEndDateChange,
  onDeliveryMethodChange
}: {
  locale: Locale;
  category: VehicleFilter;
  startDate: string;
  endDate: string;
  deliveryMethod: BookingDeliveryMethod;
  onCategoryChange: (value: VehicleFilter) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onDeliveryMethodChange: (value: BookingDeliveryMethod) => void;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pickupMunicipality, setPickupMunicipality] = useState("");
  const [portSlug, setPortSlug] = useState("");
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const searchMode = getSearchMode(category);

  // Boats/dinghies and Beach / Pool Club don't use the standard pickup/hotel toggle:
  // keep the underlying delivery_method on the DB-supported "pickup_point" value
  // (boats only support pickup at an IschiaMotion Point — enforced server-side)
  // while the visible field switches to the relevant zone selector instead.
  useEffect(() => {
    if (searchMode === "nautical") {
      if (deliveryMethod !== "pickup_point") onDeliveryMethodChange("pickup_point");
      setPickupMunicipality("");
    } else if (searchMode === "beach_club") {
      if (deliveryMethod !== "pickup_point") onDeliveryMethodChange("pickup_point");
      setPortSlug("");
      setPickupMunicipality("forio");
    } else {
      setPortSlug("");
    }
  }, [searchMode, deliveryMethod, onDeliveryMethodChange]);

  function handleStartDateChange(value: string) {
    onStartDateChange(value);
    if (endDate && endDate < value) onEndDateChange(value);
  }

  function handleDeliveryMethodChange(value: BookingDeliveryMethod) {
    onDeliveryMethodChange(value);
    setPickupMunicipality("");
  }

  function handleSearch() {
    if (!startDate || !endDate) {
      setError(locale === "it" ? "Seleziona data inizio e fine." : "Select start and end date.");
      return;
    }

    if (endDate < startDate) {
      setError(locale === "it" ? "La data fine deve essere successiva alla data inizio." : "End date must be after start date.");
      return;
    }

    if (searchMode === "nautical" && !portSlug) {
      setError(locale === "it" ? "Seleziona il porto di partenza." : "Select the departure port.");
      return;
    }

    const params = new URLSearchParams({
      category: category || "all",
      start: startDate,
      end: endDate,
      delivery_method: deliveryMethod
    });

    if (searchMode === "nautical") {
      if (portSlug) params.set("port_slug", portSlug);
    } else if (searchMode === "beach_club") {
      params.set("pickup_municipality", "forio");
    } else if (deliveryMethod === "pickup_point" && pickupMunicipality) {
      params.set("pickup_municipality", pickupMunicipality);
    } else if (deliveryMethod === "hotel_delivery" && pickupMunicipality) {
      params.set("hotel_municipality", pickupMunicipality);
    }

    router.push(`${locale === "it" ? "/it/risultati" : "/en/results"}?${params.toString()}`);
  }

  const zl = zoneLabels[locale];
  const secondLabel = secondFieldLabels[locale][searchMode];

  return (
    <div className="search-card" id="prenota">
      <div className="search-inner">
        <div className="search-topline">
          <div className="search-kicker">{locale === "it" ? "Verifica disponibilità e prezzo" : "Check availability and price"}</div>
          <div className="search-note">
            {locale === "it"
              ? "Indicaci date e zona del soggiorno: verifichiamo subito disponibilità, prezzo e punto di ritiro o consegna."
              : "Tell us your dates and area of stay: we instantly check availability, price and pickup or delivery point."}
          </div>
        </div>
        <div className="search-grid search-grid-2col">
          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Tipo di veicolo" : "Vehicle type"}</div>
            <select
              aria-label={locale === "it" ? "Tipo di veicolo" : "Vehicle type"}
              value={category}
              onChange={(event) => onCategoryChange(event.target.value as VehicleFilter)}
            >
              <option value="all">{locale === "it" ? "Tutti i veicoli" : "All vehicles"}</option>
              <option value="scooter">Scooter</option>
              <option value="auto">{locale === "it" ? "Auto" : "Car"}</option>
              <option value="bici">E-bike</option>
              <option value="gommone">{locale === "it" ? "Gommone" : "Rubber dinghy"}</option>
              <option value="barca">{locale === "it" ? "Barca" : "Boat"}</option>
              <option value="beach_club">Beach / Pool Club</option>
            </select>
          </div>
          <div className="s-field">
            <div className="search-label">{secondLabel}</div>
            {searchMode === "nautical" ? (
              <select
                aria-label={secondLabel}
                value={portSlug}
                onChange={(event) => setPortSlug(event.target.value)}
              >
                <option value="">{zl.placeholder}</option>
                {DELIVERY_PORTS.map((p) => (
                  <option key={p} value={p}>{portLabels[locale][p]}</option>
                ))}
              </select>
            ) : searchMode === "beach_club" ? (
              <select aria-label={secondLabel} value="forio" disabled>
                <option value="forio">{municipalityLabels[locale].forio}</option>
              </select>
            ) : (
              <select
                aria-label={secondLabel}
                value={deliveryMethod}
                onChange={(event) => handleDeliveryMethodChange(event.target.value as BookingDeliveryMethod)}
              >
                {standardDeliveryOptions.map((opt) => (
                  <option key={opt} value={opt}>{deliveryLabels[locale][opt]}</option>
                ))}
              </select>
            )}
          </div>

          {searchMode === "standard" && (
            <div className="s-field" style={{ gridColumn: "1 / -1" }}>
              <div className="search-label">{deliveryMethod === "hotel_delivery" ? zl.hotel : zl.pickup}</div>
              <select
                aria-label={deliveryMethod === "hotel_delivery" ? zl.hotel : zl.pickup}
                value={pickupMunicipality}
                onChange={(event) => setPickupMunicipality(event.target.value)}
              >
                <option value="">{zl.placeholder}</option>
                {HOTEL_MUNICIPALITIES.map((m) => (
                  <option key={m} value={m}>{municipalityLabels[locale][m]}</option>
                ))}
              </select>
            </div>
          )}

          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Data inizio" : "Start date"}</div>
            <input type="date" value={startDate} min={todayStr} onChange={(event) => handleStartDateChange(event.target.value)} aria-label={locale === "it" ? "Data inizio" : "Start date"} />
          </div>
          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Data fine" : "End date"}</div>
            <input type="date" value={endDate} min={startDate || todayStr} onChange={(event) => onEndDateChange(event.target.value)} aria-label={locale === "it" ? "Data fine" : "End date"} />
          </div>
        </div>
        {error ? <div className="booking-message error">{error}</div> : null}
        <button type="button" className="search-btn" onClick={handleSearch}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="white" strokeWidth="1.5" /><path d="M10.5 10.5L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
          {locale === "it" ? "Verifica disponibilità e prezzo" : "Check availability and price"}
        </button>
      </div>
    </div>
  );
}
