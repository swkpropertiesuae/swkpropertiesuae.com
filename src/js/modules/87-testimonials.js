// Testimonials: staggered reveal, gentle auto-advance (pausable), arrow/keyboard paging and progress dots.
(function () {
  'use strict';
  var S = window.SWK;
  S.reg('testimonials', function () {
    var root = S.$('[data-testi]');
    if (!root) return;
    var track = S.$('[data-testi-track]', root), cards = S.$$('.testi-card', root);
    var dotsWrap = S.$('[data-testi-dots]', root), pauseBtn = S.$('[data-testi-pause]', root);
    var timer = null, userPaused = false, hovering = false, inView = false;

    cards.forEach(function () { var d = document.createElement('i'); dotsWrap.appendChild(d); });
    var dots = S.$$('i', dotsWrap);

    function step() { var c = cards[0]; return c ? c.getBoundingClientRect().width + 20 : 320; }
    function index() { return Math.round(track.scrollLeft / step()); }
    function maxLeft() { return track.scrollWidth - track.clientWidth - 4; }
    function go(dir) {
      var behavior = S.reduced ? 'auto' : 'smooth';
      if (dir > 0 && track.scrollLeft >= maxLeft()) track.scrollTo({ left: 0, behavior: behavior });
      else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: behavior });
      else track.scrollBy({ left: dir * step(), behavior: behavior });
    }
    function paint() {
      var i = Math.min(dots.length - 1, index());
      dots.forEach(function (d, n) { d.className = n === i ? 'is-on' : ''; });
    }
    function stop() { clearInterval(timer); timer = null; }
    function sync() {
      stop();
      if (S.reduced || userPaused || hovering || !inView || document.hidden) return;
      timer = setInterval(function () { go(1); }, 4800);
    }

    S.$('[data-testi-prev]', root).addEventListener('click', function () { go(-1); });
    S.$('[data-testi-next]', root).addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    track.addEventListener('scroll', S.raf(paint), { passive: true });
    ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { root.addEventListener(ev, function () { hovering = true; sync(); }, { passive: true }); });
    ['mouseleave', 'focusout'].forEach(function (ev) { root.addEventListener(ev, function () { hovering = false; sync(); }); });
    root.addEventListener('touchend', function () { setTimeout(function () { hovering = false; sync(); }, 6000); }, { passive: true });
    pauseBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      pauseBtn.textContent = userPaused ? 'Play' : 'Pause';
      sync();
    });
    document.addEventListener('visibilitychange', sync);

    root.classList.add('is-ready');
    if ('IntersectionObserver' in window && !S.reduced) {
      new IntersectionObserver(function (en) {
        inView = en[0].isIntersecting;
        if (inView) root.classList.add('is-in');
        sync();
      }, { threshold: 0.35 }).observe(root);
    } else { root.classList.add('is-in'); inView = !S.reduced; sync(); }
    paint();
  });
})();
