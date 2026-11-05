import developersJson from "@/data/developers.json"
import projectImages from "@/data/project-images.json"
import { communities, gallery } from "@/lib/swk"

export type RawProject = {
  name: string
  community: string
  collection: string
  blurb: string
  tags: string[]
  url: string | null
  video: string | null
}

export type Developer = {
  slug: string
  name: string
  hue: string
  site: string
  tagline: string
  about: string
  description: string
  knownFor: string
  emirate: "Dubai" | "Abu Dhabi" | "Sharjah" | "UAE"
  headquarters: string
  founded?: number
  flagshipAreas: string[]
  projectCount: number
  logo: string
  coverImage: string
  /** True when SWK's copy for this developer still needs checking against the developer's own site. */
  verify: boolean
  projects: Project[]
}

export type Project = {
  slug: string
  name: string
  devSlug: string
  developerSlug: string
  devName: string
  developer: string
  community: string
  collection: string
  blurb: string
  summary: string
  tags: string[]
  url: string | null
  image: string
  thumb: string
  images: string[]
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const LOGOS: Record<string, string> = {
  emaar: "emaar.svg",
  damac: "damac.png",
  sobha: "sobha.png",
  azizi: "azizi.png",
  imtiaz: "imtiaz.svg",
  danube: "danube.png",
  binghatti: "binghatti.png",
  omniyat: "omniyat.svg",
  samana: "samana.png",
  "dubai-properties": "dubai-properties.png",
  "empire-developments": "empire-developments.png",
  arada: "arada.png",
  nakheel: "nakheel.svg",
  aldar: "aldar.png",
  "hh-development": "hh-development.svg",
  meraas: "meraas.svg",
  ellington: "ellington.svg",
  "select-group": "select-group.svg",
  deyaar: "deyaar.svg",
  mag: "mag.svg",
}

const EMIRATE: Record<string, Developer["emirate"]> = {
  arada: "Sharjah",
  aldar: "Abu Dhabi",
}

const FALLBACK_IMG: Record<string, string> = {
  ...Object.fromEntries(communities.map((c) => [c.name, c.image])),
  "Bluewaters Island": "/img/gallery/image1.webp",
  "La Mer": "/img/gallery/image5.webp",
  "Mohammed Bin Rashid City": "/img/gallery/image7.webp",
  "Dubai Production City": "/img/gallery/image10.webp",
}

const EXTRA_PROJECT_IMAGES: Record<string, [string, string]> = {
  "meraas/Bluewaters Bay": ["/img/gallery/image1.webp", "/img/gallery/image3.webp"],
  "meraas/Port de la Mer": ["/img/gallery/image5.webp", "/img/gallery/image8.webp"],
  "ellington/Wilton Park Residences": ["/img/gallery/image7.webp", "/img/gallery/image11.webp"],
  "ellington/Belgravia Heights": ["/img/gallery/image4.webp", "/img/gallery/image13.webp"],
  "ellington/Ellington Beach House": ["/img/communities/palm-jumeirah.webp", "/img/gallery/image2.webp"],
  "select-group/Marina Gate": ["/img/communities/dubai-marina.webp", "/img/gallery/image9.webp"],
  "select-group/Peninsula": ["/img/communities/business-bay.webp", "/img/gallery/image12.webp"],
  "select-group/Six Senses Residences": ["/img/gallery/image6.webp", "/img/gallery/image15.webp"],
  "deyaar/Midtown": ["/img/gallery/image10.webp", "/img/gallery/image14.webp"],
  "deyaar/Regalia": ["/img/communities/downtown-dubai.webp", "/img/gallery/image3.webp"],
  "mag/Keturah Reserve": ["/img/communities/dubai-hills-estate.webp", "/img/gallery/image6.webp"],
}

type Extra = {
  slug: string
  name: string
  site: string
  tagline: string
  about: string
  knownFor: string
  projects: { name: string; community: string; collection: string; blurb: string; tags: string[] }[]
}

/** Additional established UAE developers. Entries are intentionally brief and flagged for verification. */
const EXTRAS: Extra[] = [
  {
    slug: "meraas",
    name: "Meraas",
    site: "https://www.meraas.com",
    tagline: "Waterfront and lifestyle districts across Dubai.",
    about:
      "Meraas, part of Dubai Holding, is known for destination districts that combine homes with retail, dining and leisure. SWK follows its residential releases for clients who want a branded, walkable address.",
    knownFor: "Lifestyle destinations",
    projects: [
      {
        name: "Bluewaters Bay",
        community: "Bluewaters Island",
        collection: "Waterfront",
        blurb: "Residences on Bluewaters Island, steps from the island's promenade, dining and beach.",
        tags: ["Island living", "Waterfront", "Walkable"],
      },
      {
        name: "Port de la Mer",
        community: "La Mer",
        collection: "Waterfront",
        blurb: "A marina-side district in the La Mer area with apartments and townhouses beside the water.",
        tags: ["Marina views", "Beach access", "Mixed use"],
      },
    ],
  },
  {
    slug: "ellington",
    name: "Ellington Properties",
    site: "https://www.ellingtonproperties.ae",
    tagline: "Design-led boutique residences.",
    about:
      "Ellington focuses on design-led, mid-rise residential buildings with a strong interior identity. It has delivered across Business Bay, Dubai Hills Estate, Jumeirah Village Circle and Mohammed Bin Rashid City.",
    knownFor: "Design-led boutique buildings",
    projects: [
      {
        name: "Wilton Park Residences",
        community: "Mohammed Bin Rashid City",
        collection: "Master communities",
        blurb: "A low-rise residential project in Mohammed Bin Rashid City built around landscaped parkland.",
        tags: ["Park setting", "Design-led", "MBR City"],
      },
      {
        name: "Belgravia Heights",
        community: "Jumeirah Village Circle",
        collection: "Urban towers",
        blurb: "A boutique JVC residential building aimed at buyers who value interior design and a community address.",
        tags: ["JVC", "Boutique", "Interior design"],
      },
      {
        name: "Ellington Beach House",
        community: "Palm Jumeirah",
        collection: "Branded residences",
        blurb: "A beachfront residential project on Palm Jumeirah with sea-facing homes.",
        tags: ["Beachfront", "Palm Jumeirah", "Sea views"],
      },
    ],
  },
  {
    slug: "select-group",
    name: "Select Group",
    site: "https://www.select-group.ae",
    tagline: "Waterfront towers in Marina and Business Bay.",
    about:
      "Select Group is a Dubai developer known for waterfront towers in Dubai Marina and Business Bay, including branded-residence collaborations.",
    knownFor: "Waterfront towers",
    projects: [
      {
        name: "Marina Gate",
        community: "Dubai Marina",
        collection: "Waterfront",
        blurb: "Marina-front towers in Dubai Marina with a landscaped podium and direct promenade access.",
        tags: ["Marina views", "Promenade", "High-rise"],
      },
      {
        name: "Peninsula",
        community: "Business Bay",
        collection: "Urban towers",
        blurb: "A Business Bay development close to the canal, aimed at city-centre professionals and investors.",
        tags: ["Canal-side", "City centre", "Mixed use"],
      },
      {
        name: "Six Senses Residences",
        community: "Palm Jumeirah",
        collection: "Branded residences",
        blurb: "A wellness-focused branded residence on Palm Jumeirah with sea views.",
        tags: ["Branded residence", "Wellness", "Palm Jumeirah"],
      },
    ],
  },
  {
    slug: "deyaar",
    name: "Deyaar",
    site: "https://www.deyaar.ae",
    tagline: "A long-established Dubai developer.",
    about:
      "Deyaar is one of Dubai's longer-established listed developers with completed communities across Dubai Production City, Business Bay and beyond.",
    knownFor: "Established delivery record",
    projects: [
      {
        name: "Midtown",
        community: "Dubai Production City",
        collection: "Master communities",
        blurb: "A mid-rise community in Dubai Production City with shared amenities for first-time buyers and investors.",
        tags: ["Community living", "Mid-rise", "Value-focused"],
      },
      {
        name: "Regalia",
        community: "Business Bay",
        collection: "Urban towers",
        blurb: "A Business Bay tower near Downtown with apartments aimed at city living.",
        tags: ["Business Bay", "City living", "Tower"],
      },
    ],
  },
  {
    slug: "mag",
    name: "MAG Property Development",
    site: "https://www.mag.ae",
    tagline: "Master-planned family communities.",
    about:
      "MAG is a Dubai developer behind large communities such as MAG City in Mohammed Bin Rashid City, with a strong focus on lagoons, parks and low-rise family living.",
    knownFor: "Master-planned communities",
    projects: [
      {
        name: "Keturah Reserve",
        community: "Mohammed Bin Rashid City",
        collection: "Master communities",
        blurb: "A low-rise residential reserve in Mohammed Bin Rashid City set around green space.",
        tags: ["Green setting", "MBR City", "Low-rise"],
      },
    ],
  },
]

const img = (dev: string, file: string) => `/img/projects/${dev}/${file}.webp`

function projectImage(devSlug: string, name: string, community: string, indexOffset = 0) {
  const key = `${devSlug}/${name}` as keyof typeof projectImages
  const file = projectImages[key]
  const companion = gallery[(indexOffset * 3 + 1) % gallery.length] ?? "/img/gallery/image2.webp"
  if (file) {
    return {
      image: img(devSlug, file),
      thumb: img(devSlug, `${file}-640`),
      secondImage: companion,
    }
  }
  const extraPair = EXTRA_PROJECT_IMAGES[`${devSlug}/${name}`]
  if (extraPair) {
    return {
      image: extraPair[0],
      thumb: extraPair[0],
      secondImage: extraPair[1],
    }
  }
  const fb = FALLBACK_IMG[community] ?? "/img/hero/dubai-skyline-hero.webp"
  return { image: fb, thumb: fb, secondImage: companion }
}

const seen = new Set<string>()
function uniqueSlug(name: string, dev: string) {
  let s = slugify(name)
  if (seen.has(s)) s = `${s}-${dev}`
  seen.add(s)
  return s
}

const fromJson: Developer[] = (
  developersJson as unknown as (Omit<
    Developer,
    | "projects"
    | "logo"
    | "coverImage"
    | "emirate"
    | "verify"
    | "description"
    | "headquarters"
    | "flagshipAreas"
    | "projectCount"
  > & { projects: RawProject[] })[]
).map((d, dIdx) => {
  const emirate = EMIRATE[d.slug] ?? "Dubai"
  const mappedProjects: Project[] = d.projects.map((p, pIdx) => {
    const imgs = projectImage(d.slug, p.name, p.community, dIdx * 7 + pIdx)
    return {
      slug: uniqueSlug(p.name, d.slug),
      name: p.name,
      devSlug: d.slug,
      developerSlug: d.slug,
      devName: d.name,
      developer: d.name,
      community: p.community,
      collection: p.collection,
      blurb: p.blurb,
      summary: p.blurb,
      tags: p.tags,
      url: p.url,
      image: imgs.image,
      thumb: imgs.thumb,
      images: [imgs.image, imgs.secondImage],
    }
  })
  return {
    ...d,
    description: d.about,
    emirate,
    headquarters: `${emirate}, UAE`,
    flagshipAreas: Array.from(new Set(d.projects.map((p) => p.community))).slice(0, 5),
    projectCount: mappedProjects.length,
    logo: `/img/developers/${LOGOS[d.slug]}`,
    coverImage: mappedProjects[0]?.image || "/img/hero/dubai-skyline-hero.webp",
    verify: true,
    projects: mappedProjects,
  }
})

const fromExtras: Developer[] = EXTRAS.map((e, eIdx) => {
  const mappedProjects: Project[] = e.projects.map((p, pIdx) => {
    const imgs = projectImage(e.slug, p.name, p.community, (eIdx + 15) * 5 + pIdx)
    return {
      slug: uniqueSlug(p.name, e.slug),
      name: p.name,
      devSlug: e.slug,
      developerSlug: e.slug,
      devName: e.name,
      developer: e.name,
      community: p.community,
      collection: p.collection,
      blurb: p.blurb,
      summary: p.blurb,
      tags: p.tags,
      url: null,
      image: imgs.image,
      thumb: imgs.thumb,
      images: [imgs.image, imgs.secondImage],
    }
  })
  return {
    slug: e.slug,
    name: e.name,
    hue: "40 50% 55%",
    site: e.site,
    tagline: e.tagline,
    about: e.about,
    description: e.about,
    knownFor: e.knownFor,
    emirate: "Dubai",
    headquarters: "Dubai, UAE",
    flagshipAreas: Array.from(new Set(e.projects.map((p) => p.community))).slice(0, 5),
    projectCount: mappedProjects.length,
    logo: `/img/developers/${LOGOS[e.slug]}`,
    coverImage: mappedProjects[0]?.image || "/img/hero/dubai-skyline-hero.webp",
    verify: true,
    projects: mappedProjects,
  }
})

export const developers: Developer[] = [...fromJson, ...fromExtras]
export const projects: Project[] = developers.flatMap((d) => d.projects)
export const getDeveloper = (slug: string) => developers.find((d) => d.slug === slug)
export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
export const collections = [...new Set(projects.map((p) => p.collection))]
export const projectCommunities = [...new Set(projects.map((p) => p.community))].sort()
