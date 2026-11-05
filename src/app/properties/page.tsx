"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookmarkPlus,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { LISTINGS, type PropertyListing } from "@/lib/listings";
import { communities } from "@/lib/swk";
import { developers } from "@/lib/developers";
import { PropertyCard } from "@/components/site/property-card";
import { LivelyPageHero } from "@/components/ui/lively-page-hero";
import { usePrefs } from "@/lib/prefs";

function PropertiesSearchInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { notify, trackEvent } = usePrefs();

  // Initialize from URL query parameters (§04: Shareable search URLs)
  const [purpose, setPurpose] = useState<string>(searchParams.get("purpose") || "all");
  const [q, setQ] = useState<string>(searchParams.get("q") || "");
  const [community, setCommunity] = useState<string>(searchParams.get("community") || "");
  const [developer, setDeveloper] = useState<string>(searchParams.get("developer") || "");
  const [propertyType, setPropertyType] = useState<string>(searchParams.get("type") || "");
  const [minBeds, setMinBeds] = useState<string>(searchParams.get("beds") || "");
  const [minBaths, setMinBaths] = useState<string>(searchParams.get("baths") || "");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
  const [minArea, setMinArea] = useState<string>(searchParams.get("minArea") || "");
  const [maxArea, setMaxArea] = useState<string>(searchParams.get("maxArea") || "");
  const [furnished, setFurnished] = useState<string>(searchParams.get("furnished") || "");
  const [status, setStatus] = useState<string>(searchParams.get("status") || "all");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "relevance");

  // Growth Filters (§05: Handover, Payment Plan, Down Payment, Service Charge, Views, Features, Pet, Metro, Map Zone)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [viewFilter, setViewFilter] = useState<string>("");
  const [featureFilters, setFeatureFilters] = useState<string[]>([]);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState<boolean>(false);
  const [nearMetroOnly, setNearMetroOnly] = useState<boolean>(false);
  const [maxServiceCharge, setMaxServiceCharge] = useState<string>("");
  const [mapZone, setMapZone] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const toggleFeature = (feat: string) => {
    setFeatureFilters((prev) =>
      prev.includes(feat) ? prev.filter((item) => item !== feat) : [...prev, feat]
    );
  };

  const syncUrlParams = () => {
    const params = new URLSearchParams();
    if (purpose !== "all") params.set("purpose", purpose);
    if (q.trim()) params.set("q", q.trim());
    if (community) params.set("community", community);
    if (developer) params.set("developer", developer);
    if (propertyType) params.set("type", propertyType);
    if (minBeds) params.set("beds", minBeds);
    if (minBaths) params.set("baths", minBaths);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minArea) params.set("minArea", minArea);
    if (maxArea) params.set("maxArea", maxArea);
    if (furnished) params.set("furnished", furnished);
    if (status !== "all") params.set("status", status);
    if (sortBy !== "relevance") params.set("sort", sortBy);
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setPurpose("all");
    setQ("");
    setCommunity("");
    setDeveloper("");
    setPropertyType("");
    setMinBeds("");
    setMinBaths("");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setFurnished("");
    setStatus("all");
    setSortBy("relevance");
    setViewFilter("");
    setFeatureFilters([]);
    setPetFriendlyOnly(false);
    setNearMetroOnly(false);
    setMaxServiceCharge("");
    setMapZone("all");
    router.replace("/properties", { scroll: false });
  };

  const filteredListings = useMemo(() => {
    const query = q.trim().toLowerCase();

    const list = LISTINGS.filter((item: PropertyListing) => {
      if (purpose !== "all" && item.purpose !== purpose) return false;
      if (community && item.communitySlug !== community) return false;
      if (developer && item.developerSlug !== developer) return false;
      if (propertyType && item.propertyType !== propertyType) return false;
      if (minBeds && item.bedrooms < Number(minBeds)) return false;
      if (minBaths && item.bathrooms < Number(minBaths)) return false;
      if (minPrice && item.priceAed < Number(minPrice)) return false;
      if (maxPrice && item.priceAed > Number(maxPrice)) return false;
      if (minArea && item.areaSqFt < Number(minArea)) return false;
      if (maxArea && item.areaSqFt > Number(maxArea)) return false;
      if (furnished && item.furnished !== furnished) return false;
      if (status !== "all" && item.status !== status) return false;
      if (viewFilter && !item.views.includes(viewFilter)) return false;
      if (petFriendlyOnly && item.petPolicy !== "Pet-friendly") return false;
      if (nearMetroOnly && !item.nearMetro) return false;
      if (maxServiceCharge && item.serviceChargePerSqFt > Number(maxServiceCharge)) return false;
      if (mapZone !== "all" && item.mapZone !== mapZone) return false;
      if (featureFilters.length > 0) {
        const hasAll = featureFilters.every((f) => item.features.includes(f));
        if (!hasAll) return false;
      }
      if (query) {
        const hay = `${item.title} ${item.subtitle} ${item.community} ${item.building} ${item.developer} ${item.reference}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    const sorted = [...list];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.priceAed - b.priceAed);
    else if (sortBy === "price-desc") sorted.sort((a, b) => b.priceAed - a.priceAed);
    else if (sortBy === "newest")
      sorted.sort((a, b) => b.listedAt.localeCompare(a.listedAt));

    if (sorted.length === 0) {
      trackEvent("search_no_results", {
        purpose,
        community: community || "all",
        query: query || "none",
      });
    }

    return sorted;
  }, [
    purpose,
    q,
    community,
    developer,
    propertyType,
    minBeds,
    minBaths,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    furnished,
    status,
    viewFilter,
    petFriendlyOnly,
    nearMetroOnly,
    maxServiceCharge,
    mapZone,
    featureFilters,
    sortBy,
    trackEvent,
  ]);

  const handleCopyShareUrl = () => {
    syncUrlParams();
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      notify("Shareable search URL copied to clipboard");
    }
  };

  const handleSaveSearch = () => {
    syncUrlParams();
    try {
      const saved = JSON.parse(localStorage.getItem("swk_saved_searches") || "[]");
      saved.push({
        label: `${purpose.toUpperCase()} · ${community || "All Dubai"} · ${propertyType || "All Types"}`,
        url: typeof window !== "undefined" ? window.location.href : "/properties",
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem("swk_saved_searches", JSON.stringify(saved.slice(-10)));
      notify("Search criteria saved to your browser");
    } catch {}
  };

  return (
    <div>
      <LivelyPageHero
        badge="DLD Trakheesi & Escrow Verified Search"
        title="Dubai & UAE Property Search"
        highlight="Buy Ready, Rent & Off-Plan"
        description="Filter verified ready homes, Ejari-registered rentals, and developer off-plan allocations across Dubai and the UAE. Use the currency and sq ft / sq m controls in the top bar at any time."
        backgroundImage="/img/hero/slides/01-dubai-horizon-desktop.webp"
        primaryCta={{ label: "Browse Off-Plan Launches", href: "/off-plan" }}
        secondaryCta={{ label: "Open DLD & Yield Calculators", href: "/calculators" }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Save & Share Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f2244]">
            Interactive Property Filter &amp; Map Directory
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSaveSearch}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e6dfd2] bg-white px-4 py-2 text-xs font-semibold text-[#0f2244] shadow-sm hover:border-[#0f2244]"
            >
              <BookmarkPlus className="h-3.5 w-3.5 text-[#0f2244]" />
              Save Search
            </button>
            <button
              type="button"
              onClick={handleCopyShareUrl}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e6dfd2] bg-white px-4 py-2 text-xs font-semibold text-[#0f2244] shadow-sm hover:border-[#0f2244]"
            >
              <Share2 className="h-3.5 w-3.5 text-[#0f2244]" />
              Share Search URL
            </button>
          </div>
        </div>

      {/* Core Search & Filter Panel (§04) */}
      <div className="rounded-3xl border border-[#e6dfd2] bg-white p-5 md:p-7 shadow-2xl">
        {/* Purpose Tabs + View Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#e6dfd2]">
          <div className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-1.5">
            {[
              { id: "all", label: "All Mandates" },
              { id: "buy", label: "Buy (Ready)" },
              { id: "rent", label: "Rent (Yearly / Monthly)" },
              { id: "off-plan", label: "Off-Plan" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPurpose(t.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  purpose === t.id
                    ? "bg-[#0f2244] text-white"
                    : "text-[#39455a] hover:text-[#94652c]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "grid" ? "map" : "grid")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-2 text-xs font-semibold text-[#94652c]"
            >
              <MapPin className="h-3.5 w-3.5" />
              {viewMode === "grid" ? "Open Map & Zone Draw Filter" : "Switch to Grid View"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2 text-xs font-medium text-[#0f2244] hover:border-[#94652c]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#94652c]" />
              {showAdvanced ? "Hide Lifestyle Filters" : "More Filters (§05)"}
            </button>
          </div>
        </div>

        {/* Core Filter Inputs */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Keyword / Building / Ref
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94652c]" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Burj Crown, Marina Gate, SWK-DXB..."
                className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] pl-9 pr-3 py-2.5 text-xs text-[#0f2244]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Community
            </label>
            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2.5 text-xs text-[#0f2244]"
            >
              <option value="">All Communities</option>
              {communities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2.5 text-xs text-[#0f2244]"
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Min Bedrooms
            </label>
            <select
              value={minBeds}
              onChange={(e) => setMinBeds(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2.5 text-xs text-[#0f2244]"
            >
              <option value="">Any Beds</option>
              <option value="1">1+ Bedroom</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Sort Results
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2.5 text-xs text-[#0f2244]"
            >
              <option value="relevance">Recommended / Verified</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Listed</option>
            </select>
          </div>
        </div>

        {/* Price, Area, Furnishing & Status Row */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Min Price (AED)
            </label>
            <input
              type="number"
              placeholder="e.g. 150000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Max Price (AED)
            </label>
            <input
              type="number"
              placeholder="e.g. 10000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Min Area (sq ft)
            </label>
            <input
              type="number"
              placeholder="e.g. 900"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Max Area (sq ft)
            </label>
            <input
              type="number"
              placeholder="e.g. 8000"
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Furnishing
            </label>
            <select
              value={furnished}
              onChange={(e) => setFurnished(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
            >
              <option value="">Any Furnishing</option>
              <option value="Furnished">Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
              <option value="Partly furnished">Partly furnished</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
              Availability
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="rented">Rented</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        {/* §05 Growth & Lifestyle Filters Drawer */}
        {showAdvanced && (
          <div className="mt-5 border-t border-[#e6dfd2] pt-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94652c] flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Additional Developer, Financial, View & Accessibility Filters (§05)
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
                  Developer
                </label>
                <select
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
                >
                  <option value="">All Developers</option>
                  {developers.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
                  Verified View
                </label>
                <select
                  value={viewFilter}
                  onChange={(e) => setViewFilter(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
                >
                  <option value="">Any View</option>
                  <option value="Waterfront">Waterfront / Sea View</option>
                  <option value="Burj Khalifa / Skyline">Burj Khalifa / Skyline</option>
                  <option value="Park / Golf">Park / Golf View</option>
                  <option value="Canal">Dubai Water Canal</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
                  Max Service Charge (AED/sq ft)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={maxServiceCharge}
                  onChange={(e) => setMaxServiceCharge(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-wider text-[#5f6a82]">
                  Min Bathrooms
                </label>
                <select
                  value={minBaths}
                  onChange={(e) => setMinBaths(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2 text-xs text-[#0f2244]"
                >
                  <option value="">Any Bathrooms</option>
                  <option value="2">2+ Bathrooms</option>
                  <option value="3">3+ Bathrooms</option>
                  <option value="4">4+ Bathrooms</option>
                </select>
              </div>
            </div>

            {/* Feature Checkboxes */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {["Balcony", "Study", "Maid's room", "Parking", "Step-free access"].map((feat) => (
                <button
                  key={feat}
                  type="button"
                  onClick={() => toggleFeature(feat)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                    featureFilters.includes(feat)
                      ? "border-[#94652c] bg-[#0f2244] text-white font-semibold"
                      : "border-[#e6dfd2] bg-[#faf7f2] text-[#39455a]"
                  }`}
                >
                  {feat}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPetFriendlyOnly((v) => !v)}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                  petFriendlyOnly
                    ? "border-[#94652c] bg-[#0f2244] text-white font-semibold"
                    : "border-[#e6dfd2] bg-[#faf7f2] text-[#39455a]"
                }`}
              >
                Pet-Friendly Only
              </button>
              <button
                type="button"
                onClick={() => setNearMetroOnly((v) => !v)}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                  nearMetroOnly
                    ? "border-[#94652c] bg-[#0f2244] text-white font-semibold"
                    : "border-[#e6dfd2] bg-[#faf7f2] text-[#39455a]"
                }`}
              >
                Near Dubai Metro
              </button>
            </div>
          </div>
        )}

        {/* Map-Based & Draw-Zone Filter (§05) */}
        {viewMode === "map" && (
          <div className="mt-5 rounded-2xl border border-[#94652c]/30 bg-[#faf7f2] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#0f2244]">
                  Interactive Dubai Corridor & Custom Area Polygon Filter
                </h3>
                <p className="text-xs text-[#5f6a82]">
                  Select a drawn geographical zone on the Dubai map to isolate listings within that corridor:
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Dubai Corridors" },
                  { id: "central", label: "Draw Zone: Downtown / SZR / Business Bay" },
                  { id: "coastal", label: "Draw Zone: Palm Jumeirah / Dubai Marina" },
                  { id: "green-suburban", label: "Draw Zone: Dubai Hills / JVC" },
                  { id: "creek-east", label: "Draw Zone: Dubai Creek Harbour" },
                ].map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setMapZone(z.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                      mapZone === z.id
                        ? "bg-[#0f2244] text-white font-semibold"
                        : "border border-[#e6dfd2] bg-[#faf7f2] text-[#39455a]"
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {filteredListings.map((item) => (
                <Link
                  key={item.slug}
                  href={`/properties/${item.slug}`}
                  className="rounded-xl border border-[#e6dfd2] bg-white p-3 hover:border-[#94652c]"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#94652c]">
                    <span>
                      Lat {item.lat.toFixed(3)}° N · Lng {item.lng.toFixed(3)}° E
                    </span>
                    <span>{item.reference}</span>
                  </div>
                  <div className="mt-1 font-serif text-sm font-semibold text-[#0f2244] truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#5f6a82]">{item.community}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Count & Clear Filters Bar (§04) */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e6dfd2] pt-4 text-xs">
          <div className="text-[#39455a]">
            Showing <strong className="text-[#94652c]">{filteredListings.length}</strong> verified{" "}
            {filteredListings.length === 1 ? "property" : "properties"}
            {mapZone !== "all" ? ` in drawn zone (${mapZone})` : ""}
          </div>
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94652c] hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Results Grid or Helpful Zero-Result Recovery (§04) */}
      {filteredListings.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <PropertyCard key={listing.slug} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-[#94652c]/35 bg-white p-8 md:p-12 text-center">
          <h2 className="font-serif text-2xl md:text-4xl font-semibold text-[#0f2244]">
            No Exact Matches for Those Combined Filters
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#39455a] leading-relaxed">
            Many private secondary mandates and new developer allocations in Dubai are held off-portal or match slightly broader budget/bedroom criteria. Try one of the recovery options below:
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={clearAllFilters}
              className="rounded-full bg-[#0f2244] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Reset All Filters ({LISTINGS.length} Verified Listings)
            </button>
            <Link
              href="/off-plan"
              className="rounded-full border border-[#e6dfd2] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f2244] hover:border-[#94652c]"
            >
              Browse All 108 Off-Plan Launches
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#94652c]"
            >
              Request Custom Off-Market Shortlist
            </Link>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-[#94652c]">
          Loading verified Dubai property inventory...
        </div>
      }
    >
      <PropertiesSearchInner />
    </Suspense>
  );
}
