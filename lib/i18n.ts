import type { Locale } from "@/lib/types";

export const dictionary = {
  it: {
    nav: {
      scooters: "Scooter",
      cars: "Auto",
      boats: "Barche",
      ebikes: "Bici elettriche",
      book: "Prenota ora"
    },
    hero: {
      kicker: "Ischia · Procida · Vivara",
      title: "Scopri Ischia<br>al tuo<br><em>ritmo.</em>",
      subtitle: "Noleggia scooter, auto, bici elettriche e barche. Prenota online in pochi secondi, ritira sull'isola e parti senza pensieri.",
      cta: "Trova il tuo mezzo →",
      secondary: "Come funziona"
    },
    trust: [
      ["200+", "Veicoli disponibili"],
      ["15+", "Punti di ritiro sull'isola"],
      ["4.9★", "Valutazione media clienti"],
      ["100%", "Prenotazione garantita"]
    ],
    common: {
      from: "da",
      day: "giorno",
      zone: "Zona",
      request: "Prenota",
      all: "Tutti"
    }
  },
  en: {
    nav: {
      scooters: "Scooters",
      cars: "Cars",
      boats: "Boats",
      ebikes: "E-bikes",
      book: "Book now"
    },
    hero: {
      kicker: "Ischia · Procida · Vivara",
      title: "Discover Ischia<br>at your own<br><em>pace.</em>",
      subtitle: "Rent scooters, cars, e-bikes and boats. Book online in seconds, pick up on the island and start without stress.",
      cta: "Find your ride →",
      secondary: "How it works"
    },
    trust: [
      ["200+", "Available vehicles"],
      ["15+", "Pickup points on the island"],
      ["4.9★", "Average guest rating"],
      ["100%", "Guaranteed booking"]
    ],
    common: {
      from: "from",
      day: "day",
      zone: "Zone",
      request: "Book",
      all: "All"
    }
  }
} satisfies Record<Locale, unknown>;

export function t(locale: Locale) {
  return dictionary[locale];
}
