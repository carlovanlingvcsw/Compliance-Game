/* Proefhal Orion: gedeelde 3D-basis voor de spellen met een speelveld in three.js.
   Alles in code: geometrie, texturen (canvas) en licht. Licht genoeg voor een laptop zonder
   losse grafische kaart: één schaduwloze lichtopstelling, een omgevingskaart uit een kleine
   scène, beeldsnelheid omlaag als het tabblad niet zichtbaar is. */
import * as THREE from "three";

export { THREE };
export const COL = { blue: 0x15aaff, sky: 0x67caff, deep: 0x06224c, navy: 0x0c2f5f, amber: 0xffb900, red: 0xff6467, green: 0x05df72, white: 0xe2e8f0 };
const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function webglOK() {
  try { const c = document.createElement("canvas"); return !!(window.WebGL2RenderingContext && c.getContext("webgl2")); } catch (e) { return false; }
}

/* Een studio-omgeving voor reflecties: drie lichtvlakken in een donkere doos. */
function envMap(renderer) {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x0b1a34, side: THREE.BackSide })));
  const panel = (color, k, w, h, p) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(...p); m.lookAt(0, 0, 0); env.add(m); };
  panel(0xfff1dc, 4.5, 8, 5, [-5, 7, 5]); panel(0x67caff, 2.2, 12, 4, [6, -4, 3]); panel(0xd3efff, 1.3, 4, 10, [0, 3, -9]); panel(0xffffff, 1.2, 14, 2, [0, 9, 0]);
  const pm = new THREE.PMREMGenerator(renderer), t = pm.fromScene(env, 0.04).texture; pm.dispose(); return t;
}

/* De speelruimte: renderer in een container, camera, licht, lus en klikken. */
export function stage(container, o = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: !!o.alpha, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, o.maxDpr || 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.05;
  if (o.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none";
  const scene = new THREE.Scene();
  scene.environment = envMap(renderer);
  if (o.bg !== false) scene.background = new THREE.Color(o.bg || 0x030c20);
  const camera = new THREE.PerspectiveCamera(o.fov || 35, 1, 0.1, 400);
  const hemi = new THREE.HemisphereLight(0xbfe3ff, 0x0a1428, 0.55); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff3e2, 2.2); key.position.set(-6, 10, 8); scene.add(key);
  if (o.shadows) { key.castShadow = true; key.shadow.mapSize.set(1024, 1024); const s = key.shadow.camera; s.left = -12; s.right = 12; s.top = 12; s.bottom = -12; s.near = 1; s.far = 40; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.02; }
  const rim = new THREE.DirectionalLight(0x67caff, 1.4); rim.position.set(8, 4, -8); scene.add(rim);
  const S = { THREE, renderer, scene, camera, key, rim, hemi, W: 1, H: 1, t: 0, dt: 0, updaters: [], clickables: [], hover: null, reduce };
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  function size() {
    const r = container.getBoundingClientRect(); S.W = Math.max(1, r.width); S.H = Math.max(1, r.height);
    renderer.setSize(S.W, S.H, false); camera.aspect = S.W / S.H; camera.updateProjectionMatrix(); o.onResize && o.onResize(S);
  }
  new ResizeObserver(size).observe(container); size();
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hits = ray.intersectObjects(S.clickables, true);
    for (const h of hits) { let n = h.object; while (n && !n.userData.onClick) n = n.parent; if (n) return n; }
    return null;
  }
  renderer.domElement.addEventListener("pointermove", (e) => { const n = pick(e); if (n !== S.hover) { S.hover && S.hover.userData.onHover && S.hover.userData.onHover(false); S.hover = n; n && n.userData.onHover && n.userData.onHover(true); } renderer.domElement.style.cursor = n ? "pointer" : "default"; });
  renderer.domElement.addEventListener("pointerleave", () => { if (S.hover) { S.hover.userData.onHover && S.hover.userData.onHover(false); S.hover = null; } });
  renderer.domElement.addEventListener("click", (e) => { const n = pick(e); if (n) n.userData.onClick(n, e); });
  S.clickable = (obj, onClick, onHover) => { obj.userData.onClick = onClick; obj.userData.onHover = onHover; S.clickables.push(obj); return obj; };
  S.onFrame = (fn) => S.updaters.push(fn);
  let last = performance.now(), running = true;
  function loop(now) {
    if (!running) return;
    requestAnimationFrame(loop);
    if (document.hidden) { last = now; return; }
    S.dt = Math.min(0.05, (now - last) / 1000); last = now; S.t += S.dt;
    for (const f of S.updaters) f(S.dt, S.t);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);
  S.stop = () => { running = false; };
  S.renderOnce = () => renderer.render(scene, camera);
  /* Projectie van een 3D-punt naar pixels in de container, voor HTML-labels boven het speelveld. */
  const v = new THREE.Vector3();
  S.toScreen = (obj, offset) => { obj.getWorldPosition(v); if (offset) v.add(offset); v.project(camera); return { x: (v.x + 1) / 2 * S.W, y: (1 - v.y) / 2 * S.H, behind: v.z > 1 }; };
  return S;
}

/* ---------- Procedurele texturen ---------- */
function canvas(w, h, draw) { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); return c; }
function noise(g, w, h, a, seed) { let s = seed || 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647); const img = g.getImageData(0, 0, w, h), d = img.data; for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * a; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(img, 0, 0); }
/* Geborsteld metaal met panelen, naden en klinknagels. */
export function panelTex(o = {}) {
  const base = o.base || "#8a98ad", seam = o.seam || "rgba(10,20,40,.55)", cols = o.cols || 2, rows = o.rows || 2, size = o.size || 512;
  const c = canvas(size, size, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y++) { g.fillStyle = `rgba(255,255,255,${0.02 + 0.03 * Math.sin(y * 0.7) * Math.sin(y * 0.13)})`; g.fillRect(0, y, w, 1); }
    noise(g, w, h, 14, o.seed);
    g.strokeStyle = seam; g.lineWidth = 3;
    for (let i = 0; i <= cols; i++) { g.beginPath(); g.moveTo(i * w / cols, 0); g.lineTo(i * w / cols, h); g.stroke(); }
    for (let i = 0; i <= rows; i++) { g.beginPath(); g.moveTo(0, i * h / rows); g.lineTo(w, i * h / rows); g.stroke(); }
    g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 1;
    for (let i = 0; i <= cols; i++) { g.beginPath(); g.moveTo(i * w / cols + 2.5, 0); g.lineTo(i * w / cols + 2.5, h); g.stroke(); }
    if (o.rivets !== false) for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const x0 = i * w / cols, y0 = j * h / rows, pw = w / cols, ph = h / rows; [[10, 10], [pw - 10, 10], [10, ph - 10], [pw - 10, ph - 10]].forEach(([x, y]) => { g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.arc(x0 + x + 0.8, y0 + y + 0.8, 3.2, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.arc(x0 + x, y0 + y, 2.6, 0, 7); g.fill(); }); }
    if (o.stripe) { g.fillStyle = o.stripe; g.fillRect(0, h * 0.86, w, h * 0.04); }
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  if (o.repeat) t.repeat.set(o.repeat[0], o.repeat[1]);
  return t;
}
/* Ruwheid uit dezelfde naden: naden matter, vlakken iets glanzender. */
export function roughTex(o = {}) {
  const cols = o.cols || 2, rows = o.rows || 2;
  const c = canvas(256, 256, (g, w, h) => { g.fillStyle = "#7a7a7a"; g.fillRect(0, 0, w, h); noise(g, w, h, 40, 3); g.strokeStyle = "#f0f0f0"; g.lineWidth = 3; for (let i = 0; i <= cols; i++) { g.beginPath(); g.moveTo(i * w / cols, 0); g.lineTo(i * w / cols, h); g.stroke(); } for (let i = 0; i <= rows; i++) { g.beginPath(); g.moveTo(0, i * h / rows); g.lineTo(w, i * h / rows); g.stroke(); } });
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (o.repeat) t.repeat.set(o.repeat[0], o.repeat[1]); return t;
}
export function metal(o = {}) {
  return new THREE.MeshStandardMaterial({ color: o.color || 0xffffff, map: o.map === false ? null : panelTex(o), roughnessMap: o.rough === false ? null : roughTex(o), roughness: o.roughness ?? 0.55, metalness: o.metalness ?? 0.6, envMapIntensity: o.env ?? 1 });
}
export function plain(color, o = {}) { return new THREE.MeshStandardMaterial({ color, roughness: o.roughness ?? 0.5, metalness: o.metalness ?? 0.3, envMapIntensity: o.env ?? 1, transparent: !!o.opacity, opacity: o.opacity ?? 1 }); }
export function glow(color, k = 1) { return new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), toneMapped: true }); }

/* Tekst als textuur: voor labels op lades, kratten en schermen. */
export function textTex(lines, o = {}) {
  const w = o.w || 512, h = o.h || 256, pad = o.pad ?? 28;
  const c = canvas(w, h, (g) => {
    if (o.bg) { g.fillStyle = o.bg; g.fillRect(0, 0, w, h); }
    if (o.border) { g.strokeStyle = o.border; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); }
    let y = pad; (Array.isArray(lines) ? lines : [lines]).forEach((ln) => {
      const L = typeof ln === "string" ? { t: ln } : ln, size = L.size || o.size || 44;
      g.font = `${L.weight || 700} ${size}px Figtree, Inter, system-ui, sans-serif`; g.fillStyle = L.color || o.color || "#ffffff"; g.textBaseline = "top"; g.textAlign = o.align || "left";
      const x = o.align === "center" ? w / 2 : pad;
      wrap(g, L.t, x, y, w - pad * 2, size * 1.18).forEach(() => {}); y += (L.lines || 1) * size * 1.18 + (L.gap ?? 8);
    });
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function wrap(g, text, x, y, maxW, lh) { const words = String(text).split(" "); let line = "", out = []; for (const wd of words) { const test = line ? line + " " + wd : wd; if (g.measureText(test).width > maxW && line) { out.push(line); line = wd; } else line = test; } out.push(line); out.forEach((l, i) => g.fillText(l, x, y + i * lh)); return out; }

/* ---------- Vormen ---------- */
/* Een doos met afgeronde randen: leest als gemodelleerd onderdeel in plaats van een kale kubus. */
export function rbox(w, h, d, r = 0.06, seg = 3) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2; r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001);
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const bev = Math.min(r, d / 4);
  const g = new THREE.ExtrudeGeometry(s, { depth: d - bev * 2, bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.9, bevelSegments: seg, curveSegments: seg * 2 });
  g.translate(0, 0, -(d - bev * 2) / 2); g.computeVertexNormals();
  // UV's per vlak vereenvoudigen: kaart over voor- en achterkant
  // UV's per richting: voor- en achterkant op x/y, zijkanten op z/y, boven en onder op x/z
  const pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const ax = Math.abs(nor.getX(i)), ay = Math.abs(nor.getY(i)), az = Math.abs(nor.getZ(i)), x = (pos.getX(i) + w / 2) / w, y = (pos.getY(i) + h / 2) / h, z = (pos.getZ(i) + d / 2) / d;
    if (az >= ax && az >= ay) uv.setXY(i, x, y); else if (ax >= ay) uv.setXY(i, z * d / w, y); else uv.setXY(i, x, z * d / h);
  }
  return g;
}
export function mesh(geo, mat, parent, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (parent) parent.add(m); return m; }

/* Sterren achter een raam, en de aarde onder het station. */
export function stars(parent, n = 600, R = 120) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const u = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u); pos.set([s * Math.cos(t) * R, u * R, s * Math.sin(t) * R], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xd3e6ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.85, fog: false })); parent.add(p); return p;
}
export function earthTex() {
  const c = canvas(1024, 512, (g, w, h) => {
    const sea = g.createLinearGradient(0, 0, 0, h); sea.addColorStop(0, "#0b3d7a"); sea.addColorStop(0.5, "#0e5aa6"); sea.addColorStop(1, "#0a3d78"); g.fillStyle = sea; g.fillRect(0, 0, w, h);
    let s = 11; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let k = 0; k < 26; k++) { const cx = r() * w, cy = h * (0.2 + r() * 0.6), rad = 30 + r() * 90; g.fillStyle = ["#2f6b3a", "#3f7d43", "#6e8a4a", "#8b7d55"][k % 4]; g.beginPath(); for (let a = 0; a < 7; a += 0.35) { const rr = rad * (0.6 + r() * 0.5); g.lineTo(cx + Math.cos(a) * rr * 1.4, cy + Math.sin(a) * rr * 0.8); } g.fill(); }
    g.fillStyle = "#e9f1f8"; g.fillRect(0, 0, w, 28); g.fillRect(0, h - 24, w, 24);
    for (let k = 0; k < 90; k++) { g.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.4})`; g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 70, 5 + r() * 12, r() * 0.6, 0, 7); g.fill(); }
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* Rustig bewegen naar een doel, ook zonder vaste beeldsnelheid. */
export function damp(cur, to, k, dt) { return cur + (to - cur) * (1 - Math.exp(-k * dt)); }
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export { reduce };
