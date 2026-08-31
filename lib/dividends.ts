import { JAPAN } from "@/config/exchange-schedule";
import { DIVIDENDS } from "./dividends.generated";

// Dividend history is a build-time snapshot (scripts/generate-dividends.mjs),
// not a live fetch — see that script for why. Amounts are Yahoo's
// retroactively split-adjusted figures, not as-paid; pages using this must
// label that. Payout ratio is deliberately not computed anywhere here: it
// needs EPS, which has no free source (v7/quote 401, v10/quoteSummary 401).

export type DividendEvent = { exDate: string; recordDate: string | null; amount: number };
export type SplitEvent = { exDate: string; numerator: number; denominator: number; ratio: string };
export type DividendRecord = { dividends: DividendEvent[]; splits: SplitEvent[] };

export function dividendsFor(symbol: string): DividendRecord | null {
  return DIVIDENDS[symbol] ?? null;
}

export const DIVIDEND_SYMBOLS: string[] = Object.keys(DIVIDENDS);

/** Trailing-twelve-month dividend sum, as of `now`. */
export function ttmSum(record: DividendRecord, now: Date = new Date()): number {
  const cutoff = new Date(now.getTime() - 366 * 86400_000).toISOString().slice(0, 10);
  return record.dividends.filter((d) => d.exDate >= cutoff).reduce((s, d) => s + d.amount, 0);
}

export type PayoutFrequency = "monthly" | "quarterly" | "semiannual" | "annual" | "irregular";

/** Inferred from the modal gap between the last several ex-dates — not a stated policy. */
export function payoutFrequency(record: DividendRecord): PayoutFrequency {
  const dates = record.dividends.slice(-8).map((d) => d.exDate);
  if (dates.length < 2) return "irregular";
  const gapsDays: number[] = [];
  for (let i = 1; i < dates.length; i++) {
    gapsDays.push((Date.parse(dates[i]) - Date.parse(dates[i - 1])) / 86400_000);
  }
  const avg = gapsDays.reduce((a, b) => a + b, 0) / gapsDays.length;
  if (avg <= 45) return "monthly";
  if (avg <= 135) return "quarterly";
  if (avg <= 275) return "semiannual";
  if (avg <= 400) return "annual";
  return "irregular";
}

/** Calendar-year totals, most recent year first. Partial for the current year. */
export function dividendsByYear(record: DividendRecord): { year: number; total: number }[] {
  const map = new Map<number, number>();
  for (const d of record.dividends) {
    const y = Number(d.exDate.slice(0, 4));
    map.set(y, (map.get(y) ?? 0) + d.amount);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([year, total]) => ({ year, total }));
}

/** Year-over-year change for the most recent two FULL calendar years (skips the current, partial, year). */
export function yoyGrowthPct(record: DividendRecord, now: Date = new Date()): number | null {
  const years = dividendsByYear(record).filter((y) => y.year < now.getUTCFullYear());
  if (years.length < 2) return null;
  const [latest, prior] = years;
  if (prior.total <= 0) return null;
  return ((latest.total - prior.total) / prior.total) * 100;
}

function isJpBusinessDay(dateStr: string): boolean {
  const wd = new Date(`${dateStr}T00:00:00Z`).getUTCDay();
  if (wd === 0 || wd === 6) return false;
  const holidays = JAPAN.holidays(Number(dateStr.slice(0, 4)));
  return !holidays.some((h) => h.date === dateStr);
}

/**
 * 権利付最終日 — the last trading day to buy and still receive a dividend.
 * Under T+2 settlement this is exactly one JP business day before the
 * ex-date (権利落ち日), not "3 business days before" as sometimes loosely
 * stated (that conflates it with an older T+3 convention).
 */
export function kenritsukiSaishubi(exDateIso: string): string {
  let d = exDateIso;
  do {
    const [y, m, day] = d.split("-").map(Number);
    d = new Date(Date.UTC(y, m - 1, day - 1)).toISOString().slice(0, 10);
  } while (!isJpBusinessDay(d));
  return d;
}
