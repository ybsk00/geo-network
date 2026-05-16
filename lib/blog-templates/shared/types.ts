// 공유 타입 정의. geo-network는 sync 스크립트로 동일 파일 복사.

export type TemplateId =
  | "clinical-docs"
  | "editorial-serif"
  | "modern-minimal"
  | "magazine-cover"
  | "bold-display"
  | "newspaper-classic"
  | "photo-journal"
  | "tech-mono"
  | "warm-lifestyle"
  | "dark-editorial";

export interface ThemeTokens {
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  primaryColor: string;
  primaryOnDark: string;
  headlineFont: string;
  bodyFont: string;
  monoFont?: string;
  layout: "single" | "with-sidebar" | "split" | "full-bleed";
  ctaStyle: "pill" | "rectangle" | "outline" | "dark-pill";
  dropCap: boolean;
  isDark: boolean;
}

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface RelatedPost {
  slug: string;
  title: string;
  category: string | null;
  publishedAt?: string | null;
  excerpt?: string | null;
}

export interface CtaInfo {
  url: string;
  label: string;
  phone?: string | null;
}

export interface BlogTemplateProps {
  title: string;
  bodyHtml: string;
  category: string | null;
  publishedAt: string;
  updatedAt?: string | null;
  brandName: string;
  reviewer?: string | null;
  homeUrl: string;
  blogUrl: string;
  toc: TocEntry[];
  showFaqSection: boolean;
  faqEntries: FaqEntry[];
  relatedPosts: RelatedPost[];
  cta: CtaInfo | null;
  theme: ThemeTokens;
}
