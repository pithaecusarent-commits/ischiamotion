import type { Locale } from "@/lib/types";

export const dictionary = {
  it: {
    nav: {
      scooters: "Scooter",
      cars: "Auto",
      boats: "Barche",
      ebikes: "Bici elettriche",
      book: "Trova la soluzione giusta"
    },
    hero: {
      kicker: "Ischia",
      title: "Muoviti a Ischia senza perdere tempo tra mille noleggiatori.",
      subtitle: "Scooter, auto, e-bike, gommoni, barche e beach club tramite partner locali selezionati. Dicci dove soggiorni, quando arrivi e cosa vuoi fare: verifichiamo per te disponibilità, prezzo e condizioni.",
      cta: "Trova la soluzione giusta",
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
      request: "Verifica disponibilità",
      all: "Tutti"
    }
  },
  en: {
    nav: {
      scooters: "Scooters",
      cars: "Cars",
      boats: "Boats",
      ebikes: "E-bikes",
      book: "Find the right option"
    },
    hero: {
      kicker: "Ischia",
      title: "Vehicle rental in Ischia<br><em>for exploring the island.</em>",
      subtitle: "Compare rental options in Ischia for scooters, cars, e-bikes, rubber dinghies and boats through selected local partners.",
      cta: "Find the right option →",
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
      request: "Check availability",
      all: "All"
    }
  }
} satisfies Record<Locale, unknown>;

export function t(locale: Locale) {
  return dictionary[locale];
}
