// Hero: interactive scroll-animated aerial-to-office fly-through video with 3D scroll beats,
// closing SWK logo reveal, and cursor-tracked search interaction.
// Reduced-motion and data-saver visitors keep the single-screen poster frame with the opening hook.
(function () {
  'use strict';
  var SWK = window.SWK;

  SWK.reg('hero', function () {
    var wrap = SWK.$('.hero-cine');
    var hero = SWK.$('.hero');
    var video = hero && SWK.$('.hero__video', hero);
    if (!hero || !video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.pause();

    var conn = navigator.connection;
    var mobile = window.matchMedia('(max-width: 767px)').matches;
    if (mobile) {
      video.poster = video.getAttribute('data-poster-mobile') || video.poster;
      var flatPoster = SWK.$('.hero__idle', hero);
      if (flatPoster) flatPoster.classList.add('is-mobile');
    }
    if (SWK.reduced || (conn && conn.saveData)) {
      if (wrap) wrap.classList.add('is-flat');
      video.removeAttribute('autoplay');
      video.pause();
      hero.setAttribute('data-phase', 'b1');
      return;
    }

    var beats = [
      SWK.$('[data-beat="b1"]', hero),
      SWK.$('[data-beat="b2"]', hero),
      SWK.$('[data-beat="b3"]', hero)
    ];

    var targetP = 0;
    var curP = 0;
    var rafId = 0;
    var lastTick = performance.now();
    var phase = '';
    var pendingTime = null;
    var blobLoaded = false;
    var idleVids = SWK.$$('.hero__idle-video', hero);
    var idleFront = 0;
    var idleRaf = 0;
    var idleHide = 0;
    var idleTimer = 0;
    var idlePlaying = false;
    var inView = true;
    // The scroll film opens at 0.8s, the moment the idle clip hands over to it.
    var FILM_START = 0.8;
    var IDLE_XFADE = 0.9;
    var IDLE_MAX_P = 0.012;

    // Use the upscaled 4K encode on large/high-density displays; retain the lighter
    // 1080p encode on phones and honour the data-saver early return above.
    // Phones get the dedicated portrait film (short-GOP encode, so scroll seeks stay instant);
    // everyone else gets the 1080p film, or the 4K encode on large/high-density displays.
    var uhdSrc = video.getAttribute('data-src-4k');
    if (mobile) {
      video.src = video.getAttribute('data-src-mobile');
    } else if (window.innerWidth * (window.devicePixelRatio || 1) >= 2560 && uhdSrc) {
      video.src = uhdSrc;
    } else {
      video.src = video.getAttribute('data-src-hq');
    }
    video.load();
    idleVids.forEach(function (v) {
      v.src = (mobile && v.getAttribute('data-src-mobile')) || v.getAttribute('data-src');
      v.load();
    });
    video.loop = false;

    function idleTick() {
      idleRaf = 0;
      if (!idlePlaying) return;
      var cur = idleVids[idleFront];
      var dur = cur.duration;
      if (dur && isFinite(dur) && cur.currentTime >= dur - IDLE_XFADE) {
        // Hand over to the other element, restarted from the top, and cross-fade so the loop never jumps.
        var nextIdx = 1 - idleFront;
        var next = idleVids[nextIdx];
        try { next.currentTime = 0; } catch (e) { /* not seekable yet */ }
        var pl = next.play();
        if (pl && pl.catch) pl.catch(function () {});
        next.classList.add('is-front');
        cur.classList.remove('is-front');
        idleFront = nextIdx;
        setTimeout(function () { if (idleVids[1 - idleFront] && !idleVids[1 - idleFront].classList.contains('is-front')) idleVids[1 - idleFront].pause(); }, IDLE_XFADE * 1000 + 100);
      }
      idleRaf = requestAnimationFrame(idleTick);
    }

    function startIdle() {
      clearTimeout(idleHide);
      if (idlePlaying || !idleVids.length || document.hidden || !inView || curP > IDLE_MAX_P) return;
      idlePlaying = true;
      hero.classList.add('is-idle');
      var v = idleVids[idleFront];
      v.classList.add('is-front');
      v.muted = true;
      var play = v.play();
      if (play && play.catch) play.catch(function () { idlePlaying = false; });
      if (!idleRaf) idleRaf = requestAnimationFrame(idleTick);
    }

    function stopIdle() {
      clearTimeout(idleTimer);
      if (!idlePlaying && !hero.classList.contains('is-idle')) return;
      idlePlaying = false;
      if (idleRaf) { cancelAnimationFrame(idleRaf); idleRaf = 0; }
      hero.classList.remove('is-idle');
      // Let the cross-fade to the scroll film finish before parking the idle clips.
      clearTimeout(idleHide);
      idleHide = setTimeout(function () { idleVids.forEach(function (v) { v.pause(); }); }, 700);
    }

    function queueIdle() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(startIdle, 350);
    }

    // Warm the idle clips immediately so the very first paint is moving footage, not a still.
    startIdle();

    // Non-blocking hardware decoder seek queue: never cancels an in-flight decode frame.
    function seekTo(t) {
      var dur = (video.duration && !isNaN(video.duration) && isFinite(video.duration)) ? video.duration : 20.0;
      if (video.readyState < 1) {
        pendingTime = t;
        return;
      }
      var clamped = SWK.clamp(t, 0, Math.max(0.05, dur - 0.08));
      if (Math.abs(video.currentTime - clamped) < 0.012) return;
      if (video.seeking) {
        pendingTime = clamped;
        return;
      }
      pendingTime = null;
      try {
        video.currentTime = clamped;
      } catch (e) { /* ignore unbuffered seek edge case */ }
    }

    video.addEventListener('seeked', function () {
      if (pendingTime !== null) {
        var next = pendingTime;
        pendingTime = null;
        seekTo(next);
      } else if (!idlePlaying) queueIdle();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopIdle(); else queueIdle();
    });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (!inView) stopIdle(); else queueIdle();
      }, { threshold: 0.15 }).observe(hero);
    }

    function primeVideo() {
      video.pause();
      var dur = (video.duration && !isNaN(video.duration) && isFinite(video.duration)) ? video.duration : 20.0;
      seekTo(FILM_START + curP * (dur - FILM_START - 0.08));
      queueIdle();
      // If served by a simple HTTP server without Range support (e.g. python -m http.server),
      // upgrade to an in-memory Blob URL so random-access scroll seeking still works seamlessly.
      if (!blobLoaded && (!video.seekable || !video.seekable.length || video.seekable.end(0) < 1)) {
        blobLoaded = true;
        fetch(video.currentSrc || video.src).then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) {
          if (!b) return;
          video.src = URL.createObjectURL(b);
          video.load();
        }).catch(function () {});
      }
    }
    video.addEventListener('loadedmetadata', primeVideo);
    video.addEventListener('loadeddata', primeVideo);
    if (video.readyState >= 1) primeVideo();

    function getExtent() {
      return wrap ? Math.max(0, wrap.offsetHeight - hero.offsetHeight) : 0;
    }

    function readScrollProgress() {
      var extent = getExtent();
      if (extent <= 0) return 0;
      return SWK.clamp(-wrap.getBoundingClientRect().top / extent, 0, 1);
    }

    function ease(t) { return t * t * (3 - 2 * t); }

    function setBeatStyle(el, o, y, s, blur) {
      if (!el) return;
      el.style.setProperty('--beat-o', o.toFixed(3));
      el.style.setProperty('--beat-y', y.toFixed(1) + 'px');
      el.style.setProperty('--beat-s', s.toFixed(3));
      el.style.setProperty('--beat-blur', blur < 0.05 ? '0px' : blur.toFixed(2) + 'px');
      el.style.filter = blur < 0.05 ? 'none' : '';
    }

    function applyProgress(p, scrub) {
      hero.classList.add('is-scroll-ready');
      hero.style.setProperty('--p', p.toFixed(4));
      hero.classList.toggle('is-leaving', p > 0.18);

      var nextPhase = p < 0.25 ? 'b1' : p < 0.56 ? 'b2' : p < 0.81 ? 'b3' : 'logo';
      if (nextPhase !== phase) {
        phase = nextPhase;
        hero.setAttribute('data-phase', nextPhase);
      }

      // Opening dock (CTAs + glass search bar) glides down and dissolves as camera enters the tower window.
      var dockT = ease(SWK.clamp((p - 0.04) / 0.14, 0, 1));
      hero.style.setProperty('--dock-o', (1 - dockT).toFixed(3));
      hero.style.setProperty('--dock-y', (dockT * 30).toFixed(1) + 'px');
      hero.style.setProperty('--dock-s', (1 - dockT * 0.05).toFixed(3));

      // Beat 1: Sheikh Zayed Road approach (0.00 -> 0.25)
      var o1 = ease(SWK.clamp((0.24 - p) / 0.10, 0, 1));
      var t1 = ease(SWK.clamp(p / 0.24, 0, 1));
      setBeatStyle(beats[0], o1, -t1 * 26, 1 + t1 * 0.06, (1 - o1) * 7);

      // Beat 2: SWK Properties reception lobby (0.25 -> 0.56)
      var o2 = ease(SWK.clamp((p - 0.25) / 0.08, 0, 1)) * ease(SWK.clamp((0.55 - p) / 0.08, 0, 1));
      var t2 = SWK.clamp((p - 0.25) / 0.30, 0, 1);
      setBeatStyle(beats[1], o2, (0.5 - t2) * 36, 0.95 + t2 * 0.08, (1 - o2) * 6);

      // Beat 3: Executive lounge to panoramic window (0.56 -> 0.81)
      var o3 = ease(SWK.clamp((p - 0.56) / 0.08, 0, 1)) * ease(SWK.clamp((0.80 - p) / 0.08, 0, 1));
      var t3 = SWK.clamp((p - 0.56) / 0.24, 0, 1);
      setBeatStyle(beats[2], o3, (0.5 - t3) * 36, 0.95 + t3 * 0.08, (1 - o3) * 6);

      // Closing logo reveal over Burj Khalifa skyline (0.80 -> 1.00)
      var rvRaw = SWK.clamp((p - 0.80) / 0.13, 0, 1);
      var rv = rvRaw * rvRaw * (3 - 2 * rvRaw);
      hero.style.setProperty('--rv', rv.toFixed(4));
      var reveal = SWK.$('.hero__reveal', hero);
      if (reveal) {
        reveal.setAttribute('aria-hidden', String(p < 0.93));
        SWK.$$('a', reveal).forEach(function (a) { a.tabIndex = p >= 0.93 ? 0 : -1; });
      }

      // Scrub video frame to match scroll position
      var dur = (video.duration && !isNaN(video.duration) && isFinite(video.duration)) ? video.duration : 20.0;
      if (scrub !== false) seekTo(FILM_START + p * (dur - FILM_START - 0.08));
    }

    function step(now) {
      var dt = SWK.clamp((now - lastTick) * 0.001, 0.001, 0.1);
      lastTick = now;
      var diff = targetP - curP;
      if (Math.abs(diff) > 0.24) {
        curP = targetP;
      } else {
        var alpha = 1 - Math.exp(-dt * 11);
        curP += diff * alpha;
        if (Math.abs(targetP - curP) < 0.0004) curP = targetP;
      }
      applyProgress(curP);
      if (Math.abs(targetP - curP) >= 0.0004) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = 0;
      }
    }

    function onScroll() {
      targetP = readScrollProgress();
      if (targetP > IDLE_MAX_P) stopIdle();
      queueIdle();
      if (!rafId) {
        lastTick = performance.now();
        rafId = requestAnimationFrame(step);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    targetP = readScrollProgress();
    curP = targetP;
    applyProgress(curP);
    if (curP > IDLE_MAX_P) stopIdle();

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
