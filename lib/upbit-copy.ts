import type { Lang } from "./i18n";

export type UpbitCopy = {
  dirTitle: string;
  dirDescription: string;
  dirH1: string;
  /** {n} */ dirSub: string;
  colName: string;
  colPrice: string;
  colChange: string;
  colVolume: string;
  flaggedBadge: string;
  dirUnavailable: string;

  cautionTitle: string;
  cautionDescription: string;
  cautionH1: string;
  /** {n} */ cautionSub: string;
  colFlags: string;
  flagWarning: string;
  flagPriceFluctuations: string;
  flagVolumeSoaring: string;
  flagDepositSoaring: string;
  flagGlobalDiff: string;
  flagConcentration: string;
  noneFlagged: string;
  aboutHeading: string;
  aboutP: string;
  cautionUnavailable: string;

  dirLink: string;
  cautionLink: string;
  kimchiLink: string;
  footer: string;
};

const EN: UpbitCopy = {
  dirTitle: "Upbit KRW Market Directory — Every Coin, Live Prices",
  dirDescription: "All 288 KRW markets on Upbit, Korea's largest crypto exchange, with Korean names, live prices and 24-hour change.",
  dirH1: "Upbit KRW Markets",
  dirSub: "{n} KRW markets, sorted by 24-hour trading value",
  colName: "Name",
  colPrice: "Price (KRW)",
  colChange: "24h change",
  colVolume: "24h volume",
  flaggedBadge: "Flagged",
  dirUnavailable: "Live Upbit data is not available right now.",

  cautionTitle: "Upbit Caution & Warning Coins — 유의종목",
  cautionDescription: "Every coin currently carrying an Upbit investment warning or caution flag, with each flag explained.",
  cautionH1: "Upbit Caution & Warning Coins",
  cautionSub: "{n} coins currently flagged",
  colFlags: "Flags",
  flagWarning: "Investment warning (highest level)",
  flagPriceFluctuations: "Sharp price fluctuation",
  flagVolumeSoaring: "Trading volume spike",
  flagDepositSoaring: "Deposit amount spike",
  flagGlobalDiff: "Large gap vs. global exchanges",
  flagConcentration: "Holdings concentrated in a few accounts",
  noneFlagged: "No coins are currently flagged.",
  aboutHeading: "About These Flags",
  aboutP: "Upbit sets these flags itself as a standing investor-caution mechanism, not PNL404. A caution flag doesn't mean a coin is fraudulent — it flags a specific pattern (a price spike, a volume surge, a large premium over global prices, and so on) worth knowing about before trading. An investment warning is the more serious of the two and can come with trading restrictions on Upbit.",
  cautionUnavailable: "Live Upbit data is not available right now, so this list can't be shown.",

  dirLink: "Upbit KRW market directory",
  cautionLink: "Upbit caution & warning coins",
  kimchiLink: "Kimchi premium",
  footer: "Data comes from Upbit's public API and may be delayed. Provided for information only, not investment advice.",
};

const KO: UpbitCopy = {
  dirTitle: "업비트 원화마켓 전체 종목 — 실시간 시세",
  dirDescription: "국내 최대 거래소 업비트의 원화마켓 288개 전 종목을 한글명, 실시간 시세, 24시간 등락률과 함께 확인하세요.",
  dirH1: "업비트 원화마켓 전 종목",
  dirSub: "원화마켓 {n}개 · 24시간 거래대금 순",
  colName: "종목명",
  colPrice: "현재가(원)",
  colChange: "24시간 등락률",
  colVolume: "24시간 거래대금",
  flaggedBadge: "유의",
  dirUnavailable: "현재 업비트 실시간 시세를 불러올 수 없습니다.",

  cautionTitle: "업비트 유의종목·투자유의 코인 목록",
  cautionDescription: "현재 업비트에서 투자유의 또는 유의 지정을 받은 전체 코인 목록입니다. 각 지정 사유를 함께 설명합니다.",
  cautionH1: "업비트 유의종목·투자유의 코인",
  cautionSub: "현재 {n}개 코인이 지정 중",
  colFlags: "지정 사유",
  flagWarning: "투자유의 종목 (가장 높은 단계)",
  flagPriceFluctuations: "가격 급등락",
  flagVolumeSoaring: "거래량 급등",
  flagDepositSoaring: "입금량 급등",
  flagGlobalDiff: "글로벌 시세와 큰 가격 차이",
  flagConcentration: "소수 계정에 보유 물량 집중",
  noneFlagged: "현재 유의 지정된 코인이 없습니다.",
  aboutHeading: "유의 지정 안내",
  aboutP: "이 지정은 PNL404가 아니라 업비트가 투자자 보호를 위해 자체적으로 부여하는 표시입니다. 유의 지정을 받았다고 해서 해당 코인이 사기라는 뜻은 아니며, 가격 급등락·거래량 급증·글로벌 시세와의 큰 차이 등 거래 전에 알아둘 만한 특정 패턴이 있다는 신호입니다. 투자유의 지정은 두 단계 중 더 심각한 수준으로, 업비트 내 거래 제한이 함께 적용될 수 있습니다.",
  cautionUnavailable: "현재 업비트 실시간 데이터를 불러올 수 없어 목록을 표시할 수 없습니다.",

  dirLink: "업비트 원화마켓 전 종목",
  cautionLink: "업비트 유의종목·투자유의 코인",
  kimchiLink: "김치프리미엄",
  footer: "데이터는 업비트 공개 API 기준이며 지연될 수 있습니다. 정보 제공 목적으로만 제공되며 투자 권유가 아닙니다.",
};

const JA: UpbitCopy = {
  dirTitle: "Upbitウォンマーケット全銘柄｜リアルタイム価格",
  dirDescription: "韓国最大手取引所Upbitのウォンマーケット288銘柄すべてを、韓国語名・リアルタイム価格・24時間騰落率とともに確認できます。",
  dirH1: "Upbitウォンマーケット全銘柄",
  dirSub: "ウォンマーケット{n}銘柄 · 24時間取引代金順",
  colName: "銘柄名",
  colPrice: "現在値(ウォン)",
  colChange: "24時間騰落率",
  colVolume: "24時間取引代金",
  flaggedBadge: "注意",
  dirUnavailable: "現在Upbitのリアルタイム価格を取得できません。",

  cautionTitle: "Upbit投資有意種目・注意銘柄一覧",
  cautionDescription: "現在Upbitで投資有意種目または注意銘柄に指定されている全銘柄の一覧です。指定理由もあわせて説明します。",
  cautionH1: "Upbit投資有意種目・注意銘柄",
  cautionSub: "現在{n}銘柄が指定中",
  colFlags: "指定理由",
  flagWarning: "投資有意種目(最も高い水準)",
  flagPriceFluctuations: "価格の急変動",
  flagVolumeSoaring: "取引量の急増",
  flagDepositSoaring: "入金量の急増",
  flagGlobalDiff: "海外取引所との価格差が大きい",
  flagConcentration: "少数アカウントへの保有集中",
  noneFlagged: "現在、注意銘柄に指定されているものはありません。",
  aboutHeading: "この指定について",
  aboutP: "この指定はPNL404ではなくUpbitが投資家保護のために独自に付与しているものです。注意銘柄に指定されたからといって、その銘柄が詐欺であることを意味するわけではなく、価格の急変動や取引量の急増、海外取引所との大きな価格差など、取引前に知っておくべき特定のパターンがあることを示すサインです。投資有意種目は2段階のうちより深刻な水準で、Upbit内での取引制限を伴う場合があります。",
  cautionUnavailable: "現在Upbitのリアルタイムデータを取得できないため、一覧を表示できません。",

  dirLink: "Upbitウォンマーケット全銘柄",
  cautionLink: "Upbit投資有意種目・注意銘柄",
  kimchiLink: "キムチプレミアム",
  footer: "データはUpbitの公開APIに基づき、遅延する場合があります。情報提供のみを目的としており、投資助言ではありません。",
};

export const UPBIT_COPY: Record<Lang, UpbitCopy> = { en: EN, ko: KO, ja: JA };
export const upbitCopy = (lang: Lang): UpbitCopy => UPBIT_COPY[lang];
