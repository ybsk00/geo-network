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

/** valid host 의 site_id 추출 (unknown wildcard는 null) */
function extractValidSiteId(host: string): string | null {
  const h = normalizeHost(host);
  if (h.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = h.replace(`.${ROOT_DOMAIN}`, "");
    return SITE_IDS.has(subdomain) ? subdomain : null;
  }
  return process.env.SITE_ID ?? null;
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
 * 미들웨어:
 *  1) www → apex 301 redirect
 *  2) unknown wildcard subdomain (예: does-not-exist.geo-networks.com) → 404 + noindex
 *     · 와일드카드 도메인이 "무한 생성 가능 저품질 호스트"로 Google에 평가되는 것을 막음
 *  3) valid host에 한해 사이트 ID 헤더 주입 + AI 크롤러 헤더 + 봇 방문 로깅
 *  4) robots.txt도 미들웨어가 잡도록 matcher에서 제외 제거
 */
export function middleware(request: NextRequest) {
  const rawHost = request.headers.get("host") ?? "";
  const host = normalizeHost(rawHost);

  // 1) www → apex
  if (host === `www.${ROOT_DOMAIN}`) {
    return NextResponse.redirect(`https://${ROOT_DOMAIN}${request.nextUrl.pathname}`, 301);
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

  const response = NextResponse.next();
  response.headers.set("x-geo-host", host);

  const ua = request.headers.get("user-agent") ?? "";
  const crawler = detectCrawler(ua);

  if (crawler) {
    response.headers.set(
      "X-Robots-Tag",
      "index, follow, max-snippet:-1, max-image-preview:large"
    );
    response.headers.set("Cache-Control", "public, max-age=3600");

    // valid siteId 일 때만 봇 방문 기록 — unknown host 노이즈 차단
    if (validSiteId) {
      const ipAddress =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
      waitUntil(
        recordCrawlerVisit(validSiteId, crawler, request.nextUrl.pathname, ua, ipAddress)
      );
    }
  }

  return response;
}

// robots.txt도 미들웨어 거치도록 matcher에서 제외 제거
// (이전엔 robots\\.txt 제외였음 → unknown host의 robots.txt가 살아남던 사고)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
