# BRIEFING-REPTES — Capítol 10 de Karelcat

> **Propòsit d'aquest document:** registrar l'estat de la implementació dels 13 reptes del capítol 10. Cada sessió de treball ha d'actualitzar la taula d'estat i les notes de cada repte implementat abans de tancar. Un BRIEFING obsolet és més perillós que no tenir-ne.

---

## Context ràpid

- **Projecte:** karelcat — curs interactiu de en Karel en català, temàtica marina.
- **Capítol 10:** no introdueix sintaxi nova. L'alumne combina tot el que sap. Inspirat en els exercicis de Stanford CS106A / Code in Place.
- **Document de disseny de referència:** `docs/reptes.docx` (conté enunciats, mapes, principis pedagògics i ordre recomanat d'implementació).
- **Plantilla HTML:** `curs/capitol.html` (cada repte segueix la mateixa estructura que els capítols anteriors).
- **Regla de mapes HTML:** el separador de files és `|` (literal, no és `\n` ni tampoc és `\\n`).
- **Solució de referència:** s'inclou en un comentari HTML al final del fitxer, entre les marques `<solucio>` i `</solucio>`, mai en `data-code`. **Aquesta és la font única de veritat de les solucions:** el test `node tests/comprova-curs.js` les executa contra tots els mons del repte. Els blocs `<solucio-incorrecta motiu="…">` recullen errors típics que el verificador ha de detectar.
- **Objectius:** es compara també la casella de sota en Karel (`K>A` = acaba damunt d'una perla). Un objectiu sense `K` no comprova on acaba en Karel. Vegeu `docs/CURRENT-STATE.md`, secció 4.

---

## Taula d'estat dels 13 reptes

| # | Fitxer | Títol | Grup | Dificultat | Estat |
|---|--------|-------|------|------------|-------|
| 1 | `repte-1.html` | El diari | A | ★ Fàcil | ✅ Implementat |
| 2 | `repte-2.html` | El passadís | A | ★ Fàcil | ✅ Implementat |
| 3 | `repte-3.html` | L'escala diagonal | A | ★ Fàcil | ✅ Implementat |
| 4 | `repte-4.html` | Distribuir les perles | A | ★ Fàcil | ✅ Implementat |
| 5 | `repte-5.html` | El serpentí | B | ★★ Intermedi | ✅ Implementat |
| 6 | `repte-6.html` | Construir torres | B | ★★ Intermedi | ✅ Implementat |
| 7 | `repte-7.html` | L'escala doble | B | ★★ Intermedi | ✅ Implementat |
| 8 | `repte-8.html` | El vigilant | B | ★★ Intermedi | ✅ Implementat |
| 9 | `repte-9.html` | Les files alternes | B | ★★ Intermedi | ✅ Implementat |
| 10 | `repte-10.html` | El detector | C | ★★★ Avançat | ✅ Implementat |
| 11 | `repte-11.html` | El tauler d'escacs | C | ★★★ Avançat | ✅ Implementat |
| 12 | `repte-12.html` | El laberint | C | ★★★ Avançat | ✅ Implementat |
| 13 | `repte-13.html` | El punt mig | C | ★★★ Avançat | ✅ Implementat |

---

## Detall per repte

### ✅ Repte 1 — Recollir el tresor (A1, ★ Fàcil)

**Fitxer:** `curs/repte-1.html`
**Conceptes:** seqüència d'ordres, `grab()`.

**Enunciat:** la perla és exactament a tres caselles davant d'en Karel en els tres mons;
només canvia el paisatge del voltant. En Karel hi ha d'arribar i recollir-la.

**Mons de test:** tres mapes 5×3 amb en Karel a (0,1) i la perla a (3,1); rocs diferents a dalt i a baix.
**Objectiu:** en Karel a (3,1) i **cap perla** (des de la correcció del verificador, oblidar `grab()` ja no passa).

**Solució de referència:** al bloc `<solucio>` de `curs/repte-1.html`.
**Error detectat pel test:** arribar a la perla sense recollir-la.

---

### ✅ Repte 2 — El passadís (A2, ★ Fàcil)

**Fitxer:** `curs/repte-2.html`
**Conceptes:** `while` + `if`, error de límit.
**Adaptació de:** Cleanup en Karel.

**Mons de test:**
```
Món 1 (8 caselles):  K>,A,.,A,A,.,A,A          ← perla a l'ÚLTIMA casella
Món 2 (9 caselles):  K>A,.,A,.,A,.,.,A,.       ← perla a la PRIMERA casella (sota en Karel)
Món 3 (12 caselles): K>,A,A,.,.,A,.,A,.,.,A,A  ← perla a l'última casella
```
**Objectiu:** en Karel a l'extrem dret, cap perla al passadís.

**Clau pedagògica:** l'error de límit. Amb «comprova i després avança» dins del
`while front_is_clear()`, l'última casella queda sense comprovar: cal un `if pearl_here(): grab()`
després del `while`. Amb «avança i després comprova», la que queda sense comprovar és la primera.

**Solució de referència:** al bloc `<solucio>` de `curs/repte-2.html`.
**Errors detectats pel test:** oblidar l'última casella (falla el món 1) i avançar abans de comprovar (falla el món 2).

**Nota:** abans de la correcció, cap món tenia perla a l'última casella i el verificador
no mirava la casella de sota en Karel: l'error de límit no es detectava mai.

---

### ✅ Repte 3 — L'escala diagonal (A3, ★ Fàcil)

**Fitxer:** `curs/repte-3.html`
**Conceptes:** `for`, seqüències compostes dins la iteració, pre/postcondicions de funció.
**Adaptació de:** Ramp Climbing en Karel (Stanford CS106A).

**Mons de test (3 simuladors):**
- Test A — 3×3, N=2 graons
- Test B — 5×5, N=4 graons
- Test C — 8×8, N=7 graons

**Motxilla inicial:** `data-bag="99"` (pràcticament infinita) als tres simuladors.

**Funció principal:** `construeix_grao()` = `drop()` + `move()` + `turn_left()` + `move()` + `turn_right()`

**Clau pedagògica:** La funció `construeix_grao()` té una precondició i postcondició idèntiques (en Karel mira a l'Est). Gràcies a aquesta simetria, encadenar N crides amb `for` és trivial. Si la postcondició no es compleix (p. ex. s'oblida el `turn_right()` final), el segon graó surt en la direcció equivocada.

**Notes d'implementació:**
- Nom de funció: `construeix_grao` (en lloc de `puja_grao`) — emfatitza l'acció de construir, no només de pujar.
- La navegació: anterior → `repte-2.html`, següent → `repte-4.html`.

---

### ✅ Repte 4 — Distribuir les perles (A4, ★ Fàcil)

**Fitxer:** `curs/repte-4.html`
**Conceptes:** `while not bag_is_empty()`, `drop()`, motxilla com a comptador implícit.
**Adaptació de:** Spread Beepers (Stanford CS106A).

**Decisió de disseny:** el motor no suporta piles (N perles per casella). Les perles s'inicialitzen a la motxilla via `data-bag`. El passadís té sempre una casella extra de marge al final (N+1 caselles per a N perles) perquè l'últim `move()` no xoqui amb la paret.

**Mons de test (3 simuladors separats):**
- Test A — 3 perles, `K>,.,.,. ` → goal `A,A,A,K>`
- Test B — 5 perles, `K>,.,.,.,.,.` → goal `A,A,A,A,A,K>`
- Test C — 7 perles, `K>,.,.,.,.,.,.,.` → goal `A,A,A,A,A,A,A,K>`

**Solució de referència:**
```python
while not bag_is_empty():
    drop()
    move()
```

**Clau pedagògica:** `bag_is_empty()` com a condició de parada desacobla el codi de la geometria del món. El mateix programa funciona per a qualsevol longitud de passadís (sempre que hi hagi la casella de marge final).

**Notes d'implementació:**
- La navegació: anterior → `repte-3.html`, següent → `repte-5.html`.

---

### ✅ Repte 5 — El serpentí (B1, ★★ Intermedi)

**Conceptes:** `while`, `if`, girs condicionals, navegació multi-fila.
**Adaptació de:** Cleanup en Karel (variant dues files).

**Enunciat:** En Karel ha de recollir totes les perles d'un món de dues files (amplada desconeguda). Ha de fer el recorregut en ziga-zaga: fila inferior cap a l'Est, puja, fila superior cap a l'Oest.

**Mons de test:** amplades 4, 6 i 8. Objectiu: en Karel a dalt a l'esquerra i cap perla
(el món 1 té una perla a l'última casella de baix i el món 2 a l'última de dalt, on acaba en Karel).
Solució de referència al bloc `<solucio>` de `curs/repte-5.html`.

**Clau pedagògica:** El gir al canvi de fila ha de ser precís (dos `turn_left()` o equivalent). Postcondicions de gir.

---

### ✅ Repte 6 — Construir torres (B2, ★★ Intermedi)

**Fitxer:** `curs/repte-6.html`
**Conceptes:** `def`, descomposició, pre/postcondicions, `while` imbricat.
**Adaptació de:** Stone Mason Karel (Stanford CS106A).

**Mons de test (3 simuladors):**
```
Test A — 7×3, 3 torres (cols 0, 3, 6):
  Inicial: .,.,.,.,.,.,.|.,.,.,.,.,.,.|K>,.,.,A,.,.,A
  Goal:    A,.,.,A,.,.,A|A,.,.,A,.,.,A|A,.,.,A,.,.,K>A

Test B — 7×4, 3 torres (cols 0, 3, 6):
  Inicial: .,.,.,.,.,.,.|.,.,.,.,.,.,.|.,.,.,.,.,.,.|K>,.,.,A,.,.,A
  Goal:    A,.,.,A,.,.,A|A,.,.,A,.,.,A|A,.,.,A,.,.,A|A,.,.,A,.,.,K>A

Test C — 10×4, 4 torres (cols 0, 3, 6, 9):
  Inicial: .,.,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,.,.|K>,.,.,A,.,.,A,.,.,A
  Goal:    A,.,.,A,.,.,A,.,.,A|A,.,.,A,.,.,A,.,.,A|A,.,.,A,.,.,A,.,.,A|A,.,.,A,.,.,A,.,.,K>A
```

**Motxilla inicial:** `data-bag="99"` (pràcticament infinita) als tres simuladors.

**Solució de referència:**
```python
def omple_columna():
    turn_left()
    while front_is_clear():
        if not pearl_here():
            drop()
        move()
    if not pearl_here():
        drop()
    turn_around()
    while front_is_clear():
        move()
    turn_left()

def avança_a_seguent():
    move()
    move()
    move()

omple_columna()
while front_is_clear():
    avança_a_seguent()
    omple_columna()
```

**Clau pedagògica:** La pre/postcondició de `omple_columna()` és sempre *(base de la columna, orientació Est)*. Aquesta simetria permet encadenar N crides amb un sol `while` sense cap comptador. El gir final és `turn_left()` (Sud→Est), no `turn_right()` (que donaria Oest). Un alumne que confon el gir final passa el Test A però la columna 2 es construeix en la direcció equivocada.

**Notes d'implementació:**
- Les bases (perles marcadores) es compten com a part de la torre: `if not pearl_here(): drop()` dins la iteració les preserva i no gasta motxilla de més.
- El `while front_is_clear()` principal s'atura sol perquè els tres mons estan dissenyats sense caselles buides a la dreta de l'última torre.
- La navegació: anterior → `repte-5.html`, següent → `repte-7.html`.

---

### ✅ Repte 7 — L'escala doble (B3, ★★ Intermedi)

**Fitxer:** `curs/repte-7.html`
**Conceptes:** `def`, `while not pearl_here()`, `while front_is_clear()`, simetria.
**Adaptació de:** Double Staircase en Karel (variant CS106A).

**Mons de test:** piràmides de roca de 2, 3 i 4 graons (5×3, 7×4, 9×5). En Karel comença
al peu esquerre mirant a l'Est; la perla és al cim.

**Objectiu:** la perla al peu dret de la piràmide i en Karel damunt seu (`K>A`).

**Clau pedagògica:** els graons són roques: no es poden travessar, s'han d'enfilar.
`puja_grao()` = gira a l'esquerra, puja, gira a la dreta, avança.
`baixa_grao()` és el mateix moviment en mirall = avança, gira a la dreta, baixa, gira a l'esquerra.
`while not pearl_here()` s'atura al cim sense comptar graons; `while front_is_clear()` s'atura al peu.

**Solució de referència:** al bloc `<solucio>` de `curs/repte-7.html`.
**Errors detectats pel test:** no deixar la perla al peu; avançar abans de pujar (xoca amb el primer graó).

**Nota:** abans de la correcció, les pistes i la solució descrivien un món obert
(«avança, gira a l'esquerra, puja…»), però els mapes tenen roques: qui seguia la pista xocava.

---

### ✅ Repte 8 — El vigilant (B4, ★★ Intermedi)

**Fitxer:** `curs/repte-8.html`
**Conceptes:** `def`, `while`, `for`, perímetre rectangular.

**Enunciat:** en Karel dona una volta completa al perímetre del món (cantonada inferior
esquerra, mirant a l'Est) i recull totes les perles del perímetre.

**Mons de test:** rectangles 4×3, 5×3 i 6×4 amb perles al perímetre (una a la cantonada inferior dreta).
**Objectiu:** en Karel al punt de partida i cap perla al món. Motxilla inicial: 0.

**Solució:** `recorre_costat()` (mentre pot avançar: recull si hi ha perla i avança),
repetida 4 vegades amb un `turn_left()` darrere. Al bloc `<solucio>` de `curs/repte-8.html`.
**Errors detectats pel test:** girar a la dreta; fer només dos costats.

**Nota:** l'antiga solució (deixar una perla com a marcador i caminar fins a tornar-la
a trobar) no pot funcionar: en Karel no distingeix el marcador de les perles del
perímetre. A més feia `turn_right()` i la pista deia «repeteix 4 vegades `pas_vigilant()`».

---

### ✅ Repte 9 — Les files alternes (B5, ★★ Intermedi)

**Fitxer:** `curs/repte-9.html`
**Conceptes:** `while`, `break`, serpentí multifila, error de límit (el sostre).

**Enunciat:** omplir de perles les files senars comptant des de baix (1a, 3a, 5a…) i
deixar buides les altres. No importa on acabi en Karel.

**Mons de test i objectius (sense K: no es comprova la posició final):**
```
4×3 (2 files plenes):  A,A,A,A|.,.,.,.|A,A,A,A
5×4 (2 files plenes):  .,.,.,.,.|A,A,A,A,A|.,.,.,.,.|A,A,A,A,A
6×5 (3 files plenes):  A,A,A,A,A,A|.,.,.,.,.,.|A,A,A,A,A,A|.,.,.,.,.,.|A,A,A,A,A,A
```
**Motxilla inicial:** 99.

**Clau pedagògica:** després d'omplir una fila cal pujar **dues** files, comprovant abans
de cada pas amb `front_is_blocked()` si s'ha arribat al sostre (llavors `break`).

**Solució de referència:** al bloc `<solucio>` de `curs/repte-9.html`.
**Error detectat pel test:** pujar una sola fila (les omple totes).

**Nota:** abans de la correcció, els objectius dels mons 1 i 2 no seguien l'enunciat
(només la fila de baix, o les dues de baix) i exigien en Karel a baix a la dreta.

---

### ✅ Repte 10 — El detector (C0, ★★★ Avançat)

**Fitxer:** `curs/repte-10.html`
**Conceptes:** `while`, `if` separats, `left_is_clear()`, `right_is_clear()`, error de límit.

**Enunciat:** en Karel recorre un passadís horitzontal (la fila del mig). A dalt i a baix
tot són roques excepte uns quants forats d'una casella; ha de recollir les perles de dins dels forats.

**Mons de test:**
```
Món 1 (6):  P,P,A,P,.,P | K>,.,.,.,.,. | P,A,P,P,P,P
Món 2 (8):  A,P,P,.,P,P,P,A | K>,.,.,.,.,.,.,. | P,P,P,A,P,.,P,A
Món 3 (10): P,P,A,P,P,P,.,P,P,P | K>,.,.,.,.,.,.,.,.,. | P,A,P,P,P,A,P,P,A,A
```
Hi ha forats a la primera casella, a l'última i als dos costats d'una mateixa casella.
**Objectiu:** en Karel al final del passadís i cap perla.

**Solució de referència:** al bloc `<solucio>` de `curs/repte-10.html`.
**Errors detectats pel test:** no comprovar l'última casella; fer servir `elif`
(se'n deixa un quan hi ha forat als dos costats); entrar a totes les caselles sense mirar (xoca).

**Nota:** abans de la correcció, els mapes no tenien cap roca: no hi havia forats per detectar.

---

### ✅ Repte 11 — El tauler d'escacs (C1, ★★★ Avançat)

**Fitxer:** `curs/repte-11.html`
**Conceptes:** `while`, `if`, `pearl_here()` com a memòria de paritat, serpentí bidireccional, pre/postcondicions.
**Adaptació de:** Checkerboard en Karel (Stanford CS106A — el repte més cèlebre).

**Mons de test (3 simuladors):**
```
Test A — 3×3:
  Inicial: .,.,.|.,.,.|K>,.,.
  Goal:    A,.,K>A|.,A,.|A,.,A

Test B — 4×4:
  Inicial: .,.,.,.|.,.,.,.|.,.,.,.|K>,.,.,.
  Goal:    K<,A,.,A|A,.,A,.|.,A,.,A|A,.,A,.

Test C — 5×3:
  Inicial: .,.,.,.,.|.,.,.,.,.|K>,.,.,.,.
  Goal:    A,.,A,.,K>A|.,A,.,A,.|A,.,A,.,A
```

*(La cantonada inferior esquerra sempre és ON. El patró alterna ON/OFF per (row+col)%2.)*

**Motxilla inicial:** `data-bag="99"` (pràcticament infinita).

**Clau del disseny — el truc de la paritat física:**
Al final de cada fila, `pearl_here()` codifica la paritat de la darrera casella visitada.
- `True` (ON) → la primera casella de la nova fila és OFF → cridar `omple_fila_des_de_off()`
- `False` (OFF) → la primera casella de la nova fila és ON → cridar `omple_fila_des_de_on()`

Sense variables numèriques, l'estat físic del món substitueix el comptador de paritat.

**Solució de referència:**
```python
def omple_fila_des_de_on():
    if not pearl_here():
        drop()
    while front_is_clear():
        move()
        if front_is_clear():
            move()
            if not pearl_here():
                drop()

def omple_fila_des_de_off():
    while front_is_clear():
        move()
        if not pearl_here():
            drop()
        if front_is_clear():
            move()

def canvia_fila_des_d_est():
    turn_left()
    move()
    turn_left()

def canvia_fila_des_d_oest():
    turn_right()
    move()
    turn_right()

omple_fila_des_de_on()

while left_is_clear():
    if pearl_here():
        canvia_fila_des_d_est()
        omple_fila_des_de_off()
    else:
        canvia_fila_des_d_est()
        omple_fila_des_de_on()

    if not right_is_clear():
        break
    if pearl_here():
        canvia_fila_des_d_oest()
        omple_fila_des_de_off()
    else:
        canvia_fila_des_d_oest()
        omple_fila_des_de_on()
```

**Esquelet visible per l'alumne:** `omple_fila_des_de_on()` completament implementada com a referència; `omple_fila_des_de_off()` buida (l'alumne descobreix la versió simètrica); les dues funcions de transició donades; programa principal complet mostrant el truc de `pearl_here()`.

**Clau pedagògica:** `pearl_here()` com a «variable» de paritat és l'epifania del repte. L'alumne descobreix que l'estat físic del món pot substituir una variable booleana, sempre que es consulti en el moment precís (just abans de moure's a la nova fila). La simetria `omple_fila_des_de_on ↔ omple_fila_des_de_off` paral·lela a la de `puja_grao ↔ baixa_grao` del repte 7.

**Notes d'implementació:**
- El `while left_is_clear()` + `break` gestiona tots els casos: nombre parell i senar de files, quadrats i rectangles.
- `left_is_clear()` comprova el Nord quan en Karel mira l'Est; `right_is_clear()` comprova el Nord quan en Karel mira l'Oest.
- La navegació: anterior → `repte-10.html`, següent → `repte-12.html`.

---

### ✅ Repte 12 — El laberint (C2, ★★★ Avançat)

**Fitxer:** `curs/repte-12.html`
**Conceptes:** `while`, `if/elif/else`, `def`, regla de la mà dreta.

**Mons de test:** cinc laberints (3×5 simple, 5×6 clàssic, 5×7 complex, 5×7 amb
cul-de-sac, 9×9 gran). En Karel comença a dalt a l'esquerra; la perla és a baix a la dreta.
**Objectiu:** en Karel damunt de la casella de la perla i la perla recollida (`K>` al final, cap `A`).

**Solució de referència:** `pas()` amb la regla de la mà dreta dins de
`while not pearl_here()`, i `grab()`. Al bloc `<solucio>` de `curs/repte-12.html`.
**Errors detectats pel test:** no recollir la perla; avançar sempre després de girar a l'esquerra.

**Límit de la regla de la mà dreta:** funciona quan totes les roques estan unides a la
vora del món (sense illes al mig), com en aquests cinc laberints.

**Nota:** abans de la correcció, els objectius dels mons 1–3 tenien dues `K` (a l'inici i al
final) i el verificador agafava la primera: cap solució correcta podia superar-los.

---

### ✅ Repte 13 — El punt mig (C3, ★★★ Avançat)

**Fitxer:** `curs/repte-13.html`
**Conceptes:** `while True` + `break`, `grab`/`drop` com a marcadors, algorisme dels dos punters.
**Adaptació de:** Midpoint en Karel (CS106A).

**Enunciat:** passadís buit de longitud desconeguda; en Karel porta 2 perles i n'ha de
deixar exactament una al punt mig (si la longitud és parella, a qualsevol de les dues centrals).

**Mons de test i objectius (sense K: no importa on acabi en Karel):**
```
Longitud 3:  .,A,.
Longitud 7:  .,.,.,A,.,.,.
Longitud 8:  .,.,.,A,.,.,.,.   o bé   .,.,.,.,A,.,.,.   (dues alternatives)
```
**Motxilla inicial:** 2.

**Solució de referència:** al bloc `<solucio>` de `curs/repte-13.html`. Clau: després de
deixar un marcador cal fer un `move()` abans de `camina_fins_perla()`, o en Karel ja és
damunt d'una perla i no es mou.
**Errors detectats pel test:** oblidar aquest `move()` (el programa no acaba mai); deixar les dues perles a l'extrem.

**Nota:** l'antiga solució de referència tenia precisament aquest error (bucle infinit), i
l'objectiu del món 3 només acceptava una de les dues caselles centrals.

---

## Notes d'arquitectura a tenir en compte

- **Test automàtic:** qualsevol canvi a un repte s'ha de comprovar amb `node tests/comprova-curs.js`.
- **Navegació prev/next:** cada fitxer `repte-N.html` ha d'apuntar a `repte-(N-1).html` i `repte-(N+1).html`. El repte 1 apunta a `capitol-9.html` com a anterior. El repte 13 apunta a `index.html` (tornada a l'índex).
- **CURRENT_REPTE:** tots els reptes usen `const CURRENT_REPTE = N;` (on N és el número del repte) i criden `renderReptesSidebar(CURRENT_REPTE)` per marcar el repte actiu a la sidebar.
- **La introducció al capítol** (filosofia + badges de dificultat) ja està al repte 1. Els reptes 2–13 comencen directament amb l'enunciat.
- **Futur (opcional):** afegir entrades 6–18 a `reptes.js` per fer accessibles els reptes via `?repte=N`. Additiu, no trenca res existent.

---

*Última actualització: correcció dels reptes 2, 5, 7, 8, 9, 10, 12 i 13 (mapes, objectius, pistes i solucions) i verificació automàtica de totes les solucions amb `tests/comprova-curs.js`.*
