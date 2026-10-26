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

  // ---- Hero: one aerial shot plays once, then the logo and welcome arrive ------------------------------------------
  var REVEAL_AT = 10.5;   // seconds into the shot

  SWK.reg('hero', function () {
    var hero = SWK.$('.hero');
    if (!hero) return;
    var video = SWK.$('.hero__video', hero);

    function still() { hero.classList.add('is-still', 'is-revealed'); if (video) video.remove(); }

    var nav = navigator;
    var plain = SWK.reduced || /[?&]nowebgl\b/.test(location.search) || (nav.connection && nav.connection.saveData) || (nav.deviceMemory && nav.deviceMemory < 2);
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
      // Pause while the hero is off screen; resume where it left off.
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) {
          if (!video.parentNode || video.ended) return;
          if (e[0].isIntersecting) { var r = video.play(); if (r && r.catch) r.catch(function () {}); } else video.pause();
        }, { threshold: 0.15 }).observe(hero);
      }
    }

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
