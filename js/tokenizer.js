// ════════════════════════════════════════════════════════
// tokenizer.js — Funció pura: codi → tokens
//
// Sintaxi Python-compatible:
//   - Blocs per indentació (no per { })
//   - Comentaris amb # (no amb //)
//   - ':' marca final de capçalera d'estructura
//   - Emet INDENT, NL per al parser
// ════════════════════════════════════════════════════════

function tokenize(code) {
  const toks = [];
  const lines = code.split('\n');

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineNum = lineIdx + 1;
    const raw     = lines[lineIdx];

    // Eliminar comentari de final de línia (#)
    const commentIdx = raw.indexOf('#');
    const line = commentIdx === -1 ? raw : raw.slice(0, commentIdx);

    // Ignorar línies buides (o que eren només comentari)
    if (line.trim() === '') continue;

    // Calcular nivell d'indentació
    let spaces = 0;
    while (spaces < line.length && line[spaces] === ' ') spaces++;
    // Accepta 2 o 4 espais per nivell; normalitzem a unitats de 2
    const indentLevel = Math.round(spaces / 2);
    toks.push({ t: 'INDENT', v: indentLevel, line: lineNum });

    // Tokenitzar la part no-indentada de la línia
    let i = spaces;
    while (i < line.length) {
      const c = line[i];

      // Espai (dins de la línia, fora de la indentació inicial)
      if (c === ' ' || c === '\t') { i++; continue; }

      // Parèntesis i dos-punts
      if (c === '(' || c === ')' || c === ':') {
        toks.push({ t: c, line: lineNum });
        i++;
        continue;
      }

      // Número
      if (/[0-9]/.test(c)) {
        let n = '';
        while (i < line.length && /[0-9]/.test(line[i])) n += line[i++];
        toks.push({ t: 'N', v: parseInt(n, 10), line: lineNum });
        continue;
      }

      // Paraula (keyword, comanda, condició, nom de procediment, o '_')
      // Regex Unicode per suportar lletres accentuades en noms de procediment
      if (/[a-zA-Z_\u00C0-\u024F]/.test(c)) {
        let w = '';
        while (i < line.length && /[a-zA-Z0-9_\u00C0-\u024F]/.test(line[i])) w += line[i++];
        toks.push({ t: 'W', v: w, line: lineNum });
        continue;
      }

      // Caràcter desconegut: saltar
      i++;
    }

    // Fi de línia significatiu
    toks.push({ t: 'NL', line: lineNum });
  }

  toks.push({ t: 'EOF', line: lines.length });
  return toks;
}

K.tokenize = tokenize;
