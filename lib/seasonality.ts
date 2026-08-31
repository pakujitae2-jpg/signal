import type { HistoryPoint } from "./invested-math";

// Year x month seasonality, built from lib/history.ts's month-end closes
// (now correctly monthly after the period1/period2 fix — see that file).
// A short history produces a statistically meaningless average, so callers
// must gate on hasEnoughForSeasonality before rendering anything from this.

export type MonthStats = { month: number; hitRate: number; median: number; best: number; worst: number; avg: number; n: number };

export type SeasonalityMatrix = {
  years: number[]; // ascending
  returns: Map<string, number>; // `${year}-${month}` (month 0-11) -> % return
  monthStats: MonthStats[]; // index 0 = January
  startYear: number;
  yearsOfHistory: number;
};

function median(sorted: number[]): number {
  const n = sorted.length;
  return n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
}

function monthReturns(points: HistoryPoint[]): { year: number; month: number; pct: number }[] {
  const out: { year: number; month: number; pct: number }[] = [];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1].c;
    if (!(prev > 0)) continue;
    const d = new Date(points[i].t);
    out.push({ year: d.getUTCFullYear(), month: d.getUTCMonth(), pct: ((points[i].c - prev) / prev) * 100 });
  }
  return out;
}

export const MIN_SEASONALITY_YEARS = 10;

export function hasEnoughForSeasonality(points: HistoryPoint[]): boolean {
  const years = new Set(monthReturns(points).map((r) => r.year));
  return years.size >= MIN_SEASONALITY_YEARS;
}

export function buildSeasonality(points: HistoryPoint[]): SeasonalityMatrix | null {
  const mr = monthReturns(points);
  if (mr.length === 0) return null;
  const years = [...new Set(mr.map((r) => r.year))].sort((a, b) => a - b);
  const returns = new Map<string, number>();
  for (const r of mr) returns.set(`${r.year}-${r.month}`, r.pct);

  const monthStats: MonthStats[] = [];
  for (let m = 0; m < 12; m++) {
    const vals = mr.filter((r) => r.month === m).map((r) => r.pct);
    if (vals.length === 0) {
      monthStats.push({ month: m, hitRate: 0, median: 0, best: 0, worst: 0, avg: 0, n: 0 });
      continue;
    }
    const positive = vals.filter((v) => v > 0).length;
    monthStats.push({
      month: m,
      hitRate: (positive / vals.length) * 100,
      median: median([...vals].sort((a, b) => a - b)),
      best: Math.max(...vals),
      worst: Math.min(...vals),
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      n: vals.length,
    });
  }
  return { years, returns, monthStats, startYear: years[0], yearsOfHistory: years.length };
}

/** Calendar-year total returns (compounded from monthly), most recent first. Excludes the current, still-partial year. */
export function annualReturns(points: HistoryPoint[], now: Date = new Date()): { year: number; pct: number }[] {
  const mr = monthReturns(points);
  const byYear = new Map<number, number[]>();
  for (const r of mr) {
    if (r.year >= now.getUTCFullYear()) continue;
    if (!byYear.has(r.year)) byYear.set(r.year, []);
    byYear.get(r.year)!.push(r.pct);
  }
  const out: { year: number; pct: number }[] = [];
  for (const [year, pcts] of byYear) {
    if (pcts.length < 10) continue; // an incomplete year (e.g. the symbol's listing year) isn't a fair annual figure
    const compounded = pcts.reduce((acc, p) => acc * (1 + p / 100), 1);
    out.push({ year, pct: (compounded - 1) * 100 });
  }
  return out.sort((a, b) => b.year - a.year);
}
