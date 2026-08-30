import { NextResponse, type NextRequest } from "next/server";

// Tells the root layout which locale a request is for, so <html lang> is right
// on /ko/… and /ja/… pages. Only those prefixes are matched; everything else
// falls back to English in the layout.
export function middleware(req: NextRequest) {
  const lang = req.nextUrl.pathname.startsWith("/ko") ? "ko" : "ja";
  const headers = new Headers(req.headers);
  headers.set("x-lang", lang);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/ko", "/ko/:path*", "/ja", "/ja/:path*"],
};
