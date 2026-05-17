import type { NextConfig } from "next";

const POST_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";
const FEED_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    // 글 페이지(/[slug])와 루트(/)는 server component에서 headers()를 호출해
    // Next.js가 dynamic으로 강제 렌더링 → 기본 Cache-Control이 `private, no-store`로 떨어진다.
    // Googlebot 등 정상 캐시 효율을 위해 path별로 ISR-friendly 헤더를 강제 적용한다.
    return [
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: POST_CACHE }],
      },
      {
        source: "/feed.xml",
        headers: [{ key: "Cache-Control", value: FEED_CACHE }],
      },
      {
        source: "/rss.xml",
        headers: [{ key: "Cache-Control", value: FEED_CACHE }],
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: FEED_CACHE }],
      },
      {
        source: "/llms.txt",
        headers: [{ key: "Cache-Control", value: FEED_CACHE }],
      },
      // /[slug] — 글 페이지. /_next, /api, /robots.txt 등은 매칭 안 됨.
      {
        source: "/:slug([a-z0-9][a-z0-9-]*)",
        headers: [{ key: "Cache-Control", value: POST_CACHE }],
      },
    ];
  },
};

export default nextConfig;
