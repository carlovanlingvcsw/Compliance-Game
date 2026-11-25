/* Level 5: Alarm in module Kepler. Game logic and content of this level. */
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
    up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    down: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    shieldok: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    cross: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    dot: '<circle cx="12" cy="12" r="3"/>'
  };
  function icon(name, cls) { return '<svg class="vcsw-icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + I[name] + "</svg>"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var ARIA_FACE = '<svg class="ox-face" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="48" fill="#0c2f5f"/><ellipse cx="48" cy="50" rx="30" ry="24" fill="#e8eef6"/><ellipse cx="48" cy="50" rx="30" ry="24" fill="none" stroke="#8fa0b8" stroke-width="2"/><circle cx="48" cy="50" r="13" fill="#04142b"/><circle cx="48" cy="50" r="8" fill="#15aaff"/><circle cx="45" cy="47" r="2.5" fill="#fff"/><rect x="10" y="44" width="10" height="12" rx="4" fill="#8fa0b8"/><rect x="76" y="44" width="10" height="12" rx="4" fill="#8fa0b8"/><path d="M48 26v-9" stroke="#8fa0b8" stroke-width="3" stroke-linecap="round"/><circle cx="48" cy="15" r="3" fill="#ffb900"/></svg>';

  /* ---------- Personages ---------- */
  var WHO = {
    aria: { name: "ARIA", role: "boordcomputer", av: "A", cls: "av-aria" },
    bram: { name: "Bram", role: "monteur", av: "B", cls: "av-bram" },
    vega: { name: "Kapitein Vega", role: "kolonie Nova Terra", av: "V", cls: "av-vega" },
    tessa: { name: "Tessa Moreau", role: "crewlid van Orion", av: "T", cls: "av-tessa" }
  };
  /* De klasse speech-text blijft: de brug leest daar de uitleg uit. */
  function speech(who, text, extra) {
    var w = WHO[who];
    var face = who === "aria" ? ARIA_FACE : '<span class="ox-av ' + w.cls + '" aria-hidden="true">' + w.av + "</span>";
    return '<div class="ox-say">' + face + '<div class="ox-say-body"><div class="ox-say-who"><span class="ox-say-name">' + w.name + '</span><span class="ox-say-role">' + w.role + "</span>" + (extra || "") + '</div><p class="speech-text ox-say-text">' + esc(text) + "</p></div></div>";
  }

  /* ---------- Rol van Orion ----------
     verwerker: Orion verwerkt het ziekteoverzicht in opdracht van Nova Terra (ontwerp).
     verantwoordelijke: herspeelvariant, het gaat om de eigen crew van Orion. */
  function V(obj) { return obj[S.role]; }

  var INCIDENT = {
    verwerker: "Bram heeft per ongeluk het ziekteoverzicht van de crew van Nova Terra, met namen en dagen afwezigheid, gestuurd naar de kolonie Kepler-4. Orion verwerkt dat overzicht in opdracht van Nova Terra.",
    verantwoordelijke: "Bram heeft per ongeluk het ziekteoverzicht van de eigen crew van Orion, met namen en dagen afwezigheid, gestuurd naar de kolonie Kepler-4. Orion is zelf verantwoordelijk voor die gegevens."
  };

  /* ---------- Situaties ----------
     cost: speltijd in uren per uitkomst. Snel en goed (binnen FAST seconden) levert bonus op. */
  var COST = { goed: 2, half: 6, fout: 12 };
  var FAST = 20, FAST_BONUS = 2;

  var S1 = {
    id: "s1", title: "Wachten tot na de rustperiode?", who: "bram",
    say: "De nachtdienst begint zo. Kepler-4 slaapt vast al. Laten we het na de rustperiode oppakken.",
    opts: [
      { k: "A", t: "Akkoord. Na de rustperiode pakken we het op, dat is vroeg genoeg.", r: "fout", cost: 10,
        uitleg: "De 72 uur lopen ook tijdens de rustperiode door.",
        reactie: "Mooi, dan ga ik slapen. Morgen kijken we wel." },
      { k: "B", t: "Direct melden bij ARIA, ook al begint de nachtdienst.", r: "goed",
        uitleg: "Een datalek meld je direct. Het meldpunt kan dan meteen beoordelen wat er moet gebeuren.",
        reactie: "Oké, oké. Ik blijf even. Zeg maar wat ik moet doen." },
      { k: "C", t: "Zelf de Galactische Toezichtraad oproepen.", r: "half",
        uitleg: "Snel handelen is goed, maar het meldpunt beoordeelt of en hoe er gemeld wordt.",
        reactie: "Wauw, jij gaat er meteen vol in. Weet ARIA hier al van?" }
    ]
  };

  var EXTRA_CONSOLE = {
    id: "xc", extra: true, title: "Extra opdracht: jouw console", who: "aria",
    intro: "Doorwerking uit level 1. Je liet je console ontgrendeld achter.",
    say: "Ik heb de logbestanden nagekeken. Het bericht naar Kepler-4 is verstuurd vanaf jouw console, terwijl die ontgrendeld was. Wat doe je met die informatie?",
    opts: [
      { k: "A", t: "Niets zeggen. Bram heeft op verzenden gedrukt, niet jij, dus dit hoort niet in het incidentlog thuis.", r: "fout",
        uitleg: "Het meldpunt heeft alle feiten nodig om het lek te beoordelen en herhaling te voorkomen. Ook de feiten die ongemakkelijk zijn.",
        reactie: "Dan ontbreekt er een belangrijk feit in mijn log. Dat vind ik later toch terug." },
      { k: "B", t: "Het feit laten vastleggen in het incidentlog en je console voortaan altijd vergrendelen.", r: "goed",
        uitleg: "Het log gaat over feiten, niet over schuld. Hoe het lek kon ontstaan, helpt om het in de toekomst te voorkomen.",
        reactie: "Vastgelegd. Dank je voor je eerlijkheid, Kapitein." },
      { k: "C", t: "Snel de logbestanden van je console wissen, zodat er geen verwarring over ontstaat.", r: "fout",
        uitleg: "Wie sporen wist, maakt de beoordeling onmogelijk en het lek groter. De feiten moeten juist bewaard blijven.",
        reactie: "Ik heb een kopie. Dit gaat ook in het log." }
    ]
  };

  var EXTRA_LOGIN = {
    id: "xl", extra: true, title: "Extra opdracht: verdachte inlog", who: "aria",
    intro: "Doorwerking uit level 4. Je klikte op een aanval van de Zwarte Nevel.",
    say: "Ik zie ook een verdachte inlog op jouw account, vanaf een onbekende locatie in de Zwarte Nevel. Mogelijk hangt dat samen met het bericht waar je in het vrachtdok op klikte.",
    opts: [
      { k: "A", t: "Het negeren tot het eerste lek helemaal is afgehandeld. Eén incident tegelijk, anders raakt het meldpunt het overzicht kwijt.", r: "fout",
        uitleg: "Een overgenomen account kan een tweede lek zijn. Het meldpunt moet dat meteen weten.",
        reactie: "Dan heeft de Zwarte Nevel nog steeds toegang tot jouw account." },
      { k: "B", t: "Direct je toegangscode laten wijzigen en ook dit bij ARIA melden, zodat beoordeeld wordt welke gegevens bereikbaar waren.", r: "goed",
        uitleg: "Eerst de toegang dichtzetten en dan melden. Het meldpunt zoekt uit of er ook via dit account gegevens zijn weggelekt.",
        reactie: "Je toegangscode is gewijzigd. Ik neem dit mee als tweede incident." },
      { k: "C", t: "Alleen je toegangscode wijzigen. Daarmee is het probleem opgelost, dus verder hoeft niemand het te weten.", r: "half",
        uitleg: "Wijzigen is goed, maar het meldpunt moet beoordelen of er gegevens zijn ingezien. Ook dat meld je.",
        reactie: "Je account is weer dicht. Maar wat heeft de Zwarte Nevel al gezien?" }
    ]
  };

  var S2 = {
    id: "s2", title: "Schade beperken", who: "aria",
    say: "Het bericht is net bij Kepler-4 aangekomen. Wat doe je om de schade te beperken?",
    opts: [
      { k: "A", t: "Het bericht terughalen via het systeem en er verder niets mee doen. Dan is het weg bij Kepler-4.", r: "half",
        uitleg: "Terughalen werkt lang niet altijd buiten het eigen station.",
        reactie: "Terughalen mislukt. Het bericht staat nog in het systeem van Kepler-4." },
      { k: "B", t: "Kepler-4 oproepen, vragen het bericht en eventuele kopieën te wissen en dat schriftelijk te bevestigen.", r: "goed",
        uitleg: "Zo beperk je het lek en heb je bewijs dat de gegevens weg zijn. Die bevestiging gaat ook in het log.",
        reactie: "Kepler-4 bevestigt schriftelijk dat het bericht en de kopieën zijn gewist." },
      { k: "C", t: "Niets doen. Kepler-4 is een bevriende kolonie, dus daar gaan ze er zorgvuldig mee om en wissen ze het zelf wel.", r: "fout",
        uitleg: "Ook bij een bevriende kolonie horen deze gegevens niet. Zolang ze daar staan, blijft het lek open.",
        reactie: "Het ziekteoverzicht staat nog steeds bij Kepler-4." }
    ]
  };

  var LOG = {
    id: "s3", type: "log", title: "Het incidentlog", who: "aria",
    say: "Het meldpunt wacht op het log. Je hebt " + 90 + " seconden. Kies bij elk stuk informatie of het erin hoort. Wat je niet op tijd kiest, telt als fout.",
    seconds: 90,
    rows: [
      { t: "Het tijdstip waarop het lek is ontdekt", ans: true, why: "Vanaf dat moment lopen de 72 uur." },
      { t: "Het tijdstip waarop het bericht is verstuurd", ans: true, why: "Dat kan eerder zijn dan de ontdekking. Het laat zien hoe lang de gegevens al ergens anders stonden." },
      { t: "Wie het bericht ontving: de kolonie Kepler-4", ans: true, why: "Het meldpunt moet weten bij wie de gegevens liggen om het risico te beoordelen." },
      { t: "De soorten gegevens: namen en dagen afwezigheid", ans: true, why: "Namen met ziektedagen wegen zwaarder dan bijvoorbeeld alleen een rooster." },
      { t: "Het aantal betrokken crewleden: 84", ans: true, why: "Bepaalt mee hoe groot het risico is." },
      { t: "Het bestand was niet versleuteld", ans: true, why: "Of een bestand versleuteld was, telt mee bij de beoordeling van het risico. Het meldpunt moet het dus weten." },
      { t: "De schriftelijke bevestiging van Kepler-4 dat alles is gewist", ans: true, why: "Een maatregel die al is genomen, met bewijs." },
      { t: "Een schermafbeelding van het verzonden bericht, als bewijs", ans: false, why: "Daarop staan de namen en ziektedagen. Zo zet je het lek nog een keer in een systeem. Omschrijf wat er verstuurd is." },
      { t: "De volledige lijst met namen, zodat het meldpunt kan zien wie het betreft", ans: false, why: "Het aantal en de soort gegevens zijn genoeg. Een kopie van het lek hoort niet in het log." },
      { t: "Dat Bram vaker slordig is met berichten", ans: false, why: "Dat is een oordeel over een persoon. In het log staan feiten, geen schuld." },
      { t: "Jouw inschatting dat het risico meevalt, omdat Kepler-4 een bevriende kolonie is", ans: false, why: "Het meldpunt beoordeelt het risico. In het log staan feiten, geen conclusies." },
      { t: "De diagnoses van de crewleden, zodat duidelijk is hoe gevoelig het is", ans: false, why: "Die stonden niet in het bericht. Je legt vast wat er gelekt is, en niets meer." }
    ],
    crystal: { name: "Feiten vastleggen", desc: "Wanneer, wat, bij wie, welke gegevens, hoeveel personen en welke maatregelen. Geen schuld, geen conclusies en geen kopie van de gegevens." }
  };

  var S4 = {
    id: "s4", title: "De oproep", who: { verwerker: "vega", verantwoordelijke: "tessa" },
    title2: { verwerker: "De kapitein roept op", verantwoordelijke: "Een crewlid roept op" },
    say: {
      verwerker: "Ik heb gehoord dat er iets mis is gegaan. Wat is er met de gegevens van mijn crew gebeurd?",
      verantwoordelijke: "Iedereen in de kantine heeft het erover. Staan mijn ziektedagen nu bij Kepler-4?"
    },
    opts: [
      { k: "A", t: "“Er is niets aan de hand.”", r: "fout",
        uitleg: "Ontkennen schaadt het vertrouwen nog meer, zeker als later blijkt dat er wel iets is gebeurd.",
        reactie: { verwerker: "Niets? Dat hoor ik anders. Ik bel de commandant.", verantwoordelijke: "Echt niet? Waarom fluistert iedereen dan?" } },
      { k: "B", t: { verwerker: "Eerlijk zeggen dat er een incident is, dat het met voorrang wordt behandeld en dat de juiste persoon vandaag contact opneemt.", verantwoordelijke: "Eerlijk zeggen dat er een incident is, dat het met voorrang wordt behandeld en dat het meldpunt haar vandaag laat weten wat het voor haar betekent." }, r: "goed",
        uitleg: "Je bent eerlijk zonder details te geven die nog niet vaststaan. De beoordeling ligt bij het meldpunt.",
        reactie: { verwerker: "Goed. Ik wacht op dat telefoontje. Vandaag nog.", verantwoordelijke: "Oké. Fijn dat je het gewoon zegt." } },
      { k: "C", t: "Uitgebreid speculeren over wat er misschien allemaal gebeurd is.", r: "fout",
        uitleg: "Geef geen informatie die nog niet vaststaat. Dat maakt de onrust groter en kan later niet kloppen.",
        reactie: { verwerker: "Misschien, misschien. Weet je het nou of niet?", verantwoordelijke: "Dus het kan nog veel erger zijn? Nu maak ik me pas echt zorgen." } }
    ]
  };

  var S5 = {
    id: "s5", title: "Wie meldt?", who: "aria",
    say: {
      verwerker: "We verwerken dit ziekteoverzicht in opdracht van Nova Terra. Wie meldt het lek bij de Toezichtraad?",
      verantwoordelijke: "Dit ziekteoverzicht gaat over onze eigen crew. Wie meldt het lek bij de Toezichtraad?"
    },
    opts: {
      verwerker: [
        { k: "A", t: "Orion meldt altijd zelf bij de Toezichtraad. Wij maakten de fout, dus wij zijn ook degene die het lek moet melden, wat onze rol ook is.", r: "fout",
          uitleg: "Dat hangt af van onze rol. Wie de fout maakte, bepaalt niet wie meldt.",
          reactie: "Dan meldt Orion iets wat Nova Terra had moeten beoordelen." },
        { k: "B", t: "Dat hangt af van onze rol. Verwerken we gegevens in opdracht, dan informeren we Nova Terra zonder onnodige vertraging en meldt Nova Terra. Gaat het om gegevens waarvoor wij zelf verantwoordelijk zijn, zoals die van onze eigen crew, dan melden we zelf.", r: "goed",
          uitleg: "Hier verwerkt Orion in opdracht. Dus informeren we Nova Terra meteen, en Nova Terra beslist over de melding.",
          reactie: "Juist. Ik zet de informatie voor Nova Terra klaar." },
        { k: "C", t: "Niemand hoeft te melden. Het was maar één bericht met één overzicht, dus dit telt niet als een datalek dat je moet melden.", r: "fout",
          uitleg: "Ook één bericht kan een datalek zijn. Dat beoordeelt het meldpunt, niet jij.",
          reactie: "Eén bericht met de ziektedagen van een hele crew." }
      ],
      verantwoordelijke: [
        { k: "A", t: "We informeren Nova Terra en die meldt het bij de Toezichtraad. Zo gaat het altijd bij een lek, wie de gegevens ook beheert.", r: "fout",
          uitleg: "Het gaat om de eigen crew van Orion. Dan is Orion zelf verantwoordelijk.",
          reactie: "Nova Terra heeft met deze gegevens niets te maken." },
        { k: "B", t: "Het gaat om onze eigen crew, dus Orion is zelf verantwoordelijk. Het meldpunt beoordeelt het risico en meldt binnen 72 uur bij de Toezichtraad als er risico is.", r: "goed",
          uitleg: "Bij eigen verantwoordelijkheid meldt Orion zelf, en alleen als er een risico is. Het meldpunt maakt die afweging.",
          reactie: "Juist. Ik zet de melding klaar voor het meldpunt." },
        { k: "C", t: "Niemand hoeft te melden. Het was maar één bericht met één overzicht, dus dit telt niet als een datalek dat je moet melden.", r: "fout",
          uitleg: "Ook één bericht kan een datalek zijn. Dat beoordeelt het meldpunt, niet jij.",
          reactie: "Eén bericht met de ziektedagen van onze hele crew." }
      ]
    },
    crystal: { on: "B", name: "Verwerker of verantwoordelijke", desc: "Verwerk je in opdracht, dan informeer je direct de opdrachtgever. Ben je zelf verantwoordelijk, dan meldt het meldpunt binnen 72 uur als er risico is." }
  };

  /* ---------- Luchtsluis ---------- */
  var STEPS_OK = [
    "Direct melden bij het meldpunt.",
    "Het lek beperken, bijvoorbeeld de ontvanger laten wissen.",
    "De feiten vastleggen.",
    "Het meldpunt beoordeelt het risico voor de betrokkenen.",
    "Bij verwerking in opdracht de opdrachtgever direct informeren. Bij eigen verantwoordelijkheid binnen 72 uur melden bij de toezichthouder, als er een risico is.",
    "De betrokkenen informeren als er een hoog risico is.",
    "Het incident registreren in het interne datalekregister, ook als er niet gemeld hoeft te worden.",
    "Evalueren hoe het in de toekomst te voorkomen is."
  ];
  var CLUES = [
    { crystal: null, title: "Het begin", text: "Melden komt altijd eerst. Daarna pas beperk je het lek." },
    { crystal: "Feiten vastleggen", title: "Na het beperken", text: "Eerst beperken, dan de feiten vastleggen. Pas daarna kan het meldpunt het risico beoordelen." },
    { crystal: "Verwerker of verantwoordelijke", title: "Na de beoordeling", text: "Eerst de opdrachtgever of de toezichthouder, daarna de betrokkenen als het risico hoog is." },
    { crystal: null, title: "Het einde", text: "Registreren doe je altijd. Evalueren is de laatste stap." }
  ];
  var LOCK_SECONDS = 300;

  var RULES = [
    "Een datalek meld je direct, ook aan het eind van je dienst.",
    "Eerst schade beperken en feiten vastleggen, daarna pas oordelen.",
    "Wees eerlijk tegen opdrachtgevers en laat de beoordeling over aan het meldpunt."
  ];
  /* Antwoorden staan per poging in een andere volgorde. De letter volgt de plek op het scherm, niet het antwoord. */
  function ordered(id, opts) {
    S.ord = S.ord || {};
    if (!S.ord[id]) { var a = opts.map(function (_, i) { return i; }); for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } S.ord[id] = a; }
    return S.ord[id].map(function (i) { return opts[i]; });
  }
  var POINTS = { goed: 10, half: 5, fout: 0 };
  var SHIELD_HIT = { goed: 0, half: 5, fout: 10 };

  var CRYSTALS_MAX = 2;   /* het incidentlog en de vraag wie meldt */
  var HINT_COST = 10;
  var STEPS = ["Briefing", "Dienst", "Luchtsluis", "Resultaat", "Terug op aarde"];
  var STEP_OF = { brief: 0, incident: 1, sit: 1, lock: 2, debrief: 3, earth: 4 };

  /* ---------- State ---------- */
  var S, timer = null, runs = 0;
  function shuffled() {
    var a = STEPS_OK.map(function (_, i) { return i; });
    do {
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    } while (a.filter(function (v, i) { return v === i; }).length > 2);
    return a;
  }
  function fresh(role, flags) {
    return { screen: "brief", role: role || "verwerker", flags: flags || { console: false, login: false },
      seq: [], sit: 0, shield: 100, score: 0, bonus: 0, hours: 72, crystals: [], picks: {}, shownAt: 0,
      log: { assign: {}, done: false },
      lock: { started: false, order: shuffled(), attempts: 0, firstCorrect: null, solved: false, revealed: false, left: LOCK_SECONDS, timeout: false, given: 0, paid: {}, wrong: {}, msg: null, timeBonus: 0 } };
  }
  S = fresh();

  var stage = document.getElementById("stage");
  var hudEl = document.getElementById("hud");

  function buildSeq() {
    var seq = [S1];
    if (S.flags.console) seq.push(EXTRA_CONSOLE);
    if (S.flags.login) seq.push(EXTRA_LOGIN);
    S.seq = seq.concat([S2, LOG, S4, S5]);
  }
  function maxBase() { return S.seq.length * 10 + STEPS_OK.length; }
  function hit(n) { S.shield = Math.max(0, S.shield - n); }
  function spend(h) { S.hours = Math.max(0, S.hours - h); }
  function hasCrystal(n) { return S.crystals.indexOf(n) !== -1; }
  function val(x) { return x && typeof x === "object" && !Array.isArray(x) && ("verwerker" in x) ? V(x) : x; }
  function pctNow() { return Math.round(S.score / maxBase() * 100); }
  function passMark() { var m = maxBase(); for (var p = 0; p <= m; p++) if (Math.round(p / m * 100) >= 70) return p; return m; }
  function shieldTone(sh) { return sh >= 80 ? "ok" : (sh >= 50 ? "warn" : "bad"); }
  function chip(text, tone, ic) { return '<span class="ox-chip' + (tone ? " " + tone : "") + '">' + (ic ? icon(ic) : "") + text + "</span>"; }
  function row(ic, tone, text) { return '<li><span class="ic ' + tone + '">' + icon(ic) + "</span><span>" + text + "</span></li>"; }

  /* De schil leest hier de stand van het level uit. */
  window.orionStatus = function () {
    if (!S.seq.length) buildSeq();
    var done = S.screen === "debrief" || S.screen === "earth", pct = pctNow();
    return {
      score: S.score, max: maxBase(), shield: S.shield,
      crystals: S.crystals.length, crystalsMax: CRYSTALS_MAX,
      steps: STEPS.slice(), step: STEP_OF[S.screen] || 0,
      done: done, passed: done ? pct >= 70 : null, pct: done ? pct : null
    };
  };

  /* Smalle regel bovenaan zolang het alarm loopt. Rustig beeld: rood, zonder knipperen. De klok van 72 uur staat erin. */
  var alarmHtml = null;
  function alarm() {
    var a = document.getElementById("alarm");
    var sealed = S.lock.solved || S.lock.revealed;
    var puzzle = S.screen === "lock" && S.lock.started && !sealed;
    var on = (S.screen === "incident" || S.screen === "sit" || S.screen === "lock") && !puzzle;
    a.hidden = !on;
    if (!on) { alarmHtml = null; return; }
    var html = sealed
      ? icon("shieldok") + '<span class="al-txt">Lek gedicht. Het alarm is uit.</span>'
      : icon("warn") + '<span class="al-txt">Alarm loopt. Het lek staat open.</span>' +
        '<span class="al-klok' + (S.hours <= 24 ? " low" : "") + '">' + icon("clock") + "Nog " + S.hours + " van de 72 uur</span>";
    if (html === alarmHtml) return;
    alarmHtml = html;
    a.className = "alarmline" + (sealed ? " off" : "");
    a.innerHTML = html;
  }

  /* Eigen statusrij en stappenbalk (.own-status). In de schil neemt de schil dit over. */
  function hud() {
    if (!S.seq.length) buildSeq();
    alarm();
    var cur = STEP_OF[S.screen] || 0, max = maxBase();
    var steps = STEPS.map(function (s, i) {
      var cls = i < cur ? "done" : (i === cur ? "now" : "");
      return '<li class="' + cls + '"' + (i === cur ? ' aria-current="step"' : "") + '><span class="bar" aria-hidden="true"></span><span>' + s + (i < cur ? '<span class="vcsw-sr-only"> (afgerond)</span>' : "") + "</span></li>";
    }).join("");
    var pips = "";
    for (var i = 0; i < CRYSTALS_MAX; i++) pips += '<span class="pip' + (i < S.crystals.length ? " on" : "") + '"></span>';
    hudEl.innerHTML =
      '<ol class="ox-steps">' + steps + "</ol>" +
      '<div class="ox-meters">' +
      '<div class="ox-meter"><div class="top">' + icon("target") + "<span>Score</span><b>" + S.score + " van " + max + "</b></div>" +
      '<div class="track"><div class="fill" style="width:' + Math.min(100, S.score / max * 100) + '%"></div><span class="mark"></span></div>' +
      '<span class="note">Gehaald vanaf ' + passMark() + " punten" + (S.bonus ? ". Bonus " + S.bonus : "") + "</span></div>" +
      '<div class="ox-meter"><div class="top">' + icon("shield") + "<span>Schild</span><b>" + S.shield + "%</b></div>" +
      '<div class="track" role="progressbar" aria-label="Schild" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + S.shield + '"><div class="fill ' + shieldTone(S.shield) + '" style="width:' + S.shield + '%"></div></div>' +
      '<span class="note">Elke fout kost schild</span></div>' +
      '<div class="ox-meter narrow"><div class="top">' + icon("gem") + "<span>Kristallen</span><b>" + S.crystals.length + " van " + CRYSTALS_MAX + "</b></div>" +
      '<div class="pips" aria-hidden="true">' + pips + "</div>" +
      '<span class="note">Klok: ' + S.hours + " uur</span></div>" +
      "</div>";
  }

  function show(html, cls) {
    stage.innerHTML = '<div class="screen' + (cls ? " " + cls : "") + '" tabindex="-1">' + html + "</div>";
    hud();
    var sc = stage.querySelector(".screen");
    if (sc && document.activeElement && document.activeElement !== document.body) sc.focus({ preventScroll: true });
  }

  function verdictBadge(r, extra) {
    var b = r === "goed" ? '<span class="vcsw-badge success">' + icon("check") + "Goed, +10</span>"
      : r === "half" ? '<span class="vcsw-badge warning">Half goed, +5</span>'
      : '<span class="vcsw-badge danger">Fout, 0 punten</span>';
    return b + (extra || "");
  }
  function alertBox(kind, ic, title, text) {
    return '<div class="vcsw-alert ' + kind + '">' + icon(ic) + '<div><p class="vcsw-alert-title">' + title + '</p><p class="vcsw-alert-text">' + text + "</p></div></div>";
  }
  function reward(ic, title, text, tone) {
    return '<div class="ox-reward' + (tone ? " " + tone : "") + '">' + icon(ic) + '<div><p class="ox-reward-title">' + title + "</p><p>" + text + "</p></div></div>";
  }
  function dienstChip(s) {
    return chip(s.extra ? "Extra opdracht" : "Dienst " + S.seq.slice(0, S.sit + 1).filter(function (x) { return !x.extra; }).length + " van " + S.seq.filter(function (x) { return !x.extra; }).length);
  }

  /* ---------- Schermen ---------- */
  function renderBrief() {
    show(
      '<div class="screen-head"><div class="ox-chips">' + chip("Level 5") + chip("Briefing", "neutral") + "</div><h1>Alarm in module Kepler</h1></div>" +
      '<p class="lead">Je leert een datalek direct te melden, de schade te beperken en de feiten vast te leggen, omdat er een harde deadline van 72 uur geldt.</p>' +
      speech("aria", "Alarm. Er is een lek in onze datasystemen. Gevoelige gegevens lekken het station uit. Vanaf nu loopt de klok. Binnen 72 uur moet de Galactische Toezichtraad het weten als er risico is. Elke minuut die je wacht, maakt het erger.") +
      '<dl class="vcsw-dl" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">' +
      "<div><dt>De klok</dt><dd>Bovenin loopt een klok van 72 uur. Elke keuze kost speltijd, een foute keuze veel meer dan een goede.</dd></div>" +
      "<div><dt>Snel en goed</dt><dd>Kies je binnen " + FAST + " seconden het goede antwoord, dan krijg je " + FAST_BONUS + " bonuspunten.</dd></div>" +
      "<div><dt>Gehaald</dt><dd>Bij minimaal 70 procent van de punten blijf je Kapitein en verdien je de badge Lekbestendig.</dd></div></dl>" +
      '<div class="setup"><p class="muted">Alleen voor dit prototype. In de echte game onthoudt het spel je keuzes uit eerdere levels en wisselt het de rol van Orion bij herspelen.</p>' +
      '<fieldset><legend>Doorwerking uit eerdere levels</legend>' +
      '<label><input type="checkbox" id="fConsole"' + (S.flags.console ? " checked" : "") + '> In level 1 liet ik mijn console ontgrendeld achter</label>' +
      '<label><input type="checkbox" id="fLogin"' + (S.flags.login ? " checked" : "") + '> In level 4 klikte ik op een aanval van de Zwarte Nevel</label></fieldset>' +
      '<fieldset><legend>Rol van Orion</legend>' +
      '<label><input type="radio" name="role" value="verwerker"' + (S.role === "verwerker" ? " checked" : "") + '> Verwerker: het ziekteoverzicht is van de crew van Nova Terra</label>' +
      '<label><input type="radio" name="role" value="verantwoordelijke"' + (S.role === "verantwoordelijke" ? " checked" : "") + '> Verantwoordelijke: het ziekteoverzicht is van de eigen crew van Orion</label></fieldset></div>' +
      '<div class="actions"><button type="button" class="ox-btn lg" id="go">Naar het incident' + icon("next") + "</button></div>" +
      '<p class="ox-foot">' + icon("info") + "<span><strong>Prototype met fictieve gegevens.</strong> Alle namen en gegevens zijn verzonnen. De stappen en termijnen bij een datalek wachten nog op goedkeuring van de Privacy Officer.</span></p>",
      "title-screen"
    );
    document.getElementById("fConsole").onchange = function (e) { S.flags.console = e.target.checked; S.seq = []; hud(); };
    document.getElementById("fLogin").onchange = function (e) { S.flags.login = e.target.checked; S.seq = []; hud(); };
    stage.querySelectorAll('input[name="role"]').forEach(function (r) { r.onchange = function () { S.role = r.value; }; });
    document.getElementById("go").onclick = function () { buildSeq(); S.screen = "incident"; render(); };
  }

  function renderIncident() {
    var html = '<div class="screen-head"><h2>Een bericht naar de verkeerde kolonie</h2></div>' +
      "<p>" + esc(V(INCIDENT)) + "</p>" +
      speech("bram", "Ik wilde het naar de scheepsarts sturen, maar Kepler-4 stond er net boven in de lijst. Het is één klik. Zo erg is het toch niet?");
    if (S.flags.console) html += alertBox("warning", "bell", "Doorwerking uit level 1", "ARIA ziet dat het bericht vanaf jouw console is verstuurd. Dat levert een extra opdracht op.");
    if (S.flags.login) html += alertBox("warning", "bell", "Doorwerking uit level 4", "ARIA meldt daarnaast een verdachte inlog op jouw account. Dat levert een extra opdracht op.");
    html += '<div class="actions"><button type="button" class="ox-btn lg" id="go">Begin de dienst' + icon("next") + "</button></div>";
    show(html);
    document.getElementById("go").onclick = function () { S.screen = "sit"; S.sit = 0; render(); };
  }

  function renderSit() {
    var s = S.seq[S.sit];
    if (s.type === "log") return renderLog(s);
    var pick = S.picks[s.id], opts = val(s.opts), who = val(s.who);
    var html = '<div class="screen-head rij"><h2>' + esc(s.title2 ? V(s.title2) : s.title) + "</h2>" + dienstChip(s) + "</div>";
    if (s.intro) html += '<p class="muted">' + esc(s.intro) + "</p>";
    html += speech(who, val(s.say));
    html += '<div class="options" role="group" aria-label="Kies je antwoord">';
    ordered(s.id, opts).forEach(function (o, n) {
      var cls = "option" + (pick ? (pick.k === o.k ? " picked" : " dim") : "");
      var extra = pick && pick.k === o.k ? '<span class="vcsw-badge neutral">' + icon("clock") + "min " + pick.cost + " uur</span>" + (pick.fast ? '<span class="vcsw-badge">' + icon("zap") + "Snel, +" + FAST_BONUS + " bonus</span>" : "") : "";
      html += '<button type="button" class="' + cls + '" data-k="' + o.k + '"' + (pick ? " disabled" : "") + '><span class="key" aria-hidden="true">' + "ABC"[n] + '</span><span><span class="vcsw-sr-only">Optie ' + "ABC"[n] + ". </span>" + esc(val(o.t)) +
        (pick && pick.k === o.k ? '<span class="verdict">' + verdictBadge(o.r, extra) + "</span>" : "") + "</span></button>";
    });
    html += "</div>";
    if (pick) {
      var o = opts.filter(function (x) { return x.k === pick.k; })[0];
      html += '<div class="feedback">' + speech(who, val(o.reactie)) +
        speech("aria", (o.r === "goed" ? "Goed. " : o.r === "half" ? "Half goed. " : "Fout. ") + o.uitleg);
      if (s.crystal && s.crystal.on === pick.k) {
        html += reward("gem", "Datakristal " + esc(s.crystal.name), esc(s.crystal.desc));
      } else if (s.crystal) {
        html += '<p class="muted">Geen datakristal bij deze keuze. Elk kristal is in de luchtsluis één aanwijzing zonder kosten.</p>';
      }
      html += '</div><div class="actions"><button type="button" class="ox-btn lg" id="next">' + nextLabel() + icon("next") + "</button></div>";
    }
    show(html);
    if (!pick) {
      S.shownAt = Date.now();
      stage.querySelectorAll(".option").forEach(function (b) { b.onclick = function () { choose(b.getAttribute("data-k")); }; });
    } else {
      document.getElementById("next").onclick = advance;
    }
  }
  function nextLabel() { return S.sit < S.seq.length - 1 ? "Volgende situatie" : "Naar de luchtsluis"; }
  function advance() {
    if (S.sit < S.seq.length - 1) { S.sit++; } else { S.screen = "lock"; }
    render();
  }

  function choose(k) {
    var s = S.seq[S.sit], o = val(s.opts).filter(function (x) { return x.k === k; })[0];
    var cost = o.cost || COST[o.r];
    var fast = o.r === "goed" && (Date.now() - S.shownAt) / 1000 <= FAST;
    S.picks[s.id] = { k: k, r: o.r, cost: cost, fast: fast };
    S.score += POINTS[o.r];
    if (fast) S.bonus += FAST_BONUS;
    hit(SHIELD_HIT[o.r]);
    spend(cost);
    if (s.crystal && s.crystal.on === k && !hasCrystal(s.crystal.name)) S.crystals.push(s.crystal.name);
    render();
  }

  /* Incidentlog: getimed, met strikvragen in willekeurige volgorde */
  var logTimer = null;
  function stopLogTimer() { if (logTimer) { clearInterval(logTimer); logTimer = null; } }
  function logTone(left) { return left <= 20 ? " bad" : left <= 45 ? " gold" : ""; }
  function startLogTimer(s) {
    stopLogTimer();
    logTimer = setInterval(function () {
      var L = S.log;
      if (S.screen !== "sit" || S.seq[S.sit] !== s || L.done) return stopLogTimer();
      L.left = Math.max(0, L.left - 1);
      var t = document.getElementById("logTimer");
      if (t) {
        t.querySelector("span").textContent = fmt(L.left);
        t.classList.toggle("low", L.left <= 20);
        var bar = document.getElementById("logBar");
        if (bar) { bar.style.width = (L.left / s.seconds * 100) + "%"; bar.className = "fill" + logTone(L.left); }
      }
      if (L.left === 0) { L.timeout = true; saveLog(s); }
    }, 1000);
  }
  function saveLog(s) {
    var L = S.log;
    if (L.done) return;
    stopLogTimer();
    var good = s.rows.filter(function (r, i) { return L.assign[i] === r.ans; }).length;
    var n = s.rows.length;
    var r = good === n ? "goed" : good >= n - 2 ? "half" : "fout";
    var fast = r === "goed" && L.left >= 30;
    L.done = true;
    S.picks[s.id] = { r: r, cost: COST[r] + (L.timeout ? 4 : 0), fast: fast, good: good, total: n, timeout: L.timeout };
    S.score += POINTS[r];
    if (fast) S.bonus += FAST_BONUS;
    hit(SHIELD_HIT[r]);
    spend(S.picks[s.id].cost);
    if (r === "goed" && !hasCrystal(s.crystal.name)) S.crystals.push(s.crystal.name);
    render();
  }
  function renderLog(s) {
    var L = S.log, done = L.done, n = s.rows.length;
    if (!L.order) {
      L.order = s.rows.map(function (_, i) { return i; });
      for (var k = n - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var t = L.order[k]; L.order[k] = L.order[j]; L.order[j] = t; }
      L.left = s.seconds;
    }
    var html = '<div class="screen-head rij"><h2>' + esc(s.title) + "</h2>" + dienstChip(s) + "</div>" +
      speech("aria", s.say);
    var filledN = Object.keys(L.assign).length;
    /* Tijdbalk: titel, teller en klok op één basislijn, de balk eronder over de volle breedte. */
    html += '<div class="ox-card tijdbalk"><div class="tijd-rij"><h3>Tijd voor het log</h3><span class="tijd-n">' + filledN + " van " + n + " gekozen</span>" +
      '<span class="ox-clock timer' + (L.left <= 20 ? " low" : "") + '" id="logTimer" aria-label="Resterende tijd">' + icon("clock") + "<span>" + fmt(L.left) + "</span></span></div>" +
      '<div class="track"><div class="fill' + logTone(L.left) + '" id="logBar" style="width:' + (L.left / s.seconds * 100) + '%"></div></div></div>';
    html += '<div class="logrows">';
    L.order.forEach(function (i) {
      var r = s.rows[i], a = L.assign[i], wrong = done && a !== r.ans;
      html += '<div class="logrow' + (wrong ? " wrong" : "") + '"><span class="what">' + esc(r.t) + "</span>" +
        '<div class="vcsw-segmented" role="group" aria-label="In het log: ' + esc(r.t) + '">' +
        '<button type="button" data-r="' + i + '" data-v="1" aria-pressed="' + (a === true) + '"' + (done ? " disabled" : "") + ">Ja, in het log</button>" +
        '<button type="button" data-r="' + i + '" data-v="0" aria-pressed="' + (a === false) + '"' + (done ? " disabled" : "") + ">Nee</button></div>";
      if (done) html += '<p class="note">' + (wrong ? '<strong class="is-bad">' + icon("cross") + (a === undefined ? "Niet op tijd gekozen." : "Niet goed.") + " Juist: " + (r.ans ? "wel" : "niet") + " in het log.</strong> " : '<strong class="is-good">' + icon("check") + "Goed.</strong> ") + esc(r.why) + "</p>";
      html += "</div>";
    });
    html += "</div>";
    if (!done) {
      html += '<div class="actions"><button type="button" class="ox-btn lg" id="save">Log opslaan' + icon("check") + "</button>" +
        (filledN < n ? '<span class="muted">Nog ' + (n - filledN) + " regels zonder keuze. Die tellen als fout.</span>" : "") + "</div>";
    } else {
      var p = S.picks[s.id];
      html += '<div class="feedback">';
      if (p.timeout) html += alertBox("warning", "warn", "De tijd is op", "Het log is opgeslagen zoals het was. Dat kost 4 extra uur op de klok.");
      html += '<div class="verdict" style="display:flex;flex-wrap:wrap;gap:6px">' + verdictBadge(p.r, '<span class="vcsw-badge neutral">' + p.good + " van " + p.total + ' goed</span><span class="vcsw-badge neutral">' + icon("clock") + "min " + p.cost + " uur</span>" + (p.fast ? '<span class="vcsw-badge">' + icon("zap") + "Snel, +" + FAST_BONUS + " bonus</span>" : "")) + "</div>" +
        speech("aria", p.r === "goed" ? "Een helder log. Alleen feiten, geen schuld, geen conclusies en geen kopie van het lek." : p.r === "half" ? "Bijna goed. Kijk nog eens naar de regels die rood zijn." : "Dit log helpt het meldpunt nog niet. Kijk naar de regels die rood zijn.");
      if (p.r === "goed") html += reward("gem", "Datakristal " + esc(s.crystal.name), esc(s.crystal.desc));
      else html += '<p class="muted">Het datakristal ' + esc(s.crystal.name) + " krijg je alleen als alles goed is. Elk kristal is in de luchtsluis één aanwijzing zonder kosten.</p>";
      html += '</div><div class="actions"><button type="button" class="ox-btn lg" id="next">' + nextLabel() + icon("next") + "</button></div>";
    }
    show(html);
    if (!done) {
      if (!logTimer) startLogTimer(s);
      stage.querySelectorAll("[data-r]").forEach(function (b) {
        b.onclick = function () {
          var i = b.getAttribute("data-r");
          L.assign[i] = b.getAttribute("data-v") === "1";
          render();
          var again = stage.querySelector('[data-r="' + i + '"][data-v="' + (L.assign[i] ? "1" : "0") + '"]');
          if (again) again.focus({ preventScroll: true });
        };
      });
      document.getElementById("save").onclick = function () { saveLog(s); };
    } else {
      document.getElementById("next").onclick = advance;
    }
  }

  /* ---------- Luchtsluis: tegen de klok ---------- */
  function startTimer() {
    stopTimer();
    timer = setInterval(function () {
      if (S.screen !== "lock" || !S.lock.started || S.lock.solved || S.lock.revealed) return stopTimer();
      S.lock.left = Math.max(0, S.lock.left - 1);
      var t = document.getElementById("timer");
      if (t) { t.querySelector("span").textContent = fmt(S.lock.left); t.classList.toggle("low", S.lock.left <= 60); }
      if (S.lock.left === 0 && !S.lock.timeout) { S.lock.timeout = true; hit(10); S.lock.msg = "timeout"; stopTimer(); render(); }
    }, 1000);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function fmt(n) { return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0"); }

  /* Startkaart: doel, hoe je scoort, wat een fout kost, en één startknop. */
  function renderLockIntro() {
    var n = S.crystals.length, min = Math.floor(LOCK_SECONDS / 60);
    show(
      '<div class="screen-head"><div class="ox-chips">' + chip("Luchtsluis") + chip(min + " minuten", "", "clock") + chip("Hoort bij level 5", "neutral") + "</div><h2>Tegen de klok</h2></div>" +
      '<p class="ox-lead">Zet de acht stappen bij een datalek in de juiste volgorde en dicht het lek.</p>' +
      '<div class="ox-card intro-demo">' + speech("aria", "Acht stappen zweven door elkaar. Zet ze zo snel mogelijk in de juiste volgorde om het lek te dichten. Hoe meer tijd er over is, hoe hoger je bonus.") + "</div>" +
      '<div class="ox-two">' +
      '<div class="ox-card"><h3>Zo scoor je</h3><ul class="ox-rows">' +
      row("check", "green", "Elke stap die bij je eerste poging op de goede plek staat, levert 1 punt op.") +
      row("zap", "gold", "Hoe meer tijd er over is, hoe hoger je bonus.") +
      row("shield", "red", "Elke nieuwe poging kost 5 procent schild.") +
      "</ul></div>" +
      '<div class="ox-card"><h3>Goed om te weten</h3><ul class="ox-rows">' +
      row("clock", "blue", "Je hebt " + min + " minuten. Is de tijd op, dan verliest je schild 10 procent en vervalt de tijdbonus.") +
      row("gem", "gold", "Elk kristal uit dit level is één aanwijzing van ARIA zonder kosten. Je hebt er " + n + ".") +
      row("bulb", "blue", "Daarna kost een aanwijzing " + HINT_COST + " procent schild.") +
      "</ul></div></div>" +
      '<div class="actions"><button type="button" class="ox-btn lg" id="go">Start de klok' + icon("next") + "</button></div>",
      "ox-stack"
    );
    document.getElementById("go").onclick = function () { S.lock.started = true; startTimer(); render(); };
  }

  function renderLock() {
    var L = S.lock, done = L.solved || L.revealed;
    if (!L.started) return renderLockIntro();
    var have = S.crystals.length, usedFree = Math.min(L.given, have), left = CLUES.length - L.given, free = L.given < have;
    var nWrong = Object.keys(L.wrong).length;
    var state = L.solved ? chip("Het lek is gedicht", "ok", "check")
      : L.revealed ? chip("Oplossing getoond", "neutral", "eye")
      : L.msg === "wrong" ? chip(nWrong + (nWrong === 1 ? " stap staat" : " stappen staan") + " niet goed", "bad", "cross")
      : chip("Volgorde nog niet gecontroleerd", "", "check");
    var html = '<div class="sluis-top"><h2>Tegen de klok</h2>' + state + chip("Schild " + S.shield + "%", shieldTone(S.shield), "shield") +
      '<span class="ox-clock timer' + (L.left <= 60 ? " low" : "") + '" id="timer" aria-label="Resterende tijd">' + icon("clock") + "<span>" + fmt(L.left) + "</span></span></div>";

    /* Links: de stappen met pijlen */
    var order = L.revealed ? STEPS_OK.map(function (_, i) { return i; }) : L.order;
    html += '<div class="sluis-grid"><div class="sluis-links"><h3 id="stapKop">Zet de stappen in de juiste volgorde</h3><ol class="stappen" aria-labelledby="stapKop">';
    order.forEach(function (stepIdx, pos) {
      var wrong = !done && L.wrong[pos], right = done;
      html += '<li class="stap' + (wrong ? " wrong" : right ? " right" : "") + '"><span class="nr" aria-hidden="true">' + (pos + 1) + (wrong ? icon("cross") : "") + '</span><span class="txt"><span class="vcsw-sr-only">Plek ' + (pos + 1) + ". </span>" + esc(STEPS_OK[stepIdx]) +
        (wrong ? '<span class="vcsw-sr-only"> Staat niet op de goede plek.</span>' : "") + "</span>";
      if (!done) {
        html += '<span class="move"><button type="button" data-mv="' + pos + '" data-dir="-1" aria-label="Omhoog: ' + esc(STEPS_OK[stepIdx]) + '"' + (pos === 0 ? " disabled" : "") + ">" + icon("up") + "</button>" +
          '<button type="button" data-mv="' + pos + '" data-dir="1" aria-label="Omlaag: ' + esc(STEPS_OK[stepIdx]) + '"' + (pos === order.length - 1 ? " disabled" : "") + ">" + icon("down") + "</button></span>";
      } else html += '<span class="goed">' + icon("check") + "</span>";
      html += "</li>";
    });
    html += '</ol><div class="actions">';
    if (!done) {
      html += '<button type="button" class="ox-btn" id="check">Lek dichten' + icon("unlock") + "</button>";
      if (L.attempts >= 2) html += '<button type="button" class="ox-btn ghost" id="reveal">Toon de oplossing' + icon("eye") + "</button>";
    } else {
      html += '<button type="button" class="ox-btn" id="toDebrief">Naar de debriefing' + icon("next") + "</button>";
    }
    var meld = "";
    if (L.msg === "timeout") meld += alertBox("warning", "warn", "De tijd is op", "Je schild verliest 10 procent en er is geen tijdbonus meer. Maak de sluis gewoon af.");
    if (L.msg === "wrong") meld += alertBox("error", "bad", nWrong + (nWrong === 1 ? " stap staat" : " stappen staan") + " niet op de goede plek", "De stappen met een kruis staan niet goed. Een nieuwe poging kost 5 procent schild. Kijk nog eens naar de aanwijzingen.");
    if (L.solved) meld += alertBox("success", "ok", "Het lek is gedicht. De sluis gaat open.", "Tijdbonus " + L.timeBonus + " punten voor de resterende tijd van " + fmt(L.left) + ".");
    if (L.revealed) meld += alertBox("info", "eye", "Oplossing getoond", "De stappen staan in de juiste volgorde. De sluis is handmatig geopend, zonder tijdbonus.");
    html += "</div>" + (done ? "" : '<div class="sluis-meld">' + meld + "</div>") + "</div>";

    /* Rechts: het blok van ARIA met de teller, daaronder de aanwijzingen als tekstballonnen */
    var gems = "";
    for (var g = 0; g < have; g++) gems += '<span class="gem' + (g < usedFree ? " used" : "") + '">' + icon("gem") + "</span>";
    var earned = have === 0 ? "Je verdiende geen kristallen in dit level." : "Je verdiende " + have + (have === 1 ? " kristal" : " kristallen") + " in dit level.";
    var cost = done ? "" : left === 0 ? chip("Alle aanwijzingen zijn gegeven", "neutral")
      : free ? chip("De volgende is zonder kosten", "ok", "gem")
      : chip("De volgende kost " + HINT_COST + " procent schild", "warn", "shield");
    html += '<div class="sluis-rechts"><div class="ox-card aw-blok"><div class="aw-kop"><h3>Aanwijzingen van ARIA</h3>' +
      '<span class="aw-gems">' + gems + "<span>" + (have ? usedFree + " van " + have + " gebruikt" : "Geen kristallen") + "</span></span></div>" +
      "<p>" + earned + " Elk kristal is één aanwijzing zonder kosten. Daarna kost een aanwijzing " + HINT_COST + " procent schild.</p>" +
      '<div class="aw-knop"><button type="button" class="ox-btn" id="hint"' + (done || left === 0 ? " disabled" : "") + ">Vraag ARIA om een aanwijzing" + icon("bulb") + "</button>" + cost + "</div></div>";
    if (done) html += '<div class="sluis-meld">' + meld + "</div>";
    html += '<div class="aw-list">';
    for (var c = 0; c < L.given; c++) {
      html += '<div class="ox-card aw-bubble">' + speech("aria", CLUES[c].text, chip(L.paid[c] ? "Kostte " + HINT_COST + " procent schild" : "Zonder kosten", L.paid[c] ? "warn" : "gold", L.paid[c] ? "shield" : "gem")) + "</div>";
    }
    html += "</div></div></div>";
    show(html, "sluis");

    stage.querySelectorAll("[data-mv]").forEach(function (b) {
      b.onclick = function () {
        var p = +b.getAttribute("data-mv"), d = +b.getAttribute("data-dir"), q = p + d;
        var o = L.order, t = o[p]; o[p] = o[q]; o[q] = t;
        L.wrong = {}; if (L.msg === "wrong") L.msg = null;
        render();
        var again = stage.querySelector('[data-mv="' + q + '"][data-dir="' + d + '"]:not([disabled])') || stage.querySelector('[data-mv="' + q + '"]:not([disabled])');
        if (again) again.focus({ preventScroll: true });
      };
    });
    /* Eén prijs: elk kristal uit dit level is één aanwijzing zonder kosten, daarna 10 procent schild. Vaste volgorde. */
    var h = document.getElementById("hint");
    if (h) h.onclick = function () {
      if (done || L.given >= CLUES.length) return;
      var isFree = L.given < S.crystals.length;
      if (!isFree) { hit(HINT_COST); L.paid[L.given] = true; }
      L.given++;
      render();
      var again = document.getElementById("hint");
      if (again) again.focus({ preventScroll: true });
      var last = stage.querySelector(".aw-list .aw-bubble:last-child");
      var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (last && last.scrollIntoView) last.scrollIntoView({ block: "nearest", behavior: calm ? "auto" : "smooth" });
    };
    var c = document.getElementById("check");
    if (c) c.onclick = checkLock;
    var r = document.getElementById("reveal");
    if (r) r.onclick = function () { L.revealed = true; L.msg = null; L.wrong = {}; stopTimer(); render(); };
    var t = document.getElementById("toDebrief");
    if (t) t.onclick = function () { S.screen = "debrief"; render(); };
  }

  function checkLock() {
    var L = S.lock, wrong = {}, correct = 0;
    L.order.forEach(function (stepIdx, pos) { if (stepIdx === pos) correct++; else wrong[pos] = true; });
    if (L.firstCorrect === null) { L.firstCorrect = correct; S.score += correct; }
    else hit(5);
    L.attempts++;
    if (correct === STEPS_OK.length) {
      L.solved = true; L.wrong = {}; L.msg = null; stopTimer();
      L.timeBonus = L.timeout ? 0 : Math.ceil(L.left / 30);
      S.bonus += L.timeBonus;
    } else { L.wrong = wrong; L.msg = "wrong"; }
    render();
    var again = document.getElementById("check") || document.getElementById("toDebrief");
    if (again) again.focus({ preventScroll: true });
    var meld = stage.querySelector(".sluis-meld"), calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (meld && meld.scrollIntoView) meld.scrollIntoView({ block: "nearest", behavior: calm ? "auto" : "smooth" });
  }

  function renderDebrief() {
    var MAX = maxBase(), pct = pctNow(), passed = pct >= 70;
    var html = '<div class="screen-head"><h2>' + (passed ? "Level gehaald. Je blijft Kapitein." : "Nog niet gehaald") + "</h2></div>";
    if (passed) html += '<p class="badge-regel">' + chip("Badge Lekbestendig", "ok", "shieldok") + "<span>Je weet wat je doet als er gegevens het station uit lekken.</span></p>";
    html += '<dl class="ox-card kpis"><div><dt>Score</dt><dd>' + pct + "%</dd><dd class=\"note\">" + S.score + " van " + MAX + " punten</dd></div>" +
      "<div><dt>Bonus</dt><dd>+" + S.bonus + '</dd><dd class="note">voor snelheid en tijd</dd></div>' +
      "<div><dt>Klok</dt><dd>" + S.hours + ' uur</dd><dd class="note">over van de 72</dd></div>' +
      "<div><dt>Schildsterkte</dt><dd>" + S.shield + '%</dd><dd class="note">vertrouwen aan boord</dd></div></dl>';

    html += speech("aria", passed
      ? "Goed werk, Kapitein. Je hebt direct gemeld, de schade beperkt en de feiten vastgelegd. Precies in die volgorde."
      : "Je hebt minder dan 70 procent. Speel de dienst opnieuw. In de echte game krijg je dan andere situaties.");

    html += '<div class="ox-two keuzes"><div class="ox-card"><h3>Jouw keuzes</h3><ul class="result-list">';
    S.seq.forEach(function (s, i) {
      var p = S.picks[s.id];
      var label = s.title2 ? V(s.title2) : s.title;
      html += "<li><span>" + (i + 1) + ". " + esc(label) + (p.k ? ' <span class="sub">(' + p.k + ")</span>" : ' <span class="sub">(' + p.good + " van " + p.total + " goed)</span>") + '</span><span class="oordeel">' + verdictBadge(p.r) + "</span></li>";
    });
    var lc = S.lock.firstCorrect || 0;
    html += '<li><span>Luchtsluis, eerste poging</span><span class="oordeel"><span class="vcsw-badge ' + (lc === STEPS_OK.length ? "success" : lc >= 5 ? "warning" : "danger") + '">' + lc + " van " + STEPS_OK.length + " goed, +" + lc + "</span></span></li></ul></div>";

    html += '<div class="ox-card"><h3>Drie kernregels</h3><ol class="rules">' + RULES.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol>";
    if (S.crystals.length) html += '<h3 class="tweede">Je inventaris</h3><div class="crystals">' + S.crystals.map(function (c) { return chip(esc(c), "gold", "gem"); }).join("") + "</div>";
    html += "</div></div>";

    html += '<div class="actions"><button type="button" class="ox-btn lg" id="earth">Terug op aarde' + icon("next") + "</button>" +
      (passed ? "" : '<button type="button" class="ox-btn ghost lg" id="again">Speel opnieuw' + icon("refresh") + "</button>") + "</div>";
    show(html, "debrief");
    var a = document.getElementById("again");
    if (a) a.onclick = restart;
    document.getElementById("earth").onclick = function () { S.screen = "earth"; render(); };
  }

  function copyAddress(btn) {
    var label = btn.querySelector("span"), addr = "jz@vcsw.nl", live = document.getElementById("live");
    function done(ok) {
      label.textContent = ok ? "Adres gekopieerd" : "Kopiëren lukt niet";
      if (live) live.textContent = ok ? "Het adres jz@vcsw.nl is gekopieerd." : "Kopiëren lukt niet. Selecteer het adres en kopieer het zelf.";
      setTimeout(function () { label.textContent = "Kopieer adres"; }, 2500);
    }
    function fallback() {
      var ok = false, t = document.createElement("textarea");
      t.value = addr; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(t); btn.focus();
      done(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(addr).then(function () { done(true); }, fallback);
    else fallback();
  }

  function renderEarth() {
    var MAX = maxBase(), pct = pctNow(), passed = pct >= 70, cr = S.crystals.length;
    function item(ic, term, text) { return '<li><span class="ic blue">' + icon(ic) + "</span><span>" + (term ? "<strong>" + term + ":</strong> " : "") + text + "</span></li>"; }
    show(
      '<div class="screen-head"><h2>Wat betekent dit voor je werk bij VCSW</h2><p class="ox-lead">Het station is verzonnen. Dit neem je mee naar je werk.</p></div>' +
      '<div class="ox-two">' +
      '<div class="ox-card"><h3>Hier gaat het om</h3><ul class="ox-rows top">' +
      item("dot", "", "Bij VCSW werk je met gegevens van werknemers van klanten, zoals verzuimgegevens en BSN’s. Een mail naar de verkeerde ontvanger is daar net zo goed een (vermoedelijk) datalek.") +
      item("dot", "De toezichthouder", "Dat is de Autoriteit Persoonsgegevens, op het station de Galactische Toezichtraad.") +
      item("dot", "De rol van VCSW", "Afhankelijk van de dienstverlening is VCSW verwerker of verwerkingsverantwoordelijke. Als verwerker informeren we eerst de klant.") +
      "</ul></div>" +
      '<div class="ox-card"><h3>Dit doe je morgen</h3><ul class="ox-rows top">' +
      item("check", "Direct melden", "Meld een (vermoedelijk) datalek direct, ook op vrijdagmiddag. De 72 uur lopen ook in het weekend door.") +
      item("check", "Niet zelf beoordelen", "Of en hoe er gemeld wordt, beoordeelt het meldpunt. Jij meldt, beperkt de schade als dat kan en geeft de feiten door.") +
      "</ul></div></div>" +
      '<div class="ox-card meldroute"><div class="meld-txt"><h3>Meldroute</h3><p>Een datalek of twijfel? Meld het direct bij Tarik, Dagmar of via het meldpunt.</p></div>' +
      '<span class="meld-adres route">jz@vcsw.nl</span>' +
      '<button type="button" class="ox-btn ghost" id="copy"><span>Kopieer adres</span>' + icon("copy") + "</button></div>" +
      '<div class="ox-card uitslag"><div class="uitslag-kop"><h3>Resultaat level 5</h3>' + chip(passed ? "Gehaald" : "Nog niet gehaald", passed ? "ok" : "warn", passed ? "check" : "") +
      '<button type="button" class="ox-btn" id="again">Speel level 5 opnieuw met de andere rol' + icon("refresh") + "</button></div>" +
      '<div class="uitslag-grid">' +
      '<div><p class="lbl">Score</p><p class="val">' + S.score + " van " + MAX + ' punten</p><div class="track"><div class="fill" style="width:' + Math.min(100, pct) + '%"></div><span class="mark"></span></div>' +
      '<p class="note">' + pct + " procent. " + (passed ? "De grens is 70 procent." : "Je hebt 70 procent nodig.") + "</p></div>" +
      '<div><p class="lbl">Schild</p><p class="val">' + S.shield + ' procent</p><div class="track"><div class="fill ' + shieldTone(S.shield) + '" style="width:' + S.shield + '%"></div></div>' +
      '<p class="note">Het schild telt niet mee voor halen. Het laat zien hoe zeker je speelde.</p></div>' +
      '<div><p class="lbl">Kristallen</p><p class="val">' + cr + " van " + CRYSTALS_MAX + '</p><div class="track"><div class="fill gold" style="width:' + (cr / CRYSTALS_MAX * 100) + '%"></div></div>' +
      '<p class="note">Elk kristal was één aanwijzing zonder kosten.</p></div>' +
      "</div></div>",
      "ox-stack aarde"
    );
    document.getElementById("copy").onclick = function () { copyAddress(this); };
    document.getElementById("again").onclick = function () { restart(true); };
  }

  function restart(swap) {
    stopTimer(); stopLogTimer();
    runs++;
    var role = swap === true ? (S.role === "verwerker" ? "verantwoordelijke" : "verwerker") : S.role;
    S = fresh(role, { console: S.flags.console, login: S.flags.login });
    render(); window.scrollTo(0, 0);
  }

  function render() {
    if (S.screen === "brief") renderBrief();
    else if (S.screen === "incident") renderIncident();
    else if (S.screen === "sit") renderSit();
    else if (S.screen === "lock") renderLock();
    else if (S.screen === "debrief") renderDebrief();
    else renderEarth();
  }

  /* ---------- Testsprong: ?scherm=<naam> begint direct op een scherm, met een voorbeeldstand ---------- */
  function demo(low, withLock) {
    buildSeq();
    var good = { s1: "B", s2: "B", s4: "B", s5: "B" }, bad = { s1: "A", s2: "A", s4: "A", s5: "A" };
    S.seq.forEach(function (s) {
      if (s.type === "log") {
        S.picks[s.id] = low ? { r: "fout", cost: COST.fout, fast: false, good: 7, total: s.rows.length, timeout: false } : { r: "goed", cost: COST.goed, fast: true, good: s.rows.length, total: s.rows.length, timeout: false };
        s.rows.forEach(function (r, i) { S.log.assign[i] = low && i > 6 ? !r.ans : r.ans; });
        S.log.done = true; S.log.order = s.rows.map(function (_, i) { return i; }); S.log.left = 41;
      } else {
        var k = (low ? bad : good)[s.id], o = val(s.opts).filter(function (x) { return x.k === k; })[0];
        S.picks[s.id] = { k: k, r: o.r, cost: o.cost || COST[o.r], fast: !low };
      }
      var p = S.picks[s.id];
      S.score += POINTS[p.r]; hit(SHIELD_HIT[p.r]); spend(p.cost); if (p.fast) S.bonus += FAST_BONUS;
    });
    if (!low) S.crystals = [LOG.crystal.name, S5.crystal.name];
    S.sit = S.seq.length - 1;
    if (withLock) {
      var L = S.lock; L.started = true; L.attempts = 2; L.left = 148;
      if (low) { L.firstCorrect = 2; S.score += 2; hit(5); L.revealed = true; }
      else { L.firstCorrect = 6; S.score += 6; hit(5); L.solved = true; L.timeBonus = Math.ceil(L.left / 30); S.bonus += L.timeBonus; L.order = STEPS_OK.map(function (_, i) { return i; }); }
    }
  }
  function jump() {
    var q; try { q = new URLSearchParams(location.search); } catch (e) { return false; }
    var name = q.get("scherm"), low = q.get("stand") === "laag";
    if (!name) return false;
    if (q.get("rol") === "verantwoordelijke") S.role = "verantwoordelijke";
    if (name === "briefing") return true;
    buildSeq();
    if (name === "incident") { S.screen = "incident"; return true; }
    if (name === "dienst") { S.screen = "sit"; S.sit = 0; return true; }
    if (name === "log") { S.screen = "sit"; S.sit = S.seq.indexOf(LOG); return true; }
    if (name === "luchtsluis") { demo(low); S.screen = "lock"; return true; }
    if (name === "sluis") { demo(low); S.screen = "lock"; S.lock.started = true; startTimer(); return true; }
    if (name === "sluisdicht") { demo(low, true); S.screen = "lock"; return true; }
    if (name === "resultaat") { demo(low, true); S.screen = "debrief"; return true; }
    if (name === "aarde") { demo(low, true); S.screen = "earth"; return true; }
    return false;
  }

  jump();
  render();
})();
