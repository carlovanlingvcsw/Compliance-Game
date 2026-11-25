/* Level 2: De passagiersmodule. Game logic and content of this level. */
(function () {
  "use strict";

  /* ---------- Icons (Lucide, outline) ---------- */
  var I = {
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    ok: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    bad: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    next: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    gem: '<path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
  };
  function icon(name, cls) { return '<svg class="vcsw-icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + I[name] + "</svg>"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Personages ---------- */
  var WHO = {
    aria: { name: "ARIA", role: "boordcomputer", av: "A", cls: "av-aria" },
    mira: { name: "Luitenant Mira", role: "crewadministratie", av: "M", cls: "av-mira" },
    bram: { name: "Bram", role: "monteur", av: "B", cls: "av-bram" },
    vega: { name: "Kapitein Vega", role: "kolonie Nova Terra", av: "V", cls: "av-vega" },
    kand: { name: "Orin Vale", role: "oud-crewlid, als hologram", av: "O", cls: "av-kand" }
  };
  function speech(who, text) {
    var w = WHO[who];
    return '<div class="speech"><span class="vcsw-avatar ' + w.cls + '" aria-hidden="true">' + w.av + '</span><div><div class="speech-who">' + w.name + ' <span class="speech-role">' + w.role + '</span></div><p class="speech-text">' + esc(text) + "</p></div></div>";
  }

  /* ---------- Inhoud level 2 ---------- */
  var SITS = [
    {
      title: "Het nieuwe crewlid", who: "mira",
      intro: "Sanne Vrij begint maandag als crewlid van Orion.",
      say: "Ik heb Sannes BSN, haar adres en een kopie van haar paspoort. Bram stelt voor om haar BSN ook als inlogcode voor het stationssysteem te gebruiken. Ze vindt het zelf prima.",
      opts: [
        { k: "A", t: "“Handig, dan gebruiken we haar BSN als inlogcode. Dan hoeft ze niets nieuws te onthouden, en ze vindt het zelf ook prima. We zetten het meteen zo in het systeem.”", r: "fout",
          uitleg: "Het BSN gebruik je alleen waar de wet dat voorschrijft. Een inlogcode hoort daar niet bij, ook niet als Sanne het goed vindt.",
          reactie: "Ingesteld. Wie over haar schouder meekijkt, ziet nu haar BSN.",
          memo: "BSN van Sanne als inlogcode in het stationssysteem" },
        { k: "B", t: "“Het BSN en de paspoortkopie gaan alleen in de loonadministratie, omdat de wet dat eist. Voor het systeem krijgt ze een eigen inlogcode.”", r: "goed",
          uitleg: "De wet verplicht het station om een nieuw crewlid te identificeren en het BSN te gebruiken voor de loonaangifte. Daarbuiten gebruik je het BSN niet.",
          reactie: "Dan maak ik een gewone inlogcode aan en bewaar ik de kopie beveiligd in de loonadministratie." },
        { k: "C", t: "“Haar BSN en paspoortkopie leggen we helemaal niet vast. Dat is te gevoelig, ook voor de loonadministratie.”", r: "half",
          uitleg: "Voorzichtig, maar de wet verplicht het station juist om ze vast te leggen in de loonadministratie.",
          reactie: "Dan kan de loonadministratie haar niet aanmelden. Krijgt ze dan wel betaald?" }
      ],
      crystal: { on: "B", name: "BSN-regel", desc: "Het BSN alleen waar de wet het voorschrijft. Toestemming verandert dat niet." }
    },
    {
      title: "De ziekmelding", who: "mira",
      intro: "Crewlid Kai Lindqvist belt zich ziek.",
      say: "Zijn teamleider wil weten wat Kai heeft, zodat het in het rooster kan. En Bram zegt dat we Kai gewoon om toestemming kunnen vragen om alles vast te leggen.",
      opts: [
        { k: "A", t: "De diagnose in het rooster zetten, zodat het hele team weet waarom Kai er niet is en rekening met hem kan houden als hij terugkomt.", r: "fout",
          uitleg: "De diagnose is medische informatie. Die legt het station niet vast en deelt het zeker niet met het team.",
          reactie: "Gedaan. Het hele team ziet nu wat hij heeft.",
          memo: "Diagnose van Kai in het rooster" },
        { k: "B", t: "Alleen vastleggen wat nodig is voor zijn loon en begeleiding: bereikbaarheid, verpleegadres, verwachte duur en lopende taken. Het team hoort alleen dat hij er niet is en wie zijn taken overneemt.", r: "goed",
          uitleg: "De wet verplicht het station om loon door te betalen en een ziek crewlid te begeleiden. Daarom mag het de gegevens verwerken die daarvoor nodig zijn. Meer niet.",
          reactie: "Dan noteer ik zijn verpleegadres en de verwachte duur. De rest is voor de scheepsarts." },
        { k: "C", t: "Kai om toestemming vragen om zijn diagnose vast te leggen. Als hij ja zegt, mag alles in het dossier en kan de teamleider het inzien.", r: "fout",
          uitleg: "Een crewlid zegt moeilijk nee tegen zijn werkgever, dus die toestemming is niet vrij. En de diagnose legt het station ook mét toestemming niet vast.",
          reactie: "Hij zei ja, maar hij klonk niet alsof hij durfde te weigeren." }
      ],
      crystal: { on: "B", name: "Wettelijke plicht", desc: "Bij ziekte alleen wat nodig is voor loon en begeleiding. De diagnose blijft bij de scheepsarts." }
    },
    {
      title: "Bloemen voor Kai", who: "bram",
      say: "Kai is al twee weken ziek. Geef me even zijn adres uit de administratie, dan stuur ik namens het team bloemen. Ik zet het meteen op de verjaardagslijst.",
      opts: [
        { k: "A", t: "Het adres uit de administratie doorgeven. Het is goed bedoeld en het blijft binnen het eigen team. Bloemen sturen is geen verwerking waar regels voor gelden.", r: "fout",
          uitleg: "Het adres staat in de administratie voor het loon en de verzuimbegeleiding. Doorgeven aan een collega is een ander doel.",
          reactie: "Top. Dan staat het straks ook op de verjaardagslijst, heeft iedereen het.",
          memo: "Adres van Kai doorgegeven aan Bram en op de verjaardagslijst" },
        { k: "B", t: "Kai zelf laten weten of hij bloemen of bezoek wil, en waar dat heen kan. Het adres uit de administratie geef je niet door.", r: "goed",
          uitleg: "Een gegeven gebruik je alleen voor het doel waarvoor je het kreeg. Kai beslist zelf of hij zijn adres aan het team geeft.",
          reactie: "Goed, ik stuur hem een bericht. Dan kiest hij zelf." },
        { k: "C", t: "Bram zeggen dat adressen delen niet mag vanwege de regels, en er verder niets mee doen.", r: "half",
          uitleg: "Niet doorgeven klopt, maar je kunt Kai ook zelf laten kiezen.",
          reactie: "Jammer. Dan maar geen bloemen." }
      ],
      crystal: { on: "B", name: "Doelbinding", desc: "Een gegeven gebruik je alleen voor het doel waarvoor je het kreeg." }
    },
    {
      title: "Het verzuimoverzicht", who: "vega",
      intro: "Kai wil overstappen naar de kolonie Nova Terra.",
      say: "Stuur me het verzuimoverzicht van Kai. Ik wil weten of hij vaak ziek is voordat hij bij ons begint.",
      opts: [
        { k: "A", t: "Het volledige verzuimoverzicht sturen. Vega wordt zijn leidinggevende en mag dat weten voordat Kai begint.", r: "fout",
          uitleg: "Verzuimgegevens zijn er voor het loon en de begeleiding bij ziekte. Nova Terra heeft er geen grondslag voor.",
          reactie: "Mooi. Dan weet ik genoeg.",
          memo: "Verzuimoverzicht van Kai verstuurd naar Kapitein Vega" },
        { k: "B", t: "Niets van zijn verzuim delen en uitleggen waarom. Over zijn overstap kan Vega met Kai zelf praten.", r: "goed",
          uitleg: "Je gebruikt verzuimgegevens alleen voor waar ze voor zijn, en je deelt niets wat de ontvanger niet mag hebben.",
          reactie: "Hm. Dan vraag ik hem zelf wanneer hij kan beginnen. Prima." },
        { k: "C", t: "Alleen het aantal ziektedagen sturen, zonder de reden. Dan deel je niets medisch.", r: "fout",
          uitleg: "Ook het aantal ziektedagen zegt iets over zijn gezondheid, en Nova Terra heeft er nog steeds geen grondslag voor.",
          reactie: "Twintig dagen? Dan weet ik genoeg.",
          memo: "Verzuimoverzicht van Kai verstuurd naar Kapitein Vega" }
      ],
      crystal: { on: "B", name: "Dataminimalisatie", desc: "Deel alleen wat de ontvanger mag hebben en echt nodig heeft." }
    },
    {
      title: "De holo-oproep", who: "kand",
      intro: "Een oud-crewlid verschijnt als hologram.",
      say: "Ik werk niet meer op Orion. Wat doen jullie nog met mijn BSN, mijn adres en mijn paspoortkopie?",
      opts: [
        { k: "A", t: "“We houden alles wat we van je hebben. Je weet nooit waar het later nog goed voor is, en zo kunnen we je snel weer inschrijven als je terugkomt naar Orion.”", r: "fout",
          uitleg: "Wat geen grondslag meer heeft, moet weg. En hij heeft recht op een duidelijk antwoord.",
          reactie: "Dus mijn paspoortkopie zwerft hier nog jaren rond? Dan dien ik een klacht in." },
        { k: "B", t: "Uitleggen dat de wet het station verplicht de loonadministratie met die gegevens nog een aantal jaren te bewaren, beveiligd en alleen daarvoor. De rest is gewist. Wil hij precies weten wat we hebben, dan zet je dat door als inzageverzoek.", r: "goed",
          uitleg: "Een bewaarplicht uit de wet is ook een grondslag. Je legt dat open uit, en een vraag naar al zijn gegevens loopt via het meldpunt.",
          reactie: "Helder. Dan weet ik waar ik aan toe ben." },
        { k: "C", t: "“Ik wis vandaag nog alles wat we van je hebben, ook uit de loonadministratie. Dat beloof ik je, dan hoef je je nergens meer zorgen over te maken.”", r: "fout",
          uitleg: "Dat kun je niet beloven. De wet verplicht het station de loonadministratie nog te bewaren.",
          reactie: "Fijn. Maar mag jij dat eigenlijk zelf beslissen?" }
      ],
      crystal: { on: "B", name: "Bewaarplicht", desc: "Wat de wet je laat bewaren, houd je. Wat geen grondslag meer heeft, gaat weg." }
    }
  ];

  var VAKKEN = [
    { id: "ovk", label: "Overeenkomst", art: "art. 6 lid 1 sub b AVG", desc: "Nodig om de arbeidsovereenkomst uit te voeren." },
    { id: "wet", label: "Wettelijke plicht", art: "art. 6 lid 1 sub c AVG", desc: "Nodig omdat de wet het station iets verplicht." },
    { id: "bel", label: "Gerechtvaardigd belang", art: "art. 6 lid 1 sub f AVG", desc: "Nodig voor een belang van het station dat zwaarder weegt dan de privacy van de persoon." },
    { id: "toe", label: "Toestemming", art: "art. 6 lid 1 sub a AVG", desc: "De persoon koos er zelf vrij voor en kan dat altijd intrekken." },
    { id: "geen", label: "Geen grondslag", art: "wissen", desc: "Er is geen reden die de wet erkent. Het moet weg." }
  ];
  var DOSSIERS = [
    { id: "C-1182", name: "Sanne Vrij", what: "BSN", ctx: "In de loonadministratie, voor de loonaangifte", ans: "wet", why: "De wet schrijft het BSN voor bij de loonaangifte." },
    { id: "C-1183", name: "Sanne Vrij", what: "Kopie van haar paspoort", ctx: "In de loonadministratie, na controle bij indiensttreding", ans: "wet", why: "De wet verplicht het station een nieuw crewlid te identificeren en de kopie te bewaren." },
    { id: "C-1184", name: "Sanne Vrij", what: "BSN als inlogcode", ctx: "Voor het stationssysteem. Ze gaf er zelf toestemming voor", ans: "geen", trap: true, why: "Strikvraag. Het BSN mag alleen waar de wet het voorschrijft. Toestemming maakt dat niet anders." },
    { id: "C-1175", name: "Kai Lindqvist", what: "Verpleegadres en telefoonnummer", ctx: "Vastgelegd bij zijn ziekmelding", ans: "wet", why: "Nodig om hem te bereiken en te begeleiden tijdens zijn ziekte." },
    { id: "C-1176", name: "Kai Lindqvist", what: "BSN", ctx: "Doorgegeven aan de scheepsarts voor zijn re-integratie", ans: "wet", why: "Voor de re-integratie van dit crewlid mag het BSN naar de scheepsarts." },
    { id: "C-1177", name: "Kai Lindqvist", what: "Zijn diagnose", ctx: "Stond in een chatbericht aan zijn teamleider", ans: "geen", trap: true, why: "Strikvraag. Ook als hij het zelf vertelt, legt het station de diagnose niet vast. Die is voor de scheepsarts." },
    { id: "C-1190", name: "Milan Osei", what: "Rekeningnummer", ctx: "Om zijn loon over te maken", ans: "ovk", why: "Nodig om de afspraken uit zijn arbeidsovereenkomst na te komen." },
    { id: "C-1201", name: "Juno Achterberg", what: "Thuisadres", ctx: "Door een collega op de verjaardagslijst gezet, zonder het Juno te vragen", ans: "geen", why: "Het adres staat in de administratie voor een ander doel. Voor deze lijst is er geen grondslag." },
    { id: "S-0007", name: "Toegangssluis crewverblijven", what: "Camerabeelden van gisteren", ctx: "Voor de beveiliging van de verblijven", ans: "bel", why: "Beveiliging is een belang van het station, zolang de beelden kort bewaard blijven." },
    { id: "K-0417", name: "Lyra Jansen", what: "Cv en aanmelding", ctx: "Afgewezen 8 maanden geleden, wilde zelf in de talentenpool", ans: "toe", why: "Zij koos er zelf voor. Na maximaal een jaar wis je." }
  ];
  var CLUES = [
    { crystal: "BSN-regel", title: "Het BSN", text: "Alleen waar de wet het voorschrijft, zoals de loonaangifte of de re-integratie bij de scheepsarts. Toestemming verandert dat niet." },
    { crystal: "Wettelijke plicht", title: "Bij ziekte", text: "Alleen wat nodig is voor loon en begeleiding, zoals een verpleegadres. De diagnose niet." },
    { crystal: "Doelbinding", title: "Een ander doel", text: "Een adres uit de administratie gebruik je niet voor een lijst van het team." },
    { crystal: "Dataminimalisatie", title: "Alleen het nodige", text: "Wat niemand nodig heeft voor het loon, de begeleiding of het werk, heeft geen grondslag." },
    { crystal: "Bewaarplicht", title: "Bewaren", text: "Wat de wet je laat bewaren, houd je. Een cv in de talentenpool alleen als iemand dat zelf wil." }
  ];
  var RULES = [
    "Gebruik het BSN alleen waar de wet het voorschrijft. Toestemming verandert dat niet.",
    "Bij verzuim leg je alleen vast wat nodig is voor loondoorbetaling en begeleiding. De diagnose niet.",
    "Een adres of ander gegeven gebruik je alleen voor het doel waarvoor je het kreeg."
  ];
  /* Antwoorden staan per poging in een andere volgorde. De letter volgt de plek op het scherm, niet het antwoord. */
  function ordered(id, opts) {
    S.ord = S.ord || {};
    if (!S.ord[id]) { var a = opts.map(function (_, i) { return i; }); for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } S.ord[id] = a; }
    return S.ord[id].map(function (i) { return opts[i]; });
  }
  var POINTS = { goed: 10, half: 5, fout: 0 };
  var SHIELD_HIT = { goed: 0, half: 5, fout: 10 };
  var DOSSIER_POINTS = 5;
  var MAX = SITS.length * 10 + DOSSIERS.length * DOSSIER_POINTS;
  var LOCK_SECONDS = 300;
  var CRYSTALS_MAX = SITS.filter(function (s) { return s.crystal; }).length;
  var CLUE_COST = 10;

  /* Vorm bij de vijf gronden: teken en uitleg in één regel voor de keuzelijst. De volledige uitleg staat op de startkaart. */
  var GROND = {
    ovk: { ic: "file", kort: "Nodig om de overeenkomst uit te voeren." },
    wet: { ic: "scale", kort: "De wet verplicht het station hiertoe." },
    bel: { ic: "shield", kort: "Een belang van het station weegt zwaarder." },
    toe: { ic: "hand", kort: "Zelf en vrij gekozen, altijd in te trekken." },
    geen: { ic: "trash", kort: "Geen reden die de wet erkent. Het moet weg." }
  };
  var GOAL = "In het archief liggen tien gegevens van crewleden. Bij elk gegeven beslis je of het station het mag hebben, en op welke grond. Is er geen grond, dan wis je het.";

  /* Terug op aarde: de bestaande tekst, in twee lijsten */
  var EARTH = [
    { title: "BSN, identiteitsbewijs en adres", items: [
      ["Het BSN", "Buiten de overheid gebruik je het BSN alleen als een wet dat bepaalt. Voor een werkgever is dat de loonaangifte bij de Belastingdienst, en het doorgeven aan de arbodienst of bedrijfsarts voor de re-integratie van die werknemer. Niet als inlogcode of op een toegangspas, ook niet met toestemming."],
      ["Het identiteitsbewijs", "De werkgever controleert bij indiensttreding de identiteit en bewaart een kopie in de loonadministratie, tot vijf jaar na het jaar van uitdiensttreding. Beveiligd en alleen toegankelijk voor wie het nodig heeft."],
      ["Adressen", "Een adres is nodig voor de administratie, en bij een ziekmelding mag de werkgever een (verpleeg)adres vastleggen. Gebruik het niet voor een ander doel, zoals een lijst voor collega’s."]
    ], note: "Toestemming is in een werkrelatie zelden de juiste grondslag. Een werknemer kan moeilijk vrij nee zeggen tegen wie over zijn werk beslist." },
    { title: "Waarom mag een werkgever gezondheidsgegevens verwerken?", items: [
      ["Het verbod, art. 9 lid 1 AVG", "Gezondheidsgegevens zijn bijzondere persoonsgegevens. Verwerken is in beginsel verboden."],
      ["De uitzondering, art. 9 lid 2 sub b AVG", "Het verbod geldt niet als de verwerking nodig is om plichten uit het arbeidsrecht en het socialezekerheidsrecht na te komen, voor zover de nationale wet dat met waarborgen toestaat. In Nederland regelt art. 30 lid 1 UAVG dat. Werkgevers mogen gezondheidsgegevens verwerken voor zover dat nodig is voor wettelijke regels waarbij aanspraken van de gezondheid afhangen, en voor de re-integratie en begeleiding van zieke werknemers."],
      ["De grondslag, art. 6 lid 1 sub c AVG", "Naast de uitzondering is altijd een grondslag nodig. Dat is hier de wettelijke verplichting van de werkgever. Hij moet het loon doorbetalen bij ziekte (art. 7:629 BW) en de werknemer begeleiden bij re-integratie (Wet verbetering poortwachter)."],
      ["Samen", "Artikel 9 haalt het verbod weg en artikel 6 geeft de grondslag. Pas met allebei mag de werkgever de gegevens verwerken."],
      ["De grens", "Alleen wat nodig is, zoals bereikbaarheid, (verpleeg)adres, verwachte duur, lopende afspraken, of de werknemer onder een vangnetregeling valt en of er een arbeidsongeval of aansprakelijke derde is. De diagnose legt de werkgever volgens de Autoriteit Persoonsgegevens niet vast, ook niet met toestemming. Medische informatie is voor de bedrijfsarts."]
    ] }
  ];
  var MELD_ADRES = "jz@vcsw.nl";

  /* ---------- State ---------- */
  var S, timer = null;
  function fresh() {
    return { screen: "brief", sit: 0, shield: 100, score: 0, crystals: [], picks: {}, memos: [], earthOpen: [-1, 0], earthStep: 0,
      lock: { assign: {}, attempts: 0, firstCorrect: null, solved: false, revealed: false, left: LOCK_SECONDS, timeout: false, wrong: {}, msg: null,
        sel: DOSSIERS[0].id, dirty: true, given: 0, view: 0 } };
  }
  S = fresh();

  var stage = document.getElementById("stage");
  var STEPS = ["Briefing", "Dienst", "Luchtsluis", "Debriefing", "Terug op aarde"];

  function hit(n) { S.shield = Math.max(0, S.shield - n); }
  function hasCrystal(n) { return S.crystals.indexOf(n) !== -1; }
  function isLock() { return S.screen === "lockstart" || S.screen === "lock"; }
  function pct() { return Math.round(S.score / MAX * 100); }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  /* De schil leest hier de stand van het level uit. */
  window.orionStatus = function () {
    var done = S.screen === "debrief" || S.screen === "earth";
    return {
      score: S.score, max: MAX, shield: S.shield,
      crystals: S.crystals.length, crystalsMax: CRYSTALS_MAX,
      steps: STEPS.slice(),
      step: S.screen === "brief" ? 0 : S.screen === "sit" ? 1 : isLock() ? 2 : S.screen === "debrief" ? 3 : 4,
      done: done, passed: done ? pct() >= 70 : null, pct: done ? pct() : null
    };
  };

  function hud() {
    document.body.setAttribute("data-screen", S.screen);
    stage.setAttribute("aria-live", isLock() ? "off" : "polite");
    document.getElementById("shieldText").textContent = S.shield + "%";
    var f = document.getElementById("shieldFill");
    f.style.width = S.shield + "%";
    f.className = "vcsw-progress-fill" + (S.shield < 50 ? " error" : S.shield < 80 ? " warning" : "");
    document.getElementById("scoreText").textContent = S.score + " / " + MAX;
    document.getElementById("crystalText").textContent = S.crystals.length + " / " + CRYSTALS_MAX;
    var n = SITS.length, labels = ["Briefing"].concat(SITS.map(function (s, i) { return "Dienst " + (i + 1); }), ["Luchtsluis", "Debriefing", "Terug op aarde"]);
    var cur = S.screen === "brief" ? 0 : S.screen === "sit" ? 1 + S.sit : isLock() ? n + 1 : S.screen === "debrief" ? n + 2 : n + 3;
    document.getElementById("steps").innerHTML = labels.map(function (l, i) {
      var cls = i < cur ? "done" : i === cur ? "now" : "";
      return '<li class="' + cls + '"' + (i === cur ? ' aria-current="step"' : "") + ">" + (i < cur ? icon("check") : "") + l + "</li>";
    }).join("");
  }

  /* Tekent het scherm opnieuw en zet de focus terug: op het gevraagde element, anders op hetzelfde onderdeel als voor het tekenen. */
  var lastScreen = null;
  function show(html, focusSel, cls) {
    var a = document.activeElement, had = !!a && stage.contains(a), fk = had ? a.getAttribute("data-fk") : null;
    stage.innerHTML = '<div class="screen' + (cls ? " " + cls : "") + '" tabindex="-1">' + html + "</div>";
    hud();
    var t = null;
    if (focusSel) t = stage.querySelector(focusSel);
    if (!t && fk && lastScreen === S.screen) t = stage.querySelector('[data-fk="' + fk + '"]:not([disabled])');
    if (!t && had) t = stage.querySelector(".screen");
    if (t) t.focus({ preventScroll: true });
    if (lastScreen !== S.screen) { lastScreen = S.screen; window.scrollTo(0, 0); }
  }

  function verdictBadge(r) {
    if (r === "goed") return '<span class="vcsw-badge success">' + icon("check") + "Goed, +10</span>";
    if (r === "half") return '<span class="vcsw-badge warning">Half goed, +5</span>';
    return '<span class="vcsw-badge danger">Fout, 0 punten</span>';
  }
  function alertBox(kind, ic, title, text) {
    return '<div class="vcsw-alert ' + kind + '">' + icon(ic) + '<div><p class="vcsw-alert-title">' + title + '</p><p class="vcsw-alert-text">' + text + "</p></div></div>";
  }
  function chip(text, ic, cls) { return '<span class="chip' + (cls ? " " + cls : "") + '">' + (ic ? icon(ic) : "") + text + "</span>"; }
  function vak(id) { return VAKKEN.filter(function (v) { return v.id === id; })[0]; }
  function gIcon(id) { return '<span class="g-ic g-' + id + '">' + icon(GROND[id].ic) + "</span>"; }
  function facts(rows) {
    return '<ul class="facts">' + rows.filter(Boolean).map(function (r) {
      return "<li" + (r[3] ? ' class="' + r[3] + '"' : "") + '><span class="f-ic ' + r[0] + '">' + icon(r[1]) + "</span><span>" + r[2] + "</span></li>";
    }).join("") + "</ul>";
  }

  /* ---------- Schermen ---------- */
  function renderBrief() {
    show(
      "<h1>De passagiersmodule</h1>" +
      '<p class="lead">Je leert waarom het station een BSN, een adres en verzuimgegevens mag verwerken, en waar de grens ligt.</p>' +
      speech("aria", "De nieuwe kolonisten zijn aan boord en een deel is crewlid van Orion geworden. Luitenant Mira houdt hun administratie bij, met BSN’s, adressen, paspoortkopieën en ziekmeldingen. Voor alles wat je daarmee doet, heb je een reden nodig die de wet erkent. Dat heet een grondslag. Vraag je bij elke stap af waarom het station dit mag, en waarvoor.") +
      '<dl class="vcsw-dl" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">' +
      "<div><dt>Dienst</dt><dd>Vijf situaties met elk drie keuzes. Goed is 10 punten, half goed 5.</dd></div>" +
      "<div><dt>Luchtsluis</dt><dd>Geef tien gegevens in het cryo-archief binnen vijf minuten de juiste grondslag.</dd></div>" +
      "<div><dt>Gehaald</dt><dd>Bij minimaal 70 procent van de punten word je Luitenant.</dd></div></dl>" +
      '<div class="actions"><button class="vcsw-button lg" id="go">Begin de dienst' + icon("next") + "</button></div>",
      null, "title-screen"
    );
    document.getElementById("go").onclick = function () { S.screen = "sit"; S.sit = 0; render(); };
  }

  function renderSit() {
    var s = SITS[S.sit], pick = S.picks[S.sit];
    var html = '<div class="titled"><div class="chips">' + chip("Dienst " + (S.sit + 1) + " van " + SITS.length) + "</div><h2>" + esc(s.title) + "</h2></div>";
    if (s.intro) html += "<p>" + esc(s.intro) + "</p>";
    html += speech(s.who, s.say);
    html += '<div class="options" role="group" aria-label="Kies je antwoord">';
    ordered(S.sit, s.opts).forEach(function (o, n) {
      var cls = "option" + (pick ? (pick === o.k ? " picked" : " dim") : "");
      html += '<button class="' + cls + '" data-k="' + o.k + '"' + (pick ? " disabled" : "") + '><span class="key" aria-hidden="true">' + "ABC"[n] + "</span><span><span class=\"vcsw-sr-only\">Optie " + "ABC"[n] + ". </span>" + esc(o.t) +
        (pick === o.k ? '<span class="verdict">' + verdictBadge(o.r) + "</span>" : "") + "</span></button>";
    });
    html += "</div>";
    if (pick) {
      var o = s.opts.filter(function (x) { return x.k === pick; })[0];
      html += '<div class="feedback">' + speech(s.who, o.reactie) +
        speech("aria", (o.r === "goed" ? "Goed. " : o.r === "half" ? "Half goed. " : "Fout. ") + o.uitleg);
      if (s.crystal && s.crystal.on === pick) {
        html += '<div class="reward">' + icon("gem") + "<div><strong>Datakristal " + esc(s.crystal.name) + "</strong><br><span>" + esc(s.crystal.desc) + "</span></div></div>";
      } else if (s.crystal) {
        html += '<p class="dossier-note" style="color:var(--vcsw-text-muted)">Geen datakristal bij deze keuze. In de luchtsluis is elk kristal één aanwijzing van ARIA zonder kosten.</p>';
      }
      if (o.memo) html += alertBox("warning", "bell", "ARIA onthoudt deze keuze", "Dit komt terug in de eindmissie.");
      html += '</div><div class="actions"><button class="vcsw-button lg" id="next">' + (S.sit < SITS.length - 1 ? "Volgende situatie" : "Naar de luchtsluis") + icon("next") + "</button></div>";
    }
    show(html);
    if (!pick) {
      stage.querySelectorAll(".option").forEach(function (b) {
        b.onclick = function () { choose(b.getAttribute("data-k")); };
      });
    } else {
      document.getElementById("next").onclick = function () {
        if (S.sit < SITS.length - 1) { S.sit++; } else { S.screen = "lockstart"; }
        render();
      };
    }
  }

  function choose(k) {
    var s = SITS[S.sit], o = s.opts.filter(function (x) { return x.k === k; })[0];
    S.picks[S.sit] = k;
    S.score += POINTS[o.r];
    hit(SHIELD_HIT[o.r]);
    if (s.crystal && s.crystal.on === k && !hasCrystal(s.crystal.name)) S.crystals.push(s.crystal.name);
    if (o.memo && S.memos.indexOf(o.memo) === -1) S.memos.push(o.memo);
    render();
  }

  /* Luchtsluis: het cryo-archief */
  function startTimer() {
    stopTimer();
    timer = setInterval(function () {
      if (S.screen !== "lock" || S.lock.solved || S.lock.revealed) return stopTimer();
      S.lock.left = Math.max(0, S.lock.left - 1);
      var t = document.getElementById("timer");
      if (t) { t.querySelector("span").textContent = fmt(S.lock.left); t.classList.toggle("low", S.lock.left <= 60); }
      if (S.lock.left === 0 && !S.lock.timeout) { S.lock.timeout = true; hit(10); S.lock.msg = "timeout"; stopTimer(); render(); }
    }, 1000);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function fmt(n) { return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0"); }

  /* Startkaart: het doel, hoe je scoort, wat een fout kost, en één startknop */
  function renderLockStart() {
    var n = S.crystals.length;
    show(
      '<div class="titled"><div class="chips">' + chip("Luchtsluis", "unlock") + chip(plural(LOCK_SECONDS / 60, "minuut", "minuten"), "clock", "calm-hide") + chip("Tien lades", "archive") + "</div>" +
      '<h2 class="h-md">Het cryo-archief</h2>' +
      '<p class="start-goal">Geef elk van de tien gegevens in het archief de grond waarop het station het mag hebben, en wis wat geen grond heeft.</p></div>' +
      '<div class="o-card"><h3>De vijf gronden</h3><dl class="gronden-uitleg">' + VAKKEN.map(function (v) {
        return "<div>" + gIcon(v.id) + "<dt>" + v.label + "</dt><dd>" + v.desc + '</dd><dd class="art">' + v.art + "</dd></div>";
      }).join("") + "</dl></div>" +
      '<div class="two"><div class="o-card"><h3>Zo scoor je</h3>' + facts([
        ["ok", "check", "Elke lade die bij je eerste controle klopt, is " + DOSSIER_POINTS + " punten"],
        ["blue", "unlock", "De sluis gaat open als alle tien lades kloppen"],
        ["gold", "gem", n ? "Je verdiende " + plural(n, "kristal", "kristallen") + ". Elk kristal is één aanwijzing van ARIA zonder kosten" : "Je verdiende geen kristallen, dus een aanwijzing van ARIA kost schild"]
      ]) + '</div><div class="o-card"><h3>Wat een fout kost</h3>' + facts([
        ["bad", "shield", "Een nieuwe poging kost 5 procent schild"],
        ["gold", "bulb", "Een aanwijzing zonder kristal kost " + CLUE_COST + " procent schild"],
        ["blue", "clock", "Is de tijd op, dan kost dat 10 procent schild en maak je de sluis gewoon af", "calm-hide"],
        ["blue", "eye", "Na twee pogingen mag je de oplossing zien"]
      ]) + "</div></div>" +
      '<div class="actions"><button class="vcsw-button lg start" id="startLock">Start de luchtsluis' + icon("next") + "</button></div>"
    );
    document.getElementById("startLock").onclick = function () { S.screen = "lock"; startTimer(); render(); };
  }

  function dossier(id) { return DOSSIERS.filter(function (d) { return d.id === id; })[0]; }
  /* De volgende lade zonder keuze. Is die er niet, dan de volgende lade die na controle fout bleek. Anders blijft de lade open. */
  function nextLade(from) {
    var L = S.lock, i = DOSSIERS.indexOf(dossier(from)), n = DOSSIERS.length, k, d;
    for (k = 1; k < n; k++) { d = DOSSIERS[(i + k) % n]; if (!L.assign[d.id]) return d.id; }
    for (k = 1; k < n; k++) { d = DOSSIERS[(i + k) % n]; if (L.wrong[d.id]) return d.id; }
    return from;
  }

  function renderLock(focusSel) {
    var L = S.lock, done = L.solved || L.revealed;
    var counts = {}; VAKKEN.forEach(function (v) { counts[v.id] = 0; });
    Object.keys(L.assign).forEach(function (id) { counts[L.assign[id]]++; });
    var nSet = Object.keys(L.assign).length, all = nSet === DOSSIERS.length;
    var free = S.crystals.length, used = Math.min(L.given, free), cluesLeft = CLUES.length - L.given, cost = L.given < free ? 0 : CLUE_COST;
    var cur = dossier(L.sel), i;

    /* ARIA met het doel, en de ene knop voor een aanwijzing */
    var html = '<div class="aria-card"><span class="vcsw-avatar av-aria" aria-hidden="true">A</span><div class="aria-body"><div class="aria-who">ARIA <span>boordcomputer</span></div><p class="aria-text">' + GOAL + "</p></div>";
    if (!done) {
      html += '<div class="ask"><button type="button" class="vcsw-button outline" id="ask" data-fk="ask"' + (cluesLeft ? "" : " disabled") + ">" + (cluesLeft ? "Vraag ARIA om een aanwijzing" : "Alle aanwijzingen gegeven") + icon("bulb") + "</button>" +
        (cluesLeft ? (cost ? chip("De volgende kost " + cost + " procent schild", "shield", "gold") : chip("De volgende is zonder kosten", "gem", "green")) : "") + "</div>";
    }
    html += "</div>";

    if (L.given) {
      var c = CLUES[L.view];
      html += '<div class="clue-say" id="clueSay" tabindex="-1"><p><span class="vcsw-sr-only">Aanwijzing van ARIA. </span><strong>' + esc(c.title) + ".</strong> " + esc(c.text) + "</p>";
      if (L.given > 1) {
        html += '<div class="pager"><button type="button" id="cluePrev" data-fk="cluePrev" aria-label="Vorige aanwijzing"' + (L.view === 0 ? " disabled" : "") + ">" + icon("left") + "</button>" +
          "<span>" + (L.view + 1) + " van " + L.given + "</span>" +
          '<button type="button" id="clueNext" data-fk="clueNext" aria-label="Volgende aanwijzing"' + (L.view >= L.given - 1 ? " disabled" : "") + ">" + icon("right") + "</button></div>";
      }
      html += "</div>";
    }

    /* Eén regel: de naam van de sluis, hoeveel gekozen, de kristallen, en rechts de klok */
    var gems = "";
    for (i = 0; i < free; i++) gems += '<span class="gem' + (i < used ? " used" : "") + '">' + icon("gem") + "</span>";
    html += '<div class="lockbar"><h2 class="lock-title">Het cryo-archief</h2>' +
      (L.solved ? chip("Sluis open", "unlock", "green") : L.revealed ? chip("Oplossing getoond", "eye") : chip(nSet + " van " + DOSSIERS.length + " gekozen", "check")) +
      '<span class="chip neutral">' + gems + (free ? used + " van " + plural(free, "kristal", "kristallen") + " gebruikt" : "Geen kristallen verdiend") + "</span>" +
      '<div class="timer' + (L.left <= 60 ? " low" : "") + '" id="timer" role="timer" aria-label="Resterende tijd">' + icon("clock") + "<span>" + fmt(L.left) + "</span></div></div>";

    /* Links de kast met tien lades, rechts de lade die open is */
    html += '<div class="kast-grid"><div class="kast" role="group" aria-labelledby="kastTitle"><h3 class="vcsw-sr-only" id="kastTitle">De tien lades</h3>';
    DOSSIERS.forEach(function (d) {
      var a = L.assign[d.id], good = a === d.ans, wrong = !done && L.wrong[d.id], open = d.id === L.sel;
      var mark, line, cls = "lade" + (open ? " open" : "");
      if (done) {
        cls += good ? " ok" : " wrong";
        mark = '<span class="lade-mark ' + (good ? "ok" : "bad") + '">' + (good ? "Goed" : "Fout") + icon(good ? "ok" : "bad") + "</span>";
        line = '<span class="lade-grond g-' + d.ans + '">' + (good ? "" : '<span class="vcsw-sr-only">Juiste grond: </span>') + vak(d.ans).label + "</span>";
      } else if (wrong) {
        cls += " wrong";
        mark = '<span class="lade-mark bad">Fout' + icon("bad") + "</span>";
        line = '<span class="lade-grond g-' + a + '">' + vak(a).label + "</span>";
      } else if (a) {
        mark = '<span class="lade-mark g-' + a + '">' + icon(GROND[a].ic) + "</span>";
        line = '<span class="lade-grond g-' + a + '">' + vak(a).label + "</span>";
      } else {
        mark = '<span class="lade-mark"><span class="dash"></span></span>';
        line = '<span class="lade-grond none">Nog kiezen</span>';
      }
      html += '<button type="button" class="' + cls + '" data-lade="' + d.id + '" data-fk="lade-' + d.id + '" aria-controls="openLade"' + (open ? ' aria-current="true"' : "") + ">" +
        '<span class="lade-top"><span class="lade-id"><span class="vcsw-sr-only">Lade </span>' + d.id + '<span class="vcsw-sr-only">, ' + esc(d.name) + ". </span></span>" + mark + "</span>" +
        '<span class="lade-what">' + esc(d.what) + '<span class="vcsw-sr-only">. </span></span>' + line + "</button>";
    });
    html += "</div>";

    var a = L.assign[cur.id], curWrong = !done && L.wrong[cur.id];
    html += '<section class="open-lade" id="openLade" tabindex="-1" aria-labelledby="openTitle">' +
      '<p class="open-meta">Lade ' + cur.id + ", " + esc(cur.name) + "</p>" +
      '<h3 id="openTitle">' + esc(cur.what) + "</h3>" +
      '<p class="open-ctx">' + esc(cur.ctx) + ".</p>";
    if (!done) {
      html += curWrong ? '<p class="open-kies bad">' + icon("bad") + "Deze grond klopt niet. Kies een andere.</p>" : '<p class="open-kies">Kies de grond</p>';
      html += '<div class="gronden" role="group" aria-label="Grond voor ' + esc(cur.what) + ", " + esc(cur.name) + '">' + VAKKEN.map(function (v) {
        var on = a === v.id;
        return '<button type="button" class="grond' + (on && curWrong ? " wrong" : "") + '" data-grond="' + v.id + '" data-fk="grond-' + v.id + '" aria-pressed="' + on + '">' +
          '<span class="radio" aria-hidden="true"></span>' + gIcon(v.id) +
          '<span class="grond-txt"><span class="grond-label">' + v.label + '</span><span class="grond-desc">' + GROND[v.id].kort + "</span></span></button>";
      }).join("") + "</div>";
    } else {
      var good = a === cur.ans;
      html += '<dl class="open-result"><div><dt>Jouw keuze</dt><dd>' + (a ? gIcon(a) + vak(a).label : "Geen keuze") +
        '<span class="tag ' + (good ? "ok" : "bad") + '">' + icon(good ? "check" : "x") + (good ? "Goed" : "Fout") + "</span></dd></div>" +
        (good ? "" : "<div><dt>Juiste grond</dt><dd>" + gIcon(cur.ans) + vak(cur.ans).label + "</dd></div>") + "</dl>" +
        '<p class="open-why">' + esc(cur.why) + "</p>";
    }
    html += "</section></div>";

    /* De knoppen, met ernaast wat er aan de hand is */
    var msg;
    if (L.solved) msg = ["ok", "ok", "Sluiscode " + VAKKEN.map(function (v) { return counts[v.id]; }).join(" ") + ". De sluis gaat open. Elk gegeven heeft de juiste grondslag, en wat geen grondslag heeft gaat weg."];
    else if (L.revealed) msg = ["", "eye", "Oplossing getoond. Bij elke lade staat de juiste grond met uitleg. De sluis is handmatig geopend."];
    else if (L.msg === "timeout") msg = ["warn", "warn", "De tijd is op. Je schild verliest 10 procent. Maak de sluis gewoon af."];
    else if (L.msg === "wrong") { var n = Object.keys(L.wrong).length; msg = ["bad", "bad", (n === 1 ? "1 lade heeft" : n + " lades hebben") + " de verkeerde grond. Pas " + (n === 1 ? "hem" : "ze") + " aan. Een nieuwe poging kost 5 procent schild."]; }
    else if (!all) msg = ["", "", "Kan zodra alle tien lades een grond hebben."];
    else msg = ["", "", L.attempts ? "Controleer opnieuw. Deze poging kost 5 procent schild." : "Alle tien lades hebben een grond."];

    html += '<div class="lock-actions">';
    if (!done) {
      html += '<button type="button" class="vcsw-button lg" id="check" data-fk="check"' + (all && L.dirty ? "" : " disabled") + ">Open de sluis" + icon("unlock") + "</button>";
      if (L.attempts >= 2) html += '<button type="button" class="vcsw-button outline lg" id="reveal" data-fk="reveal">' + icon("eye") + "Toon de oplossing</button>";
    } else {
      html += '<button type="button" class="vcsw-button lg" id="toDebrief" data-fk="toDebrief">Naar de debriefing' + icon("next") + "</button>";
    }
    html += '<p class="lock-msg ' + msg[0] + '" role="status">' + (msg[1] ? icon(msg[1]) : "") + "<span>" + msg[2] + "</span></p></div>";

    show(html, focusSel);

    stage.querySelectorAll("[data-lade]").forEach(function (b) {
      b.onclick = function () { L.sel = b.getAttribute("data-lade"); renderLock('[data-fk="lade-' + L.sel + '"]'); };
    });
    stage.querySelectorAll("[data-grond]").forEach(function (b) {
      b.onclick = function () {
        var id = L.sel, v = b.getAttribute("data-grond");
        L.assign[id] = v;
        L.dirty = true;
        delete L.wrong[id];
        if (L.msg === "timeout" || (L.msg === "wrong" && !Object.keys(L.wrong).length)) L.msg = null;
        L.sel = nextLade(id);
        renderLock(L.sel === id ? '[data-fk="grond-' + v + '"]' : "#openLade");
      };
    });
    var ask = document.getElementById("ask");
    if (ask) ask.onclick = function () {
      if (L.given >= CLUES.length) return;
      if (L.given >= S.crystals.length) hit(CLUE_COST);
      L.view = L.given;
      L.given++;
      renderLock("#clueSay");
    };
    var p = document.getElementById("cluePrev"), nx = document.getElementById("clueNext");
    if (p) p.onclick = function () { L.view = Math.max(0, L.view - 1); renderLock(L.view === 0 ? "#clueNext" : null); };
    if (nx) nx.onclick = function () { L.view = Math.min(L.given - 1, L.view + 1); renderLock(L.view >= L.given - 1 ? "#cluePrev" : null); };
    var c2 = document.getElementById("check");
    if (c2) c2.onclick = function () { checkLock(); renderLock(S.lock.solved ? "#toDebrief" : "#openLade"); };
    var r = document.getElementById("reveal");
    if (r) r.onclick = function () { L.revealed = true; L.msg = null; L.wrong = {}; stopTimer(); renderLock("#openLade"); };
    var t = document.getElementById("toDebrief");
    if (t) t.onclick = function () { S.screen = "debrief"; render(); };
  }

  /* Punten per dossier alleen bij de eerste controle. Elke controle daarna kost 5 procent schild. */
  function checkLock() {
    var L = S.lock, wrong = {}, correct = 0, first = null;
    DOSSIERS.forEach(function (d) { if (L.assign[d.id] === d.ans) correct++; else { wrong[d.id] = true; if (!first) first = d.id; } });
    if (L.firstCorrect === null) { L.firstCorrect = correct; S.score += correct * DOSSIER_POINTS; }
    else hit(5);
    L.attempts++;
    L.dirty = false;
    if (correct === DOSSIERS.length) { L.solved = true; L.wrong = {}; L.msg = null; stopTimer(); }
    else { L.wrong = wrong; L.msg = "wrong"; L.sel = first; }
  }

  function renderDebrief() {
    var p = pct(), passed = p >= 70;
    var html = "<h2>" + (passed ? "Level gehaald. Je bent nu Luitenant." : "Nog niet gehaald") + "</h2>";
    html += '<div class="vcsw-stats cols-3"><div class="vcsw-stat"><span class="vcsw-stat-label">Score</span><span class="vcsw-stat-value">' + p + '%</span><span class="vcsw-stat-note">' + S.score + " van " + MAX + ' punten</span></div>' +
      '<div class="vcsw-stat"><span class="vcsw-stat-label">Schildsterkte</span><span class="vcsw-stat-value">' + S.shield + '%</span><span class="vcsw-stat-note">vertrouwen aan boord</span></div>' +
      '<div class="vcsw-stat"><span class="vcsw-stat-label">Datakristallen</span><span class="vcsw-stat-value">' + S.crystals.length + '</span><span class="vcsw-stat-note">van ' + CRYSTALS_MAX + ' in dit level</span></div></div>';

    html += speech("aria", passed
      ? "Goed werk, Luitenant. Je weet nu waarom het station een BSN, een adres of een ziekmelding mag hebben, en waar de grens ligt."
      : "Je hebt minder dan 70 procent. Speel de dienst opnieuw. In de echte game krijg je dan andere situaties.");

    html += "<div><h3>Jouw keuzes</h3><ul class=\"result-list\">";
    SITS.forEach(function (s, i) {
      var o = s.opts.filter(function (x) { return x.k === S.picks[i]; })[0];
      if (!o) { html += "<li><span>" + (i + 1) + ". " + esc(s.title) + '</span><span class="vcsw-badge neutral">Niet gespeeld</span></li>'; return; }
      html += "<li><span>" + (i + 1) + ". " + esc(s.title) + " <span style=\"color:var(--vcsw-text-muted)\">(" + "ABC"[S.ord && S.ord[i] ? S.ord[i].indexOf(s.opts.indexOf(o)) : s.opts.indexOf(o)] + ")</span></span>" + verdictBadge(o.r) + "</li>";
    });
    var lc = S.lock.firstCorrect || 0;
    html += "<li><span>Cryo-archief, eerste poging</span><span class=\"vcsw-badge " + (lc === DOSSIERS.length ? "success" : lc >= 7 ? "warning" : "danger") + "\">" + lc + " van " + DOSSIERS.length + " goed, +" + lc * DOSSIER_POINTS + "</span></li></ul></div>";

    html += "<div><h3>Drie kernregels</h3><ol class=\"rules\">" + RULES.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol></div>";

    if (S.crystals.length) html += '<div><h3>Je inventaris</h3><div class="crystals">' + S.crystals.map(function (c) { return '<span class="vcsw-badge">' + icon("gem") + esc(c) + "</span>"; }).join("") + "</div></div>";

    if (S.memos.length) {
      html += '<div><h3>ARIA onthoudt</h3><p style="font-size:0.875rem;color:var(--vcsw-text-muted)">In de eindmissie komt een inzageverzoek binnen. Deze sporen vindt de speler dan terug en moet hij melden.</p><ul class="result-list">' +
        S.memos.map(function (m) { return "<li><span>" + esc(m) + '</span><span class="vcsw-badge warning">Eindmissie</span></li>'; }).join("") + "</ul></div>";
    }

    html += '<div class="actions">' + (passed ? "" : '<button class="vcsw-button outline lg" id="again">' + icon("refresh") + "Speel opnieuw</button>") +
      '<button class="vcsw-button lg" id="earth">Terug op aarde' + icon("next") + "</button></div>";
    show(html);
    var a = document.getElementById("again");
    if (a) a.onclick = restart;
    document.getElementById("earth").onclick = function () { S.screen = "earth"; render(); };
  }

  function bar(value, cls, mark) {
    return '<div class="bar" aria-hidden="true"><div class="bar-fill ' + cls + '" style="width:' + Math.max(0, Math.min(100, value)) + '%"></div>' + (mark ? '<span class="bar-mark" style="left:' + mark + '%"></span>' : "") + "</div>";
  }

  /* Terug op aarde in twee delen, zodat elk deel in het paneel past: eerst de regels, dan melden en de uitslag. */
  function renderEarth(focusSel) {
    var p = pct(), passed = p >= 70, step = S.earthStep;
    var html = '<div class="titled"><h2 class="h-md">Wat betekent dit voor je werk bij VCSW</h2>' +
      (step === 0 ? "<p>Bij VCSW werk je dagelijks met BSN’s, adressen en verzuimgegevens van werknemers van klanten. Dezelfde regels gelden daar.</p>" : "") + "</div>";

    if (step === 0) {
      html += '<div class="two earth-lists">' + EARTH.map(function (list, li) {
        return '<div class="o-card"><h3>' + list.title + '</h3><div class="acc">' + list.items.map(function (it, ii) {
          var open = S.earthOpen[li] === ii, id = "acc-" + li + "-" + ii;
          return '<div class="acc-item' + (open ? " open" : "") + '"><h4><button type="button" data-acc="' + li + "-" + ii + '" data-fk="' + id + '" id="' + id + '-b" aria-expanded="' + open + '" aria-controls="' + id + '">' +
            "<span>" + it[0] + "</span>" + icon("down") + "</button></h4>" +
            '<div class="acc-body" id="' + id + '" role="region" aria-labelledby="' + id + '-b"' + (open ? "" : " hidden") + "><p>" + it[1] + "</p></div></div>";
        }).join("") + "</div>" + (list.note ? '<p class="acc-note">' + list.note + "</p>" : "") + "</div>";
      }).join("") + "</div>" +
        '<div class="actions"><button type="button" class="vcsw-button lg" id="earthNext" data-fk="earthNext">Verder naar melden en je uitslag' + icon("next") + "</button></div>";
    } else {
      html += '<div class="o-card meld"><div><h3>Twijfel of een incident? Meld het</h3><p>Bij Tarik, Dagmar of per mail.</p></div>' +
        '<span class="route">' + MELD_ADRES + "</span>" +
        '<button type="button" class="vcsw-button outline lg" id="copy" data-fk="copy">Kopieer adres' + icon("copy") + '</button><span class="vcsw-sr-only" role="status" id="copyStatus"></span></div>';

      html += '<div class="o-card uitslag"><div class="uitslag-head"><h3>Resultaat level 2</h3>' +
        (passed ? chip("Gehaald", "check", "green") : chip("Nog niet gehaald", "", "gold")) + "</div>" +
        '<div class="uitslag-stats">' +
        '<div><p class="u-label">Score</p><p class="u-value">' + S.score + " van " + MAX + " punten</p>" + bar(p, "blue", 70) + '<p class="u-note">' + p + " procent. Je " + (passed ? "had" : "hebt") + " 70 procent nodig.</p></div>" +
        '<div><p class="u-label">Schild</p><p class="u-value">' + S.shield + " procent</p>" + bar(S.shield, S.shield < 80 ? "gold" : "green") + '<p class="u-note">Het schild telt niet mee voor halen. Het laat zien hoe zeker je speelde.</p></div>' +
        '<div><p class="u-label">Kristallen</p><p class="u-value">' + S.crystals.length + " van " + CRYSTALS_MAX + "</p>" + bar(S.crystals.length / CRYSTALS_MAX * 100, "gold") + '<p class="u-note">Elk kristal is in de luchtsluis één aanwijzing zonder kosten.</p></div>' +
        "</div>" +
        '<div class="actions"><button type="button" class="vcsw-button lg" id="again" data-fk="again">Speel level 2 opnieuw' + icon("refresh") + "</button>" +
        '<button type="button" class="vcsw-button outline lg" id="earthBack" data-fk="earthBack">' + icon("left") + "Terug naar de regels</button></div></div>";
    }

    show(html, focusSel);

    stage.querySelectorAll("[data-acc]").forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute("data-acc").split("-"), li = +k[0], ii = +k[1];
        S.earthOpen[li] = S.earthOpen[li] === ii ? -1 : ii;
        renderEarth('[data-acc="' + li + "-" + ii + '"]');
      };
    });
    var nx = document.getElementById("earthNext"), bk = document.getElementById("earthBack"), cp = document.getElementById("copy"), ag = document.getElementById("again");
    if (nx) nx.onclick = function () { S.earthStep = 1; renderEarth(".screen"); window.scrollTo(0, 0); };
    if (bk) bk.onclick = function () { S.earthStep = 0; renderEarth(".screen"); window.scrollTo(0, 0); };
    if (ag) ag.onclick = restart;
    if (cp) cp.onclick = function () {
      var btn = this, status = document.getElementById("copyStatus");
      function done(ok) {
        btn.innerHTML = (ok ? "Gekopieerd" : "Kopiëren lukt niet") + icon(ok ? "check" : "copy");
        status.textContent = ok ? "Het adres " + MELD_ADRES + " is gekopieerd." : "Kopiëren lukt niet. Het adres is " + MELD_ADRES + ".";
        setTimeout(function () { if (document.body.contains(btn)) btn.innerHTML = "Kopieer adres" + icon("copy"); }, 2500);
      }
      function fallback() {
        var ta = document.createElement("textarea"), ok = false;
        ta.value = MELD_ADRES; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        document.body.removeChild(ta); btn.focus({ preventScroll: true });
        done(ok);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(MELD_ADRES).then(function () { done(true); }, fallback);
      else fallback();
    };
  }

  function restart() { stopTimer(); S = fresh(); render(); window.scrollTo(0, 0); }

  function render() {
    if (S.screen === "brief") renderBrief();
    else if (S.screen === "sit") renderSit();
    else if (S.screen === "lockstart") renderLockStart();
    else if (S.screen === "lock") renderLock();
    else if (S.screen === "debrief") renderDebrief();
    else renderEarth();
  }

  /* ---------- Testsprong: ?scherm=briefing|dienst|sluisstart|sluis|debriefing|aarde|uitslag ----------
     Extra: nr=1..5 bij dienst, kristallen=0..5, voorbeeld=goed|fout voor een ingevulde stand. */
  function jump() {
    var q;
    try { q = new URLSearchParams(window.location.search); } catch (e) { return; }
    var naam = (q.get("scherm") || "").toLowerCase(), vb = q.get("voorbeeld");
    var map = { briefing: "brief", dienst: "sit", sluisstart: "lockstart", sluis: "lock", debriefing: "debrief", aarde: "earth", uitslag: "earth" };
    if (!map[naam]) return;
    S.screen = map[naam];
    if (naam === "uitslag") S.earthStep = 1;
    if (S.screen === "brief") return;
    var upto = S.screen === "sit" ? Math.max(1, Math.min(SITS.length, parseInt(q.get("nr"), 10) || 1)) - 1 : SITS.length;
    S.sit = Math.min(upto, SITS.length - 1);
    if (vb === "goed" || vb === "fout") {
      SITS.slice(0, upto).forEach(function (s, i) {
        var want = vb === "goed" || i % 2 === 0 ? "goed" : "fout", o = s.opts.filter(function (x) { return x.r === want; })[0];
        S.picks[i] = o.k; S.score += POINTS[o.r]; hit(SHIELD_HIT[o.r]);
        if (s.crystal && s.crystal.on === o.k) S.crystals.push(s.crystal.name);
        if (o.memo && S.memos.indexOf(o.memo) === -1) S.memos.push(o.memo);
      });
    }
    if (q.get("kristallen") !== null) {
      var k = Math.max(0, Math.min(CRYSTALS_MAX, parseInt(q.get("kristallen"), 10) || 0));
      S.crystals = SITS.filter(function (s) { return s.crystal; }).slice(0, k).map(function (s) { return s.crystal.name; });
    }
    if ((S.screen === "debrief" || S.screen === "earth") && vb) {
      DOSSIERS.forEach(function (d, i) { S.lock.assign[d.id] = vb === "goed" || i % 3 ? d.ans : (d.ans === "wet" ? "toe" : "wet"); });
      checkLock();
      if (!S.lock.solved) { S.lock.revealed = true; S.lock.msg = null; S.lock.wrong = {}; }
    }
    if (S.screen === "lock") startTimer();
  }

  jump();
  render();
})();
