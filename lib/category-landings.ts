import type { Locale } from "@/lib/types";

export type CategoryLandingKey =
  | "auto"
  | "ebike"
  | "gommone"
  | "barca"
  | "beach_club";

export type CategoryLandingContent = {
  locale: Locale;
  key: CategoryLandingKey;
  path: string;
  alternatePath: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword?: string;
  eyebrow: string;
  description: string;
  microcopy: string;
  cardTitle: string;
  cardText: string;
  primaryCta: string;
  secondaryCta: string;
  categoryParam: string;
  benefitsTitle: string;
  benefits: Array<[string, string]>;
  zonesTitle: string;
  zonesText: string;
  inspirationTitle?: string;
  inspirationText?: string;
  howTitle: string;
  steps: Array<[string, string]>;
  whenTitle: string;
  whenItems: Array<[string, string]>;
  faqs: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalText: string;
};

const commonIt = {
  primaryCta: "Verifica disponibilità e prezzo",
  secondaryCta: "Ricevi disponibilità su WhatsApp",
  benefitsTitle: "Perché usare IschiaMotion",
  zonesTitle: "Zone servite a Ischia",
  howTitle: "Come funziona",
  steps: [
    ["Scegli categoria e date", "Imposti il tipo di mezzo, le date e la modalità più comoda tra le opzioni previste."],
    ["Richiedi disponibilità", "La richiesta arriva a IschiaMotion con i dettagli utili per controllare disponibilità e condizioni."],
    ["Controllo con i partner", "Collaboriamo con operatori scelti per affidabilità, disponibilità e conoscenza del territorio."],
    ["Ricevi la proposta in pochi minuti", "Ti rispondiamo rapidamente con disponibilità, punto ritiro o consegna e prossimi passaggi."]
  ] as Array<[string, string]>
};

const commonEn = {
  primaryCta: "Check availability and price",
  secondaryCta: "Get availability on WhatsApp",
  benefitsTitle: "Why use IschiaMotion",
  zonesTitle: "Areas in Ischia",
  howTitle: "How it works",
  steps: [
    ["Choose category and dates", "Select the vehicle type, dates and the most convenient option where available."],
    ["Check availability", "Your request reaches IschiaMotion with the details needed to review availability and conditions."],
    ["Partner review", "We work with operators selected for reliability, availability and local knowledge."],
    ["Get your proposal in minutes", "We reply quickly with availability, pickup or delivery details and next steps."]
  ] as Array<[string, string]>
};

export const categoryLandings: Record<Locale, Record<CategoryLandingKey, CategoryLandingContent>> = {
  it: {
    auto: {
      ...commonIt,
      locale: "it",
      key: "auto",
      path: "/it/noleggio-auto-ischia",
      alternatePath: "/en/car-rental-ischia",
      title: "Noleggio auto a Ischia: trova la soluzione giusta in pochi minuti",
      metaTitle: "Noleggio auto a Ischia | IschiaMotion",
      metaDescription: "Richiedi un’auto a Ischia. Verifica disponibilità, ritiro al porto e consegna dove prevista tramite partner locali.",
      primaryKeyword: "noleggio auto Ischia",
      eyebrow: "Auto a Ischia",
      description: "Indicaci date, zona di soggiorno e numero di persone: controlliamo rapidamente le auto disponibili e ti inviamo una proposta chiara con prezzo e condizioni. Più comfort per famiglie, bagagli e spostamenti sull'isola: evita chiamate e preventivi diversi, invia una sola richiesta e troviamo l'auto più comoda per il tuo soggiorno. Auto disponibili a partire da € 30 al giorno, secondo periodo, durata del noleggio e modello disponibile. Ritiro presso porto, punto convenzionato o consegna in hotel dove disponibile.",
      microcopy: "Disponibilità, prezzo e condizioni in pochi minuti negli orari operativi.",
      cardTitle: "Famiglie, coppie e bagagli",
      cardText: "L'auto è pratica quando devi muoverti tra Ischia Porto, Forio, Lacco Ameno, Barano e Sant'Angelo con più comfort.",
      primaryCta: "Verifica auto disponibili",
      categoryParam: "auto",
      howTitle: "Disponibilità tramite partner locali",
      benefits: [
        ["Partner scelti con cura", "Collaboriamo con operatori locali selezionati per affidabilità, disponibilità e conoscenza del territorio."],
        ["Richiesta rapida", "Indichi date, preferenze e zona: verifichiamo subito la disponibilità e ti rispondiamo in pochi minuti."],
        ["Ritiro o consegna dove previsto", "Per le auto possono essere disponibili porto, hotel o punti concordati, secondo condizioni partner."],
        ["Prezzi chiari", "I prezzi a partire da riflettono le opzioni più richieste: ti confermiamo il totale in pochi minuti in base a date, durata e modello."]
      ],
      zonesText: "L'auto è utile quando l'arrivo a Ischia Porto o Casamicciola non coincide con la zona del soggiorno. Forio e Lacco Ameno sono pratiche per spiagge e hotel sul versante occidentale; Barano e Sant'Angelo richiedono più attenzione a distanze e orari. Puoi indicare struttura ricettiva, porto o punto preferito: disponibilità e consegna vengono sempre verificate con il partner.",
      whenTitle: "Quando conviene l'auto",
      whenItems: [
        ["Famiglie e gruppi", "Più spazio per persone, borse e passeggini rispetto a scooter o e-bike."],
        ["Hotel lontani dal porto", "Comoda se la struttura è a Forio, Barano, Sant'Angelo o in una zona meno centrale."],
        ["Più comuni in un giorno", "Utile per visitare spiagge, borghi e ristoranti senza dipendere solo da bus o taxi."],
        ["Quando evitarla", "Se viaggi leggero e resti tra porto e centro, scooter o e-bike possono essere più semplici per parcheggio e traffico."]
      ],
      faqs: [
        { question: "Quanto costa il noleggio auto a Ischia?", answer: "Dipende da periodo, durata, categoria e disponibilità dei partner. IschiaMotion mostra prezzi a partire da e verifica le condizioni finali dopo la richiesta." },
        { question: "Posso richiedere consegna in hotel?", answer: "Indica hotel o struttura ricettiva e zona: controlliamo subito la disponibilità della consegna con il partner locale." },
        { question: "La prenotazione è confermata subito?", answer: "Verifichiamo subito le soluzioni disponibili per le tue date e ti rispondiamo in pochi minuti negli orari operativi con la proposta finale prima della conferma." },
        { question: "Serve una carta o cauzione?", answer: "Eventuali cauzioni, documenti e condizioni vengono comunicati dopo verifica con il partner locale." },
        { question: "Posso ritirare l'auto al porto di Ischia?", answer: "Puoi indicare Ischia Porto o un punto comodo: verifichiamo subito la disponibilità del ritiro e ti rispondiamo in pochi minuti." },
        { question: "L'auto conviene per Sant'Angelo o Barano?", answer: "Sì, spesso è utile per strutture o itinerari fuori dalle zone centrali. Orari, ritiro e parcheggi vanno però valutati in base alla zona." },
        { question: "Posso richiedere un'auto per pochi giorni?", answer: "Puoi indicare le date desiderate. Durata minima, fasce orarie e condizioni dipendono dal partner disponibile." },
        { question: "IschiaMotion è il noleggiatore dell'auto?", answer: "No. IschiaMotion raccoglie la richiesta e la verifica tramite partner locali selezionati, mantenendo chiaro il modello di piattaforma." }
      ],
      finalTitle: "Vuoi verificare un'auto a Ischia?",
      finalText: "Imposta date e categoria: IschiaMotion controlla le opzioni disponibili tramite partner locali selezionati."
    },
    ebike: {
      ...commonIt,
      locale: "it",
      key: "ebike",
      path: "/it/noleggio-bici-elettriche-ischia",
      alternatePath: "/en/e-bike-rental-ischia",
      title: "Noleggio e-bike a Ischia: parti in pochi minuti",
      metaTitle: "Noleggio e-bike a Ischia | IschiaMotion",
      metaDescription: "Richiedi un’e-bike a Ischia. Verifica disponibilità, ritiro, autonomia e percorsi tramite partner locali selezionati.",
      primaryKeyword: "noleggio e-bike Ischia",
      eyebrow: "E-bike a Ischia",
      description: "Indicaci date e zona di soggiorno: verifichiamo rapidamente con partner locali selezionati e ti inviamo disponibilità, prezzo e condizioni dell'e-bike più adatta. È il modo più agile per muoverti tra lungomare, borghi e percorsi panoramici, senza perdere tempo a confrontare tanti noleggiatori: con una sola richiesta troviamo per te le soluzioni disponibili nella tua zona. Prezzi a partire da tariffa giornaliera, in base a periodo, durata e disponibilità. Ritiro presso punto convenzionato o consegna in hotel dove disponibile.",
      microcopy: "Risposta in pochi minuti negli orari operativi.",
      cardTitle: "Muoversi leggeri",
      cardText: "Ideale per lungomare, borghi e percorsi panoramici, valutando sempre pendenze, distanza e condizioni del tragitto.",
      primaryCta: "Verifica e-bike disponibili",
      categoryParam: "bici",
      benefits: [
        ["Richiesta guidata", "Indichi date e preferenze: verifichiamo subito le soluzioni disponibili per le tue date."],
        ["Opzioni green", "Le e-bike sono utili per spostamenti brevi e medi con un impatto più leggero."],
        ["Supporto locale", "IschiaMotion ti orienta verso opzioni compatibili con zona e periodo."],
        ["Risposta rapida", "Prezzi e condizioni finali arrivano in pochi minuti, in base a disponibilità e durata."]
      ],
      zonesText: "Ischia Porto, Casamicciola, Forio e Lacco Ameno sono adatte a spostamenti brevi, lungomare e soste frequenti. Barano e Sant'Angelo richiedono più attenzione a pendenze, autonomia e traffico. Se parti da hotel o struttura ricettiva, indica la zona: consegna e ritiro dipendono dal partner e vengono verificati prima della conferma.",
      whenTitle: "Quando conviene l'e-bike",
      whenItems: [
        ["Borghi e lungomare", "Perfetta per spostamenti agili, soste fotografiche e tratti non troppo lunghi."],
        ["Turismo green", "Adatta a chi vuole ridurre l'uso dell'auto e vivere l'isola con calma."],
        ["Percorsi panoramici", "Utile su tragitti selezionati, prestando attenzione alle pendenze dell'isola."],
        ["Quando valutare altro", "Con bagagli, bambini piccoli o tratte molto ripide, auto o scooter possono essere più pratici."]
      ],
      faqs: [
        { question: "Le bici elettriche sono adatte a tutta Ischia?", answer: "Ischia ha salite e strade strette: conviene scegliere percorsi adatti e verificare autonomia e condizioni con il partner." },
        { question: "Posso richiedere e-bike vicino al porto?", answer: "Puoi indicare Ischia Porto o un'altra zona; la disponibilità viene verificata dopo la richiesta." },
        { question: "Il casco è incluso?", answer: "Dotazioni e accessori dipendono dal partner selezionato e vengono confermati dopo verifica." },
        { question: "Quanto costa il noleggio e-bike a Ischia?", answer: "Il prezzo varia in base a durata, periodo e disponibilità. IschiaMotion raccoglie la richiesta e verifica le opzioni." },
        { question: "La richiesta conferma subito il mezzo?", answer: "Verifichiamo subito le opzioni disponibili e ti rispondiamo in pochi minuti negli orari operativi con la proposta finale." },
        { question: "Posso usare l'e-bike per Forio e Lacco Ameno?", answer: "Sì, sono zone spesso adatte a spostamenti leggeri e panoramici, valutando sempre distanza, autonomia e punto di ritiro." },
        { question: "Le pendenze di Ischia sono un problema?", answer: "Possono esserlo su alcune tratte interne o verso zone alte. Conviene indicare percorso e livello di esperienza nella richiesta." },
        { question: "Posso richiedere consegna presso hotel?", answer: "Indicaci hotel o struttura: controlliamo rapidamente le opzioni disponibili e ti confermiamo la consegna in pochi minuti." }
      ],
      finalTitle: "Vuoi muoverti in e-bike?",
      finalText: "Invia una richiesta e verifica le opzioni disponibili per bici elettriche a Ischia."
    },
    gommone: {
      ...commonIt,
      locale: "it",
      key: "gommone",
      path: "/it/noleggio-gommoni-ischia",
      alternatePath: "/en/rubber-dinghy-rental-ischia",
      title: "Noleggio gommoni a Ischia: la tua giornata in mare parte da qui",
      metaTitle: "Noleggio gommoni a Ischia | IschiaMotion",
      metaDescription: "Richiedi un gommone a Ischia. Verifica disponibilità, patente, punto nautico e meteo tramite partner locali selezionati.",
      primaryKeyword: "noleggio gommoni Ischia",
      eyebrow: "Gommoni a Ischia",
      description: "Comunicaci data, numero di persone e preferenze: verifichiamo rapidamente le barche disponibili e ti proponiamo in pochi minuti la soluzione più adatta. Scopri Ischia dal mare senza perdere tempo a cercare tra tanti operatori: con una sola richiesta puoi ricevere proposte per gommoni, barche con skipper o soluzioni senza patente, secondo disponibilità. Soluzioni disponibili a partire da € 150 al giorno, in base al periodo, alla durata, alla tipologia di imbarcazione e ai servizi richiesti. Partenza da punti nautici convenzionati, con possibilità di valutare soluzioni con o senza skipper.",
      microcopy: "Ti rispondiamo in pochi minuti con disponibilità, prezzo e condizioni.",
      cardTitle: "Costa e calette",
      cardText: "Per le categorie nautiche il ritiro avviene presso IschiaMotion Point o punto definito, non con consegna in hotel.",
      primaryCta: "Verifica gommoni disponibili",
      categoryParam: "gommone",
      howTitle: "Verifichiamo subito la disponibilità per le tue date",
      benefits: [
        ["Costa più vicina", "Il gommone è una soluzione agile per calette, tratti panoramici e giornate in mare intorno all'isola."],
        ["Meteo e mare controllati", "Disponibilità e uscita dipendono da mare, vento, periodo e condizioni operative del partner: verifichiamo tutto in pochi minuti."],
        ["Punto ritiro definito", "Per gommoni e nautica si usa un punto concordato o IschiaMotion Point."],
        ["Partner scelti con cura", "La richiesta viene controllata con operatori locali selezionati per affidabilità e conoscenza della costa."]
      ],
      zonesText: "Per un gommone contano soprattutto punto nautico, costa da raggiungere e rientro. Ischia Porto e Casamicciola sono pratici per chi arriva sull'isola; Forio, Lacco Ameno, San Montano e Sant'Angelo aiutano a orientare calette e tratti panoramici. Citara e Maronti sono riferimenti utili per immaginare la giornata in mare, mentre la partenza resta legata ai punti definiti dai partner.",
      inspirationTitle: "Idee per una giornata in gommone a Ischia",
      inspirationText: "Con un gommone puoi vivere Ischia dal mare, raggiungendo baie, calette e tratti di costa suggestivi tra Lacco Ameno, Forio, Sant'Angelo, Maronti e altre zone dell'isola. L'itinerario dipende sempre da meteo, mare, disponibilità e indicazioni del partner locale.",
      whenTitle: "Quando conviene il gommone",
      whenItems: [
        ["Giornata in mare", "Adatto a chi vuole vivere costa, calette e soste panoramiche con un mezzo nautico agile."],
        ["Piccoli gruppi", "Utile per uscite tra amici o famiglia, secondo capienza e condizioni partner."],
        ["Alternativa alla barca", "Più essenziale e maneggevole rispetto ad alcune barche, ma con meno comfort secondo modello."],
        ["Quando scegliere un beach club", "Se preferisci lettino riservato, ombrellone e servizi a terra, valuta un beach club."]
      ],
      faqs: [
        { question: "Gommone e barca sono la stessa cosa?", answer: "No. Su IschiaMotion sono categorie separate: il gommone ha caratteristiche, disponibilità e condizioni diverse dalla barca." },
        { question: "Posso ricevere il gommone in hotel?", answer: "No. Per categorie nautiche il ritiro è presso punto definito o IschiaMotion Point, secondo indicazioni del partner." },
        { question: "La disponibilità dipende dal meteo?", answer: "Sì. Mare, vento e condizioni operative possono incidere sulla conferma finale." },
        { question: "Serve patente nautica?", answer: "Verifichiamo subito i requisiti in base al mezzo scelto e te li indichiamo chiaramente nella proposta, prima della conferma." },
        { question: "Noleggio gommone Ischia prezzi: da cosa dipendono?", answer: "I prezzi per il noleggio di un gommone a Ischia variano in base a periodo, durata, modello, porto di partenza, presenza di skipper e disponibilità. Invii una richiesta e ricevi una proposta aggiornata in pochi minuti negli orari operativi." },
        { question: "Da dove si ritira un gommone a Ischia?", answer: "Il punto viene indicato dopo verifica con il partner: può essere un punto nautico definito o IschiaMotion Point, non una consegna in hotel." },
        { question: "Posso indicare una zona di partenza preferita?", answer: "Sì. Puoi indicare Ischia Porto, Forio, Lacco Ameno, Sant'Angelo o un'altra zona utile: verifichiamo subito la fattibilità con i nostri partner locali." },
        { question: "Cosa succede se il mare non è adatto?", answer: "La sicurezza e le condizioni operative prevalgono. Il partner può modificare o non confermare l'uscita in base al meteo-mare." }
      ],
      finalTitle: "Vuoi verificare un gommone?",
      finalText: "Invia una richiesta per controllare disponibilità, condizioni e punto ritiro con partner selezionati."
    },
    barca: {
      ...commonIt,
      locale: "it",
      key: "barca",
      path: "/it/noleggio-barche-ischia",
      alternatePath: "/en/boat-rental-ischia",
      title: "Noleggio barche a Ischia: la tua giornata in mare parte da qui",
      metaTitle: "Noleggio barche a Ischia | IschiaMotion",
      metaDescription: "Richiedi una barca a Ischia. Verifica disponibilità, partenza, requisiti e meteo tramite partner locali selezionati.",
      primaryKeyword: "noleggio barche Ischia",
      eyebrow: "Barche a Ischia",
      description: "Comunicaci data, numero di persone e preferenze: verifichiamo rapidamente le barche disponibili e ti proponiamo in pochi minuti la soluzione più adatta. Scopri Ischia dal mare con più spazio e comfort, senza perdere tempo a cercare tra tanti operatori: con una sola richiesta puoi ricevere proposte con o senza skipper, secondo disponibilità e requisiti. Prezzi in base a periodo, durata, modello e servizi richiesti. Partenza da punti nautici convenzionati.",
      microcopy: "Ti rispondiamo in pochi minuti con disponibilità, prezzo e condizioni.",
      cardTitle: "Uscite in mare",
      cardText: "Verifichiamo subito requisiti e condizioni con i partner locali. Per una giornata relax a terra puoi valutare un beach club.",
      primaryCta: "Verifica barche disponibili",
      categoryParam: "barca",
      benefits: [
        ["Esperienza su misura", "La richiesta viene abbinata in pochi minuti a opzioni compatibili con periodo, disponibilità e tipo di giornata in mare."],
        ["Condizioni chiare", "Requisiti, documenti, meteo e condizioni finali arrivano rapidamente, prima della conferma."],
        ["Punti nautici definiti", "Il ritiro per barche avviene presso punto indicato o IschiaMotion Point, non in hotel."]
      ],
      zonesText: "Le barche sono legate ai punti nautici disponibili più che alla consegna in hotel. Ischia Porto è uno dei punti più richiesti per organizzare il noleggio di barche e uscite in mare: verifichiamo subito disponibilità, punto di imbarco e condizioni con i nostri partner. Casamicciola, Forio, Lacco Ameno, San Montano e Sant'Angelo aiutano a definire costa e calette da raggiungere. Per chi cerca affitto barca a Ischia, indichiamo il punto di partenza in pochi minuti in base a disponibilità e organizzazione del partner.",
      inspirationTitle: "Vivere Ischia dal mare",
      inspirationText: "Il noleggio barca permette di scoprire l'isola da una prospettiva diversa, tra baie, coste panoramiche, soste bagno e itinerari personalizzati. Le soluzioni disponibili possono variare in base al periodo, alle condizioni meteo-marine e ai partner selezionati.",
      whenTitle: "Quando conviene la barca",
      whenItems: [
        ["Autonomia in mare", "Adatta quando il partner prevede noleggio in autonomia e i requisiti sono rispettati."],
        ["Costa e calette", "Ideale per esplorare tratti di costa, soste in rada e panorami dal mare con tempi concordati."],
        ["Più comfort", "Rispetto al gommone può offrire più spazio, ombra o stabilità, secondo modello disponibile."],
        ["Quando scegliere altro", "Se preferisci lettini, ombrelloni e servizi a terra, valuta la pagina Beach Club."]
      ],
      faqs: [
        { question: "La barca è una prenotazione immediata?", answer: "Verifichiamo subito disponibilità, requisiti e condizioni con i nostri partner e ti rispondiamo in pochi minuti negli orari operativi." },
        { question: "Posso noleggiare barche senza patente?", answer: "Verifichiamo subito i requisiti in base al mezzo scelto e te li indichiamo chiaramente nella proposta, prima della conferma." },
        { question: "Il ritiro può avvenire in hotel?", answer: "No. Per le categorie nautiche il ritiro avviene presso punto definito o IschiaMotion Point." },
        { question: "Il meteo può bloccare l'uscita?", answer: "Sì. Condizioni meteo-marine e operative sono parte della verifica." },
        { question: "Quanto costa noleggiare una barca a Ischia?", answer: "Il prezzo varia per date, durata, modello, disponibilità e condizioni partner." },
        { question: "Che differenza c'è tra barca e gommone?", answer: "La barca può offrire più comfort e spazio; il gommone è spesso più agile ed essenziale. La scelta dipende da gruppo, rotta e disponibilità." },
        { question: "Posso richiedere il noleggio barche a Ischia Porto?", answer: "Ischia Porto è uno dei punti più richiesti per organizzare uscite in barca, ma disponibilità, punto di imbarco e condizioni vengono sempre confermati dopo verifica con il partner. Puoi indicarlo come preferenza nella richiesta." },
        { question: "IschiaMotion conferma subito la barca?", answer: "Controlliamo subito le opzioni disponibili con i nostri partner e ti inviamo una proposta in pochi minuti negli orari operativi." }
      ],
      finalTitle: "Cerchi una barca a Ischia?",
      finalText: "Invia una richiesta e verifica disponibilità reale, condizioni e punto ritiro."
    },
    beach_club: {
      ...commonIt,
      locale: "it",
      key: "beach_club",
      path: "/it/beach-club-ischia",
      alternatePath: "/en/ischia-beach-club",
      title: "Beach Club a Ischia",
      metaTitle: "Beach Club a Ischia | IschiaMotion",
      metaDescription: "Richiedi un Beach Club a Ischia con lettini, ombrelloni e servizi mare presso strutture locali selezionate.",
      eyebrow: "Beach Club a Ischia",
      description: "Indicaci data, numero di persone e preferenze: verifichiamo rapidamente le disponibilità presso strutture locali selezionate e ti inviamo in pochi minuti lettini, servizi e condizioni. Vivi il mare senza pensieri e senza contattare più stabilimenti: con una sola richiesta troviamo per te la soluzione più comoda nella tua zona.",
      microcopy: "Risposta in pochi minuti negli orari operativi.",
      cardTitle: "Relax, lettini e servizi mare",
      cardText: "Richiedi lettini, ombrelloni e servizi mare dove disponibili tramite strutture locali selezionate.",
      primaryCta: "Verifica Beach Club disponibili",
      categoryParam: "beach_club",
      howTitle: "Richiesta rapida tramite strutture locali selezionate",
      steps: [
        ["Scegli data e preferenze", "Indichi giorno, numero di persone, zona preferita, lettini, ombrelloni o servizi desiderati."],
        ["Invia la richiesta", "La richiesta arriva a IschiaMotion con i dettagli utili per verificare disponibilità e condizioni della struttura."],
        ["Verifichiamo subito con i partner", "Controlliamo le opzioni con beach club, stabilimenti e partner locali selezionati."],
        ["Ricevi la proposta in pochi minuti", "Ti rispondiamo rapidamente con disponibilità, servizi confermati e prossimi passaggi."]
      ],
      benefits: [
        ["Lettino riservato", "Un beach club ti permette di vivere il mare senza pensieri con lettino, ombrellone e servizi in spiaggia."],
        ["Servizi curati", "Ristorazione, assistenza e ambienti organizzati rendono la giornata più semplice per coppie, famiglie e gruppi."],
        ["Partner selezionati", "IschiaMotion ti aiuta a contattare strutture e partner locali selezionati, senza presentarsi come gestore diretto."],
        ["Richiesta facile", "Indichi data, persone, fascia oraria, zona preferita ed eventuali esigenze per ricevere supporto mirato."]
      ],
      zonesText: "Ischia offre spiagge e baie diverse tra loro: zone sabbiose, scorci panoramici, stabilimenti eleganti e luoghi perfetti per una giornata lenta e rigenerante. Attraverso IschiaMotion puoi inviare una richiesta e ricevere supporto per trovare la soluzione più adatta alle tue esigenze.",
      whenTitle: "Beach club a Ischia: relax, mare e panorami",
      whenItems: [
        ["Lettini e ombrelloni", "Puoi richiedere soluzioni con lettini, ombrelloni e servizi spiaggia in base alla disponibilità."],
        ["Accesso giornaliero", "Ideale per organizzare una giornata intera o una fascia oraria al mare con più comfort."],
        ["Pranzo o aperitivo vista mare", "Puoi indicare preferenze per ristorazione, aperitivo o altri servizi dove disponibili presso strutture selezionate."],
        ["Coppie, famiglie e gruppi", "La richiesta può includere numero persone, adulti e bambini, zona preferita e note cliente."]
      ],
      faqs: [
        { question: "IschiaMotion gestisce direttamente i beach club?", answer: "No. IschiaMotion facilita la richiesta e il contatto con strutture e partner locali selezionati." },
        { question: "Cosa posso richiedere?", answer: "Puoi richiedere lettini, ombrelloni, accesso giornaliero, servizi spiaggia, pranzo o aperitivo vista mare." },
        { question: "La disponibilità è confermata subito?", answer: "Verifichiamo subito con la struttura o il partner locale e ti rispondiamo in pochi minuti negli orari operativi con la proposta finale." },
        { question: "È adatto a famiglie e gruppi?", answer: "Sì. Puoi indicare numero persone, adulti e bambini, fascia oraria e preferenze di zona." }
      ],
      finalTitle: "Vuoi organizzare una giornata in beach club?",
      finalText: "Invia una richiesta e ricevi supporto per trovare la soluzione più adatta tra strutture e partner locali selezionati."
    }
  },
  en: {
    auto: {
      ...commonEn,
      locale: "en",
      key: "auto",
      path: "/en/car-rental-ischia",
      alternatePath: "/it/noleggio-auto-ischia",
      title: "Car rental in Ischia: find the right option in minutes",
      metaTitle: "Car rental in Ischia | IschiaMotion",
      metaDescription: "Request a car in Ischia. Check availability, port pickup and hotel delivery where offered by selected local partners.",
      primaryKeyword: "car rental Ischia",
      eyebrow: "Cars in Ischia",
      description: "Share your dates, area of stay and number of guests: we quickly check available cars and send you a clear proposal with price and conditions. More comfort for families, luggage and getting around the island — skip the calls and mismatched quotes, send one request and we find the most comfortable car for your stay. Cars available from €30 a day, depending on season, rental length and available model. Pickup at the port, a partner point or hotel delivery where available.",
      microcopy: "Availability, price and conditions within minutes during operating hours.",
      cardTitle: "Families, couples and luggage",
      cardText: "A car is useful for Ischia Port, Forio, Lacco Ameno, Barano and Sant'Angelo when you need more comfort.",
      primaryCta: "Check available cars",
      categoryParam: "auto",
      howTitle: "Availability through local partners",
      benefits: [
        ["Carefully selected partners", "We work with local operators selected for reliability, availability and knowledge of the island."],
        ["Quick request", "Set dates, preferences and area: confirmation follows availability review."],
        ["Pickup or delivery where available", "For cars, port, hotel or agreed points may be available depending on partner conditions."],
        ["Clear starting prices", "Starting prices reflect our most requested options: we confirm the total within minutes based on dates, duration and model."]
      ],
      zonesText: "A car is useful when arriving at Ischia Port or Casamicciola and staying elsewhere. Forio and Lacco Ameno work well for west-side beaches and hotels; Barano and Sant'Angelo need better planning for distance and timing. Add your hotel, port or preferred point: delivery and pickup are always reviewed with the partner.",
      whenTitle: "When a car makes sense",
      whenItems: [
        ["Families and groups", "More space for people, bags and strollers than scooters or e-bikes."],
        ["Hotels far from the port", "Convenient if your accommodation is in Forio, Barano, Sant'Angelo or outside central areas."],
        ["Several towns in one day", "Useful for beaches, villages and restaurants without relying only on buses or taxis."],
        ["When to avoid it", "If you travel light and stay around the port or town center, scooter or e-bike may be easier for parking and traffic."]
      ],
      faqs: [
        { question: "How much does car rental in Ischia cost?", answer: "It depends on season, length, category and partner availability. IschiaMotion shows starting prices and checks final conditions after request." },
        { question: "Can I request hotel delivery?", answer: "Where offered by the partner and area, you can request hotel or accommodation delivery. Availability is always reviewed." },
        { question: "Is the booking instantly confirmed?", answer: "We check available options for your dates right away and reply within minutes during operating hours with the final proposal before you confirm." },
        { question: "Do I need a card or deposit?", answer: "Deposits, documents and conditions are communicated after review with the local partner." },
        { question: "Can I pick up at Ischia port?", answer: "You can indicate Ischia Port or a convenient point; pickup availability is confirmed after review." },
        { question: "Is a car useful for Sant'Angelo or Barano?", answer: "Often yes, especially for accommodation or routes outside central areas. Timing, pickup and parking should be considered by area." },
        { question: "Can I request a car for only a few days?", answer: "You can share your dates. Minimum length, timing and conditions depend on the available partner." },
        { question: "Is IschiaMotion the rental company?", answer: "No. IschiaMotion collects the request and reviews it through selected local partners as a rental request platform." }
      ],
      finalTitle: "Need a car in Ischia?",
      finalText: "Set dates and category: IschiaMotion checks available options through selected local partners."
    },
    ebike: {
      ...commonEn,
      locale: "en",
      key: "ebike",
      path: "/en/e-bike-rental-ischia",
      alternatePath: "/it/noleggio-bici-elettriche-ischia",
      title: "E-bike rental in Ischia: ready in minutes",
      metaTitle: "E-bike rental in Ischia | IschiaMotion",
      metaDescription: "Request an e-bike in Ischia. Check availability, pickup, range and routes through selected local partners.",
      eyebrow: "E-bikes in Ischia",
      description: "Share your dates and area of stay: we quickly check with selected local partners and send you availability, price and conditions for the right e-bike. It's the most agile way to move between seafronts, villages and scenic routes, without wasting time comparing rental operators — one request is enough for us to find the available options in your area. Prices from a daily rate, depending on season, duration and availability. Pickup at a partner point or hotel delivery where available.",
      microcopy: "A reply within minutes during operating hours.",
      cardTitle: "Move lightly",
      cardText: "Great for seafronts, villages and selected panoramic routes, always considering hills, distance and road conditions.",
      primaryCta: "Check available e-bikes",
      categoryParam: "bici",
      benefits: [
        ["Guided request", "Set your dates and preferences: we check available options for your dates right away."],
        ["Greener options", "E-bikes are useful for short and medium trips with a lighter footprint."],
        ["Local support", "IschiaMotion helps orient your request by area and season."],
        ["Fast response", "Prices and final terms arrive within minutes, based on availability and rental length."]
      ],
      zonesText: "Ischia Port, Casamicciola, Forio and Lacco Ameno suit short rides, seafront sections and frequent stops. Barano and Sant'Angelo require more attention to gradients, battery range and traffic. If you start from a hotel or accommodation, add the area: delivery and pickup depend on partner review.",
      whenTitle: "When an e-bike works well",
      whenItems: [
        ["Villages and seafronts", "Perfect for agile movement, photo stops and routes that are not too long."],
        ["Green travel", "Good for reducing car use and enjoying the island slowly."],
        ["Scenic routes", "Useful on selected routes, with attention to Ischia's hills."],
        ["When to choose another option", "With luggage, small children or very steep routes, car or scooter may be more practical."]
      ],
      faqs: [
        { question: "Are e-bikes suitable for all of Ischia?", answer: "Ischia has hills and narrow roads: choose suitable routes and review battery range and conditions with the partner." },
        { question: "Can I request an e-bike near the port?", answer: "You can indicate Ischia Port or another area; availability is reviewed after request." },
        { question: "Is a helmet included?", answer: "Equipment and accessories depend on the selected partner and are confirmed after review." },
        { question: "How much does e-bike rental in Ischia cost?", answer: "Price varies by duration, season and availability. IschiaMotion collects the request and checks options." },
        { question: "Does the request confirm the vehicle?", answer: "We check available options right away and reply within minutes during operating hours with the final proposal." },
        { question: "Can I use an e-bike around Forio and Lacco Ameno?", answer: "Yes, these areas can work well for light scenic rides, depending on distance, battery range and pickup point." },
        { question: "Are Ischia's hills difficult by e-bike?", answer: "Some inland or higher routes can be demanding. Share your planned route and riding experience in the request." },
        { question: "Can I request hotel delivery?", answer: "Where offered by the partner, you can request hotel or accommodation delivery. It is not automatic and is confirmed after review." }
      ],
      finalTitle: "Want to move by e-bike?",
      finalText: "Send a request and check available e-bike options in Ischia."
    },
    gommone: {
      ...commonEn,
      locale: "en",
      key: "gommone",
      path: "/en/rubber-dinghy-rental-ischia",
      alternatePath: "/it/noleggio-gommoni-ischia",
      title: "Rubber dinghy rental in Ischia: your day at sea starts here",
      metaTitle: "Rubber dinghy rental in Ischia | IschiaMotion",
      metaDescription: "Request a rubber dinghy in Ischia. Check availability, nautical pickup, licence requirements and weather.",
      eyebrow: "Rubber dinghies in Ischia",
      description: "Share the date, number of guests and preferences: we quickly check available boats and propose the best fit within minutes. Discover Ischia from the sea without wasting time comparing operators — one request is enough to receive options for rubber dinghies, skippered boats or license-free solutions, depending on availability. Options available from €150 a day, depending on season, duration, boat type and requested services. Departure from agreed nautical points, with or without a skipper.",
      microcopy: "We reply within minutes with availability, price and conditions.",
      cardTitle: "Coast and coves",
      cardText: "For nautical categories, pickup is at an IschiaMotion Point or defined point, not hotel delivery.",
      primaryCta: "Check available rubber dinghies",
      categoryParam: "gommone",
      howTitle: "We check availability for your dates right away",
      benefits: [
        ["Close to the coast", "A rubber dinghy or RIB is an agile choice for coves, scenic coastline and relaxed sea days around the island."],
        ["Weather and sea review", "Availability may depend on sea, wind, season and partner operating rules — we check it all within minutes."],
        ["Defined pickup point", "Rubber dinghies and nautical services use an agreed point or IschiaMotion Point."],
        ["Carefully selected partners", "We review the request with local operators selected for reliability and knowledge of the coast."]
      ],
      zonesText: "For a rubber dinghy or RIB, the nautical pickup point matters more than hotel location. Ischia Port and Casamicciola are useful for arrivals; Forio, Lacco Ameno, San Montano and Sant'Angelo help define coves and scenic coast. Citara and Maronti can shape the idea of the day at sea, while departure remains tied to partner-defined nautical points.",
      inspirationTitle: "Ideas for a day by rubber dinghy in Ischia",
      inspirationText: "A rubber dinghy lets you experience Ischia from the sea, reaching bays, coves and scenic coastline around Lacco Ameno, Forio, Sant'Angelo, Maronti and other island areas. The itinerary always depends on weather, sea conditions, availability and local partner guidance.",
      whenTitle: "When a rubber dinghy makes sense",
      whenItems: [
        ["Day at sea", "Good for enjoying coast, coves and scenic stops with an agile nautical option."],
        ["Small groups", "Useful for friends or family, depending on capacity and partner conditions."],
        ["Alternative to a boat", "Usually more essential and agile than some boats, but with less comfort depending on model."],
        ["When to choose a beach club", "If you prefer reserved sunbeds, umbrellas and services on shore, consider a beach club."]
      ],
      faqs: [
        { question: "Is a rubber dinghy the same as a boat?", answer: "No. On IschiaMotion they are separate categories with different availability and conditions." },
        { question: "Can it be delivered to a hotel?", answer: "No. Nautical categories use a defined pickup point or IschiaMotion Point." },
        { question: "Does weather affect availability?", answer: "Yes. Sea, wind and operational conditions can affect final confirmation." },
        { question: "Do I need a boating license?", answer: "It depends on the vehicle and partner conditions. Requirements and documents are reviewed before confirmation." },
        { question: "How much does rubber dinghy rental in Ischia cost?", answer: "Price varies by season, length, category and availability. Send a request and get an updated proposal within minutes during operating hours." },
        { question: "Where do I pick up a rubber dinghy in Ischia?", answer: "The point is shared after partner review: it may be a defined nautical point or IschiaMotion Point, not hotel delivery." },
        { question: "Can I request a preferred departure area?", answer: "Yes. You can mention Ischia Port, Forio, Lacco Ameno, Sant'Angelo or another useful area — we check feasibility with our partners right away." },
        { question: "What happens if sea conditions are not suitable?", answer: "Safety and operating conditions come first. The partner may adjust or not confirm the trip depending on marine weather." }
      ],
      finalTitle: "Want to check a rubber dinghy?",
      finalText: "Send a request to review availability, conditions and pickup point with selected partners."
    },
    barca: {
      ...commonEn,
      locale: "en",
      key: "barca",
      path: "/en/boat-rental-ischia",
      alternatePath: "/it/noleggio-barche-ischia",
      title: "Boat rental in Ischia: your day at sea starts here",
      metaTitle: "Boat rental in Ischia | IschiaMotion",
      metaDescription: "Request a boat in Ischia. Check availability, nautical pickup, requirements and weather through selected local partners.",
      eyebrow: "Boats in Ischia",
      description: "Share the date, number of guests and preferences: we quickly check available boats and propose the best fit within minutes. Discover Ischia from the sea with more space and comfort, without wasting time searching among operators — one request is enough to receive options with or without a skipper, depending on availability and requirements. Prices depend on season, duration, model and requested services. Departure from agreed nautical points.",
      microcopy: "We reply within minutes with availability, price and conditions.",
      cardTitle: "Days at sea",
      cardText: "Boat rental is available only where offered by partners, requirements and conditions. For a relaxed day on shore, consider a beach club.",
      primaryCta: "Check available boats",
      categoryParam: "barca",
      howTitle: "We check availability for your dates right away",
      benefits: [
        ["Matched options", "We match your request within minutes with suitable local partners and boats compatible with season and availability."],
        ["Clear conditions", "Requirements, documents, weather and final conditions arrive quickly, before confirmation."],
        ["Defined nautical points", "Boat pickup is at an indicated point or IschiaMotion Point, not hotel delivery."]
      ],
      zonesText: "Boat rental depends on nautical points rather than hotel delivery. Ischia Port and Casamicciola are convenient for arrivals and departures; Forio, Lacco Ameno, San Montano and Sant'Angelo help define coastal areas and coves. Citara and Maronti can shape the itinerary idea, while departure remains subject to the partner's confirmed point.",
      inspirationTitle: "Experience Ischia from the sea",
      inspirationText: "Boat rental lets you discover the island from a different perspective, with bays, panoramic coastline, swimming stops and personalized itinerary ideas. Available options may vary by season, marine weather and selected partners.",
      whenTitle: "When boat rental works well",
      whenItems: [
        ["Autonomy at sea", "Suitable when a partner offers independent rental and requirements are met."],
        ["Coast and coves", "Ideal for exploring selected coast areas, quiet stops and sea views with agreed timing and conditions."],
        ["More comfort", "Compared with a rubber dinghy, a boat may offer more space, shade or stability depending on model."],
        ["When to choose another option", "If you prefer sunbeds, umbrellas and seaside services, consider the Beach Club page."]
      ],
      faqs: [
        { question: "Is boat rental instantly confirmed?", answer: "We check availability, requirements and conditions with our partners right away and reply within minutes during operating hours." },
        { question: "Can I rent without a license?", answer: "It depends on the boat and partner conditions. Requirements and documents are reviewed before confirmation." },
        { question: "Can the boat be delivered to a hotel?", answer: "No. Nautical categories use a defined pickup point or IschiaMotion Point." },
        { question: "Can weather stop the trip?", answer: "Yes. Marine weather and operational conditions are part of the review." },
        { question: "How much does boat rental in Ischia cost?", answer: "Price varies by dates, duration, model, availability and partner conditions." },
        { question: "What is the difference between boat and rubber dinghy?", answer: "A boat may offer more comfort and space; a rubber dinghy is often more essential and agile. It depends on group, route and availability." },
        { question: "Can I choose the departure area?", answer: "You can share preferences such as Ischia Port, Forio or Sant'Angelo. The final point depends on partner availability." },
        { question: "Does IschiaMotion instantly confirm the boat?", answer: "We check the available options with our partners right away and send you a proposal within minutes during operating hours." }
      ],
      finalTitle: "Looking for a boat in Ischia?",
      finalText: "Send a request and review real availability, conditions and pickup point."
    },
    beach_club: {
      ...commonEn,
      locale: "en",
      key: "beach_club",
      path: "/en/ischia-beach-club",
      alternatePath: "/it/beach-club-ischia",
      title: "Beach clubs in Ischia",
      metaTitle: "Beach clubs in Ischia | IschiaMotion",
      metaDescription: "Request a Beach Club in Ischia with sunbeds, umbrellas and seaside services at selected local venues.",
      eyebrow: "Beach Clubs in Ischia",
      description: "Share the date, number of guests and preferences: we quickly check availability at selected local venues and send you sunbeds, services and conditions within minutes. Enjoy the sea without contacting several venues yourself — one request is enough for us to find the most comfortable option in your area.",
      microcopy: "A reply within minutes during operating hours.",
      cardTitle: "Sea, comfort and views",
      cardText: "Request sunbeds, umbrellas and seaside services where available through selected local venues.",
      primaryCta: "Check available Beach Clubs",
      categoryParam: "beach_club",
      howTitle: "A fast request through selected local venues",
      steps: [
        ["Choose date and preferences", "Share the date, number of guests, preferred area, sunbeds, umbrellas or requested services."],
        ["Send the request", "Your request reaches IschiaMotion with the details needed to review venue availability and conditions."],
        ["We check with partners right away", "We check options with beach clubs, seaside venues and selected local partners."],
        ["Get your proposal in minutes", "We reply quickly with availability, confirmed services and next steps."]
      ],
      benefits: [
        ["Reserved sunbeds", "A beach club allows you to enjoy the sea without stress with sunbeds, umbrellas and beach assistance."],
        ["Curated services", "Food, drinks, organized spaces and dedicated services make the day easier for couples, families and groups."],
        ["Selected local partners", "IschiaMotion helps you connect with selected venues and partners without acting as the direct operator."],
        ["Easy request", "Share date, guests, preferred timing, area, sunbed or umbrella needs and customer notes."]
      ],
      zonesText: "Ischia offers many different seaside locations: sandy beaches, panoramic bays, elegant beach venues and relaxing corners by the sea. Through IschiaMotion, you can send a request and receive support in finding the most suitable option for your needs.",
      whenTitle: "Beach clubs in Ischia: sea, comfort and views",
      whenItems: [
        ["Sunbeds and umbrellas", "You can request sunbeds, umbrellas and beach services depending on venue availability."],
        ["Daily access", "Ideal for organizing a full day or selected time slot by the sea with more comfort."],
        ["Seaside lunch or aperitif", "Share preferences for food, drinks or other services where available at selected local venues."],
        ["Couples, families and groups", "The request can include guest count, adults and children, preferred area and customer notes."]
      ],
      faqs: [
        { question: "Does IschiaMotion directly operate beach clubs?", answer: "No. IschiaMotion facilitates requests and contact with selected local venues and partners." },
        { question: "What can I request?", answer: "You can request sunbeds, umbrellas, daily access, beach services, seaside lunch or aperitif." },
        { question: "Is availability confirmed instantly?", answer: "We check with the selected venue or local partner right away and reply within minutes during operating hours with the final proposal." },
        { question: "Is it suitable for families and groups?", answer: "Yes. You can share guest count, adults and children, preferred timing and area." }
      ],
      finalTitle: "Want to plan a beach club day?",
      finalText: "Send a request and receive support in finding the most suitable option through selected local venues and partners."
    }
  }
};

export function getCategoryLanding(locale: Locale, key: CategoryLandingKey) {
  return categoryLandings[locale][key];
}
