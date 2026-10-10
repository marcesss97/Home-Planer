/* Home-Planer: tests of the calendar files (ics.js) and of the calendar part of the service (dienst-worker.js), without a browser.
   Run:  node tests/kalender.test.js
   After changing ics.js: node tests/dienst.test.js --update copies it into dienst-worker.js. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert");
const L = require("./dienst-laden.js");
const ROOT = path.join(__dirname, "..");
const ICS_SRC = fs.readFileSync(path.join(ROOT, "ics.js"), "utf8");

const sandbox = { window: {}, Intl, Math, Date, JSON, Number, String, Array, Object, RegExp, isFinite, isNaN, Float64Array, Int8Array, console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "logic.js"), "utf8"), sandbox);
vm.runInContext(ICS_SRC, sandbox);
const HP = sandbox.window.HP, I = sandbox.window.HPIcs;

let n = 0, failed = 0, queue = Promise.resolve();
function test(name, fn) {
  const report = e => { failed++; console.error("✗ " + name + "\n  " + (e && (e.stack || e.message) || JSON.stringify(e))); };
  queue = queue.then(() => { try { return Promise.resolve(fn()).then(() => { n++; }, report); } catch (e) { report(e); } });
}
const lines = ics => ics.replace(/\r\n /g, "").split("\r\n");
const prop = (ics, name) => lines(ics).filter(l => l.split(/[;:]/)[0] === name);
const NOW = Date.UTC(2026, 9, 10, 12, 0);       // 10 October 2026, 14:00 in Zurich
const ev = (id, f) => Object.assign({ id, title: "Termin " + id, date: "2026-10-12", cat: "date", repeat: "none", who: [], note: "" }, f);

/* ---------- writing ---------- */
test("the copy of ics.js inside the service is up to date", () => {
  assert.ok(L.stale().indexOf("ics.js") < 0, "run: node tests/dienst.test.js --update");
});
test("kinds match the calendar of the app", () => {
  assert.deepStrictEqual(Array.from(Object.keys(I.KINDS)).sort(), Array.from(HP.EV_CATS.map(c => c.id)).sort());
  HP.EV_CATS.forEach(c => assert.deepStrictEqual(Array.from(I.KINDS[c.id]), [c.label, c.emoji]));
});
test("frame: CRLF, calendar name, time zone, every line at most 75 bytes", () => {
  const ics = I.build({ home: "WG Seefeld", events: [ev("a1", { note: "Lang ".repeat(60) + "äöü 🎂 ".repeat(20) })], now: NOW });
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n") && ics.endsWith("END:VCALENDAR\r\n"));
  assert.ok(!/[^\r]\n/.test(ics), "only CRLF");
  ics.split("\r\n").forEach(l => assert.ok(Buffer.byteLength(l, "utf8") <= 75, "line too long: " + l));
  assert.deepStrictEqual(prop(ics, "X-WR-CALNAME"), ["X-WR-CALNAME:Home-Planer · WG Seefeld"]);
  assert.strictEqual(prop(ics, "TZID").length, 1);
  assert.ok(lines(ics).some(l => l.startsWith("DESCRIPTION:Lang Lang") && l.indexOf("🎂") > 0), "folded text comes back whole");
});
test("all-day, timed, multi-day: start and end", () => {
  const ics = I.build({ events: [
    ev("d1"), ev("t1", { time: "18:30", endTime: "20:00" }), ev("t2", { time: "23:30" }), ev("m1", { end: "2026-10-14" }),
    ev("m2", { end: "2026-10-14", time: "09:00", endTime: "17:00" }), ev("m3", { end: "2026-10-14", time: "09:00" })], now: NOW });
  const st = prop(ics, "DTSTART").slice(2), en = prop(ics, "DTEND");            // the first two DTSTART are inside VTIMEZONE
  assert.deepStrictEqual(st, ["DTSTART;VALUE=DATE:20261012", "DTSTART;TZID=Europe/Zurich:20261012T183000", "DTSTART;TZID=Europe/Zurich:20261012T233000",
    "DTSTART;VALUE=DATE:20261012", "DTSTART;TZID=Europe/Zurich:20261012T090000", "DTSTART;TZID=Europe/Zurich:20261012T090000"]);
  assert.deepStrictEqual(en, ["DTEND;VALUE=DATE:20261013", "DTEND;TZID=Europe/Zurich:20261012T200000", "DTEND;TZID=Europe/Zurich:20261013T003000",
    "DTEND;VALUE=DATE:20261015", "DTEND;TZID=Europe/Zurich:20261014T170000", "DTEND;TZID=Europe/Zurich:20261015T000000"]);
});
test("repetitions: rules, end of the series in UTC, cancelled dates", () => {
  const ics = I.build({ events: [
    ev("w1", { cat: "trash", repeat: "weekly", skip: ["2026-10-19", "2026-12-28"] }),
    ev("w2", { repeat: "biweekly", time: "19:00", until: "2026-12-21", skip: ["2026-10-26"] }),
    ev("w3", { repeat: "monthly", date: "2026-01-31", until: "2027-01-31" }),
    ev("w4", { cat: "birthday", repeat: "yearly", date: "2024-02-29", title: "Lea" })], now: NOW });
  assert.deepStrictEqual(prop(ics, "RRULE").slice(2), ["RRULE:FREQ=WEEKLY", "RRULE:FREQ=WEEKLY;INTERVAL=2;UNTIL=20261221T180000Z", "RRULE:FREQ=MONTHLY;UNTIL=20270131", "RRULE:FREQ=YEARLY"]);
  assert.deepStrictEqual(prop(ics, "EXDATE"), ["EXDATE;VALUE=DATE:20261019,20261228", "EXDATE;TZID=Europe/Zurich:20261026T190000"]);
  assert.ok(prop(ics, "SUMMARY").indexOf("SUMMARY:🎂 Lea") >= 0 && prop(ics, "SUMMARY").indexOf("SUMMARY:🗑️ Termin w1") >= 0);
});
test("summer time: the end of a series is converted with the right offset", () => {
  assert.strictEqual(new Date(I.localToUtc("2026-07-01", "18:00")).toISOString(), "2026-07-01T16:00:00.000Z");
  assert.strictEqual(new Date(I.localToUtc("2026-12-01", "18:00")).toISOString(), "2026-12-01T17:00:00.000Z");
  assert.deepStrictEqual(Object.assign({}, I.utcToLocal(Date.UTC(2026, 2, 29, 0, 59))), { day: "2026-03-29", time: "01:59" });
  assert.deepStrictEqual(Object.assign({}, I.utcToLocal(Date.UTC(2026, 2, 29, 1, 0))), { day: "2026-03-29", time: "03:00" });
});
test("meals name the cooks, notes and people go into the description, text is escaped", () => {
  const ics = I.build({ home: "WG", names: { m1: "Marc", m2: "Lea" }, events: [
    ev("e1", { cat: "meal", title: "Älplermagronen", who: ["m1"] }), ev("e2", { title: "Znacht; Apéro, Dessert", note: "Wein\nund Brot", who: ["m1", "m2", "zz"] })], now: NOW });
  const s = prop(ics, "SUMMARY"), d = lines(ics).filter(l => l.startsWith("DESCRIPTION:"));
  assert.deepStrictEqual(s, ["SUMMARY:🍽️ Älplermagronen (Marc kocht)", "SUMMARY:Znacht\\; Apéro\\, Dessert"]);
  assert.strictEqual(d[1], "DESCRIPTION:Wein\\nund Brot\\n\\nBetrifft: Marc\\, Lea\\n\\nAus dem Home-Planer «WG»");
  assert.ok(lines(ics).indexOf("TRANSP:TRANSPARENT") >= 0, "meals do not block time");
});
test("only chosen kinds; old one-off events and broken entries stay out", () => {
  const ics = I.build({ events: [ev("a", { cat: "trash" }), ev("b", { cat: "birthday" }), ev("c", { cat: "trash", date: "2024-01-01" }),
    ev("d", { cat: "trash", date: "2024-01-01", repeat: "weekly" }), { id: "x", title: "kaputt", date: "2026-02-30" }, { id: "../y", title: "böse", date: "2026-10-10" },
    ev("e", { cat: "trash", title: "" }), ev("f", { cat: "trash", time: "25:00", repeat: "hourly" })], kinds: ["trash"], now: NOW });
  assert.deepStrictEqual(prop(ics, "UID"), ["UID:a@home-planer", "UID:d@home-planer", "UID:f@home-planer"]);
  assert.ok(prop(ics, "DTSTART").indexOf("DTSTART;VALUE=DATE:20261012") >= 0, "an impossible time makes it an all-day event");
  assert.strictEqual(prop(ics, "RRULE").length, 3, "unknown repetition: none");
});
test("the events of the app's calendar come out as the same days (comparison with HP.occurrences)", () => {
  const evs = [ev("w", { repeat: "weekly", skip: ["2026-10-19"] }), ev("b", { repeat: "biweekly", date: "2026-10-01", until: "2026-12-10" }),
    ev("m", { repeat: "monthly", date: "2026-08-31" }), ev("y", { repeat: "yearly", date: "2025-11-02" })].map(e => HP.normEvent(e.id, e));
  const back = I.parse(I.build({ events: evs, now: NOW })).events.map(e => HP.normEvent("x" + e.uid.split("@")[0], Object.assign({}, e, { cat: "date" })));
  const days = list => HP.occurrences(list, "2026-10-01", "2027-03-31").map(o => o.e.id.replace(/^x/, "") + o.date).sort();
  assert.deepStrictEqual(days(back), days(evs));
});

/* ---------- reading ---------- */
const OUTLOOK = [
  "BEGIN:VCALENDAR", "PRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN", "VERSION:2.0", "METHOD:PUBLISH",
  "BEGIN:VTIMEZONE", "TZID:W. Europe Standard Time", "BEGIN:STANDARD", "DTSTART:16011028T030000", "TZOFFSETFROM:+0200", "TZOFFSETTO:+0100", "END:STANDARD", "END:VTIMEZONE",
  "BEGIN:VEVENT", "UID:040000008200E00074C5B7101A82E008", "SUMMARY;LANGUAGE=de-ch:Team-Znacht\\, mit Partner", "DTSTART;TZID=W. Europe Standard Time:20261023T190000",
  "DTEND;TZID=W. Europe Standard Time:20261023T223000", "LOCATION:Restaurant Kreis 4", "DESCRIPTION:Bitte bis Montag zusagen.\\nDanke!",
  "BEGIN:VALARM", "TRIGGER:-PT15M", "ACTION:DISPLAY", "DESCRIPTION:Reminder", "END:VALARM", "END:VEVENT",
  "BEGIN:VEVENT", "UID:abc-2", "SUMMARY:Yoga", "DTSTART:20260706T160000Z", "DTEND:20260706T171500Z", "RRULE:FREQ=WEEKLY;BYDAY=MO;COUNT=10", "EXDATE:20260720T160000Z", "END:VEVENT",
  "BEGIN:VEVENT", "UID:abc-3", "SUMMARY:Skiferien", "DTSTART;VALUE=DATE:20270206", "DTEND;VALUE=DATE:20270214", "END:VEVENT",
  "BEGIN:VEVENT", "UID:abc-4", "SUMMARY:Stand-up", "DTSTART:20261012T090000", "DURATION:PT15M", "RRULE:FREQ=DAILY;COUNT=5", "END:VEVENT",
  "BEGIN:VEVENT", "UID:abc-5", "SUMMARY:Abgesagt", "STATUS:CANCELLED", "DTSTART:20261015T090000", "END:VEVENT",
  "BEGIN:VEVENT", "UID:abc-2", "RECURRENCE-ID:20260713T160000Z", "SUMMARY:Yoga (verschoben)", "DTSTART:20260714T160000Z", "END:VEVENT",
  "BEGIN:VEVENT", "UID:abc-6", "SUMMARY:Mietzins", "DTSTART;VALUE=DATE:20261101", "RRULE:FREQ=MONTHLY;BYMONTHDAY=1", "END:VEVENT",
  "END:VCALENDAR"].join("\r\n").replace("Bitte bis Montag zusagen.", "Bitte bis Montag\r\n  zusagen.");
test("reading an Outlook file: time zones, UTC times, places, alarms, repetitions", () => {
  const r = I.parse(OUTLOOK), by = {};
  r.events.forEach(e => { by[e.uid] = e; });
  assert.strictEqual(r.events.length, 5); assert.strictEqual(r.dropped, 2); assert.strictEqual(r.simplified, 1);
  const a = by["040000008200E00074C5B7101A82E008"];
  assert.deepStrictEqual([a.title, a.date, a.time, a.endTime, a.end], ["Team-Znacht, mit Partner", "2026-10-23", "19:00", "22:30", ""]);
  assert.strictEqual(a.note, "Ort: Restaurant Kreis 4\n\nBitte bis Montag zusagen.\nDanke!");
  const y = by["abc-2"];
  assert.deepStrictEqual([y.date, y.time, y.endTime, y.repeat, y.until, y.skip.join()], ["2026-07-06", "18:00", "19:15", "weekly", "2026-09-07", "2026-07-20"]);
  const s = by["abc-3"];
  assert.deepStrictEqual([s.date, s.end, s.time], ["2027-02-06", "2027-02-13", ""]);
  const d = by["abc-4"];
  assert.deepStrictEqual([d.repeat, d.time, d.endTime], ["none", "09:00", "09:15"]); assert.match(d.note, /Wiederholung/);
  assert.strictEqual(by["abc-6"].repeat, "monthly");
});
test("reading nonsense gives nothing, not an error", () => {
  assert.deepStrictEqual(JSON.parse(JSON.stringify(I.parse("hallo"))), { events: [], simplified: 0, dropped: 0 });
  assert.strictEqual(I.parse("BEGIN:VEVENT\nSUMMARY:x\nDTSTART:20261399\nEND:VEVENT").dropped, 1);
});

/* ---------- the calendar service ---------- */
const W = L.load();
const HID = "h".repeat(10) + "AbCdEfGhIjKl";
const fsv = v => typeof v === "string" ? { stringValue: v } : typeof v === "number" ? { integerValue: String(v) } : Array.isArray(v) ? { arrayValue: { values: v.map(fsv) } }
  : v && typeof v === "object" ? { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fsv(x)])) } } : { nullValue: null };
let DB, calls;
W.fetch = url => {
  calls.push(url);
  const u = new URL(url), p = decodeURIComponent(u.pathname);
  if (DB.status) return Promise.resolve(new Response("{}", { status: DB.status }));
  const pre = "/v1/projects/splite-weiser-cf091/databases/(default)/documents/homes/";
  if (!p.startsWith(pre) || u.searchParams.get("key") !== "AIzaSyBoxXxX0WBFLoK4aDwSsf06fT0W8QTs6Uo") return Promise.resolve(new Response("{}", { status: 400 }));
  const rest = p.slice(pre.length).split("/");
  if (!DB.homes[rest[0]]) return Promise.resolve(new Response("{}", { status: 404 }));
  if (rest.length === 1) return Promise.resolve(new Response(JSON.stringify({ name: p, fields: fsv(DB.homes[rest[0]]).mapValue.fields })));
  const all = DB.events, start = +(u.searchParams.get("pageToken") || 0), size = 2;
  const docs = all.slice(start, start + size).map(e => ({ name: "projects/x/databases/(default)/documents/homes/" + rest[0] + "/events/" + e.id, fields: fsv(Object.assign({}, e, { id: undefined })).mapValue.fields }));
  return Promise.resolve(new Response(JSON.stringify(Object.assign({ documents: docs }, start + size < all.length ? { nextPageToken: String(start + size) } : {}))));
};
const ENV = { KALENDER_SCHLUESSEL: "ein-langes-geheimnis-fuer-den-test-1234567890" };
const call = (method, p, body, env) => W.__worker.fetch(new Request("https://kal.example.workers.dev" + p, { method, body: body ? JSON.stringify(body) : undefined, headers: body ? { "Content-Type": "application/json" } : {} }), env || ENV);
function reset() {
  calls = [];
  DB = { homes: { [HID]: { name: "WG Seefeld", base: "CHF", members: { m1: { name: "Marc", c: 1 }, m2: { name: "Lea", c: 2 } } } },
    events: [ev("e1", { cat: "trash", repeat: "weekly", title: "Kehricht" }), ev("e2", { cat: "meal", title: "Risotto", who: ["m2"] }), ev("e3", { cat: "birthday", repeat: "yearly", title: "Marc" })] };
}
test("calendar service: key, calendar with all pages of events, names, kinds", async () => {
  reset();
  const t = await call("POST", "/token", { home: HID });
  assert.strictEqual(t.status, 200); assert.strictEqual(t.headers.get("access-control-allow-origin"), "*");
  const { token } = await t.json();
  assert.ok(/^[A-Za-z0-9_-]{60,}$/.test(token) && token.indexOf(HID) < 0 && token.indexOf("hhhh") < 0, "the key does not show the household");
  const r = await call("GET", "/kalender/" + token + ".ics");
  assert.strictEqual(r.status, 200); assert.match(r.headers.get("content-type"), /^text\/calendar/);
  const ics = await r.text();
  assert.deepStrictEqual(prop(ics, "SUMMARY"), ["SUMMARY:🗑️ Kehricht", "SUMMARY:🍽️ Risotto (Lea kocht)", "SUMMARY:🎂 Marc"]);
  assert.ok(calls.filter(u => u.indexOf("/events") >= 0).length === 2, "two pages read");
  const only = await (await call("GET", "/kalender/" + token + ".ics?arten=trash,quatsch")).text();
  assert.deepStrictEqual(prop(only, "SUMMARY"), ["SUMMARY:🗑️ Kehricht"]);
});
test("calendar service: renewed link, foreign or broken keys, unknown household", async () => {
  reset();
  const { token } = await (await call("POST", "/token", { home: HID })).json();
  DB.homes[HID].calV = 1;
  assert.strictEqual((await call("GET", "/kalender/" + token + ".ics")).status, 404, "old link after «Link erneuern»");
  const t2 = (await (await call("POST", "/token", { home: HID })).json()).token;
  assert.strictEqual((await call("GET", "/kalender/" + t2 + ".ics")).status, 200);
  const other = await call("GET", "/kalender/" + t2 + ".ics", null, { KALENDER_SCHLUESSEL: "ein-anderes-geheimnis-0987654321" });
  assert.strictEqual(other.status, 404, "a key from another service does not open");
  assert.strictEqual((await call("GET", "/kalender/" + t2.slice(0, -2) + "xx.ics")).status, 404);
  assert.strictEqual((await call("POST", "/token", { home: "kurz" })).status, 400);
  assert.strictEqual((await call("POST", "/token", { home: "z".repeat(22) })).status, 404);
  DB.status = 403;
  assert.strictEqual((await call("POST", "/token", { home: HID })).status, 502, "rules missing");
});
test("calendar service: not set up, preflight, health check", async () => {
  reset();
  const r = await call("GET", "/", null, {});
  assert.strictEqual(r.status, 500); assert.match(await r.text(), /DIENST_SCHLUESSEL/);
  assert.strictEqual((await call("OPTIONS", "/token")).status, 204);
  assert.match(await (await call("GET", "/")).text(), /bereit/);
});

queue.then(() => {
  console.log((failed ? "✗ " + failed + " failed, " : "✓ ") + n + " passed");
  process.exit(failed ? 1 : 0);
});
