/* Home-Planer: the shared calendar. A month at a glance with dots on busy days, the chosen day below it, and what is
   coming up in the next weeks. Appointments may last several days and repeat; a single repetition can be cancelled. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP;
  if (!U) return;
  const { html, docId, Icon, Av, Sheet, DeleteButton, KindPick, PeoplePick, Empty, useBusy } = U;
  const { useState, useMemo } = U.P;

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
    return html`
      <button type="button" class="x" onClick=${() => ctx.open({ t: "event", e, at: o.start })}>
        <span class=${"x-ic ev-" + cat.id} aria-hidden="true">${cat.emoji}</span>
        <span class="x-main">
          <span class="x-t">${e.title}</span>
          <span class="x-s">${showDate ? (o.date === today ? "Heute" : HP.dayLabel(o.date)) + " · " : ""}${timeText(o)}${e.repeat !== "none" ? " · " + REP_SHORT[e.repeat] : ""}</span>
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
        ? html`<${Empty} emoji="🗓️" title="Noch keine Termine" text="Trag ein, was alle wissen sollten: die Kehrichtabfuhr jede Woche, Geburtstage, Besuch, Ferien oder wer wann putzt. Wiederkehrendes trägst du nur einmal ein." />`
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
      who: d.who, note: d.note.trim().slice(0, 1000), skip: ev && d.repeat !== "none" ? ev.skip : [],
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
          ${!isNew && html`<${DeleteButton} label=${repeats ? "Termin mit allen Wiederholungen löschen" : "Termin löschen"} onConfirm=${del} disabled=${busy} />`}
          ${!isNew && ev.by && html`<p class="meta">Eingetragen von ${who(ev.by).name}</p>`}
        </div>
      <//>`;
  }

  Object.assign(U, { Calendar, EventForm, EventRow, calTimeText: timeText });
})();
