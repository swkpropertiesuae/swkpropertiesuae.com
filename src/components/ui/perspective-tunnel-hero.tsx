"use client";

import {
    motion,
    useTransform,
    useReducedMotion,
    useMotionValue,
    useScroll,
    useSpring,
    MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

export interface TunnelImage {
    src: string;
    title: string;
}

interface TunnelCardData {
    item: TunnelImage;
    angleCos: number;
    angleSin: number;
    radiusFactorX: number;
    radiusFactorY: number;
    rotationZ: number;
    index: number;
}

function buildCards(images: TunnelImage[]): TunnelCardData[] {
    return images.map((item, i) => {
        const goldenAngle = i * 137.5 * (Math.PI / 180);
        const radiusFactorX = 0.34 + (i % 3) * 0.07;
        const radiusFactorY = 0.30 + (i % 2) * 0.08;
        return {
            item,
            angleCos: Math.cos(goldenAngle),
            angleSin: Math.sin(goldenAngle),
            radiusFactorX,
            radiusFactorY,
            rotationZ: (i % 2 === 0 ? 1 : -1) * (2 + (i % 4) * 1.5),
            index: i,
        };
    });
}

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
    width: number;
    height: number;
    isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING_CONFIG);
    const y = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [enabled, rawX, rawY]);

    return { x, y };
}

interface TunnelCardProps {
    card: TunnelCardData;
    progress: MotionValue<number>;
    pointer: { x: MotionValue<number>; y: MotionValue<number> };
    total: number;
    stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
    const staggerSpan = 0.55;
    const start = (card.index / total) * (1 - staggerSpan);
    const end = start + staggerSpan;

    const localProgress = useTransform(progress, [start, end], [0, 1]);

    const farZ = stage.isMobile ? -1200 : -1700;
    const nearZ = stage.isMobile ? 350 : 500;
    const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

    const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

    const cardWidth = stage.isMobile
        ? Math.max(130, Math.min(180, stage.width * 0.38))
        : Math.max(180, Math.min(270, stage.width * 0.18));

    const baseX = card.angleCos * (stage.width * card.radiusFactorX);
    const baseY = card.angleSin * (stage.height * card.radiusFactorY);
    const panStrength = stage.isMobile ? 20 : 45;

    const transform = useTransform(
        [z, pointer.x, pointer.y],
        ([currZ, px, py]: number[]) => {
            const offsetX = baseX - px * panStrength;
            const offsetY = baseY - py * panStrength;
            return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
        }
    );

    return (
        <motion.div
            style={{
                width: cardWidth,
                transform,
                opacity,
                zIndex: card.index + 1,
            }}
            className="absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none"
        >
            <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(15,34,68,0.18)] ring-1 ring-[#e6dfd2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={card.item.src}
                    alt={card.item.title}
                    draggable={false}
                    loading="eager"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0f2244]/85 via-[#0f2244]/15 to-transparent p-4 sm:p-5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white drop-shadow-sm sm:text-sm">
                        {card.item.title}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export interface PerspectiveTunnelHeroProps {
    images: TunnelImage[];
    eyebrow?: string;
    title?: React.ReactNode;
    subtitle?: string;
    prompt?: string;
    /** Buttons or links shown under the headline (pointer events enabled). */
    actions?: React.ReactNode;
    /** Total scroll distance of the fly-through, in viewport heights. */
    scrollLength?: number;
}

/**
 * Perspective tunnel hero. The fly-through is driven by page scroll (a sticky stage inside
 * a tall wrapper) instead of hijacking the mouse wheel, so the page always keeps scrolling.
 */
export default function PerspectiveTunnelHero({
    images,
    eyebrow = "SWK Properties",
    title = (
        <>
            INTO THE
            <br />
            ETHER.
        </>
    ),
    subtitle,
    prompt = "Scroll to explore",
    actions,
    scrollLength = 3.2,
}: PerspectiveTunnelHeroProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const cards = useMemo(() => buildCards(images), [images]);

    const [stage, setStage] = useState<StageDimensions>({
        width: 1440,
        height: 900,
        isMobile: false,
    });

    useEffect(() => {
        const updateDimensions = () => {
            setStage({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < 768,
            });
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const { scrollYProgress } = useScroll({
        target: wrapRef,
        offset: ["start start", "end end"],
    });
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.0001,
    });

    const pointer = useCameraParallax(!reduce);

    const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 1.25]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.08, 0.82, 1], [1, 1, 1, 0]);
    const promptOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

    return (
        <div ref={wrapRef} style={{ height: `${scrollLength * 100}svh` }} className="relative">
            <div
                className="sticky top-0 flex h-[92svh] w-full items-center justify-center overflow-hidden bg-[#faf7f2] text-[#0f2244] select-none"
                style={{
                    perspective: stage.isMobile ? "900px" : "1200px",
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Architectural grid and warm gold glow */}
                <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(#c99a63_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_55%,transparent_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,154,99,0.16)_0%,transparent_70%)]" />

                {/* Depth ring guides */}
                <div className="pointer-events-none absolute h-[52vmin] w-[52vmin] rounded-full border border-[#94652c]/20" />
                <div className="pointer-events-none absolute h-[80vmin] w-[80vmin] rounded-full border border-dashed border-[#0f2244]/12" />

                {/* 3D z-space plane */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {cards.map((card) => (
                        <TunnelCard
                            key={card.index}
                            card={card}
                            progress={smoothProgress}
                            pointer={pointer}
                            total={cards.length}
                            stage={stage}
                        />
                    ))}
                </div>

                {/* Central anchor typography inside a clean frosted corporate frame */}
                <motion.div
                    style={{ scale: titleScale, opacity: titleOpacity }}
                    className="relative z-[200] mx-4 flex max-w-3xl flex-col items-center rounded-3xl border border-[#e6dfd2] bg-white/90 px-6 py-8 text-center shadow-[0_24px_80px_rgba(15,34,68,0.12)] backdrop-blur-xl sm:px-10 sm:py-10"
                >
                    <p className="mb-3 rounded-full border border-[#94652c]/30 bg-[#f6ead7] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-[#94652c]">
                        {eyebrow}
                    </p>
                    <h1 className="font-serif text-4xl leading-[1.04] font-bold tracking-tight text-[#0f2244] sm:text-6xl md:text-7xl">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-4 max-w-[54ch] text-sm font-normal leading-relaxed text-[#39455a] sm:text-base md:text-lg">
                            {subtitle}
                        </p>
                    )}
                    {actions && <div className="mt-7 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
                </motion.div>

                {/* Scroll prompt */}
                <motion.div
                    style={{ opacity: promptOpacity }}
                    className="pointer-events-none absolute bottom-6 z-[200] flex flex-col items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[#94652c]"
                >
                    <span>{prompt}</span>
                    <div className="h-6 w-px bg-gradient-to-b from-[#94652c] to-transparent" />
                </motion.div>
            </div>
        </div>
    );
}
