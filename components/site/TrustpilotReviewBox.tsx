import type { Locale } from "@/lib/types";

const trustpilotUrl = "https://it.trustpilot.com/review/ischiamotion.com";

const copy = {
  it: {
    eyebrow: "Recensioni esterne",
    title: "IschiaMotion è su Trustpilot",
    text: "Leggi le esperienze di chi ha già utilizzato il servizio, o lascia la tua recensione sulla nostra pagina ufficiale.",
    cta: "Vai su Trustpilot",
    aria: "Vai alla pagina ufficiale Trustpilot di IschiaMotion"
  },
  en: {
    eyebrow: "External reviews",
    title: "IschiaMotion is on Trustpilot",
    text: "Read what guests who've already used the service say, or leave your own review on our official page.",
    cta: "Visit Trustpilot",
    aria: "Visit the official IschiaMotion Trustpilot page"
  }
} satisfies Record<Locale, {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  aria: string;
}>;

export function TrustpilotReviewBox({
  locale,
  compact = false
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const content = copy[locale];

  return (
    <section
      aria-label={content.title}
      className={compact ? "mt-4" : "trustpilot-review-section reveal"}
    >
      <div className={compact
        ? "rounded-2xl border border-ink/10 bg-white/80 p-4 text-left shadow-sm"
        : "mx-auto max-w-5xl rounded-[28px] border border-sea/15 bg-white/80 p-5 shadow-card sm:p-6"
      }>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-sea">
              {content.eyebrow} · Trustpilot
            </p>
            <h2 className={compact
              ? "mt-2 text-lg font-black text-ink"
              : "mt-2 font-serif text-2xl font-bold text-green-deep sm:text-3xl"
            }>
              {content.title}
            </h2>
            <p className={compact
              ? "mt-2 text-sm font-semibold leading-6 text-ink/60"
              : "mt-3 max-w-2xl text-sm font-semibold leading-7 text-ink/60 sm:text-base"
            }>
              {content.text}
            </p>
          </div>
          <a
            aria-label={content.aria}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sea/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            href={trustpilotUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {content.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

