/* Puzzel de persoon. Onderwerp: wat is een persoonsgegeven.
   Een bericht verlaat het station met losse gegevens. De speler scant ze één voor één en ziet het
   crewbord van de aankomsthal krimpen. Wijzen de gegevens samen één persoon aan, dan is het een
   persoonsgegeven, ook zonder naam. Wie oordeelt voordat alles gescand is, durft: dat levert
   een kristal op als het oordeel klopt. */
(function () {
  "use strict";
  const { game, icon, crewFace, rng, esc, $, $$, h, wait } = Mini;

  /* ---------- De crew van deze dienst: 21 mensen, vast gegenereerd ---------- */
  const DEPTS = [["Brug", 3], ["Ziekenboeg", 3], ["Vrachtdok", 5], ["Administratie", 3], ["Kantine", 2], ["Techniek", 4], ["Communicatie", 1]];
  const JOBS = { Brug: ["navigator", "stuurman"], Ziekenboeg: ["verpleegkundige", "laborant"], Vrachtdok: ["dokwerker", "ladingmeester"], Administratie: ["administrateur", "roosteraar"], Kantine: ["kok", "bediening"], Techniek: ["monteur", "elektricien"], Communicatie: ["communicatie-officier"] };
  const r = rng(2247);
  const crew = [];
  DEPTS.forEach(([d, n]) => { for (let i = 0; i < n; i++) crew.push({ dept: d, job: JOBS[d][i % JOBS[d].length], cap: false }); });
  crew.forEach((c, i) => { c.id = i; c.pass = "C-" + (1170 + i * 4 + ((r() * 3) | 0)); c.shift = i % 3 === 2 ? "nacht" : "dag"; c.year = 2204 + ((i * 7) % 24); });
  // Vaste feiten die de rondes nodig hebben
  crew.filter((c) => c.dept === "Vrachtdok").forEach((c, i) => { c.shift = i < 3 ? "nacht" : "dag"; c.job = i === 0 ? "kraanmachinist" : i % 2 ? "dokwerker" : "ladingmeester"; });
  crew.find((c) => c.dept === "Ziekenboeg").pass = "C-1182";
  [2, 9, 15, 20].forEach((i) => { crew[i].cap = true; }); crew[15].pass = "C-1214";
  const order = Mini.shuffle(crew, 9);

  /* ---------- De berichten ---------- */
  const ROUNDS = [
    { title: "Lijst voor de kantine", to: "Kantine-leverancier Stellar Foods", subject: "Extra maaltijd nachtdienst", why: "Drie gewone gegevens samen wijzen één crewlid aan. Dan is het een persoonsgegeven, ook al staat er geen naam bij.",
      text: ["Graag één extra maaltijd voor de", "van het", "in de", "deze week."], cards: [["Functie", "kraanmachinist", (c) => c.job === "kraanmachinist"], ["Afdeling", "vrachtdok", (c) => c.dept === "Vrachtdok"], ["Dienst", "nachtdienst", (c) => c.shift === "nacht"]],
      hint: "Kijk wat er overblijft na de functie. Hoeveel kraanmachinisten heeft het station?",
      fix: { q: "Repareer het bericht: klik op het gegeven dat eruit moet.", field: 0, newText: "geschrapt", okWhy: "Zonder de functie blijft er een groep van drie over. De kantine weet genoeg om te koken, en niemand is aan te wijzen.",
        wrong: { 1: "Zonder afdeling weet de kantine niet waar de maaltijd heen moet, en de functie wijst nog steeds één persoon aan.", 2: "Zonder dienst weet de kantine niet wanneer, en de functie wijst nog steeds één persoon aan." },
        pred: (c) => c.dept === "Vrachtdok" && c.shift === "nacht" } },
    { title: "Rooster voor de sportzaal", to: "Alle crew", subject: "Nieuwe tijden sportzaal", why: "Na beide gegevens blijft een groep over. Niemand is zo met redelijke middelen aan te wijzen, dus dit is geen persoonsgegeven.",
      text: ["De sportzaal is gereserveerd voor crew in de", "die", "zijn. Iedereen anders kan na 18.00 uur."], cards: [["Dienst", "dagdienst", (c) => c.shift === "dag"], ["Geboren", "geboren na 2215", (c) => c.year > 2215]],
      hint: "Een gegeven gaat over één persoon als je die persoon kunt aanwijzen. Hoe groot is de groep aan het eind?" },
    { title: "Een gevonden pas", to: "De Datawacht", subject: "Pas gevonden in gang B", why: "Een pasnummer hoort bij precies één crewlid. Je hebt geen naam nodig om te weten wie het is.",
      text: ["In gang B lag een toegangspas met", ". Wie kan hem ophalen?"], cards: [["Pasnummer", "nummer C-1182", (c) => c.pass === "C-1182"]],
      hint: "Een nummer zonder naam kan nog steeds één persoon aanwijzen. Hoeveel mensen hebben dit pasnummer?" },
    { title: "Statistiek voor de kapitein", to: "Kapitein Vega", subject: "Loon per afdeling", why: "Een gemiddelde over vier mensen zegt niets over één van hen. Dit is geen persoonsgegeven.",
      text: ["Het", "van afdeling", "is dit jaar met 2 procent gestegen."], cards: [["Gegeven", "gemiddelde loon", () => true], ["Afdeling", "Techniek", (c) => c.dept === "Techniek"]],
      hint: "Een gemiddelde gaat over een groep. Hoeveel mensen tellen mee?" },
    { title: "Zelfde statistiek, andere afdeling", to: "Kapitein Vega", subject: "Loon per afdeling, vervolg", why: "Communicatie heeft één crewlid. Het gemiddelde loon van die afdeling is gewoon zijn loon, dus een persoonsgegeven.",
      text: ["Het", "van afdeling", "is dit jaar met 6 procent gestegen."], cards: [["Gegeven", "gemiddelde loon", () => true], ["Afdeling", "Communicatie", (c) => c.dept === "Communicatie"]],
      hint: "Dezelfde vraag als net, maar tel goed hoeveel mensen er op deze afdeling werken.",
      fix: { q: "Repareer de statistiek: klik op het gegeven dat je aanpast.", field: 1, newText: "Brug en Communicatie", okWhy: "Samengevoegd met de Brug is het een gemiddelde over vier mensen. Niemand is aan te wijzen en de kapitein kan de cijfers toch gebruiken.",
        wrong: { 0: "Zonder het gemiddelde loon heeft de kapitein niets meer aan de statistiek. Het probleem is de kleine afdeling." },
        pred: (c) => c.dept === "Communicatie" || c.dept === "Brug" } },
    { title: "Beeld van de luchtsluis", to: "Beveiliging Kepler", subject: "Verdachte beweging luchtsluis 3", why: "Op het beeld zie je alleen een pet. Met het toegangslog erbij is het één crewlid. Gegevens die je samen kunt koppelen maken iemand herleidbaar.",
      text: ["Op het camerabeeld staat een", ". Volgens het", "ging die persoon om 14.02 uur naar buiten."], cards: [["Camerabeeld", "persoon met pet, van achteren", (c) => c.cap], ["Toegangslog", "toegangslog van pas C-1214", (c) => c.pass === "C-1214"]],
      hint: "Je ziet geen gezicht. Maar wat gebeurt er als je het beeld koppelt aan het toegangslog?" }
  ];
  [(n) => n === 1 ? "Drie gegevens samen. Alleen de kraanmachinist uit de nachtdienst blijft over." : `Drie gegevens samen. Er blijft een groep van ${n} over.`,
   (n) => `Dagdienst en geboren na 2215 samen. Er blijft een groep van ${n} over.`,
   (n) => n === 1 ? "Eén pasnummer. Precies één crewlid heeft pas C-1182." : `Pas C-1182 past bij ${n} crewleden.`,
   (n) => `Het gemiddelde van Techniek gaat over een groep van ${n} crewleden.`,
   (n) => n === 1 ? "Communicatie heeft maar één crewlid. Het gemiddelde is gewoon zijn loon." : `Communicatie heeft ${n} crewleden.`,
   (n) => n === 1 ? "Camerabeeld en toegangslog samen. Alleen de drager van pas C-1214 blijft over." : `Camerabeeld en toegangslog samen laten ${n} crewleden over.`].forEach((f, i) => { ROUNDS[i].outcome = f; });
  ["Eén kraanmachinist in de nachtdienst, dus herleidbaar. Schrap de functie en het mag weg.",
   "Dagdienst en geboren na 2215 laten een groep over. Niemand is aan te wijzen.",
   "Een pasnummer hoort bij precies één crewlid, ook zonder naam.",
   "Een gemiddelde over vier mensen van Techniek zegt niets over één van hen.",
   "Communicatie heeft één crewlid, dus het gemiddelde is zijn loon. Voeg samen met de Brug.",
   "Camerabeeld plus toegangslog wijst de drager van pas C-1214 aan."].forEach((t, i) => { ROUNDS[i].line = t; });
  ROUNDS.forEach((R) => { const left = crew.filter((c) => R.cards.every((k) => k[2](c))); R.left = left.length; R.answer = left.length === 1 ? "ja" : "nee"; });

  const G = game({ id: "puzzel-de-persoon", title: "Puzzel de persoon", topic: "Wat is een persoonsgegeven", module: "Aankomsthal", max: ROUNDS.length * 10, steps: ["Briefing", "Bericht 1", "Bericht 2", "Bericht 3", "Bericht 4", "Bericht 5", "Bericht 6", "Debriefing"], onStart: () => play(0) });

  /* ---------- Briefing: het crewbord en een bericht op de scanner ---------- */
  const faceG = (seed, x, y, s, opts) => `<g transform="translate(${x} ${y}) scale(${s})">${crewFace(seed, opts).replace(/<svg[^>]*>|<\/svg>/g, "")}</g>`;
  const art = `<svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" font-family="Figtree,Inter,sans-serif">
    <defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e2c58"/><stop offset="1" stop-color="#061631"/></linearGradient>
    <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#67caff" stop-opacity=".6"/><stop offset="1" stop-color="#67caff" stop-opacity="0"/></linearGradient></defs>
    <rect width="480" height="360" fill="url(#wall)"/>
    <g stroke="#13559b" stroke-width="2" fill="none"><path d="M0 40h480M0 300h480"/><path d="M120 0v40M360 0v40M60 300v60M420 300v60"/></g>
    <rect x="34" y="56" width="412" height="214" rx="14" fill="#08214a" stroke="#2a6bb0" stroke-width="2"/>
    <rect x="34" y="56" width="412" height="30" rx="14" fill="#0c2f5f"/><rect x="34" y="72" width="412" height="14" fill="#0c2f5f"/>
    <text x="52" y="76" font-size="14" font-weight="700" fill="#d3efff">Crewbord aankomsthal</text>
    <circle cx="424" cy="71" r="5" fill="#05df72"/>
    ${Array.from({ length: 12 }, (_, i) => { const x = 52 + (i % 6) * 64, y = 98 + Math.floor(i / 6) * 84, lit = i === 8; return `<g opacity="${lit ? 1 : i % 4 === 1 ? 0.25 : 0.55}"><rect x="${x}" y="${y}" width="56" height="74" rx="8" fill="#0c2f5f" stroke="${lit ? "#ffb900" : "#2a6bb0"}" stroke-width="${lit ? 3 : 1.2}"/>${faceG(800 + i, x + 3, y + 3, 0.42)}<rect x="${x}" y="${y + 56}" width="56" height="18" rx="4" fill="${lit ? "#ffb900" : "#06224c"}"/></g>`; }).join("")}
    <path d="M140 360 L240 272 L340 360 Z" fill="url(#beam)"/>
    <g transform="translate(116 292)"><rect width="248" height="56" rx="12" fill="#0a2550" stroke="#67caff" stroke-width="2"/>
      <rect x="12" y="14" width="70" height="28" rx="7" fill="#13559b"/><text x="47" y="33" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">functie</text>
      <rect x="90" y="14" width="70" height="28" rx="7" fill="#13559b"/><text x="125" y="33" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">afdeling</text>
      <rect x="168" y="14" width="68" height="28" rx="7" fill="#ffb900"/><text x="202" y="33" font-size="13" font-weight="700" fill="#2a1600" text-anchor="middle">dienst</text></g>
  </svg>`;
  G.intro({
    lead: "Zes berichten verlaten vandaag het station. Er staat geen naam in, alleen losse gegevens. Jij scant ze en kijkt wie er op het crewbord overblijft.",
    who: "ARIA",
    line: "Een naam is niet nodig om iemand aan te wijzen. Blijft er na de gegevens één crewlid over, dan gaat het bericht over een persoon.",
    rules: [["search", "Klik op een gemarkeerd gegeven om het te scannen. Het crewbord dimt iedereen die niet meer past en telt hoeveel crewleden overblijven."], ["user", "Eén crewlid over? Dan is het een <b>persoonsgegeven</b>. Een groep blijft een groep."], ["gem", "Durf je te kiezen voordat alles gescand is? Klopt het, dan krijg je een kristal. Een fout kost schild."]],
    art, note: "Zes berichten, ongeveer 4 minuten"
  });

  /* ---------- Een ronde ---------- */
  let R, idx, scanned, answered, fixing = false; const done = [], res = [];
  const hintBtn = () => `<button class="btn sm ghost" type="button" data-hint>${icon("bulb", "sm")}Aanwijzing</button><span class="hintcost">${esc(G.hintLabel())}</span>`;
  const field = (j) => `<button class="pp-field c${j}" type="button" data-k="${j}" aria-label="Scan ${esc(R.cards[j][0])}: ${esc(R.cards[j][1])}"><span class="lbl">${esc(R.cards[j][0])}</span>${esc(R.cards[j][1])}</button>`;
  function message() {
    let out = "";
    R.text.forEach((t, j) => { out += esc(t) + " "; if (R.cards[j]) out += field(j) + " "; });
    for (let j = R.text.length; j < R.cards.length; j++) out += field(j) + " ";
    return out.replace(/ \./g, ".");
  }
  function play(i) {
    idx = i; R = ROUNDS[i]; scanned = new Set(); answered = false; fixing = false;
    G.setStep(i + 1);
    G.head(R.title, `<span class="chip">Bericht ${i + 1} van ${ROUNDS.length}</span>`);
    G.stage.innerHTML = "";
    const n = h(`<div class="pp fade-in">
      <div class="pp-left">
        <section class="pp-board" aria-label="Crewbord van de aankomsthal">
          <div class="pp-board-top"><span class="lamp"></span><b>Crewbord aankomsthal</b><span class="grow"></span><p class="pp-count" data-countbox><span data-countpre>Alle</span> <b data-count>${crew.length}</b> <span data-countlbl>passen</span></p></div>
          <div class="pp-trail" data-trail><span>Scan een gegeven. Wie er niet bij past, wordt gedimd.</span></div>
          <div class="pp-grid" data-grid>${order.map((c) => `<div class="pp-face" data-id="${c.id}"><div class="pp-pips">${R.cards.map((_, j) => `<i class="c${j}"></i>`).join("")}</div><div class="pp-pic">${crewFace(1000 + c.id, c.cap ? { cap: true, hairStyle: "short" } : undefined)}</div><span>${esc(c.dept)}</span></div>`).join("")}</div>
        </section>
        <div data-say>${G.sayHTML("ARIA", "Klik op een gemarkeerd gegeven om het te scannen.", { side: hintBtn() })}</div>
      </div>
      <section class="pp-side">
        <article class="pp-msg" aria-label="Bericht dat het station verlaat">
          <div class="pp-msg-bar">${icon("mail", "sm")}<span>Uitgaand bericht</span><span class="grow"></span><span class="pp-stamp">Nog niet verzonden</span></div>
          <dl class="pp-msg-meta"><dt>Aan</dt><dd>${esc(R.to)}</dd><dt>Onderwerp</dt><dd>${esc(R.subject)}</dd></dl>
          <p class="pp-msg-body">${message()}</p>
          <p class="pp-msg-foot">${icon("search", "sm")}<span data-scanstate>${R.cards.length} ${R.cards.length === 1 ? "gegeven" : "gegevens"} te scannen</span><span class="pp-legend2"><span><i></i>nog scannen</span><span><i class="d"></i>gescand</span></span></p>
        </article>
        <div class="pp-q" data-q>
          <h3>Gaat dit bericht over één persoon?</h3>
          <p class="pp-dare" data-dare>${icon("gem", "sm")}<span>Kies voor je alles scant. Goed is een kristal.</span></p>
          <div class="pp-choices">
            <button class="pp-choice" type="button" data-a="ja">${icon("user", "lg")}<span><b>Persoonsgegeven</b><small>Het wijst één crewlid aan</small></span></button>
            <button class="pp-choice" type="button" data-a="nee">${icon("users", "lg")}<span><b>Geen persoonsgegeven</b><small>Het blijft een groep</small></span></button>
          </div>
        </div>
        <aside class="pp-stakes" data-stakes>${stakes()}</aside>
      </section>
    </div>`);
    G.stage.appendChild(n);
    $$("[data-k]", n).forEach((b) => b.addEventListener("click", () => fixing ? repair(+b.dataset.k) : scan(+b.dataset.k)));
    $$("[data-a]", n).forEach((b) => b.addEventListener("click", () => decide(b.dataset.a)));
    $("[data-hint]", n).addEventListener("click", hint);
    update(false);
  }

  /* Voortgang als strook, zonder cijfers in de vakjes: leest niet als een rij antwoordknoppen. */
  function stakes() {
    const st = ROUNDS.map((x, k) => `<li class="${done[k] || (k === idx ? "now" : "")}"></li>`).join("");
    const line = R.fix ? "Goed is 6 punten, repareren nog 4." : "Goed is 10 punten. Fout kost schild.";
    return `<p class="pp-stake-line">${icon("shield", "sm")}<span>${line}</span></p><div class="pp-prog"><span class="pp-prog-lbl">Bericht ${idx + 1} van ${ROUNDS.length}</span><ol class="pp-prog-bar" aria-hidden="true">${st}</ol></div>`;
  }
  function mark(j) {
    $$(".pp-face", G.stage).forEach((f) => { if (R.cards[j][2](crew[+f.dataset.id])) $(`.pp-pips i.c${j}`, f).classList.add("on"); });
  }
  function matches() { return crew.filter((c) => [...scanned].every((j) => R.cards[j][2](c))); }
  function update(animate) {
    const left = matches(), ids = new Set(left.map((c) => c.id));
    // Wie afvalt, valt gestaffeld af over het bord
    let k = 0;
    $$(".pp-face", G.stage).forEach((f) => {
      const on = ids.has(+f.dataset.id), was = !f.classList.contains("off");
      f.style.transitionDelay = animate && was && !on ? (k++ * 35) + "ms" : "0ms";
      f.classList.toggle("off", !on); f.classList.toggle("one", on && left.length === 1);
    });
    const cnt = $("[data-count]", G.stage), lbl = $("[data-countlbl]", G.stage), box = $("[data-countbox]", G.stage), pre = $("[data-countpre]", G.stage);
    const from = +cnt.textContent, to = left.length;
    pre.textContent = scanned.size ? "Nog" : "Alle";
    // getal en werkwoord lopen samen: "Nog 1 past", "Nog 7 passen"
    const show = (v) => { cnt.textContent = v; lbl.textContent = v === 1 ? "past" : "passen"; box.classList.toggle("single", v === 1); };
    if (to < from && animate && !Mini.reduce) { box.classList.remove("bump"); void box.offsetWidth; box.classList.add("bump"); }
    if (!animate || Mini.reduce) { show(to); return; }
    const t0 = performance.now(); const step = (now) => { const q = Math.min(1, (now - t0) / 600); show(Math.round(from + (to - from) * q)); if (q < 1) requestAnimationFrame(step); }; requestAnimationFrame(step);
  }
  async function scan(j) {
    if (scanned.has(j) || answered) return;
    scanned.add(j); Mini.sound.play("tap");
    const b = $(`[data-k="${j}"]`, G.stage); b.classList.add("done"); b.disabled = true;
    const grid = $("[data-grid]", G.stage); grid.classList.remove("sweep"); void grid.offsetWidth; grid.classList.add("sweep");
    await wait(320); mark(j); update(true);
    const rest = R.cards.length - scanned.size;
    $("[data-scanstate]", G.stage).textContent = rest ? `Nog ${rest} te scannen` : "Alles gescand";
    if (!rest) $("[data-dare]", G.stage).innerHTML = `${icon("check", "sm")}<span>Alles is gescand. Wat is je oordeel?</span>`;
    const n = matches().length;
    sayLine(`${R.cards[j][0]} ${R.cards[j][1]} is gescand. ${n === 1 ? "Nog één crewlid past." : `Nog ${n} crewleden passen.`} Gaat het bericht over één persoon?`);
  }
  function sayLine(t, mood) { $("[data-say]", G.stage).innerHTML = G.sayHTML("ARIA", t, { mood, side: answered ? "" : hintBtn() }); const hb = $("[data-hint]", G.stage); if (hb) hb.addEventListener("click", hint); }
  function hint() { const cost = G.hint(); sayLine(R.hint + (cost ? " Dat kostte 10 procent schild." : "")); }

  async function decide(a) {
    if (answered) return; answered = true;
    const dared = scanned.size < R.cards.length, ok = a === R.answer;
    $$("[data-a]", G.stage).forEach((b) => { b.disabled = true; b.classList.toggle("picked", b.dataset.a === a); });
    // de rest van de gegevens alsnog scannen, zodat je ziet waarom
    for (let j = 0; j < R.cards.length; j++) if (!scanned.has(j)) { await wait(220); scanned.add(j); const b = $(`[data-k="${j}"]`, G.stage); b.classList.add("done", "auto"); b.disabled = true; mark(j); update(true); await wait(Mini.reduce ? 100 : 650); }
    const trail = $("[data-trail]", G.stage);
    trail.innerHTML = `<p class="pp-outcome ${R.left === 1 ? "one" : ""}">${esc(R.outcome(R.left))}</p>`;
    done[idx] = ok ? "ok" : "bad"; $("[data-stakes]", G.stage).innerHTML = stakes();
    $("[data-scanstate]", G.stage).textContent = "Alles gescand";
    $$("[data-k]", G.stage).forEach((b) => (b.disabled = true));
    const stamp = $(".pp-stamp", G.stage);
    stamp.textContent = R.answer === "ja" ? "Bevat een persoonsgegeven" : "Geen persoonsgegeven";
    stamp.classList.add(R.answer === "ja" ? "warn" : "ok");
    const vpts = R.fix ? 6 : 10;
    G.record({ result: ok ? "goed" : "fout", points: ok ? vpts : 0, shield: ok ? 0 : 15, q: R.title, a: a === "ja" ? "Persoonsgegeven" : "Geen persoonsgegeven", why: R.why, title: ok ? (dared ? "Goed, kristal erbij" : "Goed") : "Niet goed", short: R.left === 1 ? "Er bleef één crewlid over." : `Er bleef een groep van ${R.left} over.` });
    // Kristal zonder eigen pil, zodat het rondelabel in beeld blijft
    if (ok && dared) G.gem();
    res[idx] = { a: a === "ja" ? "Persoonsgegeven" : "Geen persoonsgegeven", ok, fix: null };
    const last = idx === ROUNDS.length - 1;
    const one = R.left === 1 ? crew.find((c) => R.cards.every((k) => k[2](c))) : null;
    sayLine((ok && dared ? "Gedurfd en goed, dat is een kristal. " : "") + (R.fix ? "Nu repareren. Klik in het bericht op het gegeven dat je aanpast." : ok ? "Goed gezien." : "Niet goed. Kijk wie er op het bord overblijft."), ok ? "ok" : "bad");
    const q = $("[data-q]", G.stage);
    $(".pp-side", G.stage).classList.add("after");
    q.className = "pp-q pp-fb fade-in " + (ok ? "ok" : "bad");
    q.innerHTML = `<div class="pp-fb-head"><span class="pp-fb-ic">${icon(ok ? "check" : "x", "lg")}</span><div class="grow"><b>${ok ? (dared ? "Goed, en gedurfd" : "Goed") : "Niet goed"}</b><span>${R.answer === "ja" ? "Dit is een persoonsgegeven" : "Dit is geen persoonsgegeven"}</span></div>
      ${one ? `<div class="pp-fb-face">${crewFace(1000 + one.id, one.cap ? { cap: true, hairStyle: "short" } : undefined)}</div>` : `<div class="pp-fb-group"><b>${R.left}</b><span>blijven over</span></div>`}</div>
      <p>${esc(R.why)}</p>
      ${R.fix ? `<div class="pp-fix" data-fix><h4>${icon("pen", "sm")}${esc(R.fix.q)}</h4><p class="pp-fixhint">De gegevens in het bericht hierboven zijn weer klikbaar. Goed repareren levert 4 punten op.</p></div>` : ""}
      <div class="actions" data-nextrow ${R.fix ? "hidden" : ""}><button class="btn" type="button" data-next>${last ? "Naar de debriefing" : "Volgend bericht"}${icon("arrow")}</button>${!ok ? `<span class="hint-note">Min 15 procent schild</span>` : ""}</div>`;
    $("[data-next]", q).addEventListener("click", () => last ? end() : play(idx + 1));
    if (R.fix) { $$("[data-k]", G.stage).forEach((b) => { b.disabled = false; b.classList.add("fixable"); }); $("[data-k]", G.stage).focus({ preventScroll: true }); fixing = true; }
    else $("[data-next]", q).focus({ preventScroll: true });
  }

  /* Tweede handeling in sommige rondes: het bericht repareren zodat het toch weg kan. */
  async function repair(j) {
    if (!fixing) return; fixing = false;
    const F = R.fix, ok = j === F.field, q = $("[data-q]", G.stage);
    $$("[data-k]", G.stage).forEach((b) => { b.disabled = true; b.classList.remove("fixable"); });
    const picked = $(`[data-k="${j}"]`, G.stage), right = $(`[data-k="${F.field}"]`, G.stage);
    if (!ok) { picked.classList.add("wrongfix"); }
    if (res[idx]) res[idx].fix = { ok, what: R.cards[j][0].toLowerCase() };
    G.record({ result: ok ? "goed" : "fout", points: ok ? 4 : 0, shield: ok ? 0 : 10, q: R.title + ": repareren", a: R.cards[j][0] + " aangepast", why: ok ? F.okWhy : F.wrong[j] + " Goed was: " + R.cards[F.field][0].toLowerCase() + " aanpassen.", title: ok ? "Gerepareerd" : "Lost het niet op", short: ok ? F.okWhy : F.wrong[j] });
    await wait(ok ? 150 : 900);
    // het goede gegeven wordt doorgehaald of aangepast, het bord laat de groep zien
    right.classList.add("fixedtok");
    right.innerHTML = `<span class="lbl">${esc(R.cards[F.field][0])}</span><s>${esc(R.cards[F.field][1])}</s>${F.newText === "geschrapt" ? "" : " " + esc(F.newText)}`;
    const left = crew.filter(F.pred), ids = new Set(left.map((c) => c.id));
    $$(".pp-face", G.stage).forEach((f) => { const on = ids.has(+f.dataset.id); f.style.transitionDelay = "0ms"; f.classList.toggle("off", !on); f.classList.remove("one"); f.classList.toggle("fixed", on); });
    $("[data-count]", G.stage).textContent = left.length; $("[data-countpre]", G.stage).textContent = "Nu"; $("[data-countlbl]", G.stage).textContent = "passen"; $("[data-countbox]", G.stage).classList.remove("single");
    $("[data-trail]", G.stage).innerHTML = `<p class="pp-outcome fixed">Na de reparatie blijft een groep van ${left.length} over. Niemand is aan te wijzen.</p>`;
    const stamp = $(".pp-stamp", G.stage); stamp.textContent = "Gerepareerd, kan weg"; stamp.className = "pp-stamp ok";
    $("[data-fix]", q).insertAdjacentHTML("beforeend", `<p class="pp-fixwhy ${ok ? "ok" : "bad"}">${icon(ok ? "check" : "x", "sm")}<span>${esc(ok ? F.okWhy : F.wrong[j] + " Het bord toont de goede reparatie.")}</span></p>`);
    $(".pp-fixhint", q).remove();
    $("[data-nextrow]", q).hidden = false; $("[data-next]", q).focus({ preventScroll: true });
  }

  function review() {
    return ROUNDS.map((x, i) => {
      const r = res[i]; if (!r) return { result: "fout", q: `${i + 1}. ${x.title}`, a: "Niet beantwoord", why: x.line };
      const fixTxt = r.fix ? (r.fix.ok ? `, ${r.fix.what} goed aangepast` : `, ${r.fix.what} aangepast (niet goed)`) : "";
      const result = r.fix ? (r.ok && r.fix.ok ? "goed" : r.ok || r.fix.ok ? "half" : "fout") : r.ok ? "goed" : "fout";
      return { result, q: `${i + 1}. ${x.title}`, a: r.a + fixTxt, why: x.line };
    });
  }
  function end() {
    G.finish({ review: review(), takeaway: "Wijst een gegeven, direct of door te koppelen, één persoon aan? Dan is het een persoonsgegeven, ook zonder naam." });
  }

  /* ---------- Vaste standen voor schermafbeeldingen (?shot=) ---------- */
  if (G.shot) {
    G.begin();
    if (G.shot === "play") { scan(1); setTimeout(() => scan(2), 400); }
    if (G.shot === "feedback") { scan(1); setTimeout(() => decide("ja"), 500); setTimeout(() => repair(0), 4200); }
    if (G.shot === "result") { [["goed", 10, 0], ["goed", 10, 0], ["fout", 0, 15], ["goed", 10, 0], ["goed", 6, 0], ["goed", 10, 0]].forEach(([rs, p, sh], i) => { const a = rs === "goed" ? (ROUNDS[i].answer === "ja" ? "Persoonsgegeven" : "Geen persoonsgegeven") : "Geen persoonsgegeven"; G.record({ result: rs, points: p, shield: sh, q: ROUNDS[i].title, a, why: ROUNDS[i].why, toast: false }); res[i] = { a, ok: rs === "goed", fix: ROUNDS[i].fix ? { ok: true, what: ROUNDS[i].cards[ROUNDS[i].fix.field][0].toLowerCase() } : null }; }); G.gem(); G.gem(); end(); }
  }
  window.__pp = { ROUNDS };
})();
