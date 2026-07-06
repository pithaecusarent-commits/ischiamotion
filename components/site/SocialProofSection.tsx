import type { Locale } from "@/lib/types";
import { getFeaturedSocialProofReviews, trustpilotReviewUrl } from "@/lib/social-proof-reviews";

const copy = {
  it: {
    eyebrow: "DICONO DI NOI",
    title: "Esperienze reali di chi ha scelto IschiaMotion",
    intro: "Dalla richiesta alla consegna o al ritiro, accompagniamo ogni cliente nella scelta della soluzione più comoda per il suo soggiorno.",
    ratingLabel: "Valutazione",
    trustpilotCta: "Leggi le esperienze di chi ha già utilizzato il servizio",
    note: "Gli estratti riportati provengono da recensioni pubbliche su Google e Trustpilot."
  },
  en: {
    eyebrow: "WHAT GUESTS SAY",
    title: "Real experiences from guests who chose IschiaMotion",
    intro: "From the request to delivery or pickup, we support every guest in choosing the most convenient option for their stay.",
    ratingLabel: "Rating",
    trustpilotCta: "Read what guests who've used the service say",
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
