// ════════════════════════════════════════════════════════
// karel.js — Karel en Català
//
// Arquitectura:
//  1. Constants i reptes
//  2. Estat global
//  3. Indicador d'estat d'execució
//  4. Modals i reptes
//  5. CSV: parsejat i càrrega
//  6. Helpers del món
//  7. Renderitzat + auto-escala
//  8. Log + handle de redimensió
//  9. Execució d'accions
// 10. Intèrpret (generadors JS)
// 11. Editor WYSIWYG del mapa
// 12. Control d'execució
// 13. Ressaltat sintàctic + números de línia
// 14. Tokenitzador
// 15. Parser
// 16. localStorage + dreceres de teclat
// 17. Inicialització
// ════════════════════════════════════════════════════════


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. CONSTANTS I REPTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Quatre direccions: Est, Sud, Oest, Nord
const DIRS = [
  { name: 'Est',  dx:  1, dy:  0, arrow: '→' },
  { name: 'Sud',  dx:  0, dy:  1, arrow: '↓' },
  { name: 'Oest', dx: -1, dy:  0, arrow: '←' },
  { name: 'Nord', dx:  0, dy: -1, arrow: '↑' },
];

// Ordres que Karel pot executar
const COMMANDS = new Set([
  'avança', 'gira.dreta', 'gira.esquerra', 'gira.enrere', 'agafa', 'deixa'
]);

// Condicions que es poden usar als if/mentre
const CONDS = new Set([
  'veu-paret', 'veu-lliure', 'veu-aigua',
  'motxilla-buida', 'motxilla-plena'
]);

// Paraules clau del llenguatge (per al ressaltat)
const KEYWORDS = new Set([
  'si', 'sinó', 'sino', 'mentre', 'repeteix', 'no',
  'procediment', 'i', 'o'
]);

// Etiquetes de velocitat
const SPEED_LBL = {
   50: 'ràpid ×4',
  200: 'ràpid',
  600: 'normal',
  800: 'lent',
 1000: 'molt lent'
};

// Clau del localStorage
const LS_KEY = 'karel-ca-code-v2';

// Mapa per defecte
const DEFAULT_CSV =
`K>,.,.,P,.,.
.,A,.,P,.,.
.,.,.,A,.,.
P,P,.,.,.,A
.,.,.,.,.,.`;

// ─── Reptes predefinits ────────────────────────────────
// Cada repte té: id, títol, descripció, mapa CSV,
// codi inicial per a l'alumne, i nivell de dificultat.
// ──────────────────────────────────────────────────────
const CHALLENGES = [
  {
    id: 1,
    title: 'Hola, Karel!',
    desc: 'Karel és a l\'esquerra. Fes-la avançar fins topar amb la paret del fons. Pista: usa <em>mentre</em> i la condició <em>veu-lliure</em>.',
    csv: `K>,.,.,.,.,P\n.,.,.,.,.,.\n.,.,.,.,.,.`,
    code: `// Avança fins la paret
// Pista: mentre(veu-lliure) { avança }

`,
    level: 'easy'
  },
  {
    id: 2,
    title: 'Recull una gota',
    desc: 'Hi ha una gota d\'aigua just al davant de Karel. Fes que l\'agafi. L\'ordre <em>agafa</em> pren l\'aigua que hi ha al davant.',
    csv: `K>,A,.\n.,.,.\n.,.,.`,
    code: `// Agafa la gota que hi ha al davant

`,
    level: 'easy'
  },
  {
    id: 3,
    title: 'Recull totes les gotes',
    desc: 'Hi ha diverses gotes disperses en línia recta. Karel ha de recollir-les totes mentre avança fins la paret. Combina <em>mentre</em>, <em>si</em> i <em>agafa</em>.',
    csv: `K>,A,.,A,A,.,A,P`,
    code: `// Recull totes les gotes fins arribar a la paret

`,
    level: 'easy'
  },
  {
    id: 4,
    title: 'Corre i torna',
    desc: 'Karel ha d\'arribar fins la paret i tornar al punt de partida. Pista: <em>gira.enrere</em> gira 180° en una sola instrucció!',
    csv: `K>,.,.,.,.\n.,.,.,.,.`,
    code: `// Arriba fins la paret, gira i torna

`,
    level: 'easy'
  },
  {
    id: 5,
    title: 'Condicions combinades',
    desc: 'Usa els operadors <em>i</em> i <em>o</em> per combinar condicions. Per exemple: <code>si(veu-lliure i veu-aigua)</code>. Karel ha d\'agafar les gotes NOMÉS si el camí és lliure.',
    csv: `K>,A,.,P\n.,A,.,.\n.,.,.,.`,
    code: `// Combina condicions amb 'i' i 'o'
// Exemple: si(veu-lliure i veu-aigua) { agafa }

`,
    level: 'medium'
  },
  {
    id: 6,
    title: 'Primer procediment',
    desc: 'Defineix un <em>procediment</em> anomenat <code>mig-gir</code> que giri Karel 180°. Després usa\'l per recollir gotes i tornar al punt de partida.',
    csv: `K>,A,A,A,.\n.,.,.,.,.`,
    code: `// Defineix el teu procediment aquí
procediment mig-gir {
  // Escriu les instruccions dins les claus
}

// Programa principal
`,
    level: 'medium'
  },
  {
    id: 7,
    title: 'Recull i diposita',
    desc: 'Karel ha de recollir les gotes de la primera fila i dipositar-les a la segona. Usa <em>gira.dreta</em> per baixar de fila i <em>deixa</em> per posar l\'aigua on és Karel.',
    csv: `K>,A,A,A,P\n.,.,.,.,P`,
    code: `// Pas 1: recull les gotes de la primera fila

// Pas 2: baixa i diposita-les a la fila de sota

`,
    level: 'medium'
  },
  {
    id: 8,
    title: 'Laberint',
    desc: 'Karel ha de navegar pel laberint fent servir <em>si</em> i <em>sinó</em> per decidir quan girar. Observa bé el mapa!',
    csv: `K>,.,P,.,P,.,.\n.,.,P,.,.,.,P\n.,.,.,.,.,.,.`,
    code: `// Navega el laberint
// Pista: mira en quines direccions hi ha parets

`,
    level: 'hard'
  },
  {
    id: 9,
    title: 'Serpenteja (difícil)',
    desc: 'Karel ha de recollir totes les gotes anant en ziga-zaga per les dues files. Defineix procediments per organitzar el codi en parts petites!',
    csv: `K>,A,A,A,P\nP,A,A,A,.`,
    code: `// Defineix procediments per estructurar el codi
procediment baixa-i-recull {
  // ...
}

// Programa principal

`,
    level: 'hard'
  }
];


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. ESTAT GLOBAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let world     = { grid: [], rows: 0, cols: 0 };
let worldInit = [];                              // còpia per reiniciar
let karel     = { x: 0, y: 0, dir: 0, motxilla: 0 };
let karelInit = { x: 0, y: 0, dir: 0, motxilla: 0 };
let currentCSV = DEFAULT_CSV;

// Estat d'execució
let running    = false;
let stepMode   = false;
let interpreter = null;
let tickTimer  = null;
let stepDelay  = 450;

// Mode d'edició del mapa
let editMode     = false;
let editBrush    = '.';
let editDragging = false;
let karelEditDir = 0;

// Procediments definits per l'usuari
let procs     = {};
let callDepth = 0;   // per detectar recursió excessiva


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. INDICADOR D'ESTAT D'EXECUCIÓ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setStateUI(state) {
  const dot = document.getElementById('state-dot');
  const lbl = document.getElementById('state-lbl');
  dot.className = '';

  switch (state) {
    case 'running':
      dot.className = 'running';
      lbl.textContent = 'executant';
      break;
    case 'step':
      dot.className = 'step';
      lbl.textContent = 'pas a pas';
      break;
    case 'error':
      dot.className = 'error';
      lbl.textContent = 'error';
      break;
    default:
      lbl.textContent = 'aturat';
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. MODALS I REPTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Tancar amb clic al fons fosc
document.querySelectorAll('.modal-bg').forEach(bg =>
  bg.addEventListener('click', e => {
    if (e.target === bg) bg.classList.remove('open');
  })
);

// Tancar amb Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-bg.open')
      .forEach(m => m.classList.remove('open'));
  }
});

// ── Reptes ──

function openChallenges() {
  const list = document.getElementById('challenges-list');

  list.innerHTML = CHALLENGES.map(ch => `
    <div class="ch-card" onclick="loadChallenge(${ch.id})" role="button" tabindex="0">
      <div class="ch-num">Repte ${ch.id}</div>
      <div class="ch-title">${ch.title}</div>
      <div class="ch-desc">${ch.desc}</div>
      <div><span class="ch-tag ${ch.level}">${
        ch.level === 'easy'   ? '⭐ Fàcil' :
        ch.level === 'medium' ? '⭐⭐ Mitjà' : '⭐⭐⭐ Difícil'
      }</span></div>
    </div>
  `).join('');

  openModal('modal-challenges');
}

function loadChallenge(id) {
  const ch = CHALLENGES.find(c => c.id === id);
  if (!ch) return;

  // Carrega el mapa
  loadMapFromCSV(ch.csv);

  // Carrega el codi inicial (si n'hi ha)
  if (ch.code !== undefined) {
    const ta = document.getElementById('code-editor');
    ta.value = ch.code;
    localStorage.setItem(LS_KEY, ch.code);
    updateEditor();
  }

  closeModal('modal-challenges');
  log(`🎯 Repte ${id}: ${ch.title}`, 'ok');
}

// ── Altres modals ──

function openEditModal() {
  document.getElementById('csv-input').value = currentCSV;
  openModal('modal-edit');
}

function openBlankModal() {
  openModal('modal-blank');
}

function applyCSV() {
  const csv = document.getElementById('csv-input').value.trim();
  if (!csv) return;
  currentCSV = csv;
  loadMapFromCSV(currentCSV);
  closeModal('modal-edit');
}

function applyBlank() {
  const rows = Math.max(1, Math.min(20,
    parseInt(document.getElementById('blank-rows').value) || 5));
  const cols = Math.max(1, Math.min(20,
    parseInt(document.getElementById('blank-cols').value) || 7));

  const lines = [];
  for (let r = 0; r < rows; r++) {
    const cells = Array(cols).fill('.');
    if (r === 0) cells[0] = 'K>';
    lines.push(cells.join(','));
  }
  currentCSV = lines.join('\n');
  loadMapFromCSV(currentCSV);
  closeModal('modal-blank');
}

function triggerOpenCSV() {
  document.getElementById('file-input').click();
}

function handleFileOpen(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentCSV = e.target.result.trim();
    loadMapFromCSV(currentCSV);
    log(`📂 Obert: ${file.name}`, 'ok');
  };
  reader.readAsText(file);
  evt.target.value = '';
}

function saveCSV() {
  const csv  = worldToCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'mapa-karel.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  log('💾 Mapa desat com a CSV', 'ok');
}

function worldToCSV() {
  const KARROW = ['>', 'v', '<', '^'];
  return world.grid.map((row, r) =>
    row.map((c, col) =>
      (karelInit.x === col && karelInit.y === r)
        ? 'K' + KARROW[karelInit.dir]
        : c
    ).join(',')
  ).join('\n');
}

function copyMapURL() {
  const csv  = worldToCSV();
  const base = location.href.split('?')[0];
  const url  = base + '?mapa=' + encodeURIComponent(csv);
  navigator.clipboard.writeText(url)
    .then(() => log('🔗 URL copiada al porta-retalls!', 'ok'))
    .catch(() => log('🔗 ' + url, 'ok'));
}

function toggleLight() {
  document.body.classList.toggle('light');
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. CSV: PARSEJAT I CÀRREGA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function parseCSV(csv) {
  // Ignorem línies que comencen per '//' (comentaris de reptes)
  const lines = csv.trim()
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('//'));

  const grid  = [];
  let kStart  = { x: 0, y: 0, dir: 0 };
  let foundK  = false;

  for (let row = 0; row < lines.length; row++) {
    const cells = lines[row].split(',').map(c => c.trim());
    grid.push([]);
    for (let col = 0; col < cells.length; col++) {
      const c = cells[col].toUpperCase();
      if (c.startsWith('K')) {
        grid[row].push('.');
        if (!foundK) {
          foundK = true;
          const suf = c.slice(1);
          const dir = suf === '^' ? 3 : suf === 'V' ? 1 : suf === '<' ? 2 : 0;
          kStart = { x: col, y: row, dir };
        }
      } else if (c === 'P') {
        grid[row].push('P');
      } else if (c === 'A') {
        grid[row].push('A');
      } else {
        grid[row].push('.');
      }
    }
  }

  // Normalitzem totes les files a la mateixa llargada
  const maxCols = Math.max(...grid.map(r => r.length), 1);
  for (const r of grid) while (r.length < maxCols) r.push('.');

  return { grid, rows: grid.length, cols: maxCols, kStart };
}

function loadMapFromCSV(csv) {
  const { grid, rows, cols, kStart } = parseCSV(csv);
  world     = { grid, rows, cols };
  worldInit = grid.map(r => [...r]);
  karel     = { ...kStart, motxilla: 0 };
  karelInit = { ...kStart, motxilla: 0 };
  stopProgram();
  renderWorld();
  updateStatus();
  log('Mapa carregat ✓', 'ok');
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. HELPERS DEL MÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// És paret o límit del mapa?
function isWall(x, y) {
  if (x < 0 || y < 0 || x >= world.cols || y >= world.rows) return true;
  return world.grid[y][x] === 'P';
}

function getCell(x, y) {
  if (x < 0 || y < 0 || x >= world.cols || y >= world.rows) return null;
  return world.grid[y][x];
}

function setCell(x, y, v) {
  if (y >= 0 && y < world.rows && x >= 0 && x < world.cols) {
    world.grid[y][x] = v;
  }
}

// Coordenades de la cel·la davant de Karel
function front() {
  const d = DIRS[karel.dir];
  return { x: karel.x + d.dx, y: karel.y + d.dy };
}

// Avalua una condició de l'AST
function evalCond(cond) {
  switch (cond.type) {
    case 'not': return !evalCond(cond.inner);
    case 'and': return evalCond(cond.left) && evalCond(cond.right);
    case 'or':  return evalCond(cond.left) || evalCond(cond.right);
    case 'condition': {
      const { x, y } = front();
      switch (cond.name) {
        case 'veu-paret':      return isWall(x, y);
        case 'veu-lliure':     return !isWall(x, y);
        case 'veu-aigua':      return getCell(x, y) === 'A';
        case 'motxilla-buida': return karel.motxilla === 0;
        case 'motxilla-plena': return karel.motxilla > 0;
      }
    }
  }
  return false;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. RENDERITZAT + AUTO-ESCALA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function calcCellSize() {
  const area    = document.getElementById('world-area');
  const pad     = 52;
  const statusH = 40;
  const availW  = area.clientWidth  - pad;
  const availH  = area.clientHeight - pad - statusH;
  const byW     = Math.floor((availW - (world.cols + 1) * 2) / world.cols);
  const byH     = Math.floor((availH - (world.rows + 1) * 2) / world.rows);
  return Math.max(18, Math.min(56, byW, byH));
}

function renderWorld() {
  const size = calcCellSize();
  const fs   = Math.round(size * 0.52) + 'px';
  document.documentElement.style.setProperty('--cell-size', size + 'px');

  const g = document.getElementById('world-grid');
  g.style.gridTemplateColumns = `repeat(${world.cols}, ${size}px)`;
  g.innerHTML = '';

  for (let row = 0; row < world.rows; row++) {
    for (let col = 0; col < world.cols; col++) {
      const div = document.createElement('div');
      div.className = 'cell';
      div.style.fontSize = fs;
      div.dataset.col = col;
      div.dataset.row = row;

      if (karel.x === col && karel.y === row) {
        // Cel·la on és Karel
        div.classList.add('c-k');
        div.innerHTML = `<span class="karel-i">${DIRS[karel.dir].arrow}</span>`;
      } else {
        const c = world.grid[row][col];
        if (c === 'P') {
          div.classList.add('c-p');
          div.innerHTML = `<span class="wall-i">▪</span>`;
        } else if (c === 'A') {
          div.classList.add('c-a');
          div.innerHTML = `<span class="water-i">💧</span>`;
        } else {
          div.classList.add('c-e');
        }
      }

      // Listeners d'edició (mode WYSIWYG)
      if (editMode) {
        div.addEventListener('mousedown', e => {
          e.preventDefault();
          editDragging = true;
          applyBrushAt(col, row);
        });
        div.addEventListener('mouseenter', () => {
          if (editDragging) applyBrushAt(col, row);
        });
      }

      g.appendChild(div);
    }
  }
}

function updateStatus() {
  document.getElementById('st-pos').textContent = `(${karel.x}, ${karel.y})`;
  document.getElementById('st-dir').textContent =
    `${DIRS[karel.dir].arrow} ${DIRS[karel.dir].name}`;
  document.getElementById('st-bag').textContent = karel.motxilla;
}

// Auto-escala quan canvia la mida del panell
new ResizeObserver(() => {
  if (world.rows > 0) renderWorld();
}).observe(document.getElementById('world-area'));


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. LOG + HANDLE DE REDIMENSIÓ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const logEl = document.getElementById('log');

function log(msg, type = 'dim') {
  const p = document.createElement('p');
  p.className = type;
  p.textContent = msg;
  logEl.appendChild(p);
  // Limitem a 200 entrades per evitar saturar la memòria
  while (logEl.children.length > 200) logEl.removeChild(logEl.firstChild);
  logEl.scrollTop = logEl.scrollHeight;
}

function clearLog() {
  logEl.innerHTML = '';
}

// Drag-to-resize del log
(function initLogResize() {
  const wrap   = document.getElementById('log-wrap');
  const handle = document.getElementById('log-resize');
  let startY, startH;

  handle.addEventListener('mousedown', e => {
    startY = e.clientY;
    startH = wrap.offsetHeight;
    handle.classList.add('dragging');
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    e.preventDefault();
  });

  function onMove(e) {
    const dy   = startY - e.clientY;  // arrossar amunt = més alt
    const newH = Math.max(50, Math.min(startH + dy, window.innerHeight * 0.6));
    wrap.style.height = newH + 'px';
  }

  function onUp() {
    handle.classList.remove('dragging');
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
  }
})();

// Aturem el drag del mapa quan s'aixeca el ratolí
document.addEventListener('mouseup', () => { editDragging = false; });


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. EXECUCIÓ D'ACCIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Rep un objecte {cmd, line} generat per l'intèrpret
function execAction({ cmd, line }) {
  highlightLine(line);
  const { x: fx, y: fy } = front();

  switch (cmd) {
    case 'avança':
      if (isWall(fx, fy)) {
        log(`❌ avança (línia ${line}): xoc amb la paret!`, 'err');
        markErrorLine(line);
        setStateUI('error');
        stopProgram();
        return false;
      }
      karel.x = fx;
      karel.y = fy;
      log(`avança → (${karel.x}, ${karel.y})`, 'inf');
      break;

    case 'gira.dreta':
      karel.dir = (karel.dir + 1) % 4;
      log(`gira.dreta → ${DIRS[karel.dir].arrow} ${DIRS[karel.dir].name}`, 'cmd');
      break;

    case 'gira.esquerra':
      karel.dir = (karel.dir + 3) % 4;
      log(`gira.esquerra → ${DIRS[karel.dir].arrow} ${DIRS[karel.dir].name}`, 'cmd');
      break;

    case 'gira.enrere':
      karel.dir = (karel.dir + 2) % 4;
      log(`gira.enrere → ${DIRS[karel.dir].arrow} ${DIRS[karel.dir].name}`, 'cmd');
      break;

    case 'agafa':
      // Agafa l'aigua de la cel·la que hi ha al davant
      if (getCell(fx, fy) !== 'A') {
        log(`❌ agafa (línia ${line}): no hi ha aigua al davant!`, 'err');
        markErrorLine(line);
        setStateUI('error');
        stopProgram();
        return false;
      }
      setCell(fx, fy, '.');
      karel.motxilla++;
      log(`agafa 💧 → motxilla: ${karel.motxilla}`, 'ok');
      break;

    case 'deixa':
      // Deixa l'aigua a la cel·la on és Karel
      if (karel.motxilla <= 0) {
        log(`❌ deixa (línia ${line}): la motxilla és buida!`, 'err');
        markErrorLine(line);
        setStateUI('error');
        stopProgram();
        return false;
      }
      setCell(karel.x, karel.y, 'A');
      karel.motxilla--;
      log(`deixa 💧 → motxilla: ${karel.motxilla}`, 'ok');
      break;
  }

  renderWorld();
  updateStatus();
  return true;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. INTÈRPRET (GENERADORS JS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// L'intèrpret és una funció generadora (*).
// Cada vegada que crida 'yield', cedeix el control
// al bucle principal (tick/doStep), que executa l'acció
// i torna a cridar el generador.
//
// Això permet el mode pas a pas i la velocitat variable
// sense necessitat de fils d'execució.

function* runStmts(stmts) {
  for (const s of stmts) yield* runStmt(s);
}

function* runStmt(node) {
  switch (node.type) {

    case 'command':
      // Instrucció simple: cedim l'acció amb el número de línia
      yield { cmd: node.name, line: node.line };
      break;

    case 'if':
      // si(condició) { ... } sinó { ... }
      yield* runStmts(evalCond(node.cond) ? node.then : node.else);
      break;

    case 'while': {
      // mentre(condició) { ... }
      let guard = 50_000;  // protecció contra bucles infinits
      while (evalCond(node.cond)) {
        if (--guard <= 0) {
          log('⚠ Bucle infinit detectat! (>50.000 iteracions)', 'err');
          setStateUI('error');
          return;
        }
        yield* runStmts(node.body);
      }
      break;
    }

    case 'repeat':
      // repeteix(N) { ... }
      for (let i = 0; i < node.count; i++) {
        yield* runStmts(node.body);
      }
      break;

    case 'call': {
      // Crida a un procediment definit per l'usuari
      const body = procs[node.name];
      if (!body) {
        log(`❌ '${node.name}' (línia ${node.line}): procediment no definit`, 'err');
        markErrorLine(node.line);
        setStateUI('error');
        return;
      }
      callDepth++;
      if (callDepth > 50) {
        log('⚠ Recursió massa profunda! (>50 crides encadenades)', 'err');
        setStateUI('error');
        callDepth = 0;
        return;
      }
      yield* runStmts(body);
      callDepth--;
      break;
    }

    case 'proc':
      // Definicions de procediments: ja recollides, no fem res aquí
      break;
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11. EDITOR WYSIWYG DEL MAPA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function toggleEditMode() {
  if (running) { log('Para el programa primer!', 'err'); return; }
  editMode = !editMode;
  document.body.classList.toggle('editing', editMode);

  const btn = document.getElementById('btn-edit-toggle');
  btn.textContent = editMode ? '✓ Surt de l\'editor' : '✏️ Edita';

  if (editMode) {
    stopProgram();
    karel      = { ...karelInit };
    world.grid = worldInit.map(r => [...r]);
    karelEditDir = karelInit.dir;
    updateSizeIndicators();
    setBrush('.');
  }
  renderWorld();
}

function setBrush(b) {
  editBrush = b;
  // Actualitzem l'aparença visual dels botons de pinzell
  ['dot', 'P', 'A', 'K'].forEach(id => {
    document.getElementById('brush-' + id)?.classList.remove('active');
  });
  const map = { '.': 'dot', 'P': 'P', 'A': 'A', 'K': 'K' };
  document.getElementById('brush-' + map[b])?.classList.add('active');
  // Mostrem els botons de direcció només per al pinzell de Karel
  document.getElementById('dir-section').style.display = b === 'K' ? 'block' : 'none';
  updateDirButtons();
}

function setKarelDir(d) {
  karelEditDir = d;
  karelInit    = { ...karelInit, dir: d };
  karel        = { ...karelInit };
  currentCSV   = worldToCSV();
  updateDirButtons();
  renderWorld();
}

function updateDirButtons() {
  [0, 1, 2, 3].forEach(d => {
    document.getElementById('dir-' + d)
      ?.classList.toggle('active', d === karelEditDir);
  });
}

function applyBrushAt(col, row) {
  if (col < 0 || col >= world.cols || row < 0 || row >= world.rows) return;
  let changed = false;

  if (editBrush === 'K') {
    if (karelInit.x !== col || karelInit.y !== row) {
      karelInit = { x: col, y: row, dir: karelEditDir, motxilla: 0 };
      karel     = { ...karelInit };
      changed   = true;
    }
  } else {
    // No podem sobreescriure la posició de Karel
    if (karelInit.x === col && karelInit.y === row) return;
    if (world.grid[row][col] !== editBrush) {
      world.grid[row][col] = editBrush;
      worldInit[row][col]  = editBrush;
      changed = true;
    }
  }

  if (changed) {
    currentCSV = worldToCSV();
    renderWorld();
  }
}

function updateSizeIndicators() {
  const r = document.getElementById('rval-rows');
  const c = document.getElementById('rval-cols');
  if (r) r.textContent = world.rows;
  if (c) c.textContent = world.cols;
}

function addRow() {
  if (world.rows >= 20) return;
  const newRow = Array(world.cols).fill('.');
  world.grid.push([...newRow]);
  worldInit.push([...newRow]);
  world.rows++;
  currentCSV = worldToCSV();
  updateSizeIndicators();
  renderWorld();
}

function removeRow() {
  if (world.rows <= 1) return;
  if (karelInit.y >= world.rows - 1) {
    karelInit = { ...karelInit, y: world.rows - 2 };
    karel     = { ...karelInit };
  }
  world.grid.pop();
  worldInit.pop();
  world.rows--;
  currentCSV = worldToCSV();
  updateSizeIndicators();
  renderWorld();
}

function addCol() {
  if (world.cols >= 20) return;
  world.grid.forEach((r, i) => { r.push('.'); worldInit[i].push('.'); });
  world.cols++;
  currentCSV = worldToCSV();
  updateSizeIndicators();
  renderWorld();
}

function removeCol() {
  if (world.cols <= 1) return;
  if (karelInit.x >= world.cols - 1) {
    karelInit = { ...karelInit, x: world.cols - 2 };
    karel     = { ...karelInit };
  }
  world.grid.forEach((r, i) => { r.pop(); worldInit[i].pop(); });
  world.cols--;
  currentCSV = worldToCSV();
  updateSizeIndicators();
  renderWorld();
}

// Suport tàctil per a l'edició (tablets i mòbils)
document.getElementById('world-grid').addEventListener('touchstart', e => {
  if (!editMode) return;
  e.preventDefault();
  const t   = e.touches[0];
  const el  = document.elementFromPoint(t.clientX, t.clientY);
  const cel = el?.dataset?.col !== undefined ? el : el?.closest?.('[data-col]');
  if (cel) applyBrushAt(+cel.dataset.col, +cel.dataset.row);
}, { passive: false });

document.getElementById('world-grid').addEventListener('touchmove', e => {
  if (!editMode) return;
  e.preventDefault();
  const t   = e.touches[0];
  const el  = document.elementFromPoint(t.clientX, t.clientY);
  const cel = el?.dataset?.col !== undefined ? el : el?.closest?.('[data-col]');
  if (cel) applyBrushAt(+cel.dataset.col, +cel.dataset.row);
}, { passive: false });


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12. CONTROL D'EXECUCIÓ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildInterpreter() {
  const ast = parseCode(document.getElementById('code-editor').value);
  if (!ast) return null;

  // Recopilem els procediments definits
  procs     = {};
  callDepth = 0;
  for (const node of ast) {
    if (node.type === 'proc') procs[node.name] = node.body;
  }

  // Les instruccions principals són tot el que no és una definició de proc
  const main = ast.filter(n => n.type !== 'proc');
  return runStmts(main);
}

function runProgram() {
  if (running) return;
  const gen = buildInterpreter();
  if (!gen) return;
  clearLineMarks();
  interpreter = gen;
  stepMode    = false;
  running     = true;
  setStateUI('running');
  log('▶ Executant...', 'ok');
  tick();
}

function stepProgram() {
  // Si no hi ha intèrpret actiu, en creem un de nou
  if (!running && !interpreter) {
    const gen = buildInterpreter();
    if (!gen) return;
    clearLineMarks();
    interpreter = gen;
    running     = true;
    stepMode    = true;
    setStateUI('step');
    log('⏭ Mode pas a pas', 'ok');
  }
  doStep();
}

function doStep() {
  if (!interpreter) return;
  const res = interpreter.next();
  if (res.done) {
    log('✓ Programa acabat', 'ok');
    clearLineMarks();
    running     = false;
    interpreter = null;
    setStateUI('idle');
    return;
  }
  execAction(res.value);
}

function tick() {
  if (!running || stepMode || !interpreter) return;
  const res = interpreter.next();
  if (res.done) {
    log('✓ Programa acabat', 'ok');
    clearLineMarks();
    running     = false;
    interpreter = null;
    setStateUI('idle');
    return;
  }
  const ok = execAction(res.value);
  if (ok !== false) tickTimer = setTimeout(tick, stepDelay);
}

function stopProgram() {
  const was = running || stepMode;
  running     = false;
  stepMode    = false;
  interpreter = null;
  if (tickTimer) { clearTimeout(tickTimer); tickTimer = null; }
  if (was) { clearLineMarks(); setStateUI('idle'); }
}

function resetKarel() {
  stopProgram();
  world.grid = worldInit.map(r => [...r]);
  karel      = { ...karelInit };
  clearLineMarks();
  renderWorld();
  updateStatus();
  setStateUI('idle');
  log('↺ Reiniciat', 'dim');
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 13. RESSALTAT SINTÀCTIC + NÚMEROS DE LÍNIA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Tokenitza una línia de codi i retorna HTML amb spans de color
function tokenizeLine(line) {
  let out = '', i = 0;

  while (i < line.length) {
    const c = line[i];

    if (/\s/.test(c)) {
      // Espais en blanc
      let ws = '';
      while (i < line.length && /\s/.test(line[i])) ws += line[i++];
      out += escHtml(ws);

    } else if ('{}()'.includes(c)) {
      // Claudàtors i parèntesis
      out += `<span class="hl-br">${escHtml(c)}</span>`;
      i++;

    } else if (/[0-9]/.test(c)) {
      // Números
      let n = '';
      while (i < line.length && /[0-9]/.test(line[i])) n += line[i++];
      out += `<span class="hl-num">${n}</span>`;

    } else {
      // Paraules (identificadors, ordres, condicions, paraules clau)
      let w = '';
      while (i < line.length && !/[\s{}()\/]/.test(line[i])) w += line[i++];

      if (KEYWORDS.has(w)) {
        out += `<span class="hl-kw">${escHtml(w)}</span>`;
      } else if (COMMANDS.has(w)) {
        out += `<span class="hl-cmd">${escHtml(w)}</span>`;
      } else if (CONDS.has(w)) {
        out += `<span class="hl-cond">${escHtml(w)}</span>`;
      } else {
        // Nom definit per l'usuari (procediment)
        out += `<span class="hl-user">${escHtml(w)}</span>`;
      }
    }
  }

  return out;
}

// Ressalta tot el codi i embolicem cada línia en un <span>
// per poder-la marcar durant l'execució
function highlightCode(code) {
  return code.split('\n').map((line, i) => {
    const ln = i + 1;
    const ci = line.indexOf('//');
    let content;

    if (ci !== -1) {
      content = tokenizeLine(line.slice(0, ci)) +
        `<span class="hl-cm">${escHtml(line.slice(ci))}</span>`;
    } else {
      content = tokenizeLine(line);
    }

    return `<span class="code-line" id="cln-${ln}">${content}</span>`;
  }).join('\n');
}

// Il·lumina la línia activa durant l'execució
function highlightLine(n) {
  document.querySelectorAll('.code-line.active')
    .forEach(el => el.classList.remove('active'));
  if (n) {
    document.getElementById('cln-' + n)?.classList.add('active');
  }
}

// Marca una línia d'error en vermell
function markErrorLine(n) {
  if (n) {
    document.getElementById('cln-' + n)?.classList.add('error');
  }
}

// Neteja tots els marcadors de línia
function clearLineMarks() {
  document.querySelectorAll('.code-line.active, .code-line.error')
    .forEach(el => el.classList.remove('active', 'error'));
}

// Actualitza l'overlay de ressaltat i els números de línia
function updateEditor() {
  const ta   = document.getElementById('code-editor');
  const hl   = document.getElementById('code-highlight');
  const ln   = document.getElementById('line-numbers');
  const code = ta.value;

  hl.innerHTML   = highlightCode(code) + '\n';
  hl.scrollTop   = ta.scrollTop;
  ln.innerHTML   = code.split('\n').map((_, i) => `<div>${i + 1}</div>`).join('');
  ln.scrollTop   = ta.scrollTop;
}

// (Els listeners del code-editor s'inicialitzen condicionalment a la secció 16)


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 14. TOKENITZADOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Converteix una cadena de codi en una llista de tokens.
// Cada token té: t (tipus), v (valor) i line (número de línia).
//
// Tipus:  'W' = paraula/identificador
//         'N' = número enter
//         '{' '}' '(' ')' = símbols
//         'EOF' = fi de fitxer

function tokenize(code) {
  const toks = [];
  let i    = 0;
  let line = 1;

  while (i < code.length) {
    const c = code[i];

    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }

    // Comentari de línia: ignorem fins al final
    if (c === '/' && code[i + 1] === '/') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }

    if ('{}()'.includes(c)) {
      toks.push({ t: c, line });
      i++;
      continue;
    }

    if (/[0-9]/.test(c)) {
      let n = '';
      const tl = line;
      while (i < code.length && /[0-9]/.test(code[i])) n += code[i++];
      toks.push({ t: 'N', v: parseInt(n), line: tl });
      continue;
    }

    if (!/[\s{}()\/]/.test(c)) {
      let w  = '';
      const tl = line;
      while (i < code.length && !/[\s{}()\/]/.test(code[i])) w += code[i++];
      toks.push({ t: 'W', v: w, line: tl });
      continue;
    }

    i++;
  }

  toks.push({ t: 'EOF', line });
  return toks;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 15. PARSER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Converteix la llista de tokens en un AST
// (Abstract Syntax Tree — arbre sintàctic abstracte).
//
// Gramàtica del llenguatge:
//
//   programa   → sentència*
//   sentència  → ordre | si | mentre | repeteix | procediment | crida
//   si         → 'si' '(' condició ')' bloc ['sinó' bloc]
//   mentre     → 'mentre' '(' condició ')' bloc
//   repeteix   → 'repeteix' '(' N ')' bloc
//   procediment→ 'procediment' NOM bloc
//   crida      → NOM   (nom d'un procediment)
//   bloc       → '{' sentència* '}'
//   condició   → o-cond
//   o-cond     → i-cond ('o' i-cond)*
//   i-cond     → no-cond ('i' no-cond)*
//   no-cond    → 'no' '(' condició ')' | àtom-cond
//   àtom-cond  → CONDICIÓ

class Parser {
  constructor(toks) {
    this.toks = toks;
    this.i    = 0;
  }

  peek() { return this.toks[this.i]; }
  next() { return this.toks[this.i++]; }

  eat(t, v) {
    const tok = this.peek();
    if (tok.t !== t || (v !== undefined && tok.v !== v)) {
      throw new Error(
        `S'esperava '${v ?? t}' a la línia ${tok.line}, però s'ha trobat '${tok.v ?? tok.t}'`
      );
    }
    return this.next();
  }

  parseAll() {
    const stmts = [];
    while (this.peek().t !== 'EOF') {
      stmts.push(this.parseStmt());
    }
    return stmts;
  }

  parseStmt() {
    const tok  = this.peek();
    const line = tok.line;

    if (tok.t !== 'W') {
      throw new Error(`Instrucció inesperada a la línia ${line}: '${tok.v ?? tok.t}'`);
    }

    const w = tok.v;

    // ── Ordres predefinides ──
    if (COMMANDS.has(w)) {
      this.next();
      return { type: 'command', name: w, line };
    }

    // ── si(condició) { } [sinó { }] ──
    if (w === 'si') {
      this.next();
      this.eat('(');
      const cond  = this.parseCond();
      this.eat(')');
      const thenB = this.parseBlock();
      let   elseB = [];
      const nxt   = this.peek();
      if (nxt.t === 'W' && (nxt.v === 'sinó' || nxt.v === 'sino')) {
        this.next();
        elseB = this.parseBlock();
      }
      return { type: 'if', cond, then: thenB, else: elseB, line };
    }

    // ── mentre(condició) { } ──
    if (w === 'mentre') {
      this.next();
      this.eat('(');
      const cond = this.parseCond();
      this.eat(')');
      return { type: 'while', cond, body: this.parseBlock(), line };
    }

    // ── repeteix(N) { } ──
    if (w === 'repeteix') {
      this.next();
      this.eat('(');
      const num = this.eat('N');
      this.eat(')');
      return { type: 'repeat', count: num.v, body: this.parseBlock(), line };
    }

    // ── procediment nom { } ──
    if (w === 'procediment') {
      this.next();
      const nameTok = this.peek();
      if (nameTok.t !== 'W') {
        throw new Error(`S'esperava el nom del procediment a la línia ${nameTok.line}`);
      }
      const name = nameTok.v;
      this.next();
      const body = this.parseBlock();
      return { type: 'proc', name, body, line };
    }

    // ── Crida a procediment (qualsevol altre identificador) ──
    this.next();
    return { type: 'call', name: w, line };
  }

  parseBlock() {
    this.eat('{');
    const stmts = [];
    while (this.peek().t !== '}' && this.peek().t !== 'EOF') {
      stmts.push(this.parseStmt());
    }
    this.eat('}');
    return stmts;
  }

  // ── Condicions amb operadors 'o' i 'i' ──

  parseCond() {
    return this.parseOrCond();
  }

  parseOrCond() {
    let left = this.parseAndCond();
    while (this.peek().t === 'W' && this.peek().v === 'o') {
      const line = this.peek().line;
      this.next();
      const right = this.parseAndCond();
      left = { type: 'or', left, right, line };
    }
    return left;
  }

  parseAndCond() {
    let left = this.parseNotCond();
    while (this.peek().t === 'W' && this.peek().v === 'i') {
      const line = this.peek().line;
      this.next();
      const right = this.parseNotCond();
      left = { type: 'and', left, right, line };
    }
    return left;
  }

  parseNotCond() {
    const tok = this.peek();
    if (tok.t === 'W' && tok.v === 'no') {
      const line = tok.line;
      this.next();
      this.eat('(');
      const inner = this.parseCond();
      this.eat(')');
      return { type: 'not', inner, line };
    }
    return this.parseAtomCond();
  }

  parseAtomCond() {
    const tok  = this.peek();
    const line = tok.line;
    if (tok.t === 'W' && CONDS.has(tok.v)) {
      this.next();
      return { type: 'condition', name: tok.v, line };
    }
    throw new Error(
      `Condició desconeguda a la línia ${line}: '${tok.v ?? tok.t}'.\n` +
      `Condicions vàlides: ${[...CONDS].join(', ')}`
    );
  }
}

// Parseja el codi i retorna l'AST, o null si hi ha errors
function parseCode(code) {
  try {
    return new Parser(tokenize(code)).parseAll();
  } catch (e) {
    // Extraiem el número de línia del missatge d'error si és possible
    const lineMatch = e.message.match(/línia (\d+)/);
    const lineNum   = lineMatch ? parseInt(lineMatch[1]) : null;
    log(`❌ Error de sintaxi: ${e.message}`, 'err');
    if (lineNum) markErrorLine(lineNum);
    setStateUI('error');
    return null;
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 16. LOCALSTORAGE + DRECERES DE TECLAT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Nota: tot aquest bloc és específic de l'editor de codi (index.html).
// Les funcions s'inicialitzen condicionalment perquè
// edit-mapa.html també carrega aquest fitxer sense tenir
// els elements #code-editor ni #speed.

const codeTA = document.getElementById('code-editor');

if (codeTA) {
  // Restaurem el codi desat quan l'alumne torna a obrir la pàgina
  const saved = localStorage.getItem(LS_KEY);
  if (saved) codeTA.value = saved;

  codeTA.addEventListener('input', () => {
    updateEditor();
    localStorage.setItem(LS_KEY, codeTA.value);
  });

  codeTA.addEventListener('scroll', () => {
    document.getElementById('code-highlight').scrollTop = codeTA.scrollTop;
    document.getElementById('line-numbers').scrollTop   = codeTA.scrollTop;
  });

  // Tab → 2 espais (en lloc de canviar el focus)
  codeTA.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = codeTA.selectionStart;
      const end = codeTA.selectionEnd;
      codeTA.value = codeTA.value.slice(0, s) + '  ' + codeTA.value.slice(end);
      codeTA.selectionStart = codeTA.selectionEnd = s + 2;
      updateEditor();
    }
  });
}

// Dreceres de teclat (F5 / F10 / F8) — només a l'editor de codi
if (codeTA) {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'TEXTAREA' || tag === 'INPUT') return;
    if (e.key === 'F5')  { e.preventDefault(); runProgram(); }
    if (e.key === 'F10') { e.preventDefault(); stepProgram(); }
    if (e.key === 'F8')  { e.preventDefault(); stopProgram(); }
  });
}

// Control de velocitat (slider) — només a index.html
const speedSlider = document.getElementById('speed');
if (speedSlider) {
  speedSlider.addEventListener('input', function () {
    const v       = parseInt(this.value);
    stepDelay     = Math.round(1050 - v);
    const closest = Object.keys(SPEED_LBL).reduce((a, b) =>
      Math.abs(b - v) < Math.abs(a - v) ? b : a
    );
    document.getElementById('speed-lbl').textContent = SPEED_LBL[closest];
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 17. INICIALITZACIÓ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Carreguem el mapa: des de la URL (?mapa=...) o el mapa per defecte
const _urlMapa = new URLSearchParams(window.location.search).get('mapa');
loadMapFromCSV(_urlMapa ?? DEFAULT_CSV);

// Inicialitzem l'editor de codi (només si existeix a la pàgina)
if (codeTA) updateEditor();
