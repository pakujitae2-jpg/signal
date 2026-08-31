import type { Lang } from "./i18n";

export type ListsCopy = {
  hubTitle: string;
  hubDescription: string;
  hubH1: string;
  /** {n} */ hubSub: string;
  /** {NAME} */ title: string;
  /** {NAME} */ description: string;
  /** {NAME} */ h1: string;
  colName: string;
  colPrice: string;
  colChange: string;
  colYield: string;
  /** {N} */ membersNote: string;
  faqHeading: string;
  /** {NAME} */ faqMembersQ: string;
  /** {N} */ faqMembersA: string;
  faqRankQ: string;
  faqRankAChange: string;
  faqRankAYield: string;
  aboutHeading: string;
  unavailable: string;
  otherListsHeading: string;
  footer: string;
};

const EN: ListsCopy = {
  hubTitle: "Themed Stock & Crypto Lists — PNL404",
  hubDescription: "Curated lists of stocks, ETFs and crypto by theme: Magnificent Seven, semiconductors, AI, monthly dividend ETFs and more, with live prices.",
  hubH1: "Themed Lists",
  hubSub: "{n} curated lists",
  title: "{NAME} — Live Prices & Performance",
  description: "{NAME}, with live prices and day change for every member, updated continuously.",
  h1: "{NAME}",
  colName: "Name",
  colPrice: "Price",
  colChange: "Day change",
  colYield: "Trailing yield",
  membersNote: "{N} symbols",
  faqHeading: "Frequently Asked Questions",
  faqMembersQ: "What is included in the {NAME} list?",
  faqMembersA: "This list tracks {N} symbols, curated by PNL404 — not an index provider's official membership list and not ranked by market capitalization, which isn't available from any free data source used here.",
  faqRankQ: "How is this list ranked?",
  faqRankAChange: "By the day's live price change, highest first.",
  faqRankAYield: "By trailing twelve-month dividend yield — dividends actually paid divided by the current price, not a forward estimate — highest first.",
  aboutHeading: "About This List",
  unavailable: "Live prices for this list are not available right now.",
  otherListsHeading: "Other Lists",
  footer: "Market data may be delayed and is provided for information only, not investment advice.",
};

const KO: ListsCopy = {
  hubTitle: "테마별 종목·코인 리스트 — PNL404",
  hubDescription: "매그니피센트 7, 반도체, AI, 월배당 ETF 등 테마별로 정리한 종목·ETF·코인 리스트를 실시간 시세와 함께 제공합니다.",
  hubH1: "테마별 리스트",
  hubSub: "테마 리스트 {n}개",
  title: "{NAME} — 실시간 시세와 등락률",
  description: "{NAME}에 포함된 모든 종목의 실시간 시세와 전일 대비 등락률을 한 페이지에서 확인하세요.",
  h1: "{NAME}",
  colName: "종목명",
  colPrice: "현재가",
  colChange: "전일 대비",
  colYield: "배당 수익률",
  membersNote: "{N}개 종목",
  faqHeading: "자주 묻는 질문",
  faqMembersQ: "{NAME}에는 어떤 종목이 포함되나요?",
  faqMembersA: "이 리스트는 PNL404가 직접 선정한 {N}개 종목으로 구성되며, 지수 산출기관의 공식 편입 종목이 아니고 시가총액 기준으로 순위를 매기지도 않습니다. 이 사이트가 사용하는 무료 데이터 출처로는 시가총액을 구할 수 없기 때문입니다.",
  faqRankQ: "이 리스트는 어떤 기준으로 정렬되나요?",
  faqRankAChange: "당일 실시간 등락률이 높은 순으로 정렬합니다.",
  faqRankAYield: "최근 12개월간 실제로 지급된 배당금을 현재가로 나눈 배당 수익률이 높은 순으로 정렬합니다. 예상치가 아닌 실적 기준입니다.",
  aboutHeading: "이 리스트에 대하여",
  unavailable: "현재 이 리스트의 실시간 시세를 불러올 수 없습니다.",
  otherListsHeading: "다른 테마 리스트",
  footer: "시세 정보는 지연될 수 있으며, 투자 참고용으로만 제공됩니다. 투자 권유가 아닙니다.",
};

const JA: ListsCopy = {
  hubTitle: "テーマ別銘柄・暗号資産リスト｜PNL404",
  hubDescription: "マグニフィセント・セブン、半導体、AI、毎月分配ETFなど、テーマ別にまとめた銘柄・ETF・暗号資産のリストをリアルタイム価格とともに提供します。",
  hubH1: "テーマ別リスト",
  hubSub: "テーマリスト{n}件",
  title: "{NAME}｜リアルタイム価格と騰落率",
  description: "{NAME}に含まれる全銘柄のリアルタイム価格と前日比を1ページで確認できます。",
  h1: "{NAME}",
  colName: "銘柄名",
  colPrice: "現在値",
  colChange: "前日比",
  colYield: "分配利回り",
  membersNote: "{N}銘柄",
  faqHeading: "よくある質問",
  faqMembersQ: "{NAME}にはどの銘柄が含まれますか?",
  faqMembersA: "このリストはPNL404が独自に選定した{N}銘柄で構成されており、指数算出機関の公式な構成銘柄ではなく、時価総額による順位付けも行っていません。本サイトが利用する無料データソースでは時価総額を取得できないためです。",
  faqRankQ: "このリストはどのような基準で並んでいますか?",
  faqRankAChange: "その日のリアルタイム騰落率が高い順に並んでいます。",
  faqRankAYield: "直近12カ月に実際に支払われた分配金を現在の価格で割った分配利回りが高い順に並んでいます。予想値ではなく実績値です。",
  aboutHeading: "このリストについて",
  unavailable: "現在このリストのリアルタイム価格を取得できません。",
  otherListsHeading: "他のテーマ別リスト",
  footer: "掲載している価格情報は遅延する場合があり、情報提供のみを目的としています。投資助言ではありません。",
};

export const LISTS_COPY: Record<Lang, ListsCopy> = { en: EN, ko: KO, ja: JA };
export const listsCopy = (lang: Lang): ListsCopy => LISTS_COPY[lang];
