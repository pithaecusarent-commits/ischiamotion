import type { Locale } from "@/lib/types";

export const dictionary = {
  it: {
    nav: {
      scooters: "Scooter",
      cars: "Auto",
      boats: "Barche",
      ebikes: "Bici elettriche",
      book: "Richiedi ora"
    },
    hero: {
      kicker: "Ischia · Procida · Vivara",
      title: "Scopri Ischia<br>al tuo<br><em>ritmo.</em>",
      subtitle: "Noleggia scooter, auto, bici elettriche e barche. Richiedi online in pochi secondi, ritira sull'isola e parti senza pensieri.",
      cta: "Trova il tuo mezzo →",
      secondary: "Come funziona"
    },
    trust: [
      ["200+", "Mezzi selezionati"],
      ["15+", "Punti di ritiro sull'isola"],
      ["4.9★", "Valutazione media clienti"],
      ["100%", "Richiesta guidata"]
    ],
    common: {
      from: "A partire da",
      day: "giorno",
      zone: "Zona",
      request: "Richiedi",
      all: "Tutti"
    }
  },
  en: {
    nav: {
      scooters: "Scooters",
      cars: "Cars",
      boats: "Boats",
      ebikes: "E-bikes",
      book: "Request now"
    },
    hero: {
      kicker: "Ischia · Procida · Vivara",
      title: "Discover Ischia<br>at your own<br><em>pace.</em>",
      subtitle: "Rent scooters, cars, e-bikes and boats. Request online in seconds, pick up on the island and start without stress.",
      cta: "Find your ride →",
      secondary: "How it works"
    },
    trust: [
      ["200+", "Selected vehicles"],
      ["15+", "Pickup points on the island"],
      ["4.9★", "Average guest rating"],
      ["100%", "Guided request"]
    ],
    common: {
      from: "From",
      day: "day",
      zone: "Zone",
      request: "Request",
      all: "All"
    }
  }
} satisfies Record<Locale, unknown>;

export function t(locale: Locale) {
  return dictionary[locale];
}
