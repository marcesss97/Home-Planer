/* Home-Planer: the shopping list. One line adds an item ("2 Liter Milch"); it lands in the right aisle by itself.
   A tap ticks it off, ticked items wait below until somebody clears them, and a tap brings them back onto the list. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP;
  if (!U) return;
  const { html, docId, Icon, Av, Sheet, DeleteButton, KindPick, Empty, useBusy } = U;
  const { useState, useMemo, useRef } = U.P;

  const same = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

  /* Adds an item, or brings a ticked one with the same name back. Returns false when nothing was saved. */
  async function addItem(ctx, text) {
    const { act, data, meId, say } = ctx;
    const p = HP.splitQty(text);
    if (!p.name) return false;
    const list = data.shopping || [];
    const open = list.find(it => !it.done && same(it.name, p.name));
    if (open) { say("«" + open.name + "» steht schon auf der Liste."); return false; }
    const done = list.find(it => it.done && same(it.name, p.name));
    if (done) return act.patch("shopping", done.id, { done: false, doneBy: null, doneAt: 0, qty: p.qty || done.qty, up: Date.now() });
    return act.save("shopping", { id: docId("s"), name: p.name.slice(0, 80), qty: p.qty.slice(0, 30), sec: HP.shopGuess(p.name), note: "", done: false, by: meId || null, doneBy: null, ts: Date.now(), doneAt: 0, up: Date.now() });
  }
  function toggle(ctx, it) {
    return ctx.act.patch("shopping", it.id, it.done ? { done: false, doneBy: null, doneAt: 0 } : { done: true, doneBy: ctx.meId || null, doneAt: Date.now() });
  }

  /* The field to add with: also on the overview. */
  function QuickAdd({ ctx, compact }) {
    const [v, setV] = useState("");
    const [busy, run] = useBusy();
    const ref = useRef(null);
    const list = ctx.data.shopping || [];
    const q = v.trim().toLowerCase();
    const again = useMemo(() => (q.length >= 2 ? list.filter(it => it.done && it.name.toLowerCase().indexOf(q) >= 0).slice(0, 5) : []), [q, list]);
    const go = () => run(async () => {
      if (!v.trim()) { if (ref.current) ref.current.focus(); return; }
      const ok = await addItem(ctx, v);
      if (ok) setV("");
      if (ref.current) ref.current.focus();
    });
    return html`
      <form class="quick" onSubmit=${e => { e.preventDefault(); go(); }}>
        <label class="sr" for=${compact ? "hp-shop-q2" : "hp-shop-q"}>Was fehlt?</label>
        <div class="inline">
          <input id=${compact ? "hp-shop-q2" : "hp-shop-q"} class="input" maxlength="90" autocomplete="off" enterkeyhint="done" placeholder="Was fehlt? z. B. 2 Liter Milch" value=${v} ref=${ref}
            onInput=${e => setV(e.target.value)} />
          <button type="submit" class="btn primary" disabled=${busy} aria-label="Auf die Liste"><${Icon} n="plus" s=${20} />${compact ? "" : "Dazu"}</button>
        </div>
        ${again.length > 0 && html`
          <div class="chips" role="group" aria-label="Wieder auf die Liste">${again.map(it => html`
            <button type="button" key=${it.id} class="chip" onClick=${() => run(async () => { if (await toggle(ctx, it)) setV(""); })}><${Icon} n="refresh" s=${16} />${it.name}${it.qty ? " · " + it.qty : ""}</button>`)}
          </div>`}
      </form>`;
  }

  function Row({ it, ctx, who }) {
    const by = it.done ? it.doneBy : it.by;
    return html`
      <div class=${"sh" + (it.done ? " done" : "")}>
        <button type="button" class="tick" role="checkbox" aria-checked=${String(it.done)} aria-label=${it.name + (it.done ? " wieder auf die Liste" : " abhaken")} onClick=${() => toggle(ctx, it)}>
          ${it.done && html`<${Icon} n="check" s=${18} />`}
        </button>
        <button type="button" class="sh-main" onClick=${() => ctx.open({ t: "item", it })}>
          <span class="sh-t">${it.name}${it.qty && html` <span class="sh-q">${it.qty}</span>`}</span>
          ${it.note && html`<span class="sh-n">${it.note}</span>`}
        </button>
        ${by && by !== ctx.meId && ctx.members.length > 1 && html`<span class="sh-by" title=${(it.done ? "Abgehakt von " : "Notiert von ") + who(by).name}><${Av} m=${who(by)} s=${1} /></span>`}
      </div>`;
  }

  /* The open items as text, aisle by aisle in the order of the chosen store: for a message or a note. */
  function listText(home, list, store) {
    const st = HP.storeOf(store), g = {};
    list.filter(it => !it.done).forEach(it => { (g[it.sec] || (g[it.sec] = [])).push(it); });
    const L = ["Einkaufsliste" + (st ? " für " + st.label : "") + " · " + home.name, ""];
    HP.aisleOrder(home, store).forEach(id => {
      if (!g[id]) return;
      const sec = HP.shopSec(id);
      L.push(sec.emoji + " " + sec.label);
      g[id].sort((a, b) => a.ts - b.ts).forEach(it => L.push("• " + it.name + (it.qty ? " (" + it.qty + ")" : "") + (it.note ? " – " + it.note : "")));
      L.push("");
    });
    return L.join("\n").trim();
  }

  function Shopping({ ctx }) {
    const { data, act, open, say, who, home } = ctx;
    const list = data.shopping, store = home.store || "";
    const [busy, run] = useBusy();
    const [box, setBox] = useState(null);
    const groups = useMemo(() => {
      const g = {};
      (list || []).filter(it => !it.done).forEach(it => { (g[it.sec] || (g[it.sec] = [])).push(it); });
      return HP.aisleOrder(home, store).filter(id => g[id]).map(id => ({ s: HP.shopSec(id), items: g[id].sort((a, b) => a.ts - b.ts || (a.id < b.id ? -1 : 1)) }));
    }, [list, home, store]);
    const setStore = id => { if (id !== store) act.patchHome(home.id, { store: id }); };
    const canShare = typeof navigator.share === "function";
    const share = () => {
      const text = listText(home, list || [], store);
      if (canShare) navigator.share({ text }).catch(() => {});
      else U.copyText(text, () => { setBox(null); say("Liste kopiert."); }, setBox);
    };
    const done = useMemo(() => (list || []).filter(it => it.done).sort((a, b) => b.doneAt - a.doneAt), [list]);
    const nOpen = (list || []).length - done.length;
    const clear = () => run(async () => {
      const ok = await act.removeMany("shopping", done.map(it => it.id));
      if (ok) say(done.length === 1 ? "Ein Artikel gelöscht." : done.length + " Artikel gelöscht.");
    });
    return html`
      <${U.TabHead} emoji="🛒" title="Einkaufsliste">${list && html`<span class="tab-head-n">${nOpen === 0 ? "alles da" : nOpen === 1 ? "1 offen" : nOpen + " offen"}</span>`}<//>
      <${QuickAdd} ctx=${ctx} />
      <div class="store-row">
        <div class="seg onbg" role="radiogroup" aria-label="Einkaufen bei">
          <button type="button" role="radio" aria-checked=${String(!store)} aria-pressed=${String(!store)} onClick=${() => setStore("")}>Egal wo</button>
          ${HP.STORES.map(st => html`<button type="button" key=${st.id} role="radio" aria-checked=${String(store === st.id)} aria-pressed=${String(store === st.id)} onClick=${() => setStore(st.id)}>${st.label}</button>`)}
        </div>
        ${store && html`<button type="button" class="btn small ghost" onClick=${() => open({ t: "aisles" })}><${Icon} n="sliders" s=${16} />Reihenfolge</button>`}
      </div>
      ${store && html`<p class="hint">Die Abteilungen stehen in der Reihenfolge wie im ${HP.storeOf(store).label}. Passt sie nicht zu eurer Filiale, ändert ihr sie unter «Reihenfolge». Ein Tipp auf einen Artikel sucht ihn im Onlineshop.</p>`}
      ${list === null && html`<p class="status" role="status">Liste wird geladen …</p>`}
      ${list && !list.length && html`<${Empty} emoji="🧺" title="Die Liste ist leer" text="Schreib oben hinein, was fehlt. Mengen gehen gleich mit («3 Joghurt», «Äpfel 1kg»), und jeder Artikel landet in seiner Abteilung. Im Laden tippst du ihn ab." />`}
      ${list && list.length > 0 && nOpen === 0 && html`<section class="panel"><p class="done-all"><span class="emo" aria-hidden="true">🎉</span>Alles erledigt. Der Kühlschrank dankt.</p></section>`}
      ${groups.map(g => html`
        <section class="stack" key=${g.s.id}>
          <h2 class="aisle"><span class="emo" aria-hidden="true">${g.s.emoji}</span>${g.s.label}<span class="aisle-n">${g.items.length}</span></h2>
          <div class="list">${g.items.map(it => html`<${Row} key=${it.id} it=${it} ctx=${ctx} who=${who} />`)}</div>
        </section>`)}
      ${nOpen > 0 && html`
        <div class="btn-row">
          <button type="button" class="btn small" onClick=${share}><${Icon} n=${canShare ? "share" : "copy"} s=${16} />Liste ${canShare ? "teilen" : "kopieren"}</button>
        </div>`}
      ${box && html`<div class="field"><label for="hp-shop-copy">Kopieren hat nicht geklappt. Markiere den Text und kopiere ihn von Hand.</label><textarea id="hp-shop-copy" class="copybox" readonly value=${box} onFocus=${e => e.target.select()}></textarea></div>`}
      ${done.length > 0 && html`
        <section class="stack">
          <h2 class="aisle"><span class="emo" aria-hidden="true">✅</span>Im Wagen<span class="aisle-n">${done.length}</span></h2>
          <div class="list">${done.map(it => html`<${Row} key=${it.id} it=${it} ctx=${ctx} who=${who} />`)}</div>
          <div class="btn-row">
            <button type="button" class="btn small" onClick=${() => open({ t: "expense", preset: { title: "Einkauf", cat: "groceries" } })}><${Icon} n="plus" s=${16} />Als Ausgabe erfassen</button>
            <button type="button" class="btn small danger" disabled=${busy} onClick=${clear}><${Icon} n="trash" s=${16} />Erledigte löschen</button>
          </div>
          <p class="hint">Tippe auf einen abgehakten Artikel, um ihn wieder auf die Liste zu setzen. Gelöschte erscheinen nicht mehr als Vorschlag.</p>
        </section>`}`;
  }

  function ItemSheet({ ctx, it, onClose }) {
    const { act, say, who, home } = ctx;
    const shops = home.store ? [HP.storeOf(home.store)] : HP.STORES;
    const [d, setD] = useState({ name: it.name, qty: it.qty, sec: it.sec, note: it.note });
    const [err, setErr] = useState(null);
    const [busy, run] = useBusy();
    const set = p => { setErr(null); setD(prev => Object.assign({}, prev, p)); };
    const save = () => run(async () => {
      const name = d.name.trim();
      if (!name) { setErr("Gib dem Artikel einen Namen."); return; }
      const ok = await act.patch("shopping", it.id, { name: name.slice(0, 80), qty: d.qty.trim().slice(0, 30), sec: d.sec, note: d.note.trim().slice(0, 200), up: Date.now() });
      if (ok) { onClose(); say("Gespeichert."); }
    });
    const del = () => run(async () => { if (await act.remove("shopping", it.id)) { onClose(); say("Artikel gelöscht."); } });
    return html`
      <${Sheet} title="Artikel" onClose=${onClose} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        <div class="field">
          <label for="hp-it-name">Artikel</label>
          <input id="hp-it-name" class="input" maxlength="80" value=${d.name} onInput=${e => set({ name: e.target.value })} />
        </div>
        <div class="field">
          <label for="hp-it-qty">Menge</label>
          <input id="hp-it-qty" class="input" maxlength="30" placeholder="z. B. 2 Stück, 500 g" value=${d.qty} onInput=${e => set({ qty: e.target.value })} />
        </div>
        <${KindPick} id="hp-it-sec" label="Abteilung" list=${HP.SHOP} value=${d.sec} onChange=${sec => set({ sec })} />
        <div class="field">
          <label for="hp-it-note">Notiz</label>
          <input id="hp-it-note" class="input" maxlength="200" placeholder="z. B. die laktosefreie" value=${d.note} onInput=${e => set({ note: e.target.value })} />
        </div>
        <div class="field">
          <span class="label">Im Onlineshop suchen</span>
          <div class="btn-row">${shops.map(st => html`<a key=${st.id} class="btn small" href=${st.search + encodeURIComponent(d.name.trim() || it.name)} target="_blank" rel="noopener noreferrer"><${Icon} n="ext" s=${16} />${st.label}</a>`)}</div>
          <p class="hint">Zeigt Sorten und Preise. Gekauft wird dort nichts automatisch.</p>
        </div>
        <div class="foot">
          <button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Speichern</button>
          <${DeleteButton} label="Artikel löschen" onConfirm=${del} disabled=${busy} />
          ${it.by && html`<p class="meta">Notiert von ${who(it.by).name}${it.done && it.doneBy ? ", abgehakt von " + who(it.doneBy).name : ""}</p>`}
        </div>
      <//>`;
  }

  /* The order of the aisles for the chosen store, saved for the whole household. */
  function AislesSheet({ ctx, onClose }) {
    const { act, say, home } = ctx;
    const store = home.store, st = HP.storeOf(store);
    const [order, setOrder] = useState(() => HP.aisleOrder(home, store));
    const [busy, run] = useBusy();
    const move = (k, dir) => { const o = order.slice(), j = k + dir; if (j < 0 || j >= o.length) return; const x = o[k]; o[k] = o[j]; o[j] = x; setOrder(o); };
    const save = () => run(async () => { if (await act.patchHome(home.id, { aisles: { [store]: order } })) { onClose(); say("Reihenfolge für " + st.label + " gespeichert."); } });
    const reset = () => setOrder(st.order.slice());
    if (!st) return null;
    return html`
      <${Sheet} title=${"Reihenfolge im " + st.label} onClose=${onClose} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        <p class="hint">Vom Eingang bis zur Kasse: So sortiert die Einkaufsliste die Abteilungen, wenn ihr im ${st.label} einkauft. Die Reihenfolge gilt für den ganzen Haushalt.</p>
        <div class="rows">${order.map((id, k) => {
          const sec = HP.shopSec(id);
          return html`
            <div class="row" key=${id}>
              <span class="emo" aria-hidden="true">${sec.emoji}</span><span class="grow">${sec.label}</span>
              <button type="button" class="icon-btn" aria-label=${sec.label + " nach oben"} disabled=${k === 0} onClick=${() => move(k, -1)}><${Icon} n="back" s=${18} /></button>
              <button type="button" class="icon-btn" aria-label=${sec.label + " nach unten"} disabled=${k === order.length - 1} onClick=${() => move(k, 1)}><${Icon} n="next" s=${18} /></button>
            </div>`;
        })}</div>
        <div class="foot">
          <button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Speichern</button>
          <button type="button" class="btn block" onClick=${reset}>Typische Reihenfolge</button>
        </div>
      <//>`;
  }

  Object.assign(U, { Shopping, ItemSheet, AislesSheet, ShopQuickAdd: QuickAdd, shopListText: listText });
})();
