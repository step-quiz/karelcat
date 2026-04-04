// ════════════════════════════════════════════════════════
// ui.js — Modals, tema, onboarding, ref panel, log, config
// ════════════════════════════════════════════════════════

// ── Log ──

function log(msg, type) {
  type = type || 'dim';
  const logEl = document.getElementById('log');
  if (!logEl) return;
  const p = document.createElement('p');
  p.className   = type;
  p.textContent = msg;
  logEl.appendChild(p);
  while (logEl.children.length > 200) logEl.removeChild(logEl.firstChild);
  logEl.scrollTop = logEl.scrollHeight;
}

function clearLog() {
  const logEl = document.getElementById('log');
  if (logEl) logEl.innerHTML = '';
}


// ── Indicador d'estat ──

function setStateUI(state) {
  K.state.currentState = state;
  const dot = document.getElementById('state-dot');
  const lbl = document.getElementById('state-lbl');
  if (!dot || !lbl) return;
  dot.className = (state === 'idle') ? '' : state;
  lbl.textContent = K.t('state.' + state) || state;
}


// ── Modals ──

function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

function initModals() {
  document.querySelectorAll('.modal-bg').forEach(bg =>
    bg.addEventListener('click', e => { if (e.target === bg) bg.classList.remove('open'); })
  );
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape')
      document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
  });
}


// ── Tema ──

function toggleLight() {
  document.body.classList.toggle('light');
  localStorage.setItem('karel-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  closeConfig();
}

function restoreTheme() {
  if (localStorage.getItem('karel-theme') === 'light') document.body.classList.add('light');
}


// ── Config dropdown ──

function toggleConfig() {
  const panel = document.getElementById('config-panel');
  if (panel) panel.classList.toggle('open');
}

function closeConfig() {
  const panel = document.getElementById('config-panel');
  if (panel) panel.classList.remove('open');
}

function initConfigDropdown() {
  document.addEventListener('click', function(e) {
    const wrap  = document.querySelector('.config-dropdown-wrap');
    const panel = document.getElementById('config-panel');
    if (wrap && panel && !wrap.contains(e.target)) panel.classList.remove('open');
  });
}


// ── Canvi d'idioma ──

function setCodeLang(lang) {
  if (!K.I18N[lang]) return;
  K.state.currentCodeLang = lang;
  localStorage.setItem('karel-codelang', lang);
  K.applyCodeLang(lang);
  K.stopProgram();
  const ta = document.getElementById('code-editor');
  if (ta) {
    ta.value = K.DEFAULT_CODE[lang] || K.DEFAULT_CODE.ca;
    localStorage.setItem(K.LS_KEY_CODE, ta.value);
    K.updateEditor();
  }
  updateLangButtons();
  const refPanel = document.getElementById('ref-panel');
  if (refPanel && refPanel.classList.contains('visible')) renderRefPanel();
}

function setUserLang(lang) {
  if (!K.I18N[lang]) return;
  K.state.currentUserLang = lang;
  localStorage.setItem('karel-userlang', lang);
  updateUI();
}

function updateLangButtons() {
  const LANG_BTN_MAP = { 'CAT': 'ca', 'CAST': 'es', 'ENG': 'en' };
  document.querySelectorAll('#codelang-switcher .lang-btn').forEach(btn => {
    btn.classList.toggle('active', LANG_BTN_MAP[btn.textContent.trim()] === K.state.currentCodeLang);
  });
  document.querySelectorAll('#userlang-switcher .lang-btn').forEach(btn => {
    btn.classList.toggle('active', LANG_BTN_MAP[btn.textContent.trim()] === K.state.currentUserLang);
  });
}


// ── Actualitza tota la interfície ──

function updateUI() {
  const btnCh = document.getElementById('btn-challenges');
  if (btnCh) btnCh.textContent = K.t('ui.challenges');
  const btnTheme = document.getElementById('btn-theme');
  if (btnTheme) btnTheme.textContent = K.t('ui.toggle_theme');
  const lblConfig = document.getElementById('lbl-config');
  if (lblConfig) lblConfig.textContent = K.t('ui.config_btn') || 'Configuració';
  const lblCode = document.getElementById('lbl-codelang');
  if (lblCode) lblCode.textContent = K.t('ui.lbl_codelang');
  const lblUser = document.getElementById('lbl-userlang');
  if (lblUser) lblUser.textContent = K.t('ui.lbl_userlang');
  const mct = document.getElementById('modal-challenges-title');
  if (mct) mct.textContent = K.t('ui.challenges_title');

  const ids = {
    'btn-run':        'ui.run',    'btn-step':  'ui.step',
    'btn-stop':       'ui.stop',   'btn-reset': 'ui.reset',
    'btn-clear':      'ui.clear_log',
    'btn-ref':        'ui.ref_btn',
    'btn-modal-close':'ui.close',
    'btn-goal':       'ui.goal_btn',
  };
  for (const [id, key] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) el.textContent = K.t(key);
  }

  const lblBag   = document.getElementById('lbl-bag');
  if (lblBag) lblBag.textContent = K.t('ui.bag');
  const lblSpeed = document.getElementById('lbl-speed');
  if (lblSpeed) lblSpeed.textContent = K.t('ui.speed');
  const spd = document.getElementById('speed');
  const lbl = document.getElementById('speed-lbl');
  if (spd && lbl) lbl.textContent = K.I18N[K.state.currentUserLang].speed[parseInt(spd.value) - 1] || spd.value;

  setStateUI(K.state.currentState);
  updateLangButtons();

  const refPanel = document.getElementById('ref-panel');
  if (refPanel && refPanel.classList.contains('visible')) renderRefPanel();

  const btnSuccMore  = document.getElementById('btn-success-more');
  const btnSuccClose = document.getElementById('btn-success-close');
  if (btnSuccMore)  btnSuccMore.textContent  = K.t('ui.success_more')  || '🎯 Reptes';
  if (btnSuccClose) btnSuccClose.textContent = K.t('ui.success_close') || 'Continua';

  const obModal = document.getElementById('modal-onboard');
  if (obModal && obModal.classList.contains('open')) renderOnboardStep();
  const btnSkip = document.getElementById('onboard-skip');
  if (btnSkip) btnSkip.textContent = K.t('ui.onboard_skip') || 'Salta';

  K.updateHintButton();
}


// ── Panell de referència ──

function toggleRef() {
  const panel = document.getElementById('ref-panel');
  const btn   = document.getElementById('btn-ref');
  if (!panel) return;
  const isVisible = panel.classList.toggle('visible');
  if (btn) btn.classList.toggle('active', isVisible);
  if (isVisible) renderRefPanel();
}

function renderRefPanel() {
  const panel = document.getElementById('ref-panel');
  if (!panel) return;
  const tk = K.I18N[K.state.currentCodeLang].tokens;
  const ui = K.I18N[K.state.currentUserLang].ui;

  const cmdLabel  = K.escHtml(ui.ref_cmd  || 'Moviment');
  const condLabel = K.escHtml(ui.ref_cond || 'Condicions');
  const kwLabel   = K.escHtml(ui.ref_kw   || 'Estructures');

  const tokenRow = (list, kind) =>
    list.map(w => `<span class="ref-token ${K.escHtml(kind)}" title="${K.escHtml(w)}">${K.escHtml(w)}</span>`).join('');

  panel.innerHTML = `<div class="ref-grid">
    <div>
      <div class="ref-section-title">${cmdLabel}</div>
      <div class="ref-tokens">${tokenRow(tk.commands, 'cmd')}</div>
    </div>
    <div>
      <div class="ref-section-title">${condLabel}</div>
      <div class="ref-tokens">${tokenRow(tk.conditions, 'cond')}</div>
    </div>
    <div>
      <div class="ref-section-title">${kwLabel}</div>
      <div class="ref-tokens">${tokenRow(tk.keywords, 'kw')}</div>
    </div>
  </div>`;
}


// ── Hamburger ──

function initHamburger() {
  const btn     = document.getElementById('topbar-hamburger');
  const actions = document.querySelector('.topbar-actions');
  if (!btn || !actions) return;

  btn.addEventListener('click', () => {
    const open = actions.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? '✕' : '☰';
  });

  actions.addEventListener('click', e => {
    if ((e.target.closest('.btn') || e.target.closest('.lang-btn')) && window.innerWidth <= 600) {
      actions.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 600 && actions.classList.contains('open')) {
      actions.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    }
  });
}


// ── Onboarding ──

let onboardStep = 0;

function openOnboard() {
  onboardStep = 0;
  renderOnboardStep();
  openModal('modal-onboard');
}

function renderOnboardStep() {
  const steps = K.I18N[K.state.currentUserLang]?.onboard || [];
  if (!steps.length) return;
  const s = steps[onboardStep];

  document.getElementById('onboard-icon').textContent  = s.icon;
  document.getElementById('onboard-title').textContent = s.title;
  document.getElementById('onboard-body').innerHTML    = K.sanitizeHtml(s.body);

  const dotsEl = document.getElementById('onboard-dots');
  if (dotsEl) {
    dotsEl.innerHTML = steps.map((_, i) =>
      `<div class="onboard-dot${i === onboardStep ? ' active' : ''}"></div>`
    ).join('');
  }

  const prevBtn = document.getElementById('onboard-prev');
  const nextBtn = document.getElementById('onboard-next');
  if (prevBtn) prevBtn.style.visibility = onboardStep === 0 ? 'hidden' : 'visible';
  if (nextBtn) {
    const isLast = onboardStep === steps.length - 1;
    nextBtn.textContent = isLast
      ? (K.t('ui.onboard_start') || 'Comencem! 🚀')
      : (K.t('ui.onboard_next')  || 'Següent →');
  }

  const isLastStep = onboardStep === steps.length - 1;
  const tutBtn = document.getElementById('onboard-tutorial');
  if (tutBtn) {
    tutBtn.style.display = isLastStep ? 'block' : 'none';
    tutBtn.textContent = K.t('ui.onboard_tutorial') || '📖 Coneix Karel en 2 minuts';
  }
  const editBtn = document.getElementById('onboard-editmap');
  if (editBtn) {
    editBtn.style.display = isLastStep ? 'block' : 'none';
    editBtn.textContent = '🗺️ ' + (K.t('ui.return_lbl_edit') || 'Edita mapa');
  }
}

function onboardNext() {
  const steps = K.I18N[K.state.currentUserLang]?.onboard || [];
  if (onboardStep < steps.length - 1) {
    onboardStep++;
    renderOnboardStep();
  } else {
    localStorage.setItem(K.LS_ONBOARD, '1');
    closeModal('modal-onboard');
    setTimeout(openChallenges, 200);
  }
}

function onboardPrev() {
  if (onboardStep > 0) { onboardStep--; renderOnboardStep(); }
}

function onboardSkip() {
  localStorage.setItem(K.LS_ONBOARD, '1');
  closeModal('modal-onboard');
}

function maybeShowOnboard() {
  if (!localStorage.getItem(K.LS_ONBOARD)) {
    openOnboard();
  } else {
    openReturnWelcome();
  }
}

function openReturnWelcome() {
  document.getElementById('return-title').textContent        = K.t('ui.return_title')         || 'Benvingut de nou!';
  document.getElementById('return-subtitle').textContent     = K.t('ui.return_subtitle')      || 'Que vols fer?';
  document.getElementById('return-lbl-challenge').textContent = K.t('ui.return_lbl_challenge') || 'Tria un repte';
  document.getElementById('return-desc-challenge').textContent= K.t('ui.return_desc_challenge')|| '';
  document.getElementById('return-lbl-csv').textContent      = K.t('ui.return_lbl_csv')       || 'Carrega un mapa CSV';
  document.getElementById('return-desc-csv').textContent     = K.t('ui.return_desc_csv')      || '';
  document.getElementById('return-lbl-edit').textContent     = K.t('ui.return_lbl_edit')      || 'Edita mapa';
  document.getElementById('return-desc-edit').textContent    = K.t('ui.return_desc_edit')     || '';
  openModal('modal-return');
}


// ── Fitxers CSV ──

function triggerOpenCSV() {
  const input = document.getElementById('file-input') || document.getElementById('welcome-file-input');
  input?.click();
}

function handleWelcomeCSV(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const csv = e.target.result.trim();
    const url = location.href.split('?')[0] + '?mapa=' + encodeURIComponent(csv);
    location.href = url;
  };
  reader.readAsText(file);
  evt.target.value = '';
}

function handleFileOpen(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    K.state.currentCSV = e.target.result.trim();
    K.loadMapFromCSV(K.state.currentCSV);
    log(`📂 ${file.name}`, 'ok');
  };
  reader.readAsText(file);
  evt.target.value = '';
}

function saveCSV() {
  const csv = K.worldToCSV();
  const a   = document.createElement('a');
  a.href    = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'mapa-karel.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  log('💾 CSV', 'ok');
}

function copyMapURL() {
  const url = location.href.split('?')[0] + '?mapa=' + encodeURIComponent(K.worldToCSV());
  navigator.clipboard.writeText(url)
    .then(() => log('🔗 URL copiada!', 'ok'))
    .catch(() => log('🔗 ' + url, 'ok'));
}


// ── Log resize handle ──

function initLogResize() {
  const wrap   = document.getElementById('log-wrap');
  const handle = document.getElementById('log-resize');
  if (!wrap || !handle) return;
  let startY, startH;
  handle.addEventListener('mousedown', e => {
    startY = e.clientY; startH = wrap.offsetHeight;
    handle.classList.add('dragging');
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    e.preventDefault();
  });
  function onMove(e) {
    wrap.style.height = Math.max(40, Math.min(startH + (startY - e.clientY), window.innerHeight * .6)) + 'px';
  }
  function onUp() {
    handle.classList.remove('dragging');
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
}


// ── Speed slider ──

function initSpeedSlider() {
  const slider = document.getElementById('speed');
  if (!slider) return;
  slider.addEventListener('input', function() {
    const idx = parseInt(this.value) - 1;
    K.state.stepDelay = K.SPEED_DELAYS[idx];
    const lbl = document.getElementById('speed-lbl');
    if (lbl) lbl.textContent = K.I18N[K.state.currentUserLang].speed[idx] || this.value;
  });
}


// ── Exporta ──

K.log             = log;
K.clearLog        = clearLog;
K.setStateUI      = setStateUI;
K.openModal       = openModal;
K.closeModal      = closeModal;
K.closeConfig     = closeConfig;
K.updateUI        = updateUI;
K.maybeShowOnboard = maybeShowOnboard;

K.initModals         = initModals;
K.initHamburger      = initHamburger;
K.initConfigDropdown = initConfigDropdown;
K.initLogResize      = initLogResize;
K.initSpeedSlider    = initSpeedSlider;
K.restoreTheme       = restoreTheme;

// Globals per a HTML onclick
window.toggleLight    = toggleLight;
window.toggleConfig   = toggleConfig;
window.toggleRef      = toggleRef;
window.setCodeLang    = setCodeLang;
window.setUserLang    = setUserLang;
window.clearLog       = clearLog;
window.openChallenges = openChallenges;
window.closeModal     = closeModal;
window.onboardNext    = onboardNext;
window.onboardPrev    = onboardPrev;
window.onboardSkip    = onboardSkip;
window.triggerOpenCSV  = triggerOpenCSV;
window.handleWelcomeCSV = handleWelcomeCSV;
window.handleFileOpen  = handleFileOpen;
window.saveCSV         = saveCSV;
window.copyMapURL      = copyMapURL;
