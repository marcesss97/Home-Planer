/* Home-Planer: eingebaute Kochideen. Sie erscheinen beim Würfeln «Was koche ich heute?», in der Suche nach Zutaten und
   unter «Kochideen» im Bereich Rezepte. Mit «Übernehmen» wird eine Idee zu einem eigenen Rezept des Haushalts.
   Eigene Ideen ergänzen: einen Eintrag nach demselben Muster anfügen. id: eindeutig, nur Kleinbuchstaben, Ziffern und
   Bindestriche. emoji, cat und tags: Kennungen aus logic.js (DISHES, RECIPE_CATS, RECIPE_TAGS). time in Minuten. */
window.HP_IDEEN = [
  {
    id: "idee-aelplermagronen", title: "Älplermagronen", emoji: "pfanne", cat: "main", tags: ["vegi", "kids"], time: 40, serves: 4,
    ingr: ["400 g Kartoffeln, mehligkochend", "300 g Älplermagronen oder Hörnli", "2 Zwiebeln", "2 dl Rahm", "1 dl Milch", "150 g Gruyère, gerieben", "30 g Butter", "Salz, Pfeffer, Muskat", "Apfelmus zum Servieren"],
    steps: ["Kartoffeln schälen und würfeln. Mit den Magronen in reichlich Salzwasser weich kochen, abgiessen.",
      "Zwiebeln in Ringe schneiden und in der Butter langsam goldbraun braten.",
      "Rahm und Milch aufkochen, mit Salz, Pfeffer und Muskat würzen. Magronen und Kartoffeln daruntermischen, Käse darüberstreuen und schmelzen lassen.",
      "Mit den Zwiebeln anrichten und Apfelmus dazu servieren."]
  },
  {
    id: "idee-roesti", title: "Rösti mit Spiegelei", emoji: "ei", cat: "main", tags: ["vegi", "cheap"], time: 35, serves: 4,
    ingr: ["800 g Kartoffeln, festkochend, am Vortag in der Schale gekocht", "3 EL Bratbutter", "4 Eier", "Salz, Pfeffer", "½ Bund Schnittlauch"],
    steps: ["Kartoffeln schälen, grob raffeln und mit Salz würzen.",
      "Bratbutter in einer weiten Bratpfanne erhitzen, Kartoffeln hineingeben, leicht andrücken und bei mittlerer Hitze etwa 15 Minuten braten, bis unten eine goldene Kruste entsteht.",
      "Rösti mit einem Teller wenden, etwas Bratbutter nachgeben und die zweite Seite nochmals etwa 10 Minuten braten.",
      "Spiegeleier braten, auf der Rösti anrichten und mit Schnittlauch bestreuen."]
  },
  {
    id: "idee-bolognese", title: "Spaghetti Bolognese", emoji: "pasta", cat: "main", tags: ["kids", "prep"], time: 60, serves: 4,
    ingr: ["400 g Spaghetti", "400 g Hackfleisch (Rind)", "1 Zwiebel", "2 Knoblauchzehen", "1 Rüebli", "1 Stange Stangensellerie", "2 EL Tomatenpüree", "1 Dose gehackte Tomaten (400 g)", "1 dl Rotwein oder Bouillon", "2 EL Olivenöl", "Salz, Pfeffer, Oregano", "Parmesan zum Servieren"],
    steps: ["Zwiebel, Knoblauch, Rüebli und Sellerie fein hacken.",
      "Hackfleisch im Olivenöl kräftig anbraten, Gemüse dazugeben und kurz mitdünsten. Tomatenpüree unterrühren und kurz rösten.",
      "Mit Rotwein ablöschen, gehackte Tomaten dazugeben, würzen und zugedeckt mindestens 30 Minuten köcheln lassen.",
      "Spaghetti al dente kochen und mit der Sauce und Parmesan servieren."]
  },
  {
    id: "idee-pilzrisotto", title: "Pilzrisotto", emoji: "pilz", cat: "main", tags: ["vegi", "guests"], time: 35, serves: 4,
    ingr: ["300 g Risottoreis (z. B. Carnaroli)", "300 g Champignons oder gemischte Pilze", "1 Zwiebel", "1 dl Weisswein", "1 l Gemüsebouillon, heiss", "40 g Butter", "60 g Parmesan, gerieben", "2 EL Olivenöl", "Petersilie, Salz, Pfeffer"],
    steps: ["Pilze in Scheiben schneiden und in der Hälfte des Olivenöls kräftig anbraten, beiseitestellen.",
      "Zwiebel fein hacken und im restlichen Öl andünsten. Reis dazugeben und glasig dünsten, mit Weisswein ablöschen.",
      "Nach und nach heisse Bouillon dazugiessen und unter gelegentlichem Rühren etwa 18 Minuten köcheln, bis der Reis cremig und noch bissfest ist.",
      "Pilze, Butter und Parmesan unterrühren, abschmecken und mit Petersilie bestreuen."]
  },
  {
    id: "idee-gemuesecurry", title: "Gemüsecurry mit Kichererbsen", emoji: "curry", cat: "main", tags: ["vegan", "cheap"], time: 35, serves: 4,
    ingr: ["250 g Basmatireis", "1 Zwiebel", "2 Knoblauchzehen", "1 Stück Ingwer (2 cm)", "2 EL rote Currypaste (vegan)", "1 Dose Kokosmilch (4 dl)", "1 Dose Kichererbsen (400 g)", "1 Peperoni", "1 Zucchetti", "200 g Blattspinat", "1 EL Öl", "1 Limette", "Koriander, Salz"],
    steps: ["Reis nach Packungsangabe kochen.",
      "Zwiebel, Knoblauch und Ingwer fein hacken und im Öl andünsten. Currypaste dazugeben und kurz mitrösten.",
      "Peperoni und Zucchetti in Würfel schneiden, mit Kokosmilch und abgetropften Kichererbsen dazugeben und etwa 10 Minuten köcheln.",
      "Spinat unterrühren, bis er zusammenfällt. Mit Limettensaft und Salz abschmecken, mit Koriander und Reis servieren."]
  },
  {
    id: "idee-chili-sin-carne", title: "Chili sin Carne", emoji: "chili", cat: "main", tags: ["vegan", "cheap", "prep"], time: 45, serves: 4,
    ingr: ["1 Zwiebel", "2 Knoblauchzehen", "2 Peperoni", "1 Dose Kidneybohnen (400 g)", "1 Dose schwarze Bohnen (400 g)", "1 Dose Mais (300 g)", "2 Dosen gehackte Tomaten (à 400 g)", "2 EL Tomatenpüree", "1 TL Kreuzkümmel", "1 TL Paprikapulver, geräuchert", "1 Chilischote oder Chilipulver", "2 EL Olivenöl", "Reis oder Brot zum Servieren"],
    steps: ["Zwiebel und Knoblauch hacken, Peperoni würfeln und alles im Olivenöl andünsten.",
      "Tomatenpüree und Gewürze dazugeben und kurz mitrösten.",
      "Tomaten, abgespülte Bohnen und Mais dazugeben und offen etwa 25 Minuten köcheln, bis das Chili sämig ist.",
      "Abschmecken und mit Reis oder Brot servieren. Schmeckt aufgewärmt noch besser."]
  },
  {
    id: "idee-ofengemuese-feta", title: "Ofengemüse mit Feta", emoji: "ruebli", cat: "main", tags: ["vegi", "cheap"], time: 50, serves: 4,
    ingr: ["500 g Kartoffeln", "3 Rüebli", "1 Zucchetti", "1 Peperoni", "1 rote Zwiebel", "200 g Feta", "3 EL Olivenöl", "1 TL Rosmarin oder Thymian", "Salz, Pfeffer"],
    steps: ["Ofen auf 200 °C vorheizen.",
      "Gemüse in mundgerechte Stücke schneiden, mit Olivenöl, Kräutern, Salz und Pfeffer mischen und auf einem Blech verteilen.",
      "Etwa 35 Minuten backen, bis die Kartoffeln weich und leicht gebräunt sind.",
      "Feta darüberbröckeln und 10 Minuten weiterbacken."]
  },
  {
    id: "idee-shakshuka", title: "Shakshuka", emoji: "ei", cat: "main", tags: ["vegi", "quick", "cheap"], time: 25, serves: 2,
    ingr: ["1 Zwiebel", "2 Knoblauchzehen", "1 Peperoni", "1 Dose gehackte Tomaten (400 g)", "1 TL Kreuzkümmel", "1 TL Paprikapulver", "4 Eier", "2 EL Olivenöl", "Petersilie oder Koriander", "Brot zum Servieren"],
    steps: ["Zwiebel, Knoblauch und Peperoni klein schneiden und im Olivenöl in einer Bratpfanne andünsten.",
      "Gewürze dazugeben, Tomaten dazugiessen und etwa 10 Minuten zu einer dicken Sauce einköcheln.",
      "Vier Mulden formen, die Eier hineinschlagen und zugedeckt 5 bis 8 Minuten stocken lassen.",
      "Mit Kräutern bestreuen und direkt aus der Pfanne mit Brot essen."]
  },
  {
    id: "idee-zuercher-geschnetzeltes", title: "Zürcher Geschnetzeltes", emoji: "fleisch", cat: "main", tags: ["guests"], time: 35, serves: 4,
    ingr: ["600 g Kalbfleisch, geschnetzelt", "250 g Champignons", "1 Zwiebel", "1 EL Mehl", "1 dl Weisswein", "2 dl Kalbsfond oder Bouillon", "2 dl Rahm", "2 EL Bratbutter", "Petersilie, Salz, Pfeffer", "Rösti zum Servieren"],
    steps: ["Fleisch mit Mehl bestäuben und portionenweise in heisser Bratbutter kurz anbraten, herausnehmen und warm stellen.",
      "Zwiebel hacken, Champignons in Scheiben schneiden und in derselben Pfanne andünsten.",
      "Mit Weisswein ablöschen, Fond und Rahm dazugeben und sämig einköcheln.",
      "Fleisch nur noch erwärmen, nicht mehr kochen. Abschmecken, mit Petersilie bestreuen und mit Rösti servieren."]
  },
  {
    id: "idee-flammkuchen", title: "Flammkuchen", emoji: "speck", cat: "main", tags: ["quick", "guests"], time: 25, serves: 2,
    ingr: ["1 Flammkuchenteig, rechteckig ausgewallt", "200 g Crème fraîche", "150 g Speckwürfeli", "2 Zwiebeln", "Salz, Pfeffer, Muskat"],
    steps: ["Ofen auf 250 °C vorheizen.",
      "Teig samt Backpapier aufs Blech legen, Crème fraîche würzen und darauf verstreichen.",
      "Zwiebeln in feine Ringe schneiden und mit dem Speck darauf verteilen.",
      "Im unteren Teil des Ofens 10 bis 12 Minuten knusprig backen."]
  },
  {
    id: "idee-kaesewaehe", title: "Käsewähe", emoji: "waehe", cat: "main", tags: ["vegi", "cheap"], time: 50, serves: 4,
    ingr: ["1 Kuchenteig, rund ausgewallt (ca. 32 cm)", "200 g Gruyère, gerieben", "3 Eier", "2 dl Milch", "1 dl Rahm", "1 EL Mehl", "Salz, Pfeffer, Muskat"],
    steps: ["Ofen auf 220 °C Unter- und Oberhitze vorheizen.",
      "Teig samt Backpapier ins Wähenblech legen und den Boden mit einer Gabel einstechen. Käse darauf verteilen.",
      "Eier, Milch, Rahm und Mehl verquirlen, würzen und über den Käse giessen.",
      "Im unteren Teil des Ofens etwa 30 Minuten backen, bis der Guss gestockt und goldbraun ist."]
  },
  {
    id: "idee-minestrone", title: "Minestrone", emoji: "suppe", cat: "soup", tags: ["vegan", "cheap", "prep"], time: 45, serves: 4,
    ingr: ["1 Zwiebel", "2 Rüebli", "1 Stange Lauch", "1 Zucchetti", "2 Kartoffeln", "1 Dose weisse Bohnen (400 g)", "1 Dose gehackte Tomaten (400 g)", "1.5 l Gemüsebouillon", "100 g kleine Teigwaren (z. B. Hörnli)", "2 EL Olivenöl", "Basilikum", "Parmesan nach Belieben"],
    steps: ["Gemüse in kleine Würfel schneiden und im Olivenöl andünsten.",
      "Mit Bouillon und Tomaten auffüllen und etwa 20 Minuten köcheln.",
      "Teigwaren und abgespülte Bohnen dazugeben und weitere 10 Minuten köcheln, bis die Teigwaren gar sind.",
      "Abschmecken und mit Basilikum und nach Belieben Parmesan servieren."]
  },
  {
    id: "idee-kuerbissuppe", title: "Kürbissuppe", emoji: "kuerbis", cat: "soup", tags: ["vegi", "cheap"], time: 35, serves: 4,
    ingr: ["1 kg Kürbis (z. B. Butternut)", "1 Zwiebel", "1 Stück Ingwer (2 cm)", "8 dl Gemüsebouillon", "1 dl Kokosmilch oder Rahm", "1 EL Olivenöl", "Salz, Pfeffer", "Kürbiskerne zum Bestreuen"],
    steps: ["Kürbis schälen, entkernen und würfeln. Zwiebel und Ingwer hacken.",
      "Alles im Olivenöl andünsten, mit Bouillon auffüllen und etwa 20 Minuten weich köcheln.",
      "Fein pürieren, Kokosmilch dazugeben und abschmecken.",
      "Mit gerösteten Kürbiskernen servieren."]
  },
  {
    id: "idee-bohnen-tacos", title: "Bohnen-Tacos", emoji: "taco", cat: "main", tags: ["vegi", "quick", "kids"], time: 25, serves: 4,
    ingr: ["8 kleine Tortillas", "1 Dose schwarze Bohnen (400 g)", "1 Dose Mais (300 g)", "1 rote Zwiebel", "2 Tomaten", "1 Avocado", "1 Limette", "100 g Reibkäse (z. B. Cheddar)", "1 TL Kreuzkümmel", "Salsa, Sauerrahm, Koriander"],
    steps: ["Bohnen abspülen und mit Mais und Kreuzkümmel in einer Pfanne erwärmen, leicht zerdrücken.",
      "Zwiebel, Tomaten und Avocado würfeln, Avocado mit Limettensaft beträufeln.",
      "Tortillas in einer trockenen Pfanne kurz erwärmen.",
      "Alles auf den Tisch stellen: Jede Person füllt ihre Tacos selbst."]
  },
  {
    id: "idee-pad-thai", title: "Pad Thai mit Tofu", emoji: "nudeln", cat: "main", tags: ["vegi", "quick"], time: 30, serves: 4,
    ingr: ["250 g Reisnudeln", "200 g Tofu, fest", "2 Eier", "200 g Sojasprossen", "3 Frühlingszwiebeln", "2 Knoblauchzehen", "3 EL Sojasauce", "2 EL Limettensaft", "1 EL Zucker", "2 EL Öl", "2 EL Erdnüsse, geröstet und gehackt", "Koriander"],
    steps: ["Reisnudeln nach Packungsangabe einweichen und abtropfen lassen. Sojasauce, Limettensaft und Zucker verrühren.",
      "Tofu würfeln und im Öl knusprig braten. Knoblauch und Frühlingszwiebeln kurz mitbraten.",
      "Eier in die Pfanne schlagen und unter Rühren stocken lassen. Nudeln, Sauce und Sprossen dazugeben und gut mischen.",
      "Mit Erdnüssen, Koriander und Limettenschnitzen servieren."]
  },
  {
    id: "idee-gnocchi-salbeibutter", title: "Gnocchi mit Salbeibutter", emoji: "kartoffel", cat: "main", tags: ["vegi", "quick", "kids"], time: 15, serves: 4,
    ingr: ["800 g Gnocchi (Kühlregal)", "80 g Butter", "1 Bund Salbei", "60 g Parmesan, gerieben", "Salz, Pfeffer"],
    steps: ["Gnocchi in siedendem Salzwasser garen, bis sie an die Oberfläche steigen, abgiessen.",
      "Butter in einer Bratpfanne schmelzen, Salbeiblätter darin knusprig braten.",
      "Gnocchi in der Salbeibutter schwenken und mit Parmesan und Pfeffer servieren."]
  },
  {
    id: "idee-lasagne", title: "Lasagne", emoji: "teller", cat: "main", tags: ["kids", "guests", "prep"], time: 90, serves: 4,
    ingr: ["12 Lasagneblätter", "400 g Hackfleisch (Rind)", "1 Zwiebel", "2 Knoblauchzehen", "2 Dosen gehackte Tomaten (à 400 g)", "2 EL Tomatenpüree", "50 g Butter", "50 g Mehl", "7 dl Milch", "100 g Parmesan, gerieben", "2 EL Olivenöl", "Salz, Pfeffer, Muskat, Oregano"],
    steps: ["Für die Fleischsauce Zwiebel und Knoblauch hacken, mit dem Hackfleisch im Olivenöl anbraten, Tomatenpüree und Tomaten dazugeben, würzen und 20 Minuten köcheln.",
      "Für die Béchamel Butter schmelzen, Mehl einrühren, Milch nach und nach dazugeben und unter Rühren aufkochen. Mit Salz und Muskat würzen.",
      "Ofen auf 200 °C vorheizen. In einer Form abwechselnd Fleischsauce, Lasagneblätter und Béchamel schichten, mit Béchamel und Parmesan abschliessen.",
      "Etwa 40 Minuten backen und vor dem Schneiden 10 Minuten ruhen lassen."]
  },
  {
    id: "idee-poke-bowl", title: "Poke Bowl mit Lachs", emoji: "sushi", cat: "main", tags: ["quick"], time: 30, serves: 2,
    ingr: ["200 g Sushireis", "250 g Lachs in Sushi-Qualität", "1 Avocado", "½ Gurke", "1 Rüebli", "100 g Edamame, geschält (tiefgekühlt)", "3 EL Sojasauce", "1 EL Reisessig", "1 TL Sesamöl", "Sesam, Frühlingszwiebeln"],
    steps: ["Reis nach Packungsangabe kochen und mit Reisessig abschmecken.",
      "Lachs in Würfel schneiden und mit Sojasauce und Sesamöl marinieren.",
      "Avocado, Gurke und Rüebli schneiden, Edamame kurz blanchieren.",
      "Reis in Schalen verteilen, alles darauf anrichten und mit Sesam und Frühlingszwiebeln bestreuen."]
  },
  {
    id: "idee-fajitas", title: "Poulet-Fajitas", emoji: "fladen", cat: "main", tags: ["quick", "kids"], time: 30, serves: 4,
    ingr: ["500 g Pouletbrust", "2 Peperoni (rot und gelb)", "1 Zwiebel", "8 Tortillas", "2 EL Öl", "1 TL Paprikapulver", "1 TL Kreuzkümmel", "1 Limette", "Guacamole, Sauerrahm, Salsa"],
    steps: ["Poulet in Streifen schneiden und mit Öl, Gewürzen und Limettensaft marinieren.",
      "Peperoni und Zwiebel in Streifen schneiden.",
      "Poulet in einer heissen Pfanne kräftig anbraten, Gemüse dazugeben und bissfest braten.",
      "Mit warmen Tortillas, Guacamole, Sauerrahm und Salsa servieren."]
  },
  {
    id: "idee-pancakes", title: "Pancakes", emoji: "pancake", cat: "breakfast", tags: ["vegi", "kids"], time: 25, serves: 4,
    ingr: ["250 g Mehl", "2 EL Zucker", "2 TL Backpulver", "1 Prise Salz", "3 dl Milch", "2 Eier", "30 g Butter, geschmolzen", "Ahornsirup und Beeren zum Servieren"],
    steps: ["Mehl, Zucker, Backpulver und Salz mischen.",
      "Milch, Eier und flüssige Butter verquirlen und kurz unter die Mehlmischung rühren, bis keine trockenen Stellen mehr da sind.",
      "In einer beschichteten Pfanne bei mittlerer Hitze kleine Pancakes backen, wenden sobald sich Bläschen bilden.",
      "Mit Ahornsirup und Beeren servieren."]
  },
  {
    id: "idee-birchermuesli", title: "Birchermüesli", emoji: "apfel", cat: "breakfast", tags: ["vegi", "quick", "prep"], time: 15, serves: 4,
    ingr: ["150 g Haferflocken", "2 dl Milch", "180 g Naturjoghurt", "2 Äpfel", "1 Zitrone", "2 EL Honig", "50 g Haselnüsse, gehackt", "Beeren nach Saison"],
    steps: ["Haferflocken mit der Milch mischen und mindestens 30 Minuten oder über Nacht quellen lassen.",
      "Äpfel mit der Schale an der Bircherraffel reiben und sofort mit Zitronensaft mischen.",
      "Äpfel, Joghurt und Honig unter die Haferflocken rühren.",
      "Mit Haselnüssen und Beeren servieren."]
  },
  {
    id: "idee-raclette", title: "Raclette", emoji: "kaese", cat: "main", tags: ["vegi", "guests"], time: 40, serves: 4,
    ingr: ["800 g Raclettekäse in Scheiben", "1 kg kleine Kartoffeln", "Cornichons und Silberzwiebeln", "Pfeffer, Paprikapulver"],
    steps: ["Kartoffeln in der Schale weich kochen und im Körbchen oder unter einem Tuch warm halten.",
      "Raclette-Ofen aufheizen.",
      "Käse in den Pfännchen schmelzen und über die Kartoffeln geben, mit Pfeffer und Paprika würzen.",
      "Mit Cornichons und Silberzwiebeln servieren."]
  },
  {
    id: "idee-kaesefondue", title: "Käsefondue moitié-moitié", emoji: "fondue", cat: "main", tags: ["vegi", "guests"], time: 30, serves: 4,
    ingr: ["400 g Gruyère, gerieben", "400 g Vacherin fribourgeois, gerieben", "1 Knoblauchzehe", "3 dl Weisswein", "2 TL Maizena", "2 cl Kirsch", "800 g Brot, in Würfeln", "Pfeffer, Muskat"],
    steps: ["Caquelon mit der halbierten Knoblauchzehe ausreiben.",
      "Wein und Käse im Caquelon unter ständigem Rühren in Achterform langsam erhitzen, bis der Käse geschmolzen ist.",
      "Maizena mit dem Kirsch anrühren, zum Fondue geben und kurz aufkochen. Mit Pfeffer und Muskat würzen.",
      "Auf dem Rechaud servieren und Brotwürfel eintunken. Wer sein Brot verliert, zahlt die nächste Runde."]
  },
  {
    id: "idee-hoernli-ghackets", title: "Hörnli mit Ghackets und Apfelmus", emoji: "pasta", cat: "main", tags: ["kids", "quick", "cheap"], time: 30, serves: 4,
    ingr: ["400 g Hörnli", "400 g Hackfleisch (Rind)", "1 Zwiebel", "1 EL Tomatenpüree", "2 dl Bouillon", "1 EL Öl", "Salz, Pfeffer", "Reibkäse", "Apfelmus zum Servieren"],
    steps: ["Hörnli in Salzwasser al dente kochen.",
      "Zwiebel hacken und mit dem Hackfleisch im Öl krümelig anbraten. Tomatenpüree kurz mitrösten.",
      "Mit Bouillon ablöschen und etwa 10 Minuten köcheln lassen, abschmecken.",
      "Hörnli mit dem Ghackets, Reibkäse und Apfelmus servieren."]
  },
  {
    id: "idee-griechischer-salat", title: "Griechischer Salat", emoji: "salat", cat: "salad", tags: ["vegi", "quick"], time: 15, serves: 4,
    ingr: ["4 Tomaten", "1 Gurke", "1 rote Zwiebel", "1 grüne Peperoni", "200 g Feta", "100 g Kalamata-Oliven", "4 EL Olivenöl", "1 EL Rotweinessig", "Oregano, Salz, Pfeffer"],
    steps: ["Tomaten, Gurke und Peperoni in grobe Stücke schneiden, Zwiebel in feine Ringe.",
      "Alles mit den Oliven in eine Schüssel geben, mit Olivenöl, Essig, Salz und Pfeffer mischen.",
      "Feta in einem Stück oder grob gebröckelt darauflegen und mit Oregano bestreuen."]
  },
  {
    id: "idee-schoggimousse", title: "Schoggimousse", emoji: "schoggi", cat: "sweet", tags: ["vegi", "guests"], time: 30, serves: 4,
    ingr: ["200 g dunkle Schokolade", "3 sehr frische Eier", "2 dl Rahm", "1 EL Zucker", "1 Prise Salz"],
    steps: ["Schokolade hacken und über dem warmen Wasserbad schmelzen, etwas abkühlen lassen.",
      "Eier trennen. Eigelb mit dem Zucker schaumig rühren und die Schokolade darunterrühren.",
      "Rahm steif schlagen, Eiweiss mit dem Salz zu Schnee schlagen. Beides nacheinander locker unter die Schokolade ziehen.",
      "Mindestens 4 Stunden kühl stellen. Mit rohen Eiern: nicht für Schwangere und kleine Kinder."]
  }
];
