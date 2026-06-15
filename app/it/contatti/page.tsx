import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata: Metadata = {
  title: "Contatti | IschiaMotion",
  description: "Contatta IschiaMotion per richieste di disponibilità noleggio a Ischia tramite partner locali selezionati.",
  alternates: {
    canonical: "/it/contatti",
    languages: { it: "/it/contatti", en: "/en/contact", "x-default": "/it" }
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
        cardText: "Luigi Schiano, Via Fundera, 104, Lacco Ameno, Ischia. P.IVA 10784981218.",
        sections: [
          {
            title: "WhatsApp",
            body: "Per una richiesta veloce puoi usare la CTA WhatsApp presente sul sito o scrivere a +39 329 685 6370. La disponibilità resta soggetta a verifica."
          },
          {
            title: "Email",
            body: "Puoi scrivere a info@ischiamotion.com indicando date, categoria mezzo, zona preferita e numero di persone, se utile."
          },
          {
            title: "Come funziona",
            body: "IschiaMotion raccoglie la tua richiesta e verifica le opzioni con noleggiatori o partner selezionati. Non promettiamo conferma immediata o disponibilità garantita."
          }
        ]
      }}
    />
  );
}
