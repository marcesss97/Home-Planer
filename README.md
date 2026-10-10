# Home-Planer

Euer Haushalt an einem Ort, als Web-App fürs Handy: gemeinsame Kasse, Einkaufsliste für Migros oder Coop, Rezeptbuch mit Kochmodus, Kalender mit Anschluss an Outlook und das iPhone, Giessplan für die Pflanzen, wichtige Infos wie Mietvertrag und Versicherungen und Mitteilungen aufs Handy. Die App läuft im Browser, lässt sich aufs Handy legen und startet auch ohne Netz. Gebaut auf der Grundlage der Ferienkasse ([Splite-weiser](https://github.com/marcesss97/Splite-weiser)): gleiches Aussehen, gleicher Gruppen-Sync, gleiche Bedienung.

| Bereich | Was er kann |
|---|---|
| 🏠 **Start** | Was heute ansteht (Termine, geplantes Essen, durstige Pflanzen, Fristen), eine Kochidee, die nächsten Tage, die Einkaufsliste zum schnellen Ergänzen und das eigene Saldo der Kasse |
| 💰 **Kasse** | Wer hat was bezahlt, wer schuldet wem? Aufteilen gleich, nach Anteilen, nach Beträgen oder nach Positionen; Abrechnung mit möglichst wenigen Zahlungen; Statistik pro Monat und Kategorie; fremde Währungen zum Tageskurs. **Monatsabrechnung** der Einkäufe: was im Monat gekauft wurde, wer wie viel bezahlt hat, mit welchen Zahlungen der Monat quitt ist; als Text, Tabelle (CSV) oder PDF |
| 🛒 **Einkauf** | Eine Zeile genügt («2 Liter Milch»); jeder Artikel landet von selbst in seiner Abteilung. Für Migros oder Coop sortiert in der Reihenfolge des Ladens (anpassbar an eure Filiale), mit Suche im Onlineshop. Abhaken im Laden, Abgehaktes mit einem Tipp wieder auf die Liste, die Liste teilen, und danach «Als Ausgabe erfassen» |
| 🍳 **Rezepte** | Rezepte aus einem Link, einem Screenshot oder einem kopierten Text übernehmen: Die App erkennt Zutaten, Schritte, Zeit und Portionen von selbst. Der **Kochmodus** führt Schritt für Schritt durchs Rezept, mit Timern, Vorlesen und Bildschirm, der anbleibt. Ein **Rezeptbuch** mit 455 Rezepten aus aller Welt, mit den Sammlungen «Glasiertes Poulet mit Reis» und «Im Stil von Ottolenghi», sauberen **Filtern** (Ernährung, Zeit, Gang, Hauptzutat, Küche, Zubereitung, Geschmack) einem **Menü-Finder**, der zu Zeit, Lust und Stimmung das passende Gericht oder ein ganzes Menü vorschlägt, und **«Ich habe noch …»**: Rezepte aus dem, was im Kühlschrank ist. **Glutenfrei** erkennt die App bei jedem Rezept selbst und nennt den Ersatz (etwa Tamari statt Sojasauce). Zu jedem Rezept **Notizen**: wie es war (😋 🙂 😕) und was ihr nächstes Mal anders macht; das steht dann im Kochmodus. «Was koche ich heute?» würfelt eine Idee, die Suche findet Rezepte zu dem, was im Kühlschrank ist. Auf andere Portionen umrechnen, Zutaten mit einem Tipp auf die Einkaufsliste, Wochenplan mit «Wer kocht?» |
| 📅 **Kalender** | Monatsansicht und «Demnächst». Termine über mehrere Tage, mit Uhrzeit, wiederkehrend (wöchentlich, alle 2 Wochen, monatlich, jährlich), einzelne Wiederholungen streichbar. Arten wie Abfuhr, Geburtstag, Besuch, Ferien. **In Outlook und im iPhone-Kalender** als Abo, das sich selbst aktualisiert, oder als Datei; Termine aus Outlook-Dateien übernehmen |
| 🪴 **Pflanzen** | Jede Pflanze mit ihrem Rhythmus. Die durstigsten zuerst, ein Tipp auf 💧 notiert, wer heute gegossen hat. Düngen, Raum, Zuständigkeit und Verlauf |
| 📁 **Infos** | Mietvertrag, Versicherungen, Abos, Kontakte, WLAN, Entsorgung: Vorlagen mit den üblichen Feldern, Kopieren mit einem Tipp, Telefonnummern zum Antippen, Links zu Dokumenten, Fristen mit Erinnerung in der Übersicht |
| 🔔 **Mitteilungen** | Aufs Handy, auch wenn die App zu ist: Neues auf der Einkaufsliste, «Ich gehe einkaufen», Ausgaben mit dem eigenen Anteil, Abfuhr am Vorabend, wer heute kocht, Pflanzen, Geburtstage, Termine eine Stunde vorher, Fristen, Monatsabrechnung. Jedes Gerät wählt, was kommt, mit Ruhezeit in der Nacht |

Dieses README führt zuerst durch drei Schritte und dient danach zum Nachschlagen.

1. [Veröffentlichen auf GitHub](#1-veröffentlichen-auf-github): 3 Minuten.
2. [Gruppen-Sync einschalten](#2-gruppen-sync-einschalten): 2 Minuten, wenn ihr das Firebase-Projekt der Ferienkasse mitbenutzt.
3. [Probelauf](#3-probelauf): 5 Minuten zu zweit.
4. [Dienst für Kalender und Mitteilungen](#4-dienst-für-kalender-und-mitteilungen): einmal 15 Minuten bei Cloudflare, freiwillig. Damit abonnieren Outlook und das iPhone den Kalender, und Mitteilungen kommen aufs Handy.

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

Die neuen Regeln enthalten den Bereich der Ferienkasse unverändert; sie läuft danach weiter wie bisher. Bis die Regeln veröffentlicht sind, legt der Home-Planer neue Haushalte nur auf dem Gerät an und zeigt auf der Startseite «Gruppen-Sync: noch ein Schritt». Sind die Regeln da, verschwindet der Hinweis nach «Nochmals prüfen»; einen solchen Haushalt gebt ihr dann über «Einladen» für alle frei.

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
4. Unter «Rezepte» im Rezeptbuch «Glasiertes Poulet mit Reis» öffnen, ein Rezept wählen, «Übernehmen» und «Einplanen»: Das Rezept und das geplante Essen erscheinen auf dem anderen Handy. Eine Notiz dazu («Wie war's?») sieht das andere Handy auch.
5. Unter «Rezepte» auf «Aus Link» tippen und die Adresse eines Rezepts von Fooby, Migusto oder Betty Bossi einfügen: Nach ein paar Sekunden steht das Rezept zum Prüfen da. «Speichern», dann «Kochmodus starten» und bei einem Schritt mit Zeitangabe den Timer antippen.
6. Einen Screenshot eines Rezepts (etwa aus Instagram) über «Screenshot» wählen: Zutaten und Schritte erscheinen im Formular.
7. Auf der Einkaufsliste «Migros» oder «Coop» wählen: Die Abteilungen stehen in der Reihenfolge des Ladens.
8. Eine Pflanze eintragen und auf 💧 tippen: Auf dem anderen Handy steht «Gegossen».
9. Ein Handy in den Flugmodus, eine Ausgabe eintragen, Flugmodus aus: Die Ausgabe erscheint drüben.
10. Mit dem Dienst aus Abschnitt 4: auf beiden Handys «Mitteilungen aufs Handy?», «Einrichten», einschalten und «Probe schicken». Dann setzt ein Handy «Brot» auf die Liste: Nach etwa zehn Sekunden meldet sich das andere.
11. Probe-Haushalt wieder löschen: Regler-Symbol im Haushalt, «Haushalt für alle löschen».

## 4. Dienst für Kalender und Mitteilungen

Zwei Dinge kann eine Web-App allein nicht: einen Kalender liefern, den Outlook und das iPhone selbst abonnieren, und Mitteilungen aufs Handy schicken, wenn die App zu ist. Beides erledigt ein kleiner Dienst, der einmal eingerichtet wird. Er läuft kostenlos bei Cloudflare (Tarif «Free»: 100'000 Anfragen pro Tag, Zeitpläne und eine kleine Ablage inbegriffen, keine Kreditkarte) und braucht den Gruppen-Sync.

1. Auf [dash.cloudflare.com](https://dash.cloudflare.com/sign-up) ein kostenloses Konto anlegen (E-Mail genügt).
2. Links «Workers & Pages» (oder «Compute», «Workers»), «Create», «Start with Hello World». Als Namen etwa `home-planer-dienst`, dann «Deploy».
3. «Edit code»: den ganzen Beispielcode löschen, den ganzen Inhalt der Datei [`dienst-worker.js`](dienst-worker.js) aus diesem Repository einfügen, «Deploy».
4. Zurück beim Worker «Settings», «Variables and Secrets», «Add»: Typ «Secret», Name `DIENST_SCHLUESSEL`, als Wert eine lange Zufallszeichenfolge (mindestens 32 Zeichen, etwa aus einem Passwort-Generator). Speichern beziehungsweise «Deploy». Den Wert braucht ihr danach nie mehr; ändert ihn nicht, sonst müssen sich alle Handys für Mitteilungen neu anmelden.
5. **Für Mitteilungen eine Ablage:** links «Storage & Databases», «Workers KV», «Create» und einen Namen wählen, etwa `home-planer`. Dann beim Worker «Settings», «Bindings», «Add», «KV namespace»: bei «Variable name» `HP` eintragen, den eben erstellten Namespace wählen, «Deploy».
6. **Für Erinnerungen ein Zeitplan:** beim Worker «Settings», «Trigger Events», «Add», «Cron Triggers». Als Ausdruck `*/15 * * * *` (alle 15 Minuten), «Add» beziehungsweise «Deploy».
7. Oben steht die Adresse des Dienstes, etwa `https://home-planer-dienst.marc.workers.dev`. Wer sie im Browser öffnet, sieht «Home-Planer Dienst: bereit. Kalender: ja. Mitteilungen: ja.»
8. Auf GitHub die Datei `config.js` öffnen und die Adresse eintragen: `const dienst = "https://home-planer-dienst.marc.workers.dev";`, dann «Commit changes».

Wer früher nur den Kalender-Dienst eingerichtet hat: Schritt 3 mit der neuen Datei wiederholen und die Schritte 5, 6 und 8 ergänzen. Das alte Secret `KALENDER_SCHLUESSEL` gilt weiter, die bisherigen Kalender-Links auch.

### Mitteilungen aufs Handy

Auf jedem Handy einzeln: den Haushalt öffnen, auf der Startseite bei «Mitteilungen aufs Handy?» auf «Einrichten» tippen (oder Regler-Symbol, «Mitteilungen auf diesem Gerät»). Wählen, wer man ist und was kommen soll, dann «Mitteilungen einschalten» und «Erlauben». «Probe schicken» zeigt sofort, ob es klappt.

- **iPhone und iPad:** nur in der App vom Home-Bildschirm, ab iOS 16.4. In Safari geht es nicht; das ist eine Vorgabe von Apple.
- **Android:** Chrome, Firefox oder Samsung Internet, im Browser und als installierte App. **Computer:** Chrome, Edge, Firefox und Safari.

| Art | Wann | An wen |
|---|---|---|
| 🛒 Einkaufsliste | sobald jemand etwas einträgt (was kurz nacheinander kommt, als eine Mitteilung), und bei «Ich gehe einkaufen» | alle anderen |
| 💰 Kasse | neue Ausgabe mit dem eigenen Anteil, Zahlung erhalten | wer betroffen ist |
| 🧾 Monatsabrechnung | am 1. um 18 Uhr, wer wem wie viel überweist; am 8. nochmals, wenn noch etwas offen ist | wer zahlt oder bekommt |
| 📅 Termine | neuer Termin; eine Stunde vor Terminen mit Uhrzeit; ganztägige um 7.30 Uhr | wer beim Termin eingetragen ist, sonst alle |
| 🗑️ Abfuhr | am Vorabend um 19 Uhr | wer eingetragen ist, sonst alle |
| 🎂 Geburtstage | drei Tage vorher um 18 Uhr und am Tag um 8 Uhr | alle |
| 🍳 Kochen | um 15.30 Uhr, wenn man heute kocht; wenn jemand Essen in den Wochenplan setzt | wer kocht; alle anderen |
| 🪴 Pflanzen | um 8 Uhr, was gegossen oder gedüngt werden muss | wer zuständig ist, sonst alle |
| 📁 Fristen | 30, 7 und 1 Tag vor einer Frist aus den Infos und am Tag selbst, um 9 Uhr | alle |

- Was man selbst einträgt, geht nur an die anderen. Die **Ruhezeit** (22 bis 7 Uhr, abschaltbar) hält nachts Mitteilungen über neue Einträge zurück; Erinnerungen an Termine mit Uhrzeit kommen trotzdem.
- **«Ich gehe einkaufen»** auf der Einkaufsliste schickt den anderen sofort eine Mitteilung: Sie können noch schnell eintragen, was fehlt.
- Ein Tipp auf eine Mitteilung öffnet den Haushalt im passenden Bereich.
- Unter «Als Nächstes» zeigt das Fenster «Mitteilungen» die Erinnerungen der nächsten sieben Tage, unter «Im Haushalt», welche Geräte angemeldet sind und ob der Zeitplan läuft.

| Meldung im Fenster «Mitteilungen» | Was zu tun ist |
|---|---|
| «Für Mitteilungen braucht der Home-Planer einmal einen kleinen Dienst» | Schritte 1 bis 8 oben; `dienst` in `config.js` ist noch leer |
| «Im Dienst fehlt noch die Ablage» | Schritt 5: die KV-Bindung muss genau `HP` heissen |
| «Erinnerungen brauchen noch den Zeitplan» | Schritt 6: der Cron Trigger fehlt. Neue Einträge melden sich trotzdem |
| «Mitteilungen sind gesperrt» | Einmal «Nicht erlauben» getippt: in den Einstellungen des Browsers erlauben, auf dem iPhone unter Einstellungen › Mitteilungen › Home-Planer |
| Probe kommt nicht an | Handy nicht im Fokus- oder Nicht-stören-Modus? Sonst Mitteilungen aus- und wieder einschalten |

### Kalender in Outlook und auf dem iPhone

Die Termine des Haushalts erscheinen in eurem eigenen Kalender, auf dem iPhone, in Outlook (privat oder bei der Arbeit) und in Google Kalender, und bleiben von selbst aktuell. Das läuft über ein **Kalender-Abo**: Der Kalender holt sich die Termine regelmässig über einen Link, den der Dienst liefert.

Im Home-Planer: «Kalender», oben «Outlook & iPhone».

- **iPhone:** «Im iPhone-Kalender abonnieren» antippen, dann «Abonnieren». Wie oft das iPhone nachschaut, steht unter Einstellungen › Kalender › Accounts › Abonnierte Kalender › «Abrufen».
- **Outlook privat (outlook.com, Hotmail):** «In Outlook abonnieren (privat)». **Outlook bei der Arbeit (Microsoft 365):** «In Outlook abonnieren (Arbeit)». **Outlook auf dem Computer:** «Link kopieren», dann in Outlook «Kalender hinzufügen» › «Aus dem Internet» und einfügen. Outlook holt Änderungen alle paar Stunden; schneller lässt es sich nicht einstellen.
- **Welche Termine?** Mit den Knöpfen darüber lässt sich der Kalender auf einzelne Arten beschränken, etwa nur Abfuhr und Geburtstage. Jede Auswahl ergibt einen eigenen Link.

Das Abo geht in eine Richtung: vom Home-Planer in euren Kalender. Eintragen und ändern geht weiterhin im Home-Planer; Änderungen im iPhone- oder Outlook-Kalender kommen nicht zurück. Beides zusammen ginge nur mit Anmeldung bei Microsoft und Apple, und Apple bietet für den iPhone-Kalender keinen Zugang für Web-Apps an.

**Ohne Kalender-Dienst** geht es mit Dateien: «Alle Termine als Datei» ergibt eine `.ics`-Datei, die Outlook und der Kalender des Computers mit einem Doppelklick übernehmen (spätere Änderungen kommen so nicht mit). Bei einem einzelnen Termin legt «In meinen Kalender» ihn in Outlook oder auf dem iPhone ab. In die andere Richtung holt «Kalenderdatei einlesen» Termine aus Outlook in den Home-Planer, etwa eine Einladung oder einen exportierten Kalender. Dieselbe Datei nochmals einzulesen aktualisiert die Termine, statt sie doppelt einzutragen.

| Meldung im Fenster «Outlook & iPhone» | Was zu tun ist |
|---|---|
| «Der Kalender-Dienst antwortet nicht» | Adresse bei `dienst` in `config.js` prüfen: genau so, wie Cloudflare sie zeigt, mit `https://` und ohne Schrägstrich am Schluss |
| «… noch nicht fertig eingerichtet» | Schritt 4: das Secret `DIENST_SCHLUESSEL` fehlt oder ist kürzer als 16 Zeichen |
| «Firebase lehnt ab» | Sind die Regeln aus `firestore.rules` veröffentlicht? Ist der API-Schlüssel in der Google Cloud Console auf Websites beschränkt, darf er für den Dienst keine solche Beschränkung haben; sonst im Dienst einen eigenen, unbeschränkten Schlüssel bei `FIREBASE_API_KEY` eintragen |
| «… findet diesen Haushalt nicht» | Der Haushalt liegt nur auf dem Gerät («Einladen», «Für alle freigeben»), oder `dienst-worker.js` nennt ein anderes Firebase-Projekt als `config.js` |

## Die Bereiche im Detail

**Monatsabrechnung.** In der Kasse oben «Monatsabrechnung»: ein Monat für sich, wahlweise nur die Einkäufe (Kategorien «Lebensmittel» und «Haushalt») oder alle Ausgaben. Sie zeigt das Total mit dem Vergleich zum Vormonat, die Kategorien, je Person, was sie bezahlt hat und wie gross ihr Anteil ist, und die Zahlungen, mit denen dieser Monat quitt ist. «Als bezahlt eintragen» bucht sie für diesen Monat (in der Gesamtabrechnung zählen sie wie jede andere Zahlung). Weitergeben als Text («Teilen», «Kopieren»), als Tabelle für Excel (CSV) oder über «Drucken / PDF». In den ersten zehn Tagen eines Monats erinnert die Startseite, wenn die Einkäufe des Vormonats noch offen sind.

**Kasse.** Wie in der Ferienkasse: Betrag, Kategorie, wer bezahlt hat, wie aufgeteilt wird. «Anteile» passt, wenn ein Zimmer grösser ist; «Positionen» für Kassenzettel, auf denen nicht alles allen gehört. Unter «Abrechnung» steht, wer wem wie viel zahlt, mit möglichst wenigen Zahlungen; «Als bezahlt eintragen» gleicht aus. Die Statistik zeigt diesen Monat, die letzten zwölf Monate oder alles, nach Kategorie und pro Monat, dazu Stempel wie «Kühlschrankfüller». Fremde Währungen (etwa ein Einkauf in Konstanz) werden zum Tageskurs der EZB umgerechnet; der Kurs wird mit der Buchung gespeichert und lässt sich von Hand überschreiben.

**Einkaufsliste.** Mengen gehen gleich mit: «3 Joghurt», «Äpfel 1kg», «500 g Hackfleisch». Die Abteilung errät die App aus einem Stichwortverzeichnis (Milch, Käse & Eier · Brot · Getränke · Drogerie …); ein Tipp auf den Artikel ändert sie. Abgehakte Artikel warten unter «Im Wagen». Beim nächsten Mal genügt es, ein paar Buchstaben zu tippen: Abgehaktes erscheint als Vorschlag und kommt mit einem Tipp zurück auf die Liste. «Erledigte löschen» räumt auf.

**Migros oder Coop.** Oben auf der Liste wählt ihr den Laden («Egal wo», «Migros», «Coop»); die Wahl gilt für den ganzen Haushalt. Die Abteilungen stehen dann in der typischen Reihenfolge des Ladens, vom Eingang zur Kasse. Jede Filiale ist anders: Unter «Reihenfolge» schiebt ihr die Abteilungen so, wie ihr durch euren Laden geht, getrennt für Migros und Coop. Ein Tipp auf einen Artikel bietet «Im Onlineshop suchen» bei Migros oder Coop an, etwa für den Lieferdienst. «Liste teilen» schickt die offene Liste, nach Abteilungen geordnet, als Text in den Chat (wo das Handy kein Teilen kennt, wird sie kopiert).

**Rezepte und Kochideen.** Ganz oben würfelt «Was koche ich heute?» eine Idee aus euren Rezepten und den eingebauten Kochideen; Filter für Vegi, Schnell und Günstig, und was in den letzten Tagen gekocht wurde, kommt nicht dran. Das Suchfeld nimmt auch mehrere Zutaten («Zucchetti, Feta») und zeigt, welche Rezepte dazu passen. Ein Rezept rechnet die Zutaten auf beliebig viele Portionen um. «Auf die Einkaufsliste» setzt die angekreuzten Zutaten mit Menge auf die Liste, in die richtige Abteilung und mit dem Vermerk «für …»; Grundvorrat wie Salz, Öl oder Bouillon ist dabei schon abgewählt, und was schon auf der Liste steht, kommt nicht doppelt. Eine Kochidee wird mit «Übernehmen» zu eurem eigenen Rezept, das ihr anpassen könnt. Eigene Rezepte: Zutaten und Schritte je eine Zeile, dazu Zeit, Portionen, Merkmale, Link zum Original, Favoriten und «Heute gekocht». Der **Wochenplan** zeigt die nächsten sieben Tage; ein geplantes Essen ist ein Termin der Art «Essen» und steht deshalb auch im Kalender und auf «Start», mit «Marc kocht».

**Rezepte übernehmen.** Auf dem Reiter «Rezepte» stehen drei Wege; jedes Mal entsteht ein Entwurf, den ihr im Formular prüft und speichert. Danach geht es direkt weiter auf die Einkaufsliste oder in den Kochmodus.

- **Aus Link:** die Adresse einer Rezeptseite einfügen (auch mitten in einem Text, etwa aus einem Chat). Die meisten Rezeptseiten, darunter Fooby (Coop), Migusto (Migros), Betty Bossi, Swissmilk und Chefkoch, beschreiben ihre Rezepte zusätzlich in einem maschinenlesbaren Format (schema.org); daraus übernimmt die App Titel, Zutaten, Schritte, Zeit, Portionen und das Original als Link. Fehlt dieses Format, liest sie den Text der Seite. Weil Browser fremde Seiten nicht direkt lesen dürfen, holt ein öffentlicher Lesedienst die Seite (siehe [Wer sieht was?](#wer-sieht-was-sicherheit-und-daten)).
- **Screenshot:** ein oder mehrere Bilder, zum Beispiel die Zutaten und die Zubereitung auf zwei Screenshots aus Instagram, TikTok oder einem Kochbuch-Foto. Die Texterkennung (Tesseract) läuft auf dem Gerät selbst. Beim ersten Mal lädt sie rund 5 MB aus dem Ordner `ocr/`, danach geht es auch ohne Netz. Unter «Erkannten Text anzeigen» seht ihr, was gelesen wurde.
- **Aus Text:** eine Instagram-Beschreibung oder ein Rezept aus einer Nachricht einfügen. Überschriften wie «Zutaten» und «Zubereitung» helfen, nötig sind sie nicht; Hashtags und Emojis fallen weg.
- **Teilen an die App (Android):** Ist der Home-Planer installiert, steht er im Teilen-Menü von Chrome, Instagram, der Galerie und anderen Apps. Ein geteilter Link, Text oder Screenshot öffnet direkt den Import. Danach fragt die App, in welchen Haushalt das Rezept soll, wenn es mehrere gibt.

Bild, Art und Merkmale (Vegi, Vegan, Schnell) errät die App aus Titel und Zutaten; alles lässt sich im Formular ändern. Erkennung ist nie perfekt: Ein kurzer Blick auf den Entwurf lohnt sich, vor allem bei Screenshots.

**Rezeptbuch.** Unten im Reiter «Rezepte» stehen die Sammlungen «Glasiertes Poulet mit Reis» (14 Rezepte von Teriyaki über Gochujang und Karamell-Ingwer bis Granatapfel und Harissa-Honig) und «Im Stil von Ottolenghi» (15 eigene Rezepte im Geist seiner Küche: geröstetes Gemüse, Tahini, Joghurt, viele Kräuter, Granatapfel, Sumach, Za'atar). Darunter die Weltgegenden: Asien (Thai, Chinesisch, Japanisch, Koreanisch, Indisch, Vietnamesisch, Indonesien und Malaysia), Europa (Schweiz, Italien, Frankreich, Spanien, Griechenland, Deutschland und Österreich, Osteuropa, Skandinavien und Grossbritannien), Nahost und Nordafrika, Amerika. Im Buch lässt sich nach Küche, Vegi, Vegan, Schnell, Günstig, Gang und Zutaten filtern; unter jedem Rezept steht «In dieselbe Richtung» mit ähnlichen Gerichten. Ein Rezept aus dem Buch wird mit «Übernehmen» oder der ersten Notiz zu eurem eigenen; dann lässt es sich anpassen. Originalrezepte von Ottolenghi und anderen holt ihr mit «Aus Link» von deren Websites. Die Rezepte des Buchs stehen in `ideen.js` und `buch-*.js`.

**Rezepte finden.** «Filter» neben dem Suchfeld öffnet die Suche über eure Rezepte und das ganze Buch. Filtern lässt sich nach Ernährung (Vegi, Vegan, Glutenfrei, Glutenfrei ohne Ersatz, Ohne Milchprodukte), Zeit (bis 15, 30, 45 oder 60 Minuten), Gang, Hauptzutat (Poulet, Rind, Schwein, Lamm, Fisch, Meeresfrüchte, Tofu, Hülsenfrüchte, Eier, Käse, Gemüse, Pasta, Reis, Kartoffeln), Weltgegend und Küche, Zubereitung (Ofen, Pfanne, ohne Herd), Geschmack (leicht oder deftig, mild oder scharf), «passend für» (günstig, Kinder, Gäste, Vorkochen), Sammlung und Quelle. Innerhalb einer Gruppe genügt eines (Poulet oder Fisch), zwischen den Gruppen gilt alles (Poulet und schnell). Aktive Filter stehen als Knöpfe über der Liste und verschwinden mit einem Tipp; sortiert wird nach «Passend», «Schnellste zuerst», «Beliebteste» oder A–Z. Hauptzutat, Zubereitung, Schärfe und «leicht/deftig» leitet die App aus Zutaten und Schritten ab, deshalb funktionieren die Filter auch für eigene und übernommene Rezepte.

**Menü-Finder.** Im Reiter «Rezepte» und auf «Start» bei der Kochidee: Ein paar Fragen (wie viel Zeit, worauf ihr Lust habt, was es sein soll, Ernährung, Stimmung, Gäste oder Kinder, was im Kühlschrank ist), und der Finder schlägt das passende Gericht vor, mit Begründung («30 Min.», «mit Feta», «ähnlich wie eure Favoriten»). Was euch geschmeckt hat, kommt eher; was ihr in den letzten Tagen gekocht oder schon eingeplant habt, rutscht nach hinten; «Nicht nochmals» kommt nie. «Noch ein Vorschlag» blättert weiter. Mit «Ganzes Menü» stellt er zum Hauptgang eine Vorspeise und ein Dessert aus derselben Weltgegend zusammen (zu einem deftigen Hauptgang etwas Leichtes) und setzt auf Wunsch alles auf die Einkaufsliste.

**Ich habe noch … (Kühlschrank).** Im Reiter «Rezepte» und auf «Start» (🧊): Tragt ein, was noch da ist, per Schnellwahl («Eier», «Poulet», «Rahm» …), über das Feld (mehrere mit Komma) oder mit einem Tipp auf «Kürzlich eingekauft» (was auf der Einkaufsliste in den letzten sieben Tagen abgehakt wurde). Die Liste gilt für den ganzen Haushalt. Die App sucht Rezepte, die möglichst viel davon verwerten, und ordnet sie nach «Sofort kochbar», «Fehlt nur wenig» (eine oder zwei Zutaten) und «Mit etwas mehr Einkauf»; jede Zeile sagt, was verwertet wird und was fehlt, und «Die fehlenden auf die Liste» setzt den Rest auf die Einkaufsliste. Sie kennt Oberbegriffe («Käse» passt zu Gruyère, «Pasta» zu Penne, «Poulet» zu Pouletschenkel), zählt Grundvorrat (Salz, Öl, Zwiebeln, Knoblauch, Gewürze, Bouillon) als vorhanden, wenn ihr das so lasst, und frische Kräuter zum Garnieren nicht als fehlend. Unter «Was gesucht wird» lassen sich Gang, Ernährung und Zeit wählen. Nach dem Kochen fragt der Kochmodus «Aufgebraucht?» und nimmt die verwerteten Zutaten aus der Liste.

**Glutenfrei.** Jedes Rezept zeigt, ob es glutenfrei ist: «Glutenfrei» (wie es dasteht), «Glutenfrei mit Ersatz» mit der Liste, was zu ersetzen ist (Tamari statt Sojasauce, glutenfreie Teigwaren, Maizena statt Mehl zum Binden, Maistortillas, Reisnudeln, Quinoa statt Couscous …), oder «Enthält Gluten» (Teige aus viel Mehl, Gerste, Dinkel, Filo- und Strudelteig). Dazu, was auf dem Etikett zu prüfen ist (Bouillon, Miso, Currypaste …). Kocht euer Haushalt glutenfrei (Regler-Symbol im Haushalt, «Bei uns wird glutenfrei gekocht»), sind Würfel, Rezeptsuche und Menü-Finder von Anfang an auf glutenfrei gestellt, der Ersatz steht offen im Rezept und auf der ersten Seite des Kochmodus, und auf der Einkaufsliste steht beim Ersatz «glutenfrei: Tamari». Die Erkennung arbeitet mit den Zutatennamen; sie ersetzt bei Zöliakie nicht den Blick aufs Etikett. Ein eigenes Rezept lässt sich im Formular von Hand als «Glutenfrei» markieren.

**Notizen und Bewertung.** Unter jedem Rezept «Wie war's? Notiz schreiben»: 😋 Sehr gut, 🙂 Ganz okay oder 😕 Nicht nochmals, dazu ein paar Worte. Mit «Das mache ich nächstes Mal anders» steht die Notiz oben im Rezept und beim nächsten Kochen auf der ersten Seite des Kochmodus («Vom letzten Mal»). Der Kochmodus fragt am Schluss selbst nach. Die Liste zeigt die letzte Bewertung neben dem Titel, und was zuletzt «Nicht nochmals» bekam, schlägt der Würfel nicht mehr vor. Mehrere Personen können gleichzeitig Notizen schreiben, ohne sich zu überschreiben.

**Kochmodus.** «Kochmodus starten» in einem Rezept öffnet eine ganze Bildschirmseite pro Schritt, gross lesbar, mit den Zutaten, die der Schritt braucht. Zuerst kommt «Zuerst bereitstellen» mit allen Zutaten für die gewählte Zahl Portionen. Weiter geht es mit «Weiter», mit einem Wisch zur Seite oder mit den Pfeiltasten. Steht in einem Schritt eine Zeit («12 Minuten kochen», «1½ Stunden schmoren», «eine halbe Stunde kühl stellen»), startet ein Tipp den Timer. Mehrere Timer laufen gleichzeitig, auch wenn ihr weiterblättert; ist die Zeit um, klingelt und vibriert das Handy, bis ihr «OK» tippt. Der Bildschirm bleibt an, solange der Kochmodus offen ist (wo der Browser das erlaubt). Der Lautsprecher oben liest jeden Schritt vor, «Aa» macht die Schrift grösser. Am Schluss fragt er «Wie war's?» und merkt mit «Als gekocht merken» das Datum, damit «Was koche ich heute?» das Rezept eine Weile auslässt. Schliesst ihr den Kochmodus, während ein Timer läuft, fragt die App nach.

**Kalender.** Ein Tipp auf einen Tag zeigt seine Termine; «Demnächst» listet die nächsten 30 Tage, jeden Termin einmal. Bei der Art «Abfuhr» ist «Jede Woche» schon gewählt, bei «Geburtstag» «Jedes Jahr». Fällt eine Abfuhr wegen eines Feiertags aus, öffnet man sie an diesem Tag und wählt «Nur am … ausfallen lassen». Monatliche Termine am 29. bis 31. fallen in kürzeren Monaten aus, wie in den gängigen Kalendern. Wie die Termine in Outlook und auf das iPhone kommen, steht in [Abschnitt 4](#4-kalender-in-outlook-und-auf-dem-iphone).

**Pflanzen.** Rhythmus in Tagen (Knöpfe für die üblichen Abstände), Raum, optional Dünger und wer zuständig ist. Die Liste zeigt die durstigsten zuerst: rot ist überfällig, orange heute fällig. Die Zahl auf dem Reiter «Pflanzen» sagt, wie viele heute Wasser brauchen. Ein Tipp auf die Pflanze zeigt den Verlauf: wer wann gegossen oder gedüngt hat.

**Infos.** Jede Art bringt Vorschläge für Felder mit (Versicherung: Versicherer, Policennummer, Prämie, Telefon Schadenmeldung, Kündigungsfrist …); leere Felder werden in der Ansicht ausgeblendet. Felder mit «Passwort», «PIN» oder «Code» im Namen sind verdeckt, bis man auf das Auge tippt. Ein Datum (etwa der letzte Tag, um zu kündigen) erscheint 60 Tage vorher in der Übersicht. **Dateien speichert der Home-Planer nicht:** Den Vertrag als PDF etwa in Google Drive, OneDrive oder iCloud ablegen, dort freigeben und den Link im Eintrag einfügen.

## Wer sieht was? Sicherheit und Daten

- **Der Einladungslink ist der Schlüssel.** Wer ihn hat, sieht den ganzen Haushalt, auch alle Infos, und kann alles ändern und löschen. Es gibt kein Konto und kein Passwort. Gebt den Link nur an die Leute, die bei euch wohnen.
- **Keine geheimen Zugangsdaten speichern:** keine PINs, keine Passwörter fürs E-Banking oder fürs E-Mail. Das WLAN-Passwort für Gäste, Policennummern und Kundennummern sind in Ordnung.
- Der Link enthält eine zufällige Kennung aus 22 Zeichen. Sie lässt sich nicht erraten, und die Regeln in `firestore.rules` verbieten es, Haushalte aufzulisten oder zu durchsuchen. Die Kennung steht hinter dem `#` der Adresse und wird deshalb nicht an GitHub übertragen.
- «Notiert von» und «Gegossen von» sind Angaben, kein Beweis. Für einen Haushalt, der sich vertraut, passt das.
- **Die Werte in `config.js` sind keine Passwörter.** Sie sagen dem Browser nur, welches Firebase-Projekt gemeint ist, und sind bei jeder Firebase-Web-App öffentlich. Geschützt werden die Daten durch die Regeln.
- Links in Infos öffnet die App nur, wenn sie mit `https://` oder `http://` beginnen.
- **Rezept aus einem Link:** Die Adresse des Rezepts geht an einen öffentlichen Lesedienst (der Reihe nach `api.allorigins.win`, `api.codetabs.com`, `r.jina.ai`), der die Seite holt und dem Browser zurückgibt. Mehr nicht: keine Haushaltsdaten, keine Kennung. Wer das nicht möchte, nimmt Screenshot oder Text.
- **Kalender-Abo:** Der Link enthält nicht die Kennung des Haushalts, sondern eine mit dem Secret des Dienstes verschlüsselte Fassung. Wer ihn hat, sieht die Termine (Titel, Zeit, Notiz, wer betroffen ist), aber nicht Kasse, Infos oder den Rest des Haushalts. Der Link landet bei Apple, Microsoft oder Google, je nachdem, wo ihr ihn abonniert. «Link erneuern» macht alle bisherigen Links ungültig. Der Dienst bei Cloudflare liest die Termine bei jedem Abruf aus Firestore und speichert sie nicht.
- **Mitteilungen:** Der Text jeder Mitteilung ist Ende-zu-Ende verschlüsselt (Web Push nach RFC 8291): Apple, Google, Mozilla und Microsoft stellen sie zu, können sie aber nicht lesen. Der Dienst speichert in seiner eigenen Ablage nur, was ein Gerät zum Empfangen braucht: die Adresse beim Push-Dienst des Herstellers, die Schlüssel des Geräts, die Person und die gewählten Arten. Die Kennung des Haushalts liegt dort nur verschlüsselt. Ein Gerät, das sich 60 Tage nicht meldet, fällt von selbst heraus; «Ausschalten» meldet es sofort ab. Der Dienst schickt nur an die Push-Dienste der Hersteller, nie an andere Adressen. Was eine Mitteilung sagt, steht in `erinnerungen.js`.
- **Rezept aus Screenshots:** Die Texterkennung läuft auf dem Gerät. Die Bilder verlassen es nicht und werden nicht gespeichert; gespeichert wird nur das Rezept, das ihr daraus macht.
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
- Im Teilen-Menü des iPhones erscheint der Home-Planer nicht: Apple erlaubt das Web-Apps nicht. Rezepte kommen trotzdem hinein: Link kopieren und bei «Aus Link» einfügen, Screenshots bei «Screenshot» aus den Fotos wählen, oder Text kopieren und bei «Aus Text» einfügen.

## Anpassen und aktualisieren

- Eine Datei ändern: auf GitHub öffnen, Stift, ändern, «Commit changes». Nach etwa einer Minute ist die neue Fassung veröffentlicht; die App holt sie beim nächsten Start mit Netz.
- Name und Farben: `manifest.webmanifest`, `index.html` und der Anfang von `style.css` (Farben als Variablen, hell und dunkel).
- Kategorien der Kasse, Abteilungen und Stichwörter der Einkaufsliste, Arten von Terminen, Pflanzenbilder, Vorlagen der Infos, Bilder und Merkmale der Rezepte und Avatare: in `logic.js`.
- Das Rezeptbuch: `ideen.js` und die Dateien `buch-*.js`. Ein eigenes Rezept ist ein weiterer Eintrag nach demselben Muster; `node tests/buch.test.js` prüft danach, ob alles stimmt (vegi und vegan, Timer, Abteilungen). Küchen und Sammlungen: `KITCHENS` und `COLLECTIONS` in `logic.js`.
- Der Dienst für Kalender und Mitteilungen enthält Kopien von `logic.js`, `ics.js` und `erinnerungen.js`. Wer eine davon ändert, überträgt die Änderung mit `node tests/dienst.test.js --update` in `dienst-worker.js` und fügt die Datei danach bei Cloudflare nochmals ein (Schritt 3 in Abschnitt 4). Uhrzeiten und Texte der Mitteilungen stehen in `erinnerungen.js`.
- Die typische Reihenfolge der Abteilungen bei Migros und Coop und die Adressen der Onlineshops: `STORES` in `logic.js`.
- Die Lesedienste für Rezept-Links: `READERS` in `import.js`.

| Datei | Aufgabe |
|---|---|
| `index.html`, `style.css` | Seite und Aussehen |
| `config.js` | Einstellungen dieser Installation (Gruppen-Sync, Dienst für Kalender und Mitteilungen) |
| `app.js` | Hülle: Liste der Haushalte, Übersicht, Navigation, Einladen, Einstellungen |
| `ui.js` | Gemeinsame Bausteine der Oberfläche |
| `kasse.js`, `einkauf.js`, `rezepte.js`, `kalender.js`, `pflanzen.js`, `infos.js` | Die sechs Bereiche |
| `kochen.js` | Der Kochmodus |
| `import.js` | Rezepte aus Links, Screenshots und Text erkennen |
| `ideen.js`, `buch-*.js` | Das Rezeptbuch |
| `ics.js` | Kalenderdateien schreiben und lesen (für Outlook, iPhone, Google) |
| `erinnerungen.js` | Mitteilungen: was sie sagen, wann Erinnerungen kommen, an wen |
| `push.js`, `mitteilungen.js` | Mitteilungen auf dem Gerät: anmelden, Auswahl, neue Einträge melden; das Fenster «Mitteilungen» |
| `dienst-worker.js` | Der Dienst für Kalender-Abo und Mitteilungen bei Cloudflare (läuft nicht in der App, siehe Abschnitt 4) |
| `logic.js` | Rechnen und Prüfen: Aufteilen, Ausgleich, Statistik, Wiederholungen, Giessplan, Portionen umrechnen, Lesen gespeicherter Daten |
| `store.js` | Speichern auf dem Gerät und im Gruppen-Sync |
| `rates.js` | Tageskurse |
| `sw.js`, `manifest.webmanifest`, `icon-*.png`, `badge-96.png`, `apple-touch-icon.png`, `favicon.svg` | Installierbare App, Start ohne Netz, Mitteilungen anzeigen |
| `firestore.rules` | Sicherheitsregeln für die Firebase-Konsole (Home-Planer und Ferienkasse) |
| `vendor-*.js`, `*.woff2` | Mitgelieferte Bibliotheken und Schriften, siehe `LICENSES.txt` |
| `ocr/` | Texterkennung für Screenshots (Tesseract.js mit deutschem Sprachmodell); wird erst beim ersten Screenshot geladen |
| `tests/` | Automatische Prüfungen (werden von der App nicht geladen) |

## Tests

```sh
node tests/logic.test.js          # Rechenlogik, ohne Browser
node tests/import.test.js         # Rezepte erkennen, Timer finden, Reihenfolge der Läden, ohne Browser
node tests/kalender.test.js       # Kalenderdateien und Kalender-Abo des Dienstes, ohne Browser
node tests/dienst.test.js         # Mitteilungen und der Dienst: Erinnerungen, Verschlüsselung, Ablage, Zeitplan
node tests/buch.test.js           # das Rezeptbuch: vollständig, vegi/vegan stimmig, Timer, Abteilungen
npm install playwright            # einmalig, für den Browser-Test
node tests/e2e.test.js            # die ganze App in Chromium, mit nachgebautem Sync-Server und zwei Handys
```

## Was geprüft ist und was nicht

Geprüft, automatisch und wiederholbar:

- Die Rechenlogik mit Tausenden Zufallsfällen: Aufteilen auf den Rappen genau, Salden und Abrechnung (alle sind danach quitt, höchstens so viele Zahlungen wie nötig), Lesen von Beträgen, Statistik pro Monat, Wiederholungen im Kalender gegen eine Nachzählung Tag für Tag, Giessplan, Abteilungen und Mengen der Einkaufsliste, Portionen umrechnen, Suche nach Zutaten, Vollständigkeit aller Kochideen, und der Umgang mit unsinnigen oder manipulierten Daten (etwa Links mit `javascript:`).
- Das Erkennen von Rezepten an nachgebauten Seiten nach dem Muster von Fooby, Migusto, Chefkoch und Instagram (`tests/fixtures/`), an Screenshot-Text mit typischen Lesefehlern und an Beschreibungen ohne Überschriften; das Durchprobieren der Lesedienste, wenn einer ausfällt; Zeitangaben in Schritten («5 bis 8 Minuten», «1½ Stunden», «Viertelstunde»); die Reihenfolge der Abteilungen.
- Kalenderdateien: 300 Zufallstermine (Wiederholungen, gestrichene Tage, Monatsende, 29. Februar, Sommerzeit) als Kalender geschrieben und von einer unabhängigen Bibliothek (Python `icalendar` mit `recurring_ical_events`) wieder aufgelöst: Alle 5831 Termine stimmen mit dem Kalender der App überein. Dazu das Lesen einer Outlook-Datei mit Zeitzonen, Erinnerungen und Serien, und der Kalender-Dienst mit nachgebautem Firestore: Schlüssel, mehrere Seiten Termine, Auswahl der Arten, erneuerter Link, fremde und kaputte Schlüssel. Die Abfragen des Dienstes wurden gegen den echten Firestore-Server ausprobiert (lesend).
- Glutenfrei, Hauptzutat, Zubereitung, Filter, Kühlschrank (Wortstämme, Oberbegriffe, kurze Wörter wie «Ei» nie in «Reis», Grundvorrat, Kräuter), Menü-Finder (harte Grenzen, Bewertungen, zuletzt Gekochtes, ganzes Menü) und Monatsabrechnung (Anteile, Ausgleich nur für diesen Monat, Einkäufe getrennt von allen Ausgaben, CSV) mit eigenen Testfällen.
- Das Rezeptbuch: alle 455 Rezepte vollständig, eindeutig, mit Küche; als vegi oder vegan markierte Rezepte ohne Fleisch, Fisch, Fischsauce oder tierische Zutaten; Rezepte ab 25 Minuten mit Zeitangaben für die Timer; jede Zutat mit einer Abteilung auf der Einkaufsliste.
- Mitteilungen: jede Erinnerung zu ihrer Zeit und nur an die Betroffenen (Abfuhr, Geburtstage, Termine eine Stunde vorher, ganztägige, Kochen, Pflanzen, Fristen, Monatsabrechnung am 1. und 8.), Sommerzeit, die Texte bei neuen Einträgen mit dem Anteil jeder Person, Auswahl, Ruhezeit, nie an sich selbst, ausgetretene Personen. Der Dienst mit nachgebautem Firestore, nachgebauter Ablage und nachgebauten Push-Diensten: Die Verschlüsselung ergibt Byte für Byte das Beispiel aus RFC 8291, jede verschickte Mitteilung wird mit dem Schlüssel des Geräts wieder entschlüsselt, die Unterschrift (VAPID) wird geprüft; Anmelden mit allen Prüfungen, nur Push-Dienste der Hersteller, abgemeldete Geräte verschwinden, zu viele Mitteilungen werden abgewiesen, und der Zeitplan liest pro Viertelstunde nur, was fällig sein kann. Derselbe Dienst lief zusätzlich in der echten Cloudflare-Laufzeit (workerd) mit Ablage und Zeitplan.
- Die ganze App in Chromium in 35 Schritten: Haushalt anlegen, jeder Bereich mit seinen Formularen (bei den Rezepten: würfeln, Portionen, Einkaufsliste, übernehmen, einplanen, Kühlschrank-Suche; Rezept aus einem Link, aus Text und aus einem echten Bild mit der Texterkennung; Kochmodus mit Timer, Klingeln und Stoppen; Teilen an die App über den Service Worker; Einkaufsliste für Migros und Coop mit eigener Reihenfolge; Rezeptbuch mit Sammlung, Suche, zurück ins Buch, Notizen, Tipp und Bewertung im Kochmodus, «Nicht nochmals» fällt aus dem Würfel; Kalender als Datei, einzelner Termin, Outlook-Datei einlesen und nochmals einlesen; glutenfreier Haushalt mit Ersatz im Rezept, im Kochmodus und auf der Einkaufsliste; Rezeptsuche mit Filtern, Sortierung und zurück aus dem Rezept; Menü-Finder mit Begründung, weiterem Vorschlag und ganzem Menü; Kühlschrank mit «sofort kochbar», Fehlendem auf die Liste und «Aufgebraucht»; Monatsabrechnung mit Ausgleich und CSV), Neuladen, Zurück-Taste, Personen und Avatare, Sicherung herunterladen und einlesen, Löschen, schmale Handys mit 320 Pixeln. Der Gruppen-Sync mit einem nachgebauten Firestore-Server und zwei getrennten Handys: beitreten, Einträge (auch Rezepte) erscheinen gegenseitig, gleichzeitige Änderungen, für alle löschen, fehlende Regeln, fehlende Datenbank, einen Haushalt vom Gerät freigeben, Kalender-Abo mit Links für iPhone und Outlook und «Link erneuern», Mitteilungen einschalten, Arten wählen, Probe, Ruhezeit, neue Einträge und «Ich gehe einkaufen» gehen an den Dienst, ein Tipp auf eine Mitteilung öffnet den richtigen Bereich, der Service Worker zeigt sie an, ausschalten; Notizen von zwei Handys gleichzeitig zum selben Rezept. Dazu ein Start mit der echten Firebase-Bibliothek ohne Netz.

Nicht geprüft, weil es von hier aus nicht möglich war:

- der Betrieb mit dem echten Firebase-Projekt und den Regeln aus `firestore.rules` (geprüft ist nur lesend, dass die Regeln veröffentlicht sind),
- das echte Abo in Outlook und im iPhone-Kalender und der Dienst in einem Cloudflare-Konto (geprüft sind die Kalenderdateien und der Dienst mit nachgebautem Firestore, auch in der echten Cloudflare-Laufzeit),
- echte Mitteilungen über die Push-Dienste von Apple und Google auf echten Handys (geprüft sind die Verschlüsselung nach dem Standard, die Unterschrift und das Anzeigen im Service Worker),
- echte iPhones und Android-Handys (Installieren, Teilen-Menü, Aussehen der Emojis, Bildschirm-bleibt-an, Vorlesen, Vibrieren),
- echte Rezeptseiten und die öffentlichen Lesedienste: Sie waren von hier aus nicht erreichbar, geprüft ist mit nachgebauten Seiten. Ändert eine Seite ihren Aufbau oder fällt ein Lesedienst weg, hilft der Weg über Screenshot oder Text,
- die Texterkennung an echten Handy-Screenshots (geprüft mit einem in Chromium gezeichneten Rezeptbild),
- die Veröffentlichung auf GitHub Pages selbst.

Dafür ist der [Probelauf](#3-probelauf) da.

## Lizenzen

Die mitgelieferten Bibliotheken und Schriften stehen unter freien Lizenzen: Firebase JavaScript SDK und htm (Apache 2.0), Preact und qrcode-generator (MIT), Tesseract.js mit Tesseract OCR und dem deutschen Sprachmodell (Apache 2.0; darin Leptonica, libjpeg der Independent JPEG Group, libpng, zlib, libtiff und libwebp unter ihren freien Lizenzen), die Schriften Fredoka, Anton und IBM Plex Mono (SIL Open Font License 1.1). Die Emojis zeichnet jedes Gerät mit seiner eigenen Emoji-Schrift. Die Rezepte des Rezeptbuchs sind eigene Fassungen; die Sammlung «Im Stil von Ottolenghi» enthält eigene Rezepte im Geist seiner Küche, keine aus seinen Büchern. Die vollständigen Angaben und Texte stehen in [`LICENSES.txt`](LICENSES.txt).
