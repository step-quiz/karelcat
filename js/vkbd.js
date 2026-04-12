/* ──────────────────────────────────────────────────────────────
   Teclat virtual per a mòbil (simple-keyboard).
   Estratègia: simple-keyboard només dispara events; el textarea
   continua sent la font de veritat. Inserim al cursor i disparem
   un event 'input' perquè el ressaltador i l'autocompletat es
   mantinguin sincronitzats com si fos una pulsació real.
   ─────────────────────────────────────────────────────────────── */
(function () {
  // Activa només en dispositius amb punter groller (mòbil/tablet).
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch) return;

  const ta = document.getElementById('code-editor');
  if (!ta) return;

  // Suprimeix el teclat natiu del sistema
  ta.setAttribute('inputmode', 'none');
  ta.setAttribute('autocomplete', 'off');
  ta.setAttribute('autocapitalize', 'off');

  // Container per al teclat
  const host = document.createElement('div');
  host.id = 'vkbd-host';
  host.className = 'vkbd-host vkbd-hidden';
  host.innerHTML = '<div class="simple-keyboard"></div>';
  document.body.appendChild(host);

  // Layout pensat per a Karel/Python: parèntesis, guió baix i # accessibles.
  const layout = {
    default: [
      '1 2 3 4 5 6 7 8 9 0',
      'q w e r t y u i o p',
      'a s d f g h j k l _',
      '{shift} z x c v b n m {bksp}',
      '# ( ) {space} {enter}'
    ],
    shift: [
      '! @ # $ % & * + - =',
      'Q W E R T Y U I O P',
      'A S D F G H J K L _',
      '{shift} Z X C V B N M {bksp}',
      '" ( ) {space} {enter}'
    ]
  };

  const display = {
    '{bksp}':  '⌫',
    '{enter}': '⏎',
    '{shift}': '⇧',
    '{space}': ' '
  };

  // Espera que simple-keyboard estigui carregat (script al final del body)
  function init() {
    if (!window.SimpleKeyboard) { setTimeout(init, 50); return; }

    const Keyboard = window.SimpleKeyboard.default;
    let shifted = false;

    const kb = new Keyboard('.simple-keyboard', {
      layout,
      display,
      layoutName: 'default',
      mergeDisplay: true,
      useMouseEvents: false,
      preventMouseDownDefault: true,     // evita perdre el focus del textarea
      physicalKeyboardHighlight: false,
      onKeyPress: handleKey,
    });

    function handleKey(btn) {
      // Insereix tokens al cursor i dispara 'input' perquè la resta
      // de l'editor (highlight, line numbers, autocomplete) reaccioni.
      ta.focus({ preventScroll: true });
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const val   = ta.value;

      if (btn === '{shift}') {
        shifted = !shifted;
        kb.setOptions({ layoutName: shifted ? 'shift' : 'default' });
        return;
      }

      let insert = '';
      let caret  = start;

      if (btn === '{bksp}') {
        if (start !== end) {
          ta.value = val.slice(0, start) + val.slice(end);
          caret = start;
        } else if (start > 0) {
          ta.value = val.slice(0, start - 1) + val.slice(end);
          caret = start - 1;
        }
      } else if (btn === '{enter}') {
        insert = '\n';
      } else if (btn === '{space}') {
        insert = ' ';
      } else {
        insert = btn;
      }

      if (insert) {
        ta.value = val.slice(0, start) + insert + val.slice(end);
        caret = start + insert.length;
      }

      ta.selectionStart = ta.selectionEnd = caret;
      ta.dispatchEvent(new Event('input', { bubbles: true }));

      // Auto-unshift després d'una lletra (com els mòbils)
      if (shifted && btn !== '{shift}' && btn !== '{bksp}') {
        shifted = false;
        kb.setOptions({ layoutName: 'default' });
      }
    }

    // Mostrar/amagar segons focus
    ta.addEventListener('focus', () => host.classList.remove('vkbd-hidden'));
    // No amaguem en blur: els taps als botons trauen momentàniament el focus.
    // En comptes d'això, amaguem si l'usuari toca fora de l'editor i del teclat.
    document.addEventListener('pointerdown', (e) => {
      if (host.contains(e.target)) return;
      if (e.target === ta || ta.contains(e.target)) return;
      host.classList.add('vkbd-hidden');
    });
  }

  init();
})();
