'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ParallaxComponent({
  title = "DUBAI HORIZONS",
  layer1 = "/img/hero/dubai-skyline-hero.webp",
  layer2 = "/img/communities/downtown-dubai.webp",
  layer4 = "/img/communities/palm-jumeirah.webp",
}: {
  title?: string;
  layer1?: string;
  layer2?: string;
  layer4?: string;
}) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 45 },
        { layer: "2", yPercent: 30 },
        { layer: "3", yPercent: 20 },
        { layer: "4", yPercent: 8 }
      ];

      layers.forEach((layerObj, idx) => {
        const targets = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
        if (targets.length > 0) {
          tl.to(
            targets,
            {
              yPercent: layerObj.yPercent,
              ease: "none"
            },
            idx === 0 ? undefined : "<"
          );
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (triggerElement) {
        gsap.killTweensOf(triggerElement);
      }
    };
  }, []);

  return (
    <div className="parallax relative w-full overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#faf7f2]" ref={parallaxRef}>
      <section className="parallax__header relative h-[520px] md:h-[640px] w-full overflow-hidden">
        <div className="parallax__visuals relative h-full w-full">
          <div data-parallax-layers className="parallax__layers relative h-full w-full">
            <img
              src={layer1}
              loading="eager"
              width="1600"
              data-parallax-layer="1"
              alt="Dubai skyline panorama"
              className="parallax__layer-img absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <img
              src={layer2}
              loading="eager"
              width="1200"
              data-parallax-layer="2"
              alt="Downtown Dubai architecture"
              className="parallax__layer-img absolute inset-x-0 bottom-0 h-3/4 w-full object-cover opacity-45 mix-blend-lighten"
            />
            <div data-parallax-layer="3" className="parallax__layer-title absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center">
              <span className="mb-3 rounded-full border border-[#94652c]/35 bg-[#faf7f2] px-4 py-1 text-[11px] uppercase tracking-[0.3em] text-[#94652c] backdrop-blur-md">
                SWK Properties · Sheikh Zayed Road
              </span>
              <h2 className="parallax__title font-serif text-4xl md:text-7xl font-semibold tracking-tight text-[#0f2244] drop-shadow-2xl">
                {title}
              </h2>
            </div>
            <img
              src={layer4}
              loading="eager"
              width="1200"
              data-parallax-layer="4"
              alt="Palm Jumeirah coastline"
              className="parallax__layer-img pointer-events-none absolute inset-x-0 bottom-0 h-1/3 w-full object-cover opacity-35"
            />
          </div>
          <div className="parallax__fade pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0b0c] to-transparent" />
        </div>
      </section>
    </div>
  );
}
