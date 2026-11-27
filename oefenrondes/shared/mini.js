/* Ruimtestation Orion, oefenrondes: gedeelde motor van de minigames.
   Kopie uit de proefhal (proefhal/shared/mini.js). Aangepast voor het spel: de titel eindigt op
   "Ruimtestation Orion" en de terugknop volgt window.MINI_BACK en window.MINI_BACK_LABEL, die
   orion-oefen.js zet. In het losse bestand (iframe met srcdoc) leest hij de adresparameters uit
   window.ORION_PARAMS. Verder gelijk aan de proefhal.
   Eén script, geen afhankelijkheden. Elk spel roept Mini.game({...}) aan en tekent zijn eigen
   speelveld in G.stage. De motor regelt de statusbalk, ARIA, oordelen, de uitslag, geluid,
   Tijdsdruk en de berichten naar de Orion-shell (postMessage, zelfde formaat als orion-bridge.js). */
(function () {
  "use strict";

  /* ---------- Iconen (Lucide, ISC) ---------- */
  const P = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    half: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    vol: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    mute: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    pen: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    clip: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    cross: '<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11"/>',
    move: '<path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    msg: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'
  };
  const icon = (n, cls) => `<svg class="i${cls ? " " + cls : ""}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ""}</svg>`;

  /* ---------- Portretten: vlak en geometrisch, merkblauw, lijn 2 ---------- */
  const FACES = {
    ARIA: `<svg viewBox="0 0 120 120"><rect width="120" height="120" fill="#06224c"/><rect x="12" y="14" width="96" height="88" rx="22" fill="#0c2f5f" stroke="#67caff" stroke-width="2.5"/><circle cx="60" cy="58" r="30" fill="#020f26" stroke="#15aaff" stroke-width="5"/><circle cx="60" cy="58" r="18" fill="#0a6dbe"/><circle class="pupil" cx="60" cy="58" r="9" fill="#a1deff"/><circle cx="54" cy="52" r="3" fill="#eaf8ff"/><rect x="36" y="94" width="48" height="4" rx="2" fill="#15aaff"/></svg>`,
    Bram: person({ skin: "#e8c2a0", hair: "#5b3a1e", hairStyle: "short", suit: "#0a6dbe", accent: "#ffb900", cap: true }),
    Vega: person({ skin: "#c98d63", hair: "#1d1a19", hairStyle: "bun", suit: "#13559b", accent: "#ffd230", stripes: 3 }),
    Mira: person({ skin: "#f1d0b5", hair: "#b0532c", hairStyle: "long", suit: "#008be5", accent: "#a1deff" }),
    Sanne: person({ skin: "#8d5a3b", hair: "#1b120c", hairStyle: "curly", suit: "#0c2f5f", accent: "#67caff" }),
    Noor: person({ skin: "#f3d4bf", hair: "#d9b26a", hairStyle: "bob", suit: "#0a6dbe", accent: "#7bf1a8" }),
    Dokter: person({ skin: "#d7a782", hair: "#9aa6b6", hairStyle: "short", suit: "#e2e8f0", accent: "#05df72", glasses: true }),
    Onbekend: `<svg viewBox="0 0 120 120"><rect width="120" height="120" fill="#0f172b"/><circle cx="60" cy="50" r="22" fill="#314158"/><path d="M22 120c4-26 20-38 38-38s34 12 38 38z" fill="#314158"/><text x="60" y="58" text-anchor="middle" font-family="Figtree,Inter,sans-serif" font-weight="800" font-size="26" fill="#90a1b9">?</text></svg>`
  };
  function person(o) {
    const hair = {
      short: `<path d="M34 46c0-16 12-26 26-26s26 10 26 26c-4-6-10-9-18-10-8 4-22 6-34 10z" fill="${o.hair}"/>`,
      long: `<path d="M30 92c-4-22-2-56 30-60 32 4 34 38 30 60l-8-2c2-18 0-30-6-36-12 4-24 4-34 0-6 8-8 20-6 38z" fill="${o.hair}"/>`,
      bun: `<circle cx="60" cy="20" r="11" fill="${o.hair}"/><path d="M34 48c0-18 12-26 26-26s26 8 26 26c-8-8-18-10-26-10s-18 2-26 10z" fill="${o.hair}"/>`,
      curly: `<g fill="${o.hair}"><circle cx="40" cy="38" r="11"/><circle cx="52" cy="28" r="12"/><circle cx="68" cy="28" r="12"/><circle cx="80" cy="38" r="11"/><circle cx="36" cy="52" r="8"/><circle cx="84" cy="52" r="8"/></g>`,
      bob: `<path d="M32 70c-4-30 6-48 28-48s32 18 28 48h-8c0-14-2-22-6-26-10 4-20 4-30 0-4 4-6 12-6 26z" fill="${o.hair}"/>`
    }[o.hairStyle] || "";
    const stripes = o.stripes ? Array.from({ length: o.stripes }, (_, i) => `<rect x="${72 + i * 7}" y="98" width="4" height="10" rx="1" fill="${o.accent}"/>`).join("") : "";
    return `<svg viewBox="0 0 120 120"><rect width="120" height="120" fill="#06224c"/><circle cx="60" cy="60" r="50" fill="#0c2f5f"/>
      <path d="M18 120c3-24 20-36 42-36s39 12 42 36z" fill="${o.suit}"/><path d="M48 86l12 12 12-12" fill="none" stroke="${o.accent}" stroke-width="3"/>${stripes}
      <rect x="52" y="70" width="16" height="18" rx="6" fill="${o.skin}"/>
      <ellipse cx="60" cy="54" rx="24" ry="27" fill="${o.skin}"/>${hair}
      <circle cx="51" cy="57" r="3" fill="#0f172b"/><circle cx="69" cy="57" r="3" fill="#0f172b"/>
      ${o.glasses ? `<g fill="none" stroke="#0f172b" stroke-width="2"><circle cx="51" cy="57" r="7"/><circle cx="69" cy="57" r="7"/><path d="M58 57h4"/></g>` : ""}
      <path d="M53 68q7 5 14 0" fill="none" stroke="#7a3b2b" stroke-width="2.5" stroke-linecap="round"/>
      ${o.cap ? `<path d="M34 40c4-14 14-20 26-20s22 6 26 20z" fill="#0a6dbe"/><rect x="30" y="38" width="60" height="6" rx="3" fill="#13559b"/>` : ""}</svg>`;
  }
  const ROLE = { ARIA: "boordcomputer", Bram: "technicus", Vega: "kapitein", Mira: "crewadministratie", Sanne: "nieuw crewlid", Noor: "Datawacht", Dokter: "scheepsarts", Onbekend: "onbekende beller" };
  const NAME = { Vega: "Kapitein Vega", Mira: "Luitenant Mira", Dokter: "Dokter Okafor" };

  /* Een generator voor crewleden in een menigte: zelfde stijl, andere kenmerken. */
  function crewFace(seed, opts) {
    const r = rng(seed);
    const skins = ["#f3d4bf", "#e8c2a0", "#d7a782", "#c98d63", "#a46a45", "#8d5a3b", "#6b4429"];
    const hairs = ["#1b120c", "#3b2414", "#5b3a1e", "#8a5a2b", "#b0532c", "#d9b26a", "#9aa6b6", "#e2e8f0"];
    const suits = ["#0a6dbe", "#13559b", "#008be5", "#0c2f5f", "#113e78"];
    const styles = ["short", "long", "bun", "curly", "bob"];
    const o = Object.assign({ skin: skins[r() * skins.length | 0], hair: hairs[r() * hairs.length | 0], hairStyle: styles[r() * styles.length | 0], suit: suits[r() * suits.length | 0], accent: ["#ffb900", "#67caff", "#7bf1a8", "#a1deff"][r() * 4 | 0], glasses: r() < .25 }, opts || {});
    return person(o);
  }
  function rng(seed) { let s = (typeof seed === "number" ? seed : hash(String(seed))) >>> 0 || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909), s ^= s >>> 16) >>> 0) / 4294967296; }
  function hash(t) { let h = 2166136261; for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619); return h; }

  /* ---------- Geluid: kort en zacht, alleen in code, standaard uit ---------- */
  const store = { get(k, d) { try { const v = localStorage.getItem("proefhal-" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem("proefhal-" + k, JSON.stringify(v)); } catch (e) {} } };
  let ac = null;
  const sound = {
    on: store.get("sound", false),
    tone(f, t0, dur, type, vol, slide) {
      if (!this.on) return;
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        const o = ac.createOscillator(), g = ac.createGain(), now = ac.currentTime + t0;
        o.type = type || "sine"; o.frequency.setValueAtTime(f, now); if (slide) o.frequency.exponentialRampToValueAtTime(slide, now + dur);
        g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(vol || 0.06, now + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        o.connect(g).connect(ac.destination); o.start(now); o.stop(now + dur + 0.02);
      } catch (e) {}
    },
    play(k) {
      const T = this.tone.bind(this);
      if (k === "ok") { T(660, 0, .12, "triangle", .05); T(990, .08, .18, "triangle", .05); }
      else if (k === "half") { T(520, 0, .14, "triangle", .045); T(560, .1, .16, "triangle", .04); }
      else if (k === "bad") { T(180, 0, .22, "sawtooth", .03, 120); }
      else if (k === "tap") { T(1200, 0, .04, "sine", .025); }
      else if (k === "open") { T(300, 0, .25, "sine", .04, 520); }
      else if (k === "close") { T(500, 0, .2, "sine", .04, 260); }
      else if (k === "gem") { [880, 1175, 1568].forEach((f, i) => T(f, i * .07, .16, "triangle", .04)); }
      else if (k === "win") { [523, 659, 784, 1047].forEach((f, i) => T(f, i * .1, .26, "triangle", .05)); }
      else if (k === "alarm") { T(740, 0, .18, "square", .025); T(560, .2, .18, "square", .025); }
      else if (k === "ring") { [0, .25].forEach((t) => { T(1320, t, .12, "sine", .03); T(1660, t + .04, .12, "sine", .025); }); }
    }
  };

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Focusring alleen als je met het toetsenbord werkt. Een knop die het spel zelf focust, of een klik met de muis,
     mag er niet uitzien alsof hij al gekozen is. */
  (function () {
    const de = document.documentElement, keys = /^(Tab|Arrow|Enter$| $|Home$|End$|Page)/;
    addEventListener("keydown", (e) => { if (!e.altKey && !e.ctrlKey && !e.metaKey && keys.test(e.key)) de.classList.add("kbd"); }, true);
    addEventListener("pointerdown", () => de.classList.remove("kbd"), true);
  })();
  const params = new URLSearchParams(window.ORION_PARAMS || location.search);
  const embedded = window.parent !== window;
  if (params.get("shell") === "orion") document.documentElement.classList.add("in-shell");
  function post(msg) { if (!embedded) return; try { window.parent.postMessage(msg, "*"); } catch (e) {} }
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 60) : ms));
  const shuffle = (a, seed) => { const r = seed === undefined ? Math.random : rng(seed); a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = r() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- Het spel ---------- */
  function game(cfg) {
    const G = {
      cfg, max: cfg.max || 100, score: 0, shield: 100, gems: 0, combo: 0, best: 0, hints: 0, log: [],
      step: 0, finished: false, started: false, t0: 0, timerLeft: 0, timerId: null, calm: !store.get("pressure", false)
    };
    document.title = cfg.title + " · Ruimtestation Orion";
    const steps = cfg.steps || ["Briefing", "Opdracht", "Debriefing"];
    const back = cfg.back || window.MINI_BACK || "../../index.html", backLabel = window.MINI_BACK_LABEL || "Proefhal";
    const root = h(`<div class="mg">
      <header class="mg-top">
        <a class="mg-brand" href="${back}" title="${esc(backLabel)}"><span class="mark"><b>VCSW</b><i></i><i></i><i></i></span><span class="sep"></span><span class="mg-crumb">Ruimtestation Orion · <b>${esc(cfg.title)}</b></span></a>
        <span class="grow"></span>
        <button class="tbtn" type="button" data-pressure aria-pressed="${!G.calm}">${icon("clock", "sm")}<span>Tijdsdruk ${G.calm ? "uit" : "aan"}</span></button>
        <button class="tbtn" type="button" data-sound aria-pressed="${sound.on}">${icon(sound.on ? "vol" : "mute", "sm")}<span>Geluid ${sound.on ? "aan" : "uit"}</span></button>
        <a class="tbtn" href="${back}">${icon("grid", "sm")}<span>${esc(backLabel)}</span></a>
      </header>
      <div class="mg-body">
        <section class="mg-status" aria-label="Status van je missie">
          <div class="mg-meters">
            <div class="meter mg-stepbox"><div class="row">${icon("flag", "sm")}<span data-stepname>${esc(steps[0])}</span><span class="combo" aria-live="polite"></span></div><div class="mg-steps">${steps.map((s, i) => `<div class="${i === 0 ? "now" : ""}" title="${esc(s)}"></div>`).join("")}</div></div>
            <div class="meter"><div class="row">${icon("target", "sm")}Score<span class="v" data-score>0 <small>van ${G.max}</small></span></div><div class="bar"><i data-scorebar style="width:0"></i><span class="mark" style="left:70%" title="Grens: 70 procent"></span></div></div>
            <div class="meter"><div class="row">${icon("shield", "sm")}Schild<span class="v" data-shield>100%</span></div><div class="bar shield"><i data-shieldbar style="width:100%"></i></div></div>
            <div class="meter"><div class="row">${icon("gem", "sm")}Kristallen<span class="v" data-gems>0 <small>van 3</small></span></div><div class="gems"><i></i><i></i><i></i></div></div>
          </div>
        </section>
        <section class="mg-panel">
          <div class="mg-head" data-head hidden><h2 data-title></h2><span data-chips></span><span class="grow"></span><span class="clock" data-clock hidden>${icon("clock")}<span>0:00</span></span></div>
          <div id="stage"></div>
        </section>
      </div>
    </div>`);
    $(".mg-stepbox", root).insertAdjacentHTML("beforeend", '<div class="verdict" role="status" aria-live="polite"></div>');
    document.body.prepend(root);
    G.root = root; G.stage = $("#stage", root);
    const head = $("[data-head]", root), clockEl = $("[data-clock]", root);

    $("[data-sound]", root).addEventListener("click", (e) => {
      sound.on = !sound.on; store.set("sound", sound.on);
      e.currentTarget.setAttribute("aria-pressed", sound.on); e.currentTarget.innerHTML = `${icon(sound.on ? "vol" : "mute", "sm")}<span>Geluid ${sound.on ? "aan" : "uit"}</span>`;
      sound.play("tap");
    });
    $("[data-pressure]", root).addEventListener("click", (e) => {
      G.calm = !G.calm; store.set("pressure", !G.calm);
      e.currentTarget.setAttribute("aria-pressed", !G.calm); e.currentTarget.innerHTML = `${icon("clock", "sm")}<span>Tijdsdruk ${G.calm ? "uit" : "aan"}</span>`;
      if (G.started && !G.finished && cfg.timer) { if (G.calm) stopClock(); else startClock(); }
    });

    function paint() {
      $("[data-score]", root).innerHTML = `${Math.round(G.score)} <small>van ${G.max}</small>`;
      $("[data-scorebar]", root).style.width = Math.max(0, Math.min(100, G.score / G.max * 100)) + "%";
      $("[data-shield]", root).textContent = Math.round(G.shield) + "%";
      const sb = $("[data-shieldbar]", root); sb.style.width = G.shield + "%"; sb.parentElement.classList.toggle("low", G.shield < 50);
      $("[data-gems]", root).innerHTML = `${G.gems} <small>van 3</small>`;
      $$(".gems i", root).forEach((g, i) => g.classList.toggle("on", i < G.gems));
      const c = $(".combo", root); c.classList.toggle("on", G.combo >= 2); c.textContent = G.combo >= 2 ? "Reeks ×" + G.combo : "";
    }
    G.setStep = (i) => { G.step = i; $$(".mg-steps div", root).forEach((d, k) => { d.className = k < i ? "done" : k === i ? "now" : ""; }); $("[data-stepname]", root).textContent = steps[i] || ""; };
    G.head = (title, chips) => { head.hidden = false; $("[data-title]", root).textContent = title; G.chips(chips || ""); };
    G.chips = (html) => { $("[data-chips]", root).innerHTML = html; };
    G.hideHead = () => { head.hidden = true; };

    /* Een beslissing van de speler. result: goed, half of fout. points: wat het oplevert. */
    G.record = (o) => {
      const r = o.result || "goed", pts = o.points != null ? o.points : 0;
      G.score = Math.max(0, G.score + pts);
      if (r === "goed") { G.combo++; G.best = Math.max(G.best, G.combo); } else G.combo = 0;
      if (o.shield) G.damage(o.shield);
      G.log.push({ result: r, q: o.q || "", a: o.a || "", why: o.why || "", points: pts });
      sound.play(r === "goed" ? "ok" : r === "half" ? "half" : "bad");
      if (o.toast !== false) G.verdict(r, o.title || (r === "goed" ? "Goed" : r === "half" ? "Half goed" : "Niet goed"), o.short || o.why || "", pts);
      post({ orion: "answer", result: r, q: o.q, a: o.a, why: r === "goed" ? undefined : o.why, game: cfg.id });
      paint();
      return r;
    };
    G.damage = (n) => { G.shield = Math.max(0, G.shield - n); paint(); };
    G.gem = (why) => { if (G.gems >= 3) return; G.gems++; sound.play("gem"); paint(); if (why) G.verdict("goed", "Kristal verdiend", why, null); };
    G.addScore = (n) => { G.score = Math.max(0, G.score + n); paint(); };
    let vt = null;
    G.verdict = (r, title, text, pts) => {
      const v = $(".verdict", root);
      v.className = "verdict " + r;
      v.innerHTML = `<span class="dot">${icon(r === "goed" ? "check" : r === "half" ? "half" : "x", "sm")}</span><b>${esc(title)}</b>${pts != null && pts !== 0 ? `<span class="pts">${pts > 0 ? "+" : ""}${pts}</span>` : ""}<span class="sr">${esc(text || "")}</span>`;
      v.classList.remove("on"); void v.offsetWidth;
      requestAnimationFrame(() => v.classList.add("on"));
      clearTimeout(vt); vt = setTimeout(() => v.classList.remove("on"), 2600);
    };

    /* ARIA of een crewlid praat. Een element met .say; mood: ok, bad, half of leeg. */
    G.sayHTML = (who, text, o) => {
      o = o || {};
      const name = NAME[who] || who, face = FACES[who] || FACES.ARIA;
      return `<div class="say ${o.mood || ""}"><div class="face">${face}</div><div class="grow"><div class="who">${esc(name)}<span>${esc(o.role || ROLE[who] || "")}</span></div><div class="txt">${o.html ? text : esc(text)}</div></div>${o.side ? `<div class="side">${o.side}</div>` : ""}</div>`;
    };
    G.say = (el, who, text, o) => { const n = h(G.sayHTML(who, text, o)); n.classList.add("fade-in"); el.replaceWith ? (el.innerHTML = "", el.appendChild(n)) : 0; return n; };

    /* Aanwijzing: de eerste is gratis, daarna kost elke 10 procent schild. */
    G.hint = () => { G.hints++; const cost = G.hints > 1 ? 10 : 0; if (cost) G.damage(cost); return cost; };
    G.hintLabel = () => G.hints >= 1 ? "De volgende kost 10 procent schild" : "De eerste is gratis";

    function fmt(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
    function startClock() {
      if (!cfg.timer || G.calm) { clockEl.hidden = true; return; }
      clockEl.hidden = false; stopClock();
      let last = performance.now();
      G.timerId = setInterval(() => {
        const now = performance.now(); G.timerLeft -= (now - last) / 1000; last = now;
        clockEl.lastElementChild.textContent = fmt(G.timerLeft); clockEl.classList.toggle("low", G.timerLeft < 30);
        if (G.timerLeft <= 0) { stopClock(); if (cfg.onTimeout) cfg.onTimeout(); }
      }, 250);
      clockEl.lastElementChild.textContent = fmt(G.timerLeft);
    }
    function stopClock() { clearInterval(G.timerId); G.timerId = null; }
    G.stopClock = stopClock;

    /* Briefing. Het spel geeft een illustratie (svg of element), regels en wie praat. */
    G.intro = (o) => {
      G.setStep(0); G.hideHead(); G.stage.innerHTML = "";
      const n = h(`<div class="intro fade-in">
        <div class="art" data-art></div>
        <div>
          <div class="topic">${esc(cfg.topic)} · ${esc(cfg.module || "")}</div>
          <h1>${esc(cfg.title)}</h1>
          <p class="lead">${esc(o.lead)}</p>
          ${G.sayHTML(o.who || "ARIA", o.line)}
          <ul class="rules">${o.rules.map((r) => `<li>${icon(r[0])}<span>${r[1]}</span></li>`).join("")}</ul>
          <div class="actions"><button class="btn lg" type="button" data-go>${esc(o.start || "Start de opdracht")}${icon("arrow")}</button><span class="hint-note">${esc(o.note || "Ongeveer 4 minuten")}</span></div>
        </div></div>`);
      const art = $("[data-art]", n);
      if (typeof o.art === "string") art.innerHTML = o.art; else if (o.art) art.appendChild(o.art);
      G.stage.appendChild(n);
      $("[data-go]", n).addEventListener("click", () => G.begin());
      if (o.onShow) o.onShow(art);
    };
    G.begin = () => {
      G.started = true; G.t0 = performance.now(); G.setStep(1);
      if (cfg.timer) { G.timerLeft = cfg.timer; startClock(); }
      sound.play("open");
      cfg.onStart && cfg.onStart(G);
      post({ orion: "start", game: cfg.id });
    };

    /* Uitslag met sterren, Nalezen en de kernregel. */
    G.finish = (o) => {
      if (G.finished) return; G.finished = true; stopClock();
      { const v = $(".verdict", root); if (v) { clearTimeout(vt); v.classList.remove("on"); } }
      o = o || {};
      const steps = $$(".mg-steps div", root).length; G.setStep(steps - 1);
      const pct = Math.round(G.score / G.max * 100), pass = o.pass != null ? o.pass : pct >= 70;
      const stars = o.stars != null ? o.stars : pct >= 95 ? 3 : pct >= 85 ? 2 : pct >= 70 ? 1 : 0;
      G.head(o.title || "Debriefing", `<span class="chip ${pass ? "ok" : "warn"}">${icon(pass ? "check" : "refresh", "sm")}${pass ? "Missie geslaagd" : "Nog niet geslaagd"}</span>`);
      const C = 2 * Math.PI * 80, wrong = G.log.filter((x) => x.result !== "goed");
      const all = o.review || G.log, rows = (x) => `<div class="rv ${x.result}"><span class="ic">${icon(x.result === "goed" ? "check" : x.result === "half" ? "half" : "x", "sm")}</span><div><b>${esc(x.q)}</b>${x.a ? `<div class="a">Jouw keuze: ${esc(x.a)}</div>` : ""}${x.why ? `<div class="why">${esc(x.why)}</div>` : ""}</div></div>`;
      const bad = all.filter((x) => x.result !== "goed"), good = all.filter((x) => x.result === "goed");
      const half = bad.filter((x) => x.result === "half").length, fout = bad.length - half;
      const kz = (n) => n === 1 ? "de goede keuze" : `de ${n} goede keuzes`, openGood = true;
      const tlabel = (open) => `${icon("check", "sm")}${open ? "Verberg" : "Toon"} ${kz(good.length)}`;
      const list = bad.length ? bad.map(rows).join("") + (good.length ? `<button class="rv-toggle" type="button" data-rvt aria-expanded="${openGood}">${tlabel(openGood)}</button><div class="rv-good" data-rvg${openGood ? "" : " hidden"}>${good.map(rows).join("")}</div>` : "") : good.map(rows).join("");
      const countTxt = [`${good.length} goed`, half ? `${half} half goed` : "", fout ? `${fout} fout` : ""].filter(Boolean).join(", ");
      G.stage.innerHTML = "";
      const n = h(`<div class="result fade-in">
        <div class="score-card">
          <div class="ring"><svg viewBox="0 0 180 180"><circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="12"/><circle data-arc cx="90" cy="90" r="80" fill="none" stroke="${pass ? "#15aaff" : "#ffb900"}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" style="transition:stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)"/></svg><div class="n"><b data-pct>0%</b><span>${Math.round(G.score)} van ${G.max} punten</span></div></div>
          <div class="stars">${[0, 1, 2].map((i) => `<svg viewBox="0 0 24 24" class="${i < stars ? "on" : ""}">${P.star}</svg>`).join("")}</div>
          <div class="verdict-line">${esc(o.headline || ["Nog niet geslaagd", "Geslaagd met één ster", "Geslaagd met twee sterren", "Drie sterren, cadet"][stars])}</div>
          <p class="star-rule">${(() => { const next = [70, 85, 95].find((t) => t > pct); if (o.stars != null || next == null) return "Eén ster vanaf 70 procent, twee vanaf 85, drie vanaf 95."; const need = Math.ceil(next * G.max / 100 - G.score); return `Nog ${need} ${need === 1 ? "punt" : "punten"} tot ${["één ster", "twee sterren", "drie sterren"][[70, 85, 95].indexOf(next)]}. Eén ster vanaf 70 procent, twee vanaf 85, drie vanaf 95.`; })()}</p>
          <div class="res-facts"><span>${icon("shield", "sm")}Schild <b>${Math.round(G.shield)}%</b></span><span>${icon("gem", "sm")}Kristallen <b>${G.gems} van 3</b></span><span>${icon("flag", "sm")}Langste reeks <b>${G.best}</b></span></div>
          ${o.sub ? `<p class="muted">${esc(o.sub)}</p>` : ""}
          <div class="actions"><button class="btn" type="button" data-again>${icon("refresh")}Opnieuw spelen</button><a class="btn ghost" href="${back}" data-back>${icon("grid")}${esc(backLabel)}</a></div>
        </div>
        <div class="review">
          ${o.takeaway ? `<div class="takeaway">${icon("bulb")}<div><b>Onthoud</b><br>${esc(o.takeaway)}</div></div>` : ""}
          <div class="review-head"><h3>${wrong.length ? "Nalezen" : "Alles goed"}</h3><span class="rv-count">${countTxt}</span></div>
          <div class="review-list" data-rl>${list}</div>
          <p class="rv-more" data-more hidden>${icon("arrow", "sm")}Scroll in de lijst voor de rest</p>
        </div></div>`);
      G.stage.appendChild(n);
      const rl = $("[data-rl]", n), more = $("[data-more]", n);
      const cue = () => { const over = rl.scrollHeight - rl.clientHeight > 4; rl.classList.toggle("fade", over && rl.scrollTop + rl.clientHeight < rl.scrollHeight - 4); more.hidden = !over || rl.scrollTop > 8; };
      rl.addEventListener("scroll", cue); window.addEventListener("resize", cue);
      setTimeout(() => { const g = $("[data-rvg]", n), t = $("[data-rvt]", n); if (g && t && rl.scrollHeight - rl.clientHeight > 4) { g.hidden = true; t.setAttribute("aria-expanded", "false"); t.innerHTML = tlabel(false); } cue(); }, 40);
      const rvt = $("[data-rvt]", n); if (rvt) rvt.addEventListener("click", () => { const g = $("[data-rvg]", n), open = g.hidden; g.hidden = !open; rvt.setAttribute("aria-expanded", open); rvt.innerHTML = tlabel(open); setTimeout(cue, 30); });
      requestAnimationFrame(() => requestAnimationFrame(() => { $("[data-arc]", n).style.strokeDashoffset = C * (1 - Math.min(1, pct / 100)); }));
      const pe = $("[data-pct]", n); let k = 0; const tick = () => { k = Math.min(pct, k + Math.max(1, pct / 30)); pe.textContent = Math.round(k) + "%"; if (k < pct) requestAnimationFrame(tick); }; reduce || params.get("shot") ? (pe.textContent = pct + "%") : tick(); setTimeout(() => { pe.textContent = pct + "%"; }, 1600);
      $("[data-again]", n).addEventListener("click", () => location.reload());
      sound.play(pass ? "win" : "half");
      post({ orion: "done", game: cfg.id, score: Math.round(G.score), max: G.max, pct, stars, shield: Math.round(G.shield), gems: G.gems });
    };

    G.shot = params.get("shot") || "";
    paint();
    window.__mini = G;
    return G;
  }

  /* Hoogte doorgeven aan een shell die het spel in een iframe toont. */
  if (embedded && window.ResizeObserver) { let last = 0; new ResizeObserver(() => { const hgt = document.documentElement.scrollHeight; if (Math.abs(hgt - last) > 6) { last = hgt; post({ orion: "size", h: hgt }); } }).observe(document.documentElement); }

  window.Mini = { game, icon, P, FACES, person, crewFace, rng, shuffle, esc, $, $$, h, wait, sound, reduce, params, NAME, ROLE };
})();
