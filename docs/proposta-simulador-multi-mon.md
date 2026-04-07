# Proposta: Simulador multi-món amb codi compartit

## El problema actual (WET)

El `repte-2.html` defineix **tres blocs `.simulador` independents**, cadascun amb el seu propi `data-code`. L'alumne ha d'escriure (o copiar-enganxar) el mateix codi tres vegades per provar els tres mons de test.

Això viola el principi DRY i, pedagògicament, envia el missatge equivocat: sembla que cada món és un problema diferent, quan en realitat el repte consisteix a trobar **un sol algorisme que funcioni per a qualsevol longitud**.

---

## La bona notícia: la infraestructura ja existeix

`capitols.js` ja té implementada la funció `_renderMultiMon()`, que s'activa automàticament quan el div `.simulador` usa `data-maps` (array JSON) en lloc de `data-map` (string). Aquesta funció ja fa:

- Un **sol editor de codi** compartit per a tots els mons.
- Botons de toggle (`Món 1`, `Món 2`, `Món 3`) per canviar de món sense perdre el codi.
- **Preservació del codi** en canviar de món (llegeix el codi de l'iframe actiu i el reutilitza).
- Tracking d'estat per món: `○ pendent`, `✓ correcte`, `✗ error`.
- **Feedback global**: "X / N mons superats" i missatge de victòria quan arriba a N/N.

El canvi necessari és **únicament a `repte-2.html`**: substituir tres divs per un de sol.

---

## El canvi concret al HTML

### Abans (3 blocs WET)

```html
<div class="simulador"
     data-map="K>,A,.,A,A,.,A,."
     data-code="# En Karel ha de recollir totes les perles del passadís
# i arribar a l'extrem dret.

while front_is_clear():
    # El teu codi aquí
    move()
"
     data-goal=".,.,.,.,.,.,.,K>"
     data-label="Repte 2 — Test A (8 caselles)"
     data-title="..."
     data-height="260">
</div>

<div class="simulador"
     data-map="K>,.,A,.,A,.,.,A,."
     data-code="# Mateix codi — prova amb 9 caselles.

while front_is_clear():
    # El teu codi aquí
    move()
"
     data-goal=".,.,.,.,.,.,.,.,K>"
     data-label="Repte 2 — Test B (9 caselles)"
     data-title="..."
     data-height="260">
</div>

<div class="simulador"
     data-map="K>,A,A,.,.,A,.,A,.,.,A,."
     data-code="# Mateix codi — prova amb 12 caselles.

while front_is_clear():
    # El teu codi aquí
    move()
"
     data-goal=".,.,.,.,.,.,.,.,.,.,.,K>"
     data-label="Repte 2 — Test C (12 caselles)"
     data-title="..."
     data-height="260">
</div>
```

### Després (1 bloc DRY)

```html
<div class="simulador"
     data-maps='["K>,A,.,A,A,.,A,.", "K>,.,A,.,A,.,.,A,.", "K>,A,A,.,.,A,.,A,.,.,A,."]'
     data-goals='[".,.,.,.,.,.,.,K>", ".,.,.,.,.,.,.,.,K>", ".,.,.,.,.,.,.,.,.,.,.,K>"]'
     data-code="# En Karel ha de recollir totes les perles del passadís
# i arribar a l'extrem dret.

while front_is_clear():
    # El teu codi aquí
    move()

# Recorda: pot quedar alguna casella sense comprovar!
"
     data-label="Repte 2 — El passadís"
     data-title="Prova el teu codi als tres mons. El mateix algorisme ha de funcionar per a qualsevol longitud."
     data-height="320">
</div>
```

**Diferències clau:**
- `data-map` (singular) → `data-maps` (plural, JSON array).
- `data-goal` (singular) → `data-goals` (plural, JSON array paral·lel).
- `data-code` és únic, igual per als tres mons.
- Tres divs → un sol div.

---

## UX resultant (sense cap canvi a capitols.js)

```
┌─────────────────────────────────────────────────────────┐
│  Repte 2 — El passadís                                  │
├─────────────────────────────────────────────────────────┤
│  [ Món 1 ○ ]  [ Món 2 ○ ]  [ Món 3 ○ ]                 │  ← toggle
├──────────────────────────┬──────────────────────────────┤
│  1  while front_is_clear │                              │
│  2      # El teu codi   │   [visualització del món     │
│  3      move()           │    actiu en temps real]      │
│  4                       │                              │
│  5  if pearl_here():     │                              │
│  6      grab()           │                              │
├──────────────────────────┴──────────────────────────────┤
│  ▶ Executa   ↺ Reinicia   Velocitat: ────●──────        │
├─────────────────────────────────────────────────────────┤
│  2 / 3 mons superats. Comprova els mons marcats amb ✗.  │
└─────────────────────────────────────────────────────────┘
```

**Flux de l'alumne:**
1. Escriu el codi una sola vegada.
2. Prem **Executa** → veu el resultat al Món 1, apareix `✓` o `✗` al botó.
3. Prem **Món 2** → el codi es preserva, el món canvia. Prem **Executa** de nou.
4. Repeteix per al Món 3.
5. Quan els tres botons mostren `✓`, el feedback global es posa verd: **"✓ Tots els mons superats (3/3). Ben fet!"**

L'alumne mai no ha de copiar-enganxar res.

---

## Canvis a capitols.js (zero o mínim)

`_renderMultiMon` ja funciona. Opcionalment, es podrien millorar els **labels dels botons** per mostrar el nom del món en lloc de "Món 1", "Món 2", etc., afegint un atribut `data-labels`:

```html
data-labels='["8 caselles", "9 caselles", "12 caselles"]'
```

I a `_renderMultiMon`, llegir aquest atribut per personalitzar el text dels botons. Però és opcional: amb el codi actual ja funciona correctament.

---

## Resum

| | Ara | Proposta |
|---|---|---|
| Blocs HTML per repte | 3 | 1 |
| Editors de codi | 3 | 1 |
| Codi que l'alumne escriu | 3× | 1× |
| Canvis a `capitols.js` | — | 0 (o mínim) |
| Tracking per món | No | Sí (ja implementat) |
| Feedback de victòria | No | Sí (ja implementat) |

La infraestructura ja és aquí. El canvi és quirúrgic i afecta únicament els fitxers HTML dels reptes.
