import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { GROUPS, GROUP_LABEL, UNIVERSE, byGroup } from "@/lib/universe";

export const dynamic = "force-static";

const TITLE = "All Quotes — Stocks, Indices, Crypto, FX & Commodities";
const DESCRIPTION = `Live price pages for ${UNIVERSE.length} symbols: US, Japanese and Korean stocks, ETFs, world indices, cryptocurrencies, currency pairs and commodities.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/quotes" },
  openGraph: { type: "website", siteName: "PNL404", title: TITLE, description: DESCRIPTION, url: "/quotes" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function QuotesDirectory() {
  return (
    <div className="paper">
      <header className="subhead">
        <Link className="crumb" href="/">← PNL404</Link>
        <span className="subhead-note">Profit Not Found</span>
      </header>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "PNL404", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Quotes", item: `${SITE_URL}/quotes` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">All Quotes</h1>
          <p className="quote-sub">{UNIVERSE.length} symbols · live price, chart and key stats for each</p>
        </div>
      </div>

      <nav className="topnav" aria-label="Sections">
        {GROUPS.map((g) => (
          <Link key={g} href={`#${g}`}>{GROUP_LABEL[g]}</Link>
        ))}
      </nav>

      {GROUPS.map((g) => {
        const list = byGroup(g);
        return (
          <section className="block" key={g} id={g}>
            <div className="kicker">
              <h2 className="kicker-label">{GROUP_LABEL[g]}</h2>
              <span className="kicker-note">{list.length} symbols</span>
            </div>
            <div className="pair-grid">
              {list.map((e) => (
                <Link className="pair-link" key={e.symbol} href={`/quote/${encodeURIComponent(e.symbol)}`}>
                  {e.name}
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <footer className="colophon">
        <p className="fine">
          Market data may be delayed and is provided for information only, not investment advice. © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
