import blogJson from "@/data/blog.json"

export interface BlogSection {
  title: string
  text: string
}

export interface BlogSource {
  title: string
  url: string
}

export interface BlogArticle {
  slug: string
  title: string
  category: string
  date: string
  updatedAt: string
  readTime: string
  image: string
  excerpt: string
  directAnswer: string
  content: string
  sections: BlogSection[]
  sources: BlogSource[]
  author: {
    name: string
    role: string
    slug: string
    credentials: string
  }
  reviewer: {
    name: string
    role: string
    credentials: string
  }
  keyTakeaways: string[]
  faqs: { q: string; a: string }[]
}

type RawBlogItem = {
  slug: string
  title: string
  category: string
  date: string
  updated?: string
  readTime: string
  image: string
  excerpt: string
  content: string
  sections: BlogSection[]
  sources?: BlogSource[]
}

const AUTHORS = [
  {
    name: "Mohammad Haseeb",
    role: "Senior Property Consultant",
    slug: "mohammad-haseeb",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  {
    name: "Issaadi Chahrazed",
    role: "Property Consultant — Multilingual Advisory",
    slug: "issaadi-chahrazed",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  {
    name: "Talha Shabbir",
    role: "Off-Plan & New Launch Specialist",
    slug: "talha-shabbir",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  {
    name: "Fareed Choudhary",
    role: "Secondary Market & Portfolio Consultant",
    slug: "fareed-choudhary",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
  {
    name: "Rahma Tahir",
    role: "Leasing & Relocation Consultant",
    slug: "rahma-tahir",
    credentials: "SWK Advisory Desk · RERA ORN 51517",
  },
]

export const blogArticles: BlogArticle[] = (blogJson as RawBlogItem[]).map((item, idx) => {
  const normalizedImage = item.image.startsWith("assets/images/")
    ? item.image.replace(/^assets\/images\//, "/img/")
    : item.image.startsWith("/")
      ? item.image
      : `/img/${item.image}`

  const author = AUTHORS[idx % AUTHORS.length]

  return {
    slug: item.slug,
    title: item.title,
    category: item.category,
    date: item.date,
    updatedAt: item.updated || item.date,
    readTime: item.readTime,
    image: normalizedImage,
    excerpt: item.excerpt,
    directAnswer: item.content,
    content: item.content,
    sections: item.sections || [],
    sources:
      item.sources && item.sources.length > 0
        ? item.sources
        : [
            {
              title: "Dubai Land Department (DLD) Official Portal",
              url: "https://dubailand.gov.ae/en/",
            },
            {
              title: "Dubai REST Smart Real Estate Services",
              url: "https://dubailand.gov.ae/en/eservices/dubai-rest/",
            },
          ],
    author,
    reviewer: {
      name: "SWK Regulatory & Market Review Desk",
      role: "Compliance & DLD Verification Team",
      credentials: "RERA ORN 51517 · Al Saqr Business Tower, Sheikh Zayed Road",
    },
    keyTakeaways: (item.sections || []).slice(0, 4).map((s) => `${s.title}: ${s.text.split(".")[0]}.`),
    faqs: [
      {
        q: `What is the single most important takeaway from "${item.title}"?`,
        a: item.content,
      },
      {
        q: "Where can I independently verify Dubai project registration, escrow, or transaction records?",
        a: "Always verify project registration numbers, escrow bank accounts, and historical transaction data directly through the official Dubai Land Department (DLD) portal or the Dubai REST application.",
      },
      {
        q: "Does SWK Properties provide a written checklist or side-by-side worksheet for this topic?",
        a: "Yes. Request a tailored consultation from our Sheikh Zayed Road advisory desk (RERA ORN 51517) and your assigned consultant will prepare a written side-by-side comparison in AED and your preferred reference currency.",
      },
    ],
  }
})

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug)
}

export const blogCategories = ["All", ...Array.from(new Set(blogArticles.map((a) => a.category)))]
