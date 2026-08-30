import type { Lang } from "./i18n";
import { PAGE_COPY } from "./page-copy.generated";

// Copy for the kimchi premium, Fear & Greed and market hub pages in every
// locale. The shapes below are what lib/page-copy.generated.ts must satisfy,
// so a missing key fails the type-check rather than shipping blank text.

export type KimchiCopy = {
  title: string;
  description: string;
  h1: string;
  sub: string;
  rightNow: string;
  btcPremium: string;
  /** Contains {n} for the coin count. */
  avgPremium: string;
  usdKrw: string;
  byCoin: string;
  byCoinNote: string;
  colCoin: string;
  colUpbit: string;
  colGlobal: string;
  colGlobalKrw: string;
  colPremium: string;
  whatIsHeading: string;
  whatIsP1: string;
  whatIsP2: string;
  howHeading: string;
  howP: string;
  tradeHeading: string;
  partnerOffers: string;
  sampleNote: string;
  footer: string;
};

export type FearGreedCopy = {
  title: string;
  description: string;
  h1: string;
  sub: string;
  todayHeading: string;
  todayNote: string;
  yesterday: string;
  lastWeek: string;
  lastMonth: string;
  historyHeading: string;
  extremeFear: string;
  fear: string;
  neutral: string;
  greed: string;
  extremeGreed: string;
  howHeading: string;
  howP1: string;
  howP2: string;
  howP3: string;
  relatedPrefix: string;
  kimchiLinkText: string;
  relatedMiddle: string;
  cryptoLinkText: string;
  relatedSuffix: string;
  tradeHeading: string;
  partnerOffers: string;
  sampleNote: string;
  footer: string;
};

type MarketsCommon = {
  title: string;
  description: string;
  h1: string;
  sub: string;
  aboutHeading: string;
  aboutP1: string;
  aboutP2: string;
  tradeHeading: string;
  partnerOffers: string;
  footer: string;
};

export type MarketsEquityCopy = MarketsCommon & {
  benchmarks: string;
  topStocks: string;
  topStocksNote: string;
  colCompany: string;
  colLast: string;
  colChg: string;
  colChgPct: string;
};

export type MarketsCryptoCopy = MarketsCommon & {
  overview: string;
  totalMarketCap: string;
  btcDominance: string;
  kimchiLinkText: string;
  colRank: string;
  colName: string;
  colPrice: string;
  col24h: string;
  colMktCap: string;
};

export type PageCopy = {
  kimchi: Record<Lang, KimchiCopy>;
  feargreed: Record<Lang, FearGreedCopy>;
  "markets-us": Record<Lang, MarketsEquityCopy>;
  "markets-japan": Record<Lang, MarketsEquityCopy>;
  "markets-korea": Record<Lang, MarketsEquityCopy>;
  "markets-crypto": Record<Lang, MarketsCryptoCopy>;
};

export const kimchiCopy = (lang: Lang): KimchiCopy => PAGE_COPY.kimchi[lang];
export const fearGreedCopy = (lang: Lang): FearGreedCopy => PAGE_COPY.feargreed[lang];

export type RegionKey = "us" | "japan" | "korea" | "crypto";
export const REGION_KEYS: RegionKey[] = ["us", "japan", "korea", "crypto"];

export const marketsEquityCopy = (lang: Lang, region: "us" | "japan" | "korea"): MarketsEquityCopy =>
  PAGE_COPY[`markets-${region}` as const][lang];
export const marketsCryptoCopy = (lang: Lang): MarketsCryptoCopy => PAGE_COPY["markets-crypto"][lang];

/** Title / description / H1 for any region, without picking a variant. */
export function marketsMeta(lang: Lang, region: RegionKey): MarketsCommon {
  return region === "crypto" ? marketsCryptoCopy(lang) : marketsEquityCopy(lang, region);
}
