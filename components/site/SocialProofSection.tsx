import type { Locale } from "@/lib/types";
import { getFeaturedSocialProofReviews, trustpilotReviewUrl } from "@/lib/social-proof-reviews";

const copy = {
  it: {
    eyebrow: "DICONO DI NOI",
    title: "Una richiesta semplice, un aiuto concreto per vivere Ischia senza pensieri.",
    intro: "Ogni richiesta viene verificata con partner locali selezionati, per aiutarti a scegliere la soluzione più adatta alle tue date, alla zona in cui soggiorni e al tipo di vacanza che desideri.",
    ratingLabel: "Valutazione",
    trustpilotCta: "Leggi tutte le recensioni su Trustpilot",
    note: "Gli estratti riportati provengono da recensioni pubbliche su Google e Trustpilot."
  },
  en: {
    eyebrow: "WHAT GUESTS SAY",
    title: "Simple requests, practical local help for enjoying Ischia without stress.",
    intro: "Every request is checked with selected local partners to help you choose the option that best suits your dates, where you are staying and the kind of holiday you are planning.",
    ratingLabel: "Rating",
    trustpilotCta: "Read all reviews on Trustpilot",
    note: "These excerpts come from public reviews on Google and Trustpilot."
  }
} satisfies Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  ratingLabel: string;
  trustpilotCta: string;
  note: string;
}>;

function Stars({ label }: { label: string }) {
  return (
    <span className="review-stars" aria-label={`${label}: 5/5`}>
      <span aria-hidden="true">★★★★★</span>
    </span>
  );
}

export function SocialProofSection({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const reviews = getFeaturedSocialProofReviews(locale);

  return (
    <section className="social-proof-section reveal" aria-labelledby="social-proof-title">
      <div className="social-proof-header">
        <div className="section-eyebrow">{content.eyebrow}</div>
        <h2 id="social-proof-title">{content.title}</h2>
        <p>{content.intro}</p>
      </div>

      <div className="social-proof-grid">
        {reviews.map((review) => (
          <article className="review-card" key={`${review.locale}-${review.source}-${review.name}`}>
            <div className="review-card-top">
              <Stars label={content.ratingLabel} />
              <span className="review-source">{review.source}</span>
            </div>
            <blockquote>“{review.quote}”</blockquote>
            <footer>
              <strong>{review.name}</strong>
              {review.isTranslated && review.translationNote ? (
                <span>{review.translationNote}</span>
              ) : null}
            </footer>
          </article>
        ))}
      </div>

      <div className="social-proof-actions">
        {/* TODO: add the official Google reviews URL when a verified public link is available. */}
        <a href={trustpilotReviewUrl} target="_blank" rel="noopener noreferrer">
          {content.trustpilotCta}
        </a>
      </div>

      <p className="social-proof-note">{content.note}</p>
    </section>
  );
}
