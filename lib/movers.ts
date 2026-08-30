import { fetchSpark } from "./market";
import { byGroup } from "./universe";

// Daily gainers and losers. The front page tracks 28 symbols, which is too
// few to rank, so this pulls a wider liquid set: Yahoo caps a spark request
// at 20 symbols, so the fetch is chunked and shared at the edge.

export type Mover = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  spark: number[];
  group: "us-stock" | "jp-stock" | "kr-stock" | "crypto";
};

export type MoversData = {
  updatedAt: string;
  equities: Mover[];
  crypto: Mover[];
  source: "live" | "unavailable";
};

/** Liquid names worth ranking, kept to a size the edge can refresh cheaply. */
function moversUniverse() {
  return [
    ...byGroup("us-stock").slice(0, 60),
    ...byGroup("kr-stock").slice(0, 24),
    ...byGroup("jp-stock").slice(0, 24),
    ...byGroup("crypto").slice(0, 24),
  ];
}

const CACHE_TTL_MS = 60_000;
let cache: { data: MoversData; ts: number } | null = null;

export async function getMovers(): Promise<MoversData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;

  const entries = moversUniverse();
  const rows = await fetchSpark(entries.map((e) => e.symbol), "1d", "5m", 60);

  const all: Mover[] = [];
  for (const e of entries) {
    const row = rows.get(e.symbol);
    if (!row || row.last === null || row.prev === null || row.prev === 0) continue;
    const changePct = ((row.last - row.prev) / row.prev) * 100;
    if (!isFinite(changePct)) continue;
    all.push({
      symbol: e.symbol,
      name: e.name,
      price: row.last,
      changePct,
      spark: row.closes.slice(-40),
      group: e.group as Mover["group"],
    });
  }

  const byPct = (a: Mover, b: Mover) => b.changePct - a.changePct;
  const data: MoversData = {
    updatedAt: new Date().toISOString(),
    equities: all.filter((m) => m.group !== "crypto").sort(byPct),
    crypto: all.filter((m) => m.group === "crypto").sort(byPct),
    source: all.length > 0 ? "live" : "unavailable",
  };
  cache = { data, ts: Date.now() };
  return data;
}
