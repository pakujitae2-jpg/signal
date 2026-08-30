import { SYMBOLS } from "./symbols";

// Symbols worth an indexable quote page beyond what the front page shows.
// /quote/[symbol] already serves any of these; listing them in the sitemap
// is what makes search engines crawl them.

const US_STOCKS = [
  "META", "AVGO", "BRK-B", "JPM", "V", "UNH", "XOM", "LLY", "WMT", "MA",
  "JNJ", "PG", "HD", "COST", "ORCL", "ABBV", "BAC", "CRM", "KO", "NFLX",
  "AMD", "PEP", "TMO", "CSCO", "ADBE", "MCD", "WFC", "ABT", "QCOM", "IBM",
  "GE", "CAT", "VZ", "DIS", "INTC", "GS", "MS", "PFE", "UBER", "PLTR",
  "TXN", "AMGN", "NKE", "HON", "SBUX", "BA", "PYPL", "C", "SHOP", "COIN",
  "MSTR", "HOOD", "SNOW", "ARM", "SMCI",
];

const JP_STOCKS = [
  "6501.T", "8035.T", "6098.T", "9433.T", "9432.T", "8058.T", "8001.T",
  "7267.T", "7011.T", "6902.T", "4063.T", "6367.T", "9983.T", "8316.T",
  "6146.T", "6857.T",
];

const KR_STOCKS = [
  "005490.KS", "051910.KS", "006400.KS", "000270.KS", "105560.KS",
  "055550.KS", "012450.KS", "042660.KS", "009540.KS", "068270.KS",
  "207940.KS", "028260.KS", "032830.KS", "015760.KS", "247540.KQ",
];

const CRYPTO = [
  "BTC-USD", "ETH-USD", "BNB-USD", "SOL-USD", "XRP-USD", "DOGE-USD",
  "ADA-USD", "TRX-USD", "AVAX-USD", "LINK-USD", "DOT-USD", "LTC-USD",
  "BCH-USD", "SHIB-USD", "UNI-USD", "ATOM-USD", "XLM-USD", "NEAR-USD",
  "APT-USD", "ARB-USD", "OP-USD",
];

const FX_COMMODITIES = ["EURUSD=X", "GBPUSD=X", "AUDUSD=X", "SI=F", "NG=F"];

export const POPULAR_SYMBOLS: string[] = Array.from(
  new Set([
    ...SYMBOLS.map((s) => s.symbol),
    ...US_STOCKS,
    ...JP_STOCKS,
    ...KR_STOCKS,
    ...CRYPTO,
    ...FX_COMMODITIES,
  ])
);
