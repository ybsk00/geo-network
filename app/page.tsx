import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteByHost, isRootDomain as isRoot, NETWORK_SITES, ROOT_DOMAIN } from "@/lib/sites";
import { ALL_PARTNERS } from "@/lib/featured-partners";
import { getSupabase } from "@/lib/supabase";
import type { Metadata } from "next";

export const revalidate = 3600; // 1시간 ISR

function isRootDomain(host: string): boolean {
  return host === "" || isRoot(host);
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";

  if (isRootDomain(host)) {
    return {
      title: "GEO Networks — 건강 정보 네트워크",
      description: "전문가가 검증한 건강 정보를 다양한 관점에서 제공하는 독립 미디어 네트워크입니다.",
      alternates: { canonical: `https://${ROOT_DOMAIN}` },
      openGraph: {
        title: "GEO Networks",
        description: "전문가가 검증한 건강 정보를 다양한 관점에서 제공하는 독립 미디어 네트워크입니다.",
        type: "website",
        url: `https://${ROOT_DOMAIN}`,
      },
    };
  }

  const site = getSiteByHost(host);
  if (!site) {
    return {
      title: "Not Found",
      robots: { index: false, follow: false },
    };
  }
  const baseUrl = `https://${host}`;

  return {
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: site.name,
      description: site.description,
      type: "website",
      url: baseUrl,
      siteName: site.name,
      locale: site.language === "en" ? "en_US" : "ko_KR",
    },
    twitter: {
      card: "summary",
      title: site.name,
      description: site.description,
    },
  };
}

export default async function HomePage() {
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";

  // 루트 도메인 → 포털 페이지
  if (isRootDomain(host)) {
    return <PortalPage />;
  }

  const site = getSiteByHost(host);
  if (!site) notFound();
  const baseUrl = `https://${host}`;

  let postList: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    published_at: string;
  }> = [];
  try {
    const supabase = getSupabase();
    const { data: posts } = await supabase
      .from("network_posts")
      .select("id, slug, title, excerpt, category, published_at")
      .eq("site_id", site.id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(20);
    postList = posts ?? [];
  } catch {
    // DB 연결 실패 시 빈 목록
  }
  const t = site.theme;

  // JSON-LD: CollectionPage + WebSite + Organization
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}#collectionpage`,
        name: site.name,
        description: site.description,
        url: baseUrl,
        isPartOf: { "@id": `${baseUrl}#website` },
        ...(postList.length > 0 && {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: postList.map((post, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${baseUrl}/${post.slug}`,
              name: post.title,
            })),
          },
        }),
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        name: site.name,
        url: baseUrl,
        description: site.description,
        publisher: { "@id": `${baseUrl}#organization` },
        inLanguage: site.language === "en" ? "en-US" : "ko-KR",
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: site.name,
        url: baseUrl,
        description: site.description,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 히어로 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-2">{site.tagline}</h2>
        <p className="text-base opacity-70 max-w-xl">{site.description}</p>
      </section>

      {postList.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p className="text-lg">아직 게시된 글이 없습니다.</p>
          <p className="text-sm mt-2">곧 유용한 건강 정보가 업데이트됩니다.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {postList.map((post) => (
            <article
              key={post.id}
              className="group border rounded-xl p-6 transition-all hover:shadow-md"
              style={{ borderColor: `${t.primaryColor}15` }}
            >
              <Link href={`/${post.slug}`}>
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
                <h3
                  className="text-xl font-semibold mt-2 group-hover:underline"
                  style={{ color: t.textColor }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm opacity-60 mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <time
                  className="text-xs opacity-40 mt-3 block"
                  dateTime={post.published_at}
                >
                  {new Date(post.published_at).toLocaleDateString(
                    site.language === "en" ? "en-US" : "ko-KR"
                  )}
                </time>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/** 루트 도메인 포털 — 네트워크 사이트 목록 */
function PortalPage() {
  const koSites = NETWORK_SITES.filter((s) => s.language === "ko");
  const enSites = NETWORK_SITES.filter((s) => s.language === "en");
  const mixedSites = NETWORK_SITES.filter((s) => s.language === "mixed");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GEO Networks",
    url: `https://${ROOT_DOMAIN}`,
    description: "전문가가 검증한 건강 정보를 다양한 관점에서 제공하는 독립 미디어 네트워크",
    publisher: {
      "@type": "Organization",
      name: "GEO Networks",
      url: `https://${ROOT_DOMAIN}`,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mb-16 text-center">
        <h2 className="text-4xl font-bold mb-4" style={{ color: "#1e293b" }}>
          GEO Networks
        </h2>
        <p className="text-lg opacity-70 max-w-2xl mx-auto">
          전문가가 검증한 건강 정보를 다양한 관점에서 제공하는 독립 미디어 네트워크입니다.
          <br />
          각 사이트는 고유한 편집 방향과 전문성을 바탕으로 운영됩니다.
        </p>
      </section>

      <section className="mb-12">
        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-6">
          한국어 사이트 ({koSites.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {koSites.map((s) => (
            <a
              key={s.id}
              href={`https://${s.domain}`}
              className="group border rounded-xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: `${s.theme.primaryColor}20` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: s.theme.primaryColor }}
                />
                <span className="font-bold" style={{ color: s.theme.primaryColor }}>
                  {s.name}
                </span>
              </div>
              <p className="text-sm opacity-60">{s.tagline}</p>
              <p className="text-xs opacity-40 mt-2">{s.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-6">
          English Sites ({enSites.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enSites.map((s) => (
            <a
              key={s.id}
              href={`https://${s.domain}`}
              className="group border rounded-xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: `${s.theme.primaryColor}20` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: s.theme.primaryColor }}
                />
                <span className="font-bold" style={{ color: s.theme.primaryColor }}>
                  {s.name}
                </span>
              </div>
              <p className="text-sm opacity-60">{s.tagline}</p>
              <p className="text-xs opacity-40 mt-2">{s.description}</p>
            </a>
          ))}
        </div>
      </section>

      {mixedSites.length > 0 && (
        <section className="mb-12">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-6">
            Bilingual ({mixedSites.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mixedSites.map((s) => (
              <a
                key={s.id}
                href={`https://${s.domain}`}
                className="group border rounded-xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderColor: `${s.theme.primaryColor}20` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.theme.primaryColor }}
                  />
                  <span className="font-bold" style={{ color: s.theme.primaryColor }}>
                    {s.name}
                  </span>
                </div>
                <p className="text-sm opacity-60">{s.tagline}</p>
                <p className="text-xs opacity-40 mt-2">{s.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 협업 의료/비즈 파트너 — 본체 lumiaeo.com 서브도메인 4 brand */}
      <section className="mb-12 mt-16 pt-12 border-t" style={{ borderColor: "#e2e8f0" }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-2">
          협업 파트너 / Editorial Partners ({ALL_PARTNERS.length})
        </h3>
        <p className="text-sm opacity-60 mb-6">
          GEO Networks와 함께 콘텐츠 협업을 진행하는 의료·비즈 파트너입니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_PARTNERS.map((p) => (
            <a
              key={p.id}
              href={p.url}
              rel="noopener"
              className="group border rounded-xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: "#cbd5e1" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#0f172a" }} />
                <span className="font-bold" style={{ color: "#0f172a" }}>
                  {p.name}
                </span>
              </div>
              <p className="text-sm opacity-70">{p.tagline}</p>
              <p className="text-xs opacity-50 mt-2">{p.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
