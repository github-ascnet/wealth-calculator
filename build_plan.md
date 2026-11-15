# Build Plan – Asset Growth Calculator

## Konventionen

- **ID:** `BP-nnn`, fortlaufend, wird nie neu vergeben.
- **Status:**
  - `Umgesetzt` – im Code vorhanden; formal noch nicht gegen Akzeptanzkriterien validiert.
  - `Validiert` – Abschlusskriterien geprüft (Modus VALIDATE).
  - `Vorgeschlagen` – aus INIT-Befund abgeleitet, **nicht freigegeben**; Umsetzung erst nach Freigabe.
  - `Geplant` – fachlich entschieden, Umsetzung erst auf Abruf des Auftraggebers.
  - `Freigegeben` – zur Umsetzung freigegeben.
  - `In Arbeit`, `Blockiert`, `Zurückgestellt`, `Verworfen`.
- Der Build-Plan setzt [project_plan.md](project_plan.md) und [decisions.md](decisions.md) um und verändert sie nicht.

## Übersicht

| ID | Titel | Status | Abhängig von |
|---|---|---|---|
| BP-001 | Grundrechner mit Vermögens-Chart und Cashflow | Umgesetzt | – |
| BP-002 | Dividenden und zweites Diagramm | Umgesetzt | BP-001 |
| BP-003 | Tooltips für Eingabefelder | Umgesetzt | BP-001 |
| BP-004 | Validierung, Bereinigung, Dateitrennung, Simulation | Umgesetzt | BP-002 |
| BP-005 | SEO- und Social-Media-Metadaten | Umgesetzt | BP-004 |
| BP-006 | Max.-Drawdown-Begrenzung | Umgesetzt | BP-004 |
| BP-007 | Dark Theme und KPI-Box | Umgesetzt | BP-006 |
| BP-008 | Korrektur Step-Validierung (IB-01) | Umgesetzt (nicht im Browser validiert, Commit a00a371) | BP-004 |
| BP-009 | Korrektur CSS-Struktur der Media Query (IB-02) | Aufgegangen in BP-014 (2026-11-15) | BP-007 |
| BP-010 | Korrektur HTML-Kopfstruktur (IB-03) | Umgesetzt (nicht im Browser validiert, Commit 957773c) | BP-005 |
| BP-011 | „Total Growth“ ab Startkapital (D-014) | Umgesetzt (nicht im Browser validiert, Commit 06a4c26) | BP-007 |
| BP-012 | Diagramm-Achsen in Tausend USD (D-015) | Umgesetzt (nicht im Browser validiert, Commit 3903393) | BP-007 |
| BP-013 | Redesign Motion Graphics – Konzept und Paketierung (D-016 bis D-029) | Plan erstellt (2026-11-15), Abnahme durch Auftraggeber ausstehend | BP-008, BP-010, BP-011, BP-012 |
| BP-014 | Redesign: Fundament ohne Bootstrap, Layout und „!“-Tooltips | Umgesetzt, im Browser geprüft (Chrome headless), Commit 3cd08f7 (Branch `redesign`) | BP-013 (Abnahme) |
| BP-015 | Redesign: Aurora-Farbwelt der Seite | Umgesetzt, im Browser geprüft (Chrome headless), Commit 6839a86 (Branch `redesign`) | BP-014 |
| BP-016 | Redesign: SVG-Diagramme ohne Chart.js | Geplant | BP-015 |
| BP-017 | Redesign: Motion-Grundlage, Intro-Loader, Hintergrund-Drift | Geplant | BP-016 |
| BP-018 | Redesign: Einzeichnung, Hochzählen, Tipp-Pause | Geplant | BP-017 |
| BP-019 | Redesign: Ergebnis-Tint | Geplant | BP-017 |
| BP-020 | Redesign: Gestaffelter Eintritt | Geplant | BP-017 |
| BP-021 | Redesign: Abschluss, Validierung, Aufräumen | Geplant | BP-018, BP-019, BP-020 |

**Beschlossene Reihenfolge (OP-18, 2026-11-15):** BP-008 → BP-010 → BP-011 → BP-012 → BP-013 (Redesign). Die Korrekturen kommen vor dem Redesign.

**Nächstes vorgesehenes Paket:** BP-016. Das Redesign wird auf dem Branch `redesign` entwickelt (OP-27, D-024); `main` bleibt unverändert, bis BP-021 abgeschlossen ist. Die Korrekturpakete BP-008, BP-010, BP-011, BP-012 sind umgesetzt (Commits siehe je Paket); ihre Browser-Validierung steht aus. Die Umsetzung startet jeweils auf Abruf des Auftraggebers (z. B. `IMPLEMENT BP-016`).

**Hinweis zu BP-012:** Die Achsenänderung wirkt in Chart.js (D-005). Mit dem Redesign entfällt Chart.js (D-017); die Einheit Tausend USD (D-015) gilt dann für die neuen SVG-Diagramme weiter. Die Entscheidung, BP-012 trotzdem vorab umzusetzen, liegt beim Auftraggeber.

---

## Abgeschlossene Pakete (rekonstruiert aus der Git-Historie)

### BP-001 Grundrechner mit Vermögens-Chart und Cashflow

- **Status:** Umgesetzt
- **Ziel:** Berechnung und Darstellung des Vermögensverlaufs über mehrere Jahre inkl. prozentualer jährlicher Entnahme.
- **Commits:** `d0d8bb4`, `1d1a0a9`, `1cd677f`, `dc20f10`, `87189d2` (2024-11-14 bis 2024-11-15)
- **Komponenten:** `index.html`, Berechnung `berechneVermoegen`, Chart `vermoegenChart`
- **Akzeptanzkriterien (Ist):** Eingaben Startkapital, Jahre, Rendite, Standardabweichung, Cashflow; Liniendiagramm je Jahr; Tabelle entfernt; mobile Darstellung.

### BP-002 Dividenden und zweites Diagramm

- **Status:** Umgesetzt
- **Ziel:** Dividenden berechnen und gemeinsam mit dem Cashflow in einem zweiten Diagramm darstellen.
- **Commit:** `63897b8` (2024-11-16)
- **Komponenten:** Eingabe `dividendeProzent`, Chart `bezugDataChart`

### BP-003 Tooltips für Eingabefelder

- **Status:** Umgesetzt
- **Ziel:** Erklärende Bootstrap-Tooltips an allen Labels.
- **Commit:** `c11ebaa` (2024-11-16)

### BP-004 Validierung, Bereinigung, Dateitrennung, Simulation

- **Status:** Umgesetzt (mit Befund IB-01)
- **Ziel:** Fehleingaben verhindern, CSS/JS auslagern, Simulations-Button.
- **Commits:** `93891ae`, `7faecdf`, `150c0c0` (2024-11-16 bis 2024-11-17)
- **Komponenten:** `validateInput`, `sanitizeInput`, `startSimulation`, `site.css`, `site.js`
- **Entscheidungen:** D-002, D-003, D-009

### BP-005 SEO- und Social-Media-Metadaten

- **Status:** Umgesetzt (mit Befund IB-03)
- **Commit:** `86725cd` (2024-11-17)
- **Entscheidung:** D-013

### BP-006 Max.-Drawdown-Begrenzung

- **Status:** Umgesetzt
- **Ziel:** Eingabe eines erwarteten maximalen Drawdowns, Kappung über High-Watermark, Ausweis des Max. Drawdown.
- **Commits:** `93e90a5`, `570e7a1` (2025-09-07)
- **Entscheidung:** D-007

### BP-007 Dark Theme und KPI-Box

- **Status:** Umgesetzt (mit Befund IB-02)
- **Ziel:** Dunkles Theme, Chart-Farben angepasst, KPI-Box mit Wachstum, Drawdown, Volatilität, Summen; neue Default-Werte.
- **Commits:** `7c4e5ac`, `f6c9580`, `2e02d59`, `ffef6d0`, `cf77d33` (2025-09-07 bis 2025-09-08)
- **Entscheidungen:** D-010, D-011

---

## Vorgeschlagene Pakete (Freigabe ausstehend)

### BP-008 Korrektur Step-Validierung

- **Status:** Umgesetzt (2026-11-15), Commit a00a371. Akzeptanzkriterien per Skript gegen die echte Funktion geprüft; Prüfung im Browser steht aus (siehe unten).
- **Umsetzung:** `site.js`, `validateInput`: Die Prüfung `(value − min) % step !== 0` wurde durch einen Vergleich des Quotienten `(value − min) / step` mit dem nächsten ganzzahligen Wert (Toleranz 1e-9) ersetzt. Eine Zeile Logik plus Kommentar; sonst nichts verändert.
- **Prüfergebnis (Skript, Node):** `dividendeProzent` 1.0 / 1.2 / 2.5 → OK; 1.25 → Meldung „multiple of 0.1“. `maxDrawdown` −18 / −18.5 / −0.1 → OK; −18.55 → Meldung. Felder ohne `step` unverändert (min- und max-Meldungen funktionieren weiter).
- **Nicht prüfbar:** Das Verhalten der Browser-Meldung im Eingabefeld (`reportValidity`) wurde nicht im Browser geprüft.
- **Grundlage:** IB-01 in [project_plan.md](project_plan.md)
- **Ziel:** `validateInput` meldet nur noch Werte als ungültig, die tatsächlich nicht zum `step` des Feldes passen.
- **Scope:** Nur die Step-Prüfung in `validateInput`.
- **Nicht im Scope:** Blockieren der Berechnung bei ungültigen Eingaben (OP-09), Änderungen an `min`/`max`/`step` der Felder, Änderungen an `sanitizeInput`.
- **Voraussetzungen:** keine
- **Betroffene Dateien:** `site.js`
- **Umsetzungsschritte:**
  1. Step-Vergleich gleitkommasicher gestalten (Toleranz oder Rundung auf die Dezimalstellen des `step`).
  2. Restliche Prüfreihenfolge (leer, min, max) unverändert lassen.
- **Akzeptanzkriterien:**
  - `dividendeProzent` = 1.0, 1.2, 2.5 → keine Fehlermeldung.
  - `maxDrawdown` = -18, -18.5, -0.1 → keine Fehlermeldung.
  - `dividendeProzent` = 1.25 → Meldung „The value must be a multiple of 0.1.“
  - Felder ohne `step` verhalten sich unverändert.

### BP-009 Korrektur CSS-Struktur der Media Query

- **Status:** Aufgegangen in BP-014 (2026-11-15): `site.css` wurde neu geschrieben, die defekte Media-Query-Struktur existiert nicht mehr. Ursprünglich blockiert durch OP-06 (erledigt).
- **Grundlage:** IB-02 in [project_plan.md](project_plan.md)
- **Ziel:** Die mobilen Regeln am Dateiende von `site.css` gelten nur innerhalb von `@media (max-width: 786px)`; die Datei ist syntaktisch korrekt.
- **Scope:** Kommentar- und Klammerstruktur der Media Query; Entfernen der doppelt verschachtelten Regel für die KPI-Spans.
- **Nicht im Scope:** IB-04a bis IB-04d, Farb- oder Theme-Anpassungen, Breakpoint-Vereinheitlichung.
- **Voraussetzungen:** Entscheidung zu OP-06 (welches Desktop-Layout Soll ist). Falls das aktuelle Erscheinungsbild Soll ist, müssen die heute global wirkenden Regeln bewusst global bleiben.
- **Betroffene Dateien:** `site.css`
- **Akzeptanzkriterien:**
  - `site.css` enthält keine verschachtelten Kommentare und keine ungeschlossenen Blöcke.
  - Desktop-Darstellung entspricht der unter OP-06 entschiedenen Variante.
  - Mobile Darstellung (< 786 px) unverändert gegenüber dem Ist-Zustand.

### BP-010 Korrektur HTML-Kopfstruktur

- **Status:** Umgesetzt (2026-11-15), Commit 957773c. Struktur per Skript geprüft; Darstellung im Browser nicht geprüft (siehe unten).
- **Umsetzung:** `index.html`, Zeile 4: `<head></head>` → `<head>`. Sonst nichts verändert.
- **Prüfergebnis (Skript, Node):** genau ein `<head>` und ein `</head>`; alle 16 `<meta>`, 3 `<link>` und der `<title>` liegen im `<head>`, das vor `<body>` schliesst.
- **Nicht prüfbar:** Browser-Darstellung und -Funktion. Da Browser das fehlerhafte Markup bisher selbst korrigiert haben, wird keine sichtbare Änderung erwartet.
- **Grundlage:** IB-03 in [project_plan.md](project_plan.md)
- **Ziel:** Valides `<head>`-Element mit allen Meta-, Titel- und Link-Elementen.
- **Scope:** Entfernen des vorzeitigen `</head>` in Zeile 4 von `index.html`.
- **Nicht im Scope:** Inhalte der Metadaten (OP-07), ungenutzter Font (IB-04d), CDN-Versionen (OP-08).
- **Voraussetzungen:** keine
- **Betroffene Dateien:** `index.html`
- **Akzeptanzkriterien:**
  - Genau ein `<head>` und ein `</head>`; alle Meta-/Link-/Title-Elemente liegen darin.
  - Darstellung und Funktion unverändert.

---

## Geplante Pakete (fachlich entschieden, Umsetzung auf Abruf)

### BP-011 „Total Growth“ ab Startkapital

- **Status:** Umgesetzt (2026-11-15), Commit 06a4c26. Akzeptanzkriterien per Skript gegen die echte Funktion geprüft; Prüfung im Browser steht aus.
- **Umsetzung:** `site.js`, `berechneVermoegen`: `wachstum` wird jetzt als `(V_letztes − startkapital) / startkapital · 100` berechnet. Die dadurch ungenutzte Variable `vermoegenErstesJahr` (Deklaration und Zuweisung in der Schleife) wurde entfernt (Umsetzungsschritt 2). Sonst nichts verändert.
- **Prüfergebnis (Skript, Node, `standardabweichung` 0, `maxDrawdown` −100, `relativerBezug` 0, Startkapital 100000, Rendite 10 %):** 2 Jahre → 21.00 %; 1 Jahr → 10.00 % (bisher 0.00 %); 3 Jahre → 33.10 %. Zusätzlich: 5 % Cashflow, 1 Jahr → 4.50 %; Rendite −50 %, 1 Jahr → −50.00 %. Ausgabeformat `Total Growth: x.xx% Max. Drawdown: y.yy%` unverändert; Max. Drawdown und Volatility unverändert.
- **Nicht prüfbar:** Anzeige in der KPI-Box im Browser.

**Planung (Vorgabe aus dem INIT):**
- **Grundlage:** D-014; [project_plan.md](project_plan.md), Kapitel 7.2
- **Ziel:** Die Kennzahl „Total Growth“ misst das Wachstum vom Startkapital bis zum Vermögen am Ende des letzten Jahres.
- **Scope:** Berechnung von `wachstum` in `berechneVermoegen`.
- **Nicht im Scope:** Max. Drawdown, Volatility, Summen, Textformat der KPI-Box, Diagramme.
- **Voraussetzungen:** keine
- **Betroffene Dateien:** `site.js`
- **Umsetzungsschritte:**
  1. Basis der Wachstumsberechnung von `vermoegenErstesJahr` auf `startkapital` umstellen.
  2. Prüfen, ob `vermoegenErstesJahr` danach noch verwendet wird; nur wenn nicht, entfernen.
- **Akzeptanzkriterien:**
  - `standardabweichung` = 0, `maxDrawdown` = -100, `relativerBezug` = 0, `startkapital` = 100000, `renditeProJahr` = 10, `jahre` = 2 → Total Growth = 21.00 %.
  - Gleiche Werte mit `jahre` = 1 → Total Growth = 10.00 % (bisher 0.00 %).
  - Ausgabeformat `Total Growth: x.xx% Max. Drawdown: y.yy%` unverändert.

### BP-012 Diagramm-Achsen in Tausend USD

- **Status:** Umgesetzt (2026-11-15), Commit 3903393. Konfiguration per Skript geprüft; Darstellung im Browser nicht geprüft (siehe unten).
- **Umsetzung:** `site.js`, `renderCharts`: In `scales.y.ticks` beider Diagramme (`vermoegenChart`, `bezugDataChart`) wurde `callback: value / 1000` ergänzt. Sonst nichts verändert.
- **Prüfergebnis (Skript, Node, echte `renderCharts` mit Chart-Stub, Viewport 1200 und 500 px):** Tick-Werte 0 / 100000 / 250000 / 300000 / 1500000 erscheinen als 0 / 100 / 250 / 300 / 1500; im Cashflow-Diagramm 2500 / 12500 als 2.5 / 12.5. Data Labels (250000 → 250), Legendentexte und Datenreihen unverändert; Achsentitel bei < 768 px weiterhin ausgeblendet; KPI-Box nicht berührt.
- **Nicht prüfbar:** Die tatsächlich von Chart.js gewählten Tick-Werte und die Darstellung im Browser. Bei kleinen Cashflow-/Dividendenbeträgen zeigt die Achse Dezimalwerte (z. B. 2.5).

**Planung (Vorgabe aus dem INIT):**
- **Grundlage:** D-015; [project_plan.md](project_plan.md), Kapitel 8.1
- **Ziel:** Achsen, Legenden und Data Labels beider Diagramme zeigen dieselbe Einheit (Tausend USD).
- **Scope:** Tick-Formatierung der Y-Achse in `renderCharts` für `vermoegenChart` und `bezugDataChart`.
- **Nicht im Scope:** Datenreihen, Legendentexte, Data Labels, Farben, KPI-Box, Achsentitel.
- **Voraussetzungen:** keine
- **Betroffene Dateien:** `site.js`
- **Akzeptanzkriterien:**
  - Bei Default-Werten zeigt die Y-Achse des Vermögens-Diagramms Werte in Tausend (z. B. 200 statt 200,000).
  - Data Label und Achse sind für denselben Datenpunkt in der gleichen Grössenordnung ablesbar.
  - Die Beträge in der KPI-Box bleiben in vollen USD.
  - Desktop und Viewport < 768 px funktionieren unverändert.

---

## Redesign

### BP-013 Redesign Motion Graphics – Konzept und Paketierung

- **Status:** Plan erstellt (2026-11-15, Modus PLAN); Abnahme durch den Auftraggeber ausstehend. Die Pakete BP-014 bis BP-021 sind angelegt. Offen: OP-25 (Annahme im Plan) und OP-27 (Branch).
- **Grundlage:** D-016 bis D-029; [project_plan.md](project_plan.md), Kapitel 13
- **Ziel:** Ein abgestimmtes Gestaltungskonzept auf Basis der Referenz Wealth-Lab-Strategy-Orchestrator und die Zerlegung in umsetzbare Arbeitspakete (ab BP-014).
- **Scope:** Nur Planung (Modus PLAN): OP-21 (Detailregeln Ergebnis-Tint) klären, Aurora-Farbzuordnung festlegen, Umgang mit der Einzeichnung bei jedem Tastendruck prüfen (D-021), Arbeitspakete mit Akzeptanzkriterien anlegen. Vorgesehene Paketthemen (Entwurf, keine Zusage): SVG-Diagramme ohne Chart.js (D-017), Layout und Formulare ohne Bootstrap (D-019), Aurora-Theme (D-018), Motion-Effekte inkl. Einzeichnung bei jeder Neuberechnung (D-020, D-021), „!“-Tooltips (D-022), Ergebnis-Tint (D-023), Ladeanzeige, Reduced-Motion und Touch-Flächen.
- **Nicht im Scope:** Produktivcode, Änderungen an Berechnung, Eingabefeldern oder KPI-Definitionen.
- **Voraussetzungen:** Abruf durch den Auftraggeber; Abschluss von BP-008, BP-010, BP-011, BP-012.
- **Akzeptanzkriterien:**
  - OP-21 entschieden und in `project_plan.md` nachgeführt. **Erfüllt** (D-023, Kapitel 13.7).
  - Konkrete Aurora-Palette mit Zuordnung zu den Datenreihen festgelegt und als Decision erfasst. **Erfüllt als Vorschlag** (D-029, Kapitel 13.8); verbindlich mit Abnahme.
  - Arbeitspakete BP-014 ff. mit Scope, Nicht-Scope und Akzeptanzkriterien im Build-Plan. **Erfüllt** (BP-014 bis BP-021).
  - Weitere Ergebnisse der Planung: D-025 bis D-028, Kapitel 13.6 bis 13.9 (Architektur, Risiken), OP-25 und OP-27 als offene Punkte.

---

## Redesign-Pakete (aus BP-013, 2026-11-15)

**Gemeinsame Regeln für BP-014 bis BP-021:**

- Grundlage: D-016 bis D-029; Plan in [project_plan.md](project_plan.md), Kapitel 13.6 bis 13.9.
- Berechnung, Formeln, Default-Werte, `min`/`max`/`step`, IDs der Eingabefelder und Textformate der KPI-Box bleiben unverändert (13.4); jedes Paket prüft das per Vergleich mit dem Stand vor dem Redesign.
- Nur der Scope des Pakets; Chart.js und Datalabels bleiben bis BP-016 bestehen.
- Nach jedem Paket ist die Seite vollständig bedienbar. Der Zwischenstand mit gemischtem Design ist erwartet und deshalb nicht für `main` gedacht (OP-27).
- Validierung im Browser: Desktop (≥ 1200 px) und Smartphone-Breite (390 px), Konsole ohne Fehler, Reduced-Motion ab BP-017.

### BP-014 Fundament ohne Bootstrap, Layout und „!“-Tooltips

- **Status:** Umgesetzt (2026-11-15), Commit 3cd08f7 auf Branch `redesign` (OP-27); Plan von BP-013 mit dem Abruf von BP-014 als abgenommen betrachtet.
- **Umsetzung:** `index.html` (Bootstrap-CSS/-JS, Google-Fonts-Links und alle Bootstrap-Klassen entfernt; neue `ag-`-Klassen; „!“-Button je Eingabefeld mit `data-tooltip`; auch der auskommentierte Block für `jaehrlicherInvest` auf das neue Markup umgestellt), `site.css` (neu geschrieben, Farben als Variablen `--ag-*` im Bestand), `site.js` (eigene Tooltip-Logik `initTooltips` statt `bootstrap.Tooltip`, Schrift der Data Labels auf Systemschrift).
- **Prüfergebnis (statisch und Chrome headless über DevTools-Protokoll, Desktop 1280 px und Smartphone 390 px mit Touch-Emulation):**
  - Kein Request an Bootstrap oder Google Fonts; es bleiben `cdn.jsdelivr.net` mit Chart.js und Datalabels (bis BP-016). **Erfüllt.**
  - IDs (16), sieben Eingabefelder mit Attributen und Handlern sind identisch zum Stand vor dem Paket (Skriptvergleich mit `HEAD`); Tooltip-Texte der sieben Felder identisch. **Erfüllt.**
  - Zwei Spalten bei 1280 px, eine Spalte bei 390 px; keine horizontale Scrollleiste (Seitenbreite 390 px). Die Grenze 768 px ist im CSS gesetzt, aber nicht exakt auf 767/768 px gemessen. **Erfüllt.**
  - Reihenfolge Vermögens-Diagramm, KPI-Box, Cashflow-Diagramm (Positionsvergleich). **Erfüllt.**
  - „!“-Symbol: Tooltip bei Hover, bei Fokus und bei Tippen sichtbar, Escape und Verlassen schliessen ihn; Tippfläche 44 × 44 px (`::after`) und Button-Höhe 44 px bei `pointer: coarse`. **Erfüllt.** Nicht geprüft: echte Touch-Geräte, Safari/iOS.
  - Schrift: Text Segoe-UI-Stack, Eingaben und KPI-Box Consolas-/Monospace-Stack (berechnete Werte). **Erfüllt.**
  - Konsole ohne Fehler bei Desktop und Smartphone. **Erfüllt.**
  - Berechnung unverändert: Eingabe Rendite 10 %, Standardabweichung 0, 2 Jahre, Drawdown −100 ergibt Total Growth 21.00 % (wie BP-011); 1.2 wird akzeptiert, 1.25 abgelehnt (wie BP-008); Simulations-Button wechselt zwischen „Start“ und „Stop“. **Erfüllt.**
- **Sichtbare Abweichungen zum bisherigen Aussehen (erwartet, Layout war neu festzulegen):** Labels linksbündig statt rechtsbündig; „!“-Symbole neben den Labels statt Tooltip am Label; Diagramme bis 900 px breit (vorher durch den CSS-Fehler IB-02 ca. 800 px) bei einer Höhe von 50 % der Fensterhöhe (260 bis 480 px). Farben unverändert.
- **Beobachtung:** Eine Ganzseiten-Aufnahme (Browser-Grösse wird dafür geändert) zeigt die Chart.js-Linien mitten in deren Einlauf-Animation. Der normale Ausschnitt zeigt die Diagramme vollständig. Das ist ein Messeffekt, kein Fehler.
- **Nicht prüfbar:** Andere Browser als Chrome (OP-12), echte Touch-Geräte.

**Planung (Vorgabe aus BP-013):**
- **Grundlage:** D-019, D-022; löst IB-02, IB-04a bis IB-04d und BP-009 auf
- **Ziel:** Die Seite läuft ohne Bootstrap und ohne Google Fonts, mit eigenem Layout und eigenen Tooltips.
- **Scope:**
  - `index.html`: Bootstrap-CSS/-JS und Google-Fonts-Links entfernen, Bootstrap-Klassen und `data-bs-*` durch eigene Klassen (`ag-`) ersetzen, „!“-Symbol je Eingabefeld.
  - `site.css`: neu geschrieben (Basis, Raster, Formularfelder, Button, KPI-Box, Chart-Container, Tooltip, Responsive ab 768 px, Fokus, Touch-Flächen 44 × 44 px, Systemschriften). Farben unverändert (Bestandsfarben bis BP-015).
  - `site.js`: Bootstrap-Tooltip-Initialisierung ersetzen; Schriftfamilie „Space Mono“ in der Chart.js-Konfiguration durch die Systemschrift ersetzen.
- **Nicht im Scope:** Aurora-Farben, SVG-Diagramme, Animationen, Berechnung, Tipp-Verzögerung.
- **Voraussetzungen:** Abnahme BP-013; Entscheid OP-27.
- **Betroffene Dateien:** `index.html`, `site.css`, `site.js`
- **Akzeptanzkriterien:**
  - Kein Request an Bootstrap oder Google Fonts; kein `bootstrap`-Aufruf im Code.
  - Alle sieben Eingabefelder, Button und Anzeigeelemente mit unveränderten IDs, Defaults, Grenzen und Inline-Handlern.
  - Zwei Spalten ab 768 px, eine Spalte darunter; bei 390 px keine horizontale Scrollleiste.
  - Reihenfolge unverändert: Eingabebereich, Vermögens-Diagramm, KPI-Box, Cashflow-Diagramm.
  - „!“-Symbol zeigt den Tooltip bei Hover, Tastaturfokus und Tippen; Texte identisch zu Kapitel 6; Tippfläche mindestens 44 × 44 px auf Touch-Geräten.
  - Schrift ist eine Systemschrift (Text: Segoe-UI-Stack, Zahlen: Consolas-/Monospace-Stack).
  - Konsole ohne Fehler; Berechnung unverändert.

### BP-015 Aurora-Farbwelt der Seite

- **Status:** Umgesetzt (2026-11-15), Commit 6839a86 auf Branch `redesign`.
- **Umsetzung:** Nur `site.css`: Variablen `--ag-*` nach Kapitel 13.8; Hintergrund mit statischem Sternenfeld und Aurora-Bändern (`body::before` oben, `body::after` unten, fest und hinter dem Inhalt); Glaskarten für Eingabebereich, Diagramme und KPI-Box; Fokus, „!“-Symbole und Tooltip in Teal/Cyan; Button mit Verlauf Cyan → Teal; `color-scheme: dark`. Die Transition des Buttons aus BP-014 entfiel (Kriterium „keine Animation“). Der Eingabebereich ist wie die Diagramme auf 900 px begrenzt, damit alle Karten gleich breit sind.
- **Prüfergebnis:**
  - Kein Amber-Wert mehr in `site.css` (Suche nach `#ffc107`, `rgba(255,193,7,…)`, `#e0a800`). **Erfüllt.**
  - Palette entspricht 13.8 (Variablen und berechnete Farben im Browser: Button-Verlauf `rgb(88,196,255)` → `rgb(45,226,196)`, Karte `rgba(10,24,36,0.84)`, Text `rgb(234,252,255)`, Labels `rgb(147,172,191)`). **Erfüllt.**
  - Kontraste rechnerisch (WCAG, mit Alpha-Komposition, ungünstigste Hintergrundstelle unter den Bändern): Text auf Karte 14.6 bis 16.4 : 1; Labels 6.5 bis 7.4 : 1; Eingabetext 18.1 : 1; „!“-Symbol Teal 9.4 : 1; Button-Text auf Cyan/Teal 10.4 bis 14.4 : 1 (auch Hover); Tooltip-Text 16.7 : 1; Fusszeile 6.1 bis 6.5 : 1; Titel 4.8 bis 5.0 : 1 (jeweils mindestens 4.5). Nicht-Text: Eingaberand 4.2 : 1, Fokus Cyan 7.9 : 1, „!“-Rand 9.4 : 1 (mindestens 3). **Erfüllt.** Der Titel auf mobilen Geräten verwendet die Textfarbe statt Teal, weil Teal bei 14 px den Mindestkontrast unter den Bändern nicht sicher erreicht.
  - Fokus bleibt deutlich sichtbar (Teal-Rand plus Ring bei Eingabefeldern, Cyan-Umrandung bei Symbol und Button). **Erfüllt.**
  - Keine Animation: keine `animation`, `transition` oder `@keyframes` in `site.css`; im Browser 0 laufende CSS-Animationen. **Erfüllt.**
  - Unverändert gegenüber BP-014: zwei Spalten/eine Spalte, keine horizontale Scrollleiste bei 390 px, Tooltips (Hover, Fokus, Escape, Tippen), 44-px-Tippflächen, Konsole ohne Fehler, nur `cdn.jsdelivr.net` mit Chart.js und Datalabels, Berechnung (21.00 % im Testfall), Simulations-Button.
- **Übergangszustand (erwartet):** Die Diagrammlinien sind bis BP-016 noch Gelb und Grün (Chart.js im Bestand) und passen farblich nicht zur Palette.
- **Nicht prüfbar:** Andere Browser, echte Geräte (OP-12); `backdrop`-ähnliche Effekte nicht verwendet.
- **Grundlage:** D-018, D-029; [project_plan.md](project_plan.md), Kapitel 13.8
- **Ziel:** Die Seite erscheint im Aurora-Design (ohne Diagramme).
- **Scope:** `site.css`: Variablen `--ag-*` nach 13.8, Hintergrund mit statischem Sternenfeld und Aurora-Bändern, Glaskarten, Fokus, Button, KPI-Box, Tooltip, Titel. Amber vollständig entfernen.
- **Nicht im Scope:** Diagramm-Farben (Chart.js bleibt bis BP-016 im Bestand, Übergangszustand), Animationen.
- **Voraussetzungen:** BP-014
- **Betroffene Dateien:** `site.css`
- **Akzeptanzkriterien:**
  - Kein Amber-Wert (`#ffc107`, `rgba(255,193,7,…)`) mehr in `site.css`.
  - Palette entspricht 13.8.
  - Kontrast von Text, Labels, Tooltip und Button gegen ihren Hintergrund rechnerisch mindestens 4.5 : 1, Ergebnis im Paket dokumentiert.
  - Fokus bleibt deutlich sichtbar.
  - Keine Animation und keine Dauer-Animation.

### BP-016 SVG-Diagramme ohne Chart.js

- **Status:** Geplant
- **Grundlage:** D-017, D-015, D-028, D-029; [project_plan.md](project_plan.md), Kapitel 8.1, 13.6
- **Ziel:** Beide Diagramme werden als Inline-SVG gezeichnet; Chart.js und Datalabels-Plugin entfallen.
- **Scope:**
  - Neu `charts.js`: `renderCharts(labels, data, bezugData, dividendeData)` zeichnet beide Diagramme in `<svg id="vermoegenChart">` und `<svg id="bezugDataChart">` (Tag-Wechsel von `canvas`).
  - Inhalt: Achsen (Y in Tausend USD nach D-015, X Jahre), Gitter, drei Linien, Data Labels `floor(Wert / 1000)` (ab 768 px), statische Legende (Texte unverändert, OP-25), Achsentitel „Profit“ und „Cashflow/Dividends“ (ab 768 px), Tooltip bei Hover und Touch (Jahr und Werte mit Einheit), Glow ohne SVG-Filter, Sternenfeld mit festem Seed, dezente Fläche unter der Vermögenslinie (Gestaltung nach Vorbild), Koordinatenräume Desktop und schmal, Neuzeichnen bei Grössenänderung.
  - `index.html`: Canvas durch SVG ersetzen, Scripts von Chart.js und Datalabels entfernen, `charts.js` einbinden. `site.js`: Chart.js-Code entfernen.
- **Nicht im Scope:** Animationen (BP-018), Tint, Berechnung, Zoom und Pan (gab es nicht).
- **Voraussetzungen:** BP-015
- **Betroffene Dateien:** `charts.js` (neu), `index.html`, `site.css`, `site.js`
- **Akzeptanzkriterien:**
  - Kein Request mehr an `cdn.jsdelivr.net` oder `fonts.googleapis.com`.
  - Gleiche Datenreihen, Beschriftungen und Einheiten wie bisher; Y-Achse in Tausend, Data Labels wie bisher.
  - Linienfarben nach 13.8 (Vermögen Cyan, Cashflow Teal, Dividenden Violett); Kontrast von Linien und Achsen mindestens 3 : 1, von Text mindestens 4.5 : 1, dokumentiert.
  - Tooltip zeigt Jahr und Werte; funktioniert mit Maus und Touch.
  - `NaN`-Eingaben: kein Fehler in der Konsole, leeres Diagramm (wie bisher, kein neues Fehlerverhalten).
  - Bei 390 px sind Achsen- und Labeltexte effektiv mindestens 10 px gross; Grössenänderung zeichnet neu.
  - SVG mit `role="img"` und `aria-label`.
  - Keine Animation.

### BP-017 Motion-Grundlage, Intro-Loader, Hintergrund-Drift

- **Status:** Geplant
- **Grundlage:** D-020, D-027; Muster des Vorbilds (dessen D-026, D-027, D-030, D-032, D-043)
- **Ziel:** Gemeinsame Motion-Infrastruktur, kurzer Intro-Loader und driftender Hintergrund.
- **Scope:**
  - Neu `motion.css`, `motion.js`: Klasse `ag-motion` an `<html>` (nicht bei `prefers-reduced-motion: reduce`), Signal „bereit“ (`AG_MOTION.whenReady`), Loader-Steuerung.
  - Loader: Mini-Chart mit Titel, ca. 1 s, nur `transform`/`opacity`; Ausblenden zusätzlich über eine reine CSS-Animation als Sicherheitsnetz; ohne JavaScript und bei Reduced-Motion nicht sichtbar.
  - Hintergrund-Drift der unscharfen Aurora-Bänder (`body::before/::after`) über `transform`, nur ab 701 px.
  - Reduced-Motion-Regeln für alle Animationen.
- **Nicht im Scope:** Einzeichnung der Diagramme, Hochzählen, Tint, Staffelung.
- **Voraussetzungen:** BP-016
- **Betroffene Dateien:** `motion.css` (neu), `motion.js` (neu), `index.html`, `site.css`
- **Akzeptanzkriterien:**
  - Loader sichtbar zwischen 0.9 und 1.3 s, danach Inhalt vollständig sichtbar.
  - Bei Reduced-Motion und ohne JavaScript kein Loader und keine Verdeckung des Inhalts.
  - Drift nur ab 701 px und nur über `transform`; bei Reduced-Motion keine Bewegung.
  - Alle Dauer-Animationen nutzen ausschliesslich `transform` oder `opacity`.
  - Seite funktioniert unverändert, wenn `motion.js` fehlt (statischer Endzustand).

### BP-018 Einzeichnung, Hochzählen, Tipp-Pause

- **Status:** Geplant
- **Grundlage:** D-021, D-025, D-026
- **Ziel:** Diagramme zeichnen sich bei jeder Neuberechnung ein, Kennzahlen zählen hoch, Eingaben lösen nach einer Tipp-Pause aus.
- **Scope:**
  - `charts.js`/`motion.css`: Linien über `pathLength="1"` und `stroke-dashoffset` einzeichnen (ca. 1400 ms, Easing des Vorbilds), Fläche und Data Labels blenden danach ein; jeder Render bricht eine laufende Einzeichnung ab.
  - `motion.js`: Hochzählen der fünf Kennzahlen, erstes Laden von 0, danach vom vorherigen zum neuen Wert; Endtext exakt der formatierte Text.
  - `site.js` und `index.html`: `oninput` ruft die verzögerte Variante auf (250 ms Tipp-Pause); `validateInput` weiter sofort; Button und Simulation rechnen sofort; Start der Simulation verwirft eine wartende Berechnung.
- **Nicht im Scope:** Tint, Staffelung, Loader, Berechnung.
- **Voraussetzungen:** BP-017
- **Betroffene Dateien:** `charts.js`, `motion.js`, `motion.css`, `site.js`, `index.html`
- **Akzeptanzkriterien:**
  - Einzeichnung bei Eingabe nach Pause, Button und jeder Simulationswiederholung.
  - Tippen von „25“ löst genau eine Berechnung nach 250 ms Pause aus; ein schneller zweiter Render hinterlässt keine überlagerte Einzeichnung.
  - Reduced-Motion: Ergebnis sofort, kein Hochzählen, keine Einzeichnung.
  - Die Texte der KPI-Box sind nach dem Hochzählen zeichengleich zum Format ohne Motion.
  - Flüssigkeit der Einzeichnung bei 4-facher CPU-Drosselung im Browser gemessen und dokumentiert; bei Rucklern Umstellung gemäss Risiko 3.

### BP-019 Ergebnis-Tint

- **Status:** Geplant
- **Grundlage:** D-023; [project_plan.md](project_plan.md), Kapitel 13.7
- **Ziel:** Der Hintergrund färbt sich weich nach Total Growth.
- **Scope:** Zwei Tint-Ebenen in `index.html`, Regeln in `motion.css`, `AG_MOTION.setResult(growthPercent)` in `motion.js`, Aufruf aus `site.js` nach der Berechnung. Regeln nach 13.7 (Neutralzone, Intensität, nur Deckkraft, 2400 ms).
- **Nicht im Scope:** Berechnung der Kennzahl, andere Kennzahlen, Farbübergang über `@property`.
- **Voraussetzungen:** BP-017
- **Betroffene Dateien:** `index.html`, `motion.css`, `motion.js`, `site.js`
- **Akzeptanzkriterien:**
  - Rendite 0, Standardabweichung 0, Cashflow 0 (Total Growth 0 %): keine Färbung.
  - Total Growth +100 %: Intensität ca. 0.49, Gewinn-Ebene sichtbar, Verlust-Ebene unsichtbar.
  - Negatives Ergebnis: Verlust-Ebene (Rosé) sichtbar.
  - Übergang weich (2400 ms), nur `opacity` animiert.
  - Unter 701 px und bei Reduced-Motion keine Färbung.
  - Sichtprüfung durch den Auftraggeber; Entscheid zu `G0` und zur Sättigung im Default (13.7) dokumentiert.

### BP-020 Gestaffelter Eintritt

- **Status:** Geplant
- **Grundlage:** D-020; Muster des Vorbilds (dessen D-028)
- **Ziel:** Eingabefelder, Diagramm-Karten und KPI-Box steigen gestaffelt auf.
- **Scope:** `motion.js`: `revealOnScroll` mit `IntersectionObserver` (60 ms Versatz); `motion.css`: Keyframes mit `opacity` und `transform`; Start nach dem Loader.
- **Nicht im Scope:** Wiederholtes Aufsteigen bei Neuberechnung, Layout-Änderungen.
- **Voraussetzungen:** BP-017
- **Betroffene Dateien:** `motion.js`, `motion.css`, `index.html`
- **Akzeptanzkriterien:**
  - Elemente oberhalb des Falzes steigen nach dem Loader gestaffelt auf, darunter beim Scrollen.
  - Nur `opacity` und `transform`; keine Verschiebung des Layouts.
  - Neuberechnung löst kein erneutes Aufsteigen aus.
  - Ohne `IntersectionObserver` und bei Reduced-Motion sind alle Elemente sofort sichtbar.

### BP-021 Abschluss, Validierung, Aufräumen

- **Status:** Geplant
- **Grundlage:** D-016 bis D-029
- **Ziel:** Das Redesign ist gegen die Spezifikation geprüft, aufgeräumt und dokumentiert.
- **Scope (Modus VALIDATE, danach Dokumentation):**
  - Prüfung aller Akzeptanzkriterien BP-014 bis BP-020 und der Entscheidungen D-016 bis D-029.
  - Aufräumen: ungenutzte Variablen, CSS und Chart.js-Reste entfernen.
  - SDD: D-004, D-005, D-010 als ersetzt und wirksam kennzeichnen; Befunde IB-02, IB-04 schliessen; `agents.md` (Dateitabelle, Technik) aktualisieren; D-028 und D-029 bei Abnahme auf „Bestätigt“ setzen.
  - Zusammenführen nach `main` nach Entscheid zu OP-27 (Push nur auf ausdrücklichen Auftrag).
- **Nicht im Scope:** Neue Funktionen.
- **Voraussetzungen:** BP-018, BP-019, BP-020
- **Akzeptanzkriterien:**
  - Alle Kriterien der Pakete BP-014 bis BP-020 sind erfüllt, teilweise erfüllt oder nicht prüfbar ausgewiesen.
  - Kein externer Request (kein CDN, keine Webfonts).
  - Berechnungsergebnisse und KPI-Formate gleichen dem Stand vor dem Redesign (Vergleich des Berechnungscodes in `site.js`).
  - Reduced-Motion und 390 px Breite geprüft; mindestens ein zweiter Browser neben Chrome geprüft oder als nicht prüfbar vermerkt (OP-12).
