/**
 * 네트워크 사이트 카테고리별 추천 파트너 의원/브랜드 매핑.
 * footer + 홈 페이지에서 자연스러운 follow link로 노출 →
 * lumiaeo.com 서브도메인 4 brand의 외부 백링크 신호 확보 (2026-05-09).
 */

export type FeaturedPartner = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  description: string;
};

export const FEATURED_PARTNERS: Record<string, FeaturedPartner> = {
  oncare: {
    id: "oncare",
    name: "서울온케어의원",
    tagline: "남양주 통합암·자율신경 전문 의원",
    url: "https://oncare.lumiaeo.com",
    description: "통합암치료와 자율신경실조증 진료에 특화된 남양주 의원입니다.",
  },
  newyorkdental: {
    id: "newyorkdental",
    name: "뉴욕연합치과의원",
    tagline: "울산 보존치료 평생 주치의",
    url: "https://newyorkdental.lumiaeo.com",
    description: "보존치료를 우선하는 울산 남구 삼산동의 치과 의원입니다.",
  },
  emco: {
    id: "emco",
    name: "엠코소아청소년과의원",
    tagline: "상봉동 야간·주말 진료 소아과",
    url: "https://emco.lumiaeo.com",
    description: "월·화·목·금 야간 20시 + 토·일 17시 진료로 워킹맘 가족을 돕습니다.",
  },
  lumibreeze: {
    id: "lumibreeze",
    name: "루미브리즈",
    tagline: "병원·기업 GEO/AEO 마케팅",
    url: "https://lumibreeze.lumiaeo.com",
    description: "AI 검색 시대 브랜드 가시성 최적화를 돕는 GEO/AEO 마케팅 솔루션입니다.",
  },
  housemental: {
    id: "housemental",
    name: "하우스정신건강의학과의원",
    tagline: "송파구 거여동 정신건강의학과 · 화목 야간진료",
    url: "https://housemental.kr",
    description: "우울·불안·불면·성인 ADHD를 실 의학 문헌 근거로 진료하는 거여역 5번출구의 정신건강의학과입니다.",
  },
};

const HEALTH_SITES = new Set([
  "health-guide", "medical-review", "wellness-today", "doctor-choice", "health-note",
  "care-map", "medilife", "cure-story", "smart-health", "my-clinic",
  "health-pick", "medi-connect", "health-guide-kr", "korean-medical", "asia-health",
]);
const DENTAL_SITES = new Set([
  "dental-care", "smile-note", "oral-guide", "dentist-pick", "tooth-review",
]);
const BIZ_SITES = new Set([
  "tech-insight", "biz-growth", "ai-daily", "digital-signal", "startup-lens",
  "work-smart", "brand-story", "future-biz", "ai-biz-review", "growth-lab",
]);

/** 사이트 카테고리에 맞는 추천 파트너 1-2개 반환. 루트 도메인은 4개 모두. */
export function getFeaturedForSite(siteId: string): FeaturedPartner[] {
  if (DENTAL_SITES.has(siteId)) return [FEATURED_PARTNERS.newyorkdental];
  if (HEALTH_SITES.has(siteId)) return [FEATURED_PARTNERS.oncare, FEATURED_PARTNERS.emco];
  if (BIZ_SITES.has(siteId)) return [FEATURED_PARTNERS.lumibreeze];
  return [];
}

/** 루트 포털용 — 전 파트너 (위성에는 노출하지 않음: getFeaturedForSite 미참조) */
export const ALL_PARTNERS: FeaturedPartner[] = [
  FEATURED_PARTNERS.oncare,
  FEATURED_PARTNERS.newyorkdental,
  FEATURED_PARTNERS.emco,
  FEATURED_PARTNERS.lumibreeze,
  FEATURED_PARTNERS.housemental,
];
