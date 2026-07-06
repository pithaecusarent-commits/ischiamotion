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
      title: "Noleggia scooter, auto e barche a Ischia senza perdere tempo.",
      subtitle: "Dicci le date del tuo soggiorno, dove alloggi o dove arrivi: verifichiamo rapidamente la soluzione più comoda disponibile con partner locali selezionati.",
      cta: "Verifica disponibilità e prezzo",
      secondary: "Verifica disponibilità su WhatsApp",
      microcopy: "Risposta in pochi minuti negli orari operativi.",
      benefits: [
        "Partner locali selezionati",
        "Prezzi e condizioni verificati",
        "Supporto per scegliere il mezzo giusto"
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
      title: "Rent a scooter, car or boat in Ischia without wasting time.",
      subtitle: "Tell us your dates, where you're staying or arriving: we quickly check the most convenient option available with selected local partners.",
      cta: "Check availability and price",
      secondary: "Check availability on WhatsApp",
      microcopy: "A reply within minutes during operating hours.",
      benefits: [
        "Selected local partners",
        "Prices and conditions checked",
        "Help choosing the right option"
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
