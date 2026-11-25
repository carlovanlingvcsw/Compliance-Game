/* Ruimtestation Orion: the game shell.
   Overview of the station, the mission route, the combo and badge layer, and the four arcade rounds.
   The levels themselves live in levels/<level>/ and run in an iframe; they report each answer
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


  /* ---------- Route: levels plus arcade rounds ---------- */
  var ROUTE = [
    { type: "level", n: 0 }, { type: "game", id: "sprint" },
    { type: "level", n: 1 },
    { type: "level", n: 2 }, { type: "game", id: "poort" },
    { type: "level", n: 3 }, { type: "game", id: "invaders" },
    { type: "level", n: 4 }, { type: "game", id: "lekken" },
    { type: "level", n: 5 },
    { type: "result" }
  ];
  var RESULT = { title: "Resultaat", short: "Resultaat", place: "Communicatietoren", aria: "Dit is je logboek. Hier staat hoe elke missie ging." };


  /* ---------- Badges ---------- */
  var BADGES = [
    { id: "vonk", name: "Eerste vonk", desc: "Haal voor het eerst combo x2." },
    { id: "keten", name: "Kettingreactie", desc: "Vijf goede antwoorden op rij in de levels." },
    { id: "onbreekbaar", name: "Onbreekbaar", desc: "Tien goede antwoorden op rij in de levels." },
    { id: "topcadet", name: "Topcadet", desc: "Haal drie sterren in een level." },
    { id: "ontdekker", name: "Ontdekkingsreiziger", desc: "Open alle zes levels." },
    { id: "sorteer", name: "Sorteermachine", desc: "Drie sterren in de Holokaarten-sprint." },
    { id: "poortwachter", name: "Poortwachter", desc: "Drie sterren in Wie mag dit zien." },
    { id: "scherpschutter", name: "Scherpschutter", desc: "Drie sterren in Phishing Invaders." },
    { id: "lekdichter", name: "Lekdichter", desc: "Drie sterren in Lekken dichten." },
    { id: "zonderkras", name: "Zonder kras", desc: "Speel Poort, Invaders of Lekken uit zonder schild te verliezen." },
    { id: "arcadeheld", name: "Arcadeheld", desc: "Minstens twee sterren in alle vier de arcaderondes." }
  ];
  var toasts = document.getElementById("toasts");
  function award(id) {
    if (P.badges[id]) return;
    var b = BADGES.filter(function (x) { return x.id === id; })[0]; if (!b) return;
    P.badges[id] = Date.now(); save(); hud();
    var t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status");
    t.innerHTML = '<span class="medal">' + icon("award") + '</span><div><small>Badge verdiend</small><b>' + esc(b.name) + "</b><span>" + esc(b.desc) + "</span></div>";
    toasts.appendChild(t); SFX.badge(); flash("gold");
    setTimeout(function () { t.remove(); }, 4200);
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
  function pop(text, kind) {
    if (reduce) return;
    var p = document.createElement("div"); p.className = "pop" + (kind ? " " + kind : ""); p.textContent = text; fx.appendChild(p);
    setTimeout(function () { p.remove(); }, 1150);
  }
  function shake() { if (reduce) return; stageEl.classList.remove("shake"); void stageEl.offsetWidth; stageEl.classList.add("shake"); }
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
  function label(r) { return r.type === "level" ? LEVELS[r.n] : r.type === "result" ? RESULT : GAMES[r.id]; }
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
      return '<li><button type="button" class="node' + (r.type === "game" ? " bonus" : r.type === "result" ? " flag" : "") + '" data-i="' + i + '"' + (i === cur ? ' aria-current="step"' : "") +
        ' title="' + esc(L.title) + '"><span class="num">' + num(r) + '</span><span class="nm">' + esc(L.short) + "</span></button></li>";
    }).join("");
    renderMap();
  }
  routeEl.addEventListener("click", function (e) { var b = e.target.closest(".node"); if (b) go(+b.getAttribute("data-i")); });

  /* ---------- Overview: the station map ---------- */
  var mapEl = document.getElementById("map"), hotEl = document.getElementById("hotspots");
  function routeIndexOfLevel(n) { for (var i = 0; i < ROUTE.length; i++) if (ROUTE[i].type === "level" && ROUTE[i].n === n) return i; return 0; }
  function bonusFor(n) { for (var i = 0; i < ROUTE.length; i++) if (ROUTE[i].type === "game" && GAMES[ROUTE[i].id].after === n) return i; return -1; }
  function renderMap() {
    var done = 0;
    mapEl.innerHTML = LEVELS.map(function (L, n) {
      var i = routeIndexOfLevel(n), s = P.levelStars[n] || 0, b = bonusFor(n);
      if (s > 0) done++;
      return '<li><button type="button" class="stop" data-i="' + i + '" data-m="' + L.module + '"><span class="num">' + (n === 5 ? "E" : n + 1) + '</span><span class="txt"><b>' + esc(L.name) + "</b>" + (b >= 0 ? "<small>Met bonusronde</small>" : "") + '</span>' + (P.opened[n] || s ? '<span class="stars" role="img" aria-label="' + s + ' van 3 sterren">' + stars(s) + "</span>" : "") + "</button></li>";
    }).join("");
    hotEl.innerHTML = LEVELS.map(function (L, n) {
      var st = P.levelStars[n] || 0, seen = P.opened[n];
      return '<button type="button" class="hot' + (seen ? " seen" : "") + '" data-i="' + routeIndexOfLevel(n) + '" data-m="' + L.module + '" aria-label="' + esc(L.title) + (seen ? ", " + st + " van 3 sterren" : "") + '"><span class="dot"></span><span class="lead"></span><span class="tag">' + (n === 5 ? "E" : n + 1) + " · " + esc(L.place) + "</span></button>";
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
  function placeHotspots() {
    var S = window.OrionStation;
    if (!S || view !== "home") return;
    var pts = S.project(), btns = hotEl.children, mid = S.centre ? S.centre() : { x: window.innerWidth / 2 };
    var copy = document.getElementById("home-title"), cr = copy ? copy.getBoundingClientRect() : null;
    LEVELS.forEach(function (L, n) {
      var p = pts[L.module], b = btns[n]; if (!p || !b) return;
      var left = p.x < mid.x - 20;
      var low = left && cr && p.y > cr.top - 30 && p.x - b.offsetWidth < cr.right + 24; // not across the title: hang it below the module
      if (low) left = false;
      b.classList.toggle("left", left);
      b.style.transform = "translate(" + Math.round(p.x) + "px," + Math.round(p.y) + "px)" + (left ? " translateX(-100%)" : "") + (low ? " translateY(54px)" : "");
      b.classList.toggle("behind", !p.front);
    });
    var et = document.getElementById("earth-tag");
    if (et && S.earth) { var e = S.earth(); et.style.transform = "translate(" + Math.round(e.x) + "px," + Math.round(e.y) + "px)"; et.classList.toggle("off", !e.front); }
  }

  /* ---------- Station link ---------- */
  function station(fn) { if (window.OrionStation) fn(window.OrionStation); }
  window.addEventListener("orion-station-ready", function () {
    station(function (S) { S.onFrame(placeHotspots); syncStation(); });
  });
  function syncStation() {
    station(function (S) {
      if (view === "home" || view === "admin") { S.focus(-1, view === "home" && window.innerWidth > 900 ? "home" : null); S.alarm(false); S.lowPower(view === "admin" ? 2 : false); return; }
      var r = ROUTE[cur], L = r.type === "level" ? LEVELS[r.n] : r.type === "result" ? LEVELS[5] : LEVELS[GAMES[r.id].after];
      S.focus(L.module, window.innerWidth > 900 ? "left" : null);
      S.alarm(!!L.alarm || r.id === "lekken");
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
    frames.forEach(function (f) { if (f) f.hidden = true; });
    document.getElementById("logbook").hidden = true; document.getElementById("status").hidden = true;
    document.title = "AVG-game Ruimtestation Orion";
    renderRoute(); syncStation();
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
  function renderLogbook() {
    var R = P.results || {}, played = Object.keys(R), tot = played.length ? Math.round(played.reduce(function (a, k) { return a + R[k].pct; }, 0) / played.length) : 0;
    var passed = played.filter(function (k) { return R[k].passed; }).length, worst = null;
    LEVELS.forEach(function (L, n) { if (!R[n] || !R[n].passed) { if (worst === null) worst = n; } });
    var games = Object.keys(GAMES).filter(function (id) { return P.games[id]; }).length, badges = Object.keys(P.badges || {}).length;
    var rank = passed === 6 ? "Admiraal van de Datawacht" : passed >= 3 ? "Luitenant van de Datawacht" : "Cadet van de Datawacht";
    var day = new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
    var rows = LEVELS.map(function (L, n) {
      var x = R[n], st = P.levelStars[n] || 0, stars = ""; for (var i = 0; i < 3; i++) stars += '<span class="lb-star' + (i < st ? " on" : "") + '">' + icon("star") + "</span>";
      return "<tr" + (x && !x.passed ? ' class="lb-low"' : "") + "><th scope=\"row\"><span class=\"lb-nr\">" + (n === 5 ? "E" : n + 1) + "</span>" + esc(L.name) + '</th><td class="num' + (x && !x.passed ? " low" : "") + '">' + (x ? x.pct + "%" : "") + "</td><td>" + stars + '</td><td class="state"><span class="lb-chip ' + (x ? (x.passed ? "ok" : "low") : "none") + '">' + (x ? (x.passed ? icon("check") + "Gehaald" : "Nog niet gehaald") : "Nog niet gespeeld") + "</span></td></tr>";
    }).join("");
    logEl.innerHTML = '<div class="lb-sheet"><div class="lb-head"><span class="lb-seal">' + icon("shield") + '</span><div class="lb-who"><h1>Logboek van ' + esc(me().name) + "</h1><p>" + rank + ". Stand op " + day + '.</p></div><div class="lb-total"><b>' + tot + "%</b><span>totaalscore</span></div></div>" +
      '<table><caption class="vcsw-sr-only">Uitslag per missie</caption><tbody>' + rows + '</tbody></table><div class="lb-foot"><span>' + passed + " van 6 missies gehaald</span><span>" + games + " van 4 oefenrondes gespeeld</span><span>" + badges + " van " + BADGES.length + ' prestaties</span></div><p class="lb-note">Het schild telt niet mee voor halen. Een missie is gehaald vanaf 70 procent van de punten. Dit logboek staat alleen in deze browser.</p></div>' +
      '<div class="lb-actions"><button type="button" class="btn-go" id="lb-print">' + icon("download") + "Bewaar als pdf</button>" + (worst !== null ? '<button type="button" class="btn-ghost" id="lb-again">' + icon("refresh") + "Speel " + esc(LEVELS[worst].short) + (R[worst] ? " opnieuw" : "") + "</button>" : "") + (P.review && P.review.length ? '<button type="button" class="btn-ghost" id="lb-review">' + icon("doc") + "Lees na wat fout ging</button>" : "") + '<button type="button" class="btn-ghost lb-close" id="lb-close">Sluit af</button></div>';
    document.getElementById("lb-print").onclick = function () { document.body.classList.add("print-logbook"); try { window.print(); } catch (e) {} setTimeout(function () { document.body.classList.remove("print-logbook"); }, 500); };
    document.getElementById("lb-close").onclick = function () { showHome(); };
    var a = document.getElementById("lb-again"); if (a) a.onclick = function () { go(routeIndexOfLevel(worst)); };
    var rv = document.getElementById("lb-review"); if (rv) rv.onclick = function () { document.getElementById("review").click(); };
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
    if (e.data && e.data.orion === "status") { for (var q = 0; q < frames.length; q++) if (frames[q] && frames[q].contentWindow === e.source) onStatus(q, e.data.s); return; }
    if (e.data && e.data.orion === "size") { for (var k = 0; k < frames.length; k++) if (frames[k] && frames[k].contentWindow === e.source) { fitH[k] = e.data.h; fitPanel(); } return; }
    if (!e.data || e.data.orion !== "answer") return;
    for (var n = 0; n < frames.length; n++) if (frames[n] && frames[n].contentWindow === e.source) { onAnswer(n, e.data.result); if (e.data.result !== "goed" && e.data.why) note(LEVELS[n].name, e.data.q, e.data.a, e.data.why, e.data.result); }
  });
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
    frames.forEach(function (f) { if (f) f.hidden = true; });
    var L = r.type === "level" ? LEVELS[r.n] : r.type === "result" ? RESULT : LEVELS[GAMES[r.id].after];
    document.getElementById("m-title").textContent = L.place;
    document.getElementById("m-place").textContent = label(r).title;
    document.getElementById("m-aria").textContent = r.type === "level" ? L.aria : r.type === "result" ? RESULT.aria : GAMES[r.id].aria;
    logEl.hidden = r.type !== "result";
    missionEl.classList.toggle("is-level", r.type === "level");
    if (r.type === "level") {
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
    var gp = Object.keys(GAMES).map(function (id) { return (P.games[id] || {}).stars || 0; }).reduce(function (a, b) { return a + b; }, 0);
    var lp = [0, 1, 2, 3, 4, 5].map(function (n) { return P.levelStars[n] || 0; }).reduce(function (a, b) { return a + b; }, 0);
    dlg.querySelector(".tr-body").innerHTML =
      '<div class="tr-stats"><div class="tr-stat"><span>Datawacht-XP</span><b>' + P.xp.toLocaleString("nl-NL") + '</b></div><div class="tr-stat"><span>Sterren</span><b>' + (gp + lp) + ' / 30</b></div><div class="tr-stat"><span>Langste reeks</span><b>' + P.best + "</b></div></div>" +
      '<div class="tr-grid">' + BADGES.map(function (b) { var on = !!P.badges[b.id]; return '<div class="badge-card' + (on ? " on" : "") + '"><span class="medal">' + icon("award") + "</span><div><b>" + esc(b.name) + "</b><span>" + esc(b.desc) + (on ? "" : " Nog niet verdiend.") + "</span></div></div>"; }).join("") + "</div>" +
      '<p style="margin:16px 0 0;font-size:.8125rem;color:var(--vcsw-gray-400)">Je voortgang blijft alleen in deze browser bewaard en is voor niemand anders zichtbaar.</p>';
    dlg.showModal();
  };
  document.getElementById("close-trophies").onclick = function () { dlg.close(); };


  /* =====================================================================
     ARCADE
     ===================================================================== */
  var GAMES = {
    sprint: { short: "Sprint", title: "Holokaarten-sprint", level: "Bonusronde bij level 1", after: 0, aria: "Er komen holokaarten binnen in de aankomsthal. Sorteer ze, snel en zuiver.",
      lead: "Holokaarten flitsen voorbij. Is het een persoonsgegeven of niet? Hoe sneller en zuiverder je sorteert, hoe hoger je combo.",
      rules: [["40 seconden", "Sorteer zoveel mogelijk kaarten voordat de tijd op is."], ["Pijltjestoetsen", "← Geen persoonsgegeven, → Wel persoonsgegeven. Klikken mag ook."], ["Combo", "Elke drie goed op rij verhoogt je vermenigvuldiger tot ×4."]],
      thresholds: [8, 14, 20], unit: "goed", badge: "sorteer",
      learn: ["Herleidbaar tot één persoon? Dan is het een persoonsgegeven, ook via omwegen.", "Gegevens over een organisatie of een grote groep zijn dat meestal niet.", "Een kleine groep maakt herleiden makkelijk."] },
    poort: { short: "Poort", title: "Wie mag dit zien?", level: "Bonusronde bij level 3", after: 2, aria: "De lopende band in de ziekenboeg draait. Stuur elk pakketje door het juiste luik.",
      lead: "Informatie over zieke crewleden rolt over de lopende band. Stuur elk pakketje door het juiste luik voordat het van de band valt.",
      rules: [["Drie luiken", "Sectorchef, crewadministratie of scheepsarts. Toets 1, 2 of 3."], ["Steeds sneller", "Elk pakketje gaat iets harder. Te laat of verkeerd kost schild."], ["Drie schilden", "Bij nul schild is de ronde voorbij."]],
      thresholds: [6, 10, 13], unit: "goed", badge: "poortwachter",
      learn: ["De sectorchef hoort alleen wat nodig is voor het werk: duur en wat iemand nog kan.", "Diagnose, medicijnen en medische verslagen zijn alleen voor de scheepsarts.", "Regelingen, ongevallen en de ziekmelding zelf horen bij de crewadministratie."] },
    invaders: { short: "Invaders", title: "Phishing Invaders", level: "Bonusronde bij level 4", after: 3, aria: "De Zwarte Nevel vuurt nepberichten op het vrachtdok af. Laat alleen echte berichten landen.",
      lead: "De Zwarte Nevel vuurt nepberichten op het station af. Schiet de aanvallen neer, laat de echte berichten veilig landen.",
      rules: [["Klik om te schieten", "Klik op een nepbericht voordat het de basis raakt."], ["Niet op echte berichten", "Schiet je een echt bericht neer, dan kost dat schild."], ["60 seconden", "Het tempo loopt op. Combo's leveren meer punten op."]],
      thresholds: [120, 240, 360], unit: "punten", badge: "scherpschutter",
      learn: ["Let op afwijkende afzenders, vreemde adressen en onverwachte verzoeken.", "Spoed, geheimhouding of geld zijn signalen om te stoppen.", "Twijfel? Controleer via een andere weg, niet via het bericht zelf."] },
    lekken: { short: "Lekken", title: "Lekken dichten", level: "Bonusronde bij level 5", after: 4, aria: "Overal op het station gaan alarmen af. Meld elk lek voordat het wegloopt.",
      lead: "Overal op het station gaan alarmen af. Meld elk datalek voordat het wegloopt. Niet alles wat knippert is een lek.",
      rules: [["Klik om te melden", "Klik op een alarm om het direct te melden."], ["Geen lek?", "Laat het gaan. Melden levert dan niets op en je combo is weg."], ["45 seconden", "Een gemist lek kost schild. Bij nul schild is het voorbij."]],
      thresholds: [100, 200, 300], unit: "punten", badge: "lekdichter",
      learn: ["Gegevens bij de verkeerde ontvanger, kwijt of ingezien zonder reden: dat is een (mogelijk) datalek.", "Meld direct, ook aan het eind van je dienst. De 72 uur lopen door.", "Twijfel je? Meld het dan toch. Het meldpunt beoordeelt."] }
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
    sprint: { time: "40 seconden", lead: "Elke kaart noemt een gegeven. Jij beslist of je er een persoon mee kunt aanwijzen.",
      score: [["check", "Goed gesorteerd levert punten op"], ["zap", "Elke drie goed op rij telt zwaarder, tot keer 4"], ["clock", "Fout gesorteerd kost twee seconden en je combo"]],
      calm: "Staat Tijdsdruk uit, dan speel je 20 kaarten zonder klok.",
      demo: function () { return '<div class="gi-side">' + icon("x") + "<b>Geen persoonsgegeven</b><kbd>" + icon("aleft") + 'Pijl links</kbd></div><span class="gi-arrow">' + icon("aleft") + '</span><div class="gi-card">Loonstrook van de vorige bewoner</div><span class="gi-arrow">' + icon("aright") + '</span><div class="gi-side yes">' + icon("user") + "<b>Wel persoonsgegeven</b><kbd>" + icon("aright") + "Pijl rechts</kbd></div>"; } },
    poort: { time: "14 pakketjes", lead: "Informatie over zieke crewleden rolt over de band. Jij stuurt elk pakketje door het juiste luik.",
      score: [["check", "Het juiste luik levert punten op"], ["zap", "Elke drie goed op rij telt zwaarder, tot keer 4"], ["shield", "Verkeerd luik of te laat kost een schildcel"]],
      calm: "Staat Tijdsdruk uit, dan wacht het pakketje tot je kiest.",
      demo: function () { return '<div class="gi-card">Diagnose: rugblessure</div><span class="gi-arrow">' + icon("aright") + '</span><div class="gi-doors">' + DOORS.map(function (d, i) { return '<div class="gi-side' + (i === 2 ? " yes" : "") + '">' + icon(d[1]) + "<b>" + d[0].replace("Crewadmin", "Crew\u00adadmin") + "</b><kbd>Toets " + (i + 1) + "</kbd></div>"; }).join("") + "</div>"; } },
    invaders: { time: "60 seconden", lead: "Er vallen berichten naar het vrachtdok. Nepberichten schiet je neer, echte berichten laat je landen.",
      score: [["check", "Een nepbericht neerschieten levert punten op"], ["zap", "Elke drie goed op rij telt zwaarder, tot keer 4"], ["shield", "Een echt bericht raken of een nepbericht doorlaten kost een schildcel"]],
      calm: "Staat Tijdsdruk uit, dan vallen er 16 berichten in een rustig tempo.",
      demo: function () { return '<div class="gi-msg bad">' + icon("mail") + "<span><small>Van: “Kapitein Vega”, onbekend kanaal</small><b>Stuur met spoed de loonstrook</b></span><kbd>" + icon("target") + 'Klik: neerschieten</kbd></div><div class="gi-msg ok">' + icon("mail") + "<span><small>Van: Crewadministratie, crew@orion.space</small><b>Uitnodiging voor het oogstfeest</b></span><kbd>" + icon("check") + "Laat landen</kbd></div>"; } },
    lekken: { time: "45 seconden", lead: "In negen modules gaan alarmen af. Jij meldt elk datalek voordat de balk leeg is.",
      score: [["check", "Een datalek melden levert punten op"], ["zap", "Elke drie goed op rij telt zwaarder, tot keer 4"], ["shield", "Een gemist datalek kost een schildcel"]],
      calm: "Staat Tijdsdruk uit, dan krijg je 14 alarmen en loopt de balk niet af.",
      demo: function () { return '<div class="gi-msg bad">' + icon("alert") + "<span><small>Alarm in Crewadministratie</small><b>Loonstroken als bijlage naar de hele crew gestuurd</b></span><kbd>" + icon("target") + 'Klik: melden</kbd></div><div class="gi-msg ok">' + icon("alert") + "<span><small>Alarm in Kantine</small><b>Menu van de kantine gedeeld met de crew</b></span><kbd>" + icon("x") + "Geen datalek: laat gaan</kbd></div>"; } }
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
    var cells = document.querySelectorAll(".sky .base i"); for (var c = 0; c < cells.length; c++) cells[c].className = c < G.lives ? "" : "off";
  }
  function newG(id, seconds) {
    G = { id: id, done: 0, limit: ({ sprint: 20, invaders: 16, lekken: 14 })[id] || 0, score: 0, correct: 0, streak: 0, lives: 3, lostLife: false, left: seconds, total: seconds, over: false,
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
    ({ sprint: playSprint, poort: playPoort, invaders: playInvaders, lekken: playLekken })[id]();
  }

  function endGame() {
    if (!G || G.over) return;
    G.over = true;
    var id = G.id, g = GAMES[id], val = g.unit === "goed" ? G.correct : G.score;
    var s = val >= g.thresholds[2] ? 3 : val >= g.thresholds[1] ? 2 : val >= g.thresholds[0] ? 1 : 0;
    var prev = P.games[id] || {}, record = prev.score == null || val > prev.score;
    P.games[id] = { score: Math.max(val, prev.score || 0), stars: Math.max(s, prev.stars || 0) };
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
    if (!lost && val > 0 && id !== "sprint") award("zonderkras");
    if (Object.keys(GAMES).every(function (k) { return ((P.games[k] || {}).stars || 0) >= 2; })) award("arcadeheld");
    if (s > 0) { SFX.combo(); flash("gold"); }
  }

  /* ---------- 1. Holokaarten-sprint ---------- */
  var CARDS = [
    ["Naam van een crewlid", 1], ["Berichtenadres j.devries@orion.space", 1], ["Holofoto van een collega op het oogstfeest", 1], ["Crewnummer", 1],
    ["Locatiesignaal van iemands polsband", 1], ["Shuttleregistratie van een crewlid", 1], ["Schipregistratie van een zelfstandige handelaar", 1],
    ["Zuurstofverbruik van een module met drie bewoners", 1], ["Communicatornummer van een kolonist", 1], ["Stemopname van een crewlid", 1],
    ["Cv van een kandidaat", 1], ["Ziektedagen van een technicus", 1], ["Geboortedatum van een kolonist", 1], ["Vingerafdruk voor de toegangssluis", 1],
    ["Inlognaam van een crewlid", 1], ["Loonstrook van de vorige bewoner", 1],
    ["Algemeen kanaal brug@orion.space", 0], ["Vrachtschip van een handelsmaatschappij", 0], ["Gemiddeld zuurstofverbruik van het hele station", 0],
    ["Totale brandstofkosten van de kolonie", 0], ["Openingstijden van de kantine", 0], ["Menukaart van de kantine", 0], ["Stationsplattegrond", 0],
    ["Omzet van het Handelsgilde", 0], ["Weersverwachting voor Nova Terra", 0], ["Nieuwsbrief van de Datawacht", 0], ["Vertrektijden van de shuttles", 0]
  ];
  function playSprint() {
    newG("sprint", 40);
    var deck = shuffle(CARDS), idx = 0, lock = false;
    arcade.innerHTML = '<div class="ar-wrap"><section class="ar-panel">' + hudHtml() +
      '<p class="ar-brief">Persoonsgegeven of niet? Gebruik de pijltjes of klik op een vak.</p><div class="sprint"><button class="bin-btn no" id="b-no">' + icon("x") + 'Geen persoonsgegeven<kbd>←</kbd></button><div class="holo-wrap"><div class="holo" id="holo"></div><p class="ar-feed" id="g-feed" aria-live="polite"></p><div class="trail" id="trail" aria-hidden="true"></div></div><button class="bin-btn yes" id="b-yes">' + icon("user") + 'Wel persoonsgegeven<kbd>→</kbd></button></div>' +
      '</section></div>';
    var holo = document.getElementById("holo");
    function show() { if (idx >= deck.length) { deck = shuffle(CARDS); idx = 0; } holo.className = "holo"; holo.innerHTML = "<p>" + esc(deck[idx][0]) + "</p>"; }
    function answer(yes) {
      if (lock || !G || G.over) return;
      var c = deck[idx], ok = (c[1] === 1) === yes; G.done++;
      if (!ok) note("Holokaarten-sprint", c[0], yes ? "Wel persoonsgegeven" : "Geen persoonsgegeven", c[1] ? "Dit is wel een persoonsgegeven. Het is te herleiden tot één persoon, direct of via een omweg zoals een nummer, een locatie of een kleine groep." : "Dit is geen persoonsgegeven. Het gaat over een organisatie, een grote groep of iets algemeens en is niet tot één persoon te herleiden.", "fout");
      var tr = document.getElementById("trail"); if (tr) { var d = document.createElement("i"); d.className = ok ? "ok" : "nok"; tr.appendChild(d); while (tr.children.length > 14) tr.firstChild.remove(); }
      if (ok) { var pts = gGood(10); feed("+" + pts, "good"); lock = true; if (!reduce) holo.className = "holo " + (yes ? "fly-r" : "fly-l"); later(function () { idx++; lock = false; show(); }, reduce ? 0 : 230); }
      else { gBad(false); feed("Fout. Dit is " + (c[1] ? "wel" : "geen") + " persoonsgegeven.", "bad"); holo.className = "holo wrong"; lock = true; G.left -= 2; later(function () { idx++; lock = false; show(); }, 650); }
    }
    document.getElementById("b-no").onclick = function () { answer(false); };
    document.getElementById("b-yes").onclick = function () { answer(true); };
    document.onkeydown = function (e) { if (e.key === "ArrowLeft") { e.preventDefault(); answer(false); } if (e.key === "ArrowRight") { e.preventDefault(); answer(true); } };
    playfield(".sprint", "sprint");
    show(); gHud(); clock();
  }

  /* ---------- 2. Wie mag dit zien? ---------- */
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

  /* ---------- 3. Phishing Invaders ---------- */
  var MSGS = [
    ["“Stationstechniek”", "orion-support.net", "Reset je toegangscode via deze link", 1],
    ["“Kapitein Vega”", "onbekend kanaal", "Stuur met spoed de loonstrook", 1],
    ["Onbekende handelaar", "handel-x7.void", "Factuur in bijgevoegd datapakket", 1],
    ["“Centrale opslag”", "opslag-orion.co", "Je geheugen is vol, log hier in", 1],
    ["“Admiraliteit”", "admiraliteit.mail", "Koop in het geheim brandstofbonnen", 1],
    ["“Vrachtdienst”", "vracht-status.space", "Je pakket kon niet worden afgeleverd", 1],
    ["“ARIA-update”", "aria-updates.net", "Installeer de nieuwe versie via deze link", 1],
    ["“Crewadministratie”", "crew-admin.help", "Bevestig je identiteitsnummer via dit formulier", 1],
    ["“Kapitein Vega”", "vega.privé", "Niet doorvertellen: maak 5000 credits over", 1],
    ["ARIA", "aria@orion.space", "Dienstrooster voor morgen", 0],
    ["Luitenant Mira", "mira@orion.space", "Heb je morgen even tijd?", 0],
    ["Crewadministratie", "crew@orion.space", "Uitnodiging voor het oogstfeest", 0],
    ["Kapitein Vega", "vast kanaal Nova Terra", "Bedankt voor de controle", 0],
    ["Bram", "bram@orion.space", "Lunch om twaalf uur?", 0],
    ["ARIA", "aria@orion.space", "Onderhoud aan luchtsluis 3 om 14.00 uur", 0]
  ];
  function playInvaders() {
    newG("invaders", 60);
    arcade.innerHTML = '<div class="ar-wrap"><section class="ar-panel">' + hudHtml() +
      '<p class="ar-brief">Klik op een <b>nepbericht</b> om het neer te schieten. Laat <b>echte berichten</b> landen op de basis.</p><div class="sky" id="sky"><div class="base" aria-hidden="true"><i></i><i></i><i></i><svg class="turret" viewBox="0 0 64 40" aria-hidden="true"><path d="M32 2 L40 22 L60 30 L60 36 L40 33 L36 38 L28 38 L24 33 L4 36 L4 30 L24 22 Z" fill="#e2e8f0"/><path d="M32 8 L36 22 L28 22 Z" fill="#15aaff"/><path d="M4 30 L24 22 L24 33 L4 36 Z M60 30 L40 22 L40 33 L60 36 Z" fill="#90a1b9"/></svg></div></div>' +
      '<p class="ar-feed" id="g-feed" aria-live="polite"></p></section></div>';
    var sky = document.getElementById("sky"), live = [], spawnIn = 0.1, wave = 3, lanes = [0, 1, 2], lastLane = -1;
    playfield("#sky", "invaders");
    function shot(x, y, kind) { if (A3) A3.fire(x, y, kind); }
    function beam(x, y, cls) {
      if (reduce) return;
      var b = document.createElement("div"), bx = sky.clientWidth / 2, by = sky.clientHeight - 40, dx = x - bx, dy = y - by;
      b.className = "beam " + (cls || ""); b.style.left = bx + "px"; b.style.top = by + "px"; b.style.width = Math.hypot(dx, dy) + "px";
      b.style.transform = "rotate(" + Math.atan2(dy, dx) + "rad)"; sky.appendChild(b); later(function () { b.remove(); }, 220);
    }
    function fx2(cls, x, y, text) {
      if (cls !== "blue") beam(x, y, cls);
      var b = document.createElement("div"); b.className = "boom " + cls; b.style.left = x + "px"; b.style.top = y + "px"; sky.appendChild(b); later(function () { b.remove(); }, 450);
      if (text) { var f = document.createElement("div"); f.className = "float " + cls; f.textContent = text; f.style.left = (x - 20) + "px"; f.style.top = (y - 20) + "px"; sky.appendChild(f); later(function () { f.remove(); }, 820); }
    }
    function spawn() {
      var pool = MSGS.filter(function (x) { return !live.some(function (q) { return q.m === x; }); }), m = pool[Math.floor(Math.random() * pool.length)], lane;
      var free = lanes.filter(function (l) { return !live.some(function (q) { return q.lane === l && q.y < 150; }); });
      if (!free.length) { spawnIn = 0.25; return; }
      lane = free[Math.floor(Math.random() * free.length)];
      lastLane = lane;
      var el = document.createElement("button"); el.type = "button"; el.className = "inv";
      el.innerHTML = '<svg class="vcsw-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><span><small>Van: ' + esc(m[0]) + '</small><small class="dom">' + esc(m[1]) + "</small><b>" + esc(m[2]) + "</b></span>";
      el.setAttribute("aria-label", "Bericht van " + m[0] + ", " + m[1] + ": " + m[2] + ". Klik om neer te schieten.");
      el.style.left = (2 + lane * 33) + "%";
      var o = { el: el, m: m, lane: lane, y: 0, fake: m[3] === 1, v: (52 + (60 - G.left) * 1.6 + Math.random() * 14) * 0.9 * (P.calm ? 0.45 : 1) };
      el.onclick = function (e) {
        if (!G || G.over) return;
        var r = el.getBoundingClientRect(), sr = sky.getBoundingClientRect(), x = r.left - sr.left + r.width / 2, y = r.top - sr.top + r.height / 2;
        el.remove(); live = live.filter(function (q) { return q !== o; }); G.done++;
        if (o.fake) { shot(x, y, "hit"); var pts = gGood(15); SFX.zap(); fx2("", x, y, "+" + pts); feed("Raak. Dat was een aanval.", "good"); }
        else { note("Phishing Invaders", m[2], "Neergeschoten als nepbericht", "Dit was een echt bericht. " + m[0] + " schrijft via " + m[1] + ". Dat is een bekend kanaal, en het bericht vraagt niets ongewoons.", "fout"); shot(x, y, "wrong"); fx2("red", x, y, "Echt bericht"); feed("Dat was een echt bericht van " + m[0] + ".", "bad"); gBad(true); }
      };
      sky.appendChild(el); live.push(o);
    }
    gHud();
    clock(function (dt) {
      spawnIn -= dt;
      if (spawnIn <= 0) { spawn(); if (wave > 0) { wave--; spawnIn = 0.35; } else spawnIn = (Math.max(0.6, 1.5 - (60 - G.left) * 0.016) + Math.random() * 0.35) * 1.1; }
      var floor = sky.clientHeight - 46;
      live.slice().forEach(function (o) {
        if (!G || G.over) return;
        o.y += o.v * dt; o.el.style.transform = "translateY(" + o.y + "px)";
        if (o.y + o.el.offsetHeight >= floor) {
          o.el.remove(); live = live.filter(function (q) { return q !== o; });
          var x = o.el.offsetLeft + o.el.offsetWidth / 2; G.done++;
          if (o.fake) { note("Phishing Invaders", o.m[2], "Doorgelaten", "Dit was een nepbericht. Het komt van " + o.m[1] + " en niet van een kanaal van het station. Let ook op spoed, geheimhouding, geld of een link om in te loggen.", "fout"); shot(x, floor, "impact"); fx2("red", x, floor, "Aanval binnen"); feed("Een aanval kwam binnen.", "bad"); gBad(true); }
          else { shot(x, floor, "land"); G.score += 5; fx2("blue", x, floor, "+5"); gHud(); }
        }
      });
    });
  }

  /* ---------- 4. Lekken dichten ---------- */
  var MODS = ["Brug", "Ziekenboeg", "Vrachtdok", "Crewadministratie", "Passagiersmodule", "Kantine", "Archief", "Communicatie", "Hutten"];
  var EVENTS = [
    ["Verzuimoverzicht gemaild naar de verkeerde kolonie", 1], ["Console met klantgegevens gestolen", 1], ["Collega kijkt zonder reden in een medisch dossier", 1],
    ["Bestand met identiteitsnummers in een open kanaal gezet", 1], ["Loonstroken als bijlage naar de hele crew gestuurd", 1], ["Verdachte inlog op een crewaccount", 1],
    ["Datachip met cv's kwijtgeraakt", 1], ["Passagierslijst slingert bij de printer", 1], ["Holo-archief met dossiers zonder wachtwoord online", 1],
    ["Menu van de kantine gedeeld met de crew", 0], ["Nieuwsbrief verstuurd aan alle crewleden", 0], ["Stationsplattegrond opgehangen bij de lift", 0],
    ["Brandstofcijfers van de kolonie gepubliceerd", 0], ["Rooster van de schoonmaakdienst gewijzigd", 0]
  ];
  function playLekken() {
    newG("lekken", 45);
    arcade.innerHTML = '<div class="ar-wrap"><section class="ar-panel">' + hudHtml() +
      '<div class="grid9" id="grid">' + MODS.map(function (m, i) { return '<div class="mod" data-m="' + i + '"><span class="mname"><i aria-hidden="true"></i>' + esc(m) + '</span><span class="mstate"></span></div>'; }).join("") + "</div>" +
      '<p class="ar-feed" id="g-feed" aria-live="polite">Klik op een alarm om het lek te melden.</p></section></div>';
    var grid = document.getElementById("grid"), active = {}, spawnIn = 0.3;
    playfield("#grid", "lekken");
    function clear(i, cls) {
      var mod = grid.querySelector('[data-m="' + i + '"]'), ev = mod.querySelector(".ev"); if (ev) ev.remove(); delete active[i]; mod.classList.remove("ringing"); mod.querySelector(".mstate").textContent = cls === "sealed" ? "Gemeld" : cls === "breach" ? "Gemist" : "";
      if (cls) { mod.classList.add(cls); later(function () { mod.classList.remove(cls); if (!active[i]) mod.querySelector(".mstate").textContent = ""; }, 900); }
    }
    function spawn() {
      var free = MODS.map(function (_, i) { return i; }).filter(function (i) { return !active[i]; }); if (!free.length) return;
      var i = free[Math.floor(Math.random() * free.length)], e = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      var life = Math.max(3.0, 4.2 - (45 - G.left) * 0.03);
      var b = document.createElement("button"); b.type = "button"; b.className = "ev";
      b.innerHTML = '<span class="etext">' + esc(e[0]) + '</span><span class="bar2"><i></i></span>';
      b.setAttribute("aria-label", "Alarm in " + MODS[i] + ": " + e[0] + ". Klik om te melden.");
      active[i] = { leak: e[1] === 1, t: life, life: life, el: b, text: e[0] };
      b.onclick = function () {
        if (!G || G.over || !active[i]) return;
        var a = active[i]; G.done++;
        if (a.leak) { var pts = gGood(10); clear(i, "sealed"); feed("+" + pts + " · Gemeld: " + a.text + ".", "good"); }
        else { note("Lekken dichten", a.text, "Gemeld als lek", "Dit is geen datalek. Er zijn geen persoonsgegevens bij iemand terechtgekomen die ze niet mag zien.", "half"); G.streak = 0; SFX.half(); clear(i); feed("Geen datalek. Melden bij twijfel is altijd goed, maar dit was duidelijk geen lek.", ""); gHud(); }
      };
      var mod = grid.querySelector('[data-m="' + i + '"]'); mod.classList.add("ringing"); mod.querySelector(".mstate").textContent = "Alarm"; mod.appendChild(b);
    }
    gHud();
    clock(function (dt) {
      spawnIn -= dt;
      if (spawnIn <= 0) { if (!P.calm || Object.keys(active).length < 2) spawn(); spawnIn = Math.max(1.0, 1.5 - (45 - G.left) * 0.012); }
      Object.keys(active).forEach(function (k) {
        if (!G || G.over) return; var a = active[k]; if (!a) return; if (!P.calm) a.t -= dt;
        var bar = a.el.querySelector(".bar2 i"); if (bar) bar.style.transform = "scaleX(" + Math.max(0, a.t / a.life) + ")";
        if (a.t <= 0) {
          if (a.leak) { note("Lekken dichten", a.text, "Niet gemeld", "Dit is een mogelijk datalek. Persoonsgegevens zijn bij de verkeerde ontvanger beland, kwijtgeraakt of ingezien zonder reden. Meld het direct, het meldpunt beoordeelt.", "fout"); clear(k, "breach"); feed("Lek gemist: " + a.text + ".", "bad"); gBad(true); }
          else { clear(k); G.score += 2; gHud(); }
        }
      });
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

  /* ---------- Opening screen: explains the game while the station loads ---------- */
  (function () {
    var boot = document.getElementById("boot"); if (!boot) return;
    var rest = [document.querySelector("header.bar"), document.querySelector("main")];
    function close() { boot.hidden = true; document.body.classList.remove("booting"); rest.forEach(function (el) { if (el) el.inert = false; }); }
    var sel = document.getElementById("boot-user");
    sel.innerHTML = USERS.map(function (u) { return '<option value="' + u.id + '"' + (u.id === P.user ? " selected" : "") + ">" + esc(u.name) + " · " + esc(u.label) + ", " + esc(u.dept) + "</option>"; }).join("");
    function login() { P.user = sel.value; save(); paintUser(); }
    var gate = document.getElementById("gate"), stEl = document.getElementById("boot-status"), gT = [];
    function resetGate() { gT.forEach(clearTimeout); gT = []; boot.classList.remove("scan", "open", "out"); stEl.textContent = "Wacht op je pas"; }
    document.getElementById("user-btn").onclick = function () { resetGate(); boot.hidden = false; document.body.classList.add("booting"); boot.classList.add("relog"); rest.forEach(function (el) { if (el) el.inert = true; }); document.getElementById("boot-go").disabled = false; sel.focus(); };
    function enter() { close(); resetGate(); if (view === "admin" && !me().admin) showHome(); document.getElementById("start").focus({ preventScroll: true }); }
    document.getElementById("boot-go").onclick = function () {
      login(); boot.classList.add("ready");
      if (reduce) { enter(); return; }
      this.disabled = true; boot.classList.add("scan"); stEl.textContent = "Pas wordt gelezen";
      gT.push(setTimeout(function () { boot.classList.add("open"); stEl.textContent = "Welkom aan boord, " + me().name.split(" ")[0]; SFX.good(); }, 650));
      gT.push(setTimeout(function () { boot.classList.add("out"); }, 1500));
      gT.push(setTimeout(enter, 1950));
    };
    if (/[?&]boot=uit/.test(location.search)) { if (!P.user) P.user = USERS[0].id; paintUser(); close(); return; }
    var bar = document.getElementById("boot-bar"), st = document.getElementById("boot-status"), goBtn = document.getElementById("boot-go"), ready = false;
    rest.forEach(function (el) { if (el) el.inert = true; }); document.body.classList.add("booting");
    function prog(f) { bar.firstElementChild.style.width = Math.round(f * 100) + "%"; bar.setAttribute("aria-valuenow", Math.round(f * 100)); }
    function done(text) { if (ready) return; ready = true; prog(1); st.textContent = text; boot.classList.add("ready"); goBtn.disabled = false; goBtn.focus({ preventScroll: true }); }
    window.addEventListener("orion-load", function (e) { if (!ready) prog(e.detail * 0.9); });
    window.addEventListener("orion-station-ready", function () { done("Wacht op je pas"); });
    var iv = setInterval(function () { if (ready) { clearInterval(iv); return; } if (document.documentElement.classList.contains("no-3d")) done("Wacht op je pas. Je speelt zonder 3D-beeld."); }, 300);
    paintUser();
  })();

  /* ---------- Start ---------- */
  hud(); showHome(true);
})();
