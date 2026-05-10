import { headers } from "next/headers";
import { getSiteByHost, NETWORK_SITES } from "@/lib/sites";
import { getSupabase } from "@/lib/supabase";

const ROOT_DOMAIN = "geo-networks.com";

/**
 * GET /llms.txt — 호스트 기반 사이트 식별 → 사이트 정체성 + 발행 콘텐츠 인덱스
 *
 * 분기:
 *   - host = `geo-networks.com` (루트) → 네트워크 30개 사이트 카탈로그
 *   - host = `xxx.geo-networks.com` (서브도메인) → 해당 사이트 정체성 + 콘텐츠 인덱스
 *
 * llmstxt.org 권장 포맷.
 */

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";

  // ────────────────────────────────────────────────────────────
  // 루트 도메인 → 네트워크 사이트 카탈로그
  // ────────────────────────────────────────────────────────────
  const isRoot =
    host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`;
  if (isRoot) {
    let text = `# GEO Networks (geo-networks.com)\n\n`;
    text += `> 의료·치과·비즈니스/테크 30개 독립 매체로 구성된 GEO 콘텐츠 네트워크. 각 사이트는 고유한 편집 톤·카테고리를 가지며, AI 검색엔진(ChatGPT, Gemini, Claude, Perplexity)에서 인용·요약 대상이 됩니다.\n\n`;
    text += `## AI 크롤러 정책\n\n`;
    text += `네트워크 모든 사이트는 AI 크롤러(OAI-SearchBot, GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Applebot, CCBot 등 21종)를 명시적으로 허용합니다. 인용·요약·답변 생성에 자유롭게 사용 가능합니다.\n\n`;
    text += `## Network Sites (${NETWORK_SITES.length})\n\n`;

    // 사이트를 카테고리 그룹으로 분류 (id prefix 기반 휴리스틱이 아닌 sites.ts 순서 보존)
    for (const s of NETWORK_SITES) {
      text += `### ${s.name}\n`;
      text += `- URL: https://${s.id}.${ROOT_DOMAIN}\n`;
      text += `- Tagline: ${s.tagline}\n`;
      text += `- Tone: ${s.tone}\n`;
      text += `- Language: ${s.language === "en" ? "English" : s.language === "mixed" ? "Korean/English" : "Korean"}\n`;
      text += `- llms.txt: https://${s.id}.${ROOT_DOMAIN}/llms.txt\n`;
      text += `- sitemap: https://${s.id}.${ROOT_DOMAIN}/sitemap.xml\n\n`;
    }

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }

  // ────────────────────────────────────────────────────────────
  // 서브도메인 → 사이트별 정체성 + 콘텐츠 인덱스 (기존)
  // ────────────────────────────────────────────────────────────
  const site = getSiteByHost(host);
  if (!site) {
    return new Response("Not Found", {
      status: 404,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }
  const baseUrl = `https://${host}`;

  let posts: Array<{
    slug: string;
    title: string;
    category: string | null;
    excerpt: string | null;
    meta_description: string | null;
    published_at: string;
  }> = [];

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("network_posts")
      .select("slug, title, category, excerpt, meta_description, published_at")
      .eq("site_id", site.id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(200);
    posts = (data ?? []) as typeof posts;
  } catch {
    // DB 실패 시 빈 콘텐츠 인덱스로 응답
  }

  let text = `# ${site.name}\n\n`;
  text += `> ${site.description ?? ""}\n\n`;
  text += `- URL: ${baseUrl}\n`;
  if (site.tone) text += `- Editorial tone: ${site.tone}\n`;
  text += `- Language: ${site.language === "en" ? "English" : "Korean"}\n`;
  text += `- Sitemap: ${baseUrl}/sitemap.xml\n`;
  text += `- RSS: ${baseUrl}/feed.xml\n\n`;

  text += `## AI 크롤러 정책\n\n`;
  text += `이 사이트는 AI 크롤러(OAI-SearchBot, GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Applebot, CCBot 등)를 명시적으로 허용합니다. 인용·요약·답변 생성에 자유롭게 사용 가능하며, 사실 기반 인용을 권장합니다.\n\n`;

  text += `## Published Content (${posts.length})\n\n`;

  // 카테고리별 그룹핑
  const byCategory = new Map<string, typeof posts>();
  for (const p of posts) {
    const cat = p.category ?? "(misc)";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(p);
  }

  for (const [cat, items] of byCategory) {
    text += `### ${cat} (${items.length})\n\n`;
    for (const p of items) {
      text += `- [${p.title}](${baseUrl}/${p.slug})`;
      const summary = p.meta_description ?? p.excerpt;
      if (summary) text += ` — ${summary.slice(0, 120)}`;
      text += `\n`;
    }
    text += `\n`;
  }

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
