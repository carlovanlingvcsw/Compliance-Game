/* Zwart de lijst. Onderwerp: wat is een persoonsgegeven.
   Drie documenten verlaten het station. Ze liggen op de verzendconsole van de Aankomsthal.
   De speler zet met een zwarte stift door wat iemand aanwijst en laat staan wat de ontvanger
   nodig heeft voor zijn doel. Na versturen volgt per markering de uitleg: terecht weg,
   gemist (lekt, kost schild) of onnodig weg (de ontvanger mist iets, half goed). */
(function () {
  "use strict";
  const { game, icon, esc, $, $$, h, wait } = Mini;

  /* ---------- De documenten ----------
     Markering in de tekst: [p:id ...] moet weg (persoonsgegeven), [n:id ...] heeft de ontvanger nodig,
     [k:id ...] mag blijven. Een woord met ~ ervoor hoort bij het stuk, maar hoeft niet zwart.
     §sig§ is een handgeschreven handtekening. */
  const DOCS = [
    {
      id: "filter", kind: "Onderhoudsrapport", title: "Luchtfilter ring B uitgevallen", nr: "OR-2247-0318", date: "14 maart 2247", dept: "Afdeling Techniek",
      to: "AeroVent Systems", short: "AeroVent", toLong: "AeroVent Systems, leverancier van luchtfilters", purpose: "Garantieclaim op een kapot filter",
      need1: "welk filter het is, wat er kapot was en waar het nieuwe filter heen moet.",
      needs: "AeroVent beoordeelt of het filter onder de garantie valt en stuurt een nieuw filter. Daarvoor moeten ze weten om welk filter het gaat, wat er mis was en waar het nieuwe filter heen moet.",
      blocks: [
        { t: "table", rows: [["Filter", "[n:filter type HX-40, serienummer AV-88213]"], ["Geplaatst", "[k:plaatsing 2 januari 2247]"], ["Uitgevallen", "[k:datum 11 maart 2247, 03.40 uur]"], ["Drukval", "[k:druk van 120 naar 410 pascal in twee uur]"]] },
        { t: "p", x: "Technicus [p:bram Bram Dekker (pas C-1207)] vond bij de controle [n:scheur een scheur van 4 cm in de filtermat]. De storing begon in [p:hut hut B-214], waar [p:ilse Ilse Maas] woont. [p:astma Zij had die nacht een astma-aanval en is in de ziekenboeg behandeld.] Ze wil graag weten of dit vaker voorkomt en is te bereiken op [p:tel haar privénummer 7741 2290]." },
        { t: "p", x: "Wij vragen u een nieuw filter te sturen naar [n:adres Station Orion, Dok 2, Ringweg 1]." },
        { t: "sign", x: "[p:sig §sig§ Bram Dekker]", role: "Technicus, afdeling Techniek" }
      ],
      segs: {
        bram: { kind: "Naam en pasnummer", why: "Naam en pasnummer wijzen de technicus direct aan. AeroVent heeft voor de garantie alleen het filter nodig, niet wie het vond.", hint: "In de alinea onder de tabel staat een naam met een pasnummer." },
        hut: { kind: "Hutnummer", why: "Een hut hoort bij één bewoner. Ook zonder naam weet iedereen op het station dan over wie het gaat.", hint: "Een hutnummer hoort bij één bewoner. Staat er nog een in de tekst?" },
        ilse: { kind: "Naam", why: "Een naam wijst iemand direct aan. Voor de garantieclaim doet de bewoner er niet toe.", hint: "Er staat nog de naam van een bewoner in de tekst." },
        astma: { kind: "Gezondheidsgegeven", why: "Een astma-aanval is een gezondheidsgegeven, een bijzonder persoonsgegeven. Dat gaat niet zomaar naar een leverancier, en AeroVent heeft het niet nodig.", hint: "Er staat nog iets over iemands gezondheid in de tekst." },
        tel: { kind: "Privé telefoonnummer", why: "Een privénummer is van één persoon. Vragen over het filter kunnen via de afdeling Techniek.", hint: "Kijk naar het telefoonnummer. Is dat van de afdeling of van een persoon?" },
        sig: { kind: "Handtekening met naam", why: "Een handtekening met naam wijst de ondertekenaar aan. Het rapport komt van de afdeling Techniek, dat is genoeg.", hint: "Kijk onder de groet. Ook een handtekening wijst iemand aan." },
        filter: { kind: "Filtertype en serienummer", why: "AeroVent moet weten welk filter het is. Een serienummer van een filter wijst geen persoon aan." },
        scheur: { kind: "Het defect", why: "De scheur is waar de claim over gaat. Zonder deze woorden kan AeroVent de garantie niet beoordelen." },
        adres: { kind: "Stationsadres", why: "Dit is het algemene adres van het station. Het wijst niemand aan en AeroVent heeft het nodig om het filter te sturen." },
        plaatsing: { kind: "Datum van plaatsing", why: "Wanneer het filter is geplaatst is een technisch feit. Het wijst niemand aan en helpt AeroVent bij de claim." },
        datum: { kind: "Datum van de storing", why: "Het moment van de storing wijst niemand aan. Het mocht blijven." },
        druk: { kind: "Meetwaarden", why: "Drukwaarden zijn technische feiten. Ze wijzen niemand aan en laten zien wat er misging." }
      }
    },
    {
      id: "notulen", kind: "Notulen crewvergadering", title: "Crewvergadering van 9 maart", nr: "CV-2247-11", date: "9 maart 2247", dept: "Crewadministratie",
      to: "Station Kepler", short: "Kepler", toLong: "Station Kepler, afdeling Planning", purpose: "Kepler wil hetzelfde nachtrooster invoeren",
      need1: "het besluit over het nachtrooster, de ingangsdatum en de reden.",
      needs: "Kepler wil het nieuwe nachtrooster van Orion overnemen. Daarvoor moeten ze weten wat Orion besloot, vanaf wanneer het geldt en waarom.",
      blocks: [
        { t: "table", rows: [["Aanwezig", "[p:aanwezig Kapitein Vega, Luitenant Mira, Joris Bakker] en [k:aantal 14 crewleden]"], ["Plaats", "[k:plaats Kantine, ring A]"]] },
        { t: "h", x: "1. Nachtrooster" },
        { t: "p", x: "[n:rooster Vanaf 1 april draaien de nachtdiensten in blokken van vier nachten in plaats van zes.] [n:reden Na zes nachten op rij maakt de nachtploeg meer fouten bij het koppelen van vracht.] [p:piloot De enige vrouwelijke piloot ~van ~de ~nachtdienst] vertelde dat [p:slaap ze sinds januari slecht slaapt en slaapmiddelen gebruikt]." },
        { t: "h", x: "2. Kantine" },
        { t: "p", x: "[k:ontbijt Het ontbijt begint voortaan om 06.30 uur.] [p:kok De kok die vorige week begon] heeft [p:waarschuwing een officiële waarschuwing gekregen omdat hij twee keer te laat kwam]." },
        { t: "p", x: "Volgende vergadering: [k:volgende 6 april 2247]." },
        { t: "sign", x: "Notulist: [p:notulist Luitenant Mira]", role: "Crewadministratie", greet: false }
      ],
      segs: {
        aanwezig: { kind: "Namen van aanwezigen", why: "Namen wijzen mensen direct aan. Ook het woord Kapitein alleen is genoeg, want Orion heeft er maar één. Kepler heeft alleen het besluit nodig.", hint: "Kijk in de tabel bovenaan. Wie was er aanwezig?" },
        piloot: { kind: "Omschrijving die één persoon aanwijst", why: "Er staat geen naam, maar er is maar één vrouwelijke piloot in de nachtdienst. Iedereen weet over wie het gaat. Ook zo'n omschrijving is een persoonsgegeven.", hint: "Er staat geen naam bij, maar één omschrijving past maar bij één crewlid. Lees punt 1 nog eens." },
        slaap: { kind: "Gezondheidsgegeven", why: "Slecht slapen en slaapmiddelen gebruiken zijn gezondheidsgegevens, bijzondere persoonsgegevens. Kepler heeft ze niet nodig voor het rooster.", hint: "In punt 1 staat iets over iemands gezondheid." },
        kok: { kind: "Omschrijving die één persoon aanwijst", why: "Er is maar één kok die vorige week begon. Deze omschrijving wijst hem aan, ook zonder naam.", hint: "In punt 2 wordt iemand omschreven zonder naam. Hoeveel mensen passen bij die omschrijving?" },
        waarschuwing: { kind: "Gegeven over iemands werk", why: "Een waarschuwing gaat over het werk van één persoon. Dat hoort niet in een stuk voor een ander station, en Kepler heeft het niet nodig.", hint: "In punt 2 staat wat er met één crewlid is gebeurd. Heeft Kepler dat nodig?" },
        notulist: { kind: "Naam van de notulist", why: "Ook de naam van de notulist wijst iemand aan. De crewadministratie als afzender is genoeg.", hint: "Kijk helemaal onderaan. Wie schreef de notulen?" },
        rooster: { kind: "Het besluit", why: "Dit is het besluit dat Kepler wil overnemen, met de datum waarop het ingaat. Het wijst niemand aan." },
        reden: { kind: "De reden", why: "De reden gaat over de hele nachtploeg, niet over één persoon. Kepler heeft het nodig om de keuze te begrijpen." },
        aantal: { kind: "Aantal aanwezigen", why: "Een aantal wijst niemand aan. Het mocht blijven." },
        plaats: { kind: "Plaats van de vergadering", why: "Een ruimte op het station wijst niemand aan. Het mocht blijven." },
        ontbijt: { kind: "Ontbijttijd", why: "Kepler heeft de ontbijttijd niet nodig, maar het is ook geen persoonsgegeven. Het mocht blijven." },
        volgende: { kind: "Datum volgende vergadering", why: "Een datum van een vergadering wijst niemand aan. Het mocht blijven." }
      }
    },
    {
      id: "incident", kind: "Incidentmelding", title: "Container gevallen bij kraan 3", nr: "IM-2247-042", date: "12 maart 2247", dept: "Vrachtdok",
      to: "Stellar Assurantie", short: "Stellar", toLong: "Stellar Assurantie, verzekeraar van het vrachtdok", purpose: "Schadeclaim voor kapotte lading",
      need1: "wat er gebeurde, de oorzaak en hoe groot de schade aan de lading is.",
      needs: "Stellar beslist of de schade aan de lading wordt vergoed. Daarvoor moeten ze weten wat er gebeurde, wat de oorzaak was en hoe groot de schade is.",
      blocks: [
        { t: "table", rows: [["Tijdstip", "[k:tijd 12 maart 2247, 14.20 uur]"], ["Plaats", "[k:plek vrachtdok, kraan 3]"], ["Schade", "[n:schade 40 waterfilters onbruikbaar, waarde 18.400 credits]"]] },
        { t: "p", x: "Bij het lossen van vrachtschip Hesper viel een container 6 meter uit de grijper van kraan 3. Oorzaak: [n:oorzaak een gebroken borgpen in de grijper]. [n:keuring De borgpen is op 3 februari 2247 gekeurd en goedgekeurd.]" },
        { t: "p", x: "De kraan werd bediend door [p:kraan de enige kraanmachinist van het vrachtdok]. [p:femke ~Dokwerker Femke Arts (pas C-1190)] stond naast de container en [p:pols brak haar pols. Ze is drie weken ziek gemeld.]" },
        { t: "p", x: "Getuige: [p:getuige Yusuf Demir, bereikbaar op privénummer 7720 1184]. Vragen over de claim? Mail naar [k:mail vrachtdok@orion.space]." },
        { t: "sign", x: "[p:sig §sig§ Hanna Vos]", role: "Ladingmeester, afdeling Vrachtdok" }
      ],
      segs: {
        kraan: { kind: "Functie die één persoon aanwijst", why: "Het vrachtdok heeft maar één kraanmachinist. Deze functie wijst dus één persoon aan, ook zonder naam. Voor de lading hoeft Stellar niet te weten wie de kraan bediende.", hint: "Een functie die maar één persoon heeft, wijst die persoon aan. Lees de tweede alinea." },
        femke: { kind: "Naam en pasnummer", why: "Naam en pasnummer wijzen de dokwerker direct aan. Het woord dokwerker mag blijven, want het vrachtdok heeft er meer.", hint: "In de tweede alinea staat een naam met een pasnummer." },
        pols: { kind: "Gezondheidsgegeven", why: "Een gebroken pols en een ziekmelding zijn gezondheidsgegevens. De claim gaat over de lading, niet over het letsel.", hint: "In de tweede alinea staat iets over iemands gezondheid." },
        getuige: { kind: "Naam en privénummer", why: "Naam en privénummer van de getuige wijzen één persoon aan. Vragen kunnen via de mailbox van het vrachtdok.", hint: "Kijk bij de getuige. Wat heeft Stellar daarvan nodig?" },
        sig: { kind: "Handtekening met naam", why: "Een handtekening met naam wijst de ondertekenaar aan. De afdeling Vrachtdok als afzender is genoeg.", hint: "Kijk helemaal onderaan. Ook een handtekening wijst iemand aan." },
        schade: { kind: "De schade", why: "Hoeveel lading kapot is en wat die waard is, is de kern van de claim." },
        oorzaak: { kind: "De oorzaak", why: "De oorzaak bepaalt of de schade gedekt is. Een borgpen wijst niemand aan." },
        keuring: { kind: "De keuring", why: "De keuring laat zien dat het onderhoud op orde was. Dat heeft de verzekeraar nodig." },
        tijd: { kind: "Tijdstip", why: "Het tijdstip wijst niemand aan en helpt Stellar het incident te plaatsen. Het mocht blijven." },
        plek: { kind: "Plaats", why: "Een kraan op het vrachtdok wijst niemand aan. Het mocht blijven." },
        mail: { kind: "Mailbox van de afdeling", why: "Een afdelingsmailbox is van een afdeling, niet van één persoon. Zo kan Stellar vragen stellen zonder dat er een privénummer in staat." }
      }
    }
  ];
  const PTS = 4, OVER_CAP = 16;
  const lc = (t) => t.charAt(0).toLowerCase() + t.slice(1);
  const STOP = new Set("de het een van in op met en aan voor bij die dat te is was had heeft om naar uit tot als of dan door ook nog er zij ze hij haar zijn wij u wordt werd is na over onder deze dit wat wie waar hoe niet wel al zo per tegen".split(" "));
  const SIG = `<svg viewBox="0 0 150 44" aria-hidden="true"><path d="M6 32c8-14 14-24 20-24 5 0-3 22-6 26 7-10 12-14 16-14 3 0 0 8 3 8 4 0 7-10 11-10 3 0 1 9 5 9 5 0 6-12 11-12 3 0 0 10 4 10 5 0 9-14 14-14 4 0-2 14 2 14 6 0 14-10 20-12M38 40c22-4 58-6 104-6" fill="none" stroke="#1c3f7a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* Tekst omzetten naar woorden. Elk woord krijgt een index, een stuk (seg) en een soort. */
  function compile(doc) {
    const toks = [];
    const words = (str, seg) => str.split(/\s+/).filter(Boolean).map((w) => {
      const opt = w[0] === "~"; if (opt) w = w.slice(1);
      const sig = w === "§sig§", bare = w.toLowerCase().replace(/[^a-z0-9à-ÿ]/g, "");
      const tk = { i: toks.length, w, seg: seg || null, sig, content: sig || (!opt && bare.length > 0 && !STOP.has(bare)) };
      toks.push(tk); return tk;
    });
    const render = (str) => {
      let out = "", last = 0; const re = /\[([pnk]):(\w+) ([^\]]+)\]/g; let m;
      const plain = (s) => { if (!s.trim()) return s ? " " : ""; return (/^\s/.test(s) ? " " : "") + words(s).map(tkHTML).join(" ") + (/\s$/.test(s) ? " " : ""); };
      while ((m = re.exec(str))) {
        out += plain(str.slice(last, m.index));
        const ws = words(m[3], m[2]);
        doc.segs[m[2]].type = m[1]; doc.segs[m[2]].toks = ws.map((t) => t.i); doc.segs[m[2]].id = m[2];
        out += `<span class="seg" data-seg="${m[2]}" data-type="${m[1]}">${ws.map(tkHTML).join(" ")}</span>`;
        last = re.lastIndex;
      }
      return out + plain(str.slice(last));
    };
    const tkHTML = (t) => `<span class="w${t.sig ? " sig" : ""}" id="w-${doc.id}-${t.i}" data-i="${t.i}" role="button" aria-pressed="false">${t.sig ? `<span class="k">${SIG}</span><span class="sr">handtekening</span>` : core(t.w)}</span>`;
    const core = (w) => { const m = w.match(/^([(‘'"]*)(.*?)([)’'".,:;]*)$/); if (!m || !m[2]) return `<span class="k">${esc(w)}</span>`; const br = (p) => /[()‘’'"]/.test(p) ? " br" : ""; return `${m[1] ? `<span class="pu pre${br(m[1])}">${esc(m[1])}</span>` : ""}<span class="k">${esc(m[2])}</span>${m[3] ? `<span class="pu post${br(m[3])}">${esc(m[3])}</span>` : ""}`; };
    const body = doc.blocks.map((b) => {
      if (b.t === "table") return `<dl class="zl-table">${b.rows.map((r) => `<div><dt>${esc(r[0])}</dt><dd>${render(r[1])}</dd></div>`).join("")}</dl>`;
      if (b.t === "h") return `<h4 class="zl-h">${esc(b.x)}</h4>`;
      if (b.t === "sign") return `<div class="zl-sign">${b.greet === false ? "" : `<div class="zl-greet">Met vriendelijke groet,</div>`}<div class="zl-signline">${render(b.x)}<span class="zl-role">${esc(b.role)}</span></div></div>`;
      return `<p>${render(b.x)}</p>`;
    }).join("");
    doc.toks = toks; doc.html = body;
    doc.order = Object.values(doc.segs).filter((s) => s.toks).sort((a, b) => a.toks[0] - b.toks[0]);
    // woorden direct naast een persoonsgegeven tellen niet als te veel zwart (slordig slepen mag)
    const pdTok = new Set(doc.order.filter((s) => s.type === "p").flatMap((s) => s.toks));
    toks.forEach((t) => { t.free = !t.seg && (pdTok.has(t.i - 1) || pdTok.has(t.i + 1)); });
  }
  DOCS.forEach(compile);
  const MAX = DOCS.reduce((n, d) => n + d.order.filter((s) => s.type !== "k").length * PTS, 0); // 100

  const G = game({ id: "zwart-de-lijst", title: "Zwart de lijst", topic: "Wat is een persoonsgegeven", module: "Aankomsthal", max: MAX, timer: 420,
    steps: ["Briefing", "Document 1", "Document 2", "Document 3", "Debriefing"], onStart: () => play(0), onTimeout });

  /* ---------- Briefing ---------- */
  const art = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="zbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a2552"/><stop offset="1" stop-color="#030c20"/></linearGradient>
      <linearGradient id="zdesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4d6b"/><stop offset="1" stop-color="#1d2a40"/></linearGradient>
      <linearGradient id="zslot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c2f5f"/><stop offset="1" stop-color="#06224c"/></linearGradient>
      <linearGradient id="zpen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#20262f"/><stop offset=".5" stop-color="#3b4452"/><stop offset="1" stop-color="#171b22"/></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#zbg)"/>
    <g opacity=".5" stroke="#13559b" stroke-width="1"><path d="M0 70h400M0 140h400"/><path d="M60 0v150M180 0v150M300 0v150"/></g>
    <rect x="300" y="30" width="80" height="150" rx="12" fill="#0f2547" stroke="#67caff" stroke-opacity=".5"/>
    <rect x="312" y="60" width="56" height="70" rx="8" fill="url(#zslot)" stroke="#15aaff" stroke-width="1.5"/>
    <rect x="318" y="88" width="44" height="6" rx="3" fill="#020a1c"/>
    <path d="M330 110l10 8 10-8" fill="none" stroke="#67caff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-90 340 114)"/>
    <text x="340" y="50" text-anchor="middle" font-family="Figtree,sans-serif" font-weight="700" font-size="11" fill="#a1deff">Verzendsluis</text>
    <rect x="322" y="146" width="36" height="8" rx="4" fill="#05df72" opacity=".85"/>
    <path d="M0 190 L400 172 L400 300 L0 300 Z" fill="url(#zdesk)"/>
    <path d="M0 190 L400 172" stroke="#90a1b9" stroke-width="2"/>
    <g transform="translate(70 40) rotate(-4)">
      <rect x="4" y="6" width="200" height="236" rx="4" fill="#000" opacity=".35"/>
      <rect width="200" height="236" rx="4" fill="#f5f8fc"/>
      <circle cx="22" cy="22" r="9" fill="none" stroke="#0a6dbe" stroke-width="3"/><circle cx="22" cy="22" r="3" fill="#0a6dbe"/>
      <rect x="38" y="15" width="70" height="6" rx="3" fill="#0c2f5f"/><rect x="38" y="25" width="44" height="4" rx="2" fill="#90a1b9"/>
      <rect x="140" y="15" width="44" height="4" rx="2" fill="#90a1b9"/><rect x="152" y="24" width="32" height="4" rx="2" fill="#90a1b9"/>
      <rect x="16" y="42" width="168" height="2" fill="#15aaff"/>
      <rect x="16" y="54" width="168" height="26" rx="3" fill="#eaf2fb"/><rect x="24" y="61" width="60" height="4" rx="2" fill="#62748e"/><rect x="24" y="70" width="110" height="4" rx="2" fill="#62748e"/>
      ${[92, 106, 120, 134, 148, 162, 176].map((y, i) => `<rect x="16" y="${y}" width="${[168, 150, 166, 140, 160, 120, 90][i]}" height="5" rx="2.5" fill="#b4c0d0"/>`).join("")}
      <rect x="48" y="104" width="62" height="9" rx="2" fill="#101318"/>
      <rect x="112" y="118" width="46" height="9" rx="2" fill="#101318"/>
      <rect x="16" y="132" width="94" height="9" rx="2" fill="#101318"/>
      <rect x="16" y="160" width="70" height="9" rx="2" fill="#ffd9da" stroke="#ff6467" stroke-width="1.2" stroke-dasharray="3 2"/>
      <path d="M20 206c6-10 10-16 14-16 3 0-2 14-4 17 5-7 8-9 11-9 2 0 0 5 2 5 3 0 5-7 8-7" fill="none" stroke="#1c3f7a" stroke-width="2" stroke-linecap="round"/>
      <rect x="16" y="214" width="58" height="4" rx="2" fill="#62748e"/>
    </g>
    <g transform="translate(232 196) rotate(-38)">
      <rect x="0" y="0" width="112" height="18" rx="6" fill="url(#zpen)"/>
      <rect x="84" y="-1" width="32" height="20" rx="6" fill="#0a6dbe"/>
      <rect x="20" y="5" width="44" height="8" rx="2" fill="#f5f8fc" opacity=".9"/>
      <path d="M0 3 L-14 6 L-14 12 L0 15 Z" fill="#2b313b"/><path d="M-14 6 L-22 8 L-22 10 L-14 12 Z" fill="#0b0c10"/>
    </g>
    <path d="M150 232c30 4 60 2 90-6" fill="none" stroke="#0b0c10" stroke-width="7" stroke-linecap="round" opacity=".0"/>
  </svg>`;
  G.intro({
    lead: "Drie documenten verlaten vandaag het station. Voordat ze door de verzendsluis gaan, zet jij met de stift door wat niet mee mag.",
    who: "ARIA",
    line: "Kijk eerst naar wie het document krijgt en waarvoor. Zwart wat iemand aanwijst, ook als er geen naam staat. Laat staan wat de ontvanger echt nodig heeft.",
    rules: [["pen", "Klik op een woord om het zwart te maken, of sleep met de stift over een stuk tekst. Nog een keer klikken haalt het zwart weg."],
      ["send", "Klaar? Sleep het document <b>de verzendsluis in</b>, of gebruik de knop. Een gemist gegeven lekt naar buiten en kost schild. Te veel zwart en de ontvanger mist wat hij nodig heeft."],
      ["gem", "Een document helemaal goed zonder aanwijzing levert een kristal op."]],
    art, note: "Drie documenten, ongeveer 4 minuten"
  });

  /* ---------- Een document ---------- */
  let D, idx, on, hist, sent, hinted, caret = 0, anchor = null, dragMode = null, dragBase = null, timedOut = false;
  const results = [];
  const MINUS = "−";

  function play(i) {
    idx = i; D = DOCS[i]; on = new Uint8Array(D.toks.length); hist = []; sent = false; hinted = false; caret = 0;
    G.setStep(i + 1);
    G.head(D.kind, `<span class="chip">${icon("send", "sm")}Naar ${esc(D.to)}</span><span class="chip">Document ${i + 1} van ${DOCS.length}</span>`);
    G.stage.innerHTML = "";
    const n = h(`<div class="zl fade-in">
      <section class="zl-desk" aria-label="Verzendconsole">
        <div class="zl-sheet">
        <div class="zl-need" data-need>${icon("target", "sm")}<span><b>${esc(D.short)} heeft nodig</b> ${esc(D.need1)}</span></div>
        <article class="zl-paper ly-lek ly-over" data-paper>
          <header class="zl-letter">
            <div class="zl-logo"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="none" stroke="#0a6dbe" stroke-width="4"/><circle cx="20" cy="20" r="5" fill="#0a6dbe"/><path d="M2 26 L38 14" stroke="#15aaff" stroke-width="2.5"/></svg><div><b>Station Orion</b><span>${esc(D.dept)}</span></div></div>
            <div class="zl-meta"><span>Nummer <b>${esc(D.nr)}</b></span><span>Datum <b>${esc(D.date)}</b></span></div>
          </header>
          <div class="zl-addr"><div><span class="lbl">Aan:</span> <b>${esc(D.toLong)}</b></div><div><span class="lbl">Doel:</span> <b>${esc(D.purpose)}</b></div></div>
          <h3 class="zl-title">${esc(D.title)}</h3>
          <div class="zl-body" data-body tabindex="0" role="application" aria-roledescription="document" aria-label="Documenttekst. Pijltjes kiezen een woord, spatie of Enter maakt het zwart of haalt het zwart weg. Shift met pijltje zet een hele reeks zwart." aria-describedby="zl-kbd-tip">${D.html}</div>
          <div class="zl-stamp" data-stamp aria-hidden="true">Verzonden<small>${esc(D.to)}</small></div>
        </article>
        </div>
        <div class="zl-lock" data-slot role="button" tabindex="0" aria-label="Verzendsluis. Steek het document in de sluis en verstuur het.">
          <div class="zl-lock-top"><b>Verzendsluis</b><span class="zl-lock-arrow" aria-hidden="true">${icon("arrow", "lg")}</span><span data-lockhint>Sleep hierheen of klik om te versturen</span></div>
          <div class="zl-lamps" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="zl-door" aria-hidden="true">
            <div class="zl-door-in"><span class="zl-sheet-in"></span><span class="zl-beam"></span></div>
            <div class="zl-half top"><span class="zl-window"></span></div>
            <div class="zl-half bot"><span class="zl-grip"></span></div>
            <div class="zl-drop">${icon("arrow")}<span>Laat los</span></div>
          </div>
        </div>
      </section>
      <aside class="zl-side" data-side></aside>
    </div>`);
    G.stage.appendChild(n);
    bindPaper();
    sidePlay();
    paintMarks();
  }

  function sidePlay() {
    const side = $("[data-side]", G.stage);
    side.innerHTML = `
      <div data-say></div>
      <div class="zl-meter"><div class="zl-meter-top"><span class="lbl">Leesbaar voor ${esc(D.short)}</span><b data-read>100%</b></div><div class="bar"><i data-readbar></i></div><div class="zl-gauge-sub" data-count></div></div>
      <div class="zl-card zl-pen">
        <div class="zl-rule">
          <div>${icon("eyeoff", "sm")}<span><b>Zwart</b> wat één persoon aanwijst, ook zonder naam.</span></div>
          <div>${icon("eye", "sm")}<span><b>Laten staan</b> wat ${esc(D.to)} nodig heeft.</span></div>
        </div>
        <div class="zl-pen-row"><span class="zl-pen-lbl">${icon("pen")}Stift</span><span class="grow"></span>
          <button class="btn ghost" type="button" data-undo disabled>${icon("undo")}Terug</button>
          <button class="btn ghost" type="button" data-clear disabled>${icon("refresh")}Wissen</button>
          <span class="zl-kbd"><button class="btn ghost zl-kbd-btn" type="button" aria-label="Uitleg toetsenbord" aria-describedby="zl-kbd-tip"><b aria-hidden="true">?</b></button><span class="zl-tip" role="tooltip" id="zl-kbd-tip">Toetsenbord: Tab naar het document, pijltjes om een woord te kiezen, spatie om te zwarten, Shift met pijltje voor een reeks.</span></span></div>
      </div>
      <div class="zl-send-alt"><span>Liever niet slepen?</span><button class="btn sm ghost" type="button" data-send>${icon("send", "sm")}Verstuur met een klik</button></div>`;
    $("[data-undo]", side).addEventListener("click", undo);
    $("[data-clear]", side).addEventListener("click", () => { if (!on.some(Boolean)) return; push(); on.fill(0); paintMarks(); Mini.sound.play("close"); });
    $("[data-send]", side).addEventListener("click", () => send());
    sayLine("Zwart alleen wat één persoon aanwijst. De rest moet leesbaar blijven.");
    bindSlot();
  }
  function sayLine(t, mood) {
    const el = $("[data-say]", G.stage); if (!el) return;
    el.innerHTML = G.sayHTML("ARIA", t, { mood, side: sent ? "" : `<button class="btn sm ghost" type="button" data-hint>${icon("bulb", "sm")}Aanwijzing</button><span class="hintcost">${esc(G.hintLabel())}</span>` });
    const hb = $("[data-hint]", el); if (hb) hb.addEventListener("click", hint);
  }

  /* ---------- Stift: klikken, slepen, toetsenbord ---------- */
  const tokEl = (i) => document.getElementById(`w-${D.id}-${i}`);
  function push() { hist.push(on.slice()); if (hist.length > 60) hist.shift(); }
  function undo() { if (!hist.length || sent) return; on = hist.pop(); paintMarks(); Mini.sound.play("tap"); }
  let lastTap = 0;
  function tick() { const t = performance.now(); if (t - lastTap > 45) { Mini.sound.play("tap"); lastTap = t; } }
  function paintMarks() {
    D.toks.forEach((t) => {
      const el = tokEl(t.i); if (!el) return;
      const v = !!on[t.i]; if (el.classList.contains("on") !== v) { el.classList.toggle("on", v); el.setAttribute("aria-pressed", v); }
      const jr = v && !!on[t.i + 1] && sameBlock(t.i, t.i + 1), jl = v && !!on[t.i - 1] && sameBlock(t.i - 1, t.i);
      el.classList.toggle("jr", jr); el.classList.toggle("jl", jl);
    });
    joins(); $$(".sp", G.stage).forEach((sp) => { const l = +sp.dataset.l; sp.classList.toggle("on", l >= 0 && !!on[l] && !!on[l + 1] && sameBlock(l, l + 1)); });
    const runs = countRuns();
    const c = $("[data-count]", G.stage);
    if (c) c.innerHTML = runs ? `<b>${runs}</b> ${runs === 1 ? "stuk" : "stukken"} zwart` : "Nog niets zwart";
    // meter in de sluis: hoeveel van de inhoud de ontvanger nog kan lezen
    const content = D.toks.filter((t) => t.content), left = content.filter((t) => !on[t.i]).length;
    const pct = Math.round(left / content.length * 100), rb = $("[data-readbar]", G.stage), rd = $("[data-read]", G.stage);
    if (rb) { rb.style.width = pct + "%"; rb.parentElement.dataset.lvl = pct >= 35 ? "ok" : "low"; rd.textContent = pct + "%"; }
    const u = $("[data-undo]", G.stage); if (u) u.disabled = !hist.length;
    const cl = $("[data-clear]", G.stage); if (cl) cl.disabled = !runs;
  }
  function joins() {
    const body = $("[data-body]", G.stage); if (!body || body.dataset.joined) return; body.dataset.joined = "1";
    const tw = document.createTreeWalker(body, NodeFilter.SHOW_TEXT), list = [];
    while (tw.nextNode()) { const n = tw.currentNode; if (!n.nodeValue.trim() && !n.parentElement.closest(".w")) list.push(n); }
    list.forEach((n) => { const sp = document.createElement("span"); sp.className = "sp"; sp.textContent = n.nodeValue; n.replaceWith(sp); });
    let last = -1; $$(".w, .sp", body).forEach((el) => { if (el.classList.contains("w")) last = +el.dataset.i; else el.dataset.l = last; });
  }
  function countRuns() { let n = 0; for (let i = 0; i < on.length; i++) if (on[i] && !(on[i - 1] && sameBlock(i - 1, i))) n++; return n; }
  function sameBlock(a, b) { const A = tokEl(a), B = tokEl(b); return A && B && A.parentElement.closest("p,dd,.zl-signline") === B.parentElement.closest("p,dd,.zl-signline"); }
  function setRange(a, b, v) { const lo = Math.min(a, b), hi = Math.max(a, b); for (let i = 0; i < on.length; i++) on[i] = dragBase[i]; for (let i = lo; i <= hi; i++) on[i] = v; }

  function bindPaper() {
    const body = $("[data-body]", G.stage);
    const idxOf = (el) => { const w = el && el.closest && el.closest(".w"); return w && body.contains(w) ? +w.dataset.i : -1; };
    body.addEventListener("pointerdown", (e) => {
      if (sent || e.button > 0) return;
      const i = idxOf(e.target); if (i < 0) return;
      e.preventDefault(); body.classList.remove("kbd"); body.focus({ preventScroll: true });
      push(); dragBase = on.slice(); anchor = i; dragMode = on[i] ? 0 : 1; caret = i;
      setRange(i, i, dragMode); paintMarks(); tick(); moveCaret(i, false);
      try { body.setPointerCapture(e.pointerId); } catch (er) {}
    });
    body.addEventListener("pointermove", (e) => {
      if (dragMode === null) return;
      const el = document.elementFromPoint(e.clientX, e.clientY); const i = idxOf(el); if (i < 0) return;
      const before = on.join(""); setRange(anchor, i, dragMode); if (on.join("") !== before) { paintMarks(); tick(); }
    });
    const end = () => { if (dragMode === null) return; dragMode = null; dragBase = null; if (hist.length && hist[hist.length - 1].join("") === on.join("")) hist.pop(); paintMarks(); };
    body.addEventListener("pointerup", end); body.addEventListener("pointercancel", end); body.addEventListener("lostpointercapture", end);
    body.addEventListener("focus", () => moveCaret(caret, false));
    body.addEventListener("blur", () => body.classList.remove("kbd"));
    body.addEventListener("keydown", (e) => {
      if (sent) return;
      if (e.key !== "Tab") body.classList.add("kbd");
      const k = e.key; let next = null;
      if (k === "ArrowRight") next = Math.min(on.length - 1, caret + 1);
      else if (k === "ArrowLeft") next = Math.max(0, caret - 1);
      else if (k === "ArrowDown" || k === "ArrowUp") next = lineJump(k === "ArrowDown" ? 1 : -1);
      else if (k === "Home") next = 0; else if (k === "End") next = on.length - 1;
      else if (k === " " || k === "Enter") { e.preventDefault(); push(); on[caret] = on[caret] ? 0 : 1; paintMarks(); tick(); announce(caret); return; }
      else if ((k === "z" || k === "Z") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); undo(); return; }
      if (next === null) return;
      e.preventDefault();
      if (e.shiftKey) { if (!hist.length || anchor === null || !e.repeat && !body.dataset.shift) { push(); dragBase = on.slice(); anchor = caret; body.dataset.shift = "1"; dragMode = 1; } setRange(anchor, next, 1); dragMode = null; paintMarks(); tick(); }
      else { delete body.dataset.shift; anchor = null; }
      caret = next; moveCaret(next, true);
    });
    body.addEventListener("keyup", (e) => { if (e.key === "Shift") { delete body.dataset.shift; anchor = null; dragBase = null; } });
  }
  function bindSlot() {
    const lock = $("[data-slot]", G.stage), paper = $("[data-paper]", G.stage);
    lock.addEventListener("click", () => send());
    lock.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); send(); } });
    let x0 = null, dx = 0;
    const need = () => Math.min(160, paper.offsetWidth * 0.22);
    paper.addEventListener("pointerdown", (e) => {
      if (sent || e.button > 0 || e.target.closest(".zl-body")) return;
      e.preventDefault(); x0 = e.clientX; dx = 0; paper.classList.add("dragging");
      try { paper.setPointerCapture(e.pointerId); } catch (er) {}
    });
    paper.addEventListener("pointermove", (e) => {
      if (x0 === null) return;
      dx = Math.max(0, e.clientX - x0);
      paper.style.setProperty("--dx", dx + "px"); paper.style.setProperty("--clip", clipFor(dx) + "px");
      const ready = dx > need();
      lock.classList.toggle("armed", dx > 16 && !ready);
      if (ready && !lock.classList.contains("ready")) Mini.sound.play("tap");
      lock.classList.toggle("ready", ready);
    });
    const up = () => {
      if (x0 === null) return; x0 = null; lock.classList.remove("armed");
      if (dx > need()) { send(); return; }
      lock.classList.remove("ready");
      paper.classList.remove("dragging"); paper.style.setProperty("--dx", "0px"); paper.style.setProperty("--clip", "0px");
    };
    paper.addEventListener("pointerup", up); paper.addEventListener("pointercancel", up);
  }
  // het papier verdwijnt halverwege onder de sluis
  function clipFor(dx) { const lock = $("[data-slot]", G.stage); const off = 12 + (lock ? lock.offsetWidth * 0.45 : 40); return Math.max(0, dx - off); }
  function lineJump(dir) {
    const cur = tokEl(caret).getBoundingClientRect(); let best = null, bd = 1e9;
    D.toks.forEach((t) => { const r = tokEl(t.i).getBoundingClientRect(); const dy = (r.top - cur.top) * dir; if (dy < 6) return; const d = dy * 4 + Math.abs(r.left + r.width / 2 - (cur.left + cur.width / 2)); if (d < bd) { bd = d; best = t.i; } });
    return best === null ? caret : best;
  }
  function moveCaret(i, say) {
    $$(".w.cur", G.stage).forEach((w) => w.classList.remove("cur"));
    const el = tokEl(i); if (!el) return; el.classList.add("cur");
    const body = $("[data-body]", G.stage); body.setAttribute("aria-activedescendant", el.id);
    if (say) announce(i, true);
  }
  function announce(i, moveOnly) {
    let live = $("#zl-live"); if (!live) { live = h(`<div id="zl-live" class="sr" aria-live="polite"></div>`); document.body.appendChild(live); }
    const t = D.toks[i]; live.textContent = `${t.sig ? "handtekening" : t.w}${on[i] ? ", zwart" : moveOnly ? "" : ", zwart weggehaald"}`;
  }

  /* ---------- Aanwijzing ---------- */
  function covered(s) { const c = s.toks.filter((i) => D.toks[i].content); const n = c.filter((i) => on[i]).length; return { n, all: c.length, full: n === c.length }; }
  function hint() {
    if (sent) return;
    const miss = D.order.find((s) => s.type === "p" && !covered(s).full);
    const over = D.order.find((s) => s.type === "n" && covered(s).n > 0);
    const cost = G.hint(); hinted = true;
    let text;
    if (miss) {
      text = miss.hint;
      const blk = tokEl(miss.toks[0]).closest("p,dd,.zl-signline,.zl-table > div");
      if (blk) { blk.classList.remove("zl-pulse"); void blk.offsetWidth; blk.classList.add("zl-pulse"); }
    } else if (over) text = `Alles wat iemand aanwijst lijkt weg. Maar je hebt iets zwart gemaakt wat ${D.to} nodig heeft. Lees het doel nog eens.`;
    else text = "Ik zie niets meer dat iemand aanwijst. Je kunt versturen.";
    sayLine(text + (cost ? " (min 10 procent schild)" : ""));
  }

  /* ---------- Versturen en beoordelen ----------
     Vier uitkomsten, elk met één kleur, één teken en één soort punten:
     weg (groen, vinkje, +4), laat (blauw, oog, +4), over (geel, min, min 2) en lek (rood, kruis, schild). */
  const CAT = {
    weg: { ic: "check", label: "Terecht weg", res: "goed" },
    laat: { ic: "eye", label: "Laten staan", res: "goed" },
    over: { ic: "eyeoff", label: "Onnodig weg", res: "half" },
    lek: { ic: "x", label: "Gelekt", res: "fout" }
  };
  function judge() {
    const items = [];
    D.order.forEach((s) => {
      const c = covered(s), quote = s.toks.map((i) => D.toks[i].sig ? "handtekening" : D.toks[i].w).join(" ").replace(/[.,]$/, "");
      if (s.type === "p") {
        if (c.full) items.push({ s, cat: "weg", pts: PTS, shield: 0, tag: "Terecht weg", quote });
        else if (c.n) items.push({ s, cat: "lek", pts: 0, shield: 4, tag: "Deels zwart, de rest lekt", quote });
        else items.push({ s, cat: "lek", pts: 0, shield: 8, tag: "Gemist, lekt naar buiten", quote });
      } else if (s.type === "n") {
        if (c.n) items.push({ s, cat: "over", pts: -2, shield: 0, tag: `Onnodig weg, ${D.to} mist dit`, quote });
        else items.push({ s, cat: "laat", pts: PTS, shield: 0, tag: "Terecht laten staan", quote });
      } else if (c.n) items.push({ s, cat: "over", pts: -2, shield: 0, tag: "Onnodig weg, mocht blijven", quote });
    });
    const loose = D.toks.filter((t) => !t.seg && t.content && !t.free && on[t.i]);
    if (loose.length) items.push({ s: { id: "_loose", kind: "Losse woorden", why: "Deze woorden wijzen niemand aan. Zwart maken maakt het stuk alleen lastiger te lezen.", toks: loose.map((t) => t.i) }, cat: "over", pts: -Math.min(8, loose.length), shield: 0, tag: "Onnodig weg, wijst niemand aan", quote: loose.slice(0, 5).map((t) => t.w.replace(/[.,:]$/, "")).join(", ") + (loose.length > 5 ? " en meer" : "") });
    let cap = OVER_CAP; items.filter((x) => x.cat === "over").forEach((x) => { const p = Math.max(-cap, x.pts); cap += p; x.pts = p; });
    items.forEach((x) => { x.res = CAT[x.cat].res; });
    return items;
  }
  const ptsLabel = (x) => x.cat === "lek" ? `${MINUS}${x.shield}% schild` : x.pts > 0 ? `+${x.pts}` : x.pts < 0 ? `${MINUS}${-x.pts}` : "0";
  function record(x) { G.record({ result: x.res, points: x.pts, shield: x.shield, toast: false, q: `${D.kind}: ${x.s.kind}`, a: `‘${x.quote}’ ${lc(x.tag)}`, why: x.s.why }); }

  async function send(auto) {
    if (sent) return; sent = true;
    const items = judge();
    const count = (c) => items.filter((x) => x.cat === c).length;
    const sum = { weg: count("weg"), lek: count("lek"), over: count("over"), laat: count("laat") };
    sum.perfect = !sum.lek && !sum.over;
    sum.shield = items.reduce((n, x) => n + x.shield, 0);
    results[idx] = { found: sum.weg, total: sum.weg + sum.lek, leaks: sum.lek, overs: sum.over };
    $$("[data-send],[data-undo],[data-clear],[data-hint]", G.stage).forEach((b) => (b.disabled = true));
    const paper = $("[data-paper]", G.stage), body = $("[data-body]", G.stage), lock = $("[data-slot]", G.stage);
    lock.setAttribute("aria-disabled", "true"); lock.tabIndex = -1; lock.classList.remove("armed");
    body.removeAttribute("tabindex"); body.classList.remove("kbd"); $$(".w.cur", G.stage).forEach((w) => w.classList.remove("cur"));
    $("[data-lockhint]", G.stage).textContent = "Bezig met controleren";
    const fast = !!G.shot || Mini.reduce;
    sidePlaceholder(auto);
    if (!fast) {
      // deur open, papier erin, deur dicht, scannen, deur open, papier terug
      lock.classList.add("ready", "busy"); Mini.sound.play("open"); await wait(260);
      const w = paper.offsetWidth; paper.classList.remove("dragging"); paper.classList.add("sending");
      paper.style.setProperty("--dx", w * 0.96 + "px"); paper.style.setProperty("--clip", clipFor(w * 0.96) + "px");
      lock.classList.add("fed"); await wait(640);
      lock.classList.remove("ready"); Mini.sound.play("close"); lock.classList.add("cycle"); await wait(900);
    }
    paper.classList.add("review");
    for (const x of items) {
      const segEl = x.s.id === "_loose" ? null : $(`.seg[data-seg="${x.s.id}"]`, paper);
      if (segEl) { segEl.dataset.res = x.res; segEl.dataset.cat = x.cat; }
      else x.s.toks.forEach((i) => tokEl(i).classList.add("loose"));
    }
    if (!fast) {
      lock.classList.remove("cycle"); lock.classList.add("ready"); Mini.sound.play("open"); lock.classList.remove("fed");
      paper.style.setProperty("--dx", "0px"); paper.style.setProperty("--clip", "0px"); await wait(580);
      paper.classList.remove("sending"); lock.classList.remove("ready");
    }
    lock.classList.remove("busy"); lock.classList.add(sum.lek ? "bad" : "ok");
    numberItems(items); placeBadges(items);
    $("[data-need]", G.stage).innerHTML = `${icon("pen", "sm")}<span><b>Nagekeken.</b> Rood lekte naar buiten, geel was onnodig zwart.</span>`;
    $("[data-lockhint]", G.stage).textContent = sum.lek ? "Er is iets gelekt" : "Veilig verzonden";
    // eerst wat goed ging en te veel zwart, dan springen de lekken eruit
    for (const x of items.filter((y) => y.cat !== "lek")) { record(x); if (!fast) await wait(60); }
    for (const x of items.filter((y) => y.cat === "lek")) {
      record(x);
      const segEl = x.s.id === "_loose" ? null : $(`.seg[data-seg="${x.s.id}"]`, paper);
      if (segEl) { $$(".w", segEl).forEach((w, k) => { w.style.animationDelay = (fast ? 0 : k * 40) + "ms"; }); segEl.classList.add("pop"); }
      if (!fast) await wait(420);
    }
    paper.classList.add("sent");
    const title = sum.perfect ? "Niets gelekt, niets te veel" : sum.lek ? `${sum.lek} ${sum.lek === 1 ? "gegeven gelekt" : "gegevens gelekt"}` : "Niets gelekt, wel te veel zwart";
    G.verdict(sum.perfect ? "goed" : sum.lek ? "fout" : "half", title, "", null);
    if (sum.perfect && !hinted && !auto) G.gem("Document zonder fouten en zonder aanwijzing verstuurd.");
    sideReview(items, Object.assign(sum, { title }));
    requestAnimationFrame(() => { placeBadges(); placeStamp(); }); setTimeout(() => { if (sent) { placeBadges(); placeStamp(); } }, 700);
  }
  function sidePlaceholder(auto) {
    $("[data-side]", G.stage).innerHTML = `<div class="zl-card zl-checking">${icon("search")}<span>${auto ? "De tijd is op. ARIA verstuurt het document zoals het nu is." : `De sluis controleert wat ${esc(D.to)} ontvangt.`}</span></div>`;
  }

  /* Genummerde kantlijnlabels: lekken eerst, dan te veel zwart, in leesvolgorde. */
  function numberItems(items) { let k = 0; items.filter((x) => x.cat === "lek").concat(items.filter((x) => x.cat === "over")).forEach((x) => { x.no = ++k; }); }
  let badgeItems = [];
  function placeBadges(items) {
    const paper = $("[data-paper]", G.stage); if (!paper) return;
    if (items) badgeItems = items; $$(".zl-badge", paper).forEach((b) => b.remove());
    const pr = paper.getBoundingClientRect(), used = [];
    badgeItems.filter((x) => x.no).forEach((x) => {
      const el = x.s.id === "_loose" ? tokEl(x.s.toks[0]) : $(`.seg[data-seg="${x.s.id}"]`, paper); if (!el) return;
      const r = el.getClientRects()[0]; if (!r) return;
      const top = Math.round(r.top - pr.top + r.height / 2 - 12);
      const side = used.some((u) => u.side === "l" && Math.abs(u.top - top) < 20) ? "r" : "l"; used.push({ side, top });
      const b = h(`<button type="button" class="zl-badge ${x.cat} ${side}" style="top:${top}px" data-item="${x.s.id}" data-icat="${x.cat}" aria-label="Opmerking ${x.no}">${x.no}</button>`);
      b.addEventListener("click", () => { const it = $(`.zl-side [data-item="${x.s.id}"]`, G.stage); if (it) { if (it.classList.contains("zl-item")) it.setAttribute("aria-expanded", "true"); it.scrollIntoView({ block: "nearest", behavior: Mini.reduce ? "auto" : "smooth" }); } focusSeg(x.s.id, x.cat); });
      paper.appendChild(b);
    });
  }
  window.addEventListener("resize", () => { if (sent) { placeBadges(); placeStamp(); } });
  /* Het stempel zoekt een lege plek op het papier, zodat het geen tekst of zwart bedekt. */
  function placeStamp() {
    const paper = $("[data-paper]", G.stage), st = $("[data-stamp]", G.stage); if (!paper || !st) return;
    st.style.left = st.style.top = st.style.right = st.style.bottom = "";
    const pr = paper.getBoundingClientRect(), W = st.offsetWidth + 12, H = st.offsetHeight + 16, rects = [];
    const walk = document.createTreeWalker(paper, NodeFilter.SHOW_TEXT);
    for (let t = walk.nextNode(); t; t = walk.nextNode()) {
      if (!t.textContent.trim() || st.contains(t)) continue;
      const rg = document.createRange(); rg.selectNodeContents(t); for (const r of rg.getClientRects()) rects.push(r);
    }
    $$(".w.on, .sp.on, .zl-badge, .zl-logo, .zl-meta, .zl-addr", paper).forEach((e) => { for (const r of e.getClientRects()) rects.push(r); });
    const free = (x, y) => rects.every((r) => r.right < pr.left + x - 6 || r.left > pr.left + x + W + 6 || r.bottom < pr.top + y - 6 || r.top > pr.top + y + H + 6);
    const put = (x, y) => { st.style.left = x + 6 + "px"; st.style.top = y + 8 + "px"; st.style.right = st.style.bottom = "auto"; };
    for (let y = pr.height - H - 6; y >= 4; y -= 6) for (let x = pr.width - W - 10; x >= 10; x -= 8) if (free(x, y)) return put(x, y);
    put((pr.width - W) / 2, 4);
  }
  function setLayer(c, v) {
    const paper = $("[data-paper]", G.stage), btn = $(`[data-layer="${c}"]`, G.stage);
    paper.classList.toggle("ly-" + c, v); $$(`[data-layer="${c}"]`, G.stage).forEach((b) => b.setAttribute("aria-pressed", v));
    Mini.sound.play("tap");
  }

  function sideReview(items, sum) {
    const side = $("[data-side]", G.stage);
    const last = idx === DOCS.length - 1 || timedOut;
    const allLeaks = items.filter((x) => x.cat === "lek"), allOvers = items.filter((x) => x.cat === "over"), good0 = items.filter((x) => x.res === "goed");
    const leaks = allLeaks.slice(0, 2), overs = allOvers.slice(0, Math.max(1, 3 - leaks.length)), restOver = allOvers.length - overs.length;
    // leesbaarheid van wat mocht blijven staan: het doel is 100 procent
    const pTok = new Set(); D.order.forEach((s) => { if (s.type === "p") s.toks.forEach((i) => pTok.add(i)); });
    const mayStay = D.toks.filter((t) => t.content && !pTok.has(t.i)), readPct = mayStay.length ? Math.round(mayStay.filter((t) => !on[t.i]).length / mayStay.length * 100) : 100;
    const readTag = `<span class="zl-readtag ${readPct === 100 ? "ok" : "low"}"><i style="--w:${readPct}%"></i>leesbaar ${readPct} procent, nodig 100</span>`;
    const good = [...allLeaks.slice(3), ...allOvers.slice(overs.length), ...good0], moreN = good.length - good0.length;
    const row = (x, open) => `<button class="zl-item ${x.cat}" type="button" data-item="${x.s.id}" data-icat="${x.cat}" aria-expanded="${open}">
        <span class="ic">${x.no ? `<b>${x.no}</b>` : icon(CAT[x.cat].ic, "sm")}</span>
        <span class="tx"><span class="q">‘${esc(x.quote)}’</span><span class="tg">${esc(x.s.kind)}. ${esc(x.tag)}</span><span class="why">${esc(x.s.why)}</span></span>
        <span class="pts">${ptsLabel(x)}</span></button>`;
    const chip = (c, n) => `<button type="button" class="zl-chip ${c}${n ? "" : " zero"}" data-layer="${c}" aria-pressed="${c === "lek" || c === "over"}"><i aria-hidden="true">${icon(CAT[c].ic)}</i><b>${n}</b><span>${CAT[c].label.toLowerCase()}</span></button>`;
    side.innerHTML = `
      <div class="zl-chips">${chip("lek", sum.lek)}${chip("over", sum.over)}${chip("weg", sum.weg)}</div>
      <div class="zl-rv" data-list>
        <div class="zl-leak ${sum.lek ? "bad" : "ok"}">
          <div class="zl-leak-head"><span class="dot">${icon(sum.lek ? "alert" : "shield", "lg")}</span><div><b>${sum.lek ? `${sum.lek} ${sum.lek === 1 ? "gegeven" : "gegevens"} gelekt` : "Niets gelekt"}</b><span>${sum.lek ? `${esc(D.to)} ziet het nu. Je schild verloor ${sum.shield} procent.` : `Alles wat iemand aanwijst is zwart. ${sum.weg} van ${sum.weg} gevonden.`}</span></div></div>
          ${leaks.map((x, k) => `<button class="zl-leak-item${k ? " short" : ""}" type="button" data-item="${x.s.id}" data-icat="lek"><span class="no">${x.no}</span><span class="q">‘${esc(x.quote)}’</span><span class="tg">${esc(x.s.kind)}. ${esc(x.tag)}. ${MINUS}${x.shield}% schild</span><span class="why">${esc(x.s.why)}</span></button>`).join("")}
        </div>
        ${overs.length ? `<h4 class="zl-rv-h over">${icon("eyeoff", "sm")}Onnodig weg <span>${allOvers.length}</span>${readTag}</h4>${overs.map((x, k) => row(x, !leaks.length && k === 0)).join("")}<button class="zl-moreover" type="button" data-moreover data-n="${restOver}"${restOver ? "" : " hidden"}>${icon("eyeoff", "sm")}<span>+${restOver} meer onnodig weg, open de lijst hieronder</span></button>` : allOvers.length ? "" : `<p class="zl-rv-ok">${icon("eye", "sm")}Niets onnodig weg. ${esc(D.to)} kan alles lezen wat nodig is.</p>`}
        ${!overs.length && allOvers.length ? "" : !overs.length ? `<p class="zl-rv-ok">${icon("eye", "sm")}${readTag}</p>` : ""}
        <div class="zl-good" data-good hidden>${good.map((x) => row(x, false)).join("")}</div>
      </div>
      <button class="zl-goodtoggle" type="button" data-goodtoggle aria-expanded="false">${icon("check", "sm")}<span>${moreN ? `Nog ${moreN} ${moreN === 1 ? "opmerking" : "opmerkingen"} en wat goed ging` : "Wat goed ging"} <b>${good0.length}</b></span><span class="grow"></span>${icon("right", "sm")}</button>
      <div class="zl-after">
        <button class="btn ghost" type="button" data-view aria-pressed="false">${icon("eye")}<span>Bekijk als ontvanger</span></button>
        <button class="btn" type="button" data-next>${last ? "Naar de debriefing" : "Volgend document"}${icon("arrow")}</button>
      </div>`;
    $$("[data-item]", side).forEach((b) => {
      b.addEventListener("click", () => { b.classList.remove("short"); if (b.classList.contains("zl-item")) b.setAttribute("aria-expanded", b.getAttribute("aria-expanded") !== "true"); focusSeg(b.dataset.item, b.dataset.icat); });
      b.addEventListener("mouseenter", () => focusSeg(b.dataset.item));
      b.addEventListener("focus", () => focusSeg(b.dataset.item));
    });
    { // Past de lijst niet, dan schuiven de laatste onnodig-zwart regels naar de uitklaplijst met een expliciete teller
      const mo = $("[data-moreover]", side), rv = $("[data-list]", side), gd = $("[data-good]", side);
      if (mo) {
        mo.addEventListener("click", () => $("[data-goodtoggle]", side).click());
        let n = +mo.dataset.n; const fitTxt = () => { mo.hidden = !n; $("span", mo).textContent = `+${n} meer onnodig weg, open de lijst hieronder`; };
        fitTxt();
        for (let guard = 0; guard < 4 && rv.scrollHeight - rv.clientHeight > 2; guard++) {
          const rows = $$(".zl-item.over", rv).filter((r) => !r.closest("[data-good]")); if (rows.length < 2) break;
          gd.prepend(rows[rows.length - 1]); n++; fitTxt();
        }
      }
    }
    $$("[data-layer]", side).forEach((b) => b.addEventListener("click", () => setLayer(b.dataset.layer, b.getAttribute("aria-pressed") !== "true")));
    $("[data-goodtoggle]", side).addEventListener("click", (e) => {
      const open = e.currentTarget.getAttribute("aria-expanded") !== "true"; e.currentTarget.setAttribute("aria-expanded", open);
      $("[data-good]", side).hidden = !open; setLayer("weg", open); setLayer("laat", open);
      if (open) $("[data-good]", side).scrollIntoView({ block: "nearest", behavior: Mini.reduce ? "auto" : "smooth" });
    });
    $$(".seg[data-res]", G.stage).forEach((s) => s.addEventListener("click", () => { const it = $(`[data-item="${s.dataset.seg}"]`, side); if (!it) return; if (it.closest("[data-good]")) { $("[data-good]", side).hidden = false; $("[data-goodtoggle]", side).setAttribute("aria-expanded", "true"); } if (it.classList.contains("zl-item")) it.setAttribute("aria-expanded", "true"); it.scrollIntoView({ block: "nearest", behavior: Mini.reduce ? "auto" : "smooth" }); focusSeg(s.dataset.seg, s.dataset.cat); }));
    $("[data-view]", side).addEventListener("click", (e) => { const p = $("[data-paper]", G.stage); const v = !p.classList.contains("as-recv"); p.classList.toggle("as-recv", v); e.currentTarget.setAttribute("aria-pressed", v); Mini.sound.play("tap"); });
    $("[data-next]", side).addEventListener("click", () => last ? end() : play(idx + 1));
    if (!G.shot) $("[data-next]", side).focus({ preventScroll: true });
  }
  function focusSeg(id, cat) {
    $$(".seg.focus, .w.focus", G.stage).forEach((s) => s.classList.remove("focus"));
    $$(".sel[data-item]", G.stage).forEach((s) => s.classList.remove("sel"));
    $$(`[data-item="${id}"]`, G.stage).forEach((it) => it.classList.add("sel"));
    const paper = $("[data-paper]", G.stage);
    if (cat && !paper.classList.contains("ly-" + cat)) setLayer(cat, true);
    if (id === "_loose") { $$(".w.loose", G.stage).forEach((w) => w.classList.add("focus")); return; }
    const s = $(`.seg[data-seg="${id}"]`, G.stage); if (s) s.classList.add("focus");
  }

  function onTimeout() {
    if (G.finished || timedOut) return; timedOut = true;
    if (!sent) send(true); else { const b = $("[data-next]", G.stage); if (b) { b.innerHTML = `Naar de debriefing${icon("arrow")}`; b.onclick = (e) => { e.stopImmediatePropagation(); end(); }; } }
  }

  function end() {
    const played = results.filter(Boolean).length;
    G.finish({
      sub: `${results.filter(Boolean).reduce((n, r) => n + r.found, 0)} van ${DOCS.slice(0, played).reduce((n, d) => n + d.order.filter((s) => s.type === "p").length, 0)} persoonsgegevens op tijd zwart gemaakt.`,
      takeaway: "Haal weg wat één persoon aanwijst, ook als er geen naam bij staat. Denk aan een pasnummer, een hut, een handtekening of ‘de kok die vorige week begon’. Laat staan wat de ontvanger nodig heeft voor zijn doel, en niet meer."
    });
  }

  /* ---------- Vaste standen voor schermafbeeldingen (?shot=) ---------- */
  function markSeg(id, part) { const s = D.segs[id]; const t = part ? s.toks.slice(0, part) : s.toks; t.forEach((i) => (on[i] = 1)); }
  if (G.shot) {
    G.begin();
    if (G.shot === "play") { ["bram", "hut", "ilse"].forEach((s) => markSeg(s)); markSeg("astma", 4); paintMarks(); }
    if (G.shot === "feedback") { ["bram", "hut", "ilse", "astma", "sig"].forEach((s) => markSeg(s)); markSeg("scheur"); markSeg("datum"); paintMarks(); send(); }
    if (G.shot === "result") {
      const fake = [[0, ["bram", "hut", "ilse", "astma", "sig"], ["scheur"]], [1, ["aanwezig", "slaap", "kok", "waarschuwing", "notulist"], []], [2, ["kraan", "femke", "pols", "getuige", "sig"], ["tijd"]]];
      fake.forEach(([d, pd, extra]) => { idx = d; D = DOCS[d]; on = new Uint8Array(D.toks.length); pd.concat(extra).forEach((s) => markSeg(s)); const items = judge(); items.forEach((x) => G.record({ result: x.res, points: x.pts, shield: x.shield, toast: false, q: `${D.kind}: ${x.s.kind}`, a: `‘${x.quote}’ ${lc(x.tag)}`, why: x.s.why })); const p = items.filter((x) => x.s.type === "p"); results[d] = { found: p.filter((x) => x.res === "goed").length }; });
      G.gem(); end();
    }
  }
})();
