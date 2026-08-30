import { bySlug, symbolSlug } from "./slug";
import type { UniverseEntry } from "./universe";

// Head-to-head pages at /compare/<a>-vs-<b>. Any two symbols in the universe
// work; the curated list below is what goes in the sitemap and the hub, since
// those are the comparisons people actually search for.

export type ComparePair = { left: string; right: string };

const CURATED: [string, string][] = [
  ["NVDA", "AMD"], ["BTC-USD", "ETH-USD"], ["AAPL", "MSFT"], ["005930.KS", "000660.KS"],
  ["TSLA", "7203.T"], ["GC=F", "BTC-USD"], ["SPY", "QQQ"], ["KRW=X", "JPY=X"],
  ["GOOGL", "META"], ["AMZN", "MSFT"], ["NVDA", "TSM"], ["AMD", "INTC"],
  ["COIN", "MSTR"], ["BTC-USD", "SOL-USD"], ["ETH-USD", "SOL-USD"], ["XRP-USD", "ADA-USD"],
  ["005930.KS", "TSM"], ["035420.KS", "035720.KS"], ["005380.KS", "000270.KS"], ["373220.KS", "006400.KS"],
  ["7203.T", "7267.T"], ["6758.T", "7974.T"], ["9984.T", "9432.T"], ["8035.T", "6857.T"],
  ["VOO", "SPY"], ["QQQ", "TQQQ"], ["GLD", "SLV"], ["GC=F", "SI=F"],
  ["CL=F", "BZ=F"], ["^GSPC", "^IXIC"], ["^N225", "^KS11"], ["^KS11", "^KQ11"],
  ["JPM", "BAC"], ["V", "MA"], ["KO", "PEP"], ["NKE", "LULU"],
  ["NFLX", "DIS"], ["UBER", "ABNB"], ["PLTR", "SNOW"], ["MU", "000660.KS"],
  ["LLY", "NVO"], ["XOM", "CVX"], ["BA", "LMT"], ["F", "GM"],
  ["BABA", "PDD"], ["ASML", "AMAT"], ["ARM", "QCOM"], ["IBIT", "BTC-USD"],
];

export type CuratedPair = { slug: string; left: UniverseEntry; right: UniverseEntry };

export const COMPARE_PAIRS: CuratedPair[] = CURATED.flatMap(([a, b]) => {
  const left = bySlug(symbolSlug(a));
  const right = bySlug(symbolSlug(b));
  if (!left || !right || left.symbol === right.symbol) return [];
  return [{ slug: `${symbolSlug(a)}-vs-${symbolSlug(b)}`, left, right }];
});

export const COMPARE_SLUGS: string[] = COMPARE_PAIRS.map((p) => p.slug);

/** Parse "<a>-vs-<b>". Both sides must be symbols we know, and differ. */
export function parseCompare(slug: string): { left: UniverseEntry; right: UniverseEntry } | null {
  const i = slug.indexOf("-vs-");
  if (i <= 0) return null;
  const left = bySlug(slug.slice(0, i));
  const right = bySlug(slug.slice(i + 4));
  if (!left || !right || left.symbol === right.symbol) return null;
  return { left, right };
}

export function compareSlug(leftSymbol: string, rightSymbol: string): string {
  return `${symbolSlug(leftSymbol)}-vs-${symbolSlug(rightSymbol)}`;
}
