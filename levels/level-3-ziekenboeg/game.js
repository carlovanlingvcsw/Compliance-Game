/* Level 3: De medische ziekenboeg. Game logic and content of this level. */
(function () {
  "use strict";

  /* ---------- Icons (Lucide, outline) ---------- */
  var P = {
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    x: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    left: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    tick: '<path d="M20 6 9 17l-5-5"/>',
    cross: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    medic: '<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    dot: '<circle cx="12" cy="12" r="3"/>',
    grip: '<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>'
  };
  function icon(name, cls) { return '<svg class="vcsw-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + P[name] + '</svg>'; }
  var ARIA_FACE = '<svg class="ox-face" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="48" fill="#0c2f5f"/><ellipse cx="48" cy="50" rx="30" ry="24" fill="#e8eef6"/><ellipse cx="48" cy="50" rx="30" ry="24" fill="none" stroke="#8fa0b8" stroke-width="2"/><circle cx="48" cy="50" r="13" fill="#04142b"/><circle cx="48" cy="50" r="8" fill="#15aaff"/><circle cx="45" cy="47" r="2.5" fill="#fff"/><rect x="10" y="44" width="10" height="12" rx="4" fill="#8fa0b8"/><rect x="76" y="44" width="10" height="12" rx="4" fill="#8fa0b8"/><path d="M48 26v-9" stroke="#8fa0b8" stroke-width="3" stroke-linecap="round"/><circle cx="48" cy="15" r="3" fill="#ffb900"/></svg>';

  /* ---------- Characters ---------- */
  var PEOPLE = {
    aria: { name: "ARIA", initials: "AR", cls: "aria", role: "boordcomputer" },
    vega: { name: "Kapitein Vega", initials: "KV", cls: "vega", role: "kolonie Nova Terra" },
    bram: { name: "Bram", initials: "BR", cls: "bram", role: "monteur" },
    joran: { name: "Joran", initials: "JO", cls: "joran", role: "technicus van Nova Terra" }
  };
  function say(who, text, extra) {
    var p = PEOPLE[who];
    var face = who === "aria" ? ARIA_FACE : '<span class="ox-av ' + p.cls + '" aria-hidden="true">' + p.initials + '</span>';
    return '<div class="ox-say">' + face +
      '<div class="ox-say-body"><div class="ox-say-who"><span class="ox-say-name">' + p.name + '</span><span class="ox-say-role">' + p.role + '</span>' + (extra || "") + '</div>' +
      '<p class="ox-say-text">' + text + '</p></div></div>';
  }

  /* ---------- Content (from the game design, level 3) ---------- */
  /* Velden van de ziekmelding. Gemengde volgorde, zodat de plek niet verraadt wat mag. */
  var SICK_FIELDS = [
    { q: "Communicatiekanaal en verblijfplaats tijdens ziekte", ok: true, why: "Nodig om contact te houden" },
    { q: "Wat is de diagnose", ok: false, why: "Alleen voor de scheepsarts" },
    { q: "Verwachte duur van de afwezigheid", ok: true, why: "Nodig voor het dienstrooster" },
    { q: "Valt het crewlid onder een vangnetregeling", ok: true, why: "Nodig voor de juiste vergoeding" },
    { q: "Welke medicijnen gebruikt het crewlid", ok: false, why: "Medisch gegeven" },
    { q: "Lopende taken en afspraken", ok: true, why: "Nodig om werk over te dragen" },
    { q: "Is het iets psychisch", ok: false, why: "Ook een indirecte vraag naar de diagnose mag niet" },
    { q: "Is de ziekte het gevolg van een ongeluk tijdens dienst", ok: true, why: "Nodig voor melding en verzekering" },
    { q: "Is er een ander schip aansprakelijk, bijvoorbeeld na een aanvaring", ok: true, why: "Nodig om schade te verhalen" },
    { q: "Wat is de oorzaak, bijvoorbeeld heimwee naar de aarde", ok: false, why: "Valt onder medische gegevens" }
  ];

  /* Meerkeuzeregel van de privacy officer: per vraag één goed en één half goed antwoord, de rest fout maar aannemelijk.
     Antwoorden zijn ongeveer even lang en het goede antwoord staat niet steeds op dezelfde plek.
     Half goed geeft 3 van de 10 punten, zodat je met alleen half goede antwoorden het level niet haalt. De uitleg (why) zegt wat het half goede antwoord mist. */
  var CHOICE_SITUATIONS = [
    {
      id: "s2", title: "Situatie 2: De nieuwsgierige kapitein",
      intro: say("vega", "Wat heeft Joran precies? Ik moet weten of hij terugkomt.") +
        '<p class="mt-16">Joran heeft jou in de kantine verteld dat hij overspannen is.</p>',
      options: [
        { text: "“Daar kan ik niets over zeggen. Voor al je vragen over Joran verwijs ik je naar de scheepsarts.”", grade: "half",
          why: "Je deelt terecht niets over zijn gezondheid. Wat je mist, is dat Vega wel recht heeft op de verwachte duur voor haar planning. De scheepsarts adviseert alleen over wat Joran nog kan, niet over wat hij heeft.",
          react: say("vega", "De scheepsarts? Die vertelt mij toch niets. Ik wil alleen weten wanneer ik hem weer kan inroosteren.") },
        { text: "“Hij vertelde me zelf dat hij overspannen is. Dan kun je de oogstrotatie alvast anders plannen.”", grade: "fout",
          why: "Je deelt een medisch gegeven zonder grondslag, ook al vertelde Joran het vrijwillig.",
          react: say("vega", "Overspannen? Dan kan ik hem wel afschrijven voor de oogstrotatie. Goed dat ik het weet.") },
        { text: "“Medische informatie deel ik niet. Wel de verwachte duur, en de scheepsarts adviseert wat hij nog kan.”", grade: "goed",
          why: "Je geeft Vega wat ze nodig heeft voor de planning, en niets over zijn gezondheid.",
          react: say("vega", "Hm. Geef me die duur dan maar, en zorg dat het advies van de scheepsarts vandaag bij me ligt.") }
      ],
      flagOn: 1, flag: "joran"
    },
    {
      id: "s3", title: "Situatie 3: Het verkeerde kanaal",
      intro: '<p>In het algemene kanaal van de module verschijnt een bericht. Het is een rapport van de scheepsarts met medische details over een crewlid. Het hoort daar niet.</p>' +
        '<div class="ox-card kanaal mt-16"><span class="ox-chip neutral">Algemeen kanaal van de ziekenboeg</span><p><strong>Scheepsarts:</strong> Rapport crewlid 0417, bevindingen en behandelplan (bijlage)</p></div>',
      options: [
        { text: "Niet verder verspreiden, de afzender laten weten dat het verkeerd is beland en melden bij ARIA.", grade: "goed",
          why: "Je beperkt de schade en laat het meldpunt beoordelen of het een datalek is.",
          react: say("aria", "Melding ontvangen. Ik leg het vast en laat beoordelen of het een datalek is. Precies zo.") },
        { text: "Het rapport doorsturen naar de sectorchef, zodat die de scheepsarts op de fout kan aanspreken.", grade: "fout",
          why: "Zo verspreid je medische gegevens nog verder. Ook een leidinggevende hoort dit rapport niet te zien, en elke extra ontvanger maakt het lek groter.",
          react: say("aria", "Nu staat het rapport ook in de inbox van de sectorchef. Het lek is net een ontvanger groter geworden.") },
        { text: "Niet verder verspreiden en de scheepsarts vragen het rapport snel uit het kanaal te halen.", grade: "half",
          why: "Je beperkt de schade, maar je meldt het niet. Zonder melding bij het meldpunt beoordeelt niemand of het een datalek is, en wordt het ook niet geregistreerd.",
          react: say("aria", "Het rapport is weg uit het kanaal, mooi. Maar ik heb geen melding gekregen, dus niemand beoordeelt of dit een datalek is.") }
      ],
      crystal: { on: 0, name: "Verkeerd ontvangen" }
    },
    {
      id: "s4", title: "Situatie 4: De crewchat",
      intro: say("bram", "De nieuwe technicus staat in het register voor aangepast werk. Zet dat even in de crewchat, dan houdt iedereen er rekening mee."),
      options: [
        { text: "Niets opschrijven, maar het bij de ochtendbriefing kort mondeling aan de hele ploeg vertellen.", grade: "fout",
          why: "Ook mondeling delen is delen. Zo’n registratie zegt iets over iemands gezondheid en arbeidsvermogen en is gevoelig.",
          react: say("bram", "Slim, dan staat het nergens. Behalve in het hoofd van de hele ploeg, natuurlijk.") },
        { text: "Alleen vastleggen in het beveiligde systeem, voor wie het nodig heeft voor zijn taak.", grade: "goed",
          why: "Alleen wie de registratie nodig heeft voor zijn taak, kan erbij.",
          react: say("bram", "Ook goed. Dan hoef ik niet te onthouden wie het wel en niet mocht weten.") },
        { text: "Niet in de crewchat, maar vastleggen in het beveiligde systeem waar de hele ploeg bij kan.", grade: "half",
          why: "Het beveiligde systeem is de goede plek. Wat je mist, is dat alleen wie de registratie nodig heeft voor zijn taak erbij mag. De hele ploeg hoort daar niet bij.",
          react: say("bram", "Staat erin. Iedereen kan het nu opzoeken, ook de kok. Was dat de bedoeling?") }
      ],
      crystal: { on: 1, name: "Need to know" }
    }
  ];

  var HATCHES = [
    { id: "chef", name: "Sectorchef", icon: "user", role: "Plant het werk" },
    { id: "admin", name: "Crewadministratie", icon: "clipboard", role: "Regelt vergoeding en formele kant" },
    { id: "arts", name: "Scheepsarts", icon: "medic", role: "Krijgt als enige medische gegevens" }
  ];
  function hatch(id) { return HATCHES.filter(function (h) { return h.id === id; })[0]; }
  /* De stukjes komen één voor één in beeld, in deze volgorde. Gemengd, zodat de volgorde niets verraadt. */
  var LOCK_ITEMS = [
    { t: "Verwachte terugkeer over twee weken", a: "chef" },
    { t: "Diagnose: rugblessure", a: "arts" },
    { t: "Valt onder een vangnetregeling", a: "admin" },
    { t: "Kan vier uur per dag licht werk doen", a: "chef" },
    { t: "Verslag van de fysiotherapeut", a: "arts" },
    { t: "Ziekmelding is op tijd gedaan", a: "admin" },
    { t: "Medicatielijst", a: "arts" },
    { t: "Afwezigheid is het gevolg van een ongeluk tijdens dienst", a: "admin" }
  ];
  var LOCK_WHY = {
    chef: "De sectorchef heeft de duur en de mogelijkheden nodig om het werk te plannen.",
    admin: "De crewadministratie regelt vergoeding, verzekering en de formele kant van de ziekmelding.",
    arts: "Medische gegevens zijn alleen voor de scheepsarts."
  };
  var CRYSTALS_MAX = 3;   /* situatie 1, 3 en 4 */

  /* Scoring rules from the design: good 10, half 5, wrong 0. Pass at 70 percent. */
  var MAX_POINTS = 40 + LOCK_ITEMS.length * 5;
  var SHIELD_COST = { goed: 0, half: 5, fout: 10 };
  var HINT_COST = 10;
  var LOCK_SECONDS = 300;
  var STEPS = ["Briefing", "Dienst", "Luchtsluis", "Resultaat", "Terug op aarde"];
  var STEP_OF = { start: 0, briefing: 0, dienst: 1, luchtsluis: 2, resultaat: 3, aarde: 4 };
  function pctNow() { return Math.round(S.points / MAX_POINTS * 100); }
  function passMark() { for (var p = 0; p <= MAX_POINTS; p++) if (Math.round(p / MAX_POINTS * 100) >= 70) return p; return MAX_POINTS; }

  /* ---------- State (in memory only) ---------- */
  var S;
  function reset() {
    S = { screen: "start", shield: 100, points: 0, crystals: [], flags: {}, results: {}, lock: null, rank: "Luitenant", passed: false };
  }
  reset();
  function shieldNow() { return Math.max(0, Math.min(100, S.shield)); }

  /* De schil leest hier de stand van het level uit. */
  window.orionStatus = function () {
    var done = S.screen === "resultaat" || S.screen === "aarde";
    var pct = pctNow();
    return {
      score: S.points, max: MAX_POINTS, shield: shieldNow(),
      crystals: S.crystals.length, crystalsMax: CRYSTALS_MAX,
      steps: STEPS.slice(), step: STEP_OF[S.screen] || 0,
      done: done, passed: done ? pct >= 70 : null, pct: done ? pct : null
    };
  };

  var screenEl = document.getElementById("screen");
  var hudEl = document.getElementById("hud");
  var liveEl = document.getElementById("live");
  function announce(msg) { liveEl.textContent = ""; setTimeout(function () { liveEl.textContent = msg; }, 50); }
  function shieldTone(sh) { return sh >= 70 ? "ok" : (sh >= 40 ? "warn" : "bad"); }

  /* Eigen statusrij en stappenbalk (.own-status). In de schil neemt de schil dit over. */
  function renderHud() {
    var sh = shieldNow(), cur = STEP_OF[S.screen] || 0;
    var steps = STEPS.map(function (s, i) {
      var cls = i < cur ? "done" : (i === cur ? "now" : "");
      return '<li class="' + cls + '"' + (i === cur ? ' aria-current="step"' : '') + '><span class="bar" aria-hidden="true"></span><span>' + s + (i < cur ? '<span class="vcsw-sr-only"> (afgerond)</span>' : '') + '</span></li>';
    }).join("");
    var pips = "";
    for (var i = 0; i < CRYSTALS_MAX; i++) pips += '<span class="pip' + (i < S.crystals.length ? " on" : "") + '"></span>';
    hudEl.innerHTML =
      '<ol class="ox-steps">' + steps + '</ol>' +
      '<div class="ox-meters">' +
      '<div class="ox-meter"><div class="top">' + icon("target") + '<span>Score</span><b>' + S.points + ' van ' + MAX_POINTS + '</b></div>' +
      '<div class="track"><div class="fill" style="width:' + Math.min(100, S.points / MAX_POINTS * 100) + '%"></div><span class="mark"></span></div>' +
      '<span class="note">Gehaald vanaf ' + passMark() + ' punten</span></div>' +
      '<div class="ox-meter"><div class="top">' + icon("shield") + '<span>Schild</span><b>' + sh + '%</b></div>' +
      '<div class="track" role="progressbar" aria-label="Schild" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + sh + '"><div class="fill ' + shieldTone(sh) + '" style="width:' + sh + '%"></div></div>' +
      '<span class="note">Elke fout kost schild</span></div>' +
      '<div class="ox-meter narrow"><div class="top">' + icon("gem") + '<span>Kristallen</span><b>' + S.crystals.length + ' van ' + CRYSTALS_MAX + '</b></div>' +
      '<div class="pips" aria-hidden="true">' + pips + '</div>' +
      '<span class="note">Rang: ' + S.rank + '</span></div>' +
      '</div>';
  }

  function show(name, html) {
    S.screen = STEP_OF[name] === undefined ? S.screen : name;
    screenEl.innerHTML = html;
    renderHud();
    var h = screenEl.querySelector("h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    window.scrollTo({ top: Math.max(0, screenEl.offsetTop - 16), behavior: "auto" });
  }
  function chip(text, tone, ic) { return '<span class="ox-chip' + (tone ? " " + tone : "") + '">' + (ic ? icon(ic) : "") + text + '</span>'; }
  function head(title, chips, inline) {
    if (inline) return '<div class="screen-head rij"><h2>' + title + '</h2><div class="ox-chips">' + chips + '</div></div>';
    return '<div class="screen-head">' + (chips ? '<div class="ox-chips">' + chips + '</div>' : '') + '<h2>' + title + '</h2></div>';
  }
  function gradeAlert(grade, title, text) {
    var map = { goed: ["success", "check", "Goed"], half: ["warning", "alert", "Half goed"], fout: ["error", "x", "Fout"] };
    var m = map[grade];
    return '<div class="vcsw-alert ' + m[0] + '" role="status">' + icon(m[1]) +
      '<div><p class="vcsw-alert-title">' + m[2] + (title ? ": " + title : "") + '</p><p class="vcsw-alert-text">' + text + '</p></div></div>';
  }
  function crystalAlert(name) {
    return '<div class="ox-reward">' + icon("gem") +
      '<div><p class="ox-reward-title">Datakristal verdiend: ' + name + '</p><p>Het kristal is in de luchtsluis één aanwijzing zonder kosten.</p></div></div>';
  }
  function nextBtn(label, id, lg) {
    return '<button type="button" class="ox-btn' + (lg === false ? "" : " lg") + '" id="' + id + '">' + label + icon("right") + '</button>';
  }
  function row(ic, tone, text) { return '<li><span class="ic ' + tone + '">' + icon(ic) + '</span><span>' + text + '</span></li>'; }
  function addCrystal(name) { if (S.crystals.indexOf(name) === -1) S.crystals.push(name); }

  /* ---------- Screens ---------- */
  function screenStart() {
    stopTimer();
    show("start",
      '<div class="title-screen ox-stack">' +
      head("Welkom in de ziekenboeg", chip("Level 3") + chip("Vier situaties en een luchtsluis", "neutral")) +
      '<p class="ox-lead">Je leert dat gezondheidsgegevens extra bescherming krijgen en dat een leidinggevende niet mag weten wat een ziek crewlid mankeert. Je speelt vier situaties en opent daarna de luchtsluis De drie luiken.</p>' +
      '<div class="ox-two">' +
      '<div class="ox-card"><h3>Zo scoor je</h3><ul class="ox-rows">' +
      row("tick", "green", "Goed antwoord 10 punten, half goed 3 punten, fout 0 punten met uitleg.") +
      row("shield", "red", "Foute keuzes verzwakken je schilden. Half goed kost 5 procent, fout 10 procent.") +
      '</ul></div>' +
      '<div class="ox-card"><h3>Goed om te weten</h3><ul class="ox-rows">' +
      row("gem", "gold", "Elk kristal dat je in dit level verdient, is in de luchtsluis één aanwijzing zonder kosten. Daarna kost een aanwijzing " + HINT_COST + " procent schild.") +
      row("target", "blue", "Je haalt het level met minimaal 70 procent van de punten. Daarna ben je Commandeur.") +
      '</ul></div></div>' +
      '<div class="actions">' + nextBtn("Start level 3", "go") + '</div>' +
      '<p class="ox-foot">' + icon("info") + '<span><strong>Prototype met fictieve gegevens.</strong> De goede antwoorden wachten nog op goedkeuring door de Privacy Officer, zie de open punten in het ontwerp.</span></p>' +
      '</div>'
    );
    document.getElementById("go").onclick = screenBriefing;
  }

  function screenBriefing() {
    show("briefing",
      '<div class="title-screen ox-stack">' +
      head("Opdracht van ARIA", '<span class="alleen-los">' + chip("Briefing") + "</span>") +
      say("aria", "Welkom in de ziekenboeg, het gevoeligste deel van het station. Bij ziekte wil iedereen alles weten. De sectorchef, de collega’s, soms zelfs de kapitein van de kolonie. Medische details zijn voor de scheepsarts, niet voor de rest.") +
      say("aria", "Vandaag val je in bij de crewadministratie. Ik kijk mee. Ik kijk altijd mee.") +
      '<div class="actions">' + nextBtn("Begin je dienst", "go") + '</div></div>'
    );
    document.getElementById("go").onclick = screenSickReport;
  }

  function screenSickReport() {
    var rows = SICK_FIELDS.map(function (f, i) {
      return '<li class="toggle-row" id="row' + i + '"><span class="q" id="q' + i + '">' + f.q + '</span>' +
        '<div class="vcsw-segmented" role="group" aria-labelledby="q' + i + '">' +
        '<button type="button" data-row="' + i + '" data-val="ja" aria-pressed="false">Vastleggen</button>' +
        '<button type="button" data-row="' + i + '" data-val="nee" aria-pressed="false">Niet vastleggen</button></div>' +
        '<div class="verdict" id="v' + i + '"></div></li>';
    }).join("");
    show("dienst",
      head("Situatie 1: De ziekmelding", chip("Situatie 1 van 4"), true) +
      say("joran", "Hoi, met Joran. Ik voel me echt niet goed, ik kom vandaag en waarschijnlijk de rest van de week niet.") +
      '<p class="mt-16">Jij legt de melding vast. Kies per veld of je het mag vastleggen.</p>' +
      '<ul class="toggle-list">' + rows + '</ul>' +
      '<div class="feedback" id="fb"></div>' +
      '<div class="actions" id="act"><button type="button" class="ox-btn lg" id="check" aria-disabled="true">Melding opslaan' + icon("tick") + '</button>' +
      '<span class="ox-muted" id="sickCount">0 van ' + SICK_FIELDS.length + ' velden gekozen</span></div>'
    );
    var answers = {};
    var locked = false;
    screenEl.querySelectorAll("[data-row]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (locked) return;
        var i = b.getAttribute("data-row");
        answers[i] = b.getAttribute("data-val");
        screenEl.querySelectorAll('[data-row="' + i + '"]').forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        var n = Object.keys(answers).length;
        document.getElementById("sickCount").textContent = n + " van " + SICK_FIELDS.length + " velden gekozen";
        if (n === SICK_FIELDS.length) document.getElementById("check").removeAttribute("aria-disabled");
      });
    });
    document.getElementById("check").onclick = function () {
      if (locked) return;
      if (Object.keys(answers).length < SICK_FIELDS.length) { announce("Kies eerst bij alle velden of je het vastlegt."); return; }
      locked = true;
      var good = 0;
      SICK_FIELDS.forEach(function (f, i) {
        var correct = (answers[i] === "ja") === f.ok;
        if (correct) good++;
        var v = document.getElementById("v" + i);
        v.innerHTML = '<span class="inline-verdict ' + (correct ? "verdict-good" : "verdict-bad") + '">' + icon(correct ? "check" : "x", "sm") + (correct ? "Goed" : "Fout") + '</span> ' +
          (f.ok ? "Mag je vastleggen. " : "Mag je niet vastleggen. ") + f.why + ".";
        screenEl.querySelectorAll('[data-row="' + i + '"]').forEach(function (o) { o.disabled = true; });
      });
      var wrong = SICK_FIELDS.length - good;
      var grade = good >= 9 ? "goed" : (good >= 7 ? "half" : "fout");
      var pts = grade === "goed" ? 10 : (grade === "half" ? 3 : 0);
      S.points += pts;
      S.shield -= wrong * 2;
      S.results.s1 = { grade: grade, good: good };
      var html = gradeAlert(grade, good + " van " + SICK_FIELDS.length + " goed", "Je mag vragen wat nodig is voor het werk, de vergoeding en de verzekering. Naar de diagnose of oorzaak vraag je nooit, ook niet indirect.");
      if (good >= 9) { addCrystal("Wat mag je vragen bij ziekte"); html += crystalAlert("Wat mag je vragen bij ziekte"); }
      html += say("aria", good >= 9 ? "Netjes. De scheepsarts hoeft vandaag niets van jouw formulier te schrappen." : "Een paar velden horen niet in een ziekmelding. Lees de uitleg bij elk veld goed na.");
      document.getElementById("fb").innerHTML = html;
      document.getElementById("act").innerHTML = nextBtn("Volgende situatie", "go");
      renderHud();
      document.getElementById("go").onclick = function () { screenChoice(0); };
      announce(good + " van " + SICK_FIELDS.length + " velden goed.");
    };
  }

  function screenChoice(idx) {
    var sit = CHOICE_SITUATIONS[idx];
    var letters = ["A", "B", "C"];
    var opts = sit.options.map(function (o, i) {
      return '<button type="button" class="choice" data-opt="' + i + '"><span class="key" aria-hidden="true">' + letters[i] + '</span><span><span class="vcsw-sr-only">Optie ' + letters[i] + ': </span>' + o.text + '</span></button>';
    }).join("");
    show("dienst",
      head(sit.title, chip("Situatie " + (idx + 2) + " van 4"), true) +
      sit.intro +
      '<div class="choices" role="group" aria-label="Wat doe je?">' + opts + '</div>' +
      '<div class="feedback" id="fb"></div><div class="actions" id="act"></div>'
    );
    var done = false;
    screenEl.querySelectorAll("[data-opt]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (done) return;
        done = true;
        var i = +b.getAttribute("data-opt");
        var o = sit.options[i];
        screenEl.querySelectorAll("[data-opt]").forEach(function (x) {
          x.disabled = true;
          x.classList.add(x === b ? "picked" : "dim");
          if (x === b) x.setAttribute("aria-current", "true");
        });
        S.points += o.grade === "goed" ? 10 : (o.grade === "half" ? 3 : 0);
        S.shield -= SHIELD_COST[o.grade];
        S.results[sit.id] = { grade: o.grade, pick: letters[i] };
        if (sit.flag && i === sit.flagOn) S.flags[sit.flag] = true;
        var html = o.react + gradeAlert(o.grade, "", o.why);
        if (sit.crystal && i === sit.crystal.on) { addCrystal(sit.crystal.name); html += crystalAlert(sit.crystal.name); }
        if (sit.flag && i === sit.flagOn) {
          html += '<div class="vcsw-alert warning">' + icon("alert") + '<div><p class="vcsw-alert-title">Deze keuze wordt onthouden</p><p class="vcsw-alert-text">In de eindmissie krijg je hierdoor ook een klacht van Joran te behandelen.</p></div></div>';
        }
        document.getElementById("fb").innerHTML = html;
        var last = idx === CHOICE_SITUATIONS.length - 1;
        document.getElementById("act").innerHTML = nextBtn(last ? "Naar de luchtsluis" : "Volgende situatie", "go");
        document.getElementById("go").onclick = function () { last ? screenLockIntro() : screenChoice(idx + 1); };
        renderHud();
        announce(({ goed: "Goed", half: "Half goed", fout: "Fout" })[o.grade] + ". " + o.why);
      });
    });
  }

  /* ---------- Luchtsluis: De drie luiken (voorstel C, één stukje tegelijk) ---------- */
  function pills() {
    return HATCHES.map(function (h) {
      return '<span class="luik-pil h-' + h.id + '">' + icon(h.icon) + '<span>' + h.name + '</span></span>';
    }).join("");
  }

  /* Startkaart: doel, hoe je scoort, wat een fout kost, en één startknop. */
  function screenLockIntro() {
    stopTimer();
    var n = S.crystals.length;
    show("luchtsluis",
      '<div class="ox-stack">' +
      head("De drie luiken", chip("Luchtsluis") + chip(Math.floor(LOCK_SECONDS / 60) + " minuten", "", "clock") + chip("Hoort bij level 3", "neutral")) +
      '<p class="ox-lead">Schuif elk stukje informatie over een ziek crewlid door het juiste luik.</p>' +
      '<div class="ox-card intro-demo">' +
      say("aria", "Einde dienst. Op je console ligt nog informatie over een ziek crewlid die daar deels niet thuishoort. Je krijgt de stukjes één voor één. Sleep elk stukje naar het luik van de sectorchef, de crewadministratie of de scheepsarts, of klik op het luik. Elk luik krijgt alleen wat die rol nodig heeft.") +
      '<div class="luik-pills" aria-hidden="true">' + pills() + '</div></div>' +
      '<div class="ox-two">' +
      '<div class="ox-card"><h3>Zo scoor je</h3><ul class="ox-rows">' +
      row("tick", "green", "Elk stukje dat bij de eerste controle goed ligt, levert 5 punten op.") +
      row("shield", "red", "Elk fout stukje kost 5 procent schild.") +
      row("refresh", "blue", "Verkeerd geschoven? Klik op het stukje onder het luik om het terug te halen.") +
      '</ul></div>' +
      '<div class="ox-card"><h3>Goed om te weten</h3><ul class="ox-rows">' +
      row("clock", "blue", "Je hebt " + Math.floor(LOCK_SECONDS / 60) + " minuten. Als de verdeling klopt, licht de sluiscode op.") +
      row("gem", "gold", "Elk kristal uit dit level is één aanwijzing van ARIA zonder kosten. Je hebt er " + n + ".") +
      row("bulb", "blue", "Daarna kost een aanwijzing " + HINT_COST + " procent schild.") +
      '</ul></div></div>' +
      '<div class="actions">' + nextBtn("Open de luchtsluis", "go") + '</div></div>'
    );
    document.getElementById("go").onclick = screenLock;
  }

  var timerId = null;
  function fmt(n) { return Math.floor(n / 60) + ":" + (n % 60 < 10 ? "0" : "") + (n % 60); }

  /* Een getekend luik in de stijl van het station: een kast met klinknagels en een statuslampje,
     een donkere opening en een deurblad met naad, sleuf, plaatje en waarschuwingsstreep, opgehangen aan twee scharnieren bovenaan.
     Het hele luik is één knop. Bij inschuiven klapt het deurblad naar binnen open en weer dicht. */
  function hatchButton(h, k) {
    return '<button type="button" class="deur-btn luik-knop" data-hatch="' + h.id + '" aria-keyshortcuts="' + (k + 1) + '">' +
      '<span class="vcsw-sr-only">Schuif hierin bij ' + h.name + ', toets ' + (k + 1) + '</span>' +
      '<span class="luik-kast" aria-hidden="true">' +
      '<span class="luik-lamp"></span>' +
      '<span class="luik-gat"><span class="luik-binnen"></span>' +
      '<span class="luik-blad"><span class="blad-naad"></span><span class="luik-sleuf"></span>' +
      '<span class="blad-plaat">Schuif hierin<kbd>' + (k + 1) + '</kbd></span><span class="blad-streep"></span></span></span>' +
      '<span class="luik-scharnier l"></span><span class="luik-scharnier r"></span>' +
      '</span></button>';
  }

  /* Het eerstvolgende stukje na i dat nog niet in een luik ligt, of -1 als alles ligt. */
  function nextOpen(i) {
    var N = LOCK_ITEMS.length;
    for (var k = 1; k <= N; k++) { var j = (i + k + N) % N; if (!S.lock.place[j]) return j; }
    return -1;
  }

  function screenLock() {
    S.lock = { place: {}, verdict: {}, checks: 0, firstScored: false, used: 0, remaining: LOCK_SECONDS, revealed: {}, done: false, cur: 0 };
    var segs = LOCK_ITEMS.map(function (it, i) { return '<li id="seg' + i + '"></li>'; }).join("");
    var doors = HATCHES.map(function (h, k) {
      return '<section class="luik-deur h-' + h.id + '" id="deur-' + h.id + '" data-deur="' + h.id + '" aria-labelledby="ln-' + h.id + '">' +
        '<div class="deur-kop"><span class="deur-ic" aria-hidden="true">' + icon(h.icon) + '</span><h3 id="ln-' + h.id + '">' + h.name + '</h3>' +
        '<b class="deur-tel" id="cnt-' + h.id + '">0</b><span class="vcsw-sr-only" id="cnts-' + h.id + '"></span></div>' +
        '<p class="deur-rol">' + h.role + '</p>' + hatchButton(h, k) +
        '<ul class="deur-lijst" id="lijst-' + h.id + '" aria-label="Stukjes bij ' + h.name + '"></ul></section>';
    }).join("");
    show("luchtsluis",
      '<div class="luik">' +
      '<div class="luik-top"><h2>De drie luiken</h2>' +
      '<span class="ox-chip ok" id="schildChip"></span>' +
      '<span class="ox-clock timer" id="timer" aria-label="Resterende tijd">' + icon("clock") + '<span>' + fmt(LOCK_SECONDS) + '</span></span></div>' +
      '<section class="ox-card stukje" id="stukje" aria-label="Huidig stukje">' +
      '<div class="stukje-kop"><span class="stukje-nr" id="stukNr"></span><ol class="stukje-balk" aria-hidden="true">' + segs + '</ol></div>' +
      '<div class="stukje-body" id="stukBody"></div></section>' +
      '<div class="luiken" role="group" aria-label="De drie luiken">' + doors + '</div>' +
      '<div class="luik-acts">' +
      '<button type="button" class="ox-btn ghost" id="prev">' + icon("left") + 'Vorige stukje</button>' +
      '<div class="aw-meta"><span class="aw-gems" id="gems"></span><span class="aw-cost" id="hintCost"></span></div>' +
      '<button type="button" class="ox-btn ghost" id="hint">Vraag een aanwijzing' + icon("bulb") + '</button>' +
      '</div>' +
      '<div class="aw-list" id="msg"></div>' +
      '</div>'
    );
    /* Het hele luik is klikbaar: de kop, de rol en het getekende luik. Een stukje in de lijst eronder haalt terug. */
    screenEl.querySelectorAll(".luik-deur").forEach(function (d) {
      d.addEventListener("click", function (e) {
        if (e.target.closest("[data-take]") || e.target.closest(".deur-lijst")) return;
        shove(d.getAttribute("data-deur"));
      });
    });
    document.getElementById("prev").onclick = previous;
    document.getElementById("hint").onclick = useHint;
    paintLock();
    startTimer();
  }

  /* Toetsen 1, 2 en 3 schuiven het stukje door het eerste, tweede of derde luik. */
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || !/^[123]$/.test(e.key)) return;
    if (S.screen !== "luchtsluis" || !S.lock || S.lock.done || !document.getElementById("stukje")) return;
    e.preventDefault();
    shove(HATCHES[+e.key - 1].id);
  });

  function calmMotion() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }

  /* Een los kaartje dat over het scherm beweegt: bij slepen, bij inschuiven en bij terugspringen. Alleen beeld. */
  function makeGhost(text, rect, extra) {
    var g = document.createElement("div");
    g.className = "kaartje vlieg-kaart" + (extra ? " " + extra : "");
    g.setAttribute("aria-hidden", "true");
    g.innerHTML = icon("grip", "kaart-greep") + '<span class="kaart-tekst"></span>';
    g.querySelector(".kaart-tekst").textContent = text;
    g.style.left = rect.left + "px"; g.style.top = rect.top + "px"; g.style.width = rect.width + "px";
    document.body.appendChild(g);
    return g;
  }
  function doorOpen(id, ms) {
    var door = document.getElementById("deur-" + id);
    if (!door) return;
    clearTimeout(door._dicht);
    door.classList.add("open");
    door._dicht = setTimeout(function () {
      door.classList.remove("open");
      door.classList.remove("slikt"); void door.offsetWidth; door.classList.add("slikt");
    }, ms);
  }
  /* Het midden van de sleuf: daar gaat een stukje in en komt het uit. */
  function slotPoint(id) {
    var gat = document.querySelector("#deur-" + id + " .luik-gat");
    if (!gat) return null;
    var b = gat.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height * 0.36, w: b.width };
  }

  /* Het stukje vliegt naar het gekozen luik, het deurblad klapt open, het stukje verdwijnt erin en het luik sluit.
     Met een sleepkaartje vliegt dat kaartje vanaf de plek waar je het losliet. */
  function flyIn(id, ghost) {
    var p = slotPoint(id);
    if (calmMotion() || !document.body.animate || !p) { if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost); return; }
    var start = ghost ? "rotate(-3deg) scale(1.04)" : "none";
    var g = ghost;
    if (!g) {
      var src = document.getElementById("kaartje");
      if (!src) return;
      g = makeGhost(src.textContent, src.getBoundingClientRect());
    }
    g.classList.add("h-" + id, "richting");
    var w = g.offsetWidth, h = g.offsetHeight, left = parseFloat(g.style.left), top = parseFloat(g.style.top);
    var dx = p.x - (left + w / 2), dy = p.y - (top + h / 2), fit = Math.min(1, (p.w * 0.86) / w);
    doorOpen(id, 500);
    var anim = g.animate([
      { transform: start, opacity: 1 },
      { transform: "translate(" + dx + "px, " + dy + "px) rotate(0deg) scale(" + fit + ")", opacity: 1, offset: 0.62 },
      { transform: "translate(" + dx + "px, " + (dy + 10) + "px) rotate(0deg) scale(" + (fit * 0.5) + ", " + (fit * 0.2) + ")", opacity: 0 }
    ], { duration: 560, easing: "cubic-bezier(.4, 0, .3, 1)", fill: "forwards" });
    anim.onfinish = anim.oncancel = function () { if (g.parentNode) g.parentNode.removeChild(g); };
  }

  /* Het stukje springt terug uit het luik naar de kaart bovenaan. */
  function flyOut(i, id, wasWrong) {
    var p = slotPoint(id), dest = document.getElementById("kaartje");
    if (calmMotion() || !document.body.animate || !p || !dest) return;
    var r = dest.getBoundingClientRect();
    var g = makeGhost(LOCK_ITEMS[i].t, r, "h-" + id + " richting" + (wasWrong ? " fout" : ""));
    var w = g.offsetWidth, h = g.offsetHeight;
    var dx = p.x - (r.left + w / 2), dy = p.y - (r.top + h / 2), fit = Math.min(1, (p.w * 0.86) / w);
    dest.classList.add("landt");
    doorOpen(id, 360);
    var anim = g.animate([
      { transform: "translate(" + dx + "px, " + (dy + 10) + "px) scale(" + (fit * 0.5) + ", " + (fit * 0.2) + ")", opacity: 0 },
      { transform: "translate(" + dx + "px, " + (dy - 14) + "px) scale(" + fit + ")", opacity: 1, offset: 0.3 },
      { transform: "translate(" + (dx * 0.4) + "px, " + (dy * 0.4 - 40) + "px) rotate(-3deg) scale(1)", opacity: 1, offset: 0.7 },
      { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 1 }
    ], { duration: 620, easing: "cubic-bezier(.3, 0, .3, 1)", fill: "forwards" });
    anim.onfinish = anim.oncancel = function () {
      if (g.parentNode) g.parentNode.removeChild(g);
      var k = document.getElementById("kaartje");
      if (k) k.classList.remove("landt");
    };
  }

  /* Slepen: pak het kaartje op en laat het los boven een luik. Muis, pen en aanraken via pointer events. */
  var drag = null;
  function doorAt(x, y) {
    var el = document.elementFromPoint(x, y);
    var d = el && el.closest ? el.closest(".luik-deur") : null;
    return d && screenEl.contains(d) ? d : null;
  }
  function markTarget(d) {
    screenEl.querySelectorAll(".luik-deur.doel").forEach(function (x) { if (x !== d) x.classList.remove("doel"); });
    if (d) d.classList.add("doel");
  }
  function endDrag(dropOn) {
    var D = drag;
    drag = null;
    screenEl.classList.remove("sleept");
    markTarget(null);
    if (!D) return;
    D.el.classList.remove("vast");
    if (!D.ghost) return;
    if (dropOn && S.lock && !S.lock.done && S.lock.cur !== -1) { shove(dropOn, D.ghost); return; }
    /* Losgelaten naast een luik: het kaartje gaat terug naar zijn plek. */
    D.el.classList.remove("weg");
    var g = D.ghost;
    if (calmMotion() || !g.animate) { g.parentNode.removeChild(g); return; }
    var r = D.el.getBoundingClientRect();
    var dx = r.left - parseFloat(g.style.left), dy = r.top - parseFloat(g.style.top);
    D.el.classList.add("landt");
    var a = g.animate([{ transform: "rotate(-3deg) scale(1.04)" }, { transform: "translate(" + dx + "px, " + dy + "px) rotate(0deg) scale(1)" }],
      { duration: 240, easing: "cubic-bezier(.3, 0, .3, 1)", fill: "forwards" });
    a.onfinish = a.oncancel = function () { if (g.parentNode) g.parentNode.removeChild(g); D.el.classList.remove("landt"); };
  }
  function bindDrag(el) {
    el.addEventListener("pointerdown", function (e) {
      if ((e.pointerType === "mouse" && e.button !== 0) || !S.lock || S.lock.done || drag) return;
      e.preventDefault();
      drag = { el: el, x0: e.clientX, y0: e.clientY, ghost: null, over: null };
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      el.classList.add("vast");
    });
    el.addEventListener("pointermove", function (e) {
      var D = drag;
      if (!D || D.el !== el) return;
      if (!D.ghost) {
        if (Math.abs(e.clientX - D.x0) + Math.abs(e.clientY - D.y0) < 6) return;
        var r = el.getBoundingClientRect();
        D.offX = D.x0 - r.left; D.offY = D.y0 - r.top;
        D.ghost = makeGhost(el.textContent, r, "opgepakt");
        el.classList.add("weg");
        screenEl.classList.add("sleept");
      }
      D.ghost.style.left = (e.clientX - D.offX) + "px";
      D.ghost.style.top = (e.clientY - D.offY) + "px";
      var d = doorAt(e.clientX, e.clientY);
      D.over = d ? d.getAttribute("data-deur") : null;
      markTarget(d);
    });
    el.addEventListener("pointerup", function (e) {
      if (!drag || drag.el !== el) return;
      var d = drag.ghost ? doorAt(e.clientX, e.clientY) : null;
      endDrag(d ? d.getAttribute("data-deur") : null);
    });
    el.addEventListener("pointercancel", function () { if (drag && drag.el === el) endDrag(null); });
  }

  function shove(id, ghost) {
    var L = S.lock;
    if (!L || L.done || L.cur === -1) { if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost); return; }
    var i = L.cur, it = LOCK_ITEMS[i], h = hatch(id);
    flyIn(id, ghost);
    L.open = null;
    L.place[i] = id;
    delete L.verdict[i];
    L.justIn = i;
    L.cur = nextOpen(i);
    paintLock();
    announce(it.t + " ligt nu bij " + h.name + ". " + (L.cur === -1 ? "Alle stukjes liggen in een luik. Controleer de verdeling." : "Volgende stukje: " + LOCK_ITEMS[L.cur].t + "."));
  }

  /* Een stukje terughalen uit een luik: het springt eruit en wordt weer het huidige stukje. */
  function takeBack(i, focusId) {
    var L = S.lock;
    if (!L || L.done) return;
    var from = L.place[i], wasWrong = L.verdict[i] === false;
    delete L.place[i];
    delete L.verdict[i];
    L.cur = i;
    paintLock();
    if (from) flyOut(i, from, wasWrong);
    var f = document.querySelector('#deur-' + (focusId || from) + ' .deur-btn');
    if (f) f.focus({ preventScroll: true });
    announce(LOCK_ITEMS[i].t + " is teruggehaald. Kies opnieuw een luik.");
  }

  function previous() {
    var L = S.lock;
    if (!L || L.done) return;
    var t = L.cur === -1 ? LOCK_ITEMS.length - 1 : L.cur - 1;
    if (t < 0) return;
    var from = L.place[t];
    if (from) { takeBack(t, from); return; }
    L.cur = t;
    paintLock();
    announce("Stukje " + (t + 1) + ": " + LOCK_ITEMS[t].t + ".");
  }

  /* Eén vak onder de knoppen voor het laatste bericht: de tekstballon van ARIA of de uitslag van een controle. */
  function lockMsg(html) {
    var box = document.getElementById("msg");
    if (!box) return;
    box.innerHTML = html;
    if (box.scrollIntoView) box.scrollIntoView({ block: "nearest", behavior: calmMotion() ? "auto" : "smooth" });
  }
  function ariaSays(text, extra) { lockMsg('<div class="ox-card aw-bubble">' + say("aria", text, extra) + '</div>'); }

  function paintLock() {
    var L = S.lock, total = LOCK_ITEMS.length, n = Object.keys(L.place).length;
    var wrongNow = LOCK_ITEMS.filter(function (it, i) { return L.verdict[i] === false; }).length;
    /* Kaart bovenaan: het huidige stukje, of de controle als alles in een luik ligt. */
    var body = document.getElementById("stukBody"), nr = document.getElementById("stukNr");
    if (L.cur !== -1) {
      var it = LOCK_ITEMS[L.cur];
      nr.textContent = "Stukje " + (L.cur + 1) + " van " + total;
      body.innerHTML = '<div class="kaartje" id="kaartje" title="Sleep naar een luik">' + icon("grip", "kaart-greep") +
        '<span class="kaart-tekst" id="stukNaam">' + it.t + '</span></div>' +
        (L.revealed[L.cur] ? '<p class="stukje-tip">' + icon("bulb") + '<span>ARIA: dit hoort bij ' + hatch(it.a).name + '. ' + LOCK_WHY[it.a] +
          (L.hintChip && L.hintChip.i === L.cur ? ' ' + L.hintChip.html : '') + '</span></p>'
          : '<p class="stukje-vraag">Door welk luik mag dit? Sleep het naar een luik, klik op een luik of druk 1, 2 of 3.</p>');
      bindDrag(document.getElementById("kaartje"));
    } else {
      nr.textContent = n + " van " + total + " in een luik";
      var title = wrongNow ? wrongNow + (wrongNow === 1 ? " stukje ligt" : " stukjes liggen") + " in het verkeerde luik" : "Alle stukjes liggen in een luik";
      var sub = wrongNow ? "Klik op een rood stukje om het terug te halen en schuif het door een ander luik. Controleer daarna opnieuw. Punten tellen alleen bij de eerste controle."
        : "Twijfel je? Klik op een stukje onder een luik om het terug te halen.";
      body.innerHTML = '<p class="stukje-naam klaar' + (wrongNow ? " fout" : "") + '" id="stukNaam">' + (wrongNow ? icon("x") : "") + title + '</p>' +
        '<p class="stukje-vraag">' + sub + '</p>' +
        (L.done || wrongNow ? '' : '<button type="button" class="ox-btn" id="check">Verdeling controleren' + icon("tick") + '</button>');
      var c = document.getElementById("check");
      if (c) c.onclick = checkLock;
    }
    /* Voortgangsbalk: elk vakje in de kleur van het luik waar het stukje ligt. */
    LOCK_ITEMS.forEach(function (it, i) {
      var at = L.place[i];
      document.getElementById("seg" + i).className = (at ? "at h-" + at : "") + (i === L.cur ? " nu" : "") + (L.verdict[i] === false ? " fout" : "");
    });
    /* De drie luiken: teller en de lijst met stukjes die erin liggen. */
    HATCHES.forEach(function (h) {
      var items = [];
      LOCK_ITEMS.forEach(function (it, i) { if (L.place[i] === h.id) items.push(i); });
      var cnt = document.getElementById("cnt-" + h.id);
      cnt.textContent = items.length;
      cnt.className = "deur-tel" + (items.length ? "" : " leeg");
      document.getElementById("cnts-" + h.id).textContent = items.length === 1 ? " stukje" : " stukjes";
      var hasWrong = items.some(function (i) { return L.verdict[i] === false; });
      var door = document.getElementById("deur-" + h.id);
      door.classList.toggle("actief", L.cur !== -1 && !L.done);
      door.classList.toggle("fout", hasWrong);
      /* Compacte chips in een vak met vaste hoogte, zodat de drie kolommen even hoog blijven.
         Rode stukjes en een ARIA-tip staan vooraan. Past het niet, dan toont de laatste plek "+2 meer". */
      var CAP = 3, open = L.open && L.open[h.id];
      var order = items.slice().sort(function (a, b) {
        var wa = (L.verdict[a] === false ? 2 : 0) + (L.revealed[a] && LOCK_ITEMS[a].a !== h.id ? 1 : 0);
        var wb = (L.verdict[b] === false ? 2 : 0) + (L.revealed[b] && LOCK_ITEMS[b].a !== h.id ? 1 : 0);
        return wb - wa || b - a;
      });
      var shown = open || order.length <= CAP ? order : order.slice(0, CAP - 1);
      var html = shown.map(function (i) {
        var v = L.verdict[i], tip = L.revealed[i] && LOCK_ITEMS[i].a !== h.id, tipTxt = tip ? "ARIA: hoort bij " + hatch(LOCK_ITEMS[i].a).name : "";
        return '<li' + (L.justIn === i ? ' class="nieuw"' : '') + '><button type="button" class="deur-item' + (v === false ? " fout" : "") + (tip ? " tip" : "") + '" data-take="' + i + '"' + (L.done ? " disabled" : "") +
          ' title="' + LOCK_ITEMS[i].t + (tipTxt ? ". " + tipTxt : "") + (L.done ? "" : ". Klik om terug te halen") + '">' + icon(v === false ? "cross" : tip ? "bulb" : "tick") +
          '<span>' + LOCK_ITEMS[i].t + (v === false ? '<span class="vcsw-sr-only">. Ligt in het verkeerde luik</span>' : '') +
          (tip ? '<span class="vcsw-sr-only">. ' + tipTxt + '</span>' : '') +
          (L.done ? '' : '<span class="vcsw-sr-only">. Terughalen</span>') + '</span>' +
          (v === false ? '<span class="terug" aria-hidden="true">' + icon("undo") + '</span>' : '') + '</button></li>';
      }).join("");
      if (order.length > CAP) {
        html += '<li><button type="button" class="deur-meer" data-meer="' + h.id + '" aria-expanded="' + (open ? "true" : "false") + '">' +
          (open ? "Minder tonen" : "+" + (order.length - shown.length) + " meer") + '</button></li>';
      }
      var lijst = document.getElementById("lijst-" + h.id);
      lijst.innerHTML = html || '<li class="deur-leeg" aria-hidden="true">Nog leeg</li>';
      lijst.classList.toggle("open", !!open);
    });
    L.justIn = null;
    screenEl.querySelectorAll("[data-take]").forEach(function (b) {
      b.onclick = function () { takeBack(+b.getAttribute("data-take")); };
    });
    screenEl.querySelectorAll("[data-meer]").forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute("data-meer");
        L.open = L.open || {};
        L.open[id] = !L.open[id];
        paintLock();
        var nb = screenEl.querySelector('[data-meer="' + id + '"]');
        if (nb) nb.focus({ preventScroll: true });
      };
    });
    screenEl.querySelectorAll(".deur-btn").forEach(function (b) {
      if (L.cur === -1 || L.done) b.setAttribute("aria-disabled", "true"); else b.removeAttribute("aria-disabled");
    });
    var prev = document.getElementById("prev");
    if (L.done || L.cur === 0) prev.setAttribute("aria-disabled", "true"); else prev.removeAttribute("aria-disabled");
    var sh = shieldNow(), sc = document.getElementById("schildChip");
    sc.className = "ox-chip " + shieldTone(sh);
    sc.innerHTML = icon("shield") + "Schild " + sh + "%";
    /* Teller van kristallen en de prijs van de volgende aanwijzing */
    var have = S.crystals.length, usedFree = Math.min(L.used, have), gems = "";
    for (var g = 0; g < have; g++) gems += '<span class="gem' + (g < usedFree ? " used" : "") + '">' + icon("gem") + '</span>';
    document.getElementById("gems").innerHTML = gems + '<span>' + (have ? usedFree + " van " + have + " kristallen gebruikt" : "Geen kristallen verdiend") + '</span>';
    var free = L.used < have, cost = document.getElementById("hintCost");
    cost.className = "aw-cost " + (free ? "free" : "paid");
    cost.innerHTML = icon(free ? "gem" : "shield") + (free ? "Volgende aanwijzing zonder kosten" : "Volgende aanwijzing kost " + HINT_COST + " procent schild");
    renderHud();
  }

  /* Eén prijs: elk kristal uit dit level is één aanwijzing zonder kosten, daarna 10 procent schild.
     ARIA helpt eerst bij het stukje dat nu in beeld is, daarna bij een stukje dat in het verkeerde luik ligt. */
  function useHint() {
    var L = S.lock;
    if (L.done) return;
    var target = -1, i;
    if (L.cur !== -1 && !L.revealed[L.cur]) target = L.cur;
    for (i = 0; target === -1 && i < LOCK_ITEMS.length; i++) {
      if (!L.revealed[i] && L.place[i] !== LOCK_ITEMS[i].a) target = i;
    }
    if (target === -1) {
      var open = LOCK_ITEMS.some(function (it, k) { return L.place[k] !== it.a; });
      ariaSays(open ? "Je hebt al mijn aanwijzingen gekregen. Ze staan bij de stukjes zelf." : "Alles wat je nu hebt neergelegd klopt. Controleer de verdeling maar.");
      return;
    }
    var free = L.used < S.crystals.length;
    if (!free) S.shield -= HINT_COST;
    L.used++;
    L.revealed[target] = true;
    var it = LOCK_ITEMS[target], hname = hatch(it.a).name;
    var costChip = free ? chip("Zonder kosten, kristal gebruikt", "gold", "gem") : chip("Kostte " + HINT_COST + " procent schild", "warn", "shield");
    /* Gaat de aanwijzing over het stukje in beeld, dan zegt ARIA het in de kaart zelf. Anders in de tekstballon. */
    if (target === L.cur) { L.hintChip = { i: target, html: costChip }; lockMsg(""); }
    else { L.hintChip = null; ariaSays("“" + it.t + "” hoort bij " + hname + ". " + LOCK_WHY[it.a], costChip); }
    paintLock();
    announce(it.t + " hoort bij " + hname + ". " + (free ? "Zonder kosten." : "Min " + HINT_COST + " procent schild."));
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(function () {
      if (!S.lock || S.lock.done || S.screen !== "luchtsluis") { stopTimer(); return; }
      var el = document.getElementById("timer");
      if (S.lock.remaining === 0) return;
      S.lock.remaining = Math.max(0, S.lock.remaining - 1);
      if (el) { el.querySelector("span").textContent = fmt(S.lock.remaining); el.classList.toggle("low", S.lock.remaining <= 60); }
      if (S.lock.remaining === 60) announce("Nog een minuut.");
      if (S.lock.remaining === 0) {
        stopTimer();
        ariaSays("De tijd is om. Maak de verdeling af, de sluis wacht op je.");
        announce("De tijd is om.");
      }
    }, 1000);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function checkLock() {
    var L = S.lock;
    L.open = null;
    if (L.done) return;
    if (Object.keys(L.place).length < LOCK_ITEMS.length) { announce("Leg eerst elk stukje informatie in een luik."); return; }
    if (LOCK_ITEMS.some(function (it, i) { return L.verdict[i] === false; })) { announce("Haal eerst de rode stukjes terug en schuif ze door een ander luik."); return; }
    L.checks++;
    var wrong = 0;
    LOCK_ITEMS.forEach(function (it, i) {
      var ok = L.place[i] === it.a;
      L.verdict[i] = ok;
      if (!ok) wrong++;
    });
    if (!L.firstScored) {
      L.firstScored = true;
      var good = LOCK_ITEMS.length - wrong;
      S.points += good * 5;
      S.shield -= wrong * 5;
      S.results.lock = { good: good };
    }
    if (wrong > 0) {
      /* De uitslag staat in de kaart bovenaan en de foute stukjes zijn rood onder hun luik. */
      lockMsg("");
      paintLock();
      var first = screenEl.querySelector(".deur-item.fout");
      if (first) first.focus({ preventScroll: true });
      announce(wrong + " fout. Haal de rode stukjes terug en probeer opnieuw.");
      return;
    }
    L.done = true;
    stopTimer();
    screenLockOpen();
  }

  /* De verdeling klopt: de sluiscode licht op. Eigen stap, zodat het in één scherm past. */
  function screenLockOpen() {
    var cols = HATCHES.map(function (h) {
      var items = LOCK_ITEMS.filter(function (it) { return it.a === h.id; });
      return '<div class="ox-card luik-kolom h-' + h.id + '"><div class="kolom-kop"><span class="luik-teken on" aria-hidden="true">' + icon(h.icon) + '</span>' +
        '<div><h3>' + h.name + '</h3><span class="kolom-code" aria-hidden="true">' + items.length + '</span></div></div>' +
        '<p class="kolom-why">' + LOCK_WHY[h.id] + '</p>' +
        '<ul>' + items.map(function (it) { return '<li>' + icon("tick") + '<span>' + it.t + '</span></li>'; }).join("") + '</ul></div>';
    }).join("");
    var codeText = HATCHES.map(function (h) { return LOCK_ITEMS.filter(function (it) { return it.a === h.id; }).length; }).join(", ");
    show("luchtsluis",
      '<div class="ox-stack">' +
      head("De sluis is open", chip("Luchtsluis") + chip("Sluiscode " + codeText.replace(/, /g, " "), "ok", "tick")) +
      gradeAlert("goed", "De verdeling klopt", "Elk luik krijgt alleen wat het nodig heeft. De sluiscode licht op.") +
      '<p class="vcsw-sr-only">Sluiscode ' + codeText + '</p>' +
      '<div class="luik-kolommen">' + cols + '</div>' +
      say("aria", "Sluis open. Mooi werk. Dan nog even de debriefing, daarna mag je terug naar de aarde. Figuurlijk.") +
      '<div class="actions">' + nextBtn("Naar de debriefing", "go") + '</div></div>'
    );
    document.getElementById("go").onclick = screenDebrief;
    announce("De verdeling klopt. De sluis is open.");
  }

  function gradeBadge(g) {
    var m = { goed: ["success", "Goed"], half: ["warning", "Half goed"], fout: ["danger", "Fout"] }[g];
    return '<span class="vcsw-badge ' + m[0] + '">' + m[1] + '</span>';
  }

  function screenDebrief() {
    stopTimer();
    S.shield = Math.max(0, S.shield);
    var pct = pctNow();
    S.passed = pct >= 70;
    if (S.passed) S.rank = "Commandeur";
    var r = S.results;
    var rows =
      '<tr><th scope="row">Situatie 1: De ziekmelding</th><td>' + gradeBadge(r.s1.grade) + '</td><td>' + r.s1.good + ' van 10 velden goed</td></tr>' +
      '<tr><th scope="row">Situatie 2: De nieuwsgierige kapitein</th><td>' + gradeBadge(r.s2.grade) + '</td><td>Optie ' + r.s2.pick + '</td></tr>' +
      '<tr><th scope="row">Situatie 3: Het verkeerde kanaal</th><td>' + gradeBadge(r.s3.grade) + '</td><td>Optie ' + r.s3.pick + '</td></tr>' +
      '<tr><th scope="row">Situatie 4: De crewchat</th><td>' + gradeBadge(r.s4.grade) + '</td><td>Optie ' + r.s4.pick + '</td></tr>' +
      '<tr><th scope="row">Luchtsluis: De drie luiken</th><td>' + gradeBadge(r.lock.good === 8 ? "goed" : (r.lock.good >= 6 ? "half" : "fout")) + '</td><td>' + r.lock.good + ' van 8 in één keer goed</td></tr>';
    var crystals = S.crystals.length ? S.crystals.map(function (c) { return chip(c, "gold", "gem"); }).join("") : '<span class="ox-muted">Nog geen kristallen in dit level.</span>';
    var result = S.passed
      ? '<div class="vcsw-alert success">' + icon("check") + '<div><p class="vcsw-alert-title">Level gehaald met ' + pct + ' procent</p><p class="vcsw-alert-text">ARIA bevordert je tot Commandeur.</p></div></div>'
      : '<div class="vcsw-alert error">' + icon("x") + '<div><p class="vcsw-alert-title">Nog niet gehaald, je hebt ' + pct + ' procent</p><p class="vcsw-alert-text">Je hebt minimaal 70 procent nodig. Speel de dienst opnieuw.</p></div></div>';
    var flag = S.flags.joran ? '<div class="onthoud">' + icon("alert") + '<p><strong>Onthouden voor de eindmissie.</strong> Je vertelde Kapitein Vega dat Joran overspannen is. Joran dient daarover later een klacht in.</p></div>' : "";
    show("resultaat",
      '<div class="ox-stack tight">' +
      head("Wat ARIA je meegeeft") +
      result +
      '<div class="ox-card flush"><table class="ox-table"><caption class="vcsw-sr-only">Je resultaat per onderdeel</caption><thead><tr><th scope="col">Onderdeel</th><th scope="col">Oordeel</th><th scope="col">Toelichting</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="ox-two">' +
      '<div class="ox-card"><h3>Drie regels voor in je geheugenbank</h3>' +
      '<ol class="rules"><li>Vraag nooit naar de diagnose of oorzaak van ziekte, ook niet indirect.</li><li>Wat iemand je vertrouwelijk vertelt, geef je niet door.</li><li>Gevoelige gegevens alleen voor wie ze nodig heeft, en nooit in een chat of groepsapp.</li></ol></div>' +
      '<div class="ox-card"><h3>Datakristallen uit dit level</h3><div class="crystal-list">' + crystals + '</div>' + flag + '</div></div>' +
      '<div class="actions">' + nextBtn("Terug op aarde", "go") +
      (S.passed ? "" : '<button type="button" class="ox-btn ghost lg" id="retry">Dienst opnieuw spelen' + icon("refresh") + '</button>') +
      '</div></div>'
    );
    document.getElementById("go").onclick = screenEarth;
    var retry = document.getElementById("retry");
    if (retry) retry.onclick = function () { reset(); screenBriefing(); };
  }

  function copyAddress(btn) {
    var label = btn.querySelector("span"), addr = "jz@vcsw.nl";
    function done(ok) {
      label.textContent = ok ? "Adres gekopieerd" : "Kopiëren lukt niet";
      announce(ok ? "Het adres jz@vcsw.nl is gekopieerd." : "Kopiëren lukt niet. Selecteer het adres en kopieer het zelf.");
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

  function screenEarth() {
    stopTimer();
    var pct = pctNow(), passed = pct >= 70, sh = shieldNow(), cr = S.crystals.length;
    show("aarde",
      '<div class="ox-stack aarde">' +
      '<div class="screen-head"><h2>Wat dit betekent voor je werk</h2><p class="ox-lead">Het station is verzonnen. Dit neem je mee naar je werk.</p></div>' +
      '<div class="ox-two">' +
      '<div class="ox-card"><h3>Hier gaat het om</h3><ul class="ox-rows top">' +
      row("dot", "blue", "Op je werk gaat dit over verzuim.") +
      row("dot", "blue", "Een werkgever mag niet naar de diagnose vragen. Medische informatie is voor de bedrijfsarts.") +
      row("dot", "blue", "Gegevens zoals de no-riskpolis en registratie in het doelgroepregister zijn gevoelig en horen alleen in het beveiligde systeem, bij wie ze nodig heeft voor bijvoorbeeld LKV of de no-riskpolis.") +
      '</ul></div>' +
      '<div class="ox-card"><h3>Dit doe je morgen</h3><ul class="ox-rows top">' +
      row("tick", "blue", "Vraag nooit naar de diagnose of oorzaak van ziekte, ook niet indirect.") +
      row("tick", "blue", "Wat iemand je vertrouwelijk vertelt, geef je niet door.") +
      row("tick", "blue", "Gevoelige gegevens alleen voor wie ze nodig heeft, en nooit in een chat of groepsapp.") +
      '</ul></div></div>' +
      '<div class="ox-card meldroute"><div class="meld-txt"><h3>Meldroute</h3><p>Twijfel of een vermoedelijk datalek? Meld het direct bij de security officer, de privacy officer of via het meldpunt.</p></div>' +
      '<span class="meld-adres">jz@vcsw.nl</span>' +
      '<button type="button" class="ox-btn ghost" id="copy"><span>Kopieer adres</span>' + icon("copy") + '</button></div>' +
      '<div class="ox-card uitslag"><div class="uitslag-kop"><h3>Resultaat level 3</h3>' + chip(passed ? "Gehaald" : "Nog niet gehaald", passed ? "ok" : "warn", passed ? "tick" : "") +
      '<button type="button" class="ox-btn" id="again">Speel level 3 opnieuw' + icon("refresh") + '</button></div>' +
      '<div class="uitslag-grid">' +
      '<div><p class="lbl">Score</p><p class="val">' + S.points + ' van ' + MAX_POINTS + ' punten</p><div class="track"><div class="fill" style="width:' + Math.min(100, pct) + '%"></div><span class="mark"></span></div>' +
      '<p class="note">' + pct + ' procent. ' + (passed ? "De grens is 70 procent." : "Je hebt 70 procent nodig.") + '</p></div>' +
      '<div><p class="lbl">Schild</p><p class="val">' + sh + ' procent</p><div class="track"><div class="fill ' + shieldTone(sh) + '" style="width:' + sh + '%"></div></div>' +
      '<p class="note">Het schild telt niet mee voor halen. Het laat zien hoe zeker je speelde.</p></div>' +
      '<div><p class="lbl">Kristallen</p><p class="val">' + cr + ' van ' + CRYSTALS_MAX + '</p><div class="track"><div class="fill gold" style="width:' + (cr / CRYSTALS_MAX * 100) + '%"></div></div>' +
      '<p class="note">Elk kristal was één aanwijzing zonder kosten.</p></div>' +
      '</div></div>' +
      '</div>'
    );
    document.getElementById("copy").onclick = function () { copyAddress(this); };
    document.getElementById("again").onclick = function () { reset(); screenStart(); };
  }

  /* ---------- Testsprong: ?scherm=<naam> begint direct op een scherm, met een voorbeeldstand ---------- */
  function demo(low, withLock) {
    reset();
    if (low) {
      S.points = 5; S.shield = 64; S.flags.joran = true;
      S.results = { s1: { grade: "half", good: 7 }, s2: { grade: "fout", pick: "B" }, s3: { grade: "fout", pick: "B" }, s4: { grade: "fout", pick: "A" } };
      if (withLock) { S.points += 20; S.shield -= 20; S.results.lock = { good: 4 }; }
    } else {
      S.points = 30; S.shield = 90; S.crystals = ["Wat mag je vragen bij ziekte", "Need to know"];
      S.results = { s1: { grade: "goed", good: 9 }, s2: { grade: "goed", pick: "C" }, s3: { grade: "fout", pick: "B" }, s4: { grade: "goed", pick: "B" } };
      if (withLock) { S.points += 35; S.shield -= 5; S.results.lock = { good: 7 }; }
    }
  }
  function jump() {
    var q; try { q = new URLSearchParams(location.search); } catch (e) { return false; }
    var name = q.get("scherm"), low = q.get("stand") === "laag";
    if (!name) return false;
    if (name === "briefing") { screenBriefing(); return true; }
    if (name === "dienst") { screenSickReport(); return true; }
    if (/^situatie[234]$/.test(name)) { demo(low); screenChoice(+name.slice(-1) - 2); return true; }
    if (name === "luchtsluis") { demo(low); screenLockIntro(); return true; }
    if (name === "sluis") {
      demo(low); screenLock();
      /* &gekozen=5 legt de eerste vijf stukjes alvast bij een luik, voor een voorbeeldbeeld. */
      var pre = Math.min(LOCK_ITEMS.length, +q.get("gekozen") || 0);
      for (var k = 0; k < pre; k++) S.lock.place[k] = LOCK_ITEMS[k].a;
      /* &fout=1 legt het eerste stukje in het verkeerde luik en controleert meteen, voor een beeld na de controle. */
      if (pre === LOCK_ITEMS.length && q.get("fout")) S.lock.place[0] = LOCK_ITEMS[0].a === "arts" ? "chef" : "arts";
      S.lock.cur = pre ? nextOpen(pre - 1) : 0;
      if (pre) paintLock();
      if (pre === LOCK_ITEMS.length && q.get("fout")) checkLock();
      return true;
    }
    if (name === "sluisopen") { demo(low, true); S.screen = "luchtsluis"; screenLockOpen(); return true; }
    if (name === "resultaat") { demo(low, true); screenDebrief(); return true; }
    if (name === "aarde") { demo(low, true); S.passed = pctNow() >= 70; if (S.passed) S.rank = "Commandeur"; screenEarth(); return true; }
    return false;
  }

  if (!jump()) screenStart();
})();
