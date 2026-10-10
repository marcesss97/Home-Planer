/* Home-Planer: recipes and cooking ideas. The household's own recipes, built-in ideas (ideen.js) to roll the dice on,
   a search by what is in the fridge, a week plan and one tap from the ingredients to the shopping list. A planned meal
   is an appointment of the kind "Essen" in the calendar, so it shows up there and on the overview as well. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP;
  if (!U) return;
  const { html, docId, Icon, Av, Sheet, DeleteButton, KindPick, PeoplePick, Empty, useBusy } = U;
  const { useState, useMemo } = U.P;

  /* ---------- helpers ---------- */
  const same = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();
  function findRecipe(ctx, id) { return (ctx.data.recipes || []).find(r => r.id === id) || HP.idea(id); }
  /* Own recipes first, then the ideas the household has not taken over yet. */
  function poolOf(own) {
    const titles = new Set(own.map(r => r.title.toLowerCase()));
    return own.concat(HP.ideas().filter(r => !titles.has(r.title.toLowerCase())));
  }
  const timeOf = r => (!r.time ? "" : r.time >= 60 && r.time % 60 === 0 ? r.time / 60 + " Std." : r.time > 60 ? Math.floor(r.time / 60) + " Std. " + (r.time % 60) + " Min." : r.time + " Min.");
  function metaOf(r) {
    const out = [];
    if (r.time) out.push(timeOf(r));
    out.push(r.serves === 1 ? "1 Portion" : r.serves + " Portionen");
    r.tags.slice(0, 2).forEach(t => out.push(HP.recipeTag(t).label));
    return out.join(" · ");
  }
  const cookedText = r => (r.last ? "zuletzt gekocht " + HP.relDays(HP.dayDiff(HP.today(), r.last)) : "");
  /* The idea of the day: the same all day long, on every device of the household. */
  function dailyIdea(ctx, list) {
    const pool = list || poolOf(ctx.data.recipes || []);
    if (!pool.length) return null;
    const fresh = pool.filter(r => !r.last || HP.dayDiff(r.last, HP.today()) > 4), from = fresh.length ? fresh : pool;
    return from[HP.hash(HP.today() + "|" + ctx.home.id) % from.length];
  }
  function mealsBetween(ctx, a, b) { return HP.occurrences((ctx.data.events || []).filter(e => e.cat === "meal"), a, b); }

  /* Puts ingredient lines on the shopping list. What is already open there is left alone, ticked items come back. */
  async function toShopping(ctx, r, lines) {
    const { act, data, meId, say } = ctx;
    let added = 0, had = 0;
    const list = (data.shopping || []).slice();
    const items = [];
    lines.forEach(line => {
      const p = HP.splitQty(line), parts = p.name.split(/\s*,\s*/).filter(Boolean);
      if (parts.length > 1 && parts.slice(1).every(x => /^[A-ZÄÖÜ]/.test(x))) parts.forEach((x, i) => items.push({ name: x, qty: i ? "" : p.qty, rest: "" }));
      else items.push({ name: parts[0] || "", qty: p.qty, rest: parts.slice(1).join(", ") });
    });
    for (const p of items) {
      const name = p.name.trim(), rest = p.rest;
      if (!name) continue;
      const note = ((rest ? rest + " · " : "") + "für " + r.title).slice(0, 200);
      const open = list.find(it => !it.done && same(it.name, name));
      if (open) { had++; continue; }
      const done = list.find(it => it.done && same(it.name, name));
      const ok = done
        ? await act.patch("shopping", done.id, { done: false, doneBy: null, doneAt: 0, qty: p.qty.slice(0, 30), note, up: Date.now() })
        : await act.save("shopping", { id: docId("s"), name: name.slice(0, 80), qty: p.qty.slice(0, 30), sec: HP.shopGuess(name), note, done: false, by: meId || null, doneBy: null, ts: Date.now() + added, doneAt: 0, up: Date.now() });
      if (!ok) return false;
      added++;
      list.push({ name, done: false });
    }
    say(added === 0 ? "Alles steht schon auf der Einkaufsliste." : (added === 1 ? "1 Zutat" : added + " Zutaten") + " auf der Einkaufsliste." + (had ? (had === 1 ? " Eine stand schon drauf." : " " + had + " standen schon drauf.") : ""));
    return true;
  }
  /* Takes a built-in idea over as the household's own recipe. Returns the new id. */
  async function adopt(ctx, r) {
    const id = docId("r");
    const body = { id, title: r.title, emoji: r.emoji, cat: r.cat, tags: r.tags, time: r.time, serves: r.serves, ingr: r.ingr, steps: r.steps, link: r.link, note: r.note,
      fav: false, last: "", n: 0, by: ctx.meId || null, ts: Date.now(), up: Date.now() };
    if (!(await ctx.act.save("recipes", body))) return null;
    ctx.say("«" + r.title + "» ist jetzt in euren Rezepten.");
    return id;
  }

  /* ---------- the idea of the moment ---------- */
  const FILTERS = [["vegi", "Vegi"], ["quick", "Schnell"], ["cheap", "Günstig"]];
  function IdeaCard({ ctx }) {
    const own = ctx.data.recipes || [];
    const [tags, setTags] = useState([]);
    const [mine, setMine] = useState(false);
    const [cur, setCur] = useState(null);
    const list = useMemo(() => poolOf(own).filter(r => (!mine || !r.idea) && tags.every(t => HP.hasTag(r, t))), [own, tags, mine]);
    const r = (cur && list.find(x => x.id === cur)) || dailyIdea(ctx, list);
    const dice = () => {
      const others = list.filter(x => x !== r && (!x.last || HP.dayDiff(x.last, HP.today()) > 4));
      const from = others.length ? others : list.filter(x => x !== r);
      if (from.length) setCur(from[Math.floor(Math.random() * from.length)].id);
    };
    const toggle = t => { setCur(null); setTags(tags.indexOf(t) >= 0 ? tags.filter(x => x !== t) : tags.concat(t)); };
    return html`
      <section class="idea">
        <div class="idea-head"><h2 class="sec-h">Was koche ich heute?</h2></div>
        <div class="chips" role="group" aria-label="Filter für Kochideen">
          ${FILTERS.map(([t, label]) => html`<button type="button" key=${t} class="chip" aria-pressed=${String(tags.indexOf(t) >= 0)} onClick=${() => toggle(t)}><span class="emo" aria-hidden="true">${HP.recipeTag(t).emoji}</span>${label}</button>`)}
          ${own.length > 0 && html`<button type="button" class="chip" aria-pressed=${String(mine)} onClick=${() => { setCur(null); setMine(!mine); }}>Nur unsere</button>`}
        </div>
        ${r
          ? html`
            <button type="button" class="idea-card" onClick=${() => ctx.open({ t: "recipe", id: r.id })}>
              <span class="idea-e" aria-hidden="true">${HP.dishEmoji(r.emoji)}</span>
              <span class="idea-body">
                <span class="idea-src">${r.idea ? "Kochidee" : r.fav ? "★ Euer Favorit" : "Aus euren Rezepten"}</span>
                <span class="idea-t">${r.title}</span>
                <span class="x-s">${metaOf(r)}${r.last ? " · " + cookedText(r) : ""}</span>
              </span>
            </button>
            <div class="btn-row">
              <button type="button" class="btn small" disabled=${list.length < 2} onClick=${dice}><span class="emo" aria-hidden="true">🎲</span>Andere Idee</button>
              <button type="button" class="btn small" onClick=${() => ctx.open({ t: "meal", rid: r.id })}><${Icon} n="plus" s=${16} />Einplanen</button>
            </div>`
          : html`<p class="hint">Keine Idee passt zu diesen Filtern.</p>`}
      </section>`;
  }

  /* ---------- the week plan ---------- */
  function MealChip({ ctx, o }) {
    const rec = o.e.rid ? findRecipe(ctx, o.e.rid) : null, cook = o.e.who.map(ctx.who).filter(m => !m.gone)[0];
    return html`<button type="button" class="meal" onClick=${() => (rec ? ctx.open({ t: "recipe", id: rec.id, plan: o.e.id }) : ctx.open({ t: "event", e: o.e, at: o.start }))}>
      <span class="emo" aria-hidden="true">${rec ? HP.dishEmoji(rec.emoji) : "🍽️"}</span><span class="meal-t">${o.e.title}</span>
      ${cook && html`<span title=${cook.name + " kocht"}><${Av} m=${cook} s=${1} /></span>`}
    </button>`;
  }
  function WeekPlan({ ctx }) {
    const today = HP.today(), last = HP.addDays(today, 6);
    const byDay = useMemo(() => { const m = {}; mealsBetween(ctx, today, last).forEach(o => { (m[o.date] || (m[o.date] = [])).push(o); }); return m; }, [ctx.data.events, today]);
    const days = Array.from({ length: 7 }, (_, i) => HP.addDays(today, i));
    return html`
      <section class="panel">
        <div class="panel-head"><h2 class="sec-h">Wochenplan</h2></div>
        <div class="week">${days.map(d => html`
          <div class="week-row" key=${d}>
            <span class=${"week-d" + (d === today ? " now" : "")}>${d === today ? "Heute" : HP.dayDiff(today, d) === 1 ? "Morgen" : HP.fmtDate(d, { weekday: "short", day: "numeric" })}</span>
            <span class="week-m">${(byDay[d] || []).length ? byDay[d].map(o => html`<${MealChip} key=${o.e.id} ctx=${ctx} o=${o} />`) : html`<span class="muted">–</span>`}</span>
            <button type="button" class="icon-btn" aria-label=${"Essen planen für " + HP.longDay(d)} onClick=${() => ctx.open({ t: "meal", date: d })}><${Icon} n="plus" s=${18} /></button>
          </div>`)}
        </div>
        <p>Geplantes Essen steht auch im Kalender und auf «Start». Mit dem Suchfeld unten findest du Rezepte zu dem, was im Kühlschrank ist.</p>
      </section>`;
  }

  /* ---------- the tab ---------- */
  function RecipeRow({ ctx, r, hits }) {
    const cat = HP.recipeCat(r.cat);
    return html`
      <button type="button" class="x" onClick=${() => ctx.open({ t: "recipe", id: r.id })}>
        <span class=${"x-ic rc-" + cat.id} aria-hidden="true">${HP.dishEmoji(r.emoji)}</span>
        <span class="x-main">
          <span class="x-t">${r.title}${r.fav && html` <span class="star" aria-label="Favorit">★</span>`}${r.idea && hits && html` <span class="tagi">Idee</span>`}</span>
          <span class="x-s">${hits && hits.length > 1 ? "passt: " + hits.join(", ") : [metaOf(r), cookedText(r)].filter(Boolean).join(" · ")}</span>
        </span>
        <span class="go"><${Icon} n="next" s=${18} /></span>
      </button>`;
  }
  function Recipes({ ctx }) {
    const own = ctx.data.recipes;
    const [q, setQ] = useState("");
    const [allIdeas, setAllIdeas] = useState(false);
    const words = useMemo(() => HP.searchWords(q), [q]);
    const found = useMemo(() => (words.length ? poolOf(own || []).map(r => ({ r, m: HP.recipeMatch(r, words) })).filter(x => x.m.score > 0)
      .sort((a, b) => b.m.score - a.m.score || (a.r.idea ? 1 : 0) - (b.r.idea ? 1 : 0) || a.r.title.localeCompare(b.r.title, "de")) : []), [own, words]);
    const groups = useMemo(() => HP.RECIPE_CATS.map(c => ({ c, items: (own || []).filter(r => r.cat === c.id).sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || a.title.localeCompare(b.title, "de")) })).filter(g => g.items.length), [own]);
    const ideas = useMemo(() => poolOf(own || []).filter(r => r.idea), [own]);
    return html`
      <${U.TabHead} emoji="🍳" title="Rezepte">${own && own.length > 0 && html`<span class="tab-head-n">${own.length === 1 ? "1 Rezept" : own.length + " Rezepte"}</span>`}<//>
      <${IdeaCard} ctx=${ctx} />
      <${WeekPlan} ctx=${ctx} />
      <div class="search">
        <${Icon} n="search" s=${18} />
        <label class="sr" for="hp-rc-q">Rezepte durchsuchen</label>
        <input id="hp-rc-q" class="input" type="search" autocomplete="off" placeholder="Was ist da? z. B. Zucchetti, Feta" value=${q} onInput=${e => setQ(e.target.value)} />
      </div>
      ${words.length > 0 && html`
        <section class="stack">
          <h2 class="aisle"><span class="emo" aria-hidden="true">🔎</span>${found.length ? (found.length === 1 ? "1 Treffer" : found.length + " Treffer") : "Nichts gefunden"}</h2>
          ${found.length > 0 && html`<div class="list">${found.slice(0, 30).map(x => html`<${RecipeRow} key=${x.r.id} ctx=${ctx} r=${x.r} hits=${x.m.hits} />`)}</div>`}
          ${!found.length && html`<p class="hint">Weder in euren Rezepten noch in den Kochideen kommt «${q.trim()}» vor.</p>`}
        </section>`}
      ${!words.length && own === null && html`<p class="status" role="status">Rezepte werden geladen …</p>`}
      ${!words.length && own && !own.length && html`
        <${Empty} emoji="🍳📖🥕" title="Noch keine eigenen Rezepte" text="Sammelt hier, was bei euch auf den Tisch kommt: mit Zutaten, die mit einem Tipp auf der Einkaufsliste landen, und auf beliebig viele Portionen umgerechnet. Zum Start helfen die Kochideen weiter unten.">
          <button type="button" class="btn primary" onClick=${() => ctx.open({ t: "recipe-edit" })}><${Icon} n="plus" s=${18} />Rezept erfassen</button>
        <//>`}
      ${!words.length && groups.map(g => html`
        <section class="stack" key=${g.c.id}>
          <h2 class="aisle"><span class="emo" aria-hidden="true">${g.c.emoji}</span>${g.c.label}<span class="aisle-n">${g.items.length}</span></h2>
          <div class="list">${g.items.map(r => html`<${RecipeRow} key=${r.id} ctx=${ctx} r=${r} />`)}</div>
        </section>`)}
      ${!words.length && ideas.length > 0 && html`
        <section class="stack">
          <h2 class="aisle"><span class="emo" aria-hidden="true">💡</span>Kochideen<span class="aisle-n">${ideas.length}</span></h2>
          <div class="list">${(allIdeas ? ideas : ideas.slice(0, 5)).map(r => html`<${RecipeRow} key=${r.id} ctx=${ctx} r=${r} />`)}</div>
          ${!allIdeas && ideas.length > 5 && html`<div><button type="button" class="btn" onClick=${() => setAllIdeas(true)}><${Icon} n="down" s=${18} />Alle ${ideas.length} Ideen zeigen</button></div>`}
          <p class="hint">Eine Idee gefällt? Öffnen und «Übernehmen»: Dann gehört sie zu euren Rezepten und lässt sich anpassen.</p>
        </section>`}`;
  }

  /* ---------- one recipe, to cook from ---------- */
  function RecipeView({ ctx, r, plan, onClose }) {
    const { act, say, who, open } = ctx;
    const [serves, setServes] = useState(r.serves);
    const [skip, setSkip] = useState(() => { const s = {}; r.ingr.forEach((l, i) => { if (HP.isStaple(l)) s[i] = true; }); return s; });
    const [busy, run] = useBusy();
    const factor = serves / r.serves, lines = r.ingr.map(l => HP.scaleLine(l, factor));
    const chosen = lines.filter((l, i) => !skip[i]);
    const planEv = plan ? (ctx.data.events || []).find(e => e.id === plan) : null;
    const cook = planEv ? planEv.who.map(who).filter(m => !m.gone)[0] : null;
    const take = () => run(async () => { const id = await adopt(ctx, r); if (id) open({ t: "recipe", id }); });
    const cooked = () => run(async () => {
      if (await act.patch("recipes", r.id, { last: HP.today(), n: (r.n || 0) + 1, up: Date.now() })) say("En Guete! 😋 «" + r.title + "» ist als gekocht notiert.");
    });
    const fav = () => run(() => act.patch("recipes", r.id, { fav: !r.fav, up: Date.now() }));
    return html`
      <${Sheet} title=${r.title} onClose=${onClose} closeLabel="Fertig"
        action=${r.idea
          ? html`<button type="button" class="btn primary small" disabled=${busy} onClick=${take}>Übernehmen</button>`
          : html`<button type="button" class="btn small" onClick=${() => open({ t: "recipe-edit", r })}><${Icon} n="pen" s=${16} />Bearbeiten</button>`}>
        <div class="rc-hero">
          <span class=${"rc-e rc-" + r.cat} aria-hidden="true">${HP.dishEmoji(r.emoji)}</span>
          <div class="stack">
            <span class="hint">${r.idea ? "Kochidee" : HP.recipeCat(r.cat).label}${r.time ? " · " + timeOf(r) : ""}</span>
            ${r.tags.length > 0 && html`<div class="chips">${r.tags.map(t => html`<span key=${t} class="chip static mini"><span class="emo" aria-hidden="true">${HP.recipeTag(t).emoji}</span>${HP.recipeTag(t).label}</span>`)}</div>`}
          </div>
        </div>
        ${planEv && html`
          <div class="note"><${Icon} n="check" /><div class="stack">
            <p><strong>Eingeplant: ${HP.longDay(planEv.date)}</strong>${cook ? ", " + cook.name + " kocht" : ""}.</p>
            <div class="btn-row">
              <button type="button" class="btn small" onClick=${() => open({ t: "event", e: planEv, at: planEv.date })}><${Icon} n="pen" s=${16} />Plan ändern</button>
              <button type="button" class="btn small danger" disabled=${busy} onClick=${() => run(async () => { if (await act.remove("events", planEv.id)) { say("Aus dem Wochenplan genommen."); onClose(); } })}><${Icon} n="trash" s=${16} />Aus dem Plan</button>
            </div>
          </div></div>`}
        ${r.ingr.length > 0 && html`
          <div class="field">
            <div class="rc-sub">
              <span class="label">Zutaten</span>
              <span class="stepper" role="group" aria-label="Portionen">
                <button type="button" aria-label="Eine Portion weniger" disabled=${serves <= 1} onClick=${() => setServes(serves - 1)}>−</button>
                <output aria-live="polite">${serves === 1 ? "1 Portion" : serves + " Portionen"}</output>
                <button type="button" aria-label="Eine Portion mehr" disabled=${serves >= 50} onClick=${() => setServes(serves + 1)}>+</button>
              </span>
            </div>
            <div class="rows">${lines.map((l, i) => html`
              <label class="row ingr" key=${i}>
                <input type="checkbox" checked=${!skip[i]} aria-label=${l + " auf die Einkaufsliste"} onChange=${e => setSkip(Object.assign({}, skip, { [i]: !e.target.checked }))} />
                <span class="grow">${l}</span>
              </label>`)}
            </div>
            <p class="hint">Angekreuzte Zutaten kommen auf die Einkaufsliste. Grundvorrat wie Salz und Öl ist schon abgewählt; nimm weg, was ihr sonst noch habt.</p>
            <div><button type="button" class="btn primary" disabled=${busy || !chosen.length} onClick=${() => run(() => toShopping(ctx, r, chosen))}><${Icon} n="cart" s=${18} />Auf die Einkaufsliste (${chosen.length})</button></div>
          </div>`}
        ${r.steps.length > 0 && html`
          <div class="field">
            <span class="label">Zubereitung</span>
            <ol class="steps">${r.steps.map((st, i) => html`<li key=${i}><div class="step"><p>${st}</p></div></li>`)}</ol>
          </div>`}
        ${r.note.trim() && html`<div class="field"><span class="label">Notiz</span><p class="note-text">${r.note}</p></div>`}
        ${r.link && html`<div><a class="btn small" href=${r.link} target="_blank" rel="noopener noreferrer"><${Icon} n="ext" s=${16} />Zum Originalrezept</a></div>`}
        ${!r.ingr.length && !r.steps.length && !r.note.trim() && html`<p class="hint">Noch keine Zutaten und Schritte. ${r.idea ? "" : "Tippe oben auf «Bearbeiten»."}</p>`}
        <div class="foot">
          <button type="button" class="btn block" onClick=${() => open({ t: "meal", rid: r.id })}><${Icon} n="plus" s=${18} />Einplanen</button>
          ${!r.idea && html`
            <div class="btn-row center">
              <button type="button" class="btn" disabled=${busy || r.last === HP.today()} onClick=${cooked}><span class="emo" aria-hidden="true">😋</span>${r.last === HP.today() ? "Heute gekocht" : "Heute gekocht?"}</button>
              <button type="button" class="btn" aria-pressed=${String(r.fav)} disabled=${busy} onClick=${fav}><span class="star" aria-hidden="true">${r.fav ? "★" : "☆"}</span>${r.fav ? "Favorit" : "Als Favorit"}</button>
            </div>
            <p class="meta">${[r.by ? "Erfasst von " + who(r.by).name : "", r.n ? (r.n === 1 ? "einmal gekocht" : r.n + "-mal gekocht") + (r.last ? ", " + cookedText(r) : "") : ""].filter(Boolean).join(" · ")}</p>`}
          ${r.idea && html`<button type="button" class="btn primary block" disabled=${busy} onClick=${take}>In unsere Rezepte übernehmen</button>`}
        </div>
      <//>`;
  }

  /* ---------- one recipe, to edit ---------- */
  const TIMES = [15, 30, 45, 60, 90];
  function RecipeForm({ ctx, r, onClose, onSaved }) {
    const { act, say, meId } = ctx;
    const isNew = !r;
    const [d, setD] = useState(() => r
      ? { title: r.title, emoji: r.emoji, cat: r.cat, tags: r.tags.slice(), time: r.time ? String(r.time) : "", serves: r.serves, ingr: r.ingr.join("\n"), steps: r.steps.join("\n"), link: r.link, note: r.note }
      : { title: "", emoji: "teller", cat: "main", tags: [], time: "", serves: 4, ingr: "", steps: "", link: "", note: "" });
    const [err, setErr] = useState(null);
    const [busy, run] = useBusy();
    const set = p => { setErr(null); setD(prev => Object.assign({}, prev, p)); };
    const toggleTag = t => set({ tags: d.tags.indexOf(t) >= 0 ? d.tags.filter(x => x !== t) : d.tags.concat(t) });
    const lines = (t, max, len) => t.split("\n").map(x => x.replace(/^\s*(?:[-•*]|\d+[.)])\s+/, "").trim().slice(0, len)).filter(Boolean).slice(0, max);
    const save = () => run(async () => {
      const title = d.title.trim(), link = d.link.trim(), time = d.time.trim() ? parseInt(d.time, 10) : 0;
      if (!title) { setErr("Gib dem Rezept einen Namen."); return; }
      if (link && !HP.okUrl(link)) { setErr("Der Link ist keine vollständige Adresse. Sie beginnt mit https:// oder http://."); return; }
      if (d.time.trim() && !(time >= 0 && time <= 1440)) { setErr("Gib die Zeit in Minuten an, zum Beispiel 30."); return; }
      const fields = { title: title.slice(0, 80), emoji: d.emoji, cat: d.cat, tags: d.tags, time: time || 0, serves: d.serves, ingr: lines(d.ingr, 60, 120), steps: lines(d.steps, 40, 600), link, note: d.note.slice(0, 2000), up: Date.now() };
      if (isNew) {
        const id = docId("r");
        if (await act.save("recipes", Object.assign({ id, fav: false, last: "", n: 0, by: meId || null, ts: Date.now() }, fields))) { say("Rezept gespeichert."); onSaved(id); }
      } else if (await act.patch("recipes", r.id, fields)) { say("Änderung gespeichert."); onSaved(r.id); }
    });
    const del = () => run(async () => { if (await act.remove("recipes", r.id)) { onClose(true); say("Rezept gelöscht."); } });
    return html`
      <${Sheet} title=${isNew ? "Neues Rezept" : "Rezept bearbeiten"} onClose=${() => onClose(false)} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        <div class="field">
          <label for="hp-rc-title">Name</label>
          <input id="hp-rc-title" class="input" maxlength="80" autocomplete="off" placeholder="z. B. Omas Gemüsesuppe" value=${d.title} onInput=${e => set({ title: e.target.value })} data-autofocus=${isNew ? "" : null} />
        </div>
        <div class="field">
          <span class="label" id="hp-rc-e">Bild</span>
          <div class="av-grid" role="radiogroup" aria-labelledby="hp-rc-e">${HP.DISHES.map(it => html`
            <button type="button" key=${it[0]} role="radio" aria-checked=${String(d.emoji === it[0])} aria-label=${it[2]} title=${it[2]} class="av-pick" onClick=${() => set({ emoji: it[0] })}>${it[1]}</button>`)}
          </div>
        </div>
        <${KindPick} id="hp-rc-cat" label="Art" list=${HP.RECIPE_CATS} value=${d.cat} onChange=${cat => set({ cat })} />
        <div class="field">
          <span class="label" id="hp-rc-tags">Merkmale</span>
          <div class="chips" role="group" aria-labelledby="hp-rc-tags">${HP.RECIPE_TAGS.map(t => html`
            <button type="button" key=${t.id} class="chip" aria-pressed=${String(d.tags.indexOf(t.id) >= 0)} onClick=${() => toggleTag(t.id)}><span class="emo" aria-hidden="true">${t.emoji}</span>${t.label}</button>`)}
          </div>
        </div>
        <div class="two">
          <div class="field">
            <label for="hp-rc-time">Zeit in Minuten</label>
            <input id="hp-rc-time" class="input" inputmode="numeric" autocomplete="off" placeholder="z. B. 30" value=${d.time} onInput=${e => set({ time: e.target.value.replace(/[^\d]/g, "").slice(0, 4) })} />
          </div>
          <div class="field">
            <span class="label" id="hp-rc-serves">Portionen</span>
            <span class="stepper" role="group" aria-labelledby="hp-rc-serves">
              <button type="button" aria-label="Eine Portion weniger" disabled=${d.serves <= 1} onClick=${() => set({ serves: d.serves - 1 })}>−</button>
              <output>${d.serves}</output>
              <button type="button" aria-label="Eine Portion mehr" disabled=${d.serves >= 50} onClick=${() => set({ serves: d.serves + 1 })}>+</button>
            </span>
          </div>
        </div>
        <div class="chips">${TIMES.map(t => html`<button type="button" key=${t} class="chip" aria-pressed=${String(d.time === String(t))} onClick=${() => set({ time: String(t) })}>${t < 60 ? t + " Min." : t === 60 ? "1 Std." : "1½ Std."}</button>`)}</div>
        <div class="field">
          <label for="hp-rc-ingr">Zutaten, eine pro Zeile</label>
          <textarea id="hp-rc-ingr" class="input area tall" maxlength="7000" rows="8" placeholder=${"200 g Spaghetti\n1 Zwiebel\n2 EL Olivenöl\nSalz, Pfeffer"} value=${d.ingr} onInput=${e => set({ ingr: e.target.value })}></textarea>
          <p class="hint">Mit der Menge vorne («200 g Spaghetti») rechnet der Home-Planer auf andere Portionen um und setzt die Menge auf die Einkaufsliste.</p>
        </div>
        <div class="field">
          <label for="hp-rc-steps">Zubereitung, ein Schritt pro Zeile</label>
          <textarea id="hp-rc-steps" class="input area tall" maxlength="20000" rows="8" placeholder=${"Wasser aufkochen und salzen.\nZwiebel hacken und andünsten."} value=${d.steps} onInput=${e => set({ steps: e.target.value })}></textarea>
        </div>
        <div class="field">
          <label for="hp-rc-link">Link zum Originalrezept</label>
          <input id="hp-rc-link" class="input" type="url" inputmode="url" maxlength="500" autocomplete="off" placeholder="https://…" value=${d.link} onInput=${e => set({ link: e.target.value })} />
        </div>
        <div class="field">
          <label for="hp-rc-note">Notiz</label>
          <textarea id="hp-rc-note" class="input area" maxlength="2000" rows="3" placeholder="z. B. mit doppelt so viel Knoblauch" value=${d.note} onInput=${e => set({ note: e.target.value })}></textarea>
        </div>
        <div class="foot">
          <button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Speichern</button>
          ${!isNew && html`<${DeleteButton} label="Rezept löschen" onConfirm=${del} disabled=${busy} />`}
        </div>
      <//>`;
  }

  /* ---------- planning a meal ---------- */
  function MealSheet({ ctx, date, rid, onClose }) {
    const { act, say, meId, members } = ctx;
    const [d, setD] = useState(() => ({ date: HP.validDate(date) ? date : HP.today(), rid: rid || null, text: "", cook: meId || null, time: "" }));
    const [err, setErr] = useState(null);
    const [busy, run] = useBusy();
    const set = p => { setErr(null); setD(prev => Object.assign({}, prev, p)); };
    const picked = d.rid ? findRecipe(ctx, d.rid) : null;
    const pool = useMemo(() => poolOf(ctx.data.recipes || []), [ctx.data.recipes]);
    const words = HP.searchWords(d.text);
    const offers = useMemo(() => {
      if (words.length) return pool.map(r => ({ r, s: HP.recipeMatch(r, words).score })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 6).map(x => x.r);
      const own = pool.filter(r => !r.idea).sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || (a.last || "").localeCompare(b.last || ""));
      return own.concat(pool.filter(r => r.idea)).slice(0, 6);
    }, [pool, d.text]);
    const save = () => run(async () => {
      const title = (picked ? picked.title : d.text.trim()).slice(0, 100);
      if (!title) { setErr("Wähle ein Rezept oder schreib, was es gibt."); return; }
      if (!HP.validDate(d.date)) { setErr("Wähle einen Tag."); return; }
      const body = { id: docId("e"), title, cat: "meal", date: d.date, end: "", time: d.time || "", endTime: "", repeat: "none", until: "", who: d.cook ? [d.cook] : [], note: "", skip: [],
        rid: picked ? picked.id : null, by: meId || null, ts: Date.now(), up: Date.now() };
      if (await act.save("events", body)) { onClose(); say("Eingeplant: " + title + ", " + (d.date === HP.today() ? "heute" : HP.longDay(d.date)) + "."); }
    });
    return html`
      <${Sheet} title="Essen planen" onClose=${onClose} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        <div class="two">
          <div class="field">
            <label for="hp-ml-date">Tag</label>
            <input id="hp-ml-date" class="input" type="date" value=${d.date} onInput=${e => set({ date: e.target.value })} />
          </div>
          <div class="field">
            <label for="hp-ml-time">Uhrzeit (optional)</label>
            <input id="hp-ml-time" class="input" type="time" value=${d.time} onInput=${e => set({ time: e.target.value })} />
          </div>
        </div>
        <div class="field">
          <span class="label">Was gibt es?</span>
          ${picked
            ? html`<div class="picked"><span class=${"x-ic rc-" + picked.cat} aria-hidden="true">${HP.dishEmoji(picked.emoji)}</span><strong class="grow">${picked.title}</strong>
                <button type="button" class="btn small ghost" onClick=${() => set({ rid: null })}>Ändern</button></div>`
            : html`
              <input id="hp-ml-text" class="input" maxlength="100" autocomplete="off" aria-label="Was gibt es?" placeholder="Rezept suchen oder einfach hinschreiben" value=${d.text} onInput=${e => set({ text: e.target.value })} data-autofocus="" />
              ${offers.length > 0 && html`<div class="chips">${offers.map(r => html`<button type="button" key=${r.id} class="chip" onClick=${() => set({ rid: r.id, text: "" })}><span class="emo" aria-hidden="true">${HP.dishEmoji(r.emoji)}</span>${r.title}</button>`)}</div>`}
              <p class="hint">Ein Rezept antippen, oder einfach hinschreiben, etwa «Resten» oder «Pizza bestellen».</p>`}
        </div>
        ${members.length > 1 && html`<${PeoplePick} id="hp-ml-cook" label="Wer kocht?" people=${members} value=${d.cook} onChange=${v => set({ cook: v })} meId=${meId} allowNone=${true} />`}
        <div class="foot"><button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Einplanen</button></div>
      <//>`;
  }

  Object.assign(U, { Recipes, RecipeView, RecipeForm, MealSheet, findRecipe, dailyIdea, recipeMeta: metaOf });
})();
