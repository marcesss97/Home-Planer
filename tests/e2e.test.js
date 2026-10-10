/* Home-Planer: the whole app in a real browser (Chromium through Playwright).
   Run:  node tests/e2e.test.js        (needs Playwright: npm install playwright, or PLAYWRIGHT=/path/to/playwright)
   The script serves the app itself. The group sync runs against a stand-in for Firebase (tests/fake-firestore.js) whose
   data lives here in the script, so separate browser profiles act as separate phones of one household. */
"use strict";
const http = require("http"), fs = require("fs"), path = require("path"), assert = require("assert");
let chromium;
/* Requests of the service worker go through the same routes as those of the page (config.js without Firebase). */
process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = "1";
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
async function device({ cloud, width, dark, sw, calendar } = {}) {
  const ctx = await browser.newContext({ viewport: { width: width || 390, height: 844 }, locale: "de-CH", timezoneId: "Europe/Zurich", colorScheme: dark ? "dark" : "light", acceptDownloads: true,
    serviceWorkers: sw ? "allow" : "block", permissions: ["clipboard-read", "clipboard-write"] });
  if (cloud) {
    await ctx.exposeBinding("__fs", (src, op, arg) => fsOp(op, arg));
    await ctx.route("**/vendor-firebase.js", r => r.fulfill({ contentType: "application/javascript", body: fs.readFileSync(path.join(__dirname, "fake-firestore.js"), "utf8") }));
  } else {
    await ctx.route("**/config.js", r => r.fulfill({ contentType: "application/javascript", body: "window.HOMEPLANER_CONFIG = { firebase: null };" }));
  }
  await ctx.route(/^https:\/\//, r => r.abort());                     // no rates, no fonts from elsewhere: nothing may depend on it
  if (calendar) {                                                       // a calendar service: config.js names it, the test plays it
    const cfg = fs.readFileSync(path.join(__dirname, "..", "config.js"), "utf8").replace('const kalenderDienst = "";', "const kalenderDienst = \"https://kal.test\";");
    await ctx.route("**/config.js", r => r.fulfill({ contentType: "application/javascript", body: cfg }));
    await ctx.route("https://kal.test/**", r => calendar(r));
  }
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
step("Rezepte: Kochidee, Portionen, Einkaufsliste, übernehmen, einplanen, Kühlschrank-Suche", async () => {
  await A.click(".trip");                                               // the original household; its copy was deleted above
  await sees(A, "Heute");
  await tab(A, "recipes");
  const first = await A.locator(".idea-t").innerText();
  await A.click("text=Andere Idee");
  await A.waitForFunction(t => document.querySelector(".idea-t") && document.querySelector(".idea-t").textContent !== t, first);
  await A.fill("#hp-rc-q", "shakshuka");
  await A.click('.x:has-text("Shakshuka")');
  await sees(A, "2 Portionen");
  await A.click('[aria-label="Eine Portion mehr"]'); await A.click('[aria-label="Eine Portion mehr"]');
  await sees(A, "8 Eier");
  assert.ok(!(await A.locator('.row.ingr:has-text("Olivenöl") input').isChecked()), "staples start unticked");
  await A.click('.row.ingr:has-text("Brot") input');
  await A.click('.sheet .btn.primary:has-text("Einkaufsliste")');
  await toast(A, /Zutaten auf der Einkaufsliste/);
  await A.click('.sheet-head .btn.primary:has-text("Übernehmen")');
  await toast(A, /ist jetzt in euren Rezepten/);
  await A.locator('.sheet-head:has-text("Bearbeiten")').waitFor();
  await A.click(".sheet .foot >> text=Einplanen");
  const tomorrow = await A.evaluate(t => window.HP.addDays(t, 1), today);
  await A.fill("#hp-ml-date", tomorrow);
  await A.click(".sheet .foot >> text=Einplanen");
  await toast(A, /Eingeplant: Shakshuka/);
  await noSheet(A);
  await A.fill("#hp-rc-q", "");
  await A.locator('.week-row:has-text("Morgen") .meal:has-text("Shakshuka")').waitFor();
  await A.fill("#hp-rc-q", "zucchetti, feta");
  await A.locator('.x:has-text("Ofengemüse mit Feta")', { hasText: "passt: zucchetti, feta" }).waitFor();
  await A.fill("#hp-rc-q", "");
  await A.click(".fab");
  await A.fill("#hp-rc-title", "Omas Gemüsesuppe");
  await A.fill("#hp-rc-ingr", "- 2 Rüebli\n1 Stange Lauch\n500 g Kartoffeln\nSalz, Pfeffer");
  await A.fill("#hp-rc-steps", "1. Gemüse schneiden\n2. Weich kochen\n3. Pürieren");
  await A.fill("#hp-rc-link", "javascript:alert(1)");
  await save(A);
  await A.locator(".sheet-err", { hasText: "keine vollständige Adresse" }).waitFor();
  await A.fill("#hp-rc-link", "https://example.ch/suppe");
  await save(A);
  await A.locator('.sheet-head:has-text("Omas Gemüsesuppe")').waitFor();
  assert.strictEqual(await A.locator(".sheet .steps li").count(), 3);
  assert.match(await A.locator(".sheet .row.ingr").first().innerText(), /^2 Rüebli$/);
  await A.click("text=Heute gekocht?");
  await toast(A, /En Guete/);
  await A.click('.sheet button:has-text("Als Favorit")');
  await A.locator('.sheet button:has-text("Favorit")[aria-pressed="true"]').waitFor();
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await A.locator('.x:has-text("Omas Gemüsesuppe")', { hasText: "zuletzt gekocht heute" }).waitFor();
  await tab(A, "shop");
  assert.match(await A.locator(".sh", { hasText: "Eier" }).innerText(), /8/);
  assert.strictEqual(await A.locator(".sh-t", { hasText: "Brot" }).count(), 0, "unticked ingredients stay off the list");
  await tab(A, "cal");
  await A.locator('section.stack:has-text("Demnächst") .x:has-text("Shakshuka")', { hasText: "Marc kocht" }).waitFor();
  await A.click('section.stack:has-text("Demnächst") .x:has-text("Shakshuka")');
  await sees(A, "Eingeplant:");
  await A.click("text=Aus dem Plan");
  await toast(A, /Aus dem Wochenplan genommen/);
});
/* A recipe site that does not let the browser read it, and a reader that does: played from a test page. */
const FOOBY = fs.readFileSync(path.join(__dirname, "fixtures", "fooby-artig.html"), "utf8");
async function readerRoute(p) {
  await p.context().route(/^https:\/\/api\.allorigins\.win\//, r => r.fulfill({ status: 200, contentType: "text/html", headers: { "Access-Control-Allow-Origin": "*" }, body: FOOBY }));
}
/* A screenshot of a recipe, drawn in the page: what a phone would hand over. */
async function recipePng(p, file) {
  const b64 = await p.evaluate(() => {
    const c = document.createElement("canvas"); c.width = 750; c.height = 1050; const g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, 750, 1050); g.fillStyle = "#222";
    const L = [["bold 40px Arial", "Spaghetti Carbonara"], ["26px Arial", "20 Min. | 2 Portionen"], ["", ""], ["bold 30px Arial", "Zutaten"], ["28px Arial", "200 g Spaghetti"], ["28px Arial", "100 g Guanciale"],
      ["28px Arial", "2 Eier"], ["28px Arial", "50 g Pecorino, gerieben"], ["28px Arial", "Pfeffer"], ["", ""], ["bold 30px Arial", "Zubereitung"], ["26px Arial", "1. Spaghetti in Salzwasser 9 Minuten kochen."],
      ["26px Arial", "2. Guanciale in Streifen schneiden und knusprig"], ["26px Arial", "braten."], ["26px Arial", "3. Eier mit Pecorino verquirlen, unter die"], ["26px Arial", "Pasta ziehen und sofort servieren."]];
    let y = 70; L.forEach(([f, t]) => { if (f) g.font = f; g.fillText(t, 40, y); y += 56; });
    return c.toDataURL("image/png").split(",")[1];
  });
  fs.writeFileSync(file, Buffer.from(b64, "base64"));
  return b64;
}
const TMP = require("os").tmpdir();
let K;
step("Rezept aus einem Link: prüfen, speichern, Kochmodus mit Portionen, Timer und Wecker", async () => {
  K = await device();
  await K.clock.install();
  await readerRoute(K);
  await K.goto(BASE);
  await createHome(K, "Küche Test", ["Marc", "Lea"]);
  await tab(K, "recipes");
  await K.click('.qa:has-text("Aus Link")');
  await K.fill("#hp-imp-link", "Schau mal: https://fooby.ch/de/rezepte/12345/aelplermagronen");
  await K.click(".sheet .foot >> text=Rezept holen");
  await K.locator('.sheet-head:has-text("Rezept prüfen")').waitFor({ timeout: 30000 });
  assert.match(await K.inputValue("#hp-rc-ingr"), /150 g Gruyère, gerieben/);
  assert.strictEqual(await K.inputValue("#hp-rc-title"), "Älplermagronen mit Apfelmus & Zwiebeln");
  assert.strictEqual(await K.inputValue("#hp-rc-link"), "https://fooby.ch/de/rezepte/12345/aelplermagronen");
  await save(K);
  await K.locator(".note.fresh").waitFor();
  await K.click("text=Kochmodus starten");
  await K.locator(".cook").waitFor();
  await sees(K, "Zuerst bereitstellen");
  await K.click('.cook [aria-label="Eine Portion mehr"]');
  await sees(K, "500 g Kartoffeln, mehligkochend");
  await K.click(".cook-nav >> text=Los geht's");
  await sees(K, "Schritt 1 von 4");
  await K.keyboard.press("ArrowRight");
  await sees(K, "Schritt 2 von 4");
  assert.match(await K.locator(".cook-uses").innerText(), /Kartoffeln/);
  await K.click(".timer-btn:has-text('12 Min.')");
  await K.locator(".ctimer", { hasText: "Schritt 2 · 12 Min." }).waitFor();
  await K.clock.fastForward("12:05");
  await K.locator(".ctimer.up", { hasText: "Zeit ist um!" }).waitFor();
  await K.click('.ctimer.up button:has-text("OK")');
  await K.locator(".ctimer").waitFor({ state: "detached" });
  await K.click(".timer-btn");
  await K.click('.cook-head [aria-label="Kochmodus beenden"]');
  await K.locator(".cook-warn").waitFor();
  await K.keyboard.press("ArrowRight"); await K.keyboard.press("ArrowRight"); await K.keyboard.press("ArrowRight");
  await sees(K, "Fertig! En Guete");
  await K.click("text=Als gekocht merken");
  await toast(K, /En Guete/);
  await K.locator(".cook").waitFor({ state: "detached" });
  await K.locator('.sheet button:has-text("Heute gekocht")[disabled]').waitFor();
  await K.click(".sheet-head >> text=Fertig"); await noSheet(K);
});
step("Rezept aus Text und aus einem Screenshot (Texterkennung auf dem Gerät)", async () => {
  await K.click('.qa:has-text("Aus Text")');
  await K.fill("#hp-imp-text", fs.readFileSync(path.join(__dirname, "fixtures", "caption-ohne-titel.txt"), "utf8"));
  await K.click(".sheet .foot >> text=Rezept erstellen");
  await K.locator('.sheet-head:has-text("Rezept prüfen")').waitFor();
  assert.strictEqual(await K.inputValue("#hp-rc-title"), "Kürbissuppe");
  await K.click(".sheet-head >> text=Abbrechen"); await noSheet(K);
  await K.click('.qa:has-text("Screenshot")');
  const file = path.join(TMP, "homeplaner-carbonara.png");
  await recipePng(K, file);
  await K.setInputFiles("#hp-imp-file", file);
  await K.locator('.sheet-head:has-text("Rezept prüfen")').waitFor({ timeout: 90000 });
  assert.strictEqual(await K.inputValue("#hp-rc-title"), "Spaghetti Carbonara");
  const ingr = await K.inputValue("#hp-rc-ingr");
  ["200 g Spaghetti", "100 g Guanciale", "2 Eier", "50 g Pecorino, gerieben"].forEach(x => assert.ok(ingr.indexOf(x) >= 0, "ingredient " + x + " in\n" + ingr));
  assert.strictEqual((await K.inputValue("#hp-rc-steps")).split("\n").length, 3);
  await K.click("details.raw summary");
  await sees(K, "Zubereitung");
  await save(K);
  await K.locator('.sheet-head:has-text("Spaghetti Carbonara")').waitFor();
  await K.click('.sheet .btn.primary:has-text("Einkaufsliste")');
  await toast(K, /Zutaten auf der Einkaufsliste/);
  await K.click(".sheet-head >> text=Fertig"); await noSheet(K);
});
step("Einkaufsliste für Migros oder Coop: Reihenfolge, Onlineshop, Liste teilen", async () => {
  await tab(K, "shop");
  await K.fill("#hp-shop-q", "Tiefkühlpizza"); await K.keyboard.press("Enter");
  await K.locator('[aria-label="Tiefkühlpizza abhaken"]').waitFor();
  await K.click('.store-row [role=radio]:has-text("Migros")');
  await sees(K, "wie im Migros");
  await K.click("text=Reihenfolge");
  for (let k = 0; k < 8; k++) { const b = K.locator('[aria-label="Tiefkühl nach oben"]'); if (await b.isDisabled()) break; await b.click(); }
  await K.click(".sheet .foot >> text=Speichern");
  await toast(K, /Reihenfolge für Migros gespeichert/);
  assert.match(await K.locator(".aisle").first().innerText(), /Tiefkühl/);
  await K.click('.store-row [role=radio]:has-text("Coop")');
  assert.doesNotMatch(await K.locator(".aisle").first().innerText(), /Tiefkühl/, "Coop keeps its own order");
  await K.click('.store-row [role=radio]:has-text("Migros")');
  const hid = await K.evaluate(() => location.hash.slice(1));
  const home = await K.evaluate(id => JSON.parse(localStorage.getItem("hp.h." + id)).home, hid);
  assert.strictEqual(home.store, "migros"); assert.strictEqual(home.aisles.migros[0], "frozen");
  await K.click('.sh-main:has-text("Guanciale")');
  assert.match(await K.locator('.sheet a.btn:has-text("Migros")').getAttribute("href"), /^https:\/\/www\.migros\.ch\/de\/search\?query=Guanciale$/);
  await K.click(".sheet-head >> text=Abbrechen"); await noSheet(K);
  if (!(await K.evaluate(() => typeof navigator.share === "function"))) {
    await K.click("text=Liste kopieren");
    await toast(K, /Liste kopiert/);
    const text = await K.evaluate(() => navigator.clipboard.readText());
    assert.match(text, /^Einkaufsliste für Migros · Küche Test/);
    assert.ok(text.indexOf("🧊 Tiefkühl") < text.indexOf("🥩 Fleisch"), "aisles in Migros order");
  }
  await K.context().close();
});
step("Teilen an die App (Android): Text und Screenshot kommen als Rezept an", async () => {
  const S = await device({ sw: true });
  await S.goto(BASE);
  await createHome(S, "Teilen Test", ["Marc"]);
  await S.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await S.reload();
  await S.waitForFunction(() => !!navigator.serviceWorker.controller);
  const png = await recipePng(S, path.join(TMP, "homeplaner-share.png"));
  const ok = await S.evaluate(async b64 => {
    const bin = atob(b64), u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const fd = new FormData();
    fd.append("title", "Carbonara"); fd.append("text", "Unser Rezept"); fd.append("images", new File([u8], "s.png", { type: "image/png" }));
    const r = await fetch("share-target", { method: "POST", body: fd });
    const c = await caches.open("hp-share"), m = await c.match("shared/meta");
    return r.ok && !!m && (await m.json()).n === 1;
  }, png);
  assert.ok(ok, "the service worker keeps what was shared");
  await S.goto("about:blank");
  await S.goto(BASE + "#teilen");
  await S.locator('.sheet-head:has-text("Rezept prüfen")').waitFor({ timeout: 90000 });
  assert.strictEqual(await S.inputValue("#hp-rc-title"), "Spaghetti Carbonara");
  assert.strictEqual(await S.evaluate(() => caches.has("hp-share")), false, "taken once, then thrown away");
  /* several households and none of them open: the shared recipe waits until one is chosen */
  await S.click(".sheet-head >> text=Abbrechen"); await noSheet(S);
  await S.click(".back"); await sees(S, "Eure Haushalte");
  await createHome(S, "Zweiter Haushalt", ["Lea"]);
  await S.click(".back"); await sees(S, "Eure Haushalte");
  await S.evaluate(async () => {
    const fd = new FormData();
    fd.append("text", "Pasta mit Pesto\nZutaten\n200 g Spaghetti\n1 Glas Pesto\nZubereitung\nSpaghetti 10 Minuten kochen und mit dem Pesto mischen.");
    await fetch("share-target", { method: "POST", body: fd });
  });
  await S.goto("about:blank");
  await S.goto(BASE + "#teilen");
  await toast(S, /Wähl den Haushalt/);
  await S.click(".trip:has-text('Teilen Test')");
  await S.locator('.sheet-head:has-text("Rezept prüfen")').waitFor();
  assert.strictEqual(await S.inputValue("#hp-rc-title"), "Pasta mit Pesto");
  await S.context().close();
});
step("Rezeptbuch: Sammlung, Suche, zurück ins Buch, Notiz übernimmt das Rezept, Tipp und Bewertung im Kochmodus", async () => {
  await tab(A, "recipes");
  await A.locator("#hp-book").scrollIntoViewIfNeeded();
  const total = await A.evaluate(() => window.HP.ideas().length);
  assert.ok(total >= 150, "recipe book: " + total);
  await A.click('.book-coll:has-text("Glasiertes Poulet mit Reis")');
  await A.locator('.sheet-head:has-text("Glasiertes Poulet mit Reis")').waitFor();
  assert.ok(await A.locator(".sheet .list .x").count() >= 10);
  await A.fill("#hp-book-q", "teriyaki");
  await A.waitForFunction(() => document.querySelectorAll(".sheet .list .x").length === 1);
  await A.click('.sheet .list .x:has-text("Teriyaki")');
  await A.locator('.sheet-head:has-text("Teriyaki")').waitFor();
  await sees(A, "Japanisch");
  await A.locator('.field:has-text("In dieselbe Richtung") .x').first().waitFor();
  await A.click(".sheet-head >> text=Fertig");
  await A.locator('.sheet-head:has-text("Glasiertes Poulet mit Reis")').waitFor();
  assert.strictEqual(await A.inputValue("#hp-book-q"), "teriyaki", "back in the book, the search is still there");
  await A.click('.sheet .list .x:has-text("Teriyaki")');
  await A.click("text=Wie war's? Notiz schreiben");
  await A.click('.note-form [role=radio]:has-text("Sehr gut")');
  await A.fill("#hp-rn-text", "Doppelte Glasur, Reis mit Limette.");
  await A.check(".note-form input[type=checkbox]");
  await A.click("text=Notiz speichern");
  await toast(A, /Notiert/);
  await A.locator('.sheet-head:has-text("Bearbeiten")').waitFor();
  await A.locator(".rnote.tip", { hasText: "Doppelte Glasur" }).waitFor();
  await A.locator(".note.tipnote", { hasText: "Doppelte Glasur" }).waitFor();
  await A.click("text=Kochmodus starten");
  await A.locator(".cook .tipnote", { hasText: "Doppelte Glasur" }).waitFor();
  for (let i = 0; i < 12 && await A.locator(".cook-nav .btn.primary").count(); i++) await A.click(".cook-nav .btn.primary");
  await A.click('.cook-rate [role=radio]:has-text("Nicht nochmals")');
  await A.fill("#hp-ck-note", "Zu süss: weniger Zucker.");
  await A.click(".cook-done .btn.primary");
  await toast(A, /En Guete/);
  await A.locator('.sheet-head:has-text("Teriyaki")').waitFor();
  assert.strictEqual(await A.locator(".rnote").count(), 2);
  await sees(A, "Zuletzt: Nicht nochmals");
  await A.click(".rnote:has-text('Doppelte Glasur') [aria-label='Notiz löschen']");
  await A.click(".rnote:has-text('Doppelte Glasur') [aria-label^='Wirklich']");
  await A.waitForFunction(() => document.querySelectorAll(".rnote").length === 1);
  await A.click('.sheet-head >> text=Bearbeiten');
  assert.strictEqual(await A.inputValue("#hp-rc-kitchen"), "jp", "the kitchen comes along");
  await A.fill("#hp-rc-title", "Teriyaki-Poulet wie bei uns");
  await save(A);
  await A.locator('.sheet-head:has-text("Teriyaki-Poulet wie bei uns")').waitFor();
  assert.strictEqual(await A.locator(".rnote").count(), 1, "editing the recipe keeps the notes");
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await A.locator('.x:has-text("Teriyaki-Poulet wie bei uns") .moodb').waitFor();
  /* «Nicht nochmals» stays out of the dice */
  await A.click('.idea .chip:has-text("Nur unsere")');
  for (let i = 0; i < 6; i++) {
    assert.ok(!/Teriyaki/.test(await A.locator(".idea-t").innerText()), "the dice offered a recipe marked «Nicht nochmals»");
    if (await A.locator("text=Andere Idee").isEnabled()) await A.click("text=Andere Idee");
  }
  await A.click('.idea .chip:has-text("Nur unsere")');
});
const OUTLOOK_ICS = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN",
  "BEGIN:VEVENT", "UID:outlook-1", "SUMMARY:Elternabend", "DTSTART;TZID=W. Europe Standard Time:%D1T193000", "DTEND;TZID=W. Europe Standard Time:%D1T210000", "LOCATION:Schulhaus", "END:VEVENT",
  "BEGIN:VEVENT", "UID:outlook-2", "SUMMARY:Papiersammlung", "DTSTART;VALUE=DATE:%D2", "RRULE:FREQ=MONTHLY", "END:VEVENT",
  "BEGIN:VEVENT", "UID:outlook-3", "SUMMARY:Längst vorbei", "DTSTART;VALUE=DATE:20200101", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
step("Kalender: als Datei für Outlook und iPhone, einzelner Termin, Outlook-Datei einlesen", async () => {
  await tab(A, "cal");
  await A.click("text=Outlook & iPhone");
  await sees(A, "Kalender-Dienst");
  const [dl] = await Promise.all([A.waitForEvent("download"), A.click(".sheet >> text=/Termine als Datei/")]);
  assert.match(dl.suggestedFilename(), /\.ics$/);
  const ics = fs.readFileSync(await dl.path(), "utf8");
  assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n") && /SUMMARY:🗑️ Kehricht/.test(ics) && /RRULE:FREQ=WEEKLY/.test(ics) && /EXDATE;VALUE=DATE:/.test(ics), "calendar file:\n" + ics.slice(0, 600));
  await A.click("text=Kalenderdatei einlesen");
  const d1 = await A.evaluate(t => window.HP.addDays(t, 9).replace(/-/g, ""), today), d2 = await A.evaluate(t => window.HP.addDays(t, 12).replace(/-/g, ""), today);
  const file = path.join(TMP, "homeplaner-outlook.ics");
  fs.writeFileSync(file, OUTLOOK_ICS.replace(/%D1/g, d1).replace(/%D2/g, d2));
  const count = () => A.evaluate(() => { const h = location.hash.slice(1); return Object.keys(JSON.parse(localStorage.getItem("hp.h." + h)).cols.events).length; });
  const before = await count();
  await A.setInputFiles("#hp-cal-file", file);
  await sees(A, "2 Termine gefunden");
  await sees(A, "Ein vergangener Termin bleibt weg");
  await A.click('#hp-cal-cat + .chips [role=radio]:has-text("Fest")').catch(() => A.click('.sheet [role=radio]:has-text("Fest")'));
  await A.click(".sheet .foot >> text=2 Termine übernehmen");
  await toast(A, /2 Termine übernommen/);
  assert.strictEqual(await count(), before + 2);
  await A.click("text=Outlook & iPhone"); await A.click("text=Kalenderdatei einlesen");
  await A.setInputFiles("#hp-cal-file", file);
  await A.click(".sheet .foot >> text=2 Termine übernehmen");
  await toast(A, /2 Termine übernommen/);
  assert.strictEqual(await count(), before + 2, "the same file again changes the appointments instead of adding them twice");
  await A.locator("section.stack:has-text('Demnächst') .x", { hasText: "Elternabend" }).waitFor();
  await A.click("section.stack:has-text('Demnächst') .x:has-text('Elternabend')");
  await A.locator("#hp-ev-note").waitFor();
  assert.match(await A.inputValue("#hp-ev-note"), /^Ort: Schulhaus/);
  const [one] = await Promise.all([A.waitForEvent("download"), A.click("text=In meinen Kalender")]);
  const single = fs.readFileSync(await one.path(), "utf8");
  assert.strictEqual((single.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.ok(single.indexOf("DTSTART;TZID=Europe/Zurich:" + d1 + "T193000") > 0 && /SUMMARY:🎉 Elternabend/.test(single), (single.match(/SUMMARY.*|CATEGORIES.*/g) || []).join(" / "));
  await A.click(".sheet-head >> text=Abbrechen"); await noSheet(A);
});
step("Glutenfrei: der Haushalt kocht glutenfrei, Ersatz im Rezept, im Kochmodus und auf der Einkaufsliste", async () => {
  await A.click('[aria-label="Haushalt bearbeiten"]');
  await A.check("#hp-set-gf");
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await tab(A, "recipes");
  await A.locator('.idea .chip:has-text("Glutenfrei")[aria-pressed="true"]').waitFor();
  await A.fill("#hp-rc-q", "Teriyaki-Poulet wie bei uns");
  await A.click('.x:has-text("Teriyaki-Poulet wie bei uns")');
  await A.locator(".gfbox.swap", { hasText: "Tamari" }).waitFor();
  assert.ok(await A.locator(".gfbox").evaluate(d => d.open), "open in a gluten-free household");
  await A.click('.sheet .btn.primary:has-text("Einkaufsliste")');
  await toast(A, /Einkaufsliste/);
  await A.click("text=Kochmodus starten");
  await A.locator(".cook .gfbox", { hasText: "Tamari" }).waitFor();
  await A.click('[aria-label="Kochmodus beenden"]');
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await A.fill("#hp-rc-q", "");
  await tab(A, "shop");
  await A.locator(".sh", { hasText: "Sojasauce" }).filter({ hasText: "glutenfrei: Tamari" }).waitFor();
});
step("Rezepte finden: Filter nach Hauptzutat und Zeit, aktive Filter entfernen, sortieren, zurück aus dem Rezept", async () => {
  await tab(A, "recipes");
  await A.click('.find-row .btn:has-text("Filter")');
  await A.locator(".fpanel").waitFor();
  assert.strictEqual(await A.locator('.fpanel .fgroup[aria-label="Ernährung"] .chip:has-text("Glutenfrei")[aria-pressed="true"]').count(), 1, "the household eats gluten-free");
  await A.click('.fpanel .fgroup[aria-label="Hauptzutat"] .chip:has-text("Poulet")');
  await A.click('.fpanel .fgroup[aria-label="Zeit"] .chip:has-text("bis 30 Min.")');
  await A.click(".fpanel .btn.primary");
  const times = async () => (await A.locator(".sheet .list .x .x-s").allInnerTexts()).map(t => { const m = /(\d+) Min\./.exec(t), h = /(\d+) Std\./.exec(t); return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0); });
  const t1 = await times();
  assert.ok(t1.length > 3 && t1.every(t => t > 0 && t <= 30), "all within 30 minutes: " + t1);
  const n1 = t1.length;
  await A.click('.sheet .chip[aria-label="bis 30 Min. entfernen"]');
  await A.waitForFunction(n => document.querySelectorAll(".sheet .list .x").length > n, n1);
  await A.selectOption('.sheet select[aria-label="Sortieren"]', "time");
  const t2 = await times();
  assert.ok(t2.every((t, i) => i === 0 || t >= t2[i - 1]), "sorted by time: " + t2.slice(0, 10));
  await A.click(".sheet .list .x >> nth=0");
  await A.locator('.sheet-head:has-text("Übernehmen"), .sheet-head:has-text("Bearbeiten")').first().waitFor();
  await A.click(".sheet-head >> text=Fertig");
  await A.locator('.sheet .chip[aria-label="Poulet entfernen"]').waitFor();
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
});
step("Menü-Finder: Zeit, Lust, Hauptzutat, Vorschlag mit Begründung, noch einer, ganzes Menü", async () => {
  await tab(A, "recipes");
  await A.click(".finder-card");
  await A.click('.fgroup[aria-label="Wie viel Zeit habt ihr?"] .chip:has-text("bis 30 Min.")');
  await A.click('.fgroup[aria-label="Worauf habt ihr Lust?"] .chip:has-text("Asiatisch")');
  await A.click('.fgroup[aria-label="Was soll\'s sein?"] .chip:has-text("Poulet")');
  const first = await A.locator(".finder-out .idea-t").first().innerText();
  const why = await A.locator(".finder-out .fcard .chip").allInnerTexts();
  assert.ok(why.some(w => /Min\./.test(w)) && why.some(w => /glutenfrei/.test(w)), "reasons: " + why);
  assert.ok(!/wie bei uns/.test(await A.locator(".finder-out").innerText()), "«Nicht nochmals» is never suggested");
  await A.click("text=Noch ein Vorschlag");
  await A.waitForFunction(t => document.querySelector(".finder-out .idea-t").textContent !== t, first);
  await A.check("#hp-fd-menu");
  for (const c of ["Vorspeise", "Hauptgang", "Dessert"]) await A.locator(".finder-out .fcard .eyebrow", { hasText: c }).waitFor();
  await A.click("text=Alles auf die Einkaufsliste");
  await toast(A, /Einkaufsliste/);
  await A.click(".finder-out .fcard:has(.eyebrow:has-text('Hauptgang')) .idea-card");
  await A.click(".sheet-head >> text=Fertig");
  assert.ok(await A.locator("#hp-fd-menu").isChecked(), "back in the finder, the answers are still there");
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await A.click('[aria-label="Haushalt bearbeiten"]'); await A.uncheck("#hp-set-gf"); await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
});
step("Monatsabrechnung: Einkäufe des Monats, Anteile, quitt für diesen Monat, Tabelle", async () => {
  await tab(A, "kasse");
  await A.click(".month-card");
  await A.locator('.sheet-head:has-text("Monatsabrechnung")').waitFor();
  await A.locator('.sheet .x:has-text("Wocheneinkauf")').waitFor();
  assert.strictEqual(await A.locator('.sheet .x:has-text("Pizza")').count(), 0, "a restaurant is not a purchase");
  await sees(A, "So ist der");
  while (await A.locator(".sheet .pay .btn").count()) { await A.click(".sheet .pay .btn >> nth=0"); await toast(A, /als bezahlt eingetragen/); }
  await A.locator(".sheet .sec-h", { hasText: "ist abgerechnet" }).waitFor();
  const [dl] = await Promise.all([A.waitForEvent("download"), A.click("text=Tabelle (CSV)")]);
  const csv = fs.readFileSync(await dl.path(), "utf8");
  assert.ok(/^\ufeffDatum;Titel;Kategorie;Bezahlt von;Betrag;Währung;Betrag CHF/.test(csv) && /;Wocheneinkauf;Lebensmittel;Marc;90\.00;CHF;90\.00;/.test(csv), csv.slice(0, 300));
  await A.click('.sheet [role=tab]:has-text("Alle Ausgaben")');
  await A.locator('.sheet .x:has-text("Pizza")').waitFor();
  await A.click('[aria-label="Vorheriger Monat"]');
  await sees(A, "keine Ausgaben");
  await A.click(".sheet-head >> text=Fertig"); await noSheet(A);
  await tab(A, "kasse");
  await A.click('[role=tab]:has-text("Abrechnung")');
  await sees(A, "So seid ihr quitt");
});
step("Schmales Handy (320 px): kein seitliches Scrollen", async () => {
  const N = await device({ width: 320 });
  await N.goto(BASE);
  await createHome(N, "Familie Muster-Bühlmann", ["Marc", "Lea"]);
  for (const t of ["home", "kasse", "shop", "recipes", "cal", "plants", "infos"]) {
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
  await tab(C2, "recipes");
  await C2.fill("#hp-rc-q", "raclette");
  await C2.click('.x:has-text("Raclette")');
  await C2.click('.sheet-head .btn.primary:has-text("Übernehmen")');
  await toast(C2, /ist jetzt in euren Rezepten/);
  await C2.click(".sheet-head >> text=Fertig"); await noSheet(C2);
  await tab(C1, "recipes");
  await C1.locator('.x:has-text("Raclette")', { hasText: "Portionen" }).waitFor();
  assert.strictEqual(docsUnder(hid).filter(k => k.indexOf("/recipes/") > 0).length, 1);
});
step("Gruppen-Sync: Kalender in Outlook und auf dem iPhone abonnieren, Link erneuern", async () => {
  const asked = [];
  const C3 = await device({ cloud: true, calendar: r => {
    const u = new URL(r.request().url());
    if (u.pathname !== "/token" || r.request().method() !== "POST") return r.fulfill({ status: 404, body: "" });
    const home = JSON.parse(r.request().postData() || "{}").home;
    asked.push(home);
    const h = FS.db["homes/" + home];
    if (!h) return r.fulfill({ status: 404, headers: { "Access-Control-Allow-Origin": "*" }, body: "{}" });
    return r.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ token: "Tk" + (h.calV || 0) + "x".repeat(50) }) });
  } });
  await C3.goto(BASE + "#" + hid);
  await sees(C3, "WG Sync");
  await tab(C3, "cal");
  await C3.click("text=Outlook & iPhone");
  const iphone = C3.locator('.sub-links a:has-text("iPhone")');
  await iphone.waitFor();
  assert.deepStrictEqual(asked, [hid]);
  assert.strictEqual(await iphone.getAttribute("href"), "webcal://kal.test/kalender/Tk0" + "x".repeat(50) + ".ics");
  const outlook = await C3.locator('.sub-links a:has-text("outlook.com")').getAttribute("href");
  assert.ok(outlook.startsWith("https://outlook.live.com/calendar/0/addfromweb?url=" + encodeURIComponent("https://kal.test/kalender/Tk0")) && outlook.indexOf("&name=Home-Planer") > 0, outlook);
  await C3.click('.sheet .chip:has-text("Essen")');
  assert.match(await C3.inputValue("#hp-cal-link"), /\.ics\?arten=date,birthday,trash,chores,visit,holiday,party,health,other$/);
  await C3.click("text=Link kopieren");
  await toast(C3, /Kalender-Link kopiert/);
  await C3.click("text=Link erneuern"); await C3.click("text=Nochmal tippen");
  await toast(C3, /Neuer Link/);
  await C3.waitForFunction(() => /Tk1x/.test((document.querySelector(".sub-links a") || {}).href || ""));
  assert.strictEqual(FS.db["homes/" + hid].calV, 1);
  assert.deepStrictEqual(C3.errors, []);
  await C3.context().close();
});
step("Gruppen-Sync: Notizen zum selben Rezept von zwei Handys gleichzeitig", async () => {
  await tab(C1, "recipes");
  await C1.fill("#hp-rc-q", "Hummus");
  await C1.click('.x:has-text("Hummus")');
  await C1.click("text=Wie war's? Notiz schreiben");
  await C1.click('.note-form [role=radio]:has-text("Sehr gut")');
  await C1.click("text=Notiz speichern");
  await C1.locator('.sheet-head:has-text("Bearbeiten")').waitFor();
  await tab(C2, "recipes");
  await C2.fill("#hp-rc-q", "Hummus");
  await C2.locator('.x:has-text("Hummus") .moodb').waitFor();
  await C2.click('.x:has-text("Hummus")');
  await C2.click("text=Notiz schreiben"); await C1.click("text=Notiz schreiben");
  await C2.fill("#hp-rn-text", "Mehr Zitrone."); await C1.fill("#hp-rn-text", "Kichererbsen schälen lohnt sich.");
  await Promise.all([C2.click("text=Notiz speichern"), C1.click("text=Notiz speichern")]);
  for (const P of [C1, C2]) await P.waitForFunction(() => document.querySelectorAll(".rnote").length === 3);
  const rid = Object.keys(FS.db).find(k => k.indexOf("homes/" + hid + "/recipes/") === 0 && FS.db[k].title === "Hummus");
  assert.strictEqual(Object.keys(FS.db[rid].notes).length, 3, "no note lost");
  for (const P of [C1, C2]) { await P.click(".sheet-head >> text=Fertig"); await noSheet(P); await P.fill("#hp-rc-q", ""); }
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
  await createHome(C1, "Geht trotzdem", ["Marc"]);
  await toast(C1, /vorerst nur auf diesem Gerät/);
  await sees(C1, "Nur auf diesem Gerät gespeichert");
  await C1.click(".back");
  await sees(C1, "Gruppen-Sync: noch ein Schritt");
  await C1.click(".trip:has-text('Geht trotzdem')");
  await C1.click("text=Einladen");
  await C1.click("text=Für alle im Haushalt freigeben");
  await toast(C1, /fehlen die Sicherheitsregeln/);
  await C1.click(".sheet-head >> text=Abbrechen"); await noSheet(C1);
  FS.deny = false;
  await C1.click("text=Einladen");
  await C1.click("text=Für alle im Haushalt freigeben");
  await toast(C1, /Freigegeben/);
  await C1.click(".sheet-head >> text=Fertig"); await noSheet(C1);
  await sees(C1, "Automatisch für den ganzen Haushalt gespeichert");
  await C1.click(".back");
  await C1.click("text=Nochmals prüfen").catch(() => {});
  await C1.locator("text=Gruppen-Sync: noch ein Schritt").waitFor({ state: "detached" });
  FS.deny = true;
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
