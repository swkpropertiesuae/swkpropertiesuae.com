"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

export interface CarouselItem {
  id: number;
  title: string;
  logo?: string;
  subtitle?: string;
}

const createInfiniteItems = (originalItems: CarouselItem[]) => {
  const items: (Omit<CarouselItem, "id"> & { id: string; originalIndex: number })[] = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 80,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = "h-2.5";
    let color = "bg-[#0f2244]/20";

    if (isCenter) {
      height = "h-7";
      color = "bg-[#94652c]";
    } else if (isFifth) {
      height = "h-4";
      color = "bg-[#0f2244]/55";
    }

    const positionClass = top ? "" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-0.5 ${height} ${color} ${positionClass}`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative w-full h-7 px-4">{lines}</div>;
};

export function RulerCarousel({
  originalItems,
}: {
  originalItems: CarouselItem[];
}) {
  const infiniteItems = createInfiniteItems(originalItems);
  const itemsPerSet = originalItems.length;

  const [activeIndex, setActiveIndex] = useState(itemsPerSet + 4);
  const [isResetting, setIsResetting] = useState(false);
  const previousIndexRef = useRef(itemsPerSet + 4);

  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;
    const targetOriginalIndex = newIndex % itemsPerSet;
    const possibleIndices = [
      targetOriginalIndex,
      targetOriginalIndex + itemsPerSet,
      targetOriginalIndex + itemsPerSet * 2,
    ];

    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);

    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    previousIndexRef.current = activeIndex;
    setActiveIndex(closestIndex);
  };

  const handlePrevious = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (isResetting) return;

    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex + itemsPerSet);
        setIsResetting(false);
      }, 0);
    } else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex - itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
  }, [activeIndex, itemsPerSet, isResetting]);

  const centerPosition = 5;
  const targetX = -420 + (centerPosition - (activeIndex % itemsPerSet)) * 420;

  const currentPage = (activeIndex % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div className="w-full py-8 flex flex-col items-center justify-center bg-white">
      <div className="w-full h-[180px] flex flex-col justify-between relative">
        <div className="flex items-center justify-center">
          <RulerLines top />
        </div>
        <div className="flex items-center justify-center w-full h-full relative overflow-hidden">
          <motion.div
            className="flex items-center gap-[80px]"
            animate={{
              x: targetX,
            }}
            transition={
              isResetting
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                    mass: 1,
                  }
            }
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(index)}
                  className={`cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isActive
                      ? "text-[#0f2244]"
                      : "text-[#5f6a82] hover:text-[#0f2244]"
                  }`}
                  animate={{
                    scale: isActive ? 1 : 0.76,
                    opacity: isActive ? 1 : 0.42,
                  }}
                  transition={
                    isResetting
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }
                  }
                  style={{
                    width: "340px",
                  }}
                >
                  {item.logo ? (
                    <div className="flex h-12 w-36 items-center justify-center rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-4 py-2 shadow-xs">
                      <img
                        src={item.logo}
                        alt={item.title}
                        className="max-h-7 max-w-[110px] object-contain"
                      />
                    </div>
                  ) : null}
                  <span className="font-serif text-2xl md:text-4xl font-bold whitespace-nowrap tracking-tight">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#94652c]">
                      {item.subtitle}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center">
          <RulerLines top={false} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 mt-5">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isResetting}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] hover:border-[#94652c] cursor-pointer"
          aria-label="Previous developer"
        >
          <Rewind className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-4 py-1 text-xs font-bold text-[#0f2244]">
          <span className="text-[#94652c]">{currentPage}</span>
          <span className="text-[#5f6a82]">/</span>
          <span>{totalPages}</span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={isResetting}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] hover:border-[#94652c] cursor-pointer"
          aria-label="Next developer"
        >
          <FastForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
