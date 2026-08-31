import { CPI_JP, CPI_KR, CPI_US, type CpiPoint } from "./cpi.generated";

// /inflation/<country>/<year> — a per-(country, year) URL family, unlike
// every KO/JA/EN competitor found, which is a single URL with a form and so
// only ranks for the head term. US data is BLS CPI-U averaged to annual for
// a uniform cross-country shape; KR/JP are World Bank annual CPI, which
// trails roughly a year — see cpi-copy.ts for how the headline avoids
// claiming "today" for lagged data.

export type CpiCountry = "us" | "kr" | "jp";
export const CPI_COUNTRIES: CpiCountry[] = ["us", "kr", "jp"];
export const isCpiCountry = (s: string): s is CpiCountry => (CPI_COUNTRIES as string[]).includes(s);

const SERIES: Record<CpiCountry, CpiPoint[]> = { us: CPI_US, kr: CPI_KR, jp: CPI_JP };
export const CPI_CURRENCY: Record<CpiCountry, string> = { us: "USD", kr: "KRW", jp: "JPY" };

export function cpiSeries(country: CpiCountry): CpiPoint[] {
  return SERIES[country];
}

export function cpiYearRange(country: CpiCountry): { min: number; max: number } {
  const s = SERIES[country];
  return { min: s[0].year, max: s[s.length - 1].year };
}

/** A start year needs at least one later point to compare against. */
export function isValidCpiYear(country: CpiCountry, year: number): boolean {
  const { min, max } = cpiYearRange(country);
  return Number.isInteger(year) && year >= min && year < max;
}

export type InflationResult = {
  fromYear: number;
  toYear: number;
  fromCpi: number;
  toCpi: number;
  amount: number;
  result: number;
  cumulativePct: number;
  annualPct: number;
  years: number;
  /** True when toYear is still in progress (a partial-year average), so the
   *  page can say so rather than imply a full year's final figure. */
  toYearPartial: boolean;
  yearByYear: { year: number; cpi: number; value: number }[];
};

export function computeInflation(country: CpiCountry, fromYear: number, amount: number): InflationResult | null {
  const series = SERIES[country];
  const from = series.find((p) => p.year === fromYear);
  const to = series[series.length - 1];
  if (!from || !to || !(from.cpi > 0) || !(amount > 0) || fromYear >= to.year) return null;

  const ratio = to.cpi / from.cpi;
  const years = to.year - from.year;
  const cumulativePct = (ratio - 1) * 100;
  const annualPct = years > 0 ? (Math.pow(ratio, 1 / years) - 1) * 100 : 0;
  const nowYear = new Date().getUTCFullYear();

  return {
    fromYear,
    toYear: to.year,
    fromCpi: from.cpi,
    toCpi: to.cpi,
    amount,
    result: amount * ratio,
    cumulativePct,
    annualPct,
    years,
    toYearPartial: to.year >= nowYear,
    yearByYear: series.filter((p) => p.year >= fromYear).map((p) => ({ year: p.year, cpi: p.cpi, value: amount * (p.cpi / from.cpi) })),
  };
}

export const CPI_CONVERSION_LADDER: number[] = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000];
