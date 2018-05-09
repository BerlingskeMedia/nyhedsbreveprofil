module.exports = {
  categories: [
    {
      description: "Abonnementsregister",
      title: "Abonnement",
      name: "abonnement",
      informationType: "navn, efternavn, adresse, email, telefon, cpr nr., konto oplysninger, betalinger,  ordrehistorik, transaktionsdata",
      purpose: "At servicere kundens abonnementer",
      authority: "Kontrakt. Databehandling foretages af hensyn til opfyldelse af en kontrakt, som kunden er part i.",
      access: "Relevante medarbejdere i Berlingske Media's afdeling for abonnement, salg og kundeservice",
      origin: "Indkomne indtastede ordrer, Kundeunivers, register for log-in oplysninger, offentligt adresseregister (AWS)",
      registrer: "Abonnenter og tidligere abonnenter",
      storeLongevity: "2-5 år efter brug"
    },
    {
      description: "Internt produktionsregister til rapportering mv.",
      title: "Rapportering",
      name: "rapportering",
      informationType: "Navn, adresse, email, telefon, ordrenummer, kundenummer, beskrivelse af kundeinteraktioner",
      purpose: "At understøtte Berlingske Media's interne produktionsstyring og ledelsesrapportering.",
      authority: "Legitime interesser. Databehandling foretages af hensyn til Berlingske Media's produktionsstyring og ledelsesrapportering.",
      access: "Relevante medarbejdere i Berlingske Media's afdeling for rapportering",
      origin: "En lang række af de øvrigt nævnte registre, Geomatic (Robinson list)",
      registrer: "Abonnenter og tidligere abonnenter. Læsere af Berlingske Media's nyheds-sites med log-in.",
      storeLongevity: "2-5 år efter brug"
    },
    {
      description: "Register for markedsundersøgelser, quizzer, spørgeundersøgelser og konkurrencer",
      title: "Markedsundersøgelse",
      name: "markedsundersogelse",
      informationType: "Navn, email, adresse, køn, alder, beskæftigelse, uddannelse, husstandsindkomst, børn, postnummer",
      purpose: "At gennemføre quizzer, tilfredshedsundersøgelser mv.",
      authority: "Læserens samtykke.",
      access: "Relevante medarbejdere i Berlingske Media's afdeling for Markedsanalyse",
      origin: "Abonnementsregister og oplysninger afgivet af kunden i tilfredshedsundersøgelser mv.",
      registrer: "Abonnenter og tidligere abonnenter. Læsere af Berlingske Media's nyheds-sites med log-in.",
      storeLongevity: "3-5 år efter brug"
    },
    {
      description: "Register for online-trafik",
      title: "Tracking",
      name: "tracking",
      informationType: "Log-in navn, viste annoncer, Oplysninger om klik på annoncer og artikler, tekniske oplysninger om kundens device",
      purpose: "At tilbyde den digitale læser en god brugeroplevelse med relevant sideorganisering, indhold og annoncering",
      authority: "Læserens samtykke.",
      access: "Kun maskinel adgang fra Berlingske Media's IT-systemer.",
      origin: "Opsamling på vores nyhedssites",
      registrer: "Læsere af Berlingske Media's nyheds-sites med log-in.",
      storeLongevity: "6 mnd-5 år"
    },
    {
      description: "Register for telemarketing",
      title: "Telemarketing",
      name: "telemarketing",
      informationType: "Navn, adresse, telefon, lydfiler med foretagede opkald",
      purpose: "At understøtte Berlingske Media's afdeling for salg og marketing.",
      authority: "Legitime interesser. Databehandling foretages af hensyn til Berlingske Media's salg og marketing.",
      access: "Relevante medarbejdere i Berlingske Media's afdeling for salg og marketing.",
      origin: "Abonnementsregister, offentlige telefonlister",
      registrer: "Abonnenter og tidligere abonnenter, registredede på offentlige telefonlister.",
      storeLongevity: "5 år efter brug"
    },
    {
      description: "Register over henvendelser til kundeservice",
      title: "Kundeservice",
      name: "kundeservice",
      informationType: "Navn, efternavn, adresse, email, telefon og evt andre afgivne oplysninger",
      purpose: "At servicere kundens henvendelse",
      authority: "Kontrakt. Databehandling foretages af hensyn til opfyldelse af en kontrakt, som kunden er part i.",
      access: "Relevante medarbejdere i Berlingske Media's kundeservice",
      origin: "Fra kunden ved henvendelse",
      registrer: "Kunder der har henvendt sig til Berlingske Media's kundeservice",
      storeLongevity: "5 år efter brug"
    },
    {
      description: "Register over indrykkede annoncer",
      title: "Annoncering",
      name: "annoncering",
      informationType: "Navn, email, telefon, adresse, ordrehistorik",
      purpose: "At understøtte kundens ordrebestilling",
      authority: "Kontrakt. Databehandling foretages af hensyn til opfyldelse af aftalte handler, som kunden er part i.",
      access: "Relevante medarbejdere i Berlingske Media's annonceafdeling",
      origin: "Fra kunden ved ordreafgivelse",
      registrer: "Kunder der har indrykket annoncer hos Berlingske Media",
      storeLongevity: "2-5 år efter brug"
    },
    {
      description: "Sweetdeal & Shops",
      title: "Sweetdeal og Shops",
      name: "sweetdeal_og_shops",
      informationType: "Navn, adresse, email, Sweetdeal city",
      purpose: "At understøtte kundens handler i shops på Berlingske Media's platforme",
      authority: "Kontrakt. Databehandling foretages af hensyn til opfyldelse af aftalte handler, som kunden er part i.",
      access: "Relevante medarbejdere i Berlingske Media's shops-afdeling",
      origin: "Oplysninger afgivet af Kunden online",
      registrer: "Kunder i Berlingske Media's Sweetdeal shop.",
      storeLongevity: "5 år efter brug"
    }
  ]
};