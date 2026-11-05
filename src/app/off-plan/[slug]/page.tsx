import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { getDeveloper, getProject, projects } from "@/lib/developers";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, buildMeta } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return buildMeta({
      title: "Off-Plan Project Not Found",
      description: "Explore 108 verified UAE off-plan developments with SWK Properties.",
      path: "/off-plan",
    });
  }

  return buildMeta({
    title: `${project.name} by ${project.developer} (${project.community}) | Off-Plan Payment Plan & Brochure`,
    description: `${project.summary} Request verified floor plans, starting prices, handover schedule, and DLD escrow details from SWK Properties (RERA ORN ${SITE.reraOrn}).`,
    path: `/off-plan/${project.slug}`,
    image: project.images[0],
    keywords: [
      project.name,
      `${project.name} ${project.developer}`,
      `${project.name} payment plan`,
      `${project.name} floor plan`,
      `${project.community} off-plan`,
      project.developer,
    ],
  });
}

export default async function OffPlanProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const dev = getDeveloper(project.developerSlug);
  const relatedProjects = projects
    .filter(
      (p) =>
        p.slug !== project.slug &&
        (p.developerSlug === project.developerSlug || p.community === project.community)
    )
    .slice(0, 3);

  const waMessage = encodeURIComponent(
    `Hello SWK Properties, I would like the verified brochure, floor plans, and current unit availability for ${project.name} by ${project.developer} in ${project.community}.`
  );

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Off-Plan Projects", path: "/off-plan" },
          { name: project.developer, path: `/developers/${project.developerSlug}` },
          { name: project.name, path: `/off-plan/${project.slug}` },
        ])}
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#5f6a82]">
          <Link href="/" className="hover:text-[#94652c]">Home</Link>
          <span>/</span>
          <Link href="/off-plan" className="hover:text-[#94652c]">Off-Plan Launches</Link>
          <span>/</span>
          <Link href={`/developers/${project.developerSlug}`} className="hover:text-[#94652c]">
            {project.developer}
          </Link>
          <span>/</span>
          <span className="text-[#94652c]">{project.name}</span>
        </nav>

        {/* §09 Off-Plan Project Header */}
        <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#0f2244] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  Off-Plan · {project.collection}
                </span>
                <span className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  DLD Escrow Mandatory
                </span>
                <span className="rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-1 text-[10px] font-medium text-amber-800">
                  Visuals Are Developer Architectural Renders
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
                {project.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#39455a]">
                <Link
                  href={`/developers/${project.developerSlug}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#94652c] hover:underline"
                >
                  <Building2 className="h-4 w-4" />
                  Developer: {project.developer}
                </Link>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#94652c]" />
                  Community: {project.community}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#94652c]/35 bg-[#faf7f2] p-5 min-w-[260px]">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#94652c]">
                Starting Price & Allocations
              </div>
              <div className="mt-1 font-serif text-2xl font-bold text-[#0f2244]">
                Indicative · On Request
              </div>
              <p className="mt-1 text-[11px] text-[#5f6a82]">
                Confirmed live from {project.developer} inventory sheet + 4% DLD Oqood fee
              </p>
              <a
                href={`https://wa.me/${SITE.phoneRaw.replace("+", "")}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-black hover:bg-emerald-400"
              >
                <MessageCircle className="h-4 w-4" />
                Request Live Availability
              </a>
            </div>
          </div>
        </div>

        {/* §09 Clearly Labelled Developer Renders Gallery */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {project.images.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-3xl border border-[#e6dfd2]">
              <img
                src={img}
                alt={`${project.name} by ${project.developer} — Developer Render ${i + 1}`}
                className="h-[340px] md:h-[420px] w-full object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-[#0f2244]/90 px-3 py-1 text-[11px] text-white backdrop-blur-md">
                {project.name} · Developer Architectural Render {i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* §09 Project Details, Payment Plan, Handover Source & DLD Escrow Compliance */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
                Development Overview & Masterplan Context
              </h2>
              <p className="mt-4 text-sm md:text-base text-[#39455a] leading-relaxed">
                {project.summary}
              </p>
              <p className="mt-4 text-sm text-[#39455a] leading-relaxed">
                Positioned within <strong>{project.community}</strong> and delivered by{" "}
                <Link
                  href={`/developers/${project.developerSlug}`}
                  className="text-[#94652c] underline"
                >
                  {project.developer}
                </Link>
                , {project.name} forms part of the developer&apos;s{" "}
                <strong>{project.collection}</strong> portfolio. SWK Properties provides independent buyer representation, unit comparison across floor plates, SPA review coordination, and DLD Oqood registration support.
              </p>

              {/* Key Off-Plan Checkpoints (§09) */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#e6dfd2] pt-5 text-xs">
                <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                  <span className="text-[#5f6a82] block">Construction & Booking Status</span>
                  <strong className="mt-1 flex items-center gap-1.5 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Off-Plan Release · Allocations Checked on Request
                  </strong>
                </div>
                <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                  <span className="text-[#5f6a82] block">Handover Date & Source</span>
                  <strong className="mt-1 flex items-center gap-1.5 text-sm text-[#94652c]">
                    <Calendar className="h-4 w-4" />
                    Per Official {project.developer} SPA Schedule
                  </strong>
                </div>
                <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                  <span className="text-[#5f6a82] block">Payment Plan Structure</span>
                  <strong className="mt-1 block text-sm text-[#0f2244]">
                    Construction-Linked Milestone Schedule (+ 4% DLD Fee)
                  </strong>
                </div>
                <div className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-4">
                  <span className="text-[#5f6a82] block">Buyer Agency Commission</span>
                  <strong className="mt-1 block text-sm text-emerald-700">
                    0% Commission on Direct Developer Allocations
                  </strong>
                </div>
              </div>
            </section>

            {/* Typical Off-Plan Milestone Payment Schedule Breakdown */}
            <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#94652c]">
                    Escrow-Linked Instalment Structure
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold text-[#0f2244]">
                    How Payments Work for {project.name}
                  </h2>
                </div>
                <Link
                  href="/calculators"
                  className="text-xs font-semibold text-[#94652c] hover:underline"
                >
                  Open Payment Calculator →
                </Link>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-[#e6dfd2]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf7f2] text-[#94652c]">
                    <tr>
                      <th className="p-3.5 font-semibold">Milestone Stage</th>
                      <th className="p-3.5 font-semibold">Typical Allocation</th>
                      <th className="p-3.5 font-semibold">Regulatory Safeguard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6dfd2] text-[#39455a]">
                    <tr>
                      <td className="p-3.5 font-medium text-[#0f2244]">1. Reservation & SPA Signing</td>
                      <td className="p-3.5">10% – 20% Down Payment + 4% DLD Oqood Fee</td>
                      <td className="p-3.5">Paid to {project.developer} DLD RERA Project Escrow Account</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-[#0f2244]">2. Construction Instalments</td>
                      <td className="p-3.5">40% – 60% across certified build stages</td>
                      <td className="p-3.5">Released only against DLD engineer progress certification</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-[#0f2244]">3. Completion & Key Handover</td>
                      <td className="p-3.5">20% – 40% on Building Completion Certificate (BCC)</td>
                      <td className="p-3.5">Includes pre-handover snagging inspection & Title Deed issuance</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* §09 DLD Registration, Escrow & Render Disclaimer */}
            <section className="rounded-3xl border border-[#94652c]/35 bg-[#f6ead7]/55 p-6 md:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#94652c]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                DLD Project Escrow & Availability Disclaimer (§09)
              </div>
              <p className="text-xs text-[#39455a] leading-relaxed">
                All off-plan developments in Dubai are regulated under Dubai Law No. 8 of 2007 Concerning Escrow Accounts for Real Estate Development. Before you sign a reservation form or transfer any funds for <strong>{project.name}</strong>, your SWK Properties consultant provides the official DLD project registration sheet, escrow account IBAN details, and unit-specific floor plan.
              </p>
              <p className="text-xs text-[#5f6a82] leading-relaxed">
                <strong>Render & Specification Notice:</strong> Visuals on this page are artistic impressions and architectural renders supplied by {project.developer}. Final layouts, unit areas, views, service charges, and completion dates are governed exclusively by the executed Sales & Purchase Agreement (SPA).
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs">
                <a
                  href="https://dubailand.gov.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#94652c] hover:underline"
                >
                  Verify Project Status on dubailand.gov.ae
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {dev && (
                  <Link
                    href={`/developers/${dev.slug}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#0f2244] hover:text-[#94652c]"
                  >
                    <FileText className="h-3.5 w-3.5 text-[#94652c]" />
                    Inspect {dev.name} Track Record ({dev.projectCount} Projects)
                  </Link>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Brochure, Floor Plan & Unit Availability Request Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <EnquiryForm
              context="brochure"
              heading={`Request ${project.name} Brochure & Floor Plans`}
              subheading={`Receive the official ${project.developer} brochure, masterplan PDF, payment schedule, and live unit availability.`}
              propertyRef={`OFFPLAN-${project.slug.toUpperCase().slice(0, 12)}`}
              propertyTitle={`${project.name} by ${project.developer}`}
              community={project.community}
              developer={project.developer}
            />
          </div>
        </div>

        {/* Related Off-Plan Projects */}
        {relatedProjects.length > 0 && (
          <section className="mt-16 border-t border-[#e6dfd2] pt-14">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94652c]">
                  Compare Alternative Releases
                </p>
                <h2 className="mt-1 font-serif text-3xl font-semibold text-[#0f2244]">
                  Related Projects by {project.developer} & in {project.community}
                </h2>
              </div>
              <Link href="/off-plan" className="text-xs font-semibold text-[#94652c] hover:underline">
                View All 108 Projects →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/off-plan/${rel.slug}`}
                  className="group overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white transition hover:border-[#94652c]/40"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-[#0f2244]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#dcb888]">
                      {rel.developer}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-semibold text-[#0f2244] group-hover:text-[#94652c]">
                      {rel.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#5f6a82]">{rel.community}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-[#39455a]">{rel.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
