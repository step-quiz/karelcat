# ⚠️ DOCUMENT ARXIVAT — No llegir com a guia activa

> Aquest document registra el progrés de la migració a sintaxi Python-compatible.
> **La migració va completar-se el 6 d'abril de 2026. Totes les fases estan fetes.**
> Es conserva com a registre històric. Per a l'estat actual, llegir `docs/BRIEFING.md`.

---

# ESTAT DE LA MIGRACIÓ — Karel → Python syntax (COMPLETADA)

## Resum visual de fases

| # | Fitxer | Estat | Complexitat |
|---|---|---|---|
| 1 | `js/i18n.js` | ✅ **FET** | Baixa |
| 2 | `js/constants.js` | ✅ **FET** | Baixa |
| 3 | `js/tokenizer.js` | ✅ **FET** | Alta |
| 4 | `js/parser.js` | ✅ **FET** | Alta |
| 4b | `js/state.js` | ✅ **FET** (canvi mínim no previst) | Baixa |
| 5 | `js/editor.js` | ✅ **FET** | Mitjana |
| 6 | `js/reptes.js` | ✅ **FET** | Baixa |
| 7 | `curs/capitol-1.html` | ✅ **FET** | Baixa |
| 8 | `curs/capitol-2.html` | ✅ **FET** | Baixa |

## Decisions importants preses durant la migració

1. **Ordre de `CMD_ACTIONS` i `COND_ACTIONS`:** han de coincidir posicionalment amb `commands[]` i `conditions[]` de `i18n.js`.
2. **Noms interns no canvien:** `path-clear`, `rock-ahead`, etc. són noms interns de l'intèrpret. Canviar-los requeriria tocar `interpreter.js` i `world.js`.
3. **`state.js` va requerir un canvi mínim no previst:** `applyCodeLang` llegia `tk.repeat_kw` i `tk.proc_kw` que ja no existien. Canvi mínim: substituïts per `KW_FOR`, `KW_IN`, `KW_RANGE`, `KW_DEF`.
4. **`_` (variable throw-away del `for`)** es tokenitza com a `W` amb valor `'_'` i es ressalta com `hl-kw` a l'editor.
5. **Suport Unicode al tokenizer:** noms de procediment amb caràcters accentuats (`avança_tres`, etc.) funcionen correctament.
