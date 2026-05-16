// geo-network 버전 — dependency-free.
import { ArrowRight, ChevronDown } from "../icons";
import type { BlogTemplateProps } from "@/lib/blog-templates/shared/types";

export function PhotoJournal(props: BlogTemplateProps) {
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
      <header className="px-6 md:px-14 py-5 flex items-center justify-between">
        <a href={homeUrl} className="text-base font-semibold" style={{ color: theme.textColor }}>{brandName}</a>
        {cta && (
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium"
            style={{ background: theme.textColor, color: theme.bgColor }}>
            {cta.label}<ArrowRight width={14} height={14} />
          </a>
        )}
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 px-6 md:px-14 py-10 lg:py-16">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] mb-5" style={{ color: theme.primaryColor }}>{category ?? "Story"}</div>
          <h1 className="leading-tight mb-6" style={{
            fontFamily: theme.headlineFont, fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "-0.02em", fontWeight: 700, wordBreak: "keep-all" }}>{title}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm pb-5 mb-8"
            style={{ color: theme.mutedColor, borderBottom: `1px solid ${theme.borderColor}` }}>
            {reviewer && <span style={{ color: theme.textColor }}><b>{reviewer}</b></span>}
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </div>
          <div className="post-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>

        <aside className="lg:sticky lg:top-12 lg:self-start">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden relative" style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}cc, ${theme.primaryColor}55, ${theme.surfaceColor})`,
            boxShadow: "0 24px 48px rgba(0,0,0,0.12)" }}>
            <div className="absolute inset-0" style={{
              backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 3px, transparent 3px 22px)" }} />
            <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.12em] text-white/85">
              {brandName} — {new Date(publishedAt).getFullYear()}
            </div>
          </div>
        </aside>
      </main>

      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-16">
        {cta && (
          <div className="mt-8 p-8 md:p-10 rounded-2xl text-center"
            style={{ background: theme.surfaceColor, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <p className="text-2xl font-bold mb-4" style={{ fontFamily: theme.headlineFont, color: theme.textColor, wordBreak: "keep-all" }}>
              {brandName}
            </p>
            <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
              className="inline-flex items-center gap-2 px-7 py-3 font-medium"
              style={{ background: theme.textColor, color: theme.bgColor }}>
              {cta.label}<ArrowRight width={18} height={18} />
            </a>
            {cta.phone && <p className="mt-3 text-xs" style={{ color: theme.mutedColor }}>{cta.phone}</p>}
          </div>
        )}

        {showFaqSection && faqEntries.length > 0 && (
          <section className="mt-12 pt-8 faq-section" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
            <h2 className="section-title text-2xl font-bold mb-6" style={{ fontFamily: theme.headlineFont }}>자주 묻는 질문</h2>
            <div className="space-y-3">
              {faqEntries.map((faq, i) => (
                <details key={i} className="group rounded-xl overflow-hidden"
                  style={{ background: theme.surfaceColor, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
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
          <section className="mt-12 pt-8" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
            <h2 className="section-title text-2xl font-bold mb-6" style={{ fontFamily: theme.headlineFont }}>관련 글</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((p) => (
                <a key={p.slug} href={`/${p.slug}`} className="rounded-xl p-5 block"
                  style={{ background: theme.surfaceColor, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  {p.category && <span className="text-xs uppercase tracking-wider" style={{ color: theme.primaryColor }}>{p.category}</span>}
                  <h3 className="mt-2 line-clamp-2 leading-snug font-semibold"
                    style={{ fontFamily: theme.headlineFont, color: theme.textColor, wordBreak: "keep-all" }}>{p.title}</h3>
                </a>
              ))}
            </div>
          </section>
        )}

        {cta && <div className="md:hidden sticky-cta-spacer" aria-hidden />}
      </section>

      {cta && (
        <div className="md:hidden sticky-cta" role="complementary">
          <div className="text-sm font-medium" style={{ color: theme.textColor }}>{cta.phone ?? brandName}</div>
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="px-4 py-2 text-sm font-medium whitespace-nowrap"
            style={{ background: theme.textColor, color: theme.bgColor }}>{cta.label}</a>
        </div>
      )}
    </div>
  );
}
