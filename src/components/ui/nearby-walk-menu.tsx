/**
 * Nearby Walk. Designed & built by Aakash Mehra.
 *
 * A line-drawing walk from your place (left, foreground) along the ground and up the hill to
 * N Seoul Tower (far right), with Myeongdong, Seoul Station, Sungnyemun and Deoksugung in between.
 * Landmarks rise in one after another when the scene scrolls into view, walkers follow the route,
 * and hovering (or focusing, or tapping) a landmark bounces it and swaps its walking time for the
 * straight-line distance. Desktop layout: it scales with its width, so it never scrolls sideways.
 *
 * The root is a full-bleed section: a hint line, the scene card, and four theme dots (Classic, Night,
 * Sunset, Ink) that recolour everything, page included, with a crossfade. Each theme is a set of
 * CSS variables on the root, which `style` can also override:
 * --nw-page / --nw-page2 (section gradient), --nw-bg (card), --nw-shadow (card shadow),
 * --nw-ink (lines), --nw-wall, --nw-roof (roofs, domes, doors), --nw-stone, --nw-hill, --nw-win (unlit windows),
 * --nw-sun (lit windows, bulbs), --nw-cloud / --nw-cloud-line, --nw-beacon, --nw-glow (beacon glow),
 * --nw-route, --nw-walker, --nw-pin / --nw-pin-text (origin pin), --nw-fg (names), --nw-muted (times, hint),
 * --nw-stroke / --nw-thin (line weights, plain numbers).
 */
"use client";

import { useEffect, useRef, useState, type CSSProperties, type JSX, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A landmark on the walk. */
export type NearbyPlace = {
  /** Which built-in drawing to use: "tower" | "palace" | "gate" | "station" | "myeongdong". Other ids are skipped. */
  id: string;
  /** Label shown above the drawing. */
  name: string;
  /** Straight-line distance in km (shown on hover). */
  km: number;
  /** Walking time in minutes (shown by default). */
  walkMinutes: number;
};

export type NearbyWalkProps = {
  /** The landmarks. Defaults to five central Seoul landmarks. */
  places?: NearbyPlace[];
  /** Name on the pin above your place (the hotel drawing on the left). The pin grows to fit it. */
  origin?: string;
  /** Formats the distance label. Default: 1.0 becomes "1.0 km". */
  formatDistance?: (km: number) => string;
  /** Formats the walking-time label. Default: 12 becomes "12 min walk". */
  formatWalk?: (minutes: number) => string;
  /** Accessible description of the whole scene. Defaults to the origin plus the landmark names. */
  ariaLabel?: string;
  /** Small line centred above the drawing. Pass null to hide it. */
  hint?: string | null;
  /** Colour theme (controlled). Leave unset to let the dots switch it. */
  theme?: NearbyWalkTheme;
  /** Starting theme when uncontrolled. Default "classic". */
  defaultTheme?: NearbyWalkTheme;
  /** Called with the theme id when a dot is picked. */
  onThemeChange?: (theme: NearbyWalkTheme) => void;
  /** Show the four theme dots under the scene. Default true. */
  showThemes?: boolean;
  /** Soft light and a short fading trail that follow the pointer over the scene. Mouse/pen only, off with reduced motion. Default true. */
  cursorEffect?: boolean;
  /** Extra content under the dots, coloured by the theme (e.g. a byline). Use var(--nw-muted) / var(--nw-ink). */
  children?: ReactNode;
  /** Extra classes for the full-bleed section (e.g. min-h-dvh to fill the page). */
  className?: string;
  /** Inline styles for the section (handy for the --nw-* colour variables). */
  style?: CSSProperties;
};

// Each theme: a label, the dot colour, and the CSS variables (without the --nw- prefix).
export const THEMES = {
  classic: {
    label: "Classic",
    dot: "#d9c48a",
    vars: {
      page: "#f6f3ec",
      page2: "#f6f3ec",
      bg: "#ffffff",
      wall: "#ffffff",
      ink: "#1f2a44",
      roof: "#1f2a44",
      stone: "#eff0f2",
      hill: "#edeef0",
      win: "#e9eaec",
      cloud: "#f2f2f4",
      "cloud-line": "#bcbfc7",
      sun: "#f1dfa0",
      beacon: "#f1dfa0",
      fg: "#161a14",
      muted: "#5c6358",
      pin: "#1f2a44",
      "pin-text": "#fff3c8",
      walker: "#1f2a44",
      route: "#1f2a44",
      ground: "#1f2a44",
      bg2: "#ffffff",
      lamp: "#ffe3a070",
      lamp2: "#ffffff00",
      trail: "#1f2a4470",
      glow: "#f1dfa000",
      shadow: "#161a1447",
      stroke: "1.8",
      thin: "1.2",
    },
  },
  night: {
    label: "Night",
    dot: "#1b2747",
    vars: {
      page: "#0e1626",
      page2: "#0e1626",
      bg: "#16213a",
      wall: "#1c2946",
      ink: "#d6e0f5",
      roof: "#9fb1da",
      stone: "#293652",
      hill: "#2b3854",
      win: "#2f3b58",
      cloud: "#273450",
      "cloud-line": "#546078",
      sun: "#ffc861",
      beacon: "#ffc861",
      fg: "#eef3fd",
      muted: "#93a3c4",
      pin: "#ffc861",
      "pin-text": "#0e1626",
      walker: "#ffc861",
      route: "#d6e0f5",
      ground: "#d6e0f5",
      bg2: "#16213a",
      lamp: "#ffd27a2a",
      lamp2: "#ffcf7a66",
      trail: "#ffc861b0",
      glow: "#ffc861",
      shadow: "#00000099",
      stroke: "1.8",
      thin: "1.2",
    },
  },
  // Golden hour: the buildings keep their Classic colours; the sky, sun, ground and light change.
  sunset: {
    label: "Sunset",
    dot: "linear-gradient(#c9c5de, #fbc8a0)",
    vars: {
      page: "#f6e2d3",
      page2: "#efc9b2",
      bg: "#fdd4b2",
      bg2: "#c9c5de",
      wall: "#ffffff",
      ink: "#1f2a44",
      roof: "#1f2a44",
      stone: "#eff0f2",
      hill: "#c48b78",
      win: "#e9eaec",
      cloud: "#fde4cc",
      "cloud-line": "#e3a985",
      sun: "#ffb547",
      beacon: "#f2711c",
      ground: "#7a4a3a",
      fg: "#3d2418",
      muted: "#74503f",
      pin: "#1f2a44",
      "pin-text": "#ffd9a8",
      walker: "#e0553b",
      route: "#c9472f",
      lamp: "#ffd08a85",
      lamp2: "#ffb54730",
      trail: "#e0553ba0",
      glow: "#f2711c",
      shadow: "#7a3b2a52",
      stroke: "1.8",
      thin: "1.2",
    },
  },
  // Ink painting on hanji: near-black lines, paper fills, grey washes, one vermilion seal accent.
  ink: {
    label: "Ink",
    dot: "radial-gradient(circle, #c8402f 0 24%, #1d1b19 28%)",
    vars: {
      page: "#f4efe6",
      page2: "#f4efe6",
      bg: "#faf7f1",
      wall: "#faf7f1",
      ink: "#1d1b19",
      roof: "#66615a",
      stone: "#ebe5da",
      hill: "#d8d0c3",
      win: "#f1ebe1",
      cloud: "#f4efe6",
      "cloud-line": "#b9b2a6",
      sun: "#e3d8c5",
      beacon: "#c8402f",
      fg: "#1d1b19",
      muted: "#6f685e",
      pin: "#c8402f",
      "pin-text": "#faf7f1",
      walker: "#c8402f",
      route: "#1d1b19",
      ground: "#1d1b19",
      bg2: "#faf7f1",
      lamp: "#fffdf890",
      lamp2: "#ffffff00",
      trail: "#c8402f80",
      glow: "#c8402f00",
      shadow: "#1d1b1926",
      stroke: "2.1",
      thin: "0.9",
    },
  },
};
export type NearbyWalkTheme = keyof typeof THEMES;
const THEME_IDS = Object.keys(THEMES) as NearbyWalkTheme[];
const themeVars = (t: NearbyWalkTheme) =>
  Object.fromEntries(Object.entries(THEMES[t].vars).map(([k, v]) => [`--nw-${k}`, v])) as CSSProperties;

// Straight-line km and walking minutes from the starting hotel.
export const DEFAULT_PLACES: NearbyPlace[] = [
  { id: "myeongdong", name: "Myeongdong", km: 0.8, walkMinutes: 12 },
  { id: "station", name: "Seoul Station", km: 0.9, walkMinutes: 15 },
  { id: "gate", name: "Sungnyemun Gate", km: 0.5, walkMinutes: 8 },
  { id: "palace", name: "Deoksugung Palace", km: 1.0, walkMinutes: 15 },
  { id: "tower", name: "N Seoul Tower", km: 1.0, walkMinutes: 25 },
];

const W = 1200; // viewBox width; the drawings are mirrored around it

// The drawings keep their original coordinates and are flipped as a whole by this transform,
// so the hotel lands on the left and the tower on the right. Text never goes inside it.
const FLIP = `translate(${W},0) scale(-1,1)`;

// Walking route, mirrored (x' = 1200 - x) and running from the hotel door to the tower,
// so walkers on it go left to right.
const ROUTE = "M100 262 C100 274 112 279 130 279 L870 279 C910 279 938 262 960 236 C986 204 1030 178 1076 174";

// Per landmark, in the mirrored scene: stagger step, hit box (x y w h) and label (x y anchor).
const LAYOUT: Record<string, { i: number; hit: [number, number, number, number]; lbl: [number, number, "middle" | "end"] }> = {
  myeongdong: { i: 1, hit: [200, 94, 132, 170], lbl: [267, 114, "middle"] },
  station: { i: 2, hit: [348, 106, 172, 158], lbl: [435, 128, "middle"] },
  gate: { i: 3, hit: [552, 126, 136, 138], lbl: [620, 142, "middle"] },
  palace: { i: 4, hit: [716, 122, 178, 142], lbl: [805, 140, "middle"] },
  tower: { i: 5, hit: [954, 14, 160, 250], lbl: [1062, 66, "end"] },
};

// Stagger: the hotel rises first, then each landmark in turn to the tower.
const d = (i: number) => ({ "--d": `${i * 120}ms` }) as CSSProperties;
const tw = (s: number) => ({ "--tw": `${s}s` }) as CSSProperties;

// ---- Drawings, in the original (unmirrored) coordinates.

function Tower() {
  return (
    <>
      <path className="nw-hill" d="M0 262C30 230 70 175 118 172C170 169 230 215 300 262Z" />
      <path className="nw-line" d="M106 173L112 150H124L130 173" />
      <rect className="nw-wall" x="114" y="92" width="8" height="58" />
      <rect className="nw-wall" x="99" y="82" width="38" height="10" rx="5" />
      <rect className="nw-wall" x="104" y="70" width="28" height="12" rx="4" />
      <path className="nw-line" d="M106 76H130" />
      <rect className="nw-wall" x="110" y="62" width="16" height="8" rx="2" />
      <path className="nw-line" d="M118 62V30M114 42H122M112 52H124" />
      <circle className="nw-ring" cx="118" cy="27" r="3" />
      <circle className="nw-beacon" cx="118" cy="27" r="3" />
    </>
  );
}

// Deoksugung: two-tier hall with upturned eaves on a stone platform
function Palace() {
  return (
    <>
      <rect className="nw-stone" x="328" y="246" width="134" height="16" />
      <path className="nw-line" d="M346 218V246M370 218V246M395 218V246M420 218V246M444 218V246" />
      <rect className="nw-wall" x="362" y="186" width="66" height="12" />
      <path className="nw-roof" d="M352 196H438L466 208Q472 210 476 203Q471 216 450 218H340Q319 216 314 203Q318 210 324 208Z" />
      <path className="nw-roof" d="M368 168H422L442 177Q447 179 450 174Q446 186 430 186H360Q344 186 340 174Q343 179 348 177Z" />
    </>
  );
}

// Sungnyemun: stone base with an arched gateway, two-tier roof
function Gate() {
  return (
    <>
      <path className="nw-stone" d="M530 262V222H630V262H595V242Q580 226 565 242V262Z" />
      <path className="nw-thin" d="M530 236H560M600 236H630M530 249H562M598 249H630" />
      <path className="nw-line" d="M550 211V222M570 211V222M590 211V222M610 211V222" />
      <rect className="nw-wall" x="557" y="183" width="46" height="9" />
      <path className="nw-roof" d="M556 192H604L626 201Q631 203 634 198Q630 210 614 211H546Q530 210 526 198Q529 203 534 201Z" />
      <path className="nw-roof" d="M564 170H596L610 177Q614 179 616 175Q613 185 602 185H558Q547 185 544 175Q546 179 550 177Z" />
    </>
  );
}

// Old Seoul Station (1925): symmetric front, central dome, side turrets, arched windows
function Station() {
  return (
    <>
      <rect className="nw-wall" x="688" y="208" width="154" height="54" />
      <rect className="nw-wall" x="740" y="190" width="50" height="72" />
      <rect className="nw-wall" x="750" y="179" width="30" height="11" />
      <path className="nw-dome" d="M748 179A17 17 0 0 1 782 179Z" />
      <path className="nw-line" d="M765 162V154" />
      <circle className="nw-wall" cx="765" cy="152" r="2" />
      <rect className="nw-wall" x="692" y="198" width="14" height="10" />
      <path className="nw-dome" d="M692 198A7 7 0 0 1 706 198Z" />
      <rect className="nw-wall" x="824" y="198" width="14" height="10" />
      <path className="nw-dome" d="M824 198A7 7 0 0 1 838 198Z" />
      <circle className="nw-thin" cx="765" cy="203" r="5" />
      <path className="nw-lit" d="M755 262V242Q765 230 775 242V262Z" />
      {[698, 714, 798, 814].map((x, i) => (
        <path key={x} className={i === 1 ? "nw-lit nw-tw" : "nw-thin"} d={`M${x} 246V232Q${x + 6} 224 ${x + 12} 232V246Z`} />
      ))}
    </>
  );
}

// Myeongdong: a cluster of towers with window grids, a few windows lit
function Myeongdong() {
  return (
    <>
      {[
        [878, 172, 34, 3, 9],
        [916, 142, 30, 2, 12],
        [950, 192, 38, 3, 7],
      ].map(([x, y, w, cols, rows], b) => (
        <g key={x}>
          <rect className="nw-wall" x={x} y={y} width={w} height={262 - y} />
          {Array.from({ length: cols * rows }, (_, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const lit = (i * 7 + b * 3) % 5 === 0;
            return (
              <rect
                key={i}
                className={lit ? "nw-lit nw-tw" : "nw-win"}
                style={lit ? tw((i % 4) * 0.9) : undefined}
                x={x + 6 + c * ((w - 12) / cols) + 1}
                y={y + 8 + r * 9}
                width={(w - 12) / cols - 3}
                height={4.5}
              />
            );
          })}
        </g>
      ))}
    </>
  );
}

// The hotel: three storeys, rooftop camper van under string lights
function Hotel() {
  return (
    <>
      <rect className="nw-wall" x="1030" y="150" width="140" height="112" />
      <rect className="nw-stone" x="1024" y="144" width="152" height="7" />
      <path className="nw-thin" d="M1030 187H1170M1030 224H1170" />
      {[160, 197].flatMap((y) =>
        [1046, 1089, 1132].map((x, i) => (
          <rect
            key={`${x}-${y}`}
            className={(x + y) % 3 === 0 ? "nw-lit nw-tw" : i === 1 ? "nw-lit" : "nw-win"}
            style={tw((x % 7) * 0.4)}
            x={x}
            y={y}
            width="22"
            height="16"
            rx="2"
          />
        )),
      )}
      <rect className="nw-win" x="1046" y="234" width="22" height="16" rx="2" />
      <rect className="nw-lit" x="1132" y="234" width="22" height="16" rx="2" />
      <rect className="nw-door" x="1086" y="232" width="28" height="30" rx="3" />
      {/* camper van on the roof */}
      <path className="nw-line" d="M1036 144V102M1162 144V104" />
      <path className="nw-thin" d="M1036 104Q1099 128 1162 106" />
      {[1052, 1068, 1084, 1100, 1116, 1132, 1148].map((x, i) => (
        <circle
          key={x}
          className="nw-bulb nw-tw"
          style={tw(i * 0.35)}
          cx={x}
          cy={110 + 9 * Math.sin((Math.PI * (x - 1036)) / 126)}
          r="2.4"
        />
      ))}
      <rect className="nw-wall" x="1050" y="114" width="80" height="28" rx="9" />
      <rect className="nw-lit" x="1060" y="120" width="26" height="10" rx="3" />
      <rect className="nw-thin" x="1100" y="119" width="12" height="20" rx="2" />
      <path className="nw-line" d="M1130 136H1144" />
      <circle className="nw-wall" cx="1070" cy="143" r="5" />
    </>
  );
}

const DRAW: Record<string, () => JSX.Element> = {
  tower: Tower,
  palace: Palace,
  gate: Gate,
  station: Station,
  myeongdong: Myeongdong,
};

/** Line-drawing walk from your place (left) to N Seoul Tower (right), with hoverable landmarks. */
export function NearbyWalk({
  places = DEFAULT_PLACES,
  origin = "Hotel name here",
  formatDistance = (km) => `${km.toFixed(1)} km`,
  formatWalk = (min) => `${min} min walk`,
  ariaLabel,
  hint = "Hover a place to see how far it is",
  theme,
  defaultTheme = "classic",
  onThemeChange,
  showThemes = true,
  cursorEffect = true,
  children,
  className,
  style,
}: NearbyWalkProps) {
  const [ownTheme, setOwnTheme] = useState(defaultTheme);
  const current = theme ?? ownTheme;
  const pick = (t: NearbyWalkTheme) => {
    if (theme === undefined) setOwnTheme(t);
    onThemeChange?.(t);
  };
  const ref = useRef(null as HTMLDivElement | null); // the card: the entrance plays when it is in view
  const list = places.filter((p) => DRAW[p.id]);

  // Comes in when it scrolls into view and resets once fully out of view, so it replays.
  // Hidden states only apply once JS has "armed" it with motion allowed; otherwise all is shown.
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.3) setShown(true);
        else if (!e.isIntersecting) setShown(false);
      },
      { threshold: [0, 0.3] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hover (mouse), keyboard focus or a tap picks a landmark: it bounces once and its second line
  // swaps from walking time to distance. The pointer only meets the static, invisible hit rect,
  // so the bounce can't move the landmark out from under the pointer and re-trigger itself.
  const [active, setActive] = useState(null as string | null);
  const touch = useRef(false);
  const off = (id: string) => setActive((a) => (a === id ? null : a));
  const toggle = (id: string) => setActive((a) => (a === id ? null : id));

  // The origin pin grows to fit its label (measured once fonts are in), never narrower than 120.
  const pinText = useRef(null as SVGTextElement | null);
  const [pinW, setPinW] = useState(120);
  useEffect(() => {
    const fit = () => pinText.current && setPinW(Math.max(120, Math.ceil(pinText.current.getComputedTextLength()) + 28));
    fit();
    document.fonts?.ready.then(fit);
  }, [origin]);

  // Cursor light: one rAF loop eases the light towards the pointer and drags a short trail of dots
  // behind it, writing only CSS variables and transforms. It sleeps once everything has caught up.
  useEffect(() => {
    const card = ref.current;
    if (!cursorEffect || !card || !matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const dots = Array.from(card.querySelectorAll(".nw-dot")) as HTMLElement[];
    const hist: number[][] = [];
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0,
      raf = 0,
      idle = 0,
      inside = false;
    const tick = () => {
      const dx = tx - x,
        dy = ty - y;
      x += dx * 0.2;
      y += dy * 0.2;
      hist.unshift([x, y]);
      hist.length = Math.min(hist.length, dots.length * 2);
      const [ox, oy] = hist[hist.length - 1];
      const spread = Math.hypot(x - ox, y - oy);
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      card.style.setProperty("--nw-trail-o", String(Math.min(1, spread / 50)));
      dots.forEach((dot, k) => {
        const [px, py] = hist[Math.min(k * 2, hist.length - 1)];
        dot.style.transform = `translate3d(${px}px,${py}px,0) scale(${1 - (k / dots.length) * 0.6})`;
      });
      idle = Math.abs(dx) + Math.abs(dy) < 0.3 && spread < 0.5 ? idle + 1 : 0;
      raf = idle > 2 ? 0 : requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!inside) {
        inside = true;
        x = tx;
        y = ty;
        hist.length = 0;
        card.dataset.lamp = "";
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      inside = false;
      delete card.dataset.lamp;
    };
    card.addEventListener("pointermove", move, { passive: true });
    card.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    };
  }, [cursorEffect]);

  return (
    <section
      data-nearby-walk=""
      data-armed={armed || undefined}
      data-shown={shown || undefined}
      className={cn("flex w-full flex-col items-center justify-center gap-5 px-4 py-12 font-sans text-[var(--nw-fg)]", className)}
      style={{ ...themeVars(current), ...style }}
    >
      <style>{CSS}</style>
      {hint && (
        <p className="m-0 text-center text-[13.5px] leading-5 font-medium tracking-[0.01em] text-[var(--nw-muted)]">{hint}</p>
      )}
      <div
        ref={ref}
        className="nw-card relative isolate w-full max-w-[1240px] overflow-hidden rounded-[28px] px-[2.5%] pt-6 pb-5"
      >
        {cursorEffect && <div className="nw-fx nw-lamp" aria-hidden="true" />}
        <svg
          className="relative z-[1] block h-auto w-full overflow-visible"
          viewBox={`0 0 ${W} 300`}
          role="group"
          aria-label={ariaLabel ?? `${origin} and nearby: ${list.map((p) => p.name).join(", ")}`}
        >
          {/* clouds drift slowly */}
          <g transform={FLIP} aria-hidden="true">
            <path className="nw-cloud nw-cloudA" d="M300 58a14 14 0 0 1 26-6a11 11 0 0 1 19 8h-45z" />
            <path className="nw-cloud nw-cloudB" d="M820 44a16 16 0 0 1 30-7a12 12 0 0 1 21 9h-51z" />
          </g>

          {list.map((p) => {
            const { i, hit, lbl } = LAYOUT[p.id];
            const Draw = DRAW[p.id];
            const [lx, ly, anchor] = lbl;
            const on = active === p.id;
            const walk = formatWalk(p.walkMinutes);
            const dist = formatDistance(p.km);
            return (
              <g
                key={p.id}
                className="nw-spot"
                tabIndex={0}
                role="button"
                aria-label={`${p.name}, ${walk}, ${dist}`}
                aria-pressed={on}
                data-active={on || undefined}
                onPointerDown={(e) => (touch.current = e.pointerType !== "mouse")}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(p.id)}
                onPointerLeave={(e) => e.pointerType === "mouse" && off(p.id)}
                onClick={() => touch.current && toggle(p.id)}
                onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActive(p.id)}
                onBlur={() => off(p.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(p.id))}
              >
                <rect className="nw-hit" x={hit[0]} y={hit[1]} width={hit[2]} height={hit[3]} />
                <g className="nw-bob">
                  <g className={cn("nw-rise", p.id === "tower" && "nw-far")} style={d(i)}>
                    <g transform={FLIP}>
                      <Draw />
                    </g>
                  </g>
                </g>
                <g className="nw-lbl" style={d(i)}>
                  <text x={lx} y={ly} textAnchor={anchor} className="nw-name">
                    {p.name}
                  </text>
                  <text x={lx} y={ly + 16} textAnchor={anchor} className="nw-dist nw-km">
                    {dist}
                  </text>
                  <text x={lx} y={ly + 16} textAnchor={anchor} className="nw-dist nw-walk">
                    {walk}
                  </text>
                </g>
              </g>
            );
          })}

          {/* your place (foreground), with a pin carrying its name */}
          <g className="nw-rise" style={d(0)}>
            <g transform={FLIP}>
              <Hotel />
            </g>
            <g className="nw-pin">
              <rect x={100 - pinW / 2} y="56" width={pinW} height="26" rx="13" />
              <path d="M94 82L100 90L106 82Z" />
              <text ref={pinText} x="100" y="74" textAnchor="middle">
                {origin}
              </text>
            </g>
          </g>

          {/* ground, drawn from the hotel side */}
          <path className="nw-ground" d={`M0 262H${W}`} />
          {/* the walk keeps flowing; two walkers follow it where CSS offset-path is supported */}
          <path className="nw-route" d={ROUTE} />
          <circle className="nw-walker" r="4" style={{ offsetPath: `path("${ROUTE}")` }} />
          <circle className="nw-walker nw-walker2" r="4" style={{ offsetPath: `path("${ROUTE}")` }} />
        </svg>
        {cursorEffect && (
          <>
            <div className="nw-fx nw-lamp2" aria-hidden="true" />
            <div className="nw-fx nw-trail" aria-hidden="true">
              {Array.from({ length: 10 }, (_, k) => (
                <span key={k} className="nw-dot" style={{ opacity: `calc(var(--nw-trail-o, 0) * ${1 - k / 10})` }} />
              ))}
            </div>
          </>
        )}
      </div>
      {showThemes && (
        <div role="group" aria-label="Colour theme" className="flex justify-center gap-2.5">
          {THEME_IDS.map((t) => (
            <button
              key={t}
              type="button"
              aria-label={`Theme: ${THEMES[t].label}`}
              aria-pressed={current === t}
              title={THEMES[t].label}
              onClick={() => pick(t)}
              className={cn(
                "grid size-7 cursor-pointer place-items-center rounded-full outline-none transition-shadow duration-300",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nw-ink)]",
                current === t && "shadow-[0_0_0_1.5px_var(--nw-ink)]",
              )}
            >
              <span
                className="size-4 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.18)] transition-transform duration-200 hover:scale-110"
                style={{ background: THEMES[t].dot }}
              />
            </button>
          ))}
        </div>
      )}
      {children}
    </section>
  );
}

export default NearbyWalk;

// Scoped to [data-nearby-walk]; keyframes prefixed nw-. The colour variables are registered
// with @property so a theme switch crossfades every fill and stroke that uses them.
const VARS = Object.keys(THEMES.classic.vars);
const NUMS = ["stroke", "thin"];
const CSS = `
${VARS.map((k) =>
  NUMS.includes(k)
    ? `@property --nw-${k}{syntax:"<number>";inherits:true;initial-value:1.8}`
    : `@property --nw-${k}{syntax:"<color>";inherits:true;initial-value:transparent}`,
).join("\n")}
[data-nearby-walk]{background:linear-gradient(var(--nw-page),var(--nw-page2))}
[data-nearby-walk]{--nw-ease:cubic-bezier(0.22,1,0.36,1);transition:${VARS.map((k) => `--nw-${k} .6s ease`).join(",")}}
[data-nearby-walk] .nw-card{background:linear-gradient(var(--nw-bg2),var(--nw-bg) 82%);box-shadow:0 0 0 1px color-mix(in srgb,var(--nw-ink) 7%,transparent),0 30px 60px -20px var(--nw-shadow)}
[data-nearby-walk] .nw-card{--mx:-999px;--my:-999px}
[data-nearby-walk] .nw-fx{display:none;position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .45s ease}
@media (hover:hover) and (prefers-reduced-motion:no-preference){[data-nearby-walk] .nw-fx{display:block}}
[data-nearby-walk] .nw-card[data-lamp] .nw-fx{opacity:1}
[data-nearby-walk] .nw-lamp{z-index:0;background:radial-gradient(220px circle at var(--mx) var(--my),var(--nw-lamp),transparent 70%)}
[data-nearby-walk] .nw-lamp2{z-index:2;mix-blend-mode:soft-light;background:radial-gradient(160px circle at var(--mx) var(--my),var(--nw-lamp2),transparent 70%)}
[data-nearby-walk] .nw-trail{z-index:2}
[data-nearby-walk] .nw-dot{position:absolute;left:-3.5px;top:-3.5px;width:7px;height:7px;border-radius:50%;background:var(--nw-trail);will-change:transform}
[data-nearby-walk] .nw-spot{cursor:pointer;outline:none}
[data-nearby-walk] .nw-hit{fill:transparent;pointer-events:all}
[data-nearby-walk] .nw-spot>:not(.nw-hit){pointer-events:none}
[data-nearby-walk] .nw-spot:focus-visible .nw-name{text-decoration:underline;text-underline-offset:3px}
[data-nearby-walk] .nw-bob{transform-box:fill-box;transform-origin:center bottom}
[data-nearby-walk] .nw-km,[data-nearby-walk] .nw-walk{transition:opacity .3s var(--nw-ease),filter .3s var(--nw-ease)}
[data-nearby-walk] .nw-km,[data-nearby-walk] .nw-spot[data-active] .nw-walk{opacity:0;filter:blur(3px)}
[data-nearby-walk] .nw-spot[data-active] .nw-km{opacity:1;filter:none}
[data-nearby-walk] .nw-spot[data-active] .nw-name{fill:var(--nw-ink)}
[data-nearby-walk] :is(.nw-line,.nw-thin,.nw-wall,.nw-stone,.nw-roof,.nw-dome,.nw-hill,.nw-lit,.nw-win,.nw-door,.nw-ground){stroke:var(--nw-ink);stroke-width:var(--nw-stroke);stroke-linejoin:round;stroke-linecap:round}
[data-nearby-walk] :is(.nw-line,.nw-thin){fill:none}
[data-nearby-walk] .nw-thin{stroke-width:var(--nw-thin)}
[data-nearby-walk] .nw-wall{fill:var(--nw-wall)}
[data-nearby-walk] .nw-stone{fill:var(--nw-stone)}
[data-nearby-walk] :is(.nw-roof,.nw-dome,.nw-door){fill:var(--nw-roof)}
[data-nearby-walk] .nw-hill{fill:var(--nw-hill);stroke:none}
[data-nearby-walk] .nw-win{fill:var(--nw-win);stroke-width:var(--nw-thin)}
[data-nearby-walk] .nw-lit{fill:var(--nw-sun);stroke-width:var(--nw-thin)}
[data-nearby-walk] .nw-far{opacity:.75}
[data-nearby-walk] .nw-bulb{fill:var(--nw-sun);stroke:var(--nw-ink);stroke-width:.8}
[data-nearby-walk] .nw-ground{fill:none;stroke:var(--nw-ground);stroke-width:calc(var(--nw-stroke) + .2);stroke-dasharray:1200}
[data-nearby-walk] .nw-route{fill:none;stroke:var(--nw-route);stroke-width:1.6;stroke-linecap:round;stroke-dasharray:2 9;opacity:.55}
[data-nearby-walk] .nw-walker{display:none;fill:var(--nw-walker);stroke:var(--nw-bg);stroke-width:1.5}
@supports (offset-path:path("M0 0")){[data-nearby-walk] .nw-walker{display:block;offset-rotate:0deg}}
[data-nearby-walk] .nw-cloud{fill:var(--nw-cloud);stroke:var(--nw-cloud-line);stroke-width:1.2}
[data-nearby-walk] .nw-beacon{fill:var(--nw-beacon);stroke:var(--nw-ink);stroke-width:1;filter:drop-shadow(0 0 3px var(--nw-glow)) drop-shadow(0 0 8px var(--nw-glow))}
[data-nearby-walk] .nw-ring{fill:none;stroke:var(--nw-beacon);stroke-width:1.5;opacity:0;transform-box:fill-box;transform-origin:center}
[data-nearby-walk] .nw-pin :is(rect,path){fill:var(--nw-pin)}
[data-nearby-walk] .nw-pin text{fill:var(--nw-pin-text);font-size:14px;font-weight:700}
[data-nearby-walk] text{font-family:inherit}
[data-nearby-walk] .nw-name{fill:var(--nw-fg);font-size:14px;font-weight:600}
[data-nearby-walk] .nw-dist{fill:var(--nw-muted);font-size:12.5px}
@media (prefers-reduced-motion:no-preference){
[data-nearby-walk][data-armed]:not([data-shown]) :is(.nw-rise,.nw-lbl,.nw-route,.nw-walker){opacity:0}
[data-nearby-walk][data-armed] .nw-ground{stroke-dashoffset:1200}
[data-nearby-walk][data-shown] .nw-ground{animation:nw-draw .9s var(--nw-ease) forwards}
[data-nearby-walk][data-shown] .nw-rise{animation:nw-rise .7s var(--nw-ease) var(--d) both}
[data-nearby-walk][data-shown] .nw-far{animation-name:nw-rise-far}
[data-nearby-walk][data-shown] .nw-lbl{animation:nw-fade .5s ease calc(var(--d) + 250ms) both}
[data-nearby-walk][data-shown] .nw-route{animation:nw-fade-route .6s ease .9s both,nw-flow 2.4s linear .9s infinite}
[data-nearby-walk][data-shown] .nw-walker{animation:nw-fade .4s ease 1.2s both,nw-walk 16s linear 1.2s infinite}
[data-nearby-walk][data-shown] .nw-walker2{animation:nw-fade .4s ease 1.2s both,nw-walk 16s linear -6.8s infinite}
[data-nearby-walk] .nw-beacon{animation:nw-blink 1.6s ease-in-out infinite}
[data-nearby-walk] .nw-ring{animation:nw-pulse 1.6s ease-out infinite}
[data-nearby-walk] .nw-tw{animation:nw-twinkle 3.2s ease-in-out var(--tw,0s) infinite alternate}
[data-nearby-walk] .nw-cloudA{animation:nw-driftA 18s ease-in-out infinite alternate}
[data-nearby-walk] .nw-cloudB{animation:nw-driftB 22s ease-in-out infinite alternate}
[data-nearby-walk] .nw-spot[data-active] .nw-bob{animation:nw-bounce .6s cubic-bezier(0.34,1.56,0.64,1) 1}
}
@keyframes nw-bounce{40%{transform:translateY(-10px)}}
@keyframes nw-draw{to{stroke-dashoffset:0}}
@keyframes nw-rise{from{opacity:0;transform:translateY(14px);filter:blur(4px)}}
@keyframes nw-rise-far{from{opacity:0;transform:translateY(14px);filter:blur(4px)}to{opacity:.75}}
@keyframes nw-fade{from{opacity:0}}
@keyframes nw-fade-route{from{opacity:0}to{opacity:.55}}
@keyframes nw-flow{to{stroke-dashoffset:-22}}
@keyframes nw-walk{from{offset-distance:0%}to{offset-distance:100%}}
@keyframes nw-blink{50%{opacity:.35}}
@keyframes nw-pulse{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(3.2)}}
@keyframes nw-twinkle{to{opacity:.55}}
@keyframes nw-driftA{to{transform:translateX(40px)}}
@keyframes nw-driftB{to{transform:translateX(-36px)}}
`;

