# karelcat

Entorn interactiu per aprendre a programar en Python, adreçat a alumnes de secundària (16 anys, sense experiència prèvia). L'alumne controla **en Karel**, una medusa programable que viu en una graella submarina.

## Què és

Un curs de 10 capítols, accessible des del navegador sense instal·lació, inspirat en el [Stanford Karel Reader](https://compedu.stanford.edu/karel-reader/docs/python/en/intro.html). Cada capítol combina explicació breu, exemples executables incrustats i un exercici final. La interfície és intencionadament minimalista: editor de codi a l'esquerra, món de Karel a la dreta, dos botons.

## Estat actual

| Element | Estat |
|---------|-------|
| Motor (tokenizer + parser + intèrpret) | ✅ Complet |
| Sintaxi Python-compatible | ✅ Implementada |
| Infraestructura del curs (sidebar, iframes, deep links) | ✅ Completa |
| Capítol 1 — Coneix en Karel | ✅ Escrit |
| Capítol 2 — Agafa i deixa | ✅ Escrit |
| Capítols 3–10 | ⬜ Pendents |

## Sintaxi del llenguatge

```python
# Ordres
move()  turn_left()  turn_right()  turn_around()  grab()  drop()

# Condicions
front_is_clear()  front_is_blocked()  pearl_here()  bag_is_empty()  bag_is_full()

# Estructures de control
for _ in range(N):
    move()

while front_is_clear():
    move()

if pearl_here():
    grab()
else:
    drop()

def nom():
    move()
    turn_left()
```

Qualsevol programa Karel vàlid és Python vàlid (amb un shim que defineixi les funcions).

## Estructura de fitxers

```
index.html          — Simulador lliure
style.css           — Estils del simulador
js/                 — Motor: constants, i18n, state, tokenizer, parser,
                      interpreter, execution, world, renderer, editor, ui, main, reptes
curs/
  index.html        — Índex del curs (10 capítols)
  capitol.html      — Plantilla reutilitzable per a capítols
  capitol-1.html    — Capítol 1
  capitol-2.html    — Capítol 2
  capitols.js       — Dades + renderSidebar() + renderSimuladors()
  curs.css          — Estils del curs
docs/
  BRIEFING.md       — Briefing tècnic complet per a IA (llegir abans de tocar res)
  guio-capitols-3-10.md — Guió detallat per escriure els capítols pendents
```

## Com continuar el desenvolupament

Llegeix `docs/BRIEFING.md` abans de fer cap canvi. Conté l'estat complet del projecte, els contractes entre mòduls, els principis de disseny i les tasques pendents.

Per escriure un capítol nou: copia `curs/capitol.html`, canvia `CURRENT_CAPITOL`, omple el contingut seguint el guió a `docs/guio-capitols-3-10.md`, i afegeix el nom de l'arxiu al conjunt `DISPONIBLES` a `curs/index.html`.
