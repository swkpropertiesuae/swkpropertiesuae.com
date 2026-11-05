import type { Metadata } from "next";
import Link from "next/link";
import { Hero04 } from "@/components/ui/hero-04";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { LISTINGS } from "@/lib/listings";
import { GUIDES } from "@/lib/guides";
import { breadcrumbLd, buildMeta } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export const metadata: Metadata = buildMeta({
  title: "Buy Ready Property in Dubai | Secondary Market Villas, Apartments & Penthouses",
  description:
    "Browse DLD Trakheesi-permitted ready apartments, waterfront villas, townhouses, and penthouses for sale in Dubai. Full RERA Form F, NOC, and DLD Trustee transfer support by SWK Properties (ORN 51517).",
  path: "/buy",
  image: "/img/communities/downtown-dubai.webp",
  keywords: [
    "buy property in Dubai",
    "ready apartments for sale Dubai",
    "Palm Jumeirah villas for sale",
    "Downtown Dubai apartments for sale",
    "Dubai Hills Estate property for sale",
    "RERA Form F Dubai transfer",
    "SWK Properties secondary market",
  ],
});

export default function BuyPage() {
  const buyListings = LISTINGS.filter((l) => l.purpose === "buy");
  const buyingGuide = GUIDES.buying;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Buy Ready Property", path: "/buy" },
        ])}
      />

      {/* 21st.dev Hero04 */}
      <Hero04
        title="Acquire Ready Homes Across"
        titleLine2="Dubai's Freehold Districts"
        description="Every secondary market listing presented by SWK Properties (RERA ORN 51517) is cross-checked for Title Deed validity, DLD Trakheesi marketing permit, service-charge history, and recent comparable transfers."
        washImage="/img/hero/dubai-skyline-hero.webp"
        primaryImage="/img/communities/downtown-dubai.webp"
        secondaryImage="/img/communities/palm-jumeirah.webp"
        primaryAlt="Downtown Dubai Ready Residences"
        secondaryAlt="Palm Jumeirah Waterfront Villas"
        animation="subtle"
        primaryCTA={{
          ctaEnabled: true,
          text: "Filter All Ready Inventory",
          link: "/properties?purpose=buy",
        }}
        secondaryCTA={{
          ctaEnabled: true,
          text: "Read Dubai Buying Guide",
          link: "/guides/buying",
          variant: "outline",
        }}
      />

      {/* Verified Ready Listings Grid */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
              Secondary Market · Title Deed Ready
            </p>
            <h2 className="mt-1 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
              Verified Properties For Sale in Dubai
            </h2>
          </div>
          <Link
            href="/properties?purpose=buy"
            className="rounded-full border border-[#94652c]/35 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#94652c] hover:bg-[#f6ead7]"
          >
            Open Advanced Search →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {buyListings.map((listing) => (
            <PropertyCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>

      {/* Upfront DLD 4% & Secondary Acquisition Cost Breakdown (AEO Table) */}
      <section className="border-y border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
              Transparent Fee Schedule · RERA ORN {SITE.reraOrn}
            </span>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-[#0f2244]">
              {buyingGuide.comparisonTable.caption}
            </h2>
            <p className="mt-2 text-sm text-[#39455a] leading-relaxed">
              {buyingGuide.directAnswer}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#e6dfd2] bg-white">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="border-b border-[#e6dfd2] bg-[#faf7f2] text-[#94652c]">
                <tr>
                  {buyingGuide.comparisonTable.headers.map((h) => (
                    <th key={h} className="p-4 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd2] text-[#39455a]">
                {buyingGuide.comparisonTable.rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-4 ${cIdx === 0 ? "font-semibold text-[#0f2244]" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calculators"
              className="rounded-full bg-[#0f2244] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Calculate Exact DLD 4% & Mortgage Repayments
            </Link>
            <Link
              href="/guides/buying"
              className="rounded-full border border-[#e6dfd2] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f2244] hover:border-[#94652c]"
            >
              Read Full Step-by-Step Buying Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Buyer Consultation Form */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <EnquiryForm
          context="property"
          heading="Request a Custom Buyer Shortlist & DLD Comparable Pack"
          subheading="Tell us your target communities, bedrooms, and whether you are purchasing in cash or with a UAE mortgage."
        />
      </section>
    </>
  );
}
