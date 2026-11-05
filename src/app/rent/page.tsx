import type { Metadata } from "next";
import Link from "next/link";
import { LivelyPageHero } from "@/components/ui/lively-page-hero";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { LISTINGS } from "@/lib/listings";
import { GUIDES } from "@/lib/guides";
import { breadcrumbLd, buildMeta } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export const metadata: Metadata = buildMeta({
  title: "Rent & Lease Property in Dubai | Annual Ejari Apartments, Villas & Townhouses",
  description:
    "Verified residential and executive rentals across Dubai Marina, Sheikh Zayed Road, Downtown Dubai, JVC & Dubai Hills. Official RERA tenancy contracts & Ejari support by SWK Properties (ORN 51517).",
  path: "/rent",
  image: "/img/communities/dubai-marina.webp",
  keywords: [
    "rent apartment in Dubai",
    "Dubai Marina apartments for rent",
    "annual rent Dubai Ejari",
    "JVC townhouses for rent",
    "Sheikh Zayed Road apartments for rent",
    "SWK Properties leasing",
  ],
});

export default function RentPage() {
  const rentListings = LISTINGS.filter((l) => l.purpose === "rent");
  const rentingGuide = GUIDES.renting;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Rent & Lease", path: "/rent" },
        ])}
      />

      <LivelyPageHero
        badge="Annual & Executive Leasing · Official Ejari Registration"
        title="Annual & Executive Leasing With"
        highlight="Official Ejari Registration"
        description="Every rental listing displays its annual rate, cheque flexibility, security deposit percentage, furnishing state, and DLD Trakheesi permit. We handle tenancy contracts, Ejari, and DEWA move-in coordination."
        backgroundImage="/img/communities/dubai-marina.webp"
        primaryCta={{ label: "Filter All Rental Listings", href: "/properties?purpose=rent" }}
        secondaryCta={{ label: "Read Dubai Tenant Guide", href: "/guides/renting" }}
        sideImages={[
          {
            src: "/img/communities/dubai-marina.webp",
            label: "Dubai Marina & Sheikh Zayed Road",
            sublabel: "1 to 4 Cheques · Furnished & Unfurnished",
            href: "/properties?purpose=rent",
          },
          {
            src: "/img/communities/downtown-dubai.webp",
            label: "Downtown Dubai & Dubai Hills",
            sublabel: "Immediate Move-In · Full Ejari & DEWA Setup",
            href: "/properties?purpose=rent",
          },
        ]}
      />

      {/* Verified Rental Listings */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
              Immediate & Upcoming Move-In · Ejari Compliant
            </p>
            <h2 className="mt-1 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
              Available Properties For Rent in Dubai
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/list-your-property"
              className="rounded-full border border-[#e6dfd2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f2244] hover:border-[#94652c]"
            >
              Landlords: Lease Out Your Property
            </Link>
            <Link
              href="/properties?purpose=rent"
              className="rounded-full bg-[#0f2244] px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white"
            >
              Search All Rentals →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {rentListings.map((listing) => (
            <PropertyCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>

      {/* Tenant Upfront Cost & Ejari Table */}
      <section className="border-y border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
              Dubai Tenancy & Ejari Checklist
            </span>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-[#0f2244]">
              {rentingGuide.comparisonTable.caption}
            </h2>
            <p className="mt-2 text-sm text-[#39455a] leading-relaxed">
              {rentingGuide.directAnswer}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#e6dfd2] bg-white">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="border-b border-[#e6dfd2] bg-[#faf7f2] text-[#94652c]">
                <tr>
                  {rentingGuide.comparisonTable.headers.map((h) => (
                    <th key={h} className="p-4 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd2] text-[#39455a]">
                {rentingGuide.comparisonTable.rows.map((row, idx) => (
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
              href="/guides/renting"
              className="rounded-full bg-[#0f2244] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Read Complete Dubai Renting & Ejari Guide
            </Link>
            <Link
              href="/calculators"
              className="rounded-full border border-[#e6dfd2] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f2244] hover:border-[#94652c]"
            >
              Compare Buy vs Rent Calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <EnquiryForm
          context="viewing"
          heading="Book a Rental Viewing or Corporate Relocation Briefing"
          subheading="Let us know your preferred move-in date, cheque preference (1–4 cheques), and Dubai commute location."
          defaultViewingPicker={true}
        />
      </section>
    </>
  );
}
