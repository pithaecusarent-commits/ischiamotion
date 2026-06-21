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
      title: "Noleggio a Ischia<br><em>per vivere l’isola.</em>",
      subtitle: "Confronta soluzioni di noleggio mezzi a Ischia: scooter, auto, e-bike, gommoni e barche tramite partner locali selezionati.",
      cta: "Richiedi disponibilità →",
      secondary: "Come funziona"
    },
    trust: [
      ["✓", "Soluzioni per diverse esigenze"],
      ["✓", "Punti di ritiro sull'isola"],
      ["✓", "Partner selezionati"],
      ["✓", "Richiesta guidata"]
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
      title: "Vehicle rental in Ischia<br><em>for exploring the island.</em>",
      subtitle: "Compare rental options in Ischia for scooters, cars, e-bikes, rubber dinghies and boats through selected local partners.",
      cta: "Request availability →",
      secondary: "How it works"
    },
    trust: [
      ["✓", "Options for different needs"],
      ["✓", "Pickup points on the island"],
      ["✓", "Selected partners"],
      ["✓", "Guided request"]
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
