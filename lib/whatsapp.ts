import type { Locale, VehicleFilter } from "@/lib/types";

export const ISCHIAMOTION_WHATSAPP_NUMBER = "393296856370";

export type WhatsAppMessageContext = {
  category?: VehicleFilter;
  startDate?: string;
  endDate?: string;
  date?: string;
  areaOrHotel?: string;
  arrivalPoint?: string;
  departureArea?: string;
  preferredArea?: string;
};

type MessageBuilder = (context?: WhatsAppMessageContext) => string;

const valueOrPlaceholder = (value: string | undefined, placeholder: string) => value?.trim() || placeholder;

const categoryLabels: Record<Locale, Record<Exclude<VehicleFilter, "all">, string>> = {
  it: {
    scooter: "scooter",
    auto: "auto",
    bici: "e-bike",
    gommone: "gommone",
    barca: "barca",
    beach_club: "beach club"
  },
  en: {
    scooter: "scooter",
    auto: "car",
    bici: "e-bike",
    gommone: "rubber boat",
    barca: "boat",
    beach_club: "beach club"
  }
};

function categoryLabel(locale: Locale, category: VehicleFilter | undefined, fallback: string) {
  return category && category !== "all" ? categoryLabels[locale][category] : fallback;
}

const dateRange = (
  context: WhatsAppMessageContext | undefined,
  fromPlaceholder: string,
  toPlaceholder: string
) => ({
  from: valueOrPlaceholder(context?.startDate, fromPlaceholder),
  to: valueOrPlaceholder(context?.endDate, toPlaceholder)
});

export const whatsappMessageTemplates: Record<Locale, Record<"generic" | Exclude<VehicleFilter, "all"> | "requestReceived", MessageBuilder>> = {
  it: {
    generic: (context) => {
      const category = categoryLabel("it", context?.category, "[scooter/auto/e-bike/gommone/barca/beach club]");
      const date = valueOrPlaceholder(context?.date || context?.startDate, "[data]");
      const area = valueOrPlaceholder(context?.areaOrHotel, "[zona/hotel]");
      return [
        "Ciao IschiaMotion, vorrei un consiglio per scegliere la soluzione più adatta al mio soggiorno a Ischia.",
        "",
        `Arrivo il ${date}, soggiorno in zona ${area} e sto valutando ${category}.`,
        "",
        "Potete aiutarmi a capire la soluzione migliore in base ai miei spostamenti?"
      ].join("\n");
    },
    scooter: (context) => {
      const range = dateRange(context, "[dal]", "[al]");
      return [
        "Ciao IschiaMotion, vorrei un consiglio per scegliere la soluzione più comoda per muovermi a Ischia.",
        "",
        `Arrivo/soggiorno dal ${range.from} al ${range.to}, in zona ${valueOrPlaceholder(context?.areaOrHotel, "[zona/hotel]")}, e sto valutando uno scooter.`,
        "",
        "Potete aiutarmi a capire se è la scelta migliore in base ai miei spostamenti?"
      ].join("\n");
    },
    auto: (context) => {
      const range = dateRange(context, "[dal]", "[al]");
      return [
        "Ciao IschiaMotion, vorrei un consiglio per scegliere la soluzione più adatta al mio soggiorno a Ischia.",
        "",
        `Arrivo/soggiorno dal ${range.from} al ${range.to}, arrivo o soggiorno in zona ${valueOrPlaceholder(context?.arrivalPoint || context?.areaOrHotel, "[porto/hotel]")}, e sto valutando un’auto.`,
        "",
        "Potete aiutarmi a capire la soluzione più comoda in base a persone, bagagli e spostamenti?"
      ].join("\n");
    },
    gommone: (context) => [
      "Ciao IschiaMotion, vorrei un consiglio per organizzare una giornata in mare a Ischia.",
      "",
      `Data indicativa: ${valueOrPlaceholder(context?.date || context?.startDate, "[data]")}. Persone: [numero]. Sto valutando un gommone, con patente nautica: [sì/no].`,
      "",
      "Potete aiutarmi a capire la soluzione più adatta tra mezza giornata e giornata intera?"
    ].join("\n"),
    bici: (context) => {
      const range = dateRange(context, "[dal]", "[al]");
      return [
        "Ciao IschiaMotion, vorrei un consiglio per muovermi a Ischia in modo pratico e panoramico.",
        "",
        `Arrivo/soggiorno dal ${range.from} al ${range.to}, in zona ${valueOrPlaceholder(context?.areaOrHotel, "[zona/hotel]")}, e sto valutando e-bike per [numero] persone.`,
        "",
        "Potete aiutarmi a capire se è una buona soluzione per il mio itinerario?"
      ].join("\n");
    },
    barca: (context) => [
      "Ciao IschiaMotion, vorrei un consiglio per organizzare un’esperienza in barca a Ischia.",
      "",
      `Data indicativa: ${valueOrPlaceholder(context?.date || context?.startDate, "[data]")}. Persone: [numero]. Sto valutando una barca con skipper, partendo da ${valueOrPlaceholder(context?.departureArea || context?.areaOrHotel, "[zona/porto]")}.`,
      "",
      "Potete aiutarmi a capire la soluzione più adatta tra tour, durata e itinerario?"
    ].join("\n"),
    beach_club: (context) => [
      "Ciao IschiaMotion, vorrei un consiglio per organizzare una giornata mare comoda a Ischia.",
      "",
      `Data indicativa: ${valueOrPlaceholder(context?.date || context?.startDate, "[data]")}. Persone: [numero]. Sto valutando un beach club in zona ${valueOrPlaceholder(context?.preferredArea || context?.areaOrHotel, "[Forio/Sant’Angelo/altra zona]")}.`,
      "",
      "Potete aiutarmi a capire la soluzione più adatta in base a zona e servizi desiderati?"
    ].join("\n"),
    requestReceived: () => "Ciao IschiaMotion, ho appena inviato una richiesta e vorrei aggiungere un dettaglio."
  },
  en: {
    generic: (context) => {
      const category = categoryLabel("en", context?.category, "[scooter/car/e-bike/rubber boat/boat/beach club]");
      const date = valueOrPlaceholder(context?.date || context?.startDate, "[date]");
      const area = valueOrPlaceholder(context?.areaOrHotel, "[area/hotel]");
      return [
        "Hi IschiaMotion, I’d like some advice to choose the best option for my stay in Ischia.",
        "",
        `I arrive on ${date}, I’m staying in ${area}, and I’m considering ${category}.`,
        "",
        "Can you help me understand the most convenient solution based on my plans?"
      ].join("\n");
    },
    scooter: (context) => {
      const range = dateRange(context, "[from]", "[to]");
      return [
        "Hi IschiaMotion, I’d like some advice to choose the most convenient way to get around Ischia.",
        "",
        `I arrive/stay from ${range.from} to ${range.to}, I’m staying in ${valueOrPlaceholder(context?.areaOrHotel, "[area/hotel]")}, and I’m considering a scooter.`,
        "",
        "Can you help me understand if it is the best option based on my plans?"
      ].join("\n");
    },
    auto: (context) => {
      const range = dateRange(context, "[from]", "[to]");
      return [
        "Hi IschiaMotion, I’d like some advice to choose the best option for my stay in Ischia.",
        "",
        `I arrive/stay from ${range.from} to ${range.to}, my arrival point or area is ${valueOrPlaceholder(context?.arrivalPoint || context?.areaOrHotel, "[port/hotel]")}, and I’m considering a car.`,
        "",
        "Can you help me understand the most convenient solution based on people, luggage and plans?"
      ].join("\n");
    },
    gommone: (context) => [
      "Hi IschiaMotion, I’d like some advice to plan a day at sea in Ischia.",
      "",
      `Indicative date: ${valueOrPlaceholder(context?.date || context?.startDate, "[date]")}. People: [number]. I’m considering a rubber boat, boat licence: [yes/no].`,
      "",
      "Can you help me understand the best option between half day and full day?"
    ].join("\n"),
    bici: (context) => {
      const range = dateRange(context, "[from]", "[to]");
      return [
        "Hi IschiaMotion, I’d like some advice to get around Ischia in a practical and scenic way.",
        "",
        `I arrive/stay from ${range.from} to ${range.to}, I’m staying in ${valueOrPlaceholder(context?.areaOrHotel, "[area/hotel]")}, and I’m considering e-bikes for [number] people.`,
        "",
        "Can you help me understand if it suits my itinerary?"
      ].join("\n");
    },
    barca: (context) => [
      "Hi IschiaMotion, I’d like some advice to plan a boat experience in Ischia.",
      "",
      `Indicative date: ${valueOrPlaceholder(context?.date || context?.startDate, "[date]")}. People: [number]. I’m considering a boat with skipper, departing from ${valueOrPlaceholder(context?.departureArea || context?.areaOrHotel, "[area/port]")}.`,
      "",
      "Can you help me understand the best option based on tour, duration and itinerary?"
    ].join("\n"),
    beach_club: (context) => [
      "Hi IschiaMotion, I’d like some advice to plan a comfortable beach day in Ischia.",
      "",
      `Indicative date: ${valueOrPlaceholder(context?.date || context?.startDate, "[date]")}. People: [number]. I’m considering a beach club around ${valueOrPlaceholder(context?.preferredArea || context?.areaOrHotel, "[Forio/Sant’Angelo/other area]")}.`,
      "",
      "Can you help me understand the best option based on area and services?"
    ].join("\n"),
    requestReceived: () => "Hi IschiaMotion, I have just submitted a request and would like to add a detail."
  }
};

export function getWhatsAppMessage(
  locale: Locale,
  type: "generic" | Exclude<VehicleFilter, "all"> | "requestReceived" = "generic",
  context?: WhatsAppMessageContext
) {
  return whatsappMessageTemplates[locale][type](context);
}

export function getWhatsAppUrl(
  locale: Locale,
  type: "generic" | Exclude<VehicleFilter, "all"> | "requestReceived" = "generic",
  context?: WhatsAppMessageContext
) {
  return `https://wa.me/${ISCHIAMOTION_WHATSAPP_NUMBER}?text=${encodeURIComponent(getWhatsAppMessage(locale, type, context))}`;
}

export function resolveWhatsAppType(category: VehicleFilter): "generic" | Exclude<VehicleFilter, "all"> {
  return category === "all" ? "generic" : category;
}
