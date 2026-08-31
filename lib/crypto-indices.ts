import { fetchSpark, getMarketData } from "./market";
import { byGroup } from "./universe";

// Two small, cheap additions to the crypto index family: Bitcoin dominance
// (already computed inside getMarketData's cryptoGlobal, so this adds no
// new upstream call) and an altcoin-season reading computed over the site's
// OWN tracked universe rather than claiming parity with any outside index
// (see getAltcoinSeason below for why).

export type DominanceData = { btcDominance: number; totalMarketCapUsd: number; asOf: string };

export async function getBitcoinDominance(): Promise<DominanceData | null> {
  const data = await getMarketData();
  if (data.sources.crypto !== "live" || !data.cryptoGlobal) return null;
  return { btcDominance: data.cryptoGlobal.btcDominance, totalMarketCapUsd: data.cryptoGlobal.totalMarketCapUsd, asOf: data.updatedAt };
}

// Stablecoins tracked in the crypto universe: excluded from "altcoins" the
// same way every published altcoin-season methodology excludes them.
const STABLES = new Set(["USDT", "USDC"]);

export type AltcoinSeasonData = {
  /** 0-100: the share of tracked altcoins that outperformed Bitcoin over the window. */
  index: number;
  universeSize: number;
  outperforming: number;
  btcReturnPct: number;
  windowDays: number;
  asOf: string;
};

const CACHE_TTL_MS = 30 * 60_000;
let cache: { data: AltcoinSeasonData; ts: number } | null = null;

/**
 * "If most of the top N coins outperformed Bitcoin over the last ~90 days,
 * it's altcoin season" — the standard definition (blockchaincenter.net) uses
 * the top 50 by market cap; this computes the same idea over PNL404's own
 * 72-coin universe instead. That is a deliberate, disclosed difference, not
 * an approximation of the "real" index: the site has no free 90-day-return
 * feed for an arbitrary top-N list, and silently claiming the industry
 * number while computing something else would be worse than naming the
 * universe actually used.
 */
export async function getAltcoinSeason(): Promise<AltcoinSeasonData | null> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;
  try {
    const symbols = byGroup("crypto").map((e) => e.symbol);
    const rows = await fetchSpark(symbols, "3mo", "1d", 3600);

    const windowReturn = (symbol: string): number | null => {
      const closes = rows.get(symbol)?.closes ?? [];
      if (closes.length < 2) return null;
      const first = closes[0];
      const last = closes[closes.length - 1];
      return first > 0 ? (last - first) / first : null;
    };

    const btcReturn = windowReturn("BTC-USD");
    if (btcReturn === null) throw new Error("altcoin-season: no BTC return");

    let outperforming = 0;
    let counted = 0;
    for (const symbol of symbols) {
      const coin = symbol.replace(/-USD$/, "");
      if (symbol === "BTC-USD" || STABLES.has(coin)) continue;
      const r = windowReturn(symbol);
      if (r === null) continue;
      counted++;
      if (r > btcReturn) outperforming++;
    }
    if (counted === 0) throw new Error("altcoin-season: no altcoin returns");

    const data: AltcoinSeasonData = {
      index: Math.round((outperforming / counted) * 100),
      universeSize: counted,
      outperforming,
      btcReturnPct: btcReturn * 100,
      windowDays: 90,
      asOf: new Date().toISOString(),
    };
    cache = { data, ts: Date.now() };
    return data;
  } catch {
    return null;
  }
}

export type SeasonLabel = "bitcoin" | "neutral" | "altcoin";

export function seasonLabel(index: number): SeasonLabel {
  if (index <= 25) return "bitcoin";
  if (index >= 75) return "altcoin";
  return "neutral";
}
