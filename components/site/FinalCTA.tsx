import type { Locale } from "@/lib/types";

export function FinalCTA({ locale }: { locale: Locale }) {
  return (
    <section className="final-cta reveal">
      <div className="final-box">
        <h2 dangerouslySetInnerHTML={{ __html: locale === "it" ? "Pronto a vivere<br>l'isola senza limiti?" : "Ready to explore<br>the island freely?" }} />
        <p>{locale === "it" ? "Scegli il mezzo, conferma le date e inizia il viaggio. IschiaMotion rende il noleggio piu' semplice, bello e veloce." : "Choose the ride, confirm the dates and start your trip. IschiaMotion makes rental simpler, smoother and faster."}</p>
        <a href="#prenota" className="primary-btn">
          {locale === "it" ? "Prenota il tuo mezzo →" : "Book your ride →"}
        </a>
      </div>
    </section>
  );
}
