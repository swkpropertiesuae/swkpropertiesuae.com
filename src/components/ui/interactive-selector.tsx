"use client";

import React, { useState, useEffect } from "react";
import { Building2, Compass, KeyRound, Landmark, ShieldCheck } from "lucide-react";

export interface SelectorOption {
  title: string;
  description: string;
  image: string;
  icon?: React.ReactNode;
}

const defaultOptions: SelectorOption[] = [
  {
    title: "Off-Plan Launches",
    description: "Escrow-verified developer releases & milestone plans",
    image: "/img/communities/downtown-dubai.webp",
    icon: <Landmark size={20} className="text-[#94652c]" />,
  },
  {
    title: "Waterfront Residences",
    description: "Palm Jumeirah, Dubai Marina & Creek Harbour",
    image: "/img/communities/palm-jumeirah.webp",
    icon: <Compass size={20} className="text-[#94652c]" />,
  },
  {
    title: "Ready Secondary Homes",
    description: "DLD Trakheesi-permitted apartments & golf villas",
    image: "/img/communities/dubai-hills-estate.webp",
    icon: <Building2 size={20} className="text-[#94652c]" />,
  },
  {
    title: "Executive Leasing",
    description: "Annual & flexible Ejari-registered rentals",
    image: "/img/communities/dubai-marina.webp",
    icon: <KeyRound size={20} className="text-[#94652c]" />,
  },
  {
    title: "Portfolio Management",
    description: "Snagging, tenant care & net-yield reporting",
    image: "/img/communities/business-bay.webp",
    icon: <ShieldCheck size={20} className="text-[#94652c]" />,
  },
];

const InteractiveSelector = ({
  heading = "Tailored to Your Mandate",
  subheading = "Select a segment to inspect how SWK Properties structures acquisitions, sales, and leasing across Dubai.",
  options = defaultOptions,
}: {
  heading?: string;
  subheading?: string;
  options?: SelectorOption[];
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev) => (prev.includes(i) ? prev : [...prev, i]));
      }, 140 * i);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [options]);

  return (
    <div className="relative flex flex-col items-center justify-center py-12 bg-transparent font-sans text-[#0f2244]">
      <div className="w-full max-w-3xl px-6 mb-8 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
          SWK Advisory Segments · RERA ORN 51517
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0f2244] mb-3 tracking-tight">
          {heading}
        </h2>
        <p className="text-base md:text-lg text-[#39455a] max-w-2xl mx-auto">
          {subheading}
        </p>
      </div>

      <div className="options flex w-full max-w-[1100px] h-[420px] px-4 items-stretch overflow-x-auto md:overflow-hidden relative gap-2">
        {options.map((option, index) => (
          <div
            key={index}
            className={`option relative flex flex-col justify-end overflow-hidden rounded-2xl transition-all duration-700 ease-in-out ${
              activeIndex === index ? "active" : ""
            }`}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backfaceVisibility: "hidden",
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index)
                ? "translateX(0)"
                : "translateX(-40px)",
              minWidth: "68px",
              minHeight: "100px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor:
                activeIndex === index
                  ? "rgba(230, 207, 156, 0.7)"
                  : "rgba(255, 255, 255, 0.12)",
              cursor: "pointer",
              backgroundColor: "#141416",
              boxShadow:
                activeIndex === index
                  ? "0 20px 60px rgba(0,0,0,0.60)"
                  : "0 10px 30px rgba(0,0,0,0.30)",
              flex: activeIndex === index ? "6 1 0%" : "1 1 0%",
              zIndex: activeIndex === index ? 10 : 1,
            }}
            onClick={() => handleOptionClick(index)}
          >
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out"
              style={{
                background:
                  activeIndex === index
                    ? "linear-gradient(to top, rgba(11,11,12,0.92) 0%, rgba(11,11,12,0.35) 55%, transparent 100%)"
                    : "linear-gradient(to top, rgba(11,11,12,0.85) 0%, rgba(11,11,12,0.45) 100%)",
              }}
            />

            <div className="label absolute left-0 right-0 bottom-5 flex items-center justify-start h-14 z-10 pointer-events-none px-4 gap-3 w-full">
              <div className="icon min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full bg-black/80 backdrop-blur-md border border-[#94652c]/35 flex-shrink-0">
                {option.icon}
              </div>
              <div className="info text-white overflow-hidden">
                <div
                  className="main font-serif font-semibold text-xl text-[#0f2244] transition-all duration-500 ease-in-out truncate"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform:
                      activeIndex === index
                        ? "translateX(0)"
                        : "translateX(20px)",
                  }}
                >
                  {option.title}
                </div>
                <div
                  className="sub text-sm text-[#39455a] transition-all duration-500 ease-in-out truncate"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform:
                      activeIndex === index
                        ? "translateX(0)"
                        : "translateX(20px)",
                  }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveSelector;
