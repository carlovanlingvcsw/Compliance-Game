/* Eindmissie: Een bericht van de aarde. Game logic and content of this level. */
(function () {
  "use strict";

  var I = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    next: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    ok: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    bad: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    gem: '<path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    award: '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'
  };
  function icon(n) { return '<svg class="vcsw-icon" viewBox="0 0 24 24" aria-hidden="true">' + I[n] + "</svg>"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var WHO = {
    aria: { name: "ARIA", role: "boordcomputer", av: "A", cls: "av-aria" },
    lyra: { name: "Lyra Jansen", role: "via een bericht van de aarde", av: "L", cls: "av-tessa" },
    bram: { name: "Bram", role: "monteur", av: "B", cls: "av-bram" },
    joran: { name: "Joran", role: "technicus van Nova Terra", av: "J", cls: "av-vega" }
  };
  function speech(who, text) {
    var w = WHO[who];
    return '<div class="speech"><span class="vcsw-avatar ' + w.cls + '" aria-hidden="true">' + w.av + '</span><div><div class="speech-who">' + w.name + ' <span class="speech-role">' + w.role + '</span></div><p class="speech-text">' + esc(text) + "</p></div></div>";
  }
  function alertBox(kind, ic, title, text) {
    return '<div class="vcsw-alert ' + kind + '">' + icon(ic) + '<div><p class="vcsw-alert-title">' + title + '</p><p class="vcsw-alert-text">' + text + "</p></div></div>";
  }
  function verdictBadge(r) {
    return r === "goed" ? '<span class="vcsw-badge success">' + icon("check") + "Goed, +10</span>"
      : r === "half" ? '<span class="vcsw-badge warning">Half goed, +5</span>'
      : '<span class="vcsw-badge danger">Fout, 0 punten</span>';
  }

  /* ---------- Inhoud ---------- */
  var F1 = {
    id: "f1", title: "Het verzoek komt binnen", who: "lyra",
    say: "Ik wil graag weten welke persoonsgegevens jullie van mij hebben en wat jullie ermee doen.",
    opts: [
      { k: "A", t: "Laten liggen tot het rustiger is aan boord. Voor zo'n verzoek geldt geen vaste termijn, dus het kan wachten.", r: "fout", uitleg: "Er geldt een vaste termijn. Die loopt vanaf de dag dat het verzoek binnenkomt.", reactie: "Ik hoor niets terug. Hebben jullie mijn bericht wel gekregen?" },
      { k: "B", t: "De ontvangst bevestigen, de datum noteren en het verzoek doorzetten naar het meldpunt.", r: "goed", uitleg: "Met de datum van ontvangst weet het meldpunt precies hoeveel tijd er is.", reactie: "Dank voor de bevestiging. Ik wacht jullie antwoord af." },
      { k: "C", t: "Meteen alles terugsturen wat je in je eigen berichten over haar vindt.", r: "fout", uitleg: "Eerst controleer je haar identiteit. Daarna antwoord je volledig en veilig, via het meldpunt.", reactie: "Dit is maar een deel, toch? En hoe weten jullie eigenlijk dat ik het ben?" }
    ],
    crystal: { on: "B", name: "Termijn inzageverzoek", desc: "Antwoorden binnen een maand na ontvangst, met mogelijkheid tot verlenging bij complexe verzoeken als je de betrokkene daar binnen die maand over informeert." }
  };
  var F2 = {
    id: "f2", title: "Is dit echt Lyra?", who: "aria",
    say: "Voordat we iets terugsturen, moeten we zeker weten dat dit bericht echt van Lyra Jansen komt. Hoe controleer je dat?",
    opts: [
      { k: "A", t: "Een volledige identiteitsscan vragen, inclusief identiteitsnummer. Dan weet je het helemaal zeker.", r: "fout", uitleg: "Je vraagt meer gegevens dan nodig is. Dat is precies wat je in deze game steeds hebt geleerd te vermijden.", reactie: "Nu hebben we haar identiteitsnummer erbij. Dat moeten we straks ook weer beveiligen." },
      { k: "B", t: "Controleren of het bericht komt van het adres waarmee ze zich aanmeldde, of een controlevraag stellen over haar aanmelding.", r: "goed", uitleg: "Zo controleer je haar identiteit met gegevens die je al hebt.", reactie: "Het adres klopt met haar aanmelding. Het is echt Lyra." },
      { k: "C", t: "Geen controle doen. Het bericht staat op haar naam, dus het zal wel kloppen en je wilt haar niet laten wachten.", r: "fout", uitleg: "Zo kunnen gegevens bij de Zwarte Nevel terechtkomen.", reactie: "Mijn sensoren zien dat de Zwarte Nevel vaker zulke verzoeken stuurt. Weet je het zeker?" }
    ]
  };

  /* Fase 3: ruimtes. flag = doorwerking uit eerdere levels; zonder flag is de ruimte leeg. */
  var ROOMS = [
    { id: "aanmeld", name: "Aanmeldsysteem", always: true, find: "Haar aanmelding en de toestemming om haar dossier een jaar te bewaren", ok: true,
      why: "Dit hoort bij de inzage. Het staat er terecht, want ze gaf toestemming." },
    { id: "databank", name: "Gedeelde databank", flag: "kopie", find: "Een extra kopie van haar dossier", ok: false,
      why: "Deze kopie had er niet mogen zijn. Ze hoort in het overzicht, en je meldt haar.", empty: "Niets over Lyra. Je bewaarde in level 2 geen aanmeldingen in de gedeelde databank." },
    { id: "verzonden", name: "Verzonden bericht aan Kapitein Vega", flag: "vega", find: "Haar dossier, met leeftijd en planeet van herkomst erbij", ok: false,
      why: "Dit had Nova Terra nooit mogen krijgen. Het hoort in het overzicht, bij met wie we haar gegevens deelden, en je meldt het.", empty: "Niets over Lyra. Je stuurde in level 2 alleen de dossiers van geselecteerde kandidaten." },
    { id: "holonet", name: "Map met holonet-opnames", flag: "holonet", find: "Beelden van haar privéprofiel", ok: false,
      why: "Privéinformatie die niets met de selectie te maken had. Ze hoort in het overzicht, en je meldt het.", empty: "Niets over Lyra. Je sloeg in level 2 geen holonet-opnames op." },
    { id: "chat", name: "Crewchat", always: true, find: "Een opmerking van Bram over haar aanmelding: “Die van Aarde? Te braaf voor Nova Terra.”", ok: true,
      why: "Ook een opmerking in een chat is een persoonsgegeven over haar. Die hoort bij de inzage, ook al is dat ongemakkelijk." }
  ];
  var ACT = [
    { id: "op", label: "In het overzicht" },
    { id: "meld", label: "In het overzicht en melden" },
    { id: "weg", label: "Weglaten" }
  ];
  var F3_SECONDS = 300;

  var BLOCKS = [
    { t: "Welke gegevens we van haar hebben", in: true },
    { t: "Waarvoor we die gegevens gebruiken", in: true },
    { t: "Met wie we haar gegevens hebben gedeeld", in: true },
    { t: "Hoe lang we haar gegevens bewaren", in: true },
    { t: "Waar de gegevens vandaan komen", in: true },
    { t: "Welke rechten ze heeft, zoals correctie, verwijdering en een klacht bij de toezichthouder", in: true },
    { t: "Beoordelingen van andere kandidaten", in: false, why: "Dat zijn gegevens van anderen." },
    { t: "De namen van crewleden die haar dossier inzagen", in: false, why: "Dat zijn gegevens van crewleden, niet van haar." },
    { t: "Een rekening voor de kosten", in: false, why: "Een inzageverzoek kost haar niets." },
    { t: "Een verzoek om haar aanmelding in te trekken", in: false, why: "Daar vroeg ze niet om. Het antwoord gaat over haar verzoek." }
  ];

  var JORAN = {
    id: "joran", title: "Nog een bericht: de klacht van Joran", who: "joran",
    intro: "Doorwerking uit level 3. Je vertelde Kapitein Vega dat Joran overspannen was.",
    say: "Kapitein Vega wist dat ik overspannen was. Dat had ik alleen aan jou verteld. Ik wil dat er iets mee gebeurt.",
    opts: [
      { k: "A", t: "Zelf je excuses aanbieden aan Joran en het daarbij laten. Een klacht hoeft niet altijd naar het meldpunt.", r: "fout", uitleg: "Excuses zijn goed, maar dit is een klacht over het delen van medische informatie. Die moet het meldpunt beoordelen, ook als mogelijk datalek." , reactie: "Fijn dat je sorry zegt. Maar wie zorgt dat het niet nog eens gebeurt?" },
      { k: "B", t: "Je excuses aanbieden en zijn klacht met de datum van ontvangst doorzetten naar het meldpunt, net als het verzoek van Lyra.", r: "goed", uitleg: "Beide verzoeken gaan correct naar het meldpunt. Het meldpunt beoordeelt ook of hier sprake is van een datalek.", reactie: "Dank je. Dan weet ik dat er echt naar gekeken wordt." },
      { k: "C", t: "Joran vragen zijn klacht in te trekken. Het was goed bedoeld, en Vega wilde alleen maar rekening met hem houden bij het rooster.", r: "fout", uitleg: "Je zet niemand onder druk om een klacht in te trekken. Het meldpunt moet hem beoordelen.", reactie: "Goed bedoeld? Iedereen weet het nu." }
    ]
  };

  var CRYSTALS = [
    { name: "Herleidbaar = persoonsgegeven", cat: "herkennen", lvl: 1 },
    { name: "Eigen toegang", cat: "beschermen", lvl: 1 },
    { name: "Melden bij twijfel", cat: "melden", lvl: 1 },
    { name: "Bewaartermijn", cat: "bewaren", lvl: 2 },
    { name: "Recht op informatie", cat: "rechten", lvl: 2 },
    { name: "Dataminimalisatie", cat: "delen", lvl: 2 },
    { name: "Verkeerd ontvangen", cat: "melden", lvl: 3 },
    { name: "Need to know", cat: "delen", lvl: 3 },
    { name: "Veilig ontvangen", cat: "beschermen", lvl: 4 },
    { name: "Goedgekeurde AI", cat: "beschermen", lvl: 4 },
    { name: "Feiten vastleggen", cat: "melden", lvl: 5 },
    { name: "Termijn inzageverzoek", cat: "rechten", lvl: 6 }
  ];
  var MISSING = ["Herleidbaar = persoonsgegeven", "Bewaartermijn", "Recht op informatie"];
  function catOf(n) { var c = CRYSTALS.filter(function (x) { return x.name === n; })[0]; return c ? c.cat : null; }

  /* Eindbaas: zes snelle situaties, één per thema. Een passend kristal werkt als joker. */
  var BOSS_SECONDS = 20;
  var BOSS = [
    { cat: "herkennen", t: "De Zwarte Nevel biedt een ‘anoniem’ bestand aan: crewnummers met ziektedagen, zonder namen. Zijn dit persoonsgegevens?",
      o: ["Nee, er staan geen namen in.", "Ja, via de administratie herleid je een crewnummer naar één persoon.", "Alleen als er ook adressen in staan."], a: 1,
      why: "Een crewnummer is herleidbaar via de administratie. Dus ook zonder namen zijn dit persoonsgegevens." },
    { cat: "bewaren", t: "In een oude map vind je aanmeldingen van kandidaten die een half jaar geleden zijn afgewezen. Niemand gaf toestemming om ze te bewaren.",
      o: ["Laten staan, misschien zijn ze nog handig.", "De namen eraf halen en de rest bewaren.", "Melden en laten wissen. Ze hadden binnen vier weken na de selectie weg moeten zijn."], a: 2,
      why: "Zonder toestemming wis je binnen vier weken na de selectie. Wat er nog staat, meld je." },
    { cat: "beschermen", t: "Een bericht van ‘Stationstechniek’: geef met spoed je toegangscode, dan repareren we de hoofdsluis.",
      o: ["Niet geven, controleren via een andere weg en melden bij ARIA.", "Geven, het is spoed.", "Alleen de eerste helft van de code geven."], a: 0,
      why: "Spoed en een vraag om je code zijn signalen van een aanval. Je controleert via een andere weg." },
    { cat: "delen", t: "Kapitein Vega vraagt de verzuimcijfers van haar crew, met de diagnoses erbij, ‘zodat ik kan plannen’.",
      o: ["Alles sturen via het beveiligde kanaal.", "De diagnoses sturen zonder namen.", "Alleen de verwachte duur delen. Over wat iemand nog kan, adviseert de scheepsarts."], a: 2,
      why: "Voor plannen is de verwachte duur genoeg. Diagnoses zijn alleen voor de scheepsarts, ook zonder namen." },
    { cat: "melden", t: "Je stuurde per ongeluk een dossier naar de verkeerde collega op het station. Die heeft het meteen gewist.",
      o: ["Niets doen, het is al gewist.", "Toch melden bij ARIA. Het meldpunt beoordeelt of het een datalek is.", "Alleen de collega bedanken."], a: 1,
      why: "Ook als de schade beperkt lijkt, meld je het. De beoordeling ligt bij het meldpunt." },
    { cat: "rechten", t: "Een oud-crewlid vraagt om inzage. Je collega zegt: ‘We hebben drie maanden, geen haast.’",
      o: ["Klopt, drie maanden.", "Binnen een maand na ontvangst. Verlengen kan alleen bij een complex verzoek, als je dat binnen die maand laat weten.", "Binnen 72 uur, net als bij een datalek."], a: 1,
      why: "De termijn is een maand na ontvangst. 72 uur geldt voor een melding van een datalek." }
  ];

  /* Hoofdsluis: de vijftien kernregels als gatentekst. b = juiste woord, x = afleiders. */
  var GAPS = [
    { lvl: "Level 1: Aankomst op het station", rules: [
      { pre: "Een gegeven is een persoonsgegeven als je het, direct of via omwegen, aan", post: "kunt koppelen.", b: "één persoon", x: ["een organisatie", "een afdeling"] },
      { pre: "Vergrendel altijd je", post: "en laat niets op papier slingeren.", b: "scherm", x: ["bureaula", "kantoordeur"] },
      { pre: "Twijfel je of iets fout zit?", post: "Liever tien meldingen te veel dan één te weinig.", b: "Meld het.", x: ["Wacht af.", "Los het zelf op."] } ] },
    { lvl: "Level 2: De passagiersmodule", rules: [
      { pre: "Gebruik gegevens alleen voor het", post: "waarvoor je ze kreeg.", b: "doel", x: ["systeem", "team"] },
      { pre: "Bewaar niets langer dan", post: ", en zonder toestemming al helemaal niet.", b: "nodig", x: ["een jaar", "handig"] },
      { pre: "Deel alleen wat de ontvanger echt", post: ".", b: "nodig heeft", x: ["vraagt", "interessant vindt"] } ] },
    { lvl: "Level 3: De medische ziekenboeg", rules: [
      { pre: "Vraag nooit naar de", post: "of oorzaak van ziekte, ook niet indirect.", b: "diagnose", x: ["verwachte duur", "bereikbaarheid"] },
      { pre: "Wat iemand je", post: "vertelt, geef je niet door.", b: "vertrouwelijk", x: ["in een vergadering", "per mail"] },
      { pre: "Gevoelige gegevens alleen voor wie ze nodig heeft, en nooit in", post: ".", b: "Teams of e-mail", x: ["beveiligd systeem", "personeelsdossier"] } ] },
    { lvl: "Level 4: Het vrachtdok", rules: [
      { pre: "Ontvang en deel persoonsgegevens alleen via de", post: "weg, nooit als losse bijlage.", b: "beveiligde", x: ["snelste", "gebruikelijke"] },
      { pre: "Gebruik gegevens alleen voor het doel waarvoor je ze kreeg, en alleen in", post: "systemen.", b: "goedgekeurde", x: ["gratis", "snelle"] },
      { pre: "Afwijkende afzender, spoed of geheimhouding? Stop en controleer via", post: ".", b: "een andere weg", x: ["een antwoord op het bericht", "de link in het bericht"] } ] },
    { lvl: "Level 5: Alarm in module Kepler", rules: [
      { pre: "Een datalek meld je", post: ", ook aan het eind van je dienst.", b: "direct", x: ["binnen 72 uur", "na overleg met je team"] },
      { pre: "Eerst schade beperken en", post: "vastleggen, daarna pas oordelen.", b: "feiten", x: ["schuld", "namen"] },
      { pre: "Wees eerlijk tegen opdrachtgevers en laat de beoordeling over aan", post: ".", b: "het meldpunt", x: ["de opdrachtgever", "jezelf"] } ] }
  ];
  /* Elke groep van drie regels is één grendel van de hoofdsluis. */
  var BOLTS = ["Aankomst", "Passagiers", "Ziekenboeg", "Vrachtdok", "Kepler"];
  var RULES = [];
  GAPS.forEach(function (l, g) { l.rules.forEach(function (r) { RULES.push({ g: g, r: r }); }); });
  function ruleText(r) { return (r.pre + " " + r.b + (/^[.,]/.test(r.post) ? "" : " ") + r.post).replace(/\s+/g, " "); }
  var CHEAT = GAPS.map(function (l) { return { lvl: l.lvl, rules: l.rules.map(ruleText) }; });

  /* Antwoorden staan per poging in een andere volgorde. De letter volgt de plek op het scherm, niet het antwoord. */
  function ordered(id, opts) {
    S.ord = S.ord || {};
    if (!S.ord[id]) { var a = opts.map(function (_, i) { return i; }); for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } S.ord[id] = a; }
    return S.ord[id].map(function (i) { return opts[i]; });
  }
  var POINTS = { goed: 10, half: 5, fout: 0 }, SHIELD_HIT = { goed: 0, half: 5, fout: 10 };

  /* ---------- State ---------- */
  var S, timer = null;
  function fresh(flags) {
    flags = flags || { kopie: false, vega: false, holonet: false, joran: false, missing: false };
    var inv = CRYSTALS.filter(function (c) { return c.lvl < 6 && !(flags.missing && MISSING.indexOf(c.name) !== -1); }).map(function (c) { return c.name; });
    return { screen: "brief", flags: flags, shield: 100, score: 0, hints: 3, inv: inv, picks: {},
      f3: { searched: {}, act: {}, left: F3_SECONDS, done: false, timeout: false, reported: 0, result: null, hinted: {} },
      f4: { assign: {}, done: false, result: null, hinted: {} },
      boss: { started: false, i: 0, left: BOSS_SECONDS, answered: {}, joker: {}, done: false },
      lock: { fill: {}, opts: GAPS.reduce(function (acc, l) { l.rules.forEach(function (r) { var o = [r.b].concat(r.x); for (var k = o.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var t = o[k]; o[k] = o[j]; o[j] = t; } acc.push(o); }); return acc; }, []),
        g: 0, bolts: BOLTS.map(function () { return { attempts: 0, firstGood: null, open: false }; }), wrong: {}, right: {}, solved: false },
      endView: "uitslag" };
  }
  S = fresh();
  var stage = document.getElementById("stage");

  function hasJoran() { return S.flags.joran; }
  function maxScore() { return 10 * 4 + (hasJoran() ? 10 : 0) + 10 + 10; }
  function hit(n) { S.shield = Math.max(0, S.shield - n); }
  function has(n) { return S.inv.indexOf(n) !== -1; }
  function give(n) { if (!has(n)) S.inv.push(n); }

  var ORDER = ["brief", "f1", "f2", "f3", "f4", "boss", "lock", "end", "earth"];
  var LABELS = ["Briefing", "Fase 1", "Fase 2", "Fase 3", "Fase 4", "Eindbaas", "Hoofdsluis", "Afsluiting", "Terug op aarde"];
  function hud() {
    document.getElementById("shieldText").textContent = S.shield + "%";
    var f = document.getElementById("shieldFill");
    f.style.width = S.shield + "%";
    f.className = "vcsw-progress-fill" + (S.shield < 50 ? " error" : S.shield < 80 ? " warning" : "");
    document.getElementById("scoreText").textContent = S.score;
    document.getElementById("hintText").textContent = S.hints;
    document.getElementById("crystalText").textContent = S.inv.length;
    var cur = ORDER.indexOf(S.screen === "joran" ? "f4" : S.screen);
    document.getElementById("steps").innerHTML = LABELS.map(function (l, i) {
      var cls = i < cur ? "done" : i === cur ? "now" : "";
      return '<li class="' + cls + '"' + (i === cur ? ' aria-current="step"' : "") + ">" + (i < cur ? icon("check") : "") + l + "</li>";
    }).join("");
  }
  var shown = null;
  function show(html, cls) {
    var moved = document.activeElement && document.activeElement !== document.body;
    stage.innerHTML = '<div class="screen' + (cls ? " " + cls : "") + '" tabindex="-1">' + html + "</div>";
    hud();
    var sc = stage.querySelector(".screen");
    if (sc && moved) sc.focus({ preventScroll: true });
    if (shown !== S.screen) { shown = S.screen; window.scrollTo(0, 0); }
  }
  /* Chips boven een titel zeggen waar je bent. kind: groen, blauw, goud of rood. */
  function chip(text, kind, ic) { return '<span class="chip' + (kind ? " " + kind : "") + '">' + (ic ? icon(ic) : "") + text + "</span>"; }
  function chips(list) { return '<p class="chips">' + [].concat(list).map(function (c) { return typeof c === "string" ? chip(c) : chip(c[0], c[1], c[2]); }).join("") + "</p>"; }
  function head(over, title) { return '<div class="kop">' + chips(over) + "<h2>" + esc(title) + "</h2></div>"; }
  function copyText(text, btn, done) {
    function fallback() {
      var ta = document.createElement("textarea"), ok = false;
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); if (btn) btn.focus({ preventScroll: true });
      done(ok);
    }
    try { navigator.clipboard.writeText(text).then(function () { done(true); }, fallback); } catch (e) { fallback(); }
  }
  function fmt(n) { return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0"); }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  /* ---------- Briefing ---------- */
  function renderBrief() {
    var f = S.flags;
    function cb(id, txt) { return '<label><input type="checkbox" data-flag="' + id + '"' + (f[id] ? " checked" : "") + "> " + txt + "</label>"; }
    show(
      '<div class="kop title-screen">' + chips(["Eindmissie", "Briefing"]) + "<h1>Een bericht van de aarde</h1></div>" +
      '<p class="lead">Alles komt samen. Je handelt een inzageverzoek af en hebt daarvoor kennis en datakristallen uit alle vorige levels nodig.</p>' +
      speech("aria", "Er komt een bericht binnen van de aarde. Lyra Jansen meldde zich vorig jaar aan als kolonist voor Nova Terra, maar werd niet geselecteerd. Nu wil ze weten welke gegevens wij van haar hebben. Daar heeft ze recht op. Dit is je laatste missie. Gebruik je datakristallen.") +
      '<p class="muted">Lyra Jansen is een fictieve kandidaat. Haar dossier lag ook in het cryo-archief van level 2.</p>' +
      '<dl class="vcsw-dl" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">' +
      "<div><dt>Vier fasen</dt><dd>Het verzoek, de controle, de zoektocht door het station en het antwoord.</dd></div>" +
      "<div><dt>Eindbaas en hoofdsluis</dt><dd>Sla zes snelle aanvallen van de Zwarte Nevel af, met je kristallen als joker. Open daarna de sluis met de vijftien kernregels.</dd></div>" +
      "<div><dt>Gehaald</dt><dd>Bij minimaal 70 procent word je benoemd tot Admiraal van de Datawacht.</dd></div></dl>" +
      '<div class="setup"><p class="muted">Alleen voor dit prototype. In de echte game onthoudt het spel je keuzes en kristallen uit eerdere levels.</p>' +
      "<fieldset><legend>Doorwerking uit eerdere levels</legend>" +
      cb("kopie", "Level 2, situatie 1: ik zette alle aanmeldingen in de gedeelde databank") +
      cb("vega", "Level 2, situatie 4: ik stuurde Kapitein Vega alle aanmeldingen, ook met leeftijd en herkomst") +
      cb("holonet", "Level 2, situatie 3: ik bewaarde opnames van het holonet-profiel") +
      cb("joran", "Level 3, situatie 2: ik vertelde Kapitein Vega dat Joran overspannen was") +
      "</fieldset><fieldset><legend>Datakristallen</legend>" +
      cb("missing", "Ik mis een paar kristallen uit eerdere levels, dus minder jokers") +
      "</fieldset></div>" +
      '<div class="actions"><button class="vcsw-button lg" id="go">Open het bericht' + icon("next") + "</button></div>"
    );
    stage.querySelectorAll("[data-flag]").forEach(function (c) {
      c.onchange = function () { var fl = S.flags; fl[c.getAttribute("data-flag")] = c.checked; S = fresh(fl); hud(); };
    });
    document.getElementById("go").onclick = function () { S.screen = "f1"; render(); };
  }

  /* ---------- Keuzesituaties ---------- */
  function renderChoice(s, over, nextScreen) {
    var pick = S.picks[s.id];
    var html = head(over, s.title);
    if (s.intro) html += '<p class="muted">' + esc(s.intro) + "</p>";
    html += speech(s.who, s.say) + '<div class="options" role="group" aria-label="Kies je antwoord">';
    ordered(s.title, s.opts).forEach(function (o, n) {
      var cls = "option" + (pick ? (pick === o.k ? " picked" : " dim") : "");
      html += '<button class="' + cls + '" data-k="' + o.k + '"' + (pick ? " disabled" : "") + '><span class="key" aria-hidden="true">' + "ABC"[n] + '</span><span><span class="vcsw-sr-only">Optie ' + "ABC"[n] + ". </span>" + esc(o.t) +
        (pick === o.k ? '<span class="verdict">' + verdictBadge(o.r) + "</span>" : "") + "</span></button>";
    });
    html += "</div>";
    if (pick) {
      var o = s.opts.filter(function (x) { return x.k === pick; })[0];
      html += '<div class="feedback">' + speech(s.who === "aria" ? "aria" : s.who, o.reactie) + speech("aria", (o.r === "goed" ? "Goed. " : o.r === "half" ? "Half goed. " : "Fout. ") + o.uitleg);
      if (s.crystal && s.crystal.on === pick) html += '<div class="reward">' + icon("gem") + "<div><strong>Datakristal " + esc(s.crystal.name) + "</strong><br><span>" + esc(s.crystal.desc) + "</span></div></div>";
      else if (s.crystal) html += '<p class="muted">Geen datakristal ' + esc(s.crystal.name) + ". In de hoofdsluis kun je hem terugverdienen.</p>";
      html += '</div><div class="actions"><button class="vcsw-button lg" id="next">Verder' + icon("next") + "</button></div>";
    }
    show(html);
    if (!pick) stage.querySelectorAll(".option").forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute("data-k"), o = s.opts.filter(function (x) { return x.k === k; })[0];
        S.picks[s.id] = k; S.score += POINTS[o.r]; hit(SHIELD_HIT[o.r]);
        if (s.crystal && s.crystal.on === k) give(s.crystal.name);
        render();
      };
    });
    else document.getElementById("next").onclick = function () { S.screen = nextScreen; if (nextScreen === "f3") startF3(); render(); };
  }

  /* ---------- Fase 3: de zoektocht ---------- */
  function roomFound(r) { return r.always || S.flags[r.flag]; }
  function startF3() {
    stopTimer();
    timer = setInterval(function () {
      var F = S.f3;
      if (S.screen !== "f3" || F.done) return stopTimer();
      F.left = Math.max(0, F.left - 1);
      var t = document.getElementById("timer");
      if (t) { t.querySelector("span").textContent = fmt(F.left); t.classList.toggle("low", F.left <= 60); }
      if (F.left === 0 && !F.timeout) { F.timeout = true; hit(10); stopTimer(); render(); }
    }, 1000);
  }
  function renderF3() {
    var F = S.f3, done = F.done;
    var html = head(["Fase 3", "Escape room"], "De zoektocht") +
      speech("aria", "Doorzoek vijf ruimtes van het station naar gegevens over Lyra. Kies bij alles wat je vindt wat ermee moet. Wat er niet had mogen zijn, neem je op en meld je ook. Dat kost tijd en schildsterkte, maar verzwijgen kost meer.");
    html += '<div class="lockbar"><span class="muted">' + Object.keys(F.searched).length + " van " + ROOMS.length + ' ruimtes doorzocht</span><div class="timer' + (F.left <= 60 ? " low" : "") + '" id="timer" aria-label="Resterende tijd">' + icon("clock") + "<span>" + fmt(F.left) + "</span></div></div>";
    html += '<div class="rooms">';
    ROOMS.forEach(function (r) {
      var s = F.searched[r.id];
      html += '<div class="room' + (s ? " searched" : "") + '"><div class="room-name">' + icon("search") + esc(r.name) + "</div>";
      if (!s) {
        html += '<button class="vcsw-button outline" data-room="' + r.id + '"' + (done ? " disabled" : "") + ">Doorzoeken</button>";
      } else if (!roomFound(r)) {
        html += '<p class="muted">' + esc(r.empty) + "</p>";
      } else {
        var a = F.act[r.id], correct = r.ok ? "op" : "meld", wrong = done && a !== correct;
        html += '<div class="finding' + (wrong ? " wrong" : "") + '"><p><strong>Gevonden:</strong> ' + esc(r.find) + "</p>" +
          '<div class="vcsw-segmented" role="group" aria-label="Wat doe je met: ' + esc(r.find) + '">' +
          ACT.map(function (x) { return '<button type="button" data-act="' + r.id + '" data-v="' + x.id + '" aria-pressed="' + (a === x.id) + '"' + (done ? " disabled" : "") + ">" + x.label + "</button>"; }).join("") + "</div>";
        if (done || F.hinted[r.id]) html += '<p class="muted">' + (done ? (wrong ? '<strong style="color:var(--vcsw-down)">Niet goed. Juist: ' + ACT.filter(function (x) { return x.id === correct; })[0].label.toLowerCase() + ".</strong> " : '<strong style="color:var(--vcsw-up)">Goed.</strong> ') : icon("bulb") + " ") + esc(r.why) + "</p>";
        html += "</div>";
      }
      html += "</div>";
    });
    html += "</div>";
    if (F.timeout && !done) html += alertBox("warning", "warn", "De tijd is op", "Je schild verliest 10 procent. Maak de zoektocht gewoon af.");
    var allSearched = Object.keys(F.searched).length === ROOMS.length;
    var found = ROOMS.filter(function (r) { return F.searched[r.id] && roomFound(r); });
    var allActed = found.every(function (r) { return F.act[r.id]; });
    if (!done) {
      html += '<div class="actions">' + (S.hints > 0 && found.some(function (r) { return !F.hinted[r.id]; }) ? '<button class="vcsw-button outline lg" id="hint">' + icon("bulb") + "Gebruik een aanwijzing</button>" : "") +
        '<button class="vcsw-button lg" id="done"' + (allSearched && allActed ? "" : " disabled") + ">" + icon("check") + "Overzicht afronden</button></div>";
      if (!(allSearched && allActed)) html += '<p class="muted" style="text-align:right">Doorzoek alle ruimtes en kies bij elke vondst wat ermee moet.</p>';
    } else {
      var p = S.picks.f3;
      html += '<div class="feedback"><div style="display:flex;gap:6px;flex-wrap:wrap">' + verdictBadge(p.r) + '<span class="vcsw-badge neutral">' + p.good + " van " + p.total + " goed</span>" + (F.reported ? '<span class="vcsw-badge warning">' + F.reported + " gemeld, −" + F.reported * 5 + "% schild</span>" : "") + "</div>" +
        speech("aria", p.r === "goed" ? (F.reported ? "Goed overzicht. De gegevens die er niet hadden mogen zijn, staan erin en zijn gemeld. Dat kostte schild, maar het is eerlijk." : "Goed overzicht. En er lag niets wat er niet hoorde, dankzij je keuzes in level 2.") : "Kijk naar de rode vondsten. Alles over Lyra hoort in het overzicht, ook wat ongemakkelijk is. Wat er niet had mogen zijn, meld je.") +
        (found.some(function (r) { return r.id === "chat"; }) ? '<p class="muted">Ook de opmerking in de crewchat hoort bij de inzage. Dat verrast veel spelers.</p>' : "") +
        '</div><div class="actions"><button class="vcsw-button lg" id="next">Naar het antwoord' + icon("next") + "</button></div>";
    }
    show(html);
    stage.querySelectorAll("[data-room]").forEach(function (b) {
      b.onclick = function () { F.searched[b.getAttribute("data-room")] = true; render(); };
    });
    stage.querySelectorAll("[data-act]").forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute("data-act"); F.act[id] = b.getAttribute("data-v"); render();
        var again = stage.querySelector('[data-act="' + id + '"][data-v="' + F.act[id] + '"]'); if (again) again.focus();
      };
    });
    var h = document.getElementById("hint");
    if (h) h.onclick = function () { var r = found.filter(function (x) { return !F.hinted[x.id]; })[0]; if (r) { F.hinted[r.id] = true; S.hints--; render(); } };
    var d = document.getElementById("done");
    if (d) d.onclick = function () {
      var good = 0;
      found.forEach(function (r) { if (F.act[r.id] === (r.ok ? "op" : "meld")) good++; if (!r.ok && F.act[r.id] === "meld") F.reported++; });
      var r = good === found.length ? "goed" : good >= found.length - 1 ? "half" : "fout";
      S.picks.f3 = { r: r, good: good, total: found.length };
      S.score += POINTS[r]; hit(SHIELD_HIT[r] + F.reported * 5);
      F.done = true; stopTimer(); render();
    };
    var n = document.getElementById("next");
    if (n) n.onclick = function () { S.screen = "f4"; render(); };
  }

  /* ---------- Fase 4: het antwoord ---------- */
  function renderF4() {
    var F = S.f4, done = F.done;
    var html = head("Fase 4", "Het antwoord") +
      speech("aria", "Stel het antwoord aan Lyra samen uit tien bouwstenen. Zes horen erin, vier niet.") + '<div class="logrows">';
    BLOCKS.forEach(function (b, i) {
      var a = F.assign[i], wrong = done && a !== b.in;
      html += '<div class="logrow' + (wrong ? " wrong" : "") + '"><span class="what">' + esc(b.t) + "</span>" +
        '<div class="vcsw-segmented" role="group" aria-label="In het antwoord: ' + esc(b.t) + '">' +
        '<button type="button" data-b="' + i + '" data-v="1" aria-pressed="' + (a === true) + '"' + (done ? " disabled" : "") + ">Erin</button>" +
        '<button type="button" data-b="' + i + '" data-v="0" aria-pressed="' + (a === false) + '"' + (done ? " disabled" : "") + ">Niet</button></div>";
      if ((done || F.hinted[i])) html += '<p class="note">' + (done ? (wrong ? '<strong style="color:var(--vcsw-down)">Niet goed. Dit hoort ' + (b.in ? "er wel" : "er niet") + " in.</strong> " : '<strong style="color:var(--vcsw-up)">Goed.</strong> ') : icon("bulb") + " Dit hoort " + (b.in ? "er wel" : "er niet") + " in. ") + esc(b.why || "") + "</p>";
      html += "</div>";
    });
    html += "</div>";
    var filled = Object.keys(F.assign).length === BLOCKS.length;
    if (!done) {
      html += '<div class="actions">' + (S.hints > 0 ? '<button class="vcsw-button outline lg" id="hint">' + icon("bulb") + "Gebruik een aanwijzing</button>" : "") +
        '<button class="vcsw-button lg" id="done"' + (filled ? "" : " disabled") + ">" + icon("mail") + "Ter controle naar het meldpunt</button></div>";
    } else {
      var p = S.picks.f4;
      html += '<div class="feedback"><div style="display:flex;gap:6px;flex-wrap:wrap">' + verdictBadge(p.r) + '<span class="vcsw-badge neutral">' + p.good + " van 10 goed</span></div>" +
        speech("aria", p.r === "goed" ? "Een volledig antwoord. Het meldpunt heeft het gecontroleerd en het gaat via het beveiligde kanaal naar de aarde." : "Het meldpunt stuurt het terug. Kijk naar de rode bouwstenen. Na correctie gaat het via het beveiligde kanaal naar de aarde.");
      if (S.flags.vega) html += '<p class="muted">Omdat je in level 2 haar dossier aan Kapitein Vega stuurde, staat Nova Terra nu ook bij met wie we haar gegevens hebben gedeeld.</p>';
      html += '</div><div class="actions"><button class="vcsw-button lg" id="next">' + (hasJoran() ? "Er komt nog een bericht binnen" : "Naar de eindbaas") + icon("next") + "</button></div>";
    }
    show(html);
    stage.querySelectorAll("[data-b]").forEach(function (b) {
      b.onclick = function () {
        var i = b.getAttribute("data-b"); F.assign[i] = b.getAttribute("data-v") === "1"; render();
        var again = stage.querySelector('[data-b="' + i + '"][data-v="' + (F.assign[i] ? "1" : "0") + '"]'); if (again) again.focus();
      };
    });
    var h = document.getElementById("hint");
    if (h) h.onclick = function () {
      var i = BLOCKS.map(function (_, k) { return k; }).filter(function (k) { return !F.hinted[k] && F.assign[k] !== BLOCKS[k].in; })[0];
      if (i === undefined) i = BLOCKS.map(function (_, k) { return k; }).filter(function (k) { return !F.hinted[k]; })[0];
      if (i !== undefined) { F.hinted[i] = true; S.hints--; render(); }
    };
    var d = document.getElementById("done");
    if (d) d.onclick = function () {
      var good = BLOCKS.filter(function (b, i) { return F.assign[i] === b.in; }).length;
      var r = good === 10 ? "goed" : good === 9 ? "half" : "fout";
      S.picks.f4 = { r: r, good: good }; S.score += POINTS[r]; hit(SHIELD_HIT[r]); F.done = true; render();
    };
    var n = document.getElementById("next");
    if (n) n.onclick = function () { S.screen = hasJoran() ? "joran" : "boss"; render(); };
  }

  /* ---------- Eindbaas: de aanval van de Zwarte Nevel ---------- */
  var bossTimer = null, RING_C = 251.3;
  var STAND = { vrij: ["Bevrijd", "check"], mis: ["Niet bevrijd", "x"], nu: ["Aanval nu", "warn"], nevel: ["In de nevel", "lock"] };
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function calm() { return document.documentElement.classList.contains("calm"); }
  function stopBoss() { if (bossTimer) { clearInterval(bossTimer); bossTimer = null; } }
  function ringOffset(left) { return (RING_C * (1 - left / BOSS_SECONDS)).toFixed(1); }
  /* De boog loopt vloeiend naar de volgende seconde, het getal telt per seconde. */
  function paintRing() {
    var B = S.boss, t = document.getElementById("timer"), num = t && t.querySelector(".ring-num");
    if (!num) return;
    t.classList.toggle("low", B.left <= 5);
    num.textContent = B.left;
    t.querySelector("svg").setAttribute("aria-label", B.left + " seconden");
    if (!calm()) t.querySelector(".ring-arc").style.strokeDashoffset = ringOffset(Math.max(0, B.left - 1));
  }
  function startBoss() {
    stopBoss();
    bossTimer = setInterval(function () {
      var B = S.boss;
      if (S.screen !== "boss" || !B.started || B.done || B.answered[B.i] !== undefined) return stopBoss();
      B.left = Math.max(0, B.left - 1);
      paintRing();
      if (B.left === 0) answerBoss(-1);
    }, 1000);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (bossTimer) paintRing(); }); });
  }
  function answerBoss(i) {
    var B = S.boss, q = BOSS[B.i];
    if (B.answered[B.i] !== undefined) return;
    stopBoss();
    B.answered[B.i] = i;
    if (i !== q.a) hit(5);
    render();
    var n = document.getElementById("next"); if (n) n.focus({ preventScroll: true });
  }
  function jokerFor(cat) { return S.inv.filter(function (c) { return catOf(c) === cat; })[0]; }
  function bossGood() { return BOSS.filter(function (b, k) { return S.boss.answered[k] === b.a; }).length; }
  function ringSVG(left, state) {
    var label = state === "goed" ? "Goed beantwoord" : state === "fout" ? (left > 0 ? "Fout beantwoord" : "Te laat") : left + " seconden";
    var mid = state === "goed" ? '<path class="ring-mark" d="M33 49l10 10 20-22"/>'
      : state === "fout" && left > 0 ? '<path class="ring-mark" d="M36 36l24 24M60 36 36 60"/>'
      : '<text class="ring-num" x="48" y="58" text-anchor="middle">' + left + "</text>";
    return '<svg viewBox="0 0 96 96" role="img" aria-label="' + label + '"><circle class="ring-track" cx="48" cy="48" r="40"/>' +
      '<circle class="ring-arc" cx="48" cy="48" r="40" stroke-dasharray="' + RING_C + '" style="stroke-dashoffset:' + ringOffset(left) + '" transform="rotate(-90 48 48)"/>' + mid + "</svg>";
  }
  /* Zes vakjes, één per thema. De stand staat er in tekst en teken. */
  function bossTiles() {
    var B = S.boss;
    return '<ol class="nevel-rij" aria-label="Stand per thema">' + BOSS.map(function (b, k) {
      var a = B.answered[k], st = a !== undefined ? (a === b.a ? "vrij" : "mis") : (B.started && !B.done && k === B.i ? "nu" : "nevel");
      return '<li class="is-' + st + '"><span class="nr-naam">' + cap(b.cat) + '</span><span class="nr-stand">' + icon(STAND[st][1]) + STAND[st][0] + "</span></li>";
    }).join("") + "</ol>";
  }
  function point(ic, text) { return "<li>" + icon(ic) + "<span>" + text + "</span></li>"; }
  function renderBossIntro() {
    show('<div class="nevel">' +
      head(["Eindmissie, deel 2", ["Zes aanvallen", "rood", "warn"], [calm() ? "Tijdsdruk uit, dus zonder klok" : BOSS_SECONDS + " seconden per aanval", "", "clock"]], "De laatste aanval") +
      speech("aria", "De Zwarte Nevel valt nog één keer aan, met alles wat je in de levels bent tegengekomen.") +
      '<div class="twee">' +
      '<section class="kaart"><h3>Zo werkt het</h3><ul class="punten">' +
      point("clock", "Je hebt " + BOSS_SECONDS + " seconden per aanval.") +
      point("check", "Elk goed antwoord bevrijdt een thema uit de nevel.") +
      point("gem", "Heb je een passend datakristal, dan kun je het één keer per aanval als joker gebruiken.") +
      "</ul></section>" +
      '<section class="kaart"><h3>Goed om te weten</h3><ul class="punten">' +
      point("shield", "Een fout antwoord of te laat kost 5 procent schild.") +
      point("x", "De joker haalt één fout antwoord weg.") +
      point("award", "Zes goed levert 10 punten op, vijf goed 5 punten.") +
      "</ul></section></div>" +
      bossTiles() +
      '<div class="actions"><button class="vcsw-button lg" id="go">Start de aanval' + icon("next") + "</button></div></div>", "is-smal");
    document.getElementById("go").onclick = function () { S.boss.started = true; S.boss.left = BOSS_SECONDS; render(); };
  }
  function jokerRow(q) {
    var B = S.boss, j = jokerFor(q.cat);
    if (j && B.joker[B.i] === undefined) return '<button class="vcsw-button outline" id="joker">Speel kristal als joker' + icon("gem") + '</button><p class="muted">Kristal ' + esc(j) + ". Eén keer per aanval.</p>";
    return '<p class="muted">' + (j ? "Joker gebruikt. Eén fout antwoord is weg." : "Geen passend kristal voor " + q.cat + ", dus geen joker.") + "</p>";
  }
  function renderBoss() {
    var B = S.boss;
    if (!B.started) return renderBossIntro();
    if (B.done) return renderBossDone();
    var q = BOSS[B.i], ans = B.answered[B.i], answered = ans !== undefined, good = answered && ans === q.a;
    var html = '<div class="nevel"><div class="nevel-kaart' + (answered ? (good ? " is-goed" : " is-fout") : "") + '">' +
      '<div class="nevel-kop"><div class="ring' + (answered ? " is-stil" : B.left <= 5 ? " low" : "") + '" id="timer" aria-live="off">' + ringSVG(B.left, answered ? (good ? "goed" : "fout") : "loopt") + "</div>" +
      '<div class="kop"><h2>Aanval ' + (B.i + 1) + " van " + BOSS.length + ": " + q.cat + '</h2><p class="nevel-sub">' + icon("warn") + "De Zwarte Nevel valt deze module aan</p></div></div>" +
      '<p class="nevel-vraag">' + esc(q.t) + "</p>" +
      '<div class="options" role="group" aria-label="Kies je antwoord">';
    q.o.forEach(function (o, k) {
      if (B.joker[B.i] === k && !answered) return;
      var cls = "option" + (answered ? (k === ans ? " picked" : k === q.a ? " juist" : " dim") : "");
      /* Alleen het gekozen antwoord krijgt .verdict: daaraan leest de brug de uitslag af. */
      var badge = !answered ? "" : k === ans ? '<span class="verdict">' + (good ? '<span class="vcsw-badge success">' + icon("check") + "Goed, bevrijd</span>" : '<span class="vcsw-badge danger">' + icon("x") + "Fout, −5% schild</span>") + "</span>"
        : k === q.a ? '<span class="goede"><span class="vcsw-badge success">' + icon("check") + "Juist antwoord</span></span>" : "";
      html += '<button class="' + cls + '" data-o="' + k + '"' + (answered ? " disabled" : "") + '><span class="key" aria-hidden="true">' + "ABC"[k] + '</span><span class="tekst"><span class="vcsw-sr-only">Optie ' + "ABC"[k] + ". </span>" + esc(o) + "</span>" + badge + "</button>";
    });
    html += "</div>";
    if (!answered) html += '<div class="nevel-joker" id="jokerRow">' + jokerRow(q) + "</div>";
    else html += '<div class="feedback">' + (ans === -1 ? '<p class="telaat">' + icon("clock") + "<span><strong>Te laat.</strong> De tijd was op. Dat telt als fout en kost 5 procent schild.</span></p>" : "") +
      speech("aria", (good ? "Goed. " : "Fout. ") + q.why) + "</div>" +
      '<div class="actions"><button class="vcsw-button lg" id="next">' + (B.i < BOSS.length - 1 ? "Volgende aanval" : "Bekijk de uitslag") + icon("next") + "</button></div>";
    html += "</div>" + bossTiles() + "</div>";
    show(html, "is-smal");
    if (!answered) {
      if (!bossTimer) startBoss();
      stage.querySelectorAll("[data-o]").forEach(function (b) { b.onclick = function () { answerBoss(+b.getAttribute("data-o")); }; });
      var jb = document.getElementById("joker");
      /* De joker haalt één fout antwoord weg zonder het scherm opnieuw te tekenen, zodat de klok doorloopt. */
      if (jb) jb.onclick = function () {
        var wrong = [0, 1, 2].filter(function (k) { return k !== q.a; });
        B.joker[B.i] = wrong[Math.floor(Math.random() * wrong.length)];
        var gone = stage.querySelector('[data-o="' + B.joker[B.i] + '"]'), keep = stage.querySelector('[data-o="' + q.a + '"]');
        if (gone) gone.remove();
        document.getElementById("jokerRow").innerHTML = jokerRow(q);
        if (keep) keep.parentNode.querySelector("[data-o]").focus({ preventScroll: true });
      };
    } else {
      document.getElementById("next").onclick = function () {
        if (B.i < BOSS.length - 1) { B.i++; B.left = BOSS_SECONDS; }
        else {
          B.done = true;
          var n = bossGood(), r = n === 6 ? "goed" : n === 5 ? "half" : "fout";
          S.picks.boss = { r: r, good: n }; S.score += POINTS[r];
        }
        render();
      };
    }
  }
  function renderBossDone() {
    var p = S.picks.boss;
    show('<div class="nevel">' + head(["Eindmissie, deel 2", [p.good + " van " + BOSS.length + " bevrijd", p.good === BOSS.length ? "groen" : "blauw", "check"]], "De aanval is afgeslagen") +
      '<div class="badges">' + verdictBadge(p.r) + "</div>" +
      speech("aria", p.good === BOSS.length ? "Alle zes thema’s zijn bevrijd. De Zwarte Nevel komt er niet meer in. Nu nog de hoofdsluis zelf." : "De Zwarte Nevel is teruggedrongen, maar niet elk thema is bevrijd. Kijk nog eens naar de thema’s waar Niet bevrijd bij staat. Nu de hoofdsluis zelf.") +
      bossTiles() +
      '<div class="actions"><button class="vcsw-button lg" id="next">Naar de hoofdsluis' + icon("next") + "</button></div></div>", "is-smal");
    document.getElementById("next").onclick = function () { S.screen = "lock"; render(); };
  }

  /* ---------- Hoofdsluis: vijf grendels met elk drie kernregels ---------- */
  var BOLT_ANG = [-90, -18, 54, 126, 198];
  function pol(r, deg) { var a = deg * Math.PI / 180; return [(280 + r * Math.cos(a)).toFixed(1), (280 + r * Math.sin(a)).toFixed(1)]; }
  function lockOpen() { return S.lock.bolts.filter(function (b) { return b.open; }).length; }
  /* De deur is één SVG. Klassen op de onderdelen sturen lampjes, grendels en het openzwaaien via CSS. */
  function doorSVG() {
    var s = '<svg class="deur" id="deur" viewBox="0 0 560 560" role="img" aria-label="De hoofdsluis"><defs>' +
      '<clipPath id="deurGat"><circle cx="280" cy="280" r="214"/></clipPath><clipPath id="deurAarde"><circle cx="280" cy="940" r="560"/></clipPath>' +
      '<radialGradient id="dSchijfG" cx="36%" cy="28%" r="85%"><stop offset="0" stop-color="#2c61a6"/><stop offset=".5" stop-color="#15386a"/><stop offset="1" stop-color="#0a1f42"/></radialGradient>' +
      '<linearGradient id="dKozijnG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b4a80"/><stop offset=".6" stop-color="#0b2548"/><stop offset="1" stop-color="#06162f"/></linearGradient>' +
      '<linearGradient id="dBalkG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d3dce8"/><stop offset="1" stop-color="#70819a"/></linearGradient>' +
      '<radialGradient id="dNaafG" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#f1f5fa"/><stop offset="1" stop-color="#93a3b9"/></radialGradient></defs>' +
      '<circle class="d-kozijn" cx="280" cy="280" r="272"/><circle class="d-kozijn-lijn" cx="280" cy="280" r="262"/>';
    var i, p, q, seed = 11;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (i = 0; i < 24; i++) { p = pol(249, i * 15 + 7.5); s += '<circle class="d-klinknagel" cx="' + p[0] + '" cy="' + p[1] + '" r="5"/>'; }
    s += '<circle class="d-sponning" cx="280" cy="280" r="236"/>';
    /* Wat er achter de deur ligt: sterren en de rand van de aarde. */
    s += '<g clip-path="url(#deurGat)"><rect class="d-ruimte" x="60" y="60" width="440" height="440"/><g class="d-sterren">';
    for (i = 0; i < 44; i++) s += '<circle cx="' + (80 + rnd() * 400).toFixed(0) + '" cy="' + (76 + rnd() * 290).toFixed(0) + '" r="' + (1.5 + rnd() * 2).toFixed(1) + '"/>';
    s += '</g><circle class="d-zee-rand" cx="280" cy="940" r="560"/><circle class="d-zee" cx="280" cy="950" r="560"/><g clip-path="url(#deurAarde)">' +
      '<path class="d-land" d="M170 432q26-22 70-22 42 2 56 22 8 22-24 34-44 14-84 2-26-12-18-36z"/>' +
      '<path class="d-land" d="M366 418q24-12 58-6 32 8 42 28-6 20-42 22-40 0-58-20-8-14 0-24z"/>' +
      '<path class="d-land" d="M306 470q16-8 32-2 8 10-6 16-20 4-28-6-2-4 2-8z"/>' +
      '<path class="d-wolk" d="M138 416q46-12 96-6M292 448q52-8 104 2M196 486q40-8 86 0"/></g>' +
      '<circle class="d-dampkring" cx="280" cy="940" r="560"/></g>' +
      '<circle class="d-rand" cx="280" cy="280" r="214"/>';
    /* Het deurblad: schijf, naden, vijf grendels in hun rail en de naaf. */
    s += '<g class="d-blad"><circle class="d-schijf" cx="280" cy="280" r="214"/><circle class="d-groef" cx="280" cy="280" r="198"/><circle class="d-groef" cx="280" cy="280" r="150"/>';
    BOLT_ANG.forEach(function (a) { p = pol(74, a + 36); q = pol(211, a + 36); s += '<path class="d-naad" d="M' + p[0] + " " + p[1] + "L" + q[0] + " " + q[1] + '"/>'; });
    BOLT_ANG.forEach(function (a, g) {
      s += '<g transform="rotate(' + a + ' 280 280)"><rect class="d-rail" x="352" y="252" width="138" height="56" rx="10"/>' +
        '<g class="d-grendel" data-g="' + g + '"><g class="d-schuif"><rect class="d-balk" x="398" y="260" width="128" height="40" rx="10"/>';
      for (i = 0; i < 3; i++) s += '<circle class="d-lamp" data-lamp="' + (g * 3 + i) + '" cx="' + (428 + i * 30) + '" cy="280" r="8"/>';
      s += "</g></g></g>";
    });
    s += '<g class="d-naaf"><circle class="d-naaf-schijf" cx="280" cy="280" r="62"/><circle class="d-naaf-ring" cx="280" cy="280" r="47"/>';
    BOLT_ANG.forEach(function (a) { p = pol(56, a); s += '<path class="d-spaak" d="M280 280L' + p[0] + " " + p[1] + '"/>'; });
    s += '<circle class="d-naaf-kern" cx="280" cy="280" r="20"/><circle class="d-naaf-dop" cx="280" cy="280" r="7"/></g></g>';
    /* Scharnieren en de vijf houders op het kozijn, met het nummer van de grendel. */
    s += '<rect class="d-scharnier" x="44" y="236" width="42" height="24" rx="6"/><rect class="d-scharnier" x="44" y="300" width="42" height="24" rx="6"/>';
    BOLT_ANG.forEach(function (a, g) {
      p = pol(243, a);
      s += '<g transform="rotate(' + a + ' 280 280)"><rect class="d-houder" data-g="' + g + '" x="504" y="252" width="38" height="56" rx="7"/></g>' +
        '<text class="d-cijfer" data-g="' + g + '" x="' + p[0] + '" y="' + (+p[1] + 9.5).toFixed(1) + '" text-anchor="middle">' + (g + 1) + "</text>";
    });
    /* Vijf bogen op het kozijn: van ver zie je welke grendels open zijn. */
    BOLT_ANG.forEach(function (a, g) {
      p = pol(272, a - 27); q = pol(272, a + 27);
      s += '<path class="d-boog" data-g="' + g + '" d="M' + p[0] + " " + p[1] + "A272 272 0 0 1 " + q[0] + " " + q[1] + '"/>';
    });
    return s + "</svg>";
  }
  function syncDoor() {
    var L = S.lock, d = document.getElementById("deur"), n = lockOpen();
    if (!d) return;
    d.classList.toggle("is-open", L.solved);
    d.style.setProperty("--open", n);
    d.setAttribute("aria-label", L.solved ? "De hoofdsluis staat open, met zicht op de sterren en de aarde" : "De hoofdsluis met vijf grendels, " + n + " van 5 open");
    L.bolts.forEach(function (b, g) {
      d.querySelectorAll('[data-g="' + g + '"]').forEach(function (el) { el.classList.toggle("is-open", b.open); el.classList.toggle("is-nu", !b.open && !L.solved && g === L.g); });
    });
    RULES.forEach(function (_, id) {
      var lamp = d.querySelector('[data-lamp="' + id + '"]');
      lamp.classList.toggle("aan", !!L.fill[id]); lamp.classList.toggle("fout", !!L.wrong[id]);
    });
  }
  function ruleCard(id) {
    var L = S.lock, R = RULES[id].r, v = L.fill[id], open = L.bolts[RULES[id].g].open, st = open || L.right[id] ? "goed" : L.wrong[id] ? "fout" : "";
    return '<div class="regel' + (st ? " is-" + st : "") + '"><span class="regel-nr" aria-hidden="true">' + (id + 1) + '</span><div class="regel-in">' +
      '<p class="regel-zin"><span class="vcsw-sr-only">Regel ' + (id + 1) + ". </span>" + esc(R.pre) + ' <span class="gat' + (v ? " vol" : "") + '">' + (v ? esc(v) : '<span class="vcsw-sr-only">ontbrekend woord</span>') + "</span>" + (/^[.,]/.test(R.post) ? "" : " ") + esc(R.post) +
      ' <span class="regel-oordeel">' + (st === "goed" ? icon("check") + "Klopt" : st === "fout" ? icon("x") + "Niet goed" : "") + "</span></p>" +
      '<div class="woorden" role="group" aria-label="Ontbrekend woord in regel ' + (id + 1) + '">' +
      L.opts[id].map(function (o, w) { return '<button type="button" class="woord" data-r="' + id + '" data-w="' + w + '" aria-pressed="' + (v === o) + '"' + (open ? " disabled" : "") + '><span class="woord-vink" aria-hidden="true">' + icon("check") + "</span>" + esc(o) + "</button>"; }).join("") +
      "</div></div></div>";
  }
  function boltIds(g) { return [g * 3, g * 3 + 1, g * 3 + 2]; }
  /* De knop en de regel eronder volgen de stand, zonder de regels opnieuw te tekenen. */
  function lockActions() {
    var L = S.lock, bolt = L.bolts[L.g], ids = boltIds(L.g), msg = document.getElementById("sluisMsg"), c = document.getElementById("check");
    if (!msg || bolt.open) return;
    var missing = ids.filter(function (id) { return !L.fill[id]; }).length, wrong = ids.filter(function (id) { return L.wrong[id]; }).length;
    if (c) c.disabled = missing > 0;
    var cost = bolt.attempts ? " Een nieuwe poging kost 5 procent schild." : " Een nieuwe poging na een fout kost 5 procent schild.";
    var text = missing ? (missing === 1 ? "Nog één regel zonder woord." : "Nog " + missing + " regels zonder woord.") + cost
      : wrong ? (wrong === 1 ? "Eén regel klopt nog niet." : wrong + " regels kloppen nog niet.") + cost
      : (bolt.attempts ? "Alle drie de regels hebben een woord." : "Alle drie de regels hebben een woord. Schuif de grendel open.") + (bolt.attempts ? cost : "");
    var fout = !missing && wrong > 0;
    msg.className = "sluis-msg" + (fout ? " is-fout" : "");
    msg.innerHTML = (fout ? icon("x") : "") + "<span>" + text + "</span>";
  }
  function paintLock() {
    var L = S.lock, kop = document.getElementById("sluisKop"), lijf = document.getElementById("sluisLijf"), n = lockOpen();
    if (!kop) return;
    syncDoor(); hud();
    if (L.solved) return paintLockOpen(kop, lijf);
    var g = L.g, bolt = L.bolts[g];
    kop.innerHTML = '<div class="sluis-titel"><h2>Grendel ' + (g + 1) + " van 5: " + BOLTS[g] + "</h2>" +
      chips(["Eindmissie, deel 3", [n + " van 5 grendels open", n ? "groen" : "blauw", n ? "unlock" : "lock"]]) + "</div>" +
      '<ol class="grendels" aria-label="Voortgang per grendel">' + BOLTS.map(function (name, k) {
        var st = L.bolts[k].open ? "open" : k === g ? "nu" : "dicht";
        return '<li class="is-' + st + '"' + (st === "nu" ? ' aria-current="step"' : "") + '><span class="g-naam">' + (k + 1) + '<span class="g-tekst"> ' + name + '</span></span><span class="g-stand">' + icon(st === "open" ? "check" : st === "nu" ? "next" : "lock") + (st === "dicht" ? '<span class="vcsw-sr-only">Dicht</span>' : st === "open" ? "Open" : "Nu") + "</span></li>";
      }).join("") + "</ol>";
    lijf.innerHTML = '<div class="regels">' + boltIds(g).map(ruleCard).join("") + "</div>" +
      '<div class="sluis-acties">' + (bolt.open
        ? '<button class="vcsw-button lg" id="next">Volgende grendel: ' + BOLTS[g + 1] + icon("next") + '</button><p class="sluis-msg is-goed">' + icon("check") + "<span>Grendel " + (g + 1) + " is open. De drie regels kloppen.</span></p>"
        : '<button class="vcsw-button lg" id="check">Schuif de grendel open' + icon("unlock") + "</button>" +
          (bolt.attempts >= 2 ? '<button class="vcsw-button outline lg" id="reveal">' + icon("bulb") + "Toon de juiste woorden</button>" : "") +
          '<p class="sluis-msg" id="sluisMsg"></p>') + "</div>";
    lockActions();
    lijf.querySelectorAll(".woord").forEach(function (b) { b.onclick = function () { pickWord(b); }; });
    var c = document.getElementById("check"), rv = document.getElementById("reveal"), nx = document.getElementById("next");
    if (c) c.onclick = checkBolt;
    if (rv) rv.onclick = function () {
      boltIds(g).forEach(function (id) { L.fill[id] = RULES[id].r.b; delete L.wrong[id]; delete L.right[id]; });
      paintLock(); document.getElementById("check").focus({ preventScroll: true });
    };
    if (nx) nx.onclick = function () {
      L.g = g + 1; L.wrong = {}; L.right = {};
      paintLock(); var first = lijf.querySelector(".woord"); if (first) first.focus({ preventScroll: true });
    };
  }
  /* Een woord kiezen: het woord komt in de zin, het lampje op de grendel gaat aan. */
  function pickWord(btn) {
    var L = S.lock, id = +btn.getAttribute("data-r"), card = btn.closest(".regel"), gat = card.querySelector(".gat");
    if (L.bolts[L.g].open) return;
    L.fill[id] = L.opts[id][+btn.getAttribute("data-w")]; delete L.wrong[id]; delete L.right[id];
    card.querySelectorAll(".woord").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    gat.textContent = L.fill[id]; gat.classList.add("vol");
    card.classList.remove("is-fout", "is-goed");
    card.querySelector(".regel-oordeel").innerHTML = "";
    syncDoor(); lockActions();
  }
  function checkBolt() {
    var L = S.lock, g = L.g, bolt = L.bolts[g], good = 0;
    L.wrong = {}; L.right = {};
    boltIds(g).forEach(function (id) { if (L.fill[id] === RULES[id].r.b) { good++; L.right[id] = true; } else L.wrong[id] = true; });
    if (bolt.attempts) hit(5);
    if (!bolt.attempts) bolt.firstGood = good;
    bolt.attempts++;
    if (good === 3) {
      bolt.open = true;
      if (lockOpen() === BOLTS.length) {
        /* Alle vijftien regels kloppen. De telling van de eerste poging bepaalt de punten. */
        var first = L.bolts.reduce(function (n, b) { return n + b.firstGood; }, 0), r = first === 15 ? "goed" : first >= 13 ? "half" : "fout";
        L.solved = true; S.picks.lock = { r: r, good: first }; S.score += POINTS[r];
      }
    }
    paintLock();
    var to = document.getElementById("next") || document.querySelector(".regel.is-fout .woord") || document.getElementById("check");
    if (to) to.focus({ preventScroll: true });
  }
  function paintLockOpen(kop, lijf) {
    var L = S.lock, p = S.picks.lock, extra = L.bolts.reduce(function (n, b) { return n + Math.max(0, b.attempts - 1); }, 0);
    kop.innerHTML = '<div class="sluis-titel"><h2 class="groot">De hoofdsluis is open</h2>' + chips(["Eindmissie, deel 3", ["Alle vijf grendels open", "groen", "check"]]) + "</div>" +
      '<p class="sluis-lead">De laatste aanvallers van de Zwarte Nevel zijn definitief buitengesloten. Je kent de vijftien kernregels van de Datawacht.</p>';
    document.getElementById("sluisUitleg").textContent = "De deur staat open. Daarachter zie je de sterren en de rand van de aarde.";
    lijf.innerHTML = '<ol class="sluis-lijst">' + BOLTS.map(function (name, k) {
      return "<li>" + icon("unlock") + '<span class="sl-naam">Grendel ' + (k + 1) + ": " + name + '</span><span class="sl-stand">' + L.bolts[k].firstGood + " van 3 in één keer</span></li>";
    }).join("") + "</ol>" +
      '<div class="kaart cijfers"><div><p class="cijfer-label">In één keer goed</p><p class="cijfer">' + p.good + ' van 15 regels</p><div class="badges">' + verdictBadge(p.r) + "</div></div>" +
      '<div><p class="cijfer-label">Schild</p><p class="cijfer">' + S.shield + "%</p></div>" +
      '<div><p class="cijfer-label">Extra pogingen</p><p class="cijfer">' + extra + "</p></div></div>" +
      '<div class="sluis-acties"><button class="vcsw-button lg" id="next">Naar de afsluiting' + icon("next") + "</button></div>";
    document.getElementById("next").onclick = function () { S.screen = "end"; render(); };
  }
  function renderLock() {
    show('<div class="sluis"><div class="sluis-kop" id="sluisKop"></div>' +
      '<div class="sluis-grid"><div class="sluis-links"><div class="sluis-deur">' + doorSVG() + "</div>" +
      '<p class="sluis-uitleg" id="sluisUitleg">Elke grendel vraagt de drie kernregels van één level. Kies per regel het woord dat ontbreekt. Elk gekozen woord zet een lampje op de grendel aan. Kloppen alle drie, dan schuift de grendel open.</p></div>' +
      '<div class="sluis-lijf" id="sluisLijf"></div></div></div>', "is-smal");
    paintLock();
  }

  /* ---------- Afsluiting ---------- */
  function cheatText() {
    var n = 0;
    return "Spiekbrief AVG-game Ruimtestation Orion: de vijftien kernregels\n\n" + CHEAT.map(function (l) {
      return l.lvl + "\n" + l.rules.map(function (r) { n++; return n + ". " + r; }).join("\n");
    }).join("\n\n") + "\n\nTwijfel of een incident? Meld het bij Tarik, Dagmar of via jz@vcsw.nl.";
  }
  function result() { var MAX = maxScore(), pct = Math.round(S.score / MAX * 100); return { max: MAX, pct: pct, passed: pct >= 70 }; }
  function renderEnd() {
    var R = result(), MAX = R.max, pct = R.pct, passed = R.passed;
    if (passed && S.endView === "spiekbrief") return renderCheat();
    var html = head(["Eindmissie, deel 4", passed ? ["Gehaald", "groen", "check"] : ["Nog niet gehaald", "goud"]], passed ? "Admiraal van de Datawacht" : "Nog niet gehaald");
    html += speech("aria", passed
      ? "Admiraal. Je hebt het station door vijf modules en een eindmissie geloodst. De gegevens aan boord zijn veilig, en iedereen weet dat ze bij jou in goede handen zijn."
      : "Je hebt minder dan 70 procent. Speel de eindmissie opnieuw. In de echte game krijg je dan andere situaties.");
    if (passed) html += '<div class="reward">' + icon("award") + "<div><strong>Benoemd tot Admiraal van de Datawacht</strong><br><span>Badges: Lekbestendig. Rangen: Cadet, Vaandrig, Luitenant, Commandeur, Kapitein, Admiraal.</span></div></div>";
    html += '<div class="kaart cijfers gelijk"><div><p class="cijfer-label">Score</p><p class="cijfer">' + pct + '%</p><p class="cijfer-noot">' + S.score + " van " + MAX + " punten</p></div>" +
      '<div><p class="cijfer-label">Schildsterkte</p><p class="cijfer">' + S.shield + '%</p><p class="cijfer-noot">vertrouwen aan boord</p></div>' +
      '<div><p class="cijfer-label">Datakristallen</p><p class="cijfer">' + S.inv.length + '</p><p class="cijfer-noot">in je inventaris</p></div></div>';
    var rows = [["Fase 1, het verzoek", S.picks.f1 && F1.opts.filter(function (o) { return o.k === S.picks.f1; })[0].r],
      ["Fase 2, de identiteit", S.picks.f2 && F2.opts.filter(function (o) { return o.k === S.picks.f2; })[0].r],
      ["Fase 3, de zoektocht", S.picks.f3.r], ["Fase 4, het antwoord", S.picks.f4.r]];
    if (hasJoran()) rows.push(["De klacht van Joran", JORAN.opts.filter(function (o) { return o.k === S.picks.joran; })[0].r]);
    rows.push(["Eindbaas, " + S.picks.boss.good + " van 6 thema’s bevrijd", S.picks.boss.r]);
    rows.push(["Hoofdsluis, " + S.picks.lock.good + " van 15 regels in één keer", S.picks.lock.r]);
    html += '<div><h3>Jouw resultaten</h3><ul class="result-list">' + rows.map(function (r) { return "<li><span>" + r[0] + "</span>" + verdictBadge(r[1]) + "</li>"; }).join("") + "</ul></div>";
    html += '<div class="actions">' + (passed ? '<button class="vcsw-button outline lg" id="cheat">' + icon("file") + "Bekijk de spiekbrief</button>" : '<button class="vcsw-button outline lg" id="again">' + icon("refresh") + "Speel opnieuw</button>") +
      '<button class="vcsw-button lg" id="earth">Terug op aarde' + icon("next") + "</button></div>";
    show(html, "is-smal is-eind");
    var ch = document.getElementById("cheat"); if (ch) ch.onclick = function () { S.endView = "spiekbrief"; render(); window.scrollTo(0, 0); };
    var a = document.getElementById("again"); if (a) a.onclick = restart;
    document.getElementById("earth").onclick = function () { S.screen = "earth"; render(); };
  }
  /* De spiekbrief is een eigen stap van de afsluiting, zodat de uitslag en de vijftien regels elk op één scherm passen. */
  function renderCheat() {
    var n = 0;
    show(head(["Eindmissie, deel 4", "Spiekbrief"], "Spiekbrief: de vijftien kernregels") +
      '<div class="cheat-twee">' + CHEAT.map(function (l) {
        var start = n + 1; n += l.rules.length;
        return '<div class="cheat-blok"><p class="cheat-level">' + esc(l.lvl) + '</p><ol class="cheat" start="' + start + '">' + l.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol></div>";
      }).join("") + "</div>" +
      '<p class="muted" id="copyMsg" role="status"></p>' +
      '<div class="actions"><button class="vcsw-button outline lg" id="back">' + icon("back") + "Terug naar je resultaat</button>" +
      '<button class="vcsw-button outline lg" id="copy">' + icon("copy") + "Kopieer de spiekbrief</button>" +
      '<button class="vcsw-button lg" id="earth">Terug op aarde' + icon("next") + "</button></div>", "is-smal is-eind");
    document.getElementById("back").onclick = function () { S.endView = "uitslag"; render(); window.scrollTo(0, 0); };
    document.getElementById("copy").onclick = function () {
      var msg = document.getElementById("copyMsg");
      copyText(cheatText(), this, function (ok) { msg.textContent = ok ? "De spiekbrief staat op je klembord." : "Kopiëren lukte niet. Selecteer de regels hierboven en kopieer ze zelf."; });
    };
    document.getElementById("earth").onclick = function () { S.screen = "earth"; render(); };
  }

  /* ---------- Terug op aarde ---------- */
  function meter(pct, kind, mark) { return '<div class="meter"><span class="vul' + (kind ? " " + kind : "") + '" style="width:' + Math.max(0, Math.min(100, pct)) + '%"></span>' + (mark ? '<span class="grens" style="left:' + mark + '%"></span>' : "") + "</div>"; }
  function renderEarth() {
    var known = !!S.lock.solved, R = result(), got = has(F1.crystal.name) ? 1 : 0;
    var html = '<div class="aarde"><div class="kop"><h2>Wat betekent dit voor je werk bij VCSW</h2><p class="aarde-lead">Het station is verzonnen. Dit neem je mee naar je werk.</p></div>' +
      '<div class="twee">' +
      '<section class="kaart"><h3>Hier gaat het om</h3><ul class="punten">' +
      point("clock", "Er geldt een termijn van een maand.") +
      point("search", "Gegevens over iemand staan vaak op meer plekken dan je denkt, ook in Teams-berichten en mailboxen.") +
      "</ul></section>" +
      '<section class="kaart"><h3>Dit doe je morgen</h3><ul class="punten">' +
      point("mail", "Krijg je een inzageverzoek, zet het dan direct door via Tarik, Dagmar of jz@vcsw.nl.") +
      point("calendar", "Noteer de datum van ontvangst.") +
      "</ul></section></div>" +
      '<section class="kaart meldroute"><div class="meld-tekst"><h3>Meldroute</h3><p>Een inzageverzoek, twijfel of een incident? Meld het bij Tarik, Dagmar of via het meldpunt.</p><p class="meld-status" id="adresMsg" role="status"></p></div>' +
      '<span class="adres" id="adres">jz@vcsw.nl</span><button type="button" class="vcsw-button outline lg" id="copyAdres">Kopieer adres' + icon("copy") + "</button></section>";
    html += '<section class="kaart uitslag"><div class="uitslag-kop"><h3>Resultaat eindmissie</h3>' + (known ? (R.passed ? chip("Gehaald", "groen", "check") : chip("Nog niet gehaald", "goud")) : chip("Nog niet uitgespeeld")) +
      '<button class="vcsw-button lg" id="again">Speel de eindmissie opnieuw' + icon("refresh") + "</button></div>" +
      '<div class="uitslag-drie">' +
      '<div><p class="cijfer-label">Score</p><p class="cijfer klein">' + S.score + " van " + R.max + " punten</p>" + meter(R.pct, "", 70) + '<p class="cijfer-noot">' + R.pct + " procent. Je hebt 70 procent nodig.</p></div>" +
      '<div><p class="cijfer-label">Schild</p><p class="cijfer klein">' + S.shield + " procent</p>" + meter(S.shield, S.shield < 50 ? "rood" : S.shield < 80 ? "goud" : "", 0) + '<p class="cijfer-noot">Het schild telt niet mee voor halen. Het laat zien hoe zeker je speelde.</p></div>' +
      '<div><p class="cijfer-label">Kristallen</p><p class="cijfer klein">' + got + " van 1</p>" + meter(got * 100, "goud", 0) + '<p class="cijfer-noot">Verdiend in de eindmissie. In je inventaris zitten er nu ' + S.inv.length + ".</p></div>" +
      "</div></section></div>";
    show(html, "is-smal");
    document.getElementById("copyAdres").onclick = function () {
      var msg = document.getElementById("adresMsg");
      copyText("jz@vcsw.nl", this, function (ok) { msg.textContent = ok ? "Het adres staat op je klembord." : "Kopiëren lukte niet. Selecteer het adres en kopieer het zelf."; });
    };
    document.getElementById("again").onclick = restart;
  }

  function restart() { stopTimer(); stopBoss(); var fl = S.flags; S = fresh(fl); render(); window.scrollTo(0, 0); }

  function render() {
    var s = S.screen;
    document.documentElement.setAttribute("data-screen", s);
    if (s === "brief") renderBrief();
    else if (s === "f1") renderChoice(F1, "Fase 1", "f2");
    else if (s === "f2") renderChoice(F2, "Fase 2", "f3");
    else if (s === "f3") renderF3();
    else if (s === "f4") renderF4();
    else if (s === "joran") renderChoice(JORAN, ["Fase 4", "Doorwerking"], "boss");
    else if (s === "boss") renderBoss();
    else if (s === "lock") renderLock();
    else if (s === "end") renderEnd();
    else renderEarth();
  }

  /* ---------- Haak voor de schil: de stand van dit level, op elk moment ---------- */
  function stepIndex() { return ORDER.indexOf(S.screen === "joran" ? "f4" : S.screen); }
  window.orionStatus = function () {
    var done = !!S.lock.solved, R = result(), B = S.boss, step = stepIndex(), results = [], k;
    for (k = 0; k < BOSS.length; k++) if (B.answered[k] !== undefined) results.push(B.answered[k] === BOSS[k].a ? "good" : "bad");
    return {
      score: S.score, max: R.max, shield: S.shield,
      crystals: has(F1.crystal.name) ? 1 : 0, crystalsMax: 1,
      steps: LABELS.slice(), step: step,
      done: done, passed: done ? R.passed : null, pct: done ? R.pct : null,
      part: S.screen === "boss" ? 2 : S.screen === "lock" ? 3 : step > ORDER.indexOf("lock") ? 4 : 1,
      boss: step >= ORDER.indexOf("boss") ? { i: B.i, n: BOSS.length, results: results } : null,
      lock: { open: lockOpen(), n: BOLTS.length }
    };
  };

  /* ---------- Testsprong: ?scherm=<naam> begint direct op dat scherm, met een foutloos gespeeld voortraject.
     Namen: briefing, fase1, fase2, fase3, fase4, joran, aanval-start, aanval, aanval-klaar, sluis, sluis-open, afsluiting, spiekbrief, aarde.
     Met &n=<nummer> kies je bij aanval de aanval (1 tot 6) en bij sluis de grendel (1 tot 5). ---------- */
  function jump(name, n) {
    var MAP = { briefing: "brief", fase1: "f1", fase2: "f2", fase3: "f3", fase4: "f4", joran: "joran", "aanval-start": "boss", aanval: "boss", "aanval-klaar": "boss",
      sluis: "lock", "sluis-open": "lock", afsluiting: "end", spiekbrief: "end", aarde: "earth" };
    var target = MAP[name], k;
    if (!target) return;
    S = fresh(name === "joran" ? { kopie: false, vega: false, holonet: false, joran: true, missing: false } : null);
    var at = ORDER.indexOf(target === "joran" ? "f4" : target);
    if (at > ORDER.indexOf("f1")) { S.picks.f1 = "B"; S.score += 10; give(F1.crystal.name); }
    if (at > ORDER.indexOf("f2")) { S.picks.f2 = "B"; S.score += 10; }
    if (at > ORDER.indexOf("f3")) {
      var found = ROOMS.filter(function (r) { S.f3.searched[r.id] = true; return roomFound(r); });
      found.forEach(function (r) { S.f3.act[r.id] = r.ok ? "op" : "meld"; });
      S.f3.done = true; S.picks.f3 = { r: "goed", good: found.length, total: found.length }; S.score += 10;
    }
    if (at > ORDER.indexOf("f4") || target === "joran") { BLOCKS.forEach(function (b, i) { S.f4.assign[i] = b.in; }); S.f4.done = true; S.picks.f4 = { r: "goed", good: 10 }; S.score += 10; }
    if (target === "boss" && name !== "aanval-start") {
      S.boss.started = true;
      var upto = name === "aanval-klaar" ? BOSS.length : Math.max(1, Math.min(BOSS.length, n || 1)) - 1;
      for (k = 0; k < upto; k++) S.boss.answered[k] = BOSS[k].a;
      S.boss.i = Math.min(upto, BOSS.length - 1);
      if (name === "aanval-klaar") { S.boss.done = true; S.picks.boss = { r: "goed", good: 6 }; S.score += 10; }
    }
    if (at > ORDER.indexOf("boss")) {
      S.boss.started = true; S.boss.done = true; S.boss.i = BOSS.length - 1;
      BOSS.forEach(function (b, i) { S.boss.answered[i] = b.a; });
      S.picks.boss = { r: "goed", good: 6 }; S.score += 10;
      var bolts = at > ORDER.indexOf("lock") || name === "sluis-open" ? BOLTS.length : Math.max(1, Math.min(BOLTS.length, n || 1)) - 1;
      for (k = 0; k < bolts; k++) { boltIds(k).forEach(function (id) { S.lock.fill[id] = RULES[id].r.b; }); S.lock.bolts[k] = { attempts: 1, firstGood: 3, open: true }; }
      S.lock.g = Math.min(bolts, BOLTS.length - 1);
      if (bolts === BOLTS.length) { S.lock.solved = true; S.picks.lock = { r: "goed", good: 15 }; S.score += 10; }
    }
    if (name === "spiekbrief") S.endView = "spiekbrief";
    S.screen = target;
    if (target === "f3") startF3();
  }
  try { var Q = new URLSearchParams(location.search); if (Q.get("scherm")) jump(Q.get("scherm"), parseInt(Q.get("n"), 10)); } catch (e) {}

  render();
})();
