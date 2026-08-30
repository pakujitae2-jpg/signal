// 어필리에이트(제휴) 파트너 설정.
// url에 본인의 레퍼럴 링크를 넣으면 홈페이지 파트너 섹션에 노출된다.
// 규정상 제휴 링크임을 표시해야 하므로 disclosure 문구가 함께 렌더링된다.

export type Affiliate = {
  name: string;
  desc: string;
  url: string;
  badge: string;
};

export const AFFILIATES: Affiliate[] = [
  {
    name: "바이낸스",
    desc: "세계 최대 암호화폐 거래소 · 수수료 할인 가입",
    url: "https://example.com/your-binance-referral",
    badge: "암호화폐",
  },
  {
    name: "업비트",
    desc: "국내 1위 원화 마켓 거래소",
    url: "https://example.com/your-upbit-referral",
    badge: "암호화폐",
  },
  {
    name: "해외주식 증권사",
    desc: "미국·일본 주식 수수료 우대 계좌 개설",
    url: "https://example.com/your-broker-referral",
    badge: "주식",
  },
  {
    name: "트레이딩뷰",
    desc: "글로벌 차트 분석 플랫폼 할인",
    url: "https://example.com/your-tradingview-referral",
    badge: "차트",
  },
];

export const AFFILIATE_DISCLOSURE =
  "위 링크는 제휴(어필리에이트) 링크이며, 가입 시 사이트 운영에 도움이 되는 수수료를 받을 수 있습니다.";
