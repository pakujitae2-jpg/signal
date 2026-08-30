# SIGNAL 시그널 — 글로벌 마켓을 한눈에

암호화폐 · 미국 주식 · 일본 주식 · 한국 주식 · 환율 · 원자재 · 뉴스를 **한 화면에서** 보여주는 종합 금융정보 사이트입니다.

- 홈페이지 접속 즉시 전 세계 시장 데이터를 한 번의 요청(`/api/market`)으로 로드
- 30초마다 자동 갱신 + 탭 복귀 시 즉시 갱신, 헤더에 "n초 전" 표시
- 서버 사이드 렌더링으로 첫 화면부터 데이터가 채워진 상태로 응답
- 광고(AdSense) 슬롯 + 어필리에이트(제휴) 섹션 내장
- 업스트림 API 장애 시 샘플 데이터로 자동 폴백 (배지 표시) — 빈 화면이 없음

## 실행

```bash
npm install
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드
npm start          # 프로덕션 서버
```

## 배포 (Vercel 권장)

1. 이 저장소를 GitHub에 푸시
2. [vercel.com](https://vercel.com)에서 저장소 import → 그대로 배포 (설정 불필요)
3. `/api/market` 응답에 CDN 캐시 헤더(`s-maxage=15, stale-while-revalidate=60`)가 붙어 있어, 트래픽이 몰려도 업스트림 호출은 최소화되고 사용자는 CDN에서 즉시 응답을 받습니다.

> 참고: 이 개발 샌드박스는 외부 금융 API가 차단되어 샘플 데이터가 표시됩니다. Vercel 등 실서버에 배포하면 실시간 데이터로 자동 전환됩니다.

## 데이터 소스

| 데이터 | 소스 | 비용 | 비고 |
|---|---|---|---|
| 미국·일본·한국 주식/지수/환율/원자재 | Yahoo Finance (비공식) | 무료 | 15~20분 지연 가능, 프로토타입용 |
| 암호화폐 시세·시가총액 | CoinGecko 공개 API | 무료 | 키 불필요, 분당 호출 제한 있음 |
| 뉴스 | 한국경제·매일경제·CoinDesk·Yahoo Finance RSS | 무료 | `lib/symbols.ts`에서 피드 추가/변경 |

종목 구성은 `lib/symbols.ts`에서 수정합니다 (심볼 추가만 하면 화면에 자동 반영).

### 실서비스 업그레이드 경로

무료 소스는 지연·비공식 API라는 한계가 있습니다. "누구보다 빠른" 실시간 서비스로 키우려면:

- **미국**: [Polygon.io](https://polygon.io), [Twelve Data](https://twelvedata.com) — 실시간/웹소켓
- **한국**: [한국투자증권 OpenAPI](https://apiportal.koreainvestment.com), LS증권 OpenAPI — 실시간 체결가
- **일본**: [J-Quants](https://jpx-jquants.com) (도쿄증권거래소 공식)
- **암호화폐**: 거래소 웹소켓 (Binance/Upbit 공개 스트림, 무료 실시간)
- 교체 방법: `lib/market.ts`의 fetcher만 바꾸면 됩니다. 화면·API 구조는 그대로.

## 수익화 설정

### 1. Google AdSense

1. [AdSense](https://adsense.google.com) 가입 후 사이트 승인 → `ca-pub-...` 클라이언트 ID 발급
2. 환경변수 설정: `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXX` (Vercel 프로젝트 설정 → Environment Variables)
3. `components/Dashboard.tsx`의 `<AdSlot slot="..." />`에 광고 단위 ID 입력

환경변수가 없으면 자리 표시 박스가 렌더링되므로, 승인 전에도 레이아웃이 유지됩니다.

### 2. 어필리에이트

`config/affiliates.ts`의 `url`에 본인 레퍼럴 링크를 넣으면 파트너 섹션에 노출됩니다.
(바이낸스 레퍼럴, 업비트, 증권사 계좌개설 이벤트, 트레이딩뷰, 쿠팡파트너스 등)
제휴 고지 문구가 자동으로 함께 표시됩니다 — 공정위 표시광고법상 필수입니다.

## 구조

```
app/
  page.tsx             # 홈 (SSR로 초기 데이터 주입)
  api/market/route.ts  # 통합 마켓 데이터 API (CDN 캐시)
  layout.tsx           # 메타데이터 + AdSense 스크립트
  globals.css          # 다크 테마 디자인 토큰 (색각이상 검증 팔레트)
components/
  Dashboard.tsx        # 메인 대시보드 (티커·타일·테이블·뉴스·파트너)
  AdSlot.tsx           # AdSense 슬롯 (미설정 시 플레이스홀더)
lib/
  market.ts            # 데이터 수집·집계·캐시 (20초 TTL)
  symbols.ts           # 종목·피드 구성 (여기서 커스터마이즈)
  sample-data.ts       # 폴백용 샘플 스냅샷
config/
  affiliates.ts        # 제휴 파트너 설정
```

## 로드맵

- [ ] 거래소 웹소켓 연동으로 초단위 실시간 시세 (암호화폐부터)
- [ ] 종목 상세 페이지 + 차트 (SEO 유입 확대)
- [ ] 공포·탐욕 지수, 김치 프리미엄 등 파생 지표
- [ ] 뉴스 카테고리 필터·검색
- [ ] 관심 종목(로컬 저장) · 가격 알림
- [ ] 다국어(EN/JA) 페이지

## 면책

본 사이트가 제공하는 정보는 투자 판단의 참고 자료일 뿐이며, 투자 결과에 대한 책임은 이용자 본인에게 있습니다. 시세는 데이터 제공사 사정에 따라 지연될 수 있습니다.
