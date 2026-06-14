import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata: Metadata = {
  title: "Cookie Policy | IschiaMotion",
  description: "Cookie Policy di IschiaMotion: informazioni sui cookie tecnici utilizzati dal sito. Il sito non usa cookie di profilazione o tracciamento.",
  alternates: {
    canonical: "/it/cookie-policy",
    languages: { it: "/it/cookie-policy", en: "/en/cookie-policy", "x-default": "/it/cookie-policy" }
  },
  robots: { index: true, follow: true }
};

export default function CookiePolicyItPage() {
  return (
    <InfoPage
      locale="it"
      content={{
        eyebrow: "Cookie Policy",
        title: "Cookie Policy",
        intro: "Questa pagina descrive come IschiaMotion utilizza i cookie sul proprio sito. In conformità con la normativa vigente (art. 122 D.Lgs. 196/2003 e GDPR), IschiaMotion utilizza esclusivamente cookie tecnici necessari al funzionamento del servizio. Non è richiesto alcun consenso.",
        cardTitle: "Solo cookie tecnici",
        cardText: "Nessun cookie di profilazione, tracciamento pubblicitario o analisi del traffico. Nessun banner di consenso richiesto.",
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
            body: "IschiaMotion non utilizza Google Analytics, Matomo, Hotjar, Microsoft Clarity o altri strumenti di analisi del traffico web. Non vengono raccolti dati statistici tramite cookie."
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
