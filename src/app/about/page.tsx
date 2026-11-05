import type { Metadata } from "next"
import Link from "next/link"
import { Award, Building2, CheckCircle2, MapPin, Phone, ShieldCheck, Users } from "lucide-react"
import { SITE, team, stats } from "@/lib/swk"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import SunsetSkylineHero from "@/components/ui/sunset-skyline-hero"
import { PhotoGallery } from "@/components/ui/designali-gallery"
import { ParallaxComponent } from "@/components/ui/parallax-scrolling"
import CinematicScrol from "@/components/ui/scroll-triggered-video-hero"
import { ScrollFlyIn } from "@/components/ui/hero-section-3"
import { Team } from "@/components/sections/home-sections"
import { EnquiryForm } from "@/components/site/enquiry-form"

export const metadata: Metadata = buildMetadata({
  title: "About SWK Properties — RERA Licensed Dubai Brokerage (ORN 51517)",
  description:
    "SWK Properties is a RERA-licensed Dubai real estate brokerage (ORN 51517) headquartered at Al Saqr Business Tower, Sheikh Zayed Road. Meet our multilingual consultants and review our regulatory standards.",
  path: "/about",
  keywords: [
    "About SWK Properties Dubai",
    "RERA ORN 51517",
    "Al Saqr Business Tower real estate brokerage",
    "Sheikh Zayed Road property consultants",
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

      {/* Sunset Skyline Hero */}
      <SunsetSkylineHero />

      {/* Checklist §13: Company Story, Mission, RERA ORN 51517 & Real Office Photograph */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#94652c]">
              <ShieldCheck className="h-3.5 w-3.5" /> RERA ORN {SITE.orn} · Sheikh Zayed Road, Dubai
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-tight">
              A Practice Built on the Quiet Work After the Brochure
            </h1>
            <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
              SWK Properties was founded with a straightforward conviction: buying, selling, or leasing property in Dubai and the UAE should be led by verifiable paperwork, delivered track records, and clear fee sheets—never artificial urgency or unverified return promises.
            </p>
            <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
              From our 27th-floor headquarters at Al Saqr Business Tower on Sheikh Zayed Road, our multilingual advisory team serves local families, regional landlords, and international investors across English, Arabic, French, Hindi, Urdu, Punjabi, and Russian.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#e6dfd2] bg-white p-4"
                >
                  <div className="font-serif text-2xl font-semibold text-[#94652c]">
                    {s.value}
                    {s.suffix}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-[#0f2244]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white">
              <img
                src="/img/about/swk-office.webp"
                alt="SWK Properties Office at Al Saqr Business Tower, Sheikh Zayed Road, Dubai"
                className="h-80 md:h-[420px] w-full object-cover"
              />
              <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e6dfd2]">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94652c]">
                    Verified Physical Headquarters
                  </div>
                  <div className="mt-1 text-sm text-[#0f2244]">{SITE.address.full}</div>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${SITE.geo.lat},${SITE.geo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#94652c]/35 px-4 py-2 text-xs font-semibold text-[#94652c] hover:bg-[#0f2244] hover:text-white"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Credentials, Service Standards & Complaints Procedure (§13) */}
      <section className="border-y border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6">
              <Award className="h-6 w-6 text-[#94652c]" />
              <h2 className="mt-4 font-serif text-2xl font-semibold text-[#0f2244]">
                RERA & DLD Regulatory Standing
              </h2>
              <p className="mt-2 text-xs md:text-sm text-[#39455a] leading-relaxed">
                SWK Properties is licensed in Dubai under RERA Office Registration Number (ORN) {SITE.orn}. Every advertised resale or rental listing carries a verified Trakheesi permit and Madmoun QR reference, and all off-plan reservations are routed strictly to project-specific DLD escrow accounts.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6">
              <CheckCircle2 className="h-6 w-6 text-[#94652c]" />
              <h2 className="mt-4 font-serif text-2xl font-semibold text-[#0f2244]">
                Our Service Commitments
              </h2>
              <ul className="mt-3 space-y-2 text-xs text-[#39455a]">
                <li>• Same-business-day response to enquiries received during GST hours.</li>
                <li>• Written itemised DLD, trustee, and agency fee sheets before any commitment.</li>
                <li>• Balanced community briefings covering both advantages and practical trade-offs.</li>
                <li>• Named primary and backup consultant on every client file.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6">
              <Users className="h-6 w-6 text-[#94652c]" />
              <h2 className="mt-4 font-serif text-2xl font-semibold text-[#0f2244]">
                Compliance & Client Feedback Desk
              </h2>
              <p className="mt-2 text-xs md:text-sm text-[#39455a] leading-relaxed">
                If a listing detail appears outdated, or if you wish to escalate a service or compliance matter, contact our Compliance Desk directly at{" "}
                <a href={`mailto:${SITE.email}`} className="text-[#94652c] underline">
                  {SITE.email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${SITE.phoneTel}`} className="text-[#94652c] underline">
                  {SITE.phone}
                </a>
                . Every formal complaint is acknowledged within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Executive Staff & Advisor Spotlight (Moved from Homepage per User Request) */}
      <Team />

      {/* Complete 5-Advisor Directory Cards linking to /agents/[slug] (§14) */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94652c]">
              Individual Consultant Profiles · Checklist §14
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
              Direct Consultant Directory &amp; Active Mandates
            </h2>
          </div>
          <p className="max-w-md text-xs text-[#39455a]">
            Click any consultant card to view their full specialist profile, languages spoken, active property listings, and direct viewing appointment calendar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {team.map((member) => (
            <Link
              key={member.slug}
              href={`/agents/${member.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm transition hover:border-[#94652c]"
            >
              <div>
                <div className="relative h-64 w-full overflow-hidden bg-[#faf7f2]">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#94652c]">
                    {member.role}
                  </div>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                    {member.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#39455a]">{member.focus}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {member.languages.map((lang) => (
                      <span
                        key={lang}
                        className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-2 py-0.5 text-[10px] text-[#39455a]"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-[#e6dfd2] px-5 py-3 text-xs font-semibold text-[#94652c]">
                View Profile &amp; Listings →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 21st.dev Architectural Gallery, Parallax & Scroll Showcases */}
      <PhotoGallery />
      <ParallaxComponent />
      <CinematicScrol />
      <ScrollFlyIn imageUrl="/img/hero/dubai-skyline-hero.webp">
        <div className="mx-auto max-w-4xl text-center py-12 px-4">
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            Clarity From First Shortlist to Key Handover
          </h2>
        </div>
      </ScrollFlyIn>

      {/* Consultation Form */}
      <section className="border-t border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-5xl px-4">
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
