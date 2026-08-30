import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { AMOUNTS, CURRENCIES, CURRENCY_CODES, MAJOR, amountSlug, pairSlug } from "@/lib/fx";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const TITLE = "Currency Converter & Live Exchange Rates";
const DESCRIPTION = `Live mid-market exchange rates for ${CURRENCY_CODES.length} currencies — USD, EUR, JPY, GBP, KRW, CNY and more — with converters, conversion tables and 30-day trends.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/convert" },
  openGraph: { type: "website", siteName: "PNL404", title: TITLE, description: DESCRIPTION, url: "/convert" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ConvertDirectory() {
  const popular: [string, string][] = [
    ["USD", "KRW"], ["USD", "JPY"], ["USD", "EUR"], ["USD", "GBP"], ["USD", "CNY"], ["USD", "INR"], ["USD", "CAD"], ["USD", "AUD"],
    ["EUR", "USD"], ["GBP", "USD"], ["JPY", "KRW"], ["KRW", "USD"], ["JPY", "USD"], ["EUR", "GBP"], ["EUR", "JPY"], ["CNY", "KRW"],
    ["USD", "MXN"], ["USD", "BRL"], ["USD", "TRY"], ["USD", "VND"], ["USD", "PHP"], ["USD", "THB"], ["USD", "IDR"], ["USD", "TWD"],
  ];
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
            { "@type": "ListItem", position: 2, name: "Currencies", item: `${SITE_URL}/convert` },
          ],
        }}
      />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">Currency Converter</h1>
          <p className="quote-sub">{CURRENCY_CODES.length} currencies · live mid-market rates</p>
        </div>
      </div>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Popular Pairs</h2>
        </div>
        <div className="pair-grid">
          {popular.map(([b, q]) => (
            <Link className="pair-link" key={`${b}${q}`} href={`/convert/${pairSlug(b, q)}`}>
              {b} → {q}
            </Link>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">Popular Amounts</h2>
        </div>
        <div className="pair-grid">
          {[["USD", "KRW"], ["USD", "JPY"], ["USD", "EUR"], ["JPY", "KRW"], ["KRW", "USD"], ["EUR", "USD"]].flatMap(([b, q]) =>
            [100, 1000, 10000].map((a) => (
              <Link className="pair-link" key={`${a}${b}${q}`} href={`/convert/${amountSlug(a, b, q)}`}>
                {a.toLocaleString("en-US")} {b} to {q}
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">All Currencies</h2>
          <span className="kicker-note">Each page lists every pair for that currency</span>
        </div>
        <div className="table-scroll">
          <table className="mkt">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Currency</th>
                <th style={{ textAlign: "left" }}>Code</th>
                <th style={{ textAlign: "left" }}>Used in</th>
                <th style={{ textAlign: "left" }}>Rates</th>
              </tr>
            </thead>
            <tbody>
              {CURRENCY_CODES.map((code) => {
                const cur = CURRENCIES[code];
                return (
                  <tr key={code}>
                    <td style={{ textAlign: "left" }}>
                      <Link className="qlink" href={`/convert/${code.toLowerCase()}`}>
                        <span className="cell-name">{cur.name}</span>
                      </Link>
                    </td>
                    <td style={{ textAlign: "left" }}>{code} · {cur.symbol}</td>
                    <td style={{ textAlign: "left" }}>{cur.countries}</td>
                    <td style={{ textAlign: "left" }}>
                      {MAJOR.filter((q) => q !== code).slice(0, 4).map((q, i) => (
                        <span key={q}>
                          {i > 0 && " · "}
                          <Link className="statline-link" href={`/convert/${pairSlug(code, q)}`}>{code}/{q}</Link>
                        </span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">About These Rates</h2>
        </div>
        <p>
          Every rate on PNL404 is the live mid-market rate — the midpoint between the global buy and sell prices — and pages
          refresh continuously during FX trading hours. Each pair page includes a two-way converter, a 30-day trend and a
          conversion table for {AMOUNTS.length} common amounts, and every amount from {AMOUNTS[0]} to {AMOUNTS[AMOUNTS.length - 1].toLocaleString("en-US")} has its own page.
          Banks and transfer services add a margin on top of the mid-market rate, so treat these figures as the benchmark to
          compare offers against.
        </p>
      </section>

      <footer className="colophon">
        <p className="fine">
          Rates are mid-market, may be delayed, and are provided for information only. © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
