# geo-network

GEO 배포 네트워크 — `*.geo-networks.com` 와일드카드 30개 사이트(의료 15 + 비즈 10 + 치과 5)를 단일 Next.js 16 코드베이스로 운영.

## 아키텍처
- **단일 Vercel 프로젝트**로 30개 서브도메인 동시 서빙. 와일드카드 DNS + host 헤더 분기.
- `lib/sites.ts`의 `getSiteByHost(host)` → subdomain → `NETWORK_SITES` 매핑 → `network_posts.site_id`로 콘텐츠 필터.
- 콘텐츠는 lumiaeo 본체에서 Gemini로 사이트별 톤 리라이팅 후 `/api/publish`(NETWORK_API_KEY 인증)로 푸시.

## 배포
- main 브랜치 push → Vercel 자동 배포 (Production)
- 수동 배포: `npx vercel --prod`

## 환경변수 (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NETWORK_API_KEY` — 발행 API 인증
- `SITE_ID` (선택, 레거시 .vercel.app 단일사이트 폴백용)

## 봇 방문 로깅
Proxy(`proxy.ts`)가 AI 크롤러 21종 감지 → `waitUntil()`로 `network_crawler_visits` 테이블에 비동기 기록. 글 페이지(`/<slug>`)는 `network_posts` 조회로 brand_id 자동 매핑. 고객 대시보드는 lumiaeo `/dashboard/network-crawlers`에서 자기 brand_id 매칭 row만 조회.

## 동기화 필수
`lib/sites.ts`의 30 사이트 정의는 lumiaeo `lib/distribution/publishers/network-sites-config.ts`와 항상 동기화. 새 사이트 추가 시 양쪽 모두 갱신 + Vercel 도메인 등록 + GSC/Naver/Bing 인증.
