// ════════════════════════════════════════════════════════
// map-editor.js — Editor WYSIWYG del mapa + undo/redo
// ════════════════════════════════════════════════════════

// ── Mode edició ──

function toggleEditMode() {
  const S = K.state;
  if (S.running) { K.log(K.t('log.stop_first'), 'err'); return; }
  S.editMode = !S.editMode;
  document.body.classList.toggle('editing', S.editMode);
  const btn = document.getElementById('btn-edit-toggle');
  if (btn) btn.textContent = S.editMode ? '✓ Surt' : '✏️ Edita';
  if (S.editMode) {
    K.stopProgram();
    S.karel = { ...S.karelInit };
    S.world.grid = S.worldInit.map(r => [...r]);
    S.karelEditDir = S.karelInit.dir;
    updateSizeIndicators();
    setBrush('.');
  }
  K.renderWorldFull();
}


// ── Pinzells ──

function setBrush(b) {
  const S = K.state;
  S.editBrush = b;
  ['dot','P','A','K'].forEach(id =>
    document.getElementById('brush-' + id)?.classList.remove('active')
  );
  const map = { '.': 'dot', 'P': 'P', 'A': 'A', 'K': 'K' };
  document.getElementById('brush-' + map[b])?.classList.add('active');
  const ds = document.getElementById('dir-section');
  if (ds) ds.style.display = b === 'K' ? 'block' : 'none';
  updateDirButtons();
}

function setKarelDir(d) {
  const S = K.state;
  S.karelEditDir = d;
  S.karelInit = { ...S.karelInit, dir: d };
  S.karel     = { ...S.karelInit };
  S.currentCSV = K.worldToCSV();
  updateDirButtons();
  K.renderWorld();
}

function updateDirButtons() {
  const S = K.state;
  [0,1,2,3].forEach(d =>
    document.getElementById('dir-' + d)?.classList.toggle('active', d === S.karelEditDir)
  );
}

function applyBrushAt(col, row) {
  const S = K.state;
  if (col < 0 || col >= S.world.cols || row < 0 || row >= S.world.rows) return;
  let changed = false;
  if (S.editBrush === 'K') {
    if (S.karelInit.x !== col || S.karelInit.y !== row) {
      S.karelInit = { x: col, y: row, dir: S.karelEditDir, motxilla: 0 };
      S.karel     = { ...S.karelInit };
      changed = true;
    }
  } else {
    if (S.karelInit.x === col && S.karelInit.y === row) return;
    if (S.world.grid[row][col] !== S.editBrush) {
      S.world.grid[row][col] = S.editBrush;
      S.worldInit[row][col]  = S.editBrush;
      changed = true;
    }
  }
  if (changed) { S.currentCSV = K.worldToCSV(); K.renderWorld(); }
}


// ── Redimensionar ──

function updateSizeIndicators() {
  const S = K.state;
  const r = document.getElementById('rval-rows');
  const c = document.getElementById('rval-cols');
  if (r) r.textContent = S.world.rows;
  if (c) c.textContent = S.world.cols;
}

function addRow() {
  const S = K.state;
  if (S.world.rows >= 20) return;
  const nr = Array(S.world.cols).fill('.');
  S.world.grid.push([...nr]); S.worldInit.push([...nr]); S.world.rows++;
  S.currentCSV = K.worldToCSV();
  updateSizeIndicators(); K.renderWorldFull();
}

function removeRow() {
  const S = K.state;
  if (S.world.rows <= 1) return;
  if (S.karelInit.y >= S.world.rows - 1) {
    S.karelInit = { ...S.karelInit, y: S.world.rows - 2 };
    S.karel     = { ...S.karelInit };
  }
  S.world.grid.pop(); S.worldInit.pop(); S.world.rows--;
  S.currentCSV = K.worldToCSV();
  updateSizeIndicators(); K.renderWorldFull();
}

function addCol() {
  const S = K.state;
  if (S.world.cols >= 20) return;
  S.world.grid.forEach((r, i) => { r.push('.'); S.worldInit[i].push('.'); });
  S.world.cols++;
  S.currentCSV = K.worldToCSV();
  updateSizeIndicators(); K.renderWorldFull();
}

function removeCol() {
  const S = K.state;
  if (S.world.cols <= 1) return;
  if (S.karelInit.x >= S.world.cols - 1) {
    S.karelInit = { ...S.karelInit, x: S.world.cols - 2 };
    S.karel     = { ...S.karelInit };
  }
  S.world.grid.forEach((r, i) => { r.pop(); S.worldInit[i].pop(); });
  S.world.cols--;
  S.currentCSV = K.worldToCSV();
  updateSizeIndicators(); K.renderWorldFull();
}


// ── Undo / Redo ──

const _undoStack = [];
const _redoStack = [];
const _UNDO_MAX  = 50;
let   _dragSnapshot = null;

function _takeSnapshot() {
  const S = K.state;
  return {
    grid:     S.world.grid.map(r => [...r]),
    gridInit: S.worldInit.map(r => [...r]),
    karel:    { ...S.karelInit },
    rows:     S.world.rows,
    cols:     S.world.cols,
    csv:      S.currentCSV,
  };
}

function _restoreSnapshot(snap) {
  const S = K.state;
  S.world.grid = snap.grid.map(r => [...r]);
  S.worldInit  = snap.gridInit.map(r => [...r]);
  S.world.rows = snap.rows;
  S.world.cols = snap.cols;
  S.karelInit  = { ...snap.karel };
  S.karel      = { ...S.karelInit };
  S.karelEditDir = S.karelInit.dir;
  S.currentCSV = snap.csv;
  updateSizeIndicators();
  K.renderWorldFull();
  _updateUndoButtons();
}

function _pushUndo() {
  _undoStack.push(_takeSnapshot());
  if (_undoStack.length > _UNDO_MAX) _undoStack.shift();
  _redoStack.length = 0;
  _updateUndoButtons();
}

function editUndo() {
  if (!_undoStack.length) return;
  _redoStack.push(_takeSnapshot());
  _restoreSnapshot(_undoStack.pop());
}

function editRedo() {
  if (!_redoStack.length) return;
  _undoStack.push(_takeSnapshot());
  _restoreSnapshot(_redoStack.pop());
}

function _updateUndoButtons() {
  const u = document.getElementById('btn-undo');
  const r = document.getElementById('btn-redo');
  if (u) u.disabled = _undoStack.length === 0;
  if (r) r.disabled = _redoStack.length === 0;
}

// Embolcallem les funcions de mida per afegir undo
const _origAddRow = addRow, _origRemoveRow = removeRow;
const _origAddCol = addCol, _origRemoveCol = removeCol;
addRow    = function() { _pushUndo(); _origAddRow();    _updateUndoButtons(); };
removeRow = function() { _pushUndo(); _origRemoveRow(); _updateUndoButtons(); };
addCol    = function() { _pushUndo(); _origAddCol();    _updateUndoButtons(); };
removeCol = function() { _pushUndo(); _origRemoveCol(); _updateUndoButtons(); };


// ── Inicialització de l'editor de mapes ──

function initMapEditor() {
  const grid = document.getElementById('world-grid');
  if (!grid) return;

  // Drag mousedown
  grid.addEventListener('mousedown', () => {
    if (!K.state.editMode) return;
    _dragSnapshot = _takeSnapshot();
  });

  // Mouseup global → undo
  document.addEventListener('mouseup', () => {
    const S = K.state;
    if (!S.editMode) { S.editDragging = false; return; }
    S.editDragging = false;
    if (_dragSnapshot && S.currentCSV !== _dragSnapshot.csv) {
      _undoStack.push(_dragSnapshot);
      if (_undoStack.length > _UNDO_MAX) _undoStack.shift();
      _redoStack.length = 0;
      _updateUndoButtons();
    }
    _dragSnapshot = null;
  });

  // Touch support
  grid.addEventListener('touchstart', e => {
    if (!K.state.editMode) return;
    e.preventDefault();
    _dragSnapshot = _takeSnapshot();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const c = el?.dataset?.col !== undefined ? el : el?.closest?.('[data-col]');
    if (c) applyBrushAt(+c.dataset.col, +c.dataset.row);
  }, { passive: false });

  grid.addEventListener('touchmove', e => {
    if (!K.state.editMode) return;
    e.preventDefault();
    const tc = e.touches[0];
    const el = document.elementFromPoint(tc.clientX, tc.clientY);
    const c = el?.dataset?.col !== undefined ? el : el?.closest?.('[data-col]');
    if (c) applyBrushAt(+c.dataset.col, +c.dataset.row);
  }, { passive: false });

  grid.addEventListener('touchend', () => {
    if (!K.state.editMode || !_dragSnapshot) return;
    if (K.state.currentCSV !== _dragSnapshot.csv) {
      _undoStack.push(_dragSnapshot);
      if (_undoStack.length > _UNDO_MAX) _undoStack.shift();
      _redoStack.length = 0;
      _updateUndoButtons();
    }
    _dragSnapshot = null;
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (!K.state.editMode) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); editUndo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey)  { e.preventDefault(); editRedo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y')                 { e.preventDefault(); editRedo(); }
  });
}


// ── Exporta ──

K.applyBrushAt   = applyBrushAt;
K.initMapEditor  = initMapEditor;

window.toggleEditMode = toggleEditMode;
window.setBrush       = setBrush;
window.setKarelDir    = setKarelDir;
window.addRow         = addRow;
window.removeRow      = removeRow;
window.addCol         = addCol;
window.removeCol      = removeCol;
window.editUndo       = editUndo;
window.editRedo       = editRedo;
