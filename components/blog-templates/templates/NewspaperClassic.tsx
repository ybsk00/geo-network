// geo-network 버전 — dependency-free.
import { ChevronDown } from "../icons";
import type { BlogTemplateProps } from "@/lib/blog-templates/shared/types";

export function NewspaperClassic(props: BlogTemplateProps) {
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
      <header className="px-6 md:px-16 pt-8 pb-3 text-center" style={{ borderBottom: `2px solid ${theme.textColor}` }}>
        <a href={homeUrl} className="text-2xl uppercase tracking-[0.18em] font-bold"
          style={{ fontFamily: theme.headlineFont, color: theme.textColor }}>{brandName}</a>
        <div className="mt-2 text-xs uppercase tracking-widest" style={{ color: theme.mutedColor }}>
          {new Date(publishedAt).toLocaleDateString("ko-KR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10 pt-12 pb-16">
        <div className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: theme.primaryColor }}>
          {category ?? "Feature"} · Edition {new Date(publishedAt).getFullYear()}
        </div>
        <h1 className="text-center leading-tight max-w-4xl mx-auto mb-6" style={{
          fontFamily: theme.headlineFont, fontSize: "clamp(2.25rem, 6vw, 4rem)",
          letterSpacing: "-0.02em", fontWeight: 700, wordBreak: "keep-all" }}>{title}</h1>
        <div className="text-center text-sm mb-10 pb-4"
          style={{ color: theme.mutedColor, borderBottom: `1px solid ${theme.textColor}` }}>
          {reviewer && <span style={{ color: theme.textColor }}><b>{reviewer}</b> · </span>}
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </div>

        <div className="post-body md:[column-count:2] md:[column-gap:2.5rem]" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {cta && (
          <div className="mt-16 p-8 text-center" style={{ border: `2px solid ${theme.textColor}` }}>
            <p className="text-2xl mb-4 font-bold" style={{ fontFamily: theme.headlineFont, wordBreak: "keep-all" }}>{brandName}</p>
            <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
              className="inline-block px-8 py-3 font-bold uppercase tracking-wider text-sm"
              style={{ background: theme.textColor, color: theme.bgColor }}>{cta.label}</a>
            {cta.phone && <p className="mt-3 text-xs" style={{ color: theme.mutedColor }}>{cta.phone}</p>}
          </div>
        )}

        {showFaqSection && faqEntries.length > 0 && (
          <section className="mt-16 pt-8 faq-section" style={{ borderTop: `2px solid ${theme.textColor}` }}>
            <h2 className="section-title text-2xl font-bold mb-6 text-center" style={{ fontFamily: theme.headlineFont }}>자주 묻는 질문</h2>
            <div className="space-y-2">
              {faqEntries.map((faq, i) => (
                <details key={i} className="group" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
                  <summary className="flex items-center justify-between cursor-pointer py-4 font-bold" style={{ color: theme.textColor }}>
                    <span>{faq.question}</span>
                    <ChevronDown width={20} height={20} className="group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pb-4 leading-relaxed" style={{ color: theme.mutedColor }}>{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
            <h2 className="section-title text-2xl font-bold mb-6 text-center" style={{ fontFamily: theme.headlineFont }}>관련 기사</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((p) => (
                <a key={p.slug} href={`/${p.slug}`} className="block pb-4" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
                  {p.category && <span className="text-xs uppercase tracking-widest" style={{ color: theme.primaryColor }}>{p.category}</span>}
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
        <div className="md:hidden sticky-cta" role="complementary">
          <div className="text-sm font-bold" style={{ color: theme.textColor }}>{cta.phone ?? brandName}</div>
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
            style={{ background: theme.textColor, color: theme.bgColor }}>{cta.label}</a>
        </div>
      )}
    </div>
  );
}
