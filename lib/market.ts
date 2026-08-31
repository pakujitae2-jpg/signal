import { XMLParser } from "fast-xml-parser";
import { fetchJson, fetchText } from "./http";
import { NEWS_FEEDS, SYMBOLS } from "./symbols";
import type { CryptoCoin, CryptoGlobal, MarketData, NewsItem, Quote, SourceState } from "./types";
import { SAMPLE_CRYPTO, SAMPLE_CRYPTO_GLOBAL, SAMPLE_NEWS, SAMPLE_QUOTES } from "./sample-data";

const CACHE_TTL_MS = 20_000;

let cache: { data: MarketData; ts: number } | null = null;

function downsample(values: number[], target = 40): number[] {
  if (values.length <= target) return values;
  const step = values.length / target;
  const out: number[] = [];
  for (let i = 0; i < target; i++) out.push(values[Math.floor(i * step)]);
  out[out.length - 1] = values[values.length - 1];
  return out;
}

const isNum = (v: unknown): v is number => typeof v === "number" && isFinite(v);
const num = (v: unknown): number | null => (isNum(v) ? v : null);

type SparkRow = { closes: number[]; prev: number | null; last: number | null; timestamps: number[] };

/**
 * Yahoo's spark endpoint answers in one of two shapes depending on the edge
 * that serves it: `{ spark: { result: [{ symbol, response: [chart] }] } }`
 * or a flat map `{ [symbol]: { close, timestamp, chartPreviousClose } }`.
 * `timestamps` is left empty (never null-padded against `closes`) if a shape
 * doesn't carry it, so callers must treat a length mismatch as "unavailable"
 * rather than zip the two arrays positionally.
 */
export function parseSpark(json: any): Map<string, SparkRow> {
  const out = new Map<string, SparkRow>();
  const v8: unknown = json?.spark?.result;
  if (Array.isArray(v8)) {
    for (const r of v8) {
      const resp = r?.response?.[0];
      if (!r?.symbol || !resp) continue;
      const meta = resp.meta ?? {};
      const closes: number[] = (resp.indicators?.quote?.[0]?.close ?? []).filter(isNum);
      const rawTs: unknown[] = resp.timestamp ?? [];
      const timestamps = rawTs.length === closes.length ? rawTs.filter(isNum).map((t) => t * 1000) : [];
      out.set(r.symbol, {
        closes,
        prev: num(meta.chartPreviousClose) ?? num(meta.previousClose),
        last: num(meta.regularMarketPrice) ?? (closes.length ? closes[closes.length - 1] : null),
        timestamps,
      });
    }
    return out;
  }
  for (const [symbol, e] of Object.entries(json ?? {})) {
    if (!e || typeof e !== "object") continue;
    const entry = e as { close?: unknown[]; timestamp?: unknown[]; chartPreviousClose?: unknown; previousClose?: unknown };
    const closes: number[] = (entry.close ?? []).filter(isNum);
    const rawTs: unknown[] = entry.timestamp ?? [];
    const timestamps = rawTs.length === closes.length ? rawTs.filter(isNum).map((t) => t * 1000) : [];
    out.set(symbol, {
      closes,
      prev: num(entry.chartPreviousClose) ?? num(entry.previousClose),
      last: closes.length ? closes[closes.length - 1] : null,
      timestamps,
    });
  }
  return out;
}

function sparkUrl(symbols: string[], range: string, interval: string): string {
  const list = symbols.map((s) => encodeURIComponent(s)).join(",");
  return `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${list}&range=${range}&interval=${interval}`;
}

// Yahoo rejects spark requests with more than 20 symbols.
const SPARK_MAX_SYMBOLS = 20;

export async function fetchSpark(symbols: string[], range: string, interval: string, ttlSec: number): Promise<Map<string, SparkRow>> {
  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += SPARK_MAX_SYMBOLS) chunks.push(symbols.slice(i, i + SPARK_MAX_SYMBOLS));
  const settled = await Promise.allSettled(chunks.map((c) => fetchJson(sparkUrl(c, range, interval), ttlSec)));
  const out = new Map<string, SparkRow>();
  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    for (const [symbol, row] of parseSpark(r.value)) out.set(symbol, row);
  }
  return out;
}

/** Yahoo Finance spark 엔드포인트로 전 종목(지수·주식·환율·원자재)을 조회 (20개씩 나눠서) */
async function fetchQuotes(): Promise<Quote[]> {
  const rows = await fetchSpark(SYMBOLS.map((s) => s.symbol), "1d", "5m", 30);

  // Outside trading hours (futures on weekends, holidays) a 1d request can
  // come back empty; show the last close from a wider window instead. The
  // previous close is left unknown rather than reporting a 5-day move as today's.
  const missing = SYMBOLS.map((s) => s.symbol).filter((s) => rows.get(s)?.last == null);
  if (missing.length > 0) {
    const wide = await fetchSpark(missing, "5d", "15m", 120);
    for (const [symbol, row] of wide) {
      if (row.last !== null) rows.set(symbol, { closes: row.closes, prev: null, last: row.last, timestamps: row.timestamps });
    }
  }

  const quotes: Quote[] = [];
  for (const def of SYMBOLS) {
    const row = rows.get(def.symbol);
    const price = row?.last ?? null;
    const prev = row?.prev ?? null;
    const change = price !== null && prev !== null ? price - prev : null;
    quotes.push({
      symbol: def.symbol,
      name: def.name,
      currency: def.currency,
      price,
      change,
      changePct: change !== null && prev ? (change / prev) * 100 : null,
      spark: downsample(row?.closes ?? []),
    });
  }
  if (!quotes.some((q) => q.price !== null)) throw new Error("yahoo spark: no prices");
  return quotes;
}

type CryptoBundle = { coins: CryptoCoin[]; global: CryptoGlobal };

/** alternative.me: 시가총액 상위 코인 + 글로벌 통계 (Workers IP에서 차단되지 않음) */
async function fetchCryptoAlternative(): Promise<CryptoBundle> {
  const [ticker, global] = await Promise.all([
    fetchJson("https://api.alternative.me/v2/ticker/?limit=10&structure=array", 60),
    fetchJson("https://api.alternative.me/v2/global/", 60),
  ]);
  const rows: any[] = ticker?.data ?? [];
  if (rows.length === 0) throw new Error("alternative.me: empty");

  // 5-day sparklines come from Yahoo; optional.
  const sparks = await fetchSpark(rows.map((r) => `${r.symbol}-USD`), "5d", "1h", 300);

  const coins: CryptoCoin[] = rows.map((r) => {
    const usd = r?.quotes?.USD ?? {};
    return {
      id: String(r.website_slug ?? r.symbol).toLowerCase(),
      rank: Number(r.rank) || 0,
      symbol: String(r.symbol ?? "").toUpperCase(),
      name: String(r.name ?? r.symbol),
      price: Number(usd.price) || 0,
      changePct24h: num(usd.percent_change_24h),
      marketCap: Number(usd.market_cap) || 0,
      spark: downsample(sparks.get(`${r.symbol}-USD`)?.closes ?? []),
    };
  });
  const g = global?.data;
  // Documented as a percentage but served as a fraction (0.64); accept either.
  const dom = Number(g?.bitcoin_percentage_of_market_cap) || 0;
  return {
    coins,
    global: {
      totalMarketCapUsd: Number(g?.quotes?.USD?.total_market_cap) || 0,
      btcDominance: dom <= 1 ? dom * 100 : dom,
      changePct24h: null,
    },
  };
}

/** CoinGecko: 로컬/일반 서버용 폴백 (공유 IP에서는 429가 잦음) */
async function fetchCryptoGecko(): Promise<CryptoBundle> {
  const [markets, global] = await Promise.all([
    fetchJson(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h",
      60
    ),
    fetchJson("https://api.coingecko.com/api/v3/global", 60),
  ]);
  const coins: CryptoCoin[] = (markets as any[]).map((m) => ({
    id: m.id,
    rank: m.market_cap_rank,
    symbol: String(m.symbol ?? "").toUpperCase(),
    name: m.name,
    price: m.current_price,
    changePct24h: m.price_change_percentage_24h ?? null,
    marketCap: m.market_cap ?? 0,
    spark: downsample((m.sparkline_in_7d?.price ?? []).filter(isNum)),
  }));
  const g = (global as any)?.data;
  return {
    coins,
    global: {
      totalMarketCapUsd: g?.total_market_cap?.usd ?? 0,
      btcDominance: g?.market_cap_percentage?.btc ?? 0,
      changePct24h: g?.market_cap_change_percentage_24h_usd ?? null,
    },
  };
}

async function fetchCrypto(): Promise<CryptoBundle> {
  try {
    return await fetchCryptoAlternative();
  } catch {
    return fetchCryptoGecko();
  }
}

/** RSS 피드에서 최신 뉴스 수집 */
async function fetchNews(): Promise<NewsItem[]> {
  const parser = new XMLParser({ ignoreAttributes: true });
  const settled = await Promise.allSettled(
    NEWS_FEEDS.map(async (feed) => {
      const xml = await fetchText(feed.url, 600);
      const doc = parser.parse(xml);
      const rawItems = doc?.rss?.channel?.item ?? doc?.feed?.entry ?? [];
      const items: any[] = Array.isArray(rawItems) ? rawItems : [rawItems];
      return items.slice(0, 10).map((item): NewsItem => {
        const link = typeof item?.link === "string" ? item.link : (item?.link?.href ?? item?.guid ?? "#");
        const dateStr = item?.pubDate ?? item?.published ?? item?.updated ?? "";
        const date = new Date(dateStr);
        return {
          title: String(item?.title ?? "").trim(),
          link: String(link),
          source: feed.source,
          publishedAt: isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString(),
          category: feed.category,
        };
      });
    })
  );
  const all = settled
    .flatMap((s) => (s.status === "fulfilled" ? s.value : []))
    .filter((n) => n.title)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 12);
  if (all.length === 0) throw new Error("rss: no items");
  return all;
}

function groupQuotes(quotes: Quote[]) {
  const by = (group: string) =>
    quotes.filter((q) => SYMBOLS.find((s) => s.symbol === q.symbol)?.group === group);
  return {
    regions: {
      us: { indices: by("us-index"), stocks: by("us-stock") },
      jp: { indices: by("jp-index"), stocks: by("jp-stock") },
      kr: { indices: by("kr-index"), stocks: by("kr-stock") },
    },
    fx: by("fx"),
    commodities: by("commodity"),
  };
}

export async function getMarketData(): Promise<MarketData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;

  const [quotesR, cryptoR, newsR] = await Promise.allSettled([fetchQuotes(), fetchCrypto(), fetchNews()]);

  const quotesState: SourceState = quotesR.status === "fulfilled" ? "live" : "sample";
  const cryptoState: SourceState = cryptoR.status === "fulfilled" ? "live" : "sample";
  const newsState: SourceState = newsR.status === "fulfilled" ? "live" : "sample";

  const quotes = quotesR.status === "fulfilled" ? quotesR.value : SAMPLE_QUOTES;
  const crypto = cryptoR.status === "fulfilled" ? cryptoR.value : { coins: SAMPLE_CRYPTO, global: SAMPLE_CRYPTO_GLOBAL };
  const news = newsR.status === "fulfilled" ? newsR.value : SAMPLE_NEWS;

  const data: MarketData = {
    updatedAt: new Date().toISOString(),
    sources: { quotes: quotesState, crypto: cryptoState, news: newsState },
    cryptoGlobal: crypto.global,
    crypto: crypto.coins,
    ...groupQuotes(quotes),
    news,
  };
  cache = { data, ts: Date.now() };
  return data;
}
