import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, CheckCircle2, ExternalLink, ShieldCheck, UserCheck } from "lucide-react"
import { blogArticles, getBlogArticle } from "@/lib/blog"
import { listings } from "@/lib/listings"
import { buildMetadata, articleSchema, faqSchema, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { PropertyCard } from "@/components/site/property-card"
import { EnquiryForm } from "@/components/site/enquiry-form"

export function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getBlogArticle(slug)
  if (!article) {
    return buildMetadata({
      title: "Article Not Found",
      description: "Requested SWK market briefing could not be found.",
      path: `/insights/${slug}`,
    })
  }
  return buildMetadata({
    title: article.title,
    description: article.directAnswer,
    path: `/insights/${article.slug}`,
    ogImage: article.image,
    keywords: [
      article.title,
      article.category,
      "SWK Properties research",
      "Dubai real estate guide",
      "DLD RERA ORN 51517",
    ],
  })
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getBlogArticle(slug)
  if (!article) notFound()

  const relatedListings = listings.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        id="ld-article"
        data={articleSchema({
          title: article.title,
          description: article.directAnswer,
          slug: article.slug,
          datePublished: article.date,
          dateModified: article.updatedAt,
          image: article.image,
          authorName: article.author.name,
        })}
      />
      <JsonLd id="ld-article-faq" data={faqSchema(article.faqs)} />
      <JsonLd
        id="ld-article-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: article.title, path: `/insights/${article.slug}` },
        ])}
      />

      <article className="mx-auto max-w-5xl px-4 py-12">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#94652c] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to All Market Insights
        </Link>

        {/* Header */}
        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#5f6a82]">
            <span className="rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3 py-1 font-semibold uppercase tracking-[0.18em] text-[#94652c]">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#94652c]" /> Published: {article.date}
            </span>
            <span>·</span>
            <span>Last Reviewed: {article.updatedAt}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-tight">
            {article.title}
          </h1>

          {/* Author & RERA Reviewer Block (§42) */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl border border-[#e6dfd2] bg-white p-4 text-xs">
            <div className="flex items-start gap-3">
              <UserCheck className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#5f6a82]">
                  Written By
                </div>
                <Link
                  href={`/agents/${article.author.slug}`}
                  className="font-semibold text-[#0f2244] hover:text-[#94652c]"
                >
                  {article.author.name} — {article.author.role}
                </Link>
                <div className="text-[#5f6a82]">{article.author.credentials}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#5f6a82]">
                  Reviewed for Regulatory Accuracy By
                </div>
                <div className="font-semibold text-[#0f2244]">{article.reviewer.name}</div>
                <div className="text-[#5f6a82]">{article.reviewer.credentials}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-[#e6dfd2]">
          <img
            src={article.image}
            alt={article.title}
            className="h-72 md:h-96 w-full object-cover"
          />
        </div>

        {/* Answer-First AEO Direct Answer Box (§37) */}
        <section
          aria-label="Direct Answer Summary"
          className="mt-8 rounded-3xl border border-[#94652c]/40 bg-[#151319] p-6 md:p-8"
        >
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#94652c]">
            Direct Answer Summary (AEO / GEO Verified)
          </div>
          <p className="mt-2 font-serif text-xl md:text-2xl text-[#0f2244] leading-relaxed">
            {article.directAnswer}
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-2 text-xs text-[#39455a]">
            {article.keyTakeaways.map((kt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                <span>{kt}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Table of Contents + Main Body */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl border border-[#e6dfd2] bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
                Table of Contents
              </div>
              <ol className="mt-4 space-y-2.5 text-xs text-[#39455a]">
                {article.sections.map((sec, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i + 1}`}
                      className="hover:text-[#94652c] transition block"
                    >
                      {i + 1}. {sec.title}
                    </a>
                  </li>
                ))}
              </ol>

              <div className="mt-6 border-t border-[#e6dfd2] pt-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94652c]">
                  Official Verification Sources
                </div>
                <ul className="mt-2.5 space-y-2 text-xs">
                  {article.sources.map((src, i) => (
                    <li key={i}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#39455a] hover:text-[#94652c]"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-[#94652c]" />
                        {src.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-8">
            {article.sections.map((sec, i) => (
              <section
                key={i}
                id={`section-${i + 1}`}
                className="scroll-mt-28 rounded-3xl border border-[#e6dfd2] bg-white/80 p-6 md:p-8"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94652c]">
                  Step 0{i + 1}
                </span>
                <h2 className="mt-1 font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
                  {sec.title}
                </h2>
                <p className="mt-3 text-sm md:text-base text-[#39455a] leading-relaxed">
                  {sec.text}
                </p>
              </section>
            ))}

            {/* Article FAQs */}
            <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8">
              <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
                Frequently Asked Questions
              </h2>
              <div className="mt-4 space-y-4">
                {article.faqs.map((faq, i) => (
                  <div key={i} className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                    <h3 className="text-sm font-semibold text-[#94652c]">{faq.q}</h3>
                    <p className="mt-1.5 text-xs md:text-sm text-[#39455a] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Editorial Disclaimer */}
            <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4 text-xs text-[#5f6a82] leading-relaxed">
              <strong className="text-[#94652c]">Regulatory & Editorial Notice:</strong> This briefing is published by SWK Properties (RERA ORN 51517) for general educational and property-research purposes only. It does not constitute legal, tax, mortgage, or immigration advice. Always verify current fees, escrow accounts, and residency rules directly with the Dubai Land Department (DLD), RERA, or a licensed legal adviser.
            </div>
          </div>
        </div>
      </article>

      {/* Related Verified Listings */}
      <section className="mx-auto max-w-7xl px-4 py-14 border-t border-[#e6dfd2]">
        <h2 className="font-serif text-2xl md:text-4xl font-semibold text-[#0f2244] mb-8">
          Verified Properties to Compare Alongside This Guide
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {relatedListings.map((l) => (
            <PropertyCard key={l.slug} listing={l} />
          ))}
        </div>
      </section>

      {/* Consultation Form */}
      <section className="border-t border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-4xl px-4">
          <EnquiryForm
            context="advisory"
            subject={`Briefing Enquiry: ${article.title}`}
            heading="Discuss This Topic With a RERA-Licensed SWK Consultant"
          />
        </div>
      </section>
    </div>
  )
}
