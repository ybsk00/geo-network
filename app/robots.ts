import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isKnownGeoNetworkHost } from "@/lib/sites";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get("x-geo-host") ?? h.get("host") ?? "";

  // Unknown wildcard subdomain — 미들웨어가 보통 차단하지만 build time fallback으로 disallow
  if (host && !isKnownGeoNetworkHost(host)) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // ── OpenAI ── 검색 노출(OAI-SearchBot) / 사용자(ChatGPT-User) / 학습(GPTBot) 분리
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      // ── Anthropic / Claude ──
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      // ── Google (Gemini / AI Overviews / NotebookLM) ──
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
      { userAgent: "Google-NotebookLM", allow: "/" },
      // ── Microsoft / Bing ──
      { userAgent: "Bingbot", allow: "/" },
      // ── Perplexity ──
      { userAgent: "PerplexityBot", allow: "/" },
      // ── Apple Intelligence ──
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      // ── DuckDuckGo Assist ──
      { userAgent: "DuckAssistBot", allow: "/" },
      // ── Common Crawl (LLM 학습) ──
      { userAgent: "CCBot", allow: "/" },
      // ── Meta AI ──
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Meta-ExternalFetcher", allow: "/" },
      // ── 기타 ──
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
    ],
    sitemap: `https://${host}/sitemap.xml`,
  };
}
