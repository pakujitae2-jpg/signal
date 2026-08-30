"use client";

import { useEffect, useState } from "react";
import type { CryptoCoin, MarketData, NewsItem, Quote } from "@/lib/types";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import AdSlot from "./AdSlot";

const REFRESH_MS = 30_000;

/* ---------- Formatters (locale/timezone pinned so SSR and client agree) ---------- */

const CURRENCY_SIGN: Record<string, string> = { KRW: "₩", JPY: "¥", USD: "$" };

function fmtNum(v: number | null, currency?: string): string {
  if (v === null || !isFinite(v)) return "—";
  const abs = Math.abs(v);
  const digits = abs >= 10000 ? 0 : abs >= 1 ? 2 : 4;
  const s = v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return currency ? `${CURRENCY_SIGN[currency] ?? ""}${s}` : s;
}

function fmtSigned(v: number | null): string {
  if (v === null || !isFinite(v)) return "—";
  const sign = v > 0 ? "+" : v < 0 ? "−" : "";
  const abs = Math.abs(v);
  const digits = abs >= 10000 ? 0 : abs >= 0.01 ? 2 : 4;
  return `${sign}${abs.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

function fmtCompactUsd(v: number): string {
  if (!isFinite(v)) return "—";
  return `$${v.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "UTC" });
}

function fmtAgo(iso: string, nowMs: number): string {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return "";
  const s = Math.max(0, Math.floor((nowMs - t) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
  return `${Math.floor(s / 86400)} days ago`;
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
  return (
    <div className="mkt-block">
      <div className="mkt-head">
        <span className="mkt-title">
          {title}
          <span className="mkt-venue">{venue}</span>
        </span>
        {index && (
          <span className="mkt-idx">
            {index.name} <b>{fmtNum(index.price)}</b> <Chg pct={index.changePct} />
          </span>
        )}
      </div>
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
                  <span className="cell-name">{q.name}</span>
                  <span className="sym">{q.symbol.replace(/\.(KS|T)$/, "")}</span>
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

function CryptoTable({ coins }: { coins: CryptoCoin[] }) {
  return (
    <div className="table-scroll">
      <table className="mkt">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ textAlign: "left" }}>Name</th>
            <th>Price</th>
            <th>24h</th>
            <th>Mkt Cap</th>
            <th>7d</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td style={{ textAlign: "left", color: "var(--ink-3)" }}>{coin.rank}</td>
              <td style={{ textAlign: "left" }}>
                <span className="cell-name">{coin.name}</span>
                <span className="sym">{coin.symbol}</span>
              </td>
              <td>{fmtNum(coin.price, "USD")}</td>
              <td>
                <Chg pct={coin.changePct24h} />
              </td>
              <td>{fmtCompactUsd(coin.marketCap)}</td>
              <td>
                <Sparkline data={coin.spark} pct={coin.changePct24h} w={64} h={22} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const NEWS_CAT_LABEL: Record<NewsItem["category"], string> = {
  crypto: "Crypto",
  stock: "Markets",
  economy: "Economy",
};

/* ---------- Front page ---------- */

export default function Dashboard({ initialData }: { initialData: MarketData }) {
  const [data, setData] = useState<MarketData>(initialData);
  const [now, setNow] = useState<number | null>(null); // relative times render only after mount (hydration-safe)

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
    sources.quotes === "sample" && "market quotes",
    sources.crypto === "sample" && "crypto prices",
    sources.news === "sample" && "headlines",
  ].filter(Boolean);

  const tickerItems: { key: string; name: string; value: string; pct: number | null }[] = [
    ...allIndices.map((q) => ({ key: q.symbol, name: q.name, value: fmtNum(q.price), pct: q.changePct })),
    ...fx.map((q) => ({ key: q.symbol, name: q.name, value: fmtNum(q.price), pct: q.changePct })),
    ...crypto.slice(0, 2).map((coin) => ({
      key: coin.id,
      name: coin.symbol,
      value: fmtNum(coin.price, "USD"),
      pct: coin.changePct24h,
    })),
  ];

  const partnerCategories = Array.from(new Set(AFFILIATES.map((p) => p.category)));

  return (
    <div className="paper">
      <header className="masthead">
        <h1 className="wordmark">SIGNAL</h1>
        <p className="tagline">Global markets, one page — Stocks · Crypto · FX</p>
      </header>

      <div className="dateline">
        <span>{fmtDate(data.updatedAt)}</span>
        <span className="dateline-status">
          <span className={`status-dot${hasSample ? " sample" : ""}`} aria-hidden="true" />
          Updated {fmtTime(data.updatedAt)} UTC{now !== null && ` · ${fmtAgo(data.updatedAt, now)}`}
        </span>
      </div>

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
        <p className="wire-note">
          Note: {sampleParts.join(", ")} shown here are sample figures — live feeds connect automatically in
          production deployments.
        </p>
      )}

      <AdSlot slot="0000000001" format="leaderboard" />

      <div className="sheet">
        <main className="col-main">
          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">Markets at a Glance</h2>
              <span className="kicker-note">US · Japan · Korea benchmarks</span>
            </div>
            <div className="board">
              {allIndices.map((q) => (
                <div className="board-cell" key={q.symbol}>
                  <span className="b-name">{q.name}</span>
                  <span className="b-value">{fmtNum(q.price)}</span>
                  <div className="b-foot">
                    <Chg pct={q.changePct} />
                    <Sparkline data={q.spark} pct={q.changePct} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">Cryptocurrencies</h2>
              <span className="kicker-note">Top 10 by market cap · 24/7</span>
            </div>
            {cryptoGlobal && (
              <p className="statline">
                Total market cap <b>{fmtCompactUsd(cryptoGlobal.totalMarketCapUsd)}</b>{" "}
                <Chg pct={cryptoGlobal.changePct24h} /> (24h) · Bitcoin dominance{" "}
                <b>{cryptoGlobal.btcDominance.toFixed(1)}%</b>
              </p>
            )}
            <CryptoTable coins={crypto} />
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">Equities</h2>
              <span className="kicker-note">Large caps by market</span>
            </div>
            <EquitiesBlock title="United States" venue="NYSE · Nasdaq" index={regions.us.indices[0]} stocks={regions.us.stocks} />
            <EquitiesBlock title="Japan" venue="Tokyo Stock Exchange" index={regions.jp.indices[0]} stocks={regions.jp.stocks} />
            <EquitiesBlock title="South Korea" venue="Korea Exchange" index={regions.kr.indices[0]} stocks={regions.kr.stocks} />
          </section>

          <section className="block">
            <div className="kicker">
              <h2 className="kicker-label">Currencies &amp; Commodities</h2>
            </div>
            <div className="board">
              {[...fx, ...commodities].map((q) => (
                <div className="board-cell" key={q.symbol}>
                  <span className="b-name">{q.name}</span>
                  <span className="b-value">{fmtNum(q.price, q.symbol.endsWith("=F") ? q.currency : undefined)}</span>
                  <div className="b-foot">
                    <Chg pct={q.changePct} />
                    <Sparkline data={q.spark} pct={q.changePct} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="col-rail">
          <section className="rail-mod">
            <div className="kicker">
              <h2 className="kicker-label">Latest Headlines</h2>
            </div>
            <div className="news-list">
              {news.map((item, i) => (
                <a className="news-item" key={`${item.link}-${i}`} href={item.link} target="_blank" rel="noopener noreferrer">
                  <span className="news-title">{item.title}</span>
                  <span className="news-meta">
                    {NEWS_CAT_LABEL[item.category]} · {item.source} ·{" "}
                    {now !== null ? fmtAgo(item.publishedAt, now) : `${fmtTime(item.publishedAt)} UTC`}
                  </span>
                </a>
              ))}
            </div>
          </section>

          <AdSlot slot="0000000002" format="rectangle" />

          <section className="rail-mod">
            <div className="kicker">
              <h2 className="kicker-label">Where to Trade</h2>
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
          <b>Signal</b> — US, Japanese and Korean equities, cryptocurrencies, currencies and commodities on a single
          page. Prices refresh automatically every 30 seconds.
        </p>
        <p className="fine">
          Market data may be delayed and is provided for information only, not investment advice. Sources: Yahoo
          Finance, CoinGecko, publisher RSS feeds.
        </p>
        <p className="fine">© {new Date().getFullYear()} Signal</p>
      </footer>
    </div>
  );
}
