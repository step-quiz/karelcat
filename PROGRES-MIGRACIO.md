# ESTAT DE LA MIGRACIÓ — Karel → Python syntax
> Última actualització: Fase 1-2 completades

---

## Resum visual de fases

| # | Fitxer | Estat | Complexitat | Bloc si falla |
|---|---|---|---|---|
| 1 | `js/i18n.js` | ✅ **FET** | Baixa | Tot |
| 2 | `js/constants.js` | ✅ **FET** | Baixa | Tot |
| 3 | `js/tokenizer.js` | ✅ **FET** | Alta | Parser |
| 4 | `js/parser.js` | ✅ **FET** | Alta | Tot el curs |
| 4b | `js/state.js` | ✅ **FET** (canvi mínim no previst) | Baixa | Tot |
| 5 | `js/editor.js` | ✅ **FET** | Mitjana | Ressaltat |
| 6 | `js/reptes.js` | ✅ **FET** | Baixa | Reptes |
| 7 | `curs/capitol-1.html` | ✅ **FET** | Baixa (mecànica) | Capítol 1 |
| 8 | `curs/capitol-2.html` | ✅ **FET** | Baixa (mecànica) | Capítol 2 |

**Fitxers que NO cal tocar:** `interpreter.js`, `execution.js`, `world.js`, `state.js`, `renderer.js`, `ui.js`, `main.js`, `capitols.js`, `index.html`, `style.css`.

---

## Dependències entre fases

```
[1] i18n.js       ──┐
[2] constants.js  ──┤──► [3] tokenizer.js ──► [4] parser.js ──► [5] editor.js
                                                      │
                                                      ▼
                                          [6] reptes.js
                                          [7] capitol-1.html
                                          [8] capitol-2.html
```

**Risc crític:** les fases 3 i 4 (tokenizer + parser) s'han de completar senceres. Un fitxer a mig fer deixa el sistema inoperable.

---

## Detall dels canvis fets

### ✅ Fase 1 — `js/i18n.js`

**Canvis al bloc `K.CODE_LANGS.en`:**

- `_name`: `'English'` → `'English (Python)'`
- `commands`: ordre corregit a `['move','turn_left','turn_right','turn_around','grab','drop']` (turn_left ara va abans de turn_right per coincidir amb `CMD_ACTIONS`)
- `conditions`: substituïts tots els noms antics pels nous:
  - `rock_ahead` → `front_is_blocked`
  - `path_clear` → `front_is_clear`
  - `bag_empty` → `bag_is_empty`
  - `bag_full` → `bag_is_full`
  - `pearl_here` → `pearl_here` *(igual, però ara porta `()` en l'ús)*
- `keywords`: eliminats `repeat` i `proc`; afegits `for`, `in`, `range`, `def`
- Eliminades les claus `repeat_kw` i `proc_kw`
- Afegides les claus `for_kw`, `in_kw`, `range_kw`, `def_kw`
- La resta del fitxer (`UI_LANGS`, funcions `t`/`tf`) és **idèntica** a l'original

---

### ✅ Fase 2 — `js/constants.js`

**Canvis:**

- `DEFAULT_CODE`: comentaris `//` → `#`; `move` → `move()`
- `CMD_ACTIONS`: corregit l'ordre per coincidir amb el nou `commands[]` de i18n.js → `['move','turn-left','turn-right','turn-around','grab','drop']`
  - ⚠️ Atenció: a l'original l'ordre era `turn-right` abans de `turn-left`. S'ha corregit per ser consistent amb i18n.js.
- `COND_ACTIONS`: l'ordre es manté consistent amb el nou `conditions[]` → `['path-clear','rock-ahead','pearl-here','bag-empty','bag-full']`
  - ⚠️ Atenció: a l'original `rock-ahead` era el primer i `path-clear` el segon. S'ha intercanviat per coincidir amb el nou ordre de `conditions[]` (`front_is_clear` primer, `front_is_blocked` segon).
- Assets gràfics (`MEDUSA`, `ROCK`, `PEARL`): **sense canvis**
- La resta del fitxer és **idèntica** a l'original

---

## ⚠️ Decisions importants preses

1. **Ordre de `CMD_ACTIONS` i `COND_ACTIONS`:** aquests arrays han de coincidir posicionalment amb `commands[]` i `conditions[]` de `i18n.js`. S'ha prioritzat la coherència sobre la compatibilitat amb l'ordre original.

2. **Noms interns no canvien:** `path-clear`, `rock-ahead`, etc. són noms interns de l'intèrpret. Canviar-los requeriria tocar `interpreter.js` i `world.js`, que queden fora d'abast.

---

---

### ✅ Fase 3 — `js/tokenizer.js`

**Reescriptura completa.** L'algoritme original era un bucle de caràcters sense consciència de línies. El nou processa línia a línia.

Canvis principals:
- **Eliminat** suport per `{` i `}` (ja no existeixen a la sintaxi)
- **Eliminat** reconeixement de comentaris `//`
- **Afegit** reconeixement de `#` com a inici de comentari: tot el que va de `#` al final de línia s'ignora
- **Afegit** token `INDENT` al principi de cada línia no buida: `{ t: 'INDENT', v: nivell }` on `nivell = round(espais / 2)`. Accepta indentació de 2 o 4 espais.
- **Afegit** token `NL` al final de cada línia no buida
- **Afegit** token `:` per marcar el final de capçaleres (`if`, `while`, `for`, `def`)
- **Afegit** suport Unicode (`\u00C0-\u024F`) per a noms de procediment amb caràcters accentuats (`avança_tres`, etc.)
- `_` es tokenitza com a `W` amb valor `'_'` (variable throw-away del `for`)
- Línies buides i línies que eren només comentari s'ignoren completament

**Verificat** amb els 8 tests de regressió del document de migració: tots produeixen la seqüència de tokens esperada.

---

---

### ✅ Fase 4 — `js/parser.js`

**Reescriptura completa.** El parser original era recursiu basat en `{ }`. El nou usa indentació.

Canvis principals:
- **`peek(offset)`** permet mirar 2 tokens endavant sense consumir, necessari per detectar `else` al mateix nivell d'indentació sense backtracking.
- **`peekIndent()`** retorna el nivell del pròxim INDENT (o -1 si EOF).
- **`parseStmtsAt(level)`** consumeix totes les instruccions al nivell exacte `level`.
- **`parseBlock(parentIndent)`** troba el primer INDENT > parentIndent i parseja el bloc. Bloc buit = error sintàctic.
- **`parseStmt(myIndent)`** rep el seu propi nivell per poder detectar `else` al mateix nivell sense tornar al bucle.
- `repeat(N) { }` → `for _ in range(N):` → node AST `{ type: 'repeat' }` (intèrpret no canvia).
- `proc nom { }` → `def nom():` → node AST `{ type: 'proc' }` (intèrpret no canvia).
- Condicions ara porten `()`: `parseAtomCond` consumeix `nom ( )`.
- `not` sense parèntesis propis (`not cond()`), però `not(cond())` també acceptat (Python-compatible).

**Verificat** amb els 8 tests de regressió: tots 8 passen i produeixen el tipus AST correcte.

---

### ✅ Fase 4b — `js/state.js` (canvi mínim, no previst al document original)

**Problema detectat:** `state.js::applyCodeLang` llegia `tk.repeat_kw` i `tk.proc_kw` que ja no existeixen a `i18n.js`. Sense aquest canvi, `K.lang.KW_REPEAT` i `K.lang.KW_PROC` serien `undefined` i el parser no reconeixeria `for` ni `def`.

**Canvis mínims:**
- `K.lang`: substituïts `KW_REPEAT` i `KW_PROC` per `KW_FOR`, `KW_IN`, `KW_RANGE`, `KW_DEF`
- `applyCodeLang`: actualitzades les assignacions per llegir les noves claus de `i18n.js`

Cap altra línia de `state.js` ha canviat.

---

---

### ✅ Fase 5 — `js/editor.js`

Tres canvis quirúrgics a `tokenizeLine` i `highlightCode`. La resta del fitxer (numeració, scroll, autocomplete, dreceres) és **idèntic** a l'original.

- `'{}()'.includes(c)` → `'():'.includes(c)`: elimina `{}`; afegeix `:` com a caràcter de bracket ressaltat amb `hl-br`
- Stop-chars de paraules: `[\s{}()\/]` → `[\s():\/]` perquè `:` ara delimita paraules
- Detecció de comentari: `line.indexOf('//')` → `line.indexOf('#')`
- `_` (variable throw-away del `for`) ressaltat com `hl-kw` explícitament (no estava als keywords de i18n)

---

### ✅ Fase 6 — `js/reptes.js`

Canvi mecànic als 5 reptes: comentaris `//` → `#` als camps `code:`. Els mapes i enunciats no canvien. El codi dels reptes és sempre una plantilla buida (l'alumne escriu la solució), de manera que no hi havia comandaments a convertir.

---

### ✅ Fase 7 — `curs/capitol-1.html`

- 3 títols `<h2>` amb `<code>`: `move` → `move()`, `turn_left` → `turn_left()`, `turn_right` → `turn_right()`
- Tots els `<code>` inline al cos del text actualitzats
- 3 `data-code` de simuladors convertits a sintaxi Python
- 1 `data-code` d'exercici: comentari `//` → `#`

---

### ✅ Fase 8 — `curs/capitol-2.html`

- Capçalera `chapter-lead`: `grab`, `drop`, `pearl_here` → amb `()`
- 3 títols `<h2>` actualitzats
- Tots els `<code>` inline actualitzats
- 3 `data-code` de simuladors convertits
- 1 `data-code` d'exercici: comentari `//` → `#`

---

## 🎉 MIGRACIÓ COMPLETA

Tots els fitxers previstos han estat migrats i verificats. Fitxers no tocats (com estava previst): `interpreter.js`, `execution.js`, `world.js`, `renderer.js`, `ui.js`, `main.js`, `capitols.js`, `index.html`, `style.css`.

**Canvi no previst però necessari:** `state.js` (fase 4b) — canvi mínim a `K.lang` i `applyCodeLang`.

Canvis necessaris:
- Eliminar suport per `{` i `}`
- Afegir reconeixement de `:` com a token `':'`
- Afegir reconeixement de `#` com a inici de comentari (en lloc de `//`)
- Emetre tokens `INDENT` al principi de cada línia (nivell = espais / 2)
- Emetre tokens `NL` al final de cada línia no buida
- Tractar `_` com a paraula `W` (variable throw-away del `for`)
