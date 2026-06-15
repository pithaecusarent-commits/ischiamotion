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
  eyebrow: string;
  description: string;
  cardTitle: string;
  cardText: string;
  primaryCta: string;
  secondaryCta: string;
  categoryParam: string;
  benefitsTitle: string;
  benefits: Array<[string, string]>;
  zonesTitle: string;
  zonesText: string;
  howTitle: string;
  steps: Array<[string, string]>;
  whenTitle: string;
  whenItems: Array<[string, string]>;
  faqs: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalText: string;
};

const commonIt = {
  primaryCta: "Verifica disponibilità",
  secondaryCta: "Contattaci su WhatsApp",
  benefitsTitle: "Perché usare IschiaMotion",
  zonesTitle: "Zone servite a Ischia",
  howTitle: "Come funziona",
  steps: [
    ["Scegli categoria e date", "Imposti il tipo di mezzo, le date e la modalità più comoda tra le opzioni previste."],
    ["Richiedi disponibilità", "La richiesta arriva a IschiaMotion con i dettagli utili per controllare disponibilità e condizioni."],
    ["Controllo con i partner", "Collaboriamo con operatori scelti per affidabilità, disponibilità e conoscenza del territorio."],
    ["Ricevi conferma", "Ti ricontattiamo con disponibilità, punto ritiro o consegna e prossimi passaggi."]
  ] as Array<[string, string]>
};

const commonEn = {
  primaryCta: "Check availability",
  secondaryCta: "Message us on WhatsApp",
  benefitsTitle: "Why use IschiaMotion",
  zonesTitle: "Areas in Ischia",
  howTitle: "How it works",
  steps: [
    ["Choose category and dates", "Select the vehicle type, dates and the most convenient option where available."],
    ["Check availability", "Your request reaches IschiaMotion with the details needed to review availability and conditions."],
    ["Partner review", "We work with operators selected for reliability, availability and local knowledge."],
    ["Receive confirmation", "We contact you with availability, pickup or delivery details and next steps."]
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
      title: "Noleggio auto a Ischia",
      metaTitle: "Noleggio Auto a Ischia | Partner locali IschiaMotion",
      metaDescription: "Richiedi un’auto a Ischia tramite partner locali selezionati. Verifica disponibilità, ritiro al porto e consegna dove prevista.",
      eyebrow: "Auto a Ischia",
      description: "Richiedi disponibilità per noleggio auto a Ischia tramite partner locali selezionati. Una soluzione comoda se arrivi con bagagli, viaggi in famiglia o devi muoverti tra porto, hotel e comuni dell'isola.",
      cardTitle: "Famiglie, coppie e bagagli",
      cardText: "L'auto è pratica quando devi muoverti tra Ischia Porto, Forio, Lacco Ameno, Barano e Sant'Angelo con più comfort.",
      categoryParam: "auto",
      howTitle: "Disponibilità tramite partner locali",
      benefits: [
        ["Partner scelti con cura", "Collaboriamo con operatori locali selezionati per affidabilità, disponibilità e conoscenza del territorio."],
        ["Richiesta rapida", "Indichi date, preferenze e zona: la conferma arriva dopo verifica della disponibilità."],
        ["Ritiro o consegna dove previsto", "Per le auto possono essere disponibili porto, hotel o punti concordati, secondo condizioni partner."],
        ["Prezzi chiari", "I prezzi a partire da sono indicativi: il totale dipende da date, durata e condizioni finali."]
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
        { question: "Posso richiedere consegna in hotel?", answer: "Dove previsto dal partner e dalla zona, puoi indicare consegna in hotel o struttura ricettiva. La disponibilità viene sempre verificata." },
        { question: "La prenotazione è confermata subito?", answer: "No. La richiesta viene ricevuta e poi verificata tramite partner locali selezionati prima della conferma." },
        { question: "Serve una carta o cauzione?", answer: "Eventuali cauzioni, documenti e condizioni vengono comunicati dopo verifica con il partner locale." },
        { question: "Posso ritirare l'auto al porto di Ischia?", answer: "Puoi indicare Ischia Porto o un punto comodo; la disponibilità del ritiro viene confermata dopo verifica." },
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
      title: "Noleggio bici elettriche a Ischia",
      metaTitle: "Noleggio bici elettriche Ischia: e-bike e percorsi",
      metaDescription: "Richiedi disponibilità per noleggio bici elettriche ed e-bike a Ischia tramite partner selezionati. Borghi, lungomare, pendenze e conferma dopo verifica.",
      eyebrow: "E-bike a Ischia",
      description: "Il noleggio bici elettriche a Ischia è ideale per spostamenti leggeri tra borghi, lungomare e percorsi panoramici. Per chi cerca noleggio bici a Ischia, le e-bike possono essere una soluzione comoda per affrontare salite, strade panoramiche e spostamenti tra le diverse zone dell'isola. Con IschiaMotion invii una richiesta e la disponibilità viene verificata tramite partner locali selezionati.",
      cardTitle: "Muoversi leggeri",
      cardText: "Ideale per lungomare, borghi e percorsi panoramici, valutando sempre pendenze, distanza e condizioni del tragitto.",
      categoryParam: "bici",
      benefits: [
        ["Richiesta guidata", "Indichi date e preferenze: la disponibilità viene controllata prima della conferma."],
        ["Opzioni green", "Le e-bike sono utili per spostamenti brevi e medi con un impatto più leggero."],
        ["Supporto locale", "IschiaMotion ti orienta verso opzioni compatibili con zona e periodo."],
        ["Trasparenza", "Prezzi e condizioni finali dipendono da disponibilità e durata."]
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
        { question: "La richiesta conferma subito il mezzo?", answer: "No. La conferma arriva solo dopo verifica disponibilità con partner locali selezionati." },
        { question: "Posso usare l'e-bike per Forio e Lacco Ameno?", answer: "Sì, sono zone spesso adatte a spostamenti leggeri e panoramici, valutando sempre distanza, autonomia e punto di ritiro." },
        { question: "Le pendenze di Ischia sono un problema?", answer: "Possono esserlo su alcune tratte interne o verso zone alte. Conviene indicare percorso e livello di esperienza nella richiesta." },
        { question: "Posso richiedere consegna presso hotel?", answer: "Dove previsto dal partner puoi indicare hotel o struttura. La consegna non è automatica e viene confermata dopo verifica." }
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
      title: "Noleggio gommoni a Ischia",
      metaTitle: "Noleggio Gommoni a Ischia | Partner locali IschiaMotion",
      metaDescription: "Richiedi un gommone a Ischia tramite partner locali selezionati. Verifica disponibilità, punto nautico, requisiti e condizioni meteo.",
      eyebrow: "Gommoni a Ischia",
      description: "Richiedi disponibilità per noleggio gommoni a Ischia tramite partner locali selezionati. Una scelta agile per vivere la costa, le calette e una giornata in mare, con ritiro presso punto nautico e condizioni meteo-marine sempre da verificare.",
      cardTitle: "Costa e calette",
      cardText: "Per le categorie nautiche il ritiro avviene presso IschiaMotion Point o punto definito, non con consegna in hotel.",
      categoryParam: "gommone",
      howTitle: "Verifica disponibilità prima della conferma",
      benefits: [
        ["Costa più vicina", "Il gommone è una soluzione agile per calette, tratti panoramici e giornate in mare intorno all'isola."],
        ["Meteo e mare controllati", "Disponibilità e uscita dipendono da mare, vento, periodo e condizioni operative del partner."],
        ["Punto ritiro definito", "Per gommoni e nautica si usa un punto concordato o IschiaMotion Point."],
        ["Partner scelti con cura", "La richiesta viene controllata con operatori locali selezionati per affidabilità e conoscenza della costa."]
      ],
      zonesText: "Per un gommone contano soprattutto punto nautico, costa da raggiungere e rientro. Ischia Porto e Casamicciola sono pratici per chi arriva sull'isola; Forio, Lacco Ameno, San Montano e Sant'Angelo aiutano a orientare calette e tratti panoramici. Citara e Maronti sono riferimenti utili per immaginare la giornata in mare, mentre la partenza resta legata ai punti definiti dai partner.",
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
        { question: "Serve patente nautica?", answer: "Dipende dal mezzo e dalle condizioni del partner. Requisiti e documenti vengono verificati prima della conferma." },
        { question: "Noleggio gommone Ischia prezzi: da cosa dipendono?", answer: "I prezzi per il noleggio di un gommone a Ischia possono variare in base a periodo, durata, modello, porto di partenza, presenza di skipper e disponibilità del partner. Con IschiaMotion puoi inviare una richiesta e ricevere una proposta aggiornata dopo verifica." },
        { question: "Da dove si ritira un gommone a Ischia?", answer: "Il punto viene indicato dopo verifica con il partner: può essere un punto nautico definito o IschiaMotion Point, non una consegna in hotel." },
        { question: "Posso indicare una zona di partenza preferita?", answer: "Sì. Puoi indicare Ischia Porto, Forio, Lacco Ameno, Sant'Angelo o un'altra zona utile; la fattibilità dipende dal partner." },
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
      title: "Noleggio barche a Ischia",
      metaTitle: "Noleggio barche Ischia: costa, calette e partner",
      metaDescription: "Richiedi disponibilità per noleggio barche a Ischia tramite partner selezionati. Costa, calette, requisiti, meteo e condizioni dopo verifica.",
      eyebrow: "Barche a Ischia",
      description: "Richiedi disponibilità per noleggio barche a Ischia tramite partner locali selezionati. Ideale per vivere la costa dal mare, tra calette, comfort a bordo e condizioni verificate prima della conferma.",
      cardTitle: "Uscite in mare",
      cardText: "Barca disponibile solo dove previsto da partner, requisiti e condizioni. Per una giornata relax a terra puoi valutare un beach club.",
      categoryParam: "barca",
      benefits: [
        ["Esperienza su misura", "La richiesta viene abbinata a opzioni compatibili con periodo, disponibilità e tipo di giornata in mare."],
        ["Condizioni chiare", "Requisiti, documenti, meteo e condizioni finali vengono comunicati prima della conferma."],
        ["Punti nautici definiti", "Il ritiro per barche avviene presso punto indicato o IschiaMotion Point, non in hotel."]
      ],
      zonesText: "Le barche sono legate ai punti nautici disponibili più che alla consegna in hotel. Ischia Porto è uno dei punti più richiesti per organizzare il noleggio di barche e uscite in mare, ma disponibilità, punto di imbarco e condizioni vengono sempre confermati dopo verifica con il partner. Casamicciola, Forio, Lacco Ameno, San Montano e Sant'Angelo aiutano a definire costa e calette da raggiungere. Per chi cerca affitto barca a Ischia, la partenza resta comunque soggetta al punto indicato dal partner.",
      whenTitle: "Quando conviene la barca",
      whenItems: [
        ["Autonomia in mare", "Adatta quando il partner prevede noleggio in autonomia e i requisiti sono rispettati."],
        ["Costa e calette", "Ideale per esplorare tratti di costa, soste in rada e panorami dal mare con tempi concordati."],
        ["Più comfort", "Rispetto al gommone può offrire più spazio, ombra o stabilità, secondo modello disponibile."],
        ["Quando scegliere altro", "Se preferisci lettini, ombrelloni e servizi a terra, valuta la pagina Beach Club."]
      ],
      faqs: [
        { question: "La barca è una prenotazione immediata?", answer: "No. IschiaMotion raccoglie la richiesta e verifica disponibilità, requisiti e condizioni con partner selezionati." },
        { question: "Posso noleggiare barche senza patente?", answer: "Dipende dal mezzo e dalle condizioni del partner. Requisiti e documenti vengono verificati prima della conferma." },
        { question: "Il ritiro può avvenire in hotel?", answer: "No. Per le categorie nautiche il ritiro avviene presso punto definito o IschiaMotion Point." },
        { question: "Il meteo può bloccare l'uscita?", answer: "Sì. Condizioni meteo-marine e operative sono parte della verifica." },
        { question: "Quanto costa noleggiare una barca a Ischia?", answer: "Il prezzo varia per date, durata, modello, disponibilità e condizioni partner." },
        { question: "Che differenza c'è tra barca e gommone?", answer: "La barca può offrire più comfort e spazio; il gommone è spesso più agile ed essenziale. La scelta dipende da gruppo, rotta e disponibilità." },
        { question: "Posso richiedere il noleggio barche a Ischia Porto?", answer: "Ischia Porto è uno dei punti più richiesti per organizzare uscite in barca, ma disponibilità, punto di imbarco e condizioni vengono sempre confermati dopo verifica con il partner. Puoi indicarlo come preferenza nella richiesta." },
        { question: "IschiaMotion conferma subito la barca?", answer: "No. IschiaMotion raccoglie la richiesta e verifica disponibilità, requisiti e condizioni con partner selezionati." }
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
      metaTitle: "Beach Club a Ischia | Lettini e servizi mare",
      metaDescription: "Richiedi disponibilità per Beach Club a Ischia. IschiaMotion ti connette con strutture locali selezionate per lettini e servizi mare.",
      eyebrow: "Beach Club a Ischia",
      description: "Richiedi disponibilità per Beach Club a Ischia tramite strutture locali selezionate. Puoi indicare preferenze per lettini, ombrelloni e servizi mare dove disponibili. IschiaMotion ti connette con partner locali e verifica disponibilità, condizioni e servizi prima della conferma.",
      cardTitle: "Relax, lettini e servizi mare",
      cardText: "Richiedi lettini, ombrelloni e servizi mare dove disponibili tramite strutture locali selezionate.",
      primaryCta: "Richiedi disponibilità Beach Club",
      categoryParam: "beach_club",
      howTitle: "Richiesta tramite strutture locali selezionate",
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
        { question: "La disponibilità è confermata subito?", answer: "No. La disponibilità viene verificata con la struttura o il partner locale prima della conferma." },
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
      title: "Car rental in Ischia",
      metaTitle: "Car Rental in Ischia | Local Partners | IschiaMotion",
      metaDescription: "Request a car in Ischia through selected local partners. Check availability, port pickup and hotel delivery where offered.",
      eyebrow: "Cars in Ischia",
      description: "Request car rental availability in Ischia through selected local partners. A practical option when arriving with luggage, travelling with family or moving between ports, hotels and island towns.",
      cardTitle: "Families, couples and luggage",
      cardText: "A car is useful for Ischia Port, Forio, Lacco Ameno, Barano and Sant'Angelo when you need more comfort.",
      categoryParam: "auto",
      howTitle: "Availability through local partners",
      benefits: [
        ["Carefully selected partners", "We work with local operators selected for reliability, availability and knowledge of the island."],
        ["Quick request", "Set dates, preferences and area: confirmation follows availability review."],
        ["Pickup or delivery where available", "For cars, port, hotel or agreed points may be available depending on partner conditions."],
        ["Clear starting prices", "Starting prices are indicative: final conditions depend on dates, duration and availability."]
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
        { question: "Is the booking instantly confirmed?", answer: "No. The request is received and then reviewed through selected local partners before confirmation." },
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
      title: "E-bike rental in Ischia",
      metaTitle: "E-bike rental Ischia: villages, seafronts and routes",
      metaDescription: "Request e-bike rental availability in Ischia through selected partners. Villages, seafronts, scenic routes, hills and confirmation after review.",
      eyebrow: "E-bikes in Ischia",
      description: "E-bike rental in Ischia suits visitors looking for lighter movement between villages, seafronts and scenic routes. With IschiaMotion, availability is reviewed through selected local partners.",
      cardTitle: "Move lightly",
      cardText: "Great for seafronts, villages and selected panoramic routes, always considering hills, distance and road conditions.",
      categoryParam: "bici",
      benefits: [
        ["Guided request", "You set dates and preferences: availability is checked before confirmation."],
        ["Greener options", "E-bikes are useful for short and medium trips with a lighter footprint."],
        ["Local support", "IschiaMotion helps orient your request by area and season."],
        ["Transparent conditions", "Prices and final terms depend on availability and rental length."]
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
        { question: "Does the request confirm the vehicle?", answer: "No. Confirmation arrives only after availability review with selected local partners." },
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
      title: "Rubber dinghy rental in Ischia",
      metaTitle: "Rubber dinghy rental Ischia: coves, coast and weather",
      metaDescription: "Request rubber dinghy rental availability in Ischia through selected partners. Coast, coves, nautical pickup point and weather review.",
      eyebrow: "Rubber dinghies in Ischia",
      description: "Request rubber dinghy or RIB rental availability in Ischia through selected local partners. An agile way to enjoy the coast, coves and a day at sea, with nautical pickup and marine weather always reviewed.",
      cardTitle: "Coast and coves",
      cardText: "For nautical categories, pickup is at an IschiaMotion Point or defined point, not hotel delivery.",
      categoryParam: "gommone",
      howTitle: "Check availability before confirmation",
      benefits: [
        ["Close to the coast", "A rubber dinghy or RIB is an agile choice for coves, scenic coastline and relaxed sea days around the island."],
        ["Weather and sea review", "Availability may depend on sea, wind, season and partner operating rules."],
        ["Defined pickup point", "Rubber dinghies and nautical services use an agreed point or IschiaMotion Point."],
        ["Carefully selected partners", "We review the request with local operators selected for reliability and knowledge of the coast."]
      ],
      zonesText: "For a rubber dinghy or RIB, the nautical pickup point matters more than hotel location. Ischia Port and Casamicciola are useful for arrivals; Forio, Lacco Ameno, San Montano and Sant'Angelo help define coves and scenic coast. Citara and Maronti can shape the idea of the day at sea, while departure remains tied to partner-defined nautical points.",
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
        { question: "How much does rubber dinghy rental in Ischia cost?", answer: "Price depends on season, length, category and availability. The request checks real options before confirmation." },
        { question: "Where do I pick up a rubber dinghy in Ischia?", answer: "The point is shared after partner review: it may be a defined nautical point or IschiaMotion Point, not hotel delivery." },
        { question: "Can I request a preferred departure area?", answer: "Yes. You can mention Ischia Port, Forio, Lacco Ameno, Sant'Angelo or another useful area; feasibility depends on the partner." },
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
      title: "Boat rental in Ischia",
      metaTitle: "Boat Rental in Ischia | Local Partners | IschiaMotion",
      metaDescription: "Request a boat in Ischia through selected local partners. Check availability, nautical pickup, requirements and marine conditions.",
      eyebrow: "Boats in Ischia",
      description: "Request boat rental availability in Ischia through selected local partners. Ideal for experiencing the coast from the sea, with coves, onboard comfort, pickup point and weather reviewed before confirmation.",
      cardTitle: "Days at sea",
      cardText: "Boat rental is available only where offered by partners, requirements and conditions. For a relaxed day on shore, consider a beach club.",
      categoryParam: "barca",
      howTitle: "Availability review through local partners",
      benefits: [
        ["Matched options", "We match your request with suitable local partners and boats compatible with season and availability."],
        ["Clear conditions", "Requirements, documents, weather and final conditions are shared before confirmation."],
        ["Defined nautical points", "Boat pickup is at an indicated point or IschiaMotion Point, not hotel delivery."]
      ],
      zonesText: "Boat rental depends on nautical points rather than hotel delivery. Ischia Port and Casamicciola are convenient for arrivals and departures; Forio, Lacco Ameno, San Montano and Sant'Angelo help define coastal areas and coves. Citara and Maronti can shape the itinerary idea, while departure remains subject to the partner's confirmed point.",
      whenTitle: "When boat rental works well",
      whenItems: [
        ["Autonomy at sea", "Suitable when a partner offers independent rental and requirements are met."],
        ["Coast and coves", "Ideal for exploring selected coast areas, quiet stops and sea views with agreed timing and conditions."],
        ["More comfort", "Compared with a rubber dinghy, a boat may offer more space, shade or stability depending on model."],
        ["When to choose another option", "If you prefer sunbeds, umbrellas and seaside services, consider the Beach Club page."]
      ],
      faqs: [
        { question: "Is boat rental instantly confirmed?", answer: "No. IschiaMotion collects the request and reviews availability, requirements and conditions with selected partners." },
        { question: "Can I rent without a license?", answer: "It depends on the boat and partner conditions. Requirements and documents are reviewed before confirmation." },
        { question: "Can the boat be delivered to a hotel?", answer: "No. Nautical categories use a defined pickup point or IschiaMotion Point." },
        { question: "Can weather stop the trip?", answer: "Yes. Marine weather and operational conditions are part of the review." },
        { question: "How much does boat rental in Ischia cost?", answer: "Price varies by dates, duration, model, availability and partner conditions." },
        { question: "What is the difference between boat and rubber dinghy?", answer: "A boat may offer more comfort and space; a rubber dinghy is often more essential and agile. It depends on group, route and availability." },
        { question: "Can I choose the departure area?", answer: "You can share preferences such as Ischia Port, Forio or Sant'Angelo. The final point depends on partner availability." },
        { question: "Does IschiaMotion instantly confirm the boat?", answer: "No. IschiaMotion collects the request and reviews availability, requirements and conditions with selected partners." }
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
      title: "Beach Clubs in Ischia",
      metaTitle: "Ischia Beach Clubs | Sunbeds and Seaside Services",
      metaDescription: "Request Beach Club availability in Ischia. IschiaMotion connects you with selected local venues for sunbeds and seaside services.",
      eyebrow: "Beach Clubs in Ischia",
      description: "Request Beach Club availability in Ischia through selected local venues. Share preferences for sunbeds, umbrellas and seaside services where available. IschiaMotion connects you with local partners and checks availability, conditions and services before confirmation.",
      cardTitle: "Sea, comfort and views",
      cardText: "Request sunbeds, umbrellas and seaside services where available through selected local venues.",
      primaryCta: "Request Beach Club availability",
      categoryParam: "beach_club",
      howTitle: "Request through selected local venues",
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
        { question: "Is availability confirmed instantly?", answer: "No. Availability is reviewed with the selected venue or local partner before confirmation." },
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
