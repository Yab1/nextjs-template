import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/app/api/auth/session-cookie";
import { callBackend, upstreamFailure } from "@/lib/api/backend";
import { backendEndpoints } from "@/lib/api/endpoints";

export async function POST() {
  const upstream = await callBackend(backendEndpoints.logout);
  if (upstream && !upstream.ok) {
    return upstreamFailure(upstream);
  }

  return clearAuthCookies(NextResponse.json({ ok: true }));
}
