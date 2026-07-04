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
      secondary: "Scrivici su WhatsApp",
      whatsappMessage: "Ciao IschiaMotion, vorrei un consiglio per scegliere il mezzo più adatto al mio soggiorno a Ischia.",
      microcopy: "Richiesta senza impegno. La disponibilità viene confermata solo dopo verifica con il partner locale.",
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
      title: "Get around Ischia without wasting time between countless rental operators.",
      subtitle: "Scooters, cars, e-bikes, dinghies, boats and beach clubs through selected local partners. Tell us where you are staying, when you arrive and what you would like to do: we check availability, price and conditions for you.",
      cta: "Find the right option",
      secondary: "Message us on WhatsApp",
      whatsappMessage: "Hi IschiaMotion, I would like some advice on choosing the best option for my stay in Ischia.",
      microcopy: "No-obligation request. Availability is confirmed only after checking with the local partner.",
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
