import { PULSE_CONTENT } from "./pulse.generated";
import type { Lang } from "./i18n";

// Query-intent landings: one page per question people actually type, with the
// live figures already on this site, a short answer and an FAQ. The question
// set is shared across locales so the hreflang cluster stays valid — each
// locale gets the phrasing its readers search for, not a translation.

export type PulseFaq = { q: string; a: string };

export type PulseText = {
  query: string;
  kicker: string;
  lead: string;
  faqs: PulseFaq[];
};

export type PulseLinks = {
  slug: string;
  /** Symbols shown with live prices. */
  quotes: string[];
  /** Currency-page slugs. */
  convert: string[];
  /** Site paths, prefixed per locale at render time. */
  hubs: string[];
};

export const PULSE_LINKS: PulseLinks[] = [
  { slug: "bitcoin-price-today", quotes: ["BTC-USD", "ETH-USD", "IBIT"], convert: ["usd-to-krw"], hubs: ["/markets/crypto", "/kimchi-premium", "/fear-greed"] },
  { slug: "usd-to-krw-today", quotes: ["KRW=X"], convert: ["usd-to-krw", "100-usd-to-krw", "1000-usd-to-krw", "krw-to-usd"], hubs: ["/convert/usd", "/convert/krw"] },
  { slug: "what-is-kimchi-premium", quotes: ["BTC-USD", "ETH-USD", "KRW=X"], convert: ["usd-to-krw"], hubs: ["/kimchi-premium", "/markets/crypto"] },
  { slug: "crypto-fear-and-greed-today", quotes: ["BTC-USD", "ETH-USD"], convert: [], hubs: ["/fear-greed", "/movers"] },
  { slug: "usd-to-jpy-today", quotes: ["JPY=X"], convert: ["usd-to-jpy", "100-usd-to-jpy", "jpy-to-usd", "jpy-to-krw"], hubs: ["/convert/usd", "/convert/jpy"] },
  { slug: "nikkei-225-today", quotes: ["^N225", "7203.T", "6758.T", "JPY=X"], convert: ["usd-to-jpy"], hubs: ["/markets/japan"] },
  { slug: "kospi-today", quotes: ["^KS11", "^KQ11", "005930.KS", "KRW=X"], convert: ["usd-to-krw"], hubs: ["/markets/korea"] },
  { slug: "sp500-today", quotes: ["^GSPC", "^IXIC", "^DJI", "SPY"], convert: [], hubs: ["/markets/us", "/movers"] },
  { slug: "gold-price-today", quotes: ["GC=F", "SI=F", "GLD"], convert: [], hubs: ["/markets/us", "/compare/gc-vs-btc"] },
  { slug: "samsung-electronics-stock-price", quotes: ["005930.KS", "000660.KS", "KRW=X"], convert: ["usd-to-krw"], hubs: ["/markets/korea", "/compare/005930-vs-000660"] },
  { slug: "nvidia-stock-price-today", quotes: ["NVDA", "AMD", "TSM"], convert: [], hubs: ["/markets/us", "/compare/nvda-vs-amd"] },
  { slug: "ethereum-price-today", quotes: ["ETH-USD", "BTC-USD", "SOL-USD"], convert: ["usd-to-krw"], hubs: ["/markets/crypto", "/compare/btc-vs-eth"] },
  { slug: "bitcoin-vs-gold", quotes: ["BTC-USD", "GC=F"], convert: [], hubs: ["/compare/gc-vs-btc", "/tools/invested"] },
  { slug: "how-much-is-100-dollars-in-won", quotes: ["KRW=X"], convert: ["100-usd-to-krw", "1000-usd-to-krw", "usd-to-krw", "krw-to-usd"], hubs: ["/convert/usd", "/convert"] },
];

export const PULSE_SLUGS: string[] = PULSE_LINKS.map((p) => p.slug);

export function pulseLinks(slug: string): PulseLinks | undefined {
  return PULSE_LINKS.find((p) => p.slug === slug);
}

export function pulseText(lang: Lang, slug: string): PulseText | undefined {
  return PULSE_CONTENT[lang]?.[slug];
}
