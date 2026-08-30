import { fetchSpark } from "./market";
import { universeEntry } from "./universe";

// Quotes for the embeddable ticker strip. Publishers choose the symbols, so
// the list is validated against the universe before anything is fetched.

export const TICKER_MAX = 8;
export const TICKER_DEFAULT = ["BTC-USD", "NVDA", "^GSPC", "KRW=X"];

export type TickerQuote = { symbol: string; name: string; price: number | null; changePct: number | null; currency: string };

/** Parse the `s` query param into at most TICKER_MAX known symbols. */
export function parseSymbols(raw: string | undefined): string[] {
  const wanted = String(raw ?? "")
    .split(",")
    .map((s) => decodeURIComponent(s.trim()))
    .filter(Boolean);
  const out: string[] = [];
  for (const s of wanted) {
    const entry = universeEntry(s);
    if (entry && !out.includes(entry.symbol)) out.push(entry.symbol);
    if (out.length >= TICKER_MAX) break;
  }
  return out.length ? out : TICKER_DEFAULT;
}

export async function getTickerQuotes(symbols: string[]): Promise<TickerQuote[]> {
  const rows = await fetchSpark(symbols, "1d", "5m", 60);
  return symbols.map((symbol) => {
    const entry = universeEntry(symbol);
    const row = rows.get(symbol);
    const price = row?.last ?? null;
    const prev = row?.prev ?? null;
    return {
      symbol,
      name: entry?.name ?? symbol,
      price,
      changePct: price !== null && prev !== null && prev !== 0 ? ((price - prev) / prev) * 100 : null,
      currency: symbol.endsWith("-USD") || !symbol.includes(".") ? "USD" : "",
    };
  });
}
