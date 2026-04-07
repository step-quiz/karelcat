# clean-karelcat — Briefing tècnic per a IA

> Aquest document descriu l'estat actual del projecte **clean-karelcat** i les tasques pendents. Està pensat per ser consumit per una IA que continuï el desenvolupament sense haver participat en les converses anteriors.
>
> **Regla de manteniment:** qualsevol sessió de treball que modifiqui vocabulari, arquitectura, comportament o estat de tasques ha d'actualitzar aquest document abans de tancar. Un BRIEFING obsolet és més perillós que no tenir-ne.

---

## 1. Context: Stanford Karel i què volem imitar

### Què és Stanford Karel

Karel és un entorn de programació educatiu creat als anys 70 per Rich Pattis a Stanford. S'utilitza al curs CS106A per ensenyar programació a principiants absoluts. L'alumne controla un robot (Karel) dins d'una graella, donant-li instruccions en un llenguatge molt reduït.

Stanford ofereix un «Karel Reader» interactiu al web:
- URL: `https://compedu.stanford.edu/karel-reader/docs/python/en/intro.html`
- 11 capítols amb exemples executables incrustats (editor + món + botó Run dins de cada pàgina).
- Barra lateral amb la llista de capítols sempre visible.
- Interfície extremadament minimalista: codi a l'esquerra, món a la dreta, un o dos botons (Run Program, Show Text Descriptions), i res més.

### Què volem imitar de Stanford

- **Netedat visual radical**: zero soroll, zero modals, zero menús desplegables, zero barres carregades. Només el codi, el món, i el mínim imprescindible de controls.
- **Estructura de curs en capítols**: una llista numerada de capítols, cadascun amb explicació breu + exemples executables + exercicis integrats.
- **Exemples executables dins de cada capítol**: l'alumne llegeix l'explicació i immediatament pot executar codi dins de la mateixa pàgina, sense sortir a un IDE separat.
- **Navegació lineal clara**: l'alumne sap on és, quants capítols hi ha, i com avançar.
- **Sintaxi Python real**: l'alumne escriu `move()`, `def`, `for _ in range(N):`, `if cond():` — exactament el mateix que trobaria en Python real. Qualsevol programa Karel vàlid és Python vàlid (amb un shim que defineixi les funcions).

### Què NO volem imitar de Stanford

- **L'idioma únic**: Stanford només admet anglès. Clean-karelcat separa l'idioma del codi (ara anglès, escalable a català/castellà) de l'idioma de la interfície (ara català, escalable a altres).
- **La temàtica asèptica**: Stanford té un robot rectangular sobre fons blanc. Clean-karelcat té una medusa rosa en un fons marí amb roques i perles.
- **Els beepers**: Stanford usa «beepers» com a objecte recollible. Clean-karelcat usa perles (`pearl`), coherent amb la temàtica marina.

---

## 2. Què hem aconseguit fins ara

### 2.1 Arquitectura i18n de dos eixos ortogonals

El sistema de traduccions té dos objectes independents:

- **`K.CODE_LANGS`** — vocabulari del llenguatge de programació. Ara conté una sola entrada (`en`). Afegir un nou idioma de codi (p.ex. `ca` amb `mentre`, `si`, `repeteix`) és purament additiu.
- **`K.UI_LANGS`** — textos de la interfície. Ara conté una sola entrada (`ca`). Afegir un nou idioma d'interfície (p.ex. `es`, `en`) és igualment additiu.

Les dues variables `K.state.codeLang` i `K.state.uiLang` controlen quin idioma s'usa a cada eix.

Configuració actual: **codi en anglès (Python-compatible), interfície en català**.

### 2.2 Vocabulari del llenguatge (sintaxi Python-compatible)

El dialecte Karel és un **subconjunt vàlid de Python**. Qualsevol programa Karel vàlid pot enganxar-se a un intèrpret Python real (amb un shim que defineixi `move`, `turn_left`, etc.) i executar-se sense errors de sintaxi.

**Ordres (6):**
```
move()  turn_left()  turn_right()  turn_around()  grab()  drop()
```

**Condicions (5):**
```
front_is_clear()   front_is_blocked()   pearl_here()   bag_is_empty()   bag_is_full()
```

**Paraules clau estructurals:**
```
if  else  while  for  in  range  def  not  and  or
```

**Estructures de control:**
```python
# Condicional
if front_is_clear():
    move()

if pearl_here():
    grab()
else:
    drop()

# Bucle comptat (la variable pot ser qualsevol identificador; _ és la convenció)
for _ in range(N):
    move()

# Bucle condicional
while front_is_clear():
    move()

# Definició de procediment
def nom():
    move()
    turn_left()
```

**Comentaris:** `#` (inici de comentari, com a Python).

**Indentació:** 2 espais per nivell (4 també acceptat). Els blocs es delimiten per indentació, **no** per `{ }`.

**Decisions de disseny rellevants:**
- `grab()` i `drop()` operen sobre la **casella actual** de Karel (no la del davant). Coherent amb el Karel original de Rich Pattis (1972).
- `pearl_here()` reflecteix aquesta semàntica amb el sufix `_here`.
- `front_is_clear()` i `front_is_blocked()` miren la casella del davant.
- Les condicions negades existeixen: `front_is_blocked()` és l'oposat de `front_is_clear()`. L'alumne pot usar `not front_is_clear()` o `front_is_blocked()` indistintament.
- Sense `turn_right` ni `turn_around` built-in a Stanford Python; al nostre motor sí que existeixen com a ordres directes.

### 2.3 Semàntica canònica restaurada

- `grab()` i `drop()` operen tots dos sobre la **casella actual** de Karel. Abans, `grab()` operava sobre la casella del davant i `drop()` sobre l'actual — una inconsistència eliminada.
- `pearl_here()` reflecteix aquesta semàntica amb el sufix `_here`.
- Les condicions de moviment (`front_is_blocked()`, `front_is_clear()`) miren la casella del davant.

### 2.4 Nomenclatura coherent

Les paraules `wall` i `water` s'han eliminat **completament** del projecte. Totes les referències usen `rock` i `pearl`. Els noms interns de l'intèrpret (`path-clear`, `rock-ahead`, etc.) no canvien — l'usuari mai els veu.

### 2.5 Interfície Stanford-like

- **Fila 1 (topbar)**: logo medusa + «Karel», badge d'estat (dot + text), motxilla, botó tema fosc/clar. Cap altre botó ni menú.
- **Fila 2 (toolbar)**: botó mutant Executa↔Atura + botó Reinicia + slider de velocitat. **Dos botons** en total (com Stanford).
- **Zona principal**: editor de codi (esquerra, 50%) + món de Karel (dreta, 50%). Proporció 1:1 com Stanford.
- **Log de missatges**: sota l'editor, es buida automàticament a cada execució.
- **Botó mutant**: un sol `<button>` que diu «▶ Executa» (verd) en repòs i «■ Atura» (vermell) durant l'execució.
- **Eliminats**: tots els modals, menú hamburguesa, dropdown de configuració, selectors d'idioma, botó de reptes, botó de referència, botó de missatges, botó de pas, panell d'ajuda, panell de pistes, onboarding, editor de mapes.

### 2.6 Assets visuals nous (pixel art SVG 16×16)

- **Medusa** (Karel): rosa amb tentacles. En mode clar, té un contorn lila d'1 píxel (`#6B0D4F`) generat algorítmicament.
- **Roca** (obstacle): marró amb textura (esquerdes, ombres) i molsa verda a la base.
- **Perla** (objecte recollible): esfera nacrada gris-blavosa amb speckle blanc i gradació d'ombra.

### 2.7 Mode fosc/clar

- Botó amb icones SVG sol/lluna (Feather Icons) a dalt a la dreta del header.
- Preferència desada a `localStorage` (`'karel-theme'`).

### 2.8 Mètriques del projecte

```
Fitxers:        28 (README, index.html, style.css, 12 JS, curs/*)
Línies de codi: ~1550 (JS + HTML, sense CSS)
CSS:            640 línies (net, sense zombie)
Mida total:     ~115 KB sense comprimir (~32 KB comprimit)
```

### 2.9 Fitxers del projecte i responsabilitats

```
index.html          — HTML minimalista (topbar + toolbar + editor + món)
style.css           — Estils (640 línies útils, sense zombie)
js/constants.js     — Assets SVG, direccions, accions, velocitats, mapa i codi per defecte
js/i18n.js          — CODE_LANGS + UI_LANGS + funcions t()/tf()
js/state.js         — Estat centralitzat + K.lang (tokens del parser) + applyCodeLang()
js/tokenizer.js     — Funció pura: codi → tokens (basat en indentació, Python-compatible)
js/parser.js        — Tokens → AST (recursive descent parser, blocs per indentació)
js/interpreter.js   — AST → generador JS que yield accions una per una
js/execution.js     — Consumeix el generador, executa accions, gestiona run/stop/reset
js/world.js         — Gestió del món: CSV↔grid, helpers, avaluació de condicions
js/renderer.js      — Renderitzat diferencial del món al DOM (grid CSS)
js/editor.js        — Ressaltat sintàctic, numeració de línies, autocompletat
js/ui.js            — Log, badge d'estat, botó mutant, slider, toggle fosc/clar
js/main.js          — Inicialització: connecta tots els mòduls en seqüència
js/reptes.js        — Definicions de 5 reptes predefinits + gestió de ?repte=N

curs/index.html     — B.1: Pàgina índex del curs (llista de 10 capítols, estil Stanford)
curs/capitol.html   — B.3: Plantilla HTML de capítol (esquelet reutilitzable, comentat)
curs/capitol-1.html — Capítol 1: Coneix en Karel (move, turn_left, turn_right) ✅
curs/capitol-2.html — Capítol 2: Agafa i deixa (grab, drop, pearl_here) ✅
curs/capitols.js    — Dades dels 10 capítols + renderSidebar() + renderSimuladors() + toggle mòbil
curs/curs.css       — Estils per a totes les pàgines del curs
```

### 2.10 Contractes verificats

- **Contracte K.***: cada símbol `K.X` cridat des de qualsevol fitxer JS és definit en algun altre fitxer JS. Zero símbols orfes.
- **Contracte HTML↔JS**: cada ID que els scripts cerquen amb `getElementById` existeix a `index.html`.
- **Zero referències a paraules antigues**: `wall`, `water`, `isWall`, `CORALL`, `BOMBOLLA`, `K.I18N`, `currentCodeLang`, `currentUserLang`, `repeat_kw`, `proc_kw`, `checkChallengeSuccess` — cap d'aquestes existeix en cap fitxer del projecte.

### 2.11 Neteja tècnica completada (Categoria C)

La **Categoria C** s'ha executat íntegrament. Inclou:
- **CSS**: de 1405 → 640 línies. Eliminats modals, hamburguesa, onboarding, editor de mapes, panells de pistes/referència, selectors d'idioma.
- **state.js**: eliminades propietats obsoletes (`editMode`, `editBrush`, `currentChallengeId`, etc.).
- **constants.js**: eliminades `LS_ONBOARD` i `K.LS_ONBOARD`.
- **Estils inline** del botó tema moguts a CSS.

### 2.12 Migració a sintaxi Python (completada)

El motor ha estat migrat a sintaxi Python-compatible. Canvis principals:
- `tokenizer.js`: reescrit per processar indentació i emetre tokens `INDENT`/`NL`/`:`.
- `parser.js`: reescrit per parserar blocs per indentació (no per `{ }`).
- `i18n.js`: vocabulari actualitzat (`for`/`def`/`range` en lloc de `repeat`/`proc`).
- `state.js`: `applyCodeLang` actualitzat per llegir les noves claus.
- `editor.js`: ressaltat sintàctic actualitzat (`:`/`#` en lloc de `{}`/`//`).
- Capítols 1 i 2, reptes predefinits: codi actualitzat a la nova sintaxi.

Els noms **interns** de l'intèrpret (`path-clear`, `rock-ahead`, etc.) no han canviat — l'intèrpret és agnòstic a la sintaxi.

### 2.13 Infraestructura del curs completada (Categoria B)

```
curs/index.html   — Pàgina índex del curs (llista de 10 capítols, estil Stanford)
curs/capitol.html — Plantilla reutilitzable per a capítols (commentada)
curs/capitols.js  — Dades + renderSidebar() + renderSimuladors() + toggle mòbil
curs/curs.css     — Estils complets del curs
js/reptes.js      — 5 reptes predefinits + gestió de ?repte=N
```

**Simuladors incrustats via iframes** (`../index.html?embed=1&map=BASE64&code=BASE64`). El motor usa el namespace global `K.*` i no és instanciable múltiples vegades al mateix DOM sense refactoritzar; els iframes permeten N instàncies completament independents.

**Deep links per Classroom**: `index.html?repte=N` carrega el repte N directament.

---

## 3. Tasques pendents (categoritzades i numerades)

### Categoria A — Curs (capítols)

| # | Títol | Estat | Conceptes nous |
|---|-------|-------|---------------|
| A.1 | Coneix en Karel | ✅ **FET** | `move()`, `turn_left()`, `turn_right()`. Món, graella, direccions. |
| A.2 | Agafa i deixa | ✅ **FET** | `grab()`, `drop()`, motxilla, `pearl_here()`. Errors. |
| A.3 | Repeteix | ⬜ pending | `for <var> in range(N):`, indentació, blocs. La variable és convencionalment `_`. |
| A.4 | Procediments | ⬜ pending | `def nom():`. Crear ordres noves. |
| A.5 | Descomposició | ⬜ pending | Cap sintaxi nova. Mètode top-down. Precondicions/postcondicions. |
| A.6 | Condicionals | ⬜ pending | `if cond():` / `else:`. |
| A.7 | Mentre | ⬜ pending | `while cond():`. Fencepost error. |
| A.8 | Combinant condicions | ⬜ pending | `not`, `and`, `or`. |
| A.9 | Com escriure codi | ⬜ pending | Comentaris `#`, noms clars, estructura. |
| A.10 | Reptes | ⬜ pending | Col·lecció d'exercicis de dificultat creixent. |

Cada capítol és un fitxer HTML independent (`curs/capitol-N.html`) basat en la plantilla `curs/capitol.html`. Per activar-lo a l'índex, afegir el nom de l'arxiu al conjunt `DISPONIBLES` a `curs/index.html`.

Existeix un guió detallat dels capítols 3–10 (`docs/guio-capitols-3-10.md`) amb arc narratiu, text, mapes i codi de tots els exemples i exercicis.

### Categoria B — Infraestructura dels capítols ✅ COMPLETADA

Veure secció 2.13.

### Categoria C — Neteja tècnica ✅ COMPLETADA

Veure secció 2.11.

### Categoria D — Millores visuals

| # | Tasca | Detall |
|---|-------|--------|
| D.1 | Verificar roques i perles en mode clar | Les roques i perles s'han dissenyat pensant en fons fosc. Comprovar que es veuen bé sobre fons blanc. |
| D.2 | Emoji de la motxilla | Ara la motxilla no té emoji al costat del número. Decidir si n'hi volem un (⚪?) o si queda millor sense. |
| D.3 | Responsive mòbil | Verificar les mediaqueries (820px, 600px) amb el layout nou (50/50, topbar simplificada). |
| D.4 | Favicon | Posar la medusa rosa com a favicon de la pàgina. |

### Categoria E — Funcionalitat futura

| # | Tasca | Detall |
|---|-------|--------|
| E.1 | Idioma de codi català | Afegir `K.CODE_LANGS.ca` amb `mentre`, `si`, `sinó`, `repeteix`, `procediment`, `no`, `i`, `o`, `avança`, `gira_esquerra`, `gira_dreta`, `gira_enrere`, `agafa`, `deixa`, `davant_lliure`, `davant_bloquejat`, `perla_aquí`, `motxilla_buida`, `motxilla_plena`. |
| E.2 | Idioma de codi castellà | Afegir `K.CODE_LANGS.es` amb l'equivalent castellà. |
| E.3 | Idioma d'interfície anglès | Afegir `K.UI_LANGS.en` amb tots els textos d'interfície en anglès. |
| E.4 | Idioma d'interfície castellà | Afegir `K.UI_LANGS.es` amb tots els textos en castellà. |
| E.5 | Selector d'idioma | UI per triar `codeLang` i `uiLang`. Ara els valors estan fixats a `state.js`. |
| E.6 | Editor de mapes | Recuperar la funcionalitat d'editor visual de mapes (eliminada a la neteja). |
| E.7 | Carregar CSV des del disc o URL | Recuperar la funcionalitat de carregar mapes externs (`?mapa=CSV` a la URL o input file). |

### Ordre recomanat d'execució

1. **A.3–A.5** (primers capítols pendents) — copiar `capitol.html`, canviar `CURRENT_CAPITOL`, omplir contingut seguint el guió.
2. **D.1–D.4** (verificació visual) — un cop hi ha capítols reals, polir la presentació.
3. **A.6–A.10** (resta de capítols).
4. **E.1–E.7** (expansió futura) — quan el curs estigui complet.

---

## 4. Principis de disseny a respectar

Qualsevol canvi futur ha de respectar aquests principis:

1. **Netedat Stanford**: si dubtes entre afegir un element a la interfície o no, no l'afegis.
2. **Ortogonalitat d'idiomes**: `codeLang` i `uiLang` són independents. Mai barrejar tokens del llenguatge amb textos de la interfície al mateix objecte.
3. **Coherència terminològica**: roques i perles, no parets i aigua. Les paraules `wall` i `water` no han d'aparèixer mai al projecte.
4. **Semàntica canònica**: `grab()` i `drop()` operen sobre la casella actual. `pearl_here()` reflecteix això.
5. **Escalabilitat additiva**: afegir un idioma, un capítol, un repte o un mode hauria de ser **additiu** (afegir codi) i mai **invasiu** (modificar codi existent).
6. **L'alumne és un adolescent català de 16 anys** que mai ha programat, dins d'una classe de 40 minuts amb el professor present.
7. **El codi en anglès, Python-compatible**: l'alumne aprèn `while`, `if`, `def`, `move()` — les paraules que farà servir a la vida professional. Les explicacions li arriben en català.
8. **Python primer**: qualsevol programa Karel vàlid ha de ser Python vàlid. Quan hi hagi dubte sobre una decisió sintàctica, el criteri és la compatibilitat amb Python. Per exemple, `for` accepta qualsevol identificador com a variable de bucle (no sols `_`), tot i que `_` és la convenció recomanada als capítols del curs.

---

## 5. Format CSV dels mapes

```
Caràcters reconeguts per parseCSV():
  K>  K^  K<  Kv  — Karel mirant Est / Nord / Oest / Sud
  A               — Perla (recollible amb grab())
  P               — Roca (obstacle infranquejable)
  .               — Casella buida

Files separades per \n, columnes per comes.
Exemple: "K>,.,A,.\n.,P,.,.\n.,.,.,."
```

Els `data-map` dels simuladors incrustats usen `\n` literals (no salts de línia reals) per compatibilitat amb atributs HTML.
