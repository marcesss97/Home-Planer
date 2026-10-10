/* Home-Planer: Kalenderdateien im Format iCalendar (RFC 5545), das Outlook, der iPhone-Kalender und Google lesen.
   build() macht aus den Terminen eines Haushalts einen Kalender; parse() liest Termine aus einer .ics-Datei.
   Ohne Abhängigkeiten: Dieselbe Datei läuft im Browser (window.HPIcs) und, als Kopie, im Kalender-Dienst
   kalender-worker.js. Wer hier etwas ändert, übernimmt es dort mit: node tests/kalender.test.js --update.
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
