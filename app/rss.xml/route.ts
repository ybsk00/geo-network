import { getSupabase } from "@/lib/supabase";
import { getSiteByHost, NETWORK_SITES } from "@/lib/sites";
import { headers } from "next/headers";

const ROOT_DOMAIN = "geo-networks.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isRootDomain(host: string): boolean {
  return host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || host === "";
}

/** 루트 도메인용 RSS — 전체 네트워크 최신 글 통합 */
async function buildRootRss(): Promise<string> {
  const baseUrl = `https://${ROOT_DOMAIN}`;

  let posts: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    site_id: string;
    published_at: string;
    category: string | null;
  }> = [];

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("network_posts")
      .select("slug, title, excerpt, site_id, published_at, category")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(50);
    posts = data ?? [];
  } catch {
    // DB 실패 시 빈 피드
  }

  const items = posts.map((post) => {
    const site = NETWORK_SITES.find((s) => s.id === post.site_id);
    const siteUrl = site ? `https://${site.domain}` : baseUrl;
    const link = `${siteUrl}/${post.slug}`;
    const pubDate = new Date(post.published_at).toUTCString();

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
      ${site ? `<source url="${siteUrl}/rss.xml">${escapeXml(site.name)}</source>` : ""}
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GEO Networks</title>
    <link>${baseUrl}</link>
    <description>전문가가 검증한 건강 정보를 다양한 관점에서 제공하는 독립 미디어 네트워크</description>
    <language>ko</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>`;
}

/** 개별 사이트용 RSS */
async function buildSiteRss(host: string): Promise<string> {
  const site = getSiteByHost(host);
  const baseUrl = `https://${host}`;

  let posts: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string;
    category: string | null;
    content_html: string | null;
  }> = [];

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("network_posts")
      .select("slug, title, excerpt, published_at, category, content_html")
      .eq("site_id", site.id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(30);
    posts = data ?? [];
  } catch {
    // DB 실패 시 빈 피드
  }

  const items = posts.map((post) => {
    const link = `${baseUrl}/${post.slug}`;
    const pubDate = new Date(post.published_at).toUTCString();
    const desc = post.excerpt || "";

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(desc)}</description>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
    </item>`;
  });

  const lang = site.language === "en" ? "en" : "ko";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(site.description)}</description>
    <language>${lang}</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>`;
}

export async function GET() {
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";

  const xml = isRootDomain(host)
    ? await buildRootRss()
    : await buildSiteRss(host);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
