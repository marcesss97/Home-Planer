/* Home-Planer: Mitteilungen auf diesem Gerät. Meldet das Gerät beim Dienst (dienst-worker.js) an und ab, hält die Anmeldung
   frisch und schickt den anderen eine Mitteilung, wenn hier etwas Neues eingetragen wird. Was eine Mitteilung sagt und wann
   Erinnerungen kommen, steht in erinnerungen.js.
   Gespeichert wird pro Haushalt nur auf diesem Gerät ("hp.push"): ob Mitteilungen an sind, welche Arten, die Ruhezeit.
   Eine Kopie davon liegt im Zwischenspeicher "hp-push", damit der Service Worker eine erneuerte Anmeldung selbst melden kann. */
window.HPPush = (function () {
  "use strict";
  var HP = window.HP, R = window.HPRemind, Store = window.HPStore;
  var SVC = Store.service;
  var KEY = "hp.push", OUT = "hp.push.out";
  function read(k, fallback) { try { var v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? fallback : v; } catch (e) { return fallback; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ohne Speicher gilt es nur für diese Sitzung */ } }
  var mem = null;
  function state() { var s = mem || read(KEY, {}); return s && typeof s === "object" ? s : {}; }
  function save(s) { mem = s; write(KEY, s); mirror(s); }

  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  function standalone() { try { return navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches; } catch (e) { return false; } }
  function devName() {
    if (/iPhone|iPod/.test(ua)) return "iPhone";
    if (isIOS) return "iPad";
    if (/Android/.test(ua)) return "Android";
    if (/Macintosh/.test(ua)) return "Mac";
    if (/Windows/.test(ua)) return "Windows";
    return "Computer";
  }

  /* Was auf diesem Gerät geht:
     "ok", "none" (kein Dienst in config.js), "ios-install" (iPhone/iPad: erst vom Home-Bildschirm aus, ab iOS 16.4),
     "unsupported" (dieser Browser kann es nicht), "denied" (im Browser oder in den Einstellungen gesperrt) */
  function support() {
    if (!SVC) return "none";
    var has = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    if (!has) return isIOS && !standalone() ? "ios-install" : "unsupported";
    if (Notification.permission === "denied") return "denied";
    return "ok";
  }
  function info(homeId) { var x = state()[homeId]; return x && x.on ? x : null; }

  /* ---------- Gespräch mit dem Dienst ---------- */
  function api(path, body, opt) {
    if (!SVC) return Promise.reject({ code: "push-none" });
    var ctl = typeof AbortController === "function" ? new AbortController() : null, t = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    return fetch(SVC + path, { method: body ? "POST" : "GET", headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined,
      cache: "no-store", keepalive: !!(opt && opt.keepalive), signal: ctl ? ctl.signal : undefined })
      .then(function (res) {
        clearTimeout(t);
        return res.json().catch(function () { return {}; }).then(function (r) {
          if (res.ok) return r;
          var e = r && r.error;
          throw { code: res.status === 501 || e === "store" ? "push-store" : res.status === 500 ? "push-setup" : e === "member" ? "push-member" : e === "not-found" ? "push-unknown"
            : e === "rate" ? "push-rate" : "push-failed", status: res.status };
        });
      }, function () { clearTimeout(t); throw { code: "push-offline" }; });
  }
  function bytes(b64) {
    var s = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64.length + 3) % 4)), out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  /* Der öffentliche Schlüssel des Dienstes. Er ändert sich nur, wenn jemand das Secret beim Dienst ändert. */
  function serviceKey(fresh) {
    var s = state();
    if (s._key && s._svc === SVC && !fresh) return Promise.resolve(s._key);
    return api("/push/key").then(function (r) {
      if (!r || typeof r.key !== "string") throw { code: "push-failed" };
      if (r.store === false) throw { code: "push-store" };
      var s2 = state(); s2._key = r.key; s2._svc = SVC; save(s2);
      return r.key;
    });
  }
  function registration() {
    if (!("serviceWorker" in navigator)) return Promise.reject({ code: "push-sw" });
    return Promise.race([navigator.serviceWorker.ready, new Promise(function (_, no) { setTimeout(function () { no({ code: "push-sw" }); }, 10000); })]);
  }
  function sameKey(sub, key) {
    try {
      var a = new Uint8Array(sub.options.applicationServerKey), b = bytes(key);
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    } catch (e) { return true; }                                      // ältere Browser verraten den Schlüssel nicht
  }
  function subscription(key, create) {
    return registration().then(function (reg) {
      return reg.pushManager.getSubscription().then(function (sub) {
        if (sub && !sameKey(sub, key)) return sub.unsubscribe().then(function () { return null; });
        return sub;
      }).then(function (sub) {
        if (sub || !create) return sub;
        return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: bytes(key) });
      });
    });
  }
  function register(homeId, cfg, sub) {
    return api("/push/subscribe", { home: homeId, member: cfg.member, sub: sub.toJSON(), prefs: cfg.prefs, quiet: cfg.quiet !== false, dev: devName() }).then(function () {
      var s = state();
      s[homeId] = { on: true, member: cfg.member, prefs: R.prefsOf(cfg.prefs), quiet: cfg.quiet !== false, at: Date.now(), ep: sub.endpoint };
      save(s);
      return s[homeId];
    });
  }

  /* ---------- Ein- und ausschalten ---------- */
  /* Aus einem Tipp heraus aufrufen: Die Frage nach der Erlaubnis kommt sonst nicht. cfg: { member, prefs, quiet } */
  function enable(homeId, cfg) {
    if (support() !== "ok") return Promise.reject({ code: "push-" + support() });
    var asked = Notification.permission === "granted" ? Promise.resolve("granted") : Notification.requestPermission();
    return Promise.resolve(asked).then(function (p) {
      if (p !== "granted") throw { code: p === "denied" ? "push-denied" : "push-dismissed" };
      return serviceKey();
    }).then(function (key) { return subscription(key, true); })
      .then(function (sub) { return register(homeId, cfg, sub); });
  }
  /* Andere Arten, andere Person oder Ruhezeit: dieselbe Anmeldung, neue Angaben. */
  function update(homeId, cfg) {
    return serviceKey().then(function (key) { return subscription(key, true); }).then(function (sub) { return register(homeId, cfg, sub); });
  }
  function disable(homeId) {
    var s = state(), was = s[homeId];
    delete s[homeId];
    save(s);
    var others = Object.keys(s).some(function (k) { return k.charAt(0) !== "_" && s[k] && s[k].on; });
    return registration().then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
      if (!sub) return null;
      return api("/push/unsubscribe", { home: homeId, endpoint: sub.endpoint }).catch(function () { return null; })
        .then(function () { return others ? null : sub.unsubscribe(); });
    }).catch(function () { return was; });
  }
  function test(homeId) {
    return serviceKey().then(function (key) { return subscription(key, false); }).then(function (sub) {
      if (!sub) throw { code: "push-gone" };
      return api("/push/test", { home: homeId, sub: sub.toJSON() });
    }).then(function (r) { if (!r || !r.ok) throw { code: "push-delivery", status: r && r.status }; return r; });
  }
  function status(homeId) { return api("/push/status", { home: homeId }); }

  /* Beim Öffnen eines Haushalts: Der Dienst vergisst Geräte, die sich 60 Tage nicht melden, und die Push-Dienste erneuern
     Anmeldungen ab und zu. Darum meldet sich das Gerät spätestens nach einer Woche neu (und fragt dabei auch den Schlüssel des
     Dienstes neu ab, falls jemand das Secret geändert hat), und sofort, wenn sich etwas änderte. */
  function resync(home, member) {
    var cur = info(home.id);
    if (!cur || support() !== "ok" || Notification.permission !== "granted") return Promise.resolve(null);
    var who = member || cur.member, due = Date.now() - (cur.at || 0) >= 7 * 86400000;
    return serviceKey(due).then(function (key) { return subscription(key, true); }).then(function (sub) {
      if (sub.endpoint === cur.ep && who === cur.member && !due) return cur;
      return register(home.id, { member: who, prefs: cur.prefs, quiet: cur.quiet }, sub);
    }).catch(function () { return null; });
  }

  /* Kopie für den Service Worker (Ereignis "pushsubscriptionchange"). */
  function mirror(s) {
    try {
      if (!window.caches) return;
      var homes = Object.keys(s).filter(function (k) { return k.charAt(0) !== "_" && s[k] && s[k].on; })
        .map(function (k) { return { home: k, member: s[k].member, prefs: s[k].prefs, quiet: s[k].quiet !== false, dev: devName() }; });
      caches.open("hp-push").then(function (c) {
        return c.put("state", new Response(JSON.stringify({ svc: SVC, key: s._key || "", homes: homes }), { headers: { "Content-Type": "application/json" } }));
      }).catch(function () {});
    } catch (e) { /* der Service Worker kommt dann ohne aus */ }
  }

  /* ---------- Neue Einträge melden ---------- */
  /* Nur für geteilte Haushalte, in denen jemand Mitteilungen eingeschaltet hat (home.push), und nur für neue Einträge.
     Was jemand kurz nacheinander einträgt, geht als eine Mitteilung hinaus. */
  var COLS = ["shopping", "expenses", "events"], queue = {};
  function canSend(home, mode) { return !!(SVC && mode === "cloud" && home && HP.memberIds(home).length > 1); }
  function changed(home, from, mode, col, doc, isNew) {
    if (!isNew || !doc || COLS.indexOf(col) < 0 || !canSend(home, mode) || !home.push) return;
    var q = queue[home.id] || (queue[home.id] = { cols: {} });
    q.home = home; q.from = from || null;
    (q.cols[col] = q.cols[col] || []).push(doc);
    clearTimeout(q.timer);
    q.timer = setTimeout(function () { flush(home.id); }, col === "expenses" ? 1500 : 8000);
  }
  function flush(id) {
    var q = queue[id];
    if (!q) return;
    delete queue[id]; clearTimeout(q.timer);
    var msgs = [];
    Object.keys(q.cols).forEach(function (col) { msgs = msgs.concat(R.changed(q.home, q.from, col, q.cols[col])); });
    if (msgs.length) send({ home: id, from: q.from, msgs: msgs });
  }
  function flushAll() { Object.keys(queue).forEach(flush); }
  /* Ohne Netz wartet eine Mitteilung bis zu sechs Stunden auf dem Gerät; danach ist sie nicht mehr aktuell. */
  function send(body) {
    return api("/push/send", body, { keepalive: true }).catch(function (e) {
      if (e && e.code === "push-offline") { var out = read(OUT, []); out.push({ at: Date.now(), body: body }); write(OUT, out.slice(-20)); }
      return null;
    });
  }
  function retry() {
    var out = read(OUT, []);
    if (!out.length || navigator.onLine === false) return;
    write(OUT, []);
    out.filter(function (x) { return x && x.body && Date.now() - x.at < 6 * 3600000; }).forEach(function (x) { send(x.body); });
  }
  /* «Ich gehe einkaufen»: sofort, mit der Zahl der offenen Sachen. Ergebnis vom Dienst: { sent, devices } */
  function going(home, from, open) { return api("/push/send", { home: home.id, from: from || null, msgs: [R.going(home, from, open)] }); }

  try {
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flushAll(); });
    window.addEventListener("pagehide", flushAll);
    window.addEventListener("online", retry);
    setTimeout(retry, 4000);
  } catch (e) { /* ohne Fensterereignisse gehen Mitteilungen nach Ablauf der Wartezeit */ }

  return { service: SVC, support: support, info: info, enable: enable, update: update, disable: disable, test: test, status: status, resync: resync,
    serviceKey: serviceKey, canSend: canSend, changed: changed, flush: flushAll, going: going, devName: devName };
})();
