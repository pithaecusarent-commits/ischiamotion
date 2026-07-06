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
    gommone: "dinghy",
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
      return `Ciao IschiaMotion, vorrei un consiglio per scegliere la soluzione più adatta al mio soggiorno a Ischia. Arrivo il ${date}, soggiorno a ${area} e sto valutando ${category}.`;
    },
    scooter: (context) => {
      const range = dateRange(context, "[dal]", "[al]");
      return `Ciao IschiaMotion, vorrei verificare disponibilità per uno scooter a Ischia. Date: ${range.from} - ${range.to}. Soggiorno a ${valueOrPlaceholder(context?.areaOrHotel, "[zona/hotel]")}. Persone: [1/2].`;
    },
    auto: (context) => {
      const range = dateRange(context, "[dal]", "[al]");
      return `Ciao IschiaMotion, vorrei verificare disponibilità per un’auto a Ischia. Date: ${range.from} - ${range.to}. Arrivo a ${valueOrPlaceholder(context?.arrivalPoint || context?.areaOrHotel, "[porto/hotel]")}. Persone: [numero]. Bagagli: [sì/no].`;
    },
    gommone: (context) => `Ciao IschiaMotion, vorrei verificare disponibilità per un gommone a Ischia. Data: ${valueOrPlaceholder(context?.date || context?.startDate, "[data]")}. Persone: [numero]. Patente nautica: [sì/no]. Preferenza: [mezza giornata/giornata intera].`,
    bici: (context) => {
      const range = dateRange(context, "[dal]", "[al]");
      return `Ciao IschiaMotion, vorrei verificare disponibilità per e-bike a Ischia. Date: ${range.from} - ${range.to}. Soggiorno a ${valueOrPlaceholder(context?.areaOrHotel, "[zona/hotel]")}. Persone: [numero].`;
    },
    barca: (context) => `Ciao IschiaMotion, vorrei una barca con skipper a Ischia. Data: ${valueOrPlaceholder(context?.date || context?.startDate, "[data]")}. Persone: [numero]. Preferenza: [mezza giornata/giornata intera]. Zona o porto di partenza: ${valueOrPlaceholder(context?.departureArea || context?.areaOrHotel, "[zona]")}.`,
    beach_club: (context) => `Ciao IschiaMotion, vorrei verificare disponibilità per un beach club a Ischia. Data: ${valueOrPlaceholder(context?.date || context?.startDate, "[data]")}. Persone: [numero]. Zona preferita: ${valueOrPlaceholder(context?.preferredArea || context?.areaOrHotel, "[Forio/Sant’Angelo/altra zona]")}.`,
    requestReceived: () => "Ciao IschiaMotion, ho appena inviato una richiesta e vorrei aggiungere un dettaglio."
  },
  en: {
    generic: (context) => {
      const category = categoryLabel("en", context?.category, "[scooter/car/e-bike/dinghy/boat/beach club]");
      const date = valueOrPlaceholder(context?.date || context?.startDate, "[date]");
      const area = valueOrPlaceholder(context?.areaOrHotel, "[area/hotel]");
      return `Hi IschiaMotion, I would like some advice on choosing the best option for my stay in Ischia. I arrive on ${date}, I am staying in ${area} and I am considering ${category}.`;
    },
    scooter: (context) => {
      const range = dateRange(context, "[from]", "[to]");
      return `Hi IschiaMotion, I would like to check availability for a scooter in Ischia. Dates: ${range.from} - ${range.to}. I am staying in ${valueOrPlaceholder(context?.areaOrHotel, "[area/hotel]")}. People: [1/2].`;
    },
    auto: (context) => {
      const range = dateRange(context, "[from]", "[to]");
      return `Hi IschiaMotion, I would like to check availability for a car in Ischia. Dates: ${range.from} - ${range.to}. Arrival point: ${valueOrPlaceholder(context?.arrivalPoint || context?.areaOrHotel, "[port/hotel]")}. People: [number]. Luggage: [yes/no].`;
    },
    gommone: (context) => `Hi IschiaMotion, I would like to check availability for a dinghy in Ischia. Date: ${valueOrPlaceholder(context?.date || context?.startDate, "[date]")}. People: [number]. Boat licence: [yes/no]. Preference: [half day/full day].`,
    bici: (context) => {
      const range = dateRange(context, "[from]", "[to]");
      return `Hi IschiaMotion, I would like to check availability for e-bikes in Ischia. Dates: ${range.from} - ${range.to}. I am staying in ${valueOrPlaceholder(context?.areaOrHotel, "[area/hotel]")}. People: [number].`;
    },
    barca: (context) => `Hi IschiaMotion, I would like a boat with skipper in Ischia. Date: ${valueOrPlaceholder(context?.date || context?.startDate, "[date]")}. People: [number]. Preference: [half day/full day]. Preferred departure area or port: ${valueOrPlaceholder(context?.departureArea || context?.areaOrHotel, "[area]")}.`,
    beach_club: (context) => `Hi IschiaMotion, I would like to check availability for a beach club in Ischia. Date: ${valueOrPlaceholder(context?.date || context?.startDate, "[date]")}. People: [number]. Preferred area: ${valueOrPlaceholder(context?.preferredArea || context?.areaOrHotel, "[Forio/Sant’Angelo/other area]")}.`,
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
