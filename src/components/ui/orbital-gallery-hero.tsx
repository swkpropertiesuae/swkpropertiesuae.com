"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";

const defaultImages = [
  "/img/communities/downtown-dubai.webp",
  "/img/communities/dubai-marina.webp",
  "/img/communities/palm-jumeirah.webp",
  "/img/communities/business-bay.webp",
  "/img/communities/dubai-hills-estate.webp",
  "/img/communities/jvc.webp",
  "/img/communities/dubai-creek-harbour.webp",
  "/img/communities/sheikh-zayed-road.webp",
  "/img/gallery/image2.webp",
  "/img/gallery/image8.webp",
];

export function OrbitalGalleryHero({
  badge = "8 Core Master Communities · Dubai, UAE",
  title = "Explore Dubai's Most Sought-After Neighbourhoods",
  description = "Balanced neighbourhood guides covering connectivity, schools, healthcare, service charges, property types, and honest pros & trade-offs.",
  primaryLabel = "Browse All listings",
  primaryHref = "/properties",
  secondaryLabel = "Compare Calculators",
  secondaryHref = "/calculators",
  images = defaultImages,
}: {
  badge?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  images?: string[];
}) {
  return (
    <section className="relative min-h-[680px] w-full overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#faf7f2]">
      <div className="relative h-full w-full overflow-hidden">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[52%] h-full w-full opacity-55"
          style={{
            x: "-50%",
            y: "-50%",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {images.map((src, index) => {
            const angle = (index * 360) / images.length;
            const radiusX = 480;
            const radiusY = 420;
            const x = Math.cos((angle * Math.PI) / 180) * radiusX;
            const y = Math.sin((angle * Math.PI) / 180) * radiusY;

            return (
              <div
                key={`${src}-${index}`}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 50,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="h-28 w-44 overflow-hidden rounded-2xl border border-[#94652c]/30 shadow-2xl">
                    <img
                      src={src}
                      alt={`Dubai community ${index + 1}`}
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        <div className="relative z-20 flex min-h-[680px] flex-col items-center justify-center px-6 py-20 text-center bg-[radial-gradient(circle_at_center,rgba(11,11,12,0.88)_0%,rgba(11,11,12,0.65)_60%,rgba(11,11,12,0.92)_100%)]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#faf7f2] px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-[#94652c] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {badge}
          </div>

          <h1 className="max-w-[760px] font-serif text-4xl font-semibold tracking-tight text-[#0f2244] md:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-[580px] text-sm md:text-base leading-relaxed text-[#39455a]">
            {description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={primaryHref}
              className="flex items-center gap-3 rounded-full bg-[#0f2244] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#14305c]"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="flex items-center gap-2 rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f2244] hover:border-[#94652c]/45"
            >
              {secondaryLabel}
            </Link>
          </div>

          <div className="mt-12 grid w-full max-w-[720px] md:grid-cols-3 border-t border-[#e6dfd2] pt-7">
            <div className="px-4 py-2 text-center">
              <h3 className="font-serif text-lg font-semibold text-[#94652c]">
                Verified Connectivity
              </h3>
              <p className="mt-1 text-xs text-[#39455a]">
                Typical off-peak & peak travel times to DXB, DIFC & Metro.
              </p>
            </div>

            <div className="border-y md:border-y-0 md:border-x border-[#e6dfd2] px-4 py-2 text-center">
              <h3 className="font-serif text-lg font-semibold text-[#94652c]">
                Balanced Assessment
              </h3>
              <p className="mt-1 text-xs text-[#39455a]">
                Clear advantages and practical drawbacks for every community.
              </p>
            </div>

            <div className="px-4 py-2 text-center">
              <h3 className="font-serif text-lg font-semibold text-[#94652c]">
                Area Specialists
              </h3>
              <p className="mt-1 text-xs text-[#39455a]">
                Direct access to SWK brokers specializing in each district.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { OrbitalGalleryHero as HeroSection };
export default OrbitalGalleryHero;
