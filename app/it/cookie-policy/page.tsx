import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cookie Policy | IschiaMotion",
  description: "Cookie Policy di IschiaMotion: informazioni sui cookie tecnici e analitici (Google Analytics 4, su consenso). Nessun cookie di profilazione o pubblicità.",
  alternates: {
    canonical: canonicalUrl("/it/cookie-policy"),
    languages: { it: canonicalUrl("/it/cookie-policy"), en: canonicalUrl("/en/cookie-policy"), "x-default": canonicalUrl("/it/cookie-policy") }
  }
};

export default function CookiePolicyItPage() {
  return (
    <InfoPage
      locale="it"
      content={{
        eyebrow: "Cookie Policy",
        title: "Cookie Policy",
        intro: "Questa pagina descrive come IschiaMotion utilizza i cookie sul proprio sito. In conformità con la normativa vigente (art. 122 D.Lgs. 196/2003 e GDPR), IschiaMotion utilizza cookie tecnici necessari al funzionamento del servizio e, previo consenso, cookie analitici tramite Google Analytics 4.",
        cardTitle: "Cookie tecnici + analytics su consenso",
        cardText: "Cookie di sessione tecnici sempre attivi. Cookie Google Analytics 4 attivati solo dopo il tuo consenso esplicito.",
        sections: [
          {
            title: "Cosa sono i cookie",
            body: "I cookie sono piccoli file di testo che un sito web salva nel browser quando viene visitato. Possono essere usati per far funzionare correttamente il sito, ricordare la sessione di accesso o raccogliere informazioni sul comportamento dell'utente. Solo l'ultimo tipo richiede consenso."
          },
          {
            title: "Cookie tecnici presenti su questo sito",
            body: "IschiaMotion imposta cookie di sessione esclusivamente per l'autenticazione delle aree riservate (area partner e area amministrativa). Questi cookie sono HTTP-only (non accessibili tramite JavaScript), hanno flag Secure e SameSite=Lax. Sono impostati dal servizio di autenticazione Supabase e durano fino al logout o alla scadenza della sessione. Non contengono dati personali né identificatori di tracciamento."
          },
          {
            title: "Cookie analytics",
            body: "IschiaMotion utilizza Google Analytics 4 per raccogliere dati anonimi sull'utilizzo del sito (pagine visitate, durata della sessione, tipo di dispositivo). Questo cookie viene attivato solo dopo il tuo consenso esplicito. Puoi revocare il consenso in qualsiasi momento tramite il link \"Gestisci cookie\" nel footer. Nessun dato è condiviso con terze parti per finalità pubblicitarie."
          },
          {
            title: "Cookie di terze parti",
            body: "Il sito non incorpora widget, mappe, video embed, pixel di tracciamento o script di terze parti che impostano cookie. Il link a Trustpilot apre un sito esterno in una nuova scheda e non comporta la scrittura di cookie su questo dominio."
          },
          {
            title: "Come gestire i cookie nel browser",
            body: "Puoi visualizzare, bloccare o eliminare i cookie in qualsiasi momento dalle impostazioni del browser. Ogni browser ha un percorso diverso: cerca \"cookie\" o \"privacy\" nelle impostazioni di Chrome, Firefox, Safari o Edge. La disattivazione dei cookie tecnici può impedire il corretto funzionamento delle aree riservate."
          },
          {
            title: "Informativa Privacy",
            body: (
              <>
                Per informazioni complete sul trattamento dei tuoi dati personali, consulta la nostra{" "}
                <a href="/it/privacy">Informativa Privacy</a>.
                Per domande sulla cookie policy scrivi a{" "}
                <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a>.
              </>
            )
          }
        ]
      }}
    />
  );
}
