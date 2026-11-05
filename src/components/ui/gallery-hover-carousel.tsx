"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import Link from "next/link";

export interface GalleryHoverCarouselItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

export default function GalleryHoverCarousel({
  heading = "Featured Communities",
  description = "Explore Dubai's prime freehold communities advised by SWK Properties.",
  items = [],
}: {
  heading?: string;
  description?: string;
  items?: GalleryHoverCarouselItem[];
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    update();
    carouselApi.on("select", update);
    return () => {
      carouselApi.off("select", update);
    };
  }, [carouselApi]);

  return (
    <section className="py-20 bg-[#faf7f2] border-b border-[#e6dfd2]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
              03 · Prime Dubai Freehold Corridors
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
              {heading}
            </h2>
            <p className="mt-2.5 text-sm md:text-base text-[#39455a] leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="h-11 w-11 rounded-full border-[#e6dfd2] bg-white text-[#0f2244] hover:border-[#94652c] hover:text-[#94652c]"
              aria-label="Previous community"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="h-11 w-11 rounded-full border-[#e6dfd2] bg-white text-[#0f2244] hover:border-[#94652c] hover:text-[#94652c]"
              aria-label="Next community"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full max-w-full">
          <Carousel
            setApi={setCarouselApi}
            opts={{ breakpoints: { "(max-width: 768px)": { dragFree: true } } }}
            className="relative w-full max-w-full"
          >
            <CarouselContent className="hide-scrollbar w-full max-w-full md:ml-2">
              {items.map((item) => (
                <CarouselItem key={item.id} className="pl-5 md:max-w-[360px]">
                  <Link href={item.url} className="group block relative w-full h-[360px] md:h-[390px]">
                    <Card className="overflow-hidden h-full w-full rounded-3xl border border-[#e6dfd2] bg-white p-0 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                      {/* Image */}
                      <div className="relative h-[68%] w-full transition-all duration-500 group-hover:h-[52%]">
                        <img
                          width={400}
                          height={300}
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/50 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 rounded-full border border-white/40 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f2244] shadow-sm">
                          Dubai Freehold Guide
                        </span>
                      </div>

                      {/* Text Section */}
                      <div className="relative flex h-[32%] group-hover:h-[48%] w-full flex-col justify-between bg-white p-5 transition-all duration-500">
                        <div>
                          <h3 className="font-serif text-xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-xs md:text-sm text-[#39455a] line-clamp-2 group-hover:line-clamp-3 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-[#e6dfd2] pt-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] group-hover:text-[#94652c]">
                          <span>Inspect Area Guide</span>
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
