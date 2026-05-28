"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingDeliveryMethod, Locale, VehicleFilter } from "@/lib/types";

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
    router.push(`${locale === "it" ? "/it/risultati" : "/en/results"}?${params.toString()}`);
  }

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
              <option value="scooter">{locale === "it" ? "Scooter 125" : "125cc Scooter"}</option>
              <option value="auto">{locale === "it" ? "Auto" : "Car"}</option>
              <option value="bici">E-bike</option>
              <option value="gommone">{locale === "it" ? "Gommone" : "Rubber dinghy"}</option>
              <option value="barca">{locale === "it" ? "Barca" : "Boat"}</option>
              <option value="skipper">{locale === "it" ? "Barca con skipper" : "Boat with skipper"}</option>
            </select>
          </div>
          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Modalità ritiro / consegna" : "Pickup / delivery"}</div>
            <select
              aria-label={locale === "it" ? "Modalità ritiro o consegna" : "Pickup or delivery"}
              value={deliveryMethod}
              onChange={(event) => onDeliveryMethodChange(event.target.value as BookingDeliveryMethod)}
            >
              {(["pickup_point", "port_delivery", "hotel_delivery"] as BookingDeliveryMethod[]).map((opt) => (
                <option key={opt} value={opt}>{deliveryLabels[locale][opt]}</option>
              ))}
            </select>
          </div>
          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Data inizio" : "Start date"}</div>
            <input type="date" value={startDate} onChange={(event) => onStartDateChange(event.target.value)} aria-label={locale === "it" ? "Data inizio" : "Start date"} />
          </div>
          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Data fine" : "End date"}</div>
            <input type="date" value={endDate} onChange={(event) => onEndDateChange(event.target.value)} aria-label={locale === "it" ? "Data fine" : "End date"} />
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
