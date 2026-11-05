import type { MetadataRoute } from "next"
import { SITE, communities, team } from "@/lib/swk"
import { developers, projects } from "@/lib/developers"
import { services } from "@/lib/services"
import { listings } from "@/lib/listings"
import { GUIDES } from "@/lib/guides"
import { blogArticles } from "@/lib/blog"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url
  const now = new Date()

  const staticPaths = [
    "",
    "/buy",
    "/rent",
    "/off-plan",
    "/properties",
    "/developers",
    "/communities",
    "/services",
    "/insights",
    "/calculators",
    "/about",
    "/contact",
    "/list-your-property",
    "/faq",
    "/privacy",
    "/terms",
    "/cookies",
  ]

  return [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1.0 : 0.85,
    })),
    ...listings.map((l) => ({
      url: `${base}/properties/${l.slug}`,
      lastModified: new Date(l.lastChecked),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...projects.map((p) => ({
      url: `${base}/off-plan/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...developers.map((d) => ({
      url: `${base}/developers/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...communities.map((c) => ({
      url: `${base}/communities/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...team.map((m) => ({
      url: `${base}/agents/${m.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...GUIDES.map((g) => ({
      url: `${base}/guides/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...blogArticles.map((b) => ({
      url: `${base}/insights/${b.slug}`,
      lastModified: new Date(b.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
