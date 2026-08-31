import type { Lang } from "./i18n";

export type SeasonalityCopy = {
  h1Suffix: string;
  sub: string;
  months: string[]; // 12, January..December
  matrixHeading: string;
  colMonth: string;
  hitRateLabel: string;
  medianLabel: string;
  bestLabel: string;
  worstLabel: string;
  avgLabel: string;
  annualHeading: string;
  colYear: string;
  colReturn: string;
  /** {N} {YEAR} */ sampleNote: string;
  disclaimer: string;
  unavailable: string;
  quoteLinkText: string;
  footer: string;
};

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_KO = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const MONTHS_JA = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

const EN: SeasonalityCopy = {
  h1Suffix: "Seasonality",
  sub: "Historical month-by-month and year-by-year returns",
  months: MONTHS_EN,
  matrixHeading: "By Month",
  colMonth: "Month",
  hitRateLabel: "% Positive",
  medianLabel: "Median",
  bestLabel: "Best",
  worstLabel: "Worst",
  avgLabel: "Average",
  annualHeading: "By Calendar Year",
  colYear: "Year",
  colReturn: "Return",
  sampleNote: "Based on {N} calendar years of monthly closes, starting {YEAR}.",
  disclaimer: "These are historical patterns, not a forecast — past calendar-month performance does not predict future returns.",
  unavailable: "Not enough price history is available to compute seasonality for this symbol (at least 10 years is needed).",
  quoteLinkText: "Live price & chart →",
  footer: "Figures are historical, exclude dividends, and are provided for information only, not investment advice.",
};

const KO: SeasonalityCopy = {
  h1Suffix: "계절성",
  sub: "월별·연도별 과거 수익률",
  months: MONTHS_KO,
  matrixHeading: "월별 통계",
  colMonth: "월",
  hitRateLabel: "상승 확률",
  medianLabel: "중앙값",
  bestLabel: "최고",
  worstLabel: "최저",
  avgLabel: "평균",
  annualHeading: "연도별 수익률",
  colYear: "연도",
  colReturn: "수익률",
  sampleNote: "{YEAR}년부터 {N}개 연도의 월말 종가를 기준으로 계산했습니다.",
  disclaimer: "이 수치는 과거 패턴일 뿐 미래를 예측하지 않습니다 — 특정 월의 과거 수익률이 앞으로도 반복된다는 보장은 없습니다.",
  unavailable: "이 종목은 계절성을 계산할 만큼 충분한 가격 이력(최소 10년)이 없습니다.",
  quoteLinkText: "실시간 시세·차트 보기 →",
  footer: "표시된 수치는 과거 실적이며 배당은 제외됩니다. 정보 제공 목적으로만 제공되며 투자 자문이 아닙니다.",
};

const JA: SeasonalityCopy = {
  h1Suffix: "季節性",
  sub: "月別・年別の過去のリターン",
  months: MONTHS_JA,
  matrixHeading: "月別統計",
  colMonth: "月",
  hitRateLabel: "上昇確率",
  medianLabel: "中央値",
  bestLabel: "最高",
  worstLabel: "最低",
  avgLabel: "平均",
  annualHeading: "年別リターン",
  colYear: "年",
  colReturn: "リターン",
  sampleNote: "{YEAR}年から{N}年分の月末終値をもとに算出しています。",
  disclaimer: "これは過去のパターンであり、将来を予測するものではありません — 特定の月の過去のリターンが今後も繰り返される保証はありません。",
  unavailable: "この銘柄は季節性を算出するのに十分な価格履歴(最低10年)がありません。",
  quoteLinkText: "リアルタイム株価・チャートを見る →",
  footer: "掲載データは過去の実績であり配当を含みません。情報提供のみを目的としており、投資助言ではありません。",
};

export const SEASONALITY_COPY: Record<Lang, SeasonalityCopy> = { en: EN, ko: KO, ja: JA };
export const seasonalityCopy = (lang: Lang): SeasonalityCopy => SEASONALITY_COPY[lang];
