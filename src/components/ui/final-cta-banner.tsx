"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const STYLE_ID = "final-cta-banner-styles";
const STYLES = ".gradient-blinds-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n\n.gradient-blinds-canvas {\n  position: absolute;\n  inset: 0;\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n\n.fcb-section {\n  --cta-void: #050506;\n  --cta-ink: #0a0a0b;\n  --cta-paper: #f4f1ea;\n  --cta-signal: #d0112b;\n  --cta-signal-soft: color-mix(in srgb, var(--cta-signal) 72%, white);\n\n  position: relative;\n  z-index: 2;\n  background: var(--cta-paper);\n  color: var(--cta-ink);\n  padding: clamp(3rem, 8vw, 5.5rem) var(--page-gutter, 1.25rem)\n    clamp(4rem, 10vw, 6.5rem);\n}\n\n.fcb-banner {\n  /* Type + spacing scale with the card itself */\n  --cta-pad-y: clamp(1.1rem, 8cqh, 3.75rem);\n  --cta-pad-x: clamp(1.15rem, 4.5cqw, 3.25rem);\n  --cta-gap: clamp(0.45rem, 2.8cqh, 1rem);\n  --cta-eyebrow: clamp(0.58rem, 1.35cqw, 0.68rem);\n  --cta-heading: clamp(1.35rem, 4.6cqw + 1.2cqh, 3.35rem);\n  --cta-body: clamp(0.82rem, 1.35cqw + 0.55cqh, 1.08rem);\n  --cta-action: clamp(0.78rem, 1.2cqw + 0.4cqh, 0.92rem);\n  --cta-btn-y: clamp(0.55rem, 2.2cqh, 0.85rem);\n  --cta-btn-x: clamp(0.95rem, 2.8cqw, 1.35rem);\n\n  position: relative;\n  isolation: isolate;\n  container-type: size;\n  overflow: hidden;\n  display: flex;\n  align-items: flex-end;\n  width: min(100%, 82rem);\n  margin-inline: auto;\n  aspect-ratio: 2.4 / 1;\n  min-height: fit-content;\n  padding: var(--cta-pad-y) var(--cta-pad-x);\n  border-radius: clamp(0.9rem, 2.2cqw, 1.35rem);\n  background: var(--cta-void);\n  color: var(--cta-paper);\n  box-shadow:\n    0 1px 0 color-mix(in srgb, white 8%, transparent) inset,\n    0 28px 56px -28px color-mix(in srgb, black 45%, transparent);\n}\n\n.fcb-blinds {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  pointer-events: auto;\n  border-radius: inherit;\n  overflow: hidden;\n}\n\n.fcb-blindsCanvas {\n  position: absolute !important;\n  inset: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  display: block;\n  mix-blend-mode: normal !important;\n}\n\n.fcb-scrim {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  pointer-events: none;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      105deg,\n      color-mix(in srgb, var(--cta-void) 72%, transparent) 0%,\n      color-mix(in srgb, var(--cta-void) 38%, transparent) 42%,\n      color-mix(in srgb, var(--cta-void) 18%, transparent) 100%\n    ),\n    radial-gradient(\n      90% 80% at 78% 50%,\n      color-mix(in srgb, var(--cta-signal) 22%, transparent),\n      transparent 62%\n    );\n}\n\n.fcb-copy {\n  position: relative;\n  z-index: 2;\n  width: min(100%, 36rem);\n  max-width: 58cqw;\n  display: grid;\n  gap: var(--cta-gap);\n  pointer-events: none;\n}\n\n.fcb-copy a {\n  pointer-events: auto;\n}\n\n.fcb-eyebrow {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.7rem;\n  margin: 0;\n  font-family: var(--font-mono, ui-monospace, monospace);\n  font-size: var(--cta-eyebrow);\n  font-weight: 500;\n  letter-spacing: 0.16em;\n  text-transform: uppercase;\n  color: color-mix(in srgb, var(--cta-paper) 62%, transparent);\n}\n\n.fcb-eyebrowRule {\n  width: clamp(1rem, 3cqw, 1.6rem);\n  height: 1px;\n  background: color-mix(in srgb, var(--cta-signal) 70%, transparent);\n}\n\n.fcb-heading {\n  margin: 0;\n  max-width: 14ch;\n  font-family: var(--font-display, Georgia, \"Times New Roman\", serif);\n  font-size: var(--cta-heading);\n  font-weight: 500;\n  line-height: 1.05;\n  letter-spacing: -0.03em;\n  color: var(--cta-paper);\n  text-wrap: balance;\n}\n\n.fcb-body {\n  margin: 0;\n  max-width: 34ch;\n  font-family: var(--font-body, system-ui, sans-serif);\n  font-size: var(--cta-body);\n  line-height: 1.45;\n  color: color-mix(in srgb, var(--cta-paper) 72%, transparent);\n}\n\n.fcb-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: clamp(0.45rem, 2cqh, 0.85rem) clamp(0.65rem, 2cqw, 1.1rem);\n  margin-top: clamp(0.2rem, 1.5cqh, 0.65rem);\n}\n\n.fcb-primary {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  padding: var(--cta-btn-y) var(--cta-btn-x);\n  border-radius: 999px;\n  background: var(--cta-signal);\n  color: #fff;\n  font-family: var(--font-body, system-ui, sans-serif);\n  font-size: var(--cta-action);\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  text-decoration: none;\n  box-shadow:\n    0 1px 0 color-mix(in srgb, white 22%, transparent) inset,\n    0 10px 28px -12px color-mix(in srgb, var(--cta-signal) 70%, transparent);\n  transition:\n    background 160ms ease,\n    transform 160ms ease;\n}\n\n.fcb-primary:hover {\n  background: color-mix(in srgb, var(--cta-signal) 88%, white);\n  transform: translateY(-1px);\n}\n\n.fcb-primary:focus-visible {\n  outline: 2px solid var(--cta-signal-soft);\n  outline-offset: 3px;\n}\n\n.fcb-secondary {\n  display: inline-flex;\n  align-items: center;\n  padding: calc(var(--cta-btn-y) * 0.85) 0.35rem;\n  color: color-mix(in srgb, var(--cta-paper) 78%, transparent);\n  font-family: var(--font-body, system-ui, sans-serif);\n  font-size: var(--cta-action);\n  font-weight: 500;\n  text-decoration: underline;\n  text-decoration-color: color-mix(in srgb, var(--cta-paper) 28%, transparent);\n  text-underline-offset: 0.28em;\n  transition:\n    color 160ms ease,\n    text-decoration-color 160ms ease;\n}\n\n.fcb-secondary:hover {\n  color: var(--cta-paper);\n  text-decoration-color: color-mix(in srgb, var(--cta-paper) 55%, transparent);\n}\n\n.fcb-secondary:focus-visible {\n  outline: 2px solid var(--cta-signal-soft);\n  outline-offset: 3px;\n  border-radius: 4px;\n}\n\n/* Short cards: tighten further so nothing clips */\n@container (max-height: 22rem) {\n  .fcb-eyebrow {\n    letter-spacing: 0.12em;\n  }\n\n  .fcb-body {\n    line-height: 1.35;\n    display: -webkit-box;\n    -webkit-line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n  }\n}\n\n@container (max-height: 16rem) {\n  .fcb-eyebrow {\n    display: none;\n  }\n\n  .fcb-body {\n    -webkit-line-clamp: 1;\n  }\n\n  .fcb-actions {\n    margin-top: 0;\n  }\n}\n\n@media (max-width: 640px) {\n  .fcb-banner {\n    border-radius: 1.1rem;\n    aspect-ratio: auto;\n    min-height: 22rem;\n    container-type: inline-size;\n    --cta-heading: clamp(1.75rem, 8vw, 2.35rem);\n    --cta-body: clamp(0.95rem, 3.2vw, 1.05rem);\n    --cta-action: 0.9rem;\n    --cta-pad-y: 2rem;\n    --cta-pad-x: 1.35rem;\n    --cta-gap: 0.85rem;\n  }\n\n  .fcb-copy {\n    max-width: none;\n  }\n\n  .fcb-actions {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fcb-primary {\n    transition: none;\n  }\n\n  .fcb-primary:hover {\n    transform: none;\n  }\n}\n\n.fcb-section {\n  padding: 0;\n}\n";

function useInjectStyles() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = STYLES;
    document.head.appendChild(el);
  }, []);
}

const MAX_COLORS = 8;
const MAX_WAVES = 4;
const INTRO_SECONDS = 1.8;
const RIPPLE_SECONDS = 1.6;

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uMirror;
uniform float uDistort;
uniform float uShineFlip;
uniform vec3 uColors[8];
uniform int uColorCount;
uniform float uLightMode;
uniform float uShine;
uniform float uRelief;
uniform float uGlow;
uniform float uSway;
uniform float uSwayTime;
uniform float uHover;
uniform vec4 uWaves[4];
uniform float uIntro;
uniform float uGrainTime;
uniform vec3 uLightColor;
uniform float uPerspective;
uniform float uGradientShift;

out vec4 outColor;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

vec2 rotate2D(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c) * p;
}

vec2 blindSpace(vec2 uv0) {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = uv0 * 2.0 - 1.0;
  p.x *= aspect;
  vec2 pr = rotate2D(p, uAngle);
  pr.x /= aspect;
  vec2 uv = pr * 0.5 + 0.5;
  if (abs(uPerspective) > 0.001) {
    float k = uPerspective * 2.2;
    uv.x = (exp(k * uv.x) - 1.0) / (exp(k) - 1.0);
  }
  if (uDistort > 0.0) {
    float a = uv.y * 6.0;
    float b = uv.x * 6.0;
    float w = 0.01 * uDistort;
    uv.x += sin(a) * w;
    uv.y += cos(b) * w;
  }
  return uv;
}

vec3 gradientColor(float t) {
  float tt = clamp(t, 0.0, 1.0);
  int count = max(uColorCount, 2);
  float scaled = tt * float(count - 1);
  int seg = min(int(floor(scaled)), count - 2);
  float f = scaled - float(seg);
  if (tt >= 1.0) return uColors[count - 1];
  return mix(uColors[seg], uColors[seg + 1], f);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv0 = frag / uResolution;
  vec2 uvMod = blindSpace(uv0);

  float count = max(uBlindCount, 1.0);
  float stripePhase = uvMod.x * count;
  float pixel = max(fwidth(stripePhase), 1e-5);

  float t = uvMod.x;
  if (uGradientShift != 0.0) {
    t = 1.0 - abs(1.0 - fract((t + uGradientShift) * 0.5) * 2.0);
  }
  if (uMirror > 0.5) {
    t = 1.0 - abs(1.0 - 2.0 * fract(t));
  }
  vec3 base = gradientColor(t);

  vec2 offset = uMouse / uResolution;
  float d = length(uv0 - offset);
  float r = max(uSpotlightRadius, 1e-4);
  float spot = (1.0 - 2.0 * pow(d / r, uSpotlightSoftness)) * uSpotlightOpacity;

  float slat = floor(stripePhase);
  float s = stripePhase - slat;
  float stripeAA = clamp(count * 1.25 / min(uResolution.x, uResolution.y), 0.001, 0.12);
  float edgeBlend = 1.0 - smoothstep(0.0, stripeAA, min(s, 1.0 - s));
  float across = mix(s, 0.5, edgeBlend);
  float ramp = uShineFlip > 0.5 ? 1.0 - across : across;

  float unit = min(uResolution.x, uResolution.y);
  float reach = max(uSpotlightRadius, 0.05) * unit;
  vec2 toLight = uMouse - frag;
  float nearLight = exp(-dot(toLight, toLight) / (reach * reach));

  float tilt = 0.0;
  float pulse = 0.0;
  if (uSway > 0.0) {
    tilt += uSway * 0.5 * sin(uSwayTime * 0.9 + slat * 0.55) * (0.6 + 0.4 * sin(uSwayTime * 0.37 + slat * 0.21));
  }
  tilt += uHover * nearLight * 0.7;
  for (int i = 0; i < 4; i++) {
    vec4 wave = uWaves[i];
    if (wave.w <= 0.0) continue;
    float age = uTime - wave.z;
    if (age < 0.0 || age > ${RIPPLE_SECONDS.toFixed(2)}) continue;
    float life = age / ${RIPPLE_SECONDS.toFixed(2)};
    vec2 origin = blindSpace(wave.xy / uResolution);
    float slats = abs(slat + 0.5 - origin.x * count);
    float front = age * max(count, 4.0) * 0.95;
    float k = (slats - front) / (0.8 + life * 1.2);
    float along = (uvMod.y - origin.y) / max(0.42 + life * 0.5, 0.01);
    float fade = (1.0 - life) * (1.0 - life);
    float ring = exp(-k * k) * exp(-along * along) * fade * smoothstep(0.0, 0.2, age);
    tilt += ring * 0.9;
    pulse += ring;
  }
  if (uIntro < 1.0) {
    float settle = smoothstep(0.0, 1.0, clamp(uIntro * 1.5 - uv0.x * 0.5, 0.0, 1.0));
    tilt -= (1.0 - settle) * 1.2;
  }

  float edge = ramp;
  float calm = 1.0 - 0.6 * clamp(spot, 0.0, 1.0);
  ramp = pow(clamp(ramp, 0.0, 1.0), exp(tilt * 0.9));
  ramp *= 1.0 - 0.3 * min(pulse, 1.0) * calm;
  float crease = uRelief * 0.38 * smoothstep(0.62, 1.0, ramp);
  float sheen = uShine * exp(-pow((edge - 0.035) / 0.07, 2.0)) * (0.3 + 0.7 * nearLight) * (1.0 - edgeBlend);

  vec3 lit = spot > 0.0 ? uLightColor * spot : vec3(spot);
  lit += uLightColor * min(pulse, 1.0) * 0.35 * calm;
  vec3 revealSignal = lit + base - vec3(ramp + crease);

  vec3 col;
  if (uLightMode > 0.5) {
    vec3 luma = vec3(0.2126, 0.7152, 0.0722);
    float peak = max(base.r, max(base.g, base.b));
    float low = min(base.r, min(base.g, base.b));
    float chroma = (peak - low) / max(peak, 0.0001);
    vec3 hue = base / max(peak, 0.0001);
    hue = clamp(mix(vec3(dot(hue, luma)), hue, 1.3), 0.0, 1.0);
    hue *= mix(1.0, 0.82, smoothstep(0.55, 0.9, dot(hue, luma)));
    vec3 tint = mix(base, hue, smoothstep(0.06, 0.28, chroma));
    vec3 revealed = clamp(revealSignal, 0.0, 1.0);
    float coverage = max(revealed.r, max(revealed.g, revealed.b));
    float stroke = 1.0 - smoothstep(pixel, pixel * 2.2, edge);
    col = mix(vec3(1.0), tint, 0.72 * smoothstep(0.0, 1.0, coverage));
    col = mix(col, tint * 0.85, stroke * clamp(coverage * 1.5, 0.0, 1.0) * 0.7);
    col = mix(col, vec3(1.0), clamp(sheen, 0.0, 1.0) * 0.5);
    float grain = max(0.5 * (hash(frag + uGrainTime) + hash(frag.yx + uGrainTime * 1.7)) - 0.5, 0.0);
    col = clamp(col - vec3(grain * uNoise * 0.12 * coverage), 0.0, 1.0);
  } else {
    vec3 haze = base * uGlow * 0.4 * smoothstep(0.0, 1.0, spot) * (0.4 + 0.6 * ramp);
    col = revealSignal + haze + mix(base, uLightColor, 0.45) * sheen * 0.7;
    vec3 over = max(col - 0.8, 0.0);
    col = min(col, vec3(0.8)) + 0.2 * (1.0 - exp(-over / 0.2));
    float luma = dot(clamp(col, 0.0, 1.0), vec3(0.2126, 0.7152, 0.0722));
    float grain = 0.5 * (hash(frag + uGrainTime) + hash(frag.yx + uGrainTime * 1.7)) - 0.5;
    col += grain * uNoise * (0.45 + 0.55 * smoothstep(0.0, 0.5, luma));
  }

  float presence = smoothstep(0.0, 0.65, uIntro);
  col = uLightMode > 0.5 ? mix(vec3(1.0), col, presence) : col * presence;
  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const compile = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = (gl: WebGL2RenderingContext) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (!info) continue;
    const name = info.name.replace(/\[0\]$/, "");
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
};

const hexToRGB = (hex: string) => {
  const c = String(hex || "")
    .replace("#", "")
    .padEnd(6, "0");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r || 0, g || 0, b || 0];
};

const prepStops = (stops?: string[]) => {
  const base = (
    stops && stops.length ? stops : ["#FF9FFC", "#5227FF"]
  ).slice(0, MAX_COLORS);
  if (base.length === 1) base.push(base[0]);
  while (base.length < MAX_COLORS) base.push(base[base.length - 1]);
  const flat = new Float32Array(MAX_COLORS * 3);
  for (let i = 0; i < MAX_COLORS; i++) flat.set(hexToRGB(base[i]), i * 3);
  const count = Math.max(2, Math.min(MAX_COLORS, stops?.length ?? 2));
  return { flat, count };
};

interface GradientBlindsProps {
  className?: string;
  style?: CSSProperties;
  dpr?: number;
  paused?: boolean;
  gradientColors?: string[];
  angle?: number;
  noise?: number;
  blindCount?: number;
  blindMinWidth?: number;
  mouseDampening?: number;
  mirrorGradient?: boolean;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  distortAmount?: number;
  shineDirection?: "left" | "right";
  lightColor?: string;
  perspective?: number;
  gradientSpeed?: number;
  shine?: number;
  relief?: number;
  glow?: number;
  sway?: number;
  speed?: number;
  hoverTilt?: number;
  clickEffect?: "ripple" | "none";
  idle?: "drift" | "center" | "stay";
  intro?: boolean;
  mixBlendMode?: string;
  lightMode?: boolean;
}

function GradientBlinds({
  className = "",
  style,
  dpr,
  paused = false,
  gradientColors,
  angle = 0,
  noise = 0.3,
  blindCount = 16,
  blindMinWidth = 60,
  mouseDampening = 0.15,
  mirrorGradient = false,
  spotlightRadius = 0.5,
  spotlightSoftness = 1,
  spotlightOpacity = 1,
  distortAmount = 0,
  shineDirection = "left",
  lightColor = "#ffffff",
  perspective = 0,
  gradientSpeed = 0,
  shine = 0.4,
  relief = 0.5,
  glow = 0.4,
  sway = 0.35,
  speed = 1,
  hoverTilt = 0.6,
  clickEffect = "ripple",
  idle = "drift",
  intro = true,
  mixBlendMode = "lighten",
  lightMode = false,
}: GradientBlindsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const colorKey = (
    gradientColors && gradientColors.length
      ? gradientColors
      : ["#FF9FFC", "#5227FF"]
  ).join(",");
  const settings = {
    paused,
    colorKey,
    gradientColors,
    angle,
    noise: clamp(noise, 0, 2),
    blindCount: Math.max(1, blindCount || 1),
    blindMinWidth,
    mouseDampening: Math.max(0, mouseDampening),
    mirrorGradient,
    spotlightRadius,
    spotlightSoftness,
    spotlightOpacity,
    distortAmount,
    shineDirection,
    lightColor,
    perspective: clamp(perspective, -1, 1),
    gradientSpeed,
    shine: clamp(shine, 0, 2),
    relief: clamp(relief, 0, 1),
    glow: clamp(glow, 0, 2),
    sway: clamp(sway, 0, 1),
    speed: clamp(speed, 0, 4),
    hoverTilt: clamp(hoverTilt, 0, 1.5),
    clickEffect,
    idle,
    intro,
    lightMode,
    dpr,
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;
    // Never call loseContext — Strict Mode remounts must be able to re-init.
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    if (!gl || gl.isContextLost()) return undefined;
    const shader = link(gl);
    if (!shader) return undefined;
    const u = shader.uniforms;
    const vao = gl.createVertexArray();

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const view = { width: 1, height: 1, ratio: 1, count: 1 };
    const pointer = { x: 0, y: 0, inside: false };
    const light = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, ready: false };
    const waves = new Float32Array(MAX_WAVES * 4);
    let waveIndex = 0;
    let hover = 0;
    let time = 0;
    let swayTime = 0;
    let shift = 0;
    let grainTime = 0;
    let introClock = settingsRef.current.intro && !reduce ? 0 : 1;
    let colorKeyCache = "";
    let colorStops = prepStops(settingsRef.current.gradientColors);
    let raf = 0;
    let last = 0;
    let visible = true;

    const blindTotal = (s: typeof settings) => {
      if (s.blindMinWidth && s.blindMinWidth > 0) {
        const byWidth = Math.max(1, Math.floor(view.width / s.blindMinWidth));
        return Math.max(
          1,
          s.blindCount ? Math.min(s.blindCount, byWidth) : byWidth,
        );
      }
      return Math.max(1, s.blindCount);
    };

    const draw = () => {
      const s = settingsRef.current;
      if (colorKeyCache !== s.colorKey) {
        colorStops = prepStops(s.gradientColors);
        colorKeyCache = s.colorKey;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(shader.program);
      gl.bindVertexArray(vao);
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform1f(u.uTime, time);
      gl.uniform2f(
        u.uMouse,
        light.x * view.ratio,
        (view.height - light.y) * view.ratio,
      );
      gl.uniform1f(u.uAngle, (s.angle * Math.PI) / 180);
      gl.uniform1f(u.uNoise, s.noise);
      gl.uniform1f(u.uBlindCount, blindTotal(s));
      gl.uniform1f(u.uSpotlightRadius, s.spotlightRadius);
      gl.uniform1f(u.uSpotlightSoftness, s.spotlightSoftness);
      gl.uniform1f(u.uSpotlightOpacity, s.spotlightOpacity);
      gl.uniform1f(u.uMirror, s.mirrorGradient ? 1 : 0);
      gl.uniform1f(u.uDistort, s.distortAmount);
      gl.uniform1f(u.uShineFlip, s.shineDirection === "right" ? 1 : 0);
      gl.uniform3fv(u.uColors, colorStops.flat);
      gl.uniform1i(u.uColorCount, colorStops.count);
      gl.uniform1f(u.uLightMode, s.lightMode ? 1 : 0);
      gl.uniform1f(u.uShine, s.shine);
      gl.uniform1f(u.uRelief, s.relief);
      gl.uniform1f(u.uGlow, s.glow);
      gl.uniform1f(u.uSway, reduce ? 0 : s.sway);
      gl.uniform1f(u.uSwayTime, swayTime);
      gl.uniform1f(u.uHover, hover * s.hoverTilt);
      gl.uniform4fv(u.uWaves, waves);
      gl.uniform1f(u.uIntro, introClock);
      gl.uniform1f(u.uGrainTime, grainTime);
      gl.uniform3fv(u.uLightColor, hexToRGB(s.lightColor || "#ffffff"));
      gl.uniform1f(u.uPerspective, s.perspective);
      gl.uniform1f(u.uGradientShift, shift);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    };

    const aim = (s: typeof settings) => {
      if (pointer.inside) {
        light.tx = pointer.x;
        light.ty = pointer.y;
      } else if (s.idle === "center") {
        light.tx = view.width / 2;
        light.ty = view.height / 2;
      } else if (s.idle === "drift" && !reduce) {
        light.tx =
          view.width *
          (0.5 +
            0.22 * Math.sin(swayTime * 0.23) +
            0.05 * Math.sin(swayTime * 0.61 + 1.3));
        light.ty =
          view.height *
          (0.5 +
            0.16 * Math.sin(swayTime * 0.31 + 0.7) +
            0.04 * Math.sin(swayTime * 0.83));
      }
    };

    const follow = (s: typeof settings, dt: number) => {
      const tau = s.mouseDampening;
      if (tau <= 0) {
        light.x = light.tx;
        light.y = light.ty;
        light.vx = 0;
        light.vy = 0;
        return;
      }
      const omega = 2.4 / tau;
      const k = omega * omega;
      const c = 2 * omega;
      const steps = Math.max(1, Math.ceil(dt / 0.008));
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        light.vx += (k * (light.tx - light.x) - c * light.vx) * h;
        light.vy += (k * (light.ty - light.y) - c * light.vy) * h;
        light.x += light.vx * h;
        light.y += light.vy * h;
      }
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const resize = () => {
      const s = settingsRef.current;
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(view.width * view.ratio));
      canvas.height = Math.max(1, Math.round(view.height * view.ratio));
      if (!light.ready) {
        light.ready = true;
        light.x = light.tx = view.width / 2;
        light.y = light.ty = view.height / 2;
      }
      draw();
      wake();
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? clamp((now - last) / 1000, 0.001, 1 / 20) : 1 / 60;
      last = now;
      if (s.paused) return;
      time += dt;
      if (!reduce) {
        swayTime += dt * s.speed;
        shift = (shift + dt * s.gradientSpeed * 0.06) % 2;
      }
      grainTime = Math.floor(time * 24) * 17.13;
      if (introClock < 1) introClock = Math.min(1, introClock + dt / INTRO_SECONDS);
      hover += ((pointer.inside ? 1 : 0) - hover) * (1 - Math.exp(-dt / 0.35));
      aim(s);
      follow(s, dt);
      for (let i = 0; i < MAX_WAVES; i++) {
        if (waves[i * 4 + 3] > 0 && time - waves[i * 4 + 2] > RIPPLE_SECONDS)
          waves[i * 4 + 3] = 0;
      }
      draw();
      const settling =
        Math.abs(light.tx - light.x) > 0.05 ||
        Math.abs(light.ty - light.y) > 0.05 ||
        Math.abs(light.vx) + Math.abs(light.vy) > 0.05 ||
        Math.abs((pointer.inside ? 1 : 0) - hover) > 0.002;
      const active =
        settling ||
        introClock < 1 ||
        waves.some((value, index) => index % 4 === 3 && value > 0) ||
        (!reduce &&
          (s.noise > 0 ||
            s.gradientSpeed !== 0 ||
            (s.sway > 0 && s.speed > 0) ||
            (s.idle === "drift" && !pointer.inside)));
      if (active) raf = requestAnimationFrame(frame);
    };

    const locate = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return {
        x,
        y,
        inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const { x, y, inside } = locate(event);
      pointer.x = x;
      pointer.y = y;
      pointer.inside = inside;
      if (inside) wake();
    };

    const onPointerDown = (event: PointerEvent) => {
      const s = settingsRef.current;
      const { x, y, inside } = locate(event);
      if (!inside || reduce || s.clickEffect !== "ripple") return;
      const o = waveIndex * 4;
      waves[o] = x * view.ratio;
      waves[o + 1] = (view.height - y) * view.ratio;
      waves[o + 2] = time;
      waves[o + 3] = 1;
      waveIndex = (waveIndex + 1) % MAX_WAVES;
      wake();
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      wake();
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) wake();
    });
    intersection.observe(container);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    wakeRef.current = wake;

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(shader.program);
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <div
      ref={containerRef}
      className={`gradient-blinds-container${className ? ` ${className}` : ""}`}
      style={
        {
          ...(!lightMode && mixBlendMode ? { mixBlendMode } : null),
          ...style,
        } as React.CSSProperties
      }
    >
      <canvas
        ref={canvasRef}
        className="gradient-blinds-canvas"
        aria-hidden="true"
      />
    </div>
  );
}


export type FinalCtaBannerProps = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  gradientColors?: string[];
  className?: string;
};

export default function FinalCtaBanner({
  eyebrow = "Private Consultation · RERA ORN 51517",
  heading = "Acquire, lease, or list prime Dubai real estate with total clarity.",
  body = "Speak directly with an SWK Properties specialist at Al Saqr Business Tower, Sheikh Zayed Road. Receive a tailored shortlist, DLD fee breakdown, and verified availability within one business day.",
  primaryLabel = "Schedule a Consultation",
  primaryHref = "/contact",
  secondaryLabel = "WhatsApp Advisory Desk",
  secondaryHref = "https://wa.me/971564330448",
  gradientColors = ["#e6cf9c", "#c4a35a", "#6e5520", "#0b0b0c"],
  className = "",
}: FinalCtaBannerProps) {
  useInjectStyles();

  return (
    <section
      className={`fcb-section${className ? ` ${className}` : ""}`}
      aria-labelledby="final-cta-heading"
    >
      <div className="fcb-banner">
        <div className="fcb-blinds" aria-hidden="true">
          <GradientBlinds
            className="fcb-blindsCanvas"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
            }}
            gradientColors={gradientColors}
            angle={20}
            blindCount={16}
            blindMinWidth={60}
            spotlightRadius={0.5}
            shine={0.4}
            relief={0.5}
            glow={0.4}
            sway={0.35}
            hoverTilt={0.6}
            clickEffect="ripple"
            noise={0.3}
            shineDirection="left"
            lightColor="#ffffff"
            idle="drift"
            mixBlendMode="normal"
            lightMode={false}
            intro
          />
        </div>
        <div className="fcb-scrim" aria-hidden="true" />

        <div className="fcb-copy">
          <p className="fcb-eyebrow">
            <span className="fcb-eyebrowRule" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id="final-cta-heading" className="fcb-heading">
            {heading}
          </h2>
          <p className="fcb-body">{body}</p>

          <div className="fcb-actions">
            <a href={primaryHref} className="fcb-primary">
              {primaryLabel}
              <span aria-hidden="true"> →</span>
            </a>
            <a
              href={secondaryHref}
              className="fcb-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

