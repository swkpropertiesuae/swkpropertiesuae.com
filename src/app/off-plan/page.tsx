"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Search, ShieldCheck } from "lucide-react";
import { LivelyPageHero } from "@/components/ui/lively-page-hero";
import Timeline from "@/components/ui/timeline";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { LISTINGS } from "@/lib/listings";
import { collections, developers, projectCommunities, projects } from "@/lib/developers";
import { SITE } from "@/lib/swk";

export default function OffPlanHubPage() {
  const [search, setSearch] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const offPlanListings = LISTINGS.filter((l) => l.purpose === "off-plan");

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (selectedDeveloper && p.developerSlug !== selectedDeveloper) return false;
      if (selectedCollection && p.collection !== selectedCollection) return false;
      if (selectedCommunity && p.community !== selectedCommunity) return false;
      if (q) {
        const hay = `${p.name} ${p.developer} ${p.community} ${p.collection} ${p.summary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, selectedDeveloper, selectedCollection, selectedCommunity]);

  return (
    <div className="space-y-16 pb-20">
      <LivelyPageHero
        badge="108+ Escrow-Verified Launches · 0% Buyer Commission"
        title="108+ Verified Off-Plan Launches Across"
        highlight="27+ UAE Master Developers"
        description="Explore direct developer releases including Azizi Venice, Emaar The Oasis, DAMAC Islands, Sobha Century, Binghatti Maybach Benz, Ellington Berkeley Tower, The Meriva Dubai Islands, Masaar Sharjah, Yas Island, Saadiyat Island, and Al Marjan Island."
        backgroundImage="/img/hero/slides/04-azizi-venice-desktop.webp"
        primaryCta={{
          label: `Browse All ${projects.length} Projects Below`,
          href: "#projects-directory",
        }}
        secondaryCta={{
          label: "Off-Plan Payment Calculator",
          href: "/calculators",
        }}
        sideImages={[
          {
            src: "/img/hero/slides/02-imtiaz-kore-desktop.webp",
            label: "Imtiaz Kore & Azizi Florence",
            sublabel: "10%–20% Down · 60/40 & 50/50 Payment Plans",
            href: "/off-plan/imtiaz-kore",
          },
          {
            src: "/img/hero/slides/06-damac-islands-desktop.webp",
            label: "DAMAC Islands & Emaar The Oasis",
            sublabel: "Waterfront Lagoon Townhouses & Canal Villas",
            href: "/off-plan/damac-islands",
          },
        ]}
      />

      {/* Featured Off-Plan Units with Complete DLD Escrow & Floor Plan Specs */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#94652c]">
              <ShieldCheck className="h-4 w-4" />
              Featured Allocations With Full Floor Plan & Escrow Data
            </span>
            <h2 className="mt-1 font-serif text-3xl md:text-4xl font-semibold text-[#0f2244]">
              Highlighted Off-Plan Unit Allocations
            </h2>
          </div>
          <Link
            href="/guides/investing"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94652c] hover:underline"
          >
            Read Off-Plan Due Diligence Guide →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {offPlanListings.map((listing) => (
            <PropertyCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>

      {/* Complete 108 Developer Off-Plan Projects Directory (§09) */}
      <section id="projects-directory" className="mx-auto max-w-7xl px-4 scroll-mt-24">
        <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-[#e6dfd2]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
                Complete UAE Developer Directory · {filteredProjects.length} of {projects.length} Projects
              </p>
              <h2 className="mt-1 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
                Filter Off-Plan & New Launch Developments
              </h2>
            </div>
            {(search || selectedDeveloper || selectedCollection || selectedCommunity) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedDeveloper("");
                  setSelectedCollection("");
                  setSelectedCommunity("");
                }}
                className="text-xs font-semibold text-[#94652c] hover:underline"
              >
                Reset Directory Filters
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94652c]" />
              <input
                type="text"
                placeholder="Search project, tower or area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] pl-10 pr-3.5 py-2.5 text-xs text-[#0f2244]"
              />
            </div>

            <select
              value={selectedDeveloper}
              onChange={(e) => setSelectedDeveloper(e.target.value)}
              className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2.5 text-xs text-[#0f2244]"
            >
              <option value="">All {developers.length} UAE Developers</option>
              {developers.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({d.projectCount})
                </option>
              ))}
            </select>

            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2.5 text-xs text-[#0f2244]"
            >
              <option value="">All Collections</option>
              {collections.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2.5 text-xs text-[#0f2244]"
            >
              <option value="">All Project Communities</option>
              {projectCommunities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Render Notice Banner (§09) */}
          <div className="mt-5 rounded-2xl border border-[#94652c]/25 bg-[#faf7f2] px-4 py-3 text-xs text-[#39455a]">
            <strong className="text-[#94652c]">Transparency & Render Notice (§09):</strong> Project visuals shown below are official developer architectural renders for illustrative purposes. Unit prices, payment schedules, and handover dates are confirmed from live developer inventory upon enquiry.
          </div>

          {/* Projects Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((proj) => {
              const devObj = developers.find((d) => d.slug === proj.developerSlug);
              return (
                <Link
                  key={proj.slug}
                  href={`/off-plan/${proj.slug}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#94652c] hover:shadow-lg"
                >
                  <div>
                    <div className="relative h-56 w-full overflow-hidden bg-[#0f2244]">
                      <img
                        src={proj.images[0]}
                        alt={proj.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/85 via-transparent to-black/30" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-[#0f2244] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#dcb888]">
                          {proj.collection}
                        </span>
                        <span className="rounded-full border border-white/25 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0f2244] shadow-xs">
                          DLD Escrow Verified
                        </span>
                      </div>
                      {devObj?.logo && (
                        <div className="absolute bottom-3 right-3 rounded-lg bg-white px-2.5 py-1 shadow-md">
                          <img
                            src={devObj.logo}
                            alt={proj.developer}
                            className="h-4 w-16 object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#94652c]">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{proj.developer}</span>
                      </div>
                      <h3 className="mt-1.5 font-serif text-2xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                        {proj.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#5f6a82]">
                        <MapPin className="h-3.5 w-3.5 text-[#94652c]" />
                        <span>{proj.community}</span>
                      </div>
                      <p className="mt-3 line-clamp-3 text-xs text-[#39455a] leading-relaxed">
                        {proj.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#e6dfd2] bg-[#faf7f2] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0f2244] group-hover:text-[#94652c]">
                    <span>View Payment Plan &amp; Brochure</span>
                    <span>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 21st.dev Timeline */}
      <Timeline />

      {/* Off-Plan Consultation & Brochure Form */}
      <section className="mx-auto max-w-4xl px-4">
        <EnquiryForm
          context="brochure"
          heading="Request Live Developer Inventory, Floor Plans & Escrow Details"
          subheading="Receive current unit availability, construction milestone payment schedules, and DLD Oqood fee breakdowns."
        />
      </section>
    </div>
  );
}
