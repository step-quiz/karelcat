# karelcat — Estat actual del projecte

> **Font única de veritat.** Aquest document descriu l'estat real del projecte
> en el moment de l'última actualització. Qualsevol sessió de treball que
> modifiqui vocabulari, arquitectura, comportament o estat de tasques ha
> d'actualitzar aquest document abans de tancar.
>
> **Regla d'or:** un document d'estat obsolet és més perillós que no tenir-ne.

---

## 1. Visió general

**karelcat** és un entorn interactiu per aprendre a programar en Python, adreçat
a alumnes de secundària (16 anys, sense experiència prèvia). L'alumne controla
**en Karel**, una medusa programable que viu en una graella submarina.

Inspirat en el [Stanford Karel Reader](https://compedu.stanford.edu/karel-reader/docs/python/en/intro.html).
El dialecte Karel és un **subconjunt vàlid de Python**: qualsevol programa Karel
vàlid es pot executar en un intèrpret Python real (amb un shim que defineixi les
funcions de Karel).

**Configuració d'idiomes:** codi en anglès (Python-compatible), interfície en català.

---

## 2. Estat del curs — completat al 100 %

### 2.1 Capítols (10/10 escrits)

| # | Fitxer | Títol | Conceptes nous |
|---|--------|-------|----------------|
| 1 | `curs/capitol-1.html` | Coneix en Karel | `move()`, `turn_left()`, `turn_right()`. Món, graella, direccions. |
| 2 | `curs/capitol-2.html` | Agafa i deixa | `grab()`, `drop()`, motxilla, `pearl_here()`. Errors. |
| 3 | `curs/capitol-3.html` | Repeteix | `for _ in range(N):`, indentació, blocs. |
| 4 | `curs/capitol-4.html` | Procediments | `def nom():`. Crear ordres noves. |
| 5 | `curs/capitol-5.html` | Descomposició | Cap sintaxi nova. Mètode top-down. Pre/postcondicions. |
| 6 | `curs/capitol-6.html` | Condicionals | `if cond():` / `else:`. |
| 7 | `curs/capitol-7.html` | Mentre | `while cond():`. Fencepost error. |
| 8 | `curs/capitol-8.html` | Combinant condicions | `not`, `and`, `or`. |
| 9 | `curs/capitol-9.html` | El vocabulari complet | `turn_around()`, `left_is_clear()`, `right_is_clear()`, `elif`, `break`, `True`/`False`. |
| 10 | `curs/capitol-10.html` | Del Karel al Python | Epíleg. Pont al món real. Cap simulador. |

Tots els capítols estan llistats a `DISPONIBLES` a `curs/index.html`.

### 2.2 Reptes (13/13 implementats)

Els reptes formen part del capítol 10. Cada repte és un fitxer HTML independent.

| # | Fitxer | Títol | Grup | Dificultat |
|---|--------|-------|------|------------|
| 1 | `curs/repte-1.html` | El diari | A | ★ Fàcil |
| 2 | `curs/repte-2.html` | El passadís | A | ★ Fàcil |
| 3 | `curs/repte-3.html` | L'escala diagonal | A | ★ Fàcil |
| 4 | `curs/repte-4.html` | Distribuir les perles | A | ★ Fàcil |
| 5 | `curs/repte-5.html` | El serpentí | B | ★★ Intermedi |
| 6 | `curs/repte-6.html` | Construir torres | B | ★★ Intermedi |
| 7 | `curs/repte-7.html` | L'escala doble | B | ★★ Intermedi |
| 8 | `curs/repte-8.html` | El vigilant | B | ★★ Intermedi |
| 9 | `curs/repte-9.html` | Les files alternes | B | ★★ Intermedi |
| 10 | `curs/repte-10.html` | El detector | C | ★★★ Avançat |
| 11 | `curs/repte-11.html` | El tauler d'escacs | C | ★★★ Avançat |
| 12 | `curs/repte-12.html` | El laberint | C | ★★★ Avançat |
| 13 | `curs/repte-13.html` | El punt mig | C | ★★★ Avançat |

El document de referència complet dels reptes (mapes, solucions, notes pedagògiques)
és `curs/BRIEFING-REPTES.md`.

---

## 3. Vocabulari del llenguatge (sintaxi Python-compatible)

### Ordres (8)
```
move()  turn_left()  turn_right()  turn_around()  grab()  drop()
```
*(Nota: `turn_around()` és una ordre directa del motor, no cal definir-la amb `def`.)*

### Condicions (9)
```
front_is_clear()    front_is_blocked()
left_is_clear()     left_is_blocked()
right_is_clear()    right_is_blocked()
pearl_here()        bag_is_empty()      bag_is_full()
```

### Literals booleans
```
True    False
```

### Paraules clau estructurals
```
if  elif  else  while  for  in  range  def  not  and  or  break
```

### Estructures de control
```python
# Condicional (amb elif il·limitat)
if front_is_clear():
    move()
elif pearl_here():
    grab()
else:
    turn_left()

# Bucle comptat
for _ in range(N):
    move()

# Bucle condicional
while front_is_clear():
    move()

# Sortida anticipada
while True:
    move()
    if pearl_here():
        break

# Definició de procediment
def nom():
    move()
    turn_left()
```

**Indentació:** 2 espais per nivell (4 també acceptat; el tokenitzador detecta automàticament la unitat mínima).
**Comentaris:** `#` fins al final de línia.

### Decisions de semàntica importants
- `grab()` i `drop()` operen sobre la **casella actual** de Karel (no la del davant).
- `pearl_here()` reflecteix aquesta semàntica amb el sufix `_here`.
- `front_is_clear()` i `front_is_blocked()` miren la casella del davant.
- `left_is_clear()` mira esquerra relativa a l'orientació actual; `right_is_clear()` mira dreta relativa.
- `not front_is_clear()` i `front_is_blocked()` són equivalents; tots dos funcionen.

---

## 4. Format dels mapes

```
K>,.,A,P|.,.,.,.|.,.,.,P
```

| Caràcter | Significat |
|----------|------------|
| `.` | Casella buida |
| `,` | Separador de columnes |
| `\|` | **Separador de files** |
| `K>` | Karel mirant Est |
| `K^` | Karel mirant Nord |
| `Kv` | Karel mirant Sud |
| `K<` | Karel mirant Oest |
| `A` | Perla (recollible amb `grab()`) |
| `P` | Roca (obstacle infranquejable) |

**La primera fila** de la cadena és la **fila superior** del món.
**La última fila** és la fila inferior (on normalment comença en Karel).

**Separador de files: `|` (pipe).** `js/world.js` fa `.split('|')` a la línia 8.
Mai usar `\n`, `\\n` ni salts de línia reals — el mapa fallaria silenciosament.

### Atributs HTML dels simuladors

```html
<!-- Món únic -->
<div class="simulador"
     data-map="K>,.,A|.,P,."
     data-goal=".,.,K>|.,P,."
     data-bag="0"
     data-code="move()"
     data-label="Títol del simulador"
     data-height="260">
</div>

<!-- Múltiples mons (format DRY) -->
<div class="simulador"
     data-maps='["K>,.,A|.,P,.", "K>,.,.,A|.,P,.,P"]'
     data-goals='[".,.,K>|.,P,.", ".,.,.,K>|.,P,.,P"]'
     data-labels='["Test A", "Test B"]'
     data-code="while front_is_clear():
    move()
"
     data-label="Títol"
     data-height="300">
</div>
```

---

## 5. Arquitectura de fitxers i responsabilitats

```
index.html          — Simulador lliure. HTML mínim: topbar + toolbar + editor + món.
style.css           — ~698 línies. Sense zombies des de la neteja (Categoria C).
edit-mapa.html      — Editor visual de mapes (eina auxiliar, no és part del curs).

js/constants.js     — Namespace K, SVG assets, DIRS, CMD_ACTIONS, COND_ACTIONS,
                      SPEED_DELAYS, DEFAULT_CSV, DEFAULT_CODE, escHtml/sanitizeHtml.
js/i18n.js          — K.CODE_LANGS (vocabulari codi) + K.UI_LANGS (textos UI).
                      Funcions K.t(key) i K.tf(key, vars).
js/state.js         — K.state (estat centralitzat) + K.lang (tokens del parser actiu).
                      Funció K.applyCodeLang(lang).
js/tokenizer.js     — Funció pura K.tokenize(code) → array de tokens.
                      Detecta automàticament la unitat d'indentació.
js/parser.js        — Classe Parser + K.parseCode(code) → AST o null.
                      Suporta elif (cadena il·limitada), break, True/False.
js/interpreter.js   — Generadors K.runStmts/K.runStmt → yield {cmd,line} | {type:'error'}.
                      Propaga break via flag _break en while i for.
js/execution.js     — K.execAction, K.runProgram, K.stepProgram, K.stopProgram,
                      K.resetKarel. Reset de _break a l'inici d'execució.
js/world.js         — K.parseCSV (split per |), K.loadMapFromCSV, K.isRock,
                      K.getCell, K.setCell, K.front(), K.evalCond (inclou left/right),
                      K.worldToCSV, K.currentStateToCSV.
js/renderer.js      — K.renderWorld (diferencial), K.renderWorldFull, K.updateStatus.
js/editor.js        — Ressaltat sintàctic, numeració de línies, marca d'error,
                      autocompletat (Tab).
js/ui.js            — K.log, K.logError, K.setStateUI, K.updateUI,
                      K.initSpeedSlider, K.handleRunClick, K.toggleTheme, K.initTheme.
js/main.js          — IIFE d'inicialització. Llegeix URL params, connecta mòduls.
js/reptes.js        — K.REPTES[N]: 5 reptes predefinits per al simulador lliure
                      (accessibles via ?repte=N a index.html). Independents dels
                      reptes del curs (repte-N.html).

curs/index.html     — Índex del curs (10 capítols, estil Stanford).
curs/capitol.html   — Plantilla HTML reutilitzable per a capítols (comentada).
curs/capitol-1..10  — Els 10 capítols del curs. Tots implementats. ✅
curs/repte-1..13    — Els 13 reptes del capítol 10. Tots implementats. ✅
curs/capitols.js    — CAPITOLS_DATA (10) + REPTES_DATA (13) + renderSidebar() +
                      renderSimuladors() + toggle mòbil.
curs/curs.css       — Estils per a totes les pàgines del curs.
curs/AI_INSTRUCTIONS.md — Instruccions tècniques per a IA sobre el format de mapes.
curs/BRIEFING-REPTES.md — Estat detallat de cada repte (mapes, solucions, notes).
```

**Ordre de càrrega a `index.html`** (crític — les dependències globals K.* s'han de
carregar en aquest ordre):
```
constants.js → i18n.js → state.js → tokenizer.js → parser.js →
interpreter.js → world.js → renderer.js → editor.js → ui.js →
execution.js → reptes.js → main.js
```

### Contractes verificats
- **K.***: cada símbol `K.X` cridat des de qualsevol fitxer JS és definit en algun altre.
- **HTML↔JS**: cada `getElementById` al JS apunta a un ID que existeix a `index.html`.
- **Nomenclatura**: les paraules `wall` i `water` no existeixen en cap fitxer del projecte.

---

## 6. Interfície (disseny Stanford)

- **Fila 1 (topbar):** logo medusa + «Karel», badge d'estat (dot + text), motxilla, botó tema.
- **Fila 2 (toolbar):** botó mutant Executa↔Atura + botó Reinicia + slider velocitat.
- **Zona principal:** editor de codi (esquerra, 50%) + món de Karel (dreta, 50%).
- **Log:** sota l'editor, es buida automàticament a cada execució.
- **Eliminats definitivament:** modals, menú hamburguesa, selectors d'idioma, panells de pistes/referència, editor de mapes integrat, onboarding.

### Mode fosc/clar
Botó sol/lluna a la topbar. Preferència desada a `localStorage` (clau `'karel-theme'`).

---

## 7. Sistema i18n (dos eixos ortogonals)

- **`K.CODE_LANGS`** — vocabulari del llenguatge de programació. Ara: `en` (únic).
- **`K.UI_LANGS`** — textos de la interfície. Ara: `ca` (únic).
- `K.state.codeLang` i `K.state.uiLang` controlen quin idioma s'usa a cada eix.
- Afegir un idioma nou és **additiu** (afegir una entrada a l'objecte corresponent).

---

## 8. Tasques pendents

### Categoria D — Millores visuals (prioritat mitjana)

| # | Tasca | Detall |
|---|-------|--------|
| D.1 | Perla en mode clar | El SVG de la perla té píxels blancs purs que desapareixen sobre fons blanc. Revisar el sprite. |
| D.2 | Emoji motxilla | Decidir si afegir ⚪ al costat del comptador numèric. |
| D.3 | Responsive mòbil | Verificar les mediaqueries (820px, 600px) amb el layout 50/50. |
| D.4 | Favicon | Afegir la medusa rosa com a favicon de la pàgina. |

### Categoria E — Funcionalitat futura (prioritat baixa)

| # | Tasca | Detall |
|---|-------|--------|
| E.1 | Idioma codi català | Afegir `K.CODE_LANGS.ca` amb `mentre`, `si`, `sinó`, `repeteix`, etc. |
| E.2 | Idioma codi castellà | Afegir `K.CODE_LANGS.es`. |
| E.3 | Idioma interfície anglès | Afegir `K.UI_LANGS.en`. |
| E.4 | Idioma interfície castellà | Afegir `K.UI_LANGS.es`. |
| E.5 | Selector d'idioma | UI per triar `codeLang` i `uiLang` (ara fixats a `state.js`). |
| E.6 | Editor de mapes | Recuperar l'editor visual (eliminat a la neteja). `edit-mapa.html` ja existeix com a eina separada. |
| E.7 | Càrrega CSV extern | Recuperar `?mapa=CSV` a la URL o input file. |
| E.8 | Reptes predefinits al curs | Exposar els 13 reptes del curs via `?repte=N` a `index.html` (additiu a `reptes.js`). |

---

## 9. Principis de disseny a respectar

1. **Netedat Stanford:** si dubtes entre afegir un element a la interfície o no, no l'afegis.
2. **Ortogonalitat d'idiomes:** `codeLang` i `uiLang` independents. Mai barrejar tokens del codi amb textos de la interfície.
3. **Coherència terminològica:** roques i perles. Les paraules `wall` i `water` no han d'aparèixer mai.
4. **Semàntica canònica:** `grab()` i `drop()` operen sobre la casella actual. `pearl_here()` en referència a la casella on és Karel.
5. **Escalabilitat additiva:** afegir un idioma, capítol, repte o mode ha de ser additiu (afegir codi), mai invasiu (modificar codi existent).
6. **L'alumne és un adolescent català de 16 anys** sense experiència, en una classe de 40 minuts.
7. **Python primer:** qualsevol programa Karel vàlid ha de ser Python vàlid. En cas de dubte sintàctic, el criteri és la compatibilitat amb Python.

---

## 10. Checklist per a qualsevol modificació

Abans de fer qualsevol canvi:

- [ ] El canvi és **additiu** o **invasiu**? Preferir sempre additiu.
- [ ] Si modifiques `i18n.js`: has mantingut la paritat d'ordre entre `commands[]` i `K.CMD_ACTIONS`? Entre `conditions[]` i `K.COND_ACTIONS`?
- [ ] Si afegeixes un script nou: l'has inclòs a `index.html` en la posició correcta? Has exportat totes les funcions via `K.nomFuncio`?
- [ ] Si modifiques el parser o tokenitzador: `for _ in range(10): move()` i `for i in range(3):\n    move()` segueixen funcionant tots dos?
- [ ] Si modifiques `execution.js`: els errors de runtime es comuniquen via `errStop()` o `yield {type:'error'}`, no via `throw`?
- [ ] Els mapes dels simuladors usen `|` com a separador de files (no `\n`)?
- [ ] Les paraules `wall` i `water` no han aparegut en cap fitxer?
- [ ] Has actualitzat aquest document (`CURRENT-STATE.md`) si has canviat l'estat de qualsevol tasca?

---

## 11. Guia de documents del projecte

| Document | Propòsit | Estat |
|----------|----------|-------|
| `docs/CURRENT-STATE.md` | **Aquest fitxer.** Font única de veritat. | ✅ Actiu |
| `docs/auditoria.md` | Arquitectura interna detallada, riscos, checklist tècnic. | ✅ Actiu |
| `curs/AI_INSTRUCTIONS.md` | Format de mapes per a IA (separador `\|`, atributs HTML). | ✅ Actiu |
| `curs/BRIEFING-REPTES.md` | Detall de cada repte: mapes, solucions, notes pedagògiques. | ✅ Actiu |
| `docs/MIGRATION-PYTHON-SYNTAX.md` | Registre de la migració a sintaxi Python (abril 2026). | 📦 Arxivat |
| `docs/PROGRES-MIGRACIO.md` | Progrés de la migració (abril 2026). | 📦 Arxivat |

---

*Última actualització: sessió post-patch — curs complet (10 capítols + 13 reptes), vocabulari ampliat (elif, break, left/right_is_clear, True/False), CURRENT-STATE.md creat com a font única de veritat.*
