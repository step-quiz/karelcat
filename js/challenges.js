// ════════════════════════════════════════════════════════
// challenges.js — Reptes, pistes, objectiu, èxit
// ════════════════════════════════════════════════════════

// ── Obre el modal de reptes ──

function openChallenges() {
  K.closeConfig();
  const challenges = K.I18N[K.state.currentUserLang].challenges;
  const list = document.getElementById('challenges-list');
  if (!list) return;

  const groups = {};
  for (const ch of challenges) {
    const cat = ch.category || 'basic';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(ch);
  }

  const catOrder = ['cp', 'basic'];

  function renderCards(arr) {
    return arr.map(ch => {
      const numLabel = ch.category === 'cp'
        ? `CP ${ch.id - 100}`
        : `${K.escHtml(K.t('log.challenge'))} ${ch.id}`;
      return `
      <div class="ch-card" data-challenge-id="${ch.id}" role="button" tabindex="0">
        <div class="ch-num">${numLabel}</div>
        <div class="ch-title">${K.sanitizeHtml(ch.title)}</div>
        <div class="ch-desc">${K.sanitizeHtml(ch.desc)}</div>
        <div><span class="ch-tag ${K.escHtml(ch.level)}">${K.escHtml(K.t('ui.level_' + ch.level))}</span></div>
      </div>`;
    }).join('');
  }

  let html = '';
  for (let i = 0; i < catOrder.length; i++) {
    const cat = catOrder[i];
    if (!groups[cat]) continue;
    const label = K.t('ui.category_' + cat) || cat;
    html += `<details class="ch-details"${i === 0 ? ' open' : ''}>
      <summary class="ch-summary">${K.escHtml(label)}<span class="ch-count">${groups[cat].length}</span></summary>
      <div class="ch-grid">${renderCards(groups[cat])}</div>
    </details>`;
  }
  list.innerHTML = html;
  list.onclick = e => {
    const card = e.target.closest('[data-challenge-id]');
    if (card) loadChallenge(+card.dataset.challengeId);
  };
  K.openModal('modal-challenges');
}


// ── Carrega un repte ──

function loadChallenge(id) {
  const S = K.state;
  const chUI   = K.I18N[S.currentUserLang].challenges.find(c => c.id === id);
  const chCode = K.I18N[S.currentCodeLang].challenges.find(c => c.id === id);
  if (!chUI || !chCode) return;

  S.currentChallengeId = id;
  startHintTimer();
  K.loadMapFromCSV(chCode.csv);

  const ta = document.getElementById('code-editor');
  if (ta) {
    ta.value = chCode.code;
    localStorage.setItem(K.LS_KEY_CODE, chCode.code);
    K.updateEditor();
  }
  K.closeModal('modal-challenges');

  const logLabel = chUI.category === 'cp' ? `CP ${id - 100}` : `${K.t('log.challenge')} ${id}`;
  K.log(`${logLabel}: ${chUI.title}`, 'ok');

  const btnGoal = document.getElementById('btn-goal');
  if (btnGoal) {
    btnGoal.style.display = '';
    btnGoal.textContent = K.t('ui.goal_btn') || '🎯 Objectiu';
  }
}


// ── Verificació d'èxit ──

function isChallengeSuccess(id) {
  const S = K.state;

  function waterOnMap() {
    let n = 0;
    for (const row of S.world.grid) for (const c of row) if (c === 'A') n++;
    return n;
  }
  function noWaterOnMap() { return waterOnMap() === 0; }

  switch (id) {
    case 1: return S.stepCount >= 2
      && (S.karel.x !== S.karelInit.x || S.karel.y !== S.karelInit.y)
      && K.isWall(K.front().x, K.front().y);
    case 2: return S.karel.motxilla > 0;
    case 3: return noWaterOnMap() && S.karel.motxilla > 0;
    case 4: return S.stepCount >= 3
      && S.karel.x === S.karelInit.x && S.karel.y === S.karelInit.y
      && S.karel.dir !== S.karelInit.dir;
    case 5: return S.karel.motxilla > 0;
    case 6: return noWaterOnMap() && S.karel.x === S.karelInit.x && S.karel.y === S.karelInit.y;
    case 7: return S.karel.motxilla === 0 && waterOnMap() > 0
      && S.world.grid[1]?.filter(c => c === 'A').length > 0;
    case 8: return S.stepCount >= 6
      && (Math.abs(S.karel.x - S.karelInit.x) + Math.abs(S.karel.y - S.karelInit.y)) >= 4;
    case 9:   return noWaterOnMap() && S.karel.motxilla > 0;
    case 101: return noWaterOnMap() && S.karel.motxilla > 0;
    case 102: return noWaterOnMap() && S.karel.motxilla > 0 && S.karel.y === 0;
    case 103: return noWaterOnMap() && S.karel.motxilla > 0
      && S.karel.x === S.karelInit.x && S.karel.y === S.karelInit.y;
    case 104: return noWaterOnMap() && S.karel.motxilla > 0;
    case 105: return noWaterOnMap() && S.karel.motxilla > 0;
    case 106: return noWaterOnMap() && S.karel.motxilla > 0;
    default:  return false;
  }
}

function checkChallengeSuccess() {
  const S = K.state;
  if (!S.currentChallengeId) return;
  if (!isChallengeSuccess(S.currentChallengeId)) return;

  const ch = K.I18N[S.currentUserLang]?.challenges?.find(c => c.id === S.currentChallengeId);
  if (!ch) return;

  K.log('🏆 ' + K.t('ui.success_title'), 'ok');

  setTimeout(() => {
    const icons = ['🎉','🏆','⭐','🚀','🌟'];
    document.getElementById('success-icon').textContent = icons[S.currentChallengeId % icons.length];
    const chLabel = ch.category === 'cp'
      ? 'CP ' + (ch.id - 100) + ': ' + ch.title
      : (K.t('log.challenge') || 'Repte') + ' ' + ch.id + ': ' + ch.title;
    document.getElementById('success-challenge').textContent = chLabel;
    document.getElementById('success-title').textContent     = K.t('ui.success_title');
    document.getElementById('success-msg').textContent       = K.t('ui.success_msg');
    const btnMore  = document.getElementById('btn-success-more');
    const btnClose = document.getElementById('btn-success-close');
    if (btnMore)  btnMore.textContent  = K.t('ui.success_more')  || '🎯 Més reptes';
    if (btnClose) btnClose.textContent = K.t('ui.success_close') || 'Continua';
    K.openModal('modal-success');
  }, 400);
}


// ── Pistes ──

function startHintTimer() {
  const S = K.state;
  S.hintLevel    = 0;
  S.hintLoadTime = Date.now();
  if (S.hintCountdownId) clearInterval(S.hintCountdownId);
  hideHintPanel();
  updateHintButton();
  S.hintCountdownId = setInterval(tickHintCountdown, 1000);
}

function tickHintCountdown() {
  const S = K.state;
  if (!S.hintLoadTime) return;
  if (Date.now() - S.hintLoadTime >= K.HINT_DELAY_MS) {
    clearInterval(S.hintCountdownId);
    S.hintCountdownId = null;
  }
  updateHintButton();
}

function updateHintButton() {
  const S   = K.state;
  const btn = document.getElementById('btn-hint');
  if (!btn) return;

  if (!S.currentChallengeId) { btn.style.display = 'none'; return; }
  btn.style.display = '';

  if (S.hintLevel >= 2) {
    btn.disabled    = true;
    btn.textContent = K.t('ui.hint_exhausted') || '✓ Totes les pistes vistes';
    return;
  }

  const elapsed   = S.hintLoadTime ? Date.now() - S.hintLoadTime : 0;
  const remaining = Math.max(0, K.HINT_DELAY_MS - elapsed);

  if (remaining <= 0) {
    btn.disabled    = false;
    btn.textContent = S.hintLevel === 0
      ? (K.t('ui.hint_btn')  || '💡 Pista')
      : (K.t('ui.hint_next') || 'Pista 2 →');
  } else {
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    btn.disabled    = true;
    btn.textContent = (K.t('ui.hint_locked') || '🔒 Pista ({time})').replace('{time}', timeStr);
  }
}

function showNextHint() {
  const S  = K.state;
  const ch = K.I18N[S.currentUserLang]?.challenges?.find(c => c.id === S.currentChallengeId);
  if (!ch || !ch.hints) return;
  const nextLevel = S.hintLevel + 1;
  const hintText  = ch.hints[nextLevel - 1];
  if (!hintText) return;
  S.hintLevel = nextLevel;
  renderHintPanel(nextLevel, hintText, ch.hints.length);
  updateHintButton();
}

function renderHintPanel(level, text, total) {
  const panel = document.getElementById('hint-panel');
  if (!panel) return;
  const title    = K.escHtml((K.t('ui.hint_panel_title') || '💡 Pista') + ' ' + level);
  const closeTip = K.escHtml(K.t('ui.hint_close') || 'Tanca');
  panel.innerHTML = `
    <div class="hint-header">
      <span class="hint-title">${title}</span>
      <button class="hint-close-btn" title="${closeTip}">✕</button>
    </div>
    <div class="hint-body">${K.sanitizeHtml(text)}</div>
    <div class="hint-progress">${Array.from({length: total}, (_, i) =>
      `<span class="hint-dot${i < level ? ' done' : ''}"></span>`).join('')}
    </div>`;
  panel.querySelector('.hint-close-btn')?.addEventListener('click', hideHintPanel);
  panel.classList.add('visible');
}

function hideHintPanel() {
  document.getElementById('hint-panel')?.classList.remove('visible');
}


// ── Objectiu ──

function renderGoalPreview(csv, container) {
  const { grid, rows, cols, kStart } = K.parseCSV(csv);
  const maxDim = Math.max(rows, cols);
  const cellPx = Math.max(18, Math.min(38, Math.floor(280 / maxDim)));
  const fs = Math.max(10, cellPx - 6) + 'px';
  let html = `<div class="goal-grid" style="grid-template-columns:repeat(${cols},${cellPx}px);grid-template-rows:repeat(${rows},${cellPx}px);gap:2px;">`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isKarel = (c === kStart.x && r === kStart.y);
      if (isKarel) {
        html += `<div class="gcell c-k" style="font-size:${fs}">${K.KAREL_ASSETS.MEDUSA.replace('class="karel-entity"', 'class="karel-entity" data-dir="' + K.DIRS[kStart.dir].dataDir + '"')}</div>`;
      } else {
        const v = grid[r][c];
        if (v === 'P') html += `<div class="gcell c-p" style="font-size:${fs}">${K.KAREL_ASSETS.CORALL}</div>`;
        else if (v === 'A') html += `<div class="gcell c-a" style="font-size:${fs}">${K.KAREL_ASSETS.BOMBOLLA}</div>`;
        else html += `<div class="gcell c-e"></div>`;
      }
    }
  }
  html += '</div>';
  container.innerHTML = html;
}

function showGoalModal() {
  const S = K.state;
  if (!S.currentChallengeId) return;
  const ch = K.I18N[S.currentUserLang]?.challenges?.find(c => c.id === S.currentChallengeId);
  if (!ch) return;

  const titleEl = document.getElementById('modal-goal-title');
  if (titleEl) titleEl.textContent = K.t('ui.goal_title') || '🎯 Objectiu';

  const nameEl = document.getElementById('goal-challenge-name');
  if (nameEl) {
    const numLabel = ch.category === 'cp' ? `CP ${ch.id - 100}` : `${K.t('log.challenge')} ${ch.id}`;
    nameEl.textContent = `${numLabel}: ${ch.title}`;
  }

  const instrEl = document.getElementById('goal-instructions');
  if (instrEl) instrEl.innerHTML = K.sanitizeHtml(ch.desc);

  const csv       = K.GOAL_CSV[S.currentChallengeId];
  const container = document.getElementById('goal-grid');
  const labelEl   = document.getElementById('goal-visual-label');
  if (csv && container) {
    if (labelEl) labelEl.textContent = K.t('ui.goal_desc') || '';
    renderGoalPreview(csv, container);
    container.style.display = '';
    if (labelEl) labelEl.style.display = '';
  } else {
    if (container) container.style.display = 'none';
    if (labelEl) labelEl.style.display = 'none';
  }

  const btnClose = document.getElementById('btn-goal-close');
  if (btnClose) btnClose.textContent = K.t('ui.close') || 'Tanca';

  K.openModal('modal-goal');
}


// ── Exporta ──

K.openChallenges       = openChallenges;
K.loadChallenge        = loadChallenge;
K.checkChallengeSuccess = checkChallengeSuccess;
K.updateHintButton     = updateHintButton;
K.showGoalModal        = showGoalModal;

window.openChallenges  = openChallenges;
window.showNextHint    = showNextHint;
window.showGoalModal   = showGoalModal;
