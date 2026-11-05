"use client";

import React from "react";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  Heart,
  MapPin,
  Maximize2,
  MessageCircle,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { type PropertyListing } from "@/lib/listings";
import { usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";

export function PropertyCard({ listing }: { listing: PropertyListing }) {
  const {
    formatPrice,
    formatArea,
    savedSlugs,
    toggleSaved,
    compareSlugs,
    toggleCompare,
    trackEvent,
  } = usePrefs();

  const isSaved = savedSlugs.includes(listing.slug);
  const isCompared = compareSlugs.includes(listing.slug);

  const waMessage = encodeURIComponent(
    `Hello SWK Properties, I am enquiring about ${listing.title} in ${listing.community} (Ref: ${listing.reference}, DLD Permit: ${listing.dld.permitNumber}). Please share current availability.`
  );

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#94652c]/50 hover:shadow-[0_24px_60px_rgba(15,34,68,0.12)]">
      {/* Image Header */}
      <div className="relative h-60 w-full overflow-hidden bg-[#f4efe6]">
        <img
          src={listing.images[0]}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/85 via-transparent to-[#0f2244]/30" />

        {/* Top Badges (§06: availability, purpose, justified label, render notice) */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#0f2244] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-sm">
              {listing.purpose === "buy"
                ? "For Sale · Ready"
                : listing.purpose === "rent"
                ? `For Rent · ${listing.rentalPeriod === "monthly" ? "Monthly" : "Yearly"}`
                : "Off-Plan Launch"}
            </span>
            {listing.badge && (
              <span className="rounded-full border border-[#c99a63]/50 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94652c] backdrop-blur-md">
                {listing.badge}
              </span>
            )}
            {listing.isRender && (
              <span className="rounded-full border border-white/30 bg-[#0f2244]/80 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                Developer Render
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleSaved(listing.slug)}
              aria-label={isSaved ? "Remove from shortlist" : "Save to shortlist"}
              title={isSaved ? "Saved in shortlist" : "Save to shortlist"}
              className={`flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition ${
                isSaved
                  ? "border-[#94652c] bg-[#94652c] text-white"
                  : "border-white/30 bg-white/90 text-[#0f2244] hover:border-[#94652c]"
              }`}
            >
              <Heart className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={() => toggleCompare(listing.slug)}
              aria-label="Compare property"
              title="Add to side-by-side comparison"
              className={`flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition ${
                isCompared
                  ? "border-[#0f2244] bg-[#0f2244] text-white"
                  : "border-white/30 bg-white/90 text-[#0f2244] hover:border-[#94652c]"
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom overlay: Reference & DLD Trakheesi Permit */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0f2244]/85 px-2.5 py-0.5 backdrop-blur-md">
            <ShieldCheck className="h-3 w-3 text-emerald-700" />
            DLD Permit #{listing.dld.permitNumber}
          </span>
          <span className="rounded-full bg-white/95 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0f2244]">
            {listing.reference}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Price + Rental Terms */}
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="font-serif text-2xl font-bold text-[#0f2244]">
              {formatPrice(listing.priceAed)}
              {listing.purpose === "rent" && (
                <span className="ml-1.5 font-sans text-xs font-semibold text-[#94652c]">
                  / {listing.rentalPeriod === "monthly" ? "month" : `year (${listing.cheques || 2} cheques)`}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              {listing.status}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/properties/${listing.slug}`}
            className="mt-2 block font-serif text-xl font-bold leading-snug text-[#0f2244] transition group-hover:text-[#94652c]"
          >
            {listing.title}
          </Link>

          {/* Community & Building */}
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#39455a]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#94652c]" />
            <span className="truncate">
              {listing.building} · {listing.community}
            </span>
          </div>

          {/* Core Specs: Property Type, Beds, Baths, Area */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3 text-xs font-semibold text-[#0f2244]">
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-[#94652c]" />
              <span>{listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Beds`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5 text-[#94652c]" />
              <span>{listing.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5 text-[#94652c]" />
              <span className="truncate">{formatArea(listing.areaSqFt)}</span>
            </div>
          </div>

          {/* Developer / Handover / Payment Plan */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium text-[#5f6a82]">
            <span className="inline-flex items-center gap-1 text-[#0f2244]">
              <Building2 className="h-3 w-3 text-[#94652c]" />
              {listing.developer} · {listing.propertyType}
            </span>
            <span className="font-semibold text-[#94652c]">
              {listing.paymentPlan ? listing.paymentPlan.split(" (")[0] : listing.handover}
            </span>
          </div>
        </div>

        {/* Agent & Actions Footer (§06) */}
        <div className="mt-5 border-t border-[#e6dfd2] pt-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <Link
              href={`/agents/${listing.agentSlug}`}
              className="text-[#39455a] hover:text-[#94652c]"
            >
              Consultant: <strong className="text-[#0f2244]">{listing.agentName}</strong>
            </Link>
            <span className="text-[10px] font-medium text-[#5f6a82]">
              Verified {listing.lastChecked}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href={`/properties/${listing.slug}`}
              className="inline-flex items-center justify-center rounded-xl bg-[#0f2244] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#94652c]"
            >
              View Details
            </Link>
            <a
              href={`https://wa.me/${SITE.phoneRaw.replace("+", "")}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("whatsapp_click", {
                  location: "property_card",
                  propertyRef: listing.reference,
                })
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-600/35 bg-emerald-50 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800 transition hover:bg-emerald-600 hover:text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
