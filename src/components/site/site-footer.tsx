"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { SITE } from "@/lib/swk";
import { usePrefs } from "@/lib/prefs";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-bold tracking-[0.24em] text-[#94652c] uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl leading-[1.12] font-semibold tracking-tight text-[#0f2244] md:text-5xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-base md:text-lg leading-relaxed text-[#39455a]">{lead}</p>}
    </div>
  );
}

export function SiteFooter() {
  const { trackEvent } = usePrefs();

  return (
    <footer className="w-full border-t border-[#e6dfd2] bg-[#0f2244] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & RERA Registration */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block rounded-2xl bg-white/95 px-4 py-2.5 shadow-sm">
              <img
                src="/brand/SWK_Properties_Horizontal_Logo_Light.svg"
                alt="SWK Properties Dubai"
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="max-w-md text-sm text-white/80 leading-relaxed">
              {SITE.tagline}. SWK Properties is a RERA-licensed real estate brokerage in Dubai (ORN{" "}
              <strong className="text-[#dcb888]">{SITE.reraOrn}</strong>) specialising in off-plan developer launches, ready secondary market sales, residential & commercial leasing, and portfolio management.
            </p>

            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#dcb888] mt-0.5" />
                <span>{SITE.address.full}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#dcb888]" />
                <a
                  href={`tel:${SITE.phoneRaw}`}
                  onClick={() => trackEvent("phone_click", { location: "footer" })}
                  className="hover:text-[#dcb888]"
                >
                  {SITE.phone}
                </a>
                <span className="text-white/30">·</span>
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { location: "footer" })}
                  className="inline-flex items-center gap-1 text-emerald-300 hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#dcb888]" />
                <a href={`mailto:${SITE.email}`} className="hover:text-[#dcb888]">
                  {SITE.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-[#dcb888] mt-0.5" />
                <span>
                  {SITE.hours.weekdays} · {SITE.hours.saturday} (Asia/Dubai GST)
                </span>
              </div>
            </div>
          </div>

          {/* Properties & Search */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#dcb888]">
              Properties & Mandates
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li><Link href="/properties" className="hover:text-[#dcb888]">All Dubai Properties Search</Link></li>
              <li><Link href="/buy" className="hover:text-[#dcb888]">Buy Ready Homes (Secondary)</Link></li>
              <li><Link href="/rent" className="hover:text-[#dcb888]">Rent & Lease (Annual / Monthly)</Link></li>
              <li><Link href="/off-plan" className="hover:text-[#dcb888]">Verified Off-Plan Launches</Link></li>
              <li><Link href="/list-your-property" className="hover:text-[#dcb888]">List Your Property (Sell / Lease)</Link></li>
              <li><Link href="/developers" className="hover:text-[#dcb888]">20 UAE Master Developers</Link></li>
              <li><Link href="/communities" className="hover:text-[#dcb888]">8 Dubai Community Guides</Link></li>
            </ul>
          </div>

          {/* Services & Guides */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#dcb888]">
              Services, Guides & Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li><Link href="/services/off-plan-advisory" className="hover:text-[#dcb888]">Off-Plan Investment Advisory</Link></li>
              <li><Link href="/services/secondary-market" className="hover:text-[#dcb888]">Secondary Sales & Form F</Link></li>
              <li><Link href="/services/leasing-rental" className="hover:text-[#dcb888]">Leasing & Ejari Services</Link></li>
              <li><Link href="/services/property-management" className="hover:text-[#dcb888]">Landlord Property Management</Link></li>
              <li><Link href="/guides/buying" className="hover:text-[#dcb888]">Dubai Buying Guide</Link></li>
              <li><Link href="/guides/renting" className="hover:text-[#dcb888]">Dubai Renting & Ejari Guide</Link></li>
              <li><Link href="/guides/selling" className="hover:text-[#dcb888]">Dubai Selling Guide</Link></li>
              <li><Link href="/guides/investing" className="hover:text-[#dcb888]">Property Investment Guide</Link></li>
              <li><Link href="/calculators" className="hover:text-[#dcb888]">Mortgage, DLD & Yield Calculators</Link></li>
            </ul>
          </div>

          {/* Company, Governance & Legal */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#dcb888]">
              Governance & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li><Link href="/about" className="hover:text-[#dcb888]">About SWK & RERA Credentials</Link></li>
              <li><Link href="/insights" className="hover:text-[#dcb888]">Market Insights & Research</Link></li>
              <li><Link href="/faq" className="hover:text-[#dcb888]">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-[#dcb888]">Contact & Office Location</Link></li>
              <li><Link href="/privacy" className="hover:text-[#dcb888]">Privacy Policy (UAE PDPL)</Link></li>
              <li><Link href="/terms" className="hover:text-[#dcb888]">Terms of Use & Disclaimers</Link></li>
              <li><Link href="/cookies" className="hover:text-[#dcb888]">Cookie Settings & Tracker Inventory</Link></li>
            </ul>

            <div className="mt-5 rounded-2xl border border-white/15 bg-[#14305c] p-3.5 text-[11px] text-white/85">
              <div className="flex items-center gap-1.5 font-bold text-[#dcb888]">
                <ShieldCheck className="h-3.5 w-3.5" />
                DLD & RERA Compliance
              </div>
              <p className="mt-1 leading-relaxed">
                RERA ORN: <strong>{SITE.reraOrn}</strong> · Verify permits at{" "}
                <a
                  href="https://dubailand.gov.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#dcb888] underline"
                >
                  dubailand.gov.ae
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory & Image Attribution Disclaimers (§08, §09, §10, §15) */}
        <div className="mt-12 border-t border-white/15 pt-6 text-[11px] text-white/65 space-y-2 leading-relaxed">
          <p>
            <strong>Regulatory & Pricing Notice:</strong> Primary prices are quoted in UAE Dirhams (AED). Any foreign currency conversions (USD, EUR, GBP, INR, RUB) and calculator outputs are approximate and for general information only—not financial, tax, or legal advice. Off-plan project visuals include developer architectural renders; floor plans, dimensions, service charges, payment plans, and handover dates are subject to the official Sales & Purchase Agreement (SPA) and Dubai Land Department (DLD) registration.
          </p>
          <p>
            <strong>Developer Trademarks:</strong> Developer names, logos, and project imagery remain the property of their respective developers and are used solely to identify developments in the UAE market. SWK Properties LLC operates as an independent RERA-licensed real estate brokerage (ORN {SITE.reraOrn}) at Al Saqr Business Tower, Sheikh Zayed Road, Dubai, UAE.
          </p>
        </div>
      </div>
    </footer>
  );
}
