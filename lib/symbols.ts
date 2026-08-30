export type SymbolDef = {
  symbol: string;
  name: string;
  currency: string;
  group: "us-index" | "us-stock" | "jp-index" | "jp-stock" | "kr-index" | "kr-stock" | "fx" | "commodity";
};

export const SYMBOLS: SymbolDef[] = [
  // 한국
  { symbol: "^KS11", name: "코스피", currency: "KRW", group: "kr-index" },
  { symbol: "^KQ11", name: "코스닥", currency: "KRW", group: "kr-index" },
  { symbol: "005930.KS", name: "삼성전자", currency: "KRW", group: "kr-stock" },
  { symbol: "000660.KS", name: "SK하이닉스", currency: "KRW", group: "kr-stock" },
  { symbol: "373220.KS", name: "LG에너지솔루션", currency: "KRW", group: "kr-stock" },
  { symbol: "005380.KS", name: "현대차", currency: "KRW", group: "kr-stock" },
  { symbol: "035420.KS", name: "NAVER", currency: "KRW", group: "kr-stock" },
  { symbol: "035720.KS", name: "카카오", currency: "KRW", group: "kr-stock" },
  // 일본
  { symbol: "^N225", name: "닛케이 225", currency: "JPY", group: "jp-index" },
  { symbol: "7203.T", name: "도요타", currency: "JPY", group: "jp-stock" },
  { symbol: "6758.T", name: "소니그룹", currency: "JPY", group: "jp-stock" },
  { symbol: "9984.T", name: "소프트뱅크그룹", currency: "JPY", group: "jp-stock" },
  { symbol: "8306.T", name: "미쓰비시UFJ", currency: "JPY", group: "jp-stock" },
  { symbol: "6861.T", name: "키엔스", currency: "JPY", group: "jp-stock" },
  { symbol: "7974.T", name: "닌텐도", currency: "JPY", group: "jp-stock" },
  // 미국
  { symbol: "^GSPC", name: "S&P 500", currency: "USD", group: "us-index" },
  { symbol: "^IXIC", name: "나스닥 종합", currency: "USD", group: "us-index" },
  { symbol: "^DJI", name: "다우존스", currency: "USD", group: "us-index" },
  { symbol: "AAPL", name: "애플", currency: "USD", group: "us-stock" },
  { symbol: "MSFT", name: "마이크로소프트", currency: "USD", group: "us-stock" },
  { symbol: "NVDA", name: "엔비디아", currency: "USD", group: "us-stock" },
  { symbol: "GOOGL", name: "알파벳", currency: "USD", group: "us-stock" },
  { symbol: "AMZN", name: "아마존", currency: "USD", group: "us-stock" },
  { symbol: "TSLA", name: "테슬라", currency: "USD", group: "us-stock" },
  // 환율
  { symbol: "KRW=X", name: "달러/원", currency: "KRW", group: "fx" },
  { symbol: "JPY=X", name: "달러/엔", currency: "JPY", group: "fx" },
  // 원자재
  { symbol: "GC=F", name: "금", currency: "USD", group: "commodity" },
  { symbol: "CL=F", name: "WTI 원유", currency: "USD", group: "commodity" },
];

export const NEWS_FEEDS: { url: string; source: string; category: "crypto" | "stock" | "economy" }[] = [
  { url: "https://www.hankyung.com/feed/economy", source: "한국경제", category: "economy" },
  { url: "https://www.mk.co.kr/rss/50200011/", source: "매일경제 증권", category: "stock" },
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss/", source: "CoinDesk", category: "crypto" },
  { url: "https://finance.yahoo.com/news/rssindex", source: "Yahoo Finance", category: "stock" },
];
