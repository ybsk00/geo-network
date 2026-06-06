import { getSupabase } from "@/lib/supabase";
import { getSiteByHost, NETWORK_SITES } from "@/lib/sites";
import { headers } from "next/headers";

const ROOT_DOMAIN = "geo-networks.com";

function isRootDomain(host: string): boolean {
  return host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || host === "";
}

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
      .eq("billing_only", false) // 대량 발행 과금용 격리: 피드 제외
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
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${link}</guid>${post.category ? `\n      <category>${post.category}</category>` : ""}
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GEO Networks</title>
    <link>${baseUrl}</link>
    <description>전문가가 검증한 건강 정보를 다양한 관점에서 제공하는 독립 미디어 네트워크</description>
    <language>ko</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>`;
}

async function buildSiteRss(host: string): Promise<string | null> {
  const site = getSiteByHost(host);
  if (!site) return null;
  const baseUrl = `https://${host}`;

  let posts: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string;
    category: string | null;
  }> = [];

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("network_posts")
      .select("slug, title, excerpt, published_at, category")
      .eq("site_id", site.id)
      .eq("status", "published")
      .eq("billing_only", false) // 대량 발행 과금용 격리: 피드 제외
      .order("published_at", { ascending: false })
      .limit(30);
    posts = data ?? [];
  } catch {
    // DB 실패 시 빈 피드
  }

  const lang = site.language === "en" ? "en" : "ko";

  const items = posts.map((post) => {
    const link = `${baseUrl}/${post.slug}`;
    const pubDate = new Date(post.published_at).toUTCString();

    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${link}</guid>${post.category ? `\n      <category>${post.category}</category>` : ""}
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name}</title>
    <link>${baseUrl}</link>
    <description>${site.description}</description>
    <language>${lang}</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
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

  if (xml === null) {
    return new Response("Not Found", {
      status: 404,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
