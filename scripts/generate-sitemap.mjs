/**
 * 빌드 시 정적 sitemap.xml 생성
 * public/sitemap.xml로 저장 → Next.js가 정적 파일로 서빙 (layout 개입 없음)
 */
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_ID = process.env.SITE_ID ?? "health-guide";

// Vercel 배포 URL 감지
const VERCEL_URL = process.env.VERCEL_URL ?? "localhost:3000";
const VERCEL_PROJECT = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? VERCEL_URL;
const BASE_URL = `https://${VERCEL_PROJECT}`;

async function main() {
  const now = new Date().toISOString();
  let posts = [];

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data } = await supabase
        .from("network_posts")
        .select("slug, published_at, category")
        .eq("site_id", SITE_ID)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(500);
      posts = data ?? [];
    } catch (e) {
      console.error("DB 조회 실패:", e.message);
    }
  }

  const urls = [
    `  <url>\n    <loc>${BASE_URL}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  ];

  for (const post of posts) {
    urls.push(
      `  <url>\n    <loc>${BASE_URL}/${post.slug}</loc>\n    <lastmod>${post.published_at ?? now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    );
  }

  const categories = new Set();
  for (const post of posts) {
    if (post.category) categories.add(post.category);
  }
  for (const cat of categories) {
    urls.push(
      `  <url>\n    <loc>${BASE_URL}/category/${encodeURIComponent(cat)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  writeFileSync("public/sitemap.xml", xml, "utf-8");
  console.log(`sitemap.xml 생성 완료: ${posts.length}개 게시물, SITE_ID=${SITE_ID}, BASE_URL=${BASE_URL}`);
}

main().catch(console.error);
