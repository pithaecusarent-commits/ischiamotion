import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy | IschiaMotion",
  description: "Informativa privacy di IschiaMotion, piattaforma locale per richieste di noleggio tramite partner selezionati.",
  alternates: {
    canonical: canonicalUrl("/it/privacy"),
    languages: { it: canonicalUrl("/it/privacy"), en: canonicalUrl("/en/privacy"), "x-default": canonicalUrl("/it/privacy") }
  }
};

export default function PrivacyItPage() {
  return (
    <InfoPage
      locale="it"
      content={{
        eyebrow: "Privacy",
        title: "Informativa privacy",
        intro: "Questa informativa descrive in modo semplice come vengono trattati i dati inviati tramite IschiaMotion, piattaforma locale che facilita richieste di disponibilità per noleggi tramite partner selezionati.",
        cardTitle: "Titolare del trattamento",
        cardText: (
          <>
            IschiaMotion<br />
            Titolare: Luigi Schiano<br />
            Via Fundera, 104<br />
            80076 Lacco Ameno (NA), Ischia, Italia<br />
            P.IVA 10784981218<br />
            Tel. <a href="tel:+393296856370">+39 329 685 6370</a><br />
            Email: <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a><br />
            Sito: <a href="/it">https://www.ischiamotion.com/it</a>
          </>
        ),
        sections: [
          {
            title: "Dati raccolti",
            body: "Quando invii una richiesta possiamo raccogliere nome, cognome, email, telefono, date del noleggio, mezzo richiesto, modalità di ritiro o consegna e note inviate dall’utente."
          },
          {
            title: "Finalità",
            body: "Usiamo i dati per gestire la richiesta di disponibilità, contattare il cliente, organizzare il servizio tramite partner locali selezionati e inviare comunicazioni operative collegate alla richiesta."
          },
          {
            title: "Base giuridica",
            body: "Il trattamento si basa sull’esecuzione di misure precontrattuali richieste dall’utente e sul legittimo interesse alla gestione operativa, alla sicurezza e al corretto funzionamento del servizio."
          },
          {
            title: "Destinatari",
            body: "I dati possono essere trattati da personale autorizzato, partner locali selezionati solo quando necessario alla gestione della richiesta e fornitori tecnici come hosting, database ed email provider."
          },
          {
            title: "Conservazione",
            body: "I dati vengono conservati per il tempo necessario alla gestione della richiesta e per eventuali obblighi applicabili di natura organizzativa, amministrativa o normativa."
          },
          {
            title: "Diritti",
            body: "Puoi richiedere accesso, rettifica, cancellazione, limitazione, opposizione e proporre reclamo all’autorità competente. Per richieste privacy scrivi a info@ischiamotion.com."
          }
        ]
      }}
    />
  );
}
