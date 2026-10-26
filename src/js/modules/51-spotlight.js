// Pointer spotlight on cards: a soft brass glow follows the cursor (fine pointers only).
(function () {
  'use strict';
  var SWK = window.SWK;
  SWK.reg('spotlight', function () {
    if (!SWK.fine || SWK.reduced) return;
    var sel = '.dev-card, .project-card, .service-card, .value-item, .blog-card, .team-card, .quick-tile, .calc-card, .stat, .contact-tile, .cta-band';
    document.addEventListener('pointermove', function (ev) {
      var el = ev.target.closest && ev.target.closest(sel);
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      el.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    }, { passive: true });
  });
})();
