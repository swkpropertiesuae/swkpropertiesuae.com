"use client";

import React from "react";
import Link from "next/link";

export interface NavItem {
  label: string;
  href: string;
}

export interface SunsetSkylineHeroProps {
  videoSrc?: string;
  posterSrc?: string;
  title?: string;
  subtitle?: string;
  brandMark?: string;
  navItems?: NavItem[];
  className?: string;
}

const DEFAULT_VIDEO =
  "https://cdn.21st.dev/assets/mirror/23/234bc821170e75a6b8d2e42a952078f858eb054a51fab2a5baa928a10fdc245d.mp4";

const DEFAULT_NAV: NavItem[] = [
  { label: "Buy Ready", href: "/buy" },
  { label: "Rent & Lease", href: "/rent" },
  { label: "Off-Plan Launches", href: "/off-plan" },
  { label: "Book Consultation", href: "/contact" },
];

export default function TokyoSkylineHero({
  videoSrc = DEFAULT_VIDEO,
  posterSrc = "/img/hero/dubai-skyline-hero.webp",
  title = "Where Sheikh Zayed Road Meets the Horizon.",
  subtitle = "RERA-registered real estate brokerage (ORN 51517) advising private buyers, tenants, and global investors across Dubai's defining skylines.",
  brandMark = "SWK PROPERTIES · DUBAI",
  navItems = DEFAULT_NAV,
  className = "",
}: SunsetSkylineHeroProps) {
  return (
    <section
      className={`relative min-h-[540px] w-full overflow-hidden rounded-3xl border border-[#94652c]/25 bg-[#faf7f2] text-[#0f2244] ${className}`}
    >
      <img
        src={posterSrc}
        alt="Dubai Sunset Skyline"
        className="absolute inset-0 h-full w-full object-cover opacity-65"
      />
      <video
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-screen"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/60 to-[#0b0b0c]/40" />

      <div className="relative z-10 flex min-h-[540px] flex-col justify-between p-8 md:p-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6dfd2] pb-5">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[#94652c]">
            {brandMark}
          </span>
          <nav className="flex flex-wrap items-center gap-5 text-xs uppercase tracking-[0.2em] text-[#39455a]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[#94652c]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="my-auto max-w-3xl py-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#94652c]">
            Al Saqr Business Tower · Sheikh Zayed Road
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#0f2244] leading-[1.05]">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-[#39455a] leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e6dfd2] pt-5 text-xs text-[#39455a]">
          <span>Dubai Land Department Licensed · ORN 51517</span>
          <span>Asia/Dubai (GST · UTC+4)</span>
        </div>
      </div>
    </section>
  );
}

export { TokyoSkylineHero as SunsetSkylineHero };
