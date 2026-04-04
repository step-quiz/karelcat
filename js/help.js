// ════════════════════════════════════════════════════════
// help.js — Sistema d'ajuda contextual (post-it + botó al log)
// ════════════════════════════════════════════════════════

let _helpCode = null;
let _helpLine = null;


// ── Log d'error amb botó "Ajuda" ──

function logError(msg, errCode, line) {
  const logEl = document.getElementById('log');
  if (!logEl) return;
  const p = document.createElement('p');
  p.className = 'err';
  p.appendChild(document.createTextNode(String(msg) + ' '));
  const btn = document.createElement('button');
  btn.className = 'help-btn';
  btn.textContent = K.t('ui.help_btn') || 'Ajuda 💡';
  btn.addEventListener('click', () => showHelp(errCode, line ?? null));
  p.appendChild(btn);
  logEl.appendChild(p);
  while (logEl.children.length > 200) logEl.removeChild(logEl.firstChild);
  logEl.scrollTop = logEl.scrollHeight;
  hideHelp();
}


// ── Post-it: mostra / amaga ──

function showHelp(errCode, line) {
  _helpCode = errCode;
  _helpLine = line;
  renderPostit(1);
}

function showMoreHelp() { renderPostit(2); }

function hideHelp() {
  const pi = document.getElementById('help-postit');
  if (!pi) return;
  pi.classList.remove('visible', 'level2');
  pi.innerHTML = '';
}

function renderPostit(level) {
  const pi = document.getElementById('help-postit');
  if (!pi || !_helpCode) return;
  const h = K.I18N[K.state.currentUserLang]?.help?.[_helpCode];
  if (!h) return;

  const title      = level === 1 ? h.title  : h.title2;
  const body       = level === 1 ? h.hint1  : h.hint2;
  const closeLabel = K.t('ui.help_close') || '✕';
  const moreLabel  = K.t('ui.help_more')  || 'Més ajuda →';

  pi.innerHTML = `
    <button class="help-close" title="${K.escHtml(closeLabel)}">✕</button>
    <div class="help-title">${K.sanitizeHtml(title)}</div>
    <div class="help-body">${K.sanitizeHtml(body)}</div>
    ${level === 1 ? '<button class="help-more-btn"></button>' : ''}
  `;
  pi.querySelector('.help-close')?.addEventListener('click', hideHelp);
  const moreBtn = pi.querySelector('.help-more-btn');
  if (moreBtn) {
    moreBtn.textContent = moreLabel;
    moreBtn.addEventListener('click', showMoreHelp);
  }

  pi.classList.remove('level2');
  if (level === 2) pi.classList.add('level2');
  pi.classList.add('visible');

  if (_helpLine) {
    document.getElementById('lbg-' + _helpLine)
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}


// ── Exporta ──

K.logError = logError;
K.showHelp = showHelp;
K.hideHelp = hideHelp;
