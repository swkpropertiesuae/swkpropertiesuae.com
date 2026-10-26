// SWK Properties — idle aerial loop -> live Sheikh Zayed Road traffic -> Al Saqr Business Tower (25th Floor) -> SWK Office
// While the page is idle a seamless 3.2s loop of Sheikh Zayed Road traffic (szr-idle-loop.mp4) plays as a fixed shot.
// The first scroll tick dissolves (scroll-linked, no timers) into the real drone footage, which starts at 0.8s:
//   p = 0.00 -> 0.40 : High-altitude Google Earth Studio aerial view of Sheikh Zayed Road zooming continuously down
//                      into real HD drone footage of vehicles moving along the 12-lane highway (no synthetic 2D cars).
//   p = 0.40 -> 0.68 : Camera sweeps up from the moving vehicles on Sheikh Zayed Road and zooms directly onto the
//                      25th floor of Al Saqr Business Tower alongside the highway.
//   p = 0.68 -> 1.00 : Camera flies physically through the 25th-floor glass window frame (limestone columns and mullions
//                      pass around the camera lens) straight into SWK Properties' 25th-floor executive office, with live
//                      Sheikh Zayed Road traffic continuing to move outside the panoramic 25th-floor windows.

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

// Vanishing point of the real Sheikh Zayed Road drone flight (szr-aerial-real.mp4)
var VID_VX = 0.478;
var VID_VY = 0.482;
// Base normalized coordinates of the 25th-floor bay on the tower at t = 0.2s
var TOWER_X0 = 0.684;
var TOWER_Y0 = 0.258;

// Computes the exact sub-pixel position of the 25th-floor bay in the live video at timestamp t
function getTowerTrack(vidTime) {
  var t = clamp(vidTime || 0, 0, 14.5);
  var radial = 1 + 0.0235 * t;
  return {
    x: VID_VX + (TOWER_X0 - VID_VX) * radial,
    y: VID_VY + (TOWER_Y0 - VID_VY) * radial,
    s: radial
  };
}

// Compute source crop / destination rect for drawing an image/video of aspect srcAspect
// into canvas (W, H) when the virtual camera is centered at normalized (camX, camY) with zoom camScale.
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

// Subtle Google Earth Studio 3D coordinate grid & compass overlay on the opening high-aerial view
function drawEarthAerialGrid(ctx, W, H, alpha, camX, camY, camScale) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.28;
  ctx.strokeStyle = 'rgba(217, 177, 90, 0.55)';
  ctx.lineWidth = 1;

  // Perspective highway corridor guide lines converging toward the horizon vanishing point
  var vx = (0.5 + (VID_VX - camX) * camScale) * W;
  var vy = (0.5 + (VID_VY - camY) * camScale) * H;
  var rays = [-0.65, -0.32, -0.12, 0.12, 0.35, 0.68];
  for (var i = 0; i < rays.length; i++) {
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + rays[i] * W * 1.1, H * 1.05);
    ctx.stroke();
  }
  ctx.restore();
}

// Google Earth Studio 3D Target Reticle & Callout locked onto Al Saqr Business Tower — 25th Floor
function drawTowerCallout(ctx, W, H, px, py, alpha, subtitle, floorLabel) {
  if (alpha <= 0.01) return;
  if (px < -100 || px > W + 100 || py < -100 || py > H + 100) return;
  ctx.save();
  ctx.globalAlpha = clamp(alpha, 0, 1);

  var r = 13;
  ctx.strokeStyle = 'rgba(246, 212, 138, 0.96)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(px, py, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#f6d48a';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(px - r - 5, py); ctx.lineTo(px - r + 3, py);
  ctx.moveTo(px + r - 3, py); ctx.lineTo(px + r + 5, py);
  ctx.moveTo(px, py - r - 5); ctx.lineTo(px, py - r + 3);
  ctx.moveTo(px, py + r - 3); ctx.lineTo(px, py + r + 5);
  ctx.stroke();

  var flipLeft = px > W * 0.66;
  var lx = flipLeft ? px - 26 : px + 26;
  var ly = Math.max(88, py - 24);
  var boxW = 248;
  var boxH = 40;
  var bx = flipLeft ? lx - boxW : lx;

  ctx.beginPath();
  ctx.moveTo(px + (flipLeft ? -r * 0.7 : r * 0.7), py - r * 0.7);
  ctx.lineTo(lx, ly);
  ctx.stroke();

  ctx.fillStyle = 'rgba(12, 20, 34, 0.86)';
  ctx.strokeStyle = 'rgba(217, 177, 90, 0.82)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(bx, ly - boxH * 0.5, boxW, boxH, 7);
  } else {
    ctx.rect(bx, ly - boxH * 0.5, boxW, boxH);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f6d48a';
  ctx.font = '600 10.5px system-ui, -apple-system, sans-serif';
  ctx.fillText(floorLabel || 'AL SAQR BUSINESS TOWER \u00b7 25TH FLOOR', bx + 11, ly - 4);
  ctx.fillStyle = 'rgba(255, 250, 240, 0.90)';
  ctx.font = '500 9px system-ui, -apple-system, sans-serif';
  ctx.fillText(subtitle || 'SWK PROPERTIES HQ \u00b7 SHEIKH ZAYED ROAD', bx + 11, ly + 10);

  ctx.restore();
}


var REAL_START = 0.8;      // real drone footage always starts here when scrolling begins
var IDLE_TO_REAL = 0.10;   // scroll progress over which the idle loop dissolves into the real footage

export function createHeroScene(canvas, opts) {
  opts = opts || {};
  var mobile = !!opts.mobile;
  var ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('2D canvas context unavailable');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  var dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
  var W = 0, H = 0;
  var progress = 0;
  var targetProgress = 0;
  var ptrX = 0, ptrY = 0;
  var curPtrX = 0, curPtrY = 0;
  var running = false;
  var rafId = 0;
  var readyFired = false;
  var startTime = performance.now();
  var realPlaying = false;

  var sfx = mobile ? '-640.webp' : '.webp';
  var imgPoster = new Image();
  var imgMullions = new Image();
  var imgOffice = new Image();
  imgPoster.decoding = 'async';
  imgMullions.decoding = 'async';
  imgOffice.decoding = 'async';

  function makeVideo(src, loop) {
    var v = document.createElement('video');
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('muted', '');
    v.preload = 'auto';
    v.loop = !!loop;
    v.src = src;
    return v;
  }

  // Idle shot: a baked seamless loop, so there is no seek, stall or cross-dissolve at the loop point.
  var vidIdle = makeVideo('/assets/video/szr-idle-loop.mp4', true);
  // Real footage is fetched once the idle shot is on screen, so the first paint is never competing for bandwidth.
  var vidReal = null;
  var realSrc = mobile ? '/assets/video/szr-aerial-mid.mp4' : '/assets/video/szr-aerial-real.mp4';

  function fireReady() {
    if (readyFired) return;
    readyFired = true;
    if (typeof api.onReady === 'function') api.onReady();
  }

  function tryPlay(v) {
    if (!v) return;
    var pr = v.play();
    if (pr && typeof pr.catch === 'function') pr.catch(function () {});
  }

  function parkReal() {
    if (!vidReal) return;
    realPlaying = false;
    if (!vidReal.paused) vidReal.pause();
    try { if (Math.abs(vidReal.currentTime - REAL_START) > 0.05) vidReal.currentTime = REAL_START; } catch (e) {}
  }

  function loadReal() {
    if (vidReal) return;
    vidReal = makeVideo(realSrc, false);
    vidReal.addEventListener('loadedmetadata', function () { parkReal(); });
    vidReal.load();
  }

  vidIdle.addEventListener('loadeddata', function () {
    tryPlay(vidIdle);
    fireReady();
    loadReal();
  });
  imgPoster.onload = function () { fireReady(); };
  imgPoster.src = '/assets/images/hero/szr-idle-frame.webp';
  imgMullions.src = '/assets/images/hero/alsaqr-25th-mullions' + sfx;
  imgOffice.src = '/assets/images/hero/swk-office-alsaqr' + sfx;
  vidIdle.load();

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var cw = Math.max(1, Math.round(rect.width));
    var ch = Math.max(1, Math.round(rect.height));
    W = cw;
    H = ch;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    render(performance.now());
  }

  function videoReady(v) { return v && v.readyState >= 2 && v.videoWidth > 0 && !v.seeking; }

  var lastFrameTime = performance.now();

  function render(now) {
    if (!W || !H) return;
    var elapsed = (now - startTime) * 0.001;
    var dt = clamp((now - lastFrameTime) * 0.001, 0.001, 0.25);
    lastFrameTime = now;

    // Frame-rate-independent camera damping (snaps cleanly on large scroll jumps)
    var dp = Math.abs(targetProgress - progress);
    var alphaP = dp > 0.08 ? 0.88 : (1 - Math.exp(-dt * 16));
    progress += (targetProgress - progress) * alphaP;
    if (Math.abs(targetProgress - progress) < 0.0005) progress = targetProgress;

    curPtrX += (ptrX - curPtrX) * 0.12;
    curPtrY += (ptrY - curPtrY) * 0.12;

    var p = clamp(progress, 0, 1);

    // Idle loop -> real footage hand-off is driven purely by scroll progress.
    var mixReal = smoothstep(0, IDLE_TO_REAL, p);
    var realReady = videoReady(vidReal);

    if (vidReal) {
      if (p > 0.0008) {
        if (!realPlaying && running) { realPlaying = true; tryPlay(vidReal); }
        if (vidReal.currentTime > 14.2) { try { vidReal.currentTime = REAL_START; } catch (e) {} }
        // Slow slightly as the drone hovers at the 25th floor
        var rate = clamp(lerp(1.0, 0.65, smoothstep(0.45, 0.75, p)), 0.5, 1.5);
        if (Math.abs(vidReal.playbackRate - rate) > 0.05) vidReal.playbackRate = rate;
      } else if (realPlaying && mixReal === 0) {
        parkReal();
      }
    }
    if (running) {
      var idleNeeded = mixReal < 1 || !realReady;
      if (idleNeeded && vidIdle.paused) tryPlay(vidIdle);
      else if (!idleNeeded && !vidIdle.paused) vidIdle.pause();
    }

    ctx.fillStyle = '#0f1826';
    ctx.fillRect(0, 0, W, H);

    var idleOK = videoReady(vidIdle);
    var showReal = realReady && mixReal > 0;
    var realAlpha = showReal ? mixReal : 0;

    // 1. Idle shot: fixed camera, tiny pointer parallax only.
    if (realAlpha < 1) {
      var ix = 0.5 + curPtrX * 0.004, iy = 0.5 - curPtrY * 0.003;
      if (idleOK) drawCameraLayer(ctx, vidIdle, vidIdle.videoWidth, vidIdle.videoHeight, W, H, ix, iy, 1.02);
      else if (imgPoster.complete && imgPoster.naturalWidth > 0) drawCameraLayer(ctx, imgPoster, imgPoster.naturalWidth, imgPoster.naturalHeight, W, H, ix, iy, 1.02);
    }
    if (!showReal) return;

    var vSrc = { el: vidReal, w: vidReal.videoWidth, h: vidReal.videoHeight, t: vidReal.currentTime };
    var track = getTowerTrack(vSrc.t);

    // =========================================================================
    // SINGLE CONTINUOUS CAMERA TRAJECTORY (p = 0.00 -> 1.00) on the real footage
    //   Phase A (p = 0.00 -> 0.35): Aerial view -> Close-up of real moving vehicles on Sheikh Zayed Road
    //   Phase B (p = 0.35 -> 0.60): Highway vehicles -> Panning & zooming up to Al Saqr Business Tower (25th Floor)
    //   Phase C (p = 0.60 -> 1.00): Flying physically through the 25th-floor window into SWK Properties' office
    // =========================================================================
    var tDive = smootherstep(0.00, 0.35, p);
    var tTower = smootherstep(0.35, 0.60, p);

    var highwayX = 0.482;
    var highwayY = 0.635;
    var highwayScale = 1.65;

    var camX = lerp(0.500, highwayX, tDive);
    var camY = lerp(0.455, highwayY, tDive);
    var camScale = lerp(1.00, highwayScale, tDive);

    camX = lerp(camX, track.x, tTower);
    camY = lerp(camY, track.y, tTower);
    camScale = lerp(camScale, 6.20 * track.s, tTower);

    camX += curPtrX * (0.012 / Math.sqrt(camScale));
    camY -= curPtrY * (0.009 / Math.sqrt(camScale));

    ctx.save();
    ctx.globalAlpha = realAlpha;
    if (p < 0.88) {
      var bgLock = smootherstep(0.48, 0.60, p);
      var bgCamX = lerp(camX, 0.455, bgLock);
      var bgCamY = lerp(camY, 0.640, bgLock);
      var bgCamScale = lerp(camScale, 1.75, bgLock);
      drawCameraLayer(ctx, vSrc.el, vSrc.w, vSrc.h, W, H, bgCamX, bgCamY, bgCamScale);
    }
    ctx.restore();

    // Overlays (grid, tower callout) only exist once the real flight is under way.
    var uiA = smoothstep(IDLE_TO_REAL * 0.6, IDLE_TO_REAL * 1.6, p);
    var gridAlpha = (1 - smoothstep(0.02, 0.24, p)) * uiA;
    drawEarthAerialGrid(ctx, W, H, gridAlpha, camX, camY, camScale);

    // 2. Nested 3D 25th-Floor Window Portal & SWK Properties 25th-Floor Office (p = 0.44 -> 1.00)
    //    The 25th-floor window frame (alsaqr-25th-mullions.webp) + nested office (swk-office-alsaqr.webp)
    //    glides in from the right-hand tower on Sheikh Zayed Road, remaining flush with the top, bottom,
    //    and right viewport borders, and then the camera flies physically THROUGH the transparent 25th-floor
    //    window panes into SWK Properties' executive office!
    if (p > 0.44 && imgOffice.complete && imgOffice.naturalWidth > 0) {
      // Approach progress (p: 0.44 -> 0.58): portal glides in from the right-hand tower to full screen
      var tPortalIn = smootherstep(0.44, 0.58, p);
      // Window pass-through progress (p: 0.58 -> 0.94): camera flies through the 25th-floor window pane into the office
      var uPass = smootherstep(0.58, 0.94, p);
      var portalAlpha = smoothstep(0.44, 0.56, p);
      var mulAlpha = 1 - smoothstep(0.84, 0.98, uPass);

      // In composite [0,1]x[0,1] space:
      // - alsaqr-25th-mullions occupies { x: 0, y: 0, w: 1, h: 1 } (transparent on left x < 0.16 and inside 4-pane window x: 0.488..0.908)
      // - swk-office-alsaqr occupies rect0 = { x: 0.475, y: 0.10, w: 0.440, h: 0.860 } behind the transparent 25th-floor window panes
      // As uPass goes 0 -> 1, the camera view window in composite space zooms from {0,0,1,1} into rect0,
      // so at uPass = 1, swk-office-alsaqr fills 100% of the screen (0, 0, W, H) uncropped while the window mullions expand off-screen!
      var r0x = 0.475, r0y = 0.10, r0w = 0.440, r0h = 0.860;
      var floatX = Math.sin(elapsed * 0.8) * 0.002 * (1 - uPass) - curPtrX * 0.004;
      var floatY = Math.cos(elapsed * 0.65) * 0.0015 * (1 - uPass) + curPtrY * 0.003;

      var vx = lerp(0.0, r0x, uPass) + floatX * (1 - uPass);
      var vy = lerp(0.0, r0y, uPass) + floatY * (1 - uPass);
      var vw = lerp(1.0, r0w, uPass);
      var vh = lerp(1.0, r0h, uPass);

      // Anchor top, bottom, and right edges so the building facade NEVER detaches from the screen border
      var destX = lerp(W * 0.18, 0, tPortalIn);
      var destY = 0;
      var destW = W - destX;
      var destH = H;

      ctx.save();
      ctx.globalAlpha = portalAlpha;

      function mapBox(bx, by, bw, bh) {
        return {
          x: destX + ((bx - vx) / vw) * destW,
          y: destY + ((by - vy) / vh) * destH,
          w: (bw / vw) * destW,
          h: (bh / vh) * destH
        };
      }

      // 2a. Draw the nested 25th-Floor SWK Properties Office Interior (swk-office-alsaqr.webp) behind the window panes
      if (mulAlpha < 0.99) {
        ctx.drawImage(imgOffice, 0, 0, W, H);
      }
      var offBox = mapBox(r0x, r0y, r0w, r0h);
      ctx.drawImage(imgOffice, offBox.x, offBox.y, offBox.w, offBox.h);

      // 2b. Draw the foreground 25th-Floor Al Saqr Business Tower limestone columns & window mullions
      //     (alsaqr-25th-mullions.webp) on top! On the left (x < 0.16), its alpha is 0 so the live Sheikh Zayed Road
      //     traffic from Step 1 flows continuously outside the building; inside the 25th-floor window panes, its alpha
      //     is 0 so the SWK Properties office sits physically behind the mullions.
      if (imgMullions.complete && imgMullions.naturalWidth > 0 && mulAlpha > 0.01) {
        var mulBox = mapBox(0.0, 0.0, 1.0, 1.0);
        ctx.save();
        ctx.globalAlpha = portalAlpha * mulAlpha;
        ctx.drawImage(imgMullions, mulBox.x, mulBox.y, mulBox.w, mulBox.h);
        ctx.restore();
      }

      ctx.restore();
    }

    // 3. Draw the 3D Target Reticle on Al Saqr Business Tower (25th Floor) during aerial & approach phases
    if (p < 0.80) {
      var cAspect2 = W / H;
      var sAspect2 = vSrc.w / vSrc.h;
      var visW2 = cAspect2 > sAspect2 ? 1.0 : cAspect2 / sAspect2;
      var visH2 = cAspect2 > sAspect2 ? sAspect2 / cAspect2 : 1.0;
      var rx = (0.5 + ((track.x - camX) / visW2) * camScale) * W;
      var ry = (0.5 + ((track.y - camY) / visH2) * camScale) * H;
      // Smoothly guide reticle toward the 25th-floor window bay center as portal locks in
      var tRet = smootherstep(0.42, 0.58, p);
      rx = lerp(rx, W * 0.64, tRet);
      ry = lerp(ry, H * 0.44, tRet);
      var retAlpha = (1 - smoothstep(0.70, 0.80, p)) * uiA;
      drawTowerCallout(
        ctx, W, H, rx, ry, retAlpha,
        p < 0.42 ? 'SWK PROPERTIES HQ \u00b7 SHEIKH ZAYED ROAD' : 'ENTERING 25TH FLOOR \u00b7 SWK PROPERTIES OFFICE',
        'AL SAQR BUSINESS TOWER \u00b7 25TH FLOOR'
      );
    }

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
      render(performance.now());
    },
    setPointer: function (x, y) {
      ptrX = clamp(x, -1, 1);
      ptrY = clamp(y, -1, 1);
    },
    resize: resize,
    start: function () {
      if (running) return;
      running = true;
      tryPlay(vidIdle);
      rafId = requestAnimationFrame(tick);
    },
    stop: function () {
      running = false;
      realPlaying = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      if (!vidIdle.paused) vidIdle.pause();
      if (vidReal && !vidReal.paused) vidReal.pause();
    },
    dispose: function () {
      api.stop();
    }
  };

  resize();
  return api;
}
