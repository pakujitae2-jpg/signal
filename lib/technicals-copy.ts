import type { Lang } from "./i18n";

export type TechnicalsCopy = {
  h1Suffix: string;
  sub: string;
  asOf: string;
  momentumHeading: string;
  rsiLabel: string;
  stochLabel: string;
  williamsLabel: string;
  cciLabel: string;
  overbought: string;
  oversold: string;
  neutral: string;
  trendHeading: string;
  macdLabel: string;
  macdHist: string;
  adxLabel: string;
  atrLabel: string;
  strongTrend: string;
  weakTrend: string;
  maHeading: string;
  maSummary: string; // {N} {TOTAL}
  colPeriod: string;
  colSma: string;
  colEma: string;
  bollingerHeading: string;
  colUpper: string;
  colMiddle: string;
  colLower: string;
  pivotsHeading: string;
  pivotsNote: string;
  colMethod: string;
  screenerLinkText: string;
  quoteLinkText: string;
  unavailable: string;
  ma200Gated: string;
  footer: string;

  screenerTitle: string;
  screenerDescription: string;
  screenerH1: string;
  screenerSub: string;
  colCoin: string;
  colPrice: string;
  colRsi: string;
  colSma20: string;
  colSma50: string;
  aboveMa: string;
  belowMa: string;
};

const EN: TechnicalsCopy = {
  h1Suffix: "Technical Indicators",
  sub: "Momentum, trend and pivot readings computed from daily prices",
  asOf: "as of",
  momentumHeading: "Momentum",
  rsiLabel: "RSI (14)",
  stochLabel: "Stochastic %K / %D",
  williamsLabel: "Williams %R (14)",
  cciLabel: "CCI (20)",
  overbought: "overbought",
  oversold: "oversold",
  neutral: "neutral",
  trendHeading: "Trend",
  macdLabel: "MACD (12, 26)",
  macdHist: "Histogram",
  adxLabel: "ADX (14)",
  atrLabel: "ATR (14)",
  strongTrend: "trending",
  weakTrend: "range-bound",
  maHeading: "Moving Averages",
  maSummary: "Price is above {N} of {TOTAL} simple moving averages.",
  colPeriod: "Period",
  colSma: "SMA",
  colEma: "EMA",
  bollingerHeading: "Bollinger Bands (20, 2)",
  colUpper: "Upper",
  colMiddle: "Middle",
  colLower: "Lower",
  pivotsHeading: "Pivot Points",
  pivotsNote: "Computed from the prior day's high, low, close (and open, for Demark). These are calculated levels, not predictions.",
  colMethod: "Method",
  screenerLinkText: "Crypto RSI screener →",
  quoteLinkText: "Live price & chart →",
  unavailable: "Not enough daily price history is available to compute indicators for this symbol right now.",
  ma200Gated: "Needs about 14 months of history — not yet available for this symbol.",
  footer: "These are computed readings, not trading signals or recommendations. Provided for information only, not investment advice.",

  screenerTitle: "Crypto RSI Screener — Overbought & Oversold Coins",
  screenerDescription: "RSI(14) and moving averages for every tracked cryptocurrency, sorted from most oversold to most overbought.",
  screenerH1: "Crypto RSI Screener",
  screenerSub: "RSI(14) and 20/50-day averages, sorted oversold → overbought",
  colCoin: "Coin",
  colPrice: "Price",
  colRsi: "RSI(14)",
  colSma20: "20-Day Avg",
  colSma50: "50-Day Avg",
  aboveMa: "above",
  belowMa: "below",
};

const KO: TechnicalsCopy = {
  h1Suffix: "기술적 지표",
  sub: "일봉 기준으로 계산한 모멘텀·추세·피벗 지표",
  asOf: "기준",
  momentumHeading: "모멘텀",
  rsiLabel: "RSI (14)",
  stochLabel: "스토캐스틱 %K / %D",
  williamsLabel: "윌리엄스 %R (14)",
  cciLabel: "CCI (20)",
  overbought: "과매수",
  oversold: "과매도",
  neutral: "중립",
  trendHeading: "추세",
  macdLabel: "MACD (12, 26)",
  macdHist: "히스토그램",
  adxLabel: "ADX (14)",
  atrLabel: "ATR (14)",
  strongTrend: "추세 진행 중",
  weakTrend: "박스권",
  maHeading: "이동평균선",
  maSummary: "현재가가 {TOTAL}개 단순이동평균선 중 {N}개보다 높습니다.",
  colPeriod: "기간",
  colSma: "단순(SMA)",
  colEma: "지수(EMA)",
  bollingerHeading: "볼린저 밴드 (20, 2)",
  colUpper: "상단",
  colMiddle: "중심",
  colLower: "하단",
  pivotsHeading: "피벗 포인트",
  pivotsNote: "전일 고가·저가·종가(디마크 방식은 시가도 포함)로 계산한 값이며, 예측이 아닌 산출된 가격대입니다.",
  colMethod: "방식",
  screenerLinkText: "암호화폐 RSI 스크리너 →",
  quoteLinkText: "실시간 시세·차트 보기 →",
  unavailable: "이 종목의 지표를 계산할 만큼 충분한 일봉 데이터가 지금 없습니다.",
  ma200Gated: "약 14개월치 데이터가 필요하며, 이 종목은 아직 충분하지 않습니다.",
  footer: "위 수치는 계산된 지표일 뿐 매매 신호나 추천이 아닙니다. 정보 제공 목적으로만 제공되며 투자 자문이 아닙니다.",

  screenerTitle: "암호화폐 RSI 스크리너 — 과매수·과매도 코인",
  screenerDescription: "PNL404가 추적하는 모든 암호화폐의 RSI(14)와 이동평균선을, 과매도부터 과매수 순으로 정렬해 보여드립니다.",
  screenerH1: "암호화폐 RSI 스크리너",
  screenerSub: "RSI(14)와 20일·50일 이동평균, 과매도 → 과매수 순 정렬",
  colCoin: "코인",
  colPrice: "현재가",
  colRsi: "RSI(14)",
  colSma20: "20일 평균",
  colSma50: "50일 평균",
  aboveMa: "위",
  belowMa: "아래",
};

const JA: TechnicalsCopy = {
  h1Suffix: "テクニカル指標",
  sub: "日足ベースで算出したモメンタム・トレンド・ピボット指標",
  asOf: "時点",
  momentumHeading: "モメンタム",
  rsiLabel: "RSI (14)",
  stochLabel: "ストキャスティクス %K / %D",
  williamsLabel: "ウィリアムズ%R (14)",
  cciLabel: "CCI (20)",
  overbought: "買われすぎ",
  oversold: "売られすぎ",
  neutral: "中立",
  trendHeading: "トレンド",
  macdLabel: "MACD (12, 26)",
  macdHist: "ヒストグラム",
  adxLabel: "ADX (14)",
  atrLabel: "ATR (14)",
  strongTrend: "トレンド継続中",
  weakTrend: "レンジ相場",
  maHeading: "移動平均線",
  maSummary: "現在値は{TOTAL}本の単純移動平均線のうち{N}本を上回っています。",
  colPeriod: "期間",
  colSma: "単純(SMA)",
  colEma: "指数(EMA)",
  bollingerHeading: "ボリンジャーバンド (20, 2)",
  colUpper: "上限",
  colMiddle: "中心",
  colLower: "下限",
  pivotsHeading: "ピボットポイント",
  pivotsNote: "前日の高値・安値・終値(デマーク方式は始値も使用)から算出した値であり、予測ではありません。",
  colMethod: "方式",
  screenerLinkText: "暗号資産RSIスクリーナー →",
  quoteLinkText: "リアルタイム株価・チャートを見る →",
  unavailable: "この銘柄の指標を計算するのに十分な日足データが現在ありません。",
  ma200Gated: "約14カ月分のデータが必要ですが、この銘柄はまだ十分に蓄積されていません。",
  footer: "上記は計算上の指標であり、売買シグナルや推奨ではありません。情報提供のみを目的としており、投資助言ではありません。",

  screenerTitle: "暗号資産RSIスクリーナー — 買われすぎ・売られすぎ銘柄",
  screenerDescription: "PNL404が追跡するすべての暗号資産のRSI(14)と移動平均線を、売られすぎから買われすぎの順に並べて掲載しています。",
  screenerH1: "暗号資産RSIスクリーナー",
  screenerSub: "RSI(14)と20日・50日移動平均、売られすぎ→買われすぎ順",
  colCoin: "コイン",
  colPrice: "現在価格",
  colRsi: "RSI(14)",
  colSma20: "20日平均",
  colSma50: "50日平均",
  aboveMa: "上",
  belowMa: "下",
};

export const TECHNICALS_COPY: Record<Lang, TechnicalsCopy> = { en: EN, ko: KO, ja: JA };
export const technicalsCopy = (lang: Lang): TechnicalsCopy => TECHNICALS_COPY[lang];
