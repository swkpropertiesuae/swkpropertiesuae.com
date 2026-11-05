import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Building2, CheckCircle2, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react"
import { SITE } from "@/lib/swk"
import { buildMetadata, breadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { LivelyPageHero } from "@/components/ui/lively-page-hero"
import { EnquiryForm } from "@/components/site/enquiry-form"

export const metadata: Metadata = buildMetadata({
  title: "Contact SWK Properties — Sheikh Zayed Road Office, Dubai",
  description:
    "Visit or contact SWK Properties at Office No 54, 27th Floor, Al Saqr Business Tower, Sheikh Zayed Road, Dubai. Call +971 56 433 0448 or book a private consultation.",
  path: "/contact",
  keywords: [
    "Contact SWK Properties Dubai",
    "Al Saqr Business Tower real estate office",
    "Sheikh Zayed Road property broker phone",
    "SWK Properties consultation",
  ],
})

const CORRIDOR_DRIVE_TIMES = [
  { destination: "DIFC Gate Village & Financial Centre Metro", time: "4 mins", mode: "Walk / Metro" },
  { destination: "Downtown Dubai, Burj Khalifa & Dubai Mall", time: "8 mins", mode: "Sheikh Zayed Road" },
  { destination: "Dubai International Airport (DXB)", time: "14 mins", mode: "E11 Highway" },
  { destination: "Dubai Hills Estate & Mohammed Bin Rashid City", time: "16 mins", mode: "Al Khail Road" },
  { destination: "Palm Jumeirah, Dubai Marina & Sobha Century", time: "18 mins", mode: "Sheikh Zayed Road" },
  { destination: "Dubai South, Azizi Venice & Al Maktoum Airport", time: "28 mins", mode: "E311 / E611" },
]

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

      <LivelyPageHero
        badge="Office 54 · 27th Floor · Al Saqr Business Tower"
        title="Visit Our 27th-Floor Advisory Suite on"
        highlight="Sheikh Zayed Road"
        description="Speak directly with a senior consultant covering your target community or developer. We respond within one business day during Dubai Gulf Standard Time (GST / UTC+4)."
        backgroundImage="/img/about/private-consultation-lounge.jpg"
        primaryCta={{ label: "Call +971 56 433 0448", href: "tel:+971564330448" }}
        secondaryCta={{ label: "Explore 108+ Projects", href: "/off-plan" }}
        sideImages={[
          {
            src: "/img/hero/slides/01-dubai-horizon-desktop.webp",
            label: "Sheikh Zayed Road · DIFC Corridor",
            sublabel: "4 Mins from Financial Centre Metro Station",
          },
          {
            src: "/img/hero/slides/04-azizi-venice-desktop.webp",
            label: "25+ Multilingual Property Advisors",
            sublabel: "English · Arabic · French · Hindi · Urdu",
          },
        ]}
      />

      {/* Contact Details + Photorealistic 27th-Floor Private Consultation Lounge */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm">
              <img
                src="/img/about/private-consultation-lounge.jpg"
                alt="SWK Properties Private Consultation Lounge on the 27th Floor of Al Saqr Business Tower, Sheikh Zayed Road"
                className="h-72 w-full object-cover"
              />
              <div className="border-t border-[#e6dfd2] bg-white px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#94652c] block">
                    Private Consultation Suite · Office No 54
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
                    Telephone &amp; Direct WhatsApp
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
                    Client Enquiries &amp; Advisory Desk
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
                    Private weekend viewings available by advance appointment.
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Access & Drive-Time Matrix (Replaces old NearbyWalk) */}
            <div className="rounded-3xl border border-[#e6dfd2] bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94652c]">
                    Central Dubai Location
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#0f2244]">
                    Travel Times From Al Saqr Business Tower
                  </h3>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${SITE.geo.lat},${SITE.geo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#94652c] hover:underline"
                >
                  Google Maps →
                </a>
              </div>
              <div className="divide-y divide-[#e6dfd2]">
                {CORRIDOR_DRIVE_TIMES.map((row) => (
                  <div key={row.destination} className="flex items-center justify-between py-2.5 text-xs">
                    <span className="font-medium text-[#0f2244]">{row.destination}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[#5f6a82]">{row.mode}</span>
                      <span className="rounded-full bg-[#faf7f2] border border-[#e6dfd2] px-2.5 py-0.5 font-bold text-[#94652c]">
                        {row.time}
                      </span>
                    </div>
                  </div>
                ))}
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
    </div>
  )
}
