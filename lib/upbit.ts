import { fetchJson } from "./http";

// /markets/upbit-krw and /alerts/upbit-caution — a directory over every Upbit
// KRW market (288, vs. the 6-coin kimchi hardcode this widened from) plus a
// standing list of coins currently flagged 유의(caution) or 투자유의(warning).
// Price, change, volume and the flags are fetched live on every request —
// unlike the name metadata in lib/upbit-markets.generated.ts, these change
// far more often than the listing set, and a stale caution flag is exactly
// the kind of wrong-when-it-matters-most number this project avoids.

export type UpbitCautionFlags = {
  PRICE_FLUCTUATIONS: boolean;
  TRADING_VOLUME_SOARING: boolean;
  DEPOSIT_AMOUNT_SOARING: boolean;
  GLOBAL_PRICE_DIFFERENCES: boolean;
  CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
};

export type UpbitMarketRow = {
  market: string;
  symbol: string;
  koreanName: string;
  englishName: string;
  price: number | null;
  changePct: number | null;
  volume24hKrw: number | null;
  high52w: number | null;
  low52w: number | null;
  warning: boolean;
  caution: UpbitCautionFlags;
  hasFlag: boolean;
};

export type UpbitDirectory = {
  updatedAt: string;
  markets: UpbitMarketRow[];
  source: "live" | "unavailable";
};

const CACHE_TTL_MS = 60_000;
let cache: { data: UpbitDirectory; ts: number } | null = null;

export async function getUpbitDirectory(): Promise<UpbitDirectory> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.data;

  try {
    const marketsJson = (await fetchJson("https://api.upbit.com/v1/market/all?isDetails=true", 3600)) as unknown[];
    const krw = marketsJson.filter(
      (m): m is Record<string, unknown> => typeof (m as { market?: unknown })?.market === "string" && (m as { market: string }).market.startsWith("KRW-")
    );
    if (krw.length === 0) throw new Error("empty market list");

    const marketIds = krw.map((m) => m.market as string);
    const tickerJson = (await fetchJson(`https://api.upbit.com/v1/ticker?markets=${marketIds.join(",")}`, 30)) as unknown[];
    const tickerByMarket = new Map<string, Record<string, unknown>>();
    for (const t of tickerJson) {
      const row = t as Record<string, unknown>;
      if (typeof row?.market === "string") tickerByMarket.set(row.market, row);
    }

    const markets: UpbitMarketRow[] = krw.map((m) => {
      const market = m.market as string;
      const t = tickerByMarket.get(market);
      const event = m.market_event as { warning?: unknown; caution?: Record<string, unknown> } | undefined;
      const rawCaution = event?.caution ?? {};
      const caution: UpbitCautionFlags = {
        PRICE_FLUCTUATIONS: Boolean(rawCaution.PRICE_FLUCTUATIONS),
        TRADING_VOLUME_SOARING: Boolean(rawCaution.TRADING_VOLUME_SOARING),
        DEPOSIT_AMOUNT_SOARING: Boolean(rawCaution.DEPOSIT_AMOUNT_SOARING),
        GLOBAL_PRICE_DIFFERENCES: Boolean(rawCaution.GLOBAL_PRICE_DIFFERENCES),
        CONCENTRATION_OF_SMALL_ACCOUNTS: Boolean(rawCaution.CONCENTRATION_OF_SMALL_ACCOUNTS),
      };
      const warning = Boolean(event?.warning);
      return {
        market,
        symbol: market.replace(/^KRW-/, ""),
        koreanName: String(m.korean_name ?? ""),
        englishName: String(m.english_name ?? ""),
        price: typeof t?.trade_price === "number" ? t.trade_price : null,
        changePct: typeof t?.signed_change_rate === "number" ? t.signed_change_rate * 100 : null,
        volume24hKrw: typeof t?.acc_trade_price_24h === "number" ? t.acc_trade_price_24h : null,
        high52w: typeof t?.highest_52_week_price === "number" ? t.highest_52_week_price : null,
        low52w: typeof t?.lowest_52_week_price === "number" ? t.lowest_52_week_price : null,
        warning,
        caution,
        hasFlag: warning || Object.values(caution).some(Boolean),
      };
    });

    markets.sort((a, b) => (b.volume24hKrw ?? 0) - (a.volume24hKrw ?? 0));
    const data: UpbitDirectory = { updatedAt: new Date().toISOString(), markets, source: "live" };
    cache = { data, ts: Date.now() };
    return data;
  } catch {
    return { updatedAt: new Date().toISOString(), markets: [], source: "unavailable" };
  }
}

export function upbitCautionRows(dir: UpbitDirectory): UpbitMarketRow[] {
  return dir.markets.filter((m) => m.hasFlag);
}
