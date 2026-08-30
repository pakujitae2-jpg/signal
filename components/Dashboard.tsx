"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import type { HomeCopy } from "@/lib/home-copy";
import type { CryptoCoin, MarketData, NewsItem, Quote } from "@/lib/types";
import { fmtAgo, fmtCompactUsd, fmtDate, fmtNum, fmtSigned, fmtTime } from "@/lib/format";
import { useCryptoStream, type LiveTick } from "@/lib/useCryptoStream";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import AdSlot from "./AdSlot";
import RakutenAd from "./RakutenAd";

const REFRESH_MS = 30_000;

// Localized symbol names and the locale path prefix arrive from the server:
// importing the 550-entry name table into this client bundle would ship it to
// every visitor.
type Ctx = { t: HomeCopy; p: string; names: Record<string, string> };

const Ctx = createContext<Ctx>({ t: {} as HomeCopy, p: "", names: {} });
const useCtx = () => useContext(Ctx);

function useQuoteHref() {
  const { p } = useCtx();
  return (symbol: string) => `${p}/quote/${encodeURIComponent(symbol)}`;
}

/** Localized name for a symbol, falling back to the feed's own name. */
function useName() {
  const { names } = useCtx();
  return (symbol: string, fallback: string) => names[symbol] ?? fallback;
}

/* ---------- Change value (arrow + sign accompany color, so direction never relies on color alone) ---------- */

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

/* ---------- Sparkline (decorative; the value and change are printed beside it) ---------- */

function Sparkline({ data, pct, w = 76, h = 26 }: { data?: number[]; pct: number | null; w?: number; h?: number }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const pts = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const color = pct === null || Math.abs(pct) <= 0.005 ? "var(--flat)" : pct > 0 ? "var(--up)" : "var(--down)";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Pieces ---------- */

function EquitiesBlock({ title, venue, index, stocks }: { title: string; venue: string; index?: Quote; stocks: Quote[] }) {
  const { t } = useCtx();
  const quoteHref = useQuoteHref();
  const name = useName();
  return (
    <div className="mkt-block">
      <div className="mkt-head">
        <span className="mkt-title">
          {title}
          <span className="mkt-venue">{venue}</span>
        </span>
        {index && (
          <Link className="mkt-idx" href={quoteHref(index.symbol)}>
            {index.name} <b>{fmtNum(index.price)}</b> <Chg pct={index.changePct} />
          </Link>
        )}
      </div>
      <div className="table-scroll">
        <table className="mkt">
          <thead>
            <tr>
              <th>{t.colCompany}</th>
              <th>{t.colLast}</th>
              <th>{t.colChg}</th>
              <th>{t.colChgPct}</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((q) => (
              <tr key={q.symbol}>
                <td>
                  <Link className="qlink" href={quoteHref(q.symbol)}>
                    <span className="cell-name">{name(q.symbol, q.name)}</span>
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
    </div>
  );
}

function CryptoTable({ coins, live }: { coins: CryptoCoin[]; live: Record<string, LiveTick> }) {
  const { t } = useCtx();
  const quoteHref = useQuoteHref();
  const name = useName();
  return (
    <div className="table-scroll">
      <table className="mkt">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ textAlign: "left" }}>{t.colName}</th>
            <th>{t.colPrice}</th>
            <th>24h</th>
            <th>{t.colMktCap}</th>
            <th>7d</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const tick = live[coin.symbol];
            const price = tick?.price ?? coin.price;
            const pct = tick?.changePct24h ?? coin.changePct24h;
            return (
              <tr key={coin.id}>
                <td style={{ textAlign: "left", color: "var(--ink-3)" }}>{coin.rank}</td>
                <td style={{ textAlign: "left" }}>
                  <Link className="qlink" href={quoteHref(`${coin.symbol}-USD`)}>
                    <span className="cell-name">{name(`${coin.symbol}-USD`, coin.name)}</span>
                    <span className="sym">{coin.symbol}</span>
                  </Link>
                </td>
                <td>
                  <span
                    key={tick?.seq ?? 0}
                    className={tick ? (tick.dir > 0 ? "tick tick-up" : tick.dir < 0 ? "tick tick-down" : "tick") : undefined}
                  >
                    {fmtNum(price, "USD")}
                  </span>
                </td>
                <td>
                  <Chg pct={pct} />
                </td>
                <td>{fmtCompactUsd(coin.marketCap)}</td>
                <td>
                  <Sparkline data={coin.spark} pct={pct} w={64} h={22} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function newsCatLabel(t: HomeCopy, cat: NewsItem["category"]): string {
  return cat === "crypto" ? t.newsCatCrypto : cat === "stock" ? t.newsCatStock : t.newsCatEconomy;
}

/* ---------- Front page ---------- */

export default function Dashboard({
  initialData,
  t,
  lang,
  names,
}: {
  initialData: MarketData;
  t: HomeCopy;
  lang: string;
  names: Record<string, string>;
}) {
  const p = lang === "en" ? "" : `/${lang}`;
  const quoteHref = (symbol: string) => `${p}/quote/${encodeURIComponent(symbol)}`;
  const name = (symbol: string, fallback: string) => names[symbol] ?? fallback;
  const [data, setData] = useState<MarketData>(initialData);
  const [now, setNow] = useState<number | null>(null); // relative times render only after mount (hydration-safe)
  const { live, connected } = useCryptoStream(data.crypto);

  useEffect(() => {
    let stopped = false;

    async function refresh() {
      try {
        const res = await fetch("/api/market");
        if (res.ok) {
          const next = (await res.json()) as MarketData;
          if (!stopped) setData(next);
        }
      } catch {
        // keep showing the previous data on transient failures
      }
    }

    const poll = setInterval(refresh, REFRESH_MS);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    setNow(Date.now());

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      clearInterval(poll);
      clearInterval(clock);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const { regions, fx, commodities, crypto, cryptoGlobal, news, sources } = data;
  const allIndices = [...regions.us.indices, ...regions.jp.indices, ...regions.kr.indices];
  const hasSample = Object.values(sources).includes("sample");
  const sampleParts = [
    sources.quotes === "sample" && t.samplePartQuotes,
    sources.crypto === "sample" && t.samplePartCrypto,
    sources.news === "sample" && t.samplePartNews,
  ].filter(Boolean);

  const tickerItems: { key: string; name: string; value: string; pct: number | null }[] = [
    ...allIndices.map((q) => ({ key: q.symbol, name: name(q.symbol, q.name), value: fmtNum(q.price), pct: q.changePct })),
    ...fx.map((q) => ({ key: q.symbol, name: name(q.symbol, q.name), value: fmtNum(q.price), pct: q.changePct })),
    ...crypto.slice(0, 2).map((coin) => {
      const tick = live[coin.symbol];
      return {
        key: coin.id,
        name: coin.symbol,
        value: fmtNum(tick?.price ?? coin.price, "USD"),
        pct: tick?.changePct24h ?? coin.changePct24h,
      };
    }),
  ];

  const partnerCategories = Array.from(new Set(AFFILIATES.map((p) => p.category)));

  return (
    <Ctx.Provider value={{ t, p, names }}>
    <div className="paper">
      <header className="masthead">
        <h1 className="wordmark">PNL<span className="wm-404">404</span></h1>
        <p className="tagline">{t.tagline}</p>
      </header>

      <div className="dateline">
        <span>{fmtDate(data.updatedAt)}</span>
        <span className="dateline-status">
          <span className={`status-dot${hasSample ? " sample" : ""}`} aria-hidden="true" />
          {t.updated.replace("{time}", fmtTime(data.updatedAt))}
          {now !== null && ` · ${fmtAgo(data.updatedAt, now)}`}
        </span>
      </div>

      <nav className="topnav" aria-label={t.navAria}>
        <Link href={`${p}/markets/us`}>{t.navUs}</Link>
        <Link href={`${p}/markets/japan`}>{t.navJapan}</Link>
        <Link href={`${p}/markets/korea`}>{t.navKorea}</Link>
        <Link href={`${p}/markets/crypto`}>{t.navCrypto}</Link>
        <Link href={`${p}/kimchi-premium`}>{t.navKimchi}</Link>
        <Link href={`${p}/fear-greed`}>{t.navFearGreed}</Link>
        <Link href={`${p}/convert`}>{t.navCurrencies}</Link>
        <Link href={`${p}/movers`}>{t.navMovers}</Link>
        <Link href={`${p}/compare`}>{t.navCompare}</Link>
        <Link href={`${p}/tools/invested`}>{t.navInvested}</Link>
        <Link href={`${p}/quotes`}>{t.navQuotes}</Link>
        <Link href={`${p}/search`}>{t.navSearch}</Link>
      </nav>

      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span className="ticker-item" key={`${item.key}-${i}`}>
              <span className="t-name">{item.name}</span>
              <span>{item.value}</span>
              <Chg pct={item.pct} />
            </span>
          ))}
        </div>
      </div>

      {hasSample && (
        <p className="wire-note">{t.sampleNote.replace("{parts}", sampleParts.join(", "))}</p>
      )}

      <AdSlot slot="0000000001" format="leaderboard" />

      <div className="sheet">
        <main className="col-main">
          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{t.glanceHeading}</h2>
              <span className="kicker-note">US · Japan · Korea benchmarks</span>
            </div>
            <div className="board">
              {allIndices.map((q) => (
                <Link className="board-cell" key={q.symbol} href={quoteHref(q.symbol)}>
                  <span className="b-name">{name(q.symbol, q.name)}</span>
                  <span className="b-value">{fmtNum(q.price)}</span>
                  <div className="b-foot">
                    <Chg pct={q.changePct} />
                    <Sparkline data={q.spark} pct={q.changePct} />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{t.cryptoHeading}</h2>
              <span className="kicker-note">
                {connected ? (
                  <>
                    <span className="live-badge">● LIVE</span> · {t.cryptoLiveNote}
                  </>
                ) : (
                  t.cryptoStaticNote
                )}
              </span>
            </div>
            {cryptoGlobal && (
              <p className="statline">
                {t.totalMarketCap} <b>{fmtCompactUsd(cryptoGlobal.totalMarketCapUsd)}</b>{" "}
                <Chg pct={cryptoGlobal.changePct24h} /> {t.change24h} · {t.btcDominance}{" "}
                <b>{cryptoGlobal.btcDominance.toFixed(1)}%</b> ·{" "}
                <Link className="statline-link" href={`${p}/kimchi-premium`}>
                  {t.kimchiLink}
                </Link>{" "}
                ·{" "}
                <Link className="statline-link" href={`${p}/fear-greed`}>
                  {t.fearGreedLink} →
                </Link>
              </p>
            )}
            <CryptoTable coins={crypto} live={live} />
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{t.equitiesHeading}</h2>
              <span className="kicker-note">{t.equitiesNote}</span>
            </div>
            <EquitiesBlock title={t.regionUsTitle} venue={t.regionUsVenue} index={regions.us.indices[0]} stocks={regions.us.stocks} />
            <EquitiesBlock title={t.regionJapanTitle} venue={t.regionJapanVenue} index={regions.jp.indices[0]} stocks={regions.jp.stocks} />
            <EquitiesBlock title={t.regionKoreaTitle} venue={t.regionKoreaVenue} index={regions.kr.indices[0]} stocks={regions.kr.stocks} />
          </section>

          <RakutenAd />

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">{t.fxHeading}</h2>
              <span className="kicker-note">
                <Link className="statline-link" href={`${p}/convert`}>
                  {t.fxNote} →
                </Link>
              </span>
            </div>
            <div className="board">
              {[...fx, ...commodities].map((q) => (
                <Link className="board-cell" key={q.symbol} href={quoteHref(q.symbol)}>
                  <span className="b-name">{name(q.symbol, q.name)}</span>
                  <span className="b-value">{fmtNum(q.price, q.symbol.endsWith("=F") ? q.currency : undefined)}</span>
                  <div className="b-foot">
                    <Chg pct={q.changePct} />
                    <Sparkline data={q.spark} pct={q.changePct} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <aside className="col-rail">
          <section className="rail-mod">
            <div className="kicker">
              <h2 className="kicker-label">{t.newsHeading}</h2>
            </div>
            <div className="news-list">
              {news.map((item, i) => (
                <a className="news-item" key={`${item.link}-${i}`} href={item.link} target="_blank" rel="noopener noreferrer">
                  <span className="news-title">{item.title}</span>
                  <span className="news-meta">
                    {newsCatLabel(t, item.category)} · {item.source} ·{" "}
                    {now !== null ? fmtAgo(item.publishedAt, now) : `${fmtTime(item.publishedAt)} UTC`}
                  </span>
                </a>
              ))}
            </div>
          </section>

          <AdSlot slot="0000000002" format="rectangle" />

          <section className="rail-mod">
            <div className="kicker">
              <h2 className="kicker-label">{t.tradeHeading}</h2>
            </div>
            {partnerCategories.map((cat) => (
              <div key={cat}>
                <p className="p-cat">{cat}</p>
                {AFFILIATES.filter((p) => p.category === cat).map((p) => (
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
              </div>
            ))}
            <p className="fineprint">{AFFILIATE_DISCLOSURE}</p>
          </section>
        </aside>
      </div>

      <footer className="colophon">
        <p>
          <b>PNL404</b> — US, Japanese and Korean equities, crypto, FX and commodities on one page. Crypto streams
          live; everything else refreshes every 30 seconds. The prices are real — the profits are 404.
        </p>
        <p className="fine">
          Market data may be delayed and is provided for information only, not investment advice. Sources: Yahoo
          Finance, CoinGecko, Binance stream, publisher RSS feeds.
        </p>
        <p className="fine">© {new Date().getFullYear()} PNL404</p>
      </footer>
    </div>
    </Ctx.Provider>
  );
}
