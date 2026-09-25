import { NextResponse } from "next/server";

import { env } from "@/env/server";
import type { BackendEndpoint } from "@/lib/api/endpoints";

export function backendUrl(path: BackendEndpoint) {
  if (!env.API_URL) {
    return null;
  }

  return `${env.API_URL.replace(/\/$/, "")}${path}`;
}

export async function callBackend(
  path: BackendEndpoint,
  init: { method?: string; body?: unknown } = {}
) {
  const url = backendUrl(path);
  if (!url) {
    return null;
  }

  return fetch(url, {
    method: init.method ?? "POST",
    headers:
      init.body === undefined
        ? undefined
        : { "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
}

export async function upstreamFailure(upstream: Response) {
  const body = (await upstream.json().catch(() => null)) as {
    message?: string;
  } | null;

  return NextResponse.json(
    { message: body?.message ?? "Request failed" },
    { status: upstream.status }
  );
}
