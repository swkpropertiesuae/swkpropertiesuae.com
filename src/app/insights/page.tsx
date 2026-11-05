import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, Calculator, FileText } from "lucide-react"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { blogArticles } from "@/lib/blog"
import { GUIDES } from "@/lib/guides"
import { LivelyPageHero } from "@/components/ui/lively-page-hero"
import { EnquiryForm } from "@/components/site/enquiry-form"

export const metadata: Metadata = buildMetadata({
  title: "Dubai & UAE Real Estate Insights, Market Briefings & Buyer Guides",
  description:
    "Dubai and UAE real estate research, off-plan payment plan guides, Golden Visa property checklists, developer track-record analysis, and rental yield worksheets by SWK Properties.",
  path: "/insights",
  keywords: [
    "Dubai real estate market insights 2026",
    "Dubai off-plan escrow Oqood guide",
    "UAE Golden Visa AED 2M property",
    "Dubai rental yield comparison",
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

      <LivelyPageHero
        badge="Market Research & Buyer Handbooks"
        title="Dubai & UAE Real Estate"
        highlight="Intelligence & Field Guides"
        description="Every briefing starts with a direct, plain-English answer backed by actual Dubai Land Department procedures, payment plan mechanics, and real community trade-offs."
        backgroundImage="/img/hero/slides/01-dubai-horizon-desktop.webp"
        primaryCta={{ label: "Open DLD & Yield Calculators", href: "/calculators" }}
        secondaryCta={{ label: "Browse All Market Briefings", href: "#briefings-grid" }}
        sideImages={[
          {
            src: "/img/hero/slides/02-imtiaz-kore-desktop.webp",
            label: "Off-Plan Escrow & Oqood Mechanics",
            sublabel: "Step-by-Step Buyer Protection Guides",
          },
          {
            src: "/img/hero/slides/05-sobha-century-desktop.webp",
            label: "AED 2M+ UAE Golden Visa Checklists",
            sublabel: "10-Year Residency Eligibility & DLD Rules",
          },
        ]}
      />

      {/* Core Guides & Interactive Calculators Bar */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 border-b border-[#e6dfd2]">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94652c]">
              Cornerstone Pillar Guides &amp; Financial Tools
            </p>
            <h2 className="mt-1 font-serif text-2xl md:text-4xl font-semibold text-[#0f2244]">
              Step-by-Step UAE Property Handbooks
            </h2>
          </div>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f2244] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#94652c]"
          >
            <Calculator className="h-4 w-4 text-[#dcb888]" /> Open DLD 4%, Mortgage &amp; Yield Calculators →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-[#e6dfd2] bg-white p-6 shadow-sm transition hover:border-[#94652c]"
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
              <div className="mt-5 flex items-center justify-between border-t border-[#e6dfd2] pt-3 text-xs font-bold text-[#94652c]">
                <span>{g.readTime}</span>
                <span>Read Guide →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 10 Market Articles Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94652c]">
            10 Research Briefings
          </p>
          <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            Latest Market Briefings &amp; Regulatory Updates
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogArticles.map((art) => (
            <Link
              key={art.slug}
              href={`/insights/${art.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#94652c] hover:shadow-lg"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#0f2244]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#dcb888]">
                    {art.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-[#5f6a82]">
                    <span>{art.date}</span>
                    <span>·</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                    {art.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs text-[#39455a] leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>
              <div className="border-t border-[#e6dfd2] bg-[#faf7f2] px-6 py-4 text-xs font-bold text-[#0f2244] group-hover:text-[#94652c] flex items-center justify-between">
                <span>Read Full Briefing</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Consultation Form */}
      <section className="border-t border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <EnquiryForm
            context="investment"
            subject="Insights Desk — Custom Market & Yield Briefing Request"
            heading="Request a Custom Community or Project Comparison"
          />
        </div>
      </section>
    </div>
  )
}
