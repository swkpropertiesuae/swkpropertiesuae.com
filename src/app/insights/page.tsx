import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, Calculator, CheckCircle2, FileText, ShieldCheck } from "lucide-react"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { blogArticles } from "@/lib/blog"
import { GUIDES } from "@/lib/guides"
import { ParticleTitle } from "@/components/ui/particle-title"
import { EnquiryForm } from "@/components/site/enquiry-form"

export const metadata: Metadata = buildMetadata({
  title: "Dubai Real Estate Insights, Market Briefings & Buyer Guides",
  description:
    "Answer-first Dubai and UAE real estate research, DLD escrow and Oqood guides, Golden Visa property checklists, developer track-record analysis, and rental yield worksheets by SWK Properties (RERA ORN 51517).",
  path: "/insights",
  keywords: [
    "Dubai real estate market insights 2026",
    "Dubai off-plan escrow Oqood guide",
    "UAE Golden Visa AED 2M property",
    "Dubai rental yield comparison JVC Business Bay Marina",
  ],
})

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        id="ld-insights-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Market Insights & Guides", path: "/insights" },
        ])}
      />

      {/* Hero with ParticleTitle */}
      <section className="relative overflow-hidden border-b border-[#e6dfd2] bg-[#0d0c11] py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#94652c]">
              <ShieldCheck className="h-3.5 w-3.5" /> Answer-First AEO & GEO Research Desk · RERA ORN 51517
            </span>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl font-semibold text-[#0f2244]">
              Dubai Real Estate Intelligence & Practical Field Guides
            </h1>
            <p className="mt-4 text-sm md:text-base text-[#39455a] leading-relaxed">
              Every SWK briefing starts with a direct, plain-English answer backed by Dubai Land Department (DLD) rules, escrow procedures, and real community trade-offs—never generic hype or unsupported yield promises.
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-[#e6dfd2] bg-[#faf7f2] overflow-hidden">
            <ParticleTitle text="SWK INSIGHTS" className="h-[240px] md:h-[300px]" />
          </div>
        </div>
      </section>

      {/* Core Guides & Interactive Calculators Bar (§40, §45) */}
      <section className="mx-auto max-w-7xl px-4 py-14 border-b border-[#e6dfd2]">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94652c]">
              Cornerstone Pillar Guides & Financial Tools
            </p>
            <h2 className="mt-1 font-serif text-2xl md:text-4xl font-semibold text-[#0f2244]">
              Step-by-Step UAE Property Handbooks
            </h2>
          </div>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 rounded-full bg-[#0f2244] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#f3dfb1]"
          >
            <Calculator className="h-4 w-4" /> Open DLD 4%, Mortgage & Yield Calculators →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-[#e6dfd2] bg-white p-6 transition hover:border-[#94652c]/40"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#94652c]/30 bg-[#f6ead7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#94652c]">
                  <BookOpen className="h-3 w-3" /> {g.eyebrow}
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                  {g.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs text-[#39455a] leading-relaxed">
                  {g.directAnswer}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[#e6dfd2] pt-3 text-xs font-semibold text-[#94652c]">
                <span>{g.readTime}</span>
                <span>Read Guide →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All 10 Research Articles */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94652c]">
            10 Verified Editorial Briefings
          </p>
          <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            Market Analysis, Escrow Paper Trail & Due-Diligence Briefings
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {blogArticles.map((art) => (
            <Link
              key={art.slug}
              href={`/insights/${art.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white transition hover:border-[#94652c]/45"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#94652c]">
                    {art.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-[11px] text-[#5f6a82]">
                    <span>Published {art.date}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                    {art.title}
                  </h3>
                  <div className="mt-3 rounded-2xl border border-[#94652c]/20 bg-[#0f2244]/5 p-3.5 text-xs text-[#39455a] leading-relaxed">
                    <strong className="block text-[10px] uppercase tracking-[0.16em] text-[#94652c] mb-1">
                      Direct Answer
                    </strong>
                    {art.directAnswer}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e6dfd2] px-6 py-4 text-xs">
                <span className="text-[#5f6a82]">By {art.author.name}</span>
                <span className="font-semibold text-[#94652c]">Full Briefing →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Consultation Form */}
      <section className="border-t border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-5xl px-4">
          <EnquiryForm
            context="advisory"
            subject="Market Research & Side-by-Side Property Worksheet Request"
            heading="Request a Custom Property Comparison Worksheet"
            subheading="Tell us the communities or off-plan launches you are comparing. Our Sheikh Zayed Road advisory desk will prepare an itemised cash-flow and cost comparison."
          />
        </div>
      </section>
    </div>
  )
}
