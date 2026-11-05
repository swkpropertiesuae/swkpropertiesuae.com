"use client"

import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/*
 * Dish Orbit Carousel (21st.dev — kedhareswer/dish-orbit-carousel)
 * Adapted for SWK Properties Homepage Hero:
 * - Page scroll (and arrows, thumbnails, side pager, keyboard, swipe) swings each
 *   circular architectural medallion out over the top on a wide orbit while the next
 *   project medallion swings in from the far side.
 * - Full-bleed Ultra-HD project backdrop crossfades smoothly with each project.
 * - Two-weight title wipes out and back in (Raleway Light thin line from the right,
 *   highlighted heavy line from the left).
 * - Developer & Payment Plan card cross-fades with staggered rows.
 * - Orbital arc morphs along the orbit in Brand Navy Blue tones (#0f2244 / #14305c).
 */

export type Dish = {
  /** The thin first title line, e.g. "Azizi Venice". */
  title: string
  /** The heavy second title line, e.g. "Crystal Lagoon". */
  subtitle: string
  /** Circular medallion photo (square/circular WebP). */
  image: string
  /** Optional full-bleed high-resolution backdrop per slide. */
  backdropImage?: string
  alt?: string
  /** Small highlighted badge line above the title. */
  eyebrow?: string
  /** Two-line label under the thumbnail. Defaults to title + subtitle. */
  label?: string
  rating: number
  chef: string
  /** Community & payment plan line under the developer's name. */
  kitchen?: string
  description: string
  likes: number
  ingredients?: string[]
  /** Badge and band colour: hex or rgb(), so the band can morph between projects. */
  accent: string
  /** Target link for primary CTA button. */
  href?: string
  /** Primary button label. */
  primaryLabel?: string
  /** Secondary button label. */
  secondaryLabel?: string
  /** WhatsApp pre-filled inquiry text. */
  whatsappText?: string
}

export type DishOrbitCarouselProps = {
  dishes?: Dish[]
  /** Root height. A definite length: percentages collapse on a host page. */
  height?: string
  /** Optional fallback photo behind the display. */
  backdrop?: string
  /** Scroll on forever or advance into page content after the final item. */
  loop?: boolean
  /** Embedded display face. Pass null to use the host's Raleway/Sans font. */
  fontSrc?: string | null
  onPlay?: (dish: Dish, index: number) => void
  onOrder?: (dish: Dish, index: number) => void
  onChange?: (index: number) => void
  className?: string
}

export const SWK_HERO_DISHES: Dish[] = [
  {
    title: "Azizi Venice",
    subtitle: "Crystal Lagoon",
    label: "Azizi Venice",
    eyebrow: "DUBAI SOUTH · 10% DOWN · 50/50 PAYMENT PLAN",
    image: "/img/hero/slides/04-azizi-venice-thumb.webp",
    backdropImage: "/img/hero/slides/04-azizi-venice-desktop.webp",
    alt: "Azizi Venice Crystal Lagoon Waterfront Community in Dubai South",
    rating: 4.9,
    chef: "Azizi Developments",
    kitchen: "Dubai South · Handover 2026–2028 · From AED 690K",
    description:
      "Swimmable crystal lagoon boulevard, climate-controlled retail promenade, and cultural opera district next to Al Maktoum International Airport.",
    likes: 184,
    ingredients: [
      "10% Down Payment",
      "50/50 Payment Plan",
      "Swimmable Lagoon",
      "Studios to Villas",
      "DLD Escrow Verified",
    ],
    accent: "#1e4b8f",
    href: "/off-plan/azizi-venice",
    primaryLabel: "Explore Azizi Venice",
    secondaryLabel: "Price List",
    whatsappText:
      "Hello SWK Properties, please share the floor plans and DLD cost sheet for Azizi Venice.",
  },
  {
    title: "Sobha Century",
    subtitle: "Sky Sanctuary",
    label: "Sobha Century",
    eyebrow: "SOBHA HARTLAND & MBR CITY · 60/40 PAYMENT PLAN",
    image: "/img/hero/slides/05-sobha-century-thumb.webp",
    backdropImage: "/img/hero/slides/05-sobha-century-desktop.webp",
    alt: "Sobha Century & Sobha One Golf & Lagoon Residences",
    rating: 5.0,
    chef: "Sobha Realty",
    kitchen: "MBR City & Ras Al Khor · Handover Q4 2026 · From AED 1.55M",
    description:
      "Backward-integrated construction quality overlooking an 18-hole pitch & putt golf course, sky-linked courtyard towers, and wildlife sanctuary views.",
    likes: 212,
    ingredients: [
      "60/40 Payment Plan",
      "18-Hole Golf Course",
      "12 Mins to DIFC",
      "1–4 BR & Duplexes",
      "In-House Sobha Build",
    ],
    accent: "#0f2244",
    href: "/off-plan/sobha-century",
    primaryLabel: "Explore Sobha Releases",
    secondaryLabel: "Price List",
    whatsappText:
      "Hello SWK Properties, please share available units and payment plan details for Sobha Century & Sobha One.",
  },
  {
    title: "DAMAC Islands",
    subtitle: "Lagoon Villas",
    label: "DAMAC Islands",
    eyebrow: "DUBAILAND WATERFRONT · 75/25 PAYMENT PLAN",
    image: "/img/hero/slides/06-damac-islands-thumb.webp",
    backdropImage: "/img/hero/slides/06-damac-islands-desktop.webp",
    alt: "DAMAC Islands Tropical Lagoon Townhouses and Villas",
    rating: 4.9,
    chef: "DAMAC Properties",
    kitchen: "Dubailand Master Corridor · Handover Q4 2028 · From AED 2.25M",
    description:
      "Master-planned island clusters with private white-sand beaches, aqua domes, lagoon waterfalls, and family townhouses & 6-bedroom waterfront villas.",
    likes: 176,
    ingredients: [
      "75/25 Payment Plan",
      "4–5 BR Townhouses",
      "6–7 BR Island Villas",
      "Golden Visa Eligible",
      "Private Lagoon Beach",
    ],
    accent: "#163a70",
    href: "/off-plan/damac-islands",
    primaryLabel: "Explore DAMAC Islands",
    secondaryLabel: "Price List",
    whatsappText:
      "Hello SWK Properties, please send the masterplan and villa availability for DAMAC Islands.",
  },
  {
    title: "Emaar Oasis",
    subtitle: "Canal Mansions",
    label: "Emaar The Oasis",
    eyebrow: "EMAAR FLAGSHIP · 10% DOWN · 80/20 PAYMENT PLAN",
    image: "/img/hero/slides/05-emaar-the-oasis-thumb.webp",
    backdropImage: "/img/hero/slides/05-emaar-the-oasis-desktop.webp",
    alt: "Emaar The Oasis & Dubai Hills Estate Waterfront Villas",
    rating: 5.0,
    chef: "Emaar Properties",
    kitchen: "Dubailand & Dubai Hills · Handover 2028 · From AED 8.5M",
    description:
      "100-million-sq-ft low-density luxury estate where 25% of the masterplan is dedicated to navigable water canals, parks, and private-jetty mansions.",
    likes: 245,
    ingredients: [
      "10% Down Payment",
      "80/20 Emaar Plan",
      "4–6 BR Canal Villas",
      "25% Water & Parks",
      "AED 2M+ Golden Visa",
    ],
    accent: "#1b437e",
    href: "/off-plan/emaar-the-oasis",
    primaryLabel: "Explore Emaar Oasis",
    secondaryLabel: "Price List",
    whatsappText:
      "Hello SWK Properties, please share the floor plans and availability for Emaar The Oasis & Dubai Hills Estate.",
  },
  {
    title: "Imtiaz Kore",
    subtitle: "Dubai Islands",
    label: "Imtiaz Kore",
    eyebrow: "NEW LAUNCH ALERT · 60/40 FLEXIBLE PAYMENT PLAN",
    image: "/img/hero/slides/02-imtiaz-kore-thumb.webp",
    backdropImage: "/img/hero/slides/02-imtiaz-kore-desktop.webp",
    alt: "Imtiaz Kore & Wynwood Horizon Waterfront Residences",
    rating: 4.8,
    chef: "Imtiaz Developments",
    kitchen: "Dubai Islands & Meydan · Handover 2027 · From AED 1.05M",
    description:
      "Fully furnished smart-home residences with rooftop infinity pools, private plunge-pool terraces, and direct marina & island beach access.",
    likes: 163,
    ingredients: [
      "60/40 Payment Plan",
      "Fully Furnished",
      "Smart Home Automation",
      "Private Pool Terraces",
      "High Rental Yield",
    ],
    accent: "#13315c",
    href: "/off-plan/imtiaz-kore",
    primaryLabel: "Explore Imtiaz Kore",
    secondaryLabel: "Price List",
    whatsappText:
      "Hello SWK Properties, please share the launch brochure and price list for Imtiaz Kore.",
  },
  {
    title: "Azizi Florence",
    subtitle: "Riviera Living",
    label: "Azizi Florence",
    eyebrow: "METRO-CONNECTED · AL FURJAN & MEYDAN · 50/50 PLAN",
    image: "/img/hero/slides/03-azizi-florence-thumb.webp",
    backdropImage: "/img/hero/slides/03-azizi-florence-desktop.webp",
    alt: "Azizi Florence Italian-Inspired Waterfront Residences",
    rating: 4.8,
    chef: "Azizi Developments",
    kitchen: "Al Furjan & Meydan · Handover 2027 · From AED 740K",
    description:
      "Italian-inspired architectural facades, landscaped podium pools, and walkable Dubai Metro Route 2020 connectivity built for high-yield leasing.",
    likes: 158,
    ingredients: [
      "10% Booking",
      "50/50 Payment Plan",
      "Walk to Metro",
      "7%–8.5% Est. Gross ROI",
      "0% Buyer Commission",
    ],
    accent: "#214f94",
    href: "/off-plan/azizi-florence",
    primaryLabel: "Explore Azizi Florence",
    secondaryLabel: "Price List",
    whatsappText:
      "Hello SWK Properties, please share available units and payment schedule for Azizi Florence.",
  },
]

// #region carousel
export function wrapIndex(i: number, n: number): number {
  if (n <= 0) return 0
  return ((Math.round(i) % n) + n) % n
}

/** Which way to swing when jumping from one dish to another: the shorter way round. */
export function stepDirection(from: number, to: number, n: number): 1 | -1 {
  if (n <= 0) return 1
  const fwd = (((to - from) % n) + n) % n
  return fwd <= n - fwd ? 1 : -1
}

/** Scroll stretches in the section: one per dish change, plus one back round to the first when looping. */
export function scrollSteps(n: number, loop: boolean): number {
  return Math.max(0, loop ? n : n - 1)
}

/** The scroll stretch for dish `i` nearest the current one (when looping, dish 0 is also the last stretch). */
export function segmentFor(i: number, current: number, n: number, loop: boolean): number {
  return loop && i === 0 && current > n / 2 ? n : i
}

/** First thumbnail shown in the strip window, keeping the current one in view. */
export function stripStart(index: number, n: number, visible: number): number {
  if (n <= visible) return 0
  return Math.max(0, Math.min(index - 1, n - visible))
}

/** Title font size so a line of `chars` characters fits `width` px at `em` average glyph width. */
export function fitSize(chars: number, max: number, width: number, em: number): number {
  return Math.min(max, width / (Math.max(1, chars) * em))
}

/**
 * The orbital band: a thick stroke along the plates' orbit circle, tapering at
 * both ends. Angles in degrees, screen space (0 = right, 90 = straight down).
 */
export function arcPath(a0: number, a1: number, cx: number, cy: number, r: number, w: number, steps = 48): string {
  const outer: string[] = []
  const inner: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45)
    const c = Math.cos(a)
    const s = Math.sin(a)
    outer.push((cx + c * (r + h)).toFixed(1) + " " + (cy + s * (r + h)).toFixed(1))
    inner.push((cx + c * (r - h)).toFixed(1) + " " + (cy + s * (r - h)).toFixed(1))
  }
  return "M" + outer.join("L") + "L" + inner.reverse().join("L") + "Z"
}

export const ARC_REST = [[50, 98], [46, 124], [60, 126], [40, 100]]
export function arcRest(index: number): number[] {
  return ARC_REST[((index % ARC_REST.length) + ARC_REST.length) % ARC_REST.length]
}

export const ARC_SWEEP = [38, 146]
// #endregion

const ORBIT_X = 285
const ORBIT_Y = -455
const ORBIT_R = 650
const SCROLL_PER_DISH = 0.38 // Smooth scroll distance per project slide
const SWING = 50 // Degrees the medallion travels round the orbit's pivot
const ITEM = 136 // Thumbnail pitch in canvas px
const VISIBLE = 4

const CSS =
  "@keyframes dsh-sun-pulse{0%,100%{opacity:.78;transform:scale(1) translate(0,0)}50%{opacity:1;transform:scale(1.06) translate(-12px,8px)}}" +
  "@keyframes dsh-float-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}" +
  ".dsh-trk{position:relative;width:100%}" +
  ".dsh-root{position:sticky;top:0;overflow:hidden;width:100%;background:#0b1528;color:#ffffff;" +
  "font-family:var(--font-raleway),ui-sans-serif,system-ui,sans-serif;container-type:inline-size;-webkit-tap-highlight-color:transparent}" +
  ".dsh-root *{box-sizing:border-box}" +
  ".dsh-bd{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;object-position:center;pointer-events:none;transition:opacity .7s cubic-bezier(.22,1,.36,1),transform 6s ease-out;filter:brightness(1.05) contrast(1.04)}" +
  ".dsh-scrim{position:absolute;inset:0;pointer-events:none;" +
  "background:linear-gradient(90deg,rgba(8,18,36,.72) 0%,rgba(8,18,36,.48) 52%,rgba(8,18,36,.28) 100%)," +
  "linear-gradient(180deg,rgba(8,18,36,.58) 0%,rgba(8,18,36,.08) 32%,rgba(8,18,36,.16) 68%,rgba(8,18,36,.72) 100%)}" +
  ".dsh-sunlight{position:absolute;inset:0;pointer-events:none;z-index:1;animation:dsh-sun-pulse 9s ease-in-out infinite;" +
  "background:radial-gradient(62% 52% at 64% 16%,rgba(255,250,236,.26) 0%,rgba(255,255,255,.08) 42%,transparent 74%)," +
  "radial-gradient(520px circle at var(--spot-x,50%) var(--spot-y,32%),rgba(255,252,242,.16) 0%,transparent 70%)}" +
  ".dsh-root:focus-visible{outline:2px solid #ffffff;outline-offset:-4px}" +
  ".dsh-canvas{position:absolute;left:50%;top:55%;width:1040px;height:520px;transform:translate(-50%,-50%) scale(var(--dsh-s,1));transform-origin:50% 50%;z-index:2}" +
  ".dsh-arc{position:absolute;left:0;top:0;width:1040px;height:520px;overflow:visible;pointer-events:none}" +
  ".dsh-btn{appearance:none;border:0;background:none;color:inherit;font:inherit;padding:0;margin:0;cursor:pointer}" +
  ".dsh-btn:focus-visible{outline:2px solid #ffffff;outline-offset:3px;border-radius:10px}" +
  ".dsh-ico{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}" +
  ".dsh-pager{position:absolute;left:22px;top:138px;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:5}" +
  ".dsh-dot{width:18px;height:14px;display:grid;place-items:center;transition:transform .25s}" +
  ".dsh-dot:hover{transform:scale(1.25)}" +
  ".dsh-dot i{display:block;width:5px;height:5px;border-radius:99px;background:#ffffff;opacity:.55;transition:height .45s cubic-bezier(.3,.7,.2,1),opacity .3s,background .3s,box-shadow .3s}" +
  ".dsh-dot:hover i{opacity:.9;box-shadow:0 0 8px rgba(255,255,255,.75)}" +
  ".dsh-dot[aria-current] i{height:24px;opacity:1;background:#ffffff;box-shadow:0 0 12px rgba(255,255,255,.9)}" +
  ".dsh-dot[aria-current]{height:28px}" +
  ".dsh-plates{position:absolute;left:64px;top:52px;width:244px;height:244px;touch-action:pan-y;z-index:4}" +
  ".dsh-orbit{position:absolute;inset:0;transform-origin:69% -217%;will-change:transform}" +
  ".dsh-medallion{position:relative;width:244px;height:244px;border-radius:9999px;padding:6px;" +
  "background:linear-gradient(135deg,rgba(255,255,255,.98) 0%,rgba(22,52,102,.92) 52%,rgba(255,250,240,.92) 100%);" +
  "box-shadow:0 24px 52px rgba(0,0,0,.46),0 0 28px rgba(255,250,240,.22),inset 0 1.5px 0 rgba(255,255,255,.75);" +
  "transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s}" +
  ".dsh-medallion:hover{transform:scale(1.03) translateY(-2px);box-shadow:0 28px 60px rgba(0,0,0,.52),0 0 38px rgba(255,252,240,.38)}" +
  ".dsh-medallion>img{display:block;width:100%;height:100%;border-radius:9999px;object-fit:cover;user-select:none;-webkit-user-drag:none}" +
  ".dsh-medallion-tag{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);white-space:nowrap;" +
  "background:radial-gradient(120% 140% at 50% 0%,rgba(255,255,255,.26) 0%,rgba(15,34,68,.96) 65%);" +
  "color:#ffffff;border:1px solid rgba(255,255,255,.48);border-radius:9999px;padding:4px 12px;" +
  "font-size:9.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;box-shadow:0 8px 20px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.35)}" +
  ".dsh-head{position:absolute;left:336px;top:52px;width:384px;height:178px;z-index:4}" +
  ".dsh-hd{position:absolute;inset:0}" +
  ".dsh-eye{display:inline-flex;align-items:center;gap:6px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" +
  "font-size:9.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;" +
  "background:radial-gradient(120% 150% at 50% 0%,rgba(255,252,242,.24) 0%,rgba(15,34,68,.94) 68%);" +
  "color:#ffffff;border:1px solid rgba(255,255,255,.45);border-radius:9999px;padding:5px 13px;margin:0 0 8px 0;" +
  "box-shadow:0 8px 24px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.4)}" +
  ".dsh-t1,.dsh-t2{display:block;white-space:nowrap;line-height:1.04;text-transform:uppercase;margin:0}" +
  ".dsh-t1{font-weight:300;letter-spacing:.035em;margin-top:2px;color:#ffffff;text-shadow:0 4px 22px rgba(0,0,0,.55)}" +
  ".dsh-t2{font-weight:800;letter-spacing:.01em;margin-top:6px;color:#ffffff;" +
  "background:radial-gradient(130% 160% at 30% 0%,rgba(255,252,240,.26) 0%,rgba(27,63,122,.96) 50%,rgba(15,34,68,.98) 100%);" +
  "border:1px solid rgba(255,255,255,.45);" +
  "display:inline-block;padding:4px 14px 5px;border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.42)}" +
  ".dsh-kpis{display:flex;gap:6px;margin-top:10px;flex-wrap:nowrap;align-items:center}" +
  ".dsh-kpi{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#ffffff;white-space:nowrap;" +
  "background:radial-gradient(120% 140% at 50% 0%,rgba(255,255,255,.22) 0%,rgba(15,34,68,.88) 70%);" +
  "border:1px solid rgba(255,255,255,.34);border-radius:9999px;padding:4px 9px;backdrop-filter:blur(10px);" +
  "box-shadow:inset 0 1px 0 rgba(255,255,255,.3);transition:transform .25s,border-color .25s,box-shadow .25s}" +
  ".dsh-kpi:hover{transform:translateY(-1.5px);border-color:rgba(255,255,255,.65);box-shadow:0 6px 16px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.5)}" +
  ".dsh-acts{position:absolute;left:336px;top:244px;width:384px;display:flex;align-items:center;gap:10px;flex-wrap:nowrap;font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;z-index:5}" +
  ".dsh-act-primary{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;border-radius:9999px;white-space:nowrap;flex-shrink:0;" +
  "background:radial-gradient(120% 150% at 50% 0%,rgba(255,252,240,.28) 0%,rgba(15,34,68,.98) 65%);" +
  "color:#ffffff;border:1px solid rgba(255,255,255,.5);box-shadow:0 12px 28px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.45);" +
  "transition:all .28s cubic-bezier(.22,1,.36,1)}" +
  ".dsh-act-primary:hover{background:radial-gradient(120% 150% at 50% 0%,rgba(255,252,240,.4) 0%,rgba(24,56,110,1) 68%);" +
  "transform:translateY(-2px) scale(1.02);border-color:#ffffff;box-shadow:0 16px 34px rgba(0,0,0,.46),0 0 24px rgba(255,252,240,.28),inset 0 1px 0 rgba(255,255,255,.65)}" +
  ".dsh-act-secondary{display:inline-flex;align-items:center;gap:7px;padding:10px 14px;border-radius:9999px;white-space:nowrap;flex-shrink:0;" +
  "background:radial-gradient(120% 140% at 50% 0%,#ffffff 0%,#f5f0e6 100%);" +
  "color:#0f2244;border:1px solid #ffffff;box-shadow:0 12px 28px rgba(0,0,0,.32),inset 0 1px 0 #ffffff;" +
  "transition:all .28s cubic-bezier(.22,1,.36,1)}" +
  ".dsh-act-secondary:hover{background:#ffffff;transform:translateY(-2px) scale(1.02);box-shadow:0 16px 34px rgba(0,0,0,.42),0 0 24px rgba(255,255,255,.42)}" +
  ".dsh-acts .dsh-ico{width:13px;height:13px;flex-shrink:0;transition:transform .25s}" +
  ".dsh-act-primary:hover .dsh-ico{transform:translateX(2.5px)}" +
  ".dsh-acts .dsh-fill{fill:currentColor;stroke:none}" +
  ".dsh-card{position:absolute;left:742px;top:52px;width:280px;padding:18px 20px 20px;border-radius:24px;z-index:5;overflow:hidden;" +
  "background:radial-gradient(260px circle at var(--card-x,50%) var(--card-y,12%),rgba(255,251,238,.25) 0%,rgba(255,255,255,.06) 48%,transparent 80%)," +
  "linear-gradient(165deg,rgba(20,45,88,.94) 0%,rgba(12,26,54,.95) 100%);" +
  "color:#ffffff;-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);" +
  "border:1px solid rgba(255,255,255,.42);box-shadow:0 24px 56px rgba(0,0,0,.48),0 0 32px rgba(255,250,240,.12),inset 0 1.5px 0 rgba(255,255,255,.55);" +
  "transition:transform .35s cubic-bezier(.22,1,.36,1),border-color .35s,box-shadow .35s}" +
  ".dsh-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.68);box-shadow:0 30px 64px rgba(0,0,0,.54),0 0 40px rgba(255,251,238,.22),inset 0 1.5px 0 rgba(255,255,255,.75)}" +
  ".dsh-tabs{display:flex;justify-content:space-between;padding:4px;border-radius:9999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);font-size:11px;margin-bottom:14px}" +
  ".dsh-tab{color:rgba(255,255,255,.78);font-weight:600;padding:5px 14px;border-radius:9999px;transition:all .25s}" +
  ".dsh-tab:hover{color:#ffffff;background:rgba(255,255,255,.1)}" +
  ".dsh-tab[aria-selected=true]{background:#ffffff;color:#0f2244;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.22)}" +
  ".dsh-bodies{display:grid}" +
  ".dsh-body{grid-area:1/1}" +
  ".dsh-rate{position:relative;height:56px;margin:0 0 10px 2px;display:flex;align-items:center;gap:12px}" +
  ".dsh-badge{width:46px;height:54px;border-radius:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;" +
  "border:1px solid rgba(255,255,255,.45);box-shadow:0 8px 20px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.4)}" +
  ".dsh-badge svg{width:14px;height:14px;fill:#ffffff}" +
  ".dsh-num{font-size:30px;font-weight:800;letter-spacing:-.03em;line-height:1;color:#ffffff}" +
  ".dsh-rate-lbl{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.11em;color:rgba(255,255,255,.85);line-height:1.3}" +
  ".dsh-chef{font-size:17px;font-weight:700;letter-spacing:-.01em;margin:0;color:#ffffff}" +
  ".dsh-kit{font-size:11px;font-weight:600;color:rgba(255,255,255,.85);margin:4px 0 8px;line-height:1.35}" +
  ".dsh-desc{font-size:12px;line-height:1.45;margin:0;min-height:68px;color:rgba(255,255,255,.94)}" +
  ".dsh-ing{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none;min-height:68px;align-content:flex-start}" +
  ".dsh-ing li{font-size:10.5px;font-weight:600;padding:4px 10px;border-radius:99px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.28);color:#ffffff;transition:transform .2s,background .2s}" +
  ".dsh-ing li:hover{transform:translateY(-1px);background:rgba(255,255,255,.24)}" +
  ".dsh-react{display:flex;gap:8px;margin-top:14px;align-items:center;justify-content:space-between;flex-wrap:nowrap}" +
  ".dsh-like{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-radius:99px;font-size:10.5px;font-weight:700;white-space:nowrap;flex-shrink:0;" +
  "background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.32);color:#ffffff;box-shadow:inset 0 1px 0 rgba(255,255,255,.25);transition:all .25s}" +
  ".dsh-like:hover{background:rgba(255,255,255,.26);transform:translateY(-1.5px);border-color:rgba(255,255,255,.55)}" +
  ".dsh-meh{height:34px;padding:0 13px;display:inline-flex;align-items:center;gap:4px;border-radius:99px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;flex-shrink:0;" +
  "background:#ffffff;color:#0f2244;box-shadow:0 6px 16px rgba(0,0,0,.22);transition:all .25s}" +
  ".dsh-meh:hover{background:#f5f0e6;transform:translateY(-1.5px) scale(1.03);box-shadow:0 10px 22px rgba(0,0,0,.3)}" +
  ".dsh-react .dsh-ico{width:14px;height:14px;flex-shrink:0}" +
  ".dsh-react [aria-pressed=true] .dsh-ico{fill:currentColor}" +
  ".dsh-strip{position:absolute;left:64px;top:340px;width:654px;height:132px;display:flex;align-items:center;justify-content:space-between;z-index:5;overflow:hidden;" +
  "background:radial-gradient(280px circle at var(--strip-x,50%) var(--strip-y,10%),rgba(255,251,238,.22) 0%,transparent 75%)," +
  "linear-gradient(165deg,rgba(18,40,80,.9) 0%,rgba(12,26,54,.92) 100%);" +
  "border:1px solid rgba(255,255,255,.38);border-radius:24px;padding:0 10px;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);" +
  "box-shadow:0 20px 46px rgba(0,0,0,.42),inset 0 1.5px 0 rgba(255,255,255,.48);transition:border-color .3s,box-shadow .3s}" +
  ".dsh-strip:hover{border-color:rgba(255,255,255,.58);box-shadow:0 24px 52px rgba(0,0,0,.48),0 0 30px rgba(255,251,238,.16),inset 0 1.5px 0 rgba(255,255,255,.65)}" +
  ".dsh-arrow{width:36px;height:36px;display:grid;place-items:center;flex:none;border-radius:9999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);color:#ffffff;transition:all .25s}" +
  ".dsh-arrow:hover{background:rgba(255,255,255,.28);transform:scale(1.08);border-color:rgba(255,255,255,.6)}" +
  ".dsh-arrow svg{width:11px;height:14px;fill:currentColor}" +
  ".dsh-win{position:relative;width:" + ITEM * VISIBLE + "px;height:120px;overflow:hidden;flex:none;margin:0 4px}" +
  ".dsh-track{position:absolute;left:0;top:0;display:flex;transition:transform .6s cubic-bezier(.65,0,.35,1)}" +
  ".dsh-th{width:" + ITEM + "px;height:120px;display:flex;justify-content:center;align-items:center}" +
  ".dsh-th .dsh-btn{width:124px;height:108px;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:6px;transition:all .3s cubic-bezier(.22,1,.36,1);border:1px solid transparent}" +
  ".dsh-th .dsh-btn:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.35);transform:translateY(-2px)}" +
  ".dsh-th .dsh-btn[aria-current]{background:radial-gradient(120% 140% at 50% 0%,rgba(255,252,240,.28) 0%,rgba(255,255,255,.14) 100%);border-color:rgba(255,255,255,.72);box-shadow:0 10px 24px -8px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.5)}" +
  ".dsh-th img{width:54px;height:54px;border-radius:9999px;max-width:none;object-fit:cover;border:2px solid rgba(255,255,255,.85);box-shadow:0 4px 10px rgba(0,0,0,.3);transition:transform .35s,border-color .35s}" +
  ".dsh-th .dsh-btn:hover img{transform:scale(1.06)}" +
  ".dsh-th .dsh-btn[aria-current] img{transform:scale(1.08);border-color:#ffffff}" +
  ".dsh-th span{font-size:10.5px;line-height:1.2;text-align:center;font-weight:700;color:#ffffff;max-width:112px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
  ".dsh-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  "@container (max-width:767px){" +
  ".dsh-canvas{position:relative;left:auto;top:auto;width:100%;height:auto;transform:none;display:flex;flex-direction:column;align-items:center;padding:96px 16px 20px}" +
  ".dsh-arc{width:180%;height:auto;left:-40%;top:20px}" +
  ".dsh-pager{left:12px;top:140px}" +
  ".dsh-plates{position:relative;left:auto;top:auto;width:min(46vw,26svh);height:min(46vw,26svh);margin-top:0}" +
  ".dsh-medallion{width:100%;height:100%}" +
  ".dsh-head{position:relative;left:auto;top:auto;width:100%;height:152px;margin-top:8px}" +
  ".dsh-hd{text-align:center;transform:scale(.82);transform-origin:50% 0}" +
  ".dsh-kpis{justify-content:center;flex-wrap:wrap}" +
  ".dsh-acts{position:relative;left:auto;top:auto;width:100%;margin-top:8px;flex-wrap:wrap;justify-content:center}" +
  ".dsh-card{position:relative;left:auto;top:auto;width:100%;max-width:420px;margin-top:12px;padding:14px 16px}" +
  ".dsh-strip{display:none}" +
  "}" +
  "@media (prefers-reduced-motion:reduce){.dsh-track,.dsh-dot,.dsh-dot i,.dsh-th .dsh-btn,.dsh-th img,.dsh-like,.dsh-sunlight{transition:none;animation:none}}"

const HIDE_1 = "inset(0% 0% 0% 100%)" // thin line: wipes in from the right
const HIDE_2 = "inset(0% 100% 0% 0%)" // heavy line: wipes in from the left
const SHOW = "inset(0% 0% 0% 0%)"

const Icon = {
  play: (
    <svg className="dsh-ico dsh-fill" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" fill="none" />
    </svg>
  ),
  order: (
    <svg className="dsh-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  up: (
    <svg className="dsh-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
}

export function DishOrbitCarousel({
  dishes = SWK_HERO_DISHES,
  height = "100svh",
  backdrop = "/img/hero/slides/01-dubai-horizon-desktop.webp",
  loop = false,
  fontSrc = null,
  onPlay,
  onOrder,
  onChange,
  className,
}: DishOrbitCarouselProps) {
  const router = useRouter()
  const n = dishes.length
  const [index, setIndex] = useState(0)
  const [tab, setTab] = useState("overview")
  const [liked, setLiked] = useState({} as Record<number, boolean>)

  const trackRef = useRef(null as HTMLDivElement | null)
  const rootRef = useRef(null as HTMLDivElement | null)
  const stRef = useRef(null as ScrollTrigger | null)
  const segRef = useRef(0)
  const indexRef = useRef(0)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const orbits = useRef([] as (HTMLDivElement | null)[])
  const heads = useRef([] as (HTMLDivElement | null)[])
  const bodies = useRef([] as (HTMLDivElement | null)[])
  const arcRef = useRef(null as SVGPathElement | null)
  const arc = useRef({ a0: 0, a1: 0 })
  const shown = useRef(-1)
  const dirRef = useRef(1 as 1 | -1)
  const tlRef = useRef(null as gsap.core.Timeline | null)
  const reducedRef = useRef(false)
  const swipe = useRef(null as { x: number; y: number } | null)

  // Fit the 1040 x 520 design canvas to the root. Measured on resize only.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const fit = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      // Leave room at the top for the transparent SiteHeader (~92px)
      const usableH = Math.max(420, h - 88)
      el.style.setProperty("--dsh-s", String(Math.min(w / 1080, usableH / 535, 1.32)))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => (reducedRef.current = mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  // The swap. Every dish is in the DOM; GSAP only moves the outgoing and incoming ones.
  useLayoutEffect(() => {
    const from = shown.current
    const to = index
    const parts = (i: number) => {
      const head = heads.current[i]
      return {
        orbit: orbits.current[i],
        head,
        eye: head && head.querySelector(".dsh-eye"),
        t1: head && head.querySelector(".dsh-t1"),
        t2: head && head.querySelector(".dsh-t2"),
        body: bodies.current[i],
      }
    }
    const drawArc = () =>
      arcRef.current?.setAttribute(
        "d",
        arcPath(arc.current.a0, arc.current.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118)
      )
    const rest = arcRest(to)
    const tint = dishes[to] ? dishes[to].accent : "transparent"
    if (tlRef.current) tlRef.current.progress(1).kill()
    const b = parts(to)
    for (let i = 0; i < n; i++) {
      if (i !== from && i !== to) {
        const p = parts(i)
        gsap.set([p.orbit, p.head, p.body], { autoAlpha: 0, rotation: 0 })
      }
    }
    if (from === -1 || from === to || reducedRef.current) {
      for (let i = 0; i < n; i++)
        if (i !== to) {
          const p = parts(i)
          gsap.set([p.orbit, p.head, p.body], { autoAlpha: 0, rotation: 0 })
        }
      gsap.set([b.orbit, b.head, b.body, b.eye], { autoAlpha: 1, rotation: 0, y: 0 })
      gsap.set(b.t1, { clipPath: SHOW })
      gsap.set(b.t2, { clipPath: SHOW })
      arc.current.a0 = rest[0]
      arc.current.a1 = rest[1]
      drawArc()
      if (arcRef.current) gsap.set(arcRef.current, { fill: tint })
      shown.current = to
      return
    }
    const a = parts(from)
    const d = dirRef.current
    const tl = gsap.timeline({
      onComplete: () => {
        tlRef.current = null
      },
    })
    tlRef.current = tl
    // Medallion plate: swings out over the top on the orbit, next swings in smoothly
    tl.to(a.orbit, { rotation: SWING * d, autoAlpha: 0, duration: 0.55, ease: "power2.in" }, 0)
      .set(a.orbit, { rotation: 0 }, 0.55)
      .fromTo(
        b.orbit,
        { autoAlpha: 0, rotation: -SWING * 0.65 * d },
        { autoAlpha: 1, rotation: 0, duration: 0.75, ease: "power3.out" },
        0.18
      )
    // Title: thin line clips away to the right, heavy line to the left, then next wipes in
    tl.to(a.t1, { clipPath: HIDE_1, duration: 0.42, ease: "power2.in" }, 0)
      .to(a.t2, { clipPath: HIDE_2, duration: 0.42, ease: "power2.in" }, 0.06)
      .to(a.eye, { autoAlpha: 0, duration: 0.25 }, 0)
      .set(a.head, { autoAlpha: 0 }, 0.5)
      .set(b.head, { autoAlpha: 1 }, 0.5)
      .fromTo(
        b.eye,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.55
      )
      .fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.55)
      .fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.62)
    // Card: cross-fade, incoming rows rise in turn
    tl.to(a.body, { autoAlpha: 0, y: -6, duration: 0.3, ease: "power1.in" }, 0.05).set(
      b.body,
      { autoAlpha: 1, y: 0 },
      0.4
    )
    if (b.body)
      tl.fromTo(
        b.body.children,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
        0.4
      )
    // Orbital band stretches along the orbit with the plates, then settles into the next span
    tl.to(
      arc.current,
      { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: 0.6, ease: "power2.inOut", onUpdate: drawArc },
      0
    ).to(
      arc.current,
      { a0: rest[0], a1: rest[1], duration: 0.85, ease: "power3.out", onUpdate: drawArc },
      0.6
    )
    if (arcRef.current) tl.to(arcRef.current, { fill: tint, duration: 1.1, ease: "power1.inOut" }, 0.1)
    shown.current = to
  }, [index, n, dishes])

  useEffect(
    () => () => {
      tlRef.current?.kill()
    },
    []
  )

  const select = (next: number, dir: 1 | -1) => {
    if (next === indexRef.current) return
    dirRef.current = dir
    indexRef.current = next
    setIndex(next)
    onChangeRef.current?.(next)
  }

  // The page scroll drives the project orbit: the stage pins, one stretch of scroll per project.
  const steps = scrollSteps(n, loop)
  useEffect(() => {
    const track = trackRef.current
    if (!track || steps < 1) return
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      snap: { snapTo: 1 / steps, duration: { min: 0.25, max: 0.65 }, delay: 0.05, ease: "power2.inOut" },
      onUpdate: (self) => {
        if (loop && self.progress >= 1 && self.direction > 0) {
          segRef.current = 0
          self.scroll(self.start + 1)
          select(0, 1)
          return
        }
        const seg = Math.round(self.progress * steps)
        if (seg === segRef.current) return
        const dir = seg > segRef.current ? 1 : -1
        segRef.current = seg
        select(wrapIndex(seg, n), dir)
      },
    })
    stRef.current = trigger
    return () => {
      trigger.kill()
      stRef.current = null
    }
  }, [steps, loop, n])

  const go = (to: number, dir?: 1 | -1) => {
    if (n < 2) return
    const next = wrapIndex(to, n)
    if (next === index) return
    const st = stRef.current
    const y = st ? st.scroll() : 0
    if (st && y >= st.start - 1 && y <= st.end + 1) {
      const seg = segmentFor(next, segRef.current, n, loop)
      segRef.current = seg
      st.scroll(st.start + ((st.end - st.start) * seg) / steps)
    }
    select(next, dir ?? stepDirection(index, next, n))
  }
  const step = (d: 1 | -1) => go(index + d, d)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      step(1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      step(-1)
    }
  }
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s) return
    const dx = e.clientX - s.x
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) step(dx < 0 ? 1 : -1)
  }

  const handlePrimaryAction = (d: Dish, idx: number) => {
    if (onPlay) {
      onPlay(d, idx)
      return
    }
    if (d.href) {
      router.push(d.href)
    } else {
      router.push("/off-plan")
    }
  }

  const handleSecondaryAction = (d: Dish, idx: number) => {
    if (onOrder) {
      onOrder(d, idx)
      return
    }
    const text = encodeURIComponent(
      d.whatsappText ||
        `Hello SWK Properties, please share the brochure and price list for ${d.title} (${d.subtitle}).`
    )
    window.open(`https://wa.me/971564330448?text=${text}`, "_blank", "noopener,noreferrer")
  }

  const onRootPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`)
  }

  const onCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--card-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--card-y", `${e.clientY - rect.top}px`)
  }

  const onStripPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--strip-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--strip-y", `${e.clientY - rect.top}px`)
  }

  const start = stripStart(index, n, VISIBLE)
  const dish = dishes[index]

  return (
    <div
      ref={trackRef}
      className={"dsh-trk" + (className ? " " + className : "")}
      style={{ height: "calc(" + height + " * " + (1 + steps * SCROLL_PER_DISH) + ")" }}
    >
      <div
        ref={rootRef}
        className="dsh-root"
        style={{ height }}
        role="region"
        aria-roledescription="carousel"
        aria-label="SWK Properties Flagship UAE Projects Orbit Carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerMove={onRootPointerMove}
      >
        <style>{CSS}</style>

        {/* Crossfading Full-Bleed Ultra-HD Daylight Project Backdrops */}
        {dishes.map((d, i) => (
          <img
            key={d.title + i}
            className="dsh-bd"
            src={d.backdropImage || backdrop}
            alt={d.alt || d.title}
            loading="eager"
            decoding="sync"
            onError={(e) => {
              const target = e.currentTarget
              if (target.src !== window.location.origin + backdrop) {
                target.src = backdrop
              }
            }}
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? "scale(1.03)" : "scale(1.08)",
            }}
          />
        ))}
        <div className="dsh-scrim" />
        <div className="dsh-sunlight" />

        <div className="dsh-canvas">
          <svg className="dsh-arc" viewBox="0 0 1040 520" aria-hidden="true">
            <path ref={arcRef} style={{ opacity: 0.76 }} />
          </svg>

          <div className="dsh-pager" role="tablist" aria-label="Choose a flagship project">
            {dishes.map((d, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                className="dsh-btn dsh-dot"
                aria-selected={i === index}
                aria-current={i === index ? "true" : undefined}
                aria-label={d.title + " " + d.subtitle}
                onClick={() => go(i)}
              >
                <i />
              </button>
            ))}
          </div>

          <div
            className="dsh-plates"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            {dishes.map((d, i) => (
              <div
                key={i}
                ref={(el) => {
                  orbits.current[i] = el
                }}
                className="dsh-orbit"
                aria-hidden={i !== index}
                style={{
                  visibility: i === index ? "visible" : "hidden",
                  opacity: i === index ? 1 : 0,
                }}
              >
                <div className="dsh-medallion">
                  <img
                    src={d.image}
                    alt={d.alt ?? d.title + " " + d.subtitle}
                    width={240}
                    height={240}
                    loading="eager"
                    decoding="sync"
                    draggable={false}
                    onError={(e) => {
                      const target = e.currentTarget
                      const fallback = "/img/hero/slides/01-dubai-horizon-thumb.webp"
                      if (!target.src.endsWith(fallback)) {
                        target.src = fallback
                      }
                    }}
                  />
                  <span className="dsh-medallion-tag">{d.chef}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dsh-head" aria-live="polite">
            {dishes.map((d, i) => (
              <div
                key={i}
                ref={(el) => {
                  heads.current[i] = el
                }}
                className="dsh-hd"
                aria-hidden={i !== index}
                style={{
                  visibility: i === index ? "visible" : "hidden",
                  opacity: i === index ? 1 : 0,
                }}
              >
                <p className="dsh-eye">
                  {d.eyebrow ?? "#" + (i + 1) + " Priority UAE Launch"}
                </p>
                <h1 style={{ margin: 0, font: "inherit" }}>
                  <span
                    className="dsh-t1"
                    style={{ fontSize: fitSize(d.title.length, 42, 355, 0.58) + "px" }}
                  >
                    {d.title}
                  </span>
                  <span
                    className="dsh-t2"
                    style={{ fontSize: fitSize(d.subtitle.length, 34, 330, 0.65) + "px" }}
                  >
                    {d.subtitle}
                  </span>
                </h1>
                <div className="dsh-kpis">
                  <span className="dsh-kpi">18+ Yrs UAE</span>
                  <span className="dsh-kpi">27+ Developers</span>
                  <span className="dsh-kpi">108+ Projects</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dsh-acts">
            <button
              type="button"
              className="dsh-btn dsh-act-primary"
              onClick={() => dish && handlePrimaryAction(dish, index)}
            >
              <span>{dish?.primaryLabel ?? "Explore Project"}</span>
              {Icon.play}
            </button>
            <button
              type="button"
              className="dsh-btn dsh-act-secondary"
              onClick={() => dish && handleSecondaryAction(dish, index)}
            >
              {Icon.order}
              <span>{dish?.secondaryLabel ?? "Price List"}</span>
            </button>
          </div>

          <div className="dsh-card" onPointerMove={onCardPointerMove}>
            <div className="dsh-tabs" role="tablist" aria-label="Project details">
              {["overview", "ingredients"].map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  className="dsh-btn dsh-tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                >
                  {t === "overview" ? "Overview" : "Highlights"}
                </button>
              ))}
            </div>
            <div className="dsh-bodies">
              {dishes.map((d, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    bodies.current[i] = el
                  }}
                  className="dsh-body"
                  aria-hidden={i !== index}
                  style={{
                    visibility: i === index ? "visible" : "hidden",
                    opacity: i === index ? 1 : 0,
                  }}
                >
                  <div className="dsh-rate">
                    <div className="dsh-badge" style={{ background: d.accent }}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
                      </svg>
                    </div>
                    <div>
                      <span
                        className="dsh-num"
                        aria-label={"Rated " + d.rating.toFixed(1) + " out of 5"}
                      >
                        {d.rating.toFixed(1)}
                      </span>
                      <div className="dsh-rate-lbl">DLD Escrow Verified</div>
                    </div>
                  </div>
                  <p className="dsh-chef">{d.chef}</p>
                  <p className="dsh-kit">{d.kitchen ?? "\u00a0"}</p>
                  {tab === "overview" || !d.ingredients?.length ? (
                    <p className="dsh-desc">{d.description}</p>
                  ) : (
                    <ul className="dsh-ing">
                      {d.ingredients.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  )}
                  <div className="dsh-react">
                    <button
                      type="button"
                      className="dsh-btn dsh-like"
                      aria-pressed={!!liked[i]}
                      tabIndex={i === index ? 0 : -1}
                      onClick={() =>
                        setLiked((s) => ({ ...s, [i]: !s[i] }))
                      }
                    >
                      {Icon.up}
                      {d.likes + (liked[i] ? 1 : 0)} Shortlisted
                    </button>
                    <button
                      type="button"
                      className="dsh-btn dsh-meh"
                      tabIndex={i === index ? 0 : -1}
                      onClick={() => handlePrimaryAction(d, i)}
                    >
                      Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dsh-strip" onPointerMove={onStripPointerMove}>
            <button
              type="button"
              className="dsh-btn dsh-arrow"
              aria-label="Previous project"
              onClick={() => step(-1)}
            >
              <svg viewBox="0 0 12 16" aria-hidden="true">
                <path d="M11 0v16L0 8z" />
              </svg>
            </button>
            <div className="dsh-win">
              <div
                className="dsh-track"
                style={{ transform: "translateX(" + -start * ITEM + "px)" }}
              >
                {dishes.map((d, i) => (
                  <div key={i} className="dsh-th">
                    <button
                      type="button"
                      className="dsh-btn"
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => go(i)}
                    >
                      <img
                        src={d.image}
                        alt={d.label ?? d.title}
                        width={54}
                        height={54}
                        loading="eager"
                        decoding="sync"
                        draggable={false}
                        onError={(e) => {
                          const target = e.currentTarget
                          const fallback = "/img/hero/slides/01-dubai-horizon-thumb.webp"
                          if (!target.src.endsWith(fallback)) {
                            target.src = fallback
                          }
                        }}
                      />
                      <span>{d.label ?? d.title}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="dsh-btn dsh-arrow"
              aria-label="Next project"
              onClick={() => step(1)}
            >
              <svg viewBox="0 0 12 16" aria-hidden="true">
                <path d="M1 0v16l11-8z" />
              </svg>
            </button>
          </div>
        </div>
        <p className="dsh-sr" aria-live="polite">
          {dish
            ? "Project " + (index + 1) + " of " + n + ": " + dish.title + " " + dish.subtitle
            : ""}
        </p>
      </div>
    </div>
  )
}

export default DishOrbitCarousel
