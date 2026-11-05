"use client";

import React from "react";

export interface ArchitecturalManifestoProps {
  eyebrow?: string;
  title?: string;
  lines?: string[];
}

const DEFAULT_LINES = [
  "Every Dubai property mandate begins with verification, never speculation.",
  "Licensed under RERA ORN 51517 at Al Saqr Business Tower, Sheikh Zayed Road.",
  "We verify DLD Trakheesi permits, escrow accounts, and comparable transfers.",
  "Whether off-plan, ready secondary, or executive leasing—clarity comes first.",
];

export function PoemAnimation({
  eyebrow = "3D Architectural Corridor · SWK Charter",
  title = "THE SWK STANDARD",
  lines = DEFAULT_LINES,
}: ArchitecturalManifestoProps) {
  const repeatedText = `${title} · ${lines.join(" · ")} · `;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-[#94652c]/25 bg-[#faf7f2] py-8">
      <div className="mx-auto max-w-4xl px-6 pb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#94652c]">
          {eyebrow}
        </p>
      </div>

      <div className="swk-3d-stage relative mx-auto h-[340px] md:h-[400px] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#e6dfd2] bg-[#070708]">
        <div className="swk-3d-box">
          <div className="swk-3d-plane swk-3d-left">
            <span>{repeatedText}</span>
          </div>
          <div className="swk-3d-plane swk-3d-back">
            <span>{repeatedText}</span>
          </div>
          <div className="swk-3d-plane swk-3d-right">
            <span>{repeatedText}</span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,#0b0b0c_95%)]" />
      </div>

      <style>{`
        .swk-3d-stage {
          perspective: 900px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .swk-3d-box {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .swk-3d-plane {
          position: absolute;
          height: 240px;
          display: flex;
          align-items: center;
          overflow: hidden;
          white-space: nowrap;
          font-family: var(--font-serif-display), Georgia, serif;
          font-size: clamp(2rem, 4.2vw, 3.6rem);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-top: 1px solid rgba(230, 207, 156, 0.25);
          border-bottom: 1px solid rgba(230, 207, 156, 0.25);
        }
        .swk-3d-left {
          width: 420px;
          left: calc(50% - 410px);
          background: linear-gradient(90deg, #0b0b0c 0%, #171510 100%);
          color: rgba(230, 207, 156, 0.72);
          transform-origin: right center;
          transform: rotateY(58deg);
        }
        .swk-3d-back {
          width: 420px;
          background: radial-gradient(circle, #1e1a12 0%, #0e0d0a 100%);
          color: #f4ecd8;
          text-shadow: 0 0 24px rgba(230, 207, 156, 0.35);
        }
        .swk-3d-right {
          width: 420px;
          left: calc(50% - 10px);
          background: linear-gradient(90deg, #171510 0%, #0b0b0c 100%);
          color: rgba(230, 207, 156, 0.72);
          transform-origin: left center;
          transform: rotateY(-58deg);
        }
        .swk-3d-plane span {
          display: inline-block;
          padding-left: 100%;
          animation: swkHallwayFlow 26s linear infinite;
        }
        .swk-3d-back span {
          animation-delay: -6s;
        }
        .swk-3d-left span {
          animation-delay: -12s;
        }
        @keyframes swkHallwayFlow {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}

export default PoemAnimation;
