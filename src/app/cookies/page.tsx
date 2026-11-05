"use client"

import * as React from "react"
import { CheckCircle2, Cookie, ShieldCheck } from "lucide-react"
import { usePrefs } from "@/lib/prefs"

const TRACKER_INVENTORY = [
  {
    name: "swk_cookie_consent_v1",
    category: "Essential",
    storage: "localStorage",
    purpose: "Stores your cookie and analytics consent choices so we do not prompt you on every page load.",
    retention: "12 months",
  },
  {
    name: "swk_prefs_v1",
    category: "Preferences",
    storage: "localStorage",
    purpose: "Remembers your selected display currency (AED/USD/EUR/GBP/INR/RUB), area unit (sq ft / sq m), and language direction.",
    retention: "Persistent until cleared",
  },
  {
    name: "swk_saved_v1 & swk_compare_v1",
    category: "Preferences",
    storage: "localStorage",
    purpose: "Stores your shortlisted property slugs and side-by-side comparison tray locally in your browser.",
    retention: "Persistent until cleared",
  },
  {
    name: "swk_attribution_v1",
    category: "Analytics",
    storage: "localStorage",
    purpose: "Records first-touch and latest-touch UTM campaign parameters and referrer URL to attribute property enquiries accurately.",
    retention: "Session / 30 days",
  },
]

export default function CookieSettingsPage() {
  const { cookieConsent, updateCookieConsent } = usePrefs()
  const [analytics, setAnalytics] = React.useState(cookieConsent?.analytics ?? false)
  const [preferences, setPreferences] = React.useState(cookieConsent?.preferences ?? true)
  const [savedToast, setSavedToast] = React.useState(false)

  React.useEffect(() => {
    if (cookieConsent) {
      setAnalytics(cookieConsent.analytics)
      setPreferences(cookieConsent.preferences)
    }
  }, [cookieConsent])

  const handleSave = () => {
    updateCookieConsent({ analytics, preferences })
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94652c]">
            <Cookie className="h-3.5 w-3.5" /> Checklist §54 · Granular Consent & Tracker Inventory
          </span>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
            Cookie Settings & Browser Storage Inventory
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#39455a] leading-relaxed">
            Control how SWK Properties uses browser storage and analytics events. Essential storage is required for basic site security and consent memory; you can toggle Preferences and Analytics at any time.
          </p>
        </div>

        {/* Interactive Toggles */}
        <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#e6dfd2] pb-5">
            <div>
              <div className="text-sm font-semibold text-[#0f2244]">
                1. Strictly Necessary & Security Storage (Always Active)
              </div>
              <p className="mt-1 text-xs text-[#39455a]">
                Required for form spam protection, duplicate-submission prevention, and saving your privacy consent state.
              </p>
            </div>
            <span className="rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3 py-1 text-[11px] font-semibold text-[#94652c]">
              Always Active
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 border-b border-[#e6dfd2] pb-5">
            <div>
              <div className="text-sm font-semibold text-[#0f2244]">
                2. Functional Preferences (Currency, sq ft/sq m & Saved Shortlist)
              </div>
              <p className="mt-1 text-xs text-[#39455a]">
                Remembers your preferred reference currency, area unit, and shortlisted properties across page visits.
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences}
              onChange={(e) => setPreferences(e.target.checked)}
              className="h-5 w-5 accent-[#e6cf9c]"
              aria-label="Enable Functional Preferences"
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[#0f2244]">
                3. First-Party Analytics & Enquiry Attribution (`§29`)
              </div>
              <p className="mt-1 text-xs text-[#39455a]">
                Allows SWK Properties to measure search-filter usage, calculator interactions, and UTM campaign attribution without third-party ad retargeting.
              </p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="h-5 w-5 accent-[#e6cf9c]"
              aria-label="Enable First-Party Analytics"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#e6dfd2]">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-[#0f2244] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-[#f3dfb1]"
            >
              Save My Preferences
            </button>
            <button
              type="button"
              onClick={() => {
                setAnalytics(true)
                setPreferences(true)
                updateCookieConsent({ analytics: true, preferences: true })
                setSavedToast(true)
                setTimeout(() => setSavedToast(false), 3000)
              }}
              className="rounded-full border border-[#e6dfd2] px-5 py-2.5 text-xs font-semibold text-[#0f2244] hover:border-[#94652c]"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => {
                setAnalytics(false)
                setPreferences(false)
                updateCookieConsent({ analytics: false, preferences: false })
                setSavedToast(true)
                setTimeout(() => setSavedToast(false), 3000)
              }}
              className="rounded-full border border-[#e6dfd2] px-5 py-2.5 text-xs font-semibold text-[#39455a] hover:border-white/40"
            >
              Essential Only
            </button>
            {savedToast && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94652c]">
                <CheckCircle2 className="h-4 w-4" /> Preferences saved
              </span>
            )}
          </div>
        </section>

        {/* Full Tracker & Storage Inventory Table (§54) */}
        <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8 overflow-x-auto">
          <h2 className="font-serif text-2xl font-semibold text-[#0f2244]">
            Complete Cookie & LocalStorage Inventory
          </h2>
          <table className="mt-4 w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e6dfd2] text-[#94652c]">
                <th className="py-3 pr-4">Key / Identifier</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Mechanism</th>
                <th className="py-3 pr-4">Purpose</th>
                <th className="py-3">Retention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfd2] text-[#39455a]">
              {TRACKER_INVENTORY.map((row) => (
                <tr key={row.name}>
                  <td className="py-3 pr-4 font-mono text-[#94652c]">{row.name}</td>
                  <td className="py-3 pr-4">{row.category}</td>
                  <td className="py-3 pr-4">{row.storage}</td>
                  <td className="py-3 pr-4">{row.purpose}</td>
                  <td className="py-3">{row.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
