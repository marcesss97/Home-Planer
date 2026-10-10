/* Home-Planer: cooking mode. Full screen, one step at a time in large type: first the ingredients to set out, then each
   step with the ingredients it needs and a timer for every time it names ("10 Minuten köcheln"). The screen stays on,
   steps can be read aloud, and a swipe or the arrow keys move on. Timers keep running across steps and ring when done. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP;
  if (!U) return;
  const { html, ls, Icon } = U;
  const { useState, useEffect, useRef, useMemo, useCallback } = U.P;

  const mmss = s => { s = Math.max(0, Math.ceil(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0"); };

  /* A short, friendly alarm: three beeps, made on the spot (no sound file), and a buzz where the device can. */
  function useAlarm() {
    const ac = useRef(null);
    const prime = () => {                                             // the browser lets sound play only after a tap
      try { if (!ac.current) ac.current = new (window.AudioContext || window.webkitAudioContext)(); if (ac.current.state === "suspended") ac.current.resume(); } catch (e) { /* no sound */ }
    };
    const ring = () => {
      try { if (navigator.vibrate) navigator.vibrate([400, 150, 400, 150, 600]); } catch (e) { /* no buzz */ }
      const c = ac.current;
      if (!c) return;
      try {
        [0, 0.35, 0.7].forEach(t => {
          const o = c.createOscillator(), g = c.createGain();
          o.type = "sine"; o.frequency.value = 880;
          g.gain.setValueAtTime(0.0001, c.currentTime + t);
          g.gain.exponentialRampToValueAtTime(0.35, c.currentTime + t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t + 0.28);
          o.connect(g); g.connect(c.destination);
          o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.3);
        });
      } catch (e) { /* no sound */ }
    };
    useEffect(() => () => { try { if (ac.current) ac.current.close(); } catch (e) { /* closed */ } }, []);
    return { prime, ring };
  }
  /* Keeps the screen on while cooking, where the browser allows it. Returns whether it worked. */
  function useWakeLock() {
    const [on, setOn] = useState(false);
    useEffect(() => {
      let lock = null, alive = true;
      const req = () => {
        try {
          if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return;
          navigator.wakeLock.request("screen").then(l => {
            if (!alive) { l.release().catch(() => {}); return; }
            lock = l; setOn(true);
            l.addEventListener("release", () => { if (alive) setOn(false); });
          }, () => setOn(false));
        } catch (e) { setOn(false); }
      };
      const vis = () => { if (document.visibilityState === "visible") req(); };
      req();
      document.addEventListener("visibilitychange", vis);
      return () => { alive = false; document.removeEventListener("visibilitychange", vis); try { if (lock) lock.release().catch(() => {}); } catch (e) { /* gone */ } };
    }, []);
    return on;
  }
  function speak(text) {
    try {
      const s = window.speechSynthesis;
      if (!s) return false;
      s.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "de-CH";
      const v = (s.getVoices() || []).find(x => /^de(-|_)CH/i.test(x.lang)) || (s.getVoices() || []).find(x => /^de/i.test(x.lang));
      if (v) u.voice = v;
      u.rate = 0.95;
      s.speak(u);
      return true;
    } catch (e) { return false; }
  }
  const canSpeak = (() => { try { return !!window.speechSynthesis && typeof SpeechSynthesisUtterance === "function"; } catch (e) { return false; } })();

  function CookMode({ ctx, r, serves: serves0, onClose }) {
    const n = r.steps.length;
    const [i, setI] = useState(0);                                    // 0: set out, 1..n: steps, n+1: done
    const [serves, setServes] = useState(serves0 || r.serves);
    const [have, setHave] = useState({});
    const [timers, setTimers] = useState([]);
    const [now, setNow] = useState(Date.now());
    const [big, setBig] = useState(() => !!ls.get("hp.cook.big", false));
    const [aloud, setAloud] = useState(false);
    const [armed, setArmed] = useState(false);
    const [busy, setBusy] = useState(false);
    const alarm = useAlarm(), awake = useWakeLock();
    const touch = useRef(null), ref = useRef(null);
    const factor = serves / r.serves, lines = useMemo(() => r.ingr.map(l => HP.scaleLine(l, factor)), [r.ingr, factor]);
    const step = i >= 1 && i <= n ? r.steps[i - 1] : "";
    const durs = useMemo(() => HP.durations(step), [step]);
    const uses = useMemo(() => HP.stepIngredients(step, r.ingr), [step, r.ingr]);
    const running = timers;

    /* Timers: tick while one runs, ring once when it is up, and again every 20 seconds until somebody taps OK.
       The tick reads the timers through a ref and only marks those still there, so a timer stopped a moment ago stays stopped. */
    const timersRef = useRef(timers);
    timersRef.current = timers;
    useEffect(() => {
      if (!running.length) return;
      const id = setInterval(() => {
        const t = Date.now();
        setNow(t);
        const due = timersRef.current.filter(x => t >= x.end && (!x.rungAt || t - x.rungAt > 20000)).map(x => x.id);
        if (due.length) {
          alarm.ring();
          setTimers(ts => ts.map(x => (due.indexOf(x.id) >= 0 ? Object.assign({}, x, { rungAt: t }) : x)));
        }
      }, 250);
      return () => clearInterval(id);
    }, [running.length]);
    const startTimer = d => {
      alarm.prime();
      setTimers(ts => ts.concat({ id: Date.now() + Math.random(), label: "Schritt " + i + " · " + d.label, end: Date.now() + d.secs * 1000, secs: d.secs, rungAt: 0 }));
      setNow(Date.now());
    };
    const stopTimer = id => setTimers(ts => ts.filter(t => t.id !== id));

    const go = useCallback(k => {
      setI(x => Math.max(0, Math.min(n + 1, x + k)));
      try { if (ref.current) ref.current.scrollTop = 0; } catch (e) { /* nothing to scroll */ }
    }, [n]);
    useEffect(() => { if (aloud && step) speak((i ? "Schritt " + i + ". " : "") + step); }, [i, aloud]);
    useEffect(() => () => { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* nothing */ } }, []);
    const close = () => {
      if (running.length && !armed) { setArmed(true); setTimeout(() => setArmed(false), 4000); return; }
      onClose();
    };
    useEffect(() => {
      const onKey = e => {
        if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
        if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(1); }
        else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
        else if (e.key === "Escape") { e.preventDefault(); close(); }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    });
    const onTouchStart = e => { const t = e.touches && e.touches[0]; touch.current = t ? { x: t.clientX, y: t.clientY } : null; };
    const onTouchEnd = e => {
      const s = touch.current, t = e.changedTouches && e.changedTouches[0];
      touch.current = null;
      if (!s || !t) return;
      const dx = t.clientX - s.x, dy = t.clientY - s.y;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    };
    const toggleBig = () => { ls.set("hp.cook.big", !big); setBig(!big); };
    const cooked = async () => {
      setBusy(true);
      const ok = await ctx.act.patch("recipes", r.id, { last: HP.today(), n: (r.n || 0) + 1, up: Date.now() });
      setBusy(false);
      if (ok) { ctx.say("En Guete! 😋 «" + r.title + "» ist als gekocht notiert."); onClose(); }
    };
    const pct = n ? Math.round(Math.min(i, n + 1) / (n + 1) * 100) : 100;
    const label = i === 0 ? "Bereitstellen" : i <= n ? "Schritt " + i + " von " + n : "Fertig";

    return html`
      <div class=${"cook" + (big ? " big" : "")} role="dialog" aria-modal="true" aria-label=${"Kochmodus: " + r.title}>
        <header class="cook-head">
          <button type="button" class="icon-btn" aria-label=${armed ? "Timer laufen noch. Nochmals tippen zum Beenden" : "Kochmodus beenden"} onClick=${close}><${Icon} n="close" s=${24} /></button>
          <div class="cook-title"><strong>${r.title}</strong><span aria-live="polite">${label}</span></div>
          ${canSpeak && html`<button type="button" class="icon-btn" aria-pressed=${String(aloud)} aria-label=${aloud ? "Vorlesen aus" : "Schritte vorlesen"} title="Vorlesen" onClick=${() => { const v = !aloud; setAloud(v); if (v && step) speak("Schritt " + i + ". " + step); else if (!v) { try { window.speechSynthesis.cancel(); } catch (e) { /* nothing */ } } }}><span class="emo" aria-hidden="true">${aloud ? "🔊" : "🔈"}</span></button>`}
          <button type="button" class="icon-btn" aria-pressed=${String(big)} aria-label="Grössere Schrift" title="Grössere Schrift" onClick=${toggleBig}><span class="cook-aa" aria-hidden="true">A<small>A</small></span></button>
        </header>
        ${armed && html`<p class="cook-warn" role="alert">Timer laufen noch. Nochmals auf ✕ tippen, um den Kochmodus zu beenden.</p>`}
        <div class="cook-bar" aria-hidden="true"><i style=${"width:" + pct + "%"}></i></div>
        <main class="cook-body" ref=${ref} onTouchStart=${onTouchStart} onTouchEnd=${onTouchEnd}>
          ${i === 0 && html`
            <section class="cook-card">
              <h2 class="cook-h">Zuerst bereitstellen</h2>
              <div class="rc-sub">
                <span class="hint">${awake ? "Der Bildschirm bleibt an, solange der Kochmodus offen ist." : "Tipp: Stell die automatische Bildschirmsperre fürs Kochen ab."}</span>
                <span class="stepper" role="group" aria-label="Portionen">
                  <button type="button" aria-label="Eine Portion weniger" disabled=${serves <= 1} onClick=${() => setServes(serves - 1)}>−</button>
                  <output aria-live="polite">${serves === 1 ? "1 Portion" : serves + " Portionen"}</output>
                  <button type="button" aria-label="Eine Portion mehr" disabled=${serves >= 50} onClick=${() => setServes(serves + 1)}>+</button>
                </span>
              </div>
              ${lines.length
                ? html`<div class="rows">${lines.map((l, k) => html`
                    <label class=${"row cook-ing" + (have[k] ? " done" : "")} key=${k}>
                      <input type="checkbox" checked=${!!have[k]} onChange=${e => setHave(Object.assign({}, have, { [k]: e.target.checked }))} />
                      <span class="grow">${l}</span>
                    </label>`)}</div>`
                : html`<p class="hint">Für dieses Rezept sind keine Zutaten erfasst.</p>`}
              <p class="hint">Hak ab, was bereitsteht. Weiter geht es mit dem Knopf unten, mit einem Wisch nach links oder mit der Pfeiltaste.</p>
            </section>`}
          ${i >= 1 && i <= n && html`
            <section class="cook-card step-card">
              <span class="cook-num" aria-hidden="true">${i}</span>
              <p class="cook-step">${step}</p>
              ${durs.length > 0 && html`
                <div class="btn-row">${durs.map(d => html`<button type="button" key=${d.secs} class="btn timer-btn" onClick=${() => startTimer(d)}><span class="emo" aria-hidden="true">⏱️</span>Timer ${d.label}</button>`)}</div>`}
              ${uses.length > 0 && html`
                <div class="cook-uses">
                  <span class="label">Dafür brauchst du</span>
                  <div class="chips">${uses.map(k => html`<span key=${k} class="chip static mini">${lines[k]}</span>`)}</div>
                </div>`}
            </section>`}
          ${i === n + 1 && html`
            <section class="cook-card cook-done">
              <span class="cook-party" aria-hidden="true">🎉</span>
              <h2 class="cook-h">Fertig! En Guete</h2>
              <p class="hint">${r.idea ? "Hat es geschmeckt? Übernimm das Rezept, dann gehört es zu euren Rezepten." : "Merk dir, dass ihr das heute gekocht habt: Dann schlägt es der Würfel ein paar Tage nicht vor."}</p>
              <div class="btn-row center">
                ${!r.idea && html`<button type="button" class="btn primary" disabled=${busy || r.last === HP.today()} onClick=${cooked}><span class="emo" aria-hidden="true">😋</span>${r.last === HP.today() ? "Heute gekocht" : "Als gekocht merken"}</button>`}
                <button type="button" class="btn" onClick=${onClose}>Schliessen</button>
              </div>
            </section>`}
        </main>
        ${timers.length > 0 && html`
          <div class="cook-timers" role="status" aria-live="polite">${timers.map(t => {
            const left = (t.end - now) / 1000, up = left <= 0;
            return html`
              <div class=${"ctimer" + (up ? " up" : "")} key=${t.id}>
                <span class="emo" aria-hidden="true">${up ? "⏰" : "⏱️"}</span>
                <span class="ctimer-l">${t.label}</span>
                <b class="ctimer-t">${up ? "Zeit ist um!" : mmss(left)}</b>
                <button type="button" class=${"btn small" + (up ? " primary" : "")} onClick=${() => stopTimer(t.id)}>${up ? "OK" : "Stopp"}</button>
              </div>`;
          })}</div>`}
        <footer class="cook-nav">
          <button type="button" class="btn" disabled=${i === 0} onClick=${() => go(-1)}><${Icon} n="back" s=${20} />Zurück</button>
          ${i <= n && html`<button type="button" class="btn primary" onClick=${() => go(1)}>${i === 0 ? "Los geht's" : i === n ? "Fertig" : "Weiter"}<${Icon} n="next" s=${20} /></button>`}
        </footer>
      </div>`;
  }

  Object.assign(U, { CookMode });
})();
