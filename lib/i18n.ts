// Localized copy for the currency pages (/ko/convert/…, /ja/convert/…).
// English lives here too so every locale renders through the same template.

import { CURRENCIES } from "./fx";

export type Lang = "en" | "ko" | "ja";
export const LANGS: Lang[] = ["en", "ko", "ja"];
export const LOCALE_TAG: Record<Lang, string> = { en: "en-US", ko: "ko-KR", ja: "ja-JP" };
export const LANG_LABEL: Record<Lang, string> = { en: "English", ko: "한국어", ja: "日本語" };

export function isLang(s: string): s is Lang {
  return (LANGS as string[]).includes(s);
}

/** Path prefix for a locale ("" for English). */
export function prefix(lang: Lang): string {
  return lang === "en" ? "" : `/${lang}`;
}

const KO: Record<string, string> = {
  USD: "미국 달러", EUR: "유로", JPY: "일본 엔", GBP: "영국 파운드", KRW: "대한민국 원", CNY: "중국 위안", INR: "인도 루피",
  AUD: "호주 달러", CAD: "캐나다 달러", CHF: "스위스 프랑", HKD: "홍콩 달러", SGD: "싱가포르 달러", NZD: "뉴질랜드 달러",
  SEK: "스웨덴 크로나", NOK: "노르웨이 크로네", DKK: "덴마크 크로네", PLN: "폴란드 즈워티", CZK: "체코 코루나", HUF: "헝가리 포린트",
  RON: "루마니아 레우", TRY: "튀르키예 리라", MXN: "멕시코 페소", BRL: "브라질 헤알", ZAR: "남아프리카 랜드", THB: "태국 바트",
  IDR: "인도네시아 루피아", MYR: "말레이시아 링깃", PHP: "필리핀 페소", ILS: "이스라엘 셰켈", ISK: "아이슬란드 크로나",
  VND: "베트남 동", TWD: "대만 달러", AED: "아랍에미리트 디르함", SAR: "사우디 리얄", EGP: "이집트 파운드", PKR: "파키스탄 루피",
  BDT: "방글라데시 타카", NGN: "나이지리아 나이라", KWD: "쿠웨이트 디나르", QAR: "카타르 리얄", ARS: "아르헨티나 페소",
  CLP: "칠레 페소", COP: "콜롬비아 페소",
};
// Short everyday names used in titles ("달러 환율", "엔화 환율").
const KO_SHORT: Record<string, string> = { USD: "달러", JPY: "엔화", KRW: "원화", EUR: "유로", GBP: "파운드", CNY: "위안", TWD: "대만달러", HKD: "홍콩달러", VND: "베트남동", THB: "바트" };

const JA: Record<string, string> = {
  USD: "米ドル", EUR: "ユーロ", JPY: "日本円", GBP: "英ポンド", KRW: "韓国ウォン", CNY: "中国人民元", INR: "インドルピー",
  AUD: "豪ドル", CAD: "カナダドル", CHF: "スイスフラン", HKD: "香港ドル", SGD: "シンガポールドル", NZD: "ニュージーランドドル",
  SEK: "スウェーデンクローナ", NOK: "ノルウェークローネ", DKK: "デンマーククローネ", PLN: "ポーランドズロチ", CZK: "チェココルナ",
  HUF: "ハンガリーフォリント", RON: "ルーマニアレウ", TRY: "トルコリラ", MXN: "メキシコペソ", BRL: "ブラジルレアル",
  ZAR: "南アフリカランド", THB: "タイバーツ", IDR: "インドネシアルピア", MYR: "マレーシアリンギット", PHP: "フィリピンペソ",
  ILS: "イスラエルシェケル", ISK: "アイスランドクローナ", VND: "ベトナムドン", TWD: "台湾ドル", AED: "UAEディルハム",
  SAR: "サウジリヤル", EGP: "エジプトポンド", PKR: "パキスタンルピー", BDT: "バングラデシュタカ", NGN: "ナイジェリアナイラ",
  KWD: "クウェートディナール", QAR: "カタールリヤル", ARS: "アルゼンチンペソ", CLP: "チリペソ", COP: "コロンビアペソ",
};

const KO_COUNTRY: Record<string, string> = {
  USD: "미국", EUR: "유로존", JPY: "일본", GBP: "영국", KRW: "대한민국", CNY: "중국", INR: "인도", AUD: "호주", CAD: "캐나다", CHF: "스위스",
  HKD: "홍콩", SGD: "싱가포르", NZD: "뉴질랜드", SEK: "스웨덴", NOK: "노르웨이", DKK: "덴마크", PLN: "폴란드", CZK: "체코", HUF: "헝가리",
  RON: "루마니아", TRY: "튀르키예", MXN: "멕시코", BRL: "브라질", ZAR: "남아프리카공화국", THB: "태국", IDR: "인도네시아", MYR: "말레이시아",
  PHP: "필리핀", ILS: "이스라엘", ISK: "아이슬란드", VND: "베트남", TWD: "대만", AED: "아랍에미리트", SAR: "사우디아라비아", EGP: "이집트",
  PKR: "파키스탄", BDT: "방글라데시", NGN: "나이지리아", KWD: "쿠웨이트", QAR: "카타르", ARS: "아르헨티나", CLP: "칠레", COP: "콜롬비아",
};
const JA_COUNTRY: Record<string, string> = {
  USD: "アメリカ", EUR: "ユーロ圏", JPY: "日本", GBP: "イギリス", KRW: "韓国", CNY: "中国", INR: "インド", AUD: "オーストラリア", CAD: "カナダ",
  CHF: "スイス", HKD: "香港", SGD: "シンガポール", NZD: "ニュージーランド", SEK: "スウェーデン", NOK: "ノルウェー", DKK: "デンマーク",
  PLN: "ポーランド", CZK: "チェコ", HUF: "ハンガリー", RON: "ルーマニア", TRY: "トルコ", MXN: "メキシコ", BRL: "ブラジル", ZAR: "南アフリカ",
  THB: "タイ", IDR: "インドネシア", MYR: "マレーシア", PHP: "フィリピン", ILS: "イスラエル", ISK: "アイスランド", VND: "ベトナム", TWD: "台湾",
  AED: "アラブ首長国連邦", SAR: "サウジアラビア", EGP: "エジプト", PKR: "パキスタン", BDT: "バングラデシュ", NGN: "ナイジェリア",
  KWD: "クウェート", QAR: "カタール", ARS: "アルゼンチン", CLP: "チリ", COP: "コロンビア",
};

/** Full currency name in the locale. */
export function curName(lang: Lang, code: string): string {
  if (lang === "ko") return KO[code] ?? code;
  if (lang === "ja") return JA[code] ?? code;
  return CURRENCIES[code]?.name ?? code;
}

/** Plural/quantity form: "US Dollars" in English; other locales have no plural. */
export function curPlural(lang: Lang, code: string): string {
  return lang === "en" ? (CURRENCIES[code]?.plural ?? code) : curName(lang, code);
}

/** Short colloquial name for titles ("달러", "엔화"); falls back to the full name. */
export function curShort(lang: Lang, code: string): string {
  if (lang === "ko") return KO_SHORT[code] ?? KO[code] ?? code;
  return curName(lang, code);
}

export function curCountry(lang: Lang, code: string): string {
  if (lang === "ko") return KO_COUNTRY[code] ?? code;
  if (lang === "ja") return JA_COUNTRY[code] ?? code;
  return CURRENCIES[code]?.countries ?? code;
}

// Korean particles agree with the final consonant of the preceding syllable.
// Only used on words we know are Hangul (currency names).
function hasBatchim(word: string): boolean {
  const ch = word.trim().slice(-1);
  const code = ch.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}
function jongseong(word: string): number {
  const code = word.trim().slice(-1).charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3 ? (code - 0xac00) % 28 : 0;
}
/** Particle only, so a "(USD)" can sit between the word and its particle. */
export const eunP = (w: string) => (hasBatchim(w) ? "은" : "는");
export const eulP = (w: string) => (hasBatchim(w) ? "을" : "를");
/** 으로/로 — a final ㄹ (jongseong 8) takes 로. */
export const euroP = (w: string) => {
  const j = jongseong(w);
  return j === 0 || j === 8 ? "로" : "으로";
};
/** 은/는 */ export const eun = (w: string) => w + eunP(w);
/** 을/를 */ export const eul = (w: string) => w + eulP(w);
/** 으로/로 */ export const euro = (w: string) => w + euroP(w);

type Fmt = (v: number) => string;

/** Copy for the pair / amount / hub / index pages. Rates arrive pre-formatted. */
export type Copy = {
  currencies: string;
  updated: string;
  today: string;
  convert: string;
  popularAmounts: string;
  trend: string;
  interactiveChart: string;
  table: string;
  sendMoney: string;
  partnerOffers: string;
  aboutRate: string;
  amountIn: (amount: string, base: string, quote: string) => string;
  toOther: (base: string) => string;
  otherTo: (quote: string) => string;
  allRates: (code: string) => string;
  rateLink: (base: string, quote: string) => string;
  amountLink: (amount: string, base: string, quote: string) => string;
  footer: string;
  sampleNote: string;
  daysAgo: string;
  todayAxis: string;
  highLow: (hi: string, lo: string) => string;
  pairTitle: (base: string, quote: string, rate: string) => string;
  pairDesc: (base: string, quote: string, rate: string) => string;
  amountTitle: (amount: string, base: string, quote: string, result: string) => string;
  amountDesc: (amount: string, base: string, quote: string, result: string, rate: string) => string;
  h1Pair: (base: string, quote: string) => string;
  h1Amount: (amount: string, base: string, quote: string) => string;
  leadPair: (base: string, quote: string, rate: string, inverse: string) => string;
  leadAmount: (amount: string, base: string, quote: string, result: string, rate: string, inverse: string) => string;
  moveDay: (dir: "up" | "down" | "flat", pct: string) => string;
  moveMonth: (dir: "up" | "down" | "flat", pct: string, base: string, quote: string, then: string) => string;
  aboutBody: (base: string, quote: string) => string;
  hubTitle: (code: string) => string;
  hubDesc: (code: string, n: number) => string;
  hubToOthers: (code: string) => string;
  hubOthersTo: (code: string) => string;
  hubAbout: (code: string) => string;
  hubAboutBody: (code: string) => string;
  indexTitle: string;
  indexDesc: (n: number) => string;
  indexH1: string;
  indexSub: (n: number) => string;
  popularPairs: string;
  allCurrencies: string;
  allCurrenciesNote: string;
  colCurrency: string;
  colCode: string;
  colUsedIn: string;
  colRates: string;
  aboutRates: string;
  aboutRatesBody: (n: number, first: string, last: string) => string;
  usedIn: (country: string) => string;
};

const dir3 = (d: "up" | "down" | "flat", up: string, down: string, flat: string) => (d === "up" ? up : d === "down" ? down : flat);

const EN: Copy = {
  currencies: "Currencies",
  updated: "updated",
  today: "today",
  convert: "Convert",
  popularAmounts: "Popular Amounts",
  trend: "30-Day Trend",
  interactiveChart: "Interactive chart →",
  table: "Conversion Table",
  sendMoney: "Send Money Abroad",
  partnerOffers: "Partner offers",
  aboutRate: "About This Rate",
  amountIn: (a, b, q) => `${a} ${b} in ${q}`,
  toOther: (b) => `${b} to Other Currencies`,
  otherTo: (q) => `Other Currencies to ${q}`,
  allRates: (c) => `All ${c} rates →`,
  rateLink: (b, q) => `${b} to ${q} rate`,
  amountLink: (a, b, q) => `${a} ${b} to ${q}`,
  footer: "Rates are mid-market, may be delayed, and are provided for information only.",
  sampleNote: "Note: sample figures shown — the live rate for this pair is temporarily unavailable.",
  daysAgo: "30 days ago",
  todayAxis: "today",
  highLow: (hi, lo) => `high ${hi} · low ${lo}`,
  pairTitle: (b, q, r) => `${b} to ${q} Exchange Rate — 1 ${b} = ${r} ${q}`,
  pairDesc: (b, q, r) => `1 ${curName("en", b)} = ${r} ${curPlural("en", q)} right now. Live ${b}/${q} rate with converter, conversion table and 30-day trend.`,
  amountTitle: (a, b, q) => `${a} ${b} to ${q} — ${a} ${curPlural("en", b)} in ${curPlural("en", q)}`,
  amountDesc: (a, b, q, res, r) => `${a} ${curPlural("en", b)} = ${res} ${curPlural("en", q)} at today's rate (1 ${b} = ${r} ${q}). Live converter, conversion table and 30-day trend.`,
  h1Pair: (b, q) => `${curName("en", b)} → ${curName("en", q)}`,
  h1Amount: (a, b, q) => `${a} ${curPlural("en", b)} to ${curName("en", q)}`,
  leadPair: (b, q, r, inv) => `One ${curName("en", b)} currently buys ${r} ${curPlural("en", q)}; one ${curName("en", q)} is worth ${inv} ${curPlural("en", b)}.`,
  leadAmount: (a, b, q, res, r, inv) => `${a} ${curPlural("en", b)} converts to ${res} ${curPlural("en", q)} at the current mid-market rate of ${r} ${q} per ${b}. Going the other way, ${a} ${curPlural("en", q)} is worth ${inv} ${curPlural("en", b)}.`,
  moveDay: (d, p) => ` The rate is ${dir3(d, "up", "down", "flat")} ${p}% against the previous close.`,
  moveMonth: (d, p, b, q, then) => ` Over the past 30 days it is ${dir3(d, "up", "down", "unchanged")} ${p}%; 30 days ago 1 ${b} bought ${then} ${q}.`,
  aboutBody: (b, q) => `This page converts the ${curName("en", b)} (${b}), used in ${curCountry("en", b)}, into the ${curName("en", q)} (${q}), used in ${curCountry("en", q)}. The rate shown is the live mid-market rate — the midpoint between global buy and sell prices — refreshed continuously during FX trading hours. Banks and transfer services typically add a margin on top of this rate, so the amount you receive when exchanging money will usually be slightly less favorable.`,
  hubTitle: (c) => `${curName("en", c)} (${c}) Exchange Rates`,
  hubDesc: (c, n) => `Live ${curName("en", c)} exchange rates against ${n} currencies, with converters, conversion tables and 30-day trends.`,
  hubToOthers: (c) => `${c} to Other Currencies`,
  hubOthersTo: (c) => `Other Currencies to ${c}`,
  hubAbout: (c) => `About the ${curName("en", c)}`,
  hubAboutBody: (c) => `The ${curName("en", c)} (${c}, ${CURRENCIES[c].symbol}) is the currency of ${curCountry("en", c)}. Every page linked above shows the live mid-market rate — the midpoint between global buy and sell prices — along with a two-way converter, a conversion table for common amounts and a 30-day trend.`,
  indexTitle: "Currency Converter & Live Exchange Rates",
  indexDesc: (n) => `Live mid-market exchange rates for ${n} currencies — USD, EUR, JPY, GBP, KRW, CNY and more — with converters, conversion tables and 30-day trends.`,
  indexH1: "Currency Converter",
  indexSub: (n) => `${n} currencies · live mid-market rates`,
  popularPairs: "Popular Pairs",
  allCurrencies: "All Currencies",
  allCurrenciesNote: "Each page lists every pair for that currency",
  colCurrency: "Currency",
  colCode: "Code",
  colUsedIn: "Used in",
  colRates: "Rates",
  aboutRates: "About These Rates",
  aboutRatesBody: (n, first, last) => `Every rate on PNL404 is the live mid-market rate — the midpoint between the global buy and sell prices — and pages refresh continuously during FX trading hours. Each pair page includes a two-way converter, a 30-day trend and a conversion table for ${n} common amounts, and every amount from ${first} to ${last} has its own page. Banks and transfer services add a margin on top of the mid-market rate, so treat these figures as the benchmark to compare offers against.`,
  usedIn: (c) => `used in ${c}`,
};

const KO_COPY: Copy = {
  currencies: "환율",
  updated: "업데이트",
  today: "오늘",
  convert: "환율 계산기",
  popularAmounts: "자주 찾는 금액",
  trend: "30일 추이",
  interactiveChart: "상세 차트 →",
  table: "환산표",
  sendMoney: "해외 송금",
  partnerOffers: "제휴 안내",
  aboutRate: "이 환율에 대해",
  amountIn: (a, b, q) => `${a} ${curShort("ko", b)}는 ${curShort("ko", q)}로 얼마?`,
  toOther: (b) => `${curShort("ko", b)} → 다른 통화`,
  otherTo: (q) => `다른 통화 → ${curShort("ko", q)}`,
  allRates: (c) => `${curShort("ko", c)} 환율 전체 →`,
  rateLink: (b, q) => `${b}/${q} 환율`,
  amountLink: (a, b, q) => `${a} ${curShort("ko", b)} → ${curShort("ko", q)}`,
  footer: "환율은 시장 중간가(mid-market)이며 지연될 수 있고 정보 제공 목적으로만 제공됩니다.",
  sampleNote: "참고: 이 통화쌍의 실시간 환율을 일시적으로 가져올 수 없어 샘플 수치를 표시합니다.",
  daysAgo: "30일 전",
  todayAxis: "오늘",
  highLow: (hi, lo) => `최고 ${hi} · 최저 ${lo}`,
  pairTitle: (b, q, r) => `${curShort("ko", b)} ${curShort("ko", q)} 환율 (${b}/${q}) — 1 ${b} = ${r} ${q}`,
  pairDesc: (b, q, r) => `현재 1 ${curName("ko", b)} = ${r} ${curName("ko", q)}. 실시간 ${b}/${q} 환율, 환율 계산기, 금액별 환산표, 30일 추이를 한 페이지에서 확인하세요.`,
  amountTitle: (a, b, q, res) => `${a} ${curShort("ko", b)} ${curShort("ko", q)}로 — ${a} ${b} = ${res} ${q}`,
  amountDesc: (a, b, q, res, r) => `${a} ${curName("ko", b)}(${b})는 오늘 환율(1 ${b} = ${r} ${q}) 기준 ${res} ${curName("ko", q)}(${q})입니다. 실시간 환율 계산기, 환산표, 30일 추이.`,
  h1Pair: (b, q) => `${curName("ko", b)} → ${curName("ko", q)} 환율`,
  h1Amount: (a, b, q) => `${a} ${curName("ko", b)}를 ${curName("ko", q)}로`,
  leadPair: (b, q, r, inv) => `현재 1 ${eun(curName("ko", b))} ${r} ${curName("ko", q)}, 1 ${eun(curName("ko", q))} ${inv} ${curName("ko", b)}입니다.`,
  leadAmount: (a, b, q, res, r, inv) => `${a} ${eun(curName("ko", b))} 현재 시장 중간가(1 ${b} = ${r} ${q}) 기준 ${res} ${curName("ko", q)}입니다. 반대로 ${a} ${eun(curName("ko", q))} ${inv} ${curName("ko", b)}입니다.`,
  moveDay: (d, p) => ` 전일 종가 대비 ${p}% ${dir3(d, "상승", "하락", "보합")}했습니다.`,
  moveMonth: (d, p, b, q, then) => ` 최근 30일 동안 ${p}% ${dir3(d, "올랐으며", "내렸으며", "변동이 없으며")}, 30일 전에는 1 ${b}가 ${then} ${q}였습니다.`,
  aboutBody: (b, q) => `이 페이지는 ${curCountry("ko", b)}에서 쓰이는 ${curName("ko", b)}(${b})${eulP(curName("ko", b))} ${curCountry("ko", q)}에서 쓰이는 ${curName("ko", q)}(${q})${euroP(curName("ko", q))} 환산합니다. 표시되는 환율은 전 세계 매수·매도 호가의 중간값인 시장 중간가로, 외환 거래 시간 동안 계속 갱신됩니다. 은행과 송금 서비스는 여기에 수수료(스프레드)를 더하므로 실제 환전 시 받는 금액은 이보다 다소 적습니다.`,
  hubTitle: (c) => `${curName("ko", c)}(${c}) 환율`,
  hubDesc: (c, n) => `${curName("ko", c)}와 ${n}개 통화 간 실시간 환율, 환율 계산기, 환산표, 30일 추이.`,
  hubToOthers: (c) => `${curShort("ko", c)} → 다른 통화`,
  hubOthersTo: (c) => `다른 통화 → ${curShort("ko", c)}`,
  hubAbout: (c) => `${curName("ko", c)}에 대해`,
  hubAboutBody: (c) => `${eun(curName("ko", c))} ${curCountry("ko", c)}의 통화이며, 통화 코드는 ${c}, 기호는 ${CURRENCIES[c].symbol}입니다. 위 링크의 모든 페이지는 시장 중간가 기준 실시간 환율과 양방향 계산기, 금액별 환산표, 30일 추이를 제공합니다.`,
  indexTitle: "실시간 환율 계산기 — 달러·엔화·유로·위안 환율",
  indexDesc: (n) => `${n}개 통화의 실시간 시장 중간가 환율 — 달러, 유로, 엔화, 파운드, 위안 등 — 환율 계산기, 환산표, 30일 추이 제공.`,
  indexH1: "환율 계산기",
  indexSub: (n) => `${n}개 통화 · 실시간 시장 중간가`,
  popularPairs: "자주 찾는 환율",
  allCurrencies: "전체 통화",
  allCurrenciesNote: "각 통화 페이지에서 모든 통화쌍을 볼 수 있습니다",
  colCurrency: "통화",
  colCode: "코드",
  colUsedIn: "사용 국가",
  colRates: "환율",
  aboutRates: "환율 안내",
  aboutRatesBody: (n, first, last) => `PNL404의 모든 환율은 전 세계 매수·매도 호가의 중간값인 시장 중간가이며, 외환 거래 시간 동안 계속 갱신됩니다. 각 통화쌍 페이지에는 양방향 계산기, 30일 추이, ${n}개 금액의 환산표가 있고 ${first}부터 ${last}까지 금액별 페이지가 따로 있습니다. 은행과 송금 서비스는 여기에 수수료를 더하므로, 이 수치는 환전 조건을 비교하는 기준으로 활용하세요.`,
  usedIn: (c) => `${c}`,
};

const JA_COPY: Copy = {
  currencies: "為替レート",
  updated: "更新",
  today: "本日",
  convert: "為替計算",
  popularAmounts: "よく使われる金額",
  trend: "30日間の推移",
  interactiveChart: "詳細チャート →",
  table: "換算表",
  sendMoney: "海外送金",
  partnerOffers: "提携サービス",
  aboutRate: "このレートについて",
  amountIn: (a, b, q) => `${a}${curName("ja", b)}は${curName("ja", q)}でいくら？`,
  toOther: (b) => `${curName("ja", b)} → 他の通貨`,
  otherTo: (q) => `他の通貨 → ${curName("ja", q)}`,
  allRates: (c) => `${curName("ja", c)}のレート一覧 →`,
  rateLink: (b, q) => `${b}/${q} レート`,
  amountLink: (a, b, q) => `${a} ${curName("ja", b)} → ${curName("ja", q)}`,
  footer: "レートは仲値（ミッドマーケット）であり、遅延する場合があります。情報提供のみを目的としています。",
  sampleNote: "注: この通貨ペアのリアルタイムレートを一時的に取得できないため、サンプル値を表示しています。",
  daysAgo: "30日前",
  todayAxis: "本日",
  highLow: (hi, lo) => `高値 ${hi} · 安値 ${lo}`,
  pairTitle: (b, q, r) => `${curName("ja", b)}/${curName("ja", q)} 為替レート (${b}/${q}) — 1 ${b} = ${r} ${q}`,
  pairDesc: (b, q, r) => `現在 1 ${curName("ja", b)} = ${r} ${curName("ja", q)}。${b}/${q}のリアルタイム為替レート、為替計算機、金額別換算表、30日間の推移。`,
  amountTitle: (a, b, q, res) => `${a}${curName("ja", b)}は何${curName("ja", q)}？ — ${a} ${b} = ${res} ${q}`,
  amountDesc: (a, b, q, res, r) => `${a}${curName("ja", b)}(${b})は本日のレート（1 ${b} = ${r} ${q}）で${res}${curName("ja", q)}(${q})です。リアルタイム為替計算機、換算表、30日間の推移。`,
  h1Pair: (b, q) => `${curName("ja", b)} → ${curName("ja", q)} 為替レート`,
  h1Amount: (a, b, q) => `${a}${curName("ja", b)}を${curName("ja", q)}に換算`,
  leadPair: (b, q, r, inv) => `現在、1 ${curName("ja", b)}は${r} ${curName("ja", q)}、1 ${curName("ja", q)}は${inv} ${curName("ja", b)}です。`,
  leadAmount: (a, b, q, res, r, inv) => `${a}${curName("ja", b)}は現在の仲値（1 ${b} = ${r} ${q}）で${res}${curName("ja", q)}になります。逆に${a}${curName("ja", q)}は${inv}${curName("ja", b)}です。`,
  moveDay: (d, p) => ` 前日終値比で${p}%${dir3(d, "上昇", "下落", "横ばい")}しています。`,
  moveMonth: (d, p, b, q, then) => ` 過去30日間では${p}%${dir3(d, "上昇し", "下落し", "変わらず")}、30日前は1 ${b} = ${then} ${q}でした。`,
  aboutBody: (b, q) => `このページは${curCountry("ja", b)}で使われる${curName("ja", b)}(${b})を、${curCountry("ja", q)}で使われる${curName("ja", q)}(${q})に換算します。表示されるレートは世界の買値と売値の中間値である仲値で、外国為替市場の取引時間中は継続的に更新されます。銀行や送金サービスはこのレートに手数料（スプレッド）を上乗せするため、実際に受け取る金額はやや少なくなります。`,
  hubTitle: (c) => `${curName("ja", c)}(${c})の為替レート`,
  hubDesc: (c, n) => `${curName("ja", c)}と${n}通貨のリアルタイム為替レート、為替計算機、換算表、30日間の推移。`,
  hubToOthers: (c) => `${curName("ja", c)} → 他の通貨`,
  hubOthersTo: (c) => `他の通貨 → ${curName("ja", c)}`,
  hubAbout: (c) => `${curName("ja", c)}について`,
  hubAboutBody: (c) => `${curName("ja", c)}(${c}、${CURRENCIES[c].symbol})は${curCountry("ja", c)}の通貨です。上のリンク先の各ページでは、仲値ベースのリアルタイムレートに加え、双方向の計算機、金額別換算表、30日間の推移を確認できます。`,
  indexTitle: "リアルタイム為替計算機 — ドル・ウォン・ユーロ・元の為替レート",
  indexDesc: (n) => `${n}通貨のリアルタイム仲値レート — 米ドル、ユーロ、韓国ウォン、英ポンド、人民元など — 為替計算機、換算表、30日間の推移付き。`,
  indexH1: "為替計算機",
  indexSub: (n) => `${n}通貨 · リアルタイム仲値`,
  popularPairs: "よく見られる通貨ペア",
  allCurrencies: "すべての通貨",
  allCurrenciesNote: "各通貨ページですべての通貨ペアを一覧できます",
  colCurrency: "通貨",
  colCode: "コード",
  colUsedIn: "使用国・地域",
  colRates: "レート",
  aboutRates: "レートについて",
  aboutRatesBody: (n, first, last) => `PNL404のすべてのレートは世界の買値と売値の中間値である仲値で、外国為替市場の取引時間中は継続的に更新されます。各通貨ペアのページには双方向の計算機、30日間の推移、${n}種類の金額の換算表があり、${first}から${last}までの金額ごとに個別ページがあります。銀行や送金サービスは仲値に手数料を上乗せするため、この数値は両替条件を比較する基準としてご利用ください。`,
  usedIn: (c) => `${c}`,
};

export const COPY: Record<Lang, Copy> = { en: EN, ko: KO_COPY, ja: JA_COPY };

/** Number formatter for the locale. */
export function numFmt(lang: Lang): { rate: Fmt; amount: Fmt; input: Fmt } {
  const tag = LOCALE_TAG[lang];
  return {
    rate: (v) => {
      if (!isFinite(v)) return "—";
      const digits = Math.abs(v) >= 100 ? 2 : Math.abs(v) >= 1 ? 4 : 6;
      return v.toLocaleString(tag, { minimumFractionDigits: 2, maximumFractionDigits: digits });
    },
    amount: (v) => {
      if (!isFinite(v)) return "—";
      const digits = Math.abs(v) >= 1000 ? 2 : Math.abs(v) >= 1 ? 4 : 6;
      return v.toLocaleString(tag, { maximumFractionDigits: digits });
    },
    input: (v) => v.toLocaleString(tag, { maximumFractionDigits: 2 }),
  };
}

/** hreflang alternates for a convert path ("/convert/usd-to-krw"). */
export function languageAlternates(path: string): Record<string, string> {
  return {
    en: path,
    ko: `/ko${path}`,
    ja: `/ja${path}`,
    "x-default": path,
  };
}
