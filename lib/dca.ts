import { INVEST_SYMBOLS } from "./invested";
import { byGroup } from "./universe";

// /dca/<symbol> — recurring-contribution sibling of /tools/invested. Unlike
// that page's 16-symbol ?asset= catalogue, this is a path-based per-symbol
// route open to the whole universe (validated against UNIVERSE, not a regex),
// matching /quote/[symbol]/technicals and /seasonality.

export const DCA_YEARS: number[] = [1, 3, 5, 10, 20];
export const DEFAULT_DCA_YEARS = 10;
export const DEFAULT_DCA_AMOUNT = 100;

export function parseDcaAmount(raw: string | undefined): number {
  const n = Number(String(raw ?? "").replace(/[, ]/g, ""));
  if (!isFinite(n) || n <= 0) return DEFAULT_DCA_AMOUNT;
  return Math.min(Math.max(Math.round(n), 1), 10_000_000);
}

export function parseDcaYears(raw: string | undefined): number {
  const n = Number(raw);
  return DCA_YEARS.includes(n) ? n : DEFAULT_DCA_YEARS;
}

/** The same curated set /tools/invested offers, for cross-links and the
 *  "popular starting points" block — a small, opinionated subset of the
 *  much larger universe this page actually accepts. */
export const DCA_POPULAR_SYMBOLS: string[] = INVEST_SYMBOLS;

/** Bounded sitemap set: indices + ETFs + the top of the US list (already
 *  ordered largest-first) + top 20 crypto — roughly 120 symbols. Every
 *  /dca/<symbol> page works for any universe symbol on direct request; this
 *  only bounds what a crawler is pointed at, since each cold hit is a fresh
 *  full-history fetch (period1=0) and a 550-symbol sweep would be 550 of them. */
export function dcaSitemapSymbols(): string[] {
  return [
    ...byGroup("index").map((e) => e.symbol),
    ...byGroup("etf").map((e) => e.symbol),
    ...byGroup("us-stock").slice(0, 60).map((e) => e.symbol),
    ...byGroup("crypto").slice(0, 20).map((e) => e.symbol),
  ];
}
