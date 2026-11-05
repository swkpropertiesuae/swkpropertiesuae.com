import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, ShieldCheck } from "lucide-react";
import {
  DeveloperInfiniteMarquee,
  ProjectInfiniteMarquee,
} from "@/components/ui/infinite-moving-cards";
import { LivelyPageHero } from "@/components/ui/lively-page-hero";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { developers, projects } from "@/lib/developers";
import { breadcrumbLd, buildMeta, itemListLd, KEYWORDS } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export const metadata: Metadata = buildMeta({
  title: "27+ UAE Real Estate Developers | Emaar, DAMAC, Sobha, Azizi, Binghatti, Ellington & Aldar",
  description:
    "Explore factual profiles, delivery track records, flagship communities, and 108+ off-plan & ready developments across 27+ leading Dubai and UAE developers with SWK Properties.",
  path: "/developers",
  image: "/img/hero/dubai-skyline-hero.webp",
  keywords: KEYWORDS.developers,
});

export default function DevelopersPage() {
  const signatureProjects = developers
    .map((d) => projects.find((p) => p.developerSlug === d.slug))
    .filter((p): p is (typeof projects)[number] => Boolean(p))
    .map((proj) => {
      const devObj = developers.find((d) => d.slug === proj.developerSlug);
      return {
        slug: proj.slug,
        name: proj.name,
        developer: proj.developer,
        developerSlug: proj.developerSlug,
        developerLogo: devObj?.logo,
        community: proj.community,
        collection: proj.collection,
        image: proj.images[0],
        summary: proj.summary,
      };
    });

  return (
    <div className="bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "UAE Developers", path: "/developers" },
          ]),
          itemListLd(
            "Top 27+ UAE Real Estate Developers",
            developers.map((d) => ({
              name: d.name,
              url: `${SITE.url}/developers/${d.slug}`,
            }))
          ),
        ]}
      />

      <LivelyPageHero
        badge="27+ Partner Developers · 108+ Verified Projects"
        title="27+ UAE Master Developers &"
        highlight="108+ Verified Releases"
        description="Compare delivery track records, flagship communities, and active releases across Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, and Umm Al Quwain."
        backgroundImage="/img/hero/slides/03-azizi-florence-desktop.webp"
        primaryCta={{ label: "Browse All 27+ Developers", href: "#developers-grid" }}
        secondaryCta={{ label: "View 108+ Off-Plan Releases", href: "/off-plan" }}
        sideImages={[
          {
            src: "/img/hero/slides/01-dubai-horizon-desktop.webp",
            label: "Emaar · Sobha · DAMAC · Azizi",
            sublabel: "Escrow-Verified Master Developers",
          },
          {
            src: "/img/hero/slides/02-imtiaz-kore-desktop.webp",
            label: "Binghatti · Ellington · Imtiaz",
            sublabel: "Architectural Waterfront & Urban Releases",
          },
        ]}
      />

      {/* Dual Infinite Horizontal Marquee of All 27+ Developers + Signature Projects */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 space-y-8">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#94652c]">
            Interactive Infinite Stream · 27+ Master Developers &amp; Flagship Releases
          </p>
          <DeveloperInfiniteMarquee items={developers} direction="left" speed="slow" />
        </div>
        <div>
          <ProjectInfiniteMarquee items={signatureProjects} direction="right" speed="slow" />
        </div>
      </section>

      {/* Complete 27+ UAE Developers Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#94652c]">
            <ShieldCheck className="h-4 w-4" />
            UAE Developer Directory · 18+ Years Advisory Experience
          </span>
          <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            UAE Master Developers Directory
          </h2>
          <p className="mt-2 text-sm md:text-base text-[#39455a] leading-relaxed">
            Inspect each developer&apos;s background, flagship master communities, delivery history, and current off-plan &amp; ready projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {developers.map((dev) => (
            <Link
              key={dev.slug}
              href={`/developers/${dev.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#94652c] hover:shadow-lg"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#0f2244]">
                  {dev.coverImage && (
                    <img
                      src={dev.coverImage}
                      alt={`${dev.name} flagship UAE development`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/85 via-[#0f2244]/25 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#0f2244]/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcb888]">
                      {dev.headquarters || "Dubai, UAE"}
                    </span>
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#0f2244] shadow-xs">
                      {dev.projectCount} Projects
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex h-12 items-center rounded-xl border border-[#e6dfd2] bg-white px-4 py-1.5 shadow-md">
                    {dev.logo ? (
                      <img
                        src={dev.logo}
                        alt={dev.name}
                        className="max-h-7 max-w-[140px] object-contain"
                      />
                    ) : (
                      <span className="font-serif text-base font-bold text-[#0f2244]">
                        {dev.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-2xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                    {dev.name}
                  </h3>
                  <p className="mt-1.5 text-xs font-semibold text-[#94652c]">{dev.tagline}</p>
                  <p className="mt-3 line-clamp-3 text-xs md:text-sm text-[#39455a] leading-relaxed">
                    {dev.description}
                  </p>

                  {dev.flagshipAreas && dev.flagshipAreas.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {dev.flagshipAreas.slice(0, 4).map((area) => (
                        <span
                          key={area}
                          className="inline-flex items-center gap-1 rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-2.5 py-0.5 text-[10px] font-medium text-[#39455a]"
                        >
                          <MapPin className="h-2.5 w-2.5 text-[#94652c]" />
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e6dfd2] bg-[#faf7f2] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] group-hover:text-[#94652c]">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-[#94652c]" />
                  Inspect Profile &amp; {dev.projectCount} Releases
                </span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <EnquiryForm
          context="investment"
          heading="Compare Developers, Track Records & Payment Plans"
          subheading="Tell us which UAE developers or launches you are comparing and receive an independent side-by-side breakdown."
        />
      </section>
    </div>
  );
}
