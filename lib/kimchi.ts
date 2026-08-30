import { fetchJson } from "./http";
import { getQuoteDetail } from "./quote";

// Kimchi premium = how much more (or less) a coin costs on Korea's Upbit
// (in KRW) than on global exchanges, after converting through USD/KRW.
// premium % = upbitKrw / (globalUsd * usdKrw) - 1

const COINS = [
  { symbol: "BTC", name: "Bitcoin", geckoId: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", geckoId: "ethereum" },
  { symbol: "XRP", name: "XRP", geckoId: "ripple" },
  { symbol: "SOL", name: "Solana", geckoId: "solana" },
  { symbol: "DOGE", name: "Dogecoin", geckoId: "dogecoin" },
  { symbol: "ADA", name: "Cardano", geckoId: "cardano" },
] as const;

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

async function fetchUpbit(): Promise<Map<string, number>> {
  const markets = COINS.map((c) => `KRW-${c.symbol}`).join(",");
  const json = await fetchJson(`https://api.upbit.com/v1/ticker?markets=${markets}`);
  const map = new Map<string, number>();
  for (const t of json as any[]) {
    const sym = String(t?.market ?? "").replace(/^KRW-/, "");
    if (sym && typeof t?.trade_price === "number") map.set(sym, t.trade_price);
  }
  if (map.size === 0) throw new Error("upbit: empty");
  return map;
}

// Coinbase Exchange gives true USD trades and is reachable from US servers
// (Binance's API is not); CoinGecko's global average is the fallback.
async function fetchGlobalUsd(): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const results = await Promise.all(
      COINS.map((c) => fetchJson(`https://api.exchange.coinbase.com/products/${c.symbol}-USD/ticker`))
    );
    COINS.forEach((c, i) => {
      const price = parseFloat(results[i]?.price);
      if (isFinite(price)) map.set(c.symbol, price);
    });
  } catch {
    const ids = COINS.map((c) => c.geckoId).join(",");
    const json = await fetchJson(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    for (const c of COINS) {
      const price = (json as any)?.[c.geckoId]?.usd;
      if (typeof price === "number") map.set(c.symbol, price);
    }
  }
  if (map.size === 0) throw new Error("global prices: empty");
  return map;
}

const SAMPLE_PREMIUMS: Record<string, number> = { BTC: 2.14, ETH: 1.86, XRP: 3.21, SOL: 1.52, DOGE: 2.77, ADA: 1.93 };
const SAMPLE_USD: Record<string, number> = { BTC: 64210, ETH: 3412, XRP: 0.512, SOL: 152.3, DOGE: 0.118, ADA: 0.41 };

function sampleData(usdKrw: number): KimchiData {
  return {
    updatedAt: new Date().toISOString(),
    usdKrw,
    rows: COINS.map((c) => {
      const globalUsd = SAMPLE_USD[c.symbol];
      const globalKrw = globalUsd * usdKrw;
      const premiumPct = SAMPLE_PREMIUMS[c.symbol];
      return { symbol: c.symbol, name: c.name, upbitKrw: globalKrw * (1 + premiumPct / 100), globalUsd, globalKrw, premiumPct };
    }),
    source: "sample",
  };
}

export async function getKimchiData(): Promise<KimchiData> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;

  const fx = await getQuoteDetail("KRW=X", "1d");
  const usdKrw = fx?.price ?? 1384.5;

  try {
    const [upbit, global] = await Promise.all([fetchUpbit(), fetchGlobalUsd()]);
    const rows: KimchiRow[] = [];
    for (const c of COINS) {
      const upbitKrw = upbit.get(c.symbol);
      const globalUsd = global.get(c.symbol);
      if (upbitKrw === undefined || globalUsd === undefined) continue;
      const globalKrw = globalUsd * usdKrw;
      rows.push({
        symbol: c.symbol,
        name: c.name,
        upbitKrw,
        globalUsd,
        globalKrw,
        premiumPct: (upbitKrw / globalKrw - 1) * 100,
      });
    }
    if (rows.length === 0) throw new Error("kimchi: no rows");
    const data: KimchiData = { updatedAt: new Date().toISOString(), usdKrw, rows, source: "live" };
    cache = { data, ts: Date.now() };
    return data;
  } catch {
    return sampleData(usdKrw);
  }
}
