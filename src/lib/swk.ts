import communitiesJson from "@/data/communities.json";
import servicesJson from "@/data/services.json";
import teamJson from "@/data/team.json";
import faqJson from "@/data/faq.json";
import testimonialsJson from "@/data/testimonials.json";

export const SITE = {
  name: "SWK Properties",
  legalName: "SWK Properties LLC",
  domain: "swkpropertiesuae.com",
  url: "https://www.swkpropertiesuae.com",
  phone: "+971 56 433 0448",
  phoneDisplay: "+971 56 433 0448",
  phoneRaw: "+971564330448",
  phoneTel: "+971564330448",
  whatsapp: "https://wa.me/971564330448",
  whatsappUrl: "https://wa.me/971564330448",
  email: "info@swkpropertiesuae.com",
  address: {
    full: "Office No 54, 27th Floor, Al Saqr Business Tower, Sheikh Zayed Road, Dubai, UAE",
    street: "Al Saqr Business Tower, Sheikh Zayed Road",
    city: "Dubai",
    country: "UAE",
  },
  hours: {
    weekdays: "Sun–Thu 9:00 AM – 7:00 PM GST",
    saturday: "Sat 10:00 AM – 4:00 PM GST",
    full: "Sun–Thu 9:00–19:00 · Sat 10:00–16:00 GST",
  },
  founded: 2016,
  orn: "51517",
  reraOrn: "51517",
  rera: "RERA ORN 51517",
  announcement:
    "RERA ORN 51517 · Verified Off-Plan, Secondary & Leasing Advisory at Al Saqr Business Tower, Sheikh Zayed Road",
  geo: {
    lat: 25.213925,
    lng: 55.277978,
  },
  instagram: "https://www.instagram.com/swk.properties/",
  linkedin: "https://www.linkedin.com/company/swk-properties-llc",
  socials: {
    instagram: "https://www.instagram.com/swk.properties/",
    linkedin: "https://www.linkedin.com/company/swk-properties-llc",
  },
  tagline: "Property advisory across the UAE",
} as const;

export const stats = [
  { label: "UAE Developers Tracked", value: 20, suffix: "+" },
  { label: "Verified Launches & Projects", value: 108, suffix: "" },
  { label: "Advisory Languages Spoken", value: 7, suffix: "" },
  { label: "RERA Office Registration", value: 51517, suffix: "" },
];

const img = (p: string) => `/img/${p}`;

export const communities = communitiesJson.map((c) => ({
  id: c.id,
  slug: c.id,
  name: c.name,
  blurb: c.blurb,
  tagline: c.blurb,
  image: img(`communities/${c.id}.webp`),
  thumb: img(`communities/${c.id}-640.webp`),
}));

export const services = servicesJson;

const TEAM_LANGUAGES: Record<string, string[]> = {
  "mohammad-haseeb": ["English", "Urdu", "Hindi", "Punjabi"],
  "mohd-shahid-khan": ["English", "Hindi", "Urdu"],
  "issaadi-chahrazed": ["English", "French", "Arabic"],
  "talha-shabbir": ["English", "Urdu", "Punjabi"],
  "fareed-choudhary": ["English", "Urdu", "Hindi"],
};

export const team = teamJson.map((m) => {
  const slug = m.name.toLowerCase().replace(/\s+/g, "-");
  return {
    ...m,
    slug,
    focus: m.bio,
    languages: TEAM_LANGUAGES[slug] ?? ["English", "Arabic"],
    photo: img(m.photo.replace("assets/images/", "")),
  };
});

export const faqs = faqJson.map((f) => ({
  ...f,
  q: f.question,
  a: f.answer,
}));

const COORDS: Record<string, { city: string; code: string; lat: number; lng: number }> = {
  India: { city: "India", code: "IN", lat: 19.08, lng: 72.88 },
  Pakistan: { city: "Pakistan", code: "PK", lat: 24.86, lng: 67.01 },
  Russia: { city: "Russia", code: "RU", lat: 55.76, lng: 37.62 },
  "United Kingdom": { city: "United Kingdom", code: "GB", lat: 51.51, lng: -0.13 },
  UAE: { city: "UAE", code: "AE", lat: 25.2, lng: 55.27 },
  Canada: { city: "Canada", code: "CA", lat: 43.65, lng: -79.38 },
};

const UNIQUE_CLIENT_PORTRAIT_BY_NAME: Record<string, string> = {
  "Arjun S.": "/img/clients/arjun-s.jpg",
  "Priya M.": "/img/clients/priya-m.jpg",
  "Rohan K.": "/img/clients/rohan-k.jpg",
  "Ahmed R.": "/img/clients/ahmed-r.jpg",
  "Sana A.": "/img/clients/sana-a.jpg",
  "Elena V.": "/img/clients/elena-v.jpg",
  "James W.": "/img/clients/james-w.jpg",
  "Charlotte B.": "/img/clients/charlotte-b.jpg",
  "Khalid A.": "/img/clients/khalid-a.jpg",
  "Daniel C.": "/img/clients/daniel-c.jpg",
};

const allMappedTestimonials = testimonialsJson
  .filter((t) => t.approved)
  .map((t, i) => {
    const geo = COORDS[t.country] ?? COORDS.UAE;
    return {
      id: `t-${i}`,
      quote: t.quote,
      name: t.name,
      role: t.context,
      city: geo.city,
      country: geo.code,
      lat: geo.lat,
      lng: geo.lng,
      image: UNIQUE_CLIENT_PORTRAIT_BY_NAME[t.name] ?? "/img/clients/arjun-s.jpg",
      rating: t.rating,
    };
  });

const GLOBE_NAMES = new Set([
  "Arjun S.",
  "Priya M.",
  "Ahmed R.",
  "Elena V.",
  "James W.",
  "Khalid A.",
]);

/** 6 unique global client stories for the 3D TestimonialGlobe (each with a unique portrait). */
export const testimonials = allMappedTestimonials.filter((t) => GLOBE_NAMES.has(t.name));

/** 4 additional verified client stories for the horizontal scrolling marquee below the globe (zero repeated portraits). */
export const horizontalTestimonials = allMappedTestimonials.filter(
  (t) => !GLOBE_NAMES.has(t.name)
);

/** Developer render photography from the SWK library. */
export const gallery = Array.from({ length: 16 }, (_, i) => img(`gallery/image${i + 1}.webp`));
export const heroImages = [
  { src: img("communities/downtown-dubai.webp"), title: "Downtown Dubai" },
  { src: img("gallery/image1.webp"), title: "Beachside living" },
  { src: img("communities/palm-jumeirah.webp"), title: "Palm Jumeirah" },
  { src: img("gallery/image7.webp"), title: "Pool villas" },
  { src: img("communities/dubai-marina.webp"), title: "Dubai Marina" },
  { src: img("gallery/image10.webp"), title: "Mixed-use towers" },
  { src: img("communities/business-bay.webp"), title: "Business Bay" },
  { src: img("gallery/image5.webp"), title: "Lagoon residences" },
  { src: img("communities/dubai-creek-harbour.webp"), title: "Creek Harbour" },
];
export const officeImage = img("about/swk-office.webp");
export const skylineImage = img("hero/dubai-skyline-hero.webp");
export const cinematicImage = img("hero/dubai-services-cinematic.webp");
