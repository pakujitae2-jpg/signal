import { fetchJson } from "./http";
import { fetchSpark } from "./market";
import { getQuoteDetail } from "./quote";
import { byGroup } from "./universe";

// Kimchi premium = how much more (or less) a coin costs on Korea's Upbit
// (in KRW) than on global exchanges, after converting through USD/KRW.
// premium % = upbitKrw / (globalUsd * usdKrw) - 1
//
// Widened from an original 6-coin hardcode to every coin this site already
// tracks (byGroup("crypto"), ~72 symbols) that Upbit also lists in KRW —
// reusing the existing Yahoo -USD quotes as the "reliable global reference"
// rather than a Coinbase-specific symbol list, since Yahoo is already the
// site's trusted source for the ATH, technicals and DCA features.

export type KimchiRow = {
  symbol: string;
  name: string;
  upbitKrw: number;
  globalUsd: number;
  globalKrw: number;
  premiumPct: number;
};

export type KimchiData = {
  updatedAt: string;
  usdKrw: number;
  rows: KimchiRow[];
  source: "live" | "sample";
};

const CACHE_TTL_MS = 15_000;
let cache: { data: KimchiData; ts: number } | null = null;

/** Every KRW market's latest trade price, keyed by base symbol (no KRW- prefix). */
async function fetchUpbitAll(): Promise<Map<string, number>> {
  const markets = await fetchJson("https://api.upbit.com/v1/market/all?isDetails=true", 3600);
  const krwMarkets = (markets as unknown[])
    .filter((m): m is { market: string } => typeof (m as { market?: unknown })?.market === "string" && (m as { market: string }).market.startsWith("KRW-"))
    .map((m) => m.market);
  if (krwMarkets.length === 0) throw new Error("upbit market list empty");

  const json = await fetchJson(`https://api.upbit.com/v1/ticker?markets=${krwMarkets.join(",")}`, 15);
  const map = new Map<string, number>();
  for (const t of json as unknown[]) {
    const row = t as { market?: unknown; trade_price?: unknown };
    const sym = String(row?.market ?? "").replace(/^KRW-/, "");
    if (sym && typeof row?.trade_price === "number") map.set(sym, row.trade_price);
  }
  if (map.size === 0) throw new Error("upbit ticker empty");
  return map;
}

export async function getKimchiData(): Promise<KimchiData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;

  const fx = await getQuoteDetail("KRW=X", "1d");
  const usdKrw = fx?.price ?? 1384.5;

  try {
    const upbit = await fetchUpbitAll();
    const candidates = byGroup("crypto").filter((e) => upbit.has(e.symbol.replace(/-USD$/, "")));
    if (candidates.length === 0) throw new Error("no overlap between Upbit KRW markets and tracked crypto");
    const global = await fetchSpark(candidates.map((e) => e.symbol), "1d", "5m", 30);

    const rows: KimchiRow[] = [];
    for (const e of candidates) {
      const base = e.symbol.replace(/-USD$/, "");
      const upbitKrw = upbit.get(base);
      const globalUsd = global.get(e.symbol)?.last;
      if (upbitKrw === undefined || !globalUsd) continue;
      const globalKrw = globalUsd * usdKrw;
      rows.push({ symbol: base, name: e.name, upbitKrw, globalUsd, globalKrw, premiumPct: (upbitKrw / globalKrw - 1) * 100 });
    }
    if (rows.length === 0) throw new Error("kimchi: no rows");
    const data: KimchiData = { updatedAt: new Date().toISOString(), usdKrw, rows, source: "live" };
    cache = { data, ts: Date.now() };
    return data;
  } catch {
    // Never substitute invented premiums — an empty table plus the existing
    // "sample data" notice is honest; a plausible-looking fake number is not.
    return { updatedAt: new Date().toISOString(), usdKrw, rows: [], source: "sample" };
  }
}
