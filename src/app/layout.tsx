import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";
import { PrefsProvider } from "@/lib/prefs";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingChrome } from "@/components/site/floating-chrome";
import { JsonLd } from "@/components/seo/json-ld";
import { KEYWORDS, organizationLd, websiteLd } from "@/lib/seo";
import { SITE } from "@/lib/swk";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Cormorant_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0f2244",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "SWK Properties | RERA Licensed Dubai Real Estate Brokerage (ORN 51517)",
    template: "%s | SWK Properties Dubai",
  },
  description:
    "SWK Properties LLC (RERA ORN 51517) is a Dubai real estate brokerage at Al Saqr Business Tower, Sheikh Zayed Road. Verified off-plan launches, ready secondary homes, residential & commercial leasing, and portfolio management across Dubai & the UAE.",
  keywords: KEYWORDS.home,
  alternates: {
    canonical: SITE.url,
    languages: {
      "en-AE": SITE.url,
      "en-GB": SITE.url,
      "en-US": SITE.url,
      "ar-AE": `${SITE.url}?lang=ar`,
      "x-default": SITE.url,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon-32.png"],
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: SITE.url,
    siteName: SITE.name,
    title: "SWK Properties | RERA Licensed Dubai Real Estate Brokerage (ORN 51517)",
    description:
      "Verified off-plan developer launches, DLD Trakheesi-permitted secondary properties, and Ejari leasing from Sheikh Zayed Road, Dubai.",
    images: [
      {
        url: `${SITE.url}/img/hero/dubai-skyline-hero.webp`,
        width: 1200,
        height: 630,
        alt: "SWK Properties Dubai Skyline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SWK Properties | Dubai Real Estate Advisory (RERA ORN 51517)",
    description:
      "Off-plan launches, secondary market sales, and leasing across Downtown Dubai, Palm Jumeirah, Dubai Marina & Dubai Hills.",
    images: [`${SITE.url}/img/hero/dubai-skyline-hero.webp`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-clip">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} ${raleway.variable} min-h-screen overflow-x-clip bg-[#faf7f2] text-[#0f2244] antialiased selection:bg-[#0f2244] selection:text-white`}
      >
        <JsonLd data={[organizationLd, websiteLd]} />
        <PrefsProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-[#0f2244] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" className="min-h-[70vh] pb-20">
            {children}
          </main>
          <SiteFooter />
          <FloatingChrome />
        </PrefsProvider>
      </body>
    </html>
  );
}
