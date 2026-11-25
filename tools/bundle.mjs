// Builds one self-contained HTML file of the whole game: station, shell, levels and arcade.
// Handy for sending by mail or uploading to an LMS. Usage: node tools/bundle.mjs
// Output: dist/AVG-game_Ruimtestation_Orion.html
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const dataUri = (p, type) => `data:${type};base64,` + fs.readFileSync(path.join(root, p)).toString("base64");
// A function as replacement keeps "$" in CSS and JS literal.
const swap = (s, from, to) => {
  if (!s.includes(from)) throw new Error(`Niet gevonden: ${from}`);
  return s.replace(from, () => to);
};
const safeScript = (js) => js.replace(/<\/script/gi, "<\\/script");
const inlineImages = (html, prefix) =>
  html.replace(new RegExp(`src="${prefix.replace(/\./g, "\\.")}(assets/img/[^"]+\\.png)"`, "g"), (m, p) => `src="${dataUri(p, "image/png")}"`);

const brand = read("assets/css/vcsw-brand.css");

// The level list lives in the shell; read it from there so there is one source.
const shellJs = read("assets/js/orion.js");
const srcs = [...shellJs.matchAll(/src: "(levels\/[^"]+\/index\.html)"/g)].map((m) => m[1]);
if (srcs.length !== 6) throw new Error(`Verwacht 6 levels, gevonden: ${srcs.length}`);

const levelHtml = srcs.map((src) => {
  const dir = path.dirname(src);
  let html = read(src);
  html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) => "<style>\n" + read(path.join(dir, href)) + "\n</style>");
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, s) => "<script>\n" + safeScript(read(path.join(dir, s))) + "\n</script>");
  html = inlineImages(html, "../../");
  if (/href="[^"#:]+\.css"|src="[^":]+\.(js|png)"/.test(html)) throw new Error(`Niet alles ingebakken in ${src}`);
  return { src, b64: Buffer.from(html, "utf8").toString("base64") };
});

// Shell: levels come from the bundle instead of separate files.
let js = shellJs;
levelHtml.forEach((l) => { js = swap(js, `src: "${l.src}"`, `src: "${l.src}", b64: "${l.b64}"`); });
js = swap(js, "f.src = LEVELS[n].src;", `if (LEVELS[n].b64) {
      var bin = atob(LEVELS[n].b64), bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      f.srcdoc = new TextDecoder("utf-8").decode(bytes);
    } else f.src = LEVELS[n].src;`);

// Station: three.js, the addons and the game's own modules are linked into ONE plain script.
// No import map and no data-URL modules, because sandboxed previews refuse scripts from data addresses.
const modFiles = { three: "assets/vendor/three.module.js" };
const addonRoot = path.join(root, "assets/vendor/addons");
for (const dir of fs.readdirSync(addonRoot)) for (const file of fs.readdirSync(path.join(addonRoot, dir))) modFiles[`three/addons/${dir}/${file}`] = `assets/vendor/addons/${dir}/${file}`;
for (const mod of ["tex.js", "arcade3d.js", "station.js"]) modFiles[`orion/${mod}`] = `assets/js/${mod}`;
const resolveId = (from, spec) => spec.startsWith(".") ? path.posix.join(path.posix.dirname(from), spec) : spec;
const names = (list) => list.split(",").map((x) => x.trim()).filter(Boolean).map((x) => x.split(/\s+as\s+/));
function linkModule(id) {
  let code = read(modFiles[id]); const deps = [], exported = [];
  const dep = (spec) => { const d = resolveId(id, spec); if (!modFiles[d]) throw new Error(`Onbekende module ${spec} in ${id}`); deps.push(d); return JSON.stringify(d); };
  code = code.replace(/^import\s*\*\s*as\s+(\w+)\s+from\s*['"]([^'"]+)['"];?/gm, (m, n, spec) => `const ${n} = __m[${dep(spec)}];`);
  code = code.replace(/^import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/gm, (m, list, spec) => `const { ${names(list).map(([a, b]) => b ? `${a}: ${b}` : a).join(", ")} } = __m[${dep(spec)}];`);
  code = code.replace(/^import\s*['"]([^'"]+)['"];?/gm, (m, spec) => { dep(spec); return ""; });
  code = code.replace(/export\s*\{([^}]+)\}\s*;?/g, (m, list) => { names(list).forEach(([a, b]) => exported.push([b || a, a])); return ""; });
  code = code.replace(/^export\s+((?:async\s+)?function\s*\*?|class|const|let)\s+(\w+)/gm, (m, kind, n) => { exported.push([n, n]); return `${kind} ${n}`; });
  if (/^\s*(import|export)\s/m.test(code)) throw new Error(`Niet alle import of export omgezet in ${id}`);
  code = code.replace(/import\.meta\.url/g, "location.href");
  return { deps, js: `__m[${JSON.stringify(id)}] = await (async function () {\n"use strict";\n${code}\nreturn { ${exported.map(([k, v]) => k === v ? k : `${k}: ${v}`).join(", ")} };\n})();` };
}
const linked = [], seenMods = new Set();
(function visit(id) { if (seenMods.has(id)) return; seenMods.add(id); const m = linkModule(id); m.deps.forEach(visit); linked.push(m.js); })("orion/station.js");
const stationScript = "window.__orionStation = async function () {\nconst __m = {};\n" + linked.join("\n") + "\n};";

let index = read("index.html");
index = swap(index, '<link rel="stylesheet" href="assets/css/vcsw-brand.css">\n<link rel="stylesheet" href="assets/css/orion.css">',
  "<style>\n" + brand + "\n" + read("assets/css/orion.css") + "\n</style>");
const texRoot = path.join(root, "assets/textures"), tex = {};
for (const set of fs.readdirSync(texRoot)) if (fs.statSync(path.join(texRoot, set)).isDirectory())
  for (const file of fs.readdirSync(path.join(texRoot, set))) tex[`${set}/${file.replace(".jpg", "")}`] = dataUri(`assets/textures/${set}/${file}`, "image/jpeg");
for (const file of fs.readdirSync(path.join(root, "assets/hdri"))) if (file.endsWith(".hdr")) tex[`hdri/${file.replace(".hdr", "")}`] = dataUri(`assets/hdri/${file}`, "application/octet-stream");
index = swap(index, '<script type="importmap">{ "imports": { "three": "./assets/vendor/three.module.js", "three/addons/": "./assets/vendor/addons/", "orion/": "./assets/js/" } }</script>', "");
index = swap(index, '<script src="assets/js/orion.js"></script>', "<script>window.ORION_TEX = " + JSON.stringify(tex) + ";</script>\n" + '<script src="assets/js/orion.js"></script>');
index = swap(index, '<script src="assets/js/orion.js"></script>', "<script>\n" + safeScript(js) + "\n</script>");
index = swap(index, 'var s = document.createElement("script"); s.type = "module"; s.src = "assets/js/station.js";\n    s.onerror = function () { document.documentElement.classList.add("no-3d"); };\n    document.body.appendChild(s);',
  'window.__orionStation().catch(function (e) { console.error(e); document.documentElement.classList.add("no-3d"); });');
index = swap(index, "<script>\n  /* The 3D station", "<script>\n" + safeScript(stationScript) + "\n</script>\n<script>\n  /* The 3D station");
index = inlineImages(index, "");
if (/href="[^"#:]+\.css"|src="assets\//.test(index)) throw new Error("Niet alles ingebakken in index.html");

const out = path.join(root, "dist", "AVG-game_Ruimtestation_Orion.html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, index);
console.log(`Gebundeld: ${path.relative(root, out)} (${Math.round(index.length / 1024)} kB, ${levelHtml.length} levels)`);
