/* Ruimtestation Orion: the game shell.
   Overview of the station, the mission route, the combo and badge layer, and the arcade round Wie mag dit zien.
   The levels live in levels/<level>/ and the practice rounds in oefenrondes/<slug>/; both run in an iframe; they report each answer
   with postMessage (see assets/js/orion-bridge.js). The 3D station is assets/js/station.js. */
(function () {
  "use strict";

  /* ---------- Levels. src is the level's own page; module is the part of the station it plays in. ---------- */
  var LEVELS = [
    { title: "Level 1: Aankomst op het station", name: "Aankomst op het station", short: "Aankomst", place: "Aankomsthal", src: "levels/level-1-aankomst/index.html", module: 0,
      aria: "Welkom op Orion, Cadet. Bram wacht op je in de aankomsthal. Hier leer je wat persoonsgegevens zijn." },
    { title: "Level 2: De passagiersmodule", name: "De passagiersmodule", short: "Passagiers", place: "Passagiersmodule", src: "levels/level-2-passagiersmodule/index.html", module: 1,
      aria: "In de passagiersmodule wonen honderden crewleden. Hun gegevens zijn aan jou toevertrouwd." },
    { title: "Level 3: De medische ziekenboeg", name: "De medische ziekenboeg", short: "Ziekenboeg", place: "Ziekenboeg", src: "levels/level-3-ziekenboeg/index.html", module: 2,
      aria: "In de ziekenboeg gaat het over de gezondheid van de crew. Hier let je extra goed op." },
    { title: "Level 4: Het vrachtdok", name: "Het vrachtdok", short: "Vrachtdok", place: "Vrachtdok", src: "levels/level-4-vrachtdok/index.html", module: 3,
      aria: "In het vrachtdok komen gegevens binnen en gaan ze weer weg. Niet alles wat binnenkomt, is wat het lijkt." },
    { title: "Level 5: Alarm in module Kepler", name: "Alarm in module Kepler", short: "Alarm", place: "Module Kepler", src: "levels/level-5-hullbreuk/index.html", module: 4, alarm: true,
      aria: "Alarm. Er lekken gegevens weg uit module Kepler. Nu telt elke minuut." },
    { title: "Eindmissie: Een bericht van de aarde", name: "Een bericht van de aarde", short: "Eindmissie", place: "Communicatietoren", src: "levels/eindmissie-bericht-van-de-aarde/index.html", module: 5,
      aria: "Er komt een bericht van de aarde binnen. Dit is je laatste missie als Kapitein van de Datawacht." }
  ];

  /* ---------- Icons (Lucide) ---------- */
  var IC = {
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    doc: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
    trophy: '<path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/><path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/>',
    vol: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    mute: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    award: '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>', refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>', clip: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    cross: '<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/>',
    map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    aleft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>', aright: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    door: '<path d="M11 20H2"/><path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"/><path d="M11 4H8a2 2 0 0 0-2 2v14"/><path d="M14 12h.01"/><path d="M22 20h-3"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'
  };
  function icon(n) { return '<svg class="vcsw-icon" viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + "</svg>"; }
  var STAR = '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>';
  function stars(n) { var h = ""; for (var i = 0; i < 3; i++) h += '<svg viewBox="0 0 24 24" class="' + (i < n ? "star-on" : "star-off") + '" stroke-width="2" aria-hidden="true">' + STAR + "</svg>"; return h; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Saved progress (this browser only) ---------- */
  var KEY = "orion-datawacht-v1";
  var P = { xp: 0, best: 0, levelStars: {}, games: {}, badges: {}, opened: {}, sound: false, calm: false, review: [], user: "", last: -1 };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved) for (var k in saved) P[k] = saved[k]; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }

  /* ---------- Sound (off by default) ---------- */
  var ac = null;
  function tone(freq, dur, type, vol, delay) {
    if (!P.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var t0 = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) {}
  }
  var SFX = {
    good: function () { tone(660, 0.12, "triangle"); tone(990, 0.16, "triangle", 0.1, 0.07); },
    half: function () { tone(520, 0.16, "triangle", 0.08); },
    bad: function () { tone(196, 0.26, "triangle", 0.1); tone(147, 0.3, "triangle", 0.08, 0.08); },
    combo: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.14, "square", 0.06, i * 0.06); }); },
    badge: function () { [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, 0.22, "sine", 0.1, i * 0.09); }); },
    zap: function () { tone(880, 0.08, "square", 0.05); tone(440, 0.1, "square", 0.04, 0.04); },
    tick: function () { tone(1200, 0.04, "square", 0.03); },
    siren: function () { for (var i = 0; i < 6; i++) { tone(660, 0.24, "sawtooth", 0.05, i * 0.5); tone(495, 0.24, "sawtooth", 0.05, i * 0.5 + 0.25); } }
  };


  /* ---------- Practice rounds: the minigames in oefenrondes/<slug>/, loaded in the mission panel like a level.
     after is the level they belong to; the station shows that level's module beside the panel. ---------- */
  var OEFEN = {
    "puzzel-de-persoon": { title: "Puzzel de persoon", short: "Puzzel", after: 0, badge: "puzzelaar",
      aria: "Er gaan berichten het station uit zonder naam erin. Kijk of je toch één crewlid kunt aanwijzen." },
    "zwart-de-lijst": { title: "Zwart de lijst", short: "Zwart", after: 0, badge: "zwartmaker",
      aria: "Er gaan documenten naar buiten. Maak zwart wat één persoon aanwijst en laat de rest leesbaar." },
    "de-opruimronde": { title: "De opruimronde", short: "Opruimen", after: 1, badge: "opruimer",
      aria: "In het cryo-archief staan kratten vol gegevens. Beslis per krat of je bewaart, archiveert of wist." },
    "de-postkamer": { title: "De postkamer", short: "Postkamer", after: 3, badge: "postmeester",
      aria: "Er komt post binnen in het vrachtdok. Niet elk bericht komt van wie het zegt." },
    "het-telefoontje": { title: "Het telefoontje", short: "Telefoon", after: 3, badge: "ophanger",
      aria: "Er belt iemand die zegt dat hij van IT-beheer is. Luister goed voordat je iets geeft." },
    "lek-of-geen-lek": { title: "Lek of geen lek", short: "Lek", after: 4, badge: "lekspeurder",
      aria: "Bij de balie van de Datawacht komen meldingen binnen. Weeg elke melding op de risicometer." }
  };
  Object.keys(OEFEN).forEach(function (id) { OEFEN[id].src = "oefenrondes/" + id + "/index.html"; });

  /* ---------- Route: levels, practice rounds and the one arcade round that stays (Wie mag dit zien?) ---------- */
  var ROUTE = [
    { type: "level", n: 0 }, { type: "oefen", id: "puzzel-de-persoon" }, { type: "oefen", id: "zwart-de-lijst" },
    { type: "level", n: 1 }, { type: "oefen", id: "de-opruimronde" },
    { type: "level", n: 2 }, { type: "game", id: "poort" },
    { type: "level", n: 3 }, { type: "oefen", id: "de-postkamer" }, { type: "oefen", id: "het-telefoontje" },
    { type: "level", n: 4 }, { type: "oefen", id: "lek-of-geen-lek" },
    { type: "level", n: 5 },
    { type: "result" }
  ];
  var RESULT = { title: "Resultaat", short: "Resultaat", place: "Communicatietoren", aria: "Dit is je logboek. Hier staat hoe elke missie ging." };
  /* Every practice round on the route, in route order, with its level. */
  function extras() { return ROUTE.filter(function (r) { return r.type === "game" || r.type === "oefen"; }); }
  function extraInfo(r) { return r.type === "oefen" ? OEFEN[r.id] : GAMES[r.id]; }


  /* ---------- Badges ---------- */
  var BADGES = [
    { id: "vonk", name: "Eerste vonk", desc: "Haal voor het eerst combo x2." },
    { id: "keten", name: "Kettingreactie", desc: "Vijf goede antwoorden op rij in de levels." },
    { id: "onbreekbaar", name: "Onbreekbaar", desc: "Tien goede antwoorden op rij in de levels." },
    { id: "topcadet", name: "Topcadet", desc: "Haal drie sterren in een level." },
    { id: "ontdekker", name: "Ontdekkingsreiziger", desc: "Open alle zes levels." },
    { id: "puzzelaar", name: "Puzzelaar", desc: "Drie sterren in Puzzel de persoon." },
    { id: "zwartmaker", name: "Zwartmaker", desc: "Drie sterren in Zwart de lijst." },
    { id: "opruimer", name: "Opruimer", desc: "Drie sterren in De opruimronde." },
    { id: "poortwachter", name: "Poortwachter", desc: "Drie sterren in Wie mag dit zien." },
    { id: "postmeester", name: "Postmeester", desc: "Drie sterren in De postkamer." },
    { id: "ophanger", name: "Niet in te pakken", desc: "Drie sterren in Het telefoontje." },
    { id: "lekspeurder", name: "Lekspeurder", desc: "Drie sterren in Lek of geen lek." },
    { id: "ongeschonden", name: "Ongeschonden", desc: "Speel een oefenronde uit zonder schild te verliezen." },
    { id: "oefenmeester", name: "Oefenmeester", desc: "Minstens twee sterren in alle zeven oefenrondes." }
  ];

  /* ---------- Notices: badges, combos and switches. They sit in one fixed dock on the station, never over the
     mission panel: above the mission card on the left, or under the top bar on the overview. ---------- */
  var toasts = document.getElementById("toasts");
  function dockNotes() {
    var s = toasts.style, br = document.querySelector(".briefing"), bar = document.querySelector("header.bar");
    var top = bar ? bar.getBoundingClientRect().bottom : 64;
    s.left = s.right = s.top = s.bottom = s.width = "";
    if (view === "mission" && br && br.offsetParent) {
      var r = br.getBoundingClientRect();
      if (window.innerWidth < 900) { s.left = r.left + "px"; s.width = r.width + "px"; s.top = r.top + "px"; toasts.dataset.at = "top"; }
      else { s.left = r.left + "px"; s.width = r.width + "px"; s.bottom = (window.innerHeight - r.top + 12) + "px"; toasts.dataset.at = "bottom"; }
    } else { s.left = (window.innerWidth < 900 ? 8 : 40) + "px"; s.top = (top + 16) + "px"; s.width = "min(340px, calc(100vw - 16px))"; toasts.dataset.at = "top"; }
  }
  window.addEventListener("resize", function () { if (toasts.children.length) dockNotes(); });
  function notice(kind, html, ms) {
    dockNotes();
    var t = document.createElement("div"); t.className = "toast " + kind; t.setAttribute("role", "status"); t.innerHTML = html;
    toasts.appendChild(t);
    while (toasts.children.length > 3) toasts.firstChild.remove();
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, reduce ? 0 : 260); }, ms || 4200);
    return t;
  }
  function award(id) {
    if (P.badges[id]) return;
    var b = BADGES.filter(function (x) { return x.id === id; })[0]; if (!b) return;
    P.badges[id] = Date.now(); save(); hud();
    notice("badge", '<span class="medal">' + icon("award") + '</span><div><small>Badge verdiend</small><b>' + esc(b.name) + "</b><span>" + esc(b.desc) + "</span></div>", 4600);
    SFX.badge(); flash("gold");
  }


  /* ---------- Combo system for the levels ---------- */
  var streak = 0, stats = {};
  function mult() { return streak >= 8 ? 4 : streak >= 5 ? 3 : streak >= 3 ? 2 : 1; }
  var stageEl = document.getElementById("stage"), fx = document.getElementById("fx"), vig = document.getElementById("vig");
  function flash(kind) {
    if (window.OrionStation && window.OrionStation.pulse) window.OrionStation.pulse(kind);
    vig.className = "vignette " + kind + " show";
    clearTimeout(flash.t); flash.t = setTimeout(function () { vig.className = "vignette " + kind; }, kind === "gold" ? 450 : 260);
  }
  /* A short line in the notice dock (combo, switches). Same place as the badges, so it never covers an answer. */
  function pop(text, kind) {
    notice("line" + (kind ? " " + kind : ""), '<span class="dot">' + icon(kind === "gold" ? "zap" : "clock") + "</span><b>" + esc(text) + "</b>", 1800);
  }
  function shake() { if (reduce) return; stageEl.classList.remove("shake"); void stageEl.offsetWidth; stageEl.classList.add("shake"); }
  /* levelN is a level number, or "o:<slug>" for a practice round: those count for combo and XP, their stars come from the round itself. */
  function onAnswer(levelN, result) {
    var st = stats[levelN] = stats[levelN] || { goed: 0, half: 0, fout: 0 };
    st[result]++;
    /* One calm signal per answer: a soft light at ARIA beside the module, and at most one line of text. */
    station(function (S) { S.pulse(result === "fout" ? "bad" : "good"); });
    if (result === "goed") {
      var before = mult(); streak++; var m = mult(), gain = 100 * m;
      P.xp += gain; if (m > before) pop("Combo ×" + m, "gold"); SFX.good();
      if (m >= 2) award("vonk"); if (streak >= 5) award("keten"); if (streak >= 10) award("onbreekbaar");
    } else if (result === "half") {
      P.xp += 40; streak = 0; SFX.half();
    } else {
      streak = 0; SFX.bad();
    }
    if (streak > P.best) P.best = streak;
    if (typeof levelN !== "number") { save(); hud(); return; }
    var tot = st.goed + st.half + st.fout, acc = (st.goed + st.half * 0.5) / tot;
    var s = tot >= 3 ? (acc >= 0.95 ? 3 : acc >= 0.75 ? 2 : acc >= 0.5 ? 1 : 0) : 0;
    if (s > (P.levelStars[levelN] || 0)) { P.levelStars[levelN] = s; if (s === 3) award("topcadet"); }
    save(); hud(); renderRoute();
  }


  /* ---------- Command bar ---------- */
  function hud() {
    document.getElementById("xp").textContent = P.xp.toLocaleString("nl-NL");
    var c = document.getElementById("combo"), m = mult();
    c.classList.toggle("hot", m > 1);
    c.querySelector("b").textContent = "×" + m;
    c.querySelector(".pips").innerHTML = [3, 5, 8].map(function (t) { return '<i class="' + (streak >= t ? "on" : "") + '"></i>'; }).join("");
    document.getElementById("badgecount").textContent = Object.keys(P.badges).length + "/" + BADGES.length;
    var s = document.getElementById("sound");
    s.setAttribute("aria-pressed", String(P.sound)); s.innerHTML = icon(P.sound ? "vol" : "mute") + '<span class="lbl">' + (P.sound ? "Geluid aan" : "Geluid uit") + "</span>";
  }
  document.getElementById("sound").onclick = function () { P.sound = !P.sound; save(); hud(); if (P.sound) SFX.good(); };

  var routeEl = document.getElementById("route");
  function label(r) { return r.type === "level" ? LEVELS[r.n] : r.type === "result" ? RESULT : r.type === "oefen" ? OEFEN[r.id] : GAMES[r.id]; }
  function rStars(r) { return r.type === "level" ? (P.levelStars[r.n] || 0) : r.type === "result" ? 0 : ((P.games[r.id] || {}).stars || 0); }
  function num(r) { return r.type === "level" ? (r.n === 5 ? "E" : String(r.n + 1)) : r.type === "result" ? icon("flag") : icon("zap"); }
  function renderRoute() {
    routeEl.innerHTML = ROUTE.map(function (r, i) {
      var L = label(r);
      if (r.type === "level" && r.n === 5) {   // the final mission shows its three parts, so nobody thinks it is one short step
        var part = i === cur ? (P.epart || 1) : 0, doneE = (P.results || {})[5];
        return '<li class="egroup" title="Eindmissie in drie delen">' + EPARTS.map(function (nm, k) {
          var on = i === cur && part === k + 1 || (i === cur && part === 4 && k === 2);
          return '<button type="button" class="node' + (doneE || (i === cur && part > k + 1) ? " done" : "") + '" data-i="' + i + '"' + (on ? ' aria-current="step"' : "") + ' title="Eindmissie, deel ' + (k + 1) + ": " + nm + '"><span class="num">E' + (k + 1) + '</span><span class="nm">' + nm + "</span></button>";
        }).join("") + "</li>";
      }
      var extra = r.type === "game" || r.type === "oefen", gs = extra ? rStars(r) : 0;
      return '<li><button type="button" class="node' + (extra ? " bonus" : r.type === "result" ? " flag" : "") + (extra && P.games[r.id] ? " done" : "") + '" data-i="' + i + '"' + (i === cur ? ' aria-current="step"' : "") +
        ' title="' + esc(extra ? "Oefenronde bij level " + (extraInfo(r).after + 1) + ": " + L.title + (P.games[r.id] ? ", " + gs + " van 3 sterren" : "") : L.title) + '"><span class="num">' + num(r) + '</span><span class="nm">' + esc(L.short) + "</span></button></li>";
    }).join("");
    renderMap();
  }
  routeEl.addEventListener("click", function (e) { var b = e.target.closest(".node"); if (b) go(+b.getAttribute("data-i")); });

  /* ---------- Overview: the station map ---------- */
  var mapEl = document.getElementById("map"), hotEl = document.getElementById("hotspots");
  function routeIndexOfLevel(n) { for (var i = 0; i < ROUTE.length; i++) if (ROUTE[i].type === "level" && ROUTE[i].n === n) return i; return 0; }
  function routeIndexOfExtra(id) { for (var i = 0; i < ROUTE.length; i++) if ((ROUTE[i].type === "oefen" || ROUTE[i].type === "game") && ROUTE[i].id === id) return i; return -1; }
  /* The practice rounds that follow level n on the route. */
  function bonusFor(n) { return extras().filter(function (r) { return extraInfo(r).after === n; }); }
  function renderMap() {
    var done = 0;
    mapEl.innerHTML = LEVELS.map(function (L, n) {
      var i = routeIndexOfLevel(n), s = P.levelStars[n] || 0, b = bonusFor(n), played = b.filter(function (r) { return P.games[r.id]; }).length;
      if (s > 0) done++;
      var sub = b.length ? "<small title=\"" + esc(b.map(function (r) { return extraInfo(r).title; }).join(", ")) + "\">" + (b.length === 1 ? "Met oefenronde" : "Met " + b.length + " oefenrondes") + (played ? ", " + played + " gespeeld" : "") + "</small>" : "";
      return '<li><button type="button" class="stop" data-i="' + i + '" data-m="' + L.module + '"><span class="num">' + (n === 5 ? "E" : n + 1) + '</span><span class="txt"><b>' + esc(L.name) + "</b>" + sub + '</span>' + (P.opened[n] || s ? '<span class="stars" role="img" aria-label="' + s + ' van 3 sterren">' + stars(s) + "</span>" : "") + "</button></li>";
    }).join("");
    hotBox = null;
    hotEl.innerHTML = LEVELS.map(function (L, n) {
      var st = P.levelStars[n] || 0, seen = P.opened[n], nb = bonusFor(n).length;
      return '<button type="button" class="hot' + (seen ? " seen" : "") + '" data-i="' + routeIndexOfLevel(n) + '" data-m="' + L.module + '" aria-label="' + esc(L.title) + (seen ? ", " + st + " van 3 sterren" : "") + (nb ? ", met " + (nb === 1 ? "een oefenronde" : nb + " oefenrondes") : "") + '"><span class="dot"></span><span class="lead"></span><span class="tag">' + (n === 5 ? "E" : n + 1) + " · " + esc(L.place) + "</span></button>";
    }).join("") + '<span class="earth-tag off" id="earth-tag" aria-hidden="true"><span class="lead"></span><span class="tag">VCSW, Den Haag</span></span>';
    document.getElementById("progress").textContent = done + " van 6 missies gespeeld";
    var start = document.getElementById("start");
    start.innerHTML = (P.last >= 0 ? "Verder met " + esc(label(ROUTE[P.last]).short) : "Start de missie") + icon("right");
  }
  function onStop(e) { var b = e.target.closest("[data-i]"); if (b) go(+b.getAttribute("data-i")); }
  mapEl.addEventListener("click", onStop); hotEl.addEventListener("click", onStop);
  function hover(e) {
    var b = e.target.closest("[data-m]"), m = b ? +b.getAttribute("data-m") : -1;
    document.querySelectorAll("[data-m]").forEach(function (x) { x.classList.toggle("lit", +x.getAttribute("data-m") === m); });
  }
  [mapEl, hotEl].forEach(function (el) { el.addEventListener("mouseover", hover); el.addEventListener("focusin", hover); el.addEventListener("mouseleave", hover); });
  document.getElementById("start").onclick = function () { go(P.last >= 0 ? P.last : 0); };

  /* Labels that float next to the modules in 3D */
  /* The labels follow the station on every picture. Sizes are read once and kept, and a label is only moved when its place
     really changed: reading a size right after moving a label made the browser lay out the page six times per picture. */
  var hotBox = null;
  window.addEventListener("resize", function () { hotBox = null; });
  function placeHotspots() {
    var S = window.OrionStation;
    if (!S || view !== "home") return;
    var btns = hotEl.children;
    if (!hotBox || !hotBox.w[0]) {
      var copy = document.getElementById("home-title");
      hotBox = { cr: copy ? copy.getBoundingClientRect() : null, w: [].map.call(btns, function (x) { return x.offsetWidth; }) };
    }
    var pts = S.project(), mid = S.centre ? S.centre() : { x: window.innerWidth / 2 }, cr = hotBox.cr;
    LEVELS.forEach(function (L, n) {
      var p = pts[L.module], b = btns[n]; if (!p || !b) return;
      var left = p.x < mid.x - 20;
      var low = left && cr && p.y > cr.top - 30 && p.x - hotBox.w[n] < cr.right + 24; // not across the title: hang it below the module
      if (low) left = false;
      var tr = "translate(" + Math.round(p.x) + "px," + Math.round(p.y) + "px)" + (left ? " translateX(-100%)" : "") + (low ? " translateY(54px)" : ""), key = tr + (left ? "L" : "") + (p.front ? "" : "B");
      if (b._at === key) return;
      b._at = key; b.classList.toggle("left", left); b.style.transform = tr; b.classList.toggle("behind", !p.front);
    });
    var et = document.getElementById("earth-tag");
    if (et && S.earth) { var e = S.earth(), ek = Math.round(e.x) + "," + Math.round(e.y) + (e.front ? "" : "B"); if (et._at !== ek) { et._at = ek; et.style.transform = "translate(" + Math.round(e.x) + "px," + Math.round(e.y) + "px)"; et.classList.toggle("off", !e.front); } }
  }

  /* ---------- Station link ---------- */
  function station(fn) { if (window.OrionStation) fn(window.OrionStation); }
  window.addEventListener("orion-station-ready", function () {
    station(function (S) { S.onFrame(placeHotspots); syncStation(); });
  });
  function syncStation() {
    station(function (S) {
      if (view === "home" || view === "admin") { S.focus(-1, view === "home" && window.innerWidth > 900 ? "home" : null); S.alarm(false); S.lowPower(view === "admin" ? 2 : false); return; }
      var r = ROUTE[cur], L = r.type === "level" ? LEVELS[r.n] : r.type === "result" ? LEVELS[5] : LEVELS[extraInfo(r).after];
      S.focus(L.module, window.innerWidth > 900 ? (r.type === "oefen" ? "oefen" : "left") : null);
      S.alarm(!!L.alarm);
      S.lowPower(true);
    });
  }
  window.addEventListener("resize", function () { syncStation(); });

  /* ---------- Views ---------- */
  var view = "home", frames = [], cur = -1;
  var homeEl = document.getElementById("home"), missionEl = document.getElementById("mission"), arcade = document.getElementById("arcade");
  function showHome(quiet) {
    if (typeof endPanic === "function") endPanic();
    stopGame();
    view = "home"; cur = -1;
    document.body.setAttribute("data-view", "home");
    homeEl.hidden = false; missionEl.hidden = true; document.getElementById("admin").hidden = true;
    frames.forEach(function (f) { if (f) f.hidden = true; }); hideOefen();
    document.getElementById("logbook").hidden = true; document.getElementById("status").hidden = true;
    document.title = "AVG-game Ruimtestation Orion";
    renderRoute(); syncStation();
    if (toasts.children.length) dockNotes();
    if (quiet !== true) document.getElementById("start").focus({ preventScroll: true });
  }
  document.getElementById("to-map").onclick = function () { showHome(); };
  document.getElementById("home-btn").onclick = function () { showHome(); };

  /* ---------- Status bar: score, shield, crystals and steps of the level, always in view ---------- */
  var statusEl = document.getElementById("status"), ST = {}, DELTA = {}, EPARTS = ["Het bericht", "De aanval", "De hoofdsluis"];
  function sbar(pct, cls, mark, from) {
    var lo = from === undefined ? pct : Math.min(from, pct), hi = from === undefined ? pct : Math.max(from, pct);
    return '<div class="st-bar' + (cls ? " " + cls : "") + '"><i style="width:' + lo + '%"></i>' + (hi > lo ? '<u class="' + (pct >= from ? "up" : "down") + '" style="left:' + lo + "%;width:" + (hi - lo) + '%"></u>' : "") + (mark ? '<s style="left:' + mark + '%"></s>' : "") + "</div>";
  }
  function renderStatus() {
    var r = ROUTE[cur], s = view === "mission" && r && r.type === "level" ? ST[r.n] : null;
    statusEl.hidden = !s; stageEl.classList.toggle("has-status", !!s);
    if (!s) { stageEl.style.removeProperty("--status-h"); return; }
    var d = DELTA[r.n] && DELTA[r.n].until > Date.now() ? DELTA[r.n] : null, m = mult();
    var pct = s.max ? Math.round(s.score / s.max * 100) : 0, was = d && s.max ? Math.round((s.score - d.score) / s.max * 100) : undefined;
    var steps = (s.steps || []).map(function (n, i) { return '<div class="st-step' + (i < s.step ? " done" : i === s.step ? " cur" : "") + '"' + (i === s.step ? ' aria-current="step"' : "") + "><i></i><span>" + esc(n) + "</span></div>"; }).join("");
    var gems = ""; for (var i = 0; i < (s.crystalsMax || 0); i++) gems += '<i class="' + (i < s.crystals ? "on" : "") + '"></i>';
    var last = s.steps && s.step >= s.steps.length - 1, nx = ROUTE[cur + 1];
    statusEl.innerHTML = (steps ? '<div class="st-steps" role="list" aria-label="Stappen van dit level">' + steps + "</div>" : "") + '<div class="st-row' + (last && nx ? " end" : "") + '">' +
      '<div class="st-stat"><div class="st-top">' + icon("target") + "<span>Score</span>" + (d && d.score ? '<em class="up">plus ' + d.score + "</em>" : "") + "<b>" + s.score + " van " + s.max + "</b></div>" + sbar(pct, "", 70, was) + "<small>Gehaald vanaf " + Math.ceil(s.max * 0.7) + " punten</small></div>" +
      '<div class="st-stat"><div class="st-top">' + icon("shield") + "<span>Schild</span>" + (d && d.shield ? '<em class="down">min ' + (-d.shield) + "%</em>" : "") + "<b>" + s.shield + "%</b></div>" + sbar(s.shield, s.shield > 50 ? "ok" : "warn", 0, d && d.shield ? s.shield - d.shield : undefined) + "<small>Elke fout kost schild</small></div>" +
      (s.crystalsMax ? '<div class="st-stat gems"><div class="st-top">' + icon("gem") + "<span>Kristallen</span><b>" + s.crystals + " van " + s.crystalsMax + '</b></div><div class="st-gems">' + gems + "</div><small>Openen aanwijzingen</small></div>" : "") +
      (m > 1 ? '<div class="st-combo" title="Reeks goede antwoorden">Combo <b>×' + m + "</b></div>" : "") +
      (last && nx ? '<button type="button" class="st-next" id="st-next">Verder naar ' + esc(nx.type === "result" ? "je resultaat" : label(nx).short) + icon("right") + "</button>" : "") + "</div>";
    var nb = document.getElementById("st-next"); if (nb) nb.onclick = function () { go(cur + 1); };
    stageEl.style.setProperty("--status-h", statusEl.offsetHeight + "px");
  }
  /* The attack in the final mission: the camera follows the Zwarte Nevel from module to module. */
  var nevelAt = -1;
  function nevelView(boss) {
    var at = boss ? Math.max(0, Math.min(5, boss.i | 0)) : -1, here = ROUTE[cur] && ROUTE[cur].type === "level" && ROUTE[cur].n === 5;
    station(function (S) { if (S.nevel) S.nevel(boss && here ? boss : null); });
    if (!here || at === nevelAt) return; nevelAt = at;
    var L = LEVELS[at < 0 ? 5 : at];
    document.getElementById("m-title").textContent = L.place;
    document.getElementById("m-place").textContent = at < 0 ? label(ROUTE[cur]).title : "Aanval " + (at + 1) + " van 6 op deze module";
    document.getElementById("m-aria").textContent = at < 0 ? LEVELS[5].aria : "De Zwarte Nevel ligt over " + L.place + ". Een goed antwoord blaast hem weg.";
    station(function (S) { S.focus(LEVELS[at < 0 ? 5 : at].module, window.innerWidth > 900 ? "left" : null); S.alarm(at >= 0); });
  }
  function onStatus(n, s) {
    var old = ST[n]; ST[n] = s;
    if (old && (s.score > old.score || s.shield < old.shield)) { DELTA[n] = { score: s.score - old.score, shield: s.shield - old.shield, until: Date.now() + 5000 }; setTimeout(renderStatus, 5100); }
    if (n === 5 && s.part && s.part !== P.epart) { P.epart = s.part; renderRoute(); }
    if (n === 5) nevelView(s.part === 2 && s.boss ? s.boss : null);
    if (s.done && s.pct !== null && s.pct !== undefined) { P.results = P.results || {}; var b = P.results[n]; if (!b || s.pct >= b.pct) { P.results[n] = { pct: s.pct, passed: !!s.passed, shield: s.shield, crystals: s.crystals, crystalsMax: s.crystalsMax }; save(); } }
    renderStatus(); fitPanel();
  }

  /* ---------- Closing screen: the logbook with every result ---------- */
  var logEl = document.getElementById("logbook");
  /* Everything the logbook shows, once, so the screen and the pdf file say the same. */
  function logData() {
    var R = P.results || {}, played = Object.keys(R), tot = played.length ? Math.round(played.reduce(function (a, k) { return a + R[k].pct; }, 0) / played.length) : 0;
    var passed = played.filter(function (k) { return R[k].passed; }).length, worst = null;
    LEVELS.forEach(function (L, n) { if (!R[n] || !R[n].passed) { if (worst === null) worst = n; } });
    var all = extras(), games = all.filter(function (r) { return P.games[r.id]; }).length;
    var rows = [];
    LEVELS.forEach(function (L, n) {
      var x = R[n];
      rows.push({ kind: "level", nr: n === 5 ? "E" : String(n + 1), name: L.name, pct: x ? x.pct : null, stars: P.levelStars[n] || 0, low: !!(x && !x.passed), state: x ? (x.passed ? "Gehaald" : "Nog niet gehaald") : "Nog niet gespeeld", cls: x ? (x.passed ? "ok" : "low") : "none" });
      bonusFor(n).forEach(function (r) {
        var g = P.games[r.id];
        rows.push({ kind: "extra", name: extraInfo(r).title, pct: g && g.pct != null ? g.pct : null, stars: g ? g.stars || 0 : 0, state: g ? "Gespeeld" : "Nog niet gespeeld", cls: g ? "ok" : "none" });
      });
    });
    return { R: R, rows: rows, tot: tot, passed: passed, worst: worst, games: games, gamesAll: all.length, badges: Object.keys(P.badges || {}).length, name: me().name,
      rank: passed === 6 ? "Admiraal van de Datawacht" : passed >= 3 ? "Luitenant van de Datawacht" : "Cadet van de Datawacht", date: new Date(),
      day: new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) };
  }
  function renderLogbook() {
    var D = logData(), R = D.R, worst = D.worst;
    var rows = D.rows.map(function (x) {
      var st = ""; for (var i = 0; i < 3; i++) st += '<span class="lb-star' + (i < x.stars ? " on" : "") + '">' + icon("star") + "</span>";
      var lbl = x.kind === "level" ? '<span class="lb-nr">' + x.nr + "</span>" + esc(x.name) : '<span class="lb-ex">' + icon("zap") + "Oefenronde</span>" + esc(x.name);
      return "<tr class=\"" + (x.kind === "extra" ? "lb-sub" : "") + (x.low ? " lb-low" : "") + "\"><th scope=\"row\">" + lbl + '</th><td class="num' + (x.low ? " low" : "") + '">' + (x.pct != null ? x.pct + "%" : "") + '</td><td><span class="lb-stars" role="img" aria-label="' + x.stars + ' van 3 sterren">' + st + '</span></td><td class="state"><span class="lb-chip ' + x.cls + '">' + (x.state === "Gehaald" ? icon("check") : "") + x.state + "</span></td></tr>";
    }).join("");
    logEl.innerHTML = '<div class="lb-sheet"><div class="lb-head"><span class="lb-seal">' + icon("shield") + '</span><div class="lb-who"><h1>Logboek van ' + esc(D.name) + "</h1><p>" + D.rank + ". Stand op " + D.day + '.</p></div><div class="lb-total"><b>' + D.tot + "%</b><span>totaalscore</span></div></div>" +
      '<table><caption class="vcsw-sr-only">Uitslag per missie en per oefenronde</caption><tbody>' + rows + '</tbody></table><div class="lb-foot"><span>' + D.passed + " van 6 missies gehaald</span><span>" + D.games + " van " + D.gamesAll + " oefenrondes gespeeld</span><span>" + D.badges + " van " + BADGES.length + ' prestaties</span></div><p class="lb-note">Het schild telt niet mee voor halen. Een missie is gehaald vanaf 70 procent van de punten. Oefenrondes hoef je niet te halen. Dit logboek staat alleen in deze browser.</p><p class="lb-pdf" id="lb-pdf" role="status" hidden></p></div>' +
      '<div class="lb-actions"><button type="button" class="btn-go" id="lb-print">' + icon("download") + "Bewaar als pdf</button>" + (worst !== null ? '<button type="button" class="btn-ghost" id="lb-again">' + icon("refresh") + "Speel " + esc(LEVELS[worst].short) + (R[worst] ? " opnieuw" : "") + "</button>" : "") + (P.review && P.review.length ? '<button type="button" class="btn-ghost" id="lb-review">' + icon("doc") + "Lees na wat fout ging</button>" : "") + '<button type="button" class="btn-ghost lb-close" id="lb-close">Sluit af</button></div>';
    document.getElementById("lb-print").onclick = savePdf;
    document.getElementById("lb-close").onclick = function () { showHome(); };
    var a = document.getElementById("lb-again"); if (a) a.onclick = function () { go(routeIndexOfLevel(worst)); };
    var rv = document.getElementById("lb-review"); if (rv) rv.onclick = function () { document.getElementById("review").click(); };
  }

  /* ---------- The logbook as a real pdf file, written here without any library ----------
     A4, the standard fonts Helvetica and Helvetica-Bold with WinAnsi encoding, so Dutch letters such as é and ë
     come out right. Everything outside the plain ASCII range is written as an octal escape, so the file stays
     ASCII and the byte offsets in the cross-reference table are simply string lengths. */
  function printLogbook() { document.body.classList.add("print-logbook"); try { window.print(); } catch (e) {} setTimeout(function () { document.body.classList.remove("print-logbook"); }, 500); }
  var WIN = { 8364: 128, 8218: 130, 8222: 132, 8230: 133, 8216: 145, 8217: 146, 8220: 147, 8221: 148, 8226: 149, 8211: 150, 8212: 151, 8482: 153 };
  function pdfStr(s) {
    var out = "";
    String(s).normalize("NFC").split("").forEach(function (ch) {
      var c = ch.charCodeAt(0), b = c < 128 ? c : (c >= 160 && c <= 255) ? c : WIN[c] || 63;
      if (b === 40 || b === 41 || b === 92) out += "\\" + ch;
      else if (b < 32 || b > 126) out += "\\" + ("00" + b.toString(8)).slice(-3);
      else out += String.fromCharCode(b);
    });
    return "(" + out + ")";
  }
  function logbookPdf(D) {
    var W = 595, H = 842, M = 56, pages = [], ops = [], y = H - M;
    function page() { ops = []; pages.push(ops); y = H - M; }
    function text(x, yy, size, bold, s, rgb) { ops.push((rgb || "0.024 0.133 0.298") + " rg BT /" + (bold ? "F2" : "F1") + " " + size + " Tf " + x + " " + yy + " Td " + pdfStr(s) + " Tj ET"); }
    function line(x1, y1, x2, y2, rgb, w) { ops.push((rgb || "0.83 0.87 0.92") + " RG " + (w || 0.8) + " w " + x1 + " " + y1 + " m " + x2 + " " + y2 + " l S"); }
    function rect(x, yy, w, h, rgb) { ops.push(rgb + " rg " + x + " " + yy + " " + w + " " + h + " re f"); }
    function wrap(s, size, width) { var max = Math.floor(width / (size * 0.5)), out = [], cur = ""; s.split(" ").forEach(function (w) { if ((cur + " " + w).trim().length > max) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }); if (cur) out.push(cur); return out; }
    function need(h) { if (y - h < M) page(); }
    page();
    rect(0, H - 8, W, 8, "0.039 0.427 0.745");
    text(M, y - 14, 10, true, "VCSW  |  AVG-game Ruimtestation Orion", "0.039 0.427 0.745");
    y -= 48; text(M, y, 22, true, "Logboek van " + D.name);
    y -= 20; text(M, y, 11, false, D.rank + ". Stand op " + D.day + ".", "0.231 0.302 0.431");
    text(W - M - 120, y + 20, 26, true, D.tot + "%", "0.039 0.427 0.745"); text(W - M - 120, y + 4, 9, false, "totaalscore", "0.231 0.302 0.431");
    y -= 34;
    var cx = [M, M + 268, M + 322, M + 392];
    text(cx[0], y, 10, true, "Missie"); text(cx[1], y, 10, true, "Score"); text(cx[2], y, 10, true, "Sterren"); text(cx[3], y, 10, true, "Stand");
    y -= 8; line(M, y, W - M, y, "0.024 0.133 0.298", 1.2); y -= 4;
    D.rows.forEach(function (x) {
      var sub = x.kind === "extra", h = sub ? 20 : 24;
      need(h + 10);
      y -= h;
      if (x.low) rect(M, y - 6, 3, h - 2, "0.78 0.47 0");
      if (sub) text(cx[0] + 18, y, 10, false, "Oefenronde: " + x.name, "0.231 0.302 0.431");
      else text(cx[0] + 8, y, 11.5, true, (x.nr === "E" ? "Eindmissie" : "Level " + x.nr) + ": " + x.name);
      if (x.pct != null) text(cx[1], y, sub ? 10 : 11.5, !sub, x.pct + "%", x.low ? "0.63 0.29 0" : null);
      text(cx[2], y, 10, false, x.stars + " van 3");
      text(cx[3], y, 10, false, x.state, x.cls === "ok" ? "0.04 0.42 0.23" : x.cls === "low" ? "0.54 0.29 0" : "0.231 0.302 0.431");
      line(M, y - 7, W - M, y - 7);
    });
    y -= 30; need(80);
    text(M, y, 10.5, true, D.passed + " van 6 missies gehaald,  " + D.games + " van " + D.gamesAll + " oefenrondes gespeeld,  " + D.badges + " van " + BADGES.length + " prestaties");
    y -= 22;
    wrap("Het schild telt niet mee voor halen. Een missie is gehaald vanaf 70 procent van de punten. Oefenrondes hoef je niet te halen. Dit logboek is gemaakt in je eigen browser en nergens anders bewaard.", 9.5, W - 2 * M).forEach(function (l) { need(14); text(M, y, 9.5, false, l, "0.231 0.302 0.431"); y -= 14; });
    y -= 6; need(14); text(M, y, 9, false, "Prototype met fictieve namen en gegevens. De inhoud wacht op goedkeuring van de Privacy Officer.", "0.42 0.48 0.58");
    var objs = [], kids = [];
    objs[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    objs[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
    objs[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
    var d = D.date, pad = function (n) { return ("0" + n).slice(-2); };
    objs[5] = "<< /Title " + pdfStr("Logboek van " + D.name) + " /Author (VCSW) /Creator " + pdfStr("AVG-game Ruimtestation Orion") + " /CreationDate (D:" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) + ") >>";
    pages.forEach(function (o, i) {
      var pn = 6 + i * 2, cn = pn + 1, body = o.join("\n");
      kids.push(pn + " 0 R");
      objs[pn] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents " + cn + " 0 R >>";
      objs[cn] = "<< /Length " + body.length + " >>\nstream\n" + body + "\nendstream";
    });
    objs[2] = "<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + pages.length + " >>";
    var out = "%PDF-1.4\n", offs = [];
    for (var n = 1; n < objs.length; n++) { offs[n] = out.length; out += n + " 0 obj\n" + objs[n] + "\nendobj\n"; }
    var xref = out.length;
    out += "xref\n0 " + objs.length + "\n0000000000 65535 f \n";
    for (n = 1; n < objs.length; n++) out += ("000000000" + offs[n]).slice(-10) + " 00000 n \n";
    out += "trailer\n<< /Size " + objs.length + " /Root 1 0 R /Info 5 0 R >>\nstartxref\n" + xref + "\n%%EOF\n";
    var bytes = new Uint8Array(out.length); for (n = 0; n < out.length; n++) bytes[n] = out.charCodeAt(n) & 255;
    return bytes;
  }
  /* Download first. In a closed-off viewer a download can be blocked without any error, so the links to open the
     file in a new tab or to print stay in view after the click. */
  var pdfUrl = null;
  function savePdf() {
    var D = logData(), d = D.date, name = "Logboek-Orion-" + d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + ".pdf";
    var msg = document.getElementById("lb-pdf"), ok = false;
    try {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      pdfUrl = URL.createObjectURL(new Blob([logbookPdf(D)], { type: "application/pdf" }));
      var a = document.createElement("a"); a.href = pdfUrl; a.download = name; a.rel = "noopener"; a.hidden = true;
      document.body.appendChild(a); a.click(); a.remove(); ok = true;
    } catch (e) { ok = false; }
    if (!ok) { openPdf(); return; }
    if (msg) {
      msg.hidden = false; var nt = logEl.querySelector(".lb-note"); if (nt) nt.hidden = true;
      msg.innerHTML = icon("check") + '<span><a class="lb-link" href="' + pdfUrl + '" download="' + esc(name) + '">' + esc(name) + '</a> staat in je downloads. Zie je het niet? <button type="button" class="lb-link" id="lb-open">Open de pdf in een nieuw tabblad</button>, <button type="button" class="lb-link" id="lb-printnow">druk het logboek af</button> of klik met de rechtermuisknop op de bestandsnaam en kies Link opslaan als.</span>';
      document.getElementById("lb-open").onclick = openPdf;
      document.getElementById("lb-printnow").onclick = printLogbook;
    }
  }
  function openPdf() {
    var w = null;
    try { if (!pdfUrl) pdfUrl = URL.createObjectURL(new Blob([logbookPdf(logData())], { type: "application/pdf" })); w = window.open(pdfUrl, "_blank"); } catch (e) { w = null; }
    if (!w) printLogbook();
  }

  /* The panel ends where the level's content ends, so there is no empty band under it. */
  var fitH = {};
  function fitPanel() {
    var r = ROUTE[cur], h = view === "mission" && r && r.type === "level" ? fitH[r.n] : 0;
    if (view === "mission" && r && r.type === "result" && window.innerWidth >= 900) {
      stageEl.classList.add("fit"); stageEl.style.height = "auto"; logEl.style.position = "static";
      return;
    }
    logEl.style.position = "";
    if (!h || window.innerWidth < 900) { stageEl.classList.remove("fit"); stageEl.style.height = ""; return; }
    var room = window.innerHeight - stageEl.getBoundingClientRect().top - 12;
    if (h + 12 + (statusEl.hidden ? 0 : statusEl.offsetHeight) > room - 24) { stageEl.classList.remove("fit"); stageEl.style.height = ""; return; } // nearly full: keep one baseline with the module card
    stageEl.classList.add("fit"); stageEl.style.height = Math.max(420, h + 12 + (statusEl.hidden ? 0 : statusEl.offsetHeight)) + "px";
  }
  window.addEventListener("message", function (e) {
    var oid = oefenOf(e.source);
    if (oid) { onOefenMessage(oid, e.data || {}); return; }
    if (e.data && e.data.orion === "status") { for (var q = 0; q < frames.length; q++) if (frames[q] && frames[q].contentWindow === e.source) onStatus(q, e.data.s); return; }
    if (e.data && e.data.orion === "size") { for (var k = 0; k < frames.length; k++) if (frames[k] && frames[k].contentWindow === e.source) { fitH[k] = e.data.h; fitPanel(); } return; }
    if (!e.data || e.data.orion !== "answer") return;
    for (var n = 0; n < frames.length; n++) if (frames[n] && frames[n].contentWindow === e.source) { onAnswer(n, e.data.result); if (e.data.result !== "goed" && e.data.why) note(LEVELS[n].name, e.data.q, e.data.a, e.data.why, e.data.result); }
  });
  /* ---------- Practice rounds in the panel. The round keeps its own status strip (score, shield, crystals and the
     verdict of each choice), so the status bar of the shell stays hidden here: one bar, not two. ---------- */
  var oframes = {};
  function oefenOf(src) { for (var id in oframes) if (oframes[id] && oframes[id].contentWindow === src) return id; return null; }
  function hideOefen() { for (var id in oframes) if (oframes[id]) oframes[id].hidden = true; }
  function loadOefen(id) {
    var o = OEFEN[id], f = document.createElement("iframe");
    f.title = "Oefenronde: " + o.title;
    /* Test jump: index.html?oefen=<slug>&shot=play opens the round straight in that state. */
    var q = new URLSearchParams(location.search), jump = q.get("oefen") === id, pass = new URLSearchParams();
    pass.set("shell", "orion");
    if (jump) ["shot", "3d"].forEach(function (k) { if (q.get(k)) pass.set(k, q.get(k)); });
    if (o.b64) {
      var bin = atob(o.b64), bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      var html = new TextDecoder("utf-8").decode(bytes);
      f.srcdoc = html.replace("<head>", "<head><script>window.ORION_PARAMS = " + JSON.stringify("?" + pass.toString()) + ";<\/script>");
    } else f.src = o.src + "?" + pass.toString();
    stageEl.insertBefore(f, fx);
    return f;
  }
  function onOefenMessage(id, d) {
    if (d.orion === "answer") {
      onAnswer("o:" + id, d.result);
      if (d.result !== "goed" && d.why) note(OEFEN[id].title, d.q, d.a, d.why, d.result);
    } else if (d.orion === "done") oefenDone(id, d);
    else if (d.orion === "back") { var i = routeIndexOfExtra(id); if (cur === i) go(i + 1); }
  }
  function oefenDone(id, d) {
    var prev = P.games[id] || {}, stars = Math.max(0, Math.min(3, d.stars | 0)), pct = Math.max(0, Math.min(100, d.pct | 0));
    P.games[id] = { score: Math.max(d.score | 0, prev.score || 0), max: d.max, stars: Math.max(stars, prev.stars || 0), pct: Math.max(pct, prev.pct || 0) };
    P.xp += pct * 5;
    var i = routeIndexOfExtra(id); if (cur === i && i + 1 < ROUTE.length) P.last = i + 1;
    save(); hud(); renderRoute();
    if (stars === 3) award(OEFEN[id].badge);
    if (d.shield >= 100 && pct > 0) award("ongeschonden");
    checkOefenmeester();
    if (stars > 0) flash("gold");
  }
  function checkOefenmeester() { if (extras().every(function (r) { return ((P.games[r.id] || {}).stars || 0) >= 2; })) award("oefenmeester"); }

  function loadFrame(n) {
    var f = document.createElement("iframe");
    f.title = LEVELS[n].title;
    /* Test jump: index.html?ls=3&scherm=sluis opens level 3 at that screen. */
    var jump = /[?&]ls=(\d)/.exec(location.search);
    f.src = LEVELS[n].src;
    if (jump && +jump[1] === n + 1 && !LEVELS[n].b64) f.src = LEVELS[n].src + location.search;
    stageEl.insertBefore(f, fx);
    return f;
  }
  function go(i) {
    if (i < 0 || i >= ROUTE.length) return;
    stopGame(); endPanic(); nevelAt = -1; station(function (S) { if (S.nevel) S.nevel(null); });
    var r = ROUTE[i], first = view !== "mission";
    cur = i; view = "mission"; P.last = i;
    document.body.setAttribute("data-view", "mission");
    homeEl.hidden = true; missionEl.hidden = false; document.getElementById("admin").hidden = true;
    frames.forEach(function (f) { if (f) f.hidden = true; }); hideOefen();
    var L = r.type === "level" ? LEVELS[r.n] : r.type === "result" ? RESULT : LEVELS[extraInfo(r).after];
    document.getElementById("m-title").textContent = L.place;
    document.getElementById("m-place").textContent = r.type === "oefen" ? "Oefenronde: " + OEFEN[r.id].title : label(r).title;
    document.getElementById("m-aria").textContent = r.type === "level" ? L.aria : r.type === "result" ? RESULT.aria : extraInfo(r).aria;
    logEl.hidden = r.type !== "result";
    missionEl.classList.toggle("is-level", r.type === "level");
    missionEl.classList.toggle("is-oefen", r.type === "oefen");
    if (r.type === "oefen") {
      arcade.hidden = true; endPanic();
      if (!oframes[r.id]) oframes[r.id] = loadOefen(r.id);
      oframes[r.id].hidden = false;
    } else if (r.type === "level") {
      arcade.hidden = true;
      if (!frames[r.n]) frames[r.n] = loadFrame(r.n);
      frames[r.n].hidden = false;
      P.opened[r.n] = 1; if (Object.keys(P.opened).length >= 6) award("ontdekker");
      if (r.n === 4) panic(); else endPanic();
    } else if (r.type === "result") {
      arcade.hidden = true; renderLogbook(); logEl.scrollTop = 0;
      document.body.setAttribute("data-view", "result");
    } else {
      arcade.hidden = false; arcade.scrollTop = 0; gameIntro(r.id);
      document.body.setAttribute("data-view", "arcade");
    }
    save();
    document.getElementById("prev").disabled = i === 0;
    document.getElementById("next").disabled = i === ROUTE.length - 1;
    document.title = label(r).title + " · AVG-game Ruimtestation Orion";
    renderRoute(); syncStation(); renderStatus(); fitPanel();
    if (r.type === "level" && r.n === 5 && ST[5]) nevelView(ST[5].part === 2 && ST[5].boss ? ST[5].boss : null);
    var node = routeEl.querySelector('[data-i="' + i + '"]'); if (node) node.scrollIntoView({ block: "nearest", inline: "center" });
    if (first) missionEl.focus({ preventScroll: true });
    if (toasts.children.length) dockNotes();
  }
  /* Level 5 opens with a few seconds of alarm, then hands over to a calm level. Shown once per visit to the page. */
  var panicSeen = /[?&]paniek=uit/.test(location.search), panicEl = null, panicT = [];
  function endPanic() {
    panicT.forEach(clearTimeout); panicT = [];
    document.body.classList.remove("panicking");
    if (panicEl) { panicEl.remove(); panicEl = null; }
  }
  function panic() {
    if (panicSeen) return; panicSeen = true; endPanic();
    var lines = [["ARIA", "Alarm. Er zijn persoonsgegevens het station uit."], ["Bram", "Ik heb het ziekteoverzicht naar de verkeerde kolonie gestuurd."], ["Luitenant Mira", "Wie pakt dit op? De klok loopt."]];
    panicEl = document.createElement("div"); panicEl.className = "panic"; panicEl.setAttribute("role", "alert");
    panicEl.innerHTML = '<div class="p-stripe" aria-hidden="true"></div><div class="p-core"><p class="p-kind">' + icon("alert") + "Alarm</p><h2>Module Kepler</h2>" +
      '<p class="p-clock" aria-hidden="true">00:00<span>sinds het bericht de deur uit ging</span></p>' +
      '<ul class="p-msgs">' + lines.map(function (l) { return "<li hidden><b>" + esc(l[0]) + "</b>" + esc(l[1]) + "</li>"; }).join("") + "</ul>" +
      '<p class="p-calm" hidden>Rustig. Jij pakt dit stap voor stap op.</p></div>' +
      '<button type="button" class="p-skip">Sla over</button><div class="p-stripe" aria-hidden="true"></div>';
    document.body.appendChild(panicEl); document.body.classList.add("panicking");
    panicEl.querySelector(".p-skip").onclick = endPanic;
    var li = panicEl.querySelectorAll(".p-msgs li"), clockEl = panicEl.querySelector(".p-clock"), sec = 0, long = reduce ? 1500 : 3400;
    SFX.siren();
    station(function (S) { if (S.pulse) S.pulse("bad"); });
    [150, 1000, 1900].forEach(function (ms, i) { panicT.push(setTimeout(function () { li[i].hidden = false; if (!reduce) station(function (S) { if (S.pulse) S.pulse("bad"); }); }, reduce ? 0 : ms)); });
    for (var k = 1; k <= 3; k++) panicT.push(setTimeout(function () { sec++; clockEl.firstChild.nodeValue = "00:0" + sec; }, k * 1000));
    if (/[?&]paniek=vast/.test(location.search)) return;
    panicT.push(setTimeout(function () {
      if (!panicEl) return; document.body.classList.remove("panicking"); panicEl.classList.add("calm");
      panicEl.querySelector(".p-calm").hidden = false;
    }, long));
    panicT.push(setTimeout(function () { if (panicEl) panicEl.classList.add("out"); }, long + 1700));
    panicT.push(setTimeout(endPanic, long + 2200));
  }
  document.getElementById("prev").onclick = function () { go(cur - 1); };
  document.getElementById("next").onclick = function () { go(cur + 1); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && view === "mission" && !document.querySelector("dialog[open]") && !G) showHome(); });

  /* ---------- Achievements dialog ---------- */
  var dlg = document.getElementById("trophies");
  document.getElementById("open-trophies").onclick = function () {
    var gp = extras().map(function (r) { return r.id; }).map(function (id) { return (P.games[id] || {}).stars || 0; }).reduce(function (a, b) { return a + b; }, 0);
    var lp = [0, 1, 2, 3, 4, 5].map(function (n) { return P.levelStars[n] || 0; }).reduce(function (a, b) { return a + b; }, 0);
    dlg.querySelector(".tr-body").innerHTML =
      '<div class="tr-stats"><div class="tr-stat"><span>Datawacht-XP</span><b>' + P.xp.toLocaleString("nl-NL") + '</b></div><div class="tr-stat"><span>Sterren</span><b>' + (gp + lp) + ' / ' + (6 + extras().length) * 3 + '</b></div><div class="tr-stat"><span>Langste reeks</span><b>' + P.best + "</b></div></div>" +
      '<div class="tr-grid">' + BADGES.map(function (b) { var on = !!P.badges[b.id]; return '<div class="badge-card' + (on ? " on" : "") + '"><span class="medal">' + icon("award") + "</span><div><b>" + esc(b.name) + "</b><span>" + esc(b.desc) + (on ? "" : " Nog niet verdiend.") + "</span></div></div>"; }).join("") + "</div>" +
      '<p style="margin:16px 0 0;font-size:.8125rem;color:var(--vcsw-gray-400)">Je voortgang blijft alleen in deze browser bewaard en is voor niemand anders zichtbaar.</p>';
    dlg.showModal();
  };
  document.getElementById("close-trophies").onclick = function () { dlg.close(); };


  /* =====================================================================
     ARCADE
     ===================================================================== */
  var GAMES = {
    poort: { short: "Poort", title: "Wie mag dit zien?", level: "Bonusronde bij level 3", after: 2, aria: "De lopende band in de ziekenboeg draait. Stuur elk pakketje door het juiste luik.",
      lead: "Informatie over zieke crewleden rolt over de lopende band. Stuur elk pakketje door het juiste luik voordat het van de band valt.",
      rules: [["Drie luiken", "Sectorchef, crewadministratie of scheepsarts. Toets 1, 2 of 3."], ["Steeds sneller", "Elk pakketje gaat iets harder. Te laat of verkeerd kost schild."], ["Drie schilden", "Bij nul schild is de ronde voorbij."]],
      thresholds: [6, 10, 13], unit: "goed", badge: "poortwachter",
      learn: ["De sectorchef hoort alleen wat nodig is voor het werk: duur en wat iemand nog kan.", "Diagnose, medicijnen en medische verslagen zijn alleen voor de scheepsarts.", "Regelingen, ongevallen en de ziekmelding zelf horen bij de crewadministratie."] }
  };
  LEVELS.forEach(function (l) { l.short = l.short || l.name; });

  var G = null, loop = null, timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function stopGame() { if (loop) cancelAnimationFrame(loop); loop = null; timers.forEach(clearTimeout); timers = []; document.onkeydown = null; G = null; if (A3) { A3 = null; if (window.OrionArcade) window.OrionArcade.unmount(); station(function (S) { S.lowPower(view === "home" ? 0 : 1); }); } }
  /* The 3D playfield behind an arcade round. Without WebGL the round plays on its flat background. */
  var A3 = null;
  function playfield(sel, id) {
    A3 = window.OrionArcade ? window.OrionArcade.mount(document.querySelector(sel), id) : null;
    if (A3) station(function (S) { S.lowPower(2); });
  }

  /* Start card of a practice round: what you see, what you do, what it costs. */
  var INTRO = {
    poort: { time: "14 pakketjes", lead: "Informatie over zieke crewleden rolt over de band. Jij stuurt elk pakketje door het juiste luik.",
      score: [["check", "Het juiste luik levert punten op"], ["zap", "Elke drie goed op rij telt zwaarder, tot keer 4"], ["shield", "Verkeerd luik of te laat kost een schildcel"]],
      calm: "Staat Tijdsdruk uit, dan wacht het pakketje tot je kiest.",
      demo: function () { return '<div class="gi-card">Diagnose: rugblessure</div><span class="gi-arrow">' + icon("aright") + '</span><div class="gi-doors">' + DOORS.map(function (d, i) { return '<div class="gi-side' + (i === 2 ? " yes" : "") + '">' + icon(d[1]) + "<b>" + d[0].replace("Crewadmin", "Crew\u00adadmin") + "</b><kbd>Toets " + (i + 1) + "</kbd></div>"; }).join("") + "</div>"; } }
  };
  function gameIntro(id) {
    var g = GAMES[id], best = P.games[id] || {}, n = INTRO[id];
    function rows(list) { return list.map(function (r) { return "<li>" + icon(r[0]) + "<span>" + esc(r[1]) + "</span></li>"; }).join(""); }
    arcade.innerHTML = '<div class="ar-wrap"><section class="ar-panel gi">' +
      '<p class="gi-chips"><span>' + icon("zap") + "Oefenronde</span><span>" + icon("clock") + esc(n.time) + "</span><span>Hoort bij level " + (g.after + 1) + "</span></p>" +
      '<h1 class="ar-title">' + esc(g.title) + '</h1><p class="ar-lead">' + esc(n.lead) + "</p>" +
      '<div class="gi-demo d-' + id + '" aria-hidden="true">' + n.demo() + "</div>" +
      '<div class="gi-cols"><div class="gi-box"><h2>Zo scoor je</h2><ul>' + rows(n.score) + '</ul></div><div class="gi-box"><h2>Goed om te weten</h2><ul>' +
      rows([["trophy", "De ronde telt voor je score en je prestaties."], ["door", "Je hoeft hem niet te halen om door te gaan."], ["clock", n.calm]]) + "</ul></div></div>" +
      '<div class="ar-actions"><button class="btn-go" id="g-start">Start de ronde' + icon("aright") + '</button><button class="btn-ghost" id="g-skip">Sla over</button>' +
      '<span class="ar-best">' + (best.score != null ? "Je record: <b>" + best.score + " " + g.unit + "</b> " + '<span class="stars" style="display:inline-flex;vertical-align:-2px">' + stars(best.stars || 0) + "</span>" : "Drie sterren bij " + g.thresholds[2] + " " + g.unit + ".") + "</span></div>" +
      "</section></div>";
    document.getElementById("g-start").onclick = function () { startGame(id); };
    document.getElementById("g-skip").onclick = function () { go(cur + 1); };
    document.getElementById("g-start").focus({ preventScroll: true });
  }

  function hudHtml(extra) {
    return '<div class="ar-hud"><div><span>Score</span><b id="g-score">0</b></div><div class="mult"><span>Combo</span><b id="g-mult">×1</b></div>' +
      '<div><span>Tijd</span><b id="g-time">0</b></div><div><span>Schild</span><div class="lives" id="g-lives"></div></div></div><div class="timebar"><i id="g-tbar" style="width:100%"></i></div>' + (extra || "");
  }
  function gHud() {
    if (!G) return;
    document.getElementById("g-score").textContent = G.score;
    document.getElementById("g-mult").textContent = "×" + G.mult();
    document.getElementById("g-time").textContent = G.count || Math.max(0, Math.ceil(G.left));
    document.getElementById("g-tbar").style.width = (G.bar != null ? G.bar : Math.max(0, G.left / G.total)) * 100 + "%";
    document.getElementById("g-lives").innerHTML = [0, 1, 2].map(function (i) { return '<i class="' + (i < G.lives ? "" : "off") + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg></i>'; }).join("");
  }
  function newG(id, seconds) {
    G = { id: id, done: 0, limit: 0, score: 0, correct: 0, streak: 0, lives: 3, lostLife: false, left: seconds, total: seconds, over: false,
      mult: function () { return this.streak >= 9 ? 4 : this.streak >= 6 ? 3 : this.streak >= 3 ? 2 : 1; } };
    return G;
  }
  function gGood(base) { if (window.OrionStation && window.OrionStation.pulse) window.OrionStation.pulse("good"); var before = G.mult(); G.streak++; G.correct++; var pts = base * G.mult(); G.score += pts; SFX.good(); if (G.mult() > before) { pop("Combo ×" + G.mult(), "gold"); SFX.combo(); flash("gold"); award("vonk"); } gHud(); return pts; }
  function gBad(loseLife) { G.streak = 0; SFX.bad(); flash("bad"); shake(); if (loseLife) { G.lives--; G.lostLife = true; } gHud(); if (G.lives <= 0) endGame(); }
  function feed(text, kind) { var f = document.getElementById("g-feed"); if (f) { f.textContent = text; f.className = "ar-feed " + (kind || ""); } }
  function clock(onTick) {
    var last = performance.now();
    function frame(now) {
      if (!G || G.over) return;
      var dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (!P.calm) G.left -= dt; if (onTick) onTick(dt, now);
      if (G && !G.over && P.calm && G.limit) { G.count = Math.min(G.done, G.limit) + "/" + G.limit; G.bar = G.done / G.limit; if (G.done >= G.limit) { gHud(); endGame(); return; } }
      if (!G || G.over) return;
      if (G.left <= 0) { G.left = 0; gHud(); endGame(); return; }
      gHud(); loop = requestAnimationFrame(frame);
    }
    loop = requestAnimationFrame(frame);
  }

  function startGame(id) {
    stopGame(); roundNotes = 0;
    ({ poort: playPoort })[id]();
  }

  function endGame() {
    if (!G || G.over) return;
    G.over = true;
    var id = G.id, g = GAMES[id], val = g.unit === "goed" ? G.correct : G.score;
    var s = val >= g.thresholds[2] ? 3 : val >= g.thresholds[1] ? 2 : val >= g.thresholds[0] ? 1 : 0;
    var prev = P.games[id] || {}, record = prev.score == null || val > prev.score;
    var pct = id === "poort" ? Math.round(G.correct / PACKETS.length * 100) : null;
    P.games[id] = { score: Math.max(val, prev.score || 0), stars: Math.max(s, prev.stars || 0), pct: pct == null ? prev.pct : Math.max(pct, prev.pct || 0) };
    var xp = G.score * 5; P.xp += xp; save(); hud(); renderRoute();
    var lost = G.lostLife;
    stopGame();
    arcade.innerHTML = '<div class="ar-wrap"><section class="ar-panel"><div class="res">' +
      '<h1 class="ar-title">' + esc(g.title) + '</h1><p class="ar-meta">Ronde voorbij</p>' +
      '<div class="bigstars" aria-label="' + s + ' van 3 sterren">' + stars(s) + "</div>" +
      '<div class="score">' + val + " " + g.unit + '</div><p class="sub">+' + xp.toLocaleString("nl-NL") + " Datawacht-XP" + (s < 3 ? " · Drie sterren bij " + g.thresholds[2] + " " + g.unit : "") + "</p>" +
      (record && val > 0 ? '<span class="rec">Nieuw record</span>' : "") +
      '<div class="learn"><h3>Wat je hier traint</h3><ul>' + g.learn.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul></div>" +
      (roundNotes ? '<p class="ar-nalezen"><button class="btn-ghost" id="g-review" type="button">Lees na wat fout ging (' + roundNotes + ")</button></p>" : "") +
      '<div class="ar-actions"><button class="btn-ghost" id="g-again">' + icon("refresh") + 'Nog een keer</button><button class="btn-go" id="g-next">Verder' + icon("right") + "</button></div>" +
      "</div></section></div>";
    var gr = document.getElementById("g-review"); if (gr) gr.onclick = openReview;
    document.getElementById("g-again").onclick = function () { startGame(id); };
    document.getElementById("g-next").onclick = function () { go(cur + 1); };
    document.getElementById("g-next").focus({ preventScroll: true });
    if (s === 3) award(g.badge);
    if (!lost && val > 0) award("ongeschonden");
    checkOefenmeester();
    if (s > 0) { SFX.combo(); flash("gold"); }
  }

  /* ---------- Wie mag dit zien? ---------- */
  var PACKETS = [
    ["Verwachte terugkeer over twee weken", 0], ["Kan vier uur per dag licht werk doen", 0], ["Verwachte duur van de afwezigheid", 0], ["Bereikbaar via zijn communicator", 0],
    ["Valt onder een vangnetregeling", 1], ["Ziekmelding is op tijd gedaan", 1], ["Afwezig door een ongeluk tijdens dienst", 1], ["Ander schip aansprakelijk na een aanvaring", 1],
    ["Diagnose: rugblessure", 2], ["Medicatielijst", 2], ["Verslag van de fysiotherapeut", 2], ["Uitslag van een bloedtest", 2], ["Heeft last van heimwee naar de aarde", 2], ["Advies over een aangepaste werkplek, met medische onderbouwing", 2]
  ];
  var DOORS = [["Sectorchef", "user"], ["Crewadministratie", "clip"], ["Scheepsarts", "cross"]];
  function playPoort() {
    newG("poort", 120);
    var list = shuffle(PACKETS), idx = 0, x = 0, speed = 120, active = null, beltW = 800;
    arcade.innerHTML = '<div class="ar-wrap"><section class="ar-panel">' + hudHtml() +
      '<div class="belt" id="belt"></div><div class="doors">' + DOORS.map(function (d, i) { return '<button class="door" data-d="' + i + '">' + icon(d[1]) + esc(d[0]) + "<kbd>" + (i + 1) + "</kbd></button>"; }).join("") + "</div>" +
      '<p class="ar-feed" id="g-feed" aria-live="polite">Stuur het pakketje naar het juiste luik.</p></section></div>';
    document.getElementById("g-time").parentNode.querySelector("span").textContent = "Pakketjes";
    var belt = document.getElementById("belt");
    function next() {
      if (!G || G.over) return;
      if (idx >= list.length) { endGame(); return; }
      beltW = belt.clientWidth; x = -300;
      active = document.createElement("div"); active.className = "packet"; active.innerHTML = "<small>Over een ziek crewlid</small><b>" + esc(list[idx][0]) + "</b>";
      var old = belt.querySelector(".packet"); if (old) old.remove(); belt.appendChild(active); feed("Pakketje " + (idx + 1) + " van " + list.length + ": " + list[idx][0]);
    }
    function decide(d) {
      if (!active || !G || G.over) return;
      var p = list[idx], ok = p[1] === d, btn = document.querySelector('.door[data-d="' + d + '"]');
      btn.classList.add(ok ? "ok" : "nok"); later(function () { btn.classList.remove("ok", "nok"); }, 350);
      active = null; idx++; speed += 14;
      if (ok) { var pts = gGood(10); feed("+" + pts + " · Juist luik.", "good"); }
      else { feed("Verkeerd luik. Dit hoort bij de " + DOORS[p[1]][0].toLowerCase() + ".", "bad"); gBad(true); note("Wie mag dit zien?", p[0], DOORS[d][0], "Dit hoort bij de " + DOORS[p[1]][0].toLowerCase() + ". " + [GAMES.poort.learn[0], GAMES.poort.learn[2], GAMES.poort.learn[1]][p[1]], "fout"); }
      later(next, 350);
    }
    document.querySelectorAll(".door").forEach(function (b) { b.onclick = function () { decide(+b.getAttribute("data-d")); }; });
    document.onkeydown = function (e) { if (e.key === "1" || e.key === "2" || e.key === "3") decide(+e.key - 1); };
    playfield("#belt", "poort");
    next();
    G.left = 999; G.total = 999;
    G.count = "1/" + list.length; G.bar = 0;
    clock(function (dt) {
      G.left = 999;
      G.count = Math.min(idx + 1, list.length) + "/" + list.length; G.bar = idx / list.length;
      if (!active) return;
      x += speed * dt; if (P.calm) x = Math.min(x, beltW / 2 - 150); active.style.transform = "translateX(" + x + "px)";
      if (x > beltW - 60) {
        var p = list[idx]; active.remove(); active = null; idx++; speed += 14;
        feed("Te laat. Dit hoorde bij de " + DOORS[p[1]][0].toLowerCase() + ".", "bad"); gBad(true); later(next, 450);
        note("Wie mag dit zien?", p[0], "Te laat", "Dit hoort bij de " + DOORS[p[1]][0].toLowerCase() + ". " + [GAMES.poort.learn[0], GAMES.poort.learn[2], GAMES.poort.learn[1]][p[1]], "fout");
      }
    });
  }

  /* ---------- Demo login and the admin page. Every name and score here is made up. ---------- */
  var LABELS = ["VCSW", "KijkOpVerzuim", "HR Navigator", "Pay-Check"], DEPTS = ["Advies", "Juridische Zaken", "Data en IT", "Klantenservice", "Sales", "Finance"];
  var USERS = [
    { id: "u1", name: "Mila Sterrenburg", label: "VCSW", dept: "Advies" }, { id: "u2", name: "Daan Komeet", label: "KijkOpVerzuim", dept: "Klantenservice" },
    { id: "u3", name: "Noor van Orion", label: "HR Navigator", dept: "Sales" }, { id: "u4", name: "Sem Nevel", label: "Pay-Check", dept: "Finance" },
    { id: "admin", name: "Beheerder (demo)", label: "VCSW", dept: "Juridische Zaken", admin: true }
  ];
  function me() { return USERS.filter(function (u) { return u.id === P.user; })[0] || USERS[0]; }
  function paintUser() {
    var u = me(); document.getElementById("user-btn").textContent = u.name;
    document.getElementById("admin-btn").hidden = !u.admin;
  }
  /* Made-up colleagues, the same on every visit. */
  var FIRST = ["Jip", "Lotte", "Bram", "Fenna", "Thijs", "Sara", "Ruben", "Yara", "Koen", "Evi", "Milan", "Tess", "Luuk", "Nina", "Stijn", "Roos", "Jesse", "Lieke", "Finn", "Maud", "Gijs", "Isa", "Hugo", "Zoë", "Tim", "Anna"];
  var LAST = ["Maanzicht", "Sterrenveld", "van Kepler", "Zonneboog", "Meteoor", "van der Ring", "Poolster", "Nevelman", "Baanbreker", "van Sluis", "Lichtjaar", "Ruimte", "Dageraad"];
  function people() {
    var seed = 11, rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, out = [];
    FIRST.forEach(function (f, i) {
      var r = rnd(), done = r < 0.58 ? 6 : r < 0.82 ? 1 + Math.floor(rnd() * 5) : 0;
      out.push({ name: f + " " + LAST[i % LAST.length], label: LABELS[Math.floor(rnd() * 4)], dept: DEPTS[Math.floor(rnd() * 6)], done: done, score: done ? 55 + Math.floor(rnd() * 44) : null, days: done ? 1 + Math.floor(rnd() * 40) : null });
    });
    var u = me(), played = Object.keys(P.opened).length, stars = [0, 1, 2, 3, 4, 5].reduce(function (a, n) { return a + (P.levelStars[n] || 0); }, 0);
    out.push({ name: u.name + " (jij)", label: u.label, dept: u.dept, done: played, score: played ? Math.round(stars / 18 * 100) : null, days: played ? 0 : null });
    return out.sort(function (a, b) { return a.name.localeCompare(b.name, "nl"); });
  }
  function status(p) { return p.done >= 6 ? "Afgerond" : p.done > 0 ? "Bezig" : "Niet gestart"; }
  function renderAdmin() {
    var all = people(), fl = document.getElementById("ad-label").value, fd = document.getElementById("ad-dept").value, fs = document.getElementById("ad-status").value;
    var rows = all.filter(function (p) { return (!fl || p.label === fl) && (!fd || p.dept === fd) && (!fs || status(p) === fs); });
    function group(key, names) {
      return names.map(function (nm) {
        var g = all.filter(function (p) { return p[key] === nm; }), ok = g.filter(function (p) { return p.done >= 6; }).length, sc = g.filter(function (p) { return p.score != null; });
        var pct = g.length ? Math.round(ok / g.length * 100) : 0, avg = sc.length ? Math.round(sc.reduce(function (a, p) { return a + p.score; }, 0) / sc.length) : null;
        return '<div class="ad-row"><b>' + esc(nm) + "</b><span>" + ok + " van " + g.length + ' afgerond</span><div class="ad-bar" role="img" aria-label="' + pct + ' procent afgerond"><i style="width:' + pct + '%"></i></div><span class="ad-num">' + pct + "%</span><span>Gemiddelde kennisscore " + (avg == null ? "onbekend" : avg + "%") + "</span></div>";
      }).join("");
    }
    document.getElementById("ad-by-label").innerHTML = group("label", LABELS);
    document.getElementById("ad-by-dept").innerHTML = group("dept", DEPTS);
    document.getElementById("ad-count").textContent = rows.length + " van " + all.length + " collega's";
    document.getElementById("ad-rows").innerHTML = rows.map(function (p) {
      var s = status(p);
      return "<tr><th scope=\"row\">" + esc(p.name) + "</th><td>" + esc(p.label) + "</td><td>" + esc(p.dept) + '</td><td><span class="vcsw-badge ' + (s === "Afgerond" ? "success" : s === "Bezig" ? "warning" : "neutral") + '">' + s + "</span></td><td>" + p.done + " van 6</td><td>" + (p.score == null ? "Nog geen" : p.score + "%") + "</td><td>" + (p.days == null ? "Nog niet" : p.days === 0 ? "Vandaag" : p.days + " dagen geleden") + "</td></tr>";
    }).join("") || '<tr><td colspan="7">Geen collega\'s met deze filters.</td></tr>';
  }
  var adminEl = document.getElementById("admin");
  function showAdmin() {
    stopGame(); view = "admin"; cur = -1; document.body.setAttribute("data-view", "admin");
    homeEl.hidden = true; missionEl.hidden = true; adminEl.hidden = false; document.title = "Beheer · AVG-game Ruimtestation Orion";
    renderAdmin(); syncStation(); adminEl.focus({ preventScroll: true });
  }
  (function () {
    var opt = function (a) { return '<option value="">Alle</option>' + a.map(function (x) { return "<option>" + esc(x) + "</option>"; }).join(""); };
    document.getElementById("ad-label").innerHTML = opt(LABELS); document.getElementById("ad-dept").innerHTML = opt(DEPTS);
    ["ad-label", "ad-dept", "ad-status"].forEach(function (id) { document.getElementById(id).onchange = renderAdmin; });
    document.getElementById("admin-btn").onclick = showAdmin;
    document.getElementById("ad-close").onclick = function () { showHome(); };
  })();

  /* ---------- Nalezen: every half good or wrong answer is kept with its explanation, to read again ---------- */
  var roundNotes = 0, revBtn = document.getElementById("review"), revDlg = document.getElementById("review-dlg");
  function note(where, q, a, why, r) {
    if (!why) return;
    /* The label already says goed, half goed or fout; drop the same word at the start of the explanation. */
    why = String(why).replace(/^\s*(Helemaal goed|Half goed|Niet goed|Goed|Fout)[.!:,]\s*/i, "");
    P.review = (P.review || []).filter(function (x) { return !(x.w === where && x.q === q && x.a === a); });
    P.review.unshift({ w: where, q: q || "", a: a || "", why: why, r: r }); P.review = P.review.slice(0, 40);
    roundNotes++; save(); paintReview(true);
  }
  function paintReview(fresh) {
    var n = (P.review || []).length;
    revBtn.hidden = !n; revBtn.querySelector("b").textContent = n;
    if (fresh && !reduce) { revBtn.classList.add("new"); clearTimeout(paintReview.t); paintReview.t = setTimeout(function () { revBtn.classList.remove("new"); }, 2400); }
  }
  function openReview() {
    revDlg.querySelector(".tr-body").innerHTML = (P.review || []).map(function (x) {
      return '<article class="rv"><p class="rv-meta">' + esc(x.w) + (x.q ? " · " + esc(x.q) : "") + '</p><p class="rv-a"><span class="vcsw-badge ' + (x.r === "half" ? "warning" : "danger") + '">' + (x.r === "half" ? "Half goed" : "Fout") + "</span> Jouw antwoord: " + esc(x.a) + '</p><p class="rv-why">' + esc(x.why) + "</p></article>";
    }).join("") || "<p>Je hebt nog niets om na te lezen.</p>";
    revDlg.showModal();
  }
  revBtn.onclick = openReview;
  document.getElementById("close-review").onclick = function () { revDlg.close(); };
  document.getElementById("clear-review").onclick = function () { P.review = []; save(); paintReview(); revDlg.close(); };
  paintReview();

  /* ---------- Tijdsdruk: one switch for every timer, in the arcade and in the levels (see orion-bridge.js) ---------- */
  var calmBtn = document.getElementById("calm");
  function paintCalm() { calmBtn.textContent = P.calm ? "Tijdsdruk uit" : "Tijdsdruk aan"; calmBtn.setAttribute("aria-pressed", P.calm ? "true" : "false"); document.documentElement.classList.toggle("calm", !!P.calm); }
  calmBtn.onclick = function () { P.calm = !P.calm; save(); paintCalm(); pop(P.calm ? "Tijdsdruk uit. Timers staan stil." : "Tijdsdruk aan."); };
  paintCalm();

  /* ---------- A soft station hum while the sound is on ---------- */
  var amb = null;
  function ambient(on) {
    try {
      if (!on) { if (amb) { var a = amb; amb = null; a.g.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.4); setTimeout(function () { a.o.forEach(function (o) { o.stop(); }); }, 600); } return; }
      if (amb) return;
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var g = ac.createGain(), f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 220;
      g.gain.setValueAtTime(0.0001, ac.currentTime); g.gain.linearRampToValueAtTime(0.03, ac.currentTime + 1.5);
      var os = [55, 82.5, 110.3].map(function (hz, i) { var o = ac.createOscillator(); o.type = i ? "sine" : "triangle"; o.frequency.value = hz; o.connect(f); o.start(); return o; });
      f.connect(g); g.connect(ac.destination); amb = { g: g, o: os };
    } catch (e) {}
  }
  document.getElementById("sound").addEventListener("click", function () { ambient(P.sound); });

  /* ---------- Opening screen: the scan gate of the arrival airlock ---------- */
  (function () {
    var boot = document.getElementById("boot"); if (!boot) return;
    var rest = [document.querySelector("header.bar"), document.querySelector("main")];
    var sel = document.getElementById("boot-user"), msBtn = document.getElementById("gate-ms"), passes = document.getElementById("passes");
    var bay = document.getElementById("bay"), statusEl = document.getElementById("boot-status");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sel.innerHTML = USERS.map(function (u) { return '<option value="' + u.id + '"' + (u.id === P.user ? " selected" : "") + ">" + esc(u.name) + "</option>"; }).join("");
    function initials(n) { return n.replace(/\(.*\)/, "").trim().split(/\s+/).filter(function (w) { return /^[A-Z]/.test(w); }).map(function (w) { return w[0]; }).slice(0, 2).join(""); }
    passes.innerHTML = USERS.map(function (u) {
      return '<li><button type="button" class="pass-card' + (u.admin ? " is-admin" : "") + '" data-id="' + u.id + '"><span class="av" aria-hidden="true">' + esc(initials(u.name)) + "</span><span><b>" + esc(u.name) + "</b><small>" + esc(u.label) + ", " + esc(u.dept) + "</small></span></button></li>";
    }).join("");
    /* Wear for the metal: scratches, grime and grain, drawn once in code so the door does not look like a vector drawing. */
    (function wear() {
      try {
        var c = document.createElement("canvas"), n = 512; c.width = c.height = n;
        var x = c.getContext("2d"), seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        for (var i = 0; i < 2600; i++) { x.fillStyle = "rgba(255,255,255," + (rnd() * 0.05).toFixed(3) + ")"; x.fillRect(rnd() * n, rnd() * n, 1, 1); }
        for (i = 0; i < 1600; i++) { x.fillStyle = "rgba(0,0,0," + (rnd() * 0.12).toFixed(3) + ")"; x.fillRect(rnd() * n, rnd() * n, 1 + rnd() * 1.5, 1); }
        for (i = 0; i < 26; i++) {
          var gx = rnd() * n, gy = rnd() * n, r = 10 + rnd() * 50, g = x.createRadialGradient(gx, gy, 0, gx, gy, r);
          g.addColorStop(0, "rgba(0,0,0," + (0.06 + rnd() * 0.1).toFixed(3) + ")"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(gx - r, gy - r, r * 2, r * 2);
        }
        x.lineCap = "round";
        for (i = 0; i < 140; i++) {
          var sx = rnd() * n, sy = rnd() * n, a = (rnd() - 0.5) * 1.2 + (rnd() < 0.5 ? 0 : Math.PI / 2 * 0.2), l = 6 + rnd() * 40;
          x.strokeStyle = "rgba(220,235,250," + (0.05 + rnd() * 0.16).toFixed(3) + ")"; x.lineWidth = 0.5 + rnd() * 0.7;
          x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + Math.cos(a) * l * 0.5 + (rnd() - 0.5) * 4, sy + Math.sin(a) * l * 0.5, sx + Math.cos(a) * l, sy + Math.sin(a) * l); x.stroke();
        }
        boot.style.setProperty("--wear", 'url("' + c.toDataURL("image/png") + '")');
      } catch (e) {}
    })();
    function step(name) { boot.querySelectorAll(".reader-step").forEach(function (s) { s.hidden = s.getAttribute("data-step") !== name; }); }
    /* The wall has a hole where the door bay is, so the station shows through when the leaves part. */
    function hole() {
      var r = bay.getBoundingClientRect();
      boot.style.setProperty("--hx", r.left + "px"); boot.style.setProperty("--hy", r.top + "px");
      boot.style.setProperty("--hw", r.width + "px"); boot.style.setProperty("--hh", r.height + "px");
      boot.style.setProperty("--gx", ((r.left + r.width / 2) / window.innerWidth * 100) + "%");
      boot.style.setProperty("--gy", ((r.top + r.height / 2) / window.innerHeight * 100) + "%");
      /* the recess around the door gets a real opening (clip-path, so it holds while the hall scales) */
      var rc = boot.querySelector(".recess");
      if (rc && !boot.classList.contains("leaving")) {
        var q = rc.getBoundingClientRect(), w = rc.offsetWidth, hh2 = rc.offsetHeight, x = r.left - q.left, y = r.top - q.top;
        if (w > 0 && hh2 > 0) rc.style.clipPath = 'path(evenodd, "M60 0 H' + (w - 60) + ' L' + w + ' 60 V' + hh2 + ' H0 V60 Z M' + x + ' ' + y + ' h' + r.width + ' v' + r.height + ' h' + (-r.width) + ' Z")';
      }
      /* the hall pushes in towards the door: the wall scales around the same point as the door stage */
      var st = boot.querySelector(".door-stage").getBoundingClientRect();
      boot.style.setProperty("--ox", (r.left + r.width / 2) + "px"); boot.style.setProperty("--oy", (r.top + r.height / 2) + "px");
      boot.style.setProperty("--sox", (r.left + r.width / 2 - st.left) + "px"); boot.style.setProperty("--soy", (r.top + r.height / 2 - st.top) + "px");
    }
    window.addEventListener("resize", hole); boot.addEventListener("scroll", hole, { passive: true });
    function lock(on) { rest.forEach(function (el) { if (el) el.inert = on; }); }
    function close() { boot.hidden = true; lock(false); boot.classList.remove("scanning", "granted", "unlock", "folding", "opening", "leaving"); }
    function open() {
      boot.hidden = false; lock(true); boot.classList.remove("scanning", "granted", "unlock", "folding", "opening", "leaving");
      step("start"); hole(); statusEl.textContent = ready ? "Wacht op je pas" : "Het station wordt opgebouwd";
      if (window.OrionStation && OrionStation.lowPower) OrionStation.lowPower(3);
    }
    document.getElementById("user-btn").onclick = function () { boot.classList.add("relog"); open(); step("pick"); var c = passes.querySelector('[data-id="' + P.user + '"]') || passes.querySelector("button"); c.focus(); };
    if (/[?&](boot=uit|oefen=)/.test(location.search)) { if (!P.user) P.user = USERS[0].id; paintUser(); close(); return; }
    /* The first unplayed level loads in the background once the player is in, so "Start de missie" opens at once. */
    function warmNext() {
      var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 600); };
      idle(function () { try { if (view !== "home") return; var r = ROUTE[P.last >= 0 ? P.last : 0]; if (r && r.type === "level" && !frames[r.n]) { frames[r.n] = loadFrame(r.n); frames[r.n].hidden = true; } } catch (e) {} }, { timeout: 2500 });
    }
    var bar = document.getElementById("boot-bar"), ready = false;
    lock(true); hole(); requestAnimationFrame(hole);
    function prog(f) { bar.firstElementChild.style.width = Math.round(f * 100) + "%"; bar.setAttribute("aria-valuenow", Math.round(f * 100)); }
    function done(text) { if (ready) return; ready = true; prog(1); statusEl.textContent = text; boot.classList.add("loaded"); msBtn.disabled = false; msBtn.focus({ preventScroll: true, focusVisible: false }); }
    window.addEventListener("orion-load", function (e) { if (!ready) prog(e.detail * 0.9); });
    window.addEventListener("orion-station-ready", function () { done("Wacht op je pas"); if (!boot.hidden && window.OrionStation && OrionStation.lowPower) OrionStation.lowPower(3); });
    var iv = setInterval(function () { if (ready) { clearInterval(iv); return; } if (document.documentElement.classList.contains("no-3d")) done("Wacht op je pas"); }, 300);
    msBtn.onclick = function () { statusEl.textContent = "Kies je pas"; step("pick"); var c = passes.querySelector('[data-id="' + P.user + '"]') || passes.querySelector("button"); c.focus(); };
    document.getElementById("pick-back").onclick = function () { statusEl.textContent = "Wacht op je pas"; step("start"); msBtn.focus(); };
    /* ?traag=10 plays the opening ten times slower, for checking the motion frame by frame. */
    var slow = Number((location.search.match(/[?&]traag=(\d+)/) || [])[1]) || 1;
    var T = function (f, ms) { return setTimeout(f, (reduce ? Math.min(ms, 120) : ms) * slow); };
    passes.addEventListener("click", function (e) {
      var b = e.target.closest(".pass-card"); if (!b || boot.classList.contains("scanning")) return;
      sel.value = b.getAttribute("data-id"); P.user = sel.value; save(); paintUser();
      var u = me();
      boot.classList.add("scanning"); statusEl.textContent = "Pas wordt gelezen";
      T(function () {
        step("ok"); document.getElementById("ok-name").textContent = "Welkom aan boord, " + u.name.replace(/\s*\(demo\)/, "") + ".";
        boot.classList.add("granted"); statusEl.textContent = "Toegang verleend";
        if (window.OrionStation && OrionStation.pulse) OrionStation.pulse("good");
      }, 700);
      /* The station stays almost still behind the closed doors and wakes up while they unlock, so the gangway has the
         graphics card to itself and the station is at full pace the moment it comes into view. */
      T(function () { boot.classList.add("unlock"); hole(); if (window.OrionStation && OrionStation.lowPower) OrionStation.lowPower(2); }, 1250);
      T(function () { boot.classList.add("folding", "opening"); }, 1650);
      T(function () { hole(); boot.classList.add("leaving"); }, 2950);
      T(function () {
        close(); boot.classList.remove("relog");
        syncStation(); warmNext();
        if (view === "admin" && !me().admin) showHome();
        document.getElementById("start").focus({ preventScroll: true });
      }, 4450);
    });
    paintUser();
  })();

  /* ---------- Start ---------- */
  hud(); showHome(true);
  /* Test jump: index.html?oefen=<slug>&shot=play skips the gate and opens that practice round in the panel. */
  (function () { var id = new URLSearchParams(location.search).get("oefen"), i = id ? routeIndexOfExtra(id) : -1; if (i >= 0) go(i); })();
})();
