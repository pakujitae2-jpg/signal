export type SymbolDef = {
  symbol: string;
  name: string;
  currency: string;
  group: "us-index" | "us-stock" | "jp-index" | "jp-stock" | "kr-index" | "kr-stock" | "fx" | "commodity";
};

export const SYMBOLS: SymbolDef[] = [
  // United States
  { symbol: "^GSPC", name: "S&P 500", currency: "USD", group: "us-index" },
  { symbol: "^IXIC", name: "Nasdaq Composite", currency: "USD", group: "us-index" },
  { symbol: "^DJI", name: "Dow Jones", currency: "USD", group: "us-index" },
  { symbol: "AAPL", name: "Apple", currency: "USD", group: "us-stock" },
  { symbol: "MSFT", name: "Microsoft", currency: "USD", group: "us-stock" },
  { symbol: "NVDA", name: "Nvidia", currency: "USD", group: "us-stock" },
  { symbol: "GOOGL", name: "Alphabet", currency: "USD", group: "us-stock" },
  { symbol: "AMZN", name: "Amazon", currency: "USD", group: "us-stock" },
  { symbol: "TSLA", name: "Tesla", currency: "USD", group: "us-stock" },
  // Japan
  { symbol: "^N225", name: "Nikkei 225", currency: "JPY", group: "jp-index" },
  { symbol: "7203.T", name: "Toyota Motor", currency: "JPY", group: "jp-stock" },
  { symbol: "6758.T", name: "Sony Group", currency: "JPY", group: "jp-stock" },
  { symbol: "9984.T", name: "SoftBank Group", currency: "JPY", group: "jp-stock" },
  { symbol: "8306.T", name: "Mitsubishi UFJ", currency: "JPY", group: "jp-stock" },
  { symbol: "6861.T", name: "Keyence", currency: "JPY", group: "jp-stock" },
  { symbol: "7974.T", name: "Nintendo", currency: "JPY", group: "jp-stock" },
  // South Korea
  { symbol: "^KS11", name: "KOSPI", currency: "KRW", group: "kr-index" },
  { symbol: "^KQ11", name: "KOSDAQ", currency: "KRW", group: "kr-index" },
  { symbol: "005930.KS", name: "Samsung Electronics", currency: "KRW", group: "kr-stock" },
  { symbol: "000660.KS", name: "SK Hynix", currency: "KRW", group: "kr-stock" },
  { symbol: "373220.KS", name: "LG Energy Solution", currency: "KRW", group: "kr-stock" },
  { symbol: "005380.KS", name: "Hyundai Motor", currency: "KRW", group: "kr-stock" },
  { symbol: "035420.KS", name: "Naver", currency: "KRW", group: "kr-stock" },
  { symbol: "035720.KS", name: "Kakao", currency: "KRW", group: "kr-stock" },
  // FX
  { symbol: "JPY=X", name: "USD/JPY", currency: "JPY", group: "fx" },
  { symbol: "KRW=X", name: "USD/KRW", currency: "KRW", group: "fx" },
  // Commodities
  { symbol: "GC=F", name: "Gold", currency: "USD", group: "commodity" },
  { symbol: "CL=F", name: "WTI Crude", currency: "USD", group: "commodity" },
];

export const NEWS_FEEDS: { url: string; source: string; category: "crypto" | "stock" | "economy" }[] = [
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", source: "CoinDesk", category: "crypto" },
  { url: "https://finance.yahoo.com/news/rssindex", source: "Yahoo Finance", category: "stock" },
  { url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", source: "MarketWatch", category: "stock" },
  { url: "https://www.cnbc.com/id/100003114/device/rss/rss.html", source: "CNBC", category: "economy" },
  { url: "https://asia.nikkei.com/rss/feed/nar", source: "Nikkei Asia", category: "economy" },
];
