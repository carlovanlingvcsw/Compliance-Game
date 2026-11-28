/* Lek of geen lek. Onderwerp: datalek, risico inschatten.
   Aan de balie van de Datawacht in Module Kepler komen zeven meldingen binnen als dossierkaarten.
   De speler legt elke kaart op de risicometer: geen datalek, laag risico, risico of hoog risico.
   Daarna schuift de kaart naar de goede zone en licht de kolom op met wat er dan gebeurt.
   Melden bij de Privacy Officer staat in elke zone met een lek aan. Afstand bepaalt goed, half of fout.
   Wie "Ik weet het zeker" aanzet, verdient bij een goed antwoord een kristal en verliest bij een fout extra schild. */
(function () {
  "use strict";
  const { game, icon, esc, $, $$, h, wait } = Mini;

  const ZONES = [
    { name: "Geen datalek", sub: "Geen persoonsgegevens, niets te melden", cls: "z0", ic: "check", fx: "half" },
    { name: "Laag risico", sub: "Melden en intern vastleggen", cls: "z1", ic: "shield", fx: "pen" },
    { name: "Risico", sub: "Ook een melding bij de AP", cls: "z2", ic: "alert", fx: "building" },
    { name: "Hoog risico", sub: "Ook de betrokkenen informeren", cls: "z3", ic: "users", fx: "users" }
  ];
  /* Wat er per zone gebeurt. y = ja, n = nee, t = bij twijfel */
  const LADDER = [
    ["Melden bij de Privacy Officer", ["t", "y", "y", "y"]],
    ["Intern vastleggen", ["n", "y", "y", "y"]],
    ["Melding bij de AP, binnen 72 uur", ["n", "n", "y", "y"]],
    ["Betrokkenen zelf informeren", ["n", "n", "n", "y"]]
  ];

  /* ---------- Mini-tekeningen voor de dossierkaarten ---------- */
  const ART = {
    payslip: `<svg viewBox="0 0 96 96"><rect x="20" y="10" width="50" height="66" rx="4" fill="#fff" stroke="#13559b" stroke-width="2"/><rect x="28" y="20" width="26" height="5" rx="2" fill="#13559b"/><rect x="28" y="32" width="34" height="3" fill="#90a1b9"/><rect x="28" y="40" width="34" height="3" fill="#90a1b9"/><rect x="28" y="48" width="22" height="3" fill="#90a1b9"/><rect x="44" y="60" width="18" height="7" rx="2" fill="#ffb900"/><g transform="translate(52 50)"><rect width="36" height="26" rx="3" fill="#0a6dbe"/><path d="M0 2 18 15 36 2" fill="none" stroke="#eaf8ff" stroke-width="2.5"/></g><path d="M80 44l8-8m0 0h-7m7 0v7" stroke="#e7000b" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    menu: `<svg viewBox="0 0 96 96"><rect x="22" y="12" width="46" height="64" rx="4" fill="#fff" stroke="#13559b" stroke-width="2"/><path d="M38 22v14M46 22v14M42 22v40M38 36a4 4 0 0 0 8 0" stroke="#0a6dbe" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="52" y="24" width="10" height="3" fill="#90a1b9"/><rect x="52" y="32" width="10" height="3" fill="#90a1b9"/><rect x="52" y="40" width="10" height="3" fill="#90a1b9"/><circle cx="74" cy="66" r="14" fill="#13559b"/><circle cx="74" cy="66" r="9" fill="none" stroke="#a1deff" stroke-width="2"/><path d="M64 66h20" stroke="#a1deff" stroke-width="2"/></svg>`,
    laptop: `<svg viewBox="0 0 96 96"><rect x="18" y="20" width="60" height="40" rx="4" fill="#13559b" stroke="#0c2f5f" stroke-width="2"/><rect x="23" y="25" width="50" height="30" rx="2" fill="#06224c"/><rect x="10" y="60" width="76" height="8" rx="3" fill="#90a1b9"/><g transform="translate(38 28)"><rect x="0" y="9" width="20" height="15" rx="3" fill="#05df72"/><path d="M4 9V6a6 6 0 0 1 12 0v3" fill="none" stroke="#05df72" stroke-width="3"/></g><path d="M66 74c6 0 10 4 10 10" stroke="#62748e" stroke-width="2" stroke-dasharray="3 3" fill="none"/><text x="48" y="88" text-anchor="middle" font-size="10" font-weight="700" fill="#314158" font-family="Source Sans 3,sans-serif">kwijt</text></svg>`,
    cc: `<svg viewBox="0 0 96 96"><rect x="10" y="16" width="76" height="56" rx="5" fill="#fff" stroke="#13559b" stroke-width="2"/><text x="18" y="32" font-size="10" font-weight="700" fill="#13559b" font-family="Source Sans 3,sans-serif">CC</text>${Array.from({ length: 12 }, (_, i) => `<rect x="${34 + (i % 3) * 16}" y="${24 + Math.floor(i / 3) * 10}" width="13" height="5" rx="2" fill="${i === 4 || i === 9 ? "#ffb900" : "#67caff"}"/>`).join("")}<rect x="18" y="60" width="40" height="4" rx="2" fill="#90a1b9"/></svg>`,
    ransom: `<svg viewBox="0 0 96 96"><rect x="24" y="10" width="48" height="76" rx="5" fill="#1d293d" stroke="#62748e" stroke-width="2"/>${[0, 1, 2, 3].map((i) => `<rect x="30" y="${18 + i * 16}" width="36" height="11" rx="2" fill="#314158"/><circle cx="60" cy="${23.5 + i * 16}" r="2" fill="#ff6467"/>`).join("")}<g transform="translate(46 44)"><rect x="0" y="14" width="34" height="26" rx="4" fill="#e7000b"/><path d="M7 14V9a10 10 0 0 1 20 0v5" fill="none" stroke="#e7000b" stroke-width="5"/><circle cx="17" cy="26" r="4" fill="#fff"/></g><path d="M34 52h8M30 58l6 0" stroke="#05df72" stroke-width="2"/></svg>`,
    passport: `<svg viewBox="0 0 96 96"><path d="M14 26h24l6 6h38a4 4 0 0 1 4 4v40a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V30a4 4 0 0 1 4-4z" fill="#0a6dbe"/><g transform="translate(22 14) rotate(-8)"><rect width="34" height="24" rx="2" fill="#fff"/><circle cx="9" cy="11" r="5" fill="#90a1b9"/><rect x="17" y="7" width="13" height="3" fill="#62748e"/><rect x="17" y="13" width="10" height="3" fill="#62748e"/></g><g transform="translate(46 12) rotate(7)"><rect width="34" height="24" rx="2" fill="#eaf8ff"/><circle cx="9" cy="11" r="5" fill="#90a1b9"/><rect x="17" y="7" width="13" height="3" fill="#62748e"/><rect x="17" y="13" width="10" height="3" fill="#62748e"/></g><path d="M10 44h76v32a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill="#008be5"/><g transform="translate(36 50)"><rect x="0" y="10" width="24" height="18" rx="3" fill="#ffb900"/><path d="M5 10V6a7 7 0 0 1 13-3" fill="none" stroke="#ffb900" stroke-width="4" stroke-linecap="round"/></g></svg>`,
    printer: `<svg viewBox="0 0 96 96"><rect x="28" y="8" width="40" height="34" rx="2" fill="#fff" stroke="#13559b" stroke-width="2"/><path d="M42 18h12M48 12v12" stroke="#e7000b" stroke-width="4"/><rect x="34" y="30" width="28" height="3" fill="#90a1b9"/><rect x="14" y="38" width="68" height="30" rx="6" fill="#62748e"/><rect x="24" y="60" width="48" height="18" rx="2" fill="#cad5e2"/><circle cx="72" cy="48" r="3" fill="#05df72"/><g transform="translate(66 64)"><rect x="0" y="8" width="18" height="14" rx="3" fill="#0a6dbe"/><path d="M4 8V5a5 5 0 0 1 10 0v3" fill="none" stroke="#0a6dbe" stroke-width="3"/></g></svg>`
  };

  /* ---------- De casussen ---------- */
  const CASES = [
    { title: "Loonstrook naar de verkeerde collega", short: "Loonstrook", art: "payslip", zone: 2,
      text: "Mira mailt de loonstrook van een technicus naar een andere technicus met dezelfde achternaam.",
      facts: [["file", "Loon, inhoudingen en BSN"], ["user", "1 crewlid"], ["mail", "Bij een collega"]], key: [0],
      why: "Een loonstrook bevat financiële gegevens en een BSN. Dat is meer dan een onschuldig gegeven, ook al ging het naar een collega. Daarom beoordeelt de Privacy Officer het als risico en beslist die over een melding bij de AP.",
      hint: "Kijk vooral naar welke gegevens er op een loonstrook staan." },
    { title: "Kantinemenu naar Station Vela", short: "Kantinemenu", art: "menu", zone: 0,
      text: "Het weekmenu van de kantine gaat per ongeluk naar de kantine van Station Vela.",
      facts: [["file", "Gerechten en prijzen"], ["users", "Geen personen"], ["send", "Ander station"]], key: [0, 1],
      why: "In het menu staan geen persoonsgegevens. Dan is het geen datalek, hoe vervelend de vergissing ook is. Twijfel je of er toch namen in stonden, dan meld je het gewoon.",
      hint: "Een datalek gaat altijd over persoonsgegevens. Staan die in een menu?" },
    { title: "Versleutelde laptop kwijt", short: "Laptop", art: "laptop", zone: 1,
      text: "Bram verliest zijn laptop in het vrachtdok. De schijf is goed versleuteld en het wachtwoord zat er niet bij.",
      facts: [["lock", "Crewlijst, goed versleuteld"], ["users", "60 crewleden"], ["search", "Vinder onbekend"]], key: [0],
      why: "Zonder wachtwoord kan een vinder niets met de versleutelde schijf. Het risico is laag. Toch meldt Bram het direct bij de Privacy Officer, die het intern vastlegt.",
      hint: "Wat kan iemand die de laptop vindt eigenlijk zien zonder wachtwoord?" },
    { title: "Alle adressen zichtbaar in CC", short: "Mail in CC", art: "cc", zone: 2,
      text: "Een uitnodiging voor de sportdag gaat naar alle 140 crewleden. Iedereen staat zichtbaar in CC, ook de privé-adressen van crew met verlof.",
      facts: [["mail", "Privé-mailadressen"], ["users", "140 crewleden"], ["eye", "Iedereen ziet ze"]], key: [0, 1],
      why: "Het gaat om veel mensen, en privé-adressen kwamen bij iedereen terecht. Dat maakt het meer dan laag risico. De Privacy Officer beoordeelt het en beslist over een melding bij de AP.",
      hint: "Hoeveel mensen gaat het om, en waren alle adressen al bekend bij iedereen?" },
    { title: "Ransomware op de ziekenboeg", short: "Ransomware", art: "ransom", zone: 3,
      text: "Ransomware versleutelt de server van de ziekenboeg. Daarop staan de verzuimdossiers van alle crew.",
      facts: [["cross", "Gezondheidsgegevens"], ["users", "Alle crew"], ["alert", "Onbekende aanvallers"]], key: [0, 1, 2],
      why: "Gezondheidsgegevens van veel mensen in handen van onbekenden. Dat is een hoog risico. De Privacy Officer meldt het bij de AP binnen 72 uur, en ook de crew zelf wordt geïnformeerd.",
      hint: "Tel de factoren die het risico verhogen. Welke gegevens, hoeveel mensen, en bij wie?" },
    { title: "Uitdraai op de printer", short: "Printer", art: "printer", zone: 1,
      text: "Een uitdraai met gezondheidsgegevens van één crewlid lag een kwartier op de printer van Dokter Okafor. De spreekkamer was op slot.",
      facts: [["cross", "Gezondheidsgegevens"], ["user", "1 crewlid"], ["lock", "Afgesloten ruimte"]], key: [2],
      why: "Gezondheidsgegevens zijn gevoelig, maar niemand anders kon erbij in die afgesloten ruimte. Het risico is laag. Wel meldt de dokter het bij de Privacy Officer, en die legt het vast.",
      hint: "Gevoelige gegevens, maar wie had er in dat kwartier bij gekund?" },
    { title: "Paspoortkopieën drie maanden open", short: "Paspoorten", art: "passport", zone: 3,
      text: "BSN's en paspoortkopieën van alle crew stonden drie maanden open voor iedereen op het station, en ook voor gasten van buiten.",
      facts: [["file", "BSN en kopie paspoort"], ["users", "Alle crew"], ["unlock", "Drie maanden open"]], key: [0, 1, 2],
      why: "BSN's en kopieën van identiteitsbewijzen, van veel mensen, lang open voor onbekenden. Dat is een hoog risico. De Privacy Officer meldt bij de AP binnen 72 uur na ontdekking, en de crew wordt zelf geïnformeerd.",
      hint: "BSN, kopie identiteitsbewijs, veel mensen, onbekenden. Hoeveel van de zware factoren zie je?" }
  ];

  const MAX = CASES.length * 10;
  const G = game({ id: "lek-of-geen-lek", title: "Lek of geen lek", topic: "Datalek", module: "Module Kepler", max: MAX, timer: 240,
    steps: ["Briefing", "Meldingen", "Debriefing"], onStart: () => start(), onTimeout: () => end() });

  /* ---------- Briefing ---------- */
  const zc = ["#67caff", "#05df72", "#ffb900", "#ff6467"];
  const introArt = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="lbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a2552"/><stop offset="1" stop-color="#030c20"/></linearGradient>
    <linearGradient id="lmet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#62748e"/><stop offset=".5" stop-color="#314158"/><stop offset="1" stop-color="#1d293d"/></linearGradient>
    <linearGradient id="lscale" x1="0" x2="1"><stop offset="0" stop-color="#67caff"/><stop offset=".35" stop-color="#05df72"/><stop offset=".68" stop-color="#ffb900"/><stop offset="1" stop-color="#ff6467"/></linearGradient></defs>
    <rect width="400" height="300" fill="url(#lbg)"/>
    <rect x="16" y="150" width="368" height="118" rx="14" fill="url(#lmet)" stroke="#90a1b9" stroke-width="1.5"/>
    <rect x="30" y="160" width="340" height="10" rx="5" fill="url(#lscale)"/>
    <path d="M226 150 l8 14 l8 -14z" fill="#ffd230" stroke="#2a1600" stroke-width="1"/>
    ${[0, 1, 2, 3].map((i) => `<g transform="translate(${30 + i * 86} 178)"><rect width="78" height="78" rx="9" fill="#04122c" stroke="${zc[i]}" stroke-width="1.5"/><rect width="78" height="6" rx="3" fill="${zc[i]}"/>
      <text x="39" y="24" text-anchor="middle" font-family="Figtree,sans-serif" font-weight="700" font-size="11" fill="#fff">${["Geen lek", "Laag", "Risico", "Hoog"][i]}</text>
      ${i === 1 ? `<rect x="10" y="34" width="26" height="30" rx="4" fill="#eaf8ff"/><rect x="40" y="34" width="26" height="30" rx="4" fill="#eaf8ff"/>` : i === 0 ? `<rect x="26" y="34" width="26" height="30" rx="4" fill="#eaf8ff"/>` : i === 3 ? `<rect x="26" y="34" width="26" height="30" rx="4" fill="#eaf8ff"/>` : ""}</g>`).join("")}
    <g transform="translate(150 22) rotate(4)"><rect width="150" height="104" rx="8" fill="#e2e8f0" stroke="#fff" stroke-width="1.5"/><rect x="0" y="0" width="150" height="20" rx="8" fill="#cad5e2"/><rect x="58" y="-8" width="34" height="14" rx="4" fill="#90a1b9"/>
      <g transform="translate(10 28) scale(.68)">${ART.ransom.replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
      <rect x="80" y="34" width="58" height="7" rx="3" fill="#13559b"/><rect x="80" y="48" width="50" height="5" rx="2.5" fill="#62748e"/><rect x="80" y="58" width="56" height="5" rx="2.5" fill="#62748e"/><rect x="80" y="76" width="42" height="14" rx="7" fill="#ff6467" opacity=".85"/></g>
    <path d="M232 130 C 236 142 234 146 234 150" stroke="#ffd230" stroke-width="2" stroke-dasharray="4 4" fill="none"/>
    <circle cx="50" cy="40" r="2" fill="#a1deff"/><circle cx="90" cy="96" r="1.5" fill="#fff"/><circle cx="352" cy="60" r="1.5" fill="#fff"/><circle cx="330" cy="120" r="2" fill="#a1deff"/>
  </svg>`;
  G.intro({
    lead: "Aan de balie van de Datawacht in Module Kepler komen zeven meldingen binnen. Niet alles is even erg. Jij legt elke melding op de risicometer en ziet wat er dan moet gebeuren.",
    who: "Noor",
    line: "Is het een lek, en hoe groot is het risico? Kijk naar welke gegevens het zijn, hoeveel mensen, en bij wie ze terechtkwamen. Melden bij de Privacy Officer doe je bij elk lek.",
    rules: [["hand", "Weeg de feiten op de kaart. Sleep de kaart dan naar een zone op de meter, of klik op de zone."],
      ["target", "Precies goed is 10 punten. Eén zone ernaast is half goed. Verder weg kost schild."],
      ["gem", "Na het leggen kies je <b>Ik weet het zeker</b> of <b>Ik denk het</b>. Zeker en goed levert een kristal op, zeker en fout kost extra schild."]],
    art: introArt, note: "Zeven meldingen, ongeveer 4 minuten"
  });

  /* ---------- Speelveld ---------- */
  let critical = [];
  let idx = 0, placed = [], phase = "pick", sure = false, hintsHere = 0, streak = 0, drag = null;
  function start() {
    G.setStep(1);
    G.stage.innerHTML = "";
    const n = h(`<div class="lk fade-in">
      <div class="lk-top">
        <section class="lk-desk" aria-label="Balie van de Datawacht">
          <div class="lk-tray" data-tray aria-hidden="true"></div>
          <div class="lk-cardcol"><div class="lk-cardslot" data-cardslot></div>
          </div>
        </section>
        <section class="lk-side" data-side aria-live="polite"></section>
      </div>
      <section class="lk-meter" aria-label="Risicometer">
        <div class="lk-grid">
          <div class="lk-rowlbl lk-scale-lbl"><b>Risicometer</b><span>Van geen risico naar hoog risico</span></div>
          <div class="lk-scale" aria-hidden="true"><div class="lk-scale-bar"></div><div class="lk-needle" data-needle></div></div>
          ${ZONES.map((z, i) => `<button class="lk-zone ${z.cls}" type="button" data-zone="${i}" style="grid-column:${i + 2};grid-row:2"><span class="nm">${esc(z.name)}</span><span class="fx"><span class="big">${icon(z.fx, "lg")}</span><span class="sb">${esc(z.sub)}</span></span></button>`).join("")}
          <div class="lk-rowlbl" style="grid-row:3">Gelegde meldingen</div>
          ${ZONES.map((z, i) => `<div class="lk-drop ${z.cls}" data-drop="${i}" style="grid-column:${i + 2};grid-row:3"></div>`).join("")}
          ${ZONES.map((z, i) => `<div class="lk-colhl" data-hl="${i}" style="grid-column:${i + 2};grid-row:2 / span 2"></div>`).join("")}
          <div class="lk-cons" data-cons style="grid-column:1 / span 5;grid-row:4" aria-live="polite"></div>
        </div>
        <span class="screw a"></span><span class="screw b"></span><span class="screw c"></span><span class="screw d"></span>
      </section>
    </div>`);
    G.stage.appendChild(n);
    $$("[data-zone]", n).forEach((b) => {
      b.addEventListener("click", () => choose(+b.dataset.zone));
      b.addEventListener("mouseenter", () => preview(+b.dataset.zone)); b.addEventListener("focus", () => preview(+b.dataset.zone));
      b.addEventListener("mouseleave", () => preview(null)); b.addEventListener("blur", () => preview(null));
    });
    showCase(0);
  }

  function showCase(i) {
    idx = i; phase = "pick"; sure = false; hintsHere = 0;
    const C = CASES[i];
    G.head("Lek of geen lek", `<span class="chip">${icon("file", "sm")}Melding ${i + 1} van ${CASES.length}</span><span class="chip">${icon("building", "sm")}Balie Datawacht, Module Kepler</span>`);
    const left = CASES.length - i - 1;
    $("[data-tray]", G.stage).innerHTML = `<div class="lk-stack">${Array.from({ length: left }, (_, k) => `<i style="--k:${k};--r:${[-4, 3, -2, 5, -5, 2][k % 6]}deg"></i>`).join("")}${left ? `<b>${left}</b>` : ""}</div><span>${left ? "Nog op de stapel" : "Laatste melding"}</span>`;
    const slot = $("[data-cardslot]", G.stage);
    slot.innerHTML = `<article class="lk-card enter" data-card tabindex="-1" aria-label="Melding ${i + 1}: ${esc(C.title)}">
      <span class="clip" aria-hidden="true"></span>
      <div class="lk-card-art">${ART[C.art]}</div>
      <div class="lk-card-tx"><span class="no">Melding ${i + 1}</span><h3>${esc(C.title)}</h3><p>${esc(C.text)}</p></div>
      <div class="lk-cardfoot" data-foot>${pickFoot()}</div>
    </article>`;
    bindWeigh(slot);
    bindDrag($("[data-card]", slot));
    $$("[data-zone]", G.stage).forEach((b) => { b.disabled = false; b.classList.remove("chosen", "right", "pending"); });
    $$(".lk-zv", G.stage).forEach((x) => x.remove());
    setBet(false);
    $$(".lk-ghosttok, .lk-arrow", G.stage).forEach((x) => x.remove());
    $(".lk-meter", G.stage).classList.remove("alarm", "decided", "placed"); preview(null);
    $$(".lk-colhl", G.stage).forEach((x) => x.className = "lk-colhl");
    $$(".lk-cell", G.stage).forEach((x) => x.classList.remove("hl", "pend", "mine"));
    $("[data-needle]", G.stage).style.left = "50%"; $("[data-needle]", G.stage).classList.remove("set", "swing");
    cons(null);
    side("pick");
  }

  function side(mode, o) {
    const s = $("[data-side]", G.stage);
    if (mode === "pick") {
      s.className = "lk-side";
      const C = CASES[idx], WEIGH = ["Welke gegevens", "Hoeveel mensen", "Bij wie"];
      s.innerHTML = `<div class="lk-facts"><div class="lk-facts-head"><h3>Feiten van de melding</h3><button class="btn sm ghost" type="button" data-hint>${icon("bulb", "sm")}Aanwijzing</button><span class="hintcost">${esc(G.hintLabel())}</span></div>
        <ul>${C.facts.map((f, k) => `<li data-fact="${k}"><span class="ic">${icon(f[0])}</span><span><small>${WEIGH[k]}</small><b>${esc(f[1])}</b></span></li>`).join("")}</ul>
        <div data-hintline></div></div>`;
      $("[data-hint]", s).addEventListener("click", hint);
      return;
    }
    if (mode === "confirm") {
      s.className = "lk-side lk-cs-wrap";
      s.innerHTML = `<div class="lk-cs-step" role="group" aria-labelledby="lk-cs-q" tabindex="-1" data-csstep>
        <div class="lk-cs-head"><span class="lk-step">3</span><h3 id="lk-cs-q">Hoe zeker ben je?</h3></div>
        <p class="lk-cs-sub">Je legde de melding op <b class="${ZONES[o.z].cls}">${esc(ZONES[o.z].name)}</b>. Een andere zone kiezen mag nog.</p>
        <div class="lk-cs-row">
          <button class="lk-cs sure" type="button" data-conf="1"><span class="t">${icon("gem")}Ik weet het zeker</span><span class="c">Goed levert een kristal op. Niet helemaal goed kost 10 procent extra schild.</span></button>
          <button class="lk-cs" type="button" data-conf="0"><span class="t">${icon("scale")}Ik denk het</span><span class="c">Geen kristal en geen extra kosten.</span></button>
        </div></div>`;
      $$("[data-conf]", s).forEach((b) => b.addEventListener("click", () => { setBet(b.dataset.conf === "1"); reveal(pendingZ); }));
      if (!G.shot) $("[data-csstep]", s).focus({ preventScroll: true });
      return;
    }
    const { res, C, chosen, pts } = o;
    const last = idx === CASES.length - 1, dist = Math.abs(chosen - C.zone);
    const under = C.zone - chosen >= 2;
    s.className = "lk-side lk-fb " + res + (under ? " alarm" : "");
    s.innerHTML = `<div class="lk-fb-in">
      <div class="lk-fb-head"><span class="dot">${icon(res === "goed" ? "check" : res === "half" ? "half" : "x", "lg")}</span><h3>${res === "goed" ? "Goed" : res === "half" ? "Half goed" : under ? "Zwaar onderschat" : "Niet goed"} <span class="pts">+${pts}</span></h3></div>
      <p class="lk-fb-zone">${res === "goed" ? "" : res === "half" ? "Eén zone ernaast. " : `${dist} zones ernaast. `}Doorslaggevend: ${C.key.map((k) => `<i class="lk-key">${esc(C.facts[k][1])}</i>`).join(" ")}</p>
      ${G.sayHTML("Noor", (res === "goed" ? (o.sure ? "Klopt, en je durfde. " : "Klopt. ") : res === "half" ? "Bijna. " : under ? "Dit lek mag je nooit onderschatten. " : "Nee, dit zit anders. ") + C.why, { mood: res === "goed" ? "ok" : res === "half" ? "half" : "bad" })}
      <div class="lk-fb-foot"><p class="lk-fb-rule">${icon("phone", "sm")}<span>${C.zone >= 1 ? "Meld het direct bij de Privacy Officer." : "Bij twijfel meld je het toch."}</span></p>
        <button class="btn lk-fb-next" type="button" data-next>${last ? "Naar de debriefing" : "Volgende melding"}${icon("arrow")}</button></div></div>`;
    $("[data-next]", s).addEventListener("click", () => last ? end() : showCase(idx + 1));
    $("[data-next]", s).focus({ preventScroll: true });
  }

  function hint() {
    const cost = G.hint(); hintsHere++;
    const C = CASES[idx];
    const hl = $("[data-hintline]", G.stage); hl.className = ""; hl.innerHTML = `<p class="lk-hint">${icon("bulb", "sm")}<span>${esc(C.hint)}${cost ? ` <span class="hintcost">Min 10 procent schild</span>` : ""}</span></p>`;
    const hb = $("[data-hint]", G.stage); if (hb) hb.nextElementSibling.textContent = G.hintLabel();
  }

  /* ---------- Slepen ---------- */
  function bindDrag(card) {
    card.addEventListener("pointerdown", (e) => {
      if ((phase !== "pick" && phase !== "confirm") || e.button !== 0 || e.target.closest("button")) return;
      const r = card.getBoundingClientRect();
      drag = { x0: e.clientX, y0: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width, ghost: null, over: null };
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener("pointermove", (e) => {
      if (!drag) return;
      if (!drag.ghost) {
        if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6) return;
        drag.ghost = card.cloneNode(true); drag.ghost.classList.remove("enter"); drag.ghost.classList.add("lk-ghost"); drag.ghost.style.width = drag.w + "px";
        document.body.appendChild(drag.ghost); card.classList.add("lifting");
      }
      drag.ghost.style.left = e.clientX - drag.dx * 0.5 + "px"; drag.ghost.style.top = e.clientY - drag.dy * 0.5 + "px";
      drag.ghost.style.display = "none";
      const under = document.elementFromPoint(e.clientX, e.clientY);
      drag.ghost.style.display = "";
      const col = under && under.closest("[data-zone],[data-drop],[data-col],.lk-colhl");
      const z = col ? +(col.dataset.zone ?? col.dataset.drop ?? col.dataset.col ?? col.dataset.hl) : null;
      drag.over = Number.isFinite(z) ? z : null;
      $$("[data-zone]", G.stage).forEach((b) => b.classList.toggle("over", +b.dataset.zone === drag.over));
      $$("[data-drop]", G.stage).forEach((b) => b.classList.toggle("over", +b.dataset.drop === drag.over));
      preview(drag.over);
    });
    const endDrag = () => {
      if (!drag) return; const d = drag; drag = null;
      if (!d.ghost) return;
      d.ghost.remove(); card.classList.remove("lifting");
      $$(".over", G.stage).forEach((b) => b.classList.remove("over"));
      if (d.over != null) choose(d.over); else $("[data-needle]", G.stage).style.left = "50%";
    };
    card.addEventListener("pointerup", endDrag); card.addEventListener("pointercancel", endDrag);
  }
  /* Jouw keuze blijft als spookfiche staan, met een pijl naar de goede zone. */
  function markMiss(z, right, C) {
    $(`[data-drop="${z}"]`, G.stage).insertAdjacentHTML("beforeend", `<div class="lk-ghosttok" aria-label="Jouw keuze">${icon("x", "sm")}Jouw keuze</div>`);
    const a = Math.min(z, right), b = Math.max(z, right), n = b - a + 1;
    $(".lk-grid", G.stage).insertAdjacentHTML("beforeend", `<div class="lk-arrow ${right > z ? "to-r" : "to-l"}" style="grid-column:${a + 2} / ${b + 3};grid-row:3;margin:0 calc(50% / ${n})" aria-hidden="true"><i></i></div>`);
  }
  function pickFoot() {
    return `<span class="lk-step" title="Weeg de feiten">1</span><span class="lk-step2">Weeg</span>${[["file", "Welke gegevens"], ["users", "Hoeveel mensen"], ["eye", "Bij wie"]].map((w, k) => `<button class="lk-look" type="button" data-look="${k}" aria-pressed="false">${icon(w[0], "sm")}${w[1]}</button>`).join("")}<span class="lk-step">2</span><span class="lk-step2">Leg op de meter</span>`;
  }
  function bindWeigh(root) {
    $$("[data-look]", root).forEach((b) => b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      $$("[data-look]", root).forEach((x) => x.setAttribute("aria-pressed", "false"));
      $$("[data-fact]", G.stage).forEach((li) => li.classList.remove("look"));
      if (on) { b.setAttribute("aria-pressed", "true"); const li = $(`[data-fact="${b.dataset.look}"]`, G.stage); if (li) li.classList.add("look"); }
      Mini.sound.play("tap");
    }));
    $$("[data-look]", root).forEach((b) => b.addEventListener("pointerdown", (e) => e.stopPropagation()));
  }
  function setBet(v) { sure = v; const b = $("[data-bet]", G.stage); if (b) b.setAttribute("aria-checked", String(v)); }
  function moveNeedle(z) { $("[data-needle]", G.stage).style.left = (z * 25 + 12.5) + "%"; }
  /* De gevolgen van een risiconiveau als één rij grote kaarten onder de meter. */
  const VAL = { y: ["Ja", "check"], n: ["Nee", "x"], t: ["Alleen bij twijfel", "half"] };
  function cons(z, mode, mine) {
    const el = $("[data-cons]", G.stage); if (!el) return;
    if (z == null) {
      el.className = "lk-cons idle";
      el.innerHTML = `<div class="lk-cons-head"><b>Wat moet er gebeuren?</b><span>Leg de kaart op een zone. Dan zie je hier de gevolgen van dat risiconiveau.</span></div>
        <ul class="lk-cons-list">${LADDER.map(([lbl]) => `<li><span class="lb">${esc(lbl)}</span><span class="v"><span class="q">?</span></span></li>`).join("")}</ul>`;
      return;
    }
    const Z = ZONES[z], diff = mode === "right" && mine != null && mine !== z;
    const head = mode === "right" ? (diff ? `Hoort bij ${Z.name}. Dit moet er gebeuren` : `${Z.name} klopt. Dit moet er gebeuren`) : `Gevolgen van ${Z.name}`;
    const sub = mode === "right" ? (diff ? `Jij koos ${ZONES[mine].name.toLowerCase()}. Het verschil is geel omrand.` : "Zo gaat het verder met deze melding.") : "Zo gaat het verder als je dit bevestigt.";
    el.className = `lk-cons ${Z.cls} ${mode}`;
    el.innerHTML = `<div class="lk-cons-head"><b>${esc(head)}</b><span>${esc(sub)}</span></div>
      <ul class="lk-cons-list">${LADDER.map(([lbl, v]) => { const x = v[z], other = diff && v[mine] !== x; return `<li class="${x}${other ? " miss" : ""}"><span class="lb">${esc(lbl)}</span><span class="v">${icon(VAL[x][1])}${VAL[x][0]}${other ? `<span class="you">Jouw keuze: ${VAL[v[mine]][0].toLowerCase()}</span>` : ""}</span></li>`; }).join("")}</ul>`;
  }
  /* Toon de gevolgen van de zone waar je overheen gaat. */
  function preview(z) {
    if (phase !== "pick" && phase !== "confirm" && z != null) return;
    $$(".lk-cell, .lk-zone, .lk-drop", G.stage).forEach((c) => c.classList.remove("pv"));
    if (z == null) return;
    $$(`[data-zone="${z}"], [data-drop="${z}"]`, G.stage).forEach((c) => c.classList.add("pv"));
    moveNeedle(z);
  }

  /* ---------- Een keuze ---------- */
  /* Na het leggen bevestig je hoe zeker je bent. Een andere zone kiezen mag nog. */
  let pendingZ = null;
  function choose(z) {
    if (phase !== "pick" && phase !== "confirm") return;
    phase = "confirm"; pendingZ = z;
    $$("[data-zone]", G.stage).forEach((b) => b.classList.toggle("pending", +b.dataset.zone === z));
    moveNeedle(z); Mini.sound.play("tap");
    const foot = $("[data-foot]", G.stage);
    foot.classList.add("confirm");
    $$(".lk-cell", G.stage).forEach((c) => c.classList.toggle("pend", +c.dataset.col === z));
    $(".lk-meter", G.stage).classList.add("placed");
    foot.innerHTML = `<span class="lk-step">2</span><span class="lk-step2">Gelegd op <b>${esc(ZONES[z].name)}</b>. Kies rechts hoe zeker je bent.</span>`;
    cons(z, "pend");
    side("confirm", { z });
  }
  async function reveal(z) {
    if (phase !== "confirm") return; phase = "reveal";
    const C = CASES[idx], dist = Math.abs(z - C.zone);
    const res = dist === 0 ? "goed" : dist === 1 ? "half" : "fout";
    const pts = res === "goed" ? 10 : res === "half" ? 5 : 0;
    $$("[data-zone]", G.stage).forEach((b) => { b.disabled = true; });
    $(`[data-zone="${z}"]`, G.stage).classList.remove("pending");
    $$(".lk-cell", G.stage).forEach((c) => { c.classList.remove("pend"); c.classList.toggle("mine", +c.dataset.col === z && z !== C.zone); });
    $(`[data-zone="${z}"]`, G.stage).classList.add("chosen");
    $$("[data-hint],[data-bet]", G.stage).forEach((b) => b.disabled = true);
    $(".lk-meter", G.stage).classList.add("decided");
    $$("[data-fact]", G.stage).forEach((li) => li.classList.remove("look"));
    preview(null);
    moveNeedle(z);
    // De kaart krimpt tot een fiche in de gekozen zone
    const card = $("[data-card]", G.stage);
    const token = h(`<div class="lk-token ${res}" title="${esc(C.title)}"><span class="ta">${ART[C.art]}</span><span class="tt">${esc(C.short)}</span></div>`);
    const drop = $(`[data-drop="${z}"]`, G.stage);
    const from = card.getBoundingClientRect();
    drop.appendChild(token);
    if (!Mini.reduce && !G.shot) await fly(token, from);
    card.classList.add("stamped");
    C.key.forEach((k, j) => setTimeout(() => { const li = $(`[data-fact="${k}"]`, card); if (li) li.classList.add("key"); }, Mini.reduce || G.shot ? 0 : 200 + j * 160));
    $("[data-foot]", card).classList.remove("confirm"); $("[data-foot]", card).removeAttribute("tabindex");
    $("[data-foot]", card).innerHTML = `<span class="lk-verdict you ${z === C.zone ? "same" : ""}">${icon(z === C.zone ? "check" : "x", "sm")}Jij: <b>${esc(ZONES[z].name)}</b>${sure ? " (zeker)" : ""}</span><span class="lk-verdict right ${ZONES[C.zone].cls}">${icon("flag", "sm")}Hoort bij: <b>${esc(ZONES[C.zone].name)}</b></span>`;
    Mini.sound.play("tap");
    await wait(Mini.reduce || G.shot ? 0 : 350);
    // Schuift naar de goede zone als het niet klopt
    if (z !== C.zone) {
      const target = $(`[data-drop="${C.zone}"]`, G.stage);
      const r0 = token.getBoundingClientRect();
      target.appendChild(token);
      token.classList.add("moved");
      markMiss(z, C.zone, C);
      $("[data-needle]", G.stage).classList.add("swing");
      moveNeedle(C.zone);
      if (!Mini.reduce && !G.shot) await fly(token, r0, 520);
    }
    const crit = C.zone - z >= 2;
    if (crit) { $(".lk-meter", G.stage).classList.add("alarm"); Mini.sound.play("alarm"); critical.push(C.title); }
    const gt = $(`[data-drop="${z}"] .lk-ghosttok`, G.stage); if (gt) gt.remove();
    $(`[data-drop="${z}"]`, G.stage).insertAdjacentHTML("afterbegin", `<span class="lk-zv ${res}">${icon(res === "goed" ? "check" : res === "half" ? "half" : "x", "sm")}${crit ? "Kritieke misser" : res === "goed" ? "Jij, goed" : res === "half" ? "Jij, half goed" : "Jij, fout"}</span>`);
    $(`[data-zone="${C.zone}"]`, G.stage).classList.add("right");
    $(`[data-hl="${C.zone}"]`, G.stage).classList.add("on", ZONES[C.zone].cls);
    $$(`[data-col="${C.zone}"]`, G.stage).forEach((c, r) => setTimeout(() => c.classList.add("hl"), Mini.reduce || G.shot ? 0 : r * 110));
    $("[data-needle]", G.stage).classList.add("set");
    cons(C.zone, "right", z);
    placed.push({ i: idx, z, res });
    if (res === "goed") streak++; else streak = 0;
    const extra = sure && res !== "goed" ? 10 : 0;
    G.record({ result: res, points: pts, shield: (res === "goed" ? 0 : res === "half" ? 5 : crit ? 25 : 15) + extra, q: C.title + (crit ? " (kritieke misser)" : ""),
      a: ZONES[z].name + (sure ? " (zeker)" : ""), why: C.why, title: res === "goed" ? "Goed" : res === "half" ? "Half goed" : crit ? "Kritieke misser" : "Niet goed",
      short: `Hoort bij ${ZONES[C.zone].name.toLowerCase()}.${extra ? " Je wist het zeker, dat kost 10 procent extra schild." : ""}` });
    if (sure && res === "goed") G.gem("Je wist het zeker, en terecht.");
    side("fb", { res, C, chosen: z, pts, sure });
  }

  /* FLIP: laat een element vanaf een oude plek naar zijn nieuwe plek schuiven. */
  function fly(el, from, ms) {
    const to = el.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2), dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const sc = Math.min(2.4, from.width / to.width);
    const a = el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sc})`, opacity: .6 }, { transform: "none", opacity: 1 }], { duration: ms || 420, easing: "cubic-bezier(.3,.8,.3,1)" });
    return a.finished.catch(() => {});
  }

  function end() {
    const good = G.log.filter((x) => x.result === "goed").length;
    if (G.hints === 0 && good >= 5) G.gem();
    const T = "Elk (mogelijk) datalek meld je direct bij de Privacy Officer, ook bij laag risico en ook bij twijfel. Hoe erger de gegevens, hoe meer mensen en hoe onbekender de ontvanger, hoe hoger het risico. De Privacy Officer beslist over een melding bij de AP binnen 72 uur.";
    if (!critical.length) { G.finish({ takeaway: T }); return; }
    const isCrit = (x) => /kritieke misser/.test(x.q);
    const review = G.log.filter(isCrit).concat(G.log.filter((x) => !isCrit(x)));
    G.finish({ takeaway: T, stars: 0, pass: false, headline: "Kritieke misser", review,
      sub: `${critical.join(" en ")} lag twee zones te laag. Dan blijven een AP-melding en het informeren van de crew uit.` });
    G.head("Debriefing", `<span class="chip warn">${icon("alert", "sm")}Kritieke misser, hoog risico onderschat</span>`);
    const sc = $(".score-card", G.stage); if (sc) sc.classList.add("lk-critical");
  }

  /* ---------- Vaste standen voor schermafbeeldingen (?shot=) ---------- */
  if (G.shot) {
    G.begin();
    const pre = (list) => list.forEach(([i, z]) => {
      const C = CASES[i], d = Math.abs(z - C.zone), res = d === 0 ? "goed" : d === 1 ? "half" : "fout";
      $(`[data-drop="${C.zone}"]`, G.stage).insertAdjacentHTML("beforeend", `<div class="lk-token ${res}${z !== C.zone ? " moved" : ""}" title="${esc(C.title)}"><span class="ta">${ART[C.art]}</span><span class="tt">${esc(C.short)}</span></div>`);
      const crit = C.zone - z >= 2; if (crit) critical.push(C.title);
      G.record({ result: res, points: res === "goed" ? 10 : res === "half" ? 5 : 0, shield: res === "goed" ? 0 : res === "half" ? 5 : crit ? 25 : 15, q: C.title + (crit ? " (kritieke misser)" : ""), a: ZONES[z].name, why: C.why, toast: false });
    });
    if (G.shot === "play") { pre([[0, 2], [1, 0]]); showCase(2); setTimeout(() => { preview(1); choose(1); }, 600); }
    if (G.shot === "feedback") { pre([[0, 2], [1, 0], [2, 1]]); showCase(3); choose(1); reveal(1); }
    if (G.shot === "result") { pre([[0, 2], [1, 0], [2, 1], [3, 1], [4, 1], [5, 2], [6, 3]]); G.gem(); end(); }
  }
})();
