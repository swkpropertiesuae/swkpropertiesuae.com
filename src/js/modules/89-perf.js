// Pauses endless CSS animations (marquees, voices, page-header drift) while they are off screen,
// so scrolling never pays for motion nobody can see.
(function () {
  'use strict';
  var SWK = window.SWK;

  SWK.reg('offscreen-pause', function () {
    if (!('IntersectionObserver' in window)) return;
    var targets = SWK.$$('.marquee__track, .voices__track, .page-hero__bg img, .btn-calc, .hero__scroll-cue .line');
    if (!targets.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.removeAttribute('data-offscreen');
        else en.target.setAttribute('data-offscreen', '');
      });
    }, { rootMargin: '120px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  });
})();
