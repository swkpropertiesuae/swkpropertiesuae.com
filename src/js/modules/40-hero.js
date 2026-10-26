// Hero: interactive scroll-animated aerial-to-office fly-through video with 3D scroll beats,
// closing SWK logo reveal, interactive chapter scrubber, and pointer camera parallax.
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
    var chapters = SWK.$$('[data-hero-chapter]', hero);
    var track = SWK.$('[data-hero-track]', hero);

    var targetP = 0;
    var curP = 0;
    var rafId = 0;
    var lastTick = performance.now();
    var phase = '';
    var activeChapter = -1;
    var pendingTime = null;
    var blobLoaded = false;

    // Non-blocking hardware decoder seek queue: never cancels an in-flight decode frame.
    function seekTo(t) {
      var dur = (video.duration && !isNaN(video.duration) && isFinite(video.duration)) ? video.duration : 20.0;
      if (video.readyState < 1) {
        pendingTime = t;
        return;
      }
      var clamped = SWK.clamp(t, 0.02, Math.max(0.05, dur - 0.08));
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
      }
    });

    function primeVideo() {
      video.pause();
      var dur = (video.duration && !isNaN(video.duration) && isFinite(video.duration)) ? video.duration : 20.0;
      seekTo(curP * (dur - 0.08));
      // If served by a simple HTTP server without Range support (e.g. python -m http.server),
      // upgrade to an in-memory Blob URL so random-access scroll seeking still works seamlessly.
      if (!blobLoaded && (!video.seekable || !video.seekable.length || video.seekable.end(0) < 1)) {
        blobLoaded = true;
        fetch('/assets/video/hero-swk.mp4').then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) {
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

    function setBeatStyle(el, o, y, s, blur) {
      if (!el) return;
      el.style.setProperty('--beat-o', o.toFixed(3));
      el.style.setProperty('--beat-y', y.toFixed(1) + 'px');
      el.style.setProperty('--beat-s', s.toFixed(3));
      el.style.setProperty('--beat-blur', blur.toFixed(2) + 'px');
    }

    function applyProgress(p) {
      hero.classList.add('is-scroll-ready');
      hero.style.setProperty('--p', p.toFixed(4));
      hero.classList.toggle('is-leaving', p > 0.18);

      var nextPhase = p < 0.25 ? 'b1' : p < 0.56 ? 'b2' : p < 0.81 ? 'b3' : 'logo';
      if (nextPhase !== phase) {
        phase = nextPhase;
        hero.setAttribute('data-phase', nextPhase);
      }

      var chapIdx = p < 0.25 ? 0 : p < 0.56 ? 1 : p < 0.81 ? 2 : 3;
      if (chapIdx !== activeChapter) {
        activeChapter = chapIdx;
        chapters.forEach(function (btn, i) {
          var on = i === chapIdx;
          btn.classList.toggle('is-active', on);
          if (on) btn.setAttribute('aria-current', 'step');
          else btn.removeAttribute('aria-current');
        });
      }

      // Opening dock (CTAs + glass search bar) glides down and dissolves as camera enters the tower window.
      var dockT = SWK.clamp((p - 0.11) / 0.12, 0, 1);
      hero.style.setProperty('--dock-o', (1 - dockT).toFixed(3));
      hero.style.setProperty('--dock-y', (dockT * 30).toFixed(1) + 'px');
      hero.style.setProperty('--dock-s', (1 - dockT * 0.05).toFixed(3));

      // Beat 1: Sheikh Zayed Road approach (0.00 -> 0.25)
      var o1 = SWK.clamp((0.24 - p) / 0.08, 0, 1);
      var t1 = SWK.clamp(p / 0.24, 0, 1);
      setBeatStyle(beats[0], o1, -t1 * 26, 1 + t1 * 0.06, (1 - o1) * 7);

      // Beat 2: SWK Properties reception lobby (0.25 -> 0.56)
      var o2 = SWK.clamp((p - 0.25) / 0.06, 0, 1) * SWK.clamp((0.55 - p) / 0.06, 0, 1);
      var t2 = SWK.clamp((p - 0.25) / 0.30, 0, 1);
      setBeatStyle(beats[1], o2, (0.5 - t2) * 36, 0.95 + t2 * 0.08, (1 - o2) * 6);

      // Beat 3: Executive lounge to panoramic window (0.56 -> 0.81)
      var o3 = SWK.clamp((p - 0.56) / 0.06, 0, 1) * SWK.clamp((0.80 - p) / 0.06, 0, 1);
      var t3 = SWK.clamp((p - 0.56) / 0.24, 0, 1);
      setBeatStyle(beats[2], o3, (0.5 - t3) * 36, 0.95 + t3 * 0.08, (1 - o3) * 6);

      // Closing logo reveal over Burj Khalifa skyline (0.80 -> 1.00)
      var rvRaw = SWK.clamp((p - 0.80) / 0.13, 0, 1);
      var rv = rvRaw * rvRaw * (3 - 2 * rvRaw);
      hero.style.setProperty('--rv', rv.toFixed(4));

      // Scrub video frame to match scroll position
      var dur = (video.duration && !isNaN(video.duration) && isFinite(video.duration)) ? video.duration : 20.0;
      seekTo(p * (dur - 0.08));
    }

    function step(now) {
      var dt = SWK.clamp((now - lastTick) * 0.001, 0.001, 0.1);
      lastTick = now;
      var diff = targetP - curP;
      if (Math.abs(diff) > 0.24) {
        curP = targetP;
      } else {
        var alpha = 1 - Math.exp(-dt * 16);
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
      if (!rafId) {
        lastTick = performance.now();
        rafId = requestAnimationFrame(step);
      }
    }

    function scrollToFraction(f, smooth) {
      var extent = getExtent();
      if (extent <= 0) return;
      var top = wrap.offsetTop + extent * SWK.clamp(f, 0, 1);
      window.scrollTo({ top: top, behavior: smooth ? 'smooth' : 'instant' });
    }

    // Interactive chapter buttons: click to fly smoothly to any chapter.
    chapters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = parseFloat(btn.getAttribute('data-hero-chapter') || '0');
        scrollToFraction(f, true);
      });
    });

    // Interactive scrub rail: click or drag to scrub the aerial journey directly.
    if (track) {
      var dragging = false;
      var scrubAt = function (clientX) {
        var r = track.getBoundingClientRect();
        if (!r.width) return;
        var f = SWK.clamp((clientX - r.left) / r.width, 0, 1);
        scrollToFraction(f, false);
      };
      track.addEventListener('pointerdown', function (ev) {
        dragging = true;
        if (track.setPointerCapture) {
          try { track.setPointerCapture(ev.pointerId); } catch (e) {}
        }
        scrubAt(ev.clientX);
      });
      track.addEventListener('pointermove', function (ev) {
        if (!dragging) return;
        scrubAt(ev.clientX);
      });
      var endDrag = function () { dragging = false; };
      track.addEventListener('pointerup', endDrag);
      track.addEventListener('pointercancel', endDrag);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    targetP = readScrollProgress();
    curP = targetP;
    applyProgress(curP);

    // Subtle 3D camera parallax & glass search bar tilt on fine pointers.
    if (SWK.fine) {
      hero.addEventListener('pointermove', function (ev) {
        if (ev.pointerType === 'touch') return;
        var r = hero.getBoundingClientRect();
        var nx = ((ev.clientX - r.left) / r.width - 0.5) * 2;
        var ny = ((ev.clientY - r.top) / r.height - 0.5) * 2;
        hero.classList.add('is-pointer');
        hero.style.setProperty('--cam-x', (-nx * 14).toFixed(1) + 'px');
        hero.style.setProperty('--cam-y', (-ny * 9).toFixed(1) + 'px');
      });
      hero.addEventListener('pointerleave', function () {
        hero.classList.remove('is-pointer');
        hero.style.setProperty('--cam-x', '0px');
        hero.style.setProperty('--cam-y', '0px');
      });
    }

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
