// src/components/ui/cinematic-landing-hero.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .text-open-white {
      color: #FFFFFF;
      text-shadow: 0 8px 28px rgba(0, 0, 0, 0.55), 0 2px 6px rgba(0, 0, 0, 0.45);
  }

  .text-champagne-gold {
      background: linear-gradient(180deg, #FFF3E2 0%, #E0C1A3 48%, #B68F70 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: drop-shadow(0px 6px 18px rgba(0, 0, 0, 0.55));
  }

  .premium-open-card {
      background: linear-gradient(145deg, rgba(4, 22, 21, 0.78) 0%, rgba(15, 34, 68, 0.82) 100%);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 
          0 32px 80px -16px rgba(0, 0, 0, 0.65),
          inset 0 1px 2px rgba(224, 193, 163, 0.35);
      border: 1px solid rgba(224, 193, 163, 0.28);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(700px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(224,193,163,0.12) 0%, transparent 45%);
      mix-blend-mode: screen;
  }

  .iphone-bezel {
      background-color: #0b131e;
      box-shadow: 
          inset 0 0 0 2px #B68F70, 
          inset 0 0 0 6px #041615, 
          0 30px 60px -12px rgba(0,0,0,0.75);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #E0C1A3 0%, #6F513B 100%);
  }
  
  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%);
      border: 1px solid rgba(224,193,163,0.24);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(4, 22, 21, 0.88) 0%, rgba(15, 34, 68, 0.92) 100%);
      backdrop-filter: blur(16px); 
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 
          0 0 0 1px rgba(224, 193, 163, 0.35),
          0 20px 40px -10px rgba(0, 0, 0, 0.65);
  }

  .btn-gold-cta {
      background: linear-gradient(180deg, #E0C1A3 0%, #B68F70 100%);
      color: #041615;
      box-shadow: 0 10px 25px -4px rgba(182, 143, 112, 0.45);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .btn-gold-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px -4px rgba(224, 193, 163, 0.6);
  }

  .btn-glass-cta {
      background: rgba(4, 22, 21, 0.65);
      color: #FFFFFF;
      border: 1px solid rgba(224, 193, 163, 0.45);
      backdrop-filter: blur(12px);
      transition: transform 0.25s ease, background 0.25s ease;
  }
  .btn-glass-cta:hover {
      transform: translateY(-2px);
      background: rgba(4, 22, 21, 0.85);
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export function CinematicHero({
  brandName = "SWK",
  tagline1 = "CURATING ICONIC ADDRESSES",
  tagline2 = "ACROSS DUBAI & THE UAE",
  cardHeading = "18+ Years of UAE Market Experience.",
  cardDescription = (
    <>
      <span className="text-[#E0C1A3] font-semibold">SWK Properties</span> connects private buyers, family offices, and global investors with{" "}
      <span className="text-white font-semibold">108+ verified projects</span> across{" "}
      <span className="text-white font-semibold">27+ premier developers</span> — featuring priority allocations in{" "}
      <span className="text-[#E0C1A3] font-semibold">Imtiaz Kore</span>,{" "}
      <span className="text-[#E0C1A3] font-semibold">Azizi Florence</span>,{" "}
      <span className="text-white font-semibold">Azizi Venice</span>, and{" "}
      <span className="text-white font-semibold">Emaar The Oasis</span>.
    </>
  ),
  metricValue = 108,
  metricLabel = "Verified Projects",
  ctaHeading = "YOUR UAE PORTFOLIO STARTS HERE",
  ctaDescription =
    "Explore priority allocations in Imtiaz Kore, Azizi Florence, Azizi Venice, Emaar The Oasis, DAMAC Islands, and Sobha Century—or scroll into Chapter 02 of our architectural storyboard.",
  className,
  ...props
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 1.6) return;
      cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 10,
            rotationX: -yVal * 10,
            ease: "power2.out",
            duration: 0.6,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 28, scale: 0.96 });
      gsap.set(".text-days", { autoAlpha: 0, y: 20 });
      gsap.set(".main-card", { y: window.innerHeight * 0.92, autoAlpha: 1 });
      gsap.set(
        [".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"],
        { autoAlpha: 0 }
      );
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.94 });

      // Fast, immediate entrance without heavy blur filters
      const introTl = gsap.timeline({ delay: 0.08 });
      introTl
        .to(".text-track", {
          duration: 0.75,
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: "power3.out",
        })
        .to(
          ".text-days",
          {
            duration: 0.65,
            autoAlpha: 1,
            y: 0,
            ease: "power3.out",
          },
          "-=0.45"
        );

      // Fast, responsive scroll timeline (no multi-thousand-pixel lag)
      const scrollDistance = isMobile ? 650 : 1050;
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(
          ".hero-text-wrapper",
          {
            scale: 1.05,
            autoAlpha: 0,
            y: -40,
            ease: "power2.inOut",
            duration: 1.0,
          },
          0
        )
        .to(".main-card", { y: 0, ease: "power2.out", duration: 1.0 }, 0)
        .fromTo(
          ".mockup-scroll-wrapper",
          { y: 80, autoAlpha: 0, scale: 0.88 },
          { y: 0, autoAlpha: 1, scale: 1, ease: "power3.out", duration: 0.9 },
          0.35
        )
        .fromTo(
          ".phone-widget",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.08, ease: "power2.out", duration: 0.6 },
          0.5
        )
        .to(".progress-ring", { strokeDashoffset: 52, duration: 0.8, ease: "power2.out" }, 0.55)
        .to(
          ".counter-val",
          { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 0.8, ease: "power2.out" },
          0.55
        )
        .fromTo(
          ".floating-badge",
          { y: 24, autoAlpha: 0, scale: 0.9 },
          { y: 0, autoAlpha: 1, scale: 1, ease: "back.out(1.3)", duration: 0.6, stagger: 0.1 },
          0.6
        )
        .fromTo(
          [".card-left-text", ".card-right-text"],
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: "power2.out", duration: 0.65, stagger: 0.08 },
          0.55
        )
        .to({}, { duration: 0.55 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to(".main-card", { y: -window.innerHeight * 1.05, autoAlpha: 0, ease: "power2.in", duration: 0.85 }, "pullback")
        .to(".cta-wrapper", { scale: 1, autoAlpha: 1, ease: "power2.out", duration: 0.7 }, "pullback");
    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-[100dvh] min-h-[640px] overflow-hidden flex items-center justify-center bg-[#041615] text-white font-sans antialiased",
        className
      )}
      style={{ perspective: "1400px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />

      {/* OPEN, COLORFUL FULL-BLEED UAE SKYLINE & WATERFRONT PHOTOGRAPHY (Zero White Layer) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/img/projects/azizi/azizi-venice.webp"
          alt="Dubai Waterfront & Lagoon Architecture"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover saturate-[1.22] contrast-[1.06] scale-[1.02]"
        />
        {/* Open Cinematic Contrast Vignette — Preserves Full Color & Brightness */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,22,21,0.58) 0%, rgba(15,34,68,0.24) 48%, rgba(4,22,21,0.72) 100%)",
          }}
        />
      </div>

      {/* LAYER 1: Hero Titles in Raleway Light (300) Over Open Colorful Waterfront */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-full max-w-6xl px-4 will-change-transform">
        <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#E0C1A3]/55 bg-[#041615]/75 px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E0C1A3] shadow-lg backdrop-blur-md">
          <img
            src="/brand/swk-portal-emblem.png"
            alt="SWK Portal Arch Emblem"
            className="h-6 w-6 object-contain"
          />
          <span>SWK Properties · Sheikh Zayed Road, Dubai</span>
        </div>

        <h1 className="text-track gsap-reveal font-hero-raleway font-light text-open-white text-2xl sm:text-5xl md:text-6xl lg:text-[4.3rem] tracking-[0.12em] uppercase leading-[1.15] mb-2 sm:mb-3">
          {tagline1}
        </h1>
        <h2 className="text-days gsap-reveal font-hero-raleway font-light text-champagne-gold text-2xl sm:text-5xl md:text-6xl lg:text-[4.3rem] tracking-[0.12em] uppercase leading-[1.15]">
          {tagline2}
        </h2>

        <p className="mt-4 sm:mt-5 max-w-2xl text-xs sm:text-sm md:text-base text-white/95 font-light tracking-wide drop-shadow">
          Priority VIP allocations in <strong className="font-semibold text-[#E0C1A3]">Imtiaz Kore</strong>,{" "}
          <strong className="font-semibold text-[#E0C1A3]">Azizi Florence</strong>,{" "}
          <strong className="font-semibold text-white">Azizi Venice</strong>,{" "}
          <strong className="font-semibold text-white">Emaar The Oasis</strong> &amp;{" "}
          <strong className="font-semibold text-white">DAMAC Islands</strong>.
        </p>

        {/* Instant Action Pills on First View */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/off-plan/imtiaz-kore"
            className="btn-gold-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em]"
          >
            <span>🔥 Imtiaz Kore VIP Launch</span>
          </Link>
          <Link
            href="/off-plan/azizi-florence"
            className="btn-glass-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em]"
          >
            <span>⚡ Azizi Florence Waterfront</span>
          </Link>
          <Link
            href="/properties"
            className="btn-glass-cta hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em]"
          >
            <span>Browse All 108+ Projects</span>
          </Link>
        </div>
      </div>

      {/* LAYER 2: Pullback Reveal in Raleway Light (300) Over Open Colorful Background */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl px-4 gsap-reveal pointer-events-auto will-change-transform">
        <img
          src="/brand/swk-emblem-wordmark.png"
          alt="SWK Properties Emblem"
          className="mb-4 h-16 sm:h-20 w-auto object-contain drop-shadow-xl"
        />
        <h2 className="font-hero-raleway font-light text-2xl sm:text-5xl lg:text-6xl mb-4 tracking-[0.12em] uppercase text-open-white">
          {ctaHeading}
        </h2>
        <p className="text-white/90 text-sm sm:text-base md:text-lg mb-7 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto px-4 sm:px-0">
          <Link
            href="/off-plan"
            className="btn-gold-cta flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-[0.18em]"
          >
            <span>Explore 108+ Verified Projects</span>
          </Link>
          <Link
            href="/contact"
            className="btn-glass-cta flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-[0.18em]"
          >
            <span>Book Private Consultation</span>
          </Link>
        </div>
      </div>

      {/* FOREGROUND LAYER: Translucent Glassmorphic Architectural Showcase Card */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-3 sm:px-6"
        style={{ perspective: "1400px" }}
      >
        <div
          ref={mainCardRef}
          className="main-card premium-open-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[95vw] md:w-[88vw] max-w-7xl h-[84dvh] md:h-[82dvh] rounded-[28px] md:rounded-[36px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative w-full h-full mx-auto px-4 lg:px-10 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-4 lg:py-0">
            {/* RIGHT ON DESKTOP: Official 3D Rose-Gold Brand Lockup */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex flex-col items-center lg:items-end justify-center z-20 w-full">
              <img
                src="/brand/swk-horizontal-lockup.png"
                alt="SWK Properties Horizontal Portal Lockup"
                className="h-14 sm:h-16 md:h-20 w-auto object-contain mb-2 drop-shadow-lg"
              />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#E0C1A3] font-semibold">
                {brandName} · Dubai &amp; UAE Advisory
              </span>
            </div>

            {/* CENTER: Interactive 3D Architectural Portal Showcase */}
            <div
              className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[310px] sm:h-[370px] lg:h-[560px] flex items-center justify-center z-10"
              style={{ perspective: "1000px" }}
            >
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.58] sm:scale-[0.72] md:scale-85 lg:scale-95">
                <div
                  ref={mockupRef}
                  className="relative w-[290px] h-[560px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                  <div className="absolute inset-[7px] bg-[#041615] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] text-white z-10">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-black rounded-full z-50 flex items-center justify-end px-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <div className="relative w-full h-full pt-10 px-4 pb-5 flex flex-col justify-between">
                      <div className="phone-widget flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-[#E0C1A3] uppercase tracking-[0.22em] font-bold">
                            Hot UAE Releases
                          </span>
                          <span className="font-hero-raleway font-light text-base tracking-[0.1em] uppercase text-white">
                            Priority Desk
                          </span>
                        </div>
                        <img
                          src="/brand/swk-portal-emblem.png"
                          alt="SWK"
                          className="h-8 w-8 object-contain"
                        />
                      </div>

                      {/* Animated Ring Counter: 108+ Verified Projects */}
                      <div className="phone-widget relative w-36 h-36 mx-auto flex items-center justify-center my-1">
                        <svg className="absolute inset-0 w-full h-full" aria-hidden="true" viewBox="0 0 176 176">
                          <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                          <circle className="progress-ring" cx="88" cy="88" r="64" fill="none" stroke="#E0C1A3" strokeWidth="10" />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center">
                          <div className="flex items-baseline">
                            <span className="counter-val font-hero-raleway font-light text-3xl tracking-tight text-white">
                              0
                            </span>
                            <span className="text-lg text-[#E0C1A3] font-light">+</span>
                          </div>
                          <span className="text-[8px] text-[#E0C1A3] uppercase tracking-[0.18em] font-bold mt-0.5">
                            {metricLabel}
                          </span>
                        </div>
                      </div>

                      {/* Real Priority Project Cards Inside Device (Featuring Imtiaz Kore & Azizi Florence) */}
                      <div className="space-y-2">
                        <div className="phone-widget widget-depth rounded-2xl p-2 flex items-center gap-2.5">
                          <img
                            src="/img/projects/imtiaz/kore-by-imtiaz.webp"
                            alt="Imtiaz Kore"
                            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#E0C1A3]/40"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-white truncate">Imtiaz Kore · VIP Drop</p>
                            <p className="text-[9px] text-[#E0C1A3] uppercase tracking-wider">Fully Furnished · 60/40 Plan</p>
                          </div>
                        </div>

                        <div className="phone-widget widget-depth rounded-2xl p-2 flex items-center gap-2.5">
                          <img
                            src="/img/projects/azizi/azizi-florence.webp"
                            alt="Azizi Florence"
                            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#E0C1A3]/40"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-white truncate">Azizi Florence · Lagoon</p>
                            <p className="text-[9px] text-[#E0C1A3] uppercase tracking-wider">Italian Waterfront · 50/50 Plan</p>
                          </div>
                        </div>

                        <div className="phone-widget widget-depth rounded-2xl p-2 flex items-center gap-2.5">
                          <img
                            src="/img/projects/emaar/greencrest.webp"
                            alt="Emaar The Oasis"
                            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#E0C1A3]/40"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-white truncate">Emaar The Oasis</p>
                            <p className="text-[9px] text-[#E0C1A3] uppercase tracking-wider">Lagoon Mansions · 80/20</p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[90px] h-[3px] mx-auto bg-white/25 rounded-full mt-1" />
                    </div>
                  </div>
                </div>

                {/* Floating Glass Badges */}
                <div className="floating-badge absolute flex top-4 lg:top-10 left-[-10px] lg:left-[-85px] floating-ui-badge rounded-xl lg:rounded-2xl p-2.5 lg:p-3.5 items-center gap-2.5 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#E0C1A3]/20 flex items-center justify-center border border-[#E0C1A3]/45 text-[#E0C1A3] font-bold text-xs">
                    18+
                  </div>
                  <div>
                    <p className="text-white text-[11px] lg:text-xs font-bold tracking-tight">18+ Years Experience</p>
                    <p className="text-[#E0C1A3] text-[9px] lg:text-[11px] font-medium">Sheikh Zayed Road Advisory</p>
                  </div>
                </div>

                <div className="floating-badge absolute flex bottom-8 lg:bottom-16 right-[-10px] lg:right-[-85px] floating-ui-badge rounded-xl lg:rounded-2xl p-2.5 lg:p-3.5 items-center gap-2.5 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#E0C1A3]/20 flex items-center justify-center border border-[#E0C1A3]/45 text-[#E0C1A3] font-bold text-xs">
                    27+
                  </div>
                  <div>
                    <p className="text-white text-[11px] lg:text-xs font-bold tracking-tight">27+ Master Developers</p>
                    <p className="text-[#E0C1A3] text-[9px] lg:text-[11px] font-medium">Dubai, Abu Dhabi, RAK &amp; UAQ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT ON DESKTOP: Editorial Storyboard Text */}
            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full px-2 lg:px-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#E0C1A3] mb-1.5">
                Chapter 01 · The SWK Mandate
              </span>
              <h3 className="font-hero-raleway font-light text-white text-xl sm:text-2xl lg:text-4xl mb-1 lg:mb-3 tracking-[0.06em] uppercase leading-snug">
                {cardHeading}
              </h3>
              <p className="hidden sm:block text-white/90 text-xs md:text-sm lg:text-base font-light leading-relaxed mx-auto lg:mx-0 max-w-md lg:max-w-none">
                {cardDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CinematicHero;
