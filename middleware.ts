import { NextResponse, type NextRequest } from "next/server";
import { universeEntry } from "./lib/universe";

// Tells the root layout which locale a request is for, so <html lang> is right
// on /ko/… and /ja/… pages. Only those prefixes are matched; everything else
// falls back to English in the layout.
//
// Also redirects the bare 4-digit Japanese ticker form (/quote/7203,
// /quote/7203.jp) to the canonical .T symbol — resolved against UNIVERSE,
// not pattern-matched, so a made-up 4-digit code 404s instead of "resolving"
// to a .T symbol that doesn't exist (that would just trade one soft-404
// family for another).
const JP_CODE_RE = /^\/quote\/(\d{4})(?:\.jp)?$/i;

function jpRedirectTarget(pathname: string, prefix: string): string | null {
  if (!pathname.startsWith(prefix)) return null;
  const rest = pathname.slice(prefix.length);
  const m = JP_CODE_RE.exec(rest);
  if (!m) return null;
  const canonical = `${m[1]}.T`;
  return universeEntry(canonical) ? `${prefix}/quote/${canonical}` : null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  for (const prefix of ["", "/ko", "/ja"]) {
    const target = jpRedirectTarget(pathname, prefix);
    if (target) {
      const url = req.nextUrl.clone();
      url.pathname = target;
      return NextResponse.redirect(url, 308);
    }
  }

  if (pathname.startsWith("/ko") || pathname.startsWith("/ja")) {
    const lang = pathname.startsWith("/ko") ? "ko" : "ja";
    const headers = new Headers(req.headers);
    headers.set("x-lang", lang);
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ko", "/ko/:path*", "/ja", "/ja/:path*", "/quote/:path*"],
};
