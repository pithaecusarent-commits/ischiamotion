import type { Locale } from "@/lib/types";

export type CategoryLandingKey =
  | "auto"
  | "ebike"
  | "gommone"
  | "barca"
  | "skipper";

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
    ["Invia richiesta", "La richiesta arriva a IschiaMotion con i dettagli necessari per verificare disponibilità e condizioni."],
    ["Verifica con partner", "Controlliamo le opzioni tramite partner locali selezionati, senza esporre dati interni al pubblico."],
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
    ["Send a request", "Your request reaches IschiaMotion with the details needed to review availability and conditions."],
    ["Partner review", "We check options through selected local partners, without exposing internal partner data publicly."],
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
      metaTitle: "Noleggio auto Ischia: porto, hotel e partner locali",
      metaDescription: "Richiedi disponibilità per noleggio auto a Ischia tramite partner selezionati: porto, hotel dove previsto, famiglie, bagagli e comuni dell'isola.",
      eyebrow: "Auto a Ischia",
      description: "Richiedi disponibilità per noleggio auto a Ischia tramite partner locali selezionati. Una soluzione comoda se arrivi con bagagli, viaggi in famiglia o devi muoverti tra porto, hotel e comuni dell'isola.",
      cardTitle: "Famiglie, coppie e bagagli",
      cardText: "L'auto è pratica quando devi muoverti tra Ischia Porto, Forio, Lacco Ameno, Barano e Sant'Angelo con più comfort.",
      categoryParam: "auto",
      benefits: [
        ["Partner locali selezionati", "La richiesta viene verificata con operatori locali, mantenendo il modello marketplace corretto."],
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
      description: "Il noleggio bici elettriche a Ischia è ideale per spostamenti leggeri tra borghi, lungomare e percorsi panoramici. Con IschiaMotion invii una richiesta e la disponibilità viene verificata tramite partner locali selezionati.",
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
      metaTitle: "Noleggio gommoni Ischia: calette, costa e meteo",
      metaDescription: "Richiedi disponibilità per noleggio gommoni a Ischia tramite partner selezionati. Costa, calette, punto nautico e condizioni meteo da verificare.",
      eyebrow: "Gommoni a Ischia",
      description: "Richiedi disponibilità per noleggio gommoni a Ischia tramite partner locali selezionati. Una scelta agile per costa e calette, con ritiro presso punto nautico e condizioni meteo-marine sempre da verificare.",
      cardTitle: "Costa e calette",
      cardText: "Per le categorie nautiche il ritiro avviene presso IschiaMotion Point o punto definito, non con consegna in hotel.",
      categoryParam: "gommone",
      benefits: [
        ["Categoria distinta", "Il gommone viene gestito separatamente dalla barca, così la richiesta è più precisa."],
        ["Verifica meteo", "Disponibilità e uscita possono dipendere da condizioni del mare, periodo e regole partner."],
        ["Punto ritiro definito", "Per gommoni e nautica si usa un punto concordato o IschiaMotion Point."],
        ["Conferma dopo controllo", "Nessuna promessa immediata: la richiesta viene verificata prima della conferma."]
      ],
      zonesText: "Per un gommone contano soprattutto punto nautico, costa da raggiungere e rientro. Ischia Porto e Casamicciola sono pratici per chi arriva sull'isola; Forio, Lacco Ameno e Sant'Angelo aiutano a orientare calette e tratti panoramici. Barano è più utile come riferimento per itinerari via terra, mentre la partenza resta legata ai punti definiti dai partner.",
      whenTitle: "Quando conviene il gommone",
      whenItems: [
        ["Giornata in mare", "Adatto a chi vuole vivere costa e calette con un mezzo nautico agile."],
        ["Piccoli gruppi", "Utile per uscite tra amici o famiglia, secondo capienza e condizioni partner."],
        ["Alternativa alla barca", "Più essenziale e maneggevole rispetto ad alcune barche, ma con meno comfort secondo modello."],
        ["Quando scegliere skipper", "Se non vuoi gestire conduzione, rotta o meteo, meglio valutare una barca con skipper."]
      ],
      faqs: [
        { question: "Gommone e barca sono la stessa cosa?", answer: "No. Su IschiaMotion sono categorie separate: il gommone ha caratteristiche, disponibilità e condizioni diverse dalla barca." },
        { question: "Posso ricevere il gommone in hotel?", answer: "No. Per categorie nautiche il ritiro è presso punto definito o IschiaMotion Point, secondo indicazioni del partner." },
        { question: "La disponibilità dipende dal meteo?", answer: "Sì. Mare, vento e condizioni operative possono incidere sulla conferma finale." },
        { question: "Serve patente nautica?", answer: "Dipende dal mezzo e dalle condizioni del partner. Requisiti e documenti vengono verificati prima della conferma." },
        { question: "Quanto costa noleggiare un gommone a Ischia?", answer: "Il prezzo dipende da periodo, durata, categoria e disponibilità. La richiesta permette di verificare le opzioni reali." },
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
      description: "Richiedi disponibilità per noleggio barche a Ischia tramite partner locali selezionati. Ideale per vivere costa e calette dal mare, con requisiti, punto di ritiro e meteo verificati prima della conferma.",
      cardTitle: "Uscite in mare",
      cardText: "Barca senza skipper solo dove previsto da partner, requisiti e condizioni. Per esperienza guidata scegli la pagina skipper.",
      categoryParam: "barca",
      benefits: [
        ["Opzioni selezionate", "La richiesta viene orientata verso partner locali e mezzi compatibili con periodo e disponibilità."],
        ["Condizioni chiare", "Requisiti, documenti e condizioni finali vengono comunicati dopo verifica."],
        ["Punti nautici definiti", "Il ritiro per barche avviene presso punto indicato o IschiaMotion Point, non in hotel."]
      ],
      zonesText: "Le barche sono legate ai punti nautici disponibili più che alla consegna in hotel. Ischia Porto e Casamicciola sono riferimenti comodi per arrivi e partenze; Forio, Lacco Ameno e Sant'Angelo aiutano a definire costa e calette da raggiungere. Barano può rientrare nella pianificazione dell'itinerario terrestre, ma la partenza resta soggetta al punto indicato dal partner.",
      whenTitle: "Quando conviene la barca",
      whenItems: [
        ["Autonomia in mare", "Adatta quando il partner prevede noleggio senza skipper e i requisiti sono rispettati."],
        ["Costa e calette", "Ideale per esplorare tratti di costa con tempi e condizioni concordate."],
        ["Più comfort", "Rispetto al gommone può offrire più spazio, ombra o stabilità, secondo modello disponibile."],
        ["Quando scegliere skipper", "Se vuoi un'esperienza guidata o non vuoi gestire conduzione e rotta, meglio la pagina skipper."]
      ],
      faqs: [
        { question: "La barca include sempre lo skipper?", answer: "No. Questa pagina riguarda il noleggio barche; per esperienza guidata usa la pagina barca con skipper." },
        { question: "Posso noleggiare barche senza patente?", answer: "Dipende dal mezzo e dalle condizioni del partner. Requisiti e documenti vengono verificati prima della conferma." },
        { question: "Il ritiro può avvenire in hotel?", answer: "No. Per le categorie nautiche il ritiro avviene presso punto definito o IschiaMotion Point." },
        { question: "Il meteo può bloccare l'uscita?", answer: "Sì. Condizioni meteo-marine e operative sono parte della verifica." },
        { question: "Quanto costa noleggiare una barca a Ischia?", answer: "Il prezzo varia per date, durata, modello, disponibilità e condizioni partner." },
        { question: "Che differenza c'è tra barca e gommone?", answer: "La barca può offrire più comfort e spazio; il gommone è spesso più agile ed essenziale. La scelta dipende da gruppo, rotta e disponibilità." },
        { question: "Posso scegliere la zona di partenza?", answer: "Puoi indicare preferenze come Ischia Porto, Forio o Sant'Angelo. Il punto finale dipende dal partner e viene confermato dopo verifica." },
        { question: "IschiaMotion conferma subito la barca?", answer: "No. IschiaMotion raccoglie la richiesta e verifica disponibilità, requisiti e condizioni con partner selezionati." }
      ],
      finalTitle: "Cerchi una barca a Ischia?",
      finalText: "Invia una richiesta e verifica disponibilità reale, condizioni e punto ritiro."
    },
    skipper: {
      ...commonIt,
      locale: "it",
      key: "skipper",
      path: "/it/barca-con-skipper-ischia",
      alternatePath: "/en/boat-with-skipper-ischia",
      title: "Barca con skipper a Ischia",
      metaTitle: "Barca con skipper Ischia: esperienza guidata via mare",
      metaDescription: "Richiedi disponibilità per barca con skipper a Ischia tramite partner selezionati. Costa, calette, itinerario rilassato e conferma dopo verifica.",
      eyebrow: "Skipper a Ischia",
      description: "La barca con skipper a Ischia è pensata per chi vuole vivere il mare senza gestire conduzione, rotta o dettagli tecnici. IschiaMotion raccoglie la richiesta e verifica disponibilità, orari e condizioni tramite partner selezionati.",
      cardTitle: "Esperienza guidata",
      cardText: "Tour via mare, calette e costa con disponibilità partner da confermare prima della partenza.",
      categoryParam: "boat-with-skipper",
      benefits: [
        ["Meno pensieri", "Lo skipper gestisce conduzione e indicazioni operative secondo condizioni del partner."],
        ["Itinerari via mare", "Una soluzione per scoprire costa, calette e panorami con guida locale."],
        ["Richiesta verificata", "Disponibilità, orari e condizioni vengono confermati dopo controllo."],
        ["Supporto WhatsApp", "Puoi chiarire esigenze e preferenze prima della verifica finale."]
      ],
      zonesText: "Per un'uscita con skipper contano punto di partenza, durata e tipo di esperienza. Ischia Porto e Casamicciola sono comodi per arrivi e collegamenti; Forio, Lacco Ameno e Sant'Angelo sono riferimenti utili per costa, calette e panorami. Anche chi soggiorna a Barano o in hotel può indicare esigenze logistiche, ma la partenza resta presso punto nautico verificato.",
      whenTitle: "Quando conviene lo skipper",
      whenItems: [
        ["Prima volta in zona", "Utile se non conosci costa, approdi e condizioni locali."],
        ["Relax totale", "Ideale se vuoi goderti la giornata senza occuparti della conduzione."],
        ["Coppie e famiglie", "Adatta a chi cerca un'esperienza più curata, con tempi e itinerario da concordare."],
        ["Quando scegliere altro", "Se vuoi autonomia e hai requisiti adeguati, valuta barca senza skipper; per uscite agili, gommone."]
      ],
      faqs: [
        { question: "La barca con skipper è una prenotazione immediata?", answer: "No. IschiaMotion riceve la richiesta e verifica disponibilità, orari e condizioni con partner selezionati." },
        { question: "Posso scegliere itinerario e orari?", answer: "Puoi indicare preferenze; itinerario e orari finali dipendono da disponibilità, meteo e condizioni partner." },
        { question: "Serve patente nautica?", answer: "Per l'ospite non è richiesta conduzione del mezzo quando il servizio include skipper, salvo condizioni specifiche comunicate dal partner." },
        { question: "Da dove si parte?", answer: "La partenza viene confermata presso punto nautico definito o IschiaMotion Point, secondo disponibilità." },
        { question: "Il prezzo è definitivo?", answer: "I prezzi a partire da sono indicativi. Il totale dipende da durata, periodo, itinerario e condizioni finali." },
        { question: "È adatta a famiglie o piccoli gruppi?", answer: "Sì, può essere una buona soluzione per famiglie, coppie o gruppi che preferiscono un'esperienza guidata e più rilassata." },
        { question: "Il meteo può cambiare l'itinerario?", answer: "Sì. Lo skipper e il partner valutano mare, vento e sicurezza prima di confermare rotta e orari." },
        { question: "Posso partire vicino a Sant'Angelo o Forio?", answer: "Puoi indicare la zona preferita. La partenza effettiva dipende da disponibilità del partner e punto nautico confermato." }
      ],
      finalTitle: "Vuoi una barca con skipper?",
      finalText: "Invia una richiesta e ricevi conferma dopo verifica con partner locali selezionati."
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
      metaTitle: "Car rental Ischia: port, hotels and local partners",
      metaDescription: "Request car rental availability in Ischia through selected partners: port pickup, hotel delivery where available, families, luggage and island towns.",
      eyebrow: "Cars in Ischia",
      description: "Request car rental availability in Ischia through selected local partners. A practical option when arriving with luggage, travelling with family or moving between ports, hotels and island towns.",
      cardTitle: "Families, couples and luggage",
      cardText: "A car is useful for Ischia Port, Forio, Lacco Ameno, Barano and Sant'Angelo when you need more comfort.",
      categoryParam: "auto",
      benefits: [
        ["Selected local partners", "Your request is reviewed with local operators while keeping the marketplace model clear."],
        ["Quick request", "Set dates, preferences and area: confirmation follows availability review."],
        ["Pickup or delivery where available", "For cars, port, hotel or agreed points may be available depending on partner conditions."],
        ["Clear from-prices", "From-prices are indicative: final conditions depend on dates, duration and availability."]
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
        { question: "How much does car rental in Ischia cost?", answer: "It depends on season, length, category and partner availability. IschiaMotion shows from-prices and checks final conditions after request." },
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
      description: "Request rubber dinghy rental availability in Ischia through selected local partners. An agile way to enjoy coast and coves, with nautical pickup and marine weather always reviewed.",
      cardTitle: "Coast and coves",
      cardText: "For nautical categories, pickup is at an IschiaMotion Point or defined point, not hotel delivery.",
      categoryParam: "gommone",
      benefits: [
        ["Clear category", "Rubber dinghy is handled separately from boat rental for a more precise request."],
        ["Weather review", "Availability may depend on sea, wind, season and partner rules."],
        ["Defined pickup point", "Rubber dinghies and nautical services use an agreed point or IschiaMotion Point."],
        ["Confirmation after review", "No instant promise: the request is checked before confirmation."]
      ],
      zonesText: "For a rubber dinghy, the nautical pickup point matters more than hotel location. Ischia Port and Casamicciola are useful for arrivals; Forio, Lacco Ameno and Sant'Angelo help define coves and scenic coast. Barano may help with land planning, while departure remains tied to partner-defined nautical points.",
      whenTitle: "When a rubber dinghy makes sense",
      whenItems: [
        ["Day at sea", "Good for enjoying coast and coves with an agile nautical option."],
        ["Small groups", "Useful for friends or family, depending on capacity and partner conditions."],
        ["Alternative to a boat", "Usually more essential and agile than some boats, but with less comfort depending on model."],
        ["When to choose skipper", "If you do not want to handle navigation, route or weather, boat with skipper is more relaxed."]
      ],
      faqs: [
        { question: "Is a rubber dinghy the same as a boat?", answer: "No. On IschiaMotion they are separate categories with different availability and conditions." },
        { question: "Can it be delivered to a hotel?", answer: "No. Nautical categories use a defined pickup point or IschiaMotion Point." },
        { question: "Does weather affect availability?", answer: "Yes. Sea, wind and operational conditions can affect final confirmation." },
        { question: "Do I need a boating license?", answer: "It depends on the vehicle and partner conditions. Requirements and documents are reviewed before confirmation." },
        { question: "How much does rubber dinghy rental in Ischia cost?", answer: "Price depends on season, length, category and availability. The request checks real options." },
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
      metaTitle: "Boat rental Ischia: coast, coves and local partners",
      metaDescription: "Request boat rental availability in Ischia through selected partners. Coast, coves, requirements, weather and final conditions after review.",
      eyebrow: "Boats in Ischia",
      description: "Request boat rental availability in Ischia through selected local partners. Ideal for experiencing the coast and coves from the sea, with requirements, pickup point and weather reviewed before confirmation.",
      cardTitle: "Days at sea",
      cardText: "Boat without skipper only where offered by partners, requirements and conditions. For guided service choose boat with skipper.",
      categoryParam: "barca",
      benefits: [
        ["Selected options", "The request is oriented toward local partners and vehicles compatible with season and availability."],
        ["Clear conditions", "Requirements, documents and final conditions are shared after review."],
        ["Defined nautical points", "Boat pickup is at an indicated point or IschiaMotion Point, not hotel delivery."]
      ],
      zonesText: "Boat rental depends on nautical points rather than hotel delivery. Ischia Port and Casamicciola are convenient for arrivals and departures; Forio, Lacco Ameno and Sant'Angelo help define coastal areas and coves. Barano can be part of land planning, while departure remains subject to the partner's confirmed point.",
      whenTitle: "When boat rental works well",
      whenItems: [
        ["Autonomy at sea", "Suitable when a partner offers rental without skipper and requirements are met."],
        ["Coast and coves", "Ideal for exploring selected coast areas with agreed timing and conditions."],
        ["More comfort", "Compared with a rubber dinghy, a boat may offer more space, shade or stability depending on model."],
        ["When to choose skipper", "If you want a guided experience or do not want to manage navigation and route, choose the skipper page."]
      ],
      faqs: [
        { question: "Does boat rental always include a skipper?", answer: "No. This page is for boat rental; for a guided experience use the boat with skipper page." },
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
    skipper: {
      ...commonEn,
      locale: "en",
      key: "skipper",
      path: "/en/boat-with-skipper-ischia",
      alternatePath: "/it/barca-con-skipper-ischia",
      title: "Boat with skipper in Ischia",
      metaTitle: "Boat with skipper Ischia: guided sea experience",
      metaDescription: "Request boat with skipper availability in Ischia through selected partners. Coast, coves, relaxed route and confirmation after review.",
      eyebrow: "Skipper in Ischia",
      description: "A boat with skipper in Ischia is ideal when you want the sea without managing navigation, route or technical details. IschiaMotion collects the request and reviews availability, timing and conditions through selected partners.",
      cardTitle: "Guided experience",
      cardText: "Sea tours, coves and coast with partner availability to confirm before departure.",
      categoryParam: "boat-with-skipper",
      benefits: [
        ["Less to manage", "The skipper handles navigation and operational guidance according to partner conditions."],
        ["Sea itineraries", "A way to discover coast, coves and views with local guidance."],
        ["Reviewed request", "Availability, timing and conditions are confirmed after review."],
        ["WhatsApp support", "Clarify preferences before the final review."]
      ],
      zonesText: "For a skipper experience, departure point, duration and style matter most. Ischia Port and Casamicciola are convenient for arrivals; Forio, Lacco Ameno and Sant'Angelo are useful references for coves and scenic coast. Guests staying in Barano or hotels can share logistics, while departure is confirmed at a reviewed nautical point.",
      whenTitle: "When skipper service is useful",
      whenItems: [
        ["First time in the area", "Useful if you do not know the coastline, landing points or local conditions."],
        ["Full relaxation", "Ideal if you want to enjoy the day without managing navigation."],
        ["Couples and families", "Good for a more curated experience with timing and route to agree."],
        ["When to choose another option", "If you want autonomy and meet requirements, boat rental may fit; for a simpler agile option, consider a rubber dinghy."]
      ],
      faqs: [
        { question: "Is boat with skipper instantly confirmed?", answer: "No. IschiaMotion receives the request and reviews availability, timing and conditions with selected partners." },
        { question: "Can I choose route and timing?", answer: "You can share preferences; final route and timing depend on availability, weather and partner conditions." },
        { question: "Do guests need a boating license?", answer: "Guests do not operate the boat when skipper service is included, unless specific partner conditions apply." },
        { question: "Where does departure happen?", answer: "Departure is confirmed at a defined nautical point or IschiaMotion Point, depending on availability." },
        { question: "Is the price final?", answer: "From-prices are indicative. Final cost depends on length, season, itinerary and conditions." },
        { question: "Is it suitable for families or small groups?", answer: "Yes, it can work well for families, couples or groups looking for a guided and more relaxed sea experience." },
        { question: "Can weather change the itinerary?", answer: "Yes. The skipper and partner review sea, wind and safety before confirming route and timing." },
        { question: "Can I depart near Sant'Angelo or Forio?", answer: "You can share the preferred area. Actual departure depends on partner availability and the confirmed nautical point." }
      ],
      finalTitle: "Want a boat with skipper?",
      finalText: "Send a request and receive confirmation after review with selected local partners."
    }
  }
};

export function getCategoryLanding(locale: Locale, key: CategoryLandingKey) {
  return categoryLandings[locale][key];
}
