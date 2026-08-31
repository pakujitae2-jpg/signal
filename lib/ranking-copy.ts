import type { Lang } from "./i18n";

export type RankingCopy = {
  hubTitle: string;
  hubDescription: string;
  hubH1: string;
  hubSub: string;
  metricLabels: { "52-week-high": string; "52-week-low": string };
  marketLabels: { us: string; japan: string; korea: string; crypto: string };
  /** {METRIC} {MARKET} */ title: string;
  /** {METRIC} {MARKET} */ description: string;
  /** {METRIC} {MARKET} */ h1: string;
  colName: string;
  colPrice: string;
  colDistanceHigh: string;
  colDistanceLow: string;
  aboutHeading: string;
  /** {METRIC} */ aboutP: string;
  unavailable: string;
  otherHeading: string;
  footer: string;
};

const EN: RankingCopy = {
  hubTitle: "Stock Rankings by Market — PNL404",
  hubDescription: "52-week high and low rankings across US, Japanese, Korean and crypto markets, with live prices and distance from the extreme.",
  hubH1: "Rankings",
  hubSub: "52-week highs and lows, by market",
  metricLabels: { "52-week-high": "52-Week High", "52-week-low": "52-Week Low" },
  marketLabels: { us: "US Stocks", japan: "Japan Stocks", korea: "Korea Stocks", crypto: "Crypto" },
  title: "{MARKET} {METRIC} Ranking",
  description: "{MARKET} ranked by distance from its {METRIC} over the past year, with live prices.",
  h1: "{MARKET} {METRIC}",
  colName: "Name",
  colPrice: "Price",
  colDistanceHigh: "% from high",
  colDistanceLow: "% from low",
  aboutHeading: "About This Ranking",
  aboutP: "The {METRIC} is the highest or lowest daily close over the trailing year among the symbols this site tracks in this market — not the whole market, and not necessarily a true multi-year all-time extreme. Symbols closest to 0% are at or near a fresh {METRIC}.",
  unavailable: "Live data for this ranking is not available right now.",
  otherHeading: "Other Rankings",
  footer: "Market data may be delayed and is provided for information only, not investment advice.",
};

const KO: RankingCopy = {
  hubTitle: "시장별 종목 랭킹 — PNL404",
  hubDescription: "미국, 일본, 한국, 가상자산 시장의 52주 신고가·신저가 랭킹을 실시간 시세와 함께 제공합니다.",
  hubH1: "랭킹",
  hubSub: "시장별 52주 신고가·신저가",
  metricLabels: { "52-week-high": "52주 신고가", "52-week-low": "52주 신저가" },
  marketLabels: { us: "미국 증시", japan: "일본 증시", korea: "한국 증시", crypto: "가상자산" },
  title: "{MARKET} {METRIC} 랭킹",
  description: "최근 1년간 {METRIC} 대비 얼마나 근접했는지를 기준으로 {MARKET} 종목의 순위를 매깁니다. 실시간 시세를 함께 제공합니다.",
  h1: "{MARKET} {METRIC}",
  colName: "종목명",
  colPrice: "현재가",
  colDistanceHigh: "고점 대비",
  colDistanceLow: "저점 대비",
  aboutHeading: "이 랭킹에 대하여",
  aboutP: "{METRIC}는 이 사이트가 추적하는 이 시장의 종목들 가운데 최근 1년간 일별 종가 기준 최고가 또는 최저가입니다. 시장 전체를 대상으로 한 것이 아니며, 반드시 수년에 걸친 진짜 사상 최고가·최저가를 의미하지도 않습니다. 0%에 가까울수록 최근 {METRIC}에 근접했거나 이를 새로 경신했다는 뜻입니다.",
  unavailable: "현재 이 랭킹의 실시간 시세를 불러올 수 없습니다.",
  otherHeading: "다른 랭킹",
  footer: "시세 정보는 지연될 수 있으며, 투자 참고용으로만 제공됩니다. 투자 권유가 아닙니다.",
};

const JA: RankingCopy = {
  hubTitle: "市場別銘柄ランキング｜PNL404",
  hubDescription: "米国株・日本株・韓国株・暗号資産市場の52週高値・安値ランキングをリアルタイム価格とともに提供します。",
  hubH1: "ランキング",
  hubSub: "市場別52週高値・安値",
  metricLabels: { "52-week-high": "52週高値", "52-week-low": "52週安値" },
  marketLabels: { us: "米国株", japan: "日本株", korea: "韓国株", crypto: "暗号資産" },
  title: "{MARKET} {METRIC}ランキング",
  description: "直近1年間の{METRIC}にどれだけ近いかで{MARKET}銘柄を順位付けしています。リアルタイム価格も確認できます。",
  h1: "{MARKET} {METRIC}",
  colName: "銘柄名",
  colPrice: "現在値",
  colDistanceHigh: "高値からの乖離",
  colDistanceLow: "安値からの乖離",
  aboutHeading: "このランキングについて",
  aboutP: "{METRIC}は、本サイトがこの市場で追跡している銘柄のうち、直近1年間の日次終値ベースでの最高値または最安値です。市場全体を対象としたものではなく、必ずしも複数年にわたる本当の史上高値・安値を意味するものでもありません。0%に近いほど、直近の{METRIC}に近い、または更新したことを示します。",
  unavailable: "現在このランキングのリアルタイム価格を取得できません。",
  otherHeading: "他のランキング",
  footer: "掲載している価格情報は遅延する場合があり、情報提供のみを目的としています。投資助言ではありません。",
};

export const RANKING_COPY: Record<Lang, RankingCopy> = { en: EN, ko: KO, ja: JA };
export const rankingCopy = (lang: Lang): RankingCopy => RANKING_COPY[lang];
