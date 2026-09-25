import { NextResponse } from "next/server";

import {
  clearAuthCookies,
  readRefreshUser,
} from "@/app/api/auth/session-cookie";
import { env } from "@/env/server";
import {
  ACCESS_COOKIE,
  ACCESS_TTL_SECONDS,
  createToken,
} from "@/lib/auth/session";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
}

function setAccessCookie(
  response: NextResponse,
  user: Parameters<typeof createToken>[0]
) {
  response.cookies.set(
    ACCESS_COOKIE,
    createToken(user, "access", ACCESS_TTL_SECONDS),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: ACCESS_TTL_SECONDS,
    }
  );
  return response;
}

export async function POST() {
  const user = await readRefreshUser();
  if (!user) {
    return clearAuthCookies(
      NextResponse.json({ message: "Session expired" }, { status: 401 })
    );
  }

  return setAccessCookie(NextResponse.json({ user }), user);
}

export async function GET(request: Request) {
  const nextPath = safeNextPath(new URL(request.url).searchParams.get("next"));
  const user = await readRefreshUser();

  if (!user) {
    return clearAuthCookies(
      NextResponse.redirect(new URL("/login", request.url))
    );
  }

  return setAccessCookie(
    NextResponse.redirect(new URL(nextPath, request.url)),
    user
  );
}
