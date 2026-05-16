// geo-network 버전 — dependency-free.
import { ChevronDown } from "../icons";
import type { BlogTemplateProps } from "@/lib/blog-templates/shared/types";

export function EditorialSerif(props: BlogTemplateProps) {
  const { title, bodyHtml, category, publishedAt, brandName, reviewer, homeUrl, blogUrl,
    toc, showFaqSection, faqEntries, relatedPosts, cta, theme } = props;

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
      <header className="px-6 md:px-16 py-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
        <a href={homeUrl} className="text-xl font-bold" style={{ fontFamily: theme.headlineFont }}>
          {brandName}<span style={{ color: theme.primaryColor }}>.</span>
        </a>
        {cta && (
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="hidden md:inline-block pb-1 text-sm font-semibold uppercase tracking-widest"
            style={{ borderBottom: `1px solid ${theme.textColor}`, color: theme.textColor }}>{cta.label} →</a>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-12">
        <div className="text-xs uppercase tracking-[0.18em] mb-6" style={{ color: theme.primaryColor }}>
          {category ?? "Essay"} · {new Date(publishedAt).toLocaleDateString("ko-KR", { year: "numeric" })}
        </div>
        <h1 className="leading-[1.05] mb-7 max-w-[820px]" style={{
          fontFamily: theme.headlineFont, fontSize: "clamp(2.5rem, 6vw, 4rem)",
          letterSpacing: "-0.02em", fontWeight: 500, wordBreak: "keep-all" }}>{title}</h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm pb-8"
          style={{ color: theme.mutedColor, borderBottom: `1px solid ${theme.borderColor}` }}>
          {reviewer && <span style={{ color: theme.textColor, fontWeight: 600 }}>{reviewer}</span>}
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10 lg:gap-12 mt-10">
          {toc.length >= 2 && (
            <aside className="text-xs leading-relaxed hidden lg:block" style={{ color: theme.mutedColor }}>
              <div className="uppercase tracking-[0.14em] mb-3" style={{ color: theme.textColor }}>In this issue</div>
              <div className="pt-3 flex flex-col gap-2" style={{ borderTop: `1px solid ${theme.textColor}` }}>
                {toc.map((t, i) => (
                  <a key={t.id} href={`#${t.id}`} style={{ opacity: 0.8 }}>{String(i + 1).padStart(2, "0")} — {t.text}</a>
                ))}
              </div>
            </aside>
          )}
          <div className="post-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>

        {cta && (
          <div className="mt-16 p-10 text-center" style={{ border: `1px solid ${theme.borderColor}` }}>
            <p className="text-2xl mb-5 italic" style={{ fontFamily: theme.headlineFont, color: theme.textColor }}>{brandName}</p>
            <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
              className="inline-block pb-1 font-semibold uppercase tracking-widest text-sm"
              style={{ borderBottom: `2px solid ${theme.primaryColor}`, color: theme.primaryColor }}>{cta.label} →</a>
            {cta.phone && <p className="mt-4 text-xs" style={{ color: theme.mutedColor }}>{cta.phone}</p>}
          </div>
        )}

        {showFaqSection && faqEntries.length > 0 && (
          <section className="mt-16 pt-10 faq-section" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
            <h2 className="section-title text-2xl mb-6 italic" style={{ fontFamily: theme.headlineFont }}>자주 묻는 질문</h2>
            <div className="space-y-2">
              {faqEntries.map((faq, i) => (
                <details key={i} className="group" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
                  <summary className="flex items-center justify-between cursor-pointer py-4 font-semibold" style={{ color: theme.textColor }}>
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
          <section className="mt-16 pt-10" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
            <h2 className="section-title text-2xl mb-6 italic" style={{ fontFamily: theme.headlineFont }}>관련 글</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((p) => (
                <a key={p.slug} href={`/${p.slug}`} className="block">
                  {p.category && <span className="text-xs uppercase tracking-wider" style={{ color: theme.primaryColor }}>{p.category}</span>}
                  <h3 className="mt-2 line-clamp-2 leading-snug text-lg italic"
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
          <div className="text-sm" style={{ color: theme.textColor }}>{cta.phone ? `전화 ${cta.phone}` : brandName}</div>
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="px-4 py-2 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
            style={{ borderBottom: `2px solid ${theme.primaryColor}`, color: theme.primaryColor }}>{cta.label}</a>
        </div>
      )}
    </div>
  );
}
