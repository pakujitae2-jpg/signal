import { DIVIDEND_SYMBOLS, dividendsFor, payoutFrequency, ttmSum } from "./dividends";
import type { Lang } from "./i18n";
import { fetchSpark } from "./market";
import { byGroup, universeEntry, type UniverseGroup } from "./universe";

// /list/<slug> — named-collection pages ("magnificent seven", "monthly
// dividend ETFs") that answer "show me the list", distinct from the /technicals
// screener which answers "filter for me". Ranked on price/day-change/yield —
// never market cap, P/E, revenue or short interest, none of which any free
// Yahoo endpoint returns for this project (v7/v10 quote both 401).

export type ListKind = "curated" | "dividend-monthly" | "dividend-yield";

export type ThemeListDef = {
  slug: string;
  kind: ListKind;
  /** Resolves the member symbols at request time — a fixed array for curated
   *  lists, or a derivation over UNIVERSE/dividend data for the rest. */
  symbolsFn: () => string[];
  names: Record<Lang, string>;
  intros: Record<Lang, string>;
};

function curated(slug: string, symbols: string[], names: Record<Lang, string>, intros: Record<Lang, string>): ThemeListDef {
  return { slug, kind: "curated", symbolsFn: () => symbols, names, intros };
}

function fromGroup(group: UniverseGroup, limit: number | undefined, slug: string, names: Record<Lang, string>, intros: Record<Lang, string>): ThemeListDef {
  return {
    slug,
    kind: "curated",
    symbolsFn: () => {
      const all = byGroup(group).map((e) => e.symbol);
      return limit ? all.slice(0, limit) : all;
    },
    names,
    intros,
  };
}

export const THEME_LISTS: ThemeListDef[] = [
  curated(
    "magnificent-seven",
    ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"],
    { en: "Magnificent Seven Stocks", ko: "매그니피센트 7 종목", ja: "マグニフィセント・セブン銘柄" },
    {
      en: "The seven US mega-caps whose combined moves have driven most of the S&P 500's return since 2023: Apple, Microsoft, Nvidia, Alphabet, Amazon, Meta and Tesla.",
      ko: "2023년 이후 S&P 500 수익률의 상당 부분을 이끈 미국 대형 기술주 7종목입니다: 애플, 마이크로소프트, 엔비디아, 알파벳, 아마존, 메타, 테슬라.",
      ja: "2023年以降のS&P500のリターンの大部分を牽引してきた米国の大型テック株7銘柄です:アップル、マイクロソフト、エヌビディア、アルファベット、アマゾン、メタ、テスラ。",
    }
  ),
  curated(
    "faang",
    ["META", "AMZN", "AAPL", "NFLX", "GOOGL"],
    { en: "FAANG Stocks", ko: "FAANG 종목", ja: "FAANG銘柄" },
    {
      en: "The original big-tech acronym: Meta (Facebook), Amazon, Apple, Netflix and Google (Alphabet).",
      ko: "빅테크를 가리키던 원조 약어입니다: 메타(페이스북), 아마존, 애플, 넷플릭스, 구글(알파벳).",
      ja: "ビッグテックを指す元祖の頭字語です:メタ(旧Facebook)、アマゾン、アップル、ネットフリックス、グーグル(アルファベット)。",
    }
  ),
  curated(
    "semiconductor-stocks",
    ["NVDA", "AVGO", "AMD", "TXN", "QCOM", "INTC", "MU", "LRCX", "KLAC", "AMAT", "ADI", "ON", "NXPI", "MCHP", "TSM", "ASML", "ARM"],
    { en: "Semiconductor Stocks", ko: "반도체 관련주", ja: "半導体関連銘柄" },
    {
      en: "Chipmakers and semiconductor equipment suppliers, from GPU and CPU designers to the lithography and etch-tool makers behind them.",
      ko: "GPU·CPU를 설계하는 팹리스 기업부터 노광·식각 장비를 만드는 소재·장비 기업까지, 반도체 밸류체인 전반의 종목입니다.",
      ja: "GPU・CPUを設計するファブレス企業から、露光・エッチング装置を手がける半導体製造装置メーカーまで、半導体バリューチェーン全体の銘柄です。",
    }
  ),
  curated(
    "ai-stocks",
    ["NVDA", "MSFT", "GOOGL", "META", "AMZN", "PLTR", "AMD", "ORCL", "CRM", "SNOW", "SMCI", "ARM", "TSM", "ASML", "DELL"],
    { en: "AI Stocks", ko: "AI(인공지능) 관련주", ja: "AI(人工知能)関連銘柄" },
    {
      en: "Companies building AI infrastructure and software — GPUs, cloud platforms, data-center hardware and AI-driven applications.",
      ko: "GPU, 클라우드 플랫폼, 데이터센터 하드웨어부터 AI 기반 소프트웨어까지, AI 인프라와 서비스를 만드는 기업들입니다.",
      ja: "GPUやクラウド基盤、データセンター向けハードウェアからAI活用ソフトウェアまで、AIインフラとサービスを手がける企業群です。",
    }
  ),
  curated(
    "ev-stocks",
    ["TSLA", "RIVN", "LCID", "NIO", "GM", "F", "005380.KS"],
    { en: "Electric Vehicle Stocks", ko: "전기차 관련주", ja: "電気自動車(EV)関連銘柄" },
    {
      en: "Pure-play EV makers alongside legacy automakers with a growing electric line-up.",
      ko: "전기차 전문 업체와 함께, 전기차 라인업을 확대하고 있는 기존 완성차 업체를 포함합니다.",
      ja: "EV専業メーカーに加え、電気自動車ラインアップを拡大している既存の完成車メーカーも含みます。",
    }
  ),
  curated(
    "nuclear-energy-stocks",
    ["CEG", "VST", "GEV", "OKLO"],
    { en: "Nuclear Energy Stocks", ko: "원자력 관련주", ja: "原子力関連銘柄" },
    {
      en: "Nuclear plant operators and next-generation reactor developers, a theme revived by data centers' power demand.",
      ko: "데이터센터 전력 수요 확대로 다시 주목받는 원전 운영사와 차세대 원자로 개발 기업입니다.",
      ja: "データセンターの電力需要拡大で再び注目される原発運営会社と次世代原子炉の開発企業です。",
    }
  ),
  curated(
    "airline-stocks",
    ["DAL", "UAL", "AAL", "LUV", "003490.KS"],
    { en: "Airline Stocks", ko: "항공주", ja: "航空関連銘柄" },
    {
      en: "Major US carriers plus Korean Air, tracked against jet fuel and travel-demand cycles.",
      ko: "미국 대형 항공사와 대한항공을 함께 담아, 유가·여행 수요 사이클에 따른 흐름을 볼 수 있습니다.",
      ja: "米国大手航空会社に大韓航空を加え、燃油価格や旅行需要サイクルによる値動きを確認できます。",
    }
  ),
  curated(
    "chinese-adrs",
    ["BABA", "PDD", "JD", "NIO"],
    { en: "Chinese ADRs", ko: "중국 ADR 종목", ja: "中国ADR銘柄" },
    {
      en: "Chinese companies trading as US-listed American Depositary Receipts — Alibaba, PDD Holdings, JD.com and NIO.",
      ko: "미국 증시에 ADR로 상장된 중국 기업들입니다: 알리바바, PDD 홀딩스, JD닷컴, 니오.",
      ja: "米国市場にADRとして上場している中国企業です:アリババ、PDDホールディングス、JD.com、NIO。",
    }
  ),
  curated(
    "korea-large-cap",
    ["005930.KS", "000660.KS", "373220.KS", "005380.KS", "035420.KS", "035720.KS", "005490.KS", "051910.KS", "006400.KS", "000270.KS", "105560.KS", "055550.KS"],
    { en: "Korea Large-Cap Stocks", ko: "한국 대형주", ja: "韓国大型株" },
    {
      en: "The most widely held names on the KOSPI, spanning chips, autos, batteries, internet platforms and financials.",
      ko: "반도체, 자동차, 배터리, 인터넷 플랫폼, 금융까지 코스피를 대표하는 대형주입니다.",
      ja: "半導体・自動車・電池・インターネットプラットフォーム・金融まで、KOSPIを代表する大型株です。",
    }
  ),
  {
    slug: "kosdaq",
    kind: "curated",
    symbolsFn: () => byGroup("kr-stock").map((e) => e.symbol).filter((s) => s.endsWith(".KQ")),
    names: { en: "KOSDAQ Stocks", ko: "코스닥 종목", ja: "KOSDAQ銘柄" },
    intros: {
      en: "Every KOSDAQ-listed name this site tracks — Korea's growth-stock market, weighted toward biotech, gaming and secondary battery materials.",
      ko: "이 사이트가 추적하는 코스닥 상장 종목 전체입니다. 바이오, 게임, 2차전지 소재 비중이 높은 한국의 성장주 시장입니다.",
      ja: "本サイトが追跡するKOSDAQ上場銘柄全てです。バイオ・ゲーム・二次電池材料の比重が高い韓国のグロース市場です。",
    },
  },
  curated(
    "japan-large-cap",
    ["7203.T", "6758.T", "9984.T", "8306.T", "6861.T", "7974.T", "6501.T", "8035.T", "9433.T", "9432.T"],
    { en: "Japan Large-Cap Stocks", ko: "일본 대형주", ja: "日本の大型株" },
    {
      en: "The largest and most-traded names on the Tokyo Stock Exchange, from Toyota and Sony to Tokyo Electron and Nintendo.",
      ko: "도요타, 소니부터 도쿄일렉트론, 닌텐도까지 도쿄증권거래소를 대표하는 대형주입니다.",
      ja: "トヨタ自動車やソニーグループから東京エレクトロン、任天堂まで、東証を代表する大型株です。",
    }
  ),
  fromGroup(
    "index",
    undefined,
    "world-indices",
    { en: "World Stock Indices", ko: "세계 주요 지수", ja: "世界の主要株価指数" },
    {
      en: "Benchmark equity indices across the US, Asia, Europe and the Americas, plus the VIX and US dollar index.",
      ko: "미국, 아시아, 유럽, 아메리카 대륙의 대표 주가지수와 VIX, 달러 인덱스를 함께 모았습니다.",
      ja: "米国・アジア・欧州・南北アメリカの代表的な株価指数に、VIXやドル指数も加えました。",
    }
  ),
  curated(
    "major-etfs",
    ["SPY", "QQQ", "VOO", "VTI", "IWM", "DIA", "GLD", "TLT"],
    { en: "Major ETFs", ko: "주요 ETF", ja: "主要ETF" },
    {
      en: "The most widely held broad-market, gold and bond ETFs.",
      ko: "가장 널리 보유되는 대표 지수·금·채권 ETF입니다.",
      ja: "最も広く保有されている代表的な株式指数・金・債券ETFです。",
    }
  ),
  curated(
    "bitcoin-ethereum-etfs",
    ["IBIT", "ETHA"],
    { en: "Bitcoin & Ethereum ETFs", ko: "비트코인·이더리움 ETF", ja: "ビットコイン・イーサリアムETF" },
    {
      en: "US-listed spot crypto ETFs: BlackRock's iShares Bitcoin Trust and iShares Ethereum Trust.",
      ko: "미국에 상장된 현물 암호화폐 ETF입니다: 블랙록의 아이셰어즈 비트코인 트러스트와 이더리움 트러스트.",
      ja: "米国上場のスポット暗号資産ETFです:ブラックロックのiシェアーズ・ビットコイン・トラストとイーサリアム・トラスト。",
    }
  ),
  fromGroup(
    "crypto",
    10,
    "top-crypto",
    { en: "Top 10 Crypto by Market Cap", ko: "시가총액 상위 10대 코인", ja: "時価総額上位10位の暗号資産" },
    {
      en: "The ten largest cryptocurrencies this site tracks, ranked by CoinGecko's market-cap order.",
      ko: "이 사이트가 추적하는 코인 중 CoinGecko 시가총액 기준 상위 10종입니다.",
      ja: "本サイトが追跡する暗号資産のうち、CoinGeckoの時価総額順で上位10銘柄です。",
    }
  ),
  fromGroup(
    "fx",
    8,
    "major-currency-pairs",
    { en: "Major Currency Pairs", ko: "주요 통화쌍", ja: "主要通貨ペア" },
    {
      en: "The most-traded currency pairs against the US dollar, plus a handful of Asia-Pacific crosses.",
      ko: "미국 달러 대비 가장 많이 거래되는 통화쌍과 아시아·태평양 주요 크로스 환율입니다.",
      ja: "米ドルに対して最も取引量の多い通貨ペアと、アジア太平洋の主要クロスレートです。",
    }
  ),
  curated(
    "quantum-computing-stocks",
    ["IONQ", "RGTI"],
    { en: "Quantum Computing Stocks", ko: "양자컴퓨팅 관련주", ja: "量子コンピューティング関連銘柄" },
    {
      en: "The two pure-play quantum computing companies in this site's catalogue.",
      ko: "이 사이트가 다루는 종목 중 양자컴퓨팅을 주력 사업으로 하는 두 곳입니다.",
      ja: "本サイトが追跡する銘柄のうち、量子コンピューティングを主力事業とする2社です。",
    }
  ),
  { // monthly-dividend-etfs
    slug: "monthly-dividend-etfs",
    kind: "dividend-monthly",
    symbolsFn: () => dividendEtfSymbols().filter((s) => {
      const rec = dividendsFor(s);
      return rec ? payoutFrequency(rec) === "monthly" : false;
    }),
    names: { en: "Monthly Dividend ETFs", ko: "월배당 ETF 목록", ja: "毎月分配ETF一覧" },
    intros: {
      en: "ETFs this site tracks whose ex-dividend dates fall roughly every month, inferred from the actual gap between recent payouts — not a stated policy.",
      ko: "실제 배당락일 간격을 기준으로 추정한, 매달 분배가 이뤄지는 것으로 보이는 ETF입니다. 운용사가 공식적으로 밝힌 정책이 아니라 최근 지급 이력에서 계산한 값입니다.",
      ja: "直近の実際の分配間隔から推定した、ほぼ毎月分配を行っているとみられるETFです。運用会社が公表した方針ではなく、過去の支払い実績から算出しています。",
    },
  },
  { // high-yield-etfs
    slug: "high-yield-etfs",
    kind: "dividend-yield",
    symbolsFn: () => dividendEtfSymbols(),
    names: { en: "Highest-Yield ETFs Tracked", ko: "고배당 ETF 순위", ja: "高配当利回りETFランキング" },
    intros: {
      en: "This site's dividend-paying ETFs ranked by trailing twelve-month yield — dividends actually paid divided by the current price, not a forward estimate.",
      ko: "이 사이트가 추적하는 배당 ETF를 최근 12개월 배당 수익률 기준으로 정렬했습니다. 예상치가 아니라 실제로 지급된 배당금을 현재가로 나눈 값입니다.",
      ja: "本サイトが追跡する分配型ETFを、直近12カ月の分配利回りで並べたものです。予想値ではなく、実際に支払われた分配金を現在の価格で割った実績値です。",
    },
  },
];

// Leveraged/inverse funds excluded from the dividend-derived lists: their
// distributions are largely capital-gains rebalancing artifacts, not the
// sustainable income a "yield" framing implies (TQQQ/SQQQ are 3x QQQ).
const NON_INCOME_ETFS = new Set(["TQQQ", "SQQQ"]);

function dividendEtfSymbols(): string[] {
  return DIVIDEND_SYMBOLS.filter((s) => universeEntry(s)?.group === "etf" && !NON_INCOME_ETFS.has(s));
}

export function themeListBySlug(slug: string): ThemeListDef | undefined {
  return THEME_LISTS.find((l) => l.slug === slug);
}

export type ListRow = {
  symbol: string;
  name: string;
  price: number | null;
  currency?: string;
  changePct: number | null;
  yieldPct?: number;
};

function inferCurrency(symbol: string, group: UniverseGroup): string | undefined {
  if (group === "index") return undefined;
  if (symbol.endsWith(".KS") || symbol.endsWith(".KQ")) return "KRW";
  if (symbol.endsWith(".T")) return "JPY";
  if (symbol.endsWith("=X")) {
    const base = symbol.slice(0, -2);
    return base.length === 3 ? base : base.slice(3);
  }
  return "USD";
}

/** Live price + day change for a curated list, or price + trailing yield for
 *  the dividend-derived lists — sorted by whichever of those is the list's
 *  own ranking metric, highest first. */
export async function themeListRows(def: ThemeListDef): Promise<ListRow[]> {
  const symbols = def.symbolsFn();
  if (symbols.length === 0) return [];
  const spark = await fetchSpark(symbols, "1d", "5m", 300);

  const rows: ListRow[] = symbols.flatMap((symbol) => {
    const entry = universeEntry(symbol);
    if (!entry) return [];
    const row = spark.get(symbol);
    const price = row?.last ?? null;
    const prev = row?.prev ?? null;
    const changePct = price !== null && prev ? ((price - prev) / prev) * 100 : null;
    const currency = inferCurrency(symbol, entry.group);

    if (def.kind === "curated") {
      return [{ symbol, name: entry.name, price, currency, changePct }];
    }
    const rec = dividendsFor(symbol);
    const yieldPct = rec && price ? (ttmSum(rec) / price) * 100 : undefined;
    return [{ symbol, name: entry.name, price, currency, changePct, yieldPct }];
  });

  if (def.kind === "dividend-yield") {
    return rows.filter((r) => r.yieldPct !== undefined && r.yieldPct > 0).sort((a, b) => (b.yieldPct ?? 0) - (a.yieldPct ?? 0));
  }
  return rows;
}
