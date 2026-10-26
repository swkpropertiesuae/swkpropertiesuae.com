// Oversized outlined words behind section cards: the hero's "words between the towers" idea, reused down the page.
// --gp (-1..1) drifts the word sideways/up as the section scrolls past, --gv fades it in, --gz grows it.
(function () {
  'use strict';
  var SWK = window.SWK;

  SWK.reg('ghost', function () {
    var hosts = SWK.$$('[data-ghost]');
    if (!hosts.length || SWK.reduced) return;
    var vh = window.innerHeight;

    var update = SWK.raf(function () {
      for (var i = 0; i < hosts.length; i++) {
        var r = hosts[i].getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var mid = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 (below) .. 1 (above)
        var enter = SWK.clamp((vh - r.top) / (vh * 0.5), 0, 1);
        hosts[i].style.setProperty('--gp', SWK.clamp(-mid, -1, 1).toFixed(3));
        hosts[i].style.setProperty('--gv', enter.toFixed(3));
        hosts[i].style.setProperty('--gz', enter.toFixed(3));
      }
    });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', function () { vh = window.innerHeight; update(); });
    update();
  });
})();
