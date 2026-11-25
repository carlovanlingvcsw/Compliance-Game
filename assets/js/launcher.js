(function () {
  "use strict";
  /* Add, remove or reorder levels here. src points to the level's own page. */
  var LEVELS = [
    { tag: "Level 1", name: "Aankomst op het station", src: "levels/level-1-aankomst/index.html" },
    { tag: "Level 2", name: "De passagiersmodule", src: "levels/level-2-passagiersmodule/index.html" },
    { tag: "Level 3", name: "De medische ziekenboeg", src: "levels/level-3-ziekenboeg/index.html" },
    { tag: "Level 4", name: "Het vrachtdok", src: "levels/level-4-vrachtdok/index.html" },
    { tag: "Level 5", name: "Hullbreuk! Alarmfase", src: "levels/level-5-hullbreuk/index.html" },
    { tag: "Eindmissie", name: "Een bericht van de aarde", src: "levels/eindmissie-bericht-van-de-aarde/index.html" }
  ];
  var frames = [], cur = -1;
  var list = document.getElementById("levels"), stage = document.getElementById("stage");
  list.innerHTML = LEVELS.map(function (l, i) {
    return '<li><button type="button" data-i="' + i + '">' + l.tag + ' <span class="sub">' + l.name + "</span></button></li>";
  }).join("");
  function go(i) {
    if (i < 0 || i >= LEVELS.length) return;
    if (!frames[i]) {
      var f = document.createElement("iframe");
      f.title = LEVELS[i].tag + ": " + LEVELS[i].name;
      f.src = LEVELS[i].src;
      stage.appendChild(f);
      frames[i] = f;
    }
    frames.forEach(function (f, k) { if (f) f.hidden = k !== i; });
    cur = i;
    list.querySelectorAll("button").forEach(function (b) {
      if (+b.getAttribute("data-i") === i) { b.setAttribute("aria-current", "true"); b.scrollIntoView({ block: "nearest", inline: "nearest" }); }
      else b.removeAttribute("aria-current");
    });
    document.getElementById("prev").disabled = i === 0;
    document.getElementById("next").disabled = i === LEVELS.length - 1;
    document.title = LEVELS[i].tag + ": " + LEVELS[i].name + " · AVG-game Ruimtestation Orion";
  }
  list.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) go(+b.getAttribute("data-i")); });
  document.getElementById("prev").onclick = function () { go(cur - 1); };
  document.getElementById("next").onclick = function () { go(cur + 1); };
  go(0);
})();
