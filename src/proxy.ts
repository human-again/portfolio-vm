import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page through — otherwise we get a redirect loop
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // NextAuth v5 sets one of these two cookie names depending on environment:
  // - "authjs.session-token"          (http, dev)
  // - "__Secure-authjs.session-token" (https, prod)
  const sessionToken =
    req.cookies.get("__Secure-authjs.session-token") ??
    req.cookies.get("authjs.session-token");

  if (!sessionToken) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
