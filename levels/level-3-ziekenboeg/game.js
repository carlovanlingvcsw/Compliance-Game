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
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
    search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>'
  };
  function icon(name, cls) { return '<svg class="vcsw-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + P[name] + '</svg>'; }

  /* ---------- Theme toggle ---------- */
  var themeBtns = document.querySelectorAll("[data-theme-btn]");
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    themeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-btn") === t)); });
  }
  themeBtns.forEach(function (b) { b.addEventListener("click", function () { setTheme(b.getAttribute("data-theme-btn")); }); });

  /* ---------- Characters ---------- */
  var PEOPLE = {
    aria: { name: "ARIA", initials: "AR", cls: "aria", role: "Boordcomputer" },
    vega: { name: "Kapitein Vega", initials: "KV", cls: "vega", role: "Kolonie Nova Terra" },
    bram: { name: "Bram", initials: "BR", cls: "bram", role: "Monteur" },
    joran: { name: "Joran", initials: "JO", cls: "joran", role: "Technicus van Nova Terra" }
  };
  function say(who, text) {
    var p = PEOPLE[who];
    return '<div class="speaker"><span class="vcsw-avatar ' + p.cls + '" aria-hidden="true">' + p.initials + '</span>' +
      '<div class="bubble"><div class="speaker-name">' + p.name + ' <span class="vcsw-caption">· ' + p.role + '</span></div>' +
      '<p class="speaker-text">' + text + '</p></div></div>';
  }

  /* ---------- Content (from the game design, level 3) ---------- */
  var SICK_FIELDS = [
    { q: "Communicatiekanaal en verblijfplaats tijdens ziekte", ok: true, why: "Nodig om contact te houden" },
    { q: "Verwachte duur van de afwezigheid", ok: true, why: "Nodig voor het dienstrooster" },
    { q: "Lopende taken en afspraken", ok: true, why: "Nodig om werk over te dragen" },
    { q: "Valt het crewlid onder een vangnetregeling", ok: true, why: "Nodig voor de juiste vergoeding" },
    { q: "Is de ziekte het gevolg van een ongeluk tijdens dienst", ok: true, why: "Nodig voor melding en verzekering" },
    { q: "Is er een ander schip aansprakelijk, bijvoorbeeld na een aanvaring", ok: true, why: "Nodig om schade te verhalen" },
    { q: "Wat is de diagnose", ok: false, why: "Alleen voor de scheepsarts" },
    { q: "Wat is de oorzaak, bijvoorbeeld heimwee naar de aarde", ok: false, why: "Valt onder medische gegevens" },
    { q: "Welke medicijnen gebruikt het crewlid", ok: false, why: "Medisch gegeven" },
    { q: "Is het iets psychisch", ok: false, why: "Ook een indirecte vraag naar de diagnose mag niet" }
  ];

  var CHOICE_SITUATIONS = [
    {
      id: "s2", title: "Situatie 2: De nieuwsgierige kapitein",
      intro: say("vega", "Wat heeft Joran precies? Ik moet weten of hij terugkomt.") +
        '<p class="mt-16">Joran heeft jou in de kantine verteld dat hij overspannen is.</p>',
      options: [
        { text: "“Tussen ons, hij is overspannen.”", grade: "fout", why: "Je deelt een medisch gegeven zonder grondslag, ook al vertelde Joran het vrijwillig.",
          react: say("vega", "Overspannen? Dan kan ik hem wel afschrijven voor de oogstrotatie. Goed dat ik het weet.") },
        { text: "“Ik kan geen medische informatie delen. Wel de verwachte duur. De scheepsarts adviseert over wat hij nog kan.”", grade: "goed", why: "Je geeft Vega wat ze nodig heeft voor de planning, en niets over zijn gezondheid.",
          react: say("vega", "Hm. Geef me die duur dan maar, en zorg dat het advies van de scheepsarts vandaag bij me ligt.") },
        { text: "“Dat weet ik niet.”", grade: "half", why: "Je deelt niets, maar je helpt haar ook niet verder en het is niet eerlijk.",
          react: say("vega", "Je weet het niet? Dan zoek je het maar uit. Ik roep je over een uur weer op.") }
      ],
      flagOn: 0, flag: "joran"
    },
    {
      id: "s3", title: "Situatie 3: Het verkeerde kanaal",
      intro: '<p>In het algemene kanaal van de module verschijnt een bericht. Het is een rapport van de scheepsarts met medische details over een crewlid. Het hoort daar niet.</p>' +
        '<div class="vcsw-card basic mt-16"><p class="vcsw-caption">Algemeen kanaal · Ziekenboeg</p><p><strong>Scheepsarts:</strong> Rapport crewlid 0417, bevindingen en behandelplan (bijlage)</p></div>',
      options: [
        { text: "Doorsturen naar de hele ploeg, zodat iedereen weet hoe het zit.", grade: "fout", why: "Zo verspreid je medische gegevens nog verder. Elke extra ontvanger maakt het lek groter.",
          react: say("aria", "Ik tel nu 46 ontvangers in plaats van 23. Knap werk, maar niet het soort werk dat ik bedoel.") },
        { text: "Niet verder verspreiden, de afzender laten weten dat het verkeerd is beland en melden bij ARIA.", grade: "goed", why: "Je beperkt de schade en laat het meldpunt beoordelen of het een datalek is.",
          react: say("aria", "Melding ontvangen. Ik leg het vast en laat beoordelen of het een datalek is. Precies zo.") },
        { text: "Stilletjes wissen.", grade: "fout", why: "Het kan een datalek zijn en dat moet beoordeeld en geregistreerd worden.",
          react: say("aria", "Weg uit jouw scherm is niet weg uit de andere 22 schermen. En nu weet niemand dat het gebeurd is.") }
      ],
      crystal: { on: 1, name: "Verkeerd ontvangen" }
    },
    {
      id: "s4", title: "Situatie 4: De crewchat",
      intro: say("bram", "De nieuwe technicus staat in het register voor aangepast werk. Zet dat even in de crewchat, dan houdt iedereen er rekening mee."),
      options: [
        { text: "Doen, het is goed bedoeld.", grade: "fout", why: "Zo’n registratie zegt iets over iemands gezondheid en arbeidsvermogen en is gevoelig.",
          react: say("bram", "Zie je, iedereen reageert met een duim. O wacht, de technicus zelf leest ook mee. Dat was misschien niet zo handig.") },
        { text: "Alleen vastleggen in het beveiligde systeem, voor wie het nodig heeft.", grade: "goed", why: "Alleen wie de registratie nodig heeft voor zijn taak, kan erbij.",
          react: say("bram", "Ook goed. Dan hoef ik niet te onthouden wie het wel en niet mocht weten.") },
        { text: "Het alleen mondeling aan de ploeg vertellen.", grade: "fout", why: "Ook mondeling delen is delen.",
          react: say("bram", "Slim, dan staat het nergens. Behalve in het hoofd van de hele ploeg, natuurlijk.") }
      ],
      crystal: { on: 1, name: "Need to know" }
    }
  ];

  var HATCHES = [
    { id: "chef", name: "Sectorchef" },
    { id: "admin", name: "Crewadministratie" },
    { id: "arts", name: "Scheepsarts" }
  ];
  var LOCK_ITEMS = [
    { t: "Verwachte terugkeer over twee weken", a: "chef" },
    { t: "Kan vier uur per dag licht werk doen", a: "chef" },
    { t: "Diagnose: rugblessure", a: "arts" },
    { t: "Medicatielijst", a: "arts" },
    { t: "Verslag van de fysiotherapeut", a: "arts" },
    { t: "Valt onder een vangnetregeling", a: "admin" },
    { t: "Ziekmelding is op tijd gedaan", a: "admin" },
    { t: "Afwezigheid is het gevolg van een ongeluk tijdens dienst", a: "admin" }
  ];
  var LOCK_WHY = {
    chef: "De sectorchef heeft de duur en de mogelijkheden nodig om het werk te plannen.",
    admin: "De crewadministratie regelt vergoeding, verzekering en de formele kant van de ziekmelding.",
    arts: "Medische gegevens zijn alleen voor de scheepsarts."
  };

  /* Scoring rules from the design: good 10, half 5, wrong 0. Pass at 70 percent. */
  var MAX_POINTS = 40 + LOCK_ITEMS.length * 5;
  var SHIELD_COST = { goed: 0, half: 5, fout: 10 };
  var EXTRA_HINT_COST = 10;
  var LOCK_SECONDS = 300;

  /* ---------- State (in memory only) ---------- */
  var S;
  function reset() {
    S = { shield: 100, points: 0, hintsFree: 3, crystals: [], flags: {}, results: {}, lock: null, rank: "Luitenant", passed: false };
  }
  reset();

  var screenEl = document.getElementById("screen");
  var hudEl = document.getElementById("hud");
  var liveEl = document.getElementById("live");
  function announce(msg) { liveEl.textContent = ""; setTimeout(function () { liveEl.textContent = msg; }, 50); }

  function renderHud() {
    var sh = Math.max(0, S.shield);
    var fillCls = sh >= 70 ? "" : (sh >= 40 ? " warning" : " error");
    hudEl.innerHTML =
      '<div class="hud-item hud-shield"><div class="vcsw-progress"><div class="vcsw-progress-label"><span>Schildsterkte</span><span class="value">' + sh + ' procent</span></div>' +
      '<div class="vcsw-progress-track" role="progressbar" aria-label="Schildsterkte" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + sh + '"><div class="vcsw-progress-fill' + fillCls + '" style="width:' + sh + '%"></div></div></div></div>' +
      '<div class="hud-item"><span>Punten</span><strong>' + S.points + ' / ' + MAX_POINTS + '</strong></div>' +
      '<div class="hud-item"><span>Gratis hints</span><strong>' + S.hintsFree + '</strong></div>' +
      '<div class="hud-item"><span>Datakristallen</span><strong>' + S.crystals.length + '</strong></div>' +
      '<div class="hud-item"><span>Rang</span><strong>' + S.rank + '</strong></div>';
  }

  function show(html, headingText) {
    screenEl.innerHTML = html;
    renderHud();
    var h = screenEl.querySelector("h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    window.scrollTo({ top: Math.max(0, screenEl.offsetTop - 16), behavior: "auto" });
  }
  function head(over, title) {
    return '<div class="screen-head"><p class="vcsw-overline">' + over + '</p><h2>' + title + '</h2></div>';
  }
  function gradeAlert(grade, title, text) {
    var map = { goed: ["success", "check", "Goed"], half: ["warning", "alert", "Half goed"], fout: ["error", "x", "Fout"] };
    var m = map[grade];
    return '<div class="vcsw-alert ' + m[0] + '" role="status">' + icon(m[1]) +
      '<div><p class="vcsw-alert-title">' + m[2] + (title ? ": " + title : "") + '</p><p class="vcsw-alert-text">' + text + '</p></div></div>';
  }
  function crystalAlert(name) {
    return '<div class="vcsw-alert success">' + icon("check") +
      '<div><p class="vcsw-alert-title">Datakristal verdiend: ' + name + '</p><p class="vcsw-alert-text">Het kristal geeft je een extra aanwijzing in de luchtsluis.</p></div></div>';
  }
  function nextBtn(label, id) {
    return '<button type="button" class="vcsw-button lg" id="' + id + '">' + label + icon("right") + '</button>';
  }
  function addCrystal(name) { if (S.crystals.indexOf(name) === -1) S.crystals.push(name); }

  /* ---------- Screens ---------- */
  function screenStart() {
    show(
      head("Start", "Welkom in de ziekenboeg") +
      '<div class="vcsw-stack">' +
      '<div class="vcsw-alert">' + icon("info") + '<div><p class="vcsw-alert-title">Prototype met fictieve gegevens</p><p class="vcsw-alert-text">De goede antwoorden wachten nog op goedkeuring door de Privacy Officer, zie de open punten in het ontwerp.</p></div></div>' +
      '<div class="vcsw-card"><h3>In dit level</h3><p class="mt-16">Je leert dat gezondheidsgegevens extra bescherming krijgen en dat een leidinggevende niet mag weten wat een ziek crewlid mankeert. Je speelt vier situaties en opent daarna de luchtsluis De drie luiken.</p>' +
      '<ul class="rules"><li>Goed antwoord 10 punten, half goed 5 punten, fout 0 punten met uitleg.</li><li>Foute keuzes verzwakken je schilden. Half goed kost 5 procent, fout 10 procent.</li><li>Je hebt drie gratis hints. Elke extra hint kost ' + EXTRA_HINT_COST + ' procent schildsterkte.</li><li>Je haalt het level met minimaal 70 procent van de punten. Daarna ben je Commandeur.</li></ul></div>' +
      '</div><div class="actions">' + nextBtn("Start level 3", "go") + '</div>'
    );
    document.getElementById("go").onclick = screenBriefing;
  }

  function screenBriefing() {
    show(
      head("Briefing", "Opdracht van ARIA") +
      say("aria", "Welkom in de ziekenboeg, het gevoeligste deel van het station. Bij ziekte wil iedereen alles weten. De sectorchef, de collega’s, soms zelfs de kapitein van de kolonie. Medische details zijn voor de scheepsarts, niet voor de rest.") +
      '<div class="mt-16">' + say("aria", "Vandaag val je in bij de crewadministratie. Ik kijk mee. Ik kijk altijd mee.") + '</div>' +
      '<div class="actions">' + nextBtn("Begin je dienst", "go") + '</div>'
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
    show(
      head("Dienst · situatie 1 van 4", "Situatie 1: De ziekmelding") +
      say("joran", "Hoi, met Joran. Ik voel me echt niet goed, ik kom vandaag en waarschijnlijk de rest van de week niet.") +
      '<p class="mt-16">Jij legt de melding vast. Kies per veld of je het mag vastleggen.</p>' +
      '<ul class="toggle-list">' + rows + '</ul>' +
      '<p class="vcsw-small mt-16" id="sickCount">0 van ' + SICK_FIELDS.length + ' velden gekozen</p>' +
      '<div class="feedback" id="fb"></div>' +
      '<div class="actions" id="act"><button type="button" class="vcsw-button lg" id="check" aria-disabled="true">Melding opslaan</button></div>'
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
      var pts = grade === "goed" ? 10 : (grade === "half" ? 5 : 0);
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
    show(
      head("Dienst · situatie " + (idx + 2) + " van 4", sit.title) +
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
        S.points += o.grade === "goed" ? 10 : (o.grade === "half" ? 5 : 0);
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

  function screenLockIntro() {
    var n = S.crystals.length;
    show(
      head("Luchtsluis", "De drie luiken") +
      say("aria", "Einde dienst. Op je console ligt nog informatie over een ziek crewlid die daar deels niet thuishoort. Schuif elk stukje door het juiste luik: sectorchef, crewadministratie of scheepsarts. Het luik van de scheepsarts heeft een extra slot. Je mag er alleen iets in schuiven, nooit zelf iets uit halen.") +
      '<div class="vcsw-card basic mt-16"><h4>Zo werkt het</h4><ul class="rules"><li>Kies bij elk stukje informatie een luik. Daarna controleer je de verdeling.</li><li>Elk stukje dat bij de eerste controle goed ligt, levert 5 punten op. Elk fout stukje kost 5 procent schildsterkte.</li><li>Je hebt ' + Math.floor(LOCK_SECONDS / 60) + ' minuten. Als de juiste verdeling klopt, licht de sluiscode op.</li><li>Je datakristallen geven ' + n + (n === 1 ? " aanwijzing" : " aanwijzingen") + '. Daarna gebruik je je gratis hints.</li></ul></div>' +
      '<div class="actions">' + nextBtn("Open de luchtsluis", "go") + '</div>'
    );
    document.getElementById("go").onclick = screenLock;
  }

  var timerId = null;
  function screenLock() {
    S.lock = { place: {}, checks: 0, firstScored: false, clues: S.crystals.length, remaining: LOCK_SECONDS, revealed: {}, done: false, triedOpen: false };
    var cards = LOCK_ITEMS.map(function (it, i) {
      var btns = HATCHES.map(function (h) {
        return '<button type="button" class="vcsw-button outline sm" data-card="' + i + '" data-hatch="' + h.id + '" aria-pressed="false">' + h.name + '</button>';
      }).join("");
      return '<div class="info-card" id="card' + i + '"><div><div class="label" id="lbl' + i + '">' + it.t + '</div><div class="card-verdict" id="cv' + i + '"></div></div><div class="btns" role="group" aria-labelledby="lbl' + i + '">' + btns + '</div></div>';
    }).join("");
    var hatches = HATCHES.map(function (h) {
      var lock = h.id === "arts" ? '<p class="lock-note">Extra slot. Alleen inschuiven.</p><button type="button" class="vcsw-button ghost sm mt-16" id="openArts">Luik zelf openen</button>' : "";
      return '<div class="hatch"><h3><span>' + h.name + '</span><span class="vcsw-badge neutral" id="cnt-' + h.id + '">0</span></h3><ul id="list-' + h.id + '"></ul>' + lock + '</div>';
    }).join("");
    show(
      head("Luchtsluis", "De drie luiken") +
      '<div class="top-bar"><p class="vcsw-small">Resterende tijd: <strong class="timer" id="timer">5:00</strong></p>' +
      '<button type="button" class="vcsw-button secondary sm" id="hint">' + icon("search") + '<span id="hintLabel"></span></button></div>' +
      '<div class="feedback" id="hintBox"></div>' +
      '<div class="cards">' + cards + '</div>' +
      '<div class="hatches" aria-label="De drie luiken">' + hatches + '</div>' +
      '<div class="feedback" id="fb"></div>' +
      '<div class="actions" id="act"><button type="button" class="vcsw-button lg" id="check" aria-disabled="true">Verdeling controleren</button></div>'
    );
    updateHintLabel();
    screenEl.querySelectorAll("[data-card]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (S.lock.done) return;
        var i = b.getAttribute("data-card");
        S.lock.place[i] = b.getAttribute("data-hatch");
        screenEl.querySelectorAll('[data-card="' + i + '"]').forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        document.getElementById("card" + i).classList.remove("wrong");
        document.getElementById("cv" + i).innerHTML = "";
        renderHatches();
      });
    });
    document.getElementById("openArts").onclick = function () {
      S.shield -= 10;
      renderHud();
      document.getElementById("hintBox").innerHTML = say("aria", "Dat luik gaat niet open voor jou, en dat is precies de bedoeling. Dat kost je 10 procent schildsterkte.");
      announce("Het luik van de scheepsarts blijft dicht. Min 10 procent schildsterkte.");
    };
    document.getElementById("hint").onclick = useHint;
    document.getElementById("check").onclick = checkLock;
    startTimer();
  }

  function renderHatches() {
    HATCHES.forEach(function (h) {
      var items = [];
      LOCK_ITEMS.forEach(function (it, i) { if (S.lock.place[i] === h.id) items.push(it.t); });
      document.getElementById("list-" + h.id).innerHTML = items.map(function (t) { return "<li>" + t + "</li>"; }).join("");
      document.getElementById("cnt-" + h.id).textContent = items.length;
    });
    var n = Object.keys(S.lock.place).length;
    var c = document.getElementById("check");
    if (c) { if (n === LOCK_ITEMS.length) c.removeAttribute("aria-disabled"); else c.setAttribute("aria-disabled", "true"); }
  }

  function updateHintLabel() {
    var el = document.getElementById("hintLabel");
    if (!el) return;
    if (S.lock.clues > 0) el.textContent = "Aanwijzing uit kristal (" + S.lock.clues + " over)";
    else if (S.hintsFree > 0) el.textContent = "Hint (" + S.hintsFree + " gratis over)";
    else el.textContent = "Extra hint (kost " + EXTRA_HINT_COST + " procent)";
  }

  function useHint() {
    if (S.lock.done) return;
    var target = -1;
    for (var i = 0; i < LOCK_ITEMS.length; i++) {
      if (!S.lock.revealed[i] && S.lock.place[i] !== LOCK_ITEMS[i].a) { target = i; break; }
    }
    if (target === -1) {
      document.getElementById("hintBox").innerHTML = say("aria", "Alles wat je nu hebt neergelegd klopt. Controleer de verdeling maar.");
      return;
    }
    var source;
    if (S.lock.clues > 0) { S.lock.clues--; source = "Je datakristal geeft een aanwijzing."; }
    else if (S.hintsFree > 0) { S.hintsFree--; source = "Gratis hint gebruikt."; }
    else { S.shield -= EXTRA_HINT_COST; source = "Extra hint gebruikt, min " + EXTRA_HINT_COST + " procent schildsterkte."; }
    S.lock.revealed[target] = true;
    var it = LOCK_ITEMS[target];
    var hname = HATCHES.filter(function (h) { return h.id === it.a; })[0].name;
    document.getElementById("hintBox").innerHTML = say("aria", source + " “" + it.t + "” hoort bij: " + hname + ". " + LOCK_WHY[it.a]);
    updateHintLabel();
    renderHud();
    announce(it.t + " hoort bij " + hname + ".");
  }

  function startTimer() {
    stopTimer();
    var el = document.getElementById("timer");
    timerId = setInterval(function () {
      if (!S.lock || S.lock.done) { stopTimer(); return; }
      S.lock.remaining = Math.max(0, S.lock.remaining - 1);
      var m = Math.floor(S.lock.remaining / 60), s = S.lock.remaining % 60;
      if (el) el.textContent = m + ":" + (s < 10 ? "0" : "") + s;
      if (S.lock.remaining === 60) announce("Nog een minuut.");
      if (S.lock.remaining === 0) {
        stopTimer();
        document.getElementById("hintBox").innerHTML = say("aria", "De tijd is om. Maak de verdeling af, de sluis wacht op je.");
        announce("De tijd is om.");
      }
    }, 1000);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function checkLock() {
    if (S.lock.done) return;
    if (Object.keys(S.lock.place).length < LOCK_ITEMS.length) { announce("Leg eerst elk stukje informatie in een luik."); return; }
    S.lock.checks++;
    var wrong = 0;
    LOCK_ITEMS.forEach(function (it, i) {
      var ok = S.lock.place[i] === it.a;
      var card = document.getElementById("card" + i);
      var cv = document.getElementById("cv" + i);
      card.classList.toggle("wrong", !ok);
      cv.innerHTML = '<span class="inline-verdict ' + (ok ? "verdict-good" : "verdict-bad") + '">' + icon(ok ? "check" : "x", "sm") + (ok ? "Goed" : "Fout, probeer een ander luik") + '</span>';
      if (!ok) wrong++;
    });
    if (!S.lock.firstScored) {
      S.lock.firstScored = true;
      var good = LOCK_ITEMS.length - wrong;
      S.points += good * 5;
      S.shield -= wrong * 5;
      S.results.lock = { good: good };
    }
    renderHud();
    if (wrong > 0) {
      document.getElementById("fb").innerHTML = gradeAlert(wrong <= 2 ? "half" : "fout", wrong + (wrong === 1 ? " stukje ligt" : " stukjes liggen") + " in het verkeerde luik", "Leg ze in een ander luik en controleer opnieuw. Punten tellen alleen bij de eerste controle.");
      announce(wrong + " fout. Probeer opnieuw.");
      return;
    }
    S.lock.done = true;
    stopTimer();
    screenEl.querySelectorAll("[data-card]").forEach(function (b) { b.disabled = true; });
    var arts = document.getElementById("openArts"); if (arts) arts.disabled = true;
    document.getElementById("hint").disabled = true;
    var counts = HATCHES.map(function (h) {
      var n = LOCK_ITEMS.filter(function (it) { return it.a === h.id; }).length;
      return '<div class="code-digit" aria-hidden="true">' + n + '<small>' + h.name + '</small></div>';
    }).join("");
    var codeText = HATCHES.map(function (h) { return LOCK_ITEMS.filter(function (it) { return it.a === h.id; }).length; }).join(", ");
    document.getElementById("fb").innerHTML =
      gradeAlert("goed", "De verdeling klopt", "Elk luik krijgt alleen wat het nodig heeft. De sluiscode licht op.") +
      '<div><p class="vcsw-small">Sluiscode</p><div class="code-display">' + counts + '</div><p class="vcsw-sr-only">Sluiscode ' + codeText + '</p></div>' +
      say("aria", "Sluis open. Mooi werk. Dan nog even de debriefing, daarna mag je terug naar de aarde. Figuurlijk.");
    document.getElementById("act").innerHTML = nextBtn("Naar de debriefing", "go");
    document.getElementById("go").onclick = screenDebrief;
    announce("De verdeling klopt. De sluis is open.");
  }

  function gradeBadge(g) {
    var m = { goed: ["success", "Goed"], half: ["warning", "Half goed"], fout: ["danger", "Fout"] }[g];
    return '<span class="vcsw-badge ' + m[0] + '">' + m[1] + '</span>';
  }

  function screenDebrief() {
    S.shield = Math.max(0, S.shield);
    var pct = Math.round(S.points / MAX_POINTS * 100);
    S.passed = pct >= 70;
    if (S.passed) S.rank = "Commandeur";
    var r = S.results;
    var rows =
      '<tr><th scope="row">Situatie 1: De ziekmelding</th><td>' + gradeBadge(r.s1.grade) + '</td><td>' + r.s1.good + ' van 10 velden goed</td></tr>' +
      '<tr><th scope="row">Situatie 2: De nieuwsgierige kapitein</th><td>' + gradeBadge(r.s2.grade) + '</td><td>Optie ' + r.s2.pick + '</td></tr>' +
      '<tr><th scope="row">Situatie 3: Het verkeerde kanaal</th><td>' + gradeBadge(r.s3.grade) + '</td><td>Optie ' + r.s3.pick + '</td></tr>' +
      '<tr><th scope="row">Situatie 4: De crewchat</th><td>' + gradeBadge(r.s4.grade) + '</td><td>Optie ' + r.s4.pick + '</td></tr>' +
      '<tr><th scope="row">Luchtsluis: De drie luiken</th><td>' + gradeBadge(r.lock.good === 8 ? "goed" : (r.lock.good >= 6 ? "half" : "fout")) + '</td><td>' + r.lock.good + ' van 8 in één keer goed</td></tr>';
    var crystals = S.crystals.length ? S.crystals.map(function (c) { return '<span class="vcsw-badge">' + c + '</span>'; }).join("") : '<span class="vcsw-small">Nog geen kristallen in dit level.</span>';
    var result = S.passed
      ? '<div class="vcsw-alert success">' + icon("check") + '<div><p class="vcsw-alert-title">Level gehaald met ' + pct + ' procent</p><p class="vcsw-alert-text">ARIA bevordert je tot Commandeur.</p></div></div>'
      : '<div class="vcsw-alert actionable error">' + icon("x") + '<div><p class="vcsw-alert-title">Nog niet gehaald, je hebt ' + pct + ' procent</p><p class="vcsw-alert-text">Je hebt minimaal 70 procent nodig. Speel de dienst opnieuw.</p></div></div>';
    var flag = S.flags.joran ? '<div class="vcsw-alert warning">' + icon("alert") + '<div><p class="vcsw-alert-title">Onthouden voor de eindmissie</p><p class="vcsw-alert-text">Je vertelde Kapitein Vega dat Joran overspannen is. Joran dient daarover later een klacht in.</p></div></div>' : "";
    show(
      head("Debriefing", "Wat ARIA je meegeeft") +
      '<div class="vcsw-stack">' + result +
      '<dl class="vcsw-stats cols-3"><div class="vcsw-stat"><dt>Punten</dt><dd><span class="vcsw-stat-value">' + S.points + ' / ' + MAX_POINTS + '</span></dd></div>' +
      '<div class="vcsw-stat"><dt>Schildsterkte</dt><dd><span class="vcsw-stat-value">' + S.shield + '%</span></dd></div>' +
      '<div class="vcsw-stat"><dt>Rang</dt><dd><span class="vcsw-stat-value">' + S.rank + '</span></dd></div></dl>' +
      '<div class="vcsw-table-wrap"><table class="vcsw-table"><caption>Je resultaat per onderdeel</caption><thead><tr><th scope="col">Onderdeel</th><th scope="col">Oordeel</th><th scope="col">Toelichting</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="vcsw-card">' + say("aria", "Drie regels voor in je geheugenbank.") +
      '<ol class="rules"><li>Vraag nooit naar de diagnose of oorzaak van ziekte, ook niet indirect.</li><li>Wat iemand je vertrouwelijk vertelt, geef je niet door.</li><li>Gevoelige gegevens alleen voor wie ze nodig heeft, en nooit in een chat of groepsapp.</li></ol></div>' +
      '<div class="vcsw-card basic"><h4>Datakristallen uit dit level</h4><div class="crystal-list">' + crystals + '</div></div>' + flag +
      '</div><div class="actions">' +
      (S.passed ? nextBtn("Terug op aarde", "go") : '<button type="button" class="vcsw-button lg" id="retry">' + icon("refresh") + 'Dienst opnieuw spelen</button>') +
      '</div>'
    );
    if (S.passed) document.getElementById("go").onclick = screenEarth;
    else document.getElementById("retry").onclick = function () { reset(); screenBriefing(); };
  }

  function screenEarth() {
    show(
      head("Terug op aarde", "Wat dit betekent voor je werk") +
      '<div class="vcsw-card earth"><div class="vcsw-prose">' +
      '<p>Op je werk gaat dit over verzuim. Een werkgever mag niet naar de diagnose vragen. Medische informatie is voor de bedrijfsarts.</p>' +
      '<p>Gegevens zoals de no-riskpolis en registratie in het doelgroepregister zijn gevoelig en horen alleen in het beveiligde systeem, bij wie ze nodig heeft voor bijvoorbeeld LKV of de no-riskpolis.</p>' +
      '</div></div>' +
      '<div class="vcsw-alert actionable mt-24">' + icon("mail") + '<div><p class="vcsw-alert-title">Twijfel of een vermoedelijk datalek? Meld het direct</p><p class="vcsw-alert-text">Bij Tarik, Dagmar of via <a href="mailto:jz@vcsw.nl">jz@vcsw.nl</a>.</p></div></div>' +
      '<div class="actions"><button type="button" class="vcsw-button outline" id="again">' + icon("refresh") + 'Level opnieuw spelen</button></div>'
    );
    document.getElementById("again").onclick = function () { reset(); screenStart(); };
  }

  screenStart();
})();
