import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { getServicePage, servicePages } from "@/lib/services";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, buildMeta, faqLd, serviceLd } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = getServicePage(slug);
  if (!svc) {
    return buildMeta({
      title: "Service Not Found",
      description: "Explore SWK Properties real estate services in Dubai.",
      path: "/services",
    });
  }

  return buildMeta({
    title: `${svc.title} in Dubai | Process, Scope & Fees`,
    description: `${svc.tagline}. ${svc.description}`,
    path: `/services/${svc.slug}`,
    image: svc.heroImage,
    keywords: [
      svc.title,
      `${svc.shortTitle} Dubai`,
      `SWK Properties ${svc.shortTitle}`,
      "RERA licensed brokerage Dubai",
    ],
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = getServicePage(slug);
  if (!svc) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: svc.title, path: `/services/${svc.slug}` },
          ]),
          serviceLd({
            name: svc.title,
            description: svc.description,
            slug: svc.slug,
          }),
          faqLd(svc.faqs),
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#5f6a82]">
          <Link href="/" className="hover:text-[#94652c]">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#94652c]">Services</Link>
          <span>/</span>
          <span className="text-[#94652c]">{svc.shortTitle}</span>
        </nav>

        {/* §12 Service Header */}
        <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#94652c]/35 bg-[#f6ead7] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#94652c]">
                <ShieldCheck className="h-4 w-4" />
                SWK Practice Area · RERA ORN {SITE.reraOrn}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-semibold text-[#0f2244]">
                {svc.title}
              </h1>
              <p className="text-base md:text-lg font-medium text-[#94652c]">{svc.tagline}</p>
              <p className="text-sm md:text-base text-[#39455a] leading-relaxed">
                {svc.description}
              </p>
            </div>
            <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-[#e6dfd2]">
              <img
                src={svc.heroImage}
                alt={svc.title}
                className="h-64 md:h-80 w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* §12 Who It Is For + What Is Included + Fee Transparency */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6">
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244] flex items-center gap-2">
              <Users className="h-5 w-5 text-[#94652c]" />
              Who This Service Is For
            </h2>
            <ul className="mt-4 space-y-3 text-xs md:text-sm text-[#39455a]">
              {svc.whoItIsFor.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f2244]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[#e6dfd2] bg-white p-6">
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244] flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              What Is Included
            </h2>
            <ul className="mt-4 space-y-3 text-xs md:text-sm text-[#39455a]">
              {svc.whatIsIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#94652c] mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[#94652c]/35 bg-[#16140f] p-6">
            <h2 className="font-serif text-2xl font-semibold text-[#0f2244] flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#94652c]" />
              Fee & Regulatory Transparency (§12)
            </h2>
            <p className="mt-4 text-xs md:text-sm text-[#39455a] leading-relaxed">
              {svc.feeTransparency}
            </p>
            <div className="mt-5 rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-3.5 text-xs text-[#94652c]">
              No hidden retainers. All third-party government fees (DLD, Trustee, Ejari, NOC) are receipted directly at official tariff rates.
            </div>
          </div>
        </section>

        {/* §12 Step-by-Step Process */}
        <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#94652c]">
            Documented Workflow
          </p>
          <h2 className="mt-1 font-serif text-3xl md:text-4xl font-semibold text-[#0f2244]">
            Step-by-Step {svc.shortTitle} Process
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-5">
            {svc.steps.map((st, idx) => (
              <div
                key={st.title}
                className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2244] text-xs font-bold text-white">
                    0{idx + 1}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-[#0f2244]">
                    {st.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#39455a] leading-relaxed">{st.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* §12 Service FAQs */}
        <section className="rounded-3xl border border-[#e6dfd2] bg-white p-6 md:p-10">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0f2244]">
            Frequently Asked Questions: {svc.shortTitle}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {svc.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-[#e6dfd2] bg-[#faf7f2] p-5">
                <h3 className="font-serif text-lg font-semibold text-[#94652c]">{f.q}</h3>
                <p className="mt-2 text-xs md:text-sm text-[#39455a] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl">
          <EnquiryForm
            context={svc.slug === "property-management" || svc.slug === "leasing-rental" ? "renting-out" : "general"}
            heading={svc.ctaLabel}
            subheading={`Speak directly with our ${svc.shortTitle} desk at Al Saqr Business Tower, Sheikh Zayed Road.`}
          />
        </section>
      </div>
    </>
  );
}
