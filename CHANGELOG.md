# PATCH — Proposta d'ampliació pedagògica aplicada

## Instruccions
Copia el contingut de `karelcat-main/` sobre el teu repositori existent.
Els fitxers **substitueixen** els originals (mateixa ruta, mateix nom).
Els fitxers **nous** s'afegeixen sense conflicte.

## 19 fitxers en total

### Motor JS (7 fitxers modificats)

| Fitxer | Canvi |
|--------|-------|
| `js/i18n.js` | +4 condicions (`left_is_clear`, `right_is_clear`, `left_is_blocked`, `right_is_blocked`), +4 keywords (`elif`, `break`, `True`, `False`) |
| `js/constants.js` | `COND_ACTIONS` ampliat amb 4 accions direccionals noves |
| `js/state.js` | +`KW_ELIF` al lang, +`_break` flag a l'estat |
| `js/world.js` | +funcions `left()`, `right()`; +6 cases nous a `evalCond()`; +`bool_literal` |
| `js/parser.js` | Suport complet per `elif` (cadena il·limitada), `break`, `True`/`False` literals |
| `js/interpreter.js` | Propagació de `break` via flag `_break` en `while` i `for` |
| `js/execution.js` | Reset `_break` a l'inici d'execució |

### Capítols (4 fitxers: 2 corregits, 1 reescrit, 1 nou)

| Fitxer | Canvi |
|--------|-------|
| `curs/capitol-3.html` | Fix: "els dos espais del davant" → "els espais del davant" |
| `curs/capitol-4.html` | Fix: "reconeixarà" → "reconeixerà" |
| `curs/capitol-9.html` | **REESCRIT**: "El vocabulari complet d'en Karel" (turn_around, _, left/right_is_clear, elif) |
| `curs/capitol-10.html` | **NOU**: "Del Karel al Python" (epíleg, pont al món real, sense simulador) |

### Reptes (7 fitxers: 1 corregit, 3 nous, 3 renumerats)

| Fitxer | Canvi |
|--------|-------|
| `curs/repte-1.html` | Fix: link prev → capitol-10.html |
| `curs/repte-8.html` | **NOU**: "El vigilant" ★★ (perímetre rectangular, drop com a marca) |
| `curs/repte-9.html` | **NOU**: "Les files alternes" ★★ (serpentí multifiles sense paritat) |
| `curs/repte-10.html` | **NOU**: "El detector" ★★★ (alcoves laterals, left/right_is_clear, fencepost) |
| `curs/repte-11.html` | Antic repte-8 "El tauler d'escacs" renumerat (nav actualitzada) |
| `curs/repte-12.html` | Antic repte-9 "El laberint" renumerat (nav actualitzada) |
| `curs/repte-13.html` | Antic repte-10 "El punt mig" renumerat (nav actualitzada) |

### Sidebar (1 fitxer)

| Fitxer | Canvi |
|--------|-------|
| `curs/capitols.js` | `CAPITOLS_DATA` +1 (cap. 10), `REPTES_DATA` +3 (reptes 8,9,10 nous + renumeració 11,12,13) |

## Seqüència resultant

**Capítols (10):**
1 Coneix en Karel → 2 Agafa i deixa → 3 Repeteix → 4 Procediments →
5 Descomposició → 6 Condicionals → 7 Mentre → 8 Combinant condicions →
9 El vocabulari complet (NOU) → 10 Del Karel al Python (NOU)

**Reptes (13):**
1 El diari ★ → 2 El passadís ★ → 3 L'escala diagonal ★ → 4 Distribuir les perles ★ →
5 El serpentí ★★ → 6 Construir torres ★★ → 7 L'escala doble ★★ →
8 El vigilant ★★ (NOU) → 9 Les files alternes ★★ (NOU) → 10 El detector ★★★ (NOU) →
11 El tauler d'escacs ★★★ → 12 El laberint ★★★ → 13 El punt mig ★★★
