import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCK_COOKIE_NAME, LOCK_COOKIE_VALUE } from "@/lib/site-lock";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAccess =
    request.cookies.get(LOCK_COOKIE_NAME)?.value === LOCK_COOKIE_VALUE;

  if (hasAccess) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/locked";
  url.search = "";
  if (pathname !== "/locked") {
    url.searchParams.set("from", pathname);
  }
  return NextResponse.redirect(url);
}

export const config = {
  // Run on every route except the lock page itself, its assets, and
  // Next's own internals — those must stay reachable or the gate can
  // never be passed. `images/` is excluded wholesale (not just
  // lock-bg.webp) because next/image's optimizer fetches source files
  // like /images/404-graphic.webp server-side, without the visitor's
  // cookie, so a narrower exclusion would 307 those internal fetches
  // and silently break the image.
  matcher: [
    "/((?!locked|_next|favicon.ico|images/).*)",
  ],
};
