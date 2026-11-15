function validateInput(input) {
  const value = parseFloat(input.value); // Konvertiert den Eingabewert in eine Zahl
  const min = parseFloat(input.min); // Minimal erlaubter Wert
  const max = parseFloat(input.max); // Maximal erlaubter Wert
  const step = parseFloat(input.step); // Schrittweite (0.1)

  // Prüfen, ob der Wert leer ist
  if (isNaN(value)) {
    input.setCustomValidity("This field cannot be empty.");
    input.reportValidity();
    return;
  }

  // Prüfen, ob der Wert kleiner als der minimale Wert ist
  if (value < min) {
    input.setCustomValidity(`The value must be at least ${min}.`);
    input.reportValidity();
    return;
  }

  // Prüfen, ob der Wert größer als der maximale Wert ist
  if (value > max) {
    input.setCustomValidity(`The value cannot exceed ${max}.`);
    input.reportValidity();
    return;
  }

  // Prüfen, ob der Wert mit der Schrittweite kompatibel ist
  // Gleitkommasicher: Abstand zum nächsten ganzzahligen Vielfachen der Schrittweite
  if (step && Math.abs((value - min) / step - Math.round((value - min) / step)) > 1e-9) {
    input.setCustomValidity(`The value must be a multiple of ${step}.`);
    input.reportValidity();
    return;
  }

  // Wenn alle Prüfungen bestanden sind, die Validierung zurücksetzen
  input.setCustomValidity("");
  input.reportValidity();
}

function sanitizeInput(inputElement) {
  const id = inputElement.id;
  if (id === "maxDrawdown") {
    // Nur Zahlen + optionales Minus am Anfang erlauben
    inputElement.value = inputElement.value.replace(/(?!^-)[^\d.]/g, "");
  } else {
    // Nur positive Zahlen (Ziffern und Dezimalpunkt)
    inputElement.value = inputElement.value.replace(/[^\d.]/g, "");
  }
}

// Kennzahl anzeigen: mit motion.js zählt der Wert hoch, sonst steht der formatierte Text sofort da (D-026)
function zeigeKennzahl(id, wert, formatiere) {
  const element = document.getElementById(id);
  if (window.AG_MOTION && window.AG_MOTION.countUp) {
    window.AG_MOTION.countUp(element, wert, formatiere);
  } else {
    element.textContent = formatiere(wert);
  }
}

// Tipp-Pause: Eingaben lösen die Berechnung erst nach 250 ms ohne weitere Eingabe aus (D-025)
const TIPP_PAUSE_MS = 250;
let tippTimer = null;

function berechneVermoegenVerzoegert() {
  clearTimeout(tippTimer);
  tippTimer = setTimeout(function () {
    tippTimer = null;
    berechneVermoegen();
  }, TIPP_PAUSE_MS);
}

function verwerfeWartendeBerechnung() {
  clearTimeout(tippTimer);
  tippTimer = null;
}

function berechneVermoegen() {
  const startkapital = parseFloat(
    document.getElementById("startkapital").value
  );
  const renditeProJahr =
    parseFloat(document.getElementById("renditeProJahr").value) / 100;
  const jahre = parseInt(document.getElementById("jahre").value);
  const standardAbweichung =
    parseFloat(document.getElementById("standardabweichung").value) / 100;
  const allowedMaxDrawdownPercent = parseFloat(
    document.getElementById("maxDrawdown").value
  ); // z. B. -30
  const allowedMaxDrawdownFraction = Math.abs(allowedMaxDrawdownPercent / 100);
  const relativerBezug =
    parseFloat(document.getElementById("relativerBezug").value) / 100;
  const dividendeProzent =
    parseFloat(document.getElementById("dividendeProzent").value) / 100;

  const chartLabels = [];
  const chartData = [];
  const bezugData = [];
  const dividendeData = [];

  let vermoegenLetztesJahr = startkapital;

  let highWatermark = startkapital;
  let maxDrawdown = 0;

  function normaleZufallszahl(mean, stdDev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z * stdDev;
  }

  const aktuellesJahr = new Date().getFullYear() + 1;

  for (let jahr = 0; jahr < jahre; jahr++) {
    const abweichung = normaleZufallszahl(0, standardAbweichung);
    const effektiveRendite = renditeProJahr + abweichung;

    // 1. Hypothetischer Betrag nach Rendite
    let hypothetischerBetrag = vermoegenLetztesJahr * (1 + effektiveRendite);

    // 2. HighWatermark ggf. aktualisieren
    if (hypothetischerBetrag > highWatermark) {
      highWatermark = hypothetischerBetrag;
    }

    // 3. Aktueller Drawdown relativ zum HighWatermark
    let currentDrawdown =
      (highWatermark - hypothetischerBetrag) / highWatermark;

    // 4. Drawdown begrenzen
    if (currentDrawdown > allowedMaxDrawdownFraction) {
      hypothetischerBetrag = highWatermark * (1 - allowedMaxDrawdownFraction);
      currentDrawdown = allowedMaxDrawdownFraction;
    }

    // 5. MaxDrawdown aktualisieren
    maxDrawdown = Math.max(maxDrawdown, currentDrawdown);

    // 6. Cashflow und Dividende berechnen
    const bezug = hypothetischerBetrag * relativerBezug;
    const dividende = hypothetischerBetrag * dividendeProzent;

    let betrag = Math.max(hypothetischerBetrag - bezug, 0);

    // 7. Ergebnisse zwischenspeichern
    vermoegenLetztesJahr = betrag;

    chartLabels.push(aktuellesJahr + jahr);
    chartData.push(betrag);
    bezugData.push(bezug);
    dividendeData.push(dividende);
  }

  const wachstum =
    ((vermoegenLetztesJahr - startkapital) / startkapital) * 100;
  zeigeKennzahl("wachstumProzent", wachstum, function (w) {
    return `Total Growth: ${w.toFixed(2)}%`;
  });
  // Hintergrund-Tint nach Total Growth (BP-019, nur mit motion.js)
  if (window.AG_MOTION && window.AG_MOTION.setResult) {
    window.AG_MOTION.setResult(wachstum);
  }
  zeigeKennzahl("maxDrawdownAnzeige", maxDrawdown * 100, function (w) {
    return `Max. Drawdown: ${w.toFixed(2)}%`;
  });

  // Volatilität berechnen (Standardabweichung der jährlichen Renditen)
  const renditen = [];
  let vermoegenVorher = startkapital;
  for (let i = 0; i < chartData.length; i++) {
    const r = (chartData[i] - vermoegenVorher) / vermoegenVorher;
    renditen.push(r);
    vermoegenVorher = chartData[i];
  }
  const meanRendite = renditen.reduce((a, b) => a + b, 0) / renditen.length;
  const volatilitaet =
    Math.sqrt(
      renditen.reduce((a, b) => a + Math.pow(b - meanRendite, 2), 0) /
        renditen.length
    ) * 100;

  // Total Dividends/Cashflow
  const totalDividends = dividendeData.reduce((a, b) => a + b, 0);
  const totalCashflow = bezugData.reduce((a, b) => a + b, 0);

  zeigeKennzahl("volatilitaet", volatilitaet, function (w) {
    return `Volatility: ${w.toFixed(2)}%`;
  });

  zeigeKennzahl("totalDividendsAnzeige", totalDividends, function (w) {
    return `Total Dividends: $${w.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;
  });
  zeigeKennzahl("totalCashflowAnzeige", totalCashflow, function (w) {
    return `Total Cashflow: $${w.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;
  });

  renderCharts(chartLabels, chartData, bezugData, dividendeData);
}

berechneVermoegen();

let simulationInterval;
let isSimulating = false;
let simulationCount = 0;

function startSimulation() {
  if (isSimulating) {
    clearInterval(simulationInterval);
    isSimulating = false;
    simulationCount = 0;
    document.getElementById("simulateButton").textContent = "Start Simulation";
    return;
  }

  verwerfeWartendeBerechnung();
  isSimulating = true;
  simulationCount = 0;
  document.getElementById("simulateButton").textContent = "Stop Simulation";

  berechneVermoegen();

  simulationInterval = setInterval(() => {
    if (simulationCount >= 50) {
      clearInterval(simulationInterval);
      isSimulating = false;
      simulationCount = 0;
      document.getElementById("simulateButton").textContent =
        "Start Simulation";
      return;
    }
    berechneVermoegen();
    simulationCount++;
  }, 5000);
}

document
  .getElementById("simulateButton")
  .addEventListener("click", startSimulation);

// Tooltips der Eingabefelder: "!"-Symbol mit Text aus data-tooltip (Hover, Fokus, Tippen)
function initTooltips() {
  const triggers = document.querySelectorAll("[data-tooltip]");
  if (triggers.length === 0) return;

  const tip = document.createElement("div");
  tip.className = "ag-tooltip";
  tip.id = "agTooltip";
  tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);

  let activeTrigger = null;

  function hide() {
    if (!activeTrigger) return;
    activeTrigger.removeAttribute("aria-describedby");
    activeTrigger = null;
    tip.classList.remove("is-visible");
  }

  function show(trigger) {
    hide();
    activeTrigger = trigger;
    tip.textContent = trigger.getAttribute("data-tooltip");
    trigger.setAttribute("aria-describedby", tip.id);
    tip.classList.add("is-visible");

    // Unterhalb des Symbols, innerhalb des sichtbaren Bereichs; sonst oberhalb
    const margin = 8;
    const rect = trigger.getBoundingClientRect();
    const tipWidth = tip.offsetWidth;
    const tipHeight = tip.offsetHeight;
    let left = rect.left + rect.width / 2 - tipWidth / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tipWidth - margin));
    let top = rect.bottom + margin;
    if (top + tipHeight > window.innerHeight - margin) {
      top = rect.top - tipHeight - margin;
    }
    tip.style.left = `${left}px`;
    tip.style.top = `${Math.max(margin, top)}px`;
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("mouseenter", function () {
      show(trigger);
    });
    trigger.addEventListener("mouseleave", hide);
    trigger.addEventListener("focus", function () {
      show(trigger);
    });
    trigger.addEventListener("blur", hide);
    trigger.addEventListener("click", function () {
      show(trigger);
    });
  });

  // Tippen oder Klicken ausserhalb, Escape, Scrollen und Grössenänderung schliessen den Tooltip
  document.addEventListener("click", function (event) {
    if (!event.target.closest("[data-tooltip]")) hide();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") hide();
  });
  window.addEventListener("scroll", hide, { passive: true });
  window.addEventListener("resize", hide);
}

document.addEventListener("DOMContentLoaded", initTooltips);
