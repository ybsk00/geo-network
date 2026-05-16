import "../blog-template.css";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteByHost, getTemplateForSite } from "@/lib/sites";
import { getSupabase } from "@/lib/supabase";
import type { Metadata } from "next";
import { TEMPLATES } from "@/components/blog-templates";
import { safeExternalUrl } from "@/lib/blog-templates/shared/safe-external-url";
import { normalizeBodyHtml } from "@/lib/blog-templates/shared/normalize-body";
import { extractToc } from "@/lib/blog-templates/shared/extract-toc";
import { TEMPLATE_TOKENS, mergeTokens } from "@/lib/blog-templates/shared/tokens";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";
  const site = getSiteByHost(host);
  if (!site) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }
  const baseUrl = `https://${host}`;

  try {
    const supabase = getSupabase();
    const { data: post } = await supabase
      .from("network_posts")
      .select("title, excerpt, meta_description, category, published_at")
      .eq("site_id", site.id)
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!post) return { title: "Not Found" };

    const description = post.meta_description ?? post.excerpt ?? post.title;
    const pageUrl = `${baseUrl}/${slug}`;

    return {
      title: post.title,
      description,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: post.title,
        description,
        type: "article",
        url: pageUrl,
        siteName: site.name,
        publishedTime: post.published_at,
        locale: site.language === "en" ? "en_US" : "ko_KR",
        ...(post.category && { section: post.category }),
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";
  const site = getSiteByHost(host);
  if (!site) notFound();
  const t = site.theme;
  const baseUrl = `https://${host}`;

  interface NetworkPost {
    title: string;
    body_html: string;
    excerpt: string | null;
    meta_description: string | null;
    category: string | null;
    brand_name: string | null;
    published_at: string;
  }

  let post: (NetworkPost & { brand_id?: string | null }) | null = null;
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("network_posts")
      .select("title, body_html, excerpt, meta_description, category, brand_name, brand_id, published_at")
      .eq("site_id", site.id)
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    post = data as (NetworkPost & { brand_id?: string | null }) | null;
  } catch {
    // DB 연결 실패
  }

  if (!post) notFound();

  // brand 정보(원본 사이트 URL) — mentions에 sameAs용으로 활용
  let brandWebsite: string | null = null;
  let brandSubdomain: string | null = null;
  if (post.brand_id) {
    try {
      const supabase = getSupabase();
      const { data: brand } = await supabase
        .from("brands")
        .select("website_url, subdomain")
        .eq("id", post.brand_id)
        .single();
      brandWebsite = (brand?.website_url as string | null) ?? null;
      brandSubdomain = (brand?.subdomain as string | null) ?? null;
    } catch {
      // brand 조회 실패는 무시
    }
  }

  const pageUrl = `${baseUrl}/${slug}`;
  const description = post.meta_description ?? post.excerpt ?? post.title;

  // about/mentions 빌드 — Article 엔티티 신호
  const aboutThings = [
    ...(post.category ? [{ "@type": "Thing", name: post.category }] : []),
    { "@type": "Thing", name: site.name },
  ];
  const mentionsThings: Array<Record<string, unknown>> = [];
  if (post.brand_name) {
    const mention: Record<string, unknown> = {
      "@type": "Organization",
      name: post.brand_name,
    };
    const sameAs: string[] = [];
    if (brandWebsite) sameAs.push(brandWebsite);
    if (brandSubdomain) sameAs.push(`https://${brandSubdomain}.lumiaeo.com`);
    if (sameAs.length > 0) mention.sameAs = sameAs;
    mentionsThings.push(mention);
  }

  // JSON-LD @graph: Article + BreadcrumbList + Organization
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: post.title,
        description,
        datePublished: post.published_at,
        dateModified: post.published_at,
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        author: {
          "@type": "Organization",
          name: site.name,
          url: baseUrl,
        },
        publisher: {
          "@type": "Organization",
          name: site.name,
          url: baseUrl,
        },
        inLanguage: site.language === "en" ? "en-US" : "ko-KR",
        ...(post.category && { articleSection: post.category }),
        ...(aboutThings.length > 0 && { about: aboutThings }),
        ...(mentionsThings.length > 0 && { mentions: mentionsThings }),
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: site.name,
            item: baseUrl,
          },
          ...(post.category
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: post.category,
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: post.category ? 3 : 2,
            name: post.title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: site.name,
        url: baseUrl,
        description: site.description,
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        name: site.name,
        url: baseUrl,
        publisher: { "@id": `${baseUrl}#organization` },
        inLanguage: site.language === "en" ? "en-US" : "ko-KR",
      },
    ],
  };

  // === 새 디자인 템플릿 분기 (BLOG_TEMPLATE_BRANDS === "*"일 때만) ===
  //     geo-network는 site 단위 컷오버 안 함 — "*" 명시값에서만 활성.
  //     typo/임의값 사고 차단 (geo-network는 brand 컨셉 없음).
  const tmplBrands = (process.env.BLOG_TEMPLATE_BRANDS ?? "").trim();
  if (tmplBrands === "*") {
    const externalWebsite = safeExternalUrl(brandWebsite, baseUrl);
    const cta = externalWebsite
      ? { url: externalWebsite, label: "출처 사이트 보기 →", phone: null }
      : null;

    const templateId = getTemplateForSite(site.id);
    const tokens = mergeTokens(TEMPLATE_TOKENS[templateId], {
      primaryColor: site.theme.primaryColor,
      bgColor: site.theme.bgColor,
      textColor: site.theme.textColor,
    });
    const normalizedBody = normalizeBodyHtml(post.body_html, { allowDropCap: tokens.dropCap });
    const toc = extractToc(normalizedBody);
    const Template = TEMPLATES[templateId];

    // network_posts엔 faq_entries 컬럼 없음 → showFaq=false / faqJsonLd=false
    // 관련 글은 별도 RelatedPosts 컴포넌트가 article 밖에서 처리하지만,
    // 새 wrapper는 자체 관련 글 영역이 있으므로 RelatedPosts fetch를 인라인.
    const supabase = getSupabase();
    const { data: relatedRaw } = await supabase
      .from("network_posts")
      .select("slug, title, category")
      .eq("site_id", site.id)
      .eq("status", "published")
      .neq("slug", slug)
      .limit(4);
    const relatedPosts = (relatedRaw ?? []).map((r) => ({
      slug: r.slug as string,
      title: r.title as string,
      category: (r.category as string | null) ?? null,
    }));

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Template
          title={post.title}
          bodyHtml={normalizedBody}
          category={post.category}
          publishedAt={post.published_at}
          updatedAt={null}
          brandName={site.name}
          reviewer={null}
          homeUrl={baseUrl}
          blogUrl={baseUrl}
          toc={toc}
          showFaqSection={false}
          faqEntries={[]}
          relatedPosts={relatedPosts}
          cta={cta}
          theme={tokens}
        />
      </>
    );
  }

  // === 기존 디자인 (fallback) ===
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 브레드크럼 네비게이션 */}
      <nav className="text-xs opacity-50 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1">
          <li>
            <a href="/" className="hover:underline">
              {site.name}
            </a>
          </li>
          {post.category && (
            <>
              <li>/</li>
              <li>{post.category}</li>
            </>
          )}
          <li>/</li>
          <li className="truncate max-w-[200px]">{post.title}</li>
        </ol>
      </nav>

      {post.category && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${t.primaryColor}10`,
            color: t.primaryColor,
          }}
        >
          {post.category}
        </span>
      )}

      <h1 className="text-3xl font-bold mt-3 mb-2">{post.title}</h1>

      <div className="flex items-center gap-3 text-xs opacity-50 mb-8">
        <time dateTime={post.published_at}>
          {new Date(post.published_at).toLocaleDateString(
            site.language === "en" ? "en-US" : "ko-KR"
          )}
        </time>
        <span>·</span>
        <span>{site.name}</span>
        {post.brand_name && (
          <>
            <span>·</span>
            <span>출처: {post.brand_name}</span>
          </>
        )}
      </div>

      {/* 본문 */}
      <div
        className="prose prose-lg max-w-none"
        style={
          {
            "--tw-prose-headings": t.textColor,
            "--tw-prose-links": t.primaryColor,
          } as React.CSSProperties
        }
        dangerouslySetInnerHTML={{ __html: post.body_html }}
      />

      {/* 관련 글 */}
      <RelatedPosts siteId={site.id} currentSlug={slug} category={post.category} />
    </article>
  );
}

async function RelatedPosts({
  siteId,
  currentSlug,
  category,
}: {
  siteId: string;
  currentSlug: string;
  category: string | null;
}) {
  const supabase = getSupabase();

  let query = supabase
    .from("network_posts")
    .select("slug, title")
    .eq("site_id", siteId)
    .eq("status", "published")
    .neq("slug", currentSlug)
    .limit(4);

  if (category) {
    query = query.eq("category", category);
  }

  const { data: related } = await query;
  if (!related?.length) return null;

  return (
    <nav className="mt-16 pt-8 border-t border-gray-200" aria-label="Related articles">
      <h2 className="text-lg font-semibold mb-4">관련 글</h2>
      <div className="grid gap-3">
        {related.map((r) => (
          <a
            key={r.slug}
            href={`/${r.slug}`}
            className="text-sm hover:underline opacity-80 hover:opacity-100"
          >
            {r.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
