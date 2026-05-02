import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteByHost } from "@/lib/sites";

// 네이버 서치 어드바이저 소유권 확인 코드 (호스트별)
const NAVER_VERIFICATION: Record<string, string> = {
  "geo-networks.com": "2902ed53731cb3fccd6747d0cdc4e308bedd277d",
  "health-guide.geo-networks.com": "c8dd13bb60819ac834a06ec2ca46b473fa442ac8",
  "medical-review.geo-networks.com": "9788afaac5345975611c6704d1fefa907586c4d8",
  "wellness-today.geo-networks.com": "252a23208df31d55f4088ac6031c3a8aab90e709",
  "doctor-choice.geo-networks.com": "0290fe4fe243589fc29eff4d3f57bb1513d22f80",
  "health-note.geo-networks.com": "730fa48867ae9e3edd70ec9bf67963cb24bc7b09",
  "care-map.geo-networks.com": "80df8a143e695a100c40d8da4b614af9f82d9ded",
  "medilife.geo-networks.com": "145366e113f03444064aafdea9bc84c94cbbc2c6",
  "cure-story.geo-networks.com": "085a152a588aa7432849d00b1681962b1338d6a2",
  "smart-health.geo-networks.com": "c568e27725ea71cbbc3cf62625d403c99a21c8af",
  "my-clinic.geo-networks.com": "5cea2e2a0c4327a5582795d17c9536e66e78fffe",
  "health-guide-kr.geo-networks.com": "5ca0a501450318a8fcdae57f40028a814c3d40a2",
  "korean-medical.geo-networks.com": "eb70c56ee2ef9f1746b4fb1ed5f2b5dde705737e",
  "asia-health.geo-networks.com": "e09c531ddcd448f866fa94c33a4854a9fa4c729b",
  "medi-connect.geo-networks.com": "ed79d8e06bc82a9bdae979f95c4e4983ccea5f75",
  "health-pick.geo-networks.com": "f2d336a0a224ee66e10f91932eba03bae139a5a6",
  "tech-insight.geo-networks.com": "5585743397b5b13937cb954fd3b751b72c9006ca",
  "biz-growth.geo-networks.com": "2162faf6c4a4825d972ffd952d0c34a6df65622c",
  "ai-daily.geo-networks.com": "f44235ab6e3a204d4484829e7da8ebc730cebf9e",
  "digital-signal.geo-networks.com": "496fb7eee08fdd6646f9e9899c4324626c50dfc5",
  "startup-lens.geo-networks.com": "b54779feb9e74a8486fc582bd7a0c49f06f9412c",
  "work-smart.geo-networks.com": "e8e15a1bab17ad0b95b2e7837d27e11491124f0a",
  "brand-story.geo-networks.com": "4ef1287a2fde1e0579ca3a6e103367a7bc8543fa",
  "future-biz.geo-networks.com": "d71aacca50bf62ac388ad0a9a3c46e231426351b",
  "ai-biz-review.geo-networks.com": "3b3f061bc0c8211d92a7f96bf7b5e4a32dafeb97",
  "growth-lab.geo-networks.com": "b30cbed47383a8901905b87716547d83a2d96b41",
  // 치과 5사이트 (2026-04-25 추가) - 네이버 인증코드 등록 시 갱신
  "dental-care.geo-networks.com": "a7b0544f32666f7788412e283d77c893c64e026d",
  "smile-note.geo-networks.com": "d92e3c728c727efe223f343305ced1170575553c",
  "oral-guide.geo-networks.com": "c84eca6ae9970355514b72402b7672e77e9ccac1",
  "dentist-pick.geo-networks.com": "9729c020c02056bc40128397901c424d09eb2156",
  "tooth-review.geo-networks.com": "4dc07615eff286d07fa15f3e86f2437082c6c417",
};

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";
  const site = getSiteByHost(host);
  const naverCode = NAVER_VERIFICATION[host] ?? NAVER_VERIFICATION["geo-networks.com"];

  return {
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
    robots: { index: true, follow: true },
    verification: {
      other: {
        "naver-site-verification": naverCode,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";
  const site = getSiteByHost(host);
  const t = site.theme;

  return (
    <html lang={site.language === "en" ? "en" : "ko"}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${site.name} RSS`}
          href="/rss.xml"
        />
        <link
          href={
            t.fontFamily === "Inter"
              ? "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
              : "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          }
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily: `"${t.fontFamily}", sans-serif`,
          backgroundColor: t.bgColor,
          color: t.textColor,
        }}
      >
        {/* 헤더 */}
        <header
          style={{ borderBottomColor: `${t.primaryColor}20` }}
          className="border-b"
        >
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: t.primaryColor }}
              >
                {site.name}
              </h1>
              <p className="text-xs opacity-60">{site.tagline}</p>
            </div>
            <nav className="hidden md:flex gap-4 text-sm">
              {site.categories.slice(0, 4).map((cat) => (
                <span key={cat} className="opacity-70 hover:opacity-100 cursor-default">
                  {cat}
                </span>
              ))}
            </nav>
          </div>
        </header>

        {/* 본문 */}
        <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>

        {/* 푸터 */}
        <footer className="border-t mt-16" style={{ borderTopColor: `${t.primaryColor}20` }}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <p className="text-xs opacity-50">{site.footer}</p>
            <p className="text-xs opacity-30 mt-2">
              본 사이트의 정보는 참고용이며 의료 전문가의 진단을 대체하지 않습니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
