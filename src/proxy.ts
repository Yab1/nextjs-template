import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { hasPermission } from "@/lib/auth/permissions";
import { ACCESS_COOKIE, REFRESH_COOKIE, readToken } from "@/lib/auth/session";

const publicPaths = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/health")) {
    return NextResponse.next();
  }

  const access = readToken(request.cookies.get(ACCESS_COOKIE)?.value, "access");
  const refresh = readToken(
    request.cookies.get(REFRESH_COOKIE)?.value,
    "refresh"
  );
  const isPublic = publicPaths.has(pathname);

  if (!access && refresh && !isPublic) {
    const refreshUrl = new URL("/api/auth/refresh", request.url);
    refreshUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  if (!access && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (access && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    pathname.startsWith("/admin") &&
    !hasPermission(access?.roles, "admin:view")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
