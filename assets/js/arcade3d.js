/* Ruimtestation Orion: the arcade playfields in 3D.
   Each arcade round keeps its HTML controls (buttons, cards, labels), so keyboard and screen reader
   use stay the same. This module draws the room behind them: deck, turret, drones, conveyor, hull panels.
   It follows the HTML elements every frame, so the game rules live in one place (orion.js).
   One unit in the scene is one CSS pixel at the depth of the controls. */
import * as THREE from "three";
import { loadTextures, loadEnv, pbr, tex } from "orion/tex.js";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FOV = 28;
let R = null;

function mesh(geo, mat, parent, x, y, z) { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); parent.add(m); return m; }
function glow(hex, k) { const c = new THREE.Color(hex).multiplyScalar(k || 1); return new THREE.MeshBasicMaterial({ color: c, toneMapped: true }); }
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const BLUE = 0x15aaff, SKYBLUE = 0x67caff, AMBER = 0xffb900, RED = 0xff6467, GREEN = 0x05df72;

function environment(renderer) {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(box(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x0c1c38, side: THREE.BackSide })));
  const panel = (color, k, w, h, p) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(p[0], p[1], p[2]); m.lookAt(0, 0, 0); env.add(m); };
  panel(0xfff1dc, 5, 8, 5, [-5, 7, 5]); panel(0x67caff, 2, 12, 4, [6, -5, 3]); panel(0xd3efff, 1.4, 4, 10, [0, 3, -9]);
  const pm = new THREE.PMREMGenerator(renderer), t = pm.fromScene(env, 0.04).texture; pm.dispose(); return t;
}
function stars(parent, n) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) pos.set([(Math.random() - 0.5) * 9000, (Math.random() - 0.5) * 5000, -3200 - Math.random() * 2500], i * 3);
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  parent.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xd3e6ff, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.85, fog: false })));
}
/* A soft band of light low on the horizon, like the edge of the planet below the station. */
function horizon(parent) {
  const c = document.createElement("canvas"); c.width = 4; c.height = 256; const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(3,10,26,0)"); gr.addColorStop(0.55, "rgba(10,60,130,.55)"); gr.addColorStop(0.78, "rgba(80,170,255,.9)"); gr.addColorStop(1, "rgba(3,10,26,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }), parent);
}

/* The earth below the deck: the same NASA image as the station view. */
function blobTex() { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"), gr = x.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, "rgba(0,0,0,.7)"); gr.addColorStop(0.6, "rgba(0,0,0,.3)"); gr.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); }
function contact(parent) { const m = mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex(), transparent: true, depthWrite: false }), parent); m.rotation.x = -Math.PI / 2; m.renderOrder = 2; return m; }
function setRepeat(mat, u, v) { [mat.map, mat.normalMap, mat.roughnessMap].forEach((t) => { if (t) t.repeat.set(u, v); }); }
function earth(parent) {
  const t = tex("earth", "color", null, true); t.anisotropy = 8;
  const m = mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshStandardMaterial({ map: t, roughness: 1, metalness: 0 }), parent);
  const phi = ((4.34 + 180) / 360) * Math.PI * 2, th = THREE.MathUtils.degToRad(90 - 52.07);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(-Math.cos(phi) * Math.sin(th), Math.cos(th), Math.sin(phi) * Math.sin(th)), new THREE.Vector3(0.1, 0.86, 0.5).normalize());
  return m;
}

/* ---------- Phishing Invaders: a landing deck with a turret, messages arrive under courier drones ---------- */
function invaders(S) {
  const g = S.scene, drones = new Map(), fx = [];
  stars(g, 700);
  const glowBand = horizon(g);
  g.fog = new THREE.Fog(0x030a1a, 1700, 6200); // the far end of the dock sinks into the dark
  const deck = mesh(new THREE.PlaneGeometry(1, 1), pbr("scifi_panel", { repeat: [6, 12], color: 0x55668a, metalness: 0.55, roughness: 0.8, normalScale: 1.2, ao: true }), g); deck.rotation.x = -Math.PI / 2;
  const turretShadow = contact(g);
  const lane = (function () { const c = document.createElement("canvas"); c.width = 256; c.height = 16; const x = c.getContext("2d"); x.fillStyle = "#ffb900"; x.fillRect(0, 0, 256, 16); x.fillStyle = "#1b2740"; for (let i = -1; i < 17; i++) { x.beginPath(); x.moveTo(i * 16, 16); x.lineTo(i * 16 + 8, 16); x.lineTo(i * 16 + 16, 0); x.lineTo(i * 16 + 8, 0); x.fill(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.set(6, 1); t.anisotropy = 8; const m = mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ map: t, roughness: 0.8, metalness: 0.1 }), g); m.rotation.x = -Math.PI / 2; return m; })();
  // the far end of the dock: stacked containers in the station colours and a gantry across
  const far = new THREE.Group(); g.add(far);
  const boxCols = [0x084f8c, 0x8d98a8, 0xb58400, 0x173a63, 0x5f6d82], boxMats = boxCols.map((c) => pbr("container", { repeat: [1, 1], color: c, metalness: 0.4, roughness: 0.9, normalScale: 0.7, ao: true }));
  const crates = []; for (let i = 0; i < 9; i++) crates.push(mesh(box(250, 250, 560), boxMats[(i * 3 + (i >> 1)) % 5], far));
  const gantryMat = pbr("hull_dark", { repeat: [10, 1], metalness: 0.75 });
  const beam = mesh(box(1, 46, 60), gantryMat, far), legs = [-1, 1].map(() => mesh(box(70, 1, 70), gantryMat, far));
  const beamLamps = [-1, 0, 1].map(() => mesh(box(90, 8, 30), glow(0xfff1dc, 1.5), far));
  const key2 = new THREE.SpotLight(0xfff1dc, 0, 0, 0.42, 0.7, 0); g.add(key2); g.add(key2.target);
  const edge = mesh(box(1, 10, 26), pbr("hull_dark", { repeat: [8, 1], metalness: 0.7 }), g);
  const lamps = []; for (let i = 0; i < 16; i++) lamps.push(mesh(box(14, 4, 14), glow(SKYBLUE, 1.6), g));
  const pylonMat = pbr("heat_shield", { repeat: [1, 6], color: 0x8fa0ba, metalness: 0.3, ao: true });
  const pylons = [-1, 1].map((s) => { const p = new THREE.Group(); g.add(p); mesh(box(130, 1500, 130), pylonMat, p, 0, 300, 0); mesh(box(134, 12, 134), glow(BLUE, 1.2), p, 0, 120, 0); mesh(box(160, 40, 160), pbr("hull_dark", {}), p, 0, -440, 0); p.userData.s = s; return p; });
  // turret: a turntable, two yoke arms and an armoured housing in station silver with a blue trim
  const silver = pbr("hull_light", { color: 0xdfe7f1, metalness: 0.5, normalScale: 1.2 }), darkMetal = pbr("hull_dark", { metalness: 0.8 });
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0xb9c5d4, metalness: 0.7, roughness: 0.32 });
  const turret = new THREE.Group(); g.add(turret);
  mesh(new THREE.CylinderGeometry(54, 62, 10, 40), darkMetal, turret, 0, 5, 0);
  mesh(new THREE.CylinderGeometry(46, 52, 10, 40), silver, turret, 0, 15, 0);
  mesh(new THREE.TorusGeometry(47, 1.6, 8, 48), glow(BLUE, 1.5), turret, 0, 21, 0).rotation.x = Math.PI / 2;
  [-1, 1].forEach((s) => { mesh(box(10, 44, 30), silver, turret, s * 30, 40, 0); mesh(box(12, 6, 32), darkMetal, turret, s * 30, 63, 0); });
  const head = new THREE.Group(); turret.add(head); head.position.y = 48;
  mesh(box(48, 34, 40), silver, head, 0, 4, 0);
  mesh(box(50, 5, 42), glow(BLUE, 1.3), head, 0, -8, 0);
  mesh(box(40, 10, 34), darkMetal, head, 0, 24, 0);
  mesh(new THREE.SphereGeometry(8, 16, 10), new THREE.MeshStandardMaterial({ color: 0x0c2f5f, metalness: 0.9, roughness: 0.1 }), head, 0, 8, 21);
  [-12, 12].forEach((x) => { mesh(new THREE.CylinderGeometry(4.6, 5.6, 56, 14), barrelMat, head, x, 54, 0); mesh(new THREE.CylinderGeometry(6.6, 6.6, 7, 14), darkMetal, head, x, 80, 0); mesh(new THREE.CylinderGeometry(6, 6, 5, 14), darkMetal, head, x, 34, 0); });
  const core = mesh(box(8, 22, 42), glow(BLUE, 2.2), head, 0, 4, 0);
  const shields = [-1, 0, 1].map((i) => mesh(box(44, 7, 16), glow(BLUE, 1.8), g));
  const flash = new THREE.PointLight(SKYBLUE, 0, 520, 0); g.add(flash);
  // one courier drone, cloned for every message. Real and fake messages get the same drone.
  const proto = new THREE.Group();
  (function () {
    const body = mesh(new THREE.CapsuleGeometry(12, 30, 6, 16), pbr("plastic_white", { metalness: 0.1, roughness: 0.6 }), proto); body.rotation.z = Math.PI / 2;
    mesh(new THREE.SphereGeometry(9, 16, 10), new THREE.MeshStandardMaterial({ color: 0x0c2f5f, metalness: 0.9, roughness: 0.1 }), proto, 0, 6, 8);
    [-1, 1].forEach((s) => { mesh(box(10, 4, 34), pbr("hull_dark", {}), proto, s * 26, 0, 0); mesh(new THREE.CylinderGeometry(5, 5, 16, 10), barrelMat, proto, s * 34, 0, 0).rotation.x = Math.PI / 2; mesh(new THREE.CylinderGeometry(3.6, 3.6, 2, 10), glow(SKYBLUE, 2.4), proto, s * 34, 0, -9).rotation.x = Math.PI / 2; });
    [-1, 1].forEach((s) => { const t = mesh(new THREE.CylinderGeometry(0.8, 0.8, 30, 4), barrelMat, proto, s * 22, -22, 0); t.rotation.z = s * 0.5; });
  })();
  let aim = 0, aimTo = 0, aimHold = 0;
  const floorY = () => -S.H / 2 + 46;
  function burst(x, y, hex, n) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const m = mesh(box(5 + Math.random() * 6, 3, 4), glow(hex, 1.6), g, x, y, 0), a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 260;
      fx.push({ m, life: 0.5, t: 0.5, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vz: (Math.random() - 0.5) * 200, spin: true });
    }
  }
  return {
    layout(W, H) {
      const fy = floorY();
      deck.scale.set(W * 4.2, 3600, 1); deck.position.set(0, fy - 16, -1450);
      edge.scale.set(W * 1.2, 1, 1); edge.position.set(0, fy - 21, 96);
      lamps.forEach((l, i) => { const s = i % 2 ? 1 : -1, k = Math.floor(i / 2); l.position.set(s * W * 0.47, fy - 13, 40 - k * 190); });
      pylons.forEach((p) => p.position.set(p.userData.s * (W * 0.9 + 260), fy + 430, -1500));
      glowBand.visible = false;
      turret.position.set(0, fy - 12, -70); turret.scale.setScalar(1.45);
      turretShadow.scale.set(330, 250, 1); turretShadow.position.set(18, fy - 15, -62);
      lane.scale.set(W * 1.1, 26, 1); lane.position.set(0, fy - 15.5, 62);
      const fz = -2900, span = W * 2.1;
      crates.forEach((c, i) => { const col = i % 7, row = i >= 7 ? 1 : 0, gap = col >= 3 ? 1 : 0; if (row) { c.position.set(-span + (i === 7 ? 0.5 : 5.5) * (span * 2 / 6.4) + (i === 7 ? 0 : span * 0.12), fy - 16 + 125 + 252, fz - 30); return; } c.position.set(-span + col * (span * 2 / 6.4) + gap * span * 0.12, fy - 16 + 125 + row * 252, fz - (col % 2) * 60); });
      far.traverse((o) => { o.frustumCulled = false; });
      beam.scale.set(span * 2.4, 1, 1); beam.position.set(0, fy + 900, fz + 200);
      legs.forEach((l, i) => { l.scale.set(1, 920, 1); l.position.set((i ? 1 : -1) * span * 0.98, fy + 430, fz + 200); });
      beamLamps.forEach((l, i) => l.position.set((i - 1) * span * 0.55, fy + 872, fz + 200));
      key2.position.set(-W * 0.25, fy + 900, 420); key2.target.position.set(0, fy, -70); key2.intensity = 2.6;
      shields.forEach((s, i) => s.position.set((i - 1) * 62, fy - 12, 110));
    },
    tick(dt, t) {
      const seen = new Set();
      S.el.querySelectorAll(".inv").forEach((n) => {
        seen.add(n);
        let d = drones.get(n); if (!d) { d = proto.clone(); d.scale.setScalar(1.5); d.userData.ph = Math.random() * 6; g.add(d); drones.set(n, d); }
        const r = S.rect(n);
        d.position.set(r.x, r.top + 52 + (reduce ? 0 : Math.sin(t * 2.4 + d.userData.ph) * 2.5), -4);
        d.rotation.y = reduce ? 0 : Math.sin(t * 0.9 + d.userData.ph) * 0.25;
      });
      drones.forEach((d, n) => { if (!seen.has(n)) { g.remove(d); drones.delete(n); } });
      const off = S.el.querySelectorAll(".base i.off").length;
      shields.forEach((s, i) => { s.material.color.set(i < 3 - off ? BLUE : 0x1d293d).multiplyScalar(i < 3 - off ? 1.8 : 1); });
      aimHold -= dt; if (aimHold <= 0) aimTo = 0;
      aim += (aimTo - aim) * Math.min(1, dt * 18); head.rotation.z = aim;
      core.material.color.set(BLUE).multiplyScalar(1.6 + Math.sin(t * 3) * 0.5);
      flash.intensity *= Math.pow(0.002, dt);
      for (let i = fx.length - 1; i >= 0; i--) {
        const f = fx[i]; f.t -= dt;
        if (f.t <= 0) { g.remove(f.m); fx.splice(i, 1); continue; }
        if (f.spin) { f.m.position.x += f.vx * dt; f.m.position.y += f.vy * dt; f.m.position.z += f.vz * dt; f.m.rotation.x += dt * 9; f.m.rotation.z += dt * 7; f.m.scale.setScalar(f.t / f.life); }
        else f.m.scale.x = f.m.scale.z = f.t / f.life;
      }
    },
    /* x and y are in CSS pixels inside the playfield. kind: hit, wrong, impact or land. */
    fire(x, y, kind) {
      const X = x - S.W / 2, Y = S.H / 2 - y, col = kind === "hit" ? SKYBLUE : kind === "land" ? BLUE : RED;
      flash.color.setHex(col); flash.position.set(X, Y, 120); flash.intensity = kind === "land" ? 2.5 : 7;
      if (kind === "hit" || kind === "wrong") {
        const from = new THREE.Vector3(0, turret.position.y + 150, -70), to = new THREE.Vector3(X, Y, 0), len = from.distanceTo(to);
        aimTo = Math.atan2(-(to.x - from.x), to.y - from.y); aim = aimTo; aimHold = 0.5;
        if (!reduce) {
          const b = mesh(new THREE.CylinderGeometry(3, 3, len, 8), glow(col, 3), g);
          b.position.copy(from).add(to).multiplyScalar(0.5); b.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.sub(from).normalize());
          fx.push({ m: b, life: 0.2, t: 0.2 });
        }
        burst(X, Y, col, kind === "hit" ? 12 : 6);
      } else if (kind === "impact") burst(X, Y + 10, RED, 8);
    },
  };
}

/* ---------- Holokaarten-sprint: a holo table in the arrival hall with a sorting chute on each side ---------- */
function sprint(S) {
  const g = S.scene;
  stars(g, 400);
  const globe = earth(g);
  const wallParts = [0, 1, 2, 3].map(() => mesh(box(1, 1, 40), pbr("hull_light", { color: 0x3d4c68, metalness: 0.55, roughness: 0.8, normalScale: 2.0, ao: true }), g));
  const winLight = (function () { const c = document.createElement("canvas"); c.width = 256; c.height = 256; const x = c.getContext("2d"); for (let i = 0; i < 3; i++) { const gr = x.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(150,200,255,.75)"); gr.addColorStop(1, "rgba(150,200,255,0)"); x.fillStyle = gr; x.beginPath(); const a = 18 + i * 78, b = a + 62; x.moveTo(a, 0); x.lineTo(b, 0); x.lineTo(b + (i - 1) * 26 + 10, 256); x.lineTo(a + (i - 1) * 26 - 10, 256); x.fill(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const m = mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending }), g); m.rotation.x = -Math.PI / 2; m.renderOrder = 1; return m; })();
  const beamTex = (function () { const c = document.createElement("canvas"); c.width = 4; c.height = 128; const x = c.getContext("2d"), gr = x.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "rgba(103,202,255,0)"); gr.addColorStop(1, "rgba(103,202,255,.55)"); x.fillStyle = gr; x.fillRect(0, 0, 4, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const proj = mesh(new THREE.CylinderGeometry(1, 0.62, 1, 40, 1, true), new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), g); proj.renderOrder = 3;          // left, right, top, sill around the window
  const mullions = [-1, 1].map(() => mesh(box(14, 1, 46), pbr("hull_dark", { metalness: 0.7 }), g));
  const wall = mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }), g);
  const shadow = contact(g);
  const spot = new THREE.SpotLight(0xfff1dc, 0, 0, 0.5, 0.6, 0); g.add(spot); g.add(spot.target);
  const strip = mesh(box(1, 5, 6), glow(SKYBLUE, 1.0), g);
  const table = mesh(new THREE.PlaneGeometry(1, 1), pbr("scifi_panel", { repeat: [8, 4], color: 0x24314a, metalness: 0.5, roughness: 0.75, normalScale: 1.2, ao: true }), g); table.rotation.x = -Math.PI / 2; table.material.envMapIntensity = 0.3;
  const rim = mesh(box(1, 16, 30), pbr("hull_light", { repeat: [8, 1], color: 0x8fa0b8, metalness: 0.5 }), g);
  // a matte landing pad with painted markings, where the next card arrives
  const pc = document.createElement("canvas"); pc.width = pc.height = 256; const pg = pc.getContext("2d");
  pg.fillStyle = "#26334a"; pg.fillRect(0, 0, 256, 256); pg.strokeStyle = "#d3e6ff"; pg.lineWidth = 3;
  pg.beginPath(); pg.arc(128, 128, 112, 0, 7); pg.stroke(); pg.lineWidth = 1.5; pg.beginPath(); pg.arc(128, 128, 70, 0, 7); pg.stroke();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; pg.beginPath(); pg.moveTo(128 + Math.cos(a) * 98, 128 + Math.sin(a) * 98); pg.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); pg.stroke(); }
  const pt = new THREE.CanvasTexture(pc); pt.colorSpace = THREE.SRGBColorSpace; pt.anisotropy = 4;
  const padMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0.2 });
  const pad = mesh(new THREE.CylinderGeometry(1, 1, 6, 48), [padMat, new THREE.MeshStandardMaterial({ map: pt, roughness: 0.85, metalness: 0.2 }), padMat], g);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x15aaff, emissive: 0x15aaff, emissiveIntensity: 0, roughness: 0.6 }), ring = mesh(new THREE.TorusGeometry(1, 0.008, 8, 64), ringMat, g); ring.rotation.x = Math.PI / 2;
  const frameMat = pbr("hull_light", { color: 0xd3dce8, metalness: 0.5, normalScale: 1.4 }), darkMat = new THREE.MeshBasicMaterial({ color: 0x0a2244 });
  const chutes = [".bin-btn.no", ".bin-btn.yes"].map((sel) => {
    const c = new THREE.Group(); g.add(c);
    const parts = [0, 1, 2, 3].map(() => mesh(box(1, 1, 1), frameMat, c));
    const back = mesh(new THREE.PlaneGeometry(1, 1), darkMat, c, 0, 0, -90);
    const lampMat = glow(SKYBLUE, 1.4), lamp = mesh(box(1, 6, 8), lampMat, c);
    return { sel, c, parts, back, lamp, lampMat, heat: 0, hex: SKYBLUE };
  });
  let last = "", ringHeat = 0, ringHex = BLUE;
  return {
    layout(W, H) {
      const wz = -620, winW = W * 0.9, winTop = H * 0.72, winBot = H * 0.02;
      wallParts.forEach((p, i) => setRepeat(p.material, (i < 2 ? W * 1.4 : winW) / 380, (i < 2 ? H * 2.6 : H) / 380));
      winLight.scale.set(winW * 1.05, 520, 1); winLight.position.set(0, -H * 0.36 + 0.6, wz + 20 + 260);
      wallParts[0].scale.set(W * 1.4, H * 2.6, 1); wallParts[0].position.set(-winW / 2 - W * 0.7, H * 0.2, wz);
      wallParts[1].scale.set(W * 1.4, H * 2.6, 1); wallParts[1].position.set(winW / 2 + W * 0.7, H * 0.2, wz);
      wallParts[2].scale.set(winW, H, 1); wallParts[2].position.set(0, winTop + H / 2, wz);
      wallParts[3].scale.set(winW, H, 1); wallParts[3].position.set(0, winBot - H / 2, wz);
      mullions.forEach((m, i) => { m.scale.set(1, winTop - winBot, 1); m.position.set((i ? 1 : -1) * winW / 6, (winTop + winBot) / 2, wz); });
      globe.scale.setScalar(2400); globe.position.set(0, -1420, -4200);
      shadow.scale.set(W * 0.55, 260, 1); shadow.position.set(0, -H * 0.36 + 1, -70);
      spot.position.set(-W * 0.2, H * 1.1, 500); spot.target.position.set(0, -H * 0.3, -80); spot.intensity = 2.4;
      strip.scale.set(W * 1.5, 1, 1); strip.position.set(0, H * 0.78, -596);
      table.scale.set(W * 2.2, 900, 1); table.position.set(0, -H * 0.36, -300);
      rim.scale.set(W * 2.2, 1, 1); rim.position.set(0, -H * 0.36 - 8, 150);
    },
    tick(dt, t) {
      const holo = S.el.querySelector(".holo");
      if (holo) {
        const r = S.rect(holo), rad = Math.min(r.w * 0.5, 210);
        pad.scale.set(rad * 1.12, 1, rad * 1.12); pad.position.set(r.x, -S.H * 0.36 + 3, -70);
        ring.scale.setScalar(rad); ring.position.set(r.x, -S.H * 0.36 + 8, -70);
        const padY = -S.H * 0.36 + 8, cardBot = r.y - r.h / 2 + 6, bh = Math.max(10, cardBot - padY);
        proj.scale.set(Math.min(r.w * 0.5, rad * 1.25), bh, rad * 0.55); proj.position.set(r.x, padY + bh / 2, -60);
        const cls = holo.className;
        if (cls !== last) {
          if (cls.indexOf("fly-l") >= 0) { chutes[0].heat = 1; chutes[0].hex = GREEN; ringHeat = 1; ringHex = GREEN; }
          if (cls.indexOf("fly-r") >= 0) { chutes[1].heat = 1; chutes[1].hex = GREEN; ringHeat = 1; ringHex = GREEN; }
          if (cls.indexOf("wrong") >= 0) { ringHeat = 1; ringHex = RED; }
          last = cls;
        }
      }
      ringHeat *= Math.pow(0.02, dt);
      ringMat.emissive.setHex(ringHex); ringMat.color.setHex(ringHeat > 0.05 ? ringHex : 0xd3e6ff); ringMat.emissiveIntensity = ringHeat * 2.2;
      chutes.forEach((c) => {
        const n = S.el.querySelector(c.sel); if (!n) return;
        const r = S.rect(n), w = r.w + 18, h = r.h + 18, d = 70;
        c.c.position.set(r.x, r.y, -30);
        c.parts[0].scale.set(w + 9, 9, d); c.parts[0].position.set(0, h / 2, 0);
        c.parts[1].scale.set(w + 9, 9, d); c.parts[1].position.set(0, -h / 2, 0);
        c.parts[2].scale.set(9, h, d); c.parts[2].position.set(-w / 2, 0, 0);
        c.parts[3].scale.set(9, h, d); c.parts[3].position.set(w / 2, 0, 0);
        c.back.scale.set(w, h, 1);
        c.lamp.scale.set(w + 9, 0.7, 1); c.lamp.position.set(0, -h / 2 - 8, 30);
        c.heat *= Math.pow(0.02, dt);
        c.lampMat.color.set(BLUE).lerp(new THREE.Color(c.hex), c.heat).multiplyScalar(1.0 + c.heat * 2.4);
      });
    },
  };
}

/* ---------- Wie mag dit zien?: a conveyor in the sick bay, each packet rides in a crate ---------- */
function poort(S) {
  const g = S.scene;
  const wall = mesh(new THREE.PlaneGeometry(1, 1), pbr("scifi_panel", { repeat: [5, 1.2], color: 0x5d6f8c, metalness: 0.6, ao: true }), g);
  const beltMat = pbr("rubber_floor", { repeat: [10, 1.5], color: 0x76859c, metalness: 0.1, roughness: 0.95 });
  const belt = mesh(new THREE.PlaneGeometry(1, 1), beltMat, g); belt.rotation.x = -Math.PI / 2;
  const railMat = pbr("hull_light", { repeat: [10, 1], color: 0xa9b8cc, metalness: 0.5 });
  const rail = mesh(box(1, 22, 18), railMat, g), railBack = mesh(box(1, 30, 12), railMat, g);
  const rollerMat = new THREE.MeshStandardMaterial({ color: 0x7f90a8, metalness: 0.3, roughness: 0.5 });
  const rollers = []; for (let i = 0; i < 26; i++) { const r = mesh(new THREE.CylinderGeometry(6, 6, 8, 14), rollerMat, g); r.rotation.x = Math.PI / 2; rollers.push(r); }
  const gate = (hex) => { const c = new THREE.Group(); g.add(c); const m = glow(hex, 1.6); mesh(box(26, 210, 60), pbr("hull_dark", { metalness: 0.7 }), c, 0, 0, 0); mesh(box(6, 150, 62), m, c, -14, 10, 0); c.userData.m = m; return c; };
  const gin = gate(SKYBLUE), gout = gate(RED);
  const crateMat = pbr("container", { color: 0x4f9fe6, metalness: 0.4, roughness: 0.95, ao: true });
  const crate = new THREE.Group(); g.add(crate);
  mesh(box(340, 126, 150), crateMat, crate); [-1, 1].forEach((s) => mesh(box(12, 132, 156), pbr("hull_dark", {}), crate, s * 166, 0, 0));
  crate.visible = false;
  const by = () => -S.H / 2 + 44;
  return {
    layout(W, H) {
      wall.scale.set(W * 2, H * 2, 1); wall.position.set(0, 0, -230);
      belt.scale.set(W * 1.6, 260, 1); belt.position.set(0, by(), -60);
      rail.scale.set(W * 1.6, 1, 1); rail.position.set(0, by() - 8, 78);
      railBack.scale.set(W * 1.6, 1, 1); railBack.position.set(0, by() + 14, -196);
      rollers.forEach((r, i) => r.position.set(-W * 0.8 + i * (W * 1.6 / 25), by() - 8, 88));
      gin.position.set(-W / 2 - 6, 0, -40); gout.position.set(W / 2 + 6, 0, -40); gout.rotation.y = Math.PI;
    },
    tick(dt, t) {
      const p = S.el.querySelector(".packet");
      crate.visible = !!p;
      if (p) { const r = S.rect(p); crate.position.set(r.x, by() + 64, -60); const k = (r.x + S.W / 2) / S.W; gout.userData.m.color.set(RED).multiplyScalar(k > 0.7 ? 1.6 + Math.sin(t * 14) * 1.2 : 1.2); }
      if (!reduce) { beltMat.map.offset.x -= dt * 0.5; beltMat.normalMap.offset.x = beltMat.roughnessMap.offset.x = beltMat.map.offset.x; }
    },
  };
}

/* ---------- Lekken dichten: nine hull panels of the station, an alarm lights the panel it belongs to ---------- */
function lekken(S) {
  const g = S.scene;
  const back = mesh(new THREE.PlaneGeometry(1, 1), pbr("heat_shield", { repeat: [4, 3], color: 0x7d8da6, metalness: 0.3 }), g);
  const frameMat = pbr("hull_dark", { color: 0xd7e0ec, metalness: 0.75 }), lampGeo = new THREE.SphereGeometry(6, 12, 8);
  const cells = [];
  S.el.querySelectorAll(".mod").forEach((n, i) => {
    const c = new THREE.Group(); g.add(c);
    const mat = pbr("hull_light", { repeat: [0.75, 0.5], color: i % 2 ? 0x596a85 : 0x66788f, metalness: 0.5, normalScale: 2.2 });
    mat.map.offset.set(i * 0.37, i * 0.21); mat.normalMap.offset.copy(mat.map.offset); mat.roughnessMap.offset.copy(mat.map.offset);
    const plate = mesh(new THREE.PlaneGeometry(1, 1), mat, c);
    const parts = [0, 1, 2, 3].map(() => mesh(box(1, 1, 1), frameMat, c));
    const washMat = new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const wash = mesh(new THREE.PlaneGeometry(1, 1), washMat, c, 0, 0, 2);
    const lampMat = glow(SKYBLUE, 0.9), lamp = mesh(lampGeo, lampMat, c);
    cells.push({ n, c, plate, parts, wash, washMat, lamp, lampMat, heat: 0, hex: AMBER });
  });
  return {
    layout(W, H) { back.scale.set(W * 2, H * 2, 1); back.position.set(0, 0, -70); },
    tick(dt, t) {
      cells.forEach((c) => {
        const r = S.rect(c.n), w = r.w, h = r.h;
        c.c.position.set(r.x, r.y, -14);
        c.plate.scale.set(w, h, 1); c.wash.scale.set(w, h, 1);
        c.parts[0].scale.set(w + 10, 10, 26); c.parts[0].position.set(0, h / 2, 0);
        c.parts[1].scale.set(w + 10, 10, 26); c.parts[1].position.set(0, -h / 2, 0);
        c.parts[2].scale.set(10, h, 26); c.parts[2].position.set(-w / 2, 0, 0);
        c.parts[3].scale.set(10, h, 26); c.parts[3].position.set(w / 2, 0, 0);
        c.lamp.position.set(w / 2 - 20, h / 2 - 20, 10);
        const cl = c.n.classList, alarm = !!c.n.querySelector(".ev");
        if (cl.contains("sealed")) { c.heat = 1; c.hex = GREEN; } else if (cl.contains("breach")) { c.heat = 1; c.hex = RED; }
        c.heat *= Math.pow(0.03, dt);
        const beat = alarm ? 0.5 + 0.5 * (reduce ? 1 : Math.sin(t * 7 + c.c.position.x)) : 0;
        if (c.heat > 0.04) { c.washMat.color.setHex(c.hex); c.washMat.opacity = c.heat * 0.4; c.lampMat.color.setHex(c.hex).multiplyScalar(2.4); }
        else if (alarm) { c.washMat.color.setHex(AMBER); c.washMat.opacity = 0.05 + beat * 0.1; c.lampMat.color.setHex(AMBER).multiplyScalar(1 + beat * 2.2); }
        else { c.washMat.opacity = 0; c.lampMat.color.setHex(SKYBLUE).multiplyScalar(0.8); }
      });
    },
  };
}

const BUILD = { invaders, sprint, poort, lekken };

function unmount() {
  if (!R) return;
  const S = R; R = null; S.alive = false;
  cancelAnimationFrame(S.raf); if (S.ro) S.ro.disconnect();
  S.scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  S.renderer.dispose(); try { S.renderer.forceContextLoss(); } catch (e) {}
  S.canvas.remove(); S.el.classList.remove("pf3d");
}

function mount(el, id) {
  unmount();
  if (!el || !BUILD[id] || !ready) return null;
  const canvas = document.createElement("canvas"); canvas.className = "pf"; canvas.setAttribute("aria-hidden", "true");
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }); } catch (e) { return null; }
  el.insertBefore(canvas, el.firstChild); el.classList.add("pf3d");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x030a1a);
  scene.environment = environment(renderer); scene.environmentIntensity = 0.9;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 20, 9000);
  const key = new THREE.DirectionalLight(0xfff0dc, 2.3); key.position.set(-0.55, 0.8, 1); scene.add(key);
  const rim = new THREE.DirectionalLight(0x67caff, 1.3); rim.position.set(0.9, 0.3, -0.6); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xa9d4ff, 0x0a1830, 0.9));
  loadEnv(renderer, { invaders: "env_hangar", poort: "env_medbay", sprint: "env_corridor", lekken: "env_studio" }[id]).then((t) => { if (S.alive) { scene.environment = t; scene.environmentIntensity = 0.7; } }, () => {});
  const S = { el, id, canvas, renderer, scene, camera, W: 0, H: 0, alive: true, raf: 0, box: null };
  S.rect = (n) => { const r = n.getBoundingClientRect(), b = S.box; return { x: r.left - b.left + r.width / 2 - S.W / 2, y: S.H / 2 - (r.top - b.top + r.height / 2), top: S.H / 2 - (r.top - b.top), w: r.width, h: r.height }; };
  S.game = BUILD[id](S);
  function size() {
    const W = el.clientWidth, H = el.clientHeight; if (!W || !H) return;
    S.W = W; S.H = H; renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.position.set(0, 0, H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2))); camera.updateProjectionMatrix();
    if (S.game.layout) S.game.layout(W, H);
  }
  size();
  if (window.ResizeObserver) { S.ro = new ResizeObserver(size); S.ro.observe(el); }
  const clock = new THREE.Clock();
  (function frame() {
    if (!S.alive) return;
    S.raf = requestAnimationFrame(frame);
    if (!el.isConnected) { unmount(); return; }
    const dt = Math.min(clock.getDelta(), 0.1);
    S.box = el.getBoundingClientRect();
    if (S.W) { S.game.tick(dt, clock.elapsedTime); renderer.render(scene, camera); }
  })();
  R = S;
  return { fire: (x, y, kind) => { if (S.alive && S.game.fire) S.game.fire(x, y, kind); } };
}

let ready = false;
loadTextures().then(() => { ready = true; window.OrionArcade = { mount, unmount }; });
