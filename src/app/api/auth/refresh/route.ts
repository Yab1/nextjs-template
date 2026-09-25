import { NextResponse } from "next/server";

import {
  clearAuthCookies,
  readRefreshUser,
  setAccessCookie,
} from "@/app/api/auth/session-cookie";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
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
