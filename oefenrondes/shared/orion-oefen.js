/* Ruimtestation Orion: koppeling tussen een oefenronde en de schil.
   Laadt voor mini.js. In de schil (iframe) verbergt het spel zijn eigen bovenbalk, gaat de knop
   "Verder in de route" terug naar de schil in plaats van naar de proefhal, en volgen Tijdsdruk en
   geluid de knoppen van de schil. Los geopend gaat de terugknop naar het station. */
(function () {
  "use strict";
  var embedded = window.parent !== window, root = document.documentElement;
  if (embedded) root.classList.add("in-shell");
  window.MINI_BACK = embedded ? "#route" : "../../index.html";
  window.MINI_BACK_LABEL = embedded ? "Verder in de route" : "Naar het station";

  /* The shell keeps its settings under one key. The engine keeps its own, so they are copied over before it starts. */
  function shell() { try { return JSON.parse(localStorage.getItem("orion-datawacht-v1") || "{}") || {}; } catch (e) { return {}; } }
  function put(k, v) { try { localStorage.setItem("proefhal-" + k, JSON.stringify(v)); } catch (e) {} }
  if (embedded) { var s = shell(); put("pressure", !s.calm); put("sound", !!s.sound); }

  /* A change in the shell while the round is open: press the engine's own (hidden) button so its state follows. */
  window.addEventListener("storage", function (e) {
    if (!embedded || e.key !== "orion-datawacht-v1") return;
    var s = shell(), p = document.querySelector("[data-pressure]"), snd = document.querySelector("[data-sound]");
    if (p && (p.getAttribute("aria-pressed") === "true") !== !s.calm) p.click();
    if (snd && (snd.getAttribute("aria-pressed") === "true") !== !!s.sound) snd.click();
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="#route"]');
    if (!a) return;
    e.preventDefault();
    try { window.parent.postMessage({ orion: "back" }, "*"); } catch (x) {}
  });
})();
