# Instructions for AI Assistants Editing This Folder

## Karel Map Attributes (`data-map`, `data-goal`)

Karel world maps are stored in HTML attributes (`data-map`, `data-goal`) as a single string.
Rows are separated by `\n` — that is, a **literal backslash followed by the letter n** (two characters).

### ✅ Correct

```html
data-map=".,.,.,.,.,.\nK>,.,.,.,.,.\n.,.,.,.,.,."
```

### ❌ Wrong — double-escaped

```html
data-map=".,.,.,.,.,.\\\nK>,.,.,.,.,.\\\n.,.,.,.,.,."
```

### Why?

HTML attribute values are **plain text**, not JavaScript string literals.
The JavaScript that reads the attribute via `element.dataset.map` receives
the characters exactly as written. It then splits on `\n` to build the grid rows.

If you write `\\n`, JavaScript receives `\\n` and the map fails silently —
the world either renders incorrectly or not at all.

**The rule:** write `\n` in HTML attributes. Never double it to `\\n`.

---

## Quick Reference — Map Format

```
.,.,.,.,.,.\nK>,.,.,.,.,.\n.,.,.,.,.,.\n.,.,.,.,.,.
```

| Character | Meaning              |
|-----------|----------------------|
| `.`       | Empty cell           |
| `,`       | Cell separator       |
| `\n`      | Row separator        |
| `K>`      | Karel facing East    |
| `K^`      | Karel facing North   |
| `Kv`      | Karel facing South   |
| `K<`      | Karel facing West    |
| `A`       | Pearl (gemma)        |
| `P`       | Rock (roca)          |

The **first row** in the string is the **top row** of the world.
