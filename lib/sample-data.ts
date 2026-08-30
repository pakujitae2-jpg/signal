import type { CryptoCoin, CryptoGlobal, NewsItem, Quote } from "./types";

// Static snapshot used when upstream APIs are unreachable, so the page
// never renders empty. The UI shows a "sample data" note alongside it.

function wave(base: number, amp: number, n = 36, drift = 0): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    out.push(base + drift * t + amp * (Math.sin(t * 9.4) * 0.6 + Math.sin(t * 23.7 + 1.3) * 0.4));
  }
  return out;
}

function q(symbol: string, name: string, price: number, changePct: number, currency: string): Quote {
  const change = (price * changePct) / 100;
  return {
    symbol,
    name,
    price,
    change,
    changePct,
    currency,
    spark: wave(price - change, Math.abs(price) * 0.004 + 0.01, 36, change),
  };
}

export const SAMPLE_QUOTES: Quote[] = [
  q("^GSPC", "S&P 500", 5567.19, 0.61, "USD"),
  q("^IXIC", "Nasdaq Composite", 18352.76, 0.9, "USD"),
  q("^DJI", "Dow Jones", 39375.87, 0.17, "USD"),
  q("AAPL", "Apple", 226.34, 0.53, "USD"),
  q("MSFT", "Microsoft", 467.56, 1.02, "USD"),
  q("NVDA", "Nvidia", 125.83, 2.85, "USD"),
  q("GOOGL", "Alphabet", 191.18, -0.36, "USD"),
  q("AMZN", "Amazon", 200.0, 0.78, "USD"),
  q("TSLA", "Tesla", 251.52, -2.11, "USD"),
  q("^N225", "Nikkei 225", 40369.4, 0.56, "JPY"),
  q("7203.T", "Toyota Motor", 2789.5, 0.65, "JPY"),
  q("6758.T", "Sony Group", 13650, 1.42, "JPY"),
  q("9984.T", "SoftBank Group", 9182, -1.9, "JPY"),
  q("8306.T", "Mitsubishi UFJ", 1642.5, 0.21, "JPY"),
  q("6861.T", "Keyence", 66540, -0.44, "JPY"),
  q("7974.T", "Nintendo", 8451, 0.98, "JPY"),
  q("^KS11", "KOSPI", 2712.14, 0.84, "KRW"),
  q("^KQ11", "KOSDAQ", 861.53, -0.32, "KRW"),
  q("005930.KS", "Samsung Electronics", 78400, 1.16, "KRW"),
  q("000660.KS", "SK Hynix", 194500, 2.37, "KRW"),
  q("373220.KS", "LG Energy Solution", 342000, -0.87, "KRW"),
  q("005380.KS", "Hyundai Motor", 251500, 0.4, "KRW"),
  q("035420.KS", "Naver", 168200, -1.06, "KRW"),
  q("035720.KS", "Kakao", 41850, 0.72, "KRW"),
  q("JPY=X", "USD/JPY", 153.86, -0.31, "JPY"),
  q("KRW=X", "USD/KRW", 1384.5, 0.22, "KRW"),
  q("GC=F", "Gold", 2397.7, 0.45, "USD"),
  q("CL=F", "WTI Crude", 83.16, -0.85, "USD"),
];

function c(rank: number, id: string, symbol: string, name: string, price: number, changePct24h: number, marketCap: number): CryptoCoin {
  return {
    id,
    rank,
    symbol,
    name,
    price,
    changePct24h,
    marketCap,
    spark: wave(price * (1 - changePct24h / 100), price * 0.012, 36, (price * changePct24h) / 100),
  };
}

export const SAMPLE_CRYPTO: CryptoCoin[] = [
  c(1, "bitcoin", "BTC", "Bitcoin", 64210, 1.8, 1266e9),
  c(2, "ethereum", "ETH", "Ethereum", 3412, 2.4, 410e9),
  c(3, "tether", "USDT", "Tether", 1.0, 0.01, 114e9),
  c(4, "binancecoin", "BNB", "BNB", 586, -0.7, 86e9),
  c(5, "solana", "SOL", "Solana", 152.3, 4.1, 70e9),
  c(6, "usd-coin", "USDC", "USD Coin", 1.0, 0.0, 34e9),
  c(7, "ripple", "XRP", "XRP", 0.512, -1.2, 28e9),
  c(8, "dogecoin", "DOGE", "Dogecoin", 0.118, 3.2, 17e9),
  c(9, "cardano", "ADA", "Cardano", 0.41, -0.5, 14e9),
  c(10, "tron", "TRX", "TRON", 0.132, 0.9, 11e9),
];

export const SAMPLE_CRYPTO_GLOBAL: CryptoGlobal = {
  totalMarketCapUsd: 2.31e12,
  btcDominance: 54.8,
  changePct24h: 1.4,
};

export const SAMPLE_NEWS: NewsItem[] = [
  { title: "[Sample] Chip rally lifts Asian equities as foreign buying returns", link: "#", source: "Sample", publishedAt: new Date(Date.now() - 12 * 60000).toISOString(), category: "stock" },
  { title: "[Sample] Bitcoin reclaims $64,000 on renewed institutional inflows", link: "#", source: "Sample", publishedAt: new Date(Date.now() - 25 * 60000).toISOString(), category: "crypto" },
  { title: "[Sample] Nikkei climbs as weaker yen boosts exporters", link: "#", source: "Sample", publishedAt: new Date(Date.now() - 41 * 60000).toISOString(), category: "stock" },
  { title: "[Sample] Markets tread water ahead of Federal Reserve rate decision", link: "#", source: "Sample", publishedAt: new Date(Date.now() - 58 * 60000).toISOString(), category: "economy" },
  { title: "[Sample] Nvidia hits record high on sustained AI demand", link: "#", source: "Sample", publishedAt: new Date(Date.now() - 76 * 60000).toISOString(), category: "stock" },
  { title: "[Sample] Dollar steadies as traders weigh policy outlook", link: "#", source: "Sample", publishedAt: new Date(Date.now() - 95 * 60000).toISOString(), category: "economy" },
  { title: "[Sample] Ethereum ETF flows turn positive for a third week", link: "#", source: "Sample", publishedAt: new Date(Date.now() - 110 * 60000).toISOString(), category: "crypto" },
  { title: "[Sample] Oil slips on demand concerns despite supply cuts", link: "#", source: "Sample", publishedAt: new Date(Date.now() - 130 * 60000).toISOString(), category: "economy" },
];
