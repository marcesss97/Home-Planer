/* Home-Planer: the shared calendar. A month at a glance with dots on busy days, the chosen day below it, and what is
   coming up in the next weeks. Appointments may last several days and repeat; a single repetition can be cancelled. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP, Store = window.HPStore, Ics = window.HPIcs;
  if (!U) return;
  const { html, docId, Icon, Av, Sheet, DeleteButton, KindPick, PeoplePick, Empty, useBusy } = U;
  const { useState, useMemo, useEffect, useRef } = U.P;

  const WD = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const REP_SHORT = { weekly: "jede Woche", biweekly: "alle 2 Wochen", monthly: "jeden Monat", yearly: "jedes Jahr" };
  function shiftMonth(ym, n) {
    let y = +ym.slice(0, 4), m = +ym.slice(5, 7) + n;
    while (m < 1) { m += 12; y--; }
    while (m > 12) { m -= 12; y++; }
    return y + "-" + HP.pad(m);
  }
  /* Monday to Sunday, whole weeks around the month. */
  function gridOf(ym) {
    const first = ym + "-01", start = HP.addDays(first, -HP.weekday(first));
    const days = HP.daysInMonth(+ym.slice(0, 4), +ym.slice(5, 7)), last = ym + "-" + HP.pad(days);
    const end = HP.addDays(last, 6 - HP.weekday(last)), out = [];
    for (let d = start; d <= end; d = HP.addDays(d, 1)) out.push(d);
    return out;
  }
  function timeText(o) {
    const e = o.e;
    if (o.multi) {
      const n = HP.dayDiff(o.start, o.end) + 1, k = HP.dayDiff(o.start, o.date) + 1;
      if (o.first && e.time) return "ab " + e.time + " · Tag 1 von " + n;
      if (o.last && e.endTime) return "bis " + e.endTime + " · Tag " + k + " von " + n;
      return "Tag " + k + " von " + n;
    }
    if (!e.time) return "ganztägig";
    return e.time + (e.endTime ? "–" + e.endTime : "");
  }

  function EventRow({ o, ctx, showDate }) {
    const e = o.e, cat = HP.evCat(e.cat), who = e.who.map(ctx.who).filter(m => !m.gone);
    const today = HP.today();
    /* A planned meal: the recipe's picture, who cooks, and a tap opens the recipe. */
    const rec = e.cat === "meal" && e.rid && U.findRecipe ? U.findRecipe(ctx, e.rid) : null;
    const when = e.cat === "meal" ? (who.length ? who.map(m => m.name).join(" & ") + (who.length > 1 ? " kochen" : " kocht") : "Essen") + (e.time ? " · " + e.time : "") : timeText(o);
    return html`
      <button type="button" class="x" onClick=${() => (rec ? ctx.open({ t: "recipe", id: rec.id, plan: e.id }) : ctx.open({ t: "event", e, at: o.start }))}>
        <span class=${"x-ic ev-" + cat.id} aria-hidden="true">${rec ? HP.dishEmoji(rec.emoji) : cat.emoji}</span>
        <span class="x-main">
          <span class="x-t">${e.title}</span>
          <span class="x-s">${showDate ? (o.date === today ? "Heute" : HP.dayLabel(o.date)) + " · " : ""}${when}${e.repeat !== "none" ? " · " + REP_SHORT[e.repeat] : ""}</span>
        </span>
        ${who.length > 0 && html`<span class="avs mini" aria-label=${"Betrifft " + who.map(m => m.name).join(", ")}>${who.slice(0, 3).map(m => html`<${Av} key=${m.id} m=${m} s=${1} />`)}</span>`}
      </button>`;
  }

  function Calendar({ ctx }) {
    const { data, open } = ctx;
    const events = data.events;
    const today = HP.today();
    const [month, setMonth] = useState(today.slice(0, 7));
    const [sel, setSel] = useState(today);
    const grid = useMemo(() => gridOf(month), [month]);
    const byDay = useMemo(() => {
      const map = {};
      HP.occurrences(events || [], grid[0], grid[grid.length - 1]).forEach(o => { (map[o.date] || (map[o.date] = [])).push(o); });
      return map;
    }, [events, grid]);
    /* What comes next: every appointment once, at its next date (the weekly rubbish collection does not fill the list). */
    const soon = useMemo(() => {
      const seen = new Set();
      return HP.occurrences(events || [], HP.addDays(today, 1), HP.addDays(today, 30))
        .filter(o => (o.first || o.date === HP.addDays(today, 1)) && !seen.has(o.e.id) && seen.add(o.e.id)).slice(0, 25);
    }, [events, today]);
    const selList = byDay[sel] || (sel < grid[0] || sel > grid[grid.length - 1] ? HP.occurrences(events || [], sel, sel) : []);
    const pick = d => { setSel(d); if (d.slice(0, 7) !== month) setMonth(d.slice(0, 7)); };
    const goToday = () => { setMonth(today.slice(0, 7)); setSel(today); };
    return html`
      <${U.TabHead} emoji="📅" title="Kalender">
        ${(month !== today.slice(0, 7) || sel !== today) && html`<button type="button" class="btn small" onClick=${goToday}>Heute</button>`}
        <button type="button" class="btn small" aria-label="Mit Outlook und iPhone verbinden" onClick=${() => open({ t: "calsync" })}><${Icon} n="link" s=${16} />Outlook & iPhone</button>
      <//>
      ${events === null && html`<p class="status" role="status">Termine werden geladen …</p>`}
      <section class="cal">
        <div class="cal-nav">
          <button type="button" class="icon-btn" aria-label="Vorheriger Monat" onClick=${() => setMonth(shiftMonth(month, -1))}><${Icon} n="back" /></button>
          <h2 class="cal-m" aria-live="polite">${HP.monthLabel(month)}</h2>
          <button type="button" class="icon-btn" aria-label="Nächster Monat" onClick=${() => setMonth(shiftMonth(month, 1))}><${Icon} n="next" /></button>
        </div>
        <div class="cal-grid" role="grid" aria-label=${HP.monthLabel(month)}>
          ${WD.map(w => html`<span key=${w} class="cal-wd" aria-hidden="true">${w}</span>`)}
          ${grid.map(d => {
            const n = (byDay[d] || []).length, out = d.slice(0, 7) !== month;
            return html`
              <button type="button" key=${d} class=${"cal-d" + (out ? " out" : "") + (d === today ? " today" : "")} aria-pressed=${String(d === sel)}
                aria-label=${HP.longDay(d) + (n ? ", " + (n === 1 ? "ein Termin" : n + " Termine") : "")} onClick=${() => pick(d)}>
                <span class="cal-n">${+d.slice(8)}</span>
                <span class="cal-dots" aria-hidden="true">${Array.from({ length: Math.min(3, n) }, (_, i) => html`<i key=${i}></i>`)}</span>
              </button>`;
          })}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <h2 class="sec-h">${sel === today ? "Heute, " + HP.fmtDate(sel, { day: "numeric", month: "long" }) : HP.longDay(sel)}</h2>
          <button type="button" class="btn small" onClick=${() => open({ t: "event", date: sel })}><${Icon} n="plus" s=${16} />Termin</button>
        </div>
        ${selList.length
          ? html`<div class="list flat">${selList.map(o => html`<${EventRow} key=${o.e.id + o.date} o=${o} ctx=${ctx} />`)}</div>`
          : html`<p>Keine Termine an diesem Tag.</p>`}
      </section>
      ${events && !events.length
        ? html`<${Empty} emoji="🗓️" title="Noch keine Termine" text="Trag ein, was alle wissen sollten: die Kehrichtabfuhr jede Woche, Geburtstage, Besuch, Ferien oder wer wann putzt. Wiederkehrendes trägst du nur einmal ein. Geplantes Essen aus den Rezepten erscheint hier auch." />`
        : events && html`
          <section class="stack">
            <h2 class="aisle"><span class="emo" aria-hidden="true">🔜</span>Demnächst<span class="aisle-n">nächste 30 Tage</span></h2>
            ${soon.length
              ? html`<div class="list">${soon.map(o => html`<${EventRow} key=${o.e.id + o.date} o=${o} ctx=${ctx} showDate=${true} />`)}</div>`
              : html`<section class="panel"><p>In den nächsten 30 Tagen steht nichts an.</p></section>`}
          </section>`}`;
  }

  function EventForm({ ctx, ev, date, at, onClose }) {
    const { act, say, meId, members, who } = ctx;
    const people = useMemo(() => {
      const extra = ev ? ev.who.filter(id => !members.some(m => m.id === id)).map(who) : [];
      return members.concat(extra);
    }, [members, ev]);
    const isNew = !ev;
    const [d, setD] = useState(() => ev
      ? { title: ev.title, cat: ev.cat, date: ev.date, end: ev.end, time: ev.time, endTime: ev.endTime, repeat: ev.repeat, until: ev.until, who: ev.who.slice(), note: ev.note }
      : { title: "", cat: "date", date: HP.validDate(date) ? date : HP.today(), end: "", time: "", endTime: "", repeat: "none", until: "", who: [], note: "" });
    const [err, setErr] = useState(null);
    const [busy, run] = useBusy();
    const set = p => { setErr(null); setD(prev => Object.assign({}, prev, p)); };
    const pickCat = cat => set(isNew && d.repeat === "none" && (cat === "birthday" || cat === "trash") ? { cat, repeat: cat === "birthday" ? "yearly" : "weekly" } : { cat });
    const body = () => ({
      id: ev ? ev.id : docId("e"), title: d.title.trim().slice(0, 100), cat: d.cat, date: d.date, end: d.end && d.end !== d.date ? d.end : "",
      time: d.time || "", endTime: d.time && d.endTime ? d.endTime : "", repeat: d.repeat, until: d.repeat !== "none" ? d.until || "" : "",
      who: d.who, note: d.note.trim().slice(0, 1000), skip: ev && d.repeat !== "none" ? ev.skip : [], rid: ev ? ev.rid : null,
      by: ev ? ev.by : meId || null, ts: ev ? ev.ts : Date.now(), up: Date.now()
    });
    const save = () => run(async () => {
      const b = body(), problem = HP.eventCheck(b);
      if (problem) { setErr(problem); return; }
      if (await act.save("events", b)) { onClose(); say(isNew ? "Termin eingetragen." : "Änderung gespeichert."); }
    });
    const del = () => run(async () => { if (await act.remove("events", ev.id)) { onClose(); say(ev.repeat !== "none" ? "Termin mit allen Wiederholungen gelöscht." : "Termin gelöscht."); } });
    const skipOne = () => run(async () => {
      if (await act.patch("events", ev.id, { skip: ev.skip.concat(at).slice(-200), up: Date.now() })) { onClose(); say("Der Termin am " + HP.fmtDate(at, { day: "numeric", month: "long" }) + " fällt aus."); }
    });
    const repeats = ev && ev.repeat !== "none";
    return html`
      <${Sheet} title=${isNew ? "Neuer Termin" : "Termin"} onClose=${onClose} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        <div class="field">
          <label for="hp-ev-title">Was?</label>
          <input id="hp-ev-title" class="input" maxlength="100" autocomplete="off" placeholder="z. B. Kehricht rausstellen" value=${d.title} onInput=${e => set({ title: e.target.value })} data-autofocus=${isNew ? "" : null} />
        </div>
        <${KindPick} id="hp-ev-cat" label="Art" list=${HP.EV_CATS} value=${d.cat} onChange=${pickCat} />
        <div class="two">
          <div class="field">
            <label for="hp-ev-date">${d.end ? "Von" : "Datum"}</label>
            <input id="hp-ev-date" class="input" type="date" value=${d.date} onInput=${e => set({ date: e.target.value })} />
          </div>
          <div class="field">
            <label for="hp-ev-end">Bis (mehrtägig)</label>
            <input id="hp-ev-end" class="input" type="date" min=${d.date} value=${d.end} onInput=${e => set({ end: e.target.value })} />
          </div>
        </div>
        <div class="two">
          <div class="field">
            <label for="hp-ev-time">Uhrzeit</label>
            <input id="hp-ev-time" class="input" type="time" value=${d.time} onInput=${e => set({ time: e.target.value })} />
          </div>
          <div class="field">
            <label for="hp-ev-endtime">Ende</label>
            <input id="hp-ev-endtime" class="input" type="time" disabled=${!d.time} value=${d.endTime} onInput=${e => set({ endTime: e.target.value })} />
          </div>
        </div>
        <p class="hint">Ohne Uhrzeit gilt der Termin für den ganzen Tag.</p>
        <div class="field">
          <label for="hp-ev-rep">Wiederholen</label>
          <select id="hp-ev-rep" class="select" value=${d.repeat} onChange=${e => set({ repeat: e.target.value })}>
            ${HP.REPEATS.map(([id, label]) => html`<option value=${id}>${label}</option>`)}
          </select>
        </div>
        ${d.repeat !== "none" && html`
          <div class="field">
            <label for="hp-ev-until">Wiederholen bis (leer = immer)</label>
            <input id="hp-ev-until" class="input" type="date" min=${d.date} value=${d.until} onInput=${e => set({ until: e.target.value })} />
          </div>`}
        ${people.length > 1 && html`<${PeoplePick} id="hp-ev-who" label="Betrifft (optional)" people=${people} value=${d.who} onChange=${v => set({ who: v })} meId=${meId} multi=${true} />`}
        <div class="field">
          <label for="hp-ev-note">Notiz</label>
          <textarea id="hp-ev-note" class="input area" maxlength="1000" rows="3" placeholder="z. B. Adresse, was mitbringen" value=${d.note} onInput=${e => set({ note: e.target.value })}></textarea>
        </div>
        ${repeats && html`<p class="hint">Änderungen gelten für alle Wiederholungen dieses Termins.</p>`}
        <div class="foot">
          <button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Speichern</button>
          ${repeats && HP.validDate(at) && html`<button type="button" class="btn block" disabled=${busy} onClick=${skipOne}>Nur am ${HP.fmtDate(at, { day: "numeric", month: "long" })} ausfallen lassen</button>`}
          ${!isNew && html`<button type="button" class="btn block" onClick=${() => saveIcs(ctx, [ev], fileOf(ev.title))}><${Icon} n="download" s=${18} />In meinen Kalender (Outlook, iPhone)</button>`}
          ${!isNew && html`<${DeleteButton} label=${repeats ? "Termin mit allen Wiederholungen löschen" : "Termin löschen"} onConfirm=${del} disabled=${busy} />`}
          ${!isNew && ev.by && html`<p class="meta">Eingetragen von ${who(ev.by).name}</p>`}
        </div>
      <//>`;
  }

  /* ---------- Outlook, iPhone und Google ---------- */
  function namesOf(ctx) { const o = {}; Object.keys(ctx.home.members || {}).forEach(id => { o[id] = ctx.home.members[id].name; }); return o; }
  function fileOf(name) { return (String(name || "kalender").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "kalender").slice(0, 40) + ".ics"; }
  /* Termine als Kalenderdatei: Outlook und der Kalender des Computers übernehmen sie mit einem Doppelklick, das iPhone über «Teilen». */
  function saveIcs(ctx, events, file) {
    const body = Ics.build({ home: ctx.home.name, names: namesOf(ctx), events, now: Date.now() });
    Store.download(file, body, "text/calendar").then(r => { if (r !== "cancelled") ctx.say("Kalenderdatei bereit. Öffne sie mit Outlook oder dem Kalender."); }, () => ctx.say("Die Datei liess sich nicht speichern.", "err"));
  }
  const CAL_FAIL = {
    "cal-offline": "Der Kalender-Dienst antwortet nicht. Prüf das Netz und die Adresse bei kalenderDienst in config.js.",
    "cal-setup": "Der Kalender-Dienst ist noch nicht fertig eingerichtet: Bei Cloudflare fehlt das Secret KALENDER_SCHLUESSEL. Die Anleitung steht im README.",
    "cal-unknown": "Der Kalender-Dienst findet diesen Haushalt nicht. Er liest nur Haushalte aus dem Gruppen-Sync, im selben Firebase-Projekt wie in config.js.",
    "cal-firebase": "Der Kalender-Dienst kommt nicht an die Termine: Firebase lehnt ab. Sind die Regeln aus firestore.rules veröffentlicht?"
  };
  function subscribeLinks(https, name) {
    const webcal = https.replace(/^https:/, "webcal:");
    return [
      ["iphone", "Im iPhone-Kalender abonnieren", "📱", webcal],
      ["outlook", "In Outlook abonnieren (privat, outlook.com)", "📧", "https://outlook.live.com/calendar/0/addfromweb?url=" + encodeURIComponent(https) + "&name=" + encodeURIComponent(name)],
      ["office", "In Outlook abonnieren (Arbeit, Microsoft 365)", "🏢", "https://outlook.office.com/calendar/0/addfromweb?url=" + encodeURIComponent(https) + "&name=" + encodeURIComponent(name)],
      ["google", "In Google Kalender abonnieren", "🗓️", "https://calendar.google.com/calendar/r?cid=" + encodeURIComponent(webcal)]
    ];
  }
  function CalSync({ ctx, onClose }) {
    const { home, mode, data, act, say } = ctx;
    const service = Store.calendarService, cloud = mode === "cloud";
    const [kinds, setKinds] = useState(() => HP.EV_CATS.map(c => c.id));
    const [token, setToken] = useState(null);
    const [err, setErr] = useState(null);
    const [shown, setShown] = useState(false);
    const [armed, setArmed] = useState(false);
    const [busy, run] = useBusy();
    useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 4000); return () => clearTimeout(t); }, [armed]);
    useEffect(() => {
      if (!service || !cloud) return;
      let live = true;
      setToken(null); setErr(null);
      Store.calendarToken(home.id).then(t => { if (live) setToken(t); }, e => { if (live) setErr(CAL_FAIL[e && e.code] || CAL_FAIL["cal-offline"]); });
      return () => { live = false; };
    }, [service, cloud, home.id, home.calV]);
    const all = kinds.length === HP.EV_CATS.length;
    const url = token ? Store.calendarUrl(token, all ? [] : kinds) : "";
    const name = "Home-Planer · " + home.name;
    const toggle = id => setKinds(k => (k.indexOf(id) >= 0 ? (k.length > 1 ? k.filter(x => x !== id) : k) : k.concat(id)));
    const copy = () => U.copyText(url, () => say("Kalender-Link kopiert."), () => setShown(true));
    const renew = () => run(async () => { if (await act.patchHome(home.id, { calV: (home.calV || 0) + 1 })) say("Neuer Link. Die bisherigen Abos zeigen keine Termine mehr."); });
    const events = data.events || [];
    return html`
      <${Sheet} title="Outlook & iPhone" onClose=${onClose} closeLabel="Fertig">
        <p class="hint">Die Termine des Haushalts in deinem eigenen Kalender: Abfuhr, Geburtstage, Besuch, wer kocht. Ändern und eintragen geht weiterhin hier im Home-Planer.</p>
        <h3 class="sub-h">Abonnieren: bleibt von selbst aktuell</h3>
        ${!service ? html`
          <div class="note"><${Icon} n="link" /><div>Für ein Abo braucht es einmal einen kleinen Kalender-Dienst: kostenlos bei Cloudflare, in etwa zehn Minuten eingerichtet. Die Anleitung steht im README unter «Kalender in Outlook und auf dem iPhone». Bis dahin geht es mit der Kalenderdatei weiter unten.</div></div>`
        : !cloud ? html`
          <div class="note"><${Icon} n="device" /><div>Dieser Haushalt liegt nur auf diesem Gerät. Der Kalender-Dienst liest die Termine aus dem Gruppen-Sync: zuerst oben im Haushalt auf «Einladen» und ihn für alle freigeben.</div></div>`
        : err ? html`<div class="note warn" role="alert"><${Icon} n="offline" /><div>${err}</div></div>`
        : !token ? html`<p class="status" role="status"><span class="spin" aria-hidden="true"></span> Kalender-Link wird geholt …</p>`
        : html`
          <div class="field">
            <span class="label" id="hp-cal-kinds">Welche Termine?</span>
            <div class="chips" role="group" aria-labelledby="hp-cal-kinds">${HP.EV_CATS.map(c => html`
              <button type="button" key=${c.id} class="chip" aria-pressed=${String(kinds.indexOf(c.id) >= 0)} onClick=${() => toggle(c.id)}><span class="emo" aria-hidden="true">${c.emoji}</span>${c.label}</button>`)}
            </div>
          </div>
          <div class="sub-links">${subscribeLinks(url, name).map(([id, label, e, href]) => html`
            <a key=${id} class="btn block" href=${href} target=${id === "iphone" ? null : "_blank"} rel="noopener"><span class="emo" aria-hidden="true">${e}</span>${label}</a>`)}
          </div>
          <div class="field">
            <label for="hp-cal-link">Kalender-Link (für Outlook auf dem Computer: «Kalender hinzufügen», «Aus dem Internet»)</label>
            <input id="hp-cal-link" class="input linkbox" readonly value=${url} onFocus=${e => e.target.select()} />
            <div class="btn-row"><button type="button" class="btn small" onClick=${copy}><${Icon} n="copy" s=${16} />Link kopieren</button></div>
            ${shown && html`<p class="hint">Kopieren hat nicht geklappt. Markiere den Link im Feld und kopiere ihn von Hand.</p>`}
          </div>
          <p class="hint">Das iPhone holt Änderungen regelmässig ab (einstellbar unter Einstellungen › Kalender › Accounts), Outlook alle paar Stunden. Der Link zeigt nur die Termine, nicht den Rest des Haushalts. Ist er in falsche Hände geraten:</p>
          <button type="button" class="btn danger block" disabled=${busy} onClick=${() => { if (armed) { setArmed(false); renew(); } else setArmed(true); }}>
            <${Icon} n="refresh" s=${18} />${armed ? "Wirklich? Bisherige Abos zeigen dann nichts mehr. Nochmal tippen" : "Link erneuern"}
          </button>`}
        <h3 class="sub-h">Als Datei: einmalig übernehmen</h3>
        <p class="hint">Alle Termine als Kalenderdatei (.ics). Outlook und der Kalender des Computers übernehmen sie mit einem Doppelklick. Spätere Änderungen kommen so nicht mit.</p>
        <button type="button" class="btn block" disabled=${!events.length} onClick=${() => saveIcs(ctx, events, fileOf(home.name))}><${Icon} n="download" s=${18} />Alle ${events.length} Termine als Datei</button>
        <h3 class="sub-h">Aus Outlook übernehmen</h3>
        <p class="hint">Termine aus einer Kalenderdatei (.ics) in den Home-Planer holen, etwa eine Einladung aus Outlook oder einen exportierten Kalender.</p>
        <button type="button" class="btn block" onClick=${() => ctx.open({ t: "calimport" })}><${Icon} n="upload" s=${18} />Kalenderdatei einlesen</button>
      <//>`;
  }
  /* Termine aus einer .ics-Datei übernehmen. Dieselbe Datei nochmals einzulesen ändert die Termine, statt sie doppelt einzutragen. */
  function CalImport({ ctx, onClose }) {
    const { act, say, meId } = ctx;
    const [found, setFound] = useState(null);
    const [cat, setCat] = useState("date");
    const [err, setErr] = useState(null);
    const [busy, run] = useBusy();
    const fileRef = useRef(null);
    const today = HP.today();
    const pick = e => {
      const f = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!f) return;
      if (f.size > 5e6) { setErr("Die Datei ist zu gross. Exportier nur den Zeitraum, den du brauchst."); return; }
      setErr(null);
      f.text().then(t => {
        const r = Ics.parse(t);
        const keep = r.events.filter(x => (x.repeat === "none" ? (x.end || x.date) >= HP.addDays(today, -1) : !x.until || x.until >= today));
        if (!r.events.length) { setErr("In dieser Datei stehen keine Termine. Wähle eine Kalenderdatei (.ics)."); setFound(null); return; }
        setFound({ list: keep.slice(0, 300), past: r.events.length - keep.length, simplified: keep.filter(x => /Wiederholung aus der Kalenderdatei/.test(x.note)).length, more: Math.max(0, keep.length - 300) });
      }, () => setErr("Die Datei liess sich nicht lesen."));
    };
    const save = () => run(async () => {
      let n = 0;
      for (const x of found.list) {
        const id = "ics" + HP.hash(x.uid || x.title + x.date).toString(36) + HP.hash((x.uid || "") + "|" + x.date).toString(36).slice(0, 4);
        /* Schon einmal übernommen: Art und Personen bleiben, wie der Haushalt sie gewählt hat; Zeit, Titel und Notiz kommen neu. */
        const old = (ctx.data.events || []).find(e => e.id === id);
        const body = { id, title: x.title, cat: old ? old.cat : cat, date: x.date, end: x.end, time: x.time, endTime: x.endTime, repeat: x.repeat, until: x.until, skip: x.skip,
          who: old ? old.who : [], note: x.note, rid: null, by: old ? old.by : meId || null, ts: old ? old.ts : Date.now(), up: Date.now() };
        if (HP.eventCheck(body)) continue;
        if (!(await act.save("events", body))) return;
        n++;
      }
      onClose(); say(n === 1 ? "Ein Termin übernommen." : n + " Termine übernommen.");
    });
    return html`
      <${Sheet} title="Kalenderdatei einlesen" onClose=${onClose} error=${err}
        action=${found && found.list.length ? html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Übernehmen</button>` : null}>
        <p class="hint">In Outlook: Termin oder Kalender als Datei speichern (.ics), etwa über «Datei › Speichern unter» oder «Kalender freigeben › Exportieren». Eine Einladung im Mail enthält oft schon eine .ics-Datei.</p>
        <input id="hp-cal-file" class="sr" type="file" accept=".ics,text/calendar" ref=${fileRef} onChange=${pick} />
        <button type="button" class="btn block" onClick=${() => fileRef.current && fileRef.current.click()}><${Icon} n="upload" s=${18} />${found ? "Andere Datei wählen" : "Datei wählen"}</button>
        ${found && html`
          <h3 class="sub-h">${found.list.length === 1 ? "1 Termin" : found.list.length + " Termine"} gefunden</h3>
          ${found.list.length > 0 && html`<div class="list flat">${found.list.slice(0, 8).map((x, i) => html`
            <div key=${i} class="x static"><span class="x-main"><span class="x-t">${x.title}</span>
              <span class="x-s">${x.end ? HP.rangeLabel(x.date, x.end) : HP.dayLabel(x.date)}${x.time ? " · " + x.time : ""}${x.repeat !== "none" ? " · " + REP_SHORT[x.repeat] : ""}</span></span></div>`)}
          </div>`}
          ${found.list.length > 8 && html`<p class="hint">… und ${found.list.length - 8} weitere.</p>`}
          ${found.past > 0 && html`<p class="hint">${found.past === 1 ? "Ein vergangener Termin bleibt" : found.past + " vergangene Termine bleiben"} weg.</p>`}
          ${found.more > 0 && html`<p class="hint">Es werden höchstens 300 Termine übernommen; ${found.more} bleiben weg.</p>`}
          ${found.simplified > 0 && html`<p class="hint">${found.simplified === 1 ? "Bei einem Termin" : "Bei " + found.simplified + " Terminen"} kennt der Home-Planer die Art der Wiederholung nicht (etwa «jeden Werktag»). Eingetragen ist nur der erste Termin, mit einem Vermerk in der Notiz.</p>`}
          ${found.list.length > 0 && html`
            <${KindPick} id="hp-cal-cat" label="Als Art eintragen" list=${HP.EV_CATS} value=${cat} onChange=${setCat} />
            <div class="foot"><button type="button" class="btn primary block" disabled=${busy} onClick=${save}>${found.list.length === 1 ? "Termin übernehmen" : found.list.length + " Termine übernehmen"}</button></div>`}`}
      <//>`;
  }

  Object.assign(U, { Calendar, EventForm, EventRow, CalSync, CalImport, calTimeText: timeText });
})();
