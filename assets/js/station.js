/* Ruimtestation Orion: the station, built entirely in code with three.js.
   No models, textures or images are loaded. Everything below is generated.
   The shell talks to it through window.OrionStation (see the bottom of this file). */
import * as THREE from "three";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("world");

/* ---------- Renderer ---------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
} catch (e) {
  document.documentElement.classList.add("no-3d");
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020814);
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 2000);

/* ---------- Seeded random, so the station looks the same every visit ---------- */
let seed = 7;
function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }

/* ---------- Environment for reflections: a small studio made in code ---------- */
function makeEnvironment() {
  const env = new THREE.Scene();
  const box = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x0a1a33, side: THREE.BackSide }));
  env.add(box);
  const panel = (color, intensity, w, h, pos, look) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.copy(pos); m.lookAt(look); env.add(m);
  };
  panel(0xfff1dc, 6, 8, 5, new THREE.Vector3(-6, 7, 4), new THREE.Vector3(0, 0, 0));   // sun side
  panel(0x67caff, 1.6, 12, 4, new THREE.Vector3(6, -6, -2), new THREE.Vector3(0, 0, 0)); // planet bounce
  panel(0xd3efff, 1.2, 3, 10, new THREE.Vector3(0, 2, -9), new THREE.Vector3(0, 0, 0));
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(env, 0.04).texture;
  pm.dispose();
  return tex;
}
scene.environment = makeEnvironment();
scene.environmentIntensity = 0.55;

/* ---------- Procedural hull textures ---------- */
/* Hull panels: colour with subtle tone shifts, a bump map for the seams and rivets, and a roughness map,
   so panels read through light rather than through drawn lines. */
function hullTexture(base, opts = {}) {
  const S = 512, cols = opts.cols || 6, rows = opts.rows || 4, cw = S / cols, rh = S / rows;
  const mk = () => { const c = document.createElement("canvas"); c.width = c.height = S; return [c, c.getContext("2d")]; };
  const [cc, g] = mk(), [bc, b] = mk(), [rc, r] = mk();
  g.fillStyle = base; g.fillRect(0, 0, S, S);
  b.fillStyle = "#808080"; b.fillRect(0, 0, S, S);
  r.fillStyle = "#8a8a8a"; r.fillRect(0, 0, S, S);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    // panels are split unevenly, like real hull plating
    const split = rnd() < 0.35, parts = split ? [[0, 0.5], [0.5, 1]] : [[0, 1]];
    parts.forEach(([a0, a1]) => {
      const px = x * cw, py = y * rh + a0 * rh, ph = (a1 - a0) * rh;
      const v = (rnd() - 0.5) * (opts.vary || 14);
      g.fillStyle = v > 0 ? `rgba(255,255,255,${v / 255})` : `rgba(0,0,0,${-v / 255})`; g.fillRect(px, py, cw, ph);
      const rv = 110 + Math.floor(rnd() * 60); r.fillStyle = `rgb(${rv},${rv},${rv})`; r.fillRect(px, py, cw, ph);
      b.fillStyle = "#5a5a5a"; b.fillRect(px, py, cw, 2); b.fillRect(px, py, 2, ph);
      b.fillStyle = "#a0a0a0"; b.fillRect(px + 2, py + 2, cw - 2, 1);
      for (let k = 0; k < 4; k++) { b.fillStyle = "#b8b8b8"; b.fillRect(px + 6 + k * (cw - 12) / 3, py + 5, 2, 2); }
      if (rnd() < 0.2) { g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(px + cw * 0.15, py + ph * 0.3, cw * 0.5, ph * 0.12); b.fillStyle = "#6c6c6c"; b.fillRect(px + cw * 0.15, py + ph * 0.3, cw * 0.5, ph * 0.12); }
    });
  }
  // a little grime along the lower edges
  const grad = g.createLinearGradient(0, 0, 0, S); grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(10,20,40,.10)"); g.fillStyle = grad; g.fillRect(0, 0, S, S);
  const tex = (c, srgb) => { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
  const map = tex(cc, true); map.userData = { bump: tex(bc), rough: tex(rc) };
  return map;
}
function hullMat(map, metalness, roughness, repeat) {
  const m = new THREE.MeshStandardMaterial({ map, metalness, roughness, bumpMap: map.userData.bump, bumpScale: 1.2, roughnessMap: map.userData.rough });
  if (repeat) { ["map", "bumpMap", "roughnessMap"].forEach((k) => { m[k] = m[k].clone(); m[k].repeat.set(repeat[0], repeat[1]); m[k].needsUpdate = true; }); }
  return m;
}
function windowTexture(cols, rows, lit, color) {
  const W = 512, H = 128, c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
  const cw = W / cols, rh = H / rows;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    if (rnd() > lit) continue;
    const k = 0.55 + rnd() * 0.45;
    g.fillStyle = color; g.globalAlpha = k;
    g.fillRect(x * cw + cw * 0.22, y * rh + rh * 0.3, cw * 0.56, rh * 0.42);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function solarTexture() {
  const S = 256, c = document.createElement("canvas"); c.width = c.height = S;
  const g = c.getContext("2d"); g.fillStyle = "#0b2a5c"; g.fillRect(0, 0, S, S);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) {
    const l = 26 + rnd() * 10;
    g.fillStyle = `hsl(212 70% ${l}%)`; g.fillRect(x * 64 + 3, y * 32 + 3, 58, 26);
    g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(x * 64 + 3, y * 32 + 3, 58, 4);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  return t;
}

function containerTexture() {
  const W = 256, H = 256, c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d"); g.fillStyle = "#d8dde3"; g.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 16) { g.fillStyle = "rgba(0,0,0,.16)"; g.fillRect(x, 0, 5, H); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x + 7, 0, 3, H); }
  g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, 0, W, 10); g.fillRect(0, H - 10, W, 10); g.fillRect(0, 0, 10, H); g.fillRect(W - 10, 0, 10, H);
  g.fillStyle = "rgba(255,255,255,.55)"; g.fillRect(28, 30, 60, 10); g.fillRect(28, 46, 36, 6);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const TEX = {
  container: containerTexture(),
  light: hullTexture("#a9b4c2", { cols: 6, rows: 3 }),
  mid: hullTexture("#7f8ea4", { cols: 5, rows: 4 }),
  dark: hullTexture("#34445c", { cols: 4, rows: 4, vary: 20 }),
  white: hullTexture("#d2dae4", { cols: 4, rows: 3, vary: 10 }),
};
const MAT = {
  hull: hullMat(TEX.light, 0.4, 0.75),
  hullMid: hullMat(TEX.mid, 0.5, 0.7),
  hullDark: hullMat(TEX.dark, 0.6, 0.65),
  white: hullMat(TEX.white, 0.2, 0.7),
  truss: new THREE.MeshStandardMaterial({ color: 0x8a96a8, metalness: 0.85, roughness: 0.3 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xc8a65a, metalness: 1, roughness: 0.32 }),
  solar: new THREE.MeshStandardMaterial({ map: solarTexture(), metalness: 0.4, roughness: 0.25, color: 0xffffff }),
  blue: new THREE.MeshStandardMaterial({ color: 0x0a6dbe, metalness: 0.4, roughness: 0.35 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x0c2f5f, metalness: 0.9, roughness: 0.08 }),
};
function emissive(color, intensity) { return new THREE.MeshStandardMaterial({ color: 0x000000, emissive: color, emissiveIntensity: intensity, roughness: 0.6 }); }

/* ---------- Helpers ---------- */
function mesh(geo, mat, parent, pos, rot) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(pos[0], pos[1], pos[2]);
  if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
  parent.add(m); return m;
}
function cyl(r, h, seg) { return new THREE.CylinderGeometry(r, r, h, seg || 32, 1); }
function strut(parent, a, b, r, mat) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B);
  const m = new THREE.Mesh(cyl(r, len, 8), mat || MAT.truss);
  m.position.copy(A).add(B).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  parent.add(m); return m;
}
function trussBox(parent, w, h, d, r) {
  const x = w / 2, y = h / 2, z = d / 2;
  const P = [[-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z], [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]];
  [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7], [0, 6], [1, 7]].forEach(([i, j]) => strut(parent, P[i], P[j], r));
}
function lamp(parent, pos, color, size) {
  const m = mesh(new THREE.SphereGeometry(size || 0.05, 10, 8), emissive(color, 3), parent, pos);
  m.userData.blink = rnd() * 6;
  blinkers.push(m); return m;
}
const blinkers = [];

/* Near-scale detail: vents, hatches and handrails, so modules hold up in close-up */
const ventMat = new THREE.MeshStandardMaterial({ color: 0x1d293d, metalness: 0.5, roughness: 0.6 });
function vents(parent, x, y, z, n, ry) {
  const g = new THREE.Group(); parent.add(g); g.position.set(x, y, z); g.rotation.y = ry || 0;
  mesh(new THREE.BoxGeometry(0.06 * n + 0.08, 0.2, 0.012), MAT.hullDark, g);
  for (let i = 0; i < n; i++) mesh(new THREE.BoxGeometry(0.03, 0.15, 0.02), ventMat, g, [-(n - 1) * 0.03 + i * 0.06, 0, 0.008]);
  return g;
}
function hatch(parent, x, y, z, ry) {
  const g = new THREE.Group(); parent.add(g); g.position.set(x, y, z); g.rotation.y = ry || 0;
  mesh(new THREE.BoxGeometry(0.32, 0.42, 0.014), MAT.hullDark, g);
  mesh(new THREE.BoxGeometry(0.26, 0.36, 0.02), MAT.hullMid, g, [0, 0, 0.006]);
  mesh(new THREE.BoxGeometry(0.1, 0.03, 0.03), MAT.gold, g, [0.06, -0.06, 0.018]);
  return g;
}
function rail(parent, x0, x1, y, z) { strut(parent, [x0, y, z], [x1, y, z], 0.012, MAT.gold); for (let x = x0; x <= x1 + 1e-6; x += (x1 - x0) / 3) strut(parent, [x, y, z - 0.05], [x, y, z], 0.01, MAT.gold); }
function stripeTexture() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 32; const g = c.getContext("2d");
  g.fillStyle = "#1d293d"; g.fillRect(0, 0, 256, 32); g.fillStyle = "#ffb900";
  for (let x = -32; x < 288; x += 32) { g.beginPath(); g.moveTo(x, 32); g.lineTo(x + 16, 32); g.lineTo(x + 32, 0); g.lineTo(x + 16, 0); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; return t;
}
const stripeTex = stripeTexture();

/* ---------- Station ---------- */
const station = new THREE.Group();
scene.add(station);
station.rotation.x = 0.08;

// Central spine and hub
mesh(cyl(1.25, 3.2, 48), MAT.hull, station);
mesh(new THREE.SphereGeometry(1.25, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), MAT.hullMid, station, [0, 1.6, 0]);
mesh(new THREE.SphereGeometry(1.25, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), MAT.hullMid, station, [0, -1.6, 0]);
mesh(cyl(0.42, 9, 24), MAT.hullDark, station);
[-2.2, 2.2].forEach((y) => mesh(new THREE.TorusGeometry(1.3, 0.08, 12, 64), MAT.hullDark, station, [0, y * 0.72, 0], [Math.PI / 2, 0, 0]));
for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; if (i % 4 === 1) continue; mesh(new THREE.BoxGeometry(0.1, 0.05, 0.02), emissive(0xffe2a8, 1.6), station, [Math.cos(a) * 1.255, 0.55, Math.sin(a) * 1.255], [0, -a + Math.PI / 2, 0]); }

// Rotating habitat ring with spokes
const ring = new THREE.Group(); station.add(ring);
const RING_R = 6.2;
const ringMesh = mesh(new THREE.TorusGeometry(RING_R, 0.5, 24, 160), MAT.hull, ring, null, [Math.PI / 2, 0, 0]);
TEX.light.repeat.set(1, 1);
ringMesh.material = hullMat(TEX.light, 0.4, 0.75, [28, 1]);
const winTex = windowTexture(32, 2, 0.6, "#ffe9b8"); winTex.repeat.set(10, 1);
mesh(new THREE.TorusGeometry(RING_R, 0.505, 6, 160, Math.PI * 2), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: winTex, emissiveIntensity: 1.4, transparent: true, opacity: 1, alphaMap: winTex, depthWrite: false }), ring, null, [Math.PI / 2, 0, 0]).scale.set(1, 1, 0.22);
for (let i = 0; i < 4; i++) {
  const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
  const sp = mesh(cyl(0.16, RING_R - 1.2, 16), MAT.hullMid, ring, [Math.cos(a) * (RING_R / 2 + 0.6), 0, Math.sin(a) * (RING_R / 2 + 0.6)]);
  sp.rotation.set(0, -a, Math.PI / 2);
}
for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; mesh(new THREE.TorusGeometry(0.56, 0.05, 8, 24), MAT.hullDark, ring, [Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R], [0, -a, 0]); }

// Solar arrays on the spine
function solarWing(y, flip) {
  const g = new THREE.Group(); station.add(g); g.position.y = y;
  strut(g, [0, 0, 0], [0, 0, 0], 0.01);
  mesh(cyl(0.08, 7, 12), MAT.truss, g, [3.8 * flip, 0, 0], [0, 0, Math.PI / 2]);
  for (let k = 0; k < 2; k++) {
    const p = mesh(new THREE.BoxGeometry(5.6, 0.03, 1.5), MAT.solar, g, [4.4 * flip, 0, (k ? 1 : -1) * 0.95]);
    p.material = MAT.solar.clone(); p.material.map = MAT.solar.map.clone(); p.material.map.repeat.set(4, 1); p.material.map.needsUpdate = true;
    mesh(new THREE.BoxGeometry(5.7, 0.05, 0.05), MAT.truss, g, [4.4 * flip, 0, (k ? 1 : -1) * 1.72]);
  }
  return g;
}
const wings = [solarWing(3.9, 1), solarWing(3.9, -1), solarWing(-3.9, 1), solarWing(-3.9, -1)];
wings.forEach((w) => (w.rotation.y = 0.5));

// Top communications array (the final mission)
const comms = new THREE.Group(); station.add(comms); comms.position.y = 4.5;
mesh(cyl(0.12, 1.8, 12), MAT.truss, comms, [0, 0.9, 0]);
const dishPts = []; for (let i = 0; i <= 16; i++) { const t = i / 16; dishPts.push(new THREE.Vector2(t * 1.3, t * t * 0.55)); }
const dish = mesh(new THREE.LatheGeometry(dishPts, 48), new THREE.MeshStandardMaterial({ color: 0xc9d3df, metalness: 0.25, roughness: 0.62, side: THREE.DoubleSide }), comms, [0, 1.9, 0]);
dish.rotation.set(-0.9, 0, 0.3);
for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; strut(dish, [Math.cos(a) * 0.15, 0.012, Math.sin(a) * 0.15], [Math.cos(a) * 1.28, 0.56, Math.sin(a) * 1.28], 0.012, MAT.hullDark); }
mesh(new THREE.TorusGeometry(1.3, 0.025, 6, 64), MAT.hullDark, dish, [0, 0.55, 0], [Math.PI / 2, 0, 0]);
[0, 2.1, 4.2].forEach((a) => strut(dish, [Math.cos(a) * 1.2, 0.5, Math.sin(a) * 1.2], [0, 0.86, 0], 0.012, MAT.truss));
mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.16, 16), MAT.hullDark, dish, [0, 0.86, 0]);
lamp(comms, [0, 1.85, 0], 0x15aaff, 0.06);
const dishLamp = lamp(dish, [0, 0.92, 0], 0x67caff, 0.07);

/* ---------- The six modules on the ring ---------- */
const MODULES = [];
function moduleFrame(angleDeg, name) {
  const a = THREE.MathUtils.degToRad(angleDeg);
  const g = new THREE.Group(); ring.add(g);
  g.position.set(Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R);
  g.rotation.y = -a; // local +x points outward
  g.userData.name = name;
  mesh(cyl(0.38, 1.2, 24), MAT.hullDark, g, [0.75, 0, 0], [0, 0, Math.PI / 2]); // docking collar
  return g;
}

// 1. Aankomst: docking port with a shuttle
(function () {
  const g = moduleFrame(20, "aankomst");
  mesh(new THREE.BoxGeometry(1.6, 1.1, 1.3), MAT.hull, g, [1.9, 0, 0]);
  mesh(cyl(0.45, 0.4, 32), MAT.hullMid, g, [2.9, 0, 0], [0, 0, Math.PI / 2]);
  const ship = new THREE.Group(); g.add(ship); ship.position.set(3.8, 0, 0);
  const body = mesh(new THREE.CapsuleGeometry(0.32, 1.1, 8, 24), MAT.white, ship, [0.5, 0, 0], [0, 0, Math.PI / 2]);
  body.scale.set(1, 1, 0.8);
  mesh(new THREE.BoxGeometry(0.7, 0.04, 1.5), MAT.white, ship, [0.6, -0.08, 0]).rotation.y = 0;
  mesh(new THREE.SphereGeometry(0.22, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), MAT.glass, ship, [0.95, 0.1, 0], [0, 0, -Math.PI / 2.4]);
  mesh(cyl(0.16, 0.2, 16), MAT.hullDark, ship, [-0.25, 0, 0], [0, 0, Math.PI / 2]);
  lamp(ship, [0.6, -0.06, 0.76], 0x05df72, 0.04); lamp(ship, [0.6, -0.06, -0.76], 0xff6467, 0.04);
  for (let i = 0; i < 5; i++) lamp(g, [1.2 + i * 0.4, -0.58, 0.66], 0xa1deff, 0.035);
  hatch(g, 1.6, 0.05, 0.66); vents(g, 2.25, 0.25, 0.66, 5); rail(g, 1.2, 2.6, -0.3, 0.7);
  [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([a, b]) => mesh(new THREE.BoxGeometry(0.16, 0.12, 0.12), MAT.gold, g, [3.12, a * 0.42, b * 0.42]));
  MODULES.push({ id: 0, group: g, anchor: new THREE.Vector3(3.2, 0.8, 0), cam: new THREE.Vector3(5.5, 2.4, 4.2) });
})();

// 2. Passagiersmodule: long habitat with warm windows
(function () {
  const g = moduleFrame(80, "passagiers");
  const hab = mesh(cyl(0.7, 3.4, 48), MAT.hull, g, [2.9, 0, 0], [0, 0, Math.PI / 2]);
  hab.material = hullMat(TEX.light, 0.4, 0.75, [4, 2]);
  const wt = windowTexture(24, 3, 0.7, "#ffe2a8"); wt.repeat.set(2, 1);
  mesh(new THREE.CylinderGeometry(0.705, 0.705, 3.2, 48, 1, true), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: wt, emissiveIntensity: 1.6, transparent: true, alphaMap: wt, depthWrite: false }), g, [2.9, 0, 0], [0, 0, Math.PI / 2]);
  [1.2, 4.6].forEach((x) => mesh(new THREE.SphereGeometry(0.7, 32, 16), MAT.hullMid, g, [x, 0, 0]).scale.set(0.35, 1, 1));
  [2.2, 3.6].forEach((x) => mesh(new THREE.TorusGeometry(0.74, 0.06, 8, 48), MAT.hullDark, g, [x, 0, 0], [0, Math.PI / 2, 0]));
  lamp(g, [4.85, 0, 0], 0xffd230, 0.05);
  rail(g, 1.7, 4.1, 0.55, 0.5); rail(g, 1.7, 4.1, -0.55, 0.5);
  vents(g, 2.9, 0.72, 0, 6, 0).rotation.x = -Math.PI / 2;
  mesh(cyl(0.015, 0.6, 6), MAT.truss, g, [4.2, 0.95, 0]); lamp(g, [4.2, 1.26, 0], 0xff6467, 0.03);
  MODULES.push({ id: 1, group: g, anchor: new THREE.Vector3(3.0, 1.0, 0), cam: new THREE.Vector3(4.8, 2.6, 4.6) });
})();

// 3. Ziekenboeg: clean white module with a soft cyan light band
(function () {
  const g = moduleFrame(140, "ziekenboeg");
  const box = mesh(new THREE.BoxGeometry(2.4, 1.3, 1.6), MAT.white, g, [2.3, 0, 0]);
  box.material = hullMat(TEX.white, 0.2, 0.7, [2, 1]);
  mesh(new THREE.BoxGeometry(2.42, 0.08, 1.62), emissive(0x67caff, 2.4), g, [2.3, 0.2, 0]);
  mesh(new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), MAT.glass, g, [2.3, 0.65, 0]).scale.set(1, 0.5, 0.8);
  for (let i = 0; i < 2; i++) mesh(new THREE.BoxGeometry(0.42, 0.22, 0.02), emissive(0xd3efff, 1.4), g, [1.5 + i * 0.6, -0.15, 0.81]);
  const crossMat = emissive(0x67e8d0, 2.6);
  [[3.05, -0.1, 0.815, 0], [3.505, -0.1, 0, Math.PI / 2]].forEach(([x, y, z, ry]) => {
    const c = new THREE.Group(); g.add(c); c.position.set(x, y, z); c.rotation.y = ry;
    mesh(new THREE.BoxGeometry(0.5, 0.5, 0.012), new THREE.MeshStandardMaterial({ color: 0x0c2f5f, roughness: 0.4 }), c);
    mesh(new THREE.BoxGeometry(0.34, 0.1, 0.02), crossMat, c, [0, 0, 0.01]);
    mesh(new THREE.BoxGeometry(0.1, 0.34, 0.02), crossMat, c, [0, 0, 0.01]);
  });
  mesh(cyl(0.02, 0.7, 6), MAT.truss, g, [1.6, 1.0, -0.4]); lamp(g, [1.6, 1.36, -0.4], 0x67caff, 0.035);
  hatch(g, 2.35, -0.2, 0.81); vents(g, 1.5, 0.45, 0.81, 4); rail(g, 1.3, 3.3, -0.5, 0.86);
  MODULES.push({ id: 2, group: g, anchor: new THREE.Vector3(2.4, 1.2, 0), cam: new THREE.Vector3(4.6, 2.2, 4.2) });
})();

// 4. Vrachtdok: open truss with stacked containers
(function () {
  const g = moduleFrame(200, "vrachtdok");
  const t = new THREE.Group(); g.add(t); t.position.set(2.6, 0, 0);
  trussBox(t, 3.2, 1.6, 1.8, 0.03);
  const cols = [0x0a6dbe, 0x15aaff, 0xc9d3df, 0xffb900, 0x113e78, 0x62748e];
  for (let x = 0; x < 4; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) {
    if (rnd() < 0.22) continue;
    const c = new THREE.MeshStandardMaterial({ color: pick(cols), metalness: 0.3, roughness: 0.6, map: TEX.container });
    mesh(new THREE.BoxGeometry(0.68, 0.66, 0.78), c, t, [-1.15 + x * 0.76, -0.38 + y * 0.74, -0.42 + z * 0.86]);
  }
  const crane = new THREE.Group(); t.add(crane); crane.position.set(0, 1.05, 0);
  mesh(new THREE.BoxGeometry(3.4, 0.08, 0.12), MAT.hullDark, crane);
  const hook = mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), MAT.gold, crane, [0.6, -0.2, 0]);
  lamp(t, [1.6, 0.85, 0.9], 0xffb900, 0.05); lamp(t, [-1.6, 0.85, -0.9], 0xffb900, 0.05);
  MODULES.push({ id: 3, group: g, anchor: new THREE.Vector3(2.6, 1.3, 0), cam: new THREE.Vector3(5.2, 2.8, 4.4), crane: hook });
})();

// 5. Hullbreuk (module Kepler): torn plating around a breach that glows during the alarm
const breach = { lights: [], embers: null, plates: [] };
(function () {
  const g = moduleFrame(260, "hullbreuk");
  const hull = mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.6, 8, 1, false, Math.PI / 8), MAT.hullMid, g, [2.4, 0, 0], [0, 0, Math.PI / 2]);
  hull.material = hullMat(TEX.mid, 0.5, 0.7, [3, 1]);
  [1.1, 3.7].forEach((x) => mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.18, 8, 1, false, Math.PI / 8), MAT.hullDark, g, [x, 0, 0], [0, 0, Math.PI / 2]));
  const face = 0.8 * Math.cos(Math.PI / 8) + 0.004;
  const hole = new THREE.Shape(), H = [[-0.5, 0.05], [-0.34, 0.24], [-0.12, 0.2], [0.02, 0.34], [0.2, 0.22], [0.42, 0.26], [0.5, 0.02], [0.36, -0.18], [0.16, -0.12], [0.0, -0.3], [-0.18, -0.16], [-0.38, -0.22]];
  hole.moveTo(H[0][0], H[0][1]); H.slice(1).forEach((p) => hole.lineTo(p[0], p[1]));
  const hx = 2.55, hy = 0.05;
  mesh(new THREE.ShapeGeometry(hole), new THREE.MeshBasicMaterial({ color: 0x010309 }), g, [hx, hy, face]);
  const ember = new THREE.Shape(), E = [[-0.3, 0.02], [-0.1, 0.12], [0.08, 0.04], [0.28, 0.1], [0.2, -0.06], [0.0, -0.12], [-0.18, -0.06]];
  ember.moveTo(E[0][0], E[0][1]); E.slice(1).forEach((p) => ember.lineTo(p[0], p[1]));
  breach.embers = mesh(new THREE.ShapeGeometry(ember), new THREE.MeshBasicMaterial({ color: 0xff7a2e, transparent: true, opacity: 0.35 }), g, [hx, hy, face + 0.002]);
  for (let i = 0; i < 3; i++) { const r = mesh(cyl(0.018, 0.6, 6), MAT.hullDark, g, [hx - 0.25 + i * 0.25, hy, face + 0.004]); r.rotation.z = 0.2 * (i - 1); }
  // bent plates hinged at the edge of the hole, peeled outward
  [[-0.5, 0.12, 0.5, 1], [0.44, 0.16, -0.6, 1], [0.05, 0.32, 0.1, 0], [-0.1, -0.28, -0.2, 0], [0.4, -0.16, 0.9, 1]].forEach(([dx, dy, rz, side]) => {
    const pivot = new THREE.Group(); g.add(pivot); pivot.position.set(hx + dx, hy + dy, face);
    pivot.rotation.set(side ? 0 : (dy > 0 ? -0.9 : 0.9), side ? (dx > 0 ? 0.9 : -0.9) : 0, rz);
    const plate = mesh(new THREE.BoxGeometry(side ? 0.3 : 0.36, side ? 0.36 : 0.26, 0.018), MAT.hullMid, pivot, [side ? (dx > 0 ? 0.15 : -0.15) : 0, side ? 0 : (dy > 0 ? 0.13 : -0.13), 0]);
    breach.plates.push(plate);
  });
  for (let i = 0; i < 5; i++) {
    const s = mesh(new THREE.BoxGeometry(0.12 + rnd() * 0.1, 0.04, 0.08), MAT.hullDark, g, [hx + (rnd() - 0.5) * 0.9, hy + (rnd() - 0.5) * 0.6, face + 0.3 + rnd() * 0.6]);
    s.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); s.userData.drift = new THREE.Vector3((rnd() - 0.5) * 0.002, (rnd() - 0.5) * 0.002, 0.002 + rnd() * 0.002); s.userData.origin = s.position.clone();
    breach.lights.push(s);
  }
  breach.beacon = lamp(g, [2.4, 0.86, 0], 0xffb900, 0.07);
  [1.45, 3.35].forEach((x) => { const b = mesh(new THREE.CylinderGeometry(0.815, 0.815, 0.14, 8, 1, true, Math.PI / 8), new THREE.MeshStandardMaterial({ map: stripeTex, roughness: 0.6, metalness: 0.2 }), g, [x, 0, 0], [0, 0, Math.PI / 2]); b.material.map.repeat.set(4, 1); });
  vents(g, 3.2, 0.42, face + 0.002, 4); hatch(g, 1.85, -0.2, face + 0.002);
  MODULES.push({ id: 4, group: g, anchor: new THREE.Vector3(2.5, 1.1, 0), cam: new THREE.Vector3(4.8, 2.0, 4.6) });
})();

// 6. Eindmissie: the comms array on top of the spine (registered for the camera)
MODULES.push({ id: 5, group: comms, anchor: new THREE.Vector3(0, 2.4, 0), cam: new THREE.Vector3(6.8, 3.4, 7.8), fixed: true });

// Extra greebles on the ring between modules
for (let i = 0; i < 18; i++) {
  const a = rnd() * Math.PI * 2, r = RING_R;
  const b = mesh(new THREE.BoxGeometry(0.3 + rnd() * 0.4, 0.2, 0.3), pick([MAT.hullDark, MAT.hullMid, MAT.gold]), ring, [Math.cos(a) * r, 0.5, Math.sin(a) * r]);
  b.rotation.y = -a;
}
for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + 0.13; lamp(ring, [Math.cos(a) * (RING_R + 0.52), 0, Math.sin(a) * (RING_R + 0.52)], i % 3 ? 0x67caff : 0xffffff, 0.035); }

/* ---------- ARIA, the board computer drone ---------- */
const aria = new THREE.Group(); scene.add(aria);
(function () {
  const shellMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.35, roughness: 0.28 });
  mesh(new THREE.SphereGeometry(0.2, 32, 16), shellMat, aria);
  const halo = mesh(new THREE.TorusGeometry(0.29, 0.025, 10, 48), MAT.hullDark, aria, null, [Math.PI / 2.4, 0, 0]);
  aria.userData.halo = halo;
  mesh(new THREE.CircleGeometry(0.11, 32), new THREE.MeshStandardMaterial({ color: 0x06224c, metalness: 0.9, roughness: 0.1 }), aria, [0, 0, 0.196]);
  aria.userData.eye = mesh(new THREE.CircleGeometry(0.055, 32), emissive(0x15aaff, 1.6), aria, [0, 0, 0.2]);
  mesh(cyl(0.008, 0.12, 6), MAT.truss, aria, [0, 0.25, 0]);
  lamp(aria, [0, 0.32, 0], 0x15aaff, 0.022);
})();
aria.scale.setScalar(1.0);

/* ---------- Planet and stars ---------- */
const planetMat = new THREE.ShaderMaterial({
  uniforms: { uLight: { value: new THREE.Vector3(-0.7, 0.55, 0.45).normalize() }, uTime: { value: 0 } },
  vertexShader: `varying vec3 vN; varying vec3 vP; varying vec3 vW;
    void main(){ vN = normalize(normalMatrix * normal); vP = position; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform vec3 uLight; uniform float uTime; varying vec3 vN; varying vec3 vP; varying vec3 vW;
    float h(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
    float n(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
                 mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
    float fbm(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n(p); p*=2.03; a*=0.5; } return s; }
    void main(){
      vec3 p = normalize(vP);
      float land = smoothstep(0.52, 0.58, fbm(p*2.6 + 3.0));
      float cloud = smoothstep(0.62, 0.85, fbm(p*5.0 + vec3(uTime*0.004, 0.0, 0.0)));
      vec3 ocean = mix(vec3(0.01,0.07,0.20), vec3(0.03,0.20,0.42), fbm(p*7.0));
      vec3 ground = mix(vec3(0.05,0.16,0.22), vec3(0.16,0.27,0.30), fbm(p*9.0));
      vec3 col = mix(ocean, ground, land);
      col = mix(col, vec3(0.80,0.88,0.96), cloud*0.45);
      vec3 N = normalize(vN);
      vec3 L = normalize((viewMatrix * vec4(uLight,0.0)).xyz);
      float d = dot(N, L);
      float lit = smoothstep(-0.15, 0.6, d);
      vec3 V = vec3(0.0,0.0,1.0);
      float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
      vec3 atmo = vec3(0.30,0.65,1.0) * rim * (0.25 + 1.2*smoothstep(-0.3, 0.5, d));
      vec3 night = vec3(0.0);
      gl_FragColor = vec4(col*lit*0.9 + atmo*0.8 + night, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
});
const planet = mesh(new THREE.SphereGeometry(90, 96, 64), planetMat, scene, [-170, -150, -135]);
const haloMat = new THREE.ShaderMaterial({
  uniforms: { uLight: planetMat.uniforms.uLight },
  vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
  fragmentShader: `uniform vec3 uLight; varying vec3 vN; void main(){ float r = pow(0.72 - dot(vN, vec3(0,0,1.0)), 4.0); vec3 L = normalize((viewMatrix*vec4(uLight,0.0)).xyz); float s = smoothstep(-0.4,0.6,dot(vN,L)); gl_FragColor = vec4(vec3(0.35,0.7,1.0)*r*s*2.2, 1.0); }`,
  side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
});
mesh(new THREE.SphereGeometry(94, 64, 48), haloMat, scene, [-170, -150, -135]);


/* A faint band of distant stars and dust, so the sky has depth */
(function () {
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `varying vec3 vD;
      float h(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
      float n(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
                   mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
      float fbm(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*n(p); p*=2.1; a*=0.5; } return s; }
      void main(){
        vec3 d = normalize(vD);
        vec3 axis = normalize(vec3(0.35, 1.0, -0.25));
        float b = exp(-pow(dot(d, axis) * 3.2, 2.0));
        float dust = fbm(d * 6.0);
        float lanes = smoothstep(0.45, 0.75, fbm(d * 11.0 + 4.0));
        vec3 c = mix(vec3(0.0009,0.0025,0.007), vec3(0.008,0.02,0.045), b * dust) * (1.0 - lanes * 0.6 * b);
        c += vec3(0.004,0.01,0.022) * pow(b, 3.0) * dust;
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1400, 48, 32), m));
})();

(function stars() {
  const N = 4200, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const u = rnd() * 2 - 1, t = rnd() * Math.PI * 2, r = 600 + rnd() * 300, s = Math.sqrt(1 - u * u);
    pos.set([Math.cos(t) * s * r, u * r, Math.sin(t) * s * r], i * 3);
    const k = rnd(), c = k < 0.12 ? [0.75, 0.86, 1] : k < 0.18 ? [1, 0.9, 0.78] : [1, 1, 1];
    const b = 0.35 + Math.pow(rnd(), 3) * 0.9;
    col.set([c[0] * b, c[1] * b, c[2] * b], i * 3);
    size[i] = 1.0 + Math.pow(rnd(), 6) * 3.5;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.setAttribute("size", new THREE.BufferAttribute(size, 1));
  const m = new THREE.ShaderMaterial({
    uniforms: { uPx: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float size; attribute vec3 color; varying vec3 vC; uniform float uPx; void main(){ vC = color; gl_PointSize = size * uPx; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `varying vec3 vC; void main(){ vec2 d = gl_PointCoord - 0.5; float a = smoothstep(0.5, 0.0, length(d)); gl_FragColor = vec4(vC*a, 1.0); }`,
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
  });
  scene.add(new THREE.Points(g, m));
})();

/* ---------- Lights ---------- */
const sun = new THREE.DirectionalLight(0xfff1dc, 3.8);
sun.position.copy(planetMat.uniforms.uLight.value).multiplyScalar(50);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 20, far: 80 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
scene.add(sun);
station.traverse((o) => { if (o.isMesh && o.material && !o.material.transparent && !(o.material.emissiveIntensity > 1)) { o.castShadow = true; o.receiveShadow = true; } });
scene.add(new THREE.HemisphereLight(0x67caff, 0x020814, 0.22));
const rimLight = new THREE.DirectionalLight(0x67caff, 1.6); rimLight.position.set(-30, -26, -30); scene.add(rimLight);
const fill = new THREE.DirectionalLight(0xbcd9ff, 0.45); fill.position.set(30, 10, 25); scene.add(fill);
scene.fog = new THREE.FogExp2(0x061a36, 0.0085);
const alarmLight = new THREE.PointLight(0xff5a3b, 0, 4.5, 2); scene.add(alarmLight);
const pulseLight = new THREE.PointLight(0x67caff, 0, 6, 2); scene.add(pulseLight);
let pulseLevel = 0;

/* ---------- Camera rig ---------- */
const HOME = { pos: new THREE.Vector3(19.5, 8.5, 22), target: new THREE.Vector3(0, 0.2, 0) };
const cam = { pos: HOME.pos.clone(), target: HOME.target.clone(), fromPos: HOME.pos.clone(), fromTarget: HOME.target.clone(), t: 1, dur: 2.4 };
let focus = -1, alarm = false, frame = "home", offsetX = 0, offsetTarget = 0;
const ariaPos = new THREE.Vector3(5, 3, 8);
camera.position.copy(HOME.pos);

function moduleWorld(m, local) {
  const v = local.clone();
  return m.group.localToWorld(v);
}
const VIEW = new THREE.Vector3(8.4, 1.7, 5.4); // outward, up, along the ring: below the solar wings, outside the ring
function focusGoal(i) {
  if (i < 0) return { pos: HOME.pos.clone(), target: HOME.target.clone() };
  const m = MODULES[i];
  const target = moduleWorld(m, m.anchor.clone().setY(m.anchor.y - (m.fixed ? 0.6 : 1.5)));
  // camera sits outside the module, measured in the module's own frame so it follows the ring
  // the preset is measured in the module's own frame; pull it back so the module reads well beside the panel
  const pos = moduleWorld(m, m.fixed ? m.cam : m.anchor.clone().add(VIEW));
  return { pos, target };
}
function setGoal(i, instant) {
  const g = focusGoal(i);
  cam.fromPos.copy(camera.position); cam.fromTarget.copy(cam.target);
  cam.goalIndex = i; cam.t = instant || reduce ? 1 : 0;
  if (cam.t === 1) { camera.position.copy(g.pos); cam.target.copy(g.target); }
}
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------- Resize with a view offset, so the station can sit beside a panel ---------- */
function resize() {
  const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();
function applyOffset() {
  const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
  if (Math.abs(offsetX) < 0.5) camera.clearViewOffset();
  else camera.setViewOffset(w, h, -offsetX, 0, w, h);
}

/* ---------- Loop ---------- */
const clock = new THREE.Clock();
let running = true, lowPower = false, acc = 0, frameNo = 0;
renderer.shadowMap.autoUpdate = false;
document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) clock.getDelta(); });
const tmp = new THREE.Vector3();
function tick() {
  requestAnimationFrame(tick);
  if (!running) return;
  let dt = Math.min(clock.getDelta(), 0.1);
  if (lowPower) { acc += dt; if (acc < 1 / 30) return; dt = acc; acc = 0; }
  const t = clock.elapsedTime;

  if (!reduce) {
    ring.rotation.y += dt * (focus < 0 ? 0.035 : 0.012);
    wings.forEach((w, i) => (w.rotation.y = 0.5 + Math.sin(t * 0.05 + i) * 0.04));
    station.rotation.z = Math.sin(t * 0.07) * 0.02;
  }
  planetMat.uniforms.uTime.value = t;
  blinkers.forEach((b) => { const k = (Math.sin((t + b.userData.blink) * 2.2) + 1) / 2; b.material.emissiveIntensity = 0.4 + k * k * 1.8; });

  // Crane in the cargo dock
  const dock = MODULES[3]; if (dock.crane && !reduce) dock.crane.position.x = Math.sin(t * 0.4) * 1.1;
  // Breach: drifting debris, flashing during the alarm
  breach.lights.forEach((s) => { if (!reduce) { s.position.add(s.userData.drift); s.rotation.x += 0.01; if (s.position.distanceTo(s.userData.origin) > 1.6) s.position.copy(s.userData.origin); } });
  const pulse = alarm ? (Math.sin(t * 5) + 1) / 2 : 0;
  breach.embers.material.opacity = alarm ? 0.55 + pulse * 0.45 * (0.7 + 0.3 * Math.sin(t * 23)) : 0.3;
  alarmLight.intensity = alarm ? 2 + pulse * 7 : 0;
  alarmLight.position.copy(moduleWorld(MODULES[4], new THREE.Vector3(2.55, 0.1, 1.2)));

  // Camera: ease towards the goal, the goal follows the rotating ring
  const goal = focusGoal(cam.goalIndex == null ? -1 : cam.goalIndex);
  if (cam.t < 1) {
    cam.t = Math.min(1, cam.t + dt / cam.dur);
    const k = ease(cam.t);
    camera.position.lerpVectors(cam.fromPos, goal.pos, k);
    // lift the path a little, so the camera arcs over the ring instead of cutting through it
    camera.position.y += Math.sin(k * Math.PI) * 2.2;
    cam.target.lerpVectors(cam.fromTarget, goal.target, k);
  } else {
    camera.position.lerp(goal.pos, 1 - Math.pow(0.001, dt));
    cam.target.lerp(goal.target, 1 - Math.pow(0.001, dt));
  }
  if (!reduce && cam.t >= 1) { camera.position.x += Math.sin(t * 0.21) * 0.03; camera.position.y += Math.sin(t * 0.17) * 0.03; }
  camera.lookAt(cam.target);
  offsetX += (offsetTarget - offsetX) * (1 - Math.pow(0.002, dt));
  applyOffset();

  // ARIA flies to the focused module, otherwise patrols near the hub
  let ag;
  if (focus >= 0) {
    const m = MODULES[focus];
    ag = moduleWorld(m, m.anchor.clone().add(m.fixed ? new THREE.Vector3(1.2, 0.4, 1.4) : new THREE.Vector3(2.4, -0.5, 1.5)));
  } else {
    ag = tmp.set(Math.cos(t * 0.25) * 9, 2.2 + Math.sin(t * 0.6) * 0.4, Math.sin(t * 0.25) * 9);
  }
  ariaPos.lerp(ag, 1 - Math.pow(0.05, dt));
  aria.position.copy(ariaPos); aria.position.y += reduce ? 0 : Math.sin(t * 1.8) * 0.06;
  aria.lookAt(camera.position);
  aria.userData.halo.rotation.z += dt * 0.8;
  aria.userData.eye.material.emissive.setHex(alarm ? 0xff6467 : 0x15aaff);

  frameNo++; renderer.shadowMap.needsUpdate = !lowPower || frameNo % 4 === 0;
  pulseLevel *= Math.pow(0.02, dt); pulseLight.intensity = pulseLevel; pulseLight.position.copy(aria.position);
  if (pulseLevel > 0.05) aria.userData.eye.material.emissiveIntensity = 1.6 + pulseLevel * 0.3; else aria.userData.eye.material.emissiveIntensity = 1.6;
  renderer.render(scene, camera);
  if (labelsCb) labelsCb();
}

/* ---------- Public API for the shell ---------- */
let labelsCb = null;
const v3 = new THREE.Vector3();
window.OrionStation = {
  ready: true,
  /* i: module 0 to 5, or -1 for the overview. side: "left" puts the station left of a panel. */
  focus(i, side) {
    focus = i;
    setGoal(i, false);
    const w = canvas.clientWidth || window.innerWidth;
    offsetTarget = side === "left" ? -w * 0.28 : side === "right" ? w * 0.2 : 0;
  },
  alarm(on) { alarm = !!on; },
  /* A short flash of light at ARIA when the player answers: blue for good, red for wrong. */
  pulse(kind) { pulseLight.color.setHex(kind === "bad" ? 0xff6467 : kind === "gold" ? 0xffd230 : 0x67caff); pulseLevel = kind === "gold" ? 14 : 9; if (lowPower) acc = 1; },
  lowPower(on) { lowPower = !!on; },
  /* Screen positions of the module labels, for the HTML buttons on the overview. */
  project() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    return MODULES.map((m) => {
      v3.copy(moduleWorld(m, m.anchor.clone().add(new THREE.Vector3(0, 0.6, 0))));
      const toCam = camera.position.clone().sub(v3).normalize();
      const out = m.fixed ? new THREE.Vector3(0, 1, 0) : m.group.localToWorld(new THREE.Vector3(1, 0, 0)).sub(m.group.getWorldPosition(new THREE.Vector3())).normalize();
      v3.project(camera);
      return { x: (v3.x * 0.5 + 0.5) * w, y: (-v3.y * 0.5 + 0.5) * h, front: v3.z < 1 && out.dot(toCam) > -0.35 };
    });
  },
  onFrame(cb) { labelsCb = cb; },
};
setGoal(-1, true);
document.documentElement.classList.add("has-3d");
window.dispatchEvent(new Event("orion-station-ready"));
tick();
