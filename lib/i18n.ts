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
      subtitle: "IschiaMotion è una piattaforma locale che ti aiuta a trovare scooter, auto, e-bike, gommoni e barche disponibili a Ischia tramite partner selezionati. Invia una richiesta di disponibilità e ricevi conferma dopo verifica.",
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
      subtitle: "IschiaMotion helps you find scooters, cars, e-bikes, rubber dinghies and boats in Ischia through selected local rental partners. Send an availability request and receive confirmation after review.",
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
