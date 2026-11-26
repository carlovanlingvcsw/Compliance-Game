/* Orion game layer: reports each answered choice to the shell for combos and stars.
   Reads the page only; the level's own logic is untouched. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.setAttribute("data-theme", "dark");
  root.classList.add("orion-level");
  if (window.parent === window) return;
  root.classList.add("in-orion");
  /* Tijdsdruk uit: the shell stores the choice. Countdown timers of a level tick once a second, so those are held still. */
  function calm() { try { return !!JSON.parse(localStorage.getItem("orion-datawacht-v1") || "{}").calm; } catch (e) { return false; } }
  var realInterval = window.setInterval;
  window.setInterval = function (fn, ms) {
    if (ms !== 1000) return realInterval.apply(window, arguments);
    return realInterval.call(window, function () { if (!calm()) fn(); }, 1000);
  };
  function markCalm() { root.classList.toggle("calm", calm()); }
  markCalm(); window.addEventListener("storage", markCalm);
  var seen = {};
  function title() {
    var h = document.querySelector("#stage h2, #screen h2, #stage h1, main h2");
    return h ? h.textContent.trim() : "";
  }
  /* The explanation the level shows for the chosen answer, so the shell can offer it again under "Nalezen". */
  function clean(node) {
    var c = node.cloneNode(true);
    c.querySelectorAll(".key, .letter, .verdict, .vcsw-sr-only, .uitleg, .vcsw-badge, kbd").forEach(function (x) { x.remove(); });
    return c.textContent.replace(/\s+/g, " ").trim();
  }
  function why(el) {
    var n = document.querySelector("#fb .vcsw-alert[role=status] .vcsw-alert-text") || el.querySelector(".uitleg") || document.querySelector(".feedback .uitleg");
    if (n) return clean(n);
    var box = el.closest(".options"), said = "", alert = "";
    for (var s = box ? box.nextElementSibling : null; s; s = s.nextElementSibling) {
      if (s.matches(".actions, button")) break;
      var sp = s.matches(".speech-text") ? [s] : s.querySelectorAll(".speech-text"), al = s.matches(".vcsw-alert-text") ? s : s.querySelector(".vcsw-alert-text");
      if (sp.length) said = clean(sp[sp.length - 1]);
      if (al && !alert) alert = clean(al);
    }
    return said || alert;
  }
  function send(result, key, el) {
    if (seen[key]) return;
    seen[key] = true;
    var msg = { orion: "answer", result: result };
    if (el && result !== "goed") { msg.q = title(); msg.a = clean(el); msg.why = why(el); }
    try { window.parent.postMessage(msg, "*"); } catch (e) {}
  }
  function scan() {
    var t = title(), el, r;
    // While a question waits for an answer the level shows only the question: see html.asking in the theme.
    root.classList.toggle("asking", !!document.querySelector(".option:not([disabled]), .opt:not([disabled]), .choice:not([disabled])") && !document.querySelector(".option.picked, .option.chosen, .opt.chosen, .choice.picked"));
    // Level 1: .opt.chosen with goed/half/fout
    el = document.querySelector(".opt.chosen");
    if (el) { r = el.classList.contains("goed") ? "goed" : el.classList.contains("half") ? "half" : "fout"; send(r, t + "|" + el.textContent.trim().slice(0, 60), el); }
    // Level 4: .option.chosen with good/half/bad
    el = document.querySelector(".option.chosen");
    if (el) { r = el.classList.contains("good") ? "goed" : el.classList.contains("half") ? "half" : "fout"; send(r, t + "|" + el.textContent.trim().slice(0, 60), el); }
    // Levels 2, 5 and the final mission: .option.picked with a verdict badge
    el = document.querySelector(".option .verdict .vcsw-badge");
    if (el) { r = el.classList.contains("success") ? "goed" : el.classList.contains("warning") ? "half" : "fout"; send(r, t + "|" + el.closest(".option").textContent.trim().slice(0, 60), el.closest(".option")); }
    // Level 3: .choice.picked, verdict in the feedback
    el = document.querySelector(".choice.picked");
    if (el) {
      var v = document.querySelector("#fb .vcsw-alert[role=status], #fb .vcsw-alert.success, #fb .vcsw-alert.warning, #fb .vcsw-alert.error");
      if (v) { r = v.classList.contains("success") ? "goed" : v.classList.contains("warning") ? "half" : "fout"; send(r, t + "|" + el.textContent.trim().slice(0, 60), el); }
    }
    // Level reset: forget answers when the briefing shows again
    var ov = document.querySelector("#stage .vcsw-overline, #stage .overline, #stage .ov, #screen .vcsw-overline");
    if ((ov && /briefing/i.test(ov.textContent)) || document.querySelector(".title-screen")) seen = {};
  }
  /* Tell the shell how tall the content is, so the panel can end where the content ends.
     The answer may never depend on the height of the frame itself: the shell sets that height from this answer,
     so any link between the two makes the panel creep. Only the content counts: the lowest visible element plus
     the padding, border and margin of the boxes around it, read from the styles and not from where those boxes end. */
  var lastH = 0, sizeT = 0, floorSig = "", floorH = 0, floorN = 0;
  function measure() {
    var els = document.body.querySelectorAll("*"), max = 0, low = null, i, el, b, cs, pad = 0;
    for (i = 0; i < els.length; i++) { el = els[i]; if (el.children.length || !el.offsetParent) continue; b = el.getBoundingClientRect().bottom + window.pageYOffset; if (b > max) { max = b; low = el; } }
    for (el = low; el && el !== document.documentElement; el = el.parentElement) {
      cs = getComputedStyle(el);
      pad += (parseFloat(cs.marginBottom) || 0) + (el === low ? 0 : (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.borderBottomWidth) || 0));
    }
    var est = Math.ceil(max + Math.min(Math.max(pad, 0), 160)), sh = document.documentElement.scrollHeight, t = document.querySelector("h1, h2"),
      sig = (t ? t.textContent : "") + ":" + document.querySelectorAll("h1, h2, h3, button").length;
    if (sig !== floorSig) { floorSig = sig; floorH = 0; floorN = 0; }
    /* When the page still overflows its frame, the browser knows the exact height. It is taken over at most twice
       per screen and only when it is close to the estimate, so it can correct a small shortfall but never keep growing. */
    if (sh > window.innerHeight + 1 && sh > est && sh - est <= 160 && floorN < 2) { floorH = Math.max(floorH, sh); floorN++; }
    return Math.max(est, floorH);
  }
  function size() { clearTimeout(sizeT); sizeT = setTimeout(function () { var h = measure(); if (h && Math.abs(h - lastH) > 6) { lastH = h; try { window.parent.postMessage({ orion: "size", h: h }, "*"); } catch (e) {} } }, 140); }
  window.addEventListener("load", size); window.addEventListener("resize", size);
  /* The level's own state for the status bar of the shell. Each level offers window.orionStatus(). */
  var lastStatus = "";
  function status() {
    if (typeof window.orionStatus !== "function") return;
    var st; try { st = window.orionStatus(); } catch (e) { return; }
    var j = JSON.stringify(st); if (j === lastStatus) return; lastStatus = j;
    try { window.parent.postMessage({ orion: "status", s: st }, "*"); } catch (e) {}
  }
  /* A face for every person: the letter in a circle becomes a small drawing (concept, own artwork). */
  var FACES = {"aria": "<svg role=\"img\" aria-label=\"ARIA\" viewBox=\"0 0 96 96\"><circle cx=\"48\" cy=\"48\" r=\"48\" fill=\"#0c2f5f\"/><ellipse cx=\"48\" cy=\"50\" rx=\"30\" ry=\"24\" fill=\"#e8eef6\"/><ellipse cx=\"48\" cy=\"50\" rx=\"30\" ry=\"24\" fill=\"none\" stroke=\"#8fa0b8\" stroke-width=\"2\"/><circle cx=\"48\" cy=\"50\" r=\"13\" fill=\"#04142b\"/><circle cx=\"48\" cy=\"50\" r=\"8\" fill=\"#15aaff\"/><circle cx=\"45\" cy=\"47\" r=\"2.5\" fill=\"#fff\"/><rect x=\"10\" y=\"44\" rx=\"4\" fill=\"#8fa0b8\"/><rect x=\"76\" y=\"44\" rx=\"4\" fill=\"#8fa0b8\"/><path d=\"M48 26v-9\" stroke=\"#8fa0b8\" stroke-width=\"3\" stroke-linecap=\"round\"/><circle cx=\"48\" cy=\"15\" r=\"3\" fill=\"#ffb900\"/></svg>", "bram": "<svg role=\"img\" aria-label=\"Bram\" viewBox=\"0 0 96 96\"><circle cx=\"48\" cy=\"48\" r=\"48\" fill=\"#113e78\"/><path d=\"M12 96c2-18 16-26 36-26s34 8 36 26z\" fill=\"#d97a1e\"/><rect x=\"41\" y=\"58\" rx=\"5\" fill=\"#e2b48c\"/><ellipse cx=\"48\" cy=\"44\" rx=\"17\" ry=\"20\" fill=\"#e2b48c\"/><path d=\"M36 73l12 9 12-9\" fill=\"none\" stroke=\"rgba(255,255,255,.55)\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M30 38c0-11 8-17 18-17s18 6 18 17z\" fill=\"#1f4f85\"/><path d=\"M28 38h46c2 0 3 2 2 4H30z\" fill=\"#16335c\"/><path d=\"M33 50c1 12 7 17 15 17s14-5 15-17c-4 5-9 7-15 7s-11-2-15-7z\" fill=\"#5a3a22\"/><circle cx=\"41\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><circle cx=\"55\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/></svg>", "mira": "<svg role=\"img\" aria-label=\"Luitenant Mira\" viewBox=\"0 0 96 96\"><circle cx=\"48\" cy=\"48\" r=\"48\" fill=\"#0c2f5f\"/><path d=\"M12 96c2-18 16-26 36-26s34 8 36 26z\" fill=\"#0a6dbe\"/><rect x=\"41\" y=\"58\" rx=\"5\" fill=\"#c98f63\"/><ellipse cx=\"48\" cy=\"44\" rx=\"17\" ry=\"20\" fill=\"#c98f63\"/><path d=\"M36 73l12 9 12-9\" fill=\"none\" stroke=\"rgba(255,255,255,.55)\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"48\" cy=\"19\" r=\"8\" fill=\"#1d1a22\"/><path d=\"M31 44c-2-14 6-21 17-21s19 7 17 21c-3-8-8-12-17-12s-14 4-17 12z\" fill=\"#1d1a22\"/><circle cx=\"41\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><circle cx=\"55\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><path d=\"M43 54c3 2 7 2 10 0\" fill=\"none\" stroke=\"#1b1b22\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><path d=\"M30 46c0-12 8-20 18-20s18 8 18 20\" fill=\"none\" stroke=\"#e8eef6\" stroke-width=\"3\"/><rect x=\"26\" y=\"43\" rx=\"3\" fill=\"#e8eef6\"/><path d=\"M30 55c2 6 7 8 12 8\" fill=\"none\" stroke=\"#e8eef6\" stroke-width=\"2\"/></svg>", "vega": "<svg role=\"img\" aria-label=\"Kapitein Vega\" viewBox=\"0 0 96 96\"><circle cx=\"48\" cy=\"48\" r=\"48\" fill=\"#13264a\"/><path d=\"M12 96c2-18 16-26 36-26s34 8 36 26z\" fill=\"#182a44\"/><rect x=\"41\" y=\"58\" rx=\"5\" fill=\"#f0c9a6\"/><ellipse cx=\"48\" cy=\"44\" rx=\"17\" ry=\"20\" fill=\"#f0c9a6\"/><path d=\"M34 74l14 10 14-10\" fill=\"none\" stroke=\"#ffb900\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M31 42c-1-13 6-20 17-20s18 7 17 20c-4-7-9-10-17-10s-13 3-17 10z\" fill=\"#c9d3df\"/><circle cx=\"41\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><circle cx=\"55\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><path d=\"M43 54c3 2 7 2 10 0\" fill=\"none\" stroke=\"#1b1b22\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg>", "tessa": "<svg role=\"img\" aria-label=\"Tessa Moreau\" viewBox=\"0 0 96 96\"><circle cx=\"48\" cy=\"48\" r=\"48\" fill=\"#0b3a4a\"/><circle cx=\"28\" cy=\"36\" r=\"10\" fill=\"#231814\"/><circle cx=\"36\" cy=\"24\" r=\"10\" fill=\"#231814\"/><circle cx=\"48\" cy=\"20\" r=\"10\" fill=\"#231814\"/><circle cx=\"60\" cy=\"24\" r=\"10\" fill=\"#231814\"/><circle cx=\"68\" cy=\"36\" r=\"10\" fill=\"#231814\"/><circle cx=\"26\" cy=\"50\" r=\"10\" fill=\"#231814\"/><circle cx=\"70\" cy=\"50\" r=\"10\" fill=\"#231814\"/><path d=\"M12 96c2-18 16-26 36-26s34 8 36 26z\" fill=\"#168f8f\"/><rect x=\"41\" y=\"58\" rx=\"5\" fill=\"#8a5a3c\"/><ellipse cx=\"48\" cy=\"44\" rx=\"17\" ry=\"20\" fill=\"#8a5a3c\"/><path d=\"M36 73l12 9 12-9\" fill=\"none\" stroke=\"rgba(255,255,255,.55)\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M32 40c2-8 8-12 16-12s14 4 16 12c-5-3-10-5-16-5s-11 2-16 5z\" fill=\"#231814\"/><circle cx=\"41\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><circle cx=\"55\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><path d=\"M43 54c3 2 7 2 10 0\" fill=\"none\" stroke=\"#1b1b22\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg>", "lyra": "<svg role=\"img\" aria-label=\"Lyra Jansen\" viewBox=\"0 0 96 96\"><circle cx=\"48\" cy=\"48\" r=\"48\" fill=\"#22324a\"/><path d=\"M24 46c0-18 10-28 24-28s24 10 24 28v30H24z\" fill=\"#b5622e\"/><path d=\"M12 96c2-18 16-26 36-26s34 8 36 26z\" fill=\"#6b7f99\"/><rect x=\"41\" y=\"58\" rx=\"5\" fill=\"#f3d2b3\"/><ellipse cx=\"48\" cy=\"44\" rx=\"17\" ry=\"20\" fill=\"#f3d2b3\"/><path d=\"M36 73l12 9 12-9\" fill=\"none\" stroke=\"rgba(255,255,255,.55)\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M31 44c0-12 7-18 17-18s17 6 17 18c-5-6-10-9-17-9s-12 3-17 9z\" fill=\"#b5622e\"/><circle cx=\"41\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><circle cx=\"55\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><path d=\"M43 54c3 2 7 2 10 0\" fill=\"none\" stroke=\"#1b1b22\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><rect x=\"6\" y=\"6\" rx=\"14\" fill=\"none\" stroke=\"#67caff\" stroke-width=\"3\"/></svg>", "joran": "<svg role=\"img\" aria-label=\"Joran\" viewBox=\"0 0 96 96\"><circle cx=\"48\" cy=\"48\" r=\"48\" fill=\"#2a2f3a\"/><path d=\"M12 96c2-18 16-26 36-26s34 8 36 26z\" fill=\"#8fa0b8\"/><rect x=\"41\" y=\"58\" rx=\"5\" fill=\"#d9a77c\"/><ellipse cx=\"48\" cy=\"44\" rx=\"17\" ry=\"20\" fill=\"#d9a77c\"/><path d=\"M36 73l12 9 12-9\" fill=\"none\" stroke=\"rgba(255,255,255,.55)\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M31 42c-1-13 6-20 17-20s18 7 17 20c-4-7-9-10-17-10s-13 3-17 10z\" fill=\"#2b2b2b\"/><circle cx=\"41\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><circle cx=\"55\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><path d=\"M43 54c3 2 7 2 10 0\" fill=\"none\" stroke=\"#1b1b22\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><rect x=\"34\" y=\"40\" rx=\"3\" fill=\"none\" stroke=\"#e8eef6\" stroke-width=\"2\"/><rect x=\"51\" y=\"40\" rx=\"3\" fill=\"none\" stroke=\"#e8eef6\" stroke-width=\"2\"/><path d=\"M45 44h6\" stroke=\"#e8eef6\" stroke-width=\"2\"/></svg>", "orin": "<svg role=\"img\" aria-label=\"Orin Vale\" viewBox=\"0 0 96 96\"><g opacity=\".85\"><circle cx=\"48\" cy=\"48\" r=\"48\" fill=\"#06224c\"/><path d=\"M12 96c2-18 16-26 36-26s34 8 36 26z\" fill=\"#15aaff\"/><rect x=\"41\" y=\"58\" rx=\"5\" fill=\"#67caff\"/><ellipse cx=\"48\" cy=\"44\" rx=\"17\" ry=\"20\" fill=\"#67caff\"/><path d=\"M36 73l12 9 12-9\" fill=\"none\" stroke=\"rgba(255,255,255,.55)\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M31 42c-1-13 6-20 17-20s18 7 17 20c-4-7-9-10-17-10s-13 3-17 10z\" fill=\"#a1deff\"/><circle cx=\"41\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><circle cx=\"55\" cy=\"45\" r=\"2\" fill=\"#1b1b22\"/><path d=\"M43 54c3 2 7 2 10 0\" fill=\"none\" stroke=\"#1b1b22\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></g><path d=\"M0 10h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 18h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 26h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 34h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 42h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 50h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 58h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 66h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 74h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 82h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/><path d=\"M0 90h96\" stroke=\"#06224c\" stroke-width=\"2\" opacity=\".55\"/></svg>"};
  var WHO = [["ARIA", "aria"], ["Bram", "bram"], ["Mira", "mira"], ["Vega", "vega"], ["Tessa", "tessa"], ["Lyra", "lyra"], ["Joran", "joran"], ["Orin", "orin"]];
  function faces() {
    document.querySelectorAll(".vcsw-avatar:not([data-face]), .dialog .avatar:not([data-face]), .ox-av:not([data-face])").forEach(function (av) {
      av.setAttribute("data-face", "1");
      var box = av.closest(".ox-say, .speech, .dialog, .speaker, .msg, .mail, li, div") || av.parentNode, txt = (box.querySelector(".ox-say-name, .speech-who, .who, .name, strong, b") || box).textContent || "";
      for (var i = 0; i < WHO.length; i++) if (txt.indexOf(WHO[i][0]) !== -1) { av.innerHTML = FACES[WHO[i][1]]; av.classList.add("face"); av.style.padding = "0"; av.style.overflow = "hidden"; av.style.background = "none"; var svg = av.firstElementChild; if (svg) { svg.style.width = "100%"; svg.style.height = "100%"; svg.style.display = "block"; } return; }
    });
  }
  window.addEventListener("load", function () { status(); faces(); });
  var pending = false;
  new MutationObserver(function () {
    size(); status(); faces();
    if (pending) return;
    pending = true;
    setTimeout(function () { pending = false; scan(); }, 60);
  }).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
})();
