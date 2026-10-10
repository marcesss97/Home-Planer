/* Home-Planer: Service Worker. Hält eine Kopie der App-Dateien bereit, damit der Home-Planer auch ohne Netz startet.
   Mit Netz fragt er bei jedem Start nach, ob es auf dem Server eine neuere Fassung gibt (so wirkt eine geänderte config.js sofort).
   Ohne Netz oder bei sehr langsamem Netz kommt die gespeicherte Kopie. Daten und Kurse laufen nicht über diese Kopie. */
const CACHE = "homeplaner-v7";
const FILES = [
  "./", "index.html", "style.css", "config.js", "logic.js", "ideen.js", "buch-asien.js", "buch-europa.js", "buch-levante.js", "buch-schnell.js", "buch-morgen-apero-salat.js", "buch-suppen-ofen.js", "buch-welt.js", "buch-fisch-favoriten.js", "buch-dessert-backen.js", "import.js", "store.js", "rates.js", "ui.js",
  "kasse.js", "einkauf.js", "ics.js", "erinnerungen.js", "push.js", "kalender.js", "pflanzen.js", "infos.js", "rezepte.js", "kochen.js", "mitteilungen.js", "app.js",
  "vendor-preact.js", "vendor-qrcode.js", "vendor-firebase.js", "manifest.webmanifest", "favicon.svg",
  "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "badge-96.png",
  "fredoka-var.woff2", "anton-400.woff2", "ibm-plex-mono-500.woff2", "ibm-plex-mono-600.woff2"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(FILES.map(f => cache.add(f).catch(() => null))))   // eine fehlende Datei soll die anderen nicht blockieren
      .then(() => self.skipWaiting())
  );
});

/* Unter derselben Adresse können weitere Apps liegen (etwa die Ferienkasse): nur die eigenen alten Kopien wegräumen. */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("homeplaner-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* «Teilen» aus einer anderen App (Android): Link, Text und Screenshots kommen hier an, werden kurz abgelegt, und die App
   öffnet sich mit dem Import. Der Ablageort heisst bewusst nicht "homeplaner-…", damit das Aufräumen oben ihn nicht löscht. */
const SHARE = "hp-share";
async function receiveShare(req) {
  try {
    const form = await req.formData(), cache = await caches.open(SHARE);
    await Promise.all((await cache.keys()).map(k => cache.delete(k)));
    const files = form.getAll("images").filter(f => f && typeof f === "object" && f.size > 0).slice(0, 8);
    await Promise.all(files.map((f, i) => cache.put("shared/" + i, new Response(f, { headers: { "Content-Type": f.type || "image/png" } }))));
    await cache.put("shared/meta", new Response(JSON.stringify({ title: String(form.get("title") || ""), text: String(form.get("text") || ""), url: String(form.get("url") || ""), n: files.length, at: Date.now() }),
      { headers: { "Content-Type": "application/json" } }));
  } catch (e) { /* die App öffnet sich trotzdem */ }
  return Response.redirect(new URL("./#teilen", self.location).href, 303);
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method === "POST" && new URL(req.url).pathname.endsWith("/share-target")) { event.respondWith(receiveShare(req)); return; }
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // Daten und Kurse gehen direkt ins Netz
  event.respondWith(networkFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  const fromCache = async () => (await cache.match(req, { ignoreSearch: true })) || (req.mode === "navigate" ? await cache.match("index.html") : undefined);
  const fromNet = fetch(req, { cache: "no-cache" }).then(async res => {
    if (!res || res.type === "opaqueredirect") return res;
    if (res.ok) { cache.put(req, res.clone()).catch(() => {}); return res; }
    return (await fromCache()) || res;                        // Fehler vom Server (etwa 404 mitten in einem Hochladen): lieber die gespeicherte Kopie als eine halbe App
  });
  try {
    return await Promise.race([fromNet, new Promise((_, reject) => setTimeout(() => reject(new Error("slow")), 3500))]);
  } catch (e) {
    const hit = await fromCache();
    if (hit) { fromNet.catch(() => {}); return hit; }
    return fromNet;                                           // nichts gespeichert: weiter auf das Netz warten
  }
}

/* ---------- Mitteilungen ---------- */
/* Der Dienst (dienst-worker.js) schickt { title, body, tag, tab, home }, Ende-zu-Ende verschlüsselt. Jede Mitteilung wird
   angezeigt: Apple und Google verlangen das, sonst sperren sie die Anmeldung. */
self.addEventListener("push", event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data ? event.data.text() : "" }; }
  const s = (v, n) => (typeof v === "string" ? v : "").slice(0, n);
  const tag = s(d.tag, 64);
  event.waitUntil(self.registration.showNotification(s(d.title, 120) || "Home-Planer", {
    body: s(d.body, 400), tag: tag || undefined, renotify: !!tag, lang: "de-CH", icon: "icon-192.png", badge: "badge-96.png",
    data: { home: /^[A-Za-z0-9]{16,40}$/.test(d.home || "") ? d.home : "", tab: /^[a-z]{2,10}$/.test(d.tab || "") ? d.tab : "" }
  }));
});

/* Ein Tipp öffnet den Haushalt im passenden Reiter: in einem offenen Fenster der App, sonst in einem neuen. */
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const d = event.notification.data || {}, url = new URL("./" + (d.home ? "#" + d.home + (d.tab ? "~" + d.tab : "") : ""), self.location).href;
  event.waitUntil((async () => {
    const scope = new URL("./", self.location).href;
    const wins = (await self.clients.matchAll({ type: "window", includeUncontrolled: true })).filter(c => c.url.startsWith(scope));
    if (wins.length) {
      const c = wins.find(w => w.focused) || wins[0];
      try { await c.focus(); } catch (e) { /* manche Browser erlauben das nicht */ }
      c.postMessage({ hp: "open", home: d.home || "", tab: d.tab || "" });
      return;
    }
    if (self.clients.openWindow) await self.clients.openWindow(url);
  })());
});

/* Erneuert der Push-Dienst die Anmeldung, meldet der Service Worker die neue Adresse selbst beim Dienst. */
self.addEventListener("pushsubscriptionchange", event => {
  event.waitUntil((async () => {
    try {
      const hit = await (await caches.open("hp-push")).match("state");
      const st = hit ? await hit.json() : null;
      if (!st || !st.svc || !st.key || !Array.isArray(st.homes) || !st.homes.length) return;
      const raw = atob(st.key.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((st.key.length + 3) % 4));
      const sub = event.newSubscription || await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: Uint8Array.from(raw, c => c.charCodeAt(0)) });
      await Promise.all(st.homes.map(h => fetch(st.svc + "/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({}, h, { sub: sub.toJSON() })) }).catch(() => null)));
    } catch (e) { /* beim nächsten Öffnen der App meldet sie sich neu */ }
  })());
});
