// Single-row, swipeable carousels (Home: developers, spotlight). Native scroll-snap does the
// movement, so touch, trackpad and keyboard focus all work; the buttons page by whole cards.
(function () {
  'use strict';
  var SWK = window.SWK;

  SWK.reg('row-carousel', function () {
    SWK.$$('[data-row-carousel]').forEach(function (root) {
      var track = SWK.$('[data-row-track]', root);
      var prev = SWK.$('[data-row-prev]', root);
      var next = SWK.$('[data-row-next]', root);
      if (!track || !prev || !next) return;

      function stride() {
        var first = track.firstElementChild;
        if (!first) return track.clientWidth;
        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return first.getBoundingClientRect().width + gap;
      }
      function page(dir) {
        var cards = Math.max(1, Math.floor(track.clientWidth / stride()));
        track.scrollBy({ left: dir * cards * stride(), behavior: SWK.reduced ? 'auto' : 'smooth' });
      }
      var update = SWK.raf(function () {
        var max = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max;
      });

      prev.addEventListener('click', function () { page(-1); });
      next.addEventListener('click', function () { page(1); });
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  });
})();
