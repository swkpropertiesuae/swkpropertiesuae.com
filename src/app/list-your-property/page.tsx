import type { Metadata } from "next"
import Link from "next/link"
import { Building2, CheckCircle2, FileCheck2, KeyRound, ShieldCheck, Sparkles } from "lucide-react"
import { SITE } from "@/lib/swk"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { LivelyPageHero } from "@/components/ui/lively-page-hero"
import { EnquiryForm } from "@/components/site/enquiry-form"

export const metadata: Metadata = buildMetadata({
  title: "List Your Property in Dubai — Sell or Lease With SWK Properties",
  description:
    "Instruct SWK Properties (RERA ORN 51517) to sell or lease your Dubai apartment, villa, penthouse, or commercial asset. Request a DLD comparative valuation, RERA Form A onboarding, and Trakheesi permit marketing.",
  path: "/list-your-property",
  keywords: [
    "sell property in Dubai",
    "list property for rent Dubai",
    "RERA Form A Dubai landlord",
    "Dubai property valuation SWK Properties",
  ],
})

const REQUIRED_DOCS = [
  {
    title: "Title Deed or Oqood Certificate",
    detail: "Required by the Dubai Land Department (DLD) to verify ownership and issue an official Trakheesi advertising permit.",
  },
  {
    title: "Owner Passport & Emirates ID Copy",
    detail: "Used to match ownership records and execute the RERA Form A (Brokerage Marketing Agreement) via Dubai REST.",
  },
  {
    title: "Signed RERA Form A & Marketing Permission",
    detail: "Dubai law prohibits advertising any property without a signed Form A and a valid Trakheesi / Madmoun QR permit.",
  },
  {
    title: "Tenancy Status & Service Charge Clearance Info",
    detail: "Current Ejari contract, rent amount, expiry date, or confirmation of vacant possession and service-charge standing.",
  },
]

const SELLER_STEPS = [
  {
    step: "01",
    title: "DLD Comparative Valuation",
    desc: "We pull recent actual DLD transfer and Ejari records in your building or sub-community—separating portal asking prices from achieved transactions.",
  },
  {
    step: "02",
    title: "RERA Form A & Trakheesi Permit",
    desc: "Once terms are agreed, we generate RERA Form A for digital approval and obtain the mandatory DLD Trakheesi permit and Madmoun QR code.",
  },
  {
    step: "03",
    title: "Architectural Photography & Qualification",
    desc: "We commission actual unit photography, verify floor plans, and present your home to pre-qualified cash, mortgage, or corporate tenant enquiries.",
  },
  {
    step: "04",
    title: "Form F / Tenancy Contract, NOC & Transfer",
    desc: "We coordinate the Memorandum of Understanding (Form F) or Ejari lease, developer NOC, mortgage clearance if applicable, and DLD Trustee transfer.",
  },
]

export default function ListYourPropertyPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        id="ld-list-property-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "List Your Property", path: "/list-your-property" },
        ])}
      />

      <LivelyPageHero
        badge={`Seller & Landlord Desk · RERA ORN ${SITE.orn}`}
        title="Sell or Lease Your Dubai Property With"
        highlight="Verified DLD Permits & Honest Pricing"
        description="Whether you are selling a ready villa, assigning an off-plan unit subject to developer NOC rules, or leasing out an apartment with Ejari management, our Sheikh Zayed Road team handles valuation, RERA Form A compliance, photography, and transfer coordination."
        backgroundImage="/img/hero/slides/06-damac-islands-desktop.webp"
        primaryCta={{ label: "Submit Your Property Mandate", href: "#mandate-form" }}
        secondaryCta={{ label: "Speak With Landlord Desk", href: "/contact" }}
        sideImages={[
          {
            src: "/img/communities/palm-jumeirah.webp",
            label: "Secondary Sales & Off-Plan Assignments",
            sublabel: "DLD Comparable Valuation · Form A & Form F",
          },
          {
            src: "/img/communities/dubai-marina.webp",
            label: "Annual Leasing & Ejari Management",
            sublabel: "Tenant Vetting · Cheque Custody · Inspections",
          },
        ]}
      />

      {/* Sale vs Lease-Out Scope + 4-Step Process */}
      <section className="mx-auto max-w-7xl px-4 py-16 space-y-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#e6dfd2] bg-white p-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
              <Building2 className="h-4 w-4" /> For Property Sellers (Secondary & Off-Plan Resale)
            </div>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
              Discreet or Portal-Wide Resale Marketing
            </h2>
            <ul className="mt-4 space-y-2.5 text-xs md:text-sm text-[#39455a]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                <span>Written valuation anchored in actual DLD land-registry transfers in your building.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                <span>Full handling of mortgaged property liability letters, blocking, and developer NOCs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                <span>Option for private off-market introduction to existing SWK international clients.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-[#e6dfd2] bg-white p-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
              <KeyRound className="h-4 w-4" /> For Landlords (Annual Leasing & Property Management)
            </div>
            <h2 className="mt-3 font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
              Tenant Screening, Ejari & Ongoing Management
            </h2>
            <ul className="mt-4 space-y-2.5 text-xs md:text-sm text-[#39455a]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                <span>Corporate and family tenant vetting, Emirates ID verification, and cheque-schedule negotiation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                <span>Unified Dubai Tenancy Contract drafting, security deposit inventory, and Ejari registration.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                <span>Optional full-year property management for overseas landlords (maintenance, renewals, RERA index checks).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Steps */}
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#0f2244] mb-6">
            How We Onboard & Market Your Property
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {SELLER_STEPS.map((s) => (
              <div key={s.step} className="rounded-3xl border border-[#e6dfd2] bg-white p-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
                  Step {s.step}
                </span>
                <h3 className="mt-2 font-serif text-xl font-semibold text-[#0f2244]">{s.title}</h3>
                <p className="mt-2 text-xs text-[#39455a] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents Checklist (§48) */}
        <div className="rounded-3xl border border-[#94652c]/35 bg-[#151319] p-7 md:p-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
            <FileCheck2 className="h-4 w-4" /> Mandatory DLD & RERA Onboarding Documents (§48)
          </div>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
            Documents Required Before Public Listing
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {REQUIRED_DOCS.map((doc) => (
              <div key={doc.title} className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                <h3 className="text-sm font-semibold text-[#94652c]">{doc.title}</h3>
                <p className="mt-1 text-xs text-[#39455a] leading-relaxed">{doc.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Valuation & Listing Instruction Form */}
        <EnquiryForm
          context="selling"
          subject="Owner Instruction: Valuation & RERA Form A Onboarding"
          heading="Submit Your Property for Valuation & Listing"
          subheading="Provide your community, building, unit type, and whether you wish to sell or lease. Our Secondary & Landlord Desk will respond within one business day."
        />
      </section>
    </div>
  )
}
