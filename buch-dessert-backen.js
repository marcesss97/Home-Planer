/* Home-Planer: Rezeptbuch – Desserts, Kuchen, Schweizer Gebäck & Brot. Eigene Rezepte nach demselben Muster wie in ideen.js.
   Kennungen (emoji, cat, tags, kitchen, coll) aus logic.js. time in Minuten. */
window.HP_IDEEN = (window.HP_IDEEN || []).concat([
  /* ---------- Desserts ---------- */
  {
    id: "idee-creme-brulee", title: "Crème brûlée", kitchen: "fr", emoji: "glace", cat: "sweet", tags: ["vegi", "guests", "prep"], time: 65, serves: 6,
    note: "Vanillecreme mit knackiger Zuckerkruste aus Frankreich; sie braucht mindestens 3 Stunden im Kühlschrank. Ohne Küchenbrenner unter dem heissen Grill karamellisieren und dabei nicht aus den Augen lassen.",
    ingr: ["5 dl Vollrahm", "1 Vanilleschote", "6 Eigelb", "80 g Zucker", "6 TL Rohzucker zum Karamellisieren"],
    steps: ["Ofen auf 150 °C vorheizen (Umluft 130 °C). Vanilleschote längs aufschneiden, das Mark auskratzen und mit Schote und Vollrahm aufkochen. Vom Herd ziehen und zugedeckt 10 Minuten ziehen lassen.",
      "Eigelb und Zucker mit dem Schwingbesen verrühren, ohne viel Luft einzuschlagen. Vanilleschote herausnehmen, den warmen Rahm unter Rühren zum Eigelb giessen und alles durch ein feines Sieb streichen.",
      "Creme in 6 flache, ofenfeste Förmchen (à ca. 1 dl) verteilen und diese in eine tiefe Ofenform stellen. Heisses Wasser einfüllen, bis die Förmchen zur Hälfte darin stehen. In der Ofenmitte 35–40 Minuten garen, bis die Creme am Rand fest ist und in der Mitte noch leicht zittert.",
      "Förmchen aus dem Wasserbad heben, auskühlen lassen und zugedeckt mindestens 3 Stunden kühl stellen.",
      "Kurz vor dem Servieren je 1 TL Rohzucker gleichmässig auf die Creme streuen und mit dem Küchenbrenner karamellisieren, bis eine glänzende, goldbraune Kruste entsteht. 2 Minuten fest werden lassen und sofort servieren."]
  },
  {
    id: "idee-panna-cotta", title: "Panna cotta mit Beerensauce", kitchen: "it", emoji: "glace", cat: "sweet", tags: ["guests", "prep"], time: 25, serves: 4,
    note: "Der Rahmpudding aus dem Piemont braucht mindestens 4 Stunden im Kühlschrank. Gelatine ist nicht vegetarisch: Als Ersatz 1 TL Agar-Agar (Reformhaus, grosse Coop-Filialen) mit dem Rahm 2 Minuten kochen.",
    ingr: ["3 Blatt Gelatine", "5 dl Vollrahm", "1 dl Milch", "60 g Zucker", "1 Vanilleschote", "300 g Beeren, frisch oder tiefgekühlt", "2 EL Puderzucker", "1 EL Zitronensaft"],
    steps: ["Gelatine in kaltem Wasser etwa 5 Minuten einweichen. Vanilleschote längs aufschneiden und das Mark auskratzen.",
      "Vollrahm, Milch, Zucker, Vanillemark und Schote aufkochen und bei kleiner Hitze 5 Minuten leise köcheln lassen. Vom Herd ziehen und die Schote entfernen.",
      "Gelatine gut ausdrücken und im heissen Rahm unter Rühren auflösen. In 4 Gläser oder kalt ausgespülte Förmchen füllen, abkühlen lassen und zugedeckt mindestens 4 Stunden kühl stellen.",
      "Für die Sauce die Beeren mit Puderzucker und Zitronensaft aufkochen und 3 Minuten köcheln. Nach Belieben pürieren, durch ein Sieb streichen und auskühlen lassen.",
      "Panna cotta im Glas mit der Sauce servieren. Förmchen zum Stürzen kurz in heisses Wasser tauchen, mit einem Messer vom Rand lösen und auf Teller stürzen."]
  },
  {
    id: "idee-weisse-schoggimousse", title: "Weisse Schoggimousse mit Himbeeren", kitchen: "fr", emoji: "schoggi", cat: "sweet", tags: ["vegi", "guests"], time: 40, serves: 6,
    note: "Ganz ohne Eier, nur mit weisser Schokolade und Rahm. Weisse Schokolade brennt leicht an, darum nur sanft schmelzen; die Mousse braucht mindestens 4 Stunden im Kühlschrank.",
    ingr: ["200 g weisse Schokolade", "4 dl Vollrahm", "1 Bio-Limette", "250 g Himbeeren", "1 EL Puderzucker", "Minze zum Garnieren"],
    steps: ["Schokolade fein hacken. 1 dl Vollrahm aufkochen, vom Herd ziehen und die Schokolade darin unter Rühren schmelzen; wenn nötig kurz über das warme Wasserbad stellen. Die Hälfte der Limettenschale dazureiben.",
      "Schokoladenrahm bei Raumtemperatur etwa 20 Minuten abkühlen lassen, bis er lauwarm, aber noch flüssig ist.",
      "Restlichen Vollrahm steif schlagen. Zuerst einen Drittel unter die Schokolade rühren, dann den Rest locker unterziehen. In Gläser füllen und zugedeckt mindestens 4 Stunden kühl stellen.",
      "Himbeeren mit Puderzucker, etwas Limettensaft und der restlichen Limettenschale mischen und 10 Minuten ziehen lassen. Auf der Mousse anrichten und mit Minze garnieren."]
  },
  {
    id: "idee-meringues-doppelrahm", title: "Meringues mit Doppelrahm", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi", "guests"], time: 150, serves: 6,
    note: "Im Greyerzerland gehören Meringues und dicker Doppelrahm zusammen; Doppelrahm gibt es bei Coop und Migros, sonst Vollrahm steif schlagen. Die Meringues im ausgeschalteten Ofen auskühlen lassen, luftdicht verpackt halten sie zwei Wochen.",
    ingr: ["4 Eiweiss (ca. 120 g)", "1 Prise Salz", "1 TL Zitronensaft", "240 g Zucker", "2.5 dl Doppelrahm (Crème double)", "300 g Beeren nach Saison"],
    steps: ["Ofen auf 100 °C vorheizen (Umluft 80 °C) und ein Blech mit Backpapier belegen. Eiweiss mit Salz und Zitronensaft in einer sauberen, fettfreien Schüssel schaumig schlagen.",
      "Die Hälfte des Zuckers nach und nach einrieseln lassen und etwa 5 Minuten weiterschlagen, bis der Eischnee glänzt und feste Spitzen bildet. Restlichen Zucker mit dem Gummischaber locker unterziehen.",
      "Mit zwei Esslöffeln oder dem Spritzsack 12 längliche Meringues mit etwas Abstand aufs Blech setzen.",
      "In der Ofenmitte etwa 2 Stunden trocknen lassen. Ofen ausschalten und die Meringues bei einen Spalt geöffneter Tür darin auskühlen lassen.",
      "Je zwei Meringues mit einem grossen Löffel Doppelrahm und Beeren anrichten."]
  },
  {
    id: "idee-vermicelles", title: "Vermicelles", kitchen: "ch", emoji: "glace", cat: "sweet", tags: ["vegi", "guests"], time: 60, serves: 4,
    note: "Der Herbstklassiker aus Marronipüree wird durch die Vermicellespresse gedrückt, eine Kartoffelpresse geht auch. Das Püree lässt sich am Vortag kochen; schneller geht es mit fertigem Vermicelles-Püree aus dem Kühlregal.",
    ingr: ["400 g Marroni, geschält (tiefgekühlt)", "3 dl Milch", "70 g Zucker", "1 Vanilleschote", "20 g Butter", "2 EL Kirsch (nach Belieben)", "2 dl Vollrahm", "4 Meringueschalen"],
    steps: ["Marroni mit Milch, Zucker und der längs aufgeschnittenen Vanilleschote aufkochen. Zugedeckt bei kleiner Hitze 30–35 Minuten köcheln, bis die Marroni ganz weich sind; ab und zu umrühren, damit nichts ansetzt.",
      "Vanilleschote entfernen. Marroni mit der Kochflüssigkeit fein pürieren, Butter und Kirsch unterrühren. Das Püree soll dick und glatt sein; ist es zu fest, etwas Milch dazugeben. Abkühlen lassen und mindestens 1 Stunde kühl stellen.",
      "Vollrahm steif schlagen. Meringueschalen grob zerbröckeln, in Gläser oder auf Teller verteilen und den Schlagrahm darauf geben.",
      "Marronipüree portionenweise durch die Vermicellespresse direkt auf den Rahm drücken und sofort servieren."]
  },
  {
    id: "idee-fruchtsalat", title: "Fruchtsalat mit Limette und Minze", kitchen: "ch", emoji: "apfel", cat: "sweet", tags: ["vegi", "vegan", "quick", "kids"], time: 20, serves: 4,
    note: "Je nach Saison mischen: im Sommer Beeren, Pfirsiche und Melone, im Winter Orangen, Ananas und Kiwi. Äpfel und Bananen zuletzt schneiden; der Limettensaft verhindert, dass sie braun werden.",
    ingr: ["1 Limette", "2 EL Ahornsirup oder Zucker", "4 Zweige Minze", "2 Orangen", "2 Kiwis", "250 g Trauben, kernlos", "200 g Erdbeeren", "2 Äpfel", "2 Bananen"],
    steps: ["Limettenschale fein abreiben, den Saft auspressen und mit dem Ahornsirup in einer grossen Schüssel verrühren. Blätter der Minze abzupfen, fein schneiden und dazugeben.",
      "Orangen mit einem scharfen Messer bis ins Fruchtfleisch schälen, in Scheiben schneiden und den Saft dabei auffangen. Kiwis schälen und in Stücke schneiden, Trauben halbieren, Erdbeeren vierteln.",
      "Äpfel entkernen und würfeln, Bananen in Scheiben schneiden. Alle Früchte sofort mit der Limettensauce mischen.",
      "Zugedeckt 10 Minuten im Kühlschrank ziehen lassen und kühl servieren."]
  },
  {
    id: "idee-apfelkuechlein", title: "Apfelküchlein mit Zimtzucker", kitchen: "ch", emoji: "apfel", cat: "sweet", tags: ["vegi", "kids"], time: 45, serves: 4,
    note: "Mit Apfelwein (Most) oder Bier statt Milch wird der Teig noch luftiger. Gut sind säuerliche, feste Äpfel wie Boskoop, Topaz oder Braeburn; dazu passt warme Vanillesauce.",
    ingr: ["150 g Mehl", "1 EL Zucker", "1 Prise Salz", "2 Eier", "2 dl Milch", "4 säuerliche Äpfel (ca. 600 g)", "4 EL Zucker und 1 TL Zimt zum Wenden", "1 l Öl zum Frittieren", "Vanillesauce zum Servieren"],
    steps: ["Mehl, Zucker und Salz mischen. Eier trennen. Milch und Eigelb dazugeben und zu einem glatten, dickflüssigen Teig rühren. Zugedeckt 20 Minuten quellen lassen.",
      "Äpfel schälen, das Kerngehäuse mit dem Apfelausstecher entfernen und die Äpfel in 1 cm dicke Ringe schneiden. Zucker und Zimt in einem tiefen Teller mischen.",
      "Öl in einer weiten, hohen Pfanne auf 170 °C erhitzen; ohne Thermometer: An einem hineingehaltenen Holzkellenstiel steigen kleine Bläschen auf. Eiweiss steif schlagen und locker unter den Teig ziehen.",
      "Apfelringe portionenweise durch den Teig ziehen, kurz abtropfen lassen und im heissen Öl pro Seite 2–3 Minuten goldbraun backen. Auf Küchenpapier abtropfen lassen.",
      "Noch warm im Zimtzucker wenden und mit Vanillesauce servieren."]
  },
  {
    id: "idee-zwetschgenknoedel", title: "Zwetschgenknödel", kitchen: "de", emoji: "teller", cat: "sweet", tags: ["vegi"], time: 75, serves: 4,
    note: "In Österreich heisst der Quark Topfen, und die Knödel sind dort auch eine süsse Hauptmahlzeit. Zwetschgen haben von August bis Oktober Saison; mit Aprikosen werden daraus Marillenknödel.",
    ingr: ["250 g Magerquark", "40 g Butter, weich", "1 Ei", "1 Prise Salz", "130 g Mehl", "8 reife Zwetschgen", "8 Würfelzucker", "60 g Butter für die Brösel", "80 g Paniermehl", "2 EL Zucker", "½ TL Zimt", "Puderzucker zum Bestäuben"],
    steps: ["Quark in einem sauberen Küchentuch gut ausdrücken. Mit der weichen Butter, Ei, Salz und Mehl zu einem weichen, glatten Teig verkneten. Zugedeckt 30 Minuten kühl stellen.",
      "Zwetschgen seitlich einschneiden, den Stein herauslösen und an seiner Stelle je einen Würfelzucker hineinstecken.",
      "Teig mit bemehlten Händen zu einer Rolle formen und in 8 Stücke teilen. Jedes Stück flach drücken, eine Zwetschge darauflegen, den Teig rundum hochziehen und ohne Risse zu einer glatten Kugel formen.",
      "In einer weiten Pfanne reichlich Salzwasser aufkochen und die Hitze reduzieren. Knödel hineinlegen und im knapp siedenden Wasser 12–15 Minuten ziehen lassen, bis sie an die Oberfläche steigen.",
      "Inzwischen Butter in einer Bratpfanne schmelzen und das Paniermehl darin 3–4 Minuten goldbraun rösten, Zucker und Zimt daruntermischen. Knödel mit der Schaumkelle herausheben, abtropfen lassen, in den Bröseln wälzen und mit Puderzucker bestäuben."]
  },
  {
    id: "idee-milchreis", title: "Milchreis mit Apfelkompott", kitchen: "ch", emoji: "reis", cat: "sweet", tags: ["vegi", "kids", "cheap"], time: 50, serves: 4,
    note: "Milchreis gelingt mit Rundkornreis, der beim Kochen Stärke abgibt; Risottoreis geht zur Not auch. Warm ist er ein Znacht für Kinder, kalt mit etwas Schlagrahm gemischt ein Dessert.",
    ingr: ["1 Bio-Zitrone", "1 Vanilleschote", "1 l Vollmilch", "50 g Zucker", "1 Prise Salz", "200 g Milchreis (Rundkornreis)", "3 Äpfel", "1 dl Apfelsaft", "2 EL Zucker für das Kompott", "1 Zimtstange", "Zimt zum Bestreuen"],
    steps: ["Von der Zitrone mit dem Sparschäler zwei Streifen Schale abschälen. Vanilleschote längs aufschneiden. Milch mit Zucker, Salz, Zitronenschale und Vanilleschote aufkochen.",
      "Milchreis einrieseln lassen und zugedeckt bei kleinster Hitze 35–40 Minuten köcheln. Alle paar Minuten umrühren, damit nichts ansetzt; der Reis soll weich und cremig sein.",
      "Für das Kompott Äpfel schälen, entkernen und würfeln. Mit Apfelsaft, Zucker und Zimtstange zugedeckt 8–10 Minuten weich köcheln.",
      "Vanilleschote und Zitronenschale aus dem Milchreis nehmen. Warm oder kalt mit dem Kompott anrichten und mit Zimt bestreuen."]
  },
  {
    id: "idee-griesskoepfli", title: "Griessköpfli mit Himbeersauce", kitchen: "ch", emoji: "glace", cat: "sweet", tags: ["vegi", "kids", "cheap"], time: 30, serves: 4,
    note: "Ein Schweizer Kinderliebling, der mindestens 3 Stunden im Kühlschrank fest werden muss. Statt Himbeersauce passen auch Zwetschgenkompott oder Caramelsauce.",
    ingr: ["5 dl Milch", "50 g Zucker", "1 Prise Salz", "1 Bio-Zitrone", "80 g Griess (Weichweizengriess)", "1.5 dl Vollrahm", "300 g Himbeeren, frisch oder tiefgekühlt", "3 EL Puderzucker"],
    steps: ["Vier Förmchen (à ca. 2 dl) kalt ausspülen. Milch mit Zucker, Salz und etwas abgeriebener Zitronenschale aufkochen.",
      "Griess unter Rühren einrieseln lassen und bei kleiner Hitze unter ständigem Rühren 5 Minuten köcheln, bis ein dicker Brei entsteht. Vom Herd ziehen und 10 Minuten abkühlen lassen, dabei ab und zu umrühren.",
      "Vollrahm steif schlagen und locker unter den Griess ziehen. In die Förmchen füllen, glatt streichen und zugedeckt mindestens 3 Stunden kühl stellen.",
      "Für die Sauce Himbeeren mit Puderzucker und 1 EL Zitronensaft pürieren und durch ein Sieb streichen. Köpfli mit einem Messer vom Rand lösen, auf Teller stürzen und mit der Sauce servieren."]
  },
  {
    id: "idee-caramelkoepfli", title: "Caramelköpfli", kitchen: "ch", emoji: "glace", cat: "sweet", tags: ["vegi", "kids", "prep"], time: 70, serves: 6,
    note: "Die Schweizer Form der Crème caramel. Mindestens 4 Stunden, besser über Nacht kühl stellen: Dann löst sich der Caramel am Boden und wird beim Stürzen zur Sauce.",
    ingr: ["120 g Zucker für den Caramel", "3 EL Wasser", "5 dl Milch", "1 Vanilleschote", "3 Eier", "2 Eigelb", "60 g Zucker"],
    steps: ["Ofen auf 160 °C vorheizen (Umluft 140 °C). Zucker und Wasser in einer kleinen Pfanne ohne Rühren erhitzen, bis ein goldbrauner Caramel entsteht, etwa 6–8 Minuten. Sofort in 6 ofenfeste Förmchen (à ca. 1.5 dl) verteilen und durch Schwenken den Boden bedecken.",
      "Milch mit der längs aufgeschnittenen Vanilleschote aufkochen, vom Herd ziehen und 10 Minuten ziehen lassen.",
      "Eier, Eigelb und Zucker verrühren, ohne dass es schäumt. Vanilleschote entfernen, die warme Milch unter Rühren dazugiessen und die Masse durch ein Sieb in die Förmchen giessen.",
      "Förmchen in eine tiefe Ofenform stellen und heisses Wasser bis zur halben Höhe angiessen. In der Ofenmitte 35–40 Minuten garen, bis die Creme gestockt ist und in der Mitte nur noch leicht zittert.",
      "Auskühlen lassen und zugedeckt mindestens 4 Stunden kühl stellen. Mit einem Messer dem Rand entlang lösen und auf Teller stürzen."]
  },
  {
    id: "idee-affogato", title: "Affogato al caffè", kitchen: "it", emoji: "glace", cat: "sweet", tags: ["vegi", "quick", "guests"], time: 15, serves: 4,
    note: "Affogato heisst «ertränkt»: Die Glace wird mit heissem Espresso übergossen. Für Kinder heisse Schokolade statt Kaffee nehmen und den Amaretto weglassen.",
    ingr: ["8 kleine Kugeln Vanilleglace", "4 Espresso (je ca. 3 cl), frisch zubereitet", "4 EL Amaretto (nach Belieben)", "4 Amaretti", "20 g dunkle Schokolade, geraspelt"],
    steps: ["Gläser oder Tassen 10 Minuten in den Tiefkühler stellen, damit die Glace darin nicht sofort schmilzt.",
      "Espresso frisch zubereiten. Je zwei Kugeln Vanilleglace in die gekühlten Gläser geben.",
      "Heissen Espresso und nach Belieben einen Schuss Amaretto direkt über die Glace giessen, mit zerbröselten Amaretti und der Schokolade bestreuen und sofort servieren."]
  },
  {
    id: "idee-beeren-crumble", title: "Beeren-Crumble", kitchen: "nord", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids"], time: 50, serves: 6,
    note: "Britischer Ofenklassiker: unten Früchte, oben Streusel. Tiefgekühlte Beeren nicht auftauen, dafür 5 Minuten länger backen; glutenfrei mit gemahlenen Mandeln statt Mehl und glutenfreien Haferflocken.",
    ingr: ["600 g gemischte Beeren, frisch oder tiefgekühlt", "2 EL Zucker", "1 EL Maizena", "1 Bio-Zitrone", "100 g Mehl", "60 g Haferflocken", "80 g Rohzucker", "1 Prise Salz", "½ TL Zimt", "100 g kalte Butter", "Vanilleglace oder flüssiger Rahm zum Servieren"],
    steps: ["Ofen auf 200 °C vorheizen (Umluft 180 °C). Beeren mit Zucker, Maizena und etwas abgeriebener Zitronenschale mischen und in eine Gratinform (ca. 20 × 30 cm) geben.",
      "Mehl, Haferflocken, Rohzucker, Salz und Zimt in einer Schüssel mischen. Butter in kleinen Würfeln dazugeben und mit den Fingerspitzen zu groben Streuseln verreiben.",
      "Streusel gleichmässig über die Beeren streuen. In der Ofenmitte 30–35 Minuten backen, bis die Streusel goldbraun sind und der Fruchtsaft am Rand blubbert.",
      "10 Minuten abkühlen lassen und lauwarm mit Vanilleglace oder flüssigem Rahm servieren."]
  },
  {
    id: "idee-erdbeer-tiramisu", title: "Erdbeer-Tiramisù", kitchen: "it", emoji: "kuchen", cat: "sweet", tags: ["vegi", "guests", "prep"], time: 30, serves: 6,
    note: "Die sommerliche Variante kommt ohne Kaffee und ohne rohe Eier aus und passt darum auch für Kinder. Sie braucht mindestens 3 Stunden im Kühlschrank; ausserhalb der Saison mit tiefgekühlten Himbeeren.",
    ingr: ["500 g Erdbeeren", "2 EL Zucker für die Erdbeeren", "250 g Mascarpone", "250 g Rahmquark", "60 g Zucker", "1 EL Vanillezucker", "1 Bio-Zitrone", "1.5 dl Vollrahm", "1.5 dl Orangensaft", "200 g Löffelbiscuits"],
    steps: ["Erdbeeren rüsten. Ein Viertel davon mit 2 EL Zucker pürieren, den Rest in Scheiben schneiden und eine Handvoll für die Garnitur beiseitelegen.",
      "Mascarpone, Rahmquark, Zucker, Vanillezucker und abgeriebene Zitronenschale glatt rühren. Vollrahm steif schlagen und locker unterziehen.",
      "Orangensaft mit 2 EL Zitronensaft in einem tiefen Teller mischen. Die Hälfte der Löffelbiscuits kurz darin wenden und eine Form von etwa 20 × 30 cm damit auslegen.",
      "Die Hälfte des Erdbeerpürees darüberträufeln, die Hälfte der Erdbeerscheiben darauf verteilen und mit der Hälfte der Creme bedecken. Mit den restlichen Biscuits, Erdbeeren und Creme eine zweite Schicht bilden.",
      "Zugedeckt mindestens 3 Stunden kühl stellen, damit die Biscuits durchziehen. Vor dem Servieren mit den beiseitegelegten Erdbeeren garnieren."]
  },
  {
    id: "idee-mango-lassi-glace", title: "Mango-Lassi-Glace", kitchen: "in", emoji: "glace", cat: "sweet", tags: ["vegi", "kids"], time: 20, serves: 6,
    note: "Gelingt ohne Glacemaschine, braucht aber 4–5 Stunden im Tiefkühler. Reife Mangos duften und geben auf Druck nach; sonst Mangopulpe aus der Dose (Asia-Laden) nehmen.",
    ingr: ["2 reife Mangos (ca. 900 g)", "80 g Zucker", "½ TL Kardamom, gemahlen", "1 Limette", "360 g griechischer Joghurt", "1.5 dl Vollrahm", "2 EL Pistazien, gehackt"],
    steps: ["Mangos schälen, das Fruchtfleisch vom Stein schneiden und mit Zucker, Kardamom und dem Saft der Limette fein pürieren.",
      "Joghurt unterrühren. Vollrahm halbsteif schlagen und locker unter die Mangomasse ziehen.",
      "Masse in eine flache Dose füllen und zugedeckt in den Tiefkühler stellen. Nach 30 Minuten mit einer Gabel kräftig durchrühren und das noch dreimal im gleichen Abstand wiederholen, damit keine groben Eiskristalle entstehen.",
      "Danach weitere 2–3 Stunden fest gefrieren lassen. Vor dem Servieren 10 Minuten antauen lassen, Kugeln abstechen und mit Pistazien bestreuen."]
  },
  {
    id: "idee-schoggifondue", title: "Schoggifondue mit Früchten", kitchen: "ch", emoji: "fondue", cat: "sweet", tags: ["vegi", "quick", "kids"], time: 20, serves: 4,
    note: "Ein Rechaud mit Kerze reicht, damit die Schokolade flüssig bleibt; zu starke Hitze macht sie körnig. Für Erwachsene einen Schuss Kirsch oder Orangenlikör unterrühren.",
    ingr: ["½ Ananas", "250 g Erdbeeren", "2 Birnen", "2 Bananen", "1 EL Zitronensaft", "150 g dunkle Schokolade", "100 g Milchschokolade", "2 dl Vollrahm", "Löffelbiscuits oder Meringues zum Tunken"],
    steps: ["Ananas schälen und in Stücke schneiden, Erdbeeren halbieren. Birnen und Bananen erst kurz vor dem Essen in Stücke schneiden und mit Zitronensaft beträufeln.",
      "Dunkle Schokolade und Milchschokolade grob hacken. Vollrahm im Caquelon oder in einer kleinen Pfanne erhitzen, aber nicht kochen lassen.",
      "Vom Herd ziehen, die Schokolade dazugeben und etwa 3 Minuten rühren, bis sie geschmolzen und glatt ist.",
      "Caquelon aufs Rechaud mit kleiner Flamme stellen. Früchte, Löffelbiscuits und Meringues auf Gabeln stecken und in die Schokolade tunken."]
  },
  {
    id: "idee-coupe-daenemark", title: "Coupe Dänemark", kitchen: "ch", emoji: "glace", cat: "sweet", tags: ["vegi", "quick", "kids"], time: 15, serves: 4,
    note: "Ein Klassiker auf jeder Schweizer Dessertkarte: Vanilleglace mit heisser Schoggisauce und Schlagrahm. Übrige Sauce hält sich zugedeckt im Kühlschrank drei Tage und wird im warmen Wasserbad wieder flüssig.",
    ingr: ["150 g dunkle Schokolade", "2.5 dl Vollrahm", "0.5 dl Milch", "1 EL Puderzucker", "2 EL Mandeln, gehobelt", "8 Kugeln Vanilleglace"],
    steps: ["Schokolade fein hacken. 1 dl Vollrahm mit der Milch aufkochen, vom Herd ziehen, die Schokolade dazugeben und glatt rühren. Sauce warm halten.",
      "Restlichen Vollrahm mit dem Puderzucker steif schlagen. Mandeln in einer Bratpfanne ohne Fett 2–3 Minuten goldbraun rösten.",
      "Je zwei Kugeln Vanilleglace in Coupegläser geben, mit der heissen Schoggisauce übergiessen, Schlagrahm daraufgeben und mit den Mandeln bestreuen. Sofort servieren."]
  },
  {
    id: "idee-basler-laeckerli-parfait", title: "Basler Läckerli-Parfait", kitchen: "ch", emoji: "glace", cat: "sweet", tags: ["vegi", "guests", "prep"], time: 35, serves: 8,
    note: "Halbgefrorenes mit zerbröselten Läckerli, das sich bis zu einer Woche im Voraus machen lässt; es braucht mindestens 6 Stunden im Tiefkühler. Dazu passen Orangenfilets oder Zwetschgenkompott.",
    ingr: ["150 g Basler Läckerli", "4 Eigelb", "100 g Zucker", "1 Bio-Orange", "2 EL Kirsch (nach Belieben)", "3 dl Vollrahm"],
    steps: ["Eine Cakeform (ca. 1 l) mit Klarsichtfolie auslegen. Läckerli in einen Gefrierbeutel geben und mit dem Wallholz grob zerbröseln.",
      "Eigelb und Zucker in einer Schüssel über dem knapp siedenden Wasserbad 6–8 Minuten zu einer dicken, hellen Creme aufschlagen. Schüssel in kaltes Wasser stellen und weiterschlagen, bis die Masse kalt ist.",
      "Schale der Orange fein dazureiben, Kirsch und zwei Drittel der Läckerli unterrühren. Vollrahm steif schlagen und locker unterziehen.",
      "Masse in die Form füllen, glatt streichen, mit den restlichen Läckerli bestreuen und zugedeckt mindestens 6 Stunden gefrieren.",
      "Zum Servieren 10 Minuten antauen lassen, aus der Form stürzen, Folie entfernen und mit einem in heisses Wasser getauchten Messer in Scheiben schneiden."]
  },
  {
    id: "idee-birnen-rotwein", title: "Birnen in Rotwein", kitchen: "fr", emoji: "apfel", cat: "sweet", tags: ["vegi", "vegan", "guests", "prep"], time: 50, serves: 4,
    note: "Französischer Klassiker, der sich gut vorbereiten lässt: Über Nacht im Sud werden die Birnen tiefrot. Ohne Alkohol mit Traubensaft und der Hälfte Zucker; dazu passt Vanilleglace oder, vegan, ein Sorbet.",
    ingr: ["1 Bio-Orange", "1 Vanilleschote", "7.5 dl Rotwein", "120 g Zucker", "1 Zimtstange", "2 Gewürznelken", "1 Sternanis", "4 feste Birnen (z. B. Kaiser Alexander)"],
    steps: ["Mit dem Sparschäler drei Streifen Schale von der Orange abschälen und den Saft auspressen. Vanilleschote längs aufschneiden.",
      "Rotwein, Orangensaft, Orangenschale, Zucker, Zimtstange, Gewürznelken, Sternanis und Vanilleschote in einer Pfanne aufkochen, in die die Birnen stehend knapp hineinpassen.",
      "Birnen schälen, den Stiel dranlassen und den Boden gerade abschneiden. In den Sud stellen und zugedeckt bei kleiner Hitze 20–30 Minuten ziehen lassen, bis sie weich sind; dabei ab und zu drehen.",
      "Birnen herausheben. Sud offen bei starker Hitze etwa 10 Minuten zu einem leicht dickflüssigen Sirup einkochen.",
      "Birnen in den Sirup zurücklegen und darin auskühlen lassen, am besten über Nacht im Kühlschrank. Lauwarm oder kalt mit etwas Sirup servieren."]
  },
  {
    id: "idee-zabaione", title: "Zabaione mit Beeren", kitchen: "it", emoji: "glace", cat: "sweet", tags: ["vegi", "quick", "guests"], time: 20, serves: 4,
    note: "Die warme Weinschaumcreme wird sofort serviert, solange sie luftig ist. Das Wasserbad darf nur knapp sieden, sonst stockt das Eigelb; ohne Alkohol mit Orangensaft und 1 EL Zitronensaft.",
    ingr: ["300 g Beeren nach Saison", "4 Eigelb", "60 g Zucker", "1 Prise Salz", "1 dl Marsala oder süsser Weisswein"],
    steps: ["Beeren verlesen, grössere halbieren und in vier Gläser oder Schalen verteilen.",
      "Eigelb, Zucker und Salz in einer Metallschüssel mit dem Schwingbesen hell verrühren. Marsala dazugiessen.",
      "Schüssel über ein knapp siedendes Wasserbad setzen und die Masse 8–10 Minuten kräftig schlagen, bis sie dick und schaumig ist und ihr Volumen etwa verdreifacht hat.",
      "Zabaione sofort über die Beeren giessen und warm servieren."]
  },

  /* ---------- Kuchen & Torten ---------- */
  {
    id: "idee-schoggikuchen-ohne-mehl", title: "Schoggikuchen ohne Mehl", kitchen: "fr", emoji: "schoggi", cat: "sweet", tags: ["vegi", "guests"], time: 55, serves: 8,
    note: "Innen fondantartig feucht und von Natur aus glutenfrei. Der Kuchen sinkt beim Abkühlen etwas ein, das gehört so; mit Schlagrahm und Beeren servieren.",
    ingr: ["200 g dunkle Schokolade (ca. 70 % Kakao)", "150 g Butter und etwas für die Form", "4 Eier", "150 g Zucker", "1 Prise Salz", "2 EL Kakaopulver", "Puderzucker zum Bestäuben"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Boden einer Springform (24 cm) mit Backpapier belegen, den Rand mit Butter einfetten.",
      "Schokolade hacken und mit der Butter in einer Schüssel über dem warmen Wasserbad schmelzen. Glatt rühren und etwas abkühlen lassen.",
      "Eier trennen. Eigelb mit der Hälfte des Zuckers 3 Minuten hell aufschlagen, die Schokoladenbutter unterrühren, das Kakaopulver darübersieben und unterheben.",
      "Eiweiss mit dem Salz steif schlagen, restlichen Zucker einrieseln lassen und weiterschlagen, bis der Schnee glänzt. In zwei Portionen locker unter die Schokolademasse ziehen.",
      "Masse in die Form füllen und in der Ofenmitte 25–30 Minuten backen; die Mitte soll noch leicht feucht sein. In der Form auskühlen lassen und mit Puderzucker bestäuben."]
  },
  {
    id: "idee-zitronencake", title: "Zitronencake", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids"], time: 80, serves: 8,
    note: "Saftig wird der Cake, wenn er noch warm mit Zitronensirup getränkt wird. In Folie gewickelt bleibt er vier Tage frisch und lässt sich gut einfrieren.",
    ingr: ["2 Bio-Zitronen", "200 g weiche Butter und etwas für die Form", "200 g Zucker", "1 Prise Salz", "4 Eier", "250 g Mehl", "2 TL Backpulver", "0.5 dl Milch", "2 EL Zucker für den Sirup", "150 g Puderzucker"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Eine Cakeform (ca. 30 cm) mit Butter einfetten oder mit Backpapier auslegen. Schale der Zitronen fein abreiben und den Saft auspressen.",
      "Butter, Zucker und Salz mit dem Handrührgerät 5 Minuten cremig rühren. Eier einzeln dazugeben und jeweils gut unterrühren, dann die Zitronenschale.",
      "Mehl und Backpulver mischen und abwechselnd mit der Milch und 2 EL Zitronensaft kurz unterrühren. Teig in die Form füllen und in der unteren Ofenhälfte 50–55 Minuten backen (Stäbchenprobe).",
      "Für den Sirup 3 EL Zitronensaft mit 2 EL Zucker aufkochen. Den warmen Cake mit einem Holzspiesschen mehrmals einstechen und mit dem Sirup beträufeln. 10 Minuten in der Form ruhen lassen, dann auf ein Gitter stürzen.",
      "Puderzucker mit dem restlichen Zitronensaft zu einer dickflüssigen Glasur verrühren und über den ausgekühlten Cake giessen."]
  },
  {
    id: "idee-bananenbrot", title: "Bananenbrot", kitchen: "amerika", emoji: "kuchen", cat: "sweet", tags: ["vegi", "vegan", "kids", "cheap"], time: 75, serves: 8,
    note: "Je brauner die Bananen, desto süsser und saftiger wird der Kuchen – ganz ohne Eier und Butter. Natron gibt es im Backregal; ohne Natron 1 TL Backpulver mehr nehmen.",
    ingr: ["3 sehr reife Bananen (ca. 350 g ohne Schale)", "0.8 dl Rapsöl und etwas für die Form", "120 g Rohzucker", "1 dl Hafermilch", "1 Prise Salz", "250 g Mehl", "2 TL Backpulver", "½ TL Natron", "1 TL Zimt", "80 g Baumnüsse, grob gehackt"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Eine Cakeform (ca. 28 cm) mit Öl einfetten oder mit Backpapier auslegen.",
      "Bananen mit einer Gabel fein zerdrücken. Rapsöl, Rohzucker, Hafermilch und Salz dazugeben und gut verrühren.",
      "Mehl, Backpulver, Natron und Zimt mischen und mit dem Gummischaber nur kurz unter die Bananenmasse rühren, bis keine trockenen Stellen mehr da sind. Baumnüsse unterheben.",
      "Teig in die Form füllen und in der Ofenmitte 50–55 Minuten backen, bis ein Holzspiesschen sauber herauskommt. Wird die Oberfläche zu früh dunkel, mit Alufolie abdecken.",
      "10 Minuten in der Form ruhen lassen, dann herauslösen und auf einem Gitter auskühlen lassen."]
  },
  {
    id: "idee-carrot-cake", title: "Carrot Cake mit Frischkäse-Glasur", kitchen: "amerika", emoji: "kuchen", cat: "sweet", tags: ["vegi", "guests"], time: 90, serves: 10,
    note: "Anders als die Aargauer Rüeblitorte wird der amerikanische Carrot Cake mit Öl, Gewürzen und Baumnüssen gebacken und trägt eine Frischkäsehaube. Erst ganz ausgekühlt glasieren und im Kühlschrank aufbewahren.",
    ingr: ["300 g Rüebli", "3 Eier", "200 g Rohzucker", "1.8 dl Rapsöl und etwas für die Form", "250 g Mehl", "2 TL Backpulver", "½ TL Natron", "2 TL Zimt", "½ TL Ingwerpulver", "1 Prise Salz", "100 g Baumnüsse, grob gehackt", "200 g Frischkäse nature, zimmerwarm", "50 g weiche Butter", "100 g Puderzucker", "1 TL Zitronensaft"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Boden einer Springform (24 cm) mit Backpapier belegen, den Rand mit wenig Öl einfetten. Rüebli schälen und fein reiben.",
      "Eier und Rohzucker 3 Minuten schaumig rühren, dann das Rapsöl in dünnem Strahl unterrühren.",
      "Mehl, Backpulver, Natron, Zimt, Ingwerpulver und Salz mischen und kurz unter die Eimasse rühren. Rüebli und Baumnüsse unterheben.",
      "Teig in die Form füllen und in der Ofenmitte 45–50 Minuten backen (Stäbchenprobe). In der Form 10 Minuten abkühlen lassen, dann herauslösen und ganz auskühlen lassen.",
      "Für die Glasur Frischkäse, Butter, Puderzucker und Zitronensaft kurz glatt rühren – nicht zu lange, sonst wird sie flüssig. Auf dem Kuchen verstreichen und bis zum Servieren kühl stellen."]
  },
  {
    id: "idee-new-york-cheesecake", title: "New York Cheesecake", kitchen: "amerika", emoji: "kuchen", cat: "sweet", tags: ["vegi", "guests", "prep"], time: 100, serves: 10,
    note: "Der dichte, cremige Käsekuchen kühlt nach dem Backen 1 Stunde im Ofen ab und braucht dann mindestens 6 Stunden im Kühlschrank. Statt amerikanischer Graham Crackers kommen hier Butterbiscuits in den Boden.",
    ingr: ["200 g Butterbiscuits (z. B. Petit Beurre)", "80 g Butter, geschmolzen", "600 g Frischkäse nature, zimmerwarm", "150 g Zucker", "2 EL Maizena", "1 Bio-Zitrone", "1 EL Vanillezucker", "3 Eier", "1.8 dl Sauerrahm"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Boden einer Springform (24 cm) mit Backpapier belegen. Butterbiscuits im Cutter oder im Gefrierbeutel mit dem Wallholz fein zerbröseln und mit der Butter mischen.",
      "Brösel auf dem Formboden verteilen, gut andrücken und in der Ofenmitte 10 Minuten vorbacken. Ofen auf 160 °C zurückschalten (Umluft 140 °C).",
      "Frischkäse, Zucker, Maizena, abgeriebene Zitronenschale, 1 EL Zitronensaft und Vanillezucker glatt rühren. Eier einzeln kurz unterrühren, dann den Sauerrahm. Nur so lange rühren wie nötig, damit wenig Luft in die Masse kommt.",
      "Masse auf den Boden giessen und in der Ofenmitte 55–60 Minuten backen, bis der Rand fest ist und die Mitte beim Rütteln noch leicht wackelt.",
      "Ofen ausschalten und den Kuchen bei einen Spalt geöffneter Tür 1 Stunde darin abkühlen lassen. Mit einem Messer vom Formrand lösen, ganz auskühlen lassen und zugedeckt mindestens 6 Stunden kühl stellen."]
  },
  {
    id: "idee-linzertorte", title: "Linzertorte", kitchen: "de", emoji: "waehe", cat: "sweet", tags: ["vegi", "guests", "prep"], time: 105, serves: 10,
    note: "Die gewürzte Nusstorte aus Linz schmeckt am besten, wenn sie zwei Tage durchgezogen ist, und hält sich gut verpackt eine Woche. Statt Himbeer- passt auch Johannisbeerkonfitüre.",
    ingr: ["200 g Mehl", "200 g gemahlene Haselnüsse", "150 g Zucker", "1 TL Zimt", "¼ TL Nelkenpulver", "1 EL Kakaopulver", "1 Prise Salz", "1 Bio-Zitrone", "200 g kalte Butter", "1 Ei", "350 g Himbeerkonfitüre", "1 Eigelb zum Bestreichen", "Puderzucker zum Bestäuben"],
    steps: ["Mehl, Haselnüsse, Zucker, Zimt, Nelkenpulver, Kakaopulver und Salz mischen und die Zitronenschale dazureiben. Kalte Butter in Stücken dazugeben und zwischen den Fingern krümelig verreiben.",
      "Ei dazugeben und alles rasch zu einem Teig zusammenfügen, nicht kneten. Flach drücken, in Folie wickeln und 30 Minuten kühl stellen.",
      "Ofen auf 180 °C vorheizen (Umluft 160 °C). Zwei Drittel des Teigs zwischen Backpapier auswallen und eine Tarte- oder Springform (26 cm) damit auslegen, dabei einen 2 cm hohen Rand formen.",
      "Himbeerkonfitüre glatt rühren und auf dem Boden verstreichen. Restlichen Teig auswallen, in 1.5 cm breite Streifen schneiden und gitterartig über die Konfitüre legen. Streifen mit verquirltem Eigelb bestreichen.",
      "In der unteren Ofenhälfte 40–45 Minuten backen. In der Form auskühlen lassen und vor dem Servieren mit Puderzucker bestäuben."]
  },
  {
    id: "idee-schwarzwaelder-kirschtorte", title: "Schwarzwälder Kirschtorte", kitchen: "de", emoji: "kuchen", cat: "sweet", tags: ["vegi", "guests"], time: 120, serves: 12,
    note: "Der Klassiker lebt vom Kirsch – für Kinder durch Kirschensaft ersetzen. Den Schokoladenbiscuit am besten am Vortag backen: Ganz ausgekühlt lässt er sich sauber in drei Böden schneiden.",
    ingr: ["5 Eier", "150 g Zucker", "1 Prise Salz", "100 g Mehl", "30 g Maizena", "30 g Kakaopulver", "1 TL Backpulver", "1 Glas Sauerkirschen (ca. 350 g abgetropft)", "2 EL Zucker für die Kirschen", "2 EL Maizena für die Kirschen", "6 EL Kirsch", "7 dl Vollrahm", "3 EL Puderzucker", "2 Päckli Rahmhalter", "50 g dunkle Schokolade"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Boden einer Springform (26 cm) mit Backpapier belegen. Eier, Zucker und Salz mit dem Handrührgerät 8–10 Minuten zu einer sehr hellen, dicken Masse aufschlagen.",
      "Mehl, Maizena, Kakaopulver und Backpulver darübersieben und mit dem Gummischaber locker unterheben. In die Form füllen und in der Ofenmitte 30–35 Minuten backen (Stäbchenprobe). Ganz auskühlen lassen und zweimal waagrecht durchschneiden.",
      "Sauerkirschen abtropfen lassen und 2.5 dl Saft auffangen. Saft mit Zucker und Maizena unter Rühren aufkochen und 1 Minute köcheln, bis er bindet. Kirschen unterrühren, 12 schöne für die Garnitur beiseitelegen und abkühlen lassen.",
      "Vollrahm mit Puderzucker und Rahmhalter steif schlagen. Den untersten Boden mit 2 EL Kirsch beträufeln, die Kirschmasse darauf verteilen und mit einer Schicht Rahm bedecken.",
      "Zweiten Boden auflegen, mit 2 EL Kirsch tränken und mit Rahm bestreichen. Dritten Boden auflegen, mit dem restlichen Kirsch tränken und die Torte rundum mit Rahm einstreichen; etwas Rahm zum Garnieren in einen Spritzsack füllen.",
      "Torte mit 12 Rahmtupfen und den beiseitegelegten Kirschen garnieren. Schokolade mit dem Sparschäler zu Spänen hobeln und darüberstreuen. Vor dem Anschneiden mindestens 2 Stunden kühl stellen."]
  },
  {
    id: "idee-zwetschgenwaehe", title: "Zwetschgenwähe", kitchen: "ch", emoji: "waehe", cat: "sweet", tags: ["vegi", "cheap"], time: 95, serves: 6,
    note: "Diese Wähe kommt ohne Guss aus: Die Zwetschgen stehen dicht im knusprigen Teig und werden erst nach dem Backen gezuckert. Wer es eilig hat, nimmt einen fertigen Kuchenteig.",
    ingr: ["250 g Mehl", "½ TL Salz", "100 g kalte Butter", "1 dl kaltes Wasser", "1 kg Zwetschgen", "3 EL gemahlene Haselnüsse", "2 EL Paniermehl", "3 EL Zucker", "1 TL Zimt", "2 dl Rahm, geschlagen, zum Servieren"],
    steps: ["Mehl und Salz mischen. Butter in Stücken dazugeben und zwischen den Fingern zu einer krümeligen Masse verreiben. Wasser dazugiessen und rasch zu einem Teig zusammenfügen, nicht kneten. Flach drücken und zugedeckt 30 Minuten kühl stellen.",
      "Ofen auf 220 °C Unter- und Oberhitze vorheizen. Zwetschgen halbieren, entsteinen und an der Spitze leicht einschneiden.",
      "Teig rund auswallen (ca. 32 cm) und ein mit Backpapier belegtes Wähenblech (28 cm) damit auslegen. Boden mit einer Gabel einstechen und mit Haselnüssen und Paniermehl bestreuen.",
      "Zwetschgen mit der Schnittfläche nach oben dicht und schräg stehend auf den Teig legen. Im unteren Teil des Ofens 35–40 Minuten backen, bis der Teigrand goldbraun ist.",
      "Zucker und Zimt mischen und sofort über die heisse Wähe streuen. Lauwarm mit dem geschlagenen Rahm servieren."]
  },
  {
    id: "idee-marmorkuchen", title: "Marmorkuchen", kitchen: "de", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids", "cheap"], time: 80, serves: 10,
    note: "Der Klassiker vom Kaffeetisch. Für ein schönes Muster den dunklen Teig nur mit einer Gabel spiralförmig durch den hellen ziehen, nicht verrühren.",
    ingr: ["250 g weiche Butter und etwas für die Form", "220 g Zucker", "1 EL Vanillezucker", "1 Prise Salz", "4 Eier", "300 g Mehl und etwas für die Form", "3 TL Backpulver", "1.2 dl Milch", "2 EL Kakaopulver", "1 EL Zucker für den dunklen Teig", "Puderzucker zum Bestäuben"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Eine Gugelhopfform (ca. 24 cm) gut mit Butter einfetten und mit Mehl bestäuben.",
      "Butter, Zucker, Vanillezucker und Salz mit dem Handrührgerät 5 Minuten hell und cremig rühren. Eier einzeln dazugeben und jedes gut unterrühren.",
      "Mehl und Backpulver mischen und abwechselnd mit 1 dl Milch kurz unterrühren. Gut die Hälfte des Teigs in die Form füllen.",
      "Kakaopulver, Zucker und die restliche Milch unter den übrigen Teig rühren und auf den hellen Teig geben. Mit einer Gabel spiralförmig durch beide Teige ziehen.",
      "In der unteren Ofenhälfte 50–55 Minuten backen (Stäbchenprobe). 10 Minuten in der Form ruhen lassen, auf ein Gitter stürzen, auskühlen lassen und mit Puderzucker bestäuben."]
  },
  {
    id: "idee-gugelhopf", title: "Gugelhopf", kitchen: "fr", emoji: "kuchen", cat: "sweet", tags: ["vegi", "guests"], time: 190, serves: 10,
    note: "Der Kougelhopf aus dem Elsass ist ein Hefekuchen mit Sultaninen und Mandeln, traditionell aus der Tonform; eine Gugelhopfform aus Metall geht genauso. Am zweiten Tag zum Kaffee schmeckt er noch besser.",
    ingr: ["100 g Sultaninen", "2 EL Kirsch", "500 g Weissmehl", "80 g Zucker", "1 TL Salz", "20 g Hefe (½ Würfel)", "2 dl Milch, lauwarm", "2 Eier", "150 g weiche Butter und etwas für die Form", "25 g ganze Mandeln", "Puderzucker zum Bestäuben"],
    steps: ["Sultaninen mit dem Kirsch mischen und ziehen lassen. Weissmehl, Zucker und Salz in einer Schüssel mischen. Eier verquirlen, Hefe in der lauwarmen Milch auflösen und beides zum Mehl geben.",
      "Mit der Küchenmaschine oder von Hand etwa 10 Minuten kneten, dann die weiche Butter stückweise einarbeiten, bis der Teig glänzt und sich vom Schüsselrand löst. Sultaninen kurz unterkneten.",
      "Zugedeckt an einem warmen Ort 1 Stunde aufgehen lassen. Gugelhopfform (ca. 24 cm) gut mit Butter einfetten und in jede Rille eine Mandel legen.",
      "Teig kurz zusammenstossen, zu einem Ring formen und in die Form legen. Zugedeckt nochmals 45 Minuten aufgehen lassen, bis er fast den Rand erreicht. Ofen auf 180 °C vorheizen (Umluft 160 °C).",
      "In der unteren Ofenhälfte 40–45 Minuten backen; wird er zu dunkel, mit Alufolie abdecken. 10 Minuten in der Form ruhen lassen, stürzen, auskühlen lassen und mit Puderzucker bestäuben."]
  },
  {
    id: "idee-brownies", title: "Brownies", kitchen: "amerika", emoji: "schoggi", cat: "sweet", tags: ["vegi", "kids"], time: 45, serves: 8,
    note: "Fertig sind sie, wenn ein Holzspiesschen in der Mitte noch feuchte Krümel zeigt – lieber zu kurz als zu lang backen. Glutenfrei mit gemahlenen Mandeln statt Mehl.",
    ingr: ["200 g dunkle Schokolade", "150 g Butter", "200 g Rohzucker", "3 Eier", "1 Prise Salz", "100 g Mehl", "30 g Kakaopulver", "100 g Baumnüsse oder Pekannüsse, grob gehackt"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Eine quadratische Form (ca. 24 × 24 cm) mit Backpapier auslegen.",
      "Schokolade hacken und mit der Butter bei kleiner Hitze schmelzen, glatt rühren und 5 Minuten abkühlen lassen.",
      "Rohzucker, Eier und Salz kräftig verrühren, bis die Masse leicht dicklich ist, dann die Schokoladenbutter unterrühren.",
      "Mehl und Kakaopulver darübersieben und nur kurz unterrühren. Baumnüsse unterheben und den Teig in die Form streichen.",
      "In der Ofenmitte 20–25 Minuten backen. In der Form auskühlen lassen und in 16 Stücke schneiden."]
  },
  {
    id: "idee-engadiner-nusstorte", title: "Engadiner Nusstorte", kitchen: "ch", emoji: "waehe", cat: "sweet", tags: ["vegi", "guests", "prep"], time: 120, serves: 12,
    note: "Die gedeckte Baumnusstorte mit Caramelfüllung hält sich luftdicht verpackt zwei bis drei Wochen und ist darum ein beliebtes Mitbringsel aus dem Engadin. Erst ganz ausgekühlt anschneiden.",
    ingr: ["300 g Mehl", "150 g Zucker", "1 Prise Salz", "200 g kalte Butter", "1 Ei", "250 g Zucker für die Füllung", "2.5 dl Rahm", "250 g Baumnüsse, grob gehackt", "2 EL Honig", "1 Eigelb zum Bestreichen"],
    steps: ["Mehl, Zucker und Salz mischen. Kalte Butter in Stücken dazugeben und mit den Fingern zu einer krümeligen Masse verreiben. Ei dazugeben und rasch zu einem Teig zusammenfügen. Flach drücken und zugedeckt 30 Minuten kühl stellen.",
      "Für die Füllung den Zucker in einer weiten Pfanne ohne Rühren schmelzen und zu einem hellbraunen Caramel werden lassen. Pfanne vom Herd ziehen und den Rahm vorsichtig dazugiessen – es spritzt stark.",
      "Bei kleiner Hitze rühren, bis sich der Caramel ganz aufgelöst hat. Baumnüsse und Honig dazugeben und unter Rühren 5 Minuten köcheln. Etwas abkühlen lassen.",
      "Ofen auf 180 °C vorheizen (Umluft 160 °C). Gut die Hälfte des Teigs auswallen und eine Springform (24 cm) damit auslegen, dabei einen 3 cm hohen Rand formen. Füllung darauf verteilen.",
      "Restlichen Teig rund auswallen und als Deckel auflegen, die Ränder gut andrücken. Mit Eigelb bestreichen und mit einer Gabel mehrmals einstechen.",
      "In der unteren Ofenhälfte 40–45 Minuten goldbraun backen. In der Form vollständig auskühlen lassen."]
  },

  /* ---------- Schweizer Gebäck, Guetzli & Brot ---------- */
  {
    id: "idee-butterzopf", title: "Butterzopf", kitchen: "ch", emoji: "brot", cat: "breakfast", tags: ["vegi", "kids"], time: 190, serves: 8,
    note: "Der Zopf gehört zum Sonntagszmorge. Zopfmehl ist Weissmehl mit etwas Dinkelmehl, reines Weissmehl geht auch; 10 Minuten im Kühlschrank vor dem Backen helfen, dass er die Form behält.",
    ingr: ["500 g Zopfmehl", "10 g Salz (1½ TL)", "1 TL Zucker", "20 g Hefe (½ Würfel)", "3 dl Milch, lauwarm", "60 g weiche Butter", "1 Eigelb", "1 EL Milch zum Bestreichen"],
    steps: ["Zopfmehl, Salz und Zucker in einer Schüssel mischen. Hefe in der lauwarmen Milch auflösen, mit der weichen Butter dazugeben und etwa 10 Minuten zu einem weichen, glatten Teig kneten.",
      "Zugedeckt bei Raumtemperatur etwa 1½ Stunden aufgehen lassen, bis sich der Teig verdoppelt hat.",
      "Teig halbieren und zu zwei gleich langen Strängen von je etwa 60 cm rollen, in der Mitte dicker als an den Enden. Zu einem Zweistrangzopf flechten und auf ein Blech mit Backpapier legen.",
      "Eigelb mit der Milch verquirlen, den Zopf damit bestreichen und zugedeckt nochmals 30 Minuten aufgehen lassen. Ofen auf 200 °C vorheizen (Umluft 180 °C).",
      "Zopf ein zweites Mal bestreichen und in der unteren Ofenhälfte 35–40 Minuten backen, bis er goldbraun ist und beim Klopfen auf die Unterseite hohl klingt. Auf einem Gitter auskühlen lassen."]
  },
  {
    id: "idee-bauernbrot", title: "Bauernbrot", kitchen: "ch", emoji: "brot", cat: "breakfast", tags: ["vegi", "vegan", "cheap"], time: 205, serves: 8,
    note: "Ruchmehl ist das dunkle Schweizer Brotmehl mit viel Geschmack. Erst ganz ausgekühlt anschneiden; mit 1 TL Kümmel oder Brotgewürz im Teig schmeckt es noch kräftiger.",
    ingr: ["400 g Ruchmehl", "100 g Roggenmehl", "10 g Salz (1½ TL)", "10 g Hefe (¼ Würfel)", "3.5 dl Wasser, lauwarm"],
    steps: ["Ruchmehl, Roggenmehl und Salz mischen. Hefe im lauwarmen Wasser auflösen, dazugiessen und etwa 10 Minuten zu einem weichen, leicht klebrigen Teig kneten.",
      "Zugedeckt an einem warmen Ort 1½ Stunden aufgehen lassen, bis sich der Teig etwa verdoppelt hat.",
      "Teig auf wenig Mehl ein paarmal zusammenfalten und zu einer straffen Kugel formen. Mit dem Schluss nach oben in ein bemehltes Gärkörbchen oder eine mit einem bemehlten Tuch ausgelegte Schüssel legen und zugedeckt 45 Minuten gehen lassen.",
      "Inzwischen den Ofen mit einem Blech auf der zweituntersten Rille auf 240 °C Unter- und Oberhitze vorheizen und eine ofenfeste Schale mit Wasser auf den Ofenboden stellen.",
      "Brot auf ein Stück Backpapier stürzen, kreuzweise einschneiden und mit dem Papier aufs heisse Blech ziehen. 10 Minuten backen, dann auf 200 °C zurückschalten und weitere 35 Minuten backen, bis es beim Klopfen auf die Unterseite hohl klingt. Auf einem Gitter auskühlen lassen."]
  },
  {
    id: "idee-dinkelbroetli", title: "Dinkelbrötli mit Kernen", kitchen: "ch", emoji: "brot", cat: "breakfast", tags: ["vegi", "vegan"], time: 135, serves: 5,
    note: "Dinkelteig mag kein langes Kneten: 5 Minuten reichen, sonst wird er klebrig. Die 10 Brötli lassen sich gut einfrieren und gefroren 10 Minuten bei 180 °C aufbacken.",
    ingr: ["500 g Dinkelmehl, hell", "10 g Salz (1½ TL)", "60 g Sonnenblumenkerne", "15 g Hefe", "3.2 dl Wasser, lauwarm", "2 EL Olivenöl", "40 g Kürbiskerne zum Bestreuen"],
    steps: ["Dinkelmehl, Salz und Sonnenblumenkerne mischen. Hefe im lauwarmen Wasser auflösen und mit dem Olivenöl dazugeben. Etwa 5 Minuten zu einem weichen, glatten Teig kneten.",
      "Zugedeckt an einem warmen Ort 1 Stunde aufgehen lassen, bis sich der Teig verdoppelt hat.",
      "Teig in 10 Stücke teilen und mit leicht bemehlten Händen zu straffen Kugeln formen. Oberseite mit Wasser bepinseln, in die Kürbiskerne drücken und mit Abstand auf ein Blech mit Backpapier setzen.",
      "Zugedeckt nochmals 30 Minuten aufgehen lassen. Inzwischen den Ofen auf 220 °C vorheizen (Umluft 200 °C).",
      "Brötli mit Wasser besprühen, kreuzweise einschneiden und in der Ofenmitte 18–20 Minuten backen, bis sie goldbraun sind und hohl klingen. Auf einem Gitter auskühlen lassen."]
  },
  {
    id: "idee-chraebeli", title: "Chräbeli", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi"], time: 75, serves: 8,
    note: "Die Anisguetzli müssen vor dem Backen über Nacht trocknen, sonst bekommen sie keine «Füessli». Ganze Anissamen gibt es im Gewürzregal; ergibt etwa 50 Stück.",
    ingr: ["2 Eier", "250 g Puderzucker", "1 Prise Salz", "1 EL Anissamen", "1 EL Kirsch", "300 g Mehl"],
    steps: ["Eier, Puderzucker und Salz mit dem Handrührgerät etwa 10 Minuten zu einer hellen, dicken Masse rühren. Anissamen und Kirsch unterrühren.",
      "Mehl dazusieben und zu einem weichen, glatten Teig zusammenfügen. Ist er zu klebrig, etwas Mehl dazugeben.",
      "Teig portionenweise zu fingerdicken Rollen formen und schräg in 6 cm lange Stücke schneiden. Jedes Stück auf einer Seite zwei- bis dreimal schräg einschneiden und leicht biegen, sodass sich die Einschnitte öffnen.",
      "Auf gut eingefettete oder mit Backpapier belegte Bleche legen und bei Raumtemperatur 24 Stunden trocknen lassen.",
      "Ofen auf 150 °C Unter- und Oberhitze vorheizen. Chräbeli blechweise in der Ofenmitte 20–25 Minuten backen; sie sollen kaum Farbe annehmen. Auf einem Gitter auskühlen lassen."]
  },
  {
    id: "idee-mailaenderli", title: "Mailänderli", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids"], time: 120, serves: 8,
    note: "Klassische Schweizer Weihnachtsguetzli mit Zitronenduft. Für den typischen Glanz zweimal mit Eigelb bestreichen und dazwischen kurz antrocknen lassen; ergibt etwa 60 Stück.",
    ingr: ["250 g weiche Butter", "220 g Zucker", "1 Prise Salz", "1 Bio-Zitrone", "2 Eier", "500 g Mehl", "2 Eigelb zum Bestreichen"],
    steps: ["Butter mit Zucker und Salz cremig rühren. Zitronenschale dazureiben, Eier einzeln dazugeben und gut unterrühren.",
      "Mehl dazugeben und rasch zu einem Teig zusammenfügen, nicht kneten. Flach drücken, in Folie wickeln und 1 Stunde kühl stellen.",
      "Ofen auf 200 °C vorheizen (Umluft 180 °C). Teig portionenweise auf wenig Mehl 7 mm dick auswallen, Formen ausstechen und auf Bleche mit Backpapier legen.",
      "Eigelb verquirlen und die Guetzli zweimal damit bestreichen, dazwischen kurz antrocknen lassen. Bleche 10 Minuten kühl stellen, so behalten die Mailänderli ihre Form.",
      "Blechweise in der Ofenmitte 8–10 Minuten hellgelb backen. Auf einem Gitter auskühlen lassen."]
  },
  {
    id: "idee-basler-brunsli", title: "Basler Brunsli", kitchen: "ch", emoji: "schoggi", cat: "sweet", tags: ["vegi"], time: 50, serves: 8,
    note: "Die Schokoladenguetzli aus Basel kommen ohne Mehl aus und sind darum glutenfrei. Vor dem Backen einige Stunden trocknen lassen, dann bleiben sie innen weich; ergibt etwa 40 Stück.",
    ingr: ["250 g gemahlene Mandeln", "250 g Zucker und etwas zum Auswallen", "1 Prise Salz", "2 EL Kakaopulver", "½ TL Zimt", "¼ TL Nelkenpulver", "100 g dunkle Schokolade", "2 Eiweiss", "1 EL Kirsch"],
    steps: ["Mandeln, Zucker, Salz, Kakaopulver, Zimt und Nelkenpulver mischen. Schokolade fein reiben und daruntermischen.",
      "Eiweiss steif schlagen und mit dem Kirsch unter die Mandelmasse mischen, bis ein formbarer Teig entsteht; ist er zu klebrig, etwas Zucker dazugeben.",
      "Teig portionenweise auf etwas Zucker zwischen zwei Lagen Backpapier 1 cm dick auswallen. Herzen, Kleeblätter oder Sterne ausstechen und auf Bleche mit Backpapier legen.",
      "Bei Raumtemperatur mindestens 6 Stunden, besser über Nacht, trocknen lassen.",
      "Ofen auf 250 °C vorheizen (Umluft 230 °C). Brunsli blechweise in der Ofenmitte 4–5 Minuten backen, bis die Oberfläche trocken ist; sie werden beim Abkühlen fest. Auf einem Gitter auskühlen lassen."]
  },
  {
    id: "idee-zimtsterne", title: "Zimtsterne", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi"], time: 70, serves: 8,
    note: "Die Mandelsterne mit weisser Glasur kommen ohne Mehl aus und sind darum glutenfrei. Der Teig klebt weniger, wenn du ihn auf Zucker auswallst und den Ausstecher immer wieder in Wasser tauchst; ergibt etwa 40 Stück.",
    ingr: ["3 Eiweiss", "1 Prise Salz", "250 g Puderzucker", "350 g gemahlene Mandeln", "1 EL Zimt", "1 EL Kirsch oder Zitronensaft", "Zucker zum Auswallen"],
    steps: ["Eiweiss mit dem Salz steif schlagen. Puderzucker nach und nach einrieseln lassen und weiterschlagen, bis eine glänzende, feste Masse entsteht. 5 EL davon für die Glasur beiseitestellen.",
      "Mandeln, Zimt und Kirsch zur restlichen Eiweissmasse geben und zu einem formbaren Teig mischen. Zugedeckt 30 Minuten kühl stellen.",
      "Ofen auf 150 °C vorheizen (Umluft 130 °C). Teig portionenweise auf Zucker 1 cm dick auswallen, Sterne ausstechen und auf Bleche mit Backpapier legen.",
      "Sterne mit einem Pinsel oder Teelöffel dünn mit der beiseitegestellten Glasur bestreichen.",
      "Blechweise in der Ofenmitte 10–12 Minuten backen; die Glasur soll weiss bleiben. Die Sterne sind noch weich und werden beim Auskühlen fest."]
  },
  {
    id: "idee-spitzbuben", title: "Spitzbuben", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids"], time: 120, serves: 8,
    note: "Der Teig ist sehr mürbe und lässt sich gekühlt am besten zwischen Backpapier auswallen. Die Konfitüre kurz aufkochen, dann wird sie nach dem Füllen fest; ergibt etwa 30 Stück.",
    ingr: ["250 g weiche Butter", "125 g Puderzucker", "1 Prise Salz", "1 EL Vanillezucker", "1 Eiweiss", "350 g Mehl", "200 g Himbeerkonfitüre ohne Kerne", "Puderzucker zum Bestäuben"],
    steps: ["Butter, Puderzucker, Salz und Vanillezucker cremig rühren. Eiweiss kurz unterrühren, dann das Mehl dazugeben und rasch zu einem Teig zusammenfügen. Flach drücken und zugedeckt 1 Stunde kühl stellen.",
      "Ofen auf 200 °C vorheizen (Umluft 180 °C). Teig portionenweise zwischen Backpapier 2–3 mm dick auswallen und Rondellen von etwa 5 cm ausstechen. Bei der Hälfte in der Mitte ein kleines Loch oder drei Löchlein ausstechen.",
      "Blechweise in der Ofenmitte 7–9 Minuten hell backen und auf einem Gitter auskühlen lassen.",
      "Die Deckel mit den Löchern dick mit Puderzucker bestäuben. Himbeerkonfitüre unter Rühren aufkochen und 1 Minute köcheln.",
      "Die Böden mit je 1 TL heisser Konfitüre bestreichen, die Deckel daraufsetzen und leicht andrücken. Fest werden lassen."]
  },
  {
    id: "idee-totenbeinli", title: "Totenbeinli", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi"], time: 130, serves: 8,
    note: "Die Bündner Nussstängel verdanken ihren Namen der Form, die an Knöchelchen erinnert. Ein scharfes Messer verhindert, dass die Nüsse beim Schneiden herausbrechen; in der Dose halten sie wochenlang.",
    ingr: ["100 g weiche Butter", "200 g Zucker", "1 Prise Salz", "1 Bio-Zitrone", "2 Eier", "300 g Mehl", "250 g ganze Haselnüsse", "1 Eigelb zum Bestreichen"],
    steps: ["Butter, Zucker und Salz cremig rühren. Zitronenschale dazureiben und die Eier einzeln unterrühren.",
      "Mehl und Haselnüsse dazugeben und von Hand zu einem festen Teig zusammenfügen. Zu einem flachen Rechteck formen, in Folie wickeln und 1 Stunde kühl stellen.",
      "Ofen auf 180 °C vorheizen (Umluft 160 °C). Teig auf wenig Mehl zu einem Rechteck von 1 cm Dicke auswallen, mit verquirltem Eigelb bestreichen und mit einem scharfen Messer in Stängel von 1 × 6 cm schneiden.",
      "Mit etwas Abstand auf Bleche mit Backpapier legen und blechweise in der Ofenmitte 15–20 Minuten goldgelb backen. Auf einem Gitter auskühlen lassen; erst dann werden sie knusprig."]
  },
  {
    id: "idee-berliner", title: "Berliner mit Konfitüre", kitchen: "de", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids"], time: 150, serves: 12,
    note: "In Bayern heissen sie Krapfen, in der Schweiz Berliner. Bei 170 °C Öltemperatur werden sie goldbraun und bekommen den typischen hellen Rand; ohne Thermometer zuerst ein Probestück frittieren.",
    ingr: ["500 g Weissmehl", "60 g Zucker", "½ TL Salz", "20 g Hefe (½ Würfel)", "2 dl Milch, lauwarm", "2 Eier", "1 Bio-Zitrone", "60 g weiche Butter", "1.5 l Öl zum Frittieren", "250 g Himbeer- oder Aprikosenkonfitüre", "Zucker zum Wenden"],
    steps: ["Weissmehl, Zucker und Salz mischen. Eier verquirlen, Hefe in der lauwarmen Milch auflösen und beides mit der abgeriebenen Zitronenschale dazugeben. 5 Minuten kneten, dann die Butter stückweise einarbeiten und weiterkneten, bis der Teig weich und glatt ist.",
      "Zugedeckt an einem warmen Ort 1 Stunde aufgehen lassen, bis sich der Teig verdoppelt hat.",
      "Teig in 12 Stücke teilen, zu straffen Kugeln formen und auf ein bemehltes Blech legen. Leicht flach drücken und zugedeckt nochmals 30 Minuten aufgehen lassen.",
      "Öl in einer weiten, hohen Pfanne auf 170 °C erhitzen. Berliner portionenweise mit der Oberseite nach unten hineinlegen, 3 Minuten backen, wenden und weitere 3 Minuten goldbraun backen.",
      "Auf Küchenpapier abtropfen lassen und noch warm im Zucker wenden. Konfitüre glatt rühren, in einen Spritzsack mit langer Tülle füllen und seitlich in die Berliner spritzen."]
  },
  {
    id: "idee-nussgipfel", title: "Nussgipfel", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids"], time: 50, serves: 6,
    note: "Der Znüni-Klassiker aus der Bäckerei, mit fertigem Blätterteig schnell gemacht. Statt Haselnüssen passen auch gemahlene Mandeln; frisch schmecken die 12 Gipfel am besten.",
    ingr: ["200 g gemahlene Haselnüsse", "80 g Zucker", "1 EL Vanillezucker", "½ TL Zimt", "1 dl Milch", "1 Eiweiss", "2 Blätterteige, rechteckig ausgewallt (à ca. 320 g)", "1 Eigelb zum Bestreichen", "2 EL Aprikosenkonfitüre"],
    steps: ["Haselnüsse, Zucker, Vanillezucker und Zimt mischen. Milch und Eiweiss dazugeben und zu einer streichfähigen Füllung verrühren.",
      "Ofen auf 200 °C vorheizen (Umluft 180 °C). Blätterteige entrollen und jeden in 6 längliche Dreiecke schneiden.",
      "Je einen gehäuften Esslöffel Füllung auf die breite Seite der Dreiecke geben, zur Spitze hin aufrollen und zu Gipfeln biegen. Mit der Spitze nach unten auf Bleche mit Backpapier legen.",
      "Mit verquirltem Eigelb bestreichen und in der Ofenmitte 18–20 Minuten goldbraun backen.",
      "Aprikosenkonfitüre mit 1 EL Wasser erwärmen und die noch warmen Gipfel damit bestreichen. Auf einem Gitter auskühlen lassen."]
  },
  {
    id: "idee-magenbrot", title: "Magenbrot", kitchen: "ch", emoji: "schoggi", cat: "sweet", tags: ["vegi"], time: 70, serves: 8,
    note: "Gehört an jede Chilbi und auf jeden Weihnachtsmarkt. Lebkuchengewürz gibt es im Backregal, sonst Zimt, Nelke, Anis und Muskat mischen; in der Dose bleibt Magenbrot eine Woche weich.",
    ingr: ["300 g Mehl", "100 g Rohzucker", "2 EL Kakaopulver", "2 TL Lebkuchengewürz", "1 TL Backpulver", "½ TL Natron", "150 g Honig", "1 dl Milch", "1 Ei", "100 g Zucker für die Glasur", "0.5 dl Wasser", "100 g dunkle Schokolade"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Mehl, Rohzucker, Kakaopulver, Lebkuchengewürz, Backpulver und Natron mischen.",
      "Honig mit der Milch leicht erwärmen, bis er flüssig ist, und mit dem Ei unter die Mehlmischung rühren. Zu einem weichen Teig kneten; er klebt etwas.",
      "Teig mit bemehlten Händen zu 4 Rollen von etwa 3 cm Durchmesser formen und mit Abstand auf ein Blech mit Backpapier legen. In der Ofenmitte 20–25 Minuten backen und etwas abkühlen lassen.",
      "Rollen noch warm schräg in 1.5 cm breite Stücke schneiden.",
      "Für die Glasur Zucker und Wasser aufkochen und 2 Minuten köcheln. Vom Herd ziehen, die Schokolade gehackt darin schmelzen und die Stücke darin wenden, bis alle glänzend überzogen sind. Auf Backpapier verteilen und 1 Stunde trocknen lassen."]
  },
  {
    id: "idee-schenkeli", title: "Schenkeli", kitchen: "ch", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids"], time: 80, serves: 8,
    note: "Fasnachtsgebäck aus der Deutschschweiz, das beim Frittieren leicht aufreissen soll. Ist das Öl zu heiss, werden die Schenkeli aussen dunkel und bleiben innen roh – lieber etwas tiefer und länger frittieren.",
    ingr: ["60 g weiche Butter", "120 g Zucker", "1 Prise Salz", "2 Eier", "1 Bio-Zitrone", "1 EL Kirsch (nach Belieben)", "280 g Mehl", "½ TL Backpulver", "1.5 l Öl zum Frittieren"],
    steps: ["Butter, Zucker und Salz cremig rühren. Eier einzeln dazugeben, Zitronenschale dazureiben und den Kirsch unterrühren.",
      "Mehl und Backpulver mischen, dazugeben und zu einem weichen Teig zusammenfügen. Zugedeckt 30 Minuten kühl stellen.",
      "Teig portionenweise zu fingerdicken Rollen formen und in 6 cm lange Stücke schneiden. Die Stücke zwischen den Handflächen rollen, sodass die Enden leicht spitz werden.",
      "Öl in einer weiten, hohen Pfanne auf 160 °C erhitzen. Schenkeli portionenweise 5–6 Minuten frittieren und dabei immer wieder wenden, bis sie goldbraun sind und leicht aufreissen.",
      "Mit der Schaumkelle herausheben und auf Küchenpapier abtropfen lassen. Lauwarm oder ausgekühlt servieren."]
  },

  /* ---------- Natürlich glutenfrei ---------- */
  {
    id: "idee-mandel-orangen-kuchen", title: "Mandel-Orangen-Kuchen", kitchen: "es", emoji: "kuchen", cat: "sweet", tags: ["vegi", "guests", "prep"], time: 195, serves: 10,
    note: "Saftiger Kuchen nach sephardischer Tradition: Ganze, weich gekochte Orangen kommen samt Schale in den Teig. Ohne Mehl und darum glutenfrei; die Orangen lassen sich am Vortag kochen.",
    ingr: ["2 Bio-Orangen (ca. 400 g)", "Butter für die Form", "6 Eier", "220 g Zucker", "1 Prise Salz", "250 g gemahlene Mandeln", "1 TL Backpulver", "Puderzucker zum Bestäuben"],
    steps: ["Orangen waschen, ganz in eine Pfanne legen, mit Wasser bedecken und zugedeckt 1½–2 Stunden köcheln, bis sie sehr weich sind. Abgiessen und abkühlen lassen.",
      "Ofen auf 180 °C vorheizen (Umluft 160 °C). Springform (24 cm) mit Butter einfetten und den Boden mit Backpapier belegen.",
      "Orangen halbieren, Kerne entfernen und die Früchte samt Schale im Cutter fein pürieren.",
      "Eier, Zucker und Salz 3 Minuten schaumig rühren. Mandeln, Backpulver und Orangenpüree unterrühren und in die Form füllen.",
      "In der Ofenmitte 50–60 Minuten backen, bis ein Holzspiesschen sauber herauskommt; wird er zu dunkel, mit Alufolie abdecken. In der Form auskühlen lassen und mit Puderzucker bestäuben."]
  },
  {
    id: "idee-kokosmakronen", title: "Kokosmakronen", kitchen: "de", emoji: "kuchen", cat: "sweet", tags: ["vegi", "kids", "cheap"], time: 40, serves: 8,
    note: "Gute Verwertung für übrige Eiweisse, etwa nach Crème brûlée oder Caramelköpfli. Ohne Oblaten auf Backpapier gebacken sind sie glutenfrei; wer mag, taucht die Böden in geschmolzene Schokolade.",
    ingr: ["3 Eiweiss", "1 Prise Salz", "150 g Zucker", "1 EL Vanillezucker", "1 TL Zitronensaft", "200 g Kokosraspel"],
    steps: ["Ofen auf 150 °C vorheizen (Umluft 130 °C) und zwei Bleche mit Backpapier belegen.",
      "Eiweiss mit dem Salz steif schlagen. Zucker und Vanillezucker nach und nach einrieseln lassen und weiterschlagen, bis der Schnee glänzt. Zitronensaft kurz unterrühren.",
      "Kokosraspel mit dem Gummischaber locker unterheben. Mit zwei Teelöffeln kleine Häufchen mit etwas Abstand auf die Bleche setzen.",
      "In der Ofenmitte 20–25 Minuten backen, bis die Spitzen goldbraun sind. Auf dem Blech auskühlen lassen."]
  },
  {
    id: "idee-schoggi-avocado-mousse", title: "Schoggi-Avocado-Mousse", kitchen: "amerika", emoji: "schoggi", cat: "sweet", tags: ["vegi", "vegan", "quick"], time: 15, serves: 4,
    note: "Die Avocado schmeckt man kaum heraus, sie macht die Creme samtig und ersetzt Rahm und Eier. Dunkle Schokolade ist meist vegan, ein Blick auf die Zutatenliste lohnt sich trotzdem.",
    ingr: ["100 g dunkle Schokolade (vegan, mind. 70 % Kakao)", "2 reife Avocados", "3 EL Kakaopulver", "4 EL Ahornsirup", "0.5 dl Mandelmilch", "1 Prise Salz", "150 g Himbeeren zum Garnieren"],
    steps: ["Schokolade hacken, über dem warmen Wasserbad schmelzen und etwas abkühlen lassen.",
      "Avocados halbieren, den Stein entfernen und das Fruchtfleisch herauslöffeln.",
      "Avocado mit Schokolade, Kakaopulver, Ahornsirup, Mandelmilch und Salz im Mixer oder mit dem Stabmixer ganz fein pürieren, bis keine Stückchen mehr zu sehen sind. Abschmecken und nach Belieben mehr Ahornsirup dazugeben.",
      "In Gläser füllen und sofort servieren oder 30 Minuten kühl stellen. Mit Himbeeren garnieren."]
  },
  {
    id: "idee-beeren-vanillecreme", title: "Beeren mit Vanillecreme", kitchen: "ch", emoji: "glace", cat: "sweet", tags: ["vegi", "kids"], time: 30, serves: 4,
    note: "Selbst gemachte Vanillecreme wird mit Maizena gebunden und ist darum glutenfrei. Sie muss vor dem Fertigstellen 1 Stunde auskühlen; mit Erdbeeren, Himbeeren und Heidelbeeren gemischt sieht sie am schönsten aus.",
    ingr: ["1 Vanilleschote", "5 dl Milch", "3 Eigelb", "70 g Zucker", "30 g Maizena", "1.5 dl Vollrahm", "500 g gemischte Beeren"],
    steps: ["Vanilleschote längs aufschneiden, das Mark auskratzen und mit Schote und 4 dl Milch aufkochen.",
      "Eigelb, Zucker, Maizena und die restliche Milch in einer Schüssel glatt rühren. Schote aus der heissen Milch nehmen, die Milch unter Rühren zur Eigelbmasse giessen und alles zurück in die Pfanne geben.",
      "Unter ständigem Rühren aufkochen und 1 Minute köcheln, bis die Creme dick ist. In eine Schüssel umfüllen, Klarsichtfolie direkt auf die Oberfläche legen und 1 Stunde im Kühlschrank auskühlen lassen.",
      "Vollrahm steif schlagen, die kalte Creme glatt rühren und den Rahm locker unterziehen. Mit den Beeren in Gläser schichten."]
  },
  {
    id: "idee-bratapfel-nuesse", title: "Bratäpfel mit Nüssen", kitchen: "de", emoji: "apfel", cat: "sweet", tags: ["vegi", "vegan", "kids", "cheap"], time: 50, serves: 4,
    note: "Säuerliche Sorten wie Boskoop werden im Ofen weich, ohne zu zerfallen. Dazu passt Vanillesauce oder, vegan, Hafer-Vanillesauce.",
    ingr: ["4 säuerliche Äpfel (z. B. Boskoop)", "1 EL Zitronensaft", "50 g Baumnüsse, gehackt", "30 g Sultaninen", "2 EL Ahornsirup", "½ TL Zimt", "1 dl Apfelsaft"],
    steps: ["Ofen auf 180 °C vorheizen (Umluft 160 °C). Äpfel waschen, oben einen Deckel abschneiden und das Kerngehäuse mit dem Apfelausstecher oder einem Teelöffel grosszügig aushöhlen. Innen mit Zitronensaft beträufeln.",
      "Baumnüsse, Sultaninen, Ahornsirup und Zimt mischen, in die Äpfel füllen und die Deckel wieder aufsetzen.",
      "Äpfel in eine Gratinform stellen und den Apfelsaft angiessen. In der Ofenmitte 30–35 Minuten backen, bis sie weich sind, aber nicht zerfallen; ab und zu mit dem Saft übergiessen.",
      "Warm mit dem Saft aus der Form servieren, nach Belieben mit Vanillesauce."]
  }
]);
