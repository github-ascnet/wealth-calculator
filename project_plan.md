# Project Plan – Asset Growth Calculator

| Feld | Wert |
|---|---|
| Projekt | Asset Growth Calculator (Repository `wealth-calculator`) |
| Öffentliche URL (gemäss OG-Tags) | https://wealthcalc.ascnet.ch/ |
| Eigentümer | ASCNET Solutions GmbH |
| Stand der Dokumentation | 2026-11-15 (SDD-INIT, abgeleitet aus Code-Stand `cf77d33`, 2025-09-08; CHANGE vom 2026-11-15) |

> **Hinweis zur Herkunft:** Dieses Dokument wurde im Modus INIT aus dem vorhandenen Code und der Git-Historie erstellt. Es beschreibt den **nachweisbaren Ist-Zustand**. Wo der Code eine erkennbare Absicht hat, die er nicht erfüllt, ist dies in Kapitel 11 als Soll/Ist/Delta ausgewiesen. Offene Punkte stehen in Kapitel 12, das Zielbild des Redesigns in Kapitel 13.

### Änderungshistorie

| Datum | Modus | Änderung |
|---|---|---|
| 2026-11-15 | INIT | Erstfassung aus Code und Git-Historie |
| 2026-11-15 | CHANGE | Entscheidungen des Auftraggebers zu OP-01 bis OP-05 eingearbeitet (Kapitel 7.1, 7.2, 8.1, 12); neues Ziel „Design/Layout auf aktuellen Motion-Graphics-Standard“ aufgenommen (Kapitel 13). Umsetzung auf Abruf zurückgestellt. |
| 2026-11-15 | CHANGE | D-015 (Tausend USD) bestätigt. Redesign-Entscheidungen OP-13 bis OP-16 und OP-18 eingearbeitet (Kapitel 12, 13.5); OP-08 und OP-10 erledigt bzw. abgelöst; neue offene Punkte OP-17 (Antwort mehrdeutig), OP-19, OP-20. |
| 2026-11-15 | CHANGE | OP-17 (Variante a: Einzeichnung bei jeder Neuberechnung), OP-19 (Tooltip-Symbol) und OP-20 entschieden. Neue Anforderung: Ergebnis-Tint des Hintergrunds (D-023); Detailregeln als OP-21 offen. |
| 2026-11-15 | CHANGE | OP-27 entschieden: Redesign auf Branch `redesign` (D-024). |
| 2026-11-15 | IMPLEMENT | BP-014 umgesetzt: IB-02 und IB-04a bis IB-04d behoben, OP-06 und OP-10 erledigt. |
| 2026-11-15 | PLAN | BP-013: Entscheidungen zu OP-21, OP-23, OP-24, OP-26 eingearbeitet; OP-11 und OP-22 erledigt; Plan des Redesigns in Kapitel 13.6 bis 13.9, Arbeitspakete BP-014 bis BP-021; neu OP-25 und OP-27. |
| 2026-11-15 | CHANGE | Hosting-Angabe des Auftraggebers eingearbeitet: Cloudflare Pages liest das GitHub-Repository ein (Kapitel 10, D-024, OP-11 teilweise geklärt, neu OP-22). |

---

## 1. Zweck

Interaktiver, clientseitiger Rechner, der das Wachstum eines Startkapitals über einen wählbaren Zeitraum simuliert und als Diagramme darstellt. Berücksichtigt werden eine erwartete Jahresrendite mit zufälliger Streuung (Standardabweichung), ein begrenzter maximaler Drawdown, eine prozentuale jährliche Entnahme (Cashflow) und eine prozentuale Dividende.

Quelle: `meta description` in [index.html](index.html) – *„Interactive asset growth calculator that visualizes annual profits, dividends, and cashflow over a specified period. Perfect for financial planning and investment simulations."*

## 2. Ziel

- Eingabe weniger Parameter, sofortige Neuberechnung und Visualisierung.
- Darstellung von Vermögensverlauf, Cashflow und Dividenden pro Jahr.
- Ausgabe zusammenfassender Kennzahlen (Wachstum, Max. Drawdown, Volatilität, Summe Dividenden, Summe Cashflow).
- Wiederholte Zufallssimulation über einen Simulations-Button.
- Öffentliche Auffindbarkeit über SEO- und Social-Media-Metadaten.

## 3. Scope (Ist)

| Bereich | Inhalt |
|---|---|
| Eingabe | 7 numerische Eingabefelder mit Tooltip, Live-Validierung und Bereinigung beim Verlassen |
| Berechnung | Jahresweise Monte-Carlo-artige Einzelsimulation (ein Pfad pro Berechnung) |
| Ausgabe | Dynamischer Seitentitel, KPI-Box, 2 Liniendiagramme |
| Simulation | Automatische Wiederholung der Berechnung (Intervall 5 s, max. 50 Wiederholungen) |
| Darstellung | Dark Theme, responsive Layout (Bootstrap-Grid plus eigene Media Query) |
| SEO | Meta-Description, Keywords, Robots, Open Graph, Twitter Card, OG-Bild |

## 4. Im Ist-Zustand nicht vorhanden

Die folgenden Punkte sind im Code nicht vorhanden. Ob sie bewusst ausgeschlossen sind, ist nicht dokumentiert (siehe Kapitel 12).

- Backend, API, Datenbank oder Persistenz der Eingaben
- Benutzerkonten, Authentisierung
- Build-Prozess, Paketmanager (`package.json`), Bundler
- Automatisierte Tests
- Mehrsprachigkeit (UI ausschliesslich Englisch)
- Wählbare Währung (fix USD)
- Jährliche Zusatzinvestition (Feld `jaehrlicherInvest` ist im HTML auskommentiert und in JS nicht verarbeitet)

## 5. Architektur

### 5.1 Überblick

Statische Single-Page-Webanwendung ohne Server-Logik. Die gesamte Berechnung läuft im Browser.

```
Browser
 ├─ index.html   Struktur, Eingabefelder, Canvas-Elemente, SEO-Metadaten
 ├─ site.css     Theme, Layout, Responsive-Regeln
 ├─ site.js      Validierung, Berechnung, KPI-Ausgabe, Chart-Rendering, Simulation
 └─ CDN
     ├─ Bootstrap 5.1.3 (CSS + JS-Bundle, für Grid und Tooltips)
     ├─ Chart.js (unversioniert, jeweils neueste Version)
     ├─ chartjs-plugin-datalabels (unversioniert)
     └─ Google Fonts: Space Mono (verwendet), Jura (geladen, nicht verwendet)
```

### 5.2 Dateien

| Datei | Funktion |
|---|---|
| [index.html](index.html) | Markup, Eingabefelder mit Inline-Handlern (`oninput`, `onfocusout`), Chart-Canvas, KPI-Box, SEO-Metadaten |
| [site.css](site.css) | Dark Theme, Formular- und Chart-Layout, Media Query `max-width: 786px` |
| [site.js](site.js) | Funktionen `validateInput`, `sanitizeInput`, `berechneVermoegen`, `renderCharts`, `startSimulation`; Tooltip-Initialisierung |
| [og-image.png](og-image.png) | Vorschaubild für Open Graph / Twitter Card |

Weitere Dateien im Repository sind für das Projekt nicht relevant (siehe OP-01).

### 5.3 Datenfluss

```
Eingabefeld (oninput)
 → validateInput(input)        setzt nur Browser-Validierungsmeldung, blockiert nicht
 → berechneVermoegen()         liest alle Felder, berechnet Jahreswerte und KPIs
     → DOM: Titel, KPI-Box
     → renderCharts(labels, vermögen, cashflow, dividenden)
         → bestehende Chart-Instanzen zerstören, neu erstellen
Eingabefeld (onfocusout)
 → sanitizeInput(input)        entfernt unzulässige Zeichen, löst keine Neuberechnung aus
Button „Start Simulation"
 → startSimulation()           sofortige Berechnung, danach alle 5 s erneut (max. 50×)
Seitenaufruf
 → berechneVermoegen()         initiale Berechnung mit Default-Werten
 → DOMContentLoaded: Bootstrap-Tooltips initialisieren
```

## 6. Eingabeparameter

| ID | Label (UI) | Tooltip | Default | Min | Max | Step |
|---|---|---|---|---|---|---|
| `startkapital` | Starting Capital | The capital invested at the beginning. | 100000 | 10000 | – | – |
| `jahre` | Years to measure | Number of years for the calculation. | 10 | 1 | 50 | – |
| `renditeProJahr` | % Profit by Year | Percentage annual return. | 25 | 0 | 500 | – |
| `maxDrawdown` | % Max. Drawdown | Expected maximum decline from peak to trough in percent (e.g., -30 = minus 30%). | -18 | -100 | 0 | 0.1 |
| `standardabweichung` | % Standard deviation by Year | Average standard deviation of the return in Percentage. | 22 | 0 | 500 | – |
| `dividendeProzent` | % Dividends by Year | Percentage dividend based on assets. | 1.0 | 0 | 10 | 0.1 |
| `relativerBezug` | % Cashflow p.a. | Percentage annual payout deducted from assets. | 0 | 0 | 50 | – |

Auskommentiert, nicht aktiv: `jaehrlicherInvest` – *Yearly Additional Investment (USD)*, Default 0, Min 0, Max 100000, Step 100.

## 7. Geschäftslogik

### 7.1 Jahresberechnung

Für jedes Jahr `j = 0 … jahre-1` (Notation: μ = Rendite, σ = Standardabweichung, c = Cashflow-Satz, d = Dividendensatz, DDmax = |maxDrawdown|/100, alle Prozentwerte durch 100 geteilt):

1. **Zufallsrendite:** `r = μ + z·σ`, `z` standardnormalverteilt per Box-Muller aus `Math.random()` (kein Seed, nicht reproduzierbar).
2. **Hypothetischer Betrag:** `H = V_vorjahr · (1 + r)`; `V_vorjahr` startet mit `startkapital`.
3. **High-Watermark:** `HWM = max(HWM, H)`; Startwert `startkapital`.
4. **Drawdown:** `DD = (HWM − H) / HWM`.
5. **Drawdown-Kappung:** Falls `DD > DDmax`: `H = HWM · (1 − DDmax)`, `DD = DDmax`.
6. **Max. Drawdown:** `maxDD = max(maxDD, DD)`.
7. **Cashflow und Dividende:** `Cashflow = H · c`, `Dividende = H · d` (beide auf Basis von `H` vor Entnahme).
8. **Vermögen Jahresende:** `V = max(H − Cashflow, 0)`.
9. **Speichern:** Label `aktuellesJahr + 1 + j`, Vermögen `V`, Cashflow, Dividende.

Fachliche Eigenschaften, die sich daraus ergeben (Ist):

- Die Dividende wird nur ausgewiesen; sie verändert das Vermögen nicht (weder Zufluss noch Abzug). **Bestätigt am 2026-11-15:** Die Dividende wird nicht reinvestiert; das Ist-Verhalten ist Soll (D-008).
- Die High-Watermark bezieht sich auf den Betrag **vor** Cashflow-Entnahme, das fortgeschriebene Vermögen auf den Betrag **nach** Entnahme.
- Die Zeitachse beginnt mit dem Folgejahr des aktuellen Kalenderjahres.

### 7.2 Kennzahlen (KPI-Box)

| Kennzahl | Berechnung (Ist) | Ausgabeformat |
|---|---|---|
| Total Growth | `(V_letztes − startkapital) / startkapital · 100` (seit BP-011, D-014; bis Code-Stand `cf77d33` war die Basis das Vermögen am Ende von Jahr 1) | `Total Growth: x.xx%` |
| Max. Drawdown | `maxDD · 100` | `Max. Drawdown: x.xx%` (gleiche Zeile wie Total Growth) |
| Volatility | Populations-Standardabweichung der Jahresrenditen, berechnet aus den Vermögenswerten **nach** Entnahme mit `startkapital` als Basis des ersten Jahres | `Volatility: x.xx%` |
| Total Dividends | Summe aller Jahresdividenden | `$` + `toLocaleString` (Browser-Locale, 0 Nachkommastellen) |
| Total Cashflow | Summe aller Jahres-Cashflows | wie oben |

Zusätzlich wird der Seitentitel (`#titel`) ersetzt durch: `Asset growth at {renditeProJahr}% Profit per Year`.

**Soll-Änderung (2026-11-15, D-014):** „Total Growth“ wird ab dem **Startkapital** gemessen: `(V_letztes − startkapital) / startkapital · 100`. Umsetzung in BP-011. Da `startkapital` mindestens 10000 beträgt, entfällt damit auch die Division durch null aus IB-04f.

### 7.3 Simulation

- Klick auf **Start Simulation**: sofortige Berechnung, danach alle 5000 ms eine weitere Berechnung, bis 50 Wiederholungen erreicht sind (insgesamt 51 Berechnungen, ca. 250 s).
- Während der Simulation lautet die Beschriftung **Stop Simulation**; erneuter Klick bricht ab und setzt zurück.
- Eingaben bleiben während der Simulation aktiv und lösen zusätzlich Live-Berechnungen aus.

### 7.4 Validierung und Bereinigung

- `validateInput` (bei `oninput`): prüft leer, `min`, `max` und Step-Kompatibilität über `(value − min) % step`. Setzt `setCustomValidity` und ruft `reportValidity` auf. **Die Berechnung wird unabhängig vom Ergebnis ausgeführt.**
- `sanitizeInput` (bei `onfocusout`): entfernt alle Zeichen ausser Ziffern und Punkt; bei `maxDrawdown` ist zusätzlich ein führendes Minus erlaubt. Löst keine Neuberechnung aus.

## 8. Darstellung

### 8.1 Diagramme (Chart.js, Typ `line`)

| Canvas | Datenreihe | Farbe | Y-Achsentitel |
|---|---|---|---|
| `vermoegenChart` | „Profit in 1000 (USD)“ – Vermögen `V` je Jahr | `#ffc107` | Profit |
| `bezugDataChart` | „Cashflow in 1000 (USD)“ | `#32cd32` | Cashflow/Dividends |
| `bezugDataChart` | „Dividends in 1000 (USD)“ | `#ffc107` | (gemeinsame Achse `y`) |

- Data Labels: `floor(Wert / 1000)`, weiss, Schrift Space Mono 10 px; ausgeblendet bei `window.innerWidth < 768` (ausgewertet je Rendering).
- Y-Achsentitel bei kleinem Viewport ausgeblendet, X-Achse ohne Titel und ohne Gitter.
- Charts werden bei jeder Berechnung zerstört und neu erstellt.
- Die Achsen-Ticks zeigen volle USD-Werte, die Data Labels Tausender.

**Soll-Änderung (2026-11-15, D-015, vom Auftraggeber bestätigt):** Legenden, Achsen und Data Labels verwenden dieselbe Einheit. Die Y-Achsen-Ticks beider Diagramme werden in Tausend USD angezeigt, passend zu Legende („in 1000 (USD)“) und Data Labels. Die zugrunde liegenden Daten und die Beträge in der KPI-Box bleiben in vollen USD. Umsetzung in BP-012 (umgesetzt 2026-11-15; Y-Achsen-Ticks beider Chart.js-Diagramme in Tausend USD).

### 8.2 Theme

- Hintergrund: horizontaler Verlauf `#272525 → #454046 → #272525`, Schrift weiss, Font **Space Mono**.
- Akzentfarbe `#ffc107` (Button, Fokusrahmen, KPI-Box-Rahmen, Vermögenslinie).
- Eingabefelder `#2d2d2d`, im Fokus `#444`.
- KPI-Box: halbtransparent dunkel, Rahmen amber, Schrift 10 px, zentriert zwischen den beiden Charts.

### 8.3 Responsive

- Bootstrap-Grid: zwei Eingabefelder pro Zeile ab `md`, darunter eine Spalte.
- Eigene Media Query `max-width: 786px` für Titel, Labels, Eingaben und Chart-Container.
- Die Strukturfehler in `site.css` beeinflussen das tatsächliche Verhalten (siehe IB-02).

## 9. SEO und Metadaten

- `lang="en"`, `title`, `description`, `keywords`, `robots: index, follow`
- Open Graph: Titel, Beschreibung, Typ `website`, URL und Bild unter `wealthcalc.ascnet.ch`, Locale `en_US`
- Twitter Card `summary_large_image`
- `meta author` enthält den Platzhalter „Your Name or Company“ (siehe OP-07)

## 10. Betrieb und Rahmenbedingungen

| Thema | Ist |
|---|---|
| Hosting | Ziel-URL `https://wealthcalc.ascnet.ch/` gemäss OG-Tags. **Cloudflare Pages liest das GitHub-Repository ein** (Angabe des Auftraggebers, 2026-11-15; D-024). Details der Pages-Konfiguration (Production-Branch, Build-Befehl, Ausgabeverzeichnis, Preview-Deployments) sind nicht dokumentiert (OP-11, OP-22). |
| Quellcodeverwaltung | Git, Remote `github.com/github-ascnet/wealth-calculator`, Branch `main` |
| Laufzeitabhängigkeiten | Erreichbarkeit von `cdn.jsdelivr.net` und `fonts.googleapis.com` |
| Browser | Keine Mindestanforderung dokumentiert |
| Qualitätsanforderungen | Nicht dokumentiert (keine Tests, kein Linting, keine Performance- oder Accessibility-Vorgaben) |

## 11. Ist-Befunde (Soll / Ist / Delta)

Die folgenden Befunde wurden bei der INIT-Analyse festgestellt. Das jeweilige „Soll“ ist die im Code erkennbare Absicht, keine neue Anforderung. Behebung nur über freigegebene Build-Pakete.

### IB-01 Step-Validierung meldet gültige Dezimalwerte als ungültig

- **Soll:** `validateInput` soll nur Werte bemängeln, die nicht zum `step` passen.
- **Ist:** Die Prüfung `(value − min) % step !== 0` ist bei Gleitkommazahlen praktisch immer wahr. Nachgewiesen: `1.0`, `1.2`, `2.5` bei `dividendeProzent` und `-18`, `-18.5` bei `maxDrawdown` ergeben Rest ≈ 0.0999… und lösen die Meldung „The value must be a multiple of 0.1.“ aus – auch für die Default-Werte.
- **Delta:** Step-Prüfung mit Toleranz oder ganzzahliger Skalierung. Betroffen: `site.js`. → BP-008
- **Stand 2026-11-15:** Behoben mit BP-008 (umgesetzt, per Skript geprüft).

### IB-02 Fehlerhafte Klammer- und Kommentarstruktur in `site.css`

- **Soll:** Die Regeln für Chart-Container, Canvas und KPI-Schriftgrösse am Dateiende sollen nur innerhalb der Media Query `max-width: 786px` gelten.
- **Ist:** Ein verschachtelter Kommentar (`/* #simulateButton { … /* … */ } */`) beendet die Media Query vorzeitig. Die nachfolgende Regel `*/ .chart_container { … }` ist ungültig und wird verworfen; die Regeln für `#vermoegenChartContainer`, `#bezugDataChartContainer` und `canvas { max-width: 100%; height: 100% }` gelten **global** und überschreiben die Desktop-Regel `canvas { max-width: 80%; height: 70vh }`. Der letzte Block ist unvollständig geschlossen und enthält eine doppelte, verschachtelte Regel.
- **Delta:** CSS-Struktur korrigieren. **Achtung:** Das sichtbare Desktop-Layout ändert sich dadurch; das aktuelle Erscheinungsbild wurde mit dem Dark-Theme-Commit (2025-09-07) bewusst abgenommen. Entscheidung erforderlich, welches Erscheinungsbild Soll ist. → BP-009
- **Stand 2026-11-15:** Behoben mit BP-014 (`site.css` neu geschrieben); BP-009 ging darin auf.

### IB-03 Ungültige HTML-Kopfstruktur

- **Soll:** Metadaten, Titel und Stylesheets im `<head>`.
- **Ist:** `<head></head>` wird sofort geschlossen; die Meta- und Link-Elemente folgen danach, gefolgt von einem zweiten `</head>`. Browser korrigieren dies beim Parsen, das Markup ist aber nicht valide.
- **Delta:** Überzähliges `</head>` entfernen. → BP-010
- **Stand 2026-11-15:** Behoben mit BP-010 (umgesetzt, Struktur per Skript geprüft).

### IB-04 Weitere Beobachtungen ohne direkte Funktionsstörung

| ID | Beobachtung | Datei |
|---|---|---|
| IB-04a | CSS-Selektor `.input-wrapper` (Bindestrich) passt nicht zur HTML-Klasse `input_wrapper` (Unterstrich); der vorgesehene Rahmen/Schatten wird nicht angewendet **Behoben mit BP-014 (2026-11-15).** | `site.css`, `index.html` |
| IB-04b | Breakpoint uneinheitlich: CSS `786px`, JS `768px` **Behoben mit BP-014 (2026-11-15).** | `site.css`, `site.js` |
| IB-04c | Doppelte Regel `.form-control:focus`; ungenutzte Klasse `.input_row` **Behoben mit BP-014 (2026-11-15).** | `site.css` |
| IB-04d | Font **Jura** wird geladen, aber nicht verwendet **Behoben mit BP-014 (2026-11-15).** | `index.html` |
| IB-04e | Chart.js und Datalabels-Plugin ohne Versionsangabe vom CDN; ein Major-Update kann die Darstellung ändern | `index.html` |
| IB-04f | Wird das Vermögen am Ende von Jahr 1 zu 0, ergibt „Total Growth“ eine Division durch null (`NaN`/`Infinity`). Behoben mit BP-011 (2026-11-15). | `site.js` |
| IB-04g | Ungültige oder leere Eingaben fliessen ungeprüft in die Berechnung (`NaN` in Charts und KPIs) | `site.js` |

Diese Punkte sind nicht als Build-Pakete eingeplant, sondern als offene Punkte erfasst (Kapitel 12).

## 12. Offene Punkte

| ID | Thema | Status | Inhalt / Ergebnis |
|---|---|---|---|
| OP-01 | Next.js-Migration | **Erledigt** (2026-11-15) | Kein Projektziel. Die Datei „Chat GPT convert to NextJS App.txt“ wird in der SDD nicht weiter berücksichtigt. |
| OP-02 | Jährliche Zusatzinvestition | **Zurückgestellt** (2026-11-15) | Ursprünglicher Zweck nicht mehr bekannt. Feld `jaehrlicherInvest` bleibt auskommentiert; kein Scope, bis neu beauftragt. |
| OP-03 | Basis „Total Growth“ | **Entschieden** (2026-11-15) | Ab Startkapital → D-014, BP-011 |
| OP-04 | Behandlung der Dividende | **Entschieden** (2026-11-15) | Nicht reinvestieren; Ist-Verhalten bestätigt → D-008 |
| OP-05 | Einheiten der Diagrammbeschriftung | **Entschieden** (2026-11-15) | Korrigieren → D-015, BP-012 |
| OP-06 | Desktop-Layout der Charts | **Erledigt** (2026-11-15) | Layout in Kapitel 13.6 festgelegt, Container mit BP-014 umgesetzt (Diagramme bis 900 px breit, Höhe 50 % der Fensterhöhe, 260 bis 480 px). Die endgültige Diagrammgrösse folgt mit BP-016. |
| OP-07 | Metadaten-Platzhalter | Offen | `meta author` = „Your Name or Company“; Footer „© 2024“. Soll angepasst werden? |
| OP-08 | CDN-Versionen | **Erledigt** (2026-11-15) | Entfällt: Chart.js, Datalabels-Plugin und Bootstrap werden mit dem Redesign entfernt (D-017, D-019). IB-04e erledigt sich damit. |
| OP-09 | Eingabefehler | Offen | Soll die Berechnung bei ungültigen Eingaben unterbleiben (IB-04g)? |
| OP-10 | Kleinere CSS-Befunde | **Erledigt mit BP-014** (2026-11-15) | IB-04a bis IB-04d erledigen sich mit dem Neuaufbau von CSS und Markup. |
| OP-11 | Hosting/Deployment | **Erledigt** (2026-11-15) | Cloudflare Pages mit GitHub-Anbindung (D-024). Der Auftraggeber hat die Konfiguration geprüft: „Alles ok“. Einzelwerte (Production-Branch, Build-Einstellungen) wurden nicht mitgeteilt und sind nicht dokumentiert. |
| OP-12 | Qualitätsanforderungen | Offen | Browser-Support, Accessibility und Testvorgehen sind nicht festgelegt. |
| OP-13 | Redesign: Chart-Technik | **Entschieden** (2026-11-15) | Wie das Vorbild: handgeschriebenes Inline-SVG, keine Chart-Bibliothek → D-017 |
| OP-14 | Redesign: Farbwelt | **Entschieden** (2026-11-15) | Aurora, nicht umschaltbar (kein classic-Theme) → D-018 |
| OP-15 | Redesign: Bootstrap und Schrift | **Entschieden** (2026-11-15) | Beides entfällt, wie im Vorbild: kein Bootstrap, keine externe Schrift → D-019 |
| OP-16 | Redesign: Umfang der Effekte | **Entschieden** (2026-11-15) | „Möglichst alle“ des Vorbilds, soweit auf diese Seite übertragbar → D-020, Kapitel 13.5 |
| OP-17 | Redesign: Animation bei Neuberechnung | **Entschieden** (2026-11-15) | Variante a: Die Einzeichnung läuft bei jeder Neuberechnung → D-021 |
| OP-18 | Redesign: Reihenfolge der Korrekturen | **Entschieden** (2026-11-15) | Die Korrekturen BP-008, BP-010, BP-011 und BP-012 werden **vor** dem Redesign umgesetzt → build_plan.md |
| OP-19 | Redesign: Tooltips der Eingabefelder | **Entschieden** (2026-11-15) | Ersatz im Stil des Vorbilds: „!“-Symbol mit eigenem Tooltip → D-022 |
| OP-20 | Redesign: nicht übertragbare Effekte | **Entschieden** (2026-11-15) | Abgrenzung aus Kapitel 13.5 wurde nicht beanstandet; die Anlehnung „Färbung nach Simulationsergebnis“ ist ausdrücklich gewünscht → D-023 |
| OP-21 | Ergebnis-Tint: Detailregeln | **Entschieden** (2026-11-15) | Grundlage Total Growth, stufenlos; Gewinn grünlich/teal, Verlust rosé; Umsetzung mit zwei Ebenen über Deckkraft → D-023, Kapitel 13.7 |
| OP-22 | SDD-Dateien öffentlich erreichbar? | **Erledigt** (2026-11-15) | Der Auftraggeber hat die Cloudflare-Konfiguration geprüft: „Alles ok“. Kein Handlungsbedarf. |
| OP-23 | Verhalten beim Tippen | **Entschieden** (2026-11-15) | Berechnung und Einzeichnung starten nach einer Tipp-Pause von ca. 250 ms; Button und Simulation sofort → D-025 |
| OP-24 | Hochzählen der Kennzahlen | **Entschieden** (2026-11-15) | Beim ersten Laden von 0, danach vom vorherigen zum neuen Wert → D-026 |
| OP-25 | Legende der Diagramme | Offen (Annahme im Plan) | Chart.js erlaubt heute per Klick auf einen Legendeneintrag das Ausblenden einer Datenreihe. Annahme im Plan: statische Legende wie im Vorbild, die Klick-Funktion entfällt. Bei Widerspruch ist BP-016 anzupassen. |
| OP-26 | Loader beim Seitenaufruf | **Entschieden** (2026-11-15) | Kurzer Intro-Loader (ca. 1 s, animierter Mini-Chart), bei reduzierter Bewegung ohne → D-027 |
| OP-27 | Entwicklungsbranch für das Redesign | **Entschieden** (2026-11-15) | Das Redesign wird auf dem Branch `redesign` entwickelt und nach BP-021 nach `main` zusammengeführt (Push nur auf ausdrücklichen Auftrag). |

## 13. Zielbild Redesign (Motion Graphics)

### 13.1 Auftrag

Auftrag vom 2026-11-15: Design und Layout sollen auf einen aktuellen Motion-Graphics-Standard gebracht werden. Die Umsetzung ist **zurückgestellt**, bis der Auftraggeber sie abruft. Fachlogik und Berechnung (Kapitel 7) sind nicht Teil des Redesigns, ausser über eigene Entscheidungen.

### 13.2 Referenz

| Feld | Wert |
|---|---|
| Projekt | Wealth-Lab-Strategy-Orchestrator |
| Pfad | `C:\Data\Projekte\Wealth Lab\Wealth-Lab-Strategy-Orchestrator` |
| Live | https://wl-trading-systems.ascnet.ch/ |
| Relevante Dateien | `css/motion.css`, `css/theme-aurora.css`, `js/motion.js`, `js/theme.js`, `Motion-Graphics-Effects.txt`, `docs/sdd/decisions.md` (D-026 bis D-033, D-036, D-043, D-044) |

Die Referenz ist ebenfalls eine statische Vanilla-JS-Anwendung ohne Build (gleiche Grundarchitektur wie D-001).

### 13.3 Gestaltungsprinzipien der Referenz

Die folgenden Prinzipien sind in der Referenz verbindlich dokumentiert. Für dieses Projekt sind sie **Orientierung**; welche übernommen werden, ist offen (OP-13 bis OP-17).

| Nr. | Prinzip / Element | Referenz |
|---|---|---|
| R-1 | Einlaufanimationen nur mit CSS-Keyframes und `requestAnimationFrame`, ohne Animationsbibliothek; zentral in `motion.css` / `motion.js` | D-026 |
| R-2 | Statischer Zustand = Endzustand; CSS animiert nur den Startzustand. Ohne Motion-Skript bleibt die Darstellung vollständig. | D-026 |
| R-3 | Linien zeichnen sich ein, Flächen blenden ein | D-026 |
| R-4 | Kennzahlen zählen hoch und enden auf dem unveränderten, formatierten Wert | D-026 |
| R-5 | Loader als animierter Mini-Chart, nur `transform` und `opacity` (Compositor) | D-030, D-032 |
| R-6 | Theme „Aurora“: Nachtblau, Cyan, Teal, Grün, Rosé; Glow ohne SVG-Filter; Sternenfeld mit festem Seed; umschaltbar per `data-theme` | D-031 |
| R-7 | Atmosphäre: langsam driftende, unscharfe Hintergrundflächen allein über `transform`; nur ab 701 px Breite | D-027 |
| R-8 | Gestaffelter Eintritt von Elementen beim Sichtbarwerden (`IntersectionObserver`) | D-028 |
| R-9 | `prefers-reduced-motion: reduce` schaltet alle Animationen ab, Endzustand erscheint sofort | D-026, D-043 |
| R-10 | Tippflächen 44 × 44 px auf Touch-Geräten | D-044 |

### 13.4 Abgrenzung

- Keine Änderung der Berechnung, der Eingabefelder (IDs, Defaults, Grenzen) oder der KPI-Definitionen durch das Redesign.
- Kein Build-Prozess und kein Framework (D-001, D-003).
- Konkrete Arbeitspakete werden im Modus PLAN erstellt (BP-013), nachdem die Korrekturpakete BP-008, BP-010, BP-011 und BP-012 abgeschlossen sind. Der Plan steht in Kapitel 13.6 bis 13.9 und im Build-Plan (BP-014 bis BP-021). Offen ist nur OP-25.

### 13.5 Beschlossene Gestaltung (Stand 2026-11-15)

| Thema | Beschluss | Decision |
|---|---|---|
| Diagramme | Inline-SVG ohne Bibliothek wie im Vorbild; Chart.js und Datalabels-Plugin entfallen | D-017 |
| Farbwelt | Aurora (Nachtblau, Cyan, Teal, Grün, Rosé), nicht umschaltbar | D-018 |
| UI-Bibliothek und Schrift | Kein Bootstrap, keine externe Schrift; Systemschriften wie im Vorbild | D-019 |
| Effekte | Möglichst alle Effekte des Vorbilds, soweit übertragbar (siehe unten) | D-020 |
| Reihenfolge | Korrekturpakete BP-008, BP-010, BP-011, BP-012 zuerst, danach Redesign | build_plan.md |

**Zuordnung der Vorbild-Effekte** (Vorschlag; Bestätigung in OP-20):

| Effekt im Vorbild | Übertragung auf diese Seite |
|---|---|
| Linien einzeichnen, Flächen einblenden (R-3) | Beide Diagramme, bei **jeder** Neuberechnung (D-021) |
| Kennzahlen hochzählen (R-4) | KPI-Box (Total Growth, Max. Drawdown, Volatility, Total Dividends, Total Cashflow); beim ersten Laden von 0, danach vom vorherigen zum neuen Wert (D-026) |
| Loader als Mini-Chart (R-5) | Kurzer Intro-Loader von ca. 1 s beim Seitenaufruf (D-027) |
| Aurora-Theme mit Glow, Sternenfeld, HUD-Marken (R-6) | Diagramme und Rahmen |
| Driftender Hintergrund (R-7) | Hintergrund, nur ab 701 px Breite |
| Gestaffelter Eintritt beim Sichtbarwerden (R-8) | Eingabefelder, Diagramm-Karten, KPI-Box |
| Reduced-Motion (R-9), Tippflächen (R-10) | Übernommen |
| Seitenübergang (View Transitions) | **Nicht übertragbar**: nur eine Seite |
| Tab-Indikator, Kachel-Sparklines, Positions-Tabelle, Monatsrenditen-Heatmap | **Nicht übertragbar**: Elemente existieren hier nicht |
| Regime-Tint des Hintergrunds | Keine Regime-Daten vorhanden. **Angelehnt übernommen** als Ergebnis-Tint: Der Hintergrund färbt sich weich nach Total Growth der Simulation (D-023, Auftrag 2026-11-15; Regeln in Kapitel 13.7). |

Mit dem Wegfall von Bootstrap entfallen dessen Raster, Formularstile und Tooltips; das Layout wird neu in eigenem CSS aufgebaut (OP-19 für die Tooltips). Die Eingabefelder behalten IDs, Defaults und Grenzen (13.4).


### 13.6 Plan: Architektur des Redesigns (BP-013, 2026-11-15)

Die Umsetzung erfolgt in den Paketen BP-014 bis BP-021 ([build_plan.md](build_plan.md)). Alle Angaben dieses Kapitels sind Plan und werden mit der Abnahme von BP-013 verbindlich.

**Dateien (Projekt-Root, kein Build, relative Pfade):**

| Datei | Status | Inhalt |
|---|---|---|
| `index.html` | bestehend | Markup ohne Bootstrap-Klassen, `<svg>` statt `<canvas>`, Loader-Markup, Tint-Ebenen |
| `site.css` | bestehend, neu geschrieben | Layout, Formularfelder, Tooltips, Aurora-Farben, Responsive |
| `motion.css` | neu (BP-017) | Keyframes, Loader, Drift, Einzeichnung, Staffelung, Tint-Übergang, Reduced-Motion |
| `site.js` | bestehend | Berechnung, Validierung, Simulation, Tipp-Verzögerung, Aufruf der Darstellung |
| `charts.js` | neu (BP-016) | SVG-Diagramme (Achsen, Linien, Data Labels, Legende, Tooltip, Sternenfeld) |
| `motion.js` | neu (BP-017) | Aktivierung der Motion-Klasse, Loader-Steuerung, Hochzählen, Staffelung, Tint-Steuerung |

**Regeln:**

- Die IDs der Eingabefelder, Container und Anzeigeelemente bleiben erhalten (`startkapital`, `jahre`, `renditeProJahr`, `maxDrawdown`, `standardabweichung`, `dividendeProzent`, `relativerBezug`, `simulateButton`, `titel`, `wachstumProzent`, `volatilitaet`, `totalDividendsCashflow`, `vermoegenChartContainer`, `bezugDataChartContainer`). Die Elemente `vermoegenChart` und `bezugDataChart` ändern ihren Tag von `canvas` zu `svg`, die IDs bleiben.
- Die Funktion `renderCharts(labels, data, bezugData, dividendeData)` behält Namen und Signatur; ihre Implementierung wandert nach `charts.js`.
- Skriptreihenfolge am Ende des `<body>`: `charts.js`, `motion.js`, `site.js` (`site.js` zuletzt, weil es beim Laden rechnet).
- Berechnung, Formeln, Default-Werte, Grenzen und Textformate der KPI-Box bleiben unverändert (13.4).
- Bezeichner der neuen Dateien: Präfix `ag-` für CSS-Klassen, globale Objekte `AG_MOTION` und `AG_CHARTS` (Vorbild: `wl-`, `WL_`).
- Koordinatenräume der Diagramme: Desktop 1000 × 400, schmale Container (< 480 px) eigener höherer Raum mit grösserer Schrift (Muster des Vorbilds, dessen D-036). Das Desktop-Layout der Charts ist damit festgelegt (löst OP-06): Diagramme in Containerbreite, Höhe über das Seitenverhältnis des SVG.
- Verhalten bei ungültigen Eingaben (`NaN`): wie bisher kein Absturz und ein leeres Diagramm; keine zusätzliche Fehlerbehandlung (OP-09 bleibt offen).

### 13.7 Plan: Regeln des Ergebnis-Tints (D-023)

| Punkt | Regel |
|---|---|
| Eingang | „Total Growth“ G in Prozent aus `berechneVermoegen` (D-014) |
| Neutralzone | \|G\| < 1 % → Intensität 0, keine Färbung |
| Intensität | `i = 1 − exp(−\|G\| / G0)`, Startwert `G0 = 150 %`, als Konstante, nach Sichtprüfung in BP-019 nachjustierbar |
| Farbe | G > 0: Ebene „Gewinn“ (Teal/Grün); G < 0: Ebene „Verlust“ (Rosé); es ist höchstens eine Ebene sichtbar |
| Technik | Zwei feste Ebenen (`position: fixed`, `pointer-events: none`, hinter dem Inhalt), Radialverläufe oben und unten wie im Vorbild. Nur die Deckkraft ändert sich (`opacity = i`), Übergang 2400 ms. Kein Farbübergang über `@property` und kein `mix-blend-mode` (Vorbild-Befund: Hauptthread-Last, dessen D-032). |
| Gültigkeit | Nur ab 701 px Breite und nur bei aktiver Motion; bei reduzierter Bewegung keine Färbung |
| Barrierefreiheit | Dekorativ (`aria-hidden="true"`), keine Anlageaussage |
| Simulation | Der Tint wechselt im Takt der Neuberechnung weich mit |

**Hinweis zur Wirkung:** Bei den Default-Werten (25 % Rendite, 10 Jahre) liegt Total Growth etwa bei +830 % und damit rechnerisch bei `i ≈ 0.996`: Der Tint ist dort praktisch gesättigt. Spürbare Abstufungen entstehen bei kleineren Ergebnissen (z. B. wenig Rendite, kurzer Zeitraum, Verlustszenarien). Falls das nicht gewünscht ist, ist `G0` oder die Abbildung anzupassen (Auftraggeber-Entscheid bei der Sichtprüfung in BP-019).

### 13.8 Plan: Farbzuordnung Aurora (D-029)

Palette aus dem Vorbild (Variablen `--au-*`), nicht umschaltbar (D-018):

| Rolle | Wert | Verwendung hier |
|---|---|---|
| Hintergrund | `#03060b` bis `#071420` (Verlauf, Sternenfeld) | Seite |
| Cyan | `#58c4ff` | Diagrammlinie Vermögen |
| Teal | `#2de2c4` | Diagrammlinie Cashflow, Fokus und Akzente, Tint „Gewinn“ |
| Grün | `#6ee7a8` | Tint „Gewinn“ (Anteil), Hochzähl-Akzente |
| Violett | `#8b7bff` | Diagrammlinie Dividenden (unterscheidbar von Teal) |
| Rosé | `#ff6fa3` | Tint „Verlust“ |
| Text / gedämpft | `#eafcff` / `#93acbf` | Text / Labels, Achsen |
| Karten | Glasverlauf `rgba(10,24,36,0.84)` → `rgba(4,11,19,0.84)`, Rand `rgba(45,226,196,0.16)` | Eingabebereich, KPI-Box, Diagramm-Karten |

Amber (`#ffc107`) entfällt vollständig (D-018). Kontraste für Text, Achsen und Linien sind in BP-015 und BP-016 rechnerisch gegen WCAG AA zu prüfen; das Ergebnis wird im Paket dokumentiert.

### 13.9 Plan: Reihenfolge, Abhängigkeiten, Risiken

Reihenfolge: BP-014 → BP-015 → BP-016 → BP-017 → BP-018 → BP-019 → BP-020 → BP-021. BP-018, BP-019 und BP-020 hängen alle an BP-017 und könnten untereinander getauscht werden.

| Nr. | Risiko | Gegenmassnahme |
|---|---|---|
| 1 | Zwischenstände mit gemischtem Design wären live (jeder Push auf `main` deployt, D-024) | Entwicklung auf eigenem Branch, Merge nach BP-021 (OP-27) |
| 2 | Mit Chart.js entfallen implizite Funktionen: Hover-Tooltip, Resize-Verhalten, Legendenklick | BP-016 stellt Tooltip und Resize sicher; Legendenklick laut Annahme OP-25 entfällt |
| 3 | Einzeichnung per `stroke-dashoffset` läuft auf dem Hauptthread (im Vorbild beim Loader deshalb ersetzt, dessen D-032) | BP-018 misst die Flüssigkeit; bei Rucklern Umstellung auf aufdeckende Ebene (Compositor) |
| 4 | Einzeichnung bei jeder Neuberechnung kann unruhig wirken | Tipp-Verzögerung 250 ms (D-025); Simulation alle 5 s bei 1,4 s Einzeichnung bewusst akzeptiert |
| 5 | Dauer-Animationen (Drift) belasten schwache Geräte | Nur ab 701 px, nur `transform`/`opacity`, aus bei Reduced-Motion |
| 6 | Intro-Loader verzögert den Inhalt um ca. 1 s | Kurz halten, bei Reduced-Motion ganz entfallen lassen (D-027) |
| 7 | Tint ist im Default praktisch gesättigt | Siehe 13.7, Entscheid bei BP-019 |
