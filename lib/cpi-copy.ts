import type { Lang } from "./i18n";

export type CpiCopy = {
  hubTitle: string;
  hubDescription: string;
  hubH1: string;
  hubSub: string;
  countryLabels: { us: string; kr: string; jp: string };
  /** {AMOUNT} {COUNTRY} {FROMYEAR} */ title: string;
  /** {AMOUNT} {COUNTRY} {FROMYEAR} */ description: string;
  /** {AMOUNT} {COUNTRY} {FROMYEAR} */ h1: string;
  /** {AMOUNT} {FROMYEAR} {RESULT} {TOYEAR} */ headlineToday: string;
  /** {AMOUNT} {FROMYEAR} {RESULT} {TOYEAR} */ headlineLagged: string;
  formHeading: string;
  amountLabel: string;
  yearLabel: string;
  cumulativeLabel: string;
  annualLabel: string;
  colYear: string;
  colCpi: string;
  colValue: string;
  yearByYearHeading: string;
  ladderHeading: string;
  /** {YEAR} */ partialYearNote: string;
  laggedNote: string;
  jaIndexNote: string;
  otherStartYearsHeading: string;
  aboutHeading: string;
  aboutP: string;
  unavailable: string;
  footer: string;
};

const EN: CpiCopy = {
  hubTitle: "Inflation & Purchasing Power Calculators",
  hubDescription: "What money from a past year is worth today — US, Korea and Japan, with a dedicated page for every starting year.",
  hubH1: "Inflation Calculators",
  hubSub: "Pick a country to see every year on record",
  countryLabels: { us: "United States", kr: "South Korea", jp: "Japan" },
  title: "{AMOUNT} in {FROMYEAR} — {COUNTRY} Inflation Calculator",
  description: "What {AMOUNT} in {FROMYEAR} is worth in today's prices in {COUNTRY}, using official consumer price index data.",
  h1: "{COUNTRY} Inflation: {FROMYEAR} to Now",
  headlineToday: "{AMOUNT} in {FROMYEAR} is worth about {RESULT} today ({TOYEAR} prices).",
  headlineLagged: "{AMOUNT} in {FROMYEAR} is worth about {RESULT} in {TOYEAR} prices — the most recent year with published data.",
  formHeading: "Calculate",
  amountLabel: "Amount",
  yearLabel: "Starting year",
  cumulativeLabel: "Cumulative change",
  annualLabel: "Average annual rate",
  colYear: "Year",
  colCpi: "CPI",
  colValue: "Equivalent value",
  yearByYearHeading: "Year by Year",
  ladderHeading: "At a Glance",
  partialYearNote: "{YEAR} is still in progress, so this figure averages the months published so far, not a full year.",
  laggedNote: "Consumer price data for this country is published annually and lags roughly a year behind — this is the most recent year on record, not the current one.",
  jaIndexNote: "",
  otherStartYearsHeading: "Other Starting Years",
  aboutHeading: "How This Is Calculated",
  aboutP: "Based on the official consumer price index (CPI) for this country — for the US, the Bureau of Labor Statistics' CPI-U, averaged from monthly figures to a single annual value; for Korea and Japan, the World Bank's annual CPI series. A gap in the source data is shown as a gap, never estimated or interpolated.",
  unavailable: "CPI data is not available for that year.",
  footer: "Figures are based on published consumer price index data and are provided for information only, not financial advice.",
};

const KO: CpiCopy = {
  hubTitle: "물가상승률·화폐가치 계산기",
  hubDescription: "과거 특정 연도의 돈이 지금 얼마의 가치인지 계산합니다. 미국·한국·일본을 다루며, 시작 연도마다 별도 페이지를 제공합니다.",
  hubH1: "화폐가치 계산기",
  hubSub: "국가를 선택하면 기록된 모든 연도를 볼 수 있습니다",
  countryLabels: { us: "미국", kr: "한국", jp: "일본" },
  title: "{FROMYEAR}년 {AMOUNT} — {COUNTRY} 화폐가치 계산기",
  description: "공식 소비자물가지수를 기준으로 {COUNTRY}의 {FROMYEAR}년 {AMOUNT}이(가) 현재 가치로 얼마인지 계산합니다.",
  h1: "{COUNTRY} 물가상승률: {FROMYEAR}년 → 현재",
  headlineToday: "{FROMYEAR}년의 {AMOUNT}은(는) 현재({TOYEAR}년 물가 기준) 약 {RESULT}의 가치입니다.",
  headlineLagged: "{FROMYEAR}년의 {AMOUNT}은(는) 통계가 발표된 가장 최근 연도인 {TOYEAR}년 물가 기준으로 약 {RESULT}의 가치입니다.",
  formHeading: "계산하기",
  amountLabel: "금액",
  yearLabel: "시작 연도",
  cumulativeLabel: "누적 변동률",
  annualLabel: "연평균 상승률",
  colYear: "연도",
  colCpi: "소비자물가지수",
  colValue: "환산 가치",
  yearByYearHeading: "연도별 추이",
  ladderHeading: "한눈에 보기",
  partialYearNote: "{YEAR}년은 아직 진행 중이라, 지금까지 발표된 월별 수치의 평균이며 1년 전체 수치가 아닙니다.",
  laggedNote: "이 국가의 소비자물가 통계는 연 단위로 발표되며 통상 1년가량 시차가 있습니다. 아래 수치는 현재가 아니라 통계가 발표된 가장 최근 연도 기준입니다.",
  jaIndexNote: "",
  otherStartYearsHeading: "다른 시작 연도",
  aboutHeading: "계산 방식 안내",
  aboutP: "해당 국가의 공식 소비자물가지수(CPI)를 기준으로 계산합니다. 미국은 노동통계국(BLS)의 CPI-U를 월별 수치의 연평균으로 환산해 사용하고, 한국과 일본은 세계은행(World Bank)의 연간 CPI 시리즈를 사용합니다. 원본 데이터에 공백이 있는 구간은 추정하거나 보간하지 않고 공백 그대로 표시합니다.",
  unavailable: "해당 연도의 소비자물가지수 데이터가 없습니다.",
  footer: "표시된 수치는 공개된 소비자물가지수 통계를 기준으로 하며, 정보 제공 목적으로만 제공됩니다. 재무 자문이 아닙니다.",
};

const JA: CpiCopy = {
  hubTitle: "インフレ・貨幣価値計算機",
  hubDescription: "過去のある年のお金が今いくらの価値になるかを計算します。米国・韓国・日本を対象に、開始年ごとに専用ページを用意しています。",
  hubH1: "貨幣価値計算機",
  hubSub: "国を選ぶと、記録されている全年度を確認できます",
  countryLabels: { us: "米国", kr: "韓国", jp: "日本" },
  title: "{FROMYEAR}年の{AMOUNT}｜{COUNTRY}貨幣価値計算機",
  description: "公式の消費者物価指数をもとに、{COUNTRY}の{FROMYEAR}年の{AMOUNT}が現在の価値でいくらになるかを計算します。",
  h1: "{COUNTRY}の物価上昇率:{FROMYEAR}年から現在まで",
  headlineToday: "{FROMYEAR}年の{AMOUNT}は、現在({TOYEAR}年の物価水準)でおよそ{RESULT}の価値です。",
  headlineLagged: "{FROMYEAR}年の{AMOUNT}は、統計が公表されている最新年である{TOYEAR}年の物価水準でおよそ{RESULT}の価値です。",
  formHeading: "条件を入力",
  amountLabel: "金額",
  yearLabel: "開始年",
  cumulativeLabel: "累積変化率",
  annualLabel: "年平均上昇率",
  colYear: "年",
  colCpi: "消費者物価指数",
  colValue: "換算後の価値",
  yearByYearHeading: "年別推移",
  ladderHeading: "早見表",
  partialYearNote: "{YEAR}年はまだ進行中のため、この数値は現時点までに公表された月次データの平均であり、通年の確定値ではありません。",
  laggedNote: "この国の消費者物価統計は年次で公表され、通常1年ほどの遅れがあります。下記の数値は現在ではなく、統計が公表されている最新年のものです。",
  jaIndexNote: "この計算では世界銀行が公表する消費者物価指数(CPI)を使用しています。日本銀行が示す企業物価指数(CGPI)とは異なる指数であり、同じ金額でも算出結果が大きく異なる場合があります。",
  otherStartYearsHeading: "他の開始年",
  aboutHeading: "計算方法について",
  aboutP: "対象国の公式な消費者物価指数(CPI)に基づいて計算しています。米国は労働統計局(BLS)のCPI-Uを月次データから年平均に換算した値を、韓国と日本は世界銀行の年次CPIシリーズを使用しています。元データに欠損がある期間は、推定や補間を行わずそのまま欠損として表示します。",
  unavailable: "その年の消費者物価指数データはありません。",
  footer: "掲載している数値は公表されている消費者物価指数の統計に基づくもので、情報提供のみを目的としています。投資・財務に関する助言ではありません。",
};

export const CPI_COPY: Record<Lang, CpiCopy> = { en: EN, ko: KO, ja: JA };
export const cpiCopy = (lang: Lang): CpiCopy => CPI_COPY[lang];
