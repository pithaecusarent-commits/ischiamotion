import type { Locale } from "@/lib/types";

export const dictionary = {
  it: {
    nav: {
      scooters: "Scooter",
      cars: "Auto",
      boats: "Barche",
      ebikes: "Bici elettriche",
      book: "Verifica disponibilità e prezzo"
    },
    hero: {
      kicker: "Ischia",
      title: "Scooter, auto e barche a Ischia senza perdere tempo.",
      subtitle: "Non serve contattare tanti noleggiatori: dicci date e zona del soggiorno, verifichiamo la soluzione più comoda con partner locali selezionati.",
      cta: "Verifica disponibilità e prezzo",
      secondary: "Verifica disponibilità su WhatsApp",
      microcopy: "Risposta in pochi minuti negli orari operativi.",
      benefits: [
        "Una sola richiesta, niente chiamate multiple",
        "Prezzo, condizioni e ritiro in un'unica proposta",
        "Supporto locale per scegliere il mezzo giusto"
      ]
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
      title: "Scooters, cars and boats in Ischia, no time wasted.",
      subtitle: "No need to contact several rental operators: tell us your dates and area, we'll check the most convenient option with local partners.",
      cta: "Check availability and price",
      secondary: "Check availability on WhatsApp",
      microcopy: "A reply within minutes during operating hours.",
      benefits: [
        "One request, no multiple calls",
        "Price, conditions and pickup in a single proposal",
        "Local support to choose the right option"
      ]
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
