/* De postkamer. Onderwerp: phishing en beveiliging, module Vrachtdok.
   Vijf berichten komen binnen op de postterminal van het Vrachtdok. De speler beweegt een loep over
   het bericht. Onder de loep wordt zichtbaar wat een mailprogramma verbergt: het echte adres achter de
   naam, het echte doel van de knop, het antwoordadres en de volledige naam van de bijlage. Wat je vindt
   komt in de bewijslijst. Daarna beslis je: echt, nep of twijfel. Geen tijdsdruk. */
(function () {
  "use strict";
  const { game, icon, esc, $, $$, h, wait, FACES } = Mini;
  const ME = "cadet.datawacht@orion.space";

  /* Signalen per onderdeel. v = verdacht, k = klopt, l = let op.
     fact beschrijft het onderdeel; in de bewijslijst staat tijdens het spelen alleen een neutrale vraag (ASK), note verschijnt pas na je beslissing. */
  const MSGS = [
    {
      kind: "nep", name: "Servicedesk Orion", addr: "servicedesk@orion-statlon.space", reply: "servicedesk@orion-statlon.space",
      av: { t: "SO", c: "#c10007" }, time: "08.52", subject: "Je account wordt binnen 1 uur geblokkeerd", banner: "alarm",
      body: ["Beste crewlid,", "We zien verdachte activiteit op je stationsaccount. [[haste|Bevestig binnen 1 uur je gegevens, anders wordt je account geblokkeerd.]]", "[[ask|Log in met je wachtwoord en de code uit je authenticator-app]] om de blokkade te voorkomen."],
      button: { text: "Account bevestigen", url: "https://orion.space.verify-login.com/bevestig" }, sign: "Met vriendelijke groet,<br>Servicedesk Orion",
      hs: {
        from: ["v", "Naam: Servicedesk Orion. Echt adres: servicedesk@orion-statlon.space", "Er staat statlon met een l, niet station. Een adres dat bijna klopt is een klassieke truc."],
        reply: ["v", "Antwoord gaat naar servicedesk@orion-statlon.space", "Ook je antwoord gaat naar het nepdomein."],
        haste: ["v", "Binnen 1 uur bevestigen, anders wordt je account geblokkeerd", "Haast moet je laten klikken voordat je nadenkt."],
        ask: ["v", "Vraagt om je wachtwoord en je inlogcode", "De servicedesk vraagt nooit om je wachtwoord of je inlogcode."],
        link: ["v", "Knop gaat naar orion.space.verify-login.com", "Het echte domein is verify-login.com. Het stukje orion.space vooraan is alleen vermomming."]
      },
      out: {
        nep: ["goed", 20, 0, "Goed gemeld", "Dank voor je melding. Dit bericht ging naar meer crewleden. We halen het overal weg.", "Servicedesk"],
        twijfel: ["half", 10, 0, "Veilig, maar meld het", "Wij hebben niets gestuurd. Goed dat je belde, maar zo'n bericht mag je meteen melden met de meldknop.", "Servicedesk"],
        echt: ["fout", 0, 25, "Je bent erin getrapt", "We zien een inlog op jouw account vanaf een onbekend apparaat. Wijzig nu je wachtwoord via het portaal dat je kent. Wij blokkeren de sessie.", "Servicedesk"]
      },
      why: "Een adres dat bijna klopt, een knop naar verify-login.com, haast en een vraag om je wachtwoord en code. Niet klikken, niets invullen, melden en dan pas verwijderen.",
      hint: "Lees het adres achter de naam letter voor letter. Staat er echt orion.space?",
      stake: ["Sanne Vrij en 11 andere crewleden kregen deze mail ook. Sanne staat op het punt te klikken.", "Trap je erin, dan verliest je schild 25 procent."]
    },
    {
      kind: "echt", name: "Noor, Datawacht", addr: "noor@orion.space", reply: "noor@orion.space",
      av: { face: "Noor" }, time: "09.30", subject: "Verplicht: ontruimingsoefening Vrachtdok om 14.00 uur",
      body: ["Hoi allemaal,", "Vandaag om 14.00 uur oefenen we de ontruiming van het Vrachtdok. [[haste|Kies vóór 11.00 uur een tijdslot. Wie dat niet doet, wordt door Kapitein Vega zelf ingedeeld.]]", "Vragen? Mijn nummer staat in het smoelenboek op het intranet."],
      button: { text: "Tijdslot kiezen", url: "https://intranet.orion.space/oefeningen/vrachtdok" }, sign: "Groet,<br>Noor",
      hs: {
        from: ["k", "Naam: Noor, Datawacht. Echt adres: noor@orion.space", "Naam en adres passen bij elkaar en het domein is precies orion.space."],
        reply: ["k", "Antwoord gaat naar noor@orion.space", "Je antwoord gaat naar hetzelfde, juiste adres."],
        haste: ["l", "Vóór 11.00 uur een tijdslot kiezen, anders deelt de kapitein je in", "Dringend en streng, maar er wordt niets gevaarlijks gevraagd. Een echt bericht kan ook haast hebben."],
        link: ["k", "Knop gaat naar intranet.orion.space", "Het domein is orion.space, het intranet van het station."]
      },
      out: {
        echt: ["goed", 20, 0, "Goed gezien", "Top, je staat om 14.20 uur ingedeeld. Tot straks bij de luchtsluis.", "Noor"],
        twijfel: ["half", 10, 0, "Veilig, maar niet nodig", "Ja hoor, die mail is echt van mij. Kies maar gauw een tijdslot.", "Noor"],
        nep: ["half", 5, 5, "Te voorzichtig", "We hebben gekeken. Dit bericht is echt, het komt van Noor. Melden kan nooit kwaad, maar kies nog wel een tijdslot.", "Servicedesk"]
      },
      why: "Dit bericht klinkt streng, maar adres, antwoordadres en link horen allemaal bij orion.space en er wordt niet om je wachtwoord, code of geld gevraagd. Een echt bericht kan ook dringend zijn.",
      hint: "Hoort alles bij orion.space? En vraagt het bericht om je wachtwoord, code of geld?",
      stake: ["De hele ploeg van het Vrachtdok wacht op dit rooster.", "Onterecht melden kost 5 procent schild."]
    },
    {
      kind: "nep", name: "Luitenant Mira", addr: "loon@orion-space.help", reply: "loon@orion-space.help",
      av: { t: "LM", c: "#62748e" }, time: "10.04", subject: "Je loonstrook van november staat klaar", banner: "portal",
      body: ["Beste collega,", "Je loonstrook van november staat voor je klaar in de crewportal. Er zijn geen wijzigingen ten opzichte van vorige maand.", "[[ask|Log in met je stationsaccount om hem te openen.]]"],
      button: { text: "Loonstrook bekijken", url: "https://crewportal.orion-space.help/login" }, sign: "Fijne dag,<br>Luitenant Mira, crewadministratie",
      hs: {
        from: ["v", "Naam: Luitenant Mira. Echt adres: loon@orion-space.help", "Mira mailt vanaf orion.space. Dit adres is orion-space.help, een ander domein dat erop lijkt. De naam past niet bij het adres."],
        reply: ["v", "Antwoord gaat naar loon@orion-space.help", "Ook je antwoord verlaat het station."],
        ask: ["v", "Vraagt je in te loggen via de knop in de mail", "Inloggen doe je via het portaal dat je zelf kent, niet via een knop in een mail."],
        link: ["v", "Knop gaat naar crewportal.orion-space.help", "Een nette knop naar het verkeerde domein. Daar staat een nagemaakte inlogpagina."]
      },
      out: {
        nep: ["goed", 20, 0, "Goed gemeld", "Klopt, dat is een nagemaakte crewportal. We blokkeren orion-space.help voor het hele station.", "Servicedesk"],
        twijfel: ["half", 10, 0, "Veilig, maar meld het", "Ik heb niets gestuurd. Je loonstrook staat gewoon in de crewportal op het intranet. Meld dit bericht wel.", "Mira"],
        echt: ["fout", 0, 25, "Je bent erin getrapt", "Je hebt ingelogd op een nagemaakte crewportal. Wijzig nu je wachtwoord via het portaal dat je kent. Wij blokkeren de sessie.", "Servicedesk"]
      },
      why: "Geen haast, geen spelfouten, een nette knop. Toch komt het van orion-space.help en gaat de knop naar dat domein. Netjes zegt niets. Inloggen doe je via het portaal dat je zelf kent.",
      hint: "Rustig en netjes zegt niets. Waar gaat de knop echt naartoe?",
      stake: ["Sanne Vrij kreeg dezelfde mail en wil haar loonstrook nu openen.", "Trap je erin, dan verliest je schild 25 procent."]
    },
    {
      kind: "twijfel", name: "Bram", addr: "bram@orion.space", reply: "bram@orion.space",
      av: { face: "Bram" }, time: "11.17", subject: "Nieuwe schema's voor vanmiddag",
      body: ["hey", "[[tone|hierbij de nieuwe schema's. even openen en checken voor vanmiddag]]", "gr bram"],
      attach: { shown: "Schema's vrachtdok", real: "schemas_vrachtdok_v2.zip", size: "2,4 MB" },
      hs: {
        from: ["k", "Naam: Bram. Echt adres: bram@orion.space", "Het adres klopt. Maar een juist adres bewijst niet dat het bericht klopt."],
        reply: ["k", "Antwoord gaat naar bram@orion.space", "Je antwoord gaat naar Bram zelf."],
        tone: ["l", "Heel kort, geen uitleg, alleen even openen", "Bram legt schema's normaal uit en zet ze in de gedeelde map. Deze toon past niet bij hem."],
        attach: ["l", "Echte bestandsnaam: schemas_vrachtdok_v2.zip, 2,4 MB", "Een .zip kan van alles bevatten. Een onverwachte bijlage open je pas als je het hebt nagevraagd."]
      },
      out: {
        twijfel: ["goed", 20, 0, "Goed nagevraagd", "Ja, die heb ik gestuurd. Sorry, ik had haast. Ik zet ze voortaan in de gedeelde map.", "Bram"],
        nep: ["half", 10, 0, "Veilig, maar navragen was sneller", "We hebben het nagekeken. Bram heeft dit echt gestuurd. Melden kan nooit kwaad, maar een belletje naar Bram was sneller.", "Servicedesk"],
        echt: ["fout", 0, 10, "Dit keer ging het goed", "Die was van mij, dus het ging goed. Maar open zo'n .zip niet zomaar. Had even gebeld.", "Bram"]
      },
      why: "Adres en antwoordadres klopten, maar de onverwachte .zip en de vreemde toon niet. Dan vraag je het na via een kanaal dat je zelf kiest, zoals Brams nummer op het intranet. Niet via een antwoord op de mail.",
      hint: "Het adres klopt. Verwachtte je deze bijlage? Hoe controleer je dat zonder deze mail te gebruiken?",
      stake: ["Het Vrachtdok werkt vanmiddag met deze schema's.", "Een onbekende .zip openen kost 10 procent schild."]
    },
    {
      kind: "nep", name: "Kapitein Vega", addr: "vega@orion.space", reply: "kapitein.vega@orbitpost.space",
      av: { face: "Vega" }, time: "11.48", subject: "Snel iets regelen",
      body: ["Cadet,", "[[tone|Ik zit de hele middag in overleg, bel me niet.]] [[ask|Koop 10 tegoedbonnen van 50 credits voor de kantine en mail mij de codes.]]", "[[haste|Het moet vóór 13.00 uur.]] Het is een verrassing voor de crew."],
      sign: "V.",
      hs: {
        from: ["k", "Naam: Kapitein Vega. Echt adres: vega@orion.space", "Het adres klopt. Toch kan het bericht nep zijn. Kijk ook naar het antwoordadres en het verzoek."],
        reply: ["v", "Antwoord gaat naar kapitein.vega@orbitpost.space", "Klik je op Beantwoorden, dan gaat je mail naar een ander domein. Zo komen de codes bij de oplichter."],
        tone: ["v", "Ik zit in overleg, bel me niet", "Wie je verbiedt te bellen, houdt je weg van het kanaal waarmee je het kunt controleren."],
        ask: ["v", "Vraagt om een betaling met tegoedbonnen en om de codes", "Een vraag om te betalen per mail is een groot alarmsignaal."],
        haste: ["v", "Het moet vóór 13.00 uur", "Haast moet je laten handelen voordat je navraagt."]
      },
      out: {
        nep: ["goed", 20, 0, "Goed gemeld", "Goed gezien. Iemand misbruikt de naam van de kapitein. We waarschuwen de hele crew.", "Servicedesk"],
        twijfel: ["half", 10, 0, "Veilig, maar meld het ook", "Ik heb niets gevraagd. Goed dat je belde. Meld het bericht nu ook.", "Vega"],
        echt: ["fout", 0, 25, "Je bent erin getrapt", "Tegoedbonnen? Daar weet ik niets van. Die codes zijn weg. Meld het direct bij de servicedesk.", "Vega"]
      },
      why: "Het adres van de kapitein klopt, maar je antwoord gaat naar orbitpost.space. Een vraag om te betalen, haast en bel me niet zijn samen een duidelijk teken. Melden, en wie twijfelt belt de kapitein via het bekende nummer.",
      hint: "Een juist adres is niet genoeg. Waar gaat je antwoord naartoe als je op Beantwoorden klikt?",
      stake: ["Je staat op het punt 500 credits aan tegoedbonnen te kopen.", "Trap je erin, dan verliest je schild 25 procent."]
    }
  ];
  const LABEL = { from: "Afzender", reply: "Antwoordadres", link: "Knop", attach: "Bijlage", haste: "Haast", ask: "Verzoek", tone: "Toon" };
  /* Neutrale vraag in de bewijslijst zolang je nog kijkt. De uitleg komt pas na je keuze. */
  const ASK = { from: "Klopt het domein achter de naam?", reply: "Waar gaat je antwoord echt naartoe?", link: "Waar leidt de knop echt naartoe?", attach: "Wat voor bestand is dit echt?", haste: "Zet het bericht je onder tijdsdruk?", ask: "Wat vraagt het bericht van je?", tone: "Past de toon bij de afzender?" };
  const KIND_ICON = { from: "user", reply: "undo", link: "link", attach: "file", haste: "clock", ask: "lock", tone: "msg" };
  const TAG = { v: ["bad", "Verdacht"], k: ["ok", "Klopt"], l: ["warn", "Let op"] };
  const CHOICE = { echt: ["check", "Echt", "afhandelen"], nep: ["flag", "Nep", "melden"], twijfel: ["phone", "Twijfel", "navragen via bekend kanaal"] };
  const STAMP = { echt: "Afgehandeld", nep: "Gemeld", twijfel: "Nagevraagd" };
  const TRAY = { echt: ["check", "Afgehandeld"], nep: ["flag", "Meldbak"], twijfel: ["phone", "Navraag"] };
  const DESK = Mini.crewFace(4400, { hairStyle: "bob", hair: "#3b2414", skin: "#d7a782", suit: "#0a6dbe", accent: "#7bf1a8", glasses: false });
  const SPK = { Servicedesk: ["Femke", "servicedesk", DESK], Noor: ["Noor", "Datawacht", FACES.Noor], Bram: ["Bram", "Vrachtdok", FACES.Bram], Vega: ["Kapitein Vega", "kapitein", FACES.Vega], Mira: ["Luitenant Mira", "crewadministratie", FACES.Mira] };
  const trays = { echt: 0, nep: 0, twijfel: 0 }; let incidents = 0;
  function crewSay(k, text, mood) { const [n, r, f] = SPK[k]; return `<div class="say ${mood || ""} fade-in"><div class="face">${f}</div><div class="grow"><div class="who">${esc(n)}<span>${esc(r)}</span></div><div class="txt">${esc(text)}</div></div></div>`; }

  const G = game({ id: "de-postkamer", title: "De postkamer", topic: "Phishing en beveiliging", module: "Vrachtdok", max: 100, steps: ["Briefing", "Bericht 1", "Bericht 2", "Bericht 3", "Bericht 4", "Bericht 5", "Debriefing"], onStart: () => play(0) });

  /* ---------- Briefing ---------- */
  const art = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="pkbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b2a58"/><stop offset="1" stop-color="#030c20"/></linearGradient>
    <linearGradient id="pkmetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6f8c"/><stop offset="1" stop-color="#26354d"/></linearGradient>
    <radialGradient id="pkglass" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff" stop-opacity=".22"/><stop offset="1" stop-color="#a1deff" stop-opacity=".05"/></radialGradient>
    <clipPath id="pklens"><circle cx="258" cy="132" r="54"/></clipPath></defs>
    <rect width="400" height="300" fill="url(#pkbg)"/>
    <g opacity=".5" stroke="#13559b" stroke-width="1">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${40 + i * 30}H400"/>`).join("")}</g>
    <rect x="34" y="34" width="332" height="232" rx="18" fill="url(#pkmetal)" stroke="#90a1b9" stroke-opacity=".5"/>
    ${[[46, 46], [354, 46], [46, 254], [354, 254]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#1d293d" stroke="#90a1b9" stroke-width="1"/>`).join("")}
    <rect x="52" y="52" width="296" height="196" rx="8" fill="#06224c"/>
    <rect x="52" y="52" width="72" height="196" rx="8" fill="#0c2f5f"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="58" y="${62 + i * 36}" width="60" height="30" rx="5" fill="${i === 0 ? "#13559b" : "#0a2a55"}"/><rect x="63" y="${68 + i * 36}" width="34" height="5" rx="2" fill="#a1deff" opacity=".8"/><rect x="63" y="${78 + i * 36}" width="46" height="4" rx="2" fill="#67caff" opacity=".4"/>`).join("")}
    <rect x="132" y="60" width="208" height="180" rx="6" fill="#f1f5fa"/>
    <circle cx="150" cy="82" r="10" fill="#c10007"/><text x="150" y="86" text-anchor="middle" font-family="Figtree,sans-serif" font-weight="800" font-size="9" fill="#fff">SO</text>
    <rect x="166" y="74" width="80" height="7" rx="3" fill="#1d293d"/><rect x="166" y="86" width="52" height="5" rx="2" fill="#90a1b9"/>
    <rect x="144" y="104" width="180" height="6" rx="3" fill="#314158"/><rect x="144" y="116" width="160" height="6" rx="3" fill="#62748e"/><rect x="144" y="128" width="170" height="6" rx="3" fill="#62748e"/>
    <rect x="144" y="148" width="92" height="22" rx="6" fill="#0a6dbe"/><rect x="154" y="156" width="70" height="6" rx="3" fill="#fff"/>
    <rect x="144" y="182" width="150" height="6" rx="3" fill="#90a1b9"/><rect x="144" y="194" width="110" height="6" rx="3" fill="#90a1b9"/>
    <g clip-path="url(#pklens)"><rect x="196" y="70" width="130" height="130" fill="#e6edf6"/>
      <rect x="210" y="112" width="110" height="30" rx="5" fill="#06224c" stroke="#ffb900" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="216" y="132" font-family="Source Sans 3,sans-serif" font-weight="700" font-size="13" fill="#ffd230">orion-statlon</text>
      <rect x="210" y="152" width="96" height="8" rx="4" fill="#314158"/><rect x="210" y="86" width="70" height="10" rx="4" fill="#1d293d"/></g>
    <circle cx="258" cy="132" r="54" fill="url(#pkglass)"/>
    <circle cx="258" cy="132" r="54" fill="none" stroke="#cad5e2" stroke-width="9"/>
    <circle cx="258" cy="132" r="54" fill="none" stroke="#62748e" stroke-width="2"/>
    <rect x="292" y="168" width="18" height="70" rx="8" fill="#ffb900" transform="rotate(-42 301 203)"/>
    <rect x="296" y="164" width="12" height="18" rx="3" fill="#90a1b9" transform="rotate(-42 301 203)"/>
  </svg>`;
  G.intro({
    lead: "Op de postterminal van het Vrachtdok staan vijf nieuwe berichten. Sommige zijn echt, sommige zijn phishing. Een mailprogramma laat niet alles zien. Jouw loep wel.",
    who: "ARIA",
    line: "Een bericht kan er netjes uitzien en toch nep zijn. En een streng bericht kan gewoon kloppen. Kijk eerst, beslis dan.",
    rules: [["search", "Wijs met de <b>loep</b> afzender, knop, bijlage en tekst aan. Wat erachter zit, staat in de strook onder de mail. Met Tab spring je naar elk onderdeel. Wat je vindt komt in de bewijslijst."],
      ["flag", "Beslis per bericht: <b>echt</b> en afhandelen, <b>nep</b> en melden, of bij <b>twijfel</b> navragen via een kanaal dat je zelf kiest."],
      ["gem", "Vind je in een nepbericht alle signalen voordat je beslist? Dan krijg je een kristal. Een verkeerde keuze kost schild."]],
    art, note: "Vijf berichten, geen tijdsdruk, ongeveer 4 minuten"
  });

  /* ---------- Een bericht ---------- */
  let M, idx, found, decided, lens, docEl;
  const results = [];

  function markup(t) {
    return t.replace(/\[\[(\w+)\|([^\]]+)\]\]/g, (_, k, s) => `<span class="hs phrase" data-hs="${k}" tabindex="0" role="button" aria-label="${esc(LABEL[k])}, onder de loep bekijken">${s}</span>`);
  }
  const wb = (t) => esc(t).replace(/([@./_-])/g, "$1<wbr>");
  function avatar(av) { return av.face ? `<span class="pk-av face">${FACES[av.face]}</span>` : `<span class="pk-av" style="background:${av.c}">${av.t}</span>`; }

  function railHTML() {
    return MSGS.map((m, i) => {
      const r = results[i], st = r ? r : i === idx ? "now" : "todo";
      return `<li class="pk-it ${st}" ${i === idx ? 'aria-current="true"' : ""}>${avatar(m.av)}<span class="t"><span class="top"><b>${esc(m.name)}</b><span class="s">${r ? icon(r === "goed" ? "check" : r === "half" ? "half" : "x", "sm") : i === idx ? "" : `<i class="dot"></i>`}<small>${m.time}</small></span></span><span class="sub">${esc(m.subject)}</span></span></li>`;
    }).join("");
  }

  function docHTML(m) {
    const banner = m.banner === "alarm" ? `<div class="pk-banner alarm">${icon("alert", "sm")}Beveiligingsmelding</div>` : m.banner === "portal" ? `<div class="pk-banner portal"><span class="logo"><i></i><i></i><i></i></span>Orion Crewportal</div>` : "";
    return `<article class="pk-doc">
      <div class="pk-from">${avatar(m.av)}
        <div class="pk-fromtxt">
          <span class="hs from" data-hs="from" tabindex="0" role="button" aria-label="Afzender, onder de loep bekijken"><b>${esc(m.name)}</b><span class="xr">${wb(m.addr)}</span></span>
          <span class="pk-to">aan mij · vandaag ${m.time}</span>
        </div>
        <span class="hs reply" data-hs="reply" tabindex="0" role="button" aria-label="Beantwoorden, onder de loep bekijken"><span class="pk-replybtn">${icon("undo", "sm")}Beantwoorden</span><span class="xr">Antwoord naar<br>${wb(m.reply)}</span></span>
      </div>
      ${banner}
      <div class="pk-body">${m.body.map((p) => `<p>${markup(esc(p))}</p>`).join("")}</div>
      ${m.button ? `<div class="pk-btnrow"><span class="hs link" data-hs="link" tabindex="0" role="button" aria-label="Knop, onder de loep bekijken"><span class="pk-cta">${esc(m.button.text)}</span><span class="xr">${wb(m.button.url)}</span></span></div>` : ""}
      ${m.attach ? `<div class="pk-attrow"><span class="hs attach" data-hs="attach" tabindex="0" role="button" aria-label="Bijlage, onder de loep bekijken"><span class="pk-file">${icon("file")}<span><b>${esc(m.attach.shown)}</b><small>Bijlage</small></span></span><span class="xr">${wb(m.attach.real)}<br>${esc(m.attach.size)}</span></span></div>` : ""}
      ${m.sign ? `<p class="pk-sign">${m.sign}</p>` : ""}
    </article>`;
  }

  function play(i) {
    idx = i; M = MSGS[i]; found = []; decided = false;
    G.setStep(i + 1);
    G.head("Bericht van " + M.name, `<span class="chip">${icon("mail", "sm")}${i + 1} van ${MSGS.length}</span><span class="chip">${icon("search", "sm")}Geen tijdsdruk</span>`);
    G.stage.innerHTML = "";
    const parts = Object.keys(M.hs).length;
    const n = h(`<div class="pk fade-in">
      <section class="pk-term" aria-label="Postterminal Vrachtdok">
        <div class="pk-plate"><span class="screw"></span><span>Postterminal Vrachtdok</span><span class="pk-inc ${incidents ? "bad" : ""}" data-inc><i></i>${incidents ? (incidents === 1 ? "1 incident" : incidents + " incidenten") : "Geen incidenten"}</span><span class="screw"></span></div>
        <div class="pk-screen">
          <aside class="pk-rail"><div class="pk-rail-head">${icon("mail", "sm")}Postvak in<span class="pk-unread" data-unread>${unread} ongelezen</span></div><div class="pk-ticker" data-ticker aria-live="polite">${icon("mail", "sm")}<span>${esc(ticker || "Het Vrachtdok draait door")}</span></div><ul data-rail>${railHTML()}</ul></aside>
          <div class="pk-pane"><div class="pk-subjbar" data-grab title="Sleep de mail naar een bak"><span class="pk-grip" aria-hidden="true">${icon("move", "sm")}</span><h3 class="pk-subj">${esc(M.subject)}</h3><span class="pk-stamp" data-stamp hidden></span><span class="pk-draghint" data-draghint>Sleep naar een knop hieronder</span></div>
          <div class="pk-paper" data-paper tabindex="-1">${docHTML(M)}</div>
          <div class="pk-read" data-read aria-live="polite">${icon("search")}<span><b>Onder de loep</b>Beweeg de loep over de mail. Hier zie je wat erachter zit.</span></div>
          <div class="pk-dec" data-dec role="group" aria-labelledby="pk-q">
            <p class="pk-dec-q" id="pk-q">Wat doe je met dit bericht?</p>
            <div class="pk-choices">${Object.keys(CHOICE).map((k) => `<button class="pk-choice ${k}" type="button" data-c="${k}" data-tray="${k}" aria-label="${CHOICE[k][1]}, ${CHOICE[k][2]}">${icon(CHOICE[k][0])}<span><b>${CHOICE[k][1]}</b><small>${k === "twijfel" ? "navragen" : CHOICE[k][2]}</small></span></button>`).join("")}</div>
          </div></div>
        </div>
      </section>
      <section class="pk-side"><div class="pk-side-in">
        <div class="pk-ev">
          <div class="pk-ev-head"><h3>${icon("search")}Bewijslijst</h3><span data-evcount>0 van ${parts} bekeken</span></div>
          <ul class="pk-ev-list" data-ev aria-live="polite">${Array.from({ length: parts }, (_, k) => `<li class="pk-slot">${icon("search", "sm")}<span>${k ? "Nog niet bekeken" : "Nog niet bekeken. Wijs een onderdeel van de mail aan."}</span></li>`).join("")}</ul>
          <div class="pk-stake" data-stake><b>${icon("alert", "sm")}Wat er op het spel staat</b>
            <p class="who">${icon("user", "sm")}<span>${esc(M.stake[0])}</span></p>
            <p class="sh">${icon("shield", "sm")}<span>${esc(M.stake[1])}</span></p></div>
        </div>
        <div class="pk-say" data-say></div>
      </div></section>
    </div>`);
    G.stage.appendChild(n);
    docEl = $(".pk-doc", n);
    sayLine(i === 0 ? "Zet de loep op de naam van de afzender. Wat staat er echt achter?" : i === 2 ? "Dit bericht ziet er netjes uit. Laat je daar niet door leiden." : "Neem de tijd. Bekijk afzender, antwoordadres en wat het bericht van je vraagt.");
    $$("[data-c]", n).forEach((b) => b.addEventListener("click", () => decide(b.dataset.c)));
    dragMail($("[data-grab]", n));
    startMailflow();
    lens = makeLens($("[data-paper]", n));
  }

  function sayLine(t, mood, side) {
    $("[data-say]", G.stage).innerHTML = G.sayHTML("ARIA", t, { mood, side: side !== undefined ? side : `<button class="btn sm ghost" type="button" data-hint>${icon("bulb", "sm")}Aanwijzing</button><span class="hintcost">${esc(G.hintLabel())}</span>` });
    const hb = $("[data-hint]", G.stage); if (hb) hb.addEventListener("click", () => { const c = G.hint(); sayLine(M.hint + (c ? " (min 10 procent schild)" : "")); });
  }

  /* ---------- De loep ----------
     De loep bedekt nooit tekst. Ze verschijnt als klein vergrootglas naast de wijzer of naast het onderdeel
     waar je met Tab op staat. Wat erachter zit, het echte adres, de echte link of de echte bestandsnaam,
     staat in de vaste strook Onder de loep, direct onder de mail. Het onderdeel zelf krijgt een rand. */
  const MAG = `<svg viewBox="0 0 40 40"><circle cx="16" cy="16" r="11" fill="rgba(161,222,255,.35)" stroke="currentColor" stroke-width="4"/><path d="M24.5 24.5 35 35" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`;
  function makeLens(paper) {
    const S = 36, el = h(`<div class="pk-mag" aria-hidden="true">${MAG}</div>`);
    paper.appendChild(el);
    let px = 0, py = 0, hoverK = null, dwellT = null;
    function rel(e) { const r = paper.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    // Rechthoeken van alle tekst in de mail, in coördinaten van het mailvlak.
    function textRects() {
      const pr = paper.getBoundingClientRect(), out = [], w = document.createTreeWalker(docEl, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const t = w.currentNode; if (!t.textContent.trim()) continue;
        const rg = document.createRange(); rg.selectNodeContents(t);
        for (const q of rg.getClientRects()) out.push([q.left - pr.left, q.top - pr.top, q.right - pr.left, q.bottom - pr.top]);
      }
      return out;
    }
    // Zet het glas op de eerste plek waar het geen tekst raakt. Is er geen vrije plek, dan blijft het weg.
    function put(cands) {
      const W = paper.clientWidth, H = paper.clientHeight, rs = textRects();
      const ok = ([x, y]) => x >= 0 && y >= 0 && x + S <= W && y + S <= H && !rs.some((r) => r[2] > x + 2 && r[0] < x + S - 2 && r[3] > y + 2 && r[1] < y + S - 2);
      const c = cands.find(ok);
      if (!c) { el.classList.remove("show"); return; }
      el.style.transform = `translate(${c[0]}px, ${c[1]}px)`; el.classList.add("show");
    }
    // Naast de wijzer: rechtsonder, rechtsboven, linksonder of linksboven.
    const glyph = (x, y) => put([[x + 14, y + 12], [x + 14, y - 12 - S], [x - 14 - S, y + 12], [x - 14 - S, y - 12 - S]]);
    // Naast een onderdeel: rechts of links ervan, eronder, erboven of in de rechterkantlijn.
    function beside(s) {
      const pr = paper.getBoundingClientRect(), rs = s.getClientRects(), a = rs[0], z = rs[rs.length - 1];
      const L = (r) => r.left - pr.left, T = (r) => r.top - pr.top, R = (r) => r.right - pr.left, B = (r) => r.bottom - pr.top;
      put([[R(z) + 10, T(z) + z.height / 2 - S / 2], [L(a) - 10 - S, T(a) + a.height / 2 - S / 2], [R(z) - S, B(z) + 4], [L(a), T(a) - 4 - S], [paper.clientWidth - S - 2, T(z) + z.height / 2 - S / 2]]);
    }
    function place(nx, ny, instant, s) {
      px = Math.max(0, Math.min(paper.clientWidth, nx)); py = Math.max(0, Math.min(paper.clientHeight, ny));
      const over = check(instant), hs = s || (over && $(`[data-hs="${over}"]`, docEl));
      if (hs) beside(hs); else glyph(px, py);
    }
    /* Een signaal telt pas als gevonden als de wijzer er even op blijft rusten. Zo vult de bewijslijst zich niet
       vanzelf als je de muis alleen over de mail naar de knoppen beweegt. Met het toetsenbord telt het direct. */
    function check(instant) {
      const pr = paper.getBoundingClientRect(), rr = 14; let over = null, best = Infinity;
      $$(".hs", docEl).forEach((s) => {
        Array.from(s.getClientRects()).forEach((r) => {
          const cx = Math.max(r.left - pr.left, Math.min(px, r.right - pr.left)), cy = Math.max(r.top - pr.top, Math.min(py, r.bottom - pr.top));
          const d = (cx - px) ** 2 + (cy - py) ** 2;
          if (d <= rr * rr && d < best) { best = d; over = s.dataset.hs; }
        });
      });
      el.classList.toggle("on", !!over);
      $$(".hs.lensed", docEl).forEach((s) => s.dataset.hs !== over && s.classList.remove("lensed"));
      if (over) {
        $(`[data-hs="${over}"]`, docEl).classList.add("lensed");
        const xr = $(`[data-hs="${over}"] .xr`, docEl), rd = $("[data-read]", G.stage);
        rd.className = "pk-read on"; rd.innerHTML = `${icon(KIND_ICON[over])}<span><b>${LABEL[over]}</b>${xr ? xr.innerHTML.replace(/<br>/g, " ") : esc(ASK[over])}</span>`;
      }
      if (over !== hoverK) { clearTimeout(dwellT); hoverK = over; if (over && !instant) dwellT = setTimeout(() => { if (hoverK === over) reveal(over); }, 380); }
      if (over && instant) reveal(over);
      return over;
    }
    // Buiten de mail verdwijnt het glas. De strook houdt het laatste onderdeel vast, zodat je het rustig kunt lezen.
    function park() {
      clearTimeout(dwellT); hoverK = null;
      el.classList.remove("show", "on");
      $$(".hs.lensed", docEl).forEach((s) => s.classList.remove("lensed"));
    }
    park();
    paper.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || e.buttons) { const p = rel(e); place(p[0], p[1]); } });
    paper.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") park(); });
    paper.addEventListener("pointerdown", (e) => { const p = rel(e); place(p[0], p[1]); });
    const center = (s) => { const pr = paper.getBoundingClientRect(), r = s.getClientRects()[0]; return [r.left - pr.left + r.width / 2, r.top - pr.top + r.height / 2]; };
    $$(".hs", docEl).forEach((s) => {
      const go = () => { const c = center(s); place(c[0], c[1], true, s); };
      s.addEventListener("focus", go);
      s.addEventListener("blur", () => setTimeout(() => { if (!paper.contains(document.activeElement)) park(); }, 0));
      s.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    return { place, park, at: (k) => { const s = $(`[data-hs="${k}"]`, docEl), c = center(s); place(c[0], c[1], true, s); } };
  }

  /* ---------- Bewijs ---------- */
  function reveal(k) {
    if (found.includes(k) || decided) return;
    found.push(k); Mini.sound.play("tap");
    const s = $(`[data-hs="${k}"]`, docEl); s.classList.add("found", "glow"); setTimeout(() => s.classList.remove("glow"), 1200);
    const list = $("[data-ev]", G.stage), slot = $(".pk-slot", list), card = h(cardHTML(k, false));
    if (slot) slot.replaceWith(card); else list.appendChild(card);
    card.classList.add("slide-in");
    $("[data-evcount]", G.stage).textContent = `${found.length} van ${Object.keys(M.hs).length} bekeken`;
    if (found.length === Object.keys(M.hs).length) sayLine("Je hebt alles bekeken. Wat doe je met dit bericht?");
  }
  function cardHTML(k, after, missed) {
    const [tag, , note] = M.hs[k];
    // Na het oordeel: gevonden signalen groen, gemiste amber, wat klopt blauw.
    const st = tag === "k" ? "k" : missed ? "miss" : "hit";
    const lab = tag === "k" ? ["", "Klopt"] : missed ? ["warn", tag === "v" ? "Gemist, verdacht" : "Gemist, let op"] : ["ok", tag === "v" ? "Gevonden, verdacht" : "Gevonden, let op"];
    return `<li class="pk-card ${after ? "j-" + st : ""}" data-card="${k}">
      <span class="ic">${icon(KIND_ICON[k], "sm")}</span>
      <div><div class="top"><b>${LABEL[k]}</b>${after ? `<span class="tag ${lab[0]}">${lab[1]}</span>` : ""}</div>
      ${!after ? `<p>${esc(ASK[k])}</p>` : ""}${after ? `<p class="note">${esc(note)}</p>` : ""}</div></li>`;
  }

  /* ---------- Beslissen ---------- */
  async function decide(c) {
    if (decided) return; decided = true;
    const [res, pts, sh, title, line, who] = M.out[c];
    const clues = Object.keys(M.hs).filter((k) => M.hs[k][0] === "v");
    const allClues = M.kind === "nep" && clues.every((k) => found.includes(k));
    const missedK = clues.filter((k) => !found.includes(k));
    const missedTxt = M.kind !== "nep" ? "" : allClues ? "Alle signalen gevonden. Dat leverde een kristal op." : `Gemist: ${missedK.map((k) => LABEL[k].toLowerCase()).join(" en ")}. Daardoor geen kristal.`;
    stopMailflow();
    $$("[data-c]", G.stage).forEach((b) => { b.disabled = true; b.classList.toggle("picked", b.dataset.c === c); });
    lens.park(); $(".pk-mag", G.stage).classList.add("away");
    Mini.sound.play("close");
    results[idx] = res; unread = Math.max(0, unread - 1);
    G.record({ result: res, points: pts, shield: sh, q: M.subject, a: `${CHOICE[c][1]}, ${CHOICE[c][2]}`, why: M.why, title, short: line });
    if (allClues) G.gem("Je vond alle signalen in dit nepbericht voordat je besliste.");
    // het bericht gaat als envelop naar zijn bak
    await fly(c);
    const st = $("[data-stamp]", G.stage); st.className = "pk-stamp r-" + res; st.innerHTML = `${icon(TRAY[c][0], "sm")}${STAMP[c]}`; st.hidden = false;
    if (res === "fout") { incidents++; const inc = $("[data-inc]", G.stage); inc.className = "pk-inc bad flash"; inc.innerHTML = `<i></i>${incidents === 1 ? "1 incident" : incidents + " incidenten"}`; }
    // bewijslijst krijgt het oordeel, gemiste onderdelen bovenaan
    const list = $("[data-ev]", G.stage); list.innerHTML = "";
    const keys = Object.keys(M.hs);
    keys.filter((k) => !found.includes(k)).concat(keys.filter((k) => found.includes(k))).forEach((k) => list.appendChild(h(cardHTML(k, true, !found.includes(k)))));
    $$(".pk-card", list).forEach((c2, i) => { c2.style.animationDelay = i * 70 + "ms"; c2.classList.add("slide-in"); });
    list.scrollTop = 0;
    $$(".hs", docEl).forEach((s) => { const k = s.dataset.hs, t = M.hs[k][0]; s.classList.add("judged", t === "k" ? "j-k" : found.includes(k) ? "j-hit" : "j-miss"); });
    $("[data-read]", G.stage).hidden = true;
    $("[data-paper]", G.stage).classList.add("done");
    const stake = $("[data-stake]", G.stage); if (stake) stake.remove();
    $("[data-evcount]", G.stage).textContent = clues.length ? `${clues.filter((k) => found.includes(k)).length} van ${clues.length} signalen gevonden` : "geen nepsignalen in dit bericht";
    const right = Object.keys(M.out).find((k) => M.out[k][0] === "goed");
    const last = idx === MSGS.length - 1;
    const dec = $("[data-dec]", G.stage); dec.className = "pk-dec r-" + res;
    dec.innerHTML = `<div class="pk-fb ${res} fade-in" role="status">
      <span class="dot">${icon(res === "goed" ? "check" : res === "half" ? "half" : "x", "lg")}</span>
      <div class="pk-fb-txt"><small class="pk-fb-k">Oordeel bericht ${idx + 1}</small><b>${esc(title)}<span class="pts">${pts ? "+" + pts : "0"}${sh ? ` ${icon("shield", "sm")}min ${sh} procent schild` : ""}</span></b><span>Jij koos ${CHOICE[c][1].toLowerCase()}, ${CHOICE[c][2]}.${res === "goed" ? "" : ` Beste keuze: <strong>${CHOICE[right][1].toLowerCase()}, ${CHOICE[right][2]}</strong>.`}</span>
      ${missedTxt ? `<span class="pk-missed">${icon("gem", "sm")}${esc(missedTxt)}</span>` : ""}</div>
      <button class="btn" type="button" data-next>${last ? "Naar de debriefing" : "Volgend bericht"}${icon("arrow")}</button>
    </div>`;
    $("[data-say]", G.stage).innerHTML = crewSay(who, line, res === "goed" ? "ok" : res === "half" ? "half" : "bad");
    $("[data-rail]", G.stage).innerHTML = railHTML();
    const nb = $("[data-next]", G.stage); nb.addEventListener("click", () => last ? end() : next()); nb.focus();
  }
  async function fly(c) {
    const tray = $(`[data-tray="${c}"]`, G.stage), paper = $("[data-paper]", G.stage);
    trays[c]++;
    const bump = () => {};
    if (Mini.reduce || G.shot || !tray.offsetParent || dropped) { dropped = false; bump(); return; }
    const a = paper.getBoundingClientRect(), b = tray.getBoundingClientRect();
    const env = h(`<div class="pk-env">${icon("mail", "lg")}</div>`); document.body.appendChild(env);
    const x0 = a.left + a.width / 2 - 40, y0 = a.top + a.height / 2 - 28, x1 = b.left + 20, y1 = b.top + b.height / 2 - 28;
    docEl.classList.add("sent");
    await env.animate([{ transform: `translate(${x0}px, ${y0}px) scale(1.6)`, opacity: 0 }, { transform: `translate(${x0}px, ${y0}px) scale(1.2)`, opacity: 1, offset: .25 }, { transform: `translate(${x1}px, ${y1}px) scale(.6)`, opacity: 1 }], { duration: 650, easing: "cubic-bezier(.5,0,.3,1)" }).finished;
    env.remove(); bump(); docEl.classList.remove("sent");
  }
  /* ---------- De mail naar een bak slepen ---------- */
  function dragMail(handle) {
    let ghost = null, over = null;
    const trayAt = (x, y) => { const e = document.elementFromPoint(x, y); return e && e.closest("[data-tray]"); };
    handle.addEventListener("pointerdown", (e) => {
      if (decided || e.button > 0) return;
      e.preventDefault(); handle.setPointerCapture(e.pointerId);
      ghost = h(`<div class="pk-ghost">${icon("mail", "lg")}<span>${esc(M.subject)}</span></div>`); document.body.appendChild(ghost);
      G.stage.querySelector(".pk").classList.add("dragging");
      move(e);
    });
    function move(e) {
      if (!ghost) return;
      ghost.style.transform = `translate(${e.clientX - 30}px, ${e.clientY - 26}px)`;
      ghost.style.visibility = "hidden"; const t = trayAt(e.clientX, e.clientY); ghost.style.visibility = "";
      if (over !== t) { over && over.classList.remove("hover"); over = t; over && over.classList.add("hover"); }
    }
    handle.addEventListener("pointermove", move);
    const up = () => {
      if (!ghost) return;
      ghost.remove(); ghost = null; G.stage.querySelector(".pk")?.classList.remove("dragging");
      if (over) { const k = over.dataset.tray; over.classList.remove("hover"); over = null; dropped = true; decide(k); }
    };
    handle.addEventListener("pointerup", up); handle.addEventListener("pointercancel", up);
  }

  /* Lichte druk: terwijl je kijkt, komt er nieuwe post binnen. Geen straf. */
  const FILLER = [["Kantine", "Menu van vandaag"], ["Dok 3", "Levering vertraagd"], ["Bram", "Lift B weer open"], ["Noor", "Agenda Datawacht"], ["Ziekenboeg", "Griepprik vrijdag"], ["Brug", "Koerswijziging 14.00 uur"], ["Mira", "Roosters december"], ["Dok 1", "Vracht gelost"]];
  let unread = 4, ticker = "", flowT = null, fi = 0, dropped = false;
  function startMailflow() {
    stopMailflow(); if (G.shot) return;
    flowT = setInterval(() => {
      if (decided) return;
      const f = FILLER[fi++ % FILLER.length]; unread++; ticker = `Nieuw van ${f[0]}: ${f[1]}`;
      const u = $("[data-unread]", G.stage), t = $("[data-ticker]", G.stage); if (!u) return;
      u.textContent = unread + " ongelezen"; u.classList.remove("bump"); void u.offsetWidth; u.classList.add("bump");
      t.innerHTML = icon("mail", "sm") + `<span>${esc(ticker)}</span>`; t.classList.remove("in"); void t.offsetWidth; t.classList.add("in");
      Mini.sound.play("tap");
    }, 14000);
  }
  function stopMailflow() { clearInterval(flowT); flowT = null; }

  async function next() {
    const t = $(".pk-paper .pk-doc", G.stage); if (t && !Mini.reduce) { t.classList.add("out"); await wait(300); }
    play(idx + 1);
  }

  function end() {
    G.finish({ takeaway: "Kijk achter de naam, de knop en de bijlage voordat je iets doet. Vraagt een bericht om je wachtwoord, je code of geld, klik dan niet en meld het. Twijfel je, vraag het na via een kanaal dat je zelf kiest." });
  }

  /* ---------- Vaste standen voor schermafbeeldingen (?shot=) ---------- */
  if (G.shot) {
    unread = 6; ticker = "Nieuw van Kantine: Menu van vandaag";
    G.begin();
    /* Halverwege: twee berichten zijn afgehandeld, in bericht 3 zijn twee van de vier onderdelen bekeken en ligt de loep op de knop. */
    if (G.shot === "play") {
      [["goed", 20, "nep"], ["half", 10, "twijfel"]].forEach(([r, p, c], i) => { results[i] = r; G.record({ result: r, points: p, q: MSGS[i].subject, a: `${CHOICE[c][1]}, ${CHOICE[c][2]}`, why: MSGS[i].why, toast: false }); });
      unread = 4; play(2);
      setTimeout(() => { lens.at("from"); lens.at("link"); }, 300);
    }
    if (G.shot === "feedback") { setTimeout(() => { ["haste", "link", "from", "reply"].forEach((k) => lens.at(k)); setTimeout(() => decide("nep"), 100); }, 300); }
    if (G.shot === "result") {
      [["goed", 20, 0, "nep"], ["half", 10, 0, "twijfel"], ["goed", 20, 0, "nep"], ["fout", 0, 10, "echt"], ["goed", 20, 0, "nep"]].forEach(([r, p, s, c], i) => G.record({ result: r, points: p, shield: s, q: MSGS[i].subject, a: `${CHOICE[c][1]}, ${CHOICE[c][2]}`, why: MSGS[i].why, toast: false }));
      G.hint(); G.hint(); G.gem(); G.gem(); end();
    }
  }
})();
