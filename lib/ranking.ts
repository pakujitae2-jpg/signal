import { fetchSpark } from "./market";
import { byGroup, type UniverseGroup } from "./universe";

// /ranking/<metric>/<market> — close-based 52-week extremes from the same 1y
// daily spark sweep /movers/[period] uses. Two boards the roadmap's own data
// audit ruled OUT stay out: day_share-volume ranking (spark carries no volume
// field — that's only on the per-symbol chart endpoint) and any PER/PBR/ROE
// or market-cap board (v7/v10 quote both 401 for this project).

export type RankingMetric = "52-week-high" | "52-week-low";
export const RANKING_METRICS: RankingMetric[] = ["52-week-high", "52-week-low"];

export type RankingMarket = "us" | "japan" | "korea" | "crypto";
export const RANKING_MARKETS: RankingMarket[] = ["us", "japan", "korea", "crypto"];
export const isRankingMetric = (s: string): s is RankingMetric => (RANKING_METRICS as string[]).includes(s);
export const isRankingMarket = (s: string): s is RankingMarket => (RANKING_MARKETS as string[]).includes(s);

const MARKET_GROUP: Record<RankingMarket, UniverseGroup> = { us: "us-stock", japan: "jp-stock", korea: "kr-stock", crypto: "crypto" };

export type RankingRow = {
  symbol: string;
  name: string;
  price: number;
  extreme: number;
  /** Distance from the 52-week extreme, always >= 0 regardless of metric —
   *  0 means today's close IS the 52-week high (or low). */
  pctFromExtreme: number;
};

export type RankingData = {
  updatedAt: string;
  metric: RankingMetric;
  market: RankingMarket;
  rows: RankingRow[];
  source: "live" | "unavailable";
};

const CACHE_TTL_MS = 3600_000;
const cache = new Map<string, { data: RankingData; ts: number }>();

export async function getRanking(metric: RankingMetric, market: RankingMarket): Promise<RankingData> {
  const key = `${metric}:${market}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) return hit.data;

  const entries = byGroup(MARKET_GROUP[market]);
  const rows = await fetchSpark(entries.map((e) => e.symbol), "1y", "1d", 3600);

  const out: RankingRow[] = [];
  for (const e of entries) {
    const row = rows.get(e.symbol);
    if (!row || row.closes.length < 30 || row.last === null) continue;
    const extreme = metric === "52-week-high" ? Math.max(...row.closes) : Math.min(...row.closes);
    if (!(extreme > 0)) continue;
    const pctFromExtreme = Math.abs((row.last - extreme) / extreme) * 100;
    out.push({ symbol: e.symbol, name: e.name, price: row.last, extreme, pctFromExtreme });
  }

  out.sort((a, b) => a.pctFromExtreme - b.pctFromExtreme);
  const data: RankingData = {
    updatedAt: new Date().toISOString(),
    metric,
    market,
    rows: out,
    source: out.length > 0 ? "live" : "unavailable",
  };
  cache.set(key, { data, ts: Date.now() });
  return data;
}
