/**
 * brand.website_url 같은 사용자/DB 입력을 안전하게 외부 URL로 검증.
 * - scheme 없는 host(`seouloncare.co.kr`) → https:// 보정
 * - http/https 외 scheme(`mailto:`, `javascript:`, `tel:`, `ftp:` 등) → null
 * - `://` 형태인데 RFC scheme 호환성 안 맞아도(예: `ht!tp://`) http(s) 아니면 null
 * - malformed URL → null (throw 안 함)
 * - 자기 자신 host → null (www. normalize 포함)
 */
export function safeExternalUrl(
  input: string | null | undefined,
  currentSiteUrl: string,
): string | null {
  if (!input) return null;
  let candidate = String(input).trim();
  if (!candidate) return null;

  // 1차 가드: `://` 형태는 http(s) 외 모두 거부.
  if (/^[^:/?#\s]+:\/\//.test(candidate) && !/^https?:\/\//i.test(candidate)) {
    return null;
  }
  // 2차 가드: RFC-conform scheme이 비http(s)면 거부 (mailto/tel/data 등).
  const hasScheme = /^[a-z][a-z0-9+.\-]*:/i.test(candidate);
  if (hasScheme && !/^https?:\/\//i.test(candidate)) return null;
  if (!hasScheme) candidate = "https://" + candidate;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

  try {
    const current = new URL(currentSiteUrl);
    if (normalizeHost(parsed.host) === normalizeHost(current.host)) return null;
  } catch {
    // currentSiteUrl 깨졌으면 외부 host인 한 통과
  }
  return parsed.toString();
}

/** www. 접두사 제거 + lowercase. `www.example.com` ↔ `example.com` 동치. */
function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}
