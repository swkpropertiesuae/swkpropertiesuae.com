"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bot,
  Building2,
  Calculator,
  CheckCircle2,
  Cookie,
  Heart,
  MessageCircle,
  Phone,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { ExpandableActionBar, type ExpandableActionBarItem } from "@/components/ui/be-ui-expanable-action-bar";
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

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Welcome to SWK Properties (RERA ORN 51517). I am the SWK AI Property Assistant—I search our verified Dubai listings, 108 developer projects, and RERA/DLD guides. I never invent prices or yields. How can I assist your search today?",
    links: [
      { label: "Browse Ready & Off-Plan Listings", href: "/properties" },
      { label: "Explore 108 Developer Projects", href: "/off-plan" },
      { label: "DLD 4% & Mortgage Calculators", href: "/calculators" },
    ],
  },
];

function generateAssistantReply(query: string): {
  text: string;
  links: { label: string; href: string }[];
} {
  const q = query.toLowerCase();

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
      text: `Here are verified listings in our current inventory matching your query:\n${summary}\n\nLive unit availability and final terms are confirmed directly by our RERA-licensed consultants prior to viewing or reservation.`,
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
      text: `We track ${matchedProjects.length}+ verified developer releases matching "${query}". Note that off-plan starting prices, floor plans, and handover dates depend on live developer inventory and DLD escrow registration.`,
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
      text: `${matchedFaq.a}\n\nFor case-specific legal, tax, or mortgage confirmation, we recommend speaking directly with our Sheikh Zayed Road advisory desk.`,
      links: [
        { label: "Read Full FAQ & Guides", href: "/faq" },
        { label: "Speak with an SWK Consultant", href: "/contact" },
      ],
    };
  }

  return {
    text: "I only answer from verified SWK Properties inventory and approved Dubai Land Department / RERA guidance—I do not guess live unit prices, yields, or legal advice. Would you like me to connect you with a human SWK consultant on WhatsApp or open our filtered property search?",
    links: [
      { label: "Search All Properties", href: "/properties" },
      { label: "Book a Private Consultation", href: "/contact" },
      { label: "Buyer & Investor Guides", href: "/guides/buying" },
    ],
  };
}

export function FloatingChrome() {
  const router = useRouter();
  const pathname = usePathname();
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
  const [offerDismissed, setOfferDismissed] = useState(false);
  const [showOfferCard, setShowOfferCard] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (!sessionStorage.getItem("swk_offer_seen")) {
          setShowOfferCard(true);
        }
      } catch {
        setShowOfferCard(true);
      }
    }, 9000);
    return () => window.clearTimeout(timer);
  }, []);

  const dismissOffer = () => {
    setOfferDismissed(true);
    setShowOfferCard(false);
    try {
      sessionStorage.setItem("swk_offer_seen", "1");
    } catch {}
  };

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
  const totalSavedCount = savedSlugs.length + compareSlugs.length;

  const dockItems: ExpandableActionBarItem[] = [
    {
      id: "search",
      label: "Search",
      icon: <Search className="h-4 w-4 text-[#0f2244]" />,
      active: pathname === "/properties",
      onClick: () => router.push("/properties"),
    },
    {
      id: "properties",
      label: "Properties",
      icon: <Building2 className="h-4 w-4 text-[#94652c]" />,
      active:
        pathname.startsWith("/buy") ||
        pathname.startsWith("/rent") ||
        pathname.startsWith("/off-plan"),
      onClick: () => router.push("/properties"),
    },
    {
      id: "calculators",
      label: "DLD & Yield",
      icon: <Calculator className="h-4 w-4 text-[#0f2244]" />,
      active: pathname.startsWith("/calculators"),
      onClick: () => router.push("/calculators"),
    },
    {
      id: "shortlist",
      label: "Shortlist",
      icon: <Scale className="h-4 w-4 text-[#94652c]" />,
      badge: totalSavedCount > 0 ? String(totalSavedCount) : undefined,
      active: drawerOpen,
      onClick: () => setDrawerOpen(true),
    },
    {
      id: "concierge",
      label: "SWK AI",
      icon: <Bot className="h-4 w-4 text-[#0f2244]" />,
      active: assistantOpen,
      onClick: () => setAssistantOpen(!assistantOpen),
    },
    {
      id: "whatsapp",
      label: "WhatsApp Desk",
      icon: <MessageCircle className="h-4 w-4 text-emerald-700" />,
      onClick: () => {
        trackEvent("whatsapp_click", { location: "floating_dock" });
        window.open(
          `${SITE.whatsappUrl}?text=${encodeURIComponent(
            "Hello SWK Properties, I am browsing swkpropertiesuae.com and would like property assistance."
          )}`,
          "_blank",
          "noopener,noreferrer"
        );
      },
    },
  ];

  return (
    <>
      {/* 1. Toast Notification Pill */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-4 z-[80] flex items-center gap-2 rounded-full border border-[#94652c]/40 bg-white px-4 py-2.5 text-xs font-semibold text-[#0f2244] shadow-xl"
        >
          <CheckCircle2 className="h-4 w-4 text-[#2f5d3a]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Non-Intrusive Launch Watchlist & Advisory Alert Popup (Dismissible, Zero Fake Urgency) */}
      {showOfferCard && !offerDismissed && cookieConsent.decided && (
        <div className="fixed bottom-24 left-4 z-40 max-w-xs rounded-2xl border border-[#e6dfd2] bg-white p-4 text-[#0f2244] shadow-[0_20px_50px_rgba(15,34,68,0.14)]">
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#94652c]">
              <Sparkles className="h-3.5 w-3.5" />
              Dubai Advisory Briefing
            </span>
            <button
              type="button"
              onClick={dismissOffer}
              aria-label="Close briefing notification"
              className="text-[#5f6a82] hover:text-[#0f2244]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 font-serif text-lg font-bold text-[#0f2244]">
            2026 Escrow-Verified Off-Plan & DLD Cost Sheet
          </p>
          <p className="mt-1 text-xs text-[#39455a] leading-relaxed">
            Compare payment plans across Emaar, Sobha, DAMAC & Nakheel or run our DLD 4% transfer calculator.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Link
              href="/off-plan"
              onClick={dismissOffer}
              className="rounded-full bg-[#0f2244] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#94652c]"
            >
              View Launches
            </Link>
            <Link
              href="/calculators"
              onClick={dismissOffer}
              className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0f2244] hover:border-[#94652c]"
            >
              Calculators
            </Link>
          </div>
        </div>
      )}

      {/* 3. Cookie Consent Banner (§54 — Blocks non-essential analytics until accepted) */}
      {!cookieConsent.decided && (
        <div className="fixed bottom-20 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 rounded-3xl border border-[#e6dfd2] bg-white p-5 text-[#0f2244] shadow-[0_24px_60px_rgba(15,34,68,0.18)]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c]">
            <Cookie className="h-4 w-4" />
            Privacy & Cookie Controls (UAE PDPL)
          </div>
          <p className="mt-2 text-xs text-[#39455a] leading-relaxed">
            We use essential cookies to keep your shortlist, currency, and language working. Non-essential analytics cookies are disabled until you consent. Read our{" "}
            <Link href="/cookies" className="font-semibold text-[#94652c] underline">
              Cookie Inventory
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-[#94652c] underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
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
            <Link
              href="/cookies"
              className="px-2 py-1 text-[11px] font-medium text-[#5f6a82] hover:text-[#0f2244]"
            >
              Customise
            </Link>
          </div>
        </div>
      )}

      {/* 4. Clean 21st.dev Floating Interactive Dock (`ExpandableActionBar`) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <ExpandableActionBar
          items={dockItems}
          defaultExpanded={false}
          expandOnHover
          size="md"
          classNames={{
            track:
              "border-[#e6dfd2] bg-white/95 shadow-[0_18px_48px_rgba(15,34,68,0.18)] backdrop-blur-xl px-2 py-1.5",
            item: "text-[#0f2244] hover:text-[#94652c] px-2.5",
            activeItem: "font-bold text-[#0f2244]",
            label: "text-xs font-semibold text-[#0f2244]",
            badge: "bg-[#0f2244] text-white font-bold",
          }}
        />
      </div>

      {/* 5. SWK AI Property Assistant & Live Handover Modal (§24) */}
      {assistantOpen && (
        <div className="fixed bottom-20 right-4 z-[60] flex h-[520px] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white text-[#0f2244] shadow-[0_24px_70px_rgba(15,34,68,0.22)]">
          {/* Header with Honest Status & Bot Disclosure */}
          <div className="flex items-center justify-between border-b border-[#e6dfd2] bg-[#0f2244] px-5 py-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-[#dcb888]" />
                <span className="font-serif text-base font-semibold text-white">
                  SWK AI Property Assistant
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Verified Data Only
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
              className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
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
                Quick Verified Queries:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Ready homes in Downtown Dubai",
                  "Annual rentals in Dubai Marina",
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
            <span className="text-[#39455a] font-medium">Need a human RERA consultant?</span>
            <div className="flex items-center gap-2">
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: "ai_assistant_handover" })}
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp Handover
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
              placeholder="Ask about communities, DLD fees, or listings..."
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

      {/* 6. Saved Shortlist & Side-by-Side Comparison Drawer (§46) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-[#0f2244]/50 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-3xl flex-col bg-white text-[#0f2244] border-l border-[#e6dfd2] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e6dfd2] bg-[#faf7f2] px-6 py-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#94652c]">
                  SWK Investor Workspace
                </p>
                <h3 className="font-serif text-2xl font-bold text-[#0f2244]">
                  Saved Shortlist ({savedListings.length}) & Comparison ({comparedListings.length}/4)
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

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Side-by-Side Comparison Table */}
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
                          <td className="p-3 text-[#5f6a82] font-medium">Community & Developer</td>
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
                          <td className="p-3 text-[#5f6a82] font-medium">Price per sq ft (AED)</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3">
                              AED {Math.round(item.priceAed / item.areaSqFt).toLocaleString("en-US")}/sq ft
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 text-[#5f6a82] font-medium">Est. Service Charge</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3">
                              AED {item.serviceChargePerSqFt}/sq ft
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
                        <tr>
                          <td className="p-3 text-[#5f6a82] font-medium">DLD Trakheesi Permit</td>
                          {comparedListings.map((item) => (
                            <td key={item.slug} className="p-3 text-emerald-700 font-mono font-semibold">
                              #{item.dld.permitNumber}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Saved Shortlist */}
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

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6dfd2] bg-[#faf7f2] px-6 py-4">
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
