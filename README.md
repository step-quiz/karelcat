# karelcat

Entorn interactiu per aprendre a programar en Python, adreçat a alumnes de secundària (16 anys, sense experiència prèvia). L'alumne controla **en Karel**, una medusa programable que viu en una graella submarina.

## Què és

Un curs de 10 capítols, un epíleg i 13 reptes, accessible des del navegador sense instal·lació, inspirat en el [Stanford Karel Reader](https://compedu.stanford.edu/karel-reader/docs/python/en/intro.html). Cada capítol combina explicació breu, exemples executables incrustats i navegació cap als reptes finals. La interfície és intencionadament minimalista: editor de codi a l'esquerra, món de Karel a la dreta, dos botons.

## Estat actual

| Element | Estat |
|---------|-------|
| Motor (tokenizer + parser + intèrpret) | ✅ Complet |
| Sintaxi Python-compatible | ✅ Implementada |
| Infraestructura del curs (sidebar, iframes, deep links) | ✅ Completa |
| Capítol 1 — Coneix en Karel | ✅ Escrit |
| Capítol 2 — Recollir i deixar | ✅ Escrit |
| Capítol 3 — Gestió d'errors en un codi | ✅ Escrit |
| Capítol 4 — Repeteix | ✅ Escrit |
| Capítol 5 — Funcions | ✅ Escrit |
| Capítol 6 — Descomposició | ✅ Escrit |
| Capítol 7 — Condicionals | ✅ Escrit |
| Capítol 8 — Mentre | ✅ Escrit |
| Capítol 9 — Combinant condicions | ✅ Escrit |
| Capítol 10 — Codi net | ✅ Escrit |
| Epíleg — D'en Karel al Python | ✅ Escrit |
| Reptes 1–13 (capítol 10) | ✅ Tots implementats |

## Sintaxi del llenguatge

```python
# Ordres
move()  turn_left()  turn_right()  turn_around()  grab()  drop()

# Condicions
front_is_clear()  front_is_blocked()
left_is_clear()   left_is_blocked()
right_is_clear()  right_is_blocked()
pearl_here()      bag_is_empty()      bag_has_pearls()

# Estructures de control
for _ in range(N):
    move()

while front_is_clear():
    move()

if pearl_here():
    grab()
elif front_is_blocked():
    turn_left()
else:
    drop()

def nom():
    move()
    turn_left()
```

Qualsevol programa Karel vàlid és Python vàlid (amb un shim que defineixi les funcions).

## Estructura de fitxers

```
index.html          — Pàgina d'inici
presentacio-karel.html — Presentació inicial («Primer cop aquí?»)
simulador.html      — Simulador lliure (i simulador incrustat als capítols)
style.css, nav.css  — Estils del simulador i de la navegació del curs
family.js           — Selector «EXPLORA» dels projectes germans (només a la portada)
footer.js           — Peu de pàgina comú del curs
edit-mapa.html      — Editor visual de mapes (eina auxiliar)
editor-reptes.jsx   — Component React per editar els textos dels reptes (eina auxiliar;
                      no el carrega cap pàgina)
favicon.*, apple-touch-icon.png, img/ — Icones
js/                 — Motor: constants, i18n, state, tokenizer, parser,
                      interpreter, execution, world, renderer, editor, ui, main, reptes,
                      kbd-accessory (barra de tecles tàctil).
curs/
  index.html        — Índex del curs (10 capítols)
  capitol.html      — Plantilla reutilitzable per a capítols
  capitol-1..10     — Els 10 capítols del curs
  capitol-futur     — Epíleg: «D'en Karel al Python»
  repte-1..13       — Els 13 reptes del capítol 10
  capitols.js       — Dades + renderSidebar() + renderSimuladors()
  progress.js       — Progrés de l'alumne (localStorage)
  curs.css          — Estils del curs
  BRIEFING-REPTES.md — Detall de cada repte (mapes, notes)
tests/
  comprova-curs.js  — Test automàtic: motor, mapes i solucions de tots els exercicis
  docs_vs_codi.py   — La documentació quadra amb el codi (rutes citades, capítols i reptes)
docs/
  CURRENT-STATE.md  — Estat actual complet del projecte (llegir aquí primer)
  i18n-spanish-guide.md — Guia per afegir castellà com a idioma d'interfície
```

## Fitxers comuns

`LICENSE`, `LLICENCIA.md`, `family.js`, `footer.js`, `js/kbd-accessory.js` i les icones de la família (`img/htmlcat.svg`, `img/pycat.svg`, `img/karelcat.svg`, `img/jscat.svg`) són **fitxers comuns** dels cursos de la família: l'original és al repositori
[step-quiz-commons](https://github.com/step-quiz/step-quiz-commons), on també hi ha què té de
diferent aquest web (`comuns.json`). El workflow `.github/workflows/comuns.yml` els posa al dia
cada dia (o a mà: Actions → «Fitxers comuns» → Run workflow). **No els editis aquí**: el canvi es
perdria l'endemà. Canvia'ls a step-quiz-commons.

## Com continuar el desenvolupament

Llegeix `docs/CURRENT-STATE.md` abans de fer cap canvi. Conté l'estat complet
del projecte, els contractes entre mòduls, els principis de disseny i les tasques pendents.

Després de qualsevol canvi, executa el test automàtic (només cal Node.js):

```
node tests/comprova-curs.js
```

Comprova el motor i executa la solució de referència de cada exercici (el bloc
`<solucio>` que hi ha en un comentari de cada pàgina) contra tots els seus mons.
A GitHub s'executa sol a cada canvi a `main` i a cada pull request (`.github/workflows/tests.yml`, pestanya «Actions»), i també després de cada ZIP pujat a `_uploads/`.

A més, `.github/comprova-enllacos.py` comprova que els enllaços cap als altres webs de Step Quiz (`*.step-quiz.net`) funcionen. GitHub l'executa a cada canvi a `main`, cada dilluns al matí i a mà (`.github/workflows/enllacos.yml`, «Enllaços» a la pestanya Actions).

El mateix workflow de tests passa `python3 tests/docs_vs_codi.py`, que comprova que la documentació diu el mateix que el codi: les rutes que citen els documents principals existeixen i la taula d'estat d'aquest README té els capítols i els reptes de `curs/capitols.js`. Si falla perquè has canviat el curs, posa al dia el document que diu el missatge.

Les tasques pendents actuals són funcionalitat futura
opcional (E.1–E.8): idiomes addicionals, selector d'idioma, editor de mapes integrat.
El contingut pedagògic del curs és complet.

<!-- atribucio-centre:inici -->

---

Material desenvolupat per **David Arso Civil** per al Departament de Matemàtiques de l'INS Miquel Tarradell.
Contingut sota CC BY-NC-SA 4.0, codi sota llicència MIT. Vegeu [`LLICENCIA.md`](LLICENCIA.md).

<!-- atribucio-centre:final -->
