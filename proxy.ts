import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { waitUntil } from "@vercel/functions";
import { ROOT_DOMAIN, SITE_IDS, normalizeHost, isRootDomain } from "@/lib/sites";

// 패턴 매칭 우선순위 — 더 구체적인 패턴을 먼저 두어 오감지 방지
// (lumiaeo/proxy.ts와 정책 동기화)
const AI_CRAWLERS: Record<string, string> = {
  "OAI-SearchBot": "ChatGPT-Search",
  "ChatGPT-User": "ChatGPT",
  GPTBot: "ChatGPT-Train",
  "Google-NotebookLM": "Google-NotebookLM",
  "Google-Extended": "Gemini",
  GoogleOther: "GoogleOther",
  Googlebot: "Google",
  Bingbot: "Bing",
  bingbot: "Bing",
  PerplexityBot: "Perplexity",
  ClaudeBot: "Claude",
  "Claude-Web": "Claude",
  "anthropic-ai": "Claude",
  "Applebot-Extended": "Apple-Extended",
  Applebot: "Apple",
  DuckAssistBot: "DuckAssist",
  CCBot: "CommonCrawl",
  "Meta-ExternalAgent": "Meta",
  "Meta-ExternalFetcher": "Meta",
  "cohere-ai": "Cohere",
  Bytespider: "ByteDance",
};

// route handler paths — middleware rewrite 대상에서 제외
// (이들은 자체 Request 객체에서 host를 읽어 처리하며 ISR/Cache-Control도 route handler가 직접 설정)
const ROUTE_HANDLER_PATHS = new Set([
  "/sitemap.xml",
  "/robots.txt",
  "/feed.xml",
  "/rss.xml",
  "/feed",
  "/llms.txt",
]);

function isRouteHandlerPath(pathname: string): boolean {
  return (
    ROUTE_HANDLER_PATHS.has(pathname) ||
    pathname.startsWith("/api/") ||
    // public/ 정적 파일 — IndexNow key(.txt), favicon(.ico), 검색엔진 인증(.html) 등.
    // page slug는 영문+숫자+하이픈만 가능하고 점(.)을 포함하지 않으므로 확장자 매칭 안전.
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

// 외부에서 internal rewrite 타깃에 직접 접근하는 것 차단
// (Next.js routing은 underscore prefix 폴더를 private로 처리해 rewrite 타깃이 될 수 없으므로
//  일반 이름의 폴더 `geo`를 internal rewrite 전용으로 예약 — middleware에서 외부 접근 차단)
const INTERNAL_REWRITE_PREFIX = "/geo";
const ROOT_SITE_SLUG = "__root__";

/**
 * 옛 색인 보존을 위한 slug → site_id 조회.
 * root 도메인(`geo-networks.com/<slug>`)이 외부 검색엔진에 색인된 경우(2026-05-17 사고)
 * 정확한 site 서브도메인으로 301 redirect해 404를 회피.
 *
 * 동일 slug가 여러 site에 발행됐을 때 — 가장 먼저 발행된 site로 redirect (canonical 후보).
 */
async function findSiteForSlug(slug: string): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/network_posts?slug=eq.${encodeURIComponent(
        slug
      )}&status=eq.published&select=site_id&order=published_at.asc&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );
    const rows = (await res.json()) as Array<{ site_id: string }>;
    return rows?.[0]?.site_id ?? null;
  } catch {
    return null;
  }
}

function detectCrawler(
  userAgent: string
): { crawlerName: string; crawlerLabel: string } | null {
  for (const [pattern, label] of Object.entries(AI_CRAWLERS)) {
    if (userAgent.includes(pattern)) {
      return { crawlerName: pattern, crawlerLabel: label };
    }
  }
  return null;
}

/**
 * 봇 방문을 비동기로 Supabase에 기록.
 * - waitUntil로 응답 반환 후에도 비동기 작업 보장
 * - subdomain → site_id 매핑
 * - pathname → slug → network_posts 조회로 brand_id 매핑 (글 페이지일 때만)
 */
async function recordCrawlerVisit(
  siteId: string,
  crawler: { crawlerName: string; crawlerLabel: string },
  pathname: string,
  userAgent: string,
  ipAddress: string | null
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  const slug = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  const isPostPath =
    slug.length > 0 && !slug.includes("/") && !slug.startsWith("_");

  let brandId: string | null = null;
  let postId: string | null = null;

  if (isPostPath) {
    try {
      const lookup = await fetch(
        `${supabaseUrl}/rest/v1/network_posts?site_id=eq.${encodeURIComponent(siteId)}&slug=eq.${encodeURIComponent(slug)}&select=id,brand_id&limit=1`,
        {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
        }
      );
      const rows = (await lookup.json()) as Array<{ id: string; brand_id: string | null }>;
      const post = rows?.[0];
      brandId = post?.brand_id ?? null;
      postId = post?.id ?? null;
    } catch {
      // ignore — brand_id NULL로 기록만 남김
    }
  }

  try {
    await fetch(`${supabaseUrl}/rest/v1/network_crawler_visits`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        site_id: siteId,
        brand_id: brandId,
        network_post_id: postId,
        crawler_name: crawler.crawlerName,
        crawler_label: crawler.crawlerLabel,
        visited_path: pathname,
        user_agent: userAgent,
        ip_address: ipAddress,
      }),
    });
  } catch {
    // 로깅 실패는 응답에 영향 없음
  }
}

/**
 * Proxy:
 *  1) www → apex 301 redirect
 *  2) unknown wildcard subdomain → 404 + noindex
 *  3) 외부에서 /__internal/... 직접 접근 → 404 (internal rewrite 타깃 보호)
 *  4) root host + slug 경로 → 정확한 site 서브도메인으로 301 redirect (옛 색인 보존)
 *  5) valid host + page path → /geo/<siteSlug>/<path>로 internal rewrite (ISR 활성화 목적)
 *     · route handler(sitemap/robots/feed 등)와 /api/*는 rewrite 안 함
 *  6) 봇 방문 로깅
 */
export async function proxy(request: NextRequest) {
  const rawHost = request.headers.get("host") ?? "";
  const host = normalizeHost(rawHost);
  const pathname = request.nextUrl.pathname;

  // 1) www → apex
  if (host === `www.${ROOT_DOMAIN}`) {
    return NextResponse.redirect(`https://${ROOT_DOMAIN}${pathname}`, 301);
  }

  // 3) 외부에서 internal rewrite 타깃에 직접 접근하는 것 차단
  if (pathname === INTERNAL_REWRITE_PREFIX || pathname.startsWith(`${INTERNAL_REWRITE_PREFIX}/`)) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      },
    });
  }

  // 4) root host(`geo-networks.com`) + slug 형식 path → 정확한 site로 301 redirect
  //    외부 검색엔진에 색인된 옛 root URL 보존 (2026-05-17 404 사고 핫픽스).
  //    route handler / internal path / /api/ / static asset은 제외.
  if (
    isRootDomain(host) &&
    pathname !== "/" &&
    !isRouteHandlerPath(pathname) &&
    !pathname.startsWith(INTERNAL_REWRITE_PREFIX + "/") &&
    pathname !== INTERNAL_REWRITE_PREFIX
  ) {
    const candidate = pathname.replace(/^\/+/, "").replace(/\/$/, "");
    // 단일 segment + slug 형식만 redirect 대상 (다중 segment, 영문 외 문자 제외)
    if (/^[a-z0-9][a-z0-9-]*$/.test(candidate)) {
      const targetSite = await findSiteForSlug(candidate);
      if (targetSite) {
        return NextResponse.redirect(
          `https://${targetSite}.${ROOT_DOMAIN}/${candidate}`,
          301
        );
      }
    }
  }

  // 2) unknown wildcard subdomain 차단
  const isRoot = isRootDomain(host);
  let validSiteId: string | null = null;
  if (!isRoot) {
    if (host.endsWith(`.${ROOT_DOMAIN}`)) {
      const subdomain = host.replace(`.${ROOT_DOMAIN}`, "");
      if (!SITE_IDS.has(subdomain)) {
        return new NextResponse("Not Found", {
          status: 404,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Robots-Tag": "noindex, nofollow",
            "Cache-Control": "no-store",
          },
        });
      }
      validSiteId = subdomain;
    } else {
      // 커스텀 도메인 / vercel.app 레거시 / Vercel preview
      validSiteId = process.env.SITE_ID ?? null;
    }
  }

  const ua = request.headers.get("user-agent") ?? "";
  const crawler = detectCrawler(ua);
  const siteSlug = isRoot ? ROOT_SITE_SLUG : validSiteId;

  // 4) page path → internal rewrite (ISR 활성화)
  //    route handler paths(sitemap/robots/...)와 /api/*는 rewrite 안 함
  const shouldRewrite = siteSlug && !isRouteHandlerPath(pathname);
  let response: NextResponse;
  if (shouldRewrite) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `${INTERNAL_REWRITE_PREFIX}/${siteSlug}${pathname === "/" ? "" : pathname}`;
    response = NextResponse.rewrite(rewriteUrl);
  } else {
    response = NextResponse.next();
  }
  response.headers.set("x-geo-host", host);

  // 봇 방문 로깅 — valid siteId일 때만
  if (crawler && validSiteId) {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    waitUntil(
      recordCrawlerVisit(validSiteId, crawler, pathname, ua, ipAddress)
    );
  }

  return response;
}

// robots.txt도 proxy를 거치도록 matcher에서 제외 제거
// (이전엔 robots\\.txt 제외였음 → unknown host의 robots.txt가 살아남던 사고)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
