// Photorealistic Google Earth Studio scroll animation for SWK Properties:
//  1. Opens at a steep 60° top-isometric satellite/aerial view of Sheikh Zayed Road (E11),
//     Emirates Towers, Museum of the Future, Dubai Metro Red Line viaduct, and Al Saqr Business Tower.
//  2. Tilts and descends along the Sheikh Zayed Road corridor with live multi-lane traffic,
//     RTA taxis, glowing headlights/taillights, and articulated Dubai Metro Red Line trains.
//  3. Banks into a low-altitude drone approach directly toward Al Saqr Business Tower.
//  4. Glides up to the 18th-floor curtain-wall glass of Al Saqr Business Tower, looking inside.
//  5. Pushes seamlessly through the glass into SWK Properties' real executive office interior
//     in Al Saqr Business Tower, Sheikh Zayed Road, Dubai, UAE, with live traffic outside the windows.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const easeInOutCubic = (t) => {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PLATES = [
  {
    id: 'top-iso',
    src: '/assets/images/hero/earth-top-szr.webp',
    mobileSrc: '/assets/images/hero/earth-top-szr.webp',
    alt: 680,
    tilt: 60,
    heading: 32,
    label: 'SHEIKH ZAYED ROAD · TOP ISOMETRIC',
    focusStart: [0.50, 0.50],
    focusEnd: [0.53, 0.46],
    scaleStart: 1.02,
    scaleEnd: 1.28,
    targetPin: [0.735, 0.46],
  },
  {
    id: 'corridor-iso',
    src: '/assets/images/hero/earth-iso-szr.webp',
    mobileSrc: '/assets/images/hero/earth-iso-szr.webp',
    alt: 310,
    tilt: 42,
    heading: 28,
    label: 'TRADE CENTRE & DIFC CORRIDOR · E11',
    focusStart: [0.50, 0.50],
    focusEnd: [0.60, 0.47],
    scaleStart: 1.00,
    scaleEnd: 1.28,
    targetPin: [0.725, 0.45],
  },
  {
    id: 'drone-alsaqr',
    src: '/assets/images/hero/szr-drone-alsaqr.webp',
    mobileSrc: '/assets/images/hero/szr-drone-alsaqr.webp',
    alt: 95,
    tilt: 21,
    heading: 18,
    label: 'AL SAQR BUSINESS TOWER · APPROACH',
    focusStart: [0.52, 0.50],
    focusEnd: [0.63, 0.39],
    scaleStart: 1.00,
    scaleEnd: 1.30,
    targetPin: [0.635, 0.36],
  },
  {
    id: 'facade-close',
    src: '/assets/images/hero/alsaqr-facade-close.webp',
    mobileSrc: '/assets/images/hero/alsaqr-facade-close.webp',
    alt: 68,
    tilt: 8,
    heading: 12,
    label: 'LEVEL 18 · AL SAQR BUSINESS TOWER',
    focusStart: [0.54, 0.50],
    focusEnd: [0.68, 0.52],
    scaleStart: 1.00,
    scaleEnd: 1.34,
    targetPin: [0.70, 0.50],
  },
  {
    id: 'office-interior',
    src: '/assets/images/hero/swk-office-alsaqr.webp',
    mobileSrc: '/assets/images/hero/swk-office-alsaqr.webp',
    alt: 68,
    tilt: 0,
    heading: 10,
    label: 'SWK PROPERTIES HQ · AL SAQR BUSINESS TOWER, SZR',
    focusStart: [0.52, 0.50],
    focusEnd: [0.50, 0.50],
    scaleStart: 1.12,
    scaleEnd: 1.01,
    targetPin: null,
  },
];

// Crisp stage spans with long plateaus and tight 0.06 zoom transitions:
// Stage 0: 0.00..0.22 (transition 0.17..0.23)
// Stage 1: 0.17..0.46 (transition 0.41..0.47)  -> p=0.35 is pure Stage 1
// Stage 2: 0.41..0.71 (transition 0.66..0.72)  -> p=0.65 is pure Stage 2
// Stage 3: 0.66..0.88 (transition 0.83..0.89)  -> p=0.78 is pure Stage 3
// Stage 4: 0.83..1.00                          -> p=1.00 is pure Stage 4
const TRANSITIONS = [
  [0.17, 0.23],
  [0.41, 0.47],
  [0.66, 0.72],
  [0.83, 0.89],
];

export function createHeroScene(canvas, { mobile = false, hold = false } = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  let pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.85);
  let width = 1;
  let height = 1;

  const rand = mulberry32(20261026);
  const images = new Array(PLATES.length).fill(null);
  let loadedCount = 0;

  const existingPoster = document.querySelector('.hero__bg img');
  if (existingPoster && existingPoster.complete && existingPoster.naturalWidth > 0) {
    images[0] = existingPoster;
  }

  PLATES.forEach((plate, idx) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      images[idx] = img;
      loadedCount++;
      if (hold && idx === 0) renderFrame(0.016);
    };
    img.src = mobile ? plate.mobileSrc : plate.src;
  });

  // UAE fleet colors matched to real afternoon sunlight on Sheikh Zayed Road
  const CAR_PALETTE = [
    { body: '#eceae4', roof: '#f7f5f0', glass: '#1a2533' },
    { body: '#e4e2dc', roof: '#f2f0ea', glass: '#18222f' },
    { body: '#d4d7dc', roof: '#e5e7eb', glass: '#1b2432' },
    { body: '#8e95a0', roof: '#b4bac2', glass: '#111827' },
    { body: '#384150', roof: '#4b5563', glass: '#0f172a' },
    { body: '#181a20', roof: '#262930', glass: '#090d16' },
    { body: '#cbb799', roof: '#dfd0b8', glass: '#202630' },
    { body: '#efe3c8', roof: '#b91c1c', glass: '#1e293b' }, // RTA Red Roof Taxi
    { body: '#efe3c8', roof: '#d97706', glass: '#1e293b' }, // RTA Gold/Yellow Roof Taxi
    { body: '#efe3c8', roof: '#0369a1', glass: '#1e293b' }, // RTA Blue Roof Taxi
  ];

  const vehicles = [];
  const VEH_COUNT = mobile ? 48 : 80;
  for (let i = 0; i < VEH_COUNT; i++) {
    const dir = i % 2 === 0 ? 1 : -1;
    const lane = Math.floor(rand() * 5);
    const speed = 0.068 + (4 - lane * 0.6) * 0.014 + rand() * 0.018;
    const offset = rand();
    const style = CAR_PALETTE[Math.floor(rand() * CAR_PALETTE.length)];
    const isSuv = rand() < 0.55;
    const isBus = !isSuv && lane === 4 && rand() < 0.14;
    vehicles.push({ dir, lane, speed, offset, style, isSuv, isBus, laneJitter: (rand() - 0.5) * 0.14 });
  }

  // Sunlit dust motes for the SWK office interior (Stage 4)
  const motes = [];
  for (let i = 0; i < 34; i++) {
    motes.push({
      x: 0.35 + rand() * 0.60,
      y: 0.15 + rand() * 0.78,
      r: 0.8 + rand() * 1.6,
      vx: -0.005 - rand() * 0.007,
      vy: -0.003 + (rand() - 0.5) * 0.006,
      phase: rand() * Math.PI * 2,
    });
  }

  const state = { p: 0, px: 0, py: 0 };
  const cur = { p: 0, px: 0, py: 0 };
  let running = false;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let readyFired = false;
  let disposed = false;
  const api = { onReady: null, onSlow: null };

  function resize() {
    const cw = Math.max(1, canvas.clientWidth || window.innerWidth);
    const ch = Math.max(1, canvas.clientHeight || window.innerHeight);
    width = Math.round(cw * pixelRatio);
    height = Math.round(ch * pixelRatio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function getStageTransform(idx, p) {
    const pl = PLATES[idx];
    const sStart = idx === 0 ? 0 : TRANSITIONS[idx - 1][0];
    const sEnd = idx === PLATES.length - 1 ? 1 : TRANSITIONS[idx][1];
    const localT = clamp((p - sStart) / Math.max(0.001, sEnd - sStart), 0, 1);
    const easedT = easeInOutCubic(localT);
    const scale = lerp(pl.scaleStart, pl.scaleEnd, easedT) + Math.sin(clock * 0.38) * 0.004;
    const focusX = lerp(pl.focusStart[0], pl.focusEnd[0], easedT);
    const focusY = lerp(pl.focusStart[1], pl.focusEnd[1], easedT);
    const rotRad = idx < 3 ? Math.sin(localT * Math.PI) * 0.008 + cur.px * 0.006 : cur.px * 0.003;
    return { scale, focusX, focusY, rotRad, localT };
  }

  function drawPlateTransformed(img, alpha, scale, focusX, focusY, panX, panY, rotRad = 0) {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);

    const cx = width * 0.5 + panX * width;
    const cy = height * 0.5 + panY * height;
    ctx.translate(cx, cy);
    if (Math.abs(rotRad) > 0.0001) ctx.rotate(rotRad);
    ctx.scale(scale, scale);
    ctx.translate(-width * focusX, -height * focusY);

    if (img && img.complete && img.naturalWidth > 0) {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const coverScale = Math.max(width / iw, height / ih) * 1.06;
      const dw = iw * coverScale;
      const dh = ih * coverScale;
      const dx = (width - dw) * 0.5;
      const dy = (height - dh) * 0.5;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, '#1e324a');
      g.addColorStop(0.5, '#3b4d5e');
      g.addColorStop(1, '#c89d66');
      ctx.fillStyle = g;
      ctx.fillRect(-width * 0.2, -height * 0.2, width * 1.4, height * 1.4);
    }

    ctx.restore();
  }

  function projectUV(uvx, uvy, scale, focusX, focusY, panX, panY, rotRad = 0) {
    const iw = 1600;
    const ih = 900;
    const coverScale = Math.max(width / iw, height / ih) * 1.06;
    const dw = iw * coverScale;
    const dh = ih * coverScale;
    const dx = (width - dw) * 0.5;
    const dy = (height - dh) * 0.5;

    const px0 = dx + uvx * dw - width * focusX;
    const py0 = dy + uvy * dh - height * focusY;

    const sx = px0 * scale;
    const sy = py0 * scale;

    const cos = Math.cos(rotRad);
    const sin = Math.sin(rotRad);
    const rx = sx * cos - sy * sin;
    const ry = sx * sin + sy * cos;

    return {
      x: width * 0.5 + panX * width + rx,
      y: height * 0.5 + panY * height + ry,
      scale: coverScale * scale,
    };
  }

  function drawRoadCorridorTraffic(cfg, alpha, scale, focusX, focusY, panX, panY, rotRad) {
    if (alpha <= 0.01) return;
    ctx.save();

    const {
      topLeft, topRight, botLeft, botRight,
      medianWidth = 0.045,
      perspectivePow = 1.0,
      carScaleBase = 1.0,
      clipTop = 0.0,
      clipBot = 1.0,
      skipRange = null,
    } = cfg;

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      const rawU = (v.offset + clock * v.speed) % 1;
      const uLin = v.dir > 0 ? rawU : 1 - rawU;
      const u = Math.pow(uLin, perspectivePow);
      if (u < clipTop || u > clipBot) continue;
      if (skipRange && u > skipRange[0] && u < skipRange[1]) continue;

      const edgeFade = smooth((u - clipTop) / 0.06) * smooth((clipBot - u) / 0.06);
      if (edgeFade <= 0.01) continue;

      const lx = lerp(topLeft[0], botLeft[0], u);
      const ly = lerp(topLeft[1], botLeft[1], u);
      const rx = lerp(topRight[0], botRight[0], u);
      const ry = lerp(topRight[1], botRight[1], u);

      const uNext = clamp(u + 0.02, 0, 1);
      const lnx = lerp(topLeft[0], botLeft[0], uNext);
      const lny = lerp(topLeft[1], botLeft[1], uNext);
      const rnx = lerp(topRight[0], botRight[0], uNext);
      const rny = lerp(topRight[1], botRight[1], uNext);

      const laneNorm = (v.lane + 0.5 + v.laneJitter) / 5;
      const halfSpan = (1 - medianWidth) * 0.5;
      const s = v.dir > 0
        ? (1 - laneNorm) * halfSpan
        : 0.5 + medianWidth * 0.5 + laneNorm * halfSpan;

      const uvx = lerp(lx, rx, s);
      const uvy = lerp(ly, ry, s);
      const uvNextX = lerp(lnx, rnx, s);
      const uvNextY = lerp(lny, rny, s);

      const pt = projectUV(uvx, uvy, scale, focusX, focusY, panX, panY, rotRad);
      const ptNext = projectUV(uvNextX, uvNextY, scale, focusX, focusY, panX, panY, rotRad);

      const roadAngle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) + (v.dir > 0 ? 0 : Math.PI);
      const depthScale = lerp(perspectivePow > 1.05 ? 0.24 : 0.74, 1.12, u);
      const sz = pt.scale * depthScale * carScaleBase;

      const carL = (v.isBus ? 14.5 : v.isSuv ? 8.6 : 7.6) * sz;
      const carW = (v.isBus ? 4.2 : v.isSuv ? 3.7 : 3.3) * sz;
      if (carL < 1.1) continue;

      ctx.save();
      ctx.globalAlpha = clamp(alpha * edgeFade * 0.92, 0, 1);
      ctx.translate(pt.x, pt.y);
      ctx.rotate(roadAngle);

      if (v.dir > 0) {
        const beam = ctx.createLinearGradient(carL * 0.4, 0, carL * 1.9, 0);
        beam.addColorStop(0, 'rgba(255, 248, 214, 0.45)');
        beam.addColorStop(1, 'rgba(255, 248, 214, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(carL * 0.45, -carW * 0.4);
        ctx.lineTo(carL * 1.9, -carW * 0.8);
        ctx.lineTo(carL * 1.9, carW * 0.8);
        ctx.lineTo(carL * 0.45, carW * 0.4);
        ctx.closePath();
        ctx.fill();
      } else {
        const tailGlow = ctx.createLinearGradient(-carL * 0.4, 0, -carL * 1.35, 0);
        tailGlow.addColorStop(0, 'rgba(255, 48, 36, 0.42)');
        tailGlow.addColorStop(1, 'rgba(255, 48, 36, 0)');
        ctx.fillStyle = tailGlow;
        ctx.fillRect(-carL * 1.35, -carW * 0.48, carL * 0.95, carW * 0.96);
      }

      ctx.fillStyle = 'rgba(10, 14, 24, 0.42)';
      ctx.beginPath();
      ctx.roundRect(-carL * 0.5 + carW * 0.2, -carW * 0.5 + carW * 0.25, carL, carW, carW * 0.28);
      ctx.fill();

      ctx.fillStyle = v.style.body;
      ctx.beginPath();
      ctx.roundRect(-carL * 0.5, -carW * 0.5, carL, carW, carW * 0.28);
      ctx.fill();

      ctx.fillStyle = v.style.glass;
      ctx.beginPath();
      ctx.roundRect(-carL * 0.28, -carW * 0.4, carL * 0.62, carW * 0.8, carW * 0.16);
      ctx.fill();

      ctx.fillStyle = v.style.roof;
      ctx.beginPath();
      ctx.roundRect(-carL * 0.18, -carW * 0.36, carL * 0.4, carW * 0.72, carW * 0.12);
      ctx.fill();

      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(carL * 0.42, -carW * 0.4, carL * 0.09, carW * 0.22);
      ctx.fillRect(carL * 0.42, carW * 0.18, carL * 0.09, carW * 0.22);

      ctx.fillStyle = '#ff2a1f';
      ctx.fillRect(-carL * 0.51, -carW * 0.4, carL * 0.09, carW * 0.24);
      ctx.fillRect(-carL * 0.51, carW * 0.16, carL * 0.09, carW * 0.24);

      ctx.restore();
    }

    ctx.restore();
  }

  function drawMetroTrain(trackStart, trackEnd, stationU, dir, speed, phase, alpha, scale, focusX, focusY, panX, panY, rotRad, trainWidthPx = 5.2) {
    if (alpha <= 0.01) return;
    const cycle = (clock * speed + phase) % 1;
    let u = dir > 0 ? cycle : 1 - cycle;
    if (stationU !== null) {
      const dist = u - stationU;
      u -= Math.exp(-(dist * dist) / 0.012) * dist * 0.32;
    }

    const ptA = projectUV(trackStart[0], trackStart[1], scale, focusX, focusY, panX, panY, rotRad);
    const ptB = projectUV(trackEnd[0], trackEnd[1], scale, focusX, focusY, panX, panY, rotRad);
    const angle = Math.atan2(ptB.y - ptA.y, ptB.x - ptA.x);
    const totalLen = Math.hypot(ptB.x - ptA.x, ptB.y - ptA.y);
    if (totalLen < 10) return;

    const w = trainWidthPx * ptA.scale;
    const carLen = w * 3.4;
    const gap = w * 0.2;
    const numCars = 5;

    ctx.save();
    ctx.globalAlpha = clamp(alpha * 0.95, 0, 1);
    ctx.translate(ptA.x, ptA.y);
    ctx.rotate(angle);

    const headCenter = u * totalLen;

    for (let c = 0; c < numCars; c++) {
      const carCenter = headCenter + (dir > 0 ? -1 : 1) * c * (carLen + gap);
      if (carCenter < -carLen || carCenter > totalLen + carLen) continue;
      const isNose = c === 0;
      const isTail = c === numCars - 1;

      ctx.save();
      ctx.translate(carCenter, 0);
      if (dir < 0) ctx.scale(-1, 1);

      ctx.fillStyle = 'rgba(10, 15, 28, 0.36)';
      ctx.beginPath();
      ctx.roundRect(-carLen * 0.5 + w * 0.16, -w * 0.5 + w * 0.2, carLen, w, isNose ? w * 0.46 : w * 0.16);
      ctx.fill();

      const bodyGrad = ctx.createLinearGradient(0, -w * 0.5, 0, w * 0.5);
      bodyGrad.addColorStop(0, '#eef2f6');
      bodyGrad.addColorStop(0.5, '#ffffff');
      bodyGrad.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(-carLen * 0.5, -w * 0.5, carLen, w, isNose ? [w * 0.16, w * 0.48, w * 0.48, w * 0.16] : isTail ? [w * 0.44, w * 0.16, w * 0.16, w * 0.44] : w * 0.14);
      ctx.fill();

      ctx.fillStyle = '#c8102e';
      ctx.fillRect(-carLen * 0.46, -w * 0.48, carLen * 0.92, w * 0.14);
      ctx.fillRect(-carLen * 0.46, w * 0.34, carLen * 0.92, w * 0.14);

      ctx.fillStyle = '#334155';
      ctx.fillRect(-carLen * 0.42, -w * 0.22, carLen * 0.84, w * 0.44);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-carLen * 0.36, -w * 0.1, carLen * 0.72, w * 0.2);

      if (isNose) {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(carLen * 0.24, -w * 0.36, carLen * 0.22, w * 0.72, w * 0.26);
        ctx.fill();

        const noseGlow = ctx.createLinearGradient(carLFromW(carLen) * 0.45, 0, carLFromW(carLen) * 1.3, 0);
        noseGlow.addColorStop(0, 'rgba(255, 250, 220, 0.7)');
        noseGlow.addColorStop(1, 'rgba(255, 250, 220, 0)');
        ctx.fillStyle = noseGlow;
        ctx.beginPath();
        ctx.moveTo(carLen * 0.45, -w * 0.34);
        ctx.lineTo(carLen * 1.3, -w * 0.7);
        ctx.lineTo(carLen * 1.3, w * 0.7);
        ctx.lineTo(carLen * 0.45, w * 0.34);
        ctx.closePath();
        ctx.fill();
      }

      if (!isTail) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(-carLen * 0.5 - gap, -w * 0.36, gap * 1.05, w * 0.72);
      }

      ctx.restore();
    }

    ctx.restore();
  }
  function carLFromW(v) { return v; }

  function drawBeaconsAndGlints(beacons, alpha, scale, focusX, focusY, panX, panY, rotRad) {
    if (alpha <= 0.01) return;
    ctx.save();
    for (let i = 0; i < beacons.length; i++) {
      const [uvx, uvy, phase, kind] = beacons[i];
      const pt = projectUV(uvx, uvy, scale, focusX, focusY, panX, panY, rotRad);
      const pulse = 0.25 + 0.75 * Math.pow(Math.sin(clock * 2.4 + phase) * 0.5 + 0.5, 2);
      const r = (kind === 'sun' ? 18 : 9) * pt.scale;
      const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
      if (kind === 'sun') {
        g.addColorStop(0, `rgba(255, 250, 230, ${0.72 * alpha * pulse})`);
        g.addColorStop(0.35, `rgba(255, 215, 130, ${0.32 * alpha * pulse})`);
        g.addColorStop(1, 'rgba(255, 215, 130, 0)');
      } else {
        g.addColorStop(0, `rgba(255, 60, 40, ${0.92 * alpha * pulse})`);
        g.addColorStop(0.3, `rgba(239, 35, 24, ${0.42 * alpha * pulse})`);
        g.addColorStop(1, 'rgba(239, 35, 24, 0)');
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTargetPin(uv, alpha, scale, focusX, focusY, panX, panY, rotRad, stageIdx) {
    if (!uv || alpha <= 0.02) return;
    const pt = projectUV(uv[0], uv[1], scale, focusX, focusY, panX, panY, rotRad);
    const s = clamp(pixelRatio, 1, 2);
    const pulse = (clock * 0.85) % 1;

    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);

    ctx.strokeStyle = `rgba(217, 177, 90, ${(1 - pulse) * 0.85})`;
    ctx.lineWidth = 1.8 * s;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, (12 + pulse * 34) * s, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 248, 225, 0.94)';
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 10 * s, 0, Math.PI * 2);
    ctx.stroke();

    const ch = 16 * s;
    ctx.beginPath();
    ctx.moveTo(pt.x - ch, pt.y);
    ctx.lineTo(pt.x - 5 * s, pt.y);
    ctx.moveTo(pt.x + 5 * s, pt.y);
    ctx.lineTo(pt.x + ch, pt.y);
    ctx.moveTo(pt.x, pt.y - ch);
    ctx.lineTo(pt.x, pt.y - 5 * s);
    ctx.moveTo(pt.x, pt.y + 5 * s);
    ctx.lineTo(pt.x, pt.y + ch);
    ctx.stroke();

    ctx.fillStyle = '#d9b15a';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3.2 * s, 0, Math.PI * 2);
    ctx.fill();

    if (!mobile || stageIdx >= 1) {
      const lx = pt.x + (stageIdx === 3 ? -165 * s : 24 * s);
      const ly = pt.y - 26 * s;
      ctx.strokeStyle = 'rgba(217, 177, 90, 0.9)';
      ctx.lineWidth = 1.4 * s;
      ctx.beginPath();
      ctx.moveTo(pt.x + (stageIdx === 3 ? -8 * s : 8 * s), pt.y - 8 * s);
      ctx.lineTo(pt.x + (stageIdx === 3 ? -22 * s : 22 * s), ly);
      ctx.stroke();

      const title = stageIdx >= 2 ? 'SWK PROPERTIES · LEVEL 18' : 'AL SAQR BUSINESS TOWER';
      const sub = stageIdx >= 2 ? 'AL SAQR BUSINESS TOWER · SZR' : 'SWK PROPERTIES HQ · 25.2139°N 55.2780°E';
      ctx.font = `700 ${Math.round(10.5 * s)}px "General Sans", system-ui, sans-serif`;
      const tw = Math.max(ctx.measureText(title).width, ctx.measureText(sub).width * 0.9) + 22 * s;
      const th = 34 * s;
      const bx = stageIdx === 3 ? pt.x - 22 * s - tw : lx;
      const by = ly - th * 0.5;

      ctx.fillStyle = 'rgba(11, 20, 38, 0.9)';
      ctx.strokeStyle = 'rgba(217, 177, 90, 0.85)';
      ctx.lineWidth = 1.2 * s;
      ctx.beginPath();
      ctx.roundRect(bx, by, tw, th, 8 * s);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f5dfa0';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(title, bx + 11 * s, by + 6 * s);
      ctx.font = `500 ${Math.round(8.8 * s)}px "General Sans", system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(241, 245, 249, 0.92)';
      ctx.fillText(sub, bx + 11 * s, by + 19 * s);
    }

    ctx.restore();
  }

  function drawStageLiveEffects(idx, alpha, scale, focusX, focusY, panX, panY, rotRad) {
    if (alpha <= 0.01) return;

    if (idx === 0) {
      drawRoadCorridorTraffic(
        {
          topLeft: [0.418, -0.02],
          topRight: [0.484, -0.02],
          botLeft: [0.354, 1.02],
          botRight: [0.468, 1.02],
          medianWidth: 0.05,
          perspectivePow: 1.04,
          carScaleBase: 0.82,
          skipRange: [0.26, 0.31], // pass under pedestrian footbridge cleanly
        },
        alpha, scale, focusX, focusY, panX, panY, rotRad
      );

      drawMetroTrain([0.405, -0.04], [0.331, 1.04], 0.30, 1, 0.052, 0.14, alpha, scale, focusX, focusY, panX, panY, rotRad, 4.8);
      drawMetroTrain([0.411, -0.04], [0.338, 1.04], 0.30, -1, 0.048, 0.66, alpha, scale, focusX, focusY, panX, panY, rotRad, 4.8);

      drawBeaconsAndGlints(
        [
          [0.758, 0.315, 0.2, 'beacon'],
          [0.068, 0.082, 1.5, 'beacon'],
          [0.155, 0.092, 2.8, 'beacon'],
          [0.278, 0.515, 0.9, 'sun'],
          [0.735, 0.485, 2.1, 'sun'],
        ],
        alpha, scale, focusX, focusY, panX, panY, rotRad
      );

      drawTargetPin(PLATES[0].targetPin, alpha, scale, focusX, focusY, panX, panY, rotRad, 0);
    } else if (idx === 1) {
      drawRoadCorridorTraffic(
        {
          topLeft: [0.493, 0.325],
          topRight: [0.511, 0.325],
          botLeft: [0.418, 1.02],
          botRight: [0.586, 1.02],
          medianWidth: 0.045,
          perspectivePow: 1.65,
          carScaleBase: 0.88,
          clipTop: 0.06,
          clipBot: 1.0,
          skipRange: [0.43, 0.47], // pass under footbridge cleanly
        },
        alpha, scale, focusX, focusY, panX, panY, rotRad
      );

      drawMetroTrain([0.482, 0.365], [0.340, 1.03], 0.38, 1, 0.056, 0.22, alpha, scale, focusX, focusY, panX, panY, rotRad, 4.4);
      drawMetroTrain([0.518, 0.365], [0.635, 1.03], null, -1, 0.054, 0.71, alpha, scale, focusX, focusY, panX, panY, rotRad, 4.4);

      drawBeaconsAndGlints(
        [
          [0.208, 0.042, 0.4, 'beacon'],
          [0.260, 0.110, 1.7, 'beacon'],
          [0.425, 0.095, 2.9, 'beacon'],
          [0.628, 0.082, 0.8, 'beacon'],
          [0.728, 0.320, 1.9, 'sun'],
          [0.365, 0.495, 0.5, 'sun'],
        ],
        alpha, scale, focusX, focusY, panX, panY, rotRad
      );

      drawTargetPin(PLATES[1].targetPin, alpha, scale, focusX, focusY, panX, panY, rotRad, 1);
    } else if (idx === 2) {
      drawRoadCorridorTraffic(
        {
          topLeft: [0.296, 0.472],
          topRight: [0.330, 0.472],
          botLeft: [0.162, 1.02],
          botRight: [0.568, 1.02],
          medianWidth: 0.04,
          perspectivePow: 1.75,
          carScaleBase: 1.04,
          clipTop: 0.08,
          clipBot: 1.0,
          skipRange: [0.48, 0.56], // pass under green E11 highway gantry cleanly
        },
        alpha, scale, focusX, focusY, panX, panY, rotRad
      );

      drawMetroTrain([0.715, 0.692], [0.935, 1.02], null, 1, 0.062, 0.35, alpha, scale, focusX, focusY, panX, panY, rotRad, 5.6);

      drawBeaconsAndGlints(
        [
          [0.632, 0.048, 0.3, 'beacon'],
          [0.808, 0.012, 1.4, 'beacon'],
          [0.856, 0.038, 2.5, 'beacon'],
          [0.382, 0.130, 0.9, 'beacon'],
          [0.638, 0.340, 1.2, 'sun'],
        ],
        alpha, scale, focusX, focusY, panX, panY, rotRad
      );

      drawTargetPin(PLATES[2].targetPin, alpha, scale, focusX, focusY, panX, panY, rotRad, 2);
    } else if (idx === 3) {
      drawRoadCorridorTraffic(
        {
          topLeft: [0.132, 0.605],
          topRight: [0.150, 0.605],
          botLeft: [-0.02, 0.985],
          botRight: [0.105, 0.995],
          medianWidth: 0.04,
          perspectivePow: 1.5,
          carScaleBase: 0.68,
          clipTop: 0.08,
          clipBot: 1.0,
        },
        alpha, scale, focusX, focusY, panX, panY, rotRad
      );

      const winPt = projectUV(0.695, 0.52, scale, focusX, focusY, panX, panY, rotRad);
      const glowR = 260 * winPt.scale;
      const g = ctx.createRadialGradient(winPt.x, winPt.y, 0, winPt.x, winPt.y, glowR);
      g.addColorStop(0, `rgba(255, 224, 150, ${0.22 * alpha * (0.85 + 0.15 * Math.sin(clock * 1.8))})`);
      g.addColorStop(1, 'rgba(255, 224, 150, 0)');
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(winPt.x, winPt.y, glowR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      drawTargetPin(PLATES[3].targetPin, alpha, scale, focusX, focusY, panX, panY, rotRad, 3);
    } else if (idx === 4) {
      const wTopLeft = projectUV(0.832, 0.58, scale, focusX, focusY, panX, panY, rotRad);
      const wBotRight = projectUV(0.955, 0.95, scale, focusX, focusY, panX, panY, rotRad);
      ctx.save();
      ctx.beginPath();
      ctx.rect(wTopLeft.x, wTopLeft.y, Math.max(10, wBotRight.x - wTopLeft.x), Math.max(10, wBotRight.y - wTopLeft.y));
      ctx.clip();

      drawRoadCorridorTraffic(
        {
          topLeft: [0.825, 0.675],
          topRight: [0.852, 0.665],
          botLeft: [0.895, 0.965],
          botRight: [0.968, 0.945],
          medianWidth: 0.05,
          perspectivePow: 1.2,
          carScaleBase: 0.56,
        },
        alpha * 0.85, scale, focusX, focusY, panX, panY, rotRad
      );
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const sunOrigin = projectUV(0.92, 0.28, scale, focusX, focusY, panX, panY, rotRad);
      const sunTarget = projectUV(0.42, 0.88, scale, focusX, focusY, panX, panY, rotRad);
      const beamGrad = ctx.createLinearGradient(sunOrigin.x, sunOrigin.y, sunTarget.x, sunTarget.y);
      beamGrad.addColorStop(0, `rgba(255, 232, 175, ${0.15 * alpha})`);
      beamGrad.addColorStop(0.55, `rgba(255, 215, 140, ${0.06 * alpha})`);
      beamGrad.addColorStop(1, 'rgba(255, 215, 140, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, width, height);

      const modelPt = projectUV(0.652, 0.615, scale, focusX, focusY, panX, panY, rotRad);
      const mg = ctx.createRadialGradient(modelPt.x, modelPt.y, 0, modelPt.x, modelPt.y, 95 * modelPt.scale);
      mg.addColorStop(0, `rgba(255, 236, 178, ${0.24 * alpha * (0.8 + 0.2 * Math.sin(clock * 2.2))})`);
      mg.addColorStop(1, 'rgba(255, 236, 178, 0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(modelPt.x, modelPt.y, 95 * modelPt.scale, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        const mx = (m.x + clock * m.vx + 10) % 1;
        const my = (m.y + clock * m.vy + 10) % 1;
        const pt = projectUV(0.32 + mx * 0.62, 0.12 + my * 0.80, scale, focusX, focusY, panX, panY, rotRad);
        const tw = 0.35 + 0.65 * Math.sin(clock * 1.9 + m.phase);
        ctx.fillStyle = `rgba(255, 244, 206, ${0.42 * alpha * tw})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, m.r * pt.scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawEarthStudioHUD(p, activeIdx) {
    const s = clamp(pixelRatio, 1, 2);
    const fIdx = p * (PLATES.length - 1);
    const i0 = clamp(Math.floor(fIdx), 0, PLATES.length - 1);
    const i1 = clamp(i0 + 1, 0, PLATES.length - 1);
    const ft = smooth(fIdx - i0);
    const alt = Math.round(lerp(PLATES[i0].alt, PLATES[i1].alt, ft));
    const tilt = Math.round(lerp(PLATES[i0].tilt, PLATES[i1].tilt, ft));
    const heading = Math.round(lerp(PLATES[i0].heading, PLATES[i1].heading, ft));
    const activePlate = PLATES[activeIdx];

    ctx.save();
    // Clear the floating SWK Concierge launcher on the bottom-right (108px offset)
    const padX = mobile ? 14 * s : 108 * s;
    const padY = mobile ? 150 * s : 28 * s;
    const hudW = mobile ? Math.min(width - 28 * s, 320 * s) : 445 * s;
    const hudH = 38 * s;
    const hx = width - hudW - padX;
    const hy = height - hudH - padY;

    ctx.fillStyle = 'rgba(11, 20, 38, 0.9)';
    ctx.strokeStyle = 'rgba(217, 177, 90, 0.72)';
    ctx.lineWidth = 1.2 * s;
    ctx.beginPath();
    ctx.roundRect(hx, hy, hudW, hudH, 999);
    ctx.fill();
    ctx.stroke();

    const dotPulse = 0.5 + 0.5 * Math.sin(clock * 3.2);
    ctx.fillStyle = activeIdx === 4 ? '#34d399' : '#d9b15a';
    ctx.beginPath();
    ctx.arc(hx + 16 * s, hy + hudH * 0.5, (3.5 + dotPulse * 1.2) * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `700 ${Math.round(9.5 * s)}px "General Sans", system-ui, sans-serif`;
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const statusText = activeIdx === 4
      ? 'LIVE · SWK OFFICE · LEVEL 18, AL SAQR BUSINESS TOWER'
      : `EARTH STUDIO 3D · ${activePlate.label}`;
    ctx.fillText(statusText, hx + 28 * s, hy + hudH * 0.36);

    ctx.font = `500 ${Math.round(8.5 * s)}px "General Sans", monospace`;
    ctx.fillStyle = '#cbd5e1';
    const teleText = activeIdx === 4
      ? '25°12\'50.1"N 55°16\'40.7"E · SHEIKH ZAYED ROAD, DUBAI · RERA ORN 51517'
      : `25°12'50.1"N 55°16'40.7"E · ALT ${alt}m · TILT ${tilt}° · HDG ${heading}° NNE`;
    ctx.fillText(teleText, hx + 28 * s, hy + hudH * 0.72);

    ctx.restore();
  }

  function renderFrame(dt) {
    const k = 1 - Math.exp(-dt * 10);
    cur.p += (state.p - cur.p) * k;
    cur.px += (state.px - cur.px) * (1 - Math.exp(-dt * 4));
    cur.py += (state.py - cur.py) * (1 - Math.exp(-dt * 4));

    const p = clamp(cur.p, 0, 1);

    const idleX = Math.sin(clock * 0.35) * 0.005;
    const idleY = Math.cos(clock * 0.28) * 0.004;
    const panX = cur.px * 0.016 + idleX;
    const panY = cur.py * 0.012 + idleY;

    // Determine primary stage and optional incoming transition stage
    let baseIdx = 0;
    let nextIdx = -1;
    let transU = 0;

    for (let i = 0; i < TRANSITIONS.length; i++) {
      const [t0, t1] = TRANSITIONS[i];
      if (p >= t1) {
        baseIdx = i + 1;
      } else if (p > t0) {
        baseIdx = i;
        nextIdx = i + 1;
        transU = easeInOutCubic((p - t0) / (t1 - t0));
        break;
      } else {
        break;
      }
    }

    // 1. Draw base stage at full opacity (1.0) so there is never background bleed
    const tBase = getStageTransform(baseIdx, p);
    drawPlateTransformed(images[baseIdx], 1.0, tBase.scale, tBase.focusX, tBase.focusY, panX, panY, tBase.rotRad);

    // 2. If in a transition window, composite incoming stage and draw live overlays only for dominant stage
    if (nextIdx !== -1) {
      const tNext = getStageTransform(nextIdx, p);
      drawPlateTransformed(images[nextIdx], transU, tNext.scale, tNext.focusX, tNext.focusY, panX, panY, tNext.rotRad);
      if (transU < 0.5) {
        drawStageLiveEffects(baseIdx, 1 - transU * 2, tBase.scale, tBase.focusX, tBase.focusY, panX, panY, tBase.rotRad);
      } else {
        drawStageLiveEffects(nextIdx, (transU - 0.5) * 2, tNext.scale, tNext.focusX, tNext.focusY, panX, panY, tNext.rotRad);
      }
    } else {
      drawStageLiveEffects(baseIdx, 1.0, tBase.scale, tBase.focusX, tBase.focusY, panX, panY, tBase.rotRad);
    }

    const dominantIdx = nextIdx !== -1 && transU >= 0.5 ? nextIdx : baseIdx;
    drawEarthStudioHUD(p, dominantIdx);

    if (!readyFired && (images[0] || clock > 0.15 || hold)) {
      readyFired = true;
      if (api.onReady) api.onReady();
    }
  }

  function frame(now) {
    if (!running || disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    clock += dt;
    renderFrame(dt);
  }

  api.resize = () => {
    resize();
    renderFrame(0.001);
  };
  api.setProgress = (p) => {
    state.p = clamp(p, 0, 1);
  };
  api.setPointer = (x, y) => {
    state.px = clamp(x, -1, 1);
    state.py = clamp(y, -1, 1);
  };
  api.start = () => {
    if (hold) {
      requestAnimationFrame(() => {
        resize();
        renderFrame(0.016);
        if (!readyFired) {
          readyFired = true;
          if (api.onReady) api.onReady();
        }
      });
      return;
    }
    if (running || disposed) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  };
  api.stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  api.renderOnce = () => {
    resize();
    renderFrame(0.016);
  };
  api.dispose = () => {
    disposed = true;
    api.stop();
  };
  api.stats = () => ({
    plates: PLATES.length,
    loaded: loadedCount,
    vehicles: vehicles.length,
    progress: cur.p,
    pixelRatio,
  });

  resize();
  return api;
}
