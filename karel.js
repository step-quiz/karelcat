// ════════════════════════════════════════════════════════
// karel.js — Karel (multiidioma: CAT / CAST / ENG)
// ════════════════════════════════════════════════════════

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. TRADUCCIONS (I18N)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const I18N = {

  /* ── CATALÀ ── */
  ca: {
    ui: {
      challenges: '🎯 Reptes',
      challenges_title: '🎯 Reptes — tria un exercici per començar',
      toggle_theme: 'Fosc / Clar',
      run: '▶ Executa', step: '⏭ Pas', stop: '■ Para',
      reset: '↺ Reinicia', clear_log: '⌫ Log',
      speed: 'Velocitat:', bag: 'Motxilla:', close: 'Tanca',
      level_easy: '⭐ Fàcil', level_medium: '⭐⭐ Mitjà', level_hard: '⭐⭐⭐ Difícil',
      lbl_codelang: 'Codi:', lbl_userlang: 'Idioma:',
    },
    state: { idle: 'aturat', running: 'executant', step: 'pas a pas', error: 'error' },
    speed: ['Molt lent','Lent','Normal','Ràpid','Molt ràpid','Màxim'],
    log: {
      running: '▶ Executant...', step_mode: '⏭ Mode pas a pas',
      done: '✓ Programa acabat', reset: '↺ Reiniciat',
      map_loaded: 'Mapa carregat ✓', stop_first: 'Para el programa primer!',
      line: 'línia', inf_loop: '⚠ Bucle infinit detectat! (>50.000 iteracions)',
      deep_rec: '⚠ Recursió massa profunda! (>50 crides)', challenge: '🎯 Repte',
    },
    err: {
      wall:      'xoc amb la paret',
      no_water:  'no hi ha aigua al davant',
      bag_empty: 'la motxilla és buida',
      proc_undef:'procediment no definit',
      syntax:    'Error de sintaxi',
    },
    tokens: {
      commands:  ['avança','gira.dreta','gira.esquerra','gira.enrere','agafa','deixa'],
      conditions:['veu-paret','veu-lliure','veu-aigua','motxilla-buida','motxilla-plena'],
      keywords:  ['si','sinó','sino','mentre','repeteix','no','procediment','i','o'],
      if_kw: 'si', while_kw: 'mentre', repeat_kw: 'repeteix',
      else_kw: ['sinó','sino'], proc_kw: 'procediment',
      not_kw: 'no', and_kw: 'i', or_kw: 'o',
    },
    challenges: [
      { id:1, title:'Hola, Karel!', level:'easy',
        desc:"Karel és a l'esquerra. Fes-la avançar fins topar amb la paret del fons. Pista: usa <em>mentre</em> i la condició <em>veu-lliure</em>.",
        csv:'K>,.,.,.,.,P\n.,.,.,.,.,.\n.,.,.,.,.,.',
        code:'// Avança fins la paret\n// Pista: mentre(veu-lliure) { avança }\n\n' },
      { id:2, title:'Recull una gota', level:'easy',
        desc:"Hi ha una gota d'aigua just al davant de Karel. Fes que l'agafi. L'ordre <em>agafa</em> pren l'aigua que hi ha al davant.",
        csv:'K>,A,.\n.,.,.\n.,.,.',
        code:'// Agafa la gota que hi ha al davant\n\n' },
      { id:3, title:'Recull totes les gotes', level:'easy',
        desc:"Hi ha diverses gotes disperses en línia recta. Karel ha de recollir-les totes mentre avança fins la paret. Combina <em>mentre</em>, <em>si</em> i <em>agafa</em>.",
        csv:'K>,A,.,A,A,.,A,P',
        code:'// Recull totes les gotes fins arribar a la paret\n\n' },
      { id:4, title:'Corre i torna', level:'easy',
        desc:"Karel ha d'arribar fins la paret i tornar al punt de partida. Pista: <em>gira.enrere</em> gira 180° en una sola instrucció!",
        csv:'K>,.,.,.,.\n.,.,.,.,.',
        code:'// Arriba fins la paret, gira i torna\n\n' },
      { id:5, title:'Condicions combinades', level:'medium',
        desc:"Usa els operadors <em>i</em> i <em>o</em> per combinar condicions. Per exemple: <code>si(veu-lliure i veu-aigua)</code>. Karel ha d'agafar les gotes NOMÉS si el camí és lliure.",
        csv:'K>,A,.,P\n.,A,.,.\n.,.,.,.',
        code:'// Combina condicions amb \'i\' i \'o\'\n// Exemple: si(veu-lliure i veu-aigua) { agafa }\n\n' },
      { id:6, title:'Primer procediment', level:'medium',
        desc:"Defineix un <em>procediment</em> anomenat <code>mig-gir</code> que giri Karel 180°. Després usa'l per recollir gotes i tornar al punt de partida.",
        csv:'K>,A,A,A,.\n.,.,.,.,.',
        code:'procediment mig-gir {\n  // Escriu les instruccions aquí\n}\n\n// Programa principal\n\n' },
      { id:7, title:'Recull i diposita', level:'medium',
        desc:"Karel ha de recollir les gotes de la primera fila i dipositar-les a la segona. Usa <em>gira.dreta</em> per baixar de fila i <em>deixa</em> per posar l'aigua on és Karel.",
        csv:'K>,A,A,A,P\n.,.,.,.,P',
        code:'// Pas 1: recull les gotes\n\n// Pas 2: baixa i diposita-les\n\n' },
      { id:8, title:'Laberint', level:'hard',
        desc:"Karel ha de navegar pel laberint fent servir <em>si</em> i <em>sinó</em> per decidir quan girar. Observa bé el mapa!",
        csv:'K>,.,P,.,P,.,.\n.,.,P,.,.,.,P\n.,.,.,.,.,.,.',
        code:'// Navega el laberint\n// Pista: comprova en quines direccions hi ha parets\n\n' },
      { id:9, title:'Serpenteja (difícil)', level:'hard',
        desc:"Karel ha de recollir totes les gotes anant en ziga-zaga per les dues files. Defineix procediments per organitzar el codi!",
        csv:'K>,A,A,A,P\nP,A,A,A,.',
        code:'procediment baixa-i-recull {\n  // ...\n}\n\n// Programa principal\n\n' },
    ],
  },

  /* ── CASTELLÀ ── */
  es: {
    ui: {
      challenges: '🎯 Retos',
      challenges_title: '🎯 Retos — elige un ejercicio para comenzar',
      toggle_theme: 'Oscuro / Claro',
      run: '▶ Ejecuta', step: '⏭ Paso', stop: '■ Para',
      reset: '↺ Reinicia', clear_log: '⌫ Log',
      speed: 'Velocidad:', bag: 'Mochila:', close: 'Cerrar',
      level_easy: '⭐ Fácil', level_medium: '⭐⭐ Medio', level_hard: '⭐⭐⭐ Difícil',
      lbl_codelang: 'Código:', lbl_userlang: 'Idioma:',
    },
    state: { idle: 'detenido', running: 'ejecutando', step: 'paso a paso', error: 'error' },
    speed: ['Muy lento','Lento','Normal','Rápido','Muy rápido','Máximo'],
    log: {
      running: '▶ Ejecutando...', step_mode: '⏭ Modo paso a paso',
      done: '✓ Programa terminado', reset: '↺ Reiniciado',
      map_loaded: 'Mapa cargado ✓', stop_first: '¡Para el programa primero!',
      line: 'línea', inf_loop: '⚠ ¡Bucle infinito detectado! (>50.000 iteraciones)',
      deep_rec: '⚠ ¡Recursión demasiado profunda! (>50 llamadas)', challenge: '🎯 Reto',
    },
    err: {
      wall:      'choque con la pared',
      no_water:  'no hay agua delante',
      bag_empty: 'la mochila está vacía',
      proc_undef:'procedimiento no definido',
      syntax:    'Error de sintaxis',
    },
    tokens: {
      commands:  ['avanza','gira.derecha','gira.izquierda','gira.atrás','coge','suelta'],
      conditions:['hay-pared','hay-camino','hay-agua','mochila-vacía','mochila-llena'],
      keywords:  ['si','sino','mientras','repite','no','procedimiento','y','o'],
      if_kw: 'si', while_kw: 'mientras', repeat_kw: 'repite',
      else_kw: ['sino'], proc_kw: 'procedimiento',
      not_kw: 'no', and_kw: 'y', or_kw: 'o',
    },
    challenges: [
      { id:1, title:'¡Hola, Karel!', level:'easy',
        desc:"Karel está a la izquierda. Hazla avanzar hasta topar con la pared del fondo. Pista: usa <em>mientras</em> y la condición <em>hay-camino</em>.",
        csv:'K>,.,.,.,.,P\n.,.,.,.,.,.\n.,.,.,.,.,.',
        code:'// Avanza hasta la pared\n// Pista: mientras(hay-camino) { avanza }\n\n' },
      { id:2, title:'Recoge una gota', level:'easy',
        desc:"Hay una gota de agua justo delante de Karel. Haz que la recoja. La orden <em>coge</em> toma el agua que hay delante.",
        csv:'K>,A,.\n.,.,.\n.,.,.',
        code:'// Recoge la gota que hay delante\n\n' },
      { id:3, title:'Recoge todas las gotas', level:'easy',
        desc:"Hay varias gotas dispersas en línea recta. Karel debe recogerlas todas mientras avanza hasta la pared. Combina <em>mientras</em>, <em>si</em> y <em>coge</em>.",
        csv:'K>,A,.,A,A,.,A,P',
        code:'// Recoge todas las gotas hasta llegar a la pared\n\n' },
      { id:4, title:'Corre y vuelve', level:'easy',
        desc:"Karel debe llegar hasta la pared y volver al punto de partida. Pista: <em>gira.atrás</em> gira 180° en una sola instrucción!",
        csv:'K>,.,.,.,.\n.,.,.,.,.',
        code:'// Llega hasta la pared, gira y vuelve\n\n' },
      { id:5, title:'Condiciones combinadas', level:'medium',
        desc:"Usa los operadores <em>y</em> y <em>o</em> para combinar condiciones. Por ejemplo: <code>si(hay-camino y hay-agua)</code>. Karel debe coger las gotas SOLO si el camino es libre.",
        csv:'K>,A,.,P\n.,A,.,.\n.,.,.,.',
        code:'// Combina condiciones con \'y\' y \'o\'\n// Ejemplo: si(hay-camino y hay-agua) { coge }\n\n' },
      { id:6, title:'Primer procedimiento', level:'medium',
        desc:"Define un <em>procedimiento</em> llamado <code>medio-giro</code> que gire Karel 180°. Luego úsalo para recoger gotas y volver al punto de partida.",
        csv:'K>,A,A,A,.\n.,.,.,.,.',
        code:'procedimiento medio-giro {\n  // Escribe las instrucciones aquí\n}\n\n// Programa principal\n\n' },
      { id:7, title:'Recoge y deposita', level:'medium',
        desc:"Karel debe recoger las gotas de la primera fila y depositarlas en la segunda. Usa <em>gira.derecha</em> para bajar de fila y <em>suelta</em> para poner el agua donde está Karel.",
        csv:'K>,A,A,A,P\n.,.,.,.,P',
        code:'// Paso 1: recoge las gotas\n\n// Paso 2: baja y deposítalas\n\n' },
      { id:8, title:'Laberinto', level:'hard',
        desc:"Karel debe navegar por el laberinto usando <em>si</em> y <em>sino</em> para decidir cuándo girar. ¡Observa bien el mapa!",
        csv:'K>,.,P,.,P,.,.\n.,.,P,.,.,.,P\n.,.,.,.,.,.,.',
        code:'// Navega el laberinto\n// Pista: comprueba en qué direcciones hay paredes\n\n' },
      { id:9, title:'Serpentea (difícil)', level:'hard',
        desc:"Karel debe recoger todas las gotas en zigzag por las dos filas. ¡Define procedimientos para organizar el código!",
        csv:'K>,A,A,A,P\nP,A,A,A,.',
        code:'procedimiento baja-y-recoge {\n  // ...\n}\n\n// Programa principal\n\n' },
    ],
  },

  /* ── ANGLÈS ── */
  en: {
    ui: {
      challenges: '🎯 Challenges',
      challenges_title: '🎯 Challenges — pick an exercise to start',
      toggle_theme: 'Dark / Light',
      run: '▶ Run', step: '⏭ Step', stop: '■ Stop',
      reset: '↺ Reset', clear_log: '⌫ Log',
      speed: 'Speed:', bag: 'Bag:', close: 'Close',
      level_easy: '⭐ Easy', level_medium: '⭐⭐ Medium', level_hard: '⭐⭐⭐ Hard',
      lbl_codelang: 'Code:', lbl_userlang: 'Language:',
    },
    state: { idle: 'stopped', running: 'running', step: 'step mode', error: 'error' },
    speed: ['Very slow','Slow','Normal','Fast','Very fast','Maximum'],
    log: {
      running: '▶ Running...', step_mode: '⏭ Step mode',
      done: '✓ Program done', reset: '↺ Reset',
      map_loaded: 'Map loaded ✓', stop_first: 'Stop the program first!',
      line: 'line', inf_loop: '⚠ Infinite loop detected! (>50,000 iterations)',
      deep_rec: '⚠ Recursion too deep! (>50 nested calls)', challenge: '🎯 Challenge',
    },
    err: {
      wall:      'hit a wall',
      no_water:  'no water in front',
      bag_empty: 'bag is empty',
      proc_undef:'procedure not defined',
      syntax:    'Syntax error',
    },
    tokens: {
      commands:  ['move','turn.right','turn.left','turn.around','grab','drop'],
      conditions:['wall-ahead','path-clear','water-ahead','bag-empty','bag-full'],
      keywords:  ['if','else','while','repeat','not','procedure','and','or'],
      if_kw: 'if', while_kw: 'while', repeat_kw: 'repeat',
      else_kw: ['else'], proc_kw: 'procedure',
      not_kw: 'not', and_kw: 'and', or_kw: 'or',
    },
    challenges: [
      { id:1, title:'Hello, Karel!', level:'easy',
        desc:"Karel is on the left. Make it move until it hits the end wall. Hint: use <em>while</em> and the condition <em>path-clear</em>.",
        csv:'K>,.,.,.,.,P\n.,.,.,.,.,.\n.,.,.,.,.,.',
        code:'// Move until the wall\n// Hint: while(path-clear) { move }\n\n' },
      { id:2, title:'Grab a drop', level:'easy',
        desc:"There is a water drop right in front of Karel. Make it grab it. The <em>grab</em> command picks up the water in front of Karel.",
        csv:'K>,A,.\n.,.,.\n.,.,.',
        code:'// Grab the drop in front\n\n' },
      { id:3, title:'Grab all drops', level:'easy',
        desc:"There are several drops scattered in a straight line. Karel must grab them all while moving to the wall. Combine <em>while</em>, <em>if</em> and <em>grab</em>.",
        csv:'K>,A,.,A,A,.,A,P',
        code:'// Grab all drops until reaching the wall\n\n' },
      { id:4, title:'Run and return', level:'easy',
        desc:"Karel must reach the wall and come back to the start. Hint: <em>turn.around</em> rotates 180° in a single command!",
        csv:'K>,.,.,.,.\n.,.,.,.,.',
        code:'// Reach the wall, turn around and come back\n\n' },
      { id:5, title:'Combined conditions', level:'medium',
        desc:"Use the <em>and</em> and <em>or</em> operators to combine conditions. For example: <code>if(path-clear and water-ahead)</code>. Karel must grab drops ONLY if the path is clear.",
        csv:'K>,A,.,P\n.,A,.,.\n.,.,.,.',
        code:'// Combine conditions with \'and\' and \'or\'\n// Example: if(path-clear and water-ahead) { grab }\n\n' },
      { id:6, title:'First procedure', level:'medium',
        desc:"Define a <em>procedure</em> called <code>half-turn</code> that rotates Karel 180°. Then use it to grab drops and return to the starting point.",
        csv:'K>,A,A,A,.\n.,.,.,.,.',
        code:'procedure half-turn {\n  // Write instructions here\n}\n\n// Main program\n\n' },
      { id:7, title:'Grab and drop', level:'medium',
        desc:"Karel must grab the drops from the first row and drop them in the second. Use <em>turn.right</em> to go down a row and <em>drop</em> to place the water where Karel is.",
        csv:'K>,A,A,A,P\n.,.,.,.,P',
        code:'// Step 1: grab drops from the first row\n\n// Step 2: go down and drop them\n\n' },
      { id:8, title:'Maze', level:'hard',
        desc:"Karel must navigate the maze using <em>if</em> and <em>else</em> to decide when to turn. Look carefully at the map!",
        csv:'K>,.,P,.,P,.,.\n.,.,P,.,.,.,P\n.,.,.,.,.,.,.',
        code:'// Navigate the maze\n// Hint: check which directions have walls\n\n' },
      { id:9, title:'Zigzag (hard)', level:'hard',
        desc:"Karel must grab all drops in a zigzag pattern through both rows. Define procedures to organize the code into small parts!",
        csv:'K>,A,A,A,P\nP,A,A,A,.',
        code:'procedure go-down-grab {\n  // ...\n}\n\n// Main program\n\n' },
    ],
  },
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. SISTEMA D'IDIOMA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─────────────────────────────────────────────────────
// DOS EIXOS D'IDIOMA INDEPENDENTS:
//
//  currentCodeLang → les paraules que el parser entén
//                    (mentre/mientras/while, si/if, ...)
//                    Canvia quan l'alumne o la URL ho demana.
//                    Es desa a localStorage 'karel-codelang'.
//
//  currentUserLang → la llengua de la interfície
//                    (botons, errors, log, reptes)
//                    Es desa a localStorage 'karel-userlang'.
//
//  URL: ?codelang=en&userlang=ca
//       → codi en anglès, interfície en català
// ─────────────────────────────────────────────────────

// Normalitza els valors de la URL ('eng'→'en', 'cat'→'ca', 'cast'→'es')
function normalizeLang(raw) {
  if (!raw) return null;
  const map = { cat:'ca', cast:'es', eng:'en', ca:'ca', es:'es', en:'en' };
  return map[raw.toLowerCase()] ?? null;
}

// Llegim els params de la URL (prioritat màxima)
const _urlParams   = new URLSearchParams(window.location.search);
const _urlCodeLang = normalizeLang(_urlParams.get('codelang'));
const _urlUserLang = normalizeLang(_urlParams.get('userlang'));

let currentCodeLang = _urlCodeLang
  || localStorage.getItem('karel-codelang')
  || 'ca';

let currentUserLang = _urlUserLang
  || localStorage.getItem('karel-userlang')
  || 'ca';

let currentState = 'idle';

// t(key) → string de la INTERFÍCIE (usa currentUserLang)
function t(key) {
  const parts = key.split('.');
  let obj = I18N[currentUserLang];
  for (const k of parts) { obj = obj?.[k]; }
  return (obj !== undefined && obj !== null) ? String(obj) : key;
}

// Velocitats: índex 0-5 (slider 1-6), dreta = ràpid
const SPEED_DELAYS = [2000, 800, 350, 150, 60, 10];

// Tokens dinàmics del parser (usa currentCodeLang)
let COMMANDS   = new Set();
let CONDS      = new Set();
let KEYWORDS   = new Set();
let KW_IF, KW_WHILE, KW_REPEAT, KW_ELSE_ALIASES, KW_PROC, KW_NOT, KW_AND, KW_OR;
let CMD_TO_ACTION  = {};
let COND_TO_ACTION = {};

const CMD_ACTIONS  = ['move','turn-right','turn-left','turn-around','grab','drop'];
const COND_ACTIONS = ['wall-ahead','free-ahead','water-ahead','bag-empty','bag-full'];

// Aplica el llenguatge de programació (tokens del parser)
function applyCodeLang(lang) {
  const tk = I18N[lang].tokens;
  COMMANDS  = new Set(tk.commands);
  CONDS     = new Set(tk.conditions);
  KEYWORDS  = new Set(tk.keywords);
  KW_IF           = tk.if_kw;
  KW_WHILE        = tk.while_kw;
  KW_REPEAT       = tk.repeat_kw;
  KW_ELSE_ALIASES = tk.else_kw;
  KW_PROC         = tk.proc_kw;
  KW_NOT          = tk.not_kw;
  KW_AND          = tk.and_kw;
  KW_OR           = tk.or_kw;
  CMD_TO_ACTION   = {};
  COND_TO_ACTION  = {};
  tk.commands.forEach((c, i)  => CMD_TO_ACTION[c]  = CMD_ACTIONS[i]);
  tk.conditions.forEach((c,i) => COND_TO_ACTION[c] = COND_ACTIONS[i]);
}

// Codi d'exemple per a cada codelang (per omplir l'editor en canviar)
const DEFAULT_CODE = {
  ca: `// Karel recull totes les aigües
// que troba en línia recta fins la paret

mentre(veu-lliure) {
  si(veu-aigua) {
    agafa
  }
  avança
}

// Gira i deixa les aigües recollides
gira.esquerra
repeteix(3) {
  si(no(veu-paret)) {
    deixa
    avança
  }
}`,
  es: `// Karel recoge todas las gotas
// que encuentra en línea recta hasta la pared

mientras(hay-camino) {
  si(hay-agua) {
    coge
  }
  avanza
}

// Gira y suelta las gotas recogidas
gira.izquierda
repite(3) {
  si(no(hay-pared)) {
    suelta
    avanza
  }
}`,
  en: `// Karel grabs all water drops
// it finds in a straight line until the wall

while(path-clear) {
  if(water-ahead) {
    grab
  }
  move
}

// Turn and drop the collected drops
turn.left
repeat(3) {
  if(not(wall-ahead)) {
    drop
    move
  }
}`,
};

// ── Canvia el LLENGUATGE DE PROGRAMACIÓ ──
function setCodeLang(lang) {
  if (!I18N[lang]) return;
  currentCodeLang = lang;
  localStorage.setItem('karel-codelang', lang);
  applyCodeLang(lang);
  stopProgram();
  // Substituïm el codi de l'editor pel codi d'exemple del nou llenguatge
  const ta = document.getElementById('code-editor');
  if (ta) {
    ta.value = DEFAULT_CODE[lang] || DEFAULT_CODE.ca;
    localStorage.setItem(LS_KEY_CODE, ta.value);
    updateEditor();
  }
  updateLangButtons();
}

// ── Canvia l'IDIOMA DE LA INTERFÍCIE ──
function setUserLang(lang) {
  if (!I18N[lang]) return;
  currentUserLang = lang;
  localStorage.setItem('karel-userlang', lang);
  updateUI();
}

// Actualitza tots els textos de la interfície (usa currentUserLang via t())
function updateUI() {
  // Header
  const btnCh = document.getElementById('btn-challenges');
  if (btnCh) btnCh.textContent = t('ui.challenges');
  const btnTheme = document.getElementById('btn-theme');
  if (btnTheme) btnTheme.textContent = t('ui.toggle_theme');
  // Etiquetes dels dos selectors
  const lblCode = document.getElementById('lbl-codelang');
  if (lblCode) lblCode.textContent = t('ui.lbl_codelang');
  const lblUser = document.getElementById('lbl-userlang');
  if (lblUser) lblUser.textContent = t('ui.lbl_userlang');
  // Modal
  const mct = document.getElementById('modal-challenges-title');
  if (mct) mct.textContent = t('ui.challenges_title');
  // Botons de control
  const ids = {
    'btn-run':        'ui.run',
    'btn-step':       'ui.step',
    'btn-stop':       'ui.stop',
    'btn-reset':      'ui.reset',
    'btn-clear':      'ui.clear_log',
    'btn-modal-close':'ui.close',
  };
  for (const [id, key] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  }
  // Etiquetes
  const lblBag   = document.getElementById('lbl-bag');
  if (lblBag)   lblBag.textContent   = t('ui.bag');
  const lblSpeed = document.getElementById('lbl-speed');
  if (lblSpeed) lblSpeed.textContent = t('ui.speed');
  const spd = document.getElementById('speed');
  const lbl = document.getElementById('speed-lbl');
  if (spd && lbl) lbl.textContent = spd.value;
  // Indicador d'estat
  setStateUI(currentState);
  // Botons de llengua actius
  updateLangButtons();
}

// Marca el botó actiu als dos selectors
function updateLangButtons() {
  const LANG_BTN_MAP = { 'CAT': 'ca', 'CAST': 'es', 'ENG': 'en' };
  document.querySelectorAll('#codelang-switcher .lang-btn').forEach(btn => {
    btn.classList.toggle('active', LANG_BTN_MAP[btn.textContent.trim()] === currentCodeLang);
  });
  document.querySelectorAll('#userlang-switcher .lang-btn').forEach(btn => {
    btn.classList.toggle('active', LANG_BTN_MAP[btn.textContent.trim()] === currentUserLang);
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DIRS = [
  { name:'Est',  dx: 1, dy: 0, arrow:'→' },
  { name:'Sud',  dx: 0, dy: 1, arrow:'↓' },
  { name:'Oest', dx:-1, dy: 0, arrow:'←' },
  { name:'Nord', dx: 0, dy:-1, arrow:'↑' },
];

const LS_KEY_CODE = 'karel-code-v3';
const DEFAULT_CSV =
`K>,.,.,P,.,.
.,A,.,P,.,.
.,.,.,A,.,.
P,P,.,.,.,A
.,.,.,.,.,.`;


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. ESTAT GLOBAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let world      = { grid:[], rows:0, cols:0 };
let worldInit  = [];
let karel      = { x:0, y:0, dir:0, motxilla:0 };
let karelInit  = { x:0, y:0, dir:0, motxilla:0 };
let currentCSV = DEFAULT_CSV;

let running    = false;
let stepMode   = false;
let interpreter = null;
let tickTimer  = null;
let stepDelay  = SPEED_DELAYS[2]; // Normal per defecte

let editMode     = false;
let editBrush    = '.';
let editDragging = false;
let karelEditDir = 0;

let procs     = {};
let callDepth = 0;


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. INDICADOR D'ESTAT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setStateUI(state) {
  currentState = state;
  const dot = document.getElementById('state-dot');
  const lbl = document.getElementById('state-lbl');
  if (!dot || !lbl) return;
  dot.className = (state === 'idle') ? '' : state;
  lbl.textContent = t('state.' + state) || state;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. MODALS I REPTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

document.querySelectorAll('.modal-bg').forEach(bg =>
  bg.addEventListener('click', e => { if (e.target === bg) bg.classList.remove('open'); })
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
});

function openChallenges() {
  const challenges = I18N[currentLang].challenges;
  const list = document.getElementById('challenges-list');
  if (!list) return;
  list.innerHTML = challenges.map(ch => `
    <div class="ch-card" onclick="loadChallenge(${ch.id})" role="button" tabindex="0">
      <div class="ch-num">${t('log.challenge')} ${ch.id}</div>
      <div class="ch-title">${ch.title}</div>
      <div class="ch-desc">${ch.desc}</div>
      <div><span class="ch-tag ${ch.level}">${t('ui.level_' + ch.level)}</span></div>
    </div>`).join('');
  openModal('modal-challenges');
}

function loadChallenge(id) {
  const ch = I18N[currentLang].challenges.find(c => c.id === id);
  if (!ch) return;
  loadMapFromCSV(ch.csv);
  const ta = document.getElementById('code-editor');
  if (ta) {
    ta.value = ch.code;
    localStorage.setItem(LS_KEY_CODE, ch.code);
    updateEditor();
  }
  closeModal('modal-challenges');
  log(`${t('log.challenge')} ${id}: ${ch.title}`, 'ok');
}

function openBlankModal() { openModal('modal-blank'); }

function applyBlank() {
  const rows = Math.max(1, Math.min(20, parseInt(document.getElementById('blank-rows').value)||5));
  const cols = Math.max(1, Math.min(20, parseInt(document.getElementById('blank-cols').value)||7));
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

function triggerOpenCSV() { document.getElementById('file-input')?.click(); }

function handleFileOpen(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { currentCSV = e.target.result.trim(); loadMapFromCSV(currentCSV); log(`📂 ${file.name}`, 'ok'); };
  reader.readAsText(file);
  evt.target.value = '';
}

function saveCSV() {
  const csv = worldToCSV();
  const a   = document.createElement('a');
  a.href    = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
  a.download = 'mapa-karel.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  log('💾 CSV', 'ok');
}

function worldToCSV() {
  const AR = ['>','v','<','^'];
  return world.grid.map((row, r) =>
    row.map((c, col) =>
      (karelInit.x === col && karelInit.y === r) ? 'K' + AR[karelInit.dir] : c
    ).join(',')
  ).join('\n');
}

function copyMapURL() {
  const url = location.href.split('?')[0] + '?mapa=' + encodeURIComponent(worldToCSV());
  navigator.clipboard.writeText(url)
    .then(() => log('🔗 URL copiada!', 'ok'))
    .catch(() => log('🔗 ' + url, 'ok'));
}

function toggleLight() { document.body.classList.toggle('light'); }


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. CSV: PARSEJAT I CÀRREGA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function parseCSV(csv) {
  const lines = csv.trim().split('\n').map(l=>l.trim()).filter(l=>l&&!l.startsWith('//'));
  const grid = []; let kStart = {x:0,y:0,dir:0}; let foundK = false;
  for (let row = 0; row < lines.length; row++) {
    const cells = lines[row].split(',').map(c=>c.trim());
    grid.push([]);
    for (let col = 0; col < cells.length; col++) {
      const c = cells[col].toUpperCase();
      if (c.startsWith('K')) {
        grid[row].push('.');
        if (!foundK) {
          foundK = true;
          const s = c.slice(1);
          kStart = { x:col, y:row, dir: s==='^'?3 : s==='V'?1 : s==='<'?2 : 0 };
        }
      } else { grid[row].push(c==='P'?'P' : c==='A'?'A' : '.'); }
    }
  }
  const maxCols = Math.max(...grid.map(r=>r.length), 1);
  for (const r of grid) while (r.length < maxCols) r.push('.');
  return { grid, rows:grid.length, cols:maxCols, kStart };
}

function loadMapFromCSV(csv) {
  const { grid, rows, cols, kStart } = parseCSV(csv);
  world     = { grid, rows, cols };
  worldInit = grid.map(r=>[...r]);
  karel     = { ...kStart, motxilla:0 };
  karelInit = { ...kStart, motxilla:0 };
  stopProgram();
  renderWorld();
  updateStatus();
  log(t('log.map_loaded'), 'ok');
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. HELPERS DEL MÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function isWall(x, y) {
  if (x<0||y<0||x>=world.cols||y>=world.rows) return true;
  return world.grid[y][x]==='P';
}
function getCell(x, y) {
  if (x<0||y<0||x>=world.cols||y>=world.rows) return null;
  return world.grid[y][x];
}
function setCell(x, y, v) { if (y>=0&&y<world.rows&&x>=0&&x<world.cols) world.grid[y][x]=v; }
function front() { const d=DIRS[karel.dir]; return {x:karel.x+d.dx, y:karel.y+d.dy}; }

function evalCond(cond) {
  switch (cond.type) {
    case 'not': return !evalCond(cond.inner);
    case 'and': return evalCond(cond.left) && evalCond(cond.right);
    case 'or':  return evalCond(cond.left) || evalCond(cond.right);
    case 'condition': {
      const action = COND_TO_ACTION[cond.name] ?? cond.name;
      const {x,y}  = front();
      switch (action) {
        case 'wall-ahead':  return isWall(x,y);
        case 'free-ahead':  return !isWall(x,y);
        case 'water-ahead': return getCell(x,y)==='A';
        case 'bag-empty':   return karel.motxilla===0;
        case 'bag-full':    return karel.motxilla>0;
      }
    }
  }
  return false;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. RENDERITZAT + AUTO-ESCALA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function calcCellSize() {
  const area = document.getElementById('world-area');
  const pad=52, statusH=40;
  const byW = Math.floor((area.clientWidth  - pad - (world.cols+1)*2) / world.cols);
  const byH = Math.floor((area.clientHeight - pad - statusH - (world.rows+1)*2) / world.rows);
  return Math.max(18, Math.min(56, byW, byH));
}

function renderWorld() {
  const size = calcCellSize();
  const fs   = Math.round(size * 0.52) + 'px';
  document.documentElement.style.setProperty('--cell-size', size + 'px');
  const g = document.getElementById('world-grid');
  if (!g) return;
  g.style.gridTemplateColumns = `repeat(${world.cols}, ${size}px)`;
  g.innerHTML = '';

  for (let row = 0; row < world.rows; row++) {
    for (let col = 0; col < world.cols; col++) {
      const div = document.createElement('div');
      div.className  = 'cell';
      div.style.fontSize = fs;
      div.dataset.col = col;
      div.dataset.row = row;

      if (karel.x===col && karel.y===row) {
        div.classList.add('c-k');
        div.innerHTML = `<span class="karel-i">${DIRS[karel.dir].arrow}</span>`;
      } else {
        const c = world.grid[row][col];
        if      (c==='P') { div.classList.add('c-p'); div.innerHTML=`<span class="wall-i">▪</span>`; }
        else if (c==='A') { div.classList.add('c-a'); div.innerHTML=`<span class="water-i">💧</span>`; }
        else              { div.classList.add('c-e'); }
      }

      if (editMode) {
        div.addEventListener('mousedown', e => { e.preventDefault(); editDragging=true; applyBrushAt(col,row); });
        div.addEventListener('mouseenter', () => { if (editDragging) applyBrushAt(col,row); });
      }
      g.appendChild(div);
    }
  }
}

function updateStatus() {
  const bagEl = document.getElementById('st-bag');
  if (bagEl) bagEl.textContent = karel.motxilla;
}

new ResizeObserver(() => { if (world.rows>0) renderWorld(); })
  .observe(document.getElementById('world-area'));


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. LOG + RESIZE HANDLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const logEl = document.getElementById('log');

function log(msg, type='dim') {
  if (!logEl) return;
  const p = document.createElement('p');
  p.className  = type;
  p.textContent = msg;
  logEl.appendChild(p);
  while (logEl.children.length > 200) logEl.removeChild(logEl.firstChild);
  logEl.scrollTop = logEl.scrollHeight;
}

function clearLog() { if (logEl) logEl.innerHTML=''; }

(function initLogResize() {
  const wrap   = document.getElementById('log-wrap');
  const handle = document.getElementById('log-resize');
  if (!wrap || !handle) return;
  let startY, startH;
  handle.addEventListener('mousedown', e => {
    startY=e.clientY; startH=wrap.offsetHeight;
    handle.classList.add('dragging');
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    e.preventDefault();
  });
  function onMove(e) { wrap.style.height=Math.max(40,Math.min(startH+(startY-e.clientY),window.innerHeight*.6))+'px'; }
  function onUp()    { handle.classList.remove('dragging'); document.removeEventListener('mousemove',onMove); document.removeEventListener('mouseup',onUp); }
})();

document.addEventListener('mouseup', () => { editDragging=false; });


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 11. EXECUCIÓ D'ACCIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function execAction({ cmd, line }) {
  highlightLine(line);
  const action = CMD_TO_ACTION[cmd] ?? cmd;
  const {x:fx, y:fy} = front();

  function errStop(msgKey) {
    log(`❌ ${cmd} (${t('log.line')} ${line}): ${t('err.'+msgKey)}`, 'err');
    markErrorLine(line); setStateUI('error'); stopProgram(); return false;
  }

  switch (action) {
    case 'move':
      if (isWall(fx,fy)) return errStop('wall');
      karel.x=fx; karel.y=fy;
      log(`${cmd} → (${karel.x}, ${karel.y})`, 'inf');
      break;
    case 'turn-right':
      karel.dir=(karel.dir+1)%4;
      log(`${cmd} → ${DIRS[karel.dir].arrow}`, 'cmd');
      break;
    case 'turn-left':
      karel.dir=(karel.dir+3)%4;
      log(`${cmd} → ${DIRS[karel.dir].arrow}`, 'cmd');
      break;
    case 'turn-around':
      karel.dir=(karel.dir+2)%4;
      log(`${cmd} → ${DIRS[karel.dir].arrow}`, 'cmd');
      break;
    case 'grab':
      if (getCell(fx,fy)!=='A') return errStop('no_water');
      setCell(fx,fy,'.'); karel.motxilla++;
      log(`${cmd} 💧 → ${karel.motxilla}`, 'ok');
      break;
    case 'drop':
      if (karel.motxilla<=0) return errStop('bag_empty');
      setCell(karel.x,karel.y,'A'); karel.motxilla--;
      log(`${cmd} 💧 → ${karel.motxilla}`, 'ok');
      break;
  }
  renderWorld(); updateStatus(); return true;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 12. INTÈRPRET (GENERADORS JS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function* runStmts(stmts) { for (const s of stmts) yield* runStmt(s); }

function* runStmt(node) {
  switch (node.type) {
    case 'command': yield { cmd: node.name, line: node.line }; break;
    case 'if':      yield* runStmts(evalCond(node.cond) ? node.then : node.else); break;
    case 'while': {
      let guard=50000;
      while (evalCond(node.cond)) {
        if (--guard<=0) { log(t('log.inf_loop'),'err'); setStateUI('error'); return; }
        yield* runStmts(node.body);
      }
      break;
    }
    case 'repeat':
      for (let i=0; i<node.count; i++) yield* runStmts(node.body);
      break;
    case 'call': {
      const body = procs[node.name];
      if (!body) { log(`❌ '${node.name}' (${t('log.line')} ${node.line}): ${t('err.proc_undef')}`, 'err'); markErrorLine(node.line); setStateUI('error'); return; }
      callDepth++;
      if (callDepth>50) { log(t('log.deep_rec'),'err'); setStateUI('error'); callDepth=0; return; }
      yield* runStmts(body);
      callDepth--;
      break;
    }
    case 'proc': break;
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 13. EDITOR WYSIWYG DEL MAPA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function toggleEditMode() {
  if (running) { log(t('log.stop_first'), 'err'); return; }
  editMode = !editMode;
  document.body.classList.toggle('editing', editMode);
  const btn = document.getElementById('btn-edit-toggle');
  if (btn) btn.textContent = editMode ? '✓ Surt' : '✏️ Edita';
  if (editMode) { stopProgram(); karel={...karelInit}; world.grid=worldInit.map(r=>[...r]); karelEditDir=karelInit.dir; updateSizeIndicators(); setBrush('.'); }
  renderWorld();
}

function setBrush(b) {
  editBrush=b;
  ['dot','P','A','K'].forEach(id=>document.getElementById('brush-'+id)?.classList.remove('active'));
  const map={'.':'dot','P':'P','A':'A','K':'K'};
  document.getElementById('brush-'+map[b])?.classList.add('active');
  const ds = document.getElementById('dir-section');
  if (ds) ds.style.display = b==='K'?'block':'none';
  updateDirButtons();
}

function setKarelDir(d) { karelEditDir=d; karelInit={...karelInit,dir:d}; karel={...karelInit}; currentCSV=worldToCSV(); updateDirButtons(); renderWorld(); }
function updateDirButtons() { [0,1,2,3].forEach(d=>document.getElementById('dir-'+d)?.classList.toggle('active',d===karelEditDir)); }

function applyBrushAt(col, row) {
  if (col<0||col>=world.cols||row<0||row>=world.rows) return;
  let changed=false;
  if (editBrush==='K') {
    if (karelInit.x!==col||karelInit.y!==row) { karelInit={x:col,y:row,dir:karelEditDir,motxilla:0}; karel={...karelInit}; changed=true; }
  } else {
    if (karelInit.x===col&&karelInit.y===row) return;
    if (world.grid[row][col]!==editBrush) { world.grid[row][col]=editBrush; worldInit[row][col]=editBrush; changed=true; }
  }
  if (changed) { currentCSV=worldToCSV(); renderWorld(); }
}

function updateSizeIndicators() {
  const r=document.getElementById('rval-rows'); const c=document.getElementById('rval-cols');
  if (r) r.textContent=world.rows; if (c) c.textContent=world.cols;
}

function addRow()    { if(world.rows>=20)return; const nr=Array(world.cols).fill('.'); world.grid.push([...nr]); worldInit.push([...nr]); world.rows++; currentCSV=worldToCSV(); updateSizeIndicators(); renderWorld(); }
function removeRow() { if(world.rows<=1)return; if(karelInit.y>=world.rows-1){karelInit={...karelInit,y:world.rows-2};karel={...karelInit};} world.grid.pop();worldInit.pop();world.rows--; currentCSV=worldToCSV(); updateSizeIndicators(); renderWorld(); }
function addCol()    { if(world.cols>=20)return; world.grid.forEach((r,i)=>{r.push('.');worldInit[i].push('.');}); world.cols++; currentCSV=worldToCSV(); updateSizeIndicators(); renderWorld(); }
function removeCol() { if(world.cols<=1)return; if(karelInit.x>=world.cols-1){karelInit={...karelInit,x:world.cols-2};karel={...karelInit};} world.grid.forEach((r,i)=>{r.pop();worldInit[i].pop();}); world.cols--; currentCSV=worldToCSV(); updateSizeIndicators(); renderWorld(); }

document.getElementById('world-grid').addEventListener('touchstart', e => {
  if (!editMode) return; e.preventDefault();
  const t=e.touches[0], el=document.elementFromPoint(t.clientX,t.clientY);
  const c=el?.dataset?.col!==undefined?el:el?.closest?.('[data-col]');
  if(c) applyBrushAt(+c.dataset.col,+c.dataset.row);
}, {passive:false});

document.getElementById('world-grid').addEventListener('touchmove', e => {
  if (!editMode) return; e.preventDefault();
  const tc=e.touches[0], el=document.elementFromPoint(tc.clientX,tc.clientY);
  const c=el?.dataset?.col!==undefined?el:el?.closest?.('[data-col]');
  if(c) applyBrushAt(+c.dataset.col,+c.dataset.row);
}, {passive:false});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 14. CONTROL D'EXECUCIÓ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildInterpreter() {
  const ast = parseCode(document.getElementById('code-editor')?.value || '');
  if (!ast) return null;
  procs={};callDepth=0;
  for (const node of ast) if (node.type==='proc') procs[node.name]=node.body;
  return runStmts(ast.filter(n=>n.type!=='proc'));
}

function runProgram() {
  if (running) return;
  const gen=buildInterpreter(); if (!gen) return;
  clearLineMarks(); interpreter=gen; stepMode=false; running=true;
  setStateUI('running'); log(t('log.running'),'ok'); tick();
}

function stepProgram() {
  if (!running&&!interpreter) {
    const gen=buildInterpreter(); if (!gen) return;
    clearLineMarks(); interpreter=gen; running=true; stepMode=true;
    setStateUI('step'); log(t('log.step_mode'),'ok');
  }
  doStep();
}

function doStep() {
  if (!interpreter) return;
  const res=interpreter.next();
  if (res.done) { log(t('log.done'),'ok'); clearLineMarks(); running=false; interpreter=null; setStateUI('idle'); return; }
  execAction(res.value);
}

function tick() {
  if (!running||stepMode||!interpreter) return;
  const res=interpreter.next();
  if (res.done) { log(t('log.done'),'ok'); clearLineMarks(); running=false; interpreter=null; setStateUI('idle'); return; }
  const ok=execAction(res.value);
  if (ok!==false) tickTimer=setTimeout(tick,stepDelay);
}

function stopProgram() {
  const was=running||stepMode;
  running=false;stepMode=false;interpreter=null;
  if (tickTimer){clearTimeout(tickTimer);tickTimer=null;}
  if (was){clearLineMarks();setStateUI('idle');}
}

function resetKarel() {
  stopProgram(); world.grid=worldInit.map(r=>[...r]); karel={...karelInit};
  clearLineMarks(); renderWorld(); updateStatus(); setStateUI('idle');
  log(t('log.reset'),'dim');
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 15. RESSALTAT SINTÀCTIC + NÚMEROS DE LÍNIA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function tokenizeLine(line) {
  let out='', i=0;
  while (i<line.length) {
    const c=line[i];
    if (/\s/.test(c)) { let ws=''; while(i<line.length&&/\s/.test(line[i])) ws+=line[i++]; out+=escHtml(ws); }
    else if ('{}()'.includes(c)) { out+=`<span class="hl-br">${escHtml(c)}</span>`; i++; }
    else if (/[0-9]/.test(c)) { let n=''; while(i<line.length&&/[0-9]/.test(line[i])) n+=line[i++]; out+=`<span class="hl-num">${n}</span>`; }
    else {
      let w=''; while(i<line.length&&!/[\s{}()\/]/.test(line[i])) w+=line[i++];
      if      (KEYWORDS.has(w)) out+=`<span class="hl-kw">${escHtml(w)}</span>`;
      else if (COMMANDS.has(w)) out+=`<span class="hl-cmd">${escHtml(w)}</span>`;
      else if (CONDS.has(w))    out+=`<span class="hl-cond">${escHtml(w)}</span>`;
      else                      out+=`<span class="hl-user">${escHtml(w)}</span>`;
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────
// FIX CURSOR (bug 4):
//
// Causa del bug: el codi anterior usava display:block
// en els spans .code-line + join(''), i padding-left:2px.
// Qualsevol propietat de layout en els spans de l'overlay
// desplaça el text respecte al textarea, i el cursor
// (que pertany al textarea) apareix en el lloc equivocat.
//
// Solució:
//  • highlightCode: join('\n') — el \n és el separador
//    de línia, igual que en el textarea (white-space:pre).
//  • .code-line: spans inline purs, sense cap propietat
//    de layout. Cap padding, cap border, cap display:block.
//  • El fons de línia activa/error es fa amb #line-bg
//    (capa separada) per no afectar el text de l'overlay.
// ─────────────────────────────────────────────────────

function highlightCode(code) {
  return code.split('\n').map((line, i) => {
    const ln = i + 1;
    const ci = line.indexOf('//');
    const content = ci !== -1
      ? tokenizeLine(line.slice(0, ci)) + `<span class="hl-cm">${escHtml(line.slice(ci))}</span>`
      : tokenizeLine(line);
    // Span inline: NO display:block, NO padding, NO border → no desplaça res
    return `<span class="code-line" id="cln-${ln}">${content}</span>`;
  }).join('\n');   // ← '\n' és el separador, igual que en el textarea (white-space:pre)
}

// Actualitza el #line-bg (una fila per línia de codi)
function updateLineBg(numLines) {
  const bg = document.getElementById('line-bg');
  if (!bg) return;
  bg.innerHTML = Array.from({length: numLines}, (_, i) =>
    `<div class="lbg-row" id="lbg-${i + 1}"></div>`
  ).join('');
}

// El marcatge de línies activa/error es fa sobre #line-bg, NO sobre .code-line
function highlightLine(n) {
  document.querySelectorAll('.lbg-row.active').forEach(el => el.classList.remove('active'));
  if (n) document.getElementById('lbg-' + n)?.classList.add('active');
}
function markErrorLine(n) {
  if (n) document.getElementById('lbg-' + n)?.classList.add('error');
}
function clearLineMarks() {
  document.querySelectorAll('.lbg-row.active, .lbg-row.error')
    .forEach(el => el.classList.remove('active', 'error'));
}

function updateEditor() {
  const ta = document.getElementById('code-editor');
  const hl = document.getElementById('code-highlight');
  const ln = document.getElementById('line-numbers');
  const bg = document.getElementById('line-bg');
  if (!ta || !hl || !ln) return;
  const code  = ta.value;
  const lines = code.split('\n');
  hl.innerHTML = highlightCode(code);
  hl.scrollTop = ta.scrollTop;
  ln.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
  ln.scrollTop = ta.scrollTop;
  if (bg) {
    updateLineBg(lines.length);
    bg.scrollTop = ta.scrollTop;
  }
}

// Inicialització de l'editor (condicional: no existeix a edit-mapa.html)
const codeTA = document.getElementById('code-editor');
if (codeTA) {
  // (el valor inicial s'estableix a la secció 18)

  codeTA.addEventListener('input', () => {
    updateEditor();
    localStorage.setItem(LS_KEY_CODE, codeTA.value);
  });

  // FIX 2 - cursor: sincronitzem les TRES capes (highlight, line-bg, numeració)
  codeTA.addEventListener('scroll', () => {
    const st = codeTA.scrollTop;
    document.getElementById('code-highlight').scrollTop = st;
    document.getElementById('line-numbers').scrollTop   = st;
    const bg = document.getElementById('line-bg');
    if (bg) bg.scrollTop = st;
  });

  codeTA.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = codeTA.selectionStart, end = codeTA.selectionEnd;
      codeTA.value = codeTA.value.slice(0, s) + '  ' + codeTA.value.slice(end);
      codeTA.selectionStart = codeTA.selectionEnd = s + 2;
      updateEditor();
    }
  });
}

// Dreceres de teclat
if (codeTA) {
  document.addEventListener('keydown', e => {
    const tag=document.activeElement.tagName;
    if (tag==='TEXTAREA'||tag==='INPUT') return;
    if (e.key==='F5')  { e.preventDefault(); runProgram(); }
    if (e.key==='F10') { e.preventDefault(); stepProgram(); }
    if (e.key==='F8')  { e.preventDefault(); stopProgram(); }
  });
}

// Fix 3 - velocitat: mostra números 1-6 (no paraules)
// Fix bug: t('speed') retornava l'array com a string. Usem l'índex directament.
const speedSlider = document.getElementById('speed');
if (speedSlider) {
  speedSlider.addEventListener('input', function () {
    const idx = parseInt(this.value) - 1;  // 0-5
    stepDelay  = SPEED_DELAYS[idx];
    const lbl  = document.getElementById('speed-lbl');
    if (lbl) lbl.textContent = this.value;  // mostra 1, 2, 3, 4, 5, 6
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 16. TOKENITZADOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function tokenize(code) {
  const toks=[]; let i=0, line=1;
  while (i<code.length) {
    const c=code[i];
    if (c==='\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c==='/'&&code[i+1]==='/') { while(i<code.length&&code[i]!=='\n') i++; continue; }
    if ('{}()'.includes(c)) { toks.push({t:c,line}); i++; continue; }
    if (/[0-9]/.test(c)) { let n=''; const tl=line; while(i<code.length&&/[0-9]/.test(code[i])) n+=code[i++]; toks.push({t:'N',v:parseInt(n),line:tl}); continue; }
    if (!/[\s{}()\/]/.test(c)) { let w=''; const tl=line; while(i<code.length&&!/[\s{}()\/]/.test(code[i])) w+=code[i++]; toks.push({t:'W',v:w,line:tl}); continue; }
    i++;
  }
  toks.push({t:'EOF',line});
  return toks;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 17. PARSER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Parser {
  constructor(toks) { this.toks=toks; this.i=0; }
  peek() { return this.toks[this.i]; }
  next() { return this.toks[this.i++]; }
  eat(t, v) {
    const tok=this.peek();
    if (tok.t!==t||(v!==undefined&&tok.v!==v))
      throw new Error(`S'esperava '${v??t}' a la ${t('log.line')} ${tok.line}, però s'ha trobat '${tok.v??tok.t}'`);
    return this.next();
  }
  parseAll() { const s=[]; while(this.peek().t!=='EOF') s.push(this.parseStmt()); return s; }
  parseStmt() {
    const tok=this.peek(), line=tok.line;
    if (tok.t!=='W') throw new Error(`Instrucció inesperada a la ${t('log.line')} ${line}: '${tok.v??tok.t}'`);
    const w=tok.v;
    if (COMMANDS.has(w)) { this.next(); return {type:'command',name:w,line}; }
    if (w===KW_IF) {
      this.next(); this.eat('('); const cond=this.parseCond(); this.eat(')');
      const thenB=this.parseBlock(); let elseB=[];
      const nxt=this.peek();
      if (nxt.t==='W'&&KW_ELSE_ALIASES.includes(nxt.v)) { this.next(); elseB=this.parseBlock(); }
      return {type:'if',cond,then:thenB,else:elseB,line};
    }
    if (w===KW_WHILE) { this.next(); this.eat('('); const cond=this.parseCond(); this.eat(')'); return {type:'while',cond,body:this.parseBlock(),line}; }
    if (w===KW_REPEAT) { this.next(); this.eat('('); const num=this.eat('N'); this.eat(')'); return {type:'repeat',count:num.v,body:this.parseBlock(),line}; }
    if (w===KW_PROC) {
      this.next(); const nt=this.peek();
      if (nt.t!=='W') throw new Error(`S'esperava nom del procediment a la ${t('log.line')} ${nt.line}`);
      const name=nt.v; this.next(); return {type:'proc',name,body:this.parseBlock(),line};
    }
    // Crida a procediment definit per l'usuari
    this.next(); return {type:'call',name:w,line};
  }
  parseBlock() { this.eat('{'); const s=[]; while(this.peek().t!=='}'&&this.peek().t!=='EOF') s.push(this.parseStmt()); this.eat('}'); return s; }
  parseCond()    { return this.parseOrCond(); }
  parseOrCond()  { let l=this.parseAndCond(); while(this.peek().t==='W'&&this.peek().v===KW_OR)  { const ln=this.peek().line; this.next(); l={type:'or', left:l,right:this.parseAndCond(),ln}; } return l; }
  parseAndCond() { let l=this.parseNotCond(); while(this.peek().t==='W'&&this.peek().v===KW_AND) { const ln=this.peek().line; this.next(); l={type:'and',left:l,right:this.parseNotCond(),ln}; } return l; }
  parseNotCond() {
    const tok=this.peek();
    if (tok.t==='W'&&tok.v===KW_NOT) { const line=tok.line; this.next(); this.eat('('); const inner=this.parseCond(); this.eat(')'); return {type:'not',inner,line}; }
    return this.parseAtomCond();
  }
  parseAtomCond() {
    const tok=this.peek(), line=tok.line;
    if (tok.t==='W'&&CONDS.has(tok.v)) { this.next(); return {type:'condition',name:tok.v,line}; }
    throw new Error(`Condició desconeguda a la ${t('log.line')} ${line}: '${tok.v??tok.t}'`);
  }
}

function parseCode(code) {
  try {
    return new Parser(tokenize(code)).parseAll();
  } catch (e) {
    const m=e.message.match(/\d+/); const ln=m?parseInt(m[0]):null;
    log(`❌ ${t('err.syntax')}: ${e.message}`, 'err');
    if (ln) markErrorLine(ln);
    setStateUI('error');
    return null;
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 18. INICIALITZACIÓ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Aplica els tokens del LLENGUATGE DE PROGRAMACIÓ
applyCodeLang(currentCodeLang);

// Carrega el mapa des de URL o per defecte
// (nota: _urlParams ja s'ha creat a la secció 2)
const _urlMapa = _urlParams.get('mapa');
loadMapFromCSV(_urlMapa ?? DEFAULT_CSV);

// Omple l'editor: primer mira el localStorage, si no, codi d'exemple del codelang
if (codeTA) {
  const saved = localStorage.getItem(LS_KEY_CODE);
  codeTA.value = saved || DEFAULT_CODE[currentCodeLang] || DEFAULT_CODE.ca;
  updateEditor();
  setTimeout(() => updateEditor(), 50);
}

// Actualitza la UI amb l'idioma de la interfície
updateUI();
