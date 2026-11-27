/* Ruimtestation Orion: the 3D playfield of the arcade round Wie mag dit zien?
   The round keeps its HTML controls (buttons, packets, labels), so keyboard and screen reader
   use stay the same. This module draws the sick bay behind them: wall, conveyor, rollers, gates.
   It follows the HTML elements every frame, so the game rules live in one place (orion.js).
   One unit in the scene is one CSS pixel at the depth of the controls. */
import * as THREE from "three";
import { loadTextures, loadEnv, pbr } from "orion/tex.js";

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

const BUILD = { poort };

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
  loadEnv(renderer, { poort: "env_medbay" }[id]).then((t) => { if (S.alive) { scene.environment = t; scene.environmentIntensity = 0.7; } }, () => {});
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
