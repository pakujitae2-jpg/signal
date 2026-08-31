import { closeAt, type HistoryPoint } from "./invested-math";
import { fetchSpark } from "./market";
import { byGroup } from "./universe";

// /movers/<period> — the existing /movers page only covers today. Longer
// windows are far more link-stable (a YTD page accumulates links all year;
// today's gainers page is stale tomorrow). Built on the spark endpoint
// lib/market.ts already wraps, NOT lib/history.ts's one-request-per-symbol
// monthly series, which can't produce a one-week ranking and would cost 550
// upstream calls for a full sweep.

export type MoversPeriod = "week" | "month" | "ytd" | "1y" | "3y" | "5y";
export const MOVERS_PERIODS: MoversPeriod[] = ["week", "month", "ytd", "1y", "3y", "5y"];
export const isMoversPeriod = (s: string): s is MoversPeriod => (MOVERS_PERIODS as string[]).includes(s);

export type PeriodMover = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  spark: number[];
  group: "us-stock" | "jp-stock" | "kr-stock" | "crypto";
};

export type PeriodMoversData = {
  updatedAt: string;
  period: MoversPeriod;
  equities: PeriodMover[];
  crypto: PeriodMover[];
  source: "live" | "unavailable";
};

// Same liquid subset /movers ranks daily, kept to a size the edge refreshes
// cheaply — this is a ranking over PNL404's own catalogue, not the market.
function moversUniverse() {
  return [
    ...byGroup("us-stock").slice(0, 60),
    ...byGroup("kr-stock").slice(0, 24),
    ...byGroup("jp-stock").slice(0, 24),
    ...byGroup("crypto").slice(0, 24),
  ];
}

function downsample(values: number[], target = 40): number[] {
  if (values.length <= target) return values;
  const step = values.length / target;
  const out: number[] = [];
  for (let i = 0; i < target; i++) out.push(values[Math.floor(i * step)]);
  out[out.length - 1] = values[values.length - 1];
  return out;
}

function cutoffMs(period: MoversPeriod, now: number): number {
  const day = 86400_000;
  if (period === "week") return now - 7 * day;
  if (period === "month") return now - 30.44 * day;
  if (period === "ytd") return Date.UTC(new Date(now).getUTCFullYear(), 0, 1);
  if (period === "1y") return now - 365.25 * day;
  if (period === "3y") return now - 3 * 365.25 * day;
  return now - 5 * 365.25 * day;
}

const CACHE_TTL_MS = 3600_000;
const cache = new Map<MoversPeriod, { data: PeriodMoversData; ts: number }>();

export async function getPeriodMovers(period: MoversPeriod): Promise<PeriodMoversData> {
  const hit = cache.get(period);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) return hit.data;

  const entries = moversUniverse();
  const isLong = period === "3y" || period === "5y";
  const rows = await fetchSpark(entries.map((e) => e.symbol), isLong ? "5y" : "1y", isLong ? "1wk" : "1d", 3600);

  const now = Date.now();
  const cutoff = cutoffMs(period, now);

  const all: PeriodMover[] = [];
  for (const e of entries) {
    const row = rows.get(e.symbol);
    if (!row || row.closes.length < 2 || row.timestamps.length !== row.closes.length) continue;
    const points: HistoryPoint[] = row.timestamps.map((t, i) => ({ t, c: row.closes[i] }));
    const start = closeAt(points, cutoff);
    const last = points[points.length - 1];
    // closeAt falls back to points[0] when nothing is at-or-before cutoff —
    // that means this symbol's history doesn't reach back far enough for the
    // requested period, so it's excluded rather than silently truncated.
    if (!start || start.t > cutoff || start.c <= 0) continue;
    const changePct = ((last.c - start.c) / start.c) * 100;
    if (!isFinite(changePct)) continue;
    all.push({
      symbol: e.symbol,
      name: e.name,
      price: last.c,
      changePct,
      spark: downsample(points.filter((pt) => pt.t >= start.t).map((pt) => pt.c)),
      group: e.group as PeriodMover["group"],
    });
  }

  const byPct = (a: PeriodMover, b: PeriodMover) => b.changePct - a.changePct;
  const data: PeriodMoversData = {
    updatedAt: new Date().toISOString(),
    period,
    equities: all.filter((m) => m.group !== "crypto").sort(byPct),
    crypto: all.filter((m) => m.group === "crypto").sort(byPct),
    source: all.length > 0 ? "live" : "unavailable",
  };
  cache.set(period, { data, ts: Date.now() });
  return data;
}
