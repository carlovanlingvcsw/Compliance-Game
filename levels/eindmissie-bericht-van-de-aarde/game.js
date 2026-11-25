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
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'
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
      { k: "A", t: "Laten liggen tot het rustiger is aan boord.", r: "fout", uitleg: "Er geldt een vaste termijn. Die loopt vanaf de dag dat het verzoek binnenkomt.", reactie: "Ik hoor niets terug. Hebben jullie mijn bericht wel gekregen?" },
      { k: "B", t: "De ontvangst bevestigen, de datum noteren en het verzoek doorzetten naar het meldpunt.", r: "goed", uitleg: "Met de datum van ontvangst weet het meldpunt precies hoeveel tijd er is.", reactie: "Dank voor de bevestiging. Ik wacht jullie antwoord af." },
      { k: "C", t: "Meteen alles terugsturen wat je in je eigen berichten vindt.", r: "fout", uitleg: "Eerst controleer je haar identiteit. Daarna antwoord je volledig en veilig, via het meldpunt.", reactie: "Dit is maar een deel, toch? En hoe weten jullie eigenlijk dat ik het ben?" }
    ],
    crystal: { on: "B", name: "Termijn inzageverzoek", desc: "Antwoorden binnen een maand na ontvangst, met mogelijkheid tot verlenging bij complexe verzoeken als je de betrokkene daar binnen die maand over informeert." }
  };
  var F2 = {
    id: "f2", title: "Is dit echt Lyra?", who: "aria",
    say: "Voordat we iets terugsturen, moeten we zeker weten dat dit bericht echt van Lyra Jansen komt. Hoe controleer je dat?",
    opts: [
      { k: "A", t: "Een volledige identiteitsscan vragen, inclusief identiteitsnummer.", r: "fout", uitleg: "Je vraagt meer gegevens dan nodig is. Dat is precies wat je in deze game steeds hebt geleerd te vermijden.", reactie: "Nu hebben we haar identiteitsnummer erbij. Dat moeten we straks ook weer beveiligen." },
      { k: "B", t: "Controleren of het bericht komt van het adres waarmee ze zich aanmeldde, of een controlevraag stellen over haar aanmelding.", r: "goed", uitleg: "Zo controleer je haar identiteit met gegevens die je al hebt.", reactie: "Het adres klopt met haar aanmelding. Het is echt Lyra." },
      { k: "C", t: "Geen controle, het zal wel kloppen.", r: "fout", uitleg: "Zo kunnen gegevens bij de Zwarte Nevel terechtkomen.", reactie: "Mijn sensoren zien dat de Zwarte Nevel vaker zulke verzoeken stuurt. Weet je het zeker?" }
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
      { k: "A", t: "Zelf je excuses aanbieden en het daarbij laten.", r: "fout", uitleg: "Excuses zijn goed, maar dit is een klacht over het delen van medische informatie. Die moet het meldpunt beoordelen, ook als mogelijk datalek." , reactie: "Fijn dat je sorry zegt. Maar wie zorgt dat het niet nog eens gebeurt?" },
      { k: "B", t: "Je excuses aanbieden en zijn klacht met de datum van ontvangst doorzetten naar het meldpunt, net als het verzoek van Lyra.", r: "goed", uitleg: "Beide verzoeken gaan correct naar het meldpunt. Het meldpunt beoordeelt ook of hier sprake is van een datalek.", reactie: "Dank je. Dan weet ik dat er echt naar gekeken wordt." },
      { k: "C", t: "Joran vragen zijn klacht in te trekken. Het was goed bedoeld.", r: "fout", uitleg: "Je zet niemand onder druk om een klacht in te trekken. Het meldpunt moet hem beoordelen.", reactie: "Goed bedoeld? Iedereen weet het nu." }
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
    { lvl: "Level 5: Hullbreuk! Alarmfase", rules: [
      { pre: "Een datalek meld je", post: ", ook aan het eind van je dienst.", b: "direct", x: ["binnen 72 uur", "na overleg met je team"] },
      { pre: "Eerst schade beperken en", post: "vastleggen, daarna pas oordelen.", b: "feiten", x: ["schuld", "namen"] },
      { pre: "Wees eerlijk tegen opdrachtgevers en laat de beoordeling over aan", post: ".", b: "het meldpunt", x: ["de opdrachtgever", "jezelf"] } ] }
  ];
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
      boss: { i: 0, left: BOSS_SECONDS, answered: {}, joker: {}, done: false },
      lock: { fill: {}, opts: GAPS.reduce(function (acc, l) { l.rules.forEach(function (r) { var o = [r.b].concat(r.x); for (var k = o.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var t = o[k]; o[k] = o[j]; o[j] = t; } acc.push(o); }); return acc; }, []), solved: false, attempts: 0, wrong: {}, firstGood: null } };
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
  function show(html) {
    stage.innerHTML = '<div class="screen" tabindex="-1">' + html + "</div>";
    hud();
    var sc = stage.querySelector(".screen");
    if (sc && document.activeElement && document.activeElement !== document.body) sc.focus({ preventScroll: true });
  }
  function head(over, title) { return '<div><p class="vcsw-overline">' + over + "</p><h2>" + esc(title) + "</h2></div>"; }
  function fmt(n) { return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0"); }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  /* ---------- Briefing ---------- */
  function renderBrief() {
    var f = S.flags;
    function cb(id, txt) { return '<label><input type="checkbox" data-flag="' + id + '"' + (f[id] ? " checked" : "") + "> " + txt + "</label>"; }
    show(
      '<div><p class="vcsw-overline">Eindmissie · Briefing</p><h1>Een bericht van de aarde</h1></div>' +
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
    var html = head("Fase 3 · Escape room", "De zoektocht") +
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
      html += '<div class="actions">' + (S.hints > 0 && found.some(function (r) { return !F.hinted[r.id]; }) ? '<button class="vcsw-button outline lg" id="hint">' + icon("bulb") + "Gebruik een hint</button>" : "") +
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
      html += '<div class="actions">' + (S.hints > 0 ? '<button class="vcsw-button outline lg" id="hint">' + icon("bulb") + "Gebruik een hint</button>" : "") +
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

  /* ---------- Eindbaas ---------- */
  var bossTimer = null;
  function stopBoss() { if (bossTimer) { clearInterval(bossTimer); bossTimer = null; } }
  function startBoss() {
    stopBoss();
    bossTimer = setInterval(function () {
      var B = S.boss;
      if (S.screen !== "boss" || B.answered[B.i] !== undefined || B.done) return stopBoss();
      B.left = Math.max(0, B.left - 1);
      var t = document.getElementById("timer");
      if (t) { t.querySelector("span").textContent = "0:" + String(B.left).padStart(2, "0"); t.classList.toggle("low", B.left <= 5); }
      if (B.left === 0) answerBoss(-1);
    }, 1000);
  }
  function answerBoss(i) {
    var B = S.boss, q = BOSS[B.i];
    stopBoss();
    B.answered[B.i] = i;
    if (i !== q.a) hit(5);
    render();
  }
  function jokerFor(cat) { return S.inv.filter(function (c) { return catOf(c) === cat; })[0]; }
  function renderBoss() {
    var B = S.boss;
    if (B.done) return renderBossDone();
    var q = BOSS[B.i], ans = B.answered[B.i], answered = ans !== undefined;
    var html = head("Eindbaas · " + (B.i + 1) + " van " + BOSS.length, "De laatste aanval") +
      (B.i === 0 ? speech("aria", "De Zwarte Nevel valt nog één keer aan, met alles wat je in de levels bent tegengekomen. Je hebt " + BOSS_SECONDS + " seconden per aanval. Elk goed antwoord sluit een slot van de hoofdsluis. Heb je een passend datakristal, dan kun je het één keer per aanval als joker gebruiken.") : "");
    html += '<div class="lockbar"><div class="crystals" aria-label="Sloten">' + BOSS.map(function (b, k) {
      var a = B.answered[k], cls = a === undefined ? "neutral" : a === b.a ? "success" : "danger";
      return '<span class="vcsw-badge ' + cls + '">' + icon(a === b.a ? "lock" : a === undefined ? "unlock" : "bad") + b.cat + "</span>";
    }).join("") + "</div>" + (!answered ? '<div class="timer' + (B.left <= 5 ? " low" : "") + '" id="timer" aria-label="Resterende tijd">' + icon("clock") + "<span>0:" + String(B.left).padStart(2, "0") + "</span></div>" : "") + "</div>";
    html += '<div class="vcsw-alert error">' + icon("warn") + '<div><p class="vcsw-alert-title">Aanval van de Zwarte Nevel</p><p class="vcsw-alert-text">' + esc(q.t) + "</p></div></div>";
    html += '<div class="options" role="group" aria-label="Kies je antwoord">';
    q.o.forEach(function (o, k) {
      var gone = B.joker[B.i] === k && !answered;
      if (gone) return;
      var cls = "option" + (answered ? (k === q.a ? " picked" : k === ans ? "" : " dim") : "");
      var badge = answered && k === ans ? (k === q.a ? '<span class="verdict"><span class="vcsw-badge success">' + icon("check") + "Goed, slot dicht</span></span>" : '<span class="verdict"><span class="vcsw-badge danger">Fout, −5% schild</span></span>') : answered && k === q.a ? '<span class="verdict"><span class="vcsw-badge success">Juist antwoord</span></span>' : "";
      html += '<button class="' + cls + '" data-o="' + k + '"' + (answered ? " disabled" : "") + '><span class="key" aria-hidden="true">' + "ABC"[k] + '</span><span><span class="vcsw-sr-only">Optie ' + "ABC"[k] + ". </span>" + esc(o) + badge + "</span></button>";
    });
    html += "</div>";
    if (!answered) {
      var j = jokerFor(q.cat);
      html += '<div class="actions">' + (j && B.joker[B.i] === undefined ? '<button class="vcsw-button outline" id="joker">' + icon("gem") + "Joker: " + esc(j) + "</button>" : '<span class="muted">' + (j ? "Joker gebruikt: één fout antwoord is weg." : "Geen passend kristal voor " + q.cat + ", dus geen joker.") + "</span>") + "</div>";
    } else {
      if (ans === -1) html += alertBox("warning", "clock", "Te laat", "De tijd was op. Dat telt als fout.");
      html += speech("aria", (ans === q.a ? "Goed. " : "Fout. ") + q.why) +
        '<div class="actions"><button class="vcsw-button lg" id="next">' + (B.i < BOSS.length - 1 ? "Volgende aanval" : "Bekijk de uitslag") + icon("next") + "</button></div>";
    }
    show(html);
    if (!answered) {
      if (!bossTimer) startBoss();
      stage.querySelectorAll("[data-o]").forEach(function (b) { b.onclick = function () { answerBoss(+b.getAttribute("data-o")); }; });
      var jb = document.getElementById("joker");
      if (jb) jb.onclick = function () {
        var wrong = [0, 1, 2].filter(function (k) { return k !== q.a; });
        B.joker[B.i] = wrong[Math.floor(Math.random() * wrong.length)];
        render();
      };
    } else {
      document.getElementById("next").onclick = function () {
        if (B.i < BOSS.length - 1) { B.i++; B.left = BOSS_SECONDS; }
        else {
          B.done = true;
          var good = BOSS.filter(function (b, k) { return B.answered[k] === b.a; }).length;
          var r = good === 6 ? "goed" : good === 5 ? "half" : "fout";
          S.picks.boss = { r: r, good: good }; S.score += POINTS[r];
        }
        render();
      };
    }
  }
  function renderBossDone() {
    var p = S.picks.boss;
    show(head("Eindbaas", "De aanval is afgeslagen") +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' + verdictBadge(p.r) + '<span class="vcsw-badge neutral">' + p.good + " van " + BOSS.length + " sloten dicht</span></div>" +
      speech("aria", p.good === BOSS.length ? "Alle zes sloten zijn dicht. De Zwarte Nevel komt er niet meer in. Nu nog de hoofdsluis zelf." : "De Zwarte Nevel is teruggedrongen, maar niet elk slot zit dicht. Kijk nog eens naar de rode thema’s. Nu de hoofdsluis zelf.") +
      '<div class="actions"><button class="vcsw-button lg" id="next">Naar de hoofdsluis' + icon("next") + "</button></div>");
    document.getElementById("next").onclick = function () { S.screen = "lock"; render(); };
  }

  /* ---------- Hoofdsluis: gatentekst ---------- */
  function renderLock() {
    var L = S.lock, done = L.solved;
    var html = head("Hoofdsluis", "De sluiscode") +
      speech("aria", "De hoofdsluis opent alleen met de vijftien kernregels van de Datawacht. In elke regel ontbreekt een sleutelwoord. Kies het juiste woord. Pas als alle vijftien regels kloppen, gaat de sluis open.");
    var n = 0, filled = 0;
    GAPS.forEach(function (l) {
      html += '<div><p class="cheat-level">' + esc(l.lvl) + '</p><ol class="cheat gaps" start="' + (n + 1) + '">';
      l.rules.forEach(function (r) {
        var id = n++, v = L.fill[id], wrong = !done && L.wrong[id];
        if (v) filled++;
        var opts = L.opts[id];
        html += '<li' + (wrong ? ' class="gap-wrong"' : "") + ">" + esc(r.pre) + ' <select class="vcsw-input gap" data-g="' + id + '" aria-label="Ontbrekend woord in regel ' + (id + 1) + '"' + (done ? " disabled" : "") + '><option value="">kies</option>' +
          opts.map(function (o) { return '<option value="' + esc(o) + '"' + (v === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") + "</select>" + (/^[.,]/.test(r.post) ? "" : " ") + esc(r.post) +
          (wrong ? ' <strong style="color:var(--vcsw-down)">Niet goed.</strong>' : "") + "</li>";
      });
      html += "</ol></div>";
    });
    if (L.attempts && !done) html += alertBox("error", "bad", Object.keys(L.wrong).length + (Object.keys(L.wrong).length === 1 ? " regel klopt" : " regels kloppen") + " nog niet", "Een nieuwe poging kost 5 procent schild.");
    if (done) html += alertBox("success", "ok", "De hoofdsluis gaat open", "De laatste aanvallers van de Zwarte Nevel zijn definitief buitengesloten.");
    html += '<div class="actions">' + (!done ? (L.attempts >= 2 ? '<button class="vcsw-button outline lg" id="reveal">' + icon("bulb") + "Toon de juiste woorden</button>" : "") + '<button class="vcsw-button lg" id="check"' + (filled === 15 ? "" : " disabled") + ">" + icon("unlock") + "Hoofdsluis openen</button>" : '<button class="vcsw-button lg" id="next">Naar de afsluiting' + icon("next") + "</button>") + "</div>";
    if (!done && filled < 15) html += '<p class="muted" style="text-align:right">Nog ' + (15 - filled) + " regels zonder woord.</p>";
    show(html);
    stage.querySelectorAll("[data-g]").forEach(function (s) {
      s.onchange = function () { var id = +s.getAttribute("data-g"); L.fill[id] = s.value; delete L.wrong[id]; render(); var a = stage.querySelector('[data-g="' + id + '"]'); if (a) a.focus(); };
    });
    var all = []; GAPS.forEach(function (l) { l.rules.forEach(function (r) { all.push(r); }); });
    var c = document.getElementById("check");
    if (c) c.onclick = function () {
      var wrong = {}, good = 0;
      all.forEach(function (r, i) { if (L.fill[i] === r.b) good++; else wrong[i] = true; });
      if (L.attempts) hit(5);
      if (!L.attempts) L.firstGood = good;
      L.attempts++;
      L.wrong = wrong;
      if (good === 15) {
        L.solved = true;
        var r = L.firstGood === 15 ? "goed" : L.firstGood >= 13 ? "half" : "fout";
        S.picks.lock = { r: r, good: L.firstGood }; S.score += POINTS[r];
      }
      render();
    };
    var rv = document.getElementById("reveal");
    if (rv) rv.onclick = function () { all.forEach(function (r, i) { L.fill[i] = r.b; }); L.wrong = {}; render(); };
    var nx = document.getElementById("next");
    if (nx) nx.onclick = function () { S.screen = "end"; render(); };
  }

  /* ---------- Afsluiting ---------- */
  function cheatText() {
    var n = 0;
    return "Spiekbrief AVG-game Ruimtestation Orion: de vijftien kernregels\n\n" + CHEAT.map(function (l) {
      return l.lvl + "\n" + l.rules.map(function (r) { n++; return n + ". " + r; }).join("\n");
    }).join("\n\n") + "\n\nTwijfel of een incident? Meld het bij Tarik, Dagmar of via jz@vcsw.nl.";
  }
  function renderEnd() {
    var MAX = maxScore(), pct = Math.round(S.score / MAX * 100), passed = pct >= 70;
    var html = '<div><p class="vcsw-overline">Afsluiting</p><h2>' + (passed ? "Admiraal van de Datawacht" : "Nog niet gehaald") + "</h2></div>";
    html += speech("aria", passed
      ? "Admiraal. Je hebt het station door vijf modules en een eindmissie geloodst. De gegevens aan boord zijn veilig, en iedereen weet dat ze bij jou in goede handen zijn."
      : "Je hebt minder dan 70 procent. Speel de eindmissie opnieuw. In de echte game krijg je dan andere situaties.");
    if (passed) html += '<div class="reward">' + icon("award") + "<div><strong>Benoemd tot Admiraal van de Datawacht</strong><br><span>Badges: Hullbreukbestendig. Rangen: Cadet, Vaandrig, Luitenant, Commandeur, Kapitein, Admiraal.</span></div></div>";
    html += '<div class="vcsw-stats cols-3"><div class="vcsw-stat"><span class="vcsw-stat-label">Score</span><span class="vcsw-stat-value">' + pct + '%</span><span class="vcsw-stat-note">' + S.score + " van " + MAX + ' punten</span></div>' +
      '<div class="vcsw-stat"><span class="vcsw-stat-label">Schildsterkte</span><span class="vcsw-stat-value">' + S.shield + '%</span><span class="vcsw-stat-note">vertrouwen aan boord</span></div>' +
      '<div class="vcsw-stat"><span class="vcsw-stat-label">Datakristallen</span><span class="vcsw-stat-value">' + S.inv.length + '</span><span class="vcsw-stat-note">in je inventaris</span></div></div>';
    var rows = [["Fase 1, het verzoek", S.picks.f1 && F1.opts.filter(function (o) { return o.k === S.picks.f1; })[0].r],
      ["Fase 2, de identiteit", S.picks.f2 && F2.opts.filter(function (o) { return o.k === S.picks.f2; })[0].r],
      ["Fase 3, de zoektocht", S.picks.f3.r], ["Fase 4, het antwoord", S.picks.f4.r]];
    if (hasJoran()) rows.push(["De klacht van Joran", JORAN.opts.filter(function (o) { return o.k === S.picks.joran; })[0].r]);
    rows.push(["Eindbaas, " + S.picks.boss.good + " van 6 sloten", S.picks.boss.r]);
    rows.push(["Hoofdsluis, " + S.picks.lock.good + " van 15 regels in één keer", S.picks.lock.r]);
    html += '<div><h3>Jouw resultaten</h3><ul class="result-list">' + rows.map(function (r) { return "<li><span>" + r[0] + "</span>" + verdictBadge(r[1]) + "</li>"; }).join("") + "</ul></div>";
    if (passed) {
      var n = 0;
      html += '<div><h3>Spiekbrief: de vijftien kernregels</h3>' + CHEAT.map(function (l) {
        var start = n + 1; n += l.rules.length;
        return '<p class="cheat-level">' + esc(l.lvl) + '</p><ol class="cheat" start="' + start + '">' + l.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol>";
      }).join("") + '<p class="muted" id="copyMsg" role="status" style="margin-top:12px"></p></div>';
    }
    html += '<div class="actions">' + (passed ? '<button class="vcsw-button outline lg" id="copy">' + icon("copy") + "Kopieer de spiekbrief</button>" : '<button class="vcsw-button outline lg" id="again">' + icon("refresh") + "Speel opnieuw</button>") +
      '<button class="vcsw-button lg" id="earth">Terug op aarde' + icon("next") + "</button></div>";
    show(html);
    var cp = document.getElementById("copy");
    if (cp) cp.onclick = function () {
      var msg = document.getElementById("copyMsg");
      try {
        navigator.clipboard.writeText(cheatText()).then(function () { msg.textContent = "De spiekbrief staat op je klembord."; }, function () { msg.textContent = "Kopiëren lukte niet. Selecteer de regels hierboven en kopieer ze zelf."; });
      } catch (e) { msg.textContent = "Kopiëren lukte niet. Selecteer de regels hierboven en kopieer ze zelf."; }
    };
    var a = document.getElementById("again"); if (a) a.onclick = restart;
    document.getElementById("earth").onclick = function () { S.screen = "earth"; render(); };
  }

  function renderEarth() {
    show(
      '<div><p class="vcsw-overline">Terug op aarde</p><h2>Wat betekent dit voor je werk bij VCSW</h2></div>' +
      '<dl class="law">' +
      "<dt>Direct doorzetten</dt><dd>Krijg je een inzageverzoek, zet het dan direct door via Tarik, Dagmar of jz@vcsw.nl en noteer de datum van ontvangst.</dd>" +
      "<dt>De termijn</dt><dd>Er geldt een termijn van een maand.</dd>" +
      "<dt>Meer plekken dan je denkt</dt><dd>Gegevens over iemand staan vaak op meer plekken dan je denkt, ook in Teams-berichten en mailboxen.</dd>" +
      "</dl>" +
      '<div class="vcsw-card basic"><h4>Een inzageverzoek, twijfel of een incident? Meld het</h4><p>Bij Tarik, Dagmar of via <span class="route">jz@vcsw.nl</span>.</p></div>' +
      '<div class="actions"><button class="vcsw-button outline lg" id="again">' + icon("refresh") + "Speel de eindmissie opnieuw</button></div>"
    );
    document.getElementById("again").onclick = restart;
  }

  function restart() { stopTimer(); stopBoss(); var fl = S.flags; S = fresh(fl); render(); window.scrollTo(0, 0); }

  function render() {
    var s = S.screen;
    if (s === "brief") renderBrief();
    else if (s === "f1") renderChoice(F1, "Fase 1", "f2");
    else if (s === "f2") renderChoice(F2, "Fase 2", "f3");
    else if (s === "f3") renderF3();
    else if (s === "f4") renderF4();
    else if (s === "joran") renderChoice(JORAN, "Fase 4 · Doorwerking", "boss");
    else if (s === "boss") renderBoss();
    else if (s === "lock") renderLock();
    else if (s === "end") renderEnd();
    else renderEarth();
  }
  render();
})();
