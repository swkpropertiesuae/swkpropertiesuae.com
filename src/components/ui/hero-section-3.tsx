"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollFlyInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  imageUrl: string;
  imageAlt?: string;
}

const ScrollFlyIn = React.forwardRef<HTMLDivElement, ScrollFlyInProps>(
  ({ children, imageUrl, imageAlt = "SWK Properties architectural banner", className, ...props }, _ref) => {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const [screenWidth, setScreenWidth] = React.useState(1440);

    React.useEffect(() => {
      const update = () => setScreenWidth(window.innerWidth);
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, []);

    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start end", "end start"],
    });

    const x = useTransform(
      scrollYProgress,
      [0.1, 0.85],
      [`-${1.6 * screenWidth}px`, `${1.4 * screenWidth}px`]
    );

    const opacity = useTransform(scrollYProgress, [0.1, 0.25, 0.75, 0.9], [0, 1, 1, 0]);

    return (
      <div ref={targetRef} className={cn("relative h-[135vh] overflow-x-clip", className)} {...props}>
        <div className="sticky top-0 flex h-[85vh] items-center justify-center overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#faf7f2]">
          <div className="relative z-10 px-6 text-center">{children}</div>

          <motion.div
            style={{ x, opacity }}
            className="pointer-events-none absolute inset-0 z-20 flex h-full w-full items-center justify-center"
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-64 md:h-80 w-auto rounded-2xl border border-[#94652c]/35 object-cover shadow-2xl opacity-80"
            />
          </motion.div>
        </div>
      </div>
    );
  }
);

ScrollFlyIn.displayName = "ScrollFlyIn";

export { ScrollFlyIn };
