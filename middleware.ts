import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "www.ischiamotion.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.replace(/:\d+$/, "") || "";

  if (host !== CANONICAL_HOST && host.endsWith("ischiamotion.com")) {
    const url = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      `https://${CANONICAL_HOST}`
    );
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)"]
};
