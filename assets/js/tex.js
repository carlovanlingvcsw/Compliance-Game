/* Shared textures for the station and the arcade playfields.
   Source: ambientCG, CC0 1.0 (see assets/textures/CREDITS.md). Each set has color, normal and orm
   (R = ambient occlusion, G = roughness, B = metalness), prepared by tools/prepare-textures.py.
   The single-file bundle puts the images in window.ORION_TEX as data URLs. */
import * as THREE from "three";

const SETS = ["hull_light", "hull_dark", "hull_white", "foil", "truss", "grate", "container", "solar", "scifi_panel", "rubber_floor", "heat_shield", "plastic_white"];
const MAPS = ["color", "normal", "orm"];
const DATA = window.ORION_TEX || null;
const base = DATA ? "" : new URL("../textures/", import.meta.url).href;
const images = {};
let pending = null;

function flat(map) {
  const c = document.createElement("canvas"); c.width = c.height = 2;
  const g = c.getContext("2d"); g.fillStyle = map === "normal" ? "#8080ff" : map === "orm" ? "#ffa080" : "#9aa6b6"; g.fillRect(0, 0, 2, 2);
  return c;
}
/* Loads every image once. A missing image becomes a flat colour, so the station still starts. */
export function loadTextures() {
  if (pending) return pending;
  const loader = new THREE.ImageLoader();
  pending = Promise.all(SETS.flatMap((s) => MAPS.map((m) => {
    const key = s + "/" + m;
    return loader.loadAsync(DATA ? DATA[key] : base + key + ".jpg").then((img) => { images[key] = img; }, () => { images[key] = flat(m); });
  })));
  return pending;
}
export function tex(name, map, repeat, srgb) {
  const t = new THREE.Texture(images[name + "/" + map] || flat(map));
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.repeat.set(repeat[0], repeat[1]);
  t.needsUpdate = true;
  return t;
}
/* A physically based material from one texture set. Options: repeat, color, metalness, roughness,
   normalScale, ao (use the occlusion channel), and map / normal / orm set to false to leave one out. */
export function pbr(name, o = {}) {
  const r = o.repeat || [1, 1];
  const m = new THREE.MeshStandardMaterial({ color: o.color ?? 0xffffff, metalness: o.metalness ?? 1, roughness: o.roughness ?? 1 });
  if (o.map !== false) m.map = tex(name, "color", r, true);
  if (o.normal !== false) { m.normalMap = tex(name, "normal", r); const s = o.normalScale ?? 1; m.normalScale.set(s, s); }
  if (o.orm !== false) { const t = tex(name, "orm", r); m.roughnessMap = t; m.metalnessMap = t; if (o.ao) m.aoMap = t; }
  return m;
}
