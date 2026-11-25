// Builds one self-contained HTML file from the project, like the original download.
// Handy for sending by mail or uploading to an LMS. Usage: node tools/bundle.mjs
// Output: dist/AVG-game_Ruimtestation_Orion.html
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const dataUri = (p) => "data:image/png;base64," + fs.readFileSync(path.join(root, p)).toString("base64");
// A function as replacement keeps "$" in CSS and JS literal.
const swap = (s, from, to) => s.replace(from, () => to);
const safeScript = (js) => js.replace(/<\/script/gi, "<\\/script");

const brand = read("assets/css/vcsw-brand.css");

// The level list lives in the launcher; read it from there so there is one source.
const launcherJs = read("assets/js/launcher.js");
const listSrc = launcherJs.match(/var LEVELS = (\[[\s\S]*?\]);/)[1];
const levels = Function(`"use strict"; return (${listSrc});`)();

const bundled = levels.map((l) => {
  const dir = path.dirname(l.src);
  let html = read(l.src);
  html = swap(html, '<link rel="stylesheet" href="../../assets/css/vcsw-brand.css">\n<link rel="stylesheet" href="style.css">',
    "<style>\n" + brand + "\n" + read(path.join(dir, "style.css")) + "</style>");
  html = swap(html, '<script src="game.js"></script>', "<script>\n" + safeScript(read(path.join(dir, "game.js"))) + "</script>");
  html = html.replace(/src="\.\.\/\.\.\/(assets\/img\/[^"]+\.png)"/g, (m, p) => `src="${dataUri(p)}"`);
  if (/href="[^"#:]+\.css"|src="[^":]+\.(js|png)"/.test(html)) throw new Error(`Niet alles ingebakken in ${l.src}`);
  return { tag: l.tag, name: l.name, b64: Buffer.from(html, "utf8").toString("base64") };
});

let js = launcherJs
  .replace(/var LEVELS = \[[\s\S]*?\];/, () => "var LEVELS = " + JSON.stringify(bundled) + ";")
  .replace("f.src = LEVELS[i].src;", "f.srcdoc = decode(LEVELS[i].b64);")
  .replace("var frames = [], cur = -1;", () => `var frames = [], cur = -1;
  function decode(b64) {
    var bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }`);

let index = read("index.html");
index = swap(index, '<link rel="stylesheet" href="assets/css/vcsw-brand.css">\n<link rel="stylesheet" href="assets/css/launcher.css">',
  "<style>\n" + brand + "\n" + read("assets/css/launcher.css") + "</style>");
index = swap(index, '<script src="assets/js/launcher.js"></script>', "<script>\n" + safeScript(js) + "</script>");

const out = path.join(root, "dist", "AVG-game_Ruimtestation_Orion.html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, index);
console.log(`Gebundeld: ${path.relative(root, out)} (${Math.round(index.length / 1024)} kB, ${levels.length} levels)`);
