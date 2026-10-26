// SWK Properties — night-aerial hero: one continuous forward shot down Sheikh Zayed Road, driven only by scroll.
// (An intro auto-scroll in 40-hero.js plays it once on arrival; the visitor can take over at any moment.)
// The video is all-intra so any frame seeks instantly, in both directions. Giant words sit between the towers:
// the same frame is redrawn over them, clipped to the clock tower. The flight ends looking straight ahead and the
// logo/welcome are revealed in the DOM (.hero__reveal) through the --rv variable reported by onProgress.

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
function easeOut(t) { return 1 - Math.pow(1 - clamp(t, 0, 1), 3); }

var FLIGHT_END = 0.84;   // video reaches its last aerial frame here; the rest of the scroll is the logo reveal
var DUR_FRAC = 0.99;

// The clock tower the words wrap around: keyframes [t, x0, x1, yTop] in 1920x1080 source pixels.
var CLOCK = [[0, 1021, 1071, 150], [7, 1006, 1058, 130], [14.4, 998, 1054, 105]];
var VP_X = 918, VP_Y = 520;

// Each chapter: thin line, giant word, human line. `at` is the scroll/flight progress it lives in.
var CHAPTERS = [
  { at: [0.03, 0.27], pre: 'DISCOVER', big: ['DU', 'BAI'], post: 'One road. A thousand front doors.' },
  { at: [0.30, 0.55], pre: 'BEHIND EVERY WINDOW', big: ['A', 'PLAN'], post: 'A first key. A family. A better return.' },
  { at: [0.58, 0.82], pre: 'WHICH ONE', big: ['IS', 'YOURS?'], post: 'We’ll walk you there, honestly.' }
];

var DISPLAY = '"Clash Display","General Sans",system-ui,sans-serif';
var UI = '"General Sans",system-ui,sans-serif';

function clockRect(t) {
  var k = CLOCK, i = t < k[1][0] ? 0 : 1;
  var a = k[i], b = k[i + 1], u = clamp((t - a[0]) / (b[0] - a[0]), 0, 1);
  return [lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)];
}

export function createHeroScene(canvas, opts) {
  opts = opts || {};
  var mobile = !!opts.mobile;
  var ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('2D canvas context unavailable');

  // Mobile plays a portrait crop (x 742..1350 of the 1920x1080 source, tower centred) so the street fills the screen.
  var VW = mobile ? 608 : 1920, VH = 1080, CROP_X = mobile ? 742 : 0;

  var dpr = Math.min(window.devicePixelRatio || 1, mobile ? 2 : 1.75);
  var W = 0, H = 0;
  var target = 0, progress = 0, ptrX = 0, ptrY = 0, curX = 0, curY = 0;
  var running = false, rafId = 0, ready = false, lastT = 0, dirty = true;

  var poster = new Image();
  poster.onload = function () { dirty = true; };
  poster.src = '/assets/images/hero/dusk-poster' + (mobile ? '-640' : '') + '.webp';

  var video = document.createElement('video');
  video.muted = true; video.defaultMuted = true; video.playsInline = true; video.preload = 'auto';
  video.setAttribute('playsinline', ''); video.setAttribute('muted', '');
  video.src = mobile ? '/assets/video/szr-dusk-480.mp4' : '/assets/video/szr-dusk-720.mp4';
  video.addEventListener('loadeddata', function () {
    if (!ready) { ready = true; if (api.onReady) api.onReady(); }
    dirty = true;
  });
  video.addEventListener('seeked', function () { dirty = true; });
  video.load();

  function resize() {
    var r = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dirty = true;
  }

  function spaced(text, y, tracking) {
    var total = 0, i, w = [];
    for (i = 0; i < text.length; i++) { w[i] = ctx.measureText(text[i]).width; total += w[i] + tracking; }
    var x = -(total - tracking) / 2;
    for (i = 0; i < text.length; i++) { ctx.fillText(text[i], x, y); x += w[i] + tracking; }
  }

  var tower = { x: 0, half: 20 };       // clock-tower centre (canvas px, before the chapter's own scale) and half-width

  function chapterLayout(ch, p) {
    var a = ch.at[0], b = ch.at[1];
    if (p < a || p > b + 0.001) return null;
    var t = clamp((p - a) / (b - a), 0, 1);
    var alpha = easeOut(t / 0.2) * (1 - smooth(0.82, 1, t));
    if (alpha < 0.004) return null;
    ctx.font = '700 100px ' + DISPLAY;
    var wl = ctx.measureText(ch.big[0]).width, wr = ctx.measureText(ch.big[1]).width;
    var cx = W * 0.5 + curX * 12, grow = 1 + t * 0.18;
    var tx = (tower.x - cx) / grow, m = W * 0.08 / grow;
    var gap = tower.half / grow + 10;
    // each half must fit between the tower and its screen edge; the pair must not exceed ~half the screen
    var left = (W / 2 / grow + tx - gap - m), right = (W / 2 / grow - tx - gap - m);
    var big = Math.min(100 * left / wl, 100 * right / wr, 100 * (W * (W < 700 ? 0.9 : 0.6) / grow - 2 * gap) / (wl + wr), H * 0.26 / 1);
    return { t: t, alpha: alpha, big: big, grow: grow, tx: tx, gap: gap, rise: (1 - easeOut(t / 0.2)) * big * 0.3 };
  }

  function place(L) {
    ctx.translate(W * 0.5 + curX * 12, H * (W < 700 ? 0.37 : 0.54) + L.rise);
    ctx.scale(L.grow, L.grow);
    ctx.globalAlpha = L.alpha;
  }

  function drawWord(ch, L) {
    ctx.save(); place(L);
    ctx.font = '700 ' + L.big + 'px ' + DISPLAY; ctx.textBaseline = 'alphabetic';
    var g = ctx.createLinearGradient(0, -L.big * 0.8, 0, 0);
    g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#d9e6ff');
    ctx.fillStyle = g;
    ctx.textAlign = 'right'; ctx.fillText(ch.big[0], L.tx - L.gap, 0);
    ctx.textAlign = 'left'; ctx.fillText(ch.big[1], L.tx + L.gap, 0);
    ctx.restore();
  }

  function drawLines(ch, L) {
    ctx.save(); place(L);
    ctx.textBaseline = 'alphabetic';
    var pre = clamp(L.big * 0.2, 12, 30);
    ctx.font = '600 ' + pre + 'px ' + UI; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left';
    spaced(ch.pre, -L.big * 1.04, pre * 0.5);
    var post = clamp(L.big * 0.2, 14, 30);
    ctx.font = '500 ' + post + 'px ' + UI; ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,214,150,' + smooth(0.1, 0.4, L.t).toFixed(3) + ')';
    ctx.fillText(ch.post, 0, L.big * 0.36);
    ctx.restore();
  }

  function render(now) {
    var dt = clamp((now - (lastT || now)) / 1000, 0.001, 0.1);
    lastT = now;
    var d = target - progress;
    if (Math.abs(d) > 0.00005) { progress += d * (1 - Math.exp(-dt * 9)); dirty = true; if (Math.abs(target - progress) < 0.00005) progress = target; }
    if (Math.abs(ptrX - curX) > 0.001 || Math.abs(ptrY - curY) > 0.001) { curX += (ptrX - curX) * 0.08; curY += (ptrY - curY) * 0.08; dirty = true; }

    var p = clamp(progress, 0, 1);
    var haveVideo = video.readyState >= 2 && video.videoWidth > 0;
    var dur = haveVideo && video.duration ? video.duration : 14.64;
    var vt = clamp(p / FLIGHT_END, 0, 1) * dur * DUR_FRAC;
    if (haveVideo && !video.seeking && Math.abs(vt - video.currentTime) > 0.012) { try { video.currentTime = vt; } catch (e) { /* noop */ } }
    if (!dirty || !W) return;
    dirty = false;

    var src = haveVideo ? video : (poster.complete && poster.naturalWidth ? poster : null);
    if (!src) return;
    var sw = haveVideo ? video.videoWidth : poster.naturalWidth, sh = haveVideo ? video.videoHeight : poster.naturalHeight;
    var shownT = haveVideo ? video.currentTime : 0;

    var s = Math.max(W / VW, H / VH);
    var ox = (W - VW * s) / 2, oy = (H - VH * s) / 2;
    var push = 1 + 0.05 * smooth(0.55, 1, p);          // the shot keeps travelling forward through the end hold
    var px = -curX * 7, py = -curY * 5;

    function plate() {
      ctx.translate(W / 2 + px, H / 2 + py); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2);
      ctx.drawImage(src, 0, 0, sw, sh, ox, oy, VW * s, VH * s);
    }

    ctx.fillStyle = '#0a1326'; ctx.fillRect(0, 0, W, H);
    ctx.save(); plate(); ctx.restore();

    var r = clockRect(shownT);
    var pushx = function (x) { return W / 2 + px + (x - W / 2) * push; };
    tower.x = pushx(ox + ((r[0] + r[1]) / 2 - CROP_X) * s);
    tower.half = ((r[1] - r[0]) / 2) * s * push;

    // Layout of the chapter currently on screen (at most one, or two while crossing).
    var live = [];
    for (var c = 0; c < CHAPTERS.length; c++) { var L = chapterLayout(CHAPTERS[c], p); if (L) live.push([CHAPTERS[c], L]); }

    // soft pool of shade behind the words so white type stays readable on bright glass
    for (var i = 0; i < live.length; i++) {
      var L2 = live[i][1], sg = ctx.createRadialGradient(W / 2, H * 0.47, 0, W / 2, H * 0.47, Math.max(W * 0.5, 200));
      sg.addColorStop(0, 'rgba(6,12,28,' + (0.5 * L2.alpha).toFixed(3) + ')'); sg.addColorStop(1, 'rgba(6,12,28,0)');
      ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
    }
    for (i = 0; i < live.length; i++) drawWord(live[i][0], live[i][1]);

    for (i = 0; i < live.length; i++) drawLines(live[i][0], live[i][1]);

    // horizon bloom, then a calming veil toward the logo reveal
    var bx = ox + (VP_X - CROP_X) * s, by = oy + VP_Y * s;
    var glow = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(W, H) * 0.36);
    glow.addColorStop(0, 'rgba(255,170,96,0.3)'); glow.addColorStop(0.4, 'rgba(255,128,92,0.1)'); glow.addColorStop(1, 'rgba(255,128,92,0)');
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H); ctx.restore();
    var veil = smooth(FLIGHT_END - 0.06, 0.98, p) * 0.5;
    if (veil > 0.001) { ctx.fillStyle = 'rgba(6,12,28,' + veil.toFixed(3) + ')'; ctx.fillRect(0, 0, W, H); }

    if (api.onProgress) api.onProgress(p, smooth(0.83, 0.97, p));
  }

  function tick(now) {
    if (!running) return;
    render(now);
    rafId = requestAnimationFrame(tick);
  }

  var api = {
    onReady: null, onSlow: null, onProgress: null,
    setProgress: function (p) { target = clamp(p, 0, 1); },
    jump: function (p) { target = progress = clamp(p, 0, 1); dirty = true; },
    setPointer: function (x, y) { ptrX = clamp(x, -1, 1); ptrY = clamp(y, -1, 1); },
    resize: resize,
    start: function () { if (running) return; running = true; lastT = 0; dirty = true; rafId = requestAnimationFrame(tick); },
    stop: function () { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; },
    dispose: function () { api.stop(); video.removeAttribute('src'); video.load(); }
  };

  resize();
  return api;
}
