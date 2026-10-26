// SWK Properties — night-aerial hero.
// One forward-flying aerial of Sheikh Zayed Road, graded to blue hour, scrubbed by scroll (and played automatically
// on arrival). Giant headline words sit *between* the towers: the same video frame is drawn again, clipped to a few
// tower silhouettes, on top of the text. The flight ends looking straight ahead down the road; the logo and welcome
// are revealed in the DOM (.hero__reveal) by the --rv variable this scene reports through onProgress.

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
function easeOut(t) { return 1 - Math.pow(1 - clamp(t, 0, 1), 3); }

var VW = 1920, VH = 1080;           // coordinate space the tower silhouettes are measured in
var VP_X = 918, VP_Y = 520;         // vanishing point of the road
var DUR_FRAC = 0.985;               // stay off the very last frame so the video never "ends"
var FLIGHT_END = 0.84;              // video reaches its final aerial frame here; the rest is the logo reveal
var INTRO_SECONDS = 13;             // automatic flight length when the visitor has not scrolled

// Tower silhouettes that pass in front of the text: [t, x0, x1, yTop] keyframes in video pixels.
var OCCLUDERS = [
  { name: 'clock', keys: [[0, 1018, 1075, 150], [7, 1003, 1062, 130], [14.4, 995, 1058, 105]] }
];

// Chapters: a thin line, a giant word, and a human line underneath. [from, to] are scroll/flight progress.
var CHAPTERS = [
  { at: [0.02, 0.27], pre: 'DISCOVER', big: 'DUBAI', post: 'One road. A thousand front doors.' },
  { at: [0.29, 0.55], pre: 'BEHIND EVERY WINDOW', big: 'A PLAN', post: 'A first key. A family. A better return.' },
  { at: [0.57, 0.82], pre: 'WHICH ONE', big: 'IS YOURS?', post: 'We’ll walk you there, honestly.' }
];

function occluderRect(o, t) {
  var k = o.keys, i = 0;
  while (i < k.length - 2 && t > k[i + 1][0]) i++;
  var a = k[i], b = k[i + 1];
  var u = clamp((t - a[0]) / (b[0] - a[0]), 0, 1);
  return [lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)];
}

export function createHeroScene(canvas, opts) {
  opts = opts || {};
  var mobile = !!opts.mobile;
  var ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('2D canvas context unavailable');

  var dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
  var W = 0, H = 0;
  var progress = 0, targetProgress = 0, autoP = 0, autoStart = 0, scrollP = 0, effective = 0;
  var ptrX = 0, ptrY = 0, curX = 0, curY = 0;
  var running = false, rafId = 0, readyFired = false, lastSeek = -1, lastT = performance.now();
  var autoplay = !opts.hold;

  var poster = new Image();
  poster.src = '/assets/images/hero/dusk-poster' + (mobile ? '-640' : '') + '.webp';
  poster.onload = function () { render(performance.now()); };

  var video = document.createElement('video');
  video.muted = true; video.defaultMuted = true; video.playsInline = true;
  video.setAttribute('playsinline', ''); video.setAttribute('muted', '');
  video.preload = 'auto';
  video.src = mobile ? '/assets/video/szr-dusk-480.mp4' : '/assets/video/szr-dusk-720.mp4';
  video.addEventListener('loadeddata', function () {
    if (!readyFired) {
      readyFired = true;
      autoStart = performance.now();
      if (api.onReady) api.onReady();
    }
    render(performance.now());
  });
  video.addEventListener('seeked', function () { render(performance.now()); });
  video.load();

  function source() {
    if (video.readyState >= 2 && video.videoWidth) return video;
    if (poster.complete && poster.naturalWidth) return poster;
    return null;
  }

  function resize() {
    var r = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render(performance.now());
  }

  // ---- text ---------------------------------------------------------------------------------------------------------
  function spaced(text, x, y, tracking, align) {
    var total = 0, i, w = [];
    for (i = 0; i < text.length; i++) { w[i] = ctx.measureText(text[i]).width; total += w[i] + tracking; }
    total -= tracking;
    var cx = align === 'center' ? x - total / 2 : x;
    for (i = 0; i < text.length; i++) { ctx.fillText(text[i], cx, y); cx += w[i] + tracking; }
    return total;
  }

  function fitBig(text, maxW) {
    var size = 100;
    ctx.font = '700 ' + size + 'px "Clash Display","General Sans",system-ui,sans-serif';
    var w = ctx.measureText(text).width;
    return size * maxW / w;
  }

  function drawChapter(ch, p, sc, part) {
    var a = ch.at[0], b = ch.at[1];
    if (p < a - 0.01 || p > b + 0.04) return;
    var t = clamp((p - a) / (b - a), 0, 1);
    var enter = easeOut(t / 0.22);
    var leave = 1 - smooth(0.80, 1, t);
    var alpha = enter * leave;
    if (alpha <= 0.003) return;

    // The camera is flying forward, so the words grow toward the viewer through their whole chapter.
    var grow = 1 + t * 0.2 + (1 - enter) * -0.06;
    var maxW = W * (W < 700 ? 0.72 : 0.5);
    var big = Math.min(fitBig(ch.big, maxW), H * 0.27);
    var cx = W * 0.5 + (curX * 14);
    var baseY = H * (W < 700 ? 0.54 : 0.585);
    var rise = (1 - enter) * big * 0.35;

    ctx.save();
    ctx.translate(cx, baseY - big * 0.36 + rise);
    ctx.scale(grow, grow);
    ctx.globalAlpha = alpha;
    ctx.textBaseline = 'alphabetic';

    if (part === 'lines') {
    // thin line above
    var pre = Math.max(11, Math.min(big * 0.34, W * 0.04));
    ctx.font = '400 ' + pre + 'px "Clash Display","General Sans",system-ui,sans-serif';
    ctx.fillStyle = 'rgba(236,243,255,0.92)';
    ctx.shadowColor = 'rgba(5,10,24,0.55)'; ctx.shadowBlur = 18;
    spaced(ch.pre, 0, -big * 0.9, pre * 0.34, 'center');

    // human line below
    var post = Math.max(13, Math.min(big * 0.2, W * 0.026));
    ctx.font = 'italic 400 ' + post + 'px "Instrument Serif",Georgia,serif';
    ctx.shadowColor = 'rgba(4,8,20,0.9)'; ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(244,206,140,' + (1 * smooth(0.12, 0.4, t)).toFixed(3) + ')';
    ctx.textAlign = 'center';
    ctx.fillText(ch.post, 0, big * 0.34);
    } else {
    // giant word
    ctx.font = '700 ' + big + 'px "Clash Display","General Sans",system-ui,sans-serif';
    ctx.textAlign = 'center';
    var g = ctx.createLinearGradient(0, -big, 0, 0);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#f4f7ff'); g.addColorStop(1, '#cfe0ff');
    ctx.fillStyle = g;
    ctx.shadowColor = 'rgba(8,16,38,0.5)'; ctx.shadowBlur = big * 0.12;
    ctx.fillText(ch.big, 0, 0);
    ctx.shadowBlur = 0;

    }
    ctx.restore();
  }

  // ---- frame --------------------------------------------------------------------------------------------------------
  var api = {
    onReady: null, onSlow: null, onProgress: null,
    setProgress: function (p) { scrollP = clamp(p, 0, 1); targetProgress = Math.max(autoP, scrollP); render(performance.now()); },
    setPointer: function (x, y) { ptrX = clamp(x, -1, 1); ptrY = clamp(y, -1, 1); },
    resize: resize,
    start: function () { if (running) return; running = true; lastT = performance.now(); rafId = requestAnimationFrame(tick); },
    stop: function () { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; },
    dispose: function () { api.stop(); video.removeAttribute('src'); video.load(); }
  };

  function render(now) {
    if (!W || !H) return;
    var dt = clamp((now - lastT) / 1000, 0.001, 0.25);
    lastT = now;

    if (autoplay && readyFired && autoP < 1) {
      var e = (now - autoStart) / 1000 / INTRO_SECONDS;
      autoP = clamp(e, 0, 1);
      // Hand over to the visitor the moment they scroll; automatic flight never fights the scrollbar.
      if (scrollP > 0.002) autoplay = false;
    }
    targetProgress = Math.max(autoP, scrollP);
    var d = Math.abs(targetProgress - progress);
    progress += (targetProgress - progress) * (d > 0.12 ? 0.9 : 1 - Math.exp(-dt * 14));
    if (d < 0.0004) progress = targetProgress;
    var p = clamp(progress, 0, 1);
    effective = p;
    curX += (ptrX - curX) * 0.08; curY += (ptrY - curY) * 0.08;

    var src = source();
    var isVideo = src === video;
    var dur = isVideo && video.duration ? video.duration : 14.64;
    var vt = clamp(p / FLIGHT_END, 0, 1) * dur * DUR_FRAC;
    if (isVideo && video.readyState >= 1 && !video.seeking && Math.abs(vt - lastSeek) > 0.012) {
      lastSeek = vt;
      try { video.currentTime = vt; } catch (err) { /* noop */ }
    }
    var shownT = isVideo ? (video.seeking ? lastSeek : video.currentTime) : 0;

    ctx.fillStyle = '#0a1326';
    ctx.fillRect(0, 0, W, H);
    if (src) {
      var sw = isVideo ? video.videoWidth : poster.naturalWidth, sh = isVideo ? video.videoHeight : poster.naturalHeight;
      var s = Math.max(W / VW, H / VH) * 1.0;
      var ox = (W - VW * s) * 0.5, oy = (H - VH * s) * 0.5;
      var px = -curX * 6, py = -curY * 4;      // the plate shifts less than the text: depth between the layers
      var pushed = 1 + 0.03 * smooth(FLIGHT_END, 1, p);

      ctx.save();
      ctx.translate(W / 2 + px, H / 2 + py); ctx.scale(pushed, pushed); ctx.translate(-W / 2, -H / 2);
      ctx.drawImage(src, 0, 0, sw, sh, ox, oy, VW * s, VH * s);
      ctx.restore();

      // horizon bloom where the road meets the sky
      var bx = ox + VP_X * s, by = oy + VP_Y * s;
      var glow = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(W, H) * 0.38);
      glow.addColorStop(0, 'rgba(255,170,96,0.34)'); glow.addColorStop(0.35, 'rgba(255,128,92,0.12)'); glow.addColorStop(1, 'rgba(255,128,92,0)');
      ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H); ctx.restore();

      // chapters
      var anyText = false;
      for (var c = 0; c < CHAPTERS.length; c++) {
        var ch = CHAPTERS[c];
        if (p >= ch.at[0] - 0.01 && p <= ch.at[1] + 0.04) anyText = true;
        drawChapter(ch, p, s, 'word');
      }

      // towers redrawn over the words
      if (anyText) {
        ctx.save();
        ctx.beginPath();
        for (var i = 0; i < OCCLUDERS.length; i++) {
          var r = occluderRect(OCCLUDERS[i], shownT);
          var x0 = ox + r[0] * s, x1 = ox + r[1] * s, y0 = oy + r[2] * s, y1 = oy + 590 * s;
          ctx.rect(x0, Math.max(0, y0), x1 - x0, y1 - Math.max(0, y0));
        }
        ctx.clip();
        ctx.translate(W / 2 + px, H / 2 + py); ctx.scale(pushed, pushed); ctx.translate(-W / 2, -H / 2);
        ctx.drawImage(src, 0, 0, sw, sh, ox, oy, VW * s, VH * s);
        ctx.restore();
      }
      // thin lines stay legible on top of the towers; only the giant words pass behind them
      for (var c2 = 0; c2 < CHAPTERS.length; c2++) drawChapter(CHAPTERS[c2], p, s, 'lines');

      // end-of-flight veil: calm the plate so the logo reads
      var veil = smooth(FLIGHT_END - 0.06, 1, p) * 0.5;
      if (veil > 0.001) { ctx.fillStyle = 'rgba(6,12,28,' + veil.toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }
    }
    if (api.onProgress) api.onProgress(p, smooth(0.83, 0.97, p));
  }

  function tick(now) {
    if (!running) return;
    render(now);
    rafId = requestAnimationFrame(tick);
  }

  resize();
  return api;
}
