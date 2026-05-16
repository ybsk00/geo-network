// geo-network 버전 — dependency-free.
import { ChevronDown } from "../icons";
import type { BlogTemplateProps } from "@/lib/blog-templates/shared/types";

export function TechMono(props: BlogTemplateProps) {
  const { title, bodyHtml, category, publishedAt, brandName, reviewer, homeUrl, blogUrl,
    showFaqSection, faqEntries, relatedPosts, cta, theme } = props;

  const monoFont = theme.monoFont ?? theme.headlineFont;

  const cssVars: React.CSSProperties = {
    ["--blog-template-primary" as string]: theme.primaryColor,
    ["--blog-template-surface" as string]: theme.surfaceColor,
    ["--blog-template-border" as string]: theme.borderColor,
    ["--blog-template-muted" as string]: theme.mutedColor,
    ["--blog-template-headline-font" as string]: theme.headlineFont,
    ["--blog-template-mono" as string]: monoFont,
    backgroundColor: theme.bgColor, color: theme.textColor, fontFamily: theme.bodyFont, minHeight: "100vh",
  };

  return (
    <div className="blog-template" style={cssVars}>
      <header className="px-6 md:px-14 py-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
        <a href={homeUrl} className="text-sm font-bold" style={{ fontFamily: monoFont, color: theme.textColor }}>
          {">"} {brandName}
        </a>
        {cta && (
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold"
            style={{ fontFamily: monoFont, background: theme.primaryColor, color: theme.primaryOnDark }}>
            $ {cta.label}
          </a>
        )}
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10 lg:gap-14 px-6 md:px-14 py-12">
        <aside className="text-xs leading-relaxed hidden lg:block" style={{ color: theme.mutedColor, fontFamily: monoFont }}>
          <div className="space-y-1">
            <div><span style={{ color: theme.primaryColor }}>$</span> category</div>
            <div className="pl-3" style={{ color: theme.textColor }}>{category ?? "—"}</div>
            <div className="mt-3"><span style={{ color: theme.primaryColor }}>$</span> date</div>
            <div className="pl-3" style={{ color: theme.textColor }}>{new Date(publishedAt).toISOString().slice(0, 10)}</div>
            {reviewer && (<>
              <div className="mt-3"><span style={{ color: theme.primaryColor }}>$</span> author</div>
              <div className="pl-3" style={{ color: theme.textColor }}>{reviewer}</div>
            </>)}
          </div>
        </aside>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] mb-5" style={{ color: theme.primaryColor, fontFamily: monoFont }}>
            // {category ?? "Post"}
          </div>
          <h1 className="leading-tight mb-6" style={{
            fontFamily: monoFont, fontSize: "clamp(1.875rem, 4.5vw, 3rem)",
            letterSpacing: "-0.01em", fontWeight: 700, wordBreak: "keep-all" }}>{title}</h1>

          <div className="post-body" style={{ color: theme.textColor }} dangerouslySetInnerHTML={{ __html: bodyHtml }} />

          {cta && (
            <div className="mt-16 p-8 rounded-md" style={{ background: theme.surfaceColor, border: `1px solid ${theme.borderColor}` }}>
              <div className="text-xs mb-3" style={{ fontFamily: monoFont, color: theme.primaryColor }}>$ ./contact.sh</div>
              <p className="text-xl font-bold mb-5" style={{ fontFamily: monoFont, color: theme.textColor, wordBreak: "keep-all" }}>
                {brandName}
              </p>
              <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
                className="inline-flex items-center gap-2 px-5 py-2 font-bold text-sm"
                style={{ fontFamily: monoFont, background: theme.primaryColor, color: theme.primaryOnDark }}>
                {">"} {cta.label}
              </a>
              {cta.phone && <p className="mt-3 text-xs" style={{ fontFamily: monoFont, color: theme.mutedColor }}>$ tel {cta.phone}</p>}
            </div>
          )}

          {showFaqSection && faqEntries.length > 0 && (
            <section className="mt-16 pt-8 faq-section" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
              <h2 className="section-title text-xl font-bold mb-6" style={{ fontFamily: monoFont, color: theme.textColor }}>// FAQ</h2>
              <div className="space-y-2">
                {faqEntries.map((faq, i) => (
                  <details key={i} className="group" style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
                    <summary className="flex items-center justify-between cursor-pointer py-3 font-medium" style={{ color: theme.textColor }}>
                      <span><span style={{ color: theme.primaryColor, fontFamily: monoFont }}>Q:</span> {faq.question}</span>
                      <ChevronDown width={18} height={18} className="group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="pb-3 leading-relaxed" style={{ color: theme.mutedColor }}>
                      <span style={{ color: theme.primaryColor, fontFamily: monoFont }}>A:</span> {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-8" style={{ borderTop: `1px solid ${theme.borderColor}` }}>
              <h2 className="section-title text-xl font-bold mb-6" style={{ fontFamily: monoFont, color: theme.textColor }}>// related</h2>
              <div className="space-y-3">
                {relatedPosts.map((p) => (
                  <a key={p.slug} href={`/${p.slug}`} className="block py-2">
                    <span className="text-xs" style={{ fontFamily: monoFont, color: theme.primaryColor }}>{p.category ?? "post"}/</span>
                    <span className="ml-2" style={{ color: theme.textColor, wordBreak: "keep-all" }}>{p.title}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {cta && <div className="md:hidden sticky-cta-spacer" aria-hidden />}
        </div>
      </main>

      {cta && (
        <div className="md:hidden sticky-cta" role="complementary" style={{ background: theme.surfaceColor }}>
          <div className="text-xs" style={{ fontFamily: monoFont, color: theme.textColor }}>{cta.phone ?? brandName}</div>
          <a href={cta.url} target="_blank" rel="noopener noreferrer" data-verify="cta"
            className="px-4 py-2 text-xs font-bold whitespace-nowrap"
            style={{ fontFamily: monoFont, background: theme.primaryColor, color: theme.primaryOnDark }}>{cta.label}</a>
        </div>
      )}
    </div>
  );
}
