import { symbolSlug } from "./slug";
import { universeEntry } from "./universe";

// Assets offered by the "if I had invested" calculator. Deliberately short:
// these are the ones people actually ask about, and each costs one upstream
// history request.

export const INVEST_SYMBOLS: string[] = [
  "BTC-USD", "ETH-USD", "NVDA", "AAPL", "TSLA", "MSFT", "GOOGL", "AMZN",
  "SPY", "QQQ", "GC=F", "005930.KS", "7203.T", "COIN", "PLTR", "DOGE-USD",
];

export const INVEST_YEARS: number[] = [1, 3, 5, 10];
export const DEFAULT_YEARS = 5;
export const DEFAULT_AMOUNT = 1000;
export const DEFAULT_SYMBOL = "BTC-USD";

export type InvestAsset = { symbol: string; slug: string; name: string };

export const INVEST_ASSETS: InvestAsset[] = INVEST_SYMBOLS.flatMap((symbol) => {
  const e = universeEntry(symbol);
  return e ? [{ symbol, slug: symbolSlug(symbol), name: e.name }] : [];
});

export function assetBySlug(slug: string): InvestAsset | undefined {
  return INVEST_ASSETS.find((a) => a.slug === slug.toLowerCase());
}

/** Clamp a query-string amount to something a calculator can render. */
export function parseAmount(raw: string | undefined): number {
  const n = Number(String(raw ?? "").replace(/[, ]/g, ""));
  if (!isFinite(n) || n <= 0) return DEFAULT_AMOUNT;
  return Math.min(Math.max(Math.round(n), 1), 1_000_000_000);
}

export function parseYears(raw: string | undefined): number {
  const n = Number(raw);
  return INVEST_YEARS.includes(n) ? n : DEFAULT_YEARS;
}
