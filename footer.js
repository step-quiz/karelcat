(function () {
  // Detecta si estem dins de la carpeta curs/ o a l'arrel
  var isCurs = window.location.pathname.includes('/curs/');
  var imgPath = isCurs ? '../img/cc-by-nc-nd.png' : 'img/cc-by-nc-nd.png';

  // Estils del footer
  var style = document.createElement('style');
  style.textContent = [
    '.karel-footer {',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 12px;',
    '  padding: 24px 16px;',
    '  margin-top: 40px;',
    '  border-top: 1px solid #ddd;',
    '  font-size: 0.875rem;',
    '  color: #444;',
    '  text-align: center;',
    '  flex-wrap: wrap;',
    '}',
    '.karel-footer img {',
    '  height: 31px;',
    '  width: auto;',
    '  flex-shrink: 0;',
    '}',
    '.karel-footer a {',
    '  color: inherit;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // HTML del footer — modifica aquí per canviar el text
  var footer = document.createElement('footer');
  footer.className = 'karel-footer';
  footer.innerHTML =
    '<img src="' + imgPath + '" alt="CC BY-NC-ND 4.0">' +
    '<span>' +
    '© 2026 <strong>[DAVID ARSO CIVIL]</strong>. ' +
    'Ús educatiu lliure. Prohibida la comercialització i la modificació ' +
    '(<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank">CC BY-NC-ND 4.0</a>).' +
    '</span>';

  document.body.appendChild(footer);
})();
