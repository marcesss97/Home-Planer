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
    produce: "apfel äpfel banane birne orange zitrone limette traube beere erdbeer himbeer heidelbeer kiwi mango ananas melone salat gurke tomate rüebli karotte peperoni paprika zwiebel knoblauch kartoffel härdöpfel lauch zucchetti zucchini aubergine brokkoli broccoli blumenkohl kohl spinat pilz champignon avocado ingwer kräuter basilikum petersilie schnittlauch koriander fenchel sellerie kürbis radiesli frucht früchte gemüse obst nektarine pfirsich aprikose zwetschge kirsche",
    bakery: "brot zopf gipfeli weggli brötchen toast baguette ciabatta croissant kuchen tortilla wrap fladen",
    dairy: "milch käse joghurt jogurt yoghurt butter rahm quark mozzarella parmesan gruyère feta eier mascarpone ricotta hüttenkäse crème creme fraîche fraiche skyr",
    meat: "fleisch poulet huhn hähnchen rind schwein hack wurst cervelat salami schinken speck lachs thon fisch crevetten steak filet plätzli bratwurst geschnetzeltes",
    pantry: "pasta teigwaren spaghetti nudeln penne hörnli reis risotto mehl zucker salz pfeffer öl olivenöl essig gewürz konserve bohnen linsen kichererbsen sauce sosse ketchup senf mayo honig konfi marmelade müesli muesli haferflocken cornflakes kaffee tee bouillon tomatenpüree passata nüsse mandeln couscous quinoa tofu hefe backpulver sesam kokosmilch currypaste maizena tortilla",
    frozen: "tiefkühl glace pizza pommes eiswürfel edamame",
    drinks: "wasser mineral saft apfelsaft orangensaft bier wein rotwein weisswein prosecco cola eistee sirup limonade rivella kombucha milchdrink",
    sweets: "schoggi schokolade chips guetzli keks bonbon gummibär snack popcorn riegel praline nutella",
    care: "shampoo duschgel seife zahnpasta zahnbürste deo sonnencreme taschentücher watte rasier tampons binden windeln pflaster medikament dafalgan handcreme bodylotion",
    clean: "putzmittel abwaschmittel spülmittel geschirrspül tabs waschmittel weichspüler wc-papier toilettenpapier haushaltpapier küchenpapier abfallsack kehrichtsack müllsack schwamm lappen entkalker alufolie frischhaltefolie backpapier batterie glühbirne kerze"
  };
  var SHOP_INDEX = [];
  Object.keys(SHOP_WORDS).forEach(function (sec) { SHOP_WORDS[sec].split(" ").forEach(function (w) { SHOP_INDEX.push({ w: w, sec: sec }); }); });
  SHOP_INDEX.sort(function (a, b) { return b.w.length - a.w.length; });
  function shopGuess(name) {
    var t = String(name || "").toLowerCase();
    for (var i = 0; i < SHOP_INDEX.length; i++) if (t.indexOf(SHOP_INDEX[i].w) >= 0) return SHOP_INDEX[i].sec;
    return "other";
  }
  /* Zahlen und Einheiten in Mengenangaben, auch aus Rezepten ("1/2 TL", "½ Bund", "1-2 Zehen"). */
  var NUM = "(?:\\d+\\/\\d+|\\d+(?:[.,]\\d+)?(?:\\s*[-–]\\s*\\d+(?:[.,]\\d+)?)?|[½¼¾⅓⅔])";
  var UNIT = "(?:x|stk\\.?|stück|kg|kilo|g|gramm|l|liter|dl|cl|ml|el|tl|msp|prise|prisen|pack|packung|päckli|paket|pkg\\.?|dose|dosen|flasche|flaschen|bund|beutel|glas|becher|rolle|rollen|schachtel|tube|zehe|zehen|scheibe|scheiben|stange|stangen|zweig|zweige|handvoll|kopf|knolle)";
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
    { id: "prep", label: "Vorkochen", emoji: "📦" }
  ];
  var tagT = table(RECIPE_TAGS, "vegi");
  /* "Schnell" ist, was so markiert ist oder höchstens eine halbe Stunde dauert; vegan ist auch vegi. */
  function hasTag(r, tag) {
    if (tag === "quick") return r.tags.indexOf("quick") >= 0 || (r.time > 0 && r.time <= 30);
    if (tag === "vegi") return r.tags.indexOf("vegi") >= 0 || r.tags.indexOf("vegan") >= 0;
    return r.tags.indexOf(tag) >= 0;
  }
  /* Grundvorrat, den man fast immer zu Hause hat: wird beim Übertragen auf die Einkaufsliste zuerst abgewählt. */
  var STAPLE = /^(salz|pfeffer|salz,? pfeffer.*|muskat|zucker|mehl|öl|olivenöl|rapsöl|bratbutter|essig|wasser|oregano|paprikapulver|kreuzkümmel|backpulver|zimt|chilipulver|bouillon|gemüsebouillon)$/i;
  function isStaple(line) { var n = splitQty(line).name.replace(/\(.*?\)/g, "").replace(/,.*$/, "").trim(); return STAPLE.test(n) || /^salz\b/i.test(n); }
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
    return { id: id, name: text(d.name, 80).trim() || "Haushalt", base: d.base, rates: rates, members: members, created: num0(d.created) };
  }
  function normExpense(id, d) {
    if (!d || typeof d !== "object" || !posNum(d.amount) || typeof d.cur !== "string" || !/^[A-Z]{3}$/.test(d.cur)) return null;
    if (!(Math.round(d.amount) >= 1 && d.amount <= MAX_MINOR)) return null;
    if (!okId(d.payer)) return null;
    var e = { id: id, kind: d.kind === "transfer" ? "transfer" : "expense", title: text(d.title, 120), amount: Math.round(d.amount), cur: d.cur,
      rate: okRate(d.rate) ? d.rate : null, rateAuto: d.rateAuto === true, rateDate: validDate(d.rateDate) ? d.rateDate : "",
      date: validDate(d.date) ? d.date : "", cat: isCat(d.cat) ? d.cat : "other", payer: d.payer,
      by: okId(d.by) ? d.by : null, ts: num0(d.ts), up: num0(d.up) };
    if (e.kind === "transfer") { if (!okId(d.to)) return null; e.to = d.to; return e; }
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
    AVATARS: AVATARS, isAvatar: isAvatar, avatar: avatar, avatarFor: avatarFor, pickAvatar: pickAvatar, meme: meme, memeTotal: memeTotal, EXACT_MAX: EXACT_MAX, MAX_MINOR: MAX_MINOR,
    SHOP: SHOP, shopSec: shopT.get, shopGuess: shopGuess, splitQty: splitQty, normItem: normItem,
    EV_CATS: EV_CATS, evCat: evT.get, REPEATS: REPEATS, occurrences: occurrences, eventCheck: eventCheck, normEvent: normEvent,
    PLANTS: PLANTS, isPlantEmoji: isPlantEmoji, plantEmoji: plantEmoji, plantDue: plantDue, feedDue: feedDue, careFields: careFields, normPlant: normPlant,
    INFO_CATS: INFO_CATS, infoCat: infoT.get, okUrl: okUrl, dueOf: dueOf, normInfo: normInfo,
    DISHES: DISHES, isDish: isDish, dishEmoji: dishEmoji, RECIPE_CATS: RECIPE_CATS, recipeCat: recT.get, RECIPE_TAGS: RECIPE_TAGS, recipeTag: tagT.get, hasTag: hasTag,
    isStaple: isStaple, scaleLine: scaleLine, searchWords: searchWords, recipeMatch: recipeMatch, normRecipe: normRecipe, ideas: ideas, idea: idea,
    okId: okId, hash: hash
  };
})();
