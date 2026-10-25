// Testimonials: arrow buttons page the snap-scrolling card track.
(function () {
  'use strict';
  var S = window.SWK;
  S.reg('testimonials', function () {
    var root = S.$('[data-testi]');
    if (!root) return;
    var track = S.$('[data-testi-track]', root);
    function step() { var c = track.firstElementChild; return c ? c.getBoundingClientRect().width + 20 : 320; }
    function go(dir) { track.scrollBy({ left: dir * step(), behavior: S.reduced ? 'auto' : 'smooth' }); }
    S.$('[data-testi-prev]', root).addEventListener('click', function () { go(-1); });
    S.$('[data-testi-next]', root).addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
  });
})();
