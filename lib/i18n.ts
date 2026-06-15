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
      title: "Noleggi ed esperienze<br><em>a Ischia.</em>",
      subtitle: "Scopri l’isola al tuo ritmo: richiedi disponibilità per scooter, auto, e-bike, barche e beach club con partner locali selezionati.",
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
      title: "Rentals and experiences<br><em>in Ischia.</em>",
      subtitle: "Discover the island at your own pace: request availability for scooters, cars, e-bikes, boats and beach clubs with selected local partners.",
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
