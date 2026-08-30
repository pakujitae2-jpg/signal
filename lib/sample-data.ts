import type { CryptoCoin, CryptoGlobal, NewsItem, Quote } from "./types";

// 업스트림 API 장애·차단 시 화면이 비지 않도록 쓰는 정적 스냅샷.
// UI에는 "샘플 데이터" 배지가 함께 표시된다.

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
  q("^KS11", "코스피", 2712.14, 0.84, "KRW"),
  q("^KQ11", "코스닥", 861.53, -0.32, "KRW"),
  q("005930.KS", "삼성전자", 78400, 1.16, "KRW"),
  q("000660.KS", "SK하이닉스", 194500, 2.37, "KRW"),
  q("373220.KS", "LG에너지솔루션", 342000, -0.87, "KRW"),
  q("005380.KS", "현대차", 251500, 0.4, "KRW"),
  q("035420.KS", "NAVER", 168200, -1.06, "KRW"),
  q("035720.KS", "카카오", 41850, 0.72, "KRW"),
  q("^N225", "닛케이 225", 40369.4, 0.56, "JPY"),
  q("7203.T", "도요타", 2789.5, 0.65, "JPY"),
  q("6758.T", "소니그룹", 13650, 1.42, "JPY"),
  q("9984.T", "소프트뱅크그룹", 9182, -1.9, "JPY"),
  q("8306.T", "미쓰비시UFJ", 1642.5, 0.21, "JPY"),
  q("6861.T", "키엔스", 66540, -0.44, "JPY"),
  q("7974.T", "닌텐도", 8451, 0.98, "JPY"),
  q("^GSPC", "S&P 500", 5567.19, 0.61, "USD"),
  q("^IXIC", "나스닥 종합", 18352.76, 0.9, "USD"),
  q("^DJI", "다우존스", 39375.87, 0.17, "USD"),
  q("AAPL", "애플", 226.34, 0.53, "USD"),
  q("MSFT", "마이크로소프트", 467.56, 1.02, "USD"),
  q("NVDA", "엔비디아", 125.83, 2.85, "USD"),
  q("GOOGL", "알파벳", 191.18, -0.36, "USD"),
  q("AMZN", "아마존", 200.0, 0.78, "USD"),
  q("TSLA", "테슬라", 251.52, -2.11, "USD"),
  q("KRW=X", "달러/원", 1384.5, 0.22, "KRW"),
  q("JPY=X", "달러/엔", 153.86, -0.31, "JPY"),
  q("GC=F", "금", 2397.7, 0.45, "USD"),
  q("CL=F", "WTI 원유", 83.16, -0.85, "USD"),
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
  c(1, "bitcoin", "BTC", "비트코인", 64210, 1.8, 1266e9),
  c(2, "ethereum", "ETH", "이더리움", 3412, 2.4, 410e9),
  c(3, "tether", "USDT", "테더", 1.0, 0.01, 114e9),
  c(4, "binancecoin", "BNB", "BNB", 586, -0.7, 86e9),
  c(5, "solana", "SOL", "솔라나", 152.3, 4.1, 70e9),
  c(6, "usd-coin", "USDC", "USD코인", 1.0, 0.0, 34e9),
  c(7, "ripple", "XRP", "리플", 0.512, -1.2, 28e9),
  c(8, "dogecoin", "DOGE", "도지코인", 0.118, 3.2, 17e9),
  c(9, "cardano", "ADA", "에이다", 0.41, -0.5, 14e9),
  c(10, "tron", "TRX", "트론", 0.132, 0.9, 11e9),
];

export const SAMPLE_CRYPTO_GLOBAL: CryptoGlobal = {
  totalMarketCapUsd: 2.31e12,
  btcDominance: 54.8,
  changePct24h: 1.4,
};

export const SAMPLE_NEWS: NewsItem[] = [
  { title: "[샘플] 코스피, 외국인 매수세에 상승 마감…반도체 강세", link: "#", source: "샘플", publishedAt: new Date(Date.now() - 12 * 60000).toISOString(), category: "stock" },
  { title: "[샘플] 비트코인, 기관 자금 유입에 6만 4천 달러 회복", link: "#", source: "샘플", publishedAt: new Date(Date.now() - 25 * 60000).toISOString(), category: "crypto" },
  { title: "[샘플] 닛케이, 엔저 흐름 속 수출주 중심 강세", link: "#", source: "샘플", publishedAt: new Date(Date.now() - 41 * 60000).toISOString(), category: "stock" },
  { title: "[샘플] 미 연준 금리 결정 앞두고 관망세 짙어져", link: "#", source: "샘플", publishedAt: new Date(Date.now() - 58 * 60000).toISOString(), category: "economy" },
  { title: "[샘플] 엔비디아, AI 수요 확대에 신고가 경신", link: "#", source: "샘플", publishedAt: new Date(Date.now() - 76 * 60000).toISOString(), category: "stock" },
  { title: "[샘플] 원/달러 환율, 1,380원대 등락 반복", link: "#", source: "샘플", publishedAt: new Date(Date.now() - 95 * 60000).toISOString(), category: "economy" },
];
