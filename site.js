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
  if (step && (value - min) % step !== 0) {
    input.setCustomValidity(`The value must be a multiple of ${step}.`);
    input.reportValidity();
    return;
  }

  // Wenn alle Prüfungen bestanden sind, die Validierung zurücksetzen
  input.setCustomValidity("");
  input.reportValidity();
}

function sanitizeInput(inputElement) {
  if (id === "maxDrawdown") {
    // Nur Zahlen + optionales Minus am Anfang erlauben
    inputElement.value = inputElement.value.replace(/(?!^-)[^\d.]/g, "");
  } else {
    // Nur positive Zahlen (Ziffern und Dezimalpunkt)
    inputElement.value = inputElement.value.replace(/[^\d.]/g, "");
  }
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

  const renditeProJahrWert = parseFloat(
    document.getElementById("renditeProJahr").value
  );
  document.getElementById(
    "titel"
  ).textContent = `Asset growth at ${renditeProJahrWert}% Profit per Year`;

  const chartLabels = [];
  const chartData = [];
  const bezugData = [];
  const dividendeData = [];

  let vermoegenErstesJahr = startkapital;
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
    if (jahr === 0) vermoegenErstesJahr = betrag;
    vermoegenLetztesJahr = betrag;

    chartLabels.push(aktuellesJahr + jahr);
    chartData.push(betrag);
    bezugData.push(bezug);
    dividendeData.push(dividende);
  }

  const wachstum =
    ((vermoegenLetztesJahr - vermoegenErstesJahr) / vermoegenErstesJahr) * 100;
  document.getElementById(
    "wachstumProzent"
  ).textContent = `Total Growth: ${wachstum.toFixed(2)}% Max. Drawdown: ${(
    maxDrawdown * 100
  ).toFixed(2)}%`;

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

  document.getElementById(
    "volatilitaet"
  ).textContent = `Volatility: ${volatilitaet.toFixed(2)}%`;

  document.getElementById(
    "totalDividendsCashflow"
  ).textContent = `Total Dividends: $${totalDividends.toLocaleString(
    undefined,
    { maximumFractionDigits: 0 }
  )}, Total Cashflow: $${totalCashflow.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

  renderCharts(chartLabels, chartData, bezugData, dividendeData);
}

let existingChart = null;
let existingBezugChart = null;

function renderCharts(labels, data, bezugData, dividendeData) {
  // Prüfen, ob der Viewport kleiner als 768px ist
  const isSmallViewport = window.innerWidth < 768;

  // Vermögenswachstum-Chart
  const ctx1 = document.getElementById("vermoegenChart").getContext("2d");
  if (existingChart) existingChart.destroy();
  existingChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Profit in 1000 (USD)",
          data: data,
          borderColor: "#ffc107",
          backgroundColor: "rgba(255, 193, 7, 0.2)",
          tension: 0.1,
          cubicInterpolationMode: "monotone",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Ermöglicht flexible Höhenanpassung
      plugins: {
        datalabels: {
          display: !isSmallViewport,
          color: "#fff",
          anchor: "end",
          align: "top",
          font: {
            size: 10,
            family: "Space Mono",
          },
          formatter: function (value) {
            const kValue = Math.floor(value / 1000); // In Tausendern (K) anzeigen
            return `${kValue}`;
          },
        },
        legend: {
          labels: {
            color: "#fff",
          },
        },
      },
      scales: {
        x: {
          title: {
            display: false,
            text: "Years",
            color: "#fff",
          },
          ticks: {
            color: "#fff",
          },
          grid: {
            display: false,
          },
        },
        y: {
          title: {
            display: !isSmallViewport,
            text: "Profit",
            color: "#fff",
          },
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "#ffffff54",
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });

  const ctx2 = document.getElementById("bezugDataChart").getContext("2d");
  if (existingBezugChart) existingBezugChart.destroy();
  existingBezugChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Cashflow in 1000 (USD)",
          data: bezugData,
          borderColor: "#32cd32",
          backgroundColor: "rgba(50, 205, 50, 0.2)",
          tension: 0.1,
          cubicInterpolationMode: "monotone",
          fill: false,
          yAxisID: "y",
        },
        {
          label: "Dividends in 1000 (USD)",
          data: dividendeData,
          borderColor: "#ffc107",
          backgroundColor: "rgba(255, 193, 7, 0.2)",
          tension: 0.1,
          cubicInterpolationMode: "monotone",
          fill: false,
          yAxisID: "y",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Ermöglicht flexible Höhenanpassung
      plugins: {
        datalabels: {
          display: !isSmallViewport, // Blendet Datalabels bei kleinen Viewports aus
          color: "#fff",
          anchor: "end",
          align: "top",
          font: {
            size: 10,
            family: "Space Mono",
          },
          formatter: function (value) {
            const kValue = Math.floor(value / 1000); // In Tausendern (K) anzeigen
            return `${kValue}`;
          },
        },
        legend: {
          labels: {
            color: "#fff",
          },
        },
      },
      scales: {
        x: {
          title: {
            display: false,
            text: "Years",
            color: "#fff",
          },
          ticks: {
            color: "#fff",
          },
          grid: {
            display: false,
          },
        },
        y: {
          title: {
            display: !isSmallViewport,
            text: "Cashflow/Dividends",
            color: "#fff",
          },
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "#ffffff54",
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
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

document.addEventListener("DOMContentLoaded", function () {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
