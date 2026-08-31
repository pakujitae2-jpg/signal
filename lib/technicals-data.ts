import { fetchJson } from "./http";

// Daily OHLCV bars for technical-indicator computation. A separate fetch
// from lib/quote.ts / lib/history.ts: those only keep the close, and MA200
// needs ~14 months of DAILY bars, which range=1y (interval snaps to 1wk
// past 6mo — see lib/quote.ts's RANGE_INTERVAL) can't supply.

export type Bar = { t: number; o: number; h: number; l: number; c: number; v: number };

export type DailyBars = {
  symbol: string;
  currency: string;
  bars: Bar[]; // oldest -> newest
  firstTradeDate: number | null; // unix seconds
  source: "live" | "unavailable";
};

const CACHE_TTL_MS = 20 * 60_000;
const cache = new Map<string, { data: DailyBars; ts: number }>();

export async function getDailyBars(symbol: string): Promise<DailyBars> {
  const hit = cache.get(symbol);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) return hit.data;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=2y&interval=1d`;
    const json = await fetchJson(url, 1800);
    const r = json?.chart?.result?.[0];
    const ts: number[] = r?.timestamp ?? [];
    const q = r?.indicators?.quote?.[0] ?? {};
    const bars: Bar[] = ts
      .map((t, i) => ({ t: t * 1000, o: q.open?.[i], h: q.high?.[i], l: q.low?.[i], c: q.close?.[i], v: q.volume?.[i] }))
      .filter((b): b is Bar => [b.o, b.h, b.l, b.c].every((x) => typeof x === "number" && isFinite(x)));
    if (bars.length < 30) throw new Error("technicals: too few bars");
    const data: DailyBars = {
      symbol,
      currency: r?.meta?.currency ?? "USD",
      bars,
      firstTradeDate: typeof r?.meta?.firstTradeDate === "number" ? r.meta.firstTradeDate : null,
      source: "live",
    };
    if (cache.size > 200) cache.clear();
    cache.set(symbol, { data, ts: Date.now() });
    return data;
  } catch {
    return { symbol, currency: "USD", bars: [], firstTradeDate: null, source: "unavailable" };
  }
}
