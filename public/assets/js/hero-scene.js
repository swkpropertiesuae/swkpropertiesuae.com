// Cinematic hero: a procedural Dubai street scene rendered with Three.js.
//
//  - The scroll journey starts as a Google-Earth style satellite view straight
//    down on the city (street grid, lots, parks, desert and coastline, with
//    long building shadows), descends over the boulevard, tilts toward the
//    horizon and lands at street level to drive down the avenue.
//  - One InstancedMesh holds every building (and the landmark tower tiers);
//    a custom shader draws lit windows, rim light, height fog and the ember
//    glow of a sunset sitting behind the skyline.
//  - Everything is procedural, so there are no model or texture downloads.
//
// Loaded lazily (dynamic import) only when WebGL is available and the visitor
// has not asked for reduced motion. If anything throws, the caller keeps the
// static photo hero.

import * as THREE from '/assets/vendor/three.module.min.js';

const STREET_FOG = new THREE.Color(0.96, 0.85, 0.72);
const ORBIT_FOG = new THREE.Color(0.80, 0.87, 0.94);
const FOG_COLOR = STREET_FOG.clone();

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const BUILDING_VERT = /* glsl */ `
  attribute float aSeed;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vSeed;
  varying vec2 vFace;
  varying float vTop;
  varying float vFogDepth;

  void main() {
    mat4 m = modelMatrix;
    vec3 sc = vec3(1.0);
    #ifdef USE_INSTANCING
      m = modelMatrix * instanceMatrix;
      sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
    #endif
    vec4 wp = m * vec4(position, 1.0);
    vWorld = wp.xyz;
    vNormalW = normalize(mat3(m) * normal);
    vec3 local = position * sc;
    #ifdef ROUND
      vFace = vec2(atan(position.x, position.z) * 0.5 * sc.x, local.y);   // arc length around the drum
    #else
      vFace = (abs(normal.x) > 0.5) ? vec2(local.z, local.y) : vec2(local.x, local.y);
    #endif
    vTop = step(0.5, normal.y);
    vSeed = aSeed;
    vec4 mv = viewMatrix * wp;
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const BUILDING_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vSeed;
  varying vec2 vFace;
  varying float vTop;
  varying float vFogDepth;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vWorld);
    // vSeed is constant per instance, but interpolation leaves ULP-level error;
    // snap it so the window hashes below cannot flicker per pixel.
    float sv = floor(vSeed * 1024.0 + 0.5) / 1024.0;
    float beacon = step(5.0, sv);
    float seed = fract(sv);
    float hh = clamp(vWorld.y / 230.0, 0.0, 1.0);

    // Facade palette: real Dubai materials - limestone, steel-blue, deep blue, bronze and teal glass, white concrete.
    vec3 lime  = vec3(0.84, 0.75, 0.62);
    vec3 steel = vec3(0.40, 0.52, 0.66);
    vec3 deep  = vec3(0.17, 0.27, 0.46);
    vec3 bronz = vec3(0.64, 0.52, 0.42);
    vec3 teal  = vec3(0.18, 0.46, 0.52);
    vec3 white = vec3(0.93, 0.91, 0.87);
    float k = seed * 6.0;
    vec3 base = white;
    base = mix(base, lime,  step(1.0, k));
    base = mix(base, steel, step(2.0, k));
    base = mix(base, deep,  step(3.0, k));
    base = mix(base, bronz, step(4.0, k));
    base = mix(base, teal,  step(5.0, k));
    float glassy = step(2.0, k);

    // Sun from the front-right; faces away from it fall into a soft blue shade.
    vec3 L = normalize(vec3(0.55, 0.62, 0.56));
    float diff = clamp(dot(N, L), 0.0, 1.0);
    vec3 shade = vec3(0.50, 0.50, 0.66);
    vec3 col = base * mix(shade, vec3(1.10, 1.02, 0.90), 0.3 + 0.7 * diff);

    // Reflection vector: glass mirrors the sky and the low sun.
    vec3 R = reflect(-V, N);
    vec3 skyLow = vec3(0.93, 0.80, 0.62);
    vec3 skyHi  = vec3(0.30, 0.50, 0.78);
    vec3 skyRef = mix(skyLow, skyHi, clamp(R.y * 1.6 + 0.15, 0.0, 1.0));
    vec3 sunD = normalize(vec3(0.22, 0.16, -1.0));
    float sunSpec = pow(max(dot(R, sunD), 0.0), 18.0);

    if (vTop > 0.5) {
      // Roof: gravel / concrete with a parapet line and a plant room.
      vec2 rg = vFace * 0.5;
      float n = hash(floor(rg * 6.0));
      col = mix(vec3(0.46, 0.45, 0.43), vec3(0.62, 0.60, 0.56), n);
      float edge = min(min(fract(vFace.x / 9.0), 1.0 - fract(vFace.x / 9.0)), min(fract(vFace.y / 9.0), 1.0 - fract(vFace.y / 9.0)));
      col *= 0.8 + 0.2 * smoothstep(0.0, 0.05, edge);
    } else {
      float storeyH = 3.7;
      float bayW = mix(1.7, 2.6, hash(vec2(seed, 3.1)));
      vec2 g = vFace / vec2(bayW, storeyH);
      vec2 id = floor(g);
      vec2 f = fract(g);
      float style = floor(hash(vec2(seed, 9.7)) * 3.0);   // 0 ribbon, 1 punched, 2 curtain wall + fins
      float spandrel = step(f.y, 0.26);                   // opaque slab band at the bottom of each storey
      float mullion = step(f.x, 0.045) + step(0.955, f.x);
      float glassMask = 1.0 - spandrel;
      if (style == 1.0) glassMask *= step(0.14, f.x) * step(f.x, 0.86);
      if (style == 2.0) glassMask *= 1.0 - step(0.9, f.x) * 0.6;
      float r = hash(id + seed * 57.3);
      float lit = step(0.93, r);
      vec3 tint = mix(base, vec3(0.35, 0.50, 0.66), glassy * 0.6);
      vec3 glass = skyRef * tint * 1.25;
      // Broad sky reflection that slides across the glass with height and position, as on real curtain walls.
      float streak = smoothstep(0.55, 1.0, sin(vWorld.y * 0.045 + (vWorld.x + vWorld.z) * 0.06 + seed * 40.0) * 0.5 + 0.5);
      glass = mix(glass, glass * 1.25 + vec3(0.12, 0.16, 0.2), streak * glassy * 0.55);
      glass *= mix(0.78, 1.08, clamp(vWorld.y / 120.0, 0.0, 1.0));   // darker toward the street, brighter higher up
      glass += vec3(1.0, 0.86, 0.6) * sunSpec * 0.9 * glassy;
      glass = mix(glass, vec3(1.0, 0.85, 0.55), lit * 0.75);
      glass *= 0.82 + 0.3 * hash(id.yx + seed * 13.7);          // pane-to-pane variation
      vec3 slab = base * mix(vec3(0.78), vec3(1.0), diff) * 0.9;
      vec3 facade = mix(slab, glass, glassMask);
      facade *= 1.0 - 0.22 * mullion;
      facade *= 1.0 - 0.18 * smoothstep(0.0, 0.05, f.y) * (1.0 - smoothstep(0.05, 0.12, f.y)) ; // slab shadow line
      col = mix(col, facade, 0.92);
      // vertical fins on every ~4th bay for the "curtain wall" style
      if (style == 2.0) col *= 1.0 - 0.25 * step(0.5, fract(id.x * 0.25 + 0.01)) * step(f.x, 0.12);
    }
    // Ambient occlusion toward street level and a soft edge darkening
    col *= mix(0.55, 1.0, smoothstep(0.0, 22.0, vWorld.y));

    float fres = pow(1.0 - clamp(abs(dot(N, V)), 0.0, 1.0), 3.0);
    col += vec3(1.0, 0.84, 0.60) * 0.3 * fres * (0.4 + 0.6 * hh);
    col = mix(col, vec3(1.0, 0.82, 0.38), beacon * 0.95);

    float ff = 1.0 - exp(-pow(vFogDepth * uFogDensity, 2.0));
    float hf = exp(-max(vWorld.y, 0.0) * 0.011);
    ff = clamp(ff * (0.5 + 0.5 * hf), 0.0, 1.0);
    col = mix(col, uFogColor, ff);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uHigh;
  varying vec3 vDir;
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return s;
  }
  void main() {
    vec3 d = normalize(vDir);
    float y = d.y;
    vec3 zenith = vec3(0.15, 0.33, 0.62);
    vec3 mid    = vec3(0.60, 0.74, 0.88);
    vec3 hor    = mix(vec3(0.98, 0.82, 0.60), vec3(0.80, 0.88, 0.95), uHigh);
    vec3 col = mix(hor, mid, smoothstep(0.0, 0.2, y));
    col = mix(col, zenith, smoothstep(0.16, 0.8, y));

    // Warm sun glow low in front of the camera, behind the skyline.
    vec3 sunDir = normalize(vec3(0.22, 0.16, -1.0));
    float sd = dot(d, sunDir);
    col += vec3(1.0, 0.78, 0.42) * pow(max(sd, 0.0), 6.0) * 0.36 * exp(-max(y - 0.05, 0.0) * 3.0);
    col += vec3(1.0, 0.9, 0.62) * pow(max(sd, 0.0), 60.0) * 0.8;
    col += vec3(1.0, 0.97, 0.88) * smoothstep(0.9990, 0.9997, sd) * 1.6;

    // Soft drifting cumulus on a plane above the camera.
    vec2 cuv = d.xz / (max(y, 0.0) + 0.22) * 0.9 + vec2(uTime * 0.03, uTime * 0.004);
    float c = fbm(cuv * 1.3);
    float cm = smoothstep(0.52, 0.78, c) * smoothstep(0.02, 0.2, y);
    vec3 cloud = mix(vec3(1.0, 0.98, 0.94), vec3(0.86, 0.80, 0.70), smoothstep(0.55, 0.9, c));
    cloud += vec3(1.0, 0.85, 0.55) * pow(max(sd, 0.0), 4.0) * 0.25;
    col = mix(col, cloud, cm * 0.92);

    col = mix(col, mix(vec3(0.96, 0.85, 0.72), vec3(0.80, 0.87, 0.94), uHigh), smoothstep(0.0, -0.2, y));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const GROUND_VERT = /* glsl */ `
  varying vec3 vWorld;
  varying float vFogDepth;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vec4 mv = viewMatrix * wp;
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const GROUND_FRAG = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec3 vWorld;
  varying float vFogDepth;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return s;
  }

  void main() {
    vec2 xz = vWorld.xz;
    float ax = abs(xz.x);
    float fine = 1.0 - smoothstep(70.0, 420.0, vFogDepth);   // fine detail fades with range so it never shimmers

    // ---- Satellite layer -------------------------------------------------
    // City blocks sit on a 26 m grid (matching the building lattice): asphalt streets on the
    // cell edges, wider arterials every fourth street, and each lot paved, planted or parked.
    const float CELL = 26.0;
    vec2 cu = (xz + 13.0) / CELL;
    vec2 cf = fract(cu);
    vec2 cid = floor(cu);
    vec2 dEdge = min(cf, 1.0 - cf) * CELL;
    float minor = max(1.0 - smoothstep(1.5, 2.3, dEdge.x), 1.0 - smoothstep(1.5, 2.3, dEdge.y));
    vec2 da = abs(fract((xz + 13.0) / (CELL * 4.0) + 0.5) - 0.5) * CELL * 4.0;
    float arterial = max(1.0 - smoothstep(3.6, 4.6, da.x), 1.0 - smoothstep(3.6, 4.6, da.y));
    float streets = max(minor * 0.92, arterial);

    float h = hash(cid);
    vec3 lot = vec3(0.80, 0.72, 0.58);                       // sandstone
    lot = mix(lot, vec3(0.72, 0.70, 0.66), step(0.55, h));   // concrete
    lot = mix(lot, vec3(0.86, 0.80, 0.68), step(0.78, h));   // pale stone
    vec2 inLot = (cf - 0.5) * CELL;
    float stripes = step(0.5, fract(inLot.x / 2.6)) * fine * 0.10;
    lot = mix(lot, vec3(0.38, 0.38, 0.40) + stripes, step(0.22, h) * (1.0 - step(0.36, h)));  // car parks
    vec3 turf = mix(vec3(0.27, 0.40, 0.21), vec3(0.36, 0.48, 0.27), vnoise(xz * 0.35));
    lot = mix(lot, turf, 1.0 - step(0.22, h));               // parks and landscaping
    lot *= 0.94 + 0.12 * vnoise(xz * 0.9) * fine + 0.06 * fbm(xz * 0.05);

    vec3 asphalt = vec3(0.30, 0.30, 0.32) * (0.92 + 0.14 * vnoise(xz * 0.6) * fine);
    float centre = (1.0 - smoothstep(0.12, 0.3, min(da.x, da.y))) * step(0.5, fract((da.x < da.y ? xz.y : xz.x) / 10.0)) * fine;
    vec3 city = mix(lot, asphalt, streets);
    city = mix(city, vec3(0.93, 0.92, 0.86), centre * arterial * 0.8);

    // Desert and the Gulf beyond the lattice.
    vec3 sand = mix(vec3(0.84, 0.73, 0.54), vec3(0.74, 0.60, 0.40), fbm(xz * 0.012));
    sand *= 0.96 + 0.07 * vnoise(xz * 0.4) * fine;
    float shore = 400.0 + 38.0 * sin(xz.y * 0.011) + 26.0 * fbm(xz * 0.02);
    float sd = xz.x - shore;
    float wet = smoothstep(-14.0, 0.0, sd);
    vec3 shallow = vec3(0.40, 0.76, 0.74);
    vec3 deep = vec3(0.04, 0.27, 0.45);
    vec3 sea = mix(shallow, deep, smoothstep(0.0, 230.0, sd));
    sea += 0.045 * vnoise(vec2(xz.x * 0.05, xz.y * 0.09)) * fine;
    vec3 land = mix(sand, sand * 0.8, wet * (1.0 - step(0.0, sd)));
    vec3 outside = mix(land, sea, smoothstep(-0.6, 1.2, sd));
    outside = mix(outside, vec3(0.97, 0.97, 0.94), (1.0 - smoothstep(0.0, 5.0, abs(sd - 1.0))) * 0.55);  // surf line

    float inX = 1.0 - smoothstep(312.0, 338.0, ax);
    float inZ = smoothstep(-652.0, -620.0, xz.y) * (1.0 - smoothstep(104.0, 140.0, xz.y));
    vec3 satellite = mix(outside, city, inX * inZ);

    // ---- Street layer (unchanged): stone forecourt and the boulevard ------
    float road = 1.0 - smoothstep(7.0, 8.0, ax);
    float far = smoothstep(10.0, 150.0, ax);
    vec3 plaza = mix(vec3(0.95, 0.91, 0.83), vec3(0.88, 0.87, 0.84), far * 0.55);
    float joint = max(smoothstep(0.0, 0.05, abs(fract(xz.y / 12.0) - 0.5) - 0.45),
                      smoothstep(0.0, 0.05, abs(fract(xz.x / 12.0) - 0.5) - 0.45));
    plaza *= 1.0 - joint * 0.05 * (1.0 - smoothstep(30.0, 160.0, vFogDepth));
    float halfRoad = mix(78.0, 24.0, smoothstep(20.0, 220.0, -xz.y));
    // Landscaped forecourt: lawns in the cells either side of the boulevard, trees are instanced in JS.
    vec2 lc = (cf - 0.5) * CELL;
    float lawnCell = step(0.5, abs(cid.x)) * step(abs(cid.x), 2.5) * step(-1.5, cid.y) * step(cid.y, 4.5);
    float lawn = lawnCell * (1.0 - smoothstep(9.0, 9.7, max(abs(lc.x), abs(lc.y))));
    vec3 grass = mix(vec3(0.24, 0.39, 0.19), vec3(0.36, 0.51, 0.27), vnoise(xz * 0.45)) * (0.94 + 0.12 * fbm(xz * 0.09));
    float hedge = lawnCell * (1.0 - smoothstep(0.0, 0.5, abs(max(abs(lc.x), abs(lc.y)) - 9.2)));
    plaza = mix(plaza, grass, lawn);
    plaza = mix(plaza, vec3(0.14, 0.27, 0.13), hedge * 0.85);
    float forecourt = (1.0 - smoothstep(halfRoad - 3.0, halfRoad + 1.0, ax)) * inZ;
    vec3 col = mix(satellite, plaza, forecourt);
    col = mix(col, vec3(0.56, 0.53, 0.55), road);
    float dash = step(0.5, fract(xz.y / 8.0)) * (1.0 - smoothstep(0.12, 0.22, ax));
    col = mix(col, vec3(1.0, 0.98, 0.92), dash * road * 0.9);
    float edge = smoothstep(6.5, 6.75, ax) * (1.0 - smoothstep(6.75, 7.0, ax));
    col = mix(col, vec3(0.95, 0.74, 0.25), edge * 0.95);

    float ff = 1.0 - exp(-pow(vFogDepth * uFogDensity, 2.0));
    col = mix(col, uFogColor, clamp(ff * 1.05, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
  }
`;


const PROP_VERT = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vFogDepth;
  void main() {
    mat4 m = modelMatrix;
    #ifdef USE_INSTANCING
      m = modelMatrix * instanceMatrix;
    #endif
    vec4 wp = m * vec4(position, 1.0);
    vWorld = wp.xyz;
    vNormalW = normalize(mat3(m) * normal);
    vec4 mv = viewMatrix * wp;
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const PROP_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uGloss;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vFogDepth;
  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 L = normalize(vec3(0.55, 0.62, 0.56));
    float diff = clamp(dot(N, L), 0.0, 1.0);
    vec3 col = uColor * (0.52 + 0.62 * diff);
    vec3 R = reflect(-V, N);
    col += uGloss * (pow(max(dot(R, L), 0.0), 18.0) * 0.5 + 0.18 * clamp(R.y, 0.0, 1.0));
    float ff = 1.0 - exp(-pow(vFogDepth * uFogDensity, 2.0));
    gl_FragColor = vec4(mix(col, uFogColor, clamp(ff, 0.0, 1.0)), 1.0);
  }
`;

const FOLIAGE_VERT = /* glsl */ `
  attribute vec3 aTint;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying vec3 vTint;
  varying float vFogDepth;
  void main() {
    mat4 m = modelMatrix * instanceMatrix;
    vec4 wp = m * vec4(position, 1.0);
    vWorld = wp.xyz;
    vNormalW = normalize(mat3(m) * normal);
    vTint = aTint;
    vec4 mv = viewMatrix * wp;
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FOLIAGE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying vec3 vTint;
  varying float vFogDepth;
  float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  void main() {
    vec3 N = normalize(vNormalW);
    if (!gl_FrontFacing) N = -N;
    float diff = clamp(dot(N, normalize(vec3(0.55, 0.62, 0.56))), 0.0, 1.0);
    // Leaf clumps: fine dapple that fades with range, plus warm light bleeding through thin foliage.
    float clump = hash(floor(vWorld * 1.8)) * 0.3 + hash(floor(vWorld * 4.5)) * 0.16;
    float fine = 1.0 - smoothstep(60.0, 260.0, vFogDepth);
    vec3 col = uColor * vTint * (0.82 + clump * fine) * (0.52 + 0.78 * diff);
    col += vec3(0.16, 0.14, 0.04) * pow(1.0 - diff, 3.0) * 0.4;
    float ff = 1.0 - exp(-pow(vFogDepth * uFogDensity, 2.0));
    gl_FragColor = vec4(mix(col, uFogColor, clamp(ff, 0.0, 1.0)), 1.0);
  }
`;

const VEH_VERT = /* glsl */ `
  attribute float aPart;
  attribute float aLane;
  attribute float aSpeed;
  attribute float aOff;
  attribute float aDir;
  attribute vec3 aColor;
  uniform float uTime;
  varying vec3 vNormalW;
  varying vec3 vWorld;
  varying float vPart;
  varying vec3 vColor;
  varying float vFogDepth;
  void main() {
    float zFar = -520.0;
    float zNear = 92.0;
    float span = zNear - zFar;
    float z = zFar + mod(aOff + aDir * uTime * aSpeed, span);
    float sc = smoothstep(0.0, 60.0, z - zFar) * smoothstep(0.0, 18.0, zNear - z);
    vec3 p = position;
    vec3 n = normal;
    if (aDir < 0.0) { p.xz = -p.xz; n.xz = -n.xz; }
    p *= sc;
    vec3 wp = vec3(aLane + p.x, p.y, z + p.z);
    vWorld = wp;
    vNormalW = n;
    vPart = aPart;
    vColor = aColor;
    vec4 mv = viewMatrix * vec4(wp, 1.0);
    vFogDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const VEH_FRAG = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec3 vNormalW;
  varying vec3 vWorld;
  varying float vPart;
  varying vec3 vColor;
  varying float vFogDepth;
  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 L = normalize(vec3(0.45, 0.7, 0.55));
    float diff = clamp(dot(N, L), 0.0, 1.0);
    vec3 col;
    if (vPart < 0.5) {                 // paint
      col = vColor * (0.42 + 0.7 * diff);
      float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
      col += vec3(1.0, 0.9, 0.75) * fres * 0.22;
      col += vec3(1.0, 0.95, 0.85) * pow(max(dot(reflect(-L, N), V), 0.0), 24.0) * 0.45;
    } else if (vPart < 1.5) {          // glass
      vec3 R = reflect(-V, N);
      col = mix(vec3(0.07, 0.10, 0.15), vec3(0.55, 0.68, 0.82), clamp(R.y * 1.4 + 0.2, 0.0, 1.0)) * 0.9;
    } else if (vPart < 2.5) {          // tyres
      col = vec3(0.05, 0.05, 0.06) * (0.6 + 0.4 * diff);
    } else if (vPart < 3.5) {          // headlights
      col = vec3(1.0, 0.96, 0.84) * 1.6;
    } else if (vPart < 4.5) {          // taillights
      col = vec3(1.0, 0.10, 0.08) * 1.5;
    } else if (vPart < 5.5) {
      col = vec3(0.52, 0.56, 0.60) * (0.5 + diff);
    } else {
      col = vec3(0.92, 0.92, 0.88);
    }
    float ff = 1.0 - exp(-pow(vFogDepth * uFogDensity, 2.0));
    col = mix(col, uFogColor, clamp(ff * 0.9, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const BEACON_VERT = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  uniform float uPx;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(520.0 * uPx / max(-mv.z, 1.0), 2.0 * uPx, 30.0 * uPx);
    float b = smoothstep(0.55, 0.95, sin(uTime * 2.1 + aPhase));
    vA = 0.18 + 0.82 * b;
  }
`;

const BEACON_FRAG = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(0.92, 0.14, 0.10), a * vA);
  }
`;

export function createHeroScene(canvas, { mobile = false, hold = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    alpha: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0xf1ddc0, 1);
  let pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.5, 4500);
  const rand = mulberry32(20160607);
  scene.fog = new THREE.FogExp2(FOG_COLOR.getHex(), 0.0023);

  const uniforms = {
    uTime: { value: 0 },
    uFogColor: { value: FOG_COLOR },
    uFogDensity: { value: 0.0023 },
    uPx: { value: pixelRatio },
    uHigh: { value: 0 },
  };

  // ---- Sky (follows the camera so it never parallaxes)
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(2000, 32, 20),
    new THREE.ShaderMaterial({
      vertexShader: SKY_VERT,
      fragmentShader: SKY_FRAG,
      uniforms: { uTime: uniforms.uTime, uHigh: uniforms.uHigh },
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
    })
  );
  sky.renderOrder = -10;
  sky.frustumCulled = false;
  scene.add(sky);

  // ---- Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(4400, 4400),
    new THREE.ShaderMaterial({
      vertexShader: GROUND_VERT,
      fragmentShader: GROUND_FRAG,
      uniforms: { uFogColor: uniforms.uFogColor, uFogDensity: uniforms.uFogDensity },
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, -240);   // spans x -2200..2200 so the satellite view always has desert and sea to the edge
  scene.add(ground);

  // ---- Buildings (single instanced draw call)
  const unit = new THREE.BoxGeometry(1, 1, 1);
  unit.translate(0, 0.5, 0);
  const parts = [];
  const beacons = [];
  const CELL = 26;

  const casters = [];
  const push = (x, y, z, w, h, d, ry, seed, round = false) => {
    parts.push({ x, y, z, w, h, d, ry, seed, round });
    if (y === 0 && h > 8 && w < 40) casters.push([x, z, w, d, h]);
  };

  const smoothstepJS = (a, b, x) => smooth(clamp((x - a) / (b - a), 0, 1));
  for (let gx = -12; gx <= 12; gx++) {
    for (let gz = -24; gz <= 4; gz++) {
      const x = gx * CELL + (rand() - 0.5) * 4;
      const z = gz * CELL + (rand() - 0.5) * 4;
      const ax = Math.abs(x);
      // Wide open forecourt near the camera, narrowing to a boulevard downtown.
      const halfRoad = lerp(78, 24, smoothstepJS(20, 220, -z));
      if (ax < halfRoad) continue;
      const pBuild = 0.9 - 0.4 * smoothstepJS(120, 280, ax);
      if (rand() > pBuild) continue;
      const depthT = smoothstepJS(0, 540, -z);
      const lateral = 1 - clamp(ax / 260, 0, 1);
      let h = 14 + Math.pow(rand(), 2.2) * 62;
      h *= 0.55 + 2.3 * depthT * (0.4 + 0.6 * lateral);
      if (rand() < 0.07) h *= 2.0;
      const w = 9 + rand() * 10;
      const d = 9 + rand() * 10;
      const seed = rand();
      const drum = h > 70 && rand() < 0.14;
      push(x, 0, z, drum ? Math.min(w, d) + 2 : w, h, drum ? Math.min(w, d) + 2 : d, 0, seed, drum);
      if (h > 95 && rand() < 0.75) {
        const h2 = h * (0.22 + rand() * 0.18);
        push(x, h, z, w * 0.62, h2, d * 0.62, 0, fract1(seed + 0.31));
        if (h > 170) beacons.push([x, h + h2 + 1, z, rand() * 6.28]);
      } else if (h > 150) {
        beacons.push([x, h + 1, z, rand() * 6.28]);
      }
    }
  }

  // Rooftop plant rooms and antennas on the taller blocks
  {
    const base = parts.length;
    for (let i = 0; i < base; i++) {
      const q = parts[i];
      if (q.h > 70 && q.w > 7 && q.y === 0 && rand() < 0.8) {
        push(q.x + (rand() - 0.5) * q.w * 0.3, q.h, q.z, q.w * 0.36, 3.5 + rand() * 4, q.d * 0.36, 0, fract1(q.seed + 0.5));
        if (q.h > 120 && rand() < 0.7) push(q.x, q.h, q.z, 0.5, 10 + rand() * 18, 0.5, 0, 5.4);
      }
    }
  }

  // Podiums, recessed roof crowns and repeated balcony slabs break up box silhouettes.
  {
    const bases = parts.filter(p => p.y === 0 && p.h > 45 && p.z > -350);
    bases.forEach((p, i) => {
      push(p.x, 0, p.z, p.w + 3, 5.2, p.d + 3, 0, 0.12);
      push(p.x, p.h - 1.2, p.z, p.w + 0.8, 1.2, p.d + 0.8, 0, 0.12);
      if (i % 4 === 0) for (let y = 9; y < Math.min(p.h - 3, 100); y += 7.4)
        push(p.x, y, p.z, p.w + 0.65, 0.32, p.d + 0.9, 0, 0.15);
    });
  }

  // Landmark 1: a Burj-style Y-plan tower: three wings around a core, each tier stepping back in a slow spiral, topped by a spire.
  const crowns = [];
  {
    const lx = 46, lz = -318, tiers = 22, tierH = 17;
    for (let i = 0; i < tiers; i++) {
      const t = i / (tiers - 1);
      const arm = lerp(19, 2, Math.pow(t, 0.85));
      const spin = i * 0.1;
      const core = lerp(13, 5.5, t);
      push(lx, i * tierH, lz, core, tierH + 0.3, core, spin, 0.37);
      for (let k = 0; k < 3; k++) {
        const a = spin + k * 2.0944;
        push(lx + Math.cos(a) * arm * 0.5, i * tierH, lz - Math.sin(a) * arm * 0.5, arm, tierH + 0.3, 7.5 - t * 3, a, 0.37);
      }
    }
    push(lx, tiers * tierH, lz, 1.5, 78, 1.5, 0, 5.5);
    casters.push([lx, lz, 14, 14, tiers * tierH + 60]);
    beacons.push([lx, tiers * tierH + 80, lz, 0.4]);
  }
  // Landmark 2: a pair of Emirates-Towers-style shafts with pyramid crowns and masts.
  [[-56, -196, 26, 300], [-56, -250, 22, 252]].forEach(([lx, lz, w, H], i) => {
    push(lx, 0, lz, w, H, w, 0, 0.61 + i * 0.08);
    crowns.push([lx, H, lz, w * 0.68, 48 - i * 8]);
    push(lx, H + 40 - i * 8, lz, 0.9, 38, 0.9, 0, 5.5);
    beacons.push([lx, H + 80 - i * 8, lz, 2.2 + i]);
  });
  // A hazy backdrop row that closes the far end of the boulevard (no hard gap of raw sky).
  for (let i = -4; i <= 4; i++) {
    const h = 70 + rand() * 190;
    push(i * 17 + (rand() - 0.5) * 6, 0, -650 - rand() * 50, 13 + rand() * 11, h, 14, 0, rand());
  }
  // Two slim towers that frame the opening shot
  push(-96, 0, 10, 12, 96, 12, 0, 0.18);
  push(100, 0, -20, 12, 118, 12, 0, 0.82);
  beacons.push([-96, 97, 10, 1.1], [100, 119, -20, 3.0]);

  function fract1(v) { return v - Math.floor(v); }

  const axisY = new THREE.Vector3(0, 1, 0);
  const matrix = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const unitDrum = new THREE.CylinderGeometry(0.5, 0.5, 1, 28);
  unitDrum.translate(0, 0.5, 0);
  const buildingMaterial = (round) => new THREE.ShaderMaterial({
    vertexShader: BUILDING_VERT,
    fragmentShader: BUILDING_FRAG,
    defines: round ? { ROUND: 1 } : {},
    uniforms: { uTime: uniforms.uTime, uFogColor: uniforms.uFogColor, uFogDensity: uniforms.uFogDensity },
  });
  const makeInstances = (list, geometry, round) => {
    const seeds = new Float32Array(list.length);
    const mesh = new THREE.InstancedMesh(geometry, buildingMaterial(round), list.length);
    list.forEach((p, i) => {
      quat.setFromAxisAngle(axisY, p.ry);
      pos.set(p.x, p.y, p.z);
      scl.set(p.w, p.h, p.d);
      matrix.compose(pos, quat, scl);
      mesh.setMatrixAt(i, matrix);
      seeds[i] = p.seed;
    });
    mesh.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  };
  const count = parts.length;
  makeInstances(parts.filter((p) => !p.round), unit, false);
  makeInstances(parts.filter((p) => p.round), unitDrum, true);

  // Pyramid crowns (triangular-section, like the Emirates Towers) in glass and steel.
  crowns.forEach(([x, y, z, r, h]) => {
    const g = new THREE.ConeGeometry(r, h, 3);
    g.translate(0, h / 2, 0);
    const m = new THREE.Mesh(g, new THREE.ShaderMaterial({
      vertexShader: PROP_VERT, fragmentShader: PROP_FRAG,
      uniforms: { uColor: { value: new THREE.Color(0x6f8aa8) }, uGloss: { value: 0.9 }, uFogColor: uniforms.uFogColor, uFogDensity: uniforms.uFogDensity },
    }));
    m.position.set(x, y, z); m.rotation.y = Math.PI / 6;
    scene.add(m);
  });

  // ---- Long afternoon shadows, cast away from the sun (+x, +z): every caster's footprint swept along
  // the shadow vector, as a hexagon. From above this is what makes the city read as satellite imagery.
  {
    const SHADOW = 0.5;                       // horizontal shadow length per metre of height
    const verts = [];
    casters.forEach(([x, z, w, d, h]) => {
      const dx = -h * SHADOW * 0.9, dz = -h * SHADOW * 0.92;
      const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2;
      const hex = [[x1, z1], [x1, z0], [x1 + dx, z0 + dz], [x0 + dx, z0 + dz], [x0 + dx, z1 + dz], [x0, z1]];
      for (let i = 1; i < 5; i++) {
        [hex[0], hex[i], hex[i + 1]].forEach((v) => verts.push(v[0], 0.07, v[1]));
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
    const shadows = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: 0x0b1020, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide,
    }));
    shadows.frustumCulled = false;
    shadows.renderOrder = 1;
    scene.add(shadows);
  }


  // ---- Helpers for simple lit props and illuminated signage
  const onFrame = [];
  const signTextures = [];
  const propMat = (color, gloss = 0) => new THREE.ShaderMaterial({
    vertexShader: PROP_VERT, fragmentShader: PROP_FRAG,
    uniforms: { uColor: { value: new THREE.Color(color) }, uGloss: { value: gloss }, uFogColor: uniforms.uFogColor, uFogDensity: uniforms.uFogDensity },
  });
  const propBox = (w, h, d, x, y, z, color, gloss = 0) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), propMat(color, gloss));
    m.position.set(x, y, z); scene.add(m); return m;
  };
  const canvasTexture = (c) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    signTextures.push(t);
    return t;
  };
  const fitText = (ctx, text, maxW, start, weight) => {
    let size = start;
    do { ctx.font = `${weight} ${size}px "Helvetica Neue", Arial, sans-serif`; size -= 4; } while (ctx.measureText(text).width > maxW && size > 20);
    return size;
  };
  // Backlit tower crown sign: charcoal panel, gold keyline, warm white lettering.
  const towerSignTexture = (text) => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#202733'); g.addColorStop(1, '#0d1118');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 256);
    x.strokeStyle = '#d3ad55'; x.lineWidth = 7; x.strokeRect(12, 12, 1000, 232);
    x.strokeStyle = 'rgba(211,173,85,.45)'; x.lineWidth = 2; x.strokeRect(26, 26, 972, 204);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = 'rgba(255,214,140,.9)'; x.shadowBlur = 22; x.fillStyle = '#fff3d6';
    const words = text.split(' ');
    if (text.length > 15 && words.length > 1) {
      const mid = Math.ceil(words.length / 2);
      const l1 = words.slice(0, mid).join(' '), l2 = words.slice(mid).join(' ');
      const sz = Math.min(fitText(x, l1, 880, 104, 700), fitText(x, l2, 880, 104, 700));
      x.font = `700 ${sz}px "Helvetica Neue", Arial, sans-serif`;
      x.fillText(l1, 512, 98); x.fillText(l2, 512, 178);
    } else {
      fitText(x, text, 880, 140, 700); x.fillText(text, 512, 134);
    }
    return canvasTexture(c);
  };
  // UAE overhead direction sign: green board, white lettering, route shield.
  const gantryTexture = (line1, line2, shield) => {
    const c = document.createElement('canvas'); c.width = 768; c.height = 384;
    const x = c.getContext('2d');
    x.fillStyle = '#0a6a3c'; x.fillRect(0, 0, 768, 384);
    x.strokeStyle = '#f4f7f2'; x.lineWidth = 9; x.strokeRect(14, 14, 740, 356);
    x.fillStyle = '#f4f7f2'; x.textBaseline = 'middle';
    x.textAlign = 'left';
    const sz = fitText(x, line1, shield ? 470 : 640, 88, 700);
    x.font = `700 ${sz}px "Helvetica Neue", Arial, sans-serif`; x.fillText(line1, 44, 120);
    fitText(x, line2, 620, 52, 500); x.fillText(line2, 44, 250);
    // arrow
    x.beginPath(); x.moveTo(690, 330); x.lineTo(690, 290); x.lineTo(668, 290); x.lineTo(710, 244); x.lineTo(752, 290); x.lineTo(730, 290); x.lineTo(730, 330); x.closePath(); x.fill();
    if (shield) {
      x.fillStyle = '#f6c915'; x.beginPath(); x.roundRect(560, 44, 160, 112, 18); x.fill();
      x.fillStyle = '#10241a'; x.textAlign = 'center'; x.font = '800 66px "Helvetica Neue", Arial, sans-serif'; x.fillText(shield, 640, 102);
    }
    return canvasTexture(c);
  };
  const signPlane = (tex, w, h, x, y, z, rotY) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    m.position.set(x, y, z); m.rotation.y = rotY; scene.add(m); return m;
  };

  // ---- Tower signage: real Sheikh Zayed Road names, mounted on the crowns facing the avenue and the approach
  {
    const NAMES = ['EMAAR', 'THE ADDRESS', 'DAMAC', 'JW MARRIOTT MARQUIS', 'SOBHA', 'DUBAI WORLD TRADE CENTRE', 'BINGHATTI', 'FAIRMONT', 'INDEX TOWER', 'ARADA', 'MILLENNIUM PLAZA', 'DANUBE'];
    // Only towers that stand clear of everything between them and the approaching camera carry a sign, so every
    // sign is fully visible; each one is mounted on the roof edge on struts and faces down the avenue.
    const clear = (q) => !parts.some((o) => o !== q && o.z > q.z && o.z < q.z + 170 && Math.abs(o.x - q.x) < (o.w + q.w) / 2 + 2 && o.y + o.h > q.h + 2);
    const cand = parts.filter((q) => q.y === 0 && !q.round && q.h > 80 && q.w > 12 && q.z > -470 && q.z < -14 && Math.abs(q.x) < 125 && clear(q))
      .sort((u, v) => v.z - u.z);
    const picked = [];
    cand.forEach((q) => {
      if (picked.length >= (mobile ? 6 : 10)) return;
      if (picked.some((o) => Math.abs(o.z - q.z) < 55 || (Math.sign(o.x) === Math.sign(q.x) && Math.abs(o.z - q.z) < 90))) return;
      picked.push(q);
    });
    picked.forEach((q, i) => {
      const tex = towerSignTexture(NAMES[i % NAMES.length]);
      const w = Math.min(q.w * 1.12, 34), h = w / 4, zf = q.z + q.d / 2 - 1.2;
      signPlane(tex, w, h, q.x, q.h + 3 + h / 2, zf, 0);
      propBox(w + 0.6, h + 0.6, 0.3, q.x, q.h + 3 + h / 2, zf - 0.22, 0x1a1f27);                 // sign casing
      [-1, 1].forEach((sd) => propBox(0.35, 3.2, 0.35, q.x + sd * w * 0.38, q.h + 1.5, zf - 0.2, 0x59616b));
    });
    // Street-level blade signs: lit name boards on the front corner of the first row of buildings, reaching out over the
    // pavement at eye height so they read head-on as the camera drives past (clear of the metro and the camera path).
    {
      const firstRow = parts.filter((q) => q.y === 0 && !q.round && q.h > 24 && q.w > 8 && q.z < 60 && q.z > -340 && Math.abs(q.x) < 80)
        .sort((u, v) => v.z - u.z);
      const used = [];
      firstRow.forEach((q) => {
        if (used.length >= (mobile ? 5 : 9)) return;
        const side = Math.sign(q.x) || 1;
        const rowMin = parts.filter((o) => o.y === 0 && Math.sign(o.x) === side && Math.abs(o.z - q.z) < 12).reduce((m, o) => Math.min(m, Math.abs(o.x)), 1e9);
        if (Math.abs(q.x) > rowMin + 0.01) return;
        if (used.some((o) => Math.abs(o.z - q.z) < 34 && (Math.sign(o.x) === side || Math.abs(o.z - q.z) < 18))) return;
        used.push(q);
        const fx = q.x - side * q.w / 2, cx = fx - side * 4.4, zf = q.z + q.d / 2 - 0.5;
        signPlane(towerSignTexture(NAMES[(used.length * 5 + 3) % NAMES.length]), 8, 2, cx, 15.8, zf + 0.34, 0);
        propBox(8.5, 2.5, 0.4, cx, 15.8, zf, 0x1a1f27);
        propBox(0.3, 0.3, 0.3, fx - side * 0.3, 15.8, zf, 0x59616b);
      });
    }
    [[-56, -196, 26, 300, 'EMIRATES OFFICE TOWER'], [-56, -250, 22, 252, 'JUMEIRAH EMIRATES TOWERS']].forEach(([x, z, w, H, name]) => {
      signPlane(towerSignTexture(name), w * 0.92, w * 0.92 / 4, x, H - 12, z + w / 2 + 0.12, 0);
    });
  }

  // ---- Sheikh Zayed Road overhead gantries
  {
    const BOARDS = [
      [58,  ['Abu Dhabi', 'Jebel Ali · Dubai Marina', 'E 11'], ['Downtown Dubai', 'Dubai Mall · Burj Khalifa', 'E 11']],
      [-10, ['Business Bay', 'Al Khail Road · Ras Al Khor'],   ['Dubai Mall', 'Burj Khalifa · Downtown']],
      [-96, ['World Trade Centre', 'DIFC · Trade Centre'],     ['Al Quoz', 'Jumeirah · Umm Suqeim']],
      [-184, ['Deira', 'Sharjah · Airport'],                    ['Sheikh Zayed Road', 'Dubai · Abu Dhabi', 'E 11']],
      [-280, ['Downtown Dubai', 'Emaar Boulevard'],             ['Business Bay', 'Canal · Al Safa']],
    ];
    BOARDS.slice(0, mobile ? 4 : 5).forEach(([z, left, right]) => {
      [-1, 1].forEach((sx) => propBox(0.5, 9.4, 0.5, sx * 10.2, 4.7, z, 0x7b848e, 0.2));
      propBox(21, 0.55, 0.7, 0, 9.3, z, 0x7b848e, 0.2);
      [[-4.9, left], [4.9, right]].forEach(([bx, [l1, l2, shield]]) => {
        const board = signPlane(gantryTexture(l1, l2, shield), 8.6, 4.3, bx, 6.85, z + 0.42, 0);
        propBox(8.9, 4.6, 0.3, bx, 6.85, z + 0.12, 0x2d343c);        // back of the board
        board.renderOrder = 2;
      });
    });
  }

  // ---- Stone central reservation, limestone pavements and boulevard lighting
  {
    // Kerbs, pavements and a planted central reservation
    const flat = (w, h, len, x, y, color) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, len), new THREE.MeshBasicMaterial({ color }));
      m.position.set(x, y, 98 - len / 2); scene.add(m);
    };
    const roadLen = 760;
    flat(4.2, 0.22, roadLen, -9.2, 0.11, 0xd9d2c3); flat(4.2, 0.22, roadLen, 9.2, 0.11, 0xd9d2c3);
    flat(0.35, 0.3, roadLen, -7.1, 0.15, 0xb9b3a6); flat(0.35, 0.3, roadLen, 7.1, 0.15, 0xb9b3a6);
    flat(1.3, 0.4, roadLen, 0, 0.2, 0xbca68b);
    flat(0.2, 0.5, roadLen, 0.75, 0.25, 0xb9b3a6); flat(0.2, 0.5, roadLen, -0.75, 0.25, 0xb9b3a6);

    const lampGeo = new THREE.CylinderGeometry(0.1, 0.15, 1, 6);
    lampGeo.translate(0, 0.5, 0);
    const headGeo = new THREE.BoxGeometry(1.9, 0.2, 0.5);      // luminaire head on an arm reaching over the carriageway
    const lampMat = new THREE.MeshBasicMaterial({ color: 0x58606c });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xd9dde2 });
    const N = mobile ? 26 : 44;
    const lamps = new THREE.InstancedMesh(lampGeo, lampMat, N * 2);
    const bulbs = new THREE.InstancedMesh(headGeo, bulbMat, N * 2);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const v = new THREE.Vector3();
    const sv = new THREE.Vector3();
    let k = 0;
    for (let i = 0; i < N; i++) {
      for (const side of [-1, 1]) {
        const z = 38 - i * 15;
        const lz = z - 7.5;
        v.set(side * 8.2, 0, lz); sv.set(1, 7.5, 1);
        m.compose(v, q, sv); lamps.setMatrixAt(k, m);
        v.set(side * 7.3, 7.6, lz); sv.set(1, 1, 1);
        m.compose(v, q, sv); bulbs.setMatrixAt(k, m);
        k++;
      }
    }
    [lamps, bulbs].forEach((o) => { o.frustumCulled = false; scene.add(o); });
  }

  // ---- Vegetation: date palms with individual fronds, and broadleaf trees built from displaced leaf clumps
  {
    const upV = new THREE.Vector3(0, 1, 0);
    const mkGeo = (pos, nor, tint, idx) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute('aTint', new THREE.Float32BufferAttribute(tint, 3));
      if (idx) g.setIndex(idx);
      return g;
    };
    const PALM_H = 9, LEAN = 1.1;
    const palmTrunk = (() => {
      const pos = [], nor = [], tint = [], idx = [], S = 12, R = 8;
      for (let i = 0; i <= S; i++) {
        const t = i / S, r = lerp(0.34, 0.2, t) * (i === 0 ? 1.4 : 1), cx = LEAN * t * t;
        for (let j = 0; j <= R; j++) {
          const a = (j / R) * Math.PI * 2, nx = Math.cos(a), nz = Math.sin(a);
          pos.push(cx + nx * r, PALM_H * t, nz * r); nor.push(nx, 0.2, nz);
          const ring = (i % 2 ? 0.74 : 1) * (0.86 + 0.14 * Math.sin(j * 2.3 + i));    // leaf-base scars up the stem
          tint.push(ring, ring, ring);
        }
      }
      for (let i = 0; i < S; i++) for (let j = 0; j < R; j++) { const q = i * (R + 1) + j, w = q + R + 1; idx.push(q, w, q + 1, w, w + 1, q + 1); }
      return mkGeo(pos, nor, tint, idx);
    })();
    const palmCrown = (() => {
      const pos = [], nor = [], tint = [], FR = 14, K = 11;
      const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
      for (let f = 0; f < FR; f++) {
        const phi = (f / FR) * Math.PI * 2 + Math.sin(f * 12.9) * 0.2;
        const hi = f % 2 === 0, el = hi ? 0.95 : 0.3 + Math.sin(f) * 0.08, L = hi ? 3.5 : 3.9 + Math.sin(f * 3.1) * 0.25;
        const pts = [];
        for (let k = 0; k <= K; k++) {
          const sk = k / K, r = L * sk * Math.cos(el);
          pts.push(v3(LEAN + Math.cos(phi) * r, PALM_H + L * (Math.sin(el) * sk - 0.8 * sk * sk), Math.sin(phi) * r));
        }
        const sideV = v3(-Math.sin(phi), 0, Math.cos(phi));
        for (let k = 1; k < K; k++) {
          const sk = k / K, P = pts[k], T = pts[k + 1].clone().sub(pts[k - 1]).normalize();
          for (const sd of [-1, 1]) {
            const len = (0.35 + 1.15 * Math.sin(Math.PI * Math.min(1, sk * 0.95 + 0.04))) * (hi ? 0.92 : 1);
            const dirL = sideV.clone().multiplyScalar(sd * 0.9).addScaledVector(T, 0.55).addScaledVector(upV, -0.5 - 0.35 * sk).normalize();
            const tip = P.clone().addScaledVector(dirL, len), B = P.clone().addScaledVector(T, 0.27), C = tip.clone().addScaledVector(T, 0.16);
            const n = new THREE.Vector3().subVectors(B, P).cross(new THREE.Vector3().subVectors(C, P)).normalize();
            if (n.y < 0) n.negate();
            n.multiplyScalar(0.45).addScaledVector(upV, 0.55).normalize();
            const shade = 0.72 + 0.4 * sk + 0.08 * Math.sin(k * 5 + f);
            [P, B, C, P, C, tip].forEach((q) => { pos.push(q.x, q.y, q.z); nor.push(n.x, n.y, n.z); tint.push(shade, shade, shade); });
          }
        }
      }
      return mkGeo(pos, nor, tint);
    })();
    const broadCrown = (() => {
      const pos = [], nor = [], tint = [];
      const blobs = [[0, 0, 0, 1.35], [1.0, -0.25, 0.3, 0.98], [-0.9, -0.15, 0.55, 1.0], [0.2, 0.2, -1.0, 1.0], [-0.3, 0.7, 0.2, 0.92], [0.7, 0.45, -0.45, 0.85]];
      blobs.forEach(([cx, cy, cz, r], bi) => {
        const ico = new THREE.IcosahedronGeometry(1, 2), pa = ico.attributes.position;
        for (let i = 0; i < pa.count; i++) {
          const nx = pa.getX(i), ny = pa.getY(i), nz = pa.getZ(i);
          const bump = 1 + 0.2 * (Math.sin(nx * 5.3 + bi) * Math.sin(ny * 4.1 + bi * 2) * 0.5 + Math.sin(nz * 7.7 + bi * 1.7) * 0.5);
          const x = cx + nx * r * bump, y = cy + ny * r * bump * 0.88, z = cz + nz * r * bump;
          pos.push(x, y, z); nor.push(nx, ny, nz);
          const sh = 0.58 + 0.5 * clamp((y + 1.3) / 2.8, 0, 1);
          tint.push(sh, sh, sh * 0.96);
        }
      });
      return mkGeo(pos, nor, tint);
    })();
    const broadTrunk = (() => {
      const g = new THREE.CylinderGeometry(0.2, 0.34, 3.6, 7); g.translate(0, 1.8, 0);
      const n = g.attributes.position.count;
      g.setAttribute('aTint', new THREE.Float32BufferAttribute(new Array(n * 3).fill(0.85), 3));
      return g;
    })();
    const foliageMat = (color) => new THREE.ShaderMaterial({
      vertexShader: FOLIAGE_VERT, fragmentShader: FOLIAGE_FRAG, side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color(color) }, uFogColor: uniforms.uFogColor, uFogDensity: uniforms.uFogDensity },
    });

    const palms = [], broad = [];
    for (let z = 90; z > -44; z -= 12) {
      if ([58, -10].some((gz) => Math.abs(z - gz) < 4.5)) continue;                // keep clear of the overhead gantries
      palms.push([-10.0, z, 0.72]); palms.push([10.0, z, 0.72]);
    }
    for (const gx of [-2, -1, 1, 2]) {
      for (let gz = -1; gz <= 4; gz++) {
        const cx = gx * CELL, cz = gz * CELL;
        broad.push([cx + (rand() - 0.5) * 2, cz + (rand() - 0.5) * 2, 1.15 + rand() * 0.35]);
        [[-6.2, -6.2], [6.2, -6.2], [-6.2, 6.2], [6.2, 6.2]].forEach(([ox, oz]) => palms.push([cx + ox + (rand() - 0.5) * 1.2, cz + oz + (rand() - 0.5) * 1.2, 0.85 + rand() * 0.3]));
      }
    }
    const tm = new THREE.Matrix4(), tq = new THREE.Quaternion(), tp = new THREE.Vector3(), ts = new THREE.Vector3();
    const place = (geo, color, list, y0 = 0) => {
      const mesh = new THREE.InstancedMesh(geo, foliageMat(color), list.length);
      list.forEach(([x, z, k], i) => {
        tq.setFromAxisAngle(upV, rand() * Math.PI * 2); tp.set(x, y0 * k, z); ts.set(k, k * (0.92 + rand() * 0.16), k);
        tm.compose(tp, tq, ts); mesh.setMatrixAt(i, tm);
      });
      mesh.frustumCulled = false; scene.add(mesh);
    };
    place(palmTrunk, 0x8d7c66, palms);
    place(palmCrown, 0x5a8e34, palms);
    place(broadTrunk, 0x6a5848, broad);
    place(broadCrown, 0x4e8a34, broad, 4.7);
  }

  // ---- Dubai Metro viaduct and trains alongside the carriageway (the Sheikh Zayed Road signature)
  {
    const trainCanvas = document.createElement('canvas'); trainCanvas.width = 512; trainCanvas.height = 128;
    const tx = trainCanvas.getContext('2d');
    tx.fillStyle = '#d9dde3'; tx.fillRect(0, 0, 512, 128);
    tx.fillStyle = '#1b2430'; for (let i = 0; i < 5; i++) tx.fillRect(14 + i * 100, 30, 76, 40);          // windows
    tx.fillStyle = '#c8102e'; tx.fillRect(0, 84, 512, 18);                                                // Red Line stripe
    tx.fillStyle = '#8f98a4'; tx.fillRect(0, 106, 512, 22);
    const trainTex = new THREE.CanvasTexture(trainCanvas); trainTex.colorSpace = THREE.SRGBColorSpace;
    signTextures.push(trainTex);
    const trainMat = new THREE.MeshBasicMaterial({ map: trainTex });
    const L = 700, zMid = -250;
    const pierGeo = new THREE.BoxGeometry(1.4, 9.05, 1.7); pierGeo.translate(0, 4.5, 0);
    [-1, 1].forEach((sx, si) => {
      const x = sx * 16.2;
      propBox(4.9, 0.9, L, x, 9.5, zMid, 0xdad7d0, 0.1);                               // deck
      propBox(0.3, 0.7, L, x - 2.3, 10.3, zMid, 0xc9c6bf);                              // parapets
      propBox(0.3, 0.7, L, x + 2.3, 10.3, zMid, 0xc9c6bf);
      propBox(0.14, 0.18, L, x - 0.75, 10.04, zMid, 0x5a6068); propBox(0.14, 0.18, L, x + 0.75, 10.04, zMid, 0x5a6068);   // rails
      const piers = new THREE.InstancedMesh(pierGeo, propMat(0xd0cdc6), 24);
      const pm = new THREE.Matrix4();
      for (let i = 0; i < 24; i++) { pm.makeTranslation(x, 0, 92 - i * 28); piers.setMatrixAt(i, pm); }
      piers.frustumCulled = false; scene.add(piers);
      const train = new THREE.Group();
      for (let c = 0; c < 4; c++) {
        const car = new THREE.Mesh(new THREE.BoxGeometry(2.9, 3.5, 17.5), trainMat);
        car.position.set(0, 11.9, c * 18.2); train.add(car);
      }
      train.rotation.y = sx > 0 ? 0 : Math.PI;
      scene.add(train);
      const speed = 17 + si * 4, span = L + 160;
      onFrame.push((t) => {                                       // trains cycle the full length of the viaduct, one each way
        const u = ((t * speed + si * 260) % span) - 80;
        train.position.set(x, 0, sx > 0 ? 100 - u : -600 + u);
      });
    });
  }

  // ---- Realistic traffic: instanced sedans and SUVs (white-heavy UAE fleet) with lit head/tail lamps
  function mergeParts(list) {
    const pos = [], nor = [], part = [];
    list.forEach((it) => {
      const g = it.geo.index ? it.geo.toNonIndexed() : it.geo;
      if (it.m) g.applyMatrix4(it.m);
      const pa = g.attributes.position.array, na = g.attributes.normal.array;
      for (let i = 0; i < pa.length; i++) { pos.push(pa[i]); nor.push(na[i]); }
      for (let i = 0; i < pa.length / 3; i++) part.push(it.part);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nor), 3));
    g.setAttribute('aPart', new THREE.BufferAttribute(new Float32Array(part), 1));
    return g;
  }
  function taperedBox(w, h, l, top) {
    const g = new THREE.BoxGeometry(w, h, l);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) if (p.getY(i) > 0) { p.setX(i, p.getX(i) * top); p.setZ(i, p.getZ(i) * (top + 0.08)); }
    g.computeVertexNormals();
    return g;
  }
  const T = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
  function buildCar(kind) {
    const suv = kind === 'suv';
    const W = suv ? 1.95 : 1.82, L = suv ? 4.95 : 4.65, R = suv ? 0.42 : 0.35;
    const bodyH = suv ? 0.82 : 0.62, cabH = suv ? 0.72 : 0.5, cabL = suv ? 3.15 : 2.35;
    const list = [];
    list.push({ geo: new THREE.BoxGeometry(W, bodyH, L), part: 0, m: T(0, R * 0.9 + bodyH / 2, 0) });
    list.push({ geo: taperedBox(W * 0.92, cabH, cabL, 0.86), part: 1, m: T(0, R * 0.9 + bodyH + cabH / 2 - 0.02, suv ? -0.35 : -0.25) });
    list.push({ geo: new THREE.BoxGeometry(W * 0.86, 0.06, cabL * 0.78), part: 0, m: T(0, R * 0.9 + bodyH + cabH, suv ? -0.35 : -0.25) });
    const wheelGeo = new THREE.CylinderGeometry(R, R, 0.26, 12); wheelGeo.rotateZ(Math.PI / 2);
    [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => list.push({ geo: wheelGeo.clone(), part: 2, m: T(sx * (W / 2 - 0.1), R, sz * L * 0.33) }));
    [-1, 1].forEach((sx) => {
      list.push({ geo: new THREE.BoxGeometry(0.46, 0.14, 0.08), part: 3, m: T(sx * (W / 2 - 0.3), R * 0.9 + bodyH * 0.72, L / 2) });
      list.push({ geo: new THREE.BoxGeometry(0.5, 0.12, 0.08), part: 4, m: T(sx * (W / 2 - 0.3), R * 0.9 + bodyH * 0.72, -L / 2) });
    });
    // Body-coloured pillars make the glass cabin read as individual windows.
    [-1, 1].forEach(sx => {
      list.push({ geo: new THREE.BoxGeometry(0.055, cabH, 0.12), part: 0, m: T(sx * W * 0.44, R * 0.9 + bodyH + cabH / 2, -0.25) });
      list.push({ geo: taperedBox(0.22, 0.13, 0.32, 0.8), part: 0, m: T(sx * (W / 2 + 0.07), R * 0.9 + bodyH + 0.13, cabL * 0.28) });
      [-1, 1].forEach(sz => {
        const rim = new THREE.CylinderGeometry(R * 0.61, R * 0.61, 0.025, 16); rim.rotateZ(Math.PI / 2);
        list.push({ geo: rim, part: 5, m: T(sx * (W / 2 + 0.04), R, sz * L * 0.33) });
      });
    });
    list.push({ geo: new THREE.BoxGeometry(W * 0.48, 0.22, 0.035), part: 2, m: T(0, R + bodyH * 0.25, L / 2 + 0.045) });
    [-1, 1].forEach(sz => list.push({ geo: new THREE.BoxGeometry(0.42, 0.12, 0.04), part: 6, m: T(0, R + bodyH * 0.35, sz * (L / 2 + 0.07)) }));
    return mergeParts(list);
  }
  const PAINT = [[0.97, 0.97, 0.96], [0.97, 0.97, 0.96], [0.96, 0.96, 0.94], [0.93, 0.93, 0.92], [0.72, 0.74, 0.78], [0.55, 0.57, 0.6], [0.08, 0.08, 0.09], [0.1, 0.12, 0.16], [0.55, 0.08, 0.1], [0.9, 0.78, 0.45]];
  const vehMat = new THREE.ShaderMaterial({
    vertexShader: VEH_VERT, fragmentShader: VEH_FRAG,
    uniforms: { uTime: uniforms.uTime, uFogColor: uniforms.uFogColor, uFogDensity: uniforms.uFogDensity },
  });
  [['suv', mobile ? 26 : 46], ['sedan', mobile ? 22 : 40]].forEach(([kind, n]) => {
    const geo = buildCar(kind);
    const ln = new Float32Array(n), sp = new Float32Array(n), of = new Float32Array(n), dr = new Float32Array(n), cl = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const d = i % 2 === 0 ? 1 : -1;
      const lanes = d > 0 ? [-2.5, -5.4] : [2.5, 5.4];
      ln[i] = lanes[(rand() * 2) | 0];
      sp[i] = 11 + rand() * 9;
      of[i] = rand() * 612;
      dr[i] = d;
      const c = PAINT[(rand() * PAINT.length) | 0];
      cl[i * 3] = c[0]; cl[i * 3 + 1] = c[1]; cl[i * 3 + 2] = c[2];
    }
    geo.setAttribute('aLane', new THREE.InstancedBufferAttribute(ln, 1));
    geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(sp, 1));
    geo.setAttribute('aOff', new THREE.InstancedBufferAttribute(of, 1));
    geo.setAttribute('aDir', new THREE.InstancedBufferAttribute(dr, 1));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(cl, 3));
    const mesh = new THREE.InstancedMesh(geo, vehMat, n);
    mesh.frustumCulled = false;
    scene.add(mesh);
  });

  // ---- Motorbikes with riders, weaving between the cars (same instanced traffic shader)
  {
    const list = [];
    const bike = (g, part, m) => list.push({ geo: g, part, m });
    const wheel = (zc) => { const w = new THREE.CylinderGeometry(0.33, 0.33, 0.13, 14); w.rotateZ(Math.PI / 2); bike(w, 2, T(0, 0.33, zc)); const r = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 12); r.rotateZ(Math.PI / 2); bike(r, 5, T(0, 0.33, zc)); };
    wheel(0.72); wheel(-0.72);
    const R = (rx, ry, rz) => new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz));
    bike(new THREE.BoxGeometry(0.3, 0.34, 0.85), 0, T(0, 0.78, 0.18));             // tank
    bike(new THREE.BoxGeometry(0.26, 0.12, 0.7), 2, T(0, 0.74, -0.38));            // seat
    bike(new THREE.BoxGeometry(0.34, 0.36, 0.42), 5, T(0, 0.46, 0.05));            // engine
    bike(new THREE.BoxGeometry(0.1, 0.62, 0.1), 5, T(0, 0.62, 0.66).multiply(R(-0.35, 0, 0)));   // forks
    bike(new THREE.BoxGeometry(0.7, 0.06, 0.06), 5, T(0, 1.0, 0.52));              // bars
    bike(new THREE.BoxGeometry(0.2, 0.14, 0.1), 3, T(0, 0.9, 0.76));               // headlight
    bike(new THREE.BoxGeometry(0.18, 0.08, 0.06), 4, T(0, 0.8, -0.82));            // tail lamp
    bike(new THREE.BoxGeometry(0.34, 0.55, 0.28), 2, T(0, 1.22, -0.12).multiply(R(0.42, 0, 0)));   // rider torso, leaning in
    bike(new THREE.SphereGeometry(0.17, 10, 8), 6, T(0, 1.67, 0.1));               // helmet
    [-1, 1].forEach((sd) => {
      bike(new THREE.BoxGeometry(0.13, 0.5, 0.16), 2, T(sd * 0.2, 0.86, -0.1).multiply(R(0.9, 0, 0)));  // legs
      bike(new THREE.BoxGeometry(0.1, 0.1, 0.5), 2, T(sd * 0.32, 1.22, 0.36).multiply(R(0.25, 0, 0)));  // arms
    });
    const geo = mergeParts(list);
    const n = mobile ? 8 : 16;
    const ln = new Float32Array(n), sp = new Float32Array(n), of = new Float32Array(n), dr = new Float32Array(n), cl = new Float32Array(n * 3);
    const BIKE_PAINT = [[0.8, 0.1, 0.08], [0.1, 0.2, 0.55], [0.08, 0.08, 0.09], [0.95, 0.45, 0.08], [0.85, 0.85, 0.86]];
    for (let i = 0; i < n; i++) {
      const d = i % 2 === 0 ? 1 : -1;
      ln[i] = (d > 0 ? -3.95 : 3.95) + (rand() - 0.5) * 0.5;
      sp[i] = 15 + rand() * 11;
      of[i] = rand() * 612;
      dr[i] = d;
      const c = BIKE_PAINT[(rand() * BIKE_PAINT.length) | 0];
      cl[i * 3] = c[0]; cl[i * 3 + 1] = c[1]; cl[i * 3 + 2] = c[2];
    }
    geo.setAttribute('aLane', new THREE.InstancedBufferAttribute(ln, 1));
    geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(sp, 1));
    geo.setAttribute('aOff', new THREE.InstancedBufferAttribute(of, 1));
    geo.setAttribute('aDir', new THREE.InstancedBufferAttribute(dr, 1));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(cl, 3));
    const mesh = new THREE.InstancedMesh(geo, vehMat, n);
    mesh.frustumCulled = false;
    scene.add(mesh);
  }

  // ---- Aircraft-warning beacons on the tallest towers
  const bGeo = new THREE.BufferGeometry();
  const bp = new Float32Array(beacons.length * 3);
  const bph = new Float32Array(beacons.length);
  beacons.forEach((b, i) => { bp[i * 3] = b[0]; bp[i * 3 + 1] = b[1]; bp[i * 3 + 2] = b[2]; bph[i] = b[3]; });
  bGeo.setAttribute('position', new THREE.BufferAttribute(bp, 3));
  bGeo.setAttribute('aPhase', new THREE.BufferAttribute(bph, 1));
  const beaconPts = new THREE.Points(
    bGeo,
    new THREE.ShaderMaterial({
      vertexShader: BEACON_VERT,
      fragmentShader: BEACON_FRAG,
      uniforms: { uTime: uniforms.uTime, uPx: uniforms.uPx },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
  );
  beaconPts.frustumCulled = false;
  scene.add(beaconPts);

  // ---- Camera rig
  const state = { p: 0, px: 0, py: 0 };
  const cur = { p: 0, px: 0, py: 0 };
  let introT = 1;
  let running = false;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let frames = 0;
  let slowAcc = 0;
  let readyFired = false;
  let disposed = false;
  const api = { onReady: null, onSlow: null };

  function resize() {
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.userData.portrait = camera.aspect < 0.85;
    camera.updateProjectionMatrix();
  }

  // Scroll journey: 0..SPLIT is the satellite descent (straight down at ORBIT_Y, levelling out as the
  // altitude falls to street height above the boulevard); SPLIT..1 drives down the avenue.
  const SPLIT = 0.52, ORBIT_Y = 820, STREET_Y = 18;
  const ORBIT_FOV = 34;                    // a long lens flattens perspective, which is what makes the opening read as isometric
  const ISO_PITCH = -48, ISO_YAW = 0.62;   // opening tilt (degrees) and compass turn (radians, ~35 deg)

  function placeCamera(dt) {
    const k = 1 - Math.exp(-dt * 7.5);
    cur.p += (state.p - cur.p) * k;
    cur.px += (state.px - cur.px) * (1 - Math.exp(-dt * 3));
    cur.py += (state.py - cur.py) * (1 - Math.exp(-dt * 3));
    introT = Math.min(1, introT + dt / 2.6);
    const ie = easeOutCubic(introT);
    const p = clamp(cur.p, 0, 1);
    const d = clamp(p / SPLIT, 0, 1);
    const de = easeInOutSine(d);
    const t = clamp((p - SPLIT) / (1 - SPLIT), 0, 1);

    // Altitude falls exponentially so the zoom feels constant, like a satellite app.
    let y = STREET_Y * Math.pow(ORBIT_Y / STREET_Y, 1 - de) + lerp(0, 19, Math.pow(t, 1.1));
    y *= 1 + 0.16 * (1 - ie);                                   // opening drift: settle in from a touch higher
    const z = p < SPLIT ? lerp(-230, 95, easeInOutSine(Math.pow(d, 0.92))) : lerp(95, -170, easeInOutSine(t));

    const street = smooth(clamp(1 - (y - 18) / 320, 0, 1));    // 0 in orbit .. 1 at street level
    const sway = Math.sin(p * Math.PI * 1.25) * 7.5 * (0.25 + 0.75 * street);
    const x = clamp(sway + cur.px * lerp(30, 2.6, street) + Math.sin(clock * 0.13) * 0.9 * street, -(9.5 + 30 * (1 - street)), 9.5 + 30 * (1 - street));
    // Isometric opening: look at the ground point below (x, z) from a raised, turned vantage, then swing
    // round behind the boulevard and level out as the altitude falls.
    const pitchDeg = ISO_PITCH + (ISO_PITCH * -1 - 4) * Math.pow(de, 1.35) - 4 * t - cur.py * 1.4;
    const pitch = pitchDeg * Math.PI / 180;
    const yaw = ISO_YAW * Math.pow(1 - de, 1.1) - cur.px * 0.03 * street;
    const hx = Math.sin(yaw), hz = -Math.cos(yaw);
    const back = (y / Math.tan(-pitch)) * Math.pow(1 - de, 0.8);
    camera.position.set(x - hx * back, y + cur.py * 1.6 * street + Math.sin(clock * 0.21) * 0.35 * street, z - hz * back);
    const dir = new THREE.Vector3(hx * Math.cos(pitch), Math.sin(pitch), hz * Math.cos(pitch));
    camera.lookAt(camera.position.clone().addScaledVector(dir, 300));
    camera.rotation.z += (Math.sin(p * Math.PI * 2) * 0.03 + cur.px * -0.012 + Math.sin(clock * 0.9) * 0.0025) * street;

    const baseFov = camera.userData.portrait ? 70 : 56;
    const fov = lerp(ORBIT_FOV, baseFov, smooth(de)) + 10 * t;
    const near = clamp(camera.position.y * 0.018, 0.5, 16);       // keeps depth precision for the ground-level shadows from orbit
    if (Math.abs(camera.fov - fov) > 0.01 || Math.abs(camera.near - near) > 0.05) { camera.fov = fov; camera.near = near; camera.updateProjectionMatrix(); }

    // Thin, bluish air from orbit; warm and dense at street level.
    const density = lerp(0.00032, 0.0023, street);
    uniforms.uFogDensity.value = density;
    uniforms.uHigh.value = 1 - street;
    FOG_COLOR.lerpColors(ORBIT_FOG, STREET_FOG, street);
    scene.fog.density = density;
    scene.fog.color.copy(FOG_COLOR);
    sky.position.copy(camera.position);
  }

  function frame(now) {
    if (!running || disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    clock += dt;
    uniforms.uTime.value = clock;
    placeCamera(dt);
    onFrame.forEach((fn) => fn(clock));
    renderer.render(scene, camera);
    frames++;
    if (!readyFired) {
      readyFired = true;
      if (api.onReady) api.onReady();
    }
    // Adaptive quality: after warm-up, step resolution down once, then bail out.
    if (frames > 40 && frames <= 160) {
      slowAcc += dt;
      if (frames === 160) {
        const avg = slowAcc / 120;
        if (avg > 0.034 && pixelRatio > 1) {
          pixelRatio = 1;
          uniforms.uPx.value = 1;
          renderer.setPixelRatio(1);
          resize();
          frames = 40; slowAcc = 0;
        } else if (avg > 0.05 && api.onSlow) {
          api.onSlow();
        }
      }
    }
  }

  api.resize = resize;
  api.setProgress = (p) => { state.p = clamp(p, 0, 1); };
  api.setPointer = (x, y) => { state.px = clamp(x, -1, 1); state.py = clamp(y, -1, 1); };
  api.start = () => {
    if (hold) {
      // ?hold: draw the opening frame once and stay still (used to render the poster image).
      requestAnimationFrame(() => {
        resize(); placeCamera(0.0001); renderer.render(scene, camera);
        if (!readyFired) { readyFired = true; if (api.onReady) api.onReady(); }
      });
      return;
    }
    if (running || disposed) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  };
  api.stop = () => { running = false; cancelAnimationFrame(raf); };
  api.renderOnce = () => { resize(); placeCamera(0.016); renderer.render(scene, camera); };
  api.dispose = () => {
    disposed = true;
    api.stop();
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    signTextures.forEach((texture) => texture.dispose());
    renderer.dispose();
  };
  api.stats = () => ({ buildings: count, beacons: beacons.length, camera: camera.position.toArray(), fov: camera.fov, pixelRatio });

  resize();
  return api;
}
