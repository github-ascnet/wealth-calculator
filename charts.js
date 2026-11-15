/*
 * charts.js – Diagramme als Inline-SVG ohne Bibliothek (BP-016; D-017, D-015, D-029)
 *
 * Zeichnet "vermoegenChart" und "bezugDataChart" (beides <svg>) aus den Ergebnissen von berechneVermoegen().
 * Farben, Schriftfamilien und Linienstärken stehen in site.css (Klassen ag-chart-*, ag-serie-*);
 * hier liegen nur Geometrie und Schriftgrössen. Die Einzeichnung der Linien steht in motion.css (BP-018).
 *
 * Koordinatenraum: Pixelraum des Containers (viewBox = gemessene Breite x Höhe, Massstab 1:1),
 * damit die Schrift bei jeder Breite ihre Nenngrösse behält. Unter 420 px Containerbreite gilt
 * ein höherer Raum (Seitenverhältnis), ab 768 px Fensterbreite erscheinen Data Labels und Achsentitel.
 */

(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  // Schriftgrössen in Pixeln (Massstab 1:1, daher auch auf dem Smartphone mindestens 10 px)
  const SCHRIFT_TICK = 11;
  const SCHRIFT_LABEL = 11;
  const SCHRIFT_LEGENDE = 12;
  const SCHRIFT_TITEL = 12;

  const SCHMALE_BREITE = 420; // Containerbreite, unter der das hohe Seitenverhältnis gilt
  const KLEINES_FENSTER = 768; // unter dieser Fensterbreite entfallen Data Labels und Achsentitel
  const PUNKT_RAND = 18; // Abstand der ersten und letzten Datenpunkte zum Rand der Zeichenfläche

  // Zustand je Diagramm (Schlüssel: ID des SVG)
  const instanzen = {};

  function el(name, attribute, eltern) {
    const e = document.createElementNS(SVG_NS, name);
    if (attribute) {
      Object.keys(attribute).forEach(function (k) {
        e.setAttribute(k, attribute[k]);
      });
    }
    if (eltern) eltern.appendChild(e);
    return e;
  }

  function text(inhalt, attribute, eltern) {
    const t = el("text", attribute, eltern);
    t.textContent = inhalt;
    return t;
  }

  // Zufallsgenerator mit festem Seed (mulberry32): das Sternenfeld sieht bei jedem Zeichnen gleich aus
  function zufallsgenerator(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Runde Schrittweite (1, 2, 2.5, 5 mal Zehnerpotenz)
  function schoenerSchritt(roh) {
    const exponent = Math.floor(Math.log10(roh));
    const faktor = roh / Math.pow(10, exponent);
    let schritt;
    if (faktor <= 1) schritt = 1;
    else if (faktor <= 2) schritt = 2;
    else if (faktor <= 2.5) schritt = 2.5;
    else if (faktor <= 5) schritt = 5;
    else schritt = 10;
    return schritt * Math.pow(10, exponent);
  }

  // Y-Achse: beginnt bei 0 (oder darunter bei negativen Werten) und endet an einem runden Wert
  function berechneSkala(minWert, maxWert, anzahlTicks) {
    let min = Math.min(0, minWert);
    let max = Math.max(0, maxWert);
    if (max === min) max = min + 1;
    const schritt = schoenerSchritt((max - min) / Math.max(anzahlTicks - 1, 1));
    min = Math.floor(min / schritt) * schritt;
    max = Math.ceil(max / schritt) * schritt;
    const ticks = [];
    for (let v = min; v <= max + schritt / 2; v += schritt) {
      ticks.push(Math.round(v * 1e6) / 1e6);
    }
    return { min: min, max: max, ticks: ticks };
  }

  // Wert in Tausend USD, ohne Gleitkomma-Rauschen (D-015)
  function inTausend(wert) {
    return String(Math.round((wert / 1000) * 1000) / 1000);
  }

  function formatiereUsd(wert) {
    return "$" + wert.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  // Monotone kubische Interpolation (Fritsch-Carlson), liefert einen SVG-Pfad durch die Punkte
  function monotonerPfad(punkte) {
    const n = punkte.length;
    if (n === 0) return "";
    if (n === 1) return "M" + punkte[0].x + "," + punkte[0].y;
    const dx = [];
    const m = [];
    for (let i = 0; i < n - 1; i++) {
      dx.push(punkte[i + 1].x - punkte[i].x);
      m.push((punkte[i + 1].y - punkte[i].y) / dx[i]);
    }
    const t = [m[0]];
    for (let i = 1; i < n - 1; i++) {
      t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
    }
    t.push(m[n - 2]);
    for (let i = 0; i < n - 1; i++) {
      if (m[i] === 0) {
        t[i] = 0;
        t[i + 1] = 0;
        continue;
      }
      const a = t[i] / m[i];
      const b = t[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) {
        const f = 3 / Math.sqrt(s);
        t[i] = f * a * m[i];
        t[i + 1] = f * b * m[i];
      }
    }
    let d = "M" + punkte[0].x.toFixed(2) + "," + punkte[0].y.toFixed(2);
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d +=
        "C" + (punkte[i].x + h).toFixed(2) + "," + (punkte[i].y + t[i] * h).toFixed(2) +
        " " + (punkte[i + 1].x - h).toFixed(2) + "," + (punkte[i + 1].y - t[i + 1] * h).toFixed(2) +
        " " + punkte[i + 1].x.toFixed(2) + "," + punkte[i + 1].y.toFixed(2);
    }
    return d;
  }

  function instanz(svg) {
    if (!instanzen[svg.id]) {
      const box = svg.parentNode;
      const tip = document.createElement("div");
      tip.className = "ag-chart-tip";
      tip.setAttribute("aria-hidden", "true");
      box.appendChild(tip);
      const inst = { svg: svg, box: box, tip: tip, geo: null, config: null, hoverIndex: null };
      instanzen[svg.id] = inst;
      verbindeZeiger(inst);
    }
    return instanzen[svg.id];
  }

  // ---- Zeichnen ----

  // animiere: Linien zeichnen sich ein (nur bei neuen Daten, nicht beim Neuzeichnen nach Grössenänderung)
  function zeichne(inst, config, animiere) {
    const svg = inst.svg;
    svg.classList.toggle("ag-static", !animiere);
    inst.config = config;
    const kleinesFenster = window.innerWidth < KLEINES_FENSTER;
    const breite = Math.max(Math.round(svg.getBoundingClientRect().width), 200) || 600;
    const schmal = breite < SCHMALE_BREITE;
    // Nebeneinander angeordnete Diagramme (ab 1024 px, D-030) sind höher als einzeln stehende
    const nebeneinander = window.matchMedia("(min-width: 1024px)").matches;
    const verhaeltnis = nebeneinander ? 0.62 : 0.4;
    const hoehe = schmal ? Math.round(breite * 0.85) : Math.max(280, Math.round(breite * verhaeltnis));

    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute("viewBox", "0 0 " + breite + " " + hoehe);
    svg.setAttribute("role", "img");

    const anzahl = config.labels.length;
    const endlich = [];
    config.serien.forEach(function (s) {
      s.werte.forEach(function (w) {
        if (isFinite(w)) endlich.push(w);
      });
    });

    // Legende (statisch): Linienprobe und Text, bei Platzmangel auf mehrere Zeilen verteilt
    const legende = el("g", { class: "ag-chart-legend" }, svg);
    const probeBreite = 22;
    const probeAbstand = 6;
    const eintragAbstand = 20;
    const zeilenHoehe = 20;
    const eintraege = config.serien.map(function (s) {
      const g = el("g", { class: "ag-serie " + s.klasse }, legende);
      el("line", { class: "ag-chart-legend-line", x1: 0, y1: 0, x2: probeBreite, y2: 0 }, g);
      const t = text(s.name, { class: "ag-chart-legend-text", "font-size": SCHRIFT_LEGENDE, x: probeBreite + probeAbstand, y: 4 }, g);
      const textBreite = t.getComputedTextLength() || s.name.length * 7;
      return { g: g, breite: probeBreite + probeAbstand + textBreite };
    });
    const zeilen = [[]];
    let zeilenBreite = 0;
    eintraege.forEach(function (e) {
      const bedarf = e.breite + (zeilen[zeilen.length - 1].length ? eintragAbstand : 0);
      if (zeilen[zeilen.length - 1].length && zeilenBreite + bedarf > breite - 16) {
        zeilen.push([]);
        zeilenBreite = 0;
      }
      zeilen[zeilen.length - 1].push(e);
      zeilenBreite += e.breite + (zeilen[zeilen.length - 1].length > 1 ? eintragAbstand : 0);
    });
    zeilen.forEach(function (zeile, z) {
      const gesamt = zeile.reduce(function (summe, e) {
        return summe + e.breite;
      }, 0) + eintragAbstand * (zeile.length - 1);
      let x = (breite - gesamt) / 2;
      zeile.forEach(function (e) {
        e.g.setAttribute("transform", "translate(" + x.toFixed(1) + "," + (14 + z * zeilenHoehe) + ")");
        x += e.breite + eintragAbstand;
      });
    });
    const legendeUnten = 14 + (zeilen.length - 1) * zeilenHoehe + 10;

    // Skala und Zeichenfläche
    const oben = legendeUnten + 22; // Platz für Data Labels über dem höchsten Punkt
    const unten = hoehe - 28;
    const hoeheFlaeche = Math.max(unten - oben, 40);
    const skala = berechneSkala(
      endlich.length ? Math.min.apply(null, endlich) : 0,
      endlich.length ? Math.max.apply(null, endlich) : 1,
      Math.max(3, Math.min(7, Math.floor(hoeheFlaeche / 46)))
    );
    const tickTexte = skala.ticks.map(inTausend);
    const breitesterTick = tickTexte.reduce(function (m, t) {
      return Math.max(m, t.length);
    }, 1);
    const titelPlatz = kleinesFenster ? 0 : 20;
    const links = Math.round(titelPlatz + breitesterTick * SCHRIFT_TICK * 0.62 + 16);
    const rechts = breite - 14;
    const flaecheBreite = Math.max(rechts - links, 40);

    const yVon = function (wert) {
      return unten - ((wert - skala.min) / (skala.max - skala.min)) * (unten - oben);
    };
    const abstand = anzahl > 1 ? (flaecheBreite - 2 * PUNKT_RAND) / (anzahl - 1) : 0;
    const xVon = function (i) {
      return anzahl > 1 ? links + PUNKT_RAND + i * abstand : links + flaecheBreite / 2;
    };

    // Sternenfeld (fester Seed) hinter dem Gitter
    const zufall = zufallsgenerator(20260515);
    const sterne = el("g", { class: "ag-chart-stars", "aria-hidden": "true" }, svg);
    const sternAnzahl = Math.round((flaecheBreite * hoeheFlaeche) / 5500);
    for (let i = 0; i < sternAnzahl; i++) {
      el("circle", {
        cx: (links + zufall() * flaecheBreite).toFixed(1),
        cy: (oben + zufall() * hoeheFlaeche).toFixed(1),
        r: (0.45 + zufall() * 0.65).toFixed(2),
        opacity: (0.12 + zufall() * 0.33).toFixed(2),
      }, sterne);
    }

    // Gitter und Y-Beschriftung
    const gitter = el("g", { class: "ag-chart-gridlines" }, svg);
    skala.ticks.forEach(function (tick, i) {
      const y = yVon(tick).toFixed(1);
      el("line", { class: "ag-chart-grid", x1: links, y1: y, x2: rechts, y2: y }, gitter);
      text(tickTexte[i], {
        class: "ag-chart-tick",
        "font-size": SCHRIFT_TICK,
        x: links - 8,
        y: (parseFloat(y) + 4).toFixed(1),
        "text-anchor": "end",
      }, gitter);
    });
    if (!kleinesFenster) {
      text(config.titel, {
        class: "ag-chart-title",
        "font-size": SCHRIFT_TITEL,
        transform: "translate(" + (SCHRIFT_TITEL + 2) + "," + ((oben + unten) / 2).toFixed(1) + ") rotate(-90)",
        "text-anchor": "middle",
      }, svg);
    }

    // Achsen
    el("line", { class: "ag-chart-axis", x1: links, y1: oben, x2: links, y2: unten }, svg);
    el("line", { class: "ag-chart-axis", x1: links, y1: unten, x2: rechts, y2: unten }, svg);

    // X-Beschriftung (Jahre), bei Platzmangel nur jedes n-te
    const xSchritt = abstand > 0 ? Math.max(1, Math.ceil(42 / abstand)) : 1;
    for (let i = 0; i < anzahl; i += xSchritt) {
      text(String(config.labels[i]), {
        class: "ag-chart-tick",
        "font-size": SCHRIFT_TICK,
        x: xVon(i).toFixed(1),
        y: unten + 18,
        "text-anchor": "middle",
      }, svg);
    }

    // Datenreihen: Fläche (optional), Glow, Linie, Punkte, Data Labels
    const labelSchritt = abstand > 0 ? Math.max(1, Math.ceil(30 / abstand)) : 1;
    const punkteJeSerie = [];
    config.serien.forEach(function (s) {
      const g = el("g", { class: "ag-serie " + s.klasse }, svg);
      const punkte = [];
      s.werte.forEach(function (w, i) {
        punkte.push(isFinite(w) ? { x: xVon(i), y: yVon(w), i: i, wert: w } : null);
      });
      punkteJeSerie.push(punkte);

      // zusammenhängende Abschnitte ohne ungültige Werte (bei NaN entstehen Lücken)
      const abschnitte = [];
      let aktuell = [];
      punkte.forEach(function (p) {
        if (p) aktuell.push(p);
        else if (aktuell.length) {
          abschnitte.push(aktuell);
          aktuell = [];
        }
      });
      if (aktuell.length) abschnitte.push(aktuell);

      abschnitte.forEach(function (abschnitt) {
        const pfad = monotonerPfad(abschnitt);
        if (s.flaeche && abschnitt.length > 1) {
          const farbverlaufId = "agFlaeche-" + svg.id;
          const verlauf = el("linearGradient", { id: farbverlaufId, x1: 0, y1: 0, x2: 0, y2: 1 }, g);
          el("stop", { offset: "0%", "stop-color": "currentColor", "stop-opacity": 0.28 }, verlauf);
          el("stop", { offset: "100%", "stop-color": "currentColor", "stop-opacity": 0.02 }, verlauf);
          const letzter = abschnitt[abschnitt.length - 1];
          const erster = abschnitt[0];
          el("path", {
            class: "ag-chart-area",
            d: pfad + "L" + letzter.x.toFixed(2) + "," + yVon(Math.max(skala.min, 0)).toFixed(2) +
              "L" + erster.x.toFixed(2) + "," + yVon(Math.max(skala.min, 0)).toFixed(2) + "Z",
            fill: "url(#" + farbverlaufId + ")",
          }, g);
        }
        // Glow ohne SVG-Filter: breitere, transparente Linie unter der eigentlichen Linie
        // pathLength 1: die Einzeichnung (motion.css) arbeitet unabhängig von der Pfadlänge mit stroke-dashoffset
        el("path", { class: "ag-chart-line-glow", d: pfad, pathLength: 1 }, g);
        el("path", { class: "ag-chart-line", d: pfad, pathLength: 1 }, g);
      });

      if (anzahl <= 40) {
        punkte.forEach(function (p) {
          if (p) el("circle", { class: "ag-chart-dot", cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 3 }, g);
        });
      }

      if (!kleinesFenster) {
        punkte.forEach(function (p) {
          if (!p || p.i % labelSchritt !== 0) return;
          text(String(Math.floor(p.wert / 1000)), {
            class: "ag-chart-label",
            "font-size": SCHRIFT_LABEL,
            x: p.x.toFixed(1),
            y: (p.y - 8).toFixed(1),
            "text-anchor": "middle",
          }, svg);
        });
      }
    });

    // Hover-Ebene: senkrechte Linie und Markierungen je Reihe
    const hover = el("g", { class: "ag-chart-hover", visibility: "hidden" }, svg);
    const hoverLinie = el("line", { class: "ag-chart-hover-line", y1: oben, y2: unten }, hover);
    const hoverPunkte = config.serien.map(function (s) {
      const g = el("g", { class: "ag-serie " + s.klasse }, hover);
      return el("circle", { class: "ag-chart-hover-dot", r: 5 }, g);
    });

    svg.setAttribute("aria-label", beschreibung(config, endlich.length > 0));

    inst.geo = {
      breite: breite,
      kleinesFenster: kleinesFenster,
      links: links,
      rechts: rechts,
      oben: oben,
      unten: unten,
      abstand: abstand,
      anzahl: anzahl,
      xVon: xVon,
      punkte: punkteJeSerie,
      hover: hover,
      hoverLinie: hoverLinie,
      hoverPunkte: hoverPunkte,
    };

    // Offener Tooltip bleibt nach dem Neuzeichnen (z. B. Simulation alle 5 s) an seiner Stelle
    if (inst.hoverIndex !== null && inst.hoverIndex < anzahl) zeigeHover(inst, inst.hoverIndex);
    else verbergeHover(inst);
  }

  // Kurzbeschreibung für Screenreader: Zeitraum und Endwert jeder Reihe
  function beschreibung(config, hatDaten) {
    if (!hatDaten || config.labels.length === 0) return config.titel + " chart, no data";
    const von = config.labels[0];
    const bis = config.labels[config.labels.length - 1];
    const enden = config.serien.map(function (s) {
      const letzter = s.werte[s.werte.length - 1];
      return s.kurzname + " " + (isFinite(letzter) ? formatiereUsd(letzter) : "n/a");
    });
    return "Line chart " + von + " to " + bis + ". Last year: " + enden.join(", ") + ".";
  }

  // ---- Tooltip (Maus und Touch) ----

  function zeigeHover(inst, index) {
    const geo = inst.geo;
    const config = inst.config;
    if (!geo || geo.anzahl === 0) return;
    inst.hoverIndex = index;
    const x = geo.xVon(index);
    geo.hoverLinie.setAttribute("x1", x.toFixed(1));
    geo.hoverLinie.setAttribute("x2", x.toFixed(1));
    geo.hoverPunkte.forEach(function (c, s) {
      const p = geo.punkte[s][index];
      if (p) {
        c.setAttribute("cx", p.x.toFixed(1));
        c.setAttribute("cy", p.y.toFixed(1));
        c.setAttribute("visibility", "visible");
      } else {
        c.setAttribute("visibility", "hidden");
      }
    });
    geo.hover.setAttribute("visibility", "visible");

    const tip = inst.tip;
    while (tip.firstChild) tip.removeChild(tip.firstChild);
    const kopf = document.createElement("div");
    kopf.className = "ag-chart-tip-year";
    kopf.textContent = String(config.labels[index]);
    tip.appendChild(kopf);
    config.serien.forEach(function (s) {
      const zeile = document.createElement("div");
      zeile.className = "ag-chart-tip-row";
      const punkt = document.createElement("span");
      punkt.className = "ag-chart-tip-swatch ag-serie " + s.klasse;
      const wert = s.werte[index];
      zeile.appendChild(punkt);
      zeile.appendChild(document.createTextNode(s.kurzname + ": " + (isFinite(wert) ? formatiereUsd(wert) : "n/a")));
      tip.appendChild(zeile);
    });
    tip.classList.add("is-visible");

    // Rechts neben der Linie, bei Platzmangel links davon
    const tipBreite = tip.offsetWidth;
    // (SVG-Elemente haben kein offsetLeft; Versatz zur Box über getBoundingClientRect)
    const versatzX = inst.svg.getBoundingClientRect().left - inst.box.getBoundingClientRect().left;
    const versatzY = inst.svg.getBoundingClientRect().top - inst.box.getBoundingClientRect().top;
    let links = versatzX + x + 14;
    if (links + tipBreite > inst.box.clientWidth - 4) links = versatzX + x - 14 - tipBreite;
    tip.style.left = Math.max(4, links) + "px";
    tip.style.top = versatzY + geo.oben + "px";
  }

  function verbergeHover(inst) {
    inst.hoverIndex = null;
    if (inst.geo) inst.geo.hover.setAttribute("visibility", "hidden");
    inst.tip.classList.remove("is-visible");
  }

  function verbindeZeiger(inst) {
    const svg = inst.svg;

    function aufEvent(e) {
      const geo = inst.geo;
      if (!geo || geo.anzahl === 0) return;
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (geo.breite / rect.width);
      if (x < geo.links - 12 || x > geo.rechts + 12) {
        verbergeHover(inst);
        return;
      }
      const index = geo.abstand > 0 ? Math.round((x - geo.xVon(0)) / geo.abstand) : 0;
      const begrenzt = Math.max(0, Math.min(geo.anzahl - 1, index));
      if (begrenzt !== inst.hoverIndex) zeigeHover(inst, begrenzt);
    }

    svg.addEventListener("pointerdown", aufEvent);
    svg.addEventListener("pointermove", aufEvent);
    svg.addEventListener("pointerleave", function (e) {
      if (e.pointerType === "mouse") verbergeHover(inst);
    });
  }

  // Tippen ausserhalb eines Diagramms und Escape schliessen offene Tooltips (Touch hat kein Verlassen)
  document.addEventListener("pointerdown", function (e) {
    Object.keys(instanzen).forEach(function (id) {
      if (!instanzen[id].box.contains(e.target)) verbergeHover(instanzen[id]);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    Object.keys(instanzen).forEach(function (id) {
      verbergeHover(instanzen[id]);
    });
  });

  // ---- Neuzeichnen bei Grössenänderung ----

  let neuzeichnenGeplant = false;

  function pruefeGroesse() {
    neuzeichnenGeplant = false;
    Object.keys(instanzen).forEach(function (id) {
      const inst = instanzen[id];
      if (!inst.config || !inst.geo) return;
      const breite = Math.max(Math.round(inst.svg.getBoundingClientRect().width), 200);
      if (breite !== inst.geo.breite || (window.innerWidth < KLEINES_FENSTER) !== inst.geo.kleinesFenster) {
        zeichne(inst, inst.config, false);
      }
    });
  }

  function planeNeuzeichnen() {
    if (neuzeichnenGeplant) return;
    neuzeichnenGeplant = true;
    window.requestAnimationFrame(pruefeGroesse);
  }

  window.addEventListener("resize", planeNeuzeichnen);

  // ---- Schnittstelle ----

  function rendere(labels, data, bezugData, dividendeData) {
    const svg1 = document.getElementById("vermoegenChart");
    const svg2 = document.getElementById("bezugDataChart");
    const inst1 = instanz(svg1);
    const inst2 = instanz(svg2);

    zeichne(inst1, {
      titel: "Profit",
      labels: labels,
      serien: [
        { name: "Profit in 1000 (USD)", kurzname: "Profit", klasse: "ag-serie-vermoegen", werte: data, flaeche: true },
      ],
    }, true);
    zeichne(inst2, {
      titel: "Cashflow/Dividends",
      labels: labels,
      serien: [
        { name: "Cashflow in 1000 (USD)", kurzname: "Cashflow", klasse: "ag-serie-cashflow", werte: bezugData, flaeche: false },
        { name: "Dividends in 1000 (USD)", kurzname: "Dividends", klasse: "ag-serie-dividende", werte: dividendeData, flaeche: false },
      ],
    }, true);
    if (typeof ResizeObserver !== "undefined" && !rendere.beobachter) {
      rendere.beobachter = new ResizeObserver(planeNeuzeichnen);
      rendere.beobachter.observe(inst1.box);
      rendere.beobachter.observe(inst2.box);
    }
  }

  window.AG_CHARTS = { render: rendere };
})();

// Bestehende Schnittstelle zu site.js: Name und Signatur bleiben unverändert
function renderCharts(labels, data, bezugData, dividendeData) {
  AG_CHARTS.render(labels, data, bezugData, dividendeData);
}
