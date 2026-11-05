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
  emirate: "Dubai" | "Abu Dhabi" | "Sharjah" | "Ras Al Khaimah" | "Umm Al Quwain" | "UAE"
  headquarters: string
  founded?: number
  flagshipAreas: string[]
  projectCount: number
  logo: string
  coverImage: string
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
  priorityTarget?: boolean
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
  dugasta: "dugasta.svg",
  lunaya: "lunaya.svg",
  marjan: "marjan.svg",
  "rak-properties": "rak-properties.svg",
  "al-hamra": "al-hamra.svg",
  taraf: "taraf.svg",
  beyond: "beyond.svg",
}

const EMIRATE: Record<string, Developer["emirate"]> = {
  arada: "Sharjah",
  aldar: "Abu Dhabi",
  marjan: "Ras Al Khaimah",
  "rak-properties": "Ras Al Khaimah",
  "al-hamra": "Ras Al Khaimah",
}

const FALLBACK_IMG: Record<string, string> = {
  ...Object.fromEntries(communities.map((c) => [c.name, c.image])),
  "Bluewaters Island": "/img/gallery/image1.webp",
  "La Mer": "/img/gallery/image5.webp",
  "Mohammed Bin Rashid City": "/img/gallery/image7.webp",
  "Dubai Production City": "/img/gallery/image10.webp",
}

const EXTRA_PROJECT_IMAGES: Record<string, [string, string]> = {
  "emaar/Emaar The Oasis": ["/img/projects/emaar/greencrest.webp", "/img/gallery/image7.webp"],
  "emaar/Dubai Hills Estate Residences": ["/img/communities/dubai-hills-estate.webp", "/img/projects/emaar/greencrest.webp"],
  "emaar/Address Residences Al Marjan Island": ["/img/projects/emaar/avarra-by-palace.webp", "/img/projects/emaar/rashid-yachts-and-marina.webp"],
  "sobha/Sobha Century": ["/img/projects/sobha/sobha-one.webp", "/img/projects/sobha/sobha-seahaven.webp"],
  "sobha/Sobha River Core": ["/img/projects/sobha/360-riverside-crescent.webp", "/img/projects/sobha/waves-opulence.webp"],
  "sobha/Sobha Siniya Island": ["/img/projects/sobha/sobha-sanctuary.webp", "/img/projects/sobha/sobha-seahaven.webp"],
  "sobha/Downtown Umm Al Quwain": ["/img/projects/sobha/sobha-skyscape.webp", "/img/projects/sobha/sobha-skyvue.webp"],
  "binghatti/Binghatti Maybach Mercedes-Benz": ["/img/projects/binghatti/mercedes-benz-places.webp", "/img/projects/binghatti/bugatti-residences-by-binghatti.webp"],
  "imtiaz/Imtiaz Kore": ["/img/projects/imtiaz/kore-by-imtiaz.webp", "/img/projects/imtiaz/sea-cliff-by-imtiaz.webp"],
  "azizi/Azizi Florence": ["/img/projects/azizi/azizi-florence.webp", "/img/projects/azizi/azizi-venice.webp"],
  "azizi/Azizi Leily": ["/img/projects/azizi/azizi-raffi.webp", "/img/projects/azizi/azizi-milan.webp"],
  "danube/Danube Greenz": ["/img/projects/danube/eleganz.webp", "/img/projects/danube/sportz.webp"],
  "samana/Samana Downtown One": ["/img/projects/samana/samana-waves.webp", "/img/projects/samana/samana-mykonos.webp"],
  "arada/Alif Sharjah": ["/img/projects/arada/aljada.webp", "/img/projects/arada/masaar.webp"],
  "aldar/Manchester City Yas Residences": ["/img/projects/aldar/yas-bay.webp", "/img/projects/aldar/yas-acres.webp"],
  "aldar/Yas Island Waterfront": ["/img/projects/aldar/yas-acres.webp", "/img/projects/aldar/yas-bay.webp"],
  "aldar/Saadiyat Island Sanctuary": ["/img/projects/aldar/saadiyat-lagoons.webp", "/img/projects/aldar/saadiyat-grove.webp"],
  "meraas/Bluewaters Bay": ["/img/gallery/image1.webp", "/img/gallery/image3.webp"],
  "meraas/Port de la Mer": ["/img/gallery/image5.webp", "/img/gallery/image8.webp"],
  "ellington/Ellington Berkeley Tower": ["/img/gallery/image4.webp", "/img/gallery/image11.webp"],
  "ellington/The Meriva Dubai Islands": ["/img/projects/nakheel/dubai-islands.webp", "/img/gallery/image2.webp"],
  "ellington/Wilton Park Residences": ["/img/gallery/image7.webp", "/img/gallery/image11.webp"],
  "ellington/Belgravia Heights": ["/img/gallery/image4.webp", "/img/gallery/image13.webp"],
  "ellington/Ellington Beach House": ["/img/communities/palm-jumeirah.webp", "/img/gallery/image2.webp"],
  "select-group/Marina Gate": ["/img/communities/dubai-marina.webp", "/img/gallery/image9.webp"],
  "select-group/Peninsula": ["/img/communities/business-bay.webp", "/img/gallery/image12.webp"],
  "select-group/Six Senses Residences": ["/img/gallery/image6.webp", "/img/gallery/image15.webp"],
  "deyaar/Midtown": ["/img/gallery/image10.webp", "/img/gallery/image14.webp"],
  "deyaar/Regalia": ["/img/communities/downtown-dubai.webp", "/img/gallery/image3.webp"],
  "mag/Keturah Reserve": ["/img/communities/dubai-hills-estate.webp", "/img/gallery/image6.webp"],
  "dugasta/Dugasta Platinum Residence": ["/img/projects/empire-developments/empire-residence.webp", "/img/gallery/image14.webp"],
  "lunaya/Lunaya The Bloom Villa": ["/img/projects/arada/jouri-hills.webp", "/img/gallery/image7.webp"],
  "marjan/Al Marjan Island Masterplan": ["/img/projects/nakheel/palm-jebel-ali.webp", "/img/projects/sobha/sobha-seahaven.webp"],
  "rak-properties/Quattro Del Mar": ["/img/projects/imtiaz/sea-cliff-by-imtiaz.webp", "/img/gallery/image1.webp"],
  "al-hamra/Al Hamra Waterfront": ["/img/projects/emaar/rashid-yachts-and-marina.webp", "/img/gallery/image5.webp"],
  "taraf/Karl Lagerfeld Villas": ["/img/projects/hh-development/eden-hills-dubai.webp", "/img/gallery/image6.webp"],
  "beyond/Sensia Dubai Maritime City": ["/img/projects/damac/chelsea-residences.webp", "/img/gallery/image8.webp"],
}

/** Extra priority launches injected into core JSON developers so all user-targeted projects appear */
const EXTRA_PROJECTS_BY_DEV: Record<string, RawProject[]> = {
  emaar: [
    {
      name: "Emaar The Oasis",
      community: "The Oasis, Dubailand",
      collection: "Waterfront & Lagoon Mansions",
      blurb: "Emaar's flagship 100-million-sq-ft waterfront villa and mansion sanctuary built around swimmable crystal canals, parks, and private lagoons.",
      tags: ["Lagoon Mansions", "Waterfront Villas", "Emaar Flagship"],
      url: null,
      video: null,
    },
    {
      name: "Dubai Hills Estate Residences",
      community: "Dubai Hills Estate",
      collection: "Golf & Park Masterplan",
      blurb: "Championship golf-front villas, park-facing townhouses, and boulevard apartments in Dubai's green heart between Downtown and Dubai Marina.",
      tags: ["18-Hole Golf Course", "Dubai Hills Park", "King's College Hospital"],
      url: null,
      video: null,
    },
    {
      name: "Address Residences Al Marjan Island",
      community: "Al Marjan Island, Ras Al Khaimah",
      collection: "Branded Beachfront",
      blurb: "Five-star Address beachfront apartments, townhouses, and sea-facing penthouses on Al Marjan Island with direct Arabian Gulf beach frontage.",
      tags: ["Al Marjan Island", "Address Branded", "Private Beach"],
      url: null,
      video: null,
    },
  ],
  sobha: [
    {
      name: "Sobha Century",
      community: "Sheikh Zayed Road / Sobha Central",
      collection: "Skyline & Urban Towers",
      blurb: "Landmark Sheikh Zayed Road residential complex by Sobha Realty featuring panoramic coastline views, elevated sky parks, and backward-integrated craftsmanship.",
      tags: ["Sheikh Zayed Road", "Sea & Skyline Views", "60/40 Plan"],
      url: null,
      video: null,
    },
    {
      name: "Sobha River Core",
      community: "Sobha Hartland II Waterfront",
      collection: "Waterfront Lagoon",
      blurb: "Lagoon-front residences positioned along the central river boardwalk of Sobha Hartland II, minutes from Downtown Dubai and Ras Al Khor Sanctuary.",
      tags: ["Lagoon Boardwalk", "Hartland II", "In-House Quality"],
      url: null,
      video: null,
    },
    {
      name: "Sobha Siniya Island",
      community: "Siniya Island, Umm Al Quwain",
      collection: "Natural Island Sanctuary",
      blurb: "Natural mangrove island masterplan in Umm Al Quwain offering private beachfront villas, yacht club residences, and an 18-hole island golf course.",
      tags: ["Natural Island", "Beachfront Villas", "Marina & Golf"],
      url: null,
      video: null,
    },
    {
      name: "Downtown Umm Al Quwain",
      community: "Umm Al Quwain Waterfront",
      collection: "Coastal Masterplan",
      blurb: "A 25-million-sq-ft coastal master community by Sobha Realty featuring 11 km of coastline, beaches, marinas, and waterfront residential districts.",
      tags: ["11 km Coastline", "Master Community", "High Capital Growth"],
      url: null,
      video: null,
    },
  ],
  imtiaz: [
    {
      name: "Imtiaz Kore",
      community: "Dubai Islands / Meydan Horizon Corridor",
      collection: "Boutique Furnished Luxury",
      blurb: "Imtiaz Developments' flagship new release featuring fully furnished designer residences, smart home automation, rooftop infinity sky pool, and a 60/40 milestone payment plan.",
      tags: ["Fully Furnished", "60/40 Payment Plan", "VIP First Release"],
      url: null,
      video: null,
    },
  ],
  azizi: [
    {
      name: "Azizi Florence",
      community: "Al Furjan / Sharjah Waterfront Corridor",
      collection: "Italian Waterfront Residences",
      blurb: "Italian-inspired waterfront residential masterplan by Azizi Developments featuring crystal lagoon promenades, retail arcades, and a flexible 50/50 payment schedule.",
      tags: ["Italian Architecture", "Crystal Lagoon", "50/50 Payment Plan"],
      url: null,
      video: null,
    },
    {
      name: "Azizi Leily",
      community: "Al Jaddaf / Dubai Healthcare City",
      collection: "Central Urban Residences",
      blurb: "Contemporary residences in Al Jaddaf near Dubai Creek and Metro connectivity, tailored for strong rental yield and central city access.",
      tags: ["Al Jaddaf", "Metro Connectivity", "High Rental Yield"],
      url: null,
      video: null,
    },
  ],
  danube: [
    {
      name: "Danube Greenz",
      community: "Dubailand / Academic Corridor",
      collection: "1% Monthly Plan Residences",
      blurb: "Resort-style residences surrounded by landscaped courtyards and 30+ lifestyle amenities, backed by Danube's signature post-handover payment structure.",
      tags: ["1% Monthly Plan", "30+ Amenities", "High Yield"],
      url: null,
      video: null,
    },
  ],
  samana: [
    {
      name: "Samana Downtown One",
      community: "Downtown / Business Bay Corridor",
      collection: "Private Pool Residences",
      blurb: "Resort-inspired city residences featuring private balcony plunge pools, valet concierge, and flexible investor payment plans near Downtown Dubai.",
      tags: ["Private Balcony Pool", "Central Corridor", "Flexible Plan"],
      url: null,
      video: null,
    },
  ],
  arada: [
    {
      name: "Alif Sharjah",
      community: "Aljada, Sharjah",
      collection: "Boulevard & Cultural District",
      blurb: "Prime boulevard apartments in Arada's Aljada masterplan in Sharjah, steps from the Zaha Hadid-designed Madar family complex and retail avenue.",
      tags: ["Aljada Masterplan", "Sharjah Growth Hub", "Walkable Boulevard"],
      url: null,
      video: null,
    },
  ],
  aldar: [
    {
      name: "Manchester City Yas Residences",
      community: "Yas Island, Abu Dhabi",
      collection: "Branded Waterfront",
      blurb: "Canal-front residences on Yas Island developed in partnership with Manchester City Football Club, combining elite sports clubs, marina walks, and resort living.",
      tags: ["Yas Canal Front", "Branded Sports Living", "Abu Dhabi"],
      url: null,
      video: null,
    },
    {
      name: "Yas Island Waterfront",
      community: "Yas Island, Abu Dhabi",
      collection: "Island & Marina Living",
      blurb: "Waterfront apartments, townhouses, and golf-facing villas on Yas Island beside Yas Marina Circuit, Yas Mall, and upcoming global theme resorts.",
      tags: ["Yas Marina", "Theme Park District", "Golden Visa Eligible"],
      url: null,
      video: null,
    },
  ],
}

type Extra = {
  slug: string
  name: string
  emirate?: Developer["emirate"]
  site: string
  tagline: string
  about: string
  knownFor: string
  projects: { name: string; community: string; collection: string; blurb: string; tags: string[] }[]
}

const EXTRAS: Extra[] = [
  {
    slug: "ellington",
    name: "Ellington Properties",
    site: "https://www.ellingtonproperties.ae",
    tagline: "Design-led boutique residences & beachfront collections.",
    about:
      "Ellington focuses on architecture and interior design-led residential buildings with gallery-grade finishes across Dubai Islands, Dubai Hills Estate, MBR City, Business Bay, and JVC.",
    knownFor: "Design-led boutique buildings",
    projects: [
      {
        name: "Ellington Berkeley Tower",
        community: "Mohammed Bin Rashid City / Dubai Hills",
        collection: "Design-Led Urban Towers",
        blurb: "Hotel-inspired architectural residences by Ellington with bespoke joinery, club lounges, and lap pools minutes from Downtown Dubai.",
        tags: ["Design-Led", "Club Lounge", "High End-User Demand"],
      },
      {
        name: "The Meriva Dubai Islands",
        community: "Dubai Islands",
        collection: "Beachfront & Island Living",
        blurb: "Ellington's signature coastal release on Dubai Islands featuring panoramic Arabian Gulf views, resort pools, and direct beach access.",
        tags: ["Dubai Islands", "Beachfront", "Boutique Luxury"],
      },
      {
        name: "Wilton Park Residences",
        community: "Mohammed Bin Rashid City",
        collection: "Master communities",
        blurb: "A low-rise residential project in Mohammed Bin Rashid City built around landscaped parkland.",
        tags: ["Park setting", "Design-led", "MBR City"],
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
    slug: "dugasta",
    name: "Dugasta Properties",
    site: "https://www.dugasta.com",
    tagline: "Value-driven residential developments with structured net-return programs.",
    about:
      "Dugasta Properties develops residential apartments across Warsan, Dubailand, and Dubai Industrial corridors, known for investor-focused rental assurance and post-handover plans.",
    knownFor: "Structured investor yield programs",
    projects: [
      {
        name: "Dugasta Platinum Residence",
        community: "Warsan / International City Phase 2",
        collection: "Investor Yield Collection",
        blurb: "Modern residential apartments by Dugasta tailored for income-focused investors seeking structured net rental returns and accessible entry prices.",
        tags: ["Net Return Option", "Accessible Entry", "Ready & Off-Plan"],
      },
    ],
  },
  {
    slug: "lunaya",
    name: "Lunaya Developments",
    site: "https://www.swkpropertiesuae.com",
    tagline: "Boutique biophilic villas and low-density sanctuary homes.",
    about:
      "Lunaya curates low-density residential enclaves and private courtyard villas designed around natural light, greenery, and family privacy.",
    knownFor: "Boutique garden villas",
    projects: [
      {
        name: "Lunaya The Bloom Villa",
        community: "Dubailand Green Corridor",
        collection: "Private Garden Villas",
        blurb: "Architectural garden villas featuring double-height living spaces, private plunge pools, and shaded courtyard landscaping for family living.",
        tags: ["Private Pool Villas", "Biophilic Design", "Family Enclave"],
      },
    ],
  },
  {
    slug: "marjan",
    name: "Marjan",
    emirate: "Ras Al Khaimah",
    site: "https://www.marjan.com",
    tagline: "Master developer of Al Marjan Island in Ras Al Khaimah.",
    about:
      "Marjan is the master developer of freehold waterfront and island destinations in Ras Al Khaimah, anchored by the four-coral-island archipelago of Al Marjan Island.",
    knownFor: "Al Marjan Island masterplan",
    projects: [
      {
        name: "Al Marjan Island Masterplan",
        community: "Al Marjan Island, Ras Al Khaimah",
        collection: "Freehold Coral Islands",
        blurb: "Ras Al Khaimah's premier freehold island destination spanning 7.8 km of sandy beaches, five-star integrated resorts, and branded seafront residences.",
        tags: ["7.8 km Beaches", "Integrated Resort Hub", "Freehold Island"],
      },
    ],
  },
  {
    slug: "rak-properties",
    name: "RAK Properties",
    emirate: "Ras Al Khaimah",
    site: "https://www.rakproperties.ae",
    tagline: "Waterfront living at Mina Al Arab & Hayat Island.",
    about:
      "Listed on the Abu Dhabi Securities Exchange, RAK Properties is behind the coastal master community of Mina Al Arab and Hayat Island in Ras Al Khaimah.",
    knownFor: "Mina Al Arab & Hayat Island",
    projects: [
      {
        name: "Quattro Del Mar",
        community: "Hayat Island, Mina Al Arab (RAK)",
        collection: "Lagoon & Oceanfront",
        blurb: "Four interlinked residential towers on Hayat Island offering sky bridges, podium lagoon pools, and direct access to Nikki Beach Resort & Spa.",
        tags: ["Hayat Island", "Ocean & Lagoon Views", "Resort Podium"],
      },
    ],
  },
  {
    slug: "al-hamra",
    name: "Al Hamra",
    emirate: "Ras Al Khaimah",
    site: "https://www.alhamra.ae",
    tagline: "Integrated marina, championship golf, and beachfront living in RAK.",
    about:
      "Al Hamra is Ras Al Khaimah's premier lifestyle developer, managing Al Hamra Village, the 18-hole championship golf course, and the 220-berth Al Hamra Marina & Yacht Club.",
    knownFor: "Golf & marina master community",
    projects: [
      {
        name: "Al Hamra Waterfront",
        community: "Al Hamra Village, Ras Al Khaimah",
        collection: "Marina & Seafront",
        blurb: "Promenade towers and waterfront townhouses overlooking the Royal Yacht Club of Ras Al Khaimah, championship fairways, and the Arabian Gulf.",
        tags: ["Yacht Marina", "Championship Golf", "View of Wynn Island"],
      },
    ],
  },
  {
    slug: "meraas",
    name: "Meraas",
    site: "https://www.meraas.com",
    tagline: "Waterfront and lifestyle districts across Dubai.",
    about:
      "Meraas, part of Dubai Holding, is known for destination districts that combine homes with retail, dining and leisure across Bluewaters, City Walk, and La Mer.",
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
    slug: "select-group",
    name: "Select Group",
    site: "https://www.select-group.ae",
    tagline: "Waterfront towers in Marina, Palm Jumeirah, and Business Bay.",
    about:
      "Select Group is a Dubai developer known for prime waterfront towers in Dubai Marina, Business Bay, and Palm Jumeirah, including Six Senses Residences.",
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
        blurb: "A Business Bay canal peninsula masterplan aimed at city-centre professionals and investors.",
        tags: ["Canal-side", "City centre", "Mixed use"],
      },
      {
        name: "Six Senses Residences",
        community: "Palm Jumeirah",
        collection: "Branded residences",
        blurb: "A wellness-focused branded residence on Palm Jumeirah with private beach and sea views.",
        tags: ["Branded residence", "Wellness", "Palm Jumeirah"],
      },
    ],
  },
  {
    slug: "deyaar",
    name: "Deyaar",
    site: "https://www.deyaar.ae",
    tagline: "Established listed developer across Business Bay & Al Furjan.",
    about:
      "Deyaar is one of Dubai's longest-established publicly listed developers with completed communities across Business Bay, Dubai Production City, and Al Furjan.",
    knownFor: "Established delivery record",
    projects: [
      {
        name: "Midtown",
        community: "Dubai Production City",
        collection: "Master communities",
        blurb: "A mid-rise community in Dubai Production City with shared parks and retail for families and investors.",
        tags: ["Community living", "Mid-rise", "Value-focused"],
      },
      {
        name: "Regalia",
        community: "Business Bay",
        collection: "Urban towers",
        blurb: "A 70-storey smart-home residential tower in Business Bay near Downtown Dubai.",
        tags: ["Business Bay", "City living", "Tower"],
      },
    ],
  },
  {
    slug: "mag",
    name: "MAG Property Development",
    site: "https://www.mag.ae",
    tagline: "Bio-living sanctuaries and master-planned communities.",
    about:
      "MAG is the developer behind Keturah Reserve and MAG Eye in Mohammed Bin Rashid City, combining wellness architecture with central Dubai connectivity.",
    knownFor: "Bio-living & MBR City communities",
    projects: [
      {
        name: "Keturah Reserve",
        community: "Mohammed Bin Rashid City",
        collection: "Master communities",
        blurb: "A bio-living residential sanctuary in Mohammed Bin Rashid City set around ancient olive trees and wellness spaces.",
        tags: ["Bio-living", "MBR City", "Low-rise"],
      },
    ],
  },
  {
    slug: "taraf",
    name: "Taraf",
    site: "https://www.tarafholding.com",
    tagline: "Design-curated residences by Yas Holding.",
    about:
      "Taraf, the real estate division of UAE investment group Yas Holding, crafts boutique branded villas and design-led residences across MBR City and Palm Jumeirah.",
    knownFor: "Bespoke branded villas",
    projects: [
      {
        name: "Karl Lagerfeld Villas",
        community: "Mohammed Bin Rashid City",
        collection: "Branded Lagoon Villas",
        blurb: "Ultra-prime crystal lagoon villas in MBR City designed in collaboration with Maison Karl Lagerfeld.",
        tags: ["Branded Villas", "Crystal Lagoon", "MBR City"],
      },
    ],
  },
  {
    slug: "beyond",
    name: "Beyond by Omniyat",
    site: "https://www.beyonddevelopments.ae",
    tagline: "Next-generation seafront towers in Dubai Maritime City.",
    about:
      "Beyond, part of the Omniyat Group, specialises in architectural seafront living along the private peninsulas and coves of Dubai Maritime City.",
    knownFor: "Seafront architectural towers",
    projects: [
      {
        name: "Sensia Dubai Maritime City",
        community: "Dubai Maritime City",
        collection: "Seafront Cove",
        blurb: "Sculptural seafront residences with 360-degree views of the Arabian Gulf and the Downtown Dubai skyline.",
        tags: ["Seafront Peninsula", "Omniyat Group", "Panoramas"],
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

const PRIORITY_NAMES = new Set([
  "Imtiaz Kore",
  "Azizi Florence",
  "Azizi Venice",
  "Sobha Century",
  "DAMAC Islands",
  "Emaar The Oasis",
  "Mercedes-Benz Places",
  "Ellington Berkeley Tower",
  "Samana Downtown One",
  "Danube Greenz",
  "Azizi Leily",
  "Lunaya The Bloom Villa",
  "Dugasta Platinum Residence",
  "Dubai Hills Estate Residences",
  "The Meriva Dubai Islands",
  "Masaar",
  "Azizi Florence",
  "Alif Sharjah",
  "Manchester City Yas Residences",
  "Sobha River Core",
  "Yas Island Waterfront",
  "Saadiyat Lagoons",
  "Sobha Siniya Island",
  "Downtown Umm Al Quwain",
  "Al Marjan Island Masterplan",
  "Address Residences Al Marjan Island",
  "Quattro Del Mar",
  "Al Hamra Waterfront",
])

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
  const extraProjs = EXTRA_PROJECTS_BY_DEV[d.slug] ?? []
  const combinedRaw = [...extraProjs, ...d.projects]
  const mappedProjects: Project[] = combinedRaw.map((p, pIdx) => {
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
      priorityTarget: PRIORITY_NAMES.has(p.name),
    }
  })
  return {
    ...d,
    description: d.about,
    emirate,
    headquarters: `${emirate}, UAE`,
    flagshipAreas: Array.from(new Set(combinedRaw.map((p) => p.community))).slice(0, 5),
    projectCount: mappedProjects.length,
    logo: `/img/developers/${LOGOS[d.slug]}`,
    coverImage: mappedProjects[0]?.image || "/img/hero/dubai-skyline-hero.webp",
    verify: true,
    projects: mappedProjects,
  }
})

const fromExtras: Developer[] = EXTRAS.map((e, eIdx) => {
  const emirate = e.emirate ?? EMIRATE[e.slug] ?? "Dubai"
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
      priorityTarget: PRIORITY_NAMES.has(p.name),
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
    emirate,
    headquarters: `${emirate}, UAE`,
    flagshipAreas: Array.from(new Set(e.projects.map((p) => p.community))).slice(0, 5),
    projectCount: mappedProjects.length,
    logo: `/img/developers/${LOGOS[e.slug]}`,
    coverImage: mappedProjects[0]?.image || "/img/hero/dubai-skyline-hero.webp",
    verify: true,
    projects: mappedProjects,
  }
})

export const developers: Developer[] = [...fromJson, ...fromExtras]

const rawAllProjects = developers.flatMap((d) => d.projects)
export const priorityProjects: Project[] = rawAllProjects.filter((p) => p.priorityTarget)
export const projects: Project[] = [
  ...priorityProjects,
  ...rawAllProjects.filter((p) => !p.priorityTarget),
]

export const getDeveloper = (slug: string) => developers.find((d) => d.slug === slug)
export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
export const collections = [...new Set(projects.map((p) => p.collection))]
export const projectCommunities = [...new Set(projects.map((p) => p.community))].sort()
