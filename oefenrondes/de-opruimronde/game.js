/* De opruimronde. Onderwerp: doel en bewaartermijn.
   In het cryo-archief rijden kratten met gegevens over een lopende band. De speler stuurt elke krat
   naar een van drie luiken: Bewaren (nog nodig voor het doel), Archiveren (alleen nog omdat de wet
   het eist) of Wissen (geen doel en geen termijn meer). De krat rijdt erheen, het luik gaat open,
   het lampje geeft het oordeel. Vijf op rij goed levert een kristal op. */
const { game, icon, esc, $, $$, h } = Mini;
const reduce = Mini.reduce;
const SHOT = Mini.params.get("shot") || "";
const FAST = SHOT ? 3 : 1;

function glOK() { try { const c = document.createElement("canvas"); return !!(window.WebGL2RenderingContext && c.getContext("webgl2")); } catch (e) { return false; } }
let S3D = null;
if (Mini.params.get("3d") !== "uit" && glOK()) { try { S3D = await import("scene3d"); } catch (e) { S3D = null; } }

/* ---------- Inhoud ---------- */
const TODAY = "26 november 2247";
const EXITS = {
  bewaren: { naam: "Bewaren", sub: "Actief archief", uitleg: "Nog nodig voor het doel", key: "←", keyName: "pijl links", icon: "save", col: "#15aaff", hex: 0x15aaff, x: -3.5 },
  archiveren: { naam: "Archiveren", sub: "Afgesloten kluis", uitleg: "Alleen nog voor de wet", key: "↑", keyName: "pijl omhoog", icon: "lock", col: "#ffb900", hex: 0xffb900, x: 0 },
  wissen: { naam: "Wissen", sub: "Versnipperaar", uitleg: "Doel en termijn voorbij", key: "→", keyName: "pijl rechts", icon: "trash", col: "#ff6467", hex: 0xff6467, x: 3.5 }
};
const ORDER = ["bewaren", "archiveren", "wissen"];
const R_LOON = "Loonadministratie, zoals loonstroken en loonstaten, bewaar je 7 jaar. Dat is een fiscale bewaarplicht.";
const R_CAM = "Camerabeelden bewaar je maximaal 4 weken, tenzij er een incident op staat dat onderzocht wordt.";
const R_SOL = "Sollicitatiegegevens van een afgewezen kandidaat verwijder je uiterlijk 4 weken na de procedure. Met toestemming van de kandidaat mag het maximaal 1 jaar.";
const K_LOON = "Loonadministratie: 7 jaar fiscale bewaarplicht.";
const K_CAM = "Camerabeelden: maximaal 4 weken, tenzij een incident wordt onderzocht.";
const K_SOL = "Afgewezen kandidaat: uiterlijk 4 weken na de procedure weg, met toestemming maximaal 1 jaar.";
/* soort is overal dezelfde naam: op de krat, op het label en in het logboek */
const CRATES = [
  { soort: "Dienstrooster", jaar: "nov 2247", datum: "november 2247", persoon: "Crew van de passagiersmodule, in dienst", extra: "Wordt elke dag gebruikt voor de diensten", answer: "bewaren",
    rule: "Je bewaart gegevens zolang je ze nodig hebt voor het doel waarvoor je ze hebt.", regel: "Bewaar zolang je het nodig hebt voor het doel.", waarom: "Je gebruikt het rooster van deze maand elke dag.",
    why: "Het rooster van deze maand gebruik je elke dag. Het doel loopt nog, dus het blijft in het actieve archief." },
  { soort: "Loonstrook", jaar: "mrt 2243", datum: "maart 2243", persoon: "Jesse Akkerman, nog in dienst", extra: "Loon is uitbetaald en verwerkt", answer: "archiveren", rule: R_LOON, regel: K_LOON, waarom: "De termijn loopt tot 2250, maar dagelijks heb je de strook niet meer nodig.",
    why: "Voor een loonstrook uit maart 2243 loopt de fiscale bewaarplicht van 7 jaar nog tot 2250. In het dagelijks werk heb je deze oude strook niet meer nodig. Daarom gaat hij de kluis in." },
  { soort: "Cv", jaar: "aug 2247", datum: "procedure afgerond in augustus 2247", persoon: "Rosa Lindeman, afgewezen kandidaat", extra: "Geen toestemming om het langer te bewaren", answer: "wissen", rule: R_SOL, regel: K_SOL, waarom: "Geen toestemming, en de procedure is sinds augustus klaar.",
    why: "Zonder toestemming verwijder je een cv uiterlijk 4 weken na de procedure. Die was in augustus klaar, dus de termijn is ruim voorbij." },
  { soort: "Camerabeeld", jaar: "15 okt 2247", datum: "opgenomen op 15 oktober 2247", persoon: "Gang C, crew en passagiers in beeld", extra: "Geen incident gemeld", answer: "wissen", rule: R_CAM, regel: K_CAM, waarom: "Het beeld is 6 weken oud en er staat geen incident op.",
    why: "Het beeld is 6 weken oud en er staat geen incident op. De 4 weken zijn om, dus je wist het." },
  { soort: "Kopie paspoort", jaar: "uit dienst 2245", datum: "uit dienst sinds juni 2245", persoon: "Femke de Wit, oud-crewlid", extra: "Ooit gemaakt voor de loonheffing", answer: "archiveren",
    rule: "Een kopie van het identiteitsbewijs van een medewerker bewaar je voor de loonheffing tot 5 jaar na het einde van het dienstverband.", regel: "Kopie identiteitsbewijs: 5 jaar na einde dienstverband.", waarom: "Bewaren tot juni 2250, maar niemand heeft hem dagelijks nodig.",
    why: "Femke ging in juni 2245 uit dienst. De kopie moet blijven tot juni 2250. In het dagelijks werk heeft niemand hem nodig, dus hij gaat de kluis in." },
  { soort: "Camerabeeld", jaar: "12 okt 2247", datum: "opgenomen op 12 oktober 2247", persoon: "Luchtsluis 2, twee crewleden in beeld", extra: "Incident: vermiste lading, het onderzoek loopt nog", answer: "bewaren", rule: R_CAM, regel: K_CAM, waarom: "Er staat een incident op dat nog onderzocht wordt.",
    why: "Normaal wis je camerabeelden na 4 weken. Op dit beeld staat een incident dat nog onderzocht wordt. Zolang het onderzoek loopt heb je het nodig. Daarna wis je het." },
  { soort: "Verzuimdossier", jaar: "uit dienst 2244", datum: "uit dienst sinds april 2244", persoon: "Kees Vermeulen, oud-crewlid", extra: "Geen lopende zaak", answer: "wissen",
    rule: "Verzuimgegevens bewaar je niet langer dan nodig. De richtlijn is uiterlijk 2 jaar na het einde van het dienstverband.", regel: "Verzuim: niet langer dan nodig, richtlijn 2 jaar na einde dienstverband.", waarom: "Kees ging in april 2244 uit dienst. Die 2 jaar zijn voorbij.",
    why: "Kees ging in april 2244 uit dienst. In april 2246 was de richtlijn van 2 jaar al voorbij. Het zijn gegevens over gezondheid, dus je wist ze." },
  { soort: "Loonstrook", jaar: "dec 2238", datum: "december 2238", persoon: "Ilse Boer, oud-crewlid", extra: "Uit dienst sinds 2239", answer: "wissen", rule: R_LOON, regel: K_LOON, waarom: "Een strook uit 2238 valt buiten de 7 jaar.",
    why: "De fiscale bewaarplicht is 7 jaar. Voor een loonstrook uit 2238 is die voorbij. Er is geen doel meer en geen wet die bewaren eist, dus je wist hem." },
  { soort: "Cv", jaar: "jun 2247", datum: "procedure afgerond in juni 2247", persoon: "Yara Haddou, afgewezen kandidaat", extra: "Gaf toestemming voor de talentenpool", answer: "bewaren", rule: R_SOL, regel: K_SOL, waarom: "Yara gaf toestemming, dus je gebruikt het cv nog tot juni 2248.",
    why: "Yara gaf toestemming om haar cv langer te bewaren. Dat mag maximaal 1 jaar, dus tot juni 2248. Je gebruikt het nog voor nieuwe vacatures, dus het blijft actief." },
  { soort: "Loonstaat", jaar: "jaar 2241", datum: "jaar 2241", persoon: "Alle crew van dat jaar", extra: "Jaaroverzicht van de loonadministratie", answer: "archiveren", rule: R_LOON, regel: K_LOON, waarom: "Voor 2241 loopt de termijn tot 2248, maar dagelijks heb je hem niet nodig.",
    why: "Ook loonstaten vallen onder de fiscale bewaarplicht van 7 jaar. Voor 2241 loopt die nog tot 2248. Voor het dagelijks werk is hij niet meer nodig, dus hij gaat de kluis in." }
];
CRATES.forEach((c) => { c.kort = c.soort; });
[["doel", "Nodig zolang het rooster loopt."], ["loon", "Bewaarplicht tot maart 2250."], ["cv", "Wissen uiterlijk september 2247."], ["cam", "De 4 weken liepen af op 12 november 2247."], ["id", "Bewaarplicht tot juni 2250."], ["cam", "De 4 weken liepen af op 9 november 2247, maar het onderzoek loopt nog."], ["verzuim", "De richtlijn liep af in april 2246."], ["loon", "Bewaarplicht liep af in december 2245."], ["cv", "Met toestemming tot juni 2248."], ["loon", "Bewaarplicht tot 2248."]].forEach(([t, e], i) => { CRATES[i].term = t; CRATES[i].eind = e; });
["Rooster van november 2247, vandaag is het 26 november 2247. Het doel loopt nog.", "Maart 2243 plus 7 jaar fiscaal is maart 2250. De bewaarplicht loopt tot maart 2250 en dagelijks heb je de strook niet nodig, dus archiveren.", "Augustus 2247 plus 4 weken is september 2247. Vandaag is het 26 november, dus voorbij.", "15 oktober plus 4 weken is 12 november 2247. Vandaag is het 26 november, dus voorbij.", "Juni 2245 plus 5 jaar is juni 2250. De bewaarplicht loopt tot juni 2250 en dagelijks heeft niemand de kopie nodig, dus archiveren.", "12 oktober plus 4 weken is 9 november 2247, maar het onderzoek loopt nog. Dan heb je het beeld nodig.", "April 2244 plus 2 jaar is april 2246. Vandaag is het 2247, dus voorbij.", "December 2238 plus 7 jaar is december 2245. Vandaag is het 2247, dus voorbij.", "Juni 2247 plus 1 jaar met toestemming is juni 2248. Je gebruikt het cv nog voor vacatures, dus bewaren.", "2241 plus 7 jaar fiscaal is 2248. De bewaarplicht loopt tot 2248 en dagelijks heb je de staat niet nodig, dus archiveren."].forEach((t, i) => { CRATES[i].som = t; });
const TERMS = [
  ["loon", "Loonadministratie", "7 jaar"],
  ["id", "Kopie ID", "5 jaar na uit dienst"],
  ["cv", "Cv afgewezen", "4 weken, met toestemming 1 jaar"],
  ["verzuim", "Verzuim", "2 jaar na uit dienst"],
  ["cam", "Camerabeeld", "4 weken, langer bij onderzoek"],
  ["doel", "Al het andere", "Zolang nodig voor het doel"]
];

function judge(c, choice) {
  if (choice === c.answer) return { result: "goed", points: 10, shield: 0, title: "Goed gesorteerd", lead: "" };
  const keep = (x) => x !== "wissen";
  if (keep(choice) && keep(c.answer)) {
    const lead = c.answer === "archiveren" ? "Het mag blijven, maar alleen omdat de wet het eist. Dan hoort het in de kluis." : "Je hebt het nog nodig voor het doel. In de kluis kan niemand erbij.";
    return { result: "half", points: 5, shield: 5, title: "Half goed", lead };
  }
  const lead = choice === "wissen" ? "Dit mocht nog niet weg." : "Dit had weg gemoeten. Te lang bewaren is ook een overtreding.";
  return { result: "fout", points: 0, shield: 15, title: "Niet goed", lead };
}

/* ---------- Tweens ---------- */
let moving = 0;
const easeIO = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
function tween(ms, fn, ease) {
  return new Promise((res) => {
    ms = (reduce ? Math.min(ms, 90) : ms) / FAST;
    const t0 = performance.now();
    const step = (now) => { const k = Math.min(1, (now - t0) / ms); fn(ease ? ease(k) : k); if (k < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
}
const pause = (ms) => new Promise((r) => setTimeout(r, (reduce ? Math.min(ms, 60) : ms) / FAST));
async function travel(set, pts, speed) {
  const seg = []; let L = 0;
  for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(d); L += d; }
  moving++;
  await tween(L / speed * 1000, (k) => {
    let d = k * L;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? Math.min(1, d / seg[i]) : 1; set(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f); break; }
      d -= seg[i];
    }
  }, easeIO);
  moving--;
}

/* ---------- 2D-tekening: briefing en terugval zonder WebGL ---------- */
const X2 = { bewaren: 220, archiveren: 450, wissen: 680 };
function hatch(id, a, b) { return `<pattern id="${id}" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="${a}"/><rect width="11" height="22" fill="${b}"/></pattern>`; }
function crate2D(c, x, y, id) {
  return `<g ${id ? `id="${id}"` : ""} transform="translate(${x} ${y})">
    <rect x="-62" y="-38" width="124" height="76" rx="10" fill="#c9d3e0" stroke="#5d6f8a" stroke-width="2"/>
    <rect x="-62" y="-38" width="124" height="13" rx="6" fill="#9eacc0"/>
    <rect x="-54" y="-20" width="108" height="48" rx="5" fill="#f4f7fb"/>
    <text x="0" y="0" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="${c && c.kort.length > 9 ? 15 : 18}" fill="#0c2f5f">${esc(c ? c.kort : "")}</text>
    <text x="0" y="19" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="14" fill="#13559b">${esc(c ? c.jaar : "")}</text>
    <rect x="-68" y="-10" width="6" height="22" rx="2" fill="#2f405c"/><rect x="62" y="-10" width="6" height="22" rx="2" fill="#2f405c"/>
  </g>`;
}
function scene2D(o = {}) {
  const doors = ORDER.map((k) => {
    const x = X2[k], E = EXITS[k];
    const inside = k === "bewaren"
      ? `<rect x="${x - 75}" y="112" width="150" height="168" fill="#0b2a52"/><g fill="#13559b">${[150, 200].map((y) => `<rect x="${x - 66}" y="${y}" width="132" height="5" rx="2" fill="#67caff" opacity=".6"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${x - 60 + i * 25}" y="${y - 26}" width="20" height="26" rx="3"/>`).join("")}`).join("")}</g>`
      : k === "archiveren"
        ? `<rect x="${x - 75}" y="112" width="150" height="168" fill="#2a1d06"/><rect x="${x - 70}" y="118" width="140" height="6" rx="3" fill="#ffb900" opacity=".8"/>${[0, 1, 2].map((i) => `<rect x="${x - 62 + i * 44}" y="226" width="38" height="28" rx="4" fill="#5b4a2a"/><rect x="${x - 62 + i * 44}" y="196" width="38" height="28" rx="4" fill="#4a3c22"/>`).join("")}`
        : `<rect x="${x - 75}" y="112" width="150" height="168" fill="#2a0c10"/><ellipse cx="${x}" cy="262" rx="62" ry="14" fill="#ff6467" opacity=".45"/>${[0, 1].map((i) => `<rect x="${x - 64}" y="${240 + i * 14}" width="128" height="12" rx="6" fill="#4a1a1f" stroke="#ff8a8c" stroke-width="1"/>`).join("")}`;
    const leaf = k === "bewaren"
      ? `<g data-leaf="${k}"><rect x="${x - 75}" y="110" width="150" height="172" fill="#6f86a8"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${x - 70}" y="${124 + i * 26}" width="140" height="5" rx="2" fill="#8fa3c2"/>`).join("")}<rect x="${x - 20}" y="250" width="40" height="8" rx="4" fill="#2f405c"/></g>`
      : k === "archiveren"
        ? `<g data-leaf="${k}" style="transform-origin:${x - 75}px 196px"><rect x="${x - 75}" y="110" width="150" height="172" rx="6" fill="#8b98ab" stroke="#5d6f8a" stroke-width="2"/><circle cx="${x}" cy="196" r="38" fill="none" stroke="#2f405c" stroke-width="6"/><g data-wheel style="transform-origin:${x}px 196px"><path d="M${x - 38} 196h76M${x} 158v76M${x - 27} 169l54 54M${x + 27} 169l-54 54" stroke="#2f405c" stroke-width="5"/></g><circle cx="${x}" cy="196" r="9" fill="#ffb900"/>${[0, 1, 2, 3].map((i) => `<circle cx="${x - 62 + (i % 2) * 124}" cy="${124 + (i > 1 ? 144 : 0)}" r="5" fill="#5d6f8a"/>`).join("")}</g>`
        : `<g data-leaf="${k}"><g data-half="l"><rect x="${x - 75}" y="110" width="75" height="172" fill="url(#hz)"/><rect x="${x - 4}" y="110" width="4" height="172" fill="#1d293d"/></g><g data-half="r"><rect x="${x}" y="110" width="75" height="172" fill="url(#hz)"/><rect x="${x}" y="110" width="4" height="172" fill="#1d293d"/></g></g>`;
    return `<g data-door="${k}" class="d2-door" tabindex="-1">
      <defs><clipPath id="cl-${k}"><rect x="${x - 75}" y="110" width="150" height="172"/></clipPath></defs>
      <g clip-path="url(#cl-${k})">${inside}<g data-in="${k}"></g>${leaf}</g>
      <rect x="${x - 90}" y="96" width="180" height="190" rx="14" fill="none" stroke="#aab6c8" stroke-width="10"/>
      <rect x="${x - 60}" y="92" width="120" height="5" rx="2" fill="${E.col}"/>
      <rect x="${x - 26}" y="76" width="52" height="12" rx="4" fill="#1d293d"/><rect data-lamp="${k}" x="${x - 21}" y="78.5" width="42" height="7" rx="3" fill="#33415a"/>
      <g transform="translate(${x} 40)"><rect x="-100" y="-22" width="200" height="44" rx="6" fill="#1b2a45"/><rect x="-100" y="20" width="200" height="3" fill="${E.col}" opacity=".8"/>
      <text y="7" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="21" fill="#cfdcec">${E.sub}</text></g>
      <rect x="${x - 66}" y="286" width="132" height="76" fill="#1a273d"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${x - 62}" y="${292 + i * 14}" width="124" height="7" rx="3.5" fill="#55657e"/>`).join("")}
      <rect x="${x - 72}" y="286" width="7" height="76" fill="#8b9bb3"/><rect x="${x + 65}" y="286" width="7" height="76" fill="#8b9bb3"/>
      <rect x="${x - 66}" y="286" width="132" height="10" fill="url(#st-${k})" opacity=".85"/>
    </g>`;
  }).join("");
  return `<svg viewBox="${o.vb || "0 0 900 460"}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lopende band in het cryo-archief met drie luiken: Bewaren, Archiveren en Wissen">
    <defs><linearGradient id="wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26385a"/><stop offset="1" stop-color="#1a2944"/></linearGradient>
    <linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2b45"/><stop offset="1" stop-color="#0d1730"/></linearGradient>
    ${hatch("hz", "#ffb900", "#1d293d")}${ORDER.map((k) => hatch("st-" + k, EXITS[k].col, "#1d293d")).join("")}</defs>
    <rect x="-300" y="-300" width="1500" height="1100" fill="url(#fl)"/>
    <rect x="-300" y="-300" width="1500" height="586" fill="#26385a"/><rect x="-300" y="0" width="1500" height="286" fill="url(#wl)"/>
    <rect x="-300" y="-58" width="1500" height="10" fill="#7d8ea8"/><rect x="-300" y="-40" width="1500" height="10" fill="#a1b2c9"/><rect x="-300" y="-18" width="1500" height="4" fill="#67caff" opacity=".7"/>
    ${[-1, 0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${i * 180 - 30} -300v586" stroke="#0f1a2e" stroke-width="3"/><path d="M${i * 180 - 27} -300v586" stroke="#3b4e6d" stroke-width="1"/>`).join("")}
    <path d="M-300 150h1500" stroke="#0f1a2e" stroke-width="3"/>
    <rect x="-300" y="278" width="1500" height="10" fill="#0f1a2e"/>
    ${doors}
    <g><rect x="-300" y="360" width="1090" height="56" fill="#1a273d"/>${Array.from({ length: 47 }, (_, i) => `<rect x="${i * 23 - 290}" y="364" width="12" height="48" rx="6" fill="#55657e"/>`).join("")}
    <rect x="-300" y="356" width="1090" height="8" fill="#8b9bb3"/><rect x="-300" y="412" width="1090" height="8" fill="#8b9bb3"/><rect x="790" y="356" width="10" height="64" rx="3" fill="#8b9bb3"/>
    ${[40, 330, 560, 760].map((x) => `<rect x="${x}" y="420" width="10" height="34" fill="#2f405c"/>`).join("")}</g>
    <g data-crates>${o.crates || ""}</g>
    <g><rect x="38" y="318" width="16" height="116" rx="4" fill="#8b98ab"/><rect x="106" y="318" width="16" height="116" rx="4" fill="#8b98ab"/><rect x="32" y="306" width="96" height="20" rx="6" fill="#aab6c8"/><rect x="44" y="324" width="72" height="4" rx="2" fill="#67caff" data-beam opacity=".85"/></g>
  </svg>`;
}

function view2D(host) {
  host.insertAdjacentHTML("beforeend", scene2D());
  const svg = host.lastElementChild, layer = $("[data-crates]", svg);
  let cur = null;
  const leafs = {};
  ORDER.forEach((k) => { leafs[k] = $(`[data-leaf="${k}"]`, svg); });
  function setDoor(k, t) {
    const L = leafs[k];
    if (k === "bewaren") L.setAttribute("transform", `translate(0 ${-176 * t})`);
    else if (k === "archiveren") L.style.transform = `scaleX(${1 - .88 * t})`;
    else { $('[data-half="l"]', L).setAttribute("transform", `translate(${-78 * t} 0)`); $('[data-half="r"]', L).setAttribute("transform", `translate(${78 * t} 0)`); }
  }
  ORDER.forEach((k) => $(`[data-door="${k}"]`, svg).addEventListener("click", () => api.onDoor && api.onDoor(k)));
  const api = {
    is3D: false,
    async spawn(c, onScan) {
      layer.innerHTML = crate2D(c, -80, 384, "cr"); cur = $("#cr", layer);
      const set = (x, y) => cur.setAttribute("transform", `translate(${x} ${y})`);
      await travel(set, [[-80, 384], [80, 384]], 260);
      const beam = $("[data-beam]", svg); beam.setAttribute("fill", "#a1deff");
      onScan && onScan(); await pause(350); beam.setAttribute("fill", "#67caff");
      await travel(set, [[80, 384], [300, 384]], 300);
    },
    creep(k) { if (cur) cur.setAttribute("transform", `translate(${300 + 150 * k} 384)`); },
    verdict() {},
    preview(k) { ORDER.forEach((e) => { const l = $(`[data-lamp="${e}"]`, svg); if (!l.dataset.state) l.setAttribute("fill", e === k ? "#eaf8ff" : "#33415a"); }); },
    async send(k, right, onFault) {
      const set = (px, py) => cur.setAttribute("transform", `translate(${px} ${py})`);
      let x = X2[k];
      if (k !== right) {
        const p0 = cur.transform.baseVal.consolidate().matrix.e;
        await travel(set, [[p0, 384], [x, 384], [x, 338]], 320);
        const l = $(`[data-lamp="${k}"]`, svg); l.dataset.state = "1"; l.setAttribute("fill", "#ff6467"); l.classList.add("blink");
        Mini.sound.play("alarm"); onFault && onFault(); await pause(900);
        l.classList.remove("blink");
        await travel(set, [[x, 338], [x, 384], [X2[right], 384]], 320);
        x = X2[right]; await travel(set, [[x, 384], [x, 330]], 320);
      } else { const p0 = cur.transform.baseVal.consolidate().matrix.e; await travel(set, [[p0, 384], [x, 384], [x, 330]], 320); }
      await tween(380, (t) => setDoor(right, t), easeIO);
      $(`[data-in="${right}"]`, svg).appendChild(cur);
      await travel(set, [[x, 330], [x, 226]], 260);
      if (right === "wissen") await tween(420, (t) => cur.setAttribute("transform", `translate(${x} ${226 + t * 40}) scale(${1 - t * .7} ${1 - t * .9})`));
      await tween(360, (t) => setDoor(right, 1 - t), easeIO);
      if (right === "archiveren") { const w = $("[data-wheel]", svg); await tween(420, (t) => { w.style.transform = `rotate(${t * 180}deg)`; }); }
      cur.remove(); cur = null;
      api.lamps(k, right);
    },
    lamps(k, right) {
      ORDER.forEach((e) => { const l = $(`[data-lamp="${e}"]`, svg); l.dataset.state = ""; l.setAttribute("fill", "#33415a"); l.classList.remove("blink"); });
      if (!k) return;
      const lk = $(`[data-lamp="${k}"]`, svg); lk.dataset.state = "1"; lk.setAttribute("fill", k === right ? "#05df72" : "#ff6467");
      if (k !== right) { const lr = $(`[data-lamp="${right}"]`, svg); lr.dataset.state = "1"; lr.setAttribute("fill", "#05df72"); }
    },
    screen() {}
  };
  return api;
}

/* ---------- 3D: de sorteerhal van het cryo-archief ---------- */
function view3D(host) {
  const { THREE, stage, metal, plain, glow, rbox, mesh, textTex } = S3D;
  /* De camera staat strak op de band en de drie luiken: breed genoeg voor de borden, zonder lege vloer eronder. */
  const target = new THREE.Vector3(-0.1, 1.7, -2.15), dir = new THREE.Vector3(0, 6.0, 11).normalize();
  const fit = (S) => { const a = S.camera.aspect, half = Math.tan(THREE.MathUtils.degToRad(S.camera.fov / 2)); const d = Math.max(9, Math.max(5.35 / (half * a), 3.9 / half)); S.camera.position.copy(target).addScaledVector(dir, d); S.camera.lookAt(target); };
  const S = stage(host, { fov: 34, exposure: 1.08, maxDpr: 1.5, onResize: fit });
  const scene = S.scene; scene.background = new THREE.Color(0x050d22);
  scene.fog = new THREE.Fog(0x050d22, 22, 38);
  S.key.position.set(-5, 11, 9); S.key.intensity = 2.0; S.hemi.intensity = 0.7;

  const darkMetal = metal({ base: "#2b3a55", cols: 1, rows: 1, rivets: false, roughness: .5 });
  const railMat = metal({ base: "#9aa8bd", cols: 1, rows: 1, rivets: false, metalness: .75, roughness: .35 });
  const legMat = plain(0x2f405c, { metalness: .6, roughness: .45 });

  /* Vloer met panelen */
  const floor = mesh(new THREE.PlaneGeometry(44, 30), metal({ base: "#253550", cols: 2, rows: 2, repeat: [11, 7.5], metalness: .5, roughness: .6 }), scene, 0, 0, 0); floor.rotation.x = -Math.PI / 2;

  /* Achterwand met drie openingen */
  const rr = (p, x, y, w, hh, r) => { p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r); p.lineTo(x + w, y + hh - r); p.quadraticCurveTo(x + w, y + hh, x + w - r, y + hh); p.lineTo(x + r, y + hh); p.quadraticCurveTo(x, y + hh, x, y + hh - r); p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y); };
  const wallShape = new THREE.Shape(); wallShape.moveTo(-18, -0.6); wallShape.lineTo(18, -0.6); wallShape.lineTo(18, 10); wallShape.lineTo(-18, 10); wallShape.lineTo(-18, -0.6);
  ORDER.forEach((k) => { const p = new THREE.Path(); rr(p, EXITS[k].x - 0.95, -0.3, 1.9, 2.45, 0.14); wallShape.holes.push(p); });
  const wall = mesh(new THREE.ExtrudeGeometry(wallShape, { depth: 0.3, bevelEnabled: false }), metal({ base: "#3a4d6c", cols: 2, rows: 2, repeat: [0.42, 0.42], roughness: .55 }), scene, 0, 0, -4.3);
  // ribben, leidingen en lichtlijnen op de wand
  [-5.4, -1.75, 1.75, 5.4].forEach((x) => { mesh(rbox(0.36, 5.6, 0.26, 0.05), darkMetal, scene, x, 2.8, -3.9); mesh(rbox(0.5, 0.3, 0.34, 0.05), railMat, scene, x, 0.15, -3.86); });
  [4.35, 4.62].forEach((y, i) => { const p = mesh(new THREE.CylinderGeometry(0.09, 0.09, 36, 14), metal({ base: i ? "#a1b2c9" : "#7d8ea8", cols: 1, rows: 1, rivets: false, metalness: .8, roughness: .3 }), scene, 0, y, -3.88); p.rotation.z = Math.PI / 2; });
  mesh(rbox(36, 0.08, 0.06, 0.02), glow(0x67caff, 0.55), scene, 0, 4.1, -3.95);

  /* Luiken: kozijn, bord, lampje, binnenkant en deur */
  const doors = {};
  const hz = (a, b) => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); g.fillStyle = b; g.fillRect(0, 0, 128, 128); g.fillStyle = a; for (let i = -128; i < 256; i += 44) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 22, 0); g.lineTo(i + 22 + 128, 128); g.lineTo(i + 128, 128); g.fill(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
  ORDER.forEach((k) => {
    const E = EXITS[k], x = E.x, D = { k };
    // kozijn
    const fs = new THREE.Shape(); rr(fs, -1.25, -0.4, 2.5, 2.95, 0.26); const fh = new THREE.Path(); rr(fh, -0.95, -0.3, 1.9, 2.45, 0.14); fs.holes.push(fh);
    const frame = mesh(new THREE.ExtrudeGeometry(fs, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3, curveSegments: 8 }), railMat, scene, x, 0, -4.02);
    mesh(rbox(1.5, 0.07, 0.06, 0.02), glow(E.hex, 0.9), scene, x, 2.47, -3.86);
    // lampje
    mesh(rbox(0.62, 0.26, 0.2, 0.06), legMat, scene, x, 2.78, -3.92);
    D.lens = mesh(rbox(0.48, 0.13, 0.06, 0.03), new THREE.MeshBasicMaterial({ color: 0x2a3650 }), scene, x, 2.78, -3.8);
    // bord
    // bord: vlak en rustig, alleen de plek. Wat je kiest staat op de knoppen eronder.
    const sign = mesh(new THREE.PlaneGeometry(2.7, 0.58), new THREE.MeshBasicMaterial({ map: textTex([{ t: E.sub, size: 118, weight: 700, color: "#bccbdd" }], { w: 1024, h: 220, bg: "#1b2a45", align: "center", pad: 40 }), toneMapped: false }), scene, x, 3.45, -3.94);
    D.sign = sign;
    mesh(rbox(2.7, 0.05, 0.04, 0.015), plain(E.hex, { metalness: .2, roughness: .6 }), scene, x, 3.13, -3.93);
    // binnenkant: een nis met eigen inhoud
    const nis = mesh(new THREE.BoxGeometry(1.9, 2.15, 2.1), new THREE.MeshStandardMaterial({ color: k === "bewaren" ? 0x15305a : k === "archiveren" ? 0x2e2412 : 0x2c1016, roughness: .7, metalness: .3, side: THREE.BackSide }), scene, x, 1.075, -5.35);
    nis.renderOrder = -1;
    mesh(rbox(1.6, 0.05, 0.05, 0.02), glow(E.hex, k === "wissen" ? 1.2 : 0.9), scene, x, 2.08, -5.2);
    D.glow = new THREE.MeshBasicMaterial({ color: new THREE.Color(E.hex).multiplyScalar(0.25) }); mesh(new THREE.PlaneGeometry(1.8, 2.0), D.glow, scene, x, 1.05, -6.38);
    if (k === "bewaren") {
      [0.95, 1.55].forEach((y) => { mesh(rbox(1.7, 0.05, 0.5, 0.02), railMat, scene, x, y, -6.1); for (let i = 0; i < 5; i++) mesh(rbox(0.24, 0.34, 0.38, 0.04), plain([0x67caff, 0x15aaff, 0xa1deff][(i + (y > 1 ? 1 : 0)) % 3], { metalness: .2, roughness: .4 }), scene, x - 0.64 + i * 0.32, y + 0.2, -6.05); });
    } else if (k === "archiveren") {
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) mesh(rbox(0.5, 0.36, 0.5, 0.05), plain(0x6a5530, { metalness: .4, roughness: .5 }), scene, x - 0.58 + i * 0.58, 0.2 + j * 0.4, -6.05);
    } else {
      D.shred = [];
      [-0.22, 0.22].forEach((dz) => { const r = mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.7, 16), new THREE.MeshStandardMaterial({ map: hz("#3a4b66", "#9aa8bd"), metalness: .8, roughness: .35 }), scene, x, 0.18, -5.35 + dz); r.rotation.z = Math.PI / 2; D.shred.push(r); });
      mesh(new THREE.PlaneGeometry(1.8, 1.0), glow(0xff6467, 0.45), scene, x, 0.01, -5.35).rotation.x = -Math.PI / 2;
    }
    // vloermarkering voor het luik
    const mark = mesh(new THREE.PlaneGeometry(1.5, 0.34), new THREE.MeshStandardMaterial({ map: (() => { const t = hz(E.col, "#1d293d"); t.repeat.set(4, 1); return t; })(), roughness: .7 }), scene, x, 0.012, -3.62); mark.rotation.x = -Math.PI / 2;
    // de deur zelf
    if (k === "bewaren") {
      const g = new THREE.Group(); g.position.set(x, 1.075, -4.42); scene.add(g);
      mesh(rbox(1.92, 2.18, 0.1, 0.04), metal({ base: "#6f86a8", cols: 1, rows: 3, rivets: false }), g);
      for (let i = 0; i < 6; i++) mesh(rbox(1.7, 0.07, 0.05, 0.02), railMat, g, 0, -0.85 + i * 0.34, 0.07);
      D.open = (t) => { g.position.y = 1.075 + t * 2.3; };
    } else if (k === "archiveren") {
      const hinge = new THREE.Group(); hinge.position.set(x - 0.95, 0, -3.88); scene.add(hinge);
      const slab = mesh(rbox(1.9, 2.3, 0.26, 0.1), metal({ base: "#8d9bb0", cols: 1, rows: 1, rivets: false, metalness: .8, roughness: .3 }), hinge, 0.95, 1.1, 0.05);
      const wheel = new THREE.Group(); wheel.position.set(0.95, 1.12, 0.22); hinge.add(wheel);
      mesh(new THREE.TorusGeometry(0.44, 0.05, 10, 36), legMat, wheel);
      for (let i = 0; i < 3; i++) { const s = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.88, 8), legMat, wheel); s.rotation.z = i * Math.PI / 3; }
      mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 18), glow(0xffb900, 0.8), wheel).rotation.x = Math.PI / 2;
      [[0.16, 0.2], [1.74, 0.2], [0.16, 2.0], [1.74, 2.0]].forEach(([bx, by]) => { mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), railMat, hinge, bx, by, 0.2).rotation.x = Math.PI / 2; });
      mesh(rbox(0.12, 2.0, 0.16, 0.04), legMat, hinge, 0.02, 1.1, 0.04);
      D.open = (t) => { hinge.rotation.y = -1.85 * t; };
      D.wheel = wheel;
    } else {
      const mat = new THREE.MeshStandardMaterial({ map: (() => { const t = hz("#ffb900", "#1d293d"); t.repeat.set(1.2, 2.6); return t; })(), metalness: .4, roughness: .5 });
      const L = mesh(rbox(0.96, 2.18, 0.1, 0.03), mat, scene, x - 0.48, 1.075, -4.42), R = mesh(rbox(0.96, 2.18, 0.1, 0.03), mat, scene, x + 0.48, 1.075, -4.42);
      D.open = (t) => { L.position.x = x - 0.48 - t * 1.0; R.position.x = x + 0.48 + t * 1.0; };
    }
    D.open(0);
    // klikdoel
    const hit = mesh(new THREE.BoxGeometry(2.2, 3.6, 0.6), new THREE.MeshBasicMaterial({ visible: false }), scene, x, 1.8, -3.7);
    S.clickable(hit, () => api.onDoor && api.onDoor(k), (on) => { hover = on ? k : null; });
    doors[k] = D;
  });
  let hover = null;

  /* Rollenbanen */
  const rollers = [];
  const rollGeo = new THREE.CylinderGeometry(0.068, 0.068, 1.6, 14);
  const rc = document.createElement("canvas"); rc.width = 64; rc.height = 16; { const g = rc.getContext("2d"); g.fillStyle = "#8c9bb2"; g.fillRect(0, 0, 64, 16); g.fillStyle = "#4b5b75"; g.fillRect(0, 0, 10, 16); g.fillRect(32, 0, 10, 16); }
  const rtex = new THREE.CanvasTexture(rc); rtex.colorSpace = THREE.SRGBColorSpace;
  const rollMat = new THREE.MeshStandardMaterial({ map: rtex, metalness: .8, roughness: .3 });
  function belt(axis, a0, a1, c, gaps = []) {
    const step = 0.3, n = Math.floor((a1 - a0) / step);
    for (let i = 0; i <= n; i++) { const a = a0 + i * step; rollers.push(axis === "x" ? { p: [a, 0.58, c], axis } : { p: [c, 0.58, a], axis }); }
    const len = a1 - a0, mid = (a0 + a1) / 2;
    // rails, met gaten waar een zijbaan aansluit
    [-0.86, 0.86].forEach((off, si) => {
      const segs = [[a0 - 0.1, a1 + 0.1]];
      if (si === 0) gaps.forEach(([g0, g1]) => { const s = segs.pop(); segs.push([s[0], g0], [g1, s[1]]); });
      segs.forEach(([s0, s1]) => { if (s1 - s0 < 0.05) return; const L = s1 - s0, m = (s0 + s1) / 2; if (axis === "x") mesh(rbox(L, 0.14, 0.08, 0.03), railMat, scene, m, 0.66, c + off); else mesh(rbox(0.08, 0.14, L, 0.03), railMat, scene, c + off, 0.66, m); });
      if (axis === "x") mesh(rbox(len, 0.22, 0.04, 0.015), darkMetal, scene, mid, 0.46, c + off * 1.03); else mesh(rbox(0.04, 0.22, len, 0.015), darkMetal, scene, c + off * 1.03, 0.46, mid);
    });
    for (let a = a0 + 0.3; a < a1; a += 1.7) [-0.8, 0.8].forEach((off) => { const px = axis === "x" ? a : c + off, pz = axis === "x" ? c + off : a; mesh(rbox(0.09, 0.5, 0.09, 0.02), legMat, scene, px, 0.25, pz); mesh(rbox(0.22, 0.04, 0.22, 0.015), legMat, scene, px, 0.02, pz); });
  }
  const BZ = 1.0; // hoofdband langs x
  belt("x", -13, 4.45, BZ, ORDER.map((k) => [EXITS[k].x - 0.9, EXITS[k].x + 0.9]));
  mesh(rbox(0.08, 0.14, 1.8, 0.03), railMat, scene, 4.6, 0.66, BZ);
  ORDER.forEach((k) => { belt("z", -3.95, 0.05, EXITS[k].x); if (k !== "wissen") belt("z", -6.2, -4.55, EXITS[k].x); else belt("z", -4.9, -4.55, EXITS[k].x); });
  const inst = new THREE.InstancedMesh(rollGeo, rollMat, rollers.length); scene.add(inst);
  const qa = { x: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2), z: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2) };
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), Qs = new THREE.Quaternion(), V = new THREE.Vector3(), ONE = new THREE.Vector3(1, 1, 1), Y = new THREE.Vector3(0, 1, 0);
  let spin = 0;
  function placeRollers() { rollers.forEach((r, i) => { Qs.setFromAxisAngle(Y, r.axis === "x" ? -spin : spin); Q.copy(qa[r.axis]).multiply(Qs); V.set(...r.p); M.compose(V, Q, ONE); inst.setMatrixAt(i, M); }); inst.instanceMatrix.needsUpdate = true; }
  placeRollers();

  /* Scannerboog boven de hoofdband */
  const SX = -4.75;
  [BZ - 1.12, BZ + 1.12].forEach((z) => { mesh(rbox(0.34, 2.3, 0.34, 0.08), metal({ base: "#8d9bb0", cols: 1, rows: 2, rivets: false }), scene, SX, 1.15, z); mesh(rbox(0.5, 0.08, 0.5, 0.03), legMat, scene, SX, 0.04, z); });
  mesh(rbox(0.5, 0.36, 2.64, 0.1), metal({ base: "#aab6c8", cols: 2, rows: 1, rivets: false }), scene, SX, 2.36, BZ);
  mesh(rbox(0.1, 0.05, 1.6, 0.02), glow(0x67caff, 1.0), scene, SX, 2.16, BZ);
  const screenCanvas = document.createElement("canvas"); screenCanvas.width = 512; screenCanvas.height = 160;
  const screenTex = new THREE.CanvasTexture(screenCanvas); screenTex.colorSpace = THREE.SRGBColorSpace;
  const scr = mesh(new THREE.PlaneGeometry(1.5, 0.47), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }), scene, SX + 0.05, 2.36, BZ + 1.33);
  mesh(rbox(1.64, 0.6, 0.06, 0.04), legMat, scene, SX + 0.05, 2.36, BZ + 1.3);
  function screenText(t, col) { const g = screenCanvas.getContext("2d"); g.fillStyle = "#06224c"; g.fillRect(0, 0, 512, 160); g.fillStyle = col || "#a1deff"; g.font = "700 60px Inter, system-ui, sans-serif"; g.textAlign = "right"; g.textBaseline = "middle"; g.fillText(t, 488, 82); screenTex.needsUpdate = true; }
  screenText("Klaar");
  const sheet = mesh(new THREE.PlaneGeometry(1.9, 1.6), new THREE.MeshBasicMaterial({ color: 0x67caff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }), scene, SX, 1.4, BZ); sheet.rotation.y = Math.PI / 2;

  /* Beslispunt: twee paaltjes met een lamp en een vloerlijn, hier wacht de krat op jouw keuze */
  const gateMat = new THREE.MeshBasicMaterial({ color: 0x2a3650 });
  [BZ - 1.1, BZ + 1.1].forEach((z) => { mesh(rbox(0.16, 1.3, 0.16, 0.05), metal({ base: "#aab6c8", cols: 1, rows: 1, rivets: false }), scene, 0.95, 0.65, z); mesh(rbox(0.22, 0.16, 0.22, 0.06), gateMat, scene, 0.95, 1.36, z); });
  const gl = mesh(new THREE.PlaneGeometry(0.1, 2.0), new THREE.MeshBasicMaterial({ color: 0xffb900 }), scene, 0.95, 0.013, BZ); gl.rotation.x = -Math.PI / 2;
  function gateLamp(on) { gateMat.color.setHex(on ? 0xffb900 : 0x2a3650); }

  /* Zijwand links met de aanvoeropening */
  const side = new THREE.Shape(); side.moveTo(-6, -0.6); side.lineTo(4.2, -0.6); side.lineTo(4.2, 10); side.lineTo(-6, 10); side.lineTo(-6, -0.6);
  const sh = new THREE.Path(); rr(sh, BZ - 0.85, -0.3, 1.7, 1.75, 0.18); side.holes.push(sh);
  const sideWall = mesh(new THREE.ExtrudeGeometry(side, { depth: 0.3, bevelEnabled: false }), metal({ base: "#34466a", cols: 2, rows: 2, repeat: [0.42, 0.42] }), scene, -10.2, 0, 0); sideWall.rotation.y = Math.PI / 2;
  mesh(new THREE.PlaneGeometry(1.7, 1.5), new THREE.MeshBasicMaterial({ color: 0x0a1428 }), scene, -10.5, 0.75, BZ).rotation.y = Math.PI / 2;

  /* De krat */
  function makeCrate(c) {
    const g = new THREE.Group();
    const body = metal({ base: "#c3ceDD", cols: 2, rows: 1, rivets: false, metalness: .45, roughness: .45 });
    mesh(rbox(0.95, 0.6, 0.74, 0.08), body, g);
    mesh(rbox(0.99, 0.12, 0.78, 0.04), legMat, g, 0, -0.18, 0);
    [-1, 1].forEach((s) => { mesh(rbox(0.05, 0.12, 0.38, 0.02), legMat, g, s * 0.5, 0.08, 0); });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => mesh(rbox(0.16, 0.62, 0.16, 0.05), legMat, g, sx * 0.43, 0, sz * 0.33));
    // geen tekst op de krat zelf: het enige label is het leesbare HTML-bordje boven de krat
    const top = mesh(new THREE.PlaneGeometry(0.8, 0.5), new THREE.MeshBasicMaterial({ color: 0xdfe7f1, toneMapped: false }), g, 0, 0.305, 0);
    top.rotation.x = -Math.PI / 2;
    mesh(new THREE.PlaneGeometry(0.62, 0.24), new THREE.MeshBasicMaterial({ color: 0xdfe7f1, toneMapped: false }), g, 0, 0.03, 0.375);
    g.scale.setScalar(1.7);
    return g;
  }
  let crate = null;
  const CY = 1.18, CREEP0 = -2.4;
  const SLOTS = [-6.6, -8.3], queue = new Map();
  function setCrate(x, z) { crate.position.set(x, crate.position.y, z); }

  /* Een leesbaar label boven de krat, in HTML */
  const tag = document.createElement("div"); tag.className = "or-tag"; tag.hidden = true; host.appendChild(tag);
  const TAGOFF = new THREE.Vector3(0, 0.52, 0.3);

  /* Lampjes en de lus */
  const lamp = {}; ORDER.forEach((k) => { lamp[k] = { col: null, blink: false }; });
  const OFF = new THREE.Color(0x2a3650), PRE = new THREE.Color(0xeaf8ff), GRN = new THREE.Color(0x05df72), RED = new THREE.Color(0xff6467);
  let preview = null, scanning = 0;
  S.onFrame((dt, t) => {
    if (moving > 0) { spin += dt * 9; placeRollers(); }
    ORDER.forEach((k) => {
      const L = lamp[k], m = doors[k].lens.material;
      if (L.col) { m.color.copy(L.col); if (L.blink && !reduce) m.color.multiplyScalar(0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 9))); }
      else m.color.copy(k === preview || k === hover ? PRE : OFF);
    });
    if (crate && crate.position.z > -3.6) { const p = S.toScreen(crate, TAGOFF); tag.hidden = false; tag.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -100%)`; } else tag.hidden = true;
    sheet.material.opacity = scanning ? 0.18 + 0.12 * Math.sin(t * 20) : 0;
    if (doors.wissen.shredOn) doors.wissen.shred.forEach((r, i) => { r.rotation.x += (i ? -1 : 1) * dt * 8; });
  });

  const api = {
    is3D: true,
    async spawn(c, onScan, up = []) {
      if (crate) scene.remove(crate);
      crate = queue.get(c); queue.delete(c);
      if (!crate) { crate = makeCrate(c); crate.position.set(-12, CY, BZ); scene.add(crate); }
      tag.classList.remove("ok", "bad"); tag.innerHTML = `<b>${esc(c.kort)}</b><span>${esc(c.jaar)}</span>`;
      // de wachtrij schuift op
      up.forEach((u, j) => {
        let m = queue.get(u);
        if (!m) { m = makeCrate(u); m.position.set(-12.5 - j * 1.8, CY, BZ); scene.add(m); queue.set(u, m); }
        const x0 = m.position.x; travel((x, z) => m.position.set(x, CY, z), [[x0, BZ], [SLOTS[j], BZ]], 3.6);
      });
      await travel(setCrate, [[crate.position.x, BZ], [SX, BZ]], 3.6);
      scanning = 1; screenText("Scan");
      onScan && onScan(); await pause(420);
      scanning = 0; screenText("OK", "#05df72");
      await travel(setCrate, [[SX, BZ], [CREEP0, BZ]], 4.0);
      gateLamp(true);
    },
    creep(k) { if (crate) setCrate(CREEP0 + (0 - CREEP0) * k, BZ); },
    verdict(ok, text) { tag.classList.toggle("ok", ok === true); tag.classList.toggle("bad", ok === false); if (text) tag.innerHTML = text; },
    preview(k) { preview = k; },
    async send(k, right, onFault) {
      gateLamp(false);
      let x = EXITS[k].x;
      if (k !== right) {
        await travel(setCrate, [[crate.position.x, BZ], [x, BZ], [x, -2.2]], 4.0);
        lamp[k].col = RED; lamp[k].blink = true;
        Mini.sound.play("alarm"); onFault && onFault();
        await pause(950);
        lamp[k].blink = false;
        await travel(setCrate, [[x, -2.2], [x, BZ], [EXITS[right].x, BZ]], 4.2);
        x = EXITS[right].x; await travel(setCrate, [[x, BZ], [x, -3.0]], 4.0);
      } else await travel(setCrate, [[crate.position.x, BZ], [x, BZ], [x, -3.0]], 4.0);
      const D = doors[right];
      Mini.sound.play("open");
      await tween(420, (t) => D.open(t), easeIO);
      D.glow.color.setHex(EXITS[right].hex).multiplyScalar(1.6);
      await travel(setCrate, [[x, -3.0], [x, -5.3]], 1.9);
      await pause(250);
      if (right === "wissen") { D.shredOn = true; const y0 = crate.position.y; await tween(650, (t) => { crate.position.y = y0 - t * 1.1; crate.scale.set(1.7 * (1 - t * .3), 1.7, 1.7 * (1 - t * .3)); }); D.shredOn = false; }
      Mini.sound.play("close");
      await tween(380, (t) => D.open(1 - t), easeIO);
      if (right === "archiveren") await tween(520, (t) => { D.wheel.rotation.z = t * Math.PI; }, easeIO);
      scene.remove(crate); crate = null;
      D.glow.color.setHex(EXITS[right].hex).multiplyScalar(0.25);
      api.lamps(k, right);
    },
    lamps(k, right) {
      ORDER.forEach((e) => { lamp[e].col = null; lamp[e].blink = false; });
      if (!k) return;
      lamp[k].col = k === right ? GRN : RED;
      if (k !== right) lamp[right].col = GRN;
    },
    screen: screenText,
    stop: S.stop
  };
  return api;
}

/* ---------- Het spel ---------- */
const G = game({
  id: "de-opruimronde", title: "De opruimronde", topic: "Doel en bewaartermijn", module: "Cryo-archief in de passagiersmodule",
  max: CRATES.length * 10, timer: 240, steps: ["Briefing", "Opruimronde", "Debriefing"], onStart: start, onTimeout: timeout
});

const introArt = scene2D({ vb: "30 -50 840 525", crates: crate2D(CRATES[3], 270, 384) + crate2D(CRATES[1], 440, 384) + crate2D(CRATES[0], 610, 384) });
G.intro({
  lead: `Vandaag is het ${TODAY}. Het cryo-archief zit vol. Tien kratten met gegevens rijden over de band en elk krat krijgt een eigen bestemming.`,
  who: "Noor", line: "Kijk op het label wat het is, de datum en hoe het met de persoon zit. Reken dan zelf uit of de termijn voorbij is.",
  rules: [
    ["save", "<b>Bewaren</b>: terug in het actieve archief. Je hebt het nog nodig voor het doel."],
    ["lock", "<b>Archiveren</b>: in de afgesloten kluis. Het doel is klaar, maar een wet eist dat je het nog bewaart."],
    ["trash", "<b>Wissen</b>: de versnipperaar. Geen doel meer en de wettelijke termijn is voorbij."],
    ["gem", "Fout sorteren kost schild. Vijf op rij goed levert een kristal op."]
  ],
  art: introArt, note: "Tien kratten, ongeveer 4 minuten", start: "Start de band",
  /* De bewaartermijnen staan hier één keer. Bij de eerste twee kratten hangt de lijst naast het label, daarna alleen via een aanwijzing. */
  onShow(art) {
    const wrap = document.createElement("div"); wrap.className = "or-brief-left";
    art.before(wrap); wrap.appendChild(art);
    wrap.insertAdjacentHTML("beforeend", `<section class="or-brief-terms" aria-label="Bewaartermijnen">
      <h2>${icon("clock", "sm")}Bewaartermijnen</h2>
      <dl>${TERMS.map(([, n, t]) => `<div><dt>${esc(n)}</dt><dd>${esc(t)}</dd></div>`).join("")}</dl>
      <p>Onthoud ze. Bij de eerste twee kratten hangt de lijst naast het label. Daarna reken je zelf, of je vraagt een aanwijzing.</p>
    </section>`);
  }
});

let V = null, idx = 0, phase = "idle", counts = { bewaren: 0, archiveren: 0, wissen: 0 }, gemNote = "", hintUsedHere = false;
let host;

function layout() {
  G.head("De opruimronde", `<span class="chip" data-count>Krat 1 van ${CRATES.length}</span>`);
  G.stage.innerHTML = "";
  const n = h(`<div class="or fade-in">
    <div class="or-left">
      <div class="or-view" data-view><div class="or-hud"><span class="or-date"><span>Vandaag</span> <b>${TODAY}</b></span><span class="or-queue" data-queue aria-live="polite"></span><span class="or-count" data-countdown hidden></span></div></div>
      <div class="or-exits" role="group" aria-label="Stuur de krat naar">${ORDER.map((k) => { const E = EXITS[k]; return `<button class="or-exit" type="button" data-exit="${k}" aria-keyshortcuts="${k === "bewaren" ? "ArrowLeft" : k === "archiveren" ? "ArrowUp" : "ArrowRight"}" disabled>
        <span class="ic">${icon(E.icon, "lg")}</span><span class="tx"><b>${E.naam}</b><small>${E.uitleg}</small></span><kbd aria-hidden="true">${E.key}</kbd></button>`; }).join("")}</div>
    </div>
    <aside class="or-side">
      <section class="or-label" aria-live="polite">
        <div class="or-label-head">${icon("file", "sm")}<b>Label van de krat</b><span class="grow"></span><span data-no></span></div>
        <dl data-dl></dl>
        <div class="or-terms closed" data-termbox aria-label="Bewaartermijnen"><h4>${icon("clock", "sm")}Welke termijn geldt?</h4><div class="or-terms-closed">${icon("bulb", "sm")}<p>Vanaf de derde krat reken je zelf. Weet je een termijn niet meer, vraag ARIA dan om een aanwijzing. Die toont de termijn die hier geldt.</p></div><ul data-terms>${TERMS.map(([k, n, t]) => `<li data-term="${k}"><span>${n}</span><b>${t}</b></li>`).join("")}</ul></div>
      </section>
      <div class="or-talk" data-talk></div>
    </aside>
  </div>`);
  G.stage.appendChild(n);
  host = $("[data-view]", n);
  try { V = S3D ? view3D(host) : null; } catch (e) { console.warn("3D niet beschikbaar", e); V = null; }
  if (!V) { host.classList.add("flat"); V = view2D(host); }
  V.onDoor = (k) => choose(k);
  $$("[data-exit]", n).forEach((b) => {
    b.addEventListener("click", () => choose(b.dataset.exit));
    ["mouseenter", "focus"].forEach((ev) => b.addEventListener(ev, () => phase === "choose" && V.preview(b.dataset.exit)));
    ["mouseleave", "blur"].forEach((ev) => b.addEventListener(ev, () => V.preview(null)));
  });
}

function label(c, scanned) {
  const rows = [["Soort", c.soort], ["Datum", c.datum], ["Persoon", c.persoon], ["Bijzonderheid", c.extra]];
  $("[data-dl]", G.stage).innerHTML = rows.map(([k, v], i) => `<div class="${scanned ? "in" : ""}" style="animation-delay:${i * 70}ms"><dt>${k}</dt><dd>${scanned ? esc(v) : `<i class="sk"></i>`}</dd></div>`).join("");
  $("[data-no]", G.stage).textContent = `${idx + 1} van ${CRATES.length}`;
}
/* De termijnenlijst naast het label. Bij de eerste krat is hij dicht: de speler past de regel eerst zelf toe.
   closed: dicht, open: alle termijnen zonder markering, only: alleen de termijn die geldt (na de keuze of na een aanwijzing). */
function terms(mode, c) {
  const box = $("[data-termbox]", G.stage); if (!box) return;
  box.classList.toggle("closed", mode === "closed"); box.classList.toggle("only", mode === "only");
  $$("[data-term]", box).forEach((li) => li.classList.toggle("on", mode === "only" && !!c && li.dataset.term === c.term));
}
function talk(html) { const t = $("[data-talk]", G.stage); t.innerHTML = html; }
function ariaPrompt(text) {
  talk(G.sayHTML("ARIA", text, { side: `<button class="btn sm ghost" type="button" data-hint>${icon("bulb", "sm")}Aanwijzing</button><span class="hintcost">${esc(G.hintLabel())}</span>` }));
  const hb = $("[data-hint]", G.stage); if (hb) hb.addEventListener("click", hint);
}
function hint() {
  if (phase !== "choose" || hintUsedHere) return;
  hintUsedHere = true; const cost = G.hint();
  talk(G.sayHTML("ARIA", CRATES[idx].rule + (cost ? " Dit kostte 10 procent schild." : ""), { role: "aanwijzing uit de bewaarlijst" }));
  terms("only", CRATES[idx]);
}
function setButtons(on) { $$("[data-exit]", G.stage).forEach((b) => { b.disabled = !on; b.classList.remove("picked", "right", "wrong"); $$(".or-badge", b).forEach((x) => x.remove()); }); }
function badges(k, ans) { $$("[data-exit]", G.stage).forEach((b) => { $$(".or-badge", b).forEach((x) => x.remove()); const e = b.dataset.exit; if (e === ans) b.insertAdjacentHTML("beforeend", `<span class="or-badge ok">${icon("check", "sm")}${e === k ? "Jouw keuze, goed" : "Goed"}</span>`); else if (e === k) b.insertAdjacentHTML("beforeend", `<span class="or-badge me">Jouw keuze</span>`); }); }

function start() {
  if (G.shot === "result") return;
  layout();
  document.addEventListener("keydown", onKey);
  if (!G.shot) next();
}
async function next() {
  if (idx >= CRATES.length) return end();
  const c = CRATES[idx]; phase = "scan"; hintUsedHere = false;
  V.lamps(null); setButtons(false);
  $("[data-count]", G.root).textContent = `Krat ${idx + 1} van ${CRATES.length}`;
  label(c, false); terms(idx < 2 ? "open" : "closed");
  talk(G.sayHTML("ARIA", "Er komt een krat aan. De scanner leest het label.", {}));
  queueChip();
  await V.spawn(c, () => label(c, true), CRATES.slice(idx + 1, idx + 2));
  if (G.finished) return;
  phase = "choose"; setButtons(true); startCreep();
  ariaPrompt(idx === 0 ? "Waar moet deze krat heen? Kies een luik met de knoppen of de pijltjestoetsen." : "Waar moet deze krat heen?");
}
/* Tijdens het kiezen rijdt de krat langzaam door naar de beslislijn. Met Tijdsdruk aan telt hij af. */
let creepId = 0;
function startCreep() {
  const id = ++creepId, dur = (G.calm ? 7000 : 20000) / FAST, t0 = performance.now(), cnt = $("[data-countdown]", G.stage);
  const step = (now) => {
    if (id !== creepId || phase !== "choose" || G.finished) { if (cnt) cnt.hidden = true; return; }
    const k = Math.min(1, (now - t0) / dur);
    if (!reduce) V.creep(k);
    if (!G.calm && cnt) { cnt.hidden = false; const left = Math.ceil((1 - k) * dur * FAST / 1000); cnt.innerHTML = `${icon("clock", "sm")}<span>Nog <b>${left}</b> s</span>`; cnt.classList.toggle("low", left <= 5); }
    else if (cnt) cnt.hidden = true;
    if (k >= 1 && !G.calm) { tooLate(); return; }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
async function tooLate() {
  if (phase !== "choose") return;
  phase = "moving"; V.preview(null); setButtons(false);
  const c = CRATES[idx], J = { result: "fout", points: 0, shield: 10, title: "Te laat" };
  $$("[data-exit]", G.stage).forEach((b) => b.classList.toggle("right", b.dataset.exit === c.answer)); badges(null, c.answer);
  G.record({ result: "fout", points: 0, shield: 10, q: `${c.soort}, ${c.datum}`, a: "Te laat gesorteerd", why: `Juist was ${EXITS[c.answer].naam}. ` + c.why, title: "Te laat", short: `Juist was ${EXITS[c.answer].naam}.` });
  logLine(c, c.answer, "fout"); gemNote = ""; terms("only", c);
  V.verdict(false, `<b>${icon("clock", "sm")}Te laat</b><span>Juist: ${EXITS[c.answer].naam}</span>`);
  feedback(c, null, J);
  await V.send(c.answer, c.answer, () => {});
  if (G.finished) return;
  phase = "feedback";
  const nb = $("[data-next]", G.stage); if (nb) { nb.disabled = false; nb.innerHTML = nb.dataset.label; nb.focus({ preventScroll: true }); }
}
async function choose(k) {
  if (phase !== "choose" || G.finished) return;
  phase = "moving"; V.preview(null);
  const c = CRATES[idx], J = judge(c, k);
  $$("[data-exit]", G.stage).forEach((b) => { b.disabled = true; b.classList.toggle("right", b.dataset.exit === c.answer); b.classList.toggle("wrong", b.dataset.exit === k && k !== c.answer); }); badges(k, c.answer);
  V.verdict(J.result === "goed", J.result === "goed" ? `<b>${icon("check", "sm")}Goed</b><span>${EXITS[k].naam}</span>` : `<b>${icon(J.result === "half" ? "half" : "x", "sm")}${J.result === "half" ? "Half goed" : "Fout"}</b><span>Juist: ${EXITS[c.answer].naam}</span>`);
  G.record({ result: J.result, points: J.points, shield: J.shield, q: `${c.soort}, ${c.datum}`, a: EXITS[k].naam, why: (J.result === "goed" ? "" : `Juist was ${EXITS[c.answer].naam}. `) + c.why, title: J.title, short: J.result === "goed" ? `${EXITS[k].naam} klopt.` : `Juist was ${EXITS[c.answer].naam}.` });
  logLine(c, k, J.result);
  gemNote = "";
  if (J.result === "goed" && G.combo > 0 && G.combo % 5 === 0 && G.gems < 3) { G.gem(); gemNote = "Vijf op rij goed. Je verdient een kristal."; }
  terms("only", c);
  feedback(c, k, J);
  await V.send(k, c.answer, () => {});
  if (G.finished) return;
  phase = "feedback";
  const nb = $("[data-next]", G.stage); if (nb) { nb.disabled = false; nb.innerHTML = nb.dataset.label; nb.focus({ preventScroll: true }); }
}
function feedback(c, k, J) {
  const last = idx === CRATES.length - 1;
  const mood = J.result === "goed" ? "ok" : J.result === "half" ? "half" : "bad";
  talk(`<div class="or-fb ${mood} fade-in">
    <div class="or-fb-head"><span class="dot">${icon(J.result === "goed" ? "check" : J.result === "half" ? "half" : "x")}</span><div><b>${J.title}</b><span>${!k ? `Niet op tijd gekozen. Juist was <b>${EXITS[c.answer].naam}</b>.` : J.result === "goed" ? `De krat gaat naar ${EXITS[k].naam}.` : `Jij koos ${EXITS[k].naam}, juist was <b>${EXITS[c.answer].naam}</b>.`}</span></div><span class="pts">+${J.points}${J.shield ? `<small>schild −${J.shield}%</small>` : ""}</span></div>
    <div class="or-calc"><p><span>Regel</span>${esc(c.regel)}</p><p><span>Rekensom</span>${esc(c.som)}</p></div>
    ${gemNote ? `<div class="or-gem">${icon("gem", "sm")}<span>${gemNote}</span></div>` : ""}
    <button class="btn" type="button" data-next disabled data-label='${last ? "Naar de debriefing" : "Volgende krat"}${icon("arrow")}'>De krat rijdt naar ${EXITS[c.answer].naam}</button>
  </div>`);
  const nb = $("[data-next]", G.stage);
  nb.addEventListener("click", () => { if (phase !== "feedback") return; idx++; idx >= CRATES.length ? end() : next(); });
}
function queueChip() {
  const left = CRATES.length - idx - 1, q = $("[data-queue]", G.stage); if (!q) return;
  q.innerHTML = `<span>Wachtrij</span>${Array.from({ length: CRATES.length - 1 }, (_, i) => `<i class="${i < left ? "on" : ""}"></i>`).join("")}<b>${left}</b>`;
  q.setAttribute("aria-label", `Nog ${left} kratten in de wachtrij`);
}
function logLine(c, k, r) {
  const ol = $("[data-log]", G.stage); if (!ol) return;
  const e = $(".empty", ol); if (e) e.remove();
  ol.insertAdjacentHTML("afterbegin", `<li class="${r}"><span class="ic">${icon(r === "goed" ? "check" : r === "half" ? "half" : "x", "sm")}</span><span class="t">${esc(c.soort)} <small>${esc(c.jaar)}</small></span><span class="to" style="--c:${EXITS[k].col}">${icon(EXITS[k].icon, "sm")}${EXITS[k].naam}</span></li>`);
}
function onKey(e) {
  if (G.finished || e.altKey || e.ctrlKey || e.metaKey) return;
  const map = { ArrowLeft: "bewaren", ArrowUp: "archiveren", ArrowRight: "wissen" };
  if (phase === "choose" && map[e.key]) { e.preventDefault(); choose(map[e.key]); }
}
function timeout() {
  const from = phase === "feedback" || phase === "moving" ? idx + 1 : idx;
  phase = "done";
  for (let i = from; i < CRATES.length; i++) { const c = CRATES[i]; G.record({ result: "fout", points: 0, shield: 0, toast: false, q: `${c.soort}, ${c.datum}`, a: "Niet op tijd gesorteerd", why: `Juist was ${EXITS[c.answer].naam}. ${c.why}` }); }
  end();
}
function end() {
  if (G.finished) return;
  phase = "done"; document.removeEventListener("keydown", onKey);
  const good = G.log.filter((x) => x.result === "goed").length;
  if (G.hints === 0 && good >= 8 && G.gems < 3) G.gem();
  if (V && V.stop) V.stop();
  G.finish({ takeaway: "Bewaar gegevens niet langer dan nodig voor het doel. Eist een wet een langere termijn, dan gaan ze uit het dagelijks werk de kluis in. Is het doel weg en de termijn voorbij, dan wis je ze." });
}

/* ---------- Vaste standen voor schermafbeeldingen (?shot=) ---------- */
if (G.shot) {
  G.begin();
  const pre = (n) => { for (let i = 0; i < n; i++) { const c = CRATES[i]; G.record({ result: "goed", points: 10, q: `${c.soort}, ${c.datum}`, a: EXITS[c.answer].naam, why: c.why, toast: false }); logLine(c, c.answer, "goed"); } idx = n; };
  if (G.shot === "play") { pre(4); next(); }
  if (G.shot === "feedback") { pre(1); next().then(() => choose("bewaren")); }
  if (G.shot === "result") {
    [["goed"], ["half", "bewaren"], ["goed"], ["goed"], ["fout", "wissen"], ["goed"], ["goed"], ["goed"], ["fout", "wissen"], ["goed"]].forEach(([r, a], i) => {
      const c = CRATES[i], J = r === "goed" ? judge(c, c.answer) : judge(c, a);
      G.record({ result: J.result, points: J.points, shield: J.shield, toast: false, q: `${c.soort}, ${c.datum}`, a: EXITS[a || c.answer].naam, why: (J.result === "goed" ? "" : `Juist was ${EXITS[c.answer].naam}. `) + c.why });
    });
    G.gem(); end();
  }
}
