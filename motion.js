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
 */
(function () {
  const LOADER_DAUER_MS = 1000; // sichtbare Dauer des Loaders ab Navigationsbeginn
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

  window.AG_MOTION = { enabled: aktiv, whenReady: whenReady };
})();
