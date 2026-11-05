"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  Bot,
  CheckCircle2,
  ChevronRight,
  Cookie,
  Heart,
  MessageCircle,
  Phone,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { LISTINGS } from "@/lib/listings";
import { projects } from "@/lib/developers";
import { faqs, SITE } from "@/lib/swk";
import { usePrefs } from "@/lib/prefs";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  links?: { label: string; href: string }[];
}

interface HypeLaunchItem {
  id: "imtiaz-kore" | "azizi-florence";
  step: "01 / 02" | "02 / 02";
  badge: string;
  notificationTitle: string;
  title: string;
  developer: string;
  developerLogo: string;
  location: string;
  image: string;
  highlights: string[];
  paymentPlan: string;
  handover: string;
  href: string;
  whatsappText: string;
}

const HYPE_LAUNCHES: HypeLaunchItem[] = [
  {
    id: "imtiaz-kore",
    step: "01 / 02",
    badge: "🔥 VIP LAUNCH DROP 01/02 · LIMITED FIRST RELEASE",
    notificationTitle: "🔥 Imtiaz Kore VIP Launch Allocations Now Open!",
    title: "Imtiaz Kore",
    developer: "Imtiaz Developments",
    developerLogo: "/img/developers/imtiaz.svg",
    location: "Dubai Islands / Meydan Horizon Corridor",
    image: "/img/projects/imtiaz/kore-by-imtiaz.webp",
    highlights: [
      "Fully Furnished Designer Residences",
      "Smart Home Automation & Sky Infinity Pool",
      "0% Buyer Agency Commission · Direct Allocation",
    ],
    paymentPlan: "60/40 Milestone Plan",
    handover: "Priority VIP Phase",
    href: "/off-plan/imtiaz-kore",
    whatsappText:
      "Hello SWK Properties, I saw the VIP launch notification for Imtiaz Kore and would like the floor plans, starting prices, and priority unit allocation.",
  },
  {
    id: "azizi-florence",
    step: "02 / 02",
    badge: "⚡ HOT WATERFRONT DROP 02/02 · HIGH DEMAND",
    notificationTitle: "⚡ Azizi Florence Waterfront Release — Priority Booking!",
    title: "Azizi Florence",
    developer: "Azizi Developments",
    developerLogo: "/img/developers/azizi.png",
    location: "Al Furjan / Sharjah Waterfront Corridor",
    image: "/img/projects/azizi/azizi-florence.webp",
    highlights: [
      "Italian-Inspired Crystal Lagoon Waterfront",
      "High Rental Yield & Capital Growth Corridor",
      "DLD / RERA Escrow-Protected Milestones",
    ],
    paymentPlan: "50/50 Flexible Plan",
    handover: "New Launch Release",
    href: "/off-plan/azizi-florence",
    whatsappText:
      "Hello SWK Properties, I saw the launch hype notification for Azizi Florence and would like the brochure, payment plan, and available units.",
  },
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Welcome to SWK Properties. I am the SWK AI Property Concierge—I search our verified Dubai & UAE listings, 108+ developer projects (including Imtiaz Kore and Azizi Florence), and DLD guides. How can I assist your property search today?",
    links: [
      { label: "🔥 Imtiaz Kore VIP Launch", href: "/off-plan/imtiaz-kore" },
      { label: "⚡ Azizi Florence Waterfront", href: "/off-plan/azizi-florence" },
      { label: "Explore 108+ Developer Projects", href: "/off-plan" },
    ],
  },
];

function generateAssistantReply(query: string): {
  text: string;
  links: { label: string; href: string }[];
} {
  const q = query.toLowerCase();

  if (q.includes("kore") || q.includes("imtiaz")) {
    return {
      text: "Imtiaz Kore by Imtiaz Developments is one of our hottest priority launches—featuring fully furnished designer residences, smart home automation, and a 60/40 milestone payment plan with 0% buyer agency commission.",
      links: [
        { label: "View Imtiaz Kore Project Page", href: "/off-plan/imtiaz-kore" },
        { label: "Explore Imtiaz Developments", href: "/developers/imtiaz" },
      ],
    };
  }

  if (q.includes("florence") || q.includes("azizi")) {
    return {
      text: "Azizi Florence and Azizi Venice by Azizi Developments offer Italian-inspired crystal lagoon living with a flexible 50/50 payment schedule and strong rental yield potential.",
      links: [
        { label: "View Azizi Florence", href: "/off-plan/azizi-florence" },
        { label: "View Azizi Venice", href: "/off-plan/azizi-venice" },
      ],
    };
  }

  const matchedListings = LISTINGS.filter(
    (l) =>
      l.title.toLowerCase().includes(q) ||
      l.community.toLowerCase().includes(q) ||
      l.developer.toLowerCase().includes(q) ||
      l.propertyType.toLowerCase().includes(q) ||
      (q.includes("rent") && l.purpose === "rent") ||
      (q.includes("buy") && l.purpose === "buy") ||
      (q.includes("off-plan") && l.purpose === "off-plan") ||
      (q.includes("villa") && l.propertyType === "Villa") ||
      (q.includes("townhouse") && l.propertyType === "Townhouse") ||
      (q.includes("penthouse") && l.propertyType === "Penthouse")
  ).slice(0, 3);

  if (matchedListings.length > 0) {
    const summary = matchedListings
      .map(
        (l) =>
          `• ${l.title} (${l.community}) — AED ${l.priceAed.toLocaleString("en-US")}${
            l.purpose === "rent" ? "/yr" : ""
          } · DLD Permit #${l.dld.permitNumber}`
      )
      .join("\n");
    return {
      text: `Here are verified listings in our current inventory matching your query:\n${summary}\n\nLive unit availability and final terms are confirmed directly by our consultants prior to viewing or reservation.`,
      links: matchedListings.map((l) => ({
        label: `${l.title} (${l.reference})`,
        href: `/properties/${l.slug}`,
      })),
    };
  }

  const matchedProjects = projects
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.developer.toLowerCase().includes(q) ||
        p.community.toLowerCase().includes(q)
    )
    .slice(0, 3);

  if (matchedProjects.length > 0) {
    return {
      text: `We track ${matchedProjects.length}+ verified developer releases matching "${query}". Off-plan starting prices, floor plans, and handover dates are confirmed from live developer inventory.`,
      links: matchedProjects.map((p) => ({
        label: `${p.name} by ${p.developer}`,
        href: `/off-plan/${p.slug}`,
      })),
    };
  }

  const matchedFaq = faqs.find(
    (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
  );
  if (matchedFaq) {
    return {
      text: `${matchedFaq.a}\n\nFor case-specific confirmation, we recommend speaking directly with our Sheikh Zayed Road advisory desk.`,
      links: [
        { label: "Read Full FAQ & Guides", href: "/faq" },
        { label: "Speak with an SWK Consultant", href: "/contact" },
      ],
    };
  }

  return {
    text: "I search verified SWK Properties inventory across 27+ UAE developers and 108+ projects. Would you like me to connect you with a specialist on WhatsApp or open our filtered property search?",
    links: [
      { label: "Search All Properties", href: "/properties" },
      { label: "Book a Private Consultation", href: "/contact" },
      { label: "Buyer & Investor Guides", href: "/guides/buying" },
    ],
  };
}

export function FloatingChrome() {
  const {
    savedSlugs,
    toggleSaved,
    compareSlugs,
    toggleCompare,
    clearCompare,
    drawerOpen,
    setDrawerOpen,
    assistantOpen,
    setAssistantOpen,
    cookieConsent,
    updateCookieConsent,
    formatPrice,
    formatArea,
    trackEvent,
    toastMessage,
  } = usePrefs();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");

  // Occasional Highly Animated Alert Notification (No Left-Side Offer Card)
  // Fires once in a while: first alert after 8s (stays 7.5s), then 38s later second alert (stays 7.5s)
  const [activeLaunchIdx, setActiveLaunchIdx] = useState<number>(0);
  const [liveBannerVisible, setLiveBannerVisible] = useState<boolean>(false);

  useEffect(() => {
    // 1st occasional alert: Imtiaz Kore after 8 seconds
    const showFirst = window.setTimeout(() => {
      setActiveLaunchIdx(0);
      setLiveBannerVisible(true);
    }, 8000);

    const hideFirst = window.setTimeout(() => {
      setLiveBannerVisible(false);
    }, 15500);

    // 2nd occasional alert: Azizi Florence 38 seconds after the first one hides
    const showSecond = window.setTimeout(() => {
      setActiveLaunchIdx(1);
      setLiveBannerVisible(true);
    }, 53500);

    const hideSecond = window.setTimeout(() => {
      setLiveBannerVisible(false);
    }, 61000);

    return () => {
      window.clearTimeout(showFirst);
      window.clearTimeout(hideFirst);
      window.clearTimeout(showSecond);
      window.clearTimeout(hideSecond);
    };
  }, []);

  const currentLaunch = HYPE_LAUNCHES[activeLaunchIdx] ?? HYPE_LAUNCHES[0];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    const reply = generateAssistantReply(trimmed);
    const botMsg: ChatMessage = {
      id: `a-${Date.now() + 1}`,
      role: "assistant",
      text: reply.text,
      links: reply.links,
    };
    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    setChatInput("");
  };

  const savedListings = LISTINGS.filter((l) => savedSlugs.includes(l.slug));
  const comparedListings = LISTINGS.filter((l) => compareSlugs.includes(l.slug));

  return (
    <>
      {/* 1. Standard Toast Notification Pill */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-4 z-[85] flex items-center gap-2 rounded-full border border-[#94652c]/40 bg-white px-4 py-2.5 text-xs font-semibold text-[#0f2244] shadow-xl"
        >
          <CheckCircle2 className="h-4 w-4 text-[#2f5d3a]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Occasional Highly Animated Alert Notification (No Left-Side Offer Popup) */}
      <AnimatePresence>
        {liveBannerVisible && (
          <motion.div
            key={currentLaunch.id}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -28, scale: 0.9, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, scale: 0.94, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="fixed top-20 right-3 sm:right-5 z-[75] flex max-w-[calc(100vw-1.5rem)] sm:max-w-md items-center gap-3.5 overflow-hidden rounded-2xl border border-[#E0C1A3]/65 bg-[#0f2244]/95 p-3.5 text-white shadow-[0_22px_55px_rgba(15,34,68,0.65)] backdrop-blur-xl"
          >
            {/* Animated Shimmer Accent Bar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
              className="pointer-events-none absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#E0C1A3] to-transparent"
            />

            {/* Thumbnail with Live Pulse */}
            <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E0C1A3]/40">
              <img
                src={currentLaunch.image}
                alt={currentLaunch.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-80" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E0C1A3]">
                <BellRing className="h-3 w-3 animate-bounce" />
                <span>Priority Release Alert</span>
              </div>
              <Link
                href={currentLaunch.href}
                onClick={() => setLiveBannerVisible(false)}
                className="mt-0.5 block truncate font-serif text-sm font-semibold text-white hover:text-[#E0C1A3]"
              >
                {currentLaunch.notificationTitle}
              </Link>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-white/75">
                <span>{currentLaunch.paymentPlan}</span>
                <span>·</span>
                <Link
                  href={currentLaunch.href}
                  onClick={() => setLiveBannerVisible(false)}
                  className="inline-flex items-center gap-0.5 font-bold text-[#E0C1A3] hover:underline"
                >
                  <span>Inspect</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLiveBannerVisible(false)}
              aria-label="Dismiss notification banner"
              className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Cookie Consent Banner (§54 — Compact & Mobile Safe) */}
      {!cookieConsent.decided && (
        <div className="fixed bottom-20 left-3 right-3 md:left-6 md:right-auto md:max-w-md z-50 rounded-3xl border border-[#e6dfd2] bg-white p-4 sm:p-5 text-[#0f2244] shadow-[0_24px_60px_rgba(15,34,68,0.18)]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
            <Cookie className="h-4 w-4" />
            Privacy &amp; Cookie Controls (UAE PDPL)
          </div>
          <p className="mt-1.5 text-xs text-[#39455a] leading-relaxed">
            We use essential cookies to keep your shortlist, currency, and language working. Read our{" "}
            <Link href="/cookies" className="font-semibold text-[#94652c] underline">
              Cookie Inventory
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-[#94652c] underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => updateCookieConsent({ analytics: true, preferences: true })}
              className="rounded-full bg-[#0f2244] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#94652c]"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => updateCookieConsent({ analytics: false, preferences: true })}
              className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0f2244] hover:border-[#94652c]"
            >
              Essential Only
            </button>
          </div>
        </div>
      )}

      {/* 6. Corner WhatsApp & Concierge Trigger (Mobile Safe-Area Optimized) */}
      <div
        className="fixed right-3 sm:right-5 z-50 flex items-center gap-2"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={() => setAssistantOpen(!assistantOpen)}
          aria-label="Open SWK Property Concierge"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#e6dfd2] bg-white/95 px-3.5 sm:px-4 text-xs font-bold text-[#0f2244] shadow-lg backdrop-blur-md transition hover:border-[#94652c] hover:text-[#94652c]"
        >
          <img
            src="/brand/swk-portal-emblem.png"
            alt="SWK Concierge"
            className="h-5 w-5 object-contain"
          />
          <span className="hidden sm:inline">Property Concierge</span>
        </button>
        <a
          href={`${SITE.whatsappUrl}?text=${encodeURIComponent(
            "Hello SWK Properties, I am browsing swkpropertiesuae.com and would like property assistance."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { location: "floating_corner" })}
          aria-label="Chat on WhatsApp"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-700"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      </div>

      {/* 7. SWK AI Property Assistant & Live Handover Modal (§24) */}
      {assistantOpen && (
        <div className="fixed bottom-20 right-3 sm:right-5 z-[80] flex h-[72dvh] max-h-[520px] w-[calc(100vw-1.5rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white text-[#0f2244] shadow-[0_24px_70px_rgba(15,34,68,0.28)]">
          {/* Header with Official Brand Emblem */}
          <div className="flex items-center justify-between border-b border-[#e6dfd2] bg-[#0f2244] px-5 py-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <img
                  src="/brand/swk-portal-emblem.png"
                  alt="SWK"
                  className="h-5 w-5 object-contain"
                />
                <span className="font-serif text-base font-semibold text-white">
                  SWK Property Concierge
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Live Inventory
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-white/75">
                AI Assistant (24/7) · Human Desk: Sun–Thu 9:00–19:00 GST
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAssistantOpen(false)}
              aria-label="Close assistant"
              className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#faf7f2] p-4 text-xs">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#0f2244] text-white font-medium"
                      : "border border-[#e6dfd2] bg-white text-[#0f2244] shadow-xs"
                  }`}
                >
                  {m.text}
                </div>
                {m.links && m.links.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.links.map((lnk) => (
                      <Link
                        key={lnk.href + lnk.label}
                        href={lnk.href}
                        onClick={() => setAssistantOpen(false)}
                        className="rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3 py-1 text-[11px] font-semibold text-[#94652c] hover:bg-[#94652c] hover:text-white transition"
                      >
                        {lnk.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Quick Prompt Chips */}
            <div className="pt-2">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5f6a82]">
                Quick Priority Queries:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Imtiaz Kore VIP launch details",
                  "Azizi Florence payment plan",
                  "Off-plan launches by Emaar",
                  "What are the upfront DLD buyer fees?",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setChatInput(chip)}
                    className="rounded-full border border-[#e6dfd2] bg-white px-2.5 py-1 text-[11px] font-medium text-[#0f2244] hover:border-[#94652c]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Human Handover Bar */}
          <div className="flex items-center justify-between border-t border-[#e6dfd2] bg-[#f4efe6] px-4 py-2 text-[11px]">
            <span className="text-[#39455a] font-medium">Need a human consultant?</span>
            <div className="flex items-center gap-2">
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: "ai_assistant_handover" })}
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <span className="text-[#5f6a82]">·</span>
              <a
                href={`tel:${SITE.phoneRaw}`}
                onClick={() => trackEvent("phone_click", { location: "ai_assistant_handover" })}
                className="inline-flex items-center gap-1 font-bold text-[#94652c] hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                Call Desk
              </a>
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2 border-t border-[#e6dfd2] bg-white p-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about Imtiaz Kore, Azizi Florence, or DLD fees..."
              className="flex-1 rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2 text-xs text-[#0f2244] placeholder:text-[#5f6a82] focus:border-[#94652c] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f2244] text-white hover:bg-[#94652c]"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* 8. Saved Shortlist & Side-by-Side Comparison Drawer (§46) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end bg-[#0f2244]/50 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-3xl flex-col bg-white text-[#0f2244] border-l border-[#e6dfd2] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e6dfd2] bg-[#faf7f2] px-5 sm:px-6 py-4 sm:py-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#94652c]">
                  SWK Investor Workspace
                </p>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0f2244]">
                  Saved Shortlist ({savedListings.length}) &amp; Comparison ({comparedListings.length}/4)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full border border-[#e6dfd2] bg-white p-2 text-[#39455a] hover:text-[#0f2244]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#94652c] flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Side-by-Side Property Comparison
                  </h4>
                  {comparedListings.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCompare}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#a52437] hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear Comparison
                    </button>
                  )}
                </div>

                {comparedListings.length === 0 ? (
                  <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-6 text-center text-xs text-[#39455a]">
                    Click the scale icon on any property card to compare prices, service charges, payment plans, and DLD permit numbers side by side.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-[#e6dfd2]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#faf7f2] text-[#0f2244]">
                        <tr>
                          <th className="p-3 font-bold">Metric</th>
                          {comparedListings.map((item) => (
                            <th key={item.slug} className="p-3 font-bold min-w-[170px]">
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  href={`/properties/${item.slug}`}
                                  onClick={() => setDrawerOpen(false)}
                                  className="hover:text-[#94652c] hover:underline"
                                >
                                  {item.title}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => toggleCompare(item.slug)}
                                  className="text-[#5f6a82] hover:text-[#0f2244]"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e6dfd2]">
                        <tr>
                          <td className="p-3 text-[#5f6a82] font-medium">Price</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3 font-bold text-[#0f2244]">
                              {formatPrice(item.priceAed)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 text-[#5f6a82] font-medium">Community &amp; Developer</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3">
                              {item.community} · {item.developer}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 text-[#5f6a82] font-medium">Beds / Baths / Area</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3">
                              {item.bedrooms} BR · {item.bathrooms} Bath · {formatArea(item.areaSqFt)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 text-[#5f6a82] font-medium">Handover / Plan</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3">
                              {item.paymentPlan || item.handover}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c] flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Saved Properties Shortlist
                </h4>
                {savedListings.length === 0 ? (
                  <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-6 text-center text-xs text-[#39455a]">
                    No properties saved yet. Tap the heart icon on any listing to save it here.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedListings.map((item) => (
                      <div
                        key={item.slug}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3.5"
                      >
                        <div className="min-w-0">
                          <Link
                            href={`/properties/${item.slug}`}
                            onClick={() => setDrawerOpen(false)}
                            className="block truncate font-serif text-base font-bold text-[#0f2244] hover:text-[#94652c]"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs font-semibold text-[#94652c]">{formatPrice(item.priceAed)}</p>
                          <p className="text-[11px] text-[#5f6a82]">
                            {item.community} · Ref {item.reference}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSaved(item.slug)}
                          className="rounded-full p-2 text-[#5f6a82] hover:text-[#a52437]"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6dfd2] bg-[#faf7f2] px-5 sm:px-6 py-4">
              <span className="text-xs text-[#39455a] flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-[#94652c]" />
                Send your shortlist to an SWK specialist for DLD cost sheets
              </span>
              <Link
                href="/contact"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full bg-[#0f2244] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#94652c]"
              >
                Request Shortlist Pack
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
