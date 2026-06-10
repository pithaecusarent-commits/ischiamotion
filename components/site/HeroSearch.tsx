"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingDeliveryMethod, Locale, VehicleFilter } from "@/lib/types";
import { DELIVERY_PORTS, HOTEL_MUNICIPALITIES, municipalityLabels, portLabels } from "@/lib/delivery-zones";

const deliveryLabels: Record<Locale, Record<BookingDeliveryMethod, string>> = {
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

const zoneLabels: Record<Locale, { pickup: string; port: string; hotel: string; placeholder: string }> = {
  it: { pickup: "Comune IschiaMotion Point", port: "Porto", hotel: "Comune hotel", placeholder: "-- Seleziona zona --" },
  en: { pickup: "IschiaMotion Point municipality", port: "Port", hotel: "Hotel municipality", placeholder: "-- Select zone --" }
};

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
  const [hotelMunicipality, setHotelMunicipality] = useState("");
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  function handleStartDateChange(value: string) {
    onStartDateChange(value);
    if (endDate && endDate < value) onEndDateChange(value);
  }

  function handleDeliveryMethodChange(value: BookingDeliveryMethod) {
    onDeliveryMethodChange(value);
    setPickupMunicipality("");
    setPortSlug("");
    setHotelMunicipality("");
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

    const params = new URLSearchParams({
      category: category || "all",
      start: startDate,
      end: endDate,
      delivery_method: deliveryMethod
    });

    if (deliveryMethod === "pickup_point" && pickupMunicipality) {
      params.set("pickup_municipality", pickupMunicipality);
    }
    if (deliveryMethod === "port_delivery" && portSlug) {
      params.set("port_slug", portSlug);
    }
    if (deliveryMethod === "hotel_delivery" && hotelMunicipality) {
      params.set("hotel_municipality", hotelMunicipality);
    }

    router.push(`${locale === "it" ? "/it/risultati" : "/en/results"}?${params.toString()}`);
  }

  const zl = zoneLabels[locale];

  return (
    <div className="search-card" id="prenota">
      <div className="search-inner">
        <div className="search-topline">
          <div className="search-kicker">{locale === "it" ? "Richiesta veloce" : "Quick online request"}</div>
          <div className="search-note">{locale === "it" ? "Richiesta online · conferma dopo verifica · ritiro sull'isola" : "Online request · confirmation after availability check · island pickup"}</div>
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
              <option value="beach_club">Beach Club</option>
            </select>
          </div>
          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Modalità ritiro / consegna" : "Pickup / delivery"}</div>
            <select
              aria-label={locale === "it" ? "Modalità ritiro o consegna" : "Pickup or delivery"}
              value={deliveryMethod}
              onChange={(event) => handleDeliveryMethodChange(event.target.value as BookingDeliveryMethod)}
            >
              {(["pickup_point", "port_delivery", "hotel_delivery"] as BookingDeliveryMethod[]).map((opt) => (
                <option key={opt} value={opt}>{deliveryLabels[locale][opt]}</option>
              ))}
            </select>
          </div>

          {deliveryMethod === "pickup_point" && (
            <div className="s-field" style={{ gridColumn: "1 / -1" }}>
              <div className="search-label">{zl.pickup}</div>
              <select
                aria-label={zl.pickup}
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

          {deliveryMethod === "port_delivery" && (
            <div className="s-field" style={{ gridColumn: "1 / -1" }}>
              <div className="search-label">{zl.port}</div>
              <select
                aria-label={zl.port}
                value={portSlug}
                onChange={(event) => setPortSlug(event.target.value)}
              >
                <option value="">{zl.placeholder}</option>
                {DELIVERY_PORTS.map((p) => (
                  <option key={p} value={p}>{portLabels[locale][p]}</option>
                ))}
              </select>
            </div>
          )}

          {deliveryMethod === "hotel_delivery" && (
            <div className="s-field" style={{ gridColumn: "1 / -1" }}>
              <div className="search-label">{zl.hotel}</div>
              <select
                aria-label={zl.hotel}
                value={hotelMunicipality}
                onChange={(event) => setHotelMunicipality(event.target.value)}
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
          {locale === "it" ? "Richiedi disponibilità" : "Request availability"}
        </button>
      </div>
    </div>
  );
}
