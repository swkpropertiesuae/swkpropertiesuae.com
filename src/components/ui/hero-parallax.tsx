"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Link from "next/link";

export const HeroParallax = ({
  products,
  heading = "UAE Master Developers & Landmark Releases",
  subheading = "Explore 108 verified residential, waterfront, and golf-community developments across Emaar, DAMAC, Sobha, Nakheel, Omniyat, Binghatti, Aldar, Arada, Meraas, Ellington, and more.",
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
  heading?: string;
  subheading?: string;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.88, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [10, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-220, 260]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[270vh] py-28 overflow-hidden antialiased relative flex flex-col self-auto bg-[#faf7f2] border-b border-[#e6dfd2] [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header heading={heading} subheading={subheading} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 mb-16">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-16 space-x-12">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({
  heading,
  subheading,
}: {
  heading: string;
  subheading: string;
}) => {
  return (
    <div className="max-w-7xl relative mx-auto py-12 md:py-20 px-4 w-full left-0 top-0 z-10">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#94652c]">
        SWK Properties · Developer Intelligence Desk
      </p>
      <h1 className="font-serif text-3xl md:text-6xl font-semibold text-[#0f2244] max-w-4xl leading-[1.08]">
        {heading}
      </h1>
      <p className="max-w-2xl text-base md:text-lg mt-5 text-[#39455a] leading-relaxed">
        {subheading}
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -16,
      }}
      key={product.title}
      className="group/product h-80 w-[26rem] relative flex-shrink-0 overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-md"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl h-full w-full"
      >
        <img
          src={product.thumbnail}
          loading="eager"
          decoding="sync"
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-[#0f2244]/85 via-[#0f2244]/20 to-transparent pointer-events-none" />
      <h2 className="absolute bottom-4 left-4 right-4 font-serif text-lg font-semibold text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
