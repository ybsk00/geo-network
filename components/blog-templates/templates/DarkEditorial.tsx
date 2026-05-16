// geo-network 버전 — dependency-free.
import { ArrowRight, ChevronDown } from "../icons";
import type { BlogTemplateProps } from "@/lib/blog-templates/shared/types";

export function DarkEditorial(props: BlogTemplateProps) {
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
      <header className="px-6 md:px-14 py-5 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.borderColor}`, background: theme.bgColor }}>
        <a href={homeUrl} className="text-xl italic tracking-tight" style={{ color: theme.textColor, fontFamily: theme.headlineFont }}>
          {brandName} <span style={{ color: theme.primaryColor }}>·</span>
        </a>
        {cta && (
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold tracking-wider uppercase"
            style={{ border: `1px solid ${theme.primaryColor}`, color: theme.primaryColor, background: "transparent" }}>
            {cta.label}<ArrowRight width={14} height={14} />
          </a>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
        <main className="px-6 md:px-14 py-12 md:py-16">
          <div className="text-xs uppercase tracking-[0.22em] mb-6" style={{ color: theme.primaryColor }}>
            {category ?? "Review"} · {new Date(publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}
          </div>

          <h1 className="leading-[1.05] mb-7 italic" style={{
            fontFamily: theme.headlineFont, fontSize: "clamp(2.25rem, 5.5vw, 4rem)",
            letterSpacing: "-0.02em", fontWeight: 400, wordBreak: "keep-all" }}>{title}</h1>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-wider mb-10" style={{ color: theme.mutedColor }}>
            {reviewer && <span style={{ color: theme.textColor }}><b>{reviewer}</b></span>}
            <time dateTime={publishedAt}>{new Date(publishedAt).toLocaleDateString("ko-KR")}</time>
            {updatedAt && updatedAt !== publishedAt && <span>Updated {new Date(updatedAt).toLocaleDateString("ko-KR")}</span>}
          </div>

          <div className="pt-7" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
            <div className="post-body" style={{ color: theme.textColor }} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </div>

          {cta && (
            <div className="mt-16 p-8 md:p-12 text-center"
              style={{ border: `1px solid ${theme.primaryColor}`, background: `${theme.primaryColor}0a` }}>
              <p className="text-2xl md:text-3xl italic mb-5"
                style={{ fontFamily: theme.headlineFont, color: theme.textColor, wordBreak: "keep-all" }}>{brandName}</p>
              <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
                className="inline-flex items-center gap-2 px-8 py-3 font-semibold tracking-wider uppercase text-sm"
                style={{ background: theme.primaryColor, color: theme.primaryOnDark }}>
                {cta.label}<ArrowRight width={18} height={18} />
              </a>
              {cta.phone && <p className="mt-4 text-xs uppercase tracking-wider" style={{ color: theme.mutedColor }}>{cta.phone}</p>}
            </div>
          )}

          {showFaqSection && faqEntries.length > 0 && (
            <section className="mt-16 pt-10 faq-section" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
              <h2 className="section-title text-2xl italic mb-6" style={{ fontFamily: theme.headlineFont, color: theme.textColor }}>자주 묻는 질문</h2>
              <div className="space-y-2">
                {faqEntries.map((faq, i) => (
                  <details key={i} className="group" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
                    <summary className="flex items-center justify-between cursor-pointer py-4 font-medium" style={{ color: theme.textColor }}>
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
              <h2 className="section-title text-2xl italic mb-6" style={{ fontFamily: theme.headlineFont, color: theme.textColor }}>관련 글</h2>
              <div className="space-y-4">
                {relatedPosts.map((p) => (
                  <a key={p.slug} href={`/${p.slug}`} className="block py-3 transition-opacity hover:opacity-80">
                    {p.category && <span className="text-xs uppercase tracking-wider mr-2" style={{ color: theme.primaryColor }}>{p.category}</span>}
                    <h3 className="italic mt-1 line-clamp-2 leading-snug text-lg"
                      style={{ color: theme.textColor, fontFamily: theme.headlineFont, wordBreak: "keep-all" }}>{p.title}</h3>
                    {p.excerpt && <p className="mt-1 text-sm line-clamp-1" style={{ color: theme.mutedColor }}>{p.excerpt}</p>}
                  </a>
                ))}
              </div>
            </section>
          )}

          {cta && <div className="md:hidden sticky-cta-spacer" aria-hidden />}
        </main>

        <aside className="hidden lg:block relative" style={{
          background: `linear-gradient(180deg, ${theme.surfaceColor} 0%, ${theme.bgColor} 100%)`,
          backgroundImage: `repeating-linear-gradient(90deg, ${theme.primaryColor}11 0 2px, transparent 2px 24px), linear-gradient(180deg, ${theme.surfaceColor} 0%, ${theme.bgColor} 100%)`,
          minHeight: "100vh" }}>
          <div className="absolute top-12 right-12 text-xs uppercase tracking-[0.18em]" style={{ color: theme.mutedColor }}>
            Vol. {new Date(publishedAt).getFullYear()}
          </div>
          <div className="absolute bottom-12 right-12 italic"
            style={{ color: theme.primaryColor, fontFamily: theme.headlineFont, fontSize: "1.125rem" }}>“{brandName}”</div>
        </aside>
      </div>

      {cta && (
        <div className="md:hidden sticky-cta" role="complementary" style={{ background: theme.surfaceColor }}>
          <div className="text-sm font-medium" style={{ color: theme.textColor }}>{cta.phone ?? brandName}</div>
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
            style={{ border: `1px solid ${theme.primaryColor}`, color: theme.primaryColor }}>{cta.label}</a>
        </div>
      )}
    </div>
  );
}
