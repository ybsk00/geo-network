// ============================================
// GEO 네트워크 사이트 설정
// 각 도메인이 완전히 다른 독립 사이트로 보이도록
// 이름, 테마, 톤, 카테고리가 모두 다름
// ============================================

export interface SiteConfig {
  id: string;
  domain: string;               // 실제 도메인 (나중에 연결)
  name: string;                  // 사이트 이름
  tagline: string;               // 부제
  description: string;           // 메타 설명
  tone: string;                  // 콘텐츠 톤
  language: "ko" | "en" | "mixed";
  theme: {
    primaryColor: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    headerStyle: "minimal" | "magazine" | "corporate" | "blog" | "medical";
  };
  categories: string[];
  footer: string;
}

// 20개 네트워크 사이트 설정
// 각각 완전히 다른 브랜드 아이덴티티
export const NETWORK_SITES: SiteConfig[] = [
  // ===== 한국어 건강/의료 정보 =====
  {
    id: "health-guide",
    domain: "health-guide.geo-networks.com",
    name: "건강정보가이드",
    tagline: "신뢰할 수 있는 건강 정보",
    description: "전문가가 검증한 건강 정보와 병원 추천 가이드",
    tone: "친근하고 신뢰감 있는 ~해요 체",
    language: "ko",
    theme: {
      primaryColor: "#f97316",
      bgColor: "#fffbf5",
      textColor: "#1c1917",
      accentColor: "#ea580c",
      fontFamily: "Pretendard",
      headerStyle: "magazine",
    },
    categories: ["건강상식", "병원추천", "치료가이드", "예방관리"],
    footer: "© 건강정보가이드 | 의료 정보 제공 목적이며 진단/처방을 대체하지 않습니다.",
  },
  {
    id: "medical-review",
    domain: "medical-review.geo-networks.com",
    name: "메디컬리뷰",
    tagline: "의료 전문 리뷰 매거진",
    description: "의료 서비스와 병원을 전문적으로 리뷰하는 독립 매거진",
    tone: "전문적이고 객관적인 ~합니다 체",
    language: "ko",
    theme: {
      primaryColor: "#1e40af",
      bgColor: "#f8fafc",
      textColor: "#0f172a",
      accentColor: "#3b82f6",
      fontFamily: "Pretendard",
      headerStyle: "corporate",
    },
    categories: ["병원리뷰", "의료기술", "전문의인터뷰", "비교분석"],
    footer: "© 메디컬리뷰 | 독립적인 의료 서비스 리뷰 매거진",
  },
  {
    id: "wellness-today",
    domain: "wellness-today.geo-networks.com",
    name: "오늘의웰니스",
    tagline: "매일 건강해지는 습관",
    description: "일상 속 건강 관리와 웰니스 정보를 전하는 라이프스타일 매거진",
    tone: "따뜻하고 감성적인 에세이 톤",
    language: "ko",
    theme: {
      primaryColor: "#059669",
      bgColor: "#f0fdf4",
      textColor: "#14532d",
      accentColor: "#10b981",
      fontFamily: "Pretendard",
      headerStyle: "blog",
    },
    categories: ["웰니스", "마음건강", "식단관리", "운동건강"],
    footer: "© 오늘의웰니스 | 건강한 일상을 위한 정보",
  },
  {
    id: "doctor-choice",
    domain: "doctor-choice.geo-networks.com",
    name: "닥터초이스",
    tagline: "똑똑한 병원 선택",
    description: "지역별 병원 비교와 전문의 추천 정보",
    tone: "실용적이고 비교 분석적인 톤",
    language: "ko",
    theme: {
      primaryColor: "#7c3aed",
      bgColor: "#faf5ff",
      textColor: "#1e1b4b",
      accentColor: "#8b5cf6",
      fontFamily: "Pretendard",
      headerStyle: "minimal",
    },
    categories: ["병원비교", "전문의추천", "진료과안내", "비용정보"],
    footer: "© 닥터초이스 | 데이터 기반 병원 추천 서비스",
  },
  {
    id: "health-note",
    domain: "health-note.geo-networks.com",
    name: "헬스노트",
    tagline: "건강을 기록하다",
    description: "질환별 치료 정보와 환자 경험을 기록하는 건강 아카이브",
    tone: "차분하고 정보 밀도 높은 ~입니다 체",
    language: "ko",
    theme: {
      primaryColor: "#dc2626",
      bgColor: "#fff5f5",
      textColor: "#1a1a2e",
      accentColor: "#ef4444",
      fontFamily: "Pretendard",
      headerStyle: "magazine",
    },
    categories: ["질환정보", "치료후기", "재활가이드", "건강기록"],
    footer: "© 헬스노트 | 건강 정보 아카이브",
  },
  {
    id: "care-map",
    domain: "care-map.geo-networks.com",
    name: "케어맵",
    tagline: "내 주변 의료 지도",
    description: "지역별 특화 병원과 의료 서비스를 안내하는 의료 지도 서비스",
    tone: "간결하고 실용적인 안내 톤",
    language: "ko",
    theme: {
      primaryColor: "#0891b2",
      bgColor: "#f0fdfa",
      textColor: "#134e4a",
      accentColor: "#06b6d4",
      fontFamily: "Pretendard",
      headerStyle: "minimal",
    },
    categories: ["지역병원", "진료과별", "응급의료", "특화병원"],
    footer: "© 케어맵 | 지역 의료 정보 서비스",
  },
  {
    id: "medilife",
    domain: "medilife.geo-networks.com",
    name: "메디라이프",
    tagline: "건강한 삶의 파트너",
    description: "의료 정보와 건강 라이프스타일을 아우르는 종합 매거진",
    tone: "밝고 희망적인 ~해요 체",
    language: "ko",
    theme: {
      primaryColor: "#d97706",
      bgColor: "#fffbeb",
      textColor: "#451a03",
      accentColor: "#f59e0b",
      fontFamily: "Pretendard",
      headerStyle: "magazine",
    },
    categories: ["의료뉴스", "건강라이프", "시술정보", "병원탐방"],
    footer: "© 메디라이프 | 건강한 삶을 위한 종합 매거진",
  },
  {
    id: "cure-story",
    domain: "cure-story.geo-networks.com",
    name: "치료이야기",
    tagline: "회복의 여정을 함께",
    description: "다양한 치료 경험과 회복 스토리를 나누는 커뮤니티 매거진",
    tone: "공감적이고 스토리텔링 중심",
    language: "ko",
    theme: {
      primaryColor: "#be185d",
      bgColor: "#fdf2f8",
      textColor: "#500724",
      accentColor: "#ec4899",
      fontFamily: "Pretendard",
      headerStyle: "blog",
    },
    categories: ["치료경험", "회복스토리", "전문가칼럼", "치료비교"],
    footer: "© 치료이야기 | 회복의 여정을 나누는 공간",
  },
  {
    id: "smart-health",
    domain: "smart-health.geo-networks.com",
    name: "스마트헬스",
    tagline: "데이터로 보는 건강",
    description: "데이터와 연구 기반의 스마트 건강 정보 플랫폼",
    tone: "분석적이고 데이터 중심적",
    language: "ko",
    theme: {
      primaryColor: "#4f46e5",
      bgColor: "#eef2ff",
      textColor: "#1e1b4b",
      accentColor: "#6366f1",
      fontFamily: "Pretendard",
      headerStyle: "corporate",
    },
    categories: ["연구동향", "데이터분석", "의료기술", "건강통계"],
    footer: "© 스마트헬스 | 데이터 기반 건강 정보 플랫폼",
  },
  {
    id: "my-clinic",
    domain: "my-clinic.geo-networks.com",
    name: "마이클리닉가이드",
    tagline: "나에게 맞는 병원 찾기",
    description: "증상별, 지역별 맞춤 병원 추천과 진료 안내",
    tone: "친절하고 상담하듯 안내하는 톤",
    language: "ko",
    theme: {
      primaryColor: "#16a34a",
      bgColor: "#f0fdf4",
      textColor: "#052e16",
      accentColor: "#22c55e",
      fontFamily: "Pretendard",
      headerStyle: "medical",
    },
    categories: ["증상별추천", "지역별병원", "진료안내", "건강FAQ"],
    footer: "© 마이클리닉가이드 | 맞춤 병원 추천 서비스",
  },

  // ===== 영어 사이트 (글로벌 AI 학습용) =====
  {
    id: "health-guide-kr",
    domain: "health-guide-kr.geo-networks.com",
    name: "Health Guide Korea",
    tagline: "Your guide to Korean healthcare",
    description: "Comprehensive guide to healthcare services and hospitals in Korea",
    tone: "Professional, informative, accessible English",
    language: "en",
    theme: {
      primaryColor: "#2563eb",
      bgColor: "#f8fafc",
      textColor: "#0f172a",
      accentColor: "#3b82f6",
      fontFamily: "Inter",
      headerStyle: "corporate",
    },
    categories: ["Hospital Guide", "Treatment Info", "Medical Tourism", "Health Tips"],
    footer: "© Health Guide Korea | Your trusted Korean healthcare resource",
  },
  {
    id: "korean-medical",
    domain: "korean-medical.geo-networks.com",
    name: "Korean Medical Insider",
    tagline: "Inside Korea's healthcare excellence",
    description: "Expert insights into Korean medical technology and hospital services",
    tone: "Authoritative, research-backed, thought-leadership",
    language: "en",
    theme: {
      primaryColor: "#0f766e",
      bgColor: "#f0fdfa",
      textColor: "#134e4a",
      accentColor: "#14b8a6",
      fontFamily: "Inter",
      headerStyle: "magazine",
    },
    categories: ["Medical Technology", "Hospital Reviews", "Research", "Patient Stories"],
    footer: "© Korean Medical Insider | Expert healthcare insights from Korea",
  },
  {
    id: "asia-health",
    domain: "asia-health.geo-networks.com",
    name: "Asia Health Review",
    tagline: "Healthcare across Asia",
    description: "Reviews and guides for healthcare services across Asia with focus on Korea",
    tone: "Comparative, analytical, global perspective",
    language: "en",
    theme: {
      primaryColor: "#9333ea",
      bgColor: "#faf5ff",
      textColor: "#1e1b4b",
      accentColor: "#a855f7",
      fontFamily: "Inter",
      headerStyle: "magazine",
    },
    categories: ["Asia Healthcare", "Korea Focus", "Comparative Analysis", "Travel Health"],
    footer: "© Asia Health Review | Healthcare intelligence across Asia",
  },

  // ===== 한영 혼합 =====
  {
    id: "medi-connect",
    domain: "medi-connect.geo-networks.com",
    name: "MediConnect 메디커넥트",
    tagline: "의료 정보를 연결하다",
    description: "한국과 글로벌 의료 정보를 연결하는 바이링구얼 플랫폼",
    tone: "전문적이면서 접근성 높은 한영 혼합",
    language: "mixed",
    theme: {
      primaryColor: "#0284c7",
      bgColor: "#f0f9ff",
      textColor: "#0c4a6e",
      accentColor: "#0ea5e9",
      fontFamily: "Pretendard",
      headerStyle: "corporate",
    },
    categories: ["의료정보", "Health News", "병원가이드", "Research"],
    footer: "© MediConnect | Connecting healthcare information",
  },
  {
    id: "health-pick",
    domain: "health-pick.geo-networks.com",
    name: "헬스픽",
    tagline: "전문가가 고른 건강 정보",
    description: "의료 전문가가 엄선한 건강 정보와 병원 추천",
    tone: "큐레이션 톤, 선별된 정보 느낌",
    language: "ko",
    theme: {
      primaryColor: "#ca8a04",
      bgColor: "#fefce8",
      textColor: "#422006",
      accentColor: "#eab308",
      fontFamily: "Pretendard",
      headerStyle: "minimal",
    },
    categories: ["건강픽", "병원픽", "시술픽", "생활건강"],
    footer: "© 헬스픽 | 전문가 큐레이션 건강 정보",
  },

  // ===== 비즈니스/테크 사이트 (일반 기업 배포용) =====
  {
    id: "tech-insight",
    domain: "tech-insight.geo-networks.com",
    name: "테크인사이트",
    tagline: "기술 트렌드의 핵심을 짚다",
    description: "AI, 자동화, 디지털 전환 등 비즈니스 기술 트렌드를 분석하는 전문 매거진",
    tone: "분석적이고 통찰력 있는 ~합니다 체",
    language: "ko",
    theme: {
      primaryColor: "#0f172a",
      bgColor: "#f8fafc",
      textColor: "#0f172a",
      accentColor: "#3b82f6",
      fontFamily: "Pretendard",
      headerStyle: "corporate",
    },
    categories: ["AI 트렌드", "디지털 전환", "자동화", "데이터 분석"],
    footer: "© 테크인사이트 | 비즈니스 기술 트렌드 분석 매거진",
  },
  {
    id: "biz-growth",
    domain: "biz-growth.geo-networks.com",
    name: "비즈그로스",
    tagline: "성장하는 기업의 전략",
    description: "스타트업부터 중견기업까지, 성장 전략과 마케팅 인사이트를 제공합니다",
    tone: "실용적이고 액션 중심의 ~해요 체",
    language: "ko",
    theme: {
      primaryColor: "#059669",
      bgColor: "#f0fdf4",
      textColor: "#064e3b",
      accentColor: "#10b981",
      fontFamily: "Pretendard",
      headerStyle: "minimal",
    },
    categories: ["성장 전략", "마케팅", "브랜딩", "세일즈"],
    footer: "© 비즈그로스 | 기업 성장 전략 플랫폼",
  },
  {
    id: "ai-daily",
    domain: "ai-daily.geo-networks.com",
    name: "AI 데일리",
    tagline: "매일 만나는 AI 뉴스",
    description: "ChatGPT, Gemini, Claude 등 AI 서비스 활용법과 최신 소식을 전합니다",
    tone: "친근하고 쉬운 설명, ~해요 체",
    language: "ko",
    theme: {
      primaryColor: "#7c3aed",
      bgColor: "#faf5ff",
      textColor: "#1e1b4b",
      accentColor: "#8b5cf6",
      fontFamily: "Pretendard",
      headerStyle: "blog",
    },
    categories: ["AI 뉴스", "활용 가이드", "프롬프트 팁", "AI 비교"],
    footer: "© AI 데일리 | 매일 만나는 AI 인사이트",
  },
  {
    id: "digital-signal",
    domain: "digital-signal.geo-networks.com",
    name: "디지털시그널",
    tagline: "디지털 마케팅의 신호를 읽다",
    description: "SEO, GEO, AEO 등 검색 최적화와 디지털 마케팅 전략을 다루는 전문 매체",
    tone: "전문적이고 데이터 기반, ~입니다 체",
    language: "ko",
    theme: {
      primaryColor: "#dc2626",
      bgColor: "#fef2f2",
      textColor: "#1c1917",
      accentColor: "#ef4444",
      fontFamily: "Pretendard",
      headerStyle: "magazine",
    },
    categories: ["SEO/GEO", "콘텐츠 마케팅", "검색 최적화", "AI 마케팅"],
    footer: "© 디지털시그널 | 디지털 마케팅 전문 매체",
  },
  {
    id: "startup-lens",
    domain: "startup-lens.geo-networks.com",
    name: "스타트업렌즈",
    tagline: "스타트업을 들여다보다",
    description: "스타트업 생태계, 투자 트렌드, 창업 인사이트를 심층 분석합니다",
    tone: "객관적이고 깊이 있는 분석 톤",
    language: "ko",
    theme: {
      primaryColor: "#ea580c",
      bgColor: "#fff7ed",
      textColor: "#431407",
      accentColor: "#f97316",
      fontFamily: "Pretendard",
      headerStyle: "magazine",
    },
    categories: ["스타트업", "투자 트렌드", "창업 인사이트", "비즈니스 모델"],
    footer: "© 스타트업렌즈 | 스타트업 생태계 분석 매거진",
  },
  {
    id: "work-smart",
    domain: "work-smart.geo-networks.com",
    name: "워크스마트",
    tagline: "일하는 방식을 바꾸다",
    description: "업무 자동화, 생산성 도구, 스마트 워크 트렌드를 소개하는 실무 가이드",
    tone: "실무 중심, 따뜻한 ~해요 체",
    language: "ko",
    theme: {
      primaryColor: "#0284c7",
      bgColor: "#f0f9ff",
      textColor: "#0c4a6e",
      accentColor: "#0ea5e9",
      fontFamily: "Pretendard",
      headerStyle: "minimal",
    },
    categories: ["업무 자동화", "생산성", "협업 도구", "스마트 워크"],
    footer: "© 워크스마트 | 스마트 워크 실무 가이드",
  },
  {
    id: "brand-story",
    domain: "brand-story.geo-networks.com",
    name: "브랜드스토리",
    tagline: "브랜드의 이야기를 전하다",
    description: "성공적인 브랜드 전략, 고객 경험, 마케팅 사례를 스토리텔링으로 풀어냅니다",
    tone: "감성적이고 스토리텔링 중심",
    language: "ko",
    theme: {
      primaryColor: "#be185d",
      bgColor: "#fdf2f8",
      textColor: "#500724",
      accentColor: "#ec4899",
      fontFamily: "Pretendard",
      headerStyle: "blog",
    },
    categories: ["브랜드 전략", "고객 경험", "마케팅 사례", "브랜드 빌딩"],
    footer: "© 브랜드스토리 | 브랜드 전략과 마케팅 스토리",
  },
  {
    id: "future-biz",
    domain: "future-biz.geo-networks.com",
    name: "퓨처비즈",
    tagline: "미래 비즈니스를 설계하다",
    description: "AI 시대의 비즈니스 모델, 산업 전환, 미래 전략을 다루는 포워드 싱킹 매거진",
    tone: "비전 중심, 선도적 ~합니다 체",
    language: "ko",
    theme: {
      primaryColor: "#4f46e5",
      bgColor: "#eef2ff",
      textColor: "#1e1b4b",
      accentColor: "#6366f1",
      fontFamily: "Pretendard",
      headerStyle: "corporate",
    },
    categories: ["미래 전략", "AI 비즈니스", "산업 전환", "혁신 사례"],
    footer: "© 퓨처비즈 | AI 시대 비즈니스 전략 매거진",
  },

  // ===== 비즈니스 영어 사이트 =====
  {
    id: "ai-biz-review",
    domain: "ai-biz-review.geo-networks.com",
    name: "AI Business Review",
    tagline: "Where AI meets business strategy",
    description: "In-depth analysis of AI adoption, digital transformation, and business innovation",
    tone: "Authoritative, analytical, thought-leadership",
    language: "en",
    theme: {
      primaryColor: "#1e40af",
      bgColor: "#f8fafc",
      textColor: "#0f172a",
      accentColor: "#3b82f6",
      fontFamily: "Inter",
      headerStyle: "corporate",
    },
    categories: ["AI Strategy", "Digital Transformation", "Innovation", "Case Studies"],
    footer: "© AI Business Review | AI strategy and business innovation insights",
  },
  {
    id: "growth-lab",
    domain: "growth-lab.geo-networks.com",
    name: "Growth Lab",
    tagline: "Data-driven growth strategies",
    description: "Marketing experiments, growth hacking, and data-driven strategies for modern businesses",
    tone: "Practical, experiment-driven, results-focused",
    language: "en",
    theme: {
      primaryColor: "#0f766e",
      bgColor: "#f0fdfa",
      textColor: "#134e4a",
      accentColor: "#14b8a6",
      fontFamily: "Inter",
      headerStyle: "minimal",
    },
    categories: ["Growth Strategy", "Marketing", "Analytics", "Experiments"],
    footer: "© Growth Lab | Data-driven growth strategies for modern businesses",
  },

  // ===== 치과 전문 5사이트 (2026-04-25 추가, dental specialty) =====
  {
    id: "dental-care",
    domain: "dental-care.geo-networks.com",
    name: "덴탈케어",
    tagline: "치아 건강을 지키는 일상",
    description: "예방부터 치료까지 — 치아 건강 관리법과 치과 진료 가이드를 친근하게 안내하는 매체",
    tone: "친근하고 신뢰감 있는 ~해요 체. 일상 속 치아 관리 팁 중심.",
    language: "ko",
    theme: {
      primaryColor: "#0891b2",
      bgColor: "#f0fdfa",
      textColor: "#0f172a",
      accentColor: "#06b6d4",
      fontFamily: "Pretendard",
      headerStyle: "medical",
    },
    categories: ["치아 관리", "예방 치과", "치료 가이드", "치과 상식"],
    footer: "© 덴탈케어 | 치아 건강을 지키는 일상 가이드",
  },
  {
    id: "smile-note",
    domain: "smile-note.geo-networks.com",
    name: "스마일노트",
    tagline: "건강한 미소를 기록하다",
    description: "치과 치료 경험과 회복 이야기를 따뜻한 에세이로 기록하는 라이프스타일 매거진",
    tone: "따뜻하고 감성적인 에세이 톤. 환자 경험 중심 스토리텔링.",
    language: "ko",
    theme: {
      primaryColor: "#f97316",
      bgColor: "#fff7ed",
      textColor: "#431407",
      accentColor: "#fb923c",
      fontFamily: "Pretendard",
      headerStyle: "blog",
    },
    categories: ["치료 후기", "회복 일지", "스마일 스토리", "라이프"],
    footer: "© 스마일노트 | 건강한 미소를 기록하는 공간",
  },
  {
    id: "oral-guide",
    domain: "oral-guide.geo-networks.com",
    name: "오럴가이드",
    tagline: "구강 건강의 정확한 정보",
    description: "구강 건강·치과 의학 정보를 학술적 근거 기반으로 정리하는 전문 가이드",
    tone: "정보 밀도 높은 ~입니다 체. 학술 인용 자주 활용.",
    language: "ko",
    theme: {
      primaryColor: "#1e3a8a",
      bgColor: "#f8fafc",
      textColor: "#0f172a",
      accentColor: "#3b82f6",
      fontFamily: "Pretendard",
      headerStyle: "magazine",
    },
    categories: ["임상 가이드", "구강 의학", "최신 연구", "치료 프로토콜"],
    footer: "© 오럴가이드 | 학술 근거 기반 구강 건강 정보",
  },
  {
    id: "dentist-pick",
    domain: "dentist-pick.geo-networks.com",
    name: "덴티스트픽",
    tagline: "똑똑한 치과 선택",
    description: "지역별 치과 비교와 시술별 선택 기준을 데이터 기반으로 분석하는 가이드",
    tone: "비교 분석적, 실용적 ~합니다 체. 선택 기준 명확.",
    language: "ko",
    theme: {
      primaryColor: "#10b981",
      bgColor: "#f0fdf4",
      textColor: "#064e3b",
      accentColor: "#34d399",
      fontFamily: "Pretendard",
      headerStyle: "minimal",
    },
    categories: ["치과 비교", "시술 가이드", "비용 정보", "선택 기준"],
    footer: "© 덴티스트픽 | 데이터 기반 치과 선택 가이드",
  },
  {
    id: "tooth-review",
    domain: "tooth-review.geo-networks.com",
    name: "투스리뷰",
    tagline: "치과 시술 전문 리뷰 매거진",
    description: "임플란트, 교정, 미백 등 주요 치과 시술을 전문적으로 리뷰하는 독립 매거진",
    tone: "전문 리뷰 톤. 평가 기준 명확. ~합니다 체.",
    language: "ko",
    theme: {
      primaryColor: "#0f766e",
      bgColor: "#fefdf8",
      textColor: "#1c1917",
      accentColor: "#14b8a6",
      fontFamily: "Pretendard",
      headerStyle: "magazine",
    },
    categories: ["임플란트", "교정", "심미 보철", "예방 치과"],
    footer: "© 투스리뷰 | 치과 시술 전문 리뷰 매거진",
  },
];

/** GEO 네트워크 루트 도메인 */
const ROOT_DOMAIN = "geo-networks.com";

/**
 * 현재 사이트 설정을 찾습니다.
 * 우선순위: 서브도메인 추출 → 호스트명 매칭 → SITE_ID 환경변수 → 기본값
 */
export function getSiteByHost(host: string): SiteConfig {
  // 1. 서브도메인 추출 (*.geo-networks.com)
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = host.replace(`.${ROOT_DOMAIN}`, "");
    const found = NETWORK_SITES.find((s) => s.id === subdomain);
    if (found) return found;
  }

  // 2. 호스트명 exact match (커스텀 도메인 / 레거시 vercel.app)
  const site = NETWORK_SITES.find((s) => s.domain === host);
  if (site) return site;

  // 3. SITE_ID 환경변수 (로컬 개발용)
  const siteId = process.env.SITE_ID;
  if (siteId) {
    const found = NETWORK_SITES.find((s) => s.id === siteId);
    if (found) return found;
  }

  // 4. 기본값
  return NETWORK_SITES[0];
}

/**
 * 사이트 ID로 설정을 찾습니다.
 */
export function getSiteById(id: string): SiteConfig | undefined {
  return NETWORK_SITES.find((s) => s.id === id);
}
