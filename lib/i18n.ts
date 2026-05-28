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
      subtitle: "IschiaMotion è un punto unico per richiedere scooter, auto, e-bike, gommoni e barche a Ischia tramite una rete di partner selezionati. Indica date e preferenze: ti ricontattiamo dopo il controllo della disponibilità.",
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
      subtitle: "IschiaMotion is a single local point to request scooters, cars, e-bikes, rubber dinghies, RIBs and boats in Ischia through selected partners. Share dates and preferences: we contact you after availability is reviewed.",
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
