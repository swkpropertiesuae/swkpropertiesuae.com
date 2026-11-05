import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BookOpen, Calculator, CheckCircle2, ShieldCheck } from "lucide-react"
import { GUIDES, getGuide } from "@/lib/guides"
import { buildMetadata, articleSchema, faqSchema, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { EnquiryForm } from "@/components/site/enquiry-form"

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) {
    return buildMetadata({
      title: "Guide Not Found",
      description: "The requested SWK guide could not be found.",
      path: `/guides/${slug}`,
    })
  }
  return buildMetadata({
    title: guide.title,
    description: guide.directAnswer,
    path: `/guides/${guide.slug}`,
    keywords: [
      guide.title,
      guide.eyebrow,
      "Dubai real estate guide",
      "SWK Properties RERA ORN 51517",
    ],
  })
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        id="ld-guide-article"
        data={articleSchema({
          title: guide.title,
          description: guide.directAnswer,
          slug: `guides/${guide.slug}`,
          datePublished: "2026-09-01",
          dateModified: guide.updatedAt,
          image: "/img/hero/dubai-skyline-hero.webp",
          authorName: guide.reviewedBy,
        })}
      />
      <JsonLd id="ld-guide-faq" data={faqSchema(guide.faqs)} />
      <JsonLd
        id="ld-guide-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights & Guides", path: "/insights" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ])}
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#94652c] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All Guides & Insights
          </Link>
          <div className="flex flex-wrap gap-2">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  g.slug === guide.slug
                    ? "bg-[#0f2244] text-white"
                    : "border border-[#e6dfd2] text-[#39455a] hover:border-[#94652c]"
                }`}
              >
                {g.eyebrow}
              </Link>
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="mt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">
            <BookOpen className="h-3.5 w-3.5" /> {guide.eyebrow} · {guide.readTime} · Updated {guide.updatedAt}
          </span>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            {guide.title}
          </h1>
          <p className="mt-3 text-base md:text-lg text-[#39455a] leading-relaxed">
            {guide.subtitle}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#94652c]">
            <ShieldCheck className="h-4 w-4" /> Reviewed by {guide.reviewedBy}
          </div>
        </header>

        {/* Answer-First Direct Answer Box (§37) */}
        <section className="mt-8 rounded-3xl border border-[#94652c]/40 bg-[#151319] p-6 md:p-8">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#94652c]">
            Answer-First Summary (40–60 Word Direct Briefing)
          </div>
          <p className="mt-2 font-serif text-xl md:text-2xl text-[#0f2244] leading-relaxed">
            {guide.directAnswer}
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-2 text-xs text-[#39455a]">
            {guide.keyTakeaways.map((kt, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                <span>{kt}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Sections */}
        <div className="mt-10 space-y-6">
          {guide.sections.map((sec, idx) => (
            <section
              key={idx}
              className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8"
            >
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
                {sec.heading}
              </h2>
              <p className="mt-3 text-sm md:text-base text-[#39455a] leading-relaxed">
                {sec.body}
              </p>
              {sec.bullets && (
                <ul className="mt-4 space-y-2 text-xs md:text-sm text-[#39455a]">
                  {sec.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Comparison Table (§38 Structured Table) */}
        {guide.comparisonTable && (
          <section className="mt-10 rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 overflow-x-auto">
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
              {guide.comparisonTable.caption}
            </h2>
            <table className="mt-4 w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-[#e6dfd2] text-[#94652c]">
                  {guide.comparisonTable.headers.map((h, i) => (
                    <th key={i} className="py-3 pr-4 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd2] text-[#39455a]">
                {guide.comparisonTable.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3.5 pr-4 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Interactive Calculator CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#94652c]/35 bg-[#f6ead7] p-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
              Model Your Numbers in AED & Your Preferred Currency
            </div>
            <p className="mt-1 text-sm text-[#39455a]">
              Use our interactive DLD 4% Purchase Cost, Mortgage Repayment, and Gross-vs-Net Rental Yield calculators.
            </p>
          </div>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 rounded-full bg-[#0f2244] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white"
          >
            <Calculator className="h-4 w-4" /> Open Calculators →
          </Link>
        </div>

        {/* FAQs */}
        <section className="mt-10 rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
            Frequently Asked Questions — {guide.eyebrow}
          </h2>
          <div className="mt-5 space-y-4">
            {guide.faqs.map((f, idx) => (
              <div key={idx} className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-5">
                <h3 className="text-sm md:text-base font-semibold text-[#94652c]">{f.q}</h3>
                <p className="mt-2 text-xs md:text-sm text-[#39455a] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Enquiry Form */}
        <div className="mt-12">
          <EnquiryForm
            context={
              guide.slug === "selling"
                ? "selling"
                : guide.slug === "renting"
                  ? "renting"
                  : "buying"
            }
            subject={`${guide.title} — Written Checklist & Consultation`}
            heading={`Speak With a Specialist About ${guide.eyebrow}`}
          />
        </div>
      </div>
    </div>
  )
}
