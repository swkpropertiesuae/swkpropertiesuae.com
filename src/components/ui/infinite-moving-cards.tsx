"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, CheckCircle2, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfiniteTrackProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteHorizontalTrack({
  children,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: InfiniteTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    const scroller = scrollerRef.current;
    if (scroller.dataset.cloned !== "true") {
      const childrenArray = Array.from(scroller.children);
      childrenArray.forEach((item) => {
        const clone = item.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        scroller.appendChild(clone);
      });
      scroller.dataset.cloned = "true";
    }
    setReady(true);
  }, []);

  const duration = speed === "fast" ? "32s" : speed === "normal" ? "52s" : "78s";

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/marquee relative z-10 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_6%,white_94%,transparent)]",
        className
      )}
    >
      <style>{`
        @keyframes swk-marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes swk-marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .swk-animate-left {
          animation: swk-marquee-left var(--marquee-duration, 52s) linear infinite;
        }
        .swk-animate-right {
          animation: swk-marquee-right var(--marquee-duration, 52s) linear infinite;
        }
        .group\\/marquee:hover .swk-pause-on-hover {
          animation-play-state: paused;
        }
      `}</style>
      <div
        ref={scrollerRef}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-5 py-3",
          ready && (direction === "left" ? "swk-animate-left" : "swk-animate-right"),
          pauseOnHover && "swk-pause-on-hover"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export interface DeveloperMarqueeItem {
  slug: string;
  name: string;
  logo?: string;
  coverImage?: string;
  tagline: string;
  headquarters?: string;
  projectCount: number;
  flagshipAreas?: string[];
}

export function DeveloperInfiniteMarquee({
  items,
  direction = "left",
  speed = "slow",
}: {
  items: DeveloperMarqueeItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
}) {
  return (
    <InfiniteHorizontalTrack direction={direction} speed={speed} pauseOnHover>
      {items.map((dev) => (
        <Link
          key={dev.slug}
          href={`/developers/${dev.slug}`}
          className="group relative flex w-[320px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#94652c] hover:shadow-[0_20px_50px_rgba(15,34,68,0.14)]"
        >
          <div>
            {/* Project Cover Visual + Official Developer Logo Plate */}
            <div className="relative h-40 w-full overflow-hidden bg-[#0f2244]">
              {dev.coverImage && (
                <img
                  src={dev.coverImage}
                  alt={`${dev.name} flagship UAE development`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/85 via-[#0f2244]/25 to-transparent" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#0f2244]/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcb888]">
                  {dev.headquarters || "Dubai, UAE"}
                </span>
                <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0f2244] shadow-xs">
                  {dev.projectCount} Projects
                </span>
              </div>

              {/* Crisp White Developer Logo Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                <div className="flex h-11 items-center rounded-xl border border-[#e6dfd2] bg-white px-3.5 py-1.5 shadow-md">
                  {dev.logo ? (
                    <img
                      src={dev.logo}
                      alt={dev.name}
                      className="max-h-7 max-w-[130px] object-contain"
                    />
                  ) : (
                    <span className="font-serif text-sm font-bold text-[#0f2244]">
                      {dev.name}
                    </span>
                  )}
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#94652c] text-white shadow-md transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Developer Info Body */}
            <div className="p-5">
              <h3 className="font-serif text-xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                {dev.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-[#39455a] leading-relaxed">
                {dev.tagline}
              </p>
              {dev.flagshipAreas && dev.flagshipAreas.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dev.flagshipAreas.slice(0, 2).map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-2.5 py-0.5 text-[10px] font-medium text-[#39455a]"
                    >
                      <MapPin className="h-2.5 w-2.5 text-[#94652c]" />
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#e6dfd2] bg-[#faf7f2] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f2244] group-hover:text-[#94652c]">
            <span>Inspect Master Profile</span>
            <span>→</span>
          </div>
        </Link>
      ))}
    </InfiniteHorizontalTrack>
  );
}

export interface ProjectMarqueeItem {
  slug: string;
  name: string;
  developer: string;
  developerSlug: string;
  developerLogo?: string;
  community: string;
  collection: string;
  image: string;
  summary: string;
}

export function ProjectInfiniteMarquee({
  items,
  direction = "right",
  speed = "slow",
}: {
  items: ProjectMarqueeItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
}) {
  return (
    <InfiniteHorizontalTrack direction={direction} speed={speed} pauseOnHover>
      {items.map((proj) => (
        <Link
          key={proj.slug}
          href={`/off-plan/${proj.slug}`}
          className="group relative flex w-[350px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#94652c] hover:shadow-[0_20px_50px_rgba(15,34,68,0.14)]"
        >
          <div>
            <div className="relative h-48 w-full overflow-hidden bg-[#0f2244]">
              <img
                src={proj.image}
                alt={`${proj.name} by ${proj.developer}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/85 via-transparent to-black/25" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#0f2244]/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#dcb888]">
                  {proj.collection}
                </span>
                <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0f2244] shadow-xs">
                  DLD Escrow Verified
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white">
                  <MapPin className="h-3 w-3 text-[#dcb888]" />
                  {proj.community}
                </span>
                {proj.developerLogo && (
                  <div className="rounded-lg bg-white px-2.5 py-1 shadow-sm">
                    <img
                      src={proj.developerLogo}
                      alt={proj.developer}
                      className="h-4 w-16 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#94652c]">
                <Building2 className="h-3.5 w-3.5" />
                <span>{proj.developer}</span>
              </div>
              <h3 className="mt-1 truncate font-serif text-xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                {proj.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs text-[#39455a] leading-relaxed">
                {proj.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#e6dfd2] bg-[#faf7f2] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0f2244] group-hover:text-[#94652c]">
            <span>Payment Plan & Brochure</span>
            <span>→</span>
          </div>
        </Link>
      ))}
    </InfiniteHorizontalTrack>
  );
}

export interface TestimonialMarqueeItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  city: string;
  country: string;
  image: string;
  rating?: number;
}

export function TestimonialInfiniteMarquee({
  items,
  direction = "left",
  speed = "normal",
}: {
  items: TestimonialMarqueeItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
}) {
  return (
    <InfiniteHorizontalTrack direction={direction} speed={speed} pauseOnHover>
      {items.map((client) => (
        <div
          key={client.id}
          className="flex w-[370px] shrink-0 flex-col justify-between rounded-3xl border border-[#e6dfd2] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#94652c] hover:shadow-md"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-0.5 text-[#b07a38]">
                {Array.from({ length: client.rating ?? 5 }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#94652c]">
                {client.city}
              </span>
            </div>
            <p className="mt-4 text-sm text-[#39455a] leading-relaxed">
              &ldquo;{client.quote}&rdquo;
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3.5 border-t border-[#e6dfd2] pt-4">
            <img
              src={client.image}
              alt={client.name}
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#c99a63]/50"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="truncate font-serif text-base font-semibold text-[#0f2244]">
                  {client.name}
                </h4>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              </div>
              <p className="truncate text-xs text-[#5f6a82]">
                {client.role} · {client.city}
              </p>
            </div>
          </div>
        </div>
      ))}
    </InfiniteHorizontalTrack>
  );
}
