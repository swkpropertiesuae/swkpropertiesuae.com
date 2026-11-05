"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { HomeSearchBar } from "@/components/site/home-search-bar"
import { SITE } from "@/lib/swk"

// ─────────────────────────────────────────────────────────────
// CINEMATIC ARCHITECTURAL FILMSTRIP HERO
// Inspired by 21st.dev crafterui/hero-carousel (id: 24752)
// Key Engineering Upgrades:
// 1. ZERO GLITCH ON SLIDE TRANSITIONS: All 6 high-res background
//    canvases remain permanently mounted in the DOM and crossfade
//    via GPU-accelerated opacity + continuous Ken Burns scale.
//    No image is ever unmounted or re-decoded mid-transition.
// 2. NATURAL VIVID ARCHITECTURAL PALETTE (NO HEAVY BLUE WASH):
//    Photography shines in its true golden-hour, bronze, and
//    crystal-lagoon hues with warm obsidian glass accents and
//    metallic rose-gold (#E0C1A3) highlights.
// 3. UNFURLING EDITORIAL FILMSTRIP: Cards share a synchronized
//    top edge; the active card unfurls to full portrait height
//    while neighboring cards stay sleekly cropped.
// ─────────────────────────────────────────────────────────────

interface HeroArchitecturalSlide {
  id: string
  index: string
  shortTitle: string
  location: string
  eyebrow: string
  lines: [string, string, string]
  accentLineIndex: number
  summary: string
  developer: string
  developerLogo: string
  desktopImage: string
  mobileImage: string
  thumbImage: string
  paymentPlan: string
  statusTag: string
  href: string
  ctaLabel: string
  whatsappText: string
  facts: [string, string][]
}

const HERO_SLIDES: HeroArchitecturalSlide[] = [
  {
    id: "dubai-golden-skyline",
    index: "01",
    shortTitle: "Dubai Horizon",
    location: "Sheikh Zayed Road · Downtown Dubai",
    eyebrow: "27th Floor Advisory · Al Saqr Business Tower",
    lines: [
      "Private Real Estate",
      "Across Dubai’s Iconic",
      "Golden Horizon.",
    ],
    accentLineIndex: 2,
    summary:
      "18+ years of UAE market experience across 27+ partner developers and 108+ verified projects—guiding private buyers, family offices, and landlords with written DLD cost sheets.",
    developer: "Emaar · Sobha · DAMAC · Azizi · Imtiaz",
    developerLogo: "/img/developers/emaar.svg",
    desktopImage: "/img/hero/slides/01-dubai-horizon-desktop.webp",
    mobileImage: "/img/hero/slides/01-dubai-horizon-mobile.webp",
    thumbImage: "/img/hero/slides/01-dubai-horizon-thumb.webp",
    paymentPlan: "10%–20% Down",
    statusTag: "Ready & Off-Plan",
    href: "/off-plan",
    ctaLabel: "Explore 108+ Projects",
    whatsappText:
      "Hello SWK Properties, I would like a curated shortlist of top Dubai & UAE properties.",
    facts: [
      ["Experience", "18+ Years in UAE"],
      ["Developers", "27+ Master Partners"],
      ["Portfolio", "108+ Verified Releases"],
    ],
  },
  {
    id: "imtiaz-kore",
    index: "02",
    shortTitle: "Imtiaz Kore",
    location: "Dubai Islands & Meydan Horizon",
    eyebrow: "Priority VIP Launch · 0% Buyer Commission",
    lines: [
      "Turnkey Furnished",
      "Waterfront Living at",
      "Imtiaz Kore.",
    ],
    accentLineIndex: 2,
    summary:
      "Fully furnished designer residences with bespoke joinery, smart home automation, and sky infinity decks—allocated directly at developer launch prices.",
    developer: "Imtiaz Developments",
    developerLogo: "/img/developers/imtiaz.svg",
    desktopImage: "/img/hero/slides/02-imtiaz-kore-desktop.webp",
    mobileImage: "/img/hero/slides/02-imtiaz-kore-mobile.webp",
    thumbImage: "/img/hero/slides/02-imtiaz-kore-thumb.webp",
    paymentPlan: "60/40 Plan",
    statusTag: "VIP First Release",
    href: "/off-plan/imtiaz-kore",
    ctaLabel: "Inspect Imtiaz Kore",
    whatsappText:
      "Hello SWK Properties, I would like the floor plans, starting prices, and priority allocation for Imtiaz Kore.",
    facts: [
      ["Payment Plan", "60% Build / 40% Handover"],
      ["Interiors", "Fully Furnished + Smart Home"],
      ["Commission", "0% Direct Developer Price"],
    ],
  },
  {
    id: "azizi-florence",
    index: "03",
    shortTitle: "Azizi Florence",
    location: "Al Furjan & Waterfront Corridor",
    eyebrow: "New Crystal Lagoon Release · High Rental Yield",
    lines: [
      "Italian-Inspired",
      "Lagoon Residences at",
      "Azizi Florence.",
    ],
    accentLineIndex: 2,
    summary:
      "Swimmable crystal lagoon promenades, retail boulevards, and a balanced 50/50 developer milestone schedule engineered for capital appreciation.",
    developer: "Azizi Developments",
    developerLogo: "/img/developers/azizi.png",
    desktopImage: "/img/hero/slides/03-azizi-florence-desktop.webp",
    mobileImage: "/img/hero/slides/03-azizi-florence-mobile.webp",
    thumbImage: "/img/hero/slides/03-azizi-florence-thumb.webp",
    paymentPlan: "50/50 Plan",
    statusTag: "Lagoon Launch",
    href: "/off-plan/azizi-florence",
    ctaLabel: "Inspect Azizi Florence",
    whatsappText:
      "Hello SWK Properties, I would like the brochure, payment plan, and available units for Azizi Florence.",
    facts: [
      ["Payment Plan", "50% Build / 50% Handover"],
      ["Residences", "Studios, 1, 2 & 3-BR Suites"],
      ["Protection", "DLD & RERA Escrow"],
    ],
  },
  {
    id: "azizi-venice",
    index: "04",
    shortTitle: "Azizi Venice",
    location: "Dubai South · Airport Growth Hub",
    eyebrow: "18-km Swimmable Crystal Lagoon Masterplan",
    lines: [
      "Waterfront Mansions",
      "& Opera Boulevard at",
      "Azizi Venice.",
    ],
    accentLineIndex: 2,
    summary:
      "Directly beside the Al Maktoum International Airport expansion and Expo City Dubai—featuring lagoon-front villas, climate-controlled boulevards, and private beaches.",
    developer: "Azizi Developments",
    developerLogo: "/img/developers/azizi.png",
    desktopImage: "/img/hero/slides/04-azizi-venice-desktop.webp",
    mobileImage: "/img/hero/slides/04-azizi-venice-mobile.webp",
    thumbImage: "/img/hero/slides/04-azizi-venice-thumb.webp",
    paymentPlan: "50/50 Plan",
    statusTag: "Flagship Lagoon",
    href: "/off-plan/azizi-venice",
    ctaLabel: "Inspect Azizi Venice",
    whatsappText:
      "Hello SWK Properties, I would like the masterplan map and unit availability for Azizi Venice in Dubai South.",
    facts: [
      ["Lagoon Scale", "18 km Swimmable Lagoon"],
      ["Payment Plan", "50% Build / 50% Handover"],
      ["Catalyst", "Al Maktoum Airport Hub"],
    ],
  },
  {
    id: "sobha-century",
    index: "05",
    shortTitle: "Sobha & Emaar",
    location: "Sobha Hartland & Dubailand Sanctuary",
    eyebrow: "Waterfront Sky Towers & Canal Estates",
    lines: [
      "Lagoon Sky Towers",
      "& Private Estates by",
      "Sobha & Emaar.",
    ],
    accentLineIndex: 2,
    summary:
      "From panoramic golf and lagoon towers at Sobha Century & Sobha One to low-density canal mansions at Emaar The Oasis—compare verified developer allocations.",
    developer: "Sobha Realty & Emaar",
    developerLogo: "/img/developers/sobha.png",
    desktopImage: "/img/hero/slides/05-emaar-the-oasis-desktop.webp",
    mobileImage: "/img/hero/slides/05-emaar-the-oasis-mobile.webp",
    thumbImage: "/img/hero/slides/05-emaar-the-oasis-thumb.webp",
    paymentPlan: "60/40 & 80/20",
    statusTag: "Prime Masterplans",
    href: "/off-plan/sobha-century",
    ctaLabel: "Inspect Sobha & Emaar",
    whatsappText:
      "Hello SWK Properties, I would like floor plans and availability for Sobha Century and Emaar The Oasis.",
    facts: [
      ["Typologies", "1–4 BR Sky Suites & Villas"],
      ["Water & Golf", "Lagoon & 18-Hole Pitch Views"],
      ["Developers", "Sobha Realty & Emaar"],
    ],
  },
  {
    id: "damac-islands",
    index: "06",
    shortTitle: "DAMAC Islands",
    location: "Dubailand & Sheikh Zayed Road",
    eyebrow: "Tropical Island Townhouses & Sky Towers",
    lines: [
      "Private Lagoon Beaches",
      "& Waterfront Estates at",
      "DAMAC Islands.",
    ],
    accentLineIndex: 2,
    summary:
      "Compare island townhouses with private lagoon beaches at DAMAC Islands alongside vertical sky residences at Sobha Century and Binghatti Maybach.",
    developer: "DAMAC Properties",
    developerLogo: "/img/developers/damac.png",
    desktopImage: "/img/hero/slides/06-damac-islands-desktop.webp",
    mobileImage: "/img/hero/slides/06-damac-islands-mobile.webp",
    thumbImage: "/img/hero/slides/06-damac-islands-thumb.webp",
    paymentPlan: "75/25 Plan",
    statusTag: "Island Masterplan",
    href: "/off-plan/damac-islands",
    ctaLabel: "Inspect DAMAC Islands",
    whatsappText:
      "Hello SWK Properties, I would like to compare DAMAC Islands and Sobha Century allocations.",
    facts: [
      ["Payment Plan", "75% Build / 25% Handover"],
      ["Residences", "Waterfront Villas & Townhouses"],
      ["Advisory", "Direct Developer Allocation"],
    ],
  },
]

const AUTOPLAY_MS = 6200

export default function WorldClassDubaiHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  // Non-blocking native scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const bgParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"])

  // Subtle pointer parallax
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 26 })
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 26 })
  const stageShiftX = useTransform(smoothX, [-0.5, 0.5], ["-0.9%", "0.9%"])
  const stageShiftY = useTransform(smoothY, [-0.5, 0.5], ["-0.9%", "0.9%"])

  const goTo = useCallback((idx: number) => {
    setActiveIdx((idx + HERO_SLIDES.length) % HERO_SLIDES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_SLIDES.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [paused])

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handlePointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  const active = HERO_SLIDES[activeIdx] ?? HERO_SLIDES[0]

  return (
    <section
      ref={sectionRef}
      id="top"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex min-h-screen lg:h-screen lg:max-h-[960px] w-full flex-col justify-between overflow-hidden border-b border-[#e6dfd2] bg-[#0f2244] pt-[112px] sm:pt-[122px] lg:pt-[126px] pb-4 sm:pb-6 lg:pb-5 text-white select-none"
    >
      {/* ─────────────────────────────────────────────────────────
          1. PRE-MOUNTED ZERO-GLITCH BRIGHT DAYLIGHT ULTRA-HD STACK
          All 6 slides stay mounted in the DOM permanently with
          dedicated 2560x1440 Desktop and 1280x1920 Mobile Portrait
          sources for tack-sharp quality on every screen.
      ───────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          y: bgParallaxY,
          x: stageShiftX,
          top: stageShiftY,
        }}
        className="pointer-events-none absolute -inset-x-4 -top-16 -bottom-24 z-0 overflow-hidden"
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isCurrent = idx === activeIdx
          return (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{
                opacity: isCurrent ? 1 : 0,
                scale: isCurrent ? 1.01 : 1.06,
              }}
              transition={{
                opacity: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 6.5, ease: "easeOut" },
              }}
              style={{
                willChange: "opacity, transform",
                zIndex: isCurrent ? 2 : 1,
              }}
              className="absolute inset-0"
            >
              <picture className="block h-full w-full">
                <source
                  media="(max-width: 767px)"
                  srcSet={slide.mobileImage}
                  type="image/webp"
                />
                <img
                  src={slide.desktopImage}
                  alt={`${slide.shortTitle} — ${slide.developer}`}
                  loading="eager"
                  fetchPriority={idx === 0 ? "high" : "auto"}
                  decoding="sync"
                  draggable={false}
                  className="h-full w-full object-cover object-center"
                />
              </picture>
            </motion.div>
          )
        })}

        {/* Light, Airy Daylight Scrim (Preserves bright sunlit lagoons & architecture while keeping white text legible) */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,34,68,0.56) 0%, rgba(15,34,68,0.26) 48%, rgba(15,34,68,0.06) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,34,68,0.44) 0%, rgba(15,34,68,0.04) 36%, rgba(15,34,68,0.12) 68%, rgba(15,34,68,0.54) 100%)",
          }}
        />
      </motion.div>

      {/* ─────────────────────────────────────────────────────────
          2. FOREGROUND STAGE CONTENT — Fitted to 100vh Screen & Balanced Left/Right
      ───────────────────────────────────────────────────────── */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-4 md:px-6">
        {/* Main 12-Column Balanced Stage (items-stretch so Left & Right columns share exact top & bottom edges) */}
        <div className="grid flex-1 grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:gap-8">
          {/* Left Column (7 cols): Vertically Balanced Top-to-Bottom */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3 py-1">
            {/* Top Group: Location Pills + Masked Headline + Summary */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#0f2244]/88 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md shadow-sm">
                  <MapPin className="h-3 w-3 text-white" />
                  {active.location}
                </span>
                <span className="rounded-full border border-white/25 bg-[#0f2244]/75 px-3.5 py-1 text-[10px] font-semibold text-white/95 backdrop-blur-md">
                  {active.eyebrow}
                </span>
              </div>

              {/* Masked Split-Line Editorial Headline */}
              <div className="min-h-[104px] sm:min-h-[126px] md:min-h-[144px] flex flex-col justify-center">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.h1
                    key={`h1-${active.id}`}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="font-serif text-3xl sm:text-4xl md:text-5xl xl:text-[3.35rem] font-normal tracking-[-0.02em] text-white leading-[1.05] drop-shadow-[0_2px_12px_rgba(15,34,68,0.45)]"
                  >
                    {active.lines.map((line, lineIdx) => (
                      <span key={lineIdx} className="block overflow-hidden pb-0.5">
                        <motion.span
                          className={
                            lineIdx === active.accentLineIndex
                              ? "block font-serif italic font-semibold text-white underline decoration-white/40 decoration-1 underline-offset-4"
                              : "block"
                          }
                          initial={{ y: "108%", opacity: 0 }}
                          animate={{ y: "0%", opacity: 1 }}
                          transition={{
                            duration: 0.68,
                            delay: lineIdx * 0.075,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {line}
                        </motion.span>
                      </span>
                    ))}
                  </motion.h1>
                </AnimatePresence>
              </div>

              {/* Narrative Paragraph */}
              <div className="min-h-[42px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={`desc-${active.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-2xl line-clamp-2 text-xs sm:text-sm md:text-[15px] text-white/95 leading-relaxed drop-shadow-[0_1px_6px_rgba(15,34,68,0.5)]"
                  >
                    {active.summary}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Group: 3-Column Navy Fact Strip + Primary & WhatsApp CTAs */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-3 gap-2">
                {active.facts.map(([label, val], idx) => (
                  <div
                    key={`${active.id}-${label}-${idx}`}
                    className="rounded-xl border border-white/25 bg-[#0f2244]/85 px-3 py-2 backdrop-blur-xl shadow-sm"
                  >
                    <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">
                      {label}
                    </div>
                    <div className="mt-0.5 truncate font-serif text-xs sm:text-sm md:text-base font-semibold text-white">
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Primary & WhatsApp CTAs — Brand Navy Blue & Crisp White */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={active.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#0f2244] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg transition hover:bg-[#14305c]"
                >
                  <span>{active.ctaLabel}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <a
                  href={`${SITE.whatsappUrl}?text=${encodeURIComponent(active.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/95 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0f2244] shadow-md transition hover:bg-white"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>WhatsApp Brochure &amp; Price List</span>
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#0f2244]/75 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md hover:bg-[#0f2244] transition"
                >
                  <span>Private Consultation</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Stretches Top-to-Bottom to Match Left Column */}
          <div
            className="lg:col-span-5 flex flex-col justify-between gap-2.5 py-1"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            {/* Active Developer & Progress Header — Brand Navy Blue */}
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/25 bg-[#0f2244]/88 px-3.5 py-2.5 backdrop-blur-xl shadow-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 shrink-0 items-center rounded-xl bg-white px-2.5 py-1 shadow-xs">
                  <img
                    src={active.developerLogo}
                    alt={active.developer}
                    className="max-h-5 max-w-[88px] object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/80">
                    {active.statusTag} · {active.paymentPlan}
                  </p>
                  <p className="truncate font-serif text-sm sm:text-base font-semibold text-white">
                    {active.developer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? "Play filmstrip" : "Pause filmstrip"}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#0f2244] transition"
                >
                  {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIdx - 1)}
                  aria-label="Previous slide"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#0f2244] transition"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIdx + 1)}
                  aria-label="Next slide"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#0f2244] transition"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Unfurling Architectural Filmstrip — Compacted to Fit 100vh & Styled in Brand Navy Blue */}
            <div className="flex flex-1 flex-col justify-between rounded-2xl border border-white/25 bg-[#0f2244]/84 p-3.5 backdrop-blur-xl shadow-lg">
              <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">
                <span>Interactive Architectural Filmstrip</span>
                <span className="font-mono text-white">
                  {active.index} / 0{HERO_SLIDES.length}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 items-start gap-2 min-h-[192px]">
                {HERO_SLIDES.map((slide, i) => {
                  const isFocused = i === activeIdx
                  return (
                    <motion.button
                      key={slide.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Focus ${slide.shortTitle}`}
                      aria-current={isFocused}
                      initial={false}
                      animate={{
                        height: isFocused ? 188 : 124,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 30,
                        mass: 0.9,
                      }}
                      className={`group relative w-full overflow-hidden rounded-xl border text-left transition-colors ${
                        isFocused
                          ? "border-white ring-2 ring-white/50 shadow-[0_12px_28px_rgba(15,34,68,0.55)]"
                          : "border-white/25 hover:border-white/60"
                      }`}
                    >
                      <img
                        src={slide.thumbImage}
                        alt={slide.shortTitle}
                        loading="eager"
                        draggable={false}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          isFocused
                            ? "bg-gradient-to-t from-[#0f2244]/92 via-[#0f2244]/15 to-transparent"
                            : "bg-[#0f2244]/35 group-hover:bg-[#0f2244]/15"
                        }`}
                      />

                      <span
                        className={`absolute top-1.5 left-1.5 rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                          isFocused
                            ? "bg-[#0f2244] text-white border border-white/40"
                            : "bg-[#0f2244]/75 text-white/90"
                        }`}
                      >
                        {slide.index}
                      </span>

                      <div className="absolute bottom-1.5 left-1.5 right-1">
                        <p className="truncate font-serif text-[11px] font-semibold text-white">
                          {slide.shortTitle}
                        </p>
                        {isFocused && (
                          <p className="mt-0.5 truncate text-[8px] font-bold uppercase tracking-wider text-white/85">
                            {slide.paymentPlan}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Synchronized Position Rail */}
              <div className="mt-2.5">
                <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="absolute inset-y-0 rounded-full bg-white"
                    style={{ width: `${100 / HERO_SLIDES.length}%` }}
                    animate={{ left: `${(activeIdx / HERO_SLIDES.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 260, damping: 32 }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-white/85">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3 text-white" />
                    DLD Escrow &amp; Trakheesi Verified
                  </span>
                  <Link
                    href={active.href}
                    className="font-bold uppercase tracking-[0.14em] text-white hover:underline"
                  >
                    Open {active.shortTitle} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Integrated Single-Line Property Search Bar — Fits Cleanly at Bottom of 100vh Screen */}
        <div className="relative z-30 mt-3 lg:mt-4">
          <HomeSearchBar />
        </div>
      </div>
    </section>
  )
}
