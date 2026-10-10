/* Home-Planer: recipes and cooking ideas. The household's own recipes, built-in ideas (ideen.js) to roll the dice on,
   a search by what is in the fridge, a week plan and one tap from the ingredients to the shopping list. A planned meal
   is an appointment of the kind "Essen" in the calendar, so it shows up there and on the overview as well. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP;
  if (!U) return;
  const { html, docId, Icon, Av, Sheet, DeleteButton, KindPick, PeoplePick, Empty, useBusy } = U;
  const { useState, useMemo, useRef, useEffect } = U.P;

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
      kitchen: r.kitchen || "", coll: r.coll || [], fav: false, last: "", n: 0, by: ctx.meId || null, ts: Date.now(), up: Date.now() };
    if (!(await ctx.act.save("recipes", body))) return null;
    ctx.say("«" + r.title + "» ist jetzt in euren Rezepten.");
    return id;
  }

  /* ---------- the idea of the moment ---------- */
  const FILTERS = [["vegi", "Vegi"], ["quick", "Schnell"], ["cheap", "Günstig"]];
  const notFlop = r => HP.noteSummary(r).mood !== "flop";
  function IdeaCard({ ctx }) {
    const own = ctx.data.recipes || [];
    const [tags, setTags] = useState([]);
    const [mine, setMine] = useState(false);
    const [cur, setCur] = useState(null);
    const [region, setRegion] = useState("");
    const list = useMemo(() => poolOf(own).filter(r => (!mine || !r.idea) && notFlop(r) && tags.every(t => HP.hasTag(r, t)) && (!region || (r.kitchen && HP.kitchen(r.kitchen).region === region))), [own, tags, mine, region]);
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
        <div class="chips" role="group" aria-label="Küche">
          ${HP.REGIONS.slice(0, 3).map(g => html`<button type="button" key=${g.id} class="chip" aria-pressed=${String(region === g.id)} onClick=${() => { setCur(null); setRegion(region === g.id ? "" : g.id); }}><span class="emo" aria-hidden="true">${g.emoji}</span>${g.id === "nahost" ? "Nahost" : g.label}</button>`)}
        </div>
        ${r
          ? html`
            <button type="button" class="idea-card" onClick=${() => ctx.open({ t: "recipe", id: r.id })}>
              <span class="idea-e" aria-hidden="true">${HP.dishEmoji(r.emoji)}</span>
              <span class="idea-body">
                <span class="idea-src">${r.idea ? "Aus dem Rezeptbuch" + (r.kitchen ? " · " + HP.kitchen(r.kitchen).label : "") : r.fav ? "★ Euer Favorit" : "Aus euren Rezepten"}</span>
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
  function moodBadge(r) {
    const s = HP.noteSummary(r);
    if (!s.mood && !s.tips.length) return null;
    return html` <span class="moodb" aria-label=${(s.mood ? "Zuletzt: " + HP.mood(s.mood).label : "") + (s.tips.length ? (s.mood ? ", " : "") + "mit Tipp fürs nächste Mal" : "")}>${s.mood ? HP.mood(s.mood).emoji : ""}${s.tips.length ? "💡" : ""}</span>`;
  }
  function RecipeRow({ ctx, r, hits, back, sub }) {
    const cat = HP.recipeCat(r.cat);
    return html`
      <button type="button" class="x" onClick=${() => ctx.open({ t: "recipe", id: r.id, back })}>
        <span class=${"x-ic rc-" + cat.id} aria-hidden="true">${HP.dishEmoji(r.emoji)}</span>
        <span class="x-main">
          <span class="x-t">${r.title}${r.fav && html` <span class="star" aria-label="Favorit">★</span>`}${moodBadge(r)}${r.idea && hits && html` <span class="tagi">Buch</span>`}</span>
          <span class="x-s">${hits && hits.length > 1 ? "passt: " + hits.join(", ") : sub || [metaOf(r), cookedText(r)].filter(Boolean).join(" · ")}</span>
        </span>
        <span class="go"><${Icon} n="next" s=${18} /></span>
      </button>`;
  }
  function Recipes({ ctx }) {
    const own = ctx.data.recipes;
    const [q, setQ] = useState("");
    const words = useMemo(() => HP.searchWords(q), [q]);
    const found = useMemo(() => (words.length ? poolOf(own || []).map(r => ({ r, m: HP.recipeMatch(r, words) })).filter(x => x.m.score > 0)
      .sort((a, b) => b.m.score - a.m.score || (a.r.idea ? 1 : 0) - (b.r.idea ? 1 : 0) || a.r.title.localeCompare(b.r.title, "de")) : []), [own, words]);
    const groups = useMemo(() => HP.RECIPE_CATS.map(c => ({ c, items: (own || []).filter(r => r.cat === c.id).sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || a.title.localeCompare(b.title, "de")) })).filter(g => g.items.length), [own]);
    return html`
      <${U.TabHead} emoji="🍳" title="Rezepte">${own && own.length > 0 && html`<span class="tab-head-n">${own.length === 1 ? "1 Rezept" : own.length + " Rezepte"}</span>`}<//>
      <section class="panel import">
        <div class="panel-head"><h2 class="sec-h">Rezept übernehmen</h2></div>
        <div class="quick-grid">
          <button type="button" class="qa" onClick=${() => ctx.open({ t: "import", mode: "link" })}><span class="emo" aria-hidden="true">🔗</span>Aus Link</button>
          <button type="button" class="qa" onClick=${() => ctx.open({ t: "import", mode: "image" })}><span class="emo" aria-hidden="true">📷</span>Screenshot</button>
          <button type="button" class="qa" onClick=${() => ctx.open({ t: "import", mode: "text" })}><span class="emo" aria-hidden="true">📋</span>Aus Text</button>
        </div>
        <p>Link von Fooby, Migusto, Betty Bossi, Swissmilk oder Chefkoch einfügen, einen Screenshot wählen oder Text einfügen: Daraus entstehen Rezept, Einkaufsliste und Kochmodus.</p>
      </section>
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
        <${Empty} emoji="🍳📖🥕" title="Noch keine eigenen Rezepte" text="Sammelt hier, was bei euch auf den Tisch kommt: mit Zutaten, die mit einem Tipp auf der Einkaufsliste landen, und auf beliebig viele Portionen umgerechnet. Zum Start hilft das Rezeptbuch weiter unten.">
          <button type="button" class="btn primary" onClick=${() => ctx.open({ t: "recipe-edit" })}><${Icon} n="plus" s=${18} />Rezept erfassen</button>
        <//>`}
      ${!words.length && groups.map(g => html`
        <section class="stack" key=${g.c.id}>
          <h2 class="aisle"><span class="emo" aria-hidden="true">${g.c.emoji}</span>${g.c.label}<span class="aisle-n">${g.items.length}</span></h2>
          <div class="list">${g.items.map(r => html`<${RecipeRow} key=${r.id} ctx=${ctx} r=${r} />`)}</div>
        </section>`)}
      ${!words.length && html`<${BookTeaser} ctx=${ctx} />`}`;
  }

  /* ---------- the recipe book ---------- */
  function BookTeaser({ ctx }) {
    const all = HP.ideas();
    if (!all.length) return null;
    const inColl = id => all.filter(r => r.coll.indexOf(id) >= 0).length, inRegion = id => all.filter(r => r.kitchen && HP.kitchen(r.kitchen).region === id).length;
    return html`
      <section class="stack book" id="hp-book">
        <h2 class="aisle"><span class="emo" aria-hidden="true">📖</span>Rezeptbuch<span class="aisle-n">${all.length} Rezepte</span></h2>
        <div class="book-colls">${HP.COLLECTIONS.map(c => html`
          <button type="button" key=${c.id} class="book-coll" onClick=${() => ctx.open({ t: "book", coll: c.id })}>
            <span class="book-e" aria-hidden="true">${c.emoji}</span>
            <span class="x-main"><span class="x-t">${c.label}</span><span class="x-s">${inColl(c.id)} Rezepte</span></span>
            <${Icon} n="next" s=${18} />
          </button>`)}
        </div>
        <div class="quick-grid">${HP.REGIONS.map(g => html`
          <button type="button" key=${g.id} class="qa" onClick=${() => ctx.open({ t: "book", region: g.id })}><span class="emo" aria-hidden="true">${g.emoji}</span>${g.label}<span class="qa-n">${inRegion(g.id)}</span></button>`)}
        </div>
        <div><button type="button" class="btn" onClick=${() => ctx.open({ t: "book" })}><${Icon} n="search" s=${18} />Ganzes Rezeptbuch durchblättern</button></div>
        <p class="hint">Ein Rezept gefällt? Öffnen und «Übernehmen», oder einfach eine Notiz schreiben: Dann gehört es zu euren Rezepten und lässt sich anpassen.</p>
      </section>`;
  }
  const BOOK_TAGS = [["vegi", "Vegi"], ["vegan", "Vegan"], ["quick", "Schnell"], ["cheap", "Günstig"], ["guests", "Für Gäste"]];
  function BookSheet({ ctx, coll: coll0, region: region0, kitchen: kitchen0, tags: tags0, q: q0, onClose }) {
    const [coll, setColl] = useState(coll0 || "");
    const [region, setRegion] = useState(region0 || (kitchen0 ? HP.kitchen(kitchen0).region : ""));
    const [kitchen, setKitchen] = useState(kitchen0 || "");
    const [tags, setTags] = useState(tags0 || []);
    const [cat, setCat] = useState("");
    const [q, setQ] = useState(q0 || "");
    const own = ctx.data.recipes || [];
    const taken = useMemo(() => new Set(own.map(r => r.title.toLowerCase())), [own]);
    const words = useMemo(() => HP.searchWords(q), [q]);
    const list = useMemo(() => HP.ideas().filter(r =>
      (!coll || r.coll.indexOf(coll) >= 0) && (!region || (r.kitchen && HP.kitchen(r.kitchen).region === region)) && (!kitchen || r.kitchen === kitchen) &&
      (!cat || r.cat === cat) && tags.every(t => HP.hasTag(r, t)) && (!words.length || HP.recipeMatch(r, words).score === words.length)), [coll, region, kitchen, cat, tags, words]);
    const groups = useMemo(() => {
      if (coll) return [{ k: null, items: list }];
      const by = {};
      list.forEach(r => { (by[r.kitchen || "ch"] || (by[r.kitchen || "ch"] = [])).push(r); });
      return HP.KITCHENS.filter(k => by[k.id]).map(k => ({ k, items: by[k.id].sort((a, b) => a.title.localeCompare(b.title, "de")) }));
    }, [list, coll]);
    const back = { t: "book", coll, region, kitchen, tags, q };
    const c = coll ? HP.collection(coll) : null;
    const toggleTag = t => setTags(tags.indexOf(t) >= 0 ? tags.filter(x => x !== t) : tags.concat(t));
    const kitchens = HP.KITCHENS.filter(k => k.region === region);
    const ownOf = r => own.find(x => same(x.title, r.title));
    return html`
      <${Sheet} title=${c ? c.label : region ? HP.region(region).label : "Rezeptbuch"} onClose=${onClose} closeLabel="Fertig">
        ${c && html`<p class="hint">${c.text}</p>`}
        <div class="search">
          <${Icon} n="search" s=${18} />
          <label class="sr" for="hp-book-q">Im Rezeptbuch suchen</label>
          <input id="hp-book-q" class="input" type="search" autocomplete="off" placeholder="z. B. Poulet, Kokosmilch" value=${q} onInput=${e => setQ(e.target.value)} />
        </div>
        <div class="chips scroll" role="group" aria-label="Sammlung">
          ${HP.COLLECTIONS.map(x => html`<button type="button" key=${x.id} class="chip mini" aria-pressed=${String(coll === x.id)} onClick=${() => setColl(coll === x.id ? "" : x.id)}><span class="emo" aria-hidden="true">${x.emoji}</span>${x.label}</button>`)}
        </div>
        <div class="chips scroll" role="group" aria-label="Weltgegend">
          ${HP.REGIONS.map(g => html`<button type="button" key=${g.id} class="chip mini" aria-pressed=${String(region === g.id)} onClick=${() => { setKitchen(""); setRegion(region === g.id ? "" : g.id); }}><span class="emo" aria-hidden="true">${g.emoji}</span>${g.label}</button>`)}
        </div>
        ${kitchens.length > 1 && html`<div class="chips scroll" role="group" aria-label="Küche">
          ${kitchens.map(k => html`<button type="button" key=${k.id} class="chip mini" aria-pressed=${String(kitchen === k.id)} onClick=${() => setKitchen(kitchen === k.id ? "" : k.id)}><span class="emo" aria-hidden="true">${k.emoji}</span>${k.label}</button>`)}
        </div>`}
        <div class="chips scroll" role="group" aria-label="Merkmale">
          ${BOOK_TAGS.map(([t, label]) => html`<button type="button" key=${t} class="chip mini" aria-pressed=${String(tags.indexOf(t) >= 0)} onClick=${() => toggleTag(t)}><span class="emo" aria-hidden="true">${HP.recipeTag(t).emoji}</span>${label}</button>`)}
          <select class="select mini" aria-label="Art des Gerichts" value=${cat} onChange=${e => setCat(e.target.value)}>
            <option value="">Alle Gänge</option>
            ${HP.RECIPE_CATS.filter(x => x.id !== "other").map(x => html`<option value=${x.id}>${x.emoji} ${x.label}</option>`)}
          </select>
        </div>
        <p class="hint" aria-live="polite">${list.length ? (list.length === 1 ? "1 Rezept" : list.length + " Rezepte") : "Kein Rezept passt zu dieser Auswahl."}</p>
        ${groups.map(g => html`
          <section class="stack" key=${g.k ? g.k.id : "all"}>
            ${g.k && html`<h2 class="aisle"><span class="emo" aria-hidden="true">${g.k.emoji}</span>${g.k.label}<span class="aisle-n">${g.items.length}</span></h2>`}
            <div class="list">${g.items.map(r => {
              const mine = taken.has(r.title.toLowerCase()) ? ownOf(r) : null;
              return html`<${RecipeRow} key=${r.id} ctx=${ctx} r=${mine || r} back=${back} sub=${(mine ? "✓ Bei euren Rezepten · " : "") + metaOf(r) + (c && r.kitchen ? " · " + HP.kitchen(r.kitchen).label : "")} />`;
            })}</div>
          </section>`)}
      <//>`;
  }

  /* ---------- notes: how was it, and what to do differently next time ---------- */
  const noteId = () => "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  /* Saves a note. A built-in idea is taken over first: the note belongs to the household's own copy. Returns the recipe id. */
  async function addNote(ctx, r, note) {
    let id = r.id;
    if (r.idea) { id = await adopt(ctx, r); if (!id) return null; }
    const body = Object.assign({ by: ctx.meId || null, at: Date.now(), d: HP.today() }, note);
    return (await ctx.act.patch("recipes", id, { notes: { [noteId()]: body }, up: Date.now() })) ? id : null;
  }
  function MoodPick({ value, onChange, id }) {
    return html`<div class="chips" role="radiogroup" aria-labelledby=${id}>${HP.MOODS.map(m => html`
      <button type="button" key=${m.id} role="radio" class="chip" aria-checked=${String(value === m.id)} onClick=${() => onChange(value === m.id ? "" : m.id)}><span class="emo" aria-hidden="true">${m.emoji}</span>${m.label}</button>`)}</div>`;
  }
  function NoteRow({ ctx, r, n }) {
    const [armed, setArmed] = useState(false);
    const [busy, run] = useBusy();
    useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 4000); return () => clearTimeout(t); }, [armed]);
    const m = n.by ? ctx.who(n.by) : null;
    const del = () => run(() => ctx.act.patch("recipes", r.id, { notes: { [n.id]: null }, up: Date.now() }));
    return html`
      <li class=${"rnote" + (n.tip ? " tip" : "")}>
        ${m ? html`<${Av} m=${m} s=${1} />` : html`<span class="emo" aria-hidden="true">📝</span>`}
        <div class="rnote-b">
          <p class="rnote-h">${n.mood && html`<span class="mood"><span class="emo" aria-hidden="true">${HP.mood(n.mood).emoji}</span>${HP.mood(n.mood).label}</span>`}${n.tip && html`<span class="mood tipb"><span class="emo" aria-hidden="true">💡</span>Nächstes Mal</span>`}</p>
          ${n.text && html`<p class="rnote-t">${n.text}</p>`}
          <p class="meta">${[m ? m.name : "", n.d ? HP.fmtDate(n.d, { day: "numeric", month: "short", year: "numeric" }) : ""].filter(Boolean).join(" · ")}</p>
        </div>
        ${!r.idea && html`<button type="button" class="icon-btn" disabled=${busy} aria-label=${armed ? "Wirklich löschen? Nochmal tippen" : "Notiz löschen"} onClick=${() => (armed ? del() : setArmed(true))}><${Icon} n=${armed ? "check" : "trash"} s=${18} /></button>`}
      </li>`;
  }
  function RecipeNotes({ ctx, r }) {
    const [open, setOpen] = useState(false);
    const [mood, setMood] = useState("");
    const [text, setText] = useState("");
    const [tip, setTip] = useState(false);
    const [err, setErr] = useState(null);
    const [busy, run] = useBusy();
    const notes = r.notes || [], sum = HP.noteSummary(r);
    const save = () => run(async () => {
      const t = text.trim().slice(0, 500);
      if (!t && !mood) { setErr("Wähl, wie es war, oder schreib ein paar Worte."); return; }
      const id = await addNote(ctx, r, { text: t, mood, tip: tip && !!t });
      if (!id) return;
      setOpen(false); setMood(""); setText(""); setTip(false); setErr(null);
      ctx.say(tip && t ? "Notiert. Beim nächsten Kochen steht es im Kochmodus." : "Notiert. Danke!");
      if (r.idea) ctx.open({ t: "recipe", id });
    });
    return html`
      <div class="field" id="hp-notes">
        <div class="rc-sub">
          <span class="label">Eure Notizen${notes.length ? " (" + notes.length + ")" : ""}</span>
          ${(sum.top || sum.ok || sum.flop) > 0 && html`<span class="hint" aria-label="Bewertungen">${HP.MOODS.filter(m => sum[m.id]).map(m => m.emoji + " " + sum[m.id]).join("  ")}</span>`}
        </div>
        ${notes.length > 0 && html`<ul class="rnotes">${notes.slice(0, 30).map(n => html`<${NoteRow} key=${n.id} ctx=${ctx} r=${r} n=${n} />`)}</ul>`}
        ${!open
          ? html`<div><button type="button" class="btn" onClick=${() => setOpen(true)}><span class="emo" aria-hidden="true">📝</span>${notes.length ? "Notiz schreiben" : "Wie war's? Notiz schreiben"}</button></div>`
          : html`
            <div class="note-form">
              <span class="label" id="hp-rn-mood">Wie war's?</span>
              <${MoodPick} id="hp-rn-mood" value=${mood} onChange=${v => { setErr(null); setMood(v); }} />
              <label class="label sub" for="hp-rn-text">Notiz</label>
              <textarea id="hp-rn-text" class="input area" rows="3" maxlength="500" placeholder="z. B. Doppelte Menge Sauce, 5 Minuten weniger im Ofen, mit Jasminreis noch besser" value=${text} onInput=${e => { setErr(null); setText(e.target.value); }}></textarea>
              <label class="check"><input type="checkbox" checked=${tip} onChange=${e => setTip(e.target.checked)} /><span>Das mache ich nächstes Mal anders (steht dann im Kochmodus)</span></label>
              ${err && html`<p class="err" role="alert">${err}</p>`}
              ${r.idea && html`<p class="hint">Mit der Notiz kommt die Kochidee zu euren Rezepten.</p>`}
              <div class="btn-row">
                <button type="button" class="btn primary" disabled=${busy} onClick=${save}>Notiz speichern</button>
                <button type="button" class="btn" disabled=${busy} onClick=${() => { setOpen(false); setErr(null); }}>Abbrechen</button>
              </div>
            </div>`}
      </div>`;
  }
  /* Recipes that go in the same direction: the same collection or kitchen, the same kind of dish, shared main ingredients. */
  function mainWords(r) {
    const out = new Set();
    r.title.toLowerCase().split(/[^a-zäöüéèàç]+/).forEach(w => { if (w.length >= 4) out.add(w.slice(0, 6)); });
    r.ingr.slice(0, 6).forEach(l => { if (!HP.isStaple(l)) { const w = HP.splitQty(l).name.toLowerCase().split(/[\s,(]+/).filter(x => x.length >= 4).pop(); if (w) out.add(w.slice(0, 6)); } });
    return out;
  }
  function similar(ctx, r, max) {
    const mine = mainWords(r);
    return poolOf(ctx.data.recipes || []).filter(x => x.id !== r.id && x.title !== r.title).map(x => {
      let sc = 0;
      (x.coll || []).forEach(c => { if ((r.coll || []).indexOf(c) >= 0) sc += 4; });
      if (x.kitchen && x.kitchen === r.kitchen) sc += 2;
      if (x.emoji === r.emoji) sc += 2;
      if (x.cat === r.cat) sc += 1;
      mainWords(x).forEach(w => { if (mine.has(w)) sc += 1.5; });
      return { x, sc };
    }).filter(o => o.sc >= 4).sort((a, b) => b.sc - a.sc || a.x.title.localeCompare(b.x.title, "de")).slice(0, max).map(o => o.x);
  }

  /* ---------- one recipe, to cook from ---------- */
  function RecipeView({ ctx, r, plan, fresh, onClose }) {
    const { act, say, who, open } = ctx;
    const [serves, setServes] = useState(r.serves);
    const [skip, setSkip] = useState(() => { const s = {}; r.ingr.forEach((l, i) => { if (HP.isStaple(l)) s[i] = true; }); return s; });
    const [busy, run] = useBusy();
    const factor = serves / r.serves, lines = r.ingr.map(l => HP.scaleLine(l, factor));
    const chosen = lines.filter((l, i) => !skip[i]);
    const planEv = plan ? (ctx.data.events || []).find(e => e.id === plan) : null;
    const cook = planEv ? planEv.who.map(who).filter(m => !m.gone)[0] : null;
    const take = () => run(async () => { const id = await adopt(ctx, r); if (id) open({ t: "recipe", id }); });
    const store = HP.storeOf(ctx.home.store);
    const cooked = () => run(async () => {
      if (await act.patch("recipes", r.id, { last: HP.today(), n: (r.n || 0) + 1, up: Date.now() })) say("En Guete! 😋 «" + r.title + "» ist als gekocht notiert.");
    });
    const fav = () => run(() => act.patch("recipes", r.id, { fav: !r.fav, up: Date.now() }));
    const sum = HP.noteSummary(r), alike = useMemo(() => similar(ctx, r, 4), [r, ctx.data.recipes]);
    const kit = r.kitchen ? HP.kitchen(r.kitchen) : null;
    return html`
      <${Sheet} title=${r.title} onClose=${onClose} closeLabel="Fertig"
        action=${r.idea
          ? html`<button type="button" class="btn primary small" disabled=${busy} onClick=${take}>Übernehmen</button>`
          : html`<button type="button" class="btn small" onClick=${() => open({ t: "recipe-edit", r })}><${Icon} n="pen" s=${16} />Bearbeiten</button>`}>
        <div class="rc-hero">
          <span class=${"rc-e rc-" + r.cat} aria-hidden="true">${HP.dishEmoji(r.emoji)}</span>
          <div class="stack">
            <span class="hint">${r.idea ? "Aus dem Rezeptbuch" : HP.recipeCat(r.cat).label}${kit ? " · " + kit.emoji + " " + kit.label : ""}${r.time ? " · " + timeOf(r) : ""}</span>
            ${sum.mood && html`<span class="hint">${HP.mood(sum.mood).emoji} Zuletzt: ${HP.mood(sum.mood).label}</span>`}
            ${r.tags.length > 0 && html`<div class="chips">${r.tags.map(t => html`<span key=${t} class="chip static mini"><span class="emo" aria-hidden="true">${HP.recipeTag(t).emoji}</span>${HP.recipeTag(t).label}</span>`)}</div>`}
          </div>
        </div>
        ${fresh && html`
          <div class="note fresh"><span class="emo" aria-hidden="true">✨</span><div class="stack">
            <p><strong>Gespeichert.</strong> Was jetzt? Zutaten auf die Einkaufsliste${store ? " für " + store.label : ""}, einplanen oder gleich loskochen.</p>
          </div></div>`}
        ${sum.tips.length > 0 && html`
          <div class="note tipnote"><span class="emo" aria-hidden="true">💡</span><div class="stack">
            <p><strong>Nächstes Mal anders</strong></p>
            <ul class="tips">${sum.tips.slice(0, 3).map(n => html`<li key=${n.id}>${n.text}${n.by ? html` <span class="muted">– ${who(n.by).name}</span>` : ""}</li>`)}</ul>
          </div></div>`}
        ${r.steps.length > 0 && html`<button type="button" class="btn primary block cook-go" onClick=${() => open({ t: "cook", id: r.id, serves })}><span class="emo" aria-hidden="true">👩‍🍳</span>Kochmodus starten</button>`}
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
            <div><button type="button" class="btn primary" disabled=${busy || !chosen.length} onClick=${() => run(() => toShopping(ctx, r, chosen))}><${Icon} n="cart" s=${18} />Auf die Einkaufsliste${store ? " für " + store.label : ""} (${chosen.length})</button></div>
          </div>`}
        ${r.steps.length > 0 && html`
          <div class="field">
            <span class="label">Zubereitung</span>
            <ol class="steps">${r.steps.map((st, i) => html`<li key=${i}><div class="step"><p>${st}</p></div></li>`)}</ol>
          </div>`}
        ${r.note.trim() && html`<div class="field"><span class="label">Notiz</span><p class="note-text">${r.note}</p></div>`}
        ${r.link && html`<div><a class="btn small" href=${r.link} target="_blank" rel="noopener noreferrer"><${Icon} n="ext" s=${16} />Zum Originalrezept</a></div>`}
        <${RecipeNotes} ctx=${ctx} r=${r} />
        ${alike.length > 0 && html`
          <div class="field">
            <span class="label">In dieselbe Richtung</span>
            <div class="list">${alike.map(x => html`<${RecipeRow} key=${x.id} ctx=${ctx} r=${x} />`)}</div>
          </div>`}
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
  function RecipeForm({ ctx, r, draft, source, how, onClose, onSaved }) {
    const { act, say, meId } = ctx;
    const isNew = !r, from = r || draft;
    const [d, setD] = useState(() => from
      ? { title: from.title, emoji: from.emoji, cat: from.cat, tags: from.tags.slice(), time: from.time ? String(from.time) : "", serves: from.serves, ingr: from.ingr.join("\n"), steps: from.steps.join("\n"), link: from.link, note: from.note, kitchen: from.kitchen || "" }
      : { title: "", emoji: "teller", cat: "main", tags: [], time: "", serves: 4, ingr: "", steps: "", link: "", note: "", kitchen: "" });
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
      const fields = { title: title.slice(0, 80), emoji: d.emoji, cat: d.cat, tags: d.tags, time: time || 0, serves: d.serves, ingr: lines(d.ingr, 60, 120), steps: lines(d.steps, 40, 600), link, note: d.note.slice(0, 2000), kitchen: HP.isKitchen(d.kitchen) ? d.kitchen : "", up: Date.now() };
      if (isNew) {
        const id = docId("r");
        if (await act.save("recipes", Object.assign({ id, fav: false, last: "", n: 0, by: meId || null, ts: Date.now() }, fields))) { say(draft ? "Rezept übernommen. Jetzt einkaufen oder gleich kochen." : "Rezept gespeichert."); onSaved(id, !!draft); }
      } else if (await act.patch("recipes", r.id, fields)) { say("Änderung gespeichert."); onSaved(r.id); }
    });
    const del = () => run(async () => { if (await act.remove("recipes", r.id)) { onClose(true); say("Rezept gelöscht."); } });
    return html`
      <${Sheet} title=${draft ? "Rezept prüfen" : isNew ? "Neues Rezept" : "Rezept bearbeiten"} onClose=${() => onClose(false)} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        ${draft && html`
          <div class="note"><${Icon} n="check" /><div class="stack">
            <p><strong>${how === "schema" ? "Rezept von der Seite übernommen." : how === "ocr" ? "Rezept aus dem Screenshot gelesen." : "Rezept aus dem Text erkannt."}</strong> ${how === "schema" ? "Kurz prüfen und speichern." : "Prüf Zutaten und Schritte kurz: Die Erkennung ist gut, aber nicht unfehlbar."}</p>
            ${!draft.ingr.length && html`<p>Zutaten wurden keine gefunden. Trag sie unten ein, je eine pro Zeile.</p>`}
          </div></div>`}
        ${source && html`<details class="raw"><summary>Erkannten Text anzeigen</summary><pre class="code">${source}</pre></details>`}
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
          <label for="hp-rc-kitchen">Küche (optional)</label>
          <select id="hp-rc-kitchen" class="select" value=${d.kitchen} onChange=${e => set({ kitchen: e.target.value })}>
            <option value="">–</option>
            ${HP.REGIONS.map(g => html`<optgroup key=${g.id} label=${g.label}>${HP.KITCHENS.filter(k => k.region === g.id).map(k => html`<option value=${k.id}>${k.label}</option>`)}</optgroup>`)}
          </select>
        </div>
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

  /* ---------- taking a recipe over: from a link, screenshots or text ---------- */
  const MODES_IMPORT = [["link", "Link", "🔗"], ["image", "Screenshot", "📷"], ["text", "Text", "📋"]];
  const IMPORT_FAIL = {
    nourl: "Darin steckt kein Link. Füg die ganze Adresse ein, sie beginnt mit https://.",
    fetch: "Die Seite liess sich nicht laden, auch nicht über die Lesedienste. Mach einen Screenshot vom Rezept oder kopier den Text, und übernimm es von dort.",
    norecipe: "Auf dieser Seite war kein Rezept zu erkennen. Mach einen Screenshot vom Rezept oder kopier den Text, und übernimm es von dort.",
    "ocr-load": "Die Texterkennung liess sich nicht laden. Prüf die Verbindung: Beim ersten Mal braucht sie Netz, danach nicht mehr.",
    ocr: "Der Text auf dem Bild liess sich nicht lesen. Versuch einen schärferen Screenshot, oder kopier den Text."
  };
  function ImportSheet({ ctx, mode: mode0, shared, onClose, onDraft }) {
    const Imp = window.HPImport;
    const sharedUrl = shared ? Imp.normUrl((shared.url || "") + " " + (shared.text || "") + " " + (shared.title || "")) : "";
    const [mode, setMode] = useState(shared ? (shared.files && shared.files.length ? "image" : sharedUrl ? "link" : "text") : mode0 || "link");
    const [link, setLink] = useState(sharedUrl);
    const [text, setText] = useState(shared && !sharedUrl ? [shared.title, shared.text].filter(Boolean).join("\n") : "");
    const [files, setFiles] = useState(shared && shared.files ? shared.files : []);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState("");
    const [prog, setProg] = useState(null);
    const [err, setErr] = useState(null);
    const fileRef = useRef(null), started = useRef(false);
    const urls = useMemo(() => files.map(f => { try { return URL.createObjectURL(f); } catch (e) { return ""; } }), [files]);
    useEffect(() => () => urls.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) { /* gone */ } }), [urls]);
    const fail = e => { setBusy(false); setStatus(""); setProg(null); setErr(IMPORT_FAIL[e && e.code] || IMPORT_FAIL.fetch); };
    const fromLink = () => {
      if (busy) return;
      if (!Imp.normUrl(link)) { setErr(IMPORT_FAIL.nourl); return; }
      setErr(null); setBusy(true);
      Imp.fromLink(link, setStatus).then(r => { setBusy(false); onDraft(r.draft, r.how, ""); }, fail);
    };
    const fromImages = list => {
      const fs = list || files;
      if (busy || !fs.length) { if (!fs.length && fileRef.current) fileRef.current.click(); return; }
      setErr(null); setBusy(true); setProg(0);
      Imp.readImages(fs, (p, t) => { setProg(p); setStatus(t); }).then(raw => {
        setBusy(false); setProg(null);
        if (raw.replace(/\s/g, "").length < 20) { setErr(IMPORT_FAIL.ocr); setText(raw); return; }
        onDraft(Imp.fromText(raw), "ocr", raw.trim());
      }, fail);
    };
    const fromText = () => {
      if (text.trim().length < 10) { setErr("Füg zuerst den Text des Rezepts ein."); return; }
      onDraft(Imp.fromText(text), "text", "");
    };
    const pick = e => {
      const list = Array.prototype.slice.call(e.target.files || []).filter(f => /^image\//.test(f.type)).slice(0, 8);
      e.target.value = "";
      if (list.length) { setFiles(list); setErr(null); fromImages(list); }
    };
    const paste = () => {
      try { navigator.clipboard.readText().then(t => { if (t) { if (mode === "link") setLink(t.trim()); else setText(t); setErr(null); } }, () => setErr("Der Browser gibt die Zwischenablage nicht frei. Füg den Inhalt von Hand ins Feld ein.")); }
      catch (e) { setErr("Der Browser gibt die Zwischenablage nicht frei. Füg den Inhalt von Hand ins Feld ein."); }
    };
    /* Shared from another app: start right away. */
    useEffect(() => {
      if (!shared || started.current) return;
      started.current = true;
      if (shared.files && shared.files.length) fromImages(shared.files);
      else if (sharedUrl) fromLink();
      else if (text.trim().length >= 10) fromText();
    }, []);
    const canPaste = !!(navigator.clipboard && navigator.clipboard.readText);
    return html`
      <${Sheet} title="Rezept übernehmen" onClose=${onClose} error=${err}>
        <div class="seg" role="tablist" aria-label="Woher kommt das Rezept?">${MODES_IMPORT.map(([id, label, e]) => html`
          <button type="button" key=${id} role="tab" aria-selected=${String(mode === id)} aria-pressed=${String(mode === id)} disabled=${busy} onClick=${() => { setMode(id); setErr(null); }}><span class="emo" aria-hidden="true">${e}</span> ${label}</button>`)}
        </div>
        ${mode === "link" && html`
          <div class="field">
            <label for="hp-imp-link">Link zum Rezept</label>
            <input id="hp-imp-link" class="input" type="url" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="https://fooby.ch/… oder https://migusto.migros.ch/…" value=${link} data-autofocus=""
              onInput=${e => { setLink(e.target.value); setErr(null); }} onKeyDown=${e => { if (e.key === "Enter") { e.preventDefault(); fromLink(); } }} />
            ${canPaste && html`<div><button type="button" class="btn small" disabled=${busy} onClick=${paste}><${Icon} n="copy" s=${16} />Aus der Zwischenablage</button></div>`}
            <p class="hint">Am besten klappt es mit Rezeptseiten wie Fooby (Coop), Migusto (Migros), Betty Bossi, Swissmilk oder Chefkoch. Bei Instagram oder TikTok geht es meist besser mit einem Screenshot. Die Adresse geht an einen öffentlichen Lesedienst, der die Seite für den Browser holt; sonst nichts.</p>
          </div>
          <div class="foot"><button type="button" class="btn primary block" disabled=${busy} onClick=${fromLink}><span class="emo" aria-hidden="true">✨</span>${busy ? "Wird geholt …" : "Rezept holen"}</button></div>`}
        ${mode === "image" && html`
          <div class="field">
            <span class="label">Screenshots</span>
            <input id="hp-imp-file" class="sr" type="file" accept="image/*" multiple ref=${fileRef} onChange=${pick} />
            <label class=${"btn" + (files.length ? "" : " primary")} for="hp-imp-file"><${Icon} n="upload" s=${18} />${files.length ? "Andere Bilder wählen" : "Bilder wählen"}</label>
            ${files.length > 0 && html`<div class="thumbs">${urls.map((u, k) => html`<img key=${k} src=${u} alt=${"Screenshot " + (k + 1)} />`)}</div>`}
            <p class="hint">Ein oder mehrere Screenshots, etwa die Zutaten und die Zubereitung auf zwei Bildern. Der Text wird direkt auf diesem Gerät gelesen; die Bilder verlassen es nicht und werden nicht gespeichert.</p>
          </div>
          ${files.length > 0 && !busy && html`<div class="foot"><button type="button" class="btn primary block" onClick=${() => fromImages()}><span class="emo" aria-hidden="true">✨</span>Text lesen und Rezept erstellen</button></div>`}`}
        ${mode === "text" && html`
          <div class="field">
            <label for="hp-imp-text">Text des Rezepts</label>
            <textarea id="hp-imp-text" class="input area tall" rows="10" maxlength="30000" placeholder=${"Spaghetti aglio e olio\n\nZutaten für 2 Personen\n200 g Spaghetti\n3 Knoblauchzehen\n…\n\nZubereitung\n…"} value=${text} onInput=${e => { setText(e.target.value); setErr(null); }}></textarea>
            ${canPaste && html`<div><button type="button" class="btn small" onClick=${paste}><${Icon} n="copy" s=${16} />Aus der Zwischenablage</button></div>`}
            <p class="hint">Zum Beispiel die Beschreibung eines Instagram-Beitrags oder ein Rezept aus einer Nachricht. Überschriften wie «Zutaten» und «Zubereitung» helfen, nötig sind sie nicht.</p>
          </div>
          <div class="foot"><button type="button" class="btn primary block" onClick=${fromText}><span class="emo" aria-hidden="true">✨</span>Rezept erstellen</button></div>`}
        ${busy && html`
          <div class="import-busy" role="status" aria-live="polite">
            <span class="spin" aria-hidden="true"></span><span>${status || "Einen Moment …"}</span>
            ${prog != null && html`<span class="bar-t"><i class="bar-f" style=${"display:block;width:" + Math.round(prog * 100) + "%"}></i></span>`}
          </div>`}
      <//>`;
  }

  Object.assign(U, { Recipes, RecipeView, RecipeForm, MealSheet, ImportSheet, BookSheet, MoodPick, addNote, adoptRecipe: adopt, findRecipe, dailyIdea, recipeMeta: metaOf });
})();
