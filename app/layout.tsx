import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import JsonLd from "@/components/JsonLd";
import { ADSENSE_CLIENT, SITE_URL } from "@/lib/site";
import "./globals.css";

const DESCRIPTION =
  "Live US, Japanese and Korean stocks, top cryptocurrencies, FX and commodities — with the latest market headlines, on a single page. Profit not found; everything else is.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PNL404 — Global Markets, One Page",
    template: "%s · PNL404",
  },
  description: DESCRIPTION,
  keywords: ["pnl404", "stocks", "crypto", "bitcoin", "S&P 500", "Nikkei", "KOSPI", "markets", "prices", "forex", "currency converter", "exchange rates"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "PNL404",
    title: "PNL404 — Global Markets, One Page",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PNL404 — Global Markets, One Page",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9f8f4",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Set by middleware from the /ko and /ja path prefixes.
  const lang = (await headers()).get("x-lang") ?? "en";
  return (
    <html lang={lang}>
      <body>
        {/* Secure Privacy consent banner — loads first so it can gate cookies/trackers for EU visitors */}
        <Script
          id="secure-privacy"
          src="https://app.secureprivacy.ai/script/6a943777c62d5b186f64a970.js"
          strategy="beforeInteractive"
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#org`,
                name: "PNL404",
                url: `${SITE_URL}/`,
                logo: `${SITE_URL}/icon.svg`,
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#site`,
                name: "PNL404",
                url: `${SITE_URL}/`,
                description: DESCRIPTION,
                publisher: { "@id": `${SITE_URL}/#org` },
              },
            ],
          }}
        />
        {children}
        {/* Google Analytics (gtag.js) */}
        <Script id="ga-lib" async src="https://www.googletagmanager.com/gtag/js?id=G-XJL3T2WE7B" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XJL3T2WE7B');`}
        </Script>
        {ADSENSE_CLIENT && (
          <Script
            id="adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
