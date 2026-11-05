import type { Metadata } from "next"
import { CheckCircle2, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react"
import { SITE } from "@/lib/swk"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { NearbyWalk } from "@/components/ui/nearby-walk-menu"
import { EnquiryForm } from "@/components/site/enquiry-form"

export const metadata: Metadata = buildMetadata({
  title: "Contact SWK Properties — Sheikh Zayed Road Office, Dubai",
  description:
    "Visit or contact SWK Properties (RERA ORN 51517) at Office No 54, 27th Floor, Al Saqr Business Tower, Sheikh Zayed Road, Dubai. Call +971 56 433 0448 or book a private consultation.",
  path: "/contact",
  keywords: [
    "Contact SWK Properties Dubai",
    "Al Saqr Business Tower real estate office",
    "Sheikh Zayed Road property broker phone",
    "RERA ORN 51517 contact",
  ],
})

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        id="ld-contact-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact SWK", path: "/contact" },
        ])}
      />

      {/* Header */}
      <section className="border-b border-[#e6dfd2] bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#94652c]">
            <ShieldCheck className="h-3.5 w-3.5" /> RERA ORN {SITE.orn} · Sheikh Zayed Road Headquarters
          </span>
          <h1 className="mt-4 font-serif text-3xl md:text-6xl font-semibold text-[#0f2244] leading-[1.08]">
            Visit Our 27th-Floor Advisory Suite or Speak Directly With a Specialist
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-[#39455a] leading-relaxed">
            Every enquiry is routed to a named RERA-licensed consultant with a designated backup specialist. We respond within one business day during Gulf Standard Time (GST / UTC+4).
          </p>
        </div>
      </section>

      {/* Contact Details + Photorealistic 27th-Floor Private Consultation Lounge */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            {/* Photorealistic 27th-Floor Consultation Lounge Card */}
            <div className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm">
              <img
                src="/img/about/private-consultation-lounge.jpg"
                alt="SWK Properties Private Consultation Lounge on the 27th Floor of Al Saqr Business Tower, Sheikh Zayed Road"
                className="h-72 w-full object-cover"
              />
              <div className="border-t border-[#e6dfd2] bg-white px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#94652c] block">
                    Private Consultation Suite · Office 2738
                  </span>
                  <span className="text-sm font-semibold text-[#0f2244]">
                    27th Floor, Al Saqr Business Tower, Sheikh Zayed Road
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f6ead7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#94652c]">
                  <CheckCircle2 className="h-3 w-3" /> Verified HQ
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-7 space-y-5 shadow-sm">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
                Direct Office Coordinates
              </h2>

              <div className="flex items-start gap-3.5 text-sm">
                <MapPin className="h-5 w-5 shrink-0 text-[#94652c] mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#94652c]">
                    Dubai Headquarters
                  </div>
                  <div className="mt-1 font-medium text-[#0f2244]">{SITE.address.full}</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm">
                <Phone className="h-5 w-5 shrink-0 text-[#94652c] mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#94652c]">
                    Telephone & Direct WhatsApp
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3">
                    <a
                      href={`tel:${SITE.phoneTel}`}
                      className="font-semibold text-[#0f2244] hover:text-[#94652c]"
                    >
                      {SITE.phone}
                    </a>
                    <span>·</span>
                    <a
                      href={SITE.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#94652c] underline"
                    >
                      Open WhatsApp Chat
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm">
                <Mail className="h-5 w-5 shrink-0 text-[#94652c] mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#94652c]">
                    Client Enquiries & Compliance Desk
                  </div>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-1 block font-semibold text-[#0f2244] hover:text-[#94652c]"
                  >
                    {SITE.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm">
                <Clock className="h-5 w-5 shrink-0 text-[#94652c] mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#94652c]">
                    Business Hours (Asia/Dubai · GST / UTC+4)
                  </div>
                  <div className="mt-1 text-[#39455a]">{SITE.hours.full}</div>
                  <div className="text-xs text-[#5f6a82]">
                    Sunday viewings available by advance appointment.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <EnquiryForm
              context="general"
              subject="Sheikh Zayed Road Office Consultation & Shortlist Request"
              heading="Send an Enquiry or Schedule a Viewing"
              subheading="Choose a general consultation or switch to 'Book a Property Viewing' to pick a date and Gulf Standard Time (GST) slot."
            />
          </div>
        </div>
      </section>

      {/* Sheikh Zayed Road Interactive Transit & Walk Map */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm">
          <NearbyWalk defaultTheme="classic" />
        </div>
      </section>
    </div>
  )
}
