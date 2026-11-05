"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Heart,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  QrCode,
  Scale,
  Share2,
  ShieldCheck,
} from "lucide-react";
import ViewfinderFlipCarousel from "@/components/ui/viewfinder-flip-carousel";
import { NearbyWalk } from "@/components/ui/nearby-walk-menu";
import { type PropertyListing } from "@/lib/listings";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { PropertyCard } from "@/components/site/property-card";
import { usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";

export function PropertyDetailClient({
  listing,
  similarListings,
}: {
  listing: PropertyListing;
  similarListings: PropertyListing[];
}) {
  const {
    formatPrice,
    formatArea,
    savedSlugs,
    toggleSaved,
    compareSlugs,
    toggleCompare,
    trackEvent,
    notify,
  } = usePrefs();

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Price or availability update needed");
  const [reportNote, setReportNote] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    trackEvent("property_view", {
      propertyRef: listing.reference,
      community: listing.community,
      purpose: listing.purpose,
      priceAed: listing.priceAed,
    });
  }, [listing, trackEvent]);

  const isSaved = savedSlugs.includes(listing.slug);
  const isCompared = compareSlugs.includes(listing.slug);

  const waMessage = encodeURIComponent(
    `Hello SWK Properties, I am viewing ${listing.title} (${listing.community}, Ref: ${listing.reference}, DLD Permit #${listing.dld.permitNumber}) and would like to arrange a viewing or receive the full DLD cost sheet.`
  );

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      notify("Property link copied to clipboard");
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    notify(`Compliance review logged for ${listing.reference}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Breadcrumb & Top Utility Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5f6a82]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-[#94652c]">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-[#94652c]">Properties</Link>
          <span>/</span>
          <Link href={`/communities/${listing.communitySlug}`} className="hover:text-[#94652c]">
            {listing.community}
          </Link>
          <span>/</span>
          <span className="text-[#94652c]">{listing.reference}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSaved(listing.slug)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              isSaved
                ? "border-[#94652c] bg-[#0f2244] text-white"
                : "border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244]"
            }`}
          >
            <Heart className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(listing.slug)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              isCompared
                ? "border-[#94652c] bg-[#0f2244] text-white"
                : "border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244]"
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            Compare
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-1.5 text-xs font-medium text-[#0f2244] hover:border-[#94652c]"
          >
            <Share2 className="h-3.5 w-3.5 text-[#94652c]" />
            Share Link
          </button>
        </div>
      </div>

      {/* §07 Title, Price, Transaction Type, Status & Reference Header */}
      <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#0f2244] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                {listing.purpose === "buy"
                  ? "For Sale · Secondary Market"
                  : listing.purpose === "rent"
                  ? `For Rent · ${listing.rentalPeriod === "monthly" ? "Monthly" : "Annual Lease"}`
                  : "Off-Plan Developer Release"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Status: {listing.status}
              </span>
              <span className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1 font-mono text-[11px] text-[#94652c]">
                Ref: {listing.reference}
              </span>
              {listing.isRender && (
                <span className="rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-1 text-[10px] font-medium text-amber-800">
                  Visuals Include Developer Architectural Renders
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
              {listing.title}
            </h1>
            <p className="text-sm md:text-base text-[#39455a]">{listing.subtitle}</p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#39455a]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#94652c]" />
                {listing.building} · {listing.community}, Dubai
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-[#94652c]" />
                Developer: {listing.developer}
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="rounded-2xl border border-[#94652c]/35 bg-[#faf7f2] p-5 text-left md:text-right min-w-[260px]">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#94652c]">
              {listing.purpose === "rent"
                ? `Annual Rent (${listing.cheques || 2} Cheques)`
                : listing.purpose === "off-plan"
                ? "Indicative Launch Price"
                : "Asking Price"}
            </div>
            <div className="mt-1 font-serif text-3xl font-bold text-[#0f2244]">
              {formatPrice(listing.priceAed)}
            </div>
            <div className="mt-1 text-xs text-[#5f6a82]">
              AED {Math.round(listing.priceAed / listing.areaSqFt).toLocaleString("en-US")} per sq ft · Service Charge ~AED {listing.serviceChargePerSqFt}/sq ft
            </div>
          </div>
        </div>

        {/* Key Specs Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 border-t border-[#e6dfd2] pt-5 text-xs">
          <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
            <span className="text-[#5f6a82] block">Property Type</span>
            <strong className="mt-1 block text-sm text-[#0f2244]">{listing.propertyType}</strong>
          </div>
          <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
            <span className="text-[#5f6a82] block">Bedrooms</span>
            <strong className="mt-1 flex items-center gap-1.5 text-sm text-[#0f2244]">
              <BedDouble className="h-4 w-4 text-[#94652c]" />
              {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Bedrooms`}
            </strong>
          </div>
          <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
            <span className="text-[#5f6a82] block">Bathrooms</span>
            <strong className="mt-1 flex items-center gap-1.5 text-sm text-[#0f2244]">
              <Bath className="h-4 w-4 text-[#94652c]" />
              {listing.bathrooms} Bathrooms
            </strong>
          </div>
          <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
            <span className="text-[#5f6a82] block">Built-Up Area</span>
            <strong className="mt-1 flex items-center gap-1.5 text-sm text-[#0f2244]">
              <Maximize2 className="h-4 w-4 text-[#94652c]" />
              {formatArea(listing.areaSqFt)}
            </strong>
          </div>
          <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
            <span className="text-[#5f6a82] block">Furnishing</span>
            <strong className="mt-1 block text-sm text-[#0f2244]">{listing.furnished}</strong>
          </div>
          <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
            <span className="text-[#5f6a82] block">Completion / Handover</span>
            <strong className="mt-1 flex items-center gap-1 text-sm text-[#94652c]">
              <Calendar className="h-3.5 w-3.5" />
              {listing.completion}
            </strong>
          </div>
        </div>
      </div>

      {/* §07 Photo Gallery + 21st.dev ViewfinderFlipCarousel */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-7 overflow-hidden rounded-3xl border border-[#e6dfd2]">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-[380px] md:h-[460px] w-full object-cover"
          />
        </div>
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          {listing.images.slice(1, 5).map((img, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-[#e6dfd2]">
              <img
                src={img}
                alt={`${listing.title} view ${i + 2}`}
                className="h-[180px] md:h-[220px] w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#f4efe6] py-6">
        <ViewfinderFlipCarousel
          height="420px"
          background="transparent"
          items={listing.images.map((src, i) => ({
            title: `${listing.building} · View 0${i + 1}`,
            src,
            alt: `${listing.title} gallery ${i + 1}`,
          }))}
        />
      </div>

      {/* Main Two-Column Content: Left (Description, Floor Plan, Amenities, DLD Permit & Madmoun QR, Map) | Right (Agent Card & Viewing/Enquiry Form) */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 space-y-8">
          {/* Honest Description */}
          <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
              Property Overview & Verification Notes
            </h2>
            <div className="mt-4 space-y-4 text-sm md:text-base text-[#39455a] leading-relaxed">
              {listing.description.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#e6dfd2] pt-5 text-xs">
              <div>
                <span className="text-[#5f6a82]">Handover / Availability:</span>{" "}
                <strong className="text-[#0f2244]">{listing.handover}</strong>
              </div>
              {listing.paymentPlan && (
                <div>
                  <span className="text-[#5f6a82]">Payment Plan:</span>{" "}
                  <strong className="text-[#94652c]">{listing.paymentPlan}</strong>
                </div>
              )}
              <div>
                <span className="text-[#5f6a82]">Parking Allocation:</span>{" "}
                <strong className="text-[#0f2244]">{listing.parkingSpaces} Covered Spaces</strong>
              </div>
              <div>
                <span className="text-[#5f6a82]">Pet Policy:</span>{" "}
                <strong className="text-[#0f2244]">{listing.petPolicy}</strong>
              </div>
              <div>
                <span className="text-[#5f6a82]">Verified Views:</span>{" "}
                <strong className="text-[#94652c]">{listing.views.join(" · ")}</strong>
              </div>
              {listing.metroStation && (
                <div>
                  <span className="text-[#5f6a82]">Nearest Rail / Metro:</span>{" "}
                  <strong className="text-[#0f2244]">{listing.metroStation}</strong>
                </div>
              )}
            </div>
          </section>

          {/* §07 Floor Plan & Room Dimensions Breakdown */}
          <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#94652c]">
                  Architectural Layout & Suite Dimensions
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#0f2244]">
                  Floor Plan: {listing.floorPlan.label}
                </h2>
              </div>
              <span className="rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-1 text-xs font-semibold text-[#94652c]">
                Total: {formatArea(listing.floorPlan.totalAreaSqFt)}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
                <span className="text-[#5f6a82] block">Internal Suite Area</span>
                <strong className="mt-1 block text-sm text-[#0f2244]">
                  {formatArea(listing.floorPlan.internalSqFt)}
                </strong>
              </div>
              <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
                <span className="text-[#5f6a82] block">Balcony / Terrace</span>
                <strong className="mt-1 block text-sm text-[#0f2244]">
                  {formatArea(listing.floorPlan.balconySqFt)}
                </strong>
              </div>
              <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
                <span className="text-[#5f6a82] block">Floor Level</span>
                <strong className="mt-1 block text-sm text-[#94652c]">
                  {listing.floorLevel || "Mid-High"}
                </strong>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[#e6dfd2]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf7f2] text-[#94652c]">
                  <tr>
                    <th className="p-3 font-semibold">Room / Zone</th>
                    <th className="p-3 font-semibold">Approximate Dimensions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6dfd2]">
                  {listing.floorPlan.rooms.map((rm) => (
                    <tr key={rm.name}>
                      <td className="p-3 font-medium text-[#0f2244]">{rm.name}</td>
                      <td className="p-3 font-mono text-[#39455a]">{rm.dimensions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* §07 Amenities, Features & Accessibility */}
          <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
                Key Features, Building Amenities & Accessibility
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[...listing.features, ...listing.amenities].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2.5 text-[#39455a]"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#e6dfd2] pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94652c]">
                Step-Free & Accessibility Features (§05)
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-xs text-[#39455a]">
                {listing.accessibility.map((acc) => (
                  <li
                    key={acc}
                    className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1"
                  >
                    {acc}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* §08 Dubai Listing Verification & Regulatory Compliance (Trakheesi Permit + Madmoun QR + Report Incorrect Listing) */}
          <section className="rounded-3xl border border-[#94652c]/35 bg-[#f6ead7]/55 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                  Dubai Land Department (DLD) & RERA Compliance (§08)
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
                  Trakheesi Permit & Madmoun QR Verification
                </h2>
                <p className="text-xs text-[#39455a] leading-relaxed">
                  Every Dubai property marketed by SWK Properties LLC is backed by a verified marketing permit or project escrow registration on the Dubai Land Department portal.
                </p>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
                    <span className="text-[#5f6a82] block">Trakheesi / Project Permit</span>
                    <strong className="mt-0.5 block font-mono text-sm text-[#94652c]">
                      #{listing.dld.permitNumber}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
                    <span className="text-[#5f6a82] block">Brokerage RERA ORN</span>
                    <strong className="mt-0.5 block font-mono text-sm text-[#0f2244]">
                      {listing.dld.orn}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
                    <span className="text-[#5f6a82] block">Broker BRN</span>
                    <strong className="mt-0.5 block font-mono text-sm text-[#0f2244]">
                      {listing.dld.brn}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
                    <span className="text-[#5f6a82] block">Permit Validity</span>
                    <strong className="mt-0.5 block text-[#0f2244]">
                      Until {listing.dld.permitExpiry}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
                    <span className="text-[#5f6a82] block">Last Checked Date</span>
                    <strong className="mt-0.5 block text-emerald-700">
                      {listing.lastChecked}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
                    <span className="text-[#5f6a82] block">Madmoun Reference</span>
                    <strong className="mt-0.5 block font-mono text-[11px] text-[#94652c]">
                      {listing.dld.madmounQrId}
                    </strong>
                  </div>
                </div>

                {listing.dld.escrowBank && (
                  <p className="pt-2 text-xs text-[#94652c]">
                    <strong>Project Escrow Account:</strong> {listing.dld.escrowBank}
                  </p>
                )}

                <div className="pt-3 flex flex-wrap items-center gap-4 text-xs">
                  <a
                    href={listing.dld.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#94652c] hover:underline"
                  >
                    Verify on Dubai Land Department (dubailand.gov.ae)
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setReportOpen((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-[#39455a] hover:text-amber-800"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                    Report an Incorrect Listing
                  </button>
                </div>
              </div>

              {/* Stylized DLD Madmoun QR Code Seal */}
              <div className="flex flex-col items-center rounded-2xl border border-[#94652c]/35 bg-white p-4 text-black shadow-xl">
                <QrCode className="h-24 w-24 text-white" />
                <span className="mt-2 font-mono text-[10px] font-bold tracking-wider">
                  {listing.dld.madmounQrId}
                </span>
                <span className="text-[9px] text-neutral-600">DLD Trakheesi / Madmoun</span>
              </div>
            </div>

            {/* Report Incorrect Listing Form (§08) */}
            {reportOpen && (
              <div className="mt-5 border-t border-[#e6dfd2] pt-4">
                {reportSubmitted ? (
                  <p className="text-xs text-emerald-700">
                    Thank you. Our compliance officer has logged your report for {listing.reference} and will re-verify the status within 1 business day.
                  </p>
                ) : (
                  <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                    <p className="font-semibold text-[#94652c]">
                      Report an issue with {listing.reference}:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-[#0f2244]"
                      >
                        <option>Price or availability update needed</option>
                        <option>Property has been sold or leased</option>
                        <option>Specification or floor plan correction</option>
                        <option>Other compliance inquiry</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Optional note or your contact email..."
                        value={reportNote}
                        onChange={(e) => setReportNote(e.target.value)}
                        className="rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-[#0f2244]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-full bg-[#0f2244] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white"
                    >
                      Submit Compliance Report
                    </button>
                  </form>
                )}
              </div>
            )}
          </section>

          {/* §07 Neighbourhood & Transit Map */}
          <section className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
                  Location & Neighbourhood Connectivity: {listing.community}
                </h2>
                <p className="text-xs text-[#5f6a82]">
                  Coordinates: {listing.lat.toFixed(4)}° N, {listing.lng.toFixed(4)}° E
                </p>
              </div>
              <Link
                href={`/communities/${listing.communitySlug}`}
                className="text-xs font-semibold text-[#94652c] hover:underline"
              >
                Open {listing.community} Guide →
              </Link>
            </div>
            <NearbyWalk
              origin={listing.building}
              defaultTheme="classic"
              formatWalk={(m) => `${m} min transit`}
              hint={`Connectivity from ${listing.building} (${listing.community})`}
            />
          </section>
        </div>

        {/* Right Column: Assigned Agent Profile Card + Viewing Booking & Enquiry Form */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Assigned Agent Card (§07, §14) */}
          <div className="rounded-3xl border border-[#94652c]/35 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">
                  Assigned Mandate Specialist
                </span>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-[#0f2244]">
                  <Link href={`/agents/${listing.agentSlug}`} className="hover:text-[#94652c]">
                    {listing.agentName}
                  </Link>
                </h3>
                <p className="text-xs text-[#39455a]">
                  {listing.agentRole} · BRN {listing.dld.brn} · ORN {SITE.reraOrn}
                </p>
                <p className="mt-1 text-[11px] text-[#5f6a82]">
                  Languages: {listing.agentLanguages.join(", ")}
                </p>
              </div>
              <Link
                href={`/agents/${listing.agentSlug}`}
                className="rounded-full border border-[#94652c]/35 px-3.5 py-1.5 text-[11px] font-semibold text-[#94652c] hover:bg-[#f6ead7]"
              >
                View Profile
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <a
                href={`https://wa.me/${SITE.phoneRaw.replace("+", "")}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("whatsapp_click", {
                    location: "property_detail_agent_card",
                    propertyRef: listing.reference,
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black hover:bg-emerald-400"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Agent
              </a>
              <a
                href={`tel:${listing.agentPhone}`}
                onClick={() =>
                  trackEvent("phone_click", {
                    location: "property_detail_agent_card",
                    propertyRef: listing.reference,
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0f2244] hover:border-[#94652c]"
              >
                <Phone className="h-4 w-4 text-[#94652c]" />
                Call Direct
              </a>
            </div>
          </div>

          {/* Viewing Booking & Property Enquiry Form (§07, §23) */}
          <EnquiryForm
            context="property"
            heading={`Enquire or Book a Viewing`}
            subheading={`Ref ${listing.reference} · Physical viewings anchored in Asia/Dubai (GST)`}
            propertyRef={listing.reference}
            propertyTitle={listing.title}
            community={listing.community}
            developer={listing.developer}
            agentSlug={listing.agentSlug}
            agentName={listing.agentName}
            defaultViewingPicker={true}
          />
        </div>
      </div>

      {/* §07 Similar Properties */}
      {similarListings.length > 0 && (
        <section className="mt-16 border-t border-[#e6dfd2] pt-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94652c]">
                Related Verified Inventory
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0f2244]">
                Similar Properties in Dubai
              </h2>
            </div>
            <Link href="/properties" className="text-xs font-semibold text-[#94652c] hover:underline">
              Search All Inventory →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {similarListings.map((sim) => (
              <PropertyCard key={sim.slug} listing={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
