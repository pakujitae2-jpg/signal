"use client";

import { useEffect, useState } from "react";
import type { CryptoCoin, MarketData, NewsItem, Quote } from "@/lib/types";
import { AFFILIATES, AFFILIATE_DISCLOSURE } from "@/config/affiliates";
import AdSlot from "./AdSlot";

const REFRESH_MS = 30_000;

/* ---------- 포맷터 (서버/클라이언트 동일 결과를 위해 로케일·타임존 고정) ---------- */

const CURRENCY_SIGN: Record<string, string> = { KRW: "₩", JPY: "¥", USD: "$" };

function fmtNum(v: number | null, currency?: string): string {
  if (v === null || !isFinite(v)) return "—";
  const abs = Math.abs(v);
  const digits = abs >= 10000 ? 0 : abs >= 1 ? 2 : 4;
  const s = v.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return currency ? `${CURRENCY_SIGN[currency] ?? ""}${s}` : s;
}

function fmtCompactUsd(v: number): string {
  if (!isFinite(v)) return "—";
  return `$${v.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 })}`;
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Seoul" });
}

function fmtAgo(iso: string, nowMs: number): string {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return "";
  const s = Math.max(0, Math.floor((nowMs - t) / 1000));
  if (s < 60) return `${s}초 전`;
  if (s < 3600) return `${Math.floor(s / 60)}분 전`;
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`;
  return `${Math.floor(s / 86400)}일 전`;
}

/* ---------- 등락 표시 (색 + 화살표를 함께 사용해 색맹에서도 방향이 읽히도록) ---------- */

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

/* ---------- 스파크라인 (수치는 텍스트로 병기되므로 장식용) ---------- */

function Sparkline({ data, pct, w = 84, h = 28 }: { data?: number[]; pct: number | null; w?: number; h?: number }) {
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

/* ---------- 조각 컴포넌트 ---------- */

function Tile({ name, value, pct, spark }: { name: string; value: string; pct: number | null; spark?: number[] }) {
  return (
    <div className="tile">
      <span className="t-name">{name}</span>
      <span className="t-price">{value}</span>
      <div className="t-foot">
        <Chg pct={pct} />
        <Sparkline data={spark} pct={pct} />
      </div>
    </div>
  );
}

function QuoteRows({ quotes, withCurrency }: { quotes: Quote[]; withCurrency: boolean }) {
  return (
    <tbody>
      {quotes.map((q) => (
        <tr key={q.symbol}>
          <td>
            <span className="q-name">{q.name}</span>
            <span className="q-sym">{q.symbol.replace(/\.(KS|T)$/, "")}</span>
          </td>
          <td>{fmtNum(q.price, withCurrency ? q.currency : undefined)}</td>
          <td>
            <Chg pct={q.changePct} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function RegionCard({ title, indices, stocks }: { title: string; indices: Quote[]; stocks: Quote[] }) {
  const head = indices[0];
  return (
    <div className="card">
      <div className="card-head">
        <span>{title}</span>
        {head && (
          <span className="idx">
            {head.name} {fmtNum(head.price)} <Chg pct={head.changePct} />
          </span>
        )}
      </div>
      <div className="table-scroll">
        <table className="quotes">
          <thead>
            <tr>
              <th>종목</th>
              <th>현재가</th>
              <th>등락</th>
            </tr>
          </thead>
          <QuoteRows quotes={stocks} withCurrency />
        </table>
      </div>
    </div>
  );
}

function CryptoTable({ coins }: { coins: CryptoCoin[] }) {
  return (
    <div className="card">
      <div className="table-scroll">
        <table className="quotes">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left" }}>이름</th>
              <th>가격</th>
              <th>24시간</th>
              <th>시가총액</th>
              <th>7일 추이</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id}>
                <td style={{ textAlign: "left", color: "var(--ink-muted)" }}>{coin.rank}</td>
                <td style={{ textAlign: "left" }}>
                  <span className="q-name">{coin.name}</span>
                  <span className="q-sym">{coin.symbol}</span>
                </td>
                <td>{fmtNum(coin.price, "USD")}</td>
                <td>
                  <Chg pct={coin.changePct24h} />
                </td>
                <td>{fmtCompactUsd(coin.marketCap)}</td>
                <td>
                  <Sparkline data={coin.spark} pct={coin.changePct24h} w={72} h={24} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const NEWS_CAT_LABEL: Record<NewsItem["category"], string> = {
  crypto: "코인",
  stock: "증시",
  economy: "경제",
};

/* ---------- 메인 대시보드 ---------- */

export default function Dashboard({ initialData }: { initialData: MarketData }) {
  const [data, setData] = useState<MarketData>(initialData);
  const [now, setNow] = useState<number | null>(null); // 마운트 후에만 상대시간 표시 (hydration 안전)

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
        // 일시적 실패는 기존 데이터를 유지
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
  const allIndices = [...regions.kr.indices, ...regions.jp.indices, ...regions.us.indices];
  const hasSample = Object.values(sources).includes("sample");
  const sampleParts = [
    sources.quotes === "sample" && "시세",
    sources.crypto === "sample" && "암호화폐",
    sources.news === "sample" && "뉴스",
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

  return (
    <>
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">SIGNAL</span>
          <span className="brand-sub">시그널 · 글로벌 마켓을 한눈에</span>
        </div>
        <div className="header-meta">
          <span className={`live-dot${hasSample ? " sample" : ""}`} aria-hidden="true" />
          <span>
            {fmtTime(data.updatedAt)} 기준{now !== null && ` · ${fmtAgo(data.updatedAt, now)}`}
          </span>
        </div>
      </header>

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

      <main className="container">
        {hasSample && (
          <div className="notice">
            ⚠ 현재 {sampleParts.join(" · ")} 항목은 네트워크 제한으로 <b>샘플 데이터</b>가 표시되고 있습니다. 실서버
            배포 환경에서는 실시간 데이터로 자동 전환됩니다.
          </div>
        )}

        <AdSlot slot="0000000001" label="상단 배너" />

        <section>
          <h2 className="section-title">
            글로벌 지수 <span className="sub">한국 · 일본 · 미국</span>
          </h2>
          <div className="tile-grid">
            {allIndices.map((q) => (
              <Tile key={q.symbol} name={q.name} value={fmtNum(q.price)} pct={q.changePct} spark={q.spark} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">
            암호화폐 <span className="sub">시가총액 상위 10</span>
          </h2>
          {cryptoGlobal && (
            <div className="crypto-summary">
              <Tile name="암호화폐 총 시가총액" value={fmtCompactUsd(cryptoGlobal.totalMarketCapUsd)} pct={cryptoGlobal.changePct24h} />
              <Tile name="비트코인 도미넌스" value={`${cryptoGlobal.btcDominance.toFixed(1)}%`} pct={null} />
            </div>
          )}
          <CryptoTable coins={crypto} />
        </section>

        <section>
          <h2 className="section-title">
            국가별 주요 종목 <span className="sub">미국 · 일본 · 한국</span>
          </h2>
          <div className="regions-grid">
            <RegionCard title="🇺🇸 미국" indices={regions.us.indices} stocks={regions.us.stocks} />
            <RegionCard title="🇯🇵 일본" indices={regions.jp.indices} stocks={regions.jp.stocks} />
            <RegionCard title="🇰🇷 한국" indices={regions.kr.indices} stocks={regions.kr.stocks} />
          </div>
        </section>

        <section>
          <h2 className="section-title">환율 · 원자재</h2>
          <div className="tile-grid">
            {[...fx, ...commodities].map((q) => (
              <Tile
                key={q.symbol}
                name={q.name}
                value={fmtNum(q.price, q.symbol.endsWith("=F") ? q.currency : undefined)}
                pct={q.changePct}
                spark={q.spark}
              />
            ))}
          </div>
        </section>

        <AdSlot slot="0000000002" label="중간 배너" />

        <section>
          <h2 className="section-title">
            최신 뉴스 <span className="sub">경제 · 증시 · 코인</span>
          </h2>
          <div className="card news-list">
            {news.map((item, i) => (
              <a
                className="news-item"
                key={`${item.link}-${i}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="news-cat">{NEWS_CAT_LABEL[item.category]}</span>
                <span className="news-title">{item.title}</span>
                <span className="news-meta">
                  {item.source} · {now !== null ? fmtAgo(item.publishedAt, now) : fmtTime(item.publishedAt)}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">
            파트너 <span className="sub">AD · 제휴 링크</span>
          </h2>
          <div className="partner-grid">
            {AFFILIATES.map((p) => (
              <a className="partner-card" key={p.name} href={p.url} target="_blank" rel="noopener noreferrer sponsored">
                <span className="partner-badge">{p.badge}</span>
                <span className="partner-name">{p.name}</span>
                <span className="partner-desc">{p.desc}</span>
              </a>
            ))}
          </div>
          <p className="disclosure">{AFFILIATE_DISCLOSURE}</p>
        </section>
      </main>

      <footer className="site-footer">
        <span>
          본 사이트가 제공하는 정보는 투자 판단의 참고 자료일 뿐이며, 투자 결과에 대한 책임은 이용자 본인에게
          있습니다. 시세는 거래소·데이터 제공사 사정에 따라 지연될 수 있습니다.
        </span>
        <span>데이터: Yahoo Finance · CoinGecko · 언론사 RSS | 30초마다 자동 갱신</span>
        <span>© {new Date().getFullYear()} SIGNAL 시그널</span>
      </footer>
    </>
  );
}
