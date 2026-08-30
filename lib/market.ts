import { XMLParser } from "fast-xml-parser";
import { NEWS_FEEDS, SYMBOLS } from "./symbols";
import type { CryptoCoin, CryptoGlobal, MarketData, NewsItem, Quote, SourceState } from "./types";
import { SAMPLE_CRYPTO, SAMPLE_CRYPTO_GLOBAL, SAMPLE_NEWS, SAMPLE_QUOTES } from "./sample-data";

const CACHE_TTL_MS = 20_000;
const FETCH_TIMEOUT_MS = 8_000;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

let cache: { data: MarketData; ts: number } | null = null;

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function downsample(values: number[], target = 40): number[] {
  if (values.length <= target) return values;
  const step = values.length / target;
  const out: number[] = [];
  for (let i = 0; i < target; i++) out.push(values[Math.floor(i * step)]);
  out[out.length - 1] = values[values.length - 1];
  return out;
}

/** Yahoo Finance spark 엔드포인트로 전 종목(지수·주식·환율·원자재)을 한 번에 조회 */
async function fetchQuotes(): Promise<Quote[]> {
  const symbols = SYMBOLS.map((s) => encodeURIComponent(s.symbol)).join(",");
  const url = `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${symbols}&range=1d&interval=5m`;
  const json = await fetchJson(url);
  const results: any[] = json?.spark?.result ?? [];
  const bySymbol = new Map<string, any>();
  for (const r of results) {
    const resp = r?.response?.[0];
    if (r?.symbol && resp) bySymbol.set(r.symbol, resp);
  }

  const quotes: Quote[] = [];
  for (const def of SYMBOLS) {
    const resp = bySymbol.get(def.symbol);
    const meta = resp?.meta;
    const price: number | null = typeof meta?.regularMarketPrice === "number" ? meta.regularMarketPrice : null;
    const prev: number | null =
      typeof meta?.chartPreviousClose === "number"
        ? meta.chartPreviousClose
        : typeof meta?.previousClose === "number"
          ? meta.previousClose
          : null;
    const closes: number[] = (resp?.indicators?.quote?.[0]?.close ?? []).filter(
      (v: unknown): v is number => typeof v === "number"
    );
    const change = price !== null && prev !== null ? price - prev : null;
    quotes.push({
      symbol: def.symbol,
      name: def.name,
      currency: def.currency,
      price,
      change,
      changePct: change !== null && prev ? (change / prev) * 100 : null,
      spark: downsample(closes),
    });
  }
  if (!quotes.some((q) => q.price !== null)) throw new Error("yahoo spark: no prices");
  return quotes;
}

/** CoinGecko: 시가총액 상위 코인 + 글로벌 통계 */
async function fetchCrypto(): Promise<{ coins: CryptoCoin[]; global: CryptoGlobal }> {
  const [markets, global] = await Promise.all([
    fetchJson(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h"
    ),
    fetchJson("https://api.coingecko.com/api/v3/global"),
  ]);
  const coins: CryptoCoin[] = (markets as any[]).map((m) => ({
    id: m.id,
    rank: m.market_cap_rank,
    symbol: String(m.symbol ?? "").toUpperCase(),
    name: m.name,
    price: m.current_price,
    changePct24h: m.price_change_percentage_24h ?? null,
    marketCap: m.market_cap ?? 0,
    spark: downsample((m.sparkline_in_7d?.price ?? []).filter((v: unknown) => typeof v === "number")),
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

/** RSS 피드에서 최신 뉴스 수집 */
async function fetchNews(): Promise<NewsItem[]> {
  const parser = new XMLParser({ ignoreAttributes: true });
  const settled = await Promise.allSettled(
    NEWS_FEEDS.map(async (feed) => {
      const xml = await fetchText(feed.url);
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
