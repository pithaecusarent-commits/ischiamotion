"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { BookingRequestModal } from "@/components/site/BookingRequestModal";
import { getCategoryLandingPath } from "@/lib/category-landing-paths";
import { t } from "@/lib/i18n";
import type { BookingDeliveryMethod, Locale, PublicPickupPoint, PublicVehicle, VehicleFilter } from "@/lib/types";

const categoryLabels: Record<Locale, Record<VehicleFilter, string>> = {
  it: {
    all: "Tutti i veicoli",
    scooter: "Scooter 125",
    auto: "Auto",
    bici: "E-bike",
    gommone: "Gommone",
    barca: "Barca",
    beach_club: "Beach Club"
  },
  en: {
    all: "All vehicles",
    scooter: "125cc Scooter",
    auto: "Car",
    bici: "E-bike",
    gommone: "Rubber dinghy",
    barca: "Boat",
    beach_club: "Beach Club"
  }
};

type Props = {
  locale: Locale;
  vehicles: PublicVehicle[];
  pickupPoints: PublicPickupPoint[];
  category: VehicleFilter;
  startDate: string;
  endDate: string;
  deliveryMethod: BookingDeliveryMethod | null;
  pickupMunicipality: string;
  portSlug: string;
  hotelMunicipality: string;
  isFallback: boolean;
  hasZoneFilter?: boolean;
};

export function SearchResults({
  locale,
  vehicles,
  pickupPoints,
  category,
  startDate,
  endDate,
  deliveryMethod,
  pickupMunicipality,
  portSlug,
  hotelMunicipality,
  isFallback,
  hasZoneFilter = false
}: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState<PublicVehicle | null>(null);
  const selectVehicle = (vehicle: PublicVehicle) => setSelectedVehicle(vehicle);
  const openLanding = (vehicle: PublicVehicle) => {
    window.location.href = getCategoryLandingPath(locale, vehicle.category);
  };
  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>, vehicle: PublicVehicle) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLanding(vehicle);
    }
  };
  const emptyText = hasZoneFilter
    ? (locale === "it"
      ? "Verifichiamo subito le soluzioni disponibili per questa zona: invia la richiesta e controlliamo le alternative con i nostri partner locali."
      : "We're checking the available options for this area right away: send your request and we'll check alternatives with our local partners.")
    : (locale === "it"
      ? "Le opzioni vengono controllate in tempo reale con i partner locali. Prova a cambiare date o categoria per vedere altre soluzioni disponibili."
      : "Options are checked in real time with local partners. Try changing dates or category to see other available options.");

  return (
    <>
      <section className="section reveal visible" id="veicoli">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">{locale === "it" ? "Risultati ricerca" : "Search results"}</div>
            <h1 className="section-title">{locale === "it" ? "Stiamo cercando la soluzione migliore per te" : "We're finding the best option for you"}</h1>
            <p className="mt-3 text-ink/60">
              {categoryLabels[locale][category]} · {startDate || "-"} / {endDate || "-"}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
              {locale === "it"
                ? "Abbiamo ricevuto le tue preferenze. Verifichiamo subito disponibilità, prezzo e condizioni con i partner locali."
                : "We've received your preferences. We instantly check availability, price and conditions with local partners."}
            </p>
          </div>
          <a href={`/${locale}#prenota`} className="see-all">{locale === "it" ? "Modifica ricerca →" : "Change search →"}</a>
        </div>

        {isFallback ? (
          <div className="mb-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {locale === "it"
              ? "Stiamo mostrando esempi generici: invia le tue date e verifichiamo subito la disponibilità reale con i partner locali."
              : "Showing generic examples: send your dates and we'll check real availability with local partners right away."}
          </div>
        ) : null}

        {vehicles.length > 0 ? (
          <div className="results-grid">
            {vehicles.map((vehicle) => {
              const title = locale === "it" ? vehicle.title_it : vehicle.title_en;
              const location = locale === "it" ? vehicle.location_it : vehicle.location_en;
              const features = locale === "it" ? vehicle.features_it : vehicle.features_en;
              return (
                <article
                  className="result-card"
                  key={vehicle.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => openLanding(vehicle)}
                  onKeyDown={(event) => handleCardKeyDown(event, vehicle)}
                  aria-label={locale === "it" ? `Apri landing: ${title}` : `Open landing: ${title}`}
                >
                  <div className="result-media">
                    {vehicle.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={vehicle.image_url} alt={title} />
                    ) : (
                      <span>{vehicle.emoji}</span>
                    )}
                  </div>
                  <div className="result-body">
                    <div className="vcard-type">{categoryLabels[locale][vehicle.category]}</div>
                    <h2>{title}</h2>
                    <p className="vcard-loc">📍 {location}</p>
                    <div className="vcard-features">
                      {features.slice(0, 3).map((feature) => <span className="feature" key={feature}>{feature}</span>)}
                    </div>
                    <div className="result-foot">
                      <div>
                        <div className="vcard-price">
                          {vehicle.price_from > 0 ? (
                            <><small>{t(locale).common.from}</small> €{vehicle.price_from} <small>/ {t(locale).common.day}</small></>
                          ) : (
                            <small>{locale === "it" ? "Su richiesta" : "On request"}</small>
                          )}
                        </div>
                        {vehicle.price_from > 0 ? (
                          <p className="vcard-price-note">
                            {locale === "it"
                              ? "Invia le date e ricevi in pochi minuti il prezzo aggiornato e le condizioni della soluzione disponibile."
                              : "Send your dates and get the updated price and conditions within minutes."}
                          </p>
                        ) : null}
                      </div>
                      <button className="book-btn" type="button" onClick={(event) => {
                        event.stopPropagation();
                        selectVehicle(vehicle);
                      }}>
                        {locale === "it" ? "Richiedi questo mezzo" : "Request this option"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-ink/10 bg-white/75 p-8 text-center shadow-card">
            <h2 className="font-serif text-3xl font-bold">{locale === "it" ? "Verifichiamo subito le soluzioni disponibili" : "We're checking available options right now"}</h2>
            <p className="mt-3 text-ink/60">{emptyText}</p>
          </div>
        )}
      </section>

      <BookingRequestModal
        locale={locale}
        vehicle={selectedVehicle}
        pickupPoints={pickupPoints}
        startDate={startDate}
        endDate={endDate}
        initialDeliveryMethod={deliveryMethod}
        initialPickupMunicipality={pickupMunicipality}
        initialPortSlug={portSlug}
        initialHotelMunicipality={hotelMunicipality}
        onClose={() => setSelectedVehicle(null)}
      />
    </>
  );
}
