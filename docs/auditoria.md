# Auditoria tècnica de KarelCat — Document per a IA

> **Per a qui llegeix això:** Ets una IA que ha de treballar sobre el codi de `karelcat`. Aquest document resumeix l'arquitectura real del projecte, els punts forts verificats llegint el codi font, els riscos reals i les tasques pendents. No és especulatiu: cada afirmació es basa en fitxers concrets.
>
> `docs/CURRENT-STATE.md` descriu *què* fa el projecte, l'estat de totes les tasques i les regles de disseny. Aquest document se centra en *com* funciona internament i *on* cal anar amb compte.

---

## 1. Estructura de fitxers i responsabilitats reals

```
index.html          — Punt d'entrada. HTML mínim: topbar, toolbar, editor, món.
style.css           — ~698 línies. Sense zombies des de la neteja (Categoria C).

js/constants.js     — Namespace K, sanitizeHtml, DIRS, KAREL_ASSETS (SVG), SPEED_DELAYS,
                      CMD_ACTIONS, COND_ACTIONS, LS_KEY_CODE, LS_KEY_THEME, DEFAULT_CSV,
                      DEFAULT_CODE, i funcions K.escHtml / K.sanitizeHtml.
js/i18n.js          — K.CODE_LANGS (vocabulari del codi) + K.UI_LANGS (textos UI).
                      Funcions K.t(key) i K.tf(key, vars).
js/state.js         — K.state (estat centralitzat) + K.lang (tokens del parser actiu).
                      Funció K.applyCodeLang(lang).
js/tokenizer.js     — Funció pura K.tokenize(code) → array de tokens.
js/parser.js        — Classe Parser + K.parseCode(code) → AST o null.
js/interpreter.js   — Generadors K.runStmts / K.runStmt → yield { cmd, line } | { type:'error', ... }
js/execution.js     — K.execAction, K.runProgram, K.stepProgram, K.stopProgram, K.resetKarel.
js/world.js         — K.parseCSV, K.loadMapFromCSV, K.isRock, K.getCell, K.setCell,
                      K.front(), K.evalCond, K.worldToCSV, K.currentStateToCSV.
js/renderer.js      — K.renderWorld (diferencial), K.renderWorldFull, K.updateStatus.
js/editor.js        — Ressaltat sintàctic, numeració de línies, marca d'error, autocompletat.
js/ui.js            — K.log, K.logError, K.setStateUI, K.updateUI, K.initSpeedSlider,
                      K.handleRunClick, K.toggleTheme, K.initTheme.
js/main.js          — IIFE d'inicialització. Llegeix URL params, connecta tots els mòduls.
js/reptes.js        — K.REPTES[N]: definicions de 5 reptes predefinits.

curs/               — Sistema de curs independent (iframes, no instanciable directament).
```

**Ordre de càrrega a `index.html`** (crític — vegeu secció 5):
```
constants.js → i18n.js → state.js → tokenizer.js → parser.js →
interpreter.js → world.js → renderer.js → editor.js → ui.js →
execution.js → reptes.js → main.js
```

---

## 2. Flux de dades complet (codi → acció al món)

Seguir aquest flux és la millor manera d'entendre el sistema:

```
Alumne escriu codi (textarea #code-editor)
  │
  ▼
K.tokenize(code)          [tokenizer.js]
  → tokens: [{t:'INDENT',v:0}, {t:'W',v:'move'}, {t:'('}, {t:')'}, {t:'NL'}, ...]
  │
  ▼
new Parser(tokens).parseAll()   [parser.js]
  → AST: [{type:'command', name:'move', line:1}, {type:'while', cond:{...}, body:[...], ...}]
  │
  ▼
K.runStmts(ast)           [interpreter.js — generador JS]
  → yield {cmd:'move', line:1}
  → yield {cmd:'turn_left', line:3}
  → yield {type:'error', code:'inf_loop', ...}   ← si hi ha bucle infinit
  │
  ▼
execAction(step)          [execution.js]
  → CMD_TO_ACTION['move'] = 'move'   (via K.lang, configurat per applyCodeLang)
  → K.isRock(fx, fy) → si roca: errStop('rock')
  → S.karel.x = fx; S.karel.y = fy
  → K.renderWorld()   [renderer.js — diferencial]
  → K.updateStatus()
```

**Punts clau del flux:**
- L'intèrpret és un **generador JS**. No executa tot de cop: retorna un valor per `yield` i es queda suspès fins al `tick` següent. Això permet el mode pas a pas i el control de velocitat sense bloquejar el navegador.
- `CMD_TO_ACTION` és una indirección: el motor no coneix les paraules de l'alumne (`move`, `avança`, etc.), només les accions internes (`'move'`, `'turn-left'`, etc.). Afegir un idioma de codi nou no requereix tocar l'intèrpret ni l'executor.
- **Invariant de posició** (important per a auditories futures): `S.karel.x/y` **sempre** apunta a una casella que no és `'P'`. `move` comprova `isRock` *abans* d'actualitzar la posició; si xoca, para. Per tant, qualsevol codi que assumeixi "Karel pot estar sobre una pedra" és incorrecte.

---

## 3. Punts forts verificats (no modificar sense raó sòlida)

### 3.1 Generadors JS per a l'intèrpret (`interpreter.js`)

L'intèrpret usa `function*` i `yield*`. Això és elegant i correcte per diverses raons:

- Permet **suspendre l'execució** entre passos sense callbacks ni màquines d'estats manuals.
- El mode pas a pas (`stepProgram`) i el mode continu (`runProgram`/`tick`) comparteixen exactament el mateix generador; la diferència és només qui el fa avançar.
- La recursió de procediments de l'alumne es mapeja directament sobre la pila de crida JS (via `yield* runStmts(body)`), cosa que simplifica molt el codi i fa que la detecció de recursió excessiva (`callDepth > 50`) sigui trivial.
- **No tocar** l'estructura del generador sense entendre bé com interactua amb `tick()` i `doStep()` a `execution.js`.

### 3.2 Sanitització HTML robusta (`constants.js`)

`sanitizeHtml(html)` usa `DOMParser` i reconstrueix el DOM element per element, permetent només una llista blanca de tags (`em, strong, code, br, span, b, i, u, sub, sup`) i atributs (`class, title`). Qualsevol altre tag es desenbolica (es conserven els fills, no el contenidor). Qualsevol altre atribut s'elimina silenciosament.

Complementàriament, `escHtml(s)` escapa els quatre caràcters perillosos (`&`, `<`, `>`, `"`) per a usos on no cal HTML (logs, missatges d'error).

**El curs usa `sanitizeHtml`** per al contingut dels capítols que arriba de fitxers HTML externs. Continuar usant-la sempre que es mostri contingut dinàmic al DOM.

### 3.3 Separació `codeLang` / `uiLang` (`i18n.js` + `state.js`)

Els dos eixos són **completament ortogonals**:

- `K.CODE_LANGS['en']` conté els tokens que l'alumne escriu al codi. El parser i el tokenitzador els llegeixen via `K.lang` (configurat per `applyCodeLang`).
- `K.UI_LANGS['ca']` conté tots els textos que apareixen a la pantalla. La funció `K.t('key.subkey')` els llegeix.

Afegir català com a idioma de codi és afegir `K.CODE_LANGS.ca = { ... }` a `i18n.js` i cridar `K.applyCodeLang('ca')` — **zero canvis** al parser, tokenitzador, intèrpret o executor.

Afegir castellà com a idioma d'interfície és afegir `K.UI_LANGS.es = { ... }` i canviar `K.state.uiLang = 'es'` — **zero canvis** en cap altre lloc.

**Regla d'or**: mai barrejar claus de `CODE_LANGS` amb claus de `UI_LANGS`. Si una clau controla una paraula que l'alumne escriu → `CODE_LANGS`. Si controla un text que l'alumne llegeix → `UI_LANGS`.

### 3.4 Contracte postMessage entre iframes (`execution.js` + `curs/`)

El simulador incrustat als capítols del curs s'executa dins d'un `<iframe>`. Quan acaba un programa, `execution.js` envia un missatge al pare:

```js
// Al final de l'execució (tick / doStep):
notifyGoalResult(compareGoal(K.goalCSV));

// La funció:
function notifyGoalResult(success) {
  if (!K.goalCSV || !K.goalId) return;
  window.parent.postMessage(
    { type: 'karel-result', goalId: K.goalId, success },
    K.parentOrigin
  );
}
```

`K.parentOrigin` s'obté de `document.referrer` (no de `'*'`), cosa que evita enviar dades a orígens arbitraris. La pàgina del curs escolta `'message'` i actualitza el feedback visual de l'exercici.

**Missatges possibles:**
- `{ type: 'karel-result', goalId, success }` — resultat final (✓ o ✗)
- `{ type: 'karel-clear', goalId }` — l'alumne ha modificat el codi o ha reiniciat; esborrar el feedback

`compareGoal(goalCSV)` compara la posició final de Karel (sense direcció) i el contingut de cada casella. No compara la direcció final: és una decisió de disseny explícita.

### 3.5 Renderitzat diferencial (`renderer.js`)

`renderWorld()` no reconstrueix el DOM complet en cada tick. Manté un `_renderedSnapshot` de la clau de cada cel·la (string que combina contingut + presència de Karel + direcció). Només actualitza les cel·les on la clau ha canviat o la mida de cel·la ha variat.

Reconstrucció completa (`renderWorldFull`) només quan canvien les dimensions del món. Útil per saber-ho si cales al renderer: trucar `renderWorldFull()` força un rebuild; `renderWorld()` és incremental.

---

## 4. Gestió d'errors a l'intèrpret

Hi ha dos tipus d'errors diferenciats:

**Errors de sintaxi** (detectats per `parser.js` / `parseCode`):
- Llancen `KarelSyntaxError` dins del parser.
- Capturats pel `try/catch` de `parseCode`, que crida `K.logError` i `K.markErrorLine`.
- Retornen `null` i el programa no arrenca.

**Errors de runtime** (detectats per `interpreter.js` o `execution.js`):
- L'intèrpret fa `yield { type: 'error', code, msg, line }` (no llança excepcions).
- `execAction` detecta `step.type === 'error'` i crida `errStop`.
- `errStop` crida `K.logError`, `K.markErrorLine`, `K.setStateUI('error')`, `stopProgram()`.
- Errors de runtime possibles: `'rock'` (xoc), `'no_pearl'` (grab sense perla), `'bag_empty'` (drop sense perles a la motxilla), `'inf_loop'` (while amb guard > 50000), `'deep_rec'` (callDepth > 50), `'proc_undef'` (crida a procediment no definit).

**Important**: els errors de runtime *no llancen excepcions JS*. Si modifiques l'intèrpret o l'executor, usa sempre el mecanisme de `yield { type:'error' }` / `errStop`, no `throw`. Llançar dins d'un generador que és consumit per `tick()` provocaria una excepció no capturada.

---

## 5. El risc real a llarg termini: ordre de càrrega de scripts

Aquest és l'únic risc arquitectònic real del projecte. Tots els scripts s'inclouen a `index.html` com a `<script src="...">` sense `type="module"`. El namespace global `K` s'usa com a substitut d'un sistema de mòduls:

```js
// constants.js — primer script carregat:
window.K = window.K || {};

// Tots els altres scripts afegeixen funcions a K:
K.tokenize = tokenize;
K.parseCode = parseCode;
// etc.
```

**Per què és un risc:** si algun script s'inclou fora d'ordre, falla en silenci (o amb un `TypeError: K.X is not a function` difícil de rastrejar). L'ordre correcte és:
```
constants.js → i18n.js → state.js → tokenizer.js → parser.js →
interpreter.js → world.js → renderer.js → editor.js → ui.js →
execution.js → reptes.js → main.js
```

**Nota sobre l'ordre:** `execution.js` va *després* de `ui.js` perquè crida funcions de `world.js`, `renderer.js` i `ui.js`. L'ordre de la secció 1 reflecteix aquest ordre real.

**Per què no és un problema ara:** el projecte té 13 scripts JS. L'ordre és fix i documentat. Cap script es carrega dinàmicament. Mentre el projecte no creixi molt, és manejable.

**Quan actuar:** si s'afegeixen molts mòduls nous, o si es vol usar `import` de llibreries externes (p.ex. un parser YAML per a mapes), migrar a `type="module"` i `import/export` explícits. La migració és mecànica però no trivial: cal afegir `export` a cada funció pública i `import` a cada fitxer que la usa, i eliminar totes les referències a `window.K`.

**Fins llavors**: quan afegeixis un script nou, posa'l a `index.html` en la posició correcta (abans dels scripts que el necessiten, després dels que ell necessita) i exporta totes les funcions públiques via `K.nomFuncio = nomFuncio`.

---

## 6. Format CSV dels mapes — especificació completa

El format el llegeix `parseCSV` a `world.js`. Separador de files: `|` (no `\n`). Separador de columnes: `,`.

```
Caràcters reconeguts:
  K>  K^  K<  Kv  — Karel mirant Est(0) / Nord(3) / Oest(2) / Sud(1)
  A               — Perla (recollible amb grab())
  P               — Roca (obstacle infranquejable; isRock() retorna true)
  .               — Casella buida (qualsevol altre caràcter desconegut → '.')
```

Notes importants:
- `parseCSV` fa `.toUpperCase()` sobre cada cel·la → `k>`, `p`, `a` funcionen igual.
- Si hi ha múltiples Karols al CSV, s'usa el primer i s'ignoren els altres (sense error).
- Files de longitud desigual s'omplen amb `'.'` fins a la longitud màxima.
- Les línies que comencen per `//` s'ignoren (comentaris al CSV).
- `worldToCSV()` usa la posició inicial de Karel (`karelInit`), no la posició actual. Per exportar l'estat actual, usa `currentStateToCSV()`.

Exemple mínim:
```
K>,.,A,.|.,P,.,.|.,.,.,A
```

---

## 7. Paràmetres d'URL acceptats per `index.html`

Gestionats per `main.js` a l'IIFE d'inicialització:

| Paràmetre | Valor | Efecte |
|---|---|---|
| `embed=1` | qualsevol | Aplica classe `embed` al body → amaga topbar. |
| `map=BASE64` | CSV codificat en base64 | Mapa inicial en lloc del DEFAULT_CSV. |
| `code=BASE64` | codi codificat en base64 | Codi inicial en lloc del DEFAULT_CODE. |
| `readonly=1` | qualsevol | textarea amb atribut `readonly` (exemples no editables). |
| `repte=N` | 1–5 | Carrega el repte N de `K.REPTES`. Té prioritat sobre `map`/`code`. |
| `goal=BASE64` | CSV codificat en base64 | Estat final objectiu per a la verificació d'exercicis. |
| `goalId=STRING` | string | Identificador de l'exercici per al postMessage. |
| `bag=N` | enter | Motxilla inicial de Karel (usada pels simuladors del curs). |
| `theme=light` | `light` | Força mode clar (aplicat inline al HTML, sincronitzat per `initTheme`). |

Quan `embed=1` és present, **no es guarda res a localStorage** (`useLocalStorage = false`).

---

## 8. Tasques pendents per prioritat

### 8.1 Curs complet ✅

Tots els 10 capítols (`curs/capitol-1.html` … `curs/capitol-10.html`) i els 13 reptes
(`curs/repte-1.html` … `curs/repte-13.html`) estan implementats i llistats a `DISPONIBLES`
a `curs/index.html`. El contingut pedagògic del curs és complet.

L'estat detallat de cada repte (mapes, solucions de referència, notes pedagògiques) es
troba a `curs/BRIEFING-REPTES.md`.

Els simuladors s'incrusten via `<iframe src="../index.html?embed=1&map=BASE64&code=BASE64...">`.
Per generar les URLs, usa `btoa(encodeURIComponent(text))` al revés de
`decodeURIComponent(escape(atob(b64)))` que usa `main.js`.

La prioritat de desenvolupament actual és la **Categoria D** (millores visuals) i,
opcionalment, la **Categoria E** (expansió d'idiomes i funcionalitat futura).

### 8.2 Millores visuals (prioritat mitjana)

- **D.1** Perla en mode clar: el SVG de la perla té píxels `#FFFFFF` purs a l'interior que desapareixen sobre fons blanc. Cal repassar el sprite. La roca (marrons foscos `#6B5040`, `#4A3728`) és visible sobre fons blanc sense canvis.
- **D.2** Emoji motxilla: decidir si afegir ⚪ al costat del comptador.
- **D.3** Responsive mòbil: verificar mediaqueries a 820px i 600px.
- **D.4** Favicon: afegir la medusa rosa com a favicon.

### 8.3 Expansió futura (prioritat baixa)

- **E.1–E.2** Idiomes de codi: català (`ca`) i castellà (`es`). Purament additiu a `i18n.js`.
- **E.3–E.4** Idiomes d'interfície: anglès (`en`) i castellà (`es`). Igualment additiu.
- **E.5** Selector d'idioma a la UI: ara `codeLang` i `uiLang` estan fixats a `state.js`.
- **E.6** Editor de mapes: eliminat a la neteja. Recuperable, però no és prioritat.
- **E.7** Càrrega de CSV des de disc o URL.

---

## 9. Decisions de disseny a no qüestionar

Algunes decisions poden semblar discutibles però són intencionals i documentades:

**`grab()` i `drop()` operen sobre la casella *actual*, no la del davant.** Coherent amb el Karel original de Rich Pattis (1972) i amb `pearl_here()`. Qualsevol IA auditora que suggereixi canviar-ho sense conèixer el context probablement s'equivoca.

**L'invariant de posició és estructural, no defensiu.** Karel mai pot estar sobre una roca. Qualsevol guard del tipus `if (cell === 'P') return errStop('rock')` dins de `drop()` seria codi mort. No afegir-lo: és confús i indueix a pensar que l'estat podria ser invàlid quan no pot ser-ho. Una IA auditora que no hagi llegit el `case 'move'` pot confondre's aquí; és l'error de lectura parcial del codi, no un bug real.

**`compareGoal` ignora la direcció final de Karel.** Decisió pedagògica: l'exercici es considera resolt si Karel és a la posició correcta i el món té el contingut correcte. La direcció final no és rellevant per a la majoria d'exercicis educatius.

**El tokenitzador detecta automàticament la unitat d'indentació.** `_detectIndentUnit` calcula el mínim sagnat no nul present al codi. Això permet que 2, 3 o 4 espais per nivell funcionin tots sense configuració. El `Math.round` al calcular `indentLevel` absorbeix 1 espai de desviació accidental.

**`not` suporta dues sintaxis.** `not cond()` i `not(cond())` ambdues funcionen (el parser detecta si el que ve després és `(` i actua diferent). Això és Python-compatible i pedagògicament útil.

---

## 10. Checklist per a qualsevol modificació

Abans de fer qualsevol canvi al codi, verifica:

- [ ] El canvi és **additiu** (afegir codi) o **invasiu** (modificar codi existent)? Preferir sempre additiu.
- [ ] Si modifiques `i18n.js`: has mantingut la paritat d'ordre entre `commands[]` i `K.CMD_ACTIONS`? Entre `conditions[]` i `K.COND_ACTIONS`? L'índex ha de coincidir exactament.
- [ ] Si afegeixis un script nou: l'has inclòs a `index.html` en la posició correcta? Has exportat totes les funcions públiques via `K.nomFuncio = nomFuncio`?
- [ ] Si modifiques el parser o el tokenitzador: has comprovat que el programa `for _ in range(10): move()` (indentació amb 2 espais) i `for i in range(3):\n    move()` (indentació amb 4 espais) funcionen tots dos?
- [ ] Si modifiques `execution.js`: els errors de runtime es comuniquen via `errStop()` o `yield { type:'error' }`, no via `throw`?
- [ ] Si modifiques el renderer: has comprovat que `renderWorld()` diferencial i `renderWorldFull()` rebuild complet produeixen el mateix resultat visual?
- [ ] Les paraules `wall` i `water` no apareixen en cap fitxer del projecte. Si n'afegeixes accidentalment, elimina-les.
- [ ] El projecte és **Python-compatible**: qualsevol programa Karel vàlid ha de ser Python vàlid amb un shim adequat. Una nova construcció sintàctica ha de seguir la sintaxi Python.
