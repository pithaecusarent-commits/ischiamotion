import type { Locale } from "@/lib/types";

export type ReviewSource = "Google" | "Trustpilot";

export type SocialProofReview = {
  name: string;
  source: ReviewSource;
  rating: 5;
  quote: string;
  locale: Locale;
  isTranslated?: boolean;
  translationNote?: string;
  sourceUrl?: string;
  isFeatured: boolean;
};

export const trustpilotReviewUrl = "https://it.trustpilot.com/review/ischiamotion.com";

export const socialProofReviews: SocialProofReview[] = [
  {
    name: "Daniele",
    source: "Google",
    rating: 5,
    quote: "Ho prenotato lo scooter già durante l’organizzazione della vacanza e si è rivelata un’ottima scelta. Comunicazione rapida, prenotazione semplice…",
    locale: "it",
    isFeatured: true
  },
  {
    name: "Francesca",
    source: "Google",
    rating: 5,
    quote: "Servizio eccellente e scooter affidabile. Tutto semplice e veloce, staff cortese e professionale.",
    locale: "it",
    isFeatured: true
  },
  {
    name: "Mena Migliaccio",
    source: "Google",
    rating: 5,
    quote: "Scooter in perfette condizioni, ritiro veloce e personale molto disponibile. Un modo pratico e divertente per visitare Ischia.",
    locale: "it",
    isFeatured: true
  },
  {
    name: "Andrea Arena",
    source: "Trustpilot",
    rating: 5,
    quote: "Il mezzo era pulito, perfettamente funzionante e molto comodo per spostarsi sull’isola.",
    locale: "it",
    sourceUrl: trustpilotReviewUrl,
    isFeatured: true
  },
  {
    name: "Salvatore Baldino",
    source: "Trustpilot",
    rating: 5,
    quote: "Servizio professionale, veloce e affidabile. Personale cortese e disponibile.",
    locale: "it",
    sourceUrl: trustpilotReviewUrl,
    isFeatured: false
  },
  {
    name: "Maria",
    source: "Trustpilot",
    rating: 5,
    quote: "Cordialità è disponibilità e assistenza al cliente. Raccomando assolutamente!!!",
    locale: "it",
    sourceUrl: trustpilotReviewUrl,
    isFeatured: false
  },
  {
    name: "Utente Trustpilot",
    source: "Trustpilot",
    rating: 5,
    quote: "Prompt, friendly, and courteous service. An excellent experience all the way.",
    locale: "en",
    sourceUrl: trustpilotReviewUrl,
    isFeatured: true
  },
  {
    name: "Daniele",
    source: "Google",
    rating: 5,
    quote: "I booked the scooter while planning my holiday and it turned out to be an excellent choice. Fast communication, simple booking…",
    locale: "en",
    isTranslated: true,
    translationNote: "Translated from an Italian review",
    isFeatured: true
  },
  {
    name: "Francesca",
    source: "Google",
    rating: 5,
    quote: "Excellent service and a reliable scooter. Everything was simple and fast, with courteous and professional staff.",
    locale: "en",
    isTranslated: true,
    translationNote: "Translated from an Italian review",
    isFeatured: true
  }
];

export function getFeaturedSocialProofReviews(locale: Locale) {
  return socialProofReviews.filter((review) => review.locale === locale && review.isFeatured);
}
