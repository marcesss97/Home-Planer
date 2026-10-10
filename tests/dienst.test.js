/* Home-Planer: tests of the notifications (erinnerungen.js) and of the service (dienst-worker.js), without a browser
   and without Cloudflare: Firestore, the store (KV) and the push services of Apple, Google and co. are played here.
   Run:  node tests/dienst.test.js
         node tests/dienst.test.js --update   copies logic.js, ics.js and erinnerungen.js into dienst-worker.js */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert");
const L = require("./dienst-laden.js");
const ROOT = path.join(__dirname, "..");
if (process.argv.includes("--update")) { L.update(); console.log("dienst-worker.js: Kopien von " + L.PARTS.join(", ") + " aktualisiert."); }

const sandbox = { window: {}, Intl, Math, Date, JSON, Number, String, Array, Object, RegExp, isFinite, isNaN, Float64Array, Int8Array, console };
vm.createContext(sandbox);
["logic.js", "ics.js", "erinnerungen.js"].forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f }));
const HP = sandbox.window.HP, I = sandbox.window.HPIcs, R = sandbox.window.HPRemind;

let n = 0, failed = 0, queue = Promise.resolve();
function test(name, fn) {
  const report = e => { failed++; console.error("✗ " + name + "\n  " + (e && (e.stack || e.message) || JSON.stringify(e))); };
  queue = queue.then(() => { try { return Promise.resolve(fn()).then(() => { n++; }, report); } catch (e) { report(e); } });
}
const plainJson = v => JSON.parse(JSON.stringify(v).replace(/\u00a0/g, " "));       // amounts keep a no-break space
const at = (day, time) => I.localToUtc(day, time);
const HID = "h".repeat(10) + "AbCdEfGhIjKl";
const HOME = { name: "WG Seefeld", base: "CHF", store: "migros", members: { m1: { name: "Marc", o: 1 }, m2: { name: "Lea", o: 2 }, m3: { name: "Tom", o: 3, gone: true } } };
const home = HP.normHome(HID, HOME);
const ev = (id, f) => HP.normEvent(id, Object.assign({ title: "T " + id, date: "2026-10-12", cat: "date", repeat: "none", time: "", who: [], note: "" }, f));
const EVENTS = [
  ev("k1", { title: "Kehricht", cat: "trash", repeat: "weekly", date: "2026-10-06" }),
  ev("p1", { title: "Papier", cat: "trash", date: "2026-10-13", who: ["m2"] }),
  ev("b1", { title: "Oma", cat: "birthday", repeat: "yearly", date: "1950-10-15" }),
  ev("z1", { title: "Zahnarzt", time: "14:00", who: ["m1"], note: "Karte mitnehmen\nzweite Zeile" }),
  ev("a1", { title: "Velo-Service" }),
  ev("f1", { title: "Ferien Tessin", cat: "holiday", end: "2026-10-16", who: ["m2"] }),
  ev("r1", { title: "Grünes Curry", cat: "meal", who: ["m1", "m2"] })
];
const PLANTS = [HP.normPlant("pl1", { name: "Monstera", every: 7, last: "2026-10-05", who: "m1" }), HP.normPlant("pl2", { name: "Basilikum", every: 2, last: "2026-10-11" }),
  HP.normPlant("pl3", { name: "Zitrone", every: 30, last: "2026-10-01", feedEvery: 14, fed: "2026-09-20" })];
const EXPENSES = [HP.normExpense("e1", { title: "Migros", amount: 8450, cur: "CHF", date: "2026-09-20", cat: "groceries", payer: "m1", mode: "equal", for: ["m1", "m2"] })];
const due = (day, time, extra) => plainJson(R.due(Object.assign({ home, events: EVENTS, plants: PLANTS, infos: [], expenses: EXPENSES, at: at(day, time) }, extra || {})));
const brief = list => plainJson(list.map(m => [m.kind, m.title, m.body, m.to]));

/* ---------- reminders ---------- */
test("the copies inside the service are up to date", () => {
  assert.deepStrictEqual(L.stale(), [], "run: node tests/dienst.test.js --update");
});
test("what the service reads: always the next hour, the rest only at its time", () => {
  const a = plainJson(R.needs(at("2026-10-12", "13:07")));
  assert.deepStrictEqual([a.slot.time, a.soonDay, a.times[0], a.times[14], a.recurring, a.plants, a.infos, a.month], ["13:00", "2026-10-12", "14:00", "14:14", false, false, false, ""]);
  const b = plainJson(R.needs(at("2026-10-12", "19:00")));
  assert.deepStrictEqual([b.recurring, b.days], [true, ["2026-10-12", "2026-10-13", "2026-10-15"]]);
  assert.strictEqual(R.needs(at("2026-10-12", "08:00")).plants, true);
  assert.strictEqual(R.needs(at("2026-10-12", "09:00")).infos, true);
  assert.strictEqual(R.needs(at("2026-10-01", "18:00")).month, "2026-09");
  assert.strictEqual(R.needs(at("2026-01-08", "18:00")).month, "2025-12");
  assert.strictEqual(R.needs(at("2026-10-02", "18:00")).month, "");
  const late = plainJson(R.needs(at("2026-10-12", "23:15")));
  assert.deepStrictEqual([late.soonDay, late.times[0]], ["2026-10-13", "00:15"], "past midnight");
  assert.strictEqual(R.slotOf(at("2026-03-29", "03:30")).time, "03:30", "summer time");
  assert.strictEqual(R.slotOf(Date.UTC(2026, 9, 25, 0, 30)).time, "02:30", "last hour of summer time");
});
test("timed appointments: one hour before, only for the people concerned", () => {
  assert.deepStrictEqual(brief(due("2026-10-12", "13:00")), [["cal", "📅 Zahnarzt", "In einer Stunde, um 14:00 Uhr. Karte mitnehmen", ["m1"]]]);
  assert.deepStrictEqual(due("2026-10-12", "12:45"), []);
  assert.deepStrictEqual(due("2026-10-12", "13:15"), []);
});
test("all-day appointments in the morning, each person only theirs", () => {
  const [m] = due("2026-10-12", "07:30");
  assert.deepStrictEqual([m.kind, m.to, m.per.m1, m.per.m2], ["cal", ["m1", "m2"], { title: "📅 Heute: Velo-Service", body: "Ganztägig." },
    { title: "📅 Heute: 2 Termine", body: "Ferien Tessin · Velo-Service" }]);
  const [x] = due("2026-10-12", "07:30", { events: [EVENTS[5]] });
  assert.deepStrictEqual([x.to, x.per.m2], [["m2"], { title: "✈️ Heute: Ferien Tessin", body: "Bis Fr., 16. Okt." }]);
});
test("plants at eight: watering for the one responsible, feeding for everybody", () => {
  const [m] = due("2026-10-12", "08:00");
  assert.deepStrictEqual([m.kind, m.per.m1, m.per.m2], ["plants", { title: "🪴 Heute giessen", body: "Monstera. Düngen: Zitrone." }, { title: "🪴 Heute düngen", body: "Zitrone." }]);
  assert.deepStrictEqual(due("2026-10-12", "08:00", { plants: [PLANTS[1]] }), [], "nothing due, nothing sent");
});
test("birthdays three days before and on the day, deadlines 30/7/1/0 days before", () => {
  assert.deepStrictEqual(brief(due("2026-10-12", "18:00")), [["birthday", "🎂 In drei Tagen: Oma", "Donnerstag, 15. Oktober. Noch Zeit für ein Geschenk oder eine Karte.", null]]);
  assert.deepStrictEqual(brief(due("2026-10-15", "08:00", { plants: [] })), [["birthday", "🎂 Heute: Oma", "Nicht vergessen zu gratulieren.", null]]);
  const infos = [30, 7, 1, 0, 2].map(d => HP.normInfo("i" + d, { cat: "insurance", title: "Hausrat " + d, due: HP.addDays("2026-10-12", d), dueNote: d ? "Kündigungsfrist" : "" }));
  assert.deepStrictEqual(brief(due("2026-10-12", "09:00", { infos })).map(x => x[1]),
    ["📁 Kündigungsfrist in 30 Tagen: Hausrat 30", "📁 Kündigungsfrist in 7 Tagen: Hausrat 7", "📁 Kündigungsfrist morgen: Hausrat 1", "📁 Frist heute: Hausrat 0"]);
});
test("cooking at half past three, the bin the evening before", () => {
  const [m] = due("2026-10-12", "15:30");
  assert.deepStrictEqual([m.kind, m.to, m.per.m2], ["meal", ["m1", "m2"], { title: "🍳 Heute kochst du: Grünes Curry", body: "Zusammen mit Marc. Schau jetzt, ob alle Zutaten da sind." }]);
  const [t] = due("2026-10-12", "19:00");
  assert.deepStrictEqual([t.kind, t.title, t.per.m1.title, t.per.m2.title], ["trash", "🗑️ Morgen: Kehricht und Papier", "🗑️ Morgen: Kehricht", "🗑️ Morgen: Kehricht und Papier"]);
});
test("monthly settlement: on the 1st for all, on the 8th only while open", () => {
  const [m] = due("2026-10-01", "18:00");
  assert.deepStrictEqual([m.kind, m.per.m1.body, m.per.m2.body], ["month", "Einkäufe: CHF 84.50. Lea überweist dir CHF 42.25.", "Einkäufe: CHF 84.50. Du überweist Marc CHF 42.25."]);
  assert.strictEqual(due("2026-10-08", "18:00")[0].per.m2.title, "🧾 Noch offen: September 2026");
  const paid = EXPENSES.concat(HP.normExpense("t1", { kind: "transfer", amount: 4225, cur: "CHF", payer: "m2", to: "m1", date: "2026-10-03", settles: "2026-09:shop" }));
  assert.deepStrictEqual(due("2026-10-08", "18:00", { expenses: paid }), []);
});
test("new entries: shopping list, expense with each share, payment, appointments, meal plan", () => {
  const items = ["Milch", "Brot", "Eier", "Butter", "Mehl", "Zucker"].map((x, i) => HP.normItem("s" + i, { name: x, ts: 5 }));
  assert.deepStrictEqual(brief(R.changed(home, "m2", "shopping", items.slice(0, 3))), [["shop", "🛒 Einkaufsliste", "Lea hat Milch, Brot und Eier eingetragen.", null]]);
  assert.strictEqual(R.changed(home, "m2", "shopping", items)[0].body, "Lea hat Milch, Brot, Eier, Butter und 2 weitere eingetragen.");
  const [e] = plainJson(R.changed(home, "m2", "expenses", EXPENSES));
  assert.deepStrictEqual([e.live, e.from, e.to, e.per.m1.body, e.per.m2.body], [true, "m2", ["m1", "m2"],
    "Lea hat für dich eingetragen: Du hast CHF 84.50 bezahlt. Dein Anteil: CHF 42.25.", "Marc hat CHF 84.50 bezahlt. Dein Anteil: CHF 42.25."]);
  const [p] = plainJson(R.changed(home, "m1", "expenses", [HP.normExpense("t1", { kind: "transfer", amount: 4225, cur: "CHF", payer: "m2", to: "m1", settles: "2026-09:shop" })]));
  assert.deepStrictEqual([p.per.m1.body, p.per.m2.body], ["Lea hat dir CHF 42.25 für die Abrechnung September 2026 überwiesen.", "Marc hat deine Zahlung von CHF 42.25 eingetragen."]);
  const c = plainJson(R.changed(home, "m1", "events", [EVENTS[3], EVENTS[6]]));
  assert.deepStrictEqual(brief(c), [["meal", "🍳 Marc und Lea kochen: Grünes Curry", "Mo., 12. Okt. Geplant von Marc.", null],
    ["cal", "📅 Zahnarzt", "Mo., 12. Okt., 14:00 Uhr. Eingetragen von Marc.", ["m1"]]]);
  const week = ["Curry", "Risotto", "Pad Thai", "Rösti", "Shakshuka"].map((t, i) => ev("w" + i, { title: t, cat: "meal", date: HP.addDays("2026-10-12", i) }));
  assert.deepStrictEqual(brief(R.changed(home, "m2", "events", week))[0], ["meal", "🍳 Wochenplan: 5 Essen geplant", "Mo Curry · Di Risotto · Mi Pad Thai · Do Rösti … (von Lea)", null]);
  assert.deepStrictEqual(plainJson(R.changed(home, "m1", "plants", [PLANTS[0]])), [], "plants and infos are not announced");
  assert.deepStrictEqual(brief([R.going(home, "m1", 3)]), [["shop", "🛒 Marc geht einkaufen", "Gleich in der Migros. 3 Sachen stehen auf der Liste. Fehlt noch etwas? Jetzt eintragen.", null]]);
});
test("which device gets what: choice, person, sender, quiet hours, people who left", () => {
  const live = plainJson(R.changed(home, "m2", "shopping", [HP.normItem("s1", { name: "Milch" })]))[0];
  const dev = (member, prefs, quiet) => ({ member, prefs, quiet });
  assert.ok(R.forDevice(live, dev("m1", null, true), home, "12:00"));
  assert.strictEqual(R.forDevice(live, dev("m2", null, true), home, "12:00"), null, "not to the person who made it");
  assert.strictEqual(R.forDevice(live, dev("m1", "kasse,cal", true), home, "12:00"), null, "kind not chosen");
  assert.strictEqual(R.forDevice(live, dev("m1", null, true), home, "22:30"), null, "quiet hours");
  assert.ok(R.forDevice(live, dev("m1", null, false), home, "22:30"), "quiet hours switched off");
  assert.strictEqual(R.forDevice(live, dev("m3", null, true), home, "12:00"), null, "left the household");
  assert.strictEqual(R.forDevice(live, dev("", null, true), home, "12:00"), null, "no person chosen");
  const bin = due("2026-10-12", "19:00")[0];
  assert.strictEqual(R.forDevice(bin, dev("m1", null, true), home, "19:00").title, "🗑️ Morgen: Kehricht", "reminders have their own text per person");
  assert.ok(R.forDevice(due("2026-10-12", "13:00")[0], dev("m1", null, true), home, "23:00"), "reminders ignore quiet hours");
  assert.strictEqual(R.forDevice(due("2026-10-12", "13:00")[0], dev("m2", null, true), home, "13:00"), null, "not concerned");
  assert.deepStrictEqual(Array.from(R.prefsOf("cal,quatsch,shop")), ["shop", "cal"]);
  assert.strictEqual(R.prefsOf(null).length, R.KINDS.length);
});
test("preview: the next reminders for one person", () => {
  const list = plainJson(R.upcoming({ home, events: EVENTS, plants: PLANTS, infos: [], expenses: [] }, { member: "m2", prefs: null, quiet: true }, at("2026-10-12", "06:00"), 7, 6));
  assert.deepStrictEqual(list.map(x => x.day + " " + x.time + " " + x.title), ["2026-10-12 07:30 📅 Heute: 2 Termine", "2026-10-12 08:00 🪴 Heute düngen",
    "2026-10-12 15:30 🍳 Heute kochst du: Grünes Curry", "2026-10-12 18:00 🎂 In drei Tagen: Oma", "2026-10-12 19:00 🗑️ Morgen: Kehricht und Papier", "2026-10-13 08:00 🪴 Heute giessen"]);
});

/* ---------- the service ---------- */
const W = L.load();
const u = W.unb64url, b64 = W.b64url, subtle = globalThis.crypto.subtle;
const fsv = v => typeof v === "string" ? { stringValue: v } : typeof v === "boolean" ? { booleanValue: v } : typeof v === "number" ? { integerValue: String(v) }
  : Array.isArray(v) ? { arrayValue: { values: v.map(fsv) } } : v && typeof v === "object" ? { mapValue: { fields: Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, fsv(x)])) } } : { nullValue: null };
const strip = o => { const c = Object.assign({}, o); delete c.id; return c; };
function store() {
  const m = new Map();
  return { m, puts: 0, lists: 0,
    async get(k, type) { const v = m.get(k); return v ? (type === "json" ? JSON.parse(v.value) : v.value) : null; },
    async put(k, value, o) { this.puts++; m.set(k, { value, metadata: o && o.metadata, ttl: o && o.expirationTtl }); },
    async delete(k) { m.delete(k); },
    async list(o) { this.lists++; return { keys: Array.from(m.keys()).filter(k => k.startsWith(o.prefix)).sort().map(name => ({ name, metadata: m.get(name).metadata })), list_complete: true }; } };
}
let DB, KV, ENV, sent, reads, pushStatus;
/* The service decides about quiet hours by the clock: the tests set it to noon unless they say otherwise. */
const REAL_DATE = W.Date;
function clock(day, time) { const t = at(day, time); W.Date = class extends REAL_DATE { static now() { return t; } }; }
function reset() {
  clock("2026-10-12", "12:00");
  DB = { homes: { [HID]: JSON.parse(JSON.stringify(HOME)) }, events: EVENTS.map(strip).map((e, i) => Object.assign(e, { id: EVENTS[i].id })), plants: PLANTS, infos: [], expenses: EXPENSES };
  KV = store(); ENV = { DIENST_SCHLUESSEL: "ein-langes-geheimnis-fuer-den-test-1234567890", HP: KV };
  sent = []; reads = []; pushStatus = 201;
}
const PRE = "/v1/projects/splite-weiser-cf091/databases/(default)/documents/homes/";
function match(d, w) {
  if (!w) return true;
  const f = w.fieldFilter, v = d[f.field.fieldPath];
  if (f.op === "IN") return f.value.arrayValue.values.some(x => x.stringValue === v);
  if (f.op === "GREATER_THAN_OR_EQUAL") return typeof v === "string" && v >= f.value.stringValue;
  throw new Error("op " + f.op);
}
W.fetch = async (url, init) => {
  const x = new URL(url);
  if (x.hostname.endsWith("googleapis.com") && x.pathname.startsWith("/v1/")) {
    const p = decodeURIComponent(x.pathname).slice(PRE.length);
    assert.strictEqual(x.searchParams.get("key"), "AIzaSyBoxXxX0WBFLoK4aDwSsf06fT0W8QTs6Uo");
    if (p.endsWith(":runQuery")) {
      const id = p.slice(0, -9), q = JSON.parse(init.body).structuredQuery, col = q.from[0].collectionId;
      const rows = (DB[col] || []).filter(d => match(d, q.where));           // like Firestore: entries outlive a deleted household document
      reads.push(col + (q.where ? " " + q.where.fieldFilter.field.fieldPath : "") + " → " + rows.length);
      return new Response(JSON.stringify(rows.length ? rows.map(d => ({ document: { name: "projects/x/databases/(default)/documents/homes/" + id + "/" + col + "/" + d.id, fields: fsv(strip(d)).mapValue.fields } }))
        : [{ readTime: "2026-10-12T10:00:00Z" }]));
    }
    reads.push("home");
    return DB.homes[p] ? new Response(JSON.stringify({ name: p, fields: fsv(DB.homes[p]).mapValue.fields })) : new Response("{}", { status: 404 });
  }
  sent.push({ url, headers: init.headers, body: init.body });
  return new Response("", { status: typeof pushStatus === "function" ? pushStatus(url) : pushStatus });
};
const call = (method, p, body) => W.__worker.fetch(new Request("https://dienst.example.workers.dev" + p, { method, body: body ? JSON.stringify(body) : undefined,
  headers: body ? { "Content-Type": "application/json" } : {} }), ENV);
/* A device as the browser has it: its own key pair; with it the test can read what arrived (RFC 8291 from the receiving side). */
async function device(host) {
  const pair = await subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const pub = new Uint8Array(await subtle.exportKey("raw", pair.publicKey)), auth = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const endpoint = (host || "https://fcm.googleapis.com/fcm/send/") + b64(globalThis.crypto.getRandomValues(new Uint8Array(12)));
  return { pair, pub, auth, sub: { endpoint, keys: { p256dh: b64(pub), auth: b64(auth) } } };
}
async function hkdf(salt, ikm, info, len) {
  const k = await subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, k, len * 8));
}
const te = s => new TextEncoder().encode(s), cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; a.forEach(x => { o.set(x, i); i += x.length; }); return o; };
async function read(dev, body) {
  body = new Uint8Array(body);
  const salt = body.slice(0, 16), rs = new DataView(body.buffer, body.byteOffset).getUint32(16), idlen = body[20], asPub = body.slice(21, 21 + idlen);
  assert.strictEqual(rs, 4096); assert.strictEqual(idlen, 65);
  const asKey = await subtle.importKey("raw", asPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(await subtle.deriveBits({ name: "ECDH", public: asKey }, dev.pair.privateKey, 256));
  const ikm = await hkdf(dev.auth, shared, cat(te("WebPush: info\0"), dev.pub, asPub), 32);
  const key = await subtle.importKey("raw", await hkdf(salt, ikm, te("Content-Encoding: aes128gcm\0"), 16), "AES-GCM", false, ["decrypt"]);
  const out = new Uint8Array(await subtle.decrypt({ name: "AES-GCM", iv: await hkdf(salt, ikm, te("Content-Encoding: nonce\0"), 12) }, key, body.slice(21 + idlen)));
  assert.strictEqual(out[out.length - 1], 2, "last record");
  return plainJson(JSON.parse(new TextDecoder().decode(out.slice(0, -1))));
}
const inbox = async (devs) => {
  const out = [];
  for (const s of sent) { const d = devs.find(x => x.sub.endpoint === s.url); if (d) out.push(Object.assign({ who: d.name }, await read(d, s.body))); }
  return out.sort((a, b) => (a.who < b.who ? -1 : a.who > b.who ? 1 : a.title < b.title ? -1 : 1));
};
async function signIn(name, member, prefs, extra) {
  const d = Object.assign(await device(extra && extra.host), { name });
  const r = await call("POST", "/push/subscribe", Object.assign({ home: HID, member, sub: d.sub, prefs, quiet: true, dev: "iPhone" }, extra || {}));
  assert.strictEqual(r.status, 200, await r.clone().text());
  return d;
}

test("service: encryption gives exactly the example of RFC 8291", async () => {
  const asPub = u("BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8");
  const jwk = { kty: "EC", crv: "P-256", d: "yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw", x: b64(asPub.slice(1, 33)), y: b64(asPub.slice(33)) };
  const keys = { privateKey: await subtle.importKey("jwk", jwk, { name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]),
    publicKey: await subtle.importKey("raw", asPub, { name: "ECDH", namedCurve: "P-256" }, true, []) };
  const body = await W.encrypt("BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4", "BTBZMqHH6r4Tts7J_aSIgg",
    te("When I grow up, I want to be a watermelon"), { keys, salt: u("DGv6ra1nlYgDCS1FRnbzlw") });
  assert.strictEqual(b64(body), "DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN");
});
test("service: its key follows from the secret, and its signature checks out", async () => {
  reset();
  const k1 = (await (await call("GET", "/push/key")).json()).key;
  assert.strictEqual(u(k1).length, 65); assert.strictEqual(u(k1)[0], 4);
  assert.strictEqual((await (await call("GET", "/push/key")).json()).key, k1, "same key every time");
  assert.strictEqual((await L.load().__worker.fetch(new Request("https://x.workers.dev/push/key"), ENV).then(r => r.json())).key, k1, "another copy of the service, same key");
  ENV.DIENST_SCHLUESSEL = "ein-ganz-anderes-geheimnis-0987654321";
  assert.notStrictEqual((await (await call("GET", "/push/key")).json()).key, k1, "another secret, another key");
  reset();
  const d = await signIn("Lea", "m2");
  await call("POST", "/push/test", { home: HID, sub: d.sub });
  const h = sent[0].headers, m = /^vapid t=([^,]+), k=(.+)$/.exec(h.Authorization);
  assert.ok(m, h.Authorization); assert.strictEqual(m[2], k1);
  const [head, claims, sig] = m[1].split(".");
  const c = JSON.parse(new TextDecoder().decode(u(claims)));
  assert.deepStrictEqual([JSON.parse(new TextDecoder().decode(u(head))).alg, c.aud, c.sub], ["ES256", "https://fcm.googleapis.com", "https://marcesss97.github.io/Home-Planer/"]);
  const now = at("2026-10-12", "12:00") / 1000;
  assert.ok(c.exp > now + 3600 && c.exp <= now + 86400, "valid for at most a day");
  const pub = await subtle.importKey("raw", u(k1), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  assert.ok(await subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pub, u(sig), te(head + "." + claims)), "signature");
  assert.deepStrictEqual([h["Content-Encoding"], h.Urgency], ["aes128gcm", "high"]);
  assert.deepStrictEqual(plainJson(await read(d, sent[0].body)), { title: "✅ Mitteilungen sind eingeschaltet", body: "So sieht eine Mitteilung vom Home-Planer «WG Seefeld» aus.", tag: "test", tab: "home", home: HID });
});
test("service: signing in checks household, person and device, and stores nothing readable", async () => {
  reset();
  const d = await device();
  const sub = body => call("POST", "/push/subscribe", Object.assign({ home: HID, member: "m1", sub: d.sub }, body));
  assert.strictEqual((await sub({ home: "kurz" })).status, 400);
  assert.strictEqual((await sub({ home: "z".repeat(22) })).status, 404);
  assert.strictEqual((await sub({ member: "m3" })).status, 400, "left the household");
  assert.strictEqual((await sub({ member: "xx" })).status, 400);
  assert.strictEqual((await sub({ sub: { endpoint: "https://evil.example/push", keys: d.sub.keys } })).status, 400, "only the push services of the makers");
  assert.strictEqual((await sub({ sub: { endpoint: "http://fcm.googleapis.com/x", keys: d.sub.keys } })).status, 400);
  assert.strictEqual((await sub({ sub: { endpoint: d.sub.endpoint, keys: { p256dh: "abc", auth: d.sub.keys.auth } } })).status, 400);
  assert.strictEqual(KV.m.size, 0);
  assert.strictEqual((await sub({ prefs: ["shop", "quatsch", "trash"], dev: "<b>x</b>" })).status, 200);
  const [[key, v]] = Array.from(KV.m.entries());
  assert.ok(/^s:[A-Za-z0-9_-]{22}:[A-Za-z0-9_-]{22}$/.test(key) && key.indexOf(HID) < 0 && v.value.indexOf(HID) < 0, "the household only encrypted");
  assert.strictEqual(v.ttl, 60 * 86400);
  assert.deepStrictEqual([v.metadata.m, v.metadata.p, v.metadata.q, v.metadata.d], ["m1", "shop,trash", 1, ""]);
  assert.strictEqual((await sub({ prefs: ["cal"] })).status, 200);
  assert.strictEqual(KV.m.size, 1, "signing in again updates the same entry");
  assert.strictEqual((await call("POST", "/push/unsubscribe", { home: HID, endpoint: d.sub.endpoint })).status, 200);
  assert.strictEqual(KV.m.size, 0);
  delete ENV.HP;
  assert.strictEqual((await sub({})).status, 501, "no store bound");
  assert.match(await (await call("GET", "/")).text(), /Ablage HP fehlt/);
});
test("service: new entries reach the others, with their own text, their choice and their quiet hours", async () => {
  reset();
  const marc = await signIn("Marc", "m1"), lea = await signIn("Lea", "m2"), leaPad = await signIn("Lea iPad", "m2", ["kasse"], { host: "https://web.push.apple.com/" });
  const msgs = plainJson(R.changed(home, "m1", "expenses", EXPENSES).concat(R.changed(home, "m1", "shopping", [HP.normItem("s1", { name: "Milch", ts: 1 })])));
  const r = await call("POST", "/push/send", { home: HID, from: "m1", msgs });
  assert.deepStrictEqual(await r.json(), { sent: 3, devices: 3 });
  assert.deepStrictEqual((await inbox([marc, lea, leaPad])).map(x => [x.who, x.title, x.body, x.tab]), [
    ["Lea", "💰 Migros", "Marc hat CHF 84.50 bezahlt. Dein Anteil: CHF 42.25.", "kasse"],
    ["Lea", "🛒 Einkaufsliste", "Marc hat Milch eingetragen.", "shop"],
    ["Lea iPad", "💰 Migros", "Marc hat CHF 84.50 bezahlt. Dein Anteil: CHF 42.25.", "kasse"]]);
  assert.ok(sent.every(s => s.headers.TTL === "21600" && s.headers.Urgency === "normal"));
  sent = [];
  clock("2026-10-12", "23:10");
  assert.deepStrictEqual(await (await call("POST", "/push/send", { home: HID, from: "m1", msgs })).json(), { sent: 0, devices: 3 }, "quiet hours");
  clock("2026-10-12", "12:00");
  assert.strictEqual((await call("POST", "/push/send", { home: HID, from: "m3", msgs })).status, 400, "only people of the household");
  assert.strictEqual((await call("POST", "/push/send", { home: HID, from: "m1", msgs: [{ kind: "quatsch", title: "x" }] })).status, 400);
  const forged = await call("POST", "/push/send", { home: HID, from: "m1", msgs: [Object.assign({}, msgs[1], { live: false, from: "m2", title: "x".repeat(500) })] });
  assert.strictEqual((await forged.json()).sent, 1, "the app cannot make a message look like a reminder or come from someone else");
  assert.strictEqual((await read(lea, sent[sent.length - 1].body)).title.length, 120);
});
test("service: a device that signed off at its maker disappears; too many messages are refused", async () => {
  reset();
  const lea = await signIn("Lea", "m2"), tom = await signIn("Tom", "m1");
  pushStatus = url => url === lea.sub.endpoint ? 410 : 201;
  const msgs = plainJson(R.changed(home, "m1", "shopping", [HP.normItem("s1", { name: "Milch" })]));
  assert.deepStrictEqual(await (await call("POST", "/push/send", { home: HID, from: "m1", msgs })).json(), { sent: 0, devices: 2 });
  assert.strictEqual(KV.m.size, 1, "Lea's old device is gone");
  pushStatus = 201;
  let last = null;
  for (let i = 0; i < 70 && (!last || last.status !== 429); i++) last = await call("POST", "/push/send", { home: HID, from: "m2", msgs: plainJson(R.changed(home, "m2", "shopping", [HP.normItem("s" + i, { name: "Brot" })])) });
  assert.strictEqual(last.status, 429);
  const st = await (await call("POST", "/push/status", { home: HID })).json();
  assert.deepStrictEqual(plainJson(st), { devices: [{ member: "m1", dev: "iPhone", prefs: plainJson(R.KINDS.map(k => k.id)) }], cron: 0 });
});
test("service: every quarter hour only what is due, read sparingly", async () => {
  reset();
  const marc = await signIn("Marc", "m1"), lea = await signIn("Lea", "m2", ["trash", "cal"]);
  const run = async (day, time) => { sent = []; reads = []; KV.puts = 0; const r = await W.remind(ENV, at(day, time)); return r; };
  await run("2026-10-12", "10:15");
  assert.deepStrictEqual(reads, ["events time → 0"], "nothing coming up: one small query, not even the household");
  assert.strictEqual(sent.length, 0);
  await run("2026-10-12", "13:00");
  assert.deepStrictEqual(reads, ["events time → 1", "home"]);
  assert.deepStrictEqual((await inbox([marc, lea])).map(x => [x.who, x.title, x.body, x.tab, x.home]), [["Marc", "📅 Zahnarzt", "In einer Stunde, um 14:00 Uhr. Karte mitnehmen", "cal", HID]]);
  assert.deepStrictEqual([sent[0].headers.TTL, sent[0].headers.Urgency], ["3600", "high"]);
  await run("2026-10-12", "19:00");
  assert.deepStrictEqual(reads, ["events time → 0", "events repeat → 2", "events date → 5", "home"]);
  assert.deepStrictEqual((await inbox([marc, lea])).map(x => [x.who, x.title]), [["Lea", "🗑️ Morgen: Kehricht und Papier"], ["Marc", "🗑️ Morgen: Kehricht"]]);
  await run("2026-10-12", "08:00");
  assert.deepStrictEqual(reads, ["events time → 0", "events repeat → 2", "events date → 5", "plants → 3", "home"]);
  assert.deepStrictEqual((await inbox([marc, lea])).map(x => [x.who, x.title, x.body]), [["Marc", "🪴 Heute giessen", "Monstera. Düngen: Zitrone."]], "Lea chose no plants");
  await run("2026-10-01", "18:00");
  assert.ok(reads.indexOf("expenses date → 1") >= 0, reads.join(", "));
  assert.deepStrictEqual((await inbox([marc, lea])).map(x => [x.who, x.body]), [["Marc", "Einkäufe: CHF 84.50. Lea überweist dir CHF 42.25."]]);
  assert.strictEqual(KV.puts, 1, "on the full hour the service notes that the schedule runs");
  assert.ok(Number(await KV.get("cron")) > 0);
  delete DB.homes[HID];
  DB.events = [];
  await run("2026-10-12", "13:00");
  assert.strictEqual(KV.m.size - 1, 2, "household gone but nothing to read: the devices stay until they expire");
  DB.events = [EVENTS[3]];
  await run("2026-10-12", "13:00");
  assert.deepStrictEqual(Array.from(KV.m.keys()), ["cron"], "household deleted: its devices are removed");
});
test("service: calendar still works, and the old secret name too", async () => {
  reset();
  ENV = { KALENDER_SCHLUESSEL: ENV.DIENST_SCHLUESSEL };
  const { token } = await (await call("POST", "/token", { home: HID })).json();
  W.fetch = (orig => async (url, init) => {
    const x = new URL(url);
    if (x.pathname.endsWith("/events")) return new Response(JSON.stringify({ documents: DB.events.map(e => ({ name: "a/b/" + e.id, fields: fsv(strip(e)).mapValue.fields })) }));
    return orig(url, init);
  })(W.fetch);
  const ics = await (await call("GET", "/kalender/" + token + ".ics")).text();
  assert.ok(ics.indexOf("SUMMARY:🗑️ Kehricht") > 0, ics.slice(0, 300));
  assert.strictEqual((await call("POST", "/push/subscribe", { home: HID })).status, 501, "notifications need the store");
  assert.match(await (await call("GET", "/")).text(), /bereit/);
  ENV = {};
  assert.match(await (await call("GET", "/")).text(), /DIENST_SCHLUESSEL/);
});

queue.then(() => {
  W.Date = REAL_DATE;
  console.log((failed ? "✗ " + failed + " failed, " : "✓ ") + n + " passed");
  process.exit(failed ? 1 : 0);
});
