import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { fmtAgo, fmtCompactUsd, fmtNum, fmtSigned, fmtTime } from "@/lib/format";
import { getMarketData } from "@/lib/market";
import type { MarketData, Quote } from "@/lib/types";

export const dynamic = "force-dynamic";

type RegionKey = "us" | "japan" | "korea" | "crypto";

const REGIONS: Record<
  RegionKey,
  {
    title: string;
    h1: string;
    sub: string;
    description: string;
    partnerCategory: "Brokerages" | "Crypto Exchanges";
    intro: string[];
  }
> = {
  us: {
    title: "US Stock Market Today",
    h1: "U.S. Markets",
    sub: "NYSE · Nasdaq · S&P 500, Nasdaq Composite, Dow Jones",
    description:
      "US stock market today: live S&P 500, Nasdaq and Dow Jones levels with top large-cap stocks, updated continuously.",
    partnerCategory: "Brokerages",
    intro: [
      "The US session runs 9:30 a.m. to 4:00 p.m. Eastern Time, Monday through Friday, with pre-market and after-hours trading around it. The S&P 500 tracks 500 large US companies and is the benchmark most professionals quote; the Nasdaq Composite leans heavily toward technology; the Dow Jones Industrial Average follows 30 blue chips and is the oldest of the three.",
      "The table below follows the mega-cap names that drive most of the index moves. Click any company for its live chart and key stats.",
    ],
  },
  japan: {
    title: "Japan Stock Market Today",
    h1: "Japan Markets",
    sub: "Tokyo Stock Exchange · Nikkei 225",
    description:
      "Japan stock market today: live Nikkei 225 level, USD/JPY, and Japan's biggest stocks — Toyota, Sony, SoftBank and more.",
    partnerCategory: "Brokerages",
    intro: [
      "The Tokyo Stock Exchange trades 9:00–11:30 a.m. and 12:30–3:30 p.m. Japan Standard Time. The Nikkei 225 is the headline index — price-weighted, so high-priced stocks move it most. Because so many constituents are exporters, the index often moves opposite the yen: a weaker yen tends to lift Japanese equities.",
      "The table below follows Japan's most-watched large caps. Click any company for its live chart and key stats.",
    ],
  },
  korea: {
    title: "Korea Stock Market Today",
    h1: "Korea Markets",
    sub: "Korea Exchange · KOSPI · KOSDAQ",
    description:
      "Korea stock market today: live KOSPI and KOSDAQ levels, USD/KRW, and Korea's biggest stocks — Samsung Electronics, SK Hynix and more.",
    partnerCategory: "Brokerages",
    intro: [
      "The Korea Exchange trades 9:00 a.m. to 3:30 p.m. Korea Standard Time. The KOSPI covers the main board's large caps, while the KOSDAQ lists smaller growth and technology companies. Semiconductors dominate: Samsung Electronics and SK Hynix alone account for a large share of the market's value, so Korean equities often track the global chip cycle.",
      "The table below follows the KOSPI's heavyweights. Click any company for its live chart and key stats.",
    ],
  },
  crypto: {
    title: "Crypto Market Today",
    h1: "Crypto Markets",
    sub: "Top coins by market cap · 24/7",
    description:
      "Crypto market today: live prices and market caps for Bitcoin, Ethereum and the top coins, total market cap, BTC dominance and the kimchi premium.",
    partnerCategory: "Crypto Exchanges",
    intro: [
      "Crypto never closes — prices trade around the clock, every day of the year. Total market capitalization and Bitcoin dominance (Bitcoin's share of that total) are the two quickest reads on where the market stands: rising dominance usually means money is favoring Bitcoin over altcoins.",
      "Prices on this page stream live on the front page and refresh continuously here. For the gap between Korean and global prices, see the kimchi premium tracker.",
    ],
  },
};

const SLUGS = Object.keys(REGIONS) as RegionKey[];

type Props = { params: Promise<{ region: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const conf = REGIONS[region as RegionKey];
  if (!conf) return { title: "PNL404" };
  const canonical = `/markets/${region}`;
  return {
    title: conf.title,
    description: conf.description,
    alternates: { canonical },
    openGraph: { type: "website", siteName: "PNL404", title: conf.title, description: conf.description, url: canonical },
    twitter: { card: "summary_large_image", title: conf.title, description: conf.description },
  };
}

function Chg({ pct }: { pct: number | null }) {
  if (pct === null || !isFinite(pct)) return <span className="chg flat">—</span>;
  const dir = pct > 0.005 ? "up" : pct < -0.005 ? "down" : "flat";
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "–";
  return (
    <span className={`chg ${dir}`}>
      {arrow} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

function chgClass(v: number | null): string {
  if (v === null || !isFinite(v) || Math.abs(v) <= 0.005) return "chg flat";
  return v > 0 ? "chg up" : "chg down";
}

function Board({ quotes, withCurrency }: { quotes: Quote[]; withCurrency?: boolean }) {
  return (
    <div className="board">
      {quotes.map((q) => (
        <Link className="board-cell" key={q.symbol} href={`/quote/${encodeURIComponent(q.symbol)}`}>
          <span className="b-name">{q.name}</span>
          <span className="b-value">{fmtNum(q.price, withCurrency ? q.currency : undefined)}</span>
          <div className="b-foot">
            <Chg pct={q.changePct} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function StockTable({ stocks }: { stocks: Quote[] }) {
  return (
    <div className="table-scroll">
      <table className="mkt">
        <thead>
          <tr>
            <th>Company</th>
            <th>Last</th>
            <th>Chg</th>
            <th>% Chg</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((q) => (
            <tr key={q.symbol}>
              <td>
                <Link className="qlink" href={`/quote/${encodeURIComponent(q.symbol)}`}>
                  <span className="cell-name">{q.name}</span>
                  <span className="sym">{q.symbol.replace(/\.(KS|T)$/, "")}</span>
                </Link>
              </td>
              <td>{fmtNum(q.price, q.currency)}</td>
              <td className={chgClass(q.change)}>{fmtSigned(q.change)}</td>
              <td>
                <Chg pct={q.changePct} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function regionQuotes(region: RegionKey, data: MarketData): { boardQuotes: Quote[]; stocks: Quote[] } {
  const fxBySymbol = (s: string) => data.fx.find((q) => q.symbol === s);
  if (region === "us") return { boardQuotes: data.regions.us.indices, stocks: data.regions.us.stocks };
  if (region === "japan") {
    const jpy = fxBySymbol("JPY=X");
    return { boardQuotes: [...data.regions.jp.indices, ...(jpy ? [jpy] : [])], stocks: data.regions.jp.stocks };
  }
  const krw = fxBySymbol("KRW=X");
  return { boardQuotes: [...data.regions.kr.indices, ...(krw ? [krw] : [])], stocks: data.regions.kr.stocks };
}

export default async function MarketPage({ params }: Props) {
  const { region: slug } = await params;
  if (!SLUGS.includes(slug as RegionKey)) notFound();
  const region = slug as RegionKey;
  const conf = REGIONS[region];
  const data = await getMarketData();
  const partners = AFFILIATES.filter((p) => p.category === conf.partnerCategory).slice(0, 3);

  return (
    <div className="paper">
      <header className="subhead">
        <Link className="crumb" href="/">
          ← PNL404
        </Link>
        <span className="subhead-note">Profit Not Found</span>
      </header>

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{conf.h1}</h1>
          <p className="quote-sub">
            {conf.sub} · updated {fmtTime(data.updatedAt)} UTC
          </p>
        </div>
      </div>

      {region === "crypto" ? (
        <>
          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">Overview</h2>
            </div>
            {data.cryptoGlobal && (
              <p className="statline">
                Total market cap <b>{fmtCompactUsd(data.cryptoGlobal.totalMarketCapUsd)}</b>{" "}
                <Chg pct={data.cryptoGlobal.changePct24h} /> (24h) · Bitcoin dominance{" "}
                <b>{data.cryptoGlobal.btcDominance.toFixed(1)}%</b> ·{" "}
                <Link className="statline-link" href="/kimchi-premium">
                  Kimchi premium →
                </Link>
              </p>
            )}
            <div className="table-scroll">
              <table className="mkt">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style={{ textAlign: "left" }}>Name</th>
                    <th>Price</th>
                    <th>24h</th>
                    <th>Mkt Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {data.crypto.map((coin) => (
                    <tr key={coin.id}>
                      <td style={{ textAlign: "left", color: "var(--ink-3)" }}>{coin.rank}</td>
                      <td style={{ textAlign: "left" }}>
                        <Link className="qlink" href={`/quote/${coin.symbol}-USD`}>
                          <span className="cell-name">{coin.name}</span>
                          <span className="sym">{coin.symbol}</span>
                        </Link>
                      </td>
                      <td>{fmtNum(coin.price, "USD")}</td>
                      <td>
                        <Chg pct={coin.changePct24h} />
                      </td>
                      <td>{fmtCompactUsd(coin.marketCap)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">Benchmarks</h2>
            </div>
            <Board quotes={regionQuotes(region, data).boardQuotes} />
          </section>
          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">Top Stocks</h2>
              <span className="kicker-note">Click a company for its chart</span>
            </div>
            <StockTable stocks={regionQuotes(region, data).stocks} />
          </section>
        </>
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">About This Market</h2>
        </div>
        {conf.intro.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </section>

      <AdSlot slot="0000000005" format="leaderboard" />

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{conf.partnerCategory === "Brokerages" ? "Trade Stocks" : "Trade Crypto"}</h2>
          <span className="kicker-note">Partner offers</span>
        </div>
        {partners.map((p) => (
          <a className="p-row" key={p.name} href={p.url} target="_blank" rel="noopener noreferrer sponsored">
            <span className="p-main">
              <span className="p-name">{p.name}</span>
              <span className="p-desc">{p.desc}</span>
            </span>
            <span className="p-arrow" aria-hidden="true">
              →
            </span>
          </a>
        ))}
        <p className="fineprint">{AFFILIATE_DISCLOSURE}</p>
      </section>

      <footer className="colophon">
        <p className="fine">
          Market data may be delayed and is provided for information only, not investment advice. © {new Date().getFullYear()} PNL404
        </p>
      </footer>
    </div>
  );
}
