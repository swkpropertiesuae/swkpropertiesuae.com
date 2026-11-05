"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calculator,
  Search,
  ShieldCheck,
} from "lucide-react";
import { communities } from "@/lib/swk";
import { developers, projects } from "@/lib/developers";
import { usePrefs } from "@/lib/prefs";

export function HomeSearchBar() {
  const router = useRouter();
  const { trackEvent } = usePrefs();

  const [purpose, setPurpose] = useState<"all" | "buy" | "rent" | "off-plan" | "sell">("all");
  const [query, setQuery] = useState("");
  const [community, setCommunity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const commMatches = communities
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        type: "Community",
        label: c.name,
        sub: c.tagline,
        href: `/communities/${c.slug}`,
        fill: c.name,
      }));
    const devMatches = developers
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((d) => ({
        type: "Developer",
        label: d.name,
        sub: `${d.projectCount} projects in UAE`,
        href: `/developers/${d.slug}`,
        fill: d.name,
      }));
    const projMatches = projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.community.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((p) => ({
        type: "Off-Plan Project",
        label: p.name,
        sub: `${p.developer} · ${p.community}`,
        href: `/off-plan/${p.slug}`,
        fill: p.name,
      }));
    return [...commMatches, ...devMatches, ...projMatches].slice(0, 7);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (purpose === "sell") {
      router.push("/list-your-property");
      return;
    }
    const params = new URLSearchParams();
    if (purpose !== "all") params.set("purpose", purpose);
    if (query.trim()) params.set("q", query.trim());
    if (community) params.set("community", community);
    if (propertyType) params.set("type", propertyType);
    if (beds) params.set("beds", beds);
    if (maxPrice) params.set("maxPrice", maxPrice);

    trackEvent("property_search", {
      purpose,
      community: community || "all",
      propertyType: propertyType || "all",
      beds: beds || "any",
    });

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="rounded-2xl border border-white/30 bg-white/95 backdrop-blur-xl p-3 md:px-4 md:py-3 shadow-[0_20px_50px_rgba(15,34,68,0.22)]">
        {/* Single-Line Search Form with Mandate Dropdown */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2.5 md:grid-cols-12 items-end">
          {/* 1. Mandate Type Dropdown */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f2244] whitespace-nowrap">
              Property Mandate
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as typeof purpose)}
              aria-label="Select property mandate type"
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs font-bold text-[#0f2244] focus:border-[#0f2244] focus:bg-white focus:outline-none"
            >
              <option value="all">All Properties</option>
              <option value="buy">Buy Ready Homes</option>
              <option value="rent">Rent / Annual Lease</option>
              <option value="off-plan">Off-Plan Launches</option>
              <option value="sell">Sell / List Property</option>
            </select>
          </div>

          {/* 2. Location / Building / Project Autocomplete */}
          <div className="relative md:col-span-3">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#5f6a82] whitespace-nowrap">
              Location, Building or Project
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0f2244]" />
              <input
                type="text"
                value={query}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Downtown, Palm Jumeirah, Emaar..."
                className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] pl-9 pr-3 py-2 text-xs font-medium text-[#0f2244] placeholder:text-[#5f6a82]/70 focus:border-[#0f2244] focus:bg-white focus:outline-none"
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 bottom-full mb-1.5 z-50 rounded-2xl border border-[#e6dfd2] bg-white p-2 shadow-2xl">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs hover:bg-[#faf7f2]"
                  >
                    <button
                      type="button"
                      onMouseDown={() => {
                        setQuery(s.fill);
                        setShowSuggestions(false);
                      }}
                      className="text-left flex-1"
                    >
                      <div className="font-bold text-[#0f2244]">{s.label}</div>
                      <div className="text-[11px] text-[#5f6a82]">{s.sub}</div>
                    </button>
                    <Link
                      href={s.href}
                      className="rounded-full bg-[#0f2244] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap"
                    >
                      {s.type} →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Community Select */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#5f6a82] whitespace-nowrap">
              Community
            </label>
            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs font-medium text-[#0f2244] focus:border-[#0f2244] focus:bg-white focus:outline-none"
            >
              <option value="">All 8 Districts</option>
              {communities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Property Type */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#5f6a82] whitespace-nowrap">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs font-medium text-[#0f2244] focus:border-[#0f2244] focus:bg-white focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>

          {/* 5. Bedrooms & Max Budget */}
          <div className="grid grid-cols-2 gap-2 md:col-span-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#5f6a82] whitespace-nowrap">
                Beds
              </label>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-2 py-2 text-xs font-medium text-[#0f2244] focus:border-[#0f2244] focus:bg-white focus:outline-none"
              >
                <option value="">Any</option>
                <option value="1">1+ BR</option>
                <option value="2">2+ BR</option>
                <option value="3">3+ BR</option>
                <option value="4">4+ BR</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#5f6a82] whitespace-nowrap">
                Max Price
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-2 py-2 text-xs font-medium text-[#0f2244] focus:border-[#0f2244] focus:bg-white focus:outline-none"
              >
                <option value="">No Limit</option>
                <option value="300000">AED 300K</option>
                <option value="3000000">AED 3M</option>
                <option value="6000000">AED 6M</option>
                <option value="15000000">AED 15M</option>
                <option value="50000000">AED 50M</option>
              </select>
            </div>
          </div>

          {/* 6. Submit CTA — Brand Navy Blue */}
          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              className="flex w-full whitespace-nowrap items-center justify-center gap-1.5 rounded-xl bg-[#0f2244] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#14305c]"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
