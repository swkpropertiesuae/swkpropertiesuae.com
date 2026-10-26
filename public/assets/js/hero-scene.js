// SWK Properties — Glitch-Free Ultra-HD Sheikh Zayed Road Real Aerial Video Engine
// Plays a continuous, seamless 20-second 1080p HD single-shot drone flight along Sheikh Zayed Road
// with zero H.264 decoder seek-stutters, monotonic silk-smooth optical camera travel, and smooth
// scroll-coupled playback acceleration.

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(a, b, x) {
  var t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}
function smootherstep(a, b, x) {
  var t = clamp((x - a) / (b - a), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function drawCameraLayer(ctx, source, srcW, srcH, W, H, camX, camY, camScale) {
  if (!source || !srcW || !srcH) return;
  var cAspect = W / H;
  var sAspect = srcW / srcH;
  var baseW = srcW, baseH = srcH;
  if (cAspect > sAspect) {
    baseH = srcW / cAspect;
  } else {
    baseW = srcH * cAspect;
  }
  var viewW = baseW / camScale;
  var viewH = baseH / camScale;
  var sx = camX * srcW - viewW * 0.5;
  var sy = camY * srcH - viewH * 0.5;
  sx = clamp(sx, 0, Math.max(0, srcW - viewW));
  sy = clamp(sy, 0, Math.max(0, srcH - viewH));
  ctx.drawImage(source, sx, sy, viewW, viewH, 0, 0, W, H);
}

function drawEarthHud(ctx, W, H, p, mobile) {
  if (mobile && W < 480) return;
  ctx.save();
  var alt = Math.round(lerp(680, 410, smootherstep(0, 1.0, p)));
  var hx = Math.max(24, W - (mobile ? 18 : 112));
  var hy = H - (mobile ? 16 : 24);

  ctx.textAlign = 'right';
  ctx.shadowColor = 'rgba(2, 8, 20, 0.9)';
  ctx.shadowBlur = 10;

  ctx.fillStyle = 'rgba(246, 212, 138, 0.78)';
  ctx.font = '500 9px "General Sans", system-ui, sans-serif';
  var coords = '25\u00b012\'50.1"N 55\u00b016\'40.7"E \u00b7 ALT ' + alt + 'm \u00b7 SHEIKH ZAYED ROAD \u00b7 ORN 51517';
  ctx.fillText(coords, hx, hy);
  ctx.restore();
}

export function createHeroScene(canvas, opts) {
  opts = opts || {};
  var mobile = !!opts.mobile;
  var ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('2D canvas context unavailable');

  var dpr = Math.min(window.devicePixelRatio || 1, 3);
  var W = 0, H = 0;
  var progress = 0;
  var targetProgress = 0;
  var ptrX = 0, ptrY = 0;
  var curPtrX = 0, curPtrY = 0;
  var curRate = 1.0;
  var running = false;
  var rafId = 0;
  var readyFired = false;
  var lastScrollTime = 0;
  var lastFrameTime = performance.now();

  var sfx = mobile ? '-640.webp' : '.webp';
  var imgPoster = new Image();
  imgPoster.decoding = 'async';

  function makeVideo(src) {
    var v = document.createElement('video');
    v.src = src;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('muted', '');
    v.preload = 'auto';
    v.loop = true;
    return v;
  }

  var vidFast = makeVideo('/assets/video/szr-aerial-fast.mp4');
  var vidHD = mobile ? null : makeVideo('/assets/video/szr-aerial-real.mp4');
  var activeVid = null;

  function fireReady() {
    if (readyFired) return;
    readyFired = true;
    if (typeof api.onReady === 'function') api.onReady();
  }

  function tryPlay(v) {
    if (!v) return;
    var p = v.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  var onFastReady = function () {
    if (activeVid !== vidHD) {
      activeVid = vidFast;
      tryPlay(vidFast);
    }
    fireReady();
  };
  vidFast.addEventListener('loadeddata', onFastReady);
  vidFast.addEventListener('canplay', onFastReady);

  if (vidHD) {
    var onHDReady = function () {
      if (vidHD.readyState >= 3 && activeVid !== vidHD) {
        activeVid = vidHD;
        tryPlay(vidHD);
      }
      fireReady();
    };
    vidHD.addEventListener('canplaythrough', onHDReady);
  }

  imgPoster.onload = function () { fireReady(); };
  imgPoster.src = '/assets/images/hero/earth-top-szr' + sfx;

  vidFast.load();
  if (vidHD) vidHD.load();

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var cw = Math.max(1, Math.round(rect.width));
    var ch = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    W = cw;
    H = ch;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
    render(performance.now());
  }

  function getVideoSource() {
    if (activeVid === vidHD && vidHD && vidHD.readyState >= 2 && vidHD.videoWidth > 0) {
      return { el: vidHD, w: vidHD.videoWidth, h: vidHD.videoHeight };
    }
    if (vidFast && vidFast.readyState >= 2 && vidFast.videoWidth > 0) {
      return { el: vidFast, w: vidFast.videoWidth, h: vidFast.videoHeight };
    }
    if (vidHD && vidHD.readyState >= 2 && vidHD.videoWidth > 0) {
      return { el: vidHD, w: vidHD.videoWidth, h: vidHD.videoHeight };
    }
    if (imgPoster.complete && imgPoster.naturalWidth > 0) {
      return { el: imgPoster, w: imgPoster.naturalWidth, h: imgPoster.naturalHeight };
    }
    return null;
  }

  function render(now) {
    if (!W || !H) return;
    var dt = clamp((now - lastFrameTime) * 0.001, 0.001, 0.1);
    lastFrameTime = now;

    // Smooth exponential damping on scroll progress (zero jump cuts)
    var alphaP = 1 - Math.exp(-dt * 12);
    progress += (targetProgress - progress) * alphaP;
    if (Math.abs(targetProgress - progress) < 0.0002) progress = targetProgress;

    curPtrX += (ptrX - curPtrX) * 0.10;
    curPtrY += (ptrY - curPtrY) * 0.10;

    var p = clamp(progress, 0, 1);
    var vSrc = getVideoSource();

    // Smoothly modulate playbackRate during active scroll (1.0x -> 1.85x) without seeking
    var curVid = (activeVid === vidHD && vidHD) ? vidHD : vidFast;
    if (curVid && curVid.readyState >= 2) {
      var targetRate = (now - lastScrollTime < 220) ? 1.85 : 1.0;
      curRate += (targetRate - curRate) * 0.15;
      if (Math.abs(curVid.playbackRate - curRate) > 0.04) {
        curVid.playbackRate = clamp(curRate, 1.0, 2.0);
      }
      if (running && curVid.paused) tryPlay(curVid);
    }

    ctx.fillStyle = '#070d18';
    ctx.fillRect(0, 0, W, H);
    if (!vSrc) return;

    // Single monotonic, silk-smooth forward camera glide across p = 0.00 -> 1.00
    var tFlight = smootherstep(0.00, 1.00, p);
    var camX = lerp(0.500, 0.492, tFlight) + curPtrX * 0.008;
    var camY = lerp(0.415, 0.565, tFlight) - curPtrY * 0.006;
    var camScale = lerp(1.00, 1.26, tFlight);

    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
    drawCameraLayer(ctx, vSrc.el, vSrc.w, vSrc.h, W, H, camX, camY, camScale);

    // 1. Crisp Prussian-Sapphire twilight sky & architectural contrast (keeps towers & highway luminous)
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    var skyTone = ctx.createLinearGradient(0, 0, 0, H);
    skyTone.addColorStop(0.00, '#3a6696');
    skyTone.addColorStop(0.45, '#5882ad');
    skyTone.addColorStop(0.75, '#7a9ec2');
    skyTone.addColorStop(1.00, '#8aa8c4');
    ctx.fillStyle = skyTone;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // 2. Warm golden-amber Sheikh Zayed Road highway light bloom + cyan skyline glass highlights
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    var vpX = W * 0.495;
    var vpY = H * lerp(0.55, 0.48, tFlight);
    var roadGlow = ctx.createRadialGradient(vpX, vpY, 0, vpX, vpY, Math.max(W, H) * 0.50);
    roadGlow.addColorStop(0.00, 'rgba(255, 174, 82, 0.38)');
    roadGlow.addColorStop(0.28, 'rgba(255, 134, 54, 0.18)');
    roadGlow.addColorStop(0.65, 'rgba(28, 168, 236, 0.12)');
    roadGlow.addColorStop(1.00, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = roadGlow;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // 3. Subtle atmospheric horizon veil (zero box — keeps video vivid while anchoring pure white bold type)
    var hookShade = smoothstep(0.10, 0.22, p);
    var endShade = smoothstep(0.68, 0.84, p);
    ctx.save();
    var atmo = ctx.createLinearGradient(0, 0, 0, H);
    var topA = lerp(0.24, 0.34, hookShade);
    var midA = lerp(0.16, lerp(0.26, 0.36, endShade), hookShade);
    var botA = lerp(0.22, 0.34, endShade);
    atmo.addColorStop(0.00, 'rgba(3, 14, 30, ' + topA.toFixed(3) + ')');
    atmo.addColorStop(0.45, 'rgba(4, 18, 38, ' + midA.toFixed(3) + ')');
    atmo.addColorStop(0.68, 'rgba(4, 18, 38, ' + (midA * 1.05).toFixed(3) + ')');
    atmo.addColorStop(1.00, 'rgba(3, 12, 26, ' + botA.toFixed(3) + ')');
    ctx.fillStyle = atmo;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    drawEarthHud(ctx, W, H, p, mobile);
  }

  function tick(now) {
    if (!running) return;
    render(now);
    rafId = requestAnimationFrame(tick);
  }

  var api = {
    onReady: null,
    onSlow: null,
    setProgress: function (p) {
      targetProgress = clamp(p, 0, 1);
      lastScrollTime = performance.now();
      if (!running) render(lastScrollTime);
    },
    setPointer: function (x, y) {
      ptrX = clamp(x, -1, 1);
      ptrY = clamp(y, -1, 1);
    },
    resize: resize,
    start: function () {
      if (running) return;
      running = true;
      lastFrameTime = performance.now();
      tryPlay(activeVid || vidFast);
      rafId = requestAnimationFrame(tick);
    },
    stop: function () {
      running = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      if (vidFast && !vidFast.paused) vidFast.pause();
      if (vidHD && !vidHD.paused) vidHD.pause();
    },
    dispose: function () {
      api.stop();
    }
  };

  resize();
  return api;
}
