import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Faq } from "@/components/site/faq";
import PortalCarousel from "@/components/ui/portal-carousel";
import { NearbyWalk } from "@/components/ui/nearby-walk-menu";
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
import { developers, projects } from "@/lib/developers";
import { blogArticles } from "@/lib/blog";
import { SITE } from "@/lib/swk";

const PORTAL_OFFPLAN_IMAGES = [
  {
    src: "/img/projects/emaar/avarra-by-palace.webp",
    alt: "Avarra by Palace · Emaar Properties",
    title: "Avarra by Palace · Emaar (80/20 Plan)",
  },
  {
    src: "/img/projects/sobha/sobha-seahaven.webp",
    alt: "Sobha SeaHaven Dubai Harbour",
    title: "Sobha SeaHaven · Dubai Harbour (60/40 Plan)",
  },
  {
    src: "/img/projects/binghatti/mercedes-benz-places.webp",
    alt: "Mercedes-Benz Places by Binghatti",
    title: "Mercedes-Benz Places · Downtown Dubai (70/30 Plan)",
  },
  {
    src: "/img/projects/damac/damac-casa.webp",
    alt: "DAMAC Casa · Al Sufouh Dubai",
    title: "DAMAC Casa · Palm View Sky Residences",
  },
];

const SZR_WALK_PLACES = [
  { id: "station", name: "Financial Centre Metro", km: 0.4, walkMinutes: 4 },
  { id: "myeongdong", name: "DIFC Gate Village", km: 1.1, walkMinutes: 8 },
  { id: "gate", name: "Museum of the Future", km: 1.8, walkMinutes: 6 },
  { id: "palace", name: "Dubai Opera & Mall", km: 2.9, walkMinutes: 9 },
  { id: "tower", name: "Burj Khalifa District", km: 3.1, walkMinutes: 10 },
];

export default function Home() {
  const readyAndRentListings = LISTINGS.filter((l) => l.purpose !== "off-plan").slice(0, 6);
  const offPlanFeaturedListings = LISTINGS.filter((l) => l.purpose === "off-plan");
  const latestArticles = blogArticles.slice(0, 3);

  // Prepare rich project items with developer logos & high-res images for the horizontal infinite marquees
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

  const offPlanMarqueeProjects = projects.slice(0, 12).map(mapProjectForMarquee);
  // Pick 1 flagship project from each of the 20 developers for the counter-scrolling row under Master Developers
  const developerSignatureProjects = developers
    .map((d) => projects.find((p) => p.developerSlug === d.slug))
    .filter((p): p is (typeof projects)[number] => Boolean(p))
    .map(mapProjectForMarquee);

  return (
    <>
      {/* §03.1 & §03.2 — Fit-to-Screen Colorful Video + Picture Scroll-Parallax Hero with Single-Line Dropdown Property Search */}
      <Hero />

      <TrustBar />

      {/* §03.3 — Featured Available Properties (Buy, Rent & Off-Plan) */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
              01 · DLD Trakheesi-Permitted Inventory
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
              Featured Dubai Properties
            </h2>
            <p className="mt-2.5 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
              Every mandate displays its official DLD Trakheesi permit number, reference code, service charge estimate, and assigned RERA specialist.
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

      {/* §03.4 — Latest Verified Off-Plan Launches (Cards + PortalCarousel + Horizontal Infinite Moving Projects) */}
      <section className="border-y border-[#e6dfd2] bg-[#f4efe6] py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
                02 · DLD Escrow-Verified Releases
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
                Latest Verified Off-Plan Launches
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
                Architectural visualisations and starting prices are verified against live developer inventory and DLD project escrow registers prior to reservation.
              </p>
            </div>
            <Link
              href="/off-plan"
              className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-[#0f2244] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#14305c]"
            >
              Explore All 108 Off-Plan Launches
              <ArrowRight className="h-4 w-4 text-[#dcb888]" />
            </Link>
          </div>

          {/* Featured Off-Plan Listings with Full Payment Plan & Escrow Details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
            {offPlanFeaturedListings.map((listing) => (
              <PropertyCard key={listing.slug} listing={listing} />
            ))}
          </div>

          {/* Interactive 21st.dev PortalCarousel for Signature Releases */}
          <div className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-md">
            <PortalCarousel
              images={PORTAL_OFFPLAN_IMAGES}
              label="Inspect Launch"
              className="h-[460px] md:h-[540px]"
            />
          </div>

          {/* Horizontal Infinite Moving Off-Plan Releases Marquee */}
          <div className="mt-14">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#94652c]">
                Live Developer Launch Stream · Hover to Pause &amp; Inspect
              </span>
              <Link
                href="/off-plan"
                className="text-xs font-bold text-[#0f2244] hover:text-[#94652c]"
              >
                View All 108 Releases →
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

      {/* Architectural Tilt Cascade Carousel */}
      <Residences />

      {/* §03.5 — Explore Communities (GalleryHoverCarousel + AirplaneWindowGallery + NearbyWalk Connectivity) */}
      <Communities />
      <Aerial />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
              Sheikh Zayed Road Proximity Map
            </p>
            <h3 className="mt-1 font-serif text-2xl md:text-4xl font-semibold text-[#0f2244]">
              Connectivity From SWK Headquarters (Al Saqr Business Tower)
            </h3>
          </div>
          <Link
            href="/communities"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#94652c] hover:text-[#0f2244]"
          >
            Read All 8 Community Guides <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm">
          <NearbyWalk
            origin="SWK · Al Saqr Tower"
            places={SZR_WALK_PLACES}
            defaultTheme="classic"
            hint="Hover or tap a Dubai corridor landmark to inspect travel time from our Sheikh Zayed Road office"
          />
        </div>
      </section>

      {/* §03.6 — Explore Developers & Signature Projects (Dual Horizontal Infinite Moving Marquees with Real Images & Official Logos) */}
      <section className="border-y border-[#e6dfd2] bg-[#f4efe6] py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
                04 · 20 Master Developers · 108 Curated Projects
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244] leading-[1.08]">
                Explore Dubai &amp; UAE Master Developers
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm md:text-base text-[#39455a] leading-relaxed">
                Compare delivery track records, flagship master communities, and active off-plan &amp; ready releases across the UAE&apos;s top 20 developers in our dual infinite showcase below.
              </p>
            </div>
            <Link
              href="/developers"
              className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-[#0f2244] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-[#14305c]"
            >
              All 20 Developer Profiles
              <ArrowRight className="h-4 w-4 text-[#dcb888]" />
            </Link>
          </div>

          {/* Row 1: Infinite Horizontal Moving Marquee of All 20 UAE Master Developers (Moving Left) */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#0f2244]">
              Row 01 · 20 UAE Master Developers (Official Logos &amp; Flagship Communities)
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

          {/* Row 2: Counter-Scrolling Infinite Horizontal Moving Marquee of Flagship Developer Projects Below (Moving Right) */}
          <div className="mt-10 mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#94652c]">
              Row 02 · Signature Projects Across All 20 Master Developers
            </span>
            <Link
              href="/off-plan"
              className="text-xs font-bold text-[#0f2244] hover:text-[#94652c]"
            >
              Browse All 108 Projects →
            </Link>
          </div>
          <ProjectInfiniteMarquee
            items={developerSignatureProjects}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* §03.7 — SWK Services (Animated 21st.dev ServiceSlider) */}
      <Services />

      {/* §03.8 — Reasons to Work With SWK (GlassmorphismTrustHero + MetroMap Buying Journey + Interactive Our Promise) */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <GlassmorphismTrustHero />
      </section>
      <Journey />
      <OurNote />

      {/* §03.10 — Genuine Client Reviews (3D TestimonialGlobe + Non-Repeating Horizontal Infinite Testimonial Scroll) */}
      <Voices />

      {/* §03.11 — Latest Market Insights & Answer-First AEO Research */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#94652c]">
              09 · Answer-First Market Briefings · AEO &amp; GEO Verified
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
              Latest Dubai Real Estate Insights &amp; Guides
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

      {/* §03.12 & §03.13 — Private Consultation Section (Photorealistic 27th-Floor Lounge + Direct Advisory Form — Final Section Above Footer) */}
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
                Whether you are acquiring an off-plan release, purchasing a ready residence, leasing a home with Ejari, or listing your property for sale, our RERA-licensed specialists prepare a side-by-side DLD fee and yield breakdown within one business day.
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
                    <strong className="block text-[#0f2244]">Regulatory Credentials</strong>
                    <span>RERA ORN {SITE.reraOrn} · Dubai Land Department Registered</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <EnquiryForm
                context="general"
                heading="Book a Private Consultation"
                subheading="Tell us what you are looking to buy, rent, or list in Dubai. Your enquiry is routed directly to our relevant RERA specialist."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
