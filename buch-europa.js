/* Home-Planer: Rezeptbuch – Europa (Italien, Frankreich, Spanien & Portugal, Griechenland, Deutschland & Österreich,
   Schweiz, Osteuropa, Skandinavien & Britische Inseln). Eigene Rezepte nach demselben Muster wie in ideen.js.
   Kennungen (emoji, cat, tags, kitchen, coll) aus logic.js. time in Minuten. */
window.HP_IDEEN = (window.HP_IDEEN || []).concat([
  /* ---------- Italienisch ---------- */
  {
    id: "idee-spaghetti-carbonara", title: "Spaghetti Carbonara", kitchen: "it", emoji: "pasta", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Die römische Carbonara kommt ohne Rahm aus: Eigelb, Pecorino und etwas Kochwasser machen die Sauce cremig. Guanciale (Schweinebacke) gibt es im Italien-Regal oder beim Metzger, Pancetta geht auch.",
    ingr: ["400 g Spaghetti", "150 g Guanciale oder Pancetta, am Stück", "4 Eigelb", "1 Ei", "80 g Pecorino romano, fein gerieben", "Salz, Pfeffer aus der Mühle"],
    steps: ["Reichlich Wasser für die Spaghetti aufkochen und nur mit wenig Salz würzen, denn Guanciale und Pecorino bringen schon Salz mit.",
      "Guanciale in kleine Streifen schneiden und in einer grossen Bratpfanne ohne Fett bei mittlerer Hitze 6–8 Minuten auslassen, bis er knusprig ist. Pfanne vom Herd ziehen.",
      "Eigelb, Ei und Pecorino in einer Schüssel mit reichlich Pfeffer zu einer dicken Creme verrühren.",
      "Spaghetti al dente kochen, je nach Sorte 9–11 Minuten. Vor dem Abgiessen 2 dl Kochwasser abschöpfen.",
      "Spaghetti tropfnass zum Guanciale in die Pfanne geben, der Herd bleibt aus. Eimasse mit 3 EL Kochwasser verdünnen, darübergiessen und kräftig schwenken, bis die Sauce cremig bindet – nicht mehr erhitzen, sonst stockt das Ei. Wenn nötig mehr Kochwasser dazugeben und sofort mit Pecorino und Pfeffer servieren."]
  },
  {
    id: "idee-pasta-pesto-genovese", title: "Pasta al Pesto Genovese", kitchen: "it", emoji: "pasta", cat: "main", tags: ["vegi", "quick"], time: 30, serves: 4,
    note: "In Ligurien kochen Kartoffeln und grüne Bohnen gleich mit den Teigwaren – so wird das Pesto besonders cremig. Pinienkerne sind teuer; Cashewkerne oder Baumnüsse gehen auch.",
    ingr: ["400 g Linguine oder Trofie", "2 Kartoffeln, festkochend (ca. 250 g)", "150 g grüne Bohnen", "2 Bund Basilikum (ca. 60 g Blätter)", "1 Knoblauchzehe", "40 g Pinienkerne", "60 g Parmesan, fein gerieben", "1 dl Olivenöl", "Salz"],
    steps: ["Basilikumblätter abzupfen. Mit Knoblauch, Pinienkernen und einer Prise Salz im Mörser oder Cutter fein zerkleinern. Parmesan und Olivenöl unterrühren, bis ein sämiges Pesto entsteht.",
      "Kartoffeln schälen und in kleine Würfel schneiden. Bohnen rüsten und in 3 cm lange Stücke schneiden.",
      "Linguine in reichlich Salzwasser kochen. Kartoffeln und Bohnen gleich dazugeben und alles zusammen 10–12 Minuten garen, bis die Pasta al dente ist.",
      "Vor dem Abgiessen 1 dl Kochwasser abschöpfen. Pesto mit 3–4 EL Kochwasser glatt rühren und mit Pasta, Kartoffeln und Bohnen mischen. Sofort servieren; Pesto nie kochen, sonst wird das Basilikum dunkel und bitter."]
  },
  {
    id: "idee-penne-arrabbiata", title: "Penne all'Arrabbiata", kitchen: "it", emoji: "chili", cat: "main", tags: ["vegi", "vegan", "quick", "cheap"], time: 25, serves: 4,
    note: "«Arrabbiata» heisst wütend – gemeint ist die Schärfe der Chili. Wer es milder mag, nimmt nur eine halbe Schote; wer nicht vegan isst, reibt Pecorino darüber.",
    ingr: ["400 g Penne rigate", "3 Knoblauchzehen", "1–2 getrocknete Chilischoten oder ½ TL Chiliflocken", "2 Dosen gehackte Tomaten (à 400 g)", "4 EL Olivenöl", "½ Bund glattblättrige Petersilie", "Salz"],
    steps: ["Knoblauch in feine Scheiben schneiden, Chili zerbröseln. Beides im Olivenöl bei kleiner Hitze 2–3 Minuten sanft anziehen lassen, ohne dass der Knoblauch braun wird.",
      "Tomaten dazugeben, mit Salz würzen und offen etwa 15 Minuten köcheln, bis die Sauce eingedickt ist.",
      "Inzwischen die Penne in reichlich Salzwasser al dente kochen, meist 10–11 Minuten. Eine Tasse Kochwasser beiseitestellen.",
      "Penne abgiessen, in der Sauce schwenken und nach Bedarf mit etwas Kochwasser lockern. Petersilie hacken und darüberstreuen."]
  },
  {
    id: "idee-saltimbocca", title: "Saltimbocca alla Romana", kitchen: "it", emoji: "fleisch", cat: "main", tags: ["quick", "guests"], time: 25, serves: 4,
    note: "«Spring in den Mund»: zarte Kalbsplätzli mit Rohschinken und Salbei, in wenigen Minuten gebraten. Ohne Wein mit Kalbsfond und einem Spritzer Zitronensaft ablöschen.",
    ingr: ["8 Kalbsplätzli (ca. 500 g), dünn geklopft", "8 Scheiben Rohschinken (z. B. Prosciutto crudo)", "8 Salbeiblätter", "2 EL Mehl", "2 EL Bratbutter", "1 dl Weisswein oder Kalbsfond", "30 g kalte Butter", "Salz, Pfeffer"],
    steps: ["Plätzli leicht mit Pfeffer würzen; Salz braucht es wegen des Schinkens kaum. Auf jedes ein Salbeiblatt und eine Scheibe Rohschinken legen und mit einem Zahnstocher feststecken.",
      "Plätzli auf der Fleischseite leicht mit Mehl bestäuben. Bratbutter in einer grossen Bratpfanne erhitzen und die Saltimbocca zuerst auf der Schinkenseite 1–2 Minuten, dann auf der Fleischseite noch 1 Minute braten. Herausnehmen und warm stellen.",
      "Bratsatz mit Weisswein ablöschen und 2–3 Minuten einkochen. Pfanne vom Herd nehmen, kalte Butter in Stücken einrühren und mit Salz abschmecken.",
      "Sauce über das Fleisch giessen und sofort servieren. Dazu passen Kartoffelstock oder Risotto."]
  },
  {
    id: "idee-ossobuco", title: "Ossobuco mit Gremolata", kitchen: "it", emoji: "fleisch", cat: "main", tags: ["guests", "prep"], time: 150, serves: 4,
    note: "Mailänder Schmorgericht aus Kalbshaxe; das Mark in der Mitte ist eine Delikatesse. Klassisch mit Risotto alla Milanese. Ohne Wein mehr Kalbsfond und 1 EL Zitronensaft nehmen.",
    ingr: ["4 Scheiben Kalbshaxe (Ossobuco, je ca. 250 g)", "2 EL Mehl", "3 EL Olivenöl", "1 Zwiebel", "2 Rüebli", "2 Stangen Stangensellerie", "3 Knoblauchzehen", "1 EL Tomatenpüree", "2 dl Weisswein", "1 Dose gehackte Tomaten (400 g)", "3 dl Kalbsfond oder Bouillon", "1 Lorbeerblatt", "1 Bio-Zitrone", "½ Bund glattblättrige Petersilie", "Salz, Pfeffer"],
    steps: ["Den Rand der Kalbshaxen zwei- bis dreimal einschneiden, damit sie sich beim Braten nicht wölben. Mit Salz und Pfeffer würzen, im Mehl wenden und im Olivenöl in einem Schmortopf auf beiden Seiten je 3–4 Minuten kräftig anbraten. Herausnehmen.",
      "Zwiebel, Rüebli, Sellerie und 2 Knoblauchzehen fein würfeln und im Bratfett etwa 5 Minuten andünsten. Tomatenpüree unterrühren und kurz mitrösten.",
      "Mit Weisswein ablöschen und etwas einkochen lassen. Tomaten, Kalbsfond und Lorbeerblatt dazugeben, Fleisch wieder hineinlegen und zugedeckt bei kleiner Hitze 1½–2 Stunden schmoren, bis es sich fast vom Knochen löst. Ab und zu wenden.",
      "Für die Gremolata die Schale der Zitrone fein abreiben, Petersilie und die restliche Knoblauchzehe sehr fein hacken und alles mischen.",
      "Sauce abschmecken und das Lorbeerblatt entfernen. Ossobuco mit der Sauce anrichten, mit Gremolata bestreuen und mit Risotto oder Polenta servieren."]
  },
  {
    id: "idee-vitello-tonnato", title: "Vitello tonnato", kitchen: "it", emoji: "fleisch", cat: "main", tags: ["guests", "prep"], time: 100, serves: 4,
    note: "Piemonteser Sommerklassiker: zart gegartes Kalb mit Thonsauce. Am besten am Vortag zubereiten und das Fleisch über Nacht im Sud auskühlen lassen. Ohne Wein mehr Wasser und einen Schuss Weissweinessig nehmen.",
    ingr: ["800 g Kalbsnuss am Stück", "1 Zwiebel", "1 Rüebli", "1 Stange Stangensellerie", "1 Lorbeerblatt", "2 dl Weisswein", "1 l Wasser", "1 Dose Thon in Öl (ca. 150 g), abgetropft", "4 Sardellenfilets", "2 EL Kapern", "150 g Mayonnaise", "½ Zitrone", "Salz, Pfeffer"],
    steps: ["Zwiebel, Rüebli und Sellerie grob schneiden. Mit Lorbeerblatt, Weisswein, Wasser und 1 TL Salz in einem Topf aufkochen.",
      "Kalbsnuss in den Sud legen; sie sollte knapp bedeckt sein, sonst etwas Wasser nachgiessen. Knapp unter dem Siedepunkt 50–60 Minuten ziehen lassen, bis sie innen 60 °C erreicht. Im Sud vollständig auskühlen lassen.",
      "Für die Sauce Thon, Sardellen, 1 EL Kapern, Mayonnaise und 1 EL Zitronensaft fein pürieren. Mit 3–4 EL Sud zu einer cremigen Sauce verdünnen und mit Pfeffer abschmecken.",
      "Fleisch aus dem Sud nehmen, quer zur Faser in sehr dünne Scheiben schneiden und auf einer Platte auslegen. Sauce darüber verteilen, mit den restlichen Kapern bestreuen und vor dem Servieren mindestens 1 Stunde kühl ziehen lassen."]
  },
  {
    id: "idee-parmigiana-melanzane", title: "Parmigiana di Melanzane", kitchen: "it", emoji: "gemuese", cat: "main", tags: ["vegi", "prep"], time: 90, serves: 4,
    note: "Süditalienischer Auflauf aus Auberginen, Tomatensauce und Käse. Statt sie zu frittieren, werden die Auberginen hier im Ofen gebraten – das geht leichter und braucht weniger Öl. Aufgewärmt noch besser.",
    ingr: ["3 Auberginen (ca. 1 kg)", "2 Knoblauchzehen", "700 g Passata", "1 Bund Basilikum", "300 g Mozzarella (2 Kugeln)", "80 g Parmesan, gerieben", "1 dl Olivenöl", "Salz, Pfeffer"],
    steps: ["Ofen auf 220 °C vorheizen (Umluft 200 °C). Auberginen längs in 1 cm dicke Scheiben schneiden, auf zwei mit Backpapier belegte Bleche legen, mit Olivenöl bepinseln und leicht salzen.",
      "Auberginen 20–25 Minuten backen, bis sie weich und goldbraun sind; nach der Hälfte der Zeit wenden.",
      "Inzwischen Knoblauch hacken und in 2 EL Olivenöl kurz andünsten. Passata dazugeben, mit Salz und Pfeffer würzen und offen 15 Minuten köcheln. Basilikumblätter zerzupfen und unterrühren.",
      "Ofen auf 200 °C zurückschalten (Umluft 180 °C). In einer Gratinform abwechselnd Sauce, Auberginen, zerzupften Mozzarella und Parmesan schichten, mit Sauce und Parmesan abschliessen.",
      "Etwa 30 Minuten backen, bis es am Rand blubbert und die Oberfläche goldbraun ist. Vor dem Servieren 10 Minuten ruhen lassen."]
  },
  {
    id: "idee-pizza-margherita", title: "Pizza Margherita", kitchen: "it", emoji: "pizza", cat: "main", tags: ["vegi", "kids"], time: 150, serves: 4,
    note: "Pizzateig selbst gemacht ist einfacher, als man denkt. Für mehr Aroma den Teig mit nur 3 g Hefe am Vortag ansetzen und über Nacht im Kühlschrank gehen lassen.",
    ingr: ["500 g Weissmehl oder Pizzamehl (Tipo 00)", "3 dl lauwarmes Wasser", "10 g frische Hefe (¼ Würfel)", "2 TL Salz", "3 EL Olivenöl", "1 Dose geschälte Tomaten (Pelati, 400 g)", "300 g Mozzarella (2 Kugeln), gut abgetropft", "1 Bund Basilikum"],
    steps: ["Hefe im lauwarmen Wasser auflösen. Weissmehl und Salz in einer Schüssel mischen, Hefewasser und 2 EL Olivenöl dazugeben und etwa 10 Minuten zu einem glatten, geschmeidigen Teig kneten.",
      "Teig zugedeckt bei Raumtemperatur 1–1½ Stunden aufgehen lassen, bis er sich verdoppelt hat. In vier Stücke teilen und zu Kugeln formen.",
      "Ofen auf 250 °C Unter- und Oberhitze vorheizen und ein Blech mitheizen, mindestens 30 Minuten. Tomaten mit den Händen zerdrücken oder kurz pürieren und mit Salz und 1 EL Olivenöl würzen. Mozzarella in Stücke zupfen.",
      "Teigkugeln auf Backpapier dünn ausziehen oder auswallen, den Rand etwas dicker lassen, und mit wenig Tomatensauce bestreichen.",
      "Pizza mit dem Backpapier aufs heisse Blech ziehen und im unteren Teil des Ofens 6–8 Minuten backen. Mozzarella darauf verteilen und weitere 3–4 Minuten backen, bis der Rand knusprig ist. Mit Basilikum belegen und mit den übrigen Pizzen gleich verfahren."]
  },
  {
    id: "idee-risotto-milanese", title: "Risotto alla Milanese", kitchen: "it", emoji: "reis", cat: "main", tags: ["vegi", "guests"], time: 35, serves: 4,
    note: "Der goldgelbe Mailänder Safranrisotto ist die klassische Beilage zum Ossobuco, schmeckt aber auch allein. Safranpulver gibt es in kleinen Briefchen beim Gewürzregal.",
    ingr: ["300 g Risottoreis (Carnaroli oder Arborio)", "1 Zwiebel", "60 g Butter", "1 dl Weisswein", "1 l Gemüsebouillon, heiss", "2 Briefchen Safranpulver (à 0.125 g)", "60 g Parmesan, gerieben", "Salz, Pfeffer"],
    steps: ["Safran in 1 dl heisser Bouillon auflösen und beiseitestellen. Zwiebel sehr fein hacken und in der Hälfte der Butter 3 Minuten glasig dünsten.",
      "Risottoreis dazugeben und unter Rühren 1–2 Minuten mitdünsten, bis er glasig ist. Mit Weisswein ablöschen und einkochen lassen.",
      "Heisse Bouillon nach und nach dazugiessen, sodass der Reis immer knapp bedeckt ist, und unter häufigem Rühren 16–18 Minuten köcheln. Nach etwa 10 Minuten die Safranbouillon dazugeben.",
      "Wenn der Reis cremig und noch bissfest ist, Pfanne vom Herd nehmen. Restliche Butter in Stücken und Parmesan kräftig unterrühren, zugedeckt 2 Minuten ruhen lassen, mit Salz und Pfeffer abschmecken und servieren."]
  },
  {
    id: "idee-tiramisu", title: "Tiramisù", kitchen: "it", emoji: "kuchen", cat: "sweet", tags: ["vegi", "guests", "prep"], time: 30, serves: 6,
    note: "Mit rohen Eiern: nicht für Schwangere und kleine Kinder. Den Alkohol kann man weglassen; wer keine rohen Eiweisse mag, zieht stattdessen 2 dl geschlagenen Rahm unter die Creme.",
    ingr: ["4 sehr frische Eier", "100 g Zucker", "500 g Mascarpone", "3 dl starker Kaffee oder Espresso, abgekühlt", "2 EL Amaretto oder Marsala (nach Belieben)", "200 g Löffelbiscuits", "2 EL Kakaopulver", "1 Prise Salz"],
    steps: ["Eier trennen. Eigelb mit dem Zucker etwa 5 Minuten zu einer hellen, dicken Creme aufschlagen. Mascarpone löffelweise kurz unterrühren.",
      "Eiweiss mit dem Salz steif schlagen und locker unter die Mascarponecreme ziehen.",
      "Kaffee mit Amaretto in einem tiefen Teller mischen. Die Hälfte der Löffelbiscuits kurz darin wenden – nur eintauchen, nicht vollsaugen lassen – und eine Form von etwa 20 × 30 cm damit auslegen.",
      "Die Hälfte der Creme darauf verstreichen. Mit den restlichen getunkten Biscuits und der übrigen Creme eine zweite Schicht bilden.",
      "Zugedeckt mindestens 4 Stunden, besser über Nacht, kühl stellen. Vor dem Servieren Kakaopulver durch ein Sieb darüberstäuben."]
  },

  /* ---------- Französisch ---------- */
  {
    id: "idee-coq-au-vin", title: "Coq au Vin", kitchen: "fr", emoji: "poulet", cat: "main", tags: ["guests", "prep"], time: 105, serves: 4,
    note: "Burgundischer Schmortopf, in dem das Poulet langsam in Rotwein gart. Ohne Alkohol: halb roter Traubensaft, halb Bouillon und 2 EL Rotweinessig. Am Vortag gekocht schmeckt er noch besser.",
    ingr: ["4 ganze Pouletschenkel (ca. 1.2 kg)", "150 g Speckwürfeli", "250 g kleine Champignons", "200 g Perlzwiebeln oder kleine Schalotten", "2 Knoblauchzehen", "2 Rüebli", "2 EL Mehl", "1 EL Tomatenpüree", "5 dl kräftiger Rotwein (z. B. Pinot noir)", "2 dl Geflügelbouillon", "2 Zweige Thymian", "1 Lorbeerblatt", "2 EL Bratbutter", "Salz, Pfeffer", "½ Bund Petersilie"],
    steps: ["Pouletschenkel im Gelenk halbieren, mit Salz und Pfeffer würzen und in der Bratbutter in einem Schmortopf rundum goldbraun anbraten, etwa 8 Minuten. Herausnehmen.",
      "Speckwürfeli, geschälte Perlzwiebeln, Champignons und Rüebli in Scheiben im Bratfett 5 Minuten anbraten. Knoblauch hacken, mit dem Tomatenpüree dazugeben und kurz mitrösten, dann mit dem Mehl bestäuben.",
      "Mit Rotwein und Bouillon ablöschen, Thymian und Lorbeer dazugeben und aufkochen. Poulet wieder hineinlegen und zugedeckt bei kleiner Hitze 45–60 Minuten schmoren, bis das Fleisch weich ist.",
      "Deckel abnehmen und die Sauce etwa 10 Minuten einkochen, bis sie leicht sämig ist. Abschmecken und mit gehackter Petersilie bestreuen. Dazu passen Salzkartoffeln, Nudeln oder Baguette."]
  },
  {
    id: "idee-boeuf-bourguignon", title: "Boeuf Bourguignon", kitchen: "fr", emoji: "eintopf", cat: "main", tags: ["guests", "prep"], time: 210, serves: 4,
    note: "Der Klassiker aus dem Burgund: Rindfleisch schmort stundenlang in Rotwein, bis es butterzart ist. Ohne Alkohol mit Bouillon, 2 dl Traubensaft und 2 EL Rotweinessig. Aufgewärmt am nächsten Tag noch besser.",
    ingr: ["1 kg Rindsragout (Schulter), in 4 cm grossen Würfeln", "150 g Speckwürfeli", "2 Zwiebeln", "3 Rüebli", "2 Knoblauchzehen", "2 EL Tomatenpüree", "2 EL Mehl", "7 dl kräftiger Rotwein (z. B. Pinot noir)", "2 dl Rindsbouillon", "250 g kleine Champignons", "200 g Perlzwiebeln oder kleine Schalotten", "2 Zweige Thymian", "2 Lorbeerblätter", "3 EL Bratbutter", "Salz, Pfeffer", "½ Bund Petersilie"],
    steps: ["Ragout trocken tupfen, mit Salz und Pfeffer würzen. In einem Schmortopf in 2 EL Bratbutter portionenweise rundum kräftig anbraten, pro Portion etwa 5 Minuten, und herausnehmen.",
      "Speckwürfeli im Topf auslassen. Zwiebeln und Rüebli grob würfeln, Knoblauch hacken, alles dazugeben und 5 Minuten anbraten. Tomatenpüree unterrühren, mit Mehl bestäuben und kurz rösten.",
      "Mit Rotwein und Bouillon ablöschen, Fleisch, Thymian und Lorbeer dazugeben. Aufkochen und zugedeckt bei kleiner Hitze 2½–3 Stunden schmoren, bis das Fleisch sehr weich ist.",
      "Gegen Ende Champignons halbieren und mit den geschälten Perlzwiebeln in der restlichen Bratbutter 8–10 Minuten goldbraun braten. Unter das Ragout mischen.",
      "Thymianzweige und Lorbeer entfernen, Sauce abschmecken und mit gehackter Petersilie bestreuen. Dazu Kartoffelstock, Nudeln oder Baguette servieren."]
  },
  {
    id: "idee-ratatouille", title: "Ratatouille", kitchen: "fr", emoji: "gemuese", cat: "main", tags: ["vegi", "vegan", "prep"], time: 60, serves: 4,
    note: "Provenzalischer Gemüseeintopf aus dem Sommer. Jedes Gemüse wird zuerst für sich angebraten, so bleibt es aromatisch und wird nicht matschig. Passt zu Reis, Couscous oder Baguette und schmeckt auch kalt.",
    ingr: ["1 Aubergine", "2 Zucchetti", "2 Peperoni (rot und gelb)", "1 Zwiebel", "3 Knoblauchzehen", "500 g reife Tomaten", "1 EL Tomatenpüree", "6 EL Olivenöl", "2 Zweige Thymian oder 1 TL Kräuter der Provence", "1 Lorbeerblatt", "½ Bund Basilikum", "Salz, Pfeffer"],
    steps: ["Aubergine, Zucchetti und Peperoni in etwa 2 cm grosse Würfel schneiden. Zwiebel und Knoblauch fein hacken, Tomaten grob würfeln.",
      "In einer weiten Bratpfanne 2 EL Olivenöl erhitzen und die Aubergine 5–6 Minuten goldbraun braten, herausnehmen. Zucchetti und Peperoni nacheinander gleich anbraten, je etwa 4 Minuten.",
      "Restliches Olivenöl in einem Topf erhitzen, Zwiebel und Knoblauch 3 Minuten andünsten. Tomatenpüree, Tomaten, Thymian und Lorbeerblatt dazugeben und 10 Minuten köcheln.",
      "Angebratenes Gemüse dazugeben, mit Salz und Pfeffer würzen und zugedeckt bei kleiner Hitze 20–25 Minuten schmoren. Lorbeerblatt entfernen, Basilikum zerzupfen und darüberstreuen."]
  },
  {
    id: "idee-quiche-lorraine", title: "Quiche Lorraine", kitchen: "fr", emoji: "waehe", cat: "main", tags: ["guests"], time: 60, serves: 4,
    note: "Die Quiche aus Lothringen besteht im Original nur aus Speck, Eiern und Rahm; Käse ist eine beliebte Ergänzung. Vegi-Variante: statt Speck 2 Stangen gedünsteten Lauch und etwas mehr Käse.",
    ingr: ["1 Kuchenteig, rund ausgewallt (ca. 28 cm)", "200 g Speckwürfeli", "80 g Gruyère, gerieben (nach Belieben)", "4 Eier", "2 dl Rahm", "1 dl Milch", "Salz, Pfeffer, Muskat"],
    steps: ["Ofen auf 200 °C Unter- und Oberhitze vorheizen. Kuchenteig samt Backpapier in eine Quiche- oder Wähenform legen, den Rand andrücken und den Boden mit einer Gabel dicht einstechen.",
      "Speckwürfeli in einer Bratpfanne ohne Fett etwa 5 Minuten knusprig braten, auf Haushaltpapier abtropfen lassen und auf dem Teig verteilen. Gruyère darüberstreuen.",
      "Eier, Rahm und Milch verquirlen, mit wenig Salz, Pfeffer und Muskat würzen und über den Speck giessen.",
      "Im unteren Teil des Ofens 30–35 Minuten backen, bis der Guss gestockt und goldbraun ist. 10 Minuten abkühlen lassen und lauwarm mit grünem Salat servieren."]
  },
  {
    id: "idee-zwiebelsuppe", title: "Französische Zwiebelsuppe", kitchen: "fr", emoji: "suppe", cat: "soup", tags: ["vegi", "cheap"], time: 80, serves: 4,
    note: "Langsam karamellisierte Zwiebeln geben der Pariser Soupe à l'oignon ihre Tiefe. Klassisch mit Rindsbouillon; mit Gemüsebouillon bleibt sie vegetarisch. Statt Wein mehr Bouillon und 1 TL Apfelessig.",
    ingr: ["1 kg Zwiebeln", "40 g Butter", "1 EL Olivenöl", "1 TL Zucker", "1 EL Mehl", "2 dl Weisswein", "1.2 l kräftige Gemüsebouillon", "2 Zweige Thymian", "8 Scheiben Baguette", "150 g Gruyère, gerieben", "Salz, Pfeffer"],
    steps: ["Zwiebeln halbieren und in feine Streifen schneiden. Butter und Olivenöl in einem grossen Topf erhitzen, Zwiebeln dazugeben und zugedeckt 10 Minuten dünsten.",
      "Deckel abnehmen, Zucker und etwas Salz dazugeben und die Zwiebeln bei mittlerer Hitze unter gelegentlichem Rühren 30–40 Minuten tief goldbraun karamellisieren.",
      "Mit Mehl bestäuben und kurz mitrösten. Mit Weisswein ablöschen, Bouillon und Thymian dazugeben und 15 Minuten köcheln. Mit Salz und Pfeffer abschmecken.",
      "Grill des Ofens auf höchster Stufe vorheizen. Baguettescheiben toasten. Suppe in ofenfeste Schalen füllen, je zwei Brotscheiben darauflegen und dick mit Gruyère bestreuen.",
      "Unter dem Grill 3–5 Minuten überbacken, bis der Käse blubbert und braun wird. Vorsicht, die Schalen sind sehr heiss."]
  },
  {
    id: "idee-salade-nicoise", title: "Salade niçoise", kitchen: "fr", emoji: "salat", cat: "salad", tags: [], time: 35, serves: 4,
    note: "Der Sommersalat aus Nizza ist eine ganze Mahlzeit. In Nizza selbst kommt er ohne Kartoffeln aus – bei uns machen sie ihn sättigender. Statt Thon aus der Dose passt auch kurz gebratener frischer Thunfisch.",
    ingr: ["400 g kleine festkochende Kartoffeln", "200 g grüne Bohnen", "4 Eier", "4 Tomaten", "1 Kopfsalat oder Lattich", "½ rote Zwiebel", "2 Dosen Thon in Olivenöl (à 150 g), abgetropft", "8 Sardellenfilets (nach Belieben)", "80 g schwarze Oliven", "5 EL Olivenöl", "2 EL Rotweinessig", "1 TL Dijon-Senf", "1 Knoblauchzehe", "Salz, Pfeffer"],
    steps: ["Kartoffeln in der Schale in Salzwasser 15–20 Minuten weich kochen. Bohnen rüsten und in den letzten 6 Minuten mitkochen. Abgiessen und die Bohnen kalt abschrecken.",
      "Eier in kochendem Wasser 8 Minuten kochen, kalt abschrecken, schälen und vierteln.",
      "Für die Sauce Knoblauch fein reiben und mit Senf, Rotweinessig, Salz und Pfeffer verrühren, dann das Olivenöl darunterschlagen.",
      "Kartoffeln halbieren, Tomaten in Schnitze und Zwiebel in feine Ringe schneiden. Salat waschen und auf einer Platte auslegen. Kartoffeln, Bohnen, Tomaten, Zwiebel, Thon, Eier, Sardellen und Oliven darauf anrichten und mit der Sauce beträufeln."]
  },
  {
    id: "idee-crepes", title: "Crêpes", kitchen: "fr", emoji: "pancake", cat: "sweet", tags: ["vegi", "kids", "cheap"], time: 50, serves: 4,
    note: "Hauchdünne Pfannkuchen aus der Bretagne, süss oder pikant. Für eine salzige Variante den Zucker weglassen und mit Schinken und Käse oder mit Spinat und Feta füllen.",
    ingr: ["250 g Mehl", "1 Prise Salz", "1 EL Zucker", "4 Eier", "5 dl Milch", "40 g Butter, geschmolzen, und etwas zum Backen", "Zucker, Zitrone, Konfitüre oder Schoggicreme zum Füllen"],
    steps: ["Mehl, Salz und Zucker in einer Schüssel mischen. Eier und die Hälfte der Milch dazugeben und glatt rühren, dann die restliche Milch und die flüssige Butter unterrühren.",
      "Teig zugedeckt mindestens 20 Minuten quellen lassen. Er sollte so flüssig wie Rahm sein; wenn nötig etwas Milch dazugeben.",
      "Eine beschichtete Bratpfanne mit wenig Butter auspinseln und gut erhitzen. Eine kleine Kelle Teig hineingeben und durch Schwenken dünn verteilen. 1–2 Minuten backen, bis der Rand goldbraun ist, wenden und noch 30 Sekunden backen.",
      "Crêpes auf einem Teller stapeln und warm halten. Mit Zucker und Zitronensaft, Konfitüre oder Schoggicreme füllen, falten und servieren."]
  },
  {
    id: "idee-tarte-tatin", title: "Tarte Tatin", kitchen: "fr", emoji: "apfel", cat: "sweet", tags: ["vegi", "guests"], time: 75, serves: 6,
    note: "Der gestürzte Apfelkuchen soll durch ein Missgeschick entstanden sein. Am einfachsten gelingt er in einer ofenfesten Bratpfanne von 26 cm; sonst den Karamell in eine runde Backform ohne Springring giessen.",
    ingr: ["1 Blätterteig, rund ausgewallt (ca. 32 cm)", "7 säuerliche Äpfel (ca. 1.2 kg, z. B. Boskoop)", "120 g Zucker", "60 g Butter", "Crème fraîche oder Vanilleglace zum Servieren"],
    steps: ["Ofen auf 200 °C vorheizen (Umluft 180 °C). Äpfel schälen, vierteln und das Kerngehäuse entfernen.",
      "Zucker in einer ofenfesten Bratpfanne (ca. 26 cm) bei mittlerer Hitze ohne Rühren schmelzen lassen, bis ein goldbrauner Karamell entsteht, etwa 5–8 Minuten. Butter in Stücken einrühren.",
      "Apfelviertel dicht und hochkant in den Karamell stellen und bei mittlerer Hitze 10 Minuten garen, bis sie Saft ziehen und leicht weich werden.",
      "Blätterteig auf die Äpfel legen, den Rand zwischen Äpfel und Pfannenrand nach unten stecken und den Teig ein paar Mal einstechen. Im Ofen 25–30 Minuten backen, bis er goldbraun ist.",
      "Kurz ruhen lassen, dann einen grossen Teller auf die Pfanne legen und die Tarte mit Ofenhandschuhen in einem Schwung stürzen. Lauwarm mit Crème fraîche oder Glace servieren."]
  },

  /* ---------- Spanien & Portugal ---------- */
  {
    id: "idee-paella", title: "Paella mit Poulet und Crevetten", kitchen: "es", emoji: "pfanne", cat: "main", tags: ["guests"], time: 60, serves: 4,
    note: "In Valencia kommt die Paella mit Poulet, Kaninchen und Bohnen auf den Tisch, an der Küste mit Meeresfrüchten. Nach dem Aufgiessen nicht mehr rühren, damit sich unten die knusprige Kruste (Socarrat) bildet.",
    ingr: ["300 g Paellareis (z. B. Bomba) oder Risottoreis", "400 g Pouletschenkel ohne Knochen, in Stücken", "200 g rohe Crevetten, geschält", "1 Zwiebel", "2 Knoblauchzehen", "1 rote Peperoni", "150 g grüne Bohnen oder Erbsen (tiefgekühlt)", "2 Tomaten", "1 TL Paprikapulver, edelsüss", "1 Briefchen Safranpulver (0.125 g)", "8 dl Geflügelbouillon, heiss", "4 EL Olivenöl", "1 Zitrone", "Salz, Pfeffer"],
    steps: ["Olivenöl in einer grossen Paella- oder Bratpfanne (ca. 34 cm) erhitzen. Crevetten 1–2 Minuten anbraten und herausnehmen. Poulet mit Salz und Pfeffer würzen und im selben Öl rundum 6–8 Minuten goldbraun anbraten.",
      "Zwiebel, Knoblauch und Peperoni klein schneiden und 5 Minuten mitbraten. Tomaten halbieren, an der Bircherraffel reiben (Haut wegwerfen), mit dem Paprikapulver dazugeben und 3 Minuten einkochen.",
      "Paellareis dazugeben und 1 Minute rühren. Safran in der heissen Bouillon auflösen, dazugiessen, salzen und die Bohnen verteilen. Ab jetzt nicht mehr rühren.",
      "Bei mittlerer Hitze 10 Minuten kräftig köcheln, dann bei kleiner Hitze weitere 8–10 Minuten garen, bis die Flüssigkeit aufgesogen ist. Crevetten gegen Ende in den Reis drücken.",
      "Zum Schluss 1–2 Minuten auf starker Hitze lassen, bis es leise knistert – so entsteht die Kruste. Vom Herd nehmen, mit einem Tuch bedeckt 5 Minuten ruhen lassen und mit Zitronenschnitzen servieren."]
  },
  {
    id: "idee-tortilla-espanola", title: "Tortilla española", kitchen: "es", emoji: "ei", cat: "main", tags: ["vegi", "cheap"], time: 50, serves: 4,
    note: "Das spanische Kartoffelomelett ist dick, saftig und schmeckt warm wie kalt – ideal als Tapa oder fürs Picknick. Das abgegossene Olivenöl lässt sich zum Braten wiederverwenden.",
    ingr: ["700 g festkochende Kartoffeln", "1 Zwiebel", "6 Eier", "2 dl Olivenöl", "Salz"],
    steps: ["Kartoffeln schälen, vierteln und in dünne Scheiben schneiden. Zwiebel in feine Streifen schneiden. Beides mit 1 TL Salz mischen.",
      "Olivenöl in einer beschichteten Bratpfanne (ca. 24 cm) erhitzen. Kartoffeln und Zwiebel darin bei mittlerer bis kleiner Hitze 15–20 Minuten weich garen, ohne dass sie Farbe nehmen; ab und zu wenden.",
      "Eier in einer grossen Schüssel verquirlen und salzen. Kartoffeln in einem Sieb abtropfen lassen (Öl auffangen), noch warm unter die Eier mischen und 10 Minuten ziehen lassen.",
      "2 EL vom aufgefangenen Öl in der Pfanne erhitzen, die Masse hineingeben und bei mittlerer Hitze 4–5 Minuten stocken lassen, bis die Unterseite goldbraun ist.",
      "Tortilla mithilfe eines grossen Tellers stürzen, zurück in die Pfanne gleiten lassen und weitere 3–4 Minuten braten. Innen darf sie leicht saftig bleiben. Warm oder kalt in Stücken servieren."]
  },
  {
    id: "idee-gazpacho", title: "Gazpacho", kitchen: "es", emoji: "suppe", cat: "soup", tags: ["vegi", "vegan", "quick"], time: 20, serves: 4,
    note: "Kalte Tomatensuppe aus Andalusien für heisse Tage. Sie lebt von wirklich reifen Tomaten; ausserhalb der Saison Rispentomaten nehmen und eine Prise Zucker dazugeben. Gut gekühlt servieren.",
    ingr: ["1 kg reife Tomaten", "½ Gurke", "1 rote Peperoni", "½ rote Zwiebel", "1 Knoblauchzehe", "1 Scheibe Weissbrot vom Vortag (ca. 50 g)", "6 EL Olivenöl", "2 EL Sherryessig oder Rotweinessig", "Salz, Pfeffer"],
    steps: ["Tomaten grob schneiden, Gurke schälen und würfeln, Peperoni entkernen und würfeln. Je 2 EL Gurken- und Peperoniwürfel zum Garnieren beiseitestellen.",
      "Zwiebel und Knoblauch grob hacken. Weissbrot entrinden, kurz in Wasser einweichen und gut ausdrücken.",
      "Alles mit Olivenöl, Essig, Salz und Pfeffer im Mixer sehr fein pürieren und nach Belieben durch ein Sieb streichen.",
      "Mindestens 2 Stunden kalt stellen. Nochmals abschmecken und mit den Gemüsewürfeln und einem Faden Olivenöl servieren."]
  },
  {
    id: "idee-patatas-bravas", title: "Patatas bravas", kitchen: "es", emoji: "kartoffel", cat: "snack", tags: ["vegi", "vegan"], time: 50, serves: 4,
    note: "Knusprige Kartoffelwürfel mit scharfer Paprikasauce – ein Klassiker jeder Tapas-Bar. Wer nicht vegan isst, stellt zusätzlich Aioli (Knoblauchmayonnaise) dazu.",
    ingr: ["1 kg festkochende Kartoffeln", "6 EL Olivenöl", "1 kleine Zwiebel", "2 Knoblauchzehen", "1 EL Mehl", "2 TL Paprikapulver, geräuchert", "½ TL Cayennepfeffer oder Chilipulver", "2 dl Passata", "1 dl Gemüsebouillon", "1 TL Sherryessig oder Rotweinessig", "Salz"],
    steps: ["Ofen auf 220 °C vorheizen (Umluft 200 °C). Kartoffeln schälen oder gut waschen und in 2–3 cm grosse Würfel schneiden. In Salzwasser 5 Minuten vorkochen und gut abtropfen lassen.",
      "Kartoffeln mit 4 EL Olivenöl und Salz mischen, auf einem Blech verteilen und 30–35 Minuten knusprig backen; nach der Hälfte der Zeit wenden.",
      "Für die Sauce Zwiebel und Knoblauch fein hacken und im restlichen Olivenöl 5 Minuten weich dünsten. Mehl, Paprikapulver und Cayennepfeffer kurz mitrösten.",
      "Passata, Bouillon und Essig unterrühren und 10 Minuten zu einer dicken Sauce köcheln. Mit Salz abschmecken und nach Belieben fein pürieren. Über die heissen Kartoffeln geben und sofort servieren."]
  },
  {
    id: "idee-caldo-verde", title: "Caldo verde", kitchen: "es", emoji: "suppe", cat: "soup", tags: ["cheap"], time: 40, serves: 4,
    note: "Portugals beliebteste Suppe: sämige Kartoffelsuppe mit hauchfein geschnittenem Kohl und Chorizo. Federkohl gibt es im Winter, sonst Wirz nehmen. Ohne Wurst und mit geräuchertem Paprika wird sie vegan.",
    ingr: ["800 g mehligkochende Kartoffeln", "1 Zwiebel", "2 Knoblauchzehen", "1.2 l Gemüsebouillon", "300 g Federkohl oder Wirz", "150 g Chorizo", "4 EL Olivenöl", "Salz, Pfeffer"],
    steps: ["Kartoffeln schälen und würfeln, Zwiebel und Knoblauch hacken. Alles in 2 EL Olivenöl 3 Minuten andünsten, mit Bouillon auffüllen und 20 Minuten weich köcheln.",
      "Inzwischen beim Federkohl die dicken Stiele entfernen, die Blätter aufrollen und in hauchdünne Streifen schneiden. Chorizo in dünne Scheiben schneiden und in einer Bratpfanne ohne Fett 3–4 Minuten knusprig braten.",
      "Suppe fein pürieren und mit Salz und Pfeffer abschmecken. Kohlstreifen dazugeben und offen 5 Minuten köcheln, bis sie weich, aber noch leuchtend grün sind.",
      "Suppe in Teller schöpfen, Chorizo darauf verteilen und mit dem restlichen Olivenöl beträufeln."]
  },

  /* ---------- Griechisch ---------- */
  {
    id: "idee-moussaka", title: "Moussaka", kitchen: "gr", emoji: "teller", cat: "main", tags: ["guests", "prep"], time: 120, serves: 4,
    note: "Griechischer Auflauf mit Auberginen, Zimt-Hackfleischsauce und dicker Béchamel; lässt sich gut am Vortag vorbereiten. Vegi-Variante: Hackfleisch durch 250 g gekochte braune Linsen ersetzen.",
    ingr: ["3 Auberginen (ca. 1 kg)", "500 g festkochende Kartoffeln", "500 g Hackfleisch (Lamm oder Rind)", "1 Zwiebel", "2 Knoblauchzehen", "2 EL Tomatenpüree", "1 Dose gehackte Tomaten (400 g)", "1 dl Rotwein oder Bouillon", "1 TL Zimt", "6 EL Olivenöl", "50 g Butter", "50 g Mehl", "6 dl Milch", "2 Eigelb", "80 g Parmesan, gerieben", "Salz, Pfeffer, Muskat, Oregano"],
    steps: ["Ofen auf 220 °C vorheizen (Umluft 200 °C). Auberginen längs in 1 cm dicke Scheiben, Kartoffeln in 5 mm dünne Scheiben schneiden. Auf zwei Bleche legen, mit Olivenöl bepinseln, salzen und 20–25 Minuten backen, bis alles weich und leicht gebräunt ist.",
      "Zwiebel und Knoblauch hacken. Hackfleisch in 2 EL Olivenöl krümelig anbraten, Zwiebel und Knoblauch 3 Minuten mitdünsten. Tomatenpüree und Zimt kurz mitrösten, mit Rotwein ablöschen. Tomaten dazugeben, mit Salz, Pfeffer und Oregano würzen und 20 Minuten köcheln.",
      "Für die Béchamel Butter schmelzen, Mehl einrühren und 1 Minute anschwitzen. Milch unter ständigem Rühren nach und nach dazugiessen und 5 Minuten köcheln, bis die Sauce dick ist. Vom Herd nehmen, Eigelb und die Hälfte des Parmesans unterrühren, mit Salz und Muskat würzen.",
      "Ofen auf 180 °C zurückschalten (Umluft 160 °C). In einer Gratinform (ca. 20 × 30 cm) Kartoffeln, die Hälfte der Auberginen, die Fleischsauce und die restlichen Auberginen schichten. Béchamel darüberstreichen und mit dem übrigen Parmesan bestreuen.",
      "Etwa 45 Minuten backen, bis die Oberfläche goldbraun ist. Vor dem Anschneiden mindestens 15 Minuten ruhen lassen."]
  },
  {
    id: "idee-souvlaki-tzatziki", title: "Souvlaki mit Tzatziki", kitchen: "gr", emoji: "fleisch", cat: "main", tags: ["guests"], time: 60, serves: 4,
    note: "Grillspiesschen, wie es sie in Griechenland an jeder Ecke gibt. Das Fleisch kann schon am Vorabend mariniert werden. Für Vegis Halloumi und Zucchetti statt Fleisch aufspiessen.",
    ingr: ["600 g Schweinshals oder Pouletschenkel ohne Knochen", "5 EL Olivenöl", "1 Zitrone", "3 Knoblauchzehen", "2 TL Oregano, getrocknet", "½ Gurke", "350 g griechischer Joghurt", "½ Bund Dill oder Minze", "4 Pitabrote", "2 Tomaten", "1 rote Zwiebel", "Salz, Pfeffer"],
    steps: ["Fleisch (Schweinshals oder Poulet) in 3 cm grosse Würfel schneiden. 2 Knoblauchzehen pressen und mit 4 EL Olivenöl, dem Saft einer halben Zitrone, Oregano, Salz und Pfeffer mischen. Fleisch darin mindestens 30 Minuten marinieren.",
      "Für das Tzatziki die Gurke raffeln, mit wenig Salz mischen, 10 Minuten ziehen lassen und gut ausdrücken. Mit Joghurt, der restlichen gepressten Knoblauchzehe, 1 EL Olivenöl und gehacktem Dill verrühren und kühl stellen.",
      "Fleisch auf Spiesse stecken und auf dem Grill oder in einer Grillpfanne bei starker Hitze rundum 8–10 Minuten braten, bis es durch und leicht gebräunt ist.",
      "Pitabrote kurz auf dem Grill oder im Toaster erwärmen. Tomaten in Schnitze, Zwiebel in Ringe schneiden. Souvlaki mit Pita, Tzatziki, Gemüse und Zitronenschnitzen servieren."]
  },
  {
    id: "idee-spanakopita", title: "Spanakopita", kitchen: "gr", emoji: "waehe", cat: "main", tags: ["vegi"], time: 85, serves: 4,
    note: "Griechischer Spinatkuchen mit Feta im knusprigen Filoteig. Filoteig liegt im Kühlregal oder tiefgekühlt bei den Teigen; während der Arbeit mit einem feuchten Tuch bedecken, damit er nicht austrocknet.",
    ingr: ["750 g Blattspinat (tiefgekühlt), aufgetaut", "1 Bund Frühlingszwiebeln", "1 Bund Dill", "½ Bund Petersilie", "200 g Feta", "250 g Ricotta", "2 Eier", "1 Packung Filoteig (ca. 250 g)", "6 EL Olivenöl oder 80 g flüssige Butter", "Pfeffer, Muskat"],
    steps: ["Spinat gut ausdrücken und grob hacken. Frühlingszwiebeln in Ringe schneiden und in 1 EL Olivenöl 3 Minuten andünsten. Spinat dazugeben und 3 Minuten mitdünsten, bis die Flüssigkeit verdampft ist. Etwas abkühlen lassen.",
      "Ofen auf 180 °C vorheizen (Umluft 160 °C). Feta zerbröckeln, Dill und Petersilie hacken. Mit Ricotta, Spinat und Eier gut mischen und mit Pfeffer und Muskat würzen; Feta ist salzig genug.",
      "Eine Form von etwa 20 × 30 cm einfetten. Die Hälfte der Filoteigblätter einzeln hineinlegen, jedes mit Öl oder Butter bepinseln und die Ränder hochstehen lassen.",
      "Füllung darauf verteilen. Die restlichen Blätter ebenso bestreichen und darauflegen, überstehende Ränder einschlagen. Die Oberfläche mit einem scharfen Messer in Portionen vorschneiden.",
      "Im unteren Teil des Ofens etwa 45 Minuten goldbraun backen und vor dem Schneiden 10 Minuten ruhen lassen. Schmeckt warm und kalt."]
  },
  {
    id: "idee-gemista", title: "Gemista (gefüllte Tomaten und Peperoni)", kitchen: "gr", emoji: "peperoni", cat: "main", tags: ["vegi", "vegan", "prep"], time: 105, serves: 4,
    note: "Im Sommer stehen diese mit Kräuterreis gefüllten Tomaten und Peperoni in jeder griechischen Taverne; lauwarm schmecken sie am besten. Mit 100 g zerbröckeltem Feta in der Füllung sind sie vegi, aber nicht mehr vegan.",
    ingr: ["4 grosse Tomaten (je ca. 250 g)", "4 Peperoni (rot, gelb oder grün)", "150 g Risottoreis", "1 Zwiebel", "2 Knoblauchzehen", "1 Zucchetti", "1 Bund Petersilie", "½ Bund Minze", "2 EL Tomatenpüree", "1 dl Olivenöl", "600 g festkochende Kartoffeln", "Salz, Pfeffer, Zucker"],
    steps: ["Ofen auf 190 °C vorheizen (Umluft 170 °C). Von Tomaten und Peperoni einen Deckel abschneiden. Tomaten mit einem Löffel aushöhlen und das Innere fein hacken, Peperoni entkernen. Hohlräume leicht salzen.",
      "Zwiebel, Knoblauch und Zucchetti fein würfeln und in 3 EL Olivenöl 5 Minuten andünsten. Risottoreis, Tomatenpüree und das gehackte Tomateninnere dazugeben und 5 Minuten köcheln. Petersilie und Minze hacken und unterrühren, mit Salz, Pfeffer und einer Prise Zucker würzen.",
      "Gemüse in eine grosse Gratinform stellen und zu drei Vierteln mit der Reismasse füllen, denn der Reis quillt noch. Deckel aufsetzen. Kartoffeln schälen, in Schnitze schneiden, in die Lücken legen und salzen.",
      "Restliches Olivenöl und 2 dl Wasser darübergiessen. Mit Alufolie bedeckt 30 Minuten backen, dann ohne Folie weitere 40 Minuten, bis Reis und Kartoffeln weich und die Ränder leicht gebräunt sind."]
  },

  /* ---------- Deutschland & Österreich ---------- */
  {
    id: "idee-wiener-schnitzel", title: "Wiener Schnitzel mit Kartoffelsalat", kitchen: "de", emoji: "fleisch", cat: "main", tags: ["guests"], time: 60, serves: 4,
    note: "Das echte Wiener Schnitzel ist aus Kalbfleisch; aus Schweinefleisch heisst es «Schnitzel Wiener Art». Der Trick: reichlich Fett und die Pfanne schwenken, damit die Panade Wellen wirft.",
    ingr: ["4 Kalbsplätzli (je ca. 150 g), dünn geklopft", "50 g Mehl", "2 Eier", "100 g Paniermehl", "200 g Bratbutter", "1 Zitrone", "800 g festkochende Kartoffeln", "1 Zwiebel", "2 dl heisse Bouillon", "3 EL Weissweinessig", "1 TL Senf", "4 EL Rapsöl", "½ Bund Schnittlauch", "Salz, Pfeffer"],
    steps: ["Kartoffeln in der Schale in Salzwasser 20–25 Minuten weich kochen, schälen und noch warm in dünne Scheiben schneiden.",
      "Zwiebel fein hacken und mit der Bouillon, Essig, Senf, Salz und Pfeffer aufkochen. Über die warmen Kartoffeln giessen, Rapsöl dazugeben, vorsichtig mischen und mindestens 20 Minuten ziehen lassen. Vor dem Servieren Schnittlauch darüberschneiden.",
      "Plätzli leicht salzen und pfeffern. Mehl, verquirlte Eier und Paniermehl in drei tiefe Teller geben. Plätzli zuerst im Mehl, dann im Ei und zuletzt im Paniermehl wenden; die Panade nur leicht andrücken.",
      "Bratbutter in einer grossen Bratpfanne gut 1 cm hoch erhitzen. Schnitzel darin schwimmend auf jeder Seite 2–3 Minuten goldbraun backen und die Pfanne dabei leicht schwenken, damit das Fett über die Panade schwappt.",
      "Kurz auf Haushaltpapier abtropfen lassen und sofort mit Zitronenschnitzen und dem Kartoffelsalat servieren."]
  },
  {
    id: "idee-kaiserschmarrn", title: "Kaiserschmarrn", kitchen: "de", emoji: "pancake", cat: "sweet", tags: ["vegi", "quick", "kids"], time: 30, serves: 4,
    note: "Der zerrissene Pfannkuchen aus Österreich ist süsse Hauptmahlzeit oder Dessert. Statt Sultaninen passen Apfelwürfel; dazu Apfelmus oder Zwetschgenkompott.",
    ingr: ["4 Eier", "3 dl Milch", "150 g Mehl", "3 EL Zucker", "1 EL Vanillezucker", "1 Prise Salz", "50 g Sultaninen (nach Belieben)", "40 g Butter", "Puderzucker zum Bestäuben", "Apfelmus zum Servieren"],
    steps: ["Eier trennen. Eigelb mit Milch, Mehl, 2 EL Zucker, Vanillezucker und Salz glatt rühren. Eiweiss steif schlagen und locker unterziehen.",
      "Die Hälfte der Butter in einer grossen beschichteten Bratpfanne erhitzen. Teig hineingiessen, Sultaninen darüberstreuen und bei mittlerer Hitze 4–5 Minuten backen, bis die Unterseite goldbraun ist.",
      "Teig in Viertel teilen, wenden und weitere 3 Minuten backen. Dann mit zwei Bratschaufeln in mundgerechte Stücke zerreissen.",
      "Restliche Butter und 1 EL Zucker dazugeben und die Stücke unter Schwenken 2 Minuten karamellisieren. Mit Puderzucker bestäuben und mit Apfelmus servieren."]
  },
  {
    id: "idee-kaesespaetzle", title: "Käsespätzle", kitchen: "de", emoji: "kaese", cat: "main", tags: ["vegi", "kids"], time: 50, serves: 4,
    note: "Allgäuer und Vorarlberger Spezialität, die auch bei uns zu Hause ist. Wer wenig Zeit hat, nimmt 800 g fertige Spätzli aus dem Kühlregal. Dazu passt grüner Salat.",
    ingr: ["400 g Mehl (Spätzlimehl oder Weissmehl)", "4 Eier", "1.5 dl Wasser", "1 TL Salz", "3 Zwiebeln", "40 g Butter", "250 g würziger Käse, gerieben (z. B. Appenzeller, Bergkäse oder Emmentaler)", "Pfeffer, Muskat", "½ Bund Schnittlauch"],
    steps: ["Mehl, Eier, Wasser und Salz zu einem zähflüssigen Teig verrühren und mit einer Kelle schlagen, bis er Blasen wirft. 10 Minuten ruhen lassen.",
      "Zwiebeln in feine Ringe schneiden und in der Butter bei mittlerer Hitze 15–20 Minuten goldbraun braten. Ofen auf 180 °C vorheizen (Umluft 160 °C).",
      "Teig portionenweise durch ein Spätzlisieb in siedendes Salzwasser drücken. Sobald die Spätzli an die Oberfläche steigen, nach 1–2 Minuten, mit der Schaumkelle herausheben und abtropfen lassen.",
      "Spätzli und Käse lagenweise in eine vorgewärmte Gratinform schichten und mit Pfeffer und Muskat würzen. Im Ofen 10 Minuten schmelzen lassen.",
      "Mit den gebratenen Zwiebeln belegen und mit Schnittlauch bestreut servieren."]
  },
  {
    id: "idee-rindsrouladen", title: "Rindsrouladen", kitchen: "de", emoji: "fleisch", cat: "main", tags: ["guests", "prep"], time: 140, serves: 4,
    note: "Deutscher Sonntagsklassiker: dünne Rindsplätzli mit Senf, Speck, Zwiebel und Gurke, langsam geschmort. Dazu Kartoffelstock oder Spätzli und Rotkraut. Statt Rotwein ganz mit Bouillon schmoren.",
    ingr: ["4 Rindsplätzli für Rouladen (je ca. 180 g)", "2 EL scharfer Senf", "8 Scheiben Bratspeck", "2 Essiggurken", "2 Zwiebeln", "1 Rüebli", "1 Stück Knollensellerie (ca. 100 g)", "1 EL Tomatenpüree", "2 dl Rotwein", "4 dl Rindsbouillon", "2 EL Bratbutter", "1 TL Maizena", "Salz, Pfeffer"],
    steps: ["Plätzli flach auslegen, mit Pfeffer würzen und dünn mit Senf bestreichen. Je zwei Scheiben Speck darauflegen. 1 Zwiebel in feine Streifen und die Gurken längs in Viertel schneiden und auf den Plätzli verteilen.",
      "Plätzli von der schmalen Seite her straff aufrollen, die Seiten dabei einschlagen, und mit Küchenschnur oder Rouladennadeln fixieren. Aussen leicht mit Salz würzen.",
      "Bratbutter in einem Schmortopf erhitzen und die Rouladen rundum 6–8 Minuten kräftig anbraten, herausnehmen. Restliche Zwiebel, Rüebli und Sellerie würfeln und im Bratfett 5 Minuten rösten. Tomatenpüree kurz mitrösten.",
      "Mit Rotwein ablöschen und etwas einkochen lassen, Bouillon dazugiessen. Rouladen hineinlegen und zugedeckt bei kleiner Hitze 1½ Stunden schmoren, dabei einmal wenden.",
      "Rouladen herausnehmen und die Schnur entfernen. Sauce durch ein Sieb streichen und aufkochen. Maizena mit wenig kaltem Wasser anrühren, die Sauce damit binden, abschmecken und über die Rouladen giessen."]
  },
  {
    id: "idee-apfelstrudel", title: "Apfelstrudel", kitchen: "de", emoji: "apfel", cat: "sweet", tags: ["vegi", "guests"], time: 70, serves: 6,
    note: "Wiener Kaffeehausklassiker. Den hauchdünnen Teig selbst auszuziehen braucht Übung; fertiger Strudelteig aus dem Kühlregal gelingt sicher. Wer mag, legt die Sultaninen vorher in Rum oder Apfelsaft ein.",
    ingr: ["1 Strudelteig, rechteckig ausgewallt (ca. 120 g)", "1 kg säuerliche Äpfel (z. B. Boskoop)", "1 Zitrone", "60 g Zucker", "1 TL Zimt", "50 g Sultaninen", "50 g Haselnüsse, gemahlen", "40 g Paniermehl", "60 g Butter", "Puderzucker zum Bestäuben", "Vanillesauce oder Rahm zum Servieren"],
    steps: ["Ofen auf 200 °C vorheizen (Umluft 180 °C). 20 g Butter in einer Bratpfanne schmelzen und das Paniermehl darin 2–3 Minuten goldbraun rösten. Restliche Butter schmelzen.",
      "Äpfel schälen, vierteln, entkernen und in dünne Scheiben schneiden. Sofort mit dem Saft der Zitrone, Zucker, Zimt, Sultaninen und Haselnüssen mischen.",
      "Strudelteig auf einem bemehlten Küchentuch auslegen und mit etwas flüssiger Butter bestreichen. Die Brösel auf dem unteren Drittel verteilen, die Apfelfüllung darauf geben und die Seitenränder einschlagen.",
      "Strudel mithilfe des Tuchs aufrollen und mit der Naht nach unten auf ein mit Backpapier belegtes Blech gleiten lassen. Mit der restlichen Butter bestreichen.",
      "In der Ofenmitte 35–40 Minuten goldbraun backen. Etwas abkühlen lassen, mit Puderzucker bestäuben und lauwarm mit Vanillesauce oder geschlagenem Rahm servieren."]
  },
  {
    id: "idee-linsen-spaetzli", title: "Linsen mit Spätzli und Wienerli", kitchen: "de", emoji: "eintopf", cat: "main", tags: ["cheap"], time: 60, serves: 4,
    note: "Schwäbisches Leibgericht: sämige Linsen mit einem Schuss Essig, dazu Spätzli und Würstchen. Vegi-Variante: Speck und Wienerli weglassen und die Linsen mit etwas geräuchertem Paprika würzen.",
    ingr: ["250 g Tellerlinsen oder braune Linsen", "100 g Speckwürfeli", "1 Zwiebel", "1 Rüebli", "1 Stück Knollensellerie (ca. 80 g)", "1 Lorbeerblatt", "8 dl Gemüsebouillon", "2 EL Butter", "1 EL Mehl", "3 EL Rotweinessig", "4 Wienerli", "500 g Spätzli (Kühlregal)", "Salz, Pfeffer"],
    steps: ["Zwiebel, Rüebli und Sellerie fein würfeln. Speckwürfeli in einem Topf auslassen, das Gemüse dazugeben und 5 Minuten andünsten.",
      "Linsen abspülen, mit Lorbeerblatt und Bouillon dazugeben und zugedeckt 30–35 Minuten weich köcheln.",
      "1 EL Butter in einer kleinen Pfanne schmelzen, Mehl darin hellbraun rösten und unter die Linsen rühren. 5 Minuten köcheln, bis sie sämig sind, mit Essig, Salz und Pfeffer abschmecken.",
      "Wienerli in den Linsen 5 Minuten heiss werden lassen, nicht kochen. Spätzli in der restlichen Butter in einer Bratpfanne 6–8 Minuten goldgelb braten.",
      "Linsen mit Spätzli und Wienerli anrichten. Wer mag, gibt am Tisch noch einen Spritzer Essig dazu."]
  },

  /* ---------- Schweiz ---------- */
  {
    id: "idee-capuns", title: "Capuns", kitchen: "ch", emoji: "gemuese", cat: "main", tags: ["guests"], time: 90, serves: 4,
    note: "Bündner Spezialität: Spätzliteig mit Bündnerfleisch und Kräutern, in Krautstielblätter gewickelt und in Milchbouillon gegart. Krautstiel heisst anderswo Mangold; im Winter gehen auch Wirzblätter.",
    ingr: ["300 g Mehl", "3 Eier", "3 dl Milch", "½ dl Wasser", "100 g Bündnerfleisch oder Salsiz, fein gewürfelt", "2 EL Kräuter, gehackt (Petersilie, Schnittlauch, Minze)", "20 grosse Krautstielblätter", "2 dl Bouillon", "1 dl Rahm", "50 g Bergkäse, gerieben", "30 g Butter", "Salz, Pfeffer"],
    steps: ["Mehl, Eier, 1 dl Milch, Wasser und 1 TL Salz zu einem zähen Spätzliteig rühren und schlagen, bis er Blasen wirft. Bündnerfleisch und Kräuter unterrühren, mit Pfeffer würzen und 15 Minuten ruhen lassen.",
      "Krautstielblätter waschen und die dicke Mittelrippe flach schneiden. Blätter 30 Sekunden in Salzwasser blanchieren, kalt abschrecken und auf einem Tuch auslegen.",
      "Ofen auf 200 °C vorheizen (Umluft 180 °C). Auf jedes Blatt einen gehäuften Esslöffel Teig geben, die Seiten einschlagen und satt aufrollen.",
      "Capuns nebeneinander in eine gebutterte Gratinform legen. Restliche Milch, Bouillon und Rahm mischen und darübergiessen, sodass die Capuns zu zwei Dritteln bedeckt sind. Butterflocken darauf verteilen und mit Alufolie bedeckt 25 Minuten im Ofen garen.",
      "Folie entfernen, Bergkäse darüberstreuen und weitere 10 Minuten überbacken, bis der Käse goldbraun ist."]
  },
  {
    id: "idee-buendner-gerstensuppe", title: "Bündner Gerstensuppe", kitchen: "ch", emoji: "suppe", cat: "soup", tags: ["cheap", "prep"], time: 90, serves: 4,
    note: "Wärmende Bergsuppe aus Graubünden, die am nächsten Tag noch besser schmeckt. Über Nacht eingeweichte Gerste wird schneller weich. Vegi-Variante: ohne Fleisch, dafür mit einer Prise geräuchertem Paprika.",
    ingr: ["100 g Rollgerste", "1 Zwiebel", "1 Stange Lauch", "2 Rüebli", "1 Stück Knollensellerie (ca. 100 g)", "2 Kartoffeln", "100 g Speckwürfeli", "60 g Bündnerfleisch, in Streifen", "20 g Butter", "1.5 l Gemüsebouillon", "1 Lorbeerblatt", "1 dl Rahm", "½ Bund Schnittlauch", "Salz, Pfeffer"],
    steps: ["Zwiebel hacken. Lauch, Rüebli, Sellerie und Kartoffeln in kleine Würfel schneiden. Gerste in einem Sieb kalt abspülen.",
      "Speckwürfeli in der Butter 3 Minuten anbraten. Zwiebel, Lauch, Rüebli und Sellerie dazugeben und 5 Minuten andünsten.",
      "Gerste dazugeben, mit Bouillon auffüllen, das Lorbeerblatt dazulegen und zugedeckt 45 Minuten köcheln.",
      "Kartoffeln und Bündnerfleisch dazugeben und weitere 20 Minuten köcheln, bis Gerste und Kartoffeln weich sind. Wird die Suppe zu dick, etwas Wasser nachgiessen.",
      "Lorbeerblatt entfernen, Rahm unterrühren und mit Salz und Pfeffer abschmecken. Mit Schnittlauch bestreut servieren."]
  },
  {
    id: "idee-riz-casimir", title: "Riz Casimir", kitchen: "ch", emoji: "curry", cat: "main", tags: ["kids"], time: 35, serves: 4,
    note: "Schweizer Kultgericht aus den 1950er-Jahren: mildes Curry-Geschnetzeltes mit Früchten auf Reis. Kinder lieben die Ananas; wer es exotischer mag, nimmt Kokosmilch statt Rahm.",
    ingr: ["250 g Langkornreis", "500 g Pouletbrust oder Kalbfleisch, geschnetzelt", "1 Zwiebel", "1 EL Currypulver, mild", "1 EL Mehl", "1 dl Geflügelbouillon", "2 dl Rahm", "1 Apfel", "1 Banane", "1 kleine Dose Ananas (ca. 230 g), abgetropft", "2 EL Bratbutter", "4 Cocktailkirschen (nach Belieben)", "Salz, Pfeffer"],
    steps: ["Langkornreis in Salzwasser 12–15 Minuten kochen, abgiessen und warm halten.",
      "Fleisch portionenweise in der Bratbutter 2–3 Minuten kräftig anbraten, mit Salz und Pfeffer würzen und herausnehmen.",
      "Zwiebel fein hacken und im Bratfett 3 Minuten andünsten. Currypulver und Mehl darüberstäuben und kurz mitrösten. Mit Bouillon und Rahm ablöschen und 5 Minuten sämig köcheln.",
      "Apfel schälen und würfeln, Banane in Scheiben und Ananas in Stücke schneiden. Früchte in die Sauce geben und 2 Minuten erwärmen, dann das Fleisch dazugeben und nur noch heiss werden lassen. Abschmecken.",
      "Reis als Ring anrichten, das Curry in die Mitte geben und mit Cocktailkirschen garnieren."]
  },
  {
    id: "idee-cordon-bleu", title: "Cordon bleu", kitchen: "ch", emoji: "kaese", cat: "main", tags: ["kids", "guests"], time: 40, serves: 4,
    note: "Der Schweizer Beizenklassiker: paniertes Schnitzel mit Schinken und geschmolzenem Käse. Die Plätzli am besten beim Metzger gleich «für Cordon bleu» schneiden lassen. Dazu Pommes frites oder Kartoffelsalat.",
    ingr: ["4 grosse Schweinsplätzli (je ca. 160 g)", "4 Scheiben Schinken", "4 Scheiben Gruyère oder Raclettekäse", "50 g Mehl", "2 Eier", "100 g Paniermehl", "4 EL Bratbutter", "1 Zitrone", "Salz, Pfeffer"],
    steps: ["Plätzli zwischen Klarsichtfolie sehr dünn klopfen. Auf eine Hälfte je eine Scheibe Schinken und Gruyère legen und rundum 1 cm Rand frei lassen. Die andere Hälfte darüberklappen und die Ränder gut andrücken.",
      "Aussen leicht mit Salz und Pfeffer würzen. Eier in einem tiefen Teller verquirlen. Plätzli nacheinander in Mehl, Ei und Paniermehl wenden und die Panade gut andrücken.",
      "Bratbutter in einer grossen Bratpfanne erhitzen. Die Cordons bleus bei mittlerer Hitze auf jeder Seite 5–6 Minuten goldbraun braten, damit der Käse innen schmilzt und das Fleisch durchgart.",
      "Kurz auf Haushaltpapier abtropfen lassen und mit Zitronenschnitzen servieren."]
  },
  {
    id: "idee-apfelwaehe", title: "Apfelwähe", kitchen: "ch", emoji: "waehe", cat: "sweet", tags: ["vegi", "kids"], time: 60, serves: 4,
    note: "Früher gab es in vielen Familien am Freitag eine Wähe zum Znacht. Statt Äpfeln passen Zwetschgen, Aprikosen oder Rhabarber; bei saftigen Früchten den Boden etwas dicker mit Nüssen bestreuen.",
    ingr: ["1 Kuchenteig, rund ausgewallt (ca. 32 cm)", "2 EL gemahlene Haselnüsse", "5 säuerliche Äpfel (ca. 700 g)", "2 Eier", "2 dl Halbrahm", "1 dl Milch", "3 EL Zucker", "1 EL Vanillezucker", "1 TL Maizena", "Zimt zum Bestreuen"],
    steps: ["Ofen auf 220 °C Unter- und Oberhitze vorheizen. Kuchenteig samt Backpapier ins Wähenblech legen, den Boden mit einer Gabel einstechen und mit den Haselnüssen bestreuen.",
      "Äpfel schälen, vierteln, entkernen und in Schnitze schneiden. Dicht und ziegelartig auf dem Teig verteilen.",
      "Im unteren Teil des Ofens 10 Minuten vorbacken. Inzwischen Eier, Halbrahm, Milch, Zucker, Vanillezucker und Maizena verquirlen.",
      "Guss über die Äpfel giessen und weitere 25–30 Minuten backen, bis er gestockt und leicht gebräunt ist. Mit Zimt bestreuen und lauwarm servieren."]
  },
  {
    id: "idee-rueeblitorte", title: "Rüeblitorte", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi", "guests"], time: 85, serves: 8,
    note: "Die Aargauer Rüeblitorte ist dank Mandeln herrlich saftig und hält sich gut verpackt mehrere Tage. Wer mag, gibt 2 EL Kirsch in den Teig. Marzipanrüebli gibt es im Backregal.",
    ingr: ["300 g Rüebli, fein gerieben", "5 Eier", "250 g Zucker", "1 Bio-Zitrone", "250 g gemahlene Mandeln", "80 g Mehl", "1 TL Backpulver", "1 Prise Salz", "½ TL Zimt", "200 g Puderzucker", "8 Marzipanrüebli", "Butter und Mehl für die Form"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Eine Springform (24–26 cm) mit Butter einfetten und mit Mehl bestäuben. Zitronenschale abreiben und den Saft auspressen.",
      "Eier trennen. Eigelb mit dem Zucker und der Zitronenschale etwa 5 Minuten schaumig rühren, bis die Masse hell ist. 2 EL Zitronensaft, Rüebli, Mandeln, Mehl, Backpulver und Zimt daruntermischen.",
      "Eiweiss mit dem Salz steif schlagen und locker unter die Masse ziehen. In die Form füllen und glatt streichen.",
      "In der unteren Ofenhälfte 50–55 Minuten backen und die Stäbchenprobe machen. In der Form 10 Minuten abkühlen lassen, dann herauslösen und ganz auskühlen lassen.",
      "Puderzucker mit 2–3 EL Zitronensaft zu einer dickflüssigen Glasur verrühren, über die Torte streichen und mit Marzipanrüebli verzieren."]
  },

  /* ---------- Osteuropa ---------- */
  {
    id: "idee-borschtsch", title: "Borschtsch", kitchen: "east", emoji: "suppe", cat: "soup", tags: ["vegi", "cheap", "prep"], time: 70, serves: 4,
    note: "Die tiefrote Randensuppe ist in der Ukraine und in ganz Osteuropa zu Hause. Diese Fassung ist vegetarisch; klassisch kocht man sie mit Rindfleisch. Randen färben stark – beim Schälen Handschuhe tragen.",
    ingr: ["500 g Randen, roh", "1 Zwiebel", "2 Rüebli", "300 g Weisskabis", "2 Kartoffeln", "2 Knoblauchzehen", "2 EL Tomatenpüree", "1 Dose weisse Bohnen (400 g)", "1.5 l Gemüsebouillon", "2 EL Rotweinessig oder Zitronensaft", "1 TL Zucker", "2 Lorbeerblätter", "3 EL Rapsöl", "1 Bund Dill", "180 g Sauerrahm", "Salz, Pfeffer"],
    steps: ["Randen schälen und grob raffeln oder in feine Stifte schneiden. Zwiebel hacken, Rüebli raffeln, Kabis in feine Streifen und Kartoffeln in Würfel schneiden.",
      "Zwiebel und Rüebli im Rapsöl 5 Minuten andünsten. Randen, Tomatenpüree, 1 EL Essig und den Zucker dazugeben und 10 Minuten dünsten; die Säure erhält die rote Farbe.",
      "Mit Bouillon auffüllen, Lorbeerblätter, Kartoffeln und Kabis dazugeben und zugedeckt 25 Minuten köcheln.",
      "Abgespülte Bohnen und gepressten Knoblauch dazugeben und 5 Minuten weiterköcheln. Mit Salz, Pfeffer und dem restlichen Essig süss-sauer abschmecken.",
      "Mit einem Löffel Sauerrahm und reichlich gehacktem Dill servieren. Am nächsten Tag schmeckt der Borschtsch noch besser."]
  },
  {
    id: "idee-pierogi", title: "Pierogi mit Kartoffeln und Quark", kitchen: "east", emoji: "kartoffel", cat: "main", tags: ["vegi"], time: 90, serves: 4,
    note: "Polnische Teigtaschen in der beliebtesten Variante «ruskie» mit Kartoffeln, Quark und Röstzwiebeln. Roh lassen sie sich gut einfrieren und gefroren direkt ins Wasser geben.",
    ingr: ["400 g Mehl", "1 Ei", "2 dl warmes Wasser", "2 EL Rapsöl", "500 g mehligkochende Kartoffeln", "250 g Halbfettquark", "2 Zwiebeln", "30 g Butter", "180 g Sauerrahm", "½ Bund Schnittlauch", "Salz, Pfeffer"],
    steps: ["Kartoffeln schälen, würfeln und in Salzwasser 15–20 Minuten weich kochen. Abgiessen und noch heiss durchs Passe-vite drücken oder fein stampfen.",
      "Für den Teig Mehl, Ei, Wasser, Rapsöl und 1 TL Salz zu einem weichen, glatten Teig kneten. In Folie gewickelt 20 Minuten ruhen lassen.",
      "Zwiebeln fein hacken und in der Butter etwa 10 Minuten goldbraun braten. Die Hälfte davon mit dem Quark unter die Kartoffeln mischen und kräftig mit Salz und Pfeffer würzen.",
      "Teig auf wenig Mehl 2 mm dünn auswallen und Rondellen von 7–8 cm Durchmesser ausstechen. Je 1 TL Füllung daraufgeben, zu Halbmonden falten und die Ränder gut zusammendrücken.",
      "Pierogi portionenweise in siedendes Salzwasser geben. Sobald sie aufsteigen, noch 2–3 Minuten ziehen lassen und mit der Schaumkelle herausheben. Mit den restlichen Zwiebeln, Sauerrahm und Schnittlauch servieren."]
  },
  {
    id: "idee-ungarische-gulaschsuppe", title: "Ungarische Gulaschsuppe", kitchen: "east", emoji: "eintopf", cat: "soup", tags: ["prep"], time: 120, serves: 4,
    note: "Gulyás ist in Ungarn eine kräftige Suppe aus Rindfleisch, Paprika und Kartoffeln – das Hirtengericht, aus dem später das Saftgulasch wurde. Paprikapulver nie zu heiss anrösten, sonst wird es bitter.",
    ingr: ["600 g Rindsragout (Schulter), in 2 cm grossen Würfeln", "2 Zwiebeln", "2 Knoblauchzehen", "3 EL Rapsöl", "2 EL Paprikapulver, edelsüss", "1 TL Kümmel, gemahlen", "1 EL Tomatenpüree", "1.5 l Rindsbouillon", "2 rote Peperoni", "2 Tomaten", "500 g festkochende Kartoffeln", "2 Rüebli", "1 TL Majoran, getrocknet", "½ TL Chilipulver", "Salz, Pfeffer", "Brot zum Servieren"],
    steps: ["Zwiebeln fein hacken und im Rapsöl in einem grossen Topf 8 Minuten goldgelb dünsten. Rindsragout dazugeben und etwa 5 Minuten anbraten, bis es rundum Farbe hat.",
      "Topf kurz vom Herd nehmen, Paprikapulver, Kümmel und Tomatenpüree einrühren. Gehackten Knoblauch dazugeben, sofort mit 5 dl Bouillon ablöschen und zugedeckt bei kleiner Hitze 1 Stunde köcheln.",
      "Peperoni, Tomaten, Kartoffeln und Rüebli würfeln. Mit der restlichen Bouillon und dem Majoran zur Suppe geben und weitere 25–30 Minuten köcheln, bis Fleisch und Kartoffeln weich sind.",
      "Mit Salz, Pfeffer und Chilipulver abschmecken und mit Brot servieren."]
  },

  /* ---------- Skandinavien & Britische Inseln ---------- */
  {
    id: "idee-koettbullar", title: "Köttbullar mit Rahmsauce", kitchen: "nord", emoji: "fleisch", cat: "main", tags: ["kids"], time: 45, serves: 4,
    note: "Schwedische Fleischbällchen in Rahmsauce, klassisch mit Kartoffeln, Preiselbeeren und Essiggurken. Preiselbeerkonfitüre gibt es im Konfitürenregal; ein Spritzer Sojasauce gibt der Sauce Farbe und Würze.",
    ingr: ["500 g Hackfleisch (Rind und Schwein gemischt)", "1 kleine Zwiebel", "40 g Paniermehl", "1 dl Milch", "1 Ei", "2 EL Bratbutter", "1 EL Mehl", "3 dl Rindsbouillon", "1.5 dl Rahm", "1 TL Sojasauce", "800 g festkochende Kartoffeln", "Preiselbeerkonfitüre zum Servieren", "Salz, Pfeffer, Piment"],
    steps: ["Paniermehl in der Milch 5 Minuten quellen lassen. Zwiebel sehr fein hacken. Mit Hackfleisch, Ei, Salz, Pfeffer und einer Prise Piment gut verkneten.",
      "Kartoffeln schälen und in Salzwasser etwa 20 Minuten weich kochen.",
      "Mit nassen Händen etwa 30 kleine Bällchen formen. In der Bratbutter bei mittlerer Hitze rundum 8–10 Minuten braten, bis sie durch sind, und herausnehmen.",
      "Mehl im Bratfett kurz anschwitzen, mit Bouillon ablöschen, Rahm und Sojasauce dazugeben und 5 Minuten sämig köcheln. Abschmecken und die Köttbullar darin wenden.",
      "Mit den Kartoffeln und Preiselbeerkonfitüre servieren."]
  },
  {
    id: "idee-fish-and-chips", title: "Fish & Chips", kitchen: "nord", emoji: "fisch", cat: "main", tags: ["kids"], time: 55, serves: 4,
    note: "Britischer Imbissklassiker; die Chips backen hier im Ofen, nur der Fisch wird frittiert. Ohne Alkohol eiskaltes Mineralwasser statt Bier nehmen – der Teig wird ebenso knusprig. Statt Malzessig geht Apfelessig.",
    ingr: ["1 kg mehligkochende Kartoffeln", "4 EL Rapsöl, plus ca. 1 l zum Frittieren", "600 g Kabeljau- oder Seelachsfilet (MSC), ohne Haut", "150 g Mehl", "1 TL Backpulver", "2 dl kaltes Bier oder Mineralwasser mit Kohlensäure", "1 Zitrone", "Salz, Pfeffer", "Malzessig oder Tartarsauce zum Servieren"],
    steps: ["Ofen auf 220 °C vorheizen (Umluft 200 °C). Kartoffeln schälen, in 1 cm dicke Stäbchen schneiden, kalt abspülen und gut trocken tupfen. Mit 4 EL Rapsöl und Salz mischen und auf einem Blech verteilen.",
      "Chips 35–40 Minuten goldbraun und knusprig backen, nach der Hälfte der Zeit wenden.",
      "Für den Teig Mehl, Backpulver und 1 Prise Salz mischen und das kalte Bier nach und nach unterrühren, bis ein dickflüssiger Teig entsteht. Fisch (Kabeljau oder Seelachs) in vier Stücke schneiden, trocken tupfen, mit Salz und Pfeffer würzen und leicht mit Mehl bestäuben.",
      "Rapsöl in einem hohen Topf auf 180 °C erhitzen; an einem hineingehaltenen Holzlöffelstiel steigen dann Bläschen auf. Fischstücke durch den Teig ziehen, abtropfen lassen und portionenweise 4–5 Minuten goldbraun frittieren.",
      "Auf Haushaltpapier abtropfen lassen und mit den Chips, Zitronenschnitzen und Malzessig oder Tartarsauce servieren."]
  },
  {
    id: "idee-shepherds-pie", title: "Shepherd's Pie", kitchen: "nord", emoji: "kartoffel", cat: "main", tags: ["kids", "prep"], time: 75, serves: 4,
    note: "Britischer Hackfleischauflauf unter einer Decke aus Kartoffelstock; mit Lamm heisst er Shepherd's, mit Rind Cottage Pie. Vegi-Variante: Linsen statt Hackfleisch, Gemüsebouillon und keine Worcestershiresauce.",
    ingr: ["1 kg mehligkochende Kartoffeln", "1.5 dl Milch", "40 g Butter", "500 g Lammhackfleisch oder Rindshackfleisch", "1 Zwiebel", "2 Rüebli", "1 Stange Stangensellerie", "1 Knoblauchzehe", "2 EL Rapsöl", "2 EL Tomatenpüree", "1 EL Mehl", "3 dl Rindsbouillon", "1 EL Worcestershiresauce", "2 Zweige Thymian", "150 g Erbsen (tiefgekühlt)", "50 g Cheddar, gerieben (nach Belieben)", "Salz, Pfeffer, Muskat"],
    steps: ["Kartoffeln schälen, würfeln und in Salzwasser etwa 20 Minuten weich kochen. Abgiessen, mit heisser Milch und Butter zu Kartoffelstock stampfen und mit Salz und Muskat würzen.",
      "Zwiebel, Rüebli, Sellerie und Knoblauch fein würfeln. Hackfleisch im Rapsöl krümelig anbraten, Gemüse dazugeben und 5 Minuten mitdünsten.",
      "Tomatenpüree und Mehl unterrühren, mit Bouillon und Worcestershiresauce ablöschen, Thymian dazugeben und 15 Minuten köcheln. Erbsen unterrühren und mit Salz und Pfeffer abschmecken.",
      "Ofen auf 200 °C vorheizen (Umluft 180 °C). Fleischsauce in eine Gratinform füllen, den Kartoffelstock darauf verstreichen und mit einer Gabel Rillen ziehen. Mit Cheddar bestreuen.",
      "25–30 Minuten backen, bis die Oberfläche goldbraun ist. Vor dem Servieren 5 Minuten ruhen lassen."]
  },
  {
    id: "idee-zimtschnecken", title: "Zimtschnecken (Kanelbullar)", kitchen: "nord", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids"], time: 135, serves: 8,
    note: "In Schweden hat die Zimtschnecke am 4. Oktober sogar einen eigenen Feiertag. Kardamom im Teig ist typisch, kann aber wegbleiben. Die Schnecken lassen sich gut einfrieren und kurz aufbacken.",
    ingr: ["500 g Weissmehl", "2.5 dl Milch", "160 g Butter, die Hälfte davon weich", "20 g frische Hefe (½ Würfel)", "70 g Zucker", "½ TL Salz", "1 TL Kardamom, gemahlen", "80 g Rohzucker", "1 EL Zimt", "1 Ei zum Bestreichen", "Hagelzucker zum Bestreuen"],
    steps: ["Milch und 80 g Butter lauwarm erwärmen und die Hefe darin auflösen. Weissmehl, Zucker, Salz und Kardamom mischen, die Milchmischung dazugeben und 10 Minuten zu einem weichen, glatten Teig kneten. Zugedeckt 1 Stunde aufgehen lassen.",
      "Die weiche Butter mit Rohzucker und Zimt zu einer streichfähigen Masse verrühren.",
      "Teig auf wenig Mehl zu einem Rechteck von etwa 30 × 50 cm auswallen, mit der Zimtbutter bestreichen und von der langen Seite her aufrollen. In 16 Scheiben schneiden und auf ein Blech mit Backpapier oder in Papierförmchen setzen.",
      "Zugedeckt nochmals 30 Minuten aufgehen lassen. Ofen auf 220 °C vorheizen (Umluft 200 °C).",
      "Schnecken mit verquirltem Ei bestreichen, mit Hagelzucker bestreuen und in der Ofenmitte 10–12 Minuten goldbraun backen. Auf einem Gitter auskühlen lassen."]
  }
]);
