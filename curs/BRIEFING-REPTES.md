# BRIEFING-REPTES — Capítol 10 de Karelcat

> **Propòsit d'aquest document:** registrar l'estat de la implementació dels 10 reptes del capítol 10. Cada sessió de treball ha d'actualitzar la taula d'estat i les notes de cada repte implementat abans de tancar. Un BRIEFING obsolet és més perillós que no tenir-ne.

---

## Context ràpid

- **Projecte:** karelcat — curs interactiu de Karel en català, temàtica marina.
- **Capítol 10:** no introdueix sintaxi nova. L'alumne combina tot el que sap. Inspirat en els exercicis de Stanford CS106A / Code in Place.
- **Document de disseny de referència:** `docs/reptes.docx` (conté enunciats, mapes, principis pedagògics i ordre recomanat d'implementació).
- **Plantilla HTML:** `curs/capitol.html` (cada repte segueix la mateixa estructura que els capítols anteriors).
- **Regla de mapes HTML:** el separador de files és `|` (literal, no és `\n` ni tampoc és `\\n`).
- **Solució de referència:** s'inclou en un comentari HTML al final del fitxer, mai en `data-code`.

---

## Taula d'estat dels 10 reptes

| # | Fitxer | Títol | Grup | Dificultat | Estat |
|---|--------|-------|------|------------|-------|
| 1 | `repte-1.html` | El diari | A | ★ Fàcil | ✅ Implementat |
| 2 | `repte-2.html` | El passadís | A | ★ Fàcil | ✅ Implementat |
| 3 | `repte-3.html` | L'escala diagonal | A | ★ Fàcil | ⬜ Pendent |
| 4 | `repte-4.html` | Distribuir les perles | A | ★ Fàcil | ⬜ Pendent |
| 5 | `repte-5.html` | El serpentí | B | ★★ Intermedi | ⬜ Pendent |
| 6 | `repte-6.html` | Construir torres | B | ★★ Intermedi | ⬜ Pendent |
| 7 | `repte-7.html` | L'escala doble | B | ★★ Intermedi | ⬜ Pendent |
| 8 | `repte-8.html` | El tauler d'escacs | C | ★★★ Avançat | ⬜ Pendent |
| 9 | `repte-9.html` | El laberint | C | ★★★ Avançat | ⬜ Pendent |
| 10 | `repte-10.html` | El punt mig | C | ★★★ Avançat | ⬜ Pendent |

---

## Detall per repte

### ✅ Repte 1 — El diari (A1, ★ Fàcil)

**Fitxer:** `curs/repte-1.html`
**Conceptes:** descomposició procedimental, `while front_is_clear()`, pre/postcondicions.
**Adaptació de:** Collect Newspaper Karel (Stanford CS106A).

**Mons de test (3 simuladors):**
```
Test A — cova curta  (2 passos): P,P,P,P|K>,.,A,P|P,P,P,P
Test B — cova normal (3 passos): P,P,P,P,P|K>,.,.,A,P|P,P,P,P,P
Test C — cova llarga (4 passos): P,P,P,P,P,P|K>,.,.,.,A,P|P,P,P,P,P,P
```
*(Cova tancada per la dreta amb una roca. La paret dreta és la condició de parada per a `surt_de_la_cova()`; la frontera esquerra del món per a `torna_a_casa()`.)*

**Mapa final (data-goal):** Karel de tornada a la posició inicial, cap perla al món.

**Clau pedagògica:** Un alumne que hardcodi `move()×N` passa el test B però falla els tests A i C. La solució correcta usa `while front_is_clear(): move()` dins de cada funció. La descomposició en tres funcions amb noms clars continua sent obligatòria.

**Solució de referència (professor):**
```python
def surt_de_la_cova():
    while front_is_clear():
        move()

def recull_la_perla():
    grab()

def torna_a_casa():
    turn_around()
    while front_is_clear():
        move()
    turn_around()

surt_de_la_cova()
recull_la_perla()
torna_a_casa()
```

**Notes d'implementació:**
- La navegació del repte apunta a `capitol-9.html` (anterior) i `repte-2.html` (següent).
- El badge de dificultat `★ Fàcil` es mostra amb CSS inline al fitxer.
- La introducció al capítol 10 (filosofia + badges de dificultat) es troba a la secció inicial d'aquest fitxer. Els reptes 2–10 **no han de repetir** aquesta introducció; han de començar directament amb el seu repte i incloure la navegació prev/next adequada.

---

### ✅ Repte 2 — El passadís (A2, ★ Fàcil)

**Fitxer:** `curs/repte-2.html`
**Conceptes:** `while` + `if`, error de pal de paller (fencepost).
**Adaptació de:** Cleanup Karel.

**Mapa inicial (test A — 8 caselles):**
```
K>,A,.,A,A,.,A,.
```

**Mapa inicial (test B — 9 caselles):**
```
K>,.,A,.,A,.,.,A,.
```

**Mapa inicial (test C — 12 caselles):**
```
K>,A,A,.,.,A,.,A,.,.,A,.
```

**Mapa final (data-goal):** Karel a l'extrem dret, cap perla al món. Ex.: `.,.,.,.,.,.,.,K>` (8 caselles).

**Clau pedagògica:** El bucle `while front_is_clear()` s'atura quan el camí és bloquejat, però en aquell moment en Karel és a l'última casella i encara no l'ha comprovat. L'alumne ha de detectar el fencepost i afegir `if pearl_here(): grab()` fora del `while`.

**Solució de referència (professor):**
```python
while front_is_clear():
    if pearl_here():
        grab()
    move()
if pearl_here():
    grab()
```

**Notes d'implementació:**
- S'han implementat 3 mons de test (longituds 8, 9 i 12) com a simuladors separats en el mateix fitxer.
- El `data-goal` usa Karel a l'extrem dret sense perles.
- El `data-code` inicial inclou l'esquelet amb el `while` per guiar l'alumne cap al fencepost error.
- La navegació: anterior → `repte-1.html`, següent → `repte-3.html`.

---

### ⬜ Repte 3 — L'escala diagonal (A3, ★ Fàcil)

**Conceptes:** `for`, seqüència composta dins del bucle.
**Adaptació de:** Ramp Climbing Karel.

**Enunciat:** En Karel ha de crear un rastre de perles en forma d'escala diagonal (N graons), pujant una casella i avançant una per cada graó. N és fix i conegut.

**Mapa exemple (N=4, món 5×5):**
```
.,.,.,.,A
.,.,.,A,.
.,.,A,.,.
.,A,.,.,.
K>,.,.,.,.
```
*(Karel comença a la cantonada inferior esquerra, ha d'arribar a la superior dreta deixant perles a la diagonal.)*

**Clau pedagògica:** Identificar la unitat rítmica `puja_grao()` = `drop()` + `move()` + `turn_left()` + `move()` + `turn_right()`.

---

### ⬜ Repte 4 — Distribuir les perles (A4, ★ Fàcil)

**Conceptes:** `while`, `grab`/`drop`, separació de fases.
**Adaptació de:** Spread Beepers.

**Enunciat:** En Karel comença amb una pila de perles concentrada a la primera casella del passadís (nombre desconegut). Ha d'escampar-les per tot el passadís: una perla per casella.

**Mapa exemple:**
```
K>(5),.,.,.,.,.,.,. 
```
*(Karel té 5 perles a la motxilla al inici. La longitud del passadís és desconeguda.)*

**Clau pedagògica:** La condició de sortida és `bag_is_empty()`, no `front_is_blocked()`. La motxilla és la "memòria" temporal.

**Notes d'implementació pendents:**
- Comprovar si el motor suporta Karel amb perles inicials a la motxilla (en lloc de al món). Si no, adaptar el mapa per tenir la pila al terra.

---

### ⬜ Repte 5 — El serpentí (B1, ★★ Intermedi)

**Conceptes:** `while`, `if`, girs condicionals, navegació multi-fila.
**Adaptació de:** Cleanup Karel (variant dues files).

**Enunciat:** En Karel ha de recollir totes les perles d'un món de dues files (amplada desconeguda). Ha de fer el recorregut en ziga-zaga: fila inferior cap a l'Est, puja, fila superior cap a l'Oest.

**Mapa exemple:**
```
.,A,.,A,.,A
K>,A,.,A,.,A
```

**Clau pedagògica:** El gir al canvi de fila ha de ser precís (dos `turn_left()` o equivalent). Postcondicions de gir.

---

### ⬜ Repte 6 — Construir torres (B2, ★★ Intermedi)

**Conceptes:** `def`, descomposició, pre/postcondicions, `while` imbricat.
**Adaptació de:** Stone Mason Karel.

**Enunciat:** El fons del mar té diverses bases marcades amb una perla al terra. En Karel ha de construir una columna de perles per damunt de cada base, d'altures variables (fins al sostre). Ha de deixar perles només si no n'hi ha.

**Mapa exemple (3 columnes, altures 2, 4, 3):**
```
.,P,.,.,P,.,.,P,.
.,P,.,.,P,.,.,P,.
.,P,.,.,..,.,P,.
.,P,.,.,.,.,.,.,. 
A,P,.,A,.,.,A,.,. 
```
*(Roques als costats de cada base. Les torres creixen cap amunt fins al sostre.)*

**Clau pedagògica:** La postcondició de `construir_torre()` (tornar al terra, orientació Est) ha de ser estricta. Un error d'un grau desorienta tot el cicle.

**Notes d'implementació pendents:**
- Dissenyar el CSV del món amb cura. Les roques han de delimitar bé cada "slot" de torre.

---

### ⬜ Repte 7 — L'escala doble (B3, ★★ Intermedi)

**Conceptes:** `def`, `for`, seqüències simètriques, transició pujada/baixada.

**Enunciat:** En Karel ha de pujar una escala de N graons, recollir la perla de la cima i baixar l'escala de l'altre costat deixant la perla al peu.

**Clau pedagògica:** Identificar la simetria: `puja_grao()` i `baixa_grao()` com a funcions inverses l'una de l'altra.

---

### ⬜ Repte 8 — El tauler d'escacs (C1, ★★★ Avançat)

**Conceptes:** `while`, `if`, gestió de paritat sense variables, casos límit.
**Adaptació de:** Checkerboard Karel (el repte més cèlebre del CS106A).

**Enunciat:** En Karel ha d'omplir un món rectangular buit amb un patró d'escaquer de perles. El món pot tenir qualsevol dimensió.

**Clau pedagògica:** Sense variables, la paritat s'ha d'inferir de l'estat físic. El salt de fila és el punt crític. Cal gestionar casos límit: mons 1×N, N×1, dimensions senars.

**Mons de test obligatoris:** 1×1, 1×2, 2×1, 3×3, 4×4, 5×4.

---

### ⬜ Repte 9 — El laberint (C2, ★★★ Avançat)

**Conceptes:** `while`, `if`, `and`, `not`, `def`, estratègia de la mà dreta.
**Adaptació de:** Maze Karel / Repte predefinit 5 del projecte.

**Enunciat:** En Karel és a l'entrada d'un laberint. La perla és a la sortida. Troba el camí. El laberint té sempre solució.

**Mapa:** Reutilitza el laberint del repte predefinit 5 de `reptes.js`:
```
K>,.,P,.,.,. 
.,.,P,.,P,.
.,.,.,.,P,.
P,P,P,.,P,.
.,.,.,.,.,A
```

**Clau pedagògica:** Composar `not`, `and` i `or` per expressar condicions compostes. La regla de la mà dreta com a algorisme genèric.

---

### ⬜ Repte 10 — El punt mig (C3, ★★★ Avançat)

**Conceptes:** `while`, `if`, `grab`/`drop` com a marcadors, algorisme dels dos punters.
**Adaptació de:** Midpoint Karel (l'exercici més citat del CS106A).

**Enunciat:** El món és un passadís buit de longitud desconeguda (sempre ≥1). En Karel ha de deixar una perla exactament al punt mig. Si la longitud és imparella, al centre exacte; si és parella, s'accepta qualsevol de les dues caselles centrals. Al final només ha de quedar la perla del mig.

**Mons de test obligatoris:** longituds 1, 2, 3, 4, 7, 8.

**Clau pedagògica:** Descobrir l'algorisme d'aproximació simètrica (dos punters) és l'epifania principal del curs. Sense variables numèriques, l'alumne ha de trobar el mètode físic.

---

## Notes d'arquitectura a tenir en compte

- **Navegació prev/next:** cada fitxer `repte-N.html` ha d'apuntar a `repte-(N-1).html` i `repte-(N+1).html`. El repte 1 apunta a `capitol-9.html` com a anterior. El repte 10 apunta a una pàgina de felicitació (o de tornada a l'índex).
- **CURRENT_CAPITOL:** tots els reptes usen `const CURRENT_CAPITOL = 10;` per marcar el capítol actiu a la sidebar.
- **La introducció al capítol** (filosofia + badges de dificultat) ja està al repte 1. Els reptes 2–10 comencen directament amb l'enunciat.
- **Futur (opconal):** afegir entrades 6–15 a `reptes.js` per fer accessibles els reptes via `?repte=N`. Additiu, no trenca res existent.

---

*Última actualització: sessió 2 — Implementat repte-2.html (A2, El passadís). Revisat repte-1.html: 3 mons de test (coves de 2, 3 i 4 passos), solució actualitzada a `while front_is_clear()`.*
