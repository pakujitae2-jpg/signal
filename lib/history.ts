import { fetchJson } from "./http";

// Long-range monthly history, used by the "if I had invested" calculator and
// the comparison pages. One request per symbol, cached hard at the edge —
// monthly closes do not change intraday.

import type { HistoryPoint } from "./invested-math";

export { closeAt, computeInvested, type HistoryPoint, type InvestedResult } from "./invested-math";

export type History = {
  symbol: string;
  currency: string;
  points: HistoryPoint[]; // oldest -> newest, monthly closes
  source: "live" | "unavailable";
};

const CACHE_TTL_MS = 6 * 3600_000;
const cache = new Map<string, { data: History; ts: number }>();

/** Every monthly close Yahoo has for the symbol. */
export async function getHistory(symbol: string): Promise<History> {
  const hit = cache.get(symbol);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) return hit.data;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=max&interval=1mo`;
    const json = await fetchJson(url, 21600);
    const r = json?.chart?.result?.[0];
    const ts: number[] = r?.timestamp ?? [];
    const closes: unknown[] = r?.indicators?.quote?.[0]?.close ?? [];
    const points = ts
      .map((t, i) => ({ t: t * 1000, c: closes[i] }))
      .filter((p): p is HistoryPoint => typeof p.c === "number" && isFinite(p.c) && p.c > 0);
    if (points.length < 12) throw new Error("history too short");
    const data: History = { symbol, currency: r?.meta?.currency ?? "USD", points, source: "live" };
    if (cache.size > 200) cache.clear();
    cache.set(symbol, { data, ts: Date.now() });
    return data;
  } catch {
    return { symbol, currency: "USD", points: [], source: "unavailable" };
  }
}

