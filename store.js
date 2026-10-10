/* Home-Planer: Speicher.
   Zwei Wege mit derselben Schnittstelle:
   "local" = nur dieses Gerät (localStorage),
   "cloud" = Firebase Firestore: Live-Sync für den Haushalt, schreibt auch ohne Netz und gleicht später ab.
   Ein Haushalt ist ein Dokument (Name, Personen, Währung) mit sechs Bereichen darunter: Kasse, Einkaufsliste, Kalender,
   Pflanzen, Infos und Rezepte. Jeder Eintrag ist ein eigenes Dokument, damit gleichzeitige Änderungen sich nicht überschreiben.
   Welche Haushalte dieses Gerät kennt, steht im Verzeichnis ("registry"). */
window.HPStore = (function () {
  "use strict";
  var HP = window.HP;
  var RAW = window.HOMEPLANER_CONFIG;
  var CFG = (RAW && typeof RAW === "object" && RAW.firebase) || null;
  function filled(v) { v = typeof v === "string" ? v.trim() : ""; return v.length >= 4 && !/\s|\.\.\.|…/.test(v); }
  var cloudOn = !!(CFG && typeof CFG === "object" && filled(CFG.projectId) && filled(CFG.apiKey));
  /* Zustand der Datei config.js: "on" = Gruppen-Sync eingerichtet, "off" = bewusst leer gelassen,
     "incomplete" = Angaben fehlen oder sind noch Platzhalter, "broken" = die Datei liess sich nicht lesen (Tippfehler). */
  var configState = !RAW || typeof RAW !== "object" ? "broken" : cloudOn ? "on" : CFG ? "incomplete" : "off";
  /* Kalender-Dienst für Abos in Outlook und im iPhone-Kalender (kalender-worker.js): nur eine schlichte https-Adresse. */
  var CAL = RAW && typeof RAW === "object" && typeof RAW.calendar === "string" && /^https:\/\/[A-Za-z0-9.-]+(:\d+)?(\/[A-Za-z0-9._~\/-]*)?$/.test(RAW.calendar.trim())
    ? RAW.calendar.trim().replace(/\/+$/, "") : "";

  /* Die Bereiche eines Haushalts und wie ihre Einträge gelesen werden. */
  var COLS = ["expenses", "shopping", "events", "plants", "infos", "recipes"];
  var NORM = { expenses: HP.normExpense, shopping: HP.normItem, events: HP.normEvent, plants: HP.normPlant, infos: HP.normInfo, recipes: HP.normRecipe };
  function okCol(col) { return COLS.indexOf(col) >= 0; }

  /* Lässt der Browser überhaupt etwas speichern? Im privaten Modus oder mit gesperrten Website-Daten nicht. */
  var storageOk = (function () { try { localStorage.setItem("hp.probe", "1"); localStorage.removeItem("hp.probe"); return true; } catch (e) { return false; } })();
  var idbOk = (function () { try { return !!window.indexedDB; } catch (e) { return false; } })();

  /* ---------- Helfer ---------- */
  function read(key, fallback) { try { var v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function merge(target, patch) {
    for (var k in patch) {
      var a = target[k], b = patch[k];
      if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) merge(a, b); else target[k] = b;
    }
  }
  /* Zufällige Kennung ohne verwechselbare Zeichen. 22 Zeichen sind rund 128 Bit: nicht zu erraten. */
  var ALPHA = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  function randomId(n, prefix) {
    var a = new Uint32Array(n), s = prefix || "";
    (window.crypto || window.msCrypto).getRandomValues(a);
    for (var i = 0; i < n; i++) s += ALPHA.charAt(a[i] % ALPHA.length);
    return s;
  }
  function validId(id) { return typeof id === "string" && /^[A-Za-z0-9]{16,40}$/.test(id) && !(id in Object.prototype); }
  function docId(id) { return typeof id === "string" && /^[A-Za-z0-9]{4,40}$/.test(id) && !(id in Object.prototype); }
  function idFromLink(text) {
    var t = String(text || "").trim(), m = /#([A-Za-z0-9]{16,40})(?![A-Za-z0-9])/.exec(t);
    if (m) return validId(m[1]) ? m[1] : null;
    return validId(t) ? t : null;
  }
  function linkFor(id) { return location.origin + location.pathname + "#" + id; }

  /* ---------- Verzeichnis der Haushalte auf diesem Gerät ---------- */
  /* Die Kennung eines geteilten Haushalts ist sein Schlüssel. Sie steht nur im Speicher dieses Browsers und im Einladungslink
     (hinter dem #, also nie in einer Anfrage an den Webserver), nicht in Cookies. */
  var REG = "hp.homes", regMem = null;
  function okEntry(e) { return e && validId(e.id) && (e.mode === "local" || e.mode === "cloud"); }
  function regList() {
    var l = regMem || read(REG, []);
    return (Array.isArray(l) ? l.filter(okEntry) : []).sort(function (a, b) { return (b.seen || 0) - (a.seen || 0) || (a.id < b.id ? -1 : 1); });
  }
  function regSave(list) {
    try { localStorage.setItem(REG, JSON.stringify(list)); regMem = null; }
    catch (e) { regMem = clone(list); }                               // ohne Speicher gilt das Verzeichnis nur für diese Sitzung
  }
  function regGet(id) { return regList().filter(function (e) { return e.id === id; })[0] || null; }
  function regPut(entry) {
    var list = regList(), hit = null;
    list.forEach(function (e) { if (e.id === entry.id) hit = e; });
    if (hit) { if (typeof entry.name === "string" && entry.name) hit.name = entry.name; if (entry.mode) hit.mode = entry.mode; }
    else list.push({ id: entry.id, name: entry.name || "", mode: entry.mode, seen: Date.now() });
    regSave(list);
  }
  function regTouch(id) { var list = regList(); list.forEach(function (e) { if (e.id === id) e.seen = Date.now(); }); regSave(list); }
  function regRemove(id) { regSave(regList().filter(function (e) { return e.id !== id; })); }

  /* ---------- "local": nur dieses Gerät ---------- */
  var subs = Object.create(null);
  function lkey(id) { return "hp.h." + id; }
  function lget(id) {
    var d = read(lkey(id), null);
    if (!d || typeof d !== "object" || !d.home || typeof d.home !== "object") return null;
    if (!d.cols || typeof d.cols !== "object") d.cols = {};
    COLS.forEach(function (c) { if (!d.cols[c] || typeof d.cols[c] !== "object") d.cols[c] = {}; });
    return d;
  }
  function lnotify(id) { (subs[id] || []).slice().forEach(function (fn) { try { fn(); } catch (e) { /* ein Zuhörer darf die anderen nicht stören */ } }); }
  function lput(id, d) {
    try { localStorage.setItem(lkey(id), JSON.stringify(d)); } catch (e) { throw { code: "storage" }; }
    lnotify(id);
  }
  function lwatch(id, fn) {
    (subs[id] || (subs[id] = [])).push(fn);
    var t = setTimeout(fn, 0);
    return function () { clearTimeout(t); subs[id] = (subs[id] || []).filter(function (x) { return x !== fn; }); };
  }
  function lrun(job) { return new Promise(function (resolve, reject) { try { resolve(job()); } catch (e) { reject(e && e.code ? e : { code: "storage" }); } }); }
  window.addEventListener("storage", function (e) { if (e.key && e.key.indexOf("hp.h.") === 0) lnotify(e.key.slice(5)); });
  var NOW = { cached: false, pending: false };
  var local = {
    watchHome: function (id, onData) { return lwatch(id, function () { var d = lget(id); onData(d ? d.home : null, NOW); }); },
    watchCol: function (id, col, onData) {
      return lwatch(id, function () {
        var d = lget(id), rows = (d && d.cols[col]) || {};
        onData(Object.keys(rows).sort().map(function (k) { return { id: k, data: rows[k] }; }), NOW);
      });
    },
    createHome: function (id, data) { return lrun(function () { var cols = {}; COLS.forEach(function (c) { cols[c] = {}; }); lput(id, { home: clone(data), cols: cols }); }); },
    patchHome: function (id, patch) { return lrun(function () { var d = lget(id); if (!d) throw { code: "not-found" }; merge(d.home, clone(patch)); lput(id, d); }); },
    saveDoc: function (hid, col, id, body) { return lrun(function () { var d = lget(hid); if (!d) throw { code: "not-found" }; d.cols[col][id] = clone(body); lput(hid, d); }); },
    patchDoc: function (hid, col, id, patch) {
      return lrun(function () {
        var d = lget(hid);
        if (!d) throw { code: "not-found" };
        if (!d.cols[col][id]) throw { code: "doc-gone" };
        merge(d.cols[col][id], clone(patch)); lput(hid, d);
      });
    },
    removeDoc: function (hid, col, id) { return lrun(function () { var d = lget(hid); if (!d) return; delete d.cols[col][id]; lput(hid, d); }); },
    removeHome: function (hid) { return lrun(function () { try { localStorage.removeItem(lkey(hid)); } catch (e) { throw { code: "storage" }; } lnotify(hid); }); }
  };

  /* ---------- "cloud": Firebase Firestore ---------- */
  var fbPromise = null, lateHandlers = [];
  /* Einträge ohne Netz überstehen einen Neustart nur, wenn der Browser dauerhaft speichern lässt. */
  var cloudDurable = storageOk && idbOk;
  function fb() {
    if (!cloudOn) return Promise.resolve(null);
    if (!fbPromise) {
      fbPromise = import("./vendor-firebase.js").then(function (m) {
        /* Ein eigener App-Name: Unter derselben Adresse kann die Ferienkasse mit demselben Firebase-Projekt laufen,
           und jede App soll ihren eigenen Zwischenspeicher im Browser haben. */
        var app = m.initializeApp(CFG, "homeplaner"), db;
        /* Dauerhafter Zwischenspeicher, für mehrere Tabs. Lässt der Browser nichts speichern, bewusst nur im Arbeitsspeicher:
           die Bibliothek fängt nicht jeden dieser Fälle selbst ab. */
        try { db = m.initializeFirestore(app, { localCache: cloudDurable ? m.persistentLocalCache({ tabManager: m.persistentMultipleTabManager() }) : m.memoryLocalCache() }); }
        catch (e) { db = m.getFirestore(app); }
        return { m: m, db: db };
      });
      fbPromise.catch(function () { fbPromise = null; });
    }
    return fbPromise;
  }
  /* Kehrt die Seite aus dem Zwischenspeicher des Browsers zurück (zurück/vorwärts), hat die Sync-Bibliothek ihre Arbeit
     bereits beendet und nimmt nichts mehr an. Dann hilft nur ein frischer Start. */
  var wasHidden = false;
  function revive(e) { if (fbPromise && (wasHidden || (e && e.persisted))) location.reload(); }
  window.addEventListener("pagehide", function () { wasHidden = true; });
  window.addEventListener("pageshow", revive);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") revive(null); });

  /* Fehler der Bibliothek auf die Wörter der App bringen. Ohne Code ist es ein innerer Fehler: da hilft neu laden. */
  function coded(e) { return e && typeof e.code === "string" ? e : { code: "internal", message: String((e && e.message) || e || "") }; }
  /* Ein Schreibvorgang meldet "unavailable" nur, wenn er sich schon auf dem Gerät nicht ablegen liess. */
  function writeError(e) { e = coded(e); return e.code === "unavailable" ? { code: "storage", message: e.message } : e; }
  function withDb(fn) {
    return fb().then(function (c) { if (!c) throw { code: "unconfigured" }; return c; }, function () { throw { code: "unavailable" }; })
      .then(function (c) { return Promise.resolve().then(function () { return fn(c); }).catch(function (e) { throw coded(e); }); });
  }
  function late(e) { lateHandlers.slice().forEach(function (fn) { try { fn(e); } catch (x) { /* Meldung ist Zugabe */ } }); }
  /* Ein Schreibvorgang gilt als angenommen, sobald der Server bestätigt hat oder er sicher in der Warteschlange liegt.
     Lehnt der Server später ab (zum Beispiel wegen der Regeln), geht die Meldung an onLateError. */
  function send(p) {
    return new Promise(function (resolve, reject) {
      var waiting = true;
      var t = setTimeout(function () { waiting = false; resolve("queued"); }, navigator.onLine === false ? 30 : 1500);
      p.then(function () { clearTimeout(t); if (waiting) { waiting = false; resolve("done"); } },
        function (e) { clearTimeout(t); e = writeError(e); if (waiting) { waiting = false; reject(e); } else late(e); });
    });
  }
  function flat(obj, prefix, out) {
    for (var k in obj) {
      var v = obj[k], path = prefix ? prefix + "." + k : k;
      if (v && typeof v === "object" && !Array.isArray(v)) flat(v, path, out); else out[path] = v;
    }
    return out;
  }
  function watch(make, map, onData, onError) {
    var stop = function () {}, dead = false;
    function fail(e) { if (!dead) onError(coded(e)); }
    fb().then(function (c) {
      if (dead) return;
      if (!c) { fail({ code: "unconfigured" }); return; }
      try {
        stop = c.m.onSnapshot(make(c), { includeMetadataChanges: true },
          function (snap) { if (!dead) onData(map(snap), { cached: !!snap.metadata.fromCache, pending: !!snap.metadata.hasPendingWrites }); }, fail);
      } catch (e) { fail(e); }
    }, function () { fail({ code: "unavailable" }); });
    return function () { dead = true; try { stop(); } catch (e) { /* schon beendet */ } };
  }
  function homeRef(c, id) { return c.m.doc(c.db, "homes", id); }
  function docRef(c, hid, col, id) { return c.m.doc(c.db, "homes", hid, col, id); }
  var cloud = {
    watchHome: function (id, onData, onError) {
      return watch(function (c) { return homeRef(c, id); }, function (snap) { return snap.exists() ? snap.data() : null; }, onData, onError);
    },
    watchCol: function (id, col, onData, onError) {
      return watch(function (c) { return c.m.collection(c.db, "homes", id, col); },
        function (snap) { return snap.docs.map(function (d) { return { id: d.id, data: d.data() }; }); }, onData, onError);
    },
    createHome: function (id, data) { return withDb(function (c) { return send(c.m.setDoc(homeRef(c, id), clone(data))); }); },
    /* Feldgenau schreiben ("members.abc.name"), damit gleichzeitige Änderungen anderer nicht überschrieben werden. */
    patchHome: function (id, patch) { return withDb(function (c) { return send(c.m.updateDoc(homeRef(c, id), flat(clone(patch), "", {}))); }); },
    saveDoc: function (hid, col, id, body) { return withDb(function (c) { return send(c.m.setDoc(docRef(c, hid, col, id), clone(body))); }); },
    /* Abhaken, Giessen und Ähnliches ändert nur einzelne Felder. Ist der Eintrag inzwischen gelöscht, sagt die Meldung das. */
    patchDoc: function (hid, col, id, patch) {
      return withDb(function (c) {
        return send(c.m.updateDoc(docRef(c, hid, col, id), flat(clone(patch), "", {})).catch(function (e) { throw e && e.code === "not-found" ? { code: "doc-gone" } : e; }));
      });
    },
    removeDoc: function (hid, col, id) { return withDb(function (c) { return send(c.m.deleteDoc(docRef(c, hid, col, id))); }); },
    /* refs: alle Einträge des Haushalts als [{ col, id }]. Erst verschwindet der Haushalt selbst (damit ist er für alle weg),
       dann räumen wir die Einträge darunter auf. */
    removeHome: function (hid, refs) {
      return withDb(function (c) {
        return send(c.m.deleteDoc(homeRef(c, hid))).then(function (r) {
          (refs || []).forEach(function (x) { if (okCol(x.col) && docId(x.id)) c.m.deleteDoc(docRef(c, hid, x.col, x.id)).catch(function () {}); });
          return r;
        });
      });
    }
  };
  function within(p, ms) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject({ code: "timeout" }); }, ms);
      p.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(coded(e)); });
    });
  }
  /* Anders als die laufende Synchronisation melden Einzelanfragen genau, was dem Server nicht passt:
     Datenbank fehlt ("not-found"), Regeln fehlen ("permission-denied"), Angaben falsch ("invalid-argument"), Kontingent leer. */
  function setupCode(e) { return e && e.code === "not-found" ? { code: "setup-db", message: e.message } : e; }

  /* Einen Haushalt vom Gerät in den Gruppen-Sync heben, in bestätigten Schritten direkt beim Server (nichts davon wartet
     unbemerkt in einer Warteschlange). Erst wenn der Server genau den Stand des Geräts hat, wird die Kopie auf dem Gerät entfernt.
     Was während des Hochladens noch auf dem Gerät eingetragen wird, geht in der nächsten Runde mit. */
  /* Zwei Aufrufe für denselben Haushalt (etwa aus zwei Dialogen) teilen sich ein Hochladen: Sonst fände der zweite die
     Kopie des Geräts nicht mehr vor, sobald der erste fertig ist, und meldete einen Fehler, obwohl alles geklappt hat. */
  var publishing = Object.create(null);
  function publish(id) {
    if (!publishing[id]) {
      var done = function () { delete publishing[id]; };
      publishing[id] = publishOnce(id);
      publishing[id].then(done, done);
    }
    return publishing[id];
  }
  function publishOnce(id) {
    return withDb(function (c) {
      var m = c.m, sent = Object.create(null), rounds = 0;
      function ref(key) {
        if (key === "home") return homeRef(c, id);
        var p = key.split("/");
        return docRef(c, id, p[1], p[2]);
      }
      function round() {
        var d = lget(id);
        if (!d) throw { code: "gone" };
        var want = Object.create(null), ops = [];
        want.home = JSON.stringify(d.home);
        COLS.forEach(function (col) { Object.keys(d.cols[col]).forEach(function (k) { if (docId(k)) want["c/" + col + "/" + k] = JSON.stringify(d.cols[col][k]); }); });
        Object.keys(want).forEach(function (key) { if (sent[key] !== want[key]) ops.push({ key: key, json: want[key] }); });
        Object.keys(sent).forEach(function (key) { if (!(key in want)) ops.push({ key: key, json: null }); });
        if (!ops.length) return null;                                  // der Server hat alles
        if (++rounds > 25) throw { code: "aborted" };
        ops.sort(function (a, b) { return (a.key === "home" ? 0 : 1) - (b.key === "home" ? 0 : 1); });
        var chunks = [];
        for (var i = 0; i < ops.length; i += 200) chunks.push(ops.slice(i, i + 200));
        return chunks.reduce(function (p, chunk) {
          return p.then(function () {
            return within(m.runTransaction(c.db, function (tx) {
              chunk.forEach(function (op) { if (op.json === null) tx.delete(ref(op.key)); else tx.set(ref(op.key), JSON.parse(op.json)); });
              return Promise.resolve();
            }, { maxAttempts: 1 }), 20000);
          }).then(function () {
            chunk.forEach(function (op) { if (op.json === null) delete sent[op.key]; else sent[op.key] = op.json; });
          });
        }, Promise.resolve()).then(round);
      }
      return Promise.resolve().then(round).catch(function (e) { throw setupCode(coded(e)); });
    }).then(function () {
      try { localStorage.removeItem(lkey(id)); } catch (e) { /* die Kopie darf bleiben */ }
    });
  }

  /* Prüft den Gruppen-Sync mit einer echten Einzelanfrage an den Server. Kommt ein Ergebnis, stimmen Projekt, Datenbank und Regeln.
     Mehrere Aufrufe kurz hintereinander teilen sich eine Anfrage. */
  var checking = null;
  function checkCloud() {
    if (!checking) {
      checking = withDb(function (c) {
        return within(c.m.getCountFromServer(c.m.collection(c.db, "homes", "probe" + randomId(18), "expenses")), 15000);
      }).then(function () { checking = null; return true; }, function (e) { checking = null; throw setupCode(coded(e)); });
    }
    return checking;
  }
  /* Unversandte Einträge einer früheren Sitzung gehen nur hinaus, wenn die Sync-Bibliothek läuft. Kennt dieses Gerät einen
     geteilten Haushalt, wird sie deshalb kurz nach dem Start geladen, auch wenn nur die Liste offen ist. */
  if (cloudOn && regList().some(function (e) { return e.mode === "cloud"; })) setTimeout(function () { fb().catch(function () {}); }, 2000);

  /* ---------- Kalender-Abo ---------- */
  /* Holt beim Kalender-Dienst den Schlüssel für den Kalender eines Haushalts. Der Schlüssel verrät die Kennung nicht. */
  function calendarToken(id) {
    if (!CAL) return Promise.reject({ code: "cal-none" });
    var ctl = typeof AbortController === "function" ? new AbortController() : null, t = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    return fetch(CAL + "/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ home: id }), signal: ctl ? ctl.signal : undefined, cache: "no-store" })
      .then(function (res) {
        clearTimeout(t);
        if (res.status === 404) throw { code: "cal-unknown" };
        if (res.status === 500) throw { code: "cal-setup" };
        if (!res.ok) throw { code: "cal-firebase" };
        return res.json();
      }, function () { clearTimeout(t); throw { code: "cal-offline" }; })
      .then(function (r) { if (!r || typeof r.token !== "string" || !/^[A-Za-z0-9_-]{40,200}$/.test(r.token)) throw { code: "cal-firebase" }; return r.token; });
  }
  function calendarUrl(token, kinds) {
    return CAL + "/kalender/" + token + ".ics" + (kinds && kinds.length ? "?arten=" + kinds.join(",") : "");
  }

  /* ---------- Sicherung ---------- */
  /* cols: { expenses: [...], shopping: [...], ... } mit den gelesenen Einträgen (jeweils mit id). */
  function backup(home, cols) {
    var out = {};
    COLS.forEach(function (c) { out[c] = ((cols && cols[c]) || []).map(function (e) { return clone(e); }); });
    return {
      format: "homeplaner", version: 1, exported: new Date().toISOString(),
      home: { name: home.name, base: home.base, rates: home.rates || {}, members: home.members || {}, created: home.created || 0, store: home.store || "", aisles: home.aisles || {}, gf: !!home.gf },
      cols: out
    };
  }
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent || "") || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  function viaLink(filename, json, type) {
    var url = URL.createObjectURL(new Blob([json], { type: type || "application/json" })), a = document.createElement("a");
    a.href = url; a.download = filename; a.style.display = "none";
    document.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 4000);
    return "saved";
  }
  /* Übergibt die Sicherung als Datei. In der App vom Home-Bildschirm des iPhones ist ein gewöhnlicher Download unzuverlässig;
     dort öffnet sich das Teilen-Menü ("In Dateien sichern", AirDrop, Mail). */
  /* obj: ein Objekt (wird JSON) oder fertiger Text mit seinem Typ, etwa eine Kalenderdatei ("text/calendar"). */
  function download(filename, obj, type) {
    var json = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
    type = type || "application/json";
    try {
      if (isIOS && navigator.standalone === true && typeof File === "function" && navigator.canShare && navigator.share) {
        var file = new File([json], filename, { type: type });
        if (navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file] }).then(function () { return "shared"; },
            function (e) { return e && e.name === "AbortError" ? "cancelled" : viaLink(filename, json, type); });
        }
      }
    } catch (e) { /* dann der gewöhnliche Weg */ }
    return Promise.resolve(viaLink(filename, json, type));
  }
  /* Liest eine Sicherung ein und legt sie als neuen Haushalt auf diesem Gerät an. Jedes Feld wird geprüft. */
  function importBackup(obj) {
    if (!obj || typeof obj !== "object" || obj.format !== "homeplaner" || !obj.home) throw { code: "format" };
    var id = randomId(22), home = HP.normHome(id, obj.home);
    if (!home || !Object.keys(home.members).length) throw { code: "format" };
    /* Gibt es auf diesem Gerät schon einen Haushalt mit demselben Namen, bekommt der eingelesene einen Zusatz. */
    var name = home.name, taken = Object.create(null), n = 1;
    regList().forEach(function (e) { if (e.name) taken[e.name] = 1; });
    if (taken[name]) {
      var stem = name.slice(0, 60);
      name = stem + " (Sicherung)";
      while (taken[name]) { n++; name = stem + " (Sicherung " + n + ")"; }
    }
    var data = { name: name, base: home.base, rates: home.rates, members: home.members, created: home.created || Date.now(), store: home.store, aisles: home.aisles, gf: home.gf }, cols = {}, count = 0;
    var src = obj.cols && typeof obj.cols === "object" ? obj.cols : {};
    COLS.forEach(function (col) {
      cols[col] = {};
      (Array.isArray(src[col]) ? src[col].slice(0, 5000) : []).forEach(function (raw, i) {
        var eid = raw && docId(raw.id) ? raw.id : "x" + i + randomId(6), e = NORM[col](eid, raw);
        if (!e) return;
        var body = clone(e); delete body.id;
        if (col === "recipes") body.notes = HP.notesMap(e.notes);           // Notizen als Tabelle, damit neue dazukommen können
        cols[col][eid] = body; count++;
      });
    });
    lput(id, { home: data, cols: cols });
    regPut({ id: id, name: name, mode: "local" });
    return { id: id, name: name, count: count };
  }

  return {
    calendarService: CAL, calendarToken: calendarToken, calendarUrl: calendarUrl,
    cloudOn: cloudOn, configState: configState, projectId: cloudOn ? String(CFG.projectId) : "",
    storageOk: storageOk, cloudDurable: cloudDurable, COLS: COLS, NORM: NORM,
    randomId: randomId, validId: validId, idFromLink: idFromLink, linkFor: linkFor,
    registry: { list: regList, get: regGet, put: regPut, touch: regTouch, remove: regRemove },
    adapter: function (mode) { return mode === "cloud" ? cloud : local; },
    onLateError: function (fn) { lateHandlers.push(fn); return function () { lateHandlers = lateHandlers.filter(function (x) { return x !== fn; }); }; },
    publish: publish, checkCloud: checkCloud, backup: backup, download: download, importBackup: importBackup
  };
})();
