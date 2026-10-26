// Hero: headline reveal and the scroll-scrubbed WebGL fly-through.
(function () {
  'use strict';
  var SWK = window.SWK;

  // ---- Typewriter + colourful text ------------------------------------
  function splitChars(node, state) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var word = document.createElement('span');
          word.className = 'tw-word';
          Array.prototype.slice.call(part).forEach(function (ch) {
            var c = document.createElement('span');
            c.className = 'tw-char';
            c.textContent = ch;
            c.style.transitionDelay = (0.05 + state.i * 0.012).toFixed(3) + 's';
            state.i++;
            word.appendChild(c);
          });
          frag.appendChild(word);
        });
        child.parentNode.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        splitChars(child, state);
      }
    });
  }

  function initTypewriter() {
    SWK.$$('[data-typewriter]').forEach(function (el) {
      if (el.hasAttribute('data-tw-init')) return;
      el.setAttribute('data-tw-init', 'true');
      if (SWK.reduced) return;
      splitChars(el, { i: 0 });
      setTimeout(function () { el.classList.add('is-typing'); }, 30);
    });
  }

  // ---- Canvas gate ------------------------------------------------------------------------------------------------
  function canRun() {
    if (SWK.reduced) return false;
    if (/[?&]nowebgl\b/.test(location.search)) return false;
    var nav = navigator;
    if (nav.connection && nav.connection.saveData) return false;
    if (nav.deviceMemory && nav.deviceMemory < 2) return false;
    return !!document.createElement('canvas').getContext;
  }

  SWK.reg('hero', function () {
    var hero = SWK.$('.hero');
    var wrap = SWK.$('.hero-cine');
    if (!hero) return;

    initTypewriter();

    function still() {
      hero.classList.remove('is-gl', 'is-gl-pending');
      hero.classList.add('is-photo-mode');
      hero.style.setProperty('--rv', '1');
      if (wrap) wrap.classList.add('is-flat');
    }

    var canvas = SWK.$('.hero__gl', hero);
    if (!wrap || !canvas || !canRun()) { still(); return; }

    var progress = 0, scene = null, visible = true;
    var mobile = window.matchMedia('(max-width: 767px)').matches;

    // Scroll position -> flight progress. The scene also flies by itself on arrival and never fights the scrollbar.
    var update = SWK.raf(function () {
      var total = wrap.offsetHeight - hero.offsetHeight;
      progress = total > 0 ? SWK.clamp(-wrap.getBoundingClientRect().top / total, 0, 1) : 0;
      if (scene) scene.setProgress(progress);
    });

    // Intro: on a first visit the page scrolls itself through the whole shot once. Any input takes over instantly.
    function intro() {
      if (SWK.reduced || /[?&]hold\b/.test(location.search) || window.scrollY > 4) return;
      try { if (sessionStorage.getItem('swk-intro')) return; } catch (e) { /* noop */ }
      var total = wrap.offsetHeight - hero.offsetHeight, dur = 15000, t0 = 0, last = 0, done = false;
      var evs = ['wheel', 'touchstart', 'keydown', 'mousedown'];
      function end() {
        if (done) return; done = true;
        evs.forEach(function (n) { window.removeEventListener(n, end); });
        try { sessionStorage.setItem('swk-intro', '1'); } catch (e) { /* noop */ }
      }
      evs.forEach(function (n) { window.addEventListener(n, end, { passive: true }); });
      function step(now) {
        if (done) return;
        if (!t0) t0 = now;
        if (Math.abs(window.scrollY - last) > 3) { end(); return; }
        var u = Math.min(1, (now - t0) / dur);
        window.scrollTo({ top: Math.round(total * (0.5 - 0.5 * Math.cos(Math.PI * u))), behavior: 'instant' });
        last = window.scrollY;
        if (u < 1) requestAnimationFrame(step); else end();
      }
      requestAnimationFrame(step);
    }

    hero.classList.add('is-gl-pending');
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    var giveUp = setTimeout(function () { if (scene) { try { scene.dispose(); } catch (e) { /* noop */ } scene = null; } still(); }, 15000);

    // The words are drawn on the canvas, so the display faces must be loaded first.
    var fonts = document.fonts && document.fonts.load ? Promise.all([
      document.fonts.load('700 100px "Clash Display"'), document.fonts.load('400 40px "Clash Display"'), document.fonts.load('italic 400 40px "Instrument Serif"')
    ]).catch(function () {}) : Promise.resolve();

    var src = (window.SWK_ASSETS || '/assets/js/') + 'hero-scene.js' + (window.SWK_V ? '?v=' + window.SWK_V : '');
    Promise.all([import(src), fonts]).then(function (res) {
      var mod = res[0];
      try {
        scene = mod.createHeroScene(canvas, { mobile: mobile });
      } catch (err) {
        console.warn('[swk] hero canvas unavailable, using the still hero.', err && err.message);
        clearTimeout(giveUp); still(); return;
      }
      scene.onReady = function () {
        clearTimeout(giveUp);
        hero.classList.remove('is-gl-pending');
        hero.classList.add('is-gl');
        setTimeout(intro, 700);
      };
      scene.onProgress = function (p, rv) {
        hero.style.setProperty('--p', p.toFixed(4));
        hero.style.setProperty('--rv', rv.toFixed(4));
        hero.classList.toggle('is-revealed', rv > 0.02);
      };
      scene.setProgress(progress);

      if (window.ResizeObserver) new ResizeObserver(function () { if (scene) scene.resize(); }).observe(canvas);
      else window.addEventListener('resize', function () { if (scene) scene.resize(); });

      function sync() {
        if (!scene) return;
        if (visible && !document.hidden) scene.start(); else scene.stop();
      }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }, { threshold: 0 }).observe(hero);
      }
      document.addEventListener('visibilitychange', sync);
      sync();

      if (SWK.fine) {
        hero.addEventListener('pointermove', function (ev) {
          if (!scene || ev.pointerType === 'touch') return;
          var r = hero.getBoundingClientRect();
          scene.setPointer(((ev.clientX - r.left) / r.width) * 2 - 1, -(((ev.clientY - r.top) / r.height) * 2 - 1));
        });
        hero.addEventListener('pointerleave', function () { if (scene) scene.setPointer(0, 0); });
      }
    }).catch(function (err) {
      console.warn('[swk] could not load the hero scene, using the still hero.', err && err.message);
      clearTimeout(giveUp); still();
    });

    // Tilt the glass search panel toward the pointer.
    var bar = SWK.$('.search-bar', hero);
    if (bar && SWK.fine) {
      bar.addEventListener('pointermove', function (ev) {
        var r = bar.getBoundingClientRect();
        bar.classList.add('is-tilting');
        bar.style.setProperty('--ry', ((((ev.clientX - r.left) / r.width - 0.5) * 2) * 2.2).toFixed(2) + 'deg');
        bar.style.setProperty('--rx', (-(((ev.clientY - r.top) / r.height - 0.5) * 2) * 3.2).toFixed(2) + 'deg');
      });
      bar.addEventListener('pointerleave', function () {
        bar.classList.remove('is-tilting');
        bar.style.setProperty('--ry', '0deg'); bar.style.setProperty('--rx', '0deg');
      });
    }
  });
})();
