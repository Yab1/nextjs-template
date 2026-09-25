import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/app/api/auth/session-cookie";

export async function POST() {
  return clearAuthCookies(NextResponse.json({ ok: true }));
}
