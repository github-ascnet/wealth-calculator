# Decisions – Asset Growth Calculator

Verbindliche Architektur-, Design- und Implementierungsentscheidungen.

## Konventionen

- **ID:** `D-nnn`, fortlaufend, wird nie neu vergeben.
- **Status:**
  - `Ist-abgeleitet` – aus Code und Git-Historie erkennbar, gilt bis auf Weiteres als verbindlich; formale Bestätigung ausstehend.
  - `Bestätigt` – ausdrücklich durch den Projektverantwortlichen bestätigt.
  - `Vorgeschlagen` – Ergebnis einer Planung (PLAN), wird mit der Abnahme des Plans durch den Projektverantwortlichen verbindlich.
  - `Ersetzt durch D-nnn` – nicht mehr gültig, bleibt zur Nachvollziehbarkeit stehen.
  - `Verworfen` – nicht mehr gültig, ohne Nachfolger.
- Entscheidungen werden nicht gelöscht oder stillschweigend umgeschrieben. Änderungen erfolgen über eine neue Entscheidung (Modus CHANGE).
- Offene, noch nicht getroffene Entscheidungen stehen in [project_plan.md](project_plan.md), Kapitel 12.

---

## D-001 Statische, rein clientseitige Webanwendung

- **Status:** Ist-abgeleitet (Stand 2026-11-15)
- **Entscheidung:** Die Anwendung besteht aus statischen Dateien (HTML, CSS, JavaScript) und läuft vollständig im Browser. Kein Backend, keine API, keine Persistenz, kein Build-Prozess.
- **Beleg:** Repository-Inhalt; kein `package.json`, keine Server-Dateien.
- **Hinweis:** Eine Migration nach Next.js ist kein Projektziel (OP-01, erledigt 2026-11-15).

## D-002 Dateistruktur `index.html` / `site.css` / `site.js`

- **Status:** Ist-abgeleitet
- **Entscheidung:** Markup, Styles und Logik liegen in je einer Datei im Projekt-Root.
- **Beleg:** Commit `93891ae` (2024-11-16): „moved CSS/JS to their own files“.

## D-003 Vanilla JavaScript ohne Framework

- **Status:** Ist-abgeleitet
- **Entscheidung:** Logik in globalen Funktionen ohne Framework, ohne Module, ohne Transpiler. Eingabe-Ereignisse über Inline-Handler im HTML (`oninput`, `onfocusout`), Button über `addEventListener`.
- **Beleg:** [site.js](site.js), [index.html](index.html).

## D-004 Bootstrap 5.1.3 über CDN

- **Status:** Ist-abgeleitet; **ersetzt durch D-019**, abgelöst seit BP-014 (2026-11-15); in BP-021 bestätigt (kein Bootstrap im Projekt)
- **Entscheidung:** Bootstrap 5.1.3 (CSS und JS-Bundle) wird über `cdn.jsdelivr.net` eingebunden und für Grid-Layout, Formular-Basisstile und Tooltips verwendet.

## D-005 Chart.js mit chartjs-plugin-datalabels über CDN

- **Status:** Ist-abgeleitet; **ersetzt durch D-017**, abgelöst seit BP-016 (2026-11-15); in BP-021 bestätigt (kein Chart.js und keine Datalabels im Projekt)
- **Entscheidung:** Diagramme werden mit Chart.js (Typ `line`) und dem Plugin `chartjs-plugin-datalabels` gerendert, beide über `cdn.jsdelivr.net`. Instanzen werden bei jeder Berechnung zerstört und neu erstellt.
- **Hinweis:** Versionen sind nicht gepinnt (OP-08).

## D-006 Zufallsrendite über Normalverteilung (Box-Muller)

- **Status:** Ist-abgeleitet
- **Entscheidung:** Die effektive Jahresrendite ist `μ + z·σ` mit `z` standardnormalverteilt per Box-Muller-Transformation aus `Math.random()`. Kein Seed; jede Berechnung erzeugt einen neuen Zufallspfad.
- **Beleg:** `normaleZufallszahl` in [site.js](site.js); Commit `dc20f10`/`93891ae`.

## D-007 Drawdown-Begrenzung über High-Watermark

- **Status:** Ist-abgeleitet
- **Entscheidung:** Der Rückgang gegenüber der High-Watermark wird auf den eingegebenen maximalen Drawdown begrenzt. Der Drawdown wird als negativer Prozentwert eingegeben und intern als Betrag verwendet.
- **Beleg:** Commits `93e90a5` und `570e7a1` (2025-09-07).

## D-008 Berechnungsreihenfolge pro Jahr

- **Status:** Ist-abgeleitet; Behandlung der Dividende **bestätigt** am 2026-11-15
- **Entscheidung:** Rendite anwenden → High-Watermark aktualisieren → Drawdown kappen → Cashflow und Dividende auf Basis des Betrags vor Entnahme berechnen → Cashflow vom Vermögen abziehen (Untergrenze 0). Die Dividende wird ausgewiesen, aber nicht mit dem Vermögen verrechnet.
- **Beleg:** `berechneVermoegen` in [site.js](site.js). Detailformeln: [project_plan.md](project_plan.md), Kapitel 7.1.
- **Bestätigung 2026-11-15 (OP-04):** Die Dividende wird nicht reinvestiert. Sie wird je Jahr und als Summe ausgewiesen und verändert das Vermögen nicht.

## D-009 Live-Neuberechnung und Simulations-Button

- **Status:** Ist-abgeleitet; Zeitpunkt der Neuberechnung bei Eingaben **teilweise ersetzt durch D-025**, wirksam mit Umsetzung des Redesigns (bis dahin gültig)
- **Entscheidung:** Jede Eingabe löst sofort eine Neuberechnung aus. Der Simulations-Button wiederholt die Berechnung alle 5 Sekunden, maximal 50 Wiederholungen, und ist per erneutem Klick abbrechbar.
- **Beleg:** Commit `93891ae`.

## D-010 Dark Theme mit Amber-Akzent

- **Status:** Ist-abgeleitet; **ersetzt durch D-018**, abgelöst seit BP-015 (Seite) und BP-016 (Diagrammfarben), 2026-11-15; in BP-021 bestätigt (kein Amber mehr im Projekt)
- **Entscheidung:** Dunkler Verlaufshintergrund (`#272525`/`#454046`), weisse Schrift, Akzentfarbe `#ffc107`, Cashflow-Linie `#32cd32`, Schrift **Space Mono**.
- **Beleg:** Commit `7c4e5ac` (2025-09-07) „Changed Theme to dark and adjusted Charts accordingly“.

## D-011 KPI-Box zwischen den Diagrammen

- **Status:** Ist-abgeleitet; auf Desktop ab 1024 px **ersetzt durch D-030** (Box über den nebeneinanderliegenden Diagrammen), darunter weiterhin zwischen den Diagrammen
- **Entscheidung:** Kennzahlen (Total Growth, Max. Drawdown, Volatility, Total Dividends, Total Cashflow) werden in einer Box zwischen Vermögens- und Cashflow-Diagramm angezeigt; der frühere Fliesstext unter dem Chart entfällt.
- **Beleg:** Commits `2e02d59` und `cf77d33` (2025-09-07/08).

## D-012 Sprache und Währung

- **Status:** Ist-abgeleitet
- **Entscheidung:** Benutzeroberfläche, Tooltips, Meldungen und SEO-Texte auf Englisch; Währung USD. Bezeichner im Code (IDs, Variablen, Funktionen) und Code-Kommentare auf Deutsch.
- **Beleg:** [index.html](index.html), [site.js](site.js).

## D-013 SEO- und Social-Media-Metadaten

- **Status:** Ist-abgeleitet
- **Entscheidung:** Die Seite ist zur Indexierung freigegeben und enthält Open-Graph- und Twitter-Card-Metadaten mit Ziel-URL `https://wealthcalc.ascnet.ch/` und Vorschaubild `og-image.png`.
- **Beleg:** Commit `86725cd` (2024-11-17).

## D-024 Deployment über Cloudflare Pages aus dem GitHub-Repository

- **Status:** Bestätigt (Angabe des Auftraggebers, 2026-11-15)
- **Entscheidung:** Das GitHub-Repository `github-ascnet/wealth-calculator` wird von Cloudflare Pages eingelesen und unter `https://wealthcalc.ascnet.ch/` bereitgestellt. Es gibt keinen separaten Deployment-Schritt im Repository.
- **Konsequenz:**
  - Ein Push auf den Production-Branch (vermutlich `main`, ungeprüft) ist ein **Produktiv-Deployment**. Commit und Push nur auf ausdrücklichen Auftrag (agents.md).
  - Ohne Build-Prozess (D-001) wird der Repository-Inhalt statisch ausgeliefert; alles im ausgelieferten Verzeichnis ist öffentlich (OP-22).
  - Neue Dateien und Verzeichnisse des Redesigns müssen mit relativen Pfaden funktionieren und ohne Build auskommen.
  - Der Wegfall der CDN-Abhängigkeiten durch das Redesign (D-017, D-019) ändert am Deployment nichts.
  - Das Redesign (BP-014 bis BP-021) wird auf dem Branch `redesign` entwickelt (Auftrag 2026-11-15, OP-27), damit Zwischenstände mit gemischtem Design nicht live gehen. Zusammenführung nach `main` erst nach BP-021 und nur auf ausdrücklichen Auftrag (erfolgt am 2026-11-16, Stand 6ae15d8).
- **Offen:** Production-Branch, Build-Einstellungen, Preview-Deployments, Ausgabeverzeichnis (OP-11, OP-22).

## D-014 „Total Growth“ ab Startkapital

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-03)
- **Entscheidung:** Die Kennzahl „Total Growth“ misst das Wachstum vom Startkapital bis zum Vermögen am Ende des letzten Jahres: `(V_letztes − startkapital) / startkapital · 100`.
- **Ersetzt:** Die bisherige Basis „Vermögen am Ende von Jahr 1“ (Ist bis Code-Stand `cf77d33`).
- **Konsequenz:** Umsetzung in BP-011. Ausgabeformat und Position in der KPI-Box bleiben unverändert. Die Division durch null aus IB-04f entfällt.

## D-015 Einheitliche Einheit in den Diagrammen (Tausend USD)

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-05: „Bitte korrigieren“; Variante Tausend USD am 2026-11-15 ausdrücklich bestätigt)
- **Entscheidung:** Die Y-Achsen-Ticks beider Diagramme werden in Tausend USD angezeigt. Damit stimmen Achsen, Legenden („in 1000 (USD)“) und Data Labels (`floor(Wert / 1000)`) überein.
- **Nicht betroffen:** Die berechneten Daten bleiben in vollen USD; die Beträge in der KPI-Box (Total Dividends, Total Cashflow) bleiben in vollen USD.
- **Konsequenz:** Umsetzung in BP-012. Bei einem Wechsel der Chart-Technik (OP-13) gilt die Entscheidung für die neue Darstellung weiter.

## D-016 Redesign auf aktuellen Motion-Graphics-Standard

- **Status:** Bestätigt als Zielrichtung (Auftrag 2026-11-15); ausgestaltet durch D-017 bis D-031 und umgesetzt mit BP-014 bis BP-020 (Abschluss BP-021, 2026-11-15)
- **Entscheidung:** Design und Layout werden auf einen aktuellen Motion-Graphics-Standard gebracht. Referenz ist das Projekt Wealth-Lab-Strategy-Orchestrator (`C:\Data\Projekte\Wealth Lab\Wealth-Lab-Strategy-Orchestrator`).
- **Rahmen:** Berechnung, Eingabefelder und KPI-Definitionen bleiben unverändert; kein Build-Prozess, kein Framework (D-001, D-003).
- **Konkretisiert** durch D-017 bis D-023 (2026-11-15).
- **Offen:** Detailregeln des Ergebnis-Tints (OP-21).
- **Details:** [project_plan.md](project_plan.md), Kapitel 13.

## D-017 Diagramme als Inline-SVG ohne Bibliothek

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-13: „wie im Wealth-Lab-Strategy-Orchestrator“); wirksam seit BP-016 (2026-11-15)
- **Entscheidung:** Beide Diagramme werden in JavaScript als handgeschriebenes Inline-SVG erzeugt, ohne Chart-Bibliothek. Chart.js und `chartjs-plugin-datalabels` entfallen.
- **Ersetzt:** D-005.
- **Konsequenz:** Beschriftungen, Achsen, Data Labels, Legende und Tooltips der Diagramme müssen selbst umgesetzt werden. D-015 (Tausend USD) und die Datenreihen aus [project_plan.md](project_plan.md), Kapitel 8.1, gelten weiter. Das Wegfallen der CDN-Abhängigkeit erledigt IB-04e / OP-08.

## D-018 Aurora-Theme, nicht umschaltbar

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-14); für die Seite wirksam seit BP-015, für die Diagramme seit BP-016 (2026-11-15)
- **Entscheidung:** Das Design folgt dem Theme „Aurora“ des Vorbilds (dunkle Nachtblau-Töne, Cyan, Teal, Grün, Rosé; Glow ohne SVG-Filter). Es gibt keinen Theme-Schalter und kein classic-Theme.
- **Ersetzt:** D-010 (Dark Theme mit Amber-Akzent).
- **Konsequenz:** Konkrete Farbwerte, Zuordnung zu Datenreihen (Vermögen, Cashflow, Dividenden, Drawdown-Bezug) und Kontraste werden im PLAN von BP-013 festgelegt. Die Paletten- und Glow-Regeln des Vorbilds (dessen D-031) sind Orientierung, keine Kopiervorlage.

## D-019 Kein Bootstrap, keine externe Schrift

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-15: „nein beides wie im Wealth-Lab-Strategy-Orchestrator“); wirksam seit BP-014 (2026-11-15, Bootstrap und Webfonts entfernt)
- **Entscheidung:** Bootstrap (CSS und JS) und die Google-Fonts-Einbindung (Space Mono, Jura) entfallen. Layout, Formularfelder und Komponenten werden in eigenem CSS umgesetzt. Als Schrift dienen Systemschriften wie im Vorbild (Segoe UI für Text, Consolas bzw. Monospace für Zahlen).
- **Ersetzt:** D-004; ändert die Schrift aus D-010.
- **Konsequenz:** Die Bootstrap-Tooltips entfallen; Ersatz offen (OP-19). Raster und responsives Verhalten werden neu aufgebaut. Es gibt danach keine externen Laufzeitabhängigkeiten mehr (kein CDN, keine Webfonts).

## D-020 Umfang der Motion-Effekte

- **Status:** Bestätigt als Rahmen (Auftrag 2026-11-15, OP-16: „möglichst alle“); Abgrenzung nicht beanstandet (OP-20), Ergänzungen D-021 bis D-023
- **Entscheidung:** Aus dem Vorbild werden möglichst alle Effekte übernommen, soweit sie auf diese Seite übertragbar sind (Zuordnung: [project_plan.md](project_plan.md), Kapitel 13.5). Es gelten die Grundregeln des Vorbilds: nur CSS und `requestAnimationFrame`, statischer Zustand ist Endzustand, nur `transform` und `opacity` für Dauer-Animationen, Reduced-Motion schaltet alles ab, Drift nur ab 701 px.
- **Nicht übertragbar:** Seitenübergang, Tab-Indikator, Kachel-Sparklines, Positions-Tabelle, Heatmap. Der Regime-Tint wird als Ergebnis-Tint angelehnt übernommen (D-023).

## D-021 Diagramm-Einzeichnung bei jeder Neuberechnung

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-17 Variante a); wirksam seit BP-018 (2026-11-15)
- **Entscheidung:** Die Linien beider Diagramme zeichnen sich bei **jeder** Neuberechnung neu ein, Flächen blenden danach ein. Das gilt für Eingaben, den Simulations-Button und die automatische Wiederholung alle 5 Sekunden. Das Vorbild animiert nur das erste Rendern (dessen D-026, Regel 4); diese Regel gilt hier **nicht**.
- **Rahmen:** Statischer Zustand bleibt der Endzustand; bei Reduced-Motion erscheint das Ergebnis sofort ohne Einzeichnung.
- **Risiko gelöst durch D-025:** Eingaben lösen Berechnung und Einzeichnung erst nach einer Tipp-Pause von ca. 250 ms aus; ein weiterer Render bricht eine laufende Einzeichnung ab und beginnt neu.

## D-022 Tooltips der Eingabefelder als „!“-Symbol

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-19); wirksam seit BP-014 (2026-11-15)
- **Entscheidung:** Die Erklärungen der Eingabefelder (Texte unverändert aus [project_plan.md](project_plan.md), Kapitel 6) erscheinen über ein „!“-Symbol mit eigenem Tooltip, per Hover und Tastaturfokus, nach dem Muster des Vorbilds. Bootstrap-Tooltips entfallen (D-019).
- **Konsequenz:** Tippfläche mindestens 44 × 44 px auf Touch-Geräten (R-10).

## D-023 Ergebnis-Tint des Hintergrunds

- **Status:** Bestätigt (Auftrag 2026-11-15; Detailregeln am 2026-11-15 gewählt: „Total Growth, stufenlos“); wirksam seit BP-019 (2026-11-15), Startwerte der Parameter in der Sichtprüfung nachjustierbar
- **Entscheidung:** Der Hintergrund färbt sich weich nach dem Ergebnis der aktuellen Simulation, angelehnt an den Regime-Tint des Vorbilds (dessen D-027). Rein visuell, keine Anlageaussage.
- **Regeln:**
  - Grundlage ist die Kennzahl „Total Growth“ (D-014), stufenlos.
  - Gewinn → grünlich/teal getönt, Verlust → rosé getönt, Ergebnis nahe 0 → keine Färbung. Die Stärke wächst mit dem Betrag des Ergebnisses bis zu einer Obergrenze.
  - Umsetzung mit zwei festen Ebenen (Gewinn, Verlust), deren Deckkraft die Stärke bestimmt; Übergang 2400 ms. Kein Farbübergang über `@property`, kein `mix-blend-mode`.
  - Nur ab 701 px Breite; bei Reduced-Motion keine Färbung (wie im Vorbild).
- **Parameter (Startwerte, im Plan [project_plan.md](project_plan.md), Kapitel 13.7):** Neutralzone ±1 %, Intensität `1 − exp(−|G| / 150 %)`. Diese Startwerte sind Vorschläge und bei der Sichtprüfung in BP-019 nachjustierbar.
- **Hinweis:** Bei den Default-Werten liegt Total Growth bei etwa +830 %; der Tint ist dort praktisch gesättigt (13.7). Bei der Simulation (alle 5 Sekunden ein neuer Zufallspfad) wechselt der Tint im selben Takt.
- **Erledigt:** OP-21.

## D-025 Berechnung bei Eingaben nach Tipp-Pause

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-23); wirksam seit BP-018 (2026-11-15)
- **Entscheidung:** Bei Eingaben in die Felder starten Berechnung und Einzeichnung nach einer Tipp-Pause von ca. 250 ms, nicht bei jedem Tastendruck. Jeder weitere Tastendruck setzt die Wartezeit zurück. Der Button „Start/Stop Simulation“ und die automatische Wiederholung rechnen weiterhin sofort. Die Prüfung der Eingabe (`validateInput`) läuft weiterhin sofort bei jeder Eingabe.
- **Ersetzt teilweise:** D-009 („Jede Eingabe löst sofort eine Neuberechnung aus“).
- **Begründung:** Mit Einzeichnung bei jeder Neuberechnung (D-021) würden sich beim Tippen mehrstelliger Werte Einzeichnungen überlagern.
- **Konsequenz:** Ein laufender Wartezeit-Zähler wird beim Start der Simulation verworfen. Die Inline-Handler in `index.html` (`oninput`) rufen die verzögerte Variante auf (BP-018).

## D-026 Hochzählen der Kennzahlen: vom vorherigen zum neuen Wert

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-24); wirksam seit BP-018 (2026-11-15)
- **Entscheidung:** Die Kennzahlen der KPI-Box (Total Growth, Max. Drawdown, Volatility, Total Dividends, Total Cashflow) zählen beim ersten Laden von 0 hoch. Danach gleitet jede Zahl bei jeder Neuberechnung vom zuletzt angezeigten zum neuen Wert. Am Ende steht der unveränderte, bereits formatierte Text (Regel 5 des Vorbilds, dessen D-026). Format, Einheiten und Berechnung bleiben unverändert.
- **Rahmen:** Bei Reduced-Motion wird der neue Wert sofort gesetzt.

## D-027 Kurzer Intro-Loader

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-26); wirksam mit Umsetzung des Redesigns
- **Entscheidung:** Beim Seitenaufruf erscheint ein kurzer Loader von ca. 1 s (animierter Mini-Chart mit Titel, Muster des Vorbilds, dessen D-030 und D-032: nur `transform` und `opacity`). Danach blendet er aus und der Einlauf von Eingaben, Diagrammen und Kennzahlen startet. Bei Reduced-Motion entfällt der Loader.
- **Hinweis:** Im Vorbild überbrückt der Loader echte Ladezeit; hier wird nichts nachgeladen. Der Loader ist eine feste Intro-Animation und verzögert den Inhalt um etwa eine Sekunde (Risiko 6 in [project_plan.md](project_plan.md), 13.9). Ohne JavaScript darf der Loader den Inhalt nicht dauerhaft verdecken.

## D-028 Dateistruktur und Schnittstellen des Redesigns

- **Status:** Bestätigt (PLAN BP-013, 2026-11-15; Abnahme durch Abruf von BP-014 am 2026-11-15)
- **Entscheidung:** Neue Dateien `motion.css`, `motion.js` und `charts.js` im Projekt-Root; `site.css` wird neu geschrieben, `site.js` bleibt für Berechnung, Validierung und Simulation. Bestehende IDs und der Funktionsname `renderCharts(labels, data, bezugData, dividendeData)` bleiben. CSS-Klassen der neuen Dateien tragen das Präfix `ag-`, globale Objekte heissen `AG_MOTION` und `AG_CHARTS`. Skriptreihenfolge: `charts.js`, `motion.js`, `site.js`.
- **Ergänzt:** D-002 (Dateistruktur) und D-003 (globale Funktionen, Inline-Handler); keine Ersetzung.
- **Details:** [project_plan.md](project_plan.md), Kapitel 13.6.

## D-029 Farbzuordnung Aurora

- **Status:** Bestätigt (PLAN BP-013, 2026-11-15; Abnahme durch Abruf von BP-014 am 2026-11-15)
- **Entscheidung:** Vermögen Cyan `#58c4ff`, Cashflow Teal `#2de2c4`, Dividenden Violett `#8b7bff`; Tint Gewinn Teal/Grün, Tint Verlust Rosé `#ff6fa3`; Akzente und Fokus Teal; Hintergrund `#03060b` bis `#071420`; Text `#eafcff`, gedämpft `#93acbf`. Amber entfällt.
- **Konkretisiert:** D-018. **Details:** [project_plan.md](project_plan.md), Kapitel 13.8.

## D-030 Desktop-Layout: Diagramme nebeneinander, breitere Kennzahlen-Box

- **Status:** Bestätigt (Aufträge 2026-11-15: „KPI Panel etwas breiter, die zwei Charts horizontal nebeneinander auf Desktops“; danach „Eingabebereich breiter, KPI-Box unter den Eingaben in einer Zeile, Charts zu klein“)
- **Entscheidung:** Ab 1024 Fensterbreite stehen Vermögens- und Cashflow-Diagramm nebeneinander (zwei gleich breite Spalten, volle Seitenbreite), der Eingabebereich hat die Breite der Diagramme (Felder darin 90 % der Breite, höchstens 1100 px, drei Felder je Zeile, unterer Abstand 6 px statt 20 px), darunter folgt die Kennzahlen-Box in einer Zeile (Schrift 13 px, Gruppen umbrechen erst bei Platzmangel), darunter die Diagramme. Die Seite ist bis 1400 px breit (vorher 1140 px), die Diagramme sind im Seitenverhältnis 0.62 höher als einzeln stehende (0.4). Unter 1024 px bleibt es bei einer Spalte in der Reihenfolge Diagramm, Kennzahlen-Box, Diagramm (D-011).
- **Kennzahlen als Einzelwerte (Auftrag 2026-11-15):** Die Box zeigt fünf getrennte Werte („Total Growth“, „Max. Drawdown“, „Volatility“, „Total Dividends“, „Total Cashflow“), ab 1024 px auf einer Linie mit Trennstrichen, darunter zeilenweise umbrechend. Jeder Wert hat sein eigenes Element. Die Wortlaute und Zahlenformate der Einzelwerte sind unverändert; entfallen ist nur die Zusammenfassung zweier Werte in einem Text („… Max. Drawdown …“ hinter Total Growth, Komma zwischen Dividends und Cashflow). Damit weicht die Darstellung vom Textformat in [project_plan.md](project_plan.md), 7.2 ab.
- **Ersetzt:** D-011 für Breiten ab 1024 px; ergänzt das Layout aus [project_plan.md](project_plan.md), Kapitel 13.6 (OP-06).
- **Annahme:** Die Position der Box über den Diagrammen (statt darunter) ist eine Annahme des Umsetzers; eine Umstellung ist eine Zeile CSS (`grid-row` der Box).
- **Folge:** Die Diagramme sind in dieser Anordnung bei 1024 bis 1280 px Fensterbreite etwa 493 bis 613 px breit und 321 bis 395 px hoch. `charts.js` verwendet das hohe Seitenverhältnis nun erst unter 420 px (vorher 480 px).

## D-031 Seitentitel „Growth-Calculator“ mit Motion-Effekt

- **Status:** Bestätigt (Auftrag 2026-11-15: „Der Titel ist nicht gut, ändere ihn auf Growth-Calculator und verpasse ihm einen Motion Effect“)
- **Entscheidung:** Der Titel (`#titel`, `<h1>`) lautet fest „Growth-Calculator“. Der dynamische Titel „Asset growth at {Rendite}% Profit per Year“ entfällt; `site.js` schreibt den Titel nicht mehr. Der `<title>`-Tag und die Metadaten bleiben unverändert (Inhalt der Metadaten: OP-07).
- **Motion-Effekt (nur mit Motion):** `motion.js` zerlegt den Titel in Buchstaben (`aria-label` am `<h1>`, Buchstaben `aria-hidden`). Nach dem Loader laufen sie gestaffelt ein (45 ms je Buchstabe, 700 ms, `opacity` und `transform`). Dahinter leuchtet ein weicher Teal/Cyan-Schein, der sich langsam seitlich bewegt (7 s, `opacity` und `transform`, nur ab 701 px). Bei Reduced-Motion und ohne `motion.js` steht der Titel statisch.
- **Ersetzt:** den dynamischen Seitentitel aus [project_plan.md](project_plan.md), Kapitel 7.1.
