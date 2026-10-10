/* Home-Planer: Einstellungen dieser Installation.

   GRUPPEN-SYNC
   Solange unten "null" steht, speichert der Home-Planer jeden Haushalt nur auf dem Gerät, auf dem er angelegt wurde.
   Damit alle im Haushalt eintragen können, ersetzt du die eine Zeile

       const firebaseConfig = null;

   durch den Block aus deinem Firebase-Projekt (Firebase-Konsole: Projekteinstellungen, Abschnitt "Meine Apps",
   Web-App, Auswahl "Config"). Der Block beginnt mit "const firebaseConfig = {" und endet mit "};".
   Die Schritte stehen im README, Abschnitt "Gruppen-Sync einrichten".

   Eingetragen ist das Firebase-Projekt der Ferienkasse (Splite-weiser). Beide Apps teilen sich die Datenbank, jede in
   ihrem eigenen Bereich ("trips" und "homes"). Dafür müssen in der Firebase-Konsole die Regeln aus der Datei
   firestore.rules dieses Projekts stehen: Sie enthalten beide Bereiche.

   Diese Werte sind keine Passwörter. Sie sagen dem Browser nur, welches Firebase-Projekt gemeint ist.
   Geschützt werden die Daten durch die Regeln aus der Datei firestore.rules. */

const firebaseConfig = {
  apiKey: "AIzaSyBoxXxX0WBFLoK4aDwSsf06fT0W8QTs6Uo",
  authDomain: "splite-weiser-cf091.firebaseapp.com",
  projectId: "splite-weiser-cf091",
  storageBucket: "splite-weiser-cf091.firebasestorage.app",
  messagingSenderId: "18964279601",
  appId: "1:18964279601:web:03099143f60fe0e248c010"
};

/* KALENDER IN OUTLOOK UND AUF DEM IPHONE, MITTEILUNGEN AUFS HANDY
   Für ein Kalender-Abo, das sich selbst aktualisiert, und für Push-Mitteilungen braucht es einmal einen kleinen Dienst
   (kostenlos bei Cloudflare, Datei dienst-worker.js, Anleitung im README, Abschnitt "Dienst für Kalender und Mitteilungen").
   Seine Adresse kommt hierher, zum Beispiel "https://home-planer-dienst.marc.workers.dev".
   Leer: Die App bietet den Kalender als Datei an, Mitteilungen gibt es dann keine. */
const dienst = "";

/* Ab hier nichts ändern. */
window.HOMEPLANER_CONFIG = { firebase: firebaseConfig, dienst: dienst };
