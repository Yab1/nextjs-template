import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/env/server";
import {
  ACCESS_COOKIE,
  ACCESS_EXPIRES_COOKIE,
  ACCESS_TTL_SECONDS,
  REFRESH_COOKIE,
  REFRESH_TTL_SECONDS,
  createToken,
  readToken,
} from "@/lib/auth/session";
import type { Session, SessionUser } from "@/lib/auth/types";

function cookieBase(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function readAccessSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const user = readToken(cookieStore.get(ACCESS_COOKIE)?.value, "access");
  return user ? { user } : null;
}

export async function readRefreshUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  return readToken(cookieStore.get(REFRESH_COOKIE)?.value, "refresh");
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", cookieBase(0));
  response.cookies.set(REFRESH_COOKIE, "", cookieBase(0));
  response.cookies.set(ACCESS_EXPIRES_COOKIE, "", cookieBase(0));
  return response;
}

export function setAccessCookie(response: NextResponse, user: SessionUser) {
  const expiresAt = Math.floor(Date.now() / 1000) + ACCESS_TTL_SECONDS;
  response.cookies.set(
    ACCESS_COOKIE,
    createToken(user, "access", ACCESS_TTL_SECONDS),
    cookieBase(ACCESS_TTL_SECONDS)
  );
  response.cookies.set(ACCESS_EXPIRES_COOKIE, String(expiresAt), {
    ...cookieBase(ACCESS_TTL_SECONDS),
    httpOnly: false,
  });
  return response;
}

export function sessionResponse(session: Session) {
  const response = setAccessCookie(NextResponse.json(session), session.user);
  response.cookies.set(
    REFRESH_COOKIE,
    createToken(session.user, "refresh", REFRESH_TTL_SECONDS),
    cookieBase(REFRESH_TTL_SECONDS)
  );
  return response;
}
