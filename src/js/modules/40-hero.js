// Hero: one muted, looping background video.
// It holds on the poster frame for reduced-motion and data-saver visitors, and pauses while the hero is off screen.
(function () {
  'use strict';
  var SWK = window.SWK;

  SWK.reg('hero', function () {
    var hero = SWK.$('.hero');
    var video = hero && SWK.$('.hero__video', hero);
    if (!video) return;
    video.muted = true;

    var conn = navigator.connection;
    if (SWK.reduced || (conn && conn.saveData)) { video.removeAttribute('autoplay'); video.pause(); return; }

    var visible = true;
    function sync() {
      if (visible && !document.hidden) {
        var p = video.play();
        if (p && p.catch) p.catch(function () { /* autoplay blocked: the poster stays */ });
      } else video.pause();
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }, { threshold: 0 }).observe(hero);
    }
    document.addEventListener('visibilitychange', sync);
    sync();

    // Tilt the glass search panel toward the pointer.
    var bar = SWK.$('.search-bar', hero);
    if (bar && SWK.fine) {
      bar.addEventListener('pointermove', function (ev) {
        var r = bar.getBoundingClientRect();
        var nx = ((ev.clientX - r.left) / r.width - 0.5) * 2;
        var ny = ((ev.clientY - r.top) / r.height - 0.5) * 2;
        bar.classList.add('is-tilting');
        bar.style.setProperty('--ry', (nx * 2.2).toFixed(2) + 'deg');
        bar.style.setProperty('--rx', (-ny * 3.2).toFixed(2) + 'deg');
      });
      bar.addEventListener('pointerleave', function () {
        bar.classList.remove('is-tilting');
        bar.style.setProperty('--ry', '0deg');
        bar.style.setProperty('--rx', '0deg');
      });
    }
  });
})();
