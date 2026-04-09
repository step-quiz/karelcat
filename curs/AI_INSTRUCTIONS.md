# Instructions for AI Assistants Editing This Folder

## Karel Map Attributes (`data-map`, `data-goal`, `data-maps`, `data-goals`)

Karel world maps are stored in HTML attributes as a single string.
Rows are separated by `|` — a **literal pipe character** (one character).
Columns within a row are separated by `,` (comma).

### ✅ Correct

```html
data-map=".,.,.,.,.,.|K>,.,.,.,.,.|.,.,.,.,.,."
```

### ❌ Wrong — do not use `\n`

```html
data-map=".,.,.,.,.,.\\nK>,.,.,.,.,.\\n.,.,.,.,.,."
```

### Why?

`js/world.js` splits the map string with `.split('|')`. The pipe character
is the row separator used throughout the entire codebase. Using `\n` (or `\\n`)
as a separator will cause the world to fail silently — the map will not parse
correctly and the simulator will render nothing or render incorrectly.

**The rule:** always use `|` between rows. Never use `\n`, `\\n`, or real newlines.

---

## Multi-world simulators (`data-maps` / `data-goals`)

Many reptes use a single editor with multiple test worlds. In this case, use
`data-maps` (plural, JSON array) and `data-goals` (plural, JSON array) instead
of the singular versions. The same `|` row separator applies inside each map string.

```html
<div class="simulador"
     data-maps='["K>,.,A,.|.,P,.,.", "K>,.,.,A|.,P,.,P"]'
     data-goals='[".,.,.,K>|.,P,.,.", ".,.,.,K>|.,P,.,P"]'
     data-code="while front_is_clear():
    move()
"
     data-label="Repte exemple"
     data-height="300">
</div>
```

---

## Quick Reference — Map Format

```
K>,.,A,P|.,.,.,.|.,.,.,P
```

| Character | Meaning              |
|-----------|----------------------|
| `.`       | Empty cell           |
| `,`       | Column separator     |
| `|`       | **Row separator**    |
| `K>`      | Karel facing East    |
| `K^`      | Karel facing North   |
| `Kv`      | Karel facing South   |
| `K<`      | Karel facing West    |
| `A`       | Pearl (gemma)        |
| `P`       | Rock (roca)          |

The **first row** in the string is the **top row** of the world.
The **last row** is the bottom row (where Karel usually starts).

---

## `data-bag` — initial inventory

Set `data-bag="N"` to give Karel N pearls at the start. Omit or set to `"0"` for an empty bag.

```html
data-bag="2"
```

## `CURRENT_CAPITOL`

Every repte and chapter HTML file must declare `const CURRENT_CAPITOL = N;` (where N is the
chapter number) so `capitols.js` can highlight the correct entry in the sidebar.

All repte files use `const CURRENT_CAPITOL = 10;` (they belong to chapter 10).
