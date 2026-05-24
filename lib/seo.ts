import type { Locale, PublicPickupPoint } from "@/lib/types";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ischiamotion.it";

export const scooterFaq = {
  it: [
    {
      question: "Quanto costa noleggiare uno scooter a Ischia?",
      answer: "Il costo dipende dal periodo, dalla durata e dalle opzioni disponibili presso i partner locali. Con IschiaMotion invii una richiesta online e ricevi conferma dopo verifica con il noleggiatore selezionato."
    },
    {
      question: "Dove posso ritirare lo scooter?",
      answer: "Puoi indicare un punto ritiro IschiaMotion come Porto d’Ischia, Forio, Casamicciola, Sant’Angelo o Barano. La disponibilità viene confermata dopo verifica con il partner locale."
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
    }
  ],
  en: [
    {
      question: "How much does scooter rental in Ischia cost?",
      answer: "The cost depends on season, rental length and options available from local partners. With IschiaMotion you send an online request and receive confirmation after review with the selected rental partner."
    },
    {
      question: "Where can I pick up the scooter?",
      answer: "You can indicate an IschiaMotion pickup point such as Ischia Port, Forio, Casamicciola, Sant’Angelo or Barano. Availability is confirmed after review with the local partner."
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
