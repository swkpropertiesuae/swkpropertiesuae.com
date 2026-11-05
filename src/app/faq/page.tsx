import type { Metadata } from "next"
import Link from "next/link"
import { HelpCircle, ShieldCheck } from "lucide-react"
import { faqs } from "@/lib/swk"
import { GUIDES } from "@/lib/guides"
import { buildMetadata, faqSchema, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { EnquiryForm } from "@/components/site/enquiry-form"

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions — Buying, Renting, Off-Plan & DLD Rules in Dubai",
  description:
    "Direct answers to common questions about buying ready or off-plan property in Dubai, DLD 4% fees, escrow and Oqood registration, UAE Golden Visa eligibility, Ejari leasing, and selling with RERA Form A.",
  path: "/faq",
  keywords: [
    "Dubai real estate FAQ",
    "DLD 4% fee FAQ",
    "Oqood escrow Dubai FAQ",
    "SWK Properties RERA ORN 51517 FAQ",
  ],
})

export default function FaqPage() {
  const combinedFaqs = [
    ...faqs,
    ...GUIDES.flatMap((g) => g.faqs),
  ]

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd id="ld-faq-page" data={faqSchema(combinedFaqs)} />
      <JsonLd
        id="ld-faq-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Frequently Asked Questions", path: "/faq" },
        ])}
      />

      <section className="border-b border-[#e6dfd2] bg-[#f4efe6] py-16">
        <div className="mx-auto max-w-5xl px-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">
            <HelpCircle className="h-3.5 w-3.5" /> Answer-First AEO Knowledge Base · RERA ORN 51517
          </span>
          <h1 className="mt-4 font-hero-raleway text-3xl md:text-5xl font-light uppercase tracking-[0.08em] text-[#0f2244]">
            Frequently Asked Questions About Dubai & UAE Real Estate
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#39455a] leading-relaxed">
            Plain-language answers covering off-plan escrow accounts, Oqood interim registration, secondary-market Form F transfers, Ejari tenancy rules, and RERA Form A seller onboarding.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 space-y-12">
        {/* General SWK & Regulatory FAQs */}
        <section>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#94652c] mb-6">
            Working With SWK Properties & Regulatory Verification
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-3xl border border-[#e6dfd2] bg-white p-6">
                <h3 className="text-base font-semibold text-[#0f2244]">{f.q}</h3>
                <p className="mt-2 text-xs md:text-sm text-[#39455a] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guide-Specific FAQs (Buying, Renting, Selling, Investing) */}
        {GUIDES.map((guide) => (
          <section key={guide.slug}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#94652c]">
                {guide.eyebrow} Questions
              </h2>
              <Link
                href={`/guides/${guide.slug}`}
                className="text-xs font-semibold text-[#94652c] underline"
              >
                Read Full {guide.eyebrow} →
              </Link>
            </div>
            <div className="space-y-4">
              {guide.faqs.map((f, i) => (
                <div key={i} className="rounded-3xl border border-[#e6dfd2] bg-white p-6">
                  <h3 className="text-base font-semibold text-[#0f2244]">{f.q}</h3>
                  <p className="mt-2 text-xs md:text-sm text-[#39455a] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <EnquiryForm
          context="general"
          subject="FAQ Page — Specific Question for SWK Advisory Desk"
          heading="Have a Question Not Covered Above?"
        />
      </div>
    </div>
  )
}
