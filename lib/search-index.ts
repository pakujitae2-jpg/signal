import { COMPARE_PAIRS } from "./compare";
import { PULSE_LINKS, pulseText } from "./pulse";
import { CURRENCIES, MAJOR, pairSlug } from "./fx";
import { prefix, curName, type Lang } from "./i18n";
import { localName } from "./names";
import { QUOTE_COPY } from "./quote-copy";
import { symbolSlug } from "./slug";
import { UNIVERSE } from "./universe";

// Catalog shipped to the /search page so typing filters instantly with no
// round trip. Field names are single letters because the whole list is
// serialized into the HTML.

export type SearchEntry = {
  /** href */ h: string;
  /** title */ t: string;
  /** kicker */ k: string;
  /** extra search terms, lowercase */ x: string;
};

const HUBS: Record<Lang, [string, string, string, string][]> = {
  en: [
    ["/", "Front page", "Desk", "home markets tape"],
    ["/movers", "Daily movers", "Hub", "gainers losers heatmap"],
    ["/quotes", "All quotes", "Desk", "tickers universe symbols"],
    ["/convert", "Currency converter", "FX", "exchange rate money"],
    ["/kimchi-premium", "Kimchi premium", "Hub", "upbit korea bitcoin 김치프리미엄"],
    ["/fear-greed", "Crypto Fear & Greed", "Hub", "sentiment index"],
    ["/tools/invested", "If I had invested", "Calculator", "what if returns backtest"],
    ["/compare", "Compare", "Hub", "versus vs head to head"],
    ["/widget", "Ticker widget", "Embed", "iframe embed publisher"],
    ["/markets/us", "U.S. markets", "Equities", "nyse nasdaq sp500 dow"],
    ["/markets/japan", "Japan markets", "Equities", "nikkei tokyo tse"],
    ["/markets/korea", "Korea markets", "Equities", "kospi kosdaq krx"],
    ["/markets/crypto", "Crypto markets", "Crypto", "bitcoin ethereum"],
  ],
  ko: [
    ["/", "첫 화면", "데스크", "home 메인 시황"],
    ["/movers", "급등락 종목", "허브", "상승 하락 gainers losers"],
    ["/quotes", "전체 종목", "데스크", "티커 종목 목록"],
    ["/convert", "환율 계산기", "환율", "환전 exchange rate"],
    ["/kimchi-premium", "김치프리미엄", "허브", "업비트 역프 upbit kimchi"],
    ["/fear-greed", "공포탐욕지수", "허브", "심리 sentiment fear greed"],
    ["/tools/invested", "그때 샀더라면", "계산기", "수익률 계산 backtest invested"],
    ["/compare", "종목 비교", "허브", "versus vs 대결"],
    ["/widget", "시세 위젯", "임베드", "iframe embed 위젯"],
    ["/markets/us", "미국 증시", "주식", "나스닥 다우 sp500 nasdaq"],
    ["/markets/japan", "일본 증시", "주식", "닛케이 도쿄 nikkei"],
    ["/markets/korea", "한국 증시", "주식", "코스피 코스닥 kospi kosdaq"],
    ["/markets/crypto", "코인 시세", "암호화폐", "비트코인 이더리움 bitcoin"],
  ],
  ja: [
    ["/", "トップページ", "デスク", "home 市況"],
    ["/movers", "値上がり・値下がり", "ハブ", "騰落 gainers losers"],
    ["/quotes", "全銘柄", "デスク", "ティッカー 銘柄一覧"],
    ["/convert", "為替計算機", "為替", "両替 exchange rate"],
    ["/kimchi-premium", "キムチプレミアム", "ハブ", "アップビット upbit kimchi"],
    ["/fear-greed", "恐怖・強欲指数", "ハブ", "市場心理 sentiment fear greed"],
    ["/tools/invested", "あの時買っていたら", "計算機", "リターン 試算 invested"],
    ["/compare", "銘柄比較", "ハブ", "versus vs 対決"],
    ["/widget", "ティッカーウィジェット", "埋め込み", "iframe embed ウィジェット"],
    ["/markets/us", "米国株式市場", "株式", "ナスダック ダウ sp500 nasdaq"],
    ["/markets/japan", "日本株", "株式", "日経平均 東証 nikkei"],
    ["/markets/korea", "韓国株式市場", "株式", "KOSPI KOSDAQ コスピ"],
    ["/markets/crypto", "暗号資産", "暗号資産", "ビットコイン イーサリアム bitcoin"],
  ],
};

/** Ticker without the exchange or instrument suffix, for search matching. */
function ticker(symbol: string): string {
  return symbol.replace(/^\^/, "").replace(/\.(KS|KQ|T|SS|NYB)$/i, "").replace(/-USD$/i, "").replace(/=[XF]$/, "");
}

export function buildSearchIndex(lang: Lang): SearchEntry[] {
  const p = prefix(lang);
  const q = QUOTE_COPY[lang];
  const out: SearchEntry[] = [];

  for (const [href, title, kicker, extra] of HUBS[lang]) {
    out.push({ h: `${p}${href}`, t: title, k: kicker, x: extra.toLowerCase() });
  }

  for (const e of UNIVERSE) {
    const name = localName(lang, e.symbol, e.name);
    out.push({
      h: `${p}/quote/${encodeURIComponent(e.symbol)}`,
      t: name,
      k: q.groupLabel[e.group],
      // Both the localized and English names, so "samsung" and "삼성" both hit.
      x: `${e.symbol} ${ticker(e.symbol)} ${symbolSlug(e.symbol)} ${e.name}`.toLowerCase(),
    });
  }

  for (const code of Object.keys(CURRENCIES)) {
    out.push({
      h: `${p}/convert/${code.toLowerCase()}`,
      t: `${curName(lang, code)} (${code})`,
      k: q.groupLabel.fx,
      x: `${code} ${CURRENCIES[code].name} convert`.toLowerCase(),
    });
  }

  for (const b of MAJOR) {
    for (const qc of MAJOR) {
      if (b === qc) continue;
      out.push({
        h: `${p}/convert/${pairSlug(b, qc)}`,
        t: `${b} → ${qc}`,
        k: q.groupLabel.fx,
        x: `${b} ${qc} ${curName(lang, b)} ${curName(lang, qc)} rate`.toLowerCase(),
      });
    }
  }

  for (const entry of PULSE_LINKS) {
    const text = pulseText(lang, entry.slug);
    if (!text) continue;
    out.push({
      h: `${p}/pulse/${entry.slug}`,
      t: text.query,
      k: text.kicker,
      x: `${entry.slug} ${text.kicker}`.toLowerCase(),
    });
  }

  for (const pair of COMPARE_PAIRS) {
    const l = localName(lang, pair.left.symbol, pair.left.name);
    const r = localName(lang, pair.right.symbol, pair.right.name);
    out.push({
      h: `${p}/compare/${pair.slug}`,
      t: `${l} vs ${r}`,
      k: HUBS[lang][7][1],
      x: `${pair.slug} ${pair.left.name} ${pair.right.name} versus`.toLowerCase(),
    });
  }

  return out;
}
