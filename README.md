# PNL404 — Profit Not Found

> **PnL** (Profit & Loss) + **404 Not Found** = `pnl404.com`. 개발자가 장난으로 만든 블룸버그 컨셉 — 데이터는 진지하게, 목소리는 밈으로.

**해외(영어권) 이용자 타깃**의 종합 금융정보 사이트입니다. 미국·일본·한국 주식, 암호화폐, 환율, 원자재, 뉴스 헤드라인을 신문 스타일의 한 페이지에서 보여줍니다.

- 접속 즉시 전 세계 시장 데이터를 한 번의 요청(`/api/market`)으로 로드
- 30초마다 자동 갱신 + 탭 복귀 시 즉시 갱신, 상단에 "Updated … · ns ago" 표시
- 서버 사이드 렌더링으로 첫 화면부터 데이터가 채워진 상태로 응답
- 국제 관례 색상(초록=상승, 빨강=하락) — 색각이상 대비 검증 통과
- 광고(AdSense) 슬롯 + 어필리에이트/레퍼럴 "Where to Trade" 모듈 내장
- 업스트림 API 장애 시 샘플 데이터로 자동 폴백 (안내 문구 표시) — 빈 화면 없음

## 실행

```bash
npm install
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드
npm start          # 프로덕션 서버
```

## 배포 (Cloudflare Workers — 기본)

[@opennextjs/cloudflare](https://opennext.js.org/cloudflare) 어댑터가 설정되어 있습니다 (`wrangler.jsonc`, `open-next.config.ts`).

**Git 연동 (권장 — 푸시할 때마다 자동 배포):**
1. Cloudflare 대시보드 → **Workers & Pages** → **Create** → **Workers** 탭 → **Import a repository**
2. GitHub 연결 후 이 저장소(`signal`) 선택
3. 빌드/배포 명령은 기본값(`npm run build` + `npx wrangler deploy`) 그대로 두면 됩니다 — `npm run build`가 OpenNext 번들(`.open-next/worker.js`)까지 생성하고, wrangler가 `wrangler.jsonc`를 자동 인식합니다. Node 버전은 `.node-version`(22.16.0)을 따릅니다 (wrangler는 Node 22 이상 필요)
4. 배포되면 `signal.<계정>.workers.dev` 주소가 생기고, Worker → Settings → **Domains & Routes**에서 커스텀 도메인을 연결합니다 (도메인 DNS가 Cloudflare에 있으면 원클릭)
5. 빌드 환경변수에 `NEXT_PUBLIC_SITE_URL=https://도메인` 추가 (캐노니컬·사이트맵 기준 주소)

**CLI 배포:** `npx wrangler login` 후 `npm run deploy`. 로컬에서 Workers 런타임으로 미리보기는 `npm run preview`.

> 참고: 이 개발 샌드박스는 외부 금융 API가 차단되어 샘플 데이터가 표시됩니다. 실서버에 배포하면 실시간 데이터로 자동 전환됩니다.

### 대안: Vercel

저장소를 [vercel.com/new](https://vercel.com/new)에서 import하면 설정 없이 그대로 배포됩니다. (Cloudflare 설정 파일은 Vercel에서 무시되므로 공존 가능)

## 데이터 소스

| 데이터 | 소스 | 비용 | 비고 |
|---|---|---|---|
| 미국·일본·한국 주식/지수/환율/원자재 | Yahoo Finance (비공식) | 무료 | 15~20분 지연 가능, 프로토타입용 |
| 암호화폐 시세·시가총액 | CoinGecko 공개 API | 무료 | 키 불필요, 분당 호출 제한 있음 |
| 뉴스 | CoinDesk · Yahoo Finance · MarketWatch · CNBC · Nikkei Asia RSS | 무료 | `lib/symbols.ts`에서 피드 추가/변경 |

종목 구성은 `lib/symbols.ts`에서 수정합니다 (심볼 추가만 하면 화면에 자동 반영).

### 실서비스 업그레이드 경로

무료 소스는 지연·비공식 API라는 한계가 있습니다. 진짜 실시간으로 키우려면:

- **미국**: [Polygon.io](https://polygon.io), [Twelve Data](https://twelvedata.com) — 실시간/웹소켓
- **한국**: [한국투자증권 OpenAPI](https://apiportal.koreainvestment.com) — 실시간 체결가
- **일본**: [J-Quants](https://jpx-jquants.com) (도쿄증권거래소 공식)
- **암호화폐**: 거래소 웹소켓 (Binance/Coinbase 공개 스트림, 무료 실시간)
- 교체 방법: `lib/market.ts`의 fetcher만 바꾸면 됩니다. 화면·API 구조는 그대로.

## 수익화 설정

### 1. Google AdSense (디스플레이 광고)

1. [AdSense](https://adsense.google.com) 가입 후 사이트 승인 → `ca-pub-...` 클라이언트 ID 발급
2. Cloudflare Worker 빌드 변수(또는 Vercel 환경변수)에 `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXX` 추가 후 재배포
3. `components/Dashboard.tsx`의 `<AdSlot slot="..." />` 두 곳에 광고 단위 ID 입력

환경변수가 없으면 "Advertisement" 라벨의 예약 공간이 유지되므로 승인 전에도 레이아웃이 흔들리지 않습니다.

### 2. 어필리에이트 / 레퍼럴 ("Where to Trade" 모듈)

`config/affiliates.ts`의 각 `url`에 링크를 넣으면 우측 레일에 카테고리별(거래소/증권사/툴)로 노출됩니다.

- **레퍼럴 프로그램** (가입만 하면 발급): Binance Referral, Kraken, Interactive Brokers Refer-a-Friend 등
- **어필리에이트 네트워크** (심사 후 트래킹 링크 발급): Coinbase Affiliate([Impact](https://impact.com)), eToro Partners, TradingView Affiliate, Ledger Affiliate([CJ](https://cj.com)/Awin) 등
- 파트너 추가는 배열에 항목만 추가하면 됩니다. FTC 요건에 맞춘 제휴 고지 문구가 모듈 하단에 자동 표시됩니다.

## 구조

```
app/
  page.tsx             # 홈 (SSR로 초기 데이터 주입)
  api/market/route.ts  # 통합 마켓 데이터 API (CDN 캐시)
  layout.tsx           # 메타데이터 + AdSense 스크립트
  globals.css          # 에디토리얼(신문 스타일) 디자인 토큰
components/
  Dashboard.tsx        # 프런트 페이지 (마스트헤드·티커·보드·테이블·뉴스·파트너)
  AdSlot.tsx           # AdSense 슬롯 (미설정 시 예약 공간)
lib/
  market.ts            # 데이터 수집·집계·캐시 (20초 TTL)
  symbols.ts           # 종목·피드 구성 (여기서 커스터마이즈)
  sample-data.ts       # 폴백용 샘플 스냅샷
config/
  affiliates.ts        # 어필리에이트/레퍼럴 파트너 설정
```

## 로드맵

- [ ] 거래소 웹소켓 연동으로 초단위 실시간 시세 (암호화폐부터)
- [ ] 종목 상세 페이지 + 차트 (SEO 유입 확대)
- [ ] Fear & Greed 지수 등 파생 지표
- [ ] 뉴스 카테고리 필터·검색
- [ ] 관심 종목(로컬 저장) · 가격 알림
- [ ] 다크 모드

## Disclaimer

Market data may be delayed and is provided for information only, not investment advice.
