import type { Lang } from "./i18n";

// Copy for /quote/[symbol]/dividends.

export type DividendsCopy = {
  h1Suffix: string; // appended to the symbol's own name, e.g. "{name} Dividends"
  sub: string;
  ttmLabel: string;
  yieldLabel: string;
  frequencyLabel: string;
  freqMonthly: string;
  freqQuarterly: string;
  freqSemiannual: string;
  freqAnnual: string;
  freqIrregular: string;
  yoyLabel: string;
  yearlyHeading: string;
  historyHeading: string;
  colExDate: string;
  colRecordDate: string;
  colAmount: string;
  splitAdjustedNote: string;
  splitsHeading: string;
  colSplitDate: string;
  colSplitRatio: string;
  kenriHeading: string;
  kenriNote: string;
  colKenritsuki: string;
  quoteLinkText: string;
  footer: string;
};

const EN: DividendsCopy = {
  h1Suffix: "Dividends",
  sub: "Ex-dividend dates, amounts and yield history",
  ttmLabel: "Trailing 12 Months",
  yieldLabel: "Trailing Yield",
  frequencyLabel: "Frequency",
  freqMonthly: "Monthly",
  freqQuarterly: "Quarterly",
  freqSemiannual: "Semiannual",
  freqAnnual: "Annual",
  freqIrregular: "Irregular",
  yoyLabel: "YoY Growth",
  yearlyHeading: "By Year",
  historyHeading: "Dividend History",
  colExDate: "Ex-Date",
  colRecordDate: "Record Date",
  colAmount: "Amount",
  splitAdjustedNote: "Amounts are retroactively adjusted for stock splits, so early payments won't match what was actually paid at the time.",
  splitsHeading: "Stock Splits",
  colSplitDate: "Date",
  colSplitRatio: "Ratio",
  kenriHeading: "Last Day to Buy (権利付最終日)",
  kenriNote: "Under T+2 settlement, this is exactly one Japan market business day before the ex-date — buy by this date to receive the dividend.",
  colKenritsuki: "Last buy date",
  quoteLinkText: "Live price & chart →",
  footer: "Dividend figures are historical and exclude withholding tax. Provided for information only, not investment advice.",
};

const KO: DividendsCopy = {
  h1Suffix: "배당",
  sub: "배당락일·배당금·배당수익률 이력",
  ttmLabel: "최근 12개월 합계",
  yieldLabel: "배당수익률",
  frequencyLabel: "지급 주기",
  freqMonthly: "매월",
  freqQuarterly: "분기",
  freqSemiannual: "반기",
  freqAnnual: "연 1회",
  freqIrregular: "비정기",
  yoyLabel: "전년 대비",
  yearlyHeading: "연도별 배당금",
  historyHeading: "배당 이력",
  colExDate: "배당락일",
  colRecordDate: "기준일",
  colAmount: "배당금",
  splitAdjustedNote: "표시된 금액은 액면분할을 소급 반영한 값이므로, 과거 실제 지급액과는 다를 수 있습니다.",
  splitsHeading: "액면분할 이력",
  colSplitDate: "일자",
  colSplitRatio: "비율",
  kenriHeading: "매수 마감일(権利付最終日)",
  kenriNote: "T+2 결제 기준으로, 배당락일 하루 전 일본 증시 영업일입니다. 이 날짜까지 매수해야 배당을 받을 수 있습니다.",
  colKenritsuki: "매수 마감일",
  quoteLinkText: "실시간 시세·차트 보기 →",
  footer: "배당 수치는 과거 실적이며 원천징수세는 반영하지 않았습니다. 정보 제공 목적으로만 제공되며 투자 자문이 아닙니다.",
};

const JA: DividendsCopy = {
  h1Suffix: "配当",
  sub: "権利落ち日・配当金・配当利回りの推移",
  ttmLabel: "直近12カ月合計",
  yieldLabel: "配当利回り",
  frequencyLabel: "支払頻度",
  freqMonthly: "毎月",
  freqQuarterly: "四半期",
  freqSemiannual: "半期",
  freqAnnual: "年1回",
  freqIrregular: "不定期",
  yoyLabel: "前年比",
  yearlyHeading: "年別配当金",
  historyHeading: "配当履歴",
  colExDate: "権利落ち日",
  colRecordDate: "基準日",
  colAmount: "配当金",
  splitAdjustedNote: "表示されている金額は株式分割を遡って調整した値のため、当時実際に支払われた金額とは異なる場合があります。",
  splitsHeading: "株式分割履歴",
  colSplitDate: "日付",
  colSplitRatio: "比率",
  kenriHeading: "権利付最終日",
  kenriNote: "T+2決済のもと、権利落ち日の1営業日前(日本market)にあたります。この日までに買付を行うと配当を受け取れます。",
  colKenritsuki: "権利付最終日",
  quoteLinkText: "リアルタイム株価・チャートを見る →",
  footer: "配当データは過去の実績であり、源泉徴収税は含みません。情報提供のみを目的としており、投資助言ではありません。",
};

export const DIVIDENDS_COPY: Record<Lang, DividendsCopy> = { en: EN, ko: KO, ja: JA };
export const dividendsCopy = (lang: Lang): DividendsCopy => DIVIDENDS_COPY[lang];
