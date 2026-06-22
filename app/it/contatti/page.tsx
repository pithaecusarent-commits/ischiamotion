import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata: Metadata = {
  title: "Contatti IschiaMotion | Ischia",
  description: "Contatta IschiaMotion per richieste di scooter, auto, e-bike, gommoni, barche e servizi mare a Ischia.",
  alternates: {
    canonical: "/it/contatti",
    languages: { it: "/it/contatti", en: "/en/contact", "x-default": "/it/contatti" }
  }
};

export default function ContactItPage() {
  return (
    <InfoPage
      locale="it"
      content={{
        eyebrow: "Contatti",
        title: "Contatta IschiaMotion",
        intro: "Per richieste di disponibilità, informazioni sui mezzi o supporto operativo, puoi contattarci via email o WhatsApp.",
        cardTitle: "IschiaMotion",
        cardText: (
          <>
            Titolare: Luigi Schiano<br />
            Via Fundera, 104<br />
            80076 Lacco Ameno (NA), Ischia, Italia<br />
            P.IVA 10784981218<br />
            <a href="tel:+393296856370">+39 329 685 6370</a><br />
            <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a><br />
            <a href="/it">https://www.ischiamotion.com/it</a>
          </>
        ),
        sections: [
          {
            title: "WhatsApp",
            body: <>Per una richiesta veloce puoi usare la CTA WhatsApp presente sul sito o chiamare e scrivere al numero <a href="tel:+393296856370">+39 329 685 6370</a>. La disponibilità resta soggetta a verifica.</>
          },
          {
            title: "Email",
            body: <>Puoi scrivere a <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a> indicando date, categoria mezzo, zona preferita e numero di persone, se utile.</>
          },
          {
            title: "Come funziona",
            body: "IschiaMotion raccoglie la tua richiesta e verifica disponibilità, condizioni e conferma con partner locali selezionati sull’isola."
          },
          {
            title: "Sede e indicazioni",
            body: <>Consulta il riferimento su <a href="https://www.google.com/maps/search/?api=1&query=Via%20Fundera%20104%2C%2080076%20Lacco%20Ameno%20NA" target="_blank" rel="noopener noreferrer">Google Maps</a>. L’indirizzo indica il riferimento locale e amministrativo di IschiaMotion. Non è un punto di ritiro automatico né uno sportello aperto al pubblico: contattaci prima per ogni richiesta.</>
          }
        ],
        faqs: [
          {
            question: "Dove si trova IschiaMotion?",
            answer: "IschiaMotion ha il proprio riferimento locale e amministrativo in Via Fundera, 104, 80076 Lacco Ameno (NA), sull’isola d’Ischia. Non è un punto di ritiro automatico né uno sportello aperto al pubblico: contattaci prima per ogni richiesta."
          },
          {
            question: "IschiaMotion è un noleggiatore diretto?",
            answer: "IschiaMotion è una piattaforma locale che raccoglie richieste e verifica disponibilità e condizioni tramite partner selezionati. I mezzi e i servizi sono forniti dai rispettivi operatori locali."
          },
          {
            question: "In quali zone di Ischia è disponibile il servizio?",
            answer: "Le richieste possono riguardare Ischia Porto, Casamicciola, Lacco Ameno, Forio, Sant’Angelo e Barano. La copertura effettiva dipende dalla categoria, dal partner e dal periodo."
          },
          {
            question: "È possibile ritirare scooter o auto al porto o in hotel?",
            answer: "Puoi indicare porto, hotel o zona preferita nella richiesta. Ritiro e consegna dipendono dal mezzo, dalla zona e dal partner disponibile e vengono confermati solo dopo la verifica."
          }
        ]
      }}
    />
  );
}
