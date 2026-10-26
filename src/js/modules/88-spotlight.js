// Spotlight hover: tracks the pointer over [data-spotlight] cards and exposes it as --mx / --my for a CSS radial glow.
(function () {
  'use strict';
  var S = window.SWK;
  S.reg('spotlight', function () {
    if (!S.fine) return;
    S.$$('[data-spotlight]').forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (ev.clientX - r.left).toFixed(0) + 'px');
        el.style.setProperty('--my', (ev.clientY - r.top).toFixed(0) + 'px');
      });
    });
  });
})();
