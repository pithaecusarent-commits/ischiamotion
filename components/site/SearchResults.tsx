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
      ? "Nessuna soluzione immediatamente disponibile per questa zona. Inviaci comunque la richiesta: verificheremo eventuali alternative con i nostri partner locali."
      : "No solution immediately available for this zone. Send us your request anyway: we will check possible alternatives with our local partners.")
    : (locale === "it"
      ? "Al momento non ci sono mezzi disponibili per questa ricerca. Prova a cambiare date o categoria."
      : "No vehicles are currently available for this search. Try changing dates or category.");

  return (
    <>
      <section className="section reveal visible" id="veicoli">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">{locale === "it" ? "Risultati ricerca" : "Search results"}</div>
            <h1 className="section-title">{locale === "it" ? "Opzioni da verificare" : "Options to review"}</h1>
            <p className="mt-3 text-ink/60">
              {categoryLabels[locale][category]} · {startDate || "-"} / {endDate || "-"}
            </p>
          </div>
          <a href={`/${locale}#prenota`} className="see-all">{locale === "it" ? "Modifica ricerca →" : "Change search →"}</a>
        </div>

        {isFallback ? (
          <div className="mb-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink/70">
            {locale === "it"
              ? "Stiamo mostrando esempi generici: la disponibilità effettiva viene verificata con i partner locali."
              : "Showing generic examples: actual availability is reviewed with local partners."}
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
                              ? "Prezzo indicativo: varia per periodo, durata, disponibilità e condizioni partner."
                              : "Indicative price: may vary by season, length, availability and partner conditions."}
                          </p>
                        ) : null}
                      </div>
                      <button className="book-btn" type="button" onClick={(event) => {
                        event.stopPropagation();
                        selectVehicle(vehicle);
                      }}>
                        {locale === "it" ? "Richiedi verifica" : "Request review"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-ink/10 bg-white/75 p-8 text-center shadow-card">
            <h2 className="font-serif text-3xl font-bold">{locale === "it" ? "Nessun risultato" : "No results"}</h2>
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
