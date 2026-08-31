import { fetchJson } from "./http";
import { CURRENCIES } from "./fx";

// Historical FX by year and by specific date — /convert/<pair>/<YYYY> and
// /convert/<pair>/<YYYY-MM-DD>. Frankfurter v2 (NOT v1): v1 only covers the
// ~30 ECB-published currencies; v2 aggregates 84 central banks and covers
// all 43 currencies this site tracks. Time-series takes `from`/`to`, not
// `start_date`/`end_date` (that 422s). Single-date lookup is `/v2/rates?date=`,
// not a `/v2/{date}` path.

const V2_RATES = "https://api.frankfurter.dev/v2/rates";

export type FxDayRate = { date: string; rate: number };

const CACHE_TTL_SEC = 6 * 3600; // closed-year/closed-date data never changes; still capped for edge-cache sanity

/**
 * One day's rate. The returned `date` is whatever Frankfurter's own response
 * echoes — NOT necessarily the requested date. Two distinct behaviors seen
 * live: for a weekend within its recent window, v2 echoes the REQUESTED
 * (weekend) date but with the prior business day's rate carried forward; for
 * an older gap it resolves to, and echoes, the actual nearest prior date.
 * Callers must not assume the echoed date had a fresh quote — see isWeekend.
 */
export async function fxRateOnDate(base: string, quote: string, date: string): Promise<FxDayRate | null> {
  if (!CURRENCIES[base] || !CURRENCIES[quote]) return null;
  try {
    const url = `${V2_RATES}?date=${date}&base=${base}&quotes=${quote}`;
    const json = await fetchJson(url, CACHE_TTL_SEC);
    const row = Array.isArray(json) ? json[0] : null;
    if (!row || typeof row.rate !== "number" || typeof row.date !== "string") return null;
    return { date: row.date, rate: row.rate };
  } catch {
    return null;
  }
}

/** Every day Frankfurter returns in [from, to] (inclusive) — includes weekend carry-forwards, oldest -> newest. */
export async function fxRateRange(base: string, quote: string, from: string, to: string): Promise<FxDayRate[]> {
  if (!CURRENCIES[base] || !CURRENCIES[quote]) return [];
  try {
    const url = `${V2_RATES}?from=${from}&to=${to}&base=${base}&quotes=${quote}`;
    const json = await fetchJson(url, CACHE_TTL_SEC);
    if (!Array.isArray(json)) return [];
    return json
      .filter((r): r is FxDayRate => typeof r?.rate === "number" && typeof r?.date === "string")
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function isWeekend(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return wd === 0 || wd === 6;
}

/** Drops weekend rows — v2 carries Friday's rate forward onto them, so they add no information and would corrupt a high/low. */
export function weekdaysOnly(rows: FxDayRate[]): FxDayRate[] {
  return rows.filter((r) => !isWeekend(r.date));
}

export type YearStats = { high: FxDayRate; low: FxDayRate; average: number; first: FxDayRate; last: FxDayRate; changePct: number } | null;

export function yearStats(rows: FxDayRate[]): YearStats {
  const wd = weekdaysOnly(rows);
  if (wd.length === 0) return null;
  let high = wd[0];
  let low = wd[0];
  let sum = 0;
  for (const r of wd) {
    if (r.rate > high.rate) high = r;
    if (r.rate < low.rate) low = r;
    sum += r.rate;
  }
  const first = wd[0];
  const last = wd[wd.length - 1];
  return { high, low, average: sum / wd.length, first, last, changePct: ((last.rate - first.rate) / first.rate) * 100 };
}

export function yearRange(year: number): { from: string; to: string } {
  const today = new Date().toISOString().slice(0, 10);
  const to = `${year}-12-31`;
  return { from: `${year}-01-01`, to: to > today ? today : to };
}

/** The 7 currencies this feature builds full year/date coverage for. */
export const CORE_FX_CODES = ["USD", "KRW", "JPY", "EUR", "GBP", "CNY", "INR"] as const;

export function coreFxPairs(): [string, string][] {
  const pairs: [string, string][] = [];
  for (const a of CORE_FX_CODES) for (const b of CORE_FX_CODES) if (a !== b) pairs.push([a, b]);
  return pairs;
}

const MIN_YEAR = 2016;
export function historyYears(now: Date = new Date()): number[] {
  const thisYear = now.getUTCFullYear();
  const years: number[] = [];
  for (let y = MIN_YEAR; y <= thisYear; y++) years.push(y);
  return years;
}

export function isValidHistoryYear(year: number, now: Date = new Date()): boolean {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= now.getUTCFullYear();
}

export type FxTableRow = { code: string; rate: number; prevRate: number | null; date: string };

/**
 * Every tracked currency's rate against `base`, plus a day-change reference
 * where one is available — one call (omitting `quotes=` returns Frankfurter's
 * full ~165-currency set, verified live), filtered down to the 43 this site
 * tracks rather than letting their catalogue silently expand ours. A single
 * request across a short trailing window also carries the previous day's
 * rate, so this never needs a second round trip for the change column.
 */
export async function fxTable(base: string, asOfDate?: string): Promise<FxTableRow[] | null> {
  if (!CURRENCIES[base]) return null;
  try {
    const to = asOfDate ?? new Date().toISOString().slice(0, 10);
    const from = new Date(Date.parse(to) - 5 * 86400_000).toISOString().slice(0, 10);
    const url = `${V2_RATES}?from=${from}&to=${to}&base=${base}`;
    const json = await fetchJson(url, CACHE_TTL_SEC);
    if (!Array.isArray(json)) return null;

    const byCode = new Map<string, { date: string; rate: number }[]>();
    for (const row of json) {
      if (typeof row?.quote !== "string" || typeof row?.rate !== "number" || typeof row?.date !== "string") continue;
      if (!CURRENCIES[row.quote]) continue;
      if (!byCode.has(row.quote)) byCode.set(row.quote, []);
      byCode.get(row.quote)!.push({ date: row.date, rate: row.rate });
    }

    const out: FxTableRow[] = [];
    for (const [code, entries] of byCode) {
      entries.sort((a, b) => a.date.localeCompare(b.date));
      const latest = entries[entries.length - 1];
      const prev = [...entries].reverse().find((e) => e.date !== latest.date && e.rate !== latest.rate);
      out.push({ code, rate: latest.rate, prevRate: prev?.rate ?? null, date: latest.date });
    }
    return out.length > 0 ? out.sort((a, b) => a.code.localeCompare(b.code)) : null;
  } catch {
    return null;
  }
}
