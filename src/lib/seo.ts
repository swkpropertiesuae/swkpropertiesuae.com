import type { Metadata } from "next"
import { SITE } from "@/lib/swk"

export const SITE_URL = "https://www.swkpropertiesuae.com"
export const OG_DEFAULT = "/img/hero/dubai-skyline-hero.webp"

/** Search and AI-search keyword clusters used across page metadata and structured data. */
export const KEYWORDS = {
  core: [
    "Dubai real estate",
    "Dubai property",
    "property in Dubai",
    "UAE real estate agency",
    "Dubai real estate agency",
    "RERA registered brokerage Dubai",
    "SWK Properties",
  ],
  home: [
    "Dubai real estate",
    "SWK Properties Dubai",
    "off plan properties Dubai",
    "buy apartment in Dubai",
    "RERA ORN 51517",
  ],
  offPlan: [
    "off plan properties Dubai",
    "off plan projects Dubai 2026",
    "new launches Dubai",
    "Dubai off plan payment plan",
    "post handover payment plan Dubai",
    "buy off plan apartment Dubai",
    "Oqood registration Dubai",
    "off plan vs ready property Dubai",
  ],
  buy: [
    "buy apartment in Dubai",
    "buy villa in Dubai",
    "buy townhouse in Dubai",
    "secondary market property Dubai",
    "ready properties Dubai",
    "Dubai property for sale",
    "foreigners buying property in Dubai",
    "freehold areas Dubai",
    "DLD transfer fee 4 percent",
  ],
  rent: [
    "apartments for rent in Dubai",
    "villas for rent in Dubai",
    "Dubai rental yearly",
    "Ejari registration",
    "property management Dubai",
    "landlord services Dubai",
  ],
  invest: [
    "Dubai property investment",
    "best areas to invest in Dubai",
    "Dubai rental yield",
    "high ROI property Dubai",
    "Golden Visa property Dubai",
    "property investment UAE 2026",
    "Dubai mortgage for non residents",
  ],
  places: [
    "Downtown Dubai apartments",
    "Dubai Marina apartments",
    "Palm Jumeirah villas",
    "Business Bay apartments",
    "Dubai Hills Estate",
    "Jumeirah Village Circle JVC",
    "Dubai Creek Harbour",
    "Sheikh Zayed Road offices",
  ],
  communities: [
    "Downtown Dubai apartments",
    "Dubai Marina apartments",
    "Palm Jumeirah villas",
    "Business Bay apartments",
    "Dubai Hills Estate",
    "Jumeirah Village Circle JVC",
    "Dubai Creek Harbour",
    "Sheikh Zayed Road offices",
  ],
  services: [
    "off-plan advisory Dubai",
    "secondary market brokerage Dubai",
    "residential leasing Ejari Dubai",
    "property management Dubai",
    "UAE mortgage assistance",
  ],
  developers: [
    "Emaar properties",
    "DAMAC properties",
    "Sobha Realty",
    "Nakheel",
    "Binghatti",
    "Omniyat",
    "Aldar properties Abu Dhabi",
    "Arada Sharjah",
  ],
}

const flat = (...k: (keyof typeof KEYWORDS)[]) => k.flatMap((x) => [...KEYWORDS[x]])

export type PageMeta = {
  title: string
  description: string
  path: string
  keywords?: readonly string[]
  image?: string
  ogImage?: string
  type?: "website" | "article"
  noindex?: boolean
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
}

/** Single place that builds consistent metadata (title, description, canonical, OG, Twitter, hreflang). */
export function buildMeta({
  title,
  description,
  path,
  keywords = [],
  image,
  ogImage,
  type = "website",
  noindex = false,
  noIndex = false,
  publishedTime,
  modifiedTime,
}: PageMeta): Metadata {
  const resolvedImage = ogImage || image || OG_DEFAULT
  const isNoIndex = noindex || noIndex
  const url = `${SITE_URL}${path === "/" ? "" : path}`
  const imageUrl = resolvedImage.startsWith("http") ? resolvedImage : `${SITE_URL}${resolvedImage}`
  return {
    title,
    description,
    keywords: [...keywords, ...flat("core")].slice(0, 24),
    alternates: {
      canonical: url,
      languages: { "en-AE": url, "x-default": url },
    },
    robots: isNoIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    openGraph: {
      type,
      url,
      siteName: SITE.name,
      locale: "en_AE",
      title,
      description,
      images: [{ url: imageUrl, width: 1600, height: 900, alt: title }],
      ...(type === "article" ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  }
}

export const buildMetadata = buildMeta

export const KW = {
  home: [...flat("core"), ...flat("offPlan").slice(0, 4), ...flat("buy").slice(0, 3), ...flat("invest").slice(0, 3)],
  offPlan: flat("offPlan", "developers"),
  buy: flat("buy", "places"),
  rent: flat("rent", "places"),
  invest: flat("invest", "places"),
  developers: flat("developers", "offPlan"),
  communities: flat("places", "invest"),
}

/* ------------------------------------------------------------- JSON-LD */
const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`)

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE.name,
  legalName: "SWK Properties LLC",
  url: SITE_URL,
  logo: abs("/brand/SWK_Properties_Horizontal_Logo_Light.svg"),
  image: abs(OG_DEFAULT),
  description:
    "SWK Properties is a RERA-registered Dubai real estate brokerage advising on off-plan launches, secondary-market sales, leasing, investment, mortgages and property management across the UAE.",
  telephone: SITE.phone,
  email: SITE.email,
  foundingDate: String(SITE.founded),
  identifier: { "@type": "PropertyValue", name: "RERA ORN", value: "51517" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Al Saqr Business Tower, Sheikh Zayed Road",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  geo: { "@type": "GeoCoordinates", latitude: 25.213925, longitude: 55.277978 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "16:00" },
  ],
  areaServed: [
    { "@type": "City", name: "Dubai" },
    { "@type": "City", name: "Abu Dhabi" },
    { "@type": "City", name: "Sharjah" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  knowsLanguage: ["en", "ar", "hi", "ur", "ru", "fr"],
  sameAs: [SITE.instagram, SITE.linkedin],
  contactPoint: [
    { "@type": "ContactPoint", telephone: SITE.phone, contactType: "sales", areaServed: "AE", availableLanguage: ["English", "Arabic", "Hindi", "Urdu", "Russian", "French"] },
  ],
}

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE.name,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-AE",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/properties?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
}

export function breadcrumbLd(items: { name: string; path?: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path ?? it.url ?? "/"),
    })),
  }
}

export const breadcrumbSchema = breadcrumbLd

export function faqLd(faqs: { question?: string; answer?: string; q?: string; a?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question ?? f.q ?? "",
      acceptedAnswer: { "@type": "Answer", text: f.answer ?? f.a ?? "" },
    })),
  }
}

export const faqSchema = faqLd

export function articleLd(a: {
  title: string
  description: string
  path?: string
  slug?: string
  image: string
  date?: string
  datePublished?: string
  dateModified?: string
  category?: string
  authorName?: string
}) {
  const pub = a.datePublished ?? a.date ?? "2026-10-20"
  const mod = a.dateModified ?? pub
  const p = a.path ?? (a.slug?.startsWith("/") ? a.slug : `/insights/${a.slug ?? ""}`)
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: abs(a.image),
    datePublished: pub,
    dateModified: mod,
    articleSection: a.category ?? "Real Estate Briefing",
    mainEntityOfPage: abs(p),
    author: { "@type": "Person", name: a.authorName ?? SITE.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-AE",
  }
}

export const articleSchema = articleLd

export function serviceLd(s: { name: string; description: string; path?: string; slug?: string }) {
  const p = s.path ?? `/services/${s.slug ?? ""}`
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    url: abs(p),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    serviceType: s.name,
  }
}

export function placeLd(p: { name: string; description: string; path?: string; slug?: string; image: string; lat?: number; lng?: number }) {
  const urlPath = p.path ?? `/communities/${p.slug ?? ""}`
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${p.name}, Dubai`,
    description: p.description,
    url: abs(urlPath),
    image: abs(p.image),
    containedInPlace: { "@type": "City", name: "Dubai" },
  }
}

export function itemListLd(name: string, items: { name: string; path?: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: abs(it.path ?? it.url ?? "/"),
    })),
  }
}

export function webPageLd(p: { name: string; description: string; path: string; type?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": p.type ?? "WebPage",
    name: p.name,
    description: p.description,
    url: abs(p.path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-AE",
  }
}
