import { communities } from "@/lib/swk"

export type CommunityGuide = {
  slug: string
  name: string
  image: string
  thumb: string
  blurb: string
  tagline: string
  lat: number
  lng: number
  coordinates: { lat: number; lng: number }
  metaDescription: string
  overview: string
  propertyTypes: string[]
  transport: string[]
  connectivity: string[]
  schoolsHealth: string[]
  nearbySchoolsHealthcare: string[]
  amenities: string[]
  lifestyle: string
  pros: string[]
  drawbacks: string[]
  considerations: string[]
  bestFor: string[]
  related: string[]
}

type Base = Omit<CommunityGuide, "image" | "thumb" | "blurb" | "tagline" | "slug" | "name" | "coordinates" | "considerations" | "connectivity" | "nearbySchoolsHealthcare">

const G: Record<string, Base> = {
  "downtown-dubai": {
    lat: 25.1972,
    lng: 55.2744,
    metaDescription:
      "Downtown Dubai property guide: apartments by Burj Khalifa and Dubai Mall, transport, schools, lifestyle, pros and drawbacks, plus current listings and off-plan launches.",
    overview:
      "Downtown Dubai is the city's showpiece district, built around Burj Khalifa, Dubai Mall and the Dubai Fountain. It is dense, walkable by Dubai standards and permanently busy, with a strong short-stay and long-term rental market.",
    propertyTypes: ["Studios and one-bedroom apartments", "Two to four bedroom apartments", "Penthouses and branded residences"],
    transport: [
      "Burj Khalifa/Dubai Mall Metro Station on the Red Line",
      "Direct access to Sheikh Zayed Road and Al Khail Road",
      "Roughly 15 to 25 minutes to DXB airport by car outside peak hours (estimate)",
    ],
    schoolsHealth: [
      "Nurseries and primary schools within the district and in nearby Business Bay and Al Wasl",
      "Clinics in the district and major hospitals within a short drive (confirm exact distances per building)",
    ],
    amenities: ["Dubai Mall and Souk Al Bahar", "Boulevard dining", "Parks and fountain promenade", "Gyms and pools in most buildings"],
    lifestyle: "Urban and cosmopolitan. Evenings revolve around the Boulevard and the Fountain; weekends fill with visitors.",
    pros: ["Iconic address with deep tenant demand", "Metro and mall access on foot", "Wide choice of towers and finishes"],
    drawbacks: ["Higher entry prices than most of Dubai", "Event-day traffic and crowds", "Service charges are on the higher side"],
    bestFor: ["Investors seeking a prime address", "Professionals who want to be central", "Buyers who value brand and location"],
    related: ["business-bay", "sheikh-zayed-road", "dubai-creek-harbour"],
  },
  "dubai-marina": {
    lat: 25.0805,
    lng: 55.1403,
    metaDescription:
      "Dubai Marina guide: waterfront apartments, JBR and Marina Walk, metro and tram, schools, yields, pros and drawbacks, with live listings and new launches.",
    overview:
      "Dubai Marina is a high-rise waterfront district around a man-made canal, with a long promenade, restaurants and direct access to the beach at JBR. It is a mature rental market popular with young professionals and families who want an active neighbourhood.",
    propertyTypes: ["Studios to three-bedroom apartments", "Penthouses", "Waterfront and marina-view units"],
    transport: [
      "Dubai Marina and Jumeirah Lakes Towers metro stations on the Red Line",
      "Dubai Tram along the Marina and JBR",
      "Sheikh Zayed Road within a few minutes (estimate, traffic dependent)",
    ],
    schoolsHealth: ["Nurseries and schools across Marina, JLT and Dubai Media City", "Medical centres in the district; larger hospitals a short drive away"],
    amenities: ["Marina Walk and Marina Mall", "JBR beach and The Walk", "Yacht clubs", "Parks and running routes"],
    lifestyle: "Waterfront and social. Cafés and restaurants line the promenade; the beach is a short walk or tram ride.",
    pros: ["Established rental demand", "Beach and promenade lifestyle", "Good metro and tram links"],
    drawbacks: ["Evening and weekend traffic around the Marina", "Some older towers need upgrades", "Construction noise near new developments"],
    bestFor: ["Renters and investors targeting professionals", "Buyers who like waterfront living"],
    related: ["palm-jumeirah", "jvc", "sheikh-zayed-road"],
  },
  "palm-jumeirah": {
    lat: 25.1124,
    lng: 55.139,
    metaDescription:
      "Palm Jumeirah property guide: beachfront villas, apartments and branded residences, access, schools, lifestyle, pros and drawbacks, and current opportunities.",
    overview:
      "Palm Jumeirah is the world-famous man-made island, with beachfront villas on the fronds, apartment buildings on the trunk and a growing set of branded residences. It is Dubai's most recognisable luxury address.",
    propertyTypes: ["Frond villas", "Apartments on the trunk and crescent", "Branded residences and penthouses"],
    transport: [
      "Palm Monorail connecting the trunk to the Gateway and Atlantis stations",
      "Single main access road to the mainland, which can queue at peak times (estimate)",
      "Close to Al Sufouh and Sheikh Zayed Road",
    ],
    schoolsHealth: ["Schools and nurseries on the island and in nearby Al Sufouh and Dubai Marina", "Medical centres on the island"],
    amenities: ["Private beaches and clubs", "Nakheel Mall and Atlantis", "Hotels and beach dining", "Boardwalk along the trunk"],
    lifestyle: "Resort-like. Many residents live on the beach and rarely need to leave.",
    pros: ["Beachfront and sea-view homes", "Strong global brand", "Limited supply on the island itself"],
    drawbacks: ["Premium pricing", "Single main access road at peak times", "Higher maintenance costs for villas"],
    bestFor: ["Luxury buyers", "Long-horizon investors", "Families who want beach access"],
    related: ["dubai-marina", "downtown-dubai", "business-bay"],
  },
  "business-bay": {
    lat: 25.185,
    lng: 55.265,
    metaDescription:
      "Business Bay guide: canal-side apartments minutes from Downtown, metro, offices, restaurants, pros and drawbacks, plus current listings and new launches.",
    overview:
      "Business Bay is a central mixed-use district beside the Dubai Canal and a few minutes from Downtown. It mixes offices, apartments and hotels, and appeals to professionals who want to live close to work.",
    propertyTypes: ["Studios and one-bedroom apartments", "Two and three bedroom apartments", "Serviced residences"],
    transport: ["Business Bay Metro Station on the Red Line", "Close to Sheikh Zayed Road and Al Khail Road", "Short drive to Downtown (estimate)"],
    schoolsHealth: ["Nurseries nearby; primary and secondary schools in neighbouring Al Wasl, Al Quoz and Downtown", "Clinics within the district"],
    amenities: ["Canal promenade", "Cafés and restaurants", "Office towers", "Gyms and pools in most buildings"],
    lifestyle: "Urban, active and professional. The canal walk is the social centre.",
    pros: ["Central location for the price", "Canal and skyline views", "Good rental demand from professionals"],
    drawbacks: ["Ongoing construction in places", "Traffic at peak hours", "Fewer family amenities than master communities"],
    bestFor: ["Young professionals", "Investors seeking central rental demand"],
    related: ["downtown-dubai", "sheikh-zayed-road", "dubai-creek-harbour"],
  },
  "dubai-hills-estate": {
    lat: 25.103,
    lng: 55.242,
    metaDescription:
      "Dubai Hills Estate guide: villas, townhouses and apartments around a championship golf course, Dubai Hills Mall, schools, pros and drawbacks, and launches.",
    overview:
      "Dubai Hills Estate is a master-planned community around an 18-hole golf course, with parks, a mall, schools and a mix of apartments, townhouses and villas. It suits families who want green space close to the city.",
    propertyTypes: ["Apartments", "Townhouses", "Villas and mansions"],
    transport: ["Road access via Al Khail Road and Umm Suqeim Road", "Metro is not on-site; most residents drive (estimate: 20 to 25 minutes to Downtown outside peak)"],
    schoolsHealth: ["Schools and nurseries within the community", "A hospital and clinics on site or close by (confirm for the specific phase)"],
    amenities: ["Dubai Hills Mall", "Golf course and clubhouse", "Parks and cycling tracks", "Family-friendly cafés"],
    lifestyle: "Suburban and green. Residents walk, cycle and use the parks daily.",
    pros: ["Green and family-friendly", "Schools and retail inside the community", "Strong end-user demand"],
    drawbacks: ["Car-dependent", "Premium over older villa communities", "Peak-hour traffic on main roads"],
    bestFor: ["Families", "Owner-occupiers", "Buyers who want a master-planned address"],
    related: ["jvc", "dubai-creek-harbour", "downtown-dubai"],
  },
  jvc: {
    lat: 25.06,
    lng: 55.209,
    metaDescription:
      "Jumeirah Village Circle (JVC) guide: affordable apartments and townhouses, rental yields, parks, schools, pros and drawbacks, and new off-plan launches.",
    overview:
      "Jumeirah Village Circle is a large, circular community in the middle of New Dubai with a broad mix of apartments and townhouses at more accessible prices. It is popular with first-time buyers and rental investors.",
    propertyTypes: ["Studios and one to three bedroom apartments", "Townhouses and villas", "Serviced apartments"],
    transport: ["Road access to Al Khail Road and Sheikh Mohammed Bin Zayed Road", "No metro on site (estimate: 20 to 30 minutes to Marina or Downtown, traffic dependent)"],
    schoolsHealth: ["Nurseries and schools in and around the community", "Clinics in the district; hospitals a short drive away"],
    amenities: ["Community parks", "Supermarkets and cafés", "Sports facilities"],
    lifestyle: "Quiet, residential and growing. Many residents are young families and first-time owners.",
    pros: ["Lower entry prices", "Steady rental demand", "Large amount of new supply to choose from"],
    drawbacks: ["Construction in many pockets", "Car-dependent", "Quality varies between buildings"],
    bestFor: ["First-time buyers", "Rental investors on a budget"],
    related: ["dubai-hills-estate", "dubai-marina", "business-bay"],
  },
  "dubai-creek-harbour": {
    lat: 25.2,
    lng: 55.345,
    metaDescription:
      "Dubai Creek Harbour guide: waterfront masterplan facing the Ras Al Khor wildlife sanctuary, towers, parks, access, pros and drawbacks, plus new launches.",
    overview:
      "Dubai Creek Harbour is a waterfront masterplan beside Ras Al Khor Wildlife Sanctuary, planned around parks, a marina and a landmark observation tower. It is still maturing, with new phases launching regularly.",
    propertyTypes: ["Apartments", "Townhouses", "Waterfront residences"],
    transport: ["Road links to Ras Al Khor Road and Al Khail Road", "Planned metro connection (check current status)", "Close to Downtown (estimate: 10 to 15 minutes outside peak)"],
    schoolsHealth: ["Schools and nurseries planned within the masterplan and available nearby", "Check phase-by-phase availability"],
    amenities: ["Creek-side promenade", "Parks and cycling routes", "Marina and retail", "Wildlife sanctuary views"],
    lifestyle: "Calm, green and waterfront, with an unfinished edge as phases complete.",
    pros: ["Waterfront with skyline views", "Close to Downtown", "Strong developer masterplan"],
    drawbacks: ["Still under development in places", "Amenities are phased", "Limited public transport today"],
    bestFor: ["Buyers who want waterfront and space", "Long-term investors comfortable with a growing area"],
    related: ["downtown-dubai", "business-bay", "dubai-hills-estate"],
  },
  "sheikh-zayed-road": {
    lat: 25.22,
    lng: 55.28,
    metaDescription:
      "Sheikh Zayed Road property guide: landmark towers, offices and metro-connected living along Dubai's business spine, with pros, drawbacks and current listings.",
    overview:
      "Sheikh Zayed Road is Dubai's business spine, lined with landmark towers, offices and hotels, with metro stops along its length. SWK's own office is here, at Al Saqr Business Tower.",
    propertyTypes: ["Apartments in towers", "Serviced residences", "Commercial offices"],
    transport: ["Multiple Red Line metro stations along the road", "Direct highway links to Downtown, Marina and Abu Dhabi"],
    schoolsHealth: ["Schools in surrounding Al Wasl, Al Quoz and Satwa", "Hospitals and clinics within a short drive"],
    amenities: ["Restaurants and hotels", "Malls close by", "Business services"],
    lifestyle: "Fast and commercial. Better for working life than for quiet, family evenings.",
    pros: ["Central, metro-connected and visible", "Commercial and residential in one corridor"],
    drawbacks: ["Traffic noise and congestion", "Fewer green spaces"],
    bestFor: ["Business owners", "Investors in offices and small units"],
    related: ["business-bay", "downtown-dubai", "dubai-marina"],
  },
}

export const communityGuides: CommunityGuide[] = communities.map((c) => {
  const base = G[c.id]
  return {
    slug: c.id,
    name: c.name,
    image: c.image,
    thumb: c.thumb,
    blurb: c.blurb,
    tagline: c.blurb,
    ...base,
    connectivity: base.transport,
    nearbySchoolsHealthcare: base.schoolsHealth,
    coordinates: { lat: base.lat, lng: base.lng },
    considerations: base.drawbacks,
  }
})

export const getCommunity = (slug: string) => communityGuides.find((c) => c.slug === slug)
export const getCommunityGuide = getCommunity
