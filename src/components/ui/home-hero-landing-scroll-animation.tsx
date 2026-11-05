"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimationOrderItem {
  segment: HTMLElement;
  originalIndex: number;
}

const STORYBOARD_SLIDES = [
  {
    src: "/img/projects/imtiaz/kore-by-imtiaz.webp",
    label: "Imtiaz Kore · Furnished Waterfront Luxury",
    href: "/off-plan/imtiaz-kore",
  },
  {
    src: "/img/projects/azizi/azizi-florence.webp",
    label: "Azizi Florence · Italian Lagoon Residences",
    href: "/off-plan/azizi-florence",
  },
  {
    src: "/img/projects/azizi/azizi-venice.webp",
    label: "Azizi Venice · Crystal Lagoon, Dubai South",
    href: "/off-plan/azizi-venice",
  },
  {
    src: "/img/projects/emaar/greencrest.webp",
    label: "Emaar The Oasis & Dubai Hills Estate",
    href: "/off-plan/emaar-the-oasis",
  },
  {
    src: "/img/projects/damac/damac-islands.webp",
    label: "DAMAC Islands · Tropical Lagoon Villas",
    href: "/off-plan/damac-islands",
  },
];

export const HomeHeroLandingScrollAnimation: React.FC = () => {
  const animatedIconsRef = useRef<HTMLDivElement | null>(null);
  const heroHeaderRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const iconElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textSegmentsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const placeholdersRef = useRef<(HTMLDivElement | null)[]>([]);
  const duplicateIconsRef = useRef<HTMLElement[] | null>(null);
  const textAnimationOrderRef = useRef<AnimationOrderItem[]>([]);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % STORYBOARD_SLIDES.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sectionEl = heroSectionRef.current;
    if (!sectionEl) return;

    const textSegments = textSegmentsRef.current;
    const animationOrder: AnimationOrderItem[] = [];

    textSegments.forEach((segment, index) => {
      if (segment) animationOrder.push({ segment, originalIndex: index });
    });

    textAnimationOrderRef.current = animationOrder;

    const isMobile = window.innerWidth < 768;
    const headerIconSize = isMobile ? 34 : 58;
    const currentIconSize = iconElementsRef.current[0]?.getBoundingClientRect().width || 110;
    const exactScale = headerIconSize / currentIconSize;

    // Fast, responsive scroll distance (no sluggish 4.5x viewport lock)
    const scrollDistance = isMobile ? 650 : 1000;

    const st = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.3,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const sectionRect = sectionEl.getBoundingClientRect();

        textSegments.forEach((segment) => {
          if (segment) gsap.set(segment, { opacity: 0 });
        });

        if (progress < 0.3) {
          const moveProgress = progress / 0.3;
          const containerMoveY = -window.innerHeight * 0.26 * moveProgress;

          if (progress < 0.2) {
            const headerProgress = progress / 0.2;
            gsap.set(heroHeaderRef.current, {
              y: -30 * headerProgress,
              opacity: 1 - headerProgress,
            });
          } else {
            gsap.set(heroHeaderRef.current, { y: -30, opacity: 0 });
          }

          if (duplicateIconsRef.current) {
            duplicateIconsRef.current.forEach((d) => d.parentNode?.removeChild(d));
            duplicateIconsRef.current = null;
          }

          gsap.set(animatedIconsRef.current, { x: 0, y: containerMoveY, scale: 1, opacity: 1 });

          iconElementsRef.current.forEach((icon, index) => {
            if (icon) {
              const staggerDelay = index * 0.08;
              const iconProgress = gsap.utils.mapRange(staggerDelay, staggerDelay + 0.5, 0, 1, moveProgress);
              const clamped = Math.max(0, Math.min(1, iconProgress));
              gsap.set(icon, { x: 0, y: -containerMoveY * (1 - clamped) });
            }
          });
        } else if (progress < 0.58) {
          const scaleProgress = (progress - 0.3) / 0.28;

          gsap.set(heroHeaderRef.current, { y: -30, opacity: 0 });

          if (duplicateIconsRef.current) {
            duplicateIconsRef.current.forEach((d) => d.parentNode?.removeChild(d));
            duplicateIconsRef.current = null;
          }

          const containerRect = animatedIconsRef.current!.getBoundingClientRect();
          const deltaX =
            (window.innerWidth / 2 - (containerRect.left + containerRect.width / 2)) * scaleProgress;
          const deltaY =
            (window.innerHeight / 2 - (containerRect.top + containerRect.height / 2)) * scaleProgress;

          gsap.set(animatedIconsRef.current, {
            x: deltaX,
            y: -window.innerHeight * 0.26 + deltaY,
            scale: 1 + (exactScale - 1) * scaleProgress,
            opacity: 1,
          });

          iconElementsRef.current.forEach((icon) => {
            if (icon) gsap.set(icon, { x: 0, y: 0 });
          });
        } else if (progress < 0.74) {
          const moveProgress = (progress - 0.58) / 0.16;

          gsap.set(heroHeaderRef.current, { y: -30, opacity: 0 });

          const containerRect = animatedIconsRef.current!.getBoundingClientRect();
          const deltaX = window.innerWidth / 2 - (containerRect.left + containerRect.width / 2);
          const deltaY = window.innerHeight / 2 - (containerRect.top + containerRect.height / 2);

          gsap.set(animatedIconsRef.current, {
            x: deltaX,
            y: -window.innerHeight * 0.26 + deltaY,
            scale: exactScale,
            opacity: 0,
          });

          iconElementsRef.current.forEach((icon) => {
            if (icon) gsap.set(icon, { x: 0, y: 0 });
          });

          if (!duplicateIconsRef.current) {
            duplicateIconsRef.current = [];
            iconElementsRef.current.forEach((icon) => {
              if (icon) {
                const duplicate = icon.cloneNode(true) as HTMLElement;
                duplicate.className =
                  "duplicate-icon rounded-xl overflow-hidden shadow-xl border border-[#E0C1A3]/60";
                Object.assign(duplicate.style, {
                  position: "absolute",
                  width: headerIconSize + "px",
                  height: headerIconSize + "px",
                  zIndex: "30",
                });
                sectionEl.appendChild(duplicate);
                duplicateIconsRef.current!.push(duplicate);
              }
            });
          }

          duplicateIconsRef.current?.forEach((duplicate, index) => {
            if (
              index < placeholdersRef.current.length &&
              iconElementsRef.current[index] &&
              placeholdersRef.current[index]
            ) {
              const iconRect = iconElementsRef.current[index]!.getBoundingClientRect();
              const startX = iconRect.left - sectionRect.left + iconRect.width / 2;
              const startY = iconRect.top - sectionRect.top + iconRect.height / 2;

              const targetRect = placeholdersRef.current[index]!.getBoundingClientRect();
              const targetX = targetRect.left - sectionRect.left + targetRect.width / 2;
              const targetY = targetRect.top - sectionRect.top + targetRect.height / 2;

              const moveX = targetX - startX;
              const moveY = targetY - startY;

              let currentX = 0;
              const currentY = moveProgress < 0.5 ? moveY * (moveProgress / 0.5) : moveY;
              if (moveProgress >= 0.5) currentX = moveX * ((moveProgress - 0.5) / 0.5);

              duplicate.style.left = startX + currentX - headerIconSize / 2 + "px";
              duplicate.style.top = startY + currentY - headerIconSize / 2 + "px";
              duplicate.style.opacity = "1";
              duplicate.style.display = "flex";
            }
          });
        } else {
          gsap.set(heroHeaderRef.current, { y: -50, opacity: 0 });
          gsap.set(animatedIconsRef.current, { opacity: 0 });

          duplicateIconsRef.current?.forEach((duplicate, index) => {
            if (index < placeholdersRef.current.length && placeholdersRef.current[index]) {
              const targetRect = placeholdersRef.current[index]!.getBoundingClientRect();
              const targetX = targetRect.left - sectionRect.left + targetRect.width / 2;
              const targetY = targetRect.top - sectionRect.top + targetRect.height / 2;
              duplicate.style.left = targetX - headerIconSize / 2 + "px";
              duplicate.style.top = targetY - headerIconSize / 2 + "px";
              duplicate.style.opacity = "1";
              duplicate.style.display = "flex";
            }
          });

          textAnimationOrderRef.current.forEach((item, idx) => {
            const segStart = 0.74 + idx * 0.035;
            const segProgress = gsap.utils.mapRange(segStart, segStart + 0.04, 0, 1, progress);
            gsap.set(item.segment, { opacity: Math.max(0, Math.min(1, segProgress)) });
          });
        }
      },
    });

    const refreshTimeout = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      window.clearTimeout(refreshTimeout);
      st.kill();
      duplicateIconsRef.current?.forEach((d) => d.parentNode?.removeChild(d));
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-[#041615]">
      <section
        ref={heroSectionRef}
        className="hero relative w-full h-[100dvh] min-h-[600px] px-4 md:px-6 flex flex-col items-center justify-center bg-[#041615] text-white overflow-hidden"
      >
        {/* ALWAYS-OPEN, FULL-COLOR CROSSFADING ARCHITECTURAL BACKDROP (Zero White Layer) */}
        <div className="pointer-events-none absolute inset-0 w-full h-full z-0">
          {STORYBOARD_SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000"
              style={{ opacity: i === activeSlide ? 1 : 0 }}
            >
              <img
                src={slide.src}
                alt={slide.label}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover saturate-[1.2] contrast-[1.06]"
              />
              {/* Subtle Open Contrast Vignette — Never Washes Out Colors */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(4,22,21,0.55) 0%, rgba(4,22,21,0.22) 45%, rgba(4,22,21,0.72) 100%)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Chapter 02 Storyboard Overlay Header (Fades out as icons cascade up) */}
        <div
          ref={heroHeaderRef}
          className="relative z-10 flex flex-col items-center justify-center text-center px-4 mb-24 sm:mb-32 will-change-transform"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[#E0C1A3]/50 bg-[#041615]/80 px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#E0C1A3] shadow-lg backdrop-blur-md">
            <img
              src="/brand/swk-portal-emblem.png"
              alt="SWK"
              className="h-5 w-5 object-contain"
            />
            Chapter 02 · Architectural Storyboard Across 5 Emirates
          </span>
          <h2 className="mt-4 font-hero-raleway font-light text-2xl sm:text-4xl md:text-5xl uppercase tracking-[0.12em] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.65)]">
            {STORYBOARD_SLIDES[activeSlide].label}
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {STORYBOARD_SLIDES.map((s, idx) => (
              <Link
                key={s.src}
                href={s.href}
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] transition ${
                  idx === activeSlide
                    ? "bg-[#E0C1A3] text-[#041615]"
                    : "border border-white/30 bg-[#041615]/60 text-white hover:border-[#E0C1A3]"
                }`}
              >
                {s.label.split("·")[0]}
              </Link>
            ))}
          </div>
        </div>

        {/* 5 Cascading Colorful Architectural Cards */}
        <div
          ref={animatedIconsRef}
          className="animated-icons absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-3 w-[94%] md:w-[84%] max-w-6xl will-change-transform z-20"
        >
          {STORYBOARD_SLIDES.map((slide, index) => (
            <div
              key={slide.src}
              ref={(el) => {
                iconElementsRef.current[index] = el;
              }}
              className="animated-icon relative flex-1 aspect-square will-change-transform rounded-xl sm:rounded-2xl overflow-hidden border border-[#E0C1A3]/55 bg-[#041615] shadow-2xl"
            >
              <img
                src={slide.src}
                alt={slide.label}
                decoding="async"
                className="w-full h-full object-cover saturate-[1.15]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041615]/90 via-[#041615]/40 to-transparent p-1.5 sm:p-2 text-left">
                <span className="block truncate text-[9px] sm:text-[10px] font-semibold text-white">
                  {slide.label.split("·")[0]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 4 Revealed Raleway Light (300) Hero Storyboard Headline Over Colorful Backdrop */}
        <h2 className="animated-text font-hero-raleway font-light uppercase tracking-[0.08em] relative z-20 max-w-[94vw] md:max-w-[84vw] text-center text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.75)] text-[clamp(1.2rem,3.8vw,3.3rem)] leading-[1.38] md:leading-[1.3]">
          <span
            ref={(el) => {
              textSegmentsRef.current[0] = el;
            }}
            className="text-segment opacity-0"
          >
            From Imtiaz Kore &amp; Azizi Florence
          </span>
          <div
            ref={(el) => {
              placeholdersRef.current[0] = el;
            }}
            className="placeholder-icon mx-1 sm:mx-1.5 md:-mt-1.5 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 inline-block align-middle will-change-transform invisible"
          />

          <span
            ref={(el) => {
              textSegmentsRef.current[1] = el;
            }}
            className="text-segment opacity-0"
          >
            and crystal lagoon mansions
          </span>
          <div
            ref={(el) => {
              placeholdersRef.current[1] = el;
            }}
            className="placeholder-icon mx-1 sm:mx-1.5 md:-mt-1.5 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 inline-block align-middle will-change-transform invisible"
          />

          <span
            ref={(el) => {
              textSegmentsRef.current[2] = el;
            }}
            className="text-segment opacity-0 text-[#E0C1A3]"
          >
            to island sanctuaries
          </span>
          <div
            ref={(el) => {
              placeholdersRef.current[2] = el;
            }}
            className="placeholder-icon mx-1 sm:mx-1.5 md:-mt-1.5 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 inline-block align-middle will-change-transform invisible"
          />

          <span
            ref={(el) => {
              textSegmentsRef.current[3] = el;
            }}
            className="text-segment opacity-0"
          >
            in Abu Dhabi, Sharjah
          </span>
          <div
            ref={(el) => {
              placeholdersRef.current[3] = el;
            }}
            className="placeholder-icon mx-1 sm:mx-1.5 md:-mt-1.5 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 inline-block align-middle will-change-transform invisible"
          />

          <span
            ref={(el) => {
              textSegmentsRef.current[4] = el;
            }}
            className="text-segment opacity-0"
          >
            and Ras Al Khaimah
            <div
              ref={(el) => {
                placeholdersRef.current[4] = el;
              }}
              className="placeholder-icon mx-1 sm:mx-1.5 md:-mt-1.5 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 inline-block align-middle will-change-transform invisible"
            />
            residences.
          </span>
        </h2>
      </section>
    </div>
  );
};

export default HomeHeroLandingScrollAnimation;
