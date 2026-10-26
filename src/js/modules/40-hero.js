// Hero: one muted, looping background video with a timed hook sequence and a closing logo reveal.
// The overlay follows video.currentTime (seconds), so the copy stays in step with the footage on every loop.
// Reduced-motion and data-saver visitors keep the poster frame with the first hook line; the video pauses off screen.
(function () {
  'use strict';
  var SWK = window.SWK;

  // [start, end, phase] in seconds. Gaps between beats are intentional: each line fades out before the next fades in.
  var TIMELINE = [[0.5, 5.4, 'b1'], [6.2, 11.2, 'b2'], [12.0, 16.6, 'b3'], [17.2, 99, 'logo']];
  function phaseAt(t) {
    for (var i = 0; i < TIMELINE.length; i++) if (t >= TIMELINE[i][0] && t < TIMELINE[i][1]) return TIMELINE[i][2];
    return 'gap';
  }

  SWK.reg('hero', function () {
    var hero = SWK.$('.hero');
    var video = hero && SWK.$('.hero__video', hero);
    if (!video) return;
    video.muted = true;

    var conn = navigator.connection;
    if (SWK.reduced || (conn && conn.saveData)) { video.removeAttribute('autoplay'); video.pause(); return; }

    var visible = true, phase = '', raf = 0;
    function tick() {
      var next = phaseAt(video.currentTime);
      if (next !== phase) { phase = next; hero.setAttribute('data-phase', next); }
      raf = video.paused ? 0 : requestAnimationFrame(tick);
    }
    function sync() {
      if (visible && !document.hidden) {
        var p = video.play();
        if (p && p.catch) p.catch(function () { /* autoplay blocked: the poster stays */ });
      } else video.pause();
    }
    video.addEventListener('playing', function () { if (!raf) raf = requestAnimationFrame(tick); });
    video.addEventListener('seeked', tick);
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
