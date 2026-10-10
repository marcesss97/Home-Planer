/* Home-Planer: Rezeptbuch – Welt (Mexiko & Lateinamerika, Afrika südlich der Sahara, Türkei & Persien, USA & Kanada
   und weitere Gerichte aus Asien). Eigene Rezepte nach demselben Muster wie in ideen.js.
   Kennungen (emoji, cat, tags, kitchen, coll) aus logic.js. time in Minuten. */
window.HP_IDEEN = (window.HP_IDEEN || []).concat([
  /* ---------- Mexiko & Lateinamerika ---------- */
  {
    id: "idee-tacos-al-pastor", title: "Tacos al Pastor", kitchen: "latam", emoji: "taco", cat: "main", tags: ["guests"], time: 50, serves: 4,
    note: "Mexikanischer Strassenklassiker: Schweinefleisch in roter Chili-Ananas-Marinade, scharf angebraten. Über Nacht mariniert wird es noch würziger. Getrocknete Ancho-Chilis gibt es im Globus oder online; mildes Chilipulver geht auch.",
    ingr: ["600 g Schweinshals, in dünnen Scheiben", "2 getrocknete Ancho-Chilis oder 2 TL Chilipulver, mild", "1 dl Ananassaft", "2 EL Apfelessig", "2 Knoblauchzehen",
      "1 TL Kreuzkümmel", "1 TL Oregano", "1 TL Paprikapulver, geräuchert", "4 Scheiben Ananas, frisch oder aus der Dose", "12 kleine Maistortillas", "1 Zwiebel",
      "1 Bund Koriander", "2 Limetten", "2 EL Öl", "Salz", "Scharfe Salsa zum Servieren"],
    steps: ["Chilis entkernen und etwa 15 Minuten in heissem Wasser einweichen (Chilipulver braucht das nicht). Abtropfen und mit Ananassaft, Apfelessig, Knoblauch, Kreuzkümmel, Oregano, Paprikapulver und 1 TL Salz fein pürieren.",
      "Schweinshals in fingerbreite Streifen schneiden, mit der Marinade mischen und mindestens 20 Minuten ziehen lassen. Inzwischen Zwiebel fein hacken, Koriander zupfen und Limetten in Schnitze schneiden.",
      "Ananas in kleine Würfel schneiden und in einer heissen Bratpfanne ohne Öl 3–4 Minuten anrösten, bis sie leicht karamellisiert. Herausnehmen.",
      "Öl in der Pfanne stark erhitzen und das Fleisch portionenweise 5–6 Minuten braten, bis es durch ist und an den Rändern dunkle, knusprige Stellen hat.",
      "Maistortillas in einer trockenen Pfanne kurz erwärmen. Mit Fleisch, Ananas, Zwiebel und Koriander füllen, mit Limettensaft beträufeln und mit Salsa servieren."]
  },
  {
    id: "idee-enchiladas-pilze-spinat", title: "Enchiladas mit Pilzen und Spinat", kitchen: "latam", emoji: "taco", cat: "main", tags: ["vegi", "prep"], time: 55, serves: 4,
    note: "Gerollte Tortillas, mit Tomaten-Chili-Sauce und Käse überbacken, hier mit Champignons, Spinat und Mais. Mit Maistortillas statt Weizentortillas wird das Gericht glutenfrei; sie brechen weniger, wenn man sie vorher kurz in der Pfanne erwärmt.",
    ingr: ["1 Zwiebel", "2 Knoblauchzehen", "3 EL Olivenöl", "1 EL Tomatenpüree", "1 TL Kreuzkümmel", "1 TL Paprikapulver, geräuchert", "½ TL Chilipulver",
      "1 Dose gehackte Tomaten (400 g)", "2 dl Gemüsebouillon", "400 g Champignons", "200 g Blattspinat, frisch oder tiefgekühlt", "1 Dose Mais (300 g)",
      "200 g Reibkäse (z. B. Cheddar oder Mozzarella)", "8 Weizentortillas (ca. 20 cm)", "1.8 dl Sauerrahm", "Koriander, Salz, Pfeffer"],
    steps: ["Zwiebel und Knoblauch hacken und die Hälfte davon in 1 EL Olivenöl andünsten. Tomatenpüree, Kreuzkümmel, Paprikapulver und Chilipulver kurz mitrösten, gehackte Tomaten und Bouillon dazugeben und etwa 10 Minuten köcheln. Fein pürieren und mit Salz abschmecken.",
      "Champignons in Scheiben schneiden und mit der restlichen Zwiebel und dem Knoblauch im übrigen Olivenöl etwa 8 Minuten kräftig braten, bis die Flüssigkeit verdampft ist.",
      "Spinat dazugeben und zusammenfallen lassen (tiefgekühlten vorher auftauen und ausdrücken). Abgetropften Mais und die Hälfte des Reibkäses untermischen und mit Salz und Pfeffer würzen. Ofen auf 200 °C vorheizen (Umluft 180 °C).",
      "Ein Drittel der Sauce in eine Gratinform geben. Weizentortillas mit der Füllung belegen, aufrollen und nebeneinander in die Form legen. Restliche Sauce und Reibkäse darüber verteilen.",
      "In der Ofenmitte etwa 20 Minuten backen, bis der Käse goldbraun ist. Mit Sauerrahm und Koriander servieren."]
  },
  {
    id: "idee-ropa-vieja", title: "Ropa Vieja (kubanisches Schmorfleisch)", kitchen: "latam", emoji: "fleisch", cat: "main", tags: ["guests", "prep"], time: 155, serves: 4,
    note: "Kubas Nationalgericht: Rindfleisch, so lange gekocht, bis es in Fasern zerfällt, dann in Tomatensauce mit Peperoni und Oliven geschmort. Dazu gehören Reis, schwarze Bohnen und gebratene Kochbananen. Schmeckt aufgewärmt noch besser.",
    ingr: ["1 kg Rindsschulter (Schmorstück)", "2 Lorbeerblätter", "1.5 l Wasser", "2 Zwiebeln", "1 rote Peperoni", "1 grüne Peperoni", "3 Knoblauchzehen", "2 EL Olivenöl",
      "1 TL Kreuzkümmel", "1 TL Oregano", "2 EL Tomatenpüree", "1 dl Weisswein", "1 Dose gehackte Tomaten (400 g)", "60 g grüne Oliven", "300 g Langkornreis",
      "1 Dose schwarze Bohnen (400 g)", "Salz, Pfeffer"],
    steps: ["Rindsschulter in 3 bis 4 grosse Stücke schneiden, mit Lorbeerblättern, Wasser und 2 TL Salz aufkochen, Schaum abschöpfen und zugedeckt bei kleiner Hitze etwa 2 Stunden köcheln, bis das Fleisch sehr weich ist.",
      "Fleisch herausnehmen, etwas abkühlen lassen und mit zwei Gabeln in feine Fasern zerzupfen. 3 dl Kochflüssigkeit beiseitestellen.",
      "Zwiebeln und Peperoni in Streifen schneiden, Knoblauch hacken. Im Olivenöl in einer grossen Pfanne etwa 8 Minuten weich dünsten. Kreuzkümmel, Oregano und Tomatenpüree kurz mitrösten.",
      "Mit Weisswein ablöschen, Tomaten, Kochflüssigkeit, Oliven und das zerzupfte Fleisch dazugeben und offen etwa 20 Minuten köcheln, bis die Sauce dick ist. Mit Salz und Pfeffer abschmecken.",
      "Inzwischen Langkornreis nach Packungsangabe kochen und die abgespülten Bohnen mit etwas Salz erwärmen. Ropa Vieja mit Reis und Bohnen servieren."]
  },
  {
    id: "idee-sopa-de-tortilla", title: "Sopa de Tortilla (mexikanische Tortillasuppe)", kitchen: "latam", emoji: "suppe", cat: "soup", tags: ["vegi", "cheap"], time: 40, serves: 4,
    note: "Würzige Tomaten-Chili-Suppe aus Mexiko, über knusprige Maistortilla-Streifen geschöpft und mit Avocado, Käse und Limette serviert. Ohne Feta und Sauerrahm ist sie vegan. Wer mag, gibt zerzupftes Poulet dazu.",
    ingr: ["6 Maistortillas", "4 EL Öl", "1 Zwiebel", "3 Knoblauchzehen", "1 TL Paprikapulver, geräuchert", "½ TL Chilipulver", "1 TL Kreuzkümmel", "1 TL Oregano",
      "1 Dose gehackte Tomaten (400 g)", "1 l Gemüsebouillon", "1 Dose schwarze Bohnen (400 g)", "2 Limetten", "1 Avocado", "½ Bund Koriander", "100 g Feta",
      "4 EL Sauerrahm", "Salz"],
    steps: ["Ofen auf 200 °C vorheizen (Umluft 180 °C). Maistortillas in schmale Streifen schneiden, mit 2 EL Öl und etwas Salz mischen und auf einem Blech 8–10 Minuten knusprig backen.",
      "Zwiebel und Knoblauch hacken und im restlichen Öl etwa 5 Minuten andünsten. Paprikapulver, Chilipulver, Kreuzkümmel und Oregano kurz mitrösten.",
      "Tomaten und Bouillon dazugeben und etwa 15 Minuten köcheln. Fein pürieren, die abgespülten Bohnen dazugeben, kurz weiterköcheln und mit Salz und dem Saft einer Limette abschmecken.",
      "Avocado würfeln, Koriander hacken und die zweite Limette in Schnitze schneiden. Tortilla-Streifen in Teller verteilen, heisse Suppe darüberschöpfen und mit Avocado, zerbröckeltem Feta, Sauerrahm und Koriander servieren."]
  },
  {
    id: "idee-ceviche-suesskartoffeln", title: "Ceviche mit Süsskartoffeln und Mais", kitchen: "latam", emoji: "fisch", cat: "main", tags: ["guests"], time: 40, serves: 4,
    note: "Perus Nationalgericht: roher Fisch, der im Limettensaft «gart». Nur ganz frischen Fisch in Sushi-Qualität verwenden, etwa Wolfsbarsch, Dorade oder Kabeljau. Gekochte Süsskartoffeln und Mais gehören in Peru dazu.",
    ingr: ["500 g Fischfilet ohne Haut in Sushi-Qualität (z. B. Wolfsbarsch)", "2 Süsskartoffeln (ca. 500 g)", "2 Maiskolben, vorgekocht", "6–8 Limetten", "1 rote Zwiebel",
      "1 rote Chilischote", "1 Knoblauchzehe", "1 Bund Koriander", "1 Avocado", "Salz"],
    steps: ["Süsskartoffeln schälen, in dicke Scheiben schneiden und in Salzwasser 12–15 Minuten weich kochen. Maiskolben in Stücke schneiden und die letzten 5 Minuten mitkochen. Abgiessen und auskühlen lassen.",
      "Zwiebel in hauchdünne Streifen schneiden und kurz kalt abspülen. Chilischote entkernen und fein hacken, Knoblauch pressen, Koriander hacken. Limetten auspressen; es braucht etwa 2 dl Saft.",
      "Fischfilet mit einem scharfen Messer in 1–2 cm grosse Würfel schneiden, in eine kalte Schüssel geben und mit 1 TL Salz mischen.",
      "Limettensaft, Knoblauch und Chilischote darübergiessen, mischen und 10–15 Minuten kühl ziehen lassen, bis der Fisch aussen weiss und innen noch leicht glasig ist.",
      "Zwiebel, Koriander und Avocadowürfel unterheben, abschmecken und sofort mit Süsskartoffeln und Mais anrichten."]
  },
  {
    id: "idee-arepas-ruehrei-avocado", title: "Arepas mit Tomaten-Rührei und Avocado", kitchen: "latam", emoji: "fladen", cat: "main", tags: ["vegi"], time: 40, serves: 4,
    note: "Venezolanische Maisfladen, aussen knusprig und innen weich, gefüllt mit Rührei, Tomaten und Frühlingszwiebeln. Es braucht vorgekochtes Maismehl (z. B. P.A.N.) von Coop, Globus oder aus dem Lateinamerika-Laden; Polenta funktioniert nicht.",
    ingr: ["300 g vorgekochtes Maismehl, weiss (z. B. P.A.N.)", "4 dl warmes Wasser", "1 TL Salz", "2 EL Öl", "2 Tomaten", "3 Frühlingszwiebeln", "1 rote Peperoni",
      "1 EL Butter", "6 Eier", "1 Avocado", "100 g Feta oder Mozzarella", "Pfeffer"],
    steps: ["Maismehl und Salz in einer Schüssel mischen, das warme Wasser nach und nach dazugeben und zu einem weichen, glatten Teig kneten. 5 Minuten quellen lassen, dann in 8 Kugeln teilen und zu 1.5 cm dicken Fladen flach drücken.",
      "Öl in einer schweren Bratpfanne erhitzen und die Arepas bei mittlerer Hitze pro Seite 6–8 Minuten braten, bis sie eine goldene Kruste haben. Im Ofen bei 100 °C warm halten.",
      "Tomaten würfeln, Frühlingszwiebeln in Ringe schneiden, Peperoni fein würfeln. Das Gemüse in der Butter etwa 4 Minuten andünsten.",
      "Eier verquirlen, salzen und pfeffern, in die Pfanne giessen und unter sanftem Rühren cremig stocken lassen.",
      "Arepas seitlich aufschneiden, sodass eine Tasche entsteht. Mit Rührei, Avocadoscheiben und zerbröckeltem Feta füllen und warm essen."]
  },
  {
    id: "idee-empanadas-hackfleisch", title: "Empanadas mit Hackfleisch und Oliven", kitchen: "latam", emoji: "waehe", cat: "main", tags: ["guests", "prep"], time: 75, serves: 4,
    note: "Argentinische Teigtaschen mit würzigem Rindfleisch, Ei und Oliven. Mit fertigem Kuchenteig gelingen sie einfach. Sie lassen sich ungebacken einfrieren und direkt aus dem Tiefkühler backen; dann etwas länger im Ofen lassen.",
    ingr: ["2 Kuchenteige, rund ausgewallt (ca. 32 cm)", "400 g Hackfleisch (Rind)", "2 Zwiebeln", "1 rote Peperoni", "2 EL Öl", "1 TL Kreuzkümmel",
      "2 TL Paprikapulver, edelsüss", "½ TL Chiliflocken", "2 Eier, hart gekocht", "50 g grüne Oliven ohne Stein", "2 Frühlingszwiebeln", "1 Eigelb zum Bestreichen",
      "Salz, Pfeffer"],
    steps: ["Zwiebeln und Peperoni fein würfeln und im Öl etwa 8 Minuten weich dünsten. Hackfleisch dazugeben und krümelig braten. Mit Kreuzkümmel, Paprikapulver, Chiliflocken, Salz und Pfeffer kräftig würzen und etwa 15 Minuten auskühlen lassen.",
      "Eier und Oliven hacken, Frühlingszwiebeln in feine Ringe schneiden und unter die kalte Füllung mischen.",
      "Ofen auf 200 °C vorheizen (Umluft 180 °C). Aus den Kuchenteigen mit einer Schüssel Rondellen von etwa 12 cm ausstechen; Reste zusammenfügen und nochmals auswallen.",
      "Je einen gehäuften Esslöffel Füllung auf eine Teighälfte geben, den Rand mit Wasser bestreichen, zuklappen und den Rand mit einer Gabel fest andrücken.",
      "Empanadas auf ein mit Backpapier belegtes Blech legen, mit verquirltem Eigelb bestreichen und in der Ofenmitte 20–25 Minuten goldbraun backen."]
  },
  {
    id: "idee-feijoada-raeuchertofu", title: "Feijoada mit schwarzen Bohnen und Räuchertofu", kitchen: "latam", emoji: "eintopf", cat: "main", tags: ["vegan", "vegi", "cheap", "prep"], time: 60, serves: 4,
    note: "Inspiriert vom brasilianischen Bohneneintopf, der sonst mit viel Schweinefleisch gekocht wird: Räuchertofu und geräuchertes Paprikapulver bringen das rauchige Aroma. Klassisch mit Reis, Orangenschnitzen und kurz gebratenem Federkohl.",
    ingr: ["200 g Räuchertofu", "3 EL Olivenöl", "2 Zwiebeln", "3 Knoblauchzehen", "1 Süsskartoffel (ca. 300 g)", "2 TL Paprikapulver, geräuchert", "1 TL Kreuzkümmel",
      "3 Dosen schwarze Bohnen (à 400 g)", "5 dl Gemüsebouillon", "2 Lorbeerblätter", "1 EL Rotweinessig", "250 g Langkornreis", "200 g Federkohl oder Wirz",
      "2 Orangen", "Salz, Pfeffer"],
    steps: ["Räuchertofu in kleine Würfel schneiden und in 2 EL Olivenöl in einem grossen Topf etwa 6 Minuten knusprig braten. Herausnehmen.",
      "Zwiebeln und Knoblauch hacken, Süsskartoffel schälen und würfeln. Im selben Topf etwa 5 Minuten andünsten, Paprikapulver und Kreuzkümmel kurz mitrösten.",
      "Bohnen dazugeben, dabei die Flüssigkeit einer Dose mitverwenden und die übrigen abspülen. Bouillon und Lorbeerblätter dazugeben und offen etwa 30 Minuten sämig köcheln. Ein paar Kellen Bohnen zerdrücken, damit der Eintopf bindet. Tofu wieder dazugeben und mit Essig, Salz und Pfeffer abschmecken.",
      "Inzwischen Langkornreis nach Packungsangabe kochen. Federkohl in feine Streifen schneiden und im restlichen Öl 3–4 Minuten braten, salzen.",
      "Orangen schälen und in Schnitze schneiden. Feijoada mit Reis, Federkohl und Orangen servieren."]
  },
  {
    id: "idee-pozole-rojo", title: "Pozole rojo mit Schweinefleisch", kitchen: "latam", emoji: "suppe", cat: "soup", tags: ["guests", "prep"], time: 135, serves: 4,
    note: "Kräftige mexikanische Suppe mit Schweinefleisch, Chili und dicken Maiskörnern (Hominy). Hominy gibt es im Lateinamerika-Laden oder online; Ersatz: Kichererbsen aus der Dose. Am Tisch streut jede Person Kabis, Radiesli, Zwiebel und Limette darüber.",
    ingr: ["800 g Schweinsschulter, in grossen Würfeln", "1 Zwiebel", "4 Knoblauchzehen", "2 Lorbeerblätter", "1.5 l Wasser", "3 getrocknete Ancho-Chilis oder 2 EL Chilipulver, mild",
      "1 TL Oregano", "1 TL Kreuzkümmel", "2 Dosen Hominy (à 400 g) oder Kichererbsen", "200 g Weisskabis", "1 Bund Radiesli", "1 rote Zwiebel", "2 Limetten", "Salz",
      "Tortilla-Chips aus Mais zum Servieren"],
    steps: ["Schweinsschulter mit der halbierten Zwiebel, 2 Knoblauchzehen, Lorbeerblättern, Wasser und 2 TL Salz aufkochen, Schaum abschöpfen und zugedeckt bei kleiner Hitze etwa 1½ Stunden köcheln, bis das Fleisch zart ist.",
      "Inzwischen Chilis entkernen, in einer trockenen Pfanne kurz anrösten und mit heissem Wasser bedeckt 20 Minuten einweichen. Abtropfen und mit dem restlichen Knoblauch, Oregano, Kreuzkümmel und 2 dl Kochflüssigkeit fein pürieren (Chilipulver direkt mitpürieren).",
      "Zwiebel und Lorbeer aus dem Topf nehmen, Fleisch mit zwei Gabeln grob zerzupfen. Chilisauce durch ein Sieb in die Suppe streichen, Hominy abspülen und dazugeben und weitere 20 Minuten köcheln. Mit Salz abschmecken.",
      "Weisskabis fein hobeln, Radiesli in Scheiben schneiden, rote Zwiebel fein hacken und Limetten in Schnitze schneiden.",
      "Pozole in tiefen Tellern anrichten und mit den frischen Beilagen und Tortilla-Chips servieren."]
  },
  {
    id: "idee-mole-poulet", title: "Mole-Poulet mit Schokolade (vereinfacht)", kitchen: "latam", emoji: "poulet", cat: "main", tags: ["guests"], time: 70, serves: 4,
    note: "Mole poblano ist Mexikos Festtagssauce aus Chilis, Nüssen, Gewürzen und Schokolade. Diese einfache Fassung kommt mit Vorratszutaten aus. Dunkle Schokolade mit mindestens 70 % Kakao nehmen. Dazu passen Reis oder warme Maistortillas.",
    ingr: ["800 g Pouletoberschenkel ohne Haut und Knochen", "3 EL Öl", "40 g Mandeln", "2 EL Sesam", "1 Zwiebel", "3 Knoblauchzehen", "2 EL Chilipulver, mild",
      "1 TL Kreuzkümmel", "1 TL Zimt", "½ TL Nelkenpulver", "1 Dose gehackte Tomaten (400 g)", "3 dl Pouletbouillon", "30 g Rosinen", "40 g dunkle Schokolade (70 %)",
      "250 g Langkornreis", "Salz"],
    steps: ["Poulet salzen und in 1 EL Öl in einem Schmortopf rundum 6–8 Minuten anbraten. Herausnehmen.",
      "Mandeln und Sesam in einer trockenen Pfanne goldbraun rösten; 1 EL Sesam zum Bestreuen beiseitelegen. Zwiebel und Knoblauch hacken und im restlichen Öl im Schmortopf etwa 5 Minuten andünsten. Chilipulver, Kreuzkümmel, Zimt und Nelkenpulver kurz mitrösten.",
      "Tomaten, Bouillon, Mandeln, Sesam und Rosinen dazugeben und etwa 10 Minuten köcheln. Schokolade dazugeben und alles mit dem Stabmixer sehr fein pürieren. Mit Salz abschmecken.",
      "Poulet in die Sauce legen und zugedeckt bei kleiner Hitze etwa 30 Minuten schmoren, bis es zart ist. Wird die Sauce zu dick, etwas Wasser dazugeben.",
      "Inzwischen Langkornreis nach Packungsangabe kochen. Mole-Poulet mit dem beiseitegelegten Sesam bestreuen und mit dem Reis servieren."]
  },
  {
    id: "idee-elote-salat", title: "Elote-Salat mit Limette und Feta", kitchen: "latam", emoji: "salat", cat: "salad", tags: ["vegi", "quick"], time: 20, serves: 4,
    note: "Mexikanischer Strassensnack als Salat: angeröstete Maiskörner mit Limette, Chili und Käse. Statt mexikanischem Cotija passt Feta. Ausserhalb der Saison gehen Maiskörner aus der Dose oder tiefgekühlt.",
    ingr: ["4 Maiskolben, vorgekocht, oder 600 g Maiskörner", "1 EL Öl", "2 Frühlingszwiebeln", "1 rote Chilischote", "½ Bund Koriander", "3 EL Mayonnaise", "3 EL Sauerrahm",
      "2 Limetten", "½ TL Paprikapulver, geräuchert", "100 g Feta", "Salz"],
    steps: ["Maiskörner mit einem scharfen Messer von den Kolben schneiden. Öl in einer Bratpfanne stark erhitzen und den Mais darin 6–8 Minuten rösten, bis er an vielen Stellen goldbraun ist. Etwas abkühlen lassen.",
      "Frühlingszwiebeln in feine Ringe schneiden, Chilischote entkernen und fein hacken, Koriander hacken.",
      "Mayonnaise, Sauerrahm, Saft von 1½ Limetten, Paprikapulver und Salz verrühren und mit dem warmen Mais, den Frühlingszwiebeln und der Chilischote mischen.",
      "Feta darüberbröckeln, mit Koriander bestreuen und mit Limettenschnitzen servieren. Schmeckt lauwarm am besten."]
  },
  {
    id: "idee-chilaquiles", title: "Chilaquiles mit Spiegelei", kitchen: "latam", emoji: "ei", cat: "breakfast", tags: ["vegi", "quick"], time: 30, serves: 4,
    note: "Mexikanisches Zmorge: Tortilla-Chips, kurz in scharfer Tomatensauce geschwenkt und mit Spiegelei, Käse und Avocado belegt. Sofort essen, solange die Chips noch etwas Biss haben. Ungesalzene Maischips sind ideal.",
    ingr: ["1 Zwiebel", "1 Dose gehackte Tomaten (400 g)", "2 Knoblauchzehen", "1–2 grüne Chilischoten", "1 dl Gemüsebouillon", "2 EL Öl", "4 Eier",
      "200 g Tortilla-Chips aus Mais, ungesalzen", "100 g Feta", "1 Avocado", "4 EL Sauerrahm", "½ Bund Koriander", "Salz"],
    steps: ["Zwiebel halbieren; eine Hälfte grob schneiden, die andere fein hacken und beiseitestellen. Die grob geschnittene Zwiebel mit Tomaten, Knoblauch, Chilischoten und Bouillon fein pürieren.",
      "1 EL Öl in einer weiten Bratpfanne erhitzen, die Sauce hineingiessen und etwa 8 Minuten einkochen, bis sie leicht andickt. Mit Salz abschmecken.",
      "Im restlichen Öl in einer zweiten Pfanne die Eier 3–4 Minuten zu Spiegeleiern braten.",
      "Tortilla-Chips in die heisse Sauce geben und 1 Minute schwenken, bis sie überzogen, aber noch knusprig sind. Auf Teller verteilen und mit Spiegelei, zerbröckeltem Feta, Avocado, Sauerrahm, gehackter Zwiebel und Koriander belegen."]
  },
  {
    id: "idee-pollo-a-la-brasa", title: "Pollo a la Brasa mit grüner Sauce", kitchen: "latam", emoji: "poulet", cat: "main", tags: ["guests"], time: 95, serves: 4,
    note: "Peruanisches Ofenpoulet mit Sojasauce, Limette und Kreuzkümmel, dazu eine frische grüne Chilisauce. Am besten über Nacht marinieren. In Peru gehören Pommes frites und Salat dazu; hier gibt es Kartoffelschnitze aus dem Ofen.",
    ingr: ["6 Pouletschenkel mit Haut (ca. 1.5 kg)", "4 Knoblauchzehen", "3 EL Sojasauce", "2 Limetten", "2 TL Kreuzkümmel", "2 TL Paprikapulver, geräuchert", "1 TL Oregano",
      "3 EL Öl", "800 g Kartoffeln, festkochend", "1 Bund Koriander", "2 grüne Chilischoten", "100 g Feta", "4 EL Mayonnaise", "Salz, Pfeffer"],
    steps: ["Knoblauch pressen und mit Sojasauce, dem Saft einer Limette, Kreuzkümmel, Paprikapulver, Oregano, 2 EL Öl, 1 TL Salz und Pfeffer verrühren. Pouletschenkel damit rundum einreiben und mindestens 30 Minuten marinieren.",
      "Ofen auf 210 °C vorheizen (Umluft 190 °C). Kartoffeln in Schnitze schneiden, mit dem restlichen Öl und Salz mischen und auf einem Blech verteilen.",
      "Poulet mit der Hautseite nach oben in eine Form legen. Poulet und Kartoffeln zusammen 40–45 Minuten backen, bis die Haut knusprig und das Fleisch durch ist; die Kartoffeln einmal wenden.",
      "Für die grüne Sauce Koriander samt Stielen, entkernte Chilischoten, Feta, Mayonnaise und den Saft der zweiten Limette fein pürieren. Mit Salz abschmecken.",
      "Poulet 5 Minuten ruhen lassen und mit Kartoffeln und der grünen Sauce servieren."]
  },
  {
    id: "idee-arroz-con-pollo", title: "Arroz con Pollo", kitchen: "latam", emoji: "reis", cat: "main", tags: ["kids", "cheap"], time: 55, serves: 4,
    note: "Poulet und Reis aus einem Topf, wie man es in ganz Lateinamerika kocht – hier auf peruanische Art: viel Koriander, mit Bouillon püriert, färbt den Reis grün. Das Bier gibt Tiefe und lässt sich durch Bouillon ersetzen.",
    ingr: ["700 g Pouletoberschenkel ohne Haut", "2 EL Öl", "2 Bund Koriander", "1 grüne Chilischote", "3 Knoblauchzehen", "6 dl Pouletbouillon", "1 Zwiebel",
      "1 rote Peperoni", "2 Rüebli", "1 TL Kreuzkümmel", "300 g Langkornreis", "1 dl helles Bier oder Bouillon", "150 g Erbsen, tiefgekühlt", "1 Limette", "Salz, Pfeffer"],
    steps: ["Poulet mit Salz und Pfeffer würzen und im Öl in einem weiten Topf rundum etwa 8 Minuten goldbraun anbraten. Herausnehmen.",
      "Koriander grob schneiden und mit Chilischote, Knoblauch und 2 dl Bouillon fein pürieren.",
      "Zwiebel, Peperoni und Rüebli fein würfeln und im Bratfett etwa 5 Minuten andünsten. Kreuzkümmel und Langkornreis dazugeben und kurz mitdünsten.",
      "Korianderpüree, restliche Bouillon und Bier dazugiessen, salzen und das Poulet obenauf legen. Zugedeckt bei kleiner Hitze etwa 20 Minuten garen.",
      "Erbsen darüberstreuen, wieder zudecken und weitere 5 Minuten garen, bis der Reis weich ist und die Flüssigkeit aufgenommen hat. Mit Limettenschnitzen servieren."]
  },
  {
    id: "idee-burger-schwarze-bohnen", title: "Burger aus schwarzen Bohnen", kitchen: "latam", emoji: "burger", cat: "main", tags: ["vegan", "vegi", "kids"], time: 40, serves: 4,
    note: "Würzige Bohnen-Patties mit Haferflocken und Chipotle, ganz ohne Ei. Gut gekühlt halten sie in der Pfanne zusammen. Statt Chipotle-Paste geht geräuchertes Paprikapulver mit etwas Chili. Brötchen ohne Milch und Ei wählen.",
    ingr: ["2 Dosen schwarze Bohnen (à 400 g)", "1 Zwiebel", "2 Knoblauchzehen", "4 EL Öl", "80 g Haferflocken, fein", "2 EL Maizena", "2 EL Tomatenpüree",
      "1 TL Kreuzkümmel", "1 TL Paprikapulver, geräuchert", "1 TL Chipotle-Paste oder ½ TL Chilipulver", "4 Burgerbrötchen (vegan)", "4 Salatblätter", "2 Tomaten",
      "1 Avocado", "1 rote Zwiebel", "Salz, Pfeffer"],
    steps: ["Bohnen abspülen, gut abtropfen lassen und auf Küchenpapier trocken tupfen. Zwiebel und Knoblauch fein hacken und in 1 EL Öl etwa 5 Minuten andünsten.",
      "Bohnen in einer Schüssel mit einer Gabel grob zerdrücken. Zwiebel, Haferflocken, Maizena, Tomatenpüree, Kreuzkümmel, Paprikapulver und Chipotle-Paste dazugeben, mit Salz und Pfeffer würzen und gut verkneten.",
      "Mit nassen Händen vier Patties formen und mindestens 15 Minuten kühl stellen.",
      "Restliches Öl in einer beschichteten Bratpfanne erhitzen und die Patties bei mittlerer Hitze pro Seite 4–5 Minuten knusprig braten.",
      "Burgerbrötchen halbieren und kurz rösten. Mit Salatblättern, Patty, Tomaten, Avocado und Ringen der roten Zwiebel belegen."]
  },
  {
    id: "idee-moqueca", title: "Moqueca (brasilianischer Fischeintopf)", kitchen: "latam", emoji: "fisch", cat: "main", tags: ["guests"], time: 40, serves: 4,
    note: "Fischeintopf aus Bahia mit Kokosmilch, Peperoni und Limette. Traditionell kommt rotes Palmöl dazu; ein Teelöffel Paprikapulver gibt eine ähnliche Farbe. Fester Fisch wie Kabeljau oder Seelachs zerfällt nicht.",
    ingr: ["600 g festes Fischfilet ohne Haut (z. B. Kabeljau oder Seelachs)", "2 Limetten", "3 Knoblauchzehen", "250 g Langkornreis", "1 Zwiebel", "1 rote Peperoni",
      "1 gelbe Peperoni", "3 Tomaten", "1 rote Chilischote", "2 EL Olivenöl", "1 TL Paprikapulver", "1 Dose Kokosmilch (4 dl)", "1 Bund Koriander", "Salz, Pfeffer"],
    steps: ["Fischfilet in grosse Stücke schneiden, mit dem Saft einer Limette, 1 gepressten Knoblauchzehe, Salz und Pfeffer mischen und etwa 15 Minuten ziehen lassen. Inzwischen Langkornreis nach Packungsangabe kochen.",
      "Zwiebel in Ringe, Peperoni in Streifen und Tomaten in Scheiben schneiden. Restlichen Knoblauch und die Chilischote fein hacken.",
      "Olivenöl in einem weiten Topf erhitzen, Zwiebel, Peperoni, Knoblauch und Chilischote etwa 5 Minuten andünsten. Paprikapulver kurz mitrösten.",
      "Tomaten darauf verteilen, den Fisch darauflegen und Kokosmilch darübergiessen. Aufkochen und zugedeckt bei kleiner Hitze 8–10 Minuten ziehen lassen, bis der Fisch gar ist. Nicht rühren, nur den Topf leicht schwenken.",
      "Mit dem Saft der zweiten Limette und Salz abschmecken, mit viel Koriander bestreuen und mit dem Reis servieren."]
  },

  /* ---------- Afrika südlich der Sahara ---------- */
  {
    id: "idee-jollof-reis", title: "Jollof-Reis", kitchen: "afrika", emoji: "reis", cat: "main", tags: ["vegan", "vegi", "cheap"], time: 60, serves: 4,
    note: "Westafrikas berühmter Tomatenreis, über den sich Nigeria und Ghana gern streiten. Die leicht angesetzte Schicht am Topfboden gilt als das Beste. Dazu passen gebratene Kochbananen, Poulet oder ein Spiegelei.",
    ingr: ["2 rote Peperoni", "1 Dose gehackte Tomaten (400 g)", "2 Zwiebeln", "3 Knoblauchzehen", "1 Stück Ingwer (3 cm)", "1 rote Chilischote", "4 EL Öl",
      "2 EL Tomatenpüree", "1 TL Currypulver", "1 TL Thymian, getrocknet", "2 Lorbeerblätter", "350 g Langkornreis (z. B. parboiled)", "2 Rüebli", "6 dl Gemüsebouillon",
      "150 g Erbsen, tiefgekühlt", "Salz, Pfeffer"],
    steps: ["Peperoni grob schneiden und mit Tomaten, einer Zwiebel, Knoblauch, Ingwer und Chilischote fein pürieren.",
      "Die zweite Zwiebel fein hacken und im Öl in einem schweren Topf etwa 5 Minuten andünsten. Tomatenpüree dazugeben und 2 Minuten rösten, bis es dunkler wird.",
      "Püree, Currypulver, Thymian und Lorbeerblätter dazugeben und offen etwa 15 Minuten einkochen, bis die Sauce dick ist und sich das Öl absetzt.",
      "Langkornreis gut spülen und mit den gewürfelten Rüebli in die Sauce rühren. Bouillon dazugiessen, salzen, aufkochen und zugedeckt bei kleinster Hitze etwa 25 Minuten garen, ohne umzurühren.",
      "Erbsen darauf verteilen, wieder zudecken und 5 Minuten ziehen lassen. Am Boden darf eine leicht rauchige Kruste entstehen. Reis auflockern, mit Salz und Pfeffer abschmecken."]
  },
  {
    id: "idee-maafe-rind", title: "Maafe (westafrikanischer Erdnuss-Eintopf)", kitchen: "afrika", emoji: "eintopf", cat: "main", tags: ["prep"], time: 120, serves: 4,
    note: "Aus Senegal und Mali: zartes Rindfleisch und Gemüse in sämiger Sauce aus Erdnussbutter und Tomaten. Erdnussbutter ohne Zucker verwenden. Vegane Variante: statt Rind Kichererbsen und mehr Süsskartoffeln, dann genügen 30 Minuten Kochzeit.",
    ingr: ["700 g Rindsragout", "2 EL Öl", "2 Zwiebeln", "3 Knoblauchzehen", "1 Stück Ingwer (3 cm)", "2 EL Tomatenpüree", "1 Dose gehackte Tomaten (400 g)",
      "7 dl Gemüsebouillon", "1 rote Chilischote", "150 g Erdnussbutter, ungesüsst", "3 Rüebli", "400 g Süsskartoffeln", "300 g Langkornreis",
      "2 EL Erdnüsse, geröstet", "Salz, Pfeffer"],
    steps: ["Rindsragout trocken tupfen, salzen und im Öl in einem Schmortopf portionenweise rundum kräftig anbraten. Herausnehmen.",
      "Zwiebeln, Knoblauch und Ingwer hacken und im Bratfett etwa 5 Minuten andünsten. Tomatenpüree kurz mitrösten, dann Tomaten, Bouillon, die ganze Chilischote und das Fleisch dazugeben. Zugedeckt etwa 1 Stunde schmoren.",
      "Erdnussbutter mit einer Kelle Schmorflüssigkeit glatt rühren und in den Topf geben. Rüebli und Süsskartoffeln schälen, in grosse Stücke schneiden und dazugeben. Weitere 30–40 Minuten schmoren, bis Fleisch und Gemüse weich sind; ab und zu umrühren, damit nichts ansetzt.",
      "Inzwischen Langkornreis nach Packungsangabe kochen. Chilischote herausnehmen, Maafe mit Salz und Pfeffer abschmecken und mit gehackten Erdnüssen bestreuen. Mit dem Reis servieren."]
  },
  {
    id: "idee-bobotie", title: "Bobotie", kitchen: "afrika", emoji: "teller", cat: "main", tags: ["kids", "prep"], time: 75, serves: 4,
    note: "Südafrikanischer Hackfleischauflauf mit Curry, Aprikosen und goldenem Eierguss, eine Spezialität der Kapmalaien. Traditionell mit gelbem Reis mit Rosinen und einem Klecks Chutney serviert.",
    ingr: ["2 Scheiben Toastbrot", "3 dl Milch", "2 Zwiebeln", "2 Knoblauchzehen", "2 EL Öl", "600 g Hackfleisch (Rind oder Lamm)", "2 EL Currypulver, mild", "1 TL Kurkuma",
      "60 g getrocknete Aprikosen", "3 EL Mango-Chutney", "1 Zitrone", "2 Eier", "4 Lorbeerblätter", "300 g Basmatireis", "40 g Rosinen", "Salz, Pfeffer"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Toastbrot in 1 dl Milch einweichen. Zwiebeln und Knoblauch hacken und im Öl etwa 5 Minuten andünsten.",
      "Hackfleisch dazugeben und krümelig braten. Currypulver und ½ TL Kurkuma kurz mitrösten. Aprikosen klein schneiden und mit dem ausgedrückten Toastbrot, 2 EL Mango-Chutney und dem Saft einer halben Zitrone unterrühren. Mit Salz und Pfeffer würzen.",
      "Masse in eine gefettete Gratinform füllen und glatt streichen. Eier mit der restlichen Milch und etwas Salz verquirlen, darübergiessen und die Lorbeerblätter hineinstecken.",
      "In der Ofenmitte 35–40 Minuten backen, bis der Guss gestockt und goldbraun ist.",
      "Inzwischen Basmatireis mit dem restlichen Kurkuma, den Rosinen und Salz nach Packungsangabe kochen. Bobotie mit dem gelben Reis und dem restlichen Chutney servieren."]
  },
  {
    id: "idee-poulet-yassa", title: "Poulet Yassa mit Zitronen-Zwiebeln", kitchen: "afrika", emoji: "poulet", cat: "main", tags: ["cheap"], time: 95, serves: 4,
    note: "Senegalesischer Klassiker: Poulet in einer Sauce aus viel langsam geschmorten Zwiebeln, Zitrone und Senf. Über Nacht in der Zitronen-Zwiebel-Marinade wird es besonders aromatisch. Dazu gehört Reis.",
    ingr: ["8 Pouletoberschenkel mit Haut und Knochen (ca. 1.2 kg)", "4 grosse Zwiebeln (ca. 800 g)", "3 Zitronen", "3 Knoblauchzehen", "2 EL Dijon-Senf", "3 EL Öl",
      "2 dl Pouletbouillon", "2 Lorbeerblätter", "1 rote Chilischote", "50 g grüne Oliven", "300 g Langkornreis", "Salz, Pfeffer"],
    steps: ["Zwiebeln in feine Ringe schneiden. Saft von 2½ Zitronen, gepressten Knoblauch, Senf, 1 TL Salz und Pfeffer verrühren und mit Poulet und Zwiebeln mischen. Mindestens 30 Minuten marinieren.",
      "Poulet aus der Marinade nehmen, abtupfen und in 1 EL Öl in einem Schmortopf auf der Hautseite etwa 8 Minuten goldbraun braten, wenden und herausnehmen.",
      "Zwiebeln aus der Marinade heben und im restlichen Öl bei mittlerer Hitze etwa 15 Minuten weich und hellbraun schmoren.",
      "Marinade, Bouillon, Lorbeerblätter, die ganze Chilischote und Oliven dazugeben. Poulet mit der Haut nach oben darauflegen und zugedeckt etwa 30 Minuten schmoren, bis es zart ist.",
      "Inzwischen Langkornreis nach Packungsangabe kochen. Sauce mit Salz und dem Saft der restlichen Zitrone abschmecken und alles mit dem Reis servieren."]
  },
  {
    id: "idee-thieboudienne", title: "Thieboudienne (senegalesischer Fisch mit Reis)", kitchen: "afrika", emoji: "fisch", cat: "main", tags: ["guests"], time: 80, serves: 4,
    note: "Senegals Nationalgericht: Fisch mit Kräuter-Chili-Füllung, in Tomatensauce mit Gemüse gegart; im Sud wird danach der Reis gekocht. Statt ganzer Fische gehen dicke Fischtranchen. Typisch ist Bruchreis aus dem Afro-Shop, Langkornreis geht auch.",
    ingr: ["1 Bund Petersilie", "4 Knoblauchzehen", "1 rote Chilischote", "4 Fischtranchen (z. B. Kabeljau oder Wolfsbarsch, je ca. 180 g)", "4 EL Öl", "2 Zwiebeln",
      "3 EL Tomatenpüree", "1 Dose gehackte Tomaten (400 g)", "1 l Fischfond oder Wasser", "2 Rüebli", "1 Süsskartoffel (ca. 300 g)", "1 Aubergine",
      "300 g Weisskabis", "300 g Langkornreis oder Bruchreis", "1 Limette", "Salz, Pfeffer"],
    steps: ["Petersilie, 3 Knoblauchzehen, Chilischote und ½ TL Salz im Cutter zu einer groben Paste hacken. Fischtranchen auf beiden Seiten zwei- bis dreimal einschneiden und die Paste in die Schnitte drücken.",
      "Öl in einem grossen, weiten Topf erhitzen und den Fisch pro Seite 2 Minuten anbraten, herausnehmen. Zwiebeln und restlichen Knoblauch hacken und im Bratöl etwa 5 Minuten dünsten. Tomatenpüree kurz mitrösten.",
      "Gehackte Tomaten und Fischfond dazugeben, mit Salz und Pfeffer würzen. Rüebli, Süsskartoffel und Aubergine in grosse Stücke, Weisskabis in Schnitze schneiden, dazugeben und etwa 20 Minuten köcheln. Fisch dazulegen und weitere 10 Minuten ziehen lassen.",
      "Fisch und Gemüse mit einer Schaumkelle herausheben und zugedeckt warm halten. Vom Sud 6 dl abmessen und zurück in den Topf geben, den Rest als Sauce beiseitestellen.",
      "Langkornreis spülen, in den Sud geben, aufkochen und zugedeckt bei kleiner Hitze etwa 20 Minuten garen, bis er die Flüssigkeit aufgenommen hat; am Boden darf er leicht ansetzen.",
      "Reis auf einer grossen Platte anrichten, Fisch und Gemüse darauf verteilen und mit Limettenschnitzen und der restlichen Sauce servieren."]
  },
  {
    id: "idee-sukuma-wiki-ugali", title: "Sukuma Wiki mit Ugali", kitchen: "afrika", emoji: "gemuese", cat: "main", tags: ["vegan", "vegi", "cheap"], time: 35, serves: 4,
    note: "Alltagsessen aus Kenia: Federkohl mit Tomaten und Zwiebeln, dazu Ugali, ein fester Maisbrei. Statt weissem Maismehl geht feine Polenta. Ugali formt man mit der Hand zu Bällchen und tunkt es ins Gemüse. Dazu passen Bohnen.",
    ingr: ["500 g Federkohl oder Krautstiel", "2 Zwiebeln", "2 Knoblauchzehen", "3 Tomaten", "1 grüne Chilischote", "8 dl Wasser", "250 g feine Polenta oder weisses Maismehl",
      "3 EL Öl", "1 dl Gemüsebouillon", "1 Zitrone", "Salz, Pfeffer"],
    steps: ["Federkohl waschen, dicke Stiele entfernen und die Blätter in feine Streifen schneiden. Zwiebeln und Knoblauch hacken, Tomaten würfeln, Chilischote fein schneiden.",
      "Für das Ugali Wasser mit 1 TL Salz aufkochen. Polenta unter ständigem Rühren einrieseln lassen und bei kleiner Hitze mit einer Holzkelle kräftig rühren, 10–15 Minuten, bis ein fester Brei entsteht, der sich vom Topfrand löst.",
      "Ugali in eine geölte Schüssel drücken, auf einen Teller stürzen und zugedeckt warm halten.",
      "Zwiebeln im Öl etwa 5 Minuten goldgelb dünsten. Knoblauch, Chilischote und Tomaten dazugeben und 3–4 Minuten köcheln, bis die Tomaten zerfallen.",
      "Federkohl und Bouillon dazugeben und zugedeckt 6–8 Minuten garen, bis der Kohl weich, aber noch grün ist. Mit Salz, Pfeffer und Zitronensaft abschmecken und mit dem Ugali servieren."]
  },
  {
    id: "idee-bunny-chow-lamm", title: "Bunny Chow mit Lamm-Curry", kitchen: "afrika", emoji: "brot", cat: "main", tags: ["guests"], time: 110, serves: 4,
    note: "Streetfood aus Durban (Südafrika): ein ausgehöhltes Brot, gefüllt mit kräftigem Curry; das herausgelöste Brotinnere dient zum Tunken. Vegane Variante mit Kidneybohnen statt Lamm, dann genügen 20 Minuten Kochzeit.",
    ingr: ["700 g Lammschulter, in Würfeln (oder Lammragout)", "2 EL Öl", "2 Zwiebeln", "3 Knoblauchzehen", "1 Stück Ingwer (3 cm)", "1 Zimtstange", "4 Kardamomkapseln",
      "2 EL Currypulver, scharf", "1 TL Kurkuma", "1 Dose gehackte Tomaten (400 g)", "4 dl Wasser", "2 Kartoffeln, festkochend", "1 Bund Koriander",
      "2 Pfünderli (Weissbrot, je ca. 500 g)", "Salz"],
    steps: ["Zwiebeln, Knoblauch und Ingwer hacken. Lammschulter salzen und im Öl in einem Schmortopf portionenweise rundum anbraten. Herausnehmen.",
      "Zwiebeln im Bratfett etwa 6 Minuten goldbraun dünsten. Knoblauch, Ingwer, Zimtstange, angedrückte Kardamomkapseln, Currypulver und Kurkuma 1 Minute mitrösten.",
      "Tomaten, Wasser und Fleisch dazugeben, aufkochen und zugedeckt bei kleiner Hitze etwa 1 Stunde schmoren.",
      "Kartoffeln schälen, würfeln und dazugeben. Offen weitere 25 Minuten köcheln, bis Fleisch und Kartoffeln weich sind und das Curry dick ist. Mit Salz abschmecken, Koriander hacken und daruntermischen.",
      "Pfünderli quer halbieren und das Innere so herauslösen, dass ein etwa 1 cm dicker Rand bleibt. Curry einfüllen, das Brotinnere obenauf setzen und sofort servieren."]
  },
  {
    id: "idee-misir-wot", title: "Misir Wot (äthiopische rote Linsen)", kitchen: "afrika", emoji: "curry", cat: "main", tags: ["vegan", "vegi", "cheap", "prep"], time: 45, serves: 4,
    note: "Äthiopisches Linsengericht mit der Gewürzmischung Berbere (Afro-Shop, online). Ersatz für 2 EL Berbere: 1 EL Paprikapulver, 1 TL Chilipulver, je ½ TL Ingwerpulver, Kardamom und Zimt. Dazu isst man Injera-Fladen; Fladenbrot oder Reis gehen auch.",
    ingr: ["300 g rote Linsen", "3 Zwiebeln", "3 Knoblauchzehen", "1 Stück Ingwer (3 cm)", "4 EL Öl", "2 EL Tomatenpüree", "2 EL Berbere", "8 dl Gemüsebouillon",
      "1 Zitrone", "Salz", "Fladenbrot oder Reis zum Servieren"],
    steps: ["Linsen in einem Sieb spülen, bis das Wasser klar abläuft. Zwiebeln sehr fein hacken, Knoblauch und Ingwer fein reiben.",
      "Zwiebeln ohne Fett in einem Topf bei mittlerer Hitze unter Rühren etwa 8 Minuten dünsten, bis sie weich sind und Farbe annehmen. Dann das Öl dazugeben und weitere 5 Minuten braten.",
      "Knoblauch, Ingwer, Tomatenpüree und Berbere dazugeben und 2 Minuten unter Rühren rösten, bis es duftet.",
      "Linsen und Bouillon dazugeben und offen etwa 25 Minuten köcheln, bis die Linsen zerfallen und ein dicker Eintopf entsteht. Gelegentlich umrühren und bei Bedarf etwas Wasser nachgiessen.",
      "Mit Salz und Zitronensaft abschmecken und mit Fladenbrot oder Reis servieren."]
  },

  /* ---------- Türkei & Persien ---------- */
  {
    id: "idee-lahmacun", title: "Lahmacun (türkische Fladenpizza)", kitchen: "levante", emoji: "pizza", cat: "main", tags: ["kids", "guests"], time: 50, serves: 4,
    note: "Hauchdünne Fladen mit würzigem Hackfleisch, gerollt mit Petersilie, Zwiebeln und Zitrone. Fertiger Pizzateig aus dem Kühlregal spart Zeit. Pul Biber (türkische Chiliflocken) gibt es im türkischen Laden, sonst Chiliflocken nehmen.",
    ingr: ["2 Pizzateige, rechteckig ausgewallt (Kühlregal)", "1 Zwiebel", "1 rote Peperoni", "2 Tomaten", "2 Knoblauchzehen", "300 g Hackfleisch (Lamm oder Rind)",
      "2 EL Tomatenpüree", "1 TL Paprikapulver", "1 TL Pul Biber oder ½ TL Chiliflocken", "½ TL Kreuzkümmel", "1 EL Olivenöl", "1 Bund Petersilie", "1 rote Zwiebel",
      "2 Zitronen", "Salz, Pfeffer"],
    steps: ["Ofen auf 250 °C vorheizen (Umluft 230 °C) und dabei ein Blech mit aufheizen. Zwiebel, Peperoni, Tomaten und Knoblauch grob schneiden und im Cutter fein hacken, aber nicht pürieren.",
      "Gemüse mit Hackfleisch, Tomatenpüree, Paprikapulver, Pul Biber, Kreuzkümmel, Olivenöl, ¾ TL Salz und Pfeffer gut verkneten. Ein Viertel der Petersilie fein hacken und daruntermischen.",
      "Pizzateige je in zwei Stücke schneiden und auf Backpapier legen. Die Fleischmasse hauchdünn bis an den Rand verstreichen.",
      "Jeweils zwei Fladen mit dem Backpapier auf das heisse Blech ziehen und im unteren Teil des Ofens 8–10 Minuten backen, bis der Rand knusprig ist. Die übrigen gleich backen.",
      "Rote Zwiebel in feine Ringe schneiden, restliche Petersilie zupfen, Zitronen in Schnitze schneiden. Lahmacun damit belegen, mit Zitronensaft beträufeln, aufrollen und essen."]
  },
  {
    id: "idee-izmir-koefte", title: "Izmir-Köfte aus dem Ofen", kitchen: "levante", emoji: "fleisch", cat: "main", tags: ["kids", "prep"], time: 75, serves: 4,
    note: "Aus Izmir: Hackfleischröllchen, Kartoffeln, Peperoni und Tomaten, im Ofen in Tomatensauce geschmort. Ein unkompliziertes Familienessen, das sich gut vorbereiten lässt. Dazu Joghurt und Brot oder Reis.",
    ingr: ["500 g Hackfleisch (Rind oder Rind und Lamm)", "1 Zwiebel", "2 Knoblauchzehen", "½ Bund Petersilie", "1 Ei", "3 EL Paniermehl", "1 TL Kreuzkümmel",
      "1 TL Paprikapulver", "600 g Kartoffeln, festkochend", "4 EL Olivenöl", "2 grüne Peperoni", "2 Tomaten", "2 EL Tomatenpüree", "3 dl Wasser",
      "200 g griechischer Joghurt", "Salz, Pfeffer"],
    steps: ["Ofen auf 200 °C vorheizen (Umluft 180 °C). Zwiebel fein reiben, Knoblauch pressen, Petersilie hacken. Mit Hackfleisch, Ei, Paniermehl, Kreuzkümmel, Paprikapulver, 1 TL Salz und Pfeffer verkneten und zu etwa 16 länglichen Röllchen formen.",
      "Kartoffeln schälen, in dicke Scheiben schneiden, mit 2 EL Olivenöl und Salz mischen und in einer grossen Gratinform 15 Minuten vorbacken.",
      "Inzwischen die Köfte in 1 EL Olivenöl in einer Bratpfanne rundum 4–5 Minuten anbraten.",
      "Peperoni in breite Streifen, Tomaten in Scheiben schneiden. Köfte, Peperoni und Tomaten zwischen die Kartoffeln in die Form stecken. Tomatenpüree mit Wasser, restlichem Olivenöl und Salz verrühren und darübergiessen.",
      "Mit Alufolie zugedeckt 20 Minuten backen, dann offen weitere 20 Minuten, bis die Kartoffeln weich sind. Mit Joghurt servieren."]
  },
  {
    id: "idee-mercimek-corbasi", title: "Mercimek Çorbası (türkische Linsensuppe)", kitchen: "levante", emoji: "suppe", cat: "soup", tags: ["vegan", "vegi", "cheap", "prep"], time: 35, serves: 4,
    note: "Die türkische Alltagssuppe schlechthin: rote Linsen, Rüebli und Kartoffel, fein püriert und mit Minz-Paprika-Öl beträufelt. Mit einem Spritzer Zitrone servieren. Hält sich im Kühlschrank drei Tage.",
    ingr: ["250 g rote Linsen", "1 Zwiebel", "1 Rüebli", "1 Kartoffel, mehligkochend", "2 Knoblauchzehen", "4 EL Olivenöl", "1 EL Tomatenpüree", "1 TL Kreuzkümmel",
      "1.2 l Gemüsebouillon", "1 TL getrocknete Minze", "1 TL Paprikapulver", "½ TL Pul Biber oder Chiliflocken", "1 Zitrone", "Salz"],
    steps: ["Zwiebel, Rüebli, Kartoffel und Knoblauch klein schneiden. Linsen in einem Sieb spülen, bis das Wasser klar ist.",
      "2 EL Olivenöl in einem Topf erhitzen und das Gemüse etwa 5 Minuten andünsten. Tomatenpüree und Kreuzkümmel kurz mitrösten.",
      "Linsen und Bouillon dazugeben, aufkochen und halb zugedeckt etwa 20 Minuten köcheln, bis Linsen und Gemüse ganz weich sind. Fein pürieren und mit Salz abschmecken.",
      "Restliches Olivenöl in einem Pfännchen erwärmen, vom Herd ziehen und Minze, Paprikapulver und Pul Biber einrühren. Suppe mit dem Gewürzöl beträufeln und mit Zitronenschnitzen servieren."]
  },
  {
    id: "idee-imam-bayildi", title: "Imam Bayildi (gefüllte Auberginen)", kitchen: "levante", emoji: "gemuese", cat: "main", tags: ["vegan", "vegi", "guests", "prep"], time: 80, serves: 4,
    note: "«Der Imam fiel in Ohnmacht» – angeblich vor Begeisterung: Auberginen, in Olivenöl gebraten und mit Zwiebeln und Tomaten geschmort. Schmeckt lauwarm oder kalt am besten und lässt sich gut am Vortag zubereiten.",
    ingr: ["4 Auberginen, mittelgross", "8 EL Olivenöl", "3 Zwiebeln", "4 Knoblauchzehen", "2 grüne Peperoni", "4 Tomaten", "1 EL Tomatenpüree", "1 TL Zucker",
      "1 Bund Petersilie", "1 dl Wasser", "1 Zitrone", "Salz, Pfeffer", "Fladenbrot zum Servieren"],
    steps: ["Auberginen streifenweise schälen und auf einer Seite längs tief einschneiden, ohne sie zu halbieren. Rundum salzen, 20 Minuten ziehen lassen und trocken tupfen.",
      "4 EL Olivenöl in einer Bratpfanne erhitzen und die Auberginen rundum 8–10 Minuten braten, bis sie weich und goldbraun sind. Mit dem Schnitt nach oben nebeneinander in eine Gratinform legen.",
      "Ofen auf 180 °C vorheizen (Umluft 160 °C). Zwiebeln in feine Streifen schneiden, Knoblauch hacken, Peperoni und Tomaten würfeln. Zwiebeln im restlichen Olivenöl etwa 10 Minuten weich dünsten, Knoblauch, Peperoni, Tomaten, Tomatenpüree und Zucker dazugeben und 5 Minuten köcheln. Petersilie hacken, unterrühren und mit Salz und Pfeffer würzen.",
      "Auberginen am Schnitt auseinanderdrücken und die Füllung hineingeben. Wasser und den Saft einer halben Zitrone in die Form giessen.",
      "Zugedeckt in der Ofenmitte etwa 35 Minuten backen. Lauwarm oder kalt mit Zitronenschnitzen und Fladenbrot servieren."]
  },
  {
    id: "idee-manti-joghurt", title: "Manti mit Joghurt und Paprikabutter", kitchen: "levante", emoji: "pasta", cat: "main", tags: ["guests"], time: 60, serves: 4,
    note: "Türkische Teigtäschchen mit Hackfleisch unter Knoblauchjoghurt und roter Butter. Diese vereinfachte Fassung nimmt Wan-Tan-Teigblätter (Asia-Laden, tiefgekühlt) statt selbst ausgewalltem Teig. Den Joghurt nicht kalt servieren.",
    ingr: ["40 Wan-Tan-Teigblätter (ca. 8 × 8 cm, tiefgekühlt)", "1 Zwiebel", "½ Bund Petersilie", "300 g Hackfleisch (Lamm oder Rind)", "500 g griechischer Joghurt",
      "2 Knoblauchzehen", "50 g Butter", "1 EL Tomatenpüree", "2 TL Paprikapulver", "1 TL Pul Biber oder Chiliflocken", "1 TL getrocknete Minze", "Salz, Pfeffer"],
    steps: ["Wan-Tan-Teigblätter auftauen lassen und unter einem feuchten Tuch bereithalten. Zwiebel sehr fein reiben, Petersilie fein hacken und beides mit dem Hackfleisch, ¾ TL Salz und Pfeffer verkneten.",
      "Je einen knappen Teelöffel Füllung in die Mitte eines Teigblatts setzen, die Ränder mit Wasser befeuchten und die vier Ecken über der Füllung zu einem Päckchen zusammendrücken.",
      "Joghurt mit gepresstem Knoblauch und einer Prise Salz verrühren und bei Zimmertemperatur stehen lassen.",
      "Manti portionenweise in reichlich siedendem Salzwasser 4–5 Minuten garen, bis die Füllung durch ist. Mit einer Schaumkelle herausheben und gut abtropfen lassen.",
      "Butter in einem Pfännchen schmelzen, Tomatenpüree, Paprikapulver und Pul Biber einrühren und kurz aufschäumen lassen. Manti auf Teller verteilen, Knoblauchjoghurt darübergeben, mit der roten Butter beträufeln und mit Minze bestreuen."]
  },
  {
    id: "idee-fesenjan", title: "Fesenjan (Granatapfel-Walnuss-Poulet)", kitchen: "levante", emoji: "eintopf", cat: "main", tags: ["guests"], time: 90, serves: 4,
    note: "Persischer Festtagseintopf: Poulet in einer dunklen, süss-sauren Sauce aus gerösteten Baumnüssen und Granatapfelsirup. Granatapfelsirup gibt es bei Coop oder im türkischen Laden. Dazu passt Safranreis oder Tahdig.",
    ingr: ["250 g Baumnüsse", "800 g Pouletoberschenkel ohne Haut und Knochen", "2 Zwiebeln", "2 EL Öl", "½ TL Kurkuma", "½ TL Zimt", "5 dl Pouletbouillon",
      "1 dl Granatapfelsirup", "1–2 EL Zucker", "300 g Basmatireis", "1 Granatapfel", "Salz, Pfeffer"],
    steps: ["Baumnüsse in einer trockenen Pfanne bei mittlerer Hitze 5–6 Minuten rösten, bis sie duften. Abkühlen lassen und im Cutter sehr fein mahlen.",
      "Zwiebeln fein hacken. Poulet in grosse Stücke schneiden, mit Salz und Pfeffer würzen und im Öl in einem Schmortopf rundum anbraten. Zwiebeln dazugeben und etwa 5 Minuten mitdünsten, Kurkuma und Zimt kurz mitrösten.",
      "Gemahlene Baumnüsse und Bouillon dazugeben und zugedeckt bei kleiner Hitze etwa 30 Minuten köcheln, dabei öfters umrühren.",
      "Granatapfelsirup und Zucker einrühren und offen weitere 20–30 Minuten köcheln, bis die Sauce dick und dunkelbraun ist. Abschmecken: Sie soll ausgewogen süss-sauer sein.",
      "Inzwischen Basmatireis kochen und die Kerne aus dem Granatapfel lösen. Fesenjan mit den Granatapfelkernen bestreuen und mit dem Reis servieren."]
  },
  {
    id: "idee-ghormeh-sabzi", title: "Ghormeh Sabzi (persischer Kräutereintopf)", kitchen: "levante", emoji: "eintopf", cat: "main", tags: ["guests", "prep"], time: 125, serves: 4,
    note: "Irans Nationalgericht: Lamm mit vielen gebratenen Kräutern, Kidneybohnen und getrockneten Limetten. Diese gibt es im persischen oder türkischen Laden; Ersatz: Saft und Schale einer Limette am Schluss. Schmeckt am nächsten Tag noch besser.",
    ingr: ["2 Zwiebeln", "4 EL Öl", "600 g Lammschulter oder Rindsragout, in Würfeln", "1 TL Kurkuma", "6 dl Wasser", "2 Bund Petersilie", "2 Bund Koriander",
      "1 Bund Schnittlauch", "200 g Blattspinat", "2 EL getrocknete Bockshornkleeblätter oder 1 TL Bockshornkleesamen", "4 getrocknete Limetten",
      "1 Dose Kidneybohnen (400 g)", "300 g Basmatireis", "Salz, Pfeffer"],
    steps: ["Zwiebeln fein hacken und in 2 EL Öl in einem Schmortopf etwa 8 Minuten goldbraun dünsten. Lammschulter oder Rindsragout und Kurkuma dazugeben und rundum anbraten.",
      "Wasser dazugiessen, salzen und zugedeckt bei kleiner Hitze etwa 1 Stunde schmoren.",
      "Inzwischen Petersilie, Koriander, Schnittlauch und Spinat sehr fein hacken. Im restlichen Öl in einer Bratpfanne bei mittlerer Hitze unter Rühren 15–20 Minuten braten, bis die Kräuter dunkelgrün sind und intensiv duften. Bockshornklee zum Schluss kurz mitbraten.",
      "Getrocknete Limetten mit einer Gabel mehrmals einstechen. Mit den Kräutern und den abgespülten Kidneybohnen zum Fleisch geben und weitere 45 Minuten schmoren, bis das Fleisch sehr zart ist.",
      "Inzwischen Basmatireis kochen. Limetten nach Belieben herausnehmen, Eintopf mit Salz und Pfeffer abschmecken und mit dem Reis servieren."]
  },
  {
    id: "idee-tahdig", title: "Tahdig (persischer Krustenreis)", kitchen: "levante", emoji: "reis", cat: "main", tags: ["vegi", "guests"], time: 95, serves: 4,
    note: "Der Stolz der persischen Küche: Safranreis mit goldener, knuspriger Kruste, die beim Stürzen ganz bleiben soll. Wichtig ist eine gute beschichtete Pfanne mit Deckel. Passt zu Fesenjan und Ghormeh Sabzi oder einfach mit Joghurt und Salat.",
    ingr: ["400 g Basmatireis", "1 Briefchen Safran (0.125 g)", "2 EL heisses Wasser", "150 g Joghurt nature", "1 Eigelb", "60 g Butter", "3 EL Öl", "Salz"],
    steps: ["Basmatireis in mehreren Wassern spülen, bis das Wasser klar ist, dann 30 Minuten in kaltem Salzwasser einweichen. Safran zerreiben und in 2 EL heissem Wasser ziehen lassen.",
      "In einem grossen Topf reichlich Wasser mit 2 EL Salz aufkochen. Reis abgiessen, hineingeben und 5–6 Minuten sprudelnd kochen, bis er aussen weich und innen noch fest ist. Abgiessen und kurz kalt abspülen.",
      "Joghurt, Eigelb, die Hälfte des Safranwassers und 4 EL vom Reis verrühren. Öl und die Hälfte der Butter in einer beschichteten Pfanne (ca. 24 cm) erhitzen und die Joghurtmasse darin glatt verstreichen.",
      "Restlichen Reis locker zu einem Berg daraufhäufen und mit einem Kochlöffelstiel ein paar Löcher bis zum Boden stechen. Restliche Butter schmelzen und mit dem übrigen Safranwasser darüberträufeln.",
      "Deckel in ein Küchentuch wickeln und fest aufsetzen. Bei mittlerer Hitze 10 Minuten anbraten, dann bei kleiner Hitze 35–40 Minuten garen, bis sich am Boden eine goldene Kruste gebildet hat.",
      "Pfanne kurz in kaltes Wasser stellen, einen grossen Teller darauflegen und den Tahdig mit Schwung stürzen. Kruste in Stücke brechen und mit dem Reis servieren."]
  },
  {
    id: "idee-kuku-sabzi", title: "Kuku Sabzi (persisches Kräuteromelett)", kitchen: "levante", emoji: "ei", cat: "main", tags: ["vegi"], time: 40, serves: 4,
    note: "Persisches Kräuteromelett, so grün, dass man das Ei kaum sieht; zum Neujahrsfest Nowruz ein Muss. Schmeckt warm oder kalt. Berberitzen gibt es im persischen Laden; getrocknete Cranberries sind ein guter Ersatz.",
    ingr: ["2 Bund Petersilie", "2 Bund Koriander", "1 Bund Dill", "4 Frühlingszwiebeln", "30 g Baumnüsse", "6 Eier", "1 TL Backpulver", "1 TL Kurkuma",
      "2 EL Berberitzen oder getrocknete Cranberries", "4 EL Olivenöl", "200 g griechischer Joghurt", "Salz, Pfeffer", "Fladenbrot zum Servieren"],
    steps: ["Petersilie, Koriander und Dill waschen, gut trocken schleudern und samt zarten Stielen sehr fein hacken. Frühlingszwiebeln in feine Ringe schneiden, Baumnüsse grob hacken.",
      "Eier mit Backpulver, Kurkuma, 1 TL Salz und Pfeffer verquirlen. Kräuter, Frühlingszwiebeln, Baumnüsse und Berberitzen unterrühren; die Masse soll mehr grün als gelb sein.",
      "Olivenöl in einer beschichteten Bratpfanne (ca. 24 cm) erhitzen, die Masse hineingiessen und glatt streichen. Zugedeckt bei kleiner Hitze 12–15 Minuten stocken lassen.",
      "Kuku in Viertel schneiden, vorsichtig wenden und weitere 5 Minuten braten.",
      "Warm oder kalt mit Joghurt und Fladenbrot servieren."]
  },
  {
    id: "idee-shirazi-salat", title: "Shirazi-Salat", kitchen: "levante", emoji: "salat", cat: "salad", tags: ["vegan", "vegi", "quick", "cheap"], time: 15, serves: 4,
    note: "Erfrischender persischer Salat aus der Stadt Shiraz: alles ganz klein gewürfelt, mit Limette und getrockneter Minze. Passt zu jedem Reisgericht und zu Grilliertem. Erst kurz vor dem Servieren mischen, sonst wird er wässrig.",
    ingr: ["1 Gurke", "4 Tomaten", "1 rote Zwiebel", "2 Limetten", "2 EL Olivenöl", "1 TL getrocknete Minze", "½ Bund frische Minze", "Salz, Pfeffer"],
    steps: ["Gurke, Tomaten und Zwiebel in sehr kleine, gleichmässige Würfel von etwa 5 mm schneiden. Bei sehr saftigen Tomaten vorher die Kerne entfernen.",
      "Limettensaft, Olivenöl und getrocknete Minze verrühren. Frische Minze fein schneiden.",
      "Kurz vor dem Servieren das Gemüse mit dem Dressing und der frischen Minze mischen, mit Salz und Pfeffer abschmecken und 5 Minuten ziehen lassen."]
  },
  {
    id: "idee-pide-kaese-ei", title: "Pide mit Käse, Tomaten und Ei", kitchen: "levante", emoji: "fladen", cat: "main", tags: ["vegi", "kids"], time: 110, serves: 4,
    note: "Türkisches Schiffchenbrot mit offener Käsefüllung und einem Ei in der Mitte. Der Teig kann auch am Vorabend gemacht werden und über Nacht im Kühlschrank aufgehen. Statt Mozzarella passt türkischer Kaşar-Käse.",
    ingr: ["400 g Weissmehl", "1 TL Salz", "1 TL Zucker", "½ Würfel Hefe (21 g)", "2.5 dl lauwarmes Wasser", "2 EL Olivenöl", "2 Tomaten", "1 grüne Peperoni",
      "200 g Mozzarella, gerieben", "150 g Feta", "½ TL Chiliflocken", "4 Eier", "Pfeffer"],
    steps: ["Weissmehl, Salz und Zucker mischen. Hefe im lauwarmen Wasser auflösen, mit dem Olivenöl dazugeben und etwa 8 Minuten zu einem weichen, glatten Teig kneten. Zugedeckt etwa 1 Stunde aufs Doppelte aufgehen lassen.",
      "Tomaten entkernen und klein würfeln, Peperoni fein würfeln. Mit Mozzarella, zerbröckeltem Feta, Chiliflocken und Pfeffer mischen.",
      "Ofen auf 240 °C vorheizen (Umluft 220 °C). Teig in 4 Stücke teilen und jedes auf Backpapier zu einem länglichen Oval von etwa 30 × 12 cm auswallen.",
      "Füllung in die Mitte geben, die Längsränder etwas darüber einschlagen und die Enden zu Spitzen zusammendrücken, sodass ein Schiffchen entsteht.",
      "Auf zwei Bleche verteilen und nacheinander etwa 8 Minuten backen. Dann die Eier einzeln aufschlagen, je eines in die Mitte einer Pide gleiten lassen und weitere 4–5 Minuten backen, bis das Eiweiss gestockt ist."]
  },
  {
    id: "idee-balik-ekmek", title: "Balık Ekmek (Istanbuler Fischbrot)", kitchen: "levante", emoji: "sandwich", cat: "main", tags: ["quick"], time: 25, serves: 4,
    note: "Das Fischbrot vom Bosporus: gebratene Makrele mit Zwiebeln, Salat und Zitrone im knusprigen Brot. Makrelenfilets gibt es an der Fischtheke von Migros und Coop; Forelle geht auch. Sumach bekommt man bei Coop oder im türkischen Laden.",
    ingr: ["4 Fischfilets mit Haut (Makrele, je ca. 100 g)", "1 rote Zwiebel", "½ Bund Petersilie", "1 TL Sumach", "2 Tomaten", "4 Salatblätter (z. B. Eisberg)",
      "1 TL Paprikapulver", "1 TL Pul Biber oder Chiliflocken", "2 EL Olivenöl", "2 Baguettes", "1 Zitrone", "Salz, Pfeffer"],
    steps: ["Rote Zwiebel in feine Ringe schneiden, mit gehackter Petersilie, Sumach und einer Prise Salz mischen und leicht durchkneten. Tomaten in Scheiben, Salatblätter in Streifen schneiden.",
      "Fischfilets trocken tupfen und mit Salz, Paprikapulver und Pul Biber würzen. Olivenöl in einer Bratpfanne erhitzen und die Filets zuerst auf der Hautseite 3 Minuten, dann auf der anderen Seite 1–2 Minuten braten.",
      "Baguettes in je zwei Stücke schneiden, längs aufschneiden und mit der Schnittfläche kurz im Bratfett rösten. Mit Salat, Tomaten, je einem Fischfilet und den Zwiebeln füllen und mit Zitronensaft beträufeln."]
  },

  /* ---------- USA & Kanada ---------- */
  {
    id: "idee-poutine-pilzsauce", title: "Poutine mit Pilzsauce", kitchen: "amerika", emoji: "kartoffel", cat: "main", tags: ["vegi", "kids"], time: 60, serves: 4,
    note: "Kanadas Kultgericht aus Québec: knusprige Pommes frites mit Käsestückchen und heisser brauner Sauce. Die typischen «Cheese Curds» gibt es hier kaum; zerzupfte Mini-Mozzarella kommt nah heran. Im Original gibt es Bratensauce statt Pilzsauce.",
    ingr: ["1 kg Kartoffeln, mehligkochend", "4 EL Öl", "250 g Champignons", "1 Zwiebel", "2 Knoblauchzehen", "30 g Butter", "5 dl Gemüsebouillon", "2 EL Sojasauce",
      "1 Zweig Thymian", "2 EL Maizena", "250 g Mini-Mozzarella", "Salz, Pfeffer"],
    steps: ["Ofen auf 220 °C vorheizen (Umluft 200 °C). Kartoffeln schälen, in 1 cm dicke Stäbchen schneiden, 10 Minuten in kaltes Wasser legen und gut trocken tupfen.",
      "Kartoffeln mit dem Öl und Salz mischen, auf zwei mit Backpapier belegten Blechen verteilen und 30–35 Minuten backen, bis sie goldbraun und knusprig sind; einmal wenden.",
      "Inzwischen Champignons in Scheiben schneiden, Zwiebel und Knoblauch fein hacken und in der Butter etwa 8 Minuten kräftig braten. Mit Bouillon, Sojasauce und Thymian aufkochen und etwa 5 Minuten köcheln.",
      "Maizena mit 3 EL kaltem Wasser anrühren, in die Sauce rühren und unter Rühren aufkochen, bis sie sämig ist. Thymianzweig entfernen, nach Belieben pürieren, mit Salz und Pfeffer abschmecken und heiss halten.",
      "Pommes frites auf Teller verteilen, Mini-Mozzarella darüberzupfen und mit der heissen Pilzsauce übergiessen, sodass der Käse leicht schmilzt. Sofort essen."]
  },
  {
    id: "idee-pulled-pork", title: "Pulled Pork mit Coleslaw im Brötchen", kitchen: "amerika", emoji: "sandwich", cat: "main", tags: ["kids", "guests", "prep"], time: 270, serves: 8,
    note: "Langsam im Ofen geschmorte Schweinsschulter, die man mit zwei Gabeln zerzupft. Am besten am Vortag mit der Gewürzmischung einreiben. Mit Coleslaw im Brötchen ein Fest für viele; Reste lassen sich gut einfrieren.",
    ingr: ["1.5 kg Schweinsschulter ohne Knochen", "2 EL brauner Zucker", "1 EL Paprikapulver, geräuchert", "1 TL Knoblauchpulver", "1 TL Kreuzkümmel", "½ TL Chilipulver",
      "2 dl Apfelsaft", "3 EL Apfelessig", "2 dl Barbecuesauce", "300 g Weisskabis", "2 Rüebli", "3 EL Mayonnaise", "2 EL Joghurt nature", "8 Burgerbrötchen", "Salz, Pfeffer"],
    steps: ["Ofen auf 150 °C vorheizen (Umluft 130 °C). Zucker, Paprikapulver, Knoblauchpulver, Kreuzkümmel, Chilipulver, 2 TL Salz und Pfeffer mischen und die Schweinsschulter rundum damit einreiben.",
      "Fleisch in einen Bräter legen, Apfelsaft und 2 EL Apfelessig dazugiessen und gut zudecken oder dicht mit Alufolie verschliessen. Etwa 4 Stunden schmoren, bis es sich mit einer Gabel mühelos zerzupfen lässt.",
      "Inzwischen für den Coleslaw Weisskabis fein hobeln und Rüebli raffeln. Mit Mayonnaise, Joghurt, dem restlichen Apfelessig, Salz und Pfeffer mischen und kühl stellen.",
      "Fleisch herausnehmen, mit zwei Gabeln zerzupfen und mit der Barbecuesauce und etwas Schmorflüssigkeit mischen.",
      "Burgerbrötchen halbieren und kurz rösten. Mit Pulled Pork und Coleslaw füllen."]
  },
  {
    id: "idee-smash-burger", title: "Smash Burger", kitchen: "amerika", emoji: "burger", cat: "main", tags: ["quick", "kids"], time: 25, serves: 4,
    note: "Hackfleischkugeln, in der sehr heissen Pfanne flach gedrückt, bekommen eine dunkle, knusprige Kruste – der Burgertrend aus den USA. Wichtig: Gusspfanne sehr heiss, Fleisch kalt und nicht zu mager (etwa 20 % Fett).",
    ingr: ["600 g Hackfleisch (Rind, nicht zu mager)", "3 EL Mayonnaise", "1 EL Ketchup", "1 TL Senf", "4 Essiggurken", "1 Zwiebel", "2 Tomaten", "4 Burgerbrötchen",
      "1 EL Butter", "8 Scheiben Cheddar", "4 Salatblätter", "Salz, Pfeffer"],
    steps: ["Hackfleisch zu acht gleich grossen Kugeln formen, ohne es zu kneten, und kühl stellen. Mayonnaise, Ketchup, Senf und eine gehackte Essiggurke zu einer Sauce verrühren.",
      "Zwiebel in sehr feine Ringe schneiden, Tomaten und restliche Essiggurken in Scheiben schneiden. Burgerbrötchen halbieren, mit Butter bestreichen und in der Pfanne goldbraun rösten.",
      "Eine Gusspfanne ohne Öl sehr stark erhitzen. Zwei bis drei Kugeln hineinlegen und mit einer stabilen Bratschaufel sofort etwa 1 cm flach drücken. Mit Salz und Pfeffer würzen und etwa 2 Minuten braten, bis eine dunkle Kruste entsteht.",
      "Wenden, je eine Scheibe Cheddar darauflegen und 1 Minute weiterbraten. Je zwei Patties übereinander auf die Brötchen setzen und mit Sauce, Salatblättern, Tomaten, Zwiebel und Essiggurken belegen."]
  },
  {
    id: "idee-shrimp-and-grits", title: "Shrimp and Grits (Crevetten mit Maisbrei)", kitchen: "amerika", emoji: "teller", cat: "main", tags: ["guests"], time: 40, serves: 4,
    note: "Klassiker aus den Südstaaten der USA: cremiger Käse-Maisbrei mit würzig gebratenen Crevetten und Speck. Statt Grits nimmt man bei uns mittelgrobe Polenta, aber nicht die Instant-Sorte.",
    ingr: ["8 dl Wasser", "3 dl Milch", "200 g Polenta, mittelgrob", "400 g rohe Crevetten, geschält", "1 TL Paprikapulver, geräuchert", "½ TL Cayennepfeffer",
      "2 Knoblauchzehen", "1 grüne Peperoni", "3 Frühlingszwiebeln", "100 g Speckwürfeli", "1 Zitrone", "30 g Butter", "100 g Cheddar, gerieben", "Salz, Pfeffer"],
    steps: ["Wasser und Milch mit 1 TL Salz aufkochen. Polenta unter Rühren einrieseln lassen und bei kleiner Hitze unter häufigem Rühren etwa 25 Minuten zu einem cremigen Brei köcheln. Wird er zu fest, etwas Wasser dazugeben.",
      "Inzwischen Crevetten trocken tupfen und mit Paprikapulver, Cayennepfeffer und Salz mischen. Knoblauch hacken, Peperoni fein würfeln, Frühlingszwiebeln in Ringe schneiden.",
      "Speckwürfeli in einer Bratpfanne ohne Fett 4–5 Minuten knusprig braten und herausnehmen. Peperoni und Knoblauch im Speckfett 2 Minuten andünsten.",
      "Crevetten dazugeben und pro Seite etwa 1 Minute braten, bis sie rosa sind. Speck wieder dazugeben, mit Zitronensaft beträufeln und die Frühlingszwiebeln untermischen.",
      "Butter und Cheddar unter die Polenta rühren und mit Pfeffer abschmecken. In tiefe Teller verteilen und die Crevetten mit dem Bratsaft darauf anrichten."]
  },
  {
    id: "idee-jambalaya", title: "Jambalaya mit Crevetten und Chorizo", kitchen: "amerika", emoji: "reis", cat: "main", tags: ["guests"], time: 45, serves: 4,
    note: "Würziges Reisgericht aus Louisiana mit Peperoni, Sellerie und Zwiebel, der «heiligen Dreifaltigkeit» der Cajun-Küche. Statt der typischen Andouille-Wurst passen Chorizo oder Rauchwürstli.",
    ingr: ["250 g Chorizo oder Rauchwurst", "2 EL Öl", "1 Zwiebel", "1 grüne Peperoni", "2 Stangen Stangensellerie", "3 Knoblauchzehen", "2 TL Paprikapulver, geräuchert",
      "1 TL Thymian, getrocknet", "½ TL Cayennepfeffer", "300 g Langkornreis", "1 Dose gehackte Tomaten (400 g)", "6 dl Pouletbouillon", "2 Lorbeerblätter",
      "300 g rohe Crevetten, geschält", "3 Frühlingszwiebeln", "Salz"],
    steps: ["Chorizo in Scheiben schneiden und in 1 EL Öl in einem weiten Topf etwa 4 Minuten anbraten. Herausnehmen.",
      "Zwiebel, Peperoni und Stangensellerie fein würfeln, Knoblauch hacken. Im restlichen Öl und dem Wurstfett etwa 6 Minuten dünsten. Paprikapulver, Thymian und Cayennepfeffer kurz mitrösten.",
      "Langkornreis dazugeben und kurz mitdünsten. Tomaten, Bouillon, Lorbeerblätter und Chorizo dazugeben, mit Salz würzen und zugedeckt bei kleiner Hitze etwa 20 Minuten garen.",
      "Crevetten in den Reis drücken, zudecken und weitere 5–6 Minuten garen, bis sie rosa sind und der Reis die Flüssigkeit aufgenommen hat. Mit Frühlingszwiebeln bestreuen."]
  },
  {
    id: "idee-buffalo-blumenkohl", title: "Buffalo-Blumenkohl mit Blauschimmel-Dip", kitchen: "amerika", emoji: "gemuese", cat: "snack", tags: ["vegi", "guests"], time: 45, serves: 4,
    note: "Die vegetarische Antwort auf Chicken Wings: knusprig gebackener Blumenkohl in scharfer Butter-Chili-Sauce. Typisch ist Frank's RedHot; andere scharfe Chilisaucen gehen auch. Mit Maizena statt Mehl wird es glutenfrei.",
    ingr: ["1 Blumenkohl (ca. 1 kg)", "80 g Mehl", "1.2 dl Wasser", "1 TL Paprikapulver, geräuchert", "1 TL Knoblauchpulver", "40 g Butter",
      "1 dl scharfe Chilisauce (z. B. Frank's RedHot)", "1 EL Honig", "60 g Gorgonzola", "150 g griechischer Joghurt", "1 Zitrone", "4 Stangen Stangensellerie",
      "Salz, Pfeffer"],
    steps: ["Ofen auf 220 °C vorheizen (Umluft 200 °C). Blumenkohl in mundgerechte Röschen teilen.",
      "Mehl, Wasser, Paprikapulver, Knoblauchpulver und ½ TL Salz zu einem dickflüssigen Teig verrühren. Röschen darin wenden, abtropfen lassen und auf einem mit Backpapier belegten Blech verteilen. Etwa 20 Minuten backen.",
      "Butter schmelzen und mit Chilisauce und Honig verrühren. Blumenkohl darin schwenken, zurück aufs Blech legen und weitere 10–15 Minuten backen, bis er knusprig ist.",
      "Für den Dip Gorgonzola mit einer Gabel zerdrücken und mit Joghurt, einem Spritzer Zitronensaft und Pfeffer verrühren. Stangensellerie in Stäbchen schneiden und alles zusammen servieren."]
  },
  {
    id: "idee-sloppy-joes-linsen", title: "Sloppy Joes mit Linsen", kitchen: "amerika", emoji: "sandwich", cat: "main", tags: ["vegan", "vegi", "kids", "cheap"], time: 40, serves: 4,
    note: "Amerikanischer Kinderklassiker in pflanzlicher Fassung: Linsen in süss-würziger Tomatensauce, saftig im Brötchen. Das Original wird mit Rindshackfleisch gemacht. Brötchen ohne Milch und Ei wählen; Reste schmecken auch über Ofenkartoffeln.",
    ingr: ["200 g Tellerlinsen, braun oder grün", "1 Zwiebel", "1 grüne Peperoni", "2 Knoblauchzehen", "2 EL Öl", "2 EL Tomatenpüree", "1 TL Paprikapulver, geräuchert",
      "1 Dose gehackte Tomaten (400 g)", "3 EL Ketchup", "1 EL Senf", "1 EL Sojasauce", "1 EL Apfelessig", "1 EL brauner Zucker", "4 Burgerbrötchen (vegan)", "Salz, Pfeffer"],
    steps: ["Linsen in einem Sieb spülen und in ungesalzenem Wasser 20–25 Minuten weich, aber nicht zerkocht garen. Abgiessen.",
      "Inzwischen Zwiebel, Peperoni und Knoblauch fein hacken und im Öl etwa 6 Minuten weich dünsten. Tomatenpüree und Paprikapulver kurz mitrösten.",
      "Tomaten, Ketchup, Senf, Sojasauce, Apfelessig und Zucker dazugeben und etwa 10 Minuten einkochen. Linsen untermischen und weitere 5 Minuten köcheln, bis die Masse dick ist. Mit Salz und Pfeffer abschmecken.",
      "Burgerbrötchen halbieren, kurz rösten und grosszügig mit der Linsenmasse füllen."]
  },

  /* ---------- Weitere Gerichte aus Asien ---------- */
  {
    id: "idee-nasi-lemak", title: "Nasi Lemak", kitchen: "sea", emoji: "reis", cat: "main", tags: [], time: 60, serves: 4,
    note: "Malaysias Nationalgericht: Kokosreis mit scharfem Sambal, Ei, Erdnüssen, Gurke und knusprigen Sardellen. Getrocknete Sardellen (Ikan Bilis) und Pandanblätter gibt es im Asia-Laden. Für eine vegetarische Fassung die Sardellen weglassen.",
    ingr: ["300 g Jasminreis", "1 Dose Kokosmilch (4 dl)", "1 Stück Ingwer (2 cm)", "1 Pandanblatt (nach Belieben)", "8 getrocknete Chilischoten", "2 Schalotten",
      "2 Knoblauchzehen", "4 EL Öl", "1 EL Tamarindenpaste", "1 EL Zucker", "4 Eier", "80 g Erdnüsse, ungesalzen", "50 g getrocknete Sardellen (Ikan Bilis)", "1 Gurke",
      "Salz"],
    steps: ["Jasminreis spülen, bis das Wasser klar ist. Mit Kokosmilch, 1.5 dl Wasser, Ingwer in Scheiben, dem verknoteten Pandanblatt und ½ TL Salz aufkochen und zugedeckt bei kleinster Hitze etwa 15 Minuten garen, dann 10 Minuten ruhen lassen.",
      "Für das Sambal Chilischoten entkernen, 10 Minuten in heissem Wasser einweichen und mit Schalotten und Knoblauch fein pürieren. In 2 EL Öl bei mittlerer Hitze unter Rühren braten, bis es dunkelrot ist und das Öl sich trennt. Mit Tamarindenpaste, Zucker und Salz abschmecken.",
      "Eier in siedendem Wasser 7 Minuten kochen, kalt abschrecken, schälen und halbieren.",
      "Restliches Öl in einer Bratpfanne erhitzen. Erdnüsse darin unter Rühren 3–4 Minuten goldbraun rösten und herausnehmen. Sardellen ebenso 2–3 Minuten knusprig braten.",
      "Gurke in Scheiben schneiden. Kokosreis mit Sambal, Eiern, Erdnüssen, Sardellen und Gurke anrichten."]
  },
  {
    id: "idee-hainan-poulet-reis", title: "Hainan-Poulet mit Reis", kitchen: "sea", emoji: "poulet", cat: "main", tags: ["kids"], time: 75, serves: 4,
    note: "In Singapur und Malaysia an jeder Ecke: zart pochiertes Poulet, dazu Reis, der in der Pouletbrühe mit Ingwer und Knoblauch gekocht wird, und zwei Saucen. Das Poulet nur ziehen lassen, nie sprudelnd kochen.",
    ingr: ["1 Stück Ingwer (8 cm)", "4 Frühlingszwiebeln", "1.5 l Wasser", "4 Pouletschenkel mit Haut (ca. 1.2 kg)", "1 EL Sesamöl", "6 Knoblauchzehen", "2 EL Öl",
      "300 g Jasminreis", "3 rote Chilischoten", "1 Limette", "1 TL Zucker", "3 EL Sojasauce", "1 Gurke", "½ Bund Koriander", "Salz"],
    steps: ["Ingwer schälen, die Hälfte in Scheiben schneiden und den Rest fein reiben. Frühlingszwiebeln halbieren und das Grün für die Sauce beiseitelegen. Wasser mit 2 TL Salz, Ingwerscheiben und dem Weissen der Frühlingszwiebeln aufkochen.",
      "Pouletschenkel hineinlegen, die Hitze sofort reduzieren und knapp unter dem Siedepunkt etwa 30 Minuten ziehen lassen. Herausnehmen, kurz in Eiswasser tauchen und mit Sesamöl einreiben. Die Brühe aufbewahren.",
      "Für den Reis 4 Knoblauchzehen hacken und mit 1 EL geriebenem Ingwer in 1 EL Öl kurz andünsten. Gespülten Jasminreis dazugeben, mitdünsten und mit 4.5 dl Pouletbrühe ablöschen. Zugedeckt bei kleinster Hitze etwa 15 Minuten garen.",
      "Für die Chilisauce Chilischoten, restlichen Knoblauch, Saft der Limette, Zucker, 2 EL Brühe und eine Prise Salz fein pürieren. Für die Ingwersauce restlichen Ingwer und fein geschnittenes Frühlingszwiebelgrün mit 1 EL heissem Öl übergiessen und salzen.",
      "Poulet in Scheiben schneiden, mit Sojasauce beträufeln und mit Reis, Gurkenscheiben, Koriander, den beiden Saucen und einer Tasse heisser Brühe servieren."]
  },
  {
    id: "idee-sinigang-crevetten", title: "Sinigang (saure Tamarindensuppe mit Crevetten)", kitchen: "sea", emoji: "suppe", cat: "soup", tags: [], time: 35, serves: 4,
    note: "Philippinische Suppe, angenehm sauer von Tamarinde, mit Crevetten und viel Gemüse. Im Asia-Laden gibt es Sinigang-Würzmischung; Tamarindenpaste mit etwas Limettensaft geht genauso. Dazu gehört eine Schale Reis.",
    ingr: ["250 g Jasminreis", "1 Zwiebel", "2 Tomaten", "1 Stück Ingwer (3 cm)", "1.2 l Wasser", "200 g Rettich", "1 Aubergine", "150 g grüne Bohnen",
      "3 EL Tamarindenpaste", "2 EL Fischsauce", "400 g rohe Crevetten (mit Schale schmeckt es kräftiger)", "2 grüne Chilischoten", "200 g Pak Choi oder Blattspinat",
      "1 Limette", "Salz"],
    steps: ["Jasminreis nach Packungsangabe kochen. Zwiebel in Schnitze, Tomaten in Viertel und Ingwer in Scheiben schneiden.",
      "Wasser mit Zwiebel, Tomaten und Ingwer aufkochen und etwa 10 Minuten köcheln, bis die Tomaten zerfallen.",
      "Rettich schälen und in Scheiben schneiden, Aubergine würfeln, Bohnen halbieren. Mit Tamarindenpaste und Fischsauce in die Suppe geben und 8–10 Minuten köcheln, bis das Gemüse fast weich ist.",
      "Crevetten, ganze Chilischoten und Pak Choi dazugeben und 3–4 Minuten ziehen lassen, bis die Crevetten rosa sind. Mit Limettensaft, Fischsauce und Salz abschmecken; die Suppe soll deutlich sauer sein.",
      "Sinigang in Schalen anrichten und mit dem Reis servieren."]
  },
  {
    id: "idee-lumpia", title: "Lumpia (philippinische Frühlingsrollen)", kitchen: "sea", emoji: "teller", cat: "snack", tags: ["kids", "guests"], time: 60, serves: 4,
    note: "Knusprige, dünne Frühlingsrollen mit Schweinefleisch und Gemüse, auf den Philippinen an keinem Fest wegzudenken. Frühlingsrollen-Teigblätter gibt es tiefgekühlt im Asia-Laden. Ungebacken einfrieren und direkt aus dem Tiefkühler frittieren.",
    ingr: ["25 Frühlingsrollen-Teigblätter (ca. 20 × 20 cm, tiefgekühlt)", "2 Rüebli", "1 Zwiebel", "3 Knoblauchzehen", "3 Frühlingszwiebeln", "400 g Hackfleisch (Schwein)",
      "1 Ei", "2 EL Sojasauce", "5 dl Öl zum Frittieren", "1.5 dl Sweet-Chili-Sauce", "Salz, Pfeffer"],
    steps: ["Teigblätter auftauen lassen. Rüebli fein raffeln, Zwiebel, Knoblauch und Frühlingszwiebeln sehr fein hacken.",
      "Hackfleisch mit dem Gemüse, Ei, Sojasauce, ½ TL Salz und Pfeffer gut verkneten.",
      "Ein Teigblatt mit einer Ecke zu dir hinlegen und etwa 1 EL Füllung als dünnen Strang quer ins untere Drittel setzen. Unten einschlagen, die Seiten einklappen, satt aufrollen und die Spitze mit Wasser festkleben. Unter einem feuchten Tuch bereithalten.",
      "Öl in einem hohen Topf oder Wok auf etwa 170 °C erhitzen. Lumpia portionenweise 4–5 Minuten goldbraun frittieren, bis die Füllung durch ist. Auf Küchenpapier abtropfen lassen.",
      "Lumpia schräg halbieren und mit Sweet-Chili-Sauce zum Dippen servieren."]
  },
  {
    id: "idee-kottu-roti", title: "Kottu Roti mit Gemüse und Ei", kitchen: "in", emoji: "pfanne", cat: "main", tags: ["vegi", "quick"], time: 30, serves: 4,
    note: "Sri Lankas lautestes Streetfood: Fladenbrot, Gemüse und Ei werden auf der heissen Platte mit zwei Spachteln klein gehackt. Statt Godamba-Roti gehen tiefgekühlte Paratha aus dem Asia-Laden oder Weizentortillas. Mit Curry-Resten besonders gut.",
    ingr: ["4 Paratha (tiefgekühlt) oder 4 grosse Weizentortillas", "1 Zwiebel", "2 Knoblauchzehen", "1 Stück Ingwer (2 cm)", "1 grüne Chilischote", "2 Rüebli",
      "1 Stange Lauch", "200 g Weisskabis", "3 EL Öl", "2 TL Currypulver", "½ TL Kurkuma", "4 Eier", "2 EL Sojasauce", "Salz, Pfeffer"],
    steps: ["Paratha in einer trockenen Pfanne pro Seite 1–2 Minuten goldbraun backen (Tortillas nur kurz erwärmen), etwas abkühlen lassen und in 1 cm breite Streifen schneiden.",
      "Zwiebel in Streifen schneiden, Knoblauch, Ingwer und Chilischote hacken. Rüebli raffeln, Lauch in feine Ringe und Weisskabis in feine Streifen schneiden.",
      "Öl im Wok oder in einer grossen Bratpfanne erhitzen. Zwiebel, Knoblauch, Ingwer und Chilischote 2 Minuten anbraten, Currypulver und Kurkuma kurz mitrösten. Rüebli, Lauch und Weisskabis dazugeben und 4–5 Minuten pfannenrühren.",
      "Gemüse an den Rand schieben, Eier in die Mitte schlagen und unter Rühren stocken lassen. Paratha-Streifen und Sojasauce dazugeben und alles 3–4 Minuten weiterbraten, dabei mit der Bratschaufel immer wieder klein hacken.",
      "Mit Salz und Pfeffer abschmecken und sofort servieren. Dazu passt eine scharfe Sauce oder ein Rest Curry."]
  },
  {
    id: "idee-tonkatsu", title: "Tonkatsu mit Kabissalat", kitchen: "jp", emoji: "fleisch", cat: "main", tags: ["kids"], time: 40, serves: 4,
    note: "Japans paniertes Schweinsschnitzel mit Panko, dazu fein gehobelter Kabis, Reis und fruchtige Tonkatsu-Sauce. Die Sauce gibt es fertig im Asia-Laden; die schnelle Mischung aus Ketchup, Worcestershire und Sojasauce kommt nah heran.",
    ingr: ["300 g Sushireis oder Rundkornreis", "300 g Weisskabis", "3 EL Ketchup", "2 EL Worcestershiresauce", "1 EL Sojasauce", "1 TL Zucker",
      "4 Schweinskoteletts ohne Knochen (je ca. 150 g, 1.5 cm dick)", "3 EL Mehl", "2 Eier", "100 g Panko (japanisches Paniermehl)", "2 dl Öl zum Braten", "1 Zitrone",
      "Salz, Pfeffer"],
    steps: ["Sushireis spülen, bis das Wasser klar ist, mit 3.6 dl Wasser aufkochen und zugedeckt bei kleinster Hitze etwa 12 Minuten garen, dann 10 Minuten ruhen lassen.",
      "Weisskabis sehr fein hobeln, kurz in kaltes Wasser legen und gut abtropfen lassen. Ketchup, Worcestershiresauce, Sojasauce und Zucker zu einer Sauce verrühren.",
      "Schweinskoteletts am Fettrand einige Male einschneiden, damit sie sich nicht wölben, mit Salz und Pfeffer würzen. Eier in einem tiefen Teller verquirlen. Fleisch zuerst im Mehl wenden, dann durch die Eier ziehen und zuletzt im Panko wenden; die Panade gut andrücken.",
      "Öl in einer Bratpfanne auf mittlere Hitze bringen und das Fleisch pro Seite 4–5 Minuten goldbraun braten, bis es durch ist. Auf Küchenpapier 2 Minuten ruhen lassen.",
      "Fleisch in Streifen schneiden und mit Kabis, Reis, Zitronenschnitzen und Sauce servieren."]
  },
  {
    id: "idee-panang-curry-tofu", title: "Panang-Curry mit Tofu", kitchen: "th", emoji: "curry", cat: "main", tags: ["vegan", "vegi"], time: 35, serves: 4,
    note: "Das dickste und mildeste der Thai-Currys, mit Erdnüssen und Kaffirlimettenblättern. Viele Pasten enthalten Crevettenpaste; auf vegane Paste achten. Kaffirlimettenblätter gibt es im Asia-Laden, auch tiefgekühlt.",
    ingr: ["300 g Jasminreis", "400 g Tofu, fest", "2 EL Maizena", "3 EL Öl", "3 EL Panang- oder rote Currypaste (vegan)", "1 Dose Kokosmilch (4 dl)", "2 EL Erdnussbutter",
      "1 EL Sojasauce", "1 EL Zucker", "4 Kaffirlimettenblätter", "1 rote Peperoni", "150 g Kefen oder grüne Bohnen", "1 Limette",
      "½ Bund Thai-Basilikum oder Basilikum", "2 EL Erdnüsse, geröstet"],
    steps: ["Jasminreis mit 4.5 dl Wasser aufkochen und zugedeckt bei kleinster Hitze etwa 15 Minuten garen.",
      "Tofu trocken tupfen, in Würfel schneiden und in Maizena wenden. In 2 EL Öl rundum 6–8 Minuten knusprig braten und herausnehmen.",
      "Restliches Öl im Wok erhitzen und die Currypaste darin 1 Minute anrösten. Die Hälfte der Kokosmilch dazugeben und unter Rühren einkochen, bis sich das Fett absetzt.",
      "Restliche Kokosmilch, Erdnussbutter, Sojasauce, Zucker und fein geschnittene Kaffirlimettenblätter einrühren. Peperoni in Streifen schneiden, mit den Kefen dazugeben und 4–5 Minuten köcheln, bis das Gemüse knapp gar ist.",
      "Tofu unterheben, mit Limettensaft abschmecken und mit Basilikum und gehackten Erdnüssen bestreuen. Mit dem Reis servieren."]
  }
]);
