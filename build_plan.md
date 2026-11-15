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
| BP-009 | Korrektur CSS-Struktur der Media Query (IB-02) | Zurückgestellt (geht im Redesign auf) | BP-007 |
| BP-010 | Korrektur HTML-Kopfstruktur (IB-03) | Umgesetzt (nicht im Browser validiert, Commit 957773c) | BP-005 |
| BP-011 | „Total Growth“ ab Startkapital (D-014) | Umgesetzt (nicht im Browser validiert, Commit 06a4c26) | BP-007 |
| BP-012 | Diagramm-Achsen in Tausend USD (D-015) | Umgesetzt (nicht im Browser validiert, Commit 3903393) | BP-007 |
| BP-013 | Redesign Motion Graphics – Konzept und Paketierung (D-016 bis D-023) | Geplant; Start erst nach BP-008, -010, -011, -012; im PLAN ist OP-21 zu klären | BP-008, BP-010, BP-011, BP-012 |

**Beschlossene Reihenfolge (OP-18, 2026-11-15):** BP-008 → BP-010 → BP-011 → BP-012 → BP-013 (Redesign). Die Korrekturen kommen vor dem Redesign.

**Nächstes vorgesehenes Paket:** BP-013 (Redesign, Modus PLAN). Alle Korrekturpakete BP-008, BP-010, BP-011, BP-012 sind umgesetzt; ihre Browser-Validierung steht aus; Commits siehe Status je Paket. Die Umsetzung startet jeweils auf Abruf des Auftraggebers (z. B. `PLAN BP-013`).

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

- **Status:** Zurückgestellt (2026-11-15). Das Layout wird mit dem Redesign (D-016, BP-013) neu festgelegt; voraussichtlich geht BP-009 darin auf. Ursprünglich blockiert durch OP-06.
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

- **Status:** Geplant; Start erst nach BP-008, BP-010, BP-011, BP-012 (OP-18) und auf Abruf des Auftraggebers
- **Grundlage:** D-016 bis D-023; [project_plan.md](project_plan.md), Kapitel 13
- **Ziel:** Ein abgestimmtes Gestaltungskonzept auf Basis der Referenz Wealth-Lab-Strategy-Orchestrator und die Zerlegung in umsetzbare Arbeitspakete (ab BP-014).
- **Scope:** Nur Planung (Modus PLAN): OP-21 (Detailregeln Ergebnis-Tint) klären, Aurora-Farbzuordnung festlegen, Umgang mit der Einzeichnung bei jedem Tastendruck prüfen (D-021), Arbeitspakete mit Akzeptanzkriterien anlegen. Vorgesehene Paketthemen (Entwurf, keine Zusage): SVG-Diagramme ohne Chart.js (D-017), Layout und Formulare ohne Bootstrap (D-019), Aurora-Theme (D-018), Motion-Effekte inkl. Einzeichnung bei jeder Neuberechnung (D-020, D-021), „!“-Tooltips (D-022), Ergebnis-Tint (D-023), Ladeanzeige, Reduced-Motion und Touch-Flächen.
- **Nicht im Scope:** Produktivcode, Änderungen an Berechnung, Eingabefeldern oder KPI-Definitionen.
- **Voraussetzungen:** Abruf durch den Auftraggeber; Abschluss von BP-008, BP-010, BP-011, BP-012.
- **Akzeptanzkriterien:**
  - OP-21 entschieden und in `project_plan.md` nachgeführt.
  - Konkrete Aurora-Palette mit Zuordnung zu den Datenreihen festgelegt und als Decision erfasst.
  - Arbeitspakete BP-014 ff. mit Scope, Nicht-Scope und Akzeptanzkriterien im Build-Plan.
