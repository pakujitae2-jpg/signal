import { fetchJson } from "./http";
import { byGroup } from "./universe";

// All-time-high tracking, crypto only: it is the one asset group with a
// real, freely available ATH figure (CoinGecko's /coins/markets). A "high"
// computed from the ~1y of history this site fetches for stocks/indices
// would be a 52-week high relabeled as an all-time high — already shown on
// /quote and not worth a second, misleadingly named page. Attribution to
// CoinGecko is required by their API terms and rendered on every page that
// uses this data.

export type AthEntry = {
  symbol: string; // "BTC-USD", matching the site's own universe symbols
  coinSymbol: string; // "BTC"
  name: string;
  marketCapRank: number | null;
  price: number;
  ath: number;
  athDate: string; // ISO date
  pctFromAth: number; // negative: how far below the ATH the current price is
  recoveryMultiple: number; // ath / price
};

export type AthData = { entries: AthEntry[]; asOf: string };

const CACHE_TTL_MS = 15 * 60_000; // ATH data moves slowly; keep upstream load light
let cache: { data: AthData; ts: number } | null = null;

export async function getCryptoAth(): Promise<AthData | null> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;

  try {
    // Top 250 by market cap, keyless. No `ids` filter: CoinGecko's free
    // markets endpoint can't be queried by ticker symbol, so this fetches
    // the broad top of the market once and intersects it with the site's
    // own 72-coin universe by symbol below, rather than hand-maintaining a
    // symbol -> CoinGecko-id table.
    const rows: any[] = await fetchJson(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1",
      900
    );
    if (!Array.isArray(rows) || rows.length === 0) throw new Error("coingecko markets: empty");

    const bySymbol = new Map<string, any>();
    for (const r of rows) {
      const sym = String(r.symbol ?? "").toUpperCase();
      // Top-250-by-market-cap order means the first occurrence of a ticker
      // is already the highest-cap one, so keep it and ignore later dupes.
      if (sym && !bySymbol.has(sym)) bySymbol.set(sym, r);
    }

    const entries: AthEntry[] = [];
    for (const u of byGroup("crypto")) {
      const coinSymbol = u.symbol.replace(/-USD$/, "");
      const r = bySymbol.get(coinSymbol);
      if (!r) continue;
      const price = Number(r.current_price);
      const ath = Number(r.ath);
      const athDate = String(r.ath_date ?? "");
      if (!isFinite(price) || price <= 0 || !isFinite(ath) || ath <= 0 || !athDate) continue;
      entries.push({
        symbol: u.symbol,
        coinSymbol,
        name: u.name,
        marketCapRank: Number.isFinite(r.market_cap_rank) ? r.market_cap_rank : null,
        price,
        ath,
        athDate: athDate.slice(0, 10),
        pctFromAth: (price - ath) / ath,
        recoveryMultiple: ath / price,
      });
    }
    if (entries.length === 0) throw new Error("coingecko markets: no overlap with tracked universe");

    entries.sort((a, b) => (a.marketCapRank ?? 9999) - (b.marketCapRank ?? 9999));
    const data: AthData = { entries, asOf: new Date().toISOString() };
    cache = { data, ts: Date.now() };
    return data;
  } catch {
    return null;
  }
}

export async function getCryptoAthFor(symbol: string): Promise<AthEntry | null> {
  const data = await getCryptoAth();
  return data?.entries.find((e) => e.symbol === symbol) ?? null;
}
