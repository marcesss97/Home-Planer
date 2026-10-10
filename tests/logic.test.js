/* Home-Planer: tests of the arithmetic in logic.js, without a browser.  Run:  node tests/logic.test.js */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert");
const sandbox = { window: {}, Intl, Math, Date, JSON, Number, String, Array, Object, isFinite, isNaN, Float64Array, Int8Array, console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "logic.js"), "utf8"), sandbox);
const HP = sandbox.window.HP;
let n = 0, failed = 0;
function test(name, fn) { try { fn(); n++; } catch (e) { failed++; console.error("✗ " + name + "\n  " + (e && e.message)); } }
const eq = (a, b, m) => assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), b, m);
/* A small seeded random source, so a failing case can be repeated. */
let seed = 20261010;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pick = a => a[Math.floor(rnd() * a.length)];

/* ---------- amounts ---------- */
test("parseAmount reads Swiss and foreign notations", () => {
  const cases = [["12.50", 1250], ["12,5", 1250], ["1'234.50", 123450], ["1’234.50", 123450], ["45+12.5", 5750], ["1.500", 150000], ["1,500", 150000], ["1.234,50", 123450], ["0.05", 5], ["", null], ["abc", null], ["1.2.3", null], ["12..5", null]];
  cases.forEach(([s, v]) => assert.strictEqual(HP.parseAmount(s, "CHF"), v, s));
  assert.strictEqual(HP.parseAmount("1500", "JPY"), 1500);
  assert.strictEqual(HP.parseAmount("1.500", "KWD"), 1500);
});
test("money and signed format with the Swiss apostrophe", () => {
  assert.strictEqual(HP.money(245000, "CHF").replace(/ /g, " "), "CHF 2’450.00");
  assert.strictEqual(HP.signed(-1250, "CHF"), "−12.50");
  assert.strictEqual(HP.signed(0, "CHF"), "0.00");
});

/* ---------- splitting and settling ---------- */
test("allocate always sums to the total, also with random weights", () => {
  for (let i = 0; i < 3000; i++) {
    const k = 1 + Math.floor(rnd() * 9), w = Array.from({ length: k }, () => (rnd() < 0.15 ? 0 : Math.round(rnd() * 5 * 2) / 2));
    const total = Math.floor(rnd() * 1e7) * (rnd() < 0.1 ? -1 : 1), out = HP.allocate(total, w, i);
    const W = w.reduce((a, b) => a + (b > 0 ? b : 0), 0);
    assert.strictEqual(out.reduce((a, b) => a + b, 0), W > 0 ? total : 0);
    w.forEach((x, j) => { if (!(x > 0)) assert.strictEqual(out[j], 0); else assert.ok(Math.abs(out[j] - total * x / W) < 1); });
  }
});
function randomHome(k) {
  const members = {};
  for (let i = 0; i < k; i++) members["m" + i] = { name: "P" + i, c: i, o: i };
  return HP.normHome("h".repeat(22), { name: "Test", base: "CHF", members });
}
function randomExpense(home, i) {
  const ids = Object.keys(home.members), payer = pick(ids), amount = 1 + Math.floor(rnd() * 500000), mode = pick(["equal", "shares", "exact", "items"]);
  const raw = { amount, cur: "CHF", payer, date: "2026-0" + (1 + Math.floor(rnd() * 9)) + "-1" + Math.floor(rnd() * 9), mode, cat: pick(HP.CATS).id };
  if (rnd() < 0.15) return HP.normExpense("t" + i, { kind: "transfer", amount, cur: "CHF", payer, to: pick(ids.filter(x => x !== payer)) || payer, date: "2026-05-05" });
  const part = ids.filter(() => rnd() < 0.7);
  if (!part.length) part.push(payer);
  if (mode === "equal") raw.for = part;
  if (mode === "shares") { raw.weights = {}; part.forEach(id => { raw.weights[id] = 0.5 + Math.floor(rnd() * 6) / 2; }); }
  if (mode === "exact") { raw.weights = {}; const a = HP.allocate(amount, part.map(() => rnd() + 0.1), i); part.forEach((id, j) => { if (a[j] > 0) raw.weights[id] = a[j]; }); }
  if (mode === "items") { raw.for = part; raw.items = [{ name: "a", amount: Math.floor(amount / 2), for: part.slice(0, 1) }, { name: "b", amount: amount - Math.floor(amount / 2), for: part }]; }
  return HP.normExpense("x" + i, raw);
}
test("balances sum to zero and the settle plan squares everybody", () => {
  for (let r = 0; r < 400; r++) {
    const home = randomHome(2 + Math.floor(rnd() * 7)), ex = [];
    for (let i = 0; i < 1 + rnd() * 25; i++) { const e = randomExpense(home, i); if (e) ex.push(e); }
    const bal = HP.balances(home, ex), net = HP.netOf(bal);
    assert.strictEqual(Object.values(net).reduce((a, b) => a + b, 0), 0);
    const plan = HP.settle(net), after = Object.assign({}, net);
    plan.payments.forEach(p => { assert.ok(p.amount > 0); after[p.from] += p.amount; after[p.to] -= p.amount; });
    Object.values(after).forEach(v => assert.strictEqual(v, 0));
    assert.ok(plan.payments.length <= Math.max(0, Object.values(net).filter(v => v !== 0).length - 1));
  }
});
test("expense checks name what is missing", () => {
  const home = randomHome(3);
  assert.match(HP.check({ amount: 0 }, home), /Betrag/);
  assert.match(HP.check({ amount: 100, payer: "m0", kind: "transfer", to: "m0", cur: "CHF", date: "2026-01-01" }, home), /sich selbst/);
  assert.match(HP.check({ amount: 100, payer: "m0", mode: "exact", weights: { m0: 40 }, cur: "CHF", date: "2026-01-01" }, home), /Differenz/);
  assert.strictEqual(HP.check({ amount: 100, payer: "m0", mode: "equal", for: ["m0", "m1"], cur: "CHF", date: "2026-01-01" }, home), null);
  assert.match(HP.check({ amount: 100, payer: "m0", mode: "equal", for: ["m0"], cur: "EUR", date: "2026-01-01" }, home), /Wechselkurs/);
});
test("statistics: per month, period filter and a fair monthly average", () => {
  const home = randomHome(2);
  const ex = [["2025-12-03", 1000], ["2026-08-03", 1000], ["2026-10-01", 500]].map(([date, amount], i) => HP.normExpense("x" + i, { amount, cur: "CHF", payer: "m0", date, for: ["m0", "m1"] }));
  const all = HP.stats(home, ex, null, "all", "2026-10-10"), year = HP.stats(home, ex, null, "year", "2026-10-10"), month = HP.stats(home, ex, null, "month", "2026-10-10");
  assert.strictEqual(all.total, 2500); assert.strictEqual(all.nMonths, 11); assert.strictEqual(all.months.length, 11);
  assert.strictEqual(year.total, 2500); assert.strictEqual(year.months.length, 12); assert.strictEqual(year.months[0].month, "2025-11");
  assert.strictEqual(month.total, 500); assert.strictEqual(month.nMonths, 1);
  assert.strictEqual(HP.stats(home, ex, "m1", "all", "2026-10-10").total, 1250);
});

/* ---------- shopping list ---------- */
test("shopping: aisles by the longest keyword", () => {
  const cases = { "Weisswein": "drinks", "Eisbergsalat": "produce", "Reis": "pantry", "Vollkornbrot": "bakery", "Milchschokolade": "sweets", "Orangensaft": "drinks", "WC-Papier": "clean",
    "Eier": "dairy", "Zahnpasta": "care", "Hörnli": "pantry", "Eistee": "drinks", "Rüebli": "produce", "Poulet": "meat", "Tiefkühlpizza": "frozen", "Glühbirne": "clean", "Velo-Schloss": "other" };
  Object.keys(cases).forEach(k => assert.strictEqual(HP.shopGuess(k), cases[k], k));
});
test("shopping: quantities at the start or the end", () => {
  eq(HP.splitQty("2 Liter Milch"), { name: "Milch", qty: "2 Liter" });
  eq(HP.splitQty("Milch 2l"), { name: "Milch", qty: "2l" });
  eq(HP.splitQty("3x Joghurt"), { name: "Joghurt", qty: "3x" });
  eq(HP.splitQty("500 g Hackfleisch"), { name: "Hackfleisch", qty: "500 g" });
  eq(HP.splitQty("  Brot  "), { name: "Brot", qty: "" });
  eq(HP.splitQty("Coca Cola 1.5l"), { name: "Coca Cola", qty: "1.5l" });
});
test("shopping: normItem refuses nameless items and unknown aisles", () => {
  assert.strictEqual(HP.normItem("s1", { name: "   " }), null);
  assert.strictEqual(HP.normItem("s1", { name: "Brot", sec: "constructor" }).sec, "other");
  assert.strictEqual(HP.normItem("s1", { name: "Brot", done: "yes" }).done, false);
});

/* ---------- calendar ---------- */
const ev = o => HP.normEvent("e" + Math.floor(rnd() * 1e9), Object.assign({ title: "T", date: "2026-01-31" }, o));
const dates = (es, a, b) => HP.occurrences(es, a, b).map(o => o.date);
test("calendar: monthly on the 31st skips short months, yearly on 29 February skips common years", () => {
  eq(dates([ev({ repeat: "monthly" })], "2026-01-01", "2026-06-30"), ["2026-01-31", "2026-03-31", "2026-05-31"]);
  eq(dates([ev({ date: "2024-02-29", repeat: "yearly" })], "2025-01-01", "2028-12-31"), ["2028-02-29"]);
});
test("calendar: weekly, every two weeks, until and cancelled dates", () => {
  eq(dates([ev({ date: "2026-10-06", repeat: "weekly", skip: ["2026-10-13"] })], "2026-10-01", "2026-10-31"), ["2026-10-06", "2026-10-20", "2026-10-27"]);
  eq(dates([ev({ date: "2020-03-15", repeat: "biweekly" })], "2026-10-01", "2026-10-31"), ["2026-10-04", "2026-10-18"]);
  eq(dates([ev({ date: "2026-10-06", repeat: "weekly", until: "2026-10-20" })], "2026-10-01", "2026-12-31"), ["2026-10-06", "2026-10-13", "2026-10-20"]);
});
test("calendar: events over several days appear on every day, also when they began before the window", () => {
  const o = HP.occurrences([ev({ date: "2026-12-30", end: "2027-01-02", repeat: "monthly" })], "2027-01-01", "2027-02-01");
  eq(o.map(x => x.date), ["2027-01-01", "2027-01-02", "2027-01-30", "2027-01-31", "2027-02-01"]);
  assert.ok(o[2].first && !o[0].first && o[1].last);
});
test("calendar: repetitions match a brute-force expansion", () => {
  /* Brute force: every day from the first date on is checked for being a start, then each start is spread over its days. */
  const isStart = (date, repeat, d) => {
    if (d < date) return false;
    if (repeat === "none") return d === date;
    if (repeat === "weekly") return HP.dayDiff(date, d) % 7 === 0;
    if (repeat === "biweekly") return HP.dayDiff(date, d) % 14 === 0;
    if (repeat === "monthly") return d.slice(8) === date.slice(8);
    return d.slice(5) === date.slice(5);
  };
  for (let r = 0; r < 300; r++) {
    const date = HP.addDays("2025-01-01", Math.floor(rnd() * 700)), repeat = pick(["none", "weekly", "biweekly", "monthly", "yearly"]), len = rnd() < 0.3 ? Math.floor(rnd() * 5) : 0;
    const e = ev({ date, end: len ? HP.addDays(date, len) : "", repeat });
    const from = HP.addDays("2025-01-01", Math.floor(rnd() * 900)), to = HP.addDays(from, Math.floor(rnd() * 60));
    const want = [];
    for (let s = date; s <= to; s = HP.addDays(s, 1)) {
      if (!isStart(date, repeat, s)) continue;
      for (let k = 0; k <= len; k++) { const d = HP.addDays(s, k); if (d >= from && d <= to) want.push(d); }
    }
    eq(dates([e], from, to), want.sort(), JSON.stringify({ date, repeat, len, from, to }));
  }
});
test("calendar: eventCheck and normEvent keep times and ends sane", () => {
  assert.match(HP.eventCheck({ title: "", date: "2026-01-01" }), /Titel/);
  assert.match(HP.eventCheck({ title: "x", date: "2026-01-05", end: "2026-01-01" }), /Ende/);
  assert.match(HP.eventCheck({ title: "x", date: "2026-01-05", time: "18:00", endTime: "17:00" }), /Endzeit/);
  const e = HP.normEvent("e1", { title: "x", date: "2026-01-05", time: "25:00", endTime: "10:00", repeat: "daily", who: ["m1", "__proto__"] });
  assert.strictEqual(e.time, ""); assert.strictEqual(e.endTime, ""); assert.strictEqual(e.repeat, "none"); eq(e.who, ["m1"]);
});

/* ---------- plants ---------- */
test("plants: due dates, never watered, fertiliser and the log", () => {
  const p = HP.normPlant("p1", { name: "Monstera", every: 7, last: "2026-10-01", feedEvery: 30 });
  eq(HP.plantDue(p, "2026-10-10"), { next: "2026-10-08", days: -2, never: false });
  assert.strictEqual(HP.plantDue(HP.normPlant("p2", { name: "Neu" }), "2026-10-10").never, true);
  assert.strictEqual(HP.feedDue(p, "2026-10-10").never, true);
  assert.strictEqual(HP.feedDue(HP.normPlant("p3", { name: "x" })), null);
  let q = p;
  for (let i = 0; i < 40; i++) q = Object.assign({}, q, HP.careFields(q, i % 5 ? "w" : "f", HP.addDays("2026-01-01", i), "m1"));
  assert.strictEqual(q.log.length, 30); assert.strictEqual(q.log[0].d, "2026-02-09"); assert.strictEqual(q.last, "2026-02-09");
  assert.strictEqual(HP.normPlant("p4", { name: "x", every: 0 }).every, 7);
  assert.strictEqual(HP.normPlant("p4", { name: "x", every: 9999 }).every, 7);
  assert.strictEqual(HP.normPlant("p4", { name: "x", emoji: "toString" }).emoji, "topf");
});

/* ---------- infos ---------- */
test("infos: only http and https links survive", () => {
  const i = HP.normInfo("i1", { title: "Police", links: [{ t: "a", u: "javascript:alert(1)" }, { t: "b", u: "https://drive.google.com/file/d/x" }, { t: "c", u: "data:text/html,x" }, { t: "d", u: "http://example.ch/x" }] });
  eq(i.links.map(l => l.t), ["b", "d"]);
  assert.strictEqual(HP.okUrl("https://exa mple.ch"), false);
});
test("infos: fields, deadlines and unknown kinds", () => {
  const i = HP.normInfo("i1", { title: "Hausrat", cat: "__proto__", fields: [{ k: "Police", v: "123" }, { k: "", v: "  " }, "junk"], due: "2026-11-15" });
  assert.strictEqual(i.cat, "other"); eq(i.fields, [{ k: "Police", v: "123" }]);
  assert.strictEqual(HP.dueOf(i, "2026-10-10"), 36);
  assert.strictEqual(HP.normInfo("i2", { title: " " }), null);
});

/* ---------- recipes ---------- */
test("recipes: scaling quantities to other portions", () => {
  const c = [["200 g Spaghetti", 1.5, "300 g Spaghetti"], ["1/2 TL Salz", 0.5, "¼ TL Salz"], ["½ Bund Petersilie", 2, "1 Bund Petersilie"], ["3 Eier", 1.5, "5 Eier"],
    ["1 Zwiebel", 0.5, "½ Zwiebel"], ["1-2 Chilischoten", 2, "2-4 Chilischoten"], ["1.5 dl Rahm", 2, "3 dl Rahm"], ["Salz, Pfeffer", 3, "Salz, Pfeffer"], ["125 g Butter", 1.5, "188 g Butter"], ["2 EL Öl", 1, "2 EL Öl"]];
  c.forEach(([l, f, want]) => assert.strictEqual(HP.scaleLine(l, f), want, l + " x" + f));
});
test("recipes: quantities with kitchen units and fractions", () => {
  eq(HP.splitQty("2 EL Olivenöl"), { name: "Olivenöl", qty: "2 EL" });
  eq(HP.splitQty("1/2 TL Zimt"), { name: "Zimt", qty: "1/2 TL" });
  eq(HP.splitQty("½ Bund Schnittlauch"), { name: "Schnittlauch", qty: "½ Bund" });
  eq(HP.splitQty("1 Dose gehackte Tomaten (400 g)"), { name: "gehackte Tomaten (400 g)", qty: "1 Dose" });
  eq(HP.splitQty("2 Knoblauchzehen"), { name: "Knoblauchzehen", qty: "2" });
  ["Salz, Pfeffer, Muskat", "2 EL Olivenöl", "3 EL Bratbutter", "1 l Gemüsebouillon, heiss", "1 Prise Salz"].forEach(l => assert.ok(HP.isStaple(l), l));
  ["200 g Spaghetti", "Petersilie, Salz, Pfeffer", "1 Zwiebel", "2 dl Rahm"].forEach(l => assert.ok(!HP.isStaple(l), l));
});
test("recipes: normRecipe drops what does not belong", () => {
  const r = HP.normRecipe("r1", { title: " Suppe ", emoji: "constructor", cat: "x", tags: ["vegi", "vegi", "toString", "quick"], time: -5, serves: 0, ingr: ["  2 Rüebli ", 3, ""], steps: "nope", link: "javascript:alert(1)", fav: "yes" });
  assert.strictEqual(r.title, "Suppe"); assert.strictEqual(r.emoji, "teller"); assert.strictEqual(r.cat, "main");
  eq(r.tags, ["vegi", "quick"]); assert.strictEqual(r.time, 0); assert.strictEqual(r.serves, 4); eq(r.ingr, ["2 Rüebli"]); eq(r.steps, []);
  assert.strictEqual(r.link, ""); assert.strictEqual(r.fav, false);
  assert.strictEqual(HP.normRecipe("r2", { title: "" }), null);
  assert.ok(HP.hasTag(HP.normRecipe("r3", { title: "x", time: 20 }), "quick"));
  assert.ok(HP.hasTag(HP.normRecipe("r4", { title: "x", tags: ["vegan"] }), "vegi"));
});
test("recipes: search by what is in the fridge", () => {
  const r = HP.normRecipe("r1", { title: "Ofengemüse", ingr: ["1 Zucchetti", "200 g Feta"], tags: ["vegi"] });
  eq(HP.searchWords("Zucchetti, feta  zu"), ["zucchetti", "feta"]);
  eq(HP.recipeMatch(r, ["zucchetti", "feta", "lachs"]), { score: 2, hits: ["zucchetti", "feta"] });
  assert.strictEqual(HP.recipeMatch(r, ["vegi"]).score, 1);
});
test("recipes: a meal in the calendar remembers its recipe", () => {
  const e = HP.normEvent("e1", { title: "Risotto", date: "2026-10-12", cat: "meal", rid: "idee-pilzrisotto" });
  assert.strictEqual(e.cat, "meal"); assert.strictEqual(e.rid, "idee-pilzrisotto");
  assert.strictEqual(HP.normEvent("e2", { title: "x", date: "2026-10-12", rid: "__proto__" }).rid, null);
});

/* ---------- reading shared documents ---------- */
test("tampered documents never reach the arithmetic", () => {
  assert.strictEqual(HP.normHome("x", { name: "a", base: "chf" }), null);
  const h = HP.normHome("x", { name: "a", base: "CHF", members: { "__proto__": { name: "evil" }, constructor: { name: "evil" }, ok1: { name: "Anna", a: "nonexistent" } } });
  eq(Object.keys(h.members), ["ok1"]); assert.strictEqual(h.members.ok1.a, "");
  assert.strictEqual(HP.normExpense("x", { amount: -5, cur: "CHF", payer: "a" }), null);
  assert.strictEqual(HP.normExpense("x", { amount: 5, cur: "CHF", payer: "__proto__" }), null);
  const e = HP.normExpense("x", { amount: 500, cur: "CHF", payer: "a", mode: "shares", weights: { a: 1, toString: 2, b: -1, c: Infinity } });
  eq(e.weights, { a: 1 });
});

/* ---------- the built-in ideas ---------- */
test("cooking ideas: every idea is complete and valid", () => {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "ideen.js"), "utf8"), sandbox);
  const raw = sandbox.window.HP_IDEEN, ideas = HP.ideas();
  assert.ok(raw.length >= 20, "at least 20 ideas");
  assert.strictEqual(ideas.length, raw.length, "every idea passes normRecipe and its id is unique");
  raw.forEach(x => {
    assert.ok(HP.isDish(x.emoji), x.id + ": emoji " + x.emoji);
    assert.ok(HP.RECIPE_CATS.some(c => c.id === x.cat), x.id + ": cat");
    x.tags.forEach(t => assert.ok(HP.RECIPE_TAGS.some(g => g.id === t), x.id + ": tag " + t));
    assert.ok(x.ingr.length >= 3 && x.steps.length >= 2 && x.time > 0, x.id + ": ingredients, steps and time");
    assert.ok(/^idee-[a-z0-9-]+$/.test(x.id), x.id);
  });
  assert.ok(ideas.every(r => r.idea === true));
  assert.strictEqual(HP.idea("idee-roesti").title, "Rösti mit Spiegelei");
});

console.log((failed ? "✗ " + failed + " failed, " : "✓ ") + n + " passed");
process.exit(failed ? 1 : 0);
