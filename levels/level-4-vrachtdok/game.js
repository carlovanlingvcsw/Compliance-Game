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
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    tick: '<path d="M20 6 9 17l-5-5"/>',
    cross: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    swap: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
    inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>'
  };
  /* ARIA as the round lens, for the speech balloons with clues */
  var ARIA_AVATAR = '<svg class="aria-av" role="img" aria-label="ARIA" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="#0c2f5f"/><ellipse cx="48" cy="50" rx="30" ry="24" fill="#e8eef6"/><ellipse cx="48" cy="50" rx="30" ry="24" fill="none" stroke="#8fa0b8" stroke-width="2"/><circle cx="48" cy="50" r="13" fill="#04142b"/><circle cx="48" cy="50" r="8" fill="#15aaff"/><circle cx="45" cy="47" r="2.5" fill="#fff"/><rect x="10" y="44" width="10" height="12" rx="4" fill="#8fa0b8"/><rect x="76" y="44" width="10" height="12" rx="4" fill="#8fa0b8"/><path d="M48 26v-9" stroke="#8fa0b8" stroke-width="3" stroke-linecap="round"/><circle cx="48" cy="15" r="3" fill="#ffb900"/></svg>';
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
      intro: "Kapitein Vega stuurt via een open kanaal een bestand met namen, identiteitsnummers en loon van al haar crewleden, voor een kostencontrole.",
      speaker: "Vega",
      line: "Hier is het crewbestand voor de kostencontrole. Ik heb het even snel via het open kanaal gestuurd, dan kun je meteen aan de slag.",
      options: [
        { text: "Het bestand doorsturen naar de collega die de kostencontrole doet, met het verzoek het daarna in de beveiligde databank te zetten.", grade: "bad",
          react: { who: "Vega", say: "Prima, als het maar snel gaat." },
          why: "Elke extra kopie is een extra risico. Het bestand staat nu op twee plekken onbeveiligd, en het origineel staat nog in je berichten." },
        { text: "Het bestand opslaan in de beveiligde databank, het bericht wissen en Kapitein Vega vriendelijk wijzen op het beveiligde kanaal.", grade: "good",
          react: { who: "Vega", say: "Het beveiligde kanaal, genoteerd. Dat gebruik ik voortaan." },
          why: "Het bestand staat nu op één beveiligde plek en de onbeveiligde kopie is weg. Vega weet hoe het de volgende keer moet." },
        { text: "Het bestand opslaan in de beveiligde databank en Kapitein Vega vriendelijk wijzen op het beveiligde kanaal voor de volgende keer.", grade: "half",
          react: { who: "Vega", say: "Begrepen, volgende keer anders." },
          why: "Opslaan en Vega wijzen op het beveiligde kanaal klopt. Maar je wist het bericht niet, dus de onbeveiligde kopie staat nog in je berichten." }
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
          ["Loon per maand", "{sol}"],
          ["Rekeningnummer loon", "{iban}"],
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
        sol:    { text: "4.200 credits", r1: true, r2: false, why1: "Het loon van één crewlid is een gevoelig financieel gegeven en gaat niet via een gewone mail." },
        iban:   { text: "OR77 STB 0041 2290 18", r1: true, r2: true, why1: "Een persoonlijk rekeningnummer is een gevoelig financieel gegeven en gaat niet via een gewone mail.",
                  why2: "Een veilig kanaal maakt het kanaal veilig, maar niet elk gegeven nodig. Voor de kostencontrole heeft Vega Jorans rekeningnummer niet nodig." },
        beslag: { text: "beslag op loon, 650 credits per maand", r1: true, r2: true, why1: "Beslag op loon zegt iets over iemands financiële situatie. Gevoelig, dus niet via een gewone mail.",
                  why2: "Voor de kostencontrole is het beslag niet nodig. Deel alleen wat de ontvanger echt nodig heeft." }
      },
      why2ok: "Via Kluispost of aangetekend verzenden mag dit, omdat Kapitein Vega het nodig heeft voor de kostencontrole.",
      react: {
        good: { who: "Bram", say: "Oké, dan gaat hij via Kluispost. En de diagnose, het rekeningnummer, het beslag en die opmerking over zijn scheiding haal ik eruit." },
        half: { who: "Bram", say: "Bijna goed dus. Ik loop de mail en de bijlage nog een keer na voordat hij de deur uit gaat." },
        bad:  { who: "Bram", say: "Ai. Goed dat hij nog niet verstuurd was." }
      },
      goodText: "Het identiteitsnummer, de diagnose, verzuim, de vangnetregeling, het register, het loon, het rekeningnummer, het beslag en privézaken niet via de gewone stationsmail. Via Kluispost mag wat Vega nodig heeft, maar de diagnose, het rekeningnummer, het beslag en privézaken laat je ook dan weg.",
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
        { text: "Alle crewgegevens opvragen en afspraken over de verwerking vastleggen, dan hoeven we later niets meer na te vragen.", grade: "bad",
          react: { who: "Bram", say: "Zie je, nu hebben we alles. Handig toch?" },
          why: "Afspraken vastleggen is goed, maar je verzamelt meer dan nodig. Alles wat je niet nodig hebt, moet je wel beschermen en is een extra risico." },
        { text: "Alleen de gegevens opvragen die nodig zijn voor de scan, en afspraken over de verwerking vastleggen.", grade: "good",
          react: { who: "Bram", say: "Hm. Scheelt mij ook weer werk eigenlijk." },
          why: "Je vraagt alleen op wat de scan nodig heeft en legt vast wat ermee gebeurt. Zo gebruik je gegevens alleen voor het doel waarvoor je ze kreeg." },
        { text: "Alleen de gegevens opvragen die nodig zijn voor de scan, en ze meteen in de beveiligde databank zetten.", grade: "half",
          react: { who: "Bram", say: "Minder werk, en het staat veilig. Maar wat mogen we er straks eigenlijk mee?" },
          why: "Alleen opvragen wat nodig is klopt. Maar je legt geen afspraken over de verwerking vast, dus niemand weet waarvoor de gegevens gebruikt mogen worden." }
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
        { text: "Het bestand uploaden naar de scanner van het handelsschip, maar eerst vragen waar de gegevens worden opgeslagen en hoe lang.", grade: "bad",
          react: { who: "Bram", say: "Ze zeggen dat het veilig is. Klaar in drie seconden." },
          why: "Het systeem is niet goedgekeurd. Een geruststellend antwoord van de handelaar verandert dat niet, en je weet nog steeds niet waar de gegevens terechtkomen." },
        { text: "Alleen goedgekeurde systemen gebruiken, met organisatiegegevens of gegevens die volgens de regels geanonimiseerd of gepseudonimiseerd zijn.", grade: "good",
          react: { who: "ARIA", say: "Dank je. Ik werk graag mee, zolang er geen persoonsgegevens in mij belanden die er niet in horen." },
          why: "Je gebruikt alleen goedgekeurde systemen en alleen gegevens die daarin mogen." },
        { text: "Het bestand in ARIA zetten, want die is goedgekeurd, en vooraf de namen van alle crewleden uit het bestand weghalen.", grade: "half",
          react: { who: "ARIA", say: "Ik ben goedgekeurd. Maar zonder namen kan ik nog steeds zien over wie het gaat." },
          why: "ARIA is goedgekeurd, dus het systeem klopt. Maar alleen namen weghalen maakt een bestand nog niet anoniem. Er mogen alleen gegevens in die volgens de regels geanonimiseerd of gepseudonimiseerd zijn." }
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
        { text: "Alleen mensen berichten die bij hun aanmelding toestemming gaven voor nieuws over Nova Terra.", grade: "half",
          react: { who: "Gilde", say: "Toestemming is toestemming, toch?" },
          why: "Je kijkt terecht naar toestemming. Maar die moet over deze reclame van het Handelsgilde gaan. Toestemming voor nieuws over Nova Terra telt daar niet voor." },
        { text: "Alleen mensen berichten die apart toestemming gaven om reclame van het Handelsgilde te ontvangen.", grade: "good",
          react: { who: "Gilde", say: "Een kleinere lijst dan gehoopt, maar goed." },
          why: "Gegevens uit een aanmelding zijn voor de selectie. Voor reclame is aparte toestemming nodig." },
        { text: "Alleen mensen berichten van wie de aanmelding al lang geleden is, want die gegevens worden toch niet meer gebruikt.", grade: "bad",
          react: { who: "Gilde", say: "Die oude aanmeldingen liggen toch maar stof te vangen." },
          why: "Een aanmelding is geen toestemming voor reclame. En die oude gegevens horen er vaak niet eens meer te zijn. Denk aan de bewaartermijn uit de passagiersmodule." }
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
      body: "Ik zit in een overleg en kan niet oproepen. Stuur me nu meteen de loonstrook van mijn crew. Dit kan echt niet wachten.",
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
  var CLUE_COST = 10;      // one price: a crystal earned in this level is one clue without cost, after that 10 percent shield
  var RECOVER_COST = 5;    // getting a missed part of the lock code back
  var CRYSTALS_MAX = SITUATIONS.filter(function (s) { return !!s.crystal; }).length;
  var LOCK_SECONDS = 300;
  var PASS = 0.7;
  var MAX_SCORE = SITUATIONS.length * 10 + MESSAGES.length * 10;

  var STEPS = ["Briefing", "Dienst", "Luchtsluis", "Debriefing", "Terug op aarde"];

  /* ---------- State ---------- */
  var S;
  function reset() {
    S = {
      screen: "start", step: -1, sit: 0, shield: 100, score: 0, asked: 0,
      crystals: [], clues: [], sitResults: [], chosen: null, optOrder: [],
      msgs: [], msgIdx: 0, msgResults: [], answered: false, clueShown: false,
      code: [], recovered: {}, clickedAttack: false, timeLeft: LOCK_SECONDS, paused: false, timer: null,
      timedOut: false, earthStep: 1
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
    document.getElementById("hud-score").textContent = S.score + " van " + MAX_SCORE;
    document.getElementById("hud-crystals").textContent = S.crystals.length + " van " + CRYSTALS_MAX;
    var steps = document.getElementById("steps");
    steps.innerHTML = STEPS.map(function (s, i) {
      var done = i < S.step, cur = i === S.step;
      return '<li class="' + (done ? "done" : "") + '"' + (cur ? ' aria-current="step"' : "") + ">" +
        (done ? icon("check", "sm") + '<span class="vcsw-sr-only">Afgerond: </span>' : "") + esc(s) + "</li>";
    }).join("");
  }

  function hurt(n) { S.shield = Math.max(0, S.shield - n); }

  /* Hook for the shell: always reflects the current state */
  window.orionStatus = function () {
    var done = S.screen === "debrief" || S.screen === "earth";
    return {
      score: S.score,
      max: MAX_SCORE,
      shield: Math.max(0, S.shield),
      crystals: S.crystals.length,
      crystalsMax: CRYSTALS_MAX,
      steps: STEPS.slice(),
      step: Math.max(0, S.step),
      done: done,
      passed: done ? S.score / MAX_SCORE >= PASS : null,
      pct: done ? Math.round((S.score / MAX_SCORE) * 100) : null
    };
  };

  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }
  function chips(list) { return '<div class="chips">' + list.map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("") + "</div>"; }
  function ilist(rows) {
    return '<ul class="ilist">' + rows.map(function (r) {
      return '<li><span class="ic' + (r[2] ? " " + r[2] : "") + '">' + icon(r[0]) + "</span><span>" + r[1] + "</span></li>";
    }).join("") + "</ul>";
  }

  function show(html, focusSel) {
    stage.innerHTML = html;
    updateHud();
    var h = stage.querySelector(focusSel || "h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: false }); }
    if (stage.getBoundingClientRect().top < 0) stage.scrollIntoView();
  }

  function speech(whoKey, text, extra) {
    var p = PEOPLE[whoKey];
    return '<div class="speech' + (extra ? " " + extra : "") + '"><span class="who ' + (p.cls || "") + '" aria-hidden="true">' + p.initials + '</span>' +
      '<div class="bubble"><p class="name">' + esc(p.name) + '</p><p>' + esc(text) + "</p></div></div>";
  }

  /* Feedback pieces shared by the mail and the other situations: title with the chips beside it, one calm verdict line,
     and the rewards as a short list. The verdict text carries vcsw-alert-text, so the bridge finds the explanation for Nalezen. */
  function fbHead(title, list) {
    return '<div class="fb-head"><h2>' + esc(title) + "</h2>" + chips(list) + "</div>";
  }
  function verdictLine(cls, ic, word, pts, text) {
    return '<div class="verdict-line ' + cls + '"><p class="verdict-title"><span class="verdict-word">' + icon(ic) + esc(word) + "</span>" +
      '<span class="verdict-pts">' + esc(pts) + "</span></p>" + '<p class="verdict-text vcsw-alert-text">' + esc(text) + "</p></div>";
  }
  function afterList(lines) {
    return '<ul class="fb-after">' + lines.map(function (l) { return "<li>" + icon(l[0], "sm") + "<span>" + l[1] + "</span></li>"; }).join("") + "</ul>";
  }
  /* In the game panel (about 717 px high at 1440x900) the mail review gets a fixed budget, so the button stays in view.
     The budget comes from a constant and the content above the review, never from the height of the frame: the shell sizes
     the frame from the content, so a link between the two would make the panel creep. Only a part that still overflows scrolls. */
  var PANEL_H = 717;
  function fitReview() {
    var rv = stage.querySelector(".fit-review");
    if (!rv) return;
    var parts = rv.querySelectorAll(".review-scroll");
    function overflow() { var o = 0; parts.forEach(function (el) { o += Math.max(0, el.scrollHeight - el.clientHeight); }); return o; }
    if (document.documentElement.classList.contains("in-orion")) {
      var top = rv.getBoundingClientRect().top + window.pageYOffset;
      rv.style.setProperty("--rv-h", Math.max(320, PANEL_H - top - 14) + "px");
      /* Side by side: give the mail more width while the notes still have room, and keep the split with the least overflow */
      if (getComputedStyle(rv).gridTemplateColumns.split(" ").length > 1) {
        var best = null;
        [1.3, 1.15, 1, 1.6, 1.9].forEach(function (f) {
          rv.style.gridTemplateColumns = "minmax(0, " + f + "fr) minmax(0, 1fr)";
          var o = overflow();
          if (!best || o < best.o - 2) best = { f: f, o: o };
        });
        rv.style.gridTemplateColumns = "minmax(0, " + best.f + "fr) minmax(0, 1fr)";
      }
    }
    parts.forEach(function (el) {
      var over = el.scrollHeight > el.clientHeight + 2;
      el.classList.toggle("is-over", over);
      var atEnd = function () { el.classList.toggle("at-end", el.scrollTop + el.clientHeight >= el.scrollHeight - 4); };
      if (!el.dataset.watch) { el.dataset.watch = "1"; el.addEventListener("scroll", atEnd, { passive: true }); }
      atEnd();
      if (over) { el.setAttribute("tabindex", "0"); el.setAttribute("role", "region"); }
      else { el.removeAttribute("tabindex"); el.removeAttribute("role"); }
    });
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
    S.screen = "start"; S.step = -1;
    show(
      "<h1>Het vrachtdok</h1>" +
      '<p class="lead">Je leert gegevens veilig te ontvangen en te delen, ze alleen te gebruiken waarvoor ze bedoeld zijn en valse berichten te herkennen.</p>' +
      alertBox("info", "Alles in dit spel is fictief", "Alle namen, planeten, adressen en gegevens zijn verzonnen. Gebruik nooit echte voorbeelden uit dossiers.") +
      '<h3>Zo werkt het</h3><ul>' +
      "<li>Je doorloopt vijf situaties in je dienst. Meestal kies je uit drie opties, en één keer controleer je een mail.</li>" +
      "<li>Goede keuzes houden je schilden sterk en leveren datakristallen op. Elk kristal is in de luchtsluis één aanwijzing van ARIA zonder kosten.</li>" +
      "<li>In de luchtsluis beoordeel je tien binnenkomende berichten. Je hebt vijf minuten.</li>" +
      "<li>Je haalt het level met minimaal 70 procent van de punten. Daarna word je Kapitein van de Datawacht.</li>" +
      "</ul>" +
      '<div class="actions">' + btn("Start level 4", "briefing", "", "arrowR") + "</div>"
    );
  }

  function renderBriefing() {
    S.screen = "briefing"; S.step = 0;
    /* The hidden marker tells the bridge that a new run starts here, so it forgets earlier answers. It is never shown. */
    show(
      '<p class="overline" hidden>Briefing</p><h2>Missie: het vrachtdok</h2>' +
      speech("ARIA", BRIEFING) +
      '<div class="actions">' + btn("Begin je dienst", "sit", "", "arrowR") + "</div>"
    );
  }

  function startSit() { S.screen = "sit"; S.chosen = null; S.mail = { round: 1, sel: {}, checked: false, e1: 0, e2: 0, grade: null }; renderSit(); }

  function mailErrors(s, round) {
    var e = 0;
    Object.keys(s.items).forEach(function (k) { var bad = round === 1 ? s.items[k].r1 : s.items[k].r2; if (!!S.mail.sel[k] !== bad) e++; });
    return e;
  }

  function renderMail() {
    var s = SITUATIONS[S.sit], M = S.mail, r = M.round;
    var badKey = r === 1 ? "r1" : "r2";
    var nSel = Object.keys(M.sel).filter(function (k) { return M.sel[k]; }).length;

    /* After checking: every item that is discussed gets a number, in reading order (mail first, then the attachment).
       Discussed means: it may not go this way, or the player judged it wrongly. */
    var marks = {}, order = [];
    if (M.checked) {
      var seq = [];
      s.body.replace(/\{(\w+)\}/g, function (_, k) { seq.push(k); return _; });
      if (s.attach) s.attach.rows.forEach(function (row) { row[1].replace(/\{(\w+)\}/g, function (_, k) { seq.push(k); return _; }); });
      seq.forEach(function (k) {
        var it = s.items[k];
        if (marks[k] || !(it[badKey] || !!M.sel[k] !== it[badKey])) return;
        order.push(k); marks[k] = order.length;
      });
    }
    function judged(k) { return !!M.sel[k] === s.items[k][badKey]; }
    function hasMark(str) { var f = false; str.replace(/\{(\w+)\}/g, function (_, k) { if (marks[k]) f = true; return _; }); return f; }
    function gap(inline, label) {
      label = label || "Tekst zonder markering, weggelaten";
      var inner = '<span aria-hidden="true">…</span><span class="vcsw-sr-only">' + label + "</span>";
      return inline ? '<span class="mail-cut" title="' + label + '">' + inner + "</span>" : '<p class="mail-gap" title="' + label + '">' + inner + "</p>";
    }

    function tokens(str) {
      return esc(str).replace(/\n/g, "<br>").replace(/\{(\w+)\}/g, function (_, k) {
        var it = s.items[k], on = !!M.sel[k];
        if (M.checked) {
          /* Feedback: plain text, or a tinted mark that follows the text, with its number in front */
          if (!marks[k]) return esc(it.text);
          var i = it.text.indexOf(" "), first = i < 0 ? it.text : it.text.slice(0, i), rest = i < 0 ? "" : it.text.slice(i);
          return '<mark class="mk ' + (judged(k) ? "is-ok" : "is-no") + '"><span class="mk-lead"><span class="mk-n" aria-hidden="true">' + marks[k] + "</span>" + esc(first) + "</span>" + esc(rest) +
            '<span class="vcsw-sr-only"> (toelichting ' + marks[k] + ")</span></mark>";
        }
        return '<span role="button" tabindex="0" class="token" data-tok="' + k + '" aria-pressed="' + on + '">' + esc(it.text) + "</span>";
      });
    }
    /* After checking, the mail is cut down to the sentences and attachment rows with a mark, so the review fits the panel.
       Every piece that is left out shows as one ellipsis: a line of its own between paragraphs, inline within one. */
    var body = "";
    if (!M.checked) {
      body = s.body.split("\n\n").map(function (para) { return "<p>" + tokens(para) + "</p>"; }).join("");
    } else {
      var cur = null, line = [], pend = false;
      var flush = function () { if (line.length) body += "<p>" + line.join(" ") + "</p>"; line = []; };
      s.body.split("\n\n").forEach(function (para, pi) {
        para.split(/(?<=\.)\s+(?=[A-Z])/).forEach(function (sen) {
          if (!hasMark(sen)) { pend = true; return; }
          if (cur !== pi) { flush(); if (pend) body += gap(); cur = pi; }
          else if (pend) line.push(gap(true));
          pend = false; line.push(tokens(sen));
        });
      });
      flush(); if (pend) body += gap();
    }
    /* Before checking, the attachment gets its own column beside the mail, so the selection fits the panel. After checking it stays under the mail. */
    var attachHtml = "";
    if (s.attach) {
      var rows = M.checked ? s.attach.rows.filter(function (row) { return hasMark(row[1]); }) : s.attach.rows;
      var hid = s.attach.rows.length - rows.length;
      attachHtml = '<div class="mail-attach"><p class="attach-name">' + icon("file", "sm") + "Bijlage: " + esc(s.attach.name) + "</p>" +
        (rows.length ? '<div class="vcsw-table-wrap"><table class="vcsw-table"><tbody>' +
          rows.map(function (row) { return "<tr><th scope=\"row\">" + esc(row[0]) + "</th><td>" + tokens(row[1]) + "</td></tr>"; }).join("") +
          "</tbody></table></div>" : "") +
        (hid ? gap(false, hid === 1 ? "Eén rij zonder markering, weggelaten" : hid + " rijen zonder markering, weggelaten") : "") + "</div>";
      if (M.checked) body += attachHtml;
    }

    var via = r === 1
      ? '<span class="via open">' + icon("mail", "sm") + "Stationsmail, gewoon kanaal</span>"
      : '<span class="via safe">' + icon("lock", "sm") + "Kluispost, beveiligd kanaal</span>";
    var task = r === 1
      ? "<p><strong>Stap 1 van 2.</strong> De mail gaat via de gewone stationsmail. Klik in de mail en de bijlage alle gegevens aan die zo niet verstuurd mogen worden. Klik nog een keer om een keuze ongedaan te maken.</p>"
      : "<p><strong>Stap 2 van 2.</strong> Bram verstuurt de mail nu via Kluispost, het beveiligde kanaal van Orion. Aangetekend verzenden kan ook. Klik aan wat er zelfs via dit kanaal niet in hoort.</p>";
    var mailbox = M.checked
      ? '<div class="mailbox review-scroll" aria-label="De mail, ingekort tot de markeringen"><div class="msg-head slim">' +
        '<span class="v">Aan Kapitein Vega</span><span class="v">' + via + "</span></div>" +
        '<div class="mail-body">' + body + "</div></div>"
      : '<div class="mailbox review-scroll" aria-label="De mail"><div class="msg-head">' +
        '<div class="row"><span class="k">Aan</span><span class="v">Kapitein Vega &lt;vega@novaterra.space&gt;</span></div>' +
        '<div class="row"><span class="k">Onderwerp</span><span class="v">Uitkomst kostencontrole Nova Terra</span></div>' +
        '<div class="row"><span class="k">Via</span><span class="v">' + via + "</span></div></div>" +
        '<div class="mail-body">' + body + "</div></div>";

    if (!M.checked) {
      /* In the game panel: title and chips on one row, then the mail on the left over the full height. On the right the intro,
         Bram's line and the task, the attachment and the button. The source order stays intro, mail, attachment, button,
         so reading and tabbing follow the task. Same budget as the review after checking; only a part that still overflows scrolls. */
      show(
        fbHead(s.title, ["Situatie " + (S.sit + 1) + " van " + SITUATIONS.length]) +
        '<div class="mail-review mail-pick fit-review"><div class="mail-brief"><p class="sit-intro">' + esc(s.intro) + "</p>" +
        (r === 1 ? speech(s.speaker, s.line, "slim") : "") + task + "</div>" + mailbox +
        '<div class="mail-att review-scroll" aria-label="De bijlage">' + attachHtml + "</div>" +
        '<div class="mail-foot"><p class="sel-count" aria-live="polite">' + nSel + " gegevens aangeklikt</p>" + '<div class="actions">' + btn("Controleer", "mailcheck", "", "check") + "</div></div></div>",
        "h2"
      );
      fitReview();
      return;
    }

    /* Step 1 gets an interim verdict without points; step 2 gets the verdict for both steps together (the same grade as the score) */
    var e = r === 1 ? M.e1 : M.e1 + M.e2, nAll = Object.keys(s.items).length, g = M.grade;
    var verdict = r === 1
      ? verdictLine("mid", "info", "Tussenoordeel", "Nog geen punten, die volgen na stap 2",
          (e === 0 ? "Je beoordeelde alle " + nAll + " gegevens goed." : "Je beoordeelde " + e + " van de " + nAll + " gegevens niet goed.") +
          " Gevoelige gegevens horen niet in een gewone mail, ook niet in een bijlage.")
      : verdictLine(g, g === "good" ? "check" : g === "half" ? "half" : "x", g === "good" ? "Goed" : g === "half" ? "Half goed" : "Niet goed",
          g === "good" ? "+10 punten" : g === "half" ? "+5 punten, schild −5%" : "0 punten, schild −10%",
          (e === 0 ? "Je beoordeelde in beide stappen alle gegevens goed." : "In stap 1 en 2 samen beoordeelde je " + plural(e, "gegeven", "gegevens") + " niet goed.") +
          " Ook via Kluispost deel je alleen wat de ontvanger echt nodig heeft, en medische details blijven bij de scheepsarts.");

    /* Notes: what went wrong stays open, what went well folds away behind one line */
    function note(k) {
      var it = s.items[k], ok = judged(k), txt;
      if (ok) txt = '<strong class="note-you">Goed gezien.</strong> ' + esc(r === 1 ? it.why1 : it.why2);
      else if (it[badKey]) txt = '<strong class="note-you">Gemist.</strong> ' + esc(r === 1 ? it.why1 : it.why2);
      else txt = '<strong class="note-you">Onterecht aangeklikt.</strong> ' +
        esc(r === 1 ? "Mag wel via de gewone mail. " + it.why1 : (it.r1 ? s.why2ok : "Mocht al via de gewone mail, en mag hier dus ook."));
      return '<li class="' + (ok ? "is-ok" : "is-no") + '"><span class="mk-n" aria-hidden="true">' + marks[k] + "</span>" +
        '<p class="note-text"><span class="vcsw-sr-only">Toelichting ' + marks[k] + ", " + esc(it.text) + ". </span>" + txt + "</p></li>";
    }
    var wrong = order.filter(function (k) { return !judged(k); }), right = order.filter(judged);
    var notes = (wrong.length ? '<ol class="notes">' + wrong.map(note).join("") + "</ol>" : "") +
      (right.length ? '<details class="notes-ok"><summary>' + icon("check", "sm") + "<span>" + right.length + " goed beoordeeld</span>" +
        '<span class="sum-more"><span class="when-closed">Toon uitleg</span><span class="when-open">Verberg</span></span></summary>' +
        '<ol class="notes">' + right.map(note).join("") + "</ol></details>" : "");

    var after;
    if (r === 1) {
      after = '<div class="actions">' + btn("Verstuur via Kluispost", "mail2", "", "arrowR") + "</div>";
    } else {
      var lines = g === "good"
        ? [["gem", "<strong>Datakristal: " + esc(s.crystal.name) + ".</strong> " + esc(s.crystal.text)], ["eye", "<strong>Onthoud voor de luchtsluis.</strong> " + esc(s.clue)]]
        : [["info", "<strong>Geen kristal deze keer.</strong> Zonder kristal kost een aanwijzing in de luchtsluis " + CLUE_COST + " procent schild."]];
      after = speech(s.react[g].who, s.react[g].say, "slim") + afterList(lines) +
        '<div class="actions">' + btn("Volgende situatie", "nextsit", "", "arrowR") + "</div>";
    }

    show(
      fbHead(s.title, ["Situatie " + (S.sit + 1) + " van " + SITUATIONS.length, r === 1 ? "Stap 1 van 2, gewone mail" : "Stap 2 van 2, Kluispost"]) + verdict +
      '<div class="mail-review fit-review">' + mailbox +
      '<section class="mail-notes" aria-labelledby="notes-h"><div class="notes-top"><h3 id="notes-h">Toelichting</h3>' +
      '<p class="notes-key"><span class="key-sw is-ok" aria-hidden="true"></span>Goed<span class="key-sw is-no" aria-hidden="true"></span>Niet goed</p></div>' +
      '<div class="notes-scroll review-scroll" aria-labelledby="notes-h">' + notes + "</div>" +
      '<div class="notes-foot">' + after + "</div></section></div>",
      ".verdict-title"
    );
    fitReview();
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
    S.screen = "sit"; S.step = 1;
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
      return '<li><button type="button" class="' + cls + '" data-opt="' + oi + '" aria-pressed="' + (S.chosen === oi) + '"' + (S.chosen !== null ? " disabled" : "") + ">" +
        '<span class="letter" aria-hidden="true">' + letters[k] + "</span><span>" + esc(o.text) + "</span>" + verdict + "</button></li>";
    }).join("");

    var fb = "", done = S.chosen !== null;
    if (done) {
      var o = s.options[S.chosen], good = o.grade === "good";
      var lines = good
        ? (s.crystal ? [["gem", "<strong>Datakristal: " + esc(s.crystal.name) + ".</strong> " + esc(s.crystal.text)]] : []).concat([["eye", "<strong>Onthoud voor de luchtsluis.</strong> " + esc(s.clue)]])
        : s.crystal ? [["info", "<strong>Geen kristal deze keer.</strong> Zonder kristal kost een aanwijzing in de luchtsluis " + CLUE_COST + " procent schild."]] : [];
      fb = verdictLine(o.grade, good ? "check" : o.grade === "half" ? "half" : "x", good ? "Goed" : o.grade === "half" ? "Half goed" : "Fout",
          good ? "+10 punten" : o.grade === "half" ? "+5 punten, schild −5%" : "0 punten, schild −10%", o.why) +
        '<div class="fb-react">' + speech(o.react.who, o.react.say, "slim") + (lines.length ? afterList(lines) : "") + "</div>";
      var last = S.sit === SITUATIONS.length - 1;
      fb += '<div class="actions">' + btn(last ? "Naar de luchtsluis" : "Volgende situatie", last ? "prelock" : "nextsit", "", "arrowR") + "</div>";
    }

    show(
      (done ? fbHead(s.title, ["Situatie " + (S.sit + 1) + " van " + SITUATIONS.length])
            : chips(["Situatie " + (S.sit + 1) + " van " + SITUATIONS.length]) + "<h2>" + esc(s.title) + "</h2>") +
      '<p class="sit-intro">' + esc(s.intro) + "</p>" +
      speech(s.speaker, s.line, done ? "slim" : "") +
      '<p class="vcsw-sr-only">Kies een van de drie opties.</p>' +
      '<ul class="options' + (done ? " answered" : "") + '">' + opts + "</ul>" + fb,
      done ? ".verdict-title" : "h2"
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
  }

  /* Start card of the airlock: the goal in one sentence, how you score, what a mistake costs, one start button */
  function renderPreLock() {
    S.screen = "prelock"; S.step = 2;
    var n = S.crystals.length;
    var tips = SITUATIONS.map(function (s, i) {
      return S.clues[i]
        ? '<li class="got">' + icon("eye", "sm") + "<span>" + esc(s.clue) + "</span></li>"
        : '<li class="missed">' + icon("lock", "sm") + "<span>Gemist bij “" + esc(s.title) + "”.</span></li>";
    }).join("");
    show(
      '<div class="prelock"><div class="head">' +
      chips(["Luchtsluis", icon("timer") + "5 minuten", icon("gem") + plural(n, "kristal", "kristallen") + " uit dit level"]) +
      "<h2>De berichtenstroom</h2>" +
      '<p class="lead">Beslis bij tien binnenkomende berichten of ze echt zijn of een aanval van de Zwarte Nevel.</p></div>' +
      '<div class="two">' +
      '<section class="acard"><h3>Zo scoor je</h3>' + ilist([
        ["tick", "Elk goed beoordeeld bericht levert 10 punten op", "good"],
        ["unlock", "Alleen de echte berichten bevatten een stukje van de sluiscode", "good"],
        ["swap", "Schuif een bericht naar links als het een aanval is, of naar rechts als het echt is. De knoppen en de pijltjestoetsen werken ook"],
        ["timer", "Je hebt vijf minuten. De klok staat stil terwijl je de uitleg na een bericht leest, en je kunt hem pauzeren"]
      ]) + "</section>" +
      '<section class="acard"><h3>Wat een fout kost</h3>' + ilist([
        ["cross", "Een aanval voor echt aanzien kost 10 procent schild", "bad"],
        ["cross", "Een echt bericht voor een aanval aanzien kost 5 procent schild en een stukje van de sluiscode", "bad"],
        ["gem", "Elk kristal uit dit level is één aanwijzing van ARIA zonder kosten. Jij hebt er " + (n ? n : "geen"), "gold"],
        ["shield", "Daarna kost een aanwijzing " + CLUE_COST + " procent schild", "bad"]
      ]) + "</section></div>" +
      '<section class="acard tips"><h3>Hier let je op</h3><ul class="clues">' + tips + "</ul></section>" +
      '<div class="actions">' + btn("Open de berichtenstroom", "lock", "", "arrowR") + "</div></div>"
    );
  }

  function startLock() {
    S.msgs = shuffle(MESSAGES);
    S.msgIdx = 0; S.msgResults = []; S.answered = false; S.clueShown = false; S.asked = 0;
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
    S.screen = "lock"; S.step = 2;
    var m = S.msgs[S.msgIdx];
    var res = S.msgResults[S.msgIdx];
    var head =
      '<div class="msg-head">' +
      '<div class="row"><span class="k">Van</span><span class="v">' + esc(m.from) + " &lt;" + esc(m.addr) + "&gt;</span></div>" +
      '<div class="row"><span class="k">Kanaal</span><span class="v">' + esc(m.channel) + "</span></div></div>";
    var body = '<p class="msg-subject">' + esc(m.subject) + '</p><p class="msg-body">' + esc(m.body) + "</p>" +
      (m.link ? '<p class="msg-body mt"><span class="msg-link">' + esc(m.link) + "</span></p>" : "") +
      (m.attach ? '<span class="msg-attach">' + icon("file", "sm") + esc(m.attach) + "</span>" : "");

    /* Clues, proposal B: one button. ARIA gives the clue for this message as a speech balloon.
       One price: every crystal earned in this level is one clue without cost, after that a clue costs CLUE_COST percent shield. */
    var nGem = S.crystals.length, used = Math.min(S.asked, nGem), free = S.asked < nGem, gems = "";
    for (var gi = 0; gi < nGem; gi++) gems += '<span class="gem ' + (gi < used ? "used" : "left") + '">' + icon("gem") + "</span>";
    var cost = S.clueShown
      ? '<span class="chip cost">' + icon("tick") + "Dit is de aanwijzing bij dit bericht</span>"
      : free ? '<span class="chip cost free">' + icon("gem") + "De volgende kost niets</span>"
             : '<span class="chip cost paid">' + icon("shield") + "De volgende kost " + CLUE_COST + " procent schild</span>";
    var ask =
      '<section class="ask" aria-labelledby="ask-h"><div class="ask-card"><div class="ask-text">' +
      '<div class="ask-head"><h3 id="ask-h">Aanwijzingen van ARIA</h3><span class="gems">' + gems +
      '<span class="gems-txt">' + (nGem ? used + " van " + nGem + " gebruikt" : "Geen kristallen") + "</span></span></div>" +
      "<p>" + (nGem
        ? "Je verdiende " + plural(nGem, "kristal", "kristallen") + " in dit level. Elk kristal is één aanwijzing zonder kosten. Daarna kost een aanwijzing " + CLUE_COST + " procent schild."
        : "Je verdiende geen kristallen in dit level. Een aanwijzing kost " + CLUE_COST + " procent schild.") + "</p></div>" +
      '<div class="ask-act"><button type="button" class="vcsw-button outline" data-action="clue"' + (S.clueShown ? " disabled" : "") + ">Vraag ARIA om een aanwijzing" + icon("bulb") + "</button>" + cost + "</div></div>" +
      '<div class="ask-list" aria-live="polite">' + (S.clueShown
        ? '<div class="clue" tabindex="-1">' + ARIA_AVATAR + '<div><p class="clue-who"><strong>ARIA</strong> <span>boordcomputer</span></p><p class="clue-txt">' + esc(m.hint) + "</p></div></div>"
        : "") + "</div></section>";
    var controls, fb = "";
    if (!S.answered) {
      controls =
        '<div class="swipe-actions">' +
        '<button type="button" class="vcsw-button destructive" data-action="attack">' + icon("arrowL") + "Aanval</button>" +
        '<button type="button" class="vcsw-button" data-action="real">Echt' + icon("arrowR") + "</button></div>" +
        '<p class="swipe-help">Schuif de kaart, gebruik de knoppen of druk op pijltje links of rechts.</p>' + ask;
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
      "<h2>De berichtenstroom</h2>" +
      '<div class="lock-top"><span class="timer' + (S.timeLeft <= 60 ? " low" : "") + '" id="timer" role="timer" aria-label="Resterende tijd">' + icon("timer") + "<span>" + fmt(S.timeLeft) + "</span></span>" +
      '<span class="count">Bericht ' + (S.msgIdx + 1) + " van " + S.msgs.length + "</span>" +
      btn(S.paused ? "Hervat" : "Pauzeer", "pause", "outline sm", "", ' aria-pressed="' + S.paused + '"') + "</div>" +
      (S.paused
        ? alertBox("info", "Gepauzeerd", "De klok staat stil. Kies Hervat om verder te gaan.")
        : '<div class="deck"><article class="msg" id="msgcard" aria-label="Binnenkomend bericht ' + (S.msgIdx + 1) + '">' +
          /* The swipe stamps sit on the top edge of the card, outside the text. After a choice there is nothing to swipe, so no stamps. */
          (S.answered ? "" : '<span class="stamp left" aria-hidden="true">Aanval</span><span class="stamp right" aria-hidden="true">Echt</span>') +
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

  function askClue() {
    if (S.answered || S.paused || S.clueShown) return;
    if (S.asked >= S.crystals.length) hurt(CLUE_COST);
    S.asked++;
    S.clueShown = true;
    renderLock();
    var r = stage.querySelector(".ask-list .clue");
    if (r) { r.focus({ preventScroll: true }); r.scrollIntoView({ block: "nearest" }); }
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
      ? "<h3>Ontbrekende delen terughalen</h3><p>Bekijk het echte bericht opnieuw om het cijfer terug te halen. Dat kost " + RECOVER_COST + "% schildsterkte per deel.</p>" +
        '<div class="actions" style="margin-top:8px">' + missing.map(function (c) {
          return btn("Deel " + c.part + " terughalen", "recover", "outline", "", ' data-id="' + c.id + '"');
        }).join("") + "</div>"
      : "";
    show(
      "<h2>Het codepaneel</h2>" +
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
    /* Each situation: the title with the verdict, then the explanation. Half goed: say what the half answer missed, before the full answer. */
    function sitText(s, g) {
      var good = s.type === "mail" ? { text: s.goodText, why: s.goodWhy } : s.options.filter(function (o) { return o.grade === "good"; })[0];
      var half = s.type === "mail" ? null : s.options.filter(function (o) { return o.grade === "half"; })[0];
      var missed = g !== "half" ? "" : s.type === "mail"
        ? "Je zag een of twee gegevens over het hoofd. "
        : esc(half.why) + " ";
      return missed + (g === "good" ? "" : "Beter was: " + esc(good.text) + " ") + esc(good.why);
    }
    function sitHead(s, g) {
      var ic = g === "good" ? icon("check", "ok") : g === "half" ? icon("half", "mid") : icon("x", "no");
      var lbl = g === "good" ? "Goed" : g === "half" ? "Half goed" : "Fout";
      return ic + "<span><strong>" + esc(s.title) + "</strong> (" + lbl + ")</span>";
    }
    var more = '<span class="sum-more"><span class="when-closed">Toon uitleg</span><span class="when-open">Verberg</span></span>';
    /* What did not go well stays open (as far as the panel allows), what went well folds away behind one line, as in the mail review */
    var notGood = [], goodIdx = [];
    SITUATIONS.forEach(function (s, i) { if (S.sitResults[i] === "good") goodIdx.push(i); else notGood.push(i); });
    var sitLines = notGood.map(function (i) {
      var s = SITUATIONS[i], g = S.sitResults[i];
      return '<li><details class="sit-fb" open><summary>' + sitHead(s, g) + more + '</summary><p class="sit-why">' + sitText(s, g) + "</p></details></li>";
    }).join("");
    if (goodIdx.length) {
      var names = goodIdx.map(function (i) { return esc(SITUATIONS[i].title); });
      var list = names.length > 1 ? names.slice(0, -1).join(", ") + " en " + names[names.length - 1] : names[0];
      sitLines += '<li><details class="sit-ok"><summary>' + icon("check", "ok") + "<span><strong>" + plural(goodIdx.length, "situatie", "situaties") + " goed.</strong> " + list + "</span>" + more + "</summary>" +
        '<ul class="sit-ok-list">' + goodIdx.map(function (i) { var s = SITUATIONS[i]; return "<li><strong>" + esc(s.title) + ".</strong> " + sitText(s, "good") + "</li>"; }).join("") + "</ul></details></li>";
    }
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
      '<div class="debrief">' +
      "<h2>" + (passed ? "Level gehaald. Je bent nu Kapitein" : "Nog niet gehaald") + "</h2>" +
      speech("ARIA", summary, "slim") +
      chips(["Score " + pct + "%, " + S.score + " van " + MAX_SCORE + " punten, 70% nodig", icon("shield") + "Schildsterkte " + S.shield + "%", okMsgs + " van " + MESSAGES.length + " berichten goed beoordeeld"]) +
      "<h3>Je dienst</h3><ul class=\"result-list sit-list\">" + sitLines + "</ul>" +
      '<div class="two debrief-two"><div><h3>Datakristallen</h3>' + crystals + '<div class="carry">' + carry + "</div></div>" +
      "<div><h3>Drie kernregels</h3><ol class=\"rules\">" + RULES.map(function (r) { return "<li><span>" + esc(r) + "</span></li>"; }).join("") + "</ol></div></div>" +
      '<div class="actions">' + btn("Terug op aarde", "earth", "", "arrowR") + "</div></div>"
    );
    fitDebrief();
  }

  /* The debriefing gets the same fixed budget as the mail review: explanations that do not fit fold, from the last one up,
     so the button stays in view. The budget comes from the constant, never from the height of the frame. */
  function fitDebrief() {
    if (!document.documentElement.classList.contains("in-orion")) return;
    var open = [].slice.call(stage.querySelectorAll(".sit-fb[open]")), act = stage.querySelector(".debrief > .actions");
    function bottom() { return act.getBoundingClientRect().bottom + window.pageYOffset + 14; }
    while (open.length && bottom() > PANEL_H) open.pop().removeAttribute("open");
    fitSitList();
  }
  /* When the player opens an explanation that does not fit even on its own, only the list scrolls, as in the mail review */
  function fitSitList() {
    var list = stage.querySelector(".sit-list"), act = stage.querySelector(".debrief > .actions");
    if (!list || !act || !document.documentElement.classList.contains("in-orion")) return;
    list.style.maxHeight = "";
    var extra = act.getBoundingClientRect().bottom + window.pageYOffset + 14 - PANEL_H, over = false;
    if (extra > 0) { list.style.maxHeight = Math.max(140, list.getBoundingClientRect().height - extra) + "px"; over = list.scrollHeight > list.clientHeight + 2; }
    list.classList.toggle("is-over", over);
    if (over) { list.setAttribute("tabindex", "0"); list.setAttribute("role", "region"); list.setAttribute("aria-label", "Je dienst"); }
    else { list.removeAttribute("tabindex"); list.removeAttribute("role"); list.removeAttribute("aria-label"); }
    var atEnd = function () { list.classList.toggle("at-end", list.scrollTop + list.clientHeight >= list.scrollHeight - 4); };
    if (!list.dataset.watch) { list.dataset.watch = "1"; list.addEventListener("scroll", atEnd, { passive: true }); }
    atEnd();
  }

  /* Terug op aarde, in two steps so each fits the panel: first the two lists, then the report route and the result */
  function meter(label, value, fill, cls, note, mark, aria) {
    return '<div class="meter"><p class="m-label">' + label + '</p><p class="m-value">' + value + "</p>" +
      '<div class="m-bar ' + cls + '" role="img" aria-label="' + aria + '"><span class="m-fill" style="width:' + fill + '%"></span>' +
      (mark ? '<span class="m-mark" style="left:' + mark + '%"></span>' : "") + "</div>" +
      '<p class="m-note">' + note + "</p></div>";
  }
  function topic(ic, title, text) {
    return '<li><span class="ic">' + icon(ic) + "</span><span><strong>" + title + "</strong>" + text + "</span></li>";
  }
  function renderEarth() {
    S.screen = "earth"; S.step = 4;
    var pct = Math.round((S.score / MAX_SCORE) * 100);
    var passed = S.score / MAX_SCORE >= PASS;
    var n = S.crystals.length, sh = Math.max(0, S.shield);
    if (S.earthStep !== 2) {
      show(
        '<div class="aarde"><div class="head">' + chips(["Stap 1 van 2"]) +
        "<h2>Wat betekent dit voor je werk bij VCSW?</h2>" +
        '<p class="lead">Het station is verzonnen. Dit neem je mee naar je werk.</p></div>' +
        '<div class="two">' +
        '<section class="acard"><h3>Ontvangen en gebruiken</h3><ul class="ilist topics">' +
        topic("inbox", "Veilig ontvangen", "Denk aan de Excel met BSN’s die een klant mailt voor een Whk-controle. Sla zo’n bestand op in de beveiligde omgeving, verwijder de mail en wijs de klant vriendelijk op de beveiligde weg voor de volgende keer.") +
        topic("filter", "Niet meer opvragen dan nodig", "Bij een Besparingscheck vraag je niet meer op dan nodig is voor de check. Gegevens van de ene klant zijn nooit voorbeeldmateriaal voor een andere.") +
        topic("bot", "Goedgekeurde AI", "Goedgekeurde AI binnen VCSW is Claude en Libra. Daar mogen geen persoonsgegevens in, behalve zakelijke gegevens en geanonimiseerde of gepseudonimiseerde gegevens. Alleen namen weghalen maakt een bestand nog niet anoniem.") +
        "</ul></section>" +
        '<section class="acard"><h3>Versturen en controleren</h3><ul class="ilist topics">' +
        topic("mail", "Veilig mailen", "BSN’s, verzuimgegevens, gezondheidsgegevens en andere gevoelige gegevens verstuur je nooit via een gewone mail. Via Zivver of aangetekend mailen mag het wel. Let ook dan op wat je meestuurt, ook in bijlagen. Stuur alleen wat de ontvanger echt nodig heeft, en laat zaken als een rekeningnummer of privéomstandigheden weg als die niet nodig zijn. Medische informatie, zoals een diagnose, is alleen voor de bedrijfsarts en stuur je ook via Zivver niet naar een werkgever.") +
        topic("warn", "Valse berichten", "Afwijkende afzender, spoed of geheimhouding? Stop en controleer via een andere weg, bijvoorbeeld door de afzender te bellen op een nummer dat je al kent.") +
        "</ul></section></div>" +
        '<div class="actions">' + btn("Naar de meldroute en je resultaat", "earth2", "", "arrowR") + "</div></div>"
      );
      return;
    }
    show(
      '<div class="aarde"><div class="head">' + chips(["Stap 2 van 2"]) +
      "<h2>Melden en je resultaat</h2></div>" +
      '<section class="acard meld"><div class="meld-text"><h3>Meldroute</h3><p>Twijfel of een incident? Meld het direct bij de security officer, de privacy officer of via het meldpunt.</p></div>' +
      '<div class="meld-act"><code id="mailaddr">jz@vcsw.nl</code>' +
      '<button type="button" class="vcsw-button outline" data-action="copy">Kopieer adres' + icon("copy") + "</button></div>" +
      '<p class="vcsw-sr-only" id="copy-status" aria-live="polite"></p></section>' +
      '<section class="acard result"><div class="result-head"><h3>Resultaat level 4</h3>' +
      '<span class="verdict-badge ' + (passed ? "ok" : "warn") + '">' + icon(passed ? "tick" : "half") + (passed ? "Gehaald" : "Nog niet gehaald") + "</span></div>" +
      '<p class="result-line">' + (passed ? "Je bent nu Kapitein van de Datawacht." : "Je haalt het level met minimaal 70 procent van de punten.") + "</p>" +
      '<div class="meters">' +
      meter("Score", S.score + " van " + MAX_SCORE + " punten", pct, "score", pct + " procent. " + (passed ? "Je had 70 procent nodig." : "Je hebt 70 procent nodig."), 70, "Score " + pct + " procent, de grens ligt bij 70 procent") +
      meter("Schild", sh + " procent", sh, "shield", "Het schild telt niet mee voor halen. Het laat zien hoe zeker je speelde.", 0, "Schild " + sh + " procent") +
      meter("Kristallen", n + " van " + CRYSTALS_MAX, Math.round((n / CRYSTALS_MAX) * 100), "crystals", "Elk kristal is één aanwijzing zonder kosten in de luchtsluis.", 0, n + " van " + CRYSTALS_MAX + " kristallen") +
      "</div>" +
      '<div class="actions">' + btn("Speel level 4 opnieuw", "restart", "", "refresh") + "</div></section></div>"
    );
  }

  function copyAddress(btnEl) {
    var st = document.getElementById("copy-status");
    function selectIt() {
      var r = document.createRange(); r.selectNodeContents(document.getElementById("mailaddr"));
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      btnEl.textContent = "Geselecteerd, kopieer met Ctrl+C";
      if (st) st.textContent = "Het adres is geselecteerd. Kopieer het met Ctrl+C.";
    }
    try {
      navigator.clipboard.writeText("jz@vcsw.nl").then(function () {
        btnEl.innerHTML = "Gekopieerd" + icon("tick");
        if (st) st.textContent = "Het adres jz@vcsw.nl is gekopieerd.";
      }, selectIt);
    } catch (e) { selectIt(); }
  }

  /* ---------- Test jump: ?scherm=<naam> opens the level on one screen, with a plausible state ---------- */
  var SCHERMEN = ["start", "briefing", "dienst", "mail", "dienst5", "luchtsluis", "berichten", "code", "debriefing", "aarde", "uitslag", "uitslag-gehaald"];
  function jump(name) {
    if (SCHERMEN.indexOf(name) < 0) return false;
    stopTimer(); reset();
    function grade(i, g) {   // the same bookkeeping as choose() and checkMail()
      var s = SITUATIONS[i];
      S.score += POINTS[g]; hurt(SHIELD_COST[g]); S.sitResults[i] = g;
      if (g === "good") { if (s.crystal) S.crystals.push(s.crystal.name); S.clues[i] = true; }
    }
    function dienst(k, all) {   // answers the first k situations; mixed result unless all is true
      var mixed = ["half", "good", "good", "bad", "good"];
      for (var i = 0; i < k; i++) grade(i, all ? "good" : mixed[i]);
    }
    function stream(all) {   // judges the ten messages, in the fixed order of MESSAGES
      S.msgs = MESSAGES.slice(); S.code = []; S.msgResults = [];
      var k = 0;
      S.msgs.forEach(function (m) { if (m.real) { k++; S.code.push({ id: m.id, part: k, digit: (k * 3) % 10, got: false }); } });
      S.msgs.forEach(function (m, i) {
        var ok = all || (i !== 1 && i !== 2 && i !== 5 && i !== 7);
        S.msgResults[i] = ok ? "ok" : "no";
        if (ok) { S.score += 10; if (m.real) codeFor(m.id).got = true; }
        else if (!m.real) { S.clickedAttack = true; hurt(10); } else hurt(5);
      });
      S.msgIdx = S.msgs.length - 1; S.answered = true; S.timeLeft = 96;
    }
    if (name === "start") renderStart();
    else if (name === "briefing") renderBriefing();
    else if (name === "dienst") { S.sit = 0; startSit(); }
    else if (name === "mail") { dienst(1); S.sit = 1; startSit(); }
    else if (name === "dienst5") { dienst(4); S.sit = 4; startSit(); }
    else if (name === "luchtsluis") { dienst(5); renderPreLock(); }
    else if (name === "berichten") { dienst(5); startLock(); }
    else if (name === "code") { dienst(5); stream(false); renderCode(); }
    else if (name === "debriefing") { dienst(5); stream(false); renderDebrief(true); }
    else if (name === "aarde") { dienst(5); stream(false); S.earthStep = 1; renderEarth(); }
    else if (name === "uitslag") { dienst(5); stream(false); S.earthStep = 2; renderEarth(); }
    else if (name === "uitslag-gehaald") { dienst(5, true); stream(true); S.earthStep = 2; renderEarth(); }
    return true;
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
    else if (a === "clue") askClue();
    else if (a === "nextmsg") { S.msgIdx++; S.answered = false; S.clueShown = false; renderLock(); }
    else if (a === "pause") { S.paused = !S.paused; renderLock(); var p = stage.querySelector('[data-action="pause"]'); if (p) p.focus(); }
    else if (a === "code") renderCode();
    else if (a === "recover") { hurt(RECOVER_COST); S.recovered[b.getAttribute("data-id")] = true; renderCode(); }
    else if (a === "earth") { S.earthStep = 1; renderEarth(); }
    else if (a === "earth2") { S.earthStep = 2; renderEarth(); }
    else if (a === "copy") copyAddress(b);
    else if (a === "restart") { stopTimer(); reset(); document.getElementById("hud-rank").textContent = "Commandeur"; renderStart(); }
  });
  stage.addEventListener("keydown", function (e) {
    var tk = e.target.closest && e.target.closest("[data-tok]");
    if (tk && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); tk.click(); }
  });
  /* Opening the folded notes can make the list overflow: then it becomes a scroll region that the keyboard can reach */
  stage.addEventListener("toggle", function (e) {
    fitReview();
    /* Debriefing: opening one explanation folds the others again when the panel would otherwise scroll */
    var d = e.target;
    if (d.open && d.closest && d.closest(".debrief") && document.documentElement.classList.contains("in-orion")) {
      var act = stage.querySelector(".debrief > .actions");
      var others = [].slice.call(stage.querySelectorAll(".sit-fb[open], .sit-ok[open]")).filter(function (x) { return x !== d; });
      var list = stage.querySelector(".sit-list"); if (list) list.style.maxHeight = "";
      while (others.length && act.getBoundingClientRect().bottom + window.pageYOffset + 14 > PANEL_H) others.pop().removeAttribute("open");
    }
    if (d.closest && d.closest(".debrief")) fitSitList();
  }, true);
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
  var want = null;
  try { want = new URLSearchParams(location.search).get("scherm"); } catch (e) { want = null; }
  if (!want || !jump(want)) renderStart();
})();
