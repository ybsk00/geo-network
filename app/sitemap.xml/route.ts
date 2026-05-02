import { getSupabase } from "@/lib/supabase";
import { getSiteByHost, NETWORK_SITES } from "@/lib/sites";
import { headers } from "next/headers";

const ROOT_DOMAIN = "geo-networks.com";

/**
 * GET /sitemap.xml
 *
 * 동작 분기:
 *   - host = `geo-networks.com` (루트 도메인)
 *       → sitemapindex 반환. 30개 서브도메인의 sitemap.xml을 모두 인덱싱.
 *         GSC에 도메인 방식(`geo-networks.com`)으로 등록한 뒤 이 한 URL만 제출하면
 *         하위 모든 사이트가 자동으로 GSC에 잡힌다.
 *
 *   - host = `xxx.geo-networks.com` (서브도메인)
 *       → 기존 urlset 반환. 해당 사이트 콘텐츠만.
 */
export async function GET() {
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";

  // ────────────────────────────────────────────────────────────
  // 루트 도메인 → sitemapindex
  // ────────────────────────────────────────────────────────────
  const isRoot =
    host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`;
  if (isRoot) {
    const now = new Date().toISOString();
    const entries = NETWORK_SITES.map((s) => ({
      loc: `https://${s.id}.${ROOT_DOMAIN}/sitemap.xml`,
      lastmod: now,
    }));
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <sitemap>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }

  // ────────────────────────────────────────────────────────────
  // 서브도메인 → 기존 urlset 동작
  // ────────────────────────────────────────────────────────────
  const site = getSiteByHost(host);
  const siteId = site.id;
  const baseUrl = `https://${host}`;

  let posts: { slug: string; published_at: string | null; category: string | null }[] = [];

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("network_posts")
      .select("slug, published_at, category")
      .eq("site_id", siteId)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(500);
    posts = data ?? [];
  } catch {
    // DB 실패 시 빈 사이트맵 반환 (500 방지)
  }

  // 최신 발행일을 홈페이지 lastmod로 사용
  const latestDate = posts.reduce((max, p) => {
    const d = p.published_at;
    return d && d > max ? d : max;
  }, "2026-01-01T00:00:00Z");

  const urls = [
    `  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${latestDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
  ];

  for (const post of posts) {
    urls.push(
      `  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${post.published_at ?? latestDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    );
  }

  const categories = new Set<string>();
  for (const post of posts) {
    if (post.category) categories.add(post.category);
  }
  for (const cat of categories) {
    urls.push(
      `  <url>
    <loc>${baseUrl}/category/${encodeURIComponent(cat)}</loc>
    <lastmod>${latestDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
