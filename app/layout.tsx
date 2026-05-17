import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
