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
      kicker: "Ischia",
      title: "Scopri Ischia<br>al tuo <em>ritmo.</em>",
      subtitle: "Con IschiaMotion scopri noleggi e servizi turistici a Ischia pensati per vivere l’isola con più libertà. Ti mettiamo in contatto con partner locali selezionati per scooter, auto, e-bike, gommoni e Beach Club.",
      cta: "Richiedi disponibilità →",
      secondary: "Come funziona"
    },
    trust: [
      ["200+", "Mezzi selezionati"],
      ["15+", "Punti di ritiro sull'isola"],
      ["✓", "Partner selezionati"],
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
      kicker: "Ischia",
      title: "Discover Ischia<br>at your own <em>pace.</em>",
      subtitle: "With IschiaMotion, you can discover rentals and travel services in Ischia designed to help you enjoy the island with more freedom. We connect you with selected local partners for scooters, cars, e-bikes, rubber dinghies and Beach Clubs.",
      cta: "Request availability →",
      secondary: "How it works"
    },
    trust: [
      ["200+", "Selected vehicles"],
      ["15+", "Pickup points on the island"],
      ["✓", "Selected partners"],
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
