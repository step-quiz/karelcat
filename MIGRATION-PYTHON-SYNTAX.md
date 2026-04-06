# ⚠️ DOCUMENT ARXIVAT — No llegir com a guia activa

> Aquest document descriu la migració de la sintaxi `{ }` a la sintaxi Python-compatible.
> La migració va completar-se el 6 d'abril de 2026. **Tots els canvis descrits aquí ja estan aplicats al codi.**
> Es conserva únicament com a registre històric de les decisions preses.
> Per a l'estat actual del projecte, llegir `docs/BRIEFING.md`.

---

# MIGRATION: Karel → Python-compliant syntax
**Document tècnic per a IA. Versió de referència del codi: `karelcat-main` (zip de partida).**

---

## 0. Filosofia del canvi

El projecte Karel cat adoptava un llenguatge propi minimalista (sense parèntesis, sense `def`, blocs amb `{ }`). La nova filosofia és que **el dialecte Karel ha de ser un subconjunt vàlid de Python**: qualsevol programa Karel vàlid ha de poder enganxar-se a un intèrpret Python real (amb un shim previ que defineixi `move`, `turn_left`, etc.) i executar-se sense errors de sintaxi.

Això implica:
- Ordres amb parèntesis obligatoris: `move()` en lloc de `move`
- Definicions de procediment amb `def nom():` en lloc de `proc nom { }`
- Blocs per indentació (2 espais), no per `{ }`
- Bucles `for _ in range(N):` en lloc de `repeat(N) { }`
- Condicionals `if condicio():` / `else:` sense `{ }`
- Bucle `while condicio():` sense `{ }`
- Condicions amb parèntesis: `front_is_clear()` en lloc de `path_clear`
- `not condicio()` → `not condicio()` (igual, però la condició porta `()`)
- `and` / `or` igual que ara (ja eren Python-compatibles)
- Comentaris `#` en lloc de `//`

---

## 1. Inventari complet de fitxers afectats

```
karelcat-main/
├── js/
│   ├── constants.js       ✦ canvia  (DEFAULT_CODE, noms interns CMD_ACTIONS/COND_ACTIONS)
│   ├── i18n.js            ✦ canvia  (tot el vocabulari del CODE_LANGS.en)
│   ├── tokenizer.js       ✦ canvia  (ha de reconèixer ':', '#', indentació)
│   ├── parser.js          ✦ canvia  (gramàtica completa: blocs per indent, `def`, `for`, `:`')
│   ├── interpreter.js     — no canvia (treballa sobre l'AST, agnòstic a la sintaxi)
│   ├── execution.js       — no canvia
│   ├── world.js           — no canvia
│   ├── state.js           — no canvia
│   ├── renderer.js        — no canvia
│   ├── ui.js              — no canvia
│   ├── editor.js          ✦ canvia  (ressaltat sintàctic: noves paraules clau, `#`, `:`')
│   ├── main.js            ✦ canvia  (DEFAULT_CODE inline, missatge log initial)
│   └── reptes.js          ✦ canvia  (tot el data-code dels reptes predefinits)
├── curs/
│   ├── capitols.js        — no canvia
│   ├── capitol-1.html     ✦ canvia  (tots els data-code i tots els <code> inline)
│   ├── capitol-2.html     ✦ canvia  (ídem)
│   └── (capitol-3..10)    ✦ canvien quan es creïn
└── index.html             — no canvia (no conté codi Karel)
```

---

## 2. Especificació completa de la nova sintaxi

### 2.1 Ordres (commands)

| Antic | Nou |
|---|---|
| `move` | `move()` |
| `turn_left` | `turn_left()` |
| `turn_right` | `turn_right()` |
| `turn_around` | `turn_around()` |
| `grab` | `grab()` |
| `drop` | `drop()` |

### 2.2 Condicions (conditions)

| Antic | Nou |
|---|---|
| `path_clear` | `front_is_clear()` |
| `rock_ahead` | `front_is_blocked()` |
| `pearl_here` | `pearl_here()` |
| `bag_empty` | `bag_is_empty()` |
| `bag_full` | `bag_is_full()` |

### 2.3 Estructures de control

**Condicional:**
```python
if front_is_clear():
    move()
else:
    turn_left()
```

**Bucle comptat:**
```python
for _ in range(4):
    move()
```

**Bucle condicional:**
```python
while front_is_clear():
    move()
```

**Definició de procediment:**
```python
def turn_around():
    turn_left()
    turn_left()
```

**Comentaris:**
```python
# Això és un comentari
```
