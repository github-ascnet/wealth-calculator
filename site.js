function validateInput(inputElement) {
  const min = parseFloat(inputElement.getAttribute("min")) || 0;
  const max = parseFloat(inputElement.getAttribute("max"));
  let value = parseFloat(inputElement.value);

  // Wenn der Wert kleiner als der Mindestwert ist, setze ihn auf den Mindestwert
  if (value < min) {
    inputElement.value = min;
  }

  // Wenn der Maximalwert definiert ist und überschritten wird, setze den Wert auf den Maximalwert
  if (max && value > max) {
    inputElement.value = max;
  }

  // Verhindert ungültige Eingaben
  if (isNaN(value)) {
    inputElement.value = "";
  }
}

function sanitizeInput(inputElement) {
  inputElement.value = inputElement.value.replace(/[^\d.]/g, ""); // Nur Zahlen und Punkt zulassen
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
  const relativerBezug =
    parseFloat(document.getElementById("relativerBezug").value) / 100;
  const dividendeProzent =
    parseFloat(document.getElementById("dividendeProzent").value) / 100;

  const renditeProJahrWert = parseFloat(
    document.getElementById("renditeProJahr").value
  );
  document.getElementById(
    "titel"
  ).textContent = `Asset Growth at ${renditeProJahrWert}% Profit per Year`;

  const chartLabels = [];
  const chartData = [];
  const bezugData = [];
  const dividendeData = [];

  let vermoegenErstesJahr = startkapital;
  let vermoegenLetztesJahr = startkapital;

  let highWatermark = startkapital;
  let maxDrawdown = 0;

  function normaleZufallszahl(mean, stdDev) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z * stdDev;
  }

  const aktuellesJahr = new Date().getFullYear() + 1;

  for (let jahr = 0; jahr < jahre; jahr++) {
    const abweichung = normaleZufallszahl(0, standardAbweichung);
    const effektiveRendite = renditeProJahr + abweichung;
    let betrag = vermoegenLetztesJahr * (1 + effektiveRendite);

    const bezug = betrag * relativerBezug;
    const dividende = betrag * dividendeProzent;

    betrag = Math.max(betrag - bezug, 0);

    if (jahr === 0) vermoegenErstesJahr = betrag;
    vermoegenLetztesJahr = betrag;

    if (betrag > highWatermark) {
      highWatermark = betrag;
    } else {
      const drawdown = ((highWatermark - betrag) / highWatermark) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    chartLabels.push(aktuellesJahr + jahr);
    chartData.push(betrag);
    bezugData.push(bezug);
    dividendeData.push(dividende);
  }

  const wachstum =
    ((vermoegenLetztesJahr - vermoegenErstesJahr) / vermoegenErstesJahr) * 100;
  document.getElementById(
    "wachstumProzent"
  ).textContent = `The assets grew by ${wachstum.toFixed(
    2
  )}% and had a max. drawdown of ${maxDrawdown.toFixed(2)}%.`;

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
          label: "Profit",
          data: data,
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          tension: 0.1,
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
          color: "black",
          anchor: "end",
          align: "top",
          font: {
            size: 10,
            family: "Poppins",
          },
          formatter: function (value) {
            const kValue = Math.floor(value / 1000); // In Tausendern (K) anzeigen
            return `${kValue}K`;
          },
        },
      },
      scales: {
        x: {
          title: {
            display: false,
            text: "Years",
          },
        },
        y: {
          title: {
            display: !isSmallViewport,
            text: "Profit in 1000 (USD)",
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
          label: "Cashflow",
          data: bezugData,
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          tension: 0.1,
          fill: false,
          yAxisID: "y",
        },
        {
          label: "Dividends",
          data: dividendeData,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          tension: 0.1,
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
          color: "black",
          anchor: "end",
          align: "top",
          font: {
            size: 10,
            family: "Poppins",
          },
          formatter: function (value) {
            const kValue = Math.floor(value / 1000); // In Tausendern (K) anzeigen
            return `${kValue}K`;
          },
        },
      },
      scales: {
        x: {
          title: {
            display: false,
            text: "Years",
          },
        },
        y: {
          title: {
            display: !isSmallViewport,
            text: "Cashflow/Dividends In 1000 (USD)",
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
