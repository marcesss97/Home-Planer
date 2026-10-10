/* Home-Planer: checks the built-in recipe book (ideen.js and buch-*.js), without a browser.
   Run:  node tests/buch.test.js                 all files
         node tests/buch.test.js buch-asien.js   ideen.js and this one file only
   Errors make the run fail; hints (ingredients without a shop aisle, steps without a timer …) are listed for a look. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const only = process.argv.slice(2).filter(a => /\.js$/.test(a) && a !== "ideen.js");
const files = ["ideen.js"].concat(only.length ? only : fs.readdirSync(ROOT).filter(f => /^buch-[a-z0-9-]+\.js$/.test(f)).sort());
const sandbox = { window: {}, Intl, Math, Date, JSON, Number, String, Array, Object, RegExp, isFinite, isNaN, Float64Array, Int8Array, console, WeakMap };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "logic.js"), "utf8"), sandbox, { filename: "logic.js" });
const errors = [], hints = [];
const from = {};
files.forEach(f => {
  const before = (sandbox.window.HP_IDEEN || []).length;
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f }); }
  catch (e) { errors.push(f + ": lässt sich nicht laden: " + e.message); return; }
  (sandbox.window.HP_IDEEN || []).slice(before).forEach(r => { if (r && r.id) from[r.id] = f; });
});
const HP = sandbox.window.HP, raw = sandbox.window.HP_IDEEN || [];

/* Meat and fish, also inside compound words ("Pouletbrust", "Rindsbouillon"), but not "gehackt", "Kuchenteig" or "Käserinde". */
const MEAT = /(fleisch|poulet|huhn|hühner|hähnchen|chicken|(?<![a-zäöü])rinds?(?![a-zäöü]*e\b)|rindfleisch|kalb|schwein|(?<![a-zäöü])lamm|(?<![a-zäöüg])hack|wurst|würst|cervelat|salami|schinken|speck|bacon|lachs|thon|thunfisch|fisch|crevetten|garnelen|scampi|muscheln|tintenfisch|calamar|steak|plätzli|chorizo|prosciutto|pancetta|guanciale|bresaola|sardellen|anchovis|gelatine|austernsauce|(?<![a-zäöü])dashi(?![a-zäöü]*\s*\(kombu)|bonito|worcestershire|(?<![a-zäöü])enten?(brust|keule)?(?![a-zäöü])|entrecôte|kotelett|lardons|merguez|sucuk|geschnetzeltes|(?<![a-zäöü])filet)/i;
const ANIMAL = /(milch|rahm|butter|käse|joghurt|jogurt|\bei\b|\beier\b|eigelb|eiweiss|honig|quark|mozzarella|parmesan|pecorino|gruyère|sbrinz|feta|mascarpone|ricotta|halloumi|labneh|ghee|paneer|crème fraîche|creme fraiche|sauerrahm|schmand|raclettekäse|bratbutter|butterschmalz)/i;
const PLANT = /(kokos|hafer|soja|mandel|reis|erbsen|cashew|dinkel)[- ]?(milch|rahm|joghurt|drink|sahne)|erdnussbutter|mandelbutter|pflanzenbutter|vegane?[rsn]?\s+\w+|margarine|kakaobutter|butterbohnen|butternut|buttermilch-ersatz/gi;
const STYLE_BAD = [[/ß/, "ß statt ss"], [/\bSahne\b/i, "Sahne statt Rahm"], [/Hähnchen/i, "Hähnchen statt Poulet"], [/Möhre/i, "Möhre statt Rüebli"], [/Schlagsahne/i, "Schlagsahne statt Rahm"]];
const STYLE_HINT = [[/\bZucchini\b/, "Zucchini → Zucchetti"], [/Tomatenmark/, "Tomatenmark → Tomatenpüree"], [/Paprikaschote/, "Paprikaschote → Peperoni"], [/\bQuark\b.*Magerquark/, ""]];

const ids = new Set(), titles = new Set();
const perKitchen = {}, perColl = {}, unknownShop = {}, gluten = { free: 0, swap: 0, contains: 0 };
raw.forEach((x, i) => {
  const where = (x && x.id ? x.id : "#" + i) + " (" + (from[x && x.id] || "?") + ")";
  const err = m => errors.push(where + ": " + m), hint = m => hints.push(where + ": " + m);
  if (!x || typeof x !== "object") return err("kein Eintrag");
  if (typeof x.id !== "string" || !/^idee-[a-z0-9]+(-[a-z0-9]+)*$/.test(x.id) || x.id.length > 40) err("id muss idee-… sein (Kleinbuchstaben, Ziffern, Bindestriche, höchstens 40 Zeichen)");
  if (ids.has(x.id)) err("id doppelt"); ids.add(x.id);
  const tl = String(x.title || "").toLowerCase();
  if (!x.title || x.title.length > 60) err("Titel fehlt oder ist länger als 60 Zeichen");
  if (titles.has(tl)) err("Titel doppelt: " + x.title); titles.add(tl);
  if (!HP.isDish(x.emoji)) err("emoji unbekannt: " + x.emoji);
  if (!HP.RECIPE_CATS.some(c => c.id === x.cat)) err("cat unbekannt: " + x.cat);
  if (!Array.isArray(x.tags) || x.tags.some(t => !HP.RECIPE_TAGS.some(c => c.id === t)) || new Set(x.tags).size !== x.tags.length) err("tags unbekannt oder doppelt: " + JSON.stringify(x.tags));
  if (!HP.isKitchen(x.kitchen)) err("kitchen fehlt oder unbekannt: " + x.kitchen);
  if (x.coll !== undefined && (!Array.isArray(x.coll) || x.coll.some(c => !HP.isCollection(c)))) err("coll unbekannt: " + JSON.stringify(x.coll));
  if (!Number.isInteger(x.time) || x.time < 5 || x.time > 600) err("time (Minuten) fehlt oder unplausibel: " + x.time);
  if (!Number.isInteger(x.serves) || x.serves < 1 || x.serves > 12) err("serves unplausibel: " + x.serves);
  if (!Array.isArray(x.ingr) || x.ingr.length < 3 || x.ingr.length > 25) err("ingr: 3 bis 25 Zeilen");
  if (!Array.isArray(x.steps) || x.steps.length < 2 || x.steps.length > 10) err("steps: 2 bis 10 Schritte");
  if (x.note !== undefined && (typeof x.note !== "string" || x.note.length > 400)) err("note: Text bis 400 Zeichen");
  const ingr = Array.isArray(x.ingr) ? x.ingr : [], steps = Array.isArray(x.steps) ? x.steps : [];
  ingr.forEach(l => { if (typeof l !== "string" || !l.trim() || l.length > 120 || l !== l.trim()) err("Zutat leer, zu lang oder mit Leerschlag am Rand: " + JSON.stringify(l)); });
  steps.forEach(s => { if (typeof s !== "string" || s.length < 15 || s.length > 500 || s !== s.trim()) err("Schritt zu kurz, zu lang oder mit Leerschlag am Rand: " + JSON.stringify(String(s).slice(0, 60))); });
  const all = [x.title, x.note || ""].concat(ingr, steps).join("\n");
  STYLE_BAD.forEach(([re, m]) => { if (re.test(all)) err("Schreibweise: " + m); });
  STYLE_HINT.forEach(([re, m]) => { if (m && re.test(all)) hint("Schreibweise: " + m); });
  const r = HP.normRecipe(x.id, x);
  if (!r || r.ingr.length !== ingr.length || r.steps.length !== steps.length || r.kitchen !== x.kitchen) err("geht beim Einlesen verloren (normRecipe)");
  /* vegi and vegan must hold for every ingredient */
  const ingText = ingr.join("\n"), plantless = ingText.replace(PLANT, " ");
  const tags = Array.isArray(x.tags) ? x.tags : [];
  if ((tags.includes("vegi") || tags.includes("vegan")) && MEAT.test(ingText)) err("als vegi markiert, enthält aber: " + ingText.match(MEAT)[0]);
  if (tags.includes("vegan") && ANIMAL.test(plantless)) err("als vegan markiert, enthält aber: " + plantless.match(ANIMAL)[0]);
  if (!tags.includes("vegi") && !tags.includes("vegan") && !MEAT.test(ingText) && x.cat !== "sweet") hint("kein Fleisch und kein Fisch gefunden: vielleicht vegi?");
  if (tags.includes("quick") && x.time > 35) err("als schnell markiert, dauert aber " + x.time + " Minuten");
  /* cooking mode: timers come from durations in the steps */
  if (x.time >= 25 && !steps.some(s => HP.durations(s).length)) hint("kein Schritt mit Zeitangabe: der Kochmodus bietet keinen Timer an");
  /* shopping list: every ingredient should land in an aisle */
  ingr.forEach(l => {
    if (HP.isStaple(l)) return;
    const name = HP.splitQty(l).name.replace(/\(.*?\)/g, " ").split(",")[0].trim();
    if (HP.shopGuess(name) === "other") unknownShop[name] = (unknownShop[name] || 0) + 1;
  });
  if (r) {
    const t = HP.traits(r);
    gluten[t.gf.level]++;
    if (["main", "soup", "salad"].indexOf(x.cat) >= 0 && !t.mains.length) hint("keine Hauptzutat erkannt (Filter «Hauptzutat» findet es nicht)");
  }
  perKitchen[x.kitchen] = (perKitchen[x.kitchen] || 0) + 1;
  (x.coll || []).forEach(c => { perColl[c] = (perColl[c] || 0) + 1; });
});

const full = !process.argv.slice(2).some(a => /\.js$/.test(a));
if (full) {
  HP.KITCHENS.forEach(k => { if ((perKitchen[k.id] || 0) < 2) errors.push("Küche " + k.label + ": nur " + (perKitchen[k.id] || 0) + " Rezepte"); });
  if (raw.length < 250) errors.push("Das Rezeptbuch hat erst " + raw.length + " Rezepte");
  if ((perColl.glasiert || 0) < 10) errors.push("Sammlung «Glasiertes Poulet mit Reis»: erst " + (perColl.glasiert || 0));
  if ((perColl.ottolenghi || 0) < 10) errors.push("Sammlung «Im Stil von Ottolenghi»: erst " + (perColl.ottolenghi || 0));
  if (HP.ideas().length !== raw.length) errors.push("HP.ideas() liest " + HP.ideas().length + " von " + raw.length);
}
const unk = Object.keys(unknownShop).sort();
if (unk.length) hints.push("Zutaten ohne Abteilung auf der Einkaufsliste (" + unk.length + "): " + unk.join(", "));
if (process.argv.includes("-v") || errors.length) hints.forEach(h => console.log("  · " + h));
errors.forEach(e => console.error("✗ " + e));
console.log((errors.length ? "✗ " + errors.length + " Fehler, " : "✓ ") + raw.length + " Rezepte geprüft (" + files.join(", ") + "), " + hints.length + " Hinweise" +
  (full ? "\n  Küchen: " + HP.KITCHENS.map(k => k.id + " " + (perKitchen[k.id] || 0)).join(" · ") + "\n  Sammlungen: " + JSON.stringify(perColl) + "\n  Glutenfrei: " + JSON.stringify(gluten) : ""));
process.exit(errors.length ? 1 : 0);
