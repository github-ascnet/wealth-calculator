# Agents – Arbeitsregeln für KI-Agenten und Entwickler

Projektspezifische Arbeitsregeln für den Asset Growth Calculator. Fachliche und architektonische Vorgaben stehen in [project_plan.md](project_plan.md) und [decisions.md](decisions.md); diese Datei überschreibt sie nicht.

## 1. Arbeitsweise

- Gearbeitet wird nach Spec-Driven Development mit den Dateien `project_plan.md`, `decisions.md`, `build_plan.md` und `agents.md`.
- Umsetzung nur für Build-Pakete mit Status `Freigegeben` oder für ausdrücklich beauftragte Änderungen.
- Pakete mit Status `Vorgeschlagen`, `Geplant`, `Blockiert` oder `Zurückgestellt` werden nicht umgesetzt. `Geplant` wird mit dem Abruf durch den Auftraggeber (z. B. `IMPLEMENT BP-011`) zu `Freigegeben`.
- Offene Punkte (`OP-nn`) werden nicht eigenmächtig entschieden.

## 2. Technische Rahmenbedingungen

- Nur HTML, CSS und Vanilla JavaScript (D-001, D-003).
- Keine Frameworks, kein Build-Prozess, kein Paketmanager, keine neuen Bibliotheken oder CDN-Abhängigkeiten ohne neue Entscheidung in `decisions.md`.
- Bootstrap und Google Fonts sind seit BP-014 entfernt (D-019). Chart.js und das Datalabels-Plugin (D-005) sind seit BP-016 entfernt (D-017); die Diagramme zeichnet `charts.js` als Inline-SVG. Das Projekt hat keine externen Einbindungen mehr; keine neuen CDN-Einbindungen.
- Redesign-Pakete (ab BP-014): Diagramme als Inline-SVG (D-017), Aurora-Theme ohne Schalter (D-018), Systemschriften (D-019), Effekte nach D-020 mit den Grundregeln des Vorbilds.
- Keine Server-Logik, keine Persistenz, keine externen Aufrufe (seit BP-016 lädt die Seite nur eigene Dateien, geprüft in BP-021).

## 3. Dateistruktur

| Datei | Zuständigkeit | Regel |
|---|---|---|
| `index.html` | Markup, Eingabefelder, SVG-Container der Diagramme, Loader, Tint-Ebenen, Metadaten | Element-IDs sind Schnittstelle zu `site.js`, `charts.js`, `motion.js` und den Stylesheets und werden nicht umbenannt |
| `site.css` | Basis, Layout, Aurora-Farben, Diagramm- und Kennzahlenstile | Änderungen auf den betroffenen Bereich begrenzen |
| `motion.css` | Motion: Loader, Drift, Einzeichnung, Titel, Tint, gestaffelter Eintritt, Reduced-Motion | Nur `transform` und `opacity` in Dauer-Animationen; alle Effekte nur unter `html.ag-motion` |
| `site.js` | Berechnung, Validierung, Simulation, Tipp-Pause, Tooltips der Eingabefelder | Bestehende Funktionen beibehalten; keine Aufteilung in Module ohne Auftrag |
| `charts.js` | SVG-Diagramme (`renderCharts`, `AG_CHARTS`) | Name und Signatur von `renderCharts` bleiben; Farben und Schriftfamilien stehen in `site.css` |
| `motion.js` | Motion-Steuerung (`AG_MOTION`): Loader, Hochzählen, Tint, Titel, gestaffelter Eintritt | `site.js` und die Seite funktionieren auch ohne diese Datei |
| `og-image.png` | OG-Vorschaubild | Nicht verändern ohne Auftrag |

Neue Dateien nur, wenn ein freigegebenes Build-Paket sie verlangt. Die im Redesign vorgesehenen Dateien `charts.js`, `motion.css` und `motion.js` sind angelegt (D-028). Andere Dateien im Repository sind keine Projektgrundlage (OP-01).

### Referenzprojekt für das Redesign

- Pfad: `C:\Data\Projekte\Wealth Lab\Wealth-Lab-Strategy-Orchestrator` (D-016).
- Nur lesend verwenden; dort nichts ändern.
- Übernahmen (Code, Farben, Effekte) nur im Rahmen freigegebener Redesign-Pakete und der dazugehörigen Decisions.

## 4. Coding-Konventionen (aus dem Bestand)

- Bezeichner (IDs, Variablen, Funktionen) auf Deutsch in camelCase, z. B. `berechneVermoegen`, `renditeProJahr`. Ausnahmen im Bestand (`validateInput`, `sanitizeInput`, `renderCharts`, `startSimulation`, `maxDrawdown`) bleiben bestehen.
- Code-Kommentare auf Deutsch.
- Sichtbare UI-Texte, Tooltips, Validierungsmeldungen und Metadaten auf Englisch (D-012).
- JavaScript: `const`/`let`, Doppelte Anführungszeichen, Semikolons, 2 Leerzeichen Einrückung.
- CSS: 2 Leerzeichen Einrückung; Farben als Variablen `--ag-*` gemäss D-018 und D-029 (D-010 ist ersetzt).
- Prozentwerte werden im UI als Prozentzahl eingegeben und in `berechneVermoegen` durch 100 geteilt.

## 5. Änderungsregeln

- Nur den Scope des Build-Pakets ändern; kein opportunistisches Refactoring, keine kosmetischen Änderungen ausserhalb des Scopes.
- Formeln und Berechnungsreihenfolge (D-006 bis D-008) nur über eine dokumentierte Entscheidung ändern.
- Default-Werte, `min`, `max` und `step` der Eingabefelder nur mit Auftrag ändern; bei Änderung `project_plan.md`, Kapitel 6, nachführen.
- Änderungen mit sichtbarer Layout- oder Theme-Wirkung vorher als solche kennzeichnen.

## 6. Tests und Validierung

- Es existieren keine automatisierten Tests. Kein Testframework einführen ohne Auftrag.
- Validierung erfolgt manuell im Browser durch Öffnen von `index.html`:
  - Desktop-Breite und Breite unter 786 px prüfen.
  - Default-Werte laden, Diagramme und KPI-Box werden angezeigt.
  - Betroffene Eingabefelder mit den Werten aus den Akzeptanzkriterien prüfen.
  - Browser-Konsole frei von Fehlern.
- Statische Prüfungen (z. B. Klammerstruktur, Syntax) sind zulässig, sofern sie keine neue Projektinfrastruktur erfordern.
- Im Ergebnis angeben, was geprüft wurde und was nicht prüfbar war.

## 7. Dokumentationsupdates

- Nach Umsetzung eines Pakets: Status in `build_plan.md` aktualisieren (`Umgesetzt`, nach Prüfung `Validiert`).
- Behobene Ist-Befunde (`IB-nn`) in `project_plan.md` als behoben mit BP-Referenz kennzeichnen, nicht löschen.
- Neue oder geänderte Entscheidungen in `decisions.md` gemäss deren Konventionen erfassen.
- Getroffene Entscheidungen zu offenen Punkten in `project_plan.md`, Kapitel 12, mit Datum und Ergebnis nachführen.

## 8. Git

- Branch `main` (Produktion), Remote `origin` (GitHub `github-ascnet/wealth-calculator`). Das Redesign (BP-014 bis BP-021) wurde auf dem Branch `redesign` entwickelt und am 2026-11-16 auf ausdrücklichen Auftrag nach `main` zusammengeführt (OP-27, D-024). Künftige grössere Änderungen mit sichtbarer Wirkung gehen wieder über einen Branch; `main` wird nur auf ausdrücklichen Auftrag aktualisiert. Ein Push von `redesign` erzeugt bei Cloudflare Pages möglicherweise ein Preview-Deployment (ungeprüft).
- Commit-Messages auf Englisch, kurz, im Stil des Bestands („Added …“, „Changed …“, „Fixed …“, „Moved …“); optional mit BP-ID.
- Commit und Push nur auf ausdrücklichen Auftrag.
- **Ein Push auf `main` löst über Cloudflare Pages ein Produktiv-Deployment aus** (D-024). Vor dem Push prüfen, dass nur beabsichtigte Dateien enthalten sind; was im Repository liegt, kann öffentlich ausgeliefert werden (OP-22). Kein Force-Push.
