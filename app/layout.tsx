import "./globals.css";
import Script from "next/script";

// Root layout은 host 의존성 없음 — html/body wrapper만 출력.
// 사이트별 테마/메타/푸터는 app/__internal/[site]/layout.tsx에서 처리.
// 이 분리가 ISR을 가능하게 한다 (root에서 headers() 호출 시 모든 하위 page가 dynamic 강제됨).

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* GA4 — 루미브리즈 계정 > GEO 위성 속성.
            ⚠️ 이 프로젝트는 geo-networks.com 과 geo-medilife.vercel.app 을 같은 코드로 서빙한다.
            호스트별로 다른 측정 ID를 주려면 headers() 가 필요한데, 그러면 위 주석대로 ISR이 깨진다.
            → 스트림 1개로 통합하고 도메인 구분은 GA4 '호스트 이름' 차원으로 본다. */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-HR2DYXSHX1" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HR2DYXSHX1');
        `}</Script>
        {children}
      </body>
    </html>
  );
}
