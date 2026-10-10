/* Home-Planer: tests of the recipe import (import.js) and the cooking helpers, without a browser.
   Run:  node tests/import.test.js
   The pages in tests/fixtures are modelled on the way recipe sites publish their recipes (schema.org JSON-LD). */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert");
const sandbox = { window: {}, Intl, Math, Date, JSON, Number, String, Array, Object, RegExp, isFinite, isNaN, Float64Array, Int8Array, console, Promise, setTimeout, clearTimeout };
vm.createContext(sandbox);
["logic.js", "import.js"].forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, "..", f), "utf8"), sandbox));
const HP = sandbox.window.HP, I = sandbox.window.HPImport;
const fx = f => fs.readFileSync(path.join(__dirname, "fixtures", f), "utf8");
let n = 0, failed = 0, queue = Promise.resolve();
/* One test after the other: the loading tests each put their own stand-in for fetch in place. */
function test(name, fn) {
  const report = e => { failed++; console.error("✗ " + name + "\n  " + (e && (e.message || e.code || JSON.stringify(e)))); };
  queue = queue.then(() => { try { return Promise.resolve(fn()).then(() => { n++; }, report); } catch (e) { report(e); } });
}
const eq = (a, b, m) => assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), b, m);

/* ---------- web pages ---------- */
test("Fooby-like page: recipe from JSON-LD in @graph, entities decoded, times added", () => {
  const r = I.fromHtml(fx("fooby-artig.html"), "https://fooby.ch/de/rezepte/1/x");
  assert.strictEqual(r.how, "schema");
  const d = r.draft;
  assert.strictEqual(d.title, "Älplermagronen mit Apfelmus & Zwiebeln");
  assert.strictEqual(d.time, 45); assert.strictEqual(d.serves, 4);
  assert.strictEqual(d.ingr.length, 7); assert.strictEqual(d.ingr[4], "150 g Gruyère, gerieben");
  assert.strictEqual(d.steps.length, 4); assert.match(d.steps[1], /12 Minuten/);
  eq(d.tags, ["vegi"]); assert.strictEqual(d.link, "https://fooby.ch/de/rezepte/1/x");
  assert.match(d.note, /Klassiker aus den Bergen[\s\S]*Quelle: fooby\.ch/);
});
test("Migusto-like page: @type as a list, sections become prefixes, vegan diet, yield as list", () => {
  const d = I.fromHtml(fx("migusto-artig.html"), "https://migusto.migros.ch/x").draft;
  assert.strictEqual(d.title, "Gemüsecurry mit Kokosmilch");
  assert.strictEqual(d.time, 70); assert.strictEqual(d.serves, 4);
  eq(d.steps, ["Curry: Zwiebel und Knoblauch hacken, andünsten.", "Currypaste und Kokosmilch beigeben, 15 Minuten köcheln.", "Reis: Reis nach Packungsangabe kochen."]);
  eq(d.tags, ["vegan"]); assert.strictEqual(d.emoji, "curry");
});
test("Chefkoch-like page: instructions as one text with line breaks, &frac12;", () => {
  const d = I.fromHtml(fx("chefkoch-artig.html"), "https://www.chefkoch.de/x").draft;
  assert.strictEqual(d.serves, 6); assert.strictEqual(d.steps.length, 3);
  assert.ok(d.ingr.indexOf("1 ½ TL Salz") >= 0); assert.strictEqual(d.cat, "soup");
});
test("Instagram-like page: caption on one line, unfolded into ingredients and steps", () => {
  const r = I.fromHtml(fx("instagram-artig.html"), "https://www.instagram.com/p/abc/");
  assert.strictEqual(r.how, "text");
  const d = r.draft;
  assert.strictEqual(d.title, "One Pot Pasta"); assert.strictEqual(d.serves, 2);
  eq(d.ingr, ["200 g Spaghetti", "250 g Cherrytomaten", "2 Knoblauchzehen", "1 Zwiebel", "5 dl Gemüsebouillon", "1 Handvoll Basilikum"]);
  assert.strictEqual(d.steps.length, 1); assert.ok(!/#/.test(d.steps[0]), "hashtags removed");
  assert.ok(d.tags.indexOf("vegan") < 0, "parmesan in the steps: not vegan");
});
test("a page without a recipe gives nothing", () => {
  assert.strictEqual(I.fromHtml("<html><head><title>Kontakt</title></head><body><p>Telefon 044 123 45 67</p></body></html>", "https://x.ch"), null);
});
test("JSON-LD: broken blocks are skipped, nested mainEntity is found", () => {
  const html = '<script type="application/ld+json">{oops</script><script type="application/ld+json">{"@type":"WebPage","mainEntity":{"@type":"Recipe","name":"Wähe","recipeIngredient":["1 Teig"],"recipeInstructions":"Backen."}}</script>';
  assert.strictEqual(I.findRecipe(html).name, "Wähe");
});
test("times and links", () => {
  assert.strictEqual(I.isoMinutes("PT1H30M"), 90); assert.strictEqual(I.isoMinutes("P0DT0H45M"), 45); assert.strictEqual(I.isoMinutes("PT90S"), 2); assert.strictEqual(I.isoMinutes("bald"), 0);
  assert.strictEqual(I.normUrl("Schau: https://fooby.ch/de/rezepte/1/a?x=1, lecker!"), "https://fooby.ch/de/rezepte/1/a?x=1");
  assert.strictEqual(I.normUrl("javascript:alert(1)"), "");
});

/* ---------- text from screenshots and messages ---------- */
test("screenshot text: app chrome and ratings ignored, quantity and name in two columns, wrapped lines joined", () => {
  const d = I.fromText(fx("screenshot-text.txt"));
  assert.strictEqual(d.title, "Shakshuka"); assert.strictEqual(d.time, 25); assert.strictEqual(d.serves, 2);
  eq(d.ingr, ["1 Zwiebel", "2 Knoblauchzehen", "1 Peperoni", "400 g gehackte Tomaten", "1 TL Kreuzkümmel", "4 Eier", "2 EL Olivenöl", "Petersilie zum Bestreuen"]);
  eq(d.steps, ["Zwiebel, Knoblauch und Peperoni klein schneiden und im Olivenöl andünsten.", "Gewürze und Tomaten dazugeben und 10 Minuten einköcheln.",
    "Vier Mulden formen, die Eier hineinschlagen und zugedeckt 5 bis 8 Minuten stocken lassen."]);
});
test("a caption without headings: the dish named in «… für 4 Personen» becomes the title", () => {
  const d = I.fromText(fx("caption-ohne-titel.txt"));
  assert.strictEqual(d.title, "Kürbissuppe"); assert.strictEqual(d.serves, 4); assert.strictEqual(d.cat, "soup");
  eq(d.ingr, ["1 kg Kürbis", "1 Zwiebel", "8 dl Gemüsebouillon", "1 dl Kokosmilch"]);
  eq(d.tags, ["vegan", "quick"]);
});
test("typical reading errors of the text recognition are put right", () => {
  assert.strictEqual(I.fixOcr("2 di Rahm\n1 I Milch\n2 EI Öl"), "2 dl Rahm\n1 l Milch\n2 EL Öl");
});
test("splitting long instructions into steps", () => {
  eq(I.splitSteps("1. Wasser kochen. 2. Pasta rein. 3. Abgiessen."), ["Wasser kochen.", "Pasta rein.", "Abgiessen."]);
  assert.ok(I.splitSteps("Satz eins ist lang genug und hört nicht auf. ".repeat(10)).length > 2);
});

/* ---------- loading pages ---------- */
test("loading a link: readers are tried in turn, schema wins", () => {
  const calls = [];
  sandbox.fetch = (url) => {
    calls.push(url);
    if (url.indexOf("allorigins") >= 0) return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(fx("fooby-artig.html")) });
    return Promise.reject(new Error("blocked"));
  };
  const steps = [];
  return I.fromLink("https://fooby.ch/de/rezepte/1/a", s => steps.push(s)).then(r => {
    assert.strictEqual(r.how, "schema"); assert.strictEqual(r.draft.serves, 4);
    assert.strictEqual(calls.length, 2); assert.strictEqual(steps.length, 2);
  });
});
test("loading a link: nothing reachable gives a clear error", () => {
  sandbox.fetch = () => Promise.reject(new Error("offline"));
  return I.fromLink("https://example.ch/x").then(() => { throw new Error("should fail"); }, e => assert.strictEqual(e.code, "fetch"));
});
test("loading a link: a page without a recipe says so", () => {
  sandbox.fetch = () => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve("<html><body>" + "Impressum und Kontakt. ".repeat(20) + "</body></html>") });
  return I.fromLink("https://example.ch/x").then(() => { throw new Error("should fail"); }, e => assert.strictEqual(e.code, "norecipe"));
});

/* ---------- cooking mode ---------- */
test("timers found in steps", () => {
  const c = [["Im Ofen etwa 30 Minuten backen.", [1800]], ["5 bis 8 Minuten stocken lassen", [300]], ["1½ Stunden schmoren, dann 10 Min. ruhen", [5400, 600]],
    ["eine halbe Stunde kühl stellen", [1800]], ["zwei Minuten kochen und 30 Sek. rühren", [120, 30]], ["Viertelstunde ziehen lassen", [900]], ["bei 200 °C backen", []], ["In 20-25 min goldbraun", [1200]]];
  c.forEach(([t, want]) => eq(HP.durations(t).map(d => d.secs), want, t));
  assert.strictEqual(HP.secsLabel(5400), "1 Std. 30 Min.");
});
test("ingredients named in a step", () => {
  const ing = ["2 Knoblauchzehen", "1 Zwiebel", "1 Dose gehackte Tomaten (400 g)", "150 g Gruyère, gerieben", "2 EL Olivenöl", "Salz, Pfeffer"];
  eq(HP.stepIngredients("Zwiebel und Knoblauch hacken und im Olivenöl andünsten.", ing), [0, 1, 4]);
  eq(HP.stepIngredients("Tomaten dazugeben und mit Salz würzen.", ing), [2, 5]);
  eq(HP.stepIngredients("Ruhen lassen.", ing), []);
  eq(HP.stepIngredients("Magronen und Tomaten in der Bouillon kochen.", ["300 g Älplermagronen", "250 g Cherrytomaten", "5 dl Gemüsebouillon", "1 l Salzwasser"]), [0, 1, 2]);
});

/* ---------- stores ---------- */
test("aisle order per store, saved orders completed with new aisles", () => {
  assert.strictEqual(HP.aisleOrder({}, "migros")[0], "produce");
  assert.strictEqual(HP.aisleOrder({}, "").length, HP.SHOP.length);
  const o = HP.aisleOrder({ aisles: { coop: ["frozen", "produce", "nonsense"] } }, "coop");
  assert.strictEqual(o[0], "frozen"); assert.strictEqual(o[1], "produce"); assert.strictEqual(o.length, HP.SHOP.length); assert.ok(o.indexOf("nonsense") < 0);
  const h = HP.normHome("h".repeat(22), { name: "x", base: "CHF", store: "aldi", aisles: { migros: ["meat", "x"], lidl: ["a"] } });
  assert.strictEqual(h.store, ""); eq(h.aisles, { migros: ["meat"] });
  assert.ok(/^https:\/\/www\.coop\.ch\//.test(HP.storeOf("coop").search) && /^https:\/\/www\.migros\.ch\//.test(HP.storeOf("migros").search));
});

queue.then(() => {
  console.log((failed ? "✗ " + failed + " failed, " : "✓ ") + n + " passed");
  process.exit(failed ? 1 : 0);
});
