# Home-Planer

Euer Haushalt an einem Ort, als Web-App fürs Handy: gemeinsame Kasse, Einkaufsliste, Rezepte und Kochideen, Kalender, Giessplan für die Pflanzen und wichtige Infos wie Mietvertrag und Versicherungen. Die App läuft im Browser, lässt sich aufs Handy legen und startet auch ohne Netz. Gebaut auf der Grundlage der Ferienkasse ([Splite-weiser](https://github.com/marcesss97/Splite-weiser)): gleiches Aussehen, gleicher Gruppen-Sync, gleiche Bedienung.

| Bereich | Was er kann |
|---|---|
| 🏠 **Start** | Was heute ansteht (Termine, geplantes Essen, durstige Pflanzen, Fristen), eine Kochidee, die nächsten Tage, die Einkaufsliste zum schnellen Ergänzen und das eigene Saldo der Kasse |
| 💰 **Kasse** | Wer hat was bezahlt, wer schuldet wem? Aufteilen gleich, nach Anteilen, nach Beträgen oder nach Positionen; Abrechnung mit möglichst wenigen Zahlungen; Statistik pro Monat und Kategorie; fremde Währungen zum Tageskurs |
| 🛒 **Einkauf** | Eine Zeile genügt («2 Liter Milch»); jeder Artikel landet von selbst in seiner Abteilung. Abhaken im Laden, Abgehaktes mit einem Tipp wieder auf die Liste, und danach «Als Ausgabe erfassen» |
| 🍳 **Rezepte** | Eure Rezeptsammlung und 26 eingebaute Kochideen. «Was koche ich heute?» würfelt eine Idee, die Suche findet Rezepte zu dem, was im Kühlschrank ist. Auf andere Portionen umrechnen, Zutaten mit einem Tipp auf die Einkaufsliste, Wochenplan mit «Wer kocht?» |
| 📅 **Kalender** | Monatsansicht und «Demnächst». Termine über mehrere Tage, mit Uhrzeit, wiederkehrend (wöchentlich, alle 2 Wochen, monatlich, jährlich), einzelne Wiederholungen streichbar. Arten wie Abfuhr, Geburtstag, Besuch, Ferien |
| 🪴 **Pflanzen** | Jede Pflanze mit ihrem Rhythmus. Die durstigsten zuerst, ein Tipp auf 💧 notiert, wer heute gegossen hat. Düngen, Raum, Zuständigkeit und Verlauf |
| 📁 **Infos** | Mietvertrag, Versicherungen, Abos, Kontakte, WLAN, Entsorgung: Vorlagen mit den üblichen Feldern, Kopieren mit einem Tipp, Telefonnummern zum Antippen, Links zu Dokumenten, Fristen mit Erinnerung in der Übersicht |

Dieses README führt zuerst durch drei Schritte und dient danach zum Nachschlagen.

1. [Veröffentlichen auf GitHub](#1-veröffentlichen-auf-github): 3 Minuten.
2. [Gruppen-Sync einschalten](#2-gruppen-sync-einschalten): 2 Minuten, wenn ihr das Firebase-Projekt der Ferienkasse mitbenutzt.
3. [Probelauf](#3-probelauf): 5 Minuten zu zweit.

Zum Nachschlagen: [Die Bereiche im Detail](#die-bereiche-im-detail) · [Wer sieht was?](#wer-sieht-was-sicherheit-und-daten) · [Sicherung](#sicherung) · [iPhone](#besonderheiten-auf-dem-iphone) · [Anpassen](#anpassen-und-aktualisieren) · [Tests](#tests) · [Was geprüft ist](#was-geprüft-ist-und-was-nicht) · [Lizenzen](#lizenzen)

## 1. Veröffentlichen auf GitHub

Die Dateien liegen bereits in diesem Repository. Es fehlt nur noch GitHub Pages:

1. Auf GitHub im Repository «Settings» öffnen, links «Pages».
2. Unter «Build and deployment» bei «Source» den Eintrag «Deploy from a branch» wählen, darunter den Branch `main` und den Ordner `/ (root)`, dann «Save». (Mit einem kostenlosen GitHub-Konto muss das Repository dafür «Public» sein.)
3. Nach ein bis zwei Minuten zeigt dieselbe Seite oben die Adresse: `https://marcesss97.github.io/Home-Planer/`. Das ist die App.

Öffentlich wird dabei nur der Programmcode. Haushalte und Einträge liegen nie im Repository.

**Aufs Handy legen:** Die App weist selbst darauf hin («Als App installieren»). Android (Chrome): im Hinweis auf «Installieren» tippen. iPhone (Safari): «Teilen», dann «Zum Home-Bildschirm». Installiert startet sie im Vollbild, ohne Browser-Leisten.

## 2. Gruppen-Sync einschalten

Mit dem Gruppen-Sync trägt jede Person auf dem eigenen Handy ein, alle sehen die Einträge der anderen sofort, und es geht auch ohne Netz: gesendet wird, sobald wieder Netz da ist. Der Sync läuft über Firebase von Google im kostenlosen Tarif «Spark».

**In `config.js` ist bereits das Firebase-Projekt der Ferienkasse eingetragen** (`splite-weiser-cf091`). Beide Apps teilen sich die Datenbank, jede in ihrem eigenen Bereich: die Ferienkasse unter `trips`, der Home-Planer unter `homes`. Dafür braucht das Projekt neue Sicherheitsregeln, die beide Bereiche erlauben. Das ist der einzige Schritt:

1. [console.firebase.google.com/project/splite-weiser-cf091/firestore/rules](https://console.firebase.google.com/project/splite-weiser-cf091/firestore/rules) öffnen (Firebase-Konsole, Firestore, Reiter «Regeln» / «Rules»).
2. Den vorhandenen Text ganz löschen, den ganzen Inhalt der Datei [`firestore.rules`](firestore.rules) aus diesem Repository einfügen und «Publish» wählen.
3. Den Home-Planer öffnen, oben rechts das Regler-Symbol, «Verbindung prüfen». Steht dort «Die Verbindung steht», ist alles bereit.

Wer die Regeln schon einmal eingesetzt hat, bevor es die Rezepte gab: bitte nochmals den aktuellen Inhalt von `firestore.rules` veröffentlichen. Sonst lehnt Firebase das Speichern von Rezepten ab.

Die neuen Regeln enthalten den Bereich der Ferienkasse unverändert; sie läuft danach weiter wie bisher. Bis die Regeln veröffentlicht sind, meldet der Home-Planer beim Anlegen eines Haushalts «Der Gruppen-Sync hat das Speichern abgelehnt».

**Lieber ein eigenes Firebase-Projekt?** Dann wie bei der Ferienkasse: Projekt anlegen, Firestore-Datenbank erstellen (Standort zum Beispiel `europe-west6 (Zürich)`, «Production mode»), die Regeln aus `firestore.rules` einsetzen, unter «Project settings» eine Web-App registrieren und den Block `const firebaseConfig = { … };` in `config.js` ersetzen. Die App führt unter «Gruppen-Sync einrichten» Schritt für Schritt durch, mit Knopf zum Kopieren der Regeln. Ohne Gruppen-Sync (`const firebaseConfig = null;`) liegt jeder Haushalt nur auf dem Gerät, auf dem er angelegt wurde.

| Meldung bei «Verbindung prüfen» | Was zu tun ist |
|---|---|
| «… lehnt den Zugriff aber ab. Es fehlen die Sicherheitsregeln des Home-Planers» | Schritt 2 oben |
| «… noch keine Firestore-Datenbank» | Im Projekt eine Firestore-Datenbank anlegen, Kennung `(default)` |
| «… lehnt die Angaben aus config.js ab» | Den Block in `config.js` nochmals aus der Firebase-Konsole kopieren |
| «Keine Antwort von Firebase» | Netz prüfen, dann die Werte in `config.js` |

**Kontingent.** Der kostenlose Tarif erlaubt pro Tag 50'000 Lesevorgänge und 20'000 Schreibvorgänge (Stand Oktober 2026). Ein Haushalt braucht davon einen Bruchteil, auch zusammen mit der Ferienkasse. Ist es doch einmal aufgebraucht, bleiben neue Einträge auf den Geräten und werden am nächsten Morgen nachgereicht. Kosten entstehen im Tarif «Spark» keine.

## 3. Probelauf

1. Einstellungen, «Verbindung prüfen»: Es erscheint «Die Verbindung steht».
2. Haushalt anlegen, oben «Einladen», das zweite Handy öffnet den Link oder scannt den QR-Code. Beide tippen auf das Fragezeichen auf dem Band und wählen ihren Namen.
3. Ein Handy setzt «Milch» auf die Einkaufsliste, das andere hakt sie ab. Beides erscheint ohne Neuladen auf dem anderen Handy.
4. Unter «Rezepte» eine Kochidee öffnen, «Übernehmen» und «Einplanen»: Das Rezept und das geplante Essen erscheinen auf dem anderen Handy.
5. Eine Pflanze eintragen und auf 💧 tippen: Auf dem anderen Handy steht «Gegossen».
6. Ein Handy in den Flugmodus, eine Ausgabe eintragen, Flugmodus aus: Die Ausgabe erscheint drüben.
7. Probe-Haushalt wieder löschen: Regler-Symbol im Haushalt, «Haushalt für alle löschen».

## Die Bereiche im Detail

**Kasse.** Wie in der Ferienkasse: Betrag, Kategorie, wer bezahlt hat, wie aufgeteilt wird. «Anteile» passt, wenn ein Zimmer grösser ist; «Positionen» für Kassenzettel, auf denen nicht alles allen gehört. Unter «Abrechnung» steht, wer wem wie viel zahlt, mit möglichst wenigen Zahlungen; «Als bezahlt eintragen» gleicht aus. Die Statistik zeigt diesen Monat, die letzten zwölf Monate oder alles, nach Kategorie und pro Monat, dazu Stempel wie «Kühlschrankfüller». Fremde Währungen (etwa ein Einkauf in Konstanz) werden zum Tageskurs der EZB umgerechnet; der Kurs wird mit der Buchung gespeichert und lässt sich von Hand überschreiben.

**Einkaufsliste.** Mengen gehen gleich mit: «3 Joghurt», «Äpfel 1kg», «500 g Hackfleisch». Die Abteilung errät die App aus einem Stichwortverzeichnis (Milch, Käse & Eier · Brot · Getränke · Drogerie …); ein Tipp auf den Artikel ändert sie. Abgehakte Artikel warten unter «Im Wagen». Beim nächsten Mal genügt es, ein paar Buchstaben zu tippen: Abgehaktes erscheint als Vorschlag und kommt mit einem Tipp zurück auf die Liste. «Erledigte löschen» räumt auf.

**Rezepte und Kochideen.** Ganz oben würfelt «Was koche ich heute?» eine Idee aus euren Rezepten und den eingebauten Kochideen; Filter für Vegi, Schnell und Günstig, und was in den letzten Tagen gekocht wurde, kommt nicht dran. Das Suchfeld nimmt auch mehrere Zutaten («Zucchetti, Feta») und zeigt, welche Rezepte dazu passen. Ein Rezept rechnet die Zutaten auf beliebig viele Portionen um. «Auf die Einkaufsliste» setzt die angekreuzten Zutaten mit Menge auf die Liste, in die richtige Abteilung und mit dem Vermerk «für …»; Grundvorrat wie Salz, Öl oder Bouillon ist dabei schon abgewählt, und was schon auf der Liste steht, kommt nicht doppelt. Eine Kochidee wird mit «Übernehmen» zu eurem eigenen Rezept, das ihr anpassen könnt. Eigene Rezepte: Zutaten und Schritte je eine Zeile, dazu Zeit, Portionen, Merkmale, Link zum Original, Favoriten und «Heute gekocht». Der **Wochenplan** zeigt die nächsten sieben Tage; ein geplantes Essen ist ein Termin der Art «Essen» und steht deshalb auch im Kalender und auf «Start», mit «Marc kocht».

**Kalender.** Ein Tipp auf einen Tag zeigt seine Termine; «Demnächst» listet die nächsten 30 Tage, jeden Termin einmal. Bei der Art «Abfuhr» ist «Jede Woche» schon gewählt, bei «Geburtstag» «Jedes Jahr». Fällt eine Abfuhr wegen eines Feiertags aus, öffnet man sie an diesem Tag und wählt «Nur am … ausfallen lassen». Monatliche Termine am 29. bis 31. fallen in kürzeren Monaten aus, wie in den gängigen Kalendern.

**Pflanzen.** Rhythmus in Tagen (Knöpfe für die üblichen Abstände), Raum, optional Dünger und wer zuständig ist. Die Liste zeigt die durstigsten zuerst: rot ist überfällig, orange heute fällig. Die Zahl auf dem Reiter «Pflanzen» sagt, wie viele heute Wasser brauchen. Ein Tipp auf die Pflanze zeigt den Verlauf: wer wann gegossen oder gedüngt hat.

**Infos.** Jede Art bringt Vorschläge für Felder mit (Versicherung: Versicherer, Policennummer, Prämie, Telefon Schadenmeldung, Kündigungsfrist …); leere Felder werden in der Ansicht ausgeblendet. Felder mit «Passwort», «PIN» oder «Code» im Namen sind verdeckt, bis man auf das Auge tippt. Ein Datum (etwa der letzte Tag, um zu kündigen) erscheint 60 Tage vorher in der Übersicht. **Dateien speichert der Home-Planer nicht:** Den Vertrag als PDF etwa in Google Drive, OneDrive oder iCloud ablegen, dort freigeben und den Link im Eintrag einfügen.

## Wer sieht was? Sicherheit und Daten

- **Der Einladungslink ist der Schlüssel.** Wer ihn hat, sieht den ganzen Haushalt, auch alle Infos, und kann alles ändern und löschen. Es gibt kein Konto und kein Passwort. Gebt den Link nur an die Leute, die bei euch wohnen.
- **Keine geheimen Zugangsdaten speichern:** keine PINs, keine Passwörter fürs E-Banking oder fürs E-Mail. Das WLAN-Passwort für Gäste, Policennummern und Kundennummern sind in Ordnung.
- Der Link enthält eine zufällige Kennung aus 22 Zeichen. Sie lässt sich nicht erraten, und die Regeln in `firestore.rules` verbieten es, Haushalte aufzulisten oder zu durchsuchen. Die Kennung steht hinter dem `#` der Adresse und wird deshalb nicht an GitHub übertragen.
- «Notiert von» und «Gegossen von» sind Angaben, kein Beweis. Für einen Haushalt, der sich vertraut, passt das.
- **Die Werte in `config.js` sind keine Passwörter.** Sie sagen dem Browser nur, welches Firebase-Projekt gemeint ist, und sind bei jeder Firebase-Web-App öffentlich. Geschützt werden die Daten durch die Regeln.
- Links in Infos öffnet die App nur, wenn sie mit `https://` oder `http://` beginnen.
- Wo die Daten liegen: im Speicher des Browsers auf jedem Gerät und, mit Gruppen-Sync, in der Firestore-Datenbank am gewählten Standort. Programm, Schriften und Bibliotheken kommen aus diesem Repository, nicht von fremden Servern.
- Ferienkasse und Home-Planer liegen unter derselben Adresse (`marcesss97.github.io`) und teilen sich im Browser einen Speicher. Sie kommen sich nicht in die Quere: Der Home-Planer schreibt nur Einträge, die mit `hp.` beginnen, und hat einen eigenen Zwischenspeicher für den Sync.

## Sicherung

- Herunterladen: im Haushalt das Regler-Symbol, dann «Sicherung herunterladen». Es entsteht eine Datei wie `homeplaner-wg-seefeld-2026-10-10.json` mit Kasse, Einkaufsliste, Rezepten, Kalender, Pflanzen und Infos.
- Einlesen: Startseite, Einstellungen, «Sicherung einlesen». Die Sicherung wird als neuer Haushalt auf diesem Gerät angelegt und lässt sich danach über «Einladen» für alle freigeben.
- Für Haushalte, die nur auf einem Gerät liegen, ist die Sicherung der einzige Schutz.

## Besonderheiten auf dem iPhone

- Die App vom Home-Bildschirm hat einen eigenen Speicher, getrennt von Safari. Sie beginnt deshalb leer.
- Geteilte Haushalte holst du mit dem Einladungslink hinein: Link kopieren, in der App «Mit Link beitreten», einfügen.
- Links aus dem Chat öffnet das iPhone in Safari, nicht in der App. Beides funktioniert und zeigt dieselben geteilten Haushalte.

## Anpassen und aktualisieren

- Eine Datei ändern: auf GitHub öffnen, Stift, ändern, «Commit changes». Nach etwa einer Minute ist die neue Fassung veröffentlicht; die App holt sie beim nächsten Start mit Netz.
- Name und Farben: `manifest.webmanifest`, `index.html` und der Anfang von `style.css` (Farben als Variablen, hell und dunkel).
- Kategorien der Kasse, Abteilungen und Stichwörter der Einkaufsliste, Arten von Terminen, Pflanzenbilder, Vorlagen der Infos, Bilder und Merkmale der Rezepte und Avatare: in `logic.js`.
- Die eingebauten Kochideen: in `ideen.js`. Eine eigene Idee ist ein weiterer Eintrag nach demselben Muster.

| Datei | Aufgabe |
|---|---|
| `index.html`, `style.css` | Seite und Aussehen |
| `config.js` | Einstellungen dieser Installation (Gruppen-Sync) |
| `app.js` | Hülle: Liste der Haushalte, Übersicht, Navigation, Einladen, Einstellungen |
| `ui.js` | Gemeinsame Bausteine der Oberfläche |
| `kasse.js`, `einkauf.js`, `rezepte.js`, `kalender.js`, `pflanzen.js`, `infos.js` | Die sechs Bereiche |
| `ideen.js` | Die eingebauten Kochideen |
| `logic.js` | Rechnen und Prüfen: Aufteilen, Ausgleich, Statistik, Wiederholungen, Giessplan, Portionen umrechnen, Lesen gespeicherter Daten |
| `store.js` | Speichern auf dem Gerät und im Gruppen-Sync |
| `rates.js` | Tageskurse |
| `sw.js`, `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png`, `favicon.svg` | Installierbare App, Start ohne Netz |
| `firestore.rules` | Sicherheitsregeln für die Firebase-Konsole (Home-Planer und Ferienkasse) |
| `vendor-*.js`, `*.woff2` | Mitgelieferte Bibliotheken und Schriften, siehe `LICENSES.txt` |
| `tests/` | Automatische Prüfungen (werden von der App nicht geladen) |

## Tests

```sh
node tests/logic.test.js          # Rechenlogik, ohne Browser
npm install playwright            # einmalig, für den Browser-Test
node tests/e2e.test.js            # die ganze App in Chromium, mit nachgebautem Sync-Server und zwei Handys
```

## Was geprüft ist und was nicht

Geprüft, automatisch und wiederholbar:

- Die Rechenlogik mit Tausenden Zufallsfällen: Aufteilen auf den Rappen genau, Salden und Abrechnung (alle sind danach quitt, höchstens so viele Zahlungen wie nötig), Lesen von Beträgen, Statistik pro Monat, Wiederholungen im Kalender gegen eine Nachzählung Tag für Tag, Giessplan, Abteilungen und Mengen der Einkaufsliste, Portionen umrechnen, Suche nach Zutaten, Vollständigkeit aller Kochideen, und der Umgang mit unsinnigen oder manipulierten Daten (etwa Links mit `javascript:`).
- Die ganze App in Chromium in 21 Schritten: Haushalt anlegen, jeder Bereich mit seinen Formularen (bei den Rezepten: würfeln, Portionen, Einkaufsliste, übernehmen, einplanen, Kühlschrank-Suche), Neuladen, Zurück-Taste, Personen und Avatare, Sicherung herunterladen und einlesen, Löschen, schmale Handys mit 320 Pixeln. Der Gruppen-Sync mit einem nachgebauten Firestore-Server und zwei getrennten Handys: beitreten, Einträge (auch Rezepte) erscheinen gegenseitig, gleichzeitige Änderungen, für alle löschen, fehlende Regeln, fehlende Datenbank, einen Haushalt vom Gerät freigeben. Dazu ein Start mit der echten Firebase-Bibliothek ohne Netz.

Nicht geprüft, weil es von hier aus nicht möglich war:

- der Betrieb mit dem echten Firebase-Projekt und den Regeln aus `firestore.rules`,
- echte iPhones und Android-Handys (Installieren, Teilen-Menü, Aussehen der Emojis),
- die Veröffentlichung auf GitHub Pages selbst.

Dafür ist der [Probelauf](#3-probelauf) da.

## Lizenzen

Die mitgelieferten Bibliotheken und Schriften stehen unter freien Lizenzen: Firebase JavaScript SDK und htm (Apache 2.0), Preact und qrcode-generator (MIT), die Schriften Fredoka, Anton und IBM Plex Mono (SIL Open Font License 1.1). Die Emojis zeichnet jedes Gerät mit seiner eigenen Emoji-Schrift. Die vollständigen Angaben und Texte stehen in [`LICENSES.txt`](LICENSES.txt).
