/* Home-Planer: shared building blocks of the interface. The modules (kasse.js, einkauf.js, kalender.js, pflanzen.js,
   infos.js) and app.js take everything from window.HPUI. */
(function () {
  "use strict";
  var P = window.htmPreact, HP = window.HP, Store = window.HPStore;
  if (!P || !HP || !Store) return;                                    // app.js says so on the page
  const { html, useState, useEffect, useLayoutEffect, useMemo, useRef } = P;

  /* ---------- small helpers ---------- */
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage is optional */ } }
  };
  const newId = () => Store.randomId(10, "k");
  /* Entries sort by creation without a clock on the server: the time comes first. */
  const docId = prefix => (prefix || "x") + Date.now().toString(36) + Store.randomId(5);
  const clean = o => JSON.parse(JSON.stringify(o));
  const initials = name => {
    const w = String(name || "?").trim().split(/\s+/).filter(Boolean);
    if (!w.length) return "?";
    const s = w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2);
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const GHOST = id => ({ id, name: "Unbekannt", c: 7, o: 999, gone: true, a: "geist" });
  /* a: the avatar. Whoever has not chosen one gets one derived from the member's id, the same on every device;
     chosen tells the two apart. */
  function membersOf(home, all) {
    const m = home.members || {};
    return HP.memberIds(home, all).map(id => ({ id, name: m[id].name || "?", c: m[id].c || 0, o: m[id].o || 0, gone: !!m[id].gone, a: m[id].a || HP.avatarFor(id), chosen: !!m[id].a }));
  }
  const COLOR_NAMES = ["Blau", "Orange", "Türkis", "Gelb", "Rosa", "Grün", "Violett", "Rot"];
  function hashOf(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  /* Everybody an expense names: they cannot leave the household while it stands. */
  function refsOf(e) {
    const s = new Set();
    if (e.payer) s.add(e.payer);
    if (e.to) s.add(e.to);
    (e.for || []).forEach(id => s.add(id));
    Object.keys(e.weights || {}).forEach(id => s.add(id));
    (e.items || []).forEach(it => (it.for || []).forEach(id => s.add(id)));
    return s;
  }
  function fileName(name) {
    const slug = String(name || "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return "homeplaner-" + (slug || "haushalt") + "-" + HP.today() + ".json";
  }
  const FAIL = {
    storage: "Speichern auf diesem Gerät ist nicht möglich. Der Browser-Speicher ist voll oder gesperrt (privater Modus?).",
    "permission-denied": "Der Gruppen-Sync hat das Speichern abgelehnt. Prüf in Firebase die Sicherheitsregeln (siehe README).",
    "resource-exhausted": "Das Tageskontingent des Gruppen-Syncs ist aufgebraucht. Morgen geht es weiter.",
    "not-found": "Diesen Haushalt gibt es nicht mehr.",
    "doc-gone": "Diesen Eintrag hat inzwischen jemand gelöscht.",
    gone: "Diesen Haushalt gibt es auf diesem Gerät nicht mehr.",
    unconfigured: "Auf dieser Installation ist kein Gruppen-Sync eingerichtet.",
    "setup-db": "Im Firebase-Projekt gibt es noch keine Firestore-Datenbank. Die Schritte stehen im README, Abschnitt «Gruppen-Sync einrichten».",
    "invalid-argument": "Firebase lehnt die Angaben aus config.js ab. Prüf den Gruppen-Sync in den Einstellungen mit «Verbindung prüfen».",
    unauthenticated: "Firebase lehnt die Angaben aus config.js ab. Prüf den Gruppen-Sync in den Einstellungen mit «Verbindung prüfen».",
    "failed-precondition": "Firebase lehnt die Angaben aus config.js ab. Prüf den Gruppen-Sync in den Einstellungen mit «Verbindung prüfen».",
    aborted: "Das Freigeben wurde abgebrochen, weil sich der Haushalt dabei laufend geändert hat. Versuch es nochmal.",
    internal: "Beim Gruppen-Sync ist etwas durcheinandergeraten. Lade die Seite neu und versuch es nochmal.",
    unavailable: "Keine Verbindung zum Gruppen-Sync. Prüf dein Netz und versuch es nochmal.",
    timeout: "Das hat zu lange gedauert. Prüf dein Netz und versuch es nochmal."
  };
  /* Copies text; when the browser refuses, onFail gets the text so it can be shown for copying by hand. */
  function copyText(text, onDone, onFail) {
    try { navigator.clipboard.writeText(text).then(onDone, () => onFail(text)); } catch (e) { onFail(text); }
  }

  /* ---------- icons ---------- */
  const IC = {
    plus: ["M12 5v14M5 12h14"],
    back: ["M15 5l-7 7 7 7"],
    next: ["M9 5l7 7-7 7"],
    down: ["M6 9l6 6 6-6"],
    close: ["M6 6l12 12M18 6L6 18"],
    check: ["M5 12.5l4.5 4.5L19 7"],
    arrow: ["M5 12h14M13 6l6 6-6 6"],
    sliders: ["M4 7h9M17 7h3M4 17h3M11 17h9", "M13 7a2 2 0 1 0 4 0a2 2 0 1 0-4 0", "M7 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0"],
    copy: ["M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z", "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"],
    trash: ["M4 7h16M9 7V4.5h6V7M6.5 7l.8 12a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.9l.8-12M10 11v5M14 11v5"],
    swap: ["M4 8h14l-3-3M20 16H6l3 3"],
    user: ["M8.5 8a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0", "M5 20c.5-3.5 3.2-5.5 7-5.5s6.5 2 7 5.5"],
    other: ["M4.8 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0", "M10.8 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0", "M16.8 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0"],
    share: ["M12 15V4M8 7.5l4-4 4 4", "M7 11H5.5a1 1 0 0 0-1 1v7.5a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V12a1 1 0 0 0-1-1H17"],
    link: ["M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"],
    people: ["M5.5 8a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0-6.4 0", "M2.5 19.5c.4-3.2 2.7-5 6.2-5s5.8 1.8 6.2 5", "M15.5 5.1a3.2 3.2 0 0 1 0 5.8M17.5 14.8c2.2.6 3.6 2.1 4 4.7"],
    device: ["M8 3.5h8a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z", "M11 17.5h2"],
    offline: ["M7 18.5a4.5 4.5 0 0 1-.6-8.96 6 6 0 0 1 11.5 1.5A3.8 3.8 0 0 1 17.5 18.5H7z", "M4 4l16 16"],
    download: ["M12 4v11M8 11.5l4 4 4-4M5 19.5h14"],
    upload: ["M12 15.5V4.5M8 8l4-4 4 4M5 19.5h14"],
    refresh: ["M19.5 9A8 8 0 1 0 20 13.5", "M20 4.5V9h-4.5"],
    pen: ["M4 20l1-4.5L16.2 4.3a1.6 1.6 0 0 1 2.3 0l1.2 1.2a1.6 1.6 0 0 1 0 2.3L8.5 19 4 20z", "M14.5 6l3.5 3.5"],
    drop: ["M12 3.5c3.2 4 6 7.3 6 10.5a6 6 0 0 1-12 0c0-3.2 2.8-6.5 6-10.5z"],
    search: ["M10.5 4.5a6 6 0 1 0 0 12a6 6 0 1 0 0-12z", "M15 15l5 5"],
    ext: ["M14 4.5h5.5V10M19.5 4.5L11 13", "M18 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1H10"],
    phone: ["M5 4.5h3.5l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5C10 20.5 3.5 14 3.5 6A1.5 1.5 0 0 1 5 4.5z"],
    mail: ["M4 6.5h16v11H4z", "M4.5 7l7.5 6 7.5-6"],
    eye: ["M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z", "M9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0"],
    cart: ["M3.5 4.5h2.2l2.1 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8l1.4-6.7H7", "M9 19.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0", "M16 19.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0"]
  };
  function Icon({ n, s }) {
    const size = s || 20;
    return html`<svg class="ic" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(IC[n] || IC.other).map(d => html`<path d=${d} />`)}</svg>`;
  }
  /* s: 1 small, 2 large, 3 extra large. */
  function Av({ m, s }) {
    const av = HP.avatar(m.a), size = s === 1 ? " av-s" : s === 2 ? " av-l" : s === 3 ? " av-xl" : "";
    return html`<span class=${"av c" + ((m.c || 0) % 8 + 1) + size + (av ? " em" : "")} aria-hidden="true">${av ? av.ch : initials(m.name)}</span>`;
  }
  /* A meme card: a saying nearly everybody knows, in big white capitals above and below a picture. */
  function Meme({ m }) {
    return html`
      <figure class=${"meme t-" + m.tone}>
        <p class="meme-t">${m.top}</p>
        <span class="meme-e" aria-hidden="true">${m.emoji}</span>
        <p class="meme-t">${m.bottom}</p>
      </figure>`;
  }
  /* Confetti for a few seconds. Not for people who have asked their device for less motion. */
  function Confetti() {
    const [on, setOn] = useState(() => { try { return !window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } });
    const bits = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ l: Math.random() * 100, d: Math.random() * 0.9, r: Math.round(Math.random() * 360), c: i % 6 })), []);
    useEffect(() => { const t = setTimeout(() => setOn(false), 3800); return () => clearTimeout(t); }, []);
    if (!on) return null;
    return html`<div class="confetti" aria-hidden="true">${bits.map((b, i) => html`<i key=${i} class=${"cf" + b.c} style=${"left:" + b.l.toFixed(1) + "%;animation-delay:" + b.d.toFixed(2) + "s;--r:" + b.r + "deg"}></i>`)}</div>`;
  }

  const SLOW = "Das Speichern dauert länger als sonst. Prüf deine Verbindung.";
  function useSlow(busy) {
    const [slow, setSlow] = useState(false);
    useEffect(() => { if (!busy) { setSlow(false); return; } const t = setTimeout(() => setSlow(true), 7000); return () => clearTimeout(t); }, [busy]);
    return slow;
  }
  /* A form that saves once: a second tap while the first is still on its way does nothing. */
  function useBusy() {
    const [busy, setBusy] = useState(false);
    const lock = useRef(false);
    const run = async job => {
      if (lock.current) return false;
      lock.current = true; setBusy(true);
      try { return await job(); } finally { lock.current = false; setBusy(false); }
    };
    return [busy, run];
  }

  /* ---------- sheet shell ---------- */
  function Sheet({ title, onClose, action, closeLabel, error, children }) {
    const ref = useRef(null);
    useLayoutEffect(() => {
      const prev = document.activeElement;
      const el = ref.current && ref.current.querySelector("[data-autofocus]");
      if (el) el.focus();
      return () => { try { if (prev && prev.focus) prev.focus(); } catch (e) { /* element is gone */ } };
    }, []);
    useLayoutEffect(() => {                                           // at once, not a frame later: the key works as soon as the sheet is there
      const onKey = e => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);
    return html`
      <div class="scrim" onMouseDown=${e => { if (e.target === e.currentTarget) onClose(); }}>
        <div class="sheet" role="dialog" aria-modal="true" aria-label=${title} ref=${ref}>
          <div class="sheet-head">
            <button type="button" class="btn ghost small" onClick=${onClose}>${closeLabel || "Abbrechen"}</button>
            <h2>${title}</h2>
            <div>${action}</div>
          </div>
          ${error && html`<p class="sheet-err" role="alert">${error}</p>`}
          <div class="sheet-body">${children}</div>
        </div>
      </div>`;
  }
  function DeleteButton({ label, onConfirm, disabled }) {
    const [armed, setArmed] = useState(false);
    useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 4000); return () => clearTimeout(t); }, [armed]);
    return html`<button type="button" class="btn danger block" disabled=${disabled} onClick=${() => { if (armed) onConfirm(); else setArmed(true); }}>
      <${Icon} n="trash" s=${18} />${armed ? "Wirklich löschen? Nochmal tippen" : label}
    </button>`;
  }
  function CurSelect({ id, value, home, onChange, cls, label, disabled }) {
    const known = [];
    if (home) { known.push(home.base); Object.keys(home.rates || {}).sort().forEach(c => { if (known.indexOf(c) < 0) known.push(c); }); }
    if (value && known.indexOf(value) < 0) known.push(value);
    const rest = HP.CURRENCIES.filter(c => known.indexOf(c) < 0);
    return html`<select id=${id} class=${"select " + (cls || "")} aria-label=${label || "Währung"} value=${value} disabled=${!!disabled} onChange=${e => onChange(e.target.value)}>
      ${known.map(c => html`<option value=${c}>${c}</option>`)}
      ${known.length > 0 && html`<option disabled value="">──────</option>`}
      ${rest.map(c => html`<option value=${c}>${c}</option>`)}
    </select>`;
  }
  /* People as chips. With multi, several may be chosen (value is an array), otherwise one (value is an id or null);
     allowNone lets a single choice be taken back. */
  function PeoplePick({ id, label, people, value, onChange, meId, multi, allowNone }) {
    const on = m => (multi ? (value || []).indexOf(m.id) >= 0 : value === m.id);
    const tap = m => {
      if (multi) { const v = value || []; onChange(on(m) ? v.filter(x => x !== m.id) : v.concat(m.id)); }
      else onChange(on(m) && allowNone ? null : m.id);
    };
    return html`
      <div class="field">
        <span class="label" id=${id}>${label}</span>
        <div class="chips" role=${multi ? "group" : "radiogroup"} aria-labelledby=${id}>${people.map(m => multi
          ? html`<button type="button" key=${m.id} class="chip" aria-pressed=${String(on(m))} onClick=${() => tap(m)}><${Av} m=${m} s=${1} />${m.id === meId ? m.name + " (ich)" : m.name}</button>`
          : html`<button type="button" key=${m.id} role="radio" aria-checked=${String(on(m))} class="chip" onClick=${() => tap(m)}><${Av} m=${m} s=${1} />${m.id === meId ? m.name + " (ich)" : m.name}</button>`)}
        </div>
      </div>`;
  }
  /* Kinds of things as chips with an emoji, from a list of { id, label, emoji }. */
  function KindPick({ id, label, list, value, onChange }) {
    return html`
      <div class="field">
        <span class="label" id=${id}>${label}</span>
        <div class="chips" role="radiogroup" aria-labelledby=${id}>${list.map(c => html`
          <button type="button" key=${c.id} role="radio" aria-checked=${String(value === c.id)} class="chip" onClick=${() => onChange(c.id)}><span class="emo" aria-hidden="true">${c.emoji}</span>${c.label}</button>`)}
        </div>
      </div>`;
  }
  function Qr({ text }) {
    const rows = useMemo(() => { try { return window.FKQR.matrix(text); } catch (e) { return null; } }, [text]);
    if (!rows) return null;
    const n = rows.length, q = 4;
    let d = "";
    rows.forEach((row, y) => row.forEach((on, x) => { if (on) d += "M" + (x + q) + " " + (y + q) + "h1v1h-1z"; }));
    return html`<svg class="qr" viewBox=${"0 0 " + (n + 2 * q) + " " + (n + 2 * q)} role="img" aria-label="QR-Code mit dem Einladungslink" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff" /><path d=${d} fill="#000" /></svg>`;
  }
  /* An empty state: a picture, a heading, a sentence and maybe a button. */
  function Empty({ emoji, title, text, children }) {
    return html`
      <section class="empty">
        <span class="empty-e" aria-hidden="true">${emoji}</span>
        <h2>${title}</h2>
        ${text && html`<p>${text}</p>`}
        ${children}
      </section>`;
  }
  /* The heading of a module tab. */
  function TabHead({ emoji, title, children }) {
    return html`
      <header class="tab-head">
        <h1><span class="tab-head-e" aria-hidden="true">${emoji}</span>${title}</h1>
        ${children}
      </header>`;
  }

  window.HPUI = {
    html, P, ls, newId, docId, clean, initials, GHOST, membersOf, COLOR_NAMES, hashOf, refsOf, fileName, FAIL, copyText,
    IC, Icon, Av, Meme, Confetti, SLOW, useSlow, useBusy, Sheet, DeleteButton, CurSelect, PeoplePick, KindPick, Qr, Empty, TabHead
  };
})();
