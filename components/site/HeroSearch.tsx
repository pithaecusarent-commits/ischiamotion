import type { Locale } from "@/lib/types";

export function HeroSearch({ locale }: { locale: Locale }) {
  return (
    <div className="search-card" id="prenota">
      <div className="search-inner">
        <div className="search-topline">
          <div className="search-kicker">{locale === "it" ? "Disponibilita' immediata" : "Instant availability"}</div>
          <div className="search-note">{locale === "it" ? "Prezzi chiari · conferma veloce · ritiro sull'isola" : "Clear prices · fast confirmation · island pickup"}</div>
        </div>
        <div className="search-grid">
          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Tipo di veicolo" : "Vehicle type"}</div>
            <select aria-label={locale === "it" ? "Tipo di veicolo" : "Vehicle type"}>
              <option>{locale === "it" ? "Tutti i veicoli" : "All vehicles"}</option>
              <option>Scooter & Moto</option>
              <option>{locale === "it" ? "Auto" : "Cars"}</option>
              <option>{locale === "it" ? "Barche & Gommoni" : "Boats & RIBs"}</option>
              <option>{locale === "it" ? "Bici elettriche" : "E-bikes"}</option>
            </select>
          </div>
          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Data inizio" : "Start date"}</div>
            <input type="date" defaultValue="2026-06-15" aria-label={locale === "it" ? "Data inizio" : "Start date"} />
          </div>
          <div className="s-field">
            <div className="search-label">{locale === "it" ? "Data fine" : "End date"}</div>
            <input type="date" defaultValue="2026-06-20" aria-label={locale === "it" ? "Data fine" : "End date"} />
          </div>
        </div>
        <button type="button" className="search-btn" onClick={() => document.querySelector("#prenota")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="white" strokeWidth="1.5" /><path d="M10.5 10.5L13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
          {locale === "it" ? "Cerca veicoli disponibili" : "Search available vehicles"}
        </button>
      </div>
    </div>
  );
}
