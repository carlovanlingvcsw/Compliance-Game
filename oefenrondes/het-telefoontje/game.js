/* Het telefoontje. Onderwerp: phishing en beveiliging, module Vrachtdok.
   Op de communicatieconsole van het Vrachtdok komt een gesprek binnen. "Jeroen van IT-beheer" vraagt
   om de inlogcode die op je telefoon staat. Per beurt kies je wat je zegt, of je tikt de code aan om hem
   voor te lezen. De drukmeter laat zien welk drukmiddel hij op welk moment inzet, en aarzelen laat de druk
   oplopen. Daarna bel je iemand terug en meld je het, of niet. Elke route eindigt in een eigen afloop. */
(function () {
  "use strict";
  const { game, icon, esc, $, $$, h, wait, FACES, crewFace } = Mini;
  const CODE = "482913", NUM_BAD = "0247\u00a04409", NUM_OK = "0247\u00a04400";
  const JEROEN = crewFace(7711, { hairStyle: "short", hair: "#5b3a1e", skin: "#e8c2a0", suit: "#0c2f5f", accent: "#ffb900", glasses: true });
  /* Korte houding per antwoord, zonder te verraden wat goed is. */
  const STANCE = { nummer: "verifiëren", half: "deels", weiger: "weigeren", waarom: "verifiëren", mail: "verifiëren", ophangen: "weigeren", laatste: "deels", alles: "meegaan",
    bram: "collega vragen", terugbeller: "terugbellen", intranet: "terugbellen", niemand: "niets doen", reset: "deels", eerlijk: "melden", zwijg: "niets zeggen", jeroen: "verifiëren", melden: "melden" };
  const FEMKE = crewFace(4400, { hairStyle: "bob", hair: "#3b2414", skin: "#d7a782", suit: "#0a6dbe", accent: "#7bf1a8", glasses: false });
  const TACTICS = { gezag: "Gezag", kennis: "Hij kent je", haast: "Haast", dreiging: "Dreiging" };

  /* Regels van de beller. Een stuk tussen [[middel|...]] is een drukmiddel: dat lampje gaat aan op het moment dat hij het zegt. */
  const TURNS = [
    { key: "vraag", step: "De vraag", who: "Jeroen", ask: "Wat zeg je?", base: 10, timed: 18,
      line: () => "Goedemorgen, met Jeroen van [[gezag|IT-beheer]]. Jij bent toch [[kennis|de cadet op het Vrachtdok]]? We zien vreemde inlogpogingen. [[dreiging|Ik moet je account blokkeren.]] Je krijgt zo een code in je app. Lees je die even voor?",
      hint: "Wie vraagt hier om je code? En wie doet dat nooit?",
      aria: () => G.calm ? "Hij wil je code. Neem de tijd, aarzelen kost hier niets." : "Hij wil dat je snel antwoordt. Snel is niet hetzelfde als goed.",
      opts: () => [
        { id: "nummer", t: "Wat is je personeelsnummer eigenlijk, Jeroen?", r: "fout", p: 0, sh: 10, say: "Natuurlijk. P-20417. [[haast|Lees je nu de code voor? Hij verloopt zo.]]", gev: "Hij noemt zonder aarzelen een nummer en dringt verder aan.", why: "Een beller kan elk nummer noemen, dus dit controleert niets. Je blijft in zijn gesprek en hij voelt zich bevestigd. Echt controleren doe je via een kanaal dat jij zelf kiest, zoals het nummer van de servicedesk op het intranet." },
        { id: "half", t: "Oké, alleen de eerste helft dan. 4\u00a08\u00a02.", r: "fout", p: 0, sh: 20, leak: [0, 1, 2], say: "Top. [[haast|En de laatste drie? Hij verloopt zo.]]", gev: "Hij noteert ze en wil meteen de rest.", why: "Ook een deel van je code is te veel. De servicedesk of een beheerder vraagt nooit om je inlogcode, ook niet om een stukje." },
        { id: "weiger", t: "Geen codes via de telefoon, ik hang nu op.", r: "goed", p: 25, sh: 0, say: "[[dreiging|Wacht even, niet ophangen! Dan gaat je account echt dicht.]]", gev: "Hij schrikt en probeert je aan de lijn te houden. Jij gaf niets.", why: "De servicedesk en beheerders vragen nooit om je wachtwoord of je inlogcode. Wie dat wel doet, is niet te vertrouwen." },
        { id: "waarom", t: "Waarom heb je mijn code eigenlijk nodig?", r: "half", p: 10, sh: 5, say: "Het systeem staat in noodstand. [[haast|Ik heb die code echt nu nodig.]]", gev: "Hij heeft meteen een verhaal klaar en dringt verder aan.", why: "Half goed. Je wantrouwt de vraag, maar je mist het belangrijkste. Wie om je inlogcode vraagt, is niet te vertrouwen, en dan hang je op. Met een vraag blijf je in zijn gesprek en hij heeft altijd een antwoord klaar." }
      ] },
    { key: "druk", step: "De druk", who: "Jeroen", ask: "Wat zeg je nu?", base: 35, timed: 12,
      line: () => "Luister. [[gezag|Kapitein Vega wacht hierop.]] [[dreiging|Over twee minuten gaat je account op slot.]] [[kennis|Je werkt toch met Bram?]] [[haast|" + (S.leak.length ? "Alleen de laatste drie nog, dan ben je klaar." : "Alleen die code nog, dan ben je klaar.") + "]]",
      hint: "Kijk naar de drukmeter. Hoe meer druk iemand zet, hoe meer reden om op te hangen.",
      aria: () => "De meter slaat uit. Luister wat hij allemaal inzet.",
      opts: () => [
        { id: "mail", t: "Mail het eerst, dan lees ik hem voor.", r: "half", p: 10, sh: 10, say: "Komt eraan. Ik bel je zo terug.", gev: "Hij belooft een mail en hangt op. Zo'n mail kan hij zelf vervalsen.", why: "Half goed. Je houdt hem op afstand, maar je mist het belangrijkste. Een inlogcode geef je aan niemand, ook niet na een mail. En zo'n mail kan hij net zo goed vervalsen." },
        { id: "ophangen", t: "Nee, ik geef je niets. Ik hang nu op.", r: "goed", p: 25, sh: 0, hang: true, gev: "De lijn is dood en de druk is weg. Nu kun je rustig zelf controleren.", why: "Hoe harder iemand aandringt, hoe meer reden om op te hangen. Ophangen is niet onbeleefd, het is veilig." },
        S.leak.length
          ? { id: "laatste", t: "Oké, de laatste drie dan. 9\u00a01\u00a03.", r: "fout", p: 0, sh: 20, leak: [3, 4, 5], say: "Top, dank je wel. Ik regel het verder.", gev: "Hij bedankt je en hangt op. Nu kan hij als jou inloggen.", why: "Hij zette alles tegelijk in. De kapitein, haast, een dreiging en de naam van je collega. Dat iemand Bram kent, bewijst niets. Met je code kan hij proberen als jou in te loggen." }
          : { id: "laatste", t: "Alleen de laatste drie dan. 9\u00a01\u00a03.", r: "fout", p: 0, sh: 20, leak: [3, 4, 5], say: "Top, dank je wel. Ik regel het verder.", gev: "Hij bedankt je en hangt op. Hij probeert de rest te raden.", why: "Ook een deel van je code is te veel. Dat hij Bram kent, bewijst niets. Met je code kan hij proberen als jou in te loggen." },
        { id: "alles", t: "Goed dan, ik lees de hele code voor.", r: "fout", p: 0, sh: 25, leak: [0, 1, 2, 3, 4, 5], say: "Top, dank je wel. Ik regel het verder.", gev: "Hij bedankt je en hangt op. Nu kan hij als jou inloggen.", why: "Precies waar hij op rekende. De angst voor een blokkade moest je laten handelen voordat je nadacht. Met je code kan hij proberen als jou in te loggen." }
      ] },
    { key: "terug", step: "Terugbellen", who: null, ask: "Wie bel je nu?",
      line: () => "Het gesprek is voorbij. Op je telefoon staan zijn nummer en het nummer van de servicedesk dat je op het intranet opzocht.",
      hint: "Vergelijk de twee nummers op je telefoon. Welk nummer heb jij zelf opgezocht?",
      aria: () => "Op je telefoon staan twee nummers. Kijk goed.",
      opts: () => [
        { id: "bram", t: "Bram bellen, hij kent iedereen op het dok.", r: "half", p: 10, sh: 5, say: "Jeroen? Geen idee. Bel de servicedesk even.", gev: "Bram kent geen Jeroen en weet het ook niet. Je bent tijd kwijt.", why: "Half goed. Navragen is slim, maar je mist het belangrijkste. Bram kan niet zien wie er belde en kan niets blokkeren. De servicedesk wel, via het nummer dat je zelf opzocht." },
        { id: "terugbeller", t: `Terugbellen via de nummerweergave, ${NUM_BAD}.`, r: "fout", p: 0, sh: 10, say: "Met Jeroen, IT-beheer. [[kennis|Ah, daar ben je weer.]]", gev: "Jeroen neemt op. Je praat weer met de beller zelf.", why: "Dat is het nummer van de beller. Terugbellen via de nummerweergave bewijst niets. Kies zelf het bekende nummer." },
        { id: "intranet", t: `De servicedesk via het intranet, ${NUM_OK}.`, r: "goed", p: 25, sh: 0, gev: "Je belt het nummer dat je zelf opzocht. Femke van de servicedesk neemt op.", why: "Je controleert via een kanaal dat je zelf kiest, niet via het nummer van de beller." },
        { id: "niemand", t: "Niemand bellen. Het gesprek is toch voorbij.", r: "fout", p: 0, sh: 10,
          gev: S.leak.length ? "Niemand weet dat je code weg is. De beller heeft vrij spel." : "Niemand weet van het telefoontje. Hij kan rustig een collega bellen.",
          why: S.leak.length ? "Je code is weg. Wachten maakt het erger. Meld het direct en wijzig je wachtwoord via het portaal dat je kent." : "Melden is altijd nodig, ook als je niets gaf. Misschien belt hij straks een collega die minder alert is." }
      ] },
    { key: "meld", step: "Melden", who: "Femke", ask: "Wat zeg je tegen de servicedesk?",
      line: () => "Servicedesk Orion, met Femke. Waarmee kan ik je helpen?",
      hint: "Wat heeft de servicedesk nodig om je account te beschermen en de crew te waarschuwen?",
      aria: () => "De servicedesk luistert. Wat moeten ze van je weten?",
      opts: () => S.leak.length ? [
        { id: "reset", t: "Wil je alleen mijn wachtwoord resetten?", r: "half", p: 10, sh: 10, say: "Dat kan. Verder niets gebeurd?", gev: "Je wachtwoord is nieuw, maar de servicedesk weet niet dat je code weg is.", why: "Half goed. Een nieuw wachtwoord helpt, maar je mist het belangrijkste. Zeg wat er gebeurde. Alleen dan kan de servicedesk zien of iemand op je account zit en de crew waarschuwen." },
        { id: "eerlijk", t: "Een beller kreeg mijn code. Ik meld het.", r: "goed", p: 25, sh: 0, say: "Goed dat je meteen belt. Wij belden je niet en er werkt geen Jeroen bij IT-beheer. Ik blokkeer de sessies op je account. Wijzig je wachtwoord via het portaal dat je kent.", gev: "Femke blokkeert de sessies op je account. De beller staat weer buiten.", why: "Direct melden, eerlijk zeggen wat je gaf en je wachtwoord wijzigen via het bekende portaal. Iedereen kan erin trappen. Snel melden is wat telt." },
        { id: "zwijg", t: "Rare beller gehad, maar ik heb niets gezegd.", r: "fout", p: 0, sh: 15, say: "Gelukkig. Dan is er niets aan de hand.", gev: "Femke denkt dat alles goed is. Je account staat open.", why: "Wie verzwijgt wat er gebeurde, laat zijn account openstaan. Iedereen kan erin trappen. Eerlijk melden is wat telt." }
      ] : [
        { id: "jeroen", t: "Werkt er bij jullie een Jeroen op IT-beheer?", r: "half", p: 12, sh: 5, say: "Nee, die naam ken ik niet. Waarom vraag je dat?", gev: "Femke kent geen Jeroen, maar weet nog niet wat er gebeurde.", why: "Half goed. Navragen is goed, maar je mist het belangrijkste. Zeg meteen wat er gebeurde, wie belde en vanaf welk nummer. Dan kan de servicedesk de rest van de crew waarschuwen." },
        { id: "reset", t: "Kun je voor de zekerheid mijn wachtwoord resetten?", r: "fout", p: 0, sh: 5, say: "Dat kan. Is er iets gebeurd?", gev: "Je wachtwoord is nieuw, maar niemand weet van de beller.", why: "Een nieuw wachtwoord kan geen kwaad, maar je meldt niets. De servicedesk weet niets van de beller en kan de crew niet waarschuwen. Melden is hier de kern." },
        { id: "melden", t: `Een nepbeller vroeg mijn code, vanaf ${NUM_BAD}.`, r: "goed", p: 25, sh: 0, say: "Goed dat je belt. Wij belden je niet en er werkt geen Jeroen bij IT-beheer. Jij bent vandaag de derde. Ik waarschuw de hele crew.", gev: "Femke waarschuwt de hele crew voor dit nummer.", why: "Melden met wie belde, wat hij vroeg en vanaf welk nummer. Zo kan de servicedesk de rest van de crew waarschuwen." }
      ] }
  ];
  const READ = { id: "voorlezen", r: "fout", p: 0, sh: 25, say: "Top, dank je wel. Ik regel het verder.", gev: "Hij bedankt je en hangt op. Nu kan hij als jou inloggen.", why: "Je code voorlezen geeft de beller de sleutel tot je account. De servicedesk of een beheerder vraagt nooit om je inlogcode." };

  const G = game({ id: "het-telefoontje", title: "Het telefoontje", topic: "Phishing en beveiliging", module: "Vrachtdok", max: 100, steps: ["Briefing", "De vraag", "De druk", "Terugbellen", "Melden", "Debriefing"], onStart: () => ring() });
  const S = { turn: -1, leak: [], picks: [], pressure: 0, tactics: new Set(), chosen: true, nags: 0, fast: !!G.shot || Mini.reduce };

  /* ---------- Briefing ---------- */
  const art = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="tbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b2a58"/><stop offset="1" stop-color="#030c20"/></linearGradient>
    <linearGradient id="tmetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6f8c"/><stop offset="1" stop-color="#22314a"/></linearGradient></defs>
    <rect width="400" height="300" fill="url(#tbg)"/>
    <rect x="24" y="40" width="236" height="220" rx="18" fill="url(#tmetal)" stroke="#90a1b9" stroke-opacity=".5"/>
    ${[[36, 52], [248, 52], [36, 248], [248, 248]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#1d293d" stroke="#90a1b9"/>`).join("")}
    <rect x="44" y="62" width="196" height="176" rx="10" fill="#06224c"/>
    <circle cx="86" cy="104" r="28" fill="#0f172b" stroke="#ff6467" stroke-width="3"/><circle cx="86" cy="98" r="11" fill="#314158"/><path d="M68 124c3-10 10-14 18-14s15 4 18 14" fill="#314158"/>
    <text x="86" y="103" text-anchor="middle" font-family="Figtree,sans-serif" font-weight="800" font-size="12" fill="#90a1b9">?</text>
    <text x="124" y="96" font-family="Figtree,sans-serif" font-weight="700" font-size="15" fill="#fff">Jeroen</text>
    <text x="124" y="114" font-family="Source Sans 3,sans-serif" font-weight="600" font-size="13" fill="#ffd230">${NUM_BAD}</text>
    <g fill="#67caff">${Array.from({ length: 22 }, (_, i) => { const hgt = 6 + Math.abs(Math.sin(i * 1.7)) * 26; return `<rect x="${58 + i * 8}" y="${170 - hgt / 2}" width="4" height="${hgt}" rx="2"/>`; }).join("")}</g>
    <path d="M70 226a42 42 0 0 1 84 0" fill="none" stroke="#1d293d" stroke-width="10" stroke-linecap="round"/>
    <path d="M70 226a42 42 0 0 1 84 0" fill="none" stroke="#ff6467" stroke-width="10" stroke-linecap="round" stroke-dasharray="132" stroke-dashoffset="22"/>
    <path d="M112 226L146 202" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="112" cy="226" r="5" fill="#fff"/>
    <rect x="168" y="206" width="60" height="10" rx="5" fill="#ff6467" opacity=".8"/><rect x="168" y="222" width="44" height="10" rx="5" fill="#ffb900" opacity=".8"/>
    <g transform="rotate(8 320 160)"><rect x="272" y="56" width="104" height="200" rx="18" fill="#0f172b" stroke="#62748e" stroke-width="3"/>
    <rect x="280" y="72" width="88" height="168" rx="10" fill="#eef3f9"/>
    <rect x="288" y="82" width="56" height="8" rx="4" fill="#0a6dbe"/>
    <text x="324" y="150" text-anchor="middle" font-family="Figtree,sans-serif" font-weight="800" font-size="22" fill="#0f172b">482 913</text>
    <rect x="290" y="166" width="68" height="6" rx="3" fill="#90a1b9"/><rect x="300" y="226" width="48" height="4" rx="2" fill="#62748e"/></g>
  </svg>`;
  G.intro({
    lead: "Je staat bij de communicatieconsole van het Vrachtdok. Er komt een gesprek binnen. Iemand van IT-beheer heeft je nodig, zegt hij. Op je telefoon verschijnt een inlogcode.",
    who: "ARIA",
    line: "Hij klinkt vriendelijk en hij weet veel van je. Kijk naar de drukmeter. Jij beslist wat je zegt en wie je daarna belt.",
    rules: [["msg", "Kies per beurt wat je zegt, of tik de code op je telefoon aan om hem voor te lezen. Elke keuze heeft gevolgen."],
      ["alert", "De <b>drukmeter</b> laat zien welk drukmiddel hij op welk moment inzet. Aarzel je, dan stijgt de druk."],
      ["gem", "Kristallen voor geen enkel cijfer geven, terugbellen via het bekende nummer en goed melden."]],
    art, start: "Naar de console", note: "Vier keuzes, ongeveer 3 minuten"
  });

  /* ---------- Het speelveld ---------- */
  function build() {
    G.stage.innerHTML = "";
    const n = h(`<div class="tf fade-in">
      <section class="tf-console" aria-label="Communicatieconsole Vrachtdok">
        <div class="tf-plate"><span class="screw"></span><span>Communicatieconsole Vrachtdok</span><span class="led" data-led></span><span class="screw"></span></div>
        <div class="tf-screen">
          <div class="tf-caller">
            <div class="tf-face" data-face>${JEROEN}</div>
            <div class="tf-id">
              <span class="tf-state" data-state>Inkomend gesprek</span>
              <b data-name>Onbekend nummer</b>
              <span class="tf-num" data-num><span>Nummerweergave</span>${NUM_BAD}</span>
            </div>
            <div class="tf-wave" data-wave aria-hidden="true">${Array.from({ length: 26 }, (_, i) => `<i style="--d:${(i * 37) % 9 / 10}s;--h:${30 + ((i * 53) % 70)}%"></i>`).join("")}</div>
          </div>
          <div class="tf-meter" data-meter>
            <div class="tf-gauge"><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M12 62a48 48 0 0 1 96 0" fill="none" stroke="#1d293d" stroke-width="12" stroke-linecap="round"/>
              <path data-arc d="M12 62a48 48 0 0 1 96 0" fill="none" stroke="url(#tfg)" stroke-width="12" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
              <defs><linearGradient id="tfg"><stop offset="0" stop-color="#ffb900"/><stop offset="1" stop-color="#ff6467"/></linearGradient></defs>
              <g data-needle class="needle"><path d="M60 62L60 22" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g><circle cx="60" cy="62" r="6" fill="#fff"/></svg>
              <div><b>Druk</b><span data-plabel>Rustig</span></div></div>
            <div class="tf-mright"><ul class="tf-tactics" aria-label="Drukmiddelen">${Object.keys(TACTICS).map((k) => `<li data-t="${k}" class="t-${k}">${esc(TACTICS[k])}</li>`).join("")}</ul>
            <div class="tf-push" data-push hidden><span>${icon("clock", "sm")}<b data-ptxt></b></span><div class="bar"><i data-pbar></i></div></div></div>
          </div>
          <div class="tf-leakbar" data-leakbar hidden></div>
          <div class="tf-subt" data-subt aria-live="polite"><span class="who"><span class="nu">Nu</span>Console</span><p>De console gaat over.</p></div>
          <div class="tf-loghead">Eerder in het gesprek<span data-lognote></span></div>
          <div class="tf-log" data-log></div>
        </div>
      </section>
      <section class="tf-phone-wrap" aria-label="Jouw telefoon">
        <div class="tf-phone"><div class="tf-notch"></div><div class="tf-pscreen" data-phone></div><div class="tf-home"></div></div>
      </section>
      <section class="tf-side" data-side></section>
    </div>`);
    G.stage.appendChild(n);
    phone("lock");
    if (window.ResizeObserver) new ResizeObserver(() => fitLog()).observe($("[data-log]", n));
  }

  /* ---------- Telefoon ---------- */
  function phone(mode) {
    const el = $("[data-phone]", G.stage); el.dataset.mode = mode;
    const bar = `<div class="tf-pbar"><span>09.41</span><span>${icon("lock", "sm")}</span></div>`;
    if (mode === "lock") el.innerHTML = `${bar}<div class="tf-lock"><b>09.41</b><span>donderdag</span><p>Geen meldingen</p></div>`;
    if (mode === "code") el.innerHTML = `${bar}<div class="tf-app slide-up"><div class="tf-apphead">${icon("shield")}Orion Authenticator</div>
      <div class="tf-acc">Stationsaccount<br><span>cadet.datawacht@<wbr>orion.space</span></div>
      <div class="tf-codelbl">Inlogcode</div>
      <div class="tf-code" data-code>${CODE.split("").map((d, i) => `<button type="button" data-d="${i}" disabled aria-label="Cijfer ${d} voorlezen">${d}</button>`).join("")}</div>
      <button type="button" class="tf-tapbtn" data-tap hidden>${icon("hand", "sm")}<span>Code voorlezen</span></button>
      <div class="tf-timer">${icon("lock", "sm")}Alleen voor jou</div></div>`;
    if (mode === "calls") el.innerHTML = `${bar}<div class="tf-calls slide-up"><div class="tf-apphead">${icon("phone")}Telefoon</div>
      <div class="tf-sub">Recent</div>
      <div class="tf-rec bad">${icon("phone", "sm")}<div><b>Onbekend</b><span>${NUM_BAD}</span><small>zojuist, 2 minuten</small></div></div>
      <div class="tf-sub">Opgezocht op het intranet</div>
      <div class="tf-rec ok">${icon("building", "sm")}<div><b>Servicedesk Orion</b><span>${NUM_OK}</span><small>intranet.orion.space</small></div></div></div>`;
    if (mode === "desk") el.innerHTML = `${bar}<div class="tf-incall slide-up"><div class="tf-pface">${FEMKE}</div><b>Servicedesk Orion</b><span>${NUM_OK}</span><small>In gesprek</small></div>`;
    if (mode === "code") { paintLeak(); $$("[data-d]", el).forEach((b) => b.addEventListener("click", () => readCode())); $("[data-tap]", el).addEventListener("click", () => readCode()); codeLive(!S.chosen && S.turn < 2 && !!S.opts); }
  }
  function codeLive(on) {
    $$("[data-d]", G.stage).forEach((b) => { b.disabled = !on || S.leak.includes(+b.dataset.d); });
    const t = $("[data-tap]", G.stage); if (t) t.hidden = !on || S.leak.length === 6;
    $("[data-code]", G.stage)?.classList.toggle("live", on && S.leak.length < 6);
  }
  function paintLeak() {
    $$("[data-d]", G.stage).forEach((d) => d.classList.toggle("leak", S.leak.includes(+d.dataset.d)));
    const note = $("[data-leaknote]", G.stage);
    if (note) { note.hidden = !S.leak.length; $("[data-leaktxt]", G.stage).textContent = S.leak.length === 6 ? "Hele code gedeeld met de beller" : `${S.leak.length} van 6 cijfers gedeeld met de beller`; }
    const lb = $("[data-leakbar]", G.stage);
    if (S.leak.length) {
      lb.hidden = false;
      lb.innerHTML = `${icon("alert", "lg")}<div><b>${S.leak.length === 6 ? "Je hele code is bij de beller" : `${S.leak.length} van 6 cijfers zijn bij de beller`}</b><span>${CODE.split("").map((d, i) => `<i class="${S.leak.includes(i) ? "on" : ""}">${S.leak.includes(i) ? d : "•"}</i>`).join("")}</span></div>`;
    }
  }
  /* Cijfers vliegen zichtbaar van de telefoon naar de beller. */
  async function leak(list) {
    const fresh = list.filter((d) => !S.leak.includes(d)); if (!fresh.length) return;
    const face = $("[data-face]", G.stage).getBoundingClientRect();
    for (const d of fresh) {
      const b = $(`[data-d="${d}"]`, G.stage);
      S.leak.push(d); S.leak.sort();
      if (b && !S.fast) {
        const r = b.getBoundingClientRect(); const f = h(`<div class="tf-fly">${CODE[d]}</div>`); document.body.appendChild(f);
        b.classList.add("leak");
        f.animate([{ transform: `translate(${r.left}px, ${r.top}px) scale(1)` }, { transform: `translate(${(r.left + face.left) / 2}px, ${Math.min(r.top, face.top) - 60}px) scale(1.4)`, offset: .45 }, { transform: `translate(${face.left + 20}px, ${face.top + 16}px) scale(.6)`, opacity: .3 }], { duration: 700, easing: "cubic-bezier(.4,0,.3,1)" }).finished.then(() => f.remove());
        Mini.sound.play("bad");
        await wait(170);
      }
    }
    if (!S.fast) await wait(600);
    paintLeak();
    const lb = $("[data-leakbar]", G.stage); lb.classList.remove("flash"); void lb.offsetWidth; lb.classList.add("flash");
  }

  /* ---------- Druk ---------- */
  function setPressure(v) {
    S.pressure = Math.max(0, Math.min(100, v));
    const m = $("[data-meter]", G.stage); v = S.pressure;
    $("[data-arc]", m).style.strokeDashoffset = 100 - v;
    $("[data-needle]", m).style.transform = `rotate(${-90 + v * 1.8}deg)`;
    $("[data-plabel]", m).textContent = v >= 80 ? "Zeer hoog" : v >= 45 ? "Hoog" : v > 15 ? "Oplopend" : v > 0 ? "Laag" : "Rustig";
    m.classList.toggle("hot", v >= 80);
    const f = $("[data-face]", G.stage); if (f) { f.classList.toggle("p-mid", v >= 45 && v < 80); f.classList.toggle("p-hot", v >= 80); }
  }
  function lightTactic(t) {
    S.tactics.add(t); S.turnTac && S.turnTac.add(t);
    const li = $(`[data-t="${t}"]`, G.stage); if (!li) return;
    li.classList.add("on"); li.classList.remove("now"); void li.offsetWidth; li.classList.add("now");
    setPressure(S.pressure + 10);
  }
  function calmDown() { setPressure(0); $$("[data-t]", G.stage).forEach((li) => li.classList.remove("on", "now")); }

  function caller(who) {
    const face = $("[data-face]", G.stage), nm = $("[data-name]", G.stage), num = $("[data-num]", G.stage), st = $("[data-state]", G.stage);
    face.classList.remove("ringing");
    if (who === "Jeroen") { face.innerHTML = JEROEN; face.classList.add("bad"); nm.innerHTML = `Jeroen <small>zegt: IT-beheer</small>`; num.className = "tf-num"; num.innerHTML = `<span>Nummerweergave</span>${NUM_BAD}`; st.textContent = "In gesprek"; }
    if (who === "Femke") { face.innerHTML = FEMKE; face.classList.remove("bad"); nm.innerHTML = `Femke <small>servicedesk</small>`; num.className = "tf-num ok"; num.innerHTML = `<span>Gebeld via intranet</span>${NUM_OK}`; st.textContent = "In gesprek"; }
    if (who === "Bram") { face.innerHTML = FACES.Bram; face.classList.remove("bad"); nm.innerHTML = `Bram <small>Vrachtdok</small>`; num.className = "tf-num"; num.innerHTML = `<span>Gebeld</span>0247 4512`; st.textContent = "In gesprek"; }
    if (!who) st.textContent = "Gesprek beëindigd";
    $("[data-led]", G.stage).classList.toggle("off", !who);
  }

  /* ---------- Ondertitel en log ---------- */
  const parse = (text) => { const out = []; text.replace(/\[\[(\w+)\|([^\]]+)\]\]|([^\[]+)/g, (_, t, a, b) => { out.push(a ? { t, s: a } : { s: b }); }); return out; };
  const plain = (text) => text.replace(/\[\[\w+\|([^\]]+)\]\]/g, "$1");
  const faceOf = (who) => who === "Femke" ? FEMKE : who === "Bram" ? FACES.Bram : JEROEN;
  let subLine = null;
  function flushSub() {
    if (!subLine) return;
    logAdd(subLine.me ? "me" : "them", subLine.text, subLine.who); subLine = null;
    $("[data-subt]", G.stage).classList.add("old");
  }
  function logAdd(kind, text, who) {
    const log = $("[data-log]", G.stage);
    const b = h(kind === "sys" ? `<div class="tf-sys">${esc(text)}</div>` : `<div class="tf-b ${kind}">${kind === "them" ? `<span class="av">${faceOf(who)}</span>` : ""}<div><span class="nm">${kind === "me" ? "Jij" : esc(who)}</span><p>${kind === "them" ? parse(text).map((x) => x.t ? `<mark class="t-${x.t}">${esc(x.s)}</mark>` : esc(x.s)).join("") : esc(text)}</p></div></div>`);
    log.appendChild(b); fitLog();
  }
  /* Eerder in het gesprek: alleen hele ballonnen. Wat niet past, klapt in; de kop zegt hoeveel. */
  function fitLog() {
    const log = $("[data-log]", G.stage), note = $("[data-lognote]", G.stage); if (!log) return;
    const items = Array.from(log.children); items.forEach((e) => { e.hidden = false; });
    let n = 0;
    for (const e of items) { if (log.scrollHeight <= log.clientHeight + 1 || n >= items.length - 1) break; e.hidden = true; n++; }
    if (note) note.textContent = n ? `${n} ${n === 1 ? "oudere regel" : "oudere regels"} ingeklapt` : "";
  }
  function me(text) {
    flushSub(); subLine = { who: "Jij", text, me: true };
    const box = $("[data-subt]", G.stage); box.classList.remove("old"); box.classList.add("mine");
    box.innerHTML = `<span class="who"><span class="nu">Nu</span>Jij</span><p>${esc(text)}</p>`;
  }
  function sys(text) { flushSub(); logAdd("sys", text); }
  async function speak(who, text) {
    flushSub(); subLine = { who, text };
    const box = $("[data-subt]", G.stage); box.classList.remove("old", "mine");
    const segs = parse(text);
    box.innerHTML = `<span class="who"><span class="nu">Nu</span><span class="av">${faceOf(who)}</span>${esc(who)}</span><p>${segs.map((x, i) => `<span data-seg="${i}" class="${x.t ? "tac t-" + x.t : ""}">${esc(x.s)}</span>`).join("")}</p>`;
    requestAnimationFrame(fitLog);
    const wave = $("[data-wave]", G.stage);
    if (S.fast) { segs.forEach((x) => x.t && lightTactic(x.t)); return; }
    wave.classList.add("on");
    const words = segs.reduce((n, x) => n + x.s.trim().split(/\s+/).length, 0), per = Math.min(150, 3600 / words);
    $$("[data-seg]", box).forEach((e) => (e.style.opacity = ".18"));
    for (let i = 0; i < segs.length; i++) {
      const e = $(`[data-seg="${i}"]`, box); e.style.opacity = "1"; e.classList.add("now");
      if (segs[i].t) lightTactic(segs[i].t);
      await wait(per * segs[i].s.trim().split(/\s+/).length);
      e.classList.remove("now");
    }
    wave.classList.remove("on");
  }

  /* ---------- Verloop ---------- */
  function ring() {
    build(); setPressure(0);
    $("[data-face]", G.stage).classList.add("ringing", "bad");
    G.head("De vraag", `<span class="chip">${icon("phone", "sm")}Inkomend gesprek</span>`);
    Mini.sound.play("ring");
    $("[data-side]", G.stage).innerHTML = `<div class="tf-ask fade-in"><h3>De console gaat over</h3><p class="muted">Een onbekend nummer belt het Vrachtdok. Neem op om te horen wie het is.</p>
      <button class="btn lg tf-pickup" type="button" data-pickup>${icon("phone")}Opnemen</button></div>`;
    $("[data-pickup]", G.stage).addEventListener("click", () => { sys("Je neemt op"); turn(0); });
    $("[data-pickup]", G.stage).focus();
  }

  async function turn(i) {
    S.turn = i; S.chosen = false; S.turnTac = new Set(); const T = TURNS[i];
    G.setStep(i + 1);
    G.head(T.step, `<span class="chip">${icon("phone", "sm")}Beurt ${i + 1} van ${TURNS.length}</span>`);
    const side = $("[data-side]", G.stage);
    side.innerHTML = `<div class="tf-ask"><h3>${esc(T.ask)}</h3><p class="muted">${T.who ? esc(T.who) + " praat" : "Even kijken"}</p></div>`;
    if (i === 2) { caller(null); calmDown(); phone("calls"); sys(T.line()); }
    else {
      if (i === 3) { caller("Femke"); calmDown(); phone("desk"); sys("Je belt de servicedesk via het nummer op het intranet"); }
      if (i === 0) { caller("Jeroen"); setPressure(T.base); setTimeout(() => { phone("code"); Mini.sound.play("tap"); }, S.fast ? 0 : 1800); }
      if (i === 1) setPressure(Math.max(S.pressure, T.base));
      await speak(T.who, T.line());
    }
    const opts = T.opts(); S.opts = opts;
    side.innerHTML = `<div class="tf-ask fade-in"><div class="tf-askhead"><h3>${esc(T.ask)}</h3><button class="btn sm ghost" type="button" data-hint>${icon("bulb", "sm")}Aanwijzing</button></div>
      <div class="tf-opts" tabindex="-1" role="group" aria-label="${esc(T.ask)}">${opts.map((o, k) => `<button class="tf-opt" type="button" data-o="${k}"><span class="q">${icon(i === 2 ? "phone" : "msg", "sm")}</span><span class="tx">${esc(o.t)}</span></button>`).join("")}</div>
      <div class="tf-aria" data-aria>${G.sayHTML("ARIA", T.aria(), { side: `<span class="hintcost">${esc(G.hintLabel())}</span>` })}</div></div>`;
    $$("[data-o]", side).forEach((b) => b.addEventListener("click", () => choose(S.opts[+b.dataset.o])));
    $("[data-hint]", side).addEventListener("click", () => { const c = G.hint(); $("[data-aria]", side).innerHTML = G.sayHTML("ARIA", T.hint + (c ? " (min 10 procent schild)" : ""), { mood: "half" }); $("[data-hint]", side).disabled = true; });
    const pu = $("[data-push]", G.stage); pu.hidden = !T.timed;
    if (T.timed) $("[data-ptxt]", G.stage).textContent = G.calm ? "Hij wacht. Aarzelen laat de druk stijgen" : "Antwoord voor de balk leeg is";
    if (i < 2) { codeLive(true); startPush(i); }
    $(".tf-opts", side).focus({ preventScroll: true });
  }

  /* Wachtbalk. Hij loopt altijd leeg en de druk stijgt terwijl je aarzelt. Is hij leeg, dan dringt de beller aan.
     Alleen met Tijdsdruk aan kost dat schild. */
  let pushT = null;
  function stopPush() { clearInterval(pushT); pushT = null; }
  function startPush(i) {
    stopPush(); const bar = $("[data-pbar]", G.stage); if (!bar) return;
    const dur = Math.max(6, TURNS[i].timed * Math.pow(0.7, S.nags)) * 1000, t0 = performance.now(), p0 = S.pressure;
    if (G.shot) { bar.style.width = "48%"; return; }
    pushT = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / dur);
      bar.style.width = (1 - k) * 100 + "%";
      setPressure(Math.max(S.pressure, p0 + k * 18));
      if (k >= 1) { stopPush(); nag(i); }
    }, 100);
  }
  async function nag(i) {
    if (S.turn !== i || S.chosen) return;
    const lines = ["Hallo? Ben je er nog? [[haast|Hij verloopt zo, lees hem nou voor.]]", "[[dreiging|Ik heb niet de hele dag. Nog één minuut en je account gaat dicht.]]", "[[gezag|De kapitein vraagt waar het blijft.]] [[haast|Nu graag.]]"];
    const btns = $$("[data-o]", G.stage); btns.forEach((b) => (b.disabled = true));
    await speak("Jeroen", lines[S.nags % lines.length]);
    if (S.turn !== i || S.chosen) return;
    S.nags++;
    btns.forEach((b) => (b.disabled = false));
    const t = $("[data-ptxt]", G.stage);
    if (!G.calm) { G.damage(5); if (t) t.textContent = "Te lang stil. Min 5 procent schild"; }
    else if (t) t.textContent = "Hij dringt aan. De druk stijgt";
    startPush(i);
  }

  function readCode() {
    if (S.chosen || S.turn > 1) return;
    const rest = CODE.split("").map((_, i) => i).filter((i) => !S.leak.includes(i));
    choose(Object.assign({}, READ, { t: `Je leest voor: ${rest.map((i) => CODE[i]).join("\u00a0")}`, leak: rest }));
  }

  async function choose(o) {
    if (S.chosen) return; S.chosen = true; stopPush(); codeLive(false); $("[data-push]", G.stage).hidden = true;
    const T = TURNS[S.turn];
    $$("[data-o]", G.stage).forEach((b) => { b.disabled = true; b.classList.toggle("picked", S.opts[+b.dataset.o] === o); });
    S.picks[S.turn] = o.id;
    me(o.t);
    if (o.leak) await leak(o.leak);
    G.record({ result: o.r, points: o.p, shield: o.sh, q: `${T.step}: ${T.ask}`, a: o.t, why: o.why, title: o.r === "goed" ? "Goed" : o.r === "half" ? "Half goed" : "Niet goed", short: o.gev });
    await wait(350);
    if (S.turn < 2) {
      if (o.hang) await hangup("Je hangt op");
      else {
        if (o.say) await speak("Jeroen", o.say);
        if (S.turn === 1 || o.leak && S.leak.length === 6) await hangup("Jeroen hangt op");
      }
    } else if (S.turn === 2) {
      if (o.id === "terugbeller") { caller("Jeroen"); setPressure(40); await speak("Jeroen", o.say); await hangup("Je hangt snel op"); }
      if (o.id === "bram") { caller("Bram"); await speak("Bram", o.say); caller(null); sys("Je hangt op"); }
    } else if (S.turn === 3) await speak("Femke", o.say);
    if (S.turn === 1 && !S.leak.length) G.gem("Je gaf geen enkel cijfer van je code.");
    if (S.turn === 2 && o.r === "goed") G.gem("Je belde terug via het nummer dat je zelf opzocht.");
    if (S.turn === 3 && o.r === "goed") G.gem("Je meldde precies wat er gebeurde.");
    feedback(o);
  }

  async function hangup(t) {
    sys(t); Mini.sound.play("close");
    caller(null); calmDown(); $("[data-wave]", G.stage).classList.remove("on");
    await wait(250);
  }

  function feedback(o) {
    const T = TURNS[S.turn], best = S.opts.find((x) => x.r === "goed");
    const skip = S.turn === 0 && S.leak.length === 6; // hele code al voorgelezen, het gesprek is voorbij
    const last = S.turn === TURNS.length - 1;
    const nextLbl = last ? "Bekijk de afloop" : skip ? "Verder, het gesprek is voorbij" : S.turn === 2 && o.r !== "goed" ? "Bel alsnog de servicedesk" : "Verder";
    const side = $("[data-side]", G.stage);
    side.innerHTML = `<div class="tf-fb ${o.r} fade-in" role="status">
      <div class="tf-fbhead"><span class="dot">${icon(o.r === "goed" ? "check" : o.r === "half" ? "half" : "x")}</span><b>${o.r === "goed" ? "Goed" : o.r === "half" ? "Half goed" : "Niet goed"}</b><span class="pts">${o.p ? "+" + o.p : "0"} punten${o.sh ? `<small class="tf-shloss">${icon("shield", "sm")}Schild min ${o.sh} procent</small>` : ""}</span></div>
      ${STANCE[o.id] ? `<p class="tf-mine"><span>Jouw zet</span><em class="stance s-${o.r}">${esc(STANCE[o.id])}</em></p>` : ""}
      ${STANCE[o.id] === "deels" && !o.p ? `<p class="tf-mine-why">Deels meegaan telt als meegaan, dus nul punten.</p>` : ""}
      ${o.r !== "goed" ? `<p class="tf-best"><span>Beter was${STANCE[best.id] ? ` <em class="stance s-goed">${esc(STANCE[best.id])}</em>` : ""}</span><b>${esc(best.t)}</b></p>` : ""}
      <div class="tf-gevbox"><span class="lbl">${S.turn < 2 ? "Wat Jeroen nu kan doen" : "Het gevolg"}</span><p class="tf-gev">${esc(o.gev)}</p>
      ${S.leak.length ? `<div class="tf-gevcode"><span>Jeroen heeft nu</span>${CODE.split("").map((d, k) => `<i class="${S.leak.includes(k) ? "on" : ""}">${S.leak.includes(k) ? d : "•"}</i>`).join("")}</div>` : ""}</div>
      ${S.turn < 2 && S.turnTac.size ? `<div class="tf-used"><span>Zijn drukmiddelen in deze beurt</span><div>${[...S.turnTac].map((t) => `<i class="t-${t}">${esc(TACTICS[t])}</i>`).join("")}</div></div>` : ""}
      <p class="tf-why">${icon("bulb", "sm")}<span>${esc(o.why)}</span></p>
      <button class="btn" type="button" data-next>${nextLbl}${icon("arrow")}</button></div>`;
    const nb = $("[data-next]", side);
    nb.addEventListener("click", () => {
      if (last) return ending();
      if (skip) { S.picks[1] = "voorbij"; G.record({ result: "fout", points: 0, q: `${TURNS[1].step}: ${TURNS[1].ask}`, a: "Het gesprek was al voorbij", why: "Je had de hele code al voorgelezen. Er viel niets meer te weigeren.", toast: false }); return turn(2); }
      turn(S.turn + 1);
    });
    nb.focus();
  }

  function ending() {
    const leakN = S.leak.length, reported = S.picks[3] === "melden" || S.picks[3] === "eerlijk";
    const deel = leakN === 6 ? "je code" : "een deel van je code";
    const v = !leakN && reported ? ["goed", "Veilige afloop", "Je gaf niets, je hing op, je belde zelf het bekende nummer en je meldde het. Er belde niemand van IT. De servicedesk waarschuwt nu de hele crew."]
      : leakN && reported ? ["half", "Schade beperkt", `Je gaf ${deel}. Omdat je het meteen meldde, blokkeert de servicedesk de sessies op je account en wijzig je je wachtwoord via het portaal dat je kent. De beller staat snel weer buiten.`]
      : leakN && S.picks[3] === "reset" ? ["half", "Half dicht", "Je wachtwoord is gewijzigd, maar de servicedesk weet niet dat iemand je code had. Zo kunnen ze niet nagaan of hij al op je account zat en de crew niet waarschuwen. Meld het alsnog."]
      : leakN ? ["fout", "Je account staat open", `De beller heeft ${deel} en de servicedesk weet het niet. Doe nu alsnog twee dingen. Meld het direct via het bekende nummer van de servicedesk en wijzig je wachtwoord via het portaal dat je kent.`]
      : ["half", "Bijna veilig", "Je gaf niets, goed zo. Maar zonder een duidelijke melding kan de servicedesk de crew niet waarschuwen. Zeg altijd wie belde, wat hij vroeg en vanaf welk nummer."];
    G.head("Melden", `<span class="chip ${v[0] === "goed" ? "ok" : v[0] === "half" ? "warn" : "bad"}">${icon(v[0] === "goed" ? "check" : "alert", "sm")}Afloop: ${esc(v[1])}</span>`);
    caller(null); sys("Gesprek met de servicedesk beëindigd"); phone("code");
    const side = $("[data-side]", G.stage);
    side.innerHTML = `<div class="tf-end ${v[0]} fade-in"><span class="tf-endic">${icon(v[0] === "goed" ? "shield" : "alert", "lg")}</span><h3>${esc(v[1])}</h3><p>${esc(v[2])}</p>
      <ul><li class="${leakN ? "bad" : "ok"}">${icon(leakN ? "x" : "check", "sm")}${leakN ? (leakN === 6 ? "Hele code gegeven" : `${leakN} cijfers gegeven`) : "Geen cijfer gegeven"}</li>
      <li class="${S.picks[2] === "intranet" ? "ok" : "bad"}">${icon(S.picks[2] === "intranet" ? "check" : "x", "sm")}${S.picks[2] === "intranet" ? "Bekend nummer gebeld" : "Niet zelf het bekende nummer gekozen"}</li>
      <li class="${reported ? "ok" : "bad"}">${icon(reported ? "check" : "x", "sm")}${reported ? "Duidelijk gemeld" : "Niet duidelijk gemeld"}</li></ul>
      <button class="btn" type="button" data-fin>Naar de debriefing${icon("arrow")}</button></div>`;
    $("[data-fin]", side).addEventListener("click", end); $("[data-fin]", side).focus();
  }

  function end() {
    G.finish({ takeaway: "De servicedesk of een beheerder vraagt nooit om je wachtwoord of je inlogcode, ook niet om een deel. Vraagt iemand dat wel, geef niets, hang op, bel zelf terug via het bekende nummer en meld het." });
  }

  /* ---------- Vaste standen voor schermafbeeldingen (?shot=) ---------- */
  if (G.shot) {
    G.begin();
    (async () => {
      $("[data-pickup]", G.stage).click();
      await wait(60);
      if (G.shot === "play") { await choose(TURNS[0].opts().find((o) => o.id === "waarom")); await wait(20); await turn(1); $("[data-wave]", G.stage).classList.add("on"); }
      if (G.shot === "feedback") { await choose(TURNS[0].opts()[1]); }
      if (G.shot === "result") {
        [["goed", 25, 0, 0], ["goed", 25, 0, 1], ["fout", 0, 10, 2], ["half", 12, 5, 3]].forEach(([r, p, sh, t]) => { const o = TURNS[t].opts().find((x) => x.r === r); G.record({ result: r, points: p, shield: sh, q: `${TURNS[t].step}: ${TURNS[t].ask}`, a: o.t, why: o.why, toast: false }); });
        G.gem(); end();
      }
    })();
  }
})();
