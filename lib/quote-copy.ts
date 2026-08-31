import type { Lang } from "./i18n";
import type { UniverseGroup } from "./universe";

// Localized copy for the quote pages (/quote/…, /ko/quote/…, /ja/quote/…).
// Anything handed to the client QuoteView must end up as plain strings, so
// the interpolation happens here on the server.

export type Dir = "up" | "down" | "flat";

/** Plain-string labels passed into the client chart view. */
export type QuoteLabels = {
  keyStats: string;
  chartRange: string;
  loading: string;
  periodChange: string;
  prevClose: string;
  dayChange: string;
  periodHigh: string;
  periodLow: string;
  high52: string;
  low52: string;
  trade: string;
  partnerOffers: string;
  sampleNote: string;
};

export type QuoteCopy = {
  groupLabel: Record<UniverseGroup, string>;
  hubLabel: Record<UniverseGroup, string>;
  title: (group: UniverseGroup, name: string, sym: string) => string;
  description: (group: UniverseGroup, name: string, sym: string, priced: string) => string;
  priceSentence: (name: string, price: string, dir: Dir, pct: string) => string;
  aboutHeading: (name: string) => string;
  aboutLead: (group: UniverseGroup, name: string, sym: string, price: string, exchange: string | null) => string;
  aboutMove: (dir: Dir, pct: string, prev: string) => string;
  aboutRange52: (low: string, high: string) => string;
  aboutQuoted: (name: string, sym: string, currency: string, exchange: string | null) => string;
  aboutWhat: Record<UniverseGroup, (name: string) => string>;
  moreHeading: (groupLabel: string) => string;
  hubLink: (hubLabel: string) => string;
  converterLink: (pair: string) => string;
  dividendsLink: (name: string) => string;
  technicalsLink: (name: string) => string;
  seasonalityLink: (name: string) => string;
  dcaLink: (name: string) => string;
  averageLink: (name: string) => string;
  unavailable: (sym: string) => string;
  backHome: string;
  footer: string;
  /** Period labels contain a {r} placeholder the client swaps for the active range. */
  labels: (tradeCrypto: boolean) => QuoteLabels;
  dirTitle: string;
  dirDesc: (n: number) => string;
  dirH1: string;
  dirSub: (n: number) => string;
  dirCount: (n: number) => string;
  allQuotes: string;
};

const pick = (d: Dir, up: string, down: string, flat: string) => (d === "up" ? up : d === "down" ? down : flat);

const EN: QuoteCopy = {
  groupLabel: {
    index: "Indices", "us-stock": "US Stocks", etf: "ETFs", "jp-stock": "Japan Stocks",
    "kr-stock": "Korea Stocks", crypto: "Cryptocurrencies", fx: "Currencies", commodity: "Commodities",
  },
  hubLabel: {
    index: "All Quotes", "us-stock": "U.S. Markets", etf: "All Quotes", "jp-stock": "Japan Markets",
    "kr-stock": "Korea Markets", crypto: "Crypto Markets", fx: "Currencies", commodity: "All Quotes",
  },
  title: (g, name, sym) => {
    if (g === "crypto") return `${name} (${sym}) Price Today, Chart & Market Data`;
    if (g === "index") return `${name} Index Today — Live Chart & Level`;
    if (g === "fx") return `${name} Exchange Rate — Live Chart`;
    if (g === "commodity") return `${name} Price Today — Live Chart`;
    if (g === "etf") return `${name} (${sym}) ETF Price, Chart & Stats`;
    return `${name} (${sym}) Stock Price, Chart & Stats`;
  },
  description: (g, name, sym, priced) => {
    const what = g === "index" ? "level" : g === "fx" ? "rate" : "price";
    const label = g === "us-stock" || g === "etf" || g === "jp-stock" || g === "kr-stock" ? sym : name;
    return `${priced}Live ${label} ${what} and interactive chart (1D to 1Y), previous close, day change and 52-week range on PNL404 — global markets, one page.`;
  },
  priceSentence: (name, price, dir, pct) => `${name} is at ${price}, ${pick(dir, "up", "down", "flat")} ${pct}% today. `,
  aboutHeading: (name) => `About ${name}`,
  aboutLead: (g, name, sym, price, exchange) =>
    `${name} (${sym}) ${g === "index" ? "stands at" : "last traded at"} ${price}${exchange ? ` on ${exchange}` : ""}.`,
  aboutMove: (dir, pct, prev) => ` It is ${pick(dir, "up", "down", "flat")} ${pct}% from the previous close of ${prev}.`,
  aboutRange52: (low, high) => ` Over the past 52 weeks it has ranged between ${low} and ${high}.`,
  aboutQuoted: (name, sym, currency, exchange) => `${name} (${sym}) is quoted in ${currency}${exchange ? ` on ${exchange}` : ""}.`,
  aboutWhat: {
    index: (n) => `${n} is a market index, so the level shown is a weighted average of its constituents rather than something you buy directly; index funds and ETFs track it.`,
    "us-stock": (n) => `${n} is listed in the United States. The regular session runs 9:30 a.m. to 4:00 p.m. Eastern Time; the chart above covers regular hours, with extended-hours trades excluded.`,
    etf: (n) => `${n} is an exchange-traded fund, priced continuously during US market hours like a stock while holding a basket of underlying assets.`,
    "jp-stock": (n) => `${n} trades on the Tokyo Stock Exchange in Japanese yen. The session runs 9:00 to 11:30 a.m. and 12:30 to 3:30 p.m. Japan Standard Time.`,
    "kr-stock": (n) => `${n} trades on the Korea Exchange in Korean won, 9:00 a.m. to 3:30 p.m. Korea Standard Time.`,
    crypto: (n) => `${n} trades around the clock, so the daily change is measured against the price 24 hours ago rather than a session close.`,
    fx: (n) => `This is the mid-market rate for ${n} — the midpoint between global buy and sell prices, refreshed continuously during FX trading hours. Banks and transfer services add a margin on top of it.`,
    commodity: (n) => `${n} is quoted from the front-month futures contract, the benchmark most news reports refer to when they cite the "${n.toLowerCase()} price".`,
  },
  moreHeading: (g) => `More ${g}`,
  hubLink: (h) => `${h} →`,
  converterLink: (pair) => `${pair} converter →`,
  dividendsLink: (name) => `${name} dividend history →`,
  technicalsLink: (name) => `${name} technical indicators →`,
  seasonalityLink: (name) => `${name} seasonality →`,
  dcaLink: (name) => `${name} DCA calculator →`,
  averageLink: (name) => `${name} average cost calculator →`,
  unavailable: (sym) => `No data is available for “${sym}” right now. The symbol may be unknown, or the data provider may be unreachable.`,
  backHome: "← Back to the front page",
  footer: "Market data may be delayed and is provided for information only, not investment advice.",
  labels: (crypto) => ({
    keyStats: "Key Stats", chartRange: "Chart range", loading: "Loading…", periodChange: "{r} change",
    prevClose: "Previous close", dayChange: "Day change", periodHigh: "{r} high", periodLow: "{r} low",
    high52: "52-week high", low52: "52-week low",
    trade: crypto ? "Trade Crypto" : "Trade Stocks", partnerOffers: "Partner offers",
    sampleNote: "Note: sample figures shown — live data connects automatically in production deployments.",
  }),
  dirTitle: "All Quotes — Stocks, Indices, Crypto, FX & Commodities",
  dirDesc: (n) => `Live price pages for ${n} symbols: US, Japanese and Korean stocks, ETFs, world indices, cryptocurrencies, currency pairs and commodities.`,
  dirH1: "All Quotes",
  dirSub: (n) => `${n} symbols · live price, chart and key stats for each`,
  dirCount: (n) => `${n} symbols`,
  allQuotes: "All Quotes",
};

const KO: QuoteCopy = {
  groupLabel: {
    index: "지수", "us-stock": "미국 주식", etf: "ETF", "jp-stock": "일본 주식",
    "kr-stock": "한국 주식", crypto: "암호화폐", fx: "환율", commodity: "원자재",
  },
  hubLabel: {
    index: "전체 종목", "us-stock": "미국 증시", etf: "전체 종목", "jp-stock": "일본 증시",
    "kr-stock": "한국 증시", crypto: "코인 시세", fx: "환율", commodity: "전체 종목",
  },
  title: (g, name, sym) => {
    if (g === "crypto") return `${name} 시세 — 실시간 가격·차트`;
    if (g === "index") return `${name} 지수 — 실시간 차트`;
    if (g === "fx") return `${name} 환율 — 실시간 차트`;
    if (g === "commodity") return `${name} 시세 — 실시간 가격·차트`;
    if (g === "etf") return `${name}(${sym}) ETF 주가 — 실시간 차트`;
    return `${name}(${sym}) 주가 — 실시간 시세·차트`;
  },
  description: (g, name, sym, priced) => {
    const what = g === "index" ? "지수" : g === "fx" ? "환율" : g === "crypto" || g === "commodity" ? "시세" : "주가";
    return `${priced}${name} 실시간 ${what}, 1일~1년 차트, 전일 종가, 등락률, 52주 최고·최저를 PNL404에서 한 화면에 확인하세요.`;
  },
  priceSentence: (name, price, dir, pct) => `${name} 현재가는 ${price}, 전일 대비 ${pct}% ${pick(dir, "상승", "하락", "보합")}. `,
  aboutHeading: (name) => `${name} 정보`,
  aboutLead: (g, name, sym, price, exchange) =>
    `${name}(${sym})의 현재 ${g === "index" ? "지수는" : "가격은"} ${price}입니다${exchange ? ` · 거래소: ${exchange}` : ""}.`,
  aboutMove: (dir, pct, prev) => ` 전일 종가 ${prev} 대비 ${pct}% ${pick(dir, "상승", "하락", "보합")}했습니다.`,
  aboutRange52: (low, high) => ` 최근 52주 동안에는 ${low}에서 ${high} 사이에서 움직였습니다.`,
  aboutQuoted: (name, sym, currency, exchange) => `${name}(${sym})의 표시 통화는 ${currency}입니다${exchange ? ` · 거래소: ${exchange}` : ""}.`,
  aboutWhat: {
    index: () => `주가지수이므로 표시되는 수치는 구성 종목을 가중평균한 값이며, 직접 매매하는 대상이 아닙니다. 실제 투자는 이 지수를 추종하는 인덱스 펀드나 ETF를 통해 이루어집니다.`,
    "us-stock": () => `미국 증시에 상장된 종목입니다. 정규장은 미국 동부시간 오전 9시 30분부터 오후 4시까지로, 한국시간으로는 밤 11시 30분부터 다음 날 오전 6시까지입니다(서머타임 적용 기간에는 1시간 앞당겨집니다). 위 차트는 정규장 거래만 반영하며 시간외 거래는 제외됩니다.`,
    etf: () => `여러 자산을 담은 바구니에 투자하는 상장지수펀드(ETF)입니다. 미국 정규장 시간 동안 하나의 종목처럼 실시간으로 사고팔 수 있습니다.`,
    "jp-stock": () => `도쿄증권거래소에 엔화로 상장된 종목입니다. 거래 시간은 오전 9시~11시 30분(전장), 오후 12시 30분~3시 30분(후장)이며 일본과 한국은 시차가 없어 한국시간과 동일합니다.`,
    "kr-stock": () => `한국거래소에 원화로 상장된 종목입니다. 정규장 거래 시간은 오전 9시부터 오후 3시 30분까지입니다.`,
    crypto: () => `24시간 연중무휴로 거래됩니다. 따라서 일간 등락률은 장 마감가가 아니라 24시간 전 가격과 비교한 값입니다.`,
    fx: () => `표시되는 값은 시장 중간가(mid-market)로, 전 세계 매수·매도 호가의 중간값이며 외환시장 거래 시간 동안 계속 갱신됩니다. 은행이나 환전소는 여기에 수수료를 더하므로 실제 환전 시 적용되는 환율은 이보다 불리합니다.`,
    commodity: (n) => `시세는 최근월물 선물 계약 기준입니다. 뉴스에서 "${n} 가격"이라고 인용하는 대표 시세가 바로 이 값입니다.`,
  },
  moreHeading: (g) => `${g} 더 보기`,
  hubLink: (h) => `${h} →`,
  converterLink: (pair) => `${pair} 환율 계산기 →`,
  dividendsLink: (name) => `${name} 배당 이력 →`,
  technicalsLink: (name) => `${name} 기술적 지표 →`,
  seasonalityLink: (name) => `${name} 계절성 →`,
  dcaLink: (name) => `${name} 적립식 투자 계산기 →`,
  averageLink: (name) => `${name} 평단가(물타기) 계산기 →`,
  unavailable: (sym) => `“${sym}”의 데이터를 지금 불러올 수 없습니다. 존재하지 않는 종목이거나 데이터 제공처에 일시적으로 접속할 수 없습니다.`,
  backHome: "← 첫 화면으로",
  footer: "시세는 지연될 수 있으며 정보 제공 목적으로만 제공됩니다. 투자 권유가 아닙니다.",
  labels: (crypto) => ({
    keyStats: "주요 지표", chartRange: "차트 기간", loading: "불러오는 중…", periodChange: "{r} 등락",
    prevClose: "전일 종가", dayChange: "전일 대비", periodHigh: "{r} 최고", periodLow: "{r} 최저",
    high52: "52주 최고", low52: "52주 최저",
    trade: crypto ? "암호화폐 거래" : "주식 거래", partnerOffers: "제휴 안내",
    sampleNote: "참고: 실시간 데이터를 일시적으로 가져올 수 없어 샘플 수치를 표시합니다.",
  }),
  dirTitle: "전체 종목 시세 — 주식·지수·암호화폐·환율·원자재",
  dirDesc: (n) => `${n}개 종목의 실시간 시세 페이지 — 미국·일본·한국 주식, ETF, 세계 주요 지수, 암호화폐, 환율, 원자재.`,
  dirH1: "전체 종목",
  dirSub: (n) => `${n}개 종목 · 종목별 실시간 시세와 차트, 주요 지표`,
  dirCount: (n) => `${n}개 종목`,
  allQuotes: "전체 종목",
};

const JA: QuoteCopy = {
  groupLabel: {
    index: "株価指数", "us-stock": "米国株", etf: "ETF", "jp-stock": "日本株",
    "kr-stock": "韓国株", crypto: "暗号資産", fx: "為替", commodity: "商品",
  },
  hubLabel: {
    index: "全銘柄", "us-stock": "米国株", etf: "全銘柄", "jp-stock": "日本株",
    "kr-stock": "韓国株", crypto: "暗号資産", fx: "為替レート", commodity: "全銘柄",
  },
  title: (g, name, sym) => {
    if (g === "crypto") return `${name}の価格 — リアルタイムチャート`;
    if (g === "index") return `${name} — リアルタイムチャート・指数`;
    if (g === "fx") return `${name}の為替レート — リアルタイムチャート`;
    if (g === "commodity") return `${name}の価格 — リアルタイムチャート`;
    if (g === "etf") return `${name}（${sym}）ETFの価格・チャート`;
    return `${name}（${sym}）の株価 — リアルタイムチャート`;
  },
  description: (g, name, sym, priced) => {
    const what = g === "index" ? "指数" : g === "fx" ? "為替レート" : g === "crypto" || g === "commodity" ? "価格" : "株価";
    return `${priced}${name}のリアルタイム${what}と1日〜1年のチャート、前日終値、変動率、52週高値・安値をPNL404で確認できます。`;
  },
  priceSentence: (name, price, dir, pct) => `${name}の現在値は${price}、前日比${pct}%${pick(dir, "上昇", "下落", "変わらず")}。`,
  aboutHeading: (name) => `${name}について`,
  aboutLead: (g, name, sym, price, exchange) =>
    `${name}（${sym}）の現在${g === "index" ? "の指数は" : "値は"}${price}です${exchange ? `（${exchange}）` : ""}。`,
  aboutMove: (dir, pct, prev) => ` 前日終値${prev}と比べて${pct}%${pick(dir, "上昇", "下落", "変わらず")}しています。`,
  aboutRange52: (low, high) => ` 過去52週間は${low}〜${high}のレンジで推移しました。`,
  aboutQuoted: (name, sym, currency, exchange) => `${name}（${sym}）は${currency}建てで表示されます${exchange ? `（${exchange}）` : ""}。`,
  aboutWhat: {
    index: (n) => `${n}は株価指数のため、表示されている数値は構成銘柄を加重平均した値であり、直接売買する対象ではありません。実際の投資は、この指数に連動するインデックスファンドやETFを通じて行います。`,
    "us-stock": (n) => `${n}は米国市場に上場しています。通常取引は米国東部時間の午前9時30分から午後4時までで、日本時間では23時30分から翌朝6時まで（夏時間の期間は1時間繰り上がります）。上のチャートは通常取引のみを反映し、時間外取引は含みません。`,
    etf: (n) => `${n}は上場投資信託（ETF）です。複数の資産をまとめたバスケットを、株式と同じように米国市場の取引時間中にリアルタイムで売買できます。`,
    "jp-stock": (n) => `${n}は東京証券取引所に上場しています。取引時間は前場が9時〜11時30分、後場が12時30分〜15時30分です。`,
    "kr-stock": (n) => `${n}は韓国取引所にウォン建てで上場しています。取引時間は韓国時間の9時から15時30分までで、日本との時差はありません。`,
    crypto: (n) => `${n}は24時間365日取引されます。そのため日間の変動率は取引終了時の終値ではなく、24時間前の価格と比較した値です。`,
    fx: (n) => `表示されている値は${n}の仲値（ミッドマーケットレート）で、世界の買値と売値の中間値です。外国為替市場の取引時間中は継続的に更新されます。銀行や両替所はこれに手数料を上乗せするため、実際の両替レートはこれより不利になります。`,
    commodity: (n) => `${n}の価格は期近の先物契約に基づいています。ニュースで「${n}価格」として引用される代表的な指標がこの値です。`,
  },
  moreHeading: (g) => `${g}をもっと見る`,
  hubLink: (h) => `${h} →`,
  converterLink: (pair) => `${pair}の為替計算 →`,
  dividendsLink: (name) => `${name}の配当履歴 →`,
  technicalsLink: (name) => `${name}のテクニカル指標 →`,
  seasonalityLink: (name) => `${name}の季節性 →`,
  dcaLink: (name) => `${name}の積立シミュレーション →`,
  averageLink: (name) => `${name}の平均取得単価計算機 →`,
  unavailable: (sym) => `「${sym}」のデータを現在取得できません。銘柄コードが存在しないか、データ提供元に一時的に接続できない可能性があります。`,
  backHome: "← トップページへ",
  footer: "相場情報は遅延する場合があり、情報提供のみを目的としています。投資勧誘ではありません。",
  labels: (crypto) => ({
    keyStats: "主要指標", chartRange: "チャート期間", loading: "読み込み中…", periodChange: "{r}変動",
    prevClose: "前日終値", dayChange: "前日比", periodHigh: "{r}高値", periodLow: "{r}安値",
    high52: "52週高値", low52: "52週安値",
    trade: crypto ? "暗号資産取引" : "株式取引", partnerOffers: "提携サービス",
    sampleNote: "注: リアルタイムデータを一時的に取得できないため、サンプル値を表示しています。",
  }),
  dirTitle: "全銘柄の価格・チャート — 株式・指数・暗号資産・為替・商品",
  dirDesc: (n) => `${n}銘柄のリアルタイム価格ページ — 米国・日本・韓国株、ETF、世界の主要指数、暗号資産、為替、商品。`,
  dirH1: "全銘柄",
  dirSub: (n) => `${n}銘柄 · 銘柄ごとのリアルタイム価格・チャート・主要指標`,
  dirCount: (n) => `${n}銘柄`,
  allQuotes: "全銘柄",
};

export const QUOTE_COPY: Record<Lang, QuoteCopy> = { en: EN, ko: KO, ja: JA };
