// geo-network는 lucide-react/MaterialIcon 미설치 — inline SVG로 아이콘 제공.
import type { SVGProps } from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowRight(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function ChevronDown(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronRight(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ExternalLink(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}
