import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { LivelyPageHero } from "@/components/ui/lively-page-hero";
import InteractiveSelector from "@/components/ui/interactive-selector";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { servicePages } from "@/lib/services";
import { breadcrumbLd, buildMeta, KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = buildMeta({
  title: "Real Estate Advisory, Off-Plan, Secondary Brokerage, Leasing & Property Management",
  description:
    "Explore SWK Properties' full-cycle UAE real estate services: Off-Plan Advisory, Secondary Sales, Residential & Commercial Leasing, Investment Advisory, Property Management, Mortgages, and Conveyancing.",
  path: "/services",
  image: "/img/hero/dubai-services-cinematic.webp",
  keywords: KEYWORDS.services,
});

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <LivelyPageHero
        badge="Full-Cycle Brokerage & Advisory · Sheikh Zayed Road"
        title="One Partner From First Shortlist to"
        highlight="Managed Tenancy"
        description="Every SWK service defines its exact scope, step-by-step process, fee structure, and required documents upfront."
        backgroundImage="/img/hero/slides/04-azizi-venice-desktop.webp"
        primaryCta={{ label: "Explore 8 Advisory Services", href: "#services-grid" }}
        secondaryCta={{ label: "Book Private Consultation", href: "/contact" }}
        sideImages={[
          {
            src: "/img/hero/slides/06-damac-islands-desktop.webp",
            label: "Off-Plan & Secondary Sales",
            sublabel: "Escrow Verification · DLD Form F & Trustee Transfer",
          },
          {
            src: "/img/communities/dubai-marina.webp",
            label: "Leasing, Ejari & Property Management",
            sublabel: "Tenant Screening · Snagging · Annual Renewals",
          },
        ]}
      />

      {/* 8 Dedicated Service Cards Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
            8 Specialized Practice Areas
          </p>
          <h2 className="mt-1 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            Explore Our Real Estate Services
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {servicePages.map((svc, idx) => (
            <Link
              key={svc.slug}
              href={`/services/${svc.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#94652c]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#94652c]">
                    Service 0{idx + 1} · {svc.shortTitle}
                  </span>
                  <span className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1 text-[10px] font-semibold text-[#39455a]">
                    {svc.steps.length}-Step Process
                  </span>
                </div>

                <h3 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                  {svc.title}
                </h3>
                <p className="mt-2 text-xs md:text-sm font-semibold text-[#94652c]">{svc.tagline}</p>
                <p className="mt-3 text-xs md:text-sm text-[#39455a] leading-relaxed">
                  {svc.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-[#e6dfd2] pt-4 text-xs text-[#39455a]">
                  {svc.whatIsIncluded.slice(0, 3).map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#e6dfd2] pt-4 text-xs font-bold text-[#0f2244] group-hover:text-[#94652c]">
                <span>Inspect Scope, Process &amp; Fee Clarity</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Charter Selector */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-10 shadow-sm">
          <InteractiveSelector />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <EnquiryForm
          context="general"
          heading="Book a Service Briefing With SWK Properties"
          subheading="Tell us which service you need—buying, selling, leasing, property management, mortgage referrals, or conveyancing."
        />
      </section>
    </div>
  );
}
