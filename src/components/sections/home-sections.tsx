"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  CheckCircle2,
  Compass,
  FileCheck2,
  Globe,
  Home,
  KeyRound,
  Landmark,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react"

import DishOrbitCarousel from "@/components/ui/dish-orbit-carousel"
import InteractiveSelector from "@/components/ui/interactive-selector"
import { TestimonialInfiniteMarquee } from "@/components/ui/infinite-moving-cards"
import { SectionHeading } from "@/components/site/site-footer"
import {
  SITE,
  communities,
  gallery,
  horizontalTestimonials,
  services,
  team,
  testimonials,
} from "@/lib/swk"

/* ------------------------------------------------------------------ Dish Orbit Carousel Dubai Real Estate Hero (21st.dev kedhareswer/dish-orbit-carousel) */
export function Hero() {
  return (
    <div className="relative bg-[#0b1528]">
      <DishOrbitCarousel />
    </div>
  )
}

/* ----------------------------------------------------------------- TrustBar (18+ Years, 27+ Developers, 108+ Verified Projects — No RERA Number) */
export function TrustBar() {
  const items = [
    ["18+", "Years of Experience"],
    ["27+", "Partner Developers"],
    ["108+", "Verified Projects"],
    ["5", "UAE Emirates Covered"],
  ]
  return (
    <section className="border-y border-[#e6dfd2] bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 md:grid-cols-4 md:px-6">
        {items.map(([n, l]) => (
          <div key={l} className="text-center">
            <div className="font-hero-raleway font-light text-4xl text-[#0f2244] md:text-5xl">
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

/* ----------------------------------------------------------- Communities (Continuous Infinite Marquee Animation) */
const EXTRA_UAE_COMMUNITIES = [
  {
    id: "dubai-south-azizi-venice",
    slug: "dubai-south",
    name: "Dubai South & Azizi Venice",
    blurb: "Crystal lagoon living beside Al Maktoum International Airport and Expo City Dubai.",
    image: "/img/projects/azizi/azizi-venice.webp",
  },
  {
    id: "the-oasis-dubailand",
    slug: "dubai-hills-estate",
    name: "The Oasis & DAMAC Islands",
    blurb: "Low-density waterfront villas, swimmable canals, and tropical island masterplans in Dubailand.",
    image: "/img/projects/damac/damac-islands.webp",
  },
  {
    id: "al-marjan-island-rak",
    slug: "palm-jumeirah",
    name: "Al Marjan Island & Al Hamra (RAK)",
    blurb: "Ras Al Khaimah's freehold coral islands, Address beachfront towers, and championship golf marina.",
    image: "/img/projects/emaar/avarra-by-palace.webp",
  },
  {
    id: "yas-saadiyat-abu-dhabi",
    slug: "dubai-creek-harbour",
    name: "Yas & Saadiyat Island (Abu Dhabi)",
    blurb: "Manchester City Yas Residences, museum district lagoons, and waterfront canal homes.",
    image: "/img/projects/aldar/yas-bay.webp",
  },
  {
    id: "siniya-island-uaq",
    slug: "dubai-marina",
    name: "Siniya Island & Downtown UAQ",
    blurb: "Sobha Realty's natural mangrove island villas and 11-km coastal masterplan in Umm Al Quwain.",
    image: "/img/projects/sobha/sobha-sanctuary.webp",
  },
]

export function Communities() {
  const allCommunityCards = [
    ...communities.map((c) => ({
      id: c.id,
      name: c.name,
      blurb: c.blurb,
      href: `/communities/${c.slug}`,
      image: c.image,
    })),
    ...EXTRA_UAE_COMMUNITIES.map((c) => ({
      id: c.id,
      name: c.name,
      blurb: c.blurb,
      href: `/off-plan`,
      image: c.image,
    })),
  ]

  const row1 = [...allCommunityCards, ...allCommunityCards]
  const row2 = [...allCommunityCards.slice().reverse(), ...allCommunityCards.slice().reverse()]

  return (
    <section id="communities" className="scroll-mt-20 border-b border-[#e6dfd2] bg-white py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
            03 · Freehold Neighbourhoods &amp; Island Masterplans
          </p>
          <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
            Explore Dubai &amp; UAE Communities
          </h2>
          <p className="mt-2.5 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
            From Downtown Dubai, Dubai Hills Estate, and Dubai South to Yas Island, Masaar in Sharjah, Siniya Island, and Al Marjan Island—inspect the districts our team advises on daily.
          </p>
        </div>
        <Link
          href="/communities"
          className="inline-flex items-center gap-2 rounded-full bg-[#0f2244] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#94652c]"
        >
          <span>All Community Guides</span>
          <ArrowRight className="h-4 w-4 text-[#dcb888]" />
        </Link>
      </div>

      <style>{`
        @keyframes swk-marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes swk-marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .swk-track-left {
          display: flex;
          width: max-content;
          animation: swk-marquee-left 120s linear infinite;
        }
        .swk-track-right {
          display: flex;
          width: max-content;
          animation: swk-marquee-right 132s linear infinite;
        }
        .swk-track-left:hover,
        .swk-track-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Row 1: Continuous Infinite Marquee Moving Left */}
      <div className="relative w-full overflow-hidden py-2">
        <div className="swk-track-left gap-6 px-4">
          {row1.map((item, idx) => (
            <Link
              key={`${item.id}-r1-${idx}`}
              href={item.href}
              className="group relative flex h-[320px] w-[360px] shrink-0 flex-col justify-end overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#0f2244] p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#94652c]"
            >
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/95 via-[#0f2244]/40 to-transparent" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcb888]/20 border border-[#dcb888]/40 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcb888]">
                  <MapPin className="h-3 w-3" />
                  Freehold Corridor
                </span>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-white group-hover:text-[#dcb888]">
                  {item.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/85 leading-relaxed">
                  {item.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 2: Continuous Counter-Scrolling Marquee Moving Right */}
      <div className="relative mt-6 w-full overflow-hidden py-2">
        <div className="swk-track-right gap-6 px-4">
          {row2.map((item, idx) => (
            <Link
              key={`${item.id}-r2-${idx}`}
              href={item.href}
              className="group flex w-[380px] shrink-0 items-center gap-4 rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3.5 transition hover:border-[#94652c] hover:bg-white hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-24 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="truncate font-serif text-lg font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                    {item.name}
                  </h4>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#94652c]" />
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-[#39455a]">
                  {item.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Aerial (Interactive Aerial Masterplan & Corridor Explorer) */
const AERIAL_ZONES = [
  {
    id: "dubai-central",
    badge: "Central Spine · Sheikh Zayed Road & Downtown",
    title: "Downtown Dubai, Business Bay & Sobha Century",
    emirate: "Dubai",
    image: "/img/communities/downtown-dubai.webp",
    priceBand: "AED 1.85M – 45M+",
    paymentPlans: "60/40 · 70/30 · 80/20",
    flagshipLaunches: [
      "Binghatti Maybach Mercedes-Benz Places",
      "Sobha Century (Sheikh Zayed Road)",
      "Samana Downtown One",
      "Avarra by Palace (Emaar)",
    ],
    summary:
      "The vertical spine of Dubai stretching from our 27th-floor headquarters at Al Saqr Business Tower through DIFC and Burj Khalifa to the Dubai Water Canal. High global liquidity, year-round corporate tenant demand, and iconic branded towers.",
    hotspots: [
      { x: "34%", y: "42%", label: "Binghatti Maybach · Downtown" },
      { x: "58%", y: "55%", label: "Samana Downtown One" },
      { x: "22%", y: "66%", label: "Sobha Century · SZR Corridor" },
    ],
  },
  {
    id: "dubai-lagoon",
    badge: "Lagoon & Villa Sanctuaries · Dubai South & Dubailand",
    title: "Azizi Venice, Emaar The Oasis & DAMAC Islands",
    emirate: "Dubai",
    image: "/img/projects/azizi/azizi-venice.webp",
    priceBand: "AED 1.15M – 18M+",
    paymentPlans: "50/50 · 75/25 · 80/20 · 1% Monthly",
    flagshipLaunches: [
      "Azizi Venice (Dubai South)",
      "Emaar The Oasis (Dubailand)",
      "DAMAC Islands (Dubailand)",
      "Dubai Hills Estate & Danube Greenz",
    ],
    summary:
      "Master-planned swimmable crystal lagoons, golf estates, and botanical villa sanctuaries positioned along the Al Maktoum Airport and Dubailand growth corridors—our highest-volume segment for capital appreciation.",
    hotspots: [
      { x: "28%", y: "48%", label: "Azizi Venice · 18km Crystal Lagoon" },
      { x: "62%", y: "38%", label: "Emaar The Oasis · Waterfront Mansions" },
      { x: "52%", y: "68%", label: "DAMAC Islands & Lunaya Bloom Villas" },
    ],
  },
  {
    id: "dubai-islands",
    badge: "Coastal & Island Masterplans · Dubai",
    title: "The Meriva on Dubai Islands, Palm Jumeirah & Creek",
    emirate: "Dubai",
    image: "/img/projects/nakheel/dubai-islands.webp",
    priceBand: "AED 2.2M – 60M+",
    paymentPlans: "70/30 · 80/20 · 60/40",
    flagshipLaunches: [
      "The Meriva — Dubai Islands by Ellington",
      "Ellington Berkeley Tower",
      "Azizi Leily (Al Jaddaf Creek Corridor)",
      "Sobha River Core (Hartland II)",
    ],
    summary:
      "Waterfront living across Dubai's new coastal archipelagos and creekside sanctuaries, led by Ellington's design-led beachfront release on Dubai Islands and Sobha's riverfront boardwalks.",
    hotspots: [
      { x: "42%", y: "36%", label: "The Meriva · Dubai Islands by Ellington" },
      { x: "66%", y: "58%", label: "Sobha River Core & Azizi Leily" },
      { x: "25%", y: "62%", label: "Ellington Berkeley Tower" },
    ],
  },
  {
    id: "rak-uaq",
    badge: "Northern Emirates Island Boom · RAK & Umm Al Quwain",
    title: "Al Marjan Island, Siniya Island & Al Hamra Waterfront",
    emirate: "Ras Al Khaimah & UAQ",
    image: "/img/projects/sobha/sobha-seahaven.webp",
    priceBand: "AED 1.35M – 28M+",
    paymentPlans: "60/40 · 70/30 · 80/20",
    flagshipLaunches: [
      "Address Residences Al Marjan Island",
      "Quattro Del Mar & Al Hamra Waterfront (RAK)",
      "Sobha Siniya Island (Umm Al Quwain)",
      "Downtown Umm Al Quwain",
    ],
    summary:
      "Anchored by the multi-billion-dollar integrated resort transformation of Al Marjan Island in Ras Al Khaimah and Sobha's natural mangrove sanctuary on Siniya Island in Umm Al Quwain.",
    hotspots: [
      { x: "32%", y: "44%", label: "Address Residences · Al Marjan Island" },
      { x: "58%", y: "52%", label: "Quattro Del Mar & Al Hamra Waterfront" },
      { x: "74%", y: "64%", label: "Sobha Siniya Island & Downtown UAQ" },
    ],
  },
  {
    id: "abudhabi-sharjah",
    badge: "Capital & Cultural Hubs · Abu Dhabi & Sharjah",
    title: "Manchester City Yas Residences, Saadiyat & Masaar",
    emirate: "Abu Dhabi & Sharjah",
    image: "/img/projects/aldar/saadiyat-lagoons.webp",
    priceBand: "AED 1.1M – 22M+",
    paymentPlans: "50/50 · 60/40 · 65/35",
    flagshipLaunches: [
      "Manchester City Yas Residences (Yas Island)",
      "Saadiyat Island & Yas Island Waterfront",
      "Masaar Woodland Villas (Sharjah)",
      "Alif — Aljada Boulevard (Sharjah)",
    ],
    summary:
      "From branded canal residences on Yas Island and cultural district villas on Saadiyat Island in Abu Dhabi to Arada's 50,000-tree forested sanctuary of Masaar and Alif in Sharjah.",
    hotspots: [
      { x: "36%", y: "46%", label: "Manchester City Yas Residences" },
      { x: "64%", y: "40%", label: "Saadiyat Island Sanctuary" },
      { x: "48%", y: "70%", label: "Masaar & Alif · Sharjah" },
    ],
  },
]

export function Aerial() {
  const [activeZoneIdx, setActiveZoneIdx] = React.useState(0)
  const activeZone = AERIAL_ZONES[activeZoneIdx]

  return (
    <section id="aerial" className="scroll-mt-20 border-b border-[#e6dfd2] bg-[#f4efe6] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Interactive Aerial Masterplan Explorer"
            title={
              <>
                Inspect the UAE{" "}
                <em className="text-[#94652c] not-italic">From Above.</em>
              </>
            }
            lead="Select any of our 5 priority aerial corridors below to inspect live hotspot pins, price bands, payment structures, and flagship developer launches."
          />

          <div className="flex flex-wrap gap-2">
            {AERIAL_ZONES.map((zone, idx) => {
              const selected = idx === activeZoneIdx
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveZoneIdx(idx)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                    selected
                      ? "border-[#0f2244] bg-[#0f2244] text-white shadow-sm"
                      : "border-[#e6dfd2] bg-white text-[#0f2244] hover:border-[#94652c] hover:text-[#94652c]"
                  }`}
                >
                  {zone.emirate} · 0{idx + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Interactive Aerial Viewport + Telemetry Panel */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          {/* Left: Interactive Aerial Map Viewport with Animated Hotspot Pins */}
          <div className="lg:col-span-7 relative min-h-[420px] md:min-h-[500px] overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#0f2244] shadow-lg">
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={activeZone.image}
                src={activeZone.image}
                alt={activeZone.title}
                loading="eager"
                decoding="sync"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/90 via-[#0f2244]/25 to-[#0f2244]/30" />

            {/* Top Radar Bar */}
            <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#0f2244]/90 border border-[#dcb888]/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#dcb888] backdrop-blur-md">
                <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "12s" }} />
                {activeZone.badge}
              </span>
              <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#0f2244] shadow-sm">
                {activeZone.priceBand}
              </span>
            </div>

            {/* Interactive Pulsing Hotspot Pins with Official SWK Portal Map Pin */}
            {activeZone.hotspots.map((spot) => (
              <div
                key={spot.label}
                style={{ left: spot.x, top: spot.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                <div className="flex items-center gap-2 rounded-full border border-[#dcb888] bg-[#0f2244]/95 px-3 py-1.5 text-[11px] font-semibold text-white shadow-xl backdrop-blur-md transition-transform duration-300 hover:scale-105">
                  <img
                    src="/brand/swk-map-pin.png"
                    alt="SWK Pin"
                    className="h-4 w-3.5 object-contain shrink-0"
                  />
                  <span className="whitespace-nowrap">{spot.label}</span>
                </div>
              </div>
            ))}

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-wrap items-end justify-between gap-4 text-white">
              <div className="max-w-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#dcb888]">
                  Aerial Sector 0{activeZoneIdx + 1} · {activeZone.emirate}
                </p>
                <h3 className="mt-1 font-serif text-2xl md:text-3xl font-semibold">
                  {activeZone.title}
                </h3>
              </div>
              <Link
                href="/off-plan"
                className="inline-flex items-center gap-2 rounded-full bg-[#dcb888] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] transition hover:bg-white"
              >
                <span>Inspect Corridor Releases</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: Corridor Intelligence & Target Projects Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 shadow-sm">
            <div>
              <div className="flex items-center justify-between border-b border-[#e6dfd2] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#94652c]">
                    Corridor Briefing
                  </span>
                  <h4 className="mt-1 font-serif text-2xl font-semibold text-[#0f2244]">
                    {activeZone.emirate} Growth Matrix
                  </h4>
                </div>
                <span className="rounded-xl bg-[#faf7f2] border border-[#e6dfd2] px-3 py-1.5 text-xs font-bold text-[#94652c]">
                  {activeZone.paymentPlans}
                </span>
              </div>

              <p className="mt-4 text-sm text-[#39455a] leading-relaxed">
                {activeZone.summary}
              </p>

              <div className="mt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0f2244] mb-3">
                  Priority Target Projects in This Corridor:
                </p>
                <div className="space-y-2.5">
                  {activeZone.flagshipLaunches.map((launch) => (
                    <Link
                      key={launch}
                      href="/off-plan"
                      className="flex items-center justify-between rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] px-4 py-3 text-xs font-semibold text-[#0f2244] transition hover:border-[#94652c] hover:bg-white"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#94652c]" />
                        {launch}
                      </span>
                      <span className="text-[#94652c]">View Allocation →</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#e6dfd2] pt-5">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#0f2244] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#94652c]"
              >
                <span>Request Corridor Price Sheet</span>
                <ArrowRight className="h-4 w-4 text-[#dcb888]" />
              </Link>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#94652c] hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Residences (Continuous Infinite Horizontal Animation) */
const VISUALISATION_SHOWCASE = [
  {
    title: "Azizi Venice · Crystal Lagoon Mansions & Boulevard",
    location: "Dubai South",
    tag: "50/50 Payment Plan",
    src: "/img/projects/azizi/azizi-venice.webp",
  },
  {
    title: "Emaar The Oasis · Swimmable Canal Villas",
    location: "Dubailand",
    tag: "80/20 Payment Plan",
    src: "/img/projects/emaar/greencrest.webp",
  },
  {
    title: "DAMAC Islands · Tropical Waterfront Townhouses",
    location: "Dubailand",
    tag: "75/25 Payment Plan",
    src: "/img/projects/damac/damac-islands.webp",
  },
  {
    title: "Binghatti Maybach & Mercedes-Benz Places",
    location: "Downtown Dubai",
    tag: "70/30 Payment Plan",
    src: "/img/projects/binghatti/mercedes-benz-places.webp",
  },
  {
    title: "Sobha Century · Sheikh Zayed Road Sky Towers",
    location: "Sheikh Zayed Road",
    tag: "60/40 Payment Plan",
    src: "/img/projects/sobha/sobha-seahaven.webp",
  },
  {
    title: "The Meriva · Dubai Islands by Ellington",
    location: "Dubai Islands",
    tag: "70/30 Payment Plan",
    src: "/img/projects/nakheel/dubai-islands.webp",
  },
  {
    title: "Address Residences · Al Marjan Island Beachfront",
    location: "Ras Al Khaimah",
    tag: "80/20 Payment Plan",
    src: "/img/projects/emaar/avarra-by-palace.webp",
  },
  {
    title: "Sobha Siniya Island & Downtown Umm Al Quwain",
    location: "Umm Al Quwain",
    tag: "60/40 Payment Plan",
    src: "/img/projects/sobha/sobha-sanctuary.webp",
  },
  {
    title: "Manchester City Yas Residences & Saadiyat Lagoons",
    location: "Abu Dhabi",
    tag: "60/40 Payment Plan",
    src: "/img/projects/aldar/yas-bay.webp",
  },
  {
    title: "Masaar Woodland Villas & Alif Boulevard",
    location: "Sharjah",
    tag: "50/50 Payment Plan",
    src: "/img/projects/arada/masaar.webp",
  },
]

export function Residences() {
  const infiniteItems = [...VISUALISATION_SHOWCASE, ...VISUALISATION_SHOWCASE]

  return (
    <section id="residences" className="scroll-mt-20 bg-[#faf7f2] py-24 border-b border-[#e6dfd2] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 mb-12 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Architectural Visualisations · Continuous Infinite Stream"
          title={
            <>
              Residences Built to Be{" "}
              <em className="text-[#94652c] not-italic">Remembered.</em>
            </>
          }
          lead="Verified architectural visualisations across our priority launches in Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, and Umm Al Quwain. Hover any residence to pause and inspect."
        />
        <Link
          href="/off-plan"
          className="inline-flex items-center gap-2 rounded-full border border-[#0f2244] bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0f2244] transition hover:bg-[#0f2244] hover:text-white"
        >
          <span>View All 108+ Projects</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Continuous Infinite Horizontal Moving Gallery */}
      <div className="relative w-full overflow-hidden py-3">
        <div className="swk-track-left gap-6 px-4">
          {infiniteItems.map((item, idx) => (
            <Link
              key={`${item.title}-${idx}`}
              href="/off-plan"
              className="group relative flex h-[400px] w-[440px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#0f2244] p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#94652c]"
            >
              <img
                src={item.src}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/95 via-[#0f2244]/25 to-[#0f2244]/35" />

              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#0f2244]/85 border border-[#dcb888]/40 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcb888] backdrop-blur-md">
                  {item.location}
                </span>
                <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-[#0f2244]">
                  {item.tag}
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#dcb888]">
                  SWK Priority Launch Visualisation
                </p>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-white group-hover:text-[#dcb888]">
                  {item.title}
                </h3>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#dcb888]">
                  <span>Request Floor Plans &amp; Availability</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- Services (Redesigned Interactive 6-Pillar Advisory Showcase + Refined Buttons) */
const SERVICE_ICONS = [Landmark, Home, KeyRound, Building2, TrendingUp, FileCheck2]
const SERVICE_DELIVERABLES = [
  [
    "Direct launch-day unit allocations across 27+ partner developers",
    "Zero agency commission on primary off-plan purchases",
    "Side-by-side payment plan & construction milestone comparison",
  ],
  [
    "Live comparable transfer analysis before you submit an offer",
    "Full Form F (MOU) drafting, NOC coordination & DLD Trustee transfer",
    "Itemised upfront cost sheet (4% DLD, trustee & agency fees)",
  ],
  [
    "Tenant vetting, corporate lease structuring & cheque schedule management",
    "Full Ejari registration, DEWA activation & move-in inspection",
    "Annual renewal benchmarking against official rental index",
  ],
  [
    "Dedicated landlord asset management for overseas & local owners",
    "Preventive maintenance, snagging & tenant relationship desk",
    "Structured annual rent collection and expense statements",
  ],
  [
    "Multi-unit portfolio structuring for family offices & funds",
    "10-Year UAE Golden Visa (AED 2M+) property qualification support",
    "Cross-emirate allocation across Dubai, Abu Dhabi, RAK & UAQ",
  ],
  [
    "Independent technical snagging inspection prior to developer handover",
    "Bank-agnostic UAE resident & non-resident mortgage introductions",
    "Title Deed & Oqood registration verification from start to keys",
  ],
]

export function Services() {
  const [activeServiceIdx, setActiveServiceIdx] = React.useState(0)
  const activeService = services[activeServiceIdx] ?? services[0]
  const ActiveIcon = SERVICE_ICONS[activeServiceIdx % SERVICE_ICONS.length]
  const activeImage = gallery[[0, 3, 7, 9, 2, 12][activeServiceIdx % 6]]
  const deliverables = SERVICE_DELIVERABLES[activeServiceIdx % SERVICE_DELIVERABLES.length]

  return (
    <section id="services" className="scroll-mt-20 bg-white py-24 border-b border-[#e6dfd2]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="05 · End-to-End Real Estate Advisory"
            title={
              <>
                One Partner,{" "}
                <em className="text-[#94652c] not-italic">From Shortlist to Keys.</em>
              </>
            }
            lead="Six specialist divisions under one roof on Sheikh Zayed Road—covering primary off-plan launches, ready resales, Ejari leasing, portfolio management, and handover snagging."
          />

          <Link
            href="/services"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[#0f2244] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-[#94652c]"
          >
            <span>Explore All 6 Advisory Divisions</span>
            <ArrowRight className="h-4 w-4 text-[#dcb888]" />
          </Link>
        </div>

        {/* Interactive 6-Pillar Selector Grid + Active Spotlight Card */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          {/* Left: 6 Interactive Service Pillar Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {services.map((s, idx) => {
              const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length]
              const isSelected = idx === activeServiceIdx
              return (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setActiveServiceIdx(idx)}
                  className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-[#0f2244] bg-[#0f2244] text-white shadow-md"
                      : "border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] hover:border-[#94652c] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                        isSelected
                          ? "border-[#dcb888]/40 bg-[#dcb888]/15 text-[#dcb888]"
                          : "border-[#e6dfd2] bg-white text-[#94652c] group-hover:border-[#94652c]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`block text-[10px] font-bold uppercase tracking-[0.2em] ${
                          isSelected ? "text-[#dcb888]" : "text-[#94652c]"
                        }`}
                      >
                        Division 0{idx + 1}
                      </span>
                      <span className="block truncate font-serif text-lg font-semibold">
                        {s.title}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isSelected ? "translate-x-1 text-[#dcb888]" : "text-[#5f6a82] group-hover:translate-x-1"
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {/* Right: Active Service Spotlight Panel with Architectural Photography & Clean Tactile Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#faf7f2] shadow-sm">
            <div className="relative h-64 md:h-72 w-full overflow-hidden bg-[#0f2244]">
              <AnimatePresence initial={false} mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={activeService.title}
                  loading="eager"
                  decoding="sync"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/90 via-[#0f2244]/35 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4 text-white">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcb888]/20 border border-[#dcb888]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#dcb888]">
                    <ActiveIcon className="h-3.5 w-3.5" />
                    0{activeServiceIdx + 1} · SWK Advisory Division
                  </span>
                  <h3 className="mt-2 font-serif text-2xl md:text-4xl font-semibold">
                    {activeService.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
                {activeService.description}
              </p>

              <div className="rounded-2xl border border-[#e6dfd2] bg-white p-5 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#94652c]">
                  What Our Team Delivers For You:
                </p>
                {deliverables.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs md:text-sm text-[#0f2244]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Clean Corporate Buttons (Replaces old HalomotButton style) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f2244] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-[#14305c]"
                >
                  <span>View Service Mandate</span>
                  <ArrowRight className="h-4 w-4 text-[#dcb888]" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#94652c] bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#94652c] transition hover:bg-[#94652c] hover:text-white"
                >
                  <span>Speak With a Specialist</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- Journey (Interactive 6-Stage Acquisition & Handover Timeline) */
const JOURNEY_STAGES = [
  {
    step: "01",
    phase: "Brief & Strategy",
    title: "Portfolio Brief & Corridor Selection",
    timing: "Day 1–2",
    description:
      "We map your capital budget, target yield, and timeline against live inventory across Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, and Umm Al Quwain.",
    deliverable: "Custom 3-to-5 project comparison pack with historical capital & rental benchmarks.",
    image: "/img/projects/azizi/azizi-venice.webp",
  },
  {
    step: "02",
    phase: "Cost & Unit Audit",
    title: "Floor-Plate Selection & Written Fee Sheet",
    timing: "Day 3–5",
    description:
      "Before any reservation, we prepare a written acquisition sheet detailing unit orientation, service charges per sq ft, 4% DLD fee, and milestone dates.",
    deliverable: "Itemised AED & foreign-currency acquisition cost breakdown with zero hidden charges.",
    image: "/img/projects/emaar/greencrest.webp",
  },
  {
    step: "03",
    phase: "Inspection",
    title: "Private Show-Home or Live Video Walkthrough",
    timing: "Week 1",
    description:
      "Tour developer experience centres and ready properties in person with our advisors, or join a live GST-anchored architectural video inspection from overseas.",
    deliverable: "On-site view corridor check, community drive-time test & developer stock verification.",
    image: "/img/projects/damac/damac-islands.webp",
  },
  {
    step: "04",
    phase: "Reservation & SPA",
    title: "Unit Allocation, Form F & Escrow Transfer",
    timing: "Week 2",
    description:
      "Secure priority developer unit allocation or execute Form F (MOU) for secondary homes. All payments route directly to official project escrow or trustee accounts.",
    deliverable: "Sales & Purchase Agreement (SPA) review and official developer booking receipt.",
    image: "/img/projects/binghatti/mercedes-benz-places.webp",
  },
  {
    step: "05",
    phase: "Registration",
    title: "Oqood, Title Deed & Golden Visa Filing",
    timing: "Week 2–4",
    description:
      "Our operations team coordinates Oqood registration, Title Deed transfer, UAE mortgage disbursement, and 10-year Golden Visa documentation for AED 2M+ buyers.",
    deliverable: "Official Title Deed / Oqood certificate & Golden Visa nomination dossier.",
    image: "/img/projects/sobha/sobha-seahaven.webp",
  },
  {
    step: "06",
    phase: "Handover & Yield",
    title: "Technical Snagging, Key Handover & Leasing",
    timing: "Completion & Ongoing",
    description:
      "At completion, we conduct a multi-point technical snagging inspection, activate utilities, and transition your property into annual leasing or resale management.",
    deliverable: "Snagging clearance report, key handover & signed annual lease mandate.",
    image: "/img/projects/nakheel/dubai-islands.webp",
  },
]

export function Journey() {
  const [activeStep, setActiveStep] = React.useState(0)
  const current = JOURNEY_STAGES[activeStep]

  return (
    <section id="journey" className="scroll-mt-20 border-y border-[#e6dfd2] bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="06 · Your Buying & Leasing Journey"
            title={
              <>
                From First Call to{" "}
                <em className="text-[#94652c] not-italic">Title Deed &amp; First Rent.</em>
              </>
            }
            lead="Click any of the 6 milestones below to see how our sales and operations desk manages every step of your acquisition."
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev - 1 + JOURNEY_STAGES.length) % JOURNEY_STAGES.length)}
              className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-4 py-2.5 text-xs font-bold text-[#0f2244] transition hover:border-[#94652c]"
            >
              ← Previous Step
            </button>
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev + 1) % JOURNEY_STAGES.length)}
              className="rounded-xl bg-[#0f2244] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#94652c]"
            >
              Next Step →
            </button>
          </div>
        </div>

        {/* Interactive Progress Stepper Bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 mb-10">
          {JOURNEY_STAGES.map((item, idx) => {
            const active = idx === activeStep
            const completed = idx < activeStep
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-[#0f2244] bg-[#0f2244] text-white shadow-md -translate-y-0.5"
                    : completed
                    ? "border-[#94652c]/50 bg-[#f6ead7]/55 text-[#0f2244]"
                    : "border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] hover:border-[#94652c] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-hero-raleway font-light text-2xl ${
                      active ? "text-[#dcb888]" : "text-[#94652c]"
                    }`}
                  >
                    {item.step}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      active
                        ? "bg-white/15 text-[#dcb888]"
                        : "bg-white text-[#5f6a82] border border-[#e6dfd2]"
                    }`}
                  >
                    {item.timing}
                  </span>
                </div>
                <div className="mt-3">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                      active ? "text-[#dcb888]" : "text-[#94652c]"
                    }`}
                  >
                    {item.phase}
                  </p>
                  <p className="mt-0.5 font-serif text-base font-semibold leading-snug">
                    {item.title}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Animated Stage Detail Card */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current.step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center rounded-3xl border border-[#e6dfd2] bg-[#faf7f2] p-6 md:p-10 shadow-sm"
          >
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#94652c]">
                <span>Step {current.step} of 06</span>
                <span>·</span>
                <span>{current.timing}</span>
              </div>

              <h3 className="font-serif text-2xl md:text-4xl font-semibold text-[#0f2244]">
                {current.title}
              </h3>

              <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
                {current.description}
              </p>

              <div className="rounded-2xl border border-[#e6dfd2] bg-white p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#94652c] mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#94652c]">
                    Key Client Deliverable
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-[#0f2244]">
                    {current.deliverable}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/guides/buying"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f2244] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#94652c]"
                >
                  <span>Read Full Acquisition Guide</span>
                  <ArrowRight className="h-4 w-4 text-[#dcb888]" />
                </Link>
                <Link
                  href="/calculators"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#e6dfd2] bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] transition hover:border-[#94652c]"
                >
                  <span>Open Fee &amp; Yield Calculators</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-[#e6dfd2] bg-white shadow-md">
              <img
                src={current.image}
                alt={current.title}
                className="h-64 md:h-80 w-full object-cover"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Our Promise (Viewfinder Inspection Removed per User Request) */
export function OurNote() {
  return (
    <section className="border-b border-[#e6dfd2] bg-[#f4efe6] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#94652c] shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            07 · Our Promise · The SWK Advisory Charter
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
            Clarity Before <em className="text-[#94652c] not-italic">Commitment.</em>
          </h2>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
            Buying or leasing property in the UAE should be led by clear paperwork, verified developer track records, and written cost sheets. Explore our interactive charter pillars below.
          </p>
        </div>

        {/* 21st.dev InteractiveExpandingSelector for SWK Charter */}
        <div className="rounded-3xl border border-[#e6dfd2] bg-white p-4 md:p-8 shadow-sm">
          <InteractiveSelector />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Team (Unified 8-Member Team Section + Animated Track-Record Popup Modal) */
export type TeamMemberItem = (typeof team)[number] & {
  dealsCount?: string
  experienceYears?: string
  topDevelopers?: string[]
  keyProjects?: string[]
  specialties?: string[]
}

export function Team() {
  const [selectedMember, setSelectedMember] = React.useState<TeamMemberItem | null>(null)
  const typedTeam = team as TeamMemberItem[]

  return (
    <section id="team" className="scroll-mt-20 border-b border-[#e6dfd2] bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0f2244]">
              25+ Real Estate Professionals · Sheikh Zayed Road, Dubai
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
              Leadership &amp; Key Advisory Specialists
            </h2>
            <p className="mt-2.5 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
              Backed by a team of 25+ dedicated real estate professionals on Sheikh Zayed Road. Click any senior advisor below to inspect their track-record dossier—including years of experience, verified transactions, developer partnerships, and direct WhatsApp contact.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] px-5 py-3 text-left sm:text-right">
            <div className="font-hero-raleway font-light text-2xl font-bold text-[#0f2244]">
              25+ Professionals
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f2244]/75">
              18+ Years Combined UAE Leadership
            </div>
          </div>
        </div>

        {/* Interactive Senior Advisory Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {typedTeam.map((member) => (
            <motion.div
              key={member.slug}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={() => setSelectedMember(member)}
              className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#faf7f2] shadow-sm transition-colors hover:border-[#0f2244] hover:bg-white hover:shadow-xl"
            >
              <div>
                {/* High-Resolution 4:5 Centered Portrait — Zero Overlapping Badges */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0f2244]">
                  <img
                    src={member.photo}
                    alt={member.name}
                    loading="eager"
                    decoding="sync"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/90 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                      {member.role}
                    </p>
                    <h3 className="mt-0.5 font-serif text-xl md:text-2xl font-semibold text-white">
                      {member.name}
                    </h3>
                  </div>
                </div>

                {/* Non-Overlapping Experience & Transaction Badges + Summary */}
                <div className="p-5 space-y-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {member.experienceYears && (
                      <span className="rounded-full bg-[#0f2244] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                        {member.experienceYears}
                      </span>
                    )}
                    {member.dealsCount && (
                      <span className="rounded-full border border-[#0f2244]/20 bg-white px-3 py-1 text-[10px] font-bold text-[#0f2244]">
                        {member.dealsCount}
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-3 text-xs text-[#39455a] leading-relaxed">
                    {member.bio}
                  </p>

                  {member.topDevelopers && member.topDevelopers.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f2244] mb-1.5">
                        Key Developer Track Record:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {member.topDevelopers.map((dev) => (
                          <span
                            key={dev}
                            className="rounded-full border border-[#e6dfd2] bg-white px-2.5 py-0.5 text-[10px] font-semibold text-[#0f2244]"
                          >
                            {dev}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e6dfd2] bg-white px-5 py-3.5 text-xs font-bold text-[#0f2244] group-hover:bg-[#0f2244] group-hover:text-white transition-colors">
                <span className="uppercase tracking-[0.14em]">
                  View Experience &amp; Track Record
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated Detailed Popup Modal for Selected Team Member */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0f2244]/75 p-3 sm:p-4 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#e6dfd2] bg-white text-[#0f2244] shadow-[0_32px_90px_rgba(15,34,68,0.45)]"
              >
                {/* Modal Top Header Bar */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e6dfd2] bg-[#0f2244] px-5 sm:px-6 py-4 text-white">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/brand/swk-portal-emblem.png"
                      alt="SWK"
                      className="h-7 w-7 object-contain"
                    />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E0C1A3]">
                      Verified Advisor Dossier · SWK Properties
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    aria-label="Close advisor modal"
                    className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-center">
                    <div className="md:col-span-5 overflow-hidden rounded-2xl border border-[#e6dfd2] bg-[#0f2244] shadow-md">
                      <img
                        src={selectedMember.photo}
                        alt={selectedMember.name}
                        className="h-72 w-full object-cover object-top"
                      />
                    </div>

                    <div className="md:col-span-7 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {selectedMember.experienceYears && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0f2244] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#dcb888]">
                            <Award className="h-3.5 w-3.5" />
                            {selectedMember.experienceYears}
                          </span>
                        )}
                        {selectedMember.dealsCount && (
                          <span className="rounded-full border border-[#94652c]/40 bg-[#f6ead7] px-3 py-1 text-[11px] font-bold text-[#94652c]">
                            {selectedMember.dealsCount}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0f2244]">
                          {selectedMember.name}
                        </h3>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
                          {selectedMember.role}
                        </p>
                      </div>

                      <p className="text-sm text-[#39455a] leading-relaxed">
                        {selectedMember.bio}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-xs font-bold text-[#0f2244] mr-1">
                          Languages:
                        </span>
                        {selectedMember.languages.map((lang) => (
                          <span
                            key={lang}
                            className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-2.5 py-0.5 text-[11px] font-semibold text-[#39455a]"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Verified Performance Metrics Grid (Years & Number of Transactions Only — No Currency Figures) */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94652c]">
                        Market Experience
                      </span>
                      <div className="mt-1 font-serif text-xl font-bold text-[#0f2244]">
                        {selectedMember.experienceYears ?? "10+ Years"}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94652c]">
                        Completed Transactions
                      </span>
                      <div className="mt-1 font-serif text-xl font-bold text-[#0f2244]">
                        {selectedMember.dealsCount ?? "100+ Transactions"}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94652c]">
                        Advisory Base
                      </span>
                      <div className="mt-1 font-serif text-xl font-bold text-[#0f2244]">
                        Sheikh Zayed Road
                      </div>
                    </div>
                  </div>

                  {/* Top Developers & Priority Projects */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {selectedMember.topDevelopers && (
                      <div className="rounded-2xl border border-[#e6dfd2] bg-white p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#94652c] mb-2.5">
                          Top Developer Partnerships
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedMember.topDevelopers.map((dev) => (
                            <span
                              key={dev}
                              className="rounded-lg bg-[#0f2244] px-3 py-1 text-xs font-semibold text-white"
                            >
                              {dev}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMember.keyProjects && (
                      <div className="rounded-2xl border border-[#e6dfd2] bg-white p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#94652c] mb-2.5">
                          Priority Target Allocations
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedMember.keyProjects.map((proj) => (
                            <span
                              key={proj}
                              className="rounded-lg border border-[#94652c]/35 bg-[#f6ead7] px-2.5 py-1 text-xs font-semibold text-[#0f2244]"
                            >
                              {proj}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer CTAs */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6dfd2] pt-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <a
                        href={`${SITE.whatsappUrl}?text=${encodeURIComponent(
                          `Hello ${selectedMember.name} at SWK Properties, I would like to discuss UAE property options.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-emerald-700"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp {selectedMember.name.split(" ")[0]}
                      </a>
                      <a
                        href={`tel:${SITE.phoneRaw}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] transition hover:border-[#94652c]"
                      >
                        <Phone className="h-4 w-4 text-[#94652c]" />
                        {SITE.phone}
                      </a>
                    </div>

                    <Link
                      href={`/agents/${selectedMember.slug}`}
                      onClick={() => setSelectedMember(null)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0f2244] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#94652c]"
                    >
                      <span>Full Advisor Page</span>
                      <ArrowRight className="h-4 w-4 text-[#dcb888]" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Voices (Interactive Client Spotlight + Dual Counter-Scrolling Infinite Showcase) */
export function Voices() {
  const allStories = [...testimonials, ...horizontalTestimonials]
  const [activeStoryIdx, setActiveStoryIdx] = React.useState(0)
  const featured = allStories[activeStoryIdx] ?? allStories[0]

  return (
    <section id="reviews" className="scroll-mt-20 border-b border-[#e6dfd2] bg-white py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="08 · Verified Global Client Stories"
            title={
              <>
                Trusted by Buyers From{" "}
                <em className="text-[#94652c] not-italic">Six Countries.</em>
              </>
            }
            lead="Select any buyer profile below to read how families and overseas investors from the UK, India, UAE, Canada, Pakistan, and Russia completed their acquisitions with SWK."
          />

          {/* Interactive Buyer Selector Pills */}
          <div className="flex flex-wrap gap-2">
            { testimonials.map((item, idx) => {
              const selected = idx === activeStoryIdx
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selected
                      ? "border-[#0f2244] bg-[#0f2244] text-white shadow-sm"
                      : "border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] hover:border-[#94652c]"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span>{item.name}</span>
                  <span className="text-[10px] opacity-75">({item.city})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Animated Featured Client Case Study Spotlight */}
        {featured && (
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 items-center rounded-3xl border border-[#e6dfd2] bg-[#0f2244] p-6 md:p-10 text-white shadow-xl"
            >
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center sm:items-start gap-5">
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="h-28 w-28 md:h-36 md:w-36 rounded-3xl object-cover border-2 border-[#dcb888]"
                />
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#dcb888]/20 border border-[#dcb888]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcb888]">
                    <Globe className="h-3 w-3" />
                    Verified Buyer · {featured.city}
                  </div>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-white">
                    {featured.name}
                  </h3>
                  <p className="text-xs font-medium text-[#dcb888]">
                    {featured.role}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5 border-t lg:border-t-0 lg:border-l border-white/15 pt-5 lg:pt-0 lg:pl-8">
                <div className="flex items-center gap-1 text-[#dcb888] text-sm">
                  {"★★★★★"}
                  <span className="ml-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">
                    Completed Transaction Review
                  </span>
                </div>
                <blockquote className="font-serif text-xl md:text-3xl leading-relaxed text-white">
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-white/75">
                    File handled by SWK Advisory Desk · Al Saqr Business Tower, Sheikh Zayed Road
                  </span>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-[#dcb888] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] transition hover:bg-white"
                  >
                    <span>Start Your Shortlist</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Dual Counter-Scrolling Infinite Client Testimonial Streams (Zero Repeated Images Between Rows) */}
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#94652c]">
                Stream 01 · International &amp; Regional Investor Feedback
              </span>
              <span className="text-xs font-medium text-[#5f6a82]">
                Hover any review card to pause
              </span>
            </div>
            <TestimonialInfiniteMarquee
              items={testimonials.map((t) => ({
                id: t.id,
                name: t.name,
                role: t.role,
                city: t.city,
                country: t.country,
                quote: t.quote,
                image: t.image,
                rating: t.rating,
              }))}
              direction="left"
              speed="slow"
            />
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#0f2244]">
                Stream 02 · End-User Family &amp; Landlord Reviews
              </span>
            </div>
            <TestimonialInfiniteMarquee
              items={horizontalTestimonials.map((t) => ({
                id: t.id,
                name: t.name,
                role: t.role,
                city: t.city,
                country: t.country,
                quote: t.quote,
                image: t.image,
                rating: t.rating,
              }))}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
