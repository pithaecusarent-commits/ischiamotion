import type { Locale } from "@/lib/types";

export function FinalCTA({ locale }: { locale: Locale }) {
  return (
    <section className="final-cta reveal">
      <div className="final-box">
        <h2 dangerouslySetInnerHTML={{ __html: locale === "it" ? "Muoviti a Ischia<br>con più semplicità." : "Plan your Ischia days<br>with less friction." }} />
        <p>{locale === "it" ? "Scegli la soluzione più adatta al tuo viaggio, invia una richiesta e ricevi un riscontro dopo il controllo della disponibilità. IschiaMotion rende il noleggio a Ischia più chiaro, locale e guidato." : "Choose the option that fits your trip, send a request and receive a reply after availability is reviewed. IschiaMotion makes rental planning in Ischia clearer, local and easier to manage."}</p>
        <a href="#prenota" className="primary-btn">
          {locale === "it" ? "Richiedi disponibilità →" : "Request availability →"}
        </a>
      </div>
    </section>
  );
}
