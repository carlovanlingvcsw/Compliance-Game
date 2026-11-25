/* Shared textures for the station and the arcade playfields.
   Source: ambientCG, CC0 1.0 (see assets/textures/CREDITS.md). Each set has color, normal and orm
   (R = ambient occlusion, G = roughness, B = metalness), prepared by tools/prepare-textures.py.
   The single-file bundle puts the images in window.ORION_TEX as data URLs. */
import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const SETS = ["hull_light", "hull_dark", "hull_white", "foil", "truss", "grate", "container", "solar", "scifi_panel", "rubber_floor", "heat_shield", "plastic_white"];
const MAPS = ["color", "normal", "orm"];
const EXTRA = ["earth/color", "earth/night", "earth/ocean"]; // single images: the earth, from NASA imagery (public domain)
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
  const keys = SETS.flatMap((s) => MAPS.map((m) => s + "/" + m)).concat(EXTRA);
  let done = 0;
  const step = () => { done++; window.dispatchEvent(new CustomEvent("orion-load", { detail: done / keys.length })); };
  pending = Promise.all(keys.map((key) =>
    loader.loadAsync(DATA ? DATA[key] : base + key + ".jpg").then((img) => { images[key] = img; step(); }, () => { images[key] = flat(key.split("/")[1]); step(); })));
  return pending;
}
/* Reflections from a real environment: HDRI maps from Poly Haven, CC0 (see assets/hdri/CREDITS.md).
   The file is read once; every renderer gets its own prefiltered copy. */
const envData = {};
/* In the single-file build the HDR sits in the page as base64. Decode it here instead of fetching a data address, which some sandboxes refuse. */
function hdrFromData(uri) {
  try {
    const bin = atob(uri.slice(uri.indexOf(",") + 1)), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const d = new RGBELoader().parse(bytes.buffer), t = new THREE.DataTexture(d.data, d.width, d.height, THREE.RGBAFormat, d.type);
    t.colorSpace = THREE.LinearSRGBColorSpace; t.minFilter = t.magFilter = THREE.LinearFilter; t.generateMipmaps = false; t.flipY = true; t.needsUpdate = true;
    return Promise.resolve(t);
  } catch (e) { return Promise.reject(e); }
}
export function loadEnv(renderer, name) {
  envData[name] = envData[name] || (DATA ? hdrFromData(DATA["hdri/" + name]) : new RGBELoader().loadAsync(new URL("../hdri/" + name + ".hdr", import.meta.url).href));
  return envData[name].then((hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    const pm = new THREE.PMREMGenerator(renderer), t = pm.fromEquirectangular(hdr).texture; pm.dispose(); return t;
  });
}
export function tex(name, map, repeat, srgb) {
  const t = new THREE.Texture(images[name + "/" + map] || flat(map));
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
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
