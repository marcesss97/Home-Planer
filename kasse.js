/* Home-Planer: the shared purse. Expenses, payments between two people, balances with the fewest payments to settle,
   and statistics per month. Taken over from the Ferienkasse; foreign currencies are converted at the daily rate. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP, Rates = window.HPRates;
  if (!U || !Rates) return;
  const { html, docId, membersOf, GHOST, refsOf, Icon, Av, Meme, Confetti, SLOW, useSlow, Sheet, DeleteButton, CurSelect, Empty, copyText } = U;
  const { useState, useEffect, useMemo, useRef } = U.P;

  /* ---------- daily rate ---------- */
  const SRC = { EZB: "Referenzkurs der EZB", Zentralbanken: "Mittel aus Zentralbank-Kursen", "currency-api": "Quelle currency-api" };
  function rateFields(d) {
    const auto = d.rateMode === "auto" && !!(d.rateInfo && d.rateInfo.date);
    return { rate: HP.parseRate(d.rateStr), rateAuto: auto, rateDate: auto ? d.rateInfo.date : "" };
  }
  /* The rate follows currency and date until someone types into the field. An existing booking keeps its stored rate
     unless its currency or date changes. */
  function useRate(home, d, set, original) {
    const [busy, setBusy] = useState(false);
    const seq = useRef(0), last = useRef(original ? original.cur + "@" + original.date : null);
    const base = home.base, known = home.rates || {};
    const load = (cur, date) => {
      const n = ++seq.current;
      setBusy(true);
      Rates.get(cur, base, date).then(r => r, () => null).then(r => {
        if (seq.current !== n) return;
        setBusy(false);
        set(prev => {
          if (prev.cur !== cur || prev.rateMode !== "auto") return {};
          if (r) return { rateStr: HP.rateText(r.rate), rateInfo: { date: r.date, source: r.source, stale: !!r.stale } };
          if (prev.rateStr) return { rateInfo: { failed: true, kept: true } };
          return known[cur] > 0 ? { rateStr: HP.rateText(known[cur]), rateInfo: { failed: true, kept: true } } : { rateInfo: { failed: true } };
        });
      });
    };
    useEffect(() => {
      if (d.cur === base) { last.current = null; return; }
      const key = d.cur + "@" + d.date;
      if (key === last.current) return;
      last.current = key;
      if (d.rateMode === "auto" && HP.validDate(d.date)) load(d.cur, d.date);
    }, [d.cur, d.date, d.rateMode, base]);
    const refresh = () => { last.current = d.cur + "@" + d.date; set({ rateMode: "auto", rateInfo: null }); load(d.cur, d.date); };
    /* Whoever types the rate by hand need not wait for the answer. */
    return { busy: busy && d.rateMode === "auto", refresh };
  }
  function RateField({ cur, base, d, busy, onValue, onRefresh }) {
    const info = d.rateInfo;
    let text;
    if (busy) text = "Tageskurs wird geladen …";
    else if (d.rateMode === "auto" && info && info.date) text = (info.stale ? "Ohne Netz: letzter bekannter Tageskurs vom " : "Tageskurs vom ") + HP.fmtDate(info.date, { day: "numeric", month: "short", year: "numeric" }) + (SRC[info.source] ? ", " + SRC[info.source] : "") + ".";
    else if (info && info.failed) text = info.kept ? "Kein Tageskurs erreichbar. Eingesetzt ist der letzte bekannte Kurs, prüf ihn kurz." : "Kein Tageskurs erreichbar. Trag den Kurs von Hand ein.";
    else text = "Von Hand eingetragen.";
    const offer = !busy && (d.rateMode !== "auto" || !info || info.failed || info.stale);
    return html`
      <div class="field">
        <label for="hp-rate">Wechselkurs</label>
        <div class="rate-row">
          <span class="m">1 ${cur} =</span>
          <input id="hp-rate" class="input" inputmode="decimal" autocomplete="off" placeholder=${busy ? "…" : "Kurs eingeben"} value=${d.rateStr} onInput=${e => onValue(e.target.value)} />
          <span class="m">${base}</span>
        </div>
        <p class="hint" role="status">${text}</p>
        ${offer && html`<div><button type="button" class="btn small" onClick=${onRefresh}><${Icon} n="refresh" s=${16} />Tageskurs einsetzen</button></div>`}
      </div>`;
  }

  /* ---------- expense form ---------- */
  const MODES = [["equal", "Gleich"], ["shares", "Anteile"], ["exact", "Beträge"], ["items", "Positionen"]];
  const expenseId = () => docId("x");

  function toDraft(e, home, people, meId, preset) {
    const sel = {}, sh = {}, ex = {};
    people.forEach(m => { sel[m.id] = !m.gone; sh[m.id] = "1"; ex[m.id] = ""; });
    const rateStr = cur => (cur !== home.base && (home.rates || {})[cur] ? HP.rateText(home.rates[cur]) : "");
    if (!e) {
      const p = preset || {};
      return { id: expenseId(), isNew: true, amountStr: "", cur: home.base, rateStr: "", rateMode: "auto", rateInfo: null, title: p.title || "", cat: HP.isCat(p.cat) ? p.cat : "groceries", date: HP.today(),
        payer: meId || (people[0] && people[0].id) || null, mode: "equal", sel, shares: sh, exact: ex, items: [], ts: Date.now(), by: meId || null };
    }
    const mode = MODES.some(x => x[0] === e.mode) ? e.mode : "equal";
    const d = { id: e.id, isNew: false, amountStr: HP.plain(e.amount, e.cur), cur: e.cur, rateStr: e.rate > 0 ? HP.rateText(e.rate) : rateStr(e.cur),
      rateMode: e.rate > 0 && e.rateAuto ? "auto" : "manual", rateInfo: e.rate > 0 && e.rateAuto && e.rateDate ? { date: e.rateDate, source: "" } : null,
      title: e.title || "", cat: HP.isCat(e.cat) ? e.cat : "other", date: HP.validDate(e.date) ? e.date : HP.today(), payer: e.payer || null, mode,
      sel, shares: sh, exact: ex, items: [], ts: e.ts || Date.now(), by: e.by || null };
    if (mode === "equal" || mode === "items") {
      let part = e.for && e.for.length ? e.for : null;
      if (!part && mode === "items") { const u = new Set(); (e.items || []).forEach(it => (it.for || []).forEach(id => u.add(id))); if (u.size) part = Array.from(u); }
      if (part) people.forEach(m => { sel[m.id] = part.indexOf(m.id) >= 0; });
    }
    if (mode === "shares") people.forEach(m => { sh[m.id] = String((e.weights || {})[m.id] || 0); });
    if (mode === "exact") people.forEach(m => { ex[m.id] = (e.weights || {})[m.id] ? HP.plain(e.weights[m.id], e.cur) : ""; });
    if (mode === "items") {
      const part = people.filter(m => sel[m.id]).map(m => m.id);
      d.items = (e.items || []).map(it => {
        const f = (it.for || []).filter(id => part.indexOf(id) >= 0), forMap = {};
        if (f.length && f.length < part.length) f.forEach(id => { forMap[id] = true; });
        return { k: U.newId(), name: it.name || "", amountStr: HP.plain(it.amount || 0, e.cur), for: forMap };
      });
    }
    return d;
  }
  function toBody(d, home, people) {
    const ids = people.map(m => m.id);
    const e = { id: d.id, kind: "expense", title: d.title.trim(), amount: HP.parseAmount(d.amountStr, d.cur) || 0, cur: d.cur, rate: null, rateAuto: false, rateDate: "", date: d.date, cat: d.cat,
      payer: d.payer, mode: d.mode, by: d.by, ts: d.ts, up: Date.now() };
    if (d.cur !== home.base) Object.assign(e, rateFields(d));
    if (d.mode === "equal") e.for = ids.filter(id => d.sel[id]);
    else if (d.mode === "shares") { e.weights = {}; ids.forEach(id => { const v = HP.parseRate(d.shares[id]); if (v) e.weights[id] = v; }); }
    else if (d.mode === "exact") { e.weights = {}; ids.forEach(id => { const v = HP.parseAmount(d.exact[id], d.cur); if (v > 0) e.weights[id] = v; }); }
    else {
      const part = ids.filter(id => d.sel[id]);
      e.for = part;
      e.items = d.items.map(it => {
        const f = part.filter(id => it.for[id]);
        return { name: it.name.trim().slice(0, 60), amount: HP.parseAmount(it.amountStr, d.cur) || 0, for: f.length ? f : part };
      }).filter(it => it.amount || it.name);
    }
    return e;
  }
  function peopleFor(home, entry) {
    const ms = membersOf(home), all = membersOf(home, true), have = new Set(ms.map(m => m.id)), extra = [];
    if (entry) refsOf(entry).forEach(id => { if (!have.has(id)) { have.add(id); extra.push(all.find(m => m.id === id) || GHOST(id)); } });
    return ms.concat(extra);
  }

  function ExpenseForm({ home, expense, preset, meId, act, onClose, say }) {
    const base = home.base;
    const people = useMemo(() => peopleFor(home, expense), [home, expense]);
    const [d, setD] = useState(() => toDraft(expense, home, people, meId, preset));
    const [err, setErr] = useState(null);
    const [busy, setBusy] = useState(false);
    const lock = useRef(false), slow = useSlow(busy);
    const set = patch => { setErr(null); setD(prev => Object.assign({}, prev, typeof patch === "function" ? patch(prev) : patch)); };

    const foreign = d.cur !== base;
    const rate = foreign ? HP.parseRate(d.rateStr) : 1;
    const body = toBody(d, home, people);
    const amount = body.amount;
    const part = people.filter(m => d.sel[m.id]);
    const parts = HP.preview(body, people.filter(m => !m.gone).map(m => m.id));
    const rateCtl = useRate(home, d, set, expense && expense.cur !== base && expense.rate > 0 ? { cur: expense.cur, date: d.date } : null);
    const changeCur = cur => { if (cur && cur !== d.cur) set({ cur, rateStr: "", rateMode: "auto", rateInfo: null }); };

    const save = async () => {
      if (lock.current) return;
      if (foreign && rateCtl.busy) { setErr("Der Tageskurs wird noch geladen. Einen Moment, dann nochmal speichern."); return; }
      if (foreign && !rate) { setErr("Gib den Wechselkurs für " + d.cur + " ein: Wie viel " + base + " kostet 1 " + d.cur + "?"); return; }
      const problem = HP.check(body, home);
      if (problem) { setErr(problem); return; }
      lock.current = true; setErr(null); setBusy(true);
      if (foreign) act.rememberRate(home, d.cur, rate);
      const ok = await act.save("expenses", body);
      lock.current = false; setBusy(false);
      if (!ok) return;
      onClose(); say(d.isNew ? "Ausgabe gespeichert." : "Änderung gespeichert.");
    };
    const del = async () => {
      if (lock.current) return;
      lock.current = true; setBusy(true);
      const ok = await act.remove("expenses", d.id);
      lock.current = false; setBusy(false);
      if (ok) { onClose(); say("Ausgabe gelöscht."); }
    };

    const setItem = (k, patch) => set(prev => ({ items: prev.items.map(it => it.k === k ? Object.assign({}, it, patch) : it) }));
    const toggleItem = (it, id) => { const f = Object.assign({}, it.for); if (f[id]) delete f[id]; else f[id] = true; setItem(it.k, { for: f }); };
    const itemSum = d.items.reduce((a, it) => a + (HP.parseAmount(it.amountStr, d.cur) || 0), 0);
    const exactSum = people.reduce((a, m) => a + (HP.parseAmount(d.exact[m.id], d.cur) || 0), 0);
    const amt = id => (parts[id] ? HP.num(parts[id], d.cur) : "–");
    const byName = d.by && people.find(m => m.id === d.by);

    return html`
      <${Sheet} title=${d.isNew ? "Neue Ausgabe" : "Ausgabe"} onClose=${onClose} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        <div class="field">
          <label for="hp-amount">Betrag</label>
          <div class="amount-row">
            <input id="hp-amount" class="input amount" inputmode="decimal" autocomplete="off" placeholder=${HP.plain(0, d.cur)} value=${d.amountStr} onInput=${e => set({ amountStr: e.target.value })} data-autofocus=${d.isNew ? "" : null} />
            <${CurSelect} id="hp-cur" cls="cur" value=${d.cur} home=${home} onChange=${changeCur} />
          </div>
          ${foreign && rate && amount > 0 && html`<p class="hint m">≈ ${HP.money(HP.toBase(amount, d.cur, base, rate), base)}</p>`}
        </div>
        ${foreign && html`<${RateField} cur=${d.cur} base=${base} d=${d} busy=${rateCtl.busy} onValue=${v => set({ rateStr: v, rateMode: "manual", rateInfo: null })} onRefresh=${rateCtl.refresh} />`}
        <div class="field">
          <label for="hp-title">Wofür?</label>
          <input id="hp-title" class="input" maxlength="80" autocomplete="off" placeholder=${HP.catLabel(d.cat)} value=${d.title} onInput=${e => set({ title: e.target.value })} />
        </div>
        <div class="field">
          <span class="label" id="hp-cat-l">Kategorie</span>
          <div class="chips" role="radiogroup" aria-labelledby="hp-cat-l">${HP.CATS.map(c => html`
            <button type="button" key=${c.id} role="radio" aria-checked=${String(d.cat === c.id)} class="chip" onClick=${() => set({ cat: c.id })}><span class="emo" aria-hidden="true">${c.emoji}</span>${c.label}</button>`)}
          </div>
        </div>
        <div class="field">
          <span class="label" id="hp-payer-l">Bezahlt von</span>
          <div class="chips" role="radiogroup" aria-labelledby="hp-payer-l">${people.map(m => html`
            <button type="button" key=${m.id} role="radio" aria-checked=${String(d.payer === m.id)} class="chip" onClick=${() => set({ payer: m.id })}><${Av} m=${m} s=${1} />${m.id === meId ? m.name + " (ich)" : m.name}</button>`)}
          </div>
        </div>
        <div class="field">
          <span class="label">Aufteilen</span>
          <div class="seg" role="group" aria-label="Art der Aufteilung">${MODES.map(([id, label]) => html`
            <button type="button" key=${id} aria-pressed=${String(d.mode === id)} onClick=${() => set({ mode: id })}>${label}</button>`)}
          </div>

          ${d.mode === "equal" && html`
            <div class="rows">${people.map(m => html`
              <label class="row" key=${m.id}>
                <input id=${"hp-eq-" + m.id} type="checkbox" checked=${!!d.sel[m.id]} onChange=${e => set(prev => ({ sel: Object.assign({}, prev.sel, { [m.id]: e.target.checked }) }))} />
                <${Av} m=${m} /><span class="grow">${m.name}</span><span class="amt">${amt(m.id)}</span>
              </label>`)}
            </div>`}

          ${d.mode === "shares" && html`
            <p class="hint">Wer zwei Anteile hat, zahlt doppelt so viel wie jemand mit einem. Praktisch, wenn ein Zimmer grösser ist oder jemand nur halb mitisst.</p>
            <div class="rows">${people.map(m => {
              const v = HP.parseRate(d.shares[m.id]) || 0;
              const step = n => set(prev => ({ shares: Object.assign({}, prev.shares, { [m.id]: String(Math.max(0, Math.round((v + n) * 2) / 2)) }) }));
              return html`
                <div class="row" key=${m.id}>
                  <${Av} m=${m} /><span class="grow">${m.name}</span><span class="amt">${amt(m.id)}</span>
                  <span class="stepper">
                    <button type="button" aria-label=${"Weniger Anteile für " + m.name} disabled=${v <= 0} onClick=${() => step(-1)}>−</button>
                    <output aria-label=${"Anteile von " + m.name}>${String(v).replace(".", ",")}</output>
                    <button type="button" aria-label=${"Mehr Anteile für " + m.name} onClick=${() => step(1)}>+</button>
                  </span>
                </div>`;
            })}</div>`}

          ${d.mode === "exact" && html`
            <div class="rows">${people.map(m => html`
              <div class="row" key=${m.id}>
                <${Av} m=${m} /><span class="grow">${m.name}</span>
                <input id=${"hp-ex-" + m.id} class="input num" inputmode="decimal" autocomplete="off" placeholder=${HP.plain(0, d.cur)} aria-label=${"Betrag für " + m.name} value=${d.exact[m.id]}
                  onInput=${e => set(prev => ({ exact: Object.assign({}, prev.exact, { [m.id]: e.target.value }) }))} />
              </div>`)}
            </div>
            <div class="sumline"><span>Verteilt <b>${HP.num(exactSum, d.cur)}</b> von ${HP.num(amount, d.cur)}</span>
              ${amount - exactSum !== 0 ? html`<span class="neg">${amount > exactSum ? "noch offen " : "zu viel "}${HP.num(Math.abs(amount - exactSum), d.cur)}</span>` : html`<span class="pos">geht auf</span>`}
            </div>`}

          ${d.mode === "items" && html`
            <div class="chips" role="group" aria-label="Wer war dabei?">${people.map(m => html`
              <button type="button" key=${m.id} class="chip" aria-pressed=${String(!!d.sel[m.id])} onClick=${() => set(prev => ({ sel: Object.assign({}, prev.sel, { [m.id]: !prev.sel[m.id] }) }))}><${Av} m=${m} s=${1} />${m.name}</button>`)}
            </div>
            <p class="hint">Oben wählst du, wer dabei war. Bei jeder Position tippst du die Personen an, die sie hatten. «Alle» teilt sie unter allen, die dabei waren.</p>
            <div class="receipt">
              ${d.items.map((it, i) => {
                const picked = part.filter(m => it.for[m.id]);
                return html`
                  <div class="item" key=${it.k}>
                    <div class="item-top">
                      <input id=${"hp-it-n-" + it.k} class="input" maxlength="60" autocomplete="off" placeholder="Position" aria-label=${"Bezeichnung Position " + (i + 1)} value=${it.name} onInput=${e => setItem(it.k, { name: e.target.value })} />
                      <input id=${"hp-it-a-" + it.k} class="input num" inputmode="decimal" autocomplete="off" placeholder=${HP.plain(0, d.cur)} aria-label=${"Betrag Position " + (i + 1)} value=${it.amountStr} onInput=${e => setItem(it.k, { amountStr: e.target.value })} />
                      <button type="button" class="icon-btn" aria-label=${"Position " + (i + 1) + " entfernen"} onClick=${() => set(prev => ({ items: prev.items.filter(x => x.k !== it.k) }))}><${Icon} n="close" s=${18} /></button>
                    </div>
                    <div class="item-who" role="group" aria-label=${"Wer hatte Position " + (i + 1) + "?"}>
                      <button type="button" class="tog" aria-pressed=${String(picked.length === 0)} onClick=${() => setItem(it.k, { for: {} })}>Alle</button>
                      ${part.map(m => html`<button type="button" key=${m.id} class=${"tog p" + (picked.length === 0 || it.for[m.id] ? " on" : "")} aria-pressed=${String(!!it.for[m.id])} aria-label=${m.name} title=${m.name} onClick=${() => toggleItem(it, m.id)}><${Av} m=${m} /></button>`)}
                    </div>
                  </div>`;
              })}
              <div><button type="button" class="btn small" onClick=${() => set(prev => ({ items: prev.items.concat({ k: U.newId(), name: "", amountStr: "", for: {} }) }))}><${Icon} n="plus" s=${16} />Position</button></div>
              <div class="sumline"><span>Positionen <b>${HP.num(itemSum, d.cur)}</b></span>
                ${amount > 0 && amount !== itemSum && html`<span>${amount > itemSum ? "Rest " : "Abzug "}<b>${HP.num(Math.abs(amount - itemSum), d.cur)}</b>, anteilig verteilt</span>`}
              </div>
            </div>
            ${amount > 0 && html`
              <div class="rows">${part.map(m => html`<div class="row" key=${m.id}><${Av} m=${m} /><span class="grow">${m.name}</span><span class="amt">${amt(m.id)}</span></div>`)}</div>`}`}
        </div>
        <div class="field">
          <label for="hp-date">Datum</label>
          <input id="hp-date" class="input" type="date" value=${d.date} onInput=${e => set({ date: e.target.value })} />
        </div>
        ${slow && html`<p class="hint" role="status">${SLOW}</p>`}
        <div class="foot">
          <button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Speichern</button>
          ${!d.isNew && html`<${DeleteButton} label="Ausgabe löschen" onConfirm=${del} disabled=${busy} />`}
          ${!d.isNew && byName && html`<p class="meta">Erfasst von ${byName.name}</p>`}
        </div>
      <//>`;
  }

  /* ---------- payment between two people ---------- */
  function TransferForm({ home, transfer, preset, meId, act, onClose, say }) {
    const base = home.base;
    const people = useMemo(() => peopleFor(home, transfer), [home, transfer]);
    const homeRate = cur => (cur !== base && (home.rates || {})[cur] ? HP.rateText(home.rates[cur]) : "");
    const [d, setD] = useState(() => {
      if (transfer) return { id: transfer.id, isNew: false, from: transfer.payer, to: transfer.to, amountStr: HP.plain(transfer.amount, transfer.cur), cur: transfer.cur,
        rateStr: transfer.rate > 0 ? HP.rateText(transfer.rate) : homeRate(transfer.cur), rateMode: transfer.rate > 0 && transfer.rateAuto ? "auto" : "manual",
        rateInfo: transfer.rate > 0 && transfer.rateAuto && transfer.rateDate ? { date: transfer.rateDate, source: "" } : null, date: HP.validDate(transfer.date) ? transfer.date : HP.today(), ts: transfer.ts || Date.now(), by: transfer.by || null };
      const p = preset || {};
      return { id: expenseId(), isNew: true, from: p.from || meId || null, to: p.to || null, amountStr: p.amount ? HP.plain(p.amount, base) : "", cur: base, rateStr: "", rateMode: "auto", rateInfo: null, date: HP.today(), ts: Date.now(), by: meId || null };
    });
    const [err, setErr] = useState(null);
    const [busy, setBusy] = useState(false);
    const lock = useRef(false), slow = useSlow(busy);
    const set = patch => { setErr(null); setD(prev => Object.assign({}, prev, typeof patch === "function" ? patch(prev) : patch)); };
    const rateCtl = useRate(home, d, set, transfer && transfer.cur !== base && transfer.rate > 0 ? { cur: transfer.cur, date: d.date } : null);
    const foreign = d.cur !== base, rate = foreign ? HP.parseRate(d.rateStr) : 1;
    const amount = HP.parseAmount(d.amountStr, d.cur) || 0;
    const save = async () => {
      if (lock.current) return;
      if (foreign && rateCtl.busy) { setErr("Der Tageskurs wird noch geladen. Einen Moment, dann nochmal speichern."); return; }
      if (foreign && !rate) { setErr("Gib den Wechselkurs für " + d.cur + " ein: Wie viel " + base + " kostet 1 " + d.cur + "?"); return; }
      const body = Object.assign({ id: d.id, kind: "transfer", amount, cur: d.cur, rate: null, rateAuto: false, rateDate: "", date: d.date, payer: d.from, to: d.to, by: d.by, ts: d.ts, up: Date.now() }, foreign ? rateFields(d) : {});
      const problem = HP.check(body, home);
      if (problem) { setErr(problem); return; }
      lock.current = true; setErr(null); setBusy(true);
      if (foreign) act.rememberRate(home, d.cur, rate);
      const ok = await act.save("expenses", body);
      lock.current = false; setBusy(false);
      if (ok) { onClose(); say(d.isNew ? "Zahlung eingetragen." : "Änderung gespeichert."); }
    };
    const del = async () => {
      if (lock.current) return;
      lock.current = true; setBusy(true);
      const ok = await act.remove("expenses", d.id);
      lock.current = false; setBusy(false);
      if (ok) { onClose(); say("Zahlung gelöscht."); }
    };
    const pick = (key, labelId, label) => html`
      <div class="field">
        <span class="label" id=${labelId}>${label}</span>
        <div class="chips" role="radiogroup" aria-labelledby=${labelId}>${people.map(m => html`
          <button type="button" key=${m.id} role="radio" aria-checked=${String(d[key] === m.id)} class="chip" onClick=${() => set({ [key]: m.id })}><${Av} m=${m} s=${1} />${m.id === meId ? m.name + " (ich)" : m.name}</button>`)}
        </div>
      </div>`;
    return html`
      <${Sheet} title=${d.isNew ? "Zahlung eintragen" : "Zahlung"} onClose=${onClose} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        <p class="hint">Hier trägst du ein, wenn jemand einer anderen Person Geld zurückgegeben hat, bar oder per Twint. Das gleicht die Salden aus.</p>
        ${pick("from", "hp-tr-from", "Wer hat bezahlt?")}
        ${pick("to", "hp-tr-to", "An wen?")}
        <div class="field">
          <label for="hp-tr-amount">Betrag</label>
          <div class="amount-row">
            <input id="hp-tr-amount" class="input amount" inputmode="decimal" autocomplete="off" placeholder=${HP.plain(0, d.cur)} value=${d.amountStr} onInput=${e => set({ amountStr: e.target.value })} />
            <${CurSelect} id="hp-tr-cur" cls="cur" value=${d.cur} home=${home} onChange=${cur => { if (cur && cur !== d.cur) set({ cur, rateStr: "", rateMode: "auto", rateInfo: null }); }} />
          </div>
          ${foreign && rate && amount > 0 && html`<p class="hint m">≈ ${HP.money(HP.toBase(amount, d.cur, base, rate), base)}</p>`}
        </div>
        ${foreign && html`<${RateField} cur=${d.cur} base=${base} d=${d} busy=${rateCtl.busy} onValue=${v => set({ rateStr: v, rateMode: "manual", rateInfo: null })} onRefresh=${rateCtl.refresh} />`}
        <div class="field">
          <label for="hp-tr-date">Datum</label>
          <input id="hp-tr-date" class="input" type="date" value=${d.date} onInput=${e => set({ date: e.target.value })} />
        </div>
        ${slow && html`<p class="hint" role="status">${SLOW}</p>`}
        <div class="foot">
          <button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Speichern</button>
          ${!d.isNew && html`<${DeleteButton} label="Zahlung löschen" onConfirm=${del} disabled=${busy} />`}
        </div>
      <//>`;
  }

  /* ---------- expense list: by month, newest first ---------- */
  function ExpenseList({ home, expenses, who, meId, nActive, onEdit }) {
    const base = home.base;
    const [shown, setShown] = useState(3);
    const groups = useMemo(() => {
      const g = {};
      (expenses || []).forEach(e => { const k = HP.validDate(e.date) ? e.date.slice(0, 7) : ""; (g[k] || (g[k] = [])).push(e); });
      return Object.keys(g).sort().reverse().map(month => {
        const items = g[month].slice().sort((a, b) => (b.date < a.date ? -1 : b.date > a.date ? 1 : (b.ts || 0) - (a.ts || 0)));
        let sum = 0;
        items.forEach(e => { if (e.kind !== "transfer") { const s = HP.shares(e, home); if (s) sum += s.total; } });
        return { month, items, sum };
      });
    }, [expenses, home]);
    if (expenses === null) return html`<p class="status" role="status">Buchungen werden geladen …</p>`;
    if (!groups.length) return html`<${Empty} emoji="🧾" title="Noch keine Ausgaben" text="Tippe unten auf «Ausgabe» und trag die erste ein: den Wocheneinkauf, die Miete, die neue Pfanne. Der Home-Planer rechnet aus, wer wem wie viel schuldet." />`;
    const row = e => {
      const s = HP.shares(e, home), payer = who(e.payer), foreign = e.cur !== base, day = HP.validDate(e.date) ? HP.dayLabel(e.date) : "Ohne Datum";
      let icon, title, sub, top, small, smallCls = "";
      if (e.kind === "transfer") {
        icon = "pay"; title = payer.name + " → " + who(e.to).name; sub = day + " · Zahlung" + (foreign ? " · " + HP.money(e.amount, e.cur) : "");
        top = s ? HP.money(s.total, base) : HP.money(e.amount, e.cur);
        small = s ? (meId === e.payer ? "von dir" : meId === e.to ? "an dich" : "") : "Kurs fehlt";
      } else {
        const n = s ? Object.keys(s.parts).length : 0;
        icon = HP.isCat(e.cat) ? e.cat : "other"; title = e.title || HP.catLabel(e.cat);
        sub = day + " · " + (e.payer === meId ? "du hast bezahlt" : payer.name + " hat bezahlt") + (s ? (n >= nActive ? ", für alle" : ", für " + n) : "") + (foreign ? " · " + HP.money(e.amount, e.cur) : "");
        top = s ? HP.money(s.total, base) : HP.money(e.amount, e.cur);
        small = !s ? "Kurs fehlt" : !meId ? "" : s.parts[meId] ? html`dein Anteil <span class="m">${HP.num(s.parts[meId], base)}</span>` : "ohne dich";
      }
      if (!s) smallCls = "neg";
      return html`<button type="button" key=${e.id} class="x" onClick=${() => onEdit(e)}>
        <span class=${"x-ic k-" + icon} aria-hidden="true">${icon === "pay" ? "🤝" : HP.catEmoji(icon)}</span>
        <span class="x-main"><span class="x-t">${title}</span><span class="x-s">${sub}</span></span>
        <span class="x-a"><span>${top}</span>${small && html`<small class=${smallCls}>${small}</small>`}</span>
      </button>`;
    };
    return html`
      ${groups.slice(0, shown).map(g => html`
        <section class="stack" key=${g.month || "none"}>
          <div class="day"><h2 class="day-date">${g.month ? HP.monthLabel(g.month) : "Ohne Datum"}</h2>${g.sum > 0 && html`<span class="day-sum">${HP.money(g.sum, base)}</span>`}</div>
          <div class="list">${g.items.map(row)}</div>
        </section>`)}
      ${groups.length > shown && html`<div><button type="button" class="btn" onClick=${() => setShown(shown + 6)}><${Icon} n="down" s=${18} />Ältere Monate anzeigen</button></div>`}`;
  }

  /* ---------- balances and settling up ---------- */
  function Settle({ home, bal, plan, who, meId, onPay, onTransfer, say }) {
    const base = home.base;
    const [copyBox, setCopyBox] = useState(null);
    const ids = Object.keys(bal.per).sort((a, b) => bal.per[b].net - bal.per[a].net || (who(a).name < who(b).name ? -1 : 1));
    const max = ids.reduce((m, id) => Math.max(m, Math.abs(bal.per[id].net)), 0);
    const last = ids.length ? ids[ids.length - 1] : null;
    const copy = () => copyText(HP.summaryText(home, bal, plan), () => { setCopyBox(null); say("Abrechnung kopiert. Füg sie in euren Gruppenchat ein."); }, setCopyBox);
    const canShare = typeof navigator.share === "function";
    const share = () => { navigator.share({ text: HP.summaryText(home, bal, plan) }).catch(() => {}); };
    const meme = HP.meme({ net: meId && bal.per[meId] ? bal.per[meId].net : null, base, count: bal.count, payments: plan.payments.length, seed: home.id });
    const square = bal.count > 0 && plan.payments.length === 0 && !bal.missing;
    return html`
      ${square && html`<${Confetti} />`}
      <${Meme} m=${meme} />
      ${bal.missing > 0 && html`
        <div class="note warn"><${Icon} n="swap" /><div>${bal.missing === 1 ? "Eine Buchung hat" : bal.missing + " Buchungen haben"} keinen Wechselkurs und ${bal.missing === 1 ? "fehlt" : "fehlen"} in der Abrechnung. Öffne sie in der Liste und trag den Kurs ein.</div></div>`}
      <section class="panel">
        <div class="panel-head"><h2 class="sec-h">Salden in ${base}</h2></div>
        <div>${ids.map(id => {
          const p = bal.per[id], m = who(id), w = max ? Math.abs(p.net) / max * 50 : 0;
          return html`
            <div class="bal" key=${id}>
              <${Av} m=${m} />
              <span class="bal-name"><b>${id === meId ? m.name + " (ich)" : m.name}</b><span>${p.net > 0 ? "bekommt Geld" : p.net < 0 ? "schuldet Geld" : "ist quitt"}</span></span>
              <span class=${"bal-v " + (p.net > 0 ? "pos" : p.net < 0 ? "neg" : "")}>${HP.signed(p.net, base)}</span>
              <span class="bal-track" aria-hidden="true">${p.net !== 0 && html`<i class=${"bal-fill " + (p.net > 0 ? "up" : "down")} style=${"width:" + w.toFixed(2) + "%"}></i>`}</span>
            </div>`;
        })}</div>
        ${last && bal.per[last].net < 0 && html`<p>Tipp: Der nächste Einkauf geht auf ${who(last).name}, dort ist das Minus am grössten.</p>`}
      </section>
      <section class="panel">
        <div class="panel-head"><h2 class="sec-h">So seid ihr quitt</h2></div>
        ${plan.payments.length === 0
          ? html`<p>${bal.count ? "Alle sind quitt. Niemand schuldet jemandem etwas." : "Sobald Ausgaben erfasst sind, steht hier, wer wem wie viel zahlt."}</p>`
          : html`
            <div>${plan.payments.map(p => html`
              <div class="pay" key=${p.from + p.to}>
                <span class="pay-who"><span><${Av} m=${who(p.from)} s=${1} />${who(p.from).name}</span><${Icon} n="arrow" s=${16} /><span><${Av} m=${who(p.to)} s=${1} />${who(p.to).name}</span></span>
                <span class="pay-amt">${HP.money(p.amount, base)}</span>
                <button type="button" class="btn small" onClick=${() => onPay(p)}><${Icon} n="check" s=${16} />Als bezahlt eintragen</button>
              </div>`)}
            </div>
            <p>${plan.payments.length === 1 ? "Eine Zahlung genügt." : plan.payments.length + " Zahlungen genügen."}${plan.exact ? " Weniger geht nicht." : ""}</p>`}
        <div class="btn-row">
          ${bal.count > 0 && canShare && html`<button type="button" class="btn small" onClick=${share}><${Icon} n="share" s=${16} />Abrechnung teilen</button>`}
          ${bal.count > 0 && html`<button type="button" class="btn small" onClick=${copy}><${Icon} n="copy" s=${16} />Abrechnung kopieren</button>`}
          <button type="button" class="btn small" onClick=${onTransfer}><${Icon} n="swap" s=${16} />Zahlung eintragen</button>
        </div>
        ${copyBox && html`
          <div class="field">
            <label for="hp-copy">Kopieren hat nicht geklappt. Markiere den Text und kopiere ihn von Hand.</label>
            <textarea id="hp-copy" class="copybox" readonly value=${copyBox} onFocus=${e => e.target.select()}></textarea>
          </div>`}
      </section>`;
  }

  /* ---------- statistics and stamps ---------- */
  const ROT = [-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5];
  const PERIODS = [["month", "Dieser Monat"], ["year", "12 Monate"], ["all", "Alles"]];
  function Stats({ home, expenses, bal, who, meId, nActive }) {
    const base = home.base, f = Math.pow(10, HP.digits(base));
    const [scope, setScope] = useState("all");
    const [period, setPeriod] = useState("year");
    const [hot, setHot] = useState(null);
    const mine = scope === "me" && meId;
    const st = useMemo(() => HP.stats(home, expenses || [], mine ? meId : null, period), [home, expenses, mine, meId, period]);
    const aw = useMemo(() => HP.awards(home, expenses || [], bal), [home, expenses, bal]);
    const any = useMemo(() => HP.stats(home, expenses || [], null, "all").count > 0, [home, expenses]);
    if (!any) return html`<${Empty} emoji="📊" title="Noch keine Zahlen" text="Sobald Ausgaben erfasst sind, siehst du hier, wofür das Geld weggeht, was jeder Monat gekostet hat und wer welchen Stempel verdient." />`;
    const catMax = st.cats.length ? st.cats[0].amount : 0;
    const ms = st.months, mMax = ms.reduce((m, d) => Math.max(m, d.amount), 0), top = HP.niceMax(mMax);
    const peak = ms.reduce((b, d, i) => (b == null || d.amount > ms[b].amount ? i : b), null);
    const shownI = hot != null && ms[hot] ? hot : peak;
    const tick = v => (v % f === 0 ? HP.whole(v, base) : HP.num(v, base));
    const pids = Object.keys(bal.per).filter(id => bal.per[id].share > 0 || bal.per[id].paid > 0).sort((a, b) => bal.per[b].share - bal.per[a].share);
    const pMax = pids.reduce((m, id) => Math.max(m, bal.per[id].share), 0);
    const boom = HP.memeTotal(bal.total, base);
    const short = ym => HP.fmtDate(ym + "-01", { month: "short" }).replace(".", "");
    return html`
      ${boom && html`<${Meme} m=${boom} />`}
      <div class="seg onbg" role="group" aria-label="Zeitraum">${PERIODS.map(([id, label]) => html`
        <button type="button" key=${id} aria-pressed=${String(period === id)} onClick=${() => { setPeriod(id); setHot(null); }}>${label}</button>`)}
      </div>
      ${meId && html`
        <div class="seg onbg" role="group" aria-label="Auswertung für">
          <button type="button" aria-pressed=${String(!mine)} onClick=${() => { setScope("all"); setHot(null); }}>Ganzer Haushalt</button>
          <button type="button" aria-pressed=${String(!!mine)} onClick=${() => { setScope("me"); setHot(null); }}>Nur mein Anteil</button>
        </div>`}
      <section class="kpis" aria-label="Kennzahlen">
        <div class="kpi"><span class="eyebrow">${mine ? "Mein Anteil " + base : "Total " + base}</span><span class="fig">${HP.num(st.total, base)}</span></div>
        ${mine
          ? html`<div class="kpi"><span class="eyebrow">Buchungen</span><span class="fig">${st.count}</span></div>`
          : html`<div class="kpi"><span class="eyebrow">Pro Person</span><span class="fig">${HP.whole(st.total / Math.max(1, nActive), base)}</span></div>`}
        <div class="kpi"><span class="eyebrow">Pro Monat</span><span class="fig">${HP.whole(st.total / st.nMonths, base)}</span></div>
      </section>
      ${st.count === 0 && html`<section class="panel"><p>${mine ? "In diesem Zeitraum bist du an keiner Ausgabe beteiligt." : "In diesem Zeitraum gibt es keine Ausgaben."}</p></section>`}
      ${st.cats.length > 0 && html`
        <section class="panel">
          <div class="panel-head"><h2 class="sec-h">Nach Kategorie</h2></div>
          <div class="bars">${st.cats.map(c => html`
            <div class="bar" key=${c.id}>
              <span class="bar-l"><span class="emo" aria-hidden="true">${HP.catEmoji(c.id)}</span>${c.label}</span>
              <span class="bar-v">${HP.num(c.amount, base)}<small>${Math.round(c.amount / st.total * 100)} %</small></span>
              <span class="bar-t" aria-hidden="true"><i class="bar-f" style=${"display:block;width:" + (c.amount / catMax * 100).toFixed(2) + "%"}></i></span>
            </div>`)}
          </div>
        </section>`}
      ${ms.length > 1 && st.count > 0 && html`
        <section class="panel">
          <div class="panel-head"><h2 class="sec-h">Pro Monat</h2></div>
          <div class="readout" aria-live="polite">
            <span>${shownI != null ? (hot == null ? "Teuerster Monat: " : "") + HP.monthLabel(ms[shownI].month) : ""}</span>
            <b>${shownI != null ? HP.money(ms[shownI].amount, base) : ""}</b>
          </div>
          <div class="plot-scroll">
            <div class="plot">
              <div class="cols" onMouseLeave=${() => setHot(null)}>
                <span class="grid-l" style="bottom:100%"><span>${tick(top)}</span></span>
                <span class="grid-l" style="bottom:50%"><span>${tick(top / 2)}</span></span>
                ${ms.map((d, i) => html`
                  <button type="button" key=${d.month} class="col" aria-pressed=${String(hot === i)} aria-label=${HP.monthLabel(d.month) + ": " + HP.money(d.amount, base)}
                    onMouseEnter=${() => setHot(i)} onFocus=${() => setHot(i)} onClick=${() => setHot(i)}>
                    <i style=${"height:" + (d.amount / top * 100).toFixed(2) + "%" + (d.amount > 0 ? ";min-height:2px" : "")}></i>
                  </button>`)}
              </div>
              <div class="col-x" aria-hidden="true">${ms.map((d, i) => html`<span key=${d.month}>${ms.length <= 14 || i % 3 === 0 ? short(d.month) : ""}</span>`)}</div>
            </div>
          </div>
          <p>Tippe auf einen Monat für den Betrag.</p>
        </section>`}
      ${!mine && pids.length > 0 && html`
        <section class="panel">
          <div class="panel-head"><h2 class="sec-h">Pro Person, seit Beginn</h2></div>
          <p>Der Balken zeigt, was der Haushalt jede Person gekostet hat. Darunter steht, was sie vorgestreckt hat.</p>
          <div class="ptable">${pids.map(id => html`
            <div class="prow" key=${id}>
              <${Av} m=${who(id)} /><b>${who(id).name}</b><span class="bar-v">${HP.num(bal.per[id].share, base)}</span>
              <span class="bar-t" aria-hidden="true"><i class="bar-f" style=${"display:block;width:" + (pMax ? bal.per[id].share / pMax * 100 : 0).toFixed(2) + "%"}></i></span>
              <small>vorgestreckt ${HP.num(bal.per[id].paid, base)}</small>
            </div>`)}
          </div>
        </section>`}
      <section class="panel">
        <div class="panel-head"><h2 class="sec-h">Stempel des Haushalts</h2></div>
        ${aw.length === 0
          ? html`<p>Ab drei Ausgaben gibt es Stempel: für die Spendierhose, den Kühlschrankfüller, den Sparfuchs und andere.</p>`
          : html`<div class="stamps">${aw.map((a, i) => html`
              <div class=${"stamp s" + (i % 4 + 1)} key=${a.id} style=${"--rot:" + ROT[i % ROT.length] + "deg"}>
                <span class="stamp-e" aria-hidden="true">${a.emoji}</span><span class="stamp-t">${a.title}</span><span class="stamp-w">${a.who}</span><span class="stamp-n">${a.note}</span>
              </div>`)}
            </div>`}
      </section>`;
  }

  /* ---------- the tab ---------- */
  const VIEWS = [["list", "Ausgaben"], ["settle", "Abrechnung"], ["stats", "Statistik"]];
  function Kasse({ ctx, view, setView }) {
    const { home, data, who, meId, members, open, say } = ctx;
    const expenses = data.expenses;
    const bal = useMemo(() => HP.balances(home, expenses || []), [home, expenses]);
    const plan = useMemo(() => HP.settle(HP.netOf(bal)), [bal]);
    const month = useMemo(() => {
      const m = HP.today().slice(0, 7);
      let sum = 0;
      (expenses || []).forEach(e => { if (e.kind !== "transfer" && e.date && e.date.slice(0, 7) === m) { const s = HP.shares(e, home); if (s) sum += s.total; } });
      return sum;
    }, [home, expenses]);
    const base = home.base, my = meId && bal.per[meId] ? bal.per[meId].net : null;
    return html`
      <${U.TabHead} emoji="💰" title="Kasse" />
      <section class="stub-card">
        <div class="cell"><span class="eyebrow">Diesen Monat ${base}</span><span class="fig">${HP.num(month, base)}</span><span class="fig-note">${HP.monthLabel(HP.today().slice(0, 7))}</span></div>
        <div class="cell"><span class="eyebrow">Mein Saldo</span>
          ${my != null
            ? html`<span class=${"fig " + (my > 0 ? "pos" : my < 0 ? "neg" : "")}>${HP.signed(my, base)}</span><span class="fig-note">${my > 0 ? "du bekommst Geld" : my < 0 ? "du schuldest Geld" : "du bist quitt"}</span>`
            : html`<span class="fig-note">Wähle unter «Start» auf dem Band, wer du bist.</span>`}
        </div>
      </section>
      ${members.length < 2 && html`
        <div class="note"><${Icon} n="people" /><div class="stack">
          <p>Für eine gemeinsame Kasse braucht es mindestens zwei Personen. Füge die anderen in den Einstellungen des Haushalts hinzu.</p>
          <div><button type="button" class="btn small" onClick=${() => open({ t: "home-edit" })}><${Icon} n="sliders" s=${16} />Personen hinzufügen</button></div>
        </div></div>`}
      <div class="seg onbg" role="tablist" aria-label="Ansicht der Kasse">${VIEWS.map(([id, label]) => html`
        <button type="button" key=${id} role="tab" aria-selected=${String(view === id)} aria-pressed=${String(view === id)} onClick=${() => setView(id)}>${label}</button>`)}
      </div>
      ${view === "list" && html`<${ExpenseList} home=${home} expenses=${expenses} who=${who} meId=${meId} nActive=${members.length}
        onEdit=${e => open(e.kind === "transfer" ? { t: "transfer", e } : { t: "expense", e })} />`}
      ${view === "settle" && html`<${Settle} home=${home} bal=${bal} plan=${plan} who=${who} meId=${meId} say=${say}
        onPay=${p => open({ t: "transfer", preset: p })} onTransfer=${() => open({ t: "transfer" })} />`}
      ${view === "stats" && html`<${Stats} home=${home} expenses=${expenses} bal=${bal} who=${who} meId=${meId} nActive=${members.length} />`}`;
  }

  Object.assign(U, { Kasse, ExpenseForm, TransferForm });
})();
