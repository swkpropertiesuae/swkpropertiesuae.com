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
    subEn: "108+ verified releases across 27+ UAE master developers",
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHiddenOnScrollDown, setIsHiddenOnScrollDown] = useState(false);
  const lastScrollYRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const shortlistCount = savedSlugs.length + compareSlugs.length;
  const isHomePage = pathname === "/";

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
    const onScroll = () => {
      const currentY = window.scrollY;
      const prevY = lastScrollYRef.current;
      const delta = currentY - prevY;

      setIsScrolled(currentY > 24);

      if (currentY <= 36) {
        setIsHiddenOnScrollDown(false);
      } else if (delta > 6 && currentY > 64) {
        // Scrolling down: smoothly retract header so it never collides with hero cards/text
        setIsHiddenOnScrollDown(true);
        setPropMenuOpen(false);
      } else if (delta < -6) {
        // Scrolling up: reveal sleek frosted single-row header
        setIsHiddenOnScrollDown(false);
      }

      lastScrollYRef.current = currentY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`${
        isHomePage ? "fixed top-0 inset-x-0" : "sticky top-0"
      } z-50 w-full border-0 transition-all duration-300 ease-out ${
        isHiddenOnScrollDown && !mobileOpen
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      } ${
        isHomePage && !isScrolled && !mobileOpen
          ? "bg-transparent shadow-none"
          : "bg-[#0b1220]/94 backdrop-blur-2xl shadow-[0_18px_42px_rgba(0,0,0,0.42)]"
      }`}
    >
      {/* Top Corporate Utility & Regulatory Bar (§02) — Only at Top of Page; Retracts on Scroll */}
      {!bannerDismissed && (
        <div
          className={`border-0 bg-transparent px-4 text-xs text-white transition-all duration-200 overflow-hidden ${
            isScrolled
              ? "max-h-0 opacity-0 py-0 pointer-events-none"
              : "max-h-14 opacity-100 py-1.5"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0f2244]/90 border border-white/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                <ShieldCheck className="h-3 w-3 text-white" />
                RERA ORN {SITE.reraOrn}
              </span>
              <Link
                href="/off-plan"
                className="truncate text-xs font-medium text-white/95 hover:text-white transition"
              >
                {SITE.announcement}
              </Link>
            </div>

            {/* Utility Controls: Calculators, Currency, Area Unit, Language, Dismiss */}
            <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
              <Link
                href="/calculators"
                className="hidden md:inline-flex items-center gap-1.5 font-semibold text-white hover:underline"
              >
                <Sparkles className="h-3 w-3" />
                DLD 4% & Yield Calculators
              </Link>

              <span className="hidden md:inline text-white/30">|</span>

              {/* Currency Selector (§02, §44) */}
              <select
                aria-label="Select display currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="rounded-md border border-white/25 bg-[#0f2244]/85 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md focus:border-white focus:outline-none"
              >
                {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code} className="bg-[#0f2244] text-white">
                    {code === "AED" ? "AED (Primary)" : `${code} (Approx.)`}
                  </option>
                ))}
              </select>

              {/* Area Unit Toggle (§44) */}
              <button
                type="button"
                onClick={() => setAreaUnit(areaUnit === "sqft" ? "sqm" : "sqft")}
                className="rounded-md border border-white/25 bg-[#0f2244]/85 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md hover:bg-[#14305c]"
                title="Toggle area unit between square feet and square metres"
              >
                {areaUnit === "sqft" ? "sq ft" : "sq m"}
              </button>

              {/* Language Switcher (§02, §43) */}
              <button
                type="button"
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="rounded-md border border-white/25 bg-[#0f2244]/85 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md hover:bg-[#14305c]"
                title="Switch website language / direction"
              >
                {lang === "en" ? "العربية" : "EN"}
              </button>

              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss announcement bar"
                className="ml-1 text-white/70 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Corporate Navigation Bar (§02) — Merged with Hero */}
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 transition-all duration-300 ${
          isScrolled ? "py-1.5" : "py-2"
        }`}
      >
        {/* 1. Prominent High-Clarity 3D Metallic Rose-Gold SWK Horizontal Portal Lockup — Zero Shadow Filter */}
        <Link
          href="/"
          className="flex shrink-0 items-center py-0.5 focus:outline-none transition-transform duration-200 hover:scale-[1.02]"
          aria-label="SWK Properties Dubai Home"
        >
          <img
            src="/brand/swk-horizontal-lockup.png"
            alt="SWK Properties Dubai"
            fetchPriority="high"
            decoding="async"
            className={`w-auto object-contain transition-all duration-300 ${
              isScrolled
                ? "h-11 sm:h-12 md:h-14"
                : "h-13 sm:h-15 md:h-16 lg:h-[4.25rem]"
            }`}
          />
        </Link>

        {/* 2. Primary Corporate Navigation — Single-Line Navy Glass Pill Bar */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-[#0f2244]/85 px-2.5 py-1.5 backdrop-blur-xl shadow-sm"
        >
          {/* Home Link */}
          <Link
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
              isActive("/")
                ? "bg-white text-[#0f2244] shadow-xs"
                : "text-white/90 hover:bg-white/15 hover:text-white"
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
              className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                isPropertiesSectionActive
                  ? "bg-white text-[#0f2244] shadow-xs"
                  : "text-white/90 hover:bg-white/15 hover:text-white"
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
                <div className="overflow-hidden rounded-3xl border border-white/20 bg-[#0f2244]/96 p-3 text-white backdrop-blur-2xl shadow-[0_24px_60px_rgba(15,34,68,0.45)]">
                  <div className="mb-2 border-b border-white/15 px-3 pb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/85">
                      Select Property Mandate
                    </span>
                    <span className="text-[11px] font-medium text-white/65">
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
                              ? "bg-white/15 border border-white/30"
                              : "hover:bg-white/10"
                          }`}
                        >
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white group-hover:bg-white group-hover:text-[#0f2244] transition">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-base font-bold text-white">
                                {lang === "ar" ? sub.labelAr : sub.labelEn}
                              </span>
                              <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition">
                                →
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-white/70 leading-snug">
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
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                  active
                    ? "bg-white text-[#0f2244] shadow-xs"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
              >
                {lang === "ar" ? item.labelAr : item.labelEn}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right Action Cluster: Only Search & Compact Book Consultation — Brand Navy Blue with Spotlight Hover */}
        <div className="flex items-center gap-2">
          {/* Property Search Access */}
          <Link
            href="/properties"
            aria-label="Search Properties"
            title="Search Dubai Properties"
            className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-[#0f2244]/90 text-white backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition-all duration-300 hover:scale-105 hover:border-white/60 hover:bg-[#163466] hover:shadow-[0_0_20px_rgba(255,255,255,0.28),inset_0_1px_0_rgba(255,255,255,0.45)]"
          >
            <Search className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
          </Link>

          {/* Compact Corporate Enquiry Button (§02) — Brand Navy Blue with Natural-Light Spotlight Hover */}
          <Link
            href="/contact"
            className="group relative hidden sm:inline-flex h-9 shrink-0 whitespace-nowrap items-center overflow-hidden rounded-full border border-white/35 bg-[radial-gradient(120%_140%_at_50%_0%,rgba(255,255,255,0.22)_0%,rgba(15,34,68,0.96)_62%)] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_6px_18px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/65 hover:bg-[radial-gradient(120%_140%_at_50%_0%,rgba(255,255,255,0.34)_0%,rgba(22,52,102,0.98)_65%)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.35),0_0_22px_rgba(255,255,255,0.22)]"
          >
            <span>{lang === "ar" ? "استفسر الآن" : "Book Consultation"}</span>
          </Link>

          {/* Mobile Menu Trigger with Large Touch Target */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile navigation menu"
            className="inline-flex xl:hidden h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#0f2244]/85 text-white backdrop-blur-md"
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
