import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { developers, getDeveloper } from "@/lib/developers";
import { getListingsByDeveloper } from "@/lib/listings";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, buildMeta } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export function generateStaticParams() {
  return developers.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dev = getDeveloper(slug);
  if (!dev) {
    return buildMeta({
      title: "Developer Not Found",
      description: "Browse 20 UAE real estate developers with SWK Properties.",
      path: "/developers",
    });
  }

  return buildMeta({
    title: `${dev.name} Projects, Payment Plans & Delivery Track Record | Dubai & UAE`,
    description: `${dev.tagline}. Explore ${dev.projectCount} off-plan and ready developments by ${dev.name}, flagship communities, and DLD escrow guidance with SWK Properties (ORN ${SITE.reraOrn}).`,
    path: `/developers/${dev.slug}`,
    image: dev.projects[0]?.images[0] || "/img/hero/dubai-skyline-hero.webp",
    keywords: [
      dev.name,
      `${dev.name} Dubai projects`,
      `${dev.name} off-plan`,
      `${dev.name} payment plan`,
      ...(dev.flagshipAreas || []),
    ],
  });
}

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dev = getDeveloper(slug);
  if (!dev) notFound();

  const devListings = getListingsByDeveloper(dev.slug);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#0f2244]">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Developers", path: "/developers" },
          { name: dev.name, path: `/developers/${dev.slug}` },
        ])}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-14 md:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#5f6a82]">
          <Link href="/" className="hover:text-[#0f2244]">Home</Link>
          <span>/</span>
          <Link href="/developers" className="hover:text-[#0f2244]">UAE Developers</Link>
          <span>/</span>
          <span className="font-semibold text-[#94652c]">{dev.name}</span>
        </nav>

        {/* §10 Developer Profile Header */}
        <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-10 shadow-sm">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                {dev.logo && (
                  <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] px-4 py-2">
                    <img
                      src={dev.logo}
                      alt={dev.name}
                      className="h-8 max-w-[150px] object-contain"
                    />
                  </div>
                )}
                <span className="rounded-full bg-[#0f2244] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dcb888]">
                  UAE Master Developer Profile
                </span>
                {dev.founded && (
                  <span className="rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3 py-1 text-[11px] font-medium text-[#39455a]">
                    Established {dev.founded}
                  </span>
                )}
                {dev.headquarters && (
                  <span className="rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3 py-1 text-[11px] font-semibold text-[#94652c]">
                    HQ: {dev.headquarters}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-4xl md:text-6xl font-semibold text-[#0f2244] leading-[1.08]">
                {dev.name}
              </h1>
              <p className="text-base md:text-lg font-semibold text-[#94652c]">{dev.tagline}</p>
              <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
                {dev.description}
              </p>

              {dev.flagshipAreas && dev.flagshipAreas.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#94652c] block mb-2.5">
                    Flagship Master Communities & Districts:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {dev.flagshipAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#e6dfd2] bg-[#faf7f2] px-3.5 py-1.5 text-xs font-medium text-[#0f2244]"
                      >
                        <MapPin className="h-3.5 w-3.5 text-[#94652c]" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Factual Delivery & Escrow Summary Card (§10) */}
            <div className="lg:col-span-4 rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#0f2244]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                SWK Due Diligence Summary
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-[#e6dfd2] bg-white p-3.5">
                  <span className="text-[#5f6a82] block">Curated Releases</span>
                  <strong className="mt-1 block font-serif text-2xl text-[#0f2244]">
                    {dev.projectCount}
                  </strong>
                </div>
                <div className="rounded-xl border border-[#e6dfd2] bg-white p-3.5">
                  <span className="text-[#5f6a82] block">Escrow Status</span>
                  <strong className="mt-1 block text-emerald-700">
                    DLD Verified
                  </strong>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-[#39455a]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                  <span>Compare floor plates & service charges across {dev.name} buildings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                  <span>0% agency commission on direct off-plan developer bookings</span>
                </li>
              </ul>
              <p className="border-t border-[#e6dfd2] pt-3 text-[11px] text-[#5f6a82] leading-relaxed">
                Independent Advisory Notice: SWK Properties LLC (RERA ORN {SITE.reraOrn}) represents buyers and landlords independently and does not claim exclusive developer ownership.
              </p>
            </div>
          </div>
        </section>

        {/* Active Secondary & Off-Plan Listings for this Developer */}
        {devListings.length > 0 && (
          <section>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#94652c]">
                Immediate Inventory
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0f2244]">
                Featured {dev.name} Listings With Full Floor Plans
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {devListings.map((item) => (
                <PropertyCard key={item.slug} listing={item} />
              ))}
            </div>
          </section>
        )}

        {/* §10 All Projects by this Developer */}
        <section>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#94652c]">
                Current, Upcoming & Delivered Portfolio
              </p>
              <h2 className="mt-1 font-serif text-3xl md:text-4xl font-semibold text-[#0f2244]">
                {dev.name} Developments ({dev.projects.length})
              </h2>
            </div>
            <Link href="/off-plan" className="text-xs font-bold uppercase tracking-[0.18em] text-[#94652c] hover:text-[#0f2244]">
              Browse All 108 UAE Projects →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dev.projects.map((proj) => (
              <Link
                key={proj.slug}
                href={`/off-plan/${proj.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#94652c] hover:shadow-lg"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={proj.images[0]}
                      alt={proj.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-[#0f2244] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#dcb888]">
                      {proj.collection}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold text-[#0f2244] shadow-sm">
                      Developer Visualisation
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#94652c]">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{proj.community}</span>
                    </div>
                    <h3 className="mt-1 font-serif text-2xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                      {proj.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs md:text-sm text-[#39455a] leading-relaxed">
                      {proj.summary}
                    </p>
                  </div>
                </div>
                <div className="border-t border-[#e6dfd2] bg-[#faf7f2] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0f2244] group-hover:text-[#94652c]">
                  Inspect Project & Payment Plan →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Developer Enquiry Form (§10) */}
        <section className="mx-auto max-w-4xl">
          <EnquiryForm
            context="investment"
            heading={`Request ${dev.name} Inventory, Price List & Escrow Sheet`}
            subheading={`Receive current unit availability, floor plans, and historical handover data across ${dev.name} communities.`}
            developer={dev.name}
          />
        </section>
      </div>
    </div>
  );
}
