import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import HolographicBeams from "@/components/ui/beams-background";
import InteractiveSelector from "@/components/ui/interactive-selector";
import { ScrollingFeatureShowcase } from "@/components/ui/interactive-scrolling-story-component";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { servicePages } from "@/lib/services";
import { breadcrumbLd, buildMeta, KEYWORDS } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export const metadata: Metadata = buildMeta({
  title: "Real Estate Advisory, Off-Plan, Secondary Brokerage, Leasing & Property Management",
  description:
    "Explore SWK Properties' 8 full-cycle Dubai real estate services: Off-Plan Advisory, Secondary Sales, Residential & Commercial Leasing, Investment Advisory, Property Management, Mortgages, Legal/DLD Documentation, and Interior Fit-out.",
  path: "/services",
  image: "/img/hero/dubai-services-cinematic.webp",
  keywords: KEYWORDS.services,
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      {/* Hero with 21st.dev HolographicBeams */}
      <section className="relative overflow-hidden border-b border-[#e6dfd2] bg-[#faf7f2] py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-35">
          <HolographicBeams density={26} speed={0.8} opacity={45} className="h-full w-full" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#faf7f2] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
            <ShieldCheck className="h-4 w-4" />
            Full-Cycle Brokerage & Advisory · RERA ORN {SITE.reraOrn}
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl font-serif text-4xl md:text-6xl font-semibold text-[#0f2244]">
            One Regulated Partner From First Shortlist to Managed Tenancy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
            Every SWK service defines its exact scope, step-by-step process, fee structure, and required regulatory documents upfront.
          </p>
        </div>
      </section>

      {/* 21st.dev InteractiveSelector */}
      <section className="mx-auto max-w-7xl px-4">
        <InteractiveSelector />
      </section>

      {/* 8 Dedicated Service Cards Grid (§12) */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
            8 Specialized Practice Areas (§12)
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
              className="group flex flex-col justify-between rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 transition hover:-translate-y-1 hover:border-[#94652c]/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#94652c]">
                    Service 0{idx + 1} · {svc.shortTitle}
                  </span>
                  <span className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1 text-[10px] text-[#39455a]">
                    {svc.steps.length}-Step Process
                  </span>
                </div>

                <h3 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                  {svc.title}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-[#94652c]">{svc.tagline}</p>
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

              <div className="mt-6 flex items-center justify-between border-t border-[#e6dfd2] pt-4 text-xs font-semibold text-[#94652c]">
                <span>Inspect Scope, Process & Fee Transparency</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 21st.dev ScrollingFeatureShowcase */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <ScrollingFeatureShowcase />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <EnquiryForm
          context="general"
          heading="Book a Service Briefing With SWK Properties"
          subheading="Tell us which service you need—buying, selling, leasing, property management, mortgage referrals, or DLD conveyancing."
        />
      </section>
    </>
  );
}
