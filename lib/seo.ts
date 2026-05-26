import type { Locale, PublicPickupPoint } from "@/lib/types";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ischiamotion.com";

export const scooterFaq = {
  it: [
    {
      question: "Quanto costa noleggiare uno scooter a Ischia?",
      answer: "Il costo dipende da periodo, durata, cilindrata e disponibilità dei partner locali. Con IschiaMotion invii una richiesta online e ricevi conferma dopo verifica con il partner selezionato."
    },
    {
      question: "Dove posso ritirare lo scooter?",
      answer: "Puoi indicare un punto ritiro IschiaMotion o una zona comoda come Ischia Porto, Forio, Casamicciola, Sant’Angelo o Barano. La disponibilità viene confermata dopo verifica con il partner locale."
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
      answer: "Ricevi una conferma di ricezione. IschiaMotion verifica disponibilità, date e punto ritiro con i partner locali, poi ti contatta per completare la richiesta."
    },
    {
      question: "Lo scooter conviene per muoversi a Ischia?",
      answer: "Sì, spesso è pratico per coppie e viaggiatori leggeri perché aiuta negli spostamenti rapidi e nel parcheggio rispetto all'auto, soprattutto tra porto, spiagge e borghi."
    },
    {
      question: "Posso richiedere scooter a Ischia Porto?",
      answer: "Puoi indicare Ischia Porto come zona preferita. Ritiro, orario e disponibilità vengono verificati con i partner locali prima della conferma."
    },
    {
      question: "Casco, cauzione e documenti sono inclusi?",
      answer: "Casco, cauzione, documenti richiesti e condizioni dipendono dal partner e dal mezzo. IschiaMotion li verifica e li comunica prima della conferma finale."
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
    "@type": "WebSite",
    name: "IschiaMotion",
    url: siteUrl,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/${locale}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IschiaMotion",
    url: siteUrl,
    logo: `${siteUrl}/images/ischiamotion-logo.png`,
    description: "Local rental marketplace and rental request platform connecting visitors with selected scooter, car, e-bike, rubber dinghy and boat rental partners in Ischia."
  };
}

export function serviceJsonLd(locale: Locale, path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "IschiaMotion",
      url: siteUrl
    },
    areaServed: {
      "@type": "Place",
      name: "Ischia"
    },
    serviceType: locale === "it" ? "Piattaforma locale per richieste noleggio scooter auto e barche" : "Local scooter car and boat rental request platform",
    url: `${siteUrl}${path}`
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
