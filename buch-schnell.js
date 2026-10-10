/* Home-Planer: Rezeptbuch – Schnelle Feierabendküche & Bowls (Hauptgerichte in höchstens 30 Minuten: Pasta und Nudeln,
   Pfanne und Wok, Bowls, Wraps und Sandwiches, Eier und Tofu, Kartoffeln, Polenta und Gnocchi).
   Eigene Rezepte nach demselben Muster wie in ideen.js. Kennungen (emoji, cat, tags, kitchen, coll) aus logic.js. time in Minuten. */
window.HP_IDEEN = (window.HP_IDEEN || []).concat([
  /* ---------- Pasta und Nudeln ---------- */
  {
    id: "idee-aglio-olio-peperoncino", title: "Spaghetti aglio, olio e peperoncino", kitchen: "it", emoji: "pasta", cat: "main", tags: ["vegi", "vegan", "quick", "cheap"], time: 20, serves: 4,
    note: "Das neapolitanische Notfallessen, wenn der Kühlschrank leer ist: Knoblauch, gutes Olivenöl und Chili. Entscheidend ist das stärkehaltige Kochwasser – es bindet Öl und Pasta zu einer leichten Sauce.",
    ingr: ["400 g Spaghetti", "5 Knoblauchzehen", "1 getrocknete Chilischote oder ½ TL Chiliflocken", "1 dl Olivenöl", "1 Bund glattblättrige Petersilie", "Salz"],
    steps: ["Reichlich Wasser aufkochen, salzen und die Spaghetti darin al dente kochen, je nach Sorte 9–11 Minuten.",
      "Inzwischen Knoblauch in feine Scheiben schneiden, die Chilischote zerbröseln und die Petersilie fein hacken.",
      "Olivenöl in einer grossen Bratpfanne bei kleiner Hitze erwärmen. Knoblauch und Chili darin 3–4 Minuten sanft ziehen lassen, bis der Knoblauch hellgolden ist. Nicht braun werden lassen, sonst wird er bitter.",
      "Spaghetti mit einer Zange direkt aus dem Topf in die Pfanne heben und etwa 1 dl Kochwasser dazugeben. Kräftig schwenken, bis eine leicht sämige Sauce entsteht. Petersilie untermischen und sofort servieren."]
  },
  {
    id: "idee-cacio-e-pepe", title: "Cacio e Pepe", kitchen: "it", emoji: "pasta", cat: "main", tags: ["vegi", "quick"], time: 20, serves: 4,
    note: "Römischer Klassiker aus drei Zutaten: Pecorino, schwarzer Pfeffer und Pastawasser. Der Käse schmilzt nur cremig, wenn die Pfanne nicht mehr kocht – sonst klumpt er. Mit halb Pecorino, halb Parmesan wird es milder.",
    ingr: ["400 g Spaghetti oder Tonnarelli", "150 g Pecorino romano, sehr fein gerieben", "2 TL schwarze Pfefferkörner", "Salz"],
    steps: ["Pfefferkörner im Mörser grob zerstossen und in einer grossen Bratpfanne ohne Fett 1–2 Minuten rösten, bis sie duften. Pfanne vom Herd ziehen.",
      "Spaghetti in wenig, nur leicht gesalzenem Wasser al dente kochen, etwa 9–11 Minuten. So wird das Kochwasser schön stärkehaltig. Vor dem Abgiessen 3 dl Kochwasser abschöpfen.",
      "Pecorino in einer Schüssel mit etwa 1 dl lauwarmem Kochwasser zu einer dicken, glatten Paste verrühren.",
      "Etwa 1 dl Kochwasser zum Pfeffer in die Pfanne giessen, Spaghetti dazugeben und kurz schwenken. Die Käsepaste darübergeben und kräftig mischen, bis eine cremige Sauce entsteht. Bei Bedarf mit Kochwasser lockern und sofort servieren."]
  },
  {
    id: "idee-spaghetti-puttanesca", title: "Spaghetti alla Puttanesca", kitchen: "it", emoji: "pasta", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Würzige Sauce aus Tomaten, Oliven, Kapern und Sardellen, gekocht aus dem Vorrat. Die Sardellen zerfallen im Öl und geben Tiefe, ohne nach Fisch zu schmecken.",
    ingr: ["400 g Spaghetti", "4 Sardellenfilets in Öl", "2 Knoblauchzehen", "1 Dose gehackte Tomaten (400 g)", "80 g schwarze Oliven, entsteint", "2 EL Kapern", "½ TL Chiliflocken", "3 EL Olivenöl", "½ Bund Petersilie", "Salz"],
    steps: ["Spaghetti in reichlich Salzwasser al dente kochen, je nach Sorte 9–11 Minuten.",
      "Knoblauch fein hacken. Olivenöl in einer Bratpfanne erwärmen, Sardellenfilets, Knoblauch und Chiliflocken darin bei mittlerer Hitze etwa 2 Minuten anziehen lassen, bis die Sardellen zerfallen.",
      "Tomaten, Oliven und Kapern dazugeben und offen etwa 10 Minuten köcheln, bis die Sauce eingedickt ist. Vorsichtig salzen, Oliven und Kapern bringen schon Salz mit.",
      "Spaghetti abgiessen, in der Sauce schwenken und mit gehackter Petersilie bestreuen."]
  },
  {
    id: "idee-pasta-al-tonno", title: "Pasta al Tonno", kitchen: "it", emoji: "pasta", cat: "main", tags: ["quick", "cheap"], time: 25, serves: 4,
    note: "Tomatensauce mit Thon aus der Dose – der Vorratsklassiker für Tage ohne Einkauf. Ein Spritzer Zitrone und frische Petersilie machen sie frisch und leicht.",
    ingr: ["400 g Penne", "2 Dosen Thon in Olivenöl (à 155 g)", "1 Zwiebel", "1 Knoblauchzehe", "1 Dose gehackte Tomaten (400 g)", "1 EL Kapern", "½ Zitrone", "½ Bund Petersilie", "Salz, Pfeffer"],
    steps: ["Zwiebel und Knoblauch fein hacken. Thon abtropfen lassen und 2 EL vom Öl in einer Pfanne erhitzen. Zwiebel und Knoblauch darin etwa 3 Minuten glasig dünsten.",
      "Tomaten und Kapern dazugeben, mit Salz und Pfeffer würzen und offen etwa 10 Minuten köcheln.",
      "Inzwischen die Penne in reichlich Salzwasser al dente kochen, meist 10–11 Minuten.",
      "Thon grob zerpflücken und in der Sauce nur noch erwärmen. Mit etwas Zitronensaft abschmecken, mit den Penne mischen und mit gehackter Petersilie bestreuen."]
  },
  {
    id: "idee-orecchiette-broccoli-salsiccia", title: "Orecchiette mit Broccoli und Salsiccia", kitchen: "it", emoji: "pasta", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Aus Apulien: Die kleinen Öhrchen fangen Broccoli und Wurstbrät auf. Salsiccia gibt es beim Metzger oder im Italien-Regal, grobe Bratwurst geht auch. Vegi-Variante: nur Broccoli, Chili und geröstete Pinienkerne.",
    ingr: ["400 g Orecchiette", "500 g Broccoli", "300 g Salsiccia oder grobe Bratwurst", "2 Knoblauchzehen", "½ TL Chiliflocken", "3 EL Olivenöl", "40 g Pecorino oder Parmesan, gerieben", "Salz, Pfeffer"],
    steps: ["Broccoli in kleine Röschen teilen, den Strunk schälen und in dünne Scheiben schneiden. Salsiccia aus der Haut drücken und in kleine Stücke zupfen.",
      "Reichlich Salzwasser aufkochen. Orecchiette darin 12–14 Minuten kochen, nach etwa 5 Minuten den Broccoli dazugeben und mitgaren.",
      "Inzwischen Olivenöl in einer grossen Bratpfanne erhitzen und die Salsiccia darin 5–6 Minuten krümelig und goldbraun braten. Knoblauch in Scheiben schneiden und mit den Chiliflocken kurz mitbraten.",
      "Orecchiette und Broccoli abgiessen, dabei 1 dl Kochwasser auffangen. Alles in der Pfanne mit etwas Kochwasser schwenken, bis der Broccoli leicht zerfällt und sich mit der Pasta verbindet. Mit Pecorino und Pfeffer bestreuen."]
  },
  {
    id: "idee-linguine-crevetten-zitrone", title: "Linguine mit Crevetten, Zitrone und Chili", kitchen: "it", emoji: "pasta", cat: "main", tags: ["quick", "guests"], time: 25, serves: 4,
    note: "Schnell und trotzdem festlich. Tiefgekühlte rohe Crevetten über Nacht im Kühlschrank oder 15 Minuten in kaltem Wasser auftauen und gut trocken tupfen, damit sie anbraten statt kochen.",
    ingr: ["400 g Linguine", "400 g rohe Crevetten, geschält", "250 g Cherrytomaten", "3 Knoblauchzehen", "1 rote Chilischote", "1 Bio-Zitrone", "1 dl Weisswein (nach Belieben)", "4 EL Olivenöl", "½ Bund Petersilie", "Salz, Pfeffer"],
    steps: ["Linguine in reichlich Salzwasser al dente kochen, je nach Sorte 9–11 Minuten. Vor dem Abgiessen 1 dl Kochwasser abschöpfen.",
      "Knoblauch in Scheiben schneiden, Chilischote fein hacken, Cherrytomaten halbieren. Von der Zitrone die Schale fein abreiben und den Saft auspressen.",
      "Olivenöl in einer grossen Bratpfanne stark erhitzen. Crevetten trocken tupfen, salzen und pro Seite 1–2 Minuten braten, bis sie rosa sind. Herausnehmen.",
      "Hitze reduzieren, Knoblauch, Chili und Tomaten in die Pfanne geben und etwa 3 Minuten dünsten. Mit Weisswein ablöschen und kurz einkochen.",
      "Linguine, Crevetten, Zitronenschale und etwas Kochwasser dazugeben und gut schwenken. Mit Zitronensaft, Salz und Pfeffer abschmecken und mit gehackter Petersilie bestreuen."]
  },
  {
    id: "idee-zitronen-pasta-ricotta-spinat", title: "Zitronen-Pasta mit Ricotta und Spinat", kitchen: "it", emoji: "pasta", cat: "main", tags: ["vegi", "quick"], time: 20, serves: 4,
    note: "Frisch und cremig, ohne dass die Sauce kochen muss: Ricotta wird mit Zitrone und Pastawasser glatt gerührt. Jungen Spinat gibt es im Beutel; Rucola geht auch.",
    ingr: ["400 g Fusilli oder Casarecce", "250 g Ricotta", "1 Bio-Zitrone", "150 g junger Spinat", "1 Knoblauchzehe, fein gerieben", "50 g Parmesan, gerieben", "2 EL Olivenöl", "Salz, Pfeffer, Muskat"],
    steps: ["Fusilli in reichlich Salzwasser al dente kochen, je nach Sorte 10–12 Minuten. Vor dem Abgiessen 2 dl Kochwasser abschöpfen.",
      "Inzwischen von der Zitrone die Schale fein abreiben und 2 EL Saft auspressen. Ricotta mit Zitronenschale, Zitronensaft, Knoblauch, Parmesan und Olivenöl in einer grossen Schüssel verrühren und mit Salz, Pfeffer und Muskat würzen.",
      "Spinat in ein Sieb geben und die Fusilli darüber abgiessen, so fällt er sofort zusammen.",
      "Pasta und Spinat zur Ricottamasse geben, mit 1–2 dl Kochwasser zu einer cremigen Sauce mischen und sofort servieren."]
  },
  {
    id: "idee-pasta-alla-norma", title: "Pasta alla Norma", kitchen: "it", emoji: "pasta", cat: "main", tags: ["vegi", "quick"], time: 30, serves: 4,
    note: "Sizilianisch: gebratene Auberginen in Tomatensauce, mit Basilikum und gesalzenem Ricotta. Ricotta salata gibt es im Italien-Regal oder beim Käsehändler; geriebener Pecorino oder Feta ersetzt ihn gut.",
    ingr: ["400 g Rigatoni", "2 Auberginen (ca. 600 g)", "2 Knoblauchzehen", "1 Dose gehackte Tomaten (400 g)", "½ TL Chiliflocken", "6 EL Olivenöl", "1 Bund Basilikum", "80 g Ricotta salata oder Pecorino, gerieben", "Salz"],
    steps: ["Auberginen in 2 cm grosse Würfel schneiden und leicht salzen. Die Hälfte des Olivenöls in einer grossen Bratpfanne erhitzen und die Auberginen darin bei starker Hitze 8–10 Minuten rundum goldbraun braten, nach Bedarf Öl nachgeben.",
      "Knoblauch in Scheiben schneiden, mit den Chiliflocken und dem restlichen Öl zu den Auberginen geben und kurz mitbraten. Tomaten dazugiessen und etwa 10 Minuten köcheln.",
      "Inzwischen die Rigatoni in reichlich Salzwasser al dente kochen, meist 11–13 Minuten.",
      "Rigatoni abgiessen und unter die Sauce mischen. Basilikum zerzupfen und unterheben, mit Ricotta salata bestreuen."]
  },
  {
    id: "idee-spaetzlipfanne-pilze-lauch", title: "Spätzlipfanne mit Pilzen und Lauch", kitchen: "ch", emoji: "pfanne", cat: "main", tags: ["vegi", "quick", "kids"], time: 20, serves: 4,
    note: "Feierabendessen aus dem Kühlregal: fertige Spätzli knusprig gebraten, mit Pilzen, Lauch und einem Schuss Rahm. Wer mag, brät Speckwürfeli mit; Spätzli vom Vortag eignen sich bestens.",
    ingr: ["500 g Spätzli aus dem Kühlregal", "250 g Champignons", "1 Stange Lauch", "1 Zwiebel", "2 EL Bratbutter", "1,5 dl Halbrahm", "50 g Sbrinz oder Gruyère, gerieben", "½ Bund Schnittlauch", "Salz, Pfeffer, Muskat"],
    steps: ["Champignons in Scheiben schneiden. Lauch längs halbieren, waschen und in feine Streifen schneiden, Zwiebel fein hacken.",
      "1 EL Bratbutter in einer grossen Bratpfanne erhitzen und die Champignons darin 4–5 Minuten kräftig anbraten. Zwiebel und Lauch dazugeben, 3 Minuten mitdünsten und alles herausnehmen.",
      "Restliche Bratbutter in der Pfanne erhitzen und die Spätzli darin bei mittlerer Hitze 5–6 Minuten braten, bis sie stellenweise goldbraun und knusprig sind.",
      "Gemüse zurück in die Pfanne geben, Halbrahm dazugiessen und 1–2 Minuten köcheln, bis er leicht bindet. Mit Salz, Pfeffer und Muskat würzen und mit Sbrinz und Schnittlauch bestreuen."]
  },
  {
    id: "idee-kalte-sesamnudeln", title: "Kalte Sesamnudeln mit Gurke", kitchen: "cn", emoji: "nudeln", cat: "main", tags: ["vegi", "vegan", "quick"], time: 20, serves: 4,
    note: "Beliebtes Strassenessen aus Sichuan und Peking, kalt oder lauwarm gegessen – ideal an heissen Tagen. Chinesische Sesampaste lässt sich durch Tahini ersetzen. Mit Reisnudeln und Tamari statt Sojasauce glutenfrei.",
    ingr: ["300 g Weizennudeln (z. B. Mie-Nudeln)", "1 Gurke", "2 Frühlingszwiebeln", "4 EL Tahini oder chinesische Sesampaste", "3 EL Sojasauce", "1 EL Reisessig", "1 EL Zucker", "1 Knoblauchzehe, fein gerieben", "1 TL Chiliöl oder Sambal Oelek", "1 EL Sesamöl", "1 EL Sesamsamen, geröstet"],
    steps: ["Nudeln nach Packungsangabe kochen, meist 4–5 Minuten. Abgiessen, kalt abspülen, gut abtropfen lassen und mit dem Sesamöl mischen, damit sie nicht kleben.",
      "Tahini, Sojasauce, Reisessig, Zucker, Knoblauch und Chiliöl mit 3–4 EL warmem Wasser zu einer glatten, dickflüssigen Sauce verrühren.",
      "Gurke längs halbieren, die Kerne mit einem Löffel herauskratzen und die Gurke in feine Stifte schneiden. Frühlingszwiebeln in feine Ringe schneiden.",
      "Nudeln mit der Sauce mischen, in Schalen anrichten und mit Gurke, Frühlingszwiebeln und Sesamsamen bestreuen."]
  },
  {
    id: "idee-miso-udon-pilze-spinat", title: "Miso-Udon mit Pilzen und Spinat", kitchen: "jp", emoji: "nudeln", cat: "main", tags: ["vegi", "vegan", "quick"], time: 20, serves: 4,
    note: "Dicke, weiche Udon in einer sämigen Sauce aus Miso und Sesam – gebraten statt als Suppe. Vorgekochte Udon gibt es vakuumiert im Asia-Regal. Statt Shiitake gehen Champignons.",
    ingr: ["600 g Udon, vorgekocht (vakuumiert)", "200 g Shiitake oder Champignons", "150 g junger Spinat", "2 Frühlingszwiebeln", "1 Stück Ingwer (2 cm)", "2 EL helle Misopaste", "1 EL Sojasauce", "1 EL Mirin oder 1 TL Zucker", "1 EL Tahini", "2 EL Rapsöl", "1 TL Sesamsamen"],
    steps: ["Misopaste, Sojasauce, Mirin und Tahini mit 1 dl warmem Wasser glatt rühren. Ingwer fein reiben und dazugeben.",
      "Udon in einer Schüssel mit kochendem Wasser übergiessen, 1–2 Minuten ziehen lassen, mit Stäbchen lockern und abgiessen.",
      "Shiitake in Scheiben schneiden, Frühlingszwiebeln in Ringe. Rapsöl im Wok oder in einer weiten Bratpfanne erhitzen und die Pilze darin 4–5 Minuten kräftig anbraten.",
      "Udon und Sauce dazugeben und 2 Minuten unter Wenden braten, bis die Sauce die Nudeln umhüllt. Spinat unterheben, bis er zusammenfällt. Mit Frühlingszwiebeln und Sesamsamen bestreuen."]
  },
  {
    id: "idee-pad-woon-sen", title: "Pad Woon Sen mit Schweinefleisch", kitchen: "th", emoji: "nudeln", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Thailändische Glasnudeln aus dem Wok mit Ei, Gemüse und Schweinefleisch – leichter als Pad Thai und schnell gemacht. Glasnudeln aus Mungbohnen sind glutenfrei; dazu Tamari statt Sojasauce und eine glutenfreie Austernsauce nehmen.",
    ingr: ["200 g Glasnudeln", "300 g Schweinsgeschnetzeltes, in feinen Streifen", "3 Eier", "1 Zwiebel", "2 Rüebli", "200 g Chinakohl oder Weisskabis", "2 Tomaten", "4 Frühlingszwiebeln", "3 Knoblauchzehen", "2 EL Austernsauce", "1 EL Sojasauce", "1 EL Fischsauce", "1 TL Zucker", "3 EL Rapsöl"],
    steps: ["Glasnudeln 10 Minuten in warmem Wasser einweichen, abgiessen und mit der Schere zwei-, dreimal durchschneiden.",
      "Zwiebel in Streifen, Rüebli in feine Stifte, Chinakohl in Streifen, Tomaten in Schnitze und Frühlingszwiebeln in 3 cm lange Stücke schneiden. Knoblauch hacken. Austernsauce, Sojasauce, Fischsauce, Zucker und 4 EL Wasser verrühren.",
      "Rapsöl im Wok stark erhitzen, Knoblauch kurz anbraten und das Schweinefleisch 2–3 Minuten pfannenrühren, bis es nicht mehr rosa ist.",
      "Zwiebel, Rüebli und Chinakohl dazugeben und 2 Minuten mitbraten. Alles an den Rand schieben, die Eier in die Mitte schlagen, kurz stocken lassen und grob verrühren.",
      "Glasnudeln, Tomaten und Sauce dazugeben und 2–3 Minuten wenden, bis die Nudeln die Sauce aufgesogen haben. Frühlingszwiebeln untermischen und sofort servieren."]
  },

  /* ---------- Pfanne und Wok ---------- */
  {
    id: "idee-poulet-cashewnuesse", title: "Poulet mit Cashewnüssen", kitchen: "th", emoji: "poulet", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Thailändisches Wokgericht mit gerösteten Cashews, Peperoni und getrockneten Chilis – milder, als es aussieht: Die Chilis geben nur Aroma und bleiben am Tellerrand. Dazu Jasminreis.",
    ingr: ["500 g Pouletbrust", "80 g Cashewnüsse, ungesalzen", "1 rote Peperoni", "1 Zwiebel", "3 Frühlingszwiebeln", "3 Knoblauchzehen", "4 getrocknete Chilischoten", "2 EL Austernsauce", "1 EL Sojasauce", "1 TL Fischsauce", "1 TL Zucker", "1 TL Maizena", "3 EL Rapsöl", "300 g Jasminreis"],
    steps: ["Jasminreis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Pouletbrust in mundgerechte Stücke schneiden und mit Maizena und Sojasauce mischen. Peperoni und Zwiebel in Stücke, Frühlingszwiebeln in 3 cm lange Stücke schneiden, Knoblauch hacken.",
      "Cashewnüsse im trockenen Wok bei mittlerer Hitze 2–3 Minuten goldbraun rösten und herausnehmen.",
      "Rapsöl im Wok stark erhitzen, Knoblauch und Chilischoten kurz anbraten. Poulet dazugeben und 4–5 Minuten pfannenrühren, bis es fast durch ist.",
      "Zwiebel und Peperoni 2 Minuten mitbraten. Austernsauce, Fischsauce, Zucker und 3 EL Wasser dazugeben, Cashewnüsse und Frühlingszwiebeln untermischen und mit dem Reis servieren."]
  },
  {
    id: "idee-cevapcici-ajvar", title: "Ćevapčići mit Ajvar und Zwiebeln", kitchen: "east", emoji: "fleisch", cat: "main", tags: ["quick", "kids"], time: 30, serves: 4,
    note: "Die kleinen Hackfleischröllchen vom Balkan, in der Pfanne oder auf dem Grill gebraten. Ajvar, die Paste aus gerösteten Peperoni, gibt es bei Migros und Coop. Dazu Fladenbrot oder Reis.",
    ingr: ["600 g Hackfleisch, gemischt (Rind und Schwein oder Lamm)", "1 kleine Zwiebel", "3 Knoblauchzehen, gepresst", "1 TL Paprikapulver, edelsüss", "½ TL Natron oder Backpulver", "1 TL Salz", "Pfeffer", "2 rote Zwiebeln", "1 EL Rapsöl", "1 Glas Ajvar (ca. 200 g)", "150 g Sauerrahm", "4 Fladenbrote oder Pita"],
    steps: ["Die kleine Zwiebel fein reiben. Hackfleisch mit Zwiebel, Knoblauch, Paprikapulver, Natron, Salz und Pfeffer in einer Schüssel 2–3 Minuten kräftig kneten, bis die Masse leicht klebt.",
      "Mit nassen Händen fingerlange, daumendicke Röllchen formen und 10 Minuten kühl stellen. Inzwischen die roten Zwiebeln fein hacken.",
      "Rapsöl in einer grossen Bratpfanne oder Grillpfanne stark erhitzen und die Ćevapčići darin unter Wenden 8–10 Minuten braten, bis sie rundum gebräunt und durchgegart sind.",
      "Fladenbrote in der Pfanne kurz erwärmen. Ćevapčići mit roten Zwiebeln, Ajvar und Sauerrahm in oder neben den Fladenbroten servieren."]
  },
  {
    id: "idee-trocken-gebratene-bohnen", title: "Trocken gebratene grüne Bohnen", kitchen: "cn", emoji: "gemuese", cat: "main", tags: ["vegi", "vegan", "quick"], time: 25, serves: 4,
    note: "Aus Sichuan: Die Bohnen werden scharf angebraten, bis sie runzlig sind, dann mit Knoblauch, Chili und Pilzen gewürzt. Klassisch kommt gehacktes Schweinefleisch dazu; diese Fassung ist vegan. Szechuanpfeffer gibt es im Asia-Laden.",
    ingr: ["500 g grüne Bohnen", "150 g Shiitake oder Champignons", "3 Knoblauchzehen", "1 Stück Ingwer (2 cm)", "4 getrocknete Chilischoten", "½ TL Szechuanpfeffer, gemörsert (nach Belieben)", "2 EL Sojasauce", "1 TL Zucker", "4 EL Rapsöl", "300 g Reis"],
    steps: ["Reis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Bohnen rüsten und gut trocken tupfen. Shiitake, Knoblauch und Ingwer fein hacken, Chilischoten halbieren.",
      "Rapsöl im Wok stark erhitzen. Bohnen darin 6–8 Minuten unter häufigem Wenden braten, bis sie weich, runzlig und stellenweise braun sind. Herausnehmen.",
      "Im verbliebenen Öl die Shiitake 3 Minuten braten, bis sie leicht knusprig sind. Knoblauch, Ingwer, Chilischoten und Szechuanpfeffer kurz mitbraten.",
      "Bohnen zurück in den Wok geben, Sojasauce und Zucker dazugeben und 1 Minute schwenken. Mit dem Reis servieren."]
  },
  {
    id: "idee-kreuzkuemmel-lamm", title: "Kreuzkümmel-Lamm aus dem Wok", kitchen: "cn", emoji: "fleisch", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Aus Xinjiang im Westen Chinas: Lammfleisch mit viel Kreuzkümmel und Chili, kurz und sehr heiss gebraten. Lammhuft oder Lammrücken eignen sich am besten; Rindshuft geht auch.",
    ingr: ["500 g Lammhuft oder Lammrückenfilet", "2 TL Kreuzkümmelsamen", "1 TL Chiliflocken", "1 Zwiebel", "4 Frühlingszwiebeln", "3 Knoblauchzehen", "2 EL Sojasauce", "1 TL Maizena", "½ Bund Koriander", "3 EL Rapsöl", "300 g Reis", "Salz"],
    steps: ["Reis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Lammhuft quer zur Faser in dünne Streifen schneiden und mit Sojasauce und Maizena mischen. Kreuzkümmelsamen im Mörser grob zerstossen.",
      "Zwiebel in Streifen schneiden, Frühlingszwiebeln in 4 cm lange Stücke, Knoblauch hacken, Koriander grob zupfen.",
      "Rapsöl im Wok sehr stark erhitzen. Fleisch portionenweise 2 Minuten scharf anbraten, bis es Farbe hat. Zwiebel und Knoblauch dazugeben und 2 Minuten mitbraten.",
      "Kreuzkümmel, Chiliflocken und Frühlingszwiebeln untermischen, 1 Minute weiterbraten und mit Salz abschmecken. Mit Koriander bestreuen und mit dem Reis servieren."]
  },
  {
    id: "idee-poulet-senfrahm", title: "Poulet an Senfrahmsauce", kitchen: "fr", emoji: "poulet", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Aus der französischen Bistroküche: Pouletbrust in einer Sauce aus Dijonsenf, Weisswein und Rahm. Für Kinder nur milden Senf nehmen. Dazu passen Nudeln, Reis oder Baguette.",
    ingr: ["4 Pouletbrüstli (ca. 600 g)", "1 Schalotte", "2 EL Bratbutter", "1 dl Weisswein oder Bouillon", "2 dl Rahm", "2 EL Dijonsenf", "1 EL grobkörniger Senf", "1 Zweig Estragon oder ½ Bund Petersilie", "Salz, Pfeffer", "300 g Bandnudeln oder Reis zum Servieren"],
    steps: ["Wasser für die Bandnudeln aufkochen und sie nach Packungsangabe kochen, meist 6–8 Minuten.",
      "Pouletbrüstli quer halbieren, damit sie gleichmässig dünn sind, und mit Salz und Pfeffer würzen. Bratbutter in einer Bratpfanne erhitzen und das Fleisch pro Seite 4–5 Minuten goldbraun braten. Herausnehmen und warm stellen.",
      "Schalotte fein hacken und im Bratfett 2 Minuten andünsten. Mit Weisswein ablöschen und auf die Hälfte einkochen.",
      "Rahm, Dijonsenf und grobkörnigen Senf einrühren und 3–4 Minuten köcheln, bis die Sauce leicht bindet. Poulet samt Saft zurück in die Pfanne geben und 2 Minuten ziehen lassen, bis es durch ist.",
      "Estragon hacken und darüberstreuen, mit Salz und Pfeffer abschmecken und mit den Nudeln servieren."]
  },
  {
    id: "idee-lomo-saltado", title: "Lomo Saltado", kitchen: "latam", emoji: "fleisch", cat: "main", tags: ["quick"], time: 30, serves: 4,
    note: "Peruanisch-chinesische Wokküche: Rindfleisch mit Tomaten, roten Zwiebeln, Sojasauce und Essig, serviert mit Pommes frites und Reis. Statt der gelben Aji-Chili aus Peru tut es eine frische rote Chili.",
    ingr: ["500 g Rindshuft oder Rindsfilet", "400 g Pommes frites, tiefgekühlt", "2 rote Zwiebeln", "3 Tomaten", "1 gelbe oder rote Chilischote", "3 Knoblauchzehen", "3 EL Sojasauce", "2 EL Rotweinessig", "1 Bund Koriander", "3 EL Rapsöl", "250 g Reis", "Salz, Pfeffer"],
    steps: ["Ofen auf 220 °C vorheizen (Umluft 200 °C). Pommes frites auf einem Blech verteilen und 20–25 Minuten knusprig backen. Inzwischen den Reis nach Packungsangabe kochen.",
      "Rindshuft in fingerdicke Streifen schneiden und mit Salz und Pfeffer würzen. Zwiebeln in breite Spalten, Tomaten in Achtel schneiden, Chilischote entkernen und in Streifen schneiden, Knoblauch hacken.",
      "Rapsöl im Wok sehr heiss werden lassen und das Fleisch portionenweise 1–2 Minuten scharf anbraten, herausnehmen.",
      "Zwiebeln, Chili und Knoblauch im Wok 2 Minuten braten. Tomaten, Sojasauce und Rotweinessig dazugeben und 1 Minute schwenken – die Tomaten sollen nicht zerfallen.",
      "Fleisch zurück in den Wok geben, die Pommes frites kurz untermischen und mit gehacktem Koriander bestreuen. Sofort mit dem Reis servieren."]
  },
  {
    id: "idee-tempe-manis", title: "Tempe Manis mit grünen Bohnen", kitchen: "sea", emoji: "pfanne", cat: "main", tags: ["vegi", "vegan", "quick"], time: 30, serves: 4,
    note: "Indonesisches Alltagsgericht: knusprig gebratener Tempeh in klebriger Sauce aus süsser Sojasauce, Knoblauch und Chili. Tempeh gibt es im Tofu-Regal, fester Tofu geht auch. Kecap Manis lässt sich aus Sojasauce und braunem Zucker mischen.",
    ingr: ["400 g Tempeh", "3 EL Kecap Manis (süsse Sojasauce)", "1 EL Sojasauce", "1 EL Limettensaft", "3 Schalotten", "3 Knoblauchzehen", "1–2 rote Chilischoten", "1 Stück Ingwer (2 cm)", "200 g grüne Bohnen", "4 EL Rapsöl", "300 g Jasminreis", "Salz"],
    steps: ["Jasminreis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Tempeh in dünne Stäbchen schneiden. Schalotten in Ringe, Knoblauch und Chilischoten in feine Scheiben schneiden, Ingwer fein hacken. Bohnen rüsten und halbieren.",
      "Bohnen in kochendem Salzwasser 4 Minuten blanchieren und abgiessen.",
      "Rapsöl im Wok erhitzen und den Tempeh portionenweise 4–5 Minuten goldbraun und knusprig braten, herausnehmen.",
      "Schalotten, Knoblauch, Chili und Ingwer im verbliebenen Öl 2 Minuten anbraten. Bohnen, Kecap Manis, Sojasauce und 2 EL Wasser dazugeben, Tempeh zurück in den Wok geben und schwenken, bis alles glänzend überzogen ist. Mit Limettensaft abschmecken und mit dem Reis servieren."]
  },
  {
    id: "idee-bangers-and-mash", title: "Bangers and Mash mit Zwiebelsauce", kitchen: "nord", emoji: "fleisch", cat: "main", tags: ["quick", "kids"], time: 30, serves: 4,
    note: "Englisches Pub-Essen: gebratene Würste auf Kartoffelstock mit dunkler Zwiebelsauce. Statt englischer Würste passen grobe Schweins- oder Kalbsbratwürste. Die Sauce ist mit Maizena gebunden, also glutenfrei, wenn es die Würste auch sind.",
    ingr: ["8 Schweinsbratwürste oder Kalbsbratwürste", "1 kg Kartoffeln, mehligkochend", "1,5 dl Milch", "40 g Butter", "2 Zwiebeln", "1 EL Rapsöl", "1 TL Zucker", "3 dl Bouillon", "1 TL Worcestershire-Sauce", "1 TL Senf", "2 TL Maizena", "200 g Erbsen, tiefgekühlt", "Salz, Pfeffer, Muskat"],
    steps: ["Kartoffeln schälen, in Stücke schneiden und in Salzwasser 15–20 Minuten weich kochen.",
      "Zwiebeln in feine Ringe schneiden. Rapsöl in einer Bratpfanne erhitzen und die Würste darin bei mittlerer Hitze 12–15 Minuten rundum braten, bis sie gebräunt und durch sind. Herausnehmen und warm stellen.",
      "Zwiebeln im Bratfett mit dem Zucker 6–8 Minuten goldbraun braten. Bouillon, Worcestershire-Sauce und Senf dazugeben und aufkochen. Maizena mit 2 EL kaltem Wasser anrühren, einrühren und köcheln, bis die Sauce bindet. Mit Pfeffer abschmecken.",
      "Erbsen in wenig Salzwasser 3 Minuten garen. Kartoffeln abgiessen. Milch und Butter erhitzen und mit den Kartoffeln zu einem lockeren Kartoffelstock stampfen, mit Salz und Muskat würzen.",
      "Kartoffelstock auf Teller verteilen, die Würste daraufsetzen und mit der Zwiebelsauce übergiessen. Erbsen dazu servieren."]
  },
  {
    id: "idee-jeyuk-bokkeum", title: "Jeyuk Bokkeum (scharfes Schweinefleisch)", kitchen: "kr", emoji: "fleisch", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Koreanisches Alltagsgericht: dünn geschnittenes Schweinefleisch in süss-scharfer Gochujang-Marinade, kurz und heiss gebraten. Man isst es mit Reis, gern in Salatblätter gewickelt. Schweinshals bleibt saftiger als Plätzli.",
    ingr: ["600 g Schweinshals oder Schweinsplätzli, in dünnen Scheiben", "2 EL Gochujang", "½ TL Chiliflocken oder Gochugaru", "3 EL Sojasauce", "1 EL Zucker", "1 EL Sesamöl", "3 Knoblauchzehen, gepresst", "1 Stück Ingwer (2 cm), gerieben", "1 Zwiebel", "1 Rüebli", "4 Frühlingszwiebeln", "2 EL Rapsöl", "300 g Rundkornreis", "1 Kopfsalat", "1 TL Sesamsamen"],
    steps: ["Rundkornreis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Gochujang, Chiliflocken, Sojasauce, Zucker, Sesamöl, Knoblauch und Ingwer verrühren. Schweinshals in mundgerechte Stücke schneiden, mit der Marinade mischen und mindestens 10 Minuten ziehen lassen.",
      "Inzwischen Zwiebel in Streifen, Rüebli in dünne Scheiben und Frühlingszwiebeln in 4 cm lange Stücke schneiden. Kopfsalat in Blätter zerteilen und waschen.",
      "Rapsöl im Wok oder in einer grossen Bratpfanne stark erhitzen. Fleisch samt Marinade darin 5–6 Minuten braten, bis es gar ist und leicht karamellisiert. Zwiebel und Rüebli dazugeben und 2–3 Minuten mitbraten.",
      "Frühlingszwiebeln untermischen und mit Sesamsamen bestreuen. Mit dem Reis und den Salatblättern servieren: Fleisch und etwas Reis in ein Blatt wickeln und von Hand essen."]
  },
  {
    id: "idee-kadai-paneer", title: "Kadai Paneer", kitchen: "in", emoji: "curry", cat: "main", tags: ["vegi", "quick"], time: 30, serves: 4,
    note: "Nordindisches Pfannengericht mit Paneer, Peperoni und Zwiebeln in einer würzigen Tomatenmasala. Paneer gibt es bei Coop und im Indien-Laden; Halloumi ist ein guter Ersatz. Dazu Naan oder Reis.",
    ingr: ["400 g Paneer", "2 Peperoni, rot und grün", "2 Zwiebeln", "3 Tomaten", "2 Knoblauchzehen", "1 Stück Ingwer (3 cm)", "1 grüne Chilischote", "1 TL Koriandersamen", "1 TL Kreuzkümmelsamen", "1 TL Garam Masala", "½ TL Kurkuma", "3 EL Rapsöl", "½ Bund Koriander", "Salz"],
    steps: ["Koriandersamen und Kreuzkümmelsamen in einer trockenen Pfanne 1 Minute rösten und im Mörser grob zerstossen.",
      "Paneer in 2 cm grosse Würfel schneiden. Peperoni und eine Zwiebel in Stücke schneiden. Die zweite Zwiebel, Knoblauch, Ingwer und Chilischote fein hacken, Tomaten klein würfeln.",
      "1 EL Rapsöl in einer weiten Pfanne erhitzen, den Paneer darin 3–4 Minuten rundum goldbraun braten und herausnehmen. Peperoni und Zwiebelstücke 3 Minuten anbraten, sie sollen knackig bleiben, und ebenfalls herausnehmen.",
      "Restliches Öl erhitzen, gehackte Zwiebel, Knoblauch, Ingwer und Chili 4 Minuten dünsten. Tomaten, Kurkuma und die gerösteten Gewürze dazugeben und etwa 8 Minuten zu einer dicken Sauce köcheln.",
      "Paneer und Gemüse unterheben, mit Garam Masala und Salz würzen und 2 Minuten erwärmen. Mit gehacktem Koriander bestreuen."]
  },

  /* ---------- Bowls ---------- */
  {
    id: "idee-burrito-bowl-bohnen", title: "Burrito-Bowl mit schwarzen Bohnen", kitchen: "latam", emoji: "reis", cat: "main", tags: ["vegi", "vegan", "quick"], time: 30, serves: 4,
    note: "Alles, was in einen Burrito gehört, nur ohne Tortilla – und darum glutenfrei. Wer nicht vegan isst, gibt einen Klecks Sauerrahm oder geriebenen Cheddar dazu.",
    ingr: ["250 g Langkornreis", "1 Limette", "½ Bund Koriander", "1 Dose schwarze Bohnen (400 g)", "1 Dose Mais (300 g)", "1 Peperoni", "1 TL Kreuzkümmel", "1 TL Paprikapulver, geräuchert", "250 g Cherrytomaten", "1 rote Zwiebel", "1 Avocado", "2 EL Olivenöl", "Salz", "Tomatensalsa, scharf, zum Servieren"],
    steps: ["Langkornreis nach Packungsangabe kochen, meist 15–18 Minuten. Mit dem Saft einer halben Limette, Salz und der Hälfte des gehackten Korianders mischen.",
      "Bohnen und Mais abspülen und abtropfen lassen. Peperoni würfeln und in 1 EL Olivenöl 3 Minuten anbraten. Bohnen, Mais, Kreuzkümmel, Paprikapulver und 3 EL Wasser dazugeben, salzen und 5 Minuten erhitzen.",
      "Cherrytomaten vierteln, rote Zwiebel fein hacken und beides mit dem restlichen Olivenöl, Limettensaft und Salz zu einem schnellen Pico de Gallo mischen. Avocado in Scheiben schneiden.",
      "Reis in Schalen verteilen, Bohnen, Pico de Gallo und Avocado darauf anrichten. Mit dem restlichen Koriander bestreuen und mit scharfer Tomatensalsa servieren."]
  },
  {
    id: "idee-buddha-bowl-suesskartoffel", title: "Buddha-Bowl mit Süsskartoffel und Tahini", kitchen: "amerika", emoji: "gemuese", cat: "main", tags: ["vegi", "vegan", "quick"], time: 30, serves: 4,
    note: "Die bunte Schüssel aus der kalifornischen Vegi-Küche: Getreide, Gemüse, Hülsenfrüchte und eine cremige Sauce. Statt Quinoa gehen Reis oder Hirse; Quinoa und Sauce lassen sich am Vortag vorbereiten.",
    ingr: ["200 g Quinoa", "1 Süsskartoffel (ca. 400 g)", "1 Dose Kichererbsen (400 g)", "1 TL Paprikapulver, geräuchert", "½ TL Kreuzkümmel", "3 EL Olivenöl", "150 g Rotkabis", "1 Avocado", "1 Handvoll Babyspinat", "3 EL Tahini", "1 Zitrone", "1 Knoblauchzehe", "1 EL Ahornsirup", "2 EL Kürbiskerne", "Salz, Pfeffer"],
    steps: ["Quinoa in einem Sieb gründlich spülen und in der doppelten Menge Salzwasser zugedeckt etwa 15 Minuten köcheln, dann 5 Minuten quellen lassen.",
      "Süsskartoffel schälen und in 1,5 cm grosse Würfel schneiden. In 2 EL Olivenöl in einer grossen Bratpfanne zugedeckt 10 Minuten braten, dabei ab und zu wenden.",
      "Kichererbsen abspülen, gut abtropfen lassen und mit Paprikapulver, Kreuzkümmel und dem restlichen Öl zur Süsskartoffel geben. Offen weitere 5–6 Minuten braten, bis alles leicht knusprig ist, und salzen.",
      "Tahini mit dem Saft einer halben Zitrone, gepresstem Knoblauch, Ahornsirup und 3–4 EL Wasser zu einer cremigen Sauce rühren und mit Salz und Pfeffer würzen.",
      "Rotkabis sehr fein hobeln und mit dem restlichen Zitronensaft und etwas Salz mischen. Avocado in Scheiben schneiden. Quinoa, Babyspinat, Süsskartoffel, Kichererbsen, Rotkabis und Avocado in Schalen anrichten, mit der Sauce beträufeln und mit Kürbiskernen bestreuen."]
  },
  {
    id: "idee-halloumi-bowl-bulgur", title: "Halloumi-Bowl mit Bulgur und Minzjoghurt", kitchen: "levante", emoji: "kaese", cat: "main", tags: ["vegi", "quick"], time: 25, serves: 4,
    note: "Gebratener Halloumi schmeckt frisch aus der Pfanne am besten. Mit Gurke, Tomaten, Kichererbsen, Bulgur und Minzjoghurt wird daraus ein sättigendes Abendessen. Mit Quinoa statt Bulgur glutenfrei.",
    ingr: ["200 g Bulgur, mittelgrob", "4 dl Gemüsebouillon", "2 Halloumi (à 200 g)", "1 Gurke", "250 g Cherrytomaten", "½ rote Zwiebel", "1 Dose Kichererbsen (400 g)", "180 g Joghurt nature, griechisch", "½ Bund Minze", "1 Zitrone", "3 EL Olivenöl", "1 TL Sumach oder Paprikapulver", "Salz, Pfeffer"],
    steps: ["Bulgur mit der heissen Bouillon übergiessen, zugedeckt bei kleiner Hitze 10 Minuten köcheln und weitere 5 Minuten quellen lassen. Mit 1 EL Olivenöl und etwas Zitronensaft auflockern.",
      "Minze fein hacken und die Hälfte mit dem Joghurt, 1 EL Zitronensaft, Salz und Pfeffer verrühren.",
      "Gurke würfeln, Cherrytomaten halbieren, rote Zwiebel fein schneiden. Kichererbsen abspülen und mit dem Gemüse, 1 EL Olivenöl, Sumach und Salz mischen.",
      "Halloumi in 1 cm dicke Scheiben schneiden und in einer Bratpfanne im restlichen Öl pro Seite 2 Minuten goldbraun braten.",
      "Bulgur, Gemüse und Halloumi in Schalen anrichten, Minzjoghurt daraufgeben und mit der restlichen Minze bestreuen."]
  },
  {
    id: "idee-soboro-don", title: "Soboro-Don mit Poulethack, Ei und Erbsen", kitchen: "jp", emoji: "reis", cat: "main", tags: ["quick", "kids"], time: 25, serves: 4,
    note: "Japanische Reisschale in drei Farben, beliebt im Bento: süss-salziges Poulethack, feines Rührei und grüne Erbsen. Poulethackfleisch gibt es bei Migros und Coop; Schweinshack geht auch.",
    ingr: ["300 g Sushireis oder Rundkornreis", "400 g Poulethackfleisch", "4 EL Sojasauce", "2 EL Mirin", "2 EL Zucker", "1 Stück Ingwer (2 cm)", "4 Eier", "200 g Erbsen, tiefgekühlt", "1 EL Rapsöl", "Eingelegter Ingwer (Gari) zum Servieren", "Salz"],
    steps: ["Sushireis spülen und nach Packungsangabe kochen, meist 12 Minuten plus 10 Minuten Quellzeit.",
      "Ingwer fein reiben. Poulethackfleisch mit Sojasauce, Mirin, 1½ EL Zucker und dem Ingwer in einer kalten Pfanne mit vier Stäbchen gut vermischen. Bei mittlerer Hitze unter ständigem Rühren 5–6 Minuten garen, bis das Fleisch fein krümelig und die Flüssigkeit fast verkocht ist.",
      "Eier mit einer Prise Salz und dem restlichen Zucker verquirlen. Rapsöl in einer beschichteten Pfanne bei kleiner Hitze erwärmen, die Eier hineingiessen und unter ständigem Rühren mit Stäbchen 2–3 Minuten zu einem feinen, trockenen Rührei stocken lassen.",
      "Erbsen in kochendem Salzwasser 3 Minuten garen und abgiessen.",
      "Reis in Schalen verteilen und Poulethack, Rührei und Erbsen in Streifen nebeneinander darauf anrichten. Mit eingelegtem Ingwer servieren."]
  },
  {
    id: "idee-koreanische-tofu-bowl", title: "Koreanische Tofu-Bowl mit Gochujang", kitchen: "kr", emoji: "reis", cat: "main", tags: ["vegi", "vegan", "quick"], time: 30, serves: 4,
    note: "Knusprig gebratener Tofu in einer süss-scharfen Sauce aus Gochujang, der koreanischen Chilipaste aus dem Asia-Regal. Manche Sorten enthalten Weizen, also für glutenfrei aufs Etikett schauen.",
    ingr: ["300 g Rundkornreis", "400 g Tofu nature, fest", "2 EL Maizena", "2 EL Gochujang", "2 EL Sojasauce", "1 EL Ahornsirup oder Zucker", "1 Knoblauchzehe, gerieben", "1 TL Sesamöl", "1 Gurke", "2 Rüebli", "3 EL Reisessig", "100 g Sojasprossen", "3 EL Rapsöl", "2 Frühlingszwiebeln", "1 EL Sesamsamen", "Salz"],
    steps: ["Rundkornreis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Gurke und Rüebli in feine Stifte schneiden und mit Reisessig und einer Prise Salz mischen. Gochujang, Sojasauce, Ahornsirup, Knoblauch, Sesamöl und 3 EL Wasser verrühren.",
      "Tofu trocken tupfen, in 2 cm grosse Würfel schneiden und in Maizena wenden. Rapsöl in einer beschichteten Bratpfanne erhitzen und den Tofu darin 8–10 Minuten rundum knusprig braten.",
      "Sauce zum Tofu giessen und 1–2 Minuten schwenken, bis sie eindickt und den Tofu glänzend überzieht.",
      "Sojasprossen kurz mit kochendem Wasser übergiessen und abtropfen lassen. Reis in Schalen verteilen, Tofu, Gurke, Rüebli und Sprossen daraufgeben und mit Frühlingszwiebeln und Sesamsamen bestreuen."]
  },
  {
    id: "idee-bun-bo-xao", title: "Bún bò xào – Reisnudel-Bowl mit Rind", kitchen: "vn", emoji: "nudeln", cat: "main", tags: ["quick"], time: 30, serves: 4,
    note: "Lauwarme Reisnudeln mit Kräutern, knackigem Gemüse und Rindfleisch mit Zitronengras, übergossen mit Nuoc Cham. Mit Reisnudeln und Fischsauce von Natur aus glutenfrei. Statt Kopfsalat geht auch Eisbergsalat.",
    ingr: ["250 g Reisnudeln (Vermicelli)", "400 g Rindshuft", "2 Stangen Zitronengras", "2 Knoblauchzehen", "4 EL Fischsauce", "3 EL Limettensaft", "3 EL Zucker", "1 rote Chilischote", "1 Zwiebel", "2 EL Rapsöl", "1 Kopfsalat", "1 Gurke", "2 Rüebli", "1 Bund Minze", "1 Bund Koriander", "3 EL geröstete Erdnüsse"],
    steps: ["Reisnudeln nach Packungsangabe in kochendem Wasser 3–4 Minuten garen, kalt abspülen und gut abtropfen lassen.",
      "Für die Sauce 3 EL Fischsauce, Limettensaft, 2 EL Zucker und 6 EL warmes Wasser verrühren, bis sich der Zucker gelöst hat. Chilischote in feine Ringe schneiden und dazugeben.",
      "Rindshuft quer zur Faser in dünne Streifen schneiden. Zitronengras putzen und nur das zarte Innere sehr fein hacken, Knoblauch hacken. Fleisch mit Zitronengras, Knoblauch, 1 EL Fischsauce und 1 EL Zucker mischen und 10 Minuten ziehen lassen.",
      "Inzwischen Kopfsalat in Streifen schneiden, Gurke und Rüebli in feine Stifte. Minze und Koriander grob zupfen, Erdnüsse hacken, Zwiebel in Streifen schneiden.",
      "Rapsöl im Wok sehr heiss werden lassen. Zwiebel 1 Minute anbraten, Fleisch dazugeben und 2–3 Minuten scharf braten. Salat, Nudeln, Gemüse und Fleisch in Schalen schichten, mit Kräutern und Erdnüssen bestreuen und mit der Sauce übergiessen."]
  },
  {
    id: "idee-tandoori-poulet-bowl", title: "Tandoori-Poulet-Bowl mit Gurken-Raita", kitchen: "in", emoji: "poulet", cat: "main", tags: ["quick"], time: 30, serves: 4,
    note: "Poulet in würziger Joghurtmarinade, in der Pfanne statt im Tandoor-Ofen gebraten. Wer Zeit hat, mariniert es über Nacht im Kühlschrank – dann wird es noch zarter. Tandoori-Masala gibt es im Gewürzregal.",
    ingr: ["600 g Pouletschenkel ohne Knochen oder Pouletbrust", "2 Becher Joghurt nature (à 180 g)", "2 TL Tandoori-Masala", "1 Knoblauchzehe, gerieben", "1 Zitrone", "250 g Basmatireis", "1 Gurke", "½ Bund Minze", "1 rote Zwiebel", "200 g Cherrytomaten", "2 EL Rapsöl", "Salz"],
    steps: ["Basmatireis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Poulet in 3 cm grosse Stücke schneiden. Einen Becher Joghurt mit Tandoori-Masala, Knoblauch, 1 EL Zitronensaft und ½ TL Salz verrühren, das Poulet darin wenden und mindestens 10 Minuten marinieren.",
      "Für die Raita die Gurke grob raffeln und gut ausdrücken. Mit dem zweiten Becher Joghurt und der fein gehackten Minze mischen und salzen.",
      "Rapsöl in einer Bratpfanne stark erhitzen. Poulet mit der anhaftenden Marinade hineingeben und 8–10 Minuten braten, bis es rundum gebräunt und durchgegart ist.",
      "Rote Zwiebel in feine Ringe schneiden, Cherrytomaten halbieren. Reis, Poulet, Zwiebel und Tomaten in Schalen anrichten, Raita daraufgeben und mit Zitronenschnitzen servieren."]
  },
  {
    id: "idee-gyudon", title: "Gyudon (Rindfleisch-Reisschale)", kitchen: "jp", emoji: "reis", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Japanisches Feierabendessen: hauchdünnes Rindfleisch mit Zwiebeln, in süsser Soja-Bouillon gegart und auf Reis geschöpft. Beim Metzger Fleisch für Fondue chinoise verlangen, das spart das Schneiden.",
    ingr: ["300 g Sushireis oder Rundkornreis", "400 g Rindfleisch, hauchdünn geschnitten (z. B. für Fondue chinoise)", "2 Zwiebeln", "2 dl Dashi oder Bouillon", "4 EL Sojasauce", "3 EL Mirin", "1 EL Zucker", "1 Stück Ingwer (2 cm)", "2 Frühlingszwiebeln", "Eingelegter Ingwer (Gari) zum Servieren"],
    steps: ["Sushireis spülen und nach Packungsangabe kochen, meist 12 Minuten plus 10 Minuten Quellzeit.",
      "Zwiebeln halbieren und in 5 mm breite Streifen schneiden. Ingwer schälen und in feine Streifen schneiden. Rindfleisch in mundgerechte Stücke zupfen.",
      "Dashi, Sojasauce, Mirin und Zucker in einer weiten Pfanne aufkochen. Zwiebeln und Ingwer dazugeben und 5–6 Minuten köcheln, bis die Zwiebeln weich sind.",
      "Rindfleisch in die Sauce geben, mit Stäbchen auseinanderziehen und 1–2 Minuten garen, bis es nicht mehr rosa ist. Schaum abschöpfen.",
      "Reis in Schalen verteilen, Fleisch und Zwiebeln mit etwas Sauce darübergeben und mit Frühlingszwiebeln und eingelegtem Ingwer servieren."]
  },
  {
    id: "idee-cajun-crevetten-bowl", title: "Cajun-Crevetten-Bowl mit Mais und Avocado", kitchen: "amerika", emoji: "reis", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Aus Louisiana: Crevetten mit einer rauchig-scharfen Gewürzmischung, dazu Reis, gerösteter Mais und Avocado. Cajun-Gewürz gibt es fertig; selbst gemischt aus Paprika, Knoblauchpulver, Oregano, Thymian und Cayennepfeffer.",
    ingr: ["250 g Langkornreis", "500 g rohe Crevetten, geschält", "2 TL Cajun-Gewürz", "1 Dose Mais (300 g)", "1 Peperoni", "4 Frühlingszwiebeln", "1 Avocado", "1 Limette", "1 dl Sauerrahm", "½ Bund Koriander", "2 EL Rapsöl", "20 g Butter", "Salz"],
    steps: ["Langkornreis nach Packungsangabe kochen, meist 15–18 Minuten.",
      "Mais abtropfen lassen, Peperoni würfeln, Frühlingszwiebeln in Ringe schneiden. 1 EL Rapsöl in einer Bratpfanne stark erhitzen und Mais und Peperoni darin 5–6 Minuten braten, bis der Mais leicht röstet. Frühlingszwiebeln untermischen, salzen und herausnehmen.",
      "Crevetten trocken tupfen und mit Cajun-Gewürz und dem restlichen Öl mischen. In der heissen Pfanne pro Seite 1–2 Minuten braten, Butter dazugeben und kurz schwenken.",
      "Sauerrahm mit dem Saft einer halben Limette und etwas Salz verrühren. Avocado in Scheiben schneiden, Koriander zupfen.",
      "Reis, Maisgemüse, Crevetten und Avocado in Schalen anrichten, mit dem Limetten-Sauerrahm beträufeln, mit Koriander bestreuen und mit Limettenschnitzen servieren."]
  },
  {
    id: "idee-suya-poulet-bowl", title: "Suya-Poulet-Bowl", kitchen: "afrika", emoji: "poulet", cat: "main", tags: ["quick"], time: 30, serves: 4,
    note: "Suya ist das Grillfleisch der nigerianischen Strassenstände, gewürzt mit gemahlenen Erdnüssen, Ingwer und Chili. Hier aus der Pfanne, mit Reis, rohen Zwiebeln und Tomaten. Wer es mild mag, nimmt weniger Cayennepfeffer.",
    ingr: ["600 g Pouletschenkel ohne Knochen", "4 EL geröstete Erdnüsse, ungesalzen", "1 TL Paprikapulver", "1 TL Ingwerpulver", "½ TL Knoblauchpulver", "½ TL Cayennepfeffer", "1 Bouillonwürfel, zerdrückt", "3 EL Erdnussöl oder Rapsöl", "250 g Langkornreis", "1 rote Zwiebel", "3 Tomaten", "1 Gurke", "1 Limette", "Salz"],
    steps: ["Langkornreis nach Packungsangabe kochen, meist 15–18 Minuten.",
      "Erdnüsse im Cutter oder Mörser fein mahlen und mit Paprikapulver, Ingwerpulver, Knoblauchpulver, Cayennepfeffer, Bouillonwürfel und ½ TL Salz zur Suya-Würze mischen.",
      "Pouletschenkel in 3 cm grosse Stücke schneiden und mit 1 EL Erdnussöl und zwei Dritteln der Würze mischen.",
      "Restliches Öl in einer grossen Bratpfanne erhitzen und das Poulet darin bei mittlerer Hitze 8–10 Minuten rundum braten, bis es gebräunt und gar ist. Die Würze darf leicht ansetzen, aber nicht verbrennen.",
      "Rote Zwiebel in feine Ringe schneiden, Tomaten und Gurke in Scheiben. Reis mit Poulet und Gemüse in Schalen anrichten, mit der restlichen Würze bestreuen und mit Limettenschnitzen servieren."]
  },

  /* ---------- Wraps, Quesadillas und Sandwiches ---------- */
  {
    id: "idee-sabich", title: "Sabich (Pita mit Aubergine und Ei)", kitchen: "levante", emoji: "fladen", cat: "main", tags: ["vegi", "quick"], time: 30, serves: 4,
    note: "Israelisches Strassen-Sandwich aus der irakisch-jüdischen Küche: Pita mit gebratener Aubergine, Ei, Hummus und Tahini. Amba, eine würzige Mangosauce, gibt es im Orientladen; Mango-Chutney mit etwas Zitrone geht auch.",
    ingr: ["2 Auberginen (ca. 600 g)", "4 Eier", "4 grosse Pitabrote", "200 g Hummus", "3 EL Tahini", "1 Zitrone", "2 Tomaten", "1 Gurke", "½ Bund Petersilie", "4 EL Olivenöl", "4 Essiggurken", "Amba oder Mango-Chutney (nach Belieben)", "Salz"],
    steps: ["Auberginen in 1 cm dicke Scheiben schneiden und beidseitig salzen. Eier in kochendem Wasser 9 Minuten hart kochen, kalt abschrecken, schälen und in Scheiben schneiden.",
      "Olivenöl in einer grossen Bratpfanne erhitzen und die Auberginen portionenweise pro Seite 3–4 Minuten goldbraun und weich braten. Auf Küchenpapier abtropfen lassen.",
      "Tomaten und Gurke klein würfeln, Petersilie hacken und alles mit etwas Zitronensaft und Salz mischen. Tahini mit dem restlichen Zitronensaft, 3–4 EL Wasser und einer Prise Salz glatt rühren.",
      "Pitabrote kurz in der trockenen Pfanne erwärmen und aufschneiden. Innen mit Hummus bestreichen und mit Auberginen, Ei, Gemüse und in Scheiben geschnittenen Essiggurken füllen.",
      "Mit der Tahinisauce und nach Belieben etwas Amba beträufeln und sofort essen."]
  },
  {
    id: "idee-rolex-uganda", title: "Rolex (Chapati-Rolle mit Ei aus Uganda)", kitchen: "afrika", emoji: "fladen", cat: "main", tags: ["vegi", "quick", "cheap"], time: 20, serves: 4,
    note: "Der Name kommt von «rolled eggs»: In Uganda rollen Strassenstände Eier mit Kabis und Tomaten in ein frisches Chapati. Chapati gibt es im Indien-Laden oder tiefgekühlt; grosse Weizentortillas gehen auch.",
    ingr: ["4 Chapati oder grosse Weizentortillas", "8 Eier", "150 g Weisskabis", "2 Tomaten", "1 kleine rote Zwiebel", "1 grüne Peperoni", "1 grüne Chilischote (nach Belieben)", "½ Bund Koriander", "3 EL Rapsöl", "Salz, Pfeffer", "Chilisauce zum Servieren"],
    steps: ["Kabis sehr fein schneiden. Tomaten entkernen und klein würfeln, rote Zwiebel, Peperoni und Chilischote fein hacken, Koriander grob hacken.",
      "Für jede Rolle 2 Eier mit einem Viertel des Gemüses, etwas Koriander, Salz und Pfeffer verquirlen.",
      "Wenig Rapsöl in einer Bratpfanne erhitzen, die Eimasse hineingiessen und bei mittlerer Hitze etwa 2 Minuten stocken lassen. Ein Chapati direkt auf das noch leicht feuchte Ei legen, andrücken und alles zusammen wenden.",
      "Das Chapati 1 Minute mitbraten, bis es warm ist und am Ei klebt. Auf ein Brett gleiten lassen, mit der Eiseite nach oben, und satt aufrollen. Mit den übrigen Eiern ebenso drei weitere Rollen machen.",
      "Rollen schräg halbieren und mit Chilisauce servieren."]
  },
  {
    id: "idee-goezleme-spinat-feta", title: "Gözleme mit Spinat und Feta", kitchen: "levante", emoji: "fladen", cat: "main", tags: ["vegi", "quick"], time: 25, serves: 4,
    note: "Türkische Fladen, gefüllt und in der Pfanne gebacken. Der klassische Yufka-Teig ist im Türkei-Laden erhältlich; grosse Weizentortillas sind die schnelle Alltagslösung.",
    ingr: ["4 grosse Weizentortillas oder Yufka-Teigblätter", "300 g junger Spinat", "1 Zwiebel", "200 g Feta", "100 g Mozzarella, gerieben", "½ TL Chiliflocken (Pul Biber)", "2 EL Olivenöl", "1 Zitrone", "Salz, Pfeffer", "Joghurt nature zum Servieren"],
    steps: ["Zwiebel fein hacken und in 1 EL Olivenöl 3 Minuten dünsten. Spinat dazugeben und unter Rühren 2 Minuten zusammenfallen lassen. In einem Sieb gut ausdrücken, salzen und pfeffern.",
      "Feta zerbröckeln und mit Mozzarella, Spinat und Chiliflocken mischen.",
      "Füllung auf je einer Hälfte der Tortillas verteilen, zuklappen und leicht andrücken.",
      "Eine grosse Bratpfanne mit wenig Olivenöl auspinseln und die Gözleme bei mittlerer Hitze pro Seite 3 Minuten braten, bis sie goldbraun und knusprig sind.",
      "In Stücke schneiden und mit Zitronenschnitzen und Joghurt servieren."]
  },
  {
    id: "idee-philly-cheesesteak", title: "Philly Cheesesteak", kitchen: "amerika", emoji: "sandwich", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Das Kult-Sandwich aus Philadelphia: dünn geschnittenes Rindfleisch mit Zwiebeln und Peperoni unter geschmolzenem Käse. Hauchdünnes Fleisch für Fondue chinoise ist ideal und spart das Schneiden.",
    ingr: ["500 g Rindfleisch, hauchdünn geschnitten (z. B. für Fondue chinoise)", "2 Zwiebeln", "1 grüne Peperoni", "150 g Champignons", "8 Scheiben Provolone oder Cheddar", "4 Hotdog-Brötchen oder kleine Baguettes", "2 EL Rapsöl", "20 g Butter", "Salz, Pfeffer"],
    steps: ["Zwiebeln in feine Streifen schneiden, Peperoni und Champignons in dünne Scheiben.",
      "1 EL Rapsöl in einer grossen Bratpfanne erhitzen und Zwiebeln, Peperoni und Champignons darin 8–10 Minuten weich und leicht gebräunt braten. Salzen und herausnehmen.",
      "Brötchen der Länge nach aufschneiden, aber nicht ganz durch. Innenseiten mit Butter bestreichen und in der Pfanne 1 Minute rösten.",
      "Restliches Öl stark erhitzen und das Rindfleisch darin 1–2 Minuten braten, dabei mit zwei Spachteln zerteilen. Gemüse untermischen, mit Salz und Pfeffer würzen und in vier Portionen teilen.",
      "Je zwei Scheiben Provolone auf jede Portion legen, zudecken und 1 Minute schmelzen lassen. Mit dem Spachtel in die Brötchen heben und sofort servieren."]
  },
  {
    id: "idee-croque-monsieur", title: "Croque Monsieur", kitchen: "fr", emoji: "sandwich", cat: "main", tags: ["quick", "kids"], time: 25, serves: 4,
    note: "Das Pariser Café-Sandwich mit Schinken, Käse und Béchamel, im Ofen gratiniert. Mit einem Spiegelei obendrauf wird daraus ein Croque Madame. Dazu ein grüner Salat.",
    ingr: ["8 Scheiben Toastbrot oder Pain de mie", "4 Scheiben Hinterschinken", "150 g Gruyère, gerieben", "20 g Butter", "1 EL Mehl", "2 dl Milch", "1 TL Senf", "Salz, Pfeffer, Muskat"],
    steps: ["Ofen auf 220 °C vorheizen (Umluft 200 °C) und ein Blech mit Backpapier belegen.",
      "Butter in einer kleinen Pfanne schmelzen, Mehl einrühren und 1 Minute dünsten. Milch unter ständigem Rühren dazugiessen und 2–3 Minuten zu einer dicken Béchamel köcheln. Mit Salz, Pfeffer und Muskat würzen und die Hälfte des Gruyère einrühren.",
      "Vier Toastbrotscheiben dünn mit Senf bestreichen, mit je einer Scheibe Hinterschinken und etwas Béchamel belegen und mit den übrigen Brotscheiben zudecken.",
      "Restliche Béchamel auf den Sandwiches verstreichen und mit dem übrigen Käse bestreuen. In der Ofenmitte 8–10 Minuten backen, bis die Oberfläche goldbraun gratiniert ist."]
  },
  {
    id: "idee-piadina-rohschinken-rucola", title: "Piadina mit Rohschinken und Rucola", kitchen: "it", emoji: "fladen", cat: "main", tags: ["quick"], time: 15, serves: 4,
    note: "Das Fladenbrot der Romagna, warm gefüllt mit Rohschinken, Rucola und weichem Käse. Piadine gibt es abgepackt im Brotregal. Statt Stracchino passen Mozzarella oder Frischkäse.",
    ingr: ["4 Piadine", "8 Scheiben Rohschinken (z. B. Prosciutto crudo)", "200 g Stracchino oder Mozzarella", "80 g Rucola", "8 Cherrytomaten", "1 EL Olivenöl", "Salz, Pfeffer"],
    steps: ["Cherrytomaten in Scheiben schneiden und mit Olivenöl, Salz und Pfeffer mischen. Rucola waschen und trocken schleudern.",
      "Eine grosse Bratpfanne ohne Fett erhitzen und die Piadine einzeln pro Seite etwa 1 Minute erwärmen, bis sie weich und leicht gefleckt sind.",
      "Jede Piadina noch in der Pfanne auf einer Hälfte mit Stracchino bestreichen oder mit Mozzarella belegen, damit der Käse leicht schmilzt.",
      "Rohschinken, Rucola und Tomaten darauflegen, die Piadina zuklappen und sofort servieren."]
  },

  /* ---------- Eier und Tofu ---------- */
  {
    id: "idee-tomaten-ruehrei-reis", title: "Chinesisches Tomaten-Rührei mit Reis", kitchen: "cn", emoji: "ei", cat: "main", tags: ["vegi", "quick", "cheap", "kids"], time: 20, serves: 4,
    note: "In China kennt es jede Familie: weiche Eier in einer süss-säuerlichen Tomatensauce, auf Reis geschöpft. Am besten mit sehr reifen Tomaten; im Winter helfen 2 EL Tomatenpüree.",
    ingr: ["250 g Jasminreis", "6 Eier", "5 reife Tomaten (ca. 600 g)", "2 Frühlingszwiebeln", "1 EL Zucker", "1 EL Sojasauce", "1 TL Maizena", "3 EL Rapsöl", "Salz"],
    steps: ["Jasminreis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Tomaten in Schnitze schneiden, Frühlingszwiebeln in Ringe. Eier mit einer Prise Salz verquirlen. Maizena mit 3 EL Wasser glatt rühren.",
      "2 EL Rapsöl im Wok erhitzen, die Eier hineingiessen und unter sanftem Schieben etwa 1 Minute in grossen, noch feuchten Flocken stocken lassen. Herausnehmen.",
      "Restliches Öl erhitzen und die Tomaten 3–4 Minuten braten, bis sie Saft ziehen und weich werden. Zucker, Sojasauce und Maizena unterrühren und kurz aufkochen.",
      "Eier zurück in den Wok geben, sanft unterheben und mit Frühlingszwiebeln bestreuen. Auf dem Reis servieren."]
  },
  {
    id: "idee-senfeier-salzkartoffeln", title: "Senfeier mit Salzkartoffeln", kitchen: "de", emoji: "ei", cat: "main", tags: ["vegi", "quick", "cheap"], time: 30, serves: 4,
    note: "Norddeutsches Alltagsessen: hart gekochte Eier in einer hellen Senfsauce, dazu Salzkartoffeln. Hier mit Maizena statt Mehl gebunden – so ist das Gericht glutenfrei. Grobkörniger Senf macht die Sauce würziger.",
    ingr: ["1 kg Kartoffeln, festkochend", "8 Eier", "1 Zwiebel", "30 g Butter", "4 dl Gemüsebouillon", "1 dl Rahm", "3 EL mittelscharfer Senf", "1 EL grobkörniger Senf", "2 EL Maizena", "1 TL Zitronensaft", "½ Bund Schnittlauch oder Dill", "Salz, Pfeffer, Zucker"],
    steps: ["Kartoffeln schälen, je nach Grösse halbieren oder vierteln und in Salzwasser zugedeckt etwa 20 Minuten weich kochen.",
      "Eier in kochendem Wasser 9 Minuten hart kochen, kalt abschrecken und schälen.",
      "Zwiebel fein hacken und in der Butter 3 Minuten glasig dünsten. Gemüsebouillon und Rahm dazugiessen und aufkochen. Maizena mit 3 EL kaltem Wasser anrühren, einrühren und 2 Minuten köcheln, bis die Sauce bindet.",
      "Mittelscharfen und grobkörnigen Senf einrühren; danach nicht mehr kochen, sonst wird der Senf bitter. Mit Zitronensaft, Salz, Pfeffer und einer Prise Zucker abschmecken.",
      "Eier halbieren und in der Sauce kurz erwärmen. Kartoffeln abgiessen, mit den Senfeiern anrichten und mit gehacktem Schnittlauch bestreuen."]
  },
  {
    id: "idee-tofu-bhurji", title: "Tofu-Bhurji mit Chapati", kitchen: "in", emoji: "pfanne", cat: "main", tags: ["vegi", "vegan", "quick", "cheap"], time: 20, serves: 4,
    note: "Die vegane Schwester des indischen Anda Bhurji (Rührei): zerkrümelter Tofu, gebraten mit Zwiebeln, Tomaten und Gewürzen. Kala Namak, ein Schwarzsalz aus dem Indien-Laden, gibt einen eiähnlichen Geschmack, ist aber kein Muss.",
    ingr: ["400 g Tofu nature, fest", "1 Zwiebel", "2 Tomaten", "1 grüne Chilischote", "2 Knoblauchzehen", "1 Stück Ingwer (2 cm)", "1 TL Kreuzkümmelsamen", "½ TL Kurkuma", "1 TL Garam Masala", "100 g Erbsen, tiefgekühlt", "2 EL Rapsöl", "½ Bund Koriander", "Salz oder Kala Namak", "8 Chapati oder Fladenbrote zum Servieren"],
    steps: ["Zwiebel, Knoblauch, Ingwer und Chilischote fein hacken, Tomaten würfeln. Tofu mit den Händen in eine Schüssel krümeln.",
      "Rapsöl in einer Bratpfanne erhitzen und die Kreuzkümmelsamen darin 30 Sekunden rösten, bis sie duften. Zwiebel dazugeben und 4 Minuten goldgelb dünsten, dann Knoblauch, Ingwer und Chili kurz mitbraten.",
      "Tomaten und Kurkuma dazugeben und 3 Minuten köcheln, bis die Tomaten zerfallen.",
      "Tofu und Erbsen untermischen und 5 Minuten braten, bis der Tofu heiss und gleichmässig gelb ist. Mit Garam Masala und Salz würzen, Koriander hacken und darüberstreuen.",
      "Chapati in einer trockenen Pfanne kurz erwärmen und zum Tofu-Bhurji servieren."]
  },
  {
    id: "idee-zitronengras-tofu", title: "Zitronengras-Tofu mit Chili", kitchen: "vn", emoji: "chili", cat: "main", tags: ["vegi", "vegan", "quick"], time: 25, serves: 4,
    note: "Ein Klassiker der vietnamesischen buddhistischen Küche: knusprig gebratener Tofu mit Zitronengras, Knoblauch und Chili. Zitronengras gibt es frisch bei Coop und im Asia-Laden, gehackt auch tiefgekühlt.",
    ingr: ["400 g Tofu nature, fest", "3 Stangen Zitronengras", "3 Knoblauchzehen", "2 Schalotten", "1–2 rote Chilischoten", "2 EL Sojasauce", "1 EL Zucker", "½ TL Kurkuma", "4 EL Rapsöl", "2 Frühlingszwiebeln", "300 g Jasminreis", "Salz"],
    steps: ["Jasminreis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Tofu trocken tupfen, in 2 cm grosse Würfel schneiden und mit Kurkuma und ½ TL Salz mischen. Zitronengras putzen und das zarte Innere sehr fein hacken. Knoblauch, Schalotten und Chilischoten fein hacken.",
      "3 EL Rapsöl in einer beschichteten Bratpfanne erhitzen und den Tofu darin 8–10 Minuten rundum goldbraun und knusprig braten. Herausnehmen.",
      "Restliches Öl erhitzen und Zitronengras, Schalotten, Knoblauch und Chili 2–3 Minuten braten, bis es duftet und leicht Farbe annimmt.",
      "Tofu zurück in die Pfanne geben, Sojasauce und Zucker dazugeben und 1 Minute schwenken, bis der Tofu leicht glasiert ist. Mit Frühlingszwiebeln bestreuen und mit dem Reis servieren."]
  },
  {
    id: "idee-eier-curry", title: "Eier-Curry mit Kokosmilch", kitchen: "in", emoji: "curry", cat: "main", tags: ["vegi", "quick", "cheap"], time: 30, serves: 4,
    note: "Hart gekochte Eier in einer würzigen Tomaten-Zwiebel-Sauce sind in Indien ein beliebtes Alltagscurry. Kokosmilch macht es mild, fast wie in Kerala. Dazu Reis oder Chapati.",
    ingr: ["8 Eier", "2 Zwiebeln", "3 Knoblauchzehen", "1 Stück Ingwer (3 cm)", "1 grüne Chilischote", "1 Dose gehackte Tomaten (400 g)", "2 dl Kokosmilch", "1 TL Kurkuma", "2 TL Garam Masala", "1 TL Kreuzkümmelsamen", "2 EL Rapsöl", "½ Bund Koriander", "250 g Basmatireis", "Salz"],
    steps: ["Basmatireis nach Packungsangabe kochen. Eier in kochendem Wasser 9 Minuten hart kochen, kalt abschrecken und schälen.",
      "Zwiebeln, Knoblauch, Ingwer und Chilischote fein hacken. Rapsöl in einer Pfanne erhitzen, Kreuzkümmelsamen kurz rösten, dann die Zwiebeln dazugeben und 6–8 Minuten goldbraun braten.",
      "Knoblauch, Ingwer und Chili 1 Minute mitbraten. Kurkuma und Garam Masala einrühren, Tomaten dazugeben und etwa 8 Minuten köcheln.",
      "Kokosmilch einrühren und salzen. Eier rundum leicht einritzen, in die Sauce legen und 5 Minuten darin ziehen lassen. Mit Koriander bestreuen und mit dem Reis servieren."]
  },
  {
    id: "idee-tofu-pak-choi-ingwer", title: "Tofu mit Pak Choi in Knoblauch-Ingwer-Sauce", kitchen: "cn", emoji: "gemuese", cat: "main", tags: ["vegi", "vegan", "quick"], time: 25, serves: 4,
    note: "Ein schlichtes chinesisches Hausgericht: goldbraun gebratener Tofu und knackiger Pak Choi in einer glänzenden Sauce aus Sojasauce, Ingwer und Knoblauch. Statt Pak Choi gehen Broccoli oder Chinakohl.",
    ingr: ["400 g Tofu nature, fest", "500 g Pak Choi (ca. 4 Stück)", "3 Knoblauchzehen", "1 Stück Ingwer (3 cm)", "2 Frühlingszwiebeln", "3 EL Sojasauce", "1 EL Hoisinsauce", "1 TL Zucker", "2 TL Maizena", "1 TL Sesamöl", "3 EL Rapsöl", "300 g Jasminreis"],
    steps: ["Jasminreis nach Packungsangabe kochen, meist etwa 15 Minuten.",
      "Tofu trocken tupfen und in 1 cm dicke, mundgerechte Scheiben schneiden. Pak Choi längs vierteln und waschen. Knoblauch und Ingwer fein hacken, Frühlingszwiebeln in Ringe schneiden. Sojasauce, Hoisinsauce, Zucker, Maizena und 1 dl Wasser verrühren.",
      "2 EL Rapsöl in einer beschichteten Bratpfanne erhitzen und den Tofu darin pro Seite 3–4 Minuten goldbraun braten. Herausnehmen.",
      "Restliches Öl im Wok erhitzen, Knoblauch und Ingwer kurz anbraten. Pak Choi dazugeben und 2–3 Minuten pfannenrühren, bis die Stiele knackig-weich sind.",
      "Sauce dazugiessen und aufkochen, bis sie bindet. Tofu zurück in den Wok geben, kurz schwenken und mit Sesamöl beträufeln. Mit Frühlingszwiebeln bestreuen und mit dem Reis servieren."]
  },

  /* ---------- Kartoffeln, Polenta und Gnocchi ---------- */
  {
    id: "idee-pfannen-gnocchi-tomaten", title: "Pfannen-Gnocchi mit Tomaten und Mozzarella", kitchen: "it", emoji: "pfanne", cat: "main", tags: ["vegi", "quick", "kids"], time: 20, serves: 4,
    note: "Gnocchi aus dem Kühlregal direkt in der Pfanne knusprig braten statt kochen – das geht schneller und schmeckt besser. Glutenfreie Gnocchi gibt es inzwischen in vielen Läden.",
    ingr: ["800 g Gnocchi aus dem Kühlregal", "400 g Cherrytomaten", "2 Knoblauchzehen", "150 g Mozzarella", "1 Bund Basilikum", "3 EL Olivenöl", "30 g Parmesan, gerieben", "Salz, Pfeffer"],
    steps: ["Olivenöl in einer grossen beschichteten Bratpfanne erhitzen. Gnocchi hineingeben und bei mittlerer bis starker Hitze 6–8 Minuten braten, dabei nur ab und zu wenden, bis sie rundum goldbraun und knusprig sind.",
      "Cherrytomaten halbieren, Knoblauch in Scheiben schneiden. Beides zu den Gnocchi geben und 3–4 Minuten mitbraten, bis die Tomaten weich werden und Saft ziehen. Salzen und pfeffern.",
      "Mozzarella in Stücke zupfen und auf den Gnocchi verteilen, zudecken und 2 Minuten schmelzen lassen.",
      "Mit zerzupftem Basilikum und Parmesan bestreuen und direkt aus der Pfanne servieren."]
  },
  {
    id: "idee-polenta-pilzragout", title: "Polenta mit Pilzragout", kitchen: "ch", emoji: "pilz", cat: "main", tags: ["vegi", "quick"], time: 25, serves: 4,
    note: "Ein Tessiner Herbstessen in der Schnellversion: Mit schnellkochender Polenta steht es rasch auf dem Tisch. Bramata braucht 40 Minuten länger, schmeckt aber kräftiger. Von Natur aus glutenfrei.",
    ingr: ["500 g gemischte Pilze (z. B. Champignons, Kräuterseitlinge)", "1 Zwiebel", "1 Knoblauchzehe", "1 dl Weisswein", "1,5 dl Rahm", "2 Zweige Thymian", "6 dl Gemüsebouillon", "2 dl Milch", "200 g Polenta, schnellkochend", "40 g Butter", "60 g Sbrinz oder Parmesan, gerieben", "2 EL Olivenöl", "½ Bund Petersilie", "Salz, Pfeffer"],
    steps: ["Pilze putzen und in Scheiben oder Stücke schneiden. Zwiebel und Knoblauch fein hacken.",
      "Olivenöl in einer grossen Bratpfanne stark erhitzen und die Pilze darin portionenweise 4–5 Minuten kräftig anbraten. Zwiebel und Knoblauch dazugeben und 2 Minuten mitdünsten.",
      "Mit Weisswein ablöschen und fast ganz einkochen. Rahm und abgezupfte Thymianblättchen dazugeben und 3–4 Minuten sämig köcheln. Mit Salz und Pfeffer abschmecken.",
      "Inzwischen Gemüsebouillon und Milch aufkochen. Polenta unter Rühren einrieseln lassen und nach Packungsangabe etwa 5 Minuten unter Rühren köcheln. Butter und Sbrinz unterrühren.",
      "Polenta auf Teller verteilen, das Pilzragout darübergeben und mit gehackter Petersilie bestreuen."]
  },
  {
    id: "idee-chakalaka-pap", title: "Chakalaka mit Maisbrei", kitchen: "afrika", emoji: "eintopf", cat: "main", tags: ["vegi", "vegan", "quick", "cheap"], time: 30, serves: 4,
    note: "Südafrikanisches Gemüse-Bohnen-Ragout aus den Townships rund um Johannesburg, scharf und würzig. Dazu gibt es Pap, einen festen Maisbrei; Polenta ist ein guter Ersatz für das weisse Maismehl. Glutenfrei.",
    ingr: ["1 Zwiebel", "2 Knoblauchzehen", "1 Stück Ingwer (2 cm)", "1–2 Chilischoten", "1 rote und 1 grüne Peperoni", "2 Rüebli", "2 TL Currypulver", "1 TL Paprikapulver", "1 Dose gehackte Tomaten (400 g)", "1 Dose weisse Bohnen (400 g)", "2 EL Rapsöl", "8 dl Wasser", "200 g Polenta, schnellkochend", "Salz"],
    steps: ["Zwiebel, Knoblauch, Ingwer und Chilischoten fein hacken. Peperoni in kleine Würfel schneiden, Rüebli grob raffeln.",
      "Rapsöl in einer Pfanne erhitzen und die Zwiebel 3 Minuten dünsten. Knoblauch, Ingwer, Chili, Currypulver und Paprikapulver dazugeben und 1 Minute mitrösten.",
      "Peperoni und Rüebli dazugeben und 5 Minuten braten. Tomaten und abgespülte Bohnen dazugeben, salzen und offen etwa 10 Minuten köcheln, bis das Gemüse weich ist.",
      "Für den Pap 8 dl Wasser mit 1 TL Salz aufkochen, Polenta unter Rühren einrieseln lassen und 5 Minuten unter Rühren köcheln, bis ein fester Brei entsteht. Er darf fester sein als eine Tessiner Polenta.",
      "Pap mit einem nassen Löffel zu Nocken formen und mit dem Chakalaka servieren."]
  },
  {
    id: "idee-bauernfruehstueck", title: "Bauernfrühstück", kitchen: "de", emoji: "kartoffel", cat: "main", tags: ["quick", "cheap"], time: 25, serves: 4,
    note: "Trotz des Namens ein deftiges Abendessen aus Norddeutschland: Bratkartoffeln mit Speck und Zwiebeln, mit Eiern gestockt. Ideal für gekochte Kartoffeln vom Vortag. Dazu Essiggurken.",
    ingr: ["800 g Kartoffeln, festkochend, gekocht (vom Vortag)", "150 g Speckwürfeli", "1 Zwiebel", "6 Eier", "1 dl Milch", "2 EL Bratbutter", "½ Bund Schnittlauch", "Salz, Pfeffer, Paprikapulver", "Essiggurken zum Servieren"],
    steps: ["Kartoffeln schälen und in 5 mm dicke Scheiben schneiden. Zwiebel fein hacken.",
      "Bratbutter in einer grossen Bratpfanne erhitzen und die Kartoffeln darin bei mittlerer Hitze 10–12 Minuten goldbraun und knusprig braten, dabei nur gelegentlich wenden.",
      "Speckwürfeli und Zwiebel dazugeben und 3–4 Minuten mitbraten, bis der Speck knusprig ist. Mit Salz, Pfeffer und Paprikapulver würzen.",
      "Eier mit Milch und gehacktem Schnittlauch verquirlen, über die Kartoffeln giessen und bei kleiner Hitze 3–4 Minuten stocken lassen, dabei ab und zu mit dem Spachtel vom Pfannenboden lösen. Mit Essiggurken servieren."]
  },
  {
    id: "idee-kartoffelpfanne-chorizo", title: "Kartoffelpfanne mit Chorizo und Peperoni", kitchen: "es", emoji: "kartoffel", cat: "main", tags: ["quick"], time: 30, serves: 4,
    note: "Spanisch inspiriert: Die Chorizo färbt Kartoffeln und Peperoni rot und würzt alles mit. Mit einem Spiegelei obendrauf wird es noch sättigender; für Vegis mit Kichererbsen und mehr Paprikapulver.",
    ingr: ["800 g Kartoffeln, festkochend", "200 g Chorizo", "1 rote Peperoni", "1 grüne Peperoni", "1 rote Zwiebel", "2 Knoblauchzehen", "1 TL Paprikapulver, geräuchert", "3 EL Olivenöl", "½ Bund Petersilie", "Salz, Pfeffer"],
    steps: ["Kartoffeln schälen und in 1,5 cm grosse Würfel schneiden. Chorizo in Scheiben schneiden, Peperoni und Zwiebel in Stücke, Knoblauch in Scheiben.",
      "Olivenöl in einer grossen Bratpfanne erhitzen, die Kartoffeln hineingeben, salzen und zugedeckt bei mittlerer Hitze 12 Minuten braten, dabei zwei- bis dreimal wenden.",
      "Deckel abnehmen, Chorizo, Peperoni und Zwiebel dazugeben und offen 8–10 Minuten weiterbraten, bis die Kartoffeln weich und knusprig sind.",
      "Knoblauch und Paprikapulver untermischen und 1 Minute mitbraten. Mit Pfeffer abschmecken und mit gehackter Petersilie bestreuen."]
  },
  {
    id: "idee-gschwellti-kaese-quark", title: "Gschwellti mit Käse und Kräuterquark", kitchen: "ch", emoji: "kartoffel", cat: "main", tags: ["vegi", "quick", "cheap", "kids"], time: 30, serves: 4,
    note: "Das einfachste Schweizer Znacht: Kartoffeln in der Schale mit einer Auswahl Käse, Kräuterquark und Essiggurken. Ideal, um Käsereste aufzubrauchen. Von Natur aus glutenfrei.",
    ingr: ["1,2 kg Kartoffeln, festkochend (z. B. Charlotte)", "250 g Magerquark", "100 g Sauerrahm", "1 Bund Schnittlauch", "½ Bund Petersilie", "1 kleine Knoblauchzehe", "400 g Käse nach Wahl (z. B. Appenzeller, Tilsiter, Emmentaler, Tête de Moine)", "Essiggurken und Silberzwiebeln", "Butter zum Servieren", "Salz, Pfeffer"],
    steps: ["Kartoffeln waschen und in der Schale mit wenig Salzwasser zugedeckt 20–25 Minuten weich kochen.",
      "Schnittlauch und Petersilie fein schneiden, Knoblauch pressen. Quark mit Sauerrahm, Kräutern und Knoblauch glatt rühren und mit Salz und Pfeffer würzen.",
      "Käse auf einem Brett anrichten, die harten Sorten in Scheiben schneiden. Essiggurken und Silberzwiebeln in Schälchen geben.",
      "Kartoffeln abgiessen, kurz ausdampfen lassen und heiss im Körbchen auf den Tisch stellen. Jeder schält selbst und isst sie mit Käse, Kräuterquark und etwas Butter."]
  }
]);
