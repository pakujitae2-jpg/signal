import { fetchSpark } from "./market";
import { movingAverages, rsi } from "./technicals";
import { byGroup } from "./universe";

// The RSI/moving-average screener over the crypto universe (72 coins) —
// phase 1 per the roadmap; the wider 550-symbol catalogue is a later pass,
// since screening it live on every request would mean 550 individual daily
// history fetches rather than one batched spark call.

export type ScreenerRow = {
  symbol: string;
  coin: string;
  name: string;
  price: number;
  rsi: number | null;
  sma20: number | null;
  sma50: number | null;
};

const CACHE_TTL_MS = 15 * 60_000;
let cache: { rows: ScreenerRow[]; ts: number } | null = null;

export async function getCryptoScreener(): Promise<ScreenerRow[]> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.rows;

  const entries = byGroup("crypto");
  const symbols = entries.map((e) => e.symbol);
  const spark = await fetchSpark(symbols, "3mo", "1d", 1800);

  const rows: ScreenerRow[] = [];
  for (const e of entries) {
    const row = spark.get(e.symbol);
    if (!row || row.closes.length < 20 || row.last === null) continue;
    const mas = movingAverages(row.closes);
    rows.push({
      symbol: e.symbol,
      coin: e.symbol.replace(/-USD$/, ""),
      name: e.name,
      price: row.last,
      rsi: rsi(row.closes),
      sma20: mas.find((m) => m.period === 20)?.sma ?? null,
      sma50: mas.find((m) => m.period === 50)?.sma ?? null,
    });
  }

  rows.sort((a, b) => (a.rsi ?? 50) - (b.rsi ?? 50));
  cache = { rows, ts: Date.now() };
  return rows;
}
