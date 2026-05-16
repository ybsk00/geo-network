// 10 템플릿의 기본 디자인 토큰. brand/site의 primaryColor 등은 페이지에서 오버라이드.

import type { TemplateId, ThemeTokens } from "./types.js";

const PRETENDARD = '"Pretendard", "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
const SOURCE_SERIF = '"Source Serif 4", "Noto Serif KR", Georgia, serif';
const DM_SERIF = '"DM Serif Display", "Nanum Myeongjo", serif';
const CORMORANT = '"Cormorant Garamond", "Noto Serif KR", serif';
const JETBRAINS_MONO = '"JetBrains Mono", "D2Coding", monospace';

export const TEMPLATE_TOKENS: Record<TemplateId, ThemeTokens> = {
  "clinical-docs": {
    bgColor: "#fafbfc", surfaceColor: "#ffffff", textColor: "#0f172a",
    mutedColor: "#475569", borderColor: "#e2e8f0",
    primaryColor: "#0284c7", primaryOnDark: "#ffffff",
    headlineFont: PRETENDARD, bodyFont: PRETENDARD,
    layout: "with-sidebar", ctaStyle: "rectangle", dropCap: false, isDark: false,
  },
  "editorial-serif": {
    bgColor: "#fbfaf7", surfaceColor: "#ffffff", textColor: "#1a1a1a",
    mutedColor: "#5a5648", borderColor: "#e6e2d8",
    primaryColor: "#b08a3e", primaryOnDark: "#1a1a1a",
    headlineFont: SOURCE_SERIF, bodyFont: SOURCE_SERIF,
    layout: "single", ctaStyle: "outline", dropCap: true, isDark: false,
  },
  "modern-minimal": {
    bgColor: "#ffffff", surfaceColor: "#fafafa", textColor: "#111111",
    mutedColor: "#666666", borderColor: "#e5e5e5",
    primaryColor: "#0e7490", primaryOnDark: "#ffffff",
    headlineFont: PRETENDARD, bodyFont: PRETENDARD,
    layout: "single", ctaStyle: "pill", dropCap: false, isDark: false,
  },
  "magazine-cover": {
    bgColor: "#0f0f0f", surfaceColor: "#1a1a1a", textColor: "#ffffff",
    mutedColor: "#a0a0a0", borderColor: "#2a2a2a",
    primaryColor: "#ff3b30", primaryOnDark: "#ffffff",
    headlineFont: SOURCE_SERIF, bodyFont: PRETENDARD,
    layout: "full-bleed", ctaStyle: "rectangle", dropCap: false, isDark: true,
  },
  "bold-display": {
    bgColor: "#fff8e7", surfaceColor: "#ffffff", textColor: "#1a1a1a",
    mutedColor: "#5a5648", borderColor: "#f0e6c8",
    primaryColor: "#ff6b35", primaryOnDark: "#ffffff",
    headlineFont: PRETENDARD, bodyFont: PRETENDARD,
    layout: "single", ctaStyle: "pill", dropCap: false, isDark: false,
  },
  "newspaper-classic": {
    bgColor: "#f8f6f0", surfaceColor: "#ffffff", textColor: "#1a1a1a",
    mutedColor: "#5a5648", borderColor: "#1a1a1a",
    primaryColor: "#7a2828", primaryOnDark: "#ffffff",
    headlineFont: SOURCE_SERIF, bodyFont: SOURCE_SERIF,
    layout: "single", ctaStyle: "outline", dropCap: true, isDark: false,
  },
  "photo-journal": {
    bgColor: "#fafaf8", surfaceColor: "#ffffff", textColor: "#1a1a1a",
    mutedColor: "#5a5648", borderColor: "#e6e2d8",
    primaryColor: "#3a3a3a", primaryOnDark: "#ffffff",
    headlineFont: PRETENDARD, bodyFont: PRETENDARD,
    layout: "split", ctaStyle: "rectangle", dropCap: false, isDark: false,
  },
  "tech-mono": {
    bgColor: "#0a0e1a", surfaceColor: "#111827", textColor: "#e5e7eb",
    mutedColor: "#9ca3af", borderColor: "#1f2937",
    primaryColor: "#10b981", primaryOnDark: "#0a0e1a",
    headlineFont: JETBRAINS_MONO, bodyFont: PRETENDARD, monoFont: JETBRAINS_MONO,
    layout: "single", ctaStyle: "rectangle", dropCap: false, isDark: true,
  },
  "warm-lifestyle": {
    bgColor: "#fdf6ec", surfaceColor: "#ffffff", textColor: "#3a2820",
    mutedColor: "#7a5848", borderColor: "#e6dccc",
    primaryColor: "#a05a3e", primaryOnDark: "#fdf6ec",
    headlineFont: DM_SERIF, bodyFont: PRETENDARD,
    layout: "split", ctaStyle: "pill", dropCap: false, isDark: false,
  },
  "dark-editorial": {
    bgColor: "#111110", surfaceColor: "#1a1814", textColor: "#f4f0e8",
    mutedColor: "#a09a8a", borderColor: "#2a2a28",
    primaryColor: "#c9a86a", primaryOnDark: "#111110",
    headlineFont: CORMORANT, bodyFont: PRETENDARD,
    layout: "split", ctaStyle: "outline", dropCap: false, isDark: true,
  },
};

/** site/brand의 primaryColor 등을 템플릿 토큰 위에 비파괴적으로 덮어쓴다. */
export function mergeTokens(
  base: ThemeTokens,
  override: Partial<Pick<ThemeTokens, "primaryColor" | "bgColor" | "textColor">>,
): ThemeTokens {
  return {
    ...base,
    ...(override.primaryColor ? { primaryColor: override.primaryColor } : {}),
    ...(override.bgColor ? { bgColor: override.bgColor } : {}),
    ...(override.textColor ? { textColor: override.textColor } : {}),
  };
}
