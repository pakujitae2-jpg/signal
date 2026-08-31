import { getQuoteDetail } from "./quote";

// Gold priced in the units Koreans actually buy it in: 원/g and 원/돈 (1 don =
// 3.75g), not USD/troy oz. GC=F (COMEX gold futures, USD/oz) and KRW=X are
// both already fetched elsewhere on the site; this is pure unit conversion,
// no new upstream call.

export const OZ_TO_GRAM = 31.1034768; // troy ounce, exact by definition
export const DON_TO_GRAM = 3.75; // Korean gold-weight unit

export type Karat = 24 | 18 | 14;
export const KARATS: Karat[] = [24, 18, 14];
/** Fine-gold fraction by karat (24K = 24/24). */
export const KARAT_FRACTION: Record<Karat, number> = { 24: 1, 18: 18 / 24, 14: 14 / 24 };

export const DON_PRESETS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type GoldPrice = {
  usdPerOz: number;
  usdKrw: number;
  /** 원/g at 24K (pure) fineness — multiply by a karat fraction for other purities. */
  krwPerGram: number;
  krwPerDon: number;
  asOf: string;
};

/**
 * International-spot basis only (GC=F converted through KRW=X). This is NOT
 * the domestic 소매 살때 price, which runs materially higher once VAT and
 * dealer margin are added — the page must label the basis, not present this
 * as a retail quote.
 */
export async function getGoldPriceKrw(): Promise<GoldPrice | null> {
  const [gold, fx] = await Promise.all([getQuoteDetail("GC=F", "1d"), getQuoteDetail("KRW=X", "1d")]);
  if (!gold || gold.source !== "live" || gold.price === null) return null;
  if (!fx || fx.source !== "live" || fx.price === null) return null;
  const krwPerGram = (gold.price * fx.price) / OZ_TO_GRAM;
  return {
    usdPerOz: gold.price,
    usdKrw: fx.price,
    krwPerGram,
    krwPerDon: krwPerGram * DON_TO_GRAM,
    asOf: new Date().toISOString(),
  };
}

export function priceForGrams(base: GoldPrice, grams: number, karat: Karat): number {
  return base.krwPerGram * grams * KARAT_FRACTION[karat];
}

export function isKarat(n: number): n is Karat {
  return (KARATS as number[]).includes(n);
}

export function parseKarat(raw: string | undefined): Karat {
  const n = Number(raw);
  return isKarat(n) ? n : 24;
}

/** Clamp a query-string gram amount to something sane; falls back to 1 don. */
export function parseGrams(raw: string | undefined): number {
  const n = Number(raw);
  if (!isFinite(n) || n <= 0) return DON_TO_GRAM;
  return Math.min(n, 100_000);
}

/** Clamp a query-string don amount; falls back to 1. */
export function parseDon(raw: string | undefined): number {
  const n = Number(raw);
  if (!isFinite(n) || n <= 0) return 1;
  return Math.min(n, 100_000 / DON_TO_GRAM);
}

export function donSlug(n: number): string {
  return `${n}-don`;
}

/** Parses a "{n}-don" route segment; returns null unless n is one of DON_PRESETS. */
export function parseDonSlug(slug: string): number | null {
  const m = /^(\d{1,2})-don$/.exec(slug);
  if (!m) return null;
  const n = Number(m[1]);
  return DON_PRESETS.includes(n) ? n : null;
}
