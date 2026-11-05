import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Compass, MapPin } from "lucide-react";
import { OrbitalGalleryHero } from "@/components/ui/orbital-gallery-hero";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { FerrisWheelGallery } from "@/components/ui/ferris-wheel-gallery";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { communityGuides } from "@/lib/communities";
import { breadcrumbLd, buildMeta, itemListLd, KEYWORDS } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export const metadata: Metadata = buildMeta({
  title: "Dubai Community & Neighbourhood Guides | Downtown, Palm Jumeirah, Marina & Hills",
  description:
    "Explore balanced neighbourhood guides for Dubai's 8 core freehold communities: Downtown Dubai, Dubai Marina, Palm Jumeirah, Business Bay, Dubai Hills Estate, JVC, Dubai Creek Harbour, and Sheikh Zayed Road.",
  path: "/communities",
  image: "/img/communities/downtown-dubai.webp",
  keywords: KEYWORDS.communities,
});

export default function CommunitiesPage() {
  const zoomImages = communityGuides.slice(0, 7).map((c) => ({
    src: c.image,
    alt: c.name,
  }));

  const ferrisItems = communityGuides.map((c) => ({
    id: c.slug,
    src: c.image,
    alt: c.name,
    title: c.name,
    year: "Dubai, UAE",
    discipline: c.tagline,
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Dubai Communities", path: "/communities" },
          ]),
          itemListLd(
            "Dubai Core Real Estate Communities",
            communityGuides.map((c) => ({
              name: c.name,
              url: `${SITE.url}/communities/${c.slug}`,
            }))
          ),
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 pt-8">
        <OrbitalGalleryHero />
      </div>

      {/* 8 Dubai Community & Neighbourhood Guides Grid (§11) */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
            Balanced Neighbourhood Evaluations (§11)
          </p>
          <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            8 Core Dubai Freehold & Leasing Districts
          </h2>
          <p className="mt-2 text-sm text-[#39455a] leading-relaxed">
            Every SWK community guide covers connectivity to DXB Airport & DIFC, nearby schools and hospitals, typical property types, key advantages, and honest practical trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {communityGuides.map((comm) => (
            <Link
              key={comm.slug}
              href={`/communities/${comm.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white transition hover:-translate-y-1 hover:border-[#94652c]/40"
            >
              <div>
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={comm.image}
                    alt={comm.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121116] via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94652c]">
                        {comm.tagline}
                      </span>
                      <h3 className="font-serif text-3xl font-semibold text-[#0f2244]">
                        {comm.name}
                      </h3>
                    </div>
                    <span className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1 font-mono text-[10px] text-[#94652c]">
                      {comm.coordinates.lat.toFixed(2)}°N, {comm.coordinates.lng.toFixed(2)}°E
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs md:text-sm text-[#39455a] leading-relaxed">
                    {comm.blurb}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {comm.propertyTypes.map((pt) => (
                      <span
                        key={pt}
                        className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1 text-[11px] text-[#39455a]"
                      >
                        {pt}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#e6dfd2] pt-4 text-xs">
                    <div>
                      <span className="text-emerald-600 font-semibold block mb-1">
                        Key Advantage:
                      </span>
                      <span className="text-[#39455a] line-clamp-2">{comm.pros[0]}</span>
                    </div>
                    <div>
                      <span className="text-amber-800 font-semibold block mb-1">
                        Practical Trade-Off:
                      </span>
                      <span className="text-[#39455a] line-clamp-2">{comm.considerations[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e6dfd2] px-6 py-4 text-xs font-semibold text-[#94652c]">
                <span className="inline-flex items-center gap-1.5">
                  <Compass className="h-4 w-4" />
                  Read Full {comm.name} Neighbourhood Guide
                </span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 21st.dev FerrisWheelGallery */}
      <section className="border-y border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
              Interactive District Wheel
            </p>
            <h2 className="mt-1 font-serif text-3xl md:text-4xl font-semibold text-[#0f2244]">
              Spin Through Dubai&apos;s Master Communities
            </h2>
          </div>
          <FerrisWheelGallery items={ferrisItems} />
        </div>
      </section>

      {/* 21st.dev ZoomParallax */}
      <section className="overflow-hidden">
        <ZoomParallax images={zoomImages} />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <EnquiryForm
          context="general"
          heading="Not Sure Which Dubai Community Fits Your Mandate?"
          subheading="Tell us your commute, school requirements, or target rental yield and our specialists will compare the top 3 districts for you."
        />
      </section>
    </>
  );
}
