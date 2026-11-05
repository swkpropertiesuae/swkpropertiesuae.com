import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Award, Building2, CheckCircle2, MapPin, Phone, ShieldCheck, Users } from "lucide-react"
import { SITE, stats } from "@/lib/swk"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { Team } from "@/components/sections/home-sections"
import { EnquiryForm } from "@/components/site/enquiry-form"
import { LivelyPageHero } from "@/components/ui/lively-page-hero"

export const metadata: Metadata = buildMetadata({
  title: "About SWK Properties — Sheikh Zayed Road Real Estate Advisory, Dubai",
  description:
    "Backed by 18+ years of UAE market experience across 27+ partner developers and 108+ verified projects, SWK Properties advises buyers, investors, and landlords from Al Saqr Business Tower, Sheikh Zayed Road, Dubai.",
  path: "/about",
  keywords: [
    "About SWK Properties Dubai",
    "Al Saqr Business Tower real estate brokerage",
    "Sheikh Zayed Road property consultants",
    "SWK Properties team",
  ],
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        id="ld-about-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About SWK Properties", path: "/about" },
        ])}
      />

      <LivelyPageHero
        badge="27th Floor · Al Saqr Business Tower · Sheikh Zayed Road"
        title="18+ Years Guiding Buyers Across"
        highlight="Dubai & The UAE"
        description="We built SWK Properties around a simple standard: real estate decisions should be led by verified developer track records, clear floor-plate comparisons, and written cost sheets before any commitment."
        backgroundImage="/img/hero/slides/01-dubai-horizon-desktop.webp"
        primaryCta={{ label: "Meet Our 25+ Team", href: "#team" }}
        secondaryCta={{ label: "Visit Our Sheikh Zayed Road Office", href: "/contact" }}
        sideImages={[
          {
            src: "/img/about/private-consultation-lounge.jpg",
            label: "27th Floor · Al Saqr Business Tower",
            sublabel: "Sheikh Zayed Road Advisory Suite",
          },
          {
            src: "/img/hero/slides/04-azizi-venice-desktop.webp",
            label: "25+ Real Estate Professionals",
            sublabel: "18+ Years UAE Experience · 27+ Developers",
          },
        ]}
      />

      {/* Company Story, Mission & Real Office Photograph */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#94652c]">
              <Building2 className="h-3.5 w-3.5" /> Sheikh Zayed Road Headquarters · Dubai
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-tight">
              A Practice Built on the Quiet Work After the Brochure
            </h2>
            <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
              With over 18 years of hands-on experience in the UAE property market, our leadership and advisory team works across 27+ partner developers and 108+ verified projects spanning Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, and Umm Al Quwain.
            </p>
            <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
              From our 27th-floor suite at Al Saqr Business Tower on Sheikh Zayed Road, we advise local families, regional landlords, and international buyers in English, Arabic, French, Hindi, Urdu, and Punjabi—handling everything from launch-day off-plan allocations in Azizi Venice, Emaar The Oasis, and DAMAC Islands to secondary transfers and annual leasing.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#e6dfd2] bg-white p-4 shadow-xs"
                >
                  <div className="font-hero-raleway font-light text-3xl font-bold text-[#94652c]">
                    {s.value}
                    {s.suffix}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-[#0f2244]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm">
              <img
                src="/img/about/swk-office.webp"
                alt="SWK Properties Office at Al Saqr Business Tower, Sheikh Zayed Road, Dubai"
                className="h-80 md:h-[420px] w-full object-cover"
              />
              <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e6dfd2]">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94652c]">
                    Physical Headquarters
                  </div>
                  <div className="mt-1 text-sm font-medium text-[#0f2244]">{SITE.address.full}</div>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${SITE.geo.lat},${SITE.geo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#94652c]/35 px-4 py-2 text-xs font-semibold text-[#94652c] hover:bg-[#0f2244] hover:text-white transition"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Single Dedicated 9-Member Team Section with Animated Track-Record Popup Modal */}
      <Team />

      {/* Advisory Standards & Client Commitments */}
      <section className="border-y border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 shadow-xs">
              <Award className="h-6 w-6 text-[#94652c]" />
              <h2 className="mt-4 font-serif text-2xl font-semibold text-[#0f2244]">
                Direct Developer Relationships
              </h2>
              <p className="mt-2 text-xs md:text-sm text-[#39455a] leading-relaxed">
                Our team maintains active advisory desks across 27+ UAE developers—including Emaar, Sobha Realty, DAMAC, Azizi, Binghatti, Ellington, Aldar, Arada, Samana, Danube, and Marjan—giving our clients direct access to priority floor plates and launch allocations.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 shadow-xs">
              <CheckCircle2 className="h-6 w-6 text-[#94652c]" />
              <h2 className="mt-4 font-serif text-2xl font-semibold text-[#0f2244]">
                Our Service Commitments
              </h2>
              <ul className="mt-3 space-y-2 text-xs text-[#39455a]">
                <li>• Same-business-day response to enquiries during Dubai GST hours.</li>
                <li>• Written itemised DLD, trustee, and agency fee sheets before any commitment.</li>
                <li>• Honest community briefings covering both advantages and practical trade-offs.</li>
                <li>• Dedicated sales and operations coordination from reservation to handover.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 shadow-xs">
              <Users className="h-6 w-6 text-[#94652c]" />
              <h2 className="mt-4 font-serif text-2xl font-semibold text-[#0f2244]">
                Direct Leadership Access
              </h2>
              <p className="mt-2 text-xs md:text-sm text-[#39455a] leading-relaxed">
                Whether you are acquiring a single investment apartment or structuring a multi-unit family office portfolio, you can reach our management desk directly at{" "}
                <a href={`mailto:${SITE.email}`} className="text-[#94652c] underline">
                  {SITE.email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${SITE.phoneTel}`} className="text-[#94652c] underline">
                  {SITE.phone}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <EnquiryForm
            context="general"
            subject="About SWK — Office Visit & Advisory Consultation"
            heading="Arrange a Private Meeting at Al Saqr Business Tower"
          />
        </div>
      </section>
    </div>
  )
}
