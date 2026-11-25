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
  undo: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'
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
  { id: 'console', risk: true,  label: 'Console op het bureau', name: 'Ontgrendelde console', cx: 225, cy: 207, r: 52 },
  { id: 'code',    risk: true,  label: 'Briefje op de muur', name: 'Toegangscode op de muur', cx: 157, cy: 138, r: 30 },
  { id: 'lijst',   risk: true,  label: 'Papieren op het bureau', name: 'Uitgeprinte passagierslijst', cx: 360, cy: 238, r: 32 },
  { id: 'medisch', risk: true,  label: 'Tablet op het bed', name: 'Open medisch dossier', cx: 674, cy: 262, r: 32 },
  { id: 'chip',    risk: true,  label: 'Iets op de vloer', name: 'Onbekende datachip', cx: 277, cy: 381, r: 30 },
  { id: 'comm',    risk: true,  label: 'Communicator op de plank', name: 'Communicator met zichtbaar bericht van Kapitein Vega', cx: 674, cy: 172, r: 30 },
  { id: 'kast',    risk: true,  label: 'Archiefkastje', name: 'Sleutelkaart in het archiefkastje', cx: 500, cy: 245, r: 30 },
  { id: 'printer', risk: true,  label: 'Printer', name: 'Folie in de printer', cx: 475, cy: 188, r: 32 },
  { id: 'plant',   risk: false, label: 'Ruimteplant', name: 'Ruimteplant', cx: 735, cy: 165, r: 28 },
  { id: 'mok',     risk: false, label: 'Mok', name: 'Mok', cx: 308, cy: 232, r: 22 },
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
const HINT_COST = 5;                                    // assumption
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
    hut: { started: false, found: [], nope: [], left: SLUIS_SECONDS, clues: 0, free: 3, paid: 0, done: false, timeout: false },
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
  document.getElementById('hud-crystals').textContent = `${S.crystals.length} van 3`;
}

const STEPS = [['briefing', 'Briefing'], ['dienst', 'Dienst'], ['sluis', 'Luchtsluis'], ['debrief', 'Debriefing'], ['aarde', 'Terug op aarde']];
function steps(cur) {
  const idx = STEPS.findIndex(s => s[0] === cur);
  return `<ol class="steps" aria-label="Opbouw van het level">${STEPS.map((s, i) => `<li class="${i < idx ? 'done' : ''}"${i === idx ? ' aria-current="step"' : ''}><span class="dot" aria-hidden="true"></span>${s[1]}</li>`).join('')}</ol>`;
}

/* ---------- Screens ---------- */
function render() {
  if (timer && S.screen !== 'sluis') { clearInterval(timer); timer = null; }
  stage.classList.toggle('earth', S.screen === 'aarde');
  hud();
  ({ start: renderStart, briefing: renderBriefing, sit: renderSit, sluis: renderSluis, debrief: renderDebrief, aarde: renderAarde })[S.screen]();
}
function go(screen, extra = {}) { Object.assign(S, extra, { screen }); render(); stage.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); const h = stage.querySelector('h2, h1'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }

function renderStart() {
  stage.innerHTML = `<div class="title-screen">
    <div>
      <p class="ov">Datawacht · Level 1</p>
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
  stage.innerHTML = `${steps('briefing')}
    <div><p class="ov">Missie</p><h2>Aankomst op het station</h2></div>
    ${dialog('ARIA')}
    <p class="uitleg">Leerdoel: je herkent wat persoonsgegevens zijn en je houdt je werkplek veilig.</p>
    <div class="actions"><button class="vcsw-button lg" type="button" id="b-next">Begin je dienst ${icon('right')}</button></div>`;
  speak(stage.querySelector('.dialog'), BRIEFING);
  stage.querySelector('#b-next').onclick = () => go('sit', { sit: 0 });
}

function renderSit() {
  const sit = SITS[S.sit];
  const head = `${steps('dienst')}<div><p class="ov">Dienst · situatie ${S.sit + 1} van ${SITS.length}</p><h2>${sit.title}</h2></div>`;
  if (sit.type === 'sort') return renderSort(sit, head);
  const order = S.optOrder[sit.id];
  stage.innerHTML = `${head}${dialog(sit.speaker)}
    <div class="options" role="group" aria-label="Kies je antwoord">
      ${order.map((oi, k) => `<button class="opt" type="button" data-oi="${oi}"><span class="key" aria-hidden="true">${'ABC'[k]}</span><span class="txt">${esc(sit.opts[oi].t)}</span><span class="verdict"></span></button>`).join('')}
    </div>
    <div class="feedback" hidden></div>`;
  const done = S.results[sit.id];
  speak(stage.querySelector('.dialog'), sit.text);
  stage.querySelectorAll('.opt').forEach(b => b.onclick = () => choose(sit, +b.dataset.oi));
  if (done) showFeedback(sit, done.oi, false);
}

function choose(sit, oi) {
  if (S.results[sit.id]) return;
  const o = sit.opts[oi];
  S.results[sit.id] = { v: o.v, points: POINTS[o.v], oi };
  S.score += POINTS[o.v];
  S.shield = Math.max(0, S.shield - SHIELD_LOSS[o.v]);
  if (o.crystal && !S.crystals.includes(o.crystal)) S.crystals.push(o.crystal);
  if (o.memo) S.memos.push(o.memo);
  hud();
  showFeedback(sit, oi, true);
}

function showFeedback(sit, oi, animate) {
  const o = sit.opts[oi];
  const best = sit.opts.findIndex(x => x.v === 'goed');
  stage.querySelectorAll('.opt').forEach(b => {
    const i = +b.dataset.oi; b.disabled = true;
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
    let body = `<span>${esc(txt)}</span>`;
    if (S.sortChecked) {
      const ok = (where === 'wel') === isPd;
      el.classList.add(ok ? 'ok' : 'nok');
      body += `<span class="row ${ok ? 'v-goed' : 'v-fout'}">${icon(ok ? 'check' : 'x')} <strong>${ok ? 'Goed' : 'Fout'}</strong></span><span class="why">${esc(why)}</span>`;
    } else if (!where) {
      body += `<span class="row"><button class="vcsw-button outline sm" type="button" data-to="wel" aria-label="${esc(txt)}: wel persoonsgegeven">Wel</button><button class="vcsw-button outline sm" type="button" data-to="geen" aria-label="${esc(txt)}: geen persoonsgegeven">Geen</button></span>`;
    } else {
      body += `<span class="row"><button class="vcsw-button ghost sm" type="button" data-to="" aria-label="${esc(txt)} terugleggen">${icon('undo')} Terugleggen</button></span>`;
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
function checkSort() {
  const good = CARDS.filter((c, i) => (S.sort[i] === 'wel') === c[1]).length;
  const v = good >= 10 ? 'goed' : good >= 7 ? 'half' : 'fout';   // assumption: 10+ goed, 7 to 9 half goed
  S.sortChecked = true;
  S.results.s3 = { v, points: POINTS[v], good };
  S.score += POINTS[v];
  S.shield = Math.max(0, S.shield - SHIELD_LOSS[v]);
  if (good >= 10 && !S.crystals.includes('Herleidbaar = persoonsgegeven')) S.crystals.push('Herleidbaar = persoonsgegeven');
  hud(); drawSort(); sortFeedback();
}
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
  return `<svg class="hut" viewBox="0 0 800 460" role="group" aria-label="Je hut. Zoek de acht risico's.">
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

function renderSluis() {
  const H = S.hut;
  const doorSvg = `<svg class="door" viewBox="0 0 180 120" aria-hidden="true"><rect x="2" y="2" width="176" height="116" rx="14" fill="var(--vcsw-blue-950)" stroke="var(--vcsw-blue-300)" stroke-width="2"/><rect x="30" y="16" width="120" height="88" rx="6" fill="var(--vcsw-blue-200)"/><g class="l"><rect x="30" y="16" width="60" height="88" fill="var(--vcsw-blue-700)" stroke="var(--vcsw-blue-300)" stroke-width="2"/></g><g class="r"><rect x="90" y="16" width="60" height="88" fill="var(--vcsw-blue-700)" stroke="var(--vcsw-blue-300)" stroke-width="2"/></g></svg>`;
  if (!H.started) {
    stage.innerHTML = `${steps('sluis')}<div><p class="ov">Luchtsluis</p><h2>Hutinspectie</h2></div>${dialog('ARIA')}
      <div class="chips"><span class="chip">${icon('clock')} 3 minuten</span><span class="chip">${icon('gem')} ${S.crystals.length} aanwijzing${S.crystals.length === 1 ? '' : 'en'} uit je kristallen</span><span class="chip">${icon('bulb')} 3 gratis hints</span></div>
      <div class="actions"><button class="vcsw-button lg" type="button" id="b-go">Start de inspectie ${icon('right')}</button></div>`;
    speak(stage.querySelector('.dialog'), 'Dienst voorbij. Ik scan nu je hut. Klik alle risico’s aan die je ziet. Elk gevonden risico licht een cijfer van de sluiscode op. Je hebt drie minuten.');
    stage.querySelector('#b-go').onclick = () => { H.started = true; render(); };
    return;
  }
  stage.innerHTML = `${steps('sluis')}
    <div class="sluis-bar">
      <div class="timer" role="timer" aria-label="Resterende tijd">${icon('clock', '')}<span id="t">${fmt(H.left)}</span></div>
      <div><p class="ov" style="margin-bottom:6px">Sluiscode</p><div class="code" id="code" aria-label="Sluiscode, ${H.found.length} van 8 cijfers gevonden">${[...CODE].map((d, i) => `<span class="${i < H.found.length ? 'lit' : ''}">${i < H.found.length ? d : '·'}</span>`).join('')}</div></div>
      <div class="actions"><button class="vcsw-button outline" type="button" id="b-hint"></button></div>
    </div>
    <div class="hut-wrap">${hutSvg()}</div>
    <p class="status" id="hut-status" aria-live="polite"></p>
    <div class="feedback" id="hut-end" hidden></div>`;
  stage.querySelectorAll('.hut .hot').forEach(g => {
    const id = g.dataset.id;
    if (H.found.includes(id)) g.classList.add('found');
    if (H.nope.includes(id)) g.classList.add('nope');
    const act = () => clickHut(id, g);
    g.addEventListener('click', act);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  });
  stage.querySelector('#b-hint').onclick = useHint;
  hintLabel();
  if (H.done || H.timeout) endSluis(false, doorSvg);
  else if (!timer) timer = setInterval(tick, 1000);
  stage._door = doorSvg;
}
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
function tick() {
  const H = S.hut; if (H.done || H.timeout) return;
  H.left = Math.max(0, H.left - 1);
  const t = stage.querySelector('#t'); if (t) { t.textContent = fmt(H.left); t.parentElement.classList.toggle('low', H.left <= 30); }
  if (H.left === 60 || H.left === 30) say(`Nog ${H.left === 60 ? 'één minuut' : 'dertig seconden'}.`);
  if (H.left === 0) { H.timeout = true; clearInterval(timer); timer = null; endSluis(true, stage._door); }
}
const say = t => { const s = stage.querySelector('#hut-status'); if (s) s.textContent = t; };
function clickHut(id, g) {
  const H = S.hut; if (H.done || H.timeout) return;
  const h = HUT.find(x => x.id === id);
  if (H.found.includes(id)) return;
  if (h.risk) {
    H.found.push(id); g.classList.add('found'); g.classList.remove('hint');
    const code = stage.querySelector('#code');
    const sp = code.children[H.found.length - 1]; sp.textContent = CODE[H.found.length - 1]; sp.classList.add('lit');
    code.setAttribute('aria-label', `Sluiscode, ${H.found.length} van 8 cijfers gevonden`);
    say(`Risico gevonden: ${h.name}. Cijfer ${H.found.length} van de sluiscode licht op.`);
    if (H.found.length === 8) { H.done = true; clearInterval(timer); timer = null; endSluis(true, stage._door); }
    hintLabel();
  } else {
    if (!H.nope.includes(id)) H.nope.push(id);
    g.classList.add('nope');
    say(`${h.name}: geen risico.`);
  }
}
function nextHintKind() { const H = S.hut; return H.clues < S.crystals.length ? 'kristal' : H.free > 0 ? 'gratis' : 'betaald'; }
function hintLabel() {
  const b = stage.querySelector('#b-hint'); if (!b) return;
  const H = S.hut, k = nextHintKind();
  b.innerHTML = k === 'kristal' ? `${icon('gem')} Aanwijzing uit kristal (${S.crystals.length - H.clues})` : k === 'gratis' ? `${icon('bulb')} Hint (${H.free} gratis)` : `${icon('bulb')} Extra hint (−${HINT_COST}% schild)`;
  b.disabled = H.done || H.timeout || H.found.length === 8;
}
function useHint() {
  const H = S.hut;
  const left = HUT.filter(h => h.risk && !H.found.includes(h.id));
  if (!left.length) return;
  const k = nextHintKind();
  if (k === 'kristal') H.clues++; else if (k === 'gratis') H.free--; else { H.paid++; S.shield = Math.max(0, S.shield - HINT_COST); hud(); }
  const pick = left[Math.floor(Math.random() * left.length)];
  const g = stage.querySelector(`.hot[data-id="${pick.id}"]`);
  g.classList.add('hint');
  setTimeout(() => g.classList.remove('hint'), 3000);
  say(`ARIA markeert een plek: kijk bij ${pick.label.toLowerCase()}.`);
  hintLabel();
}
function endSluis(animate, doorSvg) {
  const H = S.hut;
  hintLabel();
  const missed = HUT.filter(h => h.risk && !H.found.includes(h.id));
  missed.forEach(h => stage.querySelector(`.hot[data-id="${h.id}"]`).classList.add('missed'));
  if (H.found.length === 8) stage.querySelector('#code').classList.add('complete');
  const end = stage.querySelector('#hut-end');
  end.innerHTML = `<div class="actions" style="align-items:center;gap:20px">${doorSvg}
      <div style="flex:1;min-width:220px;display:grid;gap:8px">
        <h3>${H.found.length === 8 ? 'Sluiscode compleet. De luchtsluis gaat open.' : 'De tijd is om. ARIA opent de sluis handmatig.'}</h3>
        <p>Je vond ${H.found.length} van de 8 risico’s${H.paid ? ` en gebruikte ${H.paid} extra hint${H.paid === 1 ? '' : 's'}` : ''}.</p>
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
  stage.innerHTML = `${steps('debrief')}<div><p class="ov">Debriefing</p><h2>Wat ARIA je meegeeft</h2></div>
    ${dialog('ARIA')}
    <ol class="rules">${RULES.map(r => `<li>${esc(r)}</li>`).join('')}</ol>
    <div><h3 style="margin-bottom:10px">Jouw dienst</h3><div class="recap">${recap}<div><span>Hutinspectie</span><span>${S.hut.found.length} van 8 risico’s gevonden</span></div></div></div>
    ${S.memos.length ? `<div class="chips">${S.memos.map(m => `<span class="chip memo">${icon('memo')} ${esc(m)}</span>`).join('')}</div>` : ''}
    <div class="actions"><button class="vcsw-button lg" type="button" id="b-next">Terug op aarde ${icon('right')}</button></div>`;
  speak(stage.querySelector('.dialog'), line);
  stage.querySelector('#b-next').onclick = () => go('aarde', { passed: S.score / MAX >= PASS });
}

function renderAarde() {
  const pct = Math.round(S.score / MAX * 100);
  const passed = S.passed;
  stage.innerHTML = `${steps('aarde')}
    <div class="earth-grid">
      <div class="earth" style="display:grid;gap:16px">
        <div><p class="ov">Terug op aarde</p><h2>Wat dit betekent voor je werk bij VCSW</h2></div>
        <p>Op je werk gaat het om namen en e-mailadressen van contactpersonen bij klanten, cv's van kandidaten, adressen, BSN’s en telefoonnummers van werknemers van klanten, en verzuim- en gezondheidsgegevens.</p>
        <p>Vergrendel je laptop met Windows-toets en L, deel wachtwoorden nooit via Teams of mail en meld twijfel bij Tarik, Dagmar of via jz@vcsw.nl.</p>
        <div class="vcsw-card basic" style="display:grid;gap:8px">
          <h3>Meldroute</h3>
          <p>Meld twijfel of een mogelijk datalek bij Tarik of Dagmar, of mail naar</p>
          <span class="mail"><code id="mailaddr">jz@vcsw.nl</code><button class="vcsw-button outline sm" type="button" id="b-copy">${icon('copy')} Kopieer adres</button></span>
        </div>
      </div>
      <div class="vcsw-card" style="display:grid;gap:16px">
        <div class="result-head"><h3>Resultaat level 1</h3><span class="vcsw-badge ${passed ? 'success' : 'warning'}">${passed ? 'Gehaald' : 'Niet gehaald'}</span></div>
        <div class="vcsw-stats">
          <div class="vcsw-stat"><span class="vcsw-stat-label">Score dienst</span><span class="vcsw-stat-value">${pct}%</span><span class="vcsw-stat-note">${S.score} van ${MAX} punten</span></div>
          <div class="vcsw-stat"><span class="vcsw-stat-label">Schildsterkte</span><span class="vcsw-stat-value">${S.shield}%</span><span class="vcsw-stat-note">${S.crystals.length} van 3 kristallen</span></div>
        </div>
        <p>${passed ? 'Je bent bevorderd tot <strong>Vaandrig</strong>. Je kristallen neem je mee naar de volgende modules.' : 'Je hebt minimaal 70 procent nodig. Speel de dienst opnieuw om je rang te halen.'}</p>
        <div class="actions">${passed ? `<button class="vcsw-button outline" type="button" id="b-again">${icon('refresh')} Level opnieuw spelen</button>` : `<button class="vcsw-button" type="button" id="b-retry">${icon('refresh')} Speel de dienst opnieuw</button>`}</div>
      </div>
    </div>`;
  stage.querySelector('#b-copy').onclick = async e => {
    const btn = e.currentTarget;
    try { await navigator.clipboard.writeText('jz@vcsw.nl'); btn.innerHTML = `${icon('check')} Gekopieerd`; }
    catch { const r = document.createRange(); r.selectNodeContents(document.getElementById('mailaddr')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = 'Geselecteerd, kopieer met Ctrl+C'; }
  };
  const again = stage.querySelector('#b-again'); if (again) again.onclick = () => { S = fresh(); go('briefing'); };
  const retry = stage.querySelector('#b-retry'); if (retry) retry.onclick = () => { S = fresh(); go('sit', { sit: 0 }); };
}

/* ---------- Boot, keeps progress when the page is updated while open ---------- */
function boot(data) {
  if (data && data.S && data.S.screen) S = data.S;
  render();
}
const sb = document.getElementById('start-static'); if (sb) sb.onclick = () => go('briefing');
boot({});
})();
