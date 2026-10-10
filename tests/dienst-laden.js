/* Home-Planer: helper for the tests of the service (dienst-worker.js). It keeps the copies of logic.js, ics.js and
   erinnerungen.js inside the service up to date and loads the service without Cloudflare.
   node tests/dienst.test.js --update   writes the current files into dienst-worker.js */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, ".."), FILE = path.join(ROOT, "dienst-worker.js");
const PARTS = ["logic.js", "ics.js", "erinnerungen.js"];
const marks = name => ["// ---- " + name + " (Kopie, nicht hier ändern) ----\n", "// ---- Ende " + name + " ----\n"];
const source = () => fs.readFileSync(FILE, "utf8");
function copyOf(src, name) {
  const [a, b] = marks(name), i = src.indexOf(a), j = src.indexOf(b);
  return i >= 0 && j > i ? src.slice(i + a.length, j) : null;
}
/* Names of the files whose copy inside the service differs from the file itself. */
function stale() {
  const src = source();
  return PARTS.filter(p => copyOf(src, p) !== fs.readFileSync(path.join(ROOT, p), "utf8"));
}
function update() {
  let src = source();
  PARTS.forEach(p => {
    const [a, b] = marks(p), i = src.indexOf(a), j = src.indexOf(b);
    if (i < 0 || j < i) throw new Error("markers for " + p + " missing in dienst-worker.js");
    src = src.slice(0, i + a.length) + fs.readFileSync(path.join(ROOT, p), "utf8") + src.slice(j);
  });
  fs.writeFileSync(FILE, src);
}
/* The service in its own context. Its fetch is box.fetch (set by the test); the default export ends up in box.__worker. */
function load() {
  const src = source().replace(/^export default \{/m, "globalThis.__worker = {");
  const box = { console, URL, Response, Request, Headers, TextEncoder, TextDecoder, crypto: globalThis.crypto, btoa, atob, Uint8Array, Uint32Array, DataView,
    Date, Math, JSON, Object, Array, String, Number, RegExp, Map, Set, Promise, Intl, Error, isFinite, isNaN, parseInt, Float64Array, Int8Array };
  vm.createContext(box);
  vm.runInContext(src, box, { filename: "dienst-worker.js" });
  return box;
}
module.exports = { FILE, PARTS, stale, update, load };
