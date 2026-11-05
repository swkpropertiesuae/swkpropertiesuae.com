"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type CurrencyCode = "AED" | "USD" | "EUR" | "GBP" | "INR" | "RUB";
export type AreaUnit = "sqft" | "sqm";
export type LanguageCode = "en" | "ar";

export const CURRENCY_RATES: Record<
  CurrencyCode,
  { symbol: string; rateFromAed: number; label: string }
> = {
  AED: { symbol: "AED", rateFromAed: 1, label: "AED · UAE Dirham (Primary)" },
  USD: { symbol: "US$", rateFromAed: 1 / 3.6725, label: "USD · US Dollar (Approx.)" },
  EUR: { symbol: "€", rateFromAed: 0.251, label: "EUR · Euro (Approx.)" },
  GBP: { symbol: "£", rateFromAed: 0.214, label: "GBP · British Pound (Approx.)" },
  INR: { symbol: "₹", rateFromAed: 23.0, label: "INR · Indian Rupee (Approx.)" },
  RUB: { symbol: "₽", rateFromAed: 25.4, label: "RUB · Russian Ruble (Approx.)" },
};

export type AnalyticsEventName =
  | "property_view"
  | "property_search"
  | "search_no_results"
  | "form_start"
  | "enquiry_success"
  | "whatsapp_click"
  | "phone_click"
  | "brochure_download"
  | "viewing_booked"
  | "lead_qualified"
  | "deal_won";

export interface AttributionSnapshot {
  firstTouchSource: string;
  firstTouchAt: string;
  latestTouchSource: string;
  latestTouchAt: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referrer: string;
}

export interface CookieConsentState {
  decided: boolean;
  essential: true;
  analytics: boolean;
  preferences: boolean;
  updatedAt: string;
}

interface PrefsContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  areaUnit: AreaUnit;
  setAreaUnit: (u: AreaUnit) => void;
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  formatPrice: (aed: number, opts?: { compact?: boolean; includeApprox?: boolean }) => string;
  formatArea: (sqFt: number) => string;
  savedSlugs: string[];
  toggleSaved: (slug: string) => void;
  compareSlugs: string[];
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  cookieConsent: CookieConsentState;
  updateCookieConsent: (partial: { analytics: boolean; preferences: boolean }) => void;
  attribution: AttributionSnapshot;
  trackEvent: (event: AnalyticsEventName, payload?: Record<string, string | number | boolean>) => void;
  toastMessage: string | null;
  notify: (msg: string) => void;
}

const DEFAULT_ATTRIBUTION: AttributionSnapshot = {
  firstTouchSource: "direct",
  firstTouchAt: "",
  latestTouchSource: "direct",
  latestTouchAt: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  referrer: "",
};

const DEFAULT_CONSENT: CookieConsentState = {
  decided: false,
  essential: true,
  analytics: false,
  preferences: true,
  updatedAt: "",
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("AED");
  const [areaUnit, setAreaUnitState] = useState<AreaUnit>("sqft");
  const [lang, setLangState] = useState<LanguageCode>("en");
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsentState>(DEFAULT_CONSENT);
  const [attribution, setAttribution] = useState<AttributionSnapshot>(DEFAULT_ATTRIBUTION);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  useEffect(() => {
    try {
      const savedCurr = localStorage.getItem("swk_currency") as CurrencyCode | null;
      if (savedCurr && CURRENCY_RATES[savedCurr]) setCurrencyState(savedCurr);

      const savedUnit = localStorage.getItem("swk_area_unit") as AreaUnit | null;
      if (savedUnit === "sqft" || savedUnit === "sqm") setAreaUnitState(savedUnit);

      const savedLang = localStorage.getItem("swk_lang") as LanguageCode | null;
      if (savedLang === "en" || savedLang === "ar") {
        setLangState(savedLang);
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
      }

      const rawSaved = localStorage.getItem("swk_saved_slugs");
      if (rawSaved) setSavedSlugs(JSON.parse(rawSaved));

      const rawCompare = localStorage.getItem("swk_compare_slugs");
      if (rawCompare) setCompareSlugs(JSON.parse(rawCompare));

      const rawConsent = localStorage.getItem("swk_cookie_consent");
      if (rawConsent) setCookieConsent(JSON.parse(rawConsent));

      // Capture UTM & attribution snapshot (§29)
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get("utm_source") || "";
      const utmMedium = params.get("utm_medium") || "";
      const utmCampaign = params.get("utm_campaign") || "";
      const utmTerm = params.get("utm_term") || "";
      const utmContent = params.get("utm_content") || "";
      const referrer = document.referrer || "direct";
      const nowIso = new Date().toISOString();
      const sourceLabel = utmSource
        ? `${utmSource}/${utmMedium || "referral"}`
        : referrer && !referrer.includes(window.location.hostname)
        ? referrer
        : "direct";

      const existingAttrRaw = localStorage.getItem("swk_attribution");
      const existingAttr: AttributionSnapshot | null = existingAttrRaw
        ? JSON.parse(existingAttrRaw)
        : null;

      const nextAttr: AttributionSnapshot = {
        firstTouchSource: existingAttr?.firstTouchSource || sourceLabel,
        firstTouchAt: existingAttr?.firstTouchAt || nowIso,
        latestTouchSource: sourceLabel,
        latestTouchAt: nowIso,
        utmSource: utmSource || existingAttr?.utmSource || "",
        utmMedium: utmMedium || existingAttr?.utmMedium || "",
        utmCampaign: utmCampaign || existingAttr?.utmCampaign || "",
        utmTerm: utmTerm || existingAttr?.utmTerm || "",
        utmContent: utmContent || existingAttr?.utmContent || "",
        referrer,
      };
      setAttribution(nextAttr);
      localStorage.setItem("swk_attribution", JSON.stringify(nextAttr));
    } catch {
      // ignore storage errors in private mode
    }
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("swk_currency", c);
    } catch {}
  }, []);

  const setAreaUnit = useCallback((u: AreaUnit) => {
    setAreaUnitState(u);
    try {
      localStorage.setItem("swk_area_unit", u);
    } catch {}
  }, []);

  const setLang = useCallback((l: LanguageCode) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
    try {
      localStorage.setItem("swk_lang", l);
    } catch {}
  }, []);

  const toggleSaved = useCallback(
    (slug: string) => {
      setSavedSlugs((prev) => {
        const exists = prev.includes(slug);
        const next = exists ? prev.filter((item) => item !== slug) : [...prev, slug];
        try {
          localStorage.setItem("swk_saved_slugs", JSON.stringify(next));
        } catch {}
        notify(exists ? "Removed from your shortlist" : "Saved to your property shortlist");
        return next;
      });
    },
    [notify]
  );

  const toggleCompare = useCallback(
    (slug: string) => {
      setCompareSlugs((prev) => {
        const exists = prev.includes(slug);
        if (!exists && prev.length >= 4) {
          notify("Compare up to 4 properties at once");
          return prev;
        }
        const next = exists ? prev.filter((item) => item !== slug) : [...prev, slug];
        try {
          localStorage.setItem("swk_compare_slugs", JSON.stringify(next));
        } catch {}
        notify(exists ? "Removed from comparison" : "Added to comparison drawer");
        return next;
      });
    },
    [notify]
  );

  const clearCompare = useCallback(() => {
    setCompareSlugs([]);
    try {
      localStorage.removeItem("swk_compare_slugs");
    } catch {}
  }, []);

  const updateCookieConsent = useCallback(
    (partial: { analytics: boolean; preferences: boolean }) => {
      const next: CookieConsentState = {
        decided: true,
        essential: true,
        analytics: partial.analytics,
        preferences: partial.preferences,
        updatedAt: new Date().toISOString(),
      };
      setCookieConsent(next);
      try {
        localStorage.setItem("swk_cookie_consent", JSON.stringify(next));
      } catch {}
      notify("Cookie preferences saved");
    },
    [notify]
  );

  const formatPrice = useCallback(
    (aed: number, opts?: { compact?: boolean; includeApprox?: boolean }) => {
      const aedFormatted = opts?.compact
        ? aed >= 1_000_000
          ? `AED ${(aed / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`
          : `AED ${Math.round(aed / 1000)}K`
        : `AED ${aed.toLocaleString("en-US")}`;

      if (currency === "AED") return aedFormatted;

      const info = CURRENCY_RATES[currency];
      const converted = Math.round(aed * info.rateFromAed);
      const convFormatted = opts?.compact
        ? converted >= 1_000_000
          ? `${info.symbol} ${(converted / 1_000_000).toFixed(2)}M`
          : `${info.symbol} ${converted.toLocaleString("en-US")}`
        : `${info.symbol} ${converted.toLocaleString("en-US")}`;

      if (opts?.includeApprox === false) {
        return `${aedFormatted} (${convFormatted})`;
      }
      return `${aedFormatted} · Approx. ${convFormatted}`;
    },
    [currency]
  );

  const formatArea = useCallback(
    (sqFt: number) => {
      if (areaUnit === "sqft") {
        return `${sqFt.toLocaleString("en-US")} sq ft`;
      }
      const sqM = Math.round(sqFt * 0.092903);
      return `${sqM.toLocaleString("en-US")} sq m (${sqFt.toLocaleString("en-US")} sq ft)`;
    },
    [areaUnit]
  );

  // Analytics & Event Tracking (§30, §32) — never sends PII in event payloads
  const trackEvent = useCallback(
    (event: AnalyticsEventName, payload?: Record<string, string | number | boolean>) => {
      try {
        const safePayload = { ...(payload || {}) };
        delete safePayload.email;
        delete safePayload.phone;
        delete safePayload.name;

        const record = {
          event,
          timestamp: new Date().toISOString(),
          path: typeof window !== "undefined" ? window.location.pathname : "",
          payload: safePayload,
        };

        if (typeof window !== "undefined") {
          const w = window as unknown as { dataLayer?: unknown[] };
          w.dataLayer = w.dataLayer || [];
          w.dataLayer.push(record);
        }
      } catch {
        // non-blocking
      }
    },
    []
  );

  return (
    <PrefsContext.Provider
      value={{
        currency,
        setCurrency,
        areaUnit,
        setAreaUnit,
        lang,
        setLang,
        formatPrice,
        formatArea,
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
        attribution,
        trackEvent,
        toastMessage,
        notify,
      }}
    >
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) {
    throw new Error("usePrefs must be used within PrefsProvider");
  }
  return ctx;
}
