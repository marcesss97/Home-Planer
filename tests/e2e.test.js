/* Home-Planer: the whole app in a real browser (Chromium through Playwright).
   Run:  node tests/e2e.test.js        (needs Playwright: npm install playwright, or PLAYWRIGHT=/path/to/playwright)
   The script serves the app itself. The group sync runs against a stand-in for Firebase (tests/fake-firestore.js) whose
   data lives here in the script, so separate browser profiles act as separate phones of one household. */
"use strict";
const http = require("http"), fs = require("fs"), path = require("path"), assert = require("assert");
let chromium;
try { ({ chromium } = require(process.env.PLAYWRIGHT || "playwright")); }
catch (e) { console.error("Playwright fehlt: npm install playwright, oder PLAYWRIGHT=/pfad/zu/playwright setzen."); process.exit(2); }

const ROOT = path.join(__dirname, "..");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json", ".rules": "text/plain; charset=utf-8" };
function serve() {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, path.normalize(p));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => srv.listen(0, "127.0.0.1", () => r(srv)));
}

/* ---------- the stand-in for the Firestore server ---------- */
const FS = { db: {}, deny: false, nodb: false, pages: new Set() };
function children(p) {
  const pre = p + "/";
  return Object.keys(FS.db).sort().filter(k => k.indexOf(pre) === 0 && k.slice(pre.length).indexOf("/") < 0).map(k => ({ id: k.slice(pre.length), data: FS.db[k] }));
}
function changed() { FS.pages.forEach(pg => { pg.evaluate(() => window.__fsChanged && window.__fsChanged()).catch(() => {}); }); }
function setPath(obj, dotted, v) {
  const parts = dotted.split("."); let o = obj;
  for (let i = 0; i < parts.length - 1; i++) { if (!o[parts[i]] || typeof o[parts[i]] !== "object") o[parts[i]] = {}; o = o[parts[i]]; }
  o[parts[parts.length - 1]] = v;
}
function fsOp(op, arg) {
  if (FS.deny) return { error: { code: "permission-denied", message: "Missing or insufficient permissions." } };
  if (FS.nodb) return { error: { code: "not-found", message: "The database (default) does not exist for project test." } };
  const j = o => JSON.parse(JSON.stringify(o));
  switch (op) {
    case "get": return { value: FS.db[arg] === undefined ? null : j(FS.db[arg]) };
    case "list": return { value: j(children(arg)) };
    case "count": return { value: children(arg).length };
    case "set": FS.db[arg.path] = j(arg.data); break;
    case "update":
      if (FS.db[arg.path] === undefined) return { error: { code: "not-found", message: "No document to update" } };
      Object.keys(arg.data).forEach(k => setPath(FS.db[arg.path], k, j(arg.data[k]))); break;
    case "delete": delete FS.db[arg]; break;
    case "tx": arg.forEach(o => { if (o.data === null) delete FS.db[o.path]; else FS.db[o.path] = j(o.data); }); break;
    default: return { error: { code: "internal", message: "unknown op " + op } };
  }
  setTimeout(changed, 0);
  return { value: null };
}
const docsUnder = hid => Object.keys(FS.db).filter(k => k.indexOf("homes/" + hid + "/") === 0);

/* ---------- devices ---------- */
let browser, BASE;
async function device({ cloud, width, dark } = {}) {
  const ctx = await browser.newContext({ viewport: { width: width || 390, height: 844 }, locale: "de-CH", timezoneId: "Europe/Zurich", colorScheme: dark ? "dark" : "light", acceptDownloads: true, serviceWorkers: "block" });
  if (cloud) {
    await ctx.exposeBinding("__fs", (src, op, arg) => fsOp(op, arg));
    await ctx.route("**/vendor-firebase.js", r => r.fulfill({ contentType: "application/javascript", body: fs.readFileSync(path.join(__dirname, "fake-firestore.js"), "utf8") }));
  } else {
    await ctx.route("**/config.js", r => r.fulfill({ contentType: "application/javascript", body: "window.HOMEPLANER_CONFIG = { firebase: null };" }));
  }
  await ctx.route(/^https:\/\//, r => r.abort());                     // no rates, no fonts from elsewhere: nothing may depend on it
  const p = await ctx.newPage();
  p.errors = [];
  p.on("pageerror", e => p.errors.push("pageerror: " + e.message));
  p.on("console", m => { if (m.type() === "error" && !/net::ERR_FAILED|Failed to load resource/.test(m.text())) p.errors.push(m.text()); });
  FS.pages.add(p);
  return p;
}
const tab = (p, id) => p.click("#hp-tab-" + id);
const save = p => p.click(".sheet .foot >> text=Speichern");
async function toast(p, re) { await p.locator(".toast", { hasText: re }).first().waitFor({ timeout: 6000 }); }
async function sees(p, text, timeout) { await p.getByText(text, { exact: false }).first().waitFor({ timeout: timeout || 6000 }); }
async function noSheet(p) { await p.locator(".sheet").waitFor({ state: "detached", timeout: 6000 }); }
async function createHome(p, name, people) {
  await p.click("text=" + (await p.locator("text=Haushalt anlegen").count() ? "Haushalt anlegen" : "Neuer Haushalt"));
  await p.fill("#hp-home-name", name);
  for (const n of people) { await p.fill("#hp-home-person", n); await p.keyboard.press("Enter"); }
  await p.click(".sheet .foot >> text=Haushalt anlegen");
  await noSheet(p);
  await sees(p, name);
}

/* ---------- steps ---------- */
let passed = 0;
const steps = [];
const step = (name, fn) => steps.push({ name, fn });

let A, today;
step("Startseite ohne Haushalt", async () => {
  A = await device();
  await A.goto(BASE);
  await sees(A, "Noch kein Haushalt");
  assert.strictEqual(await A.title(), "Home-Planer");
  today = await A.evaluate(() => window.HP.today());
});
step("Haushalt anlegen", async () => {
  await createHome(A, "WG Seefeld", ["Marc", "Lea", "Tim"]);
  await sees(A, "3 Personen");
  await sees(A, "Nur auf diesem Gerät gespeichert");
  assert.ok(await A.locator(".me .av").count(), "my avatar sits on the band");
});
step("Einkaufsliste: Mengen, Abteilungen, doppelte, abhaken, Vorschläge, löschen", async () => {
  await tab(A, "shop");
  for (const t of ["2 Liter Milch", "Brot", "Weisswein"]) { await A.fill("#hp-shop-q", t); await A.keyboard.press("Enter"); await A.locator(".sh-t", { hasText: t.replace("2 Liter ", "") }).first().waitFor(); }
  assert.match(await A.locator(".sh", { hasText: "Milch" }).innerText(), /2 Liter/);
  assert.match(await A.locator("section", { has: A.locator(".sh-t", { hasText: "Milch" }) }).locator(".aisle").innerText(), /Milch, Käse/);
  assert.match(await A.locator("section", { has: A.locator(".sh-t", { hasText: "Weisswein" }) }).locator(".aisle").innerText(), /Getränke/);
  await A.fill("#hp-shop-q", "milch"); await A.keyboard.press("Enter");
  await toast(A, /steht schon auf der Liste/);
  await A.fill("#hp-shop-q", "");
  await A.click('[aria-label="Brot abhaken"]');
  await A.locator("section", { hasText: "Im Wagen" }).locator(".sh-t", { hasText: "Brot" }).waitFor();
  assert.strictEqual(await A.locator("#hp-tab-shop .badge").innerText(), "2");
  await A.fill("#hp-shop-q", "Bro");
  await A.click('.quick .chip:has-text("Brot")');
  await A.locator('[aria-label="Brot abhaken"]').waitFor();
  assert.strictEqual(await A.inputValue("#hp-shop-q"), "");
  await A.click('[aria-label="Brot abhaken"]');
  await A.click("text=Erledigte löschen");
  await toast(A, /Ein Artikel gelöscht/);
  assert.strictEqual(await A.locator(".sh-t", { hasText: "Brot" }).count(), 0);
  await A.click('.sh-main:has-text("Weisswein")');
  await A.fill("#hp-it-qty", "2 Flaschen");
  await A.fill("#hp-it-note", "für das Risotto");
  await save(A); await noSheet(A);
  assert.match(await A.locator(".sh", { hasText: "Weisswein" }).innerText(), /2 Flaschen[\s\S]*für das Risotto/);
});
step("Kalender: wiederkehrend, mehrtägig, einzeln streichen", async () => {
  await tab(A, "cal");
  await sees(A, "Noch keine Termine");
  await A.click(".fab");
  await A.fill("#hp-ev-title", "Kehricht");
  await A.click('.sheet [role=radio]:has-text("Abfuhr")');
  assert.strictEqual(await A.inputValue("#hp-ev-rep"), "weekly", "rubbish collection repeats weekly by itself");
  await save(A); await noSheet(A);
  await toast(A, /Termin eingetragen/);
  const next = await A.evaluate(t => window.HP.addDays(t, 7), today);
  assert.strictEqual(await A.locator("section.stack:has-text('Demnächst') .x", { hasText: "Kehricht" }).count(), 1, "weekly appointment once in 'Demnächst'");
  await A.click("section.stack:has-text('Demnächst') .x:has-text('Kehricht')");
  await A.click("text=ausfallen lassen");
  await toast(A, /fällt aus/);
  if (next.slice(0, 7) === today.slice(0, 7)) {
    const label = await A.locator(".cal-d").nth(await A.evaluate(n => [...document.querySelectorAll(".cal-d")].findIndex(b => b.getAttribute("aria-label").startsWith(window.HP.longDay(n))), next)).getAttribute("aria-label");
    assert.ok(!/Termin/.test(label), "the cancelled week has no dot: " + label);
  }
  const in3 = await A.evaluate(t => window.HP.addDays(t, 3), today), in5 = await A.evaluate(t => window.HP.addDays(t, 5), today);
  await A.click(".fab");
  await A.fill("#hp-ev-title", "Besuch Grosi");
  await A.click('.sheet [role=radio]:has-text("Besuch")');
  await A.fill("#hp-ev-date", in3); await A.fill("#hp-ev-end", in5);
  await A.click('#hp-ev-who + .chips >> text=Lea').catch(() => A.click('.sheet .chip:has-text("Lea")'));
  await save(A); await noSheet(A);
  await sees(A, "Tag 1 von 3");
  await A.click(".fab");
  await A.fill("#hp-ev-title", "Falsch");
  await A.fill("#hp-ev-date", in5); await A.fill("#hp-ev-end", in3);
  await save(A);
  await A.locator(".sheet-err", { hasText: "Ende liegt vor dem Beginn" }).waitFor();
  await A.click(".sheet-head >> text=Abbrechen"); await noSheet(A);
});
step("Pflanzen: fällig, giessen in der Übersicht, Verlauf", async () => {
  await tab(A, "plants");
  await A.click(".empty >> text=Erste Pflanze");
  const nine = await A.evaluate(t => window.HP.addDays(t, -9), today);
  await A.fill("#hp-pl-name", "Monstera"); await A.fill("#hp-pl-room", "Wohnzimmer"); await A.fill("#hp-pl-last", nine);
  await save(A); await noSheet(A);
  await sees(A, "Seit 2 Tagen fällig");
  await A.click(".fab");
  await A.fill("#hp-pl-name", "Basilikum"); await A.click('[aria-label="Kräuter"]'); await A.click('.sheet .chip:has-text("3 Tage")');
  await A.click('.sheet [role=radio]:has-text("2 Wochen")');
  await save(A); await noSheet(A);
  await sees(A, "In 3 Tagen giessen");
  assert.strictEqual(await A.locator("#hp-tab-plants .badge").innerText(), "1");
  await tab(A, "home");
  await A.locator(".panel:has-text('Heute') .x:has-text('Monstera')").waitFor();
  await A.click('[aria-label="Monstera giessen"]');
  await toast(A, /Monstera gegossen/);
  assert.strictEqual(await A.locator("#hp-tab-plants .badge").count(), 0);
  await tab(A, "plants");
  await A.click('.plant-main:has-text("Monstera")');
  await sees(A, "Gegossen von Marc");
  await A.click(".sheet-head >> text=Abbrechen"); await noSheet(A);
  await A.click('.plant-main:has-text("Basilikum")');
  await A.click("text=Jetzt düngen");
  await toast(A, /gedüngt/);
});
step("Infos: Vorlage, Links nur mit https, Passwort verdeckt, Frist in der Übersicht, Suche", async () => {
  await tab(A, "infos");
  await A.click('.chip:has-text("Mietvertrag")');
  await A.fill('[aria-label="Vermieter / Verwaltung: Wert"]', "Livit AG");
  await A.fill('[aria-label="Telefon: Wert"]', "+41 44 123 45 67");
  await A.fill('[aria-label="Datum"]', await A.evaluate(t => window.HP.addDays(t, 20), today));
  await A.click('.sheet button:has-text("Link")');
  await A.fill('[aria-label="Name des Links 1"]', "Vertrag");
  await A.fill('[aria-label="Adresse des Links 1"]', "javascript:alert(1)");
  await save(A);
  await A.locator(".sheet-err", { hasText: "keine vollständige Adresse" }).waitFor();
  await A.fill('[aria-label="Adresse des Links 1"]', "https://example.ch/mietvertrag.pdf");
  await save(A);
  await sees(A, "Noch leer:");
  assert.strictEqual(await A.locator('.kv-v a[href="tel:+41441234567"]').count(), 1);
  assert.strictEqual(await A.locator('a.btn[href="https://example.ch/mietvertrag.pdf"]').getAttribute("rel"), "noopener noreferrer");
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await A.click(".fab");
  await A.click('.sheet [role=radio]:has-text("WLAN")');
  await A.fill("#hp-in-title", "WLAN");
  await A.fill('[aria-label="Netzwerk: Wert"]', "Seefeld");
  await A.fill('[aria-label="Passwort: Wert"]', "sonnenblume42");
  await save(A);
  await A.locator(".kv", { hasText: "Passwort" }).waitFor();
  assert.ok(!/sonnenblume42/.test(await A.locator(".sheet").innerText()), "the password is hidden");
  await A.click('[aria-label="Passwort zeigen"]');
  await sees(A, "sonnenblume42");
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await tab(A, "home");
  await sees(A, "in 20 Tagen");
  await tab(A, "infos");
  for (let i = 0; i < 4; i++) {
    await A.click(".fab"); await A.fill("#hp-in-title", "Eintrag " + i); await save(A);
    await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  }
  await A.fill("#hp-in-q", "livit");
  assert.strictEqual(await A.locator(".list .x").count(), 1);
  await A.fill("#hp-in-q", "sonnenblume");
  await sees(A, "Nichts gefunden");
  await A.fill("#hp-in-q", "");
});
step("Kasse: Ausgaben, Abrechnung, als bezahlt eintragen, Statistik", async () => {
  await tab(A, "kasse");
  await sees(A, "Noch keine Ausgaben");
  await A.click(".fab");
  await A.fill("#hp-amount", "90"); await A.fill("#hp-title", "Wocheneinkauf");
  await save(A); await noSheet(A);
  await A.locator(".stub-card .fig.pos", { hasText: "+60.00" }).waitFor();
  await A.click(".fab");
  await A.fill("#hp-amount", "45"); await A.fill("#hp-title", "Pizza");
  await A.click('.sheet [role=radio]:has-text("Restaurant")');
  await A.click('#hp-payer-l + .chips [role=radio]:has-text("Lea")');
  await save(A); await noSheet(A);
  await A.click('[role=tab]:has-text("Abrechnung")');
  await sees(A, "So seid ihr quitt");
  let guard = 0;
  while (await A.locator("text=Als bezahlt eintragen").count() && guard++ < 5) {
    await A.locator("text=Als bezahlt eintragen").first().click();
    await save(A); await noSheet(A);
  }
  await sees(A, "Alle sind quitt");
  await A.click('[role=tab]:has-text("Statistik")');
  await sees(A, "Nach Kategorie");
  await sees(A, "Stempel des Haushalts");
  await A.click('[role=tab]:has-text("Ausgaben")');
  await A.click('.x:has-text("Pizza")');
  await A.fill("#hp-amount", "48");
  await save(A); await noSheet(A);
  await toast(A, /Änderung gespeichert/);
});
step("Neu laden: alles noch da, der Haushalt öffnet sich von selbst", async () => {
  await A.reload();
  await sees(A, "WG Seefeld");
  await tab(A, "shop");
  await sees(A, "Weisswein");
  await tab(A, "kasse");
  await sees(A, "Pizza");
});
step("Zurück-Taste: schliesst zuerst das Fenster, dann zurück zur Liste", async () => {
  await tab(A, "home");
  await A.click('[aria-label="Haushalt bearbeiten"]');
  await A.locator(".sheet").waitFor();
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await A.click(".back");
  await sees(A, "Eure Haushalte");
  await A.click(".trip:has-text('WG Seefeld')");
  await sees(A, "Heute");
  await A.click('[aria-label="Haushalt bearbeiten"]');
  await A.goBack();                                                     // the back key closes the sheet and stays
  await noSheet(A);
  await sees(A, "Heute");
  await A.goBack();                                                     // and then leads to the list
  await sees(A, "Eure Haushalte");
  await A.click(".trip:has-text('WG Seefeld')");
  await sees(A, "Heute");
});
step("Personen: dazu, umbenennen, entfernen nur ohne Buchungen; Avatar", async () => {
  await A.click('[aria-label="Haushalt bearbeiten"]');
  await A.fill("#hp-set-add", "Nora"); await A.keyboard.press("Enter");
  await A.locator('[aria-label="Name von Nora"]').waitFor();
  await A.fill('[aria-label="Name von Tim"]', "Timo"); await A.locator("#hp-set-name").focus();
  await A.click('[aria-label="Nora entfernen"]');
  await A.locator('[aria-label="Name von Nora"]').waitFor({ state: "detached" });
  await A.click('[aria-label="Lea entfernen"]');
  await A.locator(".sheet-err", { hasText: "Buchung" }).waitFor();
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await sees(A, "3 Personen");
  await A.click(".me");
  await A.click('.av-pick[aria-label^="Panda"]');
  await A.click(".sheet .foot >> text=Speichern");
  await toast(A, /Avatar gespeichert/);
});
let backupFile;
step("Sicherung herunterladen und wieder einlesen", async () => {
  await A.click('[aria-label="Haushalt bearbeiten"]');
  const [dl] = await Promise.all([A.waitForEvent("download"), A.click("text=Sicherung herunterladen")]);
  backupFile = await dl.path();
  const j = JSON.parse(fs.readFileSync(backupFile, "utf8"));
  assert.strictEqual(j.format, "homeplaner");
  assert.ok(/^homeplaner-wg-seefeld-\d{4}-\d{2}-\d{2}\.json$/.test(dl.suggestedFilename()), dl.suggestedFilename());
  assert.strictEqual(j.cols.shopping.length, 2); assert.strictEqual(j.cols.plants.length, 2); assert.strictEqual(j.cols.infos.length, 6);
  assert.ok(j.cols.expenses.length >= 3); assert.strictEqual(j.cols.events.length, 2);
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await A.click(".back");
  await A.click('[aria-label="Einstellungen"]');
  await A.setInputFiles("#hp-import", backupFile);
  await toast(A, /Sicherung eingelesen/);
  await sees(A, "WG Seefeld (Sicherung)");
  await tab(A, "shop");
  await sees(A, "Weisswein");
});
step("Haushalt löschen", async () => {
  await A.click('[aria-label="Haushalt bearbeiten"]');
  await A.click("text=Haushalt löschen");
  await A.click("text=Wirklich löschen");
  await toast(A, /Haushalt gelöscht/);
  await sees(A, "Eure Haushalte");
  assert.strictEqual(await A.locator(".trip").count(), 1);
});
step("Schmales Handy (320 px): kein seitliches Scrollen", async () => {
  const N = await device({ width: 320 });
  await N.goto(BASE);
  await createHome(N, "Familie Muster-Bühlmann", ["Marc", "Lea"]);
  for (const t of ["home", "kasse", "shop", "cal", "plants", "infos"]) {
    await tab(N, t);
    const [sw, iw] = await N.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    assert.ok(sw <= iw, "tab " + t + " is wider than the screen: " + sw);
  }
  assert.deepStrictEqual(N.errors, []);
  await N.context().close();
});

/* ---------- group sync ---------- */
let C1, C2, hid;
step("Gruppen-Sync: anlegen speichert beim Server", async () => {
  FS.db = {};
  C1 = await device({ cloud: true }); C2 = await device({ cloud: true });
  await C1.goto(BASE);
  await createHome(C1, "WG Sync", ["Marc", "Lea"]);
  await sees(C1, "Automatisch für den ganzen Haushalt gespeichert");
  hid = await C1.evaluate(() => location.hash.slice(1));
  assert.ok(FS.db["homes/" + hid], "household document on the server");
  await C1.click("text=Einladen");
  const link = await C1.inputValue("#hp-link");
  assert.ok(link.endsWith("#" + hid));
  assert.strictEqual(await C1.locator(".qr").count(), 1);
  await C1.click(".sheet-head >> text=Fertig"); await noSheet(C1);
});
step("Gruppen-Sync: zweites Handy tritt mit dem Link bei", async () => {
  await C2.goto(BASE + "#" + hid);
  await sees(C2, "WG Sync");
  await C2.click('[aria-label="Zuerst deinen Namen wählen"]');
  await C2.click('.who .chip:has-text("Lea")');
  await C2.click(".sheet-head >> text=Abbrechen");
});
step("Gruppen-Sync: Einkaufsliste und Pflanzen erscheinen auf dem anderen Handy", async () => {
  await tab(C2, "shop");
  await C2.fill("#hp-shop-q", "Kaffee"); await C2.keyboard.press("Enter");
  await tab(C1, "shop");
  await C1.locator('[aria-label="Kaffee abhaken"]').click();
  await C2.locator('.sh.done:has-text("Kaffee")').waitFor();
  await tab(C2, "plants");
  await C2.click(".empty >> text=Erste Pflanze");
  await C2.fill("#hp-pl-name", "Ficus"); await C2.fill("#hp-pl-last", "");
  await save(C2); await noSheet(C2);
  await tab(C1, "plants");
  await C1.click('[aria-label="Ficus giessen"]');
  await C2.locator('[aria-label="Ficus ist heute gegossen"]').waitFor();
  assert.strictEqual(docsUnder(hid).filter(k => k.indexOf("/plants/") > 0).length, 1);
});
step("Gruppen-Sync: gleichzeitige Änderungen an Personen gehen nicht verloren", async () => {
  await Promise.all([
    C1.evaluate(id => window.HPStore.adapter("cloud").patchHome(id, { members: { mx1: { name: "Nora", c: 2, o: 5, gone: false, a: "" } } }), hid),
    C2.evaluate(id => window.HPStore.adapter("cloud").patchHome(id, { members: { mx2: { name: "Jan", c: 3, o: 6, gone: false, a: "" } } }), hid)
  ]);
  await tab(C1, "home"); await tab(C2, "home");
  await sees(C1, "4 Personen"); await sees(C2, "4 Personen");
});
step("Gruppen-Sync: für alle löschen", async () => {
  await C2.click('[aria-label="Haushalt bearbeiten"]');
  await C2.click("text=Haushalt für alle löschen");
  await C2.click("text=Wirklich löschen");
  await toast(C2, /Haushalt gelöscht/);
  await sees(C1, "Diesen Haushalt gibt es nicht");
  await new Promise(r => setTimeout(r, 300));
  assert.deepStrictEqual(docsUnder(hid), [], "entries below the household are cleaned up");
  await C1.click("text=Aus meiner Liste entfernen");
  await sees(C1, "Noch kein Haushalt");
});
step("Gruppen-Sync: fehlende Regeln und fehlende Datenbank werden klar gemeldet", async () => {
  FS.deny = true;
  await createHome(C1, "Geht nicht", ["Marc"]).catch(() => {});
  await toast(C1, /Sicherheitsregeln/);
  await C1.goto(BASE);
  await C1.click('[aria-label="Einstellungen"]');
  await C1.click("text=Verbindung prüfen");
  await sees(C1, "Es fehlen die Sicherheitsregeln");
  FS.deny = false; FS.nodb = true;
  await C1.click("text=Verbindung prüfen");
  await sees(C1, "noch keine Firestore-Datenbank");
  FS.nodb = false;
  await C1.click("text=Verbindung prüfen");
  await sees(C1, "Die Verbindung steht");
});
step("Gruppen-Sync: ein Haushalt vom Gerät wird freigegeben", async () => {
  await C1.setInputFiles("#hp-import", backupFile);
  await toast(C1, /Sicherung eingelesen/);
  await sees(C1, "Nur auf diesem Gerät gespeichert");
  await C1.click("text=Einladen");
  await C1.click("text=Für alle im Haushalt freigeben");
  await toast(C1, /Freigegeben/);
  await C1.locator("#hp-link").waitFor();
  await C1.click(".sheet-head >> text=Fertig"); await noSheet(C1);
  await sees(C1, "Automatisch für den ganzen Haushalt gespeichert");
  const id = await C1.evaluate(() => location.hash.slice(1));
  const j = JSON.parse(fs.readFileSync(backupFile, "utf8")), want = Object.keys(j.cols).reduce((a, c) => a + j.cols[c].length, 0);
  assert.strictEqual(docsUnder(id).length, want);
  assert.strictEqual(await C1.evaluate(k => localStorage.getItem("hp.h." + k), id), null, "the device copy is gone after publishing");
});

(async () => {
  const srv = await serve();
  BASE = "http://127.0.0.1:" + srv.address().port + "/";
  browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  let failed = null;
  for (const s of steps) {
    try { await s.fn(); passed++; console.log("✓ " + s.name); }
    catch (e) {
      failed = s; console.error("✗ " + s.name + "\n  " + (e && e.stack || e).split("\n").slice(0, 4).join("\n  "));
      for (const p of FS.pages) { try { if (!p.isClosed()) await p.screenshot({ path: path.join(require("os").tmpdir(), "homeplaner-fail-" + FS.pages.size + ".png") }); } catch (x) { /* page gone */ } }
      break;
    }
  }
  const errors = [];
  FS.pages.forEach(p => (p.errors || []).forEach(e => errors.push(e)));
  if (errors.length && !failed) { console.error("✗ Fehler in der Konsole:\n  " + errors.join("\n  ")); failed = true; }
  await browser.close(); srv.close();
  console.log(failed ? "✗ abgebrochen nach " + passed + " von " + steps.length + " Schritten" : "✓ alle " + passed + " Schritte bestanden");
  process.exit(failed ? 1 : 0);
})();
