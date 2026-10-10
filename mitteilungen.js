/* Home-Planer: Mitteilungen einrichten. Pro Gerät: einschalten, wählen, was kommt, Ruhezeit, eine Probe, und eine Vorschau
   auf die nächsten Erinnerungen. Dazu ein Hinweis auf der Startseite, solange Mitteilungen hier noch aus sind. */
(function () {
  "use strict";
  var U = window.HPUI, HP = window.HP, R = window.HPRemind, Push = window.HPPush;
  if (!U || !Push) return;
  const { html, Icon, Av, Sheet } = U;
  const { useState, useMemo, useEffect } = U.P;
  const README = "https://github.com/marcesss97/Home-Planer#4-dienst-f%C3%BCr-kalender-und-mitteilungen";
  const FAIL = {
    "push-denied": "Mitteilungen sind gesperrt. Erlauben kannst du sie in den Einstellungen des Browsers, auf dem iPhone unter Einstellungen › Mitteilungen › Home-Planer.",
    "push-dismissed": "Ohne Erlaubnis geht es nicht. Tipp nochmals auf «Einschalten» und dann auf «Erlauben».",
    "push-store": "Im Dienst fehlt noch die Ablage für Mitteilungen (Workers KV mit dem Namen HP), Schritt 4 im README.",
    "push-setup": "Beim Dienst fehlt noch das Secret DIENST_SCHLUESSEL, Schritt 3 im README.",
    "push-offline": "Der Dienst antwortet nicht. Prüf das Netz und die Adresse bei dienst in config.js.",
    "push-member": "Wähle zuerst, wer du bist.",
    "push-unknown": "Der Dienst findet diesen Haushalt nicht. Ist er für alle freigegeben, und nennt der Dienst dasselbe Firebase-Projekt?",
    "push-sw": "Die App ist noch nicht ganz geladen. Lade die Seite neu und versuch es nochmal.",
    "push-gone": "Dieses Gerät ist nicht mehr angemeldet. Schalte die Mitteilungen aus und wieder ein.",
    "push-delivery": "Der Push-Dienst hat die Probe nicht angenommen. Schalte die Mitteilungen aus und wieder ein.",
    "push-rate": "Gerade sind sehr viele Mitteilungen unterwegs. Versuch es in einer Stunde nochmal.",
    "push-unsupported": "Dieser Browser kann keine Mitteilungen empfangen.",
    "push-failed": "Das hat nicht geklappt. Versuch es nochmal."
  };
  function failText(e) { return FAIL[e && e.code] || (e && e.name === "NotAllowedError" ? FAIL["push-denied"] : FAIL["push-failed"]); }
  const clock = ms => { try { return new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" }).format(new Date(ms)); } catch (e) { return ""; } };

  function Kinds({ prefs, onToggle, disabled }) {
    return html`
      <div class="push-kinds" role="group" aria-label="Was kommt">${R.KINDS.map(k => html`
        <label class="push-kind" key=${k.id}>
          <input type="checkbox" checked=${prefs.indexOf(k.id) >= 0} disabled=${disabled} onChange=${() => onToggle(k.id)} />
          <span class="emo" aria-hidden="true">${k.emoji}</span>
          <span class="x-main"><span class="x-t">${k.label}</span><span class="x-s">${k.hint}</span></span>
        </label>`)}
      </div>`;
  }

  function Household({ st, home }) {
    if (!st) return null;
    const by = {};
    (st.devices || []).forEach(d => { (by[d.member] || (by[d.member] = [])).push(d.dev || "Gerät"); });
    const names = Object.keys(by).map(id => (home.members[id] ? home.members[id].name : "?") + " (" + by[id].join(", ") + ")");
    const age = st.cron ? Date.now() - st.cron : 0;
    return html`
      <div class="field">
        <span class="label">Im Haushalt</span>
        <p class="hint">${names.length ? "Angemeldet: " + names.join(", ") + "." : "Noch kein Gerät angemeldet."}</p>
        ${!st.cron
          ? html`<p class="push-warn">Erinnerungen brauchen noch den Zeitplan im Dienst (Cron Trigger, Schritt 5 im README). Mitteilungen über neue Einträge kommen trotzdem.</p>`
          : age > 3 * 3600000
            ? html`<p class="push-warn">Der Zeitplan im Dienst hat sich seit ${clock(st.cron)} nicht mehr gemeldet. Prüf bei Cloudflare den Cron Trigger.</p>`
            : html`<p class="hint">Erinnerungen laufen: Der Dienst hat zuletzt um ${clock(st.cron)} nachgeschaut.</p>`}
      </div>`;
  }

  function PushSheet({ ctx, onClose, setMe, onInstall }) {
    const { home, data, mode, meId, members, act, say } = ctx;
    const sup = Push.support();
    const [cur, setCur] = useState(() => Push.info(home.id));
    const [prefs, setPrefs] = useState(() => (cur ? cur.prefs.slice() : R.prefsOf(null)));
    const [quiet, setQuiet] = useState(() => (cur ? cur.quiet !== false : true));
    const [busy, setBusy] = useState("");
    const [err, setErr] = useState(null);
    const [st, setSt] = useState(null);
    const usable = mode === "cloud" && sup === "ok";
    useEffect(() => { if (usable) Push.serviceKey().catch(() => {}); }, [usable]);           // der Tipp auf «Einschalten» geht dann schneller
    useEffect(() => {
      if (mode !== "cloud" || !Push.service) return;
      let alive = true;
      Push.status(home.id).then(r => { if (alive) setSt(r); }, () => {});
      return () => { alive = false; };
    }, [home.id, mode, cur && cur.at]);
    const preview = useMemo(() => (meId ? R.upcoming({ home, events: data.events || [], plants: data.plants || [], infos: data.infos || [], expenses: data.expenses || [] },
      { member: meId, prefs, quiet }, Date.now(), 7, 6) : []), [home, data.events, data.plants, data.infos, data.expenses, meId, prefs, quiet]);

    const run = async (what, fn) => {
      if (busy) return;
      setBusy(what); setErr(null);
      try { await fn(); } catch (e) { setErr(failText(e)); }
      setBusy("");
    };
    const on = () => run("on", async () => {
      const x = await Push.enable(home.id, { member: meId, prefs, quiet });
      setCur(x);
      if (!home.push) act.patchHome(home.id, { push: Date.now() });                     // die anderen melden ab jetzt neue Einträge
      say("Mitteilungen sind eingeschaltet.");
    });
    const off = () => run("off", async () => { await Push.disable(home.id); setCur(null); say("Mitteilungen sind auf diesem Gerät aus."); });
    const probe = () => run("test", async () => { await Push.test(home.id); say("Die Probe ist unterwegs. Sie sollte gleich erscheinen."); });
    const change = (p, q) => {
      setPrefs(p); setQuiet(q);
      if (cur) run("save", async () => setCur(await Push.update(home.id, { member: meId, prefs: p, quiet: q })));
    };
    const toggle = id => change(prefs.indexOf(id) >= 0 ? prefs.filter(x => x !== id) : R.prefsOf(prefs.concat(id)), quiet);

    let body;
    if (mode !== "cloud") body = html`<p>Mitteilungen gibt es für geteilte Haushalte. Dieser liegt nur auf diesem Gerät. Unter «Haushalt», «Für alle freigeben» teilst du ihn.</p>`;
    else if (sup === "none") body = html`
      <p>Für Mitteilungen braucht der Home-Planer einmal einen kleinen Dienst bei Cloudflare, kostenlos und derselbe wie für das Kalender-Abo. Er verschickt die Mitteilungen und schaut alle 15 Minuten, ob eine Erinnerung fällig ist.</p>
      <p><a href=${README} target="_blank" rel="noopener">Anleitung im README<${Icon} n="ext" s=${14} /></a>, Abschnitt «Dienst für Kalender und Mitteilungen».</p>`;
    else if (sup === "ios-install") body = html`
      <p>Auf dem iPhone und iPad kommen Mitteilungen nur in der App vom Home-Bildschirm (ab iOS 16.4). Im Safari teilen, «Zum Home-Bildschirm», dann den Home-Planer von dort öffnen und hier einschalten.</p>
      ${onInstall && html`<div class="btn-row"><button type="button" class="btn small" onClick=${onInstall}><${Icon} n="device" s=${16} />So installierst du die App</button></div>`}`;
    else if (sup === "unsupported") body = html`<p>${FAIL["push-unsupported"]} Auf Android geht es mit Chrome, Firefox oder Samsung Internet, am Computer mit Chrome, Edge, Firefox und Safari.</p>`;
    else if (sup === "denied") body = html`<p>${FAIL["push-denied"]}</p>`;
    else if (!meId) body = html`
      <p>Mitteilungen gehen an eine Person: an dich, wenn du heute kochst, oder mit deinem Anteil an einer Ausgabe. Wer bist du?</p>
      <div class="chips" role="radiogroup" aria-label="Wer bist du?">${members.map(m => html`
        <button type="button" key=${m.id} role="radio" aria-checked="false" class="chip" onClick=${() => setMe(m.id)}><${Av} m=${m} s=${1} />${m.name}</button>`)}
      </div>`;
    else body = html`
      ${cur
        ? html`<p class="push-on"><span class="emo" aria-hidden="true">🔔</span>Auf diesem Gerät eingeschaltet.</p>`
        : html`<div class="btn-row"><button type="button" class="btn primary" disabled=${!!busy || !prefs.length} onClick=${on}><span class="emo" aria-hidden="true">🔔</span>${busy === "on" ? "Wird eingeschaltet …" : "Mitteilungen einschalten"}</button></div>
          <p class="hint">Der Browser fragt danach, ob der Home-Planer Mitteilungen schicken darf. Wähle «Erlauben».</p>`}
      <div class="field">
        <span class="label">Was kommt</span>
        <${Kinds} prefs=${prefs} onToggle=${toggle} disabled=${busy === "on"} />
        <label class="check"><input type="checkbox" checked=${quiet} onChange=${e => change(prefs, e.target.checked)} /><span>Ruhezeit von 22 bis 7 Uhr: nachts keine Mitteilungen über neue Einträge</span></label>
        <p class="hint">Was du selbst einträgst, meldet der Home-Planer nur den anderen. Erinnerungen an Termine mit Uhrzeit kommen auch in der Ruhezeit.</p>
      </div>
      ${cur && html`
        <div class="btn-row">
          <button type="button" class="btn small" disabled=${!!busy} onClick=${probe}><${Icon} n="check" s=${16} />${busy === "test" ? "Wird geschickt …" : "Probe schicken"}</button>
          <button type="button" class="btn small ghost" disabled=${!!busy} onClick=${off}>Ausschalten</button>
        </div>`}
      <div class="field">
        <span class="label">Als Nächstes</span>
        ${preview.length
          ? html`<div class="list flat push-next">${preview.map(x => html`
              <div class="x" key=${x.at + x.title}>
                <span class="x-ic" aria-hidden="true">${(R.KINDS.find(k => k.id === x.kind) || {}).emoji}</span>
                <span class="x-main"><span class="x-t">${x.title.replace(/^\S+\s/, "")}</span><span class="x-s">${(x.day === HP.today() ? "Heute" : HP.dayLabel(x.day)) + ", " + x.time + " · " + x.body}</span></span>
              </div>`)}</div>`
          : html`<p class="hint">In den nächsten sieben Tagen steht keine Erinnerung für dich an. Abfuhr, Geburtstage, Pflanzen und Fristen tragt ihr in Kalender, Pflanzen und Infos ein.</p>`}
      </div>`;

    return html`
      <${Sheet} title="Mitteilungen" onClose=${onClose} closeLabel="Fertig" error=${err}>
        <p>Der Home-Planer meldet sich, wenn jemand etwas einträgt, und erinnert zur richtigen Zeit: Abfuhr am Vorabend, wer heute kocht, Pflanzen, Fristen, Geburtstage. Die Auswahl gilt für dieses Gerät.</p>
        ${body}
        ${mode === "cloud" && sup !== "none" && html`<${Household} st=${st} home=${home} />`}
      <//>`;
  }

  /* Auf der Startseite, solange Mitteilungen auf diesem Gerät aus sind. «Nein danke» merkt sich das Gerät. */
  function PushCard({ ctx }) {
    const { home, mode, open } = ctx;
    const [gone, setGone] = useState(() => !!(U.ls.get("hp.push.hint", {}) || {})[home.id]);
    const sup = Push.support();
    if (gone || mode !== "cloud" || !Push.service || Push.info(home.id) || (sup !== "ok" && sup !== "ios-install") || HP.memberIds(home).length < 2) return null;
    const hide = () => { const m = Object.assign({}, U.ls.get("hp.push.hint", {}) || {}, { [home.id]: Date.now() }); U.ls.set("hp.push.hint", m); setGone(true); };
    return html`
      <section class="panel push-card">
        <div class="push-card-in">
          <span class="emo push-bell" aria-hidden="true">🔔</span>
          <div>
            <h2 class="sec-h">Mitteilungen aufs Handy?</h2>
            <p>Abfuhr am Vorabend, wer heute kocht, Neues auf der Einkaufsliste, dein Anteil an Ausgaben. Du wählst, was kommt.</p>
          </div>
        </div>
        <div class="btn-row">
          <button type="button" class="btn small primary" onClick=${() => open({ t: "push" })}>Einrichten</button>
          <button type="button" class="btn small ghost" onClick=${hide}>Nein danke</button>
        </div>
      </section>`;
  }

  Object.assign(U, { PushSheet, PushCard });
})();
