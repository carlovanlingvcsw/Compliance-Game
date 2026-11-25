/* Level 4: Het vrachtdok. Game logic and content of this level. */
(function () {
  "use strict";

  /* ---------- Icons (Lucide, outline) ---------- */
  var I = {
    check: '<path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>',
    x: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    half: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    gem: '<path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    arrowR: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowL: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    timer: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
    file: '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    pause: '<rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/>',
    play: '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'
  };
  function icon(name, cls) {
    return '<svg class="vcsw-icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + I[name] + "</svg>";
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  /* ---------- Content (uit het ontwerp van 4 november 2026) ---------- */
  var PEOPLE = {
    ARIA: { name: "ARIA", initials: "AR", cls: "aria" },
    Vega: { name: "Kapitein Vega", initials: "KV" },
    Bram: { name: "Bram", initials: "BR" },
    Mira: { name: "Luitenant Mira", initials: "LM" },
    Gilde: { name: "Handelsgilde", initials: "HG" }
  };

  var BRIEFING = "In het vrachtdok komt niet alleen lading binnen, maar ook data. Kolonies vertrouwen ons de gegevens van hun bewoners toe. En mijn sensoren pikken signalen op van de Zwarte Nevel. Wees kritisch op elk bericht dat binnenkomt.";

  var SITUATIONS = [
    {
      title: "Het open datapakket",
      intro: "Kapitein Vega stuurt via een open kanaal een bestand met namen, identiteitsnummers en soldij van al haar crewleden, voor een kostencontrole.",
      speaker: "Vega",
      line: "Hier is het crewbestand voor de kostencontrole. Ik heb het even snel via het open kanaal gestuurd, dan kun je meteen aan de slag.",
      options: [
        { text: "Doorsturen naar de collega die de controle doet.", grade: "bad",
          react: { who: "Vega", say: "Prima, als het maar snel gaat." },
          why: "Elke extra kopie is een extra risico. Het bestand staat nu op twee plekken onbeveiligd." },
        { text: "Het bestand opslaan in de beveiligde databank, het bericht wissen en Kapitein Vega vriendelijk wijzen op het beveiligde kanaal voor de volgende keer.", grade: "good",
          react: { who: "Vega", say: "Het beveiligde kanaal, genoteerd. Dat gebruik ik voortaan." },
          why: "Het bestand staat nu op één beveiligde plek en de onbeveiligde kopie is weg. Vega weet hoe het de volgende keer moet." },
        { text: "Terugsturen dat ze dit niet meer moet doen, en het bericht laten staan.", grade: "half",
          react: { who: "Vega", say: "Begrepen, volgende keer anders." },
          why: "De boodschap klopt, maar het bestand staat nog onbeveiligd in je berichten." }
      ],
      crystal: { name: "Veilig ontvangen", text: "Persoonsgegevens ontvang je via de beveiligde weg. Een losse bijlage sla je veilig op en wis je daarna uit je berichten." },
      clue: "Kijk naar het kanaal. Een bekende afzender via een ander kanaal dan normaal is een waarschuwing."
    },
    {
      type: "mail",
      title: "De conceptmail",
      intro: "Bram heeft een mail opgesteld aan Kapitein Vega met de uitkomst van de kostencontrole, inclusief een bijlage. Hij vraagt jou om mee te kijken voordat hij op verzenden drukt.",
      speaker: "Bram",
      line: "Kun je even naar mijn mail en de bijlage kijken? Hij gaat via de gewone stationsmail, dat is het snelst.",
      body: "Beste Kapitein Vega,\n\nZoals beloofd de uitkomst van de kostencontrole. We hebben de gegevens van {cnt} bekeken en zien een mogelijke besparing van {sav}. Ter vergelijking: {gem}, wat netjes is voor een kolonie van deze omvang. De details staan in de bijlage.\n\nDe grootste winst zit bij Joran Kel ({id}) uit de ploeg luchtsluistechniek. Hij {verz}, omdat hij {diag}. Doordat hij daarnaast {reg2} en {vangnet}, kan Nova Terra een deel van zijn loonkosten terugkrijgen. Tussen ons gezegd: {roddel}.\n\nIk roep je {date} op om alles toe te lichten. Daarna stuur ik het definitieve rapport.\n\nGroet,\nBram, Datawacht\n{mail}",
      attach: {
        name: "kostencontrole_NovaTerra.holo",
        rows: [
          ["Kolonie", "{reg}"],
          ["Premieklasse kolonie", "{premie}"],
          ["Crewlid met grootste besparing", "Joran Kel"],
          ["Identiteitsnummer", "{id2}"],
          ["Reden halve diensten", "{diag2}"],
          ["Soldij per maand", "{sol}"],
          ["Rekeningnummer soldij", "{iban}"],
          ["Inhoudingen", "{beslag}"]
        ]
      },
      items: {
        cnt:    { text: "312 crewleden", r1: false, r2: false, why1: "Een totaal aantal is niet herleidbaar tot één persoon." },
        sav:    { text: "18.000 credits per jaar", r1: false, r2: false, why1: "Een bedrag voor de hele kolonie is een gegeven over een organisatie." },
        gem:    { text: "het gemiddelde ziekteverzuim van de kolonie is 4,1 procent", r1: false, r2: false, why1: "Klinkt als gezondheid, maar het is een gemiddelde over 312 crewleden en dus niet herleidbaar tot één persoon." },
        verz:   { text: "draait sinds 3 maart halve diensten, in overleg met de scheepsarts", r1: true, r2: false, why1: "Halve diensten in overleg met de scheepsarts verraden dat Joran ziek is geweest en weer opbouwt. Dat is verzuiminformatie en gaat niet via een gewone mail." },
        reg2:   { text: "in het register voor aangepast werk staat", r1: true, r2: false, why1: "Zo'n registratie zegt iets over iemands arbeidsvermogen en gaat niet via een gewone mail." },
        vangnet:{ text: "onder de vangnetregeling valt", r1: true, r2: false, why1: "De vangnetregeling zegt indirect iets over iemands gezondheid of arbeidsvermogen. Niet via een gewone mail." },
        id:     { text: "identiteitsnummer 7731 0094 2", r1: true, r2: false, why1: "Een identiteitsnummer is extra beschermd en gaat nooit via een gewone mail." },
        diag:   { text: "herstelt van een hernia", r1: true, r2: true, why1: "Een diagnose is een medisch gegeven en gaat nooit via een gewone mail.",
                  why2: "Een veilig kanaal maakt het kanaal veilig, niet de inhoud passend. Medische details zijn alleen voor de scheepsarts, ook via Kluispost." },
        roddel: { text: "collega's zeggen dat hij thuis een zware tijd heeft door zijn scheiding", r1: true, r2: true, why1: "Informatie over iemands privéleven hoort niet in een gewone mail.",
                  why2: "Geruchten over iemands privéleven horen in geen enkele mail, ook niet via Kluispost. Vega heeft dit niet nodig." },
        date:   { text: "donderdag om 10.00 uur", r1: false, r2: false, why1: "Een afspraak is geen gevoelig gegeven." },
        mail:   { text: "bram@orion.space", r1: false, r2: false, why1: "Het zakelijke adres van een collega mag gewoon in een mail." },
        reg:    { text: "Nova Terra, registratienummer NT 0042", r1: false, r2: false, why1: "Gegevens over een organisatie. Die mogen in een gewone mail." },
        premie: { text: "klasse 3", r1: false, r2: false, why1: "Een premieklasse hoort bij de kolonie als organisatie, niet bij een persoon." },
        id2:    { text: "7731 0094 2", r1: true, r2: false, why1: "Ook in een bijlage gaat een identiteitsnummer nooit via een gewone mail." },
        diag2:  { text: "rugklachten na een hernia, volgens de scheepsarts", r1: true, r2: true, why1: "Een diagnose blijft een medisch gegeven, ook in een bijlage. Nooit via een gewone mail.",
                  why2: "Ook via Kluispost hoort een diagnose niet bij Vega. Medische details zijn alleen voor de scheepsarts." },
        sol:    { text: "4.200 credits", r1: true, r2: false, why1: "De soldij van één crewlid is een gevoelig financieel gegeven en gaat niet via een gewone mail." },
        iban:   { text: "OR77 STB 0041 2290 18", r1: true, r2: true, why1: "Een persoonlijk rekeningnummer is een gevoelig financieel gegeven en gaat niet via een gewone mail.",
                  why2: "Een veilig kanaal maakt het kanaal veilig, maar niet elk gegeven nodig. Voor de kostencontrole heeft Vega Jorans rekeningnummer niet nodig." },
        beslag: { text: "beslag op soldij, 650 credits per maand", r1: true, r2: true, why1: "Beslag op soldij zegt iets over iemands financiële situatie. Gevoelig, dus niet via een gewone mail.",
                  why2: "Voor de kostencontrole is het beslag niet nodig. Deel alleen wat de ontvanger echt nodig heeft." }
      },
      why2ok: "Via Kluispost of aangetekend verzenden mag dit, omdat Kapitein Vega het nodig heeft voor de kostencontrole.",
      react: {
        good: { who: "Bram", say: "Oké, dan gaat hij via Kluispost. En de diagnose, het rekeningnummer, het beslag en die opmerking over zijn scheiding haal ik eruit." },
        half: { who: "Bram", say: "Bijna goed dus. Ik loop de mail en de bijlage nog een keer na voordat hij de deur uit gaat." },
        bad:  { who: "Bram", say: "Ai. Goed dat hij nog niet verstuurd was." }
      },
      goodText: "Het identiteitsnummer, de diagnose, verzuim, de vangnetregeling, het register, de soldij, het rekeningnummer, het beslag en privézaken niet via de gewone stationsmail. Via Kluispost mag wat Vega nodig heeft, maar de diagnose, het rekeningnummer, het beslag en privézaken laat je ook dan weg.",
      goodWhy: "Een gewone mail is als een ansichtkaart. Een beveiligd kanaal lost dat op, maar je deelt nog steeds alleen wat de ontvanger echt nodig heeft, en medische details blijven bij de scheepsarts. Kijk ook altijd in de bijlage.",
      crystal: { name: "Veilig verzenden", text: "Gevoelige gegevens verstuur je nooit via een gewone mail, ook niet in een bijlage. Via Kluispost of aangetekend verzenden mag het wel, maar alleen wat de ontvanger echt nodig heeft." },
      clue: "Een bijlage die je niet verwacht, open je niet. Controleer eerst wie de afzender is."
    },
    {
      title: "Even alles opvragen",
      intro: "Een nieuwe kolonie wil een brandstofscan om kosten te besparen.",
      speaker: "Bram",
      line: "Vraag gewoon alle crewgegevens op, dan hebben we alles.",
      options: [
        { text: "Alles opvragen.", grade: "bad",
          react: { who: "Bram", say: "Zie je, nu hebben we alles. Handig toch?" },
          why: "Je verzamelt meer dan nodig. Alles wat je niet nodig hebt, moet je wel beschermen en is een extra risico." },
        { text: "Alleen de gegevens opvragen die nodig zijn voor de scan, en afspraken over de verwerking vastleggen.", grade: "good",
          react: { who: "Bram", say: "Hm. Scheelt mij ook weer werk eigenlijk." },
          why: "Je vraagt alleen op wat de scan nodig heeft en legt vast wat ermee gebeurt. Zo gebruik je gegevens alleen voor het doel waarvoor je ze kreeg." },
        { text: "Als voorbeeld laten zien wat we bij Nova Terra hebben gevonden, met namen erin.", grade: "bad",
          react: { who: "Bram", say: "Mooi voorbeeld toch? Dan zien ze meteen wat we kunnen." },
          why: "Gegevens van de ene kolonie zijn nooit voorbeeldmateriaal voor de andere." }
      ],
      crystal: { name: "Doelbinding", text: "Vraag alleen op wat nodig is voor het doel, en gebruik het alleen daarvoor." },
      clue: "Een verzoek dat je niet verwacht, zoals een reset of een pakket, is een signaal om op te letten."
    },
    {
      title: "De buitenaardse scanner",
      intro: "Er ligt een groot crewbestand klaar voor analyse.",
      speaker: "Bram",
      line: "Een langsvliegend handelsschip biedt gratis een slimme scanner aan die databestanden in seconden analyseert. Gooi het crewbestand er even in.",
      options: [
        { text: "Uploaden naar de scanner, het scheelt veel tijd.", grade: "bad",
          react: { who: "Bram", say: "Klaar in drie seconden. Waar staat die scanner eigenlijk?" },
          why: "Het systeem is niet goedgekeurd en je weet niet waar de gegevens terechtkomen." },
        { text: "Alleen de goedgekeurde systemen van het station gebruiken, met alleen organisatiegegevens of gegevens die volgens de regels geanonimiseerd of gepseudonimiseerd zijn.", grade: "good",
          react: { who: "ARIA", say: "Dank je. Ik werk graag mee, zolang er geen persoonsgegevens in mij belanden die er niet in horen." },
          why: "Je gebruikt alleen goedgekeurde systemen en alleen gegevens die daarin mogen." },
        { text: "Het volledige bestand met namen in ARIA zetten, want die is goedgekeurd.", grade: "bad",
          react: { who: "ARIA", say: "Ik ben goedgekeurd. Dat betekent nog niet dat alles in mij mag." },
          why: "Een goedgekeurd systeem betekent niet dat persoonsgegevens erin mogen." }
      ],
      crystal: { name: "Goedgekeurde AI", text: "Alleen goedgekeurde systemen, en daarin geen persoonsgegevens behalve wat volgens de regels mag. Alleen namen weghalen maakt een bestand nog niet anoniem." },
      clue: "Bekijk het adres van de afzender goed. Een adres dat op dat van het station lijkt, is nog niet van het station."
    },
    {
      title: "De reclameboodschap",
      intro: "Het Handelsgilde wil een reclamebericht sturen naar iedereen die zich ooit aanmeldde voor Nova Terra.",
      speaker: "Gilde",
      line: "Ze hebben zich toch aangemeld? Dan vinden ze ons aanbod vast interessant.",
      options: [
        { text: "Doen.", grade: "bad",
          react: { who: "Gilde", say: "Uitstekend, het bericht gaat vandaag nog uit." },
          why: "Een aanmelding is geen toestemming voor reclame." },
        { text: "Alleen mensen berichten die daar toestemming voor gaven.", grade: "good",
          react: { who: "Gilde", say: "Een kleinere lijst dan gehoopt, maar goed." },
          why: "Gegevens uit een aanmelding zijn voor de selectie. Voor reclame is aparte toestemming nodig." },
        { text: "Alleen mensen berichten van wie de aanmelding lang geleden is.", grade: "bad",
          react: { who: "Gilde", say: "Die oude aanmeldingen liggen toch maar stof te vangen." },
          why: "Die gegevens horen er vaak niet eens meer te zijn. Denk aan de bewaartermijn uit de passagiersmodule." }
      ],
      crystal: null,
      clue: "Geheimhouding, geld of spoed? Stop en controleer via een andere weg."
    }
  ];

  var MESSAGES = [
    { id: "m1", real: false,
      from: "Stationstechniek", addr: "techniek@orion-support.net", channel: "Extern berichtenkanaal",
      subject: "Actie vereist: reset je toegangscode",
      body: "Wegens onderhoud verloopt je toegangscode vandaag. Reset hem binnen een uur via de link hieronder, anders verlies je de toegang tot alle systemen.",
      link: "orion-support.net/reset",
      signal: "Afwijkend adres en een onverwacht verzoek. Systemen van Orion draaien op orion.space.",
      hint: "Vergelijk het adres van de afzender met de adressen die je kent van het station." },
    { id: "m2", real: false,
      from: "Kapitein Vega", addr: "privékanaal NT 7731", channel: "Onbekend kanaal",
      subject: "Dringend",
      body: "Ik zit in een overleg en kan niet oproepen. Stuur me nu meteen het soldijoverzicht van mijn crew. Dit kan echt niet wachten.",
      signal: "Ander kanaal dan normaal, met druk en spoed. Controleer via haar vaste kanaal.",
      hint: "Vega heeft een vast kanaal. Is dit dat kanaal?" },
    { id: "m3", real: true,
      from: "Kapitein Vega", addr: "vega@novaterra.space", channel: "Vast kanaal Nova Terra, beveiligd",
      subject: "Kostencontrole",
      body: "Dank voor de snelle kostencontrole. Ik gebruik voortaan het beveiligde kanaal voor dit soort bestanden.",
      signal: "Bekende afzender via het vaste kanaal, en ze vraagt niets.",
      hint: "Let op het kanaal en of er iets van je gevraagd wordt." },
    { id: "m4", real: false,
      from: "Zenith Handel", addr: "facturen@zenith-handel.kx", channel: "Extern berichtenkanaal",
      subject: "Factuur 2247 883",
      body: "Bijgaand de factuur voor de geleverde onderdelen. Open het datapakket om de betaling te bevestigen.",
      attach: "factuur_2247_883.datapakket",
      signal: "Onbekende afzender met een riskante bijlage. Je hebt niets besteld bij Zenith Handel.",
      hint: "Ken je deze handelaar? En verwacht je een factuur?" },
    { id: "m5", real: true,
      from: "ARIA", addr: "aria@orion.space", channel: "Stationssysteem",
      subject: "Dienstrooster voor morgen",
      body: "Hierbij je dienstrooster voor morgen. Je begint in het vrachtdok bij de vroege dienst.",
      signal: "Verwacht bericht van een bekende afzender, zonder gevoelig verzoek.",
      hint: "Krijg je dit bericht elke dag?" },
    { id: "m6", real: false,
      from: "Centrale opslag", addr: "opslag@0rion-cloud.io", channel: "Extern berichtenkanaal",
      subject: "Je geheugen is vol",
      body: "Je persoonlijke opslag is vol. Log hier in met je toegangscode om berichten te blijven ontvangen.",
      link: "0rion-cloud.io/login",
      signal: "Klassiek lokmiddel. Kijk ook naar het adres: een nul in plaats van een o.",
      hint: "Lees het adres letter voor letter." },
    { id: "m7", real: true,
      from: "Luitenant Mira", addr: "mira@orion.space", channel: "Crewkanaal",
      subject: "Morgen even tijd?",
      body: "Heb je morgen een half uur om de nieuwe aanmeldingen voor de shuttle samen door te nemen?",
      signal: "Gewoon collegiaal verzoek via het crewkanaal.",
      hint: "Wordt er iets gevoeligs gevraagd?" },
    { id: "m8", real: false,
      from: "Admiraliteit", addr: "admiraliteit@orion-hq.xyz", channel: "Extern berichtenkanaal",
      subject: "Vertrouwelijke opdracht",
      body: "Koop vandaag tien brandstofbonnen van 100 credits en stuur de codes naar dit kanaal. Vertel er niemand over, het is een verrassing voor de crew.",
      signal: "Geheimhouding plus geld. Stop en controleer via een andere weg.",
      hint: "Waarom zou iemand willen dat je het geheim houdt?" },
    { id: "m9", real: true,
      from: "Crewadministratie", addr: "crewadministratie@orion.space", channel: "Stationssysteem",
      subject: "Uitnodiging oogstfeest",
      body: "Je bent van harte uitgenodigd voor het oogstfeest in de hydrocultuurmodule, aanstaande vrijdag na de late dienst.",
      signal: "Verwacht bericht, geen gevoelig verzoek.",
      hint: "Vraagt dit bericht om gegevens of een actie?" },
    { id: "m10", real: false,
      from: "Vrachtdienst", addr: "bezorging@vracht-dienst.kx", channel: "Extern berichtenkanaal",
      subject: "Je pakket kon niet worden afgeleverd",
      body: "Je pakket kon niet worden afgeleverd. Bevestig je gegevens via de link om een nieuwe bezorging in te plannen.",
      link: "vracht-dienst.kx/bezorging",
      signal: "Je verwacht geen pakket. Een onverwacht verzoek om je gegevens te bevestigen is een lokmiddel.",
      hint: "Heb je iets besteld?" }
  ];

  var RULES = [
    "Ontvang en deel persoonsgegevens alleen via de beveiligde weg, nooit als losse bijlage.",
    "Gebruik gegevens alleen voor het doel waarvoor je ze kreeg, en alleen in goedgekeurde systemen.",
    "Afwijkende afzender, spoed of geheimhouding? Stop en controleer via een andere weg."
  ];

  var POINTS = { good: 10, half: 5, bad: 0 };
  var SHIELD_COST = { good: 0, half: 5, bad: 10 };
  var EXTRA_HINT_COST = 5;
  var LOCK_SECONDS = 300;
  var PASS = 0.7;
  var MAX_SCORE = SITUATIONS.length * 10 + MESSAGES.length * 10;

  var STEPS = ["Briefing", "Dienst", "Luchtsluis", "Debriefing", "Terug op aarde"];

  /* ---------- State ---------- */
  var S;
  function reset() {
    S = {
      screen: "start", step: -1, sit: 0, shield: 100, score: 0, hints: 3,
      crystals: [], clues: [], sitResults: [], chosen: null, optOrder: [],
      msgs: [], msgIdx: 0, msgResults: [], answered: false, hintShown: false,
      code: [], recovered: {}, clickedAttack: false, timeLeft: LOCK_SECONDS, paused: false, timer: null,
      timedOut: false
    };
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  var stage = document.getElementById("stage");
  var announcer = document.getElementById("announce");
  function say(t) { announcer.textContent = ""; setTimeout(function () { announcer.textContent = t; }, 30); }

  function updateHud() {
    var sh = Math.max(0, S.shield);
    document.getElementById("hud-shield").textContent = sh + "%";
    var bar = document.getElementById("hud-shield-bar");
    bar.setAttribute("aria-valuenow", sh);
    var fill = document.getElementById("hud-shield-fill");
    fill.style.width = sh + "%";
    fill.className = "vcsw-progress-fill " + (sh >= 70 ? "success" : sh >= 40 ? "warning" : "error");
    document.getElementById("hud-score").textContent = S.score + " / " + MAX_SCORE;
    document.getElementById("hud-hints").textContent = S.hints;
    document.getElementById("hud-crystals").textContent = S.crystals.length;
    var steps = document.getElementById("steps");
    steps.innerHTML = STEPS.map(function (s, i) {
      var done = i < S.step, cur = i === S.step;
      return '<li class="' + (done ? "done" : "") + '"' + (cur ? ' aria-current="step"' : "") + ">" +
        (done ? icon("check", "sm") + '<span class="vcsw-sr-only">Afgerond: </span>' : "") + esc(s) + "</li>";
    }).join("");
  }

  function hurt(n) { S.shield = Math.max(0, S.shield - n); }

  function show(html, focusSel) {
    stage.innerHTML = html;
    updateHud();
    var h = stage.querySelector(focusSel || "h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: false }); }
    if (stage.getBoundingClientRect().top < 0) stage.scrollIntoView();
  }

  function speech(whoKey, text) {
    var p = PEOPLE[whoKey];
    return '<div class="speech"><span class="who ' + (p.cls || "") + '" aria-hidden="true">' + p.initials + '</span>' +
      '<div class="bubble"><p class="name">' + esc(p.name) + '</p><p>' + esc(text) + "</p></div></div>";
  }

  function alertBox(kind, title, text) {
    var ic = kind === "success" ? "check" : kind === "error" ? "x" : kind === "warning" ? "warn" : "info";
    return '<div class="vcsw-alert ' + (kind === "info" ? "" : kind) + '" role="status">' + icon(ic) +
      '<div><p class="vcsw-alert-title">' + esc(title) + '</p><p class="vcsw-alert-text">' + esc(text) + "</p></div></div>";
  }

  function btn(label, action, kind, ic, extra) {
    return '<button type="button" class="vcsw-button' + (kind ? " " + kind : "") + '" data-action="' + action + '"' + (extra || "") + ">" +
      (ic === "left" ? icon("arrowL") : "") + esc(label) + (ic && ic !== "left" ? icon(ic) : "") + "</button>";
  }

  /* ---------- Screens ---------- */
  function renderStart() {
    S.step = -1;
    show(
      '<p class="overline">Level 4</p>' +
      "<h2>Het vrachtdok</h2>" +
      '<p class="lead">Je leert gegevens veilig te ontvangen en te delen, ze alleen te gebruiken waarvoor ze bedoeld zijn en valse berichten te herkennen.</p>' +
      alertBox("info", "Alles in dit spel is fictief", "Alle namen, planeten, adressen en gegevens zijn verzonnen. Gebruik nooit echte voorbeelden uit dossiers.") +
      '<h3>Zo werkt het</h3><ul>' +
      "<li>Je doorloopt vijf situaties in je dienst. Meestal kies je uit drie opties, en één keer controleer je een mail.</li>" +
      "<li>Goede keuzes houden je schilden sterk en leveren datakristallen en aanwijzingen op voor de luchtsluis.</li>" +
      "<li>In de luchtsluis beoordeel je tien binnenkomende berichten. Je hebt vijf minuten en drie gratis hints.</li>" +
      "<li>Je haalt het level met minimaal 70 procent van de punten. Daarna word je Kapitein van de Datawacht.</li>" +
      "</ul>" +
      '<div class="actions">' + btn("Start level 4", "briefing", "", "arrowR") + "</div>"
    );
  }

  function renderBriefing() {
    S.step = 0;
    show(
      '<p class="overline">Briefing</p><h2>Missie: het vrachtdok</h2>' +
      speech("ARIA", BRIEFING) +
      '<div class="actions">' + btn("Begin je dienst", "sit", "", "arrowR") + "</div>"
    );
  }

  function startSit() { S.chosen = null; S.mail = { round: 1, sel: {}, checked: false, e1: 0, e2: 0, grade: null }; renderSit(); }

  function mailErrors(s, round) {
    var e = 0;
    Object.keys(s.items).forEach(function (k) { var bad = round === 1 ? s.items[k].r1 : s.items[k].r2; if (!!S.mail.sel[k] !== bad) e++; });
    return e;
  }

  function renderMail() {
    var s = SITUATIONS[S.sit], M = S.mail, r = M.round;
    var badKey = r === 1 ? "r1" : "r2";
    var nSel = Object.keys(M.sel).filter(function (k) { return M.sel[k]; }).length;
    function tokens(str) {
      return esc(str).replace(/\n/g, "<br>").replace(/\{(\w+)\}/g, function (_, k) {
        var it = s.items[k], on = !!M.sel[k], cls = "token", mark = "";
        if (M.checked) {
          var right = on === it[badKey];
          cls += right ? " right" : " wrong";
          mark = (right ? icon("check") : icon("half")) + '<span class="vcsw-sr-only">' + (it[badKey] ? " mag niet via deze weg" : " mag wel") + (right ? ", goed beoordeeld" : ", niet goed beoordeeld") + "</span>";
        }
        return '<span role="button" tabindex="' + (M.checked ? "-1" : "0") + '" class="' + cls + '" data-tok="' + k + '" aria-pressed="' + on + '"' + (M.checked ? ' aria-disabled="true"' : "") + ">" + (function () { var i = it.text.lastIndexOf(" "); return esc(it.text.slice(0, i + 1)) + '<span style="white-space:nowrap">' + esc(it.text.slice(i + 1)) + mark + "</span>"; })() + "</span>";
      });
    }
    var body = s.body.split("\n\n").map(function (para) { return "<p>" + tokens(para) + "</p>"; }).join("");
    if (s.attach) {
      body += '<div class="mail-attach"><p class="attach-name">' + icon("file", "sm") + "Bijlage: " + esc(s.attach.name) + "</p>" +
        '<div class="vcsw-table-wrap"><table class="vcsw-table"><tbody>' +
        s.attach.rows.map(function (row) { return "<tr><th scope=\"row\">" + esc(row[0]) + "</th><td>" + tokens(row[1]) + "</td></tr>"; }).join("") +
        "</tbody></table></div></div>";
    }

    var via = r === 1
      ? '<span class="via open">' + icon("mail", "sm") + "Stationsmail, gewoon kanaal</span>"
      : '<span class="via safe">' + icon("lock", "sm") + "Kluispost, beveiligd kanaal</span>";
    var task = r === 1
      ? "<p><strong>Stap 1 van 2.</strong> De mail gaat via de gewone stationsmail. Klik in de mail en de bijlage alle gegevens aan die zo niet verstuurd mogen worden. Klik nog een keer om een keuze ongedaan te maken.</p>"
      : "<p><strong>Stap 2 van 2.</strong> Bram verstuurt de mail nu via Kluispost, het beveiligde kanaal van Orion. Aangetekend verzenden kan ook. Klik aan wat er zelfs via dit kanaal niet in hoort.</p>";

    var fb = "";
    if (M.checked) {
      var list = Object.keys(s.items).filter(function (k) { return s.items[k][badKey] || !!M.sel[k] !== s.items[k][badKey]; }).map(function (k) {
        var it = s.items[k], right = !!M.sel[k] === it[badKey];
        var why = r === 1 ? it.why1 : (it.r2 ? it.why2 : (it.r1 ? s.why2ok : "Mocht al via de gewone mail, en mag hier dus ook."));
        return "<li>" + (right ? icon("check", "ok") : icon("x", "no")) + "<span><strong>" + esc(it.text) + "</strong>: " +
          (it[badKey] ? "mag niet via deze weg" : "mag wel") + (right ? "" : " (jij koos anders)") + ". " + esc(why) + "</span></li>";
      }).join("");
      var e = r === 1 ? M.e1 : M.e2;
      fb = '<div class="feedback">' + alertBox(e === 0 ? "success" : "warning", e === 0 ? "Alles goed beoordeeld" : e + (e === 1 ? " gegeven" : " gegevens") + " niet goed beoordeeld", r === 1 ? "Gevoelige gegevens horen niet in een gewone mail." : "Een beveiligd kanaal is nodig, maar niet genoeg.") +
        '<ul class="result-list">' + list + "</ul>";
      if (r === 1) {
        fb += "</div>" + '<div class="actions">' + btn("Verstuur via Kluispost", "mail2", "", "arrowR") + "</div>";
      } else {
        var g = M.grade, o = s.react[g];
        var title = g === "good" ? "Goed, +10 punten" : g === "half" ? "Half goed, +5 punten, schild −5%" : "Fout, 0 punten, schild −10%";
        fb += speech(o.who, o.say) + alertBox(g === "good" ? "success" : g === "half" ? "warning" : "error", title, s.goodWhy);
        if (g === "good") {
          fb += '<div class="reward">' + icon("gem") + "<div><strong>Datakristal: " + esc(s.crystal.name) + "</strong><br>" + esc(s.crystal.text) + "</div></div>";
          fb += '<div class="reward">' + icon("bulb") + "<div><strong>Aanwijzing voor de luchtsluis</strong><br>" + esc(s.clue) + "</div></div>";
        } else {
          fb += '<div class="reward">' + icon("info") + "<div><strong>Geen aanwijzing deze keer</strong><br>Je kunt in de luchtsluis een hint gebruiken als je twijfelt.</div></div>";
        }
        fb += "</div>" + '<div class="actions">' + btn("Volgende situatie", "nextsit", "", "arrowR") + "</div>";
      }
    }

    show(
      '<p class="overline">Dienst · situatie ' + (S.sit + 1) + " van " + SITUATIONS.length + "</p>" +
      "<h2>" + esc(s.title) + "</h2><p>" + esc(s.intro) + "</p>" +
      (r === 1 ? speech(s.speaker, s.line) : "") + task +
      '<div class="mailbox"><div class="msg-head">' +
      '<div class="row"><span class="k">Aan</span><span class="v">Kapitein Vega &lt;vega@novaterra.space&gt;</span></div>' +
      '<div class="row"><span class="k">Onderwerp</span><span class="v">Uitkomst kostencontrole Nova Terra</span></div>' +
      '<div class="row"><span class="k">Via</span><span class="v">' + via + "</span></div></div>" +
      '<div class="mail-body">' + body + "</div></div>" +
      (M.checked ? fb : '<p class="sel-count" aria-live="polite">' + nSel + " gegevens aangeklikt</p>" + '<div class="actions">' + btn("Controleer", "mailcheck", "", "check") + "</div>"),
      M.checked ? ".feedback .vcsw-alert-title" : "h2"
    );
  }

  function checkMail() {
    var s = SITUATIONS[S.sit], M = S.mail;
    M.checked = true;
    if (M.round === 1) { M.e1 = mailErrors(s, 1); }
    else {
      M.e2 = mailErrors(s, 2);
      var e = M.e1 + M.e2;
      M.grade = e === 0 ? "good" : e <= 2 ? "half" : "bad";
      S.score += POINTS[M.grade];
      hurt(SHIELD_COST[M.grade]);
      S.sitResults[S.sit] = M.grade;
      if (M.grade === "good") { S.crystals.push(s.crystal.name); S.clues[S.sit] = true; }
    }
    renderMail();
  }

  function renderSit() {
    S.step = 1;
    var s = SITUATIONS[S.sit];
    if (s.type === "mail") return renderMail();
    if (S.chosen === null) S.optOrder = shuffle([0, 1, 2]);
    var letters = ["A", "B", "C"];
    var opts = S.optOrder.map(function (oi, k) {
      var o = s.options[oi];
      var cls = "option";
      var verdict = "";
      if (S.chosen !== null) {
        cls += " " + o.grade + (S.chosen === oi ? " chosen" : " dim");
        if (S.chosen === oi) {
          verdict = o.grade === "good" ? '<span class="verdict ok">' + icon("check", "sm") + "Goed</span>" :
                    o.grade === "half" ? '<span class="verdict mid">' + icon("half", "sm") + "Half goed</span>" :
                    '<span class="verdict no">' + icon("x", "sm") + "Fout</span>";
        }
      }
      return '<li><button type="button" class="' + cls + '" data-opt="' + oi + '"' + (S.chosen !== null ? " disabled" : "") + ">" +
        '<span class="letter" aria-hidden="true">' + letters[k] + "</span><span>" + esc(o.text) + "</span>" + verdict + "</button></li>";
    }).join("");

    var fb = "";
    if (S.chosen !== null) {
      var o = s.options[S.chosen];
      var title = o.grade === "good" ? "Goed, +10 punten" : o.grade === "half" ? "Half goed, +5 punten, schild −5%" : "Fout, 0 punten, schild −10%";
      fb = '<div class="feedback">' +
        speech(o.react.who, o.react.say) +
        alertBox(o.grade === "good" ? "success" : o.grade === "half" ? "warning" : "error", title, o.why);
      if (o.grade === "good") {
        if (s.crystal) fb += '<div class="reward">' + icon("gem") + "<div><strong>Datakristal: " + esc(s.crystal.name) + "</strong><br>" + esc(s.crystal.text) + "</div></div>";
        fb += '<div class="reward">' + icon("bulb") + "<div><strong>Aanwijzing voor de luchtsluis</strong><br>" + esc(s.clue) + "</div></div>";
      } else {
        fb += '<div class="reward">' + icon("info") + "<div><strong>Geen aanwijzing deze keer</strong><br>Je kunt in de luchtsluis een hint gebruiken als je twijfelt.</div></div>";
      }
      fb += "</div>";
      var last = S.sit === SITUATIONS.length - 1;
      fb += '<div class="actions">' + btn(last ? "Naar de luchtsluis" : "Volgende situatie", last ? "prelock" : "nextsit", "", "arrowR") + "</div>";
    }

    show(
      '<p class="overline">Dienst · situatie ' + (S.sit + 1) + " van " + SITUATIONS.length + "</p>" +
      "<h2>" + esc(s.title) + "</h2>" +
      "<p>" + esc(s.intro) + "</p>" +
      speech(s.speaker, s.line) +
      '<p class="vcsw-sr-only">Kies een van de drie opties.</p>' +
      '<ul class="options">' + opts + "</ul>" + fb,
      S.chosen !== null ? ".feedback .vcsw-alert-title" : "h2"
    );
  }

  function choose(oi) {
    var s = SITUATIONS[S.sit];
    var o = s.options[oi];
    S.chosen = oi;
    S.score += POINTS[o.grade];
    hurt(SHIELD_COST[o.grade]);
    S.sitResults[S.sit] = o.grade;
    if (o.grade === "good") {
      if (s.crystal) S.crystals.push(s.crystal.name);
      S.clues[S.sit] = true;
    }
    renderSit();
    var t = stage.querySelector(".feedback .vcsw-alert-title");
    if (t) { t.setAttribute("tabindex", "-1"); t.focus(); }
  }

  function renderPreLock() {
    S.step = 2;
    var items = SITUATIONS.map(function (s, i) {
      return S.clues[i]
        ? '<li class="got">' + icon("bulb", "sm") + "<span>" + esc(s.clue) + "</span></li>"
        : '<li class="missed">' + icon("lock", "sm") + "<span>Aanwijzing gemist bij “" + esc(s.title) + "”.</span></li>";
    }).join("");
    show(
      '<p class="overline">Luchtsluis</p><h2>De berichtenstroom</h2>' +
      speech("ARIA", "De Zwarte Nevel bestookt het vrachtdok met berichten. Tien berichten komen één voor één binnen. Alleen de echte berichten bevatten een stukje van de sluiscode.") +
      "<h3>Zo open je de sluis</h3><ul>" +
      "<li>Schuif een bericht naar links als het een aanval is, of naar rechts als het echt is. Je kunt ook de knoppen of de pijltjestoetsen gebruiken.</li>" +
      "<li>Je hebt vijf minuten. De klok staat stil terwijl je de uitleg na een bericht leest, en je kunt hem pauzeren.</li>" +
      "<li>Je hebt " + S.hints + " gratis hints. Daarna kost een hint " + EXTRA_HINT_COST + "% schildsterkte.</li>" +
      "</ul>" +
      "<h3>Je aanwijzingen uit de dienst</h3><ul class=\"clues\">" + items + "</ul>" +
      '<div class="actions">' + btn("Open de berichtenstroom", "lock", "", "arrowR") + "</div>"
    );
  }

  function startLock() {
    S.msgs = shuffle(MESSAGES);
    S.msgIdx = 0; S.msgResults = []; S.answered = false; S.hintShown = false;
    S.timeLeft = LOCK_SECONDS; S.paused = false; S.timedOut = false; S.code = [];
    // Assign code digits to the real messages in order of appearance
    var n = 0;
    S.msgs.forEach(function (m) { if (m.real) { n++; S.code.push({ id: m.id, part: n, digit: Math.floor(Math.random() * 10), got: false }); } });
    S.screen = "lock";
    renderLock();
    startTimer();
  }

  function startTimer() {
    stopTimer();
    S.timer = setInterval(function () {
      if (S.paused || S.answered || S.screen !== "lock") return;
      S.timeLeft--;
      var el = document.getElementById("timer");
      if (el) { el.querySelector("span").textContent = fmt(S.timeLeft); el.classList.toggle("low", S.timeLeft <= 60); }
      if (S.timeLeft === 60) say("Nog één minuut.");
      if (S.timeLeft <= 0) { stopTimer(); S.timedOut = true; say("De tijd is op."); renderCode(); }
    }, 1000);
  }
  function stopTimer() { if (S.timer) { clearInterval(S.timer); S.timer = null; } }
  function fmt(s) { s = Math.max(0, s); var m = Math.floor(s / 60), r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; }

  function codeFor(id) { for (var i = 0; i < S.code.length; i++) if (S.code[i].id === id) return S.code[i]; return null; }

  function renderLock() {
    S.step = 2;
    var m = S.msgs[S.msgIdx];
    var res = S.msgResults[S.msgIdx];
    var head =
      '<div class="msg-head">' +
      '<div class="row"><span class="k">Van</span><span class="v">' + esc(m.from) + " &lt;" + esc(m.addr) + "&gt;</span></div>" +
      '<div class="row"><span class="k">Kanaal</span><span class="v">' + esc(m.channel) + "</span></div></div>";
    var body = '<p class="msg-subject">' + esc(m.subject) + '</p><p class="msg-body">' + esc(m.body) + "</p>" +
      (m.link ? '<p class="msg-body mt"><span class="msg-link">' + esc(m.link) + "</span></p>" : "") +
      (m.attach ? '<span class="msg-attach">' + icon("file", "sm") + esc(m.attach) + "</span>" : "");

    var hintLabel = S.hints > 0 ? "Hint gebruiken (" + S.hints + " gratis)" : "Hint gebruiken (kost " + EXTRA_HINT_COST + "% schild)";
    var controls, fb = "";
    if (!S.answered) {
      controls =
        '<div class="swipe-actions">' +
        '<button type="button" class="vcsw-button destructive" data-action="attack">' + icon("arrowL") + "Aanval</button>" +
        '<button type="button" class="vcsw-button" data-action="real">Echt' + icon("arrowR") + "</button></div>" +
        '<p class="swipe-help">Schuif de kaart, gebruik de knoppen of druk op pijltje links of rechts.</p>' +
        '<div class="hint-box">' + (S.hintShown
          ? '<div class="reward">' + icon("bulb") + "<div><strong>Hint</strong><br>" + esc(m.hint) + "</div></div>"
          : btn(hintLabel, "hint", "ghost sm", "")) + "</div>";
    } else {
      var correct = res === "ok";
      var c = codeFor(m.id);
      var title = correct ? (m.real ? "Goed, dit bericht is echt" : "Goed, dit is een aanval van de Zwarte Nevel")
                          : (m.real ? "Fout, dit bericht was echt" : "Fout, dit was een aanval van de Zwarte Nevel");
      fb = '<div class="lock-feedback">' + alertBox(correct ? "success" : "error", title + (correct ? ", +10 punten" : ""), "Signaal: " + m.signal);
      if (m.real && correct && c) fb += '<div class="reward">' + icon("unlock") + "<div><strong>Sluiscode deel " + c.part + " van " + S.code.length + ": " + c.digit + "</strong><br>Onthoud dit cijfer en zijn plek.</div></div>";
      if (m.real && !correct && c) fb += '<div class="reward">' + icon("lock") + "<div><strong>Sluiscode deel " + c.part + " gemist</strong><br>Je kunt het straks terughalen, maar dat kost schildsterkte.</div></div>";
      if (!m.real && !correct) fb += speech("ARIA", "Je opende een aanval. Ik heb de verbinding verbroken, maar dit wordt onthouden. In level 5 begin je met een extra incident.");
      fb += "</div>";
      var last = S.msgIdx === S.msgs.length - 1;
      controls = fb + '<div class="actions" style="justify-content:center">' + btn(last ? "Naar het codepaneel" : "Volgend bericht", last ? "code" : "nextmsg", "", "arrowR") + "</div>";
    }

    show(
      '<p class="overline">Luchtsluis</p><h2>De berichtenstroom</h2>' +
      '<div class="lock-top"><span class="timer' + (S.timeLeft <= 60 ? " low" : "") + '" id="timer" role="timer" aria-label="Resterende tijd">' + icon("timer") + "<span>" + fmt(S.timeLeft) + "</span></span>" +
      '<span class="count">Bericht ' + (S.msgIdx + 1) + " van " + S.msgs.length + "</span>" +
      btn(S.paused ? "Hervat" : "Pauzeer", "pause", "outline sm", "", ' aria-pressed="' + S.paused + '"') + "</div>" +
      (S.paused
        ? alertBox("info", "Gepauzeerd", "De klok staat stil. Kies Hervat om verder te gaan.")
        : '<div class="deck"><article class="msg" id="msgcard" aria-label="Binnenkomend bericht ' + (S.msgIdx + 1) + '">' +
          '<span class="stamp left" aria-hidden="true">AANVAL</span><span class="stamp right" aria-hidden="true">ECHT</span>' +
          head + body + "</article></div>" + controls),
      S.answered ? ".lock-feedback .vcsw-alert-title" : "h2"
    );
    if (!S.answered && !S.paused) bindSwipe();
  }

  function classify(saysReal) {
    if (S.answered || S.paused) return;
    var m = S.msgs[S.msgIdx];
    var ok = saysReal === m.real;
    S.msgResults[S.msgIdx] = ok ? "ok" : "no";
    if (ok) {
      S.score += 10;
      if (m.real) codeFor(m.id).got = true;
    } else {
      if (!m.real) { S.clickedAttack = true; hurt(10); } else { hurt(5); }
    }
    S.answered = true;
    renderLock();
    var t = stage.querySelector(".lock-feedback .vcsw-alert-title");
    if (t) { t.setAttribute("tabindex", "-1"); t.focus(); }
  }

  function bindSwipe() {
    var card = document.getElementById("msgcard");
    if (!card) return;
    var startX = null, dx = 0, id = null;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var stL = card.querySelector(".stamp.left"), stR = card.querySelector(".stamp.right");
    card.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      startX = e.clientX; dx = 0; id = e.pointerId;
      try { card.setPointerCapture(id); } catch (err) {}
      card.classList.add("dragging"); card.style.transition = "none";
    });
    card.addEventListener("pointermove", function (e) {
      if (startX === null) return;
      dx = e.clientX - startX;
      card.style.transform = "translateX(" + dx + "px) rotate(" + (dx / 30) + "deg)";
      stL.style.opacity = dx < 0 ? Math.min(1, -dx / 100) : 0;
      stR.style.opacity = dx > 0 ? Math.min(1, dx / 100) : 0;
    });
    function end() {
      if (startX === null) return;
      startX = null; card.classList.remove("dragging");
      if (Math.abs(dx) > 100) { classify(dx > 0); return; }
      card.style.transition = reduce ? "none" : "transform 200ms ease";
      card.style.transform = ""; stL.style.opacity = 0; stR.style.opacity = 0;
    }
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }

  function useHint() {
    if (S.hints > 0) S.hints--; else hurt(EXTRA_HINT_COST);
    S.hintShown = true;
    renderLock();
    var r = stage.querySelector(".hint-box .reward");
    if (r) { r.setAttribute("tabindex", "-1"); r.focus(); }
  }

  function renderCode(errorMsg) {
    stopTimer();
    S.screen = "code"; S.step = 2;
    var frags = S.code.map(function (c) {
      var have = c.got || S.recovered[c.id];
      return '<div class="frag' + (have ? "" : " missing") + '"><span class="n">Deel ' + c.part + '</span><span class="d">' + (have ? c.digit : "?") + "</span>" +
        (have ? "" : '<span class="vcsw-sr-only">ontbreekt</span>') + "</div>";
    }).join("");
    var missing = S.code.filter(function (c) { return !(c.got || S.recovered[c.id]); });
    var unanswered = S.msgs.length - S.msgResults.filter(Boolean).length;
    var rec = missing.length
      ? "<h3>Ontbrekende delen terughalen</h3><p>Bekijk het echte bericht opnieuw om het cijfer terug te halen. Dat kost " + EXTRA_HINT_COST + "% schildsterkte per deel.</p>" +
        '<div class="actions" style="margin-top:8px">' + missing.map(function (c) {
          return btn("Deel " + c.part + " terughalen", "recover", "outline", "", ' data-id="' + c.id + '"');
        }).join("") + "</div>"
      : "";
    show(
      '<p class="overline">Luchtsluis</p><h2>Het codepaneel</h2>' +
      (S.timedOut ? alertBox("warning", "De tijd is op", unanswered + " berichten zijn niet beoordeeld en leveren geen punten op.") : "") +
      "<p>Voer de " + S.code.length + " cijfers van de sluiscode in, in de volgorde van de delen.</p>" +
      '<div class="fragments">' + frags + "</div>" + rec +
      '<form id="codeform" class="mt" novalidate><div class="vcsw-field"><label for="codein">Sluiscode</label>' +
      '<div class="code-row"><input class="vcsw-input" id="codein" inputmode="numeric" autocomplete="off" maxlength="' + S.code.length + '" pattern="[0-9]*"' +
      (errorMsg ? ' aria-invalid="true" aria-describedby="codeerr"' : "") + ">" +
      '<button type="submit" class="vcsw-button">' + icon("unlock") + "Open de sluis</button></div>" +
      (errorMsg ? '<p class="vcsw-help error" id="codeerr">' + esc(errorMsg) + "</p>" : "") + "</div></form>",
      errorMsg ? "#codein" : "h2"
    );
  }

  function checkCode(val) {
    var want = S.code.map(function (c) { return c.digit; }).join("");
    if (val.replace(/\s/g, "") === want) { renderDebrief(true); }
    else renderCode("Deze code klopt niet. Controleer de cijfers en hun volgorde.");
  }

  function renderDebrief(opened) {
    S.screen = "debrief"; S.step = 3;
    var pct = Math.round((S.score / MAX_SCORE) * 100);
    var passed = S.score / MAX_SCORE >= PASS;
    if (passed) document.getElementById("hud-rank").textContent = "Kapitein";
    var sitLines = SITUATIONS.map(function (s, i) {
      var g = S.sitResults[i];
      var good = s.type === "mail" ? { text: s.goodText, why: s.goodWhy } : s.options.filter(function (o) { return o.grade === "good"; })[0];
      var ic = g === "good" ? icon("check", "ok") : g === "half" ? icon("half", "mid") : icon("x", "no");
      var lbl = g === "good" ? "Goed" : g === "half" ? "Half goed" : "Fout";
      return "<li>" + ic + "<span><strong>" + esc(s.title) + "</strong> (" + lbl + "). " + (g === "good" ? "" : "Beter was: " + esc(good.text) + " ") + esc(good.why) + "</span></li>";
    }).join("");
    var okMsgs = S.msgResults.filter(function (r) { return r === "ok"; }).length;
    var crystals = S.crystals.length
      ? '<ul class="crystal-list">' + S.crystals.map(function (c) { return '<li><span class="vcsw-badge">' + icon("gem") + esc(c) + "</span></li>"; }).join("") + "</ul>"
      : "<p>Je verdiende deze keer geen datakristallen.</p>";
    var carry = S.clickedAttack
      ? alertBox("warning", "Doorwerking naar level 5", "Je opende een aanval van de Zwarte Nevel. In level 5 meldt ARIA een verdachte inlog op je account en krijg je een extra opdracht.")
      : alertBox("success", "Geen doorwerking naar level 5", "Je opende geen enkele aanval. Je account is schoon.");
    var summary = passed
      ? "Sterk werk. De sluis staat open en de Zwarte Nevel blijft buiten. Hier is wat goed ging en waarom."
      : "De sluis is open, maar het vertrouwen aan boord is nog niet groot genoeg. Je speelt de dienst opnieuw. Hier is waarom.";
    show(
      '<p class="overline">Debriefing</p><h2>' + (passed ? "Level gehaald. Je bent nu Kapitein" : "Nog niet gehaald") + "</h2>" +
      speech("ARIA", summary) +
      '<div class="vcsw-stats cols-3 mt">' +
      '<div class="vcsw-stat"><p class="vcsw-stat-label">Score</p><p class="vcsw-stat-value">' + pct + '%</p><p class="vcsw-stat-note">' + S.score + " van " + MAX_SCORE + " punten, 70% nodig</p></div>" +
      '<div class="vcsw-stat"><p class="vcsw-stat-label">Schildsterkte</p><p class="vcsw-stat-value">' + S.shield + "%</p></div>" +
      '<div class="vcsw-stat"><p class="vcsw-stat-label">Berichten goed beoordeeld</p><p class="vcsw-stat-value">' + okMsgs + " van " + MESSAGES.length + "</p></div></div>" +
      "<h3>Je dienst</h3><ul class=\"result-list\">" + sitLines + "</ul>" +
      "<h3>Datakristallen</h3>" + crystals +
      '<div class="mt">' + carry + "</div>" +
      "<h3>Drie kernregels</h3><ol class=\"rules\">" + RULES.map(function (r) { return "<li><span>" + esc(r) + "</span></li>"; }).join("") + "</ol>" +
      '<div class="actions">' + (passed ? btn("Terug op aarde", "earth", "", "arrowR") : btn("Level opnieuw spelen", "restart", "", "refresh")) + "</div>"
    );
  }

  function renderEarth() {
    S.screen = "earth"; S.step = 4;
    show(
      '<p class="overline">Terug op aarde</p><h2>Wat betekent dit voor je werk bij VCSW?</h2>' +
      "<h3>Veilig ontvangen</h3><p>Denk aan de Excel met BSN’s die een klant mailt voor een Whk-controle. Sla zo’n bestand op in de beveiligde omgeving, verwijder de mail en wijs de klant vriendelijk op de beveiligde weg voor de volgende keer.</p>" +
      "<h3>Niet meer opvragen dan nodig</h3><p>Bij een Besparingscheck vraag je niet meer op dan nodig is voor de check. Gegevens van de ene klant zijn nooit voorbeeldmateriaal voor een andere.</p>" +
      "<h3>Veilig mailen</h3><p>BSN’s, verzuimgegevens, gezondheidsgegevens en andere gevoelige gegevens verstuur je nooit via een gewone mail. Via Zivver of aangetekend mailen mag het wel. Let ook dan op wat je meestuurt, ook in bijlagen. Stuur alleen wat de ontvanger echt nodig heeft, en laat zaken als een rekeningnummer of privéomstandigheden weg als die niet nodig zijn. Medische informatie, zoals een diagnose, is alleen voor de bedrijfsarts en stuur je ook via Zivver niet naar een werkgever.</p>" +
      "<h3>Goedgekeurde AI</h3><p>Goedgekeurde AI binnen VCSW is Claude en Libra. Daar mogen geen persoonsgegevens in, behalve zakelijke gegevens en geanonimiseerde of gepseudonimiseerde gegevens. Alleen namen weghalen maakt een bestand nog niet anoniem.</p>" +
      "<h3>Valse berichten</h3><p>Afwijkende afzender, spoed of geheimhouding? Stop en controleer via een andere weg, bijvoorbeeld door de afzender te bellen op een nummer dat je al kent.</p>" +
      '<div class="vcsw-alert actionable mt" role="note">' + icon("mail") +
      '<div><p class="vcsw-alert-title">Twijfel of een incident? Meld het direct</p><p class="vcsw-alert-text">Bij Tarik, Dagmar of via <a href="mailto:jz@vcsw.nl">jz@vcsw.nl</a>.</p></div></div>' +
      '<div class="actions">' + btn("Level opnieuw spelen", "restart", "secondary", "refresh") + "</div>"
    );
  }

  /* ---------- Events ---------- */
  stage.addEventListener("click", function (e) {
    var tk = e.target.closest("[data-tok]");
    if (tk && tk.getAttribute("aria-disabled") !== "true") {
      var key = tk.getAttribute("data-tok");
      S.mail.sel[key] = !S.mail.sel[key];
      tk.setAttribute("aria-pressed", String(!!S.mail.sel[key]));
      var n = Object.keys(S.mail.sel).filter(function (k) { return S.mail.sel[k]; }).length;
      var c = stage.querySelector(".sel-count"); if (c) c.textContent = n + " gegevens aangeklikt";
      return;
    }
    var o = e.target.closest("[data-opt]");
    if (o && !o.disabled) { choose(Number(o.getAttribute("data-opt"))); return; }
    var b = e.target.closest("[data-action]");
    if (!b) return;
    var a = b.getAttribute("data-action");
    if (a === "briefing") renderBriefing();
    else if (a === "sit") { S.sit = 0; startSit(); }
    else if (a === "nextsit") { S.sit++; startSit(); }
    else if (a === "mailcheck") checkMail();
    else if (a === "mail2") { S.mail.round = 2; S.mail.sel = {}; S.mail.checked = false; renderMail(); }
    else if (a === "prelock") renderPreLock();
    else if (a === "lock") startLock();
    else if (a === "attack") classify(false);
    else if (a === "real") classify(true);
    else if (a === "hint") useHint();
    else if (a === "nextmsg") { S.msgIdx++; S.answered = false; S.hintShown = false; renderLock(); }
    else if (a === "pause") { S.paused = !S.paused; renderLock(); var p = stage.querySelector('[data-action="pause"]'); if (p) p.focus(); }
    else if (a === "code") renderCode();
    else if (a === "recover") { hurt(EXTRA_HINT_COST); S.recovered[b.getAttribute("data-id")] = true; renderCode(); }
    else if (a === "earth") renderEarth();
    else if (a === "restart") { stopTimer(); reset(); document.getElementById("hud-rank").textContent = "Commandeur"; renderStart(); }
  });
  stage.addEventListener("keydown", function (e) {
    var tk = e.target.closest && e.target.closest("[data-tok]");
    if (tk && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); tk.click(); }
  });
  stage.addEventListener("submit", function (e) {
    if (e.target.id === "codeform") { e.preventDefault(); checkCode(document.getElementById("codein").value); }
  });
  document.addEventListener("keydown", function (e) {
    if (S.screen !== "lock" || S.answered || S.paused) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.key === "ArrowLeft") { e.preventDefault(); classify(false); }
    else if (e.key === "ArrowRight") { e.preventDefault(); classify(true); }
  });

  reset();
  renderStart();
})();
