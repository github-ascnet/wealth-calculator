# Decisions – Asset Growth Calculator

Verbindliche Architektur-, Design- und Implementierungsentscheidungen.

## Konventionen

- **ID:** `D-nnn`, fortlaufend, wird nie neu vergeben.
- **Status:**
  - `Ist-abgeleitet` – aus Code und Git-Historie erkennbar, gilt bis auf Weiteres als verbindlich; formale Bestätigung ausstehend.
  - `Bestätigt` – ausdrücklich durch den Projektverantwortlichen bestätigt.
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

- **Status:** Ist-abgeleitet; **ersetzt durch D-019**, wirksam mit Umsetzung des Redesigns (bis dahin gültig)
- **Entscheidung:** Bootstrap 5.1.3 (CSS und JS-Bundle) wird über `cdn.jsdelivr.net` eingebunden und für Grid-Layout, Formular-Basisstile und Tooltips verwendet.

## D-005 Chart.js mit chartjs-plugin-datalabels über CDN

- **Status:** Ist-abgeleitet; **ersetzt durch D-017**, wirksam mit Umsetzung des Redesigns (bis dahin gültig)
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

- **Status:** Ist-abgeleitet
- **Entscheidung:** Jede Eingabe löst sofort eine Neuberechnung aus. Der Simulations-Button wiederholt die Berechnung alle 5 Sekunden, maximal 50 Wiederholungen, und ist per erneutem Klick abbrechbar.
- **Beleg:** Commit `93891ae`.

## D-010 Dark Theme mit Amber-Akzent

- **Status:** Ist-abgeleitet; **ersetzt durch D-018**, wirksam mit Umsetzung des Redesigns (bis dahin gültig)
- **Entscheidung:** Dunkler Verlaufshintergrund (`#272525`/`#454046`), weisse Schrift, Akzentfarbe `#ffc107`, Cashflow-Linie `#32cd32`, Schrift **Space Mono**.
- **Beleg:** Commit `7c4e5ac` (2025-09-07) „Changed Theme to dark and adjusted Charts accordingly“.

## D-011 KPI-Box zwischen den Diagrammen

- **Status:** Ist-abgeleitet
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

- **Status:** Bestätigt als Zielrichtung (Auftrag 2026-11-15); Ausgestaltung offen, Umsetzung zurückgestellt
- **Entscheidung:** Design und Layout werden auf einen aktuellen Motion-Graphics-Standard gebracht. Referenz ist das Projekt Wealth-Lab-Strategy-Orchestrator (`C:\Data\Projekte\Wealth Lab\Wealth-Lab-Strategy-Orchestrator`).
- **Rahmen:** Berechnung, Eingabefelder und KPI-Definitionen bleiben unverändert; kein Build-Prozess, kein Framework (D-001, D-003).
- **Konkretisiert** durch D-017 bis D-023 (2026-11-15).
- **Offen:** Detailregeln des Ergebnis-Tints (OP-21).
- **Details:** [project_plan.md](project_plan.md), Kapitel 13.

## D-017 Diagramme als Inline-SVG ohne Bibliothek

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-13: „wie im Wealth-Lab-Strategy-Orchestrator“); wirksam mit Umsetzung des Redesigns
- **Entscheidung:** Beide Diagramme werden in JavaScript als handgeschriebenes Inline-SVG erzeugt, ohne Chart-Bibliothek. Chart.js und `chartjs-plugin-datalabels` entfallen.
- **Ersetzt:** D-005.
- **Konsequenz:** Beschriftungen, Achsen, Data Labels, Legende und Tooltips der Diagramme müssen selbst umgesetzt werden. D-015 (Tausend USD) und die Datenreihen aus [project_plan.md](project_plan.md), Kapitel 8.1, gelten weiter. Das Wegfallen der CDN-Abhängigkeit erledigt IB-04e / OP-08.

## D-018 Aurora-Theme, nicht umschaltbar

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-14); wirksam mit Umsetzung des Redesigns
- **Entscheidung:** Das Design folgt dem Theme „Aurora“ des Vorbilds (dunkle Nachtblau-Töne, Cyan, Teal, Grün, Rosé; Glow ohne SVG-Filter). Es gibt keinen Theme-Schalter und kein classic-Theme.
- **Ersetzt:** D-010 (Dark Theme mit Amber-Akzent).
- **Konsequenz:** Konkrete Farbwerte, Zuordnung zu Datenreihen (Vermögen, Cashflow, Dividenden, Drawdown-Bezug) und Kontraste werden im PLAN von BP-013 festgelegt. Die Paletten- und Glow-Regeln des Vorbilds (dessen D-031) sind Orientierung, keine Kopiervorlage.

## D-019 Kein Bootstrap, keine externe Schrift

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-15: „nein beides wie im Wealth-Lab-Strategy-Orchestrator“); wirksam mit Umsetzung des Redesigns
- **Entscheidung:** Bootstrap (CSS und JS) und die Google-Fonts-Einbindung (Space Mono, Jura) entfallen. Layout, Formularfelder und Komponenten werden in eigenem CSS umgesetzt. Als Schrift dienen Systemschriften wie im Vorbild (Segoe UI für Text, Consolas bzw. Monospace für Zahlen).
- **Ersetzt:** D-004; ändert die Schrift aus D-010.
- **Konsequenz:** Die Bootstrap-Tooltips entfallen; Ersatz offen (OP-19). Raster und responsives Verhalten werden neu aufgebaut. Es gibt danach keine externen Laufzeitabhängigkeiten mehr (kein CDN, keine Webfonts).

## D-020 Umfang der Motion-Effekte

- **Status:** Bestätigt als Rahmen (Auftrag 2026-11-15, OP-16: „möglichst alle“); Abgrenzung nicht beanstandet (OP-20), Ergänzungen D-021 bis D-023
- **Entscheidung:** Aus dem Vorbild werden möglichst alle Effekte übernommen, soweit sie auf diese Seite übertragbar sind (Zuordnung: [project_plan.md](project_plan.md), Kapitel 13.5). Es gelten die Grundregeln des Vorbilds: nur CSS und `requestAnimationFrame`, statischer Zustand ist Endzustand, nur `transform` und `opacity` für Dauer-Animationen, Reduced-Motion schaltet alles ab, Drift nur ab 701 px.
- **Nicht übertragbar:** Seitenübergang, Tab-Indikator, Kachel-Sparklines, Positions-Tabelle, Heatmap. Der Regime-Tint wird als Ergebnis-Tint angelehnt übernommen (D-023).

## D-021 Diagramm-Einzeichnung bei jeder Neuberechnung

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-17 Variante a); wirksam mit Umsetzung des Redesigns
- **Entscheidung:** Die Linien beider Diagramme zeichnen sich bei **jeder** Neuberechnung neu ein, Flächen blenden danach ein. Das gilt für Eingaben, den Simulations-Button und die automatische Wiederholung alle 5 Sekunden. Das Vorbild animiert nur das erste Rendern (dessen D-026, Regel 4); diese Regel gilt hier **nicht**.
- **Rahmen:** Statischer Zustand bleibt der Endzustand; bei Reduced-Motion erscheint das Ergebnis sofort ohne Einzeichnung.
- **Risiko (im PLAN von BP-013 zu prüfen):** Eingaben lösen die Berechnung bei jedem Tastendruck aus (D-009). Eine Einzeichnung von rund 1,4 s je Tastendruck kann unruhig wirken oder sich überlagern. Ob die laufende Animation dabei abgebrochen und neu gestartet wird oder ob die Berechnung verzögert ausgelöst wird, ist eine Umsetzungsfrage und ändert D-009 nur, wenn der Auftraggeber zustimmt.

## D-022 Tooltips der Eingabefelder als „!“-Symbol

- **Status:** Bestätigt (Auftrag 2026-11-15, OP-19); wirksam mit Umsetzung des Redesigns
- **Entscheidung:** Die Erklärungen der Eingabefelder (Texte unverändert aus [project_plan.md](project_plan.md), Kapitel 6) erscheinen über ein „!“-Symbol mit eigenem Tooltip, per Hover und Tastaturfokus, nach dem Muster des Vorbilds. Bootstrap-Tooltips entfallen (D-019).
- **Konsequenz:** Tippfläche mindestens 44 × 44 px auf Touch-Geräten (R-10).

## D-023 Ergebnis-Tint des Hintergrunds

- **Status:** Bestätigt als Anforderung (Auftrag 2026-11-15: „Färbung nach dem Simulationsergebnis … bau mal spontan was ein“); Detailregeln **Vorschlag**, im PLAN von BP-013 festzulegen (OP-21); wirksam mit Umsetzung des Redesigns
- **Entscheidung:** Der Hintergrund färbt sich weich nach dem Ergebnis der aktuellen Simulation, angelehnt an den Regime-Tint des Vorbilds (dessen D-027). Rein visuell, keine Anlageaussage.
- **Vorschlag für die Detailregeln (nicht verbindlich):**
  - Grundlage: Kennzahl „Total Growth“ (D-014).
  - Positives Ergebnis → grünlich/teal getönt, negatives Ergebnis → rosé getönt, Ergebnis nahe 0 → keine Färbung. Die Stärke der Färbung wächst mit dem Betrag des Ergebnisses bis zu einer Obergrenze.
  - Weicher Farbübergang bei jeder Neuberechnung (Vorbild: 2,4 s), eigene feste Ebene, nur `opacity`.
  - Nur ab 701 px Breite; bei Reduced-Motion keine Färbung (wie im Vorbild).
- **Offen (OP-21):** Kennzahl (Total Growth oder z. B. Max. Drawdown), Schwellenwerte, Obergrenze der Intensität, Farbwerte innerhalb der Aurora-Palette (D-018).
- **Hinweis:** Bei der Simulation (alle 5 Sekunden ein neuer Zufallspfad) wechselt der Tint im selben Takt. Das ist beabsichtigt, solange der Übergang weich bleibt; im PLAN zu prüfen.
