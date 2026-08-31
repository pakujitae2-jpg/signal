import type { Lang } from "./i18n";

// Copy for the crypto leg of /convert (components/convert/CryptoPairPage.tsx).
// Kept separate from lib/i18n.ts's fiat-only Copy type rather than bolted
// onto it, since the two rarely change together.

export type CryptoConvertCopy = {
  updated: string;
  methodHeading: string;
  methodUpbit: string;
  methodCross: string;
  kimchiNote: string;
  kimchiLinkText: string;
  sampleNote: string;
  unavailable: string;
  popularAmounts: string;
  table: string;
  colAmount: string;
  colValue: string;
  aboutHeading: string;
  aboutBody: string;
  otherFiatsHeading: string;
  otherCoinsHeading: string;
  quoteLinkText: string;
  tradeHeading: string;
  partnerOffers: string;
  footer: string;
};

const EN: CryptoConvertCopy = {
  updated: "Updated",
  methodHeading: "About This Rate",
  methodUpbit: "Upbit's real traded KRW market price.",
  methodCross: "Converted via the live USD price and the USD/{quote} exchange rate.",
  kimchiNote: "This computed rate can differ from what actually trades on a Korean exchange.",
  kimchiLinkText: "See the kimchi premium →",
  sampleNote: "Note: sample figures shown — the live rate for this pair is temporarily unavailable.",
  unavailable: "The live rate for this pair is temporarily unavailable.",
  popularAmounts: "Popular Amounts",
  table: "Conversion Table",
  colAmount: "Amount",
  colValue: "Value",
  aboutHeading: "About This Conversion",
  aboutBody: "Crypto prices move continuously; the figures on this page are a snapshot as of the time shown, not a live tick-by-tick feed.",
  otherFiatsHeading: "Convert to Other Currencies",
  otherCoinsHeading: "Convert Other Coins",
  quoteLinkText: "Live chart & price →",
  tradeHeading: "Trade Crypto",
  partnerOffers: "Partner offers",
  footer: "Rates are for information only, not investment advice.",
};

const KO: CryptoConvertCopy = {
  updated: "업데이트",
  methodHeading: "이 환율에 대해",
  methodUpbit: "업비트 원화 시장의 실제 거래가 기준입니다.",
  methodCross: "실시간 달러 시세와 달러/{quote} 환율을 곱해 계산한 값입니다.",
  kimchiNote: "이 계산값은 국내 거래소의 실제 거래가와 다를 수 있습니다.",
  kimchiLinkText: "김치프리미엄 확인하기 →",
  sampleNote: "참고: 이 통화쌍의 실시간 시세를 일시적으로 가져올 수 없어 샘플 수치를 표시합니다.",
  unavailable: "이 통화쌍의 실시간 시세를 지금 가져올 수 없습니다.",
  popularAmounts: "자주 찾는 금액",
  table: "환산표",
  colAmount: "금액",
  colValue: "환산 금액",
  aboutHeading: "이 환산에 대해",
  aboutBody: "암호화폐 시세는 실시간으로 계속 움직입니다. 이 페이지의 수치는 표시된 시각 기준 스냅샷이며, 틱 단위로 갱신되는 실시간 시세가 아닙니다.",
  otherFiatsHeading: "다른 통화로 환산",
  otherCoinsHeading: "다른 코인 환산",
  quoteLinkText: "실시간 차트·시세 보기 →",
  tradeHeading: "코인 거래하기",
  partnerOffers: "제휴 혜택",
  footer: "표시된 환율은 정보 제공 목적으로만 제공되며, 투자 자문이 아닙니다.",
};

const JA: CryptoConvertCopy = {
  updated: "更新",
  methodHeading: "このレートについて",
  methodUpbit: "Upbitのウォン建て市場における実際の取引価格です。",
  methodCross: "リアルタイムの米ドル価格と米ドル/{quote}為替レートを掛けて算出した値です。",
  kimchiNote: "この換算値は韓国国内取引所の実際の取引価格と異なる場合があります。",
  kimchiLinkText: "キムチプレミアムを見る →",
  sampleNote: "注: この通貨ペアのリアルタイムレートを一時的に取得できないため、サンプル値を表示しています。",
  unavailable: "この通貨ペアのリアルタイムレートを現在取得できません。",
  popularAmounts: "よく使われる金額",
  table: "換算表",
  colAmount: "金額",
  colValue: "換算後の金額",
  aboutHeading: "この換算について",
  aboutBody: "暗号資産の価格は常に変動しています。このページの数値は表示時点のスナップショットであり、ティック単位で更新されるリアルタイム価格ではありません。",
  otherFiatsHeading: "他の通貨に換算",
  otherCoinsHeading: "他のコインを換算",
  quoteLinkText: "リアルタイムチャート・価格を見る →",
  tradeHeading: "暗号資産を取引する",
  partnerOffers: "提携先のサービス",
  footer: "表示されているレートは情報提供のみを目的としており、投資助言ではありません。",
};

export const CRYPTO_CONVERT_COPY: Record<Lang, CryptoConvertCopy> = { en: EN, ko: KO, ja: JA };
export const cryptoConvertCopy = (lang: Lang): CryptoConvertCopy => CRYPTO_CONVERT_COPY[lang];
