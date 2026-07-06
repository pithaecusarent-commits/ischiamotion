import type { Locale, PublicPickupPoint } from "@/lib/types";

export const siteUrl = "https://www.ischiamotion.com";
export const canonicalSiteUrl = `${siteUrl}/`;
export const organizationId = "https://www.ischiamotion.com/#organization";
export const websiteId = organizationId;

export function canonicalUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export const organizationReference = {
  "@type": ["Organization", "LocalBusiness"],
  "@id": organizationId,
  name: "IschiaMotion",
  alternateName: "Ischia Motion",
  url: canonicalSiteUrl
};

export const websiteReference = {
  "@type": "WebSite",
  "@id": organizationId,
  name: "IschiaMotion",
  alternateName: "Ischia Motion",
  url: canonicalSiteUrl,
  publisher: {
    "@id": organizationId
  }
};

export const scooterFaq = {
  it: [
    {
      question: "Quanto costa noleggiare uno scooter a Ischia?",
      answer: "Il prezzo varia in base a periodo, durata, cilindrata e disponibilità dei partner locali. Invia una richiesta online e ricevi in pochi minuti prezzo e condizioni aggiornati."
    },
    {
      question: "Dove posso ritirare lo scooter?",
      answer: "Puoi indicare un punto ritiro IschiaMotion o una zona comoda come Ischia Porto, Forio, Casamicciola, Sant’Angelo o Barano. Prima della conferma ricevi tutti i dettagli della proposta, incluso punto di ritiro e orario."
    },
    {
      question: "Posso richiedere il noleggio online?",
      answer: "Sì. Puoi inviare online date, orario preferito, contatti, categoria mezzo e punto ritiro. IschiaMotion inoltra e verifica la richiesta con il network di noleggiatori selezionati."
    },
    {
      question: "Serve la patente per noleggiare uno scooter a Ischia?",
      answer: "Sì, per guidare uno scooter servono i requisiti previsti dalla legge e una patente valida per la categoria richiesta dal mezzo scelto."
    },
    {
      question: "Il nome del noleggiatore viene mostrato?",
      answer: "IschiaMotion mostra punti ritiro e opzioni disponibili in modo semplice. La richiesta viene poi gestita e confermata con il partner locale selezionato."
    },
    {
      question: "Cosa succede dopo la richiesta?",
      answer: "Verifichiamo subito disponibilità, date e punto ritiro con i partner locali e ti inviamo la proposta in pochi minuti negli orari operativi."
    },
    {
      question: "Lo scooter conviene per muoversi a Ischia?",
      answer: "Sì, spesso è pratico per coppie e viaggiatori leggeri perché aiuta negli spostamenti rapidi e nel parcheggio rispetto all'auto, soprattutto tra porto, spiagge e borghi."
    },
    {
      question: "Posso richiedere scooter a Ischia Porto?",
      answer: "Puoi indicare Ischia Porto come zona preferita: controlliamo subito ritiro, orario e disponibilità con i partner locali."
    },
    {
      question: "Casco, cauzione e documenti sono inclusi?",
      answer: "Casco, cauzione e documenti richiesti variano in base a partner e mezzo: te li indichiamo chiaramente nella proposta, prima della conferma finale."
    },
    {
      question: "IschiaMotion è il noleggiatore diretto?",
      answer: "IschiaMotion è una piattaforma locale che raccoglie richieste e verifica disponibilità e condizioni tramite partner selezionati. I mezzi e i servizi sono forniti dai rispettivi operatori locali."
    }
  ],
  en: [
    {
      question: "How much does scooter rental in Ischia cost?",
      answer: "The cost depends on season, rental length, scooter type and options available from local partners. With IschiaMotion you send an online request and receive confirmation after partner review."
    },
    {
      question: "Where can I pick up the scooter?",
      answer: "You can indicate an IschiaMotion pickup point or a convenient area such as Ischia Port, Forio, Casamicciola, Sant’Angelo or Barano. Availability is confirmed after review with the local partner."
    },
    {
      question: "Can I request scooter rental online?",
      answer: "Yes. You can send dates, preferred time, contact details, vehicle category and pickup point online. IschiaMotion checks the request with its network of selected local rental partners."
    },
    {
      question: "Do I need a license to rent a scooter in Ischia?",
      answer: "Yes. You need the legal requirements and a valid license for the category required by the selected scooter."
    },
    {
      question: "Is the rental company name shown?",
      answer: "IschiaMotion presents pickup points and available options in a simple way. The request is then reviewed and confirmed with the selected local partner."
    },
    {
      question: "What happens after I send a request?",
      answer: "You receive a request confirmation. IschiaMotion checks availability, dates and pickup point with local partners, then contacts you to complete the request."
    },
    {
      question: "Is a scooter useful for getting around Ischia?",
      answer: "Yes, it is often practical for couples and light travellers because it helps with quick movement and easier parking than a car, especially around ports, beaches and villages."
    },
    {
      question: "Can I request scooter rental at Ischia Port?",
      answer: "You can indicate Ischia Port as your preferred area. Pickup, timing and availability are reviewed with local partners before confirmation."
    },
    {
      question: "Are helmet, deposit and documents included?",
      answer: "Helmet, deposit, required documents and conditions depend on the partner and scooter. IschiaMotion checks and communicates them before final confirmation."
    },
    {
      question: "Is IschiaMotion the direct rental provider?",
      answer: "IschiaMotion is a local platform that collects requests and checks availability and conditions through selected partners. Vehicles and services are provided by the respective local operators."
    }
  ]
} satisfies Record<Locale, Array<{ question: string; answer: string }>>;

export function faqJsonLd(faq: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    ...websiteReference,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${canonicalSiteUrl}${locale}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": organizationId,
    name: "IschiaMotion",
    alternateName: "Ischia Motion",
    url: canonicalSiteUrl,
    telephone: "+39 329 685 6370",
    email: "info@ischiamotion.com",
    logo: `${canonicalSiteUrl}images/ischiamotion-logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Fundera, 104",
      addressLocality: "Lacco Ameno",
      addressRegion: "NA",
      postalCode: "80076",
      addressCountry: "IT"
    },
    areaServed: {
      "@type": "Place",
      name: "Ischia"
    },
    description: "IschiaMotion è una piattaforma locale per richieste di mobilità e servizi mare a Ischia tramite partner selezionati.",
    sameAs: ["https://it.trustpilot.com/review/ischiamotion.com"]
  };
}

export function serviceJsonLd(locale: Locale, path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      ...organizationReference
    },
    areaServed: {
      "@type": "Place",
      name: "Ischia"
    },
    serviceType: locale === "it" ? "Piattaforma locale per richieste noleggio scooter auto e barche" : "Local scooter car and boat rental request platform",
    url: `${siteUrl}${path}`
  };
}

export function webpageJsonLd(locale: Locale, path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${siteUrl}${path}`,
    inLanguage: locale,
    isPartOf: {
      ...websiteReference
    },
    about: {
      "@id": organizationId
    },
    publisher: {
      "@id": organizationId
    }
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function pickupPointNames(points: PublicPickupPoint[], locale: Locale) {
  return points.slice(0, 5).map((point) => locale === "it" ? point.public_label_it : point.public_label_en);
}
