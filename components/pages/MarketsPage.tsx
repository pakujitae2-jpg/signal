import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import LangNav from "@/components/LangNav";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import { fmtCompactUsd, fmtNum, fmtSigned, fmtTime } from "@/lib/format";
import { languageAlternates, prefix, type Lang } from "@/lib/i18n";
import { getMarketData } from "@/lib/market";
import { localName } from "@/lib/names";
import { marketsCryptoCopy, marketsEquityCopy, marketsMeta, type RegionKey } from "@/lib/page-copy";
import type { MarketData, Quote } from "@/lib/types";

export function marketsMetadata(lang: Lang, region: RegionKey): Metadata {
  const c = marketsMeta(lang, region);
  const path = `/markets/${region}`;
  const canonical = `${prefix(lang)}${path}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: { type: "website", siteName: "PNL404", title: c.title, description: c.description, url: canonical },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
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

export async function MarketsPage({ lang, region }: { lang: Lang; region: RegionKey }) {
  const p = prefix(lang);
  const path = `/markets/${region}`;
  const data = await getMarketData();
  const meta = marketsMeta(lang, region);
  const isCrypto = region === "crypto";
  const partners = AFFILIATES.filter((x) => x.category === (isCrypto ? "Crypto Exchanges" : "Brokerages")).slice(0, 3);
  const quoteHref = (symbol: string) => `${p}/quote/${encodeURIComponent(symbol)}`;
  const label = (symbol: string, fallback: string) => localName(lang, symbol, fallback);

  return (
    <div className="paper">
      <LangNav lang={lang} path={path} />

      <div className="quote-head">
        <div>
          <h1 className="quote-name">{meta.h1}</h1>
          <p className="quote-sub">{meta.sub} · {fmtTime(data.updatedAt)} UTC</p>
        </div>
      </div>

      {isCrypto ? (
        (() => {
          const c = marketsCryptoCopy(lang);
          return (
            <section className="block">
              <div className="kicker">
                <h2 className="kicker-label">{c.overview}</h2>
              </div>
              {data.cryptoGlobal && (
                <p className="statline">
                  {c.totalMarketCap} <b>{fmtCompactUsd(data.cryptoGlobal.totalMarketCapUsd)}</b>{" "}
                  <Chg pct={data.cryptoGlobal.changePct24h} /> · {c.btcDominance}{" "}
                  <b>{data.cryptoGlobal.btcDominance.toFixed(1)}%</b> ·{" "}
                  <Link className="statline-link" href={`${p}/kimchi-premium`}>{c.kimchiLinkText}</Link>
                </p>
              )}
              <div className="table-scroll">
                <table className="mkt">
                  <thead>
                    <tr>
                      <th>{c.colRank}</th>
                      <th style={{ textAlign: "left" }}>{c.colName}</th>
                      <th>{c.colPrice}</th>
                      <th>{c.col24h}</th>
                      <th>{c.colMktCap}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.crypto.map((coin) => (
                      <tr key={coin.id}>
                        <td style={{ textAlign: "left", color: "var(--ink-3)" }}>{coin.rank}</td>
                        <td style={{ textAlign: "left" }}>
                          <Link className="qlink" href={quoteHref(`${coin.symbol}-USD`)}>
                            <span className="cell-name">{label(`${coin.symbol}-USD`, coin.name)}</span>
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
          );
        })()
      ) : (
        (() => {
          const c = marketsEquityCopy(lang, region);
          const { boardQuotes, stocks } = regionQuotes(region, data);
          return (
            <>
              <section className="block">
                <div className="kicker">
                  <h2 className="kicker-label">{c.benchmarks}</h2>
                </div>
                <div className="board">
                  {boardQuotes.map((q) => (
                    <Link className="board-cell" key={q.symbol} href={quoteHref(q.symbol)}>
                      <span className="b-name">{label(q.symbol, q.name)}</span>
                      <span className="b-value">{fmtNum(q.price)}</span>
                      <div className="b-foot">
                        <Chg pct={q.changePct} />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
              <section className="block">
                <div className="kicker">
                  <h2 className="kicker-label">{c.topStocks}</h2>
                  <span className="kicker-note">{c.topStocksNote}</span>
                </div>
                <div className="table-scroll">
                  <table className="mkt">
                    <thead>
                      <tr>
                        <th>{c.colCompany}</th>
                        <th>{c.colLast}</th>
                        <th>{c.colChg}</th>
                        <th>{c.colChgPct}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map((q) => (
                        <tr key={q.symbol}>
                          <td>
                            <Link className="qlink" href={quoteHref(q.symbol)}>
                              <span className="cell-name">{label(q.symbol, q.name)}</span>
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
              </section>
            </>
          );
        })()
      )}

      <section className="block prose">
        <div className="kicker">
          <h2 className="kicker-label">{meta.aboutHeading}</h2>
        </div>
        <p>{meta.aboutP1}</p>
        <p>{meta.aboutP2}</p>
      </section>

      <AdSlot slot="0000000005" format="leaderboard" />

      <section className="block">
        <div className="kicker">
          <h2 className="kicker-label">{meta.tradeHeading}</h2>
          <span className="kicker-note">{meta.partnerOffers}</span>
        </div>
        {partners.map((x) => (
          <a className="p-row" key={x.name} href={x.url} target="_blank" rel="noopener noreferrer sponsored">
            <span className="p-main">
              <span className="p-name">{x.name}</span>
              <span className="p-desc">{x.desc}</span>
            </span>
            <span className="p-arrow" aria-hidden="true">→</span>
          </a>
        ))}
        <p className="fineprint">{AFFILIATE_DISCLOSURE}</p>
      </section>

      <footer className="colophon">
        <p className="fine">{meta.footer} © {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
  );
}
