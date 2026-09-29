# karelcat

Entorn interactiu per aprendre a programar en Python, adreçat a alumnes de secundària (16 anys, sense experiència prèvia). L'alumne controla **en Karel**, una medusa programable que viu en una graella submarina.

## Què és

Un curs de 10 capítols i 13 reptes, accessible des del navegador sense instal·lació, inspirat en el [Stanford Karel Reader](https://compedu.stanford.edu/karel-reader/docs/python/en/intro.html). Cada capítol combina explicació breu, exemples executables incrustats i navegació cap als reptes finals. La interfície és intencionadament minimalista: editor de codi a l'esquerra, món de Karel a la dreta, dos botons.

## Estat actual

| Element | Estat |
|---------|-------|
| Motor (tokenizer + parser + intèrpret) | ✅ Complet |
| Sintaxi Python-compatible | ✅ Implementada |
| Infraestructura del curs (sidebar, iframes, deep links) | ✅ Completa |
| Capítol 1 — Coneix en Karel | ✅ Escrit |
| Capítol 2 — Agafa i deixa | ✅ Escrit |
| Capítol 3 — Repeteix | ✅ Escrit |
| Capítol 4 — Procediments | ✅ Escrit |
| Capítol 5 — Descomposició | ✅ Escrit |
| Capítol 6 — Condicionals | ✅ Escrit |
| Capítol 7 — Mentre | ✅ Escrit |
| Capítol 8 — Combinant condicions | ✅ Escrit |
| Capítol 9 — Resum | ✅ Escrit |
| Capítol 10 — Del Karel al Python | ✅ Escrit |
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
simulador.html      — Simulador lliure (i simulador incrustat als capítols)
style.css           — Estils del simulador
edit-mapa.html      — Editor visual de mapes (eina auxiliar)
js/                 — Motor: constants, i18n, state, tokenizer, parser,
                      interpreter, execution, world, renderer, editor, ui, main, reptes
curs/
  index.html        — Índex del curs (10 capítols)
  capitol.html      — Plantilla reutilitzable per a capítols
  capitol-1..10     — Els 10 capítols del curs
  repte-1..13       — Els 13 reptes del capítol 10
  capitols.js       — Dades + renderSidebar() + renderSimuladors()
  progress.js       — Progrés de l'alumne (localStorage)
  curs.css          — Estils del curs
  BRIEFING-REPTES.md — Detall de cada repte (mapes, notes)
tests/
  comprova-curs.js  — Test automàtic: motor, mapes i solucions de tots els exercicis
docs/
  CURRENT-STATE.md  — Estat actual complet del projecte (llegir aquí primer)
  i18n-spanish-guide.md — Guia per afegir castellà com a idioma d'interfície
```

## Com continuar el desenvolupament

Llegeix `docs/CURRENT-STATE.md` abans de fer cap canvi. Conté l'estat complet
del projecte, els contractes entre mòduls, els principis de disseny i les tasques pendents.

Després de qualsevol canvi, executa el test automàtic (només cal Node.js):

```
node tests/comprova-curs.js
```

Comprova el motor i executa la solució de referència de cada exercici (el bloc
`<solucio>` que hi ha en un comentari de cada pàgina) contra tots els seus mons.
A GitHub s'executa sol a cada push (pestanya «Actions»).

Les tasques pendents actuals són millores visuals (D.1–D.4) i funcionalitat futura
opcional (E.1–E.8): idiomes addicionals, selector d'idioma, editor de mapes integrat.
El contingut pedagògic del curs és complet.

<!-- atribucio-centre:inici -->

---

Material desenvolupat per **David Arso Civil** per al Departament de Matemàtiques de l'INS Miquel Tarradell.
Contingut sota CC BY-NC-SA 4.0, codi sota llicència MIT. Vegeu [`LLICENCIA.md`](LLICENCIA.md).

<!-- atribucio-centre:final -->
