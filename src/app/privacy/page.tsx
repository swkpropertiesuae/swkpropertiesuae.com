import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { SITE } from "@/lib/swk"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — UAE Personal Data Protection Law (PDPL) Notice",
  description:
    "SWK Properties (RERA ORN 51517) Privacy Policy explaining what personal data we collect, why we process it under UAE Federal Decree-Law No. 45 of 2021 (PDPL), retention periods, and your data rights.",
  path: "/privacy",
})

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        id="ld-privacy-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">
            <ShieldCheck className="h-3.5 w-3.5" /> Checklist §53 · Aligned With UAE PDPL
          </span>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            Privacy Policy & Personal Data Notice
          </h1>
          <p className="mt-2 text-xs text-[#5f6a82]">
            Last Updated: October 2026 · Controller: {SITE.legalName} (RERA ORN {SITE.orn}), {SITE.address.full}
          </p>
        </div>

        <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 space-y-6 text-sm text-[#39455a] leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
              1. Who We Are & Regulatory Scope
            </h2>
            <p className="mt-2">
              {SITE.legalName} (&ldquo;SWK Properties&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a real estate brokerage licensed in Dubai under RERA Office Registration Number (ORN) {SITE.orn}, located at {SITE.address.full}. This Privacy Policy explains how we handle personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data (UAE PDPL) and applicable international privacy principles.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
              2. Personal Data We Collect
            </h2>
            <ul className="mt-2 list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-[#0f2244]">Enquiry & Viewing Booking Data:</strong> Full name, phone/WhatsApp number, email address, preferred language, property interest, preferred viewing dates/times (GST), and optional budget or residency preferences when you submit a form on our website.
              </li>
              <li>
                <strong className="text-[#0f2244]">Regulatory Transaction Documents (Offline / Secure Channels Only):</strong> When you formally instruct SWK to buy, sell, or lease a property, Dubai Land Department (DLD) and UAE Anti-Money Laundering (AML) regulations require identity, passport, Emirates ID, or Title Deed verification through official channels. We ask that you never send passport scans or banking details through open website chat.
              </li>
              <li>
                <strong className="text-[#0f2244]">Technical & Attribution Data:</strong> First-touch and latest-touch referral parameters (`utm_source`, `utm_medium`, `utm_campaign`), currency/unit display preferences stored in your browser, and—only where you grant consent via our{" "}
                <Link href="/cookies" className="text-[#94652c] underline">
                  Cookie Settings
                </Link>
                —anonymous page interaction events.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
              3. Lawful Basis & Purpose of Processing
            </h2>
            <p className="mt-2">
              We process your contact details solely based on your explicit consent when submitting an enquiry, or to take pre-contractual steps at your request (such as preparing a property shortlist, booking a viewing, or onboarding a property via RERA Form A). We do not sell, rent, or trade your personal data to third-party lead brokers.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
              4. Data Sharing & Cross-Border Safeguards
            </h2>
            <p className="mt-2">
              Where you request an off-plan project registration, viewing, or mortgage referral, relevant details are shared strictly with the assigned SWK consultant, the developer&apos;s official sales registration desk, or the Dubai Land Department (DLD / Ejari / Trakheesi) as required by UAE law.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
              5. Data Retention & Your Rights Under UAE PDPL
            </h2>
            <p className="mt-2">
              Website enquiry records that do not progress to a regulated real estate transaction are retained for up to 24 months unless you request earlier deletion. You have the right to request access to, correction of, or erasure of your personal data, or to withdraw marketing consent at any time by emailing{" "}
              <a href={`mailto:${SITE.email}`} className="text-[#94652c] underline">
                {SITE.email}
              </a>{" "}
              or calling{" "}
              <a href={`tel:${SITE.phoneTel}`} className="text-[#94652c] underline">
                {SITE.phone}
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
