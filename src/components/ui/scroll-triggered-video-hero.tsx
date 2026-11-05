'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, type Variants, type MotionValue } from 'framer-motion';
import { ChevronRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  videoUrl?: string;
  posterUrl: string;
  theme: 'light' | 'dark';
  description: string;
  href?: string;
}

const defaultChapters: Chapter[] = [
  {
    id: '01',
    title: 'Sheikh Zayed Corridor',
    subtitle: 'Advisory Grounded in Regulation',
    posterUrl: '/img/hero/dubai-skyline-hero.webp',
    videoUrl: 'https://cdn.21st.dev/assets/mirror/13/130f3cb22e97770a1e0a2c66893bf5b63a1c21fd47598839a04d3af34c9da165.mp4',
    theme: 'dark',
    description: 'Headquartered at Al Saqr Business Tower on Sheikh Zayed Road and licensed under RERA ORN 51517, SWK Properties represents buyers, landlords, and institutional investors with documented transparency.',
    href: '/about',
  },
  {
    id: '02',
    title: 'Off-Plan & Escrowed Launches',
    subtitle: 'Direct Developer Allocations',
    posterUrl: '/img/communities/downtown-dubai.webp',
    videoUrl: 'https://cdn.21st.dev/assets/mirror/5d/5d00d3f51a1f753bb8f106955b9e116d86e82f34b173166ee79275ab10e670b1.mp4',
    theme: 'dark',
    description: 'Every off-plan project we present is cross-checked for DLD registration, escrow protection, milestone-linked payment schedules, and historical developer handover performance.',
    href: '/off-plan',
  },
  {
    id: '03',
    title: 'Secondary & Leasing Desk',
    subtitle: 'Trakheesi-Permitted Inventory',
    posterUrl: '/img/communities/palm-jumeirah.webp',
    theme: 'dark',
    description: 'From ready waterfront villas on Palm Jumeirah to high-yield apartments in Dubai Marina and Business Bay, our secondary and leasing teams handle Form F, NOC, Ejari, and Trustee transfer end to end.',
    href: '/properties',
  },
];

const textContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const textReveal: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: "0%", 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay: 0.3, ease: "easeOut" as const } 
  }
};

const FilmGrain = () => (
  <div className="pointer-events-none absolute inset-0 z-20 opacity-[0.06] mix-blend-overlay">
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  </div>
);

const VideoBackground = ({
  chapters,
  currentChapterIndex,
}: {
  chapters: Chapter[];
  currentChapterIndex: number;
}) => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#faf7f2]">
      {chapters.map((chapter, index) => (
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentChapterIndex ? 1 : 0,
            zIndex: index === currentChapterIndex ? 10 : 0, 
          }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          <img
            src={chapter.posterUrl}
            alt={chapter.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {chapter.videoUrl && (
            <video
              src={chapter.videoUrl}
              poster={chapter.posterUrl}
              className="relative z-10 h-full w-full object-cover opacity-65"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#0b0b0c]/90 via-[#0b0b0c]/65 to-[#0b0b0c]/40" />
        </motion.div>
      ))}
      <FilmGrain />
    </div>
  );
};

const DynamicNav = ({
  chapters,
  activeIndex,
  progress
}: {
  chapters: Chapter[];
  activeIndex: number;
  progress: MotionValue<number>;
}) => {
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="sticky bottom-8 left-1/2 -translate-x-1/2 z-40 mx-auto w-fit flex items-center gap-4 rounded-full bg-black/80 backdrop-blur-xl border border-[#94652c]/30 p-2 pl-6 pr-2 shadow-2xl"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-[#94652c]">
          Pillar {chapters[activeIndex]?.id}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-xs font-semibold text-[#0f2244] min-w-[140px]"
          >
            {chapters[activeIndex]?.title}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative h-11 w-11 flex items-center justify-center">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="18" className="stroke-white/10" strokeWidth="2" fill="none" />
          <motion.circle
            cx="24" cy="24" r="18"
            className="stroke-[#e6cf9c]"
            strokeWidth="2"
            fill="none"
            strokeDasharray="113"
            style={{ pathLength: smoothProgress }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[#94652c]">
          <PlayCircle size={16} />
        </div>
      </div>
    </motion.div>
  );
};

export default function CinematicScrol({
  chapters = defaultChapters,
}: {
  chapters?: Chapter[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const newIndex = Math.min(
        Math.floor(latest * chapters.length),
        chapters.length - 1
      );
      setActiveIndex(Math.max(0, newIndex));
    });
    return () => unsubscribe();
  }, [scrollYProgress, chapters.length]);

  return (
    <section ref={containerRef} className="relative w-full" style={{ height: `${chapters.length * 85}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <VideoBackground chapters={chapters} currentChapterIndex={activeIndex} />
      </div>

      <div className="absolute inset-0 top-0 z-30 pointer-events-none">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="flex h-[85vh] w-full items-center justify-start px-6 md:px-20"
          >
            <motion.div
              variants={textContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-20%" }} 
              className="max-w-3xl pointer-events-auto"
            >
              <motion.div variants={fadeIn} className="flex items-center gap-4 mb-5">
                <div className="h-0.5 w-12 bg-[#0f2244]" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94652c]">
                  Chapter {chapter.id} · {chapter.title}
                </span>
              </motion.div>

              <div className="overflow-hidden mb-6 py-2">
                <motion.h2 
                  variants={textReveal}
                  className="font-serif text-4xl md:text-6xl font-semibold text-[#0f2244] tracking-tight leading-tight"
                >
                  {chapter.subtitle}
                </motion.h2>
              </div>

              <motion.div 
                variants={fadeIn}
                className="max-w-xl p-6 rounded-2xl border border-[#94652c]/20 bg-black/55 backdrop-blur-md shadow-2xl"
              >
                <p className="text-base md:text-lg text-[#39455a] leading-relaxed">
                  {chapter.description}
                </p>
              </motion.div>

              {chapter.href && (
                <motion.div variants={fadeIn} className="mt-8">
                  <Link
                    href={chapter.href}
                    className="group inline-flex items-center gap-4 text-[#0f2244] font-medium"
                  >
                    <div className="relative h-11 w-11 rounded-full border border-[#94652c]/35 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-[#0f2244] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <ChevronRight size={18} className="relative z-10 group-hover:text-black transition-colors duration-300" />
                    </div>
                    <span className="tracking-[0.22em] uppercase text-xs text-[#94652c]">
                      Explore {chapter.title}
                    </span>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      <DynamicNav chapters={chapters} activeIndex={activeIndex} progress={scrollYProgress} />
    </section>
  );
}
