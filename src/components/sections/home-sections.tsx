"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import GalleryHoverCarousel from "@/components/ui/gallery-hover-carousel"
import TiltCascadeCarousel from "@/components/ui/tilt-cascade-carousel"
import ViewfinderFlipCarousel from "@/components/ui/viewfinder-flip-carousel"
import InteractiveSelector from "@/components/ui/interactive-selector"
import { AirplaneWindowGallery } from "@/components/ui/airplane-window-gallery"
import { TestimonialInfiniteMarquee } from "@/components/ui/infinite-moving-cards"
import { HomeSearchBar } from "@/components/site/home-search-bar"
import { SectionHeading } from "@/components/site/site-footer"
import type { MetroLine, MetroStation } from "@/components/ui/metro-map-gallery"
import {
  SITE,
  communities,
  gallery,
  horizontalTestimonials,
  services,
  team,
  testimonials,
} from "@/lib/swk"

// Heavy WebGL / canvas components load only in the browser.
const Loading = ({ h }: { h: string }) => (
  <div style={{ height: h }} className="animate-pulse rounded-3xl bg-[#f4efe6]" />
)

const ServiceSlider = dynamic(
  () => import("@/components/ui/project-showcase-b").then((m) => m.ProjectShowcase),
  { ssr: false, loading: () => <Loading h="520px" /> },
)

const MetroMapGallery = dynamic(
  () => import("@/components/ui/metro-map-gallery").then((m) => m.MetroMapGallery),
  { ssr: false, loading: () => <Loading h="680px" /> },
)

const TestimonialGlobe = dynamic(
  () => import("@/components/ui/testimonial-globe").then((m) => m.TestimonialGlobe),
  { ssr: false, loading: () => <Loading h="680px" /> },
)

const HERO_CHAPTERS = [
  {
    id: "downtown",
    name: "Downtown & Sheikh Zayed Road",
    tag: "Burj Khalifa · DIFC · Al Saqr Tower HQ",
    stat: "AED 2.1M – 65M+",
    image: "/img/hero/dubai-skyline-hero.webp",
    projectThumb: "/img/projects/binghatti/mercedes-benz-places.webp",
    projectTitle: "Mercedes-Benz Places · Downtown",
    href: "/communities/downtown-dubai",
  },
  {
    id: "palm",
    name: "Palm Jumeirah Waterfront",
    tag: "Private Beach Villas · Sky Penthouses",
    stat: "AED 4.8M – 120M+",
    image: "/img/communities/palm-jumeirah.webp",
    projectThumb: "/img/projects/nakheel/como-residences.webp",
    projectTitle: "Como Residences · Palm Jumeirah",
    href: "/communities/palm-jumeirah",
  },
  {
    id: "marina",
    name: "Dubai Marina & Harbour",
    tag: "Yacht Club Towers · Sea-Facing Suites",
    stat: "6.4% – 8.1% Gross Yield",
    image: "/img/communities/dubai-marina.webp",
    projectThumb: "/img/projects/sobha/sobha-seahaven.webp",
    projectTitle: "Sobha SeaHaven · Dubai Harbour",
    href: "/communities/dubai-marina",
  },
  {
    id: "creek",
    name: "Dubai Creek Harbour",
    tag: "Lagoon Promenade · Emaar Masterplan",
    stat: "80/20 & 70/30 Plans",
    image: "/img/communities/dubai-creek-harbour.webp",
    projectThumb: "/img/projects/emaar/avarra-by-palace.webp",
    projectTitle: "Avarra by Palace · Emaar",
    href: "/communities/dubai-creek-harbour",
  },
]

/* ------------------------------------------------------------------ Fit-to-Screen Video + Picture Scroll-Parallax Hero */
export function Hero() {
  const containerRef = React.useRef<HTMLElement>(null)
  const [activeChapter, setActiveChapter] = React.useState(0)
  const [videoMode, setVideoMode] = React.useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Scroll-linked parallax transformations
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.16])
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const cardY = useTransform(scrollYProgress, [0, 1], ["0px", "-48px"])
  const searchY = useTransform(scrollYProgress, [0, 1], ["0px", "-24px"])

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % HERO_CHAPTERS.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [])

  const current = HERO_CHAPTERS[activeChapter]

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative flex min-h-[calc(100svh-84px)] w-full flex-col justify-between overflow-hidden bg-[#0f2244]"
    >
      {/* Full-Bleed Colorful Video + High-Res Dubai Skyline Backdrop with Scroll-Linked Parallax */}
      <motion.div
        style={{ scale: bgScale, y: bgY }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        {/* High-Resolution Colorful Dubai Landmark Photo Layer */}
        <img
          src={current.image}
          alt={current.name}
          className="h-full w-full object-cover object-center transition-all duration-1000 saturate-[1.18] contrast-[1.06]"
        />

        {/* Ambient Aerial Video Layer (Blended for Rich Motion & Color) */}
        {videoMode && (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/img/hero/dubai-skyline-hero.webp"
            className="absolute inset-0 h-full w-full object-cover mix-blend-SoftLight opacity-55"
          >
            <source
              src="https://cdn.21st.dev/assets/mirror/23/234bc821170e75a6b8d2e42a952078f858eb054a51fab2a5baa928a10fdc245d.mp4"
              type="video/mp4"
            />
          </video>
        )}

        {/* Luminous Editorial Gradients (Keeps Skyline Colorful & Crisp While Guaranteeing Readability) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2244]/88 via-[#0f2244]/48 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/90 via-transparent to-[#0f2244]/35" />
      </motion.div>

      {/* Main Above-the-Fold Hero Content Grid */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-8 pb-6 md:px-6 lg:pt-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          {/* Left Column: Editorial Headline, Live District Switcher & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#dcb888]/45 bg-[#0f2244]/75 backdrop-blur-md px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#dcb888] shadow-lg">
              <ShieldCheck className="h-3.5 w-3.5 text-[#dcb888]" />
              <span>SWK Properties LLC · RERA ORN {SITE.reraOrn} · Sheikh Zayed Road</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.05] drop-shadow-sm">
              Dubai&apos;s Finest{" "}
              <span className="text-[#dcb888] italic font-normal">
                Waterfront &amp; Skyline
              </span>{" "}
              Residences.
            </h1>

            <p className="max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              Independent RERA-licensed advisory across <strong className="text-white">20 UAE master developers</strong> and{" "}
              <strong className="text-white">108 DLD escrow-verified launches</strong>. Compare ready villas, penthouses, annual Ejari leases, and off-plan payment plans with complete upfront fee clarity.
            </p>

            {/* Interactive Dubai Corridor Switcher Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {HERO_CHAPTERS.map((chap, idx) => {
                const active = idx === activeChapter
                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => setActiveChapter(idx)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "border-[#dcb888] bg-[#dcb888] text-[#0f2244] shadow-md"
                        : "border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-[#dcb888]/60 hover:bg-white/20"
                    }`}
                  >
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="whitespace-nowrap">{chap.name}</span>
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => setVideoMode((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-[11px] font-semibold text-[#dcb888] backdrop-blur-md hover:bg-black/50"
                title="Toggle ambient aerial motion"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{videoMode ? "Live Aerial Motion: On" : "Photo Still Mode"}</span>
              </button>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/properties"
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-[#dcb888] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0f2244] shadow-lg transition hover:bg-white"
              >
                <span>Explore Verified Inventory</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/off-plan"
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full border border-white/35 bg-white/15 backdrop-blur-md px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#dcb888] hover:bg-white/25"
              >
                <span>108 Off-Plan Launches</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full border border-[#dcb888]/50 bg-[#0f2244]/80 backdrop-blur-md px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#dcb888] transition hover:bg-[#0f2244]"
              >
                <span>Book Consultation</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Scroll-Animated Floating Spotlight Card */}
          <motion.div
            style={{ y: cardY }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="overflow-hidden rounded-3xl border border-white/25 bg-white/95 backdrop-blur-xl p-4 text-[#0f2244] shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
              <div className="relative h-52 w-full overflow-hidden rounded-2xl">
                <img
                  src={current.projectThumb}
                  alt={current.projectTitle}
                  className="h-full w-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/85 via-transparent to-black/20" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0f2244]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcb888]">
                    <Sparkles className="h-3 w-3" />
                    Live Corridor Spotlight
                  </span>
                  <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0f2244]">
                    {current.stat}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dcb888]">
                      {current.tag}
                    </div>
                    <div className="font-serif text-xl font-semibold">
                      {current.projectTitle}
                    </div>
                  </div>
                  <Link
                    href={current.href}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcb888] text-[#0f2244] transition hover:bg-white"
                    aria-label={`Explore ${current.name}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] px-2.5 py-2">
                  <div className="font-serif text-lg font-bold text-[#0f2244]">20</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94652c]">
                    Developers
                  </div>
                </div>
                <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] px-2.5 py-2">
                  <div className="font-serif text-lg font-bold text-[#0f2244]">108</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94652c]">
                    DLD Projects
                  </div>
                </div>
                <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] px-2.5 py-2">
                  <div className="font-serif text-lg font-bold text-[#0f2244]">0%</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94652c]">
                    Off-Plan Fee
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Embedded Single-Line Property Search Bar with Mandate Dropdown (Fits inside the Hero Screen) */}
      <motion.div
        style={{ y: searchY }}
        className="relative z-20 mx-auto w-full max-w-7xl px-4 pb-6 md:px-6"
      >
        <HomeSearchBar />
      </motion.div>
    </section>
  )
}

/* ----------------------------------------------------------------- Stats */
export function TrustBar() {
  const items = [
    [`${2026 - SITE.founded}+`, "Years Advising Buyers"],
    ["20", "Master UAE Developers"],
    ["108", "Verified Off-Plan Launches"],
    [SITE.reraOrn, "DLD RERA ORN Registered"],
  ]
  return (
    <section className="border-y border-[#e6dfd2] bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 md:grid-cols-4 md:px-6">
        {items.map(([n, l]) => (
          <div key={l} className="text-center">
            <div className="font-serif text-4xl font-semibold text-[#0f2244] md:text-5xl">
              {n}
            </div>
            <div className="mt-2 text-xs font-bold tracking-[0.22em] text-[#94652c] uppercase">
              {l}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- Communities */
export function Communities() {
  return (
    <section id="communities" className="scroll-mt-20">
      <GalleryHoverCarousel
        heading="Dubai's Most Sought-After Freehold Addresses"
        description="From Downtown Dubai and Palm Jumeirah to Dubai Hills Estate and Creek Harbour, explore the neighbourhoods SWK advises on every day."
        items={communities.map((c) => ({
          id: c.id,
          title: c.name,
          summary: c.blurb,
          url: `/communities/${c.slug}`,
          image: c.thumb,
        }))}
      />
    </section>
  )
}

/* ---------------------------------------------------------------- Aerial */
export function Aerial() {
  const views = communities.slice(0, 5)
  return (
    <section id="aerial" className="scroll-mt-20 border-b border-[#e6dfd2] bg-[#f4efe6] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Dubai From Above · Interactive Cabin View"
          title={
            <>
              Take the Window Seat.{" "}
              <em className="text-[#94652c] not-italic">Inspect the Skyline.</em>
            </>
          }
          lead="Click any cabin window to open a full-frame aerial view over Dubai's flagship master-planned districts."
        />
        <div className="mt-10">
          <AirplaneWindowGallery
            windows={3}
            autoplay
            interval={4200}
            items={views.map((c) => ({
              src: c.image,
              alt: c.name,
              title: c.name,
              location: "Dubai, UAE",
              caption: c.blurb,
            }))}
          />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Residences */
const PREVIEWS = [
  { i: 0, t: "Waterfront Penthouses & Sea-Facing Towers" },
  { i: 6, t: "Private Golf & Lagoon Signature Villas" },
  { i: 4, t: "Crystal Lagoon & Resort Residences" },
  { i: 8, t: "Downtown & Burj District Sky Collections" },
  { i: 9, t: "Master-Planned Family Townhouse Enclaves" },
  { i: 5, t: "Wellness & Biophilic Sanctuary Homes" },
]
export function Residences() {
  return (
    <section id="residences" className="scroll-mt-20 bg-[#faf7f2] py-20 border-b border-[#e6dfd2]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Architectural Visualisations"
          title={
            <>
              Residences Built to Be{" "}
              <em className="text-[#94652c] not-italic">Remembered.</em>
            </>
          }
          lead="Verified architectural visualisations from the UAE launches our consultants monitor. Drag, swipe, or use the arrows to inspect."
        />
      </div>
      <div className="mt-8">
        <TiltCascadeCarousel
          height="580px"
          background="transparent"
          autoplay={4500}
          items={PREVIEWS.map((p) => ({
            title: p.t,
            caption: "SWK Curated Launch Visualisation",
            src: gallery[p.i],
            alt: p.t,
          }))}
        />
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- Services */
export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-white py-24 border-b border-[#e6dfd2]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="05 · End-to-End RERA Advisory"
          title={
            <>
              One Partner,{" "}
              <em className="text-[#94652c] not-italic">From Shortlist to Keys.</em>
            </>
          }
          lead="Six integrated real estate services covering off-plan acquisitions, ready sales, Ejari leasing, mortgage structuring, conveyancing, and turnkey management."
        />
        <div className="mt-12 rounded-3xl border border-[#e6dfd2] bg-[#faf7f2] p-6 md:p-10 shadow-sm">
          <ServiceSlider
            testimonials={services.map((s, i) => ({
              quote: s.description,
              name: s.title,
              designation: `0${i + 1} · SWK Advisory Division`,
              src: gallery[[0, 3, 7, 9, 2, 12][i % 6]],
              link: `/services`,
            }))}
            colors={{ name: "#0f2244", position: "#94652c", testimony: "#39455a" }}
            fontSizes={{ name: "2rem", position: "0.82rem", testimony: "1.05rem" }}
            outlineColor="#e6dfd2"
            hoverOutlineColor="#94652c"
            outerRounding="24px"
            innerRounding="23px"
            buttonInscriptions={{
              previousButton: "Previous Service",
              nextButton: "Next Service",
              openWebAppButton: "Explore Service",
            }}
            halomotButtonGradient="linear-gradient(to right, #94652c, #c99a63)"
            halomotButtonBackground="#0f2244"
            halomotButtonTextColor="#ffffff"
            halomotButtonHoverTextColor="#ffffff"
            halomotButtonOuterBorderRadius="999px"
            halomotButtonInnerBorderRadius="999px"
            onItemClick={(l) => {
              if (l) window.location.href = l
            }}
          />
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- Journey */
const LINES: MetroLine[] = [
  { name: "Discover", tone: 1 },
  { name: "Commit", tone: 2 },
  { name: "Own", tone: 3 },
]
const STATIONS: MetroStation[] = [
  {
    id: "consult",
    line: 0,
    title: "Consultation",
    label: "Step 1",
    date: "Day 1",
    description:
      "Tell us your budget, yield target, and timeline. We map the Dubai communities and developers that fit.",
    image: gallery[3],
  },
  {
    id: "shortlist",
    line: 0,
    title: "Shortlist & Cost Sheet",
    label: "Step 2",
    date: "Week 1",
    description:
      "Compare units side by side with full DLD fees, service charges per sq.ft, rental outlook, and payment schedules.",
    image: gallery[7],
  },
  {
    id: "viewings",
    line: 0,
    title: "Private Viewings",
    label: "Step 3",
    date: "Week 1–2",
    description:
      "Tour developer sales galleries and ready homes with an SWK RERA specialist who knows the building.",
    image: gallery[2],
  },
  {
    id: "reserve",
    line: 1,
    title: "Reservation & Form F",
    label: "Step 4",
    date: "Week 2",
    description:
      "Reserve your unit or execute RERA Form F (MOU) and review the Sales & Purchase Agreement clause by clause.",
    image: gallery[9],
  },
  {
    id: "finance",
    line: 1,
    title: "Mortgage & Escrow",
    label: "Step 5",
    date: "Week 2–4",
    description:
      "Bank-agnostic UAE mortgage structuring for residents and overseas buyers, or verified DLD escrow transfer.",
    image: gallery[13],
  },
  {
    id: "register",
    line: 1,
    title: "DLD Registration",
    label: "Step 6",
    date: "Week 4",
    description:
      "Oqood (off-plan) or Title Deed transfer at a Dubai Land Department Trustee office, managed end to end.",
    image: gallery[8],
  },
  {
    id: "handover",
    line: 2,
    title: "Snagging & Handover",
    label: "Step 7",
    date: "Completion",
    description:
      "Technical snagging inspection, developer NOC clearance, DEWA activation, and key collection.",
    image: gallery[1],
  },
  {
    id: "tenant",
    line: 2,
    title: "Ejari Leasing",
    label: "Step 8",
    date: "Ongoing",
    description:
      "Tenant vetting, Ejari registration, rent collection, and preventive maintenance handled by SWK.",
    image: gallery[12],
  },
  {
    id: "grow",
    line: 2,
    title: "Portfolio Review",
    label: "Step 9",
    date: "Yearly",
    description:
      "Annual yield and capital appreciation audit to advise whether to hold, refinance, or trade up.",
    image: gallery[5],
  },
]
export function Journey() {
  return (
    <section id="journey" className="scroll-mt-20 border-y border-[#e6dfd2] bg-white py-20">
      <MetroMapGallery
        items={STATIONS}
        lines={LINES}
        eyebrow="06 · Your Buying & Leasing Journey"
        heading="From First Call to Title Deed & First Rent."
        caption="Select any station on the interactive transit map to see how SWK handles every regulatory milestone."
        autoplay
      />
    </section>
  )
}

/* ------------------------------------------------------------- Our Promise */
const PROMISE_INTERIORS = [
  { title: "100% DLD Escrow & Trakheesi Verification", src: gallery[3] },
  { title: "Complete Upfront Acquisition Cost Sheet", src: gallery[1] },
  { title: "Independent Cross-Developer Comparison", src: gallery[7] },
  { title: "Technical Snagging & Turnkey Handover", src: gallery[2] },
  { title: "Dedicated Ejari & Portfolio Management", src: gallery[12] },
  { title: "Golden Visa 2M+ AED Structuring", src: gallery[10] },
]

export function OurNote() {
  return (
    <section className="border-b border-[#e6dfd2] bg-[#f4efe6] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#94652c] shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            07 · Our Promise · SWK RERA Charter
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
            Clarity Before <em className="text-[#94652c] not-italic">Commitment.</em>
          </h2>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
            Buying or leasing property in Dubai should never involve hidden fees or unverified promises. Explore our interactive charter cards and flip-view gallery below.
          </p>
        </div>

        {/* 21st.dev InteractiveExpandingSelector for SWK Charter */}
        <div className="rounded-3xl border border-[#e6dfd2] bg-white p-4 md:p-8 shadow-sm">
          <InteractiveSelector />
        </div>

        {/* 21st.dev ViewfinderFlipCarousel for Architectural Details & Standards */}
        <div className="mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#94652c]">
                Interactive Viewfinder Inspection
              </p>
              <h3 className="mt-1 font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
                Every Detail Inspected Before You Sign
              </h3>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full bg-[#0f2244] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#14305c]"
            >
              Read Our Full Charter
              <ArrowRight className="h-3.5 w-3.5 text-[#dcb888]" />
            </Link>
          </div>
          <div className="rounded-3xl border border-[#e6dfd2] bg-white py-6 shadow-sm">
            <ViewfinderFlipCarousel
              height="480px"
              background="transparent"
              items={PROMISE_INTERIORS.map((p) => ({
                title: p.title,
                src: p.src,
                alt: p.title,
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Team (Rendered in About SWK Page per User Request) */
export function Team() {
  const [activeIdx, setActiveIdx] = React.useState(0)
  const activeMember = team[activeIdx] ?? team[0]

  return (
    <section id="team" className="scroll-mt-20 border-b border-[#e6dfd2] bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
              Leadership &amp; Senior Advisory Desk · Sheikh Zayed Road
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
              The Specialists Behind Every Handover
            </h2>
            <p className="mt-2.5 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
              Work directly with RERA-certified leadership and multilingual property consultants based at Al Saqr Business Tower, Sheikh Zayed Road.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev - 1 + team.length) % team.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] transition hover:border-[#94652c] hover:text-[#94652c]"
              aria-label="Previous advisor"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev + 1) % team.length)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] transition hover:border-[#94652c] hover:text-[#94652c]"
              aria-label="Next advisor"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Interactive Featured Spotlight + Selector Carousel */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-[#e6dfd2] bg-[#faf7f2] p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 items-center">
              <div className="sm:col-span-5 overflow-hidden rounded-2xl border border-[#e6dfd2] bg-white shadow-sm">
                <img
                  src={activeMember.photo}
                  alt={activeMember.name}
                  className="h-72 w-full object-cover object-top transition-all duration-500"
                />
              </div>
              <div className="sm:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/30 bg-[#f6ead7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#94652c]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  RERA Registered Specialist · ORN {SITE.reraOrn}
                </div>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
                    {activeMember.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
                    {activeMember.role}
                  </p>
                </div>
                <p className="text-sm text-[#39455a] leading-relaxed">
                  {activeMember.bio}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f2244]">
                    <Globe className="h-3.5 w-3.5 text-[#94652c]" />
                    Languages:
                  </span>
                  {activeMember.languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full border border-[#e6dfd2] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#39455a]"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#e6dfd2] pt-5">
              <Link
                href={`/agents/${activeMember.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#0f2244] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#14305c]"
              >
                View Advisor Profile & Mandates
                <ArrowRight className="h-3.5 w-3.5 text-[#dcb888]" />
              </Link>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/45 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0f2244] transition hover:border-[#94652c] hover:bg-[#f6ead7]"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#94652c]" />
                WhatsApp Direct
              </a>
            </div>
          </div>

          {/* Interactive Team Selector Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-3">
            {team.map((member, idx) => {
              const selected = idx === activeIdx
              return (
                <button
                  key={member.slug}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`group flex items-center gap-4 rounded-2xl border p-3.5 text-left transition-all ${
                    selected
                      ? "border-[#0f2244] bg-[#0f2244] text-white shadow-md"
                      : "border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] hover:border-[#94652c] hover:bg-white"
                  }`}
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover object-top ring-2 ring-[#c99a63]/40"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`truncate font-serif text-lg font-semibold ${
                          selected ? "text-white" : "text-[#0f2244] group-hover:text-[#94652c]"
                        }`}
                      >
                        {member.name}
                      </h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                          selected ? "text-[#dcb888]" : "text-[#94652c]"
                        }`}
                      >
                        0{idx + 1}
                      </span>
                    </div>
                    <p
                      className={`truncate text-xs ${
                        selected ? "text-white/80" : "text-[#39455a]"
                      }`}
                    >
                      {member.role}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- Testimonials (3D Globe + Non-Repeating Horizontal Infinite Scroll) */
export function Voices() {
  return (
    <section id="voices" className="scroll-mt-20 border-b border-[#e6dfd2] bg-[#faf7f2] py-24">
      <TestimonialGlobe
        items={testimonials}
        eyebrow="08 · Verified Global Client Stories"
        heading="Trusted by Buyers & Landlords Worldwide."
        caption="Spin the interactive 3D globe or click any international buyer pin to inspect verified client feedback."
        autoRotate
        autoplay
        action={
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#0f2244] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#14305c]"
          >
            Start Your Acquisition <ArrowUpRight className="size-4 text-[#dcb888]" />
          </Link>
        }
      />

      {/* Horizontal Infinite Scrolling Testimonial Marquee (Uses Separate Verified Reviews & Distinct Portraits — Zero Repeated Client Images) */}
      <div className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#94652c]">
              Verified Buyer & Landlord Endorsements
            </p>
            <h3 className="mt-1 font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
              More Client Experiences Across Dubai &amp; the UAE
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#5f6a82]">
            Hover over any review card to pause scroll
          </span>
        </div>

        <TestimonialInfiniteMarquee
          items={horizontalTestimonials}
          direction="left"
          speed="normal"
        />
      </div>
    </section>
  )
}
