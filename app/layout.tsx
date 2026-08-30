import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  title: "Signal · Global Markets at a Glance",
  description:
    "Live prices for US, Japanese and Korean stocks, top cryptocurrencies, currencies and commodities — with the latest market headlines, on a single page.",
  keywords: ["stocks", "crypto", "bitcoin", "S&P 500", "Nikkei", "KOSPI", "markets", "prices", "forex"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9f8f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Secure Privacy consent banner — loads first so it can gate cookies/trackers for EU visitors */}
        <Script
          id="secure-privacy"
          src="https://app.secureprivacy.ai/script/6a943777c62d5b186f64a970.js"
          strategy="beforeInteractive"
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
