import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Faq } from "@/components/site/faq";
import GlassmorphismTrustHero from "@/components/ui/glassmorphism-trust-hero";
import {
  DeveloperInfiniteMarquee,
  ProjectInfiniteMarquee,
} from "@/components/ui/infinite-moving-cards";
import {
  Hero,
  TrustBar,
  Communities,
  Aerial,
  Residences,
  Services,
  Journey,
  OurNote,
  Voices,
} from "@/components/sections/home-sections";
import { LISTINGS } from "@/lib/listings";
import { developers, priorityProjects, projects } from "@/lib/developers";
import { blogArticles } from "@/lib/blog";
import { SITE } from "@/lib/swk";

const DUBAI_PRIORITY_CORRIDORS = [
  {
    region: "Dubai Flagship Lagoons & Master Estates",
    headline: "Waterfront Villas, Golf Estates & Branded Sky Towers",
    description:
      "Our highest-demand allocations in Dubai, spanning crystal-lagoon villa communities in Dubai South and Dubailand to branded Downtown sky residences.",
    highlights: [
      { name: "Azizi Venice", location: "Dubai South", tag: "50/50 Plan · Crystal Lagoon" },
      { name: "Sobha Century", location: "Sheikh Zayed Road", tag: "60/40 Plan · Sky Parks" },
      { name: "DAMAC Islands", location: "Dubailand", tag: "75/25 Plan · Lagoon Villas" },
      { name: "Emaar The Oasis", location: "Dubailand", tag: "80/20 Plan · Canal Mansions" },
      { name: "Binghatti — Maybach Benz", location: "Downtown Dubai", tag: "70/30 Plan · Branded Tower" },
      { name: "Dubai Hills Estate", location: "Mohammed Bin Rashid City", tag: "Golf & Park Masterplan" },
    ],
    image: "/img/projects/azizi/azizi-venice.webp",
  },
  {
    region: "Dubai Boutique, Island & High-Yield Releases",
    headline: "Design-Led Coastal Residences & 1% Monthly Plans",
    description:
      "Hand-picked mid-rise and coastal releases offering private terrace pools, Dubai Islands beach access, and structured investor payment plans.",
    highlights: [
      { name: "The Meriva — Dubai Islands", location: "By Ellington", tag: "70/30 Plan · Beachfront" },
      { name: "Ellington — Berkeley Tower", location: "MBR City / Dubai Hills", tag: "Design-Led Residences" },
      { name: "Samana — Downtown One", location: "Downtown Corridor", tag: "Private Balcony Pools" },
      { name: "Danube — Greenz", location: "Dubai", tag: "1% Monthly Plan" },
      { name: "Azizi — Leily & Azizi Florence", location: "Al Jaddaf & Al Furjan", tag: "Metro-Connected Yield" },
      { name: "Lunaya — The Bloom Villa & Dugasta Platinum Residence", location: "Dubailand & Warsan", tag: "Villas & Net-Yield Homes" },
    ],
    image: "/img/projects/nakheel/dubai-islands.webp",
  },
  {
    region: "Abu Dhabi, Sharjah, RAK & Umm Al Quwain",
    headline: "UAE-Wide Island & Cultural Sanctuaries",
    description:
      "Strategic coastal and woodland masterplans across Abu Dhabi's Yas and Saadiyat Islands, Ras Al Khaimah's Al Marjan Island, Umm Al Quwain's Siniya Island, and Sharjah's Masaar.",
    highlights: [
      { name: "Manchester City Yas Residences & Sobha River Core", location: "Yas Island & Waterfront", tag: "Branded Canal & Riverfront" },
      { name: "Yas Island & Saadiyat Island", location: "Abu Dhabi", tag: "Cultural & Marina District" },
      { name: "Siniya Island & Downtown Umm Al Quwain", location: "Sobha UAQ", tag: "Natural Island & 11km Coast" },
      { name: "Al Marjan Island & Address Residences", location: "Ras Al Khaimah", tag: "Beachfront Resort Hub" },
      { name: "Quattro Del Mar & Al Hamra Waterfront", location: "Ras Al Khaimah", tag: "Hayat Island & Yacht Marina" },
      { name: "Masaar — Sharjah & Alif — Sharjah", location: "Arada Sharjah", tag: "Woodland Villas & Boulevard" },
    ],
    image: "/img/projects/sobha/sobha-seahaven.webp",
  },
];

export default function Home() {
  const readyAndRentListings = LISTINGS.filter((l) => l.purpose !== "off-plan").slice(0, 6);
  const offPlanFeaturedListings = LISTINGS.filter((l) => l.purpose === "off-plan").slice(0, 6);
  const latestArticles = blogArticles.slice(0, 3);

  const mapProjectForMarquee = (proj: (typeof projects)[number]) => {
    const devObj = developers.find((d) => d.slug === proj.developerSlug);
    return {
      slug: proj.slug,
      name: proj.name,
      developer: proj.developer,
      developerSlug: proj.developerSlug,
      developerLogo: devObj?.logo,
      community: proj.community,
      collection: proj.collection,
      image: proj.images[0],
      summary: proj.summary,
    };
  };

  const offPlanMarqueeProjects = priorityProjects.map(mapProjectForMarquee);
  const developerSignatureProjects = developers
    .map((d) => projects.find((p) => p.developerSlug === d.slug))
    .filter((p): p is (typeof projects)[number] => Boolean(p))
    .map(mapProjectForMarquee);

  return (
    <>
      {/* Sequential Two-Part 21st.dev Storyboard Hero + Single-Line Property Search */}
      <Hero />

      {/* 18+ Years Experience · 27+ Partner Developers · 108+ Verified Projects · 5 UAE Emirates */}
      <TrustBar />

      {/* 01 · Featured Ready & Rental Properties */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
              01 · Ready Secondary &amp; Annual Leasing Inventory
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
              Featured Dubai Properties
            </h2>
            <p className="mt-2.5 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
              Hand-picked villas, penthouses, and apartments available for immediate transfer or annual lease across Downtown Dubai, Palm Jumeirah, Dubai Marina, and Dubai Hills Estate.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex whitespace-nowrap items-center gap-2.5 rounded-full bg-[#0f2244] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#14305c]"
          >
            Explore All Properties
            <ArrowRight className="h-4 w-4 text-[#dcb888]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {readyAndRentListings.map((listing) => (
            <PropertyCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>

      {/* 02 · Latest Verified Off-Plan Launches + Priority Dubai & UAE Target Projects Board */}
      <section className="border-y border-[#e6dfd2] bg-[#f4efe6] py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
                02 · Priority Developer Allocations Across 5 Emirates
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
                Latest Verified Off-Plan Launches
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
                Direct developer allocations across our most requested launches—including Azizi Venice, Emaar The Oasis, DAMAC Islands, Sobha Century, Binghatti Maybach, and The Meriva on Dubai Islands.
              </p>
            </div>
            <Link
              href="/off-plan"
              className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-[#0f2244] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#14305c]"
            >
              Explore All 108+ Off-Plan Projects
              <ArrowRight className="h-4 w-4 text-[#dcb888]" />
            </Link>
          </div>

          {/* 6 Featured Priority Off-Plan Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {offPlanFeaturedListings.map((listing) => (
              <PropertyCard key={listing.slug} listing={listing} />
            ))}
          </div>

          {/* Replaces old PortalCarousel: Dedicated Dubai & UAE Priority Investment Corridors Showcase */}
          <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-10 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#e6dfd2] pb-6 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#94652c]">
                  <Sparkles className="h-3.5 w-3.5" />
                  SWK 2026 Priority Mandate Desk
                </span>
                <h3 className="mt-2 font-serif text-2xl md:text-4xl font-semibold text-[#0f2244]">
                  The Projects We Target Most Across Dubai &amp; The UAE
                </h3>
                <p className="mt-1.5 max-w-2xl text-xs md:text-sm text-[#39455a]">
                  Our advisory team holds active buyer mandates and floor-plate intelligence across these 26 high-growth developments in Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, and Umm Al Quwain.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f2244] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#94652c]"
              >
                <span>Request Priority Availability</span>
                <ArrowUpRight className="h-4 w-4 text-[#dcb888]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {DUBAI_PRIORITY_CORRIDORS.map((corridor) => (
                <div
                  key={corridor.region}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e6dfd2] bg-[#faf7f2]"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-[#0f2244]">
                      <img
                        src={corridor.image}
                        alt={corridor.headline}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/90 via-[#0f2244]/30 to-transparent" />
                      <div className="absolute bottom-3.5 left-4 right-4 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dcb888]">
                          {corridor.region}
                        </span>
                        <h4 className="mt-0.5 font-serif text-xl font-semibold">
                          {corridor.headline}
                        </h4>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-xs text-[#39455a] leading-relaxed mb-4">
                        {corridor.description}
                      </p>

                      <div className="space-y-2">
                        {corridor.highlights.map((item) => (
                          <Link
                            key={item.name}
                            href="/off-plan"
                            className="group flex items-center justify-between gap-2 rounded-xl border border-[#e6dfd2] bg-white px-3.5 py-2.5 text-xs transition hover:border-[#94652c]"
                          >
                            <div className="min-w-0">
                              <span className="block truncate font-bold text-[#0f2244] group-hover:text-[#94652c]">
                                {item.name}
                              </span>
                              <span className="block truncate text-[10px] text-[#5f6a82]">
                                {item.location}
                              </span>
                            </div>
                            <span className="shrink-0 rounded-full bg-[#faf7f2] border border-[#e6dfd2] px-2.5 py-0.5 text-[10px] font-semibold text-[#94652c]">
                              {item.tag}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#e6dfd2] bg-white px-5 py-3 text-right">
                    <Link
                      href="/off-plan"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0f2244] hover:text-[#94652c]"
                    >
                      <span>Compare Floor Plans &amp; Prices</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal Infinite Moving Off-Plan Releases Marquee */}
          <div className="mt-14">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#94652c]">
                Priority Target Launch Stream · Hover to Pause &amp; Inspect
              </span>
              <Link
                href="/off-plan"
                className="text-xs font-bold text-[#0f2244] hover:text-[#94652c]"
              >
                View All 108+ Projects →
              </Link>
            </div>
            <ProjectInfiniteMarquee
              items={offPlanMarqueeProjects}
              direction="left"
              speed="slow"
            />
          </div>
        </div>
      </section>

      {/* Architectural Visualisations — Continuous Infinite Horizontal Stream */}
      <Residences />

      {/* Explore Communities — Continuous Infinite Marquee + Interactive Aerial Masterplan Explorer */}
      <Communities />
      <Aerial />

      {/* 04 · Explore 27+ UAE Master Developers & Signature Projects */}
      <section className="border-y border-[#e6dfd2] bg-[#f4efe6] py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
                04 · 27+ Master Developers · 108+ Verified Projects
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
                Explore Dubai &amp; UAE Master Developers
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
                Compare delivery history, flagship master communities, and active off-plan &amp; ready releases across 27+ leading UAE developers in our dual continuous showcase below.
              </p>
            </div>
            <Link
              href="/developers"
              className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-[#0f2244] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#14305c]"
            >
              All 27+ Developer Profiles
              <ArrowRight className="h-4 w-4 text-[#dcb888]" />
            </Link>
          </div>

          {/* Row 1: Infinite Horizontal Moving Marquee of 27+ UAE Master Developers */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#0f2244]">
              Row 01 · 27+ UAE Master Developers (Official Logos &amp; Flagship Communities)
            </span>
            <span className="text-xs font-medium text-[#5f6a82]">
              Hover any card to pause
            </span>
          </div>
          <DeveloperInfiniteMarquee
            items={developers}
            direction="left"
            speed="slow"
          />

          {/* Row 2: Counter-Scrolling Infinite Horizontal Moving Marquee of Flagship Developer Projects */}
          <div className="mt-10 mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#94652c]">
              Row 02 · Signature Projects Across All Partner Developers
            </span>
            <Link
              href="/off-plan"
              className="text-xs font-bold text-[#0f2244] hover:text-[#94652c]"
            >
              Browse All 108+ Projects →
            </Link>
          </div>
          <ProjectInfiniteMarquee
            items={developerSignatureProjects}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* 05 · SWK Advisory Services (Interactive 6-Pillar Showcase) */}
      <Services />

      {/* 06 · Reasons to Work With SWK + Interactive 6-Stage Buying Journey + Our Promise Charter */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <GlassmorphismTrustHero />
      </section>
      <Journey />
      <OurNote />

      {/* 08 · Verified Global Client Stories (Interactive Case Study Spotlight + Dual Infinite Streams) */}
      <Voices />

      {/* 09 · Latest Market Insights & Research */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
              09 · Market Briefings &amp; Buyer Guides
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
              Latest Dubai &amp; UAE Real Estate Insights
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/guides/buying"
              className="rounded-full border border-[#e6dfd2] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] transition hover:border-[#94652c] hover:text-[#94652c]"
            >
              Buying Guide
            </Link>
            <Link
              href="/guides/investing"
              className="rounded-full border border-[#e6dfd2] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] transition hover:border-[#94652c] hover:text-[#94652c]"
            >
              Investor Guide
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 rounded-full bg-[#0f2244] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#14305c]"
            >
              All 10 Briefings →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestArticles.map((art) => (
            <Link
              key={art.slug}
              href={`/insights/${art.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#94652c] hover:shadow-lg"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#0f2244]/90 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcb888]">
                    {art.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="text-[11px] font-medium text-[#5f6a82]">
                    {art.date} · {art.readTime}
                  </div>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                    {art.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs md:text-sm text-[#39455a] leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>
              <div className="border-t border-[#e6dfd2] bg-[#faf7f2] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] group-hover:text-[#94652c]">
                Read Briefing →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <Faq />

      {/* Private Consultation Section (27th-Floor Lounge + Direct Advisory Form) */}
      <section id="contact" className="border-t border-[#e6dfd2] bg-[#f4efe6] py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#94652c] shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Private Consultation · 27th Floor, Sheikh Zayed Road
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
                Visit Our Advisory Suite or Request a Custom Shortlist
              </h2>
              <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
                Whether you are comparing off-plan launches, acquiring a ready home, arranging an annual lease, or listing a property for sale, our team prepares a clear side-by-side comparison and cost breakdown within one business day.
              </p>

              {/* Photorealistic 27th-Floor Private Consultation Lounge Image */}
              <div className="relative overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-md">
                <img
                  src="/img/about/private-consultation-lounge.jpg"
                  alt="SWK Properties Private Consultation Suite on the 27th Floor of Al Saqr Business Tower, Sheikh Zayed Road"
                  className="h-64 w-full object-cover"
                />
                <div className="border-t border-[#e6dfd2] bg-white px-5 py-3.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0f2244]">
                    SWK Private Advisory Suite · Office 54, 27th Floor
                  </span>
                  <span className="font-bold uppercase tracking-[0.16em] text-[#94652c]">
                    Al Saqr Business Tower
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 space-y-4 text-xs text-[#39455a] shadow-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                  <div>
                    <strong className="block text-[#0f2244]">Headquarters Address</strong>
                    <span>{SITE.address.full}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                  <div>
                    <strong className="block text-[#0f2244]">Direct Telephone &amp; WhatsApp</strong>
                    <a href={`tel:${SITE.phoneRaw}`} className="font-semibold text-[#94652c] hover:underline">
                      {SITE.phone}
                    </a>{" "}
                    ·{" "}
                    <a href={`mailto:${SITE.email}`} className="hover:underline">
                      {SITE.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                  <div>
                    <strong className="block text-[#0f2244]">Dubai GST Business Hours</strong>
                    <span>
                      {SITE.hours.weekdays} · {SITE.hours.saturday}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <strong className="block text-[#0f2244]">Experience &amp; Coverage</strong>
                    <span>18+ Years Experience · 27+ Developers · 108+ Verified Projects</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <EnquiryForm
                context="general"
                heading="Book a Private Consultation"
                subheading="Tell us what you are looking to buy, rent, or list across the UAE. Your enquiry goes directly to the specialist covering your target community."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
