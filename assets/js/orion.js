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
    { title: "Level 5: Hullbreuk! Alarmfase", name: "Hullbreuk! Alarmfase", short: "Hullbreuk", place: "Module Kepler", src: "levels/level-5-hullbreuk/index.html", module: 4, alarm: true,
      aria: "Alarm. Er lekken gegevens weg uit module Kepler. Nu telt elke minuut." },
    { title: "Eindmissie: Een bericht van de aarde", name: "Een bericht van de aarde", short: "Eindmissie", place: "Communicatietoren", src: "levels/eindmissie-bericht-van-de-aarde/index.html", module: 5,
      aria: "Er komt een bericht van de aarde binnen. Dit is je laatste missie als Kapitein van de Datawacht." }
  ];

  /* ---------- Icons (Lucide) ---------- */
  var IC = {
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
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
    check: '<path d="M20 6 9 17l-5-5"/>'
  };
  function icon(n) { return '<svg class="vcsw-icon" viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + "</svg>"; }
  var STAR = '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>';
  function stars(n) { var h = ""; for (var i = 0; i < 3; i++) h += '<svg viewBox="0 0 24 24" class="' + (i < n ? "star-on" : "star-off") + '" stroke-width="2" aria-hidden="true">' + STAR + "</svg>"; return h; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Saved progress (this browser only) ---------- */
  var KEY = "orion-datawacht-v1";
  var P = { xp: 0, best: 0, levelStars: {}, games: {}, badges: {}, opened: {}, sound: false, last: -1 };
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
    bad: function () { tone(180, 0.28, "sawtooth", 0.08); tone(120, 0.3, "sawtooth", 0.06, 0.08); },
    combo: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.14, "square", 0.06, i * 0.06); }); },
    badge: function () { [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, 0.22, "sine", 0.1, i * 0.09); }); },
    zap: function () { tone(880, 0.08, "square", 0.05); tone(440, 0.1, "square", 0.04, 0.04); },
    tick: function () { tone(1200, 0.04, "square", 0.03); }
  };


  /* ---------- Route: levels plus arcade rounds ---------- */
  var ROUTE = [
    { type: "level", n: 0 }, { type: "game", id: "sprint" },
    { type: "level", n: 1 },
    { type: "level", n: 2 }, { type: "game", id: "poort" },
    { type: "level", n: 3 }, { type: "game", id: "invaders" },
    { type: "level", n: 4 }, { type: "game", id: "lekken" },
    { type: "level", n: 5 }
  ];


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
    if (result === "goed") {
      var before = mult(); streak++; var m = mult(), gain = 100 * m;
      P.xp += gain; pop("+" + gain + (m > 1 ? "  ×" + m : "")); flash("good"); SFX.good();
      if (m > before) { setTimeout(function () { pop("Combo ×" + m, "gold"); flash("gold"); SFX.combo(); }, 250); }
      if (m >= 2) award("vonk"); if (streak >= 5) award("keten"); if (streak >= 10) award("onbreekbaar");
    } else if (result === "half") {
      P.xp += 40; streak = 0; pop("+40"); SFX.half();
    } else {
      streak = 0; pop("Combo verloren", "bad"); flash("bad"); shake(); SFX.bad();
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
  function label(r) { return r.type === "level" ? LEVELS[r.n] : GAMES[r.id]; }
  function rStars(r) { return r.type === "level" ? (P.levelStars[r.n] || 0) : ((P.games[r.id] || {}).stars || 0); }
  function num(r) { return r.type === "level" ? (r.n === 5 ? "E" : String(r.n + 1)) : icon("zap"); }
  function renderRoute() {
    routeEl.innerHTML = ROUTE.map(function (r, i) {
      var L = label(r);
      return '<li><button type="button" class="node' + (r.type === "game" ? " bonus" : "") + '" data-i="' + i + '"' + (i === cur ? ' aria-current="step"' : "") +
        ' title="' + esc(L.title) + '"><span class="num">' + num(r) + '</span><span class="nm">' + esc(L.short) + '</span><span class="stars" role="img" aria-label="' + rStars(r) + ' van 3 sterren">' + stars(rStars(r)) + "</span></button></li>";
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
      return '<button type="button" class="hot" data-i="' + routeIndexOfLevel(n) + '" data-m="' + L.module + '" tabindex="-1" aria-hidden="true"><span class="dot"></span><span class="lead"></span><span class="tag">' + (n === 5 ? "E" : n + 1) + " · " + esc(L.place) + "</span></button>";
    }).join("");
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
    var pts = S.project(), btns = hotEl.children;
    LEVELS.forEach(function (L, n) {
      var p = pts[L.module], b = btns[n]; if (!p || !b) return;
      b.style.transform = "translate(" + Math.round(p.x) + "px," + Math.round(p.y) + "px)";
      b.classList.toggle("behind", !p.front);
    });
  }

  /* ---------- Station link ---------- */
  function station(fn) { if (window.OrionStation) fn(window.OrionStation); }
  window.addEventListener("orion-station-ready", function () {
    station(function (S) { S.onFrame(placeHotspots); syncStation(); });
  });
  function syncStation() {
    station(function (S) {
      if (view === "home") { S.focus(-1, window.innerWidth > 900 ? "right" : null); S.alarm(false); S.lowPower(false); return; }
      var r = ROUTE[cur], L = r.type === "level" ? LEVELS[r.n] : LEVELS[GAMES[r.id].after];
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
    stopGame();
    view = "home"; cur = -1;
    document.body.setAttribute("data-view", "home");
    homeEl.hidden = false; missionEl.hidden = true;
    frames.forEach(function (f) { if (f) f.hidden = true; });
    document.title = "AVG-game Ruimtestation Orion";
    renderRoute(); syncStation();
    if (quiet !== true) document.getElementById("start").focus({ preventScroll: true });
  }
  document.getElementById("to-map").onclick = function () { showHome(); };
  document.getElementById("home-btn").onclick = function () { showHome(); };

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.orion !== "answer") return;
    for (var n = 0; n < frames.length; n++) if (frames[n] && frames[n].contentWindow === e.source) onAnswer(n, e.data.result);
  });
  function loadFrame(n) {
    var f = document.createElement("iframe");
    f.title = LEVELS[n].title;
    f.src = LEVELS[n].src;
    stageEl.insertBefore(f, fx);
    return f;
  }
  function go(i) {
    if (i < 0 || i >= ROUTE.length) return;
    stopGame();
    var r = ROUTE[i], first = view !== "mission";
    cur = i; view = "mission"; P.last = i;
    document.body.setAttribute("data-view", "mission");
    homeEl.hidden = true; missionEl.hidden = false;
    frames.forEach(function (f) { if (f) f.hidden = true; });
    var L = r.type === "level" ? LEVELS[r.n] : LEVELS[GAMES[r.id].after];
    document.getElementById("m-title").textContent = L.place;
    document.getElementById("m-place").textContent = label(r).title;
    document.getElementById("m-aria").textContent = r.type === "level" ? L.aria : GAMES[r.id].aria;
    if (r.type === "level") {
      arcade.hidden = true;
      if (!frames[r.n]) frames[r.n] = loadFrame(r.n);
      frames[r.n].hidden = false;
      P.opened[r.n] = 1; if (Object.keys(P.opened).length >= 6) award("ontdekker");
    } else {
      arcade.hidden = false; arcade.scrollTop = 0; gameIntro(r.id);
      document.body.setAttribute("data-view", "arcade");
    }
    save();
    document.getElementById("prev").disabled = i === 0;
    document.getElementById("next").disabled = i === ROUTE.length - 1;
    document.title = label(r).title + " · AVG-game Ruimtestation Orion";
    renderRoute(); syncStation();
    var node = routeEl.querySelector('[data-i="' + i + '"]'); if (node) node.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (first) missionEl.focus({ preventScroll: true });
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
  function stopGame() { if (loop) cancelAnimationFrame(loop); loop = null; timers.forEach(clearTimeout); timers = []; document.onkeydown = null; G = null; }

  function gameIntro(id) {
    var g = GAMES[id], best = P.games[id] || {};
    arcade.innerHTML = '<div class="ar-wrap"><section class="ar-panel">' +
      '<h1 class="ar-title">' + esc(g.title) + '</h1><p class="ar-meta">' + esc(g.level) + '</p><p class="ar-lead">' + esc(g.lead) + "</p>" +
      '<div class="ar-rules">' + g.rules.map(function (r) { return '<div class="ar-rule"><b>' + esc(r[0]) + "</b><span>" + esc(r[1]) + "</span></div>"; }).join("") + "</div>" +
      '<div class="ar-actions"><button class="btn-go" id="g-start">' + icon("play") + "Start de ronde</button>" +
      '<span class="ar-best">' + (best.score != null ? "Je record: <b>" + best.score + " " + g.unit + "</b> " + '<span class="stars" style="display:inline-flex;vertical-align:-2px">' + stars(best.stars || 0) + "</span>" : "Nog niet gespeeld. Drie sterren bij " + g.thresholds[2] + " " + g.unit + ".") + "</span></div>" +
      "</section></div>";
    document.getElementById("g-start").onclick = function () { startGame(id); };
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
    document.getElementById("g-time").textContent = Math.max(0, Math.ceil(G.left));
    document.getElementById("g-tbar").style.width = Math.max(0, G.left / G.total * 100) + "%";
    document.getElementById("g-lives").innerHTML = [0, 1, 2].map(function (i) { return '<i class="' + (i < G.lives ? "" : "off") + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg></i>'; }).join("");
    var cells = document.querySelectorAll(".sky .base i"); for (var c = 0; c < cells.length; c++) cells[c].className = c < G.lives ? "" : "off";
  }
  function newG(id, seconds) {
    G = { id: id, score: 0, correct: 0, streak: 0, lives: 3, lostLife: false, left: seconds, total: seconds, over: false,
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
      G.left -= dt; if (onTick) onTick(dt, now);
      if (!G || G.over) return;
      if (G.left <= 0) { G.left = 0; gHud(); endGame(); return; }
      gHud(); loop = requestAnimationFrame(frame);
    }
    loop = requestAnimationFrame(frame);
  }

  function startGame(id) {
    stopGame();
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
      '<div class="ar-actions"><button class="btn-ghost" id="g-again">' + icon("refresh") + 'Nog een keer</button><button class="btn-go" id="g-next">Verder' + icon("right") + "</button></div>" +
      "</div></section></div>";
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
    ["Inlognaam van een crewlid", 1], ["Soldijoverzicht van de vorige bewoner", 1],
    ["Algemeen kanaal brug@orion.space", 0], ["Vrachtschip van een handelsmaatschappij", 0], ["Gemiddeld zuurstofverbruik van het hele station", 0],
    ["Totale brandstofkosten van de kolonie", 0], ["Openingstijden van de kantine", 0], ["Menukaart van de kantine", 0], ["Stationsplattegrond", 0],
    ["Omzet van het Handelsgilde", 0], ["Weersverwachting voor Nova Terra", 0], ["Nieuwsbrief van de Datawacht", 0], ["Vertrektijden van de shuttles", 0]
  ];
  function playSprint() {
    newG("sprint", 40);
    var deck = shuffle(CARDS), idx = 0, lock = false;
    arcade.innerHTML = '<div class="ar-wrap"><section class="ar-panel">' + hudHtml() +
      '<p class="ar-brief">Persoonsgegeven of niet? Gebruik de pijltjes of klik op een vak.</p><div class="sprint"><button class="bin-btn no" id="b-no">' + icon("x") + 'Geen persoonsgegeven<kbd>←</kbd></button><div class="holo-wrap"><div class="holo" id="holo"></div><p class="ar-feed" id="g-feed" aria-live="polite"></p></div><button class="bin-btn yes" id="b-yes">' + icon("user") + 'Wel persoonsgegeven<kbd>→</kbd></button></div>' +
      '</section></div>';
    var holo = document.getElementById("holo");
    function show() { if (idx >= deck.length) { deck = shuffle(CARDS); idx = 0; } holo.className = "holo"; holo.innerHTML = "<p>" + esc(deck[idx][0]) + "</p>"; }
    function answer(yes) {
      if (lock || !G || G.over) return;
      var c = deck[idx], ok = (c[1] === 1) === yes;
      if (ok) { var pts = gGood(10); feed("+" + pts, "good"); lock = true; if (!reduce) holo.className = "holo " + (yes ? "fly-r" : "fly-l"); later(function () { idx++; lock = false; show(); }, reduce ? 0 : 230); }
      else { gBad(false); feed("Fout. Dit is " + (c[1] ? "wel" : "geen") + " persoonsgegeven.", "bad"); holo.className = "holo wrong"; lock = true; G.left -= 2; later(function () { idx++; lock = false; show(); }, 650); }
    }
    document.getElementById("b-no").onclick = function () { answer(false); };
    document.getElementById("b-yes").onclick = function () { answer(true); };
    document.onkeydown = function (e) { if (e.key === "ArrowLeft") { e.preventDefault(); answer(false); } if (e.key === "ArrowRight") { e.preventDefault(); answer(true); } };
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
      belt.innerHTML = ""; belt.appendChild(active); feed("Pakketje " + (idx + 1) + " van " + list.length + ": " + list[idx][0]);
    }
    function decide(d) {
      if (!active || !G || G.over) return;
      var p = list[idx], ok = p[1] === d, btn = document.querySelector('.door[data-d="' + d + '"]');
      btn.classList.add(ok ? "ok" : "nok"); later(function () { btn.classList.remove("ok", "nok"); }, 350);
      active = null; idx++; speed += 14;
      if (ok) { var pts = gGood(10); feed("+" + pts + " · Juist luik.", "good"); }
      else { feed("Verkeerd luik. Dit hoort bij de " + DOORS[p[1]][0].toLowerCase() + ".", "bad"); gBad(true); }
      later(next, 350);
    }
    document.querySelectorAll(".door").forEach(function (b) { b.onclick = function () { decide(+b.getAttribute("data-d")); }; });
    document.onkeydown = function (e) { if (e.key === "1" || e.key === "2" || e.key === "3") decide(+e.key - 1); };
    next();
    G.left = 999; G.total = 999;
    clock(function (dt) {
      G.left = 999;
      document.getElementById("g-time").textContent = Math.min(idx + 1, list.length) + "/" + list.length;
      document.getElementById("g-tbar").style.width = (idx / list.length * 100) + "%";
      if (!active) return;
      x += speed * dt; active.style.transform = "translateX(" + x + "px)";
      if (x > beltW - 60) {
        var p = list[idx]; active.remove(); active = null; idx++; speed += 14;
        feed("Te laat. Dit hoorde bij de " + DOORS[p[1]][0].toLowerCase() + ".", "bad"); gBad(true); later(next, 450);
      }
    });
  }

  /* ---------- 3. Phishing Invaders ---------- */
  var MSGS = [
    ["“Stationstechniek”", "orion-support.net", "Reset je toegangscode via deze link", 1],
    ["“Kapitein Vega”", "onbekend kanaal", "Stuur met spoed het soldijoverzicht", 1],
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
      var m = MSGS[Math.floor(Math.random() * MSGS.length)], lane;
      do { lane = lanes[Math.floor(Math.random() * 3)]; } while (lane === lastLane && Math.random() < 0.7);
      lastLane = lane;
      var el = document.createElement("button"); el.type = "button"; el.className = "inv";
      el.innerHTML = '<svg class="vcsw-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><span><small>Van: ' + esc(m[0]) + " · " + esc(m[1]) + "</small><b>" + esc(m[2]) + "</b></span>";
      el.setAttribute("aria-label", "Bericht van " + m[0] + ", " + m[1] + ": " + m[2] + ". Klik om neer te schieten.");
      el.style.left = (2 + lane * 33) + "%";
      var o = { el: el, y: 10, fake: m[3] === 1, v: 52 + (60 - G.left) * 1.6 + Math.random() * 14 };
      el.onclick = function (e) {
        if (!G || G.over) return;
        var r = el.getBoundingClientRect(), sr = sky.getBoundingClientRect(), x = r.left - sr.left + r.width / 2, y = r.top - sr.top + r.height / 2;
        el.remove(); live = live.filter(function (q) { return q !== o; });
        if (o.fake) { var pts = gGood(15); SFX.zap(); fx2("", x, y, "+" + pts); feed("Raak. Dat was een aanval.", "good"); }
        else { fx2("red", x, y, "Echt bericht"); feed("Dat was een echt bericht van " + m[0] + ".", "bad"); gBad(true); }
      };
      sky.appendChild(el); live.push(o);
    }
    gHud();
    clock(function (dt) {
      spawnIn -= dt;
      if (spawnIn <= 0) { spawn(); if (wave > 0) { wave--; spawnIn = 0.35; } else spawnIn = Math.max(0.6, 1.5 - (60 - G.left) * 0.016) + Math.random() * 0.35; }
      var floor = sky.clientHeight - 46;
      live.slice().forEach(function (o) {
        if (!G || G.over) return;
        o.y += o.v * dt; o.el.style.transform = "translateY(" + o.y + "px)";
        if (o.y + o.el.offsetHeight >= floor) {
          o.el.remove(); live = live.filter(function (q) { return q !== o; });
          var x = o.el.offsetLeft + o.el.offsetWidth / 2;
          if (o.fake) { fx2("red", x, floor, "Aanval binnen"); feed("Een aanval kwam binnen.", "bad"); gBad(true); }
          else { G.score += 5; fx2("blue", x, floor, "+5"); gHud(); }
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
      '<div class="grid9" id="grid">' + MODS.map(function (m, i) { return '<div class="mod" data-m="' + i + '"><span class="mname">' + esc(m) + "</span></div>"; }).join("") + "</div>" +
      '<p class="ar-feed" id="g-feed" aria-live="polite">Klik op een alarm om het lek te melden.</p></section></div>';
    var grid = document.getElementById("grid"), active = {}, spawnIn = 0.3;
    function clear(i, cls) {
      var mod = grid.querySelector('[data-m="' + i + '"]'), ev = mod.querySelector(".ev"); if (ev) ev.remove(); delete active[i];
      if (cls) { mod.classList.add(cls); later(function () { mod.classList.remove(cls); }, 420); }
    }
    function spawn() {
      var free = MODS.map(function (_, i) { return i; }).filter(function (i) { return !active[i]; }); if (!free.length) return;
      var i = free[Math.floor(Math.random() * free.length)], e = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      var life = Math.max(1.9, 3.6 - (45 - G.left) * 0.04);
      var b = document.createElement("button"); b.type = "button"; b.className = "ev";
      b.innerHTML = '<span class="tag">Alarm</span>' + esc(e[0]) + '<span class="bar2"><i></i></span>';
      b.setAttribute("aria-label", "Alarm in " + MODS[i] + ": " + e[0] + ". Klik om te melden.");
      active[i] = { leak: e[1] === 1, t: life, life: life, el: b, text: e[0] };
      b.onclick = function () {
        if (!G || G.over || !active[i]) return;
        var a = active[i];
        if (a.leak) { var pts = gGood(10); clear(i, "sealed"); feed("+" + pts + " · Gemeld: " + a.text + ".", "good"); }
        else { G.streak = 0; SFX.half(); clear(i); feed("Geen datalek. Melden bij twijfel is altijd goed, maar dit was duidelijk geen lek.", ""); gHud(); }
      };
      grid.querySelector('[data-m="' + i + '"]').appendChild(b);
    }
    gHud();
    clock(function (dt) {
      spawnIn -= dt;
      if (spawnIn <= 0) { spawn(); spawnIn = Math.max(0.55, 1.3 - (45 - G.left) * 0.017); }
      Object.keys(active).forEach(function (k) {
        if (!G || G.over) return; var a = active[k]; if (!a) return; a.t -= dt;
        var bar = a.el.querySelector(".bar2 i"); if (bar) bar.style.transform = "scaleX(" + Math.max(0, a.t / a.life) + ")";
        if (a.t <= 0) {
          if (a.leak) { clear(k, "breach"); feed("Lek gemist: " + a.text + ".", "bad"); gBad(true); }
          else { clear(k); G.score += 2; gHud(); }
        }
      });
    });
  }


  /* ---------- Start ---------- */
  hud(); showHome(true);
})();
