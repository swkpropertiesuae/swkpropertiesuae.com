"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface StorySlide {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  textColor: string;
  badge?: string;
  href?: string;
}

const defaultSlidesData: StorySlide[] = [
  {
    badge: "01 · OFF-PLAN ADVISORY",
    title: "Escrow-Verified Off-Plan Launches",
    description:
      "Compare construction-linked payment plans (60/40, 70/30, 80/20), DLD Oqood registration fees, and developer delivery track records across Emaar, DAMAC, Sobha, Nakheel, Omniyat, and Aldar.",
    image: "/img/communities/downtown-dubai.webp",
    bgColor: "#111014",
    textColor: "#f4ecd8",
    href: "/off-plan",
  },
  {
    badge: "02 · SECONDARY BROKERAGE",
    title: "Ready Sales & RERA Form F Transfers",
    description:
      "Every secondary listing is verified against Dubai Land Department Trakheesi permits and recent comparable transfers. We coordinate valuation, mortgage pre-approval, NOC, and DLD Trustee transfer.",
    image: "/img/communities/palm-jumeirah.webp",
    bgColor: "#15130f",
    textColor: "#f4ecd8",
    href: "/buy",
  },
  {
    badge: "03 · RESIDENTIAL & EXECUTIVE LEASING",
    title: "Yearly & Flexible Leasing with Ejari",
    description:
      "Whether relocating to Dubai or leasing out an investment apartment, we manage tenant screening, RERA-compliant tenancy contracts, security deposits, Ejari registration, and DEWA activation.",
    image: "/img/communities/dubai-marina.webp",
    bgColor: "#0e1412",
    textColor: "#f4ecd8",
    href: "/rent",
  },
  {
    badge: "04 · LANDLORD & PORTFOLIO MANAGEMENT",
    title: "Hands-Free Asset & Snagging Supervision",
    description:
      "Dedicated representation for overseas and UAE-based landlords: pre-handover snagging inspections, rent collection, RERA Rental Index renewals, maintenance supervision, and annual yield statements.",
    image: "/img/communities/dubai-hills-estate.webp",
    bgColor: "#141112",
    textColor: "#f4ecd8",
    href: "/services/property-management",
  },
];

export function ScrollingFeatureShowcase({
  slides = defaultSlidesData,
}: {
  slides?: StorySlide[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = slides[activeIndex] ?? slides[0];

  const dynamicStyles: React.CSSProperties = {
    backgroundColor: current.bgColor,
    color: current.textColor,
    transition: "background-color 0.6s ease, color 0.6s ease",
  };

  const gridPatternStyle: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(to right, rgba(230, 207, 156, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(230, 207, 156, 0.08) 1px, transparent 1px)
    `,
    backgroundSize: "3.5rem 3.5rem",
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-[#e6dfd2]"
      style={dynamicStyles}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[540px] w-full max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="relative flex flex-col justify-between p-8 md:p-14 border-b lg:border-b-0 lg:border-r border-[#e6dfd2]">
          {/* Step selector pills */}
          <div className="flex flex-wrap items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] transition-all ${
                  index === activeIndex
                    ? "bg-[#0f2244] text-white"
                    : "border border-[#e6dfd2] bg-[#faf7f2] text-[#39455a] hover:border-[#94652c]/35"
                }`}
              >
                0{index + 1}
              </button>
            ))}
          </div>

          <div className="my-10">
            {current.badge && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
                {current.badge}
              </p>
            )}
            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-tight text-[#0f2244]">
              {current.title}
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed text-[#39455a] max-w-xl">
              {current.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={current.href || "/contact"}
              className="rounded-full bg-[#0f2244] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#d6bc82]"
            >
              Explore Service Details
            </Link>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
              className="rounded-full border border-[#e6dfd2] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f2244] transition hover:border-[#94652c]"
            >
              Next Pillar →
            </button>
          </div>
        </div>

        {/* Right Column: Image Content with Grid Background */}
        <div className="flex items-center justify-center p-6 md:p-12" style={gridPatternStyle}>
          <div className="relative w-full max-w-md h-[360px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-[#94652c]/30">
            <div
              className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateY(-${activeIndex * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
