import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { hasPermission } from "@/lib/auth/permissions";
import { SESSION_COOKIE, parseSession } from "@/lib/auth/session";

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

  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isPublic = publicPaths.has(pathname);

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    pathname.startsWith("/admin") &&
    !hasPermission(session?.user.roles, "admin:view")
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
