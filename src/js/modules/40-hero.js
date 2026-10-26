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

  // ---- Hero: one aerial shot behind a 3D scroll flight ---------------------------------------------------------------
  // The video plays once. Scrolling flies the camera forward through five hook lines hung in space (CSS 3D, no library);
  // the welcome block flies out first and comes back at the end of the runway.
  var REVEAL_AT = 10.5;   // seconds into the shot
  var P = 900, STEP = 1500, FIRST = 1500, FRAMES = 14, FSTEP = 560;

  function smooth(a, b, x) { var t = SWK.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  SWK.reg('hero', function () {
    var hero = SWK.$('.hero');
    if (!hero) return;
    var wrap = SWK.$('.hero-cine');
    var video = SWK.$('.hero__video', hero);
    var flight = SWK.$('[data-hero-flight]', hero), welcome = SWK.$('[data-hero-welcome]', hero);
    var bar = SWK.$('.hero__progress span', hero);

    var nav = navigator;
    var plain = SWK.reduced || /[?&]nowebgl\b/.test(location.search) || (nav.connection && nav.connection.saveData) || (nav.deviceMemory && nav.deviceMemory < 2);

    function still() {
      hero.classList.add('is-still', 'is-revealed');
      if (video) video.remove();
      if (flight) flight.remove();
      var list = SWK.$('[data-hero-quotes]'); if (list) list.hidden = false;
    }

    // ---- video
    if (!video || plain) { still(); }
    else {
      var tall = window.matchMedia('(max-width: 767px)').matches;
      var fallback = setTimeout(still, 8000);
      video.addEventListener('playing', function () { clearTimeout(fallback); hero.classList.add('is-playing'); }, { once: true });
      video.addEventListener('error', function () { clearTimeout(fallback); still(); });
      video.addEventListener('timeupdate', function () {
        var t = video.currentTime;
        hero.classList.toggle('is-captioned', t > 0.9 && t < REVEAL_AT - 0.6);
        if (t >= REVEAL_AT) hero.classList.add('is-revealed');
      });
      video.addEventListener('ended', function () { hero.classList.remove('is-captioned'); hero.classList.add('is-revealed'); });
      video.muted = true;
      video.src = tall ? video.getAttribute('data-src-tall') : video.getAttribute('data-src-wide');
      var started = video.play();
      if (started && started.catch) started.catch(function () { clearTimeout(fallback); still(); });
    }

    // ---- 3D flight
    if (flight && welcome && wrap && !plain && CSS && CSS.supports && CSS.supports('transform-style', 'preserve-3d')) {
      wrap.classList.add('has-flight');
      var quotes = SWK.$$('.flight__quote', flight);
      var RANGE = FIRST + STEP * (quotes.length - 1) + 420;
      var frames = [], cam = 0, target = 0, p = 0, running = true, raf = 0;

      var tunnel = document.createElement('div'); tunnel.className = 'flight__tunnel'; tunnel.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < FRAMES; k++) { var f = document.createElement('i'); tunnel.appendChild(f); frames.push(f); }
      flight.insertBefore(tunnel, flight.firstChild);

      var read = function () {
        var total = wrap.offsetHeight - hero.offsetHeight;
        p = total > 0 ? SWK.clamp(-wrap.getBoundingClientRect().top / total, 0, 1) : 0;
        target = smooth(0.07, 0.9, p) * RANGE;
      };

      var draw = function () {
        cam += (target - cam) * 0.12;
        if (Math.abs(target - cam) < 0.4) cam = target;
        var span = FRAMES * FSTEP;
        for (var i = 0; i < FRAMES; i++) {
          var zt = -((i * FSTEP - cam) % span + span) % span;      // distance ahead, looping
          var z = zt + FSTEP * 2;
          var o = SWK.clamp(1 - (-z - 400) / (span - 900), 0, 1) * (1 - smooth(P * 0.5, P * 0.85, z)) * 0.5;
          frames[i].style.transform = 'translate(-50%,-50%) translateZ(' + z.toFixed(0) + 'px)';
          frames[i].style.opacity = o.toFixed(3);
        }
        for (var j = 0; j < quotes.length; j++) {
          var zq = -(FIRST + STEP * j) + cam;
          var op = smooth(-1350, -850, zq) * (1 - smooth(-20, 300, zq));
          quotes[j].style.transform = 'translate(-50%,-50%) translateZ(' + zq.toFixed(0) + 'px)';
          quotes[j].style.opacity = op.toFixed(3);
          quotes[j].style.visibility = op < 0.01 ? 'hidden' : 'visible';
        }
        // welcome: out through the camera first, back from the distance at the end
        var out = smooth(0.0, 0.07, p), back = smooth(0.9, 0.99, p);
        var wz = p < 0.5 ? out * 650 : -1400 + back * 1400;
        var wo = p < 0.5 ? 1 - out : back;
        hero.style.setProperty('--wz', wz.toFixed(0) + 'px');
        hero.style.setProperty('--wo', wo.toFixed(3));
        hero.classList.toggle('welcome-off', wo < 0.35);
        if (p > 0.85) hero.classList.add('is-revealed');
        var vs = 1 + 0.14 * p;
        if (video) video.style.transform = 'scale(' + vs.toFixed(4) + ')';
        hero.style.setProperty('--q', smooth(0.02, 0.12, p) * (1 - smooth(0.9, 0.99, p)));
        if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      };

      var loop = function () { if (!running) return; read(); draw(); raf = requestAnimationFrame(loop); };
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) { running = e[0].isIntersecting; if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); } else if (video && !video.ended && !video.paused) video.pause(); if (running && video && !video.ended) { var r = video.play(); if (r && r.catch) r.catch(function () {}); } }, { threshold: 0.05 }).observe(hero);
      }
      read(); cam = target; draw(); raf = requestAnimationFrame(loop);
    } else if (video && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        if (!video.parentNode || video.ended) return;
        if (e[0].isIntersecting) { var r = video.play(); if (r && r.catch) r.catch(function () {}); } else video.pause();
      }, { threshold: 0.15 }).observe(hero);
    }

    // Tilt the glass search panel toward the pointer.
    var sb = SWK.$('.search-bar', hero);
    if (sb && SWK.fine) {
      sb.addEventListener('pointermove', function (ev) {
        var r = sb.getBoundingClientRect();
        sb.classList.add('is-tilting');
        sb.style.setProperty('--ry', ((((ev.clientX - r.left) / r.width - 0.5) * 2) * 2.2).toFixed(2) + 'deg');
        sb.style.setProperty('--rx', (-(((ev.clientY - r.top) / r.height - 0.5) * 2) * 3.2).toFixed(2) + 'deg');
      });
      sb.addEventListener('pointerleave', function () {
        sb.classList.remove('is-tilting');
        sb.style.setProperty('--ry', '0deg'); sb.style.setProperty('--rx', '0deg');
      });
    }
  });
})();
