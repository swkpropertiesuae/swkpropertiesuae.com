"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Target,
  Crown,
  Star,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { developers } from "@/lib/developers";

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="font-serif text-2xl font-bold text-[#0f2244] sm:text-3xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-[#5f6a82] font-bold sm:text-xs">
      {label}
    </span>
  </div>
);

export default function GlassmorphismTrustHero({
  badge = "RERA Registered Brokerage · ORN 51517",
  titleLine1 = "Verified Dubai",
  titleHighlight = "Real Estate",
  titleLine2 = "Advisory",
  description = "From escrow-protected off-plan launches to Trakheesi-permitted ready homes and Ejari-registered leasing, SWK Properties represents your mandate from Sheikh Zayed Road.",
  primaryLabel = "Search Verified Listings",
  primaryHref = "/properties",
  secondaryLabel = "Verify Credentials & Team",
  secondaryHref = "/about",
}: {
  badge?: string;
  titleLine1?: string;
  titleHighlight?: string;
  titleLine2?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  const logoPartners = developers.filter((d) => d.logo);

  return (
    <div className="relative w-full rounded-3xl border border-[#e6dfd2] bg-white text-[#0f2244] overflow-hidden font-sans shadow-[0_24px_60px_rgba(15,34,68,0.08)]">
      <style>{`
        @keyframes swkFadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes swkMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .swk-animate-fade-in {
          animation: swkFadeSlideIn 0.7s ease-out forwards;
        }
        .swk-animate-marquee {
          animation: swkMarquee 38s linear infinite;
        }
      `}</style>

      <div
        className="absolute inset-0 z-0 bg-[url(/img/hero/dubai-skyline-hero.webp)] bg-cover bg-center opacity-[0.08]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:py-18 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="swk-animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/30 bg-[#f6ead7] px-4 py-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#94652c] flex items-center gap-2">
                  {badge}
                  <Star className="w-3.5 h-3.5 text-[#94652c] fill-[#94652c]" />
                </span>
              </div>
            </div>

            <h2 className="swk-animate-fade-in font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0f2244] leading-[1.04]">
              {titleLine1}{" "}
              <span className="text-[#94652c] italic">
                {titleHighlight}
              </span>{" "}
              {titleLine2}
            </h2>

            <p className="swk-animate-fade-in max-w-xl text-base md:text-lg text-[#39455a] leading-relaxed">
              {description}
            </p>

            <div className="swk-animate-fade-in flex flex-col sm:flex-row gap-3.5">
              <Link
                href={primaryHref}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0f2244] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-bold text-white transition-all hover:bg-[#94652c]"
              >
                {primaryLabel}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={secondaryHref}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-bold text-[#0f2244] transition-colors hover:border-[#94652c]"
              >
                <FileCheck2 className="w-4 h-4 text-[#94652c]" />
                {secondaryLabel}
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-5">
            <div className="swk-animate-fade-in relative overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#faf7f2] p-7 shadow-sm">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f2244] text-white">
                    <Target className="h-6 w-6 text-[#dcb888]" />
                  </div>
                  <div>
                    <div className="text-2xl font-serif font-bold tracking-tight text-[#0f2244]">
                      ORN 51517
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#94652c]">
                      Dubai Land Department & RERA Licensed
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-[#39455a]">Permit & Escrow Verification</span>
                    <span className="text-[#94652c]">100% Mandatory</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#e6dfd2]">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-[#0f2244] via-[#1b3a6b] to-[#94652c]" />
                  </div>
                </div>

                <div className="h-px w-full bg-[#e6dfd2] mb-5" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatItem value="20+" label="UAE Developers" />
                  <StatItem value="108" label="Projects" />
                  <StatItem value="8" label="Core Districts" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    TRAKHEESI VERIFIED
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#94652c]/30 bg-[#f6ead7] px-3 py-1 text-[10px] font-bold tracking-wider text-[#94652c]">
                    <Crown className="w-3 h-3" />
                    AL SAQR BUSINESS TOWER
                  </div>
                </div>
              </div>
            </div>

            <div className="swk-animate-fade-in relative overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#faf7f2] py-5">
              <h3 className="mb-3 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#94652c]">
                Official UAE Developer Coverage
              </h3>

              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                }}
              >
                <div className="swk-animate-marquee flex items-center gap-6 whitespace-nowrap px-4">
                  {[...logoPartners, ...logoPartners].map((dev, i) => (
                    <Link
                      key={`${dev.slug}-${i}`}
                      href={`/developers/${dev.slug}`}
                      className="flex h-11 items-center gap-2.5 rounded-xl border border-[#e6dfd2] bg-white px-4 py-2 shadow-2xs transition hover:border-[#94652c]"
                    >
                      {dev.logo ? (
                        <img
                          src={dev.logo}
                          alt={dev.name}
                          className="h-5 w-auto max-w-[90px] object-contain"
                        />
                      ) : null}
                      <span className="text-xs font-bold text-[#0f2244]">
                        {dev.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
