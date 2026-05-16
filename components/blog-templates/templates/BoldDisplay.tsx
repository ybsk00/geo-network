// geo-network 버전 — dependency-free.
import { ArrowRight, ChevronDown } from "../icons";
import type { BlogTemplateProps } from "@/lib/blog-templates/shared/types";

export function BoldDisplay(props: BlogTemplateProps) {
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
      <section className="px-6 md:px-16 py-16 md:py-24" style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>
        <header className="flex items-center justify-between mb-12">
          <a href={homeUrl} className="text-base font-bold" style={{ color: theme.primaryOnDark }}>{brandName}</a>
          {cta && (
            <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold"
              style={{ background: theme.primaryOnDark, color: theme.primaryColor }}>
              {cta.label}<ArrowRight width={14} height={14} />
            </a>
          )}
        </header>

        <div className="text-xs uppercase tracking-[0.18em] mb-6 opacity-90">{category ?? "Feature"}</div>
        <h1 className="leading-[1.02] max-w-[1000px]" style={{
          fontFamily: theme.headlineFont, fontSize: "clamp(2.5rem, 7vw, 5rem)",
          letterSpacing: "-0.025em", fontWeight: 800, wordBreak: "keep-all" }}>{title}</h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-8 text-sm opacity-90">
          {reviewer && <span><b>{reviewer}</b></span>}
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <nav className="flex gap-2 text-xs mb-8" style={{ color: theme.mutedColor }} aria-label="Breadcrumb">
          <a href={homeUrl}>홈</a><span>›</span><a href={blogUrl}>블로그</a>
          {category && (<><span>›</span><span>{category}</span></>)}
        </nav>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {cta && (
          <div className="mt-16 p-10 rounded-3xl text-center" style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>
            <p className="text-3xl font-extrabold mb-5" style={{ fontFamily: theme.headlineFont, wordBreak: "keep-all" }}>{brandName}</p>
            <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold"
              style={{ background: theme.primaryOnDark, color: theme.primaryColor }}>
              {cta.label}<ArrowRight width={20} height={20} />
            </a>
            {cta.phone && <p className="mt-4 text-sm opacity-95">{cta.phone}</p>}
          </div>
        )}

        {showFaqSection && faqEntries.length > 0 && (
          <section className="mt-16 pt-10 faq-section">
            <h2 className="section-title text-3xl font-extrabold mb-6" style={{ fontFamily: theme.headlineFont }}>자주 묻는 질문</h2>
            <div className="space-y-3">
              {faqEntries.map((faq, i) => (
                <details key={i} className="group rounded-2xl overflow-hidden"
                  style={{ background: theme.surfaceColor, border: `1px solid ${theme.borderColor}` }}>
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
            <h2 className="section-title text-3xl font-extrabold mb-6" style={{ fontFamily: theme.headlineFont }}>관련 글</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((p) => (
                <a key={p.slug} href={`/${p.slug}`} className="rounded-2xl p-5 block"
                  style={{ background: theme.surfaceColor, border: `1px solid ${theme.borderColor}` }}>
                  {p.category && <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>{p.category}</span>}
                  <h3 className="mt-2 line-clamp-2 leading-snug font-extrabold"
                    style={{ fontFamily: theme.headlineFont, color: theme.textColor, wordBreak: "keep-all" }}>{p.title}</h3>
                </a>
              ))}
            </div>
          </section>
        )}

        {cta && <div className="md:hidden sticky-cta-spacer" aria-hidden />}
      </main>

      {cta && (
        <div className="md:hidden sticky-cta" role="complementary">
          <div className="text-sm font-bold" style={{ color: theme.textColor }}>{cta.phone ?? brandName}</div>
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap"
            style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>{cta.label}</a>
        </div>
      )}
    </div>
  );
}
