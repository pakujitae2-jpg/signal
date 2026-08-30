import type { Lang } from "./i18n";
import { HOME_COPY } from "./home-copy.generated";

// Front-page and pulse-landing copy. Dashboard is a client component, so
// everything it renders has to arrive as plain strings — no functions.

export type HomeCopy = {
  title: string;
  description: string;
  tagline: string;
  /** {time} */ updated: string;
  navAria: string;
  navUs: string;
  navJapan: string;
  navKorea: string;
  navCrypto: string;
  navKimchi: string;
  navFearGreed: string;
  navCurrencies: string;
  navMovers: string;
  navCompare: string;
  navInvested: string;
  navQuotes: string;
  navSearch: string;
  /** {parts} */ sampleNote: string;
  samplePartQuotes: string;
  samplePartCrypto: string;
  samplePartNews: string;
  cryptoHeading: string;
  cryptoLiveNote: string;
  cryptoStaticNote: string;
  totalMarketCap: string;
  change24h: string;
  btcDominance: string;
  kimchiLink: string;
  fearGreedLink: string;
  glanceHeading: string;
  equitiesHeading: string;
  equitiesNote: string;
  regionUsTitle: string;
  regionUsVenue: string;
  regionJapanTitle: string;
  regionJapanVenue: string;
  regionKoreaTitle: string;
  regionKoreaVenue: string;
  fxHeading: string;
  fxNote: string;
  newsHeading: string;
  newsCatCrypto: string;
  newsCatStock: string;
  newsCatEconomy: string;
  tradeHeading: string;
  colCompany: string;
  colLast: string;
  colChg: string;
  colChgPct: string;
  colName: string;
  colPrice: string;
  col24h: string;
  colMktCap: string;
};

export type PulseCopy = {
  /** {QUERY} */ title: string;
  /** {QUERY} */ description: string;
  hubTitle: string;
  hubDescription: string;
  hubH1: string;
  /** {n} */ hubSub: string;
  faqHeading: string;
  relatedQuotesHeading: string;
  relatedConvertHeading: string;
  relatedHubsHeading: string;
  popularHeading: string;
  updatedNote: string;
  footer: string;
};

export type HomeCopyBundle = {
  home: Record<Lang, HomeCopy>;
  pulse: Record<Lang, PulseCopy>;
};

export const homeCopy = (lang: Lang): HomeCopy => HOME_COPY.home[lang];
export const pulseCopy = (lang: Lang): PulseCopy => HOME_COPY.pulse[lang];
