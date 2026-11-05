"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck, Sparkles } from "lucide-react";

export interface LivelyPageHeroHighlight {
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  href?: string;
}

export interface LivelyPageHeroSideImage {
  src: string;
  label: string;
  sublabel: string;
  href?: string;
}

export interface LivelyPageHeroProps {
  eyebrow?: string;
  badge?: string;
  title: string;
  accentText?: string;
  highlight?: string;
  description: string;
  backgroundImage: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  highlights?: LivelyPageHeroHighlight[];
  sideImages?: LivelyPageHeroSideImage[];
}

const DEFAULT_HIGHLIGHTS: LivelyPageHeroHighlight[] = [
  {
    title: "Azizi Venice & Florence",
    subtitle: "Dubai South & Al Furjan Lagoon Masterplans",
    tag: "50/50 Payment Plan",
    image: "/img/hero/slides/04-azizi-venice-thumb.webp",
    href: "/off-plan/azizi-venice",
  },
  {
    title: "Imtiaz Kore & Sobha One",
    subtitle: "Waterfront & Sky Infinity Residences",
    tag: "60/40 Payment Plan",
    image: "/img/hero/slides/02-imtiaz-kore-thumb.webp",
    href: "/off-plan/imtiaz-kore",
  },
  {
    title: "DAMAC Islands & Emaar Oasis",
    subtitle: "Tropical Lagoon Villas & Canal Mansions",
    tag: "75/25 & 80/20 Plans",
    image: "/img/hero/slides/06-damac-islands-thumb.webp",
    href: "/off-plan/damac-islands",
  },
];

export function LivelyPageHero({
  eyebrow,
  badge,
  title,
  accentText,
  highlight,
  description,
  backgroundImage,
  primaryCta,
  secondaryCta,
  highlights,
  sideImages,
}: LivelyPageHeroProps) {
  const resolvedEyebrow = eyebrow || badge || "SWK Properties · Sheikh Zayed Road";
  const resolvedAccent = accentText || highlight;
  const resolvedHighlights: LivelyPageHeroHighlight[] =
    highlights ||
    (sideImages && sideImages.length > 0
      ? [
          ...sideImages.map((s) => ({
            title: s.label,
            subtitle: s.sublabel,
            tag: "Verified",
            image: s.src,
            href: s.href ?? "/off-plan",
          })),
          DEFAULT_HIGHLIGHTS[0],
        ]
      : DEFAULT_HIGHLIGHTS);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden border-b border-[#e6dfd2] bg-[#0b1528] py-14 sm:py-18 md:py-22 text-white"
    >
      {/* 1. Crystal-Clear Ken Burns Full-Color Architectural Backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={backgroundImage}
          alt={title}
          loading="eager"
          decoding="sync"
          onError={(e) => {
            const target = e.currentTarget;
            const fallback = "/img/hero/slides/01-dubai-horizon-desktop.webp";
            if (!target.src.endsWith(fallback)) {
              target.src = fallback;
            }
          }}
          className="h-full w-full object-cover object-center brightness-[1.05] contrast-[1.04] transition-transform duration-1000 ease-out"
        />
        {/* Balanced High-Clarity Architectural Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,18,36,0.72) 0%, rgba(8,18,36,0.44) 54%, rgba(8,18,36,0.18) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,18,36,0.34) 0%, rgba(8,18,36,0.06) 45%, rgba(8,18,36,0.58) 100%)",
          }}
        />
        {/* Interactive Natural-Light Spotlight & Sunlight Sweep */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(60% 50% at 62% 16%, rgba(255,250,236,0.24) 0%, rgba(255,255,255,0.07) 45%, transparent 75%), radial-gradient(500px circle at var(--spot-x, 50%) var(--spot-y, 30%), rgba(255,252,240,0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* 2. High-Contrast Highlighted Foreground Stage */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Column: Highlighted Editorial Spotlight Panel */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onPointerMove={handlePointerMove}
            style={{
              backgroundImage:
                "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 15%), rgba(255,251,238,0.22) 0%, rgba(255,255,255,0.05) 48%, transparent 80%), linear-gradient(160deg, rgba(14,30,60,0.88) 0%, rgba(11,21,40,0.92) 100%)",
            }}
            className="lg:col-span-7 rounded-3xl border border-white/40 p-6 sm:p-8 md:p-9 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.44),inset_0_1.5px_0_rgba(255,255,255,0.5)] transition-all duration-300 hover:border-white/60 space-y-5"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/45 bg-[radial-gradient(120%_140%_at_50%_0%,rgba(255,252,240,0.25)_0%,rgba(15,34,68,0.95)_70%)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.4)]">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>{resolvedEyebrow}</span>
            </div>

            <h1 className="font-hero-raleway font-light text-2xl sm:text-4xl md:text-5xl uppercase tracking-[0.07em] text-white leading-[1.18]">
              <span className="block drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {title}
              </span>
              {resolvedAccent && (
                <span className="mt-2 inline-block rounded-2xl border border-white/45 bg-[radial-gradient(130%_150%_at_30%_0%,rgba(255,252,240,0.26)_0%,rgba(25,59,115,0.96)_50%,rgba(15,34,68,0.98)_100%)] px-4 py-1.5 font-bold tracking-[0.06em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  {resolvedAccent}
                </span>
              )}
            </h1>

            <p className="max-w-2xl text-sm md:text-base text-white/95 font-normal leading-relaxed">
              {description}
            </p>

            {/* Highlighted Live KPI Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                "18+ Years UAE Experience",
                "27+ Master Developers",
                "108+ Verified Projects",
                "25+ Professionals",
              ].map((kpi) => (
                <span
                  key={kpi}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/14 px-3.5 py-1 text-[11px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/65 hover:bg-white/22"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                  {kpi}
                </span>
              ))}
            </div>

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/50 bg-[radial-gradient(120%_150%_at_50%_0%,rgba(255,252,240,0.28)_0%,rgba(15,34,68,0.98)_65%)] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-white hover:shadow-[0_16px_34px_rgba(0,0,0,0.45),0_0_24px_rgba(255,252,240,0.28)]"
                  >
                    <span>{primaryCta.label}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#f4efe6] hover:shadow-[0_16px_34px_rgba(0,0,0,0.38),0_0_24px_rgba(255,255,255,0.35)]"
                  >
                    <span>{secondaryCta.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </motion.div>

          {/* Right Column: Animated Floating Architectural Showcase Cards with Natural-Light Spotlight */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              onPointerMove={handlePointerMove}
              style={{
                backgroundImage:
                  "radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 12%), rgba(255,251,238,0.24) 0%, rgba(255,255,255,0.06) 48%, transparent 80%), linear-gradient(165deg, rgba(20,45,88,0.92) 0%, rgba(12,26,54,0.95) 100%)",
              }}
              className="rounded-3xl border border-white/42 p-5 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.48),inset_0_1.5px_0_rgba(255,255,255,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-white/68"
            >
              <div className="mb-3.5 flex items-center justify-between border-b border-white/20 pb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  <MapPin className="h-3.5 w-3.5 text-white" />
                  Priority UAE Allocations
                </span>
                <span className="rounded-full border border-white/30 bg-white/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Live Desk
                </span>
              </div>

              <div className="space-y-3">
                {resolvedHighlights.map((item, idx) => (
                  <motion.div
                    key={item.title + idx}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.18 + idx * 0.08 }}
                    whileHover={{ x: 4 }}
                  >
                    <Link
                      href={item.href ?? "/off-plan"}
                      className="group flex items-center gap-3.5 rounded-2xl border border-white/20 bg-white/12 p-3 transition hover:border-white/50 hover:bg-white/20"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="eager"
                        decoding="sync"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback = "/img/hero/slides/01-dubai-horizon-thumb.webp";
                          if (!target.src.endsWith(fallback)) {
                            target.src = fallback;
                          }
                        }}
                        className="h-14 w-16 shrink-0 rounded-xl object-cover border border-white/30"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-serif text-base font-bold text-white">
                            {item.title}
                          </p>
                          <span className="shrink-0 rounded-full bg-[#0f2244] border border-white/35 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white">
                            {item.tag}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs font-medium text-white/90">
                          {item.subtitle}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
