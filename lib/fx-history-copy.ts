import type { Lang } from "./i18n";

export type FxHistoryCopy = {
  /** {BASE} {QUOTE} {YEAR} */ yearTitle: string;
  /** {BASE} {QUOTE} {YEAR} */ yearDescription: string;
  /** {BASE} {QUOTE} {YEAR} */ yearH1: string;
  /** {BASE} {QUOTE} {DATE} */ dateTitle: string;
  /** {BASE} {QUOTE} {DATE} */ dateDescription: string;
  /** {BASE} {QUOTE} {DATE} */ dateH1: string;
  colDate: string;
  colRate: string;
  highLabel: string;
  lowLabel: string;
  averageLabel: string;
  /** {PCT} */ changeLabel: string;
  basisNote: string;
  weekendNote: string;
  /** {DATE} */ beforeStartNote: string;
  amountAtRateHeading: string;
  colAmount: string;
  colValue: string;
  /** {PCT} */ deltaToTodayLabel: string;
  surroundingHeading: string;
  dailyTableHeading: string;
  otherYearsHeading: string;
  otherDatesHeading: string;
  liveConverterLinkText: string;
  unavailable: string;
  footer: string;
};

const EN: FxHistoryCopy = {
  yearTitle: "{BASE}/{QUOTE} Exchange Rate History {YEAR}",
  yearDescription: "The {BASE} to {QUOTE} exchange rate every trading day of {YEAR} — high, low, average, and the change from start to end of year.",
  yearH1: "{BASE}/{QUOTE} in {YEAR}",
  dateTitle: "{BASE} to {QUOTE} Exchange Rate on {DATE}",
  dateDescription: "The {BASE}/{QUOTE} exchange rate on {DATE}, with an amount table at that day's rate and the change versus today.",
  dateH1: "{BASE}/{QUOTE} on {DATE}",
  colDate: "Date",
  colRate: "Rate",
  highLabel: "Year High",
  lowLabel: "Year Low",
  averageLabel: "Year Average",
  changeLabel: "Start-to-End Change",
  basisNote: "Rates aggregate roughly 84 central banks and reference sources (via the Frankfurter API), not only the ECB — the source can differ by currency and day.",
  weekendNote: "This date falls on a weekend. Interbank FX markets don't trade then, so this is Friday's closing rate carried forward, not a fresh weekend quote.",
  beforeStartNote: "No published rate is available before {DATE} for one of these currencies.",
  amountAtRateHeading: "Amounts at This Rate",
  colAmount: "Amount",
  colValue: "Value",
  deltaToTodayLabel: "vs. today's rate",
  surroundingHeading: "Surrounding Days",
  dailyTableHeading: "Daily Rates",
  otherYearsHeading: "Other Years",
  otherDatesHeading: "Other Dates",
  liveConverterLinkText: "Live converter →",
  unavailable: "Historical rate data is temporarily unavailable for this pair.",
  footer: "Historical rates are for information only, not investment or tax advice — for customs or tax filings, use your jurisdiction's official reference rate.",
};

const KO: FxHistoryCopy = {
  yearTitle: "{BASE}/{QUOTE} 환율 {YEAR}년 추이",
  yearDescription: "{YEAR}년 매 거래일의 {BASE}/{QUOTE} 환율 — 연중 최고가·최저가·평균, 연초 대비 연말 변동률을 정리했습니다.",
  yearH1: "{YEAR}년 {BASE}/{QUOTE} 환율",
  dateTitle: "{DATE} {BASE}/{QUOTE} 환율",
  dateDescription: "{DATE}의 {BASE}/{QUOTE} 환율과, 그날 환율 기준 금액별 환산표, 오늘 환율 대비 변동을 보여드립니다.",
  dateH1: "{DATE} {BASE}/{QUOTE} 환율",
  colDate: "날짜",
  colRate: "환율",
  highLabel: "연중 최고",
  lowLabel: "연중 최저",
  averageLabel: "연평균",
  changeLabel: "연초 대비 연말 변동",
  basisNote: "환율은 유럽중앙은행(ECB)뿐 아니라 전 세계 약 84개 중앙은행·기준 자료를 종합한 값(Frankfurter API 기준)이며, 통화·날짜에 따라 출처가 다를 수 있습니다.",
  weekendNote: "이 날짜는 주말입니다. 은행 간 외환시장은 주말에 거래되지 않으므로, 이 값은 금요일 종가가 그대로 이월된 것이며 주말에 새로 고시된 환율이 아닙니다.",
  beforeStartNote: "{DATE} 이전에는 해당 통화 중 하나의 공표된 환율이 없습니다.",
  amountAtRateHeading: "이 환율 기준 금액별 환산",
  colAmount: "금액",
  colValue: "환산 금액",
  deltaToTodayLabel: "오늘 환율 대비",
  surroundingHeading: "전후 날짜",
  dailyTableHeading: "일별 환율",
  otherYearsHeading: "다른 연도 보기",
  otherDatesHeading: "다른 날짜 보기",
  liveConverterLinkText: "실시간 환율 계산기 →",
  unavailable: "이 통화쌍의 과거 환율 데이터를 지금 불러올 수 없습니다.",
  footer: "과거 환율은 정보 제공 목적으로만 제공되며 투자·세무 자문이 아닙니다. 관세·세무 신고에는 관할 기관이 고시하는 공식 기준환율을 사용하세요.",
};

const JA: FxHistoryCopy = {
  yearTitle: "{BASE}/{QUOTE} 為替レート推移 {YEAR}年",
  yearDescription: "{YEAR}年の営業日ごとの{BASE}/{QUOTE}為替レート — 年間の高値・安値・平均、年初来の変動率をまとめました。",
  yearH1: "{YEAR}年の{BASE}/{QUOTE}レート",
  dateTitle: "{DATE}の{BASE}/{QUOTE}為替レート",
  dateDescription: "{DATE}時点の{BASE}/{QUOTE}為替レートと、その日のレートでの金額別換算表、本日レートとの差を掲載しています。",
  dateH1: "{DATE}の{BASE}/{QUOTE}レート",
  colDate: "日付",
  colRate: "レート",
  highLabel: "年間高値",
  lowLabel: "年間安値",
  averageLabel: "年間平均",
  changeLabel: "年初来の変動率",
  basisNote: "レートはECBだけでなく世界中の約84の中央銀行・参照情報源を集約した値(Frankfurter API)であり、通貨や日付によって出典が異なる場合があります。",
  weekendNote: "この日付は週末です。銀行間の外国為替市場は週末には取引されないため、この値は金曜日の終値がそのまま繰り越されたものであり、週末に新たに決定されたレートではありません。",
  beforeStartNote: "{DATE}より前は、いずれかの通貨の公表レートがありません。",
  amountAtRateHeading: "このレートでの金額換算",
  colAmount: "金額",
  colValue: "換算後の金額",
  deltaToTodayLabel: "本日のレートとの差",
  surroundingHeading: "前後の日付",
  dailyTableHeading: "日別レート",
  otherYearsHeading: "他の年を見る",
  otherDatesHeading: "他の日付を見る",
  liveConverterLinkText: "リアルタイム為替計算機 →",
  unavailable: "この通貨ペアの過去のレートデータを現在取得できません。",
  footer: "過去のレートは情報提供のみを目的としており、投資・税務助言ではありません。関税・税務申告には所轄当局が公表する公式基準レートをご利用ください。",
};

export const FX_HISTORY_COPY: Record<Lang, FxHistoryCopy> = { en: EN, ko: KO, ja: JA };
export const fxHistoryCopy = (lang: Lang): FxHistoryCopy => FX_HISTORY_COPY[lang];
