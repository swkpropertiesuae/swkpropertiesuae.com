import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, MapPin } from "lucide-react";
import { LivelyPageHero } from "@/components/ui/lively-page-hero";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { communityGuides } from "@/lib/communities";
import { breadcrumbLd, buildMeta, itemListLd, KEYWORDS } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export const metadata: Metadata = buildMeta({
  title: "Dubai & UAE Community Guides | Downtown, Palm Jumeirah, Marina, Dubai Hills & Beyond",
  description:
    "Explore balanced neighbourhood guides for Dubai's core freehold communities: Downtown Dubai, Dubai Marina, Palm Jumeirah, Business Bay, Dubai Hills Estate, JVC, Dubai Creek Harbour, and Sheikh Zayed Road.",
  path: "/communities",
  image: "/img/communities/downtown-dubai.webp",
  keywords: KEYWORDS.communities,
});

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
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

      <LivelyPageHero
        badge="Dubai & UAE Freehold Neighbourhood Guides"
        title="Compare Dubai's Core"
        highlight="Freehold & Leasing Districts"
        description="Every community guide covers airport and DIFC travel times, nearby schools and hospitals, typical property types, key advantages, and honest practical trade-offs."
        backgroundImage="/img/hero/slides/05-sobha-century-desktop.webp"
        primaryCta={{ label: "Explore All Communities", href: "#communities-grid" }}
        secondaryCta={{ label: "Search Properties by District", href: "/properties" }}
        sideImages={[
          {
            src: "/img/communities/downtown-dubai.webp",
            label: "Downtown Dubai & Business Bay",
            sublabel: "8 Mins from SWK Sheikh Zayed Road HQ",
          },
          {
            src: "/img/communities/palm-jumeirah.webp",
            label: "Palm Jumeirah & Dubai Hills Estate",
            sublabel: "Waterfront & Golf Master Communities",
          },
        ]}
      />

      {/* 8 Dubai Community & Neighbourhood Guides Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
            Balanced Neighbourhood Evaluations
          </p>
          <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            8 Core Dubai Freehold &amp; Leasing Districts
          </h2>
          <p className="mt-2 text-sm text-[#39455a] leading-relaxed">
            Select any neighbourhood below to inspect service-charge benchmarks, transport links, and available properties.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {communityGuides.map((comm) => (
            <Link
              key={comm.slug}
              href={`/communities/${comm.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#94652c]"
            >
              <div>
                <div className="relative h-64 w-full overflow-hidden bg-[#0f2244]">
                  <img
                    src={comm.image}
                    alt={comm.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/95 via-[#0f2244]/30 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#dcb888]">
                        {comm.tagline}
                      </span>
                      <h3 className="font-serif text-3xl font-semibold text-white">
                        {comm.name}
                      </h3>
                    </div>
                    <span className="rounded-full border border-white/25 bg-white/95 px-3 py-1 font-mono text-[10px] font-bold text-[#0f2244]">
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
                        className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1 text-[11px] font-medium text-[#0f2244]"
                      >
                        {pt}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#e6dfd2] pt-4 text-xs">
                    <div>
                      <span className="text-emerald-700 font-bold block mb-1">
                        Key Advantage:
                      </span>
                      <span className="text-[#39455a] line-clamp-2">{comm.pros[0]}</span>
                    </div>
                    <div>
                      <span className="text-[#94652c] font-bold block mb-1">
                        Practical Trade-Off:
                      </span>
                      <span className="text-[#39455a] line-clamp-2">{comm.considerations[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e6dfd2] bg-[#faf7f2] px-6 py-4 text-xs font-bold text-[#0f2244] group-hover:text-[#94652c]">
                <span className="inline-flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-[#94652c]" />
                  Read Full {comm.name} Neighbourhood Guide
                </span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <EnquiryForm
          context="general"
          heading="Not Sure Which UAE Community Fits Your Mandate?"
          subheading="Tell us your commute, school requirements, or target rental yield and our specialists will compare the top 3 districts for you."
        />
      </section>
    </div>
  );
}
