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
      metaTitle: "Noleggio auto Ischia | IschiaMotion",
      metaDescription: "Richiedi disponibilità per noleggio auto a Ischia tramite partner locali selezionati. Ideale per famiglie, bagagli e spostamenti.",
      eyebrow: "Auto a Ischia",
      description: "IschiaMotion ti aiuta a richiedere disponibilità per auto a Ischia tramite partner locali selezionati. Una soluzione utile per famiglie, coppie, bagagli e spostamenti tra comuni.",
      cardTitle: "Famiglie, coppie e bagagli",
      cardText: "L'auto è pratica quando devi muoverti tra Ischia Porto, Forio, Lacco Ameno, Barano e Sant'Angelo con più comfort.",
      categoryParam: "auto",
      benefits: [
        ["Partner locali selezionati", "La richiesta viene verificata con operatori locali, mantenendo il modello marketplace corretto."],
        ["Richiesta rapida", "Indichi date, preferenze e zona: la conferma arriva dopo verifica della disponibilità."],
        ["Ritiro o consegna dove previsto", "Per le auto possono essere disponibili porto, hotel o punti concordati, secondo condizioni partner."],
        ["Prezzi chiari", "I prezzi a partire da sono indicativi: il totale dipende da date, durata e condizioni finali."]
      ],
      zonesText: "Puoi richiedere opzioni comode per Ischia Porto, Casamicciola, Forio, Lacco Ameno, Sant'Angelo, Barano e strutture ricettive dove la consegna è prevista.",
      whenTitle: "Quando conviene l'auto",
      whenItems: [
        ["Famiglie e gruppi", "Più spazio per persone, borse e passeggini rispetto a scooter o e-bike."],
        ["Più comuni in un giorno", "Utile per visitare Forio, Lacco Ameno, Barano o Sant'Angelo con meno vincoli."],
        ["Arrivi con bagagli", "Comoda quando arrivi al porto o devi raggiungere una struttura fuori dalle zone centrali."]
      ],
      faqs: [
        { question: "Quanto costa il noleggio auto a Ischia?", answer: "Dipende da periodo, durata, categoria e disponibilità dei partner. IschiaMotion mostra prezzi a partire da e verifica le condizioni finali dopo la richiesta." },
        { question: "Posso richiedere consegna in hotel?", answer: "Dove previsto dal partner e dalla zona, puoi indicare consegna in hotel o struttura ricettiva. La disponibilità viene sempre verificata." },
        { question: "La prenotazione è confermata subito?", answer: "No. La richiesta viene ricevuta e poi verificata tramite partner locali selezionati prima della conferma." },
        { question: "Serve una carta o cauzione?", answer: "Eventuali cauzioni, documenti e condizioni vengono comunicati dopo verifica con il partner locale." },
        { question: "Posso ritirare l'auto al porto di Ischia?", answer: "Puoi indicare Ischia Porto o un punto comodo; la disponibilità del ritiro viene confermata dopo verifica." }
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
      metaTitle: "Noleggio e-bike Ischia | IschiaMotion",
      metaDescription: "Richiedi disponibilità per noleggio bici elettriche a Ischia tramite partner selezionati. Borghi, lungomare e percorsi panoramici.",
      eyebrow: "E-bike a Ischia",
      description: "Il noleggio bici elettriche a Ischia è adatto a chi cerca spostamenti leggeri, panoramici e più sostenibili. IschiaMotion facilita la richiesta tramite partner locali selezionati.",
      cardTitle: "Muoversi leggeri",
      cardText: "Ideale per lungomare, borghi e percorsi panoramici, valutando sempre pendenze, distanza e condizioni del tragitto.",
      categoryParam: "bici",
      benefits: [
        ["Richiesta guidata", "Indichi date e preferenze: la disponibilità viene controllata prima della conferma."],
        ["Opzioni green", "Le e-bike sono utili per spostamenti brevi e medi con un impatto più leggero."],
        ["Supporto locale", "IschiaMotion ti orienta verso opzioni compatibili con zona e periodo."],
        ["Trasparenza", "Prezzi e condizioni finali dipendono da disponibilità e durata."]
      ],
      zonesText: "Le richieste possono riguardare Ischia Porto, Casamicciola, Forio, Lacco Ameno, Barano, Sant'Angelo e zone vicine a hotel o strutture, dove previsto.",
      whenTitle: "Quando conviene l'e-bike",
      whenItems: [
        ["Borghi e lungomare", "Perfetta per spostamenti agili e soste frequenti."],
        ["Turismo green", "Adatta a chi vuole ridurre l'uso dell'auto e vivere l'isola con calma."],
        ["Percorsi panoramici", "Utile su tragitti selezionati, prestando attenzione alle pendenze dell'isola."]
      ],
      faqs: [
        { question: "Le bici elettriche sono adatte a tutta Ischia?", answer: "Ischia ha salite e strade strette: conviene scegliere percorsi adatti e verificare autonomia e condizioni con il partner." },
        { question: "Posso richiedere e-bike vicino al porto?", answer: "Puoi indicare Ischia Porto o un'altra zona; la disponibilità viene verificata dopo la richiesta." },
        { question: "Il casco è incluso?", answer: "Dotazioni e accessori dipendono dal partner selezionato e vengono confermati dopo verifica." },
        { question: "Quanto costa il noleggio e-bike a Ischia?", answer: "Il prezzo varia in base a durata, periodo e disponibilità. IschiaMotion raccoglie la richiesta e verifica le opzioni." },
        { question: "La richiesta conferma subito il mezzo?", answer: "No. La conferma arriva solo dopo verifica disponibilità con partner locali selezionati." }
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
      metaTitle: "Noleggio gommoni Ischia | IschiaMotion",
      metaDescription: "Richiedi disponibilità per noleggio gommoni a Ischia tramite partner selezionati. Coste, calette e condizioni meteo da verificare.",
      eyebrow: "Gommoni a Ischia",
      description: "IschiaMotion facilita richieste di noleggio gommoni a Ischia tramite partner locali selezionati. Una scelta per vivere costa e calette, con disponibilità e condizioni meteo sempre da verificare.",
      cardTitle: "Costa e calette",
      cardText: "Per le categorie nautiche il ritiro avviene presso IschiaMotion Point o punto definito, non con consegna in hotel.",
      categoryParam: "gommone",
      benefits: [
        ["Categoria distinta", "Il gommone viene gestito separatamente dalla barca, così la richiesta è più precisa."],
        ["Verifica meteo", "Disponibilità e uscita possono dipendere da condizioni del mare, periodo e regole partner."],
        ["Punto ritiro definito", "Per gommoni e nautica si usa un punto concordato o IschiaMotion Point."],
        ["Conferma dopo controllo", "Nessuna promessa immediata: la richiesta viene verificata prima della conferma."]
      ],
      zonesText: "Le richieste possono partire da aree comode per Ischia Porto, Casamicciola, Forio, Lacco Ameno, Sant'Angelo e punti nautici definiti dai partner.",
      whenTitle: "Quando conviene il gommone",
      whenItems: [
        ["Giornata in mare", "Adatto a chi vuole vivere costa e calette con un mezzo nautico agile."],
        ["Piccoli gruppi", "Utile per uscite tra amici o famiglia, secondo capienza e condizioni partner."],
        ["Flessibilità", "Permette un'esperienza diversa dalla barca tradizionale, dove prevista."]
      ],
      faqs: [
        { question: "Gommone e barca sono la stessa cosa?", answer: "No. Su IschiaMotion sono categorie separate: il gommone ha caratteristiche, disponibilità e condizioni diverse dalla barca." },
        { question: "Posso ricevere il gommone in hotel?", answer: "No. Per categorie nautiche il ritiro è presso punto definito o IschiaMotion Point, secondo indicazioni del partner." },
        { question: "La disponibilità dipende dal meteo?", answer: "Sì. Mare, vento e condizioni operative possono incidere sulla conferma finale." },
        { question: "Serve patente nautica?", answer: "Dipende dal mezzo e dalle condizioni del partner. Requisiti e documenti vengono verificati prima della conferma." },
        { question: "Quanto costa noleggiare un gommone a Ischia?", answer: "Il prezzo dipende da periodo, durata, categoria e disponibilità. La richiesta permette di verificare le opzioni reali." }
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
      metaTitle: "Noleggio barche Ischia | IschiaMotion",
      metaDescription: "Richiedi disponibilità per noleggio barche a Ischia tramite partner locali selezionati. Uscite in mare e condizioni da verificare.",
      eyebrow: "Barche a Ischia",
      description: "Il noleggio barche a Ischia è pensato per chi vuole vivere la costa via mare. IschiaMotion raccoglie richieste e verifica disponibilità tramite partner selezionati.",
      cardTitle: "Uscite in mare",
      cardText: "Barca senza skipper solo dove previsto da partner, requisiti e condizioni. Per esperienza guidata scegli la pagina skipper.",
      categoryParam: "barca",
      benefits: [
        ["Opzioni selezionate", "La richiesta viene orientata verso partner locali e mezzi compatibili con periodo e disponibilità."],
        ["Condizioni chiare", "Requisiti, documenti e condizioni finali vengono comunicati dopo verifica."],
        ["Punti nautici definiti", "Il ritiro per barche avviene presso punto indicato o IschiaMotion Point, non in hotel."],
        ["Nessuna confusione", "Barca e barca con skipper restano categorie distinte."]
      ],
      zonesText: "Le richieste possono riguardare aree nautiche vicine a Ischia Porto, Casamicciola, Forio, Lacco Ameno e Sant'Angelo, secondo disponibilità partner.",
      whenTitle: "Quando conviene la barca",
      whenItems: [
        ["Autonomia in mare", "Adatta quando il partner prevede noleggio senza skipper e i requisiti sono rispettati."],
        ["Costa e calette", "Ideale per esplorare tratti di costa con tempi e condizioni concordate."],
        ["Giornata speciale", "Una scelta più ampia rispetto al gommone, secondo mezzo e capienza."]
      ],
      faqs: [
        { question: "La barca include sempre lo skipper?", answer: "No. Questa pagina riguarda il noleggio barche; per esperienza guidata usa la pagina barca con skipper." },
        { question: "Posso noleggiare barche senza patente?", answer: "Dipende dal mezzo e dalle condizioni del partner. Requisiti e documenti vengono verificati prima della conferma." },
        { question: "Il ritiro può avvenire in hotel?", answer: "No. Per le categorie nautiche il ritiro avviene presso punto definito o IschiaMotion Point." },
        { question: "Il meteo può bloccare l'uscita?", answer: "Sì. Condizioni meteo-marine e operative sono parte della verifica." },
        { question: "Quanto costa noleggiare una barca a Ischia?", answer: "Il prezzo varia per date, durata, modello, disponibilità e condizioni partner." }
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
      metaTitle: "Barca con skipper Ischia | IschiaMotion",
      metaDescription: "Richiedi disponibilità per barca con skipper a Ischia tramite partner selezionati. Esperienza guidata via mare e conferma dopo verifica.",
      eyebrow: "Skipper a Ischia",
      description: "La barca con skipper a Ischia è ideale per chi vuole vivere il mare senza pensare a conduzione, itinerario e gestione tecnica. IschiaMotion verifica le opzioni tramite partner selezionati.",
      cardTitle: "Esperienza guidata",
      cardText: "Tour via mare, calette e costa con disponibilità partner da confermare prima della partenza.",
      categoryParam: "boat-with-skipper",
      benefits: [
        ["Meno pensieri", "Lo skipper gestisce conduzione e indicazioni operative secondo condizioni del partner."],
        ["Itinerari via mare", "Una soluzione per scoprire costa, calette e panorami con guida locale."],
        ["Richiesta verificata", "Disponibilità, orari e condizioni vengono confermati dopo controllo."],
        ["Supporto WhatsApp", "Puoi chiarire esigenze e preferenze prima della verifica finale."]
      ],
      zonesText: "Le partenze possono essere coordinate da punti nautici legati a Ischia Porto, Casamicciola, Forio, Lacco Ameno o Sant'Angelo, secondo disponibilità.",
      whenTitle: "Quando conviene lo skipper",
      whenItems: [
        ["Prima volta in zona", "Utile se non conosci costa, approdi e condizioni locali."],
        ["Relax totale", "Ideale se vuoi goderti la giornata senza occuparti della conduzione."],
        ["Occasioni speciali", "Adatta a coppie, famiglie e piccoli gruppi che cercano un'esperienza più curata."]
      ],
      faqs: [
        { question: "La barca con skipper è una prenotazione immediata?", answer: "No. IschiaMotion riceve la richiesta e verifica disponibilità, orari e condizioni con partner selezionati." },
        { question: "Posso scegliere itinerario e orari?", answer: "Puoi indicare preferenze; itinerario e orari finali dipendono da disponibilità, meteo e condizioni partner." },
        { question: "Serve patente nautica?", answer: "Per l'ospite non è richiesta conduzione del mezzo quando il servizio include skipper, salvo condizioni specifiche comunicate dal partner." },
        { question: "Da dove si parte?", answer: "La partenza viene confermata presso punto nautico definito o IschiaMotion Point, secondo disponibilità." },
        { question: "Il prezzo è definitivo?", answer: "I prezzi a partire da sono indicativi. Il totale dipende da durata, periodo, itinerario e condizioni finali." }
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
      metaTitle: "Car rental Ischia | IschiaMotion",
      metaDescription: "Request car rental availability in Ischia through selected local partners. Useful for families, luggage and moving between towns.",
      eyebrow: "Cars in Ischia",
      description: "IschiaMotion helps you request car rental availability in Ischia through selected local partners. A practical option for families, couples, luggage and moving between island towns.",
      cardTitle: "Families, couples and luggage",
      cardText: "A car is useful for Ischia Port, Forio, Lacco Ameno, Barano and Sant'Angelo when you need more comfort.",
      categoryParam: "auto",
      benefits: [
        ["Selected local partners", "Your request is reviewed with local operators while keeping the marketplace model clear."],
        ["Quick request", "Set dates, preferences and area: confirmation follows availability review."],
        ["Pickup or delivery where available", "For cars, port, hotel or agreed points may be available depending on partner conditions."],
        ["Clear from-prices", "From-prices are indicative: final conditions depend on dates, duration and availability."]
      ],
      zonesText: "You can request options around Ischia Port, Casamicciola, Forio, Lacco Ameno, Sant'Angelo, Barano and hotels where delivery is available.",
      whenTitle: "When a car makes sense",
      whenItems: [
        ["Families and groups", "More space for people and bags than scooters or e-bikes."],
        ["Several towns in one day", "Useful for Forio, Lacco Ameno, Barano or Sant'Angelo with fewer constraints."],
        ["Arriving with luggage", "Convenient when arriving at the port or reaching accommodation outside central areas."]
      ],
      faqs: [
        { question: "How much does car rental in Ischia cost?", answer: "It depends on season, length, category and partner availability. IschiaMotion shows from-prices and checks final conditions after request." },
        { question: "Can I request hotel delivery?", answer: "Where offered by the partner and area, you can request hotel or accommodation delivery. Availability is always reviewed." },
        { question: "Is the booking instantly confirmed?", answer: "No. The request is received and then reviewed through selected local partners before confirmation." },
        { question: "Do I need a card or deposit?", answer: "Deposits, documents and conditions are communicated after review with the local partner." },
        { question: "Can I pick up at Ischia port?", answer: "You can indicate Ischia Port or a convenient point; pickup availability is confirmed after review." }
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
      metaTitle: "E-bike rental Ischia | IschiaMotion",
      metaDescription: "Request e-bike rental availability in Ischia through selected partners. Villages, seafronts and panoramic routes.",
      eyebrow: "E-bikes in Ischia",
      description: "E-bike rental in Ischia suits visitors looking for lighter, scenic and more sustainable movement. IschiaMotion facilitates requests through selected local partners.",
      cardTitle: "Move lightly",
      cardText: "Great for seafronts, villages and selected panoramic routes, always considering hills, distance and road conditions.",
      categoryParam: "bici",
      benefits: [
        ["Guided request", "You set dates and preferences: availability is checked before confirmation."],
        ["Greener options", "E-bikes are useful for short and medium trips with a lighter footprint."],
        ["Local support", "IschiaMotion helps orient your request by area and season."],
        ["Transparent conditions", "Prices and final terms depend on availability and rental length."]
      ],
      zonesText: "Requests may include Ischia Port, Casamicciola, Forio, Lacco Ameno, Barano, Sant'Angelo and areas near accommodation where available.",
      whenTitle: "When an e-bike works well",
      whenItems: [
        ["Villages and seafronts", "Perfect for agile movement and frequent stops."],
        ["Green travel", "Good for reducing car use and enjoying the island slowly."],
        ["Scenic routes", "Useful on selected routes, with attention to Ischia's hills."]
      ],
      faqs: [
        { question: "Are e-bikes suitable for all of Ischia?", answer: "Ischia has hills and narrow roads: choose suitable routes and review battery range and conditions with the partner." },
        { question: "Can I request an e-bike near the port?", answer: "You can indicate Ischia Port or another area; availability is reviewed after request." },
        { question: "Is a helmet included?", answer: "Equipment and accessories depend on the selected partner and are confirmed after review." },
        { question: "How much does e-bike rental in Ischia cost?", answer: "Price varies by duration, season and availability. IschiaMotion collects the request and checks options." },
        { question: "Does the request confirm the vehicle?", answer: "No. Confirmation arrives only after availability review with selected local partners." }
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
      metaTitle: "Rubber dinghy rental Ischia | IschiaMotion",
      metaDescription: "Request rubber dinghy rental availability in Ischia through selected partners. Coast, coves and weather conditions to review.",
      eyebrow: "Rubber dinghies in Ischia",
      description: "IschiaMotion facilitates rubber dinghy rental requests in Ischia through selected local partners. A way to enjoy coast and coves, with weather and availability always reviewed.",
      cardTitle: "Coast and coves",
      cardText: "For nautical categories, pickup is at an IschiaMotion Point or defined point, not hotel delivery.",
      categoryParam: "gommone",
      benefits: [
        ["Clear category", "Rubber dinghy is handled separately from boat rental for a more precise request."],
        ["Weather review", "Availability may depend on sea, wind, season and partner rules."],
        ["Defined pickup point", "Rubber dinghies and nautical services use an agreed point or IschiaMotion Point."],
        ["Confirmation after review", "No instant promise: the request is checked before confirmation."]
      ],
      zonesText: "Requests may involve points convenient for Ischia Port, Casamicciola, Forio, Lacco Ameno, Sant'Angelo and nautical locations defined by partners.",
      whenTitle: "When a rubber dinghy makes sense",
      whenItems: [
        ["Day at sea", "Good for enjoying coast and coves with an agile nautical option."],
        ["Small groups", "Useful for friends or family, depending on capacity and partner conditions."],
        ["Flexible sea experience", "Different from a traditional boat where available."]
      ],
      faqs: [
        { question: "Is a rubber dinghy the same as a boat?", answer: "No. On IschiaMotion they are separate categories with different availability and conditions." },
        { question: "Can it be delivered to a hotel?", answer: "No. Nautical categories use a defined pickup point or IschiaMotion Point." },
        { question: "Does weather affect availability?", answer: "Yes. Sea, wind and operational conditions can affect final confirmation." },
        { question: "Do I need a boating license?", answer: "It depends on the vehicle and partner conditions. Requirements and documents are reviewed before confirmation." },
        { question: "How much does rubber dinghy rental in Ischia cost?", answer: "Price depends on season, length, category and availability. The request checks real options." }
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
      metaTitle: "Boat rental Ischia | IschiaMotion",
      metaDescription: "Request boat rental availability in Ischia through selected local partners. Sea days and final conditions to review.",
      eyebrow: "Boats in Ischia",
      description: "Boat rental in Ischia is for visitors who want to experience the coast from the sea. IschiaMotion collects requests and reviews availability through selected partners.",
      cardTitle: "Days at sea",
      cardText: "Boat without skipper only where offered by partners, requirements and conditions. For guided service choose boat with skipper.",
      categoryParam: "barca",
      benefits: [
        ["Selected options", "The request is oriented toward local partners and vehicles compatible with season and availability."],
        ["Clear conditions", "Requirements, documents and final conditions are shared after review."],
        ["Defined nautical points", "Boat pickup is at an indicated point or IschiaMotion Point, not hotel delivery."],
        ["No category confusion", "Boat rental and boat with skipper remain separate categories."]
      ],
      zonesText: "Requests may involve nautical areas near Ischia Port, Casamicciola, Forio, Lacco Ameno and Sant'Angelo, depending on partner availability.",
      whenTitle: "When boat rental works well",
      whenItems: [
        ["Autonomy at sea", "Suitable when a partner offers rental without skipper and requirements are met."],
        ["Coast and coves", "Ideal for exploring selected coast areas with agreed timing and conditions."],
        ["Special day out", "A broader option than a rubber dinghy, depending on vehicle and capacity."]
      ],
      faqs: [
        { question: "Does boat rental always include a skipper?", answer: "No. This page is for boat rental; for a guided experience use the boat with skipper page." },
        { question: "Can I rent without a license?", answer: "It depends on the boat and partner conditions. Requirements and documents are reviewed before confirmation." },
        { question: "Can the boat be delivered to a hotel?", answer: "No. Nautical categories use a defined pickup point or IschiaMotion Point." },
        { question: "Can weather stop the trip?", answer: "Yes. Marine weather and operational conditions are part of the review." },
        { question: "How much does boat rental in Ischia cost?", answer: "Price varies by dates, duration, model, availability and partner conditions." }
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
      metaTitle: "Boat with skipper Ischia | IschiaMotion",
      metaDescription: "Request boat with skipper availability in Ischia through selected partners. Guided sea experience and confirmation after review.",
      eyebrow: "Skipper in Ischia",
      description: "A boat with skipper in Ischia is ideal when you want the sea experience without managing navigation, route or technical details. IschiaMotion reviews options through selected partners.",
      cardTitle: "Guided experience",
      cardText: "Sea tours, coves and coast with partner availability to confirm before departure.",
      categoryParam: "boat-with-skipper",
      benefits: [
        ["Less to manage", "The skipper handles navigation and operational guidance according to partner conditions."],
        ["Sea itineraries", "A way to discover coast, coves and views with local guidance."],
        ["Reviewed request", "Availability, timing and conditions are confirmed after review."],
        ["WhatsApp support", "Clarify preferences before the final review."]
      ],
      zonesText: "Departures may be coordinated from nautical points connected to Ischia Port, Casamicciola, Forio, Lacco Ameno or Sant'Angelo, depending on availability.",
      whenTitle: "When skipper service is useful",
      whenItems: [
        ["First time in the area", "Useful if you do not know the coastline, landing points or local conditions."],
        ["Full relaxation", "Ideal if you want to enjoy the day without managing navigation."],
        ["Special occasions", "Suitable for couples, families and small groups seeking a more curated experience."]
      ],
      faqs: [
        { question: "Is boat with skipper instantly confirmed?", answer: "No. IschiaMotion receives the request and reviews availability, timing and conditions with selected partners." },
        { question: "Can I choose route and timing?", answer: "You can share preferences; final route and timing depend on availability, weather and partner conditions." },
        { question: "Do guests need a boating license?", answer: "Guests do not operate the boat when skipper service is included, unless specific partner conditions apply." },
        { question: "Where does departure happen?", answer: "Departure is confirmed at a defined nautical point or IschiaMotion Point, depending on availability." },
        { question: "Is the price final?", answer: "From-prices are indicative. Final cost depends on length, season, itinerary and conditions." }
      ],
      finalTitle: "Want a boat with skipper?",
      finalText: "Send a request and receive confirmation after review with selected local partners."
    }
  }
};

export function getCategoryLanding(locale: Locale, key: CategoryLandingKey) {
  return categoryLandings[locale][key];
}
