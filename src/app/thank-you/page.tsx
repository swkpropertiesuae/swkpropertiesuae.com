import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, CheckCircle2, Clock, Phone, ShieldCheck } from "lucide-react"
import { SITE } from "@/lib/swk"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Enquiry Confirmed — Thank You | SWK Properties Dubai",
  description:
    "Your enquiry or viewing request has been logged by SWK Properties (RERA ORN 51517). Review your reference number, response SLA, and next steps.",
  path: "/thank-you",
  noIndex: true,
})

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; agent?: string; backup?: string }>
}) {
  const sp = await searchParams
  const referenceId = sp.ref || "SWK-ENQ-VERIFIED"
  const assignedAgent = sp.agent || "Mohammad Haseeb (Senior Property Consultant)"
  const backupAgent = sp.backup || "SWK Sheikh Zayed Road Desk"

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244] py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-3xl border border-[#94652c]/40 bg-white p-8 md:p-12 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6ead7] text-[#94652c]">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">
            <ShieldCheck className="h-3.5 w-3.5" /> Reference: {referenceId}
          </span>

          <h1 className="font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            Thank You — Your Request Is With Our Advisory Desk
          </h1>

          <p className="text-sm md:text-base text-[#39455a] max-w-xl mx-auto leading-relaxed">
            Your enquiry has been routed to <strong className="text-[#94652c]">{assignedAgent}</strong> (with backup coverage by{" "}
            <strong className="text-[#0f2244]">{backupAgent}</strong>) at our Sheikh Zayed Road headquarters.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-left rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-5 text-xs">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
              <div>
                <strong className="block text-[#0f2244]">Expected Response SLA</strong>
                <span className="text-[#39455a]">
                  Within 2 hours during Dubai business hours (Mon–Sat, 9:00 AM – 7:00 PM GST / UTC+4), or first thing the next business morning.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
              <div>
                <strong className="block text-[#0f2244]">Need Immediate Assistance?</strong>
                <span className="text-[#39455a]">
                  Call <a href={`tel:${SITE.phoneTel}`} className="text-[#94652c] underline">{SITE.phone}</a> or message us on WhatsApp quoting <span className="font-mono text-[#94652c]">{referenceId}</span>.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`${SITE.whatsapp}?text=${encodeURIComponent(
                `Hello SWK Properties, I just submitted enquiry ${referenceId} and would like to connect on WhatsApp.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#0f2244] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-[#f3dfb1]"
            >
              Continue on WhatsApp →
            </a>
            <Link
              href="/properties"
              className="rounded-full border border-[#e6dfd2] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f2244] hover:border-[#94652c]"
            >
              Browse Verified Properties
            </Link>
            <Link
              href="/guides/buying"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e6dfd2] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#94652c]"
            >
              <BookOpen className="h-3.5 w-3.5" /> Read Dubai Buying Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
