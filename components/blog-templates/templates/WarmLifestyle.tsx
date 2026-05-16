// geo-network 버전 — dependency-free.
import { ArrowRight, ChevronDown } from "../icons";
import type { BlogTemplateProps } from "@/lib/blog-templates/shared/types";

export function WarmLifestyle(props: BlogTemplateProps) {
  const { title, bodyHtml, category, publishedAt, updatedAt, brandName, reviewer,
    homeUrl, blogUrl, showFaqSection, faqEntries, relatedPosts, cta, theme } = props;

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
      <header className="px-6 md:px-12 py-5 flex items-center justify-between" style={{ background: theme.bgColor }}>
        <a href={homeUrl} className="flex items-center gap-2.5" style={{ color: theme.textColor }}>
          <span className="inline-block w-7 h-7 rounded-full"
            style={{ background: `linear-gradient(135deg, ${theme.primaryColor}99, ${theme.primaryColor})` }} />
          <span className="text-lg" style={{ fontFamily: theme.headlineFont, color: theme.primaryColor }}>{brandName}</span>
        </a>
        {cta && (
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium"
            style={{ background: theme.textColor, color: theme.bgColor }}>
            {cta.label}<ArrowRight width={16} height={16} />
          </a>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-6 md:px-10 py-10 md:py-16">
        <div className="rounded-3xl p-7 md:p-12 mb-10"
          style={{ background: theme.surfaceColor, boxShadow: "0 4px 24px rgba(58, 40, 32, 0.06)" }}>
          <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-4" style={{ color: theme.primaryColor }}>
            <span className="w-6 h-px" style={{ background: theme.primaryColor }} />
            {category ?? "오늘의 이야기"}
          </div>
          <h1 className="font-normal leading-tight mb-4" style={{
            fontFamily: theme.headlineFont, fontSize: "clamp(2rem, 5vw, 3.25rem)",
            letterSpacing: "-0.015em", wordBreak: "keep-all", color: theme.textColor }}>{title}</h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm mt-5" style={{ color: theme.mutedColor }}>
            {reviewer && <><span style={{ color: theme.textColor }}><b>{reviewer}</b></span><span>·</span></>}
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            {updatedAt && updatedAt !== publishedAt && (
              <><span>·</span><span>업데이트 {new Date(updatedAt).toLocaleDateString("ko-KR")}</span></>
            )}
          </div>
        </div>

        <nav className="flex gap-2 text-xs mb-6" style={{ color: theme.mutedColor }} aria-label="Breadcrumb">
          <a href={homeUrl}>홈</a><span>›</span><a href={blogUrl}>블로그</a>
          {category && (<><span>›</span><span>{category}</span></>)}
        </nav>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {cta && (
          <div className="mt-16 p-8 md:p-12 rounded-3xl text-center" style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}dd)`,
            color: theme.primaryOnDark, boxShadow: "0 12px 32px rgba(58, 40, 32, 0.12)" }}>
            <p className="text-2xl md:text-3xl mb-4 font-normal" style={{ fontFamily: theme.headlineFont, wordBreak: "keep-all" }}>
              {brandName}에서 만나요
            </p>
            <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold"
              style={{ background: theme.bgColor, color: theme.primaryColor }}>
              {cta.label}<ArrowRight width={20} height={20} />
            </a>
            {cta.phone && <p className="mt-4 text-sm opacity-95">전화: {cta.phone}</p>}
          </div>
        )}

        {showFaqSection && faqEntries.length > 0 && (
          <section className="mt-16 pt-10 faq-section">
            <h2 className="section-title text-2xl font-normal mb-6" style={{ fontFamily: theme.headlineFont }}>자주 묻는 질문</h2>
            <div className="space-y-3">
              {faqEntries.map((faq, i) => (
                <details key={i} className="group rounded-2xl overflow-hidden"
                  style={{ background: theme.surfaceColor, boxShadow: "0 2px 12px rgba(58, 40, 32, 0.04)" }}>
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
            <h2 className="section-title text-2xl font-normal mb-6" style={{ fontFamily: theme.headlineFont }}>관련 이야기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map((p) => (
                <a key={p.slug} href={`/${p.slug}`} className="rounded-2xl p-5 transition-all block"
                  style={{ background: theme.surfaceColor, boxShadow: "0 2px 12px rgba(58, 40, 32, 0.04)" }}>
                  {p.category && <span className="text-xs uppercase tracking-wider" style={{ color: theme.primaryColor }}>{p.category}</span>}
                  <h3 className="font-medium mt-2 line-clamp-2 leading-snug"
                    style={{ color: theme.textColor, fontFamily: theme.headlineFont, wordBreak: "keep-all" }}>{p.title}</h3>
                  {p.excerpt && <p className="mt-2 text-sm line-clamp-1" style={{ color: theme.mutedColor }}>{p.excerpt}</p>}
                </a>
              ))}
            </div>
          </section>
        )}

        {cta && <div className="md:hidden sticky-cta-spacer" aria-hidden />}
      </main>

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
