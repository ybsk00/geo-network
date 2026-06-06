import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * POST /api/publish
 * LumiAEO 배포 엔진이 네트워크 사이트에 콘텐츠를 발행하는 API
 *
 * Body:
 * - apiKey: string (인증)
 * - siteId: string (어느 네트워크 사이트에 발행할지)
 * - posts: Array<{
 *     slug, title, body_html, excerpt, meta_description,
 *     category, brand_name, brand_id, source_content_id
 *   }>
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // billing_only: 대량 발행 과금용 일괄 플래그(배치 전체) — 개별 post.billing_only가 우선
    const { apiKey, siteId, posts, billing_only: batchBillingOnly } = body;

    // API 키 인증
    if (apiKey !== process.env.NETWORK_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!siteId || !posts?.length) {
      return NextResponse.json({ error: "siteId and posts required" }, { status: 400 });
    }

    const supabase = getSupabase();

    // 중복 체크 (같은 사이트+슬러그)
    const slugs = posts.map((p: { slug: string }) => p.slug);
    const { data: existing } = await supabase
      .from("network_posts")
      .select("slug")
      .eq("site_id", siteId)
      .in("slug", slugs);

    const existingSet = new Set((existing ?? []).map((e) => e.slug));

    const newPosts = posts
      .filter((p: { slug: string }) => !existingSet.has(p.slug))
      .map((p: {
        slug: string;
        title: string;
        body_html: string;
        excerpt?: string;
        meta_description?: string;
        category?: string;
        brand_name?: string;
        brand_id?: string;
        source_content_id?: string;
        billing_only?: boolean;
      }) => ({
        site_id: siteId,
        slug: p.slug,
        title: p.title,
        body_html: p.body_html,
        excerpt: p.excerpt ?? null,
        meta_description: p.meta_description ?? null,
        category: p.category ?? null,
        brand_name: p.brand_name ?? null,
        brand_id: p.brand_id ?? null,
        source_content_id: p.source_content_id ?? null,
        billing_only: p.billing_only ?? batchBillingOnly ?? false,
        status: "published",
        published_at: new Date().toISOString(),
      }));

    if (!newPosts.length) {
      return NextResponse.json({
        message: "All posts already exist",
        published: 0,
        duplicates: posts.length,
      });
    }

    const { data: inserted, error } = await supabase
      .from("network_posts")
      .insert(newPosts)
      .select("id, slug, title");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `${inserted?.length ?? 0} posts published to ${siteId}`,
      published: inserted?.length ?? 0,
      duplicates: posts.length - (inserted?.length ?? 0),
      posts: inserted,
    });
  } catch (error) {
    console.error("[Network Publish]", error);
    return NextResponse.json({ error: "Publish failed" }, { status: 500 });
  }
}

/**
 * GET /api/publish?siteId=xxx
 * 사이트의 게시물 수 조회 (상태 확인용)
 */
export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get("siteId");

  const supabase = getSupabase();
  const { count } = await supabase
    .from("network_posts")
    .select("id", { count: "exact", head: true })
    .eq("site_id", siteId ?? "")
    .eq("status", "published");

  return NextResponse.json({ siteId, postCount: count ?? 0 });
}
