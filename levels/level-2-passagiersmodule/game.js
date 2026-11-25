/* Level 2: De passagiersmodule. Game logic and content of this level. */
(function () {
  "use strict";

  /* ---------- Icons (Lucide, outline) ---------- */
  var I = {
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    ok: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    bad: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    next: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    gem: '<path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'
  };
  function icon(name, cls) { return '<svg class="vcsw-icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + I[name] + "</svg>"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Personages ---------- */
  var WHO = {
    aria: { name: "ARIA", role: "boordcomputer", av: "A", cls: "av-aria" },
    mira: { name: "Luitenant Mira", role: "crewadministratie", av: "M", cls: "av-mira" },
    bram: { name: "Bram", role: "monteur", av: "B", cls: "av-bram" },
    vega: { name: "Kapitein Vega", role: "kolonie Nova Terra", av: "V", cls: "av-vega" },
    kand: { name: "Orin Vale", role: "oud-crewlid, als hologram", av: "O", cls: "av-kand" }
  };
  function speech(who, text) {
    var w = WHO[who];
    return '<div class="speech"><span class="vcsw-avatar ' + w.cls + '" aria-hidden="true">' + w.av + '</span><div><div class="speech-who">' + w.name + ' <span class="speech-role">' + w.role + '</span></div><p class="speech-text">' + esc(text) + "</p></div></div>";
  }

  /* ---------- Inhoud level 2 ---------- */
  var SITS = [
    {
      title: "Het nieuwe crewlid", who: "mira",
      intro: "Sanne Vrij begint maandag als crewlid van Orion.",
      say: "Ik heb Sannes BSN, haar adres en een kopie van haar paspoort. Bram stelt voor om haar BSN ook als inlogcode voor het stationssysteem te gebruiken. Ze vindt het zelf prima.",
      opts: [
        { k: "A", t: "“Handig, dan hoeft ze niets nieuws te onthouden.”", r: "fout",
          uitleg: "Het BSN gebruik je alleen waar de wet dat voorschrijft. Een inlogcode hoort daar niet bij, ook niet als Sanne het goed vindt.",
          reactie: "Ingesteld. Wie over haar schouder meekijkt, ziet nu haar BSN.",
          memo: "BSN van Sanne als inlogcode in het stationssysteem" },
        { k: "B", t: "“Het BSN en de paspoortkopie gaan alleen in de soldijadministratie, omdat de wet dat eist. Voor het systeem krijgt ze een eigen inlogcode.”", r: "goed",
          uitleg: "De wet verplicht het station om een nieuw crewlid te identificeren en het BSN te gebruiken voor de soldijaangifte. Daarbuiten gebruik je het BSN niet.",
          reactie: "Dan maak ik een gewone inlogcode aan en bewaar ik de kopie beveiligd in de soldijadministratie." },
        { k: "C", t: "“Haar BSN en paspoort leggen we niet vast. Dat is te gevoelig.”", r: "half",
          uitleg: "Voorzichtig, maar de wet verplicht het station juist om ze vast te leggen in de soldijadministratie.",
          reactie: "Dan kan de soldijadministratie haar niet aanmelden. Krijgt ze dan wel betaald?" }
      ],
      crystal: { on: "B", name: "BSN-regel", desc: "Het BSN alleen waar de wet het voorschrijft. Toestemming verandert dat niet." }
    },
    {
      title: "De ziekmelding", who: "mira",
      intro: "Crewlid Kai Lindqvist belt zich ziek.",
      say: "Zijn teamleider wil weten wat Kai heeft, zodat het in het rooster kan. En Bram zegt dat we Kai gewoon om toestemming kunnen vragen om alles vast te leggen.",
      opts: [
        { k: "A", t: "De diagnose in het rooster zetten, zodat iedereen weet waarom hij er niet is.", r: "fout",
          uitleg: "De diagnose is medische informatie. Die legt het station niet vast en deelt het zeker niet met het team.",
          reactie: "Gedaan. Het hele team ziet nu wat hij heeft.",
          memo: "Diagnose van Kai in het rooster" },
        { k: "B", t: "Alleen vastleggen wat nodig is voor zijn soldij en begeleiding: bereikbaarheid, verpleegadres, verwachte duur en lopende taken. Het team hoort alleen dat hij er niet is en wie zijn taken overneemt.", r: "goed",
          uitleg: "De wet verplicht het station om soldij door te betalen en een ziek crewlid te begeleiden. Daarom mag het de gegevens verwerken die daarvoor nodig zijn. Meer niet.",
          reactie: "Dan noteer ik zijn verpleegadres en de verwachte duur. De rest is voor de scheepsarts." },
        { k: "C", t: "Kai om toestemming vragen om zijn diagnose vast te leggen.", r: "fout",
          uitleg: "Een crewlid zegt moeilijk nee tegen zijn werkgever, dus die toestemming is niet vrij. En de diagnose legt het station ook mét toestemming niet vast.",
          reactie: "Hij zei ja, maar hij klonk niet alsof hij durfde te weigeren." }
      ],
      crystal: { on: "B", name: "Wettelijke plicht", desc: "Bij ziekte alleen wat nodig is voor soldij en begeleiding. De diagnose blijft bij de scheepsarts." }
    },
    {
      title: "Bloemen voor Kai", who: "bram",
      say: "Kai is al twee weken ziek. Geef me even zijn adres uit de administratie, dan stuur ik namens het team bloemen. Ik zet het meteen op de verjaardagslijst.",
      opts: [
        { k: "A", t: "Het adres uit de administratie doorgeven.", r: "fout",
          uitleg: "Het adres staat in de administratie voor de soldij en de verzuimbegeleiding. Doorgeven aan een collega is een ander doel.",
          reactie: "Top. Dan staat het straks ook op de verjaardagslijst, heeft iedereen het.",
          memo: "Adres van Kai doorgegeven aan Bram en op de verjaardagslijst" },
        { k: "B", t: "Kai zelf laten weten of hij bloemen of bezoek wil, en waar dat heen kan. Het adres uit de administratie geef je niet door.", r: "goed",
          uitleg: "Een gegeven gebruik je alleen voor het doel waarvoor je het kreeg. Kai beslist zelf of hij zijn adres aan het team geeft.",
          reactie: "Goed, ik stuur hem een bericht. Dan kiest hij zelf." },
        { k: "C", t: "Bram zeggen dat dat niet mag, en verder niets.", r: "half",
          uitleg: "Niet doorgeven klopt, maar je kunt Kai ook zelf laten kiezen.",
          reactie: "Jammer. Dan maar geen bloemen." }
      ],
      crystal: { on: "B", name: "Doelbinding", desc: "Een gegeven gebruik je alleen voor het doel waarvoor je het kreeg." }
    },
    {
      title: "Het verzuimoverzicht", who: "vega",
      intro: "Kai wil overstappen naar de kolonie Nova Terra.",
      say: "Stuur me het verzuimoverzicht van Kai. Ik wil weten of hij vaak ziek is voordat hij bij ons begint.",
      opts: [
        { k: "A", t: "Het volledige verzuimoverzicht sturen.", r: "fout",
          uitleg: "Verzuimgegevens zijn er voor de soldij en de begeleiding bij ziekte. Nova Terra heeft er geen grondslag voor.",
          reactie: "Mooi. Dan weet ik genoeg.",
          memo: "Verzuimoverzicht van Kai verstuurd naar Kapitein Vega" },
        { k: "B", t: "Niets van zijn verzuim delen en uitleggen waarom. Over zijn overstap kan Vega met Kai zelf praten.", r: "goed",
          uitleg: "Je gebruikt verzuimgegevens alleen voor waar ze voor zijn, en je deelt niets wat de ontvanger niet mag hebben.",
          reactie: "Hm. Dan vraag ik hem zelf wanneer hij kan beginnen. Prima." },
        { k: "C", t: "Alleen het aantal ziektedagen sturen, zonder reden.", r: "fout",
          uitleg: "Ook het aantal ziektedagen zegt iets over zijn gezondheid, en Nova Terra heeft er nog steeds geen grondslag voor.",
          reactie: "Twintig dagen? Dan weet ik genoeg.",
          memo: "Verzuimoverzicht van Kai verstuurd naar Kapitein Vega" }
      ],
      crystal: { on: "B", name: "Dataminimalisatie", desc: "Deel alleen wat de ontvanger mag hebben en echt nodig heeft." }
    },
    {
      title: "De holo-oproep", who: "kand",
      intro: "Een oud-crewlid verschijnt als hologram.",
      say: "Ik werk niet meer op Orion. Wat doen jullie nog met mijn BSN, mijn adres en mijn paspoortkopie?",
      opts: [
        { k: "A", t: "“We houden alles. Je weet nooit waar het nog goed voor is.”", r: "fout",
          uitleg: "Wat geen grondslag meer heeft, moet weg. En hij heeft recht op een duidelijk antwoord.",
          reactie: "Dus mijn paspoortkopie zwerft hier nog jaren rond? Dan dien ik een klacht in." },
        { k: "B", t: "Uitleggen dat de wet het station verplicht de soldijadministratie met die gegevens nog een aantal jaren te bewaren, beveiligd en alleen daarvoor. De rest is gewist. Wil hij precies weten wat we hebben, dan zet je dat door als inzageverzoek.", r: "goed",
          uitleg: "Een bewaarplicht uit de wet is ook een grondslag. Je legt dat open uit, en een vraag naar al zijn gegevens loopt via het meldpunt.",
          reactie: "Helder. Dan weet ik waar ik aan toe ben." },
        { k: "C", t: "“Ik wis alles meteen, beloofd.”", r: "fout",
          uitleg: "Dat kun je niet beloven. De wet verplicht het station de soldijadministratie nog te bewaren.",
          reactie: "Fijn. Maar mag jij dat eigenlijk zelf beslissen?" }
      ],
      crystal: { on: "B", name: "Bewaarplicht", desc: "Wat de wet je laat bewaren, houd je. Wat geen grondslag meer heeft, gaat weg." }
    }
  ];

  var VAKKEN = [
    { id: "ovk", label: "Overeenkomst", art: "art. 6 lid 1 sub b AVG", desc: "Nodig om de arbeidsovereenkomst uit te voeren." },
    { id: "wet", label: "Wettelijke plicht", art: "art. 6 lid 1 sub c AVG", desc: "Nodig omdat de wet het station iets verplicht." },
    { id: "bel", label: "Gerechtvaardigd belang", art: "art. 6 lid 1 sub f AVG", desc: "Nodig voor een belang van het station dat zwaarder weegt dan de privacy van de persoon." },
    { id: "toe", label: "Toestemming", art: "art. 6 lid 1 sub a AVG", desc: "De persoon koos er zelf vrij voor en kan dat altijd intrekken." },
    { id: "geen", label: "Geen grondslag", art: "wissen", desc: "Er is geen reden die de wet erkent. Het moet weg." }
  ];
  var DOSSIERS = [
    { id: "C-1182", name: "Sanne Vrij", what: "BSN", ctx: "In de soldijadministratie, voor de soldijaangifte", ans: "wet", why: "De wet schrijft het BSN voor bij de soldijaangifte." },
    { id: "C-1183", name: "Sanne Vrij", what: "Kopie van haar paspoort", ctx: "In de soldijadministratie, na controle bij indiensttreding", ans: "wet", why: "De wet verplicht het station een nieuw crewlid te identificeren en de kopie te bewaren." },
    { id: "C-1184", name: "Sanne Vrij", what: "BSN als inlogcode", ctx: "Voor het stationssysteem. Ze gaf er zelf toestemming voor", ans: "geen", trap: true, why: "Strikvraag. Het BSN mag alleen waar de wet het voorschrijft. Toestemming maakt dat niet anders." },
    { id: "C-1175", name: "Kai Lindqvist", what: "Verpleegadres en telefoonnummer", ctx: "Vastgelegd bij zijn ziekmelding", ans: "wet", why: "Nodig om hem te bereiken en te begeleiden tijdens zijn ziekte." },
    { id: "C-1176", name: "Kai Lindqvist", what: "BSN", ctx: "Doorgegeven aan de scheepsarts voor zijn re-integratie", ans: "wet", why: "Voor de re-integratie van dit crewlid mag het BSN naar de scheepsarts." },
    { id: "C-1177", name: "Kai Lindqvist", what: "Zijn diagnose", ctx: "Stond in een chatbericht aan zijn teamleider", ans: "geen", trap: true, why: "Strikvraag. Ook als hij het zelf vertelt, legt het station de diagnose niet vast. Die is voor de scheepsarts." },
    { id: "C-1190", name: "Milan Osei", what: "Rekeningnummer", ctx: "Om zijn soldij over te maken", ans: "ovk", why: "Nodig om de afspraken uit zijn arbeidsovereenkomst na te komen." },
    { id: "C-1201", name: "Juno Achterberg", what: "Thuisadres", ctx: "Door een collega op de verjaardagslijst gezet, zonder het Juno te vragen", ans: "geen", why: "Het adres staat in de administratie voor een ander doel. Voor deze lijst is er geen grondslag." },
    { id: "S-0007", name: "Toegangssluis crewverblijven", what: "Camerabeelden van gisteren", ctx: "Voor de beveiliging van de verblijven", ans: "bel", why: "Beveiliging is een belang van het station, zolang de beelden kort bewaard blijven." },
    { id: "K-0417", name: "Lyra Jansen", what: "Cv en aanmelding", ctx: "Afgewezen 8 maanden geleden, wilde zelf in de talentenpool", ans: "toe", why: "Zij koos er zelf voor. Na maximaal een jaar wis je." }
  ];
  var CLUES = [
    { crystal: "BSN-regel", title: "Het BSN", text: "Alleen waar de wet het voorschrijft, zoals de soldijaangifte of de re-integratie bij de scheepsarts. Toestemming verandert dat niet." },
    { crystal: "Wettelijke plicht", title: "Bij ziekte", text: "Alleen wat nodig is voor soldij en begeleiding, zoals een verpleegadres. De diagnose niet." },
    { crystal: "Doelbinding", title: "Een ander doel", text: "Een adres uit de administratie gebruik je niet voor een lijst van het team." },
    { crystal: "Dataminimalisatie", title: "Alleen het nodige", text: "Wat niemand nodig heeft voor de soldij, de begeleiding of het werk, heeft geen grondslag." },
    { crystal: "Bewaarplicht", title: "Bewaren", text: "Wat de wet je laat bewaren, houd je. Een cv in de talentenpool alleen als iemand dat zelf wil." }
  ];
  var RULES = [
    "Gebruik het BSN alleen waar de wet het voorschrijft. Toestemming verandert dat niet.",
    "Bij verzuim leg je alleen vast wat nodig is voor loondoorbetaling en begeleiding. De diagnose niet.",
    "Een adres of ander gegeven gebruik je alleen voor het doel waarvoor je het kreeg."
  ];
  var POINTS = { goed: 10, half: 5, fout: 0 };
  var SHIELD_HIT = { goed: 0, half: 5, fout: 10 };
  var DOSSIER_POINTS = 5;
  var MAX = SITS.length * 10 + DOSSIERS.length * DOSSIER_POINTS;
  var LOCK_SECONDS = 300;

  /* ---------- State ---------- */
  var S, timer = null;
  function fresh() {
    return { screen: "brief", sit: 0, shield: 100, score: 0, hints: 3, crystals: [], picks: {}, memos: [],
      lock: { assign: {}, attempts: 0, firstCorrect: null, solved: false, revealed: false, left: LOCK_SECONDS, timeout: false, clues: {}, wrong: {}, msg: null } };
  }
  S = fresh();

  var stage = document.getElementById("stage");

  function hit(n) { S.shield = Math.max(0, S.shield - n); }
  function hasCrystal(n) { return S.crystals.indexOf(n) !== -1; }

  function hud() {
    document.getElementById("shieldText").textContent = S.shield + "%";
    var f = document.getElementById("shieldFill");
    f.style.width = S.shield + "%";
    f.className = "vcsw-progress-fill" + (S.shield < 50 ? " error" : S.shield < 80 ? " warning" : "");
    document.getElementById("scoreText").textContent = S.score + " / " + MAX;
    document.getElementById("hintText").textContent = S.hints;
    document.getElementById("crystalText").textContent = S.crystals.length;
    var n = SITS.length, labels = ["Briefing"].concat(SITS.map(function (s, i) { return "Dienst " + (i + 1); }), ["Luchtsluis", "Debriefing", "Terug op aarde"]);
    var cur = S.screen === "brief" ? 0 : S.screen === "sit" ? 1 + S.sit : S.screen === "lock" ? n + 1 : S.screen === "debrief" ? n + 2 : n + 3;
    document.getElementById("steps").innerHTML = labels.map(function (l, i) {
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

  function verdictBadge(r) {
    if (r === "goed") return '<span class="vcsw-badge success">' + icon("check") + "Goed, +10</span>";
    if (r === "half") return '<span class="vcsw-badge warning">Half goed, +5</span>';
    return '<span class="vcsw-badge danger">Fout, 0 punten</span>';
  }
  function alertBox(kind, ic, title, text) {
    return '<div class="vcsw-alert ' + kind + '">' + icon(ic) + '<div><p class="vcsw-alert-title">' + title + '</p><p class="vcsw-alert-text">' + text + "</p></div></div>";
  }

  /* ---------- Schermen ---------- */
  function renderBrief() {
    show(
      '<div><p class="vcsw-overline">Level 2 · Briefing</p><h1>De passagiersmodule</h1></div>' +
      '<p class="lead">Je leert waarom het station een BSN, een adres en verzuimgegevens mag verwerken, en waar de grens ligt.</p>' +
      speech("aria", "De nieuwe kolonisten zijn aan boord en een deel is crewlid van Orion geworden. Luitenant Mira houdt hun administratie bij, met BSN\u2019s, adressen, paspoortkopie\u00ebn en ziekmeldingen. Voor alles wat je daarmee doet, heb je een reden nodig die de wet erkent. Dat heet een grondslag. Vraag je bij elke stap af waarom het station dit mag, en waarvoor.") +
      '<dl class="vcsw-dl" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">' +
      "<div><dt>Dienst</dt><dd>Vijf situaties met elk drie keuzes. Goed is 10 punten, half goed 5.</dd></div>" +
      "<div><dt>Luchtsluis</dt><dd>Geef tien gegevens in het cryo-archief binnen vijf minuten de juiste grondslag.</dd></div>" +
      "<div><dt>Gehaald</dt><dd>Bij minimaal 70 procent van de punten word je Luitenant.</dd></div></dl>" +
      '<div class="actions"><button class="vcsw-button lg" id="go">Begin de dienst' + icon("next") + "</button></div>"
    );
    document.getElementById("go").onclick = function () { S.screen = "sit"; S.sit = 0; render(); };
  }

  function renderSit() {
    var s = SITS[S.sit], pick = S.picks[S.sit];
    var html = '<div><p class="vcsw-overline">Dienst ' + (S.sit + 1) + " van " + SITS.length + "</p><h2>" + esc(s.title) + "</h2></div>";
    if (s.intro) html += "<p>" + esc(s.intro) + "</p>";
    html += speech(s.who, s.say);
    html += '<div class="options" role="group" aria-label="Kies je antwoord">';
    s.opts.forEach(function (o) {
      var cls = "option" + (pick ? (pick === o.k ? " picked" : " dim") : "");
      html += '<button class="' + cls + '" data-k="' + o.k + '"' + (pick ? " disabled" : "") + '><span class="key" aria-hidden="true">' + o.k + "</span><span><span class=\"vcsw-sr-only\">Optie " + o.k + ". </span>" + esc(o.t) +
        (pick === o.k ? '<span class="verdict">' + verdictBadge(o.r) + "</span>" : "") + "</span></button>";
    });
    html += "</div>";
    if (pick) {
      var o = s.opts.filter(function (x) { return x.k === pick; })[0];
      html += '<div class="feedback">' + speech(s.who, o.reactie) +
        speech("aria", (o.r === "goed" ? "Goed. " : o.r === "half" ? "Half goed. " : "Fout. ") + o.uitleg);
      if (s.crystal && s.crystal.on === pick) {
        html += '<div class="reward">' + icon("gem") + "<div><strong>Datakristal " + esc(s.crystal.name) + "</strong><br><span>" + esc(s.crystal.desc) + "</span></div></div>";
      } else if (s.crystal) {
        html += '<p class="dossier-note" style="color:var(--vcsw-text-muted)">Geen datakristal bij deze keuze. In de luchtsluis kost de bijbehorende aanwijzing je een hint.</p>';
      }
      if (o.memo) html += alertBox("warning", "bell", "ARIA onthoudt deze keuze", "Dit komt terug in de eindmissie.");
      html += '</div><div class="actions"><button class="vcsw-button lg" id="next">' + (S.sit < SITS.length - 1 ? "Volgende situatie" : "Naar de luchtsluis") + icon("next") + "</button></div>";
    }
    show(html);
    if (!pick) {
      stage.querySelectorAll(".option").forEach(function (b) {
        b.onclick = function () { choose(b.getAttribute("data-k")); };
      });
    } else {
      document.getElementById("next").onclick = function () {
        if (S.sit < SITS.length - 1) { S.sit++; } else { S.screen = "lock"; startTimer(); }
        render();
      };
    }
  }

  function choose(k) {
    var s = SITS[S.sit], o = s.opts.filter(function (x) { return x.k === k; })[0];
    S.picks[S.sit] = k;
    S.score += POINTS[o.r];
    hit(SHIELD_HIT[o.r]);
    if (s.crystal && s.crystal.on === k && !hasCrystal(s.crystal.name)) S.crystals.push(s.crystal.name);
    if (o.memo && S.memos.indexOf(o.memo) === -1) S.memos.push(o.memo);
    render();
  }

  /* Luchtsluis: het cryo-archief */
  function startTimer() {
    stopTimer();
    timer = setInterval(function () {
      if (S.screen !== "lock" || S.lock.solved || S.lock.revealed) return stopTimer();
      S.lock.left = Math.max(0, S.lock.left - 1);
      var t = document.getElementById("timer");
      if (t) { t.querySelector("span").textContent = fmt(S.lock.left); t.classList.toggle("low", S.lock.left <= 60); }
      if (S.lock.left === 0 && !S.lock.timeout) { S.lock.timeout = true; hit(10); S.lock.msg = "timeout"; stopTimer(); render(); }
    }, 1000);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function fmt(n) { return Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0"); }

  function renderLock() {
    var L = S.lock, done = L.solved || L.revealed;
    var counts = {}; VAKKEN.forEach(function (v) { counts[v.id] = 0; });
    Object.keys(L.assign).forEach(function (id) { counts[L.assign[id]]++; });
    var all = Object.keys(L.assign).length === DOSSIERS.length;

    var html = '<div><p class="vcsw-overline">Luchtsluis</p><h2>Het cryo-archief</h2></div>' +
      speech("aria", "In het cryo-archief liggen tien gegevens. Kies bij elk gegeven op welke grondslag het station het mag hebben. Is er geen grondslag, dan moet het weg. Pas als alles klopt, gaat de sluis open.");
    html += '<dl class="bases">' + VAKKEN.map(function (v) { return "<div><dt>" + v.label + "<small>" + v.art + "</small></dt><dd>" + v.desc + "</dd></div>"; }).join("") + "</dl>";

    html += '<div class="lockbar"><div class="tally" aria-label="Verdeling">' + VAKKEN.map(function (v) {
      return '<span class="vcsw-badge neutral">' + v.label + ": " + counts[v.id] + "</span>";
    }).join("") + '</div><div class="timer' + (L.left <= 60 ? " low" : "") + '" id="timer" aria-label="Resterende tijd">' + icon("clock") + "<span>" + fmt(L.left) + "</span></div></div>";

    html += '<div><h3>Aanwijzingen</h3><p style="font-size:0.875rem;color:var(--vcsw-text-muted)">Een datakristal opent de aanwijzing gratis. Zonder kristal kost hij een hint, en zonder hints 10 procent schild.</p></div><div class="clues">';
    CLUES.forEach(function (c, i) {
      var open = hasCrystal(c.crystal) || L.clues[i];
      if (open) {
        html += '<div class="clue"><div class="clue-head">' + icon(hasCrystal(c.crystal) ? "gem" : "unlock") + esc(c.title) + "</div><p>" + esc(c.text) + "</p></div>";
      } else {
        html += '<div class="clue locked"><div class="clue-head">' + icon("lock") + esc(c.title) + "</div><p>Vergrendeld. Kristal " + esc(c.crystal) + " ontbreekt.</p>" +
          '<button class="vcsw-button outline sm" data-clue="' + i + '">' + (S.hints > 0 ? "Gebruik een hint" : "Openen voor 10% schild") + "</button></div>";
      }
    });
    html += "</div>";

    html += '<div class="dossiers">';
    DOSSIERS.forEach(function (d) {
      var a = L.assign[d.id], showAns = L.revealed || L.solved;
      var wrong = !L.solved && L.wrong[d.id];
      html += '<article class="dossier' + (wrong ? " wrong" : "") + '" aria-label="' + esc(d.what) + ' van ' + esc(d.name) + '">' +
        '<div class="dossier-top"><span class="dossier-name">' + esc(d.name) + '</span><span class="dossier-id">' + d.id + "</span></div>" +
        "<dl><dt>Gegeven</dt><dd>" + esc(d.what) + "</dd><dt>Situatie</dt><dd>" + esc(d.ctx) + "</dd></dl>" +
        '<div class="vcsw-segmented" role="group" aria-label="Grondslag voor ' + esc(d.what) + ', ' + esc(d.name) + '">' +
        VAKKEN.map(function (v) {
          return '<button type="button" data-d="' + d.id + '" data-v="' + v.id + '" aria-pressed="' + (a === v.id) + '"' + (done ? " disabled" : "") + ">" + v.label + "</button>";
        }).join("") + "</div>";
      if (wrong) html += '<p class="dossier-note" style="color:var(--vcsw-down)"><strong>Verkeerde grondslag.</strong></p>';
      if (showAns && (L.revealed || d.trap)) {
        var good = a === d.ans;
        html += '<p class="dossier-note">' + (good ? "" : "<strong>Juist: " + VAKKEN.filter(function (v) { return v.id === d.ans; })[0].label + ".</strong> ") + esc(d.why) + "</p>";
      }
      html += "</article>";
    });
    html += "</div>";

    if (L.msg === "timeout") html += alertBox("warning", "warn", "De tijd is op", "Je schild verliest 10 procent. Maak de sluis gewoon af.");
    if (L.msg === "wrong") {
      var n = Object.keys(L.wrong).length;
      html += alertBox("error", "bad", n + (n === 1 ? " gegeven heeft" : " gegevens hebben") + " de verkeerde grondslag", "Een nieuwe poging kost 5 procent schild. Kijk nog eens naar de aanwijzingen.");
    }
    if (L.solved) html += alertBox("success", "ok", "Sluiscode " + VAKKEN.map(function (v) { return counts[v.id]; }).join(" ") + ". De sluis gaat open.", "Elk gegeven heeft de juiste grondslag, en wat geen grondslag heeft gaat weg.");
    if (L.revealed) html += alertBox("info", "eye", "Oplossing getoond", "Bij elk dossier staat het juiste vak met uitleg. De sluis is handmatig geopend.");

    html += '<div class="actions">';
    if (!done) {
      if (L.attempts >= 2) html += '<button class="vcsw-button outline lg" id="reveal">' + icon("eye") + "Toon de oplossing</button>";
      html += '<button class="vcsw-button lg" id="check"' + (all ? "" : " disabled") + ">" + icon("unlock") + "Sluis openen</button>";
    } else {
      html += '<button class="vcsw-button lg" id="toDebrief">Naar de debriefing' + icon("next") + "</button>";
    }
    html += "</div>";
    if (!all && !done) html += '<p style="font-size:0.875rem;color:var(--vcsw-text-muted);text-align:right">Nog ' + (DOSSIERS.length - Object.keys(L.assign).length) + " gegevens zonder keuze.</p>";

    show(html);

    stage.querySelectorAll("[data-d]").forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute("data-d");
        L.assign[id] = b.getAttribute("data-v");
        delete L.wrong[id];
        if (L.msg === "wrong" && !Object.keys(L.wrong).length) L.msg = null;
        render();
        var again = stage.querySelector('[data-d="' + id + '"][data-v="' + L.assign[id] + '"]');
        if (again) again.focus();
      };
    });
    stage.querySelectorAll("[data-clue]").forEach(function (b) {
      b.onclick = function () {
        var i = +b.getAttribute("data-clue");
        if (S.hints > 0) S.hints--; else hit(10);
        L.clues[i] = true;
        render();
      };
    });
    var c = document.getElementById("check");
    if (c) c.onclick = checkLock;
    var r = document.getElementById("reveal");
    if (r) r.onclick = function () { L.revealed = true; L.msg = null; L.wrong = {}; stopTimer(); render(); };
    var t = document.getElementById("toDebrief");
    if (t) t.onclick = function () { S.screen = "debrief"; render(); };
  }

  function checkLock() {
    var L = S.lock, wrong = {}, correct = 0;
    DOSSIERS.forEach(function (d) { if (L.assign[d.id] === d.ans) correct++; else wrong[d.id] = true; });
    if (L.firstCorrect === null) { L.firstCorrect = correct; S.score += correct * DOSSIER_POINTS; }
    else hit(5);
    L.attempts++;
    if (correct === DOSSIERS.length) { L.solved = true; L.wrong = {}; L.msg = null; stopTimer(); }
    else { L.wrong = wrong; L.msg = "wrong"; }
    render();
  }

  function renderDebrief() {
    var pct = Math.round(S.score / MAX * 100), passed = pct >= 70;
    var html = '<div><p class="vcsw-overline">Debriefing</p><h2>' + (passed ? "Level gehaald. Je bent nu Luitenant." : "Nog niet gehaald") + "</h2></div>";
    html += '<div class="vcsw-stats cols-3"><div class="vcsw-stat"><span class="vcsw-stat-label">Score</span><span class="vcsw-stat-value">' + pct + '%</span><span class="vcsw-stat-note">' + S.score + " van " + MAX + ' punten</span></div>' +
      '<div class="vcsw-stat"><span class="vcsw-stat-label">Schildsterkte</span><span class="vcsw-stat-value">' + S.shield + '%</span><span class="vcsw-stat-note">vertrouwen aan boord</span></div>' +
      '<div class="vcsw-stat"><span class="vcsw-stat-label">Datakristallen</span><span class="vcsw-stat-value">' + S.crystals.length + '</span><span class="vcsw-stat-note">van ' + SITS.filter(function (s) { return s.crystal; }).length + ' in dit level</span></div></div>';

    html += speech("aria", passed
      ? "Goed werk, Luitenant. Je weet nu waarom het station een BSN, een adres of een ziekmelding mag hebben, en waar de grens ligt."
      : "Je hebt minder dan 70 procent. Speel de dienst opnieuw. In de echte game krijg je dan andere situaties.");

    html += "<div><h3>Jouw keuzes</h3><ul class=\"result-list\">";
    SITS.forEach(function (s, i) {
      var o = s.opts.filter(function (x) { return x.k === S.picks[i]; })[0];
      html += "<li><span>" + (i + 1) + ". " + esc(s.title) + " <span style=\"color:var(--vcsw-text-muted)\">(" + o.k + ")</span></span>" + verdictBadge(o.r) + "</li>";
    });
    var lc = S.lock.firstCorrect || 0;
    html += "<li><span>Cryo-archief, eerste poging</span><span class=\"vcsw-badge " + (lc === DOSSIERS.length ? "success" : lc >= 7 ? "warning" : "danger") + "\">" + lc + " van " + DOSSIERS.length + " goed, +" + lc * DOSSIER_POINTS + "</span></li></ul></div>";

    html += "<div><h3>Drie kernregels</h3><ol class=\"rules\">" + RULES.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol></div>";

    if (S.crystals.length) html += '<div><h3>Je inventaris</h3><div class="crystals">' + S.crystals.map(function (c) { return '<span class="vcsw-badge">' + icon("gem") + esc(c) + "</span>"; }).join("") + "</div></div>";

    if (S.memos.length) {
      html += '<div><h3>ARIA onthoudt</h3><p style="font-size:0.875rem;color:var(--vcsw-text-muted)">In de eindmissie komt een inzageverzoek binnen. Deze sporen vindt de speler dan terug en moet hij melden.</p><ul class="result-list">' +
        S.memos.map(function (m) { return "<li><span>" + esc(m) + '</span><span class="vcsw-badge warning">Eindmissie</span></li>'; }).join("") + "</ul></div>";
    }

    html += '<div class="actions">' + (passed ? "" : '<button class="vcsw-button outline lg" id="again">' + icon("refresh") + "Speel opnieuw</button>") +
      '<button class="vcsw-button lg" id="earth">Terug op aarde' + icon("next") + "</button></div>";
    show(html);
    var a = document.getElementById("again");
    if (a) a.onclick = restart;
    document.getElementById("earth").onclick = function () { S.screen = "earth"; render(); };
  }

  function renderEarth() {
    show(
      '<div><p class="vcsw-overline">Terug op aarde</p><h2>Wat betekent dit voor je werk bij VCSW</h2></div>' +
      "<p>Bij VCSW werk je dagelijks met BSN’s, adressen en verzuimgegevens van werknemers van klanten. Dezelfde regels gelden daar.</p>" +
      '<dl class="law">' +
      "<dt>Het BSN</dt><dd>Buiten de overheid gebruik je het BSN alleen als een wet dat bepaalt. Voor een werkgever is dat de loonaangifte bij de Belastingdienst, en het doorgeven aan de arbodienst of bedrijfsarts voor de re-integratie van die werknemer. Niet als inlogcode of op een toegangspas, ook niet met toestemming.</dd>" +
      "<dt>Het identiteitsbewijs</dt><dd>De werkgever controleert bij indiensttreding de identiteit en bewaart een kopie in de loonadministratie, tot vijf jaar na het jaar van uitdiensttreding. Beveiligd en alleen toegankelijk voor wie het nodig heeft.</dd>" +
      "<dt>Adressen</dt><dd>Een adres is nodig voor de administratie, en bij een ziekmelding mag de werkgever een (verpleeg)adres vastleggen. Gebruik het niet voor een ander doel, zoals een lijst voor collega’s.</dd>" +
      "</dl>" +
      "<h3>Waarom mag een werkgever gezondheidsgegevens verwerken?</h3>" +
      '<dl class="law">' +
      "<dt>Het verbod, art. 9 lid 1 AVG</dt><dd>Gezondheidsgegevens zijn bijzondere persoonsgegevens. Verwerken is in beginsel verboden.</dd>" +
      "<dt>De uitzondering, art. 9 lid 2 sub b AVG</dt><dd>Het verbod geldt niet als de verwerking nodig is om plichten uit het arbeidsrecht en het socialezekerheidsrecht na te komen, voor zover de nationale wet dat met waarborgen toestaat. In Nederland regelt art. 30 lid 1 UAVG dat. Werkgevers mogen gezondheidsgegevens verwerken voor zover dat nodig is voor wettelijke regels waarbij aanspraken van de gezondheid afhangen, en voor de re-integratie en begeleiding van zieke werknemers.</dd>" +
      "<dt>De grondslag, art. 6 lid 1 sub c AVG</dt><dd>Naast de uitzondering is altijd een grondslag nodig. Dat is hier de wettelijke verplichting van de werkgever. Hij moet het loon doorbetalen bij ziekte (art. 7:629 BW) en de werknemer begeleiden bij re-integratie (Wet verbetering poortwachter).</dd>" +
      "<dt>Samen</dt><dd>Artikel 9 haalt het verbod weg en artikel 6 geeft de grondslag. Pas met allebei mag de werkgever de gegevens verwerken.</dd>" +
      "<dt>De grens</dt><dd>Alleen wat nodig is, zoals bereikbaarheid, (verpleeg)adres, verwachte duur, lopende afspraken, of de werknemer onder een vangnetregeling valt en of er een arbeidsongeval of aansprakelijke derde is. De diagnose legt de werkgever volgens de Autoriteit Persoonsgegevens niet vast, ook niet met toestemming. Medische informatie is voor de bedrijfsarts.</dd>" +
      "</dl>" +
      "<p>Toestemming is in een werkrelatie zelden de juiste grondslag. Een werknemer kan moeilijk vrij nee zeggen tegen wie over zijn werk beslist.</p>" +
      '<div class="vcsw-card basic"><h4>Twijfel of een incident? Meld het</h4><p>Bij Tarik, Dagmar of via <span class="route">jz@vcsw.nl</span>.</p></div>' +
      '<div class="actions"><button class="vcsw-button outline lg" id="again">' + icon("refresh") + "Speel level 2 opnieuw</button></div>"
    );
    document.getElementById("again").onclick = restart;
  }

  function restart() { stopTimer(); S = fresh(); render(); window.scrollTo(0, 0); }

  function render() {
    if (S.screen === "brief") renderBrief();
    else if (S.screen === "sit") renderSit();
    else if (S.screen === "lock") renderLock();
    else if (S.screen === "debrief") renderDebrief();
    else renderEarth();
  }

  render();
})();
