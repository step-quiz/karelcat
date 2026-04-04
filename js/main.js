// ════════════════════════════════════════════════════════
// main.js — Inicialització: connecta tots els mòduls
// ════════════════════════════════════════════════════════

(function init() {
  const S = K.state;

  // Tema
  K.restoreTheme();

  // Aplica el llenguatge de programació
  K.applyCodeLang(S.currentCodeLang);

  // Inicialitza UI
  K.initModals();
  K.initHamburger();
  K.initConfigDropdown();
  K.initLogResize();
  K.initSpeedSlider();

  // Carrega el mapa (des de URL o per defecte)
  const urlMapa = K._urlParams.get('mapa');
  K.loadMapFromCSV(urlMapa ?? K.DEFAULT_CSV);

  // Event delegation per al grid (un sol listener, no un per cel·la)
  K.initGridDelegation();

  // Inicialitza l'editor
  K.initEditor();
  const ta = document.getElementById('code-editor');
  if (ta) {
    const saved = localStorage.getItem(K.LS_KEY_CODE);
    ta.value = saved || K.DEFAULT_CODE[S.currentCodeLang] || K.DEFAULT_CODE.ca;
    K.updateEditor();
    setTimeout(() => K.updateEditor(), 50);
  }

  // Inicialitza editor de mapes
  K.initMapEditor();

  // ResizeObserver per auto-escalar el grid
  const worldArea = document.getElementById('world-area');
  if (worldArea) {
    let rafId = null;
    new ResizeObserver(() => {
      if (S.world.rows <= 0) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => { rafId = null; K.renderWorld(); });
    }).observe(worldArea);
  }

  // Actualitza la UI amb l'idioma
  K.updateUI();

  // Onboarding (no si ve amb ?mapa=)
  if (!urlMapa) setTimeout(K.maybeShowOnboard, 500);
})();
