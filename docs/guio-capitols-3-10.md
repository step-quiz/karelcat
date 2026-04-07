# Guió dels capítols 3–10 — Curs karelcat

> Document de treball per a l'implementació dels capítols pendents.
> Inclou: arc narratiu, text de cada secció, codi i mapes de tots els exemples i exercicis.
>
> Convenció de mapes: files separades per `\n`, columnes per `,`.
> `K>` Est · `K^` Nord · `K<` Oest · `Kv` Sud · `A` perla · `P` roca · `.` buit
> En els data-map HTML, els salts de línia s'escriuen com a `\n` literals.

---

## Capítol 3 — Repeteix

**Concepte nou:** `for _ in range(N):`  
**Prerequisits:** `move()`, `turn_left()`, `turn_right()`, `grab()`, `drop()`

### Arc narratiu

L'alumne ja sap donar ordres una per una. Però, com en Karel fa si cal moure's vint caselles? Escrivint `move()` vint vegades és tediós i propens a errors. El capítol introdueix el bucle `for` com a eina per dir-li a en Karel «fes això N vegades» amb una sola instrucció.

---

### Secció 1 — El problema de la repetició

**Títol h2:** «Repetir és avorrit (per als humans)»

**Text:**

> Fins ara hem escrit una ordre per línia. Funciona, però imagina que en Karel ha de moure's dotze caselles: hauries d'escriure `move()` dotze vegades seguides. Si després t'adones que eren onze i no dotze, has de comptar i esborrar.
>
> Els ordinadors no s'avorreixen de repetir. Som nosaltres qui hem de trobar una manera d'expressar la repetició de forma clara i curta.

---

### Secció 2 — `for _ in range(N):`

**Títol h2:** «Repetir N vegades: `for _ in range(N):`»

**Text:**

> `for _ in range(N):` li diu a en Karel que executi les ordres del bloc de sota exactament **N** vegades. Les ordres del bloc han d'anar **indentades** (desplaçades dos espais cap a la dreta). Això és com li dius a en Karel on comença i on acaba el que s'ha de repetir.

Mostra la comparació visual:

```
# Sense for (5 línies):          # Amb for (2 línies):
move()                            for _ in range(5):
move()                              move()
move()
move()
move()
```

**Text de tancament:**

> El resultat és exactament el mateix. Però ara, si vols canviar el nombre de passos, només canvies el `5`.

---

### Exemple 1 (view-only) — Moure's cinc caselles

**Text introductori:**
> Observa com en Karel fa cinc `move()` amb una sola instrucció `for`:

**Mapa:** 6 columnes × 3 files
```
. . . . . .
K> . . . . .
. . . . . .
```
`data-map=".,.,.,.,.,.\\n K>,.,.,.,.,.\\n.,.,.,.,.,."` *(ajusta l'espaiat)*

Mapa real: `".,.,.,.,.,.\nK>,.,.,.,.,.\n.,.,.,.,.,."` — 3 files, 6 cols

**Codi:**
```python
for _ in range(5):
    move()
```

**Text posterior:**
> Cinc passos, dues línies de codi. Si el món hagués tingut quinze columnes, hauríem escrit `range(15)`.

---

### Secció 3 — La indentació és el bloc

**Títol h2:** «La indentació marca el que es repeteix»

**Text:**

> La indentació (els dos espais del davant) no és decoració: és la manera com el programa sap quines ordres formen part del bucle i quines no. Tot el que va indentat sota el `for` es repeteix. El que torna a l'esquerra ja queda fora.

Mostra exemple:
```python
for _ in range(3):
    move()      # ← es repeteix 3 vegades
    turn_left() # ← també es repeteix 3 vegades
move()          # ← s'executa UNA SOLA VEZ, després del bucle
```

> Si la indentació no és consistent, el programa no funcionarà com esperes.

---

### Exemple 2 (view-only) — Avançar, girar, avançar

**Text introductori:**
> En aquest exemple, en Karel fa tres passos cap a l'Est, gira a l'esquerra i fa tres passos cap al Nord. El bloc del `for` inclou `move()` i la darrera línia queda fora:

**Mapa:** 4 columnes × 4 files, Karel a la cantonada inferior esquerra mirant Est
```
. . . .
. . . .
. . . .
K> . . .
```
`".,.,.,.\n.,.,.,.\n.,.,.,.\nK>,.,.,."` — 4 files, 4 cols

**Codi:**
```python
for _ in range(3):
    move()
turn_left()
for _ in range(3):
    move()
```

**Text posterior:**
> Dos bucles `for` separats per un `turn_left()`. En Karel ha fet una cantonada. Compte: el `turn_left()` no va indentat, per tant no forma part de cap `for`.

---

### Exercici

**Enunciat:**
> En Karel és a l'extrem inferior esquerre i la perla és a l'extrem superior dret. El món té 5 columnes i 4 files. Porta en Karel fins a la perla i recull-la usant dos bucles `for` i un `turn_left()`.

**Pista:**
> Necessites moure't 4 caselles cap a l'Est, girar cap al Nord i moure't 3 caselles cap amunt. Pots fer-ho amb menys de 6 línies de codi.

**Mapa:** 5 cols × 4 files
```
. . . . A
. . . . .
. . . . .
K> . . . .
```
`".,.,.,.,A\n.,.,.,.,.\n.,.,.,.,.\nK>,.,.,.,."` — 4 files, 5 cols

**Solució esperada:**
```python
for _ in range(4):
    move()
turn_left()
for _ in range(3):
    move()
grab()
```

---
---

## Capítol 4 — Procediments

**Concepte nou:** `def nom():`  
**Prerequisits:** capítol 3 (incloent `for`)

### Arc narratiu

L'alumne ha après a repetir. Ara aprèn a **nombrar** seqüències d'ordres. Un procediment és com inventar una paraula nova que en Karel entén: li dius un cop com fer-la, i a partir d'aquell moment la pots usar igual que `move()` o `grab()`. Aquest és el primer acte creatiu real: l'alumne amplifica el vocabulari del robot.

L'exemple motor d'aquest capítol és escalar un graó: una seqüència de quatre ordres (`turn_left`, `move`, `turn_right`, `move`) que es repeteix a cada graó d'una escala. Sense `def`, escalar tres graons significa dotze línies iguals. Amb `def`, és una definició + tres crides.

---

### Secció 1 — El problema de les seqüències repetides

**Títol h2:** «Quan les mateixes ordres apareixen una i altra vegada»

**Text:**

> Imagina que en Karel ha d'escalar una escala de tres graons. Per pujar un graó, el procés és sempre el mateix: gira a l'esquerra, avança, gira a la dreta, avança. Quatre ordres per graó. Tres graons: dotze ordres. I si l'escala té deu graons?
>
> Copiar les mateixes quatre línies una i altra vegada és el senyal que hi ha una idea que no té nom. Els programadors ho resolen donant-li un nom.

---

### Exemple 1 (view-only) — Pujar un graó manualment

**Text introductori:**
> Primer, observa com es puja UN sol graó. Quatre ordres:

**Mapa:** 4 cols × 3 files, graó amb roca:
```
. . . .
P . . .
K> . . .
```
`".,.,.,.\nP,.,.,.\nK>,.,.,."` — 3 files, 4 cols

Karel comença a (col 0, fila 2), mirant Est. La roca bloqueja (col 0, fila 1). El graó és a (col 1, fila 1). La destinació és (col 1, fila 1) o millor (col 2, fila 1).

*Millor mapa:* 3 cols × 2 files, Karel sota la roca, graó a la dreta:
```
. . .
P K> .   ← Karel a (col 1, fila 0 des de dalt) mirant Est — no, cal que pugui pujar
```

Millor: Karel al peu del graó, graó és una diferència d'alçada.

**Mapa repensat:** 4 cols × 3 files
```
. . . .     fila 0 (nord)
P . . .     fila 1
K> . . .    fila 2 (sud)
```
`".,.,.,.\nP,.,.,.\nK>,.,.,."` — Karel (col 0, fila 2) Est. Roca (col 0, fila 1).

Per pujar el graó: `turn_left()` (ara Nord), `move()` (ara a fila 1), `turn_right()` (ara Est), `move()` (ara col 1, fila 1). ✓

**Codi:**
```python
turn_left()
move()
turn_right()
move()
```

**Text posterior:**
> Quatre ordres. En Karel ha pujat un graó. Ara imagina que has de fer-ho per cada graó d'una escala llarga.

---

### Secció 2 — `def nom():`

**Títol h2:** «Inventar una ordre nova: `def nom():`»

**Text:**

> `def` (abreviació de *define*, «definir») permet crear una ordre nova que en Karel reconeixerà igual que `move()` o `turn_left()`. La seva forma és:
> ```python
> def nom():
>     ordre1()
>     ordre2()
>     ...
> ```
> Primer escrius la definició (el «com es fa»). Llavors pots usar `nom()` al teu programa tantes vegades com vulguis.
>
> El nom que tries hauria de descriure clarament el que fa el procediment. `puja_graó()` és molt millor que `cosa()` o `a()`.

---

### Exemple 2 (view-only) — `def puja_graó():`

**Text introductori:**
> Ara definim `puja_graó()` i escalem tres graons. Compara el codi d'aquí amb el que necessitaries sense `def`:

**Mapa:** 5 cols × 4 files, escala de 3 graons:
```
. . . . .   fila 0
P . . . .   fila 1
P P . . .   fila 2
K> . . . .  fila 3
```
`".,.,.,.,.\nP,.,.,.,.\nP,P,.,.,.\nK>,.,.,.,."` — 4 files, 5 cols

Karel puja 3 graons: acaba a (col 3, fila 0).

**Codi:**
```python
def puja_graó():
    turn_left()
    move()
    turn_right()
    move()

puja_graó()
puja_graó()
puja_graó()
```

**Text posterior:**
> Sis línies (quatre de definició + dues de crides reals + un línia en blanc) fan el mateix que dotze línies sense `def`. Però el guany principal no és la brevetat: és la **llegibilitat**. Quan llegeixes `puja_graó()`, saps exactament el que fa sense haver de desxifrar les quatre ordres de dins.

---

### Secció 3 — Un procediment pot cridar un altre

**Títol h2:** «Els procediments es poden combinar»

**Text:**

> Un procediment pot cridar altres procediments. Pots construir accions complexes a partir d'accions més simples, com si fossis un arquitecte que construeix amb blocs.
>
> Per exemple, si vols que en Karel faci dues vegades la seqüència «puja un graó i recull una perla», pots definir:
> ```python
> def puja_i_recull():
>     puja_graó()
>     grab()
> ```
> Això funciona sempre que `puja_graó()` ja estigui definit **abans** de ser cridat.

> **Regla important:** les definicions `def` han d'anar **sempre al principi del programa**, abans de les ordres que les usen.

---

### Exercici

**Enunciat:**
> En Karel ha d'escalar una escala de quatre graons. A la casella de dalt de tot hi ha una perla. Defineix un procediment `puja_graó()` i usa'l per arribar a la perla i recollir-la.

**Pista:**
> Defineix `puja_graó()` amb quatre ordres. Llavors crida'l quatre vegades i afegeix un `grab()` al final.

**Mapa:** 6 cols × 5 files, escala de 4 graons:
```
A . . . . .   fila 0  ← perla a la cim (col 0 o al final? Cal ajustar)
P . . . . .   fila 1
P P . . . .   fila 2
P P P . . .   fila 3
K> . . . . .  fila 4
```

Revisió: Karel puja graons cap al Nord-Est. Cada `puja_graó()` el desplaça (+1 col, -1 fila). Quatre repeticions: Karel acaba a (col 4, fila 0).

**Mapa corregit:**
```
. . . . A .   fila 0  ← perla a col 4
P . . . . .   fila 1
P P . . . .   fila 2
P P P . . .   fila 3
K> . . . . .  fila 4
```
`".,.,.,.,A,.\nP,.,.,.,.,.\nP,P,.,.,.,.\nP,P,P,.,.,.\nK>,.,.,.,.,."` — 5 files, 6 cols

**Solució esperada:**
```python
def puja_graó():
    turn_left()
    move()
    turn_right()
    move()

puja_graó()
puja_graó()
puja_graó()
puja_graó()
grab()
```

---
---

## Capítol 5 — Descomposició

**Concepte nou:** cap de nou (consolida `def`, `for`)  
**Prerequisits:** capítols 3 i 4

### Arc narratiu

La descomposició és l'estratègia de resoldre un problema gran dividint-lo en parts més petites amb noms clars. No hi ha nova sintaxi: la novetat és el mètode de pensar. L'alumne aprèn que un bon programa es llegeix quasi com una recepta: primer fas això, llavors allò, finalment l'altre.

L'exemple motor és una missió de tres fases clarament diferenciades: en Karel ha de recollir dues perles de llocs separats i portar-les a un punt de destí. Sense descomposició, el codi és una llista opaca d'ordres. Amb descomposició, el `main` es llegeix com un pla.

---

### Secció 1 — Partir el problema en trossos

**Títol h2:** «Dividir per vèncer»

**Text:**

> Quan un problema és complex, la primera pregunta no és «quina ordre escric primer?». La primera pregunta és **«quines parts té aquest problema?»**
>
> Si pots descriure la solució en tres frases («primer en Karel fa X, llavors fa Y, finalment fa Z»), ja tens l'estructura del programa. Cada frase es converteix en un procediment amb un nom que descriu exactament el que fa.
>
> Això es diu **descomposició**: partir un problema gran en subproblemes que pots resoldre per separat.

---

### Secció 2 — El programa que s'explica sol

**Títol h2:** «Un programa que s'explica sol»

**Text:**

> Llegeix el codi següent. Sense saber els detalls de cada procediment, entens el que fa el programa?
>
> ```python
> def main():
>     recull_primera_perla()
>     recull_segona_perla()
>     porta_perles_al_destí()
> ```
>
> Sí: primer recull la primera perla, llavors la segona, i finalment les porta al destí. El programa és llegible sense entrar als detalls.
>
> Ara vénen els detalls. Cada procediment s'implementa per separat, i cadascun és prou senzill per entendre'l ràpidament.

> **Nota:** en el nostre curs, el programa s'executa directament de dalt a baix — no cal escriure `def main():`. Però l'estructura de pensar en fases i donar-los noms és exactament la mateixa.

---

### Exemple 1 (view-only) — Missió en tres fases

**Text introductori:**
> En Karel té una missió amb tres fases: recollir la perla del Nord, recollir la perla de l'Est, i portar-les totes dues al punt de destí al Sud. Observa com el codi reflecteix exactament el pla:

**Mapa:** 5 cols × 5 files
```
. . A . .   fila 0  ← perla Nord a (col 2, fila 0)
. . . . .   fila 1
. . K^ . .  fila 2  ← Karel al centre mirant Nord
. . . . .   fila 3
. . . A .   fila 4  ← perla Sud a (col 3, fila 4)? No...
```

Millor disseny per a 3 fases clares:
- Perla 1: a l'Est d'en Karel (mateixa fila, +2 cols)
- Perla 2: al Nord d'en Karel (mateixa col, -2 files)
- Destí: on comença Karel (o marcat amb un mapa goal)

**Mapa simplificat:** 5 cols × 3 files
```
. . A . .   fila 0  ← perla Nord a (col 2, fila 0)
. . . . .   fila 1
K> . A . .  fila 2  ← Karel (col 0, fila 2) Est. Perla Est a (col 2, fila 2)
```
`".,.,A,.,.\n.,.,.,.,.\nK>,.,A,.,."` — 3 files, 5 cols

En Karel: recull perla Est (col 2, fila 2), va al Nord (col 2, fila 0), recull perla Nord, torna a col 0 i deixa les perles.

**Codi:**
```python
def recull_perla_est():
    move()
    move()
    grab()

def recull_perla_nord():
    turn_left()
    move()
    move()
    grab()

def torna_al_inici():
    turn_around()
    move()
    move()
    turn_right()
    move()
    move()
    drop()
    drop()

recull_perla_est()
recull_perla_nord()
torna_al_inici()
```

**Text posterior:**
> Les tres últimes línies expliquen el pla sencer. Els procediments amagues els detalls. Si vols saber com funciona un dels passos, vas a la definició. Si vols entendre el pla general, llegeixes les tres crides.

---

### Exemple 2 (view-only) — Precondicions i postcondicions

**Títol h2:** «El que s'espera en entrar i en sortir»

**Text:**

> Quan defineixes un procediment, és útil pensar en dos moments: **on és en Karel quan el procediment comença** (precondició) i **on és quan acaba** (postcondició).
>
> Per exemple, `recull_perla_est()` assumeix que en Karel mira cap a l'Est i la perla és dues caselles endavant. Si la crides en una situació diferent, el resultat no serà el que esperes.
>
> Escriure un comentari breu que indiqui la precondició i postcondició d'un procediment és una bona pràctica:

```python
# Precondició:  Karel mira Est, perla a 2 caselles del davant
# Postcondició: Karel és sobre la perla (motxilla +1), mirant Est
def recull_perla_est():
    move()
    move()
    grab()
```

> No és obligatori, però t'ajudarà molt quan el programa comenci a créixer.

*(Aquest exemple no necessita simulador — és purament textual.)*

---

### Exercici

**Enunciat:**
> En Karel viu en un món amb tres perles disperses. Ha de recollir-les totes tres i portar-les al punt de destí (extrem inferior dret). El programa ha de tenir un procediment per a cada fase del recorregut. Quan acabis, en Karel ha d'estar a l'extrem inferior dret amb tres perles a la motxilla.

**Pista:**
> Divideix el problema en fases: «recull la primera perla», «recull la segona perla», «recull la tercera perla», «porta-les al destí». Cada fase és un procediment. Quan tinguis els quatre procediments, el programa principal és simplement quatre crides.

**Mapa:** 5 cols × 4 files
```
. A . . .   fila 0  ← perla a (col 1, fila 0)
. . . A .   fila 1  ← perla a (col 3, fila 1)
K> . . . .  fila 2  ← Karel (col 0, fila 2) Est
A . . . .   fila 3  ← perla a (col 0, fila 3)
```

Hmm, el disseny ha de ser assequible per a un estudiant de 16 anys. Millor tres perles en línia recta (mateixa fila) per fer el recorregut evident, i el destí al final:

**Mapa revisat:** 6 cols × 3 files
```
. . . . . .   fila 0
K> A . A . A  fila 1  ← Karel i tres perles a la fila del mig
. . . . . .   fila 2
```
`".,.,.,.,.,.\nK>,A,.,A,.,A\n.,.,.,.,.,."` — 3 files, 6 cols

Recorregut: move+grab, move, move+grab, move, move+grab. Destí = última casella (col 5).

Però les tres fases no queden prou diferenciades si és tot en línia. Millor:

**Mapa final exercici:** 4 cols × 4 files, en forma de L invertida
```
. . . A   fila 0  ← perla al nord-est
. . . .   fila 1
. A . .   fila 2  ← perla a la fila del mig
K> . . .  fila 3  ← Karel a sota-esquerra
```
`".,.,.,A\n.,.,.,.\n.,A,.,.\nK>,.,.,."` — 4 files, 4 cols

Les tres perles estan a: (col 2, fila 2), (col 3, fila 0), i una tercera fàcil d'afegir.
Però tres perles en una L és força complex per a cap 5. 

**Mapa definitiu (simplificat):** 5 cols × 3 files, perles en posicions que requereixen moure en dues direccions
```
. A . A .   fila 0  ← dues perles al nord
. . . . .   fila 1
K> . A . .  fila 2  ← Karel i perla a la fila del mig
```
`".,A,.,A,.\n.,.,.,.,.\nK>,.,A,.,."` — 3 files, 5 cols

Solució possible: recull (col 2, fila 2), gira Nord, recull (col 2, fila 0), mou a (col 1, fila 0), recull, mou a (col 3, fila 0), recull. Massa complex.

**Decisió final:** mantenir el recorregut en una sola fila però amb destí separat visible:

**Mapa:** 7 cols × 3 files
```
. . . . . . .
K> A . A . A .
. . . . . . .
```
`".,.,.,.,.,.,.\nK>,A,.,A,.,A,.\n.,.,.,.,.,.,."` — 3 files, 7 cols

Fase 1: `recull_primera()` → move + grab  
Fase 2: `recull_segona()` → move + move + grab  
Fase 3: `recull_tercera()` → move + move + grab  
Fase 4: `avança_al_destí()` → move  

Tres procediments + crida final. Destí: (col 6, fila 1).

---
---

## Capítol 6 — Condicionals

**Concepte nou:** `if cond():` / `else:`  
**Prerequisits:** capítols 3, 4 i 5

### Arc narratiu

Fins ara, en Karel sempre sabia exactament quin món trobaria: els mapes dels exemples eren sempre iguals. Però un programa útil de debò ha de funcionar en mons que l'alumne no ha dissenyat ell. El capítol introdueix `if` com la capacitat d'en Karel de prendre decisions en funció del que troba. És el moment-frontissa del curs: a partir d'aquí, en Karel pot adaptar-se.

---

### Secció 1 — Quan en Karel no sap el que trobarà

**Títol h2:** «En Karel ha de decidir»

**Text:**

> Fins ara, els programes d'en Karel eren llistes d'ordres fixes: `move()`, `grab()`, `turn_left()`... En Karel les executava sense mirar el que tenia davant.
>
> Però imagina que el món pot tenir una perla en una casella o no. Si en Karel sempre fa `grab()` i resulta que no hi ha perla, el programa s'atura amb un error. Necessitem una manera de dir-li: «si hi ha una perla, agafa-la; si no n'hi ha, no facis res».
>
> Això és exactament el que fa `if`.

---

### Secció 2 — `if cond():`

**Títol h2:** «Executar alguna cosa només si... `if`»

**Text:**

> `if` comprova una condició i executa el bloc indentat de sota **només si la condició és certa**. Si la condició és falsa, el bloc se salta.
>
> ```python
> if pearl_here():
>     grab()
> ```
>
> En Karel comprova si hi ha una perla a la casella on és. Si n'hi ha, la recull. Si no n'hi ha, segueix al pròxim pas sense fer res.

> **Condicions disponibles** (les que ja coneixes del capítol 2, ara les pots usar de veritat):
> - `pearl_here()` — hi ha una perla a la casella actual?
> - `front_is_clear()` — la casella del davant és lliure?
> - `front_is_blocked()` — la casella del davant té un obstacle?
> - `bag_is_empty()` — la motxilla és buida?
> - `bag_is_full()` — la motxilla és plena?

---

### Exemple 1 (view-only) — `if pearl_here():`

**Text introductori:**
> En Karel recorre cinc caselles. Algunes poden tenir perla, d'altres no. A cada casella comprova si hi ha perla i, si n'hi ha, la recull:

**Mapa:** 6 cols × 3 files, perles a posicions 2 i 4
```
. . . . . .
K> . A . A .
. . . . . .
```
`".,.,.,.,.,.\nK>,.,A,.,A,.\n.,.,.,.,.,."` — 3 files, 6 cols

**Codi:**
```python
for _ in range(5):
    move()
    if pearl_here():
        grab()
```

**Text posterior:**
> El `for` repeteix cinc vegades. Dins del `for`, hi ha un `if` que comprova la perla. Quan en Karel arriba a una casella buida, l'`if` és fals i `grab()` no s'executa. No hi ha cap error.

---

### Secció 3 — `else:`

**Títol h2:** «I si no... `else`»

**Text:**

> De vegades volem fer una cosa si la condició és certa **i una altra cosa diferent** si és falsa. Per a això usem `else`.
>
> ```python
> if pearl_here():
>     grab()
> else:
>     drop()
> ```
>
> En Karel comprova si hi ha perla. Si n'hi ha, la recull. Si no n'hi ha, en deixa una. (Això assumeix que la motxilla no és buida!)

---

### Exemple 2 (view-only) — Invertir una fila

**Text introductori:**
> En Karel recorre una fila i l'inverteix: on hi ha perla, la recull; on no n'hi ha, en deixa una. Observa que comença amb 3 perles a la motxilla:

**Mapa:** 5 cols × 3 files, perles a posicions alternes. Karel comença amb 3 perles a la motxilla (necessitem codificar l'estat inicial de la motxilla... si el motor ho permet).

*Nota d'implementació: si el motor no permet inicialitzar la motxilla via CSV, adaptar l'exemple perquè Karel primer reculli unes perles i llavors inverteixi.*

Alternativament, un exemple sense `drop()` (motxilla sempre buida al inici):

**Mapa simplificat:** 6 cols × 3 files — Karel recorre la fila recollint perles amb `if`
```
. . . . . .
K> A . A . A
. . . . . .
```
`".,.,.,.,.,.\nK>,A,.,A,.,A\n.,.,.,.,.,."` — 3 files, 6 cols

**Codi:**
```python
for _ in range(5):
    move()
    if pearl_here():
        grab()
    else:
        turn_left()
        turn_right()
```

*El `turn_left()+turn_right()` és un «no fa res» visible. Si el motor suporta un pas null, usar-lo; si no, simplement ometre l'`else` i dir que `else` pot quedar buit en casos reals.*

**Millor exemple:** Karel pot o no pot avançar (obstacle):
```
. . P . . .
. . . . . .
K> . . . . .
```
`".,.,P,.,.,.\n.,.,.,.,.,.\nK>,.,.,.,.,."` — 3 files, 6 cols

**Codi:**
```python
# Karel avança; si troba obstacle, gira a l'esquerra
for _ in range(5):
    if front_is_clear():
        move()
    else:
        turn_left()
```

*(Aquest exemple requereix ajustar el mapa perquè el comportament resultant sigui visible i interessant.)*

---

### Exercici

**Enunciat:**
> El món conté una fila amb algunes caselles amb perla i d'altres sense. En Karel ha de recollir **totes** les perles que trobi al llarg de les cinc caselles davant seu. Escriu el codi perquè funcioni independentment de quines caselles tinguin perla.

**Pista:**
> Usa un `for _ in range(5):`. Dins del `for`, usa un `if pearl_here():` per recollir la perla si n'hi ha.

**Mapa:** 6 cols × 3 files, perles a posicions 1, 3 i 5 (posicions 0-indexed des de Karel)
```
. . . . . .
K> A . A . A
. . . . . .
```
`".,.,.,.,.,.\nK>,A,.,A,.,A\n.,.,.,.,.,."` — 3 files, 6 cols

**Mapa goal** (Karel a la dreta, motxilla amb 3 perles, no queden perles al món):
`".,.,.,.,.,.\n.,.,.,.,.,K>\n.,.,.,.,.,."` — sense perles al món

**Solució esperada:**
```python
for _ in range(5):
    move()
    if pearl_here():
        grab()
```

---
---

## Capítol 7 — Mentre

**Concepte nou:** `while cond():`  
**Prerequisits:** capítol 6 (if/else)

### Arc narratiu

El `for` és per quan saps quantes vegades vols repetir. El `while` és per quan **no ho saps**. Aquest capítol allibera en Karel dels mons de mida fixa: a partir d'ara, un programa pot funcionar en un món de 3 caselles i en un de 30 sense canviar ni una línia de codi. A més, s'introdueix el clàssic *fencepost error* com a exemple de bug concret i ensenyable.

---

### Secció 1 — Quan no saps quantes vegades

**Títol h2:** «Repetir fins que... `while`»

**Text:**

> El `for` repeteix un nombre fix de vegades: `range(5)` sempre és cinc. Però, i si el món podria tenir cinc caselles o deu o quinze, i el programa ha de funcionar en tots els casos?
>
> `while cond():` repeteix el bloc de sota **mentre la condició sigui certa**. En el moment que la condició és falsa, el bucle s'atura.
>
> ```python
> while front_is_clear():
>     move()
> ```
>
> En Karel avança mentre tingui la via lliure davant. Quan topa amb la paret (o una roca), s'atura. No li has hagut de dir quantes caselles té el món.

---

### Exemple 1 (view-only) — Anar fins a la paret

**Text introductori:**
> En Karel avança fins al final del món, sigui quin sigui el seu ample. Executa'l i observa:

**Mapa:** 7 cols × 3 files (un món ample per fer visible la travessa)
```
. . . . . . .
K> . . . . . .
. . . . . . .
```
`".,.,.,.,.,.,.\nK>,.,.,.,.,.,.\n.,.,.,.,.,.,."` — 3 files, 7 cols

**Codi:**
```python
while front_is_clear():
    move()
```

**Text posterior:**
> Dues línies. Si canviessis el mapa a un de 3 caselles o de 20, el programa funcionaria exactament igual.

---

### Secció 2 — L'error del tancapalissada

**Títol h2:** «Compte amb l'error del tancapalissada»

**Text:**

> Imagina que vols que en Karel col·loqui una perla a **cada casella** del món (inclosa la primera). Un primer intent podria ser:
> ```python
> while front_is_clear():
>     drop()
>     move()
> ```
>
> Quina casella queda sense perla? L'última. En Karel fa `drop()` i `move()` junts: quan la condició del `while` es fa falsa (ja no pot avançar), el bucle s'atura **sense executar el darrer `drop()`**.
>
> Això s'anomena **error del tancapalissada** (*fencepost error*): si vols construir una tanca de cinc panells, necessites sis pals de tancapalissada (un a cada extrem de cada panell). El nombre de pals sempre és un més que el de panells.
>
> La solució és fer el `drop()` **fora** del `while`, just després:
> ```python
> while front_is_clear():
>     drop()
>     move()
> drop()  # ← la darrera casella
> ```

---

### Exemple 2 (view-only) — Recollir totes les perles d'una fila

**Text introductori:**
> En Karel recull totes les perles d'una fila de llargada desconeguda. A cada casella: si hi ha perla, la recull; llavors avança si pot. Observa la solució al tancapalissada:

**Mapa:** 6 cols × 3 files, perles a totes les caselles de la fila del mig
```
. . . . . .
K> A A A A A
. . . . . .
```
`".,.,.,.,.,.\nK>,A,A,A,A,A\n.,.,.,.,.,."` — 3 files, 6 cols

**Codi:**
```python
if pearl_here():
    grab()
while front_is_clear():
    move()
    if pearl_here():
        grab()
```

**Text posterior:**
> Primer comprovem la casella inicial (fora del `while`). Llavors, per cada casella a la qual avançem, comprovem de nou. En Karel recollirà totes les perles sense errors, en un món de qualsevol mida.

---

### Exercici

**Enunciat:**
> En Karel és al principi d'un passadís de llargada desconeguda. Hi ha perles disperses al llarg del passadís. Escriu un programa que en Karel reculli totes les perles fins al final del passadís. El programa ha de funcionar en passadissos de qualsevol llargada.

**Pista:**
> Usa `while front_is_clear():` per avançar. Dins del `while`, comprova `if pearl_here():` per recollir. Recorda comprovar la primera casella **abans** d'entrar al `while`.

**Mapa:** 7 cols × 3 files, perles disperses
```
. . . . . . .
K> . A . A A .
. . . . . . .
```
`".,.,.,.,.,.,.\nK>,.,A,.,A,A,.\n.,.,.,.,.,.,."` — 3 files, 7 cols

**Mapa goal:** Karel al final de la fila, motxilla amb 3 perles, cap perla al món.

**Solució esperada:**
```python
if pearl_here():
    grab()
while front_is_clear():
    move()
    if pearl_here():
        grab()
```

---
---

## Capítol 8 — Combinant condicions

**Concepte nou:** `not`, `and`, `or`  
**Prerequisits:** capítol 7 (while + if)

### Arc narratiu

Les condicions simples (`pearl_here()`, `front_is_clear()`) cobreixen molts casos. Però a vegades la situació que volem comprovar és més complexa: «si no hi ha perla aquí» o «si el camí és lliure i la motxilla no és buida». Aquest capítol és tècnic i breu: tres operadors, exemples clars, exercici integrador.

---

### Secció 1 — Negar una condició: `not`

**Títol h2:** «Al revés: `not`»

**Text:**

> `not` inverteix el resultat d'una condició: allò que era cert es torna fals, i viceversa.
>
> ```python
> if not pearl_here():
>     drop()
> ```
>
> «Si **no** hi ha perla aquí, deixa'n una.» En lloc de comprovar el que hi ha, comprovem el que **falta**.
>
> `not front_is_clear()` és equivalent a `front_is_blocked()`. Pots usar el que et sembli més llegible.

---

### Exemple 1 (view-only) — Omplir els buits

**Text introductori:**
> El món té una fila on algunes caselles ja tenen perla i d'altres no. En Karel ha d'afegir perles a les caselles buides (en Karel ja porta 3 perles a la motxilla):

**Mapa:** 5 cols × 3 files, perles a posicions 1 i 3
```
. . . . .
K> A . A .
. . . . .
```
`".,.,.,.,.\nK>,A,.,A,.\n.,.,.,.,."` — 3 files, 5 cols

*Nota: Karel ha de partir amb perles a la motxilla. Si el motor no ho permet via CSV, adaptar: Karel recull primer 2 perles d'una altra fila i llavors omple els buits.*

**Codi (assumint motxilla inicialitzada a 2):**
```python
for _ in range(4):
    move()
    if not pearl_here():
        drop()
```

**Text posterior:**
> `not pearl_here()` és cert a les caselles buides. En Karel deixa una perla exactament on no n'hi havia. Les caselles que ja tenien perla queden intactes.

---

### Secció 2 — Combinar dues condicions: `and`, `or`

**Títol h2:** «Les dues condicions alhora: `and` i `or`»

**Text:**

> `and` fa que el resultat sigui cert **només si les dues condicions** ho són:
> ```python
> if front_is_clear() and pearl_here():
>     grab()
>     move()
> ```
>
> `or` fa que el resultat sigui cert **si almenys una** de les condicions ho és:
> ```python
> if front_is_blocked() or bag_is_empty():
>     turn_left()
> ```
>
> Pots combinar `not`, `and` i `or` en la mateixa condició. Quan ho facis, afegeix parèntesis per deixar clara la precedència:
> ```python
> if front_is_clear() and not pearl_here():
>     move()
> ```

---

### Exemple 2 (view-only) — Avançar mentre pot i té perles

**Text introductori:**
> En Karel avança i va deixant perles fins que o bé arriba a la paret o bé se li acaben les perles. El `while` usa `and` per comprovar les dues condicions alhora:

**Mapa:** 7 cols × 3 files, Karel amb perles a la motxilla (simular via codi inicial que fa grab primer):

Alternativament: Karel primer recull 3 perles i llavors avança deixant-les.

**Mapa:** 7 cols × 3 files, 3 perles al principi per recollir, llavors espai per deixar-les:
```
. . . . . . .
K> A A A . . .
. . . . . . .
```
`".,.,.,.,.,.,.\nK>,A,A,A,.,.,.\n.,.,.,.,.,.,."` — 3 files, 7 cols

**Codi:**
```python
# Primer recull les perles de l'inici
for _ in range(3):
    move()
    grab()

# Ara avança deixant perles fins que no pugui o s'acabin
while front_is_clear() and not bag_is_empty():
    move()
    drop()
```

**Text posterior:**
> Dues condicions juntes amb `and`: el bucle s'atura quan la primera és falsa (paret) **o** quan la segona és falsa (motxilla buida). En Karel no intentarà fer `drop()` si no té perles.

---

### Exercici

**Enunciat:**
> En Karel és al principi d'un passadís. Porta 4 perles a la motxilla. Ha d'avançar i deixar una perla a cada casella que trobi buida, però **només** si el camí és lliure i la motxilla no és buida. Quan s'aturi (ja sigui perquè ha tocat la paret o perquè s'han acabat les perles), el programa ha d'acabar.

**Pista:**
> El `while` ha de comprovar dues coses alhora: que el camí és lliure `and` que la motxilla no és buida. Dins del `while`, usa `if not pearl_here():` per deixar perla només on no n'hi ha.

**Mapa:** 6 cols × 3 files, algunes caselles ja tenen perla. Karel porta perles (simular que recull 4 perles d'una fila addicional, o usar la primera fila com a magatzem):

Per simplicitat: Karel recull les seves 4 perles de les primeres caselles i llavors omple els buits de la resta.

**Mapa:** 7 cols × 3 files
```
. . . . . . .
K> A A A A . .
. . . . . . .
```

**Codi solució:**
```python
# Karel recull 4 perles de les primeres caselles
for _ in range(4):
    move()
    grab()

# Ara omple els buits mentre pugui i tingui perles
while front_is_clear() and not bag_is_empty():
    move()
    if not pearl_here():
        drop()
```

---
---

## Capítol 9 — Com escriure bon codi

**Concepte nou:** comentaris `#`, noms clars, estil  
**Prerequisits:** tots els capítols anteriors

### Arc narratiu

Saber que el codi funciona no és suficient: el codi també s'ha de poder llegir. Aquest capítol no introdueix cap nova ordre: ensenya l'ofici. Els tres pilars són: comentaris per explicar el «per què», noms de procediments que es llegeixen com a frases, i estructura que reflecteix el pla. L'exercici és el primer en què l'alumne ha d'escriure codi **net** d'entrada, no corregir codi brut.

---

### Secció 1 — Els comentaris

**Títol h2:** «Parlar amb el futur tu: `#`»

**Text:**

> Un comentari és text que el programa ignora completament, però que els humans llegiran. Comença amb `#` i ocupa la resta de la línia.
>
> ```python
> # Karel recull totes les perles del passadís
> while front_is_clear():
>     move()
>     if pearl_here():
>         grab()
> ```
>
> Un bon comentari no explica **el que fa** el codi (això ja es llegeix directament). Explica **per què** es fa d'una manera determinada, o quin és el pla general.
>
> «`# recull la perla`» davant d'un `grab()` no afegeix res. «`# cal comprovar la primera casella fora del while per l'error del tancapalissada`» sí que afegeix alguna cosa.

---

### Secció 2 — Noms que s'expliquen sols

**Títol h2:** «Noms que expliquen el que fan»

**Text:**

> Compara aquests dos programes. Tots dos fan exactament el mateix:

```python
# Versió A — noms opacs
def f():
    turn_left()
    move()
    turn_right()
    move()

f()
f()
f()
```

```python
# Versió B — noms clars
def puja_graó():
    turn_left()
    move()
    turn_right()
    move()

puja_graó()
puja_graó()
puja_graó()
```

> Quan llegeixes la Versió B, saps immediatament el que fa el programa sense entrar als detalls. La Versió A et força a llegir la implementació de `f()` per entendre res.
>
> Un bon nom de procediment descriu **l'acció que realitza**, en infinitiu i de manera específica. `puja_graó()` és millor que `puja()`. `recull_totes_les_perles()` és millor que `recull()`.

---

### Secció 3 — Estructura que reflecteix el pla

**Títol h2:** «El codi hauria de semblar el teu pla»

**Text:**

> Quan tens un problema amb diverses fases, el programa principal hauria de semblar la llista de fases. Cada fase és un procediment amb nom propi.
>
> Si algú llegeix el teu `main` i entén el pla sense llegir cap definició, has fet bé la feina.

Mostra la comparació:

```python
# ❌ Difícil de llegir:
move()
move()
grab()
turn_left()
move()
move()
move()
turn_right()
move()
drop()

# ✓ Fàcil de llegir:
def recull_perla():
    move()
    move()
    grab()

def porta_al_destí():
    turn_left()
    move()
    move()
    move()
    turn_right()
    move()
    drop()

recull_perla()
porta_al_destí()
```

*(Exemple purament textual, sense simulador.)*

---

### Exemple (view-only) — Codi net en acció

**Text introductori:**
> Aquí tens un programa complet que segueix totes les bones pràctiques: comentaris útils, noms clars i estructura que reflecteix el pla. Llegeix-lo de dalt a baix i comprova que entens el pla **sense** mirar les definicions:

**Mapa:** 5 cols × 4 files, escala + perla a la cima
```
. A . . .   fila 0  ← perla a (col 1, fila 0)? O a la cima de l'escala
P . . . .   fila 1
P P . . .   fila 2
K> . . . .  fila 3
```
`".,A,.,.,.\nP,.,.,.,.\nP,P,.,.,.\nK>,.,.,.,."` — 4 files, 5 cols

Karel puja 2 graons i recull la perla.

**Codi:**
```python
# Pujar un graó de l'escala
def puja_graó():
    turn_left()
    move()
    turn_right()
    move()

# ── Programa principal ──────────────────
# Fase 1: escalar fins a la cima
puja_graó()
puja_graó()

# Fase 2: recollir la perla de la cima
grab()
```

**Text posterior:**
> Fins i tot sense saber res de Karel, qualsevol persona pot llegir el «programa principal» i entendre el pla: primer puja dos graons, llavors recull la perla.

---

### Exercici

**Enunciat:**
> Escriu un programa que porti en Karel a recollir dues perles situades en dos punts del món i les deixi al punt de destí. El programa ha de tenir: almenys dos procediments amb noms clars, un comentari que expliqui el pla general, i cap lletra o nom que no tingui significat obvi.

**Pista:**
> Comença pensant en el pla: «primer faig X, llavors faig Y, finalment faig Z». Escriu el pla com a comentaris. Llavors implementa cada part com un procediment.

**Mapa:** 5 cols × 5 files
```
. . . . .
. . . A .   fila 1 ← perla a (col 3, fila 1)
. . . . .
. A . . .   fila 3 ← perla a (col 1, fila 3)
K> . . . .  fila 4 ← Karel
```
`".,.,.,.,.\n.,.,.,A,.\n.,.,.,.,.\n.,A,.,.,.\nK>,.,.,.,."` — 5 files, 5 cols

El destí és (col 4, fila 0) o similar — un punt clar a l'extrem del món.

**No hi ha una única solució correcta.** Es valora que el codi sigui llegible, no que segueixi un camí específic.

---
---

## Capítol 10 — Reptes

**Concepte nou:** cap (integra tot el curs)  
**Prerequisits:** tots els capítols anteriors

### Arc narratiu

L'últim capítol és una col·lecció d'exercicis de dificultat creixent. No hi ha explicació nova: és la pista d'aterratge del curs. L'alumne aplica tot el que ha après per resoldre problemes que integren múltiples conceptes. Cada repte és independent i va acompanyat d'una descripció clara i un consell de per on atacar-lo.

El format és diferent als capítols anteriors: no hi ha seccions d'explicació, només exercicis (tots amb `data-label="Exercici"`).

---

### Introducció del capítol (text breu)

> Has après les eines fonamentals de la programació: ordres, bucles, condicions, procediments i estratègia. Ara és l'hora d'aplicar-les.
>
> Els reptes d'aquí no tienen una sola solució correcta. Pots resoldre'ls d'una manera o d'una altra. El que importa és que en Karel acabi on ha d'acabar i que el teu codi sigui clar i entenedor.
>
> Comença pel primer i avança al teu ritme.

---

### Repte 10.1 — La recollida (fàcil)

**Enunciat:**
> Hi ha cinc perles disperses en una fila de longitud desconeguda. En Karel ha de recollir-les totes i arribar al final de la fila.

**Conceptes:** `while`, `if`

**Mapa:** 8 cols × 3 files
```
. . . . . . . .
K> . A . A A . A
. . . . . . . .
```
`".,.,.,.,.,.,.,.\nK>,.,A,.,A,A,.,A\n.,.,.,.,.,.,.,."` — 3 files, 8 cols

**Codi referència (no mostrar):**
```python
if pearl_here():
    grab()
while front_is_clear():
    move()
    if pearl_here():
        grab()
```

---

### Repte 10.2 — El serpentí (intermedi)

**Enunciat:**
> En Karel ha de recollir totes les perles d'un món en forma de passadís en ziga-zaga (dues files). La fila superior i la inferior estan connectades als extrems.

**Conceptes:** `while`, `if`, `turn_left()`, `turn_right()`

**Mapa:** 5 cols × 2 files, perles a totes les caselles
```
A A A A A
K> A A A A
```
`"A,A,A,A,A\nK>,A,A,A,A"` — 2 files, 5 cols

Recorregut: avança per la fila inferior (4 passos, recollint), gira amunt (1 pas), gira a l'esquerra i recorre la fila superior fins al final.

**Codi referència:**
```python
# Fila inferior (anant cap a l'Est)
if pearl_here():
    grab()
while front_is_clear():
    move()
    if pearl_here():
        grab()

# Gira cap a la fila superior
turn_left()
move()
turn_left()

# Fila superior (anant cap a l'Oest)
if pearl_here():
    grab()
while front_is_clear():
    move()
    if pearl_here():
        grab()
```

---

### Repte 10.3 — L'escala doble (intermedi-alt)

**Enunciat:**
> En Karel ha de pujar una escala, recollir la perla de la cima, baixar-la i deixar-la al peu. La baixada és simètrica a la pujada.

**Conceptes:** `def`, `for`

**Mapa:** 5 cols × 5 files, escala de 4 graons, perla a la cima:
```
A . . . .   fila 0
P . . . .   fila 1
P P . . .   fila 2
P P P . .   fila 3
K> . . . .  fila 4
```
`"A,.,.,.,.\nP,.,.,.,.\nP,P,.,.,.\nP,P,P,.,.\nK>,.,.,.,."` — 5 files, 5 cols

**Codi referència:**
```python
def puja_graó():
    turn_left()
    move()
    turn_right()
    move()

def baixa_graó():
    turn_right()
    move()
    turn_left()
    move()

# Pujar
for _ in range(4):
    puja_graó()

# Recollir
grab()

# Baixar (i durant la baixada, anar deixant la perla finalment)
for _ in range(4):
    baixa_graó()

drop()
```

*Nota: la baixada en mirall pot necessitar ajust depenent de l'orientació final de Karel a la cima. Verificar amb el simulador.*

---

### Repte 10.4 — El laberint (difícil)

**Enunciat:**
> En Karel és a l'entrada d'un laberint. La perla és a la sortida. Troba el camí. El laberint té sempre una solució seguint la paret de la dreta.

**Conceptes:** `while`, `if`, `and`, `not`, `def`

**Mapa:** el laberint del repte predefinit 5 (ja existent a `reptes.js`):
```
K> . P . . .
. . P . P .
. . . . P .
P P P . P .
. . . . . A
```

**Estratègia (regla de la mà dreta):**
```python
def gira_dreta_i_avança():
    turn_right()
    if front_is_clear():
        move()

while not pearl_here():
    if front_is_clear():
        move()
    else:
        turn_left()
grab()
```

*(La implementació correcta de la regla de la mà dreta és més complexa. L'enunciat pot proposar que l'alumne explorin el laberint sense algorisme formal, simplement provant camins.)*

---

### Repte 10.5 — El missatger (difícil)

**Enunciat:**
> El món té perles disperses per tot arreu (múltiples files i columnes). En Karel ha de recollir-les totes i portar-les a la cantonada inferior dreta. El món és sempre quadrat (NxN) però la mida és desconeguda.

**Conceptes:** tots

**Mapa:** 4 cols × 4 files, perles disperses:
```
. A . .
. . A .
A . . .
K> . A .
```
`".,A,.,.\n.,.,A,.\nA,.,.,.\nK>,.,A,."` — 4 files, 4 cols

**Estratègia suggerida (comentari a l'enunciat):**
> Pista: pensa en com recórrer sistemàticament totes les caselles. Un patró de «serp» (una fila cap a l'Est, baixa, la següent cap a l'Oest, baixa, etc.) és una estratègia habitual.

---

### Nota final del capítol

> Enhorabona. Has acabat el curs de Karel.
>
> Les eines que has après —bucles, condicions, procediments, descomposició— no desapareixen quan tanques aquesta pàgina. Les trobaràs de nou, amb noms lleugerament diferents, en Python, JavaScript, o qualsevol altre llenguatge que aprenguis. La lògica és la mateixa.
>
> En Karel ha estat el teu primer robot. Els que venen a continuació seran molt més grans.

---

## Notes d'implementació transversals

### Mapa amb motxilla inicial
Alguns exemples (cap. 8) requereixen que en Karel comenci amb perles a la motxilla. Si el motor no ho suporta via CSV, la solució és dissenyar el mapa perquè en Karel reculli les perles necessàries en la primera fase del codi, abans d'executar la part que es vol demostrar.

### Mapes goal
Els exercicis amb `data-goal` permeten validar l'estat final del món. Assegura't que el goal codifica correctament la posició final de Karel, les perles al món i (si el motor ho suporta) el contingut de la motxilla.

### Alçada dels simuladors
- Exemples view-only senzills (1 fila, ≤4 cols): `data-height="280"`
- Exemples normals (2-3 files): `data-height="340"`
- Exemples amb log visible: `data-height="420"`
- Exercicis (afegir espai per al log): `data-height="460"`

### Ordre de les definicions `def`
Recordar que en el motor karelcat les definicions s'han d'escriure **abans** de ser usades. Els exemples del guió ja segueixen aquesta convenció.
