/* Home-Planer: the household's file cabinet. Lease, insurances, contracts, contacts, wifi: each entry has fields that
   are copied with one tap, links to documents stored elsewhere (Google Drive, OneDrive, iCloud), a note and an optional
   deadline that shows up on the overview in time. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP;
  if (!U) return;
  const { html, docId, Icon, Sheet, DeleteButton, KindPick, Empty, useBusy, copyText } = U;
  const { useState, useMemo } = U.P;

  const SECRET = /pass|pin\b|code|kennwort|puk/i;
  const PHONE = /^\+?[\d\s/().-]{7,}$/;
  const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function telHref(v) { return "tel:" + v.replace(/[^\d+]/g, ""); }
  function dueText(info) {
    const n = HP.dueOf(info);
    if (n == null) return "";
    return (info.dueNote || "Datum") + ": " + HP.fmtDate(info.due, { day: "numeric", month: "long", year: "numeric" }) + " (" + HP.relDays(n) + ")";
  }
  /* The one line under an entry in the list. */
  function subOf(info) {
    const n = HP.dueOf(info);
    if (n != null && n >= 0 && n <= 60) return dueText(info);
    const f = info.fields.find(x => x.v.trim() && !SECRET.test(x.k));
    if (f) return (f.k ? f.k + ": " : "") + f.v.trim().split("\n")[0];
    if (info.note.trim()) return info.note.trim().split("\n")[0];
    return HP.infoCat(info.cat).label;
  }

  const STARTERS = [
    ["home", "Mietvertrag"], ["insurance", "Hausratversicherung"], ["insurance", "Haftpflichtversicherung"], ["wifi", "WLAN"], ["contacts", "Notfallnummern"], ["contracts", "Internet-Abo"]
  ];

  function Infos({ ctx }) {
    const { data, open } = ctx;
    const infos = data.infos;
    const [q, setQ] = useState("");
    const needle = q.trim().toLowerCase();
    const shown = useMemo(() => (infos || []).filter(i => !needle
      || (i.title + " " + i.note + " " + i.fields.map(f => f.k + " " + (SECRET.test(f.k) ? "" : f.v)).join(" ")).toLowerCase().indexOf(needle) >= 0), [infos, needle]);
    const groups = useMemo(() => HP.INFO_CATS.map(c => ({ c, items: shown.filter(i => i.cat === c.id).sort((a, b) => a.title.localeCompare(b.title, "de")) })).filter(g => g.items.length), [shown]);
    const deadlines = useMemo(() => (infos || []).map(i => ({ i, n: HP.dueOf(i) })).filter(x => x.n != null && x.n >= -7 && x.n <= 90).sort((a, b) => a.n - b.n), [infos]);
    const row = i => {
      const c = HP.infoCat(i.cat), n = HP.dueOf(i);
      return html`
        <button type="button" key=${i.id} class="x" onClick=${() => open({ t: "info", info: i })}>
          <span class=${"x-ic in-" + c.id} aria-hidden="true">${c.emoji}</span>
          <span class="x-main"><span class="x-t">${i.title}</span><span class=${"x-s" + (n != null && n >= 0 && n <= 30 ? " warn-t" : "")}>${subOf(i)}</span></span>
          <span class="go"><${Icon} n="next" s=${18} /></span>
        </button>`;
    };
    return html`
      <${U.TabHead} emoji="📁" title="Infos" />
      ${infos === null && html`<p class="status" role="status">Infos werden geladen …</p>`}
      ${infos && !infos.length && html`
        <${Empty} emoji="📁🔑📞" title="Noch keine Infos" text="Hier steht, was im Haushalt alle wissen sollten: Mietvertrag und Verwaltung, Versicherungen mit Policennummer, Abos mit Kündigungsfrist, das WLAN-Passwort für Gäste, Notfallnummern. Dokumente selbst verlinkst du, etwa aus Google Drive.">
          <div class="chips">${STARTERS.map(([cat, title]) => html`
            <button type="button" key=${title} class="chip" onClick=${() => open({ t: "info-edit", preset: { cat, title } })}><span class="emo" aria-hidden="true">${HP.infoCat(cat).emoji}</span>${title}</button>`)}
          </div>
        <//>`}
      ${infos && infos.length > 5 && html`
        <div class="search">
          <${Icon} n="search" s=${18} />
          <label class="sr" for="hp-in-q">Infos durchsuchen</label>
          <input id="hp-in-q" class="input" type="search" autocomplete="off" placeholder="Suchen, z. B. Police, Verwaltung" value=${q} onInput=${e => setQ(e.target.value)} />
        </div>`}
      ${!needle && deadlines.length > 0 && html`
        <section class="panel">
          <div class="panel-head"><h2 class="sec-h">Fristen in den nächsten 90 Tagen</h2></div>
          <div class="list flat">${deadlines.map(({ i, n }) => html`
            <button type="button" key=${i.id} class="x" onClick=${() => open({ t: "info", info: i })}>
              <span class=${"x-ic " + (n <= 14 ? "k-late" : "in-" + i.cat)} aria-hidden="true">⏰</span>
              <span class="x-main"><span class="x-t">${i.title}</span><span class="x-s">${(i.dueNote || "Datum") + " " + HP.fmtDate(i.due, { day: "numeric", month: "short", year: "numeric" })}</span></span>
              <span class=${"x-a" + (n <= 14 ? " neg" : "")}><span>${HP.relDays(n)}</span></span>
            </button>`)}
          </div>
        </section>`}
      ${needle && !shown.length && html`<section class="panel"><p>Nichts gefunden für «${q.trim()}».</p></section>`}
      ${groups.map(g => html`
        <section class="stack" key=${g.c.id}>
          <h2 class="aisle"><span class="emo" aria-hidden="true">${g.c.emoji}</span>${g.c.label}<span class="aisle-n">${g.items.length}</span></h2>
          <div class="list">${g.items.map(row)}</div>
        </section>`)}
      ${infos && infos.length > 0 && html`<p class="hint center">Wer den Einladungslink hat, sieht alle Infos. Speichere hier keine PINs oder Passwörter fürs E-Banking.</p>`}`;
  }

  /* ---------- one entry, to read ---------- */
  function Field({ f, say }) {
    const [show, setShow] = useState(false);
    const v = f.v.trim(), secret = SECRET.test(f.k) && v;
    const [box, setBox] = useState(null);
    const copy = () => copyText(v, () => say((f.k || "Text") + " kopiert."), setBox);
    let value = v;
    if (secret && !show) value = "•".repeat(Math.min(12, Math.max(6, v.length)));
    else if (HP.okUrl(v)) value = html`<a href=${v} target="_blank" rel="noopener noreferrer">${v}</a>`;
    else if (MAIL.test(v)) value = html`<a href=${"mailto:" + v}>${v}</a>`;
    else if (PHONE.test(v) && v.replace(/\D/g, "").length >= 7) value = html`<a href=${telHref(v)}>${v}</a>`;
    return html`
      <div class="kv">
        <span class="kv-k">${f.k || "Notiz"}</span>
        <span class=${"kv-v" + (secret && !show ? " m" : "")}>${value || html`<span class="muted">–</span>`}</span>
        <span class="kv-a">
          ${secret && html`<button type="button" class="icon-btn" aria-label=${show ? f.k + " verbergen" : f.k + " zeigen"} aria-pressed=${String(show)} onClick=${() => setShow(!show)}><${Icon} n="eye" s=${18} /></button>`}
          ${v && html`<button type="button" class="icon-btn" aria-label=${(f.k || "Wert") + " kopieren"} onClick=${copy}><${Icon} n="copy" s=${18} /></button>`}
        </span>
        ${box && html`<input class="input kv-box" readonly aria-label=${"Zum Kopieren: " + f.k} value=${box} onFocus=${e => e.target.select()} />`}
      </div>`;
  }
  function InfoView({ ctx, info, onClose }) {
    const { open, say, who } = ctx;
    const c = HP.infoCat(info.cat), due = dueText(info), n = HP.dueOf(info);
    const filled = info.fields.filter(f => f.v.trim()), blank = info.fields.filter(f => !f.v.trim() && f.k);
    return html`
      <${Sheet} title=${info.title} onClose=${onClose} closeLabel="Fertig" action=${html`<button type="button" class="btn small" onClick=${() => open({ t: "info-edit", info })}><${Icon} n="pen" s=${16} />Bearbeiten</button>`}>
        <div class="info-hero"><span class=${"x-ic in-" + c.id} aria-hidden="true">${c.emoji}</span><span class="hint">${c.label}</span></div>
        ${due && html`<p class=${"due-box" + (n != null && n <= 30 ? " soon" : "")}><strong>⏰ ${due}</strong></p>`}
        ${(filled.length > 0 || blank.length > 0) && html`
          <div class="kvs">
            ${filled.map((f, i) => html`<${Field} key=${i} f=${f} say=${say} />`)}
            ${blank.length > 0 && html`<p class="kv-empty">Noch leer: ${blank.map(f => f.k).join(", ")}</p>`}
          </div>`}
        ${info.links.length > 0 && html`
          <div class="field">
            <span class="label">Dokumente und Links</span>
            <div class="btn-row">${info.links.map((l, i) => html`
              <a key=${i} class="btn small" href=${l.u} target="_blank" rel="noopener noreferrer"><${Icon} n="ext" s=${16} />${l.t || l.u.replace(/^https?:\/\/(www\.)?/, "").slice(0, 32)}</a>`)}
            </div>
          </div>`}
        ${info.note.trim() && html`
          <div class="field">
            <span class="label">Notiz</span>
            <p class="note-text">${info.note}</p>
          </div>`}
        ${!filled.length && !info.links.length && !info.note.trim() && html`<p class="hint">Noch leer. Tippe oben auf «Bearbeiten» und trag die Angaben ein.</p>`}
        ${info.by && html`<p class="meta">Angelegt von ${who(info.by).name}${info.up ? ", zuletzt geändert am " + HP.fmtDate(new Date(info.up).toISOString().slice(0, 10), { day: "numeric", month: "long", year: "numeric" }) : ""}</p>`}
      <//>`;
  }

  /* ---------- one entry, to edit ---------- */
  const fieldsFor = cat => HP.infoCat(cat).fields.map(k => ({ k, v: "", n: U.newId() }));
  function InfoForm({ ctx, info, preset, onClose, onSaved }) {
    const { act, say, meId } = ctx;
    const isNew = !info;
    const [d, setD] = useState(() => {
      if (info) return { cat: info.cat, title: info.title, fields: info.fields.map(f => ({ k: f.k, v: f.v, n: U.newId() })), links: info.links.map(l => ({ t: l.t, u: l.u, n: U.newId() })), note: info.note, due: info.due, dueNote: info.dueNote };
      const cat = preset && preset.cat ? preset.cat : "other";
      return { cat, title: (preset && preset.title) || "", fields: fieldsFor(cat), links: [], note: "", due: "", dueNote: /insurance|contracts|home/.test(cat) ? "Kündigungsfrist" : "" };
    });
    const [err, setErr] = useState(null);
    const [busy, run] = useBusy();
    const set = p => { setErr(null); setD(prev => Object.assign({}, prev, typeof p === "function" ? p(prev) : p)); };
    /* A new entry takes the fields of its kind, as long as nothing has been typed into them. */
    const pickCat = cat => set(prev => (isNew && prev.fields.every(f => !f.v.trim())
      ? { cat, fields: fieldsFor(cat), dueNote: prev.dueNote || (/insurance|contracts|home/.test(cat) ? "Kündigungsfrist" : "") } : { cat }));
    const setF = (n, p) => set(prev => ({ fields: prev.fields.map(f => (f.n === n ? Object.assign({}, f, p) : f)) }));
    const setL = (n, p) => set(prev => ({ links: prev.links.map(l => (l.n === n ? Object.assign({}, l, p) : l)) }));
    const save = () => run(async () => {
      const title = d.title.trim();
      if (!title) { setErr("Gib dem Eintrag einen Titel."); return; }
      const links = d.links.filter(l => l.u.trim() || l.t.trim());
      const bad = links.find(l => !HP.okUrl(l.u.trim()));
      if (bad) { setErr("Der Link «" + (bad.t || bad.u) + "» ist keine vollständige Adresse. Sie beginnt mit https:// oder http://."); return; }
      if (d.due && !HP.validDate(d.due)) { setErr("Wähle ein gültiges Datum."); return; }
      const body = {
        id: info ? info.id : docId("i"), cat: d.cat, title: title.slice(0, 80),
        fields: d.fields.map(f => ({ k: f.k.trim().slice(0, 40), v: f.v.slice(0, 500) })).filter(f => f.k || f.v.trim()),
        links: links.map(l => ({ t: l.t.trim().slice(0, 60), u: l.u.trim() })), note: d.note.slice(0, 4000),
        due: d.due || "", dueNote: d.due ? d.dueNote.trim().slice(0, 60) : "", by: info ? info.by : meId || null, ts: info ? info.ts : Date.now(), up: Date.now()
      };
      if (await act.save("infos", body)) { say(isNew ? "Eintrag gespeichert." : "Änderung gespeichert."); onSaved(body); }
    });
    const del = () => run(async () => { if (await act.remove("infos", info.id)) { onClose(true); say("Eintrag gelöscht."); } });
    return html`
      <${Sheet} title=${isNew ? "Neuer Eintrag" : "Eintrag bearbeiten"} onClose=${() => onClose(false)} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        <${KindPick} id="hp-in-cat" label="Art" list=${HP.INFO_CATS} value=${d.cat} onChange=${pickCat} />
        <div class="field">
          <label for="hp-in-title">Titel</label>
          <input id="hp-in-title" class="input" maxlength="80" autocomplete="off" placeholder="z. B. Hausratversicherung" value=${d.title} onInput=${e => set({ title: e.target.value })} data-autofocus=${isNew ? "" : null} />
        </div>
        <div class="field">
          <span class="label">Angaben</span>
          <div class="kv-edit">${d.fields.map((f, i) => html`
            <div class="kv-row" key=${f.n}>
              <input class="input k" maxlength="40" autocomplete="off" placeholder="Bezeichnung" aria-label=${"Bezeichnung " + (i + 1)} value=${f.k} onInput=${e => setF(f.n, { k: e.target.value })} />
              <input class="input v" maxlength="500" autocomplete="off" placeholder="Wert" aria-label=${(f.k || "Angabe " + (i + 1)) + ": Wert"} value=${f.v} onInput=${e => setF(f.n, { v: e.target.value })} />
              <button type="button" class="icon-btn" aria-label=${"Angabe " + (f.k || i + 1) + " entfernen"} onClick=${() => set(prev => ({ fields: prev.fields.filter(x => x.n !== f.n) }))}><${Icon} n="close" s=${18} /></button>
            </div>`)}
          </div>
          <div><button type="button" class="btn small" onClick=${() => set(prev => ({ fields: prev.fields.concat({ k: "", v: "", n: U.newId() }) }))}><${Icon} n="plus" s=${16} />Angabe</button></div>
          <p class="hint">Leere Angaben werden nicht gespeichert. Telefonnummern, E-Mail-Adressen und Links lassen sich später direkt antippen.</p>
        </div>
        <div class="field">
          <span class="label">Frist oder Termin</span>
          <div class="two">
            <input class="input" type="date" aria-label="Datum" value=${d.due} onInput=${e => set({ due: e.target.value })} />
            <input class="input" maxlength="60" aria-label="Wofür ist das Datum?" placeholder="z. B. Kündigungsfrist" value=${d.dueNote} onInput=${e => set({ dueNote: e.target.value })} />
          </div>
          <p class="hint">Ein Datum erscheint 60 Tage vorher in der Übersicht, etwa der letzte Tag, um ein Abo zu kündigen.</p>
        </div>
        <div class="field">
          <span class="label">Dokumente und Links</span>
          <div class="kv-edit">${d.links.map((l, i) => html`
            <div class="kv-row" key=${l.n}>
              <input class="input k" maxlength="60" autocomplete="off" placeholder="Name" aria-label=${"Name des Links " + (i + 1)} value=${l.t} onInput=${e => setL(l.n, { t: e.target.value })} />
              <input class="input v" type="url" inputmode="url" maxlength="500" autocomplete="off" placeholder="https://…" aria-label=${"Adresse des Links " + (i + 1)} value=${l.u} onInput=${e => setL(l.n, { u: e.target.value })} />
              <button type="button" class="icon-btn" aria-label=${"Link " + (i + 1) + " entfernen"} onClick=${() => set(prev => ({ links: prev.links.filter(x => x.n !== l.n) }))}><${Icon} n="close" s=${18} /></button>
            </div>`)}
          </div>
          <div><button type="button" class="btn small" onClick=${() => set(prev => ({ links: prev.links.concat({ t: "", u: "", n: U.newId() }) }))}><${Icon} n="link" s=${16} />Link</button></div>
          <p class="hint">Der Home-Planer speichert keine Dateien. Leg den Vertrag als PDF etwa in Google Drive, OneDrive oder iCloud ab, gib ihn dort frei und füg hier den Link ein.</p>
        </div>
        <div class="field">
          <label for="hp-in-note">Notiz</label>
          <textarea id="hp-in-note" class="input area" maxlength="4000" rows="5" placeholder="Alles Weitere, z. B. was bei einem Schaden zu tun ist" value=${d.note} onInput=${e => set({ note: e.target.value })}></textarea>
        </div>
        <div class="foot">
          <button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Speichern</button>
          ${!isNew && html`<${DeleteButton} label="Eintrag löschen" onConfirm=${del} disabled=${busy} />`}
        </div>
      <//>`;
  }

  Object.assign(U, { Infos, InfoView, InfoForm, infoDueText: dueText });
})();
