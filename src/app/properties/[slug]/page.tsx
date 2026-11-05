import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LISTINGS, getListingBySlug } from "@/lib/listings";
import { PropertyDetailClient } from "@/components/site/property-detail-client";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, buildMeta } from "@/lib/seo";
import { SITE } from "@/lib/swk";

export function generateStaticParams() {
  return LISTINGS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) {
    return buildMeta({
      title: "Property Not Found",
      description: "Browse verified Dubai real estate listings with SWK Properties.",
      path: "/properties",
    });
  }

  return buildMeta({
    title: `${listing.title} (${listing.community}) | AED ${listing.priceAed.toLocaleString("en-US")}`,
    description: `${listing.subtitle}. Ref ${listing.reference}, DLD Trakheesi Permit #${listing.dld.permitNumber}. Contact SWK Properties (RERA ORN ${SITE.reraOrn}).`,
    path: `/properties/${listing.slug}`,
    image: listing.images[0],
    keywords: [
      listing.title,
      listing.community,
      listing.building,
      listing.developer,
      `Dubai ${listing.propertyType} for ${listing.purpose}`,
      `DLD Permit ${listing.dld.permitNumber}`,
    ],
  });
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const similarListings = LISTINGS.filter(
    (item) =>
      item.slug !== listing.slug &&
      (item.communitySlug === listing.communitySlug || item.purpose === listing.purpose)
  ).slice(0, 3);

  const realEstateListingLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.subtitle,
    url: `${SITE.url}/properties/${listing.slug}`,
    image: listing.images.map((img) => `${SITE.url}${img}`),
    datePosted: listing.listedAt,
    identifier: listing.reference,
    offers: {
      "@type": "Offer",
      priceCurrency: "AED",
      price: listing.priceAed,
      availability:
        listing.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.building,
      addressLocality: listing.community,
      addressRegion: "Dubai",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: listing.lat,
      longitude: listing.lng,
    },
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Properties", path: "/properties" },
            { name: listing.community, path: `/communities/${listing.communitySlug}` },
            { name: listing.title, path: `/properties/${listing.slug}` },
          ]),
          realEstateListingLd,
        ]}
      />
      <PropertyDetailClient listing={listing} similarListings={similarListings} />
    </>
  );
}
