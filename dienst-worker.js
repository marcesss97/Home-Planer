/* Home-Planer: Dienst für Cloudflare Workers (kostenlos). Er erledigt, was die App allein nicht kann:
   - Kalender-Abo: Outlook, der iPhone-Kalender und Google holen die Termine eines Haushalts regelmässig neu ab.
   - Mitteilungen: Er schickt Push-Mitteilungen aufs Handy, wenn jemand etwas einträgt, und erinnert zur richtigen Zeit
     (Abfuhr am Vorabend, Pflanzen am Morgen, Fristen, Geburtstage, wer heute kocht, Monatsabrechnung).

   Einrichten (Schritt für Schritt im README, Abschnitt «Dienst für Kalender und Mitteilungen»):
   1. Bei Cloudflare «Workers & Pages», «Create», «Start with Hello World», Namen wählen (etwa home-planer-dienst), «Deploy».
   2. «Edit code», den ganzen Inhalt dieser Datei einfügen, «Deploy».
   3. «Settings», «Variables and Secrets», «Add»: Typ «Secret», Name DIENST_SCHLUESSEL, Wert: eine lange
      Zufallszeichenfolge (mindestens 32 Zeichen). «Deploy». Ein früher eingerichtetes KALENDER_SCHLUESSEL gilt weiter.
   4. Für Mitteilungen eine Ablage: unter «Storage & Databases», «Workers KV» einen Namespace anlegen (etwa home-planer).
      Dann beim Dienst «Settings», «Bindings», «Add», «KV namespace»: Variable name HP, den Namespace wählen, «Deploy».
   5. Für Erinnerungen ein Zeitplan: beim Dienst «Settings», «Trigger Events», «Add», «Cron Triggers», alle 15 Minuten
      (Auswahl «Minutes», Wert 15; den Ausdruck zum Kopieren gibt es im README), «Deploy».
   6. Die Adresse des Dienstes (https://….workers.dev) in config.js bei dienst eintragen.

   Kalender:
   - POST /token mit { "home": "<Kennung>" } gibt einen Kalender-Schlüssel zurück. Er enthält die Kennung verschlüsselt
     (AES-GCM mit dem Secret): Wer den Kalender-Link hat, sieht die Termine, kommt aber nicht an Kasse und Infos.
   - GET /kalender/<Schlüssel>.ics liefert den Kalender; ?arten=trash,birthday beschränkt ihn auf einzelne Arten.
   - «Link erneuern» in der App zählt calV im Haushalt hoch: Ältere Links gelten dann nicht mehr.

   Mitteilungen (Web Push, RFC 8030/8291/8292; Apple, Google, Mozilla und Microsoft verstehen alle dasselbe):
   - GET /push/key: der öffentliche Schlüssel, mit dem sich ein Gerät anmeldet. Er wird aus dem Secret abgeleitet.
   - POST /push/subscribe, /push/unsubscribe: ein Gerät mit Person, Arten und Ruhezeit an- oder abmelden.
   - POST /push/send: Mitteilungen über neue Einträge an die anderen im Haushalt (nie an die Person selbst, nie nachts).
   - POST /push/test: eine Probe an das eigene Gerät. POST /push/status: welche Geräte angemeldet sind.
   - Alle 15 Minuten (Zeitplan): fällige Erinnerungen. Was fällig ist, steht in erinnerungen.js (Kopie unten).
   Gespeichert wird nur, was ein Gerät zum Empfangen braucht, in der eigenen Ablage (KV): Adresse beim Push-Dienst des
   Herstellers, die Schlüssel des Geräts, Person und Auswahl. Die Kennung des Haushalts liegt dort nur verschlüsselt.
   Ein Gerät, das sich 60 Tage nicht meldet, fällt von selbst heraus. Die Texte sind Ende-zu-Ende verschlüsselt: Apple,
   Google und Co. sehen nicht, was drinsteht. */

const FIREBASE_PROJECT = "splite-weiser-cf091";                 // wie projectId in config.js
const FIREBASE_API_KEY = "AIzaSyBoxXxX0WBFLoK4aDwSsf06fT0W8QTs6Uo"; // wie apiKey in config.js
const APP_URL = "https://marcesss97.github.io/Home-Planer/";     // Adresse der App: Absenderangabe für die Push-Dienste

/* Die Kopien unten sind für den Browser geschrieben und hängen sich an "window". */
const window = globalThis;

// ---- logic.js (Kopie, nicht hier ändern) ----
/* Home-Planer: Rechenlogik ohne Seiteneffekte. Alle Beträge sind ganze Zahlen in der kleinsten Einheit der Währung (Rappen, Cent).
   Kasse (Aufteilen, Umrechnen, Ausgleich, Statistik) stammt aus der Ferienkasse; dazu kommen Einkaufsliste, Kalender,
   Pflanzen und Infos. Jedes Modul liest gespeicherte Dokumente nur über seine norm-Funktion. */
window.HP = (function () {
  "use strict";
  var LOCALE = "de-CH";

  /* ---------- Kategorien der Kasse ---------- */
  var CATS = [
    { id: "groceries", label: "Lebensmittel", emoji: "🛒" },
    { id: "rent", label: "Miete", emoji: "🏠" },
    { id: "utilities", label: "Nebenkosten", emoji: "💡" },
    { id: "internet", label: "Internet & Abos", emoji: "📶" },
    { id: "household", label: "Haushalt", emoji: "🧽" },
    { id: "furniture", label: "Einrichtung", emoji: "🛋️" },
    { id: "food", label: "Restaurant & Take-away", emoji: "🍝" },
    { id: "outing", label: "Freizeit", emoji: "🎟️" },
    { id: "transport", label: "Mobilität", emoji: "🚗" },
    { id: "other", label: "Sonstiges", emoji: "✨" }
  ];
  var CURRENCIES = ["CHF", "EUR", "USD", "GBP", "SEK", "NOK", "DKK", "ISK", "CZK", "PLN", "HUF", "RON", "TRY", "MAD", "EGP", "ZAR", "TZS", "KES", "AED", "THB", "VND", "IDR", "MYR", "SGD", "JPY", "CNY", "HKD", "KRW", "INR", "NPR", "LKR", "AUD", "NZD", "CAD", "MXN", "BRL", "ARS", "CLP", "PEN", "COP", "GEL"];

  /* Ein Nachschlagewerk für Listen der Form [{ id, label, emoji }]. */
  function table(list, fallback) {
    var by = Object.create(null);
    list.forEach(function (c) { by[c.id] = c; });
    return {
      has: function (id) { return typeof id === "string" && by[id] !== undefined; },
      get: function (id) { return (typeof id === "string" && by[id]) || by[fallback]; }
    };
  }
  var catT = table(CATS, "other");
  function catLabel(id) { return catT.get(id).label; }
  function isCat(id) { return catT.has(id); }
  function catEmoji(id) { return catT.get(id).emoji; }

  /* ---------- Avatare ---------- */
  /* Jede Person hat ein Emoji als Profilbild. Im Haushalt steht die Kennung (links), nicht das Zeichen selbst: So bleibt alles
     lesbar, auch wenn ein Gerät ein Emoji nicht kennt oder die Auswahl später wächst. Nur Emojis, die es seit 2020 gibt. */
  var AVATARS = [
    { title: "Tiere", items: [
      ["lama", "🦙", "Lama"], ["faultier", "🦥", "Faultier"], ["pinguin", "🐧", "Pinguin"], ["flamingo", "🦩", "Flamingo"], ["oktopus", "🐙", "Oktopus"], ["frosch", "🐸", "Frosch"],
      ["affe", "🐵", "Affe"], ["fuchs", "🦊", "Fuchs"], ["panda", "🐼", "Panda"], ["koala", "🐨", "Koala"], ["igel", "🦔", "Igel"], ["otter", "🦦", "Otter"],
      ["eule", "🦉", "Eule"], ["ente", "🦆", "Ente"], ["huhn", "🐔", "Huhn"], ["kuh", "🐮", "Kuh"], ["geiss", "🐐", "Geiss"], ["hund", "🐶", "Hund"],
      ["katze", "😼", "Katze"], ["hai", "🦈", "Hai"], ["schnecke", "🐌", "Schnecke"], ["dino", "🦖", "Dino"], ["einhorn", "🦄", "Einhorn"], ["drache", "🐲", "Drache"]
    ] },
    { title: "Typen", items: [
      ["cool", "😎", "Sonnenbrille"], ["nerd", "🤓", "Nerd"], ["party", "🥳", "Partylöwe"], ["cowboy", "🤠", "Cowboy"], ["inkognito", "🥸", "Inkognito"], ["geld", "🤑", "Geldgesicht"],
      ["clown", "🤡", "Clown"], ["alien", "👽", "Alien"], ["roboter", "🤖", "Roboter"], ["geist", "👻", "Geist"], ["zombie", "🧟", "Zombie"], ["vampir", "🧛", "Vampir"],
      ["zauberer", "🧙", "Zauberer"], ["ninja", "🥷", "Ninja"], ["held", "🦸", "Superheld"], ["teufel", "😈", "Teufelchen"], ["schaedel", "💀", "Totenkopf"], ["haufen", "💩", "Häufchen"],
      ["moai", "🗿", "Moai"], ["mond", "🌚", "Mondgesicht"], ["sonne", "🌞", "Sonne"], ["schneemann", "⛄", "Schneemann"], ["krone", "👑", "Krone"], ["gehirn", "🧠", "Grosshirn"]
    ] },
    { title: "Essen und Trinken", items: [
      ["pizza", "🍕", "Pizza"], ["avocado", "🥑", "Avocado"], ["kartoffel", "🥔", "Kartoffel"], ["hotdog", "🌭", "Hotdog"], ["taco", "🌮", "Taco"], ["donut", "🍩", "Donut"],
      ["gipfeli", "🥐", "Gipfeli"], ["kaese", "🧀", "Käse"], ["fondue", "🫕", "Fondue"], ["brezel", "🥨", "Brezel"], ["gurke", "🥒", "Gurke"], ["banane", "🍌", "Banane"],
      ["ananas", "🍍", "Ananas"], ["chili", "🌶️", "Chili"], ["pilz", "🍄", "Pilz"], ["glace", "🍦", "Glace"], ["bier", "🍺", "Bier"], ["popcorn", "🍿", "Popcorn"]
    ] },
    { title: "Zuhause und Garten", items: [
      ["topfpflanze", "🪴", "Topfpflanze"], ["kaktus", "🌵", "Kaktus"], ["sonnenblume", "🌻", "Sonnenblume"], ["klee", "🍀", "Kleeblatt"], ["haus", "🏡", "Häuschen"], ["sofa", "🛋️", "Sofa"],
      ["besen", "🧹", "Besen"], ["korb", "🧺", "Wäschekorb"], ["kaffee", "☕", "Kaffee"], ["teekanne", "🫖", "Teekanne"], ["pfanne", "🍳", "Pfanne"], ["teddy", "🧸", "Teddy"],
      ["gamepad", "🎮", "Gamepad"], ["buecher", "📚", "Bücher"], ["gitarre", "🎸", "Gitarre"], ["rakete", "🚀", "Rakete"], ["regenbogen", "🌈", "Regenbogen"], ["wuerfel", "🎲", "Würfel"]
    ] }
  ];
  var AV = Object.create(null), AV_IDS = [];
  AVATARS.forEach(function (g) { g.items.forEach(function (it) { AV[it[0]] = { id: it[0], ch: it[1], label: it[2] }; AV_IDS.push(it[0]); }); });
  function isAvatar(id) { return typeof id === "string" && AV[id] !== undefined; }
  function avatar(id) { return isAvatar(id) ? AV[id] : null; }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  /* Wer noch keins gewählt hat, bekommt eines aus der Kennung der Person: auf allen Geräten dasselbe, ohne dass etwas gespeichert wird. */
  function avatarFor(memberId) { return AV_IDS[hash(String(memberId)) % AV_IDS.length]; }
  /* Ein zufälliges, das im Haushalt noch niemand hat (solange der Vorrat reicht). */
  function pickAvatar(taken, rnd) {
    var used = Object.create(null);
    (taken || []).forEach(function (id) { used[id] = 1; });
    var free = AV_IDS.filter(function (id) { return !used[id]; }), pool = free.length ? free : AV_IDS;
    return pool[Math.min(pool.length - 1, Math.floor((rnd || Math.random)() * pool.length))];
  }

  /* ---------- Währungen und Zahlen ---------- */
  /* Nachkommastellen je Währung nach ISO 4217, fest hinterlegt. Browser weichen bei einigen Währungen voneinander ab,
     und dann würde derselbe gespeicherte Betrag auf zwei Geräten Verschiedenes bedeuten. Alles Übrige hat zwei Stellen. */
  var DIGITS = {};
  "BIF CLP DJF GNF ISK JPY KMF KRW PYG RWF UGX UYI VND VUV XAF XOF XPF".split(" ").forEach(function (c) { DIGITS[c] = 0; });
  "BHD IQD JOD KWD LYD OMR TND".split(" ").forEach(function (c) { DIGITS[c] = 3; });
  "CLF UYW".split(" ").forEach(function (c) { DIGITS[c] = 4; });
  function digits(cur) { return Object.prototype.hasOwnProperty.call(DIGITS, cur) ? DIGITS[cur] : 2; }
  /* Obergrenzen: weit über jeder Haushaltsrechnung und weit unter dem, was sich noch auf die kleinste Einheit genau rechnen lässt. */
  var MAX_MINOR = 1e13, MAX_BASE = 1e15, RATE_MIN = 1e-9, RATE_MAX = 1e9;
  var curSet = null;
  function isCurrency(cur) {
    if (typeof cur !== "string" || !/^[A-Z]{3}$/.test(cur)) return false;
    if (curSet === null) {
      try { curSet = {}; Intl.supportedValuesOf("currency").forEach(function (c) { curSet[c] = 1; }); } catch (e) { curSet = false; }
    }
    return curSet ? !!curSet[cur] : CURRENCIES.indexOf(cur) >= 0;
  }
  var nfCache = {};
  function nf(d) { return nfCache[d] || (nfCache[d] = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d })); }
  function num(minor, cur) { var d = digits(cur); return nf(d).format(Math.abs(minor) / Math.pow(10, d)); }
  function money(minor, cur) { return (minor < 0 ? "−" : "") + cur + " " + num(minor, cur); }
  function signed(minor, cur) { return (minor > 0 ? "+" : minor < 0 ? "−" : "") + num(minor, cur); }
  function whole(minor, cur) { return nf(0).format(Math.round(Math.abs(minor) / Math.pow(10, digits(cur)))); }
  function plain(minor, cur) { var d = digits(cur); return (minor / Math.pow(10, d)).toFixed(d); }
  /* Wechselkurs zum Anzeigen und Bearbeiten: sechs gültige Stellen, ohne Zahlenballast */
  function rateText(r) { return r > 0 && isFinite(r) ? String(Number(r.toPrecision(6))) : ""; }

  /* "12.50", "12,50", "1'234.50" und Summen wie "45+12.5" -> kleinste Einheit; null wenn nicht lesbar.
     Punkt und Komma können beides sein. Als Tausendertrennung gelten sie, wenn sie mehrfach vorkommen ("1.234.567"),
     wenn beide vorkommen (dann ist das letzte Zeichen das Komma: "1.234,50"), und wenn genau drei Ziffern folgen
     ("25.000" Dong, "1,500" Yen). Nur bei Währungen mit drei Nachkommastellen bleibt "1.500" eine Kommazahl. */
  function parseOne(s, cur) {
    s = s.replace(/[\s'’`  ]/g, "");
    var neg = false;
    if (s.charAt(0) === "-" || s.charAt(0) === "−") { neg = true; s = s.slice(1); }
    if (!s || s.length > 30 || !/^[\d.,]+$/.test(s) || !/\d/.test(s)) return null;
    var d = digits(cur), seps = s.replace(/\d/g, ""), intPart = s, frac = "";
    if (seps) {
      var last = Math.max(s.lastIndexOf(","), s.lastIndexOf(".")), head = s.slice(0, last), tail = s.slice(last + 1);
      var mixed = seps.indexOf(",") >= 0 && seps.indexOf(".") >= 0, group;
      if (mixed) group = false;                                        // das letzte Zeichen ist das Komma
      else if (seps.length > 1) group = true;                          // "1.234.567"
      else group = tail.length === 3 && /^[1-9]\d{0,2}$/.test(head) && d !== 3;
      if (group) {
        if (!/^\d{1,3}([.,]\d{3})+$/.test(s)) return null;            // keine saubere Dreiergruppierung: nicht raten
        intPart = s.replace(/[.,]/g, "");
      } else {
        if (head && !/^\d{1,3}([.,]\d{3})*$/.test(head) && !/^\d+$/.test(head)) return null;
        intPart = head.replace(/[.,]/g, ""); frac = tail;
      }
    }
    var v = Number((intPart || "0") + (frac ? "." + frac : ""));
    if (!isFinite(v)) return null;
    v = Math.round(v * Math.pow(10, d));
    return v > MAX_MINOR ? null : neg ? -v : v;
  }
  function parseAmount(input, cur) {
    if (input == null) return null;
    var parts = String(input).split("+"), sum = 0, any = false;
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i].trim()) { if (parts.length > 1 && i === parts.length - 1) continue; return null; }
      var v = parseOne(parts[i], cur);
      if (v == null) return null;
      sum += v; any = true;
    }
    return any && Math.abs(sum) <= MAX_MINOR ? sum : null;
  }
  function okRate(v) { return typeof v === "number" && isFinite(v) && v >= RATE_MIN && v <= RATE_MAX; }
  function parseRate(input) {
    var s = String(input == null ? "" : input).trim().replace(/[\s'’]/g, "").replace(",", ".");
    if (!/^(\d+\.?\d*|\.\d+)$/.test(s)) return null;
    var v = Number(s);
    return okRate(v) ? v : null;
  }
  function toBase(minor, cur, base, rate) {
    if (cur === base) return minor;
    if (!(rate > 0)) return null;
    var v = Math.round(minor / Math.pow(10, digits(cur)) * rate * Math.pow(10, digits(base)));
    return Math.abs(v) <= MAX_BASE ? v : null;
  }

  /* ---------- Datum ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function validDate(iso) {
    if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    var d = dateObj(iso);
    return !isNaN(d) && d.toISOString().slice(0, 10) === iso;
  }
  function validTime(t) { return typeof t === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(t); }
  function dateObj(iso) { var p = iso.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function addDays(iso, n) { var d = dateObj(iso); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function dayDiff(a, b) { return Math.round((dateObj(b) - dateObj(a)) / 864e5); }
  /* Wochentag nach Schweizer Art: 0 = Montag … 6 = Sonntag */
  function weekday(iso) { return (dateObj(iso).getUTCDay() + 6) % 7; }
  function daysInMonth(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }          // m: 1 bis 12
  function fmtDate(iso, opts) {
    if (!validDate(iso)) return "Ohne Datum";
    var o = { timeZone: "UTC" }; for (var k in opts) o[k] = opts[k];
    return new Intl.DateTimeFormat(LOCALE, o).format(dateObj(iso));
  }
  function dayLabel(iso) { return fmtDate(iso, { weekday: "short", day: "numeric", month: "short" }); }
  function longDay(iso) { return fmtDate(iso, { weekday: "long", day: "numeric", month: "long" }); }
  function monthLabel(ym) { return /^\d{4}-\d{2}$/.test(ym) ? fmtDate(ym + "-01", { month: "long", year: "numeric" }) : ""; }
  function rangeLabel(a, b) {
    if (!a || !b) return "";
    if (a === b) return fmtDate(a, { day: "numeric", month: "short", year: "numeric" });
    var sameMonth = a.slice(0, 7) === b.slice(0, 7);
    var end = fmtDate(b, { day: "numeric", month: "short", year: "numeric" });
    if (sameMonth) return (+a.slice(8)) + ".–" + end;
    return fmtDate(a, { day: "numeric", month: "short" }) + " – " + end;
  }
  /* "heute", "morgen", "in 3 Tagen", "vor 2 Tagen" */
  function relDays(n) {
    if (n === 0) return "heute";
    if (n === 1) return "morgen";
    if (n === -1) return "gestern";
    if (n === 2) return "übermorgen";
    return n > 0 ? "in " + n + " Tagen" : "vor " + (-n) + " Tagen";
  }

  /* ---------- Aufteilen ---------- */
  function seedOf(id) { var s = 0, t = String(id || ""); for (var i = 0; i < t.length; i++) s = (s * 31 + t.charCodeAt(i)) % 9973; return s; }

  /* Verteilt `total` proportional zu den Gewichten. Die Summe stimmt immer auf die kleinste Einheit;
     Restrappen gehen an die grössten Bruchteile, bei Gleichstand reihum (über `seed`). */
  function allocate(total, weights, seed) {
    var n = weights.length, W = 0, i;
    for (i = 0; i < n; i++) W += weights[i] > 0 ? weights[i] : 0;
    var out = new Array(n);
    for (i = 0; i < n; i++) out[i] = 0;
    if (!n || !(W > 0) || !total) return out;
    var sign = total < 0 ? -1 : 1, T = Math.abs(total), used = 0, order = [], off = (seed || 0) % n;
    for (i = 0; i < n; i++) {
      if (!(weights[i] > 0)) continue;
      var raw = T * weights[i] / W, fl = Math.floor(raw + 1e-9);
      out[i] = fl; used += fl;
      order.push({ i: i, f: raw - fl, k: (i - off + n) % n });
    }
    order.sort(function (a, b) { return Math.abs(b.f - a.f) > 1e-9 ? b.f - a.f : a.k - b.k; });
    var left = T - used;
    if (!(left >= 0 && left <= order.length)) left = 0;               // nur bei Beträgen jenseits der Rechengenauigkeit
    for (var j = 0; left > 0 && order.length; left--, j = (j + 1) % order.length) out[order[j].i]++;
    if (sign < 0) for (i = 0; i < n; i++) out[i] = -out[i] || 0;          // || 0: kein "minus null"
    return out;
  }

  function memberIds(home, all) {
    var m = home.members || {};
    return Object.keys(m).filter(function (id) { return all || !m[id].gone; }).sort(function (a, b) { return (m[a].o || 0) - (m[b].o || 0) || (a < b ? -1 : 1); });
  }

  /* Gewichte je Person für eine Ausgabe, je nach Aufteilungsart */
  function weights(e, fallbackIds) {
    var w = {}, id, k;
    if (e.mode === "shares" || e.mode === "exact") {
      for (id in (e.weights || {})) if (e.weights[id] > 0) w[id] = e.weights[id];
    } else if (e.mode === "items") {
      (e.items || []).forEach(function (it) {
        var f = it.for || [];
        if (!f.length || !it.amount) return;
        for (k = 0; k < f.length; k++) w[f[k]] = (w[f[k]] || 0) + it.amount / f.length;
      });
      for (id in w) if (!(w[id] > 1e-9)) delete w[id];
    } else {
      (e.for || []).forEach(function (x) { w[x] = 1; });
    }
    if (!Object.keys(w).length) ((e.for && e.for.length) ? e.for : fallbackIds || []).forEach(function (x) { w[x] = 1; });
    return w;
  }

  function rateFor(e, home) {
    if (e.cur === home.base) return 1;
    if (e.rate > 0) return e.rate;
    var r = (home.rates || {})[e.cur];
    return r > 0 ? r : null;
  }

  /* Betrag in Hauptwährung und Anteil je Person. null, wenn ein Wechselkurs fehlt. */
  function shares(e, home) {
    var total = toBase(e.amount, e.cur, home.base, rateFor(e, home));
    if (total == null || !(e.amount > 0)) return null;
    var parts = {};
    if (e.kind === "transfer") { parts[e.to] = total; return { total: total, parts: parts }; }
    var w = weights(e, memberIds(home)), ids = Object.keys(w).sort();
    var a = allocate(total, ids.map(function (id) { return w[id]; }), seedOf(e.id));
    ids.forEach(function (id, i) { parts[id] = a[i]; });
    return { total: total, parts: parts };
  }

  /* Vorschau der Aufteilung in der Währung der Ausgabe */
  function preview(e, fallbackIds) {
    var w = weights(e, fallbackIds), ids = Object.keys(w).sort(), parts = {};
    var a = allocate(e.amount || 0, ids.map(function (id) { return w[id]; }), seedOf(e.id));
    ids.forEach(function (id, i) { parts[id] = a[i]; });
    return parts;
  }

  function balances(home, expenses) {
    var per = {}, total = 0, count = 0, missing = 0;
    function p(id) { return per[id] || (per[id] = { paid: 0, share: 0, sent: 0, got: 0, net: 0 }); }
    memberIds(home).forEach(p);
    (expenses || []).forEach(function (e) {
      var s = shares(e, home);
      if (!s) { missing++; return; }
      if (e.kind === "transfer") {
        p(e.payer).sent += s.total; p(e.payer).net += s.total;
        p(e.to).got += s.total; p(e.to).net -= s.total;
        return;
      }
      total += s.total; count++;
      p(e.payer).paid += s.total; p(e.payer).net += s.total;
      for (var id in s.parts) { p(id).share += s.parts[id]; p(id).net -= s.parts[id]; }
    });
    return { per: per, total: total, count: count, missing: missing };
  }

  /* ---------- Ausgleich mit möglichst wenigen Zahlungen ---------- */
  var EXACT_MAX = 14;
  function zeroGroups(v) {
    var n = v.length, N = 1 << n, sum = new Float64Array(N), dp = new Int8Array(N), pick = new Int8Array(N);
    for (var m = 1; m < N; m++) {
      var low = m & -m, li = 31 - Math.clz32(low);
      sum[m] = sum[m ^ low] + v[li];
      var best = -1, bi = 0;
      for (var j = 0; j < n; j++) if (m >> j & 1) { var c = dp[m ^ (1 << j)]; if (c > best) { best = c; bi = j; } }
      dp[m] = best + (sum[m] === 0 ? 1 : 0); pick[m] = bi;
    }
    var groups = [], cur = N - 1, g = [];
    while (cur) { var k = pick[cur]; g.push(k); cur ^= 1 << k; if (sum[cur] === 0) { groups.push(g); g = []; } }
    if (g.length) groups.push(g);
    return groups;
  }
  function settle(net) {
    var ids = Object.keys(net).filter(function (id) { return net[id] !== 0; }).sort();
    var out = [], exact = false;
    if (ids.length < 2) return { payments: out, exact: true };
    var groups = [ids], sum = ids.reduce(function (a, id) { return a + net[id]; }, 0);
    if (ids.length <= EXACT_MAX && sum === 0) {
      groups = zeroGroups(ids.map(function (id) { return net[id]; })).map(function (g) { return g.map(function (i) { return ids[i]; }); });
      exact = true;
    }
    function bySize(a, b) { return b.v - a.v || (a.id < b.id ? -1 : 1); }
    groups.forEach(function (g) {
      var deb = [], cre = [];
      g.forEach(function (id) { if (net[id] < 0) deb.push({ id: id, v: -net[id] }); else if (net[id] > 0) cre.push({ id: id, v: net[id] }); });
      while (deb.length && cre.length) {
        deb.sort(bySize); cre.sort(bySize);
        var d = deb[0], c = cre[0], x = Math.min(d.v, c.v);
        out.push({ from: d.id, to: c.id, amount: x });
        d.v -= x; c.v -= x;
        if (!d.v) deb.shift();
        if (!c.v) cre.shift();
      }
    });
    out.sort(function (a, b) { return b.amount - a.amount || (a.from < b.from ? -1 : 1); });
    return { payments: out, exact: exact };
  }
  function netOf(bal) { var n = {}; for (var id in bal.per) n[id] = bal.per[id].net; return n; }

  /* ---------- Monatsabrechnung ---------- */
  /* Ein Monat für sich (ym "2026-10"): was gekauft wurde, nach Kategorie, wer wie viel bezahlt hat und wie gross der Anteil
     jeder Person ist, und mit welchen Zahlungen dieser Monat quitt ist. scope "shop": nur Einkäufe (Lebensmittel und Haushalt),
     sonst alle Ausgaben. Ausgleichszahlungen aus der Monatsabrechnung tragen den Monat (settles "2026-10" oder "2026-10:shop")
     und zählen nur dort; in der Gesamtabrechnung sind sie gewöhnliche Zahlungen. */
  var SHOP_CATS = ["groceries", "household"];
  function monthTag(ym, scope) { return ym + (scope === "shop" ? ":shop" : ""); }
  function monthReport(home, expenses, ym, scope) {
    var all = expenses || [], tag = monthTag(ym, scope);
    var items = all.filter(function (e) { return e.kind !== "transfer" && e.date && e.date.slice(0, 7) === ym && (scope !== "shop" || SHOP_CATS.indexOf(e.cat) >= 0); });
    var paid = all.filter(function (e) { return e.kind === "transfer" && e.settles === tag; });
    var bal = balances(home, items.concat(paid)), plan = settle(netOf(bal)), byCat = {}, cats = [];
    items.forEach(function (e) {
      var s = shares(e, home);
      if (!s) return;
      if (!byCat[e.cat]) { byCat[e.cat] = { cat: e.cat, total: 0, n: 0 }; cats.push(byCat[e.cat]); }
      byCat[e.cat].total += s.total; byCat[e.cat].n++;
    });
    cats.sort(function (a, b) { return b.total - a.total; });
    var py = +ym.slice(0, 4), pm = +ym.slice(5, 7) - 1;
    if (pm < 1) { pm = 12; py--; }
    var prevYm = py + "-" + pad(pm), prev = 0;
    all.forEach(function (e) {
      if (e.kind === "transfer" || !e.date || e.date.slice(0, 7) !== prevYm || (scope === "shop" && SHOP_CATS.indexOf(e.cat) < 0)) return;
      var s = shares(e, home); if (s) prev += s.total;
    });
    items.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : (b.ts || 0) - (a.ts || 0); });
    var days = daysInMonth(+ym.slice(0, 4), +ym.slice(5, 7)), now = today();
    var elapsed = now.slice(0, 7) === ym ? +now.slice(8, 10) : now.slice(0, 7) > ym ? days : 0;
    return { ym: ym, scope: scope === "shop" ? "shop" : "all", tag: tag, items: items, paid: paid, total: bal.total, count: bal.count, missing: bal.missing,
      per: bal.per, plan: plan, cats: cats, prev: prev, prevYm: prevYm, perDay: elapsed ? Math.round(bal.total / elapsed) : 0,
      settled: bal.count > 0 && !plan.payments.length && !bal.missing, open: plan.payments.length };
  }
  /* Die Abrechnung als Text für den Gruppenchat, und als Tabelle (CSV mit Semikolon, wie Excel in der Schweiz sie öffnet). */
  function monthText(home, rep, nameOf) {
    var b = home.base, L = ["Abrechnung " + monthLabel(rep.ym) + (rep.scope === "shop" ? " (Einkäufe)" : "") + " · " + home.name, "",
      "Total: " + money(rep.total, b) + " (" + rep.count + (rep.count === 1 ? " Buchung" : " Buchungen") + ")"];
    rep.cats.forEach(function (c) { L.push("  " + catLabel(c.cat) + ": " + money(c.total, b)); });
    L.push("");
    Object.keys(rep.per).forEach(function (id) {
      var p = rep.per[id];
      if (p.paid || p.share) L.push(nameOf(id) + ": bezahlt " + money(p.paid, b) + ", Anteil " + money(p.share, b));
    });
    L.push("");
    if (rep.plan.payments.length) { L.push("So ist der Monat quitt:"); rep.plan.payments.forEach(function (p) { L.push("  " + nameOf(p.from) + " → " + nameOf(p.to) + ": " + money(p.amount, b)); }); }
    else L.push(rep.count ? "Dieser Monat ist quitt." : "Keine Buchungen.");
    return L.join("\n");
  }
  function monthCsv(home, rep, nameOf) {
    var b = home.base, ids = memberIds(home, true), q = function (v) { v = String(v == null ? "" : v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var rows = [["Datum", "Titel", "Kategorie", "Bezahlt von", "Betrag", "Währung", "Betrag " + b].concat(ids.map(function (id) { return "Anteil " + nameOf(id); }))];
    rep.items.forEach(function (e) {
      var s = shares(e, home);
      rows.push([e.date, e.title, catLabel(e.cat), nameOf(e.payer), plain(e.amount, e.cur), e.cur, s ? plain(s.total, b) : ""].concat(ids.map(function (id) { return s && s.parts[id] ? plain(s.parts[id], b) : ""; })));
    });
    rows.push([]);
    rows.push(["Total", "", "", "", "", "", plain(rep.total, b)].concat(ids.map(function (id) { return rep.per[id] ? plain(rep.per[id].share, b) : ""; })));
    rows.push(["Bezahlt", "", "", "", "", "", ""].concat(ids.map(function (id) { return rep.per[id] ? plain(rep.per[id].paid, b) : ""; })));
    return "\ufeff" + rows.map(function (r) { return r.map(q).join(";"); }).join("\r\n") + "\r\n";
  }

  /* ---------- Statistik ---------- */
  /* period: "month" = laufender Kalendermonat, "year" = die letzten zwölf Monate, sonst alles. Gezeigt wird pro Monat. */
  function periodStart(period, now) {
    now = now || today();
    if (period === "month") return now.slice(0, 7) + "-01";
    if (period === "year") { var y = +now.slice(0, 4), m = +now.slice(5, 7) - 11; if (m < 1) { m += 12; y--; } return y + "-" + pad(m) + "-01"; }
    return "";
  }
  function nextMonth(ym) { var y = +ym.slice(0, 4), m = +ym.slice(5, 7) + 1; if (m > 12) { m = 1; y++; } return y + "-" + pad(m); }
  function stats(home, expenses, memberId, period, now) {
    var byCat = {}, byMonth = {}, total = 0, count = 0, minD = null, maxD = null, from = periodStart(period, now);
    (expenses || []).forEach(function (e) {
      if (e.kind === "transfer") return;
      if (from && !(validDate(e.date) && e.date >= from)) return;
      var s = shares(e, home);
      if (!s) return;
      var v = memberId ? (s.parts[memberId] || 0) : s.total;
      if (memberId && !v) return;
      total += v; count++;
      var c = isCat(e.cat) ? e.cat : "other";
      byCat[c] = (byCat[c] || 0) + v;
      if (validDate(e.date)) {
        var ym = e.date.slice(0, 7);
        byMonth[ym] = (byMonth[ym] || 0) + v;
        if (!minD || e.date < minD) minD = e.date;
        if (!maxD || e.date > maxD) maxD = e.date;
      }
    });
    var cats = CATS.filter(function (c) { return byCat[c.id] > 0; }).map(function (c) { return { id: c.id, label: c.label, amount: byCat[c.id] }; })
      .sort(function (a, b) { return b.amount - a.amount; });
    var months = [];
    if (minD) {
      var first = (from || minD).slice(0, 7), last = maxD.slice(0, 7), n = 0;
      if (period === "year" || period === "month") last = (now || today()).slice(0, 7) > last ? (now || today()).slice(0, 7) : last;
      for (var ym2 = first; ym2 <= last && n < 36; ym2 = nextMonth(ym2), n++) months.push({ month: ym2, amount: byMonth[ym2] || 0 });
      if (n >= 36) months = Object.keys(byMonth).sort().map(function (k) { return { month: k, amount: byMonth[k] }; });
    }
    /* Der Durchschnitt pro Monat zählt ab dem ersten Monat mit einer Ausgabe bis heute, nicht über leere Monate davor. */
    var nMonths = 1;
    if (minD) {
      var end = (now || today()).slice(0, 7) > maxD.slice(0, 7) ? (now || today()).slice(0, 7) : maxD.slice(0, 7);
      nMonths = Math.max(1, (+end.slice(0, 4) * 12 + +end.slice(5, 7)) - (+minD.slice(0, 4) * 12 + +minD.slice(5, 7)) + 1);
    }
    return { total: total, count: count, cats: cats, months: months, first: minD, last: maxD, nMonths: nMonths };
  }

  /* "Schöne" Obergrenze für eine Achse, deren halber Wert ebenfalls rund ist */
  function niceMax(v) {
    if (!(v > 0)) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(v))), f = v / p;
    var steps = [1, 1.2, 1.6, 2, 3, 4, 5, 6, 8, 10], n = 10;
    for (var i = 0; i < steps.length; i++) if (f <= steps[i] + 1e-9) { n = steps[i]; break; }
    return Math.round(n * p);
  }

  /* ---------- Stempel (Awards) ---------- */
  function awards(home, expenses, bal) {
    var m = home.members || {}, base = home.base, xs = [];
    function name(id) { return (m[id] && m[id].name) || "Unbekannt"; }
    (expenses || []).forEach(function (e) { if (e.kind === "transfer") return; var s = shares(e, home); if (s) xs.push({ e: e, s: s }); });
    if (xs.length < 3) return [];
    var ids = Object.keys(bal.per).sort(), out = [];
    function top(fn, min) {
      var best = null;
      ids.forEach(function (id) { var v = fn(id); if (v != null && (best == null || (min ? v < best.v : v > best.v))) best = { id: id, v: v }; });
      return best;
    }
    var a = top(function (id) { return bal.per[id].paid || null; });
    if (a) out.push({ id: "spender", emoji: "💸", title: "Spendierhose", who: name(a.id), note: money(a.v, base) + " vorgestreckt" });

    var big = xs.reduce(function (x, y) { return y.s.total > x.s.total ? y : x; });
    out.push({ id: "big", emoji: "🧾", title: "Grösster Posten", who: big.e.title || catLabel(big.e.cat), note: money(big.s.total, base) + ", bezahlt von " + name(big.e.payer) });

    var buyer = {};
    xs.forEach(function (x) { if (x.e.cat === "groceries") buyer[x.e.payer] = (buyer[x.e.payer] || 0) + 1; });
    var f = top(function (id) { return buyer[id] || null; });
    if (f && f.v >= 2) out.push({ id: "fridge", emoji: "🧊", title: "Kühlschrankfüller", who: name(f.id), note: f.v + " Einkäufe bezahlt" });

    function catShare(cats) {
      var t = {};
      xs.forEach(function (x) { if (cats.indexOf(x.e.cat) < 0) return; for (var id in x.s.parts) t[id] = (t[id] || 0) + x.s.parts[id]; });
      return t;
    }
    var food = catShare(["food"]), g = top(function (id) { return food[id] || null; });
    if (g) out.push({ id: "gourmet", emoji: "🍝", title: "Feinschmecker", who: name(g.id), note: money(g.v, base) + " für Restaurant und Take-away" });

    var withShare = ids.filter(function (id) { return bal.per[id].share > 0; });
    if (withShare.length >= 3) {
      var s = top(function (id) { return bal.per[id].share > 0 ? bal.per[id].share : null; }, true);
      if (s) out.push({ id: "saver", emoji: "🦊", title: "Sparfuchs", who: name(s.id), note: "nur " + money(s.v, base) + " verbraucht" });
    }

    var byWho = {};
    xs.forEach(function (x) { if (x.e.by && m[x.e.by]) byWho[x.e.by] = (byWho[x.e.by] || 0) + 1; });
    var b = top(function (id) { return byWho[id] || null; });
    if (b && b.v >= 2) out.push({ id: "clerk", emoji: "🤓", title: "Buchhalter", who: name(b.id), note: b.v + " Ausgaben erfasst" });

    var byMonth = {};
    xs.forEach(function (x) { if (validDate(x.e.date)) { var k = x.e.date.slice(0, 7); byMonth[k] = (byMonth[k] || 0) + x.s.total; } });
    var mk = Object.keys(byMonth).sort();
    if (mk.length >= 2) {
      var d = mk.reduce(function (x, y) { return byMonth[y] > byMonth[x] ? y : x; });
      out.push({ id: "month", emoji: "🔥", title: "Teuerster Monat", who: monthLabel(d), note: money(byMonth[d], base) + " in einem Monat" });
    }

    var small = xs.reduce(function (x, y) { return y.s.total < x.s.total ? y : x; });
    if (small !== big) out.push({ id: "small", emoji: "🐜", title: "Kleinvieh", who: small.e.title || catLabel(small.e.cat), note: money(small.s.total, base) + ", macht auch Mist" });
    return out;
  }

  /* ---------- Meme-Karten ---------- */
  /* Sprüche, die fast alle kennen, passend zum Stand der Kasse. Gibt es mehrere passende, entscheiden Haushalt und Tag: Die Karte
     bleibt also einen Tag lang dieselbe und springt nicht bei jedem Tippen. o: { net, base, count, payments, seed, day }.
     net ist der eigene Saldo (oder null, solange niemand gewählt ist), count die Zahl der Ausgaben, payments die Zahl der
     Zahlungen, mit denen alle quitt wären. Ergebnis: { tone, emoji, top, bottom }. */
  function meme(o) {
    o = o || {};
    var base = o.base || "CHF", n = hash(String(o.seed || "") + "|" + String(o.day || today()));
    function one(list) { return list[n % list.length]; }
    function card(tone, emoji, top, bottom) { return { tone: tone, emoji: emoji, top: top, bottom: bottom }; }
    if (!(o.count > 0)) return one([
      card("idle", "🗿", "Noch keine Ausgaben", "Bruh."),
      card("idle", "💀", "Ich, wie ich warte", "bis jemand den ersten Einkauf zahlt"),
      card("idle", "🧙", "One does not simply", "die Nebenkosten im Kopf aufteilen")
    ]);
    if (typeof o.net === "number" && isFinite(o.net)) {
      var amt = money(Math.abs(o.net), base);
      if (o.net > 0) return one([
        card("up", "📈", "Stonks", "Du bekommst " + amt),
        card("up", "🚀", "To the moon", "Du bekommst " + amt),
        card("up", "🖨️", "Money printer go brrr", "Du bekommst " + amt)
      ]);
      if (o.net < 0) return one([
        card("down", "🔥", "This is fine.", "Du schuldest " + amt),
        card("down", "📉", "Not stonks", "Du schuldest " + amt),
        card("down", "💸", "Shut up and take my money!", "Du schuldest " + amt),
        card("down", "⌨️", "Press F to pay", "Du schuldest " + amt)
      ]);
      return one([
        card("even", "⚖️", "Perfectly balanced", "as all things should be"),
        card("even", "🤝", "Du bist quitt", "Much fair. Very wow."),
        card("even", "😎", "Du bist quitt", "Deal with it.")
      ]);
    }
    if (!(o.payments > 0)) return card("even", "⚖️", "Perfectly balanced", "Alle sind quitt");
    return one([
      card("brain", "🧠", "Big brain time", (o.payments === 1 ? "Eine Zahlung" : o.payments + " Zahlungen") + ", und alle sind quitt"),
      card("brain", "🧙", "One does not simply", "im Kopf abrechnen")
    ]);
  }
  /* Für die Statistik: nur wenn das Total eine bekannte Schwelle sprengt. Sonst null. */
  function memeTotal(total, base) {
    var f = Math.pow(10, digits(base || "CHF"));
    return total > 9000 * f ? { tone: "boom", emoji: "💥", top: "It's over 9000!", bottom: "Total " + money(total, base) } : null;
  }

  /* ---------- Text für den Gruppenchat ---------- */
  function summaryText(home, bal, plan) {
    var m = home.members || {}, base = home.base, L = [];
    function name(id) { return (m[id] && m[id].name) || "Unbekannt"; }
    var ids = Object.keys(bal.per).sort(function (a, b) { return bal.per[b].net - bal.per[a].net || (name(a) < name(b) ? -1 : 1); });
    L.push("Haushaltskasse «" + (home.name || "Haushalt") + "»");
    L.push("Total " + money(bal.total, base) + ", " + memberIds(home).length + " Personen");
    L.push("");
    if (plan.payments.length) {
      L.push("So sind wir quitt:");
      plan.payments.forEach(function (p) { L.push(name(p.from) + " → " + name(p.to) + ": " + money(p.amount, base)); });
    } else L.push("Alle sind quitt.");
    L.push("");
    L.push("Saldo in " + base + ":");
    ids.forEach(function (id) { L.push(name(id) + " " + signed(bal.per[id].net, base)); });
    return L.join("\n").replace(/ /g, " ");
  }

  /* ---------- Prüfen vor dem Speichern ---------- */
  function check(e, home) {
    if (!(e.amount > 0)) return "Gib einen Betrag grösser als null ein.";
    if (e.amount > MAX_MINOR) return "Dieser Betrag ist zu gross für die Haushaltskasse.";
    if (!e.payer) return "Wähle, wer bezahlt hat.";
    if (e.kind === "transfer") {
      if (!e.to) return "Wähle, wer das Geld bekommen hat.";
      if (e.to === e.payer) return "Zahlung an sich selbst geht nicht. Wähle zwei verschiedene Personen.";
    } else if (e.mode === "equal" || e.mode === "items") {
      if (!(e.for && e.for.length)) return "Wähle mindestens eine Person, die mitzahlt.";
    } else if (e.mode === "shares") {
      if (!Object.keys(e.weights || {}).length) return "Gib mindestens einer Person einen Anteil.";
    } else if (e.mode === "exact") {
      var sum = 0; for (var id in (e.weights || {})) sum += e.weights[id];
      if (sum !== e.amount) return "Die Beträge ergeben " + money(sum, e.cur) + ", die Ausgabe ist " + money(e.amount, e.cur) + ". Verteile die Differenz von " + money(Math.abs(e.amount - sum), e.cur) + ".";
    }
    if (e.cur !== home.base && !(rateFor(e, home) > 0)) return "Gib den Wechselkurs für " + e.cur + " ein.";
    if (!validDate(e.date)) return "Wähle ein Datum.";
    return null;
  }

  /* ---------- Einkaufsliste ---------- */
  /* Abteilungen wie im Laden. Neue Artikel landen über ein kleines Stichwortverzeichnis in der passenden Abteilung;
     gewählt wird das längste passende Stichwort ("Weisswein" ist Wein, nicht Eis). */
  var SHOP = [
    { id: "produce", label: "Früchte & Gemüse", emoji: "🥦" },
    { id: "bakery", label: "Brot & Backwaren", emoji: "🥖" },
    { id: "dairy", label: "Milch, Käse & Eier", emoji: "🧀" },
    { id: "meat", label: "Fleisch & Fisch", emoji: "🥩" },
    { id: "pantry", label: "Vorrat", emoji: "🍝" },
    { id: "frozen", label: "Tiefkühl", emoji: "🧊" },
    { id: "drinks", label: "Getränke", emoji: "🥤" },
    { id: "sweets", label: "Süsses & Snacks", emoji: "🍫" },
    { id: "care", label: "Drogerie & Pflege", emoji: "🧴" },
    { id: "clean", label: "Haushalt & Putzen", emoji: "🧽" },
    { id: "other", label: "Sonstiges", emoji: "✨" }
  ];
  var shopT = table(SHOP, "other");
  var SHOP_WORDS = {
    produce: "apfel äpfel banane birne orange zitrone limette traube beere erdbeer himbeer heidelbeer kiwi mango ananas melone salat gurke tomate rüebli karotte peperoni paprika zwiebel knoblauch kartoffel härdöpfel lauch zucchetti zucchini aubergine brokkoli broccoli blumenkohl kohl spinat pilz champignon avocado ingwer kräuter basilikum petersilie schnittlauch koriander fenchel sellerie kürbis radiesli frucht früchte gemüse obst nektarine pfirsich aprikose zwetschge kirsche dill minze rosmarin thymian salbei majoran zitronengras schalotte chilischote randen rande choi sprossen rettich kabis krautstiel mais shiitake granatapfel peterli frühlingszwiebel rucola pandan marroni spargel wirz chicorée chicoree grapefruit sauerkraut curryblätter",
    bakery: "brot zopf gipfeli weggli brötchen toast baguette ciabatta croissant kuchen tortilla wrap fladen piadina piadine pfünderli bagel muffin",
    dairy: "milch käse joghurt jogurt yoghurt butter rahm quark mozzarella parmesan pecorino gruyère emmentaler appenzeller sbrinz vacherin raclettekäse feta eier mascarpone ricotta hüttenkäse crème creme fraîche fraiche skyr sauerrahm eigelb eiweiss paneer cheddar halloumi labneh ghee teig kuchenteig flammkuchenteig pizzateig gorgonzola yufka haferdrink",
    meat: "fleisch poulet huhn hähnchen rind schwein kalb lamm hack wurst cervelat salami schinken speck guanciale pancetta chorizo lachs thon fisch forelle crevetten steak filet plätzli bratwurst geschnetzeltes wienerli rippli dorade muschel matjes",
    pantry: "pasta teigwaren spaghetti nudeln penne hörnli reis risotto mehl zucker salz pfeffer öl olivenöl essig gewürz konserve bohnen linsen kichererbsen sauce sosse ketchup senf mayo honig konfi marmelade müesli muesli haferflocken cornflakes kaffee tee bouillon tomatenpüree passata nüsse mandeln couscous quinoa tofu hefe backpulver sesam kokosmilch currypaste maizena tortilla magronen makkaroni lasagne gnocchi brühe gemüsebrühe apfelmus tomatenmark polenta bulgur paniermehl linguine trofie spätzli rösti erdnussbutter kokosrahm fischsauce glasnudeln tahini harissa miso mirin gochujang kecap sambal sriracha hoisin kombu nori wakame algen bonito panko kapern oliven pistazien pinienkerne rosinen sultaninen kokosraspel datteln graupen gerste lorbeer safran kurkuma kardamom sternanis zimt kümmel masala sumach za'atar zaatar hanout biber chiliflocken chilipaste chilipulver currypulver kakao bockshornklee salsa guacamole kimchi freekeh pesto granatapfelsirup reisessig rotweinessig weissweinessig sherryessig apfelessig malzessig balsamico tamarinde kürbiskerne korianderpulver koriandersamen cocktailkirsche cornichons essiggurke eingelegte röstzwiebel gehackte pizzamehl ahornsirup ingwerpulver knoblauchpulver maiskörner ajvar hummus tempeh udon fusilli orecchiette rigatoni casarecce berbere berberitzen nelken anis gelatine espresso griess natron vanilleschote chiasamen sonnenblumenkerne jalapeño cannelloni chipotle piment cranberries",
    frozen: "tiefkühl glace pizza pommes eiswürfel edamame erbsen teigblätter",
    drinks: "wasser mineral saft apfelsaft orangensaft bier wein rotwein weisswein prosecco cola eistee sirup limonade rivella kombucha milchdrink sake amaretto marsala kirsch ananassaft",
    sweets: "schoggi schokolade chips guetzli keks bonbon gummibär snack popcorn riegel praline nutella biscuit marzipan amaretti läckerli leckerli meringue",
    care: "shampoo duschgel seife zahnpasta zahnbürste deo sonnencreme taschentücher watte rasier tampons binden windeln pflaster medikament dafalgan handcreme bodylotion",
    clean: "putzmittel abwaschmittel spülmittel geschirrspül tabs waschmittel weichspüler wc-papier toilettenpapier haushaltpapier küchenpapier abfallsack kehrichtsack müllsack schwamm lappen entkalker alufolie frischhaltefolie backpapier batterie glühbirne kerze spiesse"
  };
  /* Wendungen aus mehreren Wörtern, die anders einzuordnen sind als ihr Hauptwort (Dosentomaten gehören in den Vorrat). */
  var SHOP_PHRASES = { pantry: ["geschälte tomaten", "dose ananas", "ananasscheiben", "getrocknete shiitake", "getrocknete chili", "thon in", "getrocknete sardellen", "baked beans", "mais aus der dose"],
    produce: ["grüne bohnen", "breite bohnen", "frische bohnen"], dairy: ["yufka-teigblätter"] };
  var SHOP_INDEX = [];
  Object.keys(SHOP_WORDS).forEach(function (sec) { SHOP_WORDS[sec].split(" ").forEach(function (w) { SHOP_INDEX.push({ w: w, sec: sec }); }); });
  Object.keys(SHOP_PHRASES).forEach(function (sec) { SHOP_PHRASES[sec].forEach(function (w) { SHOP_INDEX.push({ w: w, sec: sec }); }); });
  SHOP_INDEX.sort(function (a, b) { return b.w.length - a.w.length; });
  function shopGuess(name) {
    var t = String(name || "").toLowerCase();
    if (/^(ei|eier)(?![a-zäöü])/.test(t)) return "dairy";               // "Ei" allein ist zu kurz für die Stichwortsuche
    for (var i = 0; i < SHOP_INDEX.length; i++) if (t.indexOf(SHOP_INDEX[i].w) >= 0) return SHOP_INDEX[i].sec;
    return "other";
  }
  /* Zahlen und Einheiten in Mengenangaben, auch aus Rezepten ("1/2 TL", "½ Bund", "1-2 Zehen"). */
  var NUM = "(?:\\d+\\/\\d+|\\d+(?:[.,]\\d+)?(?:\\s*[-–]\\s*\\d+(?:[.,]\\d+)?)?|[½¼¾⅓⅔])";
  var UNIT = "(?:x|stk\\.?|stück|kg|kilo|g|gramm|l|liter|dl|cl|ml|el|tl|msp|prise|prisen|pack|packung|päckli|paket|pkg\\.?|dose|dosen|flasche|flaschen|bund|beutel|glas|becher|rolle|rollen|schachtel|tube|zehe|zehen|scheibe|scheiben|stange|stangen|zweig|zweige|handvoll|kopf|knolle|briefchen|briefli)";
  /* "2 Liter Milch", "Milch 2l", "3x Joghurt": eine Mengenangabe am Anfang oder am Ende wird abgetrennt. */
  function splitQty(input) {
    var s = String(input || "").trim().replace(/\s+/g, " ");
    var m = new RegExp("^(" + NUM + "\\s*" + UNIT + "?)\\s+(.+)$", "i").exec(s);
    if (m) return { name: m[2], qty: m[1].replace(/\s+/g, " ") };
    m = new RegExp("^(.+?)\\s+(" + NUM + "\\s*" + UNIT + ")$", "i").exec(s);
    if (m) return { name: m[1], qty: m[2].replace(/\s+/g, " ") };
    return { name: s, qty: "" };
  }

  /* ---------- Kalender ---------- */
  var EV_CATS = [
    { id: "date", label: "Termin", emoji: "📅" },
    { id: "birthday", label: "Geburtstag", emoji: "🎂" },
    { id: "trash", label: "Abfuhr", emoji: "🗑️" },
    { id: "chores", label: "Haushalt", emoji: "🧹" },
    { id: "visit", label: "Besuch", emoji: "👋" },
    { id: "holiday", label: "Ferien", emoji: "✈️" },
    { id: "party", label: "Fest", emoji: "🎉" },
    { id: "health", label: "Gesundheit", emoji: "🩺" },
    { id: "meal", label: "Essen", emoji: "🍽️" },
    { id: "other", label: "Sonstiges", emoji: "✨" }
  ];
  var evT = table(EV_CATS, "other");
  var REPEATS = [["none", "Einmalig"], ["weekly", "Jede Woche"], ["biweekly", "Alle 2 Wochen"], ["monthly", "Jeden Monat"], ["yearly", "Jedes Jahr"]];
  function isRepeat(r) { return REPEATS.some(function (x) { return x[0] === r; }); }

  /* Alle Tage zwischen from und to (beide eingeschlossen), an denen Termine stattfinden. Ein mehrtägiger Termin erscheint an
     jedem seiner Tage. Monatliche Termine am 29. bis 31. fallen in kürzeren Monaten aus, jährliche am 29. Februar ausser in
     Schaltjahren; so halten es auch die gängigen Kalender. Ergebnis sortiert: Tag, dann ganztägig vor Uhrzeit, dann Titel. */
  function starts(e, from, to, len) {
    var out = [], step = e.repeat === "weekly" ? 7 : e.repeat === "biweekly" ? 14 : 0, s, guard = 0;
    var limit = e.until && e.until < to ? e.until : to;
    if (e.repeat === "none" || !isRepeat(e.repeat)) { if (e.date <= to && addDays(e.date, len) >= from) out.push(e.date); return out; }
    if (step) {
      var k = Math.max(0, Math.ceil((dayDiff(e.date, from) - len) / step));
      for (s = addDays(e.date, k * step); s <= limit && guard < 800; s = addDays(s, step), guard++) if (addDays(s, len) >= from) out.push(s);
      return out;
    }
    var y = +e.date.slice(0, 4), m = +e.date.slice(5, 7), d = +e.date.slice(8, 10);
    if (e.repeat === "monthly") {
      var fy = +from.slice(0, 4), fm = +from.slice(5, 7), back = Math.ceil(len / 28) + 1;
      var idx = Math.max(y * 12 + m - 1, fy * 12 + fm - 1 - back);
      for (; guard < 800; idx++, guard++) {
        var yy = Math.floor(idx / 12), mm = idx % 12 + 1;
        if (d > daysInMonth(yy, mm)) continue;
        s = yy + "-" + pad(mm) + "-" + pad(d);
        if (s > limit) break;
        if (s >= e.date && addDays(s, len) >= from) out.push(s);
      }
      return out;
    }
    var yStart = Math.max(y, +from.slice(0, 4) - 1 - Math.ceil(len / 365));
    for (var yr = yStart; guard < 400; yr++, guard++) {
      if (m === 2 && d === 29 && daysInMonth(yr, 2) < 29) continue;
      s = yr + "-" + pad(m) + "-" + pad(d);
      if (s > limit) break;
      if (s >= e.date && addDays(s, len) >= from) out.push(s);
    }
    return out;
  }
  function occurrences(events, from, to) {
    var out = [];
    (events || []).forEach(function (e) {
      if (!validDate(e.date)) return;
      var len = e.end && e.end > e.date ? Math.min(366, dayDiff(e.date, e.end)) : 0;
      starts(e, from, to, len).forEach(function (s) {
        if (e.skip && e.skip.indexOf(s) >= 0) return;                 // einzeln gestrichen
        var a = s < from ? from : s, last = addDays(s, len), b = last > to ? to : last;
        for (var d = a, n = 0; d <= b && n < 400; d = addDays(d, 1), n++) out.push({ e: e, date: d, start: s, end: last, first: d === s, last: d === last, multi: len > 0 });
      });
    });
    out.sort(function (x, y) {
      if (x.date !== y.date) return x.date < y.date ? -1 : 1;
      var tx = x.first && x.e.time ? x.e.time : "", ty = y.first && y.e.time ? y.e.time : "";
      if (tx !== ty) return tx < ty ? -1 : 1;
      return x.e.title < y.e.title ? -1 : x.e.title > y.e.title ? 1 : (x.e.id < y.e.id ? -1 : 1);
    });
    return out;
  }
  function eventCheck(e) {
    if (!e.title) return "Gib dem Termin einen Titel.";
    if (!validDate(e.date)) return "Wähle ein Datum.";
    if (e.end && (!validDate(e.end) || e.end < e.date)) return "Das Ende liegt vor dem Beginn. Wähle ein späteres Enddatum.";
    if (e.end && dayDiff(e.date, e.end) > 366) return "Ein Termin dauert höchstens ein Jahr.";
    if (e.time && !validTime(e.time)) return "Die Uhrzeit stimmt nicht. Schreib sie zum Beispiel als 18:30.";
    if (e.endTime && !validTime(e.endTime)) return "Die Endzeit stimmt nicht. Schreib sie zum Beispiel als 20:00.";
    if (e.time && e.endTime && !e.end && e.endTime <= e.time) return "Die Endzeit liegt vor dem Beginn.";
    if (e.until && e.until < e.date) return "«Wiederholen bis» liegt vor dem ersten Termin.";
    return null;
  }

  /* ---------- Pflanzen ---------- */
  var PLANTS = [
    ["topf", "🪴", "Topfpflanze"], ["kaktus", "🌵", "Kaktus"], ["kraeuter", "🌿", "Kräuter"], ["setzling", "🌱", "Setzling"], ["bluete", "🌸", "Blüte"], ["hibiskus", "🌺", "Hibiskus"],
    ["sonnenblume", "🌻", "Sonnenblume"], ["tulpe", "🌷", "Tulpe"], ["rose", "🌹", "Rose"], ["margerite", "🌼", "Margerite"], ["strauss", "💐", "Blumenstrauss"], ["klee", "🍀", "Klee"],
    ["bambus", "🎋", "Bambus"], ["palme", "🌴", "Palme"], ["baum", "🌳", "Bäumchen"], ["blaetter", "🍃", "Grünpflanze"], ["gras", "🌾", "Gräser"], ["tomate", "🍅", "Tomate"],
    ["chili", "🌶️", "Chili"], ["erdbeere", "🍓", "Erdbeere"], ["zitrone", "🍋", "Zitrone"], ["pilz", "🍄", "Pilz"]
  ];
  var PL = Object.create(null);
  PLANTS.forEach(function (p) { PL[p[0]] = { id: p[0], ch: p[1], label: p[2] }; });
  function isPlantEmoji(id) { return typeof id === "string" && PL[id] !== undefined; }
  function plantEmoji(id) { return (isPlantEmoji(id) ? PL[id] : PL.topf).ch; }
  /* Wann ist eine Pflanze wieder dran? days < 0: überfällig, 0: heute, > 0: in so vielen Tagen. Nie gegossen gilt als heute. */
  function plantDue(p, now) {
    now = now || today();
    if (!validDate(p.last)) return { next: now, days: 0, never: true };
    var next = addDays(p.last, p.every);
    return { next: next, days: dayDiff(now, next), never: false };
  }
  function feedDue(p, now) {
    if (!(p.feedEvery > 0)) return null;
    now = now || today();
    if (!validDate(p.fed)) return { next: now, days: 0, never: true };
    var next = addDays(p.fed, p.feedEvery);
    return { next: next, days: dayDiff(now, next), never: false };
  }
  /* Was nach dem Giessen (kind "w") oder Düngen ("f") zu speichern ist. Das Protokoll behält die letzten 30 Einträge. */
  function careFields(p, kind, date, by) {
    var log = [{ d: date, by: by || null, k: kind }].concat(p.log || []).slice(0, 30), out = { log: log };
    if (kind === "f") { out.fed = date; }
    else { out.last = date; out.lastBy = by || null; }
    return out;
  }

  /* ---------- Infos ---------- */
  /* Jede Art bringt Felder mit, die man meistens braucht. Sie sind nur ein Vorschlag: Felder lassen sich umbenennen,
     löschen und ergänzen. */
  var INFO_CATS = [
    { id: "home", label: "Wohnung & Miete", emoji: "🏠", fields: ["Vermieter / Verwaltung", "Telefon", "E-Mail", "Miete netto", "Nebenkosten", "Mietbeginn", "Kündigungsfrist", "Kündigungstermine", "Mietkaution"] },
    { id: "insurance", label: "Versicherungen", emoji: "🛡️", fields: ["Versicherung", "Policennummer", "Prämie", "Deckung", "Telefon Schadenmeldung", "Kündigungsfrist"] },
    { id: "contracts", label: "Verträge & Abos", emoji: "📄", fields: ["Anbieter", "Kundennummer", "Kosten", "Laufzeit", "Kündigungsfrist"] },
    { id: "utilities", label: "Strom, Wasser & Heizung", emoji: "⚡", fields: ["Anbieter", "Kundennummer", "Zählernummer", "Zählerstand"] },
    { id: "contacts", label: "Kontakte & Notfall", emoji: "📞", fields: ["Name", "Telefon", "E-Mail", "Adresse"] },
    { id: "wifi", label: "WLAN & Geräte", emoji: "📶", fields: ["Netzwerk", "Passwort", "Router", "Seriennummer"] },
    { id: "waste", label: "Entsorgung", emoji: "♻️", fields: ["Kehricht", "Papier & Karton", "Grüngut", "Glas & PET", "Sammelstelle"] },
    { id: "other", label: "Sonstiges", emoji: "✨", fields: [] }
  ];
  var infoT = table(INFO_CATS, "other");
  function okUrl(u) { return typeof u === "string" && u.length <= 500 && /^https?:\/\/[^\s<>"]+\.[^\s<>"]+$/i.test(u); }
  function dueOf(info, now) { return validDate(info.due) ? dayDiff(now || today(), info.due) : null; }

  /* ---------- Rezepte und Kochideen ---------- */
  var DISHES = [
    ["teller", "🍽️", "Teller"], ["pasta", "🍝", "Pasta"], ["pizza", "🍕", "Pizza"], ["curry", "🍛", "Curry"], ["suppe", "🥣", "Suppe"], ["salat", "🥗", "Salat"],
    ["eintopf", "🍲", "Eintopf"], ["pfanne", "🥘", "Pfanne"], ["reis", "🍚", "Reis"], ["nudeln", "🍜", "Nudelsuppe"], ["burger", "🍔", "Burger"], ["taco", "🌮", "Taco"],
    ["fladen", "🫓", "Fladenbrot"], ["sandwich", "🥪", "Sandwich"], ["ei", "🍳", "Spiegelei"], ["kartoffel", "🥔", "Kartoffel"], ["kaese", "🧀", "Käse"], ["fondue", "🫕", "Fondue"],
    ["fleisch", "🥩", "Fleisch"], ["poulet", "🍗", "Poulet"], ["speck", "🥓", "Speck"], ["fisch", "🐟", "Fisch"], ["sushi", "🍣", "Sushi"], ["gemuese", "🥦", "Gemüse"],
    ["ruebli", "🥕", "Rüebli"], ["peperoni", "🫑", "Peperoni"], ["chili", "🌶️", "Chili"], ["pilz", "🍄", "Pilz"], ["kuerbis", "🎃", "Kürbis"], ["apfel", "🍎", "Apfel"],
    ["brot", "🍞", "Brot"], ["pancake", "🥞", "Pancakes"], ["waehe", "🥧", "Wähe"], ["kuchen", "🍰", "Kuchen"], ["schoggi", "🍫", "Schoggi"], ["glace", "🍨", "Glace"]
  ];
  var DISH = Object.create(null);
  DISHES.forEach(function (x) { DISH[x[0]] = { id: x[0], ch: x[1], label: x[2] }; });
  function isDish(id) { return typeof id === "string" && DISH[id] !== undefined; }
  function dishEmoji(id) { return (isDish(id) ? DISH[id] : DISH.teller).ch; }
  var RECIPE_CATS = [
    { id: "main", label: "Hauptgang", emoji: "🍽️" },
    { id: "soup", label: "Suppe", emoji: "🥣" },
    { id: "salad", label: "Salat", emoji: "🥗" },
    { id: "breakfast", label: "Frühstück", emoji: "🥐" },
    { id: "sweet", label: "Dessert & Backen", emoji: "🍰" },
    { id: "snack", label: "Apéro & Snack", emoji: "🥨" },
    { id: "other", label: "Sonstiges", emoji: "✨" }
  ];
  var recT = table(RECIPE_CATS, "other");
  var RECIPE_TAGS = [
    { id: "vegi", label: "Vegi", emoji: "🥦" },
    { id: "vegan", label: "Vegan", emoji: "🌱" },
    { id: "quick", label: "Schnell", emoji: "⚡" },
    { id: "cheap", label: "Günstig", emoji: "💸" },
    { id: "kids", label: "Kinderliebling", emoji: "🧒" },
    { id: "guests", label: "Für Gäste", emoji: "🥂" },
    { id: "prep", label: "Vorkochen", emoji: "📦" },
    { id: "glutenfree", label: "Glutenfrei", emoji: "🌾" }
  ];
  var tagT = table(RECIPE_TAGS, "vegi");
  /* Küchen des Rezeptbuchs, nach Weltgegend geordnet. Eigene Rezepte können auch eine Küche haben. */
  var REGIONS = [
    { id: "asien", label: "Asien", emoji: "🥢" },
    { id: "europa", label: "Europa", emoji: "🍷" },
    { id: "nahost", label: "Nahost & Nordafrika", emoji: "🧆" },
    { id: "amerika", label: "Amerika", emoji: "🌮" },
    { id: "afrika", label: "Afrika", emoji: "🌍" }
  ];
  var KITCHENS = [
    { id: "th", label: "Thailändisch", emoji: "🇹🇭", region: "asien" },
    { id: "cn", label: "Chinesisch", emoji: "🇨🇳", region: "asien" },
    { id: "jp", label: "Japanisch", emoji: "🇯🇵", region: "asien" },
    { id: "kr", label: "Koreanisch", emoji: "🇰🇷", region: "asien" },
    { id: "in", label: "Indisch", emoji: "🇮🇳", region: "asien" },
    { id: "vn", label: "Vietnamesisch", emoji: "🇻🇳", region: "asien" },
    { id: "sea", label: "Indonesien, Malaysia & Philippinen", emoji: "🌴", region: "asien" },
    { id: "ch", label: "Schweiz", emoji: "🇨🇭", region: "europa" },
    { id: "it", label: "Italienisch", emoji: "🇮🇹", region: "europa" },
    { id: "fr", label: "Französisch", emoji: "🇫🇷", region: "europa" },
    { id: "es", label: "Spanien & Portugal", emoji: "🇪🇸", region: "europa" },
    { id: "gr", label: "Griechisch", emoji: "🇬🇷", region: "europa" },
    { id: "de", label: "Deutschland & Österreich", emoji: "🥨", region: "europa" },
    { id: "east", label: "Osteuropa", emoji: "🥟", region: "europa" },
    { id: "nord", label: "Skandinavien & Britische Inseln", emoji: "🐟", region: "europa" },
    { id: "levante", label: "Levante & Nahost", emoji: "🧆", region: "nahost" },
    { id: "maghreb", label: "Nordafrika", emoji: "🫖", region: "nahost" },
    { id: "amerika", label: "USA & Kanada", emoji: "🍔", region: "amerika" },
    { id: "latam", label: "Mexiko & Lateinamerika", emoji: "🌮", region: "amerika" },
    { id: "afrika", label: "Afrika südlich der Sahara", emoji: "🌍", region: "afrika" }
  ];
  var kitT = table(KITCHENS, "ch");
  var regT = table(REGIONS, "europa");
  /* Sammlungen im Rezeptbuch: von Hand zusammengestellte Reihen quer durch die Küchen. */
  var COLLECTIONS = [
    { id: "glasiert", label: "Glasiertes Poulet mit Reis", emoji: "🍗", text: "Süss, salzig, klebrig glänzend: Poulet mit Glasur und Reis, von Teriyaki bis Granatapfel." },
    { id: "ottolenghi", label: "Im Stil von Ottolenghi", emoji: "🌿", text: "Eigene Rezepte im Geist der modernen Levante-Küche: viele Kräuter, Joghurt, Tahini, Granatapfel, Zitrone und Gewürze wie Sumach und Za'atar." }
  ];
  var collT = table(COLLECTIONS, "glasiert");
  /* Notizen zu einem Rezept: wie es war, und was man das nächste Mal anders macht. */
  var MOODS = [
    { id: "top", label: "Sehr gut", emoji: "😋" },
    { id: "ok", label: "Ganz okay", emoji: "🙂" },
    { id: "flop", label: "Nicht nochmals", emoji: "😕" }
  ];
  var moodT = table(MOODS, "ok");
  /* Gespeichert als Tabelle { Kennung: Notiz }, damit zwei Personen gleichzeitig schreiben können, ohne sich zu überschreiben.
     Eine gelöschte Notiz ist null. Ergebnis: Liste, die neuste zuerst. */
  function normNotes(v) {
    var out = [];
    if (Array.isArray(v)) { var m = {}; v.forEach(function (x) { if (x && typeof x === "object" && okId(x.id)) m[x.id] = x; }); v = m; }   // aus einer Sicherung
    if (v && typeof v === "object" && !Array.isArray(v)) for (var k in v) {
      var x = v[k];
      if (!okId(k) || !x || typeof x !== "object" || out.length >= 200) continue;
      var t = text(x.text, 500).trim(), mood = moodT.has(x.mood) ? x.mood : "";
      if (!t && !mood) continue;
      out.push({ id: k, text: t, mood: mood, tip: x.tip === true && !!t, by: okId(x.by) ? x.by : null, at: num0(x.at), d: validDate(x.d) ? x.d : "" });
    }
    out.sort(function (a, b) { return b.at - a.at || (a.id < b.id ? 1 : -1); });
    return out.slice(0, 100);
  }
  /* Für das Speichern: die Notizen wieder als Tabelle { Kennung: Notiz }. */
  function notesMap(list) { var m = {}; (list || []).forEach(function (n) { m[n.id] = { text: n.text, mood: n.mood, tip: n.tip, by: n.by, at: n.at, d: n.d }; }); return m; }
  /* Wie kam ein Rezept an? Zählt die Stimmungen, nennt die letzte und die Tipps fürs nächste Mal. */
  function noteSummary(r) {
    var notes = (r && r.notes) || [], o = { top: 0, ok: 0, flop: 0, mood: "", tips: [] };
    notes.forEach(function (n) { if (n.mood) { o[n.mood]++; if (!o.mood) o.mood = n.mood; } if (n.tip) o.tips.push(n); });
    return o;
  }
  /* "Schnell" ist, was so markiert ist oder höchstens eine halbe Stunde dauert; vegan ist auch vegi. */
  function hasTag(r, tag) {
    if (tag === "quick") return r.tags.indexOf("quick") >= 0 || (r.time > 0 && r.time <= 30);
    if (tag === "vegi") return r.tags.indexOf("vegi") >= 0 || r.tags.indexOf("vegan") >= 0;
    if (tag === "glutenfree") return r.tags.indexOf("glutenfree") >= 0 || traits(r).gf.level !== "contains";   // glutenfrei, auch mit einfachem Ersatz
    return r.tags.indexOf(tag) >= 0;
  }
  /* ---------- Glutenfrei ---------- */
  /* Aus den Zutaten abgeleitet: "free" (glutenfrei, wie es dasteht), "swap" (glutenfrei mit einfachem Ersatz aus Migros oder
     Coop, etwa Tamari statt Sojasauce) oder "contains" (das Gericht lebt von Weizen, Gerste oder Dinkel). Dazu, was auf dem
     Etikett zu prüfen ist. Wer ein eigenes Rezept als glutenfrei markiert, hat das letzte Wort. */
  var GF_SAFE = /glutenfrei|reisnudel|glasnudel|reispapier|reismehl|maismehl|maisgriess|maisstärke|maizena|maistortilla|kichererbsenmehl|buchweizen|mandelmehl|kokosmehl|kartoffelstärke|kartoffelmehl|tamari|hirse|quinoa|polenta|teffmehl|erdnussbutter|reiswaffel/g;
  var GF_HARD = /seitan|weizengriess|hartweizengriess|(?<![a-zäöü])griess|dinkel|roggen|gerste|graupen|freekeh|grünkern|zwieback|biscuit|biskuit|läckerli|leckerli|lebkuchen|guetzli|wantan|gyoza|teigblätter|strudelteig|filoteig|yufka|naan|malzbier/;
  var GF_SWAP = [
    [/sojasauce|sojasosse|shoyu/, "Tamari (glutenfreie Sojasauce)"],
    [/hoisin|austernsauce|kecap|maggi|würzsauce/, "glutenfreie Variante (Etikett prüfen)"],
    [/gnocchi/, "glutenfreie Gnocchi"],
    [/spätzli|knöpfli/, "glutenfreie Spätzli oder Teigwaren"],
    [/mie-?nudel|udon|ramen|soba|yakisoba|eiernudel|weizennudel|chow.?mein/, "Reisnudeln"],
    [/spaghetti|penne|teigwaren|pasta|nudel|hörnli|magronen|makkaroni|tagliatelle|linguine|fusilli|rigatoni|orzo|farfalle|ravioli|tortellini|lasagne|cannelloni|trofie|vermicelli|fadennudel/, "glutenfreie Teigwaren"],
    [/paniermehl|panko|semmelbrösel|(?<![a-zäöü])brösel/, "glutenfreies Paniermehl"],
    [/tortilla|wrap/, "Maistortillas"],
    [/couscous|bulgur/, "Quinoa oder Hirse"],
    [/hafermilch|haferdrink|haferrahm/, "Mandel- oder Reisdrink (oder glutenfrei markierter Haferdrink)"],
    [/haferflocken|hafer/, "glutenfreie Haferflocken"],
    [/(?<![a-zäöü])bier/, "glutenfreies Bier"],
    [/malzessig/, "Weinessig"],
    [/blätterteig|kuchenteig|pizzateig|mürbeteig|wähenteig|flammkuchenteig|teig(?!waren)/, "glutenfreier Fertigteig (Free From bei Coop, aha! bei Migros)"],
    [/brot|baguette|toast|pita|brötchen|weggli|ciabatta|zopf|brioche|croissant|bagel|burger-bun|bun(?![a-zäöü])|crouton/, "glutenfreies Brot"]
  ];
  var GF_CHECK = /bouillon|brühe|fond(?![a-zäöü])|miso|gochujang|currypaste|worcestershire|backpulver|würze|sweet.?chili/;
  var MEHL = /(?<![a-zäöü])(weiss|halbweiss|ruch|zopf|pizza|weizen|knöpfli|spätzli|dinkel)?mehl(?![a-zäöü])/;   // nicht "mehligkochend", nicht "Paniermehl"
  function glutenIn(t) {
    if (GF_HARD.test(t) || MEHL.test(t)) return true;
    for (var i = 0; i < GF_SWAP.length; i++) if (GF_SWAP[i][0].test(t)) return true;
    return false;
  }
  function glutenOf(r) {
    var out = { level: "free", swaps: [], checks: [], hits: [] };
    if (r.tags && r.tags.indexOf("glutenfree") >= 0) return out;
    (r.ingr || []).forEach(function (line) {
      var low = line.toLowerCase(), t = low.replace(GF_SAFE, " ");
      if (/glutenfrei/.test(low)) return;
      var q = splitQty(line), name = q.name.toLowerCase().replace(GF_SAFE, " ");
      /* "Reis oder Naan": eine glutenfreie Wahl steht schon da */
      if (/\soder\s/.test(t) && t.split(/\soder\s/).some(function (alt) { return !glutenIn(alt); })) return;
      var side = /zum servieren|nach belieben|zum dippen|als beilage|dazu(?![a-zäöü])/.test(t);
      if (GF_HARD.test(t)) { if (side) out.swaps.push({ line: line, tip: "weglassen oder eine glutenfreie Beilage" }); else out.hits.push(line); return; }
      if (MEHL.test(name)) {
        var m = /^(\d+(?:[.,]\d+)?)\s*(g|kg|dl|l)?/i.exec(q.qty), n = m ? Number(m[1].replace(",", ".")) : 0, u = m && m[2] ? m[2].toLowerCase() : "";
        var big = u === "kg" || u === "l" || (u === "g" && n >= 100) || (u === "dl" && n >= 1);
        if (big && !side) out.hits.push(line); else out.swaps.push({ line: line, tip: "Maizena oder glutenfreies Mehl" });
        return;
      }
      for (var i = 0; i < GF_SWAP.length; i++) if (GF_SWAP[i][0].test(t)) { out.swaps.push({ line: line, tip: GF_SWAP[i][1] }); return; }
      if (GF_CHECK.test(t)) out.checks.push(q.name.replace(/\(.*?\)/g, "").split(",")[0].trim());
    });
    out.level = out.hits.length ? "contains" : out.swaps.length ? "swap" : "free";
    return out;
  }
  var GF_LABEL = { free: "Glutenfrei", swap: "Glutenfrei mit Ersatz", contains: "Enthält Gluten" };

  /* ---------- Merkmale für Filter und Menü-Finder ---------- */
  /* Hauptzutat, Zubereitung, Schärfe, ohne Milchprodukte: aus Zutaten und Schritten abgeleitet, damit auch eigene und
     übernommene Rezepte gefunden werden. Nicht unfehlbar, aber für eine Auswahl gut genug. */
  var MAINS = [
    { id: "poulet", label: "Poulet", emoji: "🍗" }, { id: "rind", label: "Rind & Kalb", emoji: "🥩" }, { id: "schwein", label: "Schwein", emoji: "🥓" },
    { id: "lamm", label: "Lamm", emoji: "🐑" }, { id: "fisch", label: "Fisch", emoji: "🐟" }, { id: "meer", label: "Meeresfrüchte", emoji: "🦐" },
    { id: "tofu", label: "Tofu", emoji: "🧈" }, { id: "huelsen", label: "Hülsenfrüchte", emoji: "🫘" }, { id: "ei", label: "Eier", emoji: "🥚" },
    { id: "kaese", label: "Käse", emoji: "🧀" }, { id: "gemuese", label: "Gemüse", emoji: "🥦" },
    { id: "pasta", label: "Pasta & Nudeln", emoji: "🍝" }, { id: "reis", label: "Reis", emoji: "🍚" }, { id: "kartoffel", label: "Kartoffeln", emoji: "🥔" }
  ];
  var mainT = table(MAINS, "gemuese");
  var MAIN_RE = [
    ["lamm", /(?<![a-zäöü])lamm/], ["poulet", /poulet|huhn|hühner|chicken|truthahn|trute|ente(?![a-zäöü])|entenbrust/],
    ["schwein", /schwein|speck|schinken|wurst|würst|wienerli|cervelat|salsiz|chorizo|pancetta|guanciale|bacon|spareribs|salami|lardons|prosciutto|mortadella/],
    ["rind", /rind|kalb|beef|entrecôte|siedfleisch|voressen|hackfleisch|hack(?![a-zäöü])/], ["meer", /crevette|garnele|gamba|scampi|muschel|vongole|calamar|tintenfisch|krake|oktopus|jakobsmuschel/],
    ["fisch", /lachs|thon|thunfisch|kabeljau|forelle|egli|zander|dorsch|seelachs|felchen|sardine|makrele|dorade|wolfsbarsch|heilbutt|fisch(?!sauce)/],
    ["tofu", /tofu|tempeh|seitan/], ["huelsen", /linsen|kichererbse|(?<!grüne |breite )bohnen|kidney|edamame|dal(?![a-zäöü])/]
  ];
  var BASE_RE = [["pasta", /spaghetti|penne|teigwaren|pasta|nudel|hörnli|magronen|makkaroni|lasagne|gnocchi|tagliatelle|linguine|fusilli|rigatoni|orzo|ravioli|tortellini|spätzli|ramen|udon|cannelloni|trofie/],
    ["reis", /reis(?!essig|wein|papier|mehl|nudel)|risotto|basmati|jasmin/], ["kartoffel", /kartoffel|rösti|härdöpfel|süsskartoffel/]];
  var traitCache = typeof WeakMap === "function" ? new WeakMap() : null;
  function traits(r) {
    if (traitCache && traitCache.has(r)) return traitCache.get(r);
    var lines = (r.ingr || []).filter(function (l) { return !isStaple(l); }), mains = [], i;
    var heavy = lines.filter(function (l) { return !/^\s*(\d+(?:[.,]\d+)?\s*)?(el|tl|prise|msp)\b/i.test(splitQty(l).qty + " ") || /fleisch|filet|brust|schenkel/i.test(l); });
    var sweet = r.cat === "sweet";
    for (i = 0; i < heavy.length && mains.length < 2 && !sweet; i++) {
      var low = heavy[i].toLowerCase().split(/\soder\s/)[0];
      for (var k = 0; k < MAIN_RE.length; k++) if (MAIN_RE[k][1].test(low)) { if (mains.indexOf(MAIN_RE[k][0]) < 0) mains.push(MAIN_RE[k][0]); break; }   // je Zeile die erste Art
    }
    var eggs = 0, cheese = 0;
    lines.forEach(function (l) {
      var low = l.toLowerCase(), q = splitQty(l), n = parseFloat(String(q.qty).replace(",", ".")) || 0;
      if (/(^|[^a-zäöü])(eier|ei)([^a-zäöü]|$)/.test(q.name.toLowerCase())) eggs += n || 1;
      if (/käse|gruyère|raclette|mozzarella|feta|halloumi|paneer|vacherin|emmentaler|appenzeller|cheddar|ricotta|burrata/.test(low) && /\bg\b/.test(q.qty)) cheese += n;
    });
    var vegi = hasTag(r, "vegi") || !mains.some(function (m) { return ["lamm", "poulet", "schwein", "rind", "meer", "fisch"].indexOf(m) >= 0; });
    if ((!mains.length || vegi) && !sweet) {
      if (eggs >= 3 || r.emoji === "ei") mains.push("ei");
      if (cheese >= 150 || r.emoji === "kaese" || r.emoji === "fondue") mains.push("kaese");
    }
    if (!sweet) BASE_RE.forEach(function (b) { if (heavy.some(function (l) { var x = l.toLowerCase(); return b[1].test(x.split(/\soder\s/)[0]) && !/zum servieren|nach belieben/.test(x); })) mains.push(b[0]); });
    if (vegi && !sweet && r.cat !== "breakfast" && !mains.some(function (m) { return ["tofu", "huelsen", "ei", "kaese"].indexOf(m) >= 0; })) mains.push("gemuese");
    var steps = (r.steps || []).join(" ").toLowerCase(), ingr = lines.join(" ").toLowerCase();
    var methods = [];
    if (/ofen|backen|gratinier|überbacken|blech/.test(steps)) methods.push("ofen");
    if (/pfanne|wok/.test(steps)) methods.push("pfanne");
    if (!/ofen|back|brat|koch|köchel|sied|schmor|dünst|dämpf|röst|grill|pfanne|wok|erhitz|frittier|karamel|schmelz|blanchier|garen|gar /.test(steps)) methods.push("roh");
    var spicy = lines.some(function (l) { var low = l.toLowerCase(); return /chili|sambal|gochujang|harissa|sriracha|cayenne|jalape|peperoncino|currypaste|pul biber|piri|tabasco|scharf/.test(low) && !/prise|nach belieben|optional|mild|sweet.?chili|süss|senf/.test(low); });
    var plant = ingr.replace(/(kokos|hafer|soja|mandel|reis|erbsen|cashew|dinkel)[- ]?(milch|rahm|joghurt|drink)|erdnussbutter|mandelbutter|pflanzenbutter|kakaobutter|butternut|butterbohnen/g, " ");
    var df = hasTag(r, "vegan") || !/milch|rahm|butter|käse|joghurt|jogurt|quark|mascarpone|ricotta|ghee|crème fraîche|creme fraiche|sauerrahm|mozzarella|parmesan|pecorino|gruyère|feta|halloumi|paneer|labneh|schmand|sbrinz|emmentaler|raclette|vacherin|cheddar|burrata/.test(plant);
    /* Deftig oder leicht: Rahm, Käse, Speck, Butter, Teig, Frittiertes zählen; Salate und klare Suppen sind leicht. */
    var rich = 0;
    [/rahm|crème fraîche|mascarpone|sauerrahm|schmand/, /käse|gruyère|raclette|parmesan|mozzarella|emmentaler|vacherin|cheddar/, /speck|wurst|würst|bacon|pancetta|guanciale|schweinsbauch/,
      /butter(?!milch)/, /teig|paniermehl|panko/, /kartoffelstock|pommes|rösti/].forEach(function (re) { if (re.test(plant)) rich++; });
    if (/frittier|ausbacken|im öl schwimmend/.test(steps)) rich++;
    var light = rich === 0 && (r.cat === "salad" || r.cat === "soup" || mains.indexOf("gemuese") >= 0 || mains.indexOf("fisch") >= 0) || (rich <= 1 && r.cat === "salad");
    var out = { mains: mains, methods: methods, spicy: spicy, df: df, gf: glutenOf(r), rich: rich, light: light, hearty: rich >= 2 };
    if (traitCache) traitCache.set(r, out);
    return out;
  }

  /* ---------- Filter ---------- */
  /* f: { q, regions, kitchens, cats, diet ("vegi", "vegan", "gf", "gfstrict", "df"), time (höchstens Minuten), mains, methods,
     tags ("cheap", "kids", "guests", "prep"), coll, spicy ("mild" | "hot"), mood ("light" | "hearty"), src ("own" | "book"), sort }.
     Innerhalb einer Gruppe genügt eines (Poulet oder Fisch), zwischen den Gruppen gilt alles (Poulet und schnell). */
  var DIETS = [{ id: "vegi", label: "Vegi", emoji: "🥦" }, { id: "vegan", label: "Vegan", emoji: "🌱" }, { id: "gf", label: "Glutenfrei", emoji: "🌾" },
    { id: "gfstrict", label: "Glutenfrei ohne Ersatz", emoji: "🌾" }, { id: "df", label: "Ohne Milchprodukte", emoji: "🥛" }];
  var METHODS = [{ id: "ofen", label: "Aus dem Ofen", emoji: "🔥" }, { id: "pfanne", label: "Pfanne & Wok", emoji: "🍳" }, { id: "roh", label: "Ohne Herd", emoji: "🥗" }];
  var TIMES = [15, 30, 45, 60];
  var SORTS = [["match", "Passend"], ["time", "Schnellste zuerst"], ["rating", "Beliebteste"], ["az", "A–Z"]];
  function emptyFilter() { return { q: "", regions: [], kitchens: [], cats: [], diet: [], time: 0, mains: [], methods: [], tags: [], coll: "", spicy: "", mood: "", src: "", sort: "match" }; }
  function filterCount(f) {
    if (!f) return 0;
    return ["regions", "kitchens", "cats", "diet", "mains", "methods", "tags"].reduce(function (n, k) { return n + ((f[k] || []).length); }, 0) +
      (f.time ? 1 : 0) + (f.coll ? 1 : 0) + (f.spicy ? 1 : 0) + (f.mood ? 1 : 0) + (f.src ? 1 : 0);
  }
  function anyOf(list, test) { return !list || !list.length || list.some(test); }
  function dietOk(r, d, t) {
    if (d === "vegi") return hasTag(r, "vegi");
    if (d === "vegan") return hasTag(r, "vegan");
    if (d === "gf") return r.tags.indexOf("glutenfree") >= 0 || t.gf.level !== "contains";
    if (d === "gfstrict") return r.tags.indexOf("glutenfree") >= 0 || t.gf.level === "free";
    if (d === "df") return t.df;
    return true;
  }
  function recipeFits(r, f) {
    var t = traits(r);
    if (f.src === "own" && r.idea) return false;
    if (f.src === "book" && !r.idea) return false;
    if (f.coll && (r.coll || []).indexOf(f.coll) < 0) return false;
    if (f.kitchens && f.kitchens.length) { if (f.kitchens.indexOf(r.kitchen) < 0) return false; }
    else if (!anyOf(f.regions, function (g) { return r.kitchen && kitT.get(r.kitchen).region === g; })) return false;
    if (!anyOf(f.cats, function (c) { return r.cat === c; })) return false;
    if (!(f.diet || []).every(function (d) { return dietOk(r, d, t); })) return false;
    if (f.time && !(r.time > 0 && r.time <= f.time)) return false;
    if (!anyOf(f.mains, function (m) { return t.mains.indexOf(m) >= 0; })) return false;
    if (!anyOf(f.methods, function (m) { return t.methods.indexOf(m) >= 0; })) return false;
    if (!(f.tags || []).every(function (g) { return hasTag(r, g); })) return false;
    if (f.spicy === "hot" && !t.spicy) return false;
    if (f.spicy === "mild" && t.spicy) return false;
    if (f.mood === "light" && !t.light) return false;
    if (f.mood === "hearty" && !t.hearty) return false;
    return true;
  }
  function liked(r) { var s = noteSummary(r); return (s.top * 2 + s.ok) - s.flop * 3 + (r.fav ? 2 : 0) + Math.min(r.n || 0, 5) * 0.3; }
  function filterRecipes(list, f) {
    var words = searchWords(f.q), out = [];
    (list || []).forEach(function (r) {
      if (!recipeFits(r, f)) return;
      var m = recipeMatch(r, words);
      if (words.length && !m.score) return;
      out.push({ r: r, hits: m.hits, score: m.score });
    });
    var by = f.sort || "match";
    out.sort(function (a, b) {
      if (by === "time") return (a.r.time || 999) - (b.r.time || 999) || a.r.title.localeCompare(b.r.title, "de");
      if (by === "az") return a.r.title.localeCompare(b.r.title, "de");
      if (by === "rating") return liked(b.r) - liked(a.r) || a.r.title.localeCompare(b.r.title, "de");
      return b.score - a.score || (a.r.idea ? 1 : 0) - (b.r.idea ? 1 : 0) || liked(b.r) - liked(a.r) || a.r.title.localeCompare(b.r.title, "de");
    });
    return out;
  }

  /* ---------- Kühlschrank: was noch da ist ---------- */
  /* Eine Zutat aus dem Kühlschrank passt zu einer Rezeptzeile, wenn ihr Wortstamm darin steckt ("Zucchetti" zu
     "2 Zucchetti, in Scheiben", "Poulet" zu "Pouletschenkel") oder über einen Oberbegriff ("Käse" zu "Gruyère",
     "Pasta" zu "Penne"). Ganz kurze Wörter ("Ei") nur als ganzes Wort, nie in "Reis". */
  var FRIDGE_SYN = {
    "käse": "gruyère|emmentaler|appenzeller|sbrinz|parmesan|pecorino|mozzarella|raclette|vacherin|cheddar|tilsiter|reibkäse|bergkäse|feta|halloumi|ricotta|mascarpone|burrata|gorgonzola|ziegenkäse",
    "pasta": "spaghetti|penne|teigwaren|hörnli|nudel|fusilli|tagliatelle|linguine|magronen|makkaroni|rigatoni|farfalle|orzo|lasagne|trofie|tortellini|ravioli",
    "teigwaren": "spaghetti|penne|pasta|hörnli|nudel|fusilli|tagliatelle|linguine|magronen|makkaroni|rigatoni|farfalle|orzo|lasagne|trofie",
    "nudeln": "spaghetti|penne|pasta|teigwaren|nudel|mie|udon|ramen|reisnudel|glasnudel",
    "reis": "reis(?!essig|wein|papier|mehl|nudel)|basmati|jasmin|risotto|sushireis|klebreis",
    "rahm": "rahm|sahne|crème fraîche|creme fraiche", "sahne": "rahm",
    "hackfleisch": "hackfleisch|hack(?![a-zäöü])|ghackets|rindshack|lammhack|schweinshack", "hack": "hackfleisch|hack(?![a-zäöü])|ghackets",
    "fleisch": "fleisch|poulet|rind|kalb|schwein|lamm|hack|geschnetzeltes|plätzli|steak",
    "poulet": "poulet|huhn|hühner|chicken|hähnchen", "huhn": "poulet|huhn|chicken",
    "fisch": "fisch(?!sauce)|lachs|thon|thunfisch|kabeljau|forelle|egli|zander|dorsch|seelachs|dorade",
    "thunfisch": "thon|thunfisch", "thon": "thon|thunfisch",
    "crevetten": "crevette|garnele|gamba|scampi", "garnelen": "crevette|garnele|gamba|scampi",
    "pilze": "pilz|champignon|shiitake|steinpilz|austernpilz|kräuterseitling", "champignons": "champignon|pilz",
    "joghurt": "joghurt|jogurt", "speck": "speck|bacon|pancetta|guanciale|lardons",
    "wurst": "wurst|würst|wienerli|cervelat|chorizo|salsiz|bratwurst|merguez",
    "kartoffeln": "kartoffel|härdöpfel", "kartoffel": "kartoffel|härdöpfel", "tomaten": "tomate|passata|pelati",
    "peperoni": "peperoni|paprikaschote", "paprika": "peperoni", "eier": "ei|eier|eigelb|eiweiss", "ei": "ei|eier|eigelb|eiweiss",
    "brot": "brot|baguette|toast|ciabatta|zopf|brötchen|pita|fladen", "salat": "salat|lattich|rucola|nüsslisalat|eisberg|kopfsalat",
    "zwiebeln": "zwiebel|schalotte", "kräuter": "basilikum|petersilie|peterli|schnittlauch|koriander|dill|minze|thymian|rosmarin|salbei|kräuter",
    "bohnen": "bohnen|kidney|borlotti", "linsen": "linsen", "tofu": "tofu", "spinat": "spinat", "zucchini": "zucchetti|zucchini", "zucchetti": "zucchetti|zucchini",
    "karotten": "rüebli|karotte", "möhren": "rüebli|karotte", "rüebli": "rüebli|karotte"
  };
  /* Was fast immer im Haus ist; zählt nicht als fehlend, wenn "Grundvorrat ist da" gilt. */
  var BASIC = /(^|[^a-zäöü])(zwiebel|knoblauch|senf|honig|tomatenpüree|tomatenmark|sojasauce|maizena|backpulver|zimt|lorbeer|currypulver|curry(?![a-zäöü])|paprikapulver|chiliflocken|oregano|muskat|kreuzkümmel|kurkuma|cayenne|getrocknet|wasser|eis(?![a-zäöü])|eiswürfel|vanillezucker|puderzucker|rohzucker|brauner zucker|rapsöl|sonnenblumenöl|sesamöl|balsamico|weissweinessig|rotweinessig|apfelessig|reisessig)/;
  var FRIDGE_COMMON = ["Eier", "Poulet", "Hackfleisch", "Lachs", "Tofu", "Speck", "Reis", "Pasta", "Kartoffeln", "Brot", "Tomaten", "Zucchetti", "Peperoni", "Spinat", "Brokkoli",
    "Pilze", "Rüebli", "Lauch", "Kürbis", "Aubergine", "Käse", "Feta", "Mozzarella", "Rahm", "Joghurt", "Kichererbsen", "Linsen", "Kokosmilch", "Zitrone", "Äpfel"];
  function fridgeItem(text) {
    var label = String(text || "").trim().replace(/\s+/g, " ").slice(0, 40), low = label.toLowerCase();
    if (!low) return null;
    var syn = FRIDGE_SYN[low], stem = low;
    if (!syn) {
      stem = low.replace(/(en|ern|n|e|s)$/, "");
      if (stem.length < 4) stem = low;
      syn = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    var short = low.length < 4 && !FRIDGE_SYN[low];
    var re = new RegExp(short ? "(^|[^a-zäöü])" + syn + "(n|en|er)?([^a-zäöü]|$)" : "(^|[^a-zäöü]|)(" + syn + ")");
    if (FRIDGE_SYN[low] && /^(ei|eier)$/.test(low)) re = /(^|[^a-zäöü])(ei|eier|eigelb|eiweiss)([^a-zäöü]|$)/;
    return { label: label, test: function (line) { return re.test(String(line).toLowerCase()); } };
  }
  function fridgeLines(r, basics) {
    return (r.ingr || []).filter(function (l) {
      if (isStaple(l)) return false;
      var name = splitQty(l).name.toLowerCase();
      if (/zum servieren|nach belieben|zum garnieren|optional|zum bestreuen/.test(name)) return false;
      return !(basics && BASIC.test(name.split(",")[0]));
    });
  }
  /* have: Zeilen, die der Kühlschrank deckt; missing: was noch fehlt; used: welche Zutaten aus dem Kühlschrank vorkommen. */
  /* Frische Kräuter sind meist zum Garnieren: Sie fehlen nicht wirklich, sie stehen unter "soft". */
  var HERBS = /^(glattblättrige |krause |frische |gehackte )?(petersilie|peterli|koriander|schnittlauch|basilikum|minze|dill|kerbel|thai-basilikum)/;
  function fridgeMatch(r, items, basics) {
    var lines = fridgeLines(r, basics !== false), have = [], missing = [], soft = [], used = [];
    lines.forEach(function (l) {
      var name = splitQty(l).name, hit = null;
      for (var i = 0; i < items.length; i++) if (items[i].test(name)) { hit = items[i]; break; }
      if (hit) { have.push(l); if (used.indexOf(hit.label) < 0) used.push(hit.label); }
      else if (HERBS.test(name.toLowerCase())) soft.push(l);
      else missing.push(l);
    });
    return { have: have, missing: missing, soft: soft, used: used, total: have.length + missing.length };
  }
  /* Rezepte, die möglichst viel vom Vorhandenen verwerten und möglichst wenig Einkauf brauchen. o: { basics, diet, cats, time } */
  function fridgeSuggest(pool, texts, o) {
    o = o || {};
    var items = (texts || []).map(fridgeItem).filter(Boolean), out = [];
    if (!items.length) return out;
    var f = Object.assign(emptyFilter(), { diet: o.diet || [], cats: o.cats || [], time: o.time || 0 });
    (pool || []).forEach(function (r) {
      if (noteSummary(r).mood === "flop" || !recipeFits(r, f)) return;
      var m = fridgeMatch(r, items, o.basics);
      if (!m.used.length || !m.total) return;
      var score = m.used.length * 3 + (m.have.length / m.total) * 4 - m.missing.length * 1.3 + liked(r) * 0.3;
      out.push({ r: r, have: m.have, missing: m.missing, soft: m.soft, used: m.used, score: score, group: m.missing.length === 0 ? 0 : m.missing.length <= 2 ? 1 : 2 });
    });
    out.sort(function (a, b) { return a.group - b.group || b.score - a.score || a.r.title.localeCompare(b.r.title, "de"); });
    return out;
  }

  /* ---------- Menü-Finder ---------- */
  /* p: { time, regions, kitchens, coll, mains, diet, mood ("light" | "hearty"), spicy, guests, kids, fridge, cats }.
     Was nicht passt, fällt weg; der Rest bekommt Punkte: Zutaten aus dem Kühlschrank, Bewertungen und Ähnlichkeit mit
     dem, was euch geschmeckt hat, Abwechslung (zuletzt Gekochtes und schon Eingeplantes rutscht nach hinten).
     h: { today, planned: [Rezept-Kennungen der nächsten Tage] }. Ergebnis mit Begründung. seed mischt Gleichstände. */
  function suggest(pool, p, h, seed) {
    p = p || {}; h = h || {};
    var now = h.today || today(), planned = h.planned || [];
    var items = String(p.fridge || "").split(/[,;\n]+/).map(fridgeItem).filter(Boolean);
    var loved = (pool || []).filter(function (r) { var s = noteSummary(r); return s.mood === "top" || r.fav; });
    var lovedK = {}, lovedM = {}, lovedC = {};
    loved.forEach(function (r) { var t = traits(r); if (r.kitchen) lovedK[r.kitchen] = 1; t.mains.forEach(function (m) { lovedM[m] = 1; }); (r.coll || []).forEach(function (c) { lovedC[c] = 1; }); });
    var cats = p.cats && p.cats.length ? p.cats : ["main"];
    var f = { regions: p.regions || [], kitchens: p.kitchens || [], coll: p.coll || "", cats: cats, diet: p.diet || [], time: 0, mains: p.mains || [], methods: [], tags: [], spicy: p.spicy || "", mood: "" };
    var out = [];
    (pool || []).forEach(function (r) {
      if (noteSummary(r).mood === "flop") return;
      if (!recipeFits(r, f)) return;
      var t = traits(r), sc = 0, why = [];
      if (p.time) { if (r.time > p.time) return; if (!r.time) sc -= 2; else { sc += 1.5 * (1 - r.time / p.time); why.push(r.time + " Min."); } }
      if (items.length) {
        var fm = fridgeMatch(r, items, true);
        if (!fm.used.length) sc -= 1;
        else { sc += fm.used.length * 3 - fm.missing.length * 0.4; why.push("mit " + fm.used.join(", ")); }
      }
      if (p.mood === "light") { if (t.light) { sc += 2; why.push("leicht"); } else if (t.hearty) sc -= 2; }
      if (p.mood === "hearty") { if (t.hearty) { sc += 2; why.push("deftig"); } else if (t.light) sc -= 1; }
      if (p.guests) { if (hasTag(r, "guests")) { sc += 2.5; why.push("für Gäste"); } }
      if (p.kids) { if (hasTag(r, "kids")) { sc += 2.5; why.push("Kinderliebling"); } if (t.spicy) sc -= 2; }
      var s = noteSummary(r);
      if (s.top) { sc += 3; why.push("euch hat es geschmeckt"); } else if (s.ok) sc += 0.5;
      if (r.fav) { sc += 2; why.push("Favorit"); }
      if (!s.top && !r.fav && loved.length) {
        var like = (r.kitchen && lovedK[r.kitchen] ? 1 : 0) + (r.coll || []).filter(function (c) { return lovedC[c]; }).length * 1.5 + t.mains.filter(function (x) { return lovedM[x]; }).length * 0.5;
        if (like >= 1.5) { sc += Math.min(2.5, like); why.push("ähnlich wie eure Favoriten"); }
      }
      if (r.last) { var d = dayDiff(r.last, now); if (d <= 7) sc -= 4; else if (d <= 14) sc -= 2; else if (d <= 21) sc -= 0.5; }
      if (planned.indexOf(r.id) >= 0) sc -= 5;
      if ((p.diet || []).indexOf("gf") >= 0) why.push(t.gf.level === "swap" ? "glutenfrei mit Ersatz" : "glutenfrei");
      sc += ((hash(r.id + "|" + (seed || now)) % 1000) / 1000) * 1.2;          // Abwechslung bei Gleichstand
      out.push({ r: r, score: sc, why: why });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out;
  }
  /* Ein ganzes Menü: zum Hauptgang eine Vorspeise (Suppe, Salat oder Apéro) und ein Dessert, möglichst aus derselben
     Weltgegend; zu einem deftigen Hauptgang eine leichte Vorspeise. */
  function menuFor(pool, main, p, h, seed) {
    var region = main.kitchen ? kitT.get(main.kitchen).region : "", hearty = traits(main).hearty;
    var base = { diet: p.diet || [], kids: p.kids, guests: p.guests, fridge: p.fridge };
    function pick(cats, mood) {
      var near = suggest(pool, Object.assign({}, base, { cats: cats, regions: region ? [region] : [], mood: mood }), h, seed);
      if (!near.length) near = suggest(pool, Object.assign({}, base, { cats: cats, mood: mood }), h, seed);
      return near.length ? near[0].r : null;
    }
    return { starter: pick(["soup", "salad", "snack"], hearty ? "light" : ""), main: main, dessert: pick(["sweet"], hearty ? "light" : "") };
  }

  /* Grundvorrat, den man fast immer zu Hause hat: wird beim Übertragen auf die Einkaufsliste zuerst abgewählt. */
  var STAPLE = /^(salz|pfeffer|salz,? pfeffer.*|muskat|zucker|mehl|öl|olivenöl|rapsöl|bratbutter|essig|wasser|oregano|paprikapulver|kreuzkümmel|backpulver|zimt|chilipulver|bouillon|gemüsebouillon)$/i;
  function isStaple(line) {
    var n = splitQty(line).name.replace(/\(.*?\)/g, "").replace(/,.*$/, "").replace(/\s+(zum|für|nach|oder)\s.*$/i, "").trim();
    return STAPLE.test(n) || /^salz\b/i.test(n) || /(^|\s)wasser$/i.test(n);
  }
  /* Eine Zutat auf andere Portionen umrechnen: "200 g Spaghetti" mal 1.5 ergibt "300 g Spaghetti". Was keine Zahl am Anfang hat, bleibt. */
  var FRAC = { "½": 0.5, "¼": 0.25, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3 };
  function qtyNum(t) {
    if (FRAC[t] !== undefined) return FRAC[t];
    var f = /^(\d+)\/(\d+)$/.exec(t);
    if (f) return +f[2] ? +f[1] / +f[2] : null;
    var v = Number(t.replace(",", "."));
    return isFinite(v) ? v : null;
  }
  function qtyText(v) {
    if (v >= 10) return String(Math.round(v));
    var q = Math.round(v * 4) / 4, whole = Math.floor(q), part = q - whole;
    if (Math.abs(v - q) < 0.04 && q > 0) return (whole ? String(whole) : "") + (part === 0.25 ? "¼" : part === 0.5 ? "½" : part === 0.75 ? "¾" : "") || "0";
    return String(Math.round(v * 10) / 10);
  }
  function scaleLine(line, factor) {
    var s = String(line || "");
    if (!(factor > 0) || Math.abs(factor - 1) < 1e-9) return s;
    var m = /^(\d+\/\d+|\d+(?:[.,]\d+)?|[½¼¾⅓⅔])(?:\s*([-–])\s*(\d+(?:[.,]\d+)?))?/.exec(s);
    if (!m) return s;
    var a = qtyNum(m[1]), rest = s.slice(m[0].length);
    if (a == null) return s;
    /* Stückzahlen ohne Einheit ("3 Eier", "2 Zwiebeln") bleiben ab eins ganz. */
    var whole = !new RegExp("^\\s*" + UNIT + "(?![a-zäöüß])", "i").test(rest);
    var fmt = function (v) { return whole && v >= 1 ? String(Math.max(1, Math.round(v))) : qtyText(v); };
    var out = fmt(a * factor);
    if (m[3]) { var b = qtyNum(m[3]); if (b != null) out += m[2] + fmt(b * factor); }
    return out + rest;
  }
  /* "Was ist im Kühlschrank?": Wörter ab drei Buchstaben, getrennt durch Komma oder Leerschlag. Treffer zählen in Titel,
     Zutaten und Merkmalen; das Ergebnis nennt, welche Wörter passen. */
  function searchWords(q) {
    var seen = Object.create(null);
    return String(q || "").toLowerCase().split(/[\s,;+]+/).filter(function (w) { return w.length >= 3 && !seen[w] && (seen[w] = 1); }).slice(0, 12);
  }
  function recipeMatch(r, words) {
    if (!words.length) return { score: 1, hits: [] };
    var hay = (r.title + " " + r.ingr.join(" ") + " " + r.tags.map(function (t) { return tagT.get(t).label; }).join(" ")).toLowerCase(), hits = [];
    words.forEach(function (w) { if (hay.indexOf(w) >= 0) hits.push(w); });
    return { score: hits.length, hits: hits };
  }
  /* ---------- Kochmodus ---------- */
  /* Zeitangaben in einem Arbeitsschritt: "10 Minuten", "5 bis 8 Min.", "1½ Stunden", "eine halbe Stunde", "Viertelstunde".
     Ergebnis: [{ secs, label }], bei einer Spanne mit der kürzeren Zeit (lieber einmal zu früh nachschauen). */
  var WORDNUM = { ein: 1, eine: 1, einen: 1, einem: 1, einer: 1, zwei: 2, drei: 3, vier: 4, "fünf": 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, "zwölf": 12,
    "fünfzehn": 15, zwanzig: 20, dreissig: 30, "dreißig": 30, vierzig: 40, "fünfzig": 50, sechzig: 60 };
  var DNUM = "(\\d+(?:[.,]\\d+)?\\s*[½¼¾]?|[½¼¾]|" + Object.keys(WORDNUM).sort(function (a, b) { return b.length - a.length; }).join("|") + ")";
  var DUR = new RegExp(DNUM + "(?:\\s*(?:bis|-|–|oder)\\s*" + DNUM + ")?\\s*(stunden|stunde|std\\.?|h|minuten|minute|min\\.?|sekunden|sekunde|sek\\.?)(?![a-zäöü])", "gi");
  function durNum(t) {
    t = t.toLowerCase().trim();
    if (WORDNUM[t] !== undefined) return WORDNUM[t];
    var frac = 0, m = /([½¼¾])$/.exec(t);
    if (m) { frac = FRAC[m[1]]; t = t.slice(0, -1).trim(); }
    var v = t ? Number(t.replace(",", ".")) : 0;
    return isFinite(v) ? v + frac : null;
  }
  function durations(text) {
    var s = String(text || ""), out = [], seen = Object.create(null), m;
    if (/viertelstunde/i.test(s)) out.push({ secs: 900, label: "15 Min." });
    if (/halbe[n]?\s+stunde/i.test(s)) out.push({ secs: 1800, label: "30 Min." });
    DUR.lastIndex = 0;
    while ((m = DUR.exec(s))) {
      var a = durNum(m[1]), unit = m[3].toLowerCase(), f = /^(st|h)/.test(unit) ? 3600 : /^s/.test(unit) ? 1 : 60;
      if (!(a > 0)) continue;
      var secs = Math.round(a * f);
      if (secs > 48 * 3600 || seen[secs]) continue;
      seen[secs] = 1;
      out.push({ secs: secs, label: secsLabel(secs) });
    }
    return out.slice(0, 4);
  }
  function secsLabel(secs) {
    if (secs < 60) return secs + " Sek.";
    if (secs < 3600) return Math.round(secs / 60) + " Min.";
    var h = Math.floor(secs / 3600), mm = Math.round((secs % 3600) / 60);
    return h + " Std." + (mm ? " " + mm + " Min." : "");
  }
  /* Welche Zutaten kommen in einem Schritt vor? Verglichen werden die Hauptwörter der Zutat (gross geschrieben) mit den
     Wörtern des Schritts, über die ersten fünf Buchstaben: "Knoblauchzehen" passt zu "Knoblauch", "Zwiebeln" zu "Zwiebel". */
  function nounsOf(line) {
    var n = splitQty(line).name.replace(/\(.*?\)/g, " ").split(",")[0];
    return n.replace(/['’]/g, "").split(/[\s/-]+/).filter(function (w) { return /^[A-ZÄÖÜ][a-zäöüßèéàâêç]{2,}/.test(w) || SHORT[w.toLowerCase()]; }).map(function (w) { return w.toLowerCase(); });
  }
  /* Zu kurz für den Vergleich über fünf Buchstaben: "Ei" passt zu "Ei", "Eier", "Spiegeleier", nie zu "ein"; "Öl" zu "Olivenöl". */
  var SHORT = { ei: /^(ei|eiern|[a-zäöü]*eier)$/, "öl": /öl$/ };
  function stepIngredients(step, lines) {
    var all = String(step || "").toLowerCase().replace(/['’]/g, "").split(/[^a-zäöüßèéàâêç]+/), words = all.filter(function (w) { return w.length >= 4; });
    var out = [];
    (lines || []).forEach(function (line, i) {
      var hit = nounsOf(line).some(function (n) {
        if (SHORT[n]) return all.some(function (w) { return SHORT[n].test(w); });
        var a = n.slice(0, 5);
        /* auch Kurzformen zusammengesetzter Wörter: «Magronen» für «Älplermagronen», «Tomaten» für «Cherrytomaten» */
        return words.some(function (w) { return w.slice(0, 5) === a || (n.length >= 5 && w.indexOf(n) === 0) || (w.length >= 5 && n.length > w.length && n.slice(-w.length) === w); });
      });
      if (hit) out.push(i);
    });
    return out;
  }

  /* ---------- Läden ---------- */
  /* Typische Reihenfolge der Abteilungen, vom Eingang zur Kasse. Jede Filiale ist anders: Der Haushalt kann sie anpassen. */
  var STORES = [
    { id: "migros", label: "Migros", search: "https://www.migros.ch/de/search?query=",
      order: ["produce", "bakery", "dairy", "meat", "pantry", "sweets", "drinks", "frozen", "care", "clean", "other"] },
    { id: "coop", label: "Coop", search: "https://www.coop.ch/de/search/?text=",
      order: ["produce", "bakery", "meat", "dairy", "frozen", "pantry", "sweets", "drinks", "care", "clean", "other"] }
  ];
  function storeOf(id) { return STORES.filter(function (x) { return x.id === id; })[0] || null; }
  /* Reihenfolge der Abteilungen für einen Laden: die gespeicherte des Haushalts, ergänzt um neue Abteilungen. */
  function aisleOrder(home, store) {
    var st = storeOf(store), saved = home && home.aisles && Array.isArray(home.aisles[store]) ? home.aisles[store] : null;
    var base = (saved || (st ? st.order : SHOP.map(function (x) { return x.id; }))).filter(function (id) { return shopT.has(id); });
    var out = [];
    base.concat(SHOP.map(function (x) { return x.id; })).forEach(function (id) { if (out.indexOf(id) < 0) out.push(id); });
    return out;
  }

  /* Die eingebauten Kochideen stehen in ideen.js. Sie werden einmal gelesen und wie gespeicherte Rezepte geprüft. */
  var ideaCache = null;
  function ideas() {
    if (!ideaCache) {
      var raw = Array.isArray(window.HP_IDEEN) ? window.HP_IDEEN : [], seen = Object.create(null);
      ideaCache = raw.map(function (x) { return x && okId(x.id) && !seen[x.id] && (seen[x.id] = 1) ? normRecipe(x.id, x) : null; }).filter(Boolean);
      ideaCache.forEach(function (r) { r.idea = true; });
    }
    return ideaCache;
  }
  function idea(id) { return ideas().filter(function (r) { return r.id === id; })[0] || null; }

  /* ---------- Gespeicherte Dokumente lesen ---------- */
  /* Der Speicher ist geteilt: jedes Feld prüfen, bevor damit gerechnet oder es angezeigt wird. Unbrauchbares ergibt null. */
  function text(v, max) { return typeof v === "string" ? v.slice(0, max) : ""; }
  /* Kennungen von Personen: nur schlichte Zeichen und nie der Name einer eingebauten Eigenschaft wie "__proto__" oder "constructor".
     Sie dienen überall als Schlüssel in Tabellen; eine präparierte Kennung dürfte sonst die Rechnung durcheinanderbringen. */
  function okId(v) { return typeof v === "string" && /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/.test(v) && !(v in Object.prototype); }
  function idList(v) { return Array.isArray(v) ? v.slice(0, 400).filter(okId) : []; }
  function posNum(v) { return typeof v === "number" && isFinite(v) && v > 0; }
  function num0(v) { return typeof v === "number" && isFinite(v) ? v : 0; }
  function intIn(v, lo, hi, fallback) { return typeof v === "number" && isFinite(v) && Math.round(v) >= lo && Math.round(v) <= hi ? Math.round(v) : fallback; }
  function normHome(id, d) {
    if (!d || typeof d !== "object" || typeof d.name !== "string" || typeof d.base !== "string" || !/^[A-Z]{3}$/.test(d.base)) return null;
    var members = {}, rates = {}, k, m;
    if (d.members && typeof d.members === "object") for (k in d.members) {
      m = d.members[k];
      if (m && typeof m === "object" && okId(k)) members[k] = { name: text(m.name, 60).trim() || "?", c: Math.abs(Math.round(num0(m.c))) % 1000, o: num0(m.o), gone: !!m.gone, a: isAvatar(m.a) ? m.a : "" };
    }
    if (d.rates && typeof d.rates === "object") for (k in d.rates) if (okRate(d.rates[k]) && /^[A-Z]{3}$/.test(k)) rates[k] = d.rates[k];
    var aisles = {};
    if (d.aisles && typeof d.aisles === "object") STORES.forEach(function (st) {
      var a = d.aisles[st.id];
      if (Array.isArray(a)) aisles[st.id] = a.filter(function (x) { return shopT.has(x); }).slice(0, 20);
    });
    return { id: id, name: text(d.name, 80).trim() || "Haushalt", base: d.base, rates: rates, members: members, created: num0(d.created),
      store: storeOf(d.store) ? d.store : "", aisles: aisles, calV: intIn(d.calV, 0, 9999999, 0), gf: d.gf === true, push: num0(d.push),
      fridge: (Array.isArray(d.fridge) ? d.fridge : []).filter(function (x) { return typeof x === "string" && x.trim(); }).map(function (x) { return x.trim().slice(0, 40); })
        .filter(function (x, i, a) { return a.map(function (y) { return y.toLowerCase(); }).indexOf(x.toLowerCase()) === i; }).slice(0, 60) };
  }
  function normExpense(id, d) {
    if (!d || typeof d !== "object" || !posNum(d.amount) || typeof d.cur !== "string" || !/^[A-Z]{3}$/.test(d.cur)) return null;
    if (!(Math.round(d.amount) >= 1 && d.amount <= MAX_MINOR)) return null;
    if (!okId(d.payer)) return null;
    var e = { id: id, kind: d.kind === "transfer" ? "transfer" : "expense", title: text(d.title, 120), amount: Math.round(d.amount), cur: d.cur,
      rate: okRate(d.rate) ? d.rate : null, rateAuto: d.rateAuto === true, rateDate: validDate(d.rateDate) ? d.rateDate : "",
      date: validDate(d.date) ? d.date : "", cat: isCat(d.cat) ? d.cat : "other", payer: d.payer,
      by: okId(d.by) ? d.by : null, ts: num0(d.ts), up: num0(d.up) };
    if (e.kind === "transfer") { if (!okId(d.to)) return null; e.to = d.to; e.settles = typeof d.settles === "string" && /^\d{4}-\d{2}(:shop)?$/.test(d.settles) ? d.settles : ""; return e; }
    e.mode = ["equal", "shares", "exact", "items"].indexOf(d.mode) >= 0 ? d.mode : "equal";
    e.for = idList(d.for);
    if (e.mode === "shares" || e.mode === "exact") {
      e.weights = {};
      if (d.weights && typeof d.weights === "object") for (var k in d.weights) if (okId(k) && posNum(d.weights[k]) && d.weights[k] <= MAX_MINOR) e.weights[k] = d.weights[k];
    }
    if (e.mode === "items") e.items = (Array.isArray(d.items) ? d.items : []).filter(function (it) { return it && typeof it === "object"; }).slice(0, 80).map(function (it) {
      return { name: text(it.name, 80), amount: typeof it.amount === "number" && isFinite(it.amount) && Math.abs(it.amount) <= MAX_MINOR ? Math.round(it.amount) : 0, for: idList(it.for) };
    });
    return e;
  }
  function normItem(id, d) {
    if (!d || typeof d !== "object") return null;
    var name = text(d.name, 80).trim();
    if (!name) return null;
    return { id: id, name: name, qty: text(d.qty, 30).trim(), sec: shopT.has(d.sec) ? d.sec : "other", note: text(d.note, 200).trim(), done: d.done === true,
      by: okId(d.by) ? d.by : null, doneBy: okId(d.doneBy) ? d.doneBy : null, ts: num0(d.ts), doneAt: num0(d.doneAt), up: num0(d.up) };
  }
  function normEvent(id, d) {
    if (!d || typeof d !== "object" || !validDate(d.date)) return null;
    var title = text(d.title, 100).trim();
    if (!title) return null;
    var e = { id: id, title: title, date: d.date, end: validDate(d.end) && d.end > d.date && dayDiff(d.date, d.end) <= 366 ? d.end : "",
      time: validTime(d.time) ? d.time : "", endTime: "", repeat: isRepeat(d.repeat) ? d.repeat : "none", until: "",
      cat: evT.has(d.cat) ? d.cat : "other", who: idList(d.who).slice(0, 40), note: text(d.note, 1000), by: okId(d.by) ? d.by : null, ts: num0(d.ts), up: num0(d.up) };
    if (e.time && validTime(d.endTime) && (e.end || d.endTime > e.time)) e.endTime = d.endTime;
    if (e.repeat !== "none" && validDate(d.until) && d.until >= d.date) e.until = d.until;
    e.skip = e.repeat !== "none" && Array.isArray(d.skip) ? d.skip.filter(validDate).slice(0, 200) : [];
    e.rid = okId(d.rid) ? d.rid : null;                               // ein Essen im Wochenplan: welches Rezept
    return e;
  }
  function normPlant(id, d) {
    if (!d || typeof d !== "object") return null;
    var name = text(d.name, 60).trim();
    if (!name) return null;
    var log = (Array.isArray(d.log) ? d.log : []).filter(function (x) { return x && typeof x === "object" && validDate(x.d); }).slice(0, 30)
      .map(function (x) { return { d: x.d, by: okId(x.by) ? x.by : null, k: x.k === "f" ? "f" : "w" }; });
    return { id: id, name: name, emoji: isPlantEmoji(d.emoji) ? d.emoji : "topf", room: text(d.room, 40).trim(), every: intIn(d.every, 1, 365, 7),
      last: validDate(d.last) ? d.last : "", lastBy: okId(d.lastBy) ? d.lastBy : null, feedEvery: intIn(d.feedEvery, 0, 365, 0), fed: validDate(d.fed) ? d.fed : "",
      who: okId(d.who) ? d.who : null, note: text(d.note, 500), log: log, ts: num0(d.ts), up: num0(d.up) };
  }
  function normRecipe(id, d) {
    if (!d || typeof d !== "object") return null;
    var title = text(d.title, 80).trim();
    if (!title) return null;
    var tags = [];
    (Array.isArray(d.tags) ? d.tags : []).forEach(function (t) { if (tagT.has(t) && tags.indexOf(t) < 0) tags.push(t); });
    var lines = function (v, max, len) { return (Array.isArray(v) ? v : []).filter(function (x) { return typeof x === "string"; }).map(function (x) { return x.slice(0, len).trim(); }).filter(Boolean).slice(0, max); };
    return { id: id, title: title, emoji: isDish(d.emoji) ? d.emoji : "teller", cat: recT.has(d.cat) ? d.cat : "main", tags: tags,
      time: intIn(d.time, 0, 1440, 0), serves: intIn(d.serves, 1, 50, 4), ingr: lines(d.ingr, 60, 120), steps: lines(d.steps, 40, 600),
      notes: normNotes(d.notes), kitchen: kitT.has(d.kitchen) ? d.kitchen : "", coll: (Array.isArray(d.coll) ? d.coll : []).filter(function (c, i, a) { return collT.has(c) && a.indexOf(c) === i; }),
      link: okUrl(d.link) ? d.link : "", note: text(d.note, 2000), fav: d.fav === true, last: validDate(d.last) ? d.last : "", n: intIn(d.n, 0, 100000, 0),
      by: okId(d.by) ? d.by : null, ts: num0(d.ts), up: num0(d.up) };
  }
  function normInfo(id, d) {
    if (!d || typeof d !== "object") return null;
    var title = text(d.title, 80).trim();
    if (!title) return null;
    var fields = (Array.isArray(d.fields) ? d.fields : []).filter(function (f) { return f && typeof f === "object"; }).slice(0, 40)
      .map(function (f) { return { k: text(f.k, 40).trim(), v: text(f.v, 500) }; }).filter(function (f) { return f.k || f.v.trim(); });
    var links = (Array.isArray(d.links) ? d.links : []).filter(function (l) { return l && typeof l === "object" && okUrl(l.u); }).slice(0, 12)
      .map(function (l) { return { t: text(l.t, 60).trim(), u: l.u }; });
    return { id: id, cat: infoT.has(d.cat) ? d.cat : "other", title: title, fields: fields, links: links, note: text(d.note, 4000),
      due: validDate(d.due) ? d.due : "", dueNote: text(d.dueNote, 60).trim(), by: okId(d.by) ? d.by : null, ts: num0(d.ts), up: num0(d.up) };
  }

  return {
    LOCALE: LOCALE, CATS: CATS, CURRENCIES: CURRENCIES, catLabel: catLabel, isCat: isCat, catEmoji: catEmoji,
    digits: digits, isCurrency: isCurrency, num: num, money: money, signed: signed, whole: whole, plain: plain, rateText: rateText,
    parseAmount: parseAmount, parseRate: parseRate, toBase: toBase,
    today: today, validDate: validDate, validTime: validTime, addDays: addDays, dayDiff: dayDiff, weekday: weekday, daysInMonth: daysInMonth,
    fmtDate: fmtDate, dayLabel: dayLabel, longDay: longDay, monthLabel: monthLabel, rangeLabel: rangeLabel, relDays: relDays, pad: pad,
    allocate: allocate, memberIds: memberIds, weights: weights, rateFor: rateFor, shares: shares, preview: preview,
    balances: balances, settle: settle, netOf: netOf, stats: stats, niceMax: niceMax, awards: awards,
    summaryText: summaryText, check: check, normHome: normHome, normExpense: normExpense,
    SHOP_CATS: SHOP_CATS, monthReport: monthReport, monthTag: monthTag, monthText: monthText, monthCsv: monthCsv,
    AVATARS: AVATARS, isAvatar: isAvatar, avatar: avatar, avatarFor: avatarFor, pickAvatar: pickAvatar, meme: meme, memeTotal: memeTotal, EXACT_MAX: EXACT_MAX, MAX_MINOR: MAX_MINOR,
    SHOP: SHOP, shopSec: shopT.get, shopGuess: shopGuess, splitQty: splitQty, normItem: normItem,
    EV_CATS: EV_CATS, evCat: evT.get, REPEATS: REPEATS, occurrences: occurrences, eventCheck: eventCheck, normEvent: normEvent,
    PLANTS: PLANTS, isPlantEmoji: isPlantEmoji, plantEmoji: plantEmoji, plantDue: plantDue, feedDue: feedDue, careFields: careFields, normPlant: normPlant,
    INFO_CATS: INFO_CATS, infoCat: infoT.get, okUrl: okUrl, dueOf: dueOf, normInfo: normInfo,
    glutenOf: glutenOf, GF_LABEL: GF_LABEL, MAINS: MAINS, main: mainT.get, traits: traits,
    DIETS: DIETS, METHODS: METHODS, TIMES: TIMES, SORTS: SORTS, emptyFilter: emptyFilter, filterCount: filterCount, recipeFits: recipeFits, filterRecipes: filterRecipes,
    suggest: suggest, menuFor: menuFor, FRIDGE_COMMON: FRIDGE_COMMON, fridgeItem: fridgeItem, fridgeMatch: fridgeMatch, fridgeSuggest: fridgeSuggest,
    MOODS: MOODS, mood: moodT.get, isMood: moodT.has, noteSummary: noteSummary, notesMap: notesMap,
    REGIONS: REGIONS, region: regT.get, KITCHENS: KITCHENS, kitchen: kitT.get, isKitchen: kitT.has, COLLECTIONS: COLLECTIONS, collection: collT.get, isCollection: collT.has,
    DISHES: DISHES, isDish: isDish, dishEmoji: dishEmoji, RECIPE_CATS: RECIPE_CATS, recipeCat: recT.get, RECIPE_TAGS: RECIPE_TAGS, recipeTag: tagT.get, hasTag: hasTag,
    durations: durations, secsLabel: secsLabel, stepIngredients: stepIngredients, STORES: STORES, storeOf: storeOf, aisleOrder: aisleOrder,
    isStaple: isStaple, scaleLine: scaleLine, searchWords: searchWords, recipeMatch: recipeMatch, normRecipe: normRecipe, ideas: ideas, idea: idea,
    okId: okId, hash: hash
  };
})();
// ---- Ende logic.js ----

// ---- ics.js (Kopie, nicht hier ändern) ----
/* Home-Planer: Kalenderdateien im Format iCalendar (RFC 5545), das Outlook, der iPhone-Kalender und Google lesen.
   build() macht aus den Terminen eines Haushalts einen Kalender; parse() liest Termine aus einer .ics-Datei.
   Ohne Abhängigkeiten: Dieselbe Datei läuft im Browser (window.HPIcs) und, als Kopie, im Kalender-Dienst
   dienst-worker.js. Wer hier etwas ändert, übernimmt es dort mit: node tests/dienst.test.js --update.
   Alle Uhrzeiten des Home-Planers sind Schweizer Zeit (Europe/Zurich). */
(function (root) {
  "use strict";
  var TZ = "Europe/Zurich";
  var KINDS = {
    date: ["Termin", "📅"], birthday: ["Geburtstag", "🎂"], trash: ["Abfuhr", "🗑️"], chores: ["Haushalt", "🧹"], visit: ["Besuch", "👋"],
    holiday: ["Ferien", "✈️"], party: ["Fest", "🎉"], health: ["Gesundheit", "🩺"], meal: ["Essen", "🍽️"], other: ["Sonstiges", "✨"]
  };
  var RRULE = { weekly: "FREQ=WEEKLY", biweekly: "FREQ=WEEKLY;INTERVAL=2", monthly: "FREQ=MONTHLY", yearly: "FREQ=YEARLY" };

  /* ---------- Daten und Zeiten ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function okDate(s) {
    if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    var d = new Date(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)));
    return d.getUTCFullYear() === +s.slice(0, 4) && d.getUTCMonth() === +s.slice(5, 7) - 1 && d.getUTCDate() === +s.slice(8, 10);
  }
  function okTime(s) { return typeof s === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(s); }
  function utcOf(day) { return Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)); }
  function dayOf(ms) { var d = new Date(ms); return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function addDays(day, n) { return dayOf(utcOf(day) + n * 86400000); }
  function diffDays(a, b) { return Math.round((utcOf(b) - utcOf(a)) / 86400000); }
  /* Sommerzeit in der Schweiz: vom letzten Sonntag im März bis zum letzten Sonntag im Oktober, jeweils 01:00 UTC. */
  function lastSunday(y, m) { var d = new Date(Date.UTC(y, m, 0)); return Date.UTC(y, m - 1, d.getUTCDate() - d.getUTCDay(), 1); }
  function offsetAt(utcMs) {
    var y = new Date(utcMs).getUTCFullYear();
    return utcMs >= lastSunday(y, 3) && utcMs < lastSunday(y, 10) ? 2 : 1;
  }
  /* Schweizer Ortszeit (Tag, "HH:MM") nach UTC-Millisekunden und zurück. */
  function localToUtc(day, time) {
    var wall = utcOf(day) + (+time.slice(0, 2)) * 3600000 + (+time.slice(3, 5)) * 60000;
    var guess = wall - 3600000;
    return wall - offsetAt(guess) * 3600000;
  }
  function utcToLocal(ms) {
    var w = ms + offsetAt(ms) * 3600000, d = new Date(w);
    return { day: dayOf(w), time: pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) };
  }
  function icsDay(day) { return day.replace(/-/g, ""); }
  function icsLocal(day, time) { return icsDay(day) + "T" + time.replace(":", "") + "00"; }
  function icsUtc(ms) { return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  function plusMinutes(day, time, mins) {
    var t = (+time.slice(0, 2)) * 60 + (+time.slice(3, 5)) + mins, extra = Math.floor(t / 1440);
    t -= extra * 1440;
    return { day: addDays(day, extra), time: pad(Math.floor(t / 60)) + ":" + pad(t % 60) };
  }

  /* ---------- Text ---------- */
  function str(v, max) { return typeof v === "string" ? v.slice(0, max) : ""; }
  function esc(s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n"); }
  /* Zeilen höchstens 75 Bytes lang; Fortsetzungen beginnen mit einem Leerschlag. Zeichen werden nie zerteilt. */
  function fold(line) {
    var out = [], cur = "", bytes = 0;
    for (var ch of line) {
      var cp = ch.codePointAt(0), b = cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
      if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ""; bytes = 0; }
      cur += ch; bytes += b;
    }
    out.push(cur);
    return out.join("\r\n ");
  }

  /* ---------- Termine prüfen ---------- */
  /* Im Kalender-Dienst kommen die Termine roh aus der Datenbank: Jedes Feld wird geprüft wie in logic.js (normEvent). */
  function clean(id, d) {
    if (!d || typeof d !== "object" || !okDate(d.date) || typeof id !== "string" || !/^[A-Za-z0-9_-]{1,60}$/.test(id)) return null;
    var title = str(d.title, 100).trim();
    if (!title) return null;
    var e = { id: id, title: title, date: d.date, cat: KINDS[d.cat] && Object.prototype.hasOwnProperty.call(KINDS, d.cat) ? d.cat : "other",
      end: okDate(d.end) && d.end > d.date && diffDays(d.date, d.end) <= 366 ? d.end : "", time: okTime(d.time) ? d.time : "", endTime: "",
      repeat: RRULE[d.repeat] && Object.prototype.hasOwnProperty.call(RRULE, d.repeat) ? d.repeat : "none", until: "", skip: [],
      who: Array.isArray(d.who) ? d.who.filter(function (x) { return typeof x === "string"; }).slice(0, 40) : [], note: str(d.note, 1000), up: typeof d.up === "number" && isFinite(d.up) ? d.up : 0 };
    if (e.time && okTime(d.endTime) && (e.end || d.endTime > e.time)) e.endTime = d.endTime;
    if (e.repeat !== "none") {
      if (okDate(d.until) && d.until >= d.date) e.until = d.until;
      e.skip = Array.isArray(d.skip) ? d.skip.filter(okDate).slice(0, 200) : [];
    }
    return e;
  }

  /* ---------- Kalender bauen ---------- */
  var VTIMEZONE = ["BEGIN:VTIMEZONE", "TZID:" + TZ, "X-LIC-LOCATION:" + TZ,
    "BEGIN:DAYLIGHT", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0200", "TZNAME:CEST", "DTSTART:19700329T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "END:DAYLIGHT",
    "BEGIN:STANDARD", "TZOFFSETFROM:+0200", "TZOFFSETTO:+0100", "TZNAME:CET", "DTSTART:19701025T030000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "END:STANDARD",
    "END:VTIMEZONE"];
  function summaryOf(e, names) {
    var k = KINDS[e.cat], t = e.title;
    if (e.cat === "meal") {
      var cooks = e.who.map(function (id) { return names[id]; }).filter(Boolean);
      if (cooks.length) t += " (" + cooks.join(" & ") + (cooks.length > 1 ? " kochen)" : " kocht)");
    }
    return e.cat === "date" || e.cat === "other" ? t : k[1] + " " + t;
  }
  function eventLines(e, o) {
    var names = o.names || {}, L = ["BEGIN:VEVENT", "UID:" + e.id + "@home-planer", "DTSTAMP:" + icsUtc(o.now)];
    var last = e.end || e.date;
    if (!e.time) {
      L.push("DTSTART;VALUE=DATE:" + icsDay(e.date), "DTEND;VALUE=DATE:" + icsDay(addDays(last, 1)));
    } else {
      var end = e.endTime ? { day: last, time: e.endTime } : e.end ? { day: addDays(last, 1), time: "00:00" } : plusMinutes(e.date, e.time, 60);
      L.push("DTSTART;TZID=" + TZ + ":" + icsLocal(e.date, e.time), "DTEND;TZID=" + TZ + ":" + icsLocal(end.day, end.time));
    }
    if (e.repeat !== "none") {
      var rule = RRULE[e.repeat];
      if (e.until) rule += ";UNTIL=" + (e.time ? icsUtc(localToUtc(e.until, e.time)) : icsDay(e.until));
      L.push("RRULE:" + rule);
      if (e.skip.length) L.push(e.time ? "EXDATE;TZID=" + TZ + ":" + e.skip.map(function (d) { return icsLocal(d, e.time); }).join(",")
        : "EXDATE;VALUE=DATE:" + e.skip.map(icsDay).join(","));
    }
    L.push("SUMMARY:" + esc(summaryOf(e, names)));
    var who = e.cat === "meal" ? [] : e.who.map(function (id) { return names[id]; }).filter(Boolean);
    var desc = [e.note.trim(), who.length ? "Betrifft: " + who.join(", ") : "", o.home ? "Aus dem Home-Planer «" + o.home + "»" : ""].filter(Boolean).join("\n\n");
    if (desc) L.push("DESCRIPTION:" + esc(desc));
    L.push("CATEGORIES:" + esc(KINDS[e.cat][0]));
    if (e.up > 0) L.push("LAST-MODIFIED:" + icsUtc(e.up));
    L.push("TRANSP:" + (e.cat === "meal" || e.cat === "trash" || e.cat === "birthday" || e.cat === "chores" ? "TRANSPARENT" : "OPAQUE"));
    L.push("END:VEVENT");
    return L;
  }
  /* o: { home: Name des Haushalts, names: { id: Name }, events: [{ id, ...Felder }], kinds: [nur diese Arten], now: ms, name: Kalendername }.
     Einmalige Termine, die über ein Jahr zurückliegen, bleiben weg: Der Kalender bleibt so schlank. */
  function build(o) {
    o = o || {};
    var now = typeof o.now === "number" ? o.now : Date.now(), today = utcToLocal(now).day, old = addDays(today, -400);
    var kinds = Array.isArray(o.kinds) && o.kinds.length ? o.kinds : null;
    var name = str(o.name, 120) || (o.home ? "Home-Planer · " + str(o.home, 80) : "Home-Planer");
    var L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Home-Planer//Kalender//DE", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "X-WR-CALNAME:" + esc(name), "X-WR-CALDESC:" + esc("Termine aus dem Home-Planer. Ändern geht nur in der App."), "X-WR-TIMEZONE:" + TZ,
      "REFRESH-INTERVAL;VALUE=DURATION:PT1H", "X-PUBLISHED-TTL:PT1H"].concat(VTIMEZONE);
    var n = 0;
    (Array.isArray(o.events) ? o.events : []).forEach(function (raw) {
      var e = raw && clean(raw.id, raw);
      if (!e || n >= 3000) return;
      if (kinds && kinds.indexOf(e.cat) < 0) return;
      if (e.repeat === "none" && (e.end || e.date) < old) return;
      if (e.repeat !== "none" && e.until && e.until < old) return;
      L = L.concat(eventLines(e, { names: o.names || {}, now: now, home: str(o.home, 80) }));
      n++;
    });
    L.push("END:VCALENDAR");
    return L.map(fold).join("\r\n") + "\r\n";
  }

  /* ---------- Kalender lesen ---------- */
  function unesc(s) { return s.replace(/\\([\\;,nN])/g, function (m, c) { return c === "n" || c === "N" ? "\n" : c; }); }
  function props(text) {
    var lines = String(text || "").replace(/\r\n?/g, "\n").replace(/\n[ \t]/g, "").split("\n"), out = [];
    lines.forEach(function (l) {
      var m = /^([A-Za-z0-9-]+)((?:;[^:]*)?):(.*)$/.exec(l);
      if (!m) return;
      var params = {};
      (m[2] || "").split(";").slice(1).forEach(function (p) { var i = p.indexOf("="); if (i > 0) params[p.slice(0, i).toUpperCase()] = p.slice(i + 1).replace(/^"|"$/g, ""); });
      out.push({ name: m[1].toUpperCase(), params: params, value: m[3] });
    });
    return out;
  }
  /* "20261010" oder "20261010T183000" (Ortszeit) oder "20261010T163000Z" (UTC) nach { day, time }. */
  function readWhen(p) {
    var v = (p.value || "").trim(), m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(v);
    if (!m) return null;
    var day = m[1] + "-" + m[2] + "-" + m[3];
    if (!okDate(day)) return null;
    if (!m[4] || p.params.VALUE === "DATE") return { day: day, time: "" };
    var time = m[4] + ":" + m[5];
    if (!okTime(time)) return null;
    return m[7] ? utcToLocal(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])) : { day: day, time: time };
  }
  function readDuration(v) {
    var m = /^P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:\d+S)?)?$/.exec(String(v || "").trim());
    return m ? ((+m[1] || 0) * 7 * 1440 + (+m[2] || 0) * 1440 + (+m[3] || 0) * 60 + (+m[4] || 0)) : null;
  }
  /* Wiederholungen, die der Home-Planer kennt; alles andere wird als einzelner Termin übernommen. */
  function readRule(v, start) {
    var r = {};
    String(v || "").split(";").forEach(function (p) { var i = p.indexOf("="); if (i > 0) r[p.slice(0, i).toUpperCase()] = p.slice(i + 1); });
    var iv = +(r.INTERVAL || 1), out = null;
    if (r.FREQ === "WEEKLY" && (iv === 1 || iv === 2) && (!r.BYDAY || r.BYDAY.split(",").length === 1)) out = iv === 2 ? "biweekly" : "weekly";
    else if (r.FREQ === "MONTHLY" && iv === 1 && !r.BYDAY && !r.BYSETPOS && (!r.BYMONTHDAY || +r.BYMONTHDAY === +start.slice(8, 10))) out = "monthly";
    else if (r.FREQ === "YEARLY" && iv === 1 && !r.BYDAY) out = "yearly";
    if (!out) return { repeat: "none", lost: true };
    var until = "";
    if (r.UNTIL) { var w = readWhen({ value: r.UNTIL, params: {} }); if (w) until = w.day; }
    else if (r.COUNT && +r.COUNT > 0) {
      var c = +r.COUNT - 1;
      until = out === "weekly" ? addDays(start, 7 * c) : out === "biweekly" ? addDays(start, 14 * c)
        : out === "monthly" ? dayOf(Date.UTC(+start.slice(0, 4), +start.slice(5, 7) - 1 + c, +start.slice(8, 10)))
          : (+start.slice(0, 4) + c) + start.slice(4);
    }
    return { repeat: out, until: okDate(until) && until >= start ? until : "", lost: false };
  }
  /* Termine aus einer .ics-Datei: [{ uid, title, date, end, time, endTime, repeat, until, skip, note }] und was vereinfacht wurde. */
  function parse(text) {
    var all = props(text), events = [], cur = null, depth = 0, simplified = 0, dropped = 0;
    all.forEach(function (p) {
      if (p.name === "BEGIN" && p.value.toUpperCase() === "VEVENT") { cur = { ex: [] }; depth = 0; return; }
      if (!cur) return;
      if (p.name === "BEGIN") { depth++; return; }                               // VALARM und Ähnliches überspringen
      if (p.name === "END" && depth > 0) { depth--; return; }
      if (depth > 0) return;
      if (p.name === "END" && p.value.toUpperCase() === "VEVENT") {
        var e = finish(cur);
        if (e) { events.push(e.ev); if (e.lost) simplified++; } else dropped++;
        cur = null; return;
      }
      if (p.name === "EXDATE") { p.value.split(",").forEach(function (v) { var w = readWhen({ value: v, params: p.params }); if (w) cur.ex.push(w.day); }); return; }
      if (!cur[p.name]) cur[p.name] = p;
    });
    function finish(c) {
      if (c.STATUS && /CANCELLED/i.test(c.STATUS.value)) return null;
      if (c["RECURRENCE-ID"]) return null;                                       // geänderte Einzeltermine einer Serie
      var s = c.DTSTART && readWhen(c.DTSTART);
      if (!s) return null;
      var title = c.SUMMARY ? unesc(c.SUMMARY.value).trim().slice(0, 100) : "";
      if (!title) title = "Termin";
      var ev = { uid: c.UID ? unesc(c.UID.value).slice(0, 200) : "", title: title, date: s.day, end: "", time: s.time, endTime: "", repeat: "none", until: "", skip: [], note: "" };
      var e = c.DTEND && readWhen(c.DTEND);
      if (!e && c.DURATION) {
        var mins = readDuration(c.DURATION.value);
        if (mins != null) e = s.time ? plusMinutes(s.day, s.time, mins) : { day: addDays(s.day, Math.max(1, Math.round(mins / 1440))), time: "" };
      }
      if (e) {
        if (!s.time) { var lastDay = addDays(e.day, -1); if (lastDay > s.day) ev.end = lastDay; }
        else {
          if (e.day > s.day && !(e.day === addDays(s.day, 1) && e.time === "00:00")) ev.end = e.time === "00:00" ? addDays(e.day, -1) : e.day;
          if (e.time && (ev.end || e.time > s.time) && e.time !== "00:00") ev.endTime = e.time;
        }
        if (ev.end && diffDays(ev.date, ev.end) > 366) ev.end = "";
      }
      var lost = false;
      if (c.RRULE) {
        var r = readRule(c.RRULE.value, ev.date);
        ev.repeat = r.repeat; lost = r.lost;
        if (r.repeat !== "none") { ev.until = r.until; ev.skip = c.ex.filter(function (d) { return d >= ev.date; }).slice(0, 200); }
      }
      var note = [c.LOCATION ? "Ort: " + unesc(c.LOCATION.value).trim() : "", c.DESCRIPTION ? unesc(c.DESCRIPTION.value).trim() : ""].filter(Boolean).join("\n\n");
      if (lost) note = (note ? note + "\n\n" : "") + "Die Wiederholung aus der Kalenderdatei liess sich nicht übernehmen; eingetragen ist der erste Termin.";
      ev.note = note.slice(0, 1000);
      return { ev: ev, lost: lost };
    }
    return { events: events, simplified: simplified, dropped: dropped };
  }

  root.HPIcs = { build: build, parse: parse, clean: clean, fold: fold, esc: esc, localToUtc: localToUtc, utcToLocal: utcToLocal, KINDS: KINDS };
})(typeof window !== "undefined" ? window : globalThis);
// ---- Ende ics.js ----

// ---- erinnerungen.js (Kopie, nicht hier ändern) ----
/* Home-Planer: Mitteilungen. Hier steht, was eine Mitteilung sagt und wann sie kommt, ohne Netz und ohne Seiteneffekte.
   Dieselbe Datei läuft in der App (window.HPRemind: Texte bei neuen Einträgen, Vorschau) und, als Kopie, im Dienst
   dienst-worker.js, der alle 15 Minuten nachschaut, ob eine Erinnerung fällig ist. Wer hier etwas ändert, übernimmt es dort
   mit: node tests/dienst.test.js --update. Braucht logic.js (HP) und ics.js (HPIcs, für die Schweizer Zeit).

   Eine Mitteilung: { kind, tag, title, body, to, per, tab, live }
   kind  eine der Arten unten; jedes Gerät wählt, welche es bekommt
   to    Kennungen der Personen, die sie bekommen; null = alle im Haushalt
   per   { Kennung: { title, body } }: eigener Text für einzelne Personen («dein Anteil»), sonst title und body
   tab   der Reiter, den ein Tipp auf die Mitteilung öffnet
   live  true bei neuen Einträgen anderer: Die kommen nie an die Person, die sie gemacht hat, und nicht in der Ruhezeit. */
(function (root) {
  "use strict";
  var HP = root.HP, I = root.HPIcs;

  /* ---------- Arten ---------- */
  var KINDS = [
    { id: "shop", emoji: "🛒", label: "Einkaufsliste", hint: "Wenn jemand etwas auf die Liste setzt oder einkaufen geht" },
    { id: "kasse", emoji: "💰", label: "Kasse", hint: "Neue Ausgaben mit deinem Anteil und Zahlungen an dich" },
    { id: "month", emoji: "🧾", label: "Monatsabrechnung", hint: "Am 1. um 18 Uhr, wer wem wie viel überweist; am 8., wenn noch etwas offen ist" },
    { id: "cal", emoji: "📅", label: "Termine", hint: "Neue Termine, eine Stunde vor dem Beginn, ganztägige um 7.30 Uhr" },
    { id: "trash", emoji: "🗑️", label: "Abfuhr", hint: "Am Vorabend um 19 Uhr" },
    { id: "birthday", emoji: "🎂", label: "Geburtstage", hint: "Drei Tage vorher um 18 Uhr und am Tag selbst um 8 Uhr" },
    { id: "meal", emoji: "🍳", label: "Kochen", hint: "Um 15.30 Uhr, wenn du heute kochst, und wenn jemand Essen plant" },
    { id: "plants", emoji: "🪴", label: "Pflanzen", hint: "Um 8 Uhr, wenn deine Pflanzen Wasser oder Dünger brauchen" },
    { id: "infos", emoji: "📁", label: "Fristen", hint: "30, 7 und 1 Tag vor einer Frist aus den Infos und am Tag selbst" }
  ];
  var IDS = KINDS.map(function (k) { return k.id; });
  function isKind(k) { return IDS.indexOf(k) >= 0; }
  /* Welche Arten ein Gerät bekommt, als Liste in fester Reihenfolge. Ohne Angabe: alle. */
  function prefsOf(v) {
    if (v == null) return IDS.slice();
    var list = Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : [];
    return IDS.filter(function (k) { return list.indexOf(k) >= 0; });
  }

  /* ---------- Zeit ---------- */
  /* Der Dienst schaut alle 15 Minuten nach. Feste Erinnerungen haben eine Uhrzeit (Schweizer Zeit). */
  var SLOT = 900000;
  var AT = { allday: "07:30", birthday: "08:00", plants: "08:00", infos: "09:00", meal: "15:30", birthdaySoon: "18:00", month: "18:00", trash: "19:00" };
  var QUIET = { from: "22:00", to: "07:00" };
  function slotOf(ms) { var s = Math.floor(ms / SLOT) * SLOT, l = I.utcToLocal(s); return { ms: s, day: l.day, time: l.time }; }
  function quiet(time) { return time >= QUIET.from || time < QUIET.to; }
  function prevYm(day) { var y = +day.slice(0, 4), m = +day.slice(5, 7) - 1; if (m < 1) { m = 12; y--; } return y + "-" + HP.pad(m); }

  /* Was der Dienst für einen Zeitpunkt aus der Datenbank lesen muss. Er liest so wenig wie möglich: Jede gelesene Zeile zählt
     beim kostenlosen Firebase-Tarif.
     times/soonDay: Termine, die in einer Stunde beginnen (Uhrzeit genau eine dieser 15 Minuten)
     days: einmalige Termine an diesen Tagen; recurring: alle wiederkehrenden Termine
     plants, infos: die ganze Liste; month: Ausgaben ab diesem Monat ("2026-09") für die Monatsabrechnung */
  function needs(at) {
    var s = slotOf(at), soon = I.utcToLocal(s.ms + 3600000), times = [], t = s.time, dom = s.day.slice(8);
    for (var i = 0; i < 15; i++) times.push(soon.time.slice(0, 3) + HP.pad(+soon.time.slice(3) + i));
    var fixed = t === AT.allday || t === AT.birthday || t === AT.meal || t === AT.birthdaySoon || t === AT.trash;
    return { slot: s, soonDay: soon.day, times: times, days: fixed ? [s.day, HP.addDays(s.day, 1), HP.addDays(s.day, 3)] : [], recurring: fixed,
      plants: t === AT.plants, infos: t === AT.infos, month: t === AT.month && (dom === "01" || dom === "08") ? prevYm(s.day) : "" };
  }

  /* ---------- Texte ---------- */
  function emo(e) { return HP.evCat(e.cat).emoji; }
  function dot(s) { return String(s).replace(/\.$/, "") + "."; }
  function firstLine(s) { var l = String(s || "").split("\n")[0].trim(); return l.length > 100 ? l.slice(0, 99) + "…" : l; }
  /* "Milch", "Milch und Brot", "Milch, Brot und Eier", "Milch, Brot, Eier, Butter und 3 weitere" */
  function listText(names, max) {
    max = max || 4;
    if (names.length <= 1) return names.join("");
    if (names.length > max) return names.slice(0, max).join(", ") + " und " + (names.length - max) + " weitere";
    return names.slice(0, -1).join(", ") + " und " + names[names.length - 1];
  }
  function nameOf(home, id) { var m = home && home.members && home.members[id]; return m && m.name ? m.name : "Jemand"; }
  function active(home) { return HP.memberIds(home); }
  function msg(kind, tag, title, body, to, tab, per) {
    return { kind: kind, tag: tag, title: title, body: body, to: to && to.length ? to.slice() : null, per: per || null, tab: tab, live: false };
  }
  /* Mehrere Dinge in einer Mitteilung, je Person nur, was sie betrifft. items: [{ to: [Kennungen] oder leer = alle, … }] */
  function grouped(kind, tag, home, items, make, tab) {
    if (!items.length) return null;
    var per = {}, to = [];
    active(home).forEach(function (id) {
      var own = items.filter(function (x) { return !x.to || !x.to.length || x.to.indexOf(id) >= 0; });
      if (own.length) { per[id] = make(own); to.push(id); }
    });
    if (!to.length) return null;
    var all = make(items);
    return msg(kind, tag, all.title, all.body, to, tab, per);
  }
  var NO_HOUR = { trash: 1, birthday: 1, meal: 1 };      // diese Arten haben eigene Erinnerungen
  var NO_DAY = { trash: 1, birthday: 1, meal: 1 };

  /* ---------- Erinnerungen ---------- */
  /* o: { home, events, plants, infos, expenses (normiert, wie aus logic.js), at: Zeitpunkt in ms }.
     Ergebnis: alle Mitteilungen, die in diesem 15-Minuten-Fenster fällig sind. */
  function due(o) {
    var n = needs(o.at), s = n.slot, home = o.home, out = [];
    if (!home) return out;
    var events = o.events || [], day = s.day, t = s.time;
    function add(m) { if (m) out.push(m); }

    /* Termine mit Uhrzeit: eine Stunde vorher */
    var last = n.times[n.times.length - 1], soon = n.times[0];
    HP.occurrences(events, n.soonDay, n.soonDay).forEach(function (x) {
      var e = x.e;
      if (!x.first || !e.time || e.time < soon || e.time > last || NO_HOUR[e.cat]) return;
      var note = firstLine(e.note);
      add(msg("cal", "ev-" + e.id + "-" + x.date, emo(e) + " " + e.title, "In einer Stunde, um " + e.time + " Uhr." + (note ? " " + note : ""), e.who, "cal"));
    });

    /* Ganztägige Termine am Morgen */
    if (t === AT.allday) {
      var today = HP.occurrences(events, day, day).filter(function (x) { return x.first && !x.e.time && !NO_DAY[x.e.cat]; });
      add(grouped("cal", "day-" + day, home, today.map(function (x) { return { to: x.e.who, x: x }; }), function (own) {
        if (own.length === 1) {
          var x = own[0].x, note = firstLine(x.e.note);
          return { title: emo(x.e) + " Heute: " + x.e.title, body: (x.multi ? "Bis " + dot(HP.dayLabel(x.end)) : "Ganztägig.") + (note ? " " + note : "") };
        }
        return { title: "📅 Heute: " + own.length + " Termine", body: own.map(function (y) { return y.x.e.title; }).join(" · ") };
      }, "cal"));
    }

    /* Geburtstage: am Tag um 8 Uhr, drei Tage vorher um 18 Uhr */
    if (t === AT.birthday || t === AT.birthdaySoon) {
      var bday = t === AT.birthday ? day : HP.addDays(day, 3);
      HP.occurrences(events, bday, bday).forEach(function (x) {
        if (!x.first || x.e.cat !== "birthday") return;
        add(t === AT.birthday
          ? msg("birthday", "bd-" + x.e.id + "-" + bday, "🎂 Heute: " + x.e.title, "Nicht vergessen zu gratulieren.", null, "cal")
          : msg("birthday", "bd3-" + x.e.id + "-" + bday, "🎂 In drei Tagen: " + x.e.title, HP.longDay(bday) + ". Noch Zeit für ein Geschenk oder eine Karte.", null, "cal"));
      });
    }

    /* Pflanzen: um 8 Uhr, wer giessen oder düngen soll. Ohne Zuständige gilt es für alle. */
    if (t === AT.plants) {
      var thirsty = [];
      (o.plants || []).forEach(function (p) {
        var w = HP.plantDue(p, day), f = HP.feedDue(p, day);
        if (w.days <= 0 || (f && f.days <= 0)) thirsty.push({ to: p.who ? [p.who] : [], p: p, water: w.days <= 0, feed: !!(f && f.days <= 0) });
      });
      add(grouped("plants", "plants-" + day, home, thirsty, function (own) {
        var water = own.filter(function (x) { return x.water; }).map(function (x) { return x.p.name; });
        var feed = own.filter(function (x) { return x.feed; }).map(function (x) { return x.p.name; });
        if (!water.length) return { title: "🪴 Heute düngen", body: listText(feed, 6) + "." };
        return { title: "🪴 Heute giessen", body: listText(water, 6) + "." + (feed.length ? " Düngen: " + listText(feed, 6) + "." : "") };
      }, "plants"));
    }

    /* Fristen aus den Infos: 30, 7 und 1 Tag vorher und am Tag selbst, um 9 Uhr */
    if (t === AT.infos) {
      (o.infos || []).forEach(function (info) {
        var d = HP.dueOf(info, day);
        if (d !== 30 && d !== 7 && d !== 1 && d !== 0) return;
        var what = info.dueNote || "Frist";
        add(msg("infos", "info-" + info.id + "-" + d, "📁 " + what + " " + (d === 0 ? "heute" : d === 1 ? "morgen" : "in " + d + " Tagen") + ": " + info.title,
          HP.fmtDate(info.due, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + ".", null, "infos"));
      });
    }

    /* Kochen: um 15.30 Uhr an die, die heute kochen */
    if (t === AT.meal) {
      HP.occurrences(events, day, day).forEach(function (x) {
        var e = x.e;
        if (!x.first || e.cat !== "meal") return;
        var cooks = e.who.filter(function (id) { return active(home).indexOf(id) >= 0; });
        if (!cooks.length) { add(msg("meal", "meal-" + e.id + "-" + day, "🍳 Heute auf dem Plan: " + e.title, "Wer kocht? Im Kalender eintragen.", null, "recipes")); return; }
        var per = {};
        cooks.forEach(function (id) {
          var others = cooks.filter(function (c) { return c !== id; }).map(function (c) { return nameOf(home, c); });
          per[id] = { title: "🍳 Heute kochst du: " + e.title, body: (others.length ? "Zusammen mit " + listText(others) + ". " : "") + "Schau jetzt, ob alle Zutaten da sind." };
        });
        add(msg("meal", "meal-" + e.id + "-" + day, "🍳 Heute kocht " + listText(cooks.map(function (c) { return nameOf(home, c); })) + ": " + e.title, "Schau jetzt, ob alle Zutaten da sind.", cooks, "recipes", per));
      });
    }

    /* Monatsabrechnung der Einkäufe: am 1. um 18 Uhr für alle, die etwas überweisen oder bekommen; am 8. nur, wenn noch offen */
    if (n.month && o.expenses) {
      var rep = HP.monthReport(home, o.expenses, n.month, "shop"), label = HP.monthLabel(n.month), first = day.slice(8) === "01";
      if (rep.count && (first || rep.open)) {
        var per2 = {}, to2 = [], b = home.base;
        active(home).forEach(function (id) {
          var lines = [];
          rep.plan.payments.forEach(function (p) {
            if (p.from === id) lines.push("Du überweist " + nameOf(home, p.to) + " " + HP.money(p.amount, b) + ".");
            else if (p.to === id) lines.push(nameOf(home, p.from) + " überweist dir " + HP.money(p.amount, b) + ".");
          });
          if (!lines.length && !first) return;
          if (!lines.length) lines.push(rep.open ? "Für dich ist der Monat quitt." : "Der Monat ist quitt.");
          per2[id] = { title: (first ? "🧾 Abrechnung " : "🧾 Noch offen: ") + label, body: (first ? "Einkäufe: " + HP.money(rep.total, b) + ". " : "") + lines.join(" ") };
          to2.push(id);
        });
        if (to2.length) add(msg("month", "month-" + n.month + "-" + day.slice(8), "🧾 Abrechnung " + label, "Einkäufe: " + HP.money(rep.total, b) + ".", to2, "kasse", per2));
      }
    }

    /* Abfuhr: am Vorabend um 19 Uhr */
    if (t === AT.trash) {
      var tomorrow = HP.addDays(day, 1);
      var bins = HP.occurrences(events, tomorrow, tomorrow).filter(function (x) { return x.first && x.e.cat === "trash"; });
      add(grouped("trash", "trash-" + tomorrow, home, bins.map(function (x) { return { to: x.e.who, x: x }; }), function (own) {
        return { title: "🗑️ Morgen: " + listText(own.map(function (y) { return y.x.e.title; })), body: "Heute Abend rausstellen." };
      }, "cal"));
    }
    return out;
  }

  /* ---------- Neue Einträge ---------- */
  /* Was die anderen erfahren, wenn jemand etwas einträgt. docs: neue Einträge einer Art (normiert), die dieselbe Person
     kurz nacheinander gemacht hat. Ergebnis: Mitteilungen mit live = true; der Dienst schickt sie nie an "from" selbst. */
  function changed(home, from, col, docs) {
    var who = nameOf(home, from), out = [], b = home.base, ids = active(home);
    function live(m) { m.live = true; m.from = from || null; out.push(m); }
    docs = (docs || []).filter(Boolean);
    if (!docs.length) return out;
    if (col === "shopping") {
      var names = docs.filter(function (d) { return !d.done; }).map(function (d) { return d.name; });
      if (names.length) live(msg("shop", "shop-" + (docs[0].ts || 0), "🛒 Einkaufsliste", who + " hat " + listText(names) + " eingetragen.", null, "shop"));
    } else if (col === "expenses") {
      docs.forEach(function (e) {
        var s = HP.shares(e, home), title = e.title || HP.catLabel(e.cat), per = {}, to = [];
        if (e.kind === "transfer") {
          if (!s) return;
          var why = /^\d{4}-\d{2}/.test(e.settles || "") ? " für die Abrechnung " + HP.monthLabel(e.settles.slice(0, 7)) : "";
          per[e.to] = { title: "💸 Zahlung erhalten", body: nameOf(home, e.payer) + " hat dir " + HP.money(s.total, b) + why + " überwiesen." };
          to.push(e.to);
          if (from !== e.payer) { per[e.payer] = { title: "💸 Zahlung eingetragen", body: who + " hat deine Zahlung von " + HP.money(s.total, b) + (from === e.to ? "" : " an " + nameOf(home, e.to)) + " eingetragen." }; to.push(e.payer); }
          live(msg("kasse", "pay-" + e.id, "💸 Zahlung", nameOf(home, e.payer) + " → " + nameOf(home, e.to) + ": " + HP.money(s.total, b), to, "kasse", per));
          return;
        }
        var total = s ? HP.money(s.total, b) : HP.money(e.amount, e.cur), payer = nameOf(home, e.payer);
        ids.forEach(function (id) {
          var part = s && s.parts[id] ? s.parts[id] : 0;
          if (!part && id !== e.payer) return;
          var mine = part ? " Dein Anteil: " + HP.money(part, b) + "." : "";
          per[id] = { title: "💰 " + title, body: (id === e.payer ? who + " hat für dich eingetragen: Du hast " + total + " bezahlt." : payer + " hat " + total + " bezahlt.") + mine };
          to.push(id);
        });
        if (to.length) live(msg("kasse", "exp-" + e.id, "💰 " + title, payer + " hat " + total + " bezahlt.", to, "kasse", per));
      });
    } else if (col === "events") {
      var meals = docs.filter(function (e) { return e.cat === "meal"; }), other = docs.filter(function (e) { return e.cat !== "meal"; });
      var when = function (e) { return HP.dayLabel(e.date) + (e.time ? ", " + e.time + " Uhr" : ""); };
      if (meals.length === 1) {
        var m = meals[0], cooks = m.who.map(function (id) { return nameOf(home, id); });
        live(msg("meal", "plan-" + m.id, "🍳 " + (cooks.length ? listText(cooks) + (cooks.length > 1 ? " kochen" : " kocht") : "Geplant") + ": " + m.title, dot(HP.dayLabel(m.date)) + " Geplant von " + who + ".", null, "recipes"));
      } else if (meals.length > 1) {
        var sorted = meals.slice().sort(function (x, y) { return x.date < y.date ? -1 : 1; });
        live(msg("meal", "plan-" + sorted[0].id, "🍳 Wochenplan: " + meals.length + " Essen geplant",
          sorted.slice(0, 4).map(function (e) { return HP.fmtDate(e.date, { weekday: "short" }) + " " + e.title; }).join(" · ") + (meals.length > 4 ? " …" : "") + " (von " + who + ")", null, "recipes"));
      }
      if (other.length) {
        var everyone = other.some(function (e) { return !e.who.length; }), to3 = [];
        if (!everyone) other.forEach(function (e) { e.who.forEach(function (id) { if (to3.indexOf(id) < 0) to3.push(id); }); });
        var o1 = other[0];
        if (other.length === 1) live(msg("cal", "new-" + o1.id, emo(o1) + " " + o1.title, dot(when(o1)) + " Eingetragen von " + who + ".", everyone ? null : to3, "cal"));
        else {
          var first = other.slice().sort(function (x, y) { return x.date < y.date ? -1 : 1; })[0];
          live(msg("cal", "new-" + o1.id, "📅 " + other.length + " neue Termine", "Eingetragen von " + who + ", ab " + HP.dayLabel(first.date) + ": " + listText(other.map(function (e) { return e.title; }), 3) + ".", everyone ? null : to3, "cal"));
        }
      }
    }
    return out;
  }
  /* «Ich gehe einkaufen»: die anderen können noch schnell etwas auf die Liste setzen. */
  var GOING = { migros: "Gleich in der Migros. ", coop: "Gleich im Coop. " };
  function going(home, from, open) {
    var where = GOING[home.store] || "";
    var m = msg("shop", "go-" + Date.now(), "🛒 " + nameOf(home, from) + " geht einkaufen",
      where + (open ? open + (open === 1 ? " Sache steht" : " Sachen stehen") + " auf der Liste. " : "") + "Fehlt noch etwas? Jetzt eintragen.", null, "shop");
    m.live = true; m.from = from || null;
    return m;
  }

  /* ---------- Wer bekommt was ---------- */
  /* Bekommt ein Gerät diese Mitteilung? dev: { member, prefs: [Arten], quiet: true/false }, now: lokale Zeit "HH:MM".
     Text für dieses Gerät oder null. */
  function forDevice(m, dev, home, now) {
    if (!m || !dev || !dev.member || prefsOf(dev.prefs).indexOf(m.kind) < 0) return null;
    if (active(home).indexOf(dev.member) < 0) return null;                    // nicht (mehr) im Haushalt
    if (m.live && (dev.member === m.from || (dev.quiet && quiet(now || "12:00")))) return null;
    if (m.to && m.to.indexOf(dev.member) < 0) return null;
    var own = m.per && m.per[dev.member];
    return { title: own ? own.title : m.title, body: own ? own.body : m.body, tag: m.tag, tab: m.tab, kind: m.kind };
  }

  /* Vorschau für die App: die nächsten Erinnerungen für eine Person, aus allen Daten des Haushalts. */
  function upcoming(o, dev, from, days, max) {
    var out = [], start = slotOf(from).ms + SLOT, end = start + (days || 7) * 86400000;
    for (var at = start; at < end && out.length < (max || 8); at += SLOT) {
      due({ home: o.home, events: o.events, plants: o.plants, infos: o.infos, expenses: o.expenses, at: at }).forEach(function (m) {
        var x = forDevice(m, dev, o.home, "12:00");
        if (x) { var l = I.utcToLocal(at); out.push({ at: at, day: l.day, time: l.time, kind: x.kind, title: x.title, body: x.body }); }
      });
    }
    return out.slice(0, max || 8);
  }

  root.HPRemind = { KINDS: KINDS, isKind: isKind, prefsOf: prefsOf, AT: AT, QUIET: QUIET, SLOT: SLOT, slotOf: slotOf, quiet: quiet, needs: needs,
    due: due, changed: changed, going: going, forDevice: forDevice, upcoming: upcoming, listText: listText };
})(typeof window !== "undefined" ? window : globalThis);
// ---- Ende erinnerungen.js ----

const HP = globalThis.HP, HPIcs = globalThis.HPIcs, R = globalThis.HPRemind;
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
function text(body, status, extra) {
  return new Response(body, { status: status || 200, headers: Object.assign({ "Content-Type": "text/plain; charset=utf-8" }, CORS, extra || {}) });
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: Object.assign({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, CORS) });
}
const enc = s => new TextEncoder().encode(s);
function concat(...parts) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  parts.forEach(p => { out.set(p, at); at += p.length; });
  return out;
}
const HOME_ID = /^[A-Za-z0-9]{16,40}$/;
function secretOf(env) { const s = env && (env.DIENST_SCHLUESSEL || env.KALENDER_SCHLUESSEL); return s && String(s).length >= 16 ? String(s) : ""; }

/* ---------- Schlüssel ---------- */
function b64url(bytes) {
  let s = "";
  bytes.forEach(b => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64url(s) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}
async function keyOf(secret) {
  const raw = await crypto.subtle.digest("SHA-256", enc("home-planer-kalender:" + secret));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function seal(secret, home, v) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyOf(secret), enc("h1:" + home + ":" + v)));
  return b64url(concat(iv, data));
}
async function open(secret, token) {
  try {
    if (typeof token !== "string" || !/^[A-Za-z0-9_-]{40,200}$/.test(token)) return null;
    const bytes = unb64url(token);
    const plain = new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, await keyOf(secret), bytes.slice(12)));
    const m = /^h1:([A-Za-z0-9]{16,40}):(\d{1,7})$/.exec(plain);
    return m ? { home: m[1], v: +m[2] } : null;
  } catch (e) { return null; }
}
async function hmac(secret, s) {
  const k = await crypto.subtle.importKey("raw", enc(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, enc(s)));
}

/* ---------- Firestore lesen ---------- */
function plain(v) {
  if (!v || typeof v !== "object") return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(plain);
  if ("mapValue" in v) return fieldsOf(v.mapValue.fields);
  return null;
}
function fieldsOf(fields) { const o = {}; for (const k in fields || {}) o[k] = plain(fields[k]); return o; }
function base(env) {
  const p = (env && env.FIREBASE_PROJECT) || FIREBASE_PROJECT;
  return "https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(p) + "/databases/(default)/documents/homes/";
}
function apiKey(env) { return (env && env.FIREBASE_API_KEY) || FIREBASE_API_KEY; }
async function get(url, env) {
  const res = await fetch(url + (url.indexOf("?") >= 0 ? "&" : "?") + "key=" + encodeURIComponent(apiKey(env)));
  if (res.status === 404) return null;
  if (!res.ok) throw { status: res.status };
  return res.json();
}
async function readHome(id, env) {
  const doc = await get(base(env) + id, env);
  return doc && doc.fields ? fieldsOf(doc.fields) : null;
}
const docOf = d => Object.assign(fieldsOf(d.fields), { id: d.name.slice(d.name.lastIndexOf("/") + 1) });
async function readEvents(id, env) {
  const out = [];
  let page = "";
  for (let i = 0; i < 10; i++) {
    const r = await get(base(env) + id + "/events?pageSize=300" + (page ? "&pageToken=" + encodeURIComponent(page) : ""), env);
    ((r && r.documents) || []).forEach(d => { out.push(docOf(d)); });
    page = r && r.nextPageToken;
    if (!page) break;
  }
  return out;
}
/* Eine Abfrage in einem Bereich des Haushalts. Firestore zählt nur die Zeilen, die zurückkommen. */
const isIn = (field, list) => ({ fieldFilter: { field: { fieldPath: field }, op: "IN", value: { arrayValue: { values: list.map(v => ({ stringValue: v })) } } } });
const atLeast = (field, v) => ({ fieldFilter: { field: { fieldPath: field }, op: "GREATER_THAN_OR_EQUAL", value: { stringValue: v } } });
async function query(id, col, where, env) {
  const q = { from: [{ collectionId: col }], limit: 1000 };
  if (where) q.where = where;
  const res = await fetch(base(env) + id + ":runQuery?key=" + encodeURIComponent(apiKey(env)),
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ structuredQuery: q }) });
  if (!res.ok) throw { status: res.status };
  const rows = await res.json();
  return (Array.isArray(rows) ? rows : []).filter(r => r && r.document && r.document.name).map(r => docOf(r.document));
}
function version(home) { const v = home && home.calV; return typeof v === "number" && isFinite(v) && v >= 0 ? Math.floor(v) : 0; }

/* ---------- Web Push ---------- */
/* Der Schlüssel, mit dem der Dienst sich bei den Push-Diensten ausweist (VAPID, P-256), folgt fest aus dem Secret:
   nichts zu speichern, und jede Kopie des Dienstes rechnet denselben. */
const VAPID = new Map();
async function vapid(secret) {
  if (VAPID.has(secret)) return VAPID.get(secret);
  const head = [0x30, 0x41, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d,
    0x03, 0x01, 0x07, 0x04, 0x27, 0x30, 0x25, 0x02, 0x01, 0x01, 0x04, 0x20];                 // PKCS #8, P-256, ohne öffentlichen Teil
  for (let i = 0; i < 8; i++) {
    try {
      const d = await hmac(secret, "home-planer-vapid:" + i);
      const key = await crypto.subtle.importKey("pkcs8", concat(new Uint8Array(head), d), { name: "ECDSA", namedCurve: "P-256" }, true, ["sign"]);
      const jwk = await crypto.subtle.exportKey("jwk", key);
      const v = { key, pub: b64url(concat(new Uint8Array([4]), unb64url(jwk.x), unb64url(jwk.y))), jwt: new Map() };
      VAPID.set(secret, v);
      return v;
    } catch (e) { /* ausserhalb der Kurve (fast nie): der nächste Wert */ }
  }
  throw new Error("vapid");
}
async function token(v, aud) {
  const now = Math.floor(Date.now() / 1000), hit = v.jwt.get(aud);
  if (hit && hit.exp - now > 3600) return hit.t;
  const exp = now + 12 * 3600;
  const head = b64url(enc(JSON.stringify({ typ: "JWT", alg: "ES256" }))), body = b64url(enc(JSON.stringify({ aud, exp, sub: APP_URL })));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, v.key, enc(head + "." + body)));
  const t = head + "." + body + "." + b64url(sig);
  v.jwt.set(aud, { t, exp });
  return t;
}
async function hkdf(salt, ikm, info, bytes) {
  const k = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, k, bytes * 8));
}
/* Verschlüsselt einen Text für ein Gerät (RFC 8291, aes128gcm). fixed: feste Schlüssel und Salz, nur für die Tests. */
async function encrypt(p256dh, auth, data, fixed) {
  const s = crypto.subtle, ua = unb64url(p256dh);
  const as = fixed ? fixed.keys : await s.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPub = new Uint8Array(await s.exportKey("raw", as.publicKey));
  const uaKey = await s.importKey("raw", ua, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(await s.deriveBits({ name: "ECDH", public: uaKey }, as.privateKey, 256));
  const salt = fixed ? fixed.salt : crypto.getRandomValues(new Uint8Array(16));
  const ikm = await hkdf(unb64url(auth), shared, concat(enc("WebPush: info\0"), ua, asPub), 32);
  const cek = await hkdf(salt, ikm, enc("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, enc("Content-Encoding: nonce\0"), 12);
  const key = await s.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const sealed = new Uint8Array(await s.encrypt({ name: "AES-GCM", iv: nonce }, key, concat(data, new Uint8Array([2]))));
  const head = new Uint8Array(21);
  head.set(salt); new DataView(head.buffer).setUint32(16, 4096); head[20] = 65;
  return concat(head, asPub, sealed);
}
/* Nur die Push-Dienste der Hersteller: Der Dienst schickt nichts an andere Adressen. */
const PUSH_HOSTS = /^(fcm\.googleapis\.com|android\.googleapis\.com|updates\.push\.services\.mozilla\.com|push\.services\.mozilla\.com|web\.push\.apple\.com|[a-z0-9-]+\.push\.apple\.com|[a-z0-9.-]+\.notify\.windows\.com)$/;
function okEndpoint(u) {
  try { const x = new URL(u); return typeof u === "string" && u.length <= 800 && x.protocol === "https:" && !x.username && !x.password && !x.port && PUSH_HOSTS.test(x.hostname); }
  catch (e) { return false; }
}
function okKeys(k) {
  try { return !!k && typeof k.p256dh === "string" && typeof k.auth === "string" && unb64url(k.p256dh).length === 65 && unb64url(k.p256dh)[0] === 4 && unb64url(k.auth).length === 16; }
  catch (e) { return false; }
}
/* Schickt eine Mitteilung an ein Gerät. Ergebnis: der Status des Push-Dienstes (201 = angenommen). 404 und 410 heissen:
   Das Gerät hat sich abgemeldet; es wird aus der Ablage gelöscht. */
async function deliver(env, dev, payload, ttl, urgent) {
  try {
    const v = await vapid(secretOf(env));
    const data = enc(JSON.stringify(payload).slice(0, 3000));
    const body = await encrypt(dev.k, dev.a, data);
    const res = await fetch(dev.e, { method: "POST", body, headers: {
      "Content-Encoding": "aes128gcm", "Content-Type": "application/octet-stream", TTL: String(ttl || 43200), Urgency: urgent ? "high" : "normal",
      Authorization: "vapid t=" + await token(v, new URL(dev.e).origin) + ", k=" + v.pub } });
    if ((res.status === 404 || res.status === 410) && dev.key && env.HP) await env.HP.delete(dev.key);
    return res.status;
  } catch (e) { return 0; }
}

/* ---------- Ablage der Geräte (Workers KV, Bindung "HP") ---------- */
/* Schlüssel "s:<Haushalt>:<Gerät>". Beide Teile sind Prüfsummen: Aus der Ablage allein lässt sich kein Haushalt öffnen. */
async function homeTag(secret, id) { return b64url(await hmac(secret, "home:" + id)).slice(0, 22); }
async function devTag(endpoint) { return b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", enc(endpoint)))).slice(0, 22); }
const KEEP = 60 * 86400;
async function devices(env, prefix) {
  const out = [];
  let cursor;
  for (let i = 0; i < 20; i++) {
    const r = await env.HP.list({ prefix, cursor, limit: 1000 });
    for (const k of r.keys || []) {
      let d = k.metadata && k.metadata.e ? k.metadata : null;
      if (!d) { try { d = await env.HP.get(k.name, "json"); } catch (e) { d = null; } }
      if (d && d.e) out.push(Object.assign({}, d, { key: k.name, tag: k.name.split(":")[1] }));
    }
    if (r.list_complete || !r.cursor) break;
    cursor = r.cursor;
  }
  return out;
}
const asDev = d => ({ member: d.m, prefs: d.p, quiet: !!d.q });
function localNow() { return HPIcs.utcToLocal(Date.now()).time; }
const TABS = ["home", "kasse", "shop", "recipes", "cal", "plants", "infos"];
async function fanOut(env, id, home, msgs, devs, now) {
  const jobs = [];
  msgs.forEach(m => devs.forEach(d => {
    const x = R.forDevice(m, asDev(d), home, now);
    if (x) jobs.push(deliver(env, d, { title: x.title, body: x.body, tag: x.tag, tab: x.tab, home: id }, m.live ? 21600 : /^ev-/.test(m.tag) ? 3600 : 43200, /^ev-/.test(m.tag)));
  }));
  const res = await Promise.all(jobs);
  return res.filter(s => s >= 200 && s < 300).length;
}
/* Mitteilungen aus der App prüfen: nur bekannte Arten, kurze Texte, immer "live". */
function cleanMsg(m, from) {
  if (!m || typeof m !== "object" || !R.isKind(m.kind)) return null;
  const s = (v, n) => (typeof v === "string" ? v.slice(0, n) : "").trim();
  const title = s(m.title, 120);
  if (!title) return null;
  const to = Array.isArray(m.to) ? m.to.filter(HP.okId).slice(0, 40) : [];
  let per = null;
  if (m.per && typeof m.per === "object") {
    per = {};
    Object.keys(m.per).slice(0, 40).forEach(id => { const p = m.per[id]; if (HP.okId(id) && p && typeof p === "object" && typeof p.title === "string") per[id] = { title: s(p.title, 120), body: s(p.body, 400) }; });
  }
  return { kind: m.kind, tag: s(m.tag, 64).replace(/[^\w.:-]/g, "") || "hp", title, body: s(m.body, 400), to: to.length ? to : null, per,
    tab: TABS.indexOf(m.tab) >= 0 ? m.tab : "home", live: true, from };
}
/* Höchstens 60 Mitteilungen pro Stunde und Haushalt aus der App: Ein Fehler soll niemandes Handy fluten. */
const RATE = new Map();
function allowed(tag, n) {
  const now = Date.now(), list = (RATE.get(tag) || []).filter(t => now - t < 3600000);
  if (list.length + n > 60) { RATE.set(tag, list); return false; }
  for (let i = 0; i < n; i++) list.push(now);
  RATE.set(tag, list);
  return true;
}
const DEV_NAME = /^[A-Za-zÄÖÜäöü ]{1,20}$/;

async function readBody(request) {
  try { const t = await request.text(); return t.length <= 30000 ? JSON.parse(t) : null; } catch (e) { return null; }
}
async function push(path, request, env, secret) {
  if (path === "/push/key" && request.method === "GET") return json({ key: (await vapid(secret)).pub, store: !!env.HP });
  if (request.method !== "POST") return text("Nicht gefunden.", 404);
  if (!env.HP) return json({ error: "store" }, 501);
  const b = await readBody(request);
  const id = b && typeof b.home === "string" ? b.home : "";
  if (!HOME_ID.test(id)) return json({ error: "home" }, 400);
  const tag = await homeTag(secret, id);

  if (path === "/push/unsubscribe") {
    if (typeof b.endpoint !== "string" || b.endpoint.length > 800) return json({ error: "endpoint" }, 400);
    await env.HP.delete("s:" + tag + ":" + await devTag(b.endpoint));
    return json({ ok: true });
  }

  let raw;
  try { raw = await readHome(id, env); } catch (e) { return json({ error: "firebase", status: e && e.status }, 502); }
  const home = raw && HP.normHome(id, raw);
  if (!home) return json({ error: "not-found" }, 404);
  const isMember = m => HP.memberIds(home).indexOf(m) >= 0;

  if (path === "/push/subscribe" || path === "/push/test") {
    const sub = b.sub || {};
    if (!okEndpoint(sub.endpoint) || !okKeys(sub.keys)) return json({ error: "sub" }, 400);
    if (path === "/push/test") {
      const st = await deliver(env, { e: sub.endpoint, k: sub.keys.p256dh, a: sub.keys.auth },
        { title: "✅ Mitteilungen sind eingeschaltet", body: "So sieht eine Mitteilung vom Home-Planer «" + home.name + "» aus.", tag: "test", tab: "home", home: id }, 600, true);
      return json({ ok: st >= 200 && st < 300, status: st });
    }
    if (!isMember(b.member)) return json({ error: "member" }, 400);
    const meta = { h: await seal(secret, id, 0), m: b.member, p: R.prefsOf(b.prefs).join(","), q: b.quiet === false ? 0 : 1,
      d: typeof b.dev === "string" && DEV_NAME.test(b.dev) ? b.dev : "", e: sub.endpoint, k: sub.keys.p256dh, a: sub.keys.auth, t: Date.now() };
    const value = JSON.stringify(meta);
    await env.HP.put("s:" + tag + ":" + await devTag(sub.endpoint), value, { expirationTtl: KEEP, metadata: value.length <= 1000 ? meta : { big: 1 } });
    return json({ ok: true });
  }

  if (path === "/push/send") {
    if (b.from != null && !isMember(b.from)) return json({ error: "member" }, 400);           // ohne «Ich» auf dem Gerät: an alle
    const msgs = (Array.isArray(b.msgs) ? b.msgs.slice(0, 10) : []).map(m => cleanMsg(m, b.from || null)).filter(Boolean);
    if (!msgs.length) return json({ error: "msgs" }, 400);
    if (!allowed(tag, msgs.length)) return json({ error: "rate" }, 429);
    const devs = await devices(env, "s:" + tag + ":");
    return json({ sent: await fanOut(env, id, home, msgs, devs, localNow()), devices: devs.length });
  }

  if (path === "/push/status") {
    const devs = await devices(env, "s:" + tag + ":");
    const cron = Number(await env.HP.get("cron")) || 0;
    return json({ devices: devs.filter(d => isMember(d.m)).map(d => ({ member: d.m, dev: d.d || "", prefs: R.prefsOf(d.p) })), cron });
  }
  return text("Nicht gefunden.", 404);
}

/* ---------- Anfragen ---------- */
async function handle(request, env) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const secret = secretOf(env);
  if (!secret) return text("Der Dienst ist noch nicht fertig eingerichtet: Es fehlt das Secret DIENST_SCHLUESSEL (mindestens 16 Zeichen).", 500);
  if (url.pathname === "/" || url.pathname === "") {
    return text("Home-Planer Dienst: bereit. Kalender: ja. Mitteilungen: " + (env.HP ? "ja" : "noch nicht (die Ablage HP fehlt, siehe README)") + ".");
  }
  if (url.pathname.startsWith("/push/")) return push(url.pathname, request, env, secret);

  if (url.pathname === "/token" && request.method === "POST") {
    const body = await readBody(request);
    const id = body && typeof body.home === "string" ? body.home : "";
    if (!HOME_ID.test(id)) return json({ error: "home" }, 400);
    try {
      const home = await readHome(id, env);
      if (!home) return json({ error: "not-found" }, 404);
      return json({ token: await seal(secret, id, version(home)) });
    } catch (e) { return json({ error: "firebase", status: e && e.status }, 502); }
  }

  const m = /^\/kalender\/([A-Za-z0-9_-]+?)(?:\.ics)?$/.exec(url.pathname);
  if (m && (request.method === "GET" || request.method === "HEAD")) {
    const key = await open(secret, m[1]);
    if (!key) return text("Diesen Kalender gibt es nicht.", 404);
    try {
      const home = await readHome(key.home, env);
      if (!home || version(home) !== key.v) return text("Dieser Kalender-Link gilt nicht mehr. In der App gibt es einen neuen.", 404);
      const names = {};
      for (const k in home.members || {}) { const mm = home.members[k]; if (mm && typeof mm.name === "string") names[k] = mm.name.slice(0, 60); }
      const kinds = (url.searchParams.get("arten") || "").split(",").filter(k => HPIcs.KINDS[k]);
      const body = HPIcs.build({ home: typeof home.name === "string" ? home.name : "Haushalt", names, events: await readEvents(key.home, env), kinds, now: Date.now() });
      return new Response(request.method === "HEAD" ? null : body, { headers: Object.assign({
        "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": "inline; filename=\"home-planer.ics\"", "Cache-Control": "public, max-age=300" }, CORS) });
    } catch (e) { return text("Firebase hat nicht geantwortet. Später nochmals versuchen.", 502); }
  }
  return text("Nicht gefunden.", 404);
}

/* ---------- Zeitplan: alle 15 Minuten ---------- */
/* Liest für jeden Haushalt mit angemeldeten Geräten nur, was jetzt fällig sein kann (siehe needs in erinnerungen.js).
   null: den Haushalt gibt es nicht mehr; false: nichts zu tun. */
async function gather(id, n, env) {
  const events = new Map(), add = list => list.forEach(d => { const e = HP.normEvent(d.id, d); if (e) events.set(e.id, e); });
  add(await query(id, "events", isIn("time", n.times), env));
  if (n.recurring) {
    add(await query(id, "events", isIn("repeat", ["weekly", "biweekly", "monthly", "yearly"]), env));
    add(await query(id, "events", isIn("date", n.days), env));
  }
  const norm = (list, fn) => list.map(d => fn(d.id, d)).filter(Boolean);
  const plants = n.plants ? norm(await query(id, "plants", null, env), HP.normPlant) : [];
  const infos = n.infos ? norm(await query(id, "infos", null, env), HP.normInfo) : [];
  const expenses = n.month ? norm(await query(id, "expenses", atLeast("date", n.month + "-01"), env), HP.normExpense) : [];
  if (!events.size && !plants.length && !infos.length && !expenses.length) return false;
  const raw = await readHome(id, env), home = raw && HP.normHome(id, raw);
  if (!home) return null;
  return { home, events: Array.from(events.values()), plants, infos, expenses };
}
async function remind(env, when) {
  const secret = secretOf(env);
  if (!env.HP || !secret) return { homes: 0, sent: 0 };
  const n = R.needs(when), groups = new Map();
  (await devices(env, "s:")).forEach(d => { if (!groups.has(d.tag)) groups.set(d.tag, []); groups.get(d.tag).push(d); });
  let sent = 0;
  for (const devs of groups.values()) {
    let id = null;
    for (const d of devs) { const k = await open(secret, d.h); if (k) { id = k.home; break; } }
    if (!id) continue;
    try {
      const data = await gather(id, n, env);
      if (data === null) { await Promise.all(devs.map(d => env.HP.delete(d.key))); continue; }   // Haushalt gelöscht
      if (data) sent += await fanOut(env, id, data.home, R.due(Object.assign(data, { at: when })), devs, n.slot.time);
    } catch (e) { /* ein Haushalt soll die anderen nicht aufhalten */ }
  }
  if (n.slot.time.slice(3) === "00") await env.HP.put("cron", String(Date.now()));   // für die Anzeige in der App: der Zeitplan läuft
  return { homes: groups.size, sent };
}

export default {
  fetch: handle,
  scheduled(controller, env, ctx) { ctx.waitUntil(remind(env, controller.scheduledTime || Date.now())); }
};
