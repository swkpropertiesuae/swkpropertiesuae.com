import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Compass,
  GraduationCap,
  MapPin,
  Train,
} from "lucide-react";
import { communityGuides, getCommunityGuide } from "@/lib/communities";
import { getListingsByCommunity } from "@/lib/listings";
import { projects } from "@/lib/developers";
import { PropertyCard } from "@/components/site/property-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { NearbyWalk } from "@/components/ui/nearby-walk-menu";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, buildMeta, placeLd } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export function generateStaticParams() {
  return communityGuides.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comm = getCommunityGuide(slug);
  if (!comm) {
    return buildMeta({
      title: "Community Not Found",
      description: "Explore Dubai community guides with SWK Properties.",
      path: "/communities",
    });
  }

  return buildMeta({
    title: `${comm.name} Community Guide | Properties, Connectivity, Pros & Cons`,
    description: `${comm.blurb} Explore verified properties for sale and rent, schools, transport times, and balanced pros & drawbacks in ${comm.name} with SWK Properties (ORN ${SITE.reraOrn}).`,
    path: `/communities/${comm.slug}`,
    image: comm.image,
    keywords: [
      comm.name,
      `${comm.name} properties for sale`,
      `${comm.name} apartments for rent`,
      `${comm.name} community guide`,
      `living in ${comm.name}`,
    ],
  });
}

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comm = getCommunityGuide(slug);
  if (!comm) notFound();

  const commListings = getListingsByCommunity(comm.slug);
  const commProjects = projects
    .filter((p) => p.community.toLowerCase().includes(comm.name.split(" (")[0].toLowerCase()))
    .slice(0, 6);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Communities", path: "/communities" },
            { name: comm.name, path: `/communities/${comm.slug}` },
          ]),
          placeLd({
            name: comm.name,
            description: comm.blurb,
            slug: comm.slug,
            image: comm.image,
            lat: comm.coordinates.lat,
            lng: comm.coordinates.lng,
          }),
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#5f6a82]">
          <Link href="/" className="hover:text-[#94652c]">Home</Link>
          <span>/</span>
          <Link href="/communities" className="hover:text-[#94652c]">Dubai Communities</Link>
          <span>/</span>
          <span className="text-[#94652c]">{comm.name}</span>
        </nav>

        {/* §11 Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white">
          <div className="relative h-[360px] md:h-[440px] w-full">
            <img
              src={comm.image}
              alt={comm.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-[#faf7f2]/65 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-3xl space-y-2">
                <span className="rounded-full bg-[#0f2244] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  SWK Neighbourhood Guide · {comm.tagline}
                </span>
                <h1 className="font-serif text-4xl md:text-6xl font-semibold text-[#0f2244]">
                  {comm.name}
                </h1>
                <p className="text-sm md:text-base text-[#39455a]">{comm.blurb}</p>
              </div>
              <div className="rounded-2xl border border-[#e6dfd2] bg-[#0f2244]/90 p-4 text-xs text-white backdrop-blur-md">
                <div className="text-[#94652c] font-semibold">Geo Coordinates</div>
                <div className="font-mono mt-0.5">
                  {comm.coordinates.lat.toFixed(4)}° N, {comm.coordinates.lng.toFixed(4)}° E
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-6">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
              District Overview & Lifestyle Character
            </h2>
            <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
              {comm.overview}
            </p>
            <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
              <strong className="text-[#94652c]">Lifestyle & Resident Profile:</strong>{" "}
              {comm.lifestyle}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 border-t border-[#e6dfd2] pt-6 text-xs">
              <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                <div className="flex items-center gap-2 font-semibold text-[#94652c] mb-2">
                  <Train className="h-4 w-4" />
                  Transport & Connectivity (Peak vs Off-Peak)
                </div>
                <ul className="space-y-1.5 text-[#39455a]">
                  {comm.connectivity.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                <div className="flex items-center gap-2 font-semibold text-[#94652c] mb-2">
                  <GraduationCap className="h-4 w-4" />
                  Nearby Schools & Healthcare
                </div>
                <ul className="space-y-1.5 text-[#39455a]">
                  {comm.nearbySchoolsHealthcare.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                <div className="flex items-center gap-2 font-semibold text-[#94652c] mb-2">
                  <Compass className="h-4 w-4" />
                  Amenities & Property Types
                </div>
                <p className="text-[#94652c] font-medium mb-1.5">
                  {comm.propertyTypes.join(" · ")}
                </p>
                <ul className="space-y-1 text-[#39455a]">
                  {comm.amenities.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* §11 Balanced Assessment: Advantages AND Practical Drawbacks */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-50/75 p-6 md:p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244] flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Why Buyers & Tenants Choose {comm.name}
            </h2>
            <ul className="mt-4 space-y-3 text-xs md:text-sm text-[#39455a]">
              {comm.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-400/30 bg-amber-50/75 p-6 md:p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244] flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-amber-700" />
              Practical Considerations & Trade-Offs (§11)
            </h2>
            <ul className="mt-4 space-y-3 text-xs md:text-sm text-[#39455a]">
              {comm.considerations.map((con) => (
                <li key={con} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Available Properties in this Community */}
        {commListings.length > 0 && (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94652c]">
                  Verified Listings in {comm.name}
                </p>
                <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0f2244]">
                  Available Properties for Sale & Rent
                </h2>
              </div>
              <Link
                href={`/properties?community=${comm.slug}`}
                className="text-xs font-semibold text-[#94652c] hover:underline"
              >
                Filter All {comm.name} Inventory →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {commListings.map((item) => (
                <PropertyCard key={item.slug} listing={item} />
              ))}
            </div>
          </section>
        )}

        {/* Off-Plan Projects in this Community */}
        {commProjects.length > 0 && (
          <section>
            <h2 className="mb-6 font-serif text-3xl font-semibold text-[#0f2244]">
              Off-Plan & Developer Releases in {comm.name}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {commProjects.map((proj) => (
                <Link
                  key={proj.slug}
                  href={`/off-plan/${proj.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-[#e6dfd2] bg-white p-3.5 hover:border-[#94652c]/40"
                >
                  <img
                    src={proj.images[0]}
                    alt={proj.name}
                    className="h-20 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94652c]">
                      {proj.developer}
                    </span>
                    <h3 className="truncate font-serif text-lg font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                      {proj.name}
                    </h3>
                    <p className="truncate text-xs text-[#5f6a82]">{proj.collection}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Connectivity Walk/Drive Scene */}
        <section className="overflow-hidden rounded-3xl border border-[#e6dfd2]">
          <NearbyWalk
            origin={comm.name}
            defaultTheme="classic"
            hint={`Interactive transit overview from ${comm.name}`}
          />
        </section>

        {/* Local Specialist Consultation Form (§11) */}
        <section className="mx-auto max-w-4xl">
          <EnquiryForm
            context="property"
            heading={`Speak With Our ${comm.name} Area Specialist`}
            subheading={`Request recent DLD comparable transfers, building service-charge benchmarks, and active listings in ${comm.name}.`}
            community={comm.name}
          />
        </section>
      </div>
    </>
  );
}
