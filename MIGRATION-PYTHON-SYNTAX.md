# MIGRATION: Karel → Python-compliant syntax
**Document tècnic per a IA. Versió de referència del codi: `karelcat-main` (zip de partida).**

---

## 0. Filosofia del canvi

El projecte Karel cat adoptava un llenguatge propi minimalista (sense parèntesis, sense `def`, blocs amb `{ }`). La nova filosofia és que **el dialecte Karel ha de ser un subconjunt vàlid de Python**: qualsevol programa Karel vàlid ha de poder enganxar-se a un intèrpret Python real (amb un shim previ que defineixi `move`, `turn_left`, etc.) i executar-se sense errors de sintaxi.

Això implica:
- Ordres amb parèntesis obligatoris: `move()` en lloc de `move`
- Definicions de procediment amb `def nom():` en lloc de `proc nom { }`
- Blocs per indentació (2 espais), no per `{ }`
- Bucles `for _ in range(N):` en lloc de `repeat(N) { }`
- Condicionals `if condicio():` / `else:` sense `{ }`
- Bucle `while condicio():` sense `{ }`
- Condicions amb parèntesis: `front_is_clear()` en lloc de `path_clear`
- `not condicio()` → `not condicio()` (igual, però la condició porta `()`)
- `and` / `or` igual que ara (ja són Python-compatibles)
- Comentaris `#` en lloc de `//`

---

## 1. Inventari complet de fitxers afectats

```
karelcat-main/
├── js/
│   ├── constants.js       ✦ canvia  (DEFAULT_CODE, noms interns CMD_ACTIONS/COND_ACTIONS)
│   ├── i18n.js            ✦ canvia  (tot el vocabulari del CODE_LANGS.en)
│   ├── tokenizer.js       ✦ canvia  (ha de reconèixer ':', '#', indentació)
│   ├── parser.js          ✦ canvia  (gramàtica completa: blocs per indent, `def`, `for`, `:`)
│   ├── interpreter.js     — no canvia (treballa sobre l'AST, agnòstic a la sintaxi)
│   ├── execution.js       — no canvia
│   ├── world.js           — no canvia
│   ├── state.js           — no canvia
│   ├── renderer.js        — no canvia
│   ├── ui.js              — no canvia
│   ├── editor.js          ✦ canvia  (ressaltat sintàctic: noves paraules clau, `#`, `:`)
│   ├── main.js            ✦ canvia  (DEFAULT_CODE inline, missatge log initial)
│   └── reptes.js          ✦ canvia  (tot el data-code dels reptes predefinits)
├── curs/
│   ├── capitols.js        — no canvia
│   ├── capitol-1.html     ✦ canvia  (tots els data-code i tots els <code> inline)
│   ├── capitol-2.html     ✦ canvia  (ídem)
│   └── (capitol-3..10)    ✦ canvien quan es creïn
└── index.html             — no canvia (no conté codi Karel)
```

---

## 2. Especificació completa de la nova sintaxi

### 2.1 Ordres (commands)

| Antic | Nou |
|---|---|
| `move` | `move()` |
| `turn_left` | `turn_left()` |
| `turn_right` | `turn_right()` |
| `turn_around` | `turn_around()` |
| `grab` | `grab()` |
| `drop` | `drop()` |

### 2.2 Condicions (conditions)

| Antic | Nou |
|---|---|
| `path_clear` | `front_is_clear()` |
| `rock_ahead` | `front_is_blocked()` |
| `pearl_here` | `pearl_here()` |
| `bag_empty` | `bag_is_empty()` |
| `bag_full` | `bag_is_full()` |

Nota: els noms de les condicions canvien per ser més llegibles en Python (`front_is_clear()` és molt més clar que `path_clear`). Això és una decisió de nomenclatura, no de sintaxi, però s'aprofita la migració per fer-ho.

### 2.3 Estructures de control

**Condicional:**
```python
# Antic
if (path_clear) {
  move
}

# Nou
if front_is_clear():
    move()
```

**Condicional amb else:**
```python
# Antic
if (pearl_here) {
  grab
} else {
  move
}

# Nou
if pearl_here():
    grab()
else:
    move()
```

**Bucle comptat:**
```python
# Antic
repeat(4) {
  move
}

# Nou
for _ in range(4):
    move()
```

**Bucle condicional:**
```python
# Antic
while (path_clear) {
  move
}

# Nou
while front_is_clear():
    move()
```

### 2.4 Procediments

```python
# Antic
proc avança_tres {
  move
  move
  move
}
avança_tres

# Nou
def avança_tres():
    move()
    move()
    move()

avança_tres()
```

### 2.5 Operadors lògics

```python
# Antic
if (path_clear and pearl_here) { ... }
if (not(bag_empty)) { ... }

# Nou
if front_is_clear() and pearl_here():
    ...
if not bag_is_empty():
    ...
```

### 2.6 Comentaris

```python
# Antic
// Això és un comentari

# Nou
# Això és un comentari
```

---

## 3. Canvis per fitxer — especificació detallada

### 3.1 `js/i18n.js` — Vocabulari del llenguatge

**Localització:** objecte `K.CODE_LANGS.en`.

Substituir tot el bloc `en: { ... }` per:

```javascript
en: {
  _name: 'English (Python)',
  commands:   ['move','turn_left','turn_right','turn_around','grab','drop'],
  conditions: ['front_is_clear','front_is_blocked','pearl_here','bag_is_empty','bag_is_full'],
  keywords:   ['if','else','while','for','in','range','def','not','and','or'],
  if_kw:      'if',
  else_kw:    ['else'],
  while_kw:   'while',
  for_kw:     'for',
  in_kw:      'in',
  range_kw:   'range',
  def_kw:     'def',
  not_kw:     'not',
  and_kw:     'and',
  or_kw:      'or',
},
```

**Notes:**
- `repeat` desapareix; ara és `for _ in range(N):`.
- `proc` desapareix; ara és `def nom():`.
- S'afegeixen `for`, `in`, `range` com a keywords per al ressaltat.

---

### 3.2 `js/tokenizer.js` — Tokenitzador

El tokenitzador actual funciona per **caràcters especials** (`{}()`) i paraules. La nova sintaxi elimina `{}` i afegeix `:` i `#`. Cal reescriure'l completament.

**Nous tipus de token que cal emetre:**

| Token | `t` | `v` | Notes |
|---|---|---|---|
| Paraula/keyword | `'W'` | string | igual que ara |
| Número | `'N'` | int | igual que ara |
| `(` | `'('` | — | igual que ara |
| `)` | `')'` | — | igual que ara |
| `:` | `':'` | — | NOU: marca final de capçalera |
| `_` | `'W'` | `'_'` | NOU: variable de bucle throw-away |
| NEWLINE significatiu | `'NL'` | — | NOU: necessari per delimitar blocs |
| INDENT | `'INDENT'` | int (nivell) | NOU: nivell d'indentació (en espais/2) |
| EOF | `'EOF'` | — | igual que ara |

**Comportament nou:**

1. **Comentaris `#`:** ignorar des de `#` fins al final de línia (igual que `//` ara).
2. **Caràcter `:`:** emetre token `{ t: ':', line }`.
3. **Caràcter `_`:** tractar com a paraula `W` amb valor `'_'` (variable throw-away del `for`).
4. **Indentació:** al principi de cada línia no buida, comptar espais i emetre `{ t: 'INDENT', v: nivell, line }` on `nivell = espais / 2` (assumint indentació de 2 espais; acceptar també 4).
5. **Línies buides:** ignorar completament (no emetre INDENT ni NL).
6. **NEWLINE:** emetre `{ t: 'NL', line }` al final de cada línia no buida.

**Eliminar:** suport per a `{` i `}`.

---

### 3.3 `js/parser.js` — Parser

El parser actual és un parser de descens recursiu basat en `{ }`. Cal reescriure'l per a gramàtica basada en indentació (com Python).

#### 3.3.1 Gestió d'indentació

Afegir al `Parser`:
```javascript
// Pila d'indentació: comença a [0]
this.indentStack = [0];

// Retorna el nivell d'indentació actual del token
currentIndent() { ... }

// Parseja un bloc: tots els statements amb indent > indentStack.top
parseBlock(expectedIndent) { ... }
```

**Algoritme `parseBlock(parentIndent)`:**
1. El primer token de la primera línia del bloc determina `blockIndent`.
2. `blockIndent` ha de ser > `parentIndent`, altrament error.
3. Consumir tots els statements que comencin amb `INDENT` de valor `blockIndent`.
4. Quan es troba un `INDENT` < `blockIndent` o `EOF`, tancar el bloc i retornar.

#### 3.3.2 Nous `parseStmt`

**`if`:**
```
if condicio():  NL
    bloc
[else:  NL
    bloc]
```
- Consumir `if`, parèntesi `(`, condició, `)`, `:`, `NL`.
- Cridar `parseBlock`.
- Si el següent token és `INDENT` al mateix nivell i `else`, consumir `else`, `:`, `NL`, `parseBlock`.

**`while`:**
```
while condicio():  NL
    bloc
```
- Consumir `while`, `(`, condició, `)`, `:`, `NL`.
- Cridar `parseBlock`.

**`for`:**
```
for _ in range(N):  NL
    bloc
```
- Consumir `for`, `_` (W), `in`, `range`, `(`, N (número), `)`, `:`, `NL`.
- Cridar `parseBlock`.
- Emetre node `{ type: 'repeat', count: N, body: bloc }` (l'intèrpret no necessita saber que era un `for`).

**`def`:**
```
def nom():  NL
    bloc
```
- Consumir `def`, nom (W), `(`, `)`, `:`, `NL`.
- Cridar `parseBlock`.
- Emetre node `{ type: 'proc', name: nom, body: bloc }`.

**Command `move()` etc.:**
```
move()
```
- Consumir paraula (W), `(`, `)`.
- Emetre node `{ type: 'command', name: paraula }`.

**Crida a procediment `nom()`:**
```
nom()
```
- Igual que command però la paraula no és un command built-in.
- Emetre node `{ type: 'call', name: nom }`.

#### 3.3.3 `parseAtomCond`

Les condicions ara porten `()`:
```
front_is_clear()
```
- Consumir nom (W), `(`, `)`.
- Verificar que el nom és una condició coneguda.
- Emetre `{ type: 'condition', name: nom }`.

**`not`:**
```
not front_is_clear()
```
- Consumir `not`. **No consumir `(`** (el `not` de Python no porta parèntesis propis).
- Parsejar la condició atòmica directament.
- Emetre `{ type: 'not', inner: condicio }`.

---

### 3.4 `js/editor.js` — Ressaltat sintàctic

**Funció `tokenizeLine`:** adaptar per a la nova sintaxi.

Canvis:
1. **Comentaris:** detectar `#` en lloc de `//`. Tot el que va de `#` al final de la línia és `hl-cm`.
2. **Caràcters especials:** afegir `:` a la llista de caràcters que emeten `hl-br` (o una classe pròpia `hl-colon`).
3. **Eliminar** `{` i `}` de la llista de caràcters especials.
4. **Keywords nous:** `for`, `in`, `range`, `def`, `_` han d'aparèixer a `L.KEYWORDS` per ser ressaltats com `hl-kw`.
5. **Indentació:** els espais inicials no es toquen (es preserven tal qual al `<pre>`).

---

### 3.5 `js/constants.js` — Valors per defecte

**`DEFAULT_CODE`:** actualitzar a sintaxi Python:
```javascript
const DEFAULT_CODE = `# Benvingut a Karel!\n# Prem Executa per veure en Karel moure's\n\nmove()\nmove()\n`;
```

**`CMD_ACTIONS` i `COND_ACTIONS`:** aquests arrays defineixen l'acció interna (agnòstica al llenguatge) que correspon a cada posició. Com que els noms canvien, cal assegurar que la correspondència posicional a `state.js::applyCodeLang` segueix sent correcta:

```javascript
// Ordre ha de coincidir amb i18n.js commands[] i conditions[]
const CMD_ACTIONS  = ['move','turn-right','turn-left','turn-around','grab','drop'];
// Nou ordre de condicions (coincideix amb el nou conditions[] de i18n.js):
const COND_ACTIONS = ['path-clear','rock-ahead','pearl-here','bag-empty','bag-full'];
```

Nota: `front_is_clear` → acció interna `path-clear`, `front_is_blocked` → `rock-ahead`. Els noms d'acció interna **no cal canviar-los** (l'intèrpret els usa internament i l'usuari mai els veu).

---

### 3.6 `js/reptes.js` — Reptes predefinits

Tots els `code:` han de passar a sintaxi Python. Els comentaris inicials passen de `//` a `#`. Els templates buits:

```javascript
// Exemple repte 1 (el codi de l'alumne comença buit, però el comentari canvia)
code: `# Repte 1: Primers passos\n# Porta en Karel fins a la perla i recull-la.\n\n`,
```

---

### 3.7 `curs/capitol-1.html` i `capitol-2.html` — Contingut dels capítols

**Tots els `data-code` dels divs `.simulador`:** convertir a sintaxi nova.

Exemples de conversió:

```
# Antic (atribut HTML)
data-code="move\nmove\nmove\n"

# Nou
data-code="move()\nmove()\nmove()\n"
```

```
# Antic
data-code="move\nmove\nturn_left\nmove\nmove\n"

# Nou
data-code="move()\nmove()\nturn_left()\nmove()\nmove()\n"
```

**Tots els `<code>` inline en el text HTML:** actualitzar per mostrar la nova sintaxi. Cercar i substituir:
- `<code>move</code>` → `<code>move()</code>`
- `<code>turn_left</code>` → `<code>turn_left()</code>`
- `<code>turn_right</code>` → `<code>turn_right()</code>`
- `<code>grab</code>` → `<code>grab()</code>`
- `<code>drop</code>` → `<code>drop()</code>`
- `<code>path_clear</code>` → `<code>front_is_clear()</code>`
- `<code>pearl_here</code>` → `<code>pearl_here()</code>`
- etc.

**Tot el text explicatiu** que mencioni la sintaxi antiga (ex: "escriu `move`") ha d'actualitzar-se per mencionar la nova (`move()`).

---

## 4. Fitxers que NO canvien i per què

| Fitxer | Raó |
|---|---|
| `interpreter.js` | Treballa sobre l'AST. Els nodes `command`, `if`, `while`, `repeat`, `proc`, `call` no canvien d'estructura. |
| `execution.js` | Consumeix yields de l'intèrpret. Agnòstic a la sintaxi. |
| `world.js` | Gestió del món i `evalCond`. Treballa sobre l'AST de condicions, no sobre text. |
| `state.js` | Estat pur. El canvi de noms en `i18n.js` es propaga via `applyCodeLang`. |
| `renderer.js` | Renderitzat visual. Cap dependència de sintaxi. |
| `ui.js` | Interfície. Cap dependència de sintaxi. |
| `main.js` | Només caldrà actualitzar el `DEFAULT_CODE` inline si s'usa, però la lògica no canvia. |
| `curs/capitols.js` | Lògica de capítols i iframes. Cap dependència de sintaxi. |
| `index.html` | No conté codi Karel. |
| `style.css` / `curs/curs.css` | Estils visuals. |

---

## 5. Ordre d'implementació recomanat

1. **`js/i18n.js`** — Definir el nou vocabulari. És la font de veritat dels tokens.
2. **`js/constants.js`** — Actualitzar `DEFAULT_CODE` i verificar `CMD_ACTIONS`/`COND_ACTIONS`.
3. **`js/tokenizer.js`** — Reescriure per a la nova sintaxi (indentació, `:`, `#`, `()`).
4. **`js/parser.js`** — Reescriure la gramàtica per indentació.
5. **`js/editor.js`** — Adaptar el ressaltat sintàctic.
6. **`js/reptes.js`** — Actualitzar tots els `code:` de reptes.
7. **`curs/capitol-1.html`** — Actualitzar `data-code` i textos inline.
8. **`curs/capitol-2.html`** — Ídem.

---

## 6. Tests de regressió mínims

Després de la migració, els següents programes han de parsejar i executar sense error:

```python
# Test 1: ordre simple
move()
```

```python
# Test 2: múltiples ordres
move()
turn_left()
move()
```

```python
# Test 3: procediment i crida
def avança_tres():
    move()
    move()
    move()

avança_tres()
```

```python
# Test 4: bucle comptat
for _ in range(4):
    move()
    turn_left()
```

```python
# Test 5: condicional
if front_is_clear():
    move()
else:
    turn_left()
```

```python
# Test 6: while
while front_is_clear():
    move()
```

```python
# Test 7: operadors lògics
if front_is_clear() and not pearl_here():
    move()
```

```python
# Test 8: procediments niuats + for + while
def omple_fila():
    while front_is_clear():
        drop()
        move()

for _ in range(3):
    omple_fila()
    turn_left()
    move()
    turn_left()
```

---

## 7. Decisions de disseny que cal respectar

1. **Indentació de 2 o 4 espais:** el tokenitzador ha d'acceptar ambdues, però el codi que es mostra als exemples dels capítols usarà **4 espais** (convenció Python estàndard).
2. **`for _ in range(N):`:** la variable `_` és l'única variable de bucle acceptada. El parser **no ha de suportar** noms de variable arbitraris al `for` (Karel no té variables).
3. **No suportar `pass`:** si un bloc és buit, no cal `pass`. Un `def` o `if` buit és un error de l'alumne.
4. **`not` sense parèntesis propis:** `not front_is_clear()` és vàlid. `not(front_is_clear())` també ha de ser vàlid (per compatibilitat Python), però no és el que es mostrarà als exemples.
5. **El `_` del `for`:** s'ha de tractar com una paraula reservada, no com a nom de procediment.
6. **Compatibilitat del `data-code` als iframes:** el mòdul `curs/capitols.js` codifica `data-code` en base64 i el passa com a paràmetre URL. Cap canvi necessari aquí; el que canvia és el contingut de la cadena, no el mecanisme de transport.
