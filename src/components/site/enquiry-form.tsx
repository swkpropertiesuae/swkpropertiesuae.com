"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Calendar,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";

export type EnquiryContextType =
  | "property"
  | "viewing"
  | "investment"
  | "advisory"
  | "buying"
  | "renting"
  | "callback"
  | "selling"
  | "renting-out"
  | "brochure"
  | "general";

export interface EnquiryFormProps {
  context?: EnquiryContextType;
  subject?: string;
  heading?: string;
  subheading?: string;
  propertyRef?: string;
  propertyTitle?: string;
  community?: string;
  developer?: string;
  agentSlug?: string;
  agentName?: string;
  defaultViewingPicker?: boolean;
  compact?: boolean;
  className?: string;
}

const COUNTRY_CODES = [
  { code: "+971", label: "🇦🇪 +971 (UAE)" },
  { code: "+44", label: "🇬🇧 +44 (UK)" },
  { code: "+1", label: "🇺🇸 +1 (US/CA)" },
  { code: "+91", label: "🇮🇳 +91 (India)" },
  { code: "+966", label: "🇸🇦 +966 (KSA)" },
  { code: "+49", label: "🇩🇪 +49 (DE)" },
  { code: "+33", label: "🇫🇷 +33 (FR)" },
  { code: "+7", label: "🇷🇺 +7 (RU/KZ)" },
  { code: "+65", label: "🇸🇬 +65 (SG)" },
  { code: "+41", label: "🇨🇭 +41 (CH)" },
];

const GST_SLOTS = [
  "10:00 GST (Morning)",
  "11:30 GST (Late Morning)",
  "14:00 GST (Afternoon)",
  "16:30 GST (Late Afternoon)",
  "18:00 GST (Early Evening)",
];

export function EnquiryForm({
  context = "general",
  heading = "Request a Verified Shortlist or Private Consultation",
  subheading = "Short, direct, and handled by a RERA-licensed SWK specialist at Al Saqr Business Tower. No automated spam.",
  propertyRef,
  propertyTitle,
  community,
  developer,
  agentSlug,
  agentName,
  defaultViewingPicker = false,
  compact = false,
  className = "",
}: EnquiryFormProps) {
  const { attribution, lang, trackEvent, notify } = usePrefs();

  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredContact, setPreferredContact] = useState<"WhatsApp" | "Phone Call" | "Email">("WhatsApp");
  const [message, setMessage] = useState(
    propertyTitle
      ? `I would like verified details, floor plans, and availability for ${propertyTitle}${propertyRef ? ` (Ref: ${propertyRef})` : ""}.`
      : ""
  );
  const [includeViewing, setIncludeViewing] = useState(defaultViewingPicker || context === "viewing");
  const [viewingDate, setViewingDate] = useState("");
  const [viewingTimeGst, setViewingTimeGst] = useState(GST_SLOTS[1]);
  const [viewingMode, setViewingMode] = useState<"In-Person Viewing (Dubai)" | "Live Video Walkthrough">(
    "In-Person Viewing (Dubai)"
  );
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState(""); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<{
    enquiryId: string;
    submittedAtGst: string;
    routing: { primaryAgent: string; primaryRole: string; backupAgent: string };
  } | null>(null);

  // Post-submit optional Step 2 Qualification (§27)
  const [budgetRange, setBudgetRange] = useState("AED 2M – AED 5M");
  const [timeline, setTimeline] = useState("Within 30–60 days");
  const [financing, setFinancing] = useState("Cash Buyer");
  const [residency, setResidency] = useState("Overseas Investor");
  const [qualifiedSaved, setQualifiedSaved] = useState(false);

  const visitorTz =
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Local Time";

  const handleFirstFocus = () => {
    if (!started) {
      setStarted(true);
      trackEvent("form_start", {
        context,
        propertyRef: propertyRef || "none",
        community: community || "all",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          countryCode,
          phone,
          email,
          message,
          context,
          preferredContact,
          marketingConsent,
          viewingDate: includeViewing ? viewingDate : undefined,
          viewingTimeGst: includeViewing ? viewingTimeGst : undefined,
          viewingMode: includeViewing ? viewingMode : undefined,
          propertyRef,
          propertyTitle,
          community,
          developer,
          agentSlug,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          language: lang,
          attribution,
          companyWebsite,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Please check your details and try again.");
        setSubmitting(false);
        return;
      }

      setResult({
        enquiryId: data.enquiryId,
        submittedAtGst: data.submittedAtGst,
        routing: data.routing,
      });

      trackEvent("enquiry_success", {
        enquiryId: data.enquiryId,
        context,
        propertyRef: propertyRef || "none",
      });

      if (context === "brochure") {
        trackEvent("brochure_download", {
          enquiryId: data.enquiryId,
          propertyRef: propertyRef || "none",
        });
      }
      if (includeViewing && viewingDate) {
        trackEvent("viewing_booked", {
          enquiryId: data.enquiryId,
          viewingMode,
          propertyRef: propertyRef || "none",
        });
      }

      notify(`Enquiry confirmed (${data.enquiryId})`);
    } catch {
      setErrorMsg(
        "Network error. You can also reach us immediately on WhatsApp at +971 56 433 0448."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQualificationSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setQualifiedSaved(true);
    trackEvent("lead_qualified", {
      enquiryId: result?.enquiryId || "unknown",
      budgetRange,
      timeline,
      financing,
      residency,
    });
    notify("Investment preferences added to your file");
  };

  if (result) {
    const waText = encodeURIComponent(
      `Hello SWK Properties, I just submitted enquiry ${result.enquiryId}${
        propertyTitle ? ` regarding ${propertyTitle}` : ""
      }. My name is ${name}.`
    );

    return (
      <div
        className={`rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-9 text-[#0f2244] shadow-[0_24px_60px_rgba(15,34,68,0.12)] ${className}`}
      >
        <div className="flex items-center gap-3 text-emerald-700 mb-4">
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-[0.22em]">
            Enquiry Logged & Routed · Ref {result.enquiryId}
          </span>
        </div>

        <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#0f2244]">
          Thank you, {name}. Your mandate is with our desk.
        </h3>
        <p className="mt-2 text-sm text-[#39455a] leading-relaxed">
          Logged at <span className="font-semibold text-[#94652c]">{result.submittedAtGst}</span>. Assigned to{" "}
          <strong className="text-[#0f2244]">{result.routing.primaryAgent}</strong> (
          {result.routing.primaryRole}) with backup coverage by {result.routing.backupAgent}.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`https://wa.me/${SITE.phoneRaw.replace("+", "")}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("whatsapp_click", {
                location: "enquiry_confirmation",
                enquiryId: result.enquiryId,
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            Continue on WhatsApp Now
          </a>
          <Link
            href={`/thank-you?ref=${encodeURIComponent(result.enquiryId)}&agent=${encodeURIComponent(
              result.routing.primaryAgent
            )}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/40 bg-[#faf7f2] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#94652c] hover:bg-[#94652c] hover:text-white transition"
          >
            Open Confirmation & Guides
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Step 2 Optional Lead Qualification (§27) */}
        {!qualifiedSaved ? (
          <form
            onSubmit={handleQualificationSave}
            className="mt-7 border-t border-[#e6dfd2] pt-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#94652c] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Optional Step 2: Tailor Your Shortlist (Takes 15 Seconds)
              </p>
              <span className="text-[11px] font-medium text-[#5f6a82]">100% Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="block">
                <span className="text-[#39455a] font-semibold mb-1 block">Target Budget Range</span>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2.5 font-medium text-[#0f2244]"
                >
                  <option>Up to AED 1.5M</option>
                  <option>AED 1.5M – AED 3M</option>
                  <option>AED 2M – AED 5M (Golden Visa Tier)</option>
                  <option>AED 5M – AED 15M</option>
                  <option>AED 15M+ Prime / Trophy</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[#39455a] font-semibold mb-1 block">Target Timeframe</span>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2.5 font-medium text-[#0f2244]"
                >
                  <option>Immediate / Within 14 days</option>
                  <option>Within 30–60 days</option>
                  <option>Within 3–6 months</option>
                  <option>Researching 2026–2028 Off-Plan</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[#39455a] font-semibold mb-1 block">Purchase Structure</span>
                <select
                  value={financing}
                  onChange={(e) => setFinancing(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2.5 font-medium text-[#0f2244]"
                >
                  <option>Cash Buyer</option>
                  <option>Developer Milestone Plan</option>
                  <option>UAE Mortgage Finance</option>
                  <option>Annual / Corporate Tenancy</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[#39455a] font-semibold mb-1 block">Buyer Profile</span>
                <select
                  value={residency}
                  onChange={(e) => setResidency(e.target.value)}
                  className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3 py-2.5 font-medium text-[#0f2244]"
                >
                  <option>Overseas Investor</option>
                  <option>UAE Resident (End-User)</option>
                  <option>UAE Resident (Investor)</option>
                  <option>Relocating to Dubai</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="rounded-full bg-[#0f2244] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-[#94652c]"
            >
              Attach Preferences to {result.enquiryId}
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-2xl border border-emerald-600/30 bg-emerald-50 p-4 text-xs font-medium text-emerald-900">
            Preferences saved ({budgetRange} · {financing} · {timeline}). Your consultant will prepare matching DLD data sheets ahead of your call.
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFirstFocus}
      className={`rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 text-[#0f2244] shadow-[0_24px_60px_rgba(15,34,68,0.10)] ${className}`}
    >
      {!compact && (
        <div className="mb-6">
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#94652c]/30 bg-[#f6ead7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#94652c]">
            <ShieldCheck className="h-3.5 w-3.5" />
            RERA Licensed Desk · ORN {SITE.reraOrn}
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#0f2244]">
            {heading}
          </h3>
          <p className="mt-1.5 text-sm text-[#39455a] leading-relaxed">{subheading}</p>
          {propertyTitle && (
            <div className="mt-3 rounded-xl border border-[#94652c]/30 bg-[#faf7f2] px-3.5 py-2 text-xs font-medium text-[#94652c]">
              Enquiring on: <strong className="text-[#0f2244]">{propertyTitle}</strong>
              {propertyRef ? ` · Ref: ${propertyRef}` : ""}
              {agentName ? ` · Specialist: ${agentName}` : ""}
            </div>
          )}
        </div>
      )}

      {/* Honeypot field hidden from screen and tab order */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
          />
        </label>
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#a52437]/40 bg-[#a52437]/10 p-3.5 text-xs font-medium text-[#a52437]">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[#0f2244]">
            Full Name <span className="text-[#94652c]">*</span>
          </span>
          <input
            type="text"
            required
            placeholder="e.g. Tariq Al Mansoori"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2.5 text-sm font-medium text-[#0f2244] placeholder:text-[#5f6a82]/60 focus:border-[#94652c] focus:bg-white focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[#0f2244]">
            Email Address <span className="text-[#94652c]">*</span>
          </span>
          <input
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2.5 text-sm font-medium text-[#0f2244] placeholder:text-[#5f6a82]/60 focus:border-[#94652c] focus:bg-white focus:outline-none"
          />
        </label>
      </div>

      {/* International Phone with Country Code (§17) */}
      <div className="mt-4">
        <span className="mb-1.5 block text-xs font-bold text-[#0f2244]">
          Phone / WhatsApp Number (International Supported) <span className="text-[#94652c]">*</span>
        </span>
        <div className="flex gap-2">
          <select
            aria-label="Country code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-36 shrink-0 rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-2.5 py-2.5 text-xs font-semibold text-[#0f2244] focus:border-[#94652c] focus:bg-white focus:outline-none"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="tel"
            required
            placeholder="56 433 0448"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2.5 text-sm font-medium text-[#0f2244] placeholder:text-[#5f6a82]/60 focus:border-[#94652c] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Preferred Contact Method (§17) */}
      <div className="mt-4">
        <span className="mb-1.5 block text-xs font-bold text-[#0f2244]">
          Preferred Contact Channel
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(["WhatsApp", "Phone Call", "Email"] as const).map((channel) => (
            <button
              key={channel}
              type="button"
              onClick={() => setPreferredContact(channel)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                preferredContact === channel
                  ? "border-[#0f2244] bg-[#0f2244] text-white"
                  : "border-[#e6dfd2] bg-[#faf7f2] text-[#39455a] hover:border-[#94652c]"
              }`}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Viewing Slot Picker in Asia/Dubai GST (§23) */}
      <div className="mt-4 rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3.5">
        <label className="flex items-center justify-between cursor-pointer text-xs">
          <span className="flex items-center gap-2 font-bold text-[#0f2244]">
            <Calendar className="h-4 w-4 text-[#94652c]" />
            Schedule a Viewing or Live Video Walkthrough (Asia/Dubai GST)
          </span>
          <input
            type="checkbox"
            checked={includeViewing}
            onChange={(e) => setIncludeViewing(e.target.checked)}
            className="h-4 w-4 accent-[#0f2244]"
          />
        </label>

        {includeViewing && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#e6dfd2] text-xs">
            <label className="block">
              <span className="text-[#39455a] font-semibold mb-1 block">Preferred Date</span>
              <input
                type="date"
                value={viewingDate}
                onChange={(e) => setViewingDate(e.target.value)}
                className="w-full rounded-lg border border-[#e6dfd2] bg-white px-2.5 py-2 font-medium text-[#0f2244]"
              />
            </label>
            <label className="block">
              <span className="text-[#39455a] font-semibold mb-1 block">Dubai Time (GST · UTC+4)</span>
              <select
                value={viewingTimeGst}
                onChange={(e) => setViewingTimeGst(e.target.value)}
                className="w-full rounded-lg border border-[#e6dfd2] bg-white px-2.5 py-2 font-medium text-[#0f2244]"
              >
                {GST_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[#39455a] font-semibold mb-1 block">Format</span>
              <select
                value={viewingMode}
                onChange={(e) =>
                  setViewingMode(
                    e.target.value as "In-Person Viewing (Dubai)" | "Live Video Walkthrough"
                  )
                }
                className="w-full rounded-lg border border-[#e6dfd2] bg-white px-2.5 py-2 font-medium text-[#0f2244]"
              >
                <option value="In-Person Viewing (Dubai)">In-Person Viewing (Dubai)</option>
                <option value="Live Video Walkthrough">Live Video Walkthrough</option>
              </select>
            </label>
            <p className="sm:col-span-3 text-[11px] text-[#5f6a82] flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#94652c]" />
              All physical viewings are anchored in Dubai Gulf Standard Time (Asia/Dubai, UTC+4). Your detected timezone: {visitorTz}.
            </p>
          </div>
        )}
      </div>

      {/* Requirement / Message */}
      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-bold text-[#0f2244]">
          Requirements or Questions (Optional)
        </span>
        <textarea
          rows={compact ? 2 : 3}
          placeholder="Tell us your preferred bedrooms, communities, payment plan, or questions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-2.5 text-sm font-medium text-[#0f2244] placeholder:text-[#5f6a82]/60 focus:border-[#94652c] focus:bg-white focus:outline-none"
        />
      </label>

      {/* Separate Marketing Opt-In & UAE PDPL Notice (§17, §53) */}
      <div className="mt-4 space-y-2 text-[11px] text-[#5f6a82]">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-[#0f2244]"
          />
          <span>
            Optional: Send me verified Dubai off-plan launch alerts and quarterly DLD market reports. You can unsubscribe at any time.
          </span>
        </label>
        <p className="leading-relaxed">
          By submitting this enquiry, you authorise SWK Properties LLC (RERA ORN {SITE.reraOrn}) to contact you regarding your property mandate in accordance with the{" "}
          <Link href="/privacy" className="font-semibold text-[#94652c] underline underline-offset-2">
            UAE PDPL Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f2244] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#94652c] disabled:opacity-50"
        >
          {submitting
            ? "Logging Mandate..."
            : context === "brochure"
            ? "Request Verified Brochure & Floor Plans"
            : includeViewing
            ? "Confirm Viewing & Enquiry"
            : "Submit Enquiry to SWK Desk"}
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 text-xs font-semibold text-[#0f2244]">
          <a
            href={`tel:${SITE.phoneRaw}`}
            onClick={() => trackEvent("phone_click", { location: "enquiry_form" })}
            className="inline-flex items-center gap-1.5 hover:text-[#94652c]"
          >
            <Phone className="h-3.5 w-3.5 text-[#94652c]" />
            {SITE.phone}
          </a>
        </div>
      </div>
    </form>
  );
}
