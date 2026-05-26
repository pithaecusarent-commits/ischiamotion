import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata: Metadata = {
  title: "Termini | IschiaMotion",
  description: "Termini base di utilizzo di IschiaMotion per richieste di disponibilità tramite partner locali selezionati.",
  alternates: {
    canonical: "/it/termini",
    languages: { it: "/it/termini", en: "/en/terms", "x-default": "/it" }
  }
};

export default function TermsItPage() {
  return (
    <InfoPage
      locale="it"
      content={{
        eyebrow: "Termini",
        title: "Termini di utilizzo",
        intro: "Questi termini descrivono il funzionamento di IschiaMotion, piattaforma locale che facilita richieste di disponibilità per noleggi tramite partner selezionati.",
        cardTitle: "Richiesta, non conferma immediata",
        cardText: "Inviare una richiesta non significa avere una prenotazione confermata. IschiaMotion verifica disponibilità e dettagli con partner selezionati.",
        sections: [
          {
            title: "Ruolo di IschiaMotion",
            body: "IschiaMotion è una piattaforma locale che mette in contatto clienti e noleggiatori o partner selezionati a Ischia. Non dichiara di possedere direttamente i mezzi mostrati."
          },
          {
            title: "Richiesta disponibilità",
            body: "Il cliente indica categoria, date, punto ritiro o consegna e contatti. La richiesta viene presa in carico e verificata prima di qualsiasi conferma operativa."
          },
          {
            title: "Conferma dopo verifica",
            body: "La richiesta non costituisce prenotazione confermata finché non viene verificata. Disponibilità, condizioni finali, cauzioni e requisiti vengono comunicati dopo verifica con il partner."
          },
          {
            title: "Prezzi indicativi",
            body: "I prezzi indicati come “a partire da” sono orientativi e possono variare in base a date, durata, categoria, disponibilità, condizioni del partner e modalità di ritiro o consegna."
          },
          {
            title: "Pagamenti",
            body: "Il pagamento online automatico non è incluso salvo diversa indicazione. Eventuali acconti, saldi o pagamenti vengono definiti dopo la verifica con il partner locale."
          },
          {
            title: "Responsabilità del cliente",
            body: "Il cliente deve fornire dati corretti e aggiornati, inclusi contatti, date, preferenze di servizio e requisiti necessari per il mezzo richiesto."
          },
          {
            title: "Titolare",
            body: "IschiaMotion fa riferimento a Luigi Schiano, Via Fundera, 104, Lacco Ameno, Ischia. P.IVA 10784981218. Email: info@ischiamotion.com."
          }
        ]
      }}
    />
  );
}
