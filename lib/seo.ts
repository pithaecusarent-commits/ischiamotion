import type { Locale, PublicPickupPoint } from "@/lib/types";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ischiamotion.it";

export const scooterFaq = {
  it: [
    {
      question: "Quanto costa noleggiare uno scooter a Ischia?",
      answer: "Il costo dipende dal periodo, dalla durata e dal modello disponibile. Con IschiaMotion invii una richiesta online e ricevi conferma sulla disponibilità prima di completare il noleggio."
    },
    {
      question: "Dove posso ritirare lo scooter?",
      answer: "Puoi selezionare un punto ritiro IschiaMotion come Porto d’Ischia, Forio, Casamicciola, Sant’Angelo o Barano, in base alle disponibilità confermate."
    },
    {
      question: "Posso richiedere il noleggio online?",
      answer: "Sì. Puoi inviare online date, orario preferito, contatti, veicolo e punto ritiro. Il team ti ricontatta per confermare i dettagli."
    },
    {
      question: "Serve la patente per noleggiare uno scooter a Ischia?",
      answer: "Sì, per guidare uno scooter servono i requisiti previsti dalla legge e una patente valida per la categoria richiesta dal mezzo scelto."
    },
    {
      question: "Il nome del noleggiatore viene mostrato?",
      answer: "No. Sul front-end pubblico viene mostrato solo il punto ritiro brandizzato IschiaMotion, non il nome del singolo noleggiatore."
    },
    {
      question: "Cosa succede dopo la richiesta?",
      answer: "Ricevi una conferma di ricezione. IschiaMotion verifica disponibilità, date e punto ritiro, poi ti contatta per completare la prenotazione."
    }
  ],
  en: [
    {
      question: "How much does scooter rental in Ischia cost?",
      answer: "The cost depends on the season, rental length and available model. With IschiaMotion you send an online request and receive availability confirmation before completing the rental."
    },
    {
      question: "Where can I pick up the scooter?",
      answer: "You can select an IschiaMotion pickup point such as Ischia Port, Forio, Casamicciola, Sant’Angelo or Barano, depending on confirmed availability."
    },
    {
      question: "Can I request scooter rental online?",
      answer: "Yes. You can send dates, preferred time, contact details, vehicle and pickup point online. The team contacts you to confirm the details."
    },
    {
      question: "Do I need a license to rent a scooter in Ischia?",
      answer: "Yes. You need the legal requirements and a valid license for the category required by the selected scooter."
    },
    {
      question: "Is the rental company name shown?",
      answer: "No. The public front-end shows only the branded IschiaMotion pickup point, not the individual rental company name."
    },
    {
      question: "What happens after I send a request?",
      answer: "You receive a request confirmation. IschiaMotion checks availability, dates and pickup point, then contacts you to complete the booking."
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
    logo: `${siteUrl}/images/ischiamotion-logo.png`
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
    serviceType: locale === "it" ? "Noleggio veicoli" : "Vehicle rental",
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
