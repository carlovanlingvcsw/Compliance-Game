/* Orion game layer: reports each answered choice to the shell for combos and stars.
   Reads the page only; the level's own logic is untouched. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.setAttribute("data-theme", "dark");
  root.classList.add("orion-level");
  if (window.parent === window) return;
  root.classList.add("in-orion");
  var seen = {};
  function title() {
    var h = document.querySelector("#stage h2, #screen h2, #stage h1, main h2");
    return h ? h.textContent.trim() : "";
  }
  function send(result, key) {
    if (seen[key]) return;
    seen[key] = true;
    try { window.parent.postMessage({ orion: "answer", result: result }, "*"); } catch (e) {}
  }
  function scan() {
    var t = title(), el, r;
    // Level 1: .opt.chosen with goed/half/fout
    el = document.querySelector(".opt.chosen");
    if (el) { r = el.classList.contains("goed") ? "goed" : el.classList.contains("half") ? "half" : "fout"; send(r, t + "|" + el.textContent.trim().slice(0, 60)); }
    // Level 4: .option.chosen with good/half/bad
    el = document.querySelector(".option.chosen");
    if (el) { r = el.classList.contains("good") ? "goed" : el.classList.contains("half") ? "half" : "fout"; send(r, t + "|" + el.textContent.trim().slice(0, 60)); }
    // Levels 2, 5 and the final mission: .option.picked with a verdict badge
    el = document.querySelector(".option.picked .verdict .vcsw-badge");
    if (el) { r = el.classList.contains("success") ? "goed" : el.classList.contains("warning") ? "half" : "fout"; send(r, t + "|" + el.closest(".option").textContent.trim().slice(0, 60)); }
    // Level 3: .choice.picked, verdict in the feedback
    el = document.querySelector(".choice.picked");
    if (el) {
      var v = document.querySelector("#fb .vcsw-alert[role=status], #fb .vcsw-alert.success, #fb .vcsw-alert.warning, #fb .vcsw-alert.error");
      if (v) { r = v.classList.contains("success") ? "goed" : v.classList.contains("warning") ? "half" : "fout"; send(r, t + "|" + el.textContent.trim().slice(0, 60)); }
    }
    // Level reset: forget answers when the briefing shows again
    var ov = document.querySelector("#stage .vcsw-overline, #stage .overline, #stage .ov, #screen .vcsw-overline");
    if ((ov && /briefing/i.test(ov.textContent)) || document.querySelector(".title-screen")) seen = {};
  }
  var pending = false;
  new MutationObserver(function () {
    if (pending) return;
    pending = true;
    setTimeout(function () { pending = false; scan(); }, 60);
  }).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
})();
