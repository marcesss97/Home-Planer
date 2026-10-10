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
