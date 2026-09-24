import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { env } from "@/env/server";
import { SESSION_COOKIE, parseSession } from "@/lib/auth/session";
import type { Session } from "@/lib/auth/types";

export async function readSession() {
  const cookieStore = await cookies();
  return parseSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export function sessionResponse(session: Session | null, status = 200) {
  const response = NextResponse.json(session, { status });
  if (!session) {
    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  response.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
