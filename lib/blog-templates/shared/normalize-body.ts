import { parse, type HTMLElement } from "node-html-parser";

export interface NormalizeOptions {
  allowDropCap: boolean;
}

/**
 * body_html을 디자인 템플릿용으로 구조 보존 변환.
 *
 * Trust boundary: body_html은 우리 자체 Gemini 파이프라인 출력이라 외부 user input 아님.
 * XSS sanitization 아닌 **구조 보존 transform**이 목적. 기존 class/style은 추가만 함.
 *
 * fail-open: parser가 throw하면 원본 html 그대로 반환.
 */
export function normalizeBodyHtml(html: string, opts: NormalizeOptions): string {
  if (!html) return "";

  // 1) regex 사전 패스: h1 → h2 강등 (node-html-parser tagName setter 비의존)
  //    body_html은 우리 Gemini 출력이라 nested h1 같은 invalid HTML 없음 — regex 안전.
  const preDemoted = html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2 data-was-h1="true"$1>')
    .replace(/<\/h1\s*>/gi, "</h2>");

  let root: HTMLElement;
  try {
    root = parse(preDemoted);
  } catch {
    return html;
  }

  // 2) 빈 헤딩 제거
  root.querySelectorAll("h1, h2, h3").forEach((el) => {
    if (!el.text.trim()) el.remove();
  });

  // 3) 강등된 h1 마커에 section-title 추가 + 마커 제거
  root.querySelectorAll("h2[data-was-h1]").forEach((el) => {
    addClass(el, "section-title");
    el.removeAttribute("data-was-h1");
  });

  // 4) 모든 h2 → section-title (idempotent)
  root.querySelectorAll("h2").forEach((el) => addClass(el, "section-title"));

  // 5) h3 → sub-title
  root.querySelectorAll("h3").forEach((el) => addClass(el, "sub-title"));

  // 6) blockquote → pull-quote
  root.querySelectorAll("blockquote").forEach((el) => addClass(el, "pull-quote"));

  // 7) ol에 NN단계 패턴이 있으면 step-cards
  root.querySelectorAll("ol").forEach((ol) => {
    const firstLi = ol.querySelector("li");
    if (!firstLi) return;
    const strong = firstLi.querySelector("strong");
    if (!strong) return;
    if (/^\s*\d+\s*단계/.test(strong.text)) addClass(ol, "step-cards");
  });

  // 8) 첫 p → lead (+ has-dropcap if 허용)
  const firstP = root.querySelector("p");
  if (firstP) {
    addClass(firstP, "lead");
    if (opts.allowDropCap) addClass(firstP, "has-dropcap");
  }

  return root.toString();
}

function addClass(el: HTMLElement, cls: string): void {
  const existing = el.getAttribute("class");
  if (!existing) {
    el.setAttribute("class", cls);
    return;
  }
  const tokens = existing.split(/\s+/).filter(Boolean);
  if (tokens.includes(cls)) return;
  tokens.push(cls);
  el.setAttribute("class", tokens.join(" "));
}
