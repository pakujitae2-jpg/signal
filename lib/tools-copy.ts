import type { Lang } from "./i18n";

export type ToolsCopy = {
  hubTitle: string;
  hubDescription: string;
  hubH1: string;
  hubSub: string;
  navAverage: string;
  navCompound: string;
  navCagr: string;
  navInvested: string;
  navDca: string;
  formHeading: string;
  resultHeading: string;
  aboutHeading: string;
  faqHeading: string;
  footer: string;
  unavailable: string;

  avgTitle: string;
  avgDescription: string;
  avgH1: string;
  avgSub: string;
  avgPriceLabel: string;
  avgQtyLabel: string;
  avgSymbolLabel: string;
  avgTotalQtyLabel: string;
  avgTotalCostLabel: string;
  avgAvgCostLabel: string;
  avgLivePriceLabel: string;
  avgLivePlLabel: string;
  avgTargetHeading: string;
  avgTargetLabel: string;
  avgTargetAtPriceLabel: string;
  /** {N} {PRICE} */ avgTargetResult: string;
  avgTargetUnreachable: string;
  avgFaqQ1: string;
  /** {N} */ avgFaqA1: string;
  avgFaqQ2: string;
  avgFaqA2: string;
  avgAboutP: string;

  compTitle: string;
  compDescription: string;
  compH1: string;
  compSub: string;
  compPrincipalLabel: string;
  compRateLabel: string;
  compYearsLabel: string;
  compFreqLabel: string;
  compFreqOptions: { annually: string; semiannually: string; quarterly: string; monthly: string; daily: string };
  compFutureValueLabel: string;
  compContributedLabel: string;
  compInterestLabel: string;
  compFaqQ1: string;
  compFaqA1: string;
  compAboutP: string;

  cagrTitle: string;
  cagrDescription: string;
  cagrH1: string;
  cagrSub: string;
  cagrStartLabel: string;
  cagrEndLabel: string;
  cagrYearsLabel: string;
  cagrResultLabel: string;
  cagrFaqQ1: string;
  cagrFaqA1: string;
  cagrAboutP: string;
};

const EN: ToolsCopy = {
  hubTitle: "Calculators — PNL404 Tools",
  hubDescription: "Average cost, compound interest and CAGR calculators, plus links to the DCA backtest and lump-sum return calculator.",
  hubH1: "Calculators",
  hubSub: "Pure arithmetic — no account, no data stored",
  navAverage: "Average Cost Calculator",
  navCompound: "Compound Interest Calculator",
  navCagr: "CAGR Calculator",
  navInvested: "If I Had Invested",
  navDca: "DCA Calculator",
  formHeading: "Calculate",
  resultHeading: "Result",
  aboutHeading: "How This Is Calculated",
  faqHeading: "Frequently Asked Questions",
  footer: "Figures are arithmetic only and are provided for information, not investment advice.",
  unavailable: "Live price is not available right now, so profit/loss can't be shown — the average cost below is still correct.",

  avgTitle: "Average Cost Calculator — Blended Buy Price & Target Average",
  avgDescription: "Enter each purchase's price and quantity to get your blended average cost, then solve how many more shares at today's price would pull your average down to a target.",
  avgH1: "Average Cost Calculator",
  avgSub: "Blended cost from multiple buys, plus the reverse solve",
  avgPriceLabel: "Price",
  avgQtyLabel: "Quantity",
  avgSymbolLabel: "Symbol (optional, for live P/L)",
  avgTotalQtyLabel: "Total quantity",
  avgTotalCostLabel: "Total cost",
  avgAvgCostLabel: "Average cost",
  avgLivePriceLabel: "Current price",
  avgLivePlLabel: "Unrealized P/L at current price",
  avgTargetHeading: "Reach a Target Average",
  avgTargetLabel: "Target average price",
  avgTargetAtPriceLabel: "Buying at",
  avgTargetResult: "Buy {N} more units at {PRICE} to bring your average to the target.",
  avgTargetUnreachable: "That target isn't reachable by buying more at this price — it's already at or past your current average in that direction.",
  avgFaqQ1: "How is the average cost calculated?",
  avgFaqA1: "Total cost across all {N} entered lots, divided by total quantity — the same blended-cost method any brokerage statement uses.",
  avgFaqQ2: "Does this include trading fees or tax?",
  avgFaqA2: "No — this is the raw blended price times quantity only. Commissions, spreads and any transaction tax are not included, so your broker's actual average may differ slightly.",
  avgAboutP: "Purely arithmetic: total cost (sum of price × quantity across every lot you enter) divided by total quantity. The reverse solve finds how many additional units at a given price would move the blended average to a target you choose. Live profit/loss, when a symbol is entered, uses the current price only when it's a real quote — never an estimate.",

  compTitle: "Compound Interest Calculator",
  compDescription: "See how a principal grows over time at a fixed annual rate, with a choice of compounding frequency.",
  compH1: "Compound Interest Calculator",
  compSub: "Principal, rate, time and compounding frequency",
  compPrincipalLabel: "Principal",
  compRateLabel: "Annual rate (%)",
  compYearsLabel: "Years",
  compFreqLabel: "Compounding",
  compFreqOptions: { annually: "Annually", semiannually: "Semi-annually", quarterly: "Quarterly", monthly: "Monthly", daily: "Daily" },
  compFutureValueLabel: "Future value",
  compContributedLabel: "Principal",
  compInterestLabel: "Interest earned",
  compFaqQ1: "What formula does this use?",
  compFaqA1: "The standard compound interest formula: A = P × (1 + r/n)^(n×t), where P is principal, r the annual rate, n the compounding frequency per year and t the number of years.",
  compAboutP: "This calculates growth from a single lump sum with no further contributions, compounded at the frequency you choose. It does not account for taxes, fees or inflation.",

  cagrTitle: "CAGR Calculator — Compound Annual Growth Rate",
  cagrDescription: "Calculate the compound annual growth rate between a starting and ending value over a number of years.",
  cagrH1: "CAGR Calculator",
  cagrSub: "Start value, end value and years",
  cagrStartLabel: "Start value",
  cagrEndLabel: "End value",
  cagrYearsLabel: "Years",
  cagrResultLabel: "CAGR",
  cagrFaqQ1: "What is CAGR?",
  cagrFaqA1: "The compound annual growth rate: the constant yearly rate that would take the start value to the end value over the given number of years, smoothing out any volatility in between. Formula: (end ÷ start)^(1 ÷ years) − 1.",
  cagrAboutP: "CAGR describes a smooth average annual rate — it doesn't reflect the actual path the value took, which may have included much larger gains and losses along the way.",
};

const KO: ToolsCopy = {
  hubTitle: "계산기 모음 — PNL404 도구",
  hubDescription: "평단가, 복리, 연평균 수익률(CAGR) 계산기와 적립식·거치식 투자 계산기를 한곳에 모았습니다.",
  hubH1: "계산기 모음",
  hubSub: "순수 계산기 — 회원가입도, 데이터 저장도 없습니다",
  navAverage: "평단가(물타기) 계산기",
  navCompound: "복리 계산기",
  navCagr: "연평균 수익률(CAGR) 계산기",
  navInvested: "그때 투자했다면",
  navDca: "적립식 투자 계산기",
  formHeading: "계산하기",
  resultHeading: "계산 결과",
  aboutHeading: "계산 방식 안내",
  faqHeading: "자주 묻는 질문",
  footer: "표시된 수치는 단순 계산 결과이며, 정보 제공 목적으로만 제공됩니다. 투자 권유나 자문이 아닙니다.",
  unavailable: "현재 실시간 시세를 불러올 수 없어 평가손익은 표시할 수 없습니다. 아래 평단가 계산 결과는 정상적으로 표시됩니다.",

  avgTitle: "평단가(물타기) 계산기 — 목표 평단가 역산",
  avgDescription: "여러 번 나눠 매수한 가격과 수량을 입력하면 평균 매수 단가를 계산합니다. 목표 평단가에 도달하려면 현재가로 몇 주를 더 사야 하는지도 함께 계산합니다.",
  avgH1: "평단가(물타기) 계산기",
  avgSub: "여러 매수 내역의 평균 단가 · 목표 평단가 역산",
  avgPriceLabel: "매수가",
  avgQtyLabel: "수량",
  avgSymbolLabel: "종목 (선택 입력, 실시간 평가손익용)",
  avgTotalQtyLabel: "총 수량",
  avgTotalCostLabel: "총 매수 금액",
  avgAvgCostLabel: "평균 매수 단가",
  avgLivePriceLabel: "현재가",
  avgLivePlLabel: "현재가 기준 평가손익",
  avgTargetHeading: "목표 평단가 역산",
  avgTargetLabel: "목표 평단가",
  avgTargetAtPriceLabel: "매수 예정가",
  avgTargetResult: "{PRICE}에 {N}주를 추가로 매수하면 목표 평단가에 도달합니다.",
  avgTargetUnreachable: "이 가격으로는 해당 방향의 목표 평단가에 도달할 수 없습니다. 이미 현재 평단가가 목표를 넘어섰거나 같은 방향입니다.",
  avgFaqQ1: "평균 매수 단가는 어떻게 계산하나요?",
  avgFaqA1: "입력한 {N}건의 매수 내역 전체의 총 매수 금액을 총 수량으로 나눈 값입니다. 증권사 잔고 화면에서 쓰는 것과 같은 가중평균 방식입니다.",
  avgFaqQ2: "수수료나 세금도 반영되나요?",
  avgFaqA2: "아니요. 매수가 × 수량만 단순 합산한 값으로, 수수료·호가 스프레드·거래세는 포함하지 않습니다. 실제 증권사 화면의 평단가와는 소폭 차이가 날 수 있습니다.",
  avgAboutP: "순수 계산식입니다: 입력한 모든 매수 내역의 (매수가 × 수량)을 합산한 총 매수 금액을, 총 수량으로 나눠 평균 단가를 구합니다. 목표 평단가 역산은 지정한 가격에 몇 주를 추가로 매수해야 평균 단가가 원하는 목표에 도달하는지 계산합니다. 종목을 입력하면 실제 실시간 시세일 때만 평가손익을 표시하며, 추정치는 표시하지 않습니다.",

  compTitle: "복리 계산기",
  compDescription: "원금이 연 이자율과 복리 주기에 따라 시간이 지나면서 얼마로 불어나는지 계산합니다.",
  compH1: "복리 계산기",
  compSub: "원금 · 연이율 · 기간 · 복리 주기",
  compPrincipalLabel: "원금",
  compRateLabel: "연이율 (%)",
  compYearsLabel: "투자 기간(년)",
  compFreqLabel: "복리 주기",
  compFreqOptions: { annually: "연 1회", semiannually: "연 2회", quarterly: "연 4회(분기)", monthly: "매월", daily: "매일" },
  compFutureValueLabel: "만기 시 평가금액",
  compContributedLabel: "원금",
  compInterestLabel: "이자 수익",
  compFaqQ1: "어떤 공식을 사용하나요?",
  compFaqA1: "표준 복리 공식을 사용합니다: A = P × (1 + r/n)^(n×t). P는 원금, r은 연이율, n은 연간 복리 횟수, t는 투자 기간(년)입니다.",
  compAboutP: "이 계산기는 추가 납입 없이 원금 하나만 지정한 복리 주기로 불어나는 경우를 계산합니다. 세금, 수수료, 물가상승률은 반영하지 않습니다.",

  cagrTitle: "연평균 수익률(CAGR) 계산기",
  cagrDescription: "시작 금액과 종료 금액, 투자 기간을 입력하면 연평균 복리 수익률(CAGR)을 계산합니다.",
  cagrH1: "연평균 수익률(CAGR) 계산기",
  cagrSub: "시작 금액 · 종료 금액 · 투자 기간",
  cagrStartLabel: "시작 금액",
  cagrEndLabel: "종료 금액",
  cagrYearsLabel: "투자 기간(년)",
  cagrResultLabel: "연평균 수익률(CAGR)",
  cagrFaqQ1: "CAGR이 무엇인가요?",
  cagrFaqA1: "연평균 복리 성장률(CAGR)은 시작 금액이 지정한 기간 동안 종료 금액에 도달하기 위해 매년 일정하게 적용됐다고 가정한 복리 수익률입니다. 실제로는 기간 중 변동성이 있었더라도 이를 매끄러운 연간 평균으로 환산한 값입니다. 공식: (종료 금액 ÷ 시작 금액)^(1 ÷ 투자 기간) − 1.",
  cagrAboutP: "CAGR은 매끄러운 연평균 수익률을 보여줄 뿐, 그 기간 동안 실제로 겪었을 더 큰 등락은 반영하지 않습니다.",
};

const JA: ToolsCopy = {
  hubTitle: "計算ツール一覧｜PNL404",
  hubDescription: "平均取得単価・複利・年率リターン(CAGR)の計算ツールに加え、積立シミュレーションと一括投資リターン計算機へのリンクをまとめています。",
  hubH1: "計算ツール",
  hubSub: "純粋な計算のみ — 会員登録もデータ保存も不要",
  navAverage: "平均取得単価計算機(ナンピン計算)",
  navCompound: "複利計算機",
  navCagr: "年率リターン(CAGR)計算機",
  navInvested: "もしあの時投資していたら",
  navDca: "積立シミュレーション",
  formHeading: "条件を入力",
  resultHeading: "計算結果",
  aboutHeading: "計算方法について",
  faqHeading: "よくある質問",
  footer: "掲載している数値は単純計算の結果であり、情報提供のみを目的としています。投資助言ではありません。",
  unavailable: "現在リアルタイム価格を取得できないため評価損益は表示できません。下記の平均取得単価の計算結果自体は正しく表示されています。",

  avgTitle: "平均取得単価計算機｜目標単価からの逆算(ナンピン計算)",
  avgDescription: "複数回に分けて購入した価格と数量を入力すると、平均取得単価を計算します。目標の平均単価に到達するには現在の価格であと何株買えばよいかも合わせて計算します。",
  avgH1: "平均取得単価計算機",
  avgSub: "複数回の購入から平均単価を算出 · 目標単価からの逆算",
  avgPriceLabel: "購入価格",
  avgQtyLabel: "数量",
  avgSymbolLabel: "銘柄(任意入力、リアルタイム評価損益用)",
  avgTotalQtyLabel: "合計数量",
  avgTotalCostLabel: "合計購入金額",
  avgAvgCostLabel: "平均取得単価",
  avgLivePriceLabel: "現在値",
  avgLivePlLabel: "現在値ベースの評価損益",
  avgTargetHeading: "目標平均単価からの逆算",
  avgTargetLabel: "目標平均単価",
  avgTargetAtPriceLabel: "購入予定価格",
  avgTargetResult: "{PRICE}であと{N}株購入すると、目標の平均単価に到達します。",
  avgTargetUnreachable: "この価格ではその方向の目標単価には到達できません。すでに現在の平均単価が目標と同じか、それを超えています。",
  avgFaqQ1: "平均取得単価はどう計算されますか?",
  avgFaqA1: "入力した{N}件の購入内容すべての合計購入金額を、合計数量で割った値です。証券会社の口座残高画面と同じ加重平均方式です。",
  avgFaqQ2: "手数料や税金も反映されますか?",
  avgFaqA2: "いいえ。購入価格×数量を単純合計した値のみで、手数料・スプレッド・取引にかかる税金は含みません。実際の証券会社の平均単価とはわずかに異なる場合があります。",
  avgAboutP: "純粋な計算式です:入力したすべての購入内容の(購入価格×数量)を合計した金額を、合計数量で割って平均単価を求めます。目標単価からの逆算では、指定した価格であと何株購入すれば平均単価が目標に到達するかを計算します。銘柄を入力した場合、実際のリアルタイム価格が取得できたときのみ評価損益を表示し、推定値は表示しません。",

  compTitle: "複利計算機",
  compDescription: "元本が年利率と複利の頻度に応じて、時間の経過とともにいくらに増えるかを計算します。",
  compH1: "複利計算機",
  compSub: "元本 · 年利率 · 期間 · 複利の頻度",
  compPrincipalLabel: "元本",
  compRateLabel: "年利率(%)",
  compYearsLabel: "運用期間(年)",
  compFreqLabel: "複利の頻度",
  compFreqOptions: { annually: "年1回", semiannually: "年2回", quarterly: "年4回(四半期)", monthly: "毎月", daily: "毎日" },
  compFutureValueLabel: "満期時の評価額",
  compContributedLabel: "元本",
  compInterestLabel: "利息収益",
  compFaqQ1: "どの計算式を使っていますか?",
  compFaqA1: "標準的な複利計算式を使用しています:A = P × (1 + r/n)^(n×t)。Pは元本、rは年利率、nは年間の複利回数、tは運用期間(年)です。",
  compAboutP: "この計算機は追加の積立を行わず、元本1回のみを指定した頻度で複利運用した場合を計算します。税金・手数料・物価上昇率は考慮していません。",

  cagrTitle: "年率リターン(CAGR)計算機",
  cagrDescription: "開始時点の金額と終了時点の金額、運用期間を入力すると、年率複利リターン(CAGR)を計算します。",
  cagrH1: "年率リターン(CAGR)計算機",
  cagrSub: "開始金額 · 終了金額 · 運用期間",
  cagrStartLabel: "開始時点の金額",
  cagrEndLabel: "終了時点の金額",
  cagrYearsLabel: "運用期間(年)",
  cagrResultLabel: "年率リターン(CAGR)",
  cagrFaqQ1: "CAGRとは何ですか?",
  cagrFaqA1: "CAGR(年率複利成長率)とは、開始時点の金額が指定した期間で終了時点の金額に到達するために、毎年一定の割合で複利成長したと仮定した場合の年率です。実際には期間中に変動があっても、それを均した年平均値です。計算式:(終了金額 ÷ 開始金額)^(1 ÷ 運用期間) − 1。",
  cagrAboutP: "CAGRは均された年平均の成長率を示すものであり、その期間中に実際に生じたより大きな値上がり・値下がりは反映していません。",
};

export const TOOLS_COPY: Record<Lang, ToolsCopy> = { en: EN, ko: KO, ja: JA };
export const toolsCopy = (lang: Lang): ToolsCopy => TOOLS_COPY[lang];
