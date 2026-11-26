/* Level 1: Aankomst op het station. Game logic and content of this level. */
(() => {
'use strict';

/* ---------- Icons (Lucide) ---------- */
const I = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  half: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  memo: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  undo: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  clip: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  pulse: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  unlock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
};
const icon = (n, cls = 'sm') => `<svg class="vcsw-icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

/* ---------- Characters: flat geometric, brand blues, stroke 2 ---------- */
const ARIA_SVG = `<svg viewBox="0 0 120 120" aria-hidden="true">
  <rect x="8" y="10" width="104" height="96" rx="22" fill="var(--vcsw-blue-900)" stroke="var(--vcsw-blue-300)" stroke-width="2"/>
  <line x1="60" y1="10" x2="60" y2="2" stroke="var(--vcsw-blue-300)" stroke-width="2"/><circle cx="60" cy="2" r="2" fill="var(--vcsw-blue-300)"/>
  <circle class="aria-ring" cx="60" cy="58" r="32" fill="var(--vcsw-blue-950)" stroke="var(--vcsw-blue-400)" stroke-width="5"/>
  <circle cx="60" cy="58" r="20" fill="var(--vcsw-blue-600)"/>
  <circle class="aria-pupil" cx="60" cy="58" r="10" fill="var(--vcsw-blue-200)"/>
  <circle cx="54" cy="52" r="3" fill="var(--vcsw-blue-50)"/>
  <rect x="34" y="96" width="52" height="4" rx="2" fill="var(--vcsw-blue-400)"/>
</svg>`;
const BRAM_SVG = `<svg viewBox="0 0 120 130" aria-hidden="true">
  <rect x="22" y="84" width="76" height="46" rx="18" fill="var(--vcsw-blue-600)"/>
  <rect x="52" y="92" width="16" height="22" rx="3" fill="var(--vcsw-blue-200)"/>
  <circle cx="60" cy="54" r="30" fill="var(--vcsw-gray-200)"/>
  <path d="M30 50a30 30 0 0 1 60 0z" fill="var(--vcsw-blue-400)"/>
  <rect x="26" y="46" width="68" height="8" rx="4" fill="var(--vcsw-blue-700)"/>
  <circle cx="50" cy="62" r="3.5" fill="var(--vcsw-blue-950)"/><circle cx="70" cy="62" r="3.5" fill="var(--vcsw-blue-950)"/>
  <path class="bram-mouth" d="M50 72q10 8 20 0" fill="none" stroke="var(--vcsw-blue-950)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M96 96l14-14m-4-4 8 8" stroke="var(--vcsw-gray-400)" stroke-width="5" stroke-linecap="round"/>
</svg>`;
const AVATAR = { ARIA: ARIA_SVG, Bram: BRAM_SVG };

/* ---------- Content: from "AVG-game: Ruimtestation Orion", level 1 ---------- */
const BRIEFING = '“Welkom aan boord, cadet. Je krijgt vandaag toegang tot de systemen van Orion. Daarmee heb je ook toegang tot gegevens van duizenden mensen. Leer vandaag wat een persoonsgegeven is, en laat niets slingeren. Vanavond scan ik je hut.”';

const SITS = [
  { id: 's1', type: 'mc', title: 'De toegangscode', speaker: 'Bram',
    text: 'Bram wil je helpen: “De code van de passagiersdatabank? Ik zet hem even in het open stationskanaal.”',
    opts: [
      { t: '“Top, dank je!”', v: 'fout', why: 'Iedereen in dat kanaal kan hem lezen en hij blijft bewaard.', r: ['Bram', 'Staat erin. Handig toch?'] },
      { t: '“Ik vraag liever een eigen toegangscode aan bij ARIA.”', v: 'goed', why: 'Met een eigen account is duidelijk wie wat heeft gedaan.', r: ['Bram', 'Ook goed. Netter, eigenlijk.'], crystal: 'Eigen toegang' },
      { t: '“Zeg het maar, dan kras ik het in mijn consolerand.”', v: 'fout', why: 'Iedereen die langs je console loopt, kan het lezen.', r: ['Bram', 'Ha, ouderwets. Komt eraan.'] }
    ] },
  { id: 's2', type: 'mc', title: 'Etenstijd', speaker: 'ARIA',
    text: 'Je gaat naar de kantine. Op je console staat de passagierslijst van de laatste shuttle naar Nova Terra. Wat doe je?',
    opts: [
      { t: 'Laten staan, je bent zo terug en iedereen aan boord is betrouwbaar.', v: 'fout', why: 'Zolang je weg bent, kan iedereen die langsloopt de passagierslijst lezen.', r: ['ARIA', 'Genoteerd. Ik hoop dat de soep het waard is.'], memo: 'ARIA onthoudt dat je console openstond. Dit komt terug in level 5.' },
      { t: 'De console vergrendelen.', v: 'goed', why: 'Een vergrendelde console toont niets zolang jij weg bent.', r: ['ARIA', 'Console vergrendeld. Eet smakelijk, cadet.'] },
      { t: 'Het venster verkleinen.', v: 'half', why: 'Wie aan je console gaat zitten, opent het met één tik.', r: ['ARIA', 'Klein venster, zelfde risico.'] }
    ] },
  { id: 's3', type: 'sort', title: 'Is dit een persoonsgegeven?', speaker: 'ARIA',
    text: 'Sorteer de twaalf holokaarten. Sleep elke kaart naar een bak, of gebruik de knoppen op de kaart.' },
  { id: 's4', type: 'mc', title: 'Spullen van de vorige bewoner', speaker: 'ARIA',
    text: 'In het kastje van je hut vind je de loonstrook van het crewlid dat hier eerder sliep. Wat doe je?',
    opts: [
      { t: 'In de afvalschacht gooien.', v: 'fout', why: 'Afval wordt aan boord gesorteerd en kan worden doorzocht.', r: ['ARIA', 'De afvalsortering leest mee, cadet.'] },
      { t: 'Teruggeven aan de crewadministratie en melden bij ARIA, zodat beoordeeld kan worden of het een datalek is.', v: 'goed', why: 'Door te melden kan iemand beoordelen of er sprake is van een datalek.', r: ['ARIA', 'Melding ontvangen. Ik laat het beoordelen.'], crystal: 'Melden bij twijfel' },
      { t: 'Laten liggen, het is niet jouw zaak.', v: 'fout', why: 'Dan blijft het overzicht liggen en weet niemand dat er iets mis is.', r: ['ARIA', 'Op Orion is gegevens beschermen ieders zaak.'] }
    ] }
];

const CARDS = [
  ['Naam van een crewlid', true, 'Een naam herleidt direct naar een persoon'],
  ['Berichtenadres j.devries@orion.space', true, 'Persoonlijk adres is herleidbaar'],
  ['Algemeen kanaal brug@orion.space', false, 'Niet herleidbaar tot één persoon'],
  ['Registratie van een vrachtschip van een handelsmaatschappij', false, 'Gegeven over een organisatie'],
  ['Registratie van het schip van een zelfstandige handelaar', true, 'Herleidbaar tot de eigenaar'],
  ['Locatiesignaal van iemands polsband', true, 'Laat zien waar een persoon is'],
  ['Gemiddeld zuurstofverbruik van het hele station', false, 'Geaggregeerd en niet herleidbaar'],
  ['Zuurstofverbruik van een module met drie bewoners', true, 'Bij zo’n kleine groep is herleiden makkelijk'],
  ['Holofoto van een collega op het oogstfeest', true, 'Een herkenbaar gezicht is een persoonsgegeven'],
  ['Crewnummer', true, 'Herleidbaar via de administratie'],
  ['Totale brandstofkosten van de kolonie', false, 'Gegeven over een organisatie'],
  ['Shuttleregistratie van een crewlid', true, 'Herleidbaar tot de gebruiker']
];

/* Hut objects: label is neutral (what you see), name is what ARIA calls it once found */
const HUT = [
  { id: 'console', risk: true,  label: 'Console op het bureau', name: 'Ontgrendelde console', clue: 'Kijk eens naar de console op het bureau.', cx: 225, cy: 207, r: 52 },
  { id: 'code',    risk: true,  label: 'Briefje op de muur', name: 'Toegangscode op de muur', clue: 'Kijk eens naar het briefje op de muur.', cx: 157, cy: 138, r: 30 },
  { id: 'lijst',   risk: true,  label: 'Papieren op het bureau', name: 'Uitgeprinte passagierslijst', clue: 'Kijk eens naar de papieren op het bureau.', cx: 360, cy: 238, r: 32 },
  { id: 'medisch', risk: true,  label: 'Tablet op het bed', name: 'Open medisch dossier', clue: 'Kijk eens naar de tablet op het bed.', cx: 674, cy: 262, r: 32 },
  { id: 'chip',    risk: true,  label: 'Iets op de vloer', name: 'Onbekende datachip', clue: 'Er ligt iets op de vloer. Kijk daar eens naar.', cx: 277, cy: 381, r: 30 },
  { id: 'comm',    risk: true,  label: 'Communicator op de plank', name: 'Communicator met zichtbaar bericht van Kapitein Vega', clue: 'Kijk eens naar de communicator op de plank.', cx: 674, cy: 172, r: 30 },
  { id: 'kast',    risk: true,  label: 'Archiefkastje', name: 'Sleutelkaart in het archiefkastje', clue: 'Kijk eens naar het archiefkastje.', cx: 500, cy: 245, r: 30 },
  { id: 'printer', risk: true,  label: 'Printer', name: 'Folie in de printer', clue: 'Kijk eens naar de printer.', cx: 475, cy: 188, r: 32 },
  { id: 'plant',   risk: false, label: 'Ruimteplant', name: 'Ruimteplant', cx: 735, cy: 165, r: 28 },
  { id: 'mok',     risk: false, label: 'Mok', name: 'Mok', cx: 308, cy: 232, r: 24 },
  { id: 'kaart',   risk: false, label: 'Stationsplattegrond', name: 'Stationsplattegrond', cx: 690, cy: 100, r: 48 },
  { id: 'poster',  risk: false, label: 'Poster aan de muur', name: 'Poster van Nova Terra', cx: 565, cy: 110, r: 50 }
];
const CODE = '38150629';
const SLUIS_SECONDS = 180;

const RULES = [
  'Een gegeven is een persoonsgegeven als je het, direct of via omwegen, aan één persoon kunt koppelen.',
  'Vergrendel altijd je scherm en laat niets op papier slingeren.',
  'Twijfel je of iets fout zit? Meld het. Liever tien meldingen te veel dan één te weinig.'
];

const POINTS = { goed: 10, half: 5, fout: 0 };
const SHIELD_LOSS = { goed: 0, half: 5, fout: 10 };   // assumption: amounts are not in the design
const CLUE_COST = 10;                                   // one price: a crystal earned in this level is one clue without cost, after that 10 percent shield
const CRYSTALS_MAX = 3;
const MAX = SITS.length * 10;
const PASS = 0.7;
const VLABEL = { goed: 'Goed', half: 'Half goed', fout: 'Fout' };
const VICON = { goed: 'check', half: 'half', fout: 'x' };

/* ---------- State ---------- */
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
function fresh() {
  return {
    screen: 'start', sit: 0, shield: 100, score: 0, crystals: [], results: {}, memos: [],
    optOrder: Object.fromEntries(SITS.filter(s => s.type === 'mc').map(s => [s.id, shuffle([0, 1, 2])])),
    pending: null,
    sortOrder: shuffle(CARDS.map((_, i) => i)), sort: {}, sortChecked: false,
    hut: { started: false, found: [], nope: [], left: SLUIS_SECONDS, asked: [], paid: 0, done: false, timeout: false },
    passed: false
  };
}
let S = fresh();
let timer = null;
const stage = document.getElementById('stage');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- Typewriter with skip; full text always available to screen readers ---------- */
let typing = null;
function speak(container, text, onDone) {
  const vis = container.querySelector('[data-say]');
  const sr = container.querySelector('[data-sr]');
  const av = container.querySelector('.avatar');
  const skip = container.querySelector('.skip');
  if (sr) sr.textContent = text;
  if (typing) { clearInterval(typing.id); typing = null; }
  const finish = () => {
    if (typing) { clearInterval(typing.id); typing = null; }
    vis.textContent = text; av && av.classList.remove('speaking'); if (skip) skip.hidden = true; onDone && onDone();
  };
  if (reduce) { finish(); return; }
  /* Reserve the room of the whole sentence first, so the answers below do not move while the text appears. */
  vis.style.minHeight = ''; vis.textContent = text; const full = vis.offsetHeight; if (full) vis.style.minHeight = full + 'px';
  let i = 0; vis.textContent = ''; av && av.classList.add('speaking'); if (skip) { skip.hidden = false; skip.onclick = finish; }
  typing = { id: setInterval(() => { i += 2; vis.textContent = text.slice(0, i); if (i >= text.length) finish(); }, 28) };
}
const dialog = (who, cls = '') => `<div class="dialog ${cls}"><div class="avatar">${AVATAR[who] || ARIA_SVG}</div><div class="bubble"><p class="who">${who}</p><p class="line" data-say aria-hidden="true"></p><p class="vcsw-sr-only" data-sr></p><button class="vcsw-button ghost sm skip" type="button" hidden>Tekst direct tonen</button></div></div>`;

/* ---------- HUD ---------- */
function hud() {
  document.getElementById('hud-rank').textContent = S.passed ? 'Vaandrig' : 'Cadet';
  document.getElementById('hud-shield').textContent = S.shield + '%';
  const bar = document.getElementById('hud-shield-bar');
  bar.style.width = S.shield + '%';
  bar.className = 'vcsw-progress-fill' + (S.shield < 50 ? ' error' : S.shield < 80 ? ' warning' : '');
  document.getElementById('hud-score').textContent = `${S.score} van ${MAX}`;
  document.getElementById('hud-crystals').textContent = `${S.crystals.length} van ${CRYSTALS_MAX}`;
}

const STEPS = [['briefing', 'Briefing'], ['dienst', 'Dienst'], ['sluis', 'Luchtsluis'], ['debrief', 'Debriefing'], ['aarde', 'Terug op aarde']];
/* The level's own steps strip. Inside the shell it is hidden (.own-status); the shell reads window.orionStatus instead. */
function steps(cur) {
  const idx = STEPS.findIndex(s => s[0] === cur);
  return `<ol class="steps own-status" aria-label="Opbouw van het level">${STEPS.map((s, i) => `<li class="${i < idx ? 'done' : ''}"${i === idx ? ' aria-current="step"' : ''}><span class="dot" aria-hidden="true"></span>${i < idx ? '<span class="vcsw-sr-only">Afgerond: </span>' : ''}${s[1]}</li>`).join('')}</ol>`;
}

/* ---------- Hook for the shell: always reflects the current state ---------- */
const STEP_OF = { start: 0, briefing: 0, sit: 1, sluis: 2, debrief: 3, aarde: 4 };
window.orionStatus = function () {
  const done = S.screen === 'aarde';
  return {
    score: S.score,
    max: MAX,
    shield: S.shield,
    crystals: S.crystals.length,
    crystalsMax: CRYSTALS_MAX,
    steps: STEPS.map(s => s[1]),
    step: STEP_OF[S.screen] || 0,
    done,
    passed: done ? S.score / MAX >= PASS : null,
    pct: done ? Math.round(S.score / MAX * 100) : null
  };
};

/* ---------- Screens ---------- */
function render() {
  if (timer && S.screen !== 'sluis') { clearInterval(timer); timer = null; }
  hud();
  ({ start: renderStart, briefing: renderBriefing, sit: renderSit, sluis: renderSluis, debrief: renderDebrief, aarde: renderAarde })[S.screen]();
}
function go(screen, extra = {}) { Object.assign(S, extra, { screen }); render(); stage.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); const h = stage.querySelector('h2, h1'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }

function renderStart() {
  stage.innerHTML = `<div class="title-screen">
    <div>
      <h1>Ruimtestation Orion</h1>
      <p class="lead">Het jaar is 2247. Je komt aan als Cadet van de Datawacht, de eenheid die alle gegevens aan boord beschermt. Boordcomputer ARIA begeleidt je, en de piraten van de Zwarte Nevel liggen op de loer.</p>
      <div class="actions"><button class="vcsw-button lg" type="button" id="b-start">Aan boord gaan ${icon('right')}</button></div>
    </div>
    <div class="crew">
      <figure><div class="a">${ARIA_SVG}</div><figcaption>ARIA, boordcomputer</figcaption></figure>
      <figure><div class="b">${BRAM_SVG}</div><figcaption>Bram, monteur</figcaption></figure>
    </div>
  </div>`;
  stage.querySelector('#b-start').onclick = () => go('briefing');
}

function renderBriefing() {
  /* The hidden marker tells the bridge that a new run starts here, so it forgets earlier answers. It is never shown. */
  stage.innerHTML = `${steps('briefing')}
    <span class="ov" hidden>Briefing</span>
    <h2>Aankomst op het station</h2>
    ${dialog('ARIA')}
    <p class="uitleg">Leerdoel: je herkent wat persoonsgegevens zijn en je houdt je werkplek veilig.</p>
    <div class="actions"><button class="vcsw-button lg" type="button" id="b-next">Begin je dienst ${icon('right')}</button></div>`;
  speak(stage.querySelector('.dialog'), BRIEFING);
  stage.querySelector('#b-next').onclick = () => go('sit', { sit: 0 });
}

function renderSit() {
  const sit = SITS[S.sit];
  const head = `${steps('dienst')}<div class="head"><div class="chips"><span class="chip">Situatie ${S.sit + 1} van ${SITS.length}</span></div><h2>${sit.title}</h2></div>`;
  if (sit.type === 'sort') return renderSort(sit, head);
  const order = S.optOrder[sit.id];
  stage.innerHTML = `${head}${dialog(sit.speaker)}
    <div class="options" role="group" aria-label="Kies je antwoord">
      ${order.map((oi, k) => `<button class="opt" type="button" data-oi="${oi}" aria-pressed="false"><span class="key" aria-hidden="true">${'ABC'[k]}</span><span class="txt">${esc(sit.opts[oi].t)}</span><span class="verdict"></span></button>`).join('')}
    </div>
    <div class="feedback" hidden></div>`;
  const done = S.results[sit.id];
  speak(stage.querySelector('.dialog'), sit.text);
  stage.querySelectorAll('.opt').forEach(b => b.onclick = () => choose(sit, +b.dataset.oi));
  if (done) showFeedback(sit, done.oi, false);
}

/* Scoring of one answer; the same step is used by the test jump (?scherm=) */
function grade(sit, oi) {
  const o = sit.opts[oi];
  S.results[sit.id] = { v: o.v, points: POINTS[o.v], oi };
  S.score += POINTS[o.v];
  S.shield = Math.max(0, S.shield - SHIELD_LOSS[o.v]);
  if (o.crystal && !S.crystals.includes(o.crystal)) S.crystals.push(o.crystal);
  if (o.memo) S.memos.push(o.memo);
}
function choose(sit, oi) {
  if (S.results[sit.id]) return;
  grade(sit, oi);
  hud();
  showFeedback(sit, oi, true);
}

function showFeedback(sit, oi, animate) {
  const o = sit.opts[oi];
  const best = sit.opts.findIndex(x => x.v === 'goed');
  stage.querySelectorAll('.opt').forEach(b => {
    const i = +b.dataset.oi; b.disabled = true;
    b.setAttribute('aria-pressed', String(i === oi));
    const vd = b.querySelector('.verdict');
    if (i === oi) { b.classList.add('chosen', o.v); vd.innerHTML = `<span class="v-${o.v}">${icon(VICON[o.v])} ${VLABEL[o.v]}</span>`; }
    else if (i === best) { b.classList.add('best'); vd.innerHTML = `<span class="v-goed">${icon('check')} Beste keuze</span>`; }
    else b.classList.add('dim');
  });
  const fb = stage.querySelector('.feedback');
  const loss = SHIELD_LOSS[o.v];
  fb.innerHTML = `${dialog(o.r[0], 'small')}
    <p class="uitleg"><strong>${VLABEL[o.v]}.</strong> ${esc(o.why)}</p>
    <div class="chips">
      <span class="chip">+${POINTS[o.v]} punten</span>
      ${loss ? `<span class="chip">${icon('shield')} Schild −${loss}%</span>` : ''}
      ${o.crystal ? `<span class="chip crystal">${icon('gem')} Datakristal: ${esc(o.crystal)}</span>` : ''}
      ${o.memo ? `<span class="chip memo">${icon('memo')} ${esc(o.memo)}</span>` : ''}
    </div>
    <div class="actions"><button class="vcsw-button" type="button" id="b-next">${S.sit < SITS.length - 1 ? 'Volgende situatie' : 'Naar de luchtsluis'} ${icon('right')}</button></div>`;
  fb.hidden = false;
  const d = fb.querySelector('.dialog');
  if (animate) speak(d, o.r[1]); else { d.querySelector('[data-say]').textContent = o.r[1]; d.querySelector('[data-sr]').textContent = o.r[1]; }
  fb.querySelector('#b-next').onclick = nextSit;
  if (animate) fb.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
}
function nextSit() { if (S.sit < SITS.length - 1) go('sit', { sit: S.sit + 1 }); else go('sluis'); }

/* Sorting */
function renderSort(sit, head) {
  stage.innerHTML = `${head}${dialog('ARIA')}
    <div class="sort">
      <div class="pool" id="pool" aria-label="Holokaarten die nog geplaatst moeten worden"></div>
      <section class="bin" data-bin="wel" aria-labelledby="bin-wel"><h3 id="bin-wel">Wel persoonsgegeven <span data-count></span></h3><div class="bin-cards"></div></section>
      <section class="bin" data-bin="geen" aria-labelledby="bin-geen"><h3 id="bin-geen">Geen persoonsgegeven <span data-count></span></h3><div class="bin-cards"></div></section>
    </div>
    <div class="feedback" hidden></div>
    <div class="actions" id="sort-actions"><button class="vcsw-button" type="button" id="b-check" disabled>Controleer</button><span class="status" id="sort-status"></span></div>`;
  speak(stage.querySelector('.dialog'), sit.text);
  stage.querySelectorAll('.bin').forEach(bin => {
    bin.addEventListener('dragover', e => { if (S.sortChecked) return; e.preventDefault(); bin.classList.add('over'); });
    bin.addEventListener('dragleave', () => bin.classList.remove('over'));
    bin.addEventListener('drop', e => { e.preventDefault(); bin.classList.remove('over'); const i = e.dataTransfer.getData('text/plain'); if (i !== '') place(+i, bin.dataset.bin); });
  });
  stage.querySelector('#b-check').onclick = checkSort;
  drawSort();
  if (S.sortChecked) sortFeedback();
}
function drawSort() {
  const pool = stage.querySelector('#pool');
  const bins = { wel: stage.querySelector('[data-bin="wel"] .bin-cards'), geen: stage.querySelector('[data-bin="geen"] .bin-cards') };
  pool.innerHTML = ''; bins.wel.innerHTML = ''; bins.geen.innerHTML = '';
  S.sortOrder.forEach(i => {
    const [txt, isPd, why] = CARDS[i];
    const where = S.sort[i];
    const el = document.createElement('div');
    el.className = 'card';
    if (!S.sortChecked) {
      el.draggable = true;
      el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', String(i)));
    }
    let body = `<span class="card-txt">${esc(txt)}</span>`;
    if (S.sortChecked) {
      const ok = (where === 'wel') === isPd;
      el.classList.add(ok ? 'ok' : 'nok');
      body += `<span class="row ${ok ? 'v-goed' : 'v-fout'}">${icon(ok ? 'check' : 'x')} <strong>${ok ? 'Goed' : 'Fout'}</strong></span><span class="why">${esc(why)}</span>`;
    } else if (!where) {
      body += `<span class="row"><button class="vcsw-button outline" type="button" data-to="wel" aria-label="${esc(txt)}: wel persoonsgegeven">Wel</button><button class="vcsw-button outline" type="button" data-to="geen" aria-label="${esc(txt)}: geen persoonsgegeven">Geen</button></span>`;
    } else {
      body += `<span class="row"><button class="vcsw-button ghost" type="button" data-to="" aria-label="${esc(txt)} terugleggen">${icon('undo')} Terugleggen</button></span>`;
    }
    el.innerHTML = body;
    el.querySelectorAll('[data-to]').forEach(b => b.onclick = () => place(i, b.dataset.to));
    (where ? bins[where] : pool).appendChild(el);
  });
  const n = Object.keys(S.sort).length;
  stage.querySelectorAll('.bin').forEach(b => b.querySelector('[data-count]').textContent = b.querySelector('.bin-cards').children.length);
  const chk = stage.querySelector('#b-check');
  if (chk) { chk.disabled = n < CARDS.length || S.sortChecked; }
  const st = stage.querySelector('#sort-status');
  if (st && !S.sortChecked) st.textContent = `${n} van ${CARDS.length} geplaatst`;
}
function place(i, to) {
  if (S.sortChecked) return;
  if (to) S.sort[i] = to; else delete S.sort[i];
  drawSort();
}
function gradeSort() {
  const good = CARDS.filter((c, i) => (S.sort[i] === 'wel') === c[1]).length;
  const v = good >= 10 ? 'goed' : good >= 7 ? 'half' : 'fout';   // assumption: 10+ goed, 7 to 9 half goed
  S.sortChecked = true;
  S.results.s3 = { v, points: POINTS[v], good };
  S.score += POINTS[v];
  S.shield = Math.max(0, S.shield - SHIELD_LOSS[v]);
  if (good >= 10 && !S.crystals.includes('Herleidbaar = persoonsgegeven')) S.crystals.push('Herleidbaar = persoonsgegeven');
}
function checkSort() { gradeSort(); hud(); drawSort(); sortFeedback(); }
function sortFeedback() {
  const r = S.results.s3; if (!r) return;
  stage.querySelector('#sort-actions').hidden = true;
  const fb = stage.querySelector('.feedback');
  const loss = SHIELD_LOSS[r.v];
  const line = r.good >= 10 ? 'Scherp. Herleidbaar betekent persoonsgegeven, ook via een omweg.' : 'Let op de omwegen. Ook een kleine groep of een nummer kan naar één persoon leiden.';
  fb.innerHTML = `${dialog('ARIA', 'small')}
    <p class="uitleg"><strong>${r.good} van ${CARDS.length} goed.</strong> Bekijk bij elke kaart de uitleg.</p>
    <div class="chips"><span class="chip">+${r.points} punten</span>${loss ? `<span class="chip">${icon('shield')} Schild −${loss}%</span>` : ''}${r.good >= 10 ? `<span class="chip crystal">${icon('gem')} Datakristal: Herleidbaar = persoonsgegeven</span>` : ''}</div>
    <div class="actions"><button class="vcsw-button" type="button" id="b-next">Volgende situatie ${icon('right')}</button></div>`;
  fb.hidden = false;
  speak(fb.querySelector('.dialog'), line);
  fb.querySelector('#b-next').onclick = nextSit;
}

/* Luchtsluis: hutinspectie */
function hutSvg() {
  const hit = h => `<circle class="hit" cx="${h.cx}" cy="${h.cy}" r="${h.r}"/>`;
  const mark = h => `<g class="mark"><circle class="h-mark-c" cx="${h.cx + h.r * .62}" cy="${h.cy - h.r * .62}" r="13"/><path class="h-mark-k" d="M${h.cx + h.r * .62 - 6} ${h.cy - h.r * .62}l4 4 8-8"/></g>`;
  const art = {
    console: `<rect class="h-dark" x="170" y="168" width="110" height="76" rx="6"/><rect class="h-stroke" x="170" y="168" width="110" height="76" rx="6"/><rect class="h-soft" x="178" y="176" width="94" height="58" rx="3"/><path class="h-ink-dark" d="M188 190h50M188 202h70M188 214h40M188 226h60"/><rect class="h-mid" x="218" y="244" width="14" height="8"/>`,
    code: `<rect class="h-paper" x="136" y="118" width="44" height="40" rx="2"/><text class="h-txt" x="141" y="143">7741</text>`,
    lijst: `<rect class="h-paper" x="332" y="226" width="58" height="24" rx="2" transform="rotate(-6 361 238)"/><path class="h-ink" d="M340 234h34M341 240h40M342 246h28" transform="rotate(-6 361 238)"/>`,
    medisch: `<rect class="h-paper" x="650" y="244" width="48" height="34" rx="4"/><path d="M674 252v18M665 261h18" stroke="var(--vcsw-blue-600)" stroke-width="5" stroke-linecap="round"/>`,
    chip: `<rect class="h-soft" x="260" y="370" width="34" height="22" rx="3"/><path class="h-ink-dark" d="M266 370v-6M274 370v-6M282 370v-6M290 370v-6"/><rect class="h-mid" x="268" y="376" width="18" height="10" rx="2"/>`,
    comm: `<rect class="h-dark" x="660" y="150" width="28" height="42" rx="5"/><rect class="h-stroke" x="660" y="150" width="28" height="42" rx="5"/><rect class="h-pale" x="664" y="156" width="20" height="14" rx="3"/><path class="h-ink-dark" d="M667 161h14M667 165h9"/>`,
    kast: `<rect class="h-trim" x="430" y="212" width="90" height="118" rx="4"/><rect class="h-stroke" x="430" y="212" width="90" height="118" rx="4"/><path class="h-stroke" d="M430 252h90M430 292h90"/><rect class="h-dark" x="465" y="230" width="20" height="4" rx="2"/><rect class="h-dark" x="465" y="270" width="20" height="4" rx="2"/><rect class="h-pale" x="490" y="238" width="28" height="16" rx="2" transform="rotate(-10 504 246)"/><rect class="h-mid" x="494" y="244" width="20" height="3" transform="rotate(-10 504 246)"/>`,
    printer: `<rect class="h-faint" x="452" y="166" width="46" height="18" rx="1"/><rect class="h-grey" x="440" y="180" width="70" height="32" rx="4"/><rect class="h-dark" x="450" y="190" width="50" height="5" rx="2"/>`,
    plant: `<path class="h-soft" d="M735 162c-12-10-14-24-6-30 6 8 8 18 6 30zM736 162c8-14 22-16 26-10-8 6-16 10-26 10zM734 163c-12-4-22-2-24 4 8 2 16 0 24-4z"/><rect class="h-mid" x="722" y="162" width="28" height="24" rx="3"/>`,
    mok: `<rect class="h-grey" x="298" y="220" width="20" height="28" rx="4"/><path d="M318 228a6 6 0 0 1 0 12" fill="none" stroke="var(--vcsw-gray-300)" stroke-width="3"/>`,
    kaart: `<rect class="h-dark" x="635" y="62" width="110" height="76" rx="3"/><rect class="h-stroke" x="635" y="62" width="110" height="76" rx="3"/><circle class="h-stroke" cx="690" cy="100" r="22"/><path class="h-stroke" d="M668 100h44M690 78v44M645 72h20v20h-20zM715 108h20v20h-20z"/>`,
    poster: `<rect class="h-trim" x="520" y="52" width="90" height="120" rx="3"/><rect class="h-stroke" x="520" y="52" width="90" height="120" rx="3"/><circle class="h-soft" cx="565" cy="100" r="24"/><ellipse cx="565" cy="100" rx="36" ry="8" fill="none" stroke="var(--vcsw-blue-100)" stroke-width="2"/><text class="h-txt-light" x="535" y="155">NOVA TERRA</text>`
  };
  const objs = HUT.map(h => `<g class="hot" data-id="${h.id}" role="button" tabindex="0" aria-label="${esc(h.label)}">${art[h.id]}${hit(h)}${mark(h)}</g>`).join('');
  return `<svg class="hut" viewBox="0 30 800 390" role="group" aria-label="Je hut. Zoek de acht risico's.">
    <rect class="h-wall" x="0" y="0" width="800" height="340"/>
    <rect class="h-floor" x="0" y="340" width="800" height="120"/>
    <path class="h-stroke" d="M0 340h800" opacity=".6"/>
    <rect class="h-trim" x="24" y="96" width="96" height="244" rx="12"/><rect class="h-stroke" x="24" y="96" width="96" height="244" rx="12"/><path class="h-stroke" d="M72 108v220"/>
    <circle class="h-dark" cx="400" cy="110" r="58"/><circle class="h-stroke" cx="400" cy="110" r="58" stroke-width="5"/>
    <circle class="h-pale" cx="378" cy="92" r="2"/><circle class="h-pale" cx="420" cy="128" r="1.5"/><circle class="h-pale" cx="410" cy="84" r="1.5"/><circle class="h-soft" cx="430" cy="104" r="9"/>
    <rect class="h-mid" x="150" y="252" width="260" height="14" rx="3"/><rect class="h-trim" x="162" y="266" width="10" height="74"/><rect class="h-trim" x="388" y="266" width="10" height="74"/>
    <rect class="h-mid" x="636" y="192" width="134" height="8" rx="3"/>
    <rect class="h-trim" x="560" y="264" width="226" height="52" rx="8"/><rect class="h-mid" x="560" y="256" width="226" height="18" rx="8"/><rect class="h-paper" x="574" y="244" width="54" height="20" rx="9"/><rect class="h-trim" x="570" y="316" width="10" height="24"/><rect class="h-trim" x="766" y="316" width="10" height="24"/>
    ${objs}
  </svg>`;
}

const ilist = rows => `<ul class="ilist">${rows.map(r => `<li><span class="ic ${r[2] || ''}">${icon(r[0], '')}</span><span>${r[1]}</span></li>`).join('')}</ul>`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/* Start card of the airlock: the goal in one sentence, how you score, what a mistake costs, one start button */
function renderSluisStart() {
  const H = S.hut, n = S.crystals.length;
  stage.innerHTML = `${steps('sluis')}
    <div class="head">
      <div class="chips"><span class="chip">Luchtsluis</span><span class="chip">${icon('clock')} 3 minuten</span><span class="chip">${icon('gem')} ${plural(n, 'kristal', 'kristallen')} uit dit level</span></div>
      <h2>Hutinspectie</h2>
      <p class="lead">ARIA scant je hut. Vind alle acht risico’s voordat de tijd om is.</p>
    </div>
    <div class="two">
      <section class="acard"><h3>Zo scoor je</h3>${ilist([
        ['check', 'Klik een risico aan en er licht een cijfer van de sluiscode op', 'good'],
        ['unlock', 'Met alle acht cijfers gaat de luchtsluis open', 'good'],
        ['info', 'In de hut verdien je geen punten. Je score uit de dienst staat vast']
      ])}</section>
      <section class="acard"><h3>Wat een fout kost</h3>${ilist([
        ['x', 'Een voorwerp zonder risico aanklikken kost niets'],
        ['gem', n ? `Elk kristal uit dit level is één aanwijzing van ARIA zonder kosten. Jij hebt er ${n}` : 'Elk kristal uit dit level is één aanwijzing van ARIA zonder kosten. Jij hebt er geen', 'gold'],
        ['shield', `Daarna kost een aanwijzing ${CLUE_COST} procent schild`, 'bad'],
        ['clock', 'Is de tijd om, dan opent ARIA de sluis en zie je wat je miste']
      ])}</section>
    </div>
    <div class="actions"><button class="vcsw-button lg" type="button" id="b-go">Start de inspectie ${icon('arrow')}</button></div>`;
  stage.querySelector('#b-go').onclick = () => { H.started = true; render(); const h = stage.querySelector('h2'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } };
}

const DOOR_SVG = `<svg class="door" viewBox="0 0 180 120" aria-hidden="true"><rect x="2" y="2" width="176" height="116" rx="14" fill="var(--vcsw-blue-950)" stroke="var(--vcsw-blue-300)" stroke-width="2"/><rect x="30" y="16" width="120" height="88" rx="6" fill="var(--vcsw-blue-200)"/><g class="l"><rect x="30" y="16" width="60" height="88" fill="var(--vcsw-blue-700)" stroke="var(--vcsw-blue-300)" stroke-width="2"/></g><g class="r"><rect x="90" y="16" width="60" height="88" fill="var(--vcsw-blue-700)" stroke="var(--vcsw-blue-300)" stroke-width="2"/></g></svg>`;

function renderSluis() {
  const H = S.hut;
  if (!H.started) return renderSluisStart();
  const n = S.crystals.length;
  stage.innerHTML = `${steps('sluis')}
    <h2 class="vcsw-sr-only">Hutinspectie</h2>
    <div class="sluis-bar">
      <div class="timer" role="timer" aria-label="Resterende tijd">${icon('clock', '')}<span id="t">${fmt(H.left)}</span></div>
      <div class="code-box"><span class="code-label">Sluiscode</span><div class="code" id="code" role="img" aria-label="Sluiscode, ${H.found.length} van 8 cijfers gevonden">${[...CODE].map((d, i) => `<span class="${i < H.found.length ? 'lit' : ''}">${i < H.found.length ? d : '·'}</span>`).join('')}</div></div>
    </div>
    <div class="hut-box"><div class="hut-wrap">${hutSvg()}</div>
      <p class="status" id="hut-status" aria-live="polite"></p></div>
    <section class="clues" id="clues" aria-labelledby="clues-h">
      <div class="clues-card">
        <div class="clues-text">
          <div class="clues-head"><h3 id="clues-h">Aanwijzingen van ARIA</h3><span class="gems" id="clue-gems"></span></div>
          <p>${n ? `Je verdiende ${plural(n, 'kristal', 'kristallen')} in dit level. Elk kristal is één aanwijzing zonder kosten. Daarna kost een aanwijzing ${CLUE_COST} procent schild.` : `Je verdiende geen kristallen in dit level. Een aanwijzing kost ${CLUE_COST} procent schild.`}</p>
        </div>
        <div class="clues-act"><button class="vcsw-button" type="button" id="b-clue">Vraag ARIA om een aanwijzing ${icon('bulb')}</button><span class="chip cost" id="clue-cost"></span></div>
      </div>
      <div class="clue-list" id="clue-list" aria-live="polite"></div>
    </section>
    <div class="feedback" id="hut-end" hidden></div>`;
  stage.querySelectorAll('.hut .hot').forEach(g => {
    const id = g.dataset.id;
    if (H.found.includes(id)) g.classList.add('found');
    if (H.nope.includes(id)) g.classList.add('nope');
    const act = () => clickHut(id, g);
    g.addEventListener('click', act);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  });
  stage.querySelector('#b-clue').onclick = askClue;
  drawClues();
  if (H.done || H.timeout) endSluis(false);
  else if (!timer) timer = setInterval(tick, 1000);
}
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
function tick() {
  const H = S.hut; if (H.done || H.timeout) return;
  H.left = Math.max(0, H.left - 1);
  const t = stage.querySelector('#t'); if (t) { t.textContent = fmt(H.left); t.parentElement.classList.toggle('low', H.left <= 30); }
  if (H.left === 60 || H.left === 30) say(`Nog ${H.left === 60 ? 'één minuut' : 'dertig seconden'}.`);
  if (H.left === 0) { H.timeout = true; clearInterval(timer); timer = null; endSluis(true); }
}
const say = t => { const s = stage.querySelector('#hut-status'); if (s) s.textContent = t; };
function clickHut(id, g) {
  const H = S.hut; if (H.done || H.timeout) return;
  const h = HUT.find(x => x.id === id);
  if (H.found.includes(id)) return;
  if (h.risk) {
    H.found.push(id); g.classList.add('found'); g.classList.remove('pointed');
    const code = stage.querySelector('#code');
    const sp = code.children[H.found.length - 1]; sp.textContent = CODE[H.found.length - 1]; sp.classList.add('lit');
    code.setAttribute('aria-label', `Sluiscode, ${H.found.length} van 8 cijfers gevonden`);
    say(`Risico gevonden: ${h.name}. Cijfer ${H.found.length} van de sluiscode licht op.`);
    if (H.found.length === 8) { H.done = true; clearInterval(timer); timer = null; endSluis(true); }
    drawClues();
  } else {
    if (!H.nope.includes(id)) H.nope.push(id);
    g.classList.add('nope');
    say(`${h.name}: geen risico.`);
  }
}

/* Clues, proposal B: one button. ARIA gives the next clue as a speech balloon, in the fixed order of HUT.
   One price: every crystal earned in this level is one clue without cost, after that a clue costs CLUE_COST percent shield. */
const nextClue = () => HUT.find(h => h.risk && !S.hut.found.includes(h.id) && !S.hut.asked.includes(h.id));
const clueIsFree = () => S.hut.asked.length < S.crystals.length;
function drawClues() {
  const H = S.hut, n = S.crystals.length, used = Math.min(H.asked.length, n);
  const b = stage.querySelector('#b-clue'); if (!b) return;
  const next = nextClue(), over = H.done || H.timeout;
  b.disabled = over || !next;
  stage.querySelector('#clue-gems').innerHTML = n
    ? `${Array.from({ length: n }, (_, i) => `<span class="gem ${i < used ? 'used' : 'left'}">${icon('gem', '')}</span>`).join('')}<span class="gems-txt">${used} van ${n} gebruikt</span>`
    : `<span class="gems-txt">Geen kristallen</span>`;
  const cost = stage.querySelector('#clue-cost');
  cost.className = 'chip cost' + (!next ? '' : clueIsFree() ? ' free' : ' paid');
  cost.innerHTML = !next ? `${icon('check')} Je hebt alle aanwijzingen gekregen`
    : clueIsFree() ? `${icon('gem')} De volgende kost niets`
    : `${icon('shield')} De volgende kost ${CLUE_COST} procent schild`;
  const open = H.asked.filter(id => !H.found.includes(id));
  stage.querySelector('#clue-list').innerHTML = open.map(id => `<div class="clue"><div class="clue-av">${ARIA_SVG}</div><div><p class="clue-who"><strong>ARIA</strong> <span>boordcomputer</span></p><p class="clue-txt">${esc(HUT.find(h => h.id === id).clue)}</p></div></div>`).join('');
}
function askClue() {
  const H = S.hut; if (H.done || H.timeout) return;
  const next = nextClue(); if (!next) return;
  if (!clueIsFree()) { H.paid++; S.shield = Math.max(0, S.shield - CLUE_COST); hud(); }
  H.asked.push(next.id);
  const g = stage.querySelector(`.hot[data-id="${next.id}"]`);
  g.classList.add('pointed');
  setTimeout(() => g.classList.remove('pointed'), 3000);
  drawClues();
  const last = stage.querySelector('#clue-list .clue:last-child');
  if (last) last.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
}
function endSluis(animate) {
  const H = S.hut;
  drawClues();
  stage.querySelector('#clues').hidden = true;
  const missed = HUT.filter(h => h.risk && !H.found.includes(h.id));
  missed.forEach(h => stage.querySelector(`.hot[data-id="${h.id}"]`).classList.add('missed'));
  if (H.found.length === 8) stage.querySelector('#code').classList.add('complete');
  const asked = H.asked.length;
  const end = stage.querySelector('#hut-end');
  end.innerHTML = `<div class="end-row">${DOOR_SVG}
      <div class="end-text">
        <h3>${H.found.length === 8 ? 'Sluiscode compleet. De luchtsluis gaat open.' : 'De tijd is om. ARIA opent de sluis handmatig.'}</h3>
        <p>Je vond ${H.found.length} van de 8 risico’s${asked ? ` en vroeg ARIA om ${plural(asked, 'aanwijzing', 'aanwijzingen')}` : ''}.</p>
        ${missed.length ? `<p>Gemist, rood omcirkeld in je hut:</p><ul class="missed-list">${missed.map(h => `<li>${esc(h.name)}</li>`).join('')}</ul>` : ''}
      </div></div>
    <div class="actions"><button class="vcsw-button" type="button" id="b-next">Naar de debriefing ${icon('right')}</button></div>`;
  end.hidden = false;
  const door = end.querySelector('.door');
  if (animate) requestAnimationFrame(() => requestAnimationFrame(() => door.classList.add('open'))); else door.classList.add('open');
  end.querySelector('#b-next').onclick = () => go('debrief');
  if (animate) end.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
}

function renderDebrief() {
  const recap = SITS.map(s => { const r = S.results[s.id]; return `<div><span>${esc(s.title)}</span><span class="v-${r.v}">${icon(VICON[r.v])} ${VLABEL[r.v]}${s.type === 'sort' ? `, ${r.good} van 12` : ''}</span></div>`; }).join('');
  const goodOnes = SITS.filter(s => S.results[s.id].v === 'goed').map(s => s.title.toLowerCase());
  const line = goodOnes.length
    ? `Dienst afgerond. Sterk werk bij ${goodOnes.length > 1 ? goodOnes.slice(0, -1).join(', ') + ' en ' + goodOnes.slice(-1) : goodOnes[0]}. En je vond ${S.hut.found.length} van de 8 risico’s in je hut. Onthoud drie regels.`
    : `Dienst afgerond. Je vond ${S.hut.found.length} van de 8 risico’s in je hut. Lees de uitleg nog eens rustig na, en onthoud drie regels.`;
  stage.innerHTML = `${steps('debrief')}<h2>Wat ARIA je meegeeft</h2>
    ${dialog('ARIA')}
    <ol class="rules">${RULES.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
    <div class="recap-box"><h3>Jouw dienst</h3><div class="recap">${recap}<div><span>Hutinspectie</span><span>${S.hut.found.length} van 8 risico’s gevonden</span></div></div></div>
    ${S.memos.length ? `<div class="chips">${S.memos.map(m => `<span class="chip memo">${icon('memo')} ${esc(m)}</span>`).join('')}</div>` : ''}
    <div class="actions"><button class="vcsw-button lg" type="button" id="b-next">Terug op aarde ${icon('right')}</button></div>`;
  speak(stage.querySelector('.dialog'), line);
  stage.querySelector('#b-next').onclick = () => go('aarde', { passed: S.score / MAX >= PASS });
}

/* Terug op aarde: dark cards, two lists side by side, the report route and the result of the level */
function renderAarde() {
  const pct = Math.round(S.score / MAX * 100);
  const passed = S.passed;
  const n = S.crystals.length;
  const meter = (label, value, fill, cls, note, mark, aria) => `<div class="meter"><p class="m-label">${label}</p><p class="m-value">${value}</p>
      <div class="m-bar ${cls}" role="img" aria-label="${aria}"><span class="m-fill" style="width:${fill}%"></span>${mark ? `<span class="m-mark" style="left:${mark}%"></span>` : ''}</div>
      <p class="m-note">${note}</p></div>`;
  stage.innerHTML = `${steps('aarde')}
    <div class="aarde">
      <div class="head">
        <h2>Wat dit betekent voor je werk bij VCSW</h2>
        <p class="lead">Het station is verzonnen. Dit neem je mee naar je werk.</p>
      </div>
      <div class="two">
        <section class="acard"><h3>Hier gaat het om</h3>${ilist([
          ['user', 'Namen en e-mailadressen van contactpersonen bij klanten'],
          ['file', 'Cv’s van kandidaten'],
          ['clip', 'Adressen, BSN’s en telefoonnummers van werknemers van klanten'],
          ['pulse', 'Verzuim- en gezondheidsgegevens']
        ])}</section>
        <section class="acard"><h3>Dit doe je morgen</h3>${ilist([
          ['lock', 'Vergrendel je laptop met de Windows-toets en L'],
          ['x', 'Deel wachtwoorden nooit via Teams of mail'],
          ['mail', 'Twijfel je, meld het dan meteen']
        ])}</section>
      </div>
      <section class="acard meld">
        <div class="meld-text"><h3>Meldroute</h3><p>Meld twijfel of een mogelijk datalek bij Tarik of Dagmar, of mail naar het meldpunt.</p></div>
        <div class="meld-act"><code id="mailaddr">jz@vcsw.nl</code><button class="vcsw-button outline" type="button" id="b-copy">Kopieer adres ${icon('copy')}</button></div>
        <p class="vcsw-sr-only" id="copy-status" aria-live="polite"></p>
      </section>
      <section class="acard result">
        <div class="result-head"><h3>Resultaat level 1</h3><span class="verdict-badge ${passed ? 'ok' : 'warn'}">${icon(passed ? 'check' : 'half')} ${passed ? 'Gehaald' : 'Nog niet gehaald'}</span></div>
        <p class="result-line">${passed ? 'Je bent bevorderd tot <strong>Vaandrig</strong>. Je kristallen neem je mee naar de volgende modules.' : 'Je hebt minimaal 70 procent nodig. Speel de dienst opnieuw om je rang te halen.'}</p>
        <div class="meters">
          ${meter('Score', `${S.score} van ${MAX} punten`, pct, 'score', `${pct} procent. ${passed ? 'Je had 70 procent nodig.' : 'Je hebt 70 procent nodig.'}`, 70, `Score ${pct} procent, de grens ligt bij 70 procent`)}
          ${meter('Schild', `${S.shield} procent`, S.shield, 'shield', 'Het schild telt niet mee voor halen. Het laat zien hoe zeker je speelde.', 0, `Schild ${S.shield} procent`)}
          ${meter('Kristallen', `${n} van ${CRYSTALS_MAX}`, Math.round(n / CRYSTALS_MAX * 100), 'crystals', 'Elk kristal is één aanwijzing zonder kosten in de luchtsluis.', 0, `${n} van ${CRYSTALS_MAX} kristallen`)}
        </div>
        <div class="actions"><button class="vcsw-button" type="button" id="b-again">Speel level 1 opnieuw ${icon('refresh')}</button></div>
      </section>
    </div>`;
  stage.querySelector('#b-copy').onclick = async e => {
    const btn = e.currentTarget, st = stage.querySelector('#copy-status');
    try { await navigator.clipboard.writeText('jz@vcsw.nl'); btn.innerHTML = `Gekopieerd ${icon('check')}`; st.textContent = 'Het adres jz@vcsw.nl is gekopieerd.'; }
    catch { const r = document.createRange(); r.selectNodeContents(document.getElementById('mailaddr')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = 'Geselecteerd, kopieer met Ctrl+C'; st.textContent = 'Het adres is geselecteerd. Kopieer het met Ctrl+C.'; }
  };
  stage.querySelector('#b-again').onclick = () => { S = fresh(); go('briefing'); };
}

/* ---------- Test jump: ?scherm=<naam> opens the level on one screen, with a plausible state ---------- */
const SCHERMEN = ['start', 'briefing', 'dienst', 'dienst2', 'sorteren', 'dienst4', 'luchtsluis', 'hut', 'hut-einde', 'debriefing', 'aarde', 'aarde-gehaald'];
function jump(name) {
  if (!SCHERMEN.includes(name)) return false;
  S = fresh();
  const best = id => SITS.find(s => s.id === id).opts.findIndex(o => o.v === 'goed');
  const answer = (id, oi) => grade(SITS.find(s => s.id === id), oi);
  const sort = wrong => { CARDS.forEach((c, i) => { S.sort[i] = (i < wrong ? !c[1] : c[1]) ? 'wel' : 'geen'; }); gradeSort(); };
  const upto = (k, all) => {   // answers the first k situations; mixed result unless all is true
    if (k > 0) answer('s1', all ? best('s1') : 0);
    if (k > 1) answer('s2', all ? best('s2') : 2);
    if (k > 2) sort(all ? 0 : 2);
    if (k > 3) answer('s4', best('s4'));
  };
  const hutDone = all => { const H = S.hut; H.started = true; H.found = HUT.filter(h => h.risk).slice(0, all ? 8 : 5).map(h => h.id); H.left = all ? 74 : 0; H.done = all; H.timeout = !all; };
  if (name === 'start') S.screen = 'start';
  else if (name === 'briefing') S.screen = 'briefing';
  else if (name === 'dienst') { S.screen = 'sit'; S.sit = 0; }
  else if (name === 'dienst2') { upto(1); S.screen = 'sit'; S.sit = 1; }
  else if (name === 'sorteren') { upto(2); S.screen = 'sit'; S.sit = 2; }
  else if (name === 'dienst4') { upto(3); S.screen = 'sit'; S.sit = 3; }
  else if (name === 'luchtsluis') { upto(4); S.screen = 'sluis'; }
  else if (name === 'hut') { upto(4); S.hut.started = true; S.screen = 'sluis'; }
  else if (name === 'hut-einde') { upto(4); hutDone(false); S.screen = 'sluis'; }
  else if (name === 'debriefing') { upto(4); hutDone(false); S.screen = 'debrief'; }
  else if (name === 'aarde') { upto(4); hutDone(false); S.screen = 'aarde'; S.passed = S.score / MAX >= PASS; }
  else if (name === 'aarde-gehaald') { upto(4, true); hutDone(true); S.screen = 'aarde'; S.passed = S.score / MAX >= PASS; }
  return true;
}

/* ---------- Boot, keeps progress when the page is updated while open ---------- */
function boot(data) {
  if (data && data.S && data.S.screen) S = data.S;
  let want = null;
  try { want = new URLSearchParams(location.search).get('scherm'); } catch (e) { want = null; }
  if (want) jump(want);
  render();
}
const sb = document.getElementById('start-static'); if (sb) sb.onclick = () => go('briefing');
boot({});
})();
