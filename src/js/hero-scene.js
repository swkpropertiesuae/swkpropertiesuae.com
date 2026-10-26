// SWK Properties — Ultra-HD Single-Shot Sheikh Zayed Road Real Aerial Video Engine
// Plays real 1080p HD aerial drone footage of Sheikh Zayed Road (szr-aerial-real.mp4) continuously
// across the entire scroll journey (p = 0.00 -> 1.00) at native HiDPI resolution, paired with
// scroll-driven corporate investment hooks and the SWK Properties flagship end-frame showcase.

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

// Draw the active video/poster source at native HiDPI resolution with high-quality bicubic sampling
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

// Subtle architectural telemetry HUD pill at bottom-right (clears SWK Concierge button)
function drawEarthHud(ctx, W, H, p, mobile) {
  if (mobile && W < 420) return;
  ctx.save();
  var alt = Math.round(lerp(680, 420, smootherstep(0, 0.75, p)));
  var phaseLabel =
    p < 0.16 ? 'SHEIKH ZAYED ROAD \u00b7 LIVE UHD AERIAL FOOTAGE' :
    p < 0.45 ? 'DUBAI PRIME CORRIDOR \u00b7 DIRECT DEVELOPER ACCESS' :
    p < 0.73 ? 'RERA ORN 51517 \u00b7 INSTITUTIONAL ADVISORY DESK' :
               'SWK PROPERTIES \u00b7 SHEIKH ZAYED ROAD, DUBAI';

  var padX = 14;
  var hudW = Math.min(W - 32, 376);
  var hudH = 34;
  var hx = Math.max(16, W - hudW - (mobile ? 16 : 108));
  var hy = H - hudH - (mobile ? 14 : 20);

  ctx.fillStyle = 'rgba(10, 18, 32, 0.78)';
  ctx.strokeStyle = 'rgba(217, 177, 90, 0.52)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(hx, hy, hudW, hudH, 17);
  } else {
    ctx.rect(hx, hy, hudW, hudH);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(hx + 15, hy + hudH * 0.5, 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 250, 240, 0.96)';
  ctx.font = '600 9.5px system-ui, -apple-system, sans-serif';
  ctx.fillText(phaseLabel, hx + 25, hy + 14);

  ctx.fillStyle = 'rgba(240, 198, 108, 0.92)';
  ctx.font = '500 8.5px monospace';
  var coords = '25\u00b012\'50.1"N 55\u00b016\'40.7"E \u00b7 ALT ' + alt + 'm \u00b7 LIVE E11 CORRIDOR \u00b7 ORN 51517';
  ctx.fillText(coords, hx + 25, hy + 26, hudW - padX * 2);

  ctx.restore();
}

export function createHeroScene(canvas, opts) {
  opts = opts || {};
  var mobile = !!opts.mobile;
  var ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('2D canvas context unavailable');

  // Full native HiDPI rendering (up to 3x DPR) for maximum sharpness and clarity
  var dpr = Math.min(window.devicePixelRatio || 1, 3);
  var W = 0, H = 0;
  var progress = 0;
  var targetProgress = 0;
  var ptrX = 0, ptrY = 0;
  var curPtrX = 0, curPtrY = 0;
  var running = false;
  var rafId = 0;
  var readyFired = false;
  var startTime = performance.now();
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

  // Dual-tier real aerial video: vidFast starts frame-1 playback in <150ms while vidHD (1920x1080 master)
  // loads in parallel and seamlessly takes over at full 1080p definition.
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
      if (vidHD.readyState >= 2 && activeVid !== vidHD) {
        try {
          if (vidFast.currentTime > 0) vidHD.currentTime = vidFast.currentTime;
        } catch (e) {}
        activeVid = vidHD;
        tryPlay(vidHD);
      }
      fireReady();
    };
    vidHD.addEventListener('loadeddata', onHDReady);
    vidHD.addEventListener('canplay', onHDReady);
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
    if (vidHD && vidHD.readyState >= 2 && vidHD.videoWidth > 0) {
      return { el: vidHD, w: vidHD.videoWidth, h: vidHD.videoHeight, t: vidHD.currentTime };
    }
    if (vidFast && vidFast.readyState >= 2 && vidFast.videoWidth > 0) {
      return { el: vidFast, w: vidFast.videoWidth, h: vidFast.videoHeight, t: vidFast.currentTime };
    }
    if (imgPoster.complete && imgPoster.naturalWidth > 0) {
      return { el: imgPoster, w: imgPoster.naturalWidth, h: imgPoster.naturalHeight, t: 0.0 };
    }
    return null;
  }

  function render(now) {
    if (!W || !H) return;
    var elapsed = (now - startTime) * 0.001;
    var dt = clamp((now - lastFrameTime) * 0.001, 0.001, 0.25);
    lastFrameTime = now;

    var dp = Math.abs(targetProgress - progress);
    var alphaP = dp > 0.08 ? 0.88 : (1 - Math.exp(-dt * 16));
    progress += (targetProgress - progress) * alphaP;
    if (Math.abs(targetProgress - progress) < 0.0005) progress = targetProgress;

    curPtrX += (ptrX - curPtrX) * 0.12;
    curPtrY += (ptrY - curPtrY) * 0.12;

    var p = clamp(progress, 0, 1);
    var vSrc = getVideoSource();

    var curVid = (vidHD && vidHD.readyState >= 2) ? vidHD : vidFast;
    if (curVid && curVid.readyState >= 2) {
      var scrollBoost = (now - lastScrollTime < 180) ? 1.18 : 1.0;
      if (Math.abs(curVid.playbackRate - scrollBoost) > 0.05) {
        curVid.playbackRate = scrollBoost;
      }
      if (running && curVid.paused) tryPlay(curVid);
    }

    ctx.fillStyle = '#0a1220';
    ctx.fillRect(0, 0, W, H);
    if (!vSrc) return;

    // Continuous native-definition aerial camera path over Sheikh Zayed Road (p = 0.00 -> 1.00)
    // Keeps camScale in [1.00, 1.20] so the 1920x1080 drone footage remains 100% razor-sharp!
    var t1 = smootherstep(0.00, 0.38, p);
    var t2 = smootherstep(0.38, 0.72, p);
    var t3 = smootherstep(0.72, 1.00, p);

    var camX = lerp(0.500, 0.486, t1);
    var camY = lerp(0.475, 0.548, t1);
    var camScale = lerp(1.00, 1.16, t1);

    camX = lerp(camX, 0.508, t2);
    camY = lerp(camY, 0.505, t2);
    camScale = lerp(camScale, 1.20, t2);

    // At the end frame (p = 0.72 -> 1.00), settle into a majestic wide aerial sweep of Sheikh Zayed Road
    // playing live behind the SWK Properties Corporate End-Frame Showcase
    camX = lerp(camX, 0.495 + Math.sin(elapsed * 0.35) * 0.006, t3);
    camY = lerp(camY, 0.510 + Math.cos(elapsed * 0.28) * 0.005, t3);
    camScale = lerp(camScale, 1.10, t3);

    camX += curPtrX * 0.010;
    camY -= curPtrY * 0.008;

    // Draw the live Sheikh Zayed Road aerial video with high-quality sampling
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
    drawCameraLayer(ctx, vSrc.el, vSrc.w, vSrc.h, W, H, camX, camY, camScale);

    // Subtle cinema contrast framing during scroll hook chapters & corporate end frame (p > 0.14)
    // Leaves the live moving vehicles on Sheikh Zayed Road clearly visible while making the
    // foreground hook typography and SWK Properties end-frame lockup pop with maximum clarity.
    var hookShade = smoothstep(0.14, 0.26, p);
    var endShade = smoothstep(0.70, 0.84, p);
    if (hookShade > 0.01) {
      ctx.save();
      var grad = ctx.createRadialGradient(
        W * 0.5, H * 0.5, Math.min(W, H) * 0.12,
        W * 0.5, H * 0.5, Math.max(W, H) * 0.72
      );
      var centerA = lerp(0.18, 0.34, endShade) * hookShade;
      var edgeA = lerp(0.38, 0.56, endShade) * hookShade;
      grad.addColorStop(0, 'rgba(8, 16, 30, ' + centerA.toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(6, 12, 24, ' + edgeA.toFixed(3) + ')');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // Draw live Sheikh Zayed Road telemetry HUD pill
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
      render(lastScrollTime);
    },
    setPointer: function (x, y) {
      ptrX = clamp(x, -1, 1);
      ptrY = clamp(y, -1, 1);
    },
    resize: resize,
    start: function () {
      if (running) return;
      running = true;
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
