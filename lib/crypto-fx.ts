import { fetchJson } from "./http";
import { getQuoteDetail } from "./quote";
import { CURRENCIES, getFxRate, isCryptoCode } from "./fx";
import { LOCALE_TAG, type Lang } from "./i18n";

// Rate resolution for a /convert pair where one leg is a cryptocurrency and
// the other is fiat. Two methods:
//
//  - "upbit-krw": for a KRW leg, the real traded price on Upbit's KRW
//    market — preferred over a synthetic cross rate because they can
//    genuinely disagree (the kimchi premium): CoinGecko's USD-cross-rate
//    BTC/KRW has been measured ~0.6% away from Upbit's actual traded price
//    on the same day. See /kimchi-premium for the broader gap.
//  - "cross-usd": crypto-USD price (Yahoo, the same call /quote/<coin>
//    already makes) converted through the live USD/<fiat> rate. Used for
//    every other fiat, and as the KRW fallback if Upbit is unreachable.
//
// The method actually used is returned so the page can label it, per the
// site's own rule against presenting a computed figure as an observed one
// without saying which it is.

export type CryptoFxMethod = "upbit-krw" | "cross-usd";

export type CryptoFxRate = {
  base: string;
  quote: string;
  /** 1 base = rate quote */
  rate: number;
  prevRate: number | null;
  method: CryptoFxMethod;
  source: "live" | "sample";
  asOf: string;
  /** The coin's own USD price, regardless of which fiat this pair converts to — used to pick an amount ladder scaled to the coin, not the fiat. */
  coinUsdPrice: number;
};

async function upbitKrwTicker(coin: string): Promise<{ price: number; prevClose: number | null } | null> {
  try {
    const rows = await fetchJson(`https://api.upbit.com/v1/ticker?markets=KRW-${coin}`, 20);
    const row = Array.isArray(rows) ? rows[0] : null;
    const price = Number(row?.trade_price);
    if (!row || !isFinite(price) || price <= 0) return null;
    const prevClose = Number(row?.prev_closing_price);
    return { price, prevClose: isFinite(prevClose) && prevClose > 0 ? prevClose : null };
  } catch {
    return null;
  }
}

export async function getCryptoFxRate(rawBase: string, rawQuote: string): Promise<CryptoFxRate | null> {
  const base = rawBase.toUpperCase();
  const quote = rawQuote.toUpperCase();
  const baseCrypto = isCryptoCode(base);
  const coin = baseCrypto ? base : quote;
  const fiat = baseCrypto ? quote : base;
  if (!CURRENCIES[fiat]) return null;

  // The coin's own USD price is fetched regardless of method — needed as a
  // currency-agnostic reference for the amount ladder even when the actual
  // rate comes from Upbit's KRW market below.
  const usdDetail = await getQuoteDetail(`${coin}-USD`, "1d");
  const coinUsdPrice = usdDetail?.price ?? null;

  if (fiat === "KRW") {
    const direct = await upbitKrwTicker(coin);
    if (direct) {
      const rate = baseCrypto ? direct.price : 1 / direct.price;
      const prevRate = direct.prevClose === null ? null : baseCrypto ? direct.prevClose : 1 / direct.prevClose;
      return {
        base: rawBase,
        quote: rawQuote,
        rate,
        prevRate,
        method: "upbit-krw",
        source: "live",
        asOf: new Date().toISOString(),
        coinUsdPrice: coinUsdPrice ?? direct.price / 1300, // rough USD reference only if the USD leg failed; never shown, only used to pick a ladder tier
      };
    }
  }

  if (!usdDetail || coinUsdPrice === null) return null;

  let fiatPerUsd = 1;
  let fiatPerUsdPrev: number | null = null;
  let fxSource: "live" | "sample" = "live";
  if (fiat !== "USD") {
    const fx = await getFxRate("USD", fiat, "1d");
    fiatPerUsd = fx.rate;
    fiatPerUsdPrev = fx.prevRate;
    fxSource = fx.source;
  }

  const cryptoInFiat = coinUsdPrice * fiatPerUsd;
  const rate = baseCrypto ? cryptoInFiat : 1 / cryptoInFiat;
  const prevRate =
    usdDetail.prevClose !== null && fiatPerUsdPrev !== null
      ? (() => {
          const p = usdDetail.prevClose! * fiatPerUsdPrev!;
          return baseCrypto ? p : 1 / p;
        })()
      : null;

  return {
    base: rawBase,
    quote: rawQuote,
    rate,
    prevRate,
    method: "cross-usd",
    source: usdDetail.source === "sample" || fxSource === "sample" ? "sample" : "live",
    asOf: new Date().toISOString(),
    coinUsdPrice,
  };
}

/** A round-number ladder scaled to the coin's price, so the resulting fiat amounts land in a sensible range. */
export function cryptoAmountLadder(priceUsd: number): number[] {
  if (priceUsd >= 10_000) return [0.001, 0.01, 0.1, 0.5, 1, 5, 10];
  if (priceUsd >= 100) return [0.01, 0.1, 1, 5, 10, 50, 100];
  if (priceUsd >= 1) return [0.1, 1, 10, 50, 100, 500, 1000];
  if (priceUsd >= 0.01) return [10, 100, 500, 1000, 5000, 10000];
  return [1000, 10000, 100000, 1000000, 10000000];
}

/**
 * Formats a COIN-denominated quantity (never a fiat amount — use
 * numFmt(lang).input for those). Unlike that fiat formatter, this keeps
 * enough decimal places that a value like 0.001 doesn't round to "0": fiat
 * amounts on this site are always round numbers by construction, but a
 * crypto quantity can be genuinely fractional and small.
 */
export function fmtCryptoAmount(v: number, lang: Lang): string {
  const tag = LOCALE_TAG[lang];
  if (v >= 1) return v.toLocaleString(tag, { maximumFractionDigits: 2 });
  const digits = v >= 0.01 ? 4 : v >= 0.0001 ? 6 : 8;
  return v.toLocaleString(tag, { maximumFractionDigits: digits });
}
