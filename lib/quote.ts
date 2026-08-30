import { fetchJson } from "./http";
import { SYMBOLS } from "./symbols";
import { SAMPLE_CRYPTO, SAMPLE_QUOTES } from "./sample-data";

export type Range = "1d" | "5d" | "1mo" | "6mo" | "1y";
export const RANGES: Range[] = ["1d", "5d", "1mo", "6mo", "1y"];
export const RANGE_LABEL: Record<Range, string> = { "1d": "1D", "5d": "5D", "1mo": "1M", "6mo": "6M", "1y": "1Y" };

const RANGE_INTERVAL: Record<Range, string> = { "1d": "5m", "5d": "30m", "1mo": "1d", "6mo": "1d", "1y": "1wk" };
const RANGE_MS: Record<Range, number> = {
  "1d": 24 * 3600_000,
  "5d": 5 * 24 * 3600_000,
  "1mo": 30 * 24 * 3600_000,
  "6mo": 182 * 24 * 3600_000,
  "1y": 365 * 24 * 3600_000,
};

export type QuoteDetail = {
  symbol: string;
  name: string;
  currency: string;
  exchange: string | null;
  price: number | null;
  prevClose: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  range: Range;
  points: { t: number; c: number }[];
  source: "live" | "sample";
};

const CACHE_TTL_MS = 30_000;
const cache = new Map<string, { data: QuoteDetail; ts: number }>();

const SYMBOL_RE = /^[A-Za-z0-9.^=-]{1,15}$/;

export function isValidSymbol(s: string): boolean {
  return SYMBOL_RE.test(s);
}

function num(v: unknown): number | null {
  return typeof v === "number" && isFinite(v) ? v : null;
}

function sampleDetail(symbol: string, range: Range): QuoteDetail | null {
  const eq = SAMPLE_QUOTES.find((q) => q.symbol === symbol);
  const coin = SAMPLE_CRYPTO.find((c) => `${c.symbol}-USD` === symbol.toUpperCase());
  const base = eq ?? (coin && { name: coin.name, currency: "USD", price: coin.price, change: null, spark: coin.spark });
  if (!base || base.price === null) return null;
  const spark = base.spark ?? [];
  const now = Date.now();
  const span = RANGE_MS[range];
  const points = spark.map((c, i) => ({ t: now - span + (i / Math.max(1, spark.length - 1)) * span, c }));
  return {
    symbol,
    name: base.name,
    currency: base.currency,
    exchange: null,
    price: base.price,
    prevClose: base.price !== null && base.change != null ? base.price - base.change : (points[0]?.c ?? null),
    fiftyTwoWeekHigh: null,
    fiftyTwoWeekLow: null,
    range,
    points,
    source: "sample",
  };
}

export async function getQuoteDetail(symbol: string, range: Range): Promise<QuoteDetail | null> {
  const key = `${symbol}:${range}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) return hit.data;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${RANGE_INTERVAL[range]}`;
    const json = await fetchJson(url);
    const r = json?.chart?.result?.[0];
    if (!r) throw new Error("no result");

    const meta = r.meta ?? {};
    const ts: number[] = r.timestamp ?? [];
    const closes: unknown[] = r.indicators?.quote?.[0]?.close ?? [];
    const points = ts
      .map((t, i) => ({ t: t * 1000, c: closes[i] }))
      .filter((p): p is { t: number; c: number } => typeof p.c === "number" && isFinite(p.c));
    if (points.length < 2) throw new Error("no points");

    const fallbackName = SYMBOLS.find((s) => s.symbol === symbol)?.name;
    const data: QuoteDetail = {
      symbol,
      name: meta.shortName || meta.longName || fallbackName || symbol,
      currency: meta.currency || "USD",
      exchange: meta.fullExchangeName || meta.exchangeName || null,
      price: num(meta.regularMarketPrice) ?? points[points.length - 1].c,
      prevClose: num(meta.chartPreviousClose) ?? num(meta.previousClose),
      fiftyTwoWeekHigh: num(meta.fiftyTwoWeekHigh),
      fiftyTwoWeekLow: num(meta.fiftyTwoWeekLow),
      range,
      points,
      source: "live",
    };
    if (cache.size > 500) cache.clear();
    cache.set(key, { data, ts: Date.now() });
    return data;
  } catch {
    return sampleDetail(symbol, range);
  }
}
