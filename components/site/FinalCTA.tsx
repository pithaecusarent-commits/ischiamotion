import type { Locale } from "@/lib/types";

export function FinalCTA({ locale }: { locale: Locale }) {
  return (
    <section className="final-cta reveal">
      <div className="final-box">
        <h2 dangerouslySetInnerHTML={{ __html: locale === "it" ? "Pronto a vivere<br>l'isola senza limiti?" : "Ready to explore<br>the island freely?" }} />
        <p>{locale === "it" ? "Scegli il mezzo, invia la richiesta e attendi la verifica della disponibilità. IschiaMotion rende il noleggio più semplice, bello e veloce." : "Choose the ride, send your request and wait for the availability check. IschiaMotion makes rental simpler, smoother and faster."}</p>
        <a href="#prenota" className="primary-btn">
          {locale === "it" ? "Richiedi il tuo mezzo →" : "Request your ride →"}
        </a>
      </div>
    </section>
  );
}
