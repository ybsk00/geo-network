// geo-network 버전 — dependency-free.
import { ArrowRight, ChevronDown } from "../icons";
import type { BlogTemplateProps } from "@/lib/blog-templates/shared/types";

export function MagazineCover(props: BlogTemplateProps) {
  const { title, bodyHtml, category, publishedAt, brandName, reviewer, homeUrl, blogUrl,
    showFaqSection, faqEntries, relatedPosts, cta, theme } = props;

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
      <section className="relative px-6 md:px-16 py-20 md:py-32" style={{
        background: `linear-gradient(135deg, ${theme.bgColor}, ${theme.surfaceColor})`,
        backgroundImage: `radial-gradient(circle at 80% 20%, ${theme.primaryColor}33, transparent 60%), linear-gradient(135deg, ${theme.bgColor}, ${theme.surfaceColor})`,
      }}>
        <header className="flex items-center justify-between mb-16">
          <a href={homeUrl} className="text-sm uppercase tracking-[0.18em]" style={{ color: theme.textColor }}>{brandName}</a>
          {cta && (
            <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold uppercase tracking-wider"
              style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>
              {cta.label}<ArrowRight width={14} height={14} />
            </a>
          )}
        </header>

        <div className="text-xs uppercase tracking-[0.22em] mb-6" style={{ color: theme.primaryColor }}>{category ?? "Cover Story"}</div>
        <h1 className="leading-[0.95] mb-8 max-w-[1100px]" style={{
          fontFamily: theme.headlineFont, fontSize: "clamp(2.75rem, 8vw, 6rem)",
          letterSpacing: "-0.03em", fontWeight: 700, wordBreak: "keep-all" }}>{title}</h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs uppercase tracking-wider" style={{ color: theme.mutedColor }}>
          {reviewer && <span style={{ color: theme.textColor }}>{reviewer}</span>}
          <time dateTime={publishedAt}>{new Date(publishedAt).toLocaleDateString("ko-KR")}</time>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <nav className="flex gap-2 text-xs mb-8" style={{ color: theme.mutedColor }} aria-label="Breadcrumb">
          <a href={homeUrl}>홈</a><span>›</span><a href={blogUrl}>블로그</a>
          {category && (<><span>›</span><span>{category}</span></>)}
        </nav>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {cta && (
          <div className="mt-16 p-10 text-center" style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>
            <p className="text-3xl font-bold mb-5" style={{ fontFamily: theme.headlineFont, wordBreak: "keep-all" }}>{brandName}</p>
            <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-wider text-sm"
              style={{ background: theme.primaryOnDark, color: theme.primaryColor }}>
              {cta.label}<ArrowRight width={18} height={18} />
            </a>
            {cta.phone && <p className="mt-4 text-xs opacity-95">{cta.phone}</p>}
          </div>
        )}

        {showFaqSection && faqEntries.length > 0 && (
          <section className="mt-16 pt-10 faq-section" style={{ borderTop: `2px solid ${theme.primaryColor}` }}>
            <h2 className="section-title text-2xl font-bold mb-6" style={{ fontFamily: theme.headlineFont }}>자주 묻는 질문</h2>
            <div className="space-y-3">
              {faqEntries.map((faq, i) => (
                <details key={i} className="group rounded-lg overflow-hidden" style={{ background: theme.surfaceColor }}>
                  <summary className="flex items-center justify-between cursor-pointer p-5 font-bold" style={{ color: theme.textColor }}>
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
                <a key={p.slug} href={`/${p.slug}`} className="block p-5 rounded-lg" style={{ background: theme.surfaceColor }}>
                  {p.category && <span className="text-xs uppercase tracking-wider" style={{ color: theme.primaryColor }}>{p.category}</span>}
                  <h3 className="mt-2 line-clamp-2 leading-snug font-bold"
                    style={{ fontFamily: theme.headlineFont, color: theme.textColor, wordBreak: "keep-all" }}>{p.title}</h3>
                </a>
              ))}
            </div>
          </section>
        )}

        {cta && <div className="md:hidden sticky-cta-spacer" aria-hidden />}
      </main>

      {cta && (
        <div className="md:hidden sticky-cta" role="complementary" style={{ background: theme.surfaceColor }}>
          <div className="text-sm font-bold" style={{ color: theme.textColor }}>{cta.phone ?? brandName}</div>
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
            style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>{cta.label}</a>
        </div>
      )}
    </div>
  );
}
