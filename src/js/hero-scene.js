// SWK Properties — Ultra-HD Extended 3-Act Sheikh Zayed Road Real Aerial Video Engine
// Plays an extended ~35.5-second 1080p HD real drone flight along Sheikh Zayed Road:
//   Act I   (p = 0.00 -> 0.34): Low-altitude forward flight over Sheikh Zayed Road highway & Metro viaduct
//   Act II  (p = 0.34 -> 0.68): Ascending climb through the Sheikh Zayed Road skyscraper canyon (Al Saqr & Al Yaqoub)
//   Act III (p = 0.68 -> 1.00): High-altitude sweep across the Financial Centre Interchange revealing Burj Khalifa & Downtown
// Coupled with scroll-driven timeline progression, dynamic aerial camera travel, corporate investment hooks,
// and the SWK Properties flagship end-frame showcase.

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

// Draw the active video/poster source at native HiDPI resolution with optional subtle aerial banking
function drawCameraLayer(ctx, source, srcW, srcH, W, H, camX, camY, camScale, bankRad) {
  if (!source || !srcW || !srcH) return;
  var cAspect = W / H;
  var sAspect = srcW / srcH;
  var baseW = srcW, baseH = srcH;
  if (cAspect > sAspect) {
    baseH = srcW / cAspect;
  } else {
    baseW = srcH * cAspect;
  }
  var extraScale = bankRad && Math.abs(bankRad) > 0.001 ? 1.045 : 1.0;
  var effScale = camScale * extraScale;
  var viewW = baseW / effScale;
  var viewH = baseH / effScale;
  var sx = camX * srcW - viewW * 0.5;
  var sy = camY * srcH - viewH * 0.5;
  sx = clamp(sx, 0, Math.max(0, srcW - viewW));
  sy = clamp(sy, 0, Math.max(0, srcH - viewH));

  if (bankRad && Math.abs(bankRad) > 0.0005) {
    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.rotate(bankRad);
    ctx.drawImage(source, sx, sy, viewW, viewH, -W * 0.5, -H * 0.5, W, H);
    ctx.restore();
  } else {
    ctx.drawImage(source, sx, sy, viewW, viewH, 0, 0, W, H);
  }
}

// Architectural telemetry HUD pill at bottom-right (clears SWK Concierge button)
function drawEarthHud(ctx, W, H, p, mobile) {
  if (mobile && W < 420) return;
  ctx.save();
  var alt = Math.round(lerp(280, 740, smootherstep(0, 0.92, p)));
  var phaseLabel =
    p < 0.16 ? 'ACT I \u00b7 SHEIKH ZAYED ROAD E11 EXPRESSWAY FLIGHT' :
    p < 0.45 ? 'ACT II \u00b7 FINANCIAL CENTRE SKYSCRAPER CANYON ASCENT' :
    p < 0.72 ? 'ACT III \u00b7 DOWNTOWN & BURJ KHALIFA INTERCHANGE SWEEP' :
               'SWK PROPERTIES \u00b7 SHEIKH ZAYED ROAD, DUBAI';

  var padX = 14;
  var hudW = Math.min(W - 32, 396);
  var hudH = 34;
  var hx = Math.max(16, W - hudW - (mobile ? 16 : 108));
  var hy = H - hudH - (mobile ? 14 : 20);

  ctx.fillStyle = 'rgba(7, 13, 24, 0.82)';
  ctx.strokeStyle = 'rgba(217, 177, 90, 0.55)';
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
  var coords = '25\u00b012\'50.1"N 55\u00b016\'40.7"E \u00b7 ALT ' + alt + 'm \u00b7 SCROLL FLIGHT ' + Math.round(p * 100) + '%';
  ctx.fillText(coords, hx + 25, hy + 26, hudW - padX * 2);

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
  var lastSyncedProgress = 0;
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

  function syncVideoToScroll(v, pVal, force) {
    if (!v || v.readyState < 2 || !v.duration || !isFinite(v.duration)) return;
    var dur = v.duration;
    // Map scroll p in [0, 1] across the 3-act 35.5s aerial video so scrolling visibly flies
    // from Act I (highway) -> Act II (skyscraper canyon ascent) -> Act III (Burj Khalifa & Downtown panorama)
    var winStart = clamp(pVal * (dur * 0.74), 0, Math.max(0, dur - 4.0));
    var winEnd = Math.min(dur - 0.4, winStart + Math.max(4.5, dur * 0.24));
    if (force || v.currentTime < winStart - 0.6 || v.currentTime > winEnd + 0.6) {
      try {
        v.currentTime = winStart + 0.35;
      } catch (e) {}
    }
  }

  var onFastReady = function () {
    if (activeVid !== vidHD) {
      activeVid = vidFast;
      syncVideoToScroll(vidFast, targetProgress, true);
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
          else syncVideoToScroll(vidHD, targetProgress, true);
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
    if (vidHD && vidHD.readyState >= 2 && vidHD.videoWidth > 0 && !vidHD.seeking) {
      return { el: vidHD, w: vidHD.videoWidth, h: vidHD.videoHeight, t: vidHD.currentTime };
    }
    if (vidFast && vidFast.readyState >= 2 && vidFast.videoWidth > 0) {
      return { el: vidFast, w: vidFast.videoWidth, h: vidFast.videoHeight, t: vidFast.currentTime };
    }
    if (vidHD && vidHD.readyState >= 2 && vidHD.videoWidth > 0) {
      return { el: vidHD, w: vidHD.videoWidth, h: vidHD.videoHeight, t: vidHD.currentTime };
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
    var curVid = (vidHD && vidHD.readyState >= 2) ? vidHD : vidFast;

    // Couple scroll progress with the extended 35.5-second 3-act drone timeline
    if (curVid && curVid.readyState >= 2) {
      if (Math.abs(p - lastSyncedProgress) > 0.045) {
        lastSyncedProgress = p;
        syncVideoToScroll(vidFast, p, false);
        if (vidHD && vidHD.readyState >= 2) syncVideoToScroll(vidHD, p, false);
      } else {
        // Keep looping smoothly within the current scroll act's window when idle
        syncVideoToScroll(curVid, p, false);
      }
      var isScrolling = (now - lastScrollTime < 260);
      var scrollBoost = isScrolling ? 2.25 : 1.0;
      if (Math.abs(curVid.playbackRate - scrollBoost) > 0.05) {
        curVid.playbackRate = scrollBoost;
      }
      if (running && curVid.paused) tryPlay(curVid);
    }

    var vSrc = getVideoSource();
    ctx.fillStyle = '#070d18';
    ctx.fillRect(0, 0, W, H);
    if (!vSrc) return;

    // Expressive 3-act aerial camera choreography across p = 0.00 -> 1.00
    var t1 = smootherstep(0.00, 0.36, p);
    var t2 = smootherstep(0.36, 0.70, p);
    var t3 = smootherstep(0.70, 1.00, p);

    // Act I -> Act II -> Act III camera framing & forward push
    var camX = lerp(0.500, 0.455, t1);
    var camY = lerp(0.450, 0.575, t1);
    var camScale = lerp(1.01, 1.24, t1);

    camX = lerp(camX, 0.545, t2);
    camY = lerp(camY, 0.435, t2);
    camScale = lerp(camScale, 1.28, t2);

    // Act III (End Frame): Wide panoramic reveal of Burj Khalifa, Emaar Square & Sheikh Zayed Road Interchange
    camX = lerp(camX, 0.485 + Math.sin(elapsed * 0.38) * 0.008, t3);
    camY = lerp(camY, 0.475 + Math.cos(elapsed * 0.30) * 0.006, t3);
    camScale = lerp(camScale, 1.08, t3);

    camX += curPtrX * 0.012;
    camY -= curPtrY * 0.010;

    // Subtle helicopter banking roll during the mid-scroll ascent
    var bankRad = Math.sin(p * Math.PI * 2.0) * 0.018 * smoothstep(0.05, 0.25, p) * (1 - smoothstep(0.78, 0.95, p));

    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
    drawCameraLayer(ctx, vSrc.el, vSrc.w, vSrc.h, W, H, camX, camY, camScale, bankRad);

    // Cinema contrast vignette during scroll hook chapters & corporate end frame
    var hookShade = smoothstep(0.13, 0.25, p);
    var endShade = smoothstep(0.68, 0.84, p);
    if (hookShade > 0.01) {
      ctx.save();
      var grad = ctx.createRadialGradient(
        W * 0.5, H * 0.5, Math.min(W, H) * 0.10,
        W * 0.5, H * 0.5, Math.max(W, H) * 0.72
      );
      var centerA = lerp(0.16, 0.30, endShade) * hookShade;
      var edgeA = lerp(0.36, 0.54, endShade) * hookShade;
      grad.addColorStop(0, 'rgba(6, 12, 24, ' + centerA.toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(4, 9, 18, ' + edgeA.toFixed(3) + ')');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

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
