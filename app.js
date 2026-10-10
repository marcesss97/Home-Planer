/* Home-Planer: the shell. The list of households, the overview, the bar at the bottom with the modules, inviting,
   settings and the line that says whether everything is saved. Stores through HPStore (this device or group sync). */
(function () {
  "use strict";
  var root = document.getElementById("app"), P = window.htmPreact, HP = window.HP, Store = window.HPStore, U = window.HPUI;
  if (!P || !HP || !Store || !window.HPRates || !U || !U.Kasse || !U.Shopping || !U.Calendar || !U.Plants || !U.Infos || !U.Recipes || !U.CookMode || !window.HPImport || !window.HPIcs || !U.CalSync) {
    var bs = document.getElementById("boot-status");
    if (bs) bs.textContent = "Der Home-Planer konnte nicht geladen werden. Prüf die Verbindung und lade die Seite neu.";
    return;
  }
  const { html, render, useState, useEffect, useMemo, useRef, useCallback, useErrorBoundary } = P;
  const { ls, newId, clean, GHOST, membersOf, COLOR_NAMES, hashOf, refsOf, fileName, FAIL, copyText, Icon, Av, Sheet, DeleteButton, CurSelect, Qr } = U;
  const COLS = Store.COLS;
  const emptyCols = () => { const o = {}; COLS.forEach(c => { o[c] = null; }); return o; };
  const NO_COLS = Object.freeze(emptyCols());

  /* A picture for a household in the list, the same on every start: picked by its id. */
  const HOME_EMOJI = ["🏡", "🏠", "🛋️", "🪴", "🏘️", "🏢", "🧺", "🫖", "🐈", "🌻"], HOME_TINT = ["k-rent", "k-groceries", "k-utilities", "k-internet", "k-household", "k-furniture", "k-food", "k-outing"];

  /* ---------- as an app on the home screen ---------- */
  /* Browsers on Android and on the desktop hand over an install offer that may be shown on a tap. The iPhone has no such
     thing: there the way leads through the share menu, and the installed app starts with a storage of its own. */
  let installOffer = null;
  const installSubs = new Set();
  const installChanged = () => { installSubs.forEach(f => { try { f(); } catch (e) { /* a listener that is gone */ } }); };
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installOffer = e; installChanged(); });
  window.addEventListener("appinstalled", () => { installOffer = null; installChanged(); });
  function isStandalone() {
    try { return navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches; } catch (e) { return false; }
  }
  function isIos() {
    const ua = navigator.userAgent || "";
    return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  }
  function useInstallOffer() {
    const [, bump] = useState(0);
    useEffect(() => { const f = () => bump(n => n + 1); installSubs.add(f); return () => { installSubs.delete(f); }; }, []);
    return installOffer;
  }
  /* Shows the browser's own install dialog. An offer can be used once. */
  function runInstall() {
    const offer = installOffer;
    if (!offer) return;
    installOffer = null; installChanged();
    try { offer.prompt(); } catch (e) { /* the browser has withdrawn the offer */ }
  }
  /* The hint on the start page, and as one line (slim) in a household. It goes away for good once it is closed; the guide stays in the settings. */
  function InstallHint({ onHow, slim }) {
    const offer = useInstallOffer();
    const [off, setOff] = useState(() => !!ls.get("hp.install.off", false));
    const kind = off || isStandalone() ? null : offer ? "offer" : isIos() ? "ios" : null;
    if (!kind) return null;
    const hide = () => { ls.set("hp.install.off", true); setOff(true); };
    if (slim) return html`
      <section class="tip slim" aria-label="Als App installieren">
        <button type="button" class="tip-go" onClick=${kind === "offer" ? runInstall : onHow}><span class="emo" aria-hidden="true">📲</span><span>Als App installieren</span><${Icon} n="next" s=${16} /></button>
        <button type="button" class="icon-btn" aria-label="Hinweis ausblenden" onClick=${hide}><${Icon} n="close" s=${18} /></button>
      </section>`;
    return html`
      <section class="tip" aria-label="Als App installieren">
        <span class="x-ic k-utilities" aria-hidden="true">📲</span>
        <div class="tip-body">
          <strong>Als App installieren</strong>
          <p>Dann startet der Home-Planer vom ${kind === "ios" ? "Home-Bildschirm" : "Startbildschirm"}: im Vollbild, ohne Browser-Leisten und auch ohne Netz.</p>
          ${kind === "offer"
            ? html`<button type="button" class="btn primary small" onClick=${runInstall}><${Icon} n="download" s=${16} />Installieren</button>`
            : html`<button type="button" class="btn primary small" onClick=${onHow}>So geht es</button>`}
        </div>
        <button type="button" class="icon-btn" aria-label="Hinweis ausblenden" onClick=${hide}><${Icon} n="close" /></button>
      </section>`;
  }
  /* link: the invitation of the open household, if it is a shared one. hasCloud, hasLocal: what this device has to take along. */
  function InstallSheet({ link, hasCloud, hasLocal, onClose, say }) {
    const offer = useInstallOffer();
    const [shown, setShown] = useState(false);
    const ios = isIos(), ua = navigator.userAgent || "";
    /* Other browsers on the iPhone and the windows inside chat apps have the share button elsewhere, or no such entry at all. */
    const safari = /Version\/[\d.]+.*Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    const copy = () => copyText(link, () => say("Link kopiert. In der App fügst du ihn bei «Mit Link beitreten» ein."), () => setShown(true));
    if (isStandalone()) return html`
      <${Sheet} title="Als App installieren" onClose=${onClose} closeLabel="Fertig">
        <p class="ok">Der Home-Planer läuft bereits als App.</p>
      <//>`;
    return html`
      <${Sheet} title="Als App installieren" onClose=${onClose} closeLabel="Fertig">
        <p class="lead">Als App startet der Home-Planer vom ${ios ? "Home-Bildschirm" : "Startbildschirm"}: im Vollbild, ohne Browser-Leisten und auch ohne Netz.</p>
        ${ios ? html`
          ${(hasCloud || hasLocal) && html`
            <div class="note"><${Icon} n="device" /><div class="stack">
              <p><strong>Vorher: Haushalte mitnehmen.</strong> Auf iPhone und iPad hat die App einen eigenen Speicher und beginnt leer.</p>
              ${hasCloud && html`<p>Einen geteilten Haushalt holst du in der App mit dem Einladungslink wieder hinein, über «Mit Link beitreten».</p>`}
              ${link && html`<div><button type="button" class="btn small" onClick=${copy}><${Icon} n="copy" s=${16} />Link dieses Haushalts kopieren</button></div>`}
              ${link && shown && html`<input class="input linkbox" readonly aria-label="Einladungslink" value=${link} onFocus=${e => e.target.select()} />`}
              ${hasLocal && html`<p>Einen Haushalt, der nur auf diesem Gerät liegt, sicherst du vorher: in den Einstellungen des Haushalts die Sicherung herunterladen. In der App liest du sie in den Einstellungen wieder ein.</p>`}
            </div></div>`}
          <ol class="steps">
            <li><div class="step"><strong>${safari ? "In Safari auf «Teilen» tippen" : "Auf «Teilen» tippen"}</strong><p>${safari
              ? "Das ist das Quadrat mit dem Pfeil nach oben. Auf neueren iPhones steckt es hinter den drei Punkten «…»."
              : "Das ist das Quadrat mit dem Pfeil nach oben, meist neben der Adresse. Fehlt danach der Eintrag «Zum Home-Bildschirm», öffne den Home-Planer in Safari."}</p></div></li>
            <li><div class="step"><strong>«Zum Home-Bildschirm» wählen</strong><p>Der Eintrag steht weiter unten in der Liste. Mit «Hinzufügen» bestätigen.</p></div></li>
            <li><div class="step"><strong>Vom Home-Bildschirm starten</strong><p>Ab jetzt öffnest du den Home-Planer über sein Symbol, nicht mehr über den Browser.</p></div></li>
            ${link && html`<li><div class="step"><strong>Haushalt wieder öffnen</strong><p>In der App auf «Mit Link beitreten» tippen und den kopierten Link einfügen.</p></div></li>`}
          </ol>
          ${!hasCloud && !hasLocal && html`<p class="hint">Auf iPhone und iPad hat die App einen eigenen Speicher und beginnt leer. Leg Haushalte deshalb am besten gleich in der App an.</p>`}` : html`
          ${offer && html`<div><button type="button" class="btn primary" onClick=${runInstall}><${Icon} n="download" s=${18} />Installieren</button></div>`}
          <div class="field">
            <span class="label">Android</span>
            <p class="hint">Im Browser-Menü (drei Punkte) «App installieren» oder «Zum Startbildschirm hinzufügen» wählen.</p>
          </div>
          <div class="field">
            <span class="label">iPhone</span>
            <p class="hint">Den Home-Planer in Safari öffnen, auf «Teilen» tippen, dann «Zum Home-Bildschirm». Dort beginnt die App mit leerem Speicher: Geteilte Haushalte kommen mit dem Einladungslink dazu, andere über eine Sicherung.</p>
          </div>
          <div class="field">
            <span class="label">Computer</span>
            <p class="hint">In Chrome oder Edge auf das Installieren-Symbol rechts in der Adresszeile klicken. In Safari auf dem Mac: «Ablage», dann «Zum Dock hinzufügen».</p>
          </div>`}
      <//>`;
  }

  /* ---------- is the group sync ready? ---------- */
  /* Why a household was created on this device although the group sync is on. */
  const REFUSED = {
    "permission-denied": "Angelegt, vorerst nur auf diesem Gerät: Firebase lässt den Home-Planer noch nicht zu, es fehlen die Regeln. Auf der Startseite steht, was zu tun ist.",
    "setup-db": "Angelegt, vorerst nur auf diesem Gerät: Im Firebase-Projekt fehlt die Datenbank. Auf der Startseite steht, was zu tun ist.",
    "not-found": "Angelegt, vorerst nur auf diesem Gerät: Im Firebase-Projekt fehlt die Datenbank. Auf der Startseite steht, was zu tun ist.",
    "invalid-argument": "Angelegt, vorerst nur auf diesem Gerät: Firebase lehnt die Angaben aus config.js ab.",
    unauthenticated: "Angelegt, vorerst nur auf diesem Gerät: Firebase lehnt die Angaben aus config.js ab.",
    "failed-precondition": "Angelegt, vorerst nur auf diesem Gerät: Firebase lehnt die Angaben aus config.js ab.",
    "resource-exhausted": "Angelegt, vorerst nur auf diesem Gerät: Das Tageskontingent von Firebase ist aufgebraucht."
  };
  /* The answer of the sync server to a probe, once per visit of the start page (at most every half minute). */
  const health = { state: null, at: 0 };
  function useCloudHealth() {
    const [state, setState] = useState(health.state);
    const run = useCallback(force => {
      if (!Store.cloudOn || navigator.onLine === false) return;
      if (!force && Date.now() - health.at < 30000) { setState(health.state); return; }
      health.at = Date.now();
      setState(s => (force ? "checking" : s));
      Store.checkCloud().then(() => { health.state = "ok"; setState("ok"); },
        e => { const c = e && e.code; health.state = c === "unavailable" || c === "timeout" || c === "internal" ? null : c; setState(health.state); });
    }, []);
    useEffect(() => { run(false); }, [run]);
    return [state, () => run(true)];
  }
  function SyncTrouble({ onSetup }) {
    const [state, recheck] = useCloudHealth();
    if (!state || state === "ok") return null;
    const busy = state === "checking";
    const text = state === "permission-denied"
      ? "Firebase lässt den Home-Planer noch nicht zu: Im Projekt fehlen seine Sicherheitsregeln. Bis dahin werden Haushalte nur auf diesem Gerät gespeichert. Das Einsetzen dauert zwei Minuten: Regeln kopieren, im Regel-Editor einfügen, veröffentlichen."
      : CLOUD_ERR[state] || "Der Gruppen-Sync antwortet nicht wie erwartet. Bis das geklärt ist, werden Haushalte nur auf diesem Gerät gespeichert.";
    return html`
      <section class="tip plain warn" aria-label="Gruppen-Sync">
        <span class="x-ic k-late" aria-hidden="true">🔒</span>
        <div class="tip-body">
          <strong>Gruppen-Sync: noch ein Schritt</strong>
          <p>${busy ? "Wird geprüft …" : text}</p>
          <div class="btn-row">
            <button type="button" class="btn primary small" onClick=${onSetup}>So geht es</button>
            <button type="button" class="btn small" disabled=${busy} onClick=${recheck}><${Icon} n="refresh" s=${16} />Nochmals prüfen</button>
          </div>
        </div>
      </section>`;
  }

  /* ---------- start page: the households on this device ---------- */
  function Home({ reg, onOpen, onNew, onJoin, onSettings, onSetup, onInstall }) {
    return html`
      <header class="brand">
        <div class="brand-row">
          <h1><span class="logo" aria-hidden="true">🏡</span><span class="word">Home-Planer</span></h1>
          <button type="button" class="icon-btn" aria-label="Einstellungen" onClick=${onSettings}><${Icon} n="sliders" s=${22} /></button>
        </div>
        <p>Kasse, Einkauf, Rezepte, Kalender, Pflanzen und Infos für euren Haushalt.</p>
      </header>
      ${!Store.storageOk && html`<div class="note warn" role="alert"><${Icon} n="device" /><div>Dieser Browser lässt nichts speichern (privater Modus oder gesperrte Website-Daten). Haushalte gehen verloren, sobald du die Seite schliesst. Öffne den Home-Planer in einem gewöhnlichen Fenster.</div></div>`}
      ${Store.cloudOn && html`<${SyncTrouble} onSetup=${onSetup} />`}
      <${InstallHint} onHow=${onInstall} />
      ${reg.length > 0
        ? html`
          <section class="stack">
            <h2 class="sec-h">Eure Haushalte</h2>
            <div class="trips">${reg.map(t => html`
              <button type="button" key=${t.id} class="trip" onClick=${() => onOpen(t.id)}>
                <span class=${"trip-e " + HOME_TINT[hashOf(t.id) % HOME_TINT.length]} aria-hidden="true">${HOME_EMOJI[hashOf("e" + t.id) % HOME_EMOJI.length]}</span>
                <span class="trip-body">
                  <span class="trip-name">${t.name || "Geteilter Haushalt"}</span>
                  <span class="trip-meta">${t.mode === "cloud" ? "Für alle im Haushalt, synchronisiert" : "Nur auf diesem Gerät"}</span>
                </span>
                <span class="go"><${Icon} n="next" /></span>
              </button>`)}
            </div>
            <div class="btn-row">
              <button type="button" class="btn" onClick=${onNew}><${Icon} n="plus" s=${18} />Neuer Haushalt</button>
              ${Store.cloudOn && html`<button type="button" class="btn" onClick=${onJoin}><${Icon} n="link" s=${18} />Mit Link beitreten</button>`}
            </div>
          </section>`
        : html`
          <section class="empty">
            <span class="empty-e" aria-hidden="true">🏡🪴🛒</span>
            <h2>Noch kein Haushalt</h2>
            <p>Leg euren Haushalt an und trag ein, wer dazugehört. Danach habt ihr alles an einem Ort:</p>
            <ul class="feat">
              <li><span class="x-ic k-rent" aria-hidden="true">💰</span>Gemeinsame Kasse: wer was bezahlt hat und wer wem wie viel schuldet</li>
              <li><span class="x-ic k-groceries" aria-hidden="true">🛒</span>Eine Einkaufsliste, die im Laden für alle gleich aussieht</li>
              <li><span class="x-ic k-food" aria-hidden="true">🍳</span>Rezeptbuch, Menü-Finder und Wochenplan, Zutaten mit einem Tipp auf die Liste</li>
              <li><span class="x-ic k-internet" aria-hidden="true">📅</span>Gemeinsamer Kalender mit Abfuhr, Geburtstagen und Besuch</li>
              <li><span class="x-ic k-household" aria-hidden="true">🪴</span>Giessplan: welche Pflanze heute dran ist und wer zuletzt gegossen hat</li>
              <li><span class="x-ic k-utilities" aria-hidden="true">📁</span>Infos wie Mietvertrag, Versicherungen und WLAN, mit Fristen</li>
            </ul>
            <div class="btn-row">
              <button type="button" class="btn primary" onClick=${onNew}>Haushalt anlegen</button>
              ${Store.cloudOn && html`<button type="button" class="btn" onClick=${onJoin}><${Icon} n="link" s=${18} />Mit Link beitreten</button>`}
            </div>
          </section>`}
      ${!Store.cloudOn && html`
        <section class="tip plain" aria-label="Gemeinsam speichern">
          <span class="x-ic k-rent" aria-hidden="true">👯</span>
          <div class="tip-body">
            <strong>Gemeinsam speichern</strong>
            <p>${Store.configState === "off"
              ? "Im Moment bleiben Haushalte auf diesem Gerät. Mit dem Gruppen-Sync tragen alle auf dem eigenen Handy ein, und alles wird laufend gemeinsam gespeichert. Erst dann kannst du andere einladen."
              : "Der Gruppen-Sync ist aus, weil in der Datei config.js etwas nicht stimmt. Bis dahin bleiben Haushalte auf diesem Gerät."}</p>
            <button type="button" class="btn small" onClick=${onSetup}>Gruppen-Sync einrichten</button>
          </div>
        </section>`}
    `;
  }

  /* A household that cannot be shown (yet): loading, gone, unreachable. */
  function HomeGate({ state, onBack, onForget }) {
    const gone = state === null, text = state === undefined
      ? ["Haushalt wird geladen", "Einen Moment."]
      : gone ? ["Diesen Haushalt gibt es nicht", "Er wurde gelöscht, oder der Link stimmt nicht ganz."]
      : state === "denied" ? ["Zugriff verweigert", "Der Gruppen-Sync lässt das Lesen nicht zu. In Firebase fehlen vermutlich noch die Sicherheitsregeln des Home-Planers: siehe README, Abschnitt «Gruppen-Sync einrichten»."]
      : state === "unconfigured" ? ["Kein Gruppen-Sync", "Dies ist ein geteilter Haushalt, aber auf dieser Installation ist kein Gruppen-Sync eingerichtet."]
      : state === "setup-db" ? ["Datenbank fehlt", "Im Firebase-Projekt gibt es noch keine Firestore-Datenbank. Die Schritte stehen im README, Abschnitt «Gruppen-Sync einrichten»."]
      : state === "setup" ? ["Gruppen-Sync nicht bereit", "Firebase lehnt die Angaben aus config.js ab. Tippe auf der Startseite in den Einstellungen auf «Verbindung prüfen»."]
      : state === "quota" ? ["Kontingent aufgebraucht", "Das kostenlose Tageskontingent von Firebase ist aufgebraucht. Am Morgen wird es wieder frei, dann lädt der Haushalt von selbst."]
      : ["Haushalt nicht erreichbar", "Ohne Netz erscheinen nur Haushalte, die dieses Gerät schon einmal geladen hat. Sobald du wieder online bist, lädt er von selbst."];
    const waits = state !== null && state !== "unconfigured";
    const face = state === undefined ? "⏳" : gone ? "🕳️" : state === "denied" ? "🔒" : state === "quota" ? "😴" : state === "offline" ? "📡" : "🧰";
    return html`
      <div class="top"><button type="button" class="back" onClick=${onBack}><${Icon} n="back" />Haushalte</button></div>
      <section class="empty" aria-live="polite">
        <span class="empty-e" aria-hidden="true">${face}</span>
        <h2>${text[0]}</h2>
        <p>${text[1]}</p>
        ${state !== undefined && waits && html`<p class="meta">Der Home-Planer versucht es von selbst wieder.</p>`}
        ${gone && html`<button type="button" class="btn" onClick=${onForget}>Aus meiner Liste entfernen</button>`}
      </section>`;
  }

  function JoinSheet({ onJoin, onClose }) {
    const [v, setV] = useState("");
    const [err, setErr] = useState(null);
    const go = () => {
      const id = Store.idFromLink(v);
      if (!id) { setErr("Darin steckt kein Einladungslink. Füg den ganzen Link ein, den du bekommen hast."); return; }
      onJoin(id);
    };
    const canPaste = !!(navigator.clipboard && navigator.clipboard.readText);
    const paste = () => {
      const no = () => setErr("Der Browser gibt die Zwischenablage nicht frei. Füg den Link von Hand ins Feld ein.");
      try { navigator.clipboard.readText().then(t => { if (t) { setV(t.trim()); setErr(null); } else no(); }, no); } catch (e) { no(); }
    };
    return html`
      <${Sheet} title="Beitreten" onClose=${onClose} error=${err} action=${html`<button type="button" class="btn primary small" onClick=${go}>Öffnen</button>`}>
        <div class="field">
          <label for="hp-join">Einladungslink</label>
          <input id="hp-join" class="input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Link einfügen" value=${v} data-autofocus=""
            onInput=${e => { setV(e.target.value); setErr(null); }} onKeyDown=${e => { if (e.key === "Enter") { e.preventDefault(); go(); } }} />
          <p class="hint">Den Link bekommst du von jemandem aus dem Haushalt: im Haushalt oben auf «Einladen» tippen und den Link schicken.</p>
        </div>
        ${canPaste && html`<div><button type="button" class="btn" onClick=${paste}><${Icon} n="copy" s=${18} />Aus der Zwischenablage einfügen</button></div>`}
        <div class="foot"><button type="button" class="btn primary block" onClick=${go}>Haushalt öffnen</button></div>
      <//>`;
  }

  function InviteSheet({ home, onClose, say }) {
    const link = Store.linkFor(home.id);
    const [shown, setShown] = useState(false);
    const canShare = typeof navigator.share === "function";
    const copy = () => copyText(link, () => say("Link kopiert. Schick ihn an alle im Haushalt."), () => setShown(true));
    const share = () => { navigator.share({ title: "Home-Planer «" + home.name + "»", text: "Unser Haushalt im Home-Planer: Kasse, Einkaufsliste, Kalender, Pflanzen und Infos. Hier geht es lang:", url: link }).catch(() => {}); };
    return html`
      <${Sheet} title="Einladen" onClose=${onClose} closeLabel="Fertig">
        <p class="hint">Wer diesen Link öffnet, sieht den ganzen Haushalt und kann eintragen und ändern, ohne Konto und ohne Passwort. Schick ihn nur an die Leute, die bei euch wohnen.</p>
        <div class="qr-box"><${Qr} text=${link} /></div>
        <div class="btn-row center">
          ${canShare && html`<button type="button" class="btn primary" onClick=${share}><${Icon} n="share" s=${18} />Link teilen</button>`}
          <button type="button" class=${"btn" + (canShare ? "" : " primary")} onClick=${copy}><${Icon} n="copy" s=${18} />Link kopieren</button>
        </div>
        <div class="field">
          <label for="hp-link">Einladungslink</label>
          <input id="hp-link" class="input linkbox" readonly value=${link} onFocus=${e => e.target.select()} />
          ${shown && html`<p class="hint">Kopieren hat nicht geklappt. Markiere den Link im Feld und kopiere ihn von Hand.</p>`}
        </div>
        <p class="hint">Zu Hause geht es am schnellsten mit dem QR-Code: Die anderen richten die Handy-Kamera darauf.</p>
      <//>`;
  }

  const SYNC_TEXT = {
    off: "Nicht eingeschaltet. Haushalte liegen nur auf diesem Gerät. Mit dem Gruppen-Sync tragen alle ein, und alles wird laufend gemeinsam gespeichert. Die Anleitung führt Schritt für Schritt durch das Einrichten.",
    broken: "Nicht eingeschaltet: Die Datei config.js lässt sich nicht lesen, vermutlich wegen eines Tippfehlers. Ersetze darin nur die eine Zeile durch den Block aus der Firebase-Konsole, von «const firebaseConfig = {» bis «};». Das README zeigt ein Beispiel.",
    incomplete: "Nicht eingeschaltet: In der Datei config.js fehlen Angaben, oder es stehen noch Platzhalter darin. Kopier den ganzen Block aus der Firebase-Konsole, mindestens mit apiKey und projectId."
  };
  const CONFIG_BAD = "Firebase lehnt die Angaben aus config.js ab (apiKey oder projectId stimmen nicht). Kopier den Block nochmals aus der Firebase-Konsole.";
  const CLOUD_ERR = {
    "permission-denied": "Firebase antwortet, lehnt den Zugriff aber ab. Es fehlen die Sicherheitsregeln des Home-Planers: In der Firebase-Konsole bei der Firestore-Datenbank den Reiter «Regeln» öffnen, den Inhalt der Datei firestore.rules einfügen und veröffentlichen.",
    "setup-db": "Firebase antwortet: In diesem Projekt gibt es noch keine Firestore-Datenbank. Leg sie in der Firebase-Konsole an und lass ihre Kennung auf «(default)». Die Schritte stehen im README, Abschnitt «Gruppen-Sync einrichten».",
    "resource-exhausted": "Firebase antwortet, aber das kostenlose Tageskontingent ist aufgebraucht. Am Morgen geht es weiter.",
    "invalid-argument": CONFIG_BAD, unauthenticated: CONFIG_BAD, "failed-precondition": CONFIG_BAD,
    internal: "Die Prüfung liess sich nicht starten. Lade die Seite neu und versuch es nochmal."
  };
  const CLOUD_NO = "Keine Antwort von Firebase. Prüf zuerst dein Netz. Ist es in Ordnung, stimmen vermutlich die Werte in config.js nicht.";
  /* Asks the sync server directly and says in plain words what is missing. */
  function CloudCheck() {
    const [cloud, setCloud] = useState(null);
    const checkCloud = () => {
      setCloud({ busy: true });
      Store.checkCloud().then(
        () => setCloud({ ok: true, msg: "Die Verbindung steht: Firebase antwortet, und die Regeln lassen den Home-Planer zu." }),
        e => {
          const code = e && e.code, quiet = !code || code === "unavailable" || code === "timeout" || code === "internal" || code === "unconfigured";
          setCloud({ ok: false, msg: (CLOUD_ERR[code] || CLOUD_NO) + (!quiet && e.message ? " Meldung von Firebase: " + String(e.message).slice(0, 220) : "") });
        });
    };
    return html`
      <div><button type="button" class="btn small" disabled=${!!(cloud && cloud.busy)} onClick=${checkCloud}><${Icon} n="refresh" s=${16} />Verbindung prüfen</button></div>
      ${cloud && cloud.busy && html`<p class="hint" role="status">Verbindung wird geprüft, das dauert höchstens eine Viertelminute …</p>`}
      ${cloud && cloud.msg && html`<p class=${cloud.ok ? "ok" : "err"} role="status">${cloud.msg}</p>`}`;
  }

  /* ---------- group sync: the guide, and sharing a household that lives on one device ---------- */
  /* Where a file of this installation is edited: on GitHub Pages the address names the account and the project. */
  function editLink(file) {
    try {
      const m = /^([a-z0-9][a-z0-9-]*)\.github\.io$/i.exec(location.hostname);
      if (!m) return null;
      const repo = location.pathname.replace(/[^/]*$/, "").split("/").filter(Boolean)[0] || location.hostname;
      return /^[A-Za-z0-9._-]+$/.test(repo) ? "https://github.com/" + m[1] + "/" + repo + "/edit/main/" + file : null;
    } catch (e) { return null; }
  }
  /* A page of the Firebase console. Without a known project the console first asks which one is meant ("_"). */
  const consoleLink = page => "https://console.firebase.google.com/project/" + (Store.projectId ? encodeURIComponent(Store.projectId) : "_") + "/" + page;
  function SetupSheet({ onClose, say }) {
    const [rules, setRules] = useState(null);                         // null = still loading, "" = the file is not there
    const [shown, setShown] = useState(false);
    const edit = useMemo(() => editLink("config.js"), []);
    useEffect(() => {
      let alive = true;
      const take = t => { if (alive) setRules(/service\s+cloud\.firestore/.test(t || "") ? String(t).trim() : ""); };
      try { fetch("firestore.rules", { cache: "no-cache" }).then(r => (r.ok ? r.text() : "")).then(take, () => take("")); } catch (e) { take(""); }
      return () => { alive = false; };
    }, []);
    const copyRules = () => {
      if (!rules) { setShown(true); return; }
      copyText(rules, () => say("Regeln kopiert. Füg sie in Firebase im Reiter «Regeln» ein."), () => setShown(true));
    };
    const bad = Store.configState === "broken" || Store.configState === "incomplete";
    const rulesStep = html`
      <div class="btn-row">
        ${rules !== "" && html`<button type="button" class="btn small" disabled=${rules === null} onClick=${copyRules}><${Icon} n="copy" s=${16} />Regeln kopieren</button>`}
        <a class="btn small" href=${consoleLink("firestore/rules")} target="_blank" rel="noopener noreferrer"><${Icon} n="arrow" s=${16} />Regel-Editor öffnen</a>
      </div>
      ${rules === "" && html`<p>Die Regeln stehen in der Datei firestore.rules in deinem GitHub-Projekt.</p>`}
      ${shown && rules && html`<p>Kopieren hat nicht geklappt. Halte den Finger auf den Text und kopiere ihn von Hand:</p><pre class="code">${rules}</pre>`}`;
    return html`
      <${Sheet} title="Gruppen-Sync einrichten" onClose=${onClose} closeLabel="Fertig">
        ${Store.cloudOn
          ? html`<div class="field">
              <p class="ok" role="status">Der Gruppen-Sync ist eingeschaltet, Firebase-Projekt <span class="m">${Store.projectId}</span>. Neue Haushalte werden automatisch für alle gespeichert.</p>
              <${CloudCheck} />
              <p class="hint">Meldet die Prüfung fehlende Regeln: Der Home-Planer braucht eigene Regeln, auch wenn das Projekt schon für die Ferienkasse läuft. Die Datei firestore.rules enthält beide; kopier sie und ersetze damit den ganzen Text im Regel-Editor.</p>
              ${rulesStep}
            </div>`
          : html`<p class="lead">Mit dem Gruppen-Sync sehen alle denselben Haushalt, tragen auf dem eigenen Handy ein, und alles wird laufend gemeinsam gespeichert. Erst dann kannst du andere einladen.</p>
            <p class="hint">Dafür braucht der Home-Planer einen gemeinsamen Speicher: ein eigenes Projekt bei Firebase von Google, kostenlos und ohne Kreditkarte. Das Einrichten dauert rund zehn Minuten und ist nur einmal nötig. Am bequemsten geht es am Computer.</p>`}
        ${bad && html`<p class="err" role="status">${SYNC_TEXT[Store.configState]}</p>`}
        <ol class="steps">
          <li><div class="step">
            <strong>Projekt anlegen</strong>
            <p>Die Firebase-Konsole öffnen, mit einem Google-Konto anmelden und ein Projekt erstellen, zum Beispiel «home-planer». Google Analytics braucht es nicht. Ein bestehendes Projekt, etwa das der Ferienkasse, geht auch.</p>
            <a class="btn small" href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer"><${Icon} n="arrow" s=${16} />Firebase-Konsole öffnen</a>
          </div></li>
          <li><div class="step">
            <strong>Datenbank anlegen</strong>
            <p>Im Menü links «Datenbanken und Speicher» öffnen (englisch «Databases & Storage»), dann «Firestore», und «Datenbank erstellen» wählen («Create database»). Standort zum Beispiel Zürich (europe-west6), Start im Produktionsmodus («Production mode»). Fragt die Konsole nach Edition und Kennung: «Standard», und die Kennung unverändert auf «(default)».</p>
            <a class="btn small" href=${consoleLink("firestore")} target="_blank" rel="noopener noreferrer"><${Icon} n="arrow" s=${16} />Firestore öffnen</a>
          </div></li>
          <li><div class="step">
            <strong>Regeln einsetzen</strong>
            <p>Zuerst hier die Regeln kopieren, dann den Regel-Editor öffnen. Dort den vorhandenen Text löschen, die Regeln einfügen und «Veröffentlichen» wählen («Publish»).</p>
            ${rulesStep}
            <p>Von Hand: auf der Seite «Firestore» steht über der Datenansicht eine Reihe von Reitern, darunter «Regeln» («Rules»). Auf dem Handy lässt sich die Reihe seitlich schieben. Fehlen die Reiter, gibt es die Datenbank noch nicht: zurück zu Schritt 2.</p>
          </div></li>
          <li><div class="step">
            <strong>Web-App registrieren</strong>
            <p>In den Projekteinstellungen (Zahnrad) nach unten zu «Meine Apps» gehen («Your apps») und das Symbol <span class="m">${"</>"}</span> (Web) wählen. Einen Namen eingeben, «Firebase Hosting» nicht ankreuzen und «App registrieren» wählen («Register app»). Firebase zeigt jetzt einen Block, der mit <span class="m">const firebaseConfig = {</span> beginnt und mit <span class="m">};</span> endet. Kopiere diesen Block.</p>
            <a class="btn small" href=${consoleLink("settings/general")} target="_blank" rel="noopener noreferrer"><${Icon} n="arrow" s=${16} />Projekteinstellungen öffnen</a>
          </div></li>
          <li><div class="step">
            <strong>Block in config.js einsetzen</strong>
            <p>Auf GitHub die Datei config.js zum Bearbeiten öffnen (Stift-Symbol) und den Block <span class="m">const firebaseConfig = …;</span> durch den kopierten Block ersetzen. Sonst nichts ändern. Mit «Commit changes» speichern.</p>
            ${edit && html`<a class="btn small" href=${edit} target="_blank" rel="noopener noreferrer"><${Icon} n="arrow" s=${16} />config.js auf GitHub bearbeiten</a>`}
          </div></li>
          <li><div class="step">
            <strong>Prüfen</strong>
            <p>Ein bis zwei Minuten warten und den Home-Planer neu laden. Danach steht hier oben «eingeschaltet», und «Verbindung prüfen» sagt, ob noch etwas fehlt.</p>
            <button type="button" class="btn small" onClick=${() => location.reload()}><${Icon} n="refresh" s=${16} />Neu laden</button>
          </div></li>
        </ol>
        <div class="field">
          <span class="label">Danach</span>
          <p class="hint">Neue Haushalte werden automatisch für alle gespeichert. Im Haushalt auf «Einladen» tippen und den Link oder den QR-Code weitergeben: Wer ihn öffnet, ist dabei. Einen Haushalt, der schon auf diesem Gerät liegt, gibst du ebenfalls über «Einladen» frei.</p>
          <p class="hint">Die Werte in config.js sind keine Passwörter. Wer einen Haushalt sehen darf, bestimmt der Einladungslink: Gib ihn nur an die Leute, die bei euch wohnen.</p>
        </div>
      <//>`;
  }
  /* «Einladen» in a household that lives on this device only, with the group sync switched on: one tap moves it to the group. */
  function ShareSheet({ onPublish, onClose }) {
    const [busy, setBusy] = useState(false);
    const go = async () => { if (busy) return; setBusy(true); await onPublish(); setBusy(false); };
    return html`
      <${Sheet} title="Einladen" onClose=${onClose}>
        <p class="lead">Dieser Haushalt liegt bisher nur auf diesem Gerät. Gib ihn frei: Dann wird er laufend gemeinsam gespeichert, und du bekommst den Einladungslink.</p>
        <div class="foot"><button type="button" class="btn primary block" disabled=${busy} onClick=${go}><${Icon} n="people" s=${18} />${busy ? "Wird freigegeben …" : "Für alle im Haushalt freigeben"}</button></div>
        <p class="hint">Alle Einträge bleiben erhalten. Wer den Link öffnet, sieht den Haushalt und kann eintragen, ohne Konto und ohne Passwort.</p>
      <//>`;
  }

  function SettingsSheet({ onClose, onImported, onSetup, onInstall }) {
    const [err, setErr] = useState(null);
    const onFile = ev => {
      const file = ev.target.files && ev.target.files[0];
      ev.target.value = "";
      if (!file) return;
      const rd = new FileReader();
      rd.onload = () => {
        try { onImported(Store.importBackup(JSON.parse(String(rd.result)))); }
        catch (e) { setErr(e && e.code === "storage" ? FAIL.storage : "Diese Datei ist keine Sicherung des Home-Planers."); }
      };
      rd.onerror = () => setErr("Die Datei liess sich nicht lesen.");
      rd.readAsText(file);
    };
    return html`
      <${Sheet} title="Einstellungen" onClose=${onClose} closeLabel="Fertig" error=${err}>
        <div class="field">
          <span class="label">Gruppen-Sync</span>
          <p class="hint">${Store.cloudOn
            ? html`Eingeschaltet, Firebase-Projekt <span class="m">${Store.projectId}</span>. Neue Haushalte werden für alle synchronisiert. Einträge ohne Netz gehen nicht verloren, sie werden später gesendet.`
            : SYNC_TEXT[Store.configState] || SYNC_TEXT.off}</p>
          ${Store.cloudOn && html`<${CloudCheck} />`}
          <div><button type="button" class=${"btn small" + (Store.cloudOn ? " ghost" : "")} onClick=${onSetup}>${Store.cloudOn ? "Anleitung zum Einrichten" : "Gruppen-Sync einrichten"}</button></div>
        </div>
        <div class="field">
          <span class="label">Sicherung einlesen</span>
          <p class="hint">Eine heruntergeladene Sicherung wird als neuer Haushalt auf diesem Gerät angelegt.</p>
          <input id="hp-import" class="sr" type="file" accept="application/json,.json" onChange=${onFile} />
          <label class="btn" for="hp-import"><${Icon} n="upload" s=${18} />Datei wählen</label>
        </div>
        <div class="field">
          <span class="label">Als App aufs Handy</span>
          <p class="hint">Android: im Browser-Menü «App installieren». iPhone: in Safari auf «Teilen», dann «Zum Home-Bildschirm». Danach startet der Home-Planer wie eine App, auch ohne Netz.</p>
          <p class="hint">Auf dem iPhone beginnt die App vom Home-Bildschirm mit leerem Speicher. Geteilte Haushalte holst du mit dem Einladungslink über «Mit Link beitreten» dazu.</p>
          ${!isStandalone() && html`<div><button type="button" class="btn small" onClick=${onInstall}>Anleitung zum Installieren</button></div>`}
        </div>
      <//>`;
  }

  /* ---------- new household ---------- */
  function HomeNew({ act, onClose, onCreated }) {
    const [name, setName] = useState("");
    const [base, setBase] = useState("CHF");
    const [people, setPeople] = useState([]);
    const [draft, setDraft] = useState("");
    const [me, setMe] = useState(null);
    const [err, setErr] = useState(null);
    const [busy, setBusy] = useState(false);
    const addRef = useRef(null), lock = useRef(false);
    const withDraft = () => {
      const n = draft.trim();
      if (!n || people.some(p => p.name.toLowerCase() === n.toLowerCase())) return people;
      return people.concat({ k: Store.randomId(8, "m"), name: n, a: HP.pickAvatar(people.map(p => p.a)) });
    };
    const reroll = () => { const used = []; setPeople(people.map(p => { const a = HP.pickAvatar(used); used.push(a); return Object.assign({}, p, { a }); })); };
    const add = () => {
      const n = draft.trim();
      if (!n) return;
      if (people.some(p => p.name.toLowerCase() === n.toLowerCase())) { setErr("«" + n + "» ist schon dabei. Nimm bei gleichen Namen einen Zusatz, zum Beispiel den ersten Buchstaben des Nachnamens."); return; }
      const next = withDraft();
      setPeople(next); setDraft(""); setErr(null);
      if (!me) setMe(next[next.length - 1].k);
      if (addRef.current) addRef.current.focus();
    };
    const create = async () => {
      if (lock.current) return;
      const list = withDraft();
      if (!name.trim()) { setErr("Gib dem Haushalt einen Namen."); return; }
      if (list.length < 1) { setErr("Trag mindestens eine Person ein, am besten dich selbst."); return; }
      const mine = me && list.some(p => p.k === me) ? me : list.length === 1 ? list[0].k : null;
      const members = {};
      list.forEach((p, i) => { members[p.k] = { name: p.name, c: i % 8, o: i, gone: false, a: p.a }; });
      lock.current = true; setBusy(true);
      const r = await act.createHome({ name: name.trim(), base, rates: {}, members, created: Date.now() });
      lock.current = false; setBusy(false);
      if (r) onCreated(r.id, mine, r.note);
    };
    return html`
      <${Sheet} title="Neuer Haushalt" onClose=${onClose} error=${err} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${create}>Anlegen</button>`}>
        <div class="field">
          <label for="hp-home-name">Name des Haushalts</label>
          <input id="hp-home-name" class="input" maxlength="60" placeholder="z. B. WG Seefeld, Familie Muster" value=${name} onInput=${e => { setName(e.target.value); setErr(null); }} data-autofocus="" />
        </div>
        <div class="field">
          <label for="hp-home-person">Wer wohnt hier?</label>
          <div class="inline">
            <input id="hp-home-person" class="input" maxlength="30" placeholder="Vorname" value=${draft} ref=${addRef}
              onInput=${e => { setDraft(e.target.value); setErr(null); }} onKeyDown=${e => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
            <button type="button" class="btn" onClick=${add}>Hinzufügen</button>
          </div>
          ${people.length > 0 && html`
            <div class="chips">${people.map((p, i) => html`
              <span key=${p.k} class="chip static"><${Av} m=${{ name: p.name, c: i, a: p.a }} s=${1} />${p.name}
                <button type="button" class="rm" aria-label=${p.name + " entfernen"} onClick=${() => { setPeople(people.filter(x => x.k !== p.k)); if (me === p.k) setMe(null); }}><${Icon} n="close" s=${14} /></button>
              </span>`)}
            </div>`}
          ${people.length > 0 && html`<div><button type="button" class="btn small" onClick=${reroll}><span class="emo" aria-hidden="true">🎲</span>Avatare neu würfeln</button></div>`}
          <p class="hint">Trag auch dich selbst ein. Später kommen jederzeit weitere Personen dazu, und jede Person wählt ihren Avatar selbst.</p>
        </div>
        ${people.length > 1 && html`
          <div class="field">
            <span class="label" id="hp-home-me">Wer davon bist du?</span>
            <div class="chips" role="radiogroup" aria-labelledby="hp-home-me">${people.map((p, i) => html`
              <button type="button" key=${p.k} role="radio" aria-checked=${String(me === p.k)} class="chip" onClick=${() => setMe(p.k)}><${Av} m=${{ name: p.name, c: i, a: p.a }} s=${1} />${p.name}</button>`)}
            </div>
          </div>`}
        <div class="field">
          <label for="hp-home-base">Währung der Kasse</label>
          <${CurSelect} id="hp-home-base" value=${base} onChange=${setBase} label="Hauptwährung" />
          <p class="hint">In dieser Währung rechnet ihr ab. Ausgaben in anderen Währungen, etwa ein Einkauf in Konstanz, werden zum Tageskurs umgerechnet.</p>
        </div>
        <div class="field">
          <span class="label">Wo wird gespeichert?</span>
          <p class="hint">${Store.cloudOn ? "Im Gruppen-Sync: Nach dem Anlegen lädst du die anderen mit einem Link ein, und alle tragen selbst ein." : "Nur auf diesem Gerät, weil noch kein Gruppen-Sync eingeschaltet ist. Du kannst den Haushalt später freigeben."}</p>
        </div>
        <div class="foot"><button type="button" class="btn primary block" disabled=${busy} onClick=${create}>Haushalt anlegen</button></div>
      <//>`;
  }

  /* ---------- household settings ---------- */
  function HomeEdit({ home, mode, cols, loading, meId, setMe, act, onClose, onDelete, onLeave, onPublish, onAvatar }) {
    const all = membersOf(home, true), ms = all.filter(m => !m.gone);
    const list = cols.expenses || [];
    const [name, setName] = useState(home.name || "");
    const [names, setNames] = useState({});
    const [draft, setDraft] = useState("");
    const [err, setErr] = useState(null);
    const [busy, setBusy] = useState(false);
    const used = useMemo(() => { const u = {}; list.forEach(e => refsOf(e).forEach(id => { u[id] = (u[id] || 0) + 1; })); return u; }, [list]);
    const saveName = () => { const n = name.trim(); if (n && n !== home.name) act.patchHome(home.id, { name: n }); else setName(home.name || ""); };
    const saveMember = m => {
      const n = (names[m.id] == null ? m.name : names[m.id]).trim();
      if (!n) { setNames(Object.assign({}, names, { [m.id]: m.name })); return; }
      if (n !== m.name) act.patchHome(home.id, { members: { [m.id]: { name: n } } });
    };
    const add = () => {
      const n = draft.trim();
      if (!n) return;
      if (ms.some(m => m.name.toLowerCase() === n.toLowerCase())) { setErr("«" + n + "» ist schon dabei. Nimm bei gleichen Namen einen Zusatz."); return; }
      const o = all.reduce((x, m) => Math.max(x, m.o), -1) + 1;
      act.patchHome(home.id, { members: { [Store.randomId(8, "m")]: { name: n, c: all.length % 8, o, gone: false, a: HP.pickAvatar(all.map(m => m.a)) } } });
      setDraft(""); setErr(null);
    };
    const remove = m => {
      if (loading) { setErr("Die Einträge werden noch geladen. Versuch es gleich nochmal."); return; }
      if (used[m.id]) { setErr(m.name + " steht in " + used[m.id] + (used[m.id] === 1 ? " Buchung" : " Buchungen") + " der Kasse und kann deshalb nicht entfernt werden. Ändere oder lösche zuerst diese Buchungen."); return; }
      if (ms.length <= 1) { setErr("Ein Haushalt braucht mindestens eine Person."); return; }
      setErr(null);
      act.patchHome(home.id, { members: { [m.id]: { gone: true } } });
    };
    const backup = () => {
      const no = () => setErr("Die Sicherung liess sich nicht erstellen.");
      try { Store.download(fileName(home.name), Store.backup(home, cols)).catch(no); } catch (e) { no(); }
    };
    const publish = async () => { if (busy) return; setBusy(true); setErr(null); await onPublish(); setBusy(false); };
    return html`
      <${Sheet} title="Haushalt" onClose=${onClose} closeLabel="Fertig" error=${err}>
        <div class="field">
          <label for="hp-set-name">Name des Haushalts</label>
          <input id="hp-set-name" class="input" maxlength="60" value=${name} onInput=${e => setName(e.target.value)} onBlur=${saveName} />
        </div>
        <div class="field">
          <span class="label">Wer wohnt hier?</span>
          <div class="rows">${ms.map(m => html`
            <div class="row" key=${m.id}>
              <button type="button" class="av-btn" aria-label=${"Avatar von " + m.name + " ändern"} onClick=${() => onAvatar(m.id)}><${Av} m=${m} /></button>
              <input id=${"hp-set-m-" + m.id} class="input name" maxlength="30" aria-label=${"Name von " + m.name} value=${names[m.id] == null ? m.name : names[m.id]}
                onInput=${e => setNames(Object.assign({}, names, { [m.id]: e.target.value }))} onBlur=${() => saveMember(m)} />
              <button type="button" class="chip" aria-pressed=${String(meId === m.id)} onClick=${() => setMe(m.id)}>${meId === m.id ? "Das bin ich" : "Ich"}</button>
              <button type="button" class="icon-btn" aria-label=${m.name + " entfernen"} onClick=${() => remove(m)}><${Icon} n="close" s=${18} /></button>
            </div>`)}
          </div>
          <div class="inline">
            <input id="hp-set-add" class="input" maxlength="30" placeholder="Weitere Person" value=${draft} onInput=${e => { setDraft(e.target.value); setErr(null); }}
              onKeyDown=${e => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
            <button type="button" class="btn" onClick=${add}>Hinzufügen</button>
          </div>
          <p class="hint">Tippe auf ein Bild, um den Avatar zu ändern. «Ich» merkt sich nur dieses Gerät.</p>
        </div>
        <div class="field">
          <span class="label">Küche</span>
          <label class="check"><input id="hp-set-gf" type="checkbox" checked=${!!home.gf} onChange=${e => act.patchHome(home.id, { gf: e.target.checked })} /><span>Bei uns wird glutenfrei gekocht</span></label>
          <p class="hint">Dann zeigen Würfel und Menü-Finder zuerst glutenfreie Rezepte, jedes Rezept nennt den glutenfreien Ersatz (etwa Tamari statt Sojasauce), und auf der Einkaufsliste steht dabei «glutenfrei».</p>
        </div>
        <div class="field">
          <label for="hp-set-base">Währung der Kasse</label>
          <${CurSelect} id="hp-set-base" value=${home.base} home=${home} label="Hauptwährung" disabled=${loading || list.length > 0} onChange=${c => { if (!loading && !list.length && c && c !== home.base) act.patchHome(home.id, { base: c }); }} />
          ${list.length > 0 && html`<p class="hint">Die Währung bleibt, sobald Buchungen erfasst sind. Sonst würden alle Kurse nicht mehr stimmen.</p>`}
        </div>
        <div class="field">
          <span class="label">Daten</span>
          <p class="hint">${mode === "cloud"
            ? "Dieser Haushalt wird für alle synchronisiert. Eine Sicherung als Datei schadet trotzdem nicht."
            : "Dieser Haushalt liegt nur auf diesem Gerät. Löscht der Browser seinen Speicher, ist er weg. Lade deshalb ab und zu eine Sicherung herunter."}</p>
          <div class="btn-row">
            <button type="button" class="btn small" disabled=${!!loading} onClick=${backup}><${Icon} n="download" s=${16} />Sicherung herunterladen</button>
            ${mode === "local" && Store.cloudOn && html`<button type="button" class="btn small" disabled=${busy} onClick=${publish}><${Icon} n="people" s=${16} />${busy ? "Wird freigegeben …" : "Für alle freigeben"}</button>`}
          </div>
        </div>
        <div class="foot">
          ${mode === "cloud" && html`
            <button type="button" class="btn block" onClick=${onLeave}>Von diesem Gerät entfernen</button>
            <p class="meta">Für die anderen bleibt der Haushalt bestehen. Mit dem Einladungslink kommst du wieder dazu.</p>`}
          <${DeleteButton} label=${mode === "cloud" ? "Haushalt für alle löschen" : "Haushalt löschen"} onConfirm=${onDelete} disabled=${!!loading} />
          <p class="meta">Löschen entfernt den Haushalt mit Kasse, Einkaufsliste, Rezepten, Kalender, Pflanzen und Infos${mode === "cloud" ? ", für alle" : ""}.</p>
        </div>
      <//>`;
  }

  /* ---------- avatar ---------- */
  /* An emoji and one of eight colours. The choice is part of the household, so everybody sees it. */
  function AvatarSheet({ home, member, isMe, act, onClose, say }) {
    const [a, setA] = useState(member.a);
    const [c, setC] = useState((member.c || 0) % 8);
    const [busy, setBusy] = useState(false);
    const lock = useRef(false);
    const taken = useMemo(() => membersOf(home).filter(m => m.id !== member.id).map(m => m.a), [home, member.id]);
    const cur = HP.avatar(a);
    const dice = () => { setA(HP.pickAvatar(taken.concat(a))); setC(Math.floor(Math.random() * 8)); };
    const save = async () => {
      if (lock.current) return;
      lock.current = true; setBusy(true);
      const ok = await act.patchHome(home.id, { members: { [member.id]: { a, c } } });
      lock.current = false; setBusy(false);
      if (ok) { onClose(); say(isMe ? "Avatar gespeichert. Steht dir." : "Avatar gespeichert."); }
    };
    return html`
      <${Sheet} title=${isMe ? "Dein Avatar" : "Avatar von " + member.name} onClose=${onClose} action=${html`<button type="button" class="btn primary small" disabled=${busy} onClick=${save}>Speichern</button>`}>
        <div class="av-stage">
          <${Av} m=${{ name: member.name, c, a }} s=${3} />
          <strong>${member.name}</strong>
          <span class="hint" aria-live="polite">${cur ? cur.label : ""}</span>
          <button type="button" class="btn small" onClick=${dice}><span class="emo" aria-hidden="true">🎲</span>Würfeln</button>
        </div>
        <div class="field">
          <span class="label" id="hp-av-c">Farbe</span>
          <div class="swatches" role="radiogroup" aria-labelledby="hp-av-c">${COLOR_NAMES.map((name, i) => html`
            <button type="button" key=${i} role="radio" aria-checked=${String(c === i)} aria-label=${name} title=${name} class=${"swatch c" + (i + 1)} onClick=${() => setC(i)}></button>`)}
          </div>
        </div>
        ${HP.AVATARS.map((g, gi) => html`
          <div class="field" key=${g.title}>
            <span class="label" id=${"hp-av-g" + gi}>${g.title}</span>
            <div class="av-grid" role="radiogroup" aria-labelledby=${"hp-av-g" + gi}>${g.items.map(it => html`
              <button type="button" key=${it[0]} role="radio" aria-checked=${String(a === it[0])} aria-label=${it[2] + (taken.indexOf(it[0]) >= 0 ? " (schon vergeben)" : "")} title=${it[2]}
                class=${"av-pick" + (taken.indexOf(it[0]) >= 0 ? " taken" : "")} onClick=${() => setA(it[0])}>${it[1]}</button>`)}
            </div>
          </div>`)}
        <p class="hint">Blasse Bilder hat schon jemand aus dem Haushalt. Nehmen darfst du sie trotzdem.</p>
        <div class="foot"><button type="button" class="btn primary block" disabled=${busy} onClick=${save}>Speichern</button></div>
      <//>`;
  }

  /* ---------- the overview: today, the next days, the shopping list ---------- */
  function Overview({ ctx, onTab, pick, setPick, setMe }) {
    const { home, data, meId, members, open } = ctx;
    const today = HP.today();
    const bal = useMemo(() => HP.balances(home, data.expenses || []), [home, data.expenses]);
    const my = meId && bal.per[meId] ? bal.per[meId].net : null, base = home.base;
    const meM = meId ? members.find(m => m.id === meId) || null : null;
    const openItems = (data.shopping || []).filter(it => !it.done);
    const occ = useMemo(() => HP.occurrences(data.events || [], today, HP.addDays(today, 7)), [data.events, today]);
    const plants = useMemo(() => (data.plants || []).map(p => ({ p, due: HP.plantDue(p, today) })).sort((a, b) => a.due.days - b.due.days || a.p.name.localeCompare(b.p.name, "de")), [data.plants, today]);
    const deadlines = useMemo(() => (data.infos || []).map(i => ({ i, n: HP.dueOf(i, today) })).filter(x => x.n != null && x.n >= -3 && x.n <= 60).sort((a, b) => a.n - b.n), [data.infos, today]);
    const nowEv = occ.filter(o => o.date === today), soonEv = occ.filter(o => o.date > today && (o.first || o.date === HP.addDays(today, 1)));
    const thirsty = plants.filter(x => x.due.days <= 0), soonPl = plants.filter(x => x.due.days > 0 && x.due.days <= 2);
    /* In den ersten zehn Tagen eines Monats: Ist der Vormonat bei den Einkäufen noch offen, steht es hier. */
    const lastMonth = useMemo(() => {
      if (+today.slice(8, 10) > 10 || members.length < 2) return null;
      const y = +today.slice(0, 4), m = +today.slice(5, 7) - 1, ym = m < 1 ? (y - 1) + "-12" : y + "-" + HP.pad(m);
      const r = HP.monthReport(home, data.expenses || [], ym, "shop");
      return r.open ? r : null;
    }, [home, data.expenses, today, members.length]);
    const urgent = deadlines.filter(x => x.n <= 7), later = deadlines.filter(x => x.n > 7);
    const loading = COLS.some(c => data[c] === null);
    const plantRow = ({ p, due }) => {
      const st = U.plantStatus(p, today);
      return html`
        <div class="x row-act" key=${p.id}>
          <button type="button" class="x-in" onClick=${() => open({ t: "plant", p })}>
            <span class="x-ic k-household" aria-hidden="true">${HP.plantEmoji(p.emoji)}</span>
            <span class="x-main"><span class="x-t">${p.name}</span><span class=${"x-s plant-st " + st.cls}>${due.days > 0 ? (due.days === 1 ? "Morgen giessen" : "Übermorgen giessen") : st.text}${p.room ? " · " + p.room : ""}</span></span>
          </button>
          ${due.days <= 0 && html`<${U.WaterButton} ctx=${ctx} p=${p} small=${true} />`}
        </div>`;
    };
    const dlRow = ({ i, n }) => html`
      <button type="button" key=${i.id} class="x" onClick=${() => open({ t: "info", info: i })}>
        <span class=${"x-ic " + (n <= 14 ? "k-late" : "in-" + i.cat)} aria-hidden="true">⏰</span>
        <span class="x-main"><span class="x-t">${i.title}</span><span class="x-s">${(i.dueNote || "Frist") + " · " + HP.fmtDate(i.due, { day: "numeric", month: "short" })}</span></span>
        <span class=${"x-a" + (n <= 14 ? " neg" : "")}><span>${HP.relDays(n)}</span></span>
      </button>`;
    const nToday = nowEv.length + thirsty.length + urgent.length;
    /* No meal planned for today: an idea from the recipes, the same all day. */
    const idea = useMemo(() => (nowEv.some(o => o.e.cat === "meal") ? null : U.dailyIdea(ctx)), [nowEv, data.recipes, home.id]);
    return html`
      <section class="ticket">
        <div class="ticket-main">
          <span class="eyebrow">Haushalt</span>
          <h1>${home.name}</h1>
          <div class="ticket-meta">
            <span>${HP.longDay(today)} · ${members.length === 1 ? "1 Person" : members.length + " Personen"}</span>
            <span class="avs" aria-hidden="true">${members.slice(0, 8).map(m => html`<${Av} key=${m.id} m=${m} s=${1} />`)}</span>
          </div>
        </div>
        ${meM
          ? html`<button type="button" class="me" aria-label=${meM.chosen ? "Deinen Avatar ändern" : "Deinen Avatar wählen"} onClick=${() => open({ t: "avatar", m: meM.id })}><${Av} m=${meM} s=${2} /><span class="pen" aria-hidden="true"><${Icon} n="pen" s=${15} /></span></button>`
          : html`<button type="button" class="me" aria-label="Zuerst deinen Namen wählen" aria-expanded=${String(pick)} onClick=${() => setPick(!pick)}><span class="ask" aria-hidden="true">?</span></button>`}
        <div class="ticket-stub">
          <button type="button" class="cell link" onClick=${() => onTab("kasse")}>
            <span class="eyebrow">Mein Saldo ${base}</span>
            ${my != null
              ? html`<span class=${"fig " + (my > 0 ? "pos" : my < 0 ? "neg" : "")}>${HP.signed(my, base)}</span><span class="fig-note">${my > 0 ? "du bekommst Geld" : my < 0 ? "du schuldest Geld" : "du bist quitt"}</span>`
              : html`<span class="fig">–</span><span class="fig-note">${meId ? "" : "wähle, wer du bist"}</span>`}
          </button>
          <button type="button" class="cell link" onClick=${() => onTab("shop")}>
            <span class="eyebrow">Einkaufsliste</span>
            <span class="fig">${data.shopping ? openItems.length : "–"}</span>
            <span class="fig-note">Artikel offen</span>
          </button>
        </div>
      </section>
      ${pick && !meId && html`
        <section class="who">
          <span class="label" id="hp-who-l">Tippe auf deinen Namen</span>
          <div class="chips" role="radiogroup" aria-labelledby="hp-who-l">${members.map(m => html`
            <button type="button" key=${m.id} role="radio" aria-checked="false" class="chip" onClick=${() => { setMe(m.id); setPick(false); open({ t: "avatar", m: m.id }); }}><${Av} m=${m} s=${1} />${m.name}</button>`)}
          </div>
        </section>`}
      ${lastMonth && html`
        <button type="button" class="book-coll month-card" onClick=${() => open({ t: "month", ym: lastMonth.ym, scope: "shop" })}>
          <span class="book-e" aria-hidden="true">🧾</span>
          <span class="x-main"><span class="x-t">Abrechnung ${HP.monthLabel(lastMonth.ym)}</span><span class="x-s">Einkäufe ${HP.money(lastMonth.total, base)} · ${lastMonth.open === 1 ? "1 Zahlung offen" : lastMonth.open + " Zahlungen offen"}</span></span>
          <${Icon} n="next" s=${18} />
        </button>`}
      <section class="panel">
        <div class="panel-head"><h2 class="sec-h">Heute</h2>${nToday > 0 && html`<span class="pill">${nToday}</span>`}</div>
        ${nToday === 0
          ? html`<p class="calm"><span class="emo" aria-hidden="true">🌤️</span>${loading ? "Wird geladen …" : plants.length ? "Heute steht nichts an, und alle Pflanzen haben Wasser." : "Heute steht nichts an."}</p>`
          : html`<div class="list flat">
              ${nowEv.map(o => html`<${U.EventRow} key=${o.e.id + o.date} o=${o} ctx=${ctx} />`)}
              ${thirsty.map(plantRow)}
              ${urgent.map(dlRow)}
            </div>`}
      </section>
      ${idea && html`
        <section class="panel">
          <div class="panel-head"><h2 class="sec-h">Kochidee für heute</h2><span class="btn-row tight"><button type="button" class="btn ghost small" aria-label="Kühlschrank: Ich habe noch …" onClick=${() => open({ t: "fridge" })}><span class="emo" aria-hidden="true">🧊</span></button><button type="button" class="btn ghost small" onClick=${() => open({ t: "finder" })}><span class="emo" aria-hidden="true">🔮</span>Menü-Finder</button></span></div>
          <div class="list flat">
            <div class="x row-act">
              <button type="button" class="x-in" onClick=${() => open({ t: "recipe", id: idea.id })}>
                <span class=${"x-ic rc-" + idea.cat} aria-hidden="true">${HP.dishEmoji(idea.emoji)}</span>
                <span class="x-main"><span class="x-t">${idea.title}</span><span class="x-s">${U.recipeMeta(idea)}</span></span>
              </button>
              <button type="button" class="btn small" onClick=${() => open({ t: "meal", rid: idea.id })}>Einplanen</button>
            </div>
          </div>
        </section>`}
      ${(soonEv.length > 0 || soonPl.length > 0 || later.length > 0) && html`
        <section class="panel">
          <div class="panel-head"><h2 class="sec-h">Nächste Tage</h2><button type="button" class="btn ghost small" onClick=${() => onTab("cal")}>Kalender<${Icon} n="next" s=${16} /></button></div>
          <div class="list flat">
            ${soonEv.slice(0, 8).map(o => html`<${U.EventRow} key=${o.e.id + o.date} o=${o} ctx=${ctx} showDate=${true} />`)}
            ${soonPl.map(plantRow)}
            ${later.slice(0, 4).map(dlRow)}
          </div>
        </section>`}
      <section class="panel">
        <div class="panel-head"><h2 class="sec-h">Einkaufsliste</h2><button type="button" class="btn ghost small" onClick=${() => onTab("shop")}>Ganze Liste<${Icon} n="next" s=${16} /></button></div>
        <${U.ShopQuickAdd} ctx=${ctx} compact=${true} />
        ${openItems.length > 0
          ? html`<div class="chips">${openItems.slice(0, 12).map(it => html`<span key=${it.id} class="chip static"><span class="emo" aria-hidden="true">${HP.shopSec(it.sec).emoji}</span>${it.name}${it.qty ? " · " + it.qty : ""}</span>`)}${openItems.length > 12 && html`<span class="chip static">+${openItems.length - 12}</span>`}</div>`
          : data.shopping && html`<p>Nichts offen. Schreib oben hinein, was fehlt.</p>`}
      </section>
      <section class="panel">
        <div class="panel-head"><h2 class="sec-h">Schnell erfassen</h2></div>
        <div class="quick-grid">
          <button type="button" class="qa" onClick=${() => open({ t: "expense" })}><span class="emo" aria-hidden="true">💸</span>Ausgabe</button>
          <button type="button" class="qa" onClick=${() => open({ t: "recipe-edit" })}><span class="emo" aria-hidden="true">🍳</span>Rezept</button>
          <button type="button" class="qa" onClick=${() => open({ t: "event", date: today })}><span class="emo" aria-hidden="true">📅</span>Termin</button>
          <button type="button" class="qa" onClick=${() => open({ t: "plant" })}><span class="emo" aria-hidden="true">🪴</span>Pflanze</button>
          <button type="button" class="qa" onClick=${() => open({ t: "info-edit" })}><span class="emo" aria-hidden="true">📁</span>Info</button>
        </div>
      </section>`;
  }

  /* ---------- a household ---------- */
  const TABS = [["home", "Start", "🏠"], ["kasse", "Kasse", "💰"], ["shop", "Einkauf", "🛒"], ["recipes", "Rezepte", "🍳"], ["cal", "Kalender", "📅"], ["plants", "Pflanzen", "🪴"], ["infos", "Infos", "📁"]];
  const FAB = { kasse: ["Ausgabe", { t: "expense" }], recipes: ["Rezept", { t: "recipe-edit" }], cal: ["Termin", null], plants: ["Pflanze", { t: "plant" }], infos: ["Eintrag", { t: "info-edit" }] };
  function HomeView({ ctx, tab, setTab, kview, setKview, onBack, setMe, note }) {
    const { data, open } = ctx;
    const [pick, setPick] = useState(false);
    const today = HP.today();
    const badge = {
      shop: (data.shopping || []).filter(it => !it.done).length,
      plants: (data.plants || []).filter(p => HP.plantDue(p, today).days <= 0).length
    };
    /* The bar at the bottom works like in a phone app: every view starts at its top. */
    const pickTab = id => { if (id !== tab) setTab(id); try { window.scrollTo(0, 0); } catch (e) { /* nothing to scroll */ } };
    const fab = FAB[tab];
    return html`
      <div class="top">
        <button type="button" class="back" onClick=${onBack}><${Icon} n="back" />Haushalte</button>
        <span class="top-actions">
          <button type="button" class="btn small" onClick=${() => open({ t: "invite" })}><${Icon} n="share" s=${16} />Einladen</button>
          <button type="button" class="icon-btn" aria-label="Haushalt bearbeiten" onClick=${() => open({ t: "home-edit" })}><${Icon} n="sliders" s=${22} /></button>
        </span>
      </div>
      ${note}
      ${tab === "home" && html`<${InstallHint} slim onHow=${() => open({ t: "install" })} />`}
      <div class="tabs" role="tablist" aria-label="Bereiche">${TABS.map(([id, label, icon]) => html`
        <button type="button" key=${id} role="tab" id=${"hp-tab-" + id} aria-selected=${String(tab === id)} class="tab" onClick=${() => pickTab(id)}>
          <span class="tab-e" aria-hidden="true"><span class="tab-i">${icon}</span>${badge[id] > 0 && html`<span class="badge">${badge[id] > 99 ? "99+" : badge[id]}</span>`}</span>
          <span>${label}</span>${badge[id] > 0 && html`<span class="sr">${", " + badge[id] + (id === "shop" ? " offen" : " durstig")}</span>`}
        </button>`)}
      </div>
      <div class="stack" role="tabpanel" aria-labelledby=${"hp-tab-" + tab} style="gap:16px">
        ${tab === "home" && html`<${Overview} ctx=${ctx} onTab=${pickTab} pick=${pick} setPick=${setPick} setMe=${setMe} />`}
        ${tab === "kasse" && html`<${U.Kasse} ctx=${ctx} view=${kview} setView=${setKview} />`}
        ${tab === "shop" && html`<${U.Shopping} ctx=${ctx} />`}
        ${tab === "recipes" && html`<${U.Recipes} ctx=${ctx} />`}
        ${tab === "cal" && html`<${U.Calendar} ctx=${ctx} />`}
        ${tab === "plants" && html`<${U.Plants} ctx=${ctx} />`}
        ${tab === "infos" && html`<${U.Infos} ctx=${ctx} />`}
      </div>
      ${fab && html`<button type="button" class="fab" onClick=${() => open(fab[1] || { t: "event", date: today })}><${Icon} n="plus" s=${22} />${fab[0]}</button>`}
    `;
  }

  /* ---------- app ---------- */
  /* Why a shared household cannot be shown, by the answer of the sync server. */
  const GATE = { "permission-denied": "denied", unconfigured: "unconfigured", "setup-db": "setup-db", "invalid-argument": "setup", unauthenticated: "setup", "failed-precondition": "setup", "resource-exhausted": "quota" };
  /* What is wrong with the group sync, in one line above the household. */
  const TROUBLE = {
    "permission-denied": "Der Gruppen-Sync lehnt den Zugriff ab. In Firebase fehlen vermutlich die Sicherheitsregeln des Home-Planers (README, Abschnitt «Gruppen-Sync einrichten»).",
    "setup-db": "Im Firebase-Projekt gibt es noch keine Firestore-Datenbank (README, Abschnitt «Gruppen-Sync einrichten»).",
    "resource-exhausted": "Das kostenlose Tageskontingent von Firebase ist aufgebraucht. Am Morgen wird es wieder frei.",
    "invalid-argument": "Firebase lehnt die Angaben aus config.js ab. Prüf sie auf der Startseite in den Einstellungen mit «Verbindung prüfen».",
    internal: "Beim Gruppen-Sync ist etwas durcheinandergeraten. Lade die Seite neu."
  };
  TROUBLE.unauthenticated = TROUBLE["failed-precondition"] = TROUBLE["invalid-argument"];
  const HOME_URL = location.pathname + location.search;
  /* What another app shared with the Home-Planer (see sw.js): read once, then thrown away. Older than ten minutes: ignored. */
  async function takeShared() {
    try {
      if (!window.caches) return null;
      const cache = await caches.open("hp-share"), m = await cache.match("shared/meta");
      if (!m) return null;
      const meta = await m.json(), files = [];
      for (let i = 0; i < Math.min(8, meta.n || 0); i++) {
        const r = await cache.match("shared/" + i);
        if (r) { const b = await r.blob(); files.push(new File([b], "screenshot-" + (i + 1) + ".png", { type: b.type || "image/png" })); }
      }
      await caches.delete("hp-share");
      return Date.now() - (meta.at || 0) < 600000 ? { title: meta.title || "", text: meta.text || "", url: meta.url || "", files } : null;
    } catch (e) { return null; }
  }
  const historyState = () => { try { return history.state || null; } catch (e) { return null; } };
  /* The address always names the open household, so the page can be bookmarked and the back button works.
     A household opened on top of the list is marked ("over"): leaving it is then one step back, and no dead entries pile up. */
  function setUrl(id, push) {
    try {
      if (!id) history.replaceState({ hp: "list" }, "", HOME_URL);
      else if (push) history.pushState({ hp: "home", over: true }, "", "#" + id);
      else { const st = historyState(); history.replaceState({ hp: "home", over: !!(st && st.hp === "home" && st.over && location.hash === "#" + id) }, "", "#" + id); }
    } catch (e) { /* the address is a convenience */ }
  }

  function App() {
    const [reg, setReg] = useState(() => Store.registry.list());
    const [homeId, setHomeId] = useState(null);
    /* What the store reported, and for which household. raw: undefined = loading, null = gone, a string = why it cannot be shown,
       an object = the household. cols: the entries of each part, null while loading. */
    const [live, setLive] = useState({ id: null, raw: undefined, cols: emptyCols() });
    const [sync, setSync] = useState({ pending: false, cached: false });
    const [online, setOnline] = useState(() => navigator.onLine !== false);
    const [stuck, setStuck] = useState(false);
    const [slow, setSlow] = useState(false);             // online, but the sync server has not confirmed the shown data for a while
    const [trouble, setTrouble] = useState(null);        // the server's reason when the sync does not work although the device is online
    const [tab, setTab] = useState("home");
    const [kview, setKview] = useState("list");
    const [sheet, setSheet] = useState(null);
    const [toast, setToast] = useState(null);
    const [meMap, setMeMap] = useState(() => ls.get("hp.me", {}));
    const sheetRef = useRef(null), homeRef = useRef(null), leaving = useRef(false), pendingShare = useRef(null);
    sheetRef.current = sheet; homeRef.current = homeId;
    const say = useCallback((msg, kind) => setToast({ msg, kind: kind || "ok", k: Date.now() }), []);
    const refreshReg = useCallback(() => setReg(Store.registry.list()), []);

    const entry = useMemo(() => reg.find(e => e.id === homeId) || null, [reg, homeId]);
    const mode = entry ? entry.mode : null;
    const raw = live.id === homeId ? live.raw : undefined, cols = live.id === homeId ? live.cols : NO_COLS;

    const showHome = useCallback((id, push) => {
      setHomeId(id); setTab("home"); setKview("list"); setSheet(null); setTrouble(null);
      ls.set("hp.last", id || "");
      if (id) { Store.registry.touch(id); setReg(Store.registry.list()); }
      const st = historyState();
      if (id && push && st && st.hp === "sheet") {                    // from a sheet on the start page: the household takes the sheet's place
        try { history.replaceState({ hp: "home", over: true }, "", "#" + id); } catch (e) { /* the address is a convenience */ }
      } else setUrl(id, push);
      try { window.scrollTo(0, 0); } catch (e) { /* nothing to scroll */ }
    }, []);
    const goList = useCallback(() => {
      setHomeId(null); setTab("home"); setSheet(null); setTrouble(null);
      sheetRef.current = null; homeRef.current = null;
      ls.set("hp.last", "");
      try { window.scrollTo(0, 0); } catch (e) { /* nothing to scroll */ }
      const st = historyState();
      if (st && st.hp === "home" && st.over) {
        leaving.current = true; setTimeout(() => { leaving.current = false; }, 1000);
        try { history.back(); return; } catch (e) { leaving.current = false; }
      }
      setUrl(null);
    }, []);
    const join = useCallback((id, push) => {
      if (!Store.registry.get(id)) {
        if (!Store.cloudOn) { say("Dieser Link gehört zu einem geteilten Haushalt. " + FAIL.unconfigured, "err"); return false; }
        Store.registry.put({ id, name: "", mode: "cloud" });
      }
      showHome(id, push);
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) { /* optional */ }
      return true;
    }, [say, showHome]);

    useEffect(() => {
      const hashId = () => { try { return (location.hash || "").replace(/^#/, ""); } catch (e) { return ""; } };
      const h = hashId(), sharing = h === "teilen";
      let start = null;
      if (h && Store.validId(h)) start = h;
      else {
        const last = ls.get("hp.last", null), list = Store.registry.list();
        if (last && list.some(e => e.id === last)) start = last;
        else if (list.length === 1 && last !== "") start = list[0].id;
      }
      if (start) {
        /* The list always lies beneath the first household, so "back" leads to the list instead of out of the app. */
        const st = historyState(), kept = !!(st && st.hp === "home" && st.over && h === start);
        if (!kept) setUrl(null);
        if (!join(start, !kept)) setUrl(null);
      } else setUrl(null);
      const receive = () => takeShared().then(p => {
        if (!p) return;
        if (!homeRef.current) {
          /* several households and none open: the recipe waits until one is chosen */
          if (Store.registry.list().length) { pendingShare.current = p; say("Wähl den Haushalt, in den das Rezept soll."); return; }
          say("Leg zuerst einen Haushalt an. Dann teil das Rezept nochmals mit dem Home-Planer.", "err"); return;
        }
        setTimeout(() => { setTab("recipes"); open({ t: "import", shared: p }); }, 0);
      });
      if (sharing) receive();
      const onHash = () => {
        const x = hashId();
        if (x === "teilen") { if (homeRef.current) setUrl(homeRef.current); else setUrl(null); receive(); return; }
        if (leaving.current) { leaving.current = false; if (x) setUrl(null); return; }      // arrived beneath the household after "Haushalte"
        if (x && Store.validId(x)) { if (x !== homeRef.current) join(x, false); return; }
        if (sheetRef.current && homeRef.current) {                                         // "back" closes an open sheet first and stays in the household
          setUrl(homeRef.current, true); setSheet(null); return;
        }
        if (sheetRef.current) { setSheet(null); return; }                                  // the same on the start page
        setHomeId(null); setSheet(null); setTrouble(null); ls.set("hp.last", "");
      };
      const on = () => setOnline(true), off = () => setOnline(false);
      window.addEventListener("hashchange", onHash);
      window.addEventListener("online", on);
      window.addEventListener("offline", off);
      return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("online", on); window.removeEventListener("offline", off); };
    }, []);

    /* Live data of the open household. A first answer from the device copy can be empty although the server knows more: it is held
       back for a moment, so the page never claims "nothing here" too early. A listener that the server ends is started again
       after a pause, so the page recovers by itself once the reason is gone. */
    useEffect(() => {
      setSync({ pending: false, cached: false }); setTrouble(null);
      setLive(prev => (prev.id === homeId ? prev : { id: homeId, raw: undefined, cols: emptyCols() }));
      if (!homeId || !mode) return;
      const a = Store.adapter(mode);
      let alive = true, sure = false, t1 = null, retry = null, attempt = 0, stops = [];
      let meta = {}, shown = {}, held = {}, latest = {};
      const put = fn => { if (alive) setLive(prev => (prev.id === homeId ? fn(prev) : prev)); };
      const putCol = (col, list) => put(prev => Object.assign({}, prev, { cols: Object.assign({}, prev.cols, { [col]: list }) }));
      const pushSync = () => {
        let pending = false, cached = false;
        Object.keys(meta).forEach(k => { pending = pending || !!meta[k].pending; cached = cached || !!meta[k].cached; });
        setSync(prev => (prev.pending === pending && prev.cached === cached ? prev : { pending, cached }));
      };
      const detach = () => { stops.forEach(f => { try { f(); } catch (e) { /* already stopped */ } }); stops = []; };
      const failed = e => {
        if (!alive || retry) return;
        const code = (e && e.code) || "internal";
        detach(); meta = {}; pushSync();
        if (sure) setTrouble(code); else put(prev => Object.assign({}, prev, { raw: GATE[code] || "offline" }));
        if (code !== "unconfigured") retry = setTimeout(attach, Math.min(60000, 4000 * Math.pow(2, attempt++)));
      };
      const onHome = (data, m) => {
        if (!alive) return;
        meta.home = m || {}; pushSync();
        if (!m || !m.cached) { attempt = 0; setTrouble(null); }
        const settle = v => { sure = true; if (t1) { clearTimeout(t1); t1 = null; } put(prev => Object.assign({}, prev, { raw: v })); };
        if (data) settle(data);
        else if (!m || !m.cached) settle(null);
        else if (!t1 && !sure) t1 = setTimeout(() => { t1 = null; if (alive && !sure) put(prev => Object.assign({}, prev, { raw: "offline" })); }, 3000);
      };
      const onCol = col => (rows, m) => {
        if (!alive) return;
        meta[col] = m || {}; pushSync();
        latest[col] = rows.map(r => { try { return Store.NORM[col](r.id, r.data); } catch (e) { return null; } }).filter(Boolean);
        if (m && m.cached && !latest[col].length && !shown[col]) {
          if (!held[col]) held[col] = setTimeout(() => { held[col] = null; shown[col] = true; putCol(col, latest[col]); }, 3000);
          return;
        }
        shown[col] = true; if (held[col]) { clearTimeout(held[col]); held[col] = null; }
        putCol(col, latest[col]);
      };
      function attach() {
        if (!alive) return;
        retry = null;
        stops = [a.watchHome(homeId, onHome, failed)].concat(COLS.map(c => a.watchCol(homeId, c, onCol(c), failed)));
      }
      attach();
      return () => { alive = false; detach(); [t1, retry].concat(Object.keys(held).map(k => held[k])).forEach(t => { if (t) clearTimeout(t); }); };
    }, [homeId, mode]);

    const home = useMemo(() => {
      if (!raw || typeof raw !== "object") return null;
      try { return HP.normHome(homeId, raw); } catch (e) { return null; }
    }, [raw, homeId]);
    const homeName = home ? home.name : null, knownName = entry ? entry.name : null;
    useEffect(() => {
      if (homeName && homeId && knownName !== homeName) { Store.registry.put({ id: homeId, name: homeName }); refreshReg(); }
    }, [homeName, knownName, homeId, refreshReg]);

    useEffect(() => { if (!sync.pending) { setStuck(false); return; } const t = setTimeout(() => setStuck(true), 5000); return () => clearTimeout(t); }, [sync.pending]);
    const unconfirmed = mode === "cloud" && online && sync.cached;
    useEffect(() => { if (!unconfirmed) { setSlow(false); return; } const t = setTimeout(() => setSlow(true), 6000); return () => clearTimeout(t); }, [unconfirmed]);
    /* Online, and still a shared household stays unreachable, entries stay unsent or the server stays silent: the running sync never
       says why (a missing database or a used-up quota look like "no connection" to it). So ask the server directly, once a minute. */
    const ask = mode === "cloud" && online && (raw === "offline" || stuck || slow);
    useEffect(() => {
      if (!ask) return;
      let alive = true, t = null;
      const run = () => Store.checkCloud().then(
        () => { if (alive) setTrouble(null); },
        e => { if (alive) setTrouble(e && TROUBLE[e.code] ? e.code : null); }
      ).then(() => { if (alive) t = setTimeout(run, 60000); });
      run();
      return () => { alive = false; if (t) clearTimeout(t); };
    }, [ask]);
    useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), toast.kind === "err" ? 6500 : 3200); return () => clearTimeout(t); }, [toast]);

    const fail = useCallback(e => {
      say(FAIL[e && e.code] || "Speichern fehlgeschlagen. Prüf die Verbindung und versuch es nochmal.", "err");
      return false;
    }, [say]);
    useEffect(() => Store.onLateError(fail), [fail]);

    const act = useMemo(() => {
      const a = Store.adapter(mode || "local"), ok = p => p.then(() => true, fail);
      return {
        /* With the group sync on, a household is created on the server. If the server refuses (rules not yet published, no
           database, quota used up), it is created on this device instead, so the app works right away; «Einladen» shares it later. */
        async createHome(data) {
          const id = Store.randomId(22);
          let m = Store.cloudOn ? "cloud" : "local", note = null;
          try { await Store.adapter(m).createHome(id, clean(data)); }
          catch (e) {
            if (m !== "cloud" || !REFUSED[e && e.code]) { fail(e); return null; }
            try { await Store.adapter("local").createHome(id, clean(data)); } catch (e2) { fail(e2); return null; }
            m = "local"; note = REFUSED[e.code];
            health.state = e.code; health.at = Date.now();
          }
          Store.registry.put({ id, name: data.name, mode: m });
          try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) { /* optional */ }
          return { id, note };
        },
        patchHome(id, patch) { return ok(a.patchHome(id, clean(patch))); },
        /* Remember the last rate per currency in the household: the fallback for devices without network. */
        rememberRate(h, cur, rate) {
          const known = (h.rates || {})[cur];
          if (rate > 0 && (!known || Math.abs(known - rate) / rate > 0.01)) a.patchHome(h.id, { rates: { [cur]: rate } }).catch(() => {});
        },
        save(col, body) { const b = clean(body), id = b.id; delete b.id; return ok(a.saveDoc(homeRef.current, col, id, b)); },
        patch(col, id, patch) { return ok(a.patchDoc(homeRef.current, col, id, clean(patch))); },
        remove(col, id) { return ok(a.removeDoc(homeRef.current, col, id)); },
        removeMany(col, ids) { const hid = homeRef.current; return ok(Promise.all(ids.map(id => a.removeDoc(hid, col, id)))); },
        removeHome(hid, refs) { return ok(a.removeHome(hid, refs)); }
      };
    }, [mode, fail]);

    const meId = useMemo(() => {
      if (!home) return null;
      const id = meMap[home.id], m = home.members || {};
      return typeof id === "string" && Object.prototype.hasOwnProperty.call(m, id) && !m[id].gone ? id : null;
    }, [home, meMap]);
    const rememberMe = useCallback((hid, mid) => {
      setMeMap(prev => { const next = Object.assign({}, prev, { [hid]: mid }); ls.set("hp.me", next); return next; });
    }, []);
    const setMe = useCallback(mid => { if (homeRef.current) rememberMe(homeRef.current, mid); }, [rememberMe]);

    const close = useCallback(() => {
      setSheet(null);
      const st = historyState();
      if (st && st.hp === "sheet") {                                  // take the sheet's history entry away again
        leaving.current = true; setTimeout(() => { leaving.current = false; }, 1000);
        try { history.back(); } catch (e) { leaving.current = false; }
      }
    }, []);
    const open = useCallback(s => {
      setSheet(Object.assign({ k: newId() }, s));
      if (!homeRef.current) {
        const st = historyState();
        if (!(st && st.hp === "sheet")) { try { history.pushState({ hp: "sheet" }, "", "#s"); } catch (e) { /* then "back" simply leaves */ } }
      }
    }, []);

    useEffect(() => {
      if (!homeId || !pendingShare.current) return;
      const p = pendingShare.current; pendingShare.current = null;
      setTimeout(() => { setTab("recipes"); open({ t: "import", shared: p }); }, 0);
    }, [homeId, open]);

    /* Everything the modules need, in one object. */
    const members = useMemo(() => (home ? membersOf(home) : []), [home]);
    const byId = useMemo(() => { const o = {}; if (home) membersOf(home, true).forEach(m => { o[m.id] = m; }); return o; }, [home]);
    const who = useCallback(id => byId[id] || GHOST(id), [byId]);
    const ctx = useMemo(() => (home ? { home, data: cols, mode, meId, members, who, open, say, act } : null), [home, cols, mode, meId, members, who, open, say, act]);

    let note = null;
    if (home && mode === "cloud") {
      if (online && trouble && TROUBLE[trouble]) note = html`<div class="note warn" role="status"><${Icon} n="offline" /><div>${TROUBLE[trouble]}${sync.pending ? " Deine Einträge bleiben auf diesem Gerät, bis es wieder geht." : ""}</div></div>`;
      else if (!online) note = html`<p class="syncline" role="status"><${Icon} n="offline" s=${18} /><span>${Store.cloudDurable
        ? "Ohne Netz. Deine Einträge bleiben auf dem Gerät und werden gesendet, sobald du wieder online bist."
        : "Ohne Netz. Dieser Browser speichert nichts dauerhaft: Lass die Seite offen, bis du wieder online bist, sonst gehen neue Einträge verloren."}</span></p>`;
      else if (stuck) note = html`<p class="syncline" role="status"><span class="spin" aria-hidden="true"></span><span>Einträge werden gesendet …</span></p>`;
      else if (slow) note = html`<p class="syncline" role="status"><span class="spin" aria-hidden="true"></span><span>${Store.cloudDurable
        ? "Der Gruppen-Sync antwortet noch nicht. Deine Einträge bleiben auf dem Gerät und werden gesendet, sobald die Verbindung steht."
        : "Der Gruppen-Sync antwortet noch nicht. Lass die Seite offen, bis die Verbindung steht, sonst gehen neue Einträge verloren."}</span></p>`;
      /* The usual case, and the answer to "is it saved?": the line says so by itself, a moment after every entry. */
      else if (sync.pending || sync.cached) note = html`<p class="syncline busy"><span class="spin" aria-hidden="true"></span><span>${sync.pending ? "Wird für alle gespeichert …" : "Verbindung wird aufgebaut …"}</span></p>`;
      else note = html`<p class="syncline auto"><${Icon} n="check" s=${18} /><span>Automatisch für den ganzen Haushalt gespeichert.</span></p>`;
    } else if (home && mode === "local") note = html`<p class="syncline"><${Icon} n="device" s=${18} /><span>Nur auf diesem Gerät gespeichert. Für alle im Haushalt: oben auf «Einladen».</span></p>`;

    /* Moves a household from this device to the group. If the sheet it was started from is still open, the invitation takes its place;
       a form somebody opened meanwhile is left alone. */
    const publish = async (hid, name) => {
      try { await Store.publish(hid); } catch (e) { fail(e); return false; }
      Store.registry.put({ id: hid, name, mode: "cloud" }); refreshReg();
      const cur = sheetRef.current;
      if (homeRef.current === hid && cur && (cur.t === "home-edit" || cur.t === "invite")) setSheet({ t: "invite", k: newId() });
      say("Freigegeben. Schick jetzt den Link an alle im Haushalt.");
      return true;
    };
    const findIn = (col, id, fallback) => (cols[col] || []).find(x => x.id === id) || fallback;

    let sheetEl = null;
    if (sheet) {
      const s = sheet;
      if (s.t === "home-new") sheetEl = html`<${HomeNew} key=${s.k} act=${act} onClose=${close}
        onCreated=${(id, mine, note) => { if (mine) rememberMe(id, mine); showHome(id, true); say(note || "Haushalt angelegt. Willkommen zu Hause! 🏡", note ? "err" : "ok"); }} />`;
      else if (s.t === "join") sheetEl = html`<${JoinSheet} key=${s.k} onClose=${close} onJoin=${id => { join(id, true); }} />`;
      else if (s.t === "settings") sheetEl = html`<${SettingsSheet} key=${s.k} onClose=${close}
        onSetup=${() => open({ t: "setup" })} onInstall=${() => open({ t: "install" })}
        onImported=${r => { refreshReg(); showHome(r.id, true); say("Sicherung eingelesen: " + r.count + (r.count === 1 ? " Eintrag." : " Einträge.")); }} />`;
      else if (s.t === "setup") sheetEl = html`<${SetupSheet} key=${s.k} onClose=${close} say=${say} />`;
      else if (s.t === "install") sheetEl = html`<${InstallSheet} key=${s.k} link=${home && mode === "cloud" ? Store.linkFor(home.id) : null}
        hasCloud=${reg.some(e => e.mode === "cloud")} hasLocal=${reg.some(e => e.mode === "local")} onClose=${close} say=${say} />`;
      else if (ctx) {
        const { home: h } = ctx;
        /* «Einladen» leads to the invitation, or to what is still missing for it: sharing this household, or switching on the group sync. */
        if (s.t === "invite") sheetEl = mode === "cloud" ? html`<${InviteSheet} key=${s.k} home=${h} onClose=${close} say=${say} />`
          : Store.cloudOn ? html`<${ShareSheet} key=${s.k} onClose=${close} onPublish=${() => publish(h.id, h.name)} />`
          : html`<${SetupSheet} key=${s.k} onClose=${close} say=${say} />`;
        else if (s.t === "avatar") {
          const mem = membersOf(h, true).find(m => m.id === s.m);
          /* Opened from the household settings, it leads back there. */
          if (mem) sheetEl = html`<${AvatarSheet} key=${s.k} home=${h} member=${mem} isMe=${mem.id === meId} act=${act} say=${say}
            onClose=${s.back ? () => setSheet({ t: s.back, k: newId() }) : close} />`;
        }
        else if (s.t === "expense") sheetEl = html`<${U.ExpenseForm} key=${s.k} home=${h} expense=${s.e || null} preset=${s.preset} meId=${meId} act=${act} onClose=${close} say=${say} />`;
        else if (s.t === "transfer") sheetEl = html`<${U.TransferForm} key=${s.k} home=${h} transfer=${s.e || null} preset=${s.preset} meId=${meId} act=${act} onClose=${close} say=${say} />`;
        else if (s.t === "item") sheetEl = html`<${U.ItemSheet} key=${s.k} ctx=${ctx} it=${findIn("shopping", s.it.id, s.it)} onClose=${close} />`;
        else if (s.t === "aisles") sheetEl = html`<${U.AislesSheet} key=${s.k} ctx=${ctx} onClose=${close} />`;
        else if (s.t === "month") sheetEl = html`<${U.MonthSheet} key=${s.k} ctx=${ctx} ym=${s.ym} scope=${s.scope} onClose=${close} />`;
        else if (s.t === "calsync") sheetEl = html`<${U.CalSync} key=${s.k} ctx=${ctx} onClose=${close} />`;
        else if (s.t === "calimport") sheetEl = html`<${U.CalImport} key=${s.k} ctx=${ctx} onClose=${close} />`;
        else if (s.t === "event") sheetEl = html`<${U.EventForm} key=${s.k} ctx=${ctx} ev=${s.e ? findIn("events", s.e.id, s.e) : null} date=${s.date} at=${s.at} onClose=${close} />`;
        else if (s.t === "recipe") {
          const r = U.findRecipe(ctx, s.id);
          if (r) sheetEl = html`<${U.RecipeView} key=${s.k} ctx=${ctx} r=${r} plan=${s.plan} fresh=${s.fresh}
            onClose=${() => (s.back ? setSheet(Object.assign({}, s.back, { k: newId() })) : close())} />`;
        }
        else if (s.t === "book") sheetEl = html`<${U.BookSheet} key=${s.k} ctx=${ctx} f=${s.f} open=${s.open} onClose=${close} />`;
        else if (s.t === "fridge") sheetEl = html`<${U.FridgeSheet} key=${s.k} ctx=${ctx} o=${s.o} onClose=${close} />`;
        else if (s.t === "finder") sheetEl = html`<${U.FinderSheet} key=${s.k} ctx=${ctx} p=${s.p} i=${s.i} onClose=${close} />`;
        /* Editing a recipe that was open leads back to it; a new one opens once it is saved. */
        else if (s.t === "recipe-edit") sheetEl = html`<${U.RecipeForm} key=${s.k} ctx=${ctx} r=${s.r ? findIn("recipes", s.r.id, s.r) : null} draft=${s.draft} source=${s.source} how=${s.how}
          onClose=${deleted => (s.r && !deleted ? setSheet({ t: "recipe", id: s.r.id, k: newId() }) : close())}
          onSaved=${(id, imported) => setSheet({ t: "recipe", id, fresh: !!imported, k: newId() })} />`;
        /* A link, screenshots or text become a draft to check in the recipe form. */
        else if (s.t === "import") sheetEl = html`<${U.ImportSheet} key=${s.k} ctx=${ctx} mode=${s.mode} shared=${s.shared} onClose=${close}
          onDraft=${(draft, how, source) => setSheet({ t: "recipe-edit", draft, how, source, k: newId() })} />`;
        /* Cooking mode lies over everything; closing it leads back to the recipe. */
        else if (s.t === "cook") {
          const r = U.findRecipe(ctx, s.id);
          if (r) sheetEl = html`<${U.CookMode} key=${s.k} ctx=${ctx} r=${r} serves=${s.serves} onClose=${nid => setSheet({ t: "recipe", id: typeof nid === "string" ? nid : s.id, k: newId() })} />`;
        }
        else if (s.t === "meal") sheetEl = html`<${U.MealSheet} key=${s.k} ctx=${ctx} date=${s.date} rid=${s.rid} onClose=${close} />`;
        else if (s.t === "plant") sheetEl = html`<${U.PlantForm} key=${s.k} ctx=${ctx} p=${s.p ? findIn("plants", s.p.id, s.p) : null} onClose=${close} />`;
        else if (s.t === "info") {
          const info = findIn("infos", s.info.id, null);
          if (info) sheetEl = html`<${U.InfoView} key=${s.k} ctx=${ctx} info=${info} onClose=${close} />`;
        }
        /* Editing an entry that was open to read leads back to it; a new one opens to read once it is saved. */
        else if (s.t === "info-edit") sheetEl = html`<${U.InfoForm} key=${s.k} ctx=${ctx} info=${s.info ? findIn("infos", s.info.id, s.info) : null} preset=${s.preset}
          onClose=${deleted => (s.info && !deleted ? setSheet({ t: "info", info: s.info, k: newId() }) : close())}
          onSaved=${body => setSheet({ t: "info", info: body, k: newId() })} />`;
        else if (s.t === "home-edit") sheetEl = html`<${HomeEdit} key=${s.k} home=${h} mode=${mode} cols=${cols} loading=${COLS.some(c => cols[c] === null)} meId=${meId} setMe=${setMe} act=${act} onClose=${close}
          onDelete=${async () => {
            const hid = h.id, refs = [], a = act;
            COLS.forEach(c => (cols[c] || []).forEach(x => refs.push({ col: c, id: x.id })));
            goList();
            if (await a.removeHome(hid, refs)) { Store.registry.remove(hid); refreshReg(); say("Haushalt gelöscht."); }
          }}
          onLeave=${() => { const hid = h.id; goList(); Store.registry.remove(hid); refreshReg(); say("Haushalt von diesem Gerät entfernt."); }}
          onPublish=${() => publish(h.id, h.name)}
          onAvatar=${id => setSheet({ t: "avatar", m: id, back: "home-edit", k: newId() })} />`;
      }
    }
    /* The page behind a sheet does not scroll. Bound to what is really shown: a sheet whose household has gone must not leave the page stuck. */
    const sheetShown = !!sheetEl;
    useEffect(() => { document.documentElement.classList.toggle("locked", sheetShown); return () => document.documentElement.classList.remove("locked"); }, [sheetShown]);

    /* While online, a household that stays unreachable gets the server's own reason if it has one. */
    const gate = raw === "offline" && online && trouble && GATE[trouble] ? GATE[trouble] : raw;
    let view;
    if (homeId && ctx) view = html`<${HomeView} ctx=${ctx} tab=${tab} setTab=${setTab} kview=${kview} setKview=${setKview} setMe=${setMe} note=${note} onBack=${goList} />`;
    else if (homeId) view = html`<${HomeGate} state=${gate && typeof gate === "object" ? null : gate} onBack=${goList}
      onForget=${() => { const hid = homeId; goList(); Store.registry.remove(hid); refreshReg(); }} />`;
    else view = html`<${Home} reg=${reg} onOpen=${id => showHome(id, true)} onNew=${() => open({ t: "home-new" })} onJoin=${() => open({ t: "join" })} onSettings=${() => open({ t: "settings" })}
      onSetup=${() => open({ t: "setup" })} onInstall=${() => open({ t: "install" })} />`;

    /* An open household has the navigation bar at the bottom: the column and the messages keep clear of it. */
    const bar = !!(homeId && ctx);
    return html`
      <div class=${"wrap" + (bar ? " with-bar" : "")}>${view}</div>
      ${sheetEl}
      ${toast && html`<div class=${"toast" + (bar && !sheet ? " up" : "")} role="status" aria-live="polite" key=${toast.k}>${toast.msg}</div>`}
    `;
  }

  function Shell() {
    const [crash] = useErrorBoundary();
    if (!crash) return html`<${App} />`;
    /* A household that cannot be drawn would reopen by itself at the next start: the second button leads past it. */
    const toList = () => { ls.set("hp.last", ""); try { history.replaceState(null, "", HOME_URL); } catch (e) { /* reload anyway */ } location.reload(); };
    return html`
      <div class="wrap">
        <header class="brand"><h1><span class="logo" aria-hidden="true">🏡</span><span class="word">Home-Planer</span></h1></header>
        <div class="note warn" role="alert"><${Icon} n="close" /><div><strong>Da ist etwas schiefgelaufen.</strong> Alles, was schon gespeichert war, ist noch da.</div></div>
        <div class="btn-row">
          <button type="button" class="btn primary" onClick=${() => location.reload()}>Neu laden</button>
          <button type="button" class="btn" onClick=${toList}>Zur Liste der Haushalte</button>
        </div>
      </div>`;
  }

  root.textContent = "";
  render(html`<${Shell} />`, root);

  /* Offline start: the service worker keeps a copy of the app files. */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
  }
})();
