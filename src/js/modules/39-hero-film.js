// A single edited film keeps camera movement and real traffic in the same frame.
(function () {
  'use strict';
  window.SWKFilm = function (hero, wrap) {
    var video = hero.querySelector('[data-hero-film]');
    if (!video || !wrap) return false;
    var SWK = window.SWK;
    // No media downloads or scroll trapping for reduced motion / save-data.
    if (SWK.reduced || (navigator.connection && navigator.connection.saveData)) {
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach(function (s) { s.removeAttribute('src'); });
      video.load();
      video.remove();
      return false;
    }
    var ready = false, failed = false, desired = 0;
    var credit = hero.querySelector('.hero-art-credit');
    var originalCredit = credit ? credit.textContent : '';
    var captions = hero.querySelectorAll('.hero__caption');
    var originals = Array.from(captions, function (c) { return c.innerHTML; });
    function seek() {
      if (!ready || failed || video.seeking) return;
      if (Math.abs(video.currentTime - desired) > 0.035) {
        try { video.currentTime = desired; } catch (e) { fallback(); }
      }
    }
    var update = SWK.raf(function () {
      if (failed) return;
      var extent = wrap.offsetHeight - hero.offsetHeight;
      var p = extent > 0 ? SWK.clamp(-wrap.getBoundingClientRect().top / extent, 0, 1) : 0;
      hero.style.setProperty('--p', p.toFixed(4));
      hero.classList.toggle('is-leaving', p > 0.18);
      [[0.22, 0.48], [0.5, 0.76], [0.8, 1.2]].forEach(function (range, i) {
        if (!captions[i]) return;
        var opacity = SWK.clamp((p - range[0]) / 0.07, 0, 1);
        if (i < 2) opacity *= SWK.clamp((range[1] - p) / 0.07, 0, 1);
        captions[i].style.setProperty('--o', opacity.toFixed(3));
      });
      if (ready) { desired = p * Math.max(0, video.duration - 0.05); seek(); }
    });
    function fallback() {
      if (failed) return;
      failed = true;
      clearTimeout(timeout);
      video.pause();
      hero.classList.remove('is-film');
      hero.classList.add('is-photo-mode');
      wrap.classList.add('is-flat');
      hero.classList.remove('is-leaving');
      hero.style.setProperty('--p', '0');
      if (credit) credit.textContent = originalCredit;
      captions.forEach(function (c, i) { c.innerHTML = originals[i]; });
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    }
    var timeout = setTimeout(fallback, 15000);
    video.addEventListener('error', fallback);
    video.addEventListener('seeked', seek);
    video.addEventListener('loadeddata', function () {
      if (failed || !Number.isFinite(video.duration) || video.duration <= 0) { fallback(); return; }
      clearTimeout(timeout);
      ready = true;
      hero.classList.add('is-film');
      if (credit) credit.textContent = 'Sheikh Zayed Road · Dubai';
      ['Sheikh Zayed Road. Dubai.', 'Al Saqr Business Tower.', 'Welcome to SWK Properties.'].forEach(function (text, i) {
        if (captions[i]) captions[i].textContent = text;
      });
      update();
    });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    video.preload = 'auto';
    video.load();
    update();
    return true;
  };
})();
