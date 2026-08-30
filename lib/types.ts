export type Quote = {
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  currency: string;
  spark?: number[];
};

export type CryptoCoin = {
  id: string;
  rank: number;
  symbol: string;
  name: string;
  price: number;
  changePct24h: number | null;
  marketCap: number;
  spark?: number[];
};

export type CryptoGlobal = {
  totalMarketCapUsd: number;
  btcDominance: number;
  changePct24h: number | null;
};

export type NewsCategory = "crypto" | "stock" | "economy";

export type NewsItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  category: NewsCategory;
};

export type SourceState = "live" | "sample";

export type MarketData = {
  updatedAt: string;
  sources: {
    quotes: SourceState;
    crypto: SourceState;
    news: SourceState;
  };
  cryptoGlobal: CryptoGlobal | null;
  crypto: CryptoCoin[];
  regions: {
    us: { indices: Quote[]; stocks: Quote[] };
    jp: { indices: Quote[]; stocks: Quote[] };
    kr: { indices: Quote[]; stocks: Quote[] };
  };
  fx: Quote[];
  commodities: Quote[];
  news: NewsItem[];
};
