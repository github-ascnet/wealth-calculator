/*
 * motion.js – Motion-Grundlage und Intro-Loader (BP-017; D-020, D-027)
 *
 * - Setzt <html class="ag-motion">, ausser bei prefers-reduced-motion: reduce.
 * - Blendet den Loader (#agLoader) nach ca. 1 s aus und setzt danach <html class="ag-motion-ready">.
 * - Ohne dieses Skript bleibt die Seite im statischen Endzustand (motion.css zeigt den Loader
 *   höchstens 1.3 s und nie bei reduzierter Bewegung).
 *
 * Schnittstelle:
 *   AG_MOTION.enabled        false bei prefers-reduced-motion
 *   AG_MOTION.whenReady(fn)  ruft fn nach dem Ausblenden des Loaders auf (sofort, wenn schon bereit oder ohne Motion)
 *   AG_MOTION.setResult(wachstumProzent)
 *                            färbt den Hintergrund nach Total Growth (D-023, BP-019): Gewinn teal, Verlust rosé,
 *                            Stärke 1 - exp(-|G| / 150 %), unter 1 % keine Färbung
 *   AG_MOTION.countUp(element, ziel, formatiere)
 *                            zeigt formatiere(wert) im Element und lässt wert vom zuletzt angezeigten Wert
 *                            (beim ersten Mal 0) auf ziel laufen; am Ende steht exakt formatiere(ziel) (BP-018, D-026)
 */
(function () {
  const TITEL_STAFFEL_MS = 45; // Versatz je Buchstabe beim Einlauf des Titels
  const TINT_G0 = 150; // Total Growth in Prozent, bei dem die Stärke etwa 63 % erreicht (13.7)
  const TINT_NEUTRAL = 1; // unter diesem Betrag in Prozent keine Färbung
  const LOADER_DAUER_MS = 1000; // sichtbare Dauer des Loaders ab Navigationsbeginn
  const ZAEHL_DAUER_MS = 1200; // Dauer des Hochzählens
  const LOADER_ABGANG_MS = 220; // Ausblenden (siehe motion.css), danach wird der Loader entfernt

  const wurzel = document.documentElement;
  const reduzierteBewegung =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const aktiv = !reduzierteBewegung;

  let bereit = false;
  const wartende = [];

  function markiereBereit() {
    if (bereit) return;
    bereit = true;
    wurzel.classList.add("ag-motion-ready");
    wartende.splice(0).forEach(function (rueckruf) {
      rueckruf();
    });
  }

  function whenReady(rueckruf) {
    if (!aktiv || bereit) {
      rueckruf();
      return;
    }
    wartende.push(rueckruf);
  }

  function steuereLoader() {
    const loader = document.getElementById("agLoader");
    if (!loader) {
      markiereBereit();
      return;
    }
    // Der Loader ist ab dem ersten Bild sichtbar; die Dauer wird ab Navigationsbeginn gerechnet
    const wartezeit = Math.max(0, LOADER_DAUER_MS - window.performance.now());
    window.setTimeout(function () {
      loader.classList.add("ag-loader-hidden");
      markiereBereit();
      window.setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, LOADER_ABGANG_MS + 40);
    }, wartezeit);
  }

  if (aktiv) {
    wurzel.classList.add("ag-motion");
    steuereLoader();
  } else {
    // Ohne Bewegung gibt es keinen Loader; er wird entfernt, der Inhalt ist sofort bereit
    const loader = document.getElementById("agLoader");
    if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    markiereBereit();
  }

  // ---- Titel: Buchstaben laufen gestaffelt ein (Animation in motion.css, wartet auf ag-motion-ready) ----

  function zerlegeTitel() {
    const titel = document.getElementById("titel");
    if (!titel || titel.querySelector(".ag-title-char")) return;
    const text = titel.textContent;
    titel.setAttribute("aria-label", text);
    titel.textContent = "";
    Array.from(text).forEach(function (zeichen, i) {
      const span = document.createElement("span");
      span.className = "ag-title-char";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--i", String(i));
      span.style.setProperty("--staffel", TITEL_STAFFEL_MS + "ms");
      span.textContent = zeichen;
      titel.appendChild(span);
    });
  }

  if (aktiv) zerlegeTitel();

  // ---- Ergebnis-Tint (D-023): Deckkraft der Gewinn- bzw. Verlust-Ebene über CSS-Variablen ----

  let tintMarke = 0;

  function setResult(wachstumProzent) {
    if (!aktiv) return;
    const betrag = Math.abs(wachstumProzent);
    const staerke = isFinite(betrag) && betrag >= TINT_NEUTRAL ? 1 - Math.exp(-betrag / TINT_G0) : 0;
    const gewinn = wachstumProzent > 0 ? staerke : 0;
    const verlust = wachstumProzent < 0 ? staerke : 0;
    const marke = ++tintMarke;
    // Die erste Färbung folgt nach dem Loader, damit sie sichtbar einblendet
    whenReady(function () {
      if (marke !== tintMarke) return;
      wurzel.style.setProperty("--ag-tint-gain", gewinn.toFixed(3));
      wurzel.style.setProperty("--ag-tint-loss", verlust.toFixed(3));
    });
  }

  // ---- Hochzählen der Kennzahlen (D-026) ----

  const zaehlzustand = new WeakMap(); // Element -> { angezeigt, raf, marke }

  function countUp(element, ziel, formatiere) {
    let zustand = zaehlzustand.get(element);
    if (!zustand) {
      zustand = { angezeigt: 0, raf: null, marke: 0 };
      zaehlzustand.set(element, zustand);
    }
    // Eine laufende oder wartende Zählung wird abgebrochen, die neue startet beim zuletzt angezeigten Wert
    zustand.marke += 1;
    if (zustand.raf !== null) {
      window.cancelAnimationFrame(zustand.raf);
      zustand.raf = null;
    }

    if (!aktiv || !isFinite(ziel)) {
      element.textContent = formatiere(ziel);
      zustand.angezeigt = isFinite(ziel) ? ziel : 0;
      return;
    }

    const start = zustand.angezeigt;
    const marke = zustand.marke;
    // Bis die Zählung läuft (z. B. hinter dem Loader) steht der Startwert da, nie der Endwert
    element.textContent = formatiere(start);

    function beginne() {
      if (marke !== zustand.marke) return; // inzwischen durch eine neuere Zählung ersetzt
      const t0 = window.performance.now();
      function schritt(jetzt) {
        const anteil = Math.min(1, (jetzt - t0) / ZAEHL_DAUER_MS);
        if (anteil >= 1) {
          element.textContent = formatiere(ziel);
          zustand.angezeigt = ziel;
          zustand.raf = null;
          return;
        }
        const weich = 1 - Math.pow(1 - anteil, 3);
        const wert = start + (ziel - start) * weich;
        element.textContent = formatiere(wert);
        zustand.angezeigt = wert;
        zustand.raf = window.requestAnimationFrame(schritt);
      }
      zustand.raf = window.requestAnimationFrame(schritt);
    }

    whenReady(beginne);
  }

  window.AG_MOTION = { enabled: aktiv, whenReady: whenReady, countUp: countUp, setResult: setResult };
})();
