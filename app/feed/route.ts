import { NextResponse } from "next/server";

/**
 * GET /feed → /rss.xml 로 리다이렉트
 * 네이버 서치 어드바이저 호환용
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.redirect(`${url.origin}/rss.xml`, 301);
}
