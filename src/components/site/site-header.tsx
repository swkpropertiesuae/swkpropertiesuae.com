"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Building2,
  ChevronDown,
  Compass,
  Heart,
  Home,
  KeyRound,
  Landmark,
  Menu,
  MessageCircle,
  Phone,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { CURRENCY_RATES, type CurrencyCode, usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";

const PROPERTY_MENU_ITEMS = [
  {
    href: "/buy",
    labelEn: "Buy Ready Homes",
    labelAr: "شراء عقار جاهز",
    subEn: "Trakheesi-permitted villas, penthouses & apartments",
    icon: Home,
  },
  {
    href: "/rent",
    labelEn: "Rent & Annual Leasing",
    labelAr: "إيجار سنوي",
    subEn: "Ejari-compliant residential & executive rentals",
    icon: KeyRound,
  },
  {
    href: "/off-plan",
    labelEn: "Off-Plan Launches",
    labelAr: "مشاريع قيد الإنشاء",
    subEn: "108 DLD escrow-verified releases across 20 developers",
    icon: Landmark,
  },
  {
    href: "/list-your-property",
    labelEn: "Sell or Lease Your Property",
    labelAr: "اعرض عقارك للبيع أو الإيجار",
    subEn: "RERA Form A vendor mandate & valuation desk",
    icon: Tag,
  },
  {
    href: "/properties",
    labelEn: "All Properties & Map Search",
    labelAr: "البحث الشامل في العقارات",
    subEn: "Filter Buy, Rent & Off-Plan in one unified view",
    icon: Compass,
  },
];

const PRIMARY_NAV_ITEMS = [
  { href: "/", labelEn: "Home", labelAr: "الرئيسية" },
  // "Properties" unified dropdown is rendered in position 2
  { href: "/developers", labelEn: "Developers", labelAr: "المطورون" },
  { href: "/communities", labelEn: "Communities", labelAr: "المناطق" },
  { href: "/services", labelEn: "Services", labelAr: "خدماتنا" },
  { href: "/insights", labelEn: "Insights", labelAr: "تحليلات السوق" },
  { href: "/about", labelEn: "About SWK", labelAr: "عن الشركة" },
  { href: "/contact", labelEn: "Contact", labelAr: "اتصل بنا" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const {
    currency,
    setCurrency,
    areaUnit,
    setAreaUnit,
    lang,
    setLang,
    savedSlugs,
    compareSlugs,
    setDrawerOpen,
    setAssistantOpen,
    trackEvent,
  } = usePrefs();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [propMenuOpen, setPropMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const shortlistCount = savedSlugs.length + compareSlugs.length;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isPropertiesSectionActive =
    isActive("/properties") ||
    isActive("/buy") ||
    isActive("/rent") ||
    isActive("/off-plan") ||
    isActive("/list-your-property");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPropMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="swk-scroll-header sticky top-0 z-50 w-full border-b border-[#e6dfd2] bg-white/95 backdrop-blur-xl transition-shadow">
      {/* Top Corporate Utility & Regulatory Bar (§02) */}
      {!bannerDismissed && (
        <div className="border-b border-[#1b3a6b] bg-[#0f2244] px-4 py-2 text-xs text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#c99a63]/20 border border-[#c99a63]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcb888]">
                <ShieldCheck className="h-3 w-3" />
                RERA ORN {SITE.reraOrn}
              </span>
              <Link
                href="/off-plan"
                className="truncate text-xs font-medium text-white/90 hover:text-[#dcb888] transition"
              >
                {SITE.announcement}
              </Link>
            </div>

            {/* Utility Controls: Calculators, Currency, Area Unit, Language, Dismiss */}
            <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
              <Link
                href="/calculators"
                className="hidden md:inline-flex items-center gap-1.5 font-medium text-[#dcb888] hover:underline"
              >
                <Sparkles className="h-3 w-3" />
                DLD 4% & Yield Calculators
              </Link>

              <span className="hidden md:inline text-white/25">|</span>

              {/* Currency Selector (§02, §44) */}
              <select
                aria-label="Select display currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="rounded-md border border-[#e6dfd2] bg-[#14305c] px-2 py-0.5 text-[11px] font-semibold text-[#dcb888] focus:border-[#dcb888] focus:outline-none"
              >
                {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code}>
                    {code === "AED" ? "AED (Primary)" : `${code} (Approx.)`}
                  </option>
                ))}
              </select>

              {/* Area Unit Toggle (§44) */}
              <button
                type="button"
                onClick={() => setAreaUnit(areaUnit === "sqft" ? "sqm" : "sqft")}
                className="rounded-md border border-[#e6dfd2] bg-[#14305c] px-2.5 py-0.5 text-[11px] font-semibold text-white hover:border-[#dcb888]"
                title="Toggle area unit between square feet and square metres"
              >
                {areaUnit === "sqft" ? "sq ft" : "sq m"}
              </button>

              {/* Language Switcher (§02, §43) */}
              <button
                type="button"
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="rounded-md border border-[#e6dfd2] bg-[#14305c] px-2.5 py-0.5 text-[11px] font-bold text-[#dcb888] hover:border-[#dcb888]"
                title="Switch website language / direction"
              >
                {lang === "en" ? "العربية" : "EN"}
              </button>

              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss announcement bar"
                className="ml-1 text-white/60 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Corporate Navigation Bar (§02) */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
        {/* 1. Prominent High-Clarity SWK Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 focus:outline-none"
          aria-label="SWK Properties Dubai Home"
        >
          <img
            src="/brand/SWK_Properties_Horizontal_Logo_Light.svg"
            alt="SWK Properties Dubai"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        {/* 2. Primary Corporate Navigation — Single-Line Layout with Clean "Properties" Dropdown */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-1 whitespace-nowrap rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1.5 shadow-xs"
        >
          {/* Home Link */}
          <Link
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
              isActive("/")
                ? "bg-[#0f2244] text-white shadow-xs"
                : "text-[#0f2244]/85 hover:bg-[#f4efe6] hover:text-[#94652c]"
            }`}
          >
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>

          {/* Clean "Properties" Dropdown (Opens Buy, Rent, Off-Plan, Sell inside dropdown) */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setPropMenuOpen(true)}
            onMouseLeave={() => setPropMenuOpen(false)}
          >
            <button
              type="button"
              onClick={() => setPropMenuOpen((v) => !v)}
              aria-expanded={propMenuOpen}
              className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
                isPropertiesSectionActive
                  ? "bg-[#0f2244] text-white shadow-xs"
                  : "text-[#0f2244]/85 hover:bg-[#f4efe6] hover:text-[#94652c]"
              }`}
            >
              <span>{lang === "ar" ? "العقارات" : "Properties"}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  propMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {propMenuOpen && (
              <div className="absolute left-0 top-full pt-2 w-[400px] z-50 whitespace-normal">
                <div className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white p-3 shadow-[0_24px_60px_rgba(15,34,68,0.16)]">
                  <div className="mb-2 border-b border-[#e6dfd2] px-3 pb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#94652c]">
                      Select Property Mandate
                    </span>
                    <span className="text-[11px] font-medium text-[#5f6a82]">
                      DLD & RERA Verified
                    </span>
                  </div>
                  <div className="space-y-1">
                    {PROPERTY_MENU_ITEMS.map((sub) => {
                      const Icon = sub.icon;
                      const subActive = isActive(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setPropMenuOpen(false)}
                          className={`group flex items-start gap-3.5 rounded-2xl p-3 transition ${
                            subActive
                              ? "bg-[#faf7f2] border border-[#c99a63]/40"
                              : "hover:bg-[#faf7f2]"
                          }`}
                        >
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] group-hover:border-[#94652c] group-hover:bg-[#0f2244] group-hover:text-white transition">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-base font-bold text-[#0f2244] group-hover:text-[#94652c]">
                                {lang === "ar" ? sub.labelAr : sub.labelEn}
                              </span>
                              <span className="text-xs text-[#94652c] opacity-0 group-hover:opacity-100 transition">
                                →
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-[#5f6a82] leading-snug">
                              {sub.subEn}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Remaining Corporate Links */}
          {PRIMARY_NAV_ITEMS.slice(1).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
                  active
                    ? "bg-[#0f2244] text-white shadow-xs"
                    : "text-[#0f2244]/85 hover:bg-[#f4efe6] hover:text-[#94652c]"
                }`}
              >
                {lang === "ar" ? item.labelAr : item.labelEn}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right Action Cluster: Search, Shortlist, AI Concierge, Phone, WhatsApp, Enquire */}
        <div className="flex items-center gap-2">
          {/* Property Search Access */}
          <Link
            href="/properties"
            aria-label="Search Properties"
            title="Search Dubai Properties"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] transition hover:border-[#94652c] hover:text-[#94652c]"
          >
            <Search className="h-4 w-4" />
          </Link>

          {/* Saved Shortlist & Compare Drawer Trigger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open saved shortlist and property comparison"
            title="Saved Shortlist & Compare"
            className="relative inline-flex h-10 items-center gap-1.5 rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3.5 text-xs font-semibold text-[#0f2244] transition hover:border-[#94652c]"
          >
            <Heart className="h-3.5 w-3.5 text-[#94652c]" />
            <Scale className="h-3.5 w-3.5 text-[#0f2244]/70 hidden sm:inline" />
            {shortlistCount > 0 && (
              <span className="ml-0.5 rounded-full bg-[#0f2244] px-1.5 py-0.2 text-[10px] font-bold text-white">
                {shortlistCount}
              </span>
            )}
          </button>

          {/* Direct Phone Access */}
          <a
            href={`tel:${SITE.phoneRaw}`}
            onClick={() => trackEvent("phone_click", { location: "header" })}
            aria-label={`Call SWK Properties at ${SITE.phone}`}
            title={`Call ${SITE.phone}`}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244] transition hover:border-[#94652c] hover:text-[#94652c]"
          >
            <Phone className="h-4 w-4" />
          </a>

          {/* Direct WhatsApp Access */}
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { location: "header" })}
            aria-label="Chat on WhatsApp"
            title="WhatsApp Advisory Desk"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-600/30 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </a>

          {/* Prominent Corporate Enquiry Button (§02) — Single Line */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex shrink-0 whitespace-nowrap items-center rounded-full bg-[#0f2244] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#94652c]"
          >
            {lang === "ar" ? "استفسر الآن" : "Book Consultation"}
          </Link>

          {/* Mobile Menu Trigger with Large Touch Target */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile navigation menu"
            className="inline-flex xl:hidden h-11 w-11 items-center justify-center rounded-full border border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer with Unified Properties Group & Large Touch Targets (§02, §49) */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-[#e6dfd2] bg-white px-4 py-6 shadow-2xl">
          {/* Unified Properties Section in Mobile Menu */}
          <div className="mb-4 rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3">
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#94652c]">
              Properties (Buy · Rent · Off-Plan · Sell)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROPERTY_MENU_ITEMS.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[48px] items-center justify-between rounded-xl border border-[#e6dfd2] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0f2244] hover:border-[#94652c]"
                >
                  <span>{lang === "ar" ? sub.labelAr : sub.labelEn}</span>
                  <span className="text-xs text-[#94652c]">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex min-h-[48px] items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
                    active
                      ? "bg-[#0f2244] text-white"
                      : "border border-[#e6dfd2] bg-[#faf7f2] text-[#0f2244]"
                  }`}
                >
                  <span>{lang === "ar" ? item.labelAr : item.labelEn}</span>
                  <span className="text-xs opacity-60">→</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-[#e6dfd2] pt-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setAssistantOpen(true);
              }}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#94652c]/40 bg-[#f6ead7] px-4 text-xs font-bold uppercase tracking-[0.14em] text-[#94652c]"
            >
              <Bot className="h-4 w-4" />
              SWK AI Concierge
            </button>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[48px] items-center justify-center rounded-xl bg-[#0f2244] px-4 text-xs font-bold uppercase tracking-[0.14em] text-white"
            >
              Book Consultation
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5f6a82]">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#0f2244]">
              <ShieldCheck className="h-4 w-4 text-[#94652c]" />
              RERA ORN {SITE.reraOrn} · Sheikh Zayed Road
            </span>
            <a href={`tel:${SITE.phoneRaw}`} className="font-bold text-[#94652c]">
              {SITE.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
