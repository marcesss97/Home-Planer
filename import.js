/* Home-Planer: Rezepte übernehmen, aus einem Link, einem Screenshot oder kopiertem Text.
   Webseiten: Fast alle Rezeptseiten (Fooby von Coop, Migusto von Migros, Betty Bossi, Swissmilk, Chefkoch …) beschreiben
   ihr Rezept maschinenlesbar nach schema.org ("Recipe" als JSON-LD). Das wird gelesen; fehlt es, der Text der Seite.
   Weil der Browser fremde Seiten nicht direkt lesen darf, holt ein öffentlicher Lesedienst die Seite (nur die Adresse
   des Rezepts geht dorthin). Screenshots: Die Texterkennung (Tesseract) läuft ganz auf dem Gerät, nichts verlässt es.
   Aus dem Text werden Titel, Portionen, Zeit, Zutaten und Schritte erkannt; das Ergebnis ist ein Entwurf zum Prüfen. */
window.HPImport = (function () {
  "use strict";
  var HP = window.HP;

  /* ---------- Text aufräumen ---------- */
  var ENT = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ", auml: "ä", ouml: "ö", uuml: "ü", Auml: "Ä", Ouml: "Ö", Uuml: "Ü", szlig: "ß",
    eacute: "é", egrave: "è", agrave: "à", acirc: "â", ecirc: "ê", ccedil: "ç", frac12: "½", frac14: "¼", frac34: "¾", deg: "°", ndash: "–", mdash: "—", hellip: "…",
    laquo: "«", raquo: "»", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "„", bdquo: "„", times: "×", middot: "·", shy: "" };
  function decode(s) {
    return String(s || "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+[0-9]*);/gi, function (all, e) {
      if (e[0] === "#") { var n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ""; }
      return ENT[e] !== undefined ? ENT[e] : all;
    });
  }
  /* HTML zu Text: Absätze und Zeilenumbrüche bleiben, Skripte und Stile fallen weg. */
  function htmlText(html) {
    return decode(String(html || "")
      .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr|section|article|header|footer|ul|ol|table|figure)>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/<[^>]+>/g, " "))
      .replace(/[ \t\u00a0\u202f]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  function clean(s) { return htmlText(s).replace(/\s+/g, " ").trim(); }
  /* Häufige Lesefehler der Texterkennung in Mengen: "2 di Rahm" ist "2 dl Rahm", "1 I Milch" ist "1 l Milch". */
  function fixOcr(t) {
    return String(t || "")
      .replace(/(\d)\s*di\b/g, "$1 dl").replace(/(\d)\s*[Il|]\s+(?=[A-ZÄÖÜ])/g, "$1 l ")
      .replace(/(\d)\s*EI\b/g, "$1 EL").replace(/(\d)\s*TI\b/g, "$1 TL")
      .replace(/[“”„]/g, "\"").replace(/[‘’]/g, "'").replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl");
  }

  /* ---------- schema.org: Zeit, Portionen, Schritte ---------- */
  /* "PT1H30M" -> 90 */
  function isoMinutes(v) {
    if (typeof v === "number") return v > 0 && v < 2000 ? Math.round(v) : 0;
    var m = /^P(?:(\d+)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+)S)?)?$/i.exec(String(v || "").trim());
    if (!m) return 0;
    var t = (+(m[1] || 0)) * 1440 + (+(m[2] || 0)) * 60 + (+(m[3] || 0)) + Math.round((+(m[4] || 0)) / 60);
    return t > 0 && t < 2000 ? Math.round(t) : 0;
  }
  function serves(v) {
    if (Array.isArray(v)) { for (var i = 0; i < v.length; i++) { var x = serves(v[i]); if (x) return x; } return 0; }
    var m = /(\d+)/.exec(String(v == null ? "" : v));
    var n = m ? +m[1] : 0;
    return n >= 1 && n <= 50 ? n : 0;
  }
  /* Ein langer Text wird zu Schritten: nach Zeilen, nach Nummern ("1." "2)") oder, wenn nichts davon da ist, nach Sätzen. */
  function splitSteps(text) {
    var t = String(text || "").replace(/\r/g, "").trim();
    if (!t) return [];
    var parts = t.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (parts.length === 1) parts = t.split(/\s(?=\d{1,2}[.)]\s+[A-ZÄÖÜ])/);
    if (parts.length === 1 && t.length > 260) {
      var sentences = t.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [t], out = [], cur = "";
      sentences.forEach(function (snt) { cur += snt; if (cur.length > 140) { out.push(cur.trim()); cur = ""; } });
      if (cur.trim()) out.push(cur.trim());
      parts = out;
    }
    return parts.map(function (x) { return x.replace(/^(?:schritt\s*)?\d{1,2}\s*[.):]\s*/i, "").replace(/^[•*–-]\s*/, "").trim(); }).filter(function (x) { return x.length > 1; });
  }
  function instructions(v) {
    var out = [];
    (function walk(x, prefix) {
      if (!x) return;
      if (typeof x === "string") { splitSteps(htmlText(x)).forEach(function (s) { out.push(s); }); return; }
      if (Array.isArray(x)) { x.forEach(function (y) { walk(y, prefix); }); return; }
      if (typeof x === "object") {
        var type = [].concat(x["@type"] || []).join(" ");
        if (/HowToSection/i.test(type) || x.itemListElement) {
          var start = out.length;
          walk(x.itemListElement || x.steps, "");
          if (x.name && out.length > start) out[start] = clean(x.name) + ": " + out[start];
          return;
        }
        var t = x.text || x.name || x.description;
        if (t) splitSteps(htmlText(t)).forEach(function (s, i) { out.push(i === 0 && prefix ? prefix + s : s); });
      }
    })(v, "");
    return out.filter(function (s, i, a) { return s && a.indexOf(s) === i; }).slice(0, 40);
  }
  /* Alle JSON-LD-Blöcke einer Seite, und darin das erste Objekt vom Typ "Recipe" (auch in @graph oder Listen). */
  function findRecipe(html) {
    var re = /<script[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi, m, found = null;
    function isRecipe(o) { return o && typeof o === "object" && [].concat(o["@type"] || []).some(function (t) { return /(^|\/)Recipe$/i.test(String(t)); }); }
    function walk(o, depth) {
      if (found || !o || typeof o !== "object" || depth > 6) return;
      if (isRecipe(o)) { found = o; return; }
      if (Array.isArray(o)) { o.forEach(function (x) { walk(x, depth + 1); }); return; }
      ["@graph", "mainEntity", "mainEntityOfPage", "itemListElement", "item"].forEach(function (k) { if (o[k]) walk(o[k], depth + 1); });
    }
    while ((m = re.exec(String(html || ""))) && !found) {
      var raw = m[1].trim().replace(/^<!--|-->$/g, "").trim();
      try { walk(JSON.parse(raw), 0); }
      catch (e) { try { walk(JSON.parse(decode(raw)), 0); } catch (x) { /* ein kaputter Block: der nächste */ } }
    }
    return found;
  }
  function meta(html, name) {
    var re = new RegExp("<meta[^>]+(?:property|name)\\s*=\\s*[\"']" + name + "[\"'][^>]*>", "i"), tag = re.exec(String(html || ""));
    if (!tag) return "";
    var c = /content\s*=\s*"([^"]*)"|content\s*=\s*'([^']*)'/i.exec(tag[0]);
    return c ? clean(c[1] || c[2] || "") : "";
  }

  /* ---------- Entwürfe ---------- */
  var MEAT = /(fleisch|poulet|huhn|hähnchen|hühner|rind|kalb|schwein|lamm|hack|wurst|cervelat|salami|schinken|speck|lachs|thon|thunfisch|fisch|crevetten|garnelen|steak|filet|plätzli|chorizo|prosciutto|pancetta|bresaola|sardellen|anchovis|gelatine|bouillon\s*\(rind)/i;
  var ANIMAL = /(milch|rahm|butter|käse|joghurt|jogurt|ei\b|eier|honig|quark|mozzarella|parmesan|gruyère|feta|mascarpone|crème fraîche|creme fraiche|sahne)/i;
  /* Bild, Art und Merkmale aus Titel und Zutaten erraten; alles lässt sich danach im Formular ändern. */
  function guess(d) {
    var t = (d.title + " " + (d.category || "")).toLowerCase(), ing = d.ingr.join(" ").toLowerCase().replace(/(kokos|hafer|soja|mandel|reis|erbsen)(milch|rahm|joghurt|drink)|veganer?\s+\w+|pflanzenbutter|margarine/g, " "), kw = String(d.keywords || "").toLowerCase();
    var rules = [[/fondue/, "fondue"], [/raclette|käse(?!kuchen)/, "kaese"], [/pizza|flammkuchen/, "pizza"], [/curry|dal\b|dhal/, "curry"], [/suppe|soup|bouillon|eintopf/, "suppe"],
      [/salat|bowl/, "salat"], [/risotto|reis|paella/, "reis"], [/ramen|pho|nudelsuppe|pad thai|udon/, "nudeln"], [/pasta|spaghetti|penne|lasagne|nudel|hörnli|magronen|tagliatelle|gnocchi/, "pasta"],
      [/burger/, "burger"], [/taco|burrito|quesadilla/, "taco"], [/wrap|fajita|fladen|döner|kebab/, "fladen"], [/sandwich|toast|bagel/, "sandwich"],
      [/omelett|spiegelei|rührei|shakshuka|frittata/, "ei"], [/rösti|kartoffel|gratin|pommes/, "kartoffel"], [/lachs|fisch|forelle|egli|thon/, "fisch"], [/sushi|poke/, "sushi"],
      [/poulet|huhn|hähnchen|chicken/, "poulet"], [/speck|bacon/, "speck"], [/steak|rind|kalb|geschnetzelt|braten|hack|schwein|lamm/, "fleisch"], [/pilz|champignon/, "pilz"],
      [/kürbis/, "kuerbis"], [/chili/, "chili"], [/wähe|quiche|tarte/, "waehe"], [/pancake|crêpe|crepe|omelette/, "pancake"], [/schoko|schoggi|brownie|mousse au chocolat/, "schoggi"],
      [/kuchen|torte|cake|muffin|cookie|guetzli|dessert|tiramisu/, "kuchen"], [/glace|eis\b|sorbet/, "glace"], [/brot|zopf|brötchen/, "brot"], [/müesli|muesli|porridge|apfel/, "apfel"],
      [/gemüse|ofengemüse|ratatouille|broccoli|brokkoli/, "gemuese"]];
    var emoji = "teller";
    for (var i = 0; i < rules.length; i++) if (rules[i][0].test(t)) { emoji = rules[i][1]; break; }
    var cat = /suppe|soup/.test(t) ? "soup" : /salat|bowl/.test(t) ? "salad" : /müesli|muesli|porridge|frühstück|pancake|zopf|granola/.test(t) ? "breakfast"
      : /kuchen|torte|dessert|mousse|cake|muffin|cookie|guetzli|glace|tiramisu|crème brûlée|creme brulee|brownie|pudding/.test(t) ? "sweet"
      : /dip|apéro|apero|snack|häppchen|fingerfood|aufstrich/.test(t) ? "snack" : "main";
    var tags = [];
    var stepsText = d.steps.join(" ").toLowerCase().replace(/(kokos|hafer|soja|mandel)(milch|rahm)/g, " ");
    if (/vegan/.test(t + " " + kw) || (!MEAT.test(ing) && !ANIMAL.test(ing) && !ANIMAL.test(stepsText) && d.ingr.length >= 3)) tags.push("vegan");
    else if (/vegetari/.test(kw + " " + t) || (!MEAT.test(ing) && d.ingr.length >= 3)) tags.push("vegi");
    if (d.time > 0 && d.time <= 30) tags.push("quick");
    return { emoji: emoji, cat: cat, tags: tags };
  }
  function finish(d) {
    var g = guess(d);
    return { title: (d.title || "Rezept").slice(0, 80), emoji: g.emoji, cat: g.cat, tags: g.tags, time: d.time || 0, serves: d.serves || 4,
      ingr: d.ingr.map(function (x) { return x.slice(0, 120); }).filter(Boolean).slice(0, 60), steps: d.steps.map(function (x) { return x.slice(0, 600); }).slice(0, 40),
      link: d.link && HP.okUrl(d.link) ? d.link : "", note: (d.note || "").slice(0, 2000) };
  }
  function fromRecipe(o, url) {
    var ingr = [].concat(o.recipeIngredient || o.ingredients || []).map(function (x) { return clean(typeof x === "string" ? x : (x && (x.text || x.name)) || ""); }).filter(Boolean);
    var time = isoMinutes(o.totalTime) || (isoMinutes(o.prepTime) + isoMinutes(o.cookTime));
    var desc = clean(o.description || "");
    var src = url ? "Quelle: " + url.replace(/^https?:\/\/(www\.)?/, "").split(/[/?#]/)[0] : "";
    return finish({ title: clean(o.name || o.headline || ""), ingr: ingr, steps: instructions(o.recipeInstructions), time: time, serves: serves(o.recipeYield || o.yield),
      link: url, note: [desc.length > 400 ? desc.slice(0, 400) + " …" : desc, src].filter(Boolean).join("\n\n"),
      category: [].concat(o.recipeCategory || []).join(" "), keywords: [].concat(o.keywords || []).join(" ") + " " + [].concat(o.suitableForDiet || []).join(" ") });
  }

  /* Ein Rezept aus losem Text: Überschriften wie "Zutaten" und "Zubereitung" teilen ihn auf; ohne sie entscheidet die Form
     der Zeile: Mengen vorne sind Zutaten, Sätze sind Schritte. Umgebrochene Zeilen werden wieder zusammengesetzt. */
  var H_ING = /^(zutaten|ingredients|einkaufsliste|du brauchst|ihr braucht|das brauchst du|für den teig|für die füllung|für die sauce|für die sosse|für den guss|für das dressing)\b/i;
  var H_STEP = /^(zubereitung|anleitung|so geht'?s|so wird'?s gemacht|schritte|zubereitungsschritte|instructions|method|directions|und so geht'?s)\b/i;
  var NOISE = /^([‹<←]|zurück\b|rezept (speichern|drucken|teilen)|teilen\b|drucken\b|merken\b|gefällt mir|kommentare?\b|bewertung|werbung|anzeige|\d+\s*(likes?|kommentare|bewertungen)|follow|folgen|abonnieren|mehr anzeigen|weiterlesen|https?:\/\/|www\.|@\w+$|#\w+(\s+#\w+)*$|\d{1,2}:\d{2}(\s|$)|[★☆✩✭⭐]|[\d'.,]+\s*(likes?|views|aufrufe))/i;
  var GENERIC = /rezept|lieblings|heute gibt|unser|mein|feierabend|soulfood|so lecker|yummy|^[^a-zäöü]*$/i;
  var GLUE = /\b(zum|zur|für|und|oder|mit|von|nach|ohne|aus|in|vom|à|ca\.?|evtl\.?)$/i;
  var QTY = new RegExp("^(?:[•*–-]\\s*)?(\\d+\\/\\d+|\\d+(?:[.,]\\d+)?(?:\\s*[-–]\\s*\\d+(?:[.,]\\d+)?)?|[½¼¾⅓⅔]|ein(?:e|en)?|zwei|drei|vier|etwas|wenig|prise|nach belieben)\\b", "i");
  var UNITONLY = /^(\d+\/\d+|\d+(?:[.,]\d+)?|[½¼¾⅓⅔])\s*(g|kg|ml|cl|dl|l|el|tl|stk\.?|stück|prise|prisen|bund|dose|dosen|pack|packung|päckli|becher|zehe|zehen|scheibe|scheiben|msp|zweig|zweige|handvoll)?\.?$/i;
  /* Bildbeschreibungen (Instagram & Co.) stehen oft auf einer einzigen Zeile: Überschriften und Mengen bekommen eine eigene. */
  function unfold(text) {
    return text.split("\n").map(function (l) {
      if (l.length < 120) return l;
      l = l.replace(/\s*\b(zutaten(?:\s+für\s+\d+\s*\w+)?|zubereitung|anleitung|so geht'?s)\s*:\s*/gi, "\n$1\n");
      var parts = l.split("\n"), mode = null;
      return parts.map(function (part) {
        if (H_ING.test(part)) { mode = "ing"; return part; }
        if (H_STEP.test(part)) { mode = "step"; return part; }
        if (mode === "ing") return part.replace(/\s(?=(?:\d+(?:[.,]\d+)?|[½¼¾])\s*(?:(?:g|kg|ml|cl|dl|l|el|tl|stk\.?|prise|bund|dose|handvoll|zehen?|becher|pack(?:ung)?)\s+)?[A-ZÄÖÜ])/gi, "\n");
        return part;
      }).join("\n");
    }).join("\n");
  }
  var PICTO = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu;
  function cleanTitle(t) {
    return String(t || "").replace(/^.*?\b(?:on|auf) Instagram:\s*/i, "").replace(PICTO, "").replace(/#[\wäöü]+/gi, "").replace(/^[\s"„“«»']+|[\s"„“«»':]+$/g, "").replace(/\s+/g, " ").trim();
  }
  function fromText(input, url) {
    var lines = unfold(fixOcr(input).replace(/\r/g, "")).split("\n").map(function (l) { return l.replace(/\s+/g, " ").trim(); });
    var title = "", serv = 0, time = 0, ingr = [], steps = [], mode = null, firstReal = null;
    var all = lines.join(" ");
    var sm = /(?:für|zutaten für|ergibt|portionen:?|personen:?)\s*(\d{1,2})\s*(personen|portionen|pers\.?|stück|servings)?/i.exec(all) || /(\d{1,2})\s*(personen|portionen|servings)\b/i.exec(all);
    if (sm) serv = +sm[1] <= 50 ? +sm[1] : 0;
    var tm = /(?:gesamt(?:zeit)?|total|zeit|dauer|zubereitungszeit|arbeitszeit)\s*:?\s*(?:ca\.?\s*)?(\d+)\s*(min|minuten|std|stunden|h)\b/i.exec(all) || /\b(\d+)\s*(min|minuten)\b/i.exec(all);
    if (tm) time = /^(std|stunden|h)/i.test(tm[2]) ? +tm[1] * 60 : +tm[1];
    var pendingQty = "";
    lines.forEach(function (l) {
      if (!l || NOISE.test(l)) { if (mode === "step" && steps.length && !/[.!?:]$/.test(steps[steps.length - 1])) steps[steps.length - 1] += "."; return; }
      if (H_ING.test(l)) { mode = "ing"; return; }
      if (H_STEP.test(l)) { mode = "step"; return; }
      if (title && cleanTitle(l).toLowerCase() === title.toLowerCase()) return;   // der Titel nochmals, etwa am Anfang einer Beschreibung
      var named = /^(.{3,60}?)\s+für\s+\d+\s*(personen|portionen|pers\.?|stück)\b/i.exec(l);
      if (named && !QTY.test(l)) { if (!title || GENERIC.test(title)) title = cleanTitle(named[1]); return; }
      if (!title) {
        if (l.length <= 70 && !QTY.test(l) && !/^(\d|zutaten|für \d)/i.test(l) && !/\b(min|minuten|portionen|personen)\b/i.test(l)) { title = cleanTitle(l.replace(/[*_]+/g, "").replace(/^rezept:?\s*/i, "")); if (title) return; }
      }
      if (/^(für|zutaten für)\s*\d+\s*(personen|portionen|stück)/i.test(l) || /^\d+\s*(min|minuten|portionen|personen)\b/i.test(l) || /^(gesamt|zubereitungszeit|arbeitszeit|backzeit|kochzeit)\b/i.test(l)) return;
      if (firstReal == null) firstReal = l;
      var numbered = /^(?:schritt\s*)?\d{1,2}\s*[.):]\s+\S/i.test(l), qty = QTY.test(l) && !numbered;
      var kind = mode || (numbered ? "step" : qty && l.length <= 70 ? "ing" : l.length > 55 || /[.!?]$/.test(l) ? "step" : null);
      if (kind === "ing" && mode === "step" && !qty) kind = "step";
      if (!kind) kind = ingr.length && !steps.length ? "ing" : steps.length ? "step" : l.length <= 40 ? "ing" : "step";
      if (kind === "ing") {
        if (UNITONLY.test(l)) { pendingQty = l; return; }                // Menge und Zutat in zwei Spalten
        var item = (pendingQty ? pendingQty + " " : "") + l.replace(/^[•*–-]\s*/, "");
        pendingQty = "";
        var prev = ingr[ingr.length - 1];
        if (prev && !QTY.test(item) && (/^[a-zäöü(]/.test(item) || GLUE.test(prev))) ingr[ingr.length - 1] = prev + " " + item;   // umgebrochen
        else ingr.push(item);
      } else {
        pendingQty = "";
        var last = steps[steps.length - 1];
        if (last && !numbered && !/[.!?:]$/.test(last)) steps[steps.length - 1] = last + " " + l;
        else steps.push(l);
      }
    });
    if (!title && firstReal) title = firstReal.slice(0, 60);
    steps = steps.map(function (s) { return s.replace(/^(?:schritt\s*)?\d{1,2}\s*[.):]\s*/i, "").replace(/(\s*#[\wäöü]+)+\s*$/i, "").trim(); }).filter(function (s) { return s.length > 2; });
    return finish({ title: title, ingr: ingr, steps: steps, time: time, serves: serv, link: url || "", note: url ? "Quelle: " + url : "" });
  }
  /* Ein Rezept aus einer Webseite: zuerst schema.org, dann die Beschreibung (bei Instagram steht dort der Text des Beitrags),
     zuletzt der ganze Text der Seite. */
  function fromHtml(html, url) {
    var r = findRecipe(html);
    if (r) { var d = fromRecipe(r, url); if (d.ingr.length || d.steps.length) return { draft: d, how: "schema" }; }
    var title = meta(html, "og:title") || clean((/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html) || [])[1] || "");
    var desc = meta(html, "og:description") || meta(html, "description");
    var body = htmlText((/<(main|article)[^>]*>([\s\S]*?)<\/\1>/i.exec(html) || [])[2] || html);
    var fromDesc = desc && desc.length > 80 ? fromText(title + "\n" + desc, url) : null;
    var fromBody = fromText(title + "\n" + body, url);
    var best = fromDesc && fromDesc.ingr.length >= fromBody.ingr.length ? fromDesc : fromBody;
    var t2 = cleanTitle(title.replace(/\s*[|–]\s*[^|–]+$/, ""));
    if (t2 && !(best.title && /instagram|tiktok|facebook|pinterest/i.test(title) && !GENERIC.test(best.title))) best.title = t2.slice(0, 80);
    best.emoji = guess(best).emoji; best.cat = guess(best).cat;
    return best.ingr.length >= 2 || best.steps.length >= 2 ? { draft: best, how: "text" } : null;
  }

  /* ---------- Seiten holen ---------- */
  function withTimeout(p, ms) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error("timeout")); }, ms);
      p.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }
  function get(url, headers) {
    return withTimeout(fetch(url, { headers: headers || {}, credentials: "omit", redirect: "follow" }), 14000).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    });
  }
  /* Der Reihe nach: die Seite selbst (selten erlaubt), dann Lesedienste, die fremde Seiten für Browser freigeben. */
  var READERS = [
    function (u) { return get(u); },
    function (u) { return get("https://api.allorigins.win/raw?url=" + encodeURIComponent(u)); },
    function (u) { return get("https://api.codetabs.com/v1/proxy/?quest=" + encodeURIComponent(u)); },
    function (u) { return get("https://r.jina.ai/" + u, { "X-Return-Format": "html" }); },
    function (u) { return get("https://r.jina.ai/" + u).then(function (md) { return "<main>" + md.replace(/</g, "&lt;").replace(/\n/g, "<br>") + "</main>"; }); }
  ];
  function normUrl(input) {
    var m = /https?:\/\/[^\s<>"']+/i.exec(String(input || ""));
    var u = m ? m[0].replace(/[),.;!?»]+$/, "") : "";
    return HP.okUrl(u) ? u : "";
  }
  /* onStep(text) meldet den Fortschritt. Ergebnis: { draft, how } oder Fehler { code: "fetch" | "norecipe" }. */
  function fromLink(input, onStep) {
    var url = normUrl(input);
    if (!url) return Promise.reject({ code: "nourl" });
    var i = 0, gotPage = false, fallback = null;
    function next() {
      if (i >= READERS.length) return fallback ? Promise.resolve(fallback) : Promise.reject({ code: gotPage ? "norecipe" : "fetch" });
      var k = i++;
      if (onStep) onStep(k === 0 ? "Seite wird geladen …" : "Seite wird über einen Lesedienst geladen (" + k + " von " + (READERS.length - 1) + ") …");
      return READERS[k](url).then(function (html) {
        if (!html || html.length < 200) return next();
        gotPage = true;
        var r = fromHtml(html, url);
        if (r && r.how === "schema") return r;                          // das Beste, was es gibt
        if (r && !fallback) fallback = r;
        return fallback && k >= 2 ? fallback : next();                  // Text genügt, wenn schon zwei Wege nichts Besseres hatten
      }, function () { return next(); });
    }
    return next();
  }

  /* ---------- Screenshots lesen ---------- */
  var tessP = null;
  function loadTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (!tessP) tessP = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "ocr/tesseract.min.js";
      s.onload = function () { resolve(window.Tesseract); };
      s.onerror = function () { tessP = null; reject({ code: "ocr-load" }); };
      document.head.appendChild(s);
    });
    return tessP;
  }
  /* Liest einen oder mehrere Screenshots der Reihe nach. onProgress(Anteil 0..1, Text). */
  function readImages(files, onProgress) {
    var list = Array.prototype.slice.call(files || []).slice(0, 8), worker = null, texts = [], cur = 0;
    var say = function (p, t) { if (onProgress) onProgress(Math.max(0, Math.min(1, p)), t); };
    say(0, "Texterkennung wird geladen …");
    return loadTesseract().then(function (T) {
      return T.createWorker("deu", 1, {
        workerPath: "ocr/worker.min.js", corePath: "ocr/", langPath: "ocr", workerBlobURL: false, gzip: true,
        logger: function (m) {
          if (m.status === "recognizing text") say((cur + (m.progress || 0)) / list.length, "Text wird gelesen" + (list.length > 1 ? " (Bild " + (cur + 1) + " von " + list.length + ")" : "") + " …");
          else if (/loading|initializ/.test(m.status || "")) say(0.02, "Texterkennung wird vorbereitet …");
        }
      });
    }).then(function (w) {
      worker = w;
      return list.reduce(function (p, f, i) {
        return p.then(function () { cur = i; return worker.recognize(f); }).then(function (r) { texts.push((r && r.data && r.data.text) || ""); });
      }, Promise.resolve());
    }).then(function () {
      say(1, "Fertig gelesen.");
      return texts.join("\n\n");
    }).finally(function () { if (worker) worker.terminate().catch(function () {}); }).catch(function (e) { throw e && e.code ? e : { code: "ocr", message: String((e && e.message) || e) }; });
  }

  return { decode: decode, htmlText: htmlText, fixOcr: fixOcr, isoMinutes: isoMinutes, splitSteps: splitSteps, findRecipe: findRecipe,
    fromRecipe: fromRecipe, fromHtml: fromHtml, fromText: fromText, fromLink: fromLink, normUrl: normUrl, readImages: readImages, guess: guess, READERS: READERS };
})();
