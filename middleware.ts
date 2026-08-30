import { NextResponse, type NextRequest } from "next/server";

// Tells the root layout which locale a request is for so <html lang> is
// right for /ko/… and /ja/… pages. Everything else stays English.
export function middleware(req: NextRequest) {
  const m = /^\/(ko|ja)(\/|$)/.exec(req.nextUrl.pathname);
  const headers = new Headers(req.headers);
  headers.set("x-lang", m ? m[1] : "en");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
