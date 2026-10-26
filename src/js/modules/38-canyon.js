// The canyon: a 3D scroll scene. The camera moves down a street between two rows of towers (CSS 3D, no library) and
// passes through five hook lines hung in the road. Geometry is authored for a 1180x760 stage and scaled to cover.
(function () {
  'use strict';
  var SWK = window.SWK;

  SWK.reg('canyon', function () {
    var sec = SWK.$('.canyon');
    if (!sec) return;
    if (SWK.reduced || /[?&]nowebgl\b/.test(location.search) || !window.CSS || !CSS.supports('transform-style', 'preserve-3d')) return;

    var stage = SWK.$('.canyon__stage', sec), frame = SWK.$('.canyon__frame', sec), world = SWK.$('.canyon__world', sec);
    var road = SWK.$('.canyon__road', sec), bar = SWK.$('.canyon__progress span', sec), cta = SWK.$('.canyon__cta', sec);
    var quotes = SWK.$$('.canyon__quote', sec);
    if (!stage || !frame || !world || !quotes.length) return;

    var P = 900, GROUND = 250, STEP = 1500, FIRST = 700;
    var RANGE = FIRST + STEP * (quotes.length - 1) + 380;
    var towers = [], planes = [], cam = 0, target = 0, running = false, raf = 0, narrow = false, ptrX = 0, ptrY = 0, curX = 0, curY = 0;

    function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
    function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }

    function build() {
      var vw = stage.clientWidth, vh = stage.clientHeight;
      narrow = vw / vh < 0.85;
      var s = Math.max(vw / 1180, vh / 760);
      frame.style.setProperty('--s', s.toFixed(4));
      var half = narrow ? 250 : 520;
      road.style.setProperty('--rh', half + 'px');
      world.textContent = ''; towers = []; planes = [];
      var rand = rng(7);
      for (var side = -1; side <= 1; side += 2) {
        var z = -240 - rand() * 120;
        while (z > -(RANGE + 2000)) {
          var w = 170 + rand() * 230, d = 200 + rand() * 160, h = 760 + rand() * 1700;
          var x = side * (half + 26 + w / 2 + (rand() < 0.3 ? 90 + rand() * 140 : 0));
          var t = el('div', 'cw'); t.setAttribute('aria-hidden', 'true');
          t.style.cssText = 'width:' + w + 'px;height:' + h + 'px;margin:' + (GROUND - h) + 'px 0 0 ' + (-w / 2) + 'px;transform:translate3d(' + x.toFixed(1) + 'px,0,' + z.toFixed(1) + 'px)';
          var f = el('i', 'f'); f.style.cssText = 'left:0;top:0;width:' + w + 'px;height:' + h + 'px;transform:translateZ(' + (d / 2) + 'px)';
          var sd = el('i', 's'); sd.style.cssText = 'left:50%;top:0;width:' + d + 'px;height:' + h + 'px;margin-left:' + (-d / 2) + 'px;transform:rotateY(' + (side < 0 ? 90 : -90) + 'deg) translateZ(' + (w / 2) + 'px)';
          t.appendChild(f); t.appendChild(sd); world.appendChild(t);
          towers.push({ e: t, f: f, s: sd, z: z });
          z -= 250 + rand() * 170;
        }
      }
      var qw = narrow ? 330 : 760;
      quotes.forEach(function (q, i) {
        var zq = -(FIRST + STEP * i);
        q.classList.remove('canyon__quote'); q.classList.add('cq');
        q.style.cssText = 'width:' + qw + 'px;margin:' + (narrow ? -150 : -110) + 'px 0 0 ' + (-qw / 2) + 'px;transform:translate3d(0,0,' + zq + 'px)';
        q.firstElementChild.style.fontSize = (narrow ? 38 : 66) + 'px';
        world.appendChild(q); planes.push({ e: q, z: zq });
      });
    }

    function smooth(a, b, x) { var t = SWK.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

    function draw() {
      cam += (target - cam) * 0.14;
      if (Math.abs(target - cam) < 0.4) cam = target;
      world.style.transform = 'translateZ(' + cam.toFixed(1) + 'px)';
      road.style.setProperty('--by', (cam % 380).toFixed(1) + 'px');
      for (var i = 0; i < towers.length; i++) {
        var zt = towers[i].z + cam;
        var o = SWK.clamp(1 - (-zt - 2600) / 3600, 0, 1) * (1 - smooth(P * 0.55, P * 0.9, zt));
        // opacity goes on the faces: opacity on the 3D parent would flatten it
        var os = o.toFixed(3), vis = o < 0.01 ? 'hidden' : 'visible';
        towers[i].f.style.opacity = os; towers[i].s.style.opacity = os; towers[i].e.style.visibility = vis;
      }
      for (var j = 0; j < planes.length; j++) {
        var q = planes[j], zq = q.z + cam;
        var op = smooth(-1350, -850, zq) * (1 - smooth(-20, 300, zq));
        q.e.style.opacity = op.toFixed(3);
        q.e.style.visibility = op < 0.01 ? 'hidden' : 'visible';
      }
      var p = cam / RANGE;
      stage.style.setProperty('--cp', SWK.clamp(p, 0, 1).toFixed(4));
      if (cta) { var co = smooth(0.9, 0.99, p); cta.style.setProperty('--co', co.toFixed(3)); var b = SWK.$('.btn', cta); if (b) b.tabIndex = co > 0.6 ? 0 : -1; }
      if (SWK.fine) {
        curX += (ptrX - curX) * 0.06; curY += (ptrY - curY) * 0.06;
        frame.style.perspectiveOrigin = (50 + curX * 4).toFixed(2) + '% ' + (42 + curY * 2.5).toFixed(2) + '%';
      }
    }

    function read() {
      var r = sec.getBoundingClientRect(), total = sec.offsetHeight - stage.clientHeight;
      target = SWK.clamp(-r.top / total, 0, 1) * RANGE;
    }
    function loop() {
      if (!running) return;
      read(); draw();
      raf = requestAnimationFrame(loop);
    }

    build();
    sec.classList.add('is-3d');
    build();                                   // measure again now the stage is displayed
    read(); cam = target; draw();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        running = e[0].isIntersecting;
        if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }
      }, { rootMargin: '10% 0px' }).observe(sec);
    } else { running = true; loop(); }
    window.addEventListener('resize', function () { build(); read(); cam = target; draw(); });
    if (SWK.fine) {
      stage.addEventListener('pointermove', function (ev) {
        var r = stage.getBoundingClientRect();
        ptrX = ((ev.clientX - r.left) / r.width) * 2 - 1; ptrY = ((ev.clientY - r.top) / r.height) * 2 - 1;
      });
    }
  });
})();
