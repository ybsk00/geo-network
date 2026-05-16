// geo-network 버전 — dependency-free (inline SVG + manual typography).
// Reference: lumiaeo/components/blog-templates/templates/ClinicalDocs.tsx
import { ArrowRight, ChevronDown } from "../icons";
import type { BlogTemplateProps } from "@/lib/blog-templates/shared/types";

export function ClinicalDocs(props: BlogTemplateProps) {
  const { title, bodyHtml, category, publishedAt, updatedAt, brandName, reviewer,
    homeUrl, blogUrl, toc, showFaqSection, faqEntries, relatedPosts, cta, theme } = props;

  const cssVars: React.CSSProperties = {
    ["--blog-template-primary" as string]: theme.primaryColor,
    ["--blog-template-surface" as string]: theme.surfaceColor,
    ["--blog-template-border" as string]: theme.borderColor,
    ["--blog-template-muted" as string]: theme.mutedColor,
    ["--blog-template-headline-font" as string]: theme.headlineFont,
    backgroundColor: theme.bgColor, color: theme.textColor, fontFamily: theme.bodyFont, minHeight: "100vh",
  };

  return (
    <div className="blog-template" style={cssVars}>
      <header className="px-6 md:px-10 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.borderColor}`, background: theme.surfaceColor }}>
        <a href={homeUrl} className="font-bold text-base" style={{ color: theme.textColor }}>
          <span className="inline-block w-[22px] h-[22px] rounded-md align-middle mr-2" style={{ background: theme.primaryColor }} />
          {brandName}
        </a>
        {cta && (
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold"
            style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>
            {cta.label}
            <ArrowRight width={16} height={16} />
          </a>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_220px] gap-0">
        <aside className="hidden md:block px-6 py-8"
          style={{ borderRight: `1px solid ${theme.borderColor}`, background: theme.surfaceColor }}>
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: theme.mutedColor }}>건강 정보</div>
          <a href={blogUrl} className="block px-3 py-2 rounded-md text-sm font-semibold"
            style={{ background: `${theme.primaryColor}14`, color: theme.primaryColor }}>전체 글</a>
        </aside>

        <main className="px-6 md:px-14 py-10 max-w-none">
          <nav className="flex gap-2 text-xs mb-4" style={{ color: theme.mutedColor }} aria-label="Breadcrumb">
            <a href={homeUrl}>홈</a><span>›</span><a href={blogUrl}>블로그</a>
            <span>›</span><span style={{ color: theme.textColor }} className="line-clamp-1">{title}</span>
          </nav>

          {category && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: `${theme.primaryColor}14`, color: theme.primaryColor }}>{category}</span>
          )}

          <h1 className="font-bold leading-tight mb-4" style={{
            fontFamily: theme.headlineFont, fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            letterSpacing: "-0.025em", wordBreak: "keep-all" }}>{title}</h1>

          <div className="flex flex-wrap gap-x-4 gap-y-1 py-3 text-sm border-t border-b"
            style={{ color: theme.mutedColor, borderColor: theme.borderColor }}>
            {reviewer && <span><b style={{ color: theme.textColor }}>{reviewer}</b></span>}
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            {updatedAt && updatedAt !== publishedAt && (
              <span>업데이트 {new Date(updatedAt).toLocaleDateString("ko-KR")}</span>
            )}
          </div>

          <div className="post-body mt-8" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

          {cta && (
            <div className="mt-12 p-6 md:p-10 rounded-2xl text-center" style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>
              <p className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: theme.headlineFont, wordBreak: "keep-all" }}>
                {brandName}
              </p>
              <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold"
                style={{ background: theme.primaryOnDark, color: theme.primaryColor }}>
                {cta.label}<ArrowRight width={20} height={20} />
              </a>
              {cta.phone && <p className="mt-4 text-sm opacity-90">전화: {cta.phone}</p>}
            </div>
          )}

          {showFaqSection && faqEntries.length > 0 && (
            <section className="mt-16 pt-10 faq-section">
              <h2 className="section-title text-2xl font-bold mb-6" style={{ fontFamily: theme.headlineFont }}>자주 묻는 질문</h2>
              <div className="space-y-3">
                {faqEntries.map((faq, i) => (
                  <details key={i} className="group rounded-xl overflow-hidden"
                    style={{ background: theme.surfaceColor, border: `1px solid ${theme.borderColor}` }}>
                    <summary className="flex items-center justify-between cursor-pointer p-5 font-medium" style={{ color: theme.textColor }}>
                      <span>{faq.question}</span>
                      <ChevronDown width={20} height={20} className="group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-5 pb-5 leading-relaxed" style={{ color: theme.mutedColor }}>{faq.answer}</div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-10" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
              <h2 className="section-title text-2xl font-bold mb-6" style={{ fontFamily: theme.headlineFont }}>관련 글</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPosts.map((p) => (
                  <a key={p.slug} href={`/${p.slug}`} className="rounded-xl p-5 transition-all block"
                    style={{ background: theme.surfaceColor, border: `1px solid ${theme.borderColor}` }}>
                    {p.category && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full mr-2"
                        style={{ background: `${theme.primaryColor}14`, color: theme.primaryColor }}>{p.category}</span>
                    )}
                    <h3 className="font-bold mt-2 line-clamp-2 leading-snug"
                      style={{ color: theme.textColor, fontFamily: theme.headlineFont, wordBreak: "keep-all" }}>{p.title}</h3>
                    {p.excerpt && <p className="mt-2 text-sm line-clamp-1" style={{ color: theme.mutedColor }}>{p.excerpt}</p>}
                  </a>
                ))}
              </div>
            </section>
          )}

          {cta && <div className="md:hidden sticky-cta-spacer" aria-hidden />}
        </main>

        {toc.length >= 2 && (
          <aside className="hidden md:block px-6 py-10 text-xs" style={{ color: theme.mutedColor }}>
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-3">이 페이지에서</div>
            <div className="flex flex-col gap-2 pl-3" style={{ borderLeft: `2px solid ${theme.borderColor}` }}>
              {toc.map((t) => (<a key={t.id} href={`#${t.id}`} style={{ opacity: 0.8 }}>{t.text}</a>))}
            </div>
          </aside>
        )}
      </div>

      {cta && (
        <div className="md:hidden sticky-cta" role="complementary">
          <div className="text-sm font-medium" style={{ color: theme.textColor }}>{cta.phone ? `전화 ${cta.phone}` : brandName}</div>
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
            style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>{cta.label}</a>
        </div>
      )}
    </div>
  );
}
