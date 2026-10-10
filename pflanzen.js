/* Home-Planer: the watering plan. Every plant has its rhythm; the list shows the thirstiest first, and one tap on the
   drop notes who watered it today. Fertilising works the same way, for plants that need it. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP;
  if (!U) return;
  const { html, docId, Icon, Av, Sheet, DeleteButton, PeoplePick, Empty, useBusy } = U;
  const { useState, useMemo } = U.P;

  const EVERY = [2, 3, 5, 7, 10, 14, 21, 30];
  const FEED = [[0, "Nie"], [14, "2 Wochen"], [30, "Monat"], [60, "2 Monate"]];
  function rhythm(n) { return n === 1 ? "jeden Tag" : n === 7 ? "jede Woche" : n === 14 ? "alle 2 Wochen" : "alle " + n + " Tage"; }
  /* The state of a plant in words, and a class for its colour. */
  function status(p, now) {
    const w = HP.plantDue(p, now), f = HP.feedDue(p, now);
    let text, cls;
    if (w.never) { text = "Noch nie gegossen"; cls = "st-due"; }
    else if (w.days < 0) { text = w.days === -1 ? "Seit gestern fällig" : "Seit " + (-w.days) + " Tagen fällig"; cls = "st-late"; }
    else if (w.days === 0) { text = "Heute giessen"; cls = "st-due"; }
    else if (w.days === 1) { text = "Morgen giessen"; cls = "st-soon"; }
    else { text = "In " + w.days + " Tagen giessen"; cls = "st-ok"; }
    const feed = f && f.days <= 0 ? (f.never ? "Düngen" : "Düngen fällig") : null;
    return { w, f, text, cls, feed, thirsty: w.days <= 0 };
  }
  /* Notes that a plant was watered (kind "w") or fertilised ("f") today by me. */
  async function care(ctx, p, kind) {
    const today = HP.today();
    const ok = await ctx.act.patch("plants", p.id, Object.assign(HP.careFields(p, kind, today, ctx.meId), { up: Date.now() }));
    if (!ok) return false;
    if (kind === "f") { ctx.say("🌱 " + p.name + " gedüngt."); return true; }
    const left = (ctx.data.plants || []).filter(x => x.id !== p.id && HP.plantDue(x, today).days <= 0).length;
    ctx.say(left ? "💧 " + p.name + " gegossen. Nächstes Mal " + HP.relDays(p.every) + "." : "💧 " + p.name + " gegossen. Alle Pflanzen sind versorgt 🌿");
    return true;
  }

  function WaterButton({ ctx, p, small }) {
    const [busy, run] = useBusy();
    const done = p.last === HP.today();
    return html`<button type="button" class=${"water" + (done ? " done" : "") + (small ? " small" : "")} disabled=${busy || done}
      aria-label=${done ? p.name + " ist heute gegossen" : p.name + " giessen"} onClick=${() => run(() => care(ctx, p, "w"))}>
      ${done ? html`<${Icon} n="check" s=${small ? 18 : 22} />` : html`<span class="emo" aria-hidden="true">💧</span>`}
      ${!small && html`<span>${done ? "Gegossen" : "Giessen"}</span>`}
    </button>`;
  }

  function PlantCard({ ctx, p, now }) {
    const st = status(p, now), resp = p.who ? ctx.who(p.who) : null;
    return html`
      <div class=${"plant " + st.cls}>
        <button type="button" class="plant-main" onClick=${() => ctx.open({ t: "plant", p })}>
          <span class="plant-e" aria-hidden="true">${HP.plantEmoji(p.emoji)}</span>
          <span class="x-main">
            <span class="x-t">${p.name}</span>
            <span class="x-s">${[p.room, rhythm(p.every)].filter(Boolean).join(" · ")}</span>
            <span class=${"plant-st " + st.cls}>${st.text}${st.feed ? " · " + st.feed : ""}</span>
          </span>
          ${resp && !resp.gone && html`<span class="plant-who" title=${"Zuständig: " + resp.name}><${Av} m=${resp} s=${1} /></span>`}
        </button>
        <${WaterButton} ctx=${ctx} p=${p} />
      </div>`;
  }

  function Plants({ ctx }) {
    const { data } = ctx;
    const plants = data.plants, now = HP.today();
    const [room, setRoom] = useState("");
    const rooms = useMemo(() => Array.from(new Set((plants || []).map(p => p.room).filter(Boolean))).sort((a, b) => a.localeCompare(b, "de")), [plants]);
    const sorted = useMemo(() => (plants || []).filter(p => !room || p.room === room)
      .map(p => ({ p, d: HP.plantDue(p, now).days }))
      .sort((a, b) => a.d - b.d || a.p.name.localeCompare(b.p.name, "de"))
      .map(x => x.p), [plants, room, now]);
    const thirsty = (plants || []).filter(p => HP.plantDue(p, now).days <= 0).length;
    return html`
      <${U.TabHead} emoji="🪴" title="Pflanzen">${plants && plants.length > 0 && html`<span class="tab-head-n">${thirsty === 0 ? "alle versorgt" : thirsty === 1 ? "1 durstig" : thirsty + " durstig"}</span>`}<//>
      ${plants === null && html`<p class="status" role="status">Pflanzen werden geladen …</p>`}
      ${plants && !plants.length && html`
        <${Empty} emoji="🪴💧🌿" title="Noch keine Pflanzen" text="Trag eure Pflanzen ein und wie oft sie Wasser brauchen. Der Home-Planer zeigt, welche heute dran sind, und alle sehen, wer zuletzt gegossen hat. Nie mehr doppelt giessen, nie mehr vergessen.">
          <button type="button" class="btn primary" onClick=${() => ctx.open({ t: "plant" })}><${Icon} n="plus" s=${18} />Erste Pflanze</button>
        <//>`}
      ${rooms.length > 1 && html`
        <div class="chips scroll" role="radiogroup" aria-label="Raum">
          <button type="button" role="radio" aria-checked=${String(!room)} class="chip" onClick=${() => setRoom("")}>Alle Räume</button>
          ${rooms.map(r => html`<button type="button" key=${r} role="radio" aria-checked=${String(room === r)} class="chip" onClick=${() => setRoom(r)}>${r}</button>`)}
        </div>`}
      ${sorted.length > 0 && html`<div class="plants">${sorted.map(p => html`<${PlantCard} key=${p.id} ctx=${ctx} p=${p} now=${now} />`)}</div>`}
      ${plants && plants.length > 0 && html`<p class="hint center">Tippe auf eine Pflanze für Rhythmus, Dünger und Verlauf.</p>`}`;
  }

  function PlantForm({ ctx, p, onClose }) {
    const { act, say, meId, members, who } = ctx;
    const isNew = !p;
    const rooms = useMemo(() => Array.from(new Set((ctx.data.plants || []).map(x => x.room).filter(Boolean))).sort(), [ctx.data.plants]);
    const [d, setD] = useState(() => p
      ? { name: p.name, emoji: p.emoji, room: p.room, every: p.every, feedEvery: p.feedEvery, last: p.last, fed: p.fed, who: p.who, note: p.note }
      : { name: "", emoji: "topf", room: "", every: 7, feedEvery: 0, last: HP.today(), fed: "", who: null, note: "" });
    const [err, setErr] = useState(null);
    const [busy, run] = useBusy();
    const set = x => { setErr(null); setD(prev => Object.assign({}, prev, x)); };
    const fields = () => ({ name: d.name.trim().slice(0, 60), emoji: d.emoji, room: d.room.trim().slice(0, 40), every: d.every, feedEvery: d.feedEvery,
      last: HP.validDate(d.last) ? d.last : "", fed: d.feedEvery > 0 && HP.validDate(d.fed) ? d.fed : "", who: d.who || null, note: d.note.trim().slice(0, 500), up: Date.now() });
    const save = () => run(async () => {
      const f = fields();
      if (!f.name) { setErr("Gib der Pflanze einen Namen."); return; }
      if (f.last && f.last > HP.today()) { setErr("«Zuletzt gegossen» liegt in der Zukunft."); return; }
      const ok = isNew
        ? await act.save("plants", Object.assign({ id: docId("p"), lastBy: f.last ? meId || null : null, log: [], ts: Date.now() }, f))
        : await act.patch("plants", p.id, Object.assign(f, f.last !== p.last ? { lastBy: f.last ? meId || null : null } : {}));
      if (ok) { onClose(); say(isNew ? "Pflanze eingetragen. 🌱" : "Gespeichert."); }
    });
    const del = () => run(async () => { if (await act.remove("plants", p.id)) { onClose(); say(p.name + " ist von der Liste."); } });
    const st = p ? status(p) : null;
    const step = n => set({ every: Math.max(1, Math.min(365, d.every + n)) });
    return html`
      <${Sheet} title=${isNew ? "Neue Pflanze" : p.name} onClose=${onClose} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        ${st && html`
          <div class=${"plant-hero " + st.cls}>
            <span class="plant-e big" aria-hidden="true">${HP.plantEmoji(p.emoji)}</span>
            <div class="stack">
              <strong>${st.text}</strong>
              <span class="hint">${p.last ? "Zuletzt gegossen " + HP.relDays(HP.dayDiff(HP.today(), p.last)) + (p.lastBy ? " von " + who(p.lastBy).name : "") : "Noch nie gegossen"}${st.f ? ". Gedüngt: " + (p.fed ? HP.relDays(HP.dayDiff(HP.today(), p.fed)) : "noch nie") : ""}.</span>
              <div class="btn-row">
                <button type="button" class="btn small primary" disabled=${busy || p.last === HP.today()} onClick=${() => run(async () => { if (await care(ctx, p, "w")) onClose(); })}><span class="emo" aria-hidden="true">💧</span>${p.last === HP.today() ? "Heute gegossen" : "Jetzt giessen"}</button>
                ${p.feedEvery > 0 && html`<button type="button" class="btn small" disabled=${busy || p.fed === HP.today()} onClick=${() => run(async () => { if (await care(ctx, p, "f")) onClose(); })}><span class="emo" aria-hidden="true">🌱</span>Jetzt düngen</button>`}
              </div>
            </div>
          </div>`}
        <div class="field">
          <label for="hp-pl-name">Name</label>
          <input id="hp-pl-name" class="input" maxlength="60" autocomplete="off" placeholder="z. B. Monstera, Basilikum" value=${d.name} onInput=${e => set({ name: e.target.value })} data-autofocus=${isNew ? "" : null} />
        </div>
        <div class="field">
          <span class="label" id="hp-pl-e">Bild</span>
          <div class="av-grid" role="radiogroup" aria-labelledby="hp-pl-e">${HP.PLANTS.map(it => html`
            <button type="button" key=${it[0]} role="radio" aria-checked=${String(d.emoji === it[0])} aria-label=${it[2]} title=${it[2]} class="av-pick" onClick=${() => set({ emoji: it[0] })}>${it[1]}</button>`)}
          </div>
        </div>
        <div class="field">
          <label for="hp-pl-room">Raum</label>
          <input id="hp-pl-room" class="input" maxlength="40" list="hp-pl-rooms" autocomplete="off" placeholder="z. B. Wohnzimmer, Balkon" value=${d.room} onInput=${e => set({ room: e.target.value })} />
          <datalist id="hp-pl-rooms">${rooms.map(r => html`<option value=${r}></option>`)}</datalist>
        </div>
        <div class="field">
          <span class="label" id="hp-pl-every">Giessen</span>
          <div class="every">
            <span class="stepper">
              <button type="button" aria-label="Einen Tag früher" disabled=${d.every <= 1} onClick=${() => step(-1)}>−</button>
              <output aria-labelledby="hp-pl-every">${rhythm(d.every)}</output>
              <button type="button" aria-label="Einen Tag später" disabled=${d.every >= 365} onClick=${() => step(1)}>+</button>
            </span>
          </div>
          <div class="chips">${EVERY.map(n => html`<button type="button" key=${n} class="chip" aria-pressed=${String(d.every === n)} onClick=${() => set({ every: n })}>${n === 7 ? "1 Woche" : n === 14 ? "2 Wochen" : n === 21 ? "3 Wochen" : n === 30 ? "Monat" : n + " Tage"}</button>`)}</div>
        </div>
        <div class="field">
          <label for="hp-pl-last">Zuletzt gegossen</label>
          <input id="hp-pl-last" class="input" type="date" max=${HP.today()} value=${d.last} onInput=${e => set({ last: e.target.value })} />
        </div>
        <div class="field">
          <span class="label" id="hp-pl-feed">Düngen</span>
          <div class="chips" role="radiogroup" aria-labelledby="hp-pl-feed">${FEED.map(([n, label]) => html`
            <button type="button" key=${n} role="radio" aria-checked=${String(d.feedEvery === n)} class="chip" onClick=${() => set({ feedEvery: n })}>${label}</button>`)}
          </div>
          ${d.feedEvery > 0 && html`
            <label for="hp-pl-fed" class="label sub">Zuletzt gedüngt</label>
            <input id="hp-pl-fed" class="input" type="date" max=${HP.today()} value=${d.fed} onInput=${e => set({ fed: e.target.value })} />`}
        </div>
        ${members.length > 1 && html`<${PeoplePick} id="hp-pl-who" label="Zuständig (optional)" people=${members} value=${d.who} onChange=${v => set({ who: v })} meId=${meId} allowNone=${true} />`}
        <div class="field">
          <label for="hp-pl-note">Notiz</label>
          <textarea id="hp-pl-note" class="input area" maxlength="500" rows="3" placeholder="z. B. mag es hell, aber keine pralle Sonne" value=${d.note} onInput=${e => set({ note: e.target.value })}></textarea>
        </div>
        ${p && p.log.length > 0 && html`
          <div class="field">
            <span class="label">Verlauf</span>
            <div class="rows">${p.log.slice(0, 12).map((l, i) => html`
              <div class="row" key=${i}>
                <span class="emo" aria-hidden="true">${l.k === "f" ? "🌱" : "💧"}</span>
                <span class="grow">${l.k === "f" ? "Gedüngt" : "Gegossen"}${l.by ? " von " + who(l.by).name : ""}</span>
                <span class="amt">${HP.dayLabel(l.d)}</span>
              </div>`)}
            </div>
          </div>`}
        <div class="foot">
          <button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Speichern</button>
          ${!isNew && html`<${DeleteButton} label="Pflanze löschen" onConfirm=${del} disabled=${busy} />`}
        </div>
      <//>`;
  }

  Object.assign(U, { Plants, PlantForm, plantCare: care, plantStatus: status, WaterButton });
})();
